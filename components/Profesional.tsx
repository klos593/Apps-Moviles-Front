import { createService, getProfessionalProfessions, getUserIdAndAddressId } from '@/api/api';
import { useAuthUser } from '@/src/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DateTimeSelector from './DateTimeSelector';
import ErrorModal from './ErorrAnimation';
import LoadingArc from './LoadingAnimation';
import Rating from "./Rating";
import SuccessModal from "./SuccesAnimation";
import { ProfessionalData } from "./Types/ProfessionalData";
import { ProfessionCardData } from './Types/ProfessionCardData';

type ProfesionalProps = {
  data: ProfessionalData;
};



const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Error al crear servicio:', error);
    },
  });
};

export default function Profesional({ data }: ProfesionalProps) {
  const [modal, setModal] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState<ProfessionCardData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const createServiceMutation = useCreateService();
  const { email } = useAuthUser()

  const professionsQuery = useQuery({
    queryKey: ["professionalProfessions", data.id.toString()],
    queryFn: () => getProfessionalProfessions(data.id.toString()),
  });

  useFocusEffect(
    useCallback(() => {
      professionsQuery.refetch();
    }, [])
  );

  const professionsData = professionsQuery.data ?? [];

  const showModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const userQuery = useQuery({
    queryKey: ["userInfo", email],
    queryFn: () => getUserIdAndAddressId(email),
  });

  const handleContact = async () => {
    if (!selectedProfession) {
      Alert.alert('Error', 'Debes seleccionar una profesión');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Error', 'Debes seleccionar una fecha');
      return;
    } else if (selectedDate < new Date()) {
      Alert.alert('Error', 'La fecha seleccionada ya no esta disponible')
    }

    if (!userQuery.data?.userId || !userQuery.data?.addressId) {
      Alert.alert('Error', 'No se pudo obtener la información del usuario');
      return;
    }
    const serviceData = {
      professionId: parseInt(selectedProfession.id, 10),
      userId: userQuery.data.userId,
      providerId: data.id,
      rating: null,
      price: null,
      comment: null,
      date: selectedDate,
      addressId: userQuery.data.addressId,
      state: 'PENDING',
    };

    try {
      const result = await createServiceMutation.mutateAsync(serviceData);
      setSuccessOpen(true)
    } catch (error) {
      setErrorOpen(true)
    }

  };

  return (
    <>
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: data.picture }} style={styles.picture} />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{data.name} {data.lastName}</Text>
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
          <Text style={styles.description}>
            <Text style={{ fontWeight: "600" }}>Descripción: </Text>
            {data.description}
          </Text>
          <View style={styles.rowRatingAction}>
            <View style={styles.ratingBlock}>
              <Rating rating={data.rating} />
              <Text style={styles.numberedRating}>{(data.rating).toString().slice(0, 3)}</Text>
            </View>

            <Pressable style={styles.hireBtn} onPress={showModal}>
              <Text style={styles.hireBtnText}>Contratar</Text>
            </Pressable>
          </View>
          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsPlaceholder}>
              ACA VAN REVIEWS (un flatlist horizontal)
            </Text>
          </View>
        </View>
      </View>

      <Modal
        visible={modal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Solicitar servicio</Text>
            <View style={{ flex: 2 }}>
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.gridContainer}>
                  {professionsData.map((opt) => {
                    const isSelected = selectedProfession === opt;
                    return (
                      <Pressable
                        key={opt.id}
                        style={[styles.card, isSelected && styles.cardSelected]}
                        onPress={() => setSelectedProfession(opt)}
                      >
                        <Image source={{ uri: opt.picture }} style={styles.serviceIcon} />
                        <Text style={styles.serviceText}>{opt.name}</Text>
                        {isSelected && (
                          <View style={styles.checkBadge}>
                            <Ionicons name="checkmark" size={14} color="#fff" />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
            <View style={styles.dateSection}>
              <DateTimeSelector
                onDateChange={(date) => {
                  setSelectedDate(date);
                }}
              />

              {selectedDate && (
                <Text style={styles.selectedDateText}>
                  Turno: {selectedDate.toString()}
                </Text>
              )}
            </View>
            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.actionTextCancel}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleContact}
                disabled={createServiceMutation.isPending}
              >
                <Text style={styles.actionTextPrimary}>Solicitar servicio</Text>
              </Pressable>
            </View>
            <SuccessModal visible={successOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setSuccessOpen(false) }} />
            <ErrorModal visible={errorOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setErrorOpen(false) }} />
            {createServiceMutation.isPending &&
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <LoadingArc />
              </View>}
          </View>
        </View>
      </Modal>
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
    paddingTop: AVATAR_SIZE / 2 + 16, // deja lugar por la superposición
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

  hireBtn: {
    backgroundColor: "#3E6259",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  hireBtnText: {
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

  // ===== Modal de "Contratar" =====

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  // el modal ocupa casi toda la pantalla, dejando un margen arriba
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    height: "90%",      // casi toda la pantalla
  },

  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#111827",
  },

  modalScroll: {
    flex: 1
  },

  modalScrollContent: {
    paddingBottom: 8,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 1,
  },

  card: {
    width: 110,
    height: 110,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E0E0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },

  cardSelected: {
    borderColor: "#00cb58b3",
    backgroundColor: "#ffffffff",
  },

  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: "#5b8266",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceIcon: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    borderRadius: 15,
  },

  serviceText: {
    fontWeight: "600",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },

  dateSection: {
    marginTop: 13,
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  selectedDateText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#374151",
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButton: {
    backgroundColor: "#E5E7EB",
  },

  primaryButton: {
    backgroundColor: "#3E6259",
  },

  actionTextCancel: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },

  actionTextPrimary: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

});


