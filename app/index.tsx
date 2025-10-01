import { router, Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native";
import FixItIntro from "../components/Animation";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <FixItIntro
        onDone={() => {
          router.push("/paginaServicios")
        }}
      />
    </SafeAreaView>
  );
}