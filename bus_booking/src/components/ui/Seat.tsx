import React, { FC } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import BookedIcon from '../../assets/images/booked.jpg';
import AvailableIcon from '../../assets/images/available.jpg';
import SelectedIcon from '../../assets/images/selected.jpg';

interface Seat {
  seat_id: number;
  booked: boolean;
  type: 'window' | 'side' | 'path';
}

interface SeatProps {
  seats: Seat[][];
  onSeatSelect: (seat_id: number) => void;
  selectedSeats: number[];
}

const SeatLayout: FC<SeatProps> = ({ seats, onSeatSelect, selectedSeats }) => {
  console.log('Rendering SeatLayout with seats:', seats);
  return (
    <View className="mb-4 flex-row justify-between">
      {/* Legend Section */}
      <View className="w-[30%] items-center bg-white rounded-2xl p-4">
        <Text className="font-bold text-lg mb-4">Seat Type</Text>

        <View className="items-center mb-4">
          <Image source={SelectedIcon} className="h-12 w-12 my-1" />
          <Text className="font-medium text-md">Selected</Text>
        </View>

        <View className="items-center mb-4">
          <Image source={AvailableIcon} className="h-12 w-12 my-1" />
          <Text className="font-medium text-md">Available</Text>
        </View>

        <View className="items-center mb-4">
          <Image source={BookedIcon} className="h-12 w-12 my-1" />
          <Text className="font-medium text-md">Booked</Text>
        </View>
      </View>

      {/* Seat Layout Section */}
      <View className="w-[65%] bg-white rounded-2xl p-4">
        <Image
          source={require('../../assets/images/wheel.png')}
          className="h-10 w-10 mb-4 self-end"
        />

        <View className="mt-2 w-full">
          {seats?.map((row, index) => (
            <View
              key={index}
              className="flex-row w-full justify-between items-center mb-2"
            >
              {row.map((s) =>
                s.type === 'path' ? (
                  <View
                    key={s.seat_id}
                    className="p-5 m-1"
                  />
                ) : (
                  <TouchableOpacity
                    key={s.seat_id}
                    disabled={s.booked}
                    onPress={() => onSeatSelect(s.seat_id)}
                    className="m-1"
                  >
                    <Image
                      source={
                        selectedSeats.includes(s.seat_id)
                          ? SelectedIcon
                          : s.booked
                          ? BookedIcon
                          : AvailableIcon
                      }
                      className="h-12 w-12"
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SeatLayout;
