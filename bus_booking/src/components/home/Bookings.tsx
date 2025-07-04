import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import Search from './Search';
import BookItem from './BookItem';
import { fetchUserTickets, fetchGuestTickets } from '../../service/request/bus';
import { tabs } from '../../utils/dummyData';
import { getAccessToken } from '../../service/storage';

const Bookings = () => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [email, setEmail] = useState('');
  const [showTickets, setShowTickets] = useState(false);

  const [tokenAvailable, setTokenAvailable] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setTokenAvailable(!!token);
    setIsGuest(!token);
  }, []);

  const {
    data: tickets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: isGuest ? ['guestTickets', email] : ['userTickets'],
    queryFn: () =>
      isGuest ? fetchGuestTickets(email) : fetchUserTickets(),
    enabled: tokenAvailable || (isGuest && showTickets && !!email),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  useFocusEffect(
    useCallback(() => {
      if (tokenAvailable || (isGuest && showTickets)) {
        refetch();
      }
    }, [refetch, tokenAvailable, isGuest, showTickets])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredBookings =
    selectedTab === 'All'
      ? tickets
      : tickets.filter((ticket: any) => ticket.status === selectedTab);

  if (isGuest && !showTickets) {
    return (
      <View className="flex-1 justify-center items-center px-4 bg-white">
        <Text className="text-xl font-bold mb-4 text-gray-700">Enter your email</Text>
        <TextInput
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-gray-800 bg-white"
        />
        <TouchableOpacity
          onPress={() => {
            if (email.trim() !== '') {
              setShowTickets(true);
              refetch();
            }
          }}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">View Bookings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Error loading bookings</Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4">
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item._id}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="py-20 justify-center items-center">
            <Text className="text-gray-500 text-lg">No bookings found</Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <Search />
            <Text className="text-2xl font-bold my-4 text-gray-800">Past Bookings</Text>
            <View className="flex-row mb-4 flex-wrap">
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-full mb-2 mr-2 ${
                    selectedTab === tab ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      selectedTab === tab ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        renderItem={({ item }) => <BookItem item={item} />}
      />
    </View>
  );
};

export default Bookings;
