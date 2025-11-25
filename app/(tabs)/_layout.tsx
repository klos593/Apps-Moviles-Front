import NavBar from "@/components/NavBar";
import { Tabs } from "expo-router";
import React from "react";
import { useAuth } from "../../src/auth/AuthContext";

export default function RootLayout() {
    const { mode } = useAuth();

    if (mode === "user"){

    return (
        <Tabs
            tabBar={(props) => <NavBar {...props} />}
            screenOptions={{
                headerShown: false
            }}
            >
            <Tabs.Screen name="home" options={{ title: "Home" }} />
            <Tabs.Screen name="historial" options={{title: "Historial"}}/>
            <Tabs.Screen name="serviciosActivos" options={{ title: "Próximos" }} />
            <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
            <Tabs.Screen name="index" options={{ headerShown: false }}/>
        </Tabs>
    );
}
else {
        return (
        <Tabs
            tabBar={(props) => <NavBar {...props} />}
            screenOptions={{
                headerShown: false
            }}
            >
            <Tabs.Screen name="historial" options={{title: "Historial"}}/>
            <Tabs.Screen name="serviciosActivos" options={{ title: "Próximos" }} />
            <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
        </Tabs>
);
}
}