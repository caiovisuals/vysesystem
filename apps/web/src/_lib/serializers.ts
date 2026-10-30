import "server-only"
import { Client, Company, Employee, Product, Sale, Supplier } from "@vysesystem/types"
import type { Prisma } from "@/generated/prisma/client"

// Converte os modelos do Prisma (Decimal, null) para os tipos compartilhados de @vysesystem/types

export function toCompany(company: Prisma.CompanyModel): Company {
    return {
        id: company.id,
        name: company.name,
        image: company.image,
        cnpj: company.cnpj,
        address: company.address,
        phone: company.phone,
        status: company.status,
        createdAt: company.createdAt.toISOString(),
    }
}

export function toClient(client: Prisma.ClientModel): Client {
    return {
        id: client.id,
        name: client.name,
        phone: client.phone,
        cpf: client.cpf ?? undefined,
        cnpj: client.cnpj ?? undefined,
        address: client.address,
        neighborhood: client.neighborhood,
        email: client.email,
        tag: client.tag,
    }
}

export function toProduct(product: Prisma.ProductModel): Product {
    return {
        id: product.id,
        code: product.code,
        name: product.name,
        finalPrice: Number(product.finalPrice),
        unitCost: Number(product.unitCost),
        quantityInStock: product.quantityInStock,
        weight: Number(product.weight),
        createdAt: product.createdAt,
    }
}

export function toEmployee(employee: Prisma.EmployeeModel): Employee {
    return {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        salary: Number(employee.salary),
        role: employee.role,
        hireDate: employee.hireDate,
        workShift: employee.workShift ?? undefined,
    }
}

export function toSupplier(supplier: Prisma.SupplierModel): Supplier {
    return {
        id: supplier.id,
        name: supplier.name,
        cnpj: supplier.cnpj ?? undefined,
        email: supplier.email ?? undefined,
        phone: supplier.phone ?? undefined,
    }
}

export const saleInclude = {
    items: true,
    cashier: { select: { name: true } },
    customer: { select: { name: true } },
} satisfies Prisma.SaleInclude

type SaleWithRelations = Prisma.SaleGetPayload<{ include: typeof saleInclude }>

export function toSale(sale: SaleWithRelations): Sale {
    return {
        id: sale.id,
        number: sale.number,
        subtotal: Number(sale.subtotal),
        discount: Number(sale.discount),
        total: Number(sale.total),
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        cashierId: sale.cashierId ?? "",
        cashierName: sale.cashierName ?? sale.cashier?.name ?? undefined,
        customerId: sale.customerId ?? undefined,
        customerName: sale.customerName ?? sale.customer?.name ?? undefined,
        createdAt: sale.createdAt,
        items: sale.items.map(item => ({
            productId: item.productId ?? "",
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            total: Number(item.total),
        })),
    }
}