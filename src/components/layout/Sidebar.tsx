import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';
import { useCircuitStore } from '../../store/circuitStore';
import { circuitRegistry } from '../../simulations/models/registry';
import { CircuitCategory } from '../../types/circuit';
import { clsx } from 'clsx';

const categories: { id: CircuitCategory; title: string }[] = [
  { id: 'DBR', title: 'DBR — Diode Bridge Rectifier' },
  { id: 'TCR', title: 'TCR — Thyristor-Controlled Rectifier' },
  { id: 'HW', title: 'HW — Half-Wave Rectifier' },
  { id: 'FW', title: 'FW — Full-Wave Rectifier' },
  { id: '1-Phase', title: '1-Phase' },
  { id: '3-Phase', title: '3-Phase' },
];

const Sidebar: React.FC = () => {
  const { activeCircuitId, setActiveCircuit } = useCircuitStore();
  const [expandedCats, setExpandedCats] = useState<Set<CircuitCategory>>(new Set(['DBR']));

  const toggleCategory = (catId: CircuitCategory) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden shadow-sm">
      <div className="p-4 bg-blue-600 text-white flex items-center gap-2">
        <Activity className="w-6 h-6" />
        <h1 className="font-bold text-lg leading-tight">Power Electronics</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {categories.map((category) => {
          const isExpanded = expandedCats.has(category.id);
          const circuits = circuitRegistry.filter(c => c.categories.includes(category.id));
          
          if (circuits.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-2">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors text-left"
              >
                <span className="font-semibold text-gray-700 text-sm">{category.title}</span>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
              </button>
              
              {isExpanded && (
                <div className="ml-2 mt-1 space-y-1 pl-2 border-l-2 border-gray-100">
                  {circuits.map((circuit) => (
                    <button
                      key={`${category.id}-${circuit.id}`}
                      onClick={() => setActiveCircuit(circuit.id)}
                      className={clsx(
                        "w-full text-left p-2 text-sm rounded-md transition-colors",
                        activeCircuitId === circuit.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {circuit.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
