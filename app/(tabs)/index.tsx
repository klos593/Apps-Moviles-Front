import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FixItIntro from "../../components/animation";

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <FixItIntro
          onDone={() => {
            router.push("./home");
          }}
        />
      </SafeAreaView>
    </QueryClientProvider>
  );
}