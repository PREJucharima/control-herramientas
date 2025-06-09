import { useEffect, useState } from "react";
import { useAuthStore } from "../states/authStore";

export const useCheckAuth = () => {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    restoreSession();
    setStatus(isAuthenticated ? "authenticated" : "not-authenticated");
  }, [isAuthenticated]);

  return { status };
};
