import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { useUser } from "../../context/UserContext";

export const AuthWrapper = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useUser();
  if (isAuthenticated) {
    return <>{children}</>;
  }
  return <ForceSignin />;
};

const ForceSignin = () => {
  const router = useRouter();
  router.push("/app/signin");
  return null;
};
