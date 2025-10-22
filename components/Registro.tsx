import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView, Platform,
  Pressable,
  StyleSheet,
  Text, TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [pass2, setPass2]   = useState("");
  const [show1, setShow1]   = useState(false);
  const [show2, setShow2]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [acepta, setAcepta] = useState(false);

  const nombreOk = nombre.trim().length >= 2;
  const emailOk  = isEmail(email);
  const passOk   = pass.length >= 6;
  const matchOk  = pass === pass2 && pass2.length > 0;
  const formOk   = nombreOk && emailOk && passOk && matchOk && acepta && !loading;

  const onSubmit = async () => {

  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding" })} style={{ flex: 1 }}>
        <View style={styles.inner}>
          <Text style={styles.brand}>
            <Text style={{ color: "#5b8266" }}>Fix</Text>
            <Text>It</Text>
          </Text>
          <Text style={styles.title}>Crear cuenta</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={[styles.input, !nombreOk && nombre ? styles.inputError : null]}
              value={nombre} onChangeText={setNombre} placeholder="Tu nombre"
              returnKeyType="next"
            />
            {!nombreOk && nombre.length > 0 && <Text style={styles.helper}>Mínimo 2 caracteres.</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !emailOk && email ? styles.inputError : null]}
              value={email} onChangeText={setEmail} placeholder="tu@correo.com"
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
            />
            {!emailOk && email.length > 0 && <Text style={styles.helper}>Ingresá un email válido.</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[styles.input, !passOk && pass ? styles.inputError : null]}
                value={pass} onChangeText={setPass} placeholder="Mínimo 6 caracteres"
                secureTextEntry={!show1} autoCapitalize="none"
              />
              <Pressable onPress={() => setShow1(s=>!s)} style={styles.toggle}>
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
                value={pass2} onChangeText={setPass2} placeholder="Repetí tu contraseña"
                secureTextEntry={!show2} autoCapitalize="none"
              />
              <Pressable onPress={() => setShow2(s=>!s)} style={styles.toggle}>
                <Text style={styles.toggleText}>{show2 ? "Ocultar" : "Mostrar"}</Text>
              </Pressable>
            </View>
            {!matchOk && pass2.length > 0 && <Text style={styles.helper}>Las contraseñas no coinciden.</Text>}
          </View>

          <Pressable style={styles.row} onPress={() => setAcepta(a => !a)}>
            <View style={[styles.checkbox, acepta && styles.checkboxOn]} />
            <Text style={styles.rowText}>Acepto términos y condiciones</Text>
          </Pressable>

          <Pressable onPress={onSubmit} disabled={!formOk} style={[styles.primaryBtn, !formOk && styles.btnDisabled]}>
            {loading ? <ActivityIndicator /> : <Text style={styles.primaryText}>Crear cuenta</Text>}
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Ya tengo cuenta</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ 
    flex:1, 
    backgroundColor:"#fff" 
  },
  inner:{ 
    flex:1, 
    padding:20, 
    gap:16, 
    paddingTop:32 
  },
  brand:{ 
    fontSize:20, 
    fontWeight:"700", 
    textAlign:"center" 
  },
  title:{ 
    fontSize:24, 
    fontWeight:"800", 
    textAlign:"center", 
    marginTop:8 },

  field:{ 
    gap:8 
  },
  label:{ 
    fontSize:14, 
    color:"#444" 
  },
  input:{ 
    height:48, 
    backgroundColor:"#f2f2f2", 
    borderRadius:12, 
    paddingHorizontal:14, 
    borderWidth:1, 
    borderColor:"transparent" 
  },
  inputError:{ 
    borderColor:"#ff5a5f", 
    backgroundColor:"#fff5f5" 
  },
  helper:{ 
    color:"#ff5a5f", 
    fontSize:12 
  },

  toggle:{ 
    position:"absolute", 
    right:10, 
    top:10, 
    paddingHorizontal:8, 
    height:28, 
    justifyContent:"center" 
  },
  toggleText:{ 
    color:"#333", 
    fontWeight:"600" 
  },

  row:{ 
    flexDirection:"row", 
    alignItems:"center", 
    gap:10, 
    marginTop:4 
  },
  checkbox:{ 
    width:20, 
    height:20, 
    borderRadius:5, 
    borderWidth:1, 
    borderColor:"#bbb", 
    backgroundColor:"#fff" 
  },
  checkboxOn:{ 
    backgroundColor:"#3e6259" 
  },
  rowText:{ 
    color:"#333" 
  },

  primaryBtn:{ 
    height:50, 
    borderRadius:14, 
    backgroundColor:"#5b8266", 
    alignItems:"center", 
    justifyContent:"center", 
    marginTop:8 
  },
  primaryText:{ 
    color:"#fff", 
    fontSize:16, 
    fontWeight:"700" 
  },
  btnDisabled:{ 
    opacity:0.5 
  },

  secondaryBtn:{ 
    height:50, 
    borderRadius:14, 
    borderWidth:1, 
    borderColor:"#d9d9d9", 
    alignItems:"center", 
    justifyContent:"center" 
  },
  secondaryText:{ 
    color:"#111", 
    fontSize:16, 
    fontWeight:"700" 
  },
});
