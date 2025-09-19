import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { updateItemBySlug } from "../services/updateItemBySlug";
import { useFetchItemBySlug } from "../hooks/useFetchItemBySlug";
import { useFetchMaestros } from "../../maestros/hooks/useFetchMaestros";
import { useFetchItemsByMaestro } from "../hooks/useFetchItemsByMaestro";
import { useItemsStore } from "../states/itemsStore";
import { Box, CircularProgress } from "@mui/material";
import ItemForm from "../components/ItemForm";

export const EditItemPage = () => {
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

  // const dependeDeCatalogo = maestroActual?.depende_de_catalogo ?? null;
  const maestroId = maestroActual?.id ?? null;

  // Lookup para "item_padre" (id/descripcion) si hay dependencia
  const {
    itemsByMaestro: parentOptions,
    isLoading: loadingLookup,
    error: errorLookup,
  } = useFetchItemsByMaestro(maestroId);

  console.log("parentOptions in EditItemPage", parentOptions);

  // Action del store para sincronizar lista+detalle
  const updateItem = useItemsStore((s) => s.updateItem);

  const initialItem = useMemo(() => itemBySlug || null, [itemBySlug]);

  const busy = isLoading || loadingLookup;

  const handleSubmit = async (values) => {
    // payload que espera tu API (ajústalo si tu form usa otros nombres)
    const payload = {
      descripcion: values.descripcion?.trim() ?? "",
      descripcion_corta: values.descripcion_corta?.trim() ?? "",
      esta_activo: !!values.esta_activo,
      fecha_inicio_vigencia: values.fecha_inicio_vigencia || null, // ISO o null
      fecha_fin_vigencia: values.fecha_fin_vigencia || null, // ISO o null
      item_padre:
        values.item_padre === "" || values.item_padre == null
          ? null
          : Number(values.item_padre),
    };

    try {
      const updated = await updateItemBySlug(codigo, codigo_item, payload);
      // sincroniza store por "codigo" (slug del ítem)
      updateItem(codigo_item, updated);

      navigate(`/catalogos/${encodeURIComponent(codigo)}/lista-items`);
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
      isLoadingParents={loadingLookup}
      errorParents={errorLookup}
      // info del tipo de catálogo (si tu ItemForm la necesita)
      typeCatalog={maestroActual}
      // acciones
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
};
