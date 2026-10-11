import React, { useState, useEffect } from 'react';
import { BookingTransaction, TicketOption } from '../types';
import {
  formatRupiah,
  formatDateIndonesian,
  updateBookingStatus,
  deleteBooking,
  getSavedTicketCatalog,
  deleteTicketFromCatalog,
  resetTicketCatalog
} from '../utils/storage';
import {
  X,
  ShieldCheck,
  Lock,
  LogOut,
  CheckCircle,
  Clock,
  Eye,
  Search,
  Check,
  FileText,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Camera,
  Trash2,
  Ticket,
  Package,
  RotateCcw,
  Sparkles,
  MapPin
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingTransaction[];
  onBookingsUpdated: () => void;
  onOpenBookingDetail: (booking: BookingTransaction) => void;
  onOpenAssetManager?: () => void;
  tickets?: TicketOption[];
  onTicketsUpdated?: () => void;
}

const ADMIN_STORAGE_KEY = 'arahpulau_admin_session';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onBookingsUpdated,
  onOpenBookingDetail,
  onOpenAssetManager,
  tickets,
  onTicketsUpdated
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin View Tabs: 'bookings' (E-Tiket & Pesanan) or 'catalog' (Katalog Tiket & Paket)
  const [adminViewMode, setAdminViewMode] = useState<'bookings' | 'catalog'>('bookings');

  // Bookings filter & search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  // Catalog search & state
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');
  const [catalogTickets, setCatalogTickets] = useState<TicketOption[]>(() => {
    return tickets || getSavedTicketCatalog();
  });

  // Deletion modals state
  const [bookingToDelete, setBookingToDelete] = useState<BookingTransaction | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<TicketOption | null>(null);

  // Success notification toast
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Receipt Preview Lightbox
  const [previewReceiptImage, setPreviewReceiptImage] = useState<{
    url: string;
    bookingId: string;
    customerName: string;
  } | null>(null);

  useEffect(() => {
    if (tickets) {
      setCatalogTickets(tickets);
    } else {
      setCatalogTickets(getSavedTicketCatalog());
    }
  }, [tickets, isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === 'admin' || username === 'admin@arahpulau.id') &&
      (password === 'admin' || password === 'tidung2026')
    ) {
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      setIsAdminLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError('Username atau kata sandi admin salah. Gunakan admin / admin.');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAdminLoggedIn(false);
  };

  const handleVerifyBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'CONFIRMED');
    onBookingsUpdated();
    setSuccessMessage(`Pesanan ${bookingId} berhasil diverifikasi lunas.`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleConfirmDeleteBooking = () => {
    if (!bookingToDelete) return;
    const deletedId = bookingToDelete.id;
    deleteBooking(deletedId);
    setBookingToDelete(null);
    onBookingsUpdated();
    setSuccessMessage(`Tiket pesanan ${deletedId} berhasil dihapus dari sistem.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleConfirmDeleteCatalogTicket = () => {
    if (!ticketToDelete) return;
    const deletedName = ticketToDelete.name;
    const updated = deleteTicketFromCatalog(ticketToDelete.id);
    setCatalogTickets(updated);
    setTicketToDelete(null);
    onTicketsUpdated?.();
    setSuccessMessage(`Tiket "${deletedName}" berhasil dihapus dari katalog.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleResetCatalog = () => {
    if (window.confirm('Pulihkan semua tiket bawaan ke daftar awal?')) {
      const reset = resetTicketCatalog();
      setCatalogTickets(reset);
      onTicketsUpdated?.();
      setSuccessMessage('Katalog tiket berhasil dipulihkan ke daftar default.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'pending') {
      if (b.status === 'CONFIRMED') return false;
    } else if (statusFilter === 'confirmed') {
      if (b.status !== 'CONFIRMED') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        b.id.toLowerCase().includes(q) ||
        b.customer.fullName.toLowerCase().includes(q) ||
        b.customer.phone.includes(q) ||
        b.ticketTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter catalog tickets
  const filteredCatalog = catalogTickets.filter((t) => {
    if (catalogSearchQuery.trim()) {
      const q = catalogSearchQuery.toLowerCase().trim();
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const pendingCount = bookings.length - confirmedCount;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ================= IF NOT LOGGED IN: LOGIN VIEW ================= */}
        {!isAdminLoggedIn ? (
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-900 text-cyan-300 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Portal Khusus Admin & Petugas
                  </h2>
                  <p className="text-xs text-slate-500">
                    Wisatawan tidak perlu akun · Akses ini khusus pengelola
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 mb-6 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Informasi Akses Wisatawan</span>
              </p>
              <p className="text-amber-800/90 leading-relaxed text-[11px]">
                Wisatawan dapat memesan langsung tanpa membuat akun dan cukup memasukkan nama & WhatsApp saat booking. Login ini khusus bagi petugas dermaga & admin untuk mengecek bukti transfer, menghapus tiket, dan memvalidasi tiket masuk.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username / ID Petugas
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {loginError}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Panel Admin</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= IF LOGGED IN: ADMIN DASHBOARD ================= */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Top Admin Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black text-white">
                      Dashboard Admin Pengelola
                    </h2>
                    <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Kelola Tiket, Hapus Tiket & Verifikasi Pembayaran
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenAssetManager && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAssetManager();
                    }}
                    title="Menu Kelola & Ganti Gambar Aset"
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Aset Gambar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Keluar dari Admin"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Admin View Mode Switcher: Pesanan Tiket VS Katalog Tiket */}
            <div className="flex items-center border-b border-slate-200 bg-slate-100/90 px-3 sm:px-4 shrink-0 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdminViewMode('bookings')}
                className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer rounded-t-xl ${
                  adminViewMode === 'bookings'
                    ? 'border-cyan-600 text-cyan-950 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Ticket className="w-4 h-4 text-cyan-600" />
                <span>E-Tiket & Pesanan Masuk</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-100 text-cyan-800 font-extrabold">
                  {bookings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminViewMode('catalog')}
                className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer rounded-t-xl ${
                  adminViewMode === 'catalog'
                    ? 'border-cyan-600 text-cyan-950 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Package className="w-4 h-4 text-cyan-600" />
                <span>Katalog Tiket & Paket</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-extrabold">
                  {catalogTickets.length}
                </span>
              </button>
            </div>

            {/* Notification Banner when ticket deleted or verified */}
            {successMessage && (
              <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in fade-in shrink-0">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ================= TAB 1: DAFTAR PESANAN & E-TIKET ================= */}
            {adminViewMode === 'bookings' && (
              <>
                {/* Quick Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 p-3 sm:p-4 bg-slate-100 border-b border-slate-200/80 shrink-0 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-xs">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Total Pesanan
                    </p>
                    <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                      {bookings.length}
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-xs">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Perlu Cek
                    </p>
                    <p className="text-base sm:text-lg font-black text-amber-600 mt-0.5">
                      {pendingCount}
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-xs">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Total Omset
                    </p>
                    <p className="text-xs sm:text-sm font-black text-cyan-700 mt-1 truncate">
                      {formatRupiah(totalRevenue)}
                    </p>
                  </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="p-3 sm:p-4 border-b border-slate-100 bg-white space-y-2.5 shrink-0">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        statusFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Semua ({bookings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('pending')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        statusFilter === 'pending'
                          ? 'bg-white text-amber-700 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Perlu Verifikasi ({pendingCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('confirmed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        statusFilter === 'confirmed'
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Terverifikasi ({confirmedCount})
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari kode booking, nama wisatawan, atau no HP..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Bookings List */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((item) => {
                      const isConfirmed = item.status === 'CONFIRMED';
                      const hasReceipt = Boolean(item.receiptImage);

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-cyan-300 transition-colors space-y-3"
                        >
                          {/* Top Row: Code, Date & Status */}
                          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-xs text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                                  {item.id}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {formatDateIndonesian(item.createdAt)}
                                </span>
                              </div>
                              <h3 className="font-bold text-sm text-slate-900 mt-1">
                                {item.ticketTitle}
                              </h3>
                            </div>

                            <div className="text-right">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isConfirmed
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {isConfirmed ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    <span>TERVERIFIKASI</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    <span>PERLU DICEK</span>
                                  </>
                                )}
                              </span>
                              <p className="text-xs font-black text-slate-900 mt-1">
                                {formatRupiah(item.totalPrice)}
                              </p>
                            </div>
                          </div>

                          {/* Middle: Tourist Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-semibold text-slate-900">
                                {item.customer.fullName}
                              </span>
                              <span className="text-slate-400">({item.passengersCount} Pax)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a
                                href={`https://wa.me/${item.customer.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 hover:underline font-medium"
                              >
                                {item.customer.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{item.customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Berangkat: {item.departureDate}</span>
                            </div>
                          </div>

                          {/* Bottom Row: Receipt Image Preview & Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1">
                            {/* Receipt Thumbnail */}
                            {hasReceipt ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewReceiptImage({
                                    url: item.receiptImage!,
                                    bookingId: item.id,
                                    customerName: item.customer.fullName
                                  })
                                }
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
                              >
                                <img
                                  src={item.receiptImage}
                                  alt="Bukti Transfer"
                                  className="w-5 h-5 rounded object-cover"
                                />
                                <span>Lihat Bukti Transfer</span>
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Belum melampirkan struk (QRIS Otomatis)
                              </span>
                            )}

                            {/* Actions: E-Tiket, Verifikasi, and HAPUS TIKET */}
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenBookingDetail(item);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>E-Tiket</span>
                              </button>

                              {!isConfirmed && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyBooking(item.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Verifikasi Lunas</span>
                                </button>
                              )}

                              {/* Tombol HAPUS TIKET PESANAN */}
                              <button
                                type="button"
                                onClick={() => setBookingToDelete(item)}
                                title="Hapus Tiket / Pesanan ini"
                                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-rose-200 shadow-2xs"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Hapus Tiket</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200/60 p-6">
                      <p className="text-sm font-bold text-slate-700">Tidak ada pesanan ditemukan</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Coba sesuaikan kata kunci pencarian atau tab status
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ================= TAB 2: KELOLA KATALOG TIKET & PAKET ================= */}
            {adminViewMode === 'catalog' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Catalog Top Info & Reset */}
                <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200/80 space-y-2.5 shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Daftar Produk Tiket & Paket di Website
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Admin dapat menghapus tiket yang tidak lagi beroperasi atau habis
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetCatalog}
                      title="Pulihkan semua tiket ke default"
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset Default</span>
                    </button>
                  </div>

                  {/* Catalog Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={catalogSearchQuery}
                      onChange={(e) => setCatalogSearchQuery(e.target.value)}
                      placeholder="Cari nama tiket atau paket di katalog..."
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Catalog Tickets List */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                  {filteredCatalog.length > 0 ? (
                    filteredCatalog.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={t.imageUrl}
                            alt={t.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                                {t.categoryLabel}
                              </span>
                              <span className="text-xs font-extrabold text-cyan-900">
                                {formatRupiah(t.price)}{' '}
                                <span className="text-[10px] font-normal text-slate-400">
                                  {t.priceUnitText}
                                </span>
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                              {t.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {t.description}
                            </p>
                          </div>
                        </div>

                        {/* Features list */}
                        {t.features && t.features.length > 0 && (
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                            <p className="font-semibold text-slate-700">Fasilitas Termasuk:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {t.features.slice(0, 3).map((feat, idx) => (
                                <li key={idx} className="truncate">{feat}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action: Delete Ticket from Catalog */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-[11px] text-slate-400 font-mono">
                            ID: {t.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => setTicketToDelete(t)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-bold border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Hapus Tiket dari Katalog</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200/60 p-6 space-y-3">
                      <p className="text-sm font-bold text-slate-700">Katalog Tiket Kosong</p>
                      <p className="text-xs text-slate-400">
                        Tidak ada tiket yang cocok atau semua tiket telah dihapus dari katalog.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetCatalog}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Pulihkan Tiket Bawaan</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= MODAL KONFIRMASI: HAPUS TIKET PESANAN ================= */}
        {bookingToDelete && (
          <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Hapus Tiket Pesanan?</h3>
                  <p className="text-xs text-slate-500">
                    Tindakan ini permanen dan menghapus pesanan dari sistem
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Kode Booking:</span>
                  <span className="font-mono font-bold text-slate-900">{bookingToDelete.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pemesan:</span>
                  <span className="font-bold text-slate-900">{bookingToDelete.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paket Tiket:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                    {bookingToDelete.ticketTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Biaya:</span>
                  <span className="font-bold text-emerald-700">
                    {formatRupiah(bookingToDelete.totalPrice)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-medium">
                Peringatan: Data E-Tiket, manifes penumpang, dan bukti transfer untuk booking ini akan dihapus permanen.
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setBookingToDelete(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteBooking}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Hapus Tiket</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL KONFIRMASI: HAPUS TIKET DARI KATALOG ================= */}
        {ticketToDelete && (
          <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Hapus Tiket dari Katalog?</h3>
                  <p className="text-xs text-slate-500">
                    Tiket tidak akan muncul lagi di website
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Tiket:</span>
                  <span className="font-bold text-slate-900">{ticketToDelete.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori:</span>
                  <span className="font-semibold text-slate-800">{ticketToDelete.categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Harga:</span>
                  <span className="font-bold text-cyan-800">{formatRupiah(ticketToDelete.price)}</span>
                </div>
              </div>

              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                Tiket ini akan dihapus dari pilihan booking wisatawan. Anda dapat memulihkannya kembali kapan saja melalui tombol "Reset Default".
              </p>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTicketToDelete(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteCatalogTicket}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Hapus Tiket</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox Modal for Receipt Image */}
        {previewReceiptImage && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
            <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-700">
              <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">
                    Bukti Transfer: {previewReceiptImage.bookingId}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Pemesan: {previewReceiptImage.customerName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewReceiptImage(null)}
                  className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-center bg-black/50 max-h-[70vh] overflow-auto">
                <img
                  src={previewReceiptImage.url}
                  alt="Bukti Transfer Penuh"
                  className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-md"
                />
              </div>

              <div className="p-3 bg-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => setPreviewReceiptImage(null)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer"
                >
                  Tutup Tampilan Bukti
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
