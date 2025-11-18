import Profile from "@/components/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { BackHandler, View } from "react-native";

const queryClient = new QueryClient()


export default function Index() {

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        return true;
      });

      return () => sub.remove();
    }, [])
  );

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, }}>
        <Profile>

        </Profile>
      </View>
    </QueryClientProvider>
  );
}
