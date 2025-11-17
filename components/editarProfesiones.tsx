import { addProfession, deleteProfession, getProfessionalAvailableProfessions, getProfessionalProfessions, getUser } from "@/api/api";
import { useAuthUser } from "@/src/auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import ErrorModal from "./ErorrAnimation";
import LoadingArc from "./LoadingAnimation";
import SuccessModal from "./SuccesAnimation";
import { ProfessionCardData } from "./Types/ProfessionCardData";

const useAddProfession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addProfession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professionalActiveProfessions', 'professionalAvailableProfessions'] });
        },
        onError: (error) => {
            console.error('Error al agregar profesion:', error);
        },
    });
};

const useDeleteProfession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProfession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professionalAvailableProfessions', 'professionalActiveProfessions'] });
        },
        onError: (error) => {
            console.error('Error al eliminar profesion:', error);
        },
    });
};


export default function ServiceTypeScreen() {

    const { email } = useAuthUser()
    const [selectedAvailableProfession, setSelectedAvailableProfession] = useState<ProfessionCardData | null>(null);
    const [selectedActiveProfession, setSelectedActiveProfession] = useState<ProfessionCardData | null>(null);
    const addProfessionMutation = useAddProfession()
    const deleteProfessionMutation = useDeleteProfession()
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    const user = useQuery({
        queryKey: ["User", email],
        queryFn: () => getUser(email),
    });

    const rawUserId = user.data?.id;

    const userId = rawUserId != null ? String(rawUserId) : undefined;

    const ActiveProfessionsQuery = useQuery({
        queryKey: ["professionalActiveProfessions", userId],
        queryFn: () => getProfessionalProfessions(userId as string),
        enabled: !!userId,
        refetchInterval: 1000,
        refetchIntervalInBackground: false,
    });

    const AvailableProfessionsQuery = useQuery({
        queryKey: ["professionalAvailableProfessions", userId],
        queryFn: () => getProfessionalAvailableProfessions(userId as string),
        enabled: !!userId,
        refetchInterval: 1000,
        refetchIntervalInBackground: false,
    });

    const activeProfessionData = ActiveProfessionsQuery.data ?? [];
    const availableProfessionData = AvailableProfessionsQuery.data ?? [];

    const handleDelete = async () => {
        if (!selectedActiveProfession) {
            Alert.alert('Error', 'Debes seleccionar una profesión');
            return;
        }

        const data = {
            userId: userId,
            professionId: selectedActiveProfession.id
        }

        try {
            await deleteProfessionMutation.mutateAsync(data)
            setSuccessOpen(true)
        } catch (error) {
            setErrorOpen(true)
        }
    };

    const handleAdd = async () => {
        if (!selectedAvailableProfession) {
            Alert.alert('Error', 'Debes seleccionar una profesión');
            return;
        }

        const data = {
            userId: userId,
            professionId: selectedAvailableProfession.id
        }

        try {
            await addProfessionMutation.mutateAsync(data)
            setSuccessOpen(true)
        } catch (error) {
            setErrorOpen(true)
        }

    }

    if (user.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <LoadingArc />
            </View>
        );
    }

    return (
        <>
            <View style={{ flex: 7 }}>
                <View style={{ flex: 3 }}>
                    <View style={styles.container}>
                        <ScrollView
                            style={styles.modalScroll}
                            contentContainerStyle={styles.modalScrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.gridContainer}>
                                {availableProfessionData.map((opt) => {
                                    const isSelected = selectedAvailableProfession === opt;
                                    return (
                                        <Pressable
                                            key={opt.id}
                                            style={[styles.card, isSelected && styles.cardSelected]}
                                            onPress={() => setSelectedAvailableProfession(opt)}
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
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#FFFFFF", }}>
                    <Pressable style={{ backgroundColor: 'green', borderRadius: 15, justifyContent: 'center', alignItems: 'center', height: 50, width: 150 }} onPress={handleAdd} disabled={addProfessionMutation.isPending}>
                        <Text style={{ color: 'white' }}>
                            {addProfessionMutation.isPending ? "Agregando ..." : "Agregar Profesion"}
                        </Text>
                    </Pressable>
                </View>
                <View style={{ flex: 3 }}>
                    <View style={styles.container}>
                        <ScrollView
                            style={styles.modalScroll}
                            contentContainerStyle={styles.modalScrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.gridContainer}>
                                {activeProfessionData.map((opt) => {
                                    const isSelected = selectedActiveProfession === opt;
                                    return (
                                        <Pressable
                                            key={opt.id}
                                            style={[styles.card, isSelected && styles.cardSelected]}
                                            onPress={() => setSelectedActiveProfession(opt)}
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
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#FFFFFF", }}>
                    <Pressable style={{ backgroundColor: 'red', borderRadius: 15, justifyContent: 'center', alignItems: 'center', height: 50, width: 150 }} onPress={handleDelete} disabled={deleteProfessionMutation.isPending}>
                        <Text style={{ color: 'white' }}>
                            {deleteProfessionMutation.isPending ? "Eliminando ..." : "Eliminar Profesion"}
                        </Text>
                    </Pressable>
                </View>
                <SuccessModal visible={successOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setSuccessOpen(false) }} message="Operacion realizada con exito!" />
                <ErrorModal visible={errorOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setErrorOpen(false) }} message="Error al realizar la operacion!" />
            </View>
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}></View>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 10,
        backgroundColor: "#FFFFFF",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 24,
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
    continueButton: {
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
    },
    continueText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
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
    },
    button: {
        backgroundColor: "#5b8266",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },

    modal: {
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        height: "90%",
    },

    modalScroll: {
        flex: 1
    },

    modalScrollContent: {
        paddingBottom: 8,
    },
});