import React, { useState, useEffect } from 'react';
import { TicketOption, BookingTransaction } from '../types';
import { TIDUNG_TICKETS } from '../data/tidungData';
import { formatRupiah, generateBookingId, saveBooking } from '../utils/storage';
import {
  X,
  Calendar,
  Users,
  MapPin,
  Mail,
  User,
  Phone,
  QrCode,
  Building,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Copy,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Lock,
  FileText
} from 'lucide-react';
import { QrisPaymentCard } from './QrisPaymentCard';
import { ReceiptUploadZone, ReceiptData } from './ReceiptUploadZone';

interface BookingModalProps {
  initialTicket?: TicketOption | null;
  initialDate?: string;
  initialPassengers?: number;
  onClose: () => void;
  onBookingSuccess: (booking: BookingTransaction) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  initialTicket,
  initialDate,
  initialPassengers = 2,
  onClose,
  onBookingSuccess
}) => {
  // Step: 1 = Form Details, 2 = Payment View
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    initialTicket?.id || TIDUNG_TICKETS[0].id
  );
  const [departureDate, setDepartureDate] = useState<string>(
    initialDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [passengers, setPassengers] = useState<number>(initialPassengers || 2);

  // Mandatory Customer Biodata
  const [fullName, setFullName] = useState<string>('');
  const [idCardNumber, setIdCardNumber] = useState<string>('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan' | ''>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Form Field Validation Errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va'>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri'>('bca');
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Countdown timer for Step 2
  const [paymentTimeLeft, setPaymentTimeLeft] = useState<number>(15 * 60);

  // Copy helpers
  const [copiedVaNumber, setCopiedVaNumber] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [showVaGuide, setShowVaGuide] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 2) {
      timer = setInterval(() => {
        setPaymentTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep]);

  const selectedTicket =
    TIDUNG_TICKETS.find((t) => t.id === selectedTicketId) || TIDUNG_TICKETS[0];

  const totalPrice = selectedTicket.price * passengers;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getVaDetails = () => {
    switch (selectedBank) {
      case 'bca':
        return {
          bankName: 'BCA Virtual Account',
          vaNumber: '80777 081289998438',
          rawNumber: '80777081289998438',
          name: 'JB JUNA SHOP / TIDUNG TRIP'
        };
      case 'mandiri':
        return {
          bankName: 'Mandiri Virtual Account',
          vaNumber: '88908 081289998438',
          rawNumber: '88908081289998438',
          name: 'JB JUNA SHOP / TIDUNG TRIP'
        };
      case 'bri':
        return {
          bankName: 'BRI BRIVA',
          vaNumber: '12800 081289998438',
          rawNumber: '12800081289998438',
          name: 'JB JUNA SHOP / TIDUNG TRIP'
        };
    }
  };

  const currentVa = getVaDetails();

  const handleCopyVa = () => {
    navigator.clipboard.writeText(currentVa.rawNumber);
    setCopiedVaNumber(true);
    setTimeout(() => setCopiedVaNumber(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(totalPrice));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Quick fill helper for convenience testing
  const handleFillDemoData = () => {
    setFullName('Junaedi Rahman');
    setIdCardNumber('3175082104900001');
    setGender('Laki-laki');
    setEmail('bangjuna876@gmail.com');
    setPhone('081289998438');
    setCity('Jakarta Timur');
    setNotes('Mohon homestay yang dekat dengan pantai barat dan sunrise');
    setFieldErrors({});
    setValidationError(null);
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Nama lengkap wajib diisi minimal 3 huruf sesuai KTP/Paspor.';
    }

    const cleanId = idCardNumber.trim().replace(/\s/g, '');
    if (!cleanId || cleanId.length < 6) {
      errs.idCardNumber = 'Nomor NIK / KTP / Paspor wajib diisi (minimal 6 digit) untuk asuransi dan manifes kapal.';
    }

    if (!gender) {
      errs.gender = 'Pilih jenis kelamin untuk kelengkapan manifes penumpang.';
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      errs.phone = 'Nomor WhatsApp / HP wajib aktif (minimal 9 digit) untuk konfirmasi tiket & pemandu.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Alamat email wajib diisi dengan format valid untuk pengiriman E-Tiket resmi.';
    }

    if (!city.trim() || city.trim().length < 2) {
      errs.city = 'Kota / domisili asal wisatawan wajib diisi.';
    }

    if (!departureDate) {
      errs.departureDate = 'Tanggal keberangkatan wajib ditentukan.';
    }

    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstErrMsg = Object.values(errs)[0];
      setValidationError(`Biodata belum lengkap! ${firstErrMsg}`);
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setCurrentStep(2);
  };

  const handleFinalizeBooking = () => {
    if (!receipt) {
      setValidationError('⚠️ Pembayaran Wajib Dilakukan! Silakan lakukan pembayaran dan lampirkan foto/screenshot bukti transaksi yang sah sebelum menerbitkan E-Tiket.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const bookingId = generateBookingId();
      const nowIso = new Date().toISOString();

      const newBooking: BookingTransaction = {
        id: bookingId,
        createdAt: nowIso,
        ticketId: selectedTicket.id,
        ticketTitle: selectedTicket.name,
        category: selectedTicket.categoryLabel,
        departureDate,
        returnDate: selectedTicket.category === 'paket-wisata' ? departureDate : undefined,
        departurePort: selectedTicket.departurePort,
        passengersCount: passengers,
        addons: [],
        customer: {
          fullName,
          email,
          phone,
          idCardNumber,
          gender: gender as 'Laki-laki' | 'Perempuan',
          city,
          notes
        },
        paymentMethod:
          paymentMethod === 'qris'
            ? 'QRIS Instan (JB JUNA SHOP CAKUNG)'
            : `${currentVa.bankName} (${currentVa.rawNumber})`,
        totalPrice,
        status: 'PAID',
        emailNotificationSent: true,
        emailSentAt: nowIso,
        qrCodeData: `${bookingId}-${fullName.toUpperCase()}-TIDUNG-${passengers}PAX`,
        tourGuideName: 'Kang Syarif (Pemandu Tidung)',
        tourGuidePhone: '+62 812-8999-8438',
        receiptImage: receipt.dataUrl,
        receiptFileName: receipt.fileName,
        receiptUploadedAt: new Date().toISOString()
      };

      saveBooking(newBooking);
      setIsProcessing(false);
      onBookingSuccess(newBooking);
    }, 900);
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[95vh] sm:max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Pemesanan Tiket Wisata Pulau Tidung</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-700/80 text-cyan-100 border border-cyan-500/30">
                Tahap {currentStep} dari 2
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
              {currentStep === 1
                ? 'Lengkapi rincian pesanan dan data kontak wisatawan'
                : 'Selesaikan transaksi pembayaran untuk menerbitkan E-Tiket resmi'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 font-bold transition-colors cursor-pointer ${
              currentStep === 1 ? 'text-cyan-800' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === 1
                  ? 'bg-cyan-700 text-white shadow-2xs'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {currentStep === 2 ? '✓' : '1'}
            </span>
            <span>Rincian Pesanan & Kontak</span>
          </button>

          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

          <button
            type="button"
            onClick={() => {
              if (validateForm()) setCurrentStep(2);
            }}
            className={`flex items-center gap-2 font-bold transition-colors cursor-pointer ${
              currentStep === 2 ? 'text-cyan-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === 2
                  ? 'bg-cyan-700 text-white shadow-2xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span>Metode Pembayaran ({paymentMethod === 'qris' ? 'QRIS' : 'VA'})</span>
          </button>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-3.5 sm:p-6 bg-slate-50/50">
          {currentStep === 1 ? (
            /* ========================================================== */
            /* STEP 1: FORM DETAILS */
            /* ========================================================== */
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* Notice: No account needed for tourists */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-emerald-900 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Pemesanan Langsung Tanpa Perlu Buat Akun</strong> · Cukup lengkapi nama pemesan & WhatsApp, e-tiket resmi otomatis dikirim ke email.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
                {/* Form Inputs (7 Cols) */}
                <div className="md:col-span-7 space-y-4">
                  {/* 1. Pilih Tiket */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                      1. Pilihan Tiket / Paket Wisata
                    </label>
                    <select
                      value={selectedTicketId}
                      onChange={(e) => setSelectedTicketId(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none cursor-pointer"
                    >
                      {TIDUNG_TICKETS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} — {formatRupiah(t.price)} {t.priceUnitText}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>Dermaga Keberangkatan: {selectedTicket.departurePort}</span>
                    </div>
                  </div>

                  {/* 2. Tanggal & Pax */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                          2. Tanggal Berangkat
                        </label>
                        <div className="relative flex items-center">
                          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                          <input
                            type="date"
                            required
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-cyan-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                          Jumlah Wisatawan
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1 flex items-center">
                            <Users className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <input
                              type="number"
                              min={1}
                              max={50}
                              value={passengers}
                              onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-cyan-500 outline-none font-bold"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-500">Orang</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Biodata Pemesan & Manifes Wisatawan */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                          3. Biodata Pemesan & Manifes Wisatawan
                        </label>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Semua data bertanda <span className="text-rose-600 font-bold">*</span> wajib diisi untuk asuransi dan manifes pelabuhan syahbandar.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleFillDemoData}
                        className="px-2.5 py-1 text-[11px] font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Isi form secara otomatis untuk uji coba cepat"
                      >
                        <FileText className="w-3 h-3 text-cyan-600" />
                        <span>Isi Cepat Data Contoh</span>
                      </button>
                    </div>

                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Nama Lengkap (Sesuai KTP / Paspor) <span className="text-rose-600 font-bold">*</span></span>
                        <span className="text-[10px] text-slate-400 font-normal">Wajib diisi</span>
                      </label>
                      <div className="relative flex items-center">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="Masukkan nama lengkap pemesan"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (fieldErrors.fullName) {
                              const copy = { ...fieldErrors };
                              delete copy.fullName;
                              setFieldErrors(copy);
                            }
                            if (validationError) setValidationError(null);
                          }}
                          className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-colors ${
                            fieldErrors.fullName
                              ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                              : 'border-slate-300 focus:border-cyan-500 bg-white'
                          }`}
                        />
                      </div>
                      {fieldErrors.fullName && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{fieldErrors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Nomor NIK / KTP / Paspor & Jenis Kelamin */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                          <span>Nomor NIK / KTP / Paspor <span className="text-rose-600 font-bold">*</span></span>
                          <span className="text-[10px] text-slate-400 font-normal">Untuk Asuransi</span>
                        </label>
                        <div className="relative flex items-center">
                          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 3175082104900001"
                            value={idCardNumber}
                            onChange={(e) => {
                              setIdCardNumber(e.target.value);
                              if (fieldErrors.idCardNumber) {
                                const copy = { ...fieldErrors };
                                delete copy.idCardNumber;
                                setFieldErrors(copy);
                              }
                              if (validationError) setValidationError(null);
                            }}
                            className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border outline-none font-mono transition-colors ${
                              fieldErrors.idCardNumber
                                ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                                : 'border-slate-300 focus:border-cyan-500 bg-white'
                            }`}
                          />
                        </div>
                        {fieldErrors.idCardNumber ? (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{fieldErrors.idCardNumber}</span>
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-1">
                            Wajib untuk manifes asuransi Jasa Raharja kapal.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Jenis Kelamin <span className="text-rose-600 font-bold">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setGender('Laki-laki');
                              if (fieldErrors.gender) {
                                const copy = { ...fieldErrors };
                                delete copy.gender;
                                setFieldErrors(copy);
                              }
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all ${
                              gender === 'Laki-laki'
                                ? 'border-cyan-600 bg-cyan-50 font-bold text-cyan-900 ring-1 ring-cyan-500'
                                : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
                            }`}
                          >
                            Laki-laki
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setGender('Perempuan');
                              if (fieldErrors.gender) {
                                const copy = { ...fieldErrors };
                                delete copy.gender;
                                setFieldErrors(copy);
                              }
                            }}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all ${
                              gender === 'Perempuan'
                                ? 'border-cyan-600 bg-cyan-50 font-bold text-cyan-900 ring-1 ring-cyan-500'
                                : 'border-slate-300 hover:border-slate-400 text-slate-600 bg-white'
                            }`}
                          >
                            Perempuan
                          </button>
                        </div>
                        {fieldErrors.gender && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{fieldErrors.gender}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Nomor WhatsApp / HP Aktif <span className="text-rose-600 font-bold">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            placeholder="Contoh: 081289998438"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (fieldErrors.phone) {
                                const copy = { ...fieldErrors };
                                delete copy.phone;
                                setFieldErrors(copy);
                              }
                              if (validationError) setValidationError(null);
                            }}
                            className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-colors ${
                              fieldErrors.phone
                                ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                                : 'border-slate-300 focus:border-cyan-500 bg-white'
                            }`}
                          />
                        </div>
                        {fieldErrors.phone && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{fieldErrors.phone}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Alamat Email Aktif <span className="text-rose-600 font-bold">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="w-4 h-4 text-cyan-600 absolute left-3 pointer-events-none" />
                          <input
                            type="email"
                            required
                            placeholder="emailanda@gmail.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (fieldErrors.email) {
                                const copy = { ...fieldErrors };
                                delete copy.email;
                                setFieldErrors(copy);
                              }
                              if (validationError) setValidationError(null);
                            }}
                            className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-colors ${
                              fieldErrors.email
                                ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                                : 'border-cyan-400 bg-cyan-50/20 focus:border-cyan-600 font-medium text-slate-900'
                            }`}
                          />
                        </div>
                        {fieldErrors.email && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{fieldErrors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Kota Asal / Domisili */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Kota / Wilayah Domisili Asal Wisatawan <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Jakarta / Bekasi / Tangerang / Bandung / Depok"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            if (fieldErrors.city) {
                              const copy = { ...fieldErrors };
                              delete copy.city;
                              setFieldErrors(copy);
                            }
                            if (validationError) setValidationError(null);
                          }}
                          className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-colors ${
                            fieldErrors.city
                              ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 ring-1 ring-rose-300'
                              : 'border-slate-300 focus:border-cyan-500 bg-white'
                          }`}
                        />
                      </div>
                      {fieldErrors.city && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{fieldErrors.city}</span>
                        </p>
                      )}
                    </div>

                    {/* Catatan Khusus */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Catatan Tambahan / Permintaan Khusus</span>
                        <span className="text-[10px] text-slate-400 font-normal">Opsional</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Membawa lansia, minta sepeda ontel anak, atau homestay dekat sunrise"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-cyan-500 outline-none bg-white"
                      />
                    </div>
                  </div>

                  {/* 4. Pilihan Metode Bayar di Awal */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <span className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                      4. Pilih Metode Pembayaran Resmi
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qris')}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          paymentMethod === 'qris'
                            ? 'border-cyan-600 bg-cyan-50/70 ring-1 ring-cyan-500 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 font-bold text-xs text-slate-900">
                          <QrCode className="w-4 h-4 text-cyan-700 shrink-0" />
                          <span>QRIS Instan</span>
                        </div>
                        <p className="text-[11px] text-slate-500">BCA, Mandiri, GoPay, OVO, ShopeePay</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('va')}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          paymentMethod === 'va'
                            ? 'border-cyan-600 bg-cyan-50/70 ring-1 ring-cyan-500 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 font-bold text-xs text-slate-900">
                          <Building className="w-4 h-4 text-cyan-700 shrink-0" />
                          <span>Virtual Account</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Transfer Bank Otomatis (BCA/Mandiri/BRI)</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Ringkasan Biaya, Checklist Biodata & CTA (5 Cols) */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span>Ringkasan Pesanan & Biodata</span>
                      <span className="text-[10px] text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full">
                        Tahap 1
                      </span>
                    </h4>

                    <div className="text-xs space-y-2.5">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Paket / Tiket</span>
                        <strong className="text-slate-900 font-bold block mt-0.5">{selectedTicket.name}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-y border-slate-50">
                        <span className="text-slate-500">Tarif satuan:</span>
                        <strong className="text-slate-800">{formatRupiah(selectedTicket.price)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah wisatawan:</span>
                        <strong className="text-slate-800">{passengers} Orang</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tanggal berangkat:</span>
                        <strong className="text-slate-800">{departureDate}</strong>
                      </div>
                    </div>

                    {/* Checklist Kelengkapan Biodata */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between font-bold text-slate-700 pb-1 border-b border-slate-200">
                        <span>Status Biodata Manifes:</span>
                        {fullName && idCardNumber && gender && phone && email && city ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Lengkap</span>
                          </span>
                        ) : (
                          <span className="text-amber-700 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Wajib Dilengkapi</span>
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 pt-0.5 text-slate-600">
                        <div className="flex justify-between items-center">
                          <span>Nama:</span>
                          <strong className="truncate max-w-[140px] text-slate-800">
                            {fullName || <span className="text-rose-500 font-normal italic">Belum diisi *</span>}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>NIK / KTP:</span>
                          <strong className="font-mono text-slate-800">
                            {idCardNumber || <span className="text-rose-500 font-normal italic">Belum diisi *</span>}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Jenis Kelamin:</span>
                          <strong className="text-slate-800">
                            {gender || <span className="text-rose-500 font-normal italic">Belum dipilih *</span>}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>WhatsApp:</span>
                          <strong className="text-slate-800">
                            {phone || <span className="text-rose-500 font-normal italic">Belum diisi *</span>}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Email:</span>
                          <strong className="truncate max-w-[140px] text-slate-800">
                            {email || <span className="text-rose-500 font-normal italic">Belum diisi *</span>}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Kota Asal:</span>
                          <strong className="truncate max-w-[140px] text-slate-800">
                            {city || <span className="text-rose-500 font-normal italic">Belum diisi *</span>}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-700">Total Tagihan:</span>
                      <span className="text-xl font-black tracking-tight text-cyan-800 tabular-nums">
                        {formatRupiah(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Mandatory Payment Warning Box */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Langkah Pembayaran Wajib</p>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        Setelah melengkapi biodata di atas, Anda wajib menyelesaikan pembayaran dan melampirkan bukti transfer agar E-Tiket resmi dengan Barcode boarding diterbitkan.
                      </p>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Lanjut ke Pembayaran Wajib ({paymentMethod === 'qris' ? 'QRIS' : 'VA'})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Garansi pemesanan resmi & asuransi penyeberangan Jasa Raharja</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* ========================================================== */
            /* STEP 2: PROFESSIONAL PAYMENT CHECKOUT (QRIS & VA)          */
            /* ========================================================== */
            <div className="space-y-4">
              {/* Top Navigation & Status Bar */}
              <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ubah Data Pemesanan</span>
                </button>

                <div className="flex items-center gap-3">
                  {/* Status Indicator */}
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Menunggu Pembayaran</span>
                  </div>

                  {/* Countdown Timer */}
                  <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-cyan-700" />
                    <span>{formatTimer(paymentTimeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Grid 2-Kolom: Kiri (Metode Bayar), Kanan (Rincian & Upload & Konfirmasi) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                {/* Kolom Kiri: 7 Kolom (Payment Card) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Segmented Payment Tabs */}
                  <div className="bg-slate-200/70 p-1 rounded-2xl grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentMethod === 'qris'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-cyan-700" />
                      <span>QRIS Instan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('va')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentMethod === 'va'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Building className="w-4 h-4 text-cyan-700" />
                      <span>Virtual Account</span>
                    </button>
                  </div>

                  {/* Payment Body */}
                  {paymentMethod === 'qris' ? (
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900">
                          Scan Kode QRIS Nasional (GPN)
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Gunakan BCA Mobile, Mandiri, BRI, GoPay, OVO, ShopeePay, atau DANA
                        </p>
                      </div>

                      <QrisPaymentCard
                        amount={totalPrice}
                        customerName={fullName}
                        onPaymentSuccess={handleFinalizeBooking}
                      />
                    </div>
                  ) : (
                    /* Virtual Account Section */
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900">
                          Transfer Virtual Account Otomatis
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Pilih bank Anda dan transfer tepat sesuai nominal yang tertera
                        </p>
                      </div>

                      {/* Bank Selector Pills */}
                      <div className="grid grid-cols-3 gap-2">
                        {(['bca', 'mandiri', 'bri'] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBank(b)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              selectedBank === b
                                ? 'border-cyan-600 bg-cyan-50/70 font-bold text-cyan-900 shadow-2xs ring-1 ring-cyan-500'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                            }`}
                          >
                            <span className="text-xs uppercase font-bold">{b}</span>
                          </button>
                        ))}
                      </div>

                      {/* VA Details Box */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Bank Penyelenggara:</span>
                          <strong className="text-xs font-bold text-slate-900">{currentVa.bankName}</strong>
                        </div>

                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1">Nomor Rekening Virtual:</span>
                          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 font-mono">
                            <span className="text-base sm:text-lg font-black text-cyan-900 tracking-wider">
                              {currentVa.vaNumber}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyVa}
                              className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {copiedVaNumber ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Atas Nama:</span>
                          <strong className="text-xs font-bold text-slate-900">{currentVa.name}</strong>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Pembayaran</span>
                            <strong className="text-base font-black text-cyan-800">{formatRupiah(totalPrice)}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyAmount}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedAmount ? 'Nominal Tersalin' : 'Salin Nominal'}
                          </button>
                        </div>
                      </div>

                      {/* VA Guide Collapsible */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => setShowVaGuide(!showVaGuide)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 flex items-center justify-between font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <span>Petunjuk Transfer via m-Banking / ATM</span>
                          {showVaGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showVaGuide && (
                          <div className="p-3.5 text-[11px] text-slate-600 space-y-1.5 leading-relaxed bg-white">
                            <p>1. Buka aplikasi m-Banking atau kunjungi ATM terdekat.</p>
                            <p>2. Pilih menu <strong>Transfer</strong> → <strong>Virtual Account</strong>.</p>
                            <p>3. Masukkan nomor VA di atas dan pastikan nama penerima <strong>{currentVa.name}</strong>.</p>
                            <p>4. Masukkan nominal tepat sejumlah <strong>{formatRupiah(totalPrice)}</strong>.</p>
                            <p>5. Selesaikan transaksi dan lampirkan bukti transfer di sebelah kanan.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Kolom Kanan: 5 Kolom (Rincian Biaya, Upload Struk & CTA Konfirmasi) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Card 1: Ringkasan Tagihan */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span>Rincian Tagihan</span>
                      <span className="text-[10px] text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded-full">
                        Tagihan Aktif
                      </span>
                    </h4>

                    <div className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Paket Wisata:</span>
                        <strong className="text-slate-900 font-bold text-right max-w-[170px] truncate">
                          {selectedTicket.name}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Keberangkatan:</span>
                        <strong className="text-slate-800">{departureDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah Wisatawan:</span>
                        <strong className="text-slate-800">{passengers} Orang</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nama Kontak:</span>
                        <strong className="text-slate-800 truncate max-w-[140px]">{fullName}</strong>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-700">Total Harus Dibayar:</span>
                      <span className="text-lg font-black text-cyan-800 tabular-nums">
                        {formatRupiah(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Upload Bukti Transaksi (WAJIB) */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    {!receipt ? (
                      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Langkah Pembayaran Wajib</p>
                          <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                            Silakan lakukan transfer atau scan QRIS, lalu unggah foto / tangkapan layar bukti transfer yang sah di bawah ini agar tombol penerbitan E-Tiket aktif.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold">Bukti Pembayaran Terlampir</p>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            Bukti transaksi siap diproses untuk penerbitan E-Tiket resmi.
                          </p>
                        </div>
                      </div>
                    )}

                    <ReceiptUploadZone
                      receipt={receipt}
                      onReceiptChange={(r) => {
                        setReceipt(r);
                        if (validationError) setValidationError(null);
                      }}
                      required={true}
                    />
                  </div>

                  {/* Card 3: Konfirmasi CTA */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-center">
                    <button
                      type="button"
                      onClick={handleFinalizeBooking}
                      disabled={!receipt || isProcessing}
                      className={`w-full py-3.5 px-4 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        receipt
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-500/40'
                          : 'bg-slate-200 text-slate-500 border border-slate-300 shadow-none'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Menerbitkan E-Tiket Resmi...</span>
                        </>
                      ) : receipt ? (
                        <>
                          <FileCheck className="w-4 h-4" />
                          <span>✓ Bukti Pembayaran Sah — Terbitkan E-Tiket</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-slate-400" />
                          <span>Wajib Unggah Bukti Bayar untuk Terbitkan Tiket</span>
                        </>
                      )}
                    </button>

                    <div className="text-[11px] text-slate-500 leading-relaxed text-left space-y-1">
                      <div className="flex items-start gap-1.5 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          E-tiket PDF resmi & QR Code boarding dikirim instan ke <strong>{email}</strong>.
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                        <span>Verifikasi otomatis oleh sistem loket dermaga Arah Pulau.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
