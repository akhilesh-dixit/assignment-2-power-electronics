import { CircuitDefinition } from '../../types/circuit';

export const circuitRegistry: CircuitDefinition[] = [
  {
    id: '1ph-hw-diode',
    name: 'Single-Phase Half-Wave Diode Rectifier',
    categories: ['HW', '1-Phase'],
    description: 'A basic half-wave rectifier using a single diode.',
    hasThyristors: false,
    phases: 1,
    defaultParams: { voltageRMS: 230, frequency: 50, resistance: 10, inductance: 0 }
  },
  {
    id: '1ph-fw-diode',
    name: 'Single-Phase Full-Wave Diode Rectifier',
    categories: ['FW', '1-Phase'],
    description: 'A full-wave rectifier using a center-tapped transformer.',
    hasThyristors: false,
    phases: 1,
    defaultParams: { voltageRMS: 230, frequency: 50, resistance: 10, inductance: 0 }
  },
  {
    id: '1ph-dbr',
    name: 'Single-Phase Diode Bridge Rectifier',
    categories: ['DBR', 'FW', '1-Phase'],
    description: 'A full-wave rectifier using four diodes in a bridge configuration.',
    hasThyristors: false,
    phases: 1,
    defaultParams: { voltageRMS: 230, frequency: 50, resistance: 10, inductance: 0 }
  },
  {
    id: '1ph-hw-thyristor',
    name: 'Single-Phase Half-Wave Controlled Rectifier',
    categories: ['TCR', 'HW', '1-Phase'],
    description: 'A half-wave rectifier using a thyristor to control output voltage.',
    hasThyristors: true,
    phases: 1,
    defaultParams: { voltageRMS: 230, frequency: 50, resistance: 10, inductance: 0, firingAngle: 60 }
  },
  {
    id: '1ph-fw-thyristor',
    name: 'Single-Phase Full-Wave Controlled Rectifier',
    categories: ['TCR', 'FW', '1-Phase'],
    description: 'A full-wave controlled rectifier with center-tapped transformer.',
    hasThyristors: true,
    phases: 1,
    defaultParams: { voltageRMS: 230, frequency: 50, resistance: 10, inductance: 0, firingAngle: 60 }
  },
  {
    id: '1ph-fc-bridge',
    name: 'Single-Phase Fully Controlled Bridge Rectifier',
    categories: ['TCR', 'FW', '1-Phase'],
    description: 'A fully controlled bridge using four thyristors.',
    hasThyristors: true,
    phases: 1,
    defaultParams: { voltageRMS: 230, frequency: 50, resistance: 10, inductance: 0, firingAngle: 60 }
  },
  {
    id: '1ph-hc-bridge',
    name: 'Single-Phase Semi-Controlled Bridge Rectifier',
    categories: ['TCR', 'FW', '1-Phase'],
    description: 'A semi-controlled bridge using two thyristors and two diodes.',
    hasThyristors: true,
    phases: 1,
    defaultParams: { voltageRMS: 230, frequency: 50, resistance: 10, inductance: 0, firingAngle: 60 }
  },
  {
    id: '3ph-hw-diode',
    name: 'Three-Phase Half-Wave Diode Rectifier',
    categories: ['HW', '3-Phase'],
    description: 'A 3-pulse rectifier using three diodes.',
    hasThyristors: false,
    phases: 3,
    defaultParams: { voltageRMS: 400, frequency: 50, resistance: 10, inductance: 0 }
  },
  {
    id: '3ph-hw-thyristor',
    name: 'Three-Phase Half-Wave Controlled Rectifier',
    categories: ['TCR', 'HW', '3-Phase'],
    description: 'A 3-pulse rectifier using three thyristors.',
    hasThyristors: true,
    phases: 3,
    defaultParams: { voltageRMS: 400, frequency: 50, resistance: 10, inductance: 0, firingAngle: 30 }
  },
  {
    id: '3ph-dbr',
    name: 'Three-Phase Diode Bridge Rectifier',
    categories: ['DBR', 'FW', '3-Phase'],
    description: 'A 6-pulse fully uncontrolled bridge.',
    hasThyristors: false,
    phases: 3,
    defaultParams: { voltageRMS: 400, frequency: 50, resistance: 10, inductance: 0 }
  },
  {
    id: '3ph-fc-bridge',
    name: 'Three-Phase Fully Controlled Bridge Rectifier',
    categories: ['TCR', 'FW', '3-Phase'],
    description: 'A 6-pulse fully controlled bridge.',
    hasThyristors: true,
    phases: 3,
    defaultParams: { voltageRMS: 400, frequency: 50, resistance: 10, inductance: 0, firingAngle: 30 }
  },
  {
    id: '3ph-hc-bridge',
    name: 'Three-Phase Semi-Controlled Bridge Rectifier',
    categories: ['TCR', 'FW', '3-Phase'],
    description: 'A 3-phase semi-controlled bridge.',
    hasThyristors: true,
    phases: 3,
    defaultParams: { voltageRMS: 400, frequency: 50, resistance: 10, inductance: 0, firingAngle: 30 }
  }
];
