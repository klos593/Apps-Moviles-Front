/*import LogIn from "@/components/LogIn";
import React from "react";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,}}
    >
      <LogIn/>
    </View>
  );
}*/

// App.tsx
import React from "react";
import { SafeAreaView } from "react-native";
import FixItIntro from "../components/animation";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FixItIntro
        fixColor="#22C55E"     // 'Fix' green
        itColor="#0F172A"      // 'It' slate-900
        revealColor="#0EA5E9"  // final background cyan
        onDone={() => {
          // navigate or start fetching, etc.
        }}
      />
    </SafeAreaView>
  );
}

