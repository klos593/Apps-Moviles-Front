import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { CardData } from "./InfoTarjeta";

type CardProps = {
  data: CardData;
  onPress?: (data: CardData) => void;
};

export default function Card({ data, onPress }: CardProps) {
  return (
    <Pressable onPress={() => onPress?.(data)} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{data.title}</Text>
        {!!data.category && <Text style={styles.badge}>{data.category}</Text>}
      </View>
      {!!data.subtitle && <Text style={styles.cardSubtitle}>{data.subtitle}</Text>}
      {!!data.note && <Text style={styles.cardNote}>{data.note}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  card: {
    backgroundColor: "#f4f4f6", borderRadius: 16, padding: 12, marginBottom: 12,
    minHeight: 110, justifyContent: "center",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 16, fontWeight: "700", flexShrink: 1, paddingRight: 8 },
  badge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
    backgroundColor: "#ededf0", color: "#555", overflow: "hidden",
  },
  cardSubtitle: { marginTop: 6, color: "#333" },
  cardNote: { marginTop: 4, color: "#777", fontSize: 12 },
  empty: { textAlign: "center", marginTop: 24, color: "#777" },
});