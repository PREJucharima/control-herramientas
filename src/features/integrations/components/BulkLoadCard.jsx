import { useState } from "react";
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
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverity = (res) => {
    if (res.errores && res.errores.length > 0) return "warning";
    return "success";
  };

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

        {result && (
          <Box>
            <Alert
              severity={getSeverity(result)}
              iconMapping={{
                success: <CheckCircleIcon fontSize="inherit" />,
                warning: <WarningIcon fontSize="inherit" />,
              }}
              sx={{ mb: 2 }}
            >
              <AlertTitle>{result.status || "Proceso finalizado"}</AlertTitle>
              <Box display="flex" gap={2}>
                <Typography variant="body2">
                  <strong>Nuevos creados:</strong> {result.nuevos_creados ?? 0}
                </Typography>
                {result.errores?.length > 0 && (
                  <Typography variant="body2">
                    <strong>Errores:</strong> {result.errores.length}
                  </Typography>
                )}
              </Box>
            </Alert>

            {(result.detalle?.length > 0 || result.errores?.length > 0) && (
              <Button
                size="small"
                variant="text"
                onClick={() => setShowDetails(!showDetails)}
                endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ mb: 1, textTransform: "none" }}
              >
                {showDetails
                  ? "Ocultar reporte detallado"
                  : "Ver reporte detallado"}
              </Button>
            )}

            <Collapse in={showDetails}>
              {result.errores && result.errores.length > 0 && (
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
                    {result.errores.map((err, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={err}
                          primaryTypographyProps={{
                            variant: "caption",
                            color: "error",
                            style: { fontFamily: "monospace" },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {result.detalle && result.detalle.length > 0 && (
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
                    {result.detalle.map((item, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: "caption",
                            color: "text.primary",
                            style: { fontFamily: "monospace" },
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
