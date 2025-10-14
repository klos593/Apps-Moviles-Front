import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router, Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FixItIntro from "../components/Animation";

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}> 
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <FixItIntro
          onDone={() => {
            router.push("/paginaServicios")
          }}
        />
      </SafeAreaView>
    </QueryClientProvider>
  );
}