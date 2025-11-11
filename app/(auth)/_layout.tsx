// app/(auth)/_layout.tsx
import { AuthProvider } from "@/src/auth/AuthContext";
import { Slot } from "expo-router";
import React from "react";

export default function AuthLayout() {
  // Ocultamos el header en las pantallas de auth
  return (<AuthProvider><Slot screenOptions={{ headerShown: false }} /></AuthProvider>)
}