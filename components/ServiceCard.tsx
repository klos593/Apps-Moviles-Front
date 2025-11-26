import { getServiceInfoById, updateRating, updateService, updateServiceReview, updateUserPendingReviews } from "@/api/api";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { DateTime } from 'luxon';
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ErrorModal from "./ErorrAnimation";
import LoadingArc from "./LoadingAnimation";
import ReviewModal from "./ReviewModal";
import ServiceDetailsModal from "./ServiceModal";
import SuccessModal from "./SuccesAnimation";
import ServiceCardData from "./Types/ServiceCardData";

type ServiceCardProps = {
    data: ServiceCardData,
}

const useUpdateStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateService,
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries()
            }, 2000)
        },
    });
};

const useUpdateReviews = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateServiceReview,
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries()
            }, 2000)
        },
    });
};

const useUpdateProfessionalRating = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateRating,
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries()
            }, 2000)
        },
    });
};

export default function ServiceCard({ data }: ServiceCardProps) {

    useEffect(() => {
        if (data.state === 'CANCELED' || data.state === 'REJECTED') {
            setBorderColor('#7A7F85')
            setBackgroundTextColor('#62666B')
        } else if (data.state === 'COMPLETED') {
            setBorderColor('#294936')
            setBackgroundTextColor('#2b6c5f')
        } else if (data.state === 'PENDING') {
            setBorderColor('#5b8266')
            setBackgroundTextColor('#3f9a7c')
        } else if (data.state === 'ACCEPTED') {
            setBorderColor('#3e6259')
            setBackgroundTextColor('#2b6c5f')
        }
    }, [data.state])

    const [modal, setModal] = useState(false)
    const updateStatusMutation = useUpdateStatus()
    const updateServiceReviewMutation = useUpdateReviews()
    const updateProfessionalRatingMutation = useUpdateProfessionalRating()
    const [successOpen, setSuccessOpen] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [borderColor, setBorderColor] = useState("")
    const [backgroundTextColor, setBackgroundTextColor] = useState("")
    const [loading, setLoading] = useState(false);

    const serviceQuery = useQuery({
        queryKey: ["serviceInfo", data.id],
        queryFn: () => getServiceInfoById(data.id),
    });

    const serviceData = serviceQuery.data

    const openModal = () => {
        setModal(true)
    }

    const succesCase = () => {
        setLoading(false);
        setModal(false)
        setReviewModal(false)
        setSuccessOpen(true)
        
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
    }

    const handleCancelService = async () => {
        const updateData = {
            id: data.id,
            state: 'CANCELED'
        }
        try {
            setLoading(true);
            await updateStatusMutation.mutateAsync(updateData)
            succesCase()
        } catch (error) {
            console.error(error)
            setErrorOpen(true)
        }
    };

    const handleAcceptService = async () => {
        const updateData = {
            id: data.id,
            state: 'ACCEPTED'
        }
        try {
            setLoading(true);
            await updateStatusMutation.mutateAsync(updateData)
            succesCase()
        } catch (error) {
            console.error(error)
            setErrorOpen(true)
        }
    };

    const handleRejectService = async () => {
        const updateData = {
            id: data.id,
            state: 'REJECTED'
        }
        try {
            setLoading(true);
            await updateStatusMutation.mutateAsync(updateData)
            succesCase()
        } catch (error) {
            console.error(error)
            setErrorOpen(true)
        }
    };

    const handleCompleteService = async () => {
        const updateData = {
            id: data.id,
            state: 'COMPLETED'
        }
        try {
            setLoading(true);
            await updateStatusMutation.mutateAsync(updateData)
            succesCase()
        } catch (error) {
            console.error(error)
            setErrorOpen(true)
        }
        const userId = serviceData?.user?.id;
        if (userId !== undefined) {
            const userReviewsData = {
                id: userId,
                state: true
            };
            updateUserPendingReviews(userReviewsData);
        }
    };

    const handleReviewService = async (rating: number, comment: string) => {
        try {
            setLoading(true);
            await ReviewService(rating, comment)
            await updateProfessionalRating()
            succesCase()
        } catch (error) {
            console.error(error)
            setErrorOpen(true)
        }
    };

    const handleGoToProfile = (id: number) => {
        setModal(false)
        router.push(`/home/profesional/${id}`)
    }

    if (!data) return null;

    return (
        <>
            <Pressable onPress={openModal}>
                <View style={styles.cardWrapper}>
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
            {serviceData && (
                <ServiceDetailsModal
                    visible={modal}
                    onClose={() => setModal(false)}
                    service={serviceData}
                    onCancelService={() => handleCancelService()}
                    onRejectService={() => handleRejectService()}
                    onAcceptService={() => handleAcceptService()}
                    onCompleteService={() => handleCompleteService()}
                    onGoToProfile={() => {
                        if (serviceData?.provider?.id !== undefined) {
                            handleGoToProfile(serviceData.provider.id)
                        }
                    }}
                    onReviewService={() => { setModal(false); setReviewModal(true) }}
                />
            )}

            <ReviewModal
                visible={reviewModal}
                onClose={() => setReviewModal(false)}
                accept={handleReviewService}
            />

            <ErrorModal visible={errorOpen} dismissOnBackdrop autoCloseMs={2000} onClose={() => { setErrorOpen(false) }} message="Error al realizar la operacion!" />
            <Modal
                visible={loading}
                transparent
                animationType="fade"
                onRequestClose={() => setLoading(false)}
            >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <LoadingArc />
                </View>
            </Modal>
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
        overflow: 'hidden',
    },

    cardHeader: {
        flex: 2.5,
        flexDirection: 'row',
        borderTopLeftRadius: 55,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
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