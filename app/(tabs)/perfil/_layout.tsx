import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerTitle: () => (
                    <Text style={styles.brand}>
                        <Text style={{ color: "#aef6c7" }}>Fix</Text>
                        <Text style={{ color: "white" }}>It</Text>
                    </Text>
                ),
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#294936" },
                headerBackVisible: true,
                headerBackTitle: "Volver",
                headerTintColor: "white",
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerBackVisible: false,
                    gestureEnabled: false,
                    animation: "none",
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    brand: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    }
})