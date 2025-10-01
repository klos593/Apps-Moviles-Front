import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import type { UserData } from "./InfoUser";

type ProfesionalProps = {
    data: UserData;
};

export default function Profesional({data}: ProfesionalProps) {
    return (
        <>
            <View style={styles.firstHalf}>
                <View style={styles.pictureContainer}>
                    <Image source={data.picture} style={styles.picture} />
                </View>
                <View style={styles.informationContainer}>
                    <Text style={styles.name}>{data.name} {data.lastName}</Text>
                </View>
            </View>
            <View style={styles.secondHalf}>
                <Text>Prueba</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    firstHalf: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 10
    },

    picture: {
        width: 200,
        height: 220,
        resizeMode: "contain"
    },

    pictureContainer: {
        alignSelf: "center"
    },

    name: {
        fontSize: 20,
        fontWeight: 700
    },
    
    informationContainer: {
        alignSelf: "flex-start",
        marginTop: 40,
        marginLeft: 15
    },

    secondHalf: {
        flex:2,
    }
});