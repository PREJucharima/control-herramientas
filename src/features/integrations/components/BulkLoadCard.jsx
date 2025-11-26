import { useState, useMemo } from "react";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Divider,
  Button,
  Alert,
  AlertTitle,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Collapse,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export const BulkLoadCard = ({ title, description, onProcess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleProcess = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setShowDetails(true);

    try {
      const response = await onProcess();
      setResult(response);
    } catch (err) {
      console.error("Error en el proceso:", err);
      setError(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const normalized = useMemo(() => {
    if (!result) return null;

    const creados =
      typeof result.creados === "number"
        ? result.creados
        : typeof result.nuevos_creados === "number"
        ? result.nuevos_creados
        : 0;

    const errorCount =
      typeof result.errores === "number"
        ? result.errores
        : Array.isArray(result.errores)
        ? result.errores.length
        : 0;

    const errorList = Array.isArray(result.lista_errores)
      ? result.lista_errores
      : Array.isArray(result.errores)
      ? result.errores
      : [];

    const detailList = Array.isArray(result.detalle) ? result.detalle : [];

    return {
      status: result.status || "Proceso finalizado",
      creados,
      errorCount,
      errorList,
      detailList,
    };
  }, [result]);

  const severity = normalized?.errorCount > 0 ? "warning" : "success";

  return (
    <Card>
      <Typography variant="body1" fontWeight={600} sx={{ px: 3, pt: 2, pb: 1 }}>
        {title}
      </Typography>
      <Divider />

      <CardContent sx={{ px: 3, pt: 2 }}>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {description}
        </Typography>

        {error && (
          <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />}>
            <AlertTitle>Error de ejecución</AlertTitle>
            {error}
          </Alert>
        )}

        {normalized && (
          <Box>
            <Alert
              severity={severity}
              iconMapping={{
                success: <CheckCircleIcon fontSize="inherit" />,
                warning: <WarningIcon fontSize="inherit" />,
              }}
              sx={{ mb: 2 }}
            >
              <AlertTitle>{normalized.status}</AlertTitle>

              <Box display="flex" gap={2} flexWrap="wrap">
                <Typography variant="body2">
                  <strong>Nuevos creados:</strong> {normalized.creados}
                </Typography>

                {normalized.errorCount > 0 && (
                  <Typography variant="body2">
                    <strong>Errores:</strong> {normalized.errorCount}
                  </Typography>
                )}
              </Box>
            </Alert>

            {(normalized.detailList.length > 0 ||
              normalized.errorList.length > 0) && (
              <Button
                size="small"
                variant="text"
                onClick={() => setShowDetails((s) => !s)}
                endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ mb: 1, textTransform: "none" }}
              >
                {showDetails
                  ? "Ocultar reporte detallado"
                  : "Ver reporte detallado"}
              </Button>
            )}

            <Collapse in={showDetails}>
              {normalized.errorList.length > 0 && (
                <Box
                  mb={2}
                  sx={{
                    border: "1px solid #ffcdd2",
                    borderRadius: 1,
                    bgcolor: "#ffebee",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      p: 1,
                      px: 2,
                      display: "block",
                      bgcolor: "#ef9a9a",
                      color: "#c62828",
                    }}
                  >
                    Errores encontrados:
                  </Typography>

                  <List
                    dense
                    disablePadding
                    sx={{ maxHeight: 200, overflow: "auto" }}
                  >
                    {normalized.errorList.map((msg, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={msg}
                          slotProps={{
                            primary: {
                              variant: "caption",
                              color: "text.primary",
                              sx: { fontFamily: "monospace" },
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {normalized.detailList.length > 0 && (
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    bgcolor: "#fafafa",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      p: 1,
                      px: 2,
                      display: "block",
                      bgcolor: "#eeeeee",
                      color: "text.secondary",
                    }}
                  >
                    Log de operaciones:
                  </Typography>

                  <List
                    dense
                    disablePadding
                    sx={{ maxHeight: 300, overflow: "auto" }}
                  >
                    {normalized.detailList.map((item, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={item}
                          slotProps={{
                            primary: {
                              variant: "caption",
                              color: "text.primary",
                              sx: { fontFamily: "monospace" },
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Collapse>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleProcess}
          disabled={isLoading}
          size="small"
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PlayArrowIcon />
            )
          }
        >
          {isLoading ? "Procesando..." : "Ejecutar Carga Masiva"}
        </Button>
      </CardActions>
    </Card>
  );
};
