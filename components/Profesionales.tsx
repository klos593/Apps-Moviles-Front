import { router } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import Card from "./TarjetaProfesional";
import { ProfessionalCardData } from "./Types/ProfessionalCardData";

type ProfessionalProps = {
    data: ProfessionalCardData[];
};

export default function Profesionales({ data }: ProfessionalProps) {
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
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