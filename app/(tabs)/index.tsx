import { useAuth } from "@/src/auth/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { mode } = useAuth();
  
  const target = mode === "user" ? "/(tabs)/home" : "/(tabs)/serviciosActivos";
  
  return <Redirect href={target} />;
}