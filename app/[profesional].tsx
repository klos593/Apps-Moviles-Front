import Profesionales from "@/components/Profesionales";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import InfoProfesionales from "../assets/data";


export default function ProfessionalsScreen() {
    const { profesional } = useLocalSearchParams<{ profesional: string }>();

    const filtered = InfoProfesionales.filter(
        (p) => p.profession.toLowerCase() === profesional.toLowerCase()
    );

    return (
        <Profesionales data={filtered} />
    );
}
