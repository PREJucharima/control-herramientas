import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import { Alert, Box, CircularProgress } from "@mui/material";

import { MaestroForm } from "../components";
import { useFetchMaestroBySlug } from "../hooks/useFetchMaestroBySlug";
import { updateMaestroBySlug } from "../services/updateMaestroBySlug";
import { useMaestrosStore } from "../states/maestrosStore";

const EditMasterPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();
  const { maestroBySlug, isLoading, error } = useFetchMaestroBySlug(codigo);
  const updateMaestro = useMaestrosStore((s) => s.updateMaestro);
  const initialMaestro = useMemo(() => maestroBySlug || null, [maestroBySlug]);

  const handleSubmit = async (payload) => {
    try {
      const updated = await updateMaestroBySlug(codigo, payload);
      updateMaestro(codigo, updated);

      navigate("/catalogos/maestros");
    } catch (e) {
      console.error("Error actualizando maestro:", e);
    }
  };

  if (isLoading) {
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
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
};

export default EditMasterPage;
