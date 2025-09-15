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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useFetchCatalogs } from "../hooks/useFetchCatalogs";
import { useNavigate } from "react-router";

export const CatalogsPage = () => {
  const { catalogs = [], loading, error } = useFetchCatalogs();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalogs;
    return catalogs.filter((c) =>
      String(c?.nombre_catalogo || "")
        .toLowerCase()
        .includes(q)
    );
  }, [catalogs, query]);

  const count = filtered.length;

  const handleRetry = () => {
    navigate(0);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1,
          flexWrap: "wrap",
        }}
      >
        <ListAltIcon aria-hidden />
        <Typography variant="h5" component="h1" fontWeight={700}>
          Catálogos
        </Typography>
        {!loading && !error && (
          <Chip
            size="small"
            color="primary"
            onClick={() => {}}
            label={`${count} ${count === 1 ? "resultado" : "resultados"}`}
            aria-label={`Se muestran ${count} resultados`}
            sx={{
              ml: 0.5,
              "& .MuiChip-label": {
                // color: "customTeal.main",
                fontWeight: "bold",
              },
            }}
          />
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Explora el listado de catálogos. Usa el buscador para filtrar por
        nombre.
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Buscar por nombre de catálogo…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputProps={{ "aria-label": "Buscar catálogo" }}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
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
                <RefreshIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {loading && (
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
            <CircularProgress aria-label="Cargando catálogos" />
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
              startIcon={<RefreshIcon />}
            >
              Reintentar
            </Button>
          }
        >
          Error al cargar catálogos: {error.message || "Intenta nuevamente."}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  No encontramos catálogos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prueba cambiando el término de búsqueda o limpia el filtro.
                </Typography>
                <Button
                  size="small"
                  sx={{ mt: 1.5 }}
                  onClick={() => setQuery("")}
                  startIcon={<RefreshIcon />}
                >
                  Limpiar filtro
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {filtered.map((catalog) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={catalog.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      transition: "transform .12s ease, box-shadow .12s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() =>
                        navigate(
                          `/catalogos/${encodeURIComponent(
                            catalog.codigo_unico
                          )}/lista-items`
                        )
                      }
                      aria-label={`Abrir ítems del catálogo ${catalog?.nombre_catalogo}`}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          noWrap
                          title={catalog?.nombre_catalogo}
                        >
                          {catalog?.nombre_catalogo || "Catálogo sin nombre"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {catalog?.id ?? "—"}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};
