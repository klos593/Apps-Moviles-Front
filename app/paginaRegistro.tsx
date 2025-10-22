import Registro from "@/components/Registro";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import { View } from "react-native";

const queryClient = new QueryClient()

export default function Index() {
  //falta agregar el address
  return (
    <QueryClientProvider client={queryClient}>
      <View
        style={{
          flex: 1,}}
      >
        <Registro/>
      </View>
    </QueryClientProvider>
  );
}
