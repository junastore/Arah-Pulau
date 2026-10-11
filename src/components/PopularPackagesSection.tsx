import React, { useState, useEffect } from 'react';
import { TicketOption } from '../types';
import { formatRupiah } from '../utils/storage';
import { Star, Clock } from 'lucide-react';
import {
  getEffectiveAssetImage,
  subscribeToAssetChanges
} from '../utils/assetManager';

interface PopularPackagesSectionProps {
  packages: TicketOption[];
  onSelectPackage: (pkg: TicketOption) => void;
  onViewAll?: () => void;
  onOpenAssetManager?: (assetId?: string) => void;
}

export const PopularPackagesSection: React.FC<PopularPackagesSectionProps> = ({
  packages,
  onSelectPackage,
}) => {
  const [, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const unsub = subscribeToAssetChanges(() => {
      setRefreshKey((k) => k + 1);
    });
    return unsub;
  }, []);

  return (
    <section className="px-5 py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Paket Populer
        </h2>
      </div>

      {/* Cards Grid / Horizontal Scroll */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {packages.map((pkg) => {
          const displayImage = getEffectiveAssetImage(
            pkg.id,
            pkg.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
          );

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between group active:scale-[0.98] relative"
            >
              <div>
                {/* Image Container with Rating Badge & Quick Change Photo */}
                <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={displayImage}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[11px] font-bold text-slate-800 shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{pkg.rating || 4.8}</span>
                  </div>

                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-cyan-700 transition-colors">
                    {pkg.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 mt-1">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{pkg.durationText}</span>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="px-3 pb-3 pt-0">
                <span className="text-[10px] text-slate-400 block">
                  Mulai dari
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-[#0284c7] leading-tight">
                  {formatRupiah(pkg.price)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
