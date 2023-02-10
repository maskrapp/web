import { AxiosInstance } from "axios";
import { BACKEND_URL } from "../utils/constants";

export const signup = async (
  axios: AxiosInstance,
  values: { email: string; captcha_token: string },
) => {
  const response = await axios.post(
    `${BACKEND_URL}/auth/signup`,
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
  return axios.post(`${BACKEND_URL}/auth/signup/create`, values);
};

export const resendSignupCode = (
  axios: AxiosInstance,
  values: {
    email: string;
    captcha_token: string;
  },
) => {
  return axios.post(`${BACKEND_URL}/auth/signup/resend`, values);
};

export const verifySignupCode = async (
  axios: AxiosInstance,
  values: {
    email: string;
    code: string;
    captcha_token: string;
  },
) => {
  const response = await axios.post(
    `${BACKEND_URL}/auth/signup/verify`,
    values,
  );
  return { ...response, code: values.code };
};

export const googleSignin = (
  axios: AxiosInstance,
  code: string,
) => {
  return axios.post(`${BACKEND_URL}/auth/signin/google`, { code });
};

export const emailSignin = (
  axios: AxiosInstance,
  values: {
    email: string;
    password: string;
    captcha_token: string;
  },
) => {
  return axios.post(`${BACKEND_URL}/auth/signin/email`, values);
};

export const resetPassword = async (
  axios: AxiosInstance,
  values: { email: string; captcha_token: string },
) => {
  const response = await axios.post(
    `${BACKEND_URL}/auth/reset-password`,
    values,
  );
  return { ...response, email: values.email };
};

export const verifyPasswordCode = async (
  axios: AxiosInstance,
  values: { email: string; code: string; captcha_token: string },
) => {
  const response = await axios.post(
    `${BACKEND_URL}/auth/reset-password/verify`,
    values,
  );
  return { ...response, code: values.code };
};

export const changePassword = async (
  axios: AxiosInstance,
  values: { password: string; token: string; captcha_token: string },
) => {
  return axios.post(`${BACKEND_URL}/auth/reset-password/confirm`, values);
};
