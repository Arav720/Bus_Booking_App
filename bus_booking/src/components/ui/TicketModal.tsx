import React, { FC } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { ArrowUpOnSquareIcon, XMarkIcon } from 'react-native-heroicons/solid';
import Svg, { Circle, Line } from 'react-native-svg';

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  bookingInfo: {
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
    company: string;
    busType: string;
    seats: string[] | number[];
    ticketNumber: string;
    pnr: string;
    fare: number | string;
  };
}

const TicketModal: FC<TicketModalProps> = ({ visible, onClose, bookingInfo }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center" style={styles.modalOverlay}>
        {/* Close Button */}
        <TouchableOpacity
          className="bg-white mb-5 shadow-sm p-1 rounded-full"
          onPress={onClose}
        >
          <XMarkIcon color="black" size={22} />
        </TouchableOpacity>

        {/* Ticket Modal Content */}
        <View className="bg-white overflow-hidden rounded-xl w-[90%] p-4 shadow-lg relative">
          <Text className="text-center text-lg font-bold mb-2">Your Ticket</Text>

          {/* Left Notch */}
          <View className="absolute left-[-14px] top-[60%] -translate-y-1/2">
            <Svg height="40" width="28">
              <Circle cx="14" cy="20" r="14" fill="#2A2526" />
            </Svg>
          </View>

          {/* Right Notch */}
          <View className="absolute right-[-14px] top-[60%] -translate-y-1/2">
            <Svg height="40" width="28">
              <Circle cx="14" cy="20" r="14" fill="#2A2526" />
            </Svg>
          </View>

          {/* From → To and Time Info */}
          <View className="bg-gray-100 p-3 rounded-lg">
            <Text className="text-gray-700 font-semibold">
              {bookingInfo.from} → {bookingInfo.to}
            </Text>
            <Text className="text-gray-500 text-sm">
              {bookingInfo.departureTime} - {bookingInfo.arrivalTime}, {bookingInfo.date}
            </Text>
          </View>

          {/* Bus Info */}
          <View className="mt-3">
            <Text className="text-gray-700">{bookingInfo.company}</Text>
            <Text className="text-gray-500 text-sm">{bookingInfo.busType}</Text>
          </View>

          {/* Seats */}
          <View className="mt-3">
            <Text className="text-gray-700">Seats</Text>
            <Text className="text-gray-500 text-sm">
              {bookingInfo?.seats?.toString()}
            </Text>
          </View>

          {/* Dotted Line */}
          <View className="my-6 w-full">
            <Svg height="2" width="100%">
              <Line
                x1="0"
                y1="1"
                x2="300"
                y2="1"
                stroke="gray"
                strokeWidth="2"
                strokeDasharray="6,6"
              />
            </Svg>
          </View>

          {/* Ticket and Fare Info */}
          <View className="mt-3">
            <Text className="text-gray-700">
              Ticket #: {bookingInfo.ticketNumber}
            </Text>
            <Text className="text-gray-700">PNR #: {bookingInfo.pnr}</Text>
            <Text className="text-lg font-bold text-green-600 mt-2">
              ₹{bookingInfo.fare}
            </Text>
          </View>

          {/* Share Button */}
          <TouchableOpacity className="bg-red-500 flex-row gap-2 p-3 rounded-lg mt-4 justify-center items-center">
            <ArrowUpOnSquareIcon color="white" />
            <Text className="text-white font-semibold">Share your ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default TicketModal;
