import { requireAdmin } from "@/lib/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await requireAdmin()
    return (
        <div>
            {children}
        </div>
    )
}