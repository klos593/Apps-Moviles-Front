import Profesionales from "@/components/Profesionales";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import InfoProfesionales from "../../assets/data";


export default function ProfessionalsScreen() {
    const { servicio } = useLocalSearchParams<{ servicio: string }>();

    const filtered = InfoProfesionales.filter(
        (p) => p.profession.toLowerCase() === servicio.toLowerCase()
    );

    return (
        <Profesionales data={filtered} />
    );
}
