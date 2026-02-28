import { ProductForm } from "@/components/dashboard/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth"
import { Category } from "@/lib/types";
import { listProductsAction } from "@/actions/products";
import { Package } from "lucide-react";
import { DeleteButtonProduct } from "@/components/dashboard/delete-button";
import Image from "next/image";

export default async function Products() {
    const token = await getToken();
    // use server action helper for listing
    const products = await listProductsAction();

    const categories = await apiClient<Category[]>("/category", {
        token: token
    })

    // const formatPrice = (price: number) => {
    //     return new Intl.NumberFormat("pt-BR", {
    //         style: "currency",
    //         currency: "BRL"
    //     }).format(price / 100)
    // }
    return (

        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Produtos</h1>
                    <p className="text-sm sm:text-base mt-1">Gerencie seus produtos</p>
                </div>
                <ProductForm categories={categories} />
            </div>

            {products.length !== 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map(product => (
                        <Card key={product.id} className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white">
                            <div className="relative w-full h-48 bg-gray-700">
                                {product.banner ? (
                                    <Image
                                        src={product.banner}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100w, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="gap-2 flex items-center justify-between text-base md:text-lg">
                                    <div className="flex flex-row gap-2 items-center">
                                        <Package className="w-5 h-5" />
                                        <span>{product.name}</span>
                                    </div>
                                    <DeleteButtonProduct productId={product.id} />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border-b-1 border-gray-400 mb-3">
                                    <p className="text-gray-300 text-sm mt-1">{product.description}</p>

                                </div>
                                <div className="flex justify-between">
                                    <p className="text-brand-primary font-bold text-2xl">R$ {(product.price / 100).toFixed(2)}</p>
                                    {product.category && (
                                        <p className="text-gray-300 text-sm mt-1">{product.category.name}</p>
                                    )}

                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}