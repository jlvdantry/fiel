import { create } from 'zustand';

// This is your global "Radio Station"
export const useFamilyFiltro = create((set) => ({
  facturasProcesadas: [], // Initial state
  
  // Action to update state
  setSharedFiltro: (newText) => set({ facturasProcesadas: newText }),
  
  // Action to clear state
  resetText: () => set({ facturasProcesadas: [] })
}));
