import { AxiosInstance } from "axios";
import { Email } from "../types";

export const requestNewCode = async (axios: AxiosInstance, email: string) => {
  const response = await axios.post("/api/user/request-code", {
    email,
  });
  return { ...response, email: email };
};

export const fetchEmails = async (axios: AxiosInstance) => {
  const response = await axios.post<Email[]>("/api/user/emails");
  return response.data ?? [];
};

export const deleteEmail = (axios: AxiosInstance, email: string) => {
  return axios.delete("/api/user/delete-email", {
    data: { email },
  });
};

export const addEmail = async (axios: AxiosInstance, email: string) => {
  const response = await axios.post("/api/user/add-email", {
    email,
  });
  return { ...response, email: email };
};
