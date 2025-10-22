import { getProfessionalWithId } from "@/api/api";
import Profesional from "@/components/Profesional";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";


export default function UserScreen() {
    const { profesional } = useLocalSearchParams();
    const queryClient = useQueryClient()
    const id = Array.isArray(profesional) ? profesional[0] : profesional;
    const professionalData = useQuery({ queryKey: ['professional', id], queryFn: () => getProfessionalWithId(id), enabled: !!id, })
    if (!professionalData.data) {
        return null; 
    }

    return (

        <Profesional data={professionalData.data} />

    );
}