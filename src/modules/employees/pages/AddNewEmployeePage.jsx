import { useNavigate } from "react-router";

import { createEmployee } from "../services/createEmployee";
import { useEmployeesStore } from "../states/employeesStore";
import { EmployeeForm } from "../components";

const empresas = [
  { id: 1, name: "PRECISION PERU" },
  { id: 2, name: "Empresa B" },
  { id: 3, name: "Empresa C" },
];

const sucursales = [
  { id: 1, name: "LIMA" },
  { id: 2, name: "Empresa B" },
  { id: 3, name: "Empresa C" },
];

const centrosCosto = [
  { id: 1, name: "GERENCIA DE TI" },
  { id: 2, name: "Empresa B" },
  { id: 3, name: "Empresa C" },
];

const categorias = [
  { id: 1, name: "Tecnologías de la Información (TI)" },
  { id: 2, name: "Empresa B" },
  { id: 3, name: "Empresa C" },
];

const AddNewMaestroPage = () => {
  const navigate = useNavigate();
  const addEmployee = useEmployeesStore((s) => s.addEmployee);

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
        empresas={empresas}
        sucursales={sucursales}
        centrosCosto={centrosCosto}
        categorias={categorias}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </>
  );
};

export default AddNewMaestroPage;
