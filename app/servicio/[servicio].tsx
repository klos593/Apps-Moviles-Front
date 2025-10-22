import Profesionales from "@/components/Profesionales";
import { useLocalSearchParams } from "expo-router";
import React from "react";


export default function ProfessionalsScreen() {
    const { servicio } = useLocalSearchParams<{ servicio: string }>();

    const filtered = 'a'

    return (
        <Profesionales data={filtered} />
    );
}
