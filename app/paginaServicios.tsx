import Servicios from "@/components/Servicios";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import { View } from "react-native";

const queryClient = new QueryClient()

export default function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, }}>
        <Servicios />
      </View>
    </QueryClientProvider>
  );
}
