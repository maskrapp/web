import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw "UserContext is not initialized";
  }
  return context;
};
