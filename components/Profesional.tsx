import React, { useState } from "react";
import { Alert, FlatList, Image, Linking, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Rating from "./Rating";
import SuccessModal from "./SuccesAnimation";
import { ProfessionalData } from "./Types/ProfessionalData";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type ProfesionalProps = {
  data: ProfessionalData;
};

  const handlePressWhatsapp = async () => {
    const url = "https://wa.me/2477465180?text=Hello%20I%20would%20like%20more%20information";

    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }

export default function Profesional({ data }: ProfesionalProps) {
  const [modal, setModal] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const showModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <>
      <View style={styles.root}>
        {/* HEADER VERDE */}
        <View style={styles.header}>
          {/* Avatar que sobresale a la mitad */}
          <View style={styles.avatarWrap}>
            <Image source={{ uri: data.picture }} style={styles.picture} />
          </View>
        </View>

        {/* CONTENIDO */}
        <View style={styles.content}>
          {/* Nombre */}
          <Text style={styles.name}>{data.name} {data.lastName}</Text>

          {/* Profesiones (chips) */}
          <View style={styles.professionsContainer}>
            <FlatList
              data={data.professions}
              horizontal
              contentContainerStyle={{ gap: 8 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, idx) => `${item}-${idx}`}
              renderItem={({ item }) => (
                <Text style={styles.professionChip}>{item}</Text>
              )}
            />
          </View>

          {/* Descripción */}
          <Text style={styles.description}>
            <Text style={{ fontWeight: "600" }}>Descripción: </Text>
            {data.description}
          </Text>

          {/* Fila: Rating (izq) + Botón Contactar (der) */}
          <View style={styles.rowRatingAction}>
            <View style={styles.ratingBlock}>
              <Rating rating={data.rating} />
              <Text style={styles.numberedRating}>{(data.rating).toString().slice(0, 3)}</Text>
            </View>

            <Pressable style={styles.contactBtn} onPress={showModal}>
              <Text style={styles.contactBtnText}>Contactar</Text>
            </Pressable>
          </View>

          {/* REVIEWS ABAJO DEL BOTÓN */}
          <View style={styles.reviewsContainer}>
            {/* acá montás tu FlatList horizontal */}
            <Text style={styles.reviewsPlaceholder}>
              ACA VAN REVIEWS (un flatlist horizontal)
            </Text>
          </View>
        </View>
      </View>

      {/* Modal de contacto */}
      <Modal visible={modal} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalCloseRow}>
              <Pressable onPress={closeModal}>
                  <Entypo name="cross" size={24} color="#6B7A90" />
              </Pressable>
            </View>

            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 20 }}>Contacto</Text>

              <View style={styles.modalIconsRow}>
                <Pressable style={[styles.iconStub, {backgroundColor: "#59cc55ff"}]} onPress={handlePressWhatsapp}>
                  <FontAwesome name="whatsapp" size={44} color="white" />
                </Pressable>
              <View style={styles.modalIconSlot}>
                <Pressable style={[styles.iconStub, {backgroundColor: "#65a8faff"}]}>
                  <Fontisto name="email" size={34} color="white" />
                </Pressable>
              </View>
              <View style={styles.modalIconSlot}>
                <Pressable style={[styles.iconStub, {backgroundColor: "#50b94cff"}]}>
                  <FontAwesome5 name="phone-alt" size={30} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <SuccessModal
        visible={successOpen}
        onClose={() => setSuccessOpen(false)}
        autoCloseMs={2000}
        message="¡El profesional fue contactado con exito!"
        dismissOnBackdrop
      />
    </>
  );
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Fondo verde que llega hasta la mitad de la foto
  header: {
    height: 160,
    backgroundColor: "#294936",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  avatarWrap: {
    position: "absolute",
    bottom: -(AVATAR_SIZE / 2), // sobresale la mitad
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  picture: {
    height: AVATAR_SIZE - 8,
    width: AVATAR_SIZE - 8,
    borderRadius: (AVATAR_SIZE - 8) / 2,
    resizeMode: "cover",
  },

  content: {
    flex: 1,
    paddingTop: (AVATAR_SIZE / 2) + 16, // deja lugar por la superposición
    paddingHorizontal: 16,
    gap: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  professionsContainer: {
    alignItems: "center",
  },

  professionChip: {
    backgroundColor: "#294936",
    color: "white",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
  },

  description: {
    fontSize: 15,
    textAlign: "center",
  },

  rowRatingAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  ratingBlock: {
    flexDirection: "row",
    alignItems: "center",
  },

  numberedRating: {
    marginLeft: 7,
    fontSize: 16,
  },

  contactBtn: {
    backgroundColor: "#3E6259",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  contactBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  reviewsContainer: {
    marginTop: 16,
  },

  reviewsPlaceholder: {
    fontSize: 18,
  },

  // ===== Modal =====
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: 350,
    height: 500,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  modalCloseRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  modalIconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    width: "90%",
  },

  modalIconSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconStub: { width: 58, height: 58, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});