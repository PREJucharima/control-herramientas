import { useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth/states/authStore";

export const useAuth = () => {
  const store = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    store.logout();
    navigate("/auth/login");
  };

  return {
    ...store,
    handleLogout,
  };
};
