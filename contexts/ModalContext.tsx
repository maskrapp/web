import { createContext, PropsWithChildren, useState } from "react";

interface ModalContextType {
  createMaskModal: useDisclosureProps;
  createEmailModal: useDisclosureProps;
  verifyEmailModal: useDisclosureProps & {
    email: string;
    setEmail: (email: string) => void;
    openWithProps: (email: string) => void;
  };
}

export const ModalContext = createContext<ModalContextType>(
  //TODO: give this a proper value
  null as any as ModalContextType,
);

export const ModalContextProvider = ({ children }: PropsWithChildren) => {
  const [email, setEmail] = useState("");

  const verifyEmailDisclosure = useDisclosure();

  const value: ModalContextType = {
    createEmailModal: useDisclosure(),
    createMaskModal: useDisclosure(),
    verifyEmailModal: {
      ...verifyEmailDisclosure,
      email: email,
      setEmail,
      openWithProps: (email: string) => {
        setEmail(email);
        verifyEmailDisclosure.onOpen();
      },
    },
  };
  return <ModalContext.Provider value={value}>{children}
  </ModalContext.Provider>;
};

interface useDisclosureProps {
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  isOpen: boolean;
}
const useDisclosure = () => {
  const [isOpen, setOpen] = useState(false);

  return {
    onOpen: () => {
      setOpen(true);
    },
    onClose: () => setOpen(false),
    onToggle: () => setOpen(!isOpen),
    isOpen: isOpen,
  } as useDisclosureProps;
};
