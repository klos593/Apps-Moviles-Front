import { addProfession, deleteProfession, getProfessionalAvailableProfessions, getProfessionalProfessions, getUser } from "@/api/api";
import { useAuthUser } from "@/src/auth/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
    Pressable,
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
            queryClient.invalidateQueries({ queryKey: ['professionalAvailableProfessions'] });
            queryClient.invalidateQueries({ queryKey: ['professionalActiveProfessions'] })
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
            queryClient.invalidateQueries({ queryKey: ['professionalAvailableProfessions'] });
            queryClient.invalidateQueries({ queryKey: ['professionalActiveProfessions'] })
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
    });

    const AvailableProfessionsQuery = useQuery({
        queryKey: ["professionalAvailableProfessions", userId],
        queryFn: () => getProfessionalAvailableProfessions(userId as string),
        enabled: !!userId,
    });

    const activeProfessionData = ActiveProfessionsQuery.data ?? [];
    const availableProfessionData = AvailableProfessionsQuery.data ?? [];

    const handleDelete = async () => {
        if (!selectedActiveProfession) {
            setErrorOpen(true)
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
            setErrorOpen(true)
            return;
        }

        if (activeProfessionData.length >= 3) {
            setErrorOpen(true)
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
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Profesiones
                </Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>MIS PROFESIONES</Text>
                <View style={styles.gridContainer}>
                    {activeProfessionData.map((opt) => {
                        const isSelected = selectedActiveProfession === opt;
                        return (
                            <Pressable
                                key={opt.id}
                                style={[styles.card, isSelected && styles.cardSelected]}
                                onPress={() => setSelectedActiveProfession(opt)}
                            >
                                <Text style={styles.serviceText}>{opt.name}</Text>
                            </Pressable>
                        );
                    })}
                </View>
                
                <Text style={styles.sectionTitle}>PROFESIONES DISPONIBLES</Text>
                <View style={styles.gridContainer}>
                    {availableProfessionData.map((opt) => {
                        const isSelected = selectedAvailableProfession === opt;
                        return (
                            <Pressable
                                key={opt.id}
                                style={[styles.card, isSelected && styles.cardSelected]}
                                onPress={() => setSelectedAvailableProfession(opt)}
                            >
                                <Text style={styles.serviceText}>{opt.name}</Text>
                            </Pressable>
                        );
                    })}
                </View>
                
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.button, {backgroundColor: "#2f6b45"}]} onPress={handleAdd} disabled={addProfessionMutation.isPending}>
                        <Text style={styles.buttonText}>
                            {addProfessionMutation.isPending ? "Agregando ..." : "Agregar Profesión"}
                        </Text>
                    </Pressable>

                    <Pressable style={[styles.button, {backgroundColor: "#e6ebf2"}]} onPress={handleDelete} disabled={deleteProfessionMutation.isPending}>
                        <Text style={[styles.buttonText, {color: "#516072"}]}>
                            {deleteProfessionMutation.isPending ? "Eliminando ..." : "Eliminar Profesión"}
                        </Text>
                    </Pressable>
                </View>
                <SuccessModal visible={successOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setSuccessOpen(false) }} message="Operacion realizada con exito!" />
                <ErrorModal visible={errorOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setErrorOpen(false) }} message="Error al realizar la operacion!" />
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 10,
        backgroundColor: "#F5F6FA",
    },

    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
        gap: 14
    },

    card: {
        width: 110,
        height: 40,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#beffc7ff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#beffc7ff",
        position: "relative",
    },

    cardSelected: {
        borderColor: "#00cb58b3",
        backgroundColor: "#beffc7ff",
    },

    serviceText: {
        fontWeight: "600",
        fontSize: 15,
    },

    sectionTitle: { 
        color: "#6B7A90", 
        fontWeight: "700", 
        marginBottom: 10, 
        letterSpacing: 0.5 
    },

    titleContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 14,
        backgroundColor: "#F5F6FA"
    },

    title: {
        fontSize: 22, 
        fontWeight: "800", 
        marginTop: 6, 
        color: "#1F2D3D"
    },

    buttonText: {
        color: "white", 
        fontSize: 16, 
        fontWeight: "700"
    },

    button: {
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonContainer: {
        backgroundColor: "#F5F6FA", 
        gap: 14,
        marginTop: 15
    }
});