import { useNavigate } from "react-router";

import { MaestroForm } from "../components";
import { useFetchMaestrosLookup } from "../hooks/useFetchMaestrosLookup";
import { createMaestro } from "../services/createMaestro";
import { useMaestrosStore } from "../states/maestrosStore";

const AddNewMaestroPage = () => {
  const navigate = useNavigate();
  const { maestrosLookup, loading } = useFetchMaestrosLookup();
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

  console.log({ maestrosLookup });

  return (
    <>
      <MaestroForm
        maestros={maestrosLookup || []}
        isLoadingMaestros={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </>
  );
};

export default AddNewMaestroPage;
