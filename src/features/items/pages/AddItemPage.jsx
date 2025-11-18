import { useNavigate, useParams } from "react-router";

import { ItemForm } from "../components";
import { createItem } from "../services/createItem";
import { useItemsStore } from "../states/itemsStore";

const AddItemPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();

  const addItem = useItemsStore((s) => s.addItem);

  const handleSubmit = async (payload) => {
    try {
      const created = await createItem(codigo, payload);
      addItem(created);
      navigate(`/maestros/catalogos/${encodeURIComponent(codigo)}/items`);
    } catch (e) {
      console.error("Error creando ítem:", e);
    }
  };

  return (
    <>
      <ItemForm
        codigo={codigo}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </>
  );
};

export default AddItemPage;
