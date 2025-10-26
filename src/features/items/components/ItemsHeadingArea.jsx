import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TabContext, TabList } from "@mui/lab";
import { Chip, IconButton, styled, Tab, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

import Apps from "@/icons/Apps";
import FormatBullets from "@/icons/FormatBullets";
import { FlexBetween, FlexBox } from "@/components/ui/flexbox";

const TabListWrapper = styled(TabList)({ borderBottom: 0 });

const ActionButtons = styled("div")(({ theme }) => ({
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: theme.palette.grey[50],
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
}));

export default function ItemsHeadingArea({
  value,
  title,
  onChange,
  isloading,
  error,
  count,
  gridRoute,
  listRoute,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeColor = (path) =>
    pathname === path ? "primary.main" : "grey.400";

  return (
    <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center" gap={1.5}>
        <IconButton
          onClick={() => navigate("/catalogos/maestros")}
          aria-label="Volver"
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h6" component="h1" fontWeight={700}>
          Ítems de {title}
        </Typography>

        {!isloading && !error && (
          <Chip
            size="small"
            color="primary"
            label={`${count} ${count === 1 ? "resultado" : "resultados"}`}
            sx={{ ml: 0.5, "& .MuiChip-label": { fontWeight: "bold" } }}
          />
        )}
      </FlexBox>
      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={onChange}>
          <Tab disableRipple label="Todos" value="" />
          <Tab disableRipple label="Activos" value="active" />
          <Tab disableRipple label="Inactivos" value="inactive" />
        </TabListWrapper>
      </TabContext>

      <ActionButtons className="actions">
        <IconButton disableRipple onClick={() => navigate(listRoute)}>
          <FormatBullets
            sx={{
              color: activeColor(listRoute),
            }}
          />
        </IconButton>

        <IconButton disableRipple onClick={() => navigate(gridRoute)}>
          <Apps
            sx={{
              color: activeColor(gridRoute),
            }}
          />
        </IconButton>
      </ActionButtons>
    </FlexBetween>
  );
}
