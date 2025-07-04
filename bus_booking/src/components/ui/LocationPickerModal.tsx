import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { locations } from '../../utils/dummyData';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: string, type: 'from' | 'to') => void;
  type: 'from' | 'to';
  fromLocation?: string;
}

// Example location data


const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  type,
  fromLocation,
}) => {
  const [search, setSearch] = useState('');

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal transparent={false} visible={visible} animationType="slide">
      <View className="flex-1 bg-white p-4">
        <SafeAreaView />
        <Text className="text-lg font-bold text-center mb-4">
          Select {type === 'from' ? 'Departure' : 'Destination'} City
        </Text>

        <TextInput
          className="p-3 border border-gray-400 rounded-md mb-4"
          placeholder="Search City..."
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (type === 'to' && item === fromLocation) return;
                onSelect(item, type);
                onClose();
              }}
              className="p-3 border-b border-gray-300"
            >
              <Text
                className={`text-base ${
                  item === fromLocation && type === 'to'
                    ? 'text-gray-400'
                    : 'text-black'
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          onPress={onClose}
          className="mt-4 p-3 bg-red-500 rounded-lg"
        >
          <Text className="text-center text-white font-bold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default LocationPickerModal;
