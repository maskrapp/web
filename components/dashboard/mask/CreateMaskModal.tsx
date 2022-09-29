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
import { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { APIResponse, Email } from "../../../types";
import { BACKEND_URL } from "../../../utils/constants";

interface Props {
  onClose: () => void;
  supabaseClient: SupabaseClient;
}

interface FormValues {
  name: string;
  email: string;
  domain: string;
}

export const CreateMaskModal = ({ onClose, supabaseClient }: Props) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const emailRef = useRef<HTMLSelectElement>(null);
  const domainRef = useRef<HTMLSelectElement>(null);

  const emailQuery = useQuery(["emails"], async () => {
    const { data, error } = await supabaseClient
      .from<Email>("emails")
      .select("email, is_primary, is_verified");
    if (error) {
      throw error;
    }
    return data ?? [];
  });

  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (values: FormValues) => {
      const jsonStr = localStorage.getItem("supabase.auth.token");
      const data = JSON.parse(jsonStr ?? "{}");
      return axios.post(`${BACKEND_URL}/api/user/add-mask`, values, {
        headers: {
          Authorization: data.currentSession.access_token,
        },
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Created mask",
          status: "success",
          position: "top",
        });
        onClose();
        queryClient.invalidateQueries(["masks"]);
      },

      onError: (data: AxiosError<APIResponse, any>) => {
        toast({
          title: "Error",
          description: data.response?.data?.message,
          status: "error",
          position: "top",
        });
        onClose();
      },
    }
  );

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };
  const name = watch("name");
  return (
    // isOpen state is managed outside of the component
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create mask</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <FormControl isInvalid={false}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                {...register("name", {
                  pattern: new RegExp(
                    "^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$"
                  ),
                })}
                autoFocus
                name="name"
              />
              {!errors.name && !!name && (
                <FormHelperText>
                  {"Your masked email adres will be: " +
                    name +
                    "@" +
                    domainRef.current!.value}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Domain</FormLabel>
              <Select ref={domainRef}>
                return (<option value="relay.maskr.app">relay.maskr.app</option>
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
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
