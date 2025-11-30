import { memo } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
  Stack,
  Chip,
  alpha,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark"; // etiqueta “Catálogo”
import VisibilityIcon from "@mui/icons-material/Visibility"; // ver
import EditIcon from "@mui/icons-material/Edit"; // editar
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded"; // icono principal

const CatalogCard = ({ maestro, onOpenItems, onView, onEdit }) => {
  const slug = maestro?.codigo_unico;
  const activo = !!maestro?.esta_activo;

  return (
    <Card
      elevation={0}
      sx={(t) => ({
        height: "100%",
        borderRadius: 3,
        border: `1px solid ${t.palette.divider}`,
        background:
          t.palette.mode === "dark"
            ? t.palette.background.paper
            : t.palette.common.white,
        boxShadow: t.shadows[1],
        transition: "transform .15s ease, box-shadow .15s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: t.shadows[6] },
        "&:focus-within": {
          outline: `2px solid ${t.palette.primary.main}`,
          outlineOffset: 2,
        },
      })}
    >
      <CardActionArea
        onClick={() => onOpenItems?.(slug)}
        aria-label={`Abrir ítems del catálogo ${maestro?.nombre ?? ""}`}
        sx={{ height: "100%" }}
      >
        <CardContent sx={{ p: 2.25 }}>
          <Box sx={{ position: "relative", mb: 2 }}>
            <Box
              sx={(t) => ({
                width: 28,
                height: 28,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                color: t.palette.primary.main,
                backgroundColor:
                  t.palette.mode === "dark"
                    ? t.palette.primary[900] ?? t.palette.action.selected
                    : t.palette.primary[50],
              })}
            >
              <Inventory2Rounded fontSize="small" />
            </Box>

            <Box
              sx={{
                position: "absolute",
                top: -4,
                right: -6,
                display: "flex",
                gap: 0.5,
              }}
            >
              <Chip
                size="small"
                icon={<BookmarkIcon sx={{ fontSize: 16 }} />}
                label="Catálogo"
                variant="outlined"
              />
            </Box>
          </Box>

          <Stack spacing={1.75} sx={{ mb: 6.25 }}>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              lineHeight={1.2}
              title={maestro?.nombre}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {maestro?.nombre || "Catálogo sin nombre"}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={(t) => {
                const color = activo
                  ? t.palette.success.main
                  : t.palette.error.main;
                return {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 999,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color,
                  bgcolor: alpha(color, 0.15),
                  "&::before": {
                    content: '""',
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: color,
                    boxShadow: `0 0 0 2px ${alpha(color, 0.15)}`,
                  },
                };
              }}
            >
              {activo ? "Activo" : "Inactivo"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Tooltip title="Ver catálogo">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(slug);
                  }}
                  aria-label={`Ver catálogo ${maestro?.nombre ?? ""}`}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar catálogo">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(slug);
                  }}
                  aria-label={`Editar catálogo ${maestro?.nombre ?? ""}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default memo(CatalogCard);
