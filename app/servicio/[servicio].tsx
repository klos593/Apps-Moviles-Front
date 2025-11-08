import { getProfessionalsWithProfession } from "@/api/api";
import Profesionales from "@/components/Profesionales";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";


export default function ProfessionalsScreen() {
  const { servicio } = useLocalSearchParams();
  const profession = Array.isArray(servicio) ? servicio[0] : servicio;
  const professionalsData = useQuery({ queryKey: [`${profession}Professionals`, profession], queryFn: () => getProfessionalsWithProfession(profession), enabled: !!profession, })

  if (professionalsData.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: "center"}}>
        <ActivityIndicator size="large"/>
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
