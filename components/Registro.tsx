import { useAuth } from "@/src/auth/AuthContext";
import { Stack, router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingArc from "./LoadingAnimation";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => /^\+?\d{7,15}$/.test(v.replace(/\s|-/g, ""));

export default function Registro() {
  const { register } = useAuth();

  // --- Datos de cuenta ---
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acepta, setAcepta] = useState(false);

  // --- Dirección (obligatoria) ---
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState(""); // opcional
  const [postalCode, setPostalCode] = useState("");

  // Validaciones base
  const nombreOk = nombre.trim().length >= 2;
  const apellidoOk = apellido.trim().length >= 2;
  const telefonoOk = isPhone(telefono);
  const emailOk = isEmail(email);
  const passOk = pass.length >= 6;
  const matchOk = pass === pass2 && pass2.length > 0;

  // Dirección obligatoria (sin piso)
  const addressOk = useMemo(() => {
    const numOk = /^\d+$/.test(number.trim());
    const cpOk = /^\d+$/.test(postalCode.trim());
    return (
      country.trim().length > 0 &&
      province.trim().length > 0 &&
      street.trim().length > 0 &&
      numOk &&
      cpOk
    );
  }, [country, province, street, number, postalCode]);

  const formOk =
    nombreOk &&
    apellidoOk &&
    telefonoOk &&
    emailOk &&
    passOk &&
    matchOk &&
    acepta &&
    addressOk &&
    !loading;

  const onSubmit = async () => {
    if (!formOk) return;

    try {
      setLoading(true);

      const payload: any = {
        name: nombre.trim(),
        lastName: apellido.trim(),
        phone: telefono.replace(/\s|-/g, ""),
        email: email.trim().toLowerCase(),
        picture: "https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153295/UsuarioPlaceHolder_bzqamd.png",
        password: pass,
        address: {
          country: country.trim(),
          province: province.trim(),
          street: street.trim(),
          number: Number(number.trim()),
          floor: floor.trim() || "",  
          postalCode: Number(postalCode.trim()),
        },
      };

      await register(payload);
    } catch (e: any) {
      Alert.alert("No se pudo crear la cuenta", e?.message || "Intentalo de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inner}>
            <Text style={styles.brand}>
              <Text style={{ color: "#5b8266" }}>Fix</Text>
              <Text>It</Text>
            </Text>
            <Text style={styles.title}>Crear cuenta</Text>

            {/* Nombre */}
            <View className="field" style={styles.field}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={[styles.input, !nombreOk && nombre ? styles.inputError : null]}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Tu nombre"
                autoCapitalize="words"
                returnKeyType="next"
              />
              {!nombreOk && nombre.length > 0 && <Text style={styles.helper}>Mínimo 2 caracteres.</Text>}
            </View>

            {/* Apellido */}
            <View style={styles.field}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={[styles.input, !apellidoOk && apellido ? styles.inputError : null]}
                value={apellido}
                onChangeText={setApellido}
                placeholder="Tu apellido"
                autoCapitalize="words"
                returnKeyType="next"
              />
              {!apellidoOk && apellido.length > 0 && <Text style={styles.helper}>Mínimo 2 caracteres.</Text>}
            </View>

            {/* Teléfono */}
            <View style={styles.field}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={[styles.input, !telefonoOk && telefono ? styles.inputError : null]}
                value={telefono}
                onChangeText={setTelefono}
                placeholder="+54 11 1234 5678"
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              {!telefonoOk && telefono.length > 0 && (
                <Text style={styles.helper}>Ingresá un número válido (7–15 dígitos, puede incluir +).</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, !emailOk && email ? styles.inputError : null]}
                value={email}
                onChangeText={setEmail}
                placeholder="tu@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {!emailOk && email.length > 0 && <Text style={styles.helper}>Ingresá un email válido.</Text>}
            </View>

            {/* Contraseña */}
            <View style={styles.field}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={[styles.input, !passOk && pass ? styles.inputError : null]}
                  value={pass}
                  onChangeText={setPass}
                  placeholder="Mínimo 6 caracteres"
                  secureTextEntry={!show1}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShow1((s) => !s)} style={styles.toggle}>
                  <Text style={styles.toggleText}>{show1 ? "Ocultar" : "Mostrar"}</Text>
                </Pressable>
              </View>
              {!passOk && pass.length > 0 && <Text style={styles.helper}>Al menos 6 caracteres.</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Repetir contraseña</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={[styles.input, !matchOk && pass2 ? styles.inputError : null]}
                  value={pass2}
                  onChangeText={setPass2}
                  placeholder="Repetí tu contraseña"
                  secureTextEntry={!show2}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShow2((s) => !s)} style={styles.toggle}>
                  <Text style={styles.toggleText}>{show2 ? "Ocultar" : "Mostrar"}</Text>
                </Pressable>
              </View>
              {!matchOk && pass2.length > 0 && <Text style={styles.helper}>Las contraseñas no coinciden.</Text>}
            </View>

            <View style={styles.addressBlock}>
              <Text style={[styles.label, { fontWeight: "700" }]}>Dirección</Text>

              <View style={styles.field}>
                <Text style={styles.label}>País *</Text>
                <TextInput style={[styles.input, !country && styles.inputError]} value={country} onChangeText={setCountry} placeholder="Argentina" />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Provincia *</Text>
                <TextInput style={[styles.input, !province && styles.inputError]} value={province} onChangeText={setProvince} placeholder="Buenos Aires" />
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Calle *</Text>
                  <TextInput style={[styles.input, !street && styles.inputError]} value={street} onChangeText={setStreet} placeholder="Av. Siempre Viva" />
                </View>
                <View style={{ width: 110 }}>
                  <Text style={styles.label}>Número *</Text>
                  <TextInput
                    style={[styles.input, number && !/^\d+$/.test(number) ? styles.inputError : null]}
                    value={number}
                    onChangeText={setNumber}
                    placeholder="742"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Piso (opcional)</Text>
                  <TextInput style={styles.input} value={floor} onChangeText={setFloor} placeholder="3B / Casa" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Código Postal *</Text>
                  <TextInput
                    style={[styles.input, postalCode && !/^\d+$/.test(postalCode) ? styles.inputError : null]}
                    value={postalCode}
                    onChangeText={setPostalCode}
                    placeholder="1405"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              {!addressOk && (
                <Text style={styles.helper}>
                  Completá país, provincia, calle, número y código postal.
                </Text>
              )}
            </View>

            <Pressable style={styles.row} onPress={() => setAcepta((a) => !a)}>
              <View style={[styles.checkbox, acepta && styles.checkboxOn]} />
              <Text style={styles.rowText}>Acepto términos y condiciones</Text>
            </Pressable>


            <Pressable onPress={onSubmit} disabled={!formOk} style={[styles.primaryBtn, !formOk && styles.btnDisabled]}>
              {loading ? 
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <LoadingArc size={72} strokeWidth={10} />
              </View> : 
              <Text style={styles.primaryText}>Crear cuenta</Text>}
            </Pressable>

            <Pressable onPress={() => router.back()} style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>Ya tengo cuenta</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 24 }, // espacio al final para teclado
  inner: { flexGrow: 1, padding: 20, gap: 16, paddingTop: 32 },
  brand: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", marginTop: 8 },

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
  inputError: { borderColor: "#ff5a5f", backgroundColor: "#fff5f5" },
  helper: { color: "#ff5a5f", fontSize: 12 },

  toggle: {
    position: "absolute",
    right: 10,
    top: 10,
    paddingHorizontal: 8,
    height: 28,
    justifyContent: "center",
  },
  toggleText: { color: "#333", fontWeight: "600" },

  row: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#bbb",
    backgroundColor: "#fff",
  },
  checkboxOn: { backgroundColor: "#3e6259" },
  rowText: { color: "#333" },

  addressBlock: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f7faf8",
    borderWidth: 1,
    borderColor: "#e3eee7",
    gap: 10,
  },

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
  secondaryText: { color: "#111", fontSize: 16, fontWeight: "700" },
});