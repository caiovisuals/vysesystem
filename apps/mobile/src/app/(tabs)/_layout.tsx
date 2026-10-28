import { Tabs } from "expo-router"

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
            <Tabs.Screen name="sales" options={{ title: "Vendas" }} />
            <Tabs.Screen name="orders" options={{ title: "Pedidos" }} />
            <Tabs.Screen name="tax" options={{ title: "Fiscal" }} />
            <Tabs.Screen name="settings" options={{ title: "Configurações" }} />
        </Tabs>
    )
}