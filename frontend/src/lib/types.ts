
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