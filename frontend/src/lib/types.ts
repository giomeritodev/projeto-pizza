
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
    banner_url?: string | null;
    category_id: number;
    createdAt: string;
    disabled: boolean;
}