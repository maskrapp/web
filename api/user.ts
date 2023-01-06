import { AxiosInstance } from "axios";
import { BACKEND_URL } from "../utils/constants";

export const accountDetails = async (axios: AxiosInstance) => {
  const response = await axios.get<{ name: string; email: string }>(
    `${BACKEND_URL}/api/user/account-details`,
  );
  return response.data;
};

export const createAccountCode = async (
  axios: AxiosInstance,
  values: { email: string; captcha_token: string },
) => {
  const response = await axios.post(
    `${BACKEND_URL}/auth/create-account-code`,
    values,
  );
  return { ...response, email: values.email };
};

export const createAccount = (
  axios: AxiosInstance,
  values: {
    name: string;
    email: string;
    password: string;
    code: string;
    captcha_token: string;
  },
) => {
  return axios.post(`${BACKEND_URL}/auth/create-account`, values);
};

export const resendCode = (
  axios: AxiosInstance,
  values: {
    email: string;
    captcha_token: string;
  },
) => {
  return axios.post(`${BACKEND_URL}/auth/resend-account-code`, values);
};

export const verifyAccountCode = async (
  axios: AxiosInstance,
  values: {
    email: string;
    code: string;
    captcha_token: string;
  },
) => {
  const response = await axios.post(
    `${BACKEND_URL}/auth/verify-account-code`,
    values,
  );
  return { ...response, code: values.code };
};
