import { useNavigate } from "react-router";

import { useAuthStore } from "@/features/auth/states/authStore";
import { useCompaniesLookups } from "@/features/companies/hooks/useCompanies";
import { createEmployee } from "../services/createEmployee";
import { useEmployeesStore } from "../states/employeesStore";
import { EmployeeForm } from "../components";

const EmployeeCreatePage = () => {
  const navigate = useNavigate();
  const addEmployee = useEmployeesStore((s) => s.addEmployee);
  const user = useAuthStore((state) => state.user);
  const userCompany = user?.profile?.sucursal_principal?.empresa;
  const { companies, isLoading } = useCompaniesLookups();

  const handleSubmit = async (payload) => {
    try {
      const created = await createEmployee(payload);
      addEmployee(created);
      navigate(`/maestros/empleados`);
    } catch (e) {
      console.error("Error creando un nuevo maestro:", e);
    }
  };

  return (
    <>
      <EmployeeForm
        companies={companies}
        isLoadingCompanies={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        defaultCompany={userCompany}
      />
    </>
  );
};

export default EmployeeCreatePage;
