import { Suspense, useEffect } from "react";

import { AppTheme } from "@/theme/AppTheme";
import { CircularProgress } from "@mui/material";

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
        <Suspense fallback={<CircularProgress />}>
          <AppRouter />
        </Suspense>
      </AppTheme>
    </>
  );
}

export default App;
