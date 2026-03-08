import PDFDocument from "pdfkit"
import { ReportSalesService } from "./ReportSalesService"
import { ReportUserSalesService } from "./ReportUserSalesService"

interface GeneratePdfProps {
    type: "sales" | "user_sales"
    reportType: "day" | "month" | "year"
    date?: string
    user_id?: number
}

class GeneratePdfReportService {
    async execute({ type, reportType, date, user_id }: GeneratePdfProps): Promise<any> {
        const doc = new PDFDocument({
            bufferPages: true,
            margin: 50,
            size: "A4",
        })

        try {
            // Título
            doc.fontSize(24).font("Helvetica-Bold").text("RELATÓRIO DE VENDAS", { align: "center" })
            doc.moveDown(0.5)
            doc.fontSize(10).font("Helvetica").text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, { align: "center" })
            doc.moveDown(1)

            // Adicionar linha separadora
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke()
            doc.moveDown(0.5)

            if (type === "sales") {
                await this.generateSalesReport(doc, reportType, date)
            } else if (type === "user_sales") {
                await this.generateUserSalesReport(doc, reportType, date, user_id)
            }

            // Rodapé
            doc.moveDown(1)
            doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke()
            doc.moveDown(0.5)
            doc.fontSize(8).font("Helvetica-Oblique").text("Fim do relatório", { align: "center" })

            return doc
        } catch (error) {
            console.error("Erro ao gerar PDF:", error)
            throw new Error("Erro ao gerar PDF do relatório")
        }
    }

    private async generateSalesReport(doc: any, reportType: string, date?: string) {
        const salesService = new ReportSalesService()

        if (reportType === "day") {
            const dayReport = await salesService.execute({ type: "day", date })
            this.addSalesContent(doc, dayReport, "DIA")
            doc.moveDown(1)
        } else if (reportType === "month") {
            const monthReport = await salesService.execute({ type: "month", date })
            this.addSalesContent(doc, monthReport, "MÊS")
            doc.moveDown(1)
        } else if (reportType === "year") {
            const yearReport = await salesService.execute({ type: "year", date })
            this.addSalesContent(doc, yearReport, "ANO")
            doc.moveDown(1)
        }
    }

    private async generateUserSalesReport(
        doc: any,
        reportType: string,
        date?: string,
        user_id?: number
    ) {
        const userSalesService = new ReportUserSalesService()

        if (reportType === "day") {
            const result = await userSalesService.execute({ type: "day", date, user_id })

            if (Array.isArray(result)) {
                doc.fontSize(14).font("Helvetica-Bold").text("Vendas por Garçom - Diárias")
                doc.moveDown(0.5)

                // Cabeçalho da tabela
                this.addTableHeader(doc, ["Garçom", "Pedidos", "Total de Itens", "Total (R$)"])

                result.forEach((item) => {
                    this.addTableRow(doc, [
                        item.userName,
                        String(item.ordersCount),
                        String(item.itemsCount),
                        `R$ ${(item.total / 100).toFixed(2)}`,
                    ])
                })
            } else {
                doc.fontSize(14).font("Helvetica-Bold").text(`Vendas - ${result.userName}`)
                doc.moveDown(0.5)
                this.addSalesContent(doc, result, "DIA")
            }
        } else if (reportType === "month") {
            const result = await userSalesService.execute({ type: "month", date, user_id })

            if (Array.isArray(result)) {
                doc.fontSize(14).font("Helvetica-Bold").text("Vendas por Garçom - Mensais")
                doc.moveDown(0.5)

                // Cabeçalho da tabela
                this.addTableHeader(doc, ["Garçom", "Pedidos", "Total de Itens", "Total (R$)"])

                result.forEach((item) => {
                    this.addTableRow(doc, [
                        item.userName,
                        String(item.ordersCount),
                        String(item.itemsCount),
                        `R$ ${(item.total / 100).toFixed(2)}`,
                    ])
                })
            } else {
                doc.fontSize(14).font("Helvetica-Bold").text(`Vendas - ${result.userName}`)
                doc.moveDown(0.5)
                this.addSalesContent(doc, result, "MÊS")
            }
        }
    }

    private addSalesContent(doc: any, data: any, period: string) {
        doc.fontSize(14).font("Helvetica-Bold").text(`Relatório de Vendas - ${period}`)
        doc.moveDown(0.5)

        doc.fontSize(11).font("Helvetica").text(`Período: ${data.period}`)
        doc.moveDown(0.5)

        // Tabela com dados
        const x = 50
        let y = doc.y + 20

        // Cabeçalho
        doc.fontSize(10).font("Helvetica-Bold")
        doc.text("Métrica", x, y, { width: 150 })
        doc.text("Valor", x + 180, y, { width: 150 })

        y += 25
        doc.moveTo(x, y - 5).lineTo(545, y - 5).stroke()

        // Dados
        doc.fontSize(10).font("Helvetica")
        const metrics = [
            { label: "Total de Pedidos", value: String(data.ordersCount) },
            { label: "Total de Itens", value: String(data.itemsCount) },
            { label: "Total Vendido", value: `R$ ${(data.total / 100).toFixed(2)}` },
        ]

        metrics.forEach((metric) => {
            doc.text(metric.label, x, y)
            doc.text(metric.value, x + 180, y)
            y += 25
        })

        doc.moveTo(x, y - 5).lineTo(545, y - 5).stroke()
        doc.y = y
    }

    private addTableHeader(doc: any, headers: string[]) {
        const x = 50
        const colWidth = 450 / headers.length
        let currentX = x

        doc.fontSize(10).font("Helvetica-Bold")

        headers.forEach((header) => {
            doc.text(header, currentX, doc.y, { width: colWidth, align: "center" })
            currentX += colWidth
        })

        doc.moveDown()
        doc.moveTo(x, doc.y - 5).lineTo(545, doc.y - 5).stroke()
        doc.moveDown(0.5)
    }

    private addTableRow(doc: any, data: string[]) {
        const x = 50
        const colWidth = 450 / data.length
        let currentX = x

        doc.fontSize(9).font("Helvetica")

        data.forEach((cell) => {
            doc.text(cell, currentX, doc.y, { width: colWidth, align: "center" })
            currentX += colWidth
        })

        doc.moveDown()
    }
}

export { GeneratePdfReportService }
