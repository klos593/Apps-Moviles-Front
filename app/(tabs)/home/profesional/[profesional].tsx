import { getProfessionalWithId } from "@/api/api";
import LoadingWheel from "@/components/LoadingAnimation";
import Profesional from "@/components/Profesional";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";


export default function UserScreen() {
    const { profesional } = useLocalSearchParams();
    const id = Array.isArray(profesional) ? profesional[0] : profesional;
    const professionalData = useQuery({
        queryKey: ['professional', id], queryFn: () => getProfessionalWithId(id),
        enabled: !!id,
    })

    useFocusEffect(
        useCallback(() => {
            professionalData.refetch();
        }, [])
    );

    if (professionalData.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <LoadingWheel />
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