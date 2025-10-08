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
import { Add, ArrowBack, Clear, Search } from "@mui/icons-material";

import { FilterPill } from "@/components/Filters/FilterPill";
import FormatBullets from "@/icons/FormatBullets";
import Apps from "@/icons/Apps";
import ActionsMenu from "./ActionsMenu";

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
            placeholder="Buscar por código, descripción…"
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
          </Stack>
        </Stack>
        <Box sx={{ ml: { md: 2 } }}>
          <ActionsMenu
            onAdd={() => navigate("/catalogos/productos/nuevo")}
            onBulk={() => navigate("/catalogos/productos/carga-masiva")}
          />
        </Box>
      </Stack>

      {(!!searchValue || value) && (
        <>
          <Divider sx={{ my: 1.25 }} />
          {activeFilterChips}
        </>
      )}
    </Box>
  );
}
