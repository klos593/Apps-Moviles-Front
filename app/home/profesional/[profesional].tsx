import { getProfessionalWithId } from "@/api/api";
import Profesional from "@/components/Profesional";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";


export default function UserScreen() {
    const { profesional } = useLocalSearchParams();
    const id = Array.isArray(profesional) ? profesional[0] : profesional;
    const professionalData = useQuery({ queryKey: ['professional', id], queryFn: () => getProfessionalWithId(id), enabled: !!id, })

    if (professionalData.isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: "center"}}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!professionalData.data) {
        return null;
    }

    return (

        <Profesional data={professionalData.data} />

    );
}