import { create } from "zustand";

export const useProductsStore = create((set) => ({
  // --- STATE ---
  products: [], // lista paginada/actual de productos
  productDetail: null, // detalle de un producto

  // --- ACTIONS ---

  /** Reemplaza la lista completa de productos. */
  setProducts: (newProducts) =>
    set({ products: Array.isArray(newProducts) ? newProducts : [] }),

  /** Inserta un producto al inicio de la lista. */
  addProduct: (p) =>
    set((state) => ({ products: [p, ...(state.products || [])] })),

  /**
   * Actualiza un producto en la lista y el detalle (si coincide).
   * @param {number|string} id
   * @param {object} patch
   */
  updateProduct: (id, patch) =>
    set((state) => {
      const list = Array.isArray(state.products) ? state.products : [];
      const products = list.map((p) => (p?.id === id ? { ...p, ...patch } : p));

      const productDetail =
        state.productDetail?.id === id
          ? { ...state.productDetail, ...patch }
          : state.productDetail;

      return { products, productDetail };
    }),

  /** Elimina un producto por id de la lista (no toca el detalle). */
  removeProduct: (id) =>
    set((state) => ({
      products: (state.products || []).filter((p) => p?.id !== id),
      productDetail:
        state.productDetail?.id === id ? null : state.productDetail,
    })),

  /** Guarda/rehidrata el detalle de un producto. */
  setProductDetail: (product) => set({ productDetail: product }),

  /** Limpia todo (opcional) */
  resetProducts: () => set({ products: [], productDetail: null }),
}));
