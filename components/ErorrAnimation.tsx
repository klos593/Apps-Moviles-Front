import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    visible: boolean;
    onClose?: () => void;
    autoCloseMs?: number;      
    message?: string;         
    dismissOnBackdrop?: boolean; 
};

export default function ErrorModal({
    visible,
    onClose,
    autoCloseMs = 2000,
    message = "¡Ha ocurrido un error!",
    dismissOnBackdrop = true,
}: Props) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();

            const t = setTimeout(() => onClose && onClose(), autoCloseMs);
            return () => clearTimeout(t);
        }
    }, [visible, autoCloseMs, onClose, opacityAnim, scaleAnim]);

    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={styles.backdrop}
                onPress={dismissOnBackdrop ? onClose : undefined}
            >
                <Pressable style={{ width: "100%" }} onPress={() => { }}>
                    <View style={styles.center}>
                        <Animated.View
                            style={[
                                styles.card,
                                { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                            ]}
                        >
                            <View style={styles.circle}>
                                <Ionicons name="close" size={80} color="white" />
                            </View>
                            <Text style={styles.text}>{message}</Text>
                        </Animated.View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    center: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: "100%",
        maxWidth: 320,
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 24,
        backgroundColor: "#fff",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    circle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#d22424ff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    text: {
        marginTop: 4,
        fontSize: 17,
        fontWeight: "600",
        color: "#d22424ff",
        textAlign: "center",
    },
});
