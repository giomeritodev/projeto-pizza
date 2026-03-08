import { Reports } from "@/components/dashboard/reports";
import { requireAdmin } from "@/lib/auth";
import { getToken } from "@/lib/auth";

export default async function ReportsPage() {
    await requireAdmin(); // Apenas admin pode acessar relatórios
    const token = await getToken();
    return <Reports token={token!} />;
}