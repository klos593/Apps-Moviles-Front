import { getProfessionals, getProfessions } from "@/api/api";
import { useQuery } from '@tanstack/react-query';
import { router, Stack } from "expo-router";
import { React, useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Card from "./TarjetaProfesional";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import SearchBar from "@/components/SearchBar"

export default function HomeScreen() {

  const professionsQuery = useQuery({
    queryKey: ["professions"],
    queryFn: getProfessions,
  });

  const professionalsQuery = useQuery({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
  });

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
            data={professionsData}
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

        <SearchBar onSearch={handleSearch} />

        <View style={{ flex: 3.5 }}>
          <FlatList
            data={filteredData}
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
      </View>
    <BottomWhiteMask/></>
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
          backgroundColor: "#F5F6FA",
          zIndex: 5,
        }}
      />
    </>
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
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  searchWrap: {
    backgroundColor: "#F5F6FA",
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },

  search: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#DDE2E5",
    color: "#0E0E0E",
    fontSize: 15,
  },
});