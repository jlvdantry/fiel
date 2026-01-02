import { create } from 'zustand';

// This is your global "Radio Station"
export const useFamilyFiltro = create((set) => ({
  facturasProcesadas: [], // Initial state
  totalIngreso: 0,
  totalEgreso: 0,
  
  // Action to update state
  setSharedFiltro: (newText) => set({ facturasProcesadas: newText }),
  setTotals: (ingreso, egreso) => set({ totalIngreso: ingreso, totalEgreso: egreso }),
  
  // Action to clear state
  resetText: () => set({ facturasProcesadas: [] })
}));
