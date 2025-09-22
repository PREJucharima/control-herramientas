import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
  CircularProgress,
  Skeleton,
  CardActionArea,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Search,
  Refresh,
  ListAlt,
  Visibility,
  Edit,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router";
import { useFetchMaestros } from "../hooks/useFetchMaestros";
import { MaestroQuickViewDialog } from "../components/MaestroQuickViewDialog";
import Flexbox from "@/components/flexbox/FlexBox";

const MaestrosPage = () => {
  const { maestros = [], isLoading, error } = useFetchMaestros();
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const viewSlug = params.get("ver");

  const openView = (slug) => setParams({ ver: slug });
  const closeView = () => {
    params.delete("ver");
    setParams(params);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return maestros;
    return maestros.filter((c) =>
      String(c?.nombre_catalogo || "")
        .toLowerCase()
        .includes(q)
    );
  }, [maestros, query]);

  const count = filtered.length;

  const handleRetry = () => {
    navigate(0);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 3 }}>
      <Flexbox
        alignItems="center"
        gap={1.5}
        marginBottom={1}
        marginTop={1}
        flexWrap="wrap"
      >
        <ListAlt aria-hidden />
        <Typography variant="h5" component="h1" fontWeight={700}>
          Maestros
        </Typography>
        {!isLoading && !error && (
          <Chip
            size="small"
            color="primary"
            onClick={() => {}}
            label={`${count} ${count === 1 ? "resultado" : "resultados"}`}
            aria-label={`Se muestran ${count} resultados`}
            sx={{
              ml: 0.5,
              "& .MuiChip-label": {
                fontWeight: "bold",
              },
            }}
          />
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate("/catalogos/maestros/agregar-maestro")}
        >
          Agregar maestro
        </Button>
      </Flexbox>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Explora el listado de maestros. Usa el buscador para filtrar por nombre.
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Buscar por nombre de maestros..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputProps={{ "aria-label": "Buscar maestros" }}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Limpiar búsqueda"
                onClick={() => setQuery("")}
                edge="end"
                disabled={!query}
              >
                <Refresh />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {isLoading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="45%" />
                <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          ))}
          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <CircularProgress aria-label="Cargando maestros" />
          </Box>
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ borderRadius: 2, mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRetry}
              startIcon={<Refresh />}
            >
              Reintentar
            </Button>
          }
        >
          Error al cargar catálogos: {error.message || "Intenta nuevamente."}
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          {filtered.length === 0 ? (
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  No encontramos maestros
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prueba cambiando el término de búsqueda o limpia el filtro.
                </Typography>
                <Button
                  size="small"
                  sx={{ mt: 1.5 }}
                  onClick={() => setQuery("")}
                  startIcon={<Refresh />}
                >
                  Limpiar filtro
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {filtered.map((maestro) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={maestro.id}>
                  <Card
                    sx={{
                      position: "relative",
                      borderRadius: 3,
                      height: "100%",
                      transition: "transform .12s ease, box-shadow .12s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 0.5,
                        zIndex: 1,
                        "& .MuiIconButton-root": {
                          bgcolor: "background.paper",
                        },
                      }}
                    >
                      <Tooltip title="Ver maestro">
                        <IconButton
                          size="small"
                          aria-label={`Ver maestro ${maestro.nombre_catalogo}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openView(maestro.codigo_unico);
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar maestro">
                        <IconButton
                          size="small"
                          aria-label={`Editar maestro ${maestro.nombre_catalogo}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/catalogos/maestros/${encodeURIComponent(
                                maestro.codigo_unico
                              )}/editar`
                            );
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <CardActionArea
                      onClick={() =>
                        navigate(
                          `/catalogos/maestros/${encodeURIComponent(
                            maestro.codigo_unico
                          )}/items`
                        )
                      }
                      aria-label={`Abrir ítems del catálogo ${maestro?.nombre_catalogo}`}
                    >
                      <CardContent
                        sx={{
                          position: "relative",
                          pb: 4,
                          pt: 2,
                          px: 3,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          noWrap
                          title={maestro?.nombre_catalogo}
                        >
                          {maestro?.nombre_catalogo || "Catálogo sin nombre"}
                        </Typography>

                        <Chip
                          size="small"
                          sx={{ position: "absolute", bottom: 0, right: 16 }}
                          label={maestro?.esta_activo ? "Activo" : "Inactivo"}
                          color={maestro?.esta_activo ? "success" : "default"}
                          variant={
                            maestro?.esta_activo ? "outlined" : "outlined"
                          }
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {viewSlug && (
            <MaestroQuickViewDialog
              open={Boolean(viewSlug)}
              slug={viewSlug}
              onClose={closeView}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default MaestrosPage;
