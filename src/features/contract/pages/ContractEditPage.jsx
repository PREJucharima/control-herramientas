import { useNavigate, useParams } from "react-router";

import { useAuthStore } from "../../auth/states/authStore";
import { useCompaniesLookups } from "../../companies/hooks/useCompanies";
import ContractForm from "../components/ContractForm";
import { useCategoriesLookups } from "../../categories/hooks/useCategories";
import { updateContractByCode } from "../services/contractService";
import { useFetchContractByCode } from "../hooks/useFetchContractByCode";

const ContractEditPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();

  const { contractDetail, isLoading, error } = useFetchContractByCode(codigo);

  const user = useAuthStore((state) => state.user);
  const defaultCompany = user?.profile?.sucursal_principal?.empresa;
  const {
    companies,
    isLoading: isCompaniesLoading,
    error: companiesError,
  } = useCompaniesLookups();

  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategoriesLookups();

  const handleSubmit = async (payload) => {
    try {
      console.log("Payload de actualización de contrato:", payload);
      await updateContractByCode(codigo, payload);
      navigate(`/maestros/contratos`);
    } catch (e) {
      console.error(`Error actualizando el contrato ${codigo}:`, e);
    }
  };

  if (isLoading) return <div>Cargando contrato…</div>;
  if (error) return <div>No se pudo cargar el contrato.</div>;

  return (
    <>
      <ContractForm
        initialContract={contractDetail}
        companies={companies}
        defaultCompany={defaultCompany}
        isLoadingCompanies={isCompaniesLoading}
        errorCompanies={companiesError}
        categories={categories}
        isLoadingCategories={isCategoriesLoading}
        errorCategories={categoriesError}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </>
  );
};

export default ContractEditPage;
