import { getProfessionals, getProfessions } from "@/api/api";
import { useQuery } from '@tanstack/react-query';
import { router, Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import Card from "./TarjetaProfesional";

export default function HomeScreen() {

  const professionsData = useQuery({ queryKey: ['professions'], queryFn: getProfessions })
  const professionalsData = useQuery({ queryKey: ['professionals'], queryFn: getProfessionals });

  if (professionalsData.isLoading || professionsData.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: "center"}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }
  return (
    <><Stack.Screen
      options={{
        gestureEnabled: false
      }} /><View style={styles.container}>
        <View style={styles.flatListServiceView}>
          <FlatList
            data={professionsData.data}
            renderItem={({ item }) => (
              <Pressable style={styles.servicePressable} onPress={() => router.push(`/servicio/${item.name.toLowerCase()}`)}>
                <Image source={{ uri: item.picture }} style={styles.serviceIcon} />
                <Text style={styles.serviceText}>
                  {item.name}
                </Text>
              </Pressable>
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

        <View style={{ flex: 3.5 }}>
          <FlatList
            data={professionalsData.data}
            key={1}
            numColumns={1}
            keyExtractor={(it) => it.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <Card data={item} onPress={() => router.push(`/profesional/${item.id}`)} />
              </View>
            )}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false} />
        </View>
      </View></>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  flatList: {
    flex: 1,
    backgroundColor: "#fff",
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
    flex: 1,
    marginRight: 6,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f6",
    paddingHorizontal: 15,
    borderRadius: 15
  },

  flatListServices: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 5,
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
    marginTop: 6
  },

  title: {
    fontSize: 25,
    fontWeight: 700
  },

  titleView: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
});