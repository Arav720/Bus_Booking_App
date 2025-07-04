import React from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { UserCircleIcon } from 'react-native-heroicons/solid';
import { logout } from '../service/request/auth';
import Bookings from '../components/home/Bookings';

const HomeScreen = () => {
  return (
    <View className="flex-1 bg-white">
      {/* SafeArea + StatusBar padding */}
      <SafeAreaView className="bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View className="flex-row justify-between items-center px-4 pt-2 pb-4">
          <Text className="font-okra font-semibold text-2xl text-gray-800">
            Bus Tickets
          </Text>
          <UserCircleIcon color="red" size={38} onPress={logout} />
        </View>
      </SafeAreaView>

      {/* Main content */}
      <View className="flex-1 px-4">
        <Bookings />
      </View>
    </View>
  );
};

export default HomeScreen;
