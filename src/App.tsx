import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MainWorkspace from './components/layout/MainWorkspace';
import { useCircuitStore } from './store/circuitStore';

function App() {
  const { activeCircuitId } = useCircuitStore();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {activeCircuitId ? (
            <MainWorkspace />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a circuit from the sidebar to begin.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
