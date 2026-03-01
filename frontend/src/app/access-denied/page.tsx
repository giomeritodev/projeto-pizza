import { logoutAction } from "@/actions/auth";
import Link from "next/link";
import { LogOut, ShieldX } from "lucide-react";
import { getUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function AccessDenied() {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-app-card border-app-border rounded-lg p-6 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-red-500 bg-opacity-20 rounded-full p-6">
                            <ShieldX size={64} className="" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Acesso Negado</h1>
                    <p className="text-gray-400 mb-2">Você não tem permissão para acessar o painel.</p>
                    <p className="text-gray-400 mb-6 text-sm">Caso ache que isso é um erro, consulte o responsável.</p>

                    {user && (
                        <div className="mt-4 text-center">
                            <form action={logoutAction}>
                                <Button
                                    type="submit"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sair
                                </Button>
                            </form>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}