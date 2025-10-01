import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import BaseProfesionales from "../assets/data";
import BaseInfo from "../assets/services";
import type { UserData } from "./InfoUser";
import Card from "./TarjetaProfesional";

export default function DirectoryWithCards() {

  const [profesionales] = useState<UserData[]>(BaseProfesionales);

  return (
    <><Stack.Screen
      options={{
        gestureEnabled: false
      }} /><View style={styles.container}>
        <View style={styles.flatListServiceView}>
          <FlatList
            data={BaseInfo}
            renderItem={({ item }) => (
              <Pressable style={styles.serviceView} onPress={() => router.push(`/${item.title.toLowerCase()}`)}>
                <Image source={item.icon} style={styles.serviceIcon} />
                <Text style={styles.serviceText}>
                  {item.title}
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
            data={profesionales}
            key={1}
            numColumns={1}
            keyExtractor={(it) => it.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <Card data={item} onPress={() => router.push(`/${item.id}`)} />
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

  flatListServiceView:{
    flex:1, 
    justifyContent:"center",
    alignItems:"center"
  },

  serviceView:{
    flex:1,
    margin:10,
    justifyContent:"center",
    alignItems:"center",
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
    width: 90,
    height: 90,
    resizeMode: "contain",
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
    flex:0.3,
    justifyContent:"center",
    alignItems:"center",
  }
});