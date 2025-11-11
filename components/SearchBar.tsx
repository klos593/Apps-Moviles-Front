import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
    onSearch: (text: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <View style={styles.searchWrap}>
        <TextInput
            onChangeText={onSearch}
            placeholder="Buscar..."
            style={styles.search}
            returnKeyType="search"
        />
        </View>
    );
    }

const styles = StyleSheet.create({
    searchWrap: {
        backgroundColor: "#F5F6FA",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 8
    },
    
    search: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#DDE2E5",
        color: "#0E0E0E",
        fontSize: 15,
    },
});