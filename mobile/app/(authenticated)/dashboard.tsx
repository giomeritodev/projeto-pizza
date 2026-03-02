import { Button } from "@/components/button";
import { useAuth } from "@/contexts/AuthContext";
import { Text, View } from "react-native";


export default function Dashboard() {
    const { signOut } = useAuth()
    return (
        <View>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Text>Pagina de Dashboard</Text>
            <Button title="Sair" onPress={signOut} />
        </View>
    )
}