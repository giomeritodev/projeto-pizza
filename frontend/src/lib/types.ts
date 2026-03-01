
export interface User {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    createdAt: string;
}

export interface AuthResponse {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    token: string;
}

export interface Category {
    id: number;
    name: string;
    createdAt: string
}
export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number; // price in cents
    banner?: string | null;
    category_id: number;
    /** category relation returned by the API */
    category?: Category;
    createdAt: string;
    disabled: boolean;
}

export interface Items {
    id: number;
    amount: number;
    product: {
        id: number;
        name: string;
        price: number;
        description: string;
        banner: string;
    }
}

export interface Order {
    id: number;
    table: number;
    name?: string;
    status: boolean; // false = produção, true = finalizado
    draft: boolean; //true = rascunho, false = enviado para produção
    createdAt: string;
    items?: Items[]
}