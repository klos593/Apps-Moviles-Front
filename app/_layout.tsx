import { AuthProvider, useAuth } from "@/src/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router"; // <-- Importa Slot
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native"; // Para el loading

const queryClient = new QueryClient();

function AuthGate() {
  const { isBooting, token } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isBooting) return; // No hacer nada mientras carga

    // 'segments[0]' ahora será '(auth)' o '(tabs)'
    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      // Si no hay token y NO estamos en el grupo (auth),
      // te mando al login.
      router.replace("/(auth)"); // Expo Router sabe que está en (auth)/paginaLogIn
    } else if (token && inAuthGroup) {
      // Si hay token y SÍ estamos en el grupo (auth) (ej. en el login),
      // te mando a la home de la app (que está en el grupo tabs).
      router.replace("/(tabs)"); // Expo Router sabe que / es (tabs)/index
    }
  }, [isBooting, token, segments, router]); // Agregamos router a las dependencias

  // Mientras bootea, mostramos un loader para evitar "parpadeos"
  if (isBooting) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // <Slot /> renderizará el layout (auth) o (tabs) según la ruta
  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate></AuthGate>
      </AuthProvider>
    </QueryClientProvider>
  );
}