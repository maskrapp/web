import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const AuthenticatedGuard = ({ children }: Props) => {
  const { isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  if (isLoading) return null;

  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  return <>{children}</>;
};
