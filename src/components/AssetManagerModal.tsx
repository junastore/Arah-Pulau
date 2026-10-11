import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Search,
  Sparkles,
  Camera,
  Image as ImageIcon,
  AlertCircle,
  Layers,
  ChevronRight,
  Trash2
} from 'lucide-react';
import {
  ASSET_DEFINITIONS,
  AssetItemDefinition,
  getEffectiveAssetImage,
  getCustomAssetImage,
  saveAssetImage,
  removeAssetImage,
  resetAllCustomAssets,
  subscribeToAssetChanges
} from '../utils/assetManager';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedAssetId?: string;
}

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({
  isOpen,
  onClose,
  initialSelectedAssetId
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'brand' | 'package' | 'destination'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // URL modal state
  const [urlInputTarget, setUrlInputTarget] = useState<AssetItemDefinition | null>(null);
  const [urlInputValue, setUrlInputValue] = useState<string>('');

  // Preset picker modal state
  const [presetTarget, setPresetTarget] = useState<AssetItemDefinition | null>(null);

  // Confirm Reset All state
  const [showConfirmResetAll, setShowConfirmResetAll] = useState<boolean>(false);

  // Listen to asset changes
  useEffect(() => {
    const unsub = subscribeToAssetChanges(() => {
      setRefreshKey((prev) => prev + 1);
    });
    return unsub;
  }, []);

  // Set category if initialSelectedAssetId is provided
  useEffect(() => {
    if (initialSelectedAssetId) {
      const def = ASSET_DEFINITIONS.find((a) => a.id === initialSelectedAssetId);
      if (def) {
        setActiveCategory(def.category as any);
      }
    }
  }, [initialSelectedAssetId]);

  if (!isOpen) return null;

  const handleFileUpload = (asset: AssetItemDefinition, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file terlalu besar (maksimal 8MB). Silakan gunakan file gambar yang lebih ringan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        saveAssetImage(asset.id, dataUrl);
        setFeedback(`Gambar "${asset.name}" berhasil diganti dengan foto Anda!`);
        setTimeout(() => setFeedback(null), 3500);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveUrl = () => {
    if (!urlInputTarget || !urlInputValue.trim()) return;

    saveAssetImage(urlInputTarget.id, urlInputValue.trim());
    setFeedback(`Gambar "${urlInputTarget.name}" berhasil diganti via link URL!`);
    setUrlInputTarget(null);
    setUrlInputValue('');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleApplyPreset = (asset: AssetItemDefinition, presetUrl: string, presetLabel: string) => {
    saveAssetImage(asset.id, presetUrl);
    setFeedback(`Gambar "${asset.name}" diganti dengan rekomendasi "${presetLabel}"!`);
    setPresetTarget(null);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleResetSingle = (asset: AssetItemDefinition) => {
    removeAssetImage(asset.id);
    setFeedback(`Gambar "${asset.name}" dikembalikan ke bawaan asli.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleResetAll = () => {
    resetAllCustomAssets();
    setShowConfirmResetAll(false);
    setFeedback('Semua gambar aset telah dikembalikan ke bawaan awal aplikasi.');
    setTimeout(() => setFeedback(null), 3500);
  };

  // Filtered definitions
  const filteredAssets = ASSET_DEFINITIONS.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00758f] via-[#0284a8] to-[#0284c7] p-5 text-white shrink-0 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Menu Ganti Aset Gambar</span>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-medium">
                  Mudah & Cepat
                </span>
              </h2>
              <p className="text-xs text-cyan-100 mt-0.5">
                Ganti logo, foto paket & destinasi langsung dari HP / laptop
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{feedback}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold px-1.5 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Controls: Category Filter & Search */}
        <div className="p-4 pb-2 border-b border-slate-100 space-y-3 shrink-0 bg-slate-50/60">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama aset (misal: Jembatan Cinta, Nemo, 2D1N...)"
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Semua ({ASSET_DEFINITIONS.length})
            </button>
            <button
              onClick={() => setActiveCategory('brand')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'brand'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Logo & Brand
            </button>
            <button
              onClick={() => setActiveCategory('package')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'package'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              Paket & Tiket
            </button>
            <button
              onClick={() => setActiveCategory('destination')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === 'destination'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              5 Spot Destinasi
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
          {filteredAssets.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-xs font-medium">Tidak ada gambar yang cocok dengan pencarian.</p>
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const currentImage = getEffectiveAssetImage(asset.id, asset.defaultUrl);
              const isCustom = Boolean(getCustomAssetImage(asset.id));

              return (
                <div key={`${asset.id}-${refreshKey}`} className="pt-3.5 first:pt-0">
                  <div className="flex gap-3 items-start">
                    {/* Thumbnail Preview */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs group">
                      <img
                        src={currentImage}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      {isCustom && (
                        <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                          Kustom
                        </div>
                      )}
                    </div>

                    {/* Details & Actions */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider">
                          {asset.categoryLabel}
                        </span>
                        {isCustom && (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                            • Diubah
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 truncate mt-0.5">
                        {asset.name}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {asset.description}
                      </p>

                      {/* Action Buttons Grid */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {/* 1. Upload File Button */}
                        <label className="px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-cyan-200/80 shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-cyan-700" />
                          <span>Unggah File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(asset, e)}
                          />
                        </label>

                        {/* 2. Input URL Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setUrlInputTarget(asset);
                            setUrlInputValue(isCustom ? currentImage : '');
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-slate-200 shadow-2xs"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span>Link URL</span>
                        </button>

                        {/* 3. Preset Gallery (if available) */}
                        {asset.recommendedPresets.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setPresetTarget(asset)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-amber-200/80 shadow-2xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pilihan Foto ({asset.recommendedPresets.length})</span>
                          </button>
                        )}

                        {/* 4. Reset Button */}
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetSingle(asset)}
                            title="Kembalikan ke foto asli"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Reset All Option */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setShowConfirmResetAll(true)}
            className="text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Gambar</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Modal: Input URL */}
      {urlInputTarget && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-sm">
              Masukkan URL Gambar
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Untuk gambar: <strong>{urlInputTarget.name}</strong>
            </p>

            <div className="mt-3">
              <input
                type="url"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                autoFocus
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Tips: Gunakan link gambar berakhiran .jpg / .png / .webp atau URL Unsplash.
              </p>
            </div>

            {urlInputValue.trim() && (
              <div className="mt-3 h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={urlInputValue.trim()}
                  alt="Preview URL"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setUrlInputTarget(null);
                  setUrlInputValue('');
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveUrl}
                disabled={!urlInputValue.trim()}
                className="px-4 py-2 text-xs bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Simpan Gambar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Preset Gallery Picker */}
      {presetTarget && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Pilih Foto Rekomendasi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Foto pilihan untuk <strong>{presetTarget.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setPresetTarget(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3.5 space-y-3">
              {presetTarget.recommendedPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPreset(presetTarget, preset.url, preset.label)}
                  className="group bg-slate-50 hover:bg-cyan-50/70 border border-slate-200 hover:border-cyan-300 rounded-2xl overflow-hidden cursor-pointer transition-all p-2 flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-800">
                      {preset.label}
                    </p>
                    <span className="text-[10px] text-cyan-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <span>Klik untuk pasang</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setPresetTarget(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Reset All */}
      {showConfirmResetAll && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xs p-5 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Kembalikan Semua Gambar?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Semua gambar logo, paket, dan destinasi yang pernah Anda unggah akan dikembalikan ke gambar bawaan awal.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmResetAll(false)}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Ya, Reset Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
