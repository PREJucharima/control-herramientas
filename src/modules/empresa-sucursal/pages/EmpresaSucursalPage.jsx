import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/auth/hooks/useAuth";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

export const EmpresaSucursalPage = () => {
  const { user } = useAuth();
  const alcances = useMemo(() => user.alcancesAccesibles || [], [user]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");

  useEffect(() => {
    if (alcances.length > 0) {
      setEmpresaSeleccionada(alcances[0].empresa_nombre);
      setSucursalSeleccionada(alcances[0].sucursal_nombre);
    }
  }, [alcances]);

  const isDisabled = alcances.length === 1;

  const handleChangeEmpresa = (event) => {
    setEmpresaSeleccionada(event.target.value);
  };

  const handleChangeSucursal = (event) => {
    setSucursalSeleccionada(event.target.value);
  };

  return (
    <>
      <Typography variant="h1" fontSize={26} marginBottom={2}>
        Empresa y Sucursal
      </Typography>

      <Typography variant="body1" marginBottom={4}>
        Seleccione la empresa y sucursal en la que desea trabajar.
      </Typography>

      <Box display="flex" flexDirection="column" gap={4} width={250}>
        <FormControl size="small" disabled={isDisabled}>
          <InputLabel
            id="empresa-label"
            sx={{
              color: (theme) => theme.palette.text.primary,
              "&.Mui-disabled": {
                color: "black",
              },
            }}
          >
            Nombre de empresa
          </InputLabel>
          <Select
            labelId="empresa-label"
            id="empresa-select"
            value={empresaSeleccionada}
            label="Nombre de empresa"
            onChange={handleChangeEmpresa}
            sx={{
              "& .MuiSelect-select.Mui-disabled": {
                color: "gray",
                WebkitTextFillColor: "gray",
                cursor: "not-allowed",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray",
              },
              "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray",
              },
              "& .MuiSvgIcon-root": {
                color: "gray",
              },
            }}
          >
            {alcances.map((alcance, index) => (
              <MenuItem key={index} value={alcance.empresa_nombre}>
                {alcance.empresa_nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" disabled={isDisabled}>
          <InputLabel
            id="sucursal-label"
            sx={{
              color: (theme) => theme.palette.text.primary,
              "&.Mui-disabled": {
                color: "black",
              },
            }}
          >
            Nombre de sucursal
          </InputLabel>
          <Select
            labelId="sucursal-label"
            id="sucursal-select"
            value={sucursalSeleccionada}
            label="Nombre de sucursal"
            onChange={handleChangeSucursal}
            sx={{
              "& .MuiSelect-select.Mui-disabled": {
                color: "gray",
                WebkitTextFillColor: "gray",
                cursor: "not-allowed",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray",
              },
              "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                borderColor: "gray",
              },
              "& .MuiSvgIcon-root": {
                color: "gray",
              },
            }}
          >
            {alcances.map((alcance, index) => (
              <MenuItem key={index} value={alcance.sucursal_nombre}>
                {alcance.sucursal_nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          disabled={isDisabled}
          sx={{
            "&.Mui-disabled": {
              cursor: "not-allowed",
              pointerEvents: "auto",
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          Guardar
        </Button>
      </Box>
    </>
  );
};
