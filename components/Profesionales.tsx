import { router } from "expo-router";
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
import Card from "./TarjetaProfesional";
import { ProfessionalCardData } from "./Types/ProfessionalCardData";

type ProfessionalProps = {
    data: ProfessionalCardData[];
};

export default function Profesionales({data}: ProfessionalProps) {
    
const [filteredData, setFilteredData] = useState(data);

const filterData = (keyWord: string) => {
        setFilteredData(data.filter(element => (`${element.name.toLowerCase()} ${element.lastName.toLowerCase()}`).includes(keyWord.toLowerCase())))
    }
return (

    <View style={styles.container}>

    <View style={styles.searchWrap}>
        <TextInput
        onChangeText={keyWord => filterData(keyWord)}
        placeholder="Buscar..."
        style={styles.search}
        returnKeyType="search"
        />
        <Pressable onPress={() => console.log("Mapa")}>
            <Image source={{uri: 'https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153295/Mapa_m1mc95.png'}} style={styles.mapBtn}/>
        </Pressable>
    </View>

    <FlatList
        data={filteredData}
        key={1} 
        numColumns={1}
        keyExtractor={(it) => it.id.toString()}
        renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
            <Card data={item} onPress={() => router.push(`/profesional/${item.id}`)} />
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