# Website for Assignment 2 by Akhilesh Dixit (24EE10032)

An interactive, responsive, and deployable educational web application for Power Electronics.

## Features
- **Interactive Circuit Schematics**: Vector-based visual models of various rectifier topologies.
- **Real-Time Simulation Engine**: Calculates voltages, currents, and waveforms accurately based on real parameters.
- **Waveform Viewer**: Interactive charts using Plotly.js to inspect dynamic electrical behavior.
- **Theoretical Calculations**: Mathematical displays using KaTeX.
- **Responsive Layout**: Designed for seamless learning on any device size.

## Project Structure
- `src/components/`
  - `layout/`: Main application structure, sidebar, header.
  - `circuit/`: SVG schematics.
  - `waveform/`: Plotly.js charts.
  - `controls/`: Input parameters and controls.
  - `results/`, `theory/`: Analysis calculations and formulas.
- `src/simulations/`
  - `models/`: Circuit definitions and registry.
  - `solver/`: Numerical integration.
  - `analysis/`: Analytical evaluation engine.
- `src/store/`: Zustand state management.

## Setup & Running

1. **Install Node.js** (v18 or higher recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Build for Production
To create a production-ready build for GitHub Pages or another static host:
```bash
npm run build
```
This will output statically deployable files to the `dist` directory.

## Testing
Run tests using Vitest (to be added):
```bash
npm test
```
