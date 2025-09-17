// modules/maestros/pages/EditMaestroPage.jsx
import { useNavigate, useParams } from "react-router";
import { useMemo } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";

import MaestroForm from "../components/MaestroForm";
import { useFetchMaestroBySlug } from "../hooks/useFetchMaestroBySlug";
import { useFetchMaestrosLookup } from "../hooks/useFetchMaestrosLookup";
import { useMaestrosStore } from "../states/maestrosStore";
import { updateMaestroBySlug } from "../services/updateMaestroBySlug";

export const EditMaestroPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();

  const { maestroBySlug, loading, error } = useFetchMaestroBySlug(codigo);

  const { maestrosLookup, loading: loadingLookup } = useFetchMaestrosLookup();

  // const maestros = useMaestrosStore((s) => s.maestros);
  const setMaestros = useMaestrosStore((s) => s.setMaestros);
  const setMaestroBySlug = useMaestrosStore((s) => s.setMaestroBySlug);

  const isBusy = loading || loadingLookup;

  const initialMaestro = useMemo(() => maestroBySlug || null, [maestroBySlug]);

  const handleSubmit = async (values) => {
    const payload = {
      nombre_catalogo: values.nombre_catalogo?.trim(),
      codigo_unico: initialMaestro?.codigo_unico,
      usa_descripcion_corta: !!values.usa_descripcion_corta,
      usa_fechas_vigencia: !!values.usa_fechas_vigencia,
      esta_activo: !!values.esta_activo,
      empresa: initialMaestro?.empresa,
      depende_de_catalogo:
        values.depende_de_catalogo === "" || values.depende_de_catalogo == null
          ? null
          : Number(values.depende_de_catalogo),
    };

    try {
      const updated = await updateMaestroBySlug(codigo, payload);

      setMaestros((prev) =>
        Array.isArray(prev)
          ? prev.map((m) =>
              m.codigo_unico === codigo ? { ...m, ...updated } : m
            )
          : prev
      );

      if (typeof setMaestroBySlug === "function") {
        setMaestroBySlug(updated);
      }

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
