import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { UserData } from "./InfoUser";

type CardProps = {
  data: UserData;
  onPress?: (data: UserData) => void;
};

export default function Card({ data, onPress }: CardProps) {
  return (
    <Pressable onPress={() => onPress?.(data)} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{data.name}</Text>
        {!!data.profession && <Text style={styles.badge}>{data.profession}</Text>}
      </View>
      {!!data.lastName && <Text style={styles.cardSubtitle}>{data.lastName}</Text>}
      {!!data.rating && <Text style={styles.cardNote}>{data.rating}</Text>}
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
    backgroundColor: "#aef6c7", color: "#555", overflow: "hidden", opacity: 0.7
  },
  cardSubtitle: { marginTop: 6, color: "#333" },
  cardNote: { marginTop: 4, color: "#777", fontSize: 12 },
  empty: { textAlign: "center", marginTop: 24, color: "#777" },
});