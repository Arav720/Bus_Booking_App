import React from 'react';
import { View, Text, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useMutation } from '@tanstack/react-query';
import { loginWithGoogle } from '../service/request/auth';
import { resetAndNavigate } from '../utils/NavigationUtils';
import {
  setGuestSession,
  setAccessToken,
  setRefreshToken,
  removeAccessToken,
  removeRefreshToken,
} from '../service/storage';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE', 
});

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: ({ accessToken, refreshToken }) => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      resetAndNavigate('HomeScreen');
    },
    onError: error => {
      console.error('Login failed:', error);
      Alert.alert('Login Error', 'Failed to login with Google. Please try again.');
    },
  });

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) throw new Error('No idToken returned from Google Sign-In');

      loginMutation.mutate(idToken);
    } catch (error: any) {
      console.error('Google Sign-In error:', JSON.stringify(error, null, 2));
      Alert.alert('Login Error', `Google Sign-In failed: ${error.message}`);
    }
  };

  const handleGuestLogin = () => {
    setGuestSession();               // Track guest state
    removeAccessToken();            // Remove any previous login tokens
    removeRefreshToken();           // Avoid using dummy/invalid tokens
    resetAndNavigate('HomeScreen'); // Navigate to app
  };

  return (
    <View>
      <Image source={require('../assets/images/cover.jpeg')} className="w-full h-64 bg-cover" />
      <View className="p-4">
        <Text className="text-xl font-bold font-okra">Create Account or Sign In</Text>

        <View className="my-4 mt-12 border border-black px-2 flex-row items-center">
          <Text className="font-okra w-[10%] font-bold text-base">+91</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
            keyboardType="number-pad"
            placeholder="Enter your phone number"
            className="font-okra h-11 w-[90%]"
          />
        </View>

        <TouchableOpacity
          onPress={handleGoogleLogin}
          className="bg-blue-500 p-3 rounded-lg flex-row items-center justify-center"
        >
          <Text className="text-white font-okra font-bold">Sign in with Google</Text>
        </TouchableOpacity>

        <Text className="text-center my-4 text-gray-700 font-okra">-------OR-------</Text>

        <View className="flex-row items-center justify-center gap-4">
          <TouchableOpacity onPress={handleGoogleLogin} className="border border-gray-300 p-2 rounded-lg">
            <Image source={require('../assets/images/google.png')} className="w-5 h-5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Apple login coming soon')} className="border border-gray-300 p-2 rounded-lg">
            <Image source={require('../assets/images/apple.png')} className="w-5 h-5" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleGuestLogin} className="mt-6 p-3 rounded-lg border border-gray-400 items-center">
          <Text className="font-okra text-gray-700 font-bold">Continue as Guest</Text>
        </TouchableOpacity>

        <Text className="font-okra text-sm text-gray-500 font-medium mt-10 w-72 self-center text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
