import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormatPrice } from "@/lib/format";
import { X, Check } from "lucide-react";
import { finishOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";

interface OrderModalProps {
    orderId: number | null;
    onClose: () => Promise<void>;
    token: string
}

export function OrderModal({ onClose, orderId, token }: OrderModalProps) {

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const fetchOrder = async () => {
        if (!orderId) { setOrder(null); return; }
        try {
            setLoading(true)

            const response = await apiClient<Order>(`/order/detail?order_id=${orderId}`, {
                method: "GET",
                token: token
            })

            setOrder(response)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        async function loadOrder() {
            await fetchOrder()
        }
        loadOrder();
    }, [orderId])

    const calculateTotal = () => {
        if (!order?.items) return 0;
        return order.items.reduce((total, item) => {
            return total + item.product.price * item.amount
        }, 0)
    }

    const handleClose = async () => {
        setOrder(null)
        await onClose()
    }

    const handleFinishOrder = async () => {
        if (!orderId) return;
        const result = await finishOrderAction(orderId)

        if (!result.success) {
            console.log(result.error)
        } else {
            router.refresh()
            onClose();
        }

    }

    return (
        <Dialog open={orderId !== null && order !== null} onOpenChange={handleClose}>
            <DialogContent className="p-6 bg-app-card text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Detalhes do Pedido
                        <span className="text-brand-primary"> " {orderId} "</span>
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-gray-400">Carregando pedido...</p>
                    </div>
                ) : order ? (
                    <div className="space-y-6">
                        {/* Informações Básicas */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-app-background rounded-lg p-4">
                                <p className="text-sm text-gray-400">Mesa</p>
                                <p className="text-2xl font-bold text-brand-primary">{order.table}</p>
                            </div>
                            <div className="bg-app-background rounded-lg p-4">
                                <p className="text-sm text-gray-400">Cliente</p>
                                <p className="text-lg font-semibold truncate">{order.name || "Cliente"}</p>
                            </div>
                            <div className="bg-app-background rounded-lg p-4">
                                <p className="text-sm text-gray-400">Status</p>
                                <p className="text-lg font-semibold text-yellow-400">Em produção</p>
                            </div>
                        </div>

                        {/* Itens do Pedido */}
                        <div className="bg-app-background rounded-lg p-4">
                            <h3 className="text-lg font-bold mb-4">Itens do Pedido</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border-b border-app-border pb-3 last:border-b-0">
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.product.id} - {item.product.name}</p>
                                                <p className="text-xs text-gray-400">{item.product.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-300">
                                                    {item.amount}x {FormatPrice(item.product.price)}
                                                </p>
                                                <p className="font-semibold text-brand-primary">
                                                    {FormatPrice(item.product.price * item.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">Nenhum item encontrado</p>
                                )}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="bg-app-background rounded-lg p-4 border-l-4 border-brand-primary">
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-bold">Total do Pedido</p>
                                <p className="text-2xl font-bold text-brand-primary">
                                    {FormatPrice(calculateTotal())}
                                </p>
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-brand-primary hover:bg-brand-primary hover:text-white"
                                onClick={handleClose}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Fechar
                            </Button>
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                disabled={loading}
                                onClick={handleFinishOrder}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Finalizar Pedido
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}