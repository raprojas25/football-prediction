// GlowBackgroundButton.tsx
import React from 'react';

const GlowBackgroundButton: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden flex items-center justify-center">
      {/* Luces borrosas de fondo */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-40" />

      {/* Botón animado con resplandor en el borde al hover */}
      <button className="relative px-8 py-4 text-lg font-semibold text-white bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] focus:outline-none group">
        <span className="relative z-10">Hover me</span>
        {/* Efecto de borde resplandeciente adicional (opcional) */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 -z-10" />
      </button>
    </div>
  );
};

export default GlowBackgroundButton;
