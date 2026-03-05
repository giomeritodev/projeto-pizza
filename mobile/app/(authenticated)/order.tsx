import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react";
import { Category, Product } from "@/types";
import api from "@/services/api";
import { colors, fontSize, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Select } from "@/components/Select";

export default function Order() {
    const router = useRouter()
    const insets = useSafeAreaInsets();
    const { order_id, table } = useLocalSearchParams<{
        order_id: string;
        table: string;
    }>();
    const [loadingCategory, setLoadingCategory] = useState(true)
    const [loadingProduct, setLoadingProduct] = useState(true)
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedProduct, setSelectedProduct] = useState("")
    const [products, setProducts] = useState<Product[]>([])

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

            <ScrollView style={styles.scrollContent}>
                <Select
                    label="Categorias"
                    placeholder="Selecione a categoria..."
                    options={categories.map(cat => ({
                        label: cat.name,
                        value: cat.id
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
        gap: 14
    }
})