import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import { Alert, Box, CircularProgress } from "@mui/material";

import { MaestroForm } from "../components";
import { useFetchMaestroBySlug } from "../hooks/useFetchMaestroBySlug";
import { useFetchMaestrosLookup } from "../hooks/useFetchMaestrosLookup";
import { updateMaestroBySlug } from "../services/updateMaestroBySlug";
import { useMaestrosStore } from "../states/maestrosStore";

const EditMasterPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();

  const { maestroBySlug, loading, error } = useFetchMaestroBySlug(codigo);
  const { maestrosLookup, loading: loadingLookup } = useFetchMaestrosLookup();

  const updateMaestro = useMaestrosStore((s) => s.updateMaestro);

  const isBusy = loading || loadingLookup;

  const initialMaestro = useMemo(() => maestroBySlug || null, [maestroBySlug]);

  const handleSubmit = async (values) => {
    const payload = {
      nombre: values.nombre?.trim(),
      codigo_unico: initialMaestro?.codigo_unico,
      usa_descripcion_corta: !!values.usa_descripcion_corta,
      usa_fechas_vigencia: !!values.usa_fechas_vigencia,
      esta_activo: !!values.esta_activo,
      empresa: initialMaestro?.empresa,
      depende_de_maestro:
        values.depende_de_maestro === "" || values.depende_de_maestro == null
          ? null
          : Number(values.depende_de_maestro),
    };

    try {
      const updated = await updateMaestroBySlug(codigo, payload);
      updateMaestro(codigo, updated);

      navigate("/catalogos/maestros");
    } catch (e) {
      console.error("Error actualizando maestro:", e);
    }
  };

  if (isBusy) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar el maestro. Intenta nuevamente.
      </Alert>
    );
  }

  if (!initialMaestro) return null;

  return (
    <MaestroForm
      initialMaestro={initialMaestro}
      maestros={maestrosLookup || []}
      isLoadingMaestros={loadingLookup}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
};

export default EditMasterPage;
