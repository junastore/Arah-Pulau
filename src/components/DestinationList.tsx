import React, { useState, useEffect } from 'react';
import { DestinationItem } from '../types';
import { MapPin, Star, Eye, Camera, Check } from 'lucide-react';
import {
  getEffectiveDestinationImage,
  getStoredDestinationPhoto
} from '../utils/destinationImages';
import { subscribeToAssetChanges } from '../utils/assetManager';

interface DestinationListProps {
  destinations: DestinationItem[];
  onSelectDestination: (dest: DestinationItem) => void;
  onBookRelatedTicket?: (dest: DestinationItem) => void;
  onOpenAssetManager?: (assetId?: string) => void;
}

export const DestinationList: React.FC<DestinationListProps> = ({
  destinations,
  onSelectDestination,
  onOpenAssetManager
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [updateFeedback, setUpdateFeedback] = useState<{ id: string; message: string } | null>(null);

  const loadPhotos = () => {
    const loaded: Record<string, string> = {};
    destinations.forEach((dest) => {
      const stored = getStoredDestinationPhoto(dest.id);
      if (stored) loaded[dest.id] = stored;
    });
    setCustomPhotos(loaded);
  };

  // Load custom photos on mount and when assetManager notifies change
  useEffect(() => {
    loadPhotos();
    const unsub = subscribeToAssetChanges(() => {
      loadPhotos();
    });
    return unsub;
  }, [destinations]);

  const categories = [
    { id: 'all', label: 'Semua (5)' },
    { id: 'spot-ikonik', label: 'Jembatan Cinta' },
    { id: 'museum', label: 'Museum Paus' },
    { id: 'nemo', label: 'Ternak Ikan Nemo' },
    { id: 'penyu', label: 'Penangkaran Penyu' },
    { id: 'homestay', label: 'Homestay Tidung' }
  ];

  const filtered = destinations.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });



  return (
    <section id="destinasi" className="py-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-cyan-700 tracking-widest uppercase">
              Eksplorasi 5 Spot Pilihan
            </span>
            {onOpenAssetManager && (
              <button
                type="button"
                onClick={() => onOpenAssetManager('destination')}
                className="text-[10px] text-cyan-700 hover:text-cyan-900 font-bold bg-cyan-50 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer border border-cyan-200"
              >
                <Camera className="w-3 h-3" />
                <span>Menu Ganti Foto</span>
              </button>
            )}
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Destinasi & Penginapan <span className="text-cyan-700">Pulau Tidung</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
            Daftar 5 destinasi esensial: Jembatan Cinta, Museum Paus, Ternak Ikan Nemo, Penangkaran Penyu, dan Homestay AC nyaman.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto border border-slate-200/60">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Update notification toast */}
      {updateFeedback && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{updateFeedback.message}</span>
          </div>
          <button
            onClick={() => setUpdateFeedback(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Grid of 5 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const displayImage = customPhotos[item.id] || getEffectiveDestinationImage(item.id, item.imageUrl);
          const hasCustomPhoto = Boolean(customPhotos[item.id]);

          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Frame */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={displayImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70" />

                  {/* Category Chip */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-xs">
                    {item.categoryLabel}
                  </div>



                  {/* Museum Paus Special Badge */}
                  {item.id === 'museum-paus' && (
                    <div className="absolute bottom-2.5 left-3 bg-cyan-900/85 backdrop-blur-xs text-cyan-200 px-2 py-0.5 rounded text-[9px] font-semibold border border-cyan-400/30">
                      {hasCustomPhoto ? 'Foto Koleksi Pengguna' : 'Foto Kerangka Paus 12M'}
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-slate-400 font-normal">({item.reviewsCount})</span>
                    </span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">{item.entryFee}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {item.name}
                  </h3>

                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                    {item.shortDesc}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  onClick={() => onSelectDestination(item)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Detail Spot</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
