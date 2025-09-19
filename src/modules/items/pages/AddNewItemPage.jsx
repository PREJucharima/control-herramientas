import { useNavigate, useParams } from "react-router";
import { createItem } from "../services/createItem";
import { useItemsStore } from "../states/itemsStore";
import { useFetchMaestros } from "../../maestros/hooks/useFetchMaestros";
import { useFetchItemsByMaestro } from "../hooks/useFetchItemsByMaestro";
import ItemForm from "../components/ItemForm";

export const AddNewItemPage = () => {
  const { codigo } = useParams();
  const { maestros } = useFetchMaestros();
  const addItem = useItemsStore((s) => s.addItem);
  const navigate = useNavigate();

  const maestroActual = maestros?.find((m) => m.codigo_unico === codigo);
  const dependeDeCatalogo = maestroActual?.depende_de_catalogo;

  const maestroId = maestroActual?.id;

  const { itemsByMaestro, isLoading, error } =
    useFetchItemsByMaestro(maestroId);

  console.log("itemsByMaestro in AddNewItemPage", itemsByMaestro);
  console.log("isLoading in AddNewItemPage", isLoading);
  console.log("error in AddNewItemPage", error);

  console.log("maestroActual in AddNewItemPage", maestroActual);
  console.log("dependeDeCatalogo in AddNewItemPage", dependeDeCatalogo);

  const handleSubmit = async (payload) => {
    try {
      const created = await createItem(codigo, payload);
      addItem(created);
      navigate(`/catalogos/${encodeURIComponent(codigo)}/lista-items`);
    } catch (e) {
      console.error("Error creando ítem:", e);
    }
  };

  return (
    <>
      <ItemForm
        itemsByMaestro={itemsByMaestro}
        isLoadingItemsByMaestro={isLoading}
        errorItemsByMaestro={error}
        typeCatalog={maestroActual}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </>
  );
};
