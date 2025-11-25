import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FixItIntro from "../../components/animation";


export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FixItIntro
        onDone={() => {
          router.push("./home");
        }}
      />
    </SafeAreaView>
  );
}