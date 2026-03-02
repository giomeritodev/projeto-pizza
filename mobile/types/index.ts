export interface User {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    createdAt?: string;
}

export interface LoginResponse {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    token: string;
}

export interface Category {
    id: number;
    name: string;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    category_id: number;
    createdAt: string;
    category?: Category
}

export interface Item {
    id: number;
    amount: number;
    order_id: number;
    product_id: number;
    createdAt: string;
    product: Product
}

export interface CreateOrderRequest {
    table: number;
    name?: string;
}

export interface AddItemRequest {
    order_id: number;
    product_id: number;
    amount: number;
}

export interface SendORderRequest {
    order_Id: number;
}