import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

export const AuthWrapper = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isAuthenticated } = useUser();

  if (mounted) {
    if (isAuthenticated) {
      return <>{children}</>;
    }

    return <ForceSignin />;
  }
  return null;
};

const ForceSignin = () => {
  const router = useRouter();
  router.push("/signin");
  return null;
};
