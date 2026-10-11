import React from 'react';
import { Home, Compass, ShoppingBag, ShieldCheck } from 'lucide-react';

export type TabType = 'home' | 'explore' | 'booking' | 'profile';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  bookingCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  bookingCount = 0
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'explore' as TabType, label: 'Explore', icon: Compass },
    { id: 'booking' as TabType, label: 'Booking', icon: ShoppingBag, badge: bookingCount },
    { id: 'profile' as TabType, label: 'Admin', icon: ShieldCheck }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[64px] transition-all cursor-pointer ${
                isActive ? 'text-cyan-700 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-cyan-700 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-cyan-700' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-cyan-700 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
