import FixItIntro from "@/components/animation";
import { AuthProvider, useAuth } from "@/src/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";

const queryClient = new QueryClient();

function AuthGate() {
  const { isBooting, token } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    if (isBooting || !isSplashAnimationFinished) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (token && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isBooting, isSplashAnimationFinished, token, segments, router]);

  if (isBooting || !isSplashAnimationFinished) {
    return (
      <FixItIntro 
        onDone={() => setSplashAnimationFinished(true)} 
      />
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </QueryClientProvider>
  );
}