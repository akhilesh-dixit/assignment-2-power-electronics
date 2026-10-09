import { CircuitParameters } from '../../types/circuit';

export interface SimulationResult {
  time: number[];
  vs: number[]; 
  is: number[]; 
  vo: number[]; 
  io: number[]; 
  vg?: number[]; 
  vsA?: number[];
  vsB?: number[];
  vsC?: number[];
}

const STEPS_PER_CYCLE = 2000;
const NUM_CYCLES = 2;

export function runSimulation(circuitId: string, params: CircuitParameters): SimulationResult | null {
  const { voltageRMS, frequency, resistance, inductance, backEMF = 0, firingAngle = 0 } = params;
  const Vm = voltageRMS * Math.SQRT2;
  const omega = 2 * Math.PI * frequency;
  const period = 1 / frequency;
  const timeStep = period / STEPS_PER_CYCLE;
  const alphaRad = (firingAngle * Math.PI) / 180;
  
  const res: SimulationResult = { time: [], vs: [], is: [], vo: [], io: [], vg: [], vsA: [], vsB: [], vsC: [] };
  const duration = NUM_CYCLES * period;
  let currentI = 0;

  // State variables for controlled circuits
  let conductingPos = false;
  let conductingNeg = false;
  let lastPhase = -1;

  for (let t = 0; t <= duration; t += timeStep) {
    const wt = omega * t;
    const wtMod = wt % (2 * Math.PI);
    
    // 1-Phase Signals
    const vs_t = Vm * Math.sin(wt);
    
    // 3-Phase Signals
    const vA = Vm * Math.sin(wt);
    const vB = Vm * Math.sin(wt - 2 * Math.PI / 3);
    const vC = Vm * Math.sin(wt + 2 * Math.PI / 3);

    let vo_t = 0;
    let is_t = 0;
    let gateSignal = 0;

    // --- CIRCUIT LOGIC ---
    if (circuitId.startsWith('1ph-hw')) {
      const isControlled = circuitId.includes('thyristor');
      if (isControlled) {
        gateSignal = (wtMod >= alphaRad && wtMod <= alphaRad + 0.2) ? 1 : 0;
        if (!conductingPos && vs_t > backEMF && wtMod >= alphaRad && wtMod < Math.PI) conductingPos = true;
      } else {
        if (!conductingPos && vs_t > backEMF) conductingPos = true;
      }

      let activeV = conductingPos ? vs_t : 0;
      
      if (inductance > 0) {
        if (conductingPos) {
          currentI += ((activeV - currentI * resistance - backEMF) / (inductance * 1e-3)) * timeStep;
          if (currentI <= 0) { currentI = 0; conductingPos = false; }
          vo_t = conductingPos ? activeV : backEMF;
        } else { vo_t = backEMF; }
      } else {
        if (conductingPos && activeV > backEMF) {
          currentI = (activeV - backEMF) / resistance; vo_t = activeV;
        } else { currentI = 0; conductingPos = false; vo_t = backEMF; }
      }
      is_t = currentI;

    } else if (circuitId.startsWith('1ph-dbr') || circuitId.startsWith('1ph-fw-diode')) {
      // 1-Phase Diode Bridge
      const absVs = Math.abs(vs_t);
      if (inductance > 0) {
        if (currentI > 0 || absVs > backEMF) {
          currentI += ((absVs - currentI * resistance - backEMF) / (inductance * 1e-3)) * timeStep;
          if (currentI < 0) currentI = 0;
          vo_t = currentI > 0 ? absVs : backEMF;
        } else { vo_t = backEMF; }
      } else {
        currentI = absVs > backEMF ? (absVs - backEMF) / resistance : 0;
        vo_t = currentI > 0 ? absVs : backEMF;
      }
      is_t = vs_t >= 0 ? currentI : -currentI;

    } else if (circuitId.startsWith('1ph-fc') || circuitId.startsWith('1ph-fw-thyristor') || circuitId.startsWith('1ph-hc')) {
      const isSemi = circuitId.includes('hc');
      
      let gatePos = (wtMod >= alphaRad && wtMod <= alphaRad + 0.2) ? 1 : 0;
      let gateNeg = (wtMod >= Math.PI + alphaRad && wtMod <= Math.PI + alphaRad + 0.2) ? 1 : 0;
      gateSignal = gatePos || gateNeg;

      if (wtMod >= alphaRad && wtMod < Math.PI + alphaRad && vs_t > backEMF) {
        if (gatePos && !conductingNeg) conductingPos = true;
      }
      if ((wtMod >= Math.PI + alphaRad || wtMod < alphaRad) && -vs_t > backEMF) {
        if ((gateNeg || wtMod < alphaRad && currentI > 0) && !conductingPos) conductingNeg = true; 
      }

      let activeV = conductingPos ? vs_t : (conductingNeg ? -vs_t : 0);
      
      // Semi-controlled freewheels at 0V
      if (isSemi && activeV < 0 && currentI > 0) {
        activeV = 0; // Freewheeling through diode and thyristor
      }

      if (inductance > 0) {
        if (conductingPos || conductingNeg || (isSemi && currentI > 0)) {
          currentI += ((activeV - currentI * resistance - backEMF) / (inductance * 1e-3)) * timeStep;
          if (currentI <= 0) {
            currentI = 0; conductingPos = false; conductingNeg = false;
          }
          vo_t = (currentI > 0) ? activeV : backEMF;
        } else { vo_t = backEMF; }
      } else {
        if ((conductingPos || conductingNeg) && activeV > backEMF) {
          currentI = (activeV - backEMF) / resistance; vo_t = activeV;
        } else {
          currentI = 0; conductingPos = false; conductingNeg = false; vo_t = backEMF;
        }
      }
      
      if (isSemi && activeV === 0) is_t = 0; // Source current is 0 during freewheeling
      else is_t = conductingPos ? currentI : (conductingNeg ? -currentI : 0);

    } else if (circuitId.startsWith('3ph-hw')) {
      // 3-Phase Half-Wave (3-pulse)
      const isControlled = circuitId.includes('thyristor');
      
      // Crossing points are pi/6 (30), 5pi/6 (150), 3pi/2 (270)
      let activeV = 0;
      if (!isControlled) {
        activeV = Math.max(vA, vB, vC);
      } else {
        // Very simplified envelope generator for 3-pulse controlled
        // We find the phase that should be conducting based on delayed firing
        let offset = wtMod - Math.PI/6 - alphaRad;
        if (offset < 0) offset += 2*Math.PI;
        
        let phaseIndex = Math.floor((offset) / (2*Math.PI/3));
        if (phaseIndex === 0) activeV = vA;
        else if (phaseIndex === 1) activeV = vB;
        else activeV = vC;
        
        gateSignal = ((offset % (2*Math.PI/3)) < 0.2) ? 1 : 0;
        
        // Check if device turns off due to negative voltage
        if (activeV < 0 && inductance === 0) activeV = 0;
      }

      if (inductance > 0) {
        if (currentI > 0 || activeV > backEMF) {
          currentI += ((activeV - currentI * resistance - backEMF) / (inductance * 1e-3)) * timeStep;
          if (currentI < 0) currentI = 0;
          vo_t = currentI > 0 ? activeV : backEMF;
        } else { vo_t = backEMF; }
      } else {
        currentI = activeV > backEMF ? (activeV - backEMF) / resistance : 0;
        vo_t = currentI > 0 ? activeV : backEMF;
      }
      is_t = (activeV === vA && currentI > 0) ? currentI : 0;

    } else if (circuitId.startsWith('3ph')) {
      // 3-Phase Bridge (6-pulse)
      const isControlled = circuitId.includes('fc');
      const isSemi = circuitId.includes('hc');

      let activeV = 0;
      const vMax = Math.max(vA, vB, vC);
      const vMin = Math.min(vA, vB, vC);

      if (!isControlled && !isSemi) {
        activeV = vMax - vMin;
      } else {
        // Simplified envelope for controlled 3-phase bridge
        // 6 segments per cycle. Crossing points every 60 degrees starting at pi/6 (30 deg)
        let offset = wtMod - Math.PI/6 - alphaRad;
        if (offset < 0) offset += 2*Math.PI;
        
        let segment = Math.floor(offset / (Math.PI/3));
        // Line-to-line voltages: Vab, Vac, Vbc, Vba, Vca, Vcb
        const vLL = [vA-vB, vA-vC, vB-vC, vB-vA, vC-vA, vC-vB];
        activeV = vLL[segment % 6];
        gateSignal = ((offset % (Math.PI/3)) < 0.2) ? 1 : 0;

        if (isSemi && activeV < 0) activeV = 0; // Freewheeling
      }

      if (inductance > 0) {
        if (currentI > 0 || activeV > backEMF) {
          currentI += ((activeV - currentI * resistance - backEMF) / (inductance * 1e-3)) * timeStep;
          if (currentI < 0) currentI = 0;
          vo_t = currentI > 0 ? activeV : backEMF;
        } else { vo_t = backEMF; }
      } else {
        currentI = activeV > backEMF ? (activeV - backEMF) / resistance : 0;
        vo_t = currentI > 0 ? activeV : backEMF;
      }
      
      // Phase A current approx: conducts pos when vA is highest, neg when vA is lowest
      if (vA === vMax) is_t = currentI;
      else if (vA === vMin && !isSemi) is_t = -currentI;
      else is_t = 0;
    }

    res.time.push(t);
    res.vs.push(vs_t);
    res.vo.push(vo_t);
    res.io.push(currentI);
    res.is.push(is_t);
    if (gateSignal !== undefined) res.vg!.push(gateSignal);
    
    // Store 3-phase source values even for 1-phase (they just won't be plotted)
    res.vsA!.push(vA); res.vsB!.push(vB); res.vsC!.push(vC);
  }
  return res;
}
