import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { fetchEmails } from "../../../api/email";
import { addMask, fetchDomains } from "../../../api/mask";
import { useAxios } from "../../../hooks/useAxios";
import { APIResponse } from "../../../types";

interface Props {
  closeFn: () => void;
}

interface FormValues {
  name: string;
  email: string;
  domain: string;
}

export const CreateMaskModal = ({ closeFn }: Props) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const emailRef = useRef<HTMLSelectElement>(null);
  const domainRef = useRef<HTMLSelectElement>(null);

  const axios = useAxios();

  const [domain, setDomain] = useState("");

  const emailQuery = useQuery(["emails"], () => fetchEmails(axios));
  const domainsQuery = useQuery(["domains"], () => fetchDomains(axios), {
    onSuccess: (data) => {
      setDomain(data[0].domain);
    },
  });

  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (values: FormValues) => addMask(axios, values),
    {
      onSuccess: () => {
        closeFn();
        queryClient.invalidateQueries(["masks"]);
      },

      onError: (data: AxiosError<APIResponse, any>) => {
        toast({
          title: "Error",
          description: data.response?.data?.message,
          status: "error",
          position: "top",
        });
        closeFn();
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };
  return (
    // isOpen state is managed outside of the component
    <Modal isOpen={true} onClose={closeFn}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create mask</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    {...register("name", {
                      pattern: new RegExp(
                        "^(?=[a-zA-Z0-9._]{3,24}$)(?!.*[_.]{2})[^_.].*[^_.]$",
                      ),
                      required: true,
                    })}
                    autoFocus
                    name="name"
                  />
                  <InputRightAddon>
                    <Text>@{domain}</Text>
                  </InputRightAddon>
                </InputGroup>
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel>Domain</FormLabel>
              <Select
                ref={domainRef}
                onChange={(e) => setDomain(e.target.value)}
              >
                {domainsQuery.data?.map((domain) => (
                  <option key={domain.domain} value={domain.domain}>
                    {domain.domain}
                  </option>
                ))}
                );
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Select ref={emailRef}>
                {emailQuery.data
                  ?.filter((email) => email.is_verified)
                  .map((email) => {
                    return (
                      <option key={email.email} value={email.email}>
                        {email.email}
                      </option>
                    );
                  })}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={isSubmitting}
              onClick={() => {
                setValue("domain", domainRef!.current!.value);
                setValue("email", emailRef!.current!.value);
              }}
            >
              Add
            </Button>
            <Button onClick={closeFn}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
