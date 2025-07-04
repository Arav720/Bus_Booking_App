import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import DatePickerModal from '../ui/DatePickerModal';
import LocationPickerModal from '../ui/LocationPickerModal';
import { navigate } from '../../utils/NavigationUtils';

const Search = () => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locationType, setLocationType] = useState<'from' | 'to'>('from');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

  const handleLocationSelect = (location: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFrom(location);
      if (location === to) {
        setTo(null);
      }
    } else {
      setTo(location);
    }
  };

  const handleSearchBuses = () => {
    if (!from || !to) {
      Alert.alert(
        'Missing Information',
        'Please select both departure and destination locations.'
      );
      return;
    }

    if (from === to) {
      Alert.alert(
        'Invalid Selection',
        'Departure and destination locations cannot be the same.'
      );
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      Alert.alert(
        'Invalid Date',
        'Please select a future date for your journey.'
      );
      return;
    }

   navigate('BusListScreen', {
  item: {
    from,
    to,
    date: date.toISOString().split('T')[0], // ✅ "2025-07-05"
  },
});

  };

  return (
    <View className="rounded-b-3xl overflow-hidden">
      <LinearGradient
        colors={['#78B0E6', '#fff']}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <View className="p-4">

          {/* FROM */}
          <TouchableOpacity
            className="my-4 border border-gray-300 bg-white p-4 rounded-xl flex-row gap-4 items-center"
            onPress={() => {
              setLocationType('from');
              setShowLocationPicker(true);
            }}
          >
            <Image
              className="h-5 w-5"
              source={require('../../assets/images/bus.png')}
            />
            <Text className="w-[90%] text-lg font-okra text-gray-600">
              {from || 'From'}
            </Text>
          </TouchableOpacity>

          {/* TO */}
          <TouchableOpacity
            className="my-4 border border-gray-300 bg-white p-4 rounded-xl flex-row gap-4 items-center"
            onPress={() => {
              setLocationType('to');
              setShowLocationPicker(true);
            }}
          >
            <Image
              className="h-5 w-5"
              source={require('../../assets/images/bus.png')}
            />
            <Text className="w-[90%] text-lg font-okra text-gray-600">
              {to || 'To'}
            </Text>
          </TouchableOpacity>

          {/* DATE QUICK SELECT */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="p-2 mr-2 rounded-lg bg-gray-200"
                onPress={() => setDate(new Date())}
              >
                <Text className="font-bold text-sm font-okra">Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 rounded-lg bg-gray-200"
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setDate(tomorrow);
                }}
              >
                <Text className="font-bold text-sm font-okra">Tomorrow</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DATE PICKER TEXT */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setShowDatePicker(true)}
          >
            <View className="mr-3">
              <Text className="text-sm font-normal font-okra text-gray-600">
                Date of Journey
              </Text>
              <Text className="text-md font-bold font-okra text-gray-900">
                {date.toDateString()}
              </Text>
            </View>
            <CalendarDaysIcon color="#000" size={25} />
          </TouchableOpacity>

          {/* SEARCH BUTTON */}
          <TouchableOpacity
            onPress={handleSearchBuses}
            className="bg-red-500 p-3 rounded-xl my-4 flex-row items-center justify-center gap-2"
          >
            <MagnifyingGlassIcon color="#fff" size={22} />
            <Text className="font-okra font-bold text-white text-lg">
              Search Buses
            </Text>
          </TouchableOpacity>

          {/* SIDE IMAGE */}
          <Image
            source={require('../../assets/images/sidebus.jpg')}
            className="h-40 rounded-lg my-4 w-full"
          />
        </View>
      </LinearGradient>
      {showDatePicker&&(
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={setDate}
        selectedDate={date}
      />
      )}
      {showLocationPicker && (
      <LocationPickerModal
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelect={handleLocationSelect}
        type={locationType}
        fromLocation={from || undefined}
      />
      )}
    </View>
  );
};

export default Search;
