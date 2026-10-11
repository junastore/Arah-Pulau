export interface DestinationItem {
  id: string;
  name: string;
  category: 'spot-ikonik' | 'museum' | 'nemo' | 'penyu' | 'homestay' | 'pantai' | 'snorkeling' | 'edukasi' | 'wahana';
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  location: string;
  rating: number;
  reviewsCount: number;
  entryFee: string;
  bestTime: string;
  tags: string[];
  tips: string[];
}

export interface TicketOption {
  id: string;
  name: string;
  category: 'speedboat' | 'ferry' | 'paket-wisata' | 'homestay' | 'aktivitas' | 'sewa';
  categoryLabel: string;
  departurePort: 'Marina Ancol (Dermaga 16)' | 'Muara Angke (Kali Adem)' | 'Pulau Tidung' | 'Bebas Pilih';
  durationText: string;
  price: number;
  priceUnitText: string;
  popular?: boolean;
  features: string[];
  meetingPoint: string;
  scheduleTime: string;
  description: string;
  rating?: number;
  imageUrl?: string;
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export interface BookingCustomer {
  fullName: string;
  email: string;
  phone: string;
  idCardNumber?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  city?: string;
  notes?: string;
}

export interface BookingTransaction {
  id: string;
  createdAt: string;
  ticketId: string;
  ticketTitle: string;
  category: string;
  departureDate: string;
  returnDate?: string;
  departurePort: string;
  passengersCount: number;
  addons: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  customer: BookingCustomer;
  paymentMethod: string;
  totalPrice: number;
  status: 'PAID' | 'CONFIRMED';
  emailNotificationSent: boolean;
  emailSentAt: string;
  qrCodeData: string;
  tourGuideName: string;
  tourGuidePhone: string;
  receiptImage?: string;
  receiptFileName?: string;
  receiptUploadedAt?: string;
}
