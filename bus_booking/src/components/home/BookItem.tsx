import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { UserGroupIcon } from 'react-native-heroicons/solid';
import TicketModal from '../ui/TicketModal';

interface BusItemProps {
  item: {
    _id: string;
    status: string;
    date: string;
    seatNumbers: number[];
    totalFare: number;
    pnr: string;
    bus: {
      from: string;
      to: string;
      type: string;
      busType: string;
      company: string;
      departureTime: string;
      arrivalTime: string;
    };
  };
}

const BookItem: React.FC<BusItemProps> = ({ item }) => {
  const [ticketVisible, setTicketVisible] = useState(false);

  return (
    <View className="bg-gray-100 p-4 rounded-lg mb-3">
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-2">
        <Image
          source={require('../../assets/images/sidebus.png')}
          className="h-6 w-8"
          resizeMode="contain"
        />
        <Text className="text-gray-500">{item?.status}</Text>
      </View>

      {/* Route */}
      <Text className="text-lg font-bold">
        {item?.bus?.from} → {item?.bus?.to}
      </Text>

      {/* Date */}
      <Text className="text-gray-600">
        {new Date(item?.date)?.toDateString()}
      </Text>

      {/* Type */}
      <Text className="text-gray-600">{item?.bus?.type}</Text>

      {/* Seats */}
      <View className="flex-row items-center mt-2">
        <UserGroupIcon size={18} color="gray" />
        <Text className="ml-2 text-gray-600">
          {item.seatNumbers?.join(', ')}
        </Text>
      </View>

      {/* Cancelled Info */}
      {item.status === 'Cancelled' && (
        <Text className="text-green-600 font-bold mt-2">
          Refund completed
        </Text>
      )}

      {/* See Ticket Button */}
      <TouchableOpacity
        onPress={() => setTicketVisible(true)}
        className="mt-2 bg-red-500 py-2 px-4 rounded-lg"
      >
        <Text className="text-white text-center font-bold">See Ticket</Text>
      </TouchableOpacity>

      {/* Ticket Modal */}
      {ticketVisible && (
        <TicketModal
          visible={ticketVisible}
          onClose={() => setTicketVisible(false)}
          bookingInfo={{
            from: item?.bus?.from,
            to: item?.bus?.to,
            departureTime: new Date(item?.bus?.departureTime).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            }),
            arrivalTime: new Date(item?.bus?.arrivalTime).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            }),
            date: new Date(item?.bus?.departureTime).toDateString(),
            company: item?.bus?.company,
            busType: item?.bus?.busType,
            seats: item?.seatNumbers,
            ticketNumber: item?._id,
            pnr: item?.pnr,
            fare: item?.totalFare,
          }}
        />
      )}
    </View>
  );
};

export default BookItem;
