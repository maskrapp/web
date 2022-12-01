import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useAxios } from "../../../hooks/useAxios";
import { APIResponse, Domain, Email } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";

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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const emailRef = useRef<HTMLSelectElement>(null);
  const domainRef = useRef<HTMLSelectElement>(null);

  const axios = useAxios();

  const emailQuery = useQuery(["emails"], async () => {
    const response = await axios.post<Email[]>("/api/user/emails");
    return response.data ?? [];
  });

  const domainsQuery = useQuery(["domains"], async () => {
    const response = await axios.get<Domain[]>("/api/user/domains");
    return response.data ?? [];
  });

  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (values: FormValues) => {
      return axios.post(`${BACKEND_URL}/api/user/add-mask`, values);
    },
    {
      onSuccess: () => {
        toast({
          title: "Created mask",
          status: "success",
          position: "top",
        });
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
    }
  );

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };
  const name = watch("name");
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
              <Input
                type="text"
                {...register("name", {
                  pattern: new RegExp(
                    "^(?=[a-zA-Z0-9._]{3,24}$)(?!.*[_.]{2})[^_.].*[^_.]$"
                  ),
                  required: true,
                })}
                autoFocus
                name="name"
              />
              {!errors.name && !!name && (
                <FormHelperText>
                  {"Your masked email adres will be: " +
                    name.toLowerCase() +
                    "@" +
                    domainRef.current!.value}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Domain</FormLabel>
              <Select ref={domainRef}>
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
                  .map((email, index) => {
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
