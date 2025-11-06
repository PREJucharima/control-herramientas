import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import { Box, CircularProgress } from "@mui/material";

import { ItemForm } from "../components";
import { useFetchMaestros } from "@/features/masters/hooks/useFetchMaestros";
import { useFetchItemBySlug } from "../hooks/useFetchItemBySlug";
import { useFetchItemsByMaestro } from "../hooks/useFetchItemsByMaestro";
import { updateItemBySlug } from "../services/updateItemBySlug";
import { useItemsStore } from "../states/itemsStore";

const EditItemPage = () => {
  const navigate = useNavigate();
  const { codigo, codigo_item } = useParams();

  // Detalle del ítem
  const { itemBySlug, isLoading, error } = useFetchItemBySlug(
    codigo,
    codigo_item
  );

  // Para saber si el maestro tiene dependencia (para el select "item_padre")
  const { maestros = [] } = useFetchMaestros();
  const maestroActual = useMemo(
    () => maestros.find((m) => m.codigo_unico === codigo),
    [maestros, codigo]
  );

  const dependeDeCatalogo = maestroActual?.depende_de_maestro?.id ?? null;

  // Lookup para "item_padre" (id/descripcion) si hay dependencia
  const {
    itemsByMaestro: parentOptions,
    isLoading: loadingLookup,
    error: errorLookup,
  } = useFetchItemsByMaestro(dependeDeCatalogo);

  console.log("parentOptions in EditItemPage", parentOptions);

  // Action del store para sincronizar lista+detalle
  const updateItem = useItemsStore((s) => s.updateItem);

  const initialItem = useMemo(() => itemBySlug || null, [itemBySlug]);

  const busy = isLoading || loadingLookup;

  const handleSubmit = async (payload) => {
    try {
      const updated = await updateItemBySlug(codigo, codigo_item, payload);
      updateItem(codigo_item, updated);

      navigate(`/catalogos/maestros/${encodeURIComponent(codigo)}/items`);
    } catch (e) {
      console.error("Error actualizando ítem:", e);
    }
  };

  if (busy) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        No se pudo cargar el ítem. Intenta de nuevo.
      </Alert>
    );
  }

  if (!initialItem) return null;

  return (
    <ItemForm
      // initial values
      initialItem={initialItem}
      // opciones de "item_padre" (lookup)
      itemsByMaestro={parentOptions}
      isLoadingItemsByMaestro={loadingLookup}
      errorItemsByMaestro={errorLookup}
      // info del tipo de catálogo (si tu ItemForm la necesita)
      typeCatalog={maestroActual}
      // acciones
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
};

export default EditItemPage;
