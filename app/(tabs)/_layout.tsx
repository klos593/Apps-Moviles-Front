import NavBar from "@/components/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import React from "react";

export default function RootLayout() {
    const queryClient = new QueryClient();

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