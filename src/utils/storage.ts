import { BookingTransaction, TicketOption } from '../types';
import { TIDUNG_TICKETS } from '../data/tidungData';

const STORAGE_KEY = 'tidungtrip_bookings_v1';
const TICKET_CATALOG_STORAGE_KEY = 'tidungtrip_ticket_catalog_v1';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDateIndonesian = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const getSavedBookings = (): BookingTransaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial sample transaction for bangjuna876@gmail.com
      const sampleBooking: BookingTransaction = {
        id: 'TID-78429',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        ticketId: 'paket-2d1n-komplit',
        ticketTitle: 'Paket Komplit Pulau Tidung 2 Hari 1 Malam (2D1N)',
        category: 'paket-wisata',
        departureDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        departurePort: 'Marina Ancol (Dermaga 16)',
        passengersCount: 2,
        addons: [
          {
            id: 'gopro-underwater',
            name: 'Sewa Kamera GoPro Hero 11 Underwater',
            price: 85000,
            quantity: 1
          }
        ],
        customer: {
          fullName: 'Junaedi Rahman',
          email: 'bangjuna876@gmail.com',
          phone: '081298765432',
          notes: 'Minta homestay yang dekat dengan pantai barat dan view sunrise'
        },
        paymentMethod: 'QRIS Instan (BCA Mobile / GoPay)',
        totalPrice: 490000 * 2 + 85000,
        status: 'PAID',
        emailNotificationSent: true,
        emailSentAt: new Date(Date.now() - 3600000 * 2 + 120000).toISOString(),
        qrCodeData: 'TID-78429-JUNAEDI-TIDUNG-2PAX-VERIFIED',
        tourGuideName: 'Kang Syarif (Guide Tidung Asli)',
        tourGuidePhone: '+62 813-1122-3344'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([sampleBooking]));
      return [sampleBooking];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveBooking = (booking: BookingTransaction): void => {
  const current = getSavedBookings();
  const updated = [booking, ...current.filter((b) => b.id !== booking.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateBookingReceipt = (
  bookingId: string,
  receiptData: {
    receiptImage: string;
    receiptFileName?: string;
    receiptUploadedAt?: string;
  }
): BookingTransaction | null => {
  const current = getSavedBookings();
  const targetIndex = current.findIndex((b) => b.id === bookingId);
  if (targetIndex === -1) return null;

  const updatedBooking: BookingTransaction = {
    ...current[targetIndex],
    receiptImage: receiptData.receiptImage,
    receiptFileName: receiptData.receiptFileName || 'bukti-transaksi.jpg',
    receiptUploadedAt: receiptData.receiptUploadedAt || new Date().toISOString()
  };

  current[targetIndex] = updatedBooking;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return updatedBooking;
};

export const updateBookingStatus = (
  bookingId: string,
  newStatus: 'PAID' | 'CONFIRMED'
): BookingTransaction | null => {
  const current = getSavedBookings();
  const targetIndex = current.findIndex((b) => b.id === bookingId);
  if (targetIndex === -1) return null;

  current[targetIndex] = {
    ...current[targetIndex],
    status: newStatus
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return current[targetIndex];
};

export const generateBookingId = (): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `TID-${randomNum}`;
};

export const deleteBooking = (bookingId: string): boolean => {
  const current = getSavedBookings();
  const updated = current.filter((b) => b.id !== bookingId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
};

export const getSavedTicketCatalog = (): TicketOption[] => {
  try {
    const raw = localStorage.getItem(TICKET_CATALOG_STORAGE_KEY);
    if (!raw) {
      return TIDUNG_TICKETS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return TIDUNG_TICKETS;
  } catch {
    return TIDUNG_TICKETS;
  }
};

export const saveTicketCatalog = (tickets: TicketOption[]): void => {
  localStorage.setItem(TICKET_CATALOG_STORAGE_KEY, JSON.stringify(tickets));
};

export const deleteTicketFromCatalog = (ticketId: string): TicketOption[] => {
  const current = getSavedTicketCatalog();
  const updated = current.filter((t) => t.id !== ticketId);
  saveTicketCatalog(updated);
  return updated;
};

export const resetTicketCatalog = (): TicketOption[] => {
  try {
    localStorage.removeItem(TICKET_CATALOG_STORAGE_KEY);
  } catch {
    // ignore
  }
  return TIDUNG_TICKETS;
};
