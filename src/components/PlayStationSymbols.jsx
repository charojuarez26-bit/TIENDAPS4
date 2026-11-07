import React from 'react';

export function PsTriangle({ className = "w-4 h-4", glow = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2dd4bf"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]' : ''}`}
    >
      <polygon points="12 4 21 20 3 20" />
    </svg>
  );
}

export function PsCircle({ className = "w-4 h-4", glow = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f87171"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]' : ''}`}
    >
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export function PsCross({ className = "w-4 h-4", glow = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#60a5fa"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]' : ''}`}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function PsSquare({ className = "w-4 h-4", glow = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f472b6"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]' : ''}`}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

export function PlayStationSymbolsRow({ size = "w-4 h-4", spacing = "space-x-2", glow = true }) {
  return (
    <div className={`inline-flex items-center ${spacing}`}>
      <PsTriangle className={size} glow={glow} />
      <PsCircle className={size} glow={glow} />
      <PsCross className={size} glow={glow} />
      <PsSquare className={size} glow={glow} />
    </div>
  );
}
