    import React, { useState } from "react";
    import {
    Modal,
    View,
    Text,
    Pressable,
    TextInput,
    StyleSheet,
    } from "react-native";
    import { FontAwesome } from "@expo/vector-icons";

    type Props = {
        onClose: () => void;
        accept: (rating: number, comment: string) => void;
        visible: boolean
    };

    export default function ReviewModal({ onClose, accept, visible }: Props) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleStarPress = (value: number) => {
        setRating(value);
    };

    return (
        <Modal animationType="fade" transparent visible={visible}>
        <View style={styles.overlay}>
            <View style={styles.container}>
            <Text style={styles.title}>Dejar una reseña</Text>

            <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                <Pressable key={value} onPress={() => handleStarPress(value)}>
                    <FontAwesome
                        name={value <= rating ? "star" : "star-o"}
                        size={35}
                        color="#FFD700"
                        style={{ marginHorizontal: 3 }}
                    />
                </Pressable>
                ))}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Escribe tu comentario..."
                value={comment}
                onChangeText={setComment}
                multiline
            />

            <View style={styles.buttonRow}>
                <Pressable style={styles.closeBtn} onPress={onClose}>
                    <Text style={styles.btnText}>Cerrar</Text>
                </Pressable>

                <Pressable
                style={styles.acceptBtn}
                onPress={() => accept(rating, comment)}
                >
                    <Text style={styles.btnText}>Aceptar</Text>
                </Pressable>
            </View>
            </View>
        </View>
        </Modal>
    );
    }

    const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
    },
    starRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        minHeight: 90,
        textAlignVertical: "top",
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    closeBtn: {
        flex: 1,
        marginRight: 10,
        backgroundColor: "#d9534f",
        padding: 12,
        borderRadius: 8,
    },
    acceptBtn: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: "#5cb85c",
        padding: 12,
        borderRadius: 8,
    },
    btnText: {
        textAlign: "center",
        color: "white",
        fontWeight: "600",
    },
    });