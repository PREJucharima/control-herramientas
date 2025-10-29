import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TabContext, TabList } from "@mui/lab";
import { Chip, IconButton, styled, Tab, Typography } from "@mui/material";
import { useNavigate } from "react-router";

import { FlexBetween, FlexBox } from "@/components/ui/flexbox";

const TabListWrapper = styled(TabList)({ borderBottom: 0 });

export default function ItemsHeadingArea({
  value,
  title,
  onChange,
  isloading,
  error,
  count,
}) {
  const navigate = useNavigate();

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
    </FlexBetween>
  );
}
