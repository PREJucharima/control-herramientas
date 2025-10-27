import { Navigate } from "react-router";

import { Box, Button, Container } from "@mui/material";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/states/authStore";
import Add from "../../../icons/Add";
import Apps from "../../../icons/Apps";
import Birthday from "../../../icons/Birthday";
import BlankCheckBoxIcon from "../../../icons/BlankCheckBoxIcon";
import Bratislava from "../../../icons/Bratislava";
import BriefcaseOutlined from "../../../icons/BriefcaseOutlined";
import Call from "../../../icons/Call";
import Car from "../../../icons/Car";
import ChartBar4 from "../../../icons/ChartBar4";
import ChartIcon from "../../../icons/ChartIcon";
import ChartPie from "../../../icons/ChartPieIcon";
import Chat from "../../../icons/Chat";
import CheckBoxIcon from "../../../icons/CheckBoxIcon";
import CheckboxIndeterminateIcon from "../../../icons/CheckboxIndeterminateIcon";
import CheckCircleOutline from "../../../icons/CheckCircleOutline";
import CheckmarkCircle from "../../../icons/CheckmarkCircle";
import CheckMarkCircleOutlined from "../../../icons/CheckMarkCircleOutlined";
import ChevronDown from "../../../icons/ChevronDown";
import ChevronLeft from "../../../icons/ChevronLeft";
import ChevronRight from "../../../icons/ChevronRight";
import CircleOutlined from "../../../icons/CircleOutlined";
import City from "../../../icons/City";
import Clear from "../../../icons/Clear";
import CloudIcon from "../../../icons/CloudIcon";
import Copy from "../../../icons/Copy";
import CrownIcon from "../../../icons/CrownIcon";
import Database from "../../../icons/Database";
import DateRange from "../../../icons/DateRange";
import Delete from "../../../icons/Delete";
import DeleteOutlined from "../../../icons/DeleteOutlined";
import DevicesApple from "../../../icons/DevicesApple";
import DollarOutlined from "../../../icons/DollarOutlined";
import DoneIcon from "../../../icons/DoneIcon";
import DownloadTo from "../../../icons/DownloadTo";
import Edit from "../../../icons/Edit";
import Education from "../../../icons/Education";

const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const { handleLogout } = useAuth();

  console.log("Usuario en HomePage:", user);

  if (!user) return <Navigate to="/auth/login" />;
  return (
    <Container>
      <h1>
        Bienvenido {user.first_name} {user.last_name}
      </h1>

      <Box sx={{ mt: 2, mb: 2 }}>
        <Add />
        <Apps />
        <Birthday />
        <BlankCheckBoxIcon />
        <Bratislava />
        <BriefcaseOutlined />
        <Call />
        <Car />
        <ChartBar4 />
        <ChartIcon />
        <ChartPie />
        <Chat />
        <CheckBoxIcon />
        <CheckboxIndeterminateIcon />
        <CheckCircleOutline />
        <CheckmarkCircle />
        <CheckMarkCircleOutlined />
        <ChevronDown />
        <ChevronLeft />
        <ChevronRight />
        <CircleOutlined />
        <City />
        <Clear />
        <CloudIcon />
        <Copy />
        <CrownIcon />
        <Database />
        <DateRange />
        <Delete />
        <DeleteOutlined />
        <DevicesApple />
        <DollarOutlined />
        <DoneIcon />
        <DownloadTo />
        <Edit />
        <Education  />
      </Box>

      <Button variant="contained" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Container>
  );
};

export default HomePage;
