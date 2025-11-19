import { getServiceInfoById, getUserPendingReviews, updateRating, updateService, updateServiceReview, updateUserPendingReviews } from "@/api/api";
import { useAuthUser } from "@/src/auth/AuthContext";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { DateTime } from 'luxon';
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ServiceDetailsModal from "./ServiceModal";
import SuccessModal from "./SuccesAnimation";
import ServiceCardData from "./Types/ServiceCardData";

type ServiceCardProps = {
    data: ServiceCardData,
}

const useUpdateStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateService,
    });
};

const useUpdateReviews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateServiceReview,
    });
};

const useUpdateProfessionalRating = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRating,
    });
};

export default function ServiceCard({ data }: ServiceCardProps) {

    var borderColor;
    var backgroundTextColor;
    if (data.state === 'CANCELED' || data.state === 'REJECTED') {
        borderColor = '#7A7F85'
        backgroundTextColor = '#62666B'
    } else if (data.state === 'COMPLETED') {
        borderColor = '#294936'
        backgroundTextColor = '#2b6c5f'
    } else if (data.state === 'PENDING') {
        borderColor = '#5b8266'
        backgroundTextColor = '#3f9a7c'
    } else if (data.state === 'ACCEPTED') {
        borderColor = '#3e6259'
        backgroundTextColor = '#2b6c5f'
    }

    const [modal, setModal] = useState(false)
    const { email } = useAuthUser()
    const qc = useQueryClient();
    const updateStatusMutation = useUpdateStatus()
    const updateServiceReviewMutation = useUpdateReviews()
    const updateProfessionalRatingMutation = useUpdateProfessionalRating()
    const [successOpen, setSuccessOpen] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);

    const serviceQuery = useQuery({
        queryKey: ["serviceInfo", data.id],
        queryFn: () => getServiceInfoById(data.id),
    });

    const userReviewsQuery = useQuery({
        queryKey: ["userReviewsInfo", email],
        queryFn: () => getUserPendingReviews(email),
    });

    useFocusEffect(
        useCallback(() => {
            serviceQuery.refetch();
        }, [])
    );

    const serviceData = serviceQuery.data

    const openModal = () => {
        setModal(true)
    }

    const updateProfessionalRating = async () => {
        const data = {
            id: serviceData?.provider.id
        }
        await updateProfessionalRatingMutation.mutateAsync(data)
    }

    const ReviewService = async (rating: number, comment: string) => {

        const serviceReview = {
            id: data.id,
            rating: rating,
            comment: comment
        }
        await updateServiceReviewMutation.mutateAsync(serviceReview)

        if (userReviewsQuery.data?.pendingReviewsServicesId.length === 0) {
            const userReviewsData = {
                id: serviceData.user.id,
                state: false
            }
            updateUserPendingReviews(userReviewsData)
        }
    }

    const handleCancelService = async () => {
        const updateData = {
            id: data.id,
            state: 'CANCELED'
        }
        try {
            await updateStatusMutation.mutateAsync(updateData)
            await serviceQuery.refetch();
            setSuccessOpen(true)
            setModal(false)
        } catch (error) {
            //setErrorOpen(true)
        }
    };

    const handleAcceptService = async () => {
        const updateData = {
            id: data.id,
            state: 'ACCEPTED'
        }
        try {
            await updateStatusMutation.mutateAsync(updateData)
            await serviceQuery.refetch();
            setSuccessOpen(true)
            setModal(false)
        } catch (error) {
            //setErrorOpen(true)
        }
    };

    const handleRejectService = async () => {
        const updateData = {
            id: data.id,
            state: 'REJECTED'
        }
        try {
            await updateStatusMutation.mutateAsync(updateData)
            await serviceQuery.refetch();
            setSuccessOpen(true)
            setModal(false)
        } catch (error) {
            //setErrorOpen(true)
        }
    };

    const handleCompleteService = async () => {
        const updateData = {
            id: data.id,
            state: 'COMPLETED'
        }
        try {
            await updateStatusMutation.mutateAsync(updateData)
            await serviceQuery.refetch();
            setSuccessOpen(true)
            setModal(false)
        } catch (error) {
            //setErrorOpen(true)
        }
        const userReviewsData = {
            id: serviceData.user.id,
            state: true
        }
        updateUserPendingReviews(userReviewsData)
        serviceQuery.refetch()
    };

    const handleReviewService = async (rating: number, comment: string) => {
        try {
            ReviewService(rating, comment)
            updateProfessionalRating()
            await serviceQuery.refetch();
            setSuccessOpen(true)
            setModal(false)
        } catch (error) {
            //setErrorOpen(true)
        }
    };

    const handleGoToProfile = (id: number) => {
        setModal(false)
        router.push(`/home/profesional/${id}`)
    }

    return (
        <>
            <Pressable onPress={openModal}>
                <View style={{ ...styles.cardWrapper, borderColor: borderColor }}>
                    <View style={{ ...styles.cardHeader, backgroundColor: borderColor, borderColor: borderColor }}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{data.name} {data.lastName}</Text>
                        </View>
                        <View style={styles.statusContainer}>
                            <Text style={{ ...styles.status, backgroundColor: backgroundTextColor }}>{data.state}</Text>
                        </View>
                    </View>
                    <View style={styles.cardBody}>
                        <View style={styles.infoView}>
                            <View style={styles.iconStub}><FontAwesome6 name="screwdriver-wrench" size={16} color="#6B7A90" /></View>
                            <Text>{data.profession}</Text>
                        </View>

                        <View style={styles.infoView}>
                            <View style={styles.iconStub}><FontAwesome name="calendar-o" size={18} color="#6B7A90" /></View>
                            <Text>{DateTime.fromISO(data.date, { zone: "utc" })
                                .setZone("America/Argentina/Buenos_Aires")
                                .toFormat("dd/MM/yyyy HH:mm")}
                            </Text>
                        </View>

                        <View style={styles.infoView}>
                            <View style={styles.iconStub}><FontAwesome name="map-marker" size={20} color="#6B7A90" /></View>
                            <Text >{data.address.street} {data.address.number.toString()}, {data.address.postalCode.toString()}, {data.address.province} </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
            <SuccessModal visible={successOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setSuccessOpen(false) }} message="Operacion realizada con exito!" />
            <ServiceDetailsModal
                visible={modal}
                onClose={() => setModal(false)}
                service={serviceData}
                onCancelService={() => handleCancelService()}
                onRejectService={() => handleRejectService()}
                onAcceptService={() => handleAcceptService()}
                onCompleteService={() => handleCompleteService()}
                onGoToProfile={() => handleGoToProfile(serviceData.provider.id)}
                onReviewService={handleReviewService}
            />
        </>
    )
}

const styles = StyleSheet.create({
    cardWrapper: {
        flex: 1,
        borderWidth: 0,
        margin: 15,
        height: 350,
        borderRadius: 16,
        borderTopLeftRadius: 55,
        marginHorizontal: 30,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    cardHeader: {
        flex: 2.5,
        flexDirection: 'row',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 13,
        borderBottomRightRadius: 30
    },

    nameContainer: {
        justifyContent: 'center',
        alignItems: 'baseline',
        flex: 1.7,
        marginLeft: 20
    },

    name: {
        fontWeight: '700',
        fontSize: 22,
        color: 'white'
    },

    statusContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        flex: 1
    },

    status: {
        margin: 10,
        padding: 5,
        borderRadius: 5,
        color: 'white',
        fontWeight: '500'
    },

    cardBody: {
        flex: 5,
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        marginLeft: 15
    },

    infoView: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'baseline',
    },

    iconStub: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: "#E5ECFF",
        alignItems: "center",
        justifyContent: "center"
    },
})