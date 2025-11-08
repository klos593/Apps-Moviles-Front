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
                <Image source={require('@/assets/images/burgerMenu.png')} style={styles.icon} />
              </Pressable>
            </Link>
          ),
          headerStyle: { backgroundColor: '#294936' },
          headerBackTitle: "Volver",
          headerTintColor: "white"
        }}
      >
        <Stack.Screen
          name="paginaUsuario"
          options={{
            headerRight: () =>
              <Link href={"/paginaUsuario"} asChild>
                <Pressable>
                  <Image source={require('@/assets/images/EditIcon.png')} style={styles.icon} />
                </Pressable>
              </Link>,
          }}
        />

        <Stack.Screen
          name="paginaServicios"
          options={{
            headerBackVisible: false
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  icon: {
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