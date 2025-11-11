import { getUser, updateUser } from "@/api/api";
import { useAuthUser } from "@/src/auth/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";


export default function ProfileNotifications() {
  const { email } = useAuthUser();
  const qc = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["User", email],
    queryFn: () => getUser(email),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });

  // Cargar datos iniciales al form cuando llega el user
  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name ?? "",
        lastName: user?.lastName ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        address: user?.address ?? "",
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: () => updateUser(email, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["User", email] });
      setIsEditing(false);
    },
  });

  const onPressPrimary = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      mutation.mutate();
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Notificaciones</Text>

      <View style={styles.card}>
        <EditableRow
          label="Nombre"
          value={form.name}
          editing={isEditing}
          onChangeText={(t) => setForm((s) => ({ ...s, name: t }))}
        />
        <EditableRow
          label="Apellido"
          value={form.lastName}
          editing={isEditing}
          onChangeText={(t) => setForm((s) => ({ ...s, lastName: t }))}
        />
        <InfoRow label="Mail" value={user?.mail} />
        <EditableRow
          label="Teléfono"
          value={form.phoneNumber}
          editing={isEditing}
          keyboardType="phone-pad"
          onChangeText={(t) => setForm((s) => ({ ...s, phoneNumber: t }))}
        />
        <EditableRow
          label="Dirección"
          value={form.address}
          editing={isEditing}
          last
          onChangeText={(t) => setForm((s) => ({ ...s, address: t }))}
        />
      </View>

      <Pressable
        style={[styles.editButton, mutation.isPending && { opacity: 0.7 }]}
        onPress={onPressPrimary}
        disabled={mutation.isPending}
      >
        <Text style={styles.editButtonText}>
          {isEditing ? (mutation.isPending ? "Guardando..." : "Guardar") : "Editar información"}
        </Text>
      </Pressable>
    </View>
  );
}

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || "-"}</Text>
    </View>
  );
}

function EditableRow({
  label,
  value,
  editing,
  last = false,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  editing: boolean;
  last?: boolean;
  onChangeText: (t: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad";
}) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      {editing ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          placeholder="-"
          style={styles.input}
        />
      ) : (
        <Text style={styles.rowValue}>{value || "-"}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 14,
    color: "#1F2D3D",
  },
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
  rowLabel: {
    flex: 1,
    fontWeight: "600",
    color: "#516072",
  },
  rowValue: {
    flex: 1,
    color: "#1F2D3D",
    textAlign: "right",
  },
  input: {
    flex: 1,
    textAlign: "right",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F4F7FA",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D9E1EA",
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
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});