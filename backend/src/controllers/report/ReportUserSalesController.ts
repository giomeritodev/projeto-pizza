import { Request, Response } from "express"
import { ReportUserSalesService } from "../../services/report/ReportUserSalesService"

class ReportUserSalesController {
    async handle(req: Request, res: Response) {
        const { user_id, type, date } = req.query

        try {
            const reportUserSalesService = new ReportUserSalesService()

            const report = await reportUserSalesService.execute({
                user_id: user_id ? Number(user_id) : undefined,
                type: (type as "day" | "month") || "day",
                date: date as string | undefined,
            })

            return res.json(report)
        } catch (error) {
            return res.status(400).json({
                error: error instanceof Error ? error.message : "Erro ao gerar relatório",
            })
        }
    }
}

export { ReportUserSalesController }
