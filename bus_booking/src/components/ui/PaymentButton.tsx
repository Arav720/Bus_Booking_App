import React, { FC } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserGroupIcon } from 'react-native-heroicons/outline';

interface PaymentButtonProps {
  price: number;
  seat: number;
  onPay: () => void;
}

const PaymentButton: FC<PaymentButtonProps> = ({ price, seat, onPay }) => {
  const totalAmount = price * seat;
  const discount = totalAmount > 200 ? 100 : 0;
  const finalAmount = totalAmount - discount;

  return (
    <View className="absolute bottom-0 pb-5 shadow-md bg-white w-full rounded-t-2xl px-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-semibold font-okra text-xl">Amount</Text>
          <Text className="font-okra font-medium text-gray-700 text-sm">
            Tax Included
          </Text>
        </View>

        <View>
          <View className="flex-row items-center gap-3">
            {discount > 0 && (
              <Text className="text-gray-500 line-through font-okra font-medium">
                ₹{totalAmount.toFixed(0)}
              </Text>
            )}
            <Text className="font-okra font-medium text-lg">
              ₹{finalAmount.toFixed(0)}
            </Text>
          </View>
          <View className="flex-row self-end items-center gap-1">
            <UserGroupIcon color="gray" size={16} />
            <Text className="font-okra font-medium text-md">{seat} P</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPay}
        className="bg-tertiary my-4 rounded-xl justify-center items-center p-3"
      >
        <Text className="text-white font-semibold text-xl font-okra">
          Pay Now!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentButton;
