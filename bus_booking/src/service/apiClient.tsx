import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  removeAccessToken,
  removeRefreshToken,
} from './storage';
import { getBaseUrl } from './config';

const createApiClient = async () => {
  const BASE_URL = await getBaseUrl();

  const apiClient = axios.create({
    baseURL: BASE_URL,
  });

  // ✅ Attach token to every request
  apiClient.interceptors.request.use(
    config => {
      const token = getAccessToken(); // MMKV is synchronous
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // ✅ Handle token refresh on 403
  apiClient.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 403) {
        const refreshToken = getRefreshToken();
        console.log('📛 Refresh token from storage:', refreshToken);

        if (!refreshToken || typeof refreshToken !== 'string') {
          console.log('❌ No valid refresh token, logging out');
          removeAccessToken();
          removeRefreshToken();
          return Promise.reject(error);
        }

        try {
          const { data } = await axios.post(`${BASE_URL}/user/refresh`, {
            refreshToken,
          });

          const newAccessToken = data?.accessToken;
          console.log('🔄 New access token received:', newAccessToken);

          setAccessToken(newAccessToken);
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;

          return axios(error.config);
        } catch (refreshError) {
          if (refreshError instanceof Error) {
            console.error('❌ Refresh token failed:', refreshError.message);
          } else {
            console.error('❌ Refresh token failed:', refreshError);
          }
          removeAccessToken();
          removeRefreshToken();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default createApiClient;
