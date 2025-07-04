import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchBuses } from '../service/request/bus';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

type RootStackParamList = {
  BusListScreen: { item: { from: string; to: string; date: string } };
  SeatSelectionScreen: { busId: string };
};

const BusListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const params = route?.params as { item?: { from: string; to: string; date: string } };
  const { from, to, date } = params?.item || {};

  // Log to debug
  console.log('🔍 BusList params:', { from, to, date });

  const {
    data: buses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['buses', from, to, date],
    queryFn: () => fetchBuses(from as string, to as string, date as string),
    enabled: !!from && !!to && !!date,
  });

  const goBack = () => navigation.goBack();

  const renderItem = ({ item }: any) => (
<TouchableOpacity
  className="bg-white mb-4 p-4 rounded-lg shadow-sm"
  onPress={() => navigation.navigate('SeatSelectionScreen', { busId: item.busId })}
>
      <Image
        source={require('../assets/images/sidebus.png')}
        className="h-6 w-8"
        resizeMode="contain"
      />
      <Text className="text-lg font-bold text-gray-900 mt-2">{item.company}</Text>
      <Text className="text-sm text-gray-500">{item.busType}</Text>
      <View className="flex-row justify-between mt-2">
        <Text className="text-lg font-semibold text-gray-700">
          {new Date(item.departureTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
          {' - '}
          {new Date(item.arrivalTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </Text>
      </View>
      <View className="flex-row justify-between mt-2 items-center">
        <Text className="text-md text-green-600 font-bold">₹{item.price}</Text>
        <Text className="text-xs text-gray-400 line-through">₹{item.originalPrice}</Text>
        <Text className="text-sm text-gray-600">
          {item?.seats?.flat()?.filter((seat: any) => !seat.booked).length} Seats
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView />
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={goBack}>
          <ArrowLeftIcon size={24} color="#000" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-lg font-bold">{from} → {to}</Text>
          <Text className="text-sm text-gray-500">
            {date ? new Date(date).toDateString() : ''}
          </Text>
        </View>
      </View>

      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="teal" />
          <Text>Loading buses...</Text>
        </View>
      )}

      {error && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 font-bold">Failed to fetch buses.</Text>
        </View>
      )}

      {!isLoading && !error && buses?.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 font-bold">No buses found.</Text>
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={buses}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
});

export default BusListScreen;
