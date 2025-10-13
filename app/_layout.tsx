import { Link, Stack, Tabs } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, } from "react-native";

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
          <Link href={"/paginaUsuario"} asChild>
            <Pressable>
              <Image source={require('../assets/images/UserIcon.png')} style={styles.userIcon} />
            </Pressable>
          </Link>
        ),
        headerLeft: () => (
          <Pressable>
            <Text style={styles.address}>Direccion</Text>
          </Pressable>
        ),
        headerStyle: { backgroundColor: '#294936' },
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="index" />
      <Tabs.Screen
        name="paginaUsuario"
        options={{
          headerTitle: () => (
            <Text style={styles.brand}>
              <Text style={{ color: "#aef6c7" }}>Fix</Text>
              <Text>It</Text>
            </Text>
          ),
          headerStyle: { backgroundColor: "#294936" },
          headerTintColor: "#aef6c7",
          headerRight: () =>
            <Link href={"/paginaUsuario"} asChild>
              <Pressable>
                <Image source={require('../assets/images/EditIcon.png')} style={styles.userIcon} />
              </Pressable>
            </Link>,
          headerLeft: () => null,
        }}
      />
    </Stack>

  );
}

const styles = StyleSheet.create({
  userIcon: {
    width: 30,
    height: 33,
    resizeMode: "contain",
    paddingLeft: 5
  },
  brand: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center"
  },
  address: {
    fontSize: 16,
    color: "#ffffffff",
    fontWeight: 500
  }
});