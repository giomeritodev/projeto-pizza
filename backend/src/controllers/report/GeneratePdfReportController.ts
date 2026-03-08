import { Request, Response } from "express"
import { GeneratePdfReportService } from "../../services/report/GeneratePdfReportService"

class GeneratePdfReportController {
    async handle(req: Request, res: Response): Promise<void> {
        const { type, reportType, date, user_id } = req.query

        try {
            const generatePdfService = new GeneratePdfReportService()

            const doc = await generatePdfService.execute({
                type: (type as "sales" | "user_sales") || "sales",
                reportType: (reportType as "day" | "month" | "year") || "day",
                date: date as string | undefined,
                user_id: user_id ? Number(user_id) : undefined,
            })

            // Configurar headers para download de PDF
            res.setHeader("Content-Type", "application/pdf")
            res.setHeader("Content-Disposition", `attachment; filename="relatorio_${Date.now()}.pdf"`)

            // Pipe do documento para a resposta
            doc.pipe(res)
            doc.end()
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Erro ao gerar PDF",
            })
        }
    }
}

export { GeneratePdfReportController }
