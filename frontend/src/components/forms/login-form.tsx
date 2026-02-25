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
import { loaginAction } from "@/actions/auth";
import { stat } from "fs";

export function LoginForm() {

    const [state, formAction, isPending] = useActionState(loaginAction, null);


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
                            {isPending ? "Acessando conta..." : "Acessar"}
                        </Button>
                        {
                            state?.error && (
                                <div className="text-sm bg-red-50 p-3 rounded-md text-sm text-red-500">{state.error}</div>
                            )
                        }
                        <p className="text-center text-sm text-gray-100">
                            Ainda não tem uma conta? <Link className="text-brand-primary font-semibold" href="/register">Cria uma conta</Link>
                        </p>
                    </form>
                </CardContent>
            </CardHeader>
        </Card>
    );
}