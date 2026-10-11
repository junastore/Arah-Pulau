/**
 * Unified Asset & Image Manager for Pulau Tidung Applet
 * Handles custom logo, header, package images, and destination photos with localStorage persistence
 */

export interface AssetItemDefinition {
  id: string;
  name: string;
  category: 'brand' | 'package' | 'destination' | 'header';
  categoryLabel: string;
  description: string;
  defaultUrl: string;
  recommendedPresets: { label: string; url: string }[];
}

export const ASSET_DEFINITIONS: AssetItemDefinition[] = [
  // Brand & Header
  {
    id: 'app-logo',
    name: 'Logo Arah Pulau',
    category: 'brand',
    categoryLabel: 'Logo & Brand',
    description: 'Logo utama aplikasi yang tampil di navbar, footer, dan e-tiket.',
    defaultUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <defs>
    <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="36" fill="url(#logoBg)"/>
  <circle cx="80" cy="80" r="56" fill="white" opacity="0.15"/>
  <path d="M 80 32 L 102 75 L 80 66 L 58 75 Z" fill="#ffffff" />
  <path d="M 80 128 L 58 85 L 80 94 L 102 85 Z" fill="#f59e0b" />
  <circle cx="80" cy="80" r="7" fill="#0f172a" />
</svg>`),
    recommendedPresets: [
      {
        label: 'Kompas Tropis Cyan',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <rect width="160" height="160" rx="36" fill="#0891b2"/>
  <circle cx="80" cy="80" r="54" fill="white" opacity="0.15"/>
  <path d="M 80 34 L 100 76 L 80 68 L 60 76 Z" fill="#ffffff"/>
  <path d="M 80 126 L 60 84 L 80 92 L 100 84 Z" fill="#fbbf24"/>
  <circle cx="80" cy="80" r="6" fill="#083344"/>
</svg>`)
      },
      {
        label: 'Ombak Tidung Biru Tua',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <rect width="160" height="160" rx="36" fill="#0f172a"/>
  <circle cx="80" cy="80" r="56" fill="#0284c7" opacity="0.4"/>
  <path d="M 80 36 L 102 76 L 80 68 L 58 76 Z" fill="#38bdf8"/>
  <path d="M 80 124 L 58 84 L 80 92 L 102 84 Z" fill="#34d399"/>
  <circle cx="80" cy="80" r="7" fill="#ffffff"/>
</svg>`)
      }
    ]
  },

  // Popular Packages
  {
    id: 'paket-2d1n-premium',
    name: '2D1N Tidung Premium',
    category: 'package',
    categoryLabel: 'Paket Populer',
    description: 'Foto sampul paket wisata 2 hari 1 malam di beranda dan rincian pemesanan.',
    defaultUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    recommendedPresets: [
      {
        label: 'Cottage Tepi Laut Tidung',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      },
      {
        label: 'Pantai Pasir Putih Tropis',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      },
      {
        label: 'Resort Pulau Pesisir',
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'paket-3d2n-explorer',
    name: '3D2N Tidung Explorer',
    category: 'package',
    categoryLabel: 'Paket Populer',
    description: 'Foto sampul paket petualangan lengkap 3 hari 2 malam di beranda.',
    defaultUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    recommendedPresets: [
      {
        label: 'Snorkeling Air Jernih',
        url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80'
      },
      {
        label: 'Sunset Jembatan Romantis',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      },
      {
        label: 'Perahu Kano Pesisir Karang',
        url: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'homestay-ac-pesisir',
    name: 'Homestay AC Tidung Pesisir',
    category: 'package',
    categoryLabel: 'Penginapan AC',
    description: 'Foto penginapan homestay kamar ber-AC dan dekat pantai.',
    defaultUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    recommendedPresets: [
      {
        label: 'Kamar Homestay Bersih & Rapi',
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      },
      {
        label: 'Teras Penginapan Tepi Pantai',
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },

  {
    id: 'rental-sepeda-ontel',
    name: 'Sewa Sepeda Ontel & Snorkeling',
    category: 'package',
    categoryLabel: 'Aktivitas Pulau',
    description: 'Foto rental sepeda ontel untuk melintasi Jembatan Cinta dan jalan pulau.',
    defaultUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80',
    recommendedPresets: [
      {
        label: 'Sepeda Santai Tepi Pantai',
        url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },

  // 5 Iconic Destinations
  {
    id: 'jembatan-cinta',
    name: 'Jembatan Cinta',
    category: 'destination',
    categoryLabel: 'Spot Ikonik & Sunset',
    description: 'Jembatan ikonik 800m penghubung Pulau Tidung Besar dan Kecil di atas laut toska.',
    defaultUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    recommendedPresets: [
      {
        label: 'Jembatan Melengkung Air Toska',
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'
      },
      {
        label: 'Sunset Spektakuler Jembatan',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  {
    id: 'museum-paus',
    name: 'Museum Paus',
    category: 'destination',
    categoryLabel: 'Edukasi & Sejarah',
    description: 'Museum kerangka utuh ikan paus sperma 12 meter di Pulau Tidung Kecil.',
    defaultUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <rect width="1200" height="800" fill="#1e293b"/>
  <rect x="340" y="80" width="520" height="80" rx="8" fill="#0284c7"/>
  <text x="600" y="130" font-family="sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">MUSEUM IKAN PAUS TIDUNG</text>
  <ellipse cx="600" cy="400" rx="420" ry="80" fill="#f8fafc" opacity="0.9"/>
  <text x="600" y="415" font-family="sans-serif" font-size="36" font-weight="900" fill="#0f172a" text-anchor="middle">KERANGKA PAUS 12 METER</text>
  <text x="600" y="600" font-family="sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Konservasi BKSDA · Pulau Tidung Kecil</text>
</svg>`),
    recommendedPresets: [
      {
        label: 'Ilustrasi Kerangka Paus Lengkap',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <rect width="1200" height="800" fill="#0f172a"/>
  <rect x="300" y="60" width="600" height="90" rx="12" fill="#0369a1"/>
  <text x="600" y="120" font-family="sans-serif" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle">MUSEUM KERANGKA IKAN PAUS</text>
  <path d="M 200 400 Q 600 250 1000 400 Q 600 550 200 400 Z" fill="#e2e8f0"/>
  <circle cx="320" cy="390" r="15" fill="#0f172a"/>
  <text x="600" y="420" font-family="sans-serif" font-size="28" font-weight="bold" fill="#0284c7" text-anchor="middle">PAUS SPERMA 12 METER</text>
  <text x="600" y="650" font-family="sans-serif" font-size="24" fill="#38bdf8" text-anchor="middle">Pulau Tidung Kecil · Kepulauan Seribu</text>
</svg>`)
      }
    ]
  },
  {
    id: 'ternak-ikan-nemo',
    name: 'Ternak Ikan Nemo',
    category: 'destination',
    categoryLabel: 'Snorkeling & Karang',
    description: 'Spot penangkaran dan habitat ikan badut (Nemo) di terumbu karang Karang Beras.',
    defaultUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80',
    recommendedPresets: [
      {
        label: 'Ikan Nemo di Anemon Karang',
        url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        label: 'Terumbu Karang Berwarna-warni',
        url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  {
    id: 'penangkaran-penyu',
    name: 'Penangkaran Penyu',
    category: 'destination',
    categoryLabel: 'Konservasi Satwa',
    description: 'Pusat konservasi dan pelepasan tukik anak penyu sisik di Pulau Tidung Kecil.',
    defaultUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1200&q=80',
    recommendedPresets: [
      {
        label: 'Tukik Penyu Berenang',
        url: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1200&q=80'
      },
      {
        label: 'Penyu Sisik Laut Lepas',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  {
    id: 'homestay-tidung',
    name: 'Homestay Tidung',
    category: 'destination',
    categoryLabel: 'Penginapan Pesisir',
    description: 'Spot penginapan homestay lokal bersih full AC dekat pantai dan dermaga.',
    defaultUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    recommendedPresets: [
      {
        label: 'Bungalow Tropis Nyaman',
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
      },
      {
        label: 'Kamar Bersih Homestay',
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  }
];

const ASSET_EVENT_NAME = 'arahpulau_asset_changed';

/**
 * Get internal localStorage key for asset ID
 */
export const getStorageKeyForAsset = (assetId: string): string => {
  if (assetId === 'app-logo') {
    return 'arahpulau_custom_logo_data';
  }
  if (
    assetId === 'jembatan-cinta' ||
    assetId === 'museum-paus' ||
    assetId === 'ternak-ikan-nemo' ||
    assetId === 'penangkaran-penyu' ||
    assetId === 'homestay-tidung'
  ) {
    return `tidung_custom_photo_${assetId}`;
  }
  return `tidung_custom_package_${assetId}`;
};

/**
 * Retrieve saved custom image (if any)
 */
export const getCustomAssetImage = (assetId: string): string | null => {
  try {
    const key = getStorageKeyForAsset(assetId);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * Get the effective image for an asset: custom if available, else fallback
 */
export const getEffectiveAssetImage = (assetId: string, fallbackUrl?: string): string => {
  const custom = getCustomAssetImage(assetId);
  if (custom) return custom;

  if (fallbackUrl) return fallbackUrl;

  const def = ASSET_DEFINITIONS.find((item) => item.id === assetId);
  return def ? def.defaultUrl : '';
};

/**
 * Save custom image for an asset
 */
export const saveAssetImage = (assetId: string, dataOrUrl: string): void => {
  try {
    const key = getStorageKeyForAsset(assetId);
    localStorage.setItem(key, dataOrUrl);
    window.dispatchEvent(new CustomEvent(ASSET_EVENT_NAME, { detail: { assetId } }));
  } catch (err) {
    console.warn(`Failed to save asset ${assetId} to localStorage`, err);
  }
};

/**
 * Remove custom image (revert to default)
 */
export const removeAssetImage = (assetId: string): void => {
  try {
    const key = getStorageKeyForAsset(assetId);
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(ASSET_EVENT_NAME, { detail: { assetId } }));
  } catch (err) {
    console.warn(`Failed to remove asset ${assetId} from localStorage`, err);
  }
};

/**
 * Reset all customized assets to system defaults
 */
export const resetAllCustomAssets = (): void => {
  try {
    ASSET_DEFINITIONS.forEach((item) => {
      const key = getStorageKeyForAsset(item.id);
      localStorage.removeItem(key);
    });
    window.dispatchEvent(new CustomEvent(ASSET_EVENT_NAME, { detail: { assetId: 'all' } }));
  } catch (err) {
    console.warn('Failed to reset all assets', err);
  }
};

/**
 * Subscribe to asset changes across components
 */
export const subscribeToAssetChanges = (callback: () => void): (() => void) => {
  const handler = () => callback();
  window.addEventListener(ASSET_EVENT_NAME, handler);
  return () => {
    window.removeEventListener(ASSET_EVENT_NAME, handler);
  };
};
