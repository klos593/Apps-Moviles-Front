import Profile from "@/components/Profile";
import { useAuth } from "@/src/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

const queryClient = new QueryClient()


export default function Index() {

    const { user, isBooting } = useAuth(); // <- no lanza error
  const router = useRouter();

  useEffect(() => {
    if (!isBooting && !user) {
      router.replace("/paginaLogIn");
    }
  }, [isBooting, user]);

  if (isBooting || !user) return null; // no montes Profile hasta tener user

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, }}>
        <Profile>

        </Profile>
      </View>
    </QueryClientProvider>
  );
}
