import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

export const ConfirmationDialog = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  isLoading = false,
  confirmColor = "primary",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle fontWeight={700}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, marginTop: 2.75 }}>
        <Button color="secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
