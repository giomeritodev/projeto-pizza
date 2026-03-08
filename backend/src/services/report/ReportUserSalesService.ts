import { prisma } from "../../prisma"

interface ReportUserSalesServiceProps {
    user_id?: number
    type: "day" | "month"
    date?: string
}

interface UserSaleData {
    user_id: number
    userName: string
    total: number
    ordersCount: number
    itemsCount: number
    period: string
}

class ReportUserSalesService {
    async execute({
        user_id,
        type,
        date,
    }: ReportUserSalesServiceProps): Promise<UserSaleData | UserSaleData[]> {
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
            } else {
                // type === "month"
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
            }

            // Se user_id foi fornecido, retorna apenas desse usuário
            if (user_id) {
                const orders = await prisma.order.findMany({
                    where: {
                        user_id: user_id,
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
                        user: true,
                    },
                })

                let total = 0
                let itemsCount = 0

                orders.forEach((order) => {
                    order.items.forEach((item) => {
                        total += item.product.price * item.amount
                        itemsCount += item.amount
                    })
                })

                let userName = "Usuário não encontrado"
                if (orders.length > 0) {
                    const firstOrder = orders[0]
                    if (firstOrder && firstOrder.user && firstOrder.user.name) {
                        userName = firstOrder.user.name
                    }
                } else {
                    const foundUser = await prisma.user.findUnique({ where: { id: user_id } })
                    if (foundUser && foundUser.name) {
                        userName = foundUser.name
                    }
                }

                return {
                    user_id: user_id,
                    userName: userName,
                    total,
                    ordersCount: orders.length,
                    itemsCount,
                    period: periodLabel,
                }
            }

            // Caso contrário, retorna para todos os usuários
            const users = await prisma.user.findMany()

            const results: UserSaleData[] = []

            for (const user of users) {
                const orders = await prisma.order.findMany({
                    where: {
                        user_id: user.id,
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

                let total = 0
                let itemsCount = 0

                orders.forEach((order) => {
                    order.items.forEach((item) => {
                        total += item.product.price * item.amount
                        itemsCount += item.amount
                    })
                })

                if (orders.length > 0 || total > 0) {
                    results.push({
                        user_id: user.id,
                        userName: user.name,
                        total,
                        ordersCount: orders.length,
                        itemsCount,
                        period: periodLabel,
                    })
                }
            }

            return results
        } catch (error) {
            console.error("Erro ao gerar relatório de vendas por usuário:", error)
            throw new Error("Erro ao gerar relatório de vendas por usuário")
        }
    }
}

export { ReportUserSalesService }
