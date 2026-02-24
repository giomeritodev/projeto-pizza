"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { registerUser } from "@/actions/auth";

export function RegisterForm() {

    const [state, formAction, isPending] = useActionState(registerUser, null);
    

    useEffect(() => {
        if (state?.success && state.redirectTo) {
            window.location.href = state.redirectTo;
        }
    }, [state]);

    return (
        <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
                    Visão<span className="text-brand-primary">Sistemas</span>
                </CardTitle>
                <CardContent>
                    <form className="space-y-4" action={formAction}>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Nome</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Digite seu nome"
                                required
                                minLength={3}
                                className="text-white bg-app-card border border-app-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Digite seu email"
                                required
                                className="text-white bg-app-card border border-app-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Senha</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Digite sua senha"
                                required
                                minLength={3}
                                className="text-white bg-app-card border border-app-border"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"
                        >
                            {isPending ? "Registrando..." : "Criar conta"}
                        </Button>
                        <p className="text-center text-sm text-gray-100">
                            Já tem uma conta? <Link className="text-brand-primary font-semibold" href="/login">Faça login</Link>
                        </p>
                    </form>
                </CardContent>
            </CardHeader>
        </Card>
    );
}