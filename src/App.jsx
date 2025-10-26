import { Suspense, useEffect } from "react";

import { Box, CircularProgress } from "@mui/material";

import { useAuthStore } from "@/features/auth/states/authStore";
import { AppTheme } from "@/theme/AppTheme";
import { AppRouter } from "@/routes/AppRouter";

function FullscreenLoader() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <>
      <AppTheme>
        <Suspense fallback={<FullscreenLoader />}>
          <AppRouter />
        </Suspense>
      </AppTheme>
    </>
  );
}

export default App;
