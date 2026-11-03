import React from 'react';
import StarDome from './components/canvas/StarDome';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans text-white">
      {/* randam fundalul 3D */}
      <StarDome />
      
      {/* randam interfata (UI-ul suprapus) */}
      <div className="absolute top-5 left-5 bg-black/60 p-5 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
          Explorator Spațio-Temporal
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Sprint 1 Finalizat. Peste 8000 de stele randate cu succes.
        </p>
      </div>
    </div>
  );
}

export default App;