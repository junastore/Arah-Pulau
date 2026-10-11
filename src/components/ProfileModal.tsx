import React from 'react';
import { X, User, Ticket, Phone, Clock, ChevronRight } from 'lucide-react';
import { BookingTransaction } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingTransaction[];
  onOpenInbox: () => void;
  onOpenSchedule: () => void;
  onOpenAdmin?: () => void;
  onOpenAssetManager?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onOpenInbox,
  onOpenSchedule
}) => {
  if (!isOpen) return null;

  const latestBooking = bookings[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#00758f] via-[#0284a8] to-[#0284c7] p-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 mt-1">
            <div className="w-13 h-13 rounded-full bg-white text-cyan-800 flex items-center justify-center shadow-md shrink-0">
              <User className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {latestBooking?.customer.fullName || 'Wisatawan Tidung'}
              </h2>
              <div className="mt-1 inline-flex items-center gap-1 bg-emerald-500/30 border border-emerald-400/40 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-100">
                <span>Pemesanan Bebas Akun</span>
              </div>
              <p className="text-[11px] text-cyan-100 mt-0.5">
                Pesan tiket instan tanpa registrasi
              </p>
            </div>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 space-y-2.5">
          {/* E-Tiket Status Card */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenInbox();
            }}
            className="w-full bg-slate-50 hover:bg-cyan-50/60 p-3 rounded-2xl border border-slate-200/70 flex items-center justify-between transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-800">
                  E-Tiket Saya di Perangkat Ini
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {bookings.length > 0
                    ? `${bookings.length} tiket tersimpan`
                    : 'Belum ada tiket aktif'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-700" />
          </button>

          {/* Schedule Card */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSchedule();
            }}
            className="w-full bg-slate-50 hover:bg-cyan-50/60 p-3 rounded-2xl border border-slate-200/70 flex items-center justify-between transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-800">
                  Jadwal Kapal Penyeberangan
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Marina Ancol & Pelabuhan Kali Adem
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-700" />
          </button>

          {/* WhatsApp CS Card */}
          <a
            href="https://wa.me/6281289998438"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-slate-50 hover:bg-emerald-50/60 p-3 rounded-2xl border border-slate-200/70 flex items-center justify-between transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                  Bantuan WhatsApp CS 24/7
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bantuan reservasi & panduan dermaga
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
          </a>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Wisata Pulau Tidung</span>
          <button
            type="button"
            onClick={onClose}
            className="text-cyan-700 font-bold hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
