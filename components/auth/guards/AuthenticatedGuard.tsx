import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

export const AuthenticatedGuard = ({ children }: PropsWithChildren) => {
  const { isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  if (isLoading) return null;

  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  return <>{children}</>;
};
