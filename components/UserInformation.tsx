import { getUser } from "@/api/api";
import { useAuthUser } from "@/src/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileNotifications() {
  const { email } = useAuthUser();
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["User", email],
    queryFn: () => getUser(email),
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Notificaciones</Text>

      <View style={styles.card}>
        <InfoRow label="Nombre" value={user?.name} />
        <InfoRow label="Apellido" value={user?.lastName} />
        <InfoRow label="Mail" value={user?.mail} />
        <InfoRow label="Teléfono" value={user?.phoneNumber} />
        <InfoRow label="Dirección" value={user?.address} last />
      </View>

      {/* Botón verde para editar información */}
      <Pressable
        style={styles.editButton}
      >
        <Text style={styles.editButtonText}>Editar información</Text>
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
    justifyContent: "space-between",
  },
  rowLabel: {
    fontWeight: "600",
    color: "#516072",
  },
  rowValue: {
    color: "#1F2D3D",
    maxWidth: "60%",
    textAlign: "right",
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