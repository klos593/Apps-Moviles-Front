import { getProfessionalsWithProfession } from "@/api/api";
import LoadingArc from "@/components/LoadingAnimation";
import Profesionales from "@/components/Profesionales";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";


export default function ProfessionalsScreen() {
  const { servicio } = useLocalSearchParams();
  const profession = Array.isArray(servicio) ? servicio[0] : servicio;
  const professionalsData = useQuery({ queryKey: [`${profession}Professionals`, profession], queryFn: () => getProfessionalsWithProfession(profession), enabled: !!profession, })

  if (professionalsData.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LoadingArc size={72} strokeWidth={10} />
      </View>
    );
  }

  if (!professionalsData.data) {
    return null;
  }

  return (
    <Profesionales data={professionalsData.data} />
  );
}
