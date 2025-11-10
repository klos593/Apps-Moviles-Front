import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native";

const queryClient = new QueryClient()

export default function Index() {
    return (
        <QueryClientProvider client={queryClient}>
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'flex-start', justifyContent: 'center', margin:5 }}>
                    <Text style={{fontSize:30, color:'#3e6259',fontWeight:'bold'}}>Servicios Realizados</Text>
                </View>
                <View>
                    <View>
                        <TextInput placeholder="Buscar Servicio Realizado" />
                    </View>
                    <View>
                        <Pressable>
                            <Image source={require('../assets/images/EditIcon.png')} />
                        </Pressable>
                    </View>
                </View>
                <View>
                    <FlatList
                        data={[]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item} !</Text>
                            </View>
                        )}
                    >
                    </FlatList>
                </View>
            </View>
        </QueryClientProvider>
    );
}