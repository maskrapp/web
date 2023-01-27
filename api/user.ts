import { AxiosInstance } from "axios";
import { BACKEND_URL } from "../utils/constants";

export const accountDetails = async (axios: AxiosInstance) => {
  const response = await axios.get<{ email: string }>(
    `${BACKEND_URL}/api/user/account-details`,
  );
  return response.data;
};
