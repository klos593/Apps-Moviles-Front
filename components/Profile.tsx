import { getUser, updatePicture } from "@/api/api";
import { useAuth, useAuthUser } from "@/src/auth/AuthContext";
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomWhiteMask } from "./BottomWhiteMask";
import ErrorModal from "./ErorrAnimation";
import ImagePickerModal from "./ImagePickerModal";
import LoadingArc from "./LoadingAnimation";
import SuccessModal from "./SuccesAnimation";

const getTagText = (mode: "user" | "provider") => {
  switch (mode) {
    case 'user':
      return 'Usuario';
    case 'provider':
      return 'Proveedor';
  }
};

const useUpdatePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePicture,
  });
};

export default function Profile() {
  const { mode, toggleMode } = useAuth();
  const router = useRouter();
  const { email } = useAuthUser();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [changePictureModal, setChangePictureModal] = useState(false)
  const updatePictureMutation = useUpdatePicture();
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const user = useQuery({
    queryKey: ["User", email],
    queryFn: () => getUser(email),
  });

  const MAX_HEADER = useMemo(() => 110 + insets.top * 0.5, [insets.top]);
  const MIN_HEADER = useMemo(() => insets.top + 50, [insets.top]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, MAX_HEADER - MIN_HEADER],
    outputRange: [MAX_HEADER, MIN_HEADER],
    extrapolate: "clamp",
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, MAX_HEADER - MIN_HEADER],
    outputRange: [1, 0.92],
    extrapolate: "clamp",
  });

  useFocusEffect(
      useCallback(() => {
        user.refetch();
      }, [])
    );

  const handleImage = async (url: string) => {

    const insertData = {
      userId: user.data.id,
      pictureUrl: url
    }
    try {
      await updatePictureMutation.mutateAsync(insertData)
      setSuccessOpen(true)
      user.refetch();
    } catch (error) {
      setErrorOpen(true)
    }
  }

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que querés cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión", style: "destructive", onPress: () => {
            router.replace("/(auth)");
            logout();
          }
        },
      ],
      { cancelable: true }
    );
  };

  if (user.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingArc />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.headerBg, { height: headerHeight }]} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: MAX_HEADER - 40,
          paddingHorizontal: 16,
          paddingBottom: tabBarHeight + insets.bottom + 12,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={[styles.profileCard, { marginTop: -60 }]}>
          <Pressable onPress={() => setChangePictureModal(true)}>
            <Animated.View style={[styles.avatarWrap, { transform: [{ scale: avatarScale }] }]}>
              <Image
                source={{
                  uri: user.data?.picture
                }}
                style={styles.avatar}
              />
            </Animated.View>
          </Pressable>

          {user.data && (
            <>
              <Text style={styles.fullName}>
                {user.data.name} {user.data.lastName}
              </Text>
              <Text style={styles.emailText}>{user.data.mail}</Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconStub}>
                <Ionicons name="invert-mode" size={21} color="#6B7A90" />
              </View>

              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={styles.rowTitle}>Modo</Text>
                <Text style={styles.rowSubtitle}>{getTagText(mode)}</Text>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Switch value={mode === "user"} onValueChange={toggleMode} />
              </View>

            </View>
          </View>

          <Pressable
            style={styles.row}
            onPress={() => router.push("/perfil/paginaInformacion")}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconStub}>
                <MaterialCommunityIcons name="account-details" size={20} color="#6B7A90" />
              </View>

              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={styles.rowTitle}>Datos personales</Text>
                <Text style={styles.rowSubtitle}>Ver y editar tus datos</Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            style={styles.row}
            onPress={() => router.push("/perfil/paginaEditarProfesiones")}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconStub}>
                <MaterialIcons name="work" size={21} color="#6B7A90" />
              </View>

              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={styles.rowTitle}>Profesiones</Text>
                <Text style={styles.rowSubtitle}>Ver y editar tus profesiones</Text>
              </View>
            </View>
          </Pressable>

          <Pressable style={[styles.row, styles.logoutRow]} onPress={handleLogout}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconStub, styles.logoutIcon]}>
                <Feather name="log-out" size={20} color="#D72638" />
              </View>
              <Text style={[styles.rowTitle, styles.logoutText]}>Cerrar sesión</Text>
            </View>
          </Pressable>
        </View>
      </Animated.ScrollView >

      <BottomWhiteMask />
      <ImagePickerModal visible={changePictureModal} onClose={() => setChangePictureModal(false)} onImageUploaded={handleImage} />
      <SuccessModal visible={successOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setSuccessOpen(false) }} message="Operacion realizada con exito!" />
      <ErrorModal visible={errorOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setErrorOpen(false) }} message="Error al realizar la operacion!" />
    </View >
  );
}

const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },
  headerBg: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    backgroundColor: "#294936",
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  profileCard: {
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
    zIndex: 2,
  },
  avatarWrap: {
    width: 96, height: 96, borderRadius: 20,
    backgroundColor: "#F1F4F8",
    overflow: "hidden",
    marginBottom: 14,
  },
  avatar: { width: "100%", height: "100%", resizeMode: "cover" },
  fullName: {
    fontSize: 20, fontWeight: "700", color: "#1F2D3D",
    marginTop: 4, textAlign: "center",
  },
  emailText: { fontSize: 14, color: "#6B7A90", marginTop: 4, textAlign: "center" },

  section: { marginTop: 8 },
  sectionTitle: { color: "#6B7A90", fontWeight: "700", marginBottom: 10, letterSpacing: 0.5 },

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

  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 6 },
  iconStub: { width: 28, height: 28, borderRadius: 8, backgroundColor: "#E5ECFF", alignItems: "center", justifyContent: "center" },
  rowTitle: { fontSize: 16, fontWeight: "700", color: "#1F2D3D" },
  rowSubtitle: { fontSize: 13, color: "#708099", marginTop: 3 },
  logoutRow: { backgroundColor: "#FFF5F5" },
  logoutIcon: { backgroundColor: "#FFD3D3" },
  logoutText: { color: "#D72638" },
});