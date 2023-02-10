import { Token } from "@/types";
import { BACKEND_URL } from "@/utils/constants";
import axios, { AxiosResponse } from "axios";

export const refreshAccessToken = async (refreshToken: string) => {
  return axios.post(`${BACKEND_URL}/token/refresh/`, {
    refresh_token: refreshToken,
  }) as Promise<AxiosResponse<Token, any>>;
};

export const revokeRefreshToken = async (refreshToken: string) => {
  return axios.post(`${BACKEND_URL}/token/revoke/`, {
    refresh_token: refreshToken,
  });
};
