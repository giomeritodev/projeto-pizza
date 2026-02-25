

export default function AccessDenied() {
    return (
        <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Acesso Negado</h1>
                <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
            </div>
        </div>
    );
}