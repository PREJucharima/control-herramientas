import { useEffect } from "react";
import { AppTheme } from "@/theme/AppTheme";
import { useAuthStore } from "@/auth/states/authStore";
import { AppRouter } from "@/routes/AppRouter";

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <>
      <AppTheme>
        <AppRouter />
      </AppTheme>
    </>
  );
}

export default App;
  