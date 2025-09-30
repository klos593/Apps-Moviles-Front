import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native"
import Profesionales from "@/components/Profesionales";

const data = {
    personas: [
        { id: "1", name: "John" },
        { id: "2", name: "Anna" },
    ],
    profesionales: [
        { id: "1", name: "Pepe" },
        { id: "2", name: "Lala" }, 
    ]
};

export default function ProfessionalsScreen() {
    const { profesional } = useLocalSearchParams<{ service: string }>();

    const professionals = data[profesional];

    return (
        <Profesionales data={professionals}/>
    );
}