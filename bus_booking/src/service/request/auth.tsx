import { resetAndNavigate } from "../../utils/NavigationUtils";
import apiClient from "../apiClient";
import {
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearGuestSession,
  clearGuestInfo,
} from "../storage";
import axios from "axios";
import { getBaseUrl } from "../config";

export const loginWithGoogle = async (idToken: string) => {
  const api = await apiClient();
  const { data } = await api.post("/user/login", {
    id_token: idToken,
  });
  setAccessToken(data?.accessToken);
  setRefreshToken(data?.refreshToken);
  return data;
};

export const logout = async () => {
  removeAccessToken();
  removeRefreshToken();
  clearGuestSession();
  clearGuestInfo();
  resetAndNavigate("LoginScreen");
};

export const refresh_token = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No Refresh Token found");

    const BASE_URL = await getBaseUrl();
    const { data } = await axios.post(`${BASE_URL}/user/refresh`, {
      refreshToken,
    });

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    } else {
      throw new Error("Invalid Refresh response");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    return false;
  }
};