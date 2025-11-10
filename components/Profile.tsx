import { getUser } from "@/api/api";
import { useAuth, useAuthUser } from "@/src/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  const { email } = useAuthUser();
  const { logout } = useAuth();

  const { data: user } = useQuery({
    queryKey: ["User", email],
    queryFn: () => getUser(email),
  });

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que querés cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.screen}>
      {/* Header visual azul */}
      <View style={styles.headerBg} />

      {/* Tarjeta superior (avatar + nombre + mail) */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri:
                "https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153295/UsuarioPlaceHolder_bzqamd.png",
            }}
            style={styles.avatar}
          />
        </View>

        <Text style={styles.fullName}>
          {user?.name} {user?.lastName}
        </Text>
        <Text style={styles.emailText}>{user?.mail}</Text>
      </View>

      {/* Sección GENERAL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GENERAL</Text>

        <Pressable 
          style={styles.row}
          onPress={() => router.push("/paginaInofrmacion")}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconStub} />
            <Text style={styles.rowTitle}>Datos personales</Text>
          </View>
          <Text style={styles.rowSubtitle}>Ver y editar tus datos</Text>
        </Pressable>

        <Pressable
          style={styles.row}
          
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconStub} />
            <Text style={styles.rowTitle}>Notificaciones</Text>
          </View>
          <Text style={styles.rowSubtitle}>Preferencias y datos</Text>
        </Pressable>

        <Pressable style={[styles.row, styles.logoutRow]} onPress={handleLogout}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconStub, styles.logoutIcon]} />
            <Text style={[styles.rowTitle, styles.logoutText]}>Cerrar sesión</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#294936",
    borderBottomRightRadius: 40,  
    overflow: "hidden",         
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: 100, 
    backgroundColor: "white",
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignItems: "center",
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: "#F1F4F8",
    overflow: "hidden",
    marginBottom: 14,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fullName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2D3D",
    marginTop: 4,
  },
  emailText: {
    fontSize: 14,
    color: "#6B7A90",
    marginTop: 4,
  },

  section: {
    marginTop: 22,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: "#6B7A90",
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  row: {
    backgroundColor: "white",
    borderRadius: CARD_RADIUS,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  iconStub: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#E5ECFF",
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2D3D",
  },
  rowSubtitle: {
    fontSize: 13,
    color: "#708099",
    marginLeft: 40,
  },
  logoutRow: {
    backgroundColor: "#FFF5F5",
  },
  logoutIcon: {
    backgroundColor: "#FFD3D3",
  },
  logoutText: {
    color: "#D72638",
  },
});