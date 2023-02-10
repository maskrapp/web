import { AxiosInstance } from "axios";
import { Email } from "../types";

export const requestNewCode = async (axios: AxiosInstance, email: string) => {
  const response = await axios.post(`/emails/${email}/create-code`, {
    email,
  });
  return { ...response, email: email };
};

export const verifyCode = (axios: AxiosInstance, email: string, code: string) => {
  return axios.post(`/emails/${email}/verify`, {
    code,
  });
};

export const fetchEmails = async (axios: AxiosInstance) => {
  const response = await axios.get<Email[]>("/emails");
  return response.data ?? [];
};

export const deleteEmail = (axios: AxiosInstance, email: string) => {
  return axios.delete(`/emails/${email}`, {
    data: { email },
  });
};

export const addEmail = async (axios: AxiosInstance, email: string) => {
  const response = await axios.post("/emails/new", {
    email,
  });
  return { ...response, email: email };
};
