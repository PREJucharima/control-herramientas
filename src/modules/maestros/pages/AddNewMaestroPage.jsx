import { useNavigate } from "react-router";
import { useMaestrosStore } from "../states/maestrosStore";
import { createMaestro } from "../services/createMaestro";
import { useFetchMaestros } from "../hooks/useFetchMaestros";
import { useFetchMaestrosLookup } from "../hooks/useFetchMaestrosLookup";
import MaestroForm from "../components/MaestroForm";

export const AddNewMaestroPage = () => {
  const navigate = useNavigate();
  const { isLoading } = useFetchMaestros();
  const { maestrosLookup } = useFetchMaestrosLookup();
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
        isLoadingMaestros={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </>
  );
};
