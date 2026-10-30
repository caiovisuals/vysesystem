// Popula o banco com os dados de demonstração de src/_mocks.
// Roda com `npm run db:seed` (e automaticamente após `npm run db:reset`).
import { loadEnvConfig } from "@next/env"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"
import { hashPassword } from "../src/_lib/password"
import { companys } from "../src/_mocks/companys"
import { users } from "../src/_mocks/user"
import { clients } from "../src/_mocks/clients"
import { products } from "../src/_mocks/products"
import { employees } from "../src/_mocks/employees"
import { suppliers } from "../src/_mocks/suppliers"
import { sales } from "../src/_mocks/sales"

loadEnvConfig(process.cwd())

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

const DEMO_PASSWORD = "12345678"
const DAY = 24 * 60 * 60 * 1000

async function main() {
    if (await prisma.user.count() > 0) {
        console.log("O banco já tem dados; seed ignorado. Use `npm run db:reset` para recriar.")
        return
    }

    for (const company of companys) {
        await prisma.company.create({
            data: { ...company, createdAt: new Date(company.createdAt) },
        })
    }

    const password = await hashPassword(DEMO_PASSWORD)
    for (const user of users) {
        await prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                image: user.image,
                password,
                activeCompanyId: user.activeCompanyId,
                companies: { connect: user.companies.map(c => ({ id: c.id })) },
            },
        })
    }

    // Os cadastros de demonstração ficam na primeira empresa
    const companyId = companys[0].id
    const ids = (prefix: string, id: string) => `${prefix}-${id}`

    await prisma.client.createMany({
        data: clients.map(c => ({ ...c, id: ids("client", c.id), companyId })),
    })
    await prisma.product.createMany({
        data: products.map(p => ({ ...p, id: ids("product", p.id), code: Number(p.id), companyId })),
    })
    await prisma.employee.createMany({
        data: employees.map(e => ({ ...e, id: ids("employee", e.id), companyId })),
    })
    await prisma.supplier.createMany({
        data: suppliers.map(s => ({ ...s, id: ids("supplier", s.id), companyId })),
    })

    // Espalha as vendas pelos últimos dias para o relatório ter dados de hoje/semana/mês
    const now = Date.now()
    for (const [index, sale] of sales.entries()) {
        const cashier = employees.find(e => e.id === sale.cashierId)
        const customer = clients.find(c => c.id === sale.customerId)
        await prisma.sale.create({
            data: {
                companyId,
                subtotal: sale.subtotal,
                discount: sale.discount ?? 0,
                total: sale.total,
                paymentMethod: sale.paymentMethod,
                status: sale.status,
                cashierId: cashier ? ids("employee", cashier.id) : null,
                cashierName: cashier?.name,
                customerId: customer ? ids("client", customer.id) : null,
                customerName: customer?.name,
                createdAt: new Date(now - index * 2 * DAY - index * 37 * 60 * 1000),
                items: {
                    create: sale.items.map(item => ({
                        productId: ids("product", item.productId),
                        productName: item.productName,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.total,
                    })),
                },
            },
        })
    }

    console.log(`Seed concluído. Entre com o usuário "${users[0].username}" e a senha "${DEMO_PASSWORD}".`)
}

main()
    .catch(error => {
        console.error(error)
        process.exitCode = 1
    })
    .finally(() => prisma.$disconnect())