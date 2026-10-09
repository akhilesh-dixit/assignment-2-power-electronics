import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useCircuitStore } from '../../store/circuitStore';
import { runSimulation, SimulationResult } from '../../simulations/solver/simulator';

interface Props {
  circuitId: string;
}

const WaveformViewer: React.FC<Props> = ({ circuitId }) => {
  const { parameters } = useCircuitStore();
  const [simData, setSimData] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const result = runSimulation(circuitId, parameters);
    setSimData(result);
  }, [circuitId, parameters]);

  if (!simData) return <div className="p-4 text-center text-gray-500">Loading simulation...</div>;

  const timeMs = simData.time.map(t => t * 1000); 

  const is3Phase = simData.vsA && simData.vsB && simData.vsC;

  const voltageData: any[] = is3Phase ? [
    { x: timeMs, y: simData.vsA, type: 'scatter', mode: 'lines', name: 'Van', line: { color: 'red', width: 1, dash: 'dot' } },
    { x: timeMs, y: simData.vsB, type: 'scatter', mode: 'lines', name: 'Vbn', line: { color: 'blue', width: 1, dash: 'dot' } },
    { x: timeMs, y: simData.vsC, type: 'scatter', mode: 'lines', name: 'Vcn', line: { color: 'green', width: 1, dash: 'dot' } },
    { x: timeMs, y: simData.vo, type: 'scatter', mode: 'lines', name: 'Output (Vo)', line: { color: 'purple', width: 2 } }
  ] : [
    { x: timeMs, y: simData.vs, type: 'scatter', mode: 'lines', name: 'Source (Vs)', line: { color: 'blue' } },
    { x: timeMs, y: simData.vo, type: 'scatter', mode: 'lines', name: 'Output (Vo)', line: { color: 'red', width: 2 } }
  ];

  if (simData.vg && simData.vg.some(v => v > 0)) {
    voltageData.push({
      x: timeMs, y: simData.vg.map(v => v * (parameters.voltageRMS * 0.2)), type: 'scatter', mode: 'lines', name: 'Gate Pulses', line: { color: 'gray', width: 1 }, fill: 'tozeroy'
    });
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex-1 p-2 overflow-y-auto">
        <Plot
          data={voltageData}
          layout={{
            title: is3Phase ? '3-Phase Voltages & Output' : 'Voltages (Vs & Vo)',
            autosize: true,
            margin: { l: 50, r: 20, t: 40, b: 40 },
            xaxis: { title: 'Time (ms)' },
            yaxis: { title: 'Voltage (V)' },
            legend: { orientation: 'h', y: -0.2 }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '300px' }}
        />
        <Plot
          data={[
            {
              x: timeMs, y: simData.is, type: 'scatter', mode: 'lines', name: is3Phase ? 'Phase A Current' : 'Source Current', line: { color: 'green' }
            },
            {
              x: timeMs, y: simData.io, type: 'scatter', mode: 'lines', name: 'Output Current (Io)', line: { color: 'orange', dash: 'dash' }
            }
          ]}
          layout={{
            title: 'Currents',
            autosize: true,
            margin: { l: 50, r: 20, t: 40, b: 40 },
            xaxis: { title: 'Time (ms)' },
            yaxis: { title: 'Current (A)' },
            legend: { orientation: 'h', y: -0.2 }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '300px' }}
        />
      </div>
    </div>
  );
};

export default WaveformViewer;
