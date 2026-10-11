import React from 'react';
import { Search, User, X } from 'lucide-react';

interface MobileHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  onOpenProfile: () => void;
  onOpenAssetManager?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenProfile
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="bg-gradient-to-b from-[#00758f] via-[#0284a8] to-[#0284c7] pt-7 pb-8 px-5 rounded-b-[30px] shadow-md text-white">
      {/* Top Bar: Greeting & Action Buttons */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-xs sm:text-sm font-medium text-cyan-100 flex items-center gap-1.5">
            <span>Halo, Wisatawan!</span>
            <span role="img" aria-label="wave">👋</span>
          </p>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5 leading-snug">
            Mau liburan ke mana?
          </h1>
        </div>

        {/* Action Buttons: User Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            title="Buka Profil & Tiket"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-cyan-800 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100/90 flex items-center px-4 py-3.5 gap-3 transition-all focus-within:ring-2 focus-within:ring-cyan-300">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari paket wisata, aktivitas..."
            className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
