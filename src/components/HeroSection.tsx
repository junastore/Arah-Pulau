import React, { useState } from 'react';
import {
  Search,
  MailCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
  CheckCircle2,
  Home,
  Camera
} from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit: () => void;
  onSelectTag: (tag: string) => void;
  onQuickBookTicket: (category?: string) => void;
}

const SCENERY_OPTIONS = [
  {
    id: 'jembatan',
    name: 'Jembatan Cinta & Laut Toska',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    caption: 'Panorama Jembatan Cinta & Perairan Jernih Pulau Tidung'
  },
  {
    id: 'laguna',
    name: 'Laguna Karang & Terumbu',
    url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=2000&q=85',
    caption: 'Spot Snorkeling & Konservasi Karang Ikan Nemo'
  },
  {
    id: 'pantai',
    name: 'Pesisir Pasir Putih & Kelapa',
    url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2000&q=85',
    caption: 'Pantai Pasir Putih & Suasana Tropis Kepulauan Seribu'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectTag,
  onQuickBookTicket
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'paket' | 'homestay' | 'aktivitas'>('all');
  const [activeBgIndex, setActiveBgIndex] = useState<number>(0);

  const curatedSpots = [
    { label: 'Jembatan Cinta', desc: 'Sunset & Ikon' },
    { label: 'Museum Paus', desc: 'Kerangka Paus' },
    { label: 'Ternak Ikan Nemo', desc: 'Snorkeling Karang' },
    { label: 'Penangkaran Penyu', desc: 'Konservasi Tukik' },
    { label: 'Homestay Tidung', desc: 'Kamar AC Pesisir' }
  ];

  const currentScenery = SCENERY_OPTIONS[activeBgIndex];

  return (
    <section className="relative text-white pt-8 pb-12 sm:pt-14 sm:pb-20 px-3.5 sm:px-6 overflow-hidden flex flex-col justify-between">
      {/* 1. Full-Bleed High-Res Scenery Background Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentScenery.url}
          alt={currentScenery.name}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out"
        />
        {/* Cinematic Multi-stop Dark Gradient Overlay to ensure maximum contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/75 to-slate-950/95 backdrop-blur-[1px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Main Grid: Left Search & Content, Right Visual Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Heading, Search Card, and Tags */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {/* Verified Official Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-400/30 text-[10px] sm:text-[11px] font-semibold tracking-wide text-cyan-300 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">Portal Resmi Reservasi Wisata & Tiket Pulau Tidung</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pesona Eksotis <span className="text-cyan-300">Pulau Tidung</span>, Kepulauan Seribu
            </h1>

            <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl leading-relaxed font-normal">
              Pesan paket liburan komplit, sewa homestay AC pesisir, aktivitas sepeda ontel & snorkeling, serta jelajahi 5 destinasi ikonik Pulau Tidung.
            </p>

            {/* Modern Glassmorphic Search & Booking Card */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-3.5 sm:p-5 shadow-2xl border border-white/20 text-slate-800 space-y-3">
              {/* Quick Service Tabs */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 overflow-x-auto text-xs scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100/80'
                  }`}
                >
                  Semua Layanan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('paket');
                    onQuickBookTicket('paket-wisata');
                  }}
                  className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-xs shrink-0 ${
                    activeTab === 'paket'
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100/80'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Paket Komplit 2D1N</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('homestay');
                    onQuickBookTicket('homestay');
                  }}
                  className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-xs shrink-0 ${
                    activeTab === 'homestay'
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100/80'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Homestay AC</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('aktivitas');
                    onQuickBookTicket('aktivitas');
                  }}
                  className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                    activeTab === 'aktivitas'
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100/80'
                  }`}
                >
                  Sewa Sepeda & Snorkel
                </button>
              </div>

              {/* Search Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSearchSubmit();
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <div className="relative flex-1 flex items-center min-w-0">
                  <Search className="w-4 h-4 text-cyan-700 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari Jembatan Cinta, Nemo, Homestay..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:border-cyan-600 focus:bg-white outline-none font-medium placeholder:text-slate-400 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Cari & Pesan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* 5 Spot Tags */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">
                  5 Spot Utama:
                </span>
                {curatedSpots.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onSelectTag(item.label)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border border-slate-200/60"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Trust Checks */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Asuransi Jasa Raharja</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">E-Tiket Otomatis ke Email</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Tanpa Biaya Tersembunyi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Scenery Showcase Card & Background Switcher */}
          <div className="lg:col-span-5 relative space-y-2.5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-xl bg-slate-900 group">
              <img
                src={currentScenery.url}
                alt={currentScenery.caption}
                className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Top Floating Badges */}
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-white flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-bold">Wisata Bahari Favorit</span>
              </div>

              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-slate-900 flex items-center gap-1 shadow-md text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.9 (1.500+ Ulasan)</span>
              </div>

              {/* Bottom Caption Inside Card */}
              <div className="absolute bottom-3 left-3 right-3 text-left text-white space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>{currentScenery.name}</span>
                </div>
                <h3 className="font-heading text-sm sm:text-base font-bold leading-snug">
                  {currentScenery.caption}
                </h3>
              </div>
            </div>

            {/* Scenery View Switcher Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 text-xs">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium flex items-center gap-1 px-1">
                <Camera className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Pemandangan:</span>
              </span>
              {SCENERY_OPTIONS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveBgIndex(idx)}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer ${
                    activeBgIndex === idx
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name.split('&')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Professional Credibility Stats Bar */}
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-left text-xs">
          <div className="p-2.5 sm:p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 space-y-0.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-cyan-300 tabular-nums">15.000+</span>
            <p className="font-semibold text-white text-[11px] sm:text-xs">Wisatawan Berangkat</p>
            <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">Marina & Kali Adem</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 space-y-0.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-emerald-300 tabular-nums">100% Resmi</span>
            <p className="font-semibold text-white text-[11px] sm:text-xs">Tiket & Asuransi</p>
            <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">Jasa Raharja & Dishub</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 space-y-0.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-teal-300 tabular-nums">&lt; 1 Menit</span>
            <p className="font-semibold text-white text-[11px] sm:text-xs">Notifikasi E-Tiket</p>
            <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">Otomatis masuk email</p>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 space-y-0.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-amber-300 tabular-nums">5 Spot Utama</span>
            <p className="font-semibold text-white text-[11px] sm:text-xs">Destinasi & Homestay</p>
            <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">Jembatan Cinta, Homestay</p>
          </div>
        </div>
      </div>
    </section>
  );
};
