import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface Props {
  text: string;
  submitAction: () => void;
  onClose: () => void;
  submitButtonText: string;
}

export const ConfirmationModal = ({
  submitAction,
  text,
  onClose,
  submitButtonText,
}: Props) => {
  return (
    // isOpen state is managed in parent component
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="warning" rounded="base" mb="3">
            <AlertIcon />
            <AlertDescription>{text}</AlertDescription>
          </Alert>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme={"red"}
            onClick={() => {
              submitAction();
              onClose();
            }}
          >
            {submitButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
