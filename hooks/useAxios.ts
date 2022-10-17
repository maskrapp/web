import axios, { AxiosError } from "axios";
import jwt_decode, { InvalidTokenError, JwtPayload } from "jwt-decode";
import { useUser } from "../context/UserContext";
import { Token } from "../types";
import { BACKEND_URL } from "../utils/constants";

export const useAxios = () => {
  const {
    refreshToken,
    accessToken,
    actions: { setAccessToken },
  } = useUser();

  const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: { Authorization: `Bearer ${accessToken?.token}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    try {
      const decoded = jwt_decode<JwtPayload>(accessToken?.token ?? "");
      const isExpired = Date.now() / 1000 > (decoded.exp ?? 0);
      if (!isExpired) return req;
      const response = await axios.post(`${BACKEND_URL}/api/auth/refresh/`, {
        refresh_token: refreshToken?.token,
      });
      const newToken: Token = response.data;
      const tokens = {
        refresh_token: refreshToken,
        access_token: newToken,
      };
      localStorage.setItem("tokens", JSON.stringify(tokens));
      if (req.headers) {
        req.headers.Authorization = `Bearer ${tokens?.access_token.token}`;
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        // only sign out when the refresh token has expired
        if (e.response?.status === 401) {
          localStorage.removeItem("tokens");
          window.location.reload();
        }
      } else if (e instanceof InvalidTokenError) {
        localStorage.removeItem("tokens");
        window.location.reload();
      }
    } finally {
      return req;
    }
  });
  return axiosInstance;
};
