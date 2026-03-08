import { prisma } from "../../prisma"

interface ReportSalesServiceProps {
    type: "day" | "month" | "year"
    date?: string
}

interface SalesData {
    total: number
    ordersCount: number
    itemsCount: number
    period: string
}

class ReportSalesService {
    async execute({ type, date }: ReportSalesServiceProps): Promise<SalesData> {
        try {
            let startDate: Date
            let endDate: Date
            let periodLabel: string

            const today = new Date()

            if (type === "day") {
                if (!date) {
                    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
                    periodLabel = today.toLocaleDateString("pt-BR")
                } else {
                    const parts = date.split("-")
                    const year = Number(parts[0])
                    const month = Number(parts[1])
                    const day = Number(parts[2])
                    startDate = new Date(year, month - 1, day)
                    endDate = new Date(year, month - 1, day + 1)
                    periodLabel = startDate.toLocaleDateString("pt-BR")
                }
            } else if (type === "month") {
                if (!date) {
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1)
                    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1)
                    periodLabel = `${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`
                } else {
                    const parts = date.split("-")
                    const year = Number(parts[0])
                    const month = Number(parts[1])
                    startDate = new Date(year, month - 1, 1)
                    endDate = new Date(year, month, 1)
                    periodLabel = `${String(month).padStart(2, "0")}/${year}`
                }
            } else {
                // type === "year"
                if (!date) {
                    startDate = new Date(today.getFullYear(), 0, 1)
                    endDate = new Date(today.getFullYear() + 1, 0, 1)
                    periodLabel = String(today.getFullYear())
                } else {
                    const year = Number(date)
                    startDate = new Date(year, 0, 1)
                    endDate = new Date(year + 1, 0, 1)
                    periodLabel = String(year)
                }
            }

            // Buscar ordens pagas nesse período
            const orders = await prisma.order.findMany({
                where: {
                    payment: true,
                    draft: false,
                    createdAt: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            })

            // Calcular total
            let total = 0
            let itemsCount = 0

            orders.forEach((order) => {
                order.items.forEach((item) => {
                    total += item.product.price * item.amount
                    itemsCount += item.amount
                })
            })

            return {
                total,
                ordersCount: orders.length,
                itemsCount,
                period: periodLabel,
            }
        } catch (error) {
            console.error("Erro ao gerar relatório de vendas:", error)
            throw new Error("Erro ao gerar relatório de vendas")
        }
    }
}

export { ReportSalesService }
