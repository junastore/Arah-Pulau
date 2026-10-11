import React from 'react';
import { BookingTransaction, TicketOption } from '../types';
import { formatRupiah } from '../utils/storage';
import { Ticket, Calendar, MapPin, QrCode, ArrowRight, Search, Clock, PlusCircle } from 'lucide-react';

interface BookingTabContentProps {
  bookings: BookingTransaction[];
  onOpenBookingModal: (ticket?: TicketOption) => void;
  onOpenBookingDetail: (booking: BookingTransaction) => void;
  onOpenLookup: () => void;
  onOpenSchedule: () => void;
}

export const BookingTabContent: React.FC<BookingTabContentProps> = ({
  bookings,
  onOpenBookingModal,
  onOpenBookingDetail,
  onOpenLookup,
  onOpenSchedule
}) => {
  return (
    <div className="px-5 py-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Tiket & Reservasi Saya
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola e-tiket resmi dan riwayat perjalanan Anda
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLookup}
          title="Cari Kode Booking"
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer border border-slate-200"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Guest Notice */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-emerald-900">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span><strong>Tanpa Perlu Akun:</strong> Cukup tunjukkan kode booking atau QR e-tiket kepada petugas loket dermaga saat check-in.</span>
      </div>

      {/* Bookings List or Empty State */}
      {bookings.length > 0 ? (
        <div className="space-y-3.5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => onOpenBookingDetail(booking)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                    {booking.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5 group-hover:text-cyan-700 transition-colors">
                    {booking.ticketTitle}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    LUNAS
                  </span>
                  <p className="text-xs font-extrabold text-cyan-700 mt-1">
                    {formatRupiah(booking.totalPrice)}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.departureDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[130px]">{booking.departurePort}</span>
                </div>

                <span className="font-semibold text-cyan-600 flex items-center gap-1">
                  <span>Lihat E-Tiket</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => onOpenBookingModal()}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-700" />
            <span>Pesan Tiket / Paket Baru</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-7 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900">
              Belum Ada E-Tiket
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Pesan tiket kapal penyeberangan, paket wisata all-in, atau homestay AC sekarang untuk mendapatkan konfirmasi instan!
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenBookingModal()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pesan Tiket Wisata Sekarang</span>
          </button>
        </div>
      )}

      {/* Quick Utilities */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onOpenSchedule}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-300 transition-colors text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-900">Jadwal Kapal</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Marina & Kali Adem</p>
        </button>

        <button
          type="button"
          onClick={onOpenLookup}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-300 transition-colors text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2">
            <QrCode className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-900">Cek E-Tiket</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Dengan Kode Booking</p>
        </button>
      </div>
    </div>
  );
};
