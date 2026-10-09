import React from 'react';

interface Props {
  circuitId: string;
}

const CircuitSchematic: React.FC<Props> = ({ circuitId }) => {

  const Defs = () => (
    <defs>
      <g id="ac-source">
        <circle cx="0" cy="0" r="20" fill="none" stroke="black" strokeWidth="2" />
        <path d="M -12 0 Q -6 -12 0 0 T 12 0" fill="none" stroke="black" strokeWidth="2" />
      </g>
      <g id="device-d">
        <polygon points="-15,-15 15,0 -15,15" fill="black" />
        <line x1="15" y1="-15" x2="15" y2="15" stroke="black" strokeWidth="3" />
        <line x1="-25" y1="0" x2="-15" y2="0" stroke="black" strokeWidth="2" />
        <line x1="15" y1="0" x2="25" y2="0" stroke="black" strokeWidth="2" />
      </g>
      <g id="device-t">
        <polygon points="-15,-15 15,0 -15,15" fill="black" />
        <line x1="15" y1="-15" x2="15" y2="15" stroke="black" strokeWidth="3" />
        <line x1="-25" y1="0" x2="-15" y2="0" stroke="black" strokeWidth="2" />
        <line x1="15" y1="0" x2="25" y2="0" stroke="black" strokeWidth="2" />
        <path d="M 5 5 L 15 20 L 25 20" fill="none" stroke="black" strokeWidth="2" />
      </g>
      <g id="resistor">
        <path d="M 0 -25 L 0 -15 L 10 -10 L -10 0 L 10 10 L -10 20 L 0 25 L 0 35" fill="none" stroke="black" strokeWidth="2" />
      </g>
    </defs>
  );

  const renderHW = (type: 'diode' | 'thyristor', is3Ph: boolean) => (
    <svg viewBox="0 0 600 400" className="w-full max-w-3xl border border-gray-200 rounded shadow-sm bg-white">
      <Defs />
      
      {/* 1-Phase HW Wiring */}
      {!is3Ph && (
        <>
          <line x1="100" y1="200" x2="100" y2="100" stroke="black" strokeWidth="2" />
          <line x1="100" y1="100" x2="250" y2="100" stroke="black" strokeWidth="2" />
          <line x1="100" y1="300" x2="100" y2="240" stroke="black" strokeWidth="2" />
          <use href="#ac-source" x="100" y="220" />
          <text x="50" y="225" fontSize="14">Vs</text>
        </>
      )}

      {/* 3-Phase HW Wiring */}
      {is3Ph && (
        <>
          <line x1="80" y1="80" x2="250" y2="80" stroke="black" strokeWidth="2" />
          <line x1="80" y1="140" x2="250" y2="140" stroke="black" strokeWidth="2" />
          <line x1="80" y1="200" x2="250" y2="200" stroke="black" strokeWidth="2" />
          
          <text x="40" y="85" fontSize="14">Va</text>
          <text x="40" y="145" fontSize="14">Vb</text>
          <text x="40" y="205" fontSize="14">Vc</text>

          <use href={type === 'diode' ? "#device-d" : "#device-t"} x="275" y="140" />
          <use href={type === 'diode' ? "#device-d" : "#device-t"} x="275" y="200" />
          
          <line x1="300" y1="80" x2="330" y2="80" stroke="black" strokeWidth="2" />
          <line x1="300" y1="140" x2="330" y2="140" stroke="black" strokeWidth="2" />
          <line x1="300" y1="200" x2="330" y2="200" stroke="black" strokeWidth="2" />
          <line x1="330" y1="80" x2="330" y2="200" stroke="black" strokeWidth="2" />
          <line x1="330" y1="100" x2="450" y2="100" stroke="black" strokeWidth="2" />
        </>
      )}

      {/* Common Right Side Wiring */}
      {(!is3Ph) && <line x1="300" y1="100" x2="450" y2="100" stroke="black" strokeWidth="2" />}
      <line x1="450" y1="100" x2="450" y2="150" stroke="black" strokeWidth="2" />
      <line x1="450" y1="210" x2="450" y2="300" stroke="black" strokeWidth="2" />
      <line x1="450" y1="300" x2="100" y2="300" stroke="black" strokeWidth="2" />
      
      {/* Primary Device */}
      <use href={type === 'diode' ? "#device-d" : "#device-t"} x="275" y={is3Ph ? 80 : 100} />
      <text x="265" y={is3Ph ? 60 : 70} fontSize="14">{type === 'diode' ? 'D1' : 'T1'}</text>
      {type === 'thyristor' && <text x="285" y={is3Ph ? 110 : 130} fontSize="12" fill="green">Gate (α)</text>}
      
      {/* Load */}
      <use href="#resistor" x="450" y="175" />
      <text x="470" y="180" fontSize="14">Load (R/L)</text>
      <text x="470" y="130" fontSize="12" fill="red">+ Vo -</text>
    </svg>
  );

  const render1PhBridge = (type: 'diode' | 'fc' | 'hc') => (
    <svg viewBox="0 0 600 400" className="w-full max-w-3xl border border-gray-200 rounded shadow-sm bg-white">
      <Defs />
      <line x1="100" y1="150" x2="200" y2="150" stroke="black" strokeWidth="2" />
      <line x1="100" y1="250" x2="200" y2="250" stroke="black" strokeWidth="2" />
      <line x1="100" y1="150" x2="100" y2="180" stroke="black" strokeWidth="2" />
      <line x1="100" y1="220" x2="100" y2="250" stroke="black" strokeWidth="2" />

      <use href="#ac-source" x="100" y="200" />
      <text x="50" y="205" fontSize="14">Vs</text>

      {/* T1 / D1 */}
      <g transform="translate(250, 100) rotate(90)">
        <use href={type === 'diode' ? "#device-d" : "#device-t"} x="0" y="0" />
      </g>
      <text x="215" y="100" fontSize="14">{type === 'diode' ? 'D1' : 'T1'}</text>

      {/* T2 / D2 */}
      <g transform="translate(350, 300) rotate(90)">
        <use href={type === 'fc' ? "#device-t" : "#device-d"} x="0" y="0" />
      </g>
      <text x="315" y="300" fontSize="14">{type === 'fc' ? 'T2' : 'D2'}</text>

      {/* T3 / D3 */}
      <g transform="translate(350, 100) rotate(90)">
        <use href={type === 'fc' ? "#device-t" : "#device-d"} x="0" y="0" />
      </g>
      <text x="315" y="100" fontSize="14">{type === 'fc' ? 'T3' : 'D3'}</text>

      {/* T4 / D4 */}
      <g transform="translate(250, 300) rotate(90)">
        <use href={type === 'diode' ? "#device-d" : "#device-t"} x="0" y="0" />
      </g>
      <text x="215" y="300" fontSize="14">{type === 'diode' ? 'D4' : 'T4'}</text>

      {/* Rails */}
      <line x1="250" y1="50" x2="450" y2="50" stroke="black" strokeWidth="2" />
      <line x1="250" y1="50" x2="250" y2="75" stroke="black" strokeWidth="2" />
      <line x1="350" y1="50" x2="350" y2="75" stroke="black" strokeWidth="2" />
      <line x1="450" y1="50" x2="450" y2="150" stroke="black" strokeWidth="2" />

      <line x1="250" y1="350" x2="450" y2="350" stroke="black" strokeWidth="2" />
      <line x1="250" y1="325" x2="250" y2="350" stroke="black" strokeWidth="2" />
      <line x1="350" y1="325" x2="350" y2="350" stroke="black" strokeWidth="2" />
      <line x1="450" y1="210" x2="450" y2="350" stroke="black" strokeWidth="2" />

      {/* AC connections */}
      <line x1="200" y1="150" x2="250" y2="150" stroke="black" strokeWidth="2" />
      <line x1="250" y1="125" x2="250" y2="275" stroke="black" strokeWidth="2" />
      <circle cx="250" cy="150" r="4" fill="black" />

      <line x1="200" y1="250" x2="350" y2="250" stroke="black" strokeWidth="2" />
      <line x1="350" y1="125" x2="350" y2="275" stroke="black" strokeWidth="2" />
      <circle cx="350" cy="250" r="4" fill="black" />

      <use href="#resistor" x="450" y="175" />
      <text x="470" y="180" fontSize="14">Load (R/L)</text>
      <text x="470" y="130" fontSize="12" fill="red">+ Vo -</text>
    </svg>
  );

  const render3PhBridge = (type: 'diode' | 'fc' | 'hc') => (
    <svg viewBox="0 0 700 400" className="w-full max-w-3xl border border-gray-200 rounded shadow-sm bg-white">
      <Defs />
      {/* 3-Phase AC Source */}
      <text x="40" y="125" fontSize="14">Va</text>
      <text x="40" y="205" fontSize="14">Vb</text>
      <text x="40" y="285" fontSize="14">Vc</text>
      <line x1="80" y1="120" x2="200" y2="120" stroke="black" strokeWidth="2" />
      <line x1="80" y1="200" x2="300" y2="200" stroke="black" strokeWidth="2" />
      <line x1="80" y1="280" x2="400" y2="280" stroke="black" strokeWidth="2" />

      {/* Top Devices */}
      <g transform="translate(200, 70) rotate(90)"><use href={type === 'diode' ? "#device-d" : "#device-t"} x="0" y="0" /></g>
      <g transform="translate(300, 70) rotate(90)"><use href={type === 'diode' ? "#device-d" : "#device-t"} x="0" y="0" /></g>
      <g transform="translate(400, 70) rotate(90)"><use href={type === 'diode' ? "#device-d" : "#device-t"} x="0" y="0" /></g>
      
      {/* Bottom Devices */}
      <g transform="translate(200, 330) rotate(90)"><use href={type === 'fc' ? "#device-t" : "#device-d"} x="0" y="0" /></g>
      <g transform="translate(300, 330) rotate(90)"><use href={type === 'fc' ? "#device-t" : "#device-d"} x="0" y="0" /></g>
      <g transform="translate(400, 330) rotate(90)"><use href={type === 'fc' ? "#device-t" : "#device-d"} x="0" y="0" /></g>

      {/* Legs */}
      <line x1="200" y1="95" x2="200" y2="305" stroke="black" strokeWidth="2" />
      <line x1="300" y1="95" x2="300" y2="305" stroke="black" strokeWidth="2" />
      <line x1="400" y1="95" x2="400" y2="305" stroke="black" strokeWidth="2" />
      
      <circle cx="200" cy="120" r="4" fill="black" />
      <circle cx="300" cy="200" r="4" fill="black" />
      <circle cx="400" cy="280" r="4" fill="black" />

      {/* Top Rail */}
      <line x1="200" y1="45" x2="200" y2="20" stroke="black" strokeWidth="2" />
      <line x1="300" y1="45" x2="300" y2="20" stroke="black" strokeWidth="2" />
      <line x1="400" y1="45" x2="400" y2="20" stroke="black" strokeWidth="2" />
      <line x1="200" y1="20" x2="550" y2="20" stroke="black" strokeWidth="2" />
      <line x1="550" y1="20" x2="550" y2="150" stroke="black" strokeWidth="2" />

      {/* Bottom Rail */}
      <line x1="200" y1="355" x2="200" y2="380" stroke="black" strokeWidth="2" />
      <line x1="300" y1="355" x2="300" y2="380" stroke="black" strokeWidth="2" />
      <line x1="400" y1="355" x2="400" y2="380" stroke="black" strokeWidth="2" />
      <line x1="200" y1="380" x2="550" y2="380" stroke="black" strokeWidth="2" />
      <line x1="550" y1="210" x2="550" y2="380" stroke="black" strokeWidth="2" />

      {/* Load */}
      <use href="#resistor" x="550" y="175" />
      <text x="570" y="180" fontSize="14">Load (R/L)</text>
      <text x="570" y="130" fontSize="12" fill="red">+ Vo -</text>
    </svg>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      {/* 1-Phase */}
      {circuitId === '1ph-hw-diode' && renderHW('diode', false)}
      {circuitId === '1ph-hw-thyristor' && renderHW('thyristor', false)}
      {(circuitId === '1ph-dbr' || circuitId === '1ph-fw-diode') && render1PhBridge('diode')}
      {(circuitId === '1ph-fc-bridge' || circuitId === '1ph-fw-thyristor') && render1PhBridge('fc')}
      {circuitId === '1ph-hc-bridge' && render1PhBridge('hc')}
      
      {/* 3-Phase */}
      {circuitId === '3ph-hw-diode' && renderHW('diode', true)}
      {circuitId === '3ph-hw-thyristor' && renderHW('thyristor', true)}
      {circuitId === '3ph-dbr' && render3PhBridge('diode')}
      {circuitId === '3ph-fc-bridge' && render3PhBridge('fc')}
      {circuitId === '3ph-hc-bridge' && render3PhBridge('hc')}
    </div>
  );
};

export default CircuitSchematic;
