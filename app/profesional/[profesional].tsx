import Profesional from "@/components/Profesional";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import profesionales from "@/assets/data"


export default function UserScreen() {
    const { profesional } = useLocalSearchParams<{ profesional: string }>();

    const profesionalData = (profesionales.find(
        (u) => u.id.toString() === profesional
    ));

    return (
        <Profesional data={profesionalData} />
    );
}