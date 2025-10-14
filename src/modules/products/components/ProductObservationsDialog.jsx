// components/ProductObservationsDialog.jsx
import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  PushPin as PushPinIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useFetchProductByCode } from "../hooks/useFetchProductByCode";

// Tipos de item para referencia
// { id, user:"jucharima", text:"...", date:"2025-10-13 12:35", pinned:true }

export default function ProductObservationsDialog({
  open,
  onClose,
  productCode,
  data = [], // array de observaciones (orden DESC por fecha)
  isLoading = false,
}) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    productDetail,
    isLoading: isLoadingProduct,
    error,
  } = useFetchProductByCode(productCode);
  const p = productDetail ?? null;
  console.log({ p, isLoadingProduct, error });

  const initials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const canSend = value.trim().length > 0 && !submitting;

  const onCreate = () => {};
  const onRefresh = () => {};

  const handleSend = async () => {
    if (!canSend) return;
    try {
      setSubmitting(true);
      await onCreate?.(value.trim());
      setValue("");
    } finally {
      setSubmitting(false);
    }
  };

  const items = useMemo(() => data ?? [], [data]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 2, overflow: "hidden" },
      }}
    >
      <DialogTitle
        sx={{
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Observaciones
          {items?.length ? ` (${items.length})` : ""}
        </Typography>

        <Box flex={1} />

        <Tooltip title="Actualizar">
          <span>
            <Button
              size="small"
              variant="text"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              disabled={isLoading}
            >
              Actualizar
            </Button>
          </span>
        </Tooltip>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          bgcolor: "background.default",
        }}
      >
        {/* Caja de entrada */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Escribe una observación..."
            fullWidth
            size="small"
            multiline
            minRows={1}
            maxRows={5}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Enviar">
                    <span>
                      <IconButton
                        onClick={handleSend}
                        disabled={!canSend}
                        edge="end"
                      >
                        <SendIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Lista de observaciones */}
        <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
          {isLoading && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 3, textAlign: "center" }}
            >
              Cargando observaciones…
            </Typography>
          )}

          {!isLoading && items.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 3, textAlign: "center" }}
            >
              No hay observaciones aún.
            </Typography>
          )}

          {!isLoading && items.length > 0 && (
            <List disablePadding>
              {items.map((it) => (
                <ListItem
                  key={it.id}
                  alignItems="flex-start"
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 36, height: 36 }}>
                      {initials(it.user)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {it.user}
                        </Typography>
                        {it.pinned && (
                          <Chip
                            size="small"
                            icon={<PushPinIcon sx={{ fontSize: 16 }} />}
                            label="Fijada"
                            variant="outlined"
                          />
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: "auto" }}
                        >
                          {it.date}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", mt: 0.25 }}
                      >
                        {it.text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
