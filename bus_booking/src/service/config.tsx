// src/service/config.tsx

import { Platform } from 'react-native';

// ✅ Set your PC's IP address here (used for real device testing)
export let BASE_URL = 'http://192.168.43.36:4000';

/**
 * Returns the base URL depending on platform and environment.
 * You can customize this further if needed.
 */
export const getBaseUrl = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    // Emulator vs Real device — if using emulator, use 10.0.2.2
    const isEmulator = true; // Set manually if not using `DeviceInfo`
    BASE_URL = isEmulator
      ? 'http://10.0.2.2:4000'
      : 'http://192.168.43.36:4000'; //  PC's IP
  } else {
    BASE_URL = 'http://192.168.43.36:4000';
  }

  return BASE_URL;
};
