import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

export default function RootLayout() {
  const router = useRouter();
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
        headerStyle: {backgroundColor: '#294936'},
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
});