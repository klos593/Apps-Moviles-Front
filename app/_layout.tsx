
import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerTitle: "logo",
        headerTitleAlign: "center",
        headerRight: () => (
          <Pressable onPress={() => router.push("/paginaLogin")} style={{ marginRight: 16 }}>
            <Text style={{ color: "#007AFF", fontWeight: "bold" }}>log in</Text>
          </Pressable>
        ),
      }}
    />
  );
}
