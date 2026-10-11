import React, { useState, useEffect } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { subscribeToAssetChanges } from '../utils/assetManager';

interface ArahPulauLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only';
  theme?: 'light' | 'dark';
  withBadge?: boolean;
  allowCustomUpload?: boolean;
}

const LOGO_STORAGE_KEY = 'arahpulau_custom_logo_data';

export const ArahPulauLogo: React.FC<ArahPulauLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light',
  withBadge = false,
  allowCustomUpload = false
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  const loadLogo = () => {
    try {
      const stored = localStorage.getItem(LOGO_STORAGE_KEY);
      setCustomLogoUrl(stored);
    } catch {
      // ignore localStorage errors
    }
  };

  useEffect(() => {
    loadLogo();
    const unsub = subscribeToAssetChanges(() => {
      loadLogo();
    });
    return unsub;
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        try {
          localStorage.setItem(LOGO_STORAGE_KEY, dataUrl);
        } catch (err) {
          console.warn('Failed to save custom logo to localStorage', err);
        }
        setCustomLogoUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      localStorage.removeItem(LOGO_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to remove custom logo', err);
    }
    setCustomLogoUrl(null);
  };

  const sizeMap = {
    sm: { icon: 26, text: 'text-sm', badge: 'text-[9px]' },
    md: { icon: 34, text: 'text-base', badge: 'text-[10px]' },
    lg: { icon: 42, text: 'text-lg', badge: 'text-[11px]' },
    xl: { icon: 52, text: 'text-2xl', badge: 'text-xs' }
  };

  const { icon: iconDim, text: textSize, badge: badgeSize } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none group/logo ${className}`}>
      {/* Emblem Frame */}
      <div
        style={{ width: iconDim, height: iconDim }}
        className="shrink-0 relative rounded-full overflow-hidden shadow-xs hover:scale-105 transition-transform bg-slate-900 border border-white/20 flex items-center justify-center"
      >
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="Logo Arah Pulau"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="apBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="45%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient id="apSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              <linearGradient id="apNeedleRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>

              <linearGradient id="apNeedleLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>

              <linearGradient id="apWaveLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Background circle badge */}
            <circle cx="60" cy="60" r="58" fill="url(#apBgGrad)" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="2 3" />

            {/* Tropical Sun */}
            <circle cx="60" cy="45" r="19" fill="url(#apSunGrad)" />
            <circle cx="60" cy="45" r="24" fill="#fef08a" opacity="0.25" />

            {/* Island sandbank / mound */}
            <path d="M22 84 C38 68, 82 68, 98 84 Z" fill="#0f766e" />
            <path d="M26 84 C42 72, 78 72, 94 84 Z" fill="#14b8a6" opacity="0.75" />

            {/* Palm Fronds & Trunk */}
            <path d="M48 78 Q49 60 56 50 Q54 62 52 78 Z" fill="#78350f" opacity="0.85" />
            <path d="M56 50 Q46 45 38 48 Q47 52 56 50 Z" fill="#15803d" />
            <path d="M56 50 Q48 38 42 39 Q50 44 56 50 Z" fill="#16a34a" />
            <path d="M56 50 Q57 36 64 36 Q61 44 56 50 Z" fill="#22c55e" />
            <path d="M56 50 Q66 43 70 48 Q62 52 56 50 Z" fill="#15803d" />

            {/* Ocean Waves */}
            <path d="M10 78 Q30 72 50 78 T90 78 T110 78 L110 102 Q90 116 60 118 Q30 116 10 102 Z" fill="#0369a1" />
            <path d="M12 84 C30 80, 44 88, 60 84 C76 80, 90 88, 108 84 L108 102 Q88 116 60 118 Q32 116 12 102 Z" fill="url(#apWaveLight)" />
            <path d="M16 90 Q36 86 54 90 T90 90 T104 90" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />

            {/* Compass / Direction Pointer ("Arah") */}
            <g transform="translate(60, 68) rotate(32)">
              <polygon points="0,-24 5,0 0,2 -5,0" fill="url(#apNeedleRed)" />
              <polygon points="0,18 5,0 0,2 -5,0" fill="url(#apNeedleLight)" />
              <circle cx="0" cy="0" r="3.5" fill="#0f172a" />
              <circle cx="0" cy="0" r="1.5" fill="#f8fafc" />
            </g>
          </svg>
        )}

        {/* Hover Upload Trigger if enabled */}
        {allowCustomUpload && (
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity z-20">
            <label
              title="Upload file gambar logo Anda"
              className="w-full h-full flex items-center justify-center cursor-pointer text-white hover:text-cyan-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Camera className="w-3.5 h-3.5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </label>
          </div>
        )}
      </div>

      {/* Typography */}
      {variant === 'full' && (
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-black tracking-tight leading-none ${textSize} ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Arah<span className="text-cyan-500">Pulau</span>
          </span>
          {withBadge && (
            <span
              className={`uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border hidden sm:inline leading-none ${badgeSize} ${
                theme === 'dark'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-200/70'
              }`}
            >
              Pulau Tidung
            </span>
          )}

          {/* Quick Upload / Reset button in Navbar */}
          {allowCustomUpload && (
            <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
              <label
                title="Ganti logo dengan gambar file Anda"
                className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-cyan-50 text-slate-500 hover:text-cyan-700 text-[10px] font-semibold border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Camera className="w-2.5 h-2.5 text-cyan-600" />
                <span className="hidden sm:inline">Ganti Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>

              {customLogoUrl && (
                <button
                  type="button"
                  onClick={handleResetLogo}
                  title="Kembalikan logo default"
                  className="p-0.5 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
