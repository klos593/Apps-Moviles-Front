// app/_layout.tsx
import React, { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { Stack, Link, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


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
          <Stack
            screenOptions={{
              headerTitle: () => (
                <Text style={styles.brand}>
                  <Text style={{ color: "#aef6c7" }}>Fix</Text>
                  <Text>It</Text>
                </Text>
              ),
              headerTitleAlign: "center",
              headerRight: () => (
                <Link href={"/paginaUsuario"} asChild>
                  <Pressable>
                    <Image
                      source={{
                        uri:
                          "https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153296/UserIcon_nzkkjz.png",
                      }}
                      style={styles.userIcon}
                    />
                  </Pressable>
                </Link>
              ),
              headerLeft: () => (
                <Pressable>
                  <Text style={styles.address}>Direccion</Text>
                </Pressable>
              ),
              headerStyle: { backgroundColor: "#294936" },
              headerBackVisible: false,
            }}
          >
            {/* Declare the screens you want custom options for (others can be auto-registered) */}
            <Stack.Screen name="index" />
            <Stack.Screen name="paginaLogIn" options={{ headerBackVisible: false }} />
            <Stack.Screen name="paginaRegistro" options={{ headerBackVisible: false }} />
            <Stack.Screen
              name="paginaUsuario"
              options={{
                headerTitle: () => (
                  <Text style={styles.brand}>
                    <Text style={{ color: "#aef6c7" }}>Fix</Text>
                    <Text>It</Text>
                  </Text>
                ),
                headerStyle: { backgroundColor: "#294936" },
                headerTintColor: "#aef6c7",
                headerRight: () => (
                  <Link href={"/paginaUsuario"} asChild>
                    <Pressable>
                      <Image
                        source={{
                          uri:
                            "https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153295/EditIcon_gjqs42.png",
                        }}
                        style={styles.userIcon}
                      />
                    </Pressable>
                  </Link>
                ),
                headerLeft: () => null,
              }}
            />
            {/* Dynamic and nested routes (auto): servicio/[servicio].tsx, profesional/*, paginaServicios.tsx, etc. */}
          </Stack>
        </AuthGate>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  userIcon: {
    width: 30,
    height: 33,
    resizeMode: "contain",
    paddingLeft: 5,
  },
  brand: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  address: {
    fontSize: 16,
    color: "#ffffffff",
    fontWeight: "500",
  },
});