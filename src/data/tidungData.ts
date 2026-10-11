import { DestinationItem, TicketOption, BookingAddon } from '../types';
import { MUSEUM_PAUS_IMAGE } from '../utils/destinationImages';

export const TIDUNG_DESTINATIONS: DestinationItem[] = [
  {
    id: 'jembatan-cinta',
    name: 'Jembatan Cinta',
    category: 'spot-ikonik',
    categoryLabel: 'Spot Ikonik & Sunset',
    shortDesc: 'Jembatan ikonik 800 meter penghubung Pulau Tidung Besar dan Kecil di atas laut biru toska dengan spot lompat jembatan dan sunset spektakuler.',
    fullDesc: 'Jembatan Cinta adalah landmark utama Pulau Tidung. Menghubungkan Tidung Besar dan Tidung Kecil di atas air laut jernih. Memiliki lengkungan ikonik setinggi 6 meter tempat favorit wisatawan menguji nyali melompat ke air, serta menikmati panorama matahari terbenam (sunset) yang romantis.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    location: 'Perbatasan Tidung Besar & Tidung Kecil',
    rating: 4.9,
    reviewsCount: 1420,
    entryFee: 'Gratis',
    bestTime: '06:00 (Sunrise) & 17:15 (Sunset)',
    tags: ['Ikon Wisata', 'Lompat Jembatan', 'Sunset'],
    tips: [
      'Gunakan sepeda ontel melintasi jembatan menuju Tidung Kecil.',
      'Waktu terbaik foto sunset adalah pukul 17:15 - 17:45 WIB.',
      'Bisa menikmati kelapa muda segar di warung tepi jembatan.'
    ]
  },
  {
    id: 'museum-paus',
    name: 'Museum Paus',
    category: 'museum',
    categoryLabel: 'Edukasi & Sejarah',
    shortDesc: 'Museum mini kerangka raksasa paus sperma sepanjang 12 meter yang terdampar di Pulau Tidung, sarana edukasi biota laut langka.',
    fullDesc: 'Museum Paus terletak di kawasan Pulau Tidung Kecil. Di sini dipajang replika dan tulang kerangka utuh ikan paus sperma raksasa (Sperm Whale) yang pernah terdampar di perairan Kepulauan Seribu pada tahun 2012. Destinasi edukasi favorit untuk anak-anak, pelajar, dan pecinta biologi kelautan.',
    imageUrl: MUSEUM_PAUS_IMAGE,
    location: 'Area Konservasi Pulau Tidung Kecil',
    rating: 4.8,
    reviewsCount: 650,
    entryFee: 'Gratis / Donasi',
    bestTime: '08:30 - 16:00 WIB',
    tags: ['Kerangka Paus', 'Edukasi Kelautan', 'Tidung Kecil'],
    tips: [
      'Akses mudah menggunakan sepeda santai melalui Jembatan Cinta.',
      'Terdapat pemandu lokal yang menjelaskan sejarah penemuan paus.',
      'Cocok untuk wisata edukasi keluarga dan foto unik.'
    ]
  },
  {
    id: 'ternak-ikan-nemo',
    name: 'Ternak Ikan Nemo',
    category: 'nemo',
    categoryLabel: 'Snorkeling & Terumbu Karang',
    shortDesc: 'Spot konservasi dan penangkaran ikan badut (Nemo) di terumbu karang dangkal Karang Beras dengan air sejernih kaca.',
    fullDesc: 'Spot penangkaran dan habitat alami ikan badut (Amphiprioninae / Nemo) di perairan terumbu karang dangkal Pulau Tidung. Pengunjung dapat snorkeling, berinteraksi memberi makan ikan, dan berfoto di antara anemon laut warna-warni yang sangat ramah dan terlindungi.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80',
    location: 'Spot Karang Beras, Perairan Utara Tidung',
    rating: 4.95,
    reviewsCount: 1530,
    entryFee: 'Paket Kapal Snorkeling (Mulai Rp45rb)',
    bestTime: '08:30 - 11:30 WIB (Air Sangat Jernih)',
    tags: ['Ikan Nemo', 'Snorkeling', 'Terumbu Karang'],
    tips: [
      'Gunakan pelampung dan alat snorkel yang disediakan pemandu.',
      'Dilarang menginjak karang hidup agar anemon tetap lestari.',
      'Disediakan kamera underwater untuk foto bersama ikan nemo.'
    ]
  },
  {
    id: 'penangkaran-penyu',
    name: 'Penangkaran Penyu',
    category: 'penyu',
    categoryLabel: 'Konservasi Satwa Langka',
    shortDesc: 'Pusat konservasi dan penetasan tukik penyu sisik di Pulau Tidung Kecil di bawah pengawasan BKSDA DKI Jakarta.',
    fullDesc: 'Pusat konservasi satwa laut lindung di Pulau Tidung Kecil yang fokus pada penyelamatan telur dan penangkaran tukik penyu sisik (Eretmochelys imbricata). Wisatawan dapat mengamati anak penyu (tukik) di kolam pemeliharaan dan berpartisipasi dalam program pelepasan tukik ke laut lepas.',
    imageUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1200&q=80',
    location: 'Pos Konservasi BKSDA, Pulau Tidung Kecil',
    rating: 4.88,
    reviewsCount: 820,
    entryFee: 'Gratis / Donasi Konservasi',
    bestTime: '09:00 - 15:30 WIB',
    tags: ['Tukik Penyu', 'Konservasi', 'Ekowisata'],
    tips: [
      'Ikuti arahan petugas konservasi saat berinteraksi dengan tukik.',
      'Jangan menggunakan flash kamera saat memotret anak penyu.',
      'Dapat berdonasi untuk mendukung program pelestarian penyu.'
    ]
  },
  {
    id: 'homestay-tidung',
    name: 'Homestay Tidung',
    category: 'homestay',
    categoryLabel: 'Penginapan AC & Pesisir',
    shortDesc: 'Penginapan homestay nyaman full AC, TV, WiFi, dan dekat pantai untuk istirahat tenang bersama keluarga atau teman.',
    fullDesc: 'Pilihan penginapan homestay lokal khas Pulau Tidung dengan fasilitas modern: kamar tidur ber-AC dingin, kamar mandi bersih, kasur empuk, dispenser air, WiFi, dan teras santai. Berlokasi strategis di dekat pantai dan dermaga sehingga memudahkan mobilitas berlibur.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    location: 'Pemukiman Ramah Pesisir Tidung Besar',
    rating: 4.85,
    reviewsCount: 940,
    entryFee: 'Mulai Rp350.000 / Malam',
    bestTime: 'Check-in 11:00 WIB · Check-out 10:00 WIB',
    tags: ['Full AC', 'Dekat Pantai', 'WiFi & TV', 'Keluarga'],
    tips: [
      'Pesan lebih awal terutama saat akhir pekan atau musim liburan.',
      'Tersedia pilihan 1 kamar (2-3 orang) atau 1 rumah utuh (rombongan).',
      'Pemilik homestay ramah dan siap membantu menyiapkan BBQ malam.'
    ]
  }
];

export const TIDUNG_TICKETS: TicketOption[] = [
  {
    id: 'paket-2d1n-premium',
    name: '2D1N Tidung Premium',
    category: 'paket-wisata',
    categoryLabel: 'Paket Populer',
    departurePort: 'Bebas Pilih',
    durationText: '2 Hari 1 Malam',
    price: 450000,
    priceUnitText: '/ orang',
    popular: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    features: [
      'Kapal Penyeberangan PP Cepat & Nyaman',
      'Homestay AC Pesisir + WiFi & TV',
      'Makan 3x Prasmanan + Welcome Drink',
      'Snorkeling Karang Beras Nemo + Foto Underwater',
      'Sepeda Ontel Bebas Keliling Pulau Tidung'
    ],
    meetingPoint: 'Pelabuhan Keberangkatan Pilihan (Marina / Muara Angke)',
    scheduleTime: 'Setiap Hari (07:30 WIB - 15:00 WIB)',
    description: 'Paket liburan terfavorit 2 hari 1 malam lengkap dengan penginapan AC, snorkeling nemo, sepeda santai, dan BBQ malam.'
  },
  {
    id: 'paket-3d2n-explorer',
    name: '3D2N Tidung Explorer',
    category: 'paket-wisata',
    categoryLabel: 'Paket Populer',
    departurePort: 'Bebas Pilih',
    durationText: '3 Hari 2 Malam',
    price: 750000,
    priceUnitText: '/ orang',
    popular: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    features: [
      'Tiket Kapal Speedboat PP Marina Ancol',
      'Penginapan Homestay AC VIP Pesisir 2 Malam',
      'Makan 6x Lengkap + Pesta BBQ Spesial Seafood',
      'Tur Eksplorasi Jembatan Cinta, Museum Paus & Penyu',
      'Snorkeling Karang Nemo & Pulau Payung',
      'Dokumentasi GoPro Underwater HD Free'
    ],
    meetingPoint: 'Dermaga 16 Marina Ancol / Muara Angke',
    scheduleTime: 'Setiap Hari (07:30 WIB s/d Hari ke-3)',
    description: 'Pengalaman liburan eksklusif 3 hari 2 malam menjelajah seluruh keindahan Pulau Tidung Besar dan Tidung Kecil.'
  },
  {
    id: 'homestay-ac-pesisir',
    name: 'Homestay AC Tidung Pesisir',
    category: 'homestay',
    categoryLabel: 'Penginapan Pesisir',
    departurePort: 'Pulau Tidung',
    durationText: '1 Malam (Check-in 11:00)',
    price: 350000,
    priceUnitText: '/ malam',
    popular: true,
    rating: 4.85,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    features: [
      'Kamar tidur Full AC dingin & kasur empuk',
      'Kamar mandi dalam bersih + perlengkapan mandi',
      'Fasilitas TV, WiFi kencang, dispenser air mineral',
      'Lokasi dekat pantai barat & pusat kuliner pulau'
    ],
    meetingPoint: 'Dermaga Pulau Tidung (Diantar ke Homestay)',
    scheduleTime: 'Check-in 11:00 WIB, Check-out 10:00 WIB',
    description: 'Penginapan homestay nyaman dan bersih untuk istirahat tenang di Pulau Tidung.'
  },

  {
    id: 'rental-sepeda-ontel',
    name: 'Sewa Sepeda Ontel & Snorkeling',
    category: 'aktivitas',
    categoryLabel: 'Aktivitas Pulau',
    departurePort: 'Pulau Tidung',
    durationText: 'Sewa Bebas (24 Jam)',
    price: 45000,
    priceUnitText: '/ orang / hari',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80',
    features: [
      'Sepeda ontel nyaman berkeranjang',
      'Bebas melintasi Jembatan Cinta ke Tidung Kecil',
      'Termasuk pelampung & masker snorkel',
      'Pemandu lokal ramah di spot Jembatan Cinta'
    ],
    meetingPoint: 'Pusat Rental Dermaga Pulau Tidung',
    scheduleTime: 'Bisa diambil kapan saja setiba di pulau',
    description: 'Cara santai menikmati angin laut melintasi Jembatan Cinta dan spot snorkeling nemo.'
  }
];

export const BOOKING_ADDONS: BookingAddon[] = [
  {
    id: 'gopro-underwater',
    name: 'Sewa Kamera GoPro Hero 11 Underwater',
    price: 85000,
    unit: '/ sesi snorkeling',
    description: 'Termasuk file foto & video HD tak terbatas langsung dikirim ke HP.'
  },
  {
    id: 'bbq-ikan-tambahan',
    name: 'Porsi Tambahan BBQ Ikan Tongkol & Cumi',
    price: 65000,
    unit: '/ porsi',
    description: 'Ikan segar tangkapan nelayan lokal Tidung dengan bumbu bakar istimewa.'
  },
  {
    id: 'sepeda-listrik',
    name: 'Upgrade ke Sepeda Listrik (E-Bike)',
    price: 70000,
    unit: '/ hari',
    description: 'Keliling pulau tanpa perlu mengayuh, baterai tahan seharian.'
  }
];

export const FERRY_SCHEDULES = [
  {
    port: 'Marina Ancol (Dermaga 16)',
    type: 'Speedboat Express AC',
    travelTime: '1 Jam 30 Menit',
    departures: [
      { from: 'Marina Ancol', to: 'Pulau Tidung', time: '08:00 WIB', checkIn: '07:15 WIB' },
      { from: 'Pulau Tidung', to: 'Marina Ancol', time: '15:00 WIB', checkIn: '14:30 WIB' }
    ],
    facilities: ['Full AC', 'Toilet Bersih', 'Bagasi Terlindungi', 'Life Jacket Lengkap']
  },
  {
    port: 'Pelabuhan Kali Adem (Muara Angke)',
    type: 'Kapal Kayu Tradisional / Feri Dishub',
    travelTime: '2 Jam 30 Menit',
    departures: [
      { from: 'Kali Adem', to: 'Pulau Tidung', time: '07:30 WIB', checkIn: '06:30 WIB' },
      { from: 'Pulau Tidung', to: 'Kali Adem', time: '13:00 WIB', checkIn: '12:00 WIB' }
    ],
    facilities: ['Dek Terbuka Luas', 'Harga Ekonomis', 'Bagasi Barang Besar', 'Kantin Minuman']
  }
];

export const TIDUNG_FAQS = [
  {
    q: 'Berapa lama perjalanan dari Jakarta ke Pulau Tidung?',
    a: 'Jika naik Speedboat dari Marina Ancol butuh sekitar 90 menit (1.5 jam). Jika naik Kapal Motor dari Pelabuhan Kali Adem Muara Angke butuh sekitar 2.5 jam.'
  },
  {
    q: 'Bagaimana cara mendapatkan tiket dan konfirmasinya?',
    a: 'Pilih jadwal dan tiket di Arah Pulau, selesaikan pembayaran via QRIS atau Transfer Bank. E-Tiket resmi dengan QR Code akan langsung dikirimkan ke email Anda dan siap digunakan saat boarding di dermaga.'
  },
  {
    q: 'Apakah fasilitas homestay sudah ber-AC?',
    a: 'Ya, seluruh unit homestay rekanan Arah Pulau dilengkapi AC dingin, kasur bersih, kamar mandi, TV, WiFi, dan dispenser air minum.'
  },
  {
    q: 'Apakah sinyal HP bagus di Pulau Tidung?',
    a: 'Sangat bagus! Jaringan Telkomsel, Indosat, dan XL memiliki koneksi 4G yang stabil di Tidung Besar hingga Jembatan Cinta.'
  }
];
