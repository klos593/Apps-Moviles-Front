import serviciosMock from '@/assets/data/services';
import SearchBar from '@/components/SearchBar';
import ServiceCard from '@/components/ServiceCard';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function Index() {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'flex-start', margin: 10 }}>
          <Text style={{ fontWeight: '700', fontSize: 30, marginLeft: 7 }}>
            Historial
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <View style={{ flex: 4 }}>
            <SearchBar onSearch={function (text: string): void {
              throw new Error('Function not implemented.');
            }} />
          </View>
          <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 15 }}>
            <Pressable style={{ borderRadius: 16, backgroundColor: '#20d88fff', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 }}>
              <Text>
                Filtrar
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 10 }}>
          <FlatList data={serviciosMock} renderItem={({ item }) => (
            <ServiceCard data={item} />
          )} />
        </View>
        <View style= {{flex:1.7}}></View>
      </View>
      <BottomWhiteMask />
    </QueryClientProvider>
  );
}

function BottomWhiteMask() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: tabBarHeight + insets.bottom - 10,
          backgroundColor: "#F5F6FA",
          zIndex: 5,
        }}
      />
    </>
  );
}