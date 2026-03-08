import { z } from "zod"

// Relatório de vendas por período (dia, mês, ano)
export const reportSalesSchema = z.object({
    type: z.enum(["day", "month", "year"]).describe("Tipo de relatório: day, month ou year"),
    date: z.string().optional().describe("Data no formato YYYY-MM-DD (obrigatório para day), YYYY-MM (para month) ou YYYY (para year)"),
})

// Relatório de vendas por garçom
export const reportUserSalesSchema = z.object({
    user_id: z.string().or(z.number()).optional().describe("ID do usuário garçom"),
    type: z.enum(["day", "month"]).describe("Tipo de relatório: day ou month"),
    date: z.string().optional().describe("Data no formato YYYY-MM-DD (para day) ou YYYY-MM (para month)"),
})

// Gerar PDF do relatório
export const generatePdfReportSchema = z.object({
    type: z.enum(["sales", "user_sales"]).describe("Tipo de relatório: sales ou user_sales"),
    reportType: z.enum(["day", "month", "year"]).describe("Tipo de período"),
    date: z.string().optional().describe("Data ou período"),
    user_id: z.string().or(z.number()).optional().describe("ID do usuário (para relatório de garçom)"),
})
