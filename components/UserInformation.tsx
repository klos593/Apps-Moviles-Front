import { getUser, updateUser } from "@/api/api";
import { useAuthUser } from "@/src/auth/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import LoadingArc from "./LoadingAnimation";


export default function ProfileNotifications() {
  const { email } = useAuthUser();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["User", email],
    queryFn: () => getUser(email),
  });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState<string>("");

  useEffect(() => {
    if (user && !editing) {
      setName(user?.name ?? "");
      setLastName(user?.lastName ?? "");
      setPhone(user?.phone ?? "");
      setStreet(user?.street ?? "");
      setNumber(
        String(user?.number) ?? ""
      );
    }
  }, [user, editing]);

  const mutation = useMutation({
    mutationFn: (payload: {
      name: string;
      lastName: string;
      phone: string;
      street: string;
      number: number;
    }) => updateUser(email, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["User", email] });
      setEditing(false);
      router.replace("/(tabs)/perfil");
    },
  });

  const onPressMain = () => {
    if (!editing) {
      setEditing(true);
      return;
    }
    mutation.mutate({
      name,
      lastName,
      phone: phone,
      street: street,
      number: Number(number),
    });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Datos Personales</Text>

      <View style={styles.card}>
        <Row label="Nombre" value={name} editable={editing} onChangeText={setName} />
        <Row label="Apellido" value={lastName} editable={editing} onChangeText={setLastName} />
        <Row label="Mail" value={user?.mail} />
        <Row label="Teléfono" value={phone} editable={editing} onChangeText={setPhone} keyboardType="phone-pad" />
        <Row label="Calle" value={street} editable={editing} onChangeText={setStreet} />
        <Row label="Número" value={number} editable={editing} onChangeText={setNumber} keyboardType="numeric" last />
      </View>

      <Pressable
        style={[styles.editButton, editing && styles.saveButton]}
        onPress={onPressMain}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <LoadingArc size={72} strokeWidth={10} />
          </View>
        ) : (
          <Text style={styles.editButtonText}>
            {editing ? "Guardar cambios" : "Editar información"}
          </Text>
        )}
      </Pressable>

      {editing && (
        <Pressable
          style={styles.cancelButton}
          onPress={() => setEditing(false)}
          disabled={mutation.isPending}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      )}
    </View>
  );
}

function Row({
  label,
  value,
  last,
  editable,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value?: string;
  last?: boolean;
  editable?: boolean;
  onChangeText?: (t: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      {editable && onChangeText ? (
        <TextInput
          value={value ?? ""}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder="-"
          keyboardType={keyboardType ?? "default"}
          autoCapitalize="none"
        />
      ) : (
        <Text style={styles.rowValue}>{value || "-"}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginTop: 6, marginBottom: 14, color: "#1F2D3D" },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 16,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6EAF0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: { flex: 1, fontWeight: "600", color: "#516072" },
  rowValue: { flex: 2, color: "#1F2D3D", textAlign: "right" },
  input: {
    flex: 2,
    textAlign: "right",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F3F5F9",
    borderRadius: 10,
    color: "#1F2D3D",
  },
  editButton: {
    backgroundColor: "#5b8266",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveButton: { backgroundColor: "#2f6b45" },
  editButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#e6ebf2",
  },
  cancelButtonText: { color: "#516072", fontSize: 15, fontWeight: "600" },
});