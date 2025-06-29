import { useNavigate } from "react-router";
import { useAuthStore } from "@/auth/states/authStore";
import { googleLogout } from "@react-oauth/google";

export const useAuth = () => {
  const store = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    store.logout();
    navigate("/auth/login");
  };

  return {
    ...store,
    handleLogout,
  };
};
