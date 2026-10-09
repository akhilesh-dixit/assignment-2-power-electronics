import React from 'react';
import { useCircuitStore } from '../../store/circuitStore';
import { CircuitDefinition } from '../../types/circuit';
import { RotateCcw } from 'lucide-react';

interface Props {
  circuit: CircuitDefinition;
}

const ParametersPanel: React.FC<Props> = ({ circuit }) => {
  const { parameters, updateParameter, resetParameters } = useCircuitStore();

  const handleInputChange = (key: string, value: number) => {
    updateParameter(key as any, value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Parameters</h3>
        <button 
          onClick={resetParameters}
          className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm transition-colors"
          title="Restore Defaults"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex justify-between">
            <span>RMS Voltage (V)</span>
            <span className="text-gray-500 font-mono">{parameters.voltageRMS}</span>
          </label>
          <input 
            type="range" min="10" max="1000" step="10" 
            value={parameters.voltageRMS}
            onChange={(e) => handleInputChange('voltageRMS', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex justify-between">
            <span>Frequency (Hz)</span>
            <span className="text-gray-500 font-mono">{parameters.frequency}</span>
          </label>
          <input 
            type="range" min="10" max="100" step="1" 
            value={parameters.frequency}
            onChange={(e) => handleInputChange('frequency', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {circuit.hasThyristors && parameters.firingAngle !== undefined && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex justify-between">
              <span>Firing Angle α (°)</span>
              <span className="text-gray-500 font-mono">{parameters.firingAngle}</span>
            </label>
            <input 
              type="range" min="0" max="180" step="1" 
              value={parameters.firingAngle}
              onChange={(e) => handleInputChange('firingAngle', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex justify-between">
            <span>Load Resistance (Ω)</span>
            <span className="text-gray-500 font-mono">{parameters.resistance}</span>
          </label>
          <input 
            type="range" min="1" max="100" step="1" 
            value={parameters.resistance}
            onChange={(e) => handleInputChange('resistance', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex justify-between">
            <span>Load Inductance (mH)</span>
            <span className="text-gray-500 font-mono">{parameters.inductance}</span>
          </label>
          <input 
            type="range" min="0" max="1000" step="10" 
            value={parameters.inductance}
            onChange={(e) => handleInputChange('inductance', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ParametersPanel;
