import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ServiceDetailsModal from "./ServiceModal";
import ServiceCardData from "./Types/ServiceCardData";
import { DateTime } from 'luxon'
import { getServiceInfoById, updateService } from "@/api/api";

type ServiceCardProps = {
    data: ServiceCardData
}

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
    const qc = useQueryClient();

    const serviceQuery = useQuery({
        queryKey: ["serviceInfo", data.id],
        queryFn: () => getServiceInfoById(data.id),
    });

    useFocusEffect(
        useCallback(() => {
            serviceQuery.refetch();
        }, [])
    );

    const mutation = useMutation({
        mutationFn: (payload: { id: string; state: string }) =>
            updateService(data.id, payload),
        onSuccess: async (updated) => {
            await qc.invalidateQueries({ queryKey: ['service', updated.id] });
            await qc.invalidateQueries({ queryKey: ['activeServices'] });
            setModal(false);
        },
    });

    const onPressUpdateState = (id: string, newState: string) => {
        mutation.mutate({
            id: id,
            state: newState,
        });
    };

    const serviceData = serviceQuery.data

    const openModal = () => {
        setModal(true)
    }

    const handleCancelService = () => {
        onPressUpdateState(data.id, 'CANCELED')
        serviceQuery.refetch()
    };

    const handleAcceptService = async () => {
        await onPressUpdateState(data.id, 'ACCEPTED')
        serviceQuery.refetch()
    };

    const handleRejectService = () => {
        onPressUpdateState(data.id, 'REJECTED')
        serviceQuery.refetch()
    };

    const handleCompleteService = () => {
        onPressUpdateState(data.id, 'COMPLETED')
        serviceQuery.refetch()
    };

    const handleReviewService = () => {
        console.log('hacer review');
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
            <ServiceDetailsModal
                visible={modal}
                onClose={() => setModal(false)}
                service={serviceData}
                onCancelService={() => handleCancelService()}
                onRejectService={() => handleRejectService()}
                onAcceptService={() => handleAcceptService()}
                onCompleteService={() => handleCompleteService()}
                onGoToProfile={() => handleGoToProfile(serviceData.provider.id)}
                onReviewService={() => handleReviewService()}
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