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
import { useEmpresaSucursalStore } from "@/states/empresaSucursalStore";
import { useSnackbar } from "@/hooks/useSnackbar";
import { CustomSnackbar } from "@/components/custom-snackbar";

export const EmpresaSucursalPage = () => {
  const { user } = useAuth();
  const alcances = useMemo(() => user.alcancesAccesibles || [], [user]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const { empresa, sucursal, setEmpresa, setSucursal } =
    useEmpresaSucursalStore();
  const { snackbar, showSnackbar, handleClose } = useSnackbar();

  const isOnlyOne = alcances.length === 1;

  // Setear valores cuando entra a la página
  useEffect(() => {
    if (alcances.length === 0) return;

    // Si solo hay uno: seleccionar y guardar automáticamente
    if (isOnlyOne) {
      const únicaEmpresa = alcances[0].empresa_nombre;
      const únicaSucursal = alcances[0].sucursal_nombre;
      setEmpresaSeleccionada(únicaEmpresa);
      setSucursalSeleccionada(únicaSucursal);
      setEmpresa(únicaEmpresa);
      setSucursal(únicaSucursal);
    } else {
      // Si hay más: cargar lo del store o usar el primero como por defecto
      setEmpresaSeleccionada(empresa || alcances[0].empresa_nombre);
      setSucursalSeleccionada(sucursal || alcances[0].sucursal_nombre);
    }
  }, [alcances, isOnlyOne, empresa, sucursal, setEmpresa, setSucursal]);

  const handleChangeEmpresa = (event) => {
    const nuevaEmpresa = event.target.value;
    setEmpresaSeleccionada(nuevaEmpresa);

    // Filtrar las sucursales que pertenecen a la nueva empresa
    const sucursalesAsociadas = alcances
      .filter((a) => a.empresa_nombre === nuevaEmpresa)
      .map((a) => a.sucursal_nombre);

    // Si hay alguna, setear la primera como seleccionada
    setSucursalSeleccionada(sucursalesAsociadas[0] || "");
  };

  const handleChangeSucursal = (event) => {
    setSucursalSeleccionada(event.target.value);
  };

  const handleSaveEmpresaSucursal = () => {
    setEmpresa(empresaSeleccionada);
    setSucursal(sucursalSeleccionada);

    showSnackbar("Guardado exitosamente!", "success");
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
        <FormControl size="small" disabled={isOnlyOne}>
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
            {alcances
              .filter(
                (a, index, self) =>
                  index ===
                  self.findIndex((t) => t.empresa_nombre === a.empresa_nombre)
              )
              .map((a, index) => (
                <MenuItem key={index} value={a.empresa_nombre}>
                  {a.empresa_nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl size="small" disabled={isOnlyOne}>
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
            {alcances
              .filter((a) => a.empresa_nombre === empresaSeleccionada)
              .map((a, index) => (
                <MenuItem key={index} value={a.sucursal_nombre}>
                  {a.sucursal_nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          disabled={isOnlyOne}
          onClick={handleSaveEmpresaSucursal}
        >
          Guardar
        </Button>
      </Box>

      <CustomSnackbar {...snackbar} onClose={handleClose} />
    </>
  );
};
