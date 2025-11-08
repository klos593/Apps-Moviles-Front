import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Stack, Tabs } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, } from "react-native";

export default function RootLayout() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
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
                <Image source={{ uri: 'https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153296/UserIcon_nzkkjz.png' }} style={styles.userIcon} />
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
                  <Image source={{ uri: 'https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153295/EditIcon_gjqs42.png' }} style={styles.userIcon} />
                </Pressable>
              </Link>,
            headerLeft: () => null,
          }}
        />
      </Stack>
    </QueryClientProvider>
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