import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatARS, formatSimpleDate, getRelativeTime, REPAIR_STATUS_CONFIG, cleanPhone } from '../utils/formatters';
import { Search, Wrench, Clock, CheckCircle2, PackageCheck, AlertCircle, ArrowRight, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { PlayStationSymbolsRow, PsTriangle, PsCircle, PsCross, PsSquare } from './PlayStationSymbols';

const SAMPLE_DNIS = [
  { dni: '38111222', name: 'Lucas Gómez', device: 'PS4 Fat' },
  { dni: '40333444', name: 'Martín Díaz', device: '2x Joysticks' },
  { dni: '42555666', name: 'Sofía Ruiz', device: 'PS3 Slim' },
];

export default function RepairTrackerSection() {
  const { repairs, config } = useApp();
  const [dniQuery, setDniQuery] = useState('');
  const [searchedRepairs, setSearchedRepairs] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (customDni) => {
    const term = (customDni !== undefined ? customDni : dniQuery).trim();
    if (!term) return;

    setDniQuery(term);
    setHasSearched(true);

    const clean = term.replace(/[^0-9]/g, '');
    const found = repairs.filter(r => {
      const matchDni = r.dni && r.dni.replace(/[^0-9]/g, '') === clean;
      const matchOrder = r.id.toString() === clean;
      return matchDni || matchOrder;
    });

    setSearchedRepairs(found);
  };

  const handleSampleClick = (dni) => {
    setDniQuery(dni);
    handleSearch(dni);
  };

  // Helper to calculate queue position
  const getQueuePosition = (repairId) => {
    const activeQueue = repairs.filter(r => r.status === 'En fila' || r.status === 'En taller');
    const index = activeQueue.findIndex(r => r.id === repairId);
    if (index === -1) return null;
    return {
      position: index + 1,
      totalActive: activeQueue.length
    };
  };

  const buildWhatsAppQueryUrl = (repair) => {
    const phone = cleanPhone(config.whatsappNumber);
    const msg = `¡Hola ${config.businessName}! Quisiera consultar sobre el estado de mi orden #${repair.id} (${repair.device}) a nombre de ${repair.clientName}.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="tracking" className="py-12 md:py-20 bg-ps-bg relative overflow-hidden border-t border-ps-border">
      {/* Background glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-ps-blue/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <PlayStationSymbolsRow size="w-3.5 h-3.5" />
            <span className="text-xs uppercase font-bold text-ps-neon tracking-wider">Trazabilidad en Vivo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-gaming tracking-wide">
            ESTADO DE TU REPARACIÓN
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Ingresá tu número de DNI para consultar en qué etapa del proceso técnico se encuentra tu equipo.
          </p>
        </div>

        {/* Highlighted Search Box */}
        <div className="rounded-2xl bg-gradient-to-b from-ps-surface to-slate-900 border-2 border-ps-neon/40 shadow-ps-glow p-6 sm:p-8 max-w-2xl mx-auto mb-8">
          
          <form
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative w-full">
              <Search className="w-5 h-5 text-ps-neon absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={dniQuery}
                onChange={(e) => setDniQuery(e.target.value)}
                placeholder="Ingresá tu DNI (ej: 38111222 o N° Orden)"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-ps-bg border border-ps-border focus:border-ps-neon text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ps-neon/30 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-ps-blue to-ps-blueDark hover:from-ps-blueLight hover:to-ps-blue text-white font-bold text-sm tracking-wide shadow-ps-glow transition-all whitespace-nowrap flex items-center justify-center gap-2"
            >
              <span>Consultar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Chips */}
          <div className="mt-4 pt-4 border-t border-ps-border/70 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">DNIs de prueba para probar:</span>
            {SAMPLE_DNIS.map((sample) => (
              <button
                key={sample.dni}
                type="button"
                onClick={() => handleSampleClick(sample.dni)}
                className="text-xs px-2.5 py-1 rounded-lg bg-ps-blue/20 hover:bg-ps-blue/40 border border-ps-blue/40 text-ps-neon hover:text-white font-mono transition-all flex items-center gap-1.5"
              >
                <span>{sample.dni}</span>
                <span className="text-[10px] text-slate-400 font-sans">({sample.device})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Display */}
        {hasSearched && (
          <div className="animate-fadeIn max-w-3xl mx-auto">
            {searchedRepairs && searchedRepairs.length > 0 ? (
              <div className="space-y-6">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Resultados para DNI: {dniQuery}</span>
                  <span className="text-ps-neon">{searchedRepairs.length} orden(es) registrada(s)</span>
                </div>

                {searchedRepairs.map((repair) => {
                  const statusInfo = REPAIR_STATUS_CONFIG[repair.status] || REPAIR_STATUS_CONFIG['En fila'];
                  const queueInfo = getQueuePosition(repair.id);
                  const isReady = repair.status === 'Listo para retirar';

                  return (
                    <div
                      key={repair.id}
                      className={`rounded-2xl bg-ps-surface border ${
                        isReady ? 'border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.25)]' : 'border-ps-border'
                      } p-6 sm:p-8 transition-all relative overflow-hidden`}
                    >
                      {/* Top Ready Notice Banner if status is 'Listo para retirar' */}
                      {isReady && (
                        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-600/20 to-transparent border border-emerald-500/40 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">
                            ✓
                          </div>
                          <div>
                            <h4 className="text-emerald-300 font-bold text-sm sm:text-base">
                              ¡Tu equipo está LISTO PARA RETIRAR!
                            </h4>
                            <p className="text-xs text-slate-300">
                              Podés pasar por nuestro local en el centro de Aguilares en los horarios habituales.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Header Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ps-border/70">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-ps-neon bg-ps-blue/20 px-2 py-0.5 rounded border border-ps-blue/40">
                              ORDEN #{repair.id}
                            </span>
                            <span className="text-xs text-slate-400">
                              Ingreso: {formatSimpleDate(repair.entryDate)} ({getRelativeTime(repair.entryDate)})
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                            {repair.device}
                          </h3>
                          <div className="text-xs text-slate-300 mt-0.5">
                            Cliente: <span className="font-semibold text-white">{repair.clientName}</span> | DNI: {repair.dni}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="sm:text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold ${statusInfo.textColor} ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                            <span className="w-2 h-2 rounded-full animate-ping bg-current" />
                            <span>{repair.status}</span>
                          </div>
                          {queueInfo && repair.status !== 'Entregado' && (
                            <div className="text-[11px] text-slate-400 mt-1">
                              {repair.status === 'En fila' ? (
                                <span>Puesto #{queueInfo.position} en cola de espera</span>
                              ) : repair.status === 'En taller' ? (
                                <span className="text-ps-neon font-medium">En banco de trabajo activo</span>
                              ) : (
                                <span className="text-emerald-400 font-medium">Control de calidad aprobado</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visual Stepper & Progress Bar */}
                      <div className="my-6">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                          <span className={repair.status === 'En fila' ? 'text-amber-400 font-bold' : ''}>1. En fila</span>
                          <span className={repair.status === 'En taller' ? 'text-ps-neon font-bold' : ''}>2. En taller</span>
                          <span className={repair.status === 'Listo para retirar' ? 'text-emerald-400 font-bold' : ''}>3. Listo</span>
                          <span className={repair.status === 'Entregado' ? 'text-slate-300 font-bold' : ''}>4. Entregado</span>
                        </div>

                        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${statusInfo.barColor}`}
                            style={{ width: `${statusInfo.progress}%` }}
                          />
                        </div>

                        <p className="text-xs text-slate-400 mt-2.5 italic">
                          ℹ️ {statusInfo.description}
                        </p>
                      </div>

                      {/* Fault and Technician Notes Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                        <div className="p-3.5 rounded-xl bg-ps-bg border border-ps-border">
                          <div className="text-[11px] font-semibold text-slate-500 uppercase">Falla Reportada</div>
                          <div className="text-xs sm:text-sm font-medium text-slate-200 mt-1">
                            {repair.issue}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-ps-bg border border-ps-border">
                          <div className="text-[11px] font-semibold text-slate-500 uppercase">Diagnóstico / Trabajo Técnico</div>
                          <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                            {repair.technicianNotes || 'En proceso de evaluación en banco de trabajo.'}
                          </div>
                        </div>
                      </div>

                      {/* Footer with Cost and WhatsApp Action */}
                      <div className="pt-4 border-t border-ps-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <div className="text-xs text-slate-400">Presupuesto / Total del servicio:</div>
                          <div className="text-xl sm:text-2xl font-extrabold text-white font-gaming text-ps-neon">
                            {formatARS(repair.cost)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <a
                            href={buildWhatsAppQueryUrl(repair)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Consultar al Taller por WhatsApp</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-6 rounded-2xl bg-ps-surface border border-ps-border">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No encontramos reparaciones activas</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  No se registran equipos asociados al DNI o número de orden <strong className="text-white">"{dniQuery}"</strong>.
                  Verificá el número o hacé clic en uno de los DNIs de prueba arriba.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleSampleClick('38111222')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-ps-blue/30 text-ps-neon hover:bg-ps-blue/50 font-semibold"
                  >
                    Probar con DNI 38111222
                  </button>
                  <button
                    onClick={() => handleSampleClick('40333444')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-ps-blue/30 text-ps-neon hover:bg-ps-blue/50 font-semibold"
                  >
                    Probar con DNI 40333444
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
