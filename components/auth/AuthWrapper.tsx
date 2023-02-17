import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { useUser } from "../../hooks/useUser";

export const AuthWrapper = ({ children }: PropsWithChildren) => {
  const { isLoading, isAuthenticated } = useUser();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }
  return <ForceSignin />;
};

const ForceSignin = () => {
  const router = useRouter();
  router.push("/signin");
  return null;
};
