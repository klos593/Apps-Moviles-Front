import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function BottomWhiteMask() {
  const insets = useSafeAreaInsets();
  const bottom = useBottomTabBarHeight();

  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: bottom + insets.bottom - 15,
          backgroundColor: "#F5F6FA",
          zIndex: 5,
        }}
      />
    </>
  );
}