import Profile from "@/components/Profile";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { BackHandler, View } from "react-native";

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
      <View style={{ flex: 1, }}>
        <Profile/>
      </View>
  );
}
