import { useEffect } from "react";
import { AppTheme } from "@/theme/AppTheme";
import { useAuthStore } from "@/auth/states/authStore";
import { AppRouter } from "@/routes/AppRouter";
import { useAuth } from "./auth/hooks/useAuth";

function App() {
  const { user, logout } = useAuth();
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const checkTokenExpiration = useAuthStore(
    (state) => state.checkTokenExpiration
  );

  useEffect(() => {
    restoreSession();

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [restoreSession, checkTokenExpiration]);

  useEffect(() => {
    if (!user) logout(); // logout solo se llama cuando el usuario cambia a null
  }, [user, logout]);

  return (
    <>
      <AppTheme>
        <AppRouter />
      </AppTheme>
    </>
  );
}

export default App;
