import React, { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import BaseInfo from "../assets/data";
import type { CardData } from "./InfoTarjeta";
import Card from "./TarjetaServicio";


const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function DirectoryWithCards() {
  const [items] = useState<CardData[]>(BaseInfo);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const n = normalize(q);
    return items.filter((it) =>
      [it.title, it.subtitle ?? "", it.category ?? "", it.note ?? ""]
        .map(normalize)
        .some((t) => t.includes(n))
    );
  }, [items, q]);

  return (

    <View style={styles.container}>

      <View style={styles.searchWrap}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Buscar..."
          style={styles.search}
          returnKeyType="search"
        />
        <Pressable style={styles.mapBtn} onPress={() => console.log("Mapa")}>
          <Text style={styles.mapBtnText}>Mapa</Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        key={1} 
        numColumns={1}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <Card data={item} onPress={(d) => console.log("open", d.title)} />
          </View>
        )}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No hay resultados.</Text>}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  logo: { 
    flex: 1, 
    textAlign: "center", 
    fontSize: 18, 
    fontWeight: "600",
  },
  mapBtn: {
    flex: 0.3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  mapBtnText: { 
    fontWeight: "600" 
  },

  searchWrap: { 
    backgroundColor: "#fff",
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
  },
  search: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: "#fafafa",
  },

  flatList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  
  flatListContent: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },

  cardWrapper: {
    flex: 1,
  },

  empty: { 
    textAlign: "center", 
    marginTop: 24, 
    color: "#777" 
  },
});