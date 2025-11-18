import { getProfessionalsWithProfession, getUser } from "@/api/api";
import LoadingArc from "@/components/LoadingAnimation";
import Profesionales from "@/components/Profesionales";
import { useAuthUser } from "@/src/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";


export default function ProfessionalsScreen() {
  const { servicio } = useLocalSearchParams();
  const profession = Array.isArray(servicio) ? servicio[0] : servicio;

  const { email } = useAuthUser();

  const user = useQuery({
    queryKey: ["User", email],
    queryFn: () => getUser(email),
  });

  const rawUserId = user.data?.id;

  const userId = rawUserId != null ? String(rawUserId) : undefined;

  const professionalsData = useQuery({
    queryKey: [`${profession}Professionals`, profession, userId], queryFn: () => getProfessionalsWithProfession(profession, userId as string),
    enabled: !!userId,
  })

  useFocusEffect(
    useCallback(() => {
      professionalsData.refetch();
    }, [])
  );

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
