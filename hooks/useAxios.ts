import axios, { AxiosError, AxiosResponse } from "axios";
import { Token, TokenPair } from "../types";
import { BACKEND_URL } from "../utils/constants";
import { useUser } from "./useUser";

let refreshPromise: Promise<AxiosResponse<Token, any>> | null = null;

const refreshAccessToken = async (refreshToken: string) => {
  return axios.post(`${BACKEND_URL}/api/auth/refresh/`, {
    refresh_token: refreshToken,
  }) as Promise<AxiosResponse<Token, any>>;
};

export const useAxios = () => {
  const {
    refreshToken,
    accessToken,
    actions: { setAccessToken },
  } = useUser();

  const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
  });

  axiosInstance.interceptors.request.use((config) => {
    if (accessToken) {
      const tokens = localStorage.getItem("tokens");
      const data: TokenPair = JSON.parse(tokens || "{}");
      config.headers!["Authorization"] = `Bearer ${data.access_token.token}`;
    }
    return config;
  });
  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          if (refreshPromise) {
            // if there's already a request being made to the refresh endpoint, then we just await that promise
            await refreshPromise;
            return axiosInstance(originalConfig);
          }
          try {
            refreshPromise = refreshAccessToken(refreshToken!.token);
            const rs = await refreshPromise;
            const token = rs.data;
            localStorage.setItem(
              "tokens",
              JSON.stringify({
                refresh_token: refreshToken,
                access_token: token,
              })
            );
            setAccessToken(token);
            return axiosInstance(originalConfig);
          } catch (_error: any) {
            if (_error.name === "AxiosError") {
              // log out if token has expired
              if ((_error as AxiosError).response?.status === 401) {
                localStorage.removeItem("tokens");
                window.location.assign("/");
              }
            }
            return Promise.reject(_error);
          } finally {
            refreshPromise = null;
          }
        }
      }

      return Promise.reject(err);
    }
  );

  return axiosInstance;
};
