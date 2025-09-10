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
  const empresasDisponibles = useMemo(() => user.acceso_empresas || [], [user]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const { empresa, sucursal, setEmpresa, setSucursal } =
    useEmpresaSucursalStore();
  const { snackbar, showSnackbar, handleClose } = useSnackbar();

  const isOnlyOne =
    empresasDisponibles.length === 1 &&
    empresasDisponibles[0]?.sucursales.length === 1;

  const sucursalesDisponibles = useMemo(() => {
    if (!empresaSeleccionada) return [];
    const empresaActual = empresasDisponibles.find(
      (e) => e.empresa.nombre === empresaSeleccionada
    );
    return empresaActual?.sucursales || [];
  }, [empresasDisponibles, empresaSeleccionada]);

  // Setear valores cuando entra a la página
  useEffect(() => {
    if (empresasDisponibles.length === 0) return;

    if (isOnlyOne) {
      const unicaEmpresa = empresasDisponibles[0].empresa.nombre;
      const unicaSucursal = empresasDisponibles[0].sucursales[0].nombre;
      setEmpresaSeleccionada(unicaEmpresa);
      setSucursalSeleccionada(unicaSucursal);
      setEmpresa(unicaEmpresa);
      setSucursal(unicaSucursal);
    } else {
      const empresaInicial =
        empresa || empresasDisponibles[0]?.empresa.nombre || "";
      setEmpresaSeleccionada(empresaInicial);
      // Si ya había una sucursal guardada y pertenece a la empresa inicial, la usamos.
      const sucursalGuardadaValida = empresasDisponibles
        .find((e) => e.empresa.nombre === empresaInicial)
        ?.sucursales.some((s) => s.nombre === sucursal);

      setSucursalSeleccionada(sucursalGuardadaValida ? sucursal : "");
    }
  }, [
    empresasDisponibles,
    isOnlyOne,
    empresa,
    sucursal,
    setEmpresa,
    setSucursal,
  ]);

  const handleChangeEmpresa = (event) => {
    const nuevaEmpresa = event.target.value;
    setEmpresaSeleccionada(nuevaEmpresa);
    setSucursalSeleccionada("");
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
          <InputLabel id="empresa-label">Nombre de empresa</InputLabel>
          <Select
            labelId="empresa-label"
            id="empresa-select"
            value={empresaSeleccionada}
            label="Nombre de empresa"
            onChange={handleChangeEmpresa}
          >
            {empresasDisponibles.map((item) => (
              <MenuItem key={item.empresa.id} value={item.empresa.nombre}>
                {item.empresa.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" disabled={isOnlyOne}>
          <InputLabel id="sucursal-label">Nombre de sucursal</InputLabel>
          <Select
            labelId="sucursal-label"
            id="sucursal-select"
            value={sucursalSeleccionada}
            label="Nombre de sucursal"
            onChange={handleChangeSucursal}
          >
            {sucursalesDisponibles.map((suc) => (
              <MenuItem key={suc.id} value={suc.nombre}>
                {suc.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          disabled={isOnlyOne || !sucursalSeleccionada}
          onClick={handleSaveEmpresaSucursal}
        >
          Guardar
        </Button>
      </Box>

      <CustomSnackbar {...snackbar} onClose={handleClose} />
    </>
  );
};
