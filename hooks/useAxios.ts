import axios, { AxiosHeaders, AxiosResponse, isAxiosError } from "axios";
import { Token } from "@/types";
import { BACKEND_URL } from "@/utils/constants";
import { refreshAccessToken } from "@/api/token";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: BACKEND_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    (config.headers as AxiosHeaders).set(
      "Authorization",
      `Bearer ${access_token}`,
    );
  }
  return config;
});

let refreshPromise: Promise<AxiosResponse<Token, any>> | null = null;

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (!err.response) {
      return Promise.reject(err);
    }
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      if (refreshPromise) {
        // block if there's already a request being made to the refresh token endpoint
        await refreshPromise;
        return axiosInstance(originalConfig);
      }
      try {
        const response = await (refreshPromise = refreshAccessToken(
          localStorage.getItem("refresh_token") ?? "invalid_token",
        ));
        const token = response.data;
        localStorage.setItem("access_token", token.token);
        return axiosInstance(originalConfig);
      } catch (_error: any) {
        if (isAxiosError(_error)) {
          // log out if refresh token has expired
          if (_error.response?.status === 401) {
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token");
            window.location.assign("/");
          }
        }
        return Promise.reject(_error);
      } finally {
        refreshPromise = null;
      }
    }
  },
);

export const useAxios = () => {
  return axiosInstance;
};
