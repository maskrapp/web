import { NextPage } from "next";
import { useRouter } from "next/router";
import { Signin } from "../../components/auth/Signin";
import { useUser } from "../../context/UserContext";

const SignInPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  if (isAuthenticated) {
    router.push("/app");
    return null;
  }
  return (
    <>
      <Signin />
    </>
  );
};

export default SignInPage;
