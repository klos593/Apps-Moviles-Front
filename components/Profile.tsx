import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const Profile = () => {
    //foto *
    //nombre *
    //mail *
    //telefono *
    //descripcion 
    //profesiones
    //boton eliminar *
    //rango trabajo
    //direccion *
    //trabajos realizados --> resenias, calificacion
    //
    return (
        <>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.topContainer}>
                        <View style={styles.pictureContainer}>
                            <Image source={{ uri: 'https://res.cloudinary.com/dvdw8zjel/image/upload/v1761153295/UsuarioPlaceHolder_bzqamd.png' }} style={styles.picture} />
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>Nombre</Text>
                        </View>
                    </View>
                    <View style={styles.middleContainer}>
                        <View style={styles.infoContainer}>
                            <View style={styles.propertyNameView}>
                                <Text style={styles.propertyName}>Mail</Text>
                            </View>
                            <View style={styles.propertyValueView}>
                                <Text>jkdbsakjdbsakdbsahjdbshajdas</Text>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.propertyNameView}>
                                <Text style={styles.propertyName}>Telefono</Text>
                            </View>
                            <View style={styles.propertyValueView}>
                                <Text>jkdbsakjdbsakdbsahjdbshajdas</Text>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.propertyNameView}>
                                <Text style={styles.propertyName}>Direccion</Text>
                            </View>
                            <View style={styles.propertyValueView}>
                                <Text>jkdbsakjdbsakdbsahjdbshajdas</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <Pressable>
                        <Text style={styles.pressableText}>
                            Eliminar Cuenta
                        </Text>
                    </Pressable>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    picture: {
        width: 180,
        height: 180,
        resizeMode: "contain"
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    pictureContainer: {
        flex: 2,
        alignSelf: "center",
        justifyContent: "center",
        margin: 10
    },
    nameContainer: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
        margin: 10

    },
    topContainer: {
        flex: 2,
        flexDirection: 'row',
    },
    bottomContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    middleContainer: {
        flex: 3,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    pressableText: {
        color: 'red',
        fontWeight: 'bold'
    },
    propertyNameView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 10
    },
    propertyValueView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        margin: 10
    },
    card: {
        flex: 5,
        backgroundColor: "#f4f4f6",
        margin: 16,
        borderRadius: 22
    },
    propertyName: {
        fontWeight: 'bold'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20
    }
})

export default Profile;