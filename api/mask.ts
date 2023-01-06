import  { AxiosInstance } from "axios";
import { Domain, Mask } from "../types";

export const fetchDomains = async (axios: AxiosInstance) => {
  const response = await axios.get<Domain[]>("/api/user/domains");
  return response.data ?? [];
};
export const addMask = async (axios: AxiosInstance, values: {
  name: string;
  email: string;
  domain: string;
}) => {
  return axios.post("/api/user/add-mask", values);
};
export const deleteMask = async (axios: AxiosInstance, mask: string) => {
  return axios.delete("/api/user/delete-mask", {
    data: { mask: mask },
  });
};

export const setMaskStatus = async (
  axios: AxiosInstance,
  values: { mask: string; value: boolean },
) => {
  return axios.put("/api/user/set-mask-status", values);
};

export const fetchMasks = async (axios: AxiosInstance) => {
  const response = await axios.post<Mask[]>("/api/user/masks");
  return response.data ?? [];
};
