import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { UserData } from "./InfoUser";
import Rating from "./Rating";

type ProfesionalProps = {
    data: UserData;
};

export default function Profesional({data}: ProfesionalProps) {
    return (
        <View style={{flex:1, backgroundColor:"#fff"}}>
            <View style={{flex:1, backgroundColor:"#f4f4f6", margin: 16, borderRadius: 22}}>
                <View style={styles.firstHalf}>
                    <View style={styles.pictureContainer}>
                        <Image source={data.picture} style={styles.picture} />
                    </View>
                    <View style={styles.informationContainer}>
                        <View style={{flex: 2, justifyContent: "center", alignItems: 'center'}}>
                            <Text style={styles.name}>{data.name} {data.lastName}</Text>
                            <View style={styles.rating}>
                                <Rating rating={data.rating}/>
                                <Text style={styles.numberedRating}>{data.rating}</Text>
                            </View>
                        </View>
                        <View style={styles.professionsContainer}>
                            <Text style={styles.professions}>
                                {data.profession}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.secondHalf}>
                    <View style= {styles.contactContainer}>

                        <Text style={styles.text}>Descripcion: {data.description}</Text>
                        <Text style={styles.text}>Telefono: {data.phoneNumber}</Text>
                        <Text style={styles.text}>Mail: {data.mail}</Text>

                    </View>

                    <View style= {{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Pressable style = {{ backgroundColor: "#3E6259", borderRadius: 15, justifyContent: "center", alignItems: "center", padding: 10}}>
                            <Text style = {{ color: "#FFFFFF", fontWeight: "600", fontSize: 25}}>
                                Contactar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
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
        width: 200,
        height: 200,
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
        justifyContent: "flex-start", 
        alignItems: "center",
    },

    professions: {
        backgroundColor: "#5b8266", 
        borderRadius: 15, 
        padding: 5, 
        fontWeight: 500,
        fontSize: 17
    },

    contactContainer: {
        flex: 1, 
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 10
    },

    text: {
        fontSize: 19,
        alignSelf: "baseline"
    }
});