import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const handleLogIn = () => {
  router.push("/paginaServicios");
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; pass?: boolean }>(
    {}
  );

  const emailOk = isEmail(email);
  const passOk = pass.length >= 6;
  const formOk = emailOk && passOk;


  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={styles.inner}>
          <Text style={styles.brand}>
            <Text style={{ color: "#5b8266" }}>Fix</Text>
            <Text>It</Text>
          </Text>
          <Text style={styles.title}>Iniciar sesión</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                touched.email && !emailOk ? styles.inputError : null,
              ]}
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              returnKeyType="next"
            />
            {touched.email && !emailOk && (
              <Text style={styles.helper}>Ingresá un email válido.</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passWrap}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputNoMargin,
                  touched.pass && !passOk ? styles.inputError : null,
                ]}
                value={pass}
                onChangeText={setPass}
                onBlur={() => setTouched((t) => ({ ...t, pass: true }))}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry={!showPass}
                autoCapitalize="none"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={() => { }}
              />
              <Pressable
                onPress={() => setShowPass((s) => !s)}
                style={styles.toggle}
                accessibilityLabel={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <Text style={styles.toggleText}>{showPass ? "Ocultar" : "Mostrar"}</Text>
              </Pressable>
            </View>
            {touched.pass && !passOk && (
              <Text style={styles.helper}>La contraseña debe tener al menos 6 caracteres.</Text>
            )}
          </View>

          <Pressable
            onPress={handleLogIn}
            disabled={!formOk}
            style={[styles.primaryBtn, !formOk && styles.btnDisabled]}
          >
            <Text style={styles.primaryText}>Iniciar sesión</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push("/paginaRegistro")}>
            <Text style={styles.secondaryText}>Registrarse</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 16,
  },
  brand: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  title: { fontSize: 24, fontWeight: "800", marginTop: 8, textAlign: "center" },

  field: { gap: 8 },
  label: { fontSize: 14, color: "#444" },
  input: {
    height: 48,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputNoMargin: { marginBottom: 0 },
  inputError: { borderColor: "#ff5a5f", backgroundColor: "#fff5f5" },
  helper: { color: "#ff5a5f", fontSize: 12 },

  passWrap: { position: "relative" },
  toggle: {
    position: "absolute",
    right: 10,
    top: 10,
    height: 28,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  toggleText: { color: "#000000ff", fontWeight: "600" },

  primaryBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#5b8266",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },

  secondaryBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { color: "#000000ff", fontSize: 16, fontWeight: "700" },
});
