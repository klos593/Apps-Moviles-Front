import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import type { UserData } from "./InfoUser";
import Card from "./TarjetaProfesional";

type ProfesionalesProps = {
  data: UserData[];
};

export default function Profesionales({data}: ProfesionalesProps) {
const [q, setQ] = useState("");
const router = useRouter();

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
        <Pressable onPress={() => console.log("Mapa")}>
            <Image source={require('../assets/images/Mapa.png')} style={styles.mapBtn}/>
        </Pressable>
    </View>

    <FlatList
        data={data}
        key={1} 
        numColumns={1}
        keyExtractor={(it) => it.id.toString()}
        renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
            <Card data={item} onPress={() => console.log(item.name)} />
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
    width: 40, 
    height: 38, 
    resizeMode: "contain"
},

searchWrap: { 
    backgroundColor: "#fff",
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16
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