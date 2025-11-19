import { getProfessionals, getProfessions, getUser } from "@/api/api";
import SearchBar from "@/components/SearchBar";
import { useAuthUserOptional } from "@/src/auth/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { BottomWhiteMask } from "./BottomWhiteMask";
import LoadingArc from "./LoadingAnimation";
import Card from "./TarjetaProfesional";

export default function HomeScreen() {

  const { user: authUser, isBooting } = useAuthUserOptional();
  const email = authUser?.email;

  if (isBooting) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingArc />
      </View>
    );
  }

  const user = useQuery({
    queryKey: ["User", email],
    queryFn: () => getUser(email as string),
    enabled: !!email
  });

  const rawUserId = user.data?.id;

  const userId = rawUserId != null ? String(rawUserId) : undefined;

  const professionsQuery = useQuery({
    queryKey: ["professions"],
    queryFn: getProfessions,
  });

  const professionalsQuery = useQuery({
    queryKey: ["professionals", userId],
    queryFn: () => getProfessionals(userId as string),
    enabled: !!userId,
    refetchInterval: 10000

  });

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      professionalsQuery.refetch();
    }, [])
  );

  const professionsData = professionsQuery.data ?? [];
  const professionalsData = professionalsQuery.data ?? [];
  const [filteredData, setFilteredData] = useState(professionalsData);

  useEffect(() => {
    if (professionalsData.length) setFilteredData(professionalsData);
  }, [professionalsData]);

  const handleSearch = (keyWord: string) => {
    if (!keyWord.trim()) {
      setFilteredData(professionalsData);
      return;
    }

    const filtered = professionalsData.filter((element) =>
      (`${element.name.toLowerCase()} ${element.lastName.toLowerCase()}`).includes(
        keyWord.toLowerCase()
      )
    );

    setFilteredData(filtered);
  }

  if (professionalsQuery.isLoading || professionsQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingArc />
      </View>
    );
  }

  return (
    <><Stack.Screen options={{ gestureEnabled: false }} />
      <View style={styles.container}>
        <View style={styles.flatListServiceView}>
          <FlatList
            data={professionsData}
            renderItem={({ item }) => (
              <View style={styles.pressableWrapper}>
                <Pressable style={styles.servicePressable} onPress={() => router.push(`/home/servicio/${item.name.toLowerCase()}`)}>
                  <Image source={{ uri: item.picture }} style={styles.serviceIcon} />
                  <Text style={styles.serviceText}>
                    {item.name}
                  </Text>
                </Pressable>
              </View>
            )}
            horizontal={true}
            style={styles.flatListServices}
            showsHorizontalScrollIndicator={false} />
        </View>

        <View style={styles.titleView}>
          <Text style={styles.title}>
            Profesionales destacados
          </Text>
        </View>

        <SearchBar onSearch={handleSearch} />

        <View style={{ flex: 3.5 }}>
          <FlatList
            data={filteredData}
            key={1}
            numColumns={1}
            keyExtractor={(it) => it.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <Card data={item} onPress={() => router.push(`/home/profesional/${item.id}`)} />
              </View>
            )}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false} />
        </View>
        <View style={{ flex: 0.5 }}></View>
      </View>
      <BottomWhiteMask /></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  flatList: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  flatListContent: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },

  flatListServiceView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  servicePressable: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 13,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  pressableWrapper: {
    width: 120,
    marginTop: 8,
    marginHorizontal: 10,
    marginBottom: 13
  },

  flatListServices: {
    marginVertical: 3,
  },

  cardWrapper: {
    flex: 1,
  },

  serviceIcon: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    borderRadius: 15
  },

  serviceText: {
    fontWeight: 600,
    fontSize: 15,
    marginTop: 10
  },

  title: {
    fontSize: 25,
    fontWeight: 700
  },

  titleView: {
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  }
});