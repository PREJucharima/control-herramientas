import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({
  open,
  message,
  severity,
  onClose,
  position = { vertical: "bottom", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert onClose={onClose} severity={severity} variant="outlined">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
