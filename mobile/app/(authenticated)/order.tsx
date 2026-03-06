import { Button } from "@/components/Button";
import { OrderItem } from "@/components/Orderitem";
import { QuantityControl } from "@/components/QuantityControl";
import { Select } from "@/components/Select";
import { colors, fontSize, spacing } from "@/constants/theme";
import api from "@/services/api";
import { Category, Item, Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Order() {
    const router = useRouter()
    const insets = useSafeAreaInsets();
    const { order_id, table } = useLocalSearchParams<{
        order_id: string;
        table: string;
    }>();
    const [loadingCategory, setLoadingCategory] = useState(true)
    const [loadingProduct, setLoadingProduct] = useState(true)
    const [loadingAddItem, setLoadingAddItem] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedProduct, setSelectedProduct] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [quantity, setQuantity] = useState(1)
    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
        async function loadDataCategory() {
            await loadCategories()
        }
        loadDataCategory()
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            loadProduct(Number(selectedCategory))
        } else {
            setProducts([])
            setSelectedCategory("")
        }
    }, [selectedCategory])

    async function loadCategories() {
        try {
            const response = await api.get<Category[]>("/category")
            setCategories(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingCategory(false)
        }
    }

    async function loadProduct(categoryId: number) {
        try {
            setLoadingProduct(true)
            const response = await api.get<Product[]>("/category/product", {
                params: { category_id: categoryId }
            })
            setProducts(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingProduct(false)
        }
    }

    async function handleAddItem() {
        if (!selectedCategory || !selectedProduct) {
            Alert.alert("Atenção", "Selecione categoria e produto para adicionar")
            return
        }

        try {
            setLoadingAddItem(true)
            const response = await api.post<Item>("/order/add", {
                order_id: Number(order_id),
                product_id: Number(selectedProduct),
                amount: quantity
            })
            setItems(prev => [...prev, response.data])
            setSelectedCategory("")
            setSelectedProduct("")
            setQuantity(1)
        } catch (error) {
            console.log(error)
            Alert.alert("Erro", "Falha ao adicionar item, tente novamente")
        } finally {
            setLoadingAddItem(false)
        }
    }

    async function handleRemoveItem(item_id: number) {
        try {
            await api.delete("/order/remove", {
                params: { item_id: item_id }

            })

            const updatedItems = items.filter(item => item.id !== item_id);
            setItems(updatedItems);

            Alert.alert("Item removido", "Seu item foi removido da mesa.")
        } catch (error) {
            console.log(error)
            Alert.alert("Atencão", "Erro ao remover o item da mesa")
        }
    }

    function handleAdvance() {
        if (items.length === 0) return;
        router.push({
            pathname: "/(authenticated)/finish",
            params: { order_id: order_id, table: table }
        })
    }

    if (loadingCategory) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Mesa {table}</Text>
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="trash" size={20} color={colors.primary} />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            >
                <Select
                    label="Categorias"
                    placeholder="Selecione a categoria..."
                    options={categories.map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                    }))}
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                />

                {loadingProduct ? (
                    <ActivityIndicator
                        size="small"
                        color={colors.brand}
                    />
                ) : (
                    selectedCategory &&
                    <Select
                        placeholder="Selecione um produto.."
                        options={products.map((prod) => ({
                            label: prod.name,
                            value: prod.id,
                        }))}
                        selectedValue={selectedProduct}
                        onValueChange={setSelectedProduct}
                    />
                )}
                {selectedProduct && (
                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Quantidade</Text>
                        <QuantityControl
                            quantity={quantity}
                            onIncrement={() => setQuantity(quantity + 1)}
                            onDecrement={() => {
                                if (quantity <= 1) {
                                    setQuantity(1)
                                    return;
                                }
                                setQuantity((quantity) => quantity - 1)
                            }}
                        />
                    </View>
                )}

                {selectedProduct && (
                    <Button
                        title="Adicionar"
                        onPress={handleAddItem}
                        variant="secondary"
                        loading={loadingAddItem}
                        disabled={loadingAddItem}
                    />
                )}
                {items.length > 0 && (
                    <View style={styles.itemsSection}>
                        <Text style={styles.itemsTitle}>Itens adicionados</Text>
                        <View style={styles.itemsList}>
                            {items.map((item) => (
                                <OrderItem
                                    item={item}
                                    key={item.id}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </View>
                    </View>
                )}
                {items.length > 0 && (
                    <View style={styles.footer}>
                        <Button title="Avançar" onPress={handleAdvance} />
                    </View>
                )}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderBottomColor: colors.borderColor,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: fontSize.lg,
        color: colors.primary,
        fontWeight: "bold",
    },
    closeButton: {
        backgroundColor: colors.red,
        padding: spacing.sm,
        borderRadius: 8,
    },
    scrollContent: {
        padding: spacing.lg,
        gap: 14,
    },
    quantitySection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.md,
    },
    quantityLabel: {
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: "bold",
    },
    itemsSection: {
        marginTop: spacing.xl,
    },
    itemsTitle: {
        color: colors.primary,
        fontWeight: "bold",
        fontSize: fontSize.lg,
        marginBottom: spacing.md,
    },
    itemsList: {
        gap: spacing.sm,
    },
    footer: {
        paddingTop: 24,
    }
})