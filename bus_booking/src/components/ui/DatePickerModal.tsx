import React, { useState } from 'react';
import {
  View,
  Text,
  Platform,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  selectedDate: Date;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedDate,
}) => {
  const [tempDate, setTempDate] = useState<Date>(selectedDate);

  if (Platform.OS === 'android' && visible) {
    return (
      <DateTimePicker
        value={tempDate}
        mode="date"
        display="default"
        onChange={(event, date) => {
          if (date) {
            setTempDate(date);
            onConfirm(date);
          }
          onClose();
        }}
      />
    );
  }

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center" style={styles.modalBackground}>
        <View className="bg-white p-4 rounded-3xl mx-4 w-full">
          {Platform.OS === 'ios' && (
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) setTempDate(date);
              }}
            />
          )}
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="p-3 bg-gray-300 rounded-lg flex-1 mx-2"
            >
              <Text className="text-center text-black font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onConfirm(tempDate);
                onClose();
              }}
              className="p-3 bg-blue-500 rounded-lg flex-1 mx-2"
            >
              <Text className="text-center text-white font-bold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default DatePickerModal;
