import React, { useState } from 'react';
import { BookingTransaction } from '../types';
import { formatRupiah, formatDateIndonesian, updateBookingReceipt } from '../utils/storage';
import {
  X,
  CheckCircle2,
  Mail,
  Printer,
  Calendar,
  MapPin,
  QrCode,
  Send,
  Users,
  ExternalLink,
  ShieldCheck,
  Download,
  FileCheck,
  Maximize2,
  Eye,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { ReceiptUploadZone, ReceiptData } from './ReceiptUploadZone';

interface EmailNotificationModalProps {
  booking: BookingTransaction;
  onClose: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  booking: initialBooking,
  onClose
}) => {
  const [booking, setBooking] = useState<BookingTransaction>(initialBooking);
  const [activeTab, setActiveTab] = useState<'email' | 'ticket' | 'receipt'>('email');
  const [resending, setResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const [zoomReceipt, setZoomReceipt] = useState<boolean>(false);

  const handleResendEmail = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3500);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReceiptChange = (receiptData: ReceiptData | null) => {
    if (receiptData) {
      const updated = updateBookingReceipt(booking.id, {
        receiptImage: receiptData.dataUrl,
        receiptFileName: receiptData.fileName,
        receiptUploadedAt: new Date().toISOString()
      });
      if (updated) {
        setBooking(updated);
      }
    } else {
      const updated = updateBookingReceipt(booking.id, {
        receiptImage: '',
        receiptFileName: '',
        receiptUploadedAt: ''
      });
      if (updated) {
        setBooking({
          ...booking,
          receiptImage: undefined,
          receiptFileName: undefined,
          receiptUploadedAt: undefined
        });
      }
    }
  };

  const mailtoLink = `mailto:${booking.customer.email}?subject=${encodeURIComponent(
    `[E-TIKET RESMI] Konfirmasi Wisata Pulau Tidung #${booking.id}`
  )}&body=${encodeURIComponent(
    `Halo ${booking.customer.fullName},\n\nTerima kasih atas pemesanan Anda di Arah Pulau!\n\nKode Booking: ${booking.id}\nPaket/Tiket: ${booking.ticketTitle}\nTanggal: ${booking.departureDate}\nPelabuhan: ${booking.departurePort}\nJumlah Wisatawan: ${booking.passengersCount} Orang\nTotal Lunas: ${formatRupiah(booking.totalPrice)}\nStatus Bukti Transaksi: ${booking.receiptImage ? 'Terlampir & Terverifikasi' : 'Verifikasi Otomatis'}\n\nSilakan tunjukkan tiket digital ini di dermaga.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wide truncate">
                  Lunas & Terverifikasi
                </span>
                <span className="text-white/40">·</span>
                <span className="text-[11px] sm:text-xs font-mono text-slate-300">#{booking.id}</span>
              </div>
              <h2 className="text-sm sm:text-lg font-bold text-white truncate">
                E-Tiket Telah Dikirim ke Email Anda
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Notification Alert Banner */}
        <div className="bg-emerald-50 px-3.5 sm:px-6 py-2.5 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="truncate">
              Dikirim ke: <strong className="font-bold underline">{booking.customer.email}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="text-[11px] sm:text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{resending ? 'Mengirim...' : 'Kirim Ulang'}</span>
            </button>
            <span className="text-emerald-300">|</span>
            <a
              href={mailtoLink}
              className="text-[11px] sm:text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Buka Mail</span>
            </a>
          </div>
        </div>

        {resendSuccess && (
          <div className="bg-teal-600 text-white text-xs font-semibold py-2 px-4 text-center shrink-0">
            ✓ Email konfirmasi dan tiket berhasil dikirim ulang ke {booking.customer.email}!
          </div>
        )}

        {/* View Toggle Bar */}
        <div className="bg-slate-50 px-3.5 sm:px-6 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('email')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Format Email Masuk
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'ticket'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              E-Tiket Boarding
            </button>
            <button
              onClick={() => setActiveTab('receipt')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'receipt'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Bukti Transaksi</span>
              {booking.receiptImage ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
              ) : null}
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-700" />
            <span>Cetak / PDF</span>
          </button>
        </div>

        {/* Content View */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 bg-slate-100">
          {activeTab === 'email' ? (
            /* Email Interface Preview */
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
              {/* Email Client Top Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-500">
                  <div className="truncate">
                    <span className="font-semibold text-slate-700">Pengirim:</span> Arah Pulau Official &lt;tiket@arahpulau.id&gt;
                  </div>
                  <span className="font-mono text-slate-400 shrink-0 ml-2">
                    {new Date(booking.emailSentAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} WIB
                  </span>
                </div>
                <div className="text-slate-500 truncate">
                  <span className="font-semibold text-slate-700">Penerima:</span> {booking.customer.fullName} &lt;{booking.customer.email}&gt;
                </div>
                <div className="text-slate-900 font-bold pt-1 border-t border-slate-200 truncate">
                  Subjek: [E-TIKET RESMI] Konfirmasi Wisata Pulau Tidung - #{booking.id}
                </div>
              </div>

              {/* Email Content Body */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">
                    Halo {booking.customer.fullName},
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Pembayaran pemesanan tiket wisata Pulau Tidung Anda telah kami terima secara penuh. Berikut adalah e-tiket resmi yang dapat ditunjukkan di dermaga saat boarding.
                  </p>
                </div>

                {/* Ticket Details Box */}
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] sm:text-[11px] font-bold text-cyan-700 uppercase tracking-wide">
                      Kode Reservasi
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-wider">
                      {booking.id}
                    </div>
                    <p className="text-xs text-emerald-700 font-bold">
                      STATUS: LUNAS & TERKONFIRMASI
                    </p>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex flex-col items-center shrink-0">
                    <div className="w-24 h-24 bg-slate-900 rounded flex items-center justify-center text-white text-[10px] font-mono text-center p-1">
                      <div className="space-y-1">
                        <QrCode className="w-12 h-12 mx-auto text-white" />
                        <span className="text-[8px] block">VALID TICKET</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">Scan saat boarding</span>
                  </div>
                </div>

                {/* Itinerary Specs */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Paket / Layanan</span>
                    <strong className="text-slate-900 text-xs sm:text-sm block mt-0.5 truncate">{booking.ticketTitle}</strong>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Tanggal Berangkat</span>
                    <strong className="text-slate-900 text-xs sm:text-sm block mt-0.5">{formatDateIndonesian(booking.departureDate)}</strong>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Titik Berangkat</span>
                    <strong className="text-slate-900 text-xs sm:text-sm block mt-0.5 truncate">{booking.departurePort}</strong>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Jumlah Wisatawan</span>
                    <strong className="text-slate-900 text-xs sm:text-sm block mt-0.5">{booking.passengersCount} Orang</strong>
                  </div>
                </div>

                {/* Payment & Receipt Status Row */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Metode Pembayaran:</span>
                    <strong className="text-slate-900">{booking.paymentMethod}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.receiptImage ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab('receipt')}
                        className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Bukti Pembayaran Terlampir</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTab('receipt')}
                        className="px-2.5 py-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Lampirkan Bukti Transfer</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact Guide */}
                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="text-cyan-800 font-bold block">Pemandu / Nahkoda Tidung:</span>
                    <span className="text-cyan-950 font-semibold">{booking.tourGuideName}</span>
                  </div>
                  <a
                    href={`https://wa.me/6281289998438`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shrink-0"
                  >
                    Hubungi WA
                  </a>
                </div>
              </div>
            </div>
          ) : activeTab === 'ticket' ? (
            /* Boarding Pass Format */
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-4 sm:p-6 space-y-4 shadow-sm text-slate-800">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-slate-900">
                    BOARDING PASS RESMI
                  </h3>
                  <p className="text-xs text-slate-500">Arah Pulau — Pelayaran Wisata Kepulauan Seribu</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-cyan-800 block">#{booking.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    LUNAS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">NAMA WISATAWAN</span>
                  <strong className="text-slate-900">{booking.customer.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">NIK / NO. KTP</span>
                  <strong className="text-slate-900 font-mono">{booking.customer.idCardNumber || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">KOTA ASAL / DOMISILI</span>
                  <strong className="text-slate-900">{booking.customer.city || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">TANGGAL BERANGKAT</span>
                  <strong className="text-slate-900">{booking.departureDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">JUMLAH WISATAWAN</span>
                  <strong className="text-slate-900">{booking.passengersCount} Orang</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">TOTAL BIAYA</span>
                  <strong className="text-cyan-800 font-black">{formatRupiah(booking.totalPrice)}</strong>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-slate-400 text-[10px] block">DERMAGA KEBERANGKATAN</span>
                  <strong className="text-slate-900">{booking.departurePort}</strong>
                </div>
              </div>

              {booking.receiptImage && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Bukti Transaksi Resmi: <strong>{booking.receiptFileName || 'Struk Pembayaran'}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('receipt')}
                    className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                  >
                    Lihat Bukti
                  </button>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <QrCode className="w-16 h-16 mx-auto text-slate-900" />
                <p className="font-mono text-[10px] text-slate-500">{booking.qrCodeData}</p>
                <p className="text-[10px] text-slate-400">Tunjukkan barcode ini kepada petugas loket dermaga</p>
              </div>
            </div>
          ) : (
            /* TAB 3: BUKTI TRANSAKSI */
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-5 shadow-sm text-slate-800">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-cyan-700" />
                    <span>Bukti Transaksi & Struk Pembayaran</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bukti pembayaran untuk Kode Booking #{booking.id} ({formatRupiah(booking.totalPrice)})
                  </p>
                </div>

                {booking.receiptImage && (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terverifikasi</span>
                  </span>
                )}
              </div>

              {booking.receiptImage ? (
                /* Stored Receipt View */
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
                    <img
                      src={booking.receiptImage}
                      alt="Bukti Transaksi Resmi"
                      className="w-full max-h-[380px] object-contain mx-auto"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setZoomReceipt(true)}
                        className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer hover:bg-slate-100"
                      >
                        <Maximize2 className="w-4 h-4 text-cyan-700" />
                        <span>Perbesar Layar Penuh</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Nama Dokumen:</span>
                      <strong className="text-slate-800 font-semibold">{booking.receiptFileName || 'bukti-transaksi.jpg'}</strong>
                    </div>
                    {booking.receiptUploadedAt && (
                      <div>
                        <span className="text-slate-500 block text-[11px]">Waktu Diunggah:</span>
                        <strong className="text-slate-800 font-semibold">
                          {new Date(booking.receiptUploadedAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} WIB
                        </strong>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <a
                        href={booking.receiptImage}
                        download={`bukti-bayar-${booking.id}.jpg`}
                        className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Struk</span>
                      </a>
                    </div>
                  </div>

                  {/* Option to replace/update */}
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Ingin mengganti foto bukti transaksi dengan yang baru?
                    </p>
                    <ReceiptUploadZone
                      receipt={null}
                      onReceiptChange={handleReceiptChange}
                    />
                  </div>
                </div>
              ) : (
                /* No receipt yet: Allow uploading */
                <div className="space-y-4">
                  <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs text-cyan-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-700" />
                      <span>Belum ada bukti transaksi yang dilampirkan</span>
                    </p>
                    <p className="text-cyan-800 leading-relaxed">
                      Anda dapat mengunggah screenshot bukti transfer atau struk m-Banking sekarang untuk mempermudah pengecekan langsung oleh petugas tiket di dermaga.
                    </p>
                  </div>

                  <ReceiptUploadZone
                    receipt={null}
                    onReceiptChange={handleReceiptChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Zoom for Receipt in Modal */}
      {zoomReceipt && booking.receiptImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setZoomReceipt(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <span className="text-xs font-bold truncate">
                Bukti Pembayaran #{booking.id} — {booking.customer.fullName}
              </span>
              <button
                onClick={() => setZoomReceipt(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex-1 flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={booking.receiptImage}
                alt="Bukti Bayar Fullsize"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <span>Total Tagihan: {formatRupiah(booking.totalPrice)}</span>
              <a
                href={booking.receiptImage}
                download={`bukti-bayar-${booking.id}.jpg`}
                className="px-3 py-1 bg-cyan-700 text-white font-bold rounded-lg hover:bg-cyan-800 cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan Gambar</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
