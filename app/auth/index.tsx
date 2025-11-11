import React, { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "@/src/auth/AuthContext";
import LogIn from "@/components/LogIn";

export default function PaginaLogIn() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await login({ email, password });

    } catch (e: any) {
      Alert.alert("Login failed", e?.message || "Check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LogIn
    />
  );
}