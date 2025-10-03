import { useNavigate } from "react-router";

import { useCentroCostos } from "@/modules/centros-costo/hooks/useCentroCostos";
import { createEmployee } from "../services/createEmployee";
import { useEmployeesStore } from "../states/employeesStore";
import { EmployeeForm } from "../components";

const AddNewMaestroPage = () => {
  const navigate = useNavigate();
  const addEmployee = useEmployeesStore((s) => s.addEmployee);
  const { centroCostosLookup, loading } = useCentroCostos();

  const handleSubmit = async (payload) => {
    try {
      const created = await createEmployee(payload);
      addEmployee(created);
      navigate(`/catalogos/empleados`);
    } catch (e) {
      console.error("Error creando un nuevo maestro:", e);
    }
  };

  return (
    <>
      <EmployeeForm
        centrosCosto={centroCostosLookup}
        loadingLookups={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </>
  );
};

export default AddNewMaestroPage;
