// ServiceTypeScreen.tsx
import { getProfessions } from "@/api/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { BottomWhiteMask } from "./BottomWhiteMask";


export default function ServiceTypeScreen() {
    const professionsQuery = useQuery({
        queryKey: ["professions"],
        queryFn: getProfessions,
    });

    const professionsData = professionsQuery.data ?? [];
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        console.log("Opción elegida:", selected);
    };

    return (
        <View style={{ flex: 1 }}>   {/* <- importante */}
            <View style={styles.container}>
                <View style={styles.gridContainer}>
                    {professionsData.map((opt) => {
                        const isSelected = selected === opt.id;
                        return (
                            <Pressable
                                key={opt.id}
                                style={[styles.card, isSelected && styles.cardSelected]}
                                onPress={() => setSelected(opt.id)}
                            >
                                <Image source={{ uri: opt.picture }} style={styles.serviceIcon} />
                                <Text style={styles.serviceText}>{opt.name}</Text>

                                {isSelected && (
                                    <View style={styles.checkBadge}>
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* Botón CONTINUAR debajo de todas las profesiones */}
                <Pressable onPress={handleContinue}>
                    <LinearGradient
                        colors={["#0f8c47ff", "#0ea599ff"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.continueButton}
                    >
                        <Text style={styles.continueText}>CONTINUAR</Text>
                    </LinearGradient>
                </Pressable>
            </View>
            <BottomWhiteMask />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 10,
        backgroundColor: "#FFFFFF",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 24,
    },
    card: {
        width: 110,
        height: 110,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#E0E0F0",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
        backgroundColor: "#FFFFFF",
        position: "relative",
    },
    cardSelected: {
        borderColor: "#00cb58b3",
        backgroundColor: "#ffffffff",
    },
    checkBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 20,
        height: 20,
        borderRadius: 999,
        backgroundColor: "#5b8266",
        alignItems: "center",
        justifyContent: "center",
    },
    continueButton: {
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
    },
    continueText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    serviceIcon: {
        width: 70,
        height: 70,
        resizeMode: "contain",
        borderRadius: 15,
    },
    serviceText: {
        fontWeight: "600",
        fontSize: 15,
        marginTop: 10,
    },
});