import { useNavigate } from "react-router";

import { MaestroForm } from "../components";
import { createMaestro } from "../services/createMaestro";
import { useMaestrosStore } from "../states/maestrosStore";

const AddMasterPage = () => {
  const navigate = useNavigate();
  const addMaestro = useMaestrosStore((s) => s.setMaestros);

  const handleSubmit = async (payload) => {
    try {
      const created = await createMaestro(payload);
      addMaestro(created);
      navigate(`/catalogos/maestros`);
    } catch (e) {
      console.error("Error creando un nuevo maestro:", e);
    }
  };

  return (
    <>
      <MaestroForm onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </>
  );
};

export default AddMasterPage;
