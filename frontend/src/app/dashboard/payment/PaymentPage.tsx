"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { FormatPrice } from "@/lib/format"
import { Receipt } from "lucide-react"
import { TableOrder, ReceiptData } from "@/lib/types"

interface PaymentPageProps {
    token: string;
}

export default function PaymentPage({ token }: PaymentPageProps) {
    const [tables, setTables] = useState<TableOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTable, setSelectedTable] = useState<number | null>(null)
    const [receipt, setReceipt] = useState<ReceiptData | null>(null)

    const fetchTables = async () => {
        try {
            const response = await apiClient<TableOrder[]>("/orders/by-table", {
                token: token
            })
            setTables(response)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTables()
    }, [])

    const handlePayment = async (table: number) => {
        try {
            const response = await apiClient<ReceiptData>("/orders/payment/by-table", {
                method: "PUT",
                body: JSON.stringify({ table, payment: true }),
                token: token
            })
            setReceipt(response)
            setSelectedTable(null)
            fetchTables() // Refresh the list
        } catch (error) {
            console.error(error)
        }
    }

    const calculateItemSubtotal = (item: any) => {
        return item.product.price * item.amount
    }

    if (receipt) {
        return (
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-4">
                    <Receipt className="w-12 h-12 mx-auto text-green-600" />
                    <h2 className="text-xl text-black font-bold mt-2">Cupom (Não fiscal)</h2>
                    <p className="text-sm text-gray-600">Mesa {receipt.table}</p>
                    <p className="text-sm text-gray-600">{new Date(receipt.timestamp).toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                    {receipt.orders.flatMap(order =>
                        order.items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-500">{item.amount}x {item.product.name}</span>
                                <span className="text-gray-700">{FormatPrice(calculateItemSubtotal(item))}</span>
                            </div>
                        )) || []
                    )}
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                    <span className="text-black">Total</span>
                    <span className="text-black">{FormatPrice(receipt.total)}</span>
                </div>
                <Button
                    className="w-full mt-4"
                    onClick={() => setReceipt(null)}
                >
                    Fechar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Pagamento por Mesa</h1>
                <p className="text-gray-300">Gerencie pagamentos das mesas prontas</p>
            </div>

            {loading ? (
                <p className="text-center text-gray-300">Carregando mesas...</p>
            ) : tables.length === 0 ? (
                <p className="text-center text-gray-300">Nenhuma mesa com pedidos prontos.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tables.map(table => (
                        <Card key={table.table} className="bg-app-card border-app-border text-white">
                            <CardHeader>
                                <CardTitle>Mesa {table.table}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-300 mb-2">
                                    {table.orders.length} pedido{table.orders.length > 1 ? 's' : ''}
                                </p>
                                <p className="text-lg font-bold text-brand-primary mb-4">
                                    Total: {FormatPrice(table.total)}
                                </p>
                                <div className="space-y-2">
                                    <Button
                                        className="w-full bg-brand-primary hover:bg-brand-primary text-white hover:text-white font-bold"
                                        variant="outline"
                                        onClick={() => setSelectedTable(selectedTable === table.table ? null : table.table)}
                                    >
                                        Ver Detalhes
                                    </Button>
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => handlePayment(table.table)}
                                    >
                                        Marcar como Pago
                                    </Button>
                                </div>
                                {selectedTable === table.table && (
                                    <div className="mt-4 space-y-2">
                                        <h4 className="font-semibold">Itens:</h4>
                                        {table.items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>{item.amount}x {item.product.name}</span>
                                                <span>{FormatPrice(calculateItemSubtotal(item))}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>{FormatPrice(table.total)}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}