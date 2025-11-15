import NavBar from "@/components/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import React from "react";
import { useAuth } from "../../src/auth/AuthContext";

export default function RootLayout() {
    const queryClient = new QueryClient();
    const { mode } = useAuth();

    if (mode === "user"){

    return (
        <QueryClientProvider client={queryClient}>
            <Tabs
                tabBar={(props) => <NavBar {...props} />}
                screenOptions={{
                    headerShown: false
                }}
                >
                <Tabs.Screen name="home" options={{ title: "Home" }} />
                <Tabs.Screen name="historial" options={{title: "Historial"}}/>
                <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
                <Tabs.Screen name="index" options={{ headerShown: false }}/>
            </Tabs>
        </QueryClientProvider>
    );
}
else {
        return (
        <QueryClientProvider client={queryClient}>
            <Tabs
                tabBar={(props) => <NavBar {...props} />}
                screenOptions={{
                    headerShown: false
                }}
                >
                <Tabs.Screen name="historial" options={{title: "Historial"}}/>
                <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
            </Tabs>
        </QueryClientProvider>
    );
}
}