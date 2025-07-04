import { View, Text, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getAccessToken, getRefreshToken, isGuestSession } from '../service/storage';
import { resetAndNavigate } from '../utils/NavigationUtils';
import { refresh_token } from '../service/request/auth';

interface DecodedToken {
  exp: number;
}

const SplashScreen = () => {
  const tokenCheck = async () => {
    const isGuest = isGuestSession();
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    // If user is guest, go directly to home
    if (isGuest) {
      resetAndNavigate('HomeScreen');
      return;
    }

    // If user has valid tokens, check and refresh if needed
    if (accessToken && refreshToken) {
      try {
        const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
        const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

        const currentTime = Date.now() / 1000;

        if (decodedRefreshToken?.exp < currentTime) {
          resetAndNavigate('LoginScreen');
          Alert.alert('Session Expired', 'Please login again to continue.');
          return;
        }

        if (decodedAccessToken?.exp < currentTime) {
          const refreshed = await refresh_token();
          if (!refreshed) {
            Alert.alert('Error', 'Token refresh failed. Please login again.');
            resetAndNavigate('LoginScreen');
            return;
          }
        }

        resetAndNavigate('HomeScreen');
        return;
      } catch (error) {
        console.error('Token validation error:', error);
        resetAndNavigate('LoginScreen');
        return;
      }
    }

    // No valid session found, go to login
    resetAndNavigate('LoginScreen');
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      tokenCheck();
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image source={require('../assets/images/logo_t.png')} className="h-[30%] w-[60%]" resizeMode="contain" />
      <Text>Bus Booking</Text>
    </View>
  );
};

export default SplashScreen;