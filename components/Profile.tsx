import { useAuth } from "@/src/auth/AuthContext";
import React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

const Profile = () => {
  const { logout } = useAuth(); // 👈 obtenemos la función de logout

  const handleLogout = async () => {
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
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topContainer}>
          <View style={styles.pictureContainer}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153295/UsuarioPlaceHolder_bzqamd.png",
              }}
              style={styles.picture}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>Nombre</Text>
          </View>
        </View>

        <View style={styles.middleContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.propertyNameView}>
              <Text style={styles.propertyName}>Mail</Text>
            </View>
            <View style={styles.propertyValueView}>
              <Text>usuario@correo.com</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.propertyNameView}>
              <Text style={styles.propertyName}>Teléfono</Text>
            </View>
            <View style={styles.propertyValueView}>
              <Text>+54 11 1234 5678</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.propertyNameView}>
              <Text style={styles.propertyName}>Dirección</Text>
            </View>
            <View style={styles.propertyValueView}>
              <Text>Av. Siempre Viva 742</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable>
          <Text style={styles.deleteText}>Eliminar cuenta</Text>
        </Pressable>

        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picture: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  pictureContainer: {
    flex: 2,
    alignSelf: "center",
    justifyContent: "center",
    margin: 10,
  },
  nameContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    margin: 10,
  },
  topContainer: {
    flex: 2,
    flexDirection: "row",
  },
  middleContainer: {
    flex: 3,
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
  },
  bottomContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  card: {
    flex: 5,
    backgroundColor: "#f4f4f6",
    margin: 16,
    borderRadius: 22,
  },
  propertyNameView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 10,
  },
  propertyValueView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 10,
  },
  propertyName: {
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
  logoutBtn: {
    backgroundColor: "#5b8266",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;