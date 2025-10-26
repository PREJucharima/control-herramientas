import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useCompaniesLookups } from "@/features/companies/hooks/useCompanies";
import { useCategoriesLookups } from "@/features/categories/hooks/useCategories";

import { useProductsStore } from "../states/productsStore";
import { ProductForm } from "../components";
import { getProductByCode } from "../services/getProductByCode";
import { updateProductByCode } from "../services/updateProductByCode";

const ProductEditPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();
  const updateProductInStore = useProductsStore((s) => s.updateProduct);

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

  // estado local del producto
  const [productToEdit, setProductToEdit] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setIsLoadingProduct(true);
        setLoadError(null);
        const data = await getProductByCode(codigo);
        if (on) setProductToEdit(data);
      } catch (e) {
        if (on) setLoadError(e);
        console.error("Error obteniendo producto:", e);
      } finally {
        if (on) setIsLoadingProduct(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [codigo]);

  const handleSubmit = async (payload) => {
    try {
      const updated = await updateProductByCode(codigo, payload);
      // actualiza el store si lo tienes
      updateProductInStore?.(codigo, updated);
      navigate("/catalogos/productos");
    } catch (e) {
      console.error("Error actualizando producto:", e);
    }
  };

  if (isLoadingProduct) return <div>Cargando producto…</div>;
  if (loadError) return <div>No se pudo cargar el producto.</div>;
  if (!productToEdit) return <div>Producto no encontrado.</div>;

  return (
    <ProductForm
      initialProduct={productToEdit}
      companies={companies}
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

export default ProductEditPage;
