import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import { Box, CircularProgress } from "@mui/material";

import { ItemForm } from "../components";
import { useFetchItemBySlug } from "../hooks/useFetchItemBySlug";
import { updateItemBySlug } from "../services/updateItemBySlug";
import { useItemsStore } from "../states/itemsStore";

const ItemEditPage = () => {
  const navigate = useNavigate();
  const { codigo, codigo_item } = useParams();
  const { itemBySlug, isLoading, error } = useFetchItemBySlug(
    codigo,
    codigo_item
  );

  // Action del store para sincronizar lista+detalle
  const updateItem = useItemsStore((s) => s.updateItem);
  const initialItem = useMemo(() => itemBySlug || null, [itemBySlug]);

  const handleSubmit = async (payload) => {
    try {
      const updated = await updateItemBySlug(codigo, codigo_item, payload);
      updateItem(codigo_item, updated);

      navigate(`/maestros/catalogos/${encodeURIComponent(codigo)}/items`);
    } catch (e) {
      console.error("Error actualizando ítem:", e);
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
        No se pudo cargar el ítem. Intenta de nuevo.
      </Alert>
    );
  }

  if (!initialItem) return null;

  return (
    <ItemForm
      codigo={codigo}
      initialItem={initialItem}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
};

export default ItemEditPage;
