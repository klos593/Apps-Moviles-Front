// app/_layout.tsx
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { Tabs, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavBar from "@/components/NavBar";

import { AuthProvider, useAuth } from "@/src/auth/AuthContext";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isBooting, token } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isBooting) return;

    
    const first = segments[0]; 
    const inAuth = first === "paginaLogIn" || first === "paginaRegistro";

    if (!token && !inAuth) {
      router.replace("/paginaLogIn");
      return;
    }
    if (token && inAuth) {
      router.replace("/"); 
      return;
    }
  }, [isBooting, token, segments]);

  return <>{children}</>;
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
                headerTitle: () => (
                  <Text style={styles.brand}>
                    <Text style={{ color: "#aef6c7" }}>Fix</Text>
                    <Text>It</Text>
                  </Text>
                ),
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#294936" },
              }}
            >
            <Tabs.Screen name="paginaServicios" options={{ title: "Home" }} />
            <Tabs.Screen name="paginaUsuario" options={{ title: "Perfil" }} />
            <Tabs.Screen name="index" options={{ headerShown: false }}/>
          </Tabs>
        </AuthGate>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
});