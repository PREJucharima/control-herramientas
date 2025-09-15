import AddItemForm from "@/modules/items/components/AddItemForm";
import { useNavigate, useParams } from "react-router";
import { createItem } from "../services/createItem";
import { useItemsStore } from "../states/itemsStore";

export const AddNewItemPage = () => {
  const { codigo } = useParams();
  const setItems = useItemsStore((s) => s.setItems);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      const created = await createItem(codigo, payload);
      setItems((prev) => [created, ...prev]);
      navigate(`/catalogos/${encodeURIComponent(codigo)}/items`);
    } catch (e) {
      console.error("Error creando ítem:", e);
    }
  };

  return (
    <>
      <AddItemForm onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </>
  );
};
