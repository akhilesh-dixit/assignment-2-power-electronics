import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface Props {
  circuitId: string;
}

const TheoryPanel: React.FC<Props> = ({ circuitId }) => {

  const renderHWDiode = () => (
    <>
      <h3>Key Equations</h3>
      <p>The average output voltage for a single-phase half-wave diode rectifier is given by:</p>
      <BlockMath math="V_{dc} = \frac{V_m}{\pi}" />
      <p>And the RMS output voltage is:</p>
      <BlockMath math="V_{rms} = \frac{V_m}{2}" />
      
      <h3>Conduction Sequence</h3>
      <table className="w-full text-left border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Interval</th>
            <th className="border p-2">Conducting Devices</th>
            <th className="border p-2">Output Voltage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2"><InlineMath math="0 < \omega t < \pi" /></td>
            <td className="border p-2">D1</td>
            <td className="border p-2"><InlineMath math="v_s" /></td>
          </tr>
          <tr>
            <td className="border p-2"><InlineMath math="\pi < \omega t < 2\pi" /></td>
            <td className="border p-2">None</td>
            <td className="border p-2">0</td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderHWThyristor = () => (
    <>
      <h3>Key Equations</h3>
      <p>The average output voltage for a single-phase half-wave controlled rectifier (with resistive load) is given by:</p>
      <BlockMath math="V_{dc} = \frac{V_m}{2\pi} (1 + \cos \alpha)" />
      <p>And the RMS output voltage is:</p>
      <BlockMath math="V_{rms} = V_m \sqrt{\frac{\pi - \alpha}{4\pi} + \frac{\sin(2\alpha)}{8\pi}}" />
      
      <h3>Conduction Sequence (R Load)</h3>
      <table className="w-full text-left border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Interval</th>
            <th className="border p-2">Conducting Devices</th>
            <th className="border p-2">Output Voltage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2"><InlineMath math="0 < \omega t < \alpha" /></td>
            <td className="border p-2">None</td>
            <td className="border p-2">0</td>
          </tr>
          <tr>
            <td className="border p-2"><InlineMath math="\alpha < \omega t < \pi" /></td>
            <td className="border p-2">T1</td>
            <td className="border p-2"><InlineMath math="v_s" /></td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderFullWave = () => (
    <>
      <h3>Key Equations</h3>
      <p>For a single-phase full-wave diode bridge (or center-tapped) rectifier:</p>
      <BlockMath math="V_{dc} = \frac{2V_m}{\pi}" />
      <p>And the RMS output voltage is:</p>
      <BlockMath math="V_{rms} = \frac{V_m}{\sqrt{2}}" />
    </>
  );

  const renderFCBridge = () => (
    <>
      <h3>Key Equations</h3>
      <p>For a single-phase fully controlled bridge rectifier (continuous conduction):</p>
      <BlockMath math="V_{dc} = \frac{2V_m}{\pi} \cos \alpha" />
      <p>And the RMS output voltage is equal to the source RMS voltage.</p>
      <BlockMath math="V_{rms} = \frac{V_m}{\sqrt{2}}" />
    </>
  );

  const render3PhDBR = () => (
    <>
      <h3>Key Equations</h3>
      <p>For a three-phase diode bridge rectifier (6-pulse), the average output voltage is:</p>
      <BlockMath math="V_{dc} = \frac{3\sqrt{3}V_m}{\pi}" />
      <p>where <InlineMath math="V_m" /> is the peak phase voltage. Alternatively, in terms of line-to-line RMS voltage <InlineMath math="V_{L(rms)}" />:</p>
      <BlockMath math="V_{dc} = \frac{3\sqrt{2}}{\pi} V_{L(rms)} \approx 1.35 V_{L(rms)}" />
      <p>The RMS output voltage is:</p>
      <BlockMath math="V_{rms} = V_m \sqrt{\frac{3}{2} + \frac{9\sqrt{3}}{4\pi}}" />
      
      <h3>Conduction Sequence</h3>
      <p>The diodes conduct in pairs, switching every 60 degrees. The sequence of conducting diodes is D1-D2, D2-D3, D3-D4, D4-D5, D5-D6, D6-D1.</p>
    </>
  );

  return (
    <div className="p-6 prose max-w-3xl">
      <h2>Working Principle & Theory</h2>
      <p>
        This panel provides the educational explanation, conduction sequences, and formulas for the selected circuit.
      </p>
      
      {circuitId === '1ph-hw-diode' && renderHWDiode()}
      {circuitId === '1ph-hw-thyristor' && renderHWThyristor()}
      {(circuitId === '1ph-dbr' || circuitId === '1ph-fw-diode') && renderFullWave()}
      {(circuitId === '1ph-fc-bridge' || circuitId === '1ph-fw-thyristor') && renderFCBridge()}
      {circuitId === '3ph-dbr' && render3PhDBR()}
      
      {![
        '1ph-hw-diode', '1ph-hw-thyristor', '1ph-dbr', '1ph-fw-diode', '1ph-fc-bridge', '1ph-fw-thyristor', '3ph-dbr'
      ].includes(circuitId) && (
        <div className="text-gray-500 italic mt-4">
          Detailed equations for this specific topology will be added in the final version.
        </div>
      )}
    </div>
  );
};

export default TheoryPanel;
