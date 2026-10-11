/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MobileHeader } from './components/MobileHeader';
import { CategoryShortcuts, CategoryFilter } from './components/CategoryShortcuts';
import { PopularPackagesSection } from './components/PopularPackagesSection';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { BookingTabContent } from './components/BookingTabContent';
import { ProfileModal } from './components/ProfileModal';
import { DestinationList } from './components/DestinationList';
import { TicketSection } from './components/TicketSection';
import { BookingModal } from './components/BookingModal';
import { EmailNotificationModal } from './components/EmailNotificationModal';
import { EmailInboxDrawer } from './components/EmailInboxDrawer';
import { FerryScheduleModal } from './components/FerryScheduleModal';
import { TicketLookupModal } from './components/TicketLookupModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { IslandGuideSection } from './components/IslandGuideSection';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AssetManagerModal } from './components/AssetManagerModal';

import {
  TIDUNG_DESTINATIONS,
  TIDUNG_TICKETS
} from './data/tidungData';
import {
  DestinationItem,
  TicketOption,
  BookingTransaction
} from './types';
import { getSavedBookings, getSavedTicketCatalog } from './utils/storage';
import { Mail, ArrowRight, Ship, Clock, Check, Sparkles, Filter, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [passengers, setPassengers] = useState<number>(2);

  // Saved bookings (persisted in localStorage)
  const [bookings, setBookings] = useState<BookingTransaction[]>([]);

  // Tickets catalog (persisted in localStorage, managed by Admin)
  const [tickets, setTickets] = useState<TicketOption[]>(() => getSavedTicketCatalog());

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedTicketForBooking, setSelectedTicketForBooking] = useState<TicketOption | null>(null);

  const [activeCompletedBooking, setActiveCompletedBooking] = useState<BookingTransaction | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isInboxOpen, setIsInboxOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false);
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState<boolean>(false);
  const [selectedAssetForManager, setSelectedAssetForManager] = useState<string | undefined>(undefined);

  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [isDestinationDetailOpen, setIsDestinationDetailOpen] = useState<boolean>(false);

  const handleOpenAssetManager = (assetId?: string) => {
    setSelectedAssetForManager(assetId);
    setIsAssetManagerOpen(true);
  };

  // Notification toast
  const [recentNotificationToast, setRecentNotificationToast] = useState<{
    id: string;
    email: string;
    booking: BookingTransaction;
  } | null>(null);

  // Load bookings and tickets catalog on mount
  useEffect(() => {
    const loaded = getSavedBookings();
    setBookings(loaded);
    setTickets(getSavedTicketCatalog());
  }, []);

  // Filtered packages based on search query & selected category
  const filteredPackages = useMemo(() => {
    let list = tickets;

    if (selectedCategory === 'paket') {
      list = list.filter((t) => t.category === 'paket-wisata');
    } else if (selectedCategory === 'penginapan') {
      list = list.filter((t) => t.category === 'homestay');
    } else if (selectedCategory === 'aktivitas') {
      list = list.filter((t) => t.category === 'aktivitas' || t.category === 'sewa');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categoryLabel.toLowerCase().includes(q)
      );
    }

    return list;
  }, [tickets, selectedCategory, searchQuery]);

  // Filtered destinations based on search query & category
  const filteredDestinations = useMemo(() => {
    let list = TIDUNG_DESTINATIONS;

    if (selectedCategory === 'galeri') {
      // Show all spots
      list = TIDUNG_DESTINATIONS;
    } else if (selectedCategory === 'penginapan') {
      list = list.filter((d) => d.category === 'homestay');
    } else if (selectedCategory === 'aktivitas') {
      list = list.filter((d) => d.category === 'nemo' || d.category === 'spot-ikonik');
    }

    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.shortDesc.toLowerCase().includes(term) ||
          d.categoryLabel.toLowerCase().includes(term) ||
          d.tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Open booking modal with preselected ticket
  const handleOpenBooking = (ticket?: TicketOption) => {
    setSelectedTicketForBooking(ticket || tickets[0] || TIDUNG_TICKETS[0]);
    setIsBookingOpen(true);
  };

  // When user clicks "Lihat Detail" on destination
  const handleSelectDestination = (dest: DestinationItem) => {
    setSelectedDestination(dest);
    setIsDestinationDetailOpen(true);
  };

  const handleBookRelatedTicket = (dest: DestinationItem) => {
    let targetTicket: TicketOption | undefined;
    if (dest.category === 'homestay') {
      targetTicket = tickets.find((t) => t.id === 'homestay-ac-pesisir') || tickets[0];
    } else if (dest.category === 'nemo') {
      targetTicket = tickets.find((t) => t.id === 'paket-2d1n-premium') || tickets[0];
    } else {
      targetTicket = tickets[0] || TIDUNG_TICKETS[0];
    }
    handleOpenBooking(targetTicket);
  };

  // When payment is finished: Trigger email notification modal
  const handleBookingSuccess = (newBooking: BookingTransaction) => {
    setBookings((prev) => [newBooking, ...prev.filter((b) => b.id !== newBooking.id)]);
    setIsBookingOpen(false);
    setActiveCompletedBooking(newBooking);
    setIsEmailModalOpen(true);

    // Toast alert
    setRecentNotificationToast({
      id: newBooking.id,
      email: newBooking.customer.email,
      booking: newBooking
    });
    setTimeout(() => {
      setRecentNotificationToast(null);
    }, 7000);
  };

  const handleBottomTabChange = (tab: TabType) => {
    if (tab === 'profile') {
      setIsAdminOpen(true);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col items-center antialiased selection:bg-cyan-600 selection:text-white">
      {/* Smartphone-width container matching user's requested mobile layout */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 relative shadow-2xl border-x border-slate-200/80 pb-20 flex flex-col justify-between">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Toast alert after transaction completion */}
          {recentNotificationToast && (
            <div className="fixed top-4 left-4 right-4 max-w-sm mx-auto z-50 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-top-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-white">E-Tiket Terkirim ke Email!</p>
                <p className="text-slate-300 mt-0.5">
                  Terkirim ke: <strong className="text-cyan-300">{recentNotificationToast.email}</strong>
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveCompletedBooking(recentNotificationToast.booking);
                      setIsEmailModalOpen(true);
                      setRecentNotificationToast(null);
                    }}
                    className="font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>Lihat Tiket</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setRecentNotificationToast(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 1: HOME ================= */}
          {activeTab === 'home' && (
            <main>
              {/* Header: Greeting, User Avatar & Search Bar */}
              <MobileHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={() => {}}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenAssetManager={() => handleOpenAssetManager()}
              />

              {/* Category Shortcuts: Paket, Penginapan, Galeri, Aktivitas */}
              <CategoryShortcuts
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Active Filter Banner if category or search query selected */}
              {(selectedCategory !== 'all' || searchQuery.trim()) && (
                <div className="mx-5 mb-3 p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center justify-between text-xs text-cyan-900">
                  <div className="flex items-center gap-1.5 truncate">
                    <Filter className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                    <span className="truncate">
                      Filter: <strong>{selectedCategory !== 'all' ? selectedCategory.toUpperCase() : ''}</strong> {searchQuery ? `"${searchQuery}"` : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-cyan-700 hover:text-cyan-900 font-bold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              )}

              {/* Section: Paket Populer (2D1N Tidung Premium, 3D2N Tidung Explorer, etc.) */}
              <PopularPackagesSection
                packages={filteredPackages}
                onSelectPackage={handleOpenBooking}
                onViewAll={() => setActiveTab('explore')}
                onOpenAssetManager={handleOpenAssetManager}
              />

              {/* Section: Destinasi & Rekomendasi Spot */}
              <div className="mt-6">
                <DestinationList
                  destinations={filteredDestinations}
                  onSelectDestination={handleSelectDestination}
                  onOpenAssetManager={handleOpenAssetManager}
                />
              </div>

              {/* Section: Panduan & Tips Pulau Tidung */}
              <div className="mt-2 mb-4">
                <IslandGuideSection />
              </div>
            </main>
          )}

          {/* ================= TAB 2: EXPLORE ================= */}
          {activeTab === 'explore' && (
            <main className="py-4">
              <div className="px-5 mb-4">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Eksplorasi Pulau Tidung
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  5 Spot Pilihan & Tiket Penyeberangan Resmi
                </p>
              </div>

              {/* Destination list with photo upload & detail modals */}
              <DestinationList
                destinations={filteredDestinations}
                onSelectDestination={handleSelectDestination}
                onOpenAssetManager={handleOpenAssetManager}
              />

              {/* All Tickets & Tour Packages */}
              <TicketSection
                tickets={tickets}
                onSelectTicket={handleOpenBooking}
              />

              <div className="mb-4">
                <IslandGuideSection />
              </div>
            </main>
          )}

          {/* ================= TAB 3: BOOKING ================= */}
          {activeTab === 'booking' && (
            <main className="mb-4">
              <BookingTabContent
                bookings={bookings}
                onOpenBookingModal={handleOpenBooking}
                onOpenBookingDetail={(b) => {
                  setActiveCompletedBooking(b);
                  setIsEmailModalOpen(true);
                }}
                onOpenLookup={() => setIsLookupOpen(true)}
                onOpenSchedule={() => setIsScheduleOpen(true)}
              />
            </main>
          )}
        </div>

        {/* ================= FIXED BOTTOM NAVIGATION BAR ================= */}
        <BottomNavBar
          activeTab={activeTab}
          onChangeTab={handleBottomTabChange}
          bookingCount={bookings.length}
        />
      </div>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Profile / Tourist Menu Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        bookings={bookings}
        onOpenInbox={() => setIsInboxOpen(true)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenAdmin={() => {
          setIsProfileOpen(false);
          setIsAdminOpen(true);
        }}
        onOpenAssetManager={() => handleOpenAssetManager()}
      />

      {/* Admin Panel Modal (Exclusive Login & Verification) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        bookings={bookings}
        onBookingsUpdated={() => {
          const updated = getSavedBookings();
          setBookings(updated);
        }}
        onOpenBookingDetail={(b) => {
          setActiveCompletedBooking(b);
          setIsEmailModalOpen(true);
        }}
        onOpenAssetManager={() => {
          setIsAdminOpen(false);
          handleOpenAssetManager();
        }}
        tickets={tickets}
        onTicketsUpdated={() => {
          setTickets(getSavedTicketCatalog());
        }}
      />

      {/* Booking Modal with Payment & Upload Bukti Transaksi */}
      {isBookingOpen && (
        <BookingModal
          initialTicket={selectedTicketForBooking}
          initialDate={selectedDate}
          initialPassengers={passengers}
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Email Notification & E-Ticket Preview Modal */}
      {isEmailModalOpen && activeCompletedBooking && (
        <EmailNotificationModal
          booking={activeCompletedBooking}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}

      {/* Email Inbox Drawer */}
      {isInboxOpen && (
        <EmailInboxDrawer
          bookings={bookings}
          onClose={() => setIsInboxOpen(false)}
          onOpenBookingDetail={(b) => {
            setIsInboxOpen(false);
            setActiveCompletedBooking(b);
            setIsEmailModalOpen(true);
          }}
        />
      )}

      {/* Ferry Timetable Modal */}
      {isScheduleOpen && (
        <FerryScheduleModal
          onClose={() => setIsScheduleOpen(false)}
          onBookFerry={() => {
            setIsScheduleOpen(false);
            handleOpenBooking(tickets[0] || TIDUNG_TICKETS[0]);
          }}
        />
      )}

      {/* Ticket Lookup Modal */}
      {isLookupOpen && (
        <TicketLookupModal
          bookings={bookings}
          onClose={() => setIsLookupOpen(false)}
          onSelectBooking={(b) => {
            setIsLookupOpen(false);
            setActiveCompletedBooking(b);
            setIsEmailModalOpen(true);
          }}
        />
      )}

      {/* Destination Story Detail Modal */}
      {isDestinationDetailOpen && selectedDestination && (
        <DestinationDetailModal
          destination={selectedDestination}
          onClose={() => setIsDestinationDetailOpen(false)}
          onBookRelatedTicket={handleBookRelatedTicket}
        />
      )}

      {/* Asset Image Manager Modal (Mudah Ganti Logo, Foto Paket & Destinasi) */}
      <AssetManagerModal
        isOpen={isAssetManagerOpen}
        onClose={() => {
          setIsAssetManagerOpen(false);
          setSelectedAssetForManager(undefined);
        }}
        initialSelectedAssetId={selectedAssetForManager}
      />
    </div>
  );
}
