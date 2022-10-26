import { useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";

export const useModal = () => {
  const context = useContext(ModalContext);
  return context;
};
