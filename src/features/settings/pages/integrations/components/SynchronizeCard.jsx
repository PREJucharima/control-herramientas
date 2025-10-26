import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  IconButton,
  Button,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import CloseIcon from "@mui/icons-material/Close";

function formatDate(dt) {
  try {
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(dt));
  } catch {
    return String(dt);
  }
}

export default function SynchronizeCard({
  title,
  description,
  onSync,
  onLoadLast,
  initialLast = null,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [last, setLast] = useState(initialLast);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!onLoadLast) return;
      try {
        const loaded = await onLoadLast();
        if (!cancelled && loaded) {
          setLast({
            date:
              loaded.date instanceof Date
                ? loaded.date.toISOString()
                : loaded.date,
            created: Number(loaded.created ?? 0),
            updated: Number(loaded.updated ?? 0),
          });
        }
      } catch (err) {
        console.warn("No se pudo obtener el último sync:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onLoadLast]);

  const handleSyncClick = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await onSync();
      const created = Number(res?.creados ?? res?.created ?? 0);
      const updated = Number(res?.actualizados ?? res?.updated ?? 0);

      setLast({
        date: new Date().toISOString(),
        created,
        updated,
      });
    } catch (err) {
      console.error("Error al sincronizar:", err);
      setErrorMsg(
        err?.message || "Ocurrió un error durante la sincronización."
      );
    } finally {
      setIsLoading(false);
    }
  }, [onSync]);

  const hasResult = useMemo(
    () => !!last && (last.created >= 0 || last.updated >= 0),
    [last]
  );

  return (
    <Card>
      <Typography variant="body1" fontWeight={600} sx={{ px: 3, pt: 2, pb: 1 }}>
        {title}
      </Typography>

      <Divider />

      <CardContent sx={{ px: 3, pt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {errorMsg && (
            <Alert
              severity="error"
              variant="outlined"
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={() => setErrorMsg("")}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Sincronización fallida</AlertTitle>
              {errorMsg}
            </Alert>
          )}

          {hasResult && (
            <Alert
              severity="success"
              variant="outlined"
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={() => setLast(null)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Última sincronización</AlertTitle>
              <Typography variant="caption" display="block">
                {formatDate(last.date)}
              </Typography>
              <Typography variant="caption" display="block">
                Creados: <strong>{last.created}</strong> &nbsp;|&nbsp; Pendiente
                a sincronizar: <strong>{last.updated}</strong>
              </Typography>
            </Alert>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleSyncClick}
          loading={isLoading}
          loadingPosition="start"
          startIcon={<SyncIcon />}
          variant="contained"
        >
          {isLoading ? "Sincronizando..." : "Sincronizar ahora"}
        </Button>
      </CardActions>
    </Card>
  );
}
