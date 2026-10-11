import React from 'react';
import { Palmtree, Home, Image as ImageIcon } from 'lucide-react';

// Custom swimming pool ladder icon matching the screenshot
const PoolLadderIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Left rail */}
    <path d="M7 3v12" />
    {/* Right rail */}
    <path d="M17 3v12" />
    {/* Steps / rungs */}
    <line x1="7" y1="7" x2="17" y2="7" />
    <line x1="7" y1="11" x2="17" y2="11" />
    {/* Water waves at bottom */}
    <path d="M4 17c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0" />
    <path d="M4 21c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0" />
  </svg>
);

export type CategoryFilter = 'all' | 'paket' | 'penginapan' | 'galeri' | 'aktivitas';

interface CategoryShortcutsProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
}

export const CategoryShortcuts: React.FC<CategoryShortcutsProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories = [
    {
      id: 'paket' as CategoryFilter,
      label: 'Paket',
      icon: Palmtree,
      bg: 'bg-[#dbeafe]',
      textColor: 'text-[#0284c7]',
      ringColor: 'ring-blue-300'
    },
    {
      id: 'penginapan' as CategoryFilter,
      label: 'Penginapan',
      icon: Home,
      bg: 'bg-[#ffedd5]',
      textColor: 'text-[#ea580c]',
      ringColor: 'ring-orange-300'
    },
    {
      id: 'galeri' as CategoryFilter,
      label: 'Galeri',
      icon: ImageIcon,
      bg: 'bg-[#ccfbf1]',
      textColor: 'text-[#0d9488]',
      ringColor: 'ring-teal-300'
    },
    {
      id: 'aktivitas' as CategoryFilter,
      label: 'Aktivitas',
      icon: PoolLadderIcon,
      bg: 'bg-[#f3e8ff]',
      textColor: 'text-[#9333ea]',
      ringColor: 'ring-purple-300'
    }
  ];

  return (
    <div className="px-5 py-5">
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-sm mx-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (selectedCategory === cat.id) {
                  onSelectCategory('all');
                } else {
                  onSelectCategory(cat.id);
                }
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${cat.bg} ${cat.textColor} flex items-center justify-center shadow-xs transition-all duration-200 group-hover:scale-105 group-active:scale-95 ${
                  isSelected ? `ring-3 ${cat.ringColor} shadow-md` : ''
                }`}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
              </div>
              <span className={`text-xs mt-2 text-center tracking-tight ${
                isSelected ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
              }`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
