import React from "react"
import { StyleSheet, Text, View } from "react-native"


type ServiceData = {
    nombreProveedor: String,
    apellidoProveedor: String,
    profesionProveedor: String,
    fecha: String,
    lugar: String,
    estado: String,
    precio: Number,
    rating: Number,
    comentario: String,
}

type ServiceCardProps = {
    data: ServiceData
}

export default function ServiceCard({ data }: ServiceCardProps) {

    var borderColor;
    var backgroundTextColor;
    if (data.estado === 'CANCELED' || data.estado === 'REJECTED') {
        borderColor = '#7A7F85'
        backgroundTextColor = '#62666B'
    } else if (data.estado === 'COMPLETED') {
        borderColor = '#294936'
        backgroundTextColor = '#2b6c5f'
    } else if (data.estado === 'PENDING') {
        borderColor = '#5b8266'
        backgroundTextColor = '#3f9a7c'
    } else if (data.estado === 'ACCEPTED') {
        borderColor = '#3e6259'
        backgroundTextColor = '#2b6c5f'
    }

    return (
        <View style={{ ...styles.cardWrapper, borderColor: borderColor }}>
            <View style={{ ...styles.cardHeader, backgroundColor: borderColor, borderColor: borderColor }}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{data.nombreProveedor} {data.apellidoProveedor}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <Text style={{ ...styles.status,backgroundColor: backgroundTextColor}}>{data.estado}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <Text> Servicio (Icono?): {data.profesionProveedor}</Text>
                <Text> Fecha (Icono): {data.fecha.slice(0, 10)} - {data.fecha.slice(11, 16)}</Text>
                <Text> Lugar (Icono): {data.lugar}</Text>
            </View>
        </View>
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
    }
})