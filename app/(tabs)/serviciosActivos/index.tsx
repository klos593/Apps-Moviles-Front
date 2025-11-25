import { getProviderActiveServices, getUserActiveServices } from '@/api/api';
import { BottomWhiteMask } from '@/components/BottomWhiteMask';
import Filtro from '@/components/Filtro';
import LoadingArc from '@/components/LoadingAnimation';
import SearchBar from '@/components/SearchBar';
import ServiceCard from '@/components/ServiceCard';
import { useAuth, useAuthUser } from '@/src/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

type Filtrados = {
    fromDate?: string | null;
    toDate?: string | null;
    status?: string | null;
    profession?: string | null;
};

export default function Index() {
    const { email } = useAuthUser();
    const { mode } = useAuth();

    const userActiveServicesQuery = useQuery({
        queryKey: ["UserActiveServices", email],
        queryFn: () => getUserActiveServices(email),
        enabled: mode === "user",
    });

    const providerActiveServicesQuery = useQuery({
        queryKey: ["ProviderActiveServices", email],
        queryFn: () => getProviderActiveServices(email),
        enabled: mode === "provider",
    });

    const activeQuery = mode === "user" ? userActiveServicesQuery : providerActiveServicesQuery;

    const serviceData = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);

    const [filteredData, setFilteredData] = useState(serviceData);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<Filtrados>({});
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        let data = [...serviceData];

        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            data = data.filter((element: any) =>
                (`${element.name.toLowerCase()} ${element.lastName.toLowerCase()}`).includes(lower)
            );
        }

        if (filters.status) {
            data = data.filter((element: any) => element.state === filters.status);
        }

        if (filters.profession) {
            data = data.filter((element: any) => element.profession === filters.profession);
        }

        if (filters.fromDate) {
            const from = new Date(filters.fromDate);
            data = data.filter((element: any) => {
                const d = new Date(element.date); 
                return d >= from;
            });
        }

        if (filters.toDate) {
            const to = new Date(filters.toDate);
            data = data.filter((element: any) => {
                const d = new Date(element.date); 
                return d <= to;
            });
        }

        setFilteredData(data);
    }, [serviceData, searchTerm, filters]);

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
    }

    const handleApplyFilters = (newFilters: Filtrados) => {
        setFilters(newFilters);
        setIsFilterModalVisible(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        activeQuery.refetch()
        setTimeout(() => {
        setRefreshing(false);
        }, 1000);
    };

    if (activeQuery.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <LoadingArc />
            </View>
        );
    }

    const statusOptions = ["ACCEPTED", "PENDING"];

    return (
        <>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Próximos servicios
                    </Text>
                </View>
                <View style={styles.searchBarAndFilterContainer}>
                    <View style={styles.searchBarContainer}>
                        <SearchBar onSearch={handleSearch} />
                    </View>
                    <View style={styles.filterContainer}>
                        <Pressable 
                        style={styles.filterButton}
                        onPress={() => setIsFilterModalVisible(true)}>
                            <Text style={styles.filterText}>
                                Filtrar
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <View style={{ flex: 10 }}>
                    <FlatList 
                        data={filteredData} 
                        renderItem={({ item }) => (<ServiceCard data={item} />)} 
                        ListEmptyComponent={<Text style={styles.emptyText}>No hay servicios programados actualmente</Text>}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                </View>
                <View style={{ flex: 1.7 }}></View>
            </View>
            <BottomWhiteMask />
            <Filtro
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onApply={handleApplyFilters}
                statuses={statusOptions}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA'
    },

    titleContainer: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginHorizontal: 10,
        marginTop: 15
    },

    title: {
        fontWeight: 700,
        fontSize: 30,
        marginLeft: 7
    },

    searchBarAndFilterContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    searchBarContainer: {
        flex: 4
    },

    filterContainer: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 15
    },

    filterButton: {
        borderRadius: 16,
        backgroundColor: '#20d88fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Platform.OS === "android" ? 7 : 9,
        paddingHorizontal: Platform.OS === "android" ? 10 : 12,
    },

    filterText: {
        color: "white",
        fontWeight: 700
    },

    emptyText: {
        color: "#6B7A90",
        marginTop: 200,
        justifyContent:"center",
        alignSelf: "center"
    }
})