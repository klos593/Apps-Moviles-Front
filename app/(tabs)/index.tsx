import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FixItIntro from "../../components/animation";
import { useAuth } from "@/src/auth/AuthContext";


export default function App() {
  const { mode } = useAuth()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FixItIntro
        onDone={() => {
          if (mode === "user"){
            router.replace("/(tabs)/home");
          }else{
            router.replace("/(tabs)/serviciosActivos");
      }
        }}
      />
    </SafeAreaView>
  );
}