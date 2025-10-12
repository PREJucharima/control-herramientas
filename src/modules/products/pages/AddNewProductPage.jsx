import { useNavigate } from "react-router";

import { useAuthStore } from "@/auth/states/authStore";
import { useCompaniesLookups } from "@/modules/companies/hooks/useCompanies";
import { useCategoriesLookups } from "@/modules/categories/hooks/useCategories";
import { useProductsStore } from "../states/productsStore";
import { createProduct } from "../services/createProduct";
import { ProductForm } from "../components";

const AddNewProductPage = () => {
  const navigate = useNavigate();
  const addProduct = useProductsStore((s) => s.addProduct);
  const user = useAuthStore((state) => state.user);
  const defaultCompany = user?.profile?.sucursal_principal?.empresa;
  const {
    companies,
    isLoading: isCompaniesLoading,
    error: companiesError,
  } = useCompaniesLookups();

  const defaultProductStatus = "DISPONIBLE";

  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategoriesLookups();

  const handleSubmit = async (payload) => {
    try {
      const created = await createProduct(payload);
      addProduct(created);
      navigate(`/catalogos/productos`);
    } catch (e) {
      console.error("Error creando un nuevo producto:", e);
    }
  };

  return (
    <ProductForm
      companies={companies}
      defaultCompany={defaultCompany}
      defaultProductStatus={defaultProductStatus}
      isLoadingCompanies={isCompaniesLoading}
      errorCompanies={companiesError}
      categories={categories}
      isLoadingCategories={isCategoriesLoading}
      errorCategories={categoriesError}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
};

export default AddNewProductPage;
