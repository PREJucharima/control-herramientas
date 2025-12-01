import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

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

import { FlexBox } from "@/components/ui/flexbox";
import { CatalogCard, MaestroQuickViewDialog } from "../components";
import { useFetchMaestros } from "../hooks/useFetchMaestros";

const MastersListPage = () => {
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
      String(c?.nombre || "")
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
      <FlexBox
        alignItems="center"
        gap={1.5}
        marginBottom={1}
        marginTop={1}
        flexWrap="wrap"
      >
        <ListAlt aria-hidden />
        <Typography variant="h5" component="h1" fontWeight={700}>
          Catálogos
        </Typography>
        {!isLoading && !error && (
          <Chip
            size="small"
            color="primary"
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
          startIcon={<Add />}
          onClick={() => navigate("/maestros/catalogos/nuevo")}
        >
          Agregar catálogo
        </Button>
      </FlexBox>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Explora el listado de catálogo. Usa el buscador para filtrar por nombre.
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Buscar por nombre de catálogos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            "aria-label": "Buscar catálogos",

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
          },
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
              variant="text"
              startIcon={<Refresh />}
            >
              Reintentar
            </Button>
          }
        >
          Error al cargar catálogos: {error?.message || "Intenta nuevamente."}
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          {filtered.length === 0 ? (
            <Card sx={{ borderRadius: 3, p: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  No encontramos catálogos que coincidan con tu búsqueda.
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
                  <CatalogCard
                    maestro={maestro}
                    secondary={
                      maestro?.items_count
                        ? `${maestro.items_count} ítems`
                        : undefined
                    }
                    onOpenItems={(slug) =>
                      navigate(
                        `/maestros/catalogos/${encodeURIComponent(slug)}/items`
                      )
                    }
                    onView={(slug) => openView(slug)}
                    onEdit={(slug) =>
                      navigate(
                        `/maestros/catalogos/${encodeURIComponent(slug)}/editar`
                      )
                    }
                  />
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

export default MastersListPage;
