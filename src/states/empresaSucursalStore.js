import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEmpresaSucursalStore = create(
  persist(
    (set) => ({
      empresa: "",
      sucursal: "",
      setEmpresa: (empresa) => set({ empresa }),
      setSucursal: (sucursal) => set({ sucursal }),
    }),
    {
      name: "empresa-sucursal-storage",
    }
  )
);
