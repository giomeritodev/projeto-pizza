import PaymentPage from "./PaymentPage";
import { getToken } from "@/lib/auth";

export default async function Page() {
    const token = await getToken();
    return <PaymentPage token={token!} />;
}