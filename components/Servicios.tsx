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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

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
    <><Stack.Screen options={{ gestureEnabled: false}}/>
    <View style={styles.container}>
        <View style={styles.flatListServiceView}>
          <FlatList
            data={professionsData.data}
            renderItem={({ item }) => (
              <View style={styles.pressableWrapper}>
                <Pressable style={styles.servicePressable} onPress={() => router.push(`/servicio/${item.name.toLowerCase()}`)}>
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
        <BottomWhiteMask />
      </View></>
  );
}

function BottomWhiteMask() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: tabBarHeight + insets.bottom - 10,
          backgroundColor: "#fff",
          zIndex: 5,
        }}
      />
    </>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f6",
    borderRadius: 15,
    paddingVertical: 13
  },

  pressableWrapper: {
    width: 120,
    marginTop: 8,
    marginHorizontal: 10
  },

  flatListServices: {
    marginVertical: 8,
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
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
});