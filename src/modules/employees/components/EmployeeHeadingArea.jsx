import { useLocation, useNavigate } from "react-router";

import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Stack,
  Divider,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Add,
  ArrowBack,
  Clear,
  CloudDone,
  Search,
  Sync,
  SyncProblem,
} from "@mui/icons-material";

import { FilterPill } from "@/components/Filters/FilterPill";
import FormatBullets from "@/icons/FormatBullets";
import Apps from "@/icons/Apps";

export const SearchTextField = styled(TextField)(() => ({
  maxWidth: 320,
  width: "100%",
}));

export default function EmployeesHeadingArea({
  title,
  // Tabs estado ("" | "active" | "inactive")
  value,
  onChange,
  // búsqueda
  searchValue,
  onSearchChange,
  onClearSearch,
  // sincronización ("" | "pending")
  syncStatusValue,
  onSyncStatusChange,
  // datos
  count,
  isLoading,
  error,
  // navegación
  gridRoute,
  listRoute,
  sticky = true,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const estadoText =
    value === "active"
      ? "Activos"
      : value === "inactive"
      ? "Inactivos"
      : "Todos";
  const syncText =
    syncStatusValue === "pending"
      ? "Pendientes"
      : syncStatusValue === "synced"
      ? "Sincronizados"
      : "Todos";

  const activeColor = (path) =>
    pathname === path ? "primary.main" : "text.secondary";

  const activeFilterChips = (
    <Stack direction="row" gap={1} flexWrap="wrap">
      {value === "active" && (
        <Chip
          size="small"
          color="success"
          variant="outlined"
          label="Estado: Activos"
          onDelete={() => onChange(null, "")}
        />
      )}
      {value === "inactive" && (
        <Chip
          size="small"
          color="default"
          variant="outlined"
          label="Estado: Inactivos"
          onDelete={() => onChange(null, "")}
        />
      )}
      {syncStatusValue === "pending" && (
        <Chip
          size="small"
          color="warning"
          variant="outlined"
          icon={<SyncProblem fontSize="small" />}
          label="Pendiente de sincronizar"
          onDelete={() => onSyncStatusChange({ target: { value: "" } })}
        />
      )}
      {syncStatusValue === "synced" && (
        <Chip
          size="small"
          color="info"
          variant="outlined"
          icon={<CloudDone fontSize="small" />}
          label="Sincronizado"
          onDelete={() => onSyncStatusChange({ target: { value: "" } })}
        />
      )}
      {!!searchValue && (
        <Chip
          size="small"
          variant="outlined"
          icon={<Search fontSize="small" />}
          label={`Buscar: ${searchValue}`}
          onDelete={onClearSearch}
        />
      )}
    </Stack>
  );

  return (
    <Box
      sx={{
        position: sticky ? "sticky" : "static",
        top: 0,
        zIndex: 2,
        bgcolor: "background.paper",
        pt: 1,
        pb: 2,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
      >
        <Stack direction="row" alignItems="center" gap={1.5} minWidth={0}>
          <IconButton onClick={() => navigate(-1)} aria-label="Volver">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" fontWeight={700} noWrap title={title}>
            {title}
          </Typography>
          {!isLoading && !error && (
            <Chip
              size="small"
              color="primary"
              label={`${count ?? 0} ${
                count === 1 ? "resultado" : "resultados"
              }`}
              sx={{ ml: 0.5, "& .MuiChip-label": { fontWeight: 700 } }}
            />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" gap={1.25} flexShrink={0}>
          <Tooltip title="Vista lista">
            <IconButton onClick={() => navigate(listRoute)}>
              <FormatBullets sx={{ color: activeColor(listRoute) }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Vista tarjetas">
            <IconButton onClick={() => navigate(gridRoute)}>
              <Apps sx={{ color: activeColor(gridRoute) }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"space-between"}
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={1.25}
        mt={4.25}
        mb={2.25}
      >
        <Stack direction={{ xs: "column", sm: "row" }} gap={1.25} flexGrow={1}>
          <SearchTextField
            type="search"
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Buscar por nombre, RUT o email…"
            size="small"
            fullWidth
            slotProps={{
              input: {
                "aria-label": "Buscar empleados",
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: !!searchValue && (
                  <InputAdornment position="end">
                    <Tooltip title="Limpiar (Esc)">
                      <IconButton
                        size="small"
                        onClick={onClearSearch}
                        aria-label="Limpiar búsqueda"
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack direction="row" gap={1} flexWrap="wrap">
            <FilterPill
              label={`Estado · ${estadoText}`}
              active={Boolean(value)}
              onClear={() => onChange?.(null, "")}
            >
              {(close) => (
                <FormControl fullWidth size="small">
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select
                    labelId="estado-label"
                    label="Estado"
                    value={value ?? ""}
                    onChange={(e) => {
                      onChange?.(null, e.target.value);
                      close();
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="active">Activos</MenuItem>
                    <MenuItem value="inactive">Inactivos</MenuItem>
                  </Select>
                </FormControl>
              )}
            </FilterPill>

            <FilterPill
              label={`Sincronización · ${syncText}`}
              active={Boolean(syncStatusValue)}
              onClear={() => onSyncStatusChange?.({ target: { value: "" } })}
              // chipProps={{
              //   icon:
              //     syncStatusValue === "pending" ? (
              //       <SyncProblem />
              //     ) : syncStatusValue === "synced" ? (
              //       <CloudDone />
              //     ) : undefined,
              // }}
            >
              {(close) => (
                <FormControl fullWidth size="small">
                  <InputLabel id="sync-label">Sincronización</InputLabel>
                  <Select
                    labelId="sync-label"
                    label="Sincronización"
                    value={syncStatusValue || ""}
                    onChange={(e) => {
                      onSyncStatusChange?.(e);
                      close();
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="pending">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Sync fontSize="small" /> Pendientes
                      </Stack>
                    </MenuItem>
                    <MenuItem value="synced">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <CloudDone fontSize="small" /> Sincronizados
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </FilterPill>
          </Stack>
        </Stack>
        <Box sx={{ ml: { md: 2 } }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/catalogos/empleados/nuevo")}
            fullWidth={false}
          >
            Nuevo empleado
          </Button>
        </Box>
      </Stack>

      {(!!searchValue || !!syncStatusValue || value) && (
        <>
          <Divider sx={{ my: 1.25 }} />
          {activeFilterChips}
        </>
      )}
    </Box>
  );
}
