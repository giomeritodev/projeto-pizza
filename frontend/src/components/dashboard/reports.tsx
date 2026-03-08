"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, DownloadIcon, FileTextIcon, UsersIcon } from "lucide-react";
import { apiClient } from "@/lib/api";
import { FormatPrice } from "@/lib/format";
import { toast } from "sonner";

interface SalesReport {
    total: number;
    ordersCount: number;
    itemsCount: number;
    period: string;
}

interface UserSalesReport {
    user_id: number;
    userName: string;
    total: number;
    ordersCount: number;
    itemsCount: number;
    period: string;
}

interface ReportsProps {
    token: string;
}

export function Reports({ token }: ReportsProps) {
    const [loading, setLoading] = useState(false);
    const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
    const [userSalesReport, setUserSalesReport] = useState<UserSalesReport | UserSalesReport[] | null>(null);

    // Form states
    const [salesType, setSalesType] = useState<"day" | "month" | "year">("day");
    const [salesDate, setSalesDate] = useState("");

    const [userSalesType, setUserSalesType] = useState<"day" | "month">("day");
    const [userSalesDate, setUserSalesDate] = useState("");
    const [userId, setUserId] = useState("");

    const generateSalesReport = async () => {
        if (!token) {
            toast.error("Token não encontrado. Faça login novamente.");
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams({
                type: salesType,
                ...(salesDate && { date: salesDate })
            });

            const report = await apiClient<SalesReport>(`/report/sales?${params.toString()}`, {
                method: "GET",
                cache: "no-store",
                token: token
            });

            setSalesReport(report);
            toast.success("Relatório gerado com sucesso!");
        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            toast.error("Erro ao gerar relatório de vendas");
        } finally {
            setLoading(false);
        }
    };

    const generateUserSalesReport = async () => {
        if (!token) {
            toast.error("Token não encontrado. Faça login novamente.");
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams({
                type: userSalesType,
                ...(userSalesDate && { date: userSalesDate }),
                ...(userId && { user_id: userId })
            });

            const report = await apiClient<UserSalesReport | UserSalesReport[]>(`/report/user-sales?${params.toString()}`, {
                method: "GET",
                cache: "no-store",
                token: token
            });

            setUserSalesReport(report);
            toast.success("Relatório gerado com sucesso!");
        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            toast.error("Erro ao gerar relatório de vendas por usuário");
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = async (type: "sales" | "user_sales", reportType: "day" | "month" | "year", date?: string, userId?: string) => {
        if (!token) {
            toast.error("Token não encontrado. Faça login novamente.");
            return;
        }

        try {
            const params = new URLSearchParams({
                type,
                reportType,
                ...(date && { date }),
                ...(userId && { user_id: userId })
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/pdf?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao baixar PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `relatorio_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("PDF baixado com sucesso!");
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            toast.error("Erro ao baixar PDF");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <FileTextIcon className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Relatórios de Vendas</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Relatório de Vendas por Período */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Vendas por Período
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="sales-type">Tipo</Label>
                                <Select value={salesType} onValueChange={(value: "day" | "month" | "year") => setSalesType(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Diário</SelectItem>
                                        <SelectItem value="month">Mensal</SelectItem>
                                        <SelectItem value="year">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="sales-date">
                                    Data {salesType === "day" ? "(YYYY-MM-DD)" : salesType === "month" ? "(YYYY-MM)" : "(YYYY)"}
                                </Label>
                                <Input
                                    id="sales-date"
                                    type="text"
                                    placeholder={salesType === "day" ? "2026-03-08" : salesType === "month" ? "2026-03" : "2026"}
                                    value={salesDate}
                                    onChange={(e) => setSalesDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={generateSalesReport}
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? "Gerando..." : "Gerar Relatório"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => downloadPdf("sales", salesType, salesDate)}
                                disabled={loading}
                            >
                                <DownloadIcon className="h-4 w-4" />
                            </Button>
                        </div>

                        {salesReport && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                                <h3 className="font-semibold">Resultado - {salesReport.period}</h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Total de Pedidos</p>
                                        <p className="font-semibold">{salesReport.ordersCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Total de Itens</p>
                                        <p className="font-semibold">{salesReport.itemsCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Valor Total</p>
                                        <p className="font-semibold">{FormatPrice(salesReport.total)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Relatório de Vendas por Garçom */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5" />
                            Vendas por Garçom
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="user-sales-type">Tipo</Label>
                                <Select value={userSalesType} onValueChange={(value: "day" | "month") => setUserSalesType(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Diário</SelectItem>
                                        <SelectItem value="month">Mensal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="user-sales-date">
                                    Data ({userSalesType === "day" ? "YYYY-MM-DD" : "YYYY-MM"})
                                </Label>
                                <Input
                                    id="user-sales-date"
                                    type="text"
                                    placeholder={userSalesType === "day" ? "2026-03-08" : "2026-03"}
                                    value={userSalesDate}
                                    onChange={(e) => setUserSalesDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="user-id">ID do Garçom (opcional)</Label>
                                <Input
                                    id="user-id"
                                    type="text"
                                    placeholder="Deixe vazio para todos"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={generateUserSalesReport}
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? "Gerando..." : "Gerar Relatório"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => downloadPdf("user_sales", userSalesType, userSalesDate, userId)}
                                disabled={loading}
                            >
                                <DownloadIcon className="h-4 w-4" />
                            </Button>
                        </div>

                        {userSalesReport && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                {Array.isArray(userSalesReport) ? (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold">Resultado - Todos os Garçons</h3>
                                        {userSalesReport.map((user) => (
                                            <div key={user.user_id} className="border rounded p-3">
                                                <h4 className="font-medium">{user.userName}</h4>
                                                <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                                                    <div>
                                                        <p className="text-gray-600">Pedidos</p>
                                                        <p className="font-semibold">{user.ordersCount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Itens</p>
                                                        <p className="font-semibold">{user.itemsCount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Total</p>
                                                        <p className="font-semibold">{FormatPrice(user.total)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Resultado - {userSalesReport.userName}</h3>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Total de Pedidos</p>
                                                <p className="font-semibold">{userSalesReport.ordersCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Total de Itens</p>
                                                <p className="font-semibold">{userSalesReport.itemsCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Valor Total</p>
                                                <p className="font-semibold">{FormatPrice(userSalesReport.total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}