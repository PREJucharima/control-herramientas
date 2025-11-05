import { useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/states/authStore";
import { useProductsStore } from "../states/productsStore";
import { getProductByCode } from "../services/getProductByCode";

export const useFetchProductByCode = (code) => {
  const user = useAuthStore((state) => state.user);
  const setProductDetail = useProductsStore((s) => s.setProductDetail);
  const { productDetail } = useProductsStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProductByCode(code);
        console.log("Fetched product by code:", data);
        setProductDetail(data);
      } catch (err) {
        console.error("Error cargando empleados:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setProductDetail, code]);

  return { productDetail, isLoading, error };
};
