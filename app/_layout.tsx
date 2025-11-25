import LoadingArc from "@/components/LoadingAnimation";
import { AuthProvider, useAuth } from "@/src/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

const queryClient = new QueryClient();

function AuthGate() {
  const { isBooting, token, mode } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isBooting) return; 

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (token && inAuthGroup) {
      if (mode === "user"){
        router.replace("/(tabs)");
      }else{
        router.replace("/(tabs)/serviciosActivos");
      }
    }
  }, [isBooting, token, segments, router, mode]);

  if (isBooting) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LoadingArc size={72} strokeWidth={10} />
      </View>
    );
  }
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