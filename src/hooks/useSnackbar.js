import { useState, useCallback } from "react";

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // success, error, warning, info
  });

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return { snackbar, showSnackbar, handleClose };
};
