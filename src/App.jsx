import { useEffect } from "react";
import { AppTheme } from "./config/theme/AppTheme";
import { useAuthStore } from "./modules/auth/states/authStore";
import { AppRouter } from "./routes/AppRouter";

function App() {
  const restoreSession = useAuthStore(state => state.restoreSession);
  const checkTokenExpiration = useAuthStore(state => state.checkTokenExpiration);

  useEffect(() => {
    restoreSession();

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AppTheme>
        <AppRouter />
      </AppTheme>
    </>
  )
}

export default App
