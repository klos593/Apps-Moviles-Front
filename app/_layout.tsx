import React, { useEffect } from "react";
import { Tabs, useRouter, useSegments, Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavBar from "@/components/NavBar";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "@/src/auth/AuthContext";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isBooting, token } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isBooting) return;
    
    const inAuthGroup = segments[0] === "auth"

    if (!token && !inAuthGroup) {
      router.replace("/auth");
      return;
    }
    if (token && inAuthGroup) {
      router.replace("/"); 
      return;
    }
  }, [isBooting, token, segments, router]);

  if (isBooting) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: "center"}}>
        <ActivityIndicator size="large"/>
      </View>
    )
  }
  return <Slot/>
}

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate>
          <Tabs
              tabBar={(props) => <NavBar {...props} />}
              screenOptions={{
                headerShown: false
              }}
            >
            <Tabs.Screen name="home" options={{ title: "Home" }} />
            <Tabs.Screen name="paginaHistorial" options={{title: "Historial"}}/>
            <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
            <Tabs.Screen name="index" options={{ headerShown: false }}/>
          </Tabs>
        </AuthGate>
      </AuthProvider>
    </QueryClientProvider>
  );
}