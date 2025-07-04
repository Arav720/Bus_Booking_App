import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,

  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useQuery, useMutation } from '@tanstack/react-query';

import { fetchBusDetails, bookTicket } from '../service/request/bus';
import { goBack, resetAndNavigate } from '../utils/NavigationUtils';
import TicketModal from '../components/ui/TicketModal';
import PaymentButton from '../components/ui/PaymentButton';
import { StarIcon } from 'react-native-heroicons/solid';
import Seat from '../components/ui/Seat';

const SeatSelectionScreen = () => {
  const [ticketVisible, setTicketVisible] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const route = useRoute();
  const { busId } = route.params as { busId: string };

  const {
    data: busInfo,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['busDetails', busId],
    queryFn: () => fetchBusDetails(busId),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const bookTicketMutation = useMutation({
    mutationFn: (ticketData: {
      busId: string;
      date: string;
      seatNumbers: number[];
    }) => bookTicket(ticketData),
    onSuccess: data => {
      console.log('Ticket booked successfully:', data);
      setTicketVisible(true);
    },
    onError: error => {
      console.error('Error booking ticket:156', error);
      Alert.alert('Failed to book ticket. Please try again.');
    },
  });

  const handleSeatSelection = (seat_id: number) => {
    setSelectedSeats(prev =>
      prev.includes(seat_id)
        ? prev.filter(id => id !== seat_id)
        : [...prev, seat_id]
    );
  };

  const handleOnPay = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Please select at least one seat.');
      return;
    }

    if (!busInfo?.departureTime) {
      Alert.alert('Bus information not loaded.');
      return;
    }

    bookTicketMutation.mutate({
      busId,
      date: new Date(busInfo?.departureTime).toISOString(),
      seatNumbers: selectedSeats,
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="teal" />
        <Text className="text-gray-500 mt-2">Loading bus details...</Text>
      </View>
    );
  }

  if (isError || !busInfo) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error loading bus details.
          <TouchableOpacity onPress={()=>goBack()}>
            <Text className="text-blue-500">Go Back</Text>
          </TouchableOpacity>
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}
        className="pb-52 bg-teal-100 p-4"
      >
        <View className="bg-white p-4 rounded-lg shadow-md mb-4">
          {/* Company & Rating */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">{busInfo?.company}</Text>
            <View className="flex-row items-center gap-1">
              <StarIcon size={18} color="gold" />
              <Text className="text-sm text-gray-500">
                {busInfo?.rating} ({busInfo?.totalReviews})
              </Text>
            </View>
          </View>

          {/* Arrival */}
          <View className="mt-2">
            <Text className="text-sm text-gray-500">Arrival</Text>
            <Text className="text-lg font-medium text-black">
              {new Date(busInfo.arrivalTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          {/* Seats Available */}
          <Text className="mt-3 text-green-500 text-sm">
            {busInfo?.seats?.flat().filter((seat: any) => !seat.booked).length} Seats Available
          </Text>

          {/* Pricing */}
          <View className="flex-row items-center mt-2">
            <Text className="text-gray-400 line-through text-lg">
              ₹{busInfo?.originalPrice || busInfo?.price + 100}
            </Text>
            <Text className="text-xl font-bold text-black ml-2">
              ₹{busInfo?.price}
            </Text>
          </View>

          {/* Badges */}
          <View className="flex-row gap-2 mt-3 flex-wrap">
            {busInfo?.badges?.map((badge: string, index: number) => (
              <View
                key={index}
                className="bg-yellow-200 px-2 py-1 rounded-full"
              >
                <Text className="text-xs text-yellow-800 font-semibold">
                  {badge}
                </Text>
              </View>
            ))}
          </View>
        </View>
       <Seat
        selectedSeats={selectedSeats}
        seats={busInfo?.seats}
        onSeatSelect={handleSeatSelection}
        />
        {/* Seat map should be rendered here */}
      </ScrollView>

      <PaymentButton
        seat={selectedSeats.length}
        price={busInfo.price}
        onPay={handleOnPay}
      />

      {ticketVisible && (
        <TicketModal
          visible={ticketVisible}
          bookingInfo={{
            from: busInfo.from,
            to: busInfo.to,
            departureTime: new Date(busInfo.departureTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            arrivalTime: new Date(busInfo.arrivalTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            date: new Date(busInfo.departureTime).toDateString(),
            company: busInfo.company,
            busType: busInfo.busType,
            seats: bookTicketMutation.data?.seatNumbers || [],
            ticketNumber: bookTicketMutation.data?._id || 'xxxXXXXXXX',
            pnr: bookTicketMutation.data?.pnr || 'xxxxxxxxxxx',
            fare: `₹${busInfo.price * selectedSeats.length}`,
          }}
          onClose={() => {
            setTicketVisible(false);
            resetAndNavigate('HomeScreen');
          }}
        />
      )}
    </View>
  );
};

export default SeatSelectionScreen;
