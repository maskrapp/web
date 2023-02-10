import { AxiosInstance } from "axios";
import { Domain, Mask } from "../types";

export const fetchDomains = async (axios: AxiosInstance) => {
  const response = await axios.get<Domain[]>("/domains");
  return response.data ?? [];
};
export const addMask = async (axios: AxiosInstance, values: {
  name: string;
  email: string;
  domain: string;
}) => {
  return axios.post("/masks/new", values);
};
export const deleteMask = async (axios: AxiosInstance, mask: string) => {
  return axios.delete(`/masks/${mask}`, {
    data: { mask: mask },
  });
};

export const setMaskStatus = async (
  axios: AxiosInstance,
  values: { mask: string; value: boolean },
) => {
  return axios.put(`/masks/${values.mask}/status`, { value: values.value });
};

export const fetchMasks = async (axios: AxiosInstance) => {
  const response = await axios.get<Mask[]>("/masks");
  return response.data ?? [];
};
