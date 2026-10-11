import React, { useState } from 'react';
import { TicketOption } from '../types';
import { formatRupiah } from '../utils/storage';
import { Clock, Check, ArrowRight, MapPin, Sparkles } from 'lucide-react';

interface TicketSectionProps {
  tickets: TicketOption[];
  onSelectTicket: (ticket: TicketOption) => void;
}

export const TicketSection: React.FC<TicketSectionProps> = ({ tickets, onSelectTicket }) => {
  const [filter, setFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'Semua Pilihan' },
    { id: 'paket-wisata', label: 'Paket Komplit' },
    { id: 'homestay', label: 'Homestay AC' },
    { id: 'aktivitas', label: 'Aktivitas & Sewa' }
  ];

  const filtered = tickets.filter((t) => {
    if (filter === 'all') return true;
    return t.category === filter;
  });

  return (
    <section id="tiket" className="py-14 bg-slate-100/70 border-y border-slate-200/80 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-9">
          <span className="text-[11px] font-bold text-cyan-700 tracking-widest uppercase">
            Tarif & Reservasi Resmi
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Paket Wisata, Homestay, & Aktivitas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Dapatkan paket liburan komplit, penginapan homestay AC, dan sewa aktivitas dengan konfirmasi instan.
          </p>

          {/* Segmented Filter */}
          <div className="mt-5 inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-xs max-w-full overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
                ticket.popular
                  ? 'border-cyan-500 shadow-md ring-1 ring-cyan-500/20'
                  : 'border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wide">
                    {ticket.categoryLabel}
                  </span>
                  {ticket.popular && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300/60">
                      Favorit
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {ticket.name}
                </h3>

                {/* Price Display */}
                <div className="mt-3 pb-3.5 border-b border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {formatRupiah(ticket.price)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{ticket.priceUnitText}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {ticket.description}
                  </p>
                </div>

                {/* Key Specs */}
                <div className="py-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Lokasi: <strong className="text-slate-800">{ticket.departurePort}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Waktu: <strong className="text-slate-800">{ticket.durationText}</strong></span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="space-y-1.5 mb-6 text-xs text-slate-600">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Fasilitas Termasuk:
                  </p>
                  {ticket.features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectTicket(ticket)}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  ticket.popular
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
