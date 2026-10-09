import { create } from 'zustand';
import { CircuitParameters, CircuitDefinition } from '../types/circuit';
import { circuitRegistry } from '../simulations/models/registry';

interface CircuitState {
  activeCircuitId: string | null;
  parameters: CircuitParameters;
  setActiveCircuit: (id: string) => void;
  updateParameter: (key: keyof CircuitParameters, value: number) => void;
  resetParameters: () => void;
}

export const useCircuitStore = create<CircuitState>((set) => ({
  activeCircuitId: null,
  parameters: {
    voltageRMS: 230,
    frequency: 50,
    resistance: 10,
    inductance: 0,
    firingAngle: 0,
    backEMF: 0
  },
  setActiveCircuit: (id) => {
    const circuit = circuitRegistry.find(c => c.id === id);
    if (circuit) {
      set({ 
        activeCircuitId: id,
        parameters: { ...circuit.defaultParams }
      });
    }
  },
  updateParameter: (key, value) => 
    set((state) => ({
      parameters: {
        ...state.parameters,
        [key]: value
      }
    })),
  resetParameters: () => set((state) => {
    if (!state.activeCircuitId) return state;
    const circuit = circuitRegistry.find(c => c.id === state.activeCircuitId);
    return {
      parameters: circuit ? { ...circuit.defaultParams } : state.parameters
    };
  })
}));
