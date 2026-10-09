import React, { useState } from 'react';
import { useCircuitStore } from '../../store/circuitStore';
import { circuitRegistry } from '../../simulations/models/registry';
import WaveformViewer from '../waveform/WaveformViewer';
import CircuitSchematic from '../circuit/CircuitSchematic';
import ParametersPanel from '../controls/ParametersPanel';
import AnalysisPanel from '../results/AnalysisPanel';
import TheoryPanel from '../theory/TheoryPanel';

type TabType = 'overview' | 'schematic' | 'waveforms' | 'analysis' | 'theory' | 'split';

const MainWorkspace: React.FC = () => {
  const { activeCircuitId } = useCircuitStore();
  const [activeTab, setActiveTab] = useState<TabType>('schematic');

  const circuit = circuitRegistry.find(c => c.id === activeCircuitId);
  if (!circuit) return null;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'schematic', label: 'Schematic' },
    { id: 'waveforms', label: 'Waveforms' },
    { id: 'analysis', label: 'Analysis & Results' },
    { id: 'theory', label: 'Theory' },
    { id: 'split', label: 'Split Screen (Sch + Wave)' },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200 px-4 pt-2 gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {activeTab === 'overview' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold">{circuit.name}</h2>
              <p className="text-lg text-gray-700">{circuit.description}</p>
              {/* Add more overview details here */}
            </div>
          )}
          {activeTab === 'schematic' && <CircuitSchematic circuitId={circuit.id} />}
          {activeTab === 'waveforms' && <WaveformViewer circuitId={circuit.id} />}
          {activeTab === 'analysis' && <AnalysisPanel circuitId={circuit.id} />}
          {activeTab === 'theory' && <TheoryPanel circuitId={circuit.id} />}
          {activeTab === 'split' && (
            <div className="flex flex-col lg:flex-row h-full gap-4">
              <div className="flex-1 lg:w-1/2 min-h-[300px]">
                <CircuitSchematic circuitId={circuit.id} />
              </div>
              <div className="flex-1 lg:w-1/2 min-h-[300px]">
                <WaveformViewer circuitId={circuit.id} />
              </div>
            </div>
          )}
        </div>
        
        {/* Right Sidebar for Controls */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-6">
          <ParametersPanel circuit={circuit} />
        </div>
      </div>
    </div>
  );
};

export default MainWorkspace;
