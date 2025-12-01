import { useNavigate } from "react-router";

import { useAuthStore } from "../../auth/states/authStore";
import { useCompaniesLookups } from "../../companies/hooks/useCompanies";
import ContractForm from "../components/ContractForm";
import { useCategoriesLookups } from "../../categories/hooks/useCategories";

const createContract = async (payload) => {
  console.log(payload);
};

const ContractCreatePage = () => {
  const navigate = useNavigate();

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
      await createContract(payload);
      navigate(`/maestros/contratos`);
    } catch (e) {
      console.error("Error creando un contrato:", e);
    }
  };

  return (
    <>
      <ContractForm
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

export default ContractCreatePage;
