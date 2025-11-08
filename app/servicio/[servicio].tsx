import { getProfessionalsWithProfession } from "@/api/api";
import Profesionales from "@/components/Profesionales";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";


export default function ProfessionalsScreen() {
  const { servicio } = useLocalSearchParams();
  const queryClient = useQueryClient()
  const profession = Array.isArray(servicio) ? servicio[0] : servicio;
  const professionalsData = useQuery({ queryKey: [`${profession}Professionals`, profession], queryFn: () => getProfessionalsWithProfession(profession), enabled: !!profession, })

  if (professionalsData.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#007AFF" />
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
