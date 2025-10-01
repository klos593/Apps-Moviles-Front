import { Stack, router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <Text style={styles.brand}>
            <Text style={{ color: "#aef6c7" }}>Fix</Text>
            <Text>It</Text>
          </Text>
        ),
        headerTitleAlign: "center",
        headerRight: () => (
          <Pressable onPress={() => router.push("/paginaUsuario")}>
            <Image source={require('../assets/images/UserIcon.png')} style={styles.userIcon}/>
          </Pressable>
        ),
        headerLeft: () => (
          <Pressable>
            <Text style={styles.address}>Direccion</Text>
          </Pressable>
        ),
        headerStyle: {backgroundColor: '#294936'},
        headerBackVisible: false,
      }}
      />
  );
}

const styles = StyleSheet.create({
  userIcon: {
    width: 30,
    height: 33,
    resizeMode: "contain",
    paddingLeft: 5
  },
  brand:{ 
    fontSize:20, 
    fontWeight:"700", 
    textAlign:"center" 
  },
  address:{
    fontSize: 16,
    color: "#ffffffff",
    fontWeight: 500
  }
});