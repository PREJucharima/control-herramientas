import { useNavigate } from "react-router";
import { useMaestrosStore } from "../states/maestrosStore";
import { createMaestro } from "../services/createMaestro";
import AddMaestroForm from "../components/AddMaestroForm";

export const AddNewMaestroPage = () => {
  const navigate = useNavigate();
  const setMaestros = useMaestrosStore((s) => s.setMaestros);

  const handleSubmit = async (payload) => {
    try {
      const created = await createMaestro(payload);
      setMaestros((prev) => [created, ...prev]);
      navigate(`/catalogos/maestros`);
    } catch (e) {
      console.error("Error creando ítem:", e);
    }
  };

  return (
    <>
      <AddMaestroForm onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </>
  );
};
