import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import {navigationRef} from '../utils/NavigationUtils';
import BusListScreen from '../screens/BusListScreen';
import seatSelectionScreen from '../screens/seatSelectionScreen';
const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="BusListScreen" component={BusListScreen} />
        <Stack.Screen name="SeatSelectionScreen" component={seatSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
