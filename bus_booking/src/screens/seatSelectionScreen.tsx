import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useQuery, useMutation } from '@tanstack/react-query';

import { fetchBusDetails, bookTicket } from '../service/request/bus';
import { goBack, resetAndNavigate } from '../utils/NavigationUtils';
import TicketModal from '../components/ui/TicketModal';
import PaymentButton from '../components/ui/PaymentButton';
import { StarIcon } from 'react-native-heroicons/solid';
import Seat from '../components/ui/Seat';
import { isGuestSession, getGuestInfo, setGuestInfo } from '../service/storage';

const SeatSelectionScreen = () => {
  const [ticketVisible, setTicketVisible] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);
  
  const route = useRoute();
  const { busId } = route.params as { busId: string };

  const isGuest = isGuestSession();

  // Load guest info if available
  React.useEffect(() => {
    if (isGuest) {
      const guestInfo = getGuestInfo();
      if (guestInfo.name) setGuestName(guestInfo.name);
      if (guestInfo.email) setGuestEmail(guestInfo.email);
    }
  }, [isGuest]);

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
      guestName?: string;
      guestEmail?: string;
    }) => bookTicket(ticketData),
    onSuccess: data => {
      console.log('Ticket booked successfully:', data);
      setBookingData(data);
      setTicketVisible(true);
    },
    onError: error => {
      console.error('Error booking ticket:', error);
      Alert.alert('Booking Failed', 'Failed to book ticket. Please try again.');
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
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    if (!busInfo?.departureTime) {
      Alert.alert('Error', 'Bus information not loaded.');
      return;
    }

    // If guest, show modal to collect info
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }

    // For logged-in users, proceed directly
    proceedWithBooking();
  };

  const proceedWithBooking = () => {
    if (isGuest && (!guestName.trim() || !guestEmail.trim())) {
      Alert.alert('Missing Information', 'Please provide your name and email.');
      return;
    }

    // Save guest info for future use
    if (isGuest) {
      setGuestInfo(guestName.trim(), guestEmail.trim());
    }

    const ticketData = {
      busId,
      date: new Date(busInfo?.departureTime).toISOString(),
      seatNumbers: selectedSeats,
      ...(isGuest && {
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
      }),
    };

    bookTicketMutation.mutate(ticketData);
    setShowGuestModal(false);
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
        <Text className="text-red-500">Error loading bus details.</Text>
        <TouchableOpacity onPress={() => goBack()}>
          <Text className="text-blue-500 mt-2">Go Back</Text>
        </TouchableOpacity>
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
      </ScrollView>

      <PaymentButton
        seat={selectedSeats.length}
        price={busInfo.price}
        onPay={handleOnPay}
      />

      {/* Guest Info Modal */}
      <Modal visible={showGuestModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg mx-4 w-full max-w-sm">
            <Text className="text-xl font-bold mb-4 text-center">Guest Information</Text>
            
            <Text className="text-sm text-gray-600 mb-2">Full Name</Text>
            <TextInput
              value={guestName}
              onChangeText={setGuestName}
              placeholder="Enter your full name"
              className="border border-gray-300 rounded-lg p-3 mb-4"
            />
            
            <Text className="text-sm text-gray-600 mb-2">Email Address</Text>
            <TextInput
              value={guestEmail}
              onChangeText={setGuestEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-lg p-3 mb-6"
            />
            
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowGuestModal(false)}
                className="flex-1 bg-gray-300 p-3 rounded-lg"
              >
                <Text className="text-center font-bold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={proceedWithBooking}
                className="flex-1 bg-red-500 p-3 rounded-lg"
                disabled={!guestName.trim() || !guestEmail.trim()}
              >
                <Text className="text-center font-bold text-white">
                  Book Ticket
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ticket Modal */}
      {ticketVisible && bookingData && (
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
            seats: bookingData.seatNumbers || selectedSeats,
            ticketNumber: bookingData._id || 'xxxXXXXXXX',
            pnr: bookingData.pnr || 'xxxxxxxxxxx',
            fare: bookingData.total_fare || busInfo.price * selectedSeats.length,
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