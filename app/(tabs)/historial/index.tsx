import { getFinishedProvidedServices, getFinishedUsedServices } from '@/api/api';
import LoadingArc from '@/components/LoadingAnimation';
import SearchBar from '@/components/SearchBar';
import ServiceCard from '@/components/ServiceCard';
import { useAuth, useAuthUser } from '@/src/auth/AuthContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const { email } = useAuthUser();
  const { mode } = useAuth();

  const finishedUsedServicesQuery = useQuery({
    queryKey: ["FinishedUsedServices", email],
    queryFn: () => getFinishedUsedServices(email),
    enabled: mode === "user"
  });

  const finishedProvidedServicesQuery = useQuery({
    queryKey: ["FinishedProvidedServices", email],
    queryFn: () => getFinishedProvidedServices(email),
    enabled: mode === "provider",
  });

  useFocusEffect(
    useCallback(() => {
      finishedUsedServicesQuery.refetch();
      finishedProvidedServicesQuery.refetch();
    }, [])
  );

  const activeQuery =
    mode === "user" ? finishedUsedServicesQuery : finishedProvidedServicesQuery;

  const serviceData = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);

  const [filteredData, setFilteredData] = useState(serviceData);

  useEffect(() => {
    setFilteredData(serviceData);
  }, [serviceData]);

  const handleSearch = (keyWord: string) => {
    if (!keyWord.trim()) {
      setFilteredData(serviceData);
      return;
    }

    const filtered = serviceData.filter((element) =>
      (`${element.name.toLowerCase()} ${element.lastName.toLowerCase()}`).includes(
        keyWord.toLowerCase()
      )
    );

    setFilteredData(filtered);
  };

  if (activeQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingArc />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Historial</Text>
      </View>

      <View style={styles.searchBarAndFilterContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar onSearch={handleSearch} />
        </View>
        <View style={styles.filterContainer}>
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>Filtrar</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 10 }}>
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <ServiceCard data={item} />}
        />
      </View>

      <View style={{ flex: 1.7 }} />
      <BottomWhiteMask />
    </View>
  );
}

function BottomWhiteMask() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  titleContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginTop: 15,
  },
  title: {
    fontWeight: '700',
    fontSize: 30,
    marginLeft: 7,
  },
  searchBarAndFilterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 4,
  },
  filterContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  filterButton: {
    borderRadius: 16,
    backgroundColor: '#20d88fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filterText: {
    color: 'white',
    fontWeight: '700',
  },
});
