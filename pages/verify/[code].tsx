import { Center, Heading, Spinner } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils/constants";

const VerifyPage: NextPage = () => {
  //TODO: make this look nicer
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (mounted) {
    let { code } = router.query;
    if (!!code) {
      if (code instanceof Array) code = code[0];
      return <Verify code={code} />;
    }
  }
  return null;
};

interface Props {
  code: string;
}
export const Verify = ({ code }: Props) => {
  const makeVerifyRequest = async (code: string) => {
    return axios.post(`${BACKEND_URL}/api/email/verify`, { code });
  };

  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState(0);

  useEffect(() => {
    const setup = async () => {
      try {
        const result = await makeVerifyRequest(code);
        setStatusCode(result.status);
      } catch (e) {
        if (e instanceof AxiosError) {
          setStatusCode(e.response?.status ?? 0);
        }
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, []);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Center>
      {statusCode === 200 ? (
        <Heading color="green">Success</Heading>
      ) : (
        <Heading color="red">That link does not exist!</Heading>
      )}
    </Center>
  );
};

export default VerifyPage;
