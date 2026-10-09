export type CircuitCategory = 
  | 'DBR' | 'TCR' | 'HW' | 'FW' | '1-Phase' | '3-Phase';

export interface CircuitParameters {
  voltageRMS: number;
  frequency: number;
  firingAngle?: number; // for controlled rectifiers
  resistance: number;
  inductance: number;
  backEMF?: number;
}

export interface CircuitDefinition {
  id: string;
  name: string;
  categories: CircuitCategory[];
  description: string;
  hasThyristors: boolean;
  phases: 1 | 3;
  defaultParams: CircuitParameters;
}
