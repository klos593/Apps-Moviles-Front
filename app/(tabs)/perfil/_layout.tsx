import { Stack } from "expo-router";
import { Text, StyleSheet } from "react-native";

export default function HomeLayout() {
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
                headerStyle: { backgroundColor: "#294936" },
                headerBackVisible: true,
                headerBackTitle: "Volver",
                headerTintColor: "white"
            }}
        />
    );
}

const styles = StyleSheet.create({
    brand: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    }
})