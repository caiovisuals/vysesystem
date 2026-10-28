"use client"

import { useState } from "react"
import clsx from "clsx"
import { PaymentMethod } from "@vysesystem/types"
import { SalesPeriod, useSalesReport } from "@/_hooks/use-sales-report"
import StatCard from "@/_components/SalesUi/StatCard"
import RankingCard from "@/_components/SalesUi/RankingCard"

const periods: { value: SalesPeriod, label: string }[] = [
    { value: "today", label: "Hoje" },
    { value: "week", label: "Semana" },
    { value: "month", label: "Mês" },
    { value: "all", label: "Todo o período" },
]

const paymentMethodLabels: Record<PaymentMethod, string> = {
    MONEY: "Dinheiro",
    PIX: "PIX",
    CREDIT_CARD: "Cartão de Crédito",
    DEBIT_CARD: "Cartão de Débito",
    DIGITAL_WALLETS: "Carteira Digital",
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value)
}

const formatSalesCount = (count: number) => `${count} venda${count === 1 ? "" : "s"}`

export default function Sales() {
    const [period, setPeriod] = useState<SalesPeriod>("all")
    const report = useSalesReport(period)
    const periodLabel = periods.find(p => p.value === period)?.label.toLowerCase()
    
    return (
        <div className="w-full h-full flex flex-col gap-[15px] p-[18px] overflow-y-auto">
            {report.isLoading && (
                <span className="text-[var(--sub-text)]">Carregando vendas</span>
            )}
            {report.error && (
                <span role="alert" className="text-red-500">Não foi possível carregar as vendas: {report.error.message}</span>
            )}
            {/* Vendas do dia, da semana e do mês */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Vendas de Hoje"
                    value={formatCurrency(report.summary.today.revenue)}
                    description={formatSalesCount(report.summary.today.count)}
                />
                <StatCard
                    title="Vendas da Semana"
                    value={formatCurrency(report.summary.week.revenue)}
                    description={formatSalesCount(report.summary.week.count)}
                />
                <StatCard
                    title="Vendas do Mês"
                    value={formatCurrency(report.summary.month.revenue)}
                    description={formatSalesCount(report.summary.month.count)}
                />
                <StatCard
                    title="Ticket Médio"
                    value={formatCurrency(report.averageTicket)}
                    description={`Período: ${periodLabel}`}
                    highlight
                />
            </div>
            {/* Filtro de período */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">Desempenho de vendas</h2>
                    <span className="text-[var(--sub-text)]">
                        {formatCurrency(report.summary.period.revenue)} em {formatSalesCount(report.summary.period.count)} concluídas
                    </span>
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                    {periods.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={clsx(
                                "px-[15px] py-[5px] border-2 rounded-[15px] transition-normal cursor-pointer",
                                period === p.value
                                    ? "bg-[var(--middleground)] border-[var(--middleground)]"
                                    : "border-[var(--foreground)] hover:border-[var(--middleground)]"
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
            {/* Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <RankingCard
                    title="Colaboradores que mais venderam"
                    entries={report.topEmployees}
                    formatValue={formatCurrency}
                    formatCount={formatSalesCount}
                    emptyMessage="Nenhuma venda no período."
                />
                <RankingCard
                    title="Produtos mais vendidos"
                    entries={report.topProducts}
                    formatValue={formatCurrency}
                    formatCount={(count) => `${count} un.`}
                    emptyMessage="Nenhum produto vendido no período."
                />
                <RankingCard
                    title="Clientes que mais compraram"
                    entries={report.topCustomers}
                    formatValue={formatCurrency}
                    formatCount={(count) => `${count} compra${count === 1 ? "" : "s"}`}
                    emptyMessage="Nenhum cliente identificado no período."
                />
            </div>
            {/* Formas de pagamento */}
            <div className="flex flex-col gap-4 p-4 border-2 border-[var(--foreground)] rounded-[15px]">
                <h3 className="text-[18px] font-medium">Formas de pagamento</h3>
                {report.paymentMethods.length === 0 ? (
                    <span className="text-[var(--sub-text)] py-4 text-center">Nenhuma venda no período.</span>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                        {report.paymentMethods.map(payment => (
                            <div key={payment.method} className="flex flex-col gap-1 bg-[var(--foreground)] p-3 rounded-[15px]">
                                <span className="text-[var(--sub-text)] text-sm">{paymentMethodLabels[payment.method]}</span>
                                <span className="text-lg font-semibold">{formatCurrency(payment.revenue)}</span>
                                <span className="text-[var(--sub-text)] text-sm">
                                    {formatSalesCount(payment.count)} · {Math.round((payment.revenue / report.summary.period.revenue) * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}