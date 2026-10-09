import React, { useEffect, useState } from 'react';
import { useCircuitStore } from '../../store/circuitStore';
import { runSimulation } from '../../simulations/solver/simulator';

interface Props {
  circuitId: string;
}

const AnalysisPanel: React.FC<Props> = ({ circuitId }) => {
  const { parameters } = useCircuitStore();
  const [results, setResults] = useState({ vAvg: 0, vRms: 0, iAvg: 0, iRms: 0 });

  useEffect(() => {
    const sim = runSimulation(circuitId, parameters);
    if (sim) {
      // Calculate averages and RMS dynamically from simulated waveforms
      let sumVo = 0, sumVo2 = 0;
      let sumIo = 0, sumIo2 = 0;
      const n = sim.time.length;
      
      for (let i = 0; i < n; i++) {
        sumVo += sim.vo[i];
        sumVo2 += sim.vo[i] * sim.vo[i];
        sumIo += sim.io[i];
        sumIo2 += sim.io[i] * sim.io[i];
      }

      setResults({
        vAvg: sumVo / n,
        vRms: Math.sqrt(sumVo2 / n),
        iAvg: sumIo / n,
        iRms: Math.sqrt(sumIo2 / n)
      });
    }
  }, [circuitId, parameters]);

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Analysis & Results</h3>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">Average Output Voltage (Vdc)</h4>
          <p className="text-2xl font-mono text-gray-900">{results.vAvg.toFixed(2)} V</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">RMS Output Voltage (Vrms)</h4>
          <p className="text-2xl font-mono text-gray-900">{results.vRms.toFixed(2)} V</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">Average Load Current (Idc)</h4>
          <p className="text-2xl font-mono text-gray-900">{results.iAvg.toFixed(2)} A</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">RMS Load Current (Irms)</h4>
          <p className="text-2xl font-mono text-gray-900">{results.iRms.toFixed(2)} A</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-6 bg-blue-50 p-3 rounded border border-blue-100">
        These values are calculated continuously via numerical integration from the simulation engine.
      </p>
    </div>
  );
};

export default AnalysisPanel;
