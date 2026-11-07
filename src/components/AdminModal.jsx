import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, X, ShieldAlert, KeyRound, Eye, EyeOff } from 'lucide-react';
import { PlayStationSymbolsRow } from './PlayStationSymbols';

export default function AdminModal({ onLoginSuccess }) {
  const { isAdminModalOpen, setIsAdminModalOpen, loginAdmin } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (isAdminModalOpen) {
      setPin('');
      setError(false);
    }
  }, [isAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!pin.trim()) return;

    const success = loginAdmin(pin);
    if (success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleKeyPress = (num) => {
    if (pin.length < 8) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsAdminModalOpen(false)}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-ps-surface border-2 border-ps-border shadow-2xl p-6 overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ps-blue via-ps-neon to-ps-blue" />

        {/* Close Button */}
        <button
          onClick={() => setIsAdminModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ps-blue/30 to-ps-surfaceLight border border-ps-neon/40 flex items-center justify-center mx-auto mb-3 shadow-ps-glow">
            <Lock className="w-7 h-7 text-ps-neon" />
          </div>

          <h3 className="text-xl font-bold text-white font-gaming tracking-wider">
            ACCESO ADMINISTRACIÓN
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ingresá el PIN de seguridad del taller
          </p>

          <div className="mt-2 flex justify-center">
            <PlayStationSymbolsRow size="w-3 h-3" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={8}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/[^0-9]/g, ''));
                setError(false);
              }}
              placeholder="••••"
              autoFocus
              className={`w-full text-center text-2xl tracking-[0.4em] font-mono py-3 rounded-xl bg-ps-bg border ${
                error ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-ps-border focus:border-ps-neon'
              } text-white focus:outline-none transition-all`}
            />

            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
              aria-label={showPin ? 'Ocultar PIN' : 'Ver PIN'}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="text-xs text-rose-400 text-center flex items-center justify-center gap-1.5 animate-shake">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>PIN incorrecto. Reintentá con "2020"</span>
            </div>
          )}

          {/* Quick Keypad for Mobile or Touch */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num.toString())}
                className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-ps-blue hover:bg-slate-800 text-white font-mono text-base font-bold transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 text-xs font-bold transition-all"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-ps-blue hover:bg-slate-800 text-white font-mono text-base font-bold transition-all active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => { setPin('2020'); }}
              className="py-2.5 rounded-xl bg-ps-blue/20 border border-ps-blue/40 text-ps-neon text-[10px] font-bold hover:bg-ps-blue/40 transition-all"
              title="Cargar PIN demo 2020"
            >
              Demo: 2020
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white font-bold text-sm tracking-wide shadow-ps-glow transition-all duration-200 mt-2"
          >
            INGRESAR AL PANEL
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-ps-border/70 text-center">
          <p className="text-[11px] text-slate-500">
            PIN predeterminado de demostración: <strong className="text-ps-neon">2020</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
