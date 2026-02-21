"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Client } from "@/_types/clients"
import { Product } from "@/_types/products"
import { Sale, SaleItem } from "@/_types/sales"
import { Employee } from "@/_types/employees"
import { Supplier } from "@/_types/supplier"

// Importar dados iniciais
import { clients as initialClients } from "@/_mocks/clients"
import { products as initialProducts } from "@/_mocks/products"
import { sales as initialSales } from "@/_mocks/sales"
import { employees as initialEmployees } from "@/_mocks/employees"
import { suppliers as initialSuppliers } from "@/_mocks/suppliers"

interface DataContextType {
    // Clientes
    clients: Client[]
    addClient: (client: Omit<Client, "id">) => Client
    updateClient: (id: string, data: Partial<Client>) => void
    deleteClient: (id: string) => void
    getClientById: (id: string) => Client | undefined
    
    // Produtos
    products: Product[]
    addProduct: (product: Omit<Product, "id" | "createdAt">) => Product
    updateProduct: (id: string, data: Partial<Product>) => void
    deleteProduct: (id: string) => void
    getProductById: (id: string) => Product | undefined
    updateStock: (productId: string, quantity: number) => boolean
    getLowStockProducts: (threshold?: number) => Product[]
    
    // Vendas
    sales: Sale[]
    addSale: (sale: Omit<Sale, "id" | "createdAt">) => Sale | null
    updateSale: (id: string, data: Partial<Sale>) => void
    deleteSale: (id: string) => void
    getSaleById: (id: string) => Sale | undefined
    getSalesByDateRange: (start: Date, end: Date) => Sale[]
    getSalesByCashier: (cashierId: string) => Sale[]
    getSalesByCustomer: (customerId: string) => Sale[]
    getTotalSales: (start?: Date, end?: Date) => number
    
    // Colaboradores
    employees: Employee[]
    addEmployee: (employee: Omit<Employee, "id">) => Employee
    updateEmployee: (id: string, data: Partial<Employee>) => void
    deleteEmployee: (id: string) => void
    getEmployeeById: (id: string) => Employee | undefined
    
    // Fornecedores
    suppliers: Supplier[]
    addSupplier: (supplier: Omit<Supplier, "id">) => Supplier
    updateSupplier: (id: string, data: Partial<Supplier>) => void
    deleteSupplier: (id: string) => void
    getSupplierById: (id: string) => Supplier | undefined
    
    // Estatísticas
    getDashboardStats: () => DashboardStats
}

interface DashboardStats {
    totalSalesToday: number
    totalSalesThisMonth: number
    totalClients: number
    totalProducts: number
    lowStockCount: number
    pendingSalesCount: number
    topSellingProducts: Array<{
        product: Product
        totalSold: number
        revenue: number
    }>
    topCustomers: Array<{
        client: Client
        totalPurchases: number
        totalSpent: number
    }>
    salesByEmployee: Array<{
        employee: Employee
        totalSales: number
        revenue: number
    }>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<Client[]>(initialClients)
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [sales, setSales] = useState<Sale[]>(initialSales)
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)

    // ============= CLIENTES =============
    const addClient = (client: Omit<Client, "id">): Client => {
        const newClient: Client = {
            ...client,
            id: crypto.randomUUID()
        }
        setClients(prev => [...prev, newClient])
        return newClient
    }

    const updateClient = (id: string, data: Partial<Client>) => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    }

    const deleteClient = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id))
    }

    const getClientById = (id: string) => {
        return clients.find(c => c.id === id)
    }

    // ============= PRODUTOS =============
    const addProduct = (product: Omit<Product, "id" | "createdAt">): Product => {
        const newProduct: Product = {
            ...product,
            id: crypto.randomUUID(),
            createdAt: new Date()
        }
        setProducts(prev => [...prev, newProduct])
        return newProduct
    }

    const updateProduct = (id: string, data: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    }

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    const getProductById = (id: string) => {
        return products.find(p => p.id === id)
    }

    const updateStock = (productId: string, quantity: number): boolean => {
        const product = getProductById(productId)
        if (!product) return false

        const newStock = product.quantityInStock + quantity
        if (newStock < 0) return false

        updateProduct(productId, { quantityInStock: newStock })
        return true
    }

    const getLowStockProducts = (threshold: number = 10) => {
        return products.filter(p => p.quantityInStock <= threshold)
    }

    // ============= VENDAS =============
    const addSale = (sale: Omit<Sale, "id" | "createdAt">): Sale | null => {
        // Validar estoque antes de criar venda
        for (const item of sale.items) {
            const product = getProductById(item.productId)
            if (!product || product.quantityInStock < item.quantity) {
                return null // Estoque insuficiente
            }
        }

        const newSale: Sale = {
            ...sale,
            id: crypto.randomUUID(),
            createdAt: new Date()
        }

        setSales(prev => [...prev, newSale])

        // Atualizar estoque se a venda for concluída
        if (sale.status === "COMPLETED") {
            for (const item of sale.items) {
                updateStock(item.productId, -item.quantity)
            }
        }

        return newSale
    }

    const updateSale = (id: string, data: Partial<Sale>) => {
        const sale = getSaleById(id)
        if (!sale) return

        // Se mudar status para COMPLETED, atualizar estoque
        if (sale.status === "PENDING" && data.status === "COMPLETED") {
            for (const item of sale.items) {
                const success = updateStock(item.productId, -item.quantity)
                if (!success) return // Estoque insuficiente
            }
        }

        // Se cancelar venda COMPLETED, devolver estoque
        if (sale.status === "COMPLETED" && data.status === "CANCELLED") {
            for (const item of sale.items) {
                updateStock(item.productId, item.quantity)
            }
        }

        setSales(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
    }

    const deleteSale = (id: string) => {
        const sale = getSaleById(id)
        
        // Se a venda estava concluída, devolver estoque
        if (sale && sale.status === "COMPLETED") {
            for (const item of sale.items) {
                updateStock(item.productId, item.quantity)
            }
        }

        setSales(prev => prev.filter(s => s.id !== id))
    }

    const getSaleById = (id: string) => {
        return sales.find(s => s.id === id)
    }

    const getSalesByDateRange = (start: Date, end: Date) => {
        return sales.filter(s => {
            const saleDate = new Date(s.createdAt)
            return saleDate >= start && saleDate <= end
        })
    }

    const getSalesByCashier = (cashierId: string) => {
        return sales.filter(s => s.cashierId === cashierId)
    }

    const getSalesByCustomer = (customerId: string) => {
        return sales.filter(s => s.customerId === customerId)
    }

    const getTotalSales = (start?: Date, end?: Date) => {
        let filteredSales = sales.filter(s => s.status === "COMPLETED")

        if (start && end) {
            filteredSales = filteredSales.filter(s => {
                const saleDate = new Date(s.createdAt)
                return saleDate >= start && saleDate <= end
            })
        }

        return filteredSales.reduce((sum, sale) => sum + sale.total, 0)
    }

    // ============= COLABORADORES =============
    const addEmployee = (employee: Omit<Employee, "d">): Employee => {
        const newEmployee: Employee = {
            ...employee,
            id: crypto.randomUUID()
        }
        setEmployees(prev => [...prev, newEmployee])
        return newEmployee
    }

    const updateEmployee = (id: string, data: Partial<Employee>) => {
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
    }

    const deleteEmployee = (id: string) => {
        setEmployees(prev => prev.filter(e => e.id !== id))
    }

    const getEmployeeById = (id: string) => {
        return employees.find(e => e.id === id)
    }

    // ============= FORNECEDORES =============
    const addSupplier = (supplier: Omit<Supplier, "id">): Supplier => {
        const newSupplier: Supplier = {
            ...supplier,
            id: crypto.randomUUID()
        }
        setSuppliers(prev => [...prev, newSupplier])
        return newSupplier
    }

    const updateSupplier = (id: string, data: Partial<Supplier>) => {
        setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
    }

    const deleteSupplier = (id: string) => {
        setSuppliers(prev => prev.filter(s => s.id !== id))
    }

    const getSupplierById = (id: string) => {
        return suppliers.find(s => s.id === id)
    }

    // ============= ESTATÍSTICAS =============
    const getDashboardStats = (): DashboardStats => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        const completedSales = sales.filter(s => s.status === "COMPLETED")
        
        const salesToday = completedSales.filter(s => {
            const saleDate = new Date(s.createdAt)
            return saleDate >= today
        })

        const salesThisMonth = completedSales.filter(s => {
            const saleDate = new Date(s.createdAt)
            return saleDate >= startOfMonth && saleDate <= endOfMonth
        })

        // Produtos mais vendidos
        const productSales = new Map<string, { quantity: number, revenue: number }>()
        completedSales.forEach(sale => {
            sale.items.forEach(item => {
                const current = productSales.get(item.productId) || { quantity: 0, revenue: 0 }
                productSales.set(item.productId, {
                    quantity: current.quantity + item.quantity,
                    revenue: current.revenue + item.total
                })
            })
        })

        const topSellingProducts = Array.from(productSales.entries())
            .map(([productId, data]) => ({
                product: getProductById(productId)!,
                totalSold: data.quantity,
                revenue: data.revenue
            }))
            .filter(item => item.product)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5)

        // Melhores clientes
        const customerPurchases = new Map<string, { count: number, total: number }>()
        completedSales.forEach(sale => {
            if (!sale.customerId) return
            const current = customerPurchases.get(sale.customerId) || { count: 0, total: 0 }
            customerPurchases.set(sale.customerId, {
                count: current.count + 1,
                total: current.total + sale.total
            })
        })

        const topCustomers = Array.from(customerPurchases.entries())
            .map(([customerId, data]) => ({
                client: getClientById(customerId)!,
                totalPurchases: data.count,
                totalSpent: data.total
            }))
            .filter(item => item.client)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5)

        // Vendas por colaborador
        const employeeSales = new Map<string, { count: number, revenue: number }>()
        completedSales.forEach(sale => {
            const current = employeeSales.get(sale.cashierId) || { count: 0, revenue: 0 }
            employeeSales.set(sale.cashierId, {
                count: current.count + 1,
                revenue: current.revenue + sale.total
            })
        })

        const salesByEmployee = Array.from(employeeSales.entries())
            .map(([employeeId, data]) => ({
                employee: getEmployeeById(employeeId)!,
                totalSales: data.count,
                revenue: data.revenue
            }))
            .filter(item => item.employee)
            .sort((a, b) => b.revenue - a.revenue)

        return {
            totalSalesToday: salesToday.reduce((sum, s) => sum + s.total, 0),
            totalSalesThisMonth: salesThisMonth.reduce((sum, s) => sum + s.total, 0),
            totalClients: clients.length,
            totalProducts: products.length,
            lowStockCount: getLowStockProducts().length,
            pendingSalesCount: sales.filter(s => s.status === "PENDING").length,
            topSellingProducts,
            topCustomers,
            salesByEmployee
        }
    }

    return (
        <DataContext.Provider value={{
            clients,
            addClient,
            updateClient,
            deleteClient,
            getClientById,
            
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            getProductById,
            updateStock,
            getLowStockProducts,
            
            sales,
            addSale,
            updateSale,
            deleteSale,
            getSaleById,
            getSalesByDateRange,
            getSalesByCashier,
            getSalesByCustomer,
            getTotalSales,
            
            employees,
            addEmployee,
            updateEmployee,
            deleteEmployee,
            getEmployeeById,
            
            suppliers,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            getSupplierById,
            
            getDashboardStats
        }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error("useData deve ser usado dentro de um DataProvider")
    }
    return context
}