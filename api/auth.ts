import { AxiosInstance } from "axios";
import { BACKEND_URL } from "../utils/constants";

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

export const signInWithEmail = (
  axios: AxiosInstance,
  values: {
    email: string;
    password: string;
    captcha_token: string;
  },
) => {
  return axios.post(`${BACKEND_URL}/auth/email-login`, values);
};
