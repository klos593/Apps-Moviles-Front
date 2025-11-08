import React, { useState } from "react";
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Rating from "./Rating";
import SuccessModal from "./SuccesAnimation";
import { ProfessionalData } from "./Types/ProfessionalData";

type ProfesionalProps = {
    data: ProfessionalData;
};

export default function Profesional({ data }: ProfesionalProps) {

    const [modal, setModal] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const showModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const contactProfessional = () => {
        //Aca va la logica para contactar al profesional (crear un serviciio y ponerlo en pending y avisarle de alguna forma al profesional)
        setSuccessOpen(true);
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1, backgroundColor: "#f4f4f6", margin: 16, borderRadius: 22 }}>
                    <View style={styles.firstHalf}>
                        <View style={styles.pictureContainer}>
                            <Image source={{ uri: data.picture }} style={styles.picture} />
                        </View>
                        <View style={styles.informationContainer}>
                            <View style={{ flex: 2, justifyContent: "center", alignItems: 'center' }}>
                                <Text style={styles.name}>{data.name} {data.lastName}</Text>
                                <View style={styles.rating}>
                                    <Rating rating={data.rating} />
                                    <Text style={styles.numberedRating}>{(data.rating).toString().slice(0, 3)}</Text>
                                </View>
                            </View>
                            <View style={styles.professionsContainer}>
                                <FlatList
                                    data={data.professions}
                                    renderItem={({ item }) => (
                                        <View style={{ margin: 2 }}>
                                            <Text style={styles.professions}>{item}</Text>
                                        </View>
                                    )} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.secondHalf}>
                        <View style={styles.contactContainer}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                                <Text style={{ justifyContent: 'center', textAlign: 'center' }}>Descripcion: {data.description}</Text>
                            </View>
                            <View>
                                <Text style={styles.text}>ACA VAN REVIEWS (un flatlist horizontal)</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Pressable style={{ backgroundColor: "#3E6259", borderRadius: 15, justifyContent: "center", alignItems: "center", padding: 10 }} onPress={contactProfessional}>
                                <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 25 }}>Contactar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            <Modal visible={modal} transparent={true} animationType="fade" allowSwipeDismissal={true} onRequestClose={closeModal}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 350, height: 500, backgroundColor: 'white', borderRadius: 20, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Pressable onPress={closeModal} style={{ alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                                <Image source={{ uri: 'https://res.cloudinary.com/dvdw8zjel/image/upload/v1762472196/cancel_17875314_bbohnu.png' }} style={{ width: 30, height: 30 }} />
                            </Pressable>
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 20 }}>Contacto</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1, width: '90%' }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Pressable>
                                    <Image source={{ uri: 'https://res.cloudinary.com/dvdw8zjel/image/upload/v1762470194/whatsapp_185988_oq7nsm.png' }} style={{ height: 50, width: 50 }}></Image>
                                </Pressable>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Pressable>
                                    <Image source={{ uri: 'https://res.cloudinary.com/dvdw8zjel/image/upload/v1762470184/email_552486_mngyzs.png' }} style={{ height: 50, width: 50 }}></Image>
                                </Pressable>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Pressable>
                                    <Image source={{ uri: 'https://res.cloudinary.com/dvdw8zjel/image/upload/v1762470179/phone_552489_e1r0cl.png' }} style={{ height: 50, width: 50 }}></Image>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <SuccessModal visible={successOpen}
                onClose={() => setSuccessOpen(false)}
                autoCloseMs={2000}
                message="¡El profesional fue contactado con exito!"
                dismissOnBackdrop
            />
        </>
    );
}

const styles = StyleSheet.create({
    firstHalf: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 10
    },

    picture: {
        width: 160,
        height: 160,
        resizeMode: "contain"
    },

    pictureContainer: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "center"
    },

    name: {
        fontSize: 22,
        fontWeight: 700
    },

    informationContainer: {
        alignSelf: "center",
        flex: 1,
        justifyContent: "center"
    },

    secondHalf: {
        flex: 1.5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    rating: {
        flexDirection: "row",
        marginTop: 6
    },

    numberedRating: {
        marginLeft: 7
    },

    professionsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    professions: {
        backgroundColor: "#5b8266",
        borderRadius: 15,
        padding: 5,
        fontWeight: 500,
        fontSize: 14,
        color: 'white',
    },

    contactContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },

    text: {
        fontSize: 19,
        alignSelf: "baseline"
    }
});