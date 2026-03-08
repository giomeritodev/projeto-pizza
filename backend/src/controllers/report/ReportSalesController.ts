import { Request, Response } from "express"
import { ReportSalesService } from "../../services/report/ReportSalesService"

class ReportSalesController {
    async handle(req: Request, res: Response) {
        const { type, date } = req.query

        try {
            const reportSalesService = new ReportSalesService()

            const report = await reportSalesService.execute({
                type: (type as "day" | "month" | "year") || "day",
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

export { ReportSalesController }
