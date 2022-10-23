import { useContext } from "react";
import { ModalContext } from "../context/ModalContext";

export const useModal = () => {
  const context = useContext(ModalContext);
  return context;
};
