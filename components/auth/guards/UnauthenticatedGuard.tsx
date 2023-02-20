import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

export const UnauthenticatedGuard = ({ children }: PropsWithChildren) => {
  const { isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  if (isLoading) return null;

  if (isAuthenticated) {
    router.push("/");
  }

  return <>{children}</>;
};
