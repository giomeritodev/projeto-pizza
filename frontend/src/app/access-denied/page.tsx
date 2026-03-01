import { logoutAction } from "@/actions/auth";
import Link from "next/link";
import { Lock } from "lucide-react";


export default function AccessDenied() {
    return (
        <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 flex justify-center">
                    <div className="bg-red-500 bg-opacity-20 rounded-full p-6">
                        <Lock size={64} className="text-red-500" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Acesso Negado</h1>
                <p className="text-gray-400 mb-6">Você não tem permissão para acessar esta página.</p>
                <Link onClick={logoutAction} href="/login" className="text-brand-primary hover:underline">Voltar para o login</Link>
            </div>
        </div>
    );
}