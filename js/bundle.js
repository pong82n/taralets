/**
 * TaraLets - Standalone Application Bundle
 * Complete Ridesharing Platform with Mobile Screen Fit, Commuter Login/Logout, Verified QR Codes & Payment Modes
 */
(function() {
  'use strict';

  // --- DATA ---
  /**
 * TaraLets - Initial Seed Data & Business Hubs
 * Work-commute carpooling platform where Drivers book matching co-commuters
 */
const PAYMENT_MODES = [
  {
    id: "gcash",
    name: "GCash",
    shortName: "GCash",
    type: "e-wallet",
    icon: "💙",
    color: "#007dfe",
    bgClass: "bg-blue-600 text-white",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Scan Driver GCash QR or transfer to mobile number",
    isDigital: true,
    speed: "Instant Transfer"
  },
  {
    id: "maya",
    name: "Maya",
    shortName: "Maya",
    type: "e-wallet",
    icon: "💚",
    color: "#00d665",
    bgClass: "bg-emerald-600 text-white",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Send to Maya @username or scan merchant/personal QR",
    isDigital: true,
    speed: "Instant Transfer"
  },
  {
    id: "cash",
    name: "Cash on Boarding (Kaliwaan)",
    shortName: "Cash",
    type: "cash",
    icon: "💵",
    color: "#d97706",
    bgClass: "bg-amber-600 text-white",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Hand exact change upon pickup or drop-off at the office",
    isDigital: false,
    speed: "In-Person Handover"
  },
  {
    id: "qrph",
    name: "QR Ph / Bank Transfer",
    shortName: "QR Ph",
    type: "bank",
    icon: "🏦",
    color: "#4f46e5",
    bgClass: "bg-indigo-600 text-white",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
    description: "National QR Ph (BDO, BPI, UnionBank, GoTyme, Seabank)",
    isDigital: true,
    speed: "InstaPay (Real-time)"
  },
  {
    id: "wallet",
    name: "TaraLets Commute Wallet",
    shortName: "TL Wallet",
    type: "in-app",
    icon: "⚡",
    color: "#0d9488",
    bgClass: "bg-teal-600 text-white",
    badgeClass: "bg-teal-100 text-teal-800 border-teal-200",
    description: "Auto-deducted contactless fare with gas cashbacks",
    isDigital: true,
    speed: "1-Click Auto Settlement"
  }
];
const WORKPLACE_HUBS = [
  {
    id: "hub-bgc",
    name: "Bonifacio Global City (BGC)",
    city: "Taguig",
    landmarks: "High Street, Market! Market!, Net Park, W City Center",
    lat: 14.5507,
    lng: 121.0509,
    companies: ["Google PH", "Globe Telecom", "JPMorgan Chase", "Accenture", "Shopee", "Unilever"]
  },
  {
    id: "hub-makati",
    name: "Makati Central Business District",
    city: "Makati",
    landmarks: "Ayala Triangle, PBCom Tower, RCBC Plaza, BDO Corporate Center",
    lat: 14.5547,
    lng: 121.0244,
    companies: ["BDO Unibank", "Ayala Corp", "SGV & Co.", "Bank of the Philippine Islands", "Manulife", "Nestle PH"]
  },
  {
    id: "hub-ortigas",
    name: "Ortigas Center",
    city: "Pasig / Mandaluyong",
    landmarks: "SM Megamall, ADB Headquarters, Robinsons Galleria, One San Miguel",
    lat: 14.5866,
    lng: 121.0617,
    companies: ["Asian Development Bank", "Meralco", "San Miguel Corp", "Concentrix", "Teleperformance"]
  },
  {
    id: "hub-eastwood",
    name: "Eastwood City Cyberpark",
    city: "Quezon City",
    landmarks: "Eastwood Mall, CyberOne, 1800 Eastwood, IBM Plaza",
    lat: 14.6105,
    lng: 121.0805,
    companies: ["IBM Philippines", "Accenture Eastwood", "Citibank Service", "Cognizant", "Dell Technologies"]
  },
  {
    id: "hub-technohub",
    name: "UP-AyalaLand TechnoHub",
    city: "Quezon City",
    landmarks: "Commonwealth Ave, Philam Life Bldg, Concentrix TechnoHub",
    lat: 14.6565,
    lng: 121.0583,
    companies: ["IBM BPO", "Concentrix", "Pointwest", "Reed Elsevier", "HSBC Service Centre"]
  },
  {
    id: "hub-alabang",
    name: "Filinvest City Alabang",
    city: "Muntinlupa",
    landmarks: "Northgate Cyberzone, Festival Mall, Insular Life Corporate Centre",
    lat: 14.4225,
    lng: 121.0425,
    companies: ["Infosys", "Capital One", "Amkor Technology", "Genpact", "Fluor Philippines"]
  }
];
const INITIAL_DRIVERS = [
  {
    id: "drv-01",
    name: "Engr. Marco Reyes",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    phone: "0917-555-8821",
    workplaceId: "hub-bgc",
    company: "Google PH (Net Park)",
    workplaceLocationName: "Net Park, 5th Ave, BGC, Taguig",
    workSchedule: "08:00 AM - 05:00 PM",
    rating: 4.95,
    totalCommutes: 142,
    walletBalance: 2450.00,
    badge: "Verified Employee",
    paymentMethods: {
      acceptedModes: ["gcash", "maya", "cash", "qrph", "wallet"],
      gcashNumber: "0917-555-8821",
      gcashName: "MARCO R.",
      mayaAccount: "@engr_marcoreyes",
      bankName: "BDO Unibank (InstaPay)",
      bankAccount: "0041-8829-1049",
      acceptsCash: true,
      preferDigital: true
    },
    vehicle: {
      type: "car",
      model: "Toyota Vios 1.5G (Silver)",
      plate: "NCA 4819",
      seatsCapacity: 3,
      hasAircon: true,
      allowBaggage: true,
      features: ["Aircon", "Dashcam", "No Smoking", "Luggage Trunk"]
    },
    defaultOrigin: {
      name: "Fairview, Quezon City (Near Fairview Terraces)",
      lat: 14.7176,
      lng: 121.0601
    },
    defaultFarePerSeat: 150
  },
  {
    id: "drv-02",
    name: "Bea Santos, CPA",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    phone: "0920-888-3312",
    workplaceId: "hub-makati",
    company: "BDO Corporate Center (Ayala)",
    workplaceLocationName: "Ayala Triangle Gardens, Makati CBD",
    workSchedule: "08:30 AM - 05:30 PM",
    rating: 4.98,
    totalCommutes: 98,
    walletBalance: 1280.00,
    badge: "Verified Senior Auditor",
    paymentMethods: {
      acceptedModes: ["gcash", "maya", "qrph", "wallet"],
      gcashNumber: "0920-888-3312",
      gcashName: "BEA S.",
      mayaAccount: "@bea_santos_cpa",
      bankName: "BPI (Bank of the Philippine Islands)",
      bankAccount: "4129-8812-33",
      acceptsCash: false, // Cashless only for quick motorcycle drops
      preferDigital: true
    },
    vehicle: {
      type: "motorcycle",
      model: "Honda Click 150i (Matte Blue)",
      plate: "NB 77123",
      seatsCapacity: 1,
      hasAircon: false,
      allowBaggage: false,
      features: ["Extra ICC Helmet Provided", "Raincoat / Poncho Available", "Hairnet Provided", "Top Box Storage"]
    },
    defaultOrigin: {
      name: "Boni Ave / Plainview, Mandaluyong",
      lat: 14.5770,
      lng: 121.0360
    },
    defaultFarePerSeat: 90
  },
  {
    id: "drv-03",
    name: "David Tan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    phone: "0918-223-4455",
    workplaceId: "hub-makati",
    company: "SGV & Co. (Makati CBD)",
    workplaceLocationName: "6760 Ayala Ave, Makati CBD",
    workSchedule: "09:00 AM - 06:00 PM",
    rating: 4.88,
    totalCommutes: 210,
    walletBalance: 3120.00,
    badge: "Verified SGV Team Lead",
    paymentMethods: {
      acceptedModes: ["gcash", "cash", "qrph", "wallet"],
      gcashNumber: "0918-223-4455",
      gcashName: "DAVID T.",
      bankName: "UnionBank PH",
      bankAccount: "1098-4421-9988",
      acceptsCash: true,
      preferDigital: false
    },
    vehicle: {
      type: "car",
      model: "Mitsubishi Xpander Cross (White)",
      plate: "DAH 5291",
      seatsCapacity: 4,
      hasAircon: true,
      allowBaggage: true,
      features: ["Aircon", "7-Seater Comfort", "Highway Tollway RFID", "Phone Chargers"]
    },
    defaultOrigin: {
      name: "Imus / Bacoor, Cavite (Aguinaldo Hwy)",
      lat: 14.4285,
      lng: 120.9416
    },
    defaultFarePerSeat: 180
  },
  {
    id: "drv-04",
    name: "Sarah Dizon",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    phone: "0939-991-6677",
    workplaceId: "hub-eastwood",
    company: "IBM Plaza Eastwood",
    workplaceLocationName: "IBM Plaza, Eastwood City, Bagumbayan, QC",
    workSchedule: "08:00 AM - 05:00 PM",
    rating: 4.92,
    totalCommutes: 76,
    walletBalance: 950.00,
    badge: "Verified Systems Analyst",
    paymentMethods: {
      acceptedModes: ["gcash", "maya", "cash", "wallet"],
      gcashNumber: "0939-991-6677",
      gcashName: "SARAH D.",
      mayaAccount: "@sarah_dizon_tech",
      acceptsCash: true,
      preferDigital: true
    },
    vehicle: {
      type: "motorcycle",
      model: "Yamaha NMAX 155 (Dark Petrol)",
      plate: "ND 33491",
      seatsCapacity: 1,
      hasAircon: false,
      allowBaggage: false,
      features: ["Extra ICC Modular Helmet", "Givi Top Box", "Smooth Maxi-Scooter Ride"]
    },
    defaultOrigin: {
      name: "Concepcion Uno, Marikina City",
      lat: 14.6512,
      lng: 121.1098
    },
    defaultFarePerSeat: 85
  }
];
const INITIAL_PASSENGERS = [
  {
    id: "pax-01",
    name: "Paulo Gomez",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    phone: "0917-111-2290",
    email: "paulo.gomez@shopee.ph",
    workplaceId: "hub-bgc",
    company: "Shopee Philippines (W City Center BGC)",
    jobTitle: "Operations Analyst",
    workSchedule: "08:00 AM - 05:00 PM",
    pickupLocation: "Commonwealth Market / Don Antonio, QC",
    pickupLat: 14.6865,
    pickupLng: 121.0801,
    vehiclePreference: "any",
    status: "looking",
    walletBalance: 650.00,
    preferredPaymentMode: "gcash",
    willingToShareFare: true,
    bio: "Looking for daily morning carpool to BGC. Quiet and punctual co-passenger!"
  },
  {
    id: "pax-02",
    name: "Clara Ramos",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    phone: "0921-333-8877",
    email: "clara.ramos@ayala.com.ph",
    workplaceId: "hub-makati",
    company: "Ayala Corp (Tower One)",
    jobTitle: "Corporate HR Specialist",
    workSchedule: "08:30 AM - 05:30 PM",
    pickupLocation: "Boni MRT Station / Robinsons Cybergate",
    pickupLat: 14.5739,
    pickupLng: 121.0483,
    vehiclePreference: "motorcycle",
    status: "looking",
    walletBalance: 420.00,
    preferredPaymentMode: "maya",
    willingToShareFare: true,
    bio: "Heading to Ayala Ave daily. Okay with motorcycle commute to beat EDSA rush hour."
  },
  {
    id: "pax-03",
    name: "Jerome Cruz",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    phone: "0918-777-1122",
    email: "jerome.cruz@manulife.ph",
    workplaceId: "hub-makati",
    company: "Manulife IT Delivery Center (Makati)",
    jobTitle: "QA Software Engineer",
    workSchedule: "09:00 AM - 06:00 PM",
    pickupLocation: "SM City Bacoor / Tirona Hwy",
    pickupLat: 14.4578,
    pickupLng: 120.9492,
    vehiclePreference: "car",
    status: "looking",
    walletBalance: 1100.00,
    preferredPaymentMode: "cash",
    willingToShareFare: true,
    bio: "Commuting from Cavite to Makati CBD. Willing to chip in for gas and CAVITEX toll."
  },
  {
    id: "pax-04",
    name: "Alyssa Mendoza",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    phone: "0995-442-9911",
    email: "alyssa.mendoza@cognizant.ph",
    workplaceId: "hub-eastwood",
    company: "Cognizant Philippines (Eastwood City)",
    jobTitle: "Customer Success Lead",
    workSchedule: "08:00 AM - 05:00 PM",
    pickupLocation: "Marikina Sports Center / Shoe Ave",
    pickupLat: 14.6369,
    pickupLng: 121.0988,
    vehiclePreference: "any",
    status: "looking",
    walletBalance: 780.00,
    preferredPaymentMode: "wallet",
    willingToShareFare: true,
    bio: "Same shift hours at Eastwood! Hate crowded jeepneys and UV express queues."
  },
  {
    id: "pax-05",
    name: "Miguel 'Miggy' Santos",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    phone: "0927-444-1234",
    email: "miguel.santos@google.com",
    workplaceId: "hub-bgc",
    company: "Google PH (Net Park BGC)",
    jobTitle: "Cloud Solutions Architect",
    workSchedule: "08:00 AM - 05:00 PM",
    pickupLocation: "Katipunan Ave / Ateneo Gate 3",
    pickupLat: 14.6402,
    pickupLng: 121.0776,
    vehiclePreference: "car",
    status: "looking",
    walletBalance: 940.00,
    preferredPaymentMode: "gcash",
    willingToShareFare: true,
    bio: "Colleague at Net Park! Working on 5th floor. Looking to carpool mornings via C5."
  },
  {
    id: "pax-06",
    name: "Danica Flores",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    phone: "0908-123-9988",
    email: "danica.flores@concentrix.ph",
    workplaceId: "hub-ortigas",
    company: "Concentrix Exquadra Tower",
    jobTitle: "Team Lead",
    workSchedule: "09:00 AM - 06:00 PM",
    pickupLocation: "Cainta Junction / Felix Ave",
    pickupLat: 14.5881,
    pickupLng: 121.1192,
    vehiclePreference: "any",
    status: "looking",
    walletBalance: 530.00,
    preferredPaymentMode: "qrph",
    willingToShareFare: true,
    bio: "Workplace is near Megamall / Ortigas. Very respectful passenger, ready 10 mins early."
  }
];
const INITIAL_COMMUTE_TRIPS = [
  {
    id: "trip-01",
    driverId: "drv-01",
    driverName: "Engr. Marco Reyes",
    driverAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    vehicleType: "car",
    vehicleModel: "Toyota Vios 1.5G",
    plate: "NCA 4819",
    workplaceId: "hub-bgc",
    destinationName: "Net Park, BGC, Taguig",
    destinationLat: 14.5507,
    destinationLng: 121.0509,
    originName: "Fairview Terraces, QC",
    originLat: 14.7176,
    originLng: 121.0601,
    departureDate: "Today",
    departureTime: "06:45 AM",
    expectedArrival: "07:50 AM",
    totalSeats: 3,
    bookedSeats: 1,
    farePerSeat: 150,
    acceptedPaymentModes: ["gcash", "maya", "cash", "qrph", "wallet"],
    routeVia: "Commonwealth Ave > C5 Road > Kalayaan Flyover > BGC",
    status: "active",
    bookedPassengerIds: ["pax-05"],
    notes: "Leaving strictly at 6:45 AM. Trunk space is open for laptop bags and backpacks."
  },
  {
    id: "trip-02",
    driverId: "drv-02",
    driverName: "Bea Santos, CPA",
    driverAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    vehicleType: "motorcycle",
    vehicleModel: "Honda Click 150i",
    plate: "NB 77123",
    workplaceId: "hub-makati",
    destinationName: "BDO Corporate Center, Makati CBD",
    destinationLat: 14.5547,
    destinationLng: 121.0244,
    originName: "Boni Ave, Mandaluyong",
    originLat: 14.5770,
    originLng: 121.0360,
    departureDate: "Today",
    departureTime: "07:45 AM",
    expectedArrival: "08:15 AM",
    totalSeats: 1,
    bookedSeats: 0,
    farePerSeat: 90,
    acceptedPaymentModes: ["gcash", "maya", "qrph", "wallet"],
    routeVia: "Boni > Coronado St > Makati-Mandaluyong Bridge > Makati Ave",
    status: "active",
    bookedPassengerIds: [],
    notes: "I bring a sanitized ICC helmet and rain gear. Cashless payments preferred!"
  },
  {
    id: "trip-03",
    driverId: "drv-03",
    driverName: "David Tan",
    driverAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    vehicleType: "car",
    vehicleModel: "Mitsubishi Xpander Cross",
    plate: "DAH 5291",
    workplaceId: "hub-makati",
    destinationName: "SGV & Co., 6760 Ayala Ave, Makati",
    destinationLat: 14.5547,
    destinationLng: 121.0244,
    originName: "Aguinaldo Hwy, Imus/Bacoor",
    originLat: 14.4285,
    originLng: 120.9416,
    departureDate: "Today",
    departureTime: "07:15 AM",
    expectedArrival: "08:35 AM",
    totalSeats: 4,
    bookedSeats: 1,
    farePerSeat: 180,
    acceptedPaymentModes: ["gcash", "cash", "qrph", "wallet"],
    routeVia: "CAVITEX > NAIAx Expressway > Skyway Stage 3 > Magallanes > Ayala",
    status: "active",
    bookedPassengerIds: ["pax-03"],
    notes: "Taking CAVITEX & Skyway tollways. Very chill acoustic playlist."
  }
];
const INITIAL_BOOKINGS = [
  {
    id: "bk-101",
    tripId: "trip-01",
    driverId: "drv-01",
    driverName: "Engr. Marco Reyes",
    driverPhone: "0917-555-8821",
    vehicleType: "car",
    vehicleModel: "Toyota Vios 1.5G (NCA 4819)",
    passengerId: "pax-05",
    passengerName: "Miguel Santos",
    passengerPhone: "0927-444-1234",
    passengerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    workplaceName: "Google PH (Net Park BGC)",
    pickupPoint: "Katipunan Ave / Ateneo Gate 3",
    destinationPoint: "Net Park, BGC, Taguig",
    scheduledTime: "06:45 AM",
    fare: 150,
    status: "confirmed",
    initiatedBy: "driver",
    driverNote: "Booked seat 1 for Miguel since we both work at Net Park BGC!",
    payment: {
      modeId: "gcash",
      modeName: "GCash",
      status: "paid", // 'pending', 'paid', 'verified'
      referenceNo: "GC-884910283",
      paidAt: "2026-11-04T01:30:00Z"
    },
    createdAt: "2026-11-04T01:15:00Z"
  },
  {
    id: "bk-102",
    tripId: "trip-03",
    driverId: "drv-03",
    driverName: "David Tan",
    driverPhone: "0918-223-4455",
    vehicleType: "car",
    vehicleModel: "Mitsubishi Xpander (DAH 5291)",
    passengerId: "pax-03",
    passengerName: "Jerome Cruz",
    passengerPhone: "0918-777-1122",
    passengerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    workplaceName: "Makati CBD Hub",
    pickupPoint: "SM City Bacoor / Tirona Hwy",
    destinationPoint: "6760 Ayala Ave, Makati CBD",
    scheduledTime: "07:15 AM",
    fare: 180,
    status: "confirmed",
    initiatedBy: "driver",
    driverNote: "Reserved seat for fellow Makati CBD commuter along Bacoor route.",
    payment: {
      modeId: "cash",
      modeName: "Cash on Boarding",
      status: "pending",
      referenceNo: "CASH-UPON-PICKUP",
      paidAt: null
    },
    createdAt: "2026-11-04T01:25:00Z"
  },
  {
    id: "bk-103",
    tripId: "trip-01",
    driverId: "drv-01",
    driverName: "Engr. Marco Reyes",
    driverPhone: "0917-555-8821",
    vehicleType: "car",
    vehicleModel: "Toyota Vios 1.5G (NCA 4819)",
    passengerId: "pax-01",
    passengerName: "Paulo Gomez",
    passengerPhone: "0917-111-2290",
    passengerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    workplaceName: "Shopee Philippines (W City Center BGC)",
    pickupPoint: "Commonwealth Market / Don Antonio, QC",
    destinationPoint: "W City Center, 7th Ave, BGC",
    scheduledTime: "06:45 AM",
    fare: 150,
    status: "pending_verification",
    initiatedBy: "passenger",
    passengerVerification: {
      companyName: "Shopee Philippines",
      companyEmail: "paulo.gomez@shopee.com",
      employeeIdBadge: "VERIFIED_CORP_BADGE_#SHP-8812",
      workplaceId: "hub-bgc",
      workSchedule: "08:00 AM - 05:00 PM",
      pickupAddress: "Commonwealth Market footbridge, QC",
      note: "Hi Engr. Marco! I work at W City Center BGC just 2 blocks from Net Park. Quiet commuter with verified Shopee employee ID. Requesting seat 2!"
    },
    payment: {
      modeId: "gcash",
      modeName: "GCash",
      status: "pending_digital",
      referenceNo: "GC-PENDING-ACCEPTANCE",
      paidAt: null
    },
    createdAt: "2026-11-04T02:10:00Z"
  }
];


  // --- STORAGE SERVICE ---
  /**
 * TaraLets - Storage Layer
 * Manages localStorage state with automatic initialization and reactive updates
 */

const STORAGE_KEYS = {
  DRIVERS: 'taralets_drivers',
  PASSENGERS: 'taralets_passengers',
  TRIPS: 'taralets_trips',
  BOOKINGS: 'taralets_bookings',
  ACTIVE_USER_ROLE: 'taralets_active_role',
  CURRENT_DRIVER_ID: 'taralets_current_driver_id',
  CURRENT_PASSENGER_ID: 'taralets_current_passenger_id',
  PASSENGER_LOGGED_IN: 'taralets_passenger_logged_in',
  COMMUTER_ONLY: 'taralets_commuter_only',
  MESSAGES: 'taralets_messages',
  TRANSACTIONS: 'taralets_transactions'
};

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.DRIVERS)) {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(INITIAL_DRIVERS));
    localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(INITIAL_PASSENGERS));
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_COMMUTE_TRIPS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ROLE, 'driver');
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRIVER_ID, INITIAL_DRIVERS[0].id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_PASSENGER_ID, INITIAL_PASSENGERS[0].id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([
      {
        bookingId: "bk-101",
        sender: "driver",
        senderName: "Engr. Marco Reyes",
        text: "Hi Miguel! I've booked you into my Fairview-to-NetPark trip. Paid via GCash (Ref #GC-884910283). Will pick you up along Katipunan around 7:05 AM.",
        time: "06:15 AM"
      },
      {
        bookingId: "bk-101",
        sender: "passenger",
        senderName: "Miguel Santos",
        text: "Thanks Marco! Payment verified. I'll be waiting in front of Ateneo Gate 3. See you!",
        time: "06:17 AM"
      }
    ]));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([
      {
        id: "tx-1",
        userId: "pax-05",
        userType: "passenger",
        type: "fare_payment",
        amount: -150,
        modeId: "gcash",
        description: "Commute Fare to BGC (Engr. Marco Reyes)",
        date: "Today, 06:15 AM",
        status: "completed"
      },
      {
        id: "tx-2",
        userId: "drv-01",
        userType: "driver",
        type: "fare_earnings",
        amount: 150,
        modeId: "gcash",
        description: "Seat 1 Share: Miguel Santos (Net Park)",
        date: "Today, 06:15 AM",
        status: "completed"
      }
    ]));
  }

  getWorkplaceHubs() {
    return WORKPLACE_HUBS;
  }

  getHubById(id) {
    return WORKPLACE_HUBS.find(h => h.id === id) || WORKPLACE_HUBS[0];
  }

  // --- Payment Modes ---
  getPaymentModes() {
    return PAYMENT_MODES;
  }

  getPaymentModeById(modeId) {
    return PAYMENT_MODES.find(m => m.id === modeId) || PAYMENT_MODES[0];
  }

  // --- Roles & Identity ---
  getActiveRole() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ROLE) || 'driver';
  }

  setActiveRole(role) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ROLE, role);
    window.dispatchEvent(new CustomEvent('taralets:role-changed', { detail: { role } }));
  }

  getCurrentDriverId() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_DRIVER_ID) || INITIAL_DRIVERS[0].id;
  }

  setCurrentDriverId(id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRIVER_ID, id);
    window.dispatchEvent(new CustomEvent('taralets:user-changed', { detail: { type: 'driver', id } }));
  }

  getCurrentPassengerId() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PASSENGER_ID) || INITIAL_PASSENGERS[0].id;
  }

  setCurrentPassengerId(id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PASSENGER_ID, id);
    window.dispatchEvent(new CustomEvent('taralets:user-changed', { detail: { type: 'passenger', id } }));
  }

  // --- Drivers ---
  getDrivers() {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    return raw ? JSON.parse(raw) : INITIAL_DRIVERS;
  }

  getCurrentDriver() {
    const drivers = this.getDrivers();
    const id = this.getCurrentDriverId();
    return drivers.find(d => d.id === id) || drivers[0];
  }

  saveDriver(driverData) {
    const drivers = this.getDrivers();
    const idx = drivers.findIndex(d => d.id === driverData.id);
    if (idx >= 0) {
      drivers[idx] = driverData;
    } else {
      drivers.push(driverData);
    }
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    return driverData;
  }

  // --- Passengers ---
  getPassengers() {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSENGERS);
    return raw ? JSON.parse(raw) : INITIAL_PASSENGERS;
  }

  getCurrentPassenger() {
    const passengers = this.getPassengers();
    const id = this.getCurrentPassengerId();
    return passengers.find(p => p.id === id) || passengers[0];
  }

  savePassenger(passengerData) {
    const passengers = this.getPassengers();
    const idx = passengers.findIndex(p => p.id === passengerData.id);
    if (idx >= 0) {
      passengers[idx] = passengerData;
    } else {
      passengers.push(passengerData);
    }
    localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(passengers));
    return passengerData;
  }

  isCommuterOnlyMode() {
    return localStorage.getItem('taralets_commuter_only') === 'true';
  }

  setCommuterOnlyMode(isLocked) {
    if (isLocked) {
      localStorage.setItem('taralets_commuter_only', 'true');
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ROLE, 'passenger');
    } else {
      localStorage.removeItem('taralets_commuter_only');
    }
    window.dispatchEvent(new CustomEvent('taralets:role-changed', { detail: { role: 'passenger', commuterOnly: !!isLocked } }));
  }

  isPassengerLoggedIn() {
    return localStorage.getItem('taralets_passenger_logged_in') === 'true';
  }

  normalizePhoneNumber(phone) {
    if (!phone) return '';
    let digits = phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('63') && digits.length >= 12) {
      digits = '0' + digits.substring(2);
    }
    if (digits.length === 10 && digits.startsWith('9')) {
      digits = '0' + digits;
    }
    if (digits.length === 11 && digits.startsWith('09')) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return phone.trim();
  }

  sendMobileLoginVerification(phoneInput) {
    if (!phoneInput || !phoneInput.trim()) {
      throw new Error('Please enter your mobile phone number.');
    }
    const cleanDigits = phoneInput.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      throw new Error('Please enter a valid 11-digit mobile number (e.g. 0917-123-4567).');
    }
    const formattedPhone = this.normalizePhoneNumber(phoneInput);
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Store pending verification in localStorage with 10-minute expiry
    const verification = {
      phone: formattedPhone,
      cleanDigits,
      code,
      expiresAt: Date.now() + (10 * 60 * 1000)
    };
    localStorage.setItem('taralets_pending_mobile_verification', JSON.stringify(verification));

    // Check if passenger already exists
    const passengers = this.getPassengers();
    const existing = passengers.find(p => {
      const pDigits = (p.phone || '').replace(/[^0-9]/g, '');
      return pDigits && (pDigits === cleanDigits || pDigits.endsWith(cleanDigits.slice(-9)) || cleanDigits.endsWith(pDigits.slice(-9)));
    });

    return {
      phone: formattedPhone,
      cleanDigits,
      code,
      isExisting: !!existing,
      passenger: existing || null
    };
  }

  verifyMobileLoginCode(phoneInput, codeInput) {
    if (!codeInput || codeInput.trim().length < 4) {
      throw new Error('Please enter the 4-digit SMS verification code.');
    }
    const cleanCode = codeInput.trim();
    const rawPending = localStorage.getItem('taralets_pending_mobile_verification');
    let valid = false;

    // Allow demo master codes '1234' or '0000' or matching generated code
    if (cleanCode === '1234' || cleanCode === '0000') {
      valid = true;
    } else if (rawPending) {
      try {
        const pending = JSON.parse(rawPending);
        if (pending.code === cleanCode) {
          valid = true;
        }
      } catch (e) {}
    }

    if (!valid) {
      throw new Error('Invalid verification code. Please check your SMS or use demo code 1234.');
    }

    localStorage.removeItem('taralets_pending_mobile_verification');
    const cleanDigits = (phoneInput || '').replace(/[^0-9]/g, '');
    const formattedPhone = this.normalizePhoneNumber(phoneInput);
    const passengers = this.getPassengers();

    let matched = passengers.find(p => {
      const pDigits = (p.phone || '').replace(/[^0-9]/g, '');
      return pDigits && (pDigits === cleanDigits || pDigits.endsWith(cleanDigits.slice(-9)) || cleanDigits.endsWith(pDigits.slice(-9)));
    });

    if (matched) {
      this.setCurrentPassengerId(matched.id);
      localStorage.setItem(STORAGE_KEYS.PASSENGER_LOGGED_IN, 'true');
      this.setCommuterOnlyMode(true);
      this.setActiveRole('passenger');
      window.dispatchEvent(new CustomEvent('taralets:passenger-logged-in', { detail: matched }));
      return { isNew: false, passenger: matched };
    }

    // Auto-register verified new commuter
    const newPassenger = this.registerPassenger({
      name: `Commuter (${formattedPhone.slice(-4)})`,
      phone: formattedPhone,
      company: 'Verified Corporate Commuter',
      workplaceId: 'hub-bgc',
      pickupLocation: 'Preferred Landmark',
      status: 'looking'
    });

    return { isNew: true, passenger: newPassenger };
  }

  loginPassenger(identifier) {
    if (!identifier) {
      throw new Error('Please enter your registered mobile phone number, email, or select an account.');
    }
    const cleanRaw = identifier.trim();
    const cleanLower = cleanRaw.toLowerCase();
    const cleanDigits = cleanRaw.replace(/[^0-9]/g, '');
    const passengers = this.getPassengers();

    const matched = passengers.find(p => {
      if (p.id === cleanRaw) return true;
      if (p.email && p.email.toLowerCase() === cleanLower) return true;
      if (p.phone) {
        const pDigits = p.phone.replace(/[^0-9]/g, '');
        if (cleanDigits.length >= 7 && pDigits.includes(cleanDigits)) return true;
        if (cleanDigits.length >= 7 && cleanDigits.includes(pDigits)) return true;
      }
      if (p.name && p.name.toLowerCase() === cleanLower) return true;
      return false;
    });

    if (!matched) {
      throw new Error(`No registered commuter account found for "${cleanRaw}". Please verify or sign up first.`);
    }

    this.setCurrentPassengerId(matched.id);
    localStorage.setItem('taralets_passenger_logged_in', 'true');
    this.setCommuterOnlyMode(true);
    this.setActiveRole('passenger');
    window.dispatchEvent(new CustomEvent('taralets:passenger-logged-in', { detail: matched }));
    return matched;
  }

  logoutPassenger() {
    const currentPax = this.getCurrentPassenger();
    localStorage.removeItem('taralets_passenger_logged_in');
    this.setCommuterOnlyMode(false);
    window.dispatchEvent(new CustomEvent('taralets:passenger-logged-out', { detail: currentPax }));
    return currentPax;
  }

  registerPassenger(data) {
    const id = "pax-" + Date.now();
    const hubs = this.getWorkplaceHubs();
    const hub = hubs.find(h => h.id === data.workplaceId) || hubs[0];

    const hubLat = hub.lat || 14.5518;
    const hubLng = hub.lng || 121.0494;

    const newPassenger = {
      id,
      name: data.name ? data.name.trim() : "Office Commuter",
      avatar: data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      phone: data.phone ? data.phone.trim() : "0917-000-0000",
      email: data.email ? data.email.trim() : `${(data.name || 'commuter').toLowerCase().replace(/[^a-z0-9]/g, '.')}@${(data.company || 'corp').toLowerCase().replace(/[^a-z0-9]/g, '')}.ph`,
      workplaceId: data.workplaceId || hub.id,
      company: data.company ? data.company.trim() : hub.name,
      jobTitle: data.jobTitle ? data.jobTitle.trim() : "Verified Professional",
      employeeBadgeId: data.employeeBadgeId ? data.employeeBadgeId.trim() : `#EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      workSchedule: data.workSchedule || "08:00 AM - 05:00 PM",
      pickupLocation: data.pickupLocation ? data.pickupLocation.trim() : "Designated Meeting Landmark",
      pickupLat: data.pickupLat || (hubLat - 0.05),
      pickupLng: data.pickupLng || (hubLng - 0.02),
      vehiclePreference: data.vehiclePreference || "any",
      preferredPaymentMode: data.preferredPaymentMode || "gcash",
      status: "looking",
      walletBalance: 500.00,
      willingToShareFare: true,
      bio: data.bio || `Daily commuter heading to ${data.company || hub.name}. Verified and punctual co-worker.`,
      registeredAt: new Date().toISOString()
    };

    this.savePassenger(newPassenger);
    this.setCurrentPassengerId(newPassenger.id);
    localStorage.setItem('taralets_passenger_logged_in', 'true');
    this.setCommuterOnlyMode(true);
    this.setActiveRole('passenger');
    window.dispatchEvent(new CustomEvent('taralets:passenger-registered', { detail: newPassenger }));
    return newPassenger;
  }

  // --- Trips ---
  getTrips() {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return raw ? JSON.parse(raw) : INITIAL_COMMUTE_TRIPS;
  }

  getTripById(tripId) {
    return this.getTrips().find(t => t.id === tripId);
  }

  getTripsByDriver(driverId) {
    return this.getTrips().filter(t => t.driverId === driverId);
  }

  createTrip(newTrip) {
    const trips = this.getTrips();
    trips.unshift(newTrip);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    window.dispatchEvent(new CustomEvent('taralets:trip-created', { detail: newTrip }));
    return newTrip;
  }

  updateTrip(updatedTrip) {
    const trips = this.getTrips();
    const idx = trips.findIndex(t => t.id === updatedTrip.id);
    if (idx >= 0) {
      trips[idx] = updatedTrip;
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
      window.dispatchEvent(new CustomEvent('taralets:trip-updated', { detail: updatedTrip }));
    }
    return updatedTrip;
  }

  // --- Driver-Initiated Bookings ---
  getBookings() {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return raw ? JSON.parse(raw) : INITIAL_BOOKINGS;
  }

  getBookingById(id) {
    return this.getBookings().find(b => b.id === id);
  }

  /**
   * Driver initiates booking for passenger with specific payment mode
   */
  createDriverBooking({ tripId, passengerId, driverNote, customFare, paymentModeId = 'gcash' }) {
    const trips = this.getTrips();
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");

    if (trip.bookedSeats >= trip.totalSeats) {
      throw new Error(`This ${trip.vehicleType} has reached full capacity! (${trip.totalSeats}/${trip.totalSeats})`);
    }

    const passenger = this.getPassengers().find(p => p.id === passengerId);
    if (!passenger) throw new Error("Passenger not found");

    const driver = this.getDrivers().find(d => d.id === trip.driverId) || this.getCurrentDriver();
    const fareAmount = customFare !== undefined ? Number(customFare) : trip.farePerSeat;
    const mode = this.getPaymentModeById(paymentModeId);

    // If passenger is paying via in-app TaraLets Commute Wallet
    let isWalletPaid = false;
    if (paymentModeId === 'wallet') {
      if ((passenger.walletBalance || 0) < fareAmount) {
        throw new Error(`Insufficient wallet balance! Commuter balance is ₱${(passenger.walletBalance || 0).toFixed(2)}, required ₱${fareAmount}. Please choose GCash or Cash.`);
      }
      // Deduct from passenger
      passenger.walletBalance -= fareAmount;
      this.savePassenger(passenger);
      // Credit to driver
      driver.walletBalance = (driver.walletBalance || 0) + fareAmount;
      this.saveDriver(driver);
      isWalletPaid = true;
    }

    const bookingId = "bk-" + Date.now();
    const newBooking = {
      id: bookingId,
      tripId: trip.id,
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
      vehicleType: trip.vehicleType,
      vehicleModel: trip.vehicleModel + (trip.plate ? ` (${trip.plate})` : ''),
      passengerId: passenger.id,
      passengerName: passenger.name,
      passengerPhone: passenger.phone,
      passengerAvatar: passenger.avatar,
      workplaceName: passenger.company || trip.destinationName,
      pickupPoint: passenger.pickupLocation,
      destinationPoint: trip.destinationName,
      scheduledTime: trip.departureTime,
      fare: fareAmount,
      status: "confirmed",
      initiatedBy: "driver",
      driverNote: driverNote || `Driver ${driver.name} created this booking for your shared route to ${trip.destinationName}.`,
      payment: {
        modeId: mode.id,
        modeName: mode.name,
        amount: fareAmount,
        status: isWalletPaid ? "paid" : (mode.id === 'cash' ? "pending_cash" : "pending_digital"),
        referenceNo: isWalletPaid ? `WALLET-${Date.now().toString().slice(-6)}` : (mode.id === 'cash' ? "CASH-ON-BOARDING" : `GC-${Math.floor(100000000 + Math.random() * 900000000)}`),
        paidAt: isWalletPaid ? new Date().toISOString() : null
      },
      createdAt: new Date().toISOString()
    };

    // Update Bookings
    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Update Trip seats and booked passenger list
    trip.bookedSeats = (trip.bookedSeats || 0) + 1;
    if (!trip.bookedPassengerIds) trip.bookedPassengerIds = [];
    if (!trip.bookedPassengerIds.includes(passenger.id)) {
      trip.bookedPassengerIds.push(passenger.id);
    }
    this.updateTrip(trip);

    // Update Passenger status
    passenger.status = 'booked';
    this.savePassenger(passenger);

    // Log transaction
    this.addTransaction({
      userId: passenger.id,
      userType: "passenger",
      type: "fare_booking",
      amount: -fareAmount,
      modeId: mode.id,
      description: `Carpool share to ${trip.destinationName} (${driver.name})`
    });

    // Generate initial coordination message
    this.addMessage({
      bookingId: newBooking.id,
      sender: "driver",
      senderName: driver.name,
      text: `Hello ${passenger.name}! I booked your seat in my ${trip.vehicleType} (${trip.vehicleModel}). Fare: ₱${fareAmount} via ${mode.name}. Route: ${trip.routeVia || trip.destinationName}. Departure: ${trip.departureTime}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    window.dispatchEvent(new CustomEvent('taralets:booking-created', { detail: newBooking }));
    return newBooking;
  }

  /**
   * Passenger requests to book a seat on a driver's posted route
   */
  createPassengerBookingRequest({ tripId, passengerId, pickupPoint, paymentModeId = 'gcash', passengerNote }) {
    const trips = this.getTrips();
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");

    if (trip.bookedSeats >= trip.totalSeats) {
      throw new Error(`Trip is already full! (${trip.totalSeats}/${trip.totalSeats})`);
    }

    const passenger = this.getPassengers().find(p => p.id === passengerId) || this.getCurrentPassenger();
    const driver = this.getDrivers().find(d => d.id === trip.driverId);
    const mode = this.getPaymentModeById(paymentModeId);

    const bookingId = "bk-" + Date.now();
    const newBooking = {
      id: bookingId,
      tripId: trip.id,
      driverId: trip.driverId,
      driverName: trip.driverName,
      driverPhone: driver ? driver.phone : "0917-555-0000",
      vehicleType: trip.vehicleType,
      vehicleModel: trip.vehicleModel + (trip.plate ? ` (${trip.plate})` : ''),
      passengerId: passenger.id,
      passengerName: passenger.name,
      passengerPhone: passenger.phone,
      passengerAvatar: passenger.avatar,
      workplaceName: passenger.company || trip.destinationName,
      pickupPoint: pickupPoint || passenger.pickupLocation,
      destinationPoint: trip.destinationName,
      scheduledTime: trip.departureTime,
      fare: trip.farePerSeat,
      status: "pending_verification",
      initiatedBy: "passenger",
      passengerVerification: {
        companyName: passenger.company,
        companyEmail: `${passenger.name.toLowerCase().replace(/[^a-z]/g, '.')}@${passenger.company.toLowerCase().includes('google') ? 'google.com' : passenger.company.toLowerCase().includes('shopee') ? 'shopee.com' : 'corp.ph'}`,
        employeeIdBadge: `VERIFIED_EMPLOYEE_#${passenger.id.toUpperCase()}`,
        workplaceId: passenger.workplaceId,
        workSchedule: passenger.workSchedule || '08:00 AM - 05:00 PM',
        pickupAddress: pickupPoint || passenger.pickupLocation,
        note: passengerNote || "Commuting to our workplace. I have my company ID and exact fare ready!"
      },
      payment: {
        modeId: mode.id,
        modeName: mode.name,
        amount: trip.farePerSeat,
        status: "pending_digital",
        referenceNo: "AWAITING_DRIVER_VERIFICATION",
        paidAt: null
      },
      createdAt: new Date().toISOString()
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    window.dispatchEvent(new CustomEvent('taralets:booking-requested', { detail: newBooking }));
    return newBooking;
  }

  /**
   * Driver verifies passenger details and accepts booking
   */
  acceptPassengerBooking(bookingId) {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error("Booking request not found");

    const trip = this.getTripById(booking.tripId);
    if (!trip) throw new Error("Trip not found");

    if (trip.bookedSeats >= trip.totalSeats) {
      throw new Error(`Vehicle has already reached full capacity (${trip.totalSeats}/${trip.totalSeats})!`);
    }

    booking.status = "confirmed";
    booking.driverVerifiedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    trip.bookedSeats = (trip.bookedSeats || 0) + 1;
    if (!trip.bookedPassengerIds) trip.bookedPassengerIds = [];
    if (!trip.bookedPassengerIds.includes(booking.passengerId)) {
      trip.bookedPassengerIds.push(booking.passengerId);
    }
    this.updateTrip(trip);

    const passenger = this.getPassengers().find(p => p.id === booking.passengerId);
    if (passenger) {
      passenger.status = 'booked';
      this.savePassenger(passenger);
    }

    this.addMessage({
      bookingId: booking.id,
      sender: "driver",
      senderName: booking.driverName,
      text: `Hello ${booking.passengerName}! I have reviewed and verified your workplace details (${booking.passengerVerification?.companyName || 'Verified Co-Worker'}). Your booking is ACCEPTED! See you at ${booking.pickupPoint} at ${booking.scheduledTime}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    window.dispatchEvent(new CustomEvent('taralets:booking-accepted', { detail: booking }));
    return booking;
  }

  /**
   * Driver declines passenger booking request
   */
  declinePassengerBooking(bookingId, reason = "Route conflict / Capacity limit") {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = "declined";
    booking.declineReason = reason;
    booking.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    window.dispatchEvent(new CustomEvent('taralets:booking-declined', { detail: booking }));
    return booking;
  }

  updateBookingStatus(bookingId, status) {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    // If ride completed and cash payment, mark payment as paid
    if (status === 'completed' && booking.payment && booking.payment.modeId === 'cash') {
      booking.payment.status = 'paid';
      booking.payment.paidAt = new Date().toISOString();
    }

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    if (status === 'cancelled') {
      const trips = this.getTrips();
      const trip = trips.find(t => t.id === booking.tripId);
      if (trip && trip.bookedSeats > 0) {
        trip.bookedSeats -= 1;
        trip.bookedPassengerIds = (trip.bookedPassengerIds || []).filter(pid => pid !== booking.passengerId);
        this.updateTrip(trip);
      }
      const pax = this.getPassengers().find(p => p.id === booking.passengerId);
      if (pax) {
        pax.status = 'looking';
        this.savePassenger(pax);
      }
    }

    window.dispatchEvent(new CustomEvent('taralets:booking-updated', { detail: booking }));
    return booking;
  }

  markPaymentAsPaid(bookingId, referenceNo) {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    if (!booking.payment) {
      booking.payment = { modeId: 'gcash', modeName: 'GCash', amount: booking.fare };
    }

    booking.payment.status = 'paid';
    booking.payment.referenceNo = referenceNo || `REF-${Math.floor(100000000 + Math.random() * 900000000)}`;
    booking.payment.paidAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('taralets:payment-updated', { detail: booking }));
    return booking;
  }

  // --- Wallet & Top-Up System ---
  topUpWallet(role, userId, amount, paymentModeId = 'gcash') {
    const amt = Number(amount);
    if (amt <= 0) throw new Error("Invalid top-up amount");

    if (role === 'driver') {
      const drivers = this.getDrivers();
      const drv = drivers.find(d => d.id === userId);
      if (drv) {
        drv.walletBalance = (drv.walletBalance || 0) + amt;
        this.saveDriver(drv);
      }
    } else {
      const passengers = this.getPassengers();
      const pax = passengers.find(p => p.id === userId);
      if (pax) {
        pax.walletBalance = (pax.walletBalance || 0) + amt;
        this.savePassenger(pax);
      }
    }

    const mode = this.getPaymentModeById(paymentModeId);
    this.addTransaction({
      userId,
      userType: role,
      type: "wallet_topup",
      amount: amt,
      modeId: paymentModeId,
      description: `Loaded Commute Wallet via ${mode.name}`
    });

    window.dispatchEvent(new CustomEvent('taralets:wallet-updated', { detail: { role, userId, amount: amt } }));
    return amt;
  }

  getTransactions(userId) {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const all = raw ? JSON.parse(raw) : [];
    return userId ? all.filter(t => t.userId === userId) : all;
  }

  addTransaction(txData) {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const all = raw ? JSON.parse(raw) : [];
    const newTx = {
      id: "tx-" + Date.now(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "completed",
      ...txData
    };
    all.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    return newTx;
  }

  // --- Messages ---
  getMessages(bookingId) {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all = raw ? JSON.parse(raw) : [];
    return bookingId ? all.filter(m => m.bookingId === bookingId) : all;
  }

  addMessage({ bookingId, sender, senderName, text, time }) {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all = raw ? JSON.parse(raw) : [];
    const msg = {
      id: "msg-" + Date.now() + Math.random().toString(36).substring(2, 5),
      bookingId,
      sender,
      senderName,
      text,
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    all.push(msg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent('taralets:new-message', { detail: msg }));
    return msg;
  }

  // ========================================================
  // DEVELOPER & FLEET API KEYS MANAGEMENT
  // ========================================================
  getApiKeys() {
    const raw = localStorage.getItem('taralets_api_keys');
    if (!raw) {
      const initialKeys = [
        {
          id: "key-demo-1",
          name: "Company Fleet Telemetry & Mobile Sync",
          key: "tl_live_9f8a4b2c1e7d6a5f3e2b1c4a8d7e9f0a",
          environment: "live",
          scopes: ["read:trips", "read:gps", "write:bookings"],
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          lastUsed: "Just now",
          status: "active"
        }
      ];
      localStorage.setItem('taralets_api_keys', JSON.stringify(initialKeys));
      return initialKeys;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  generateApiKey(name, environment = 'live', scopes = ['read:trips', 'read:gps']) {
    const keys = this.getApiKeys();
    
    // Generate 32-character random hex token
    const randomBytes = new Uint8Array(16);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(randomBytes);
    } else {
      for (let i = 0; i < 16; i++) randomBytes[i] = Math.floor(Math.random() * 256);
    }
    const tokenHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const prefix = environment === 'test' ? 'tl_test_' : 'tl_live_';
    const apiKeyString = prefix + tokenHex;

    const newKey = {
      id: "key-" + Date.now(),
      name: name && name.trim() ? name.trim() : "Fleet Mobile Integration Key",
      key: apiKeyString,
      environment,
      scopes: scopes && scopes.length > 0 ? scopes : ["read:trips", "read:gps"],
      createdAt: new Date().toISOString(),
      lastUsed: "Never",
      status: "active"
    };

    keys.unshift(newKey);
    localStorage.setItem('taralets_api_keys', JSON.stringify(keys));
    window.dispatchEvent(new CustomEvent('taralets:api-key-created', { detail: newKey }));
    return newKey;
  }

  revokeApiKey(keyId) {
    const keys = this.getApiKeys();
    const target = keys.find(k => k.id === keyId);
    if (target) {
      target.status = target.status === 'active' ? 'revoked' : 'active';
      localStorage.setItem('taralets_api_keys', JSON.stringify(keys));
      window.dispatchEvent(new CustomEvent('taralets:api-keys-updated', { detail: keys }));
    }
    return target;
  }

  deleteApiKey(keyId) {
    let keys = this.getApiKeys();
    keys = keys.filter(k => k.id !== keyId);
    localStorage.setItem('taralets_api_keys', JSON.stringify(keys));
    window.dispatchEvent(new CustomEvent('taralets:api-keys-updated', { detail: keys }));
    return keys;
  }

  simulateApiRequest(endpoint, apiKeyString) {
    const keys = this.getApiKeys();
    const matchedKey = keys.find(k => k.key === apiKeyString && k.status === 'active');
    
    if (!matchedKey) {
      return {
        status: 401,
        error: "Unauthorized",
        message: "Invalid or revoked API key. Pass 'Authorization: Bearer tl_live_...' in HTTP headers."
      };
    }

    matchedKey.lastUsed = "Just now";
    localStorage.setItem('taralets_api_keys', JSON.stringify(keys));

    if (endpoint === 'gps') {
      const trips = this.getTrips();
      const firstTrip = trips[0] || {};
      return {
        status: 200,
        endpoint: "/api/v1/driver/gps",
        timestamp: new Date().toISOString(),
        apiKeyPrefix: matchedKey.key.substring(0, 10) + "••••••••",
        telemetry: {
          tripId: firstTrip.id,
          driverName: firstTrip.driverName,
          vehicle: `${firstTrip.vehicleType === 'motorcycle' ? 'Motorcycle' : 'Car'}: ${firstTrip.vehicleModel}`,
          plate: firstTrip.plate || "Verified",
          gps: {
            latitude: Number(firstTrip.originLat) ? (Number(firstTrip.originLat) + 0.012).toFixed(6) : "14.717600",
            longitude: Number(firstTrip.originLng) ? (Number(firstTrip.originLng) + 0.008).toFixed(6) : "121.060100",
            speedKmh: 42.5,
            heading: "148° SE toward BGC Corridor",
            accuracyMeters: 3.5,
            status: "GPS_FIX_ONLINE"
          },
          corridor: {
            origin: firstTrip.originName,
            destination: firstTrip.destinationName,
            departureTime: firstTrip.departureTime,
            seatsRemaining: (firstTrip.totalSeats || 3) - (firstTrip.bookedSeats || 0)
          }
        }
      };
    } else if (endpoint === 'trips') {
      const trips = this.getTrips();
      return {
        status: 200,
        endpoint: "/api/v1/trips",
        timestamp: new Date().toISOString(),
        apiKeyPrefix: matchedKey.key.substring(0, 10) + "••••••••",
        total: trips.length,
        trips: trips.map(t => ({
          id: t.id,
          driver: t.driverName,
          vehicle: `${t.vehicleType}: ${t.vehicleModel}`,
          origin: t.originName,
          destination: t.destinationName,
          departureTime: t.departureTime,
          fare: t.farePerSeat,
          seatsAvailable: t.totalSeats - (t.bookedSeats || 0)
        }))
      };
    } else {
      const bookings = this.getBookings();
      return {
        status: 200,
        endpoint: "/api/v1/bookings",
        timestamp: new Date().toISOString(),
        apiKeyPrefix: matchedKey.key.substring(0, 10) + "••••••••",
        total: bookings.length,
        bookings: bookings.slice(0, 5)
      };
    }
  }
}
const storage = new StorageService();


  // --- MATCHING ENGINE ---
  /**
 * TaraLets - Workplace & Commute Match Engine
 * Computes compatibility between Driver routes and Passengers based on
 * shared office locations, job centers, shift times, and corridor proximity.
 */

/**
 * Calculates straight line distance (Haversine formula in km)
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0; // fallback reasonable metro dist
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

/**
 * Evaluates compatibility score (0 - 100%) between a Driver (or specific Trip) and a Passenger
 */
function evaluateWorkplaceMatch(driverOrTrip, passenger) {
  let score = 50;
  const badges = [];
  const reasons = [];

  const driverWorkplaceId = driverOrTrip.workplaceId;
  const passengerWorkplaceId = passenger.workplaceId;

  // 1. Same Office Hub Check
  if (driverWorkplaceId && passengerWorkplaceId && driverWorkplaceId === passengerWorkplaceId) {
    score += 35;
    badges.push("SAME WORK DISTRICT");
    reasons.push("Both heading to the exact same business hub");
  } else {
    // Check if hubs are nearby (e.g. Makati and BGC are neighboring)
    const isNearbyHub = (driverWorkplaceId === 'hub-bgc' && passengerWorkplaceId === 'hub-makati') ||
                        (driverWorkplaceId === 'hub-makati' && passengerWorkplaceId === 'hub-bgc') ||
                        (driverWorkplaceId === 'hub-ortigas' && passengerWorkplaceId === 'hub-eastwood');
    if (isNearbyHub) {
      score += 15;
      badges.push("ADJACENT DISTRICT");
      reasons.push("Neighboring business hub along common arterial road");
    }
  }

  // 2. Company / Building Similarity
  const driverCompany = (driverOrTrip.company || driverOrTrip.destinationName || "").toLowerCase();
  const passengerCompany = (passenger.company || "").toLowerCase();

  if (driverCompany && passengerCompany) {
    const words = driverCompany.split(/[\s,()]+/).filter(w => w.length > 3);
    const hasSharedWord = words.some(w => passengerCompany.includes(w));
    if (hasSharedWord || driverCompany.includes(passengerCompany) || passengerCompany.includes(driverCompany)) {
      score += 15;
      badges.push("SAME OFFICE / COMPANY");
      reasons.push("Direct employer or same office building match!");
    }
  }

  // 3. Vehicle compatibility
  const vehicleType = driverOrTrip.vehicleType || (driverOrTrip.vehicle && driverOrTrip.vehicle.type) || 'car';
  if (vehicleType === 'motorcycle') {
    if (passenger.vehiclePreference === 'car') {
      score -= 20;
      reasons.push("Passenger prefers car, but motorcycle is available");
    } else {
      score += 5;
      badges.push("MOTORCYCLE READY");
      reasons.push("Quick 2-wheel rush-hour lane filtering");
    }
  } else if (vehicleType === 'car') {
    score += 5;
    badges.push("COMFORT CAR");
  }

  // 4. Shift & Departure Time alignment
  const tripTime = driverOrTrip.departureTime || driverOrTrip.workSchedule || "";
  const passengerShift = passenger.workSchedule || "";
  if (tripTime && passengerShift) {
    // Simple heuristics: extract hour numbers
    const tripHour = parseInt(tripTime.match(/\d+/)?.[0] || "8", 10);
    const paxHour = parseInt(passengerShift.match(/\d+/)?.[0] || "8", 10);
    const hourDiff = Math.abs(tripHour - paxHour);

    if (hourDiff <= 1) {
      score += 10;
      badges.push("SHIFT TIME SYNC");
      reasons.push("Work shift starts at roughly the same hour");
    }
  }

  // Normalize score between 40% and 99%
  const finalScore = Math.min(99, Math.max(40, score));

  return {
    score: finalScore,
    badges: badges.slice(0, 3),
    reasons: reasons,
    isSameWorkplace: driverWorkplaceId === passengerWorkplaceId,
    vehicleType
  };
}

/**
 * Finds and ranks matching passengers for a driver's trip
 */
function getMatchingPassengersForTrip(trip) {
  const allPassengers = storage.getPassengers();
  
  return allPassengers
    .map(pax => {
      const match = evaluateWorkplaceMatch(trip, pax);
      const isAlreadyBookedInThisTrip = (trip.bookedPassengerIds || []).includes(pax.id);
      return {
        passenger: pax,
        match,
        isAlreadyBookedInThisTrip,
        canBeBooked: !isAlreadyBookedInThisTrip && (trip.bookedSeats < trip.totalSeats)
      };
    })
    .sort((a, b) => b.match.score - a.match.score);
}

/**
 * Finds matching driver trips for a passenger
 */
function getMatchingTripsForPassenger(passenger) {
  const allTrips = storage.getTrips().filter(t => t.status === 'active');
  return allTrips
    .map(trip => {
      const match = evaluateWorkplaceMatch(trip, passenger);
      const isAlreadyBooked = (trip.bookedPassengerIds || []).includes(passenger.id);
      return {
        trip,
        match,
        isAlreadyBooked,
        availableSeats: trip.totalSeats - (trip.bookedSeats || 0)
      };
    })
    .sort((a, b) => b.match.score - a.match.score);
}


  // --- MAP MANAGER ---
  /**
 * TaraLets - Interactive Map Manager (Leaflet & OpenStreetMap)
 * Renders Driver origin, Office destination, and Passenger pickup points
 */
class CommuteMapManager {
  constructor(mapContainerId = 'commute-map') {
    this.containerId = mapContainerId;
    this.map = null;
    this.markersLayer = null;
    this.routeLayer = null;
    this.defaultCenter = [14.5800, 121.0500]; // Metro Manila Center
    this.defaultZoom = 12;
  }

  init() {
    const el = document.getElementById(this.containerId);
    if (!el || typeof L === 'undefined') return;

    if (this.map) {
      this.map.remove();
    }

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    this.map = L.map(this.containerId, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false,
      tap: false
    }).setView(this.defaultCenter, this.defaultZoom);

    // On touch devices, allow window scrolling over map; tapping map activates drag
    if (isTouchDevice && this.map.dragging) {
      this.map.dragging.disable();
      const container = document.getElementById(this.containerId);
      if (container) {
        container.addEventListener('click', () => {
          if (this.map && this.map.dragging && !this.map.dragging.enabled()) {
            this.map.dragging.enable();
          }
        }, { passive: true });
      }
    }

    // High quality modern tile layer (CartoDB Positron / OSM)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    this.markersLayer = L.featureGroup().addTo(this.map);
    this.routeLayer = L.featureGroup().addTo(this.map);
  }

  renderTripView(trip, matchingPassengers = []) {
    if (!this.map) this.init();
    if (!this.map) return;

    this.markersLayer.clearLayers();
    this.routeLayer.clearLayers();

    const isMotorcycle = trip.vehicleType === 'motorcycle';
    const routeColor = isMotorcycle ? '#10b981' : '#3b82f6';

    const originLat = trip.originLat || 14.6500;
    const originLng = trip.originLng || 121.0300;
    const destLat = trip.destinationLat || 14.5507;
    const destLng = trip.destinationLng || 121.0509;

    // Driver Start Icon
    const driverIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: ${routeColor}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white; font-size: 18px;">
          ${isMotorcycle ? '🏍️' : '🚗'}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const driverMarker = L.marker([originLat, originLng], { icon: driverIcon }).addTo(this.markersLayer);
    driverMarker.bindPopup(`
      <div class="p-2">
        <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 uppercase mb-1">
          Driver Departure Point
        </span>
        <h4 class="font-bold text-gray-900">${trip.driverName}</h4>
        <p class="text-xs text-gray-600">${trip.originName}</p>
        <p class="text-xs font-medium text-emerald-600 mt-1">Departs: ${trip.departureTime}</p>
      </div>
    `);

    // Office Destination Icon
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #8b5cf6; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px rgba(139,92,246,0.5); border: 3px solid white; font-size: 18px;">
          🏢
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(this.markersLayer);
    destMarker.bindPopup(`
      <div class="p-2">
        <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-800 uppercase mb-1">
          Shared Workplace / Hub
        </span>
        <h4 class="font-bold text-gray-900">${trip.destinationName}</h4>
        <p class="text-xs text-gray-500">Destination of Commute</p>
      </div>
    `);

    // Draw route polyline
    const routeCoords = [
      [originLat, originLng],
      // Waypoint approximation for Metro Manila highways
      [(originLat + destLat) / 2 + 0.015, (originLng + destLng) / 2 + 0.01],
      [destLat, destLng]
    ];

    const polyline = L.polyline(routeCoords, {
      color: routeColor,
      weight: 5,
      opacity: 0.85,
      dashArray: isMotorcycle ? '6, 8' : null
    }).addTo(this.routeLayer);

    // Plot matching passenger pickup points
    matchingPassengers.forEach(item => {
      const p = item.passenger;
      if (!p.pickupLat || !p.pickupLng) return;

      const isBooked = item.isAlreadyBookedInThisTrip;
      const paxIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background-color: ${isBooked ? '#10b981' : '#f59e0b'}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.25); border: 2px solid white; font-size: 14px; font-weight: bold;">
            ${isBooked ? '✓' : '🧍'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const paxMarker = L.marker([p.pickupLat, p.pickupLng], { icon: paxIcon }).addTo(this.markersLayer);
      
      const popupHtml = `
        <div class="p-2 text-sm" style="min-width: 190px;">
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 text-[11px] font-bold rounded ${isBooked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${isBooked ? 'Booked Co-Passenger' : `${item.match.score}% Work Match`}
            </span>
          </div>
          <div class="font-bold text-gray-900">${p.name}</div>
          <div class="text-xs text-gray-600 font-medium">🏢 ${p.company}</div>
          <div class="text-xs text-gray-500 mt-1">📍 Pickup: ${p.pickupLocation}</div>
          ${!isBooked && item.canBeBooked ? `
            <button onclick="window.taraletsApp.openBookingModal('${trip.id}', '${p.id}')" 
              class="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded shadow transition">
              Book this Passenger
            </button>
          ` : isBooked ? `
            <div class="mt-2 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 py-1 rounded">
              Confirmed on this trip!
            </div>
          ` : `
            <div class="mt-2 text-center text-xs text-gray-400 bg-gray-50 py-1 rounded">
              Trip is Full
            </div>
          `}
        </div>
      `;

      paxMarker.bindPopup(popupHtml);
    });

    // Fit map bounds
    try {
      const group = new L.featureGroup([this.markersLayer, this.routeLayer]);
      this.map.fitBounds(group.getBounds().pad(0.2));
    } catch (e) {
      this.map.setView([originLat, originLng], 12);
    }
  }

  /**
   * Render Driver GPS & Corridor Route for Passenger Mobile App
   * Shows: Live Driver Vehicle GPS Marker with beacon, Passenger Pickup Pin, Workplace Destination, and Full Route
   */
  renderPassengerGpsView(trip, passenger) {
    if (!this.map) this.init();
    if (!this.map || !trip || !passenger) return;

    this.markersLayer.clearLayers();
    this.routeLayer.clearLayers();

    const isMotorcycle = trip.vehicleType === 'motorcycle';
    const routeColor = isMotorcycle ? '#10b981' : '#3b82f6';

    const originLat = Number(trip.originLat) || 14.6500;
    const originLng = Number(trip.originLng) || 121.0300;
    const destLat = Number(trip.destinationLat) || 14.5507;
    const destLng = Number(trip.destinationLng) || 121.0509;

    const paxLat = Number(passenger.pickupLat) || ((originLat + destLat) / 2);
    const paxLng = Number(passenger.pickupLng) || ((originLng + destLng) / 2);

    // Calculate simulated live driver GPS location along the corridor approaching passenger pickup
    const progress = 0.58; // Driver is actively moving along the corridor toward pickup
    const driverGpsLat = originLat + (paxLat - originLat) * progress;
    const driverGpsLng = originLng + (paxLng - originLng) * progress;

    // Approximate distance in km between Driver GPS and Passenger Pickup
    const dLat = (paxLat - driverGpsLat) * 111;
    const dLng = (paxLng - driverGpsLng) * 111 * Math.cos(driverGpsLat * (Math.PI / 180));
    const distKm = Math.max(0.6, Math.sqrt(dLat * dLat + dLng * dLng)).toFixed(1);
    const etaMins = Math.max(3, Math.round(distKm * 2.8));

    // 1. Driver Departure Origin Marker
    const originIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #64748b; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white; font-size: 13px;">
          🚩
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const originMarker = L.marker([originLat, originLng], { icon: originIcon }).addTo(this.markersLayer);
    originMarker.bindPopup(`
      <div class="p-2 text-xs">
        <span class="inline-block px-1.5 py-0.5 font-bold rounded bg-slate-100 text-slate-800 uppercase mb-1 text-[10px]">
          Trip Start
        </span>
        <h4 class="font-bold text-slate-900">${trip.originName}</h4>
        <p class="text-slate-500">Departure: ${trip.departureTime}</p>
      </div>
    `);

    // 2. LIVE DRIVER GPS POSITION MARKER (Pulsing Radar Beacon)
    const driverGpsIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="gps-pulse-beacon" style="background-color: ${routeColor}; width: 44px; height: 44px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border: 3px solid white; font-size: 20px; position: relative; box-shadow: 0 4px 16px rgba(0,0,0,0.35);">
          ${isMotorcycle ? '🏍️' : '🚗'}
          <span style="position: absolute; top: -2px; right: -2px; width: 14px; height: 14px; background: #22c55e; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 0 8px #22c55e;"></span>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    const driverGpsMarker = L.marker([driverGpsLat, driverGpsLng], { icon: driverGpsIcon, zIndexOffset: 1000 }).addTo(this.markersLayer);
    driverGpsMarker.bindPopup(`
      <div class="p-2.5 text-xs min-w-[210px]">
        <div class="flex items-center gap-1.5 mb-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
            LIVE DRIVER GPS
          </span>
        </div>
        <div class="font-extrabold text-sm text-slate-900">${trip.driverName}</div>
        <div class="text-[11px] text-slate-600 font-semibold mt-0.5">${trip.vehicleModel} (${trip.plate || 'Verified'})</div>
        <div class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg space-y-0.5">
          <div class="text-blue-900 font-bold flex items-center justify-between">
            <span>Distance to Pickup:</span>
            <span>~${distKm} km</span>
          </div>
          <div class="text-emerald-700 font-extrabold flex items-center justify-between">
            <span>Estimated Arrival:</span>
            <span>~${etaMins} mins</span>
          </div>
        </div>
        <p class="text-[10px] text-slate-400 mt-1.5">Corridor GPS Signal: 🟢 Active</p>
      </div>
    `);

    // 3. PASSENGER PICKUP LOCATION MARKER
    const paxIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #f59e0b; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(245,158,11,0.5); border: 3px solid white; font-size: 18px;">
          📍
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
    const paxMarker = L.marker([paxLat, paxLng], { icon: paxIcon, zIndexOffset: 500 }).addTo(this.markersLayer);
    paxMarker.bindPopup(`
      <div class="p-2 text-xs min-w-[180px]">
        <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 uppercase mb-1">
          Your Pickup Point
        </span>
        <h4 class="font-bold text-slate-900">${passenger.name}</h4>
        <p class="text-slate-600 font-medium">${passenger.pickupLocation}</p>
        <p class="text-[11px] text-emerald-600 font-bold mt-1">Driver ETA: ~${etaMins} mins (~${distKm} km)</p>
      </div>
    `);

    // 4. WORKPLACE HUB DESTINATION MARKER
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #8b5cf6; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px rgba(139,92,246,0.5); border: 3px solid white; font-size: 18px;">
          🏢
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });
    const destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(this.markersLayer);
    destMarker.bindPopup(`
      <div class="p-2 text-xs">
        <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800 uppercase mb-1">
          Workplace Destination
        </span>
        <h4 class="font-bold text-slate-900">${trip.destinationName}</h4>
        <p class="text-slate-500">${passenger.company}</p>
      </div>
    `);

    // 5. GPS ROUTE POLYLINES (Highway Corridor)
    const fullRouteCoords = [
      [originLat, originLng],
      [driverGpsLat, driverGpsLng],
      [paxLat, paxLng],
      [destLat, destLng]
    ];

    // Background glow line
    L.polyline(fullRouteCoords, {
      color: routeColor,
      weight: 8,
      opacity: 0.35
    }).addTo(this.routeLayer);

    // Foreground active route line
    L.polyline(fullRouteCoords, {
      color: routeColor,
      weight: 5,
      opacity: 0.9,
      dashArray: isMotorcycle ? '6, 8' : null
    }).addTo(this.routeLayer);

    // Auto-fit bounds
    try {
      const group = new L.featureGroup([this.markersLayer, this.routeLayer]);
      this.map.fitBounds(group.getBounds().pad(0.22));
    } catch (e) {
      this.map.setView([driverGpsLat, driverGpsLng], 13);
    }
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }
}


  // --- CHAT MANAGER ---
  /**
 * TaraLets - In-App Ride Coordination Messenger
 * Enables direct chat between Driver and Booked Passenger with instant canned replies
 * and procedural Web Audio notification chime.
 */

class RideChatManager {
  constructor() {
    this.activeBookingId = null;
    this.audioCtx = null;
  }

  playChime() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch (e) {
      // AudioContext might be blocked before first user gesture
    }
  }

  openChat(bookingId) {
    this.activeBookingId = bookingId;
    const booking = storage.getBookingById(bookingId);
    if (!booking) return;

    const modal = document.getElementById('chat-modal');
    if (!modal) return;

    // Set Header Info
    const titleEl = document.getElementById('chat-title');
    const subtitleEl = document.getElementById('chat-subtitle');
    const role = storage.getActiveRole();

    const otherParty = role === 'driver' ? booking.passengerName : booking.driverName;
    const vehicleInfo = `${booking.vehicleType === 'motorcycle' ? '🏍️' : '🚗'} ${booking.vehicleModel}`;

    if (titleEl) titleEl.textContent = `Chat with ${otherParty}`;
    if (subtitleEl) subtitleEl.textContent = `${booking.workplaceName} • ${vehicleInfo}`;

    this.renderMessages();
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Auto focus input
    setTimeout(() => {
      const input = document.getElementById('chat-input');
      if (input) input.focus();
    }, 100);
  }

  closeChat() {
    const modal = document.getElementById('chat-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.activeBookingId = null;
  }

  renderMessages() {
    if (!this.activeBookingId) return;
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const messages = storage.getMessages(this.activeBookingId);
    const activeRole = storage.getActiveRole();

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-400 text-sm">
          <p>No messages yet.</p>
          <p class="text-xs mt-1">Coordinate exact pickup landmark or arrival notes!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(msg => {
      const isMe = (activeRole === 'driver' && msg.sender === 'driver') ||
                   (activeRole === 'passenger' && msg.sender === 'passenger');
      return `
        <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3">
          <div class="text-[11px] text-gray-500 mb-0.5 px-1 font-medium">
            ${isMe ? 'You' : msg.senderName} • ${msg.time}
          </div>
          <div class="max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
            isMe 
              ? 'bg-emerald-600 text-white rounded-br-none' 
              : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
          }">
            ${msg.text}
          </div>
        </div>
      `;
    }).join('');

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  sendMessage(text) {
    if (!this.activeBookingId || !text || !text.trim()) return;

    const booking = storage.getBookingById(this.activeBookingId);
    if (!booking) return;

    const activeRole = storage.getActiveRole();
    const senderName = activeRole === 'driver' ? booking.driverName : booking.passengerName;

    storage.addMessage({
      bookingId: this.activeBookingId,
      sender: activeRole,
      senderName: senderName,
      text: text.trim()
    });

    this.playChime();
    this.renderMessages();

    const input = document.getElementById('chat-input');
    if (input) input.value = '';

    // Simulate smart auto-reply if sent by driver or passenger
    this.simulateCounterpartReply(activeRole, booking);
  }

  simulateCounterpartReply(activeRole, booking) {
    // Only auto-reply if counterpart is simulated
    setTimeout(() => {
      if (this.activeBookingId !== booking.id) return;
      const isSimulatedCounterpart = true;
      if (!isSimulatedCounterpart) return;

      const counterpartRole = activeRole === 'driver' ? 'passenger' : 'driver';
      const counterpartName = activeRole === 'driver' ? booking.passengerName : booking.driverName;

      const cannedRepliesDriver = [
        `Copy that! Driving now along the corridor, ETA 5 minutes. Watch out for hazard lights.`,
        `Got it! I am just 2 blocks away. See you at the pickup point!`,
        `All set! Thanks for letting me know. See you shortly co-worker!`
      ];

      const cannedRepliesPassenger = [
        `Understood, I am already waiting at the curb with my company ID ready!`,
        `Thanks for the update! I can see your vehicle approaching now.`,
        `Noted! See you in a minute. Thank you so much for booking me in your ride!`
      ];

      const replies = counterpartRole === 'driver' ? cannedRepliesDriver : cannedRepliesPassenger;
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      storage.addMessage({
        bookingId: booking.id,
        sender: counterpartRole,
        senderName: counterpartName,
        text: randomReply
      });

      this.playChime();
      this.renderMessages();
    }, 2200);
  }
}
const chatManager = new RideChatManager();


  // --- APP CONTROLLER ---
  /**
 * TaraLets - Core Application Controller
 * Handles Driver/Passenger Workflows, Verification, Bookings, and Payments
 */




class TaraLetsApp {
  constructor() {
    this.mapManager = new CommuteMapManager('commute-map');
    this.passengerMapManager = new CommuteMapManager('passenger-commute-map');
    this.selectedTripId = null;
    this.selectedPassengerMapTripId = null;
    this.selectedBookingPassengerId = null;
    this.requestingTripId = null;
  }

  init() {
    this.initTheme();
    this.handleUrlParams();
    this.setupEventListeners();
    this.mapManager.init();
    this.passengerMapManager.init();
    this.syncActiveRoleUI();
    this.render();
  }

  handleUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      const actionParam = params.get('action');

      if (params.get('commuter_only') === 'true') {
        storage.setCommuterOnlyMode(true);
      }

      if (roleParam === 'driver' || roleParam === 'passenger') {
        storage.setActiveRole(roleParam);
      }

      if (actionParam === 'signup' || actionParam === 'register') {
        setTimeout(() => this.openPassengerSignupModal(), 400);
      } else if (actionParam === 'login' || actionParam === 'signin') {
        setTimeout(() => this.openPassengerLoginModal(), 400);
      } else if (actionParam === 'wallet') {
        setTimeout(() => this.openPaymentCenterModal(), 400);
      } else if (actionParam === 'install' || actionParam === 'qr' || actionParam === 'pwa') {
        setTimeout(() => {
          this.openAppDownloadModal();
          if (actionParam === 'install' || actionParam === 'pwa') {
            this.installPwaApp(roleParam || 'passenger');
          }
        }, 500);
      }
    } catch (e) {
      console.warn('URL param parse notice:', e);
    }
  }

  copyTextToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(successMsg, 'success');
      }).catch(() => {
        this.fallbackCopyText(text, successMsg);
      });
    } else {
      this.fallbackCopyText(text, successMsg);
    }
  }

  fallbackCopyText(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      this.showToast(successMsg, 'success');
    } catch (err) {
      this.showToast('Link: ' + text, 'info');
    }
    document.body.removeChild(ta);
  }

  setupEventListeners() {
    // Role switcher
    document.querySelectorAll('.role-switcher-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.currentTarget.dataset.role;
        storage.setActiveRole(role);
      });
    });

    // Driver selector dropdown
    const driverSelect = document.getElementById('driver-user-select');
    if (driverSelect) {
      driverSelect.addEventListener('change', (e) => {
        storage.setCurrentDriverId(e.target.value);
      });
    }

    // Passenger selector dropdown
    const paxSelect = document.getElementById('passenger-user-select');
    if (paxSelect) {
      paxSelect.addEventListener('change', (e) => {
        storage.setCurrentPassengerId(e.target.value);
      });
    }

    // Modal close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.dataset.closeModal;
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    });

    // Chat form submit
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        if (input && input.value.trim()) {
          chatManager.sendMessage(input.value.trim());
        }
      });
    }

    // Quick chips in chat
    document.querySelectorAll('.chat-quick-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.target.textContent;
        chatManager.sendMessage(text);
      });
    });

    // Reset sample data button
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all trips, commuters, and bookings to default sample data?")) {
          storage.resetToDefaults();
          this.showToast("Data restored to realistic Metro Manila commute scenarios!", "success");
          this.render();
        }
      });
    }

    // Post Trip Form
    const tripForm = document.getElementById('form-post-trip');
    if (tripForm) {
      tripForm.addEventListener('submit', (e) => this.handlePostTripSubmit(e));
    }

    // Driver Booking Form
    const bookingForm = document.getElementById('form-confirm-booking');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => this.handleConfirmBookingSubmit(e));
    }

    // Passenger Request Seat Form
    const reqForm = document.getElementById('form-passenger-request-seat');
    if (reqForm) {
      reqForm.addEventListener('submit', (e) => this.handlePassengerRequestSubmit(e));
    }

    // Add Passenger Request Form
    const paxForm = document.getElementById('form-add-commuter');
    if (paxForm) {
      paxForm.addEventListener('submit', (e) => this.handleAddCommuterSubmit(e));
    }

    // Wallet Top-Up Form
    const topupForm = document.getElementById('form-wallet-topup');
    if (topupForm) {
      topupForm.addEventListener('submit', (e) => this.handleWalletTopupSubmit(e));
    }

    // Passenger Sign-Up Form
    const signupForm = document.getElementById('form-passenger-signup');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handlePassengerSignupSubmit(e));
    }

    // Passenger Log-In Form
    const loginForm = document.getElementById('form-passenger-login');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendLoginOtp();
      });
    }

    // Global custom events
    window.addEventListener('taralets:passenger-registered', (e) => {
      this.showToast(`🎉 Welcome to TaraLets, ${e.detail.name}! Commuter Mode enabled.`, "success");
      this.syncActiveRoleUI();
      this.render();
    });

    window.addEventListener('taralets:passenger-logged-in', (e) => {
      this.showToast(`🎉 Welcome back, ${e.detail.name}! Commuter Mode enabled.`, "success");
      this.syncActiveRoleUI();
      this.render();
    });

    window.addEventListener('taralets:passenger-logged-out', (e) => {
      this.showToast(`Logged out of Commuter Mode. You can log in or sign up anytime.`, "info");
      this.syncActiveRoleUI();
      this.render();
    });

    // PWA Mobile App Installation Listeners
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredInstallPrompt = e;
      console.log('TaraLets PWA beforeinstallprompt captured');
    });

    window.addEventListener('appinstalled', () => {
      window.deferredInstallPrompt = null;
      this.showToast("🎉 TaraLets Mobile App is installed on your Home Screen!", "success");
    });

    window.addEventListener('taralets:role-changed', () => {
      this.syncActiveRoleUI();
      this.render();
    });

    window.addEventListener('taralets:user-changed', () => {
      this.render();
    });

    window.addEventListener('taralets:booking-created', (e) => {
      const pMode = e.detail.payment?.modeName || 'Selected Mode';
      this.showToast(`🎉 Seat booked for ${e.detail.passengerName}! Payment: ${pMode}.`, "success");
      this.render();
    });

    window.addEventListener('taralets:booking-requested', (e) => {
      this.showToast(`🔔 New booking request from ${e.detail.passengerName}! Please verify details.`, "info");
      this.render();
    });

    window.addEventListener('taralets:booking-accepted', (e) => {
      this.showToast(`✓ Booking accepted for ${e.detail.passengerName}!`, "success");
      this.render();
    });

    window.addEventListener('taralets:booking-declined', (e) => {
      this.showToast(`Booking request declined.`, "info");
      this.render();
    });

    window.addEventListener('taralets:booking-updated', (e) => {
      this.showToast(`Trip status updated: ${e.detail.status.toUpperCase()}`, "info");
      this.render();
    });

    window.addEventListener('taralets:trip-created', (e) => {
      this.showToast(`🚀 New commute trip posted for ${e.detail.departureTime}! Matching passengers loaded.`, "success");
      this.render();
    });

    window.addEventListener('taralets:wallet-updated', (e) => {
      this.showToast(`💳 Commute Wallet loaded with +₱${e.detail.amount.toFixed(2)}!`, "success");
      this.render();
    });

    window.addEventListener('taralets:payment-updated', (e) => {
      this.showToast(`✓ Payment of ₱${e.detail.fare} verified successfully!`, "success");
      this.render();
    });
  }

  syncActiveRoleUI() {
    const isCommuterOnly = storage.isCommuterOnlyMode();
    const isPaxLoggedIn = storage.isPassengerLoggedIn();
    const activeRole = isCommuterOnly ? 'passenger' : storage.getActiveRole();
    const isDriver = !isCommuterOnly && activeRole === 'driver';

    const normalRoleSwitcher = document.getElementById('nav-role-switcher');
    const commuterOnlyBadge = document.getElementById('nav-commuter-only-badge');
    const driverSelectContainer = document.getElementById('driver-user-select-container');

    if (isCommuterOnly) {
      if (normalRoleSwitcher) normalRoleSwitcher.classList.add('hidden');
      if (commuterOnlyBadge) {
        commuterOnlyBadge.classList.remove('hidden');
        commuterOnlyBadge.classList.add('flex');
      }
      if (driverSelectContainer) driverSelectContainer.classList.add('hidden');
    } else {
      if (normalRoleSwitcher) normalRoleSwitcher.classList.remove('hidden');
      if (commuterOnlyBadge) {
        commuterOnlyBadge.classList.add('hidden');
        commuterOnlyBadge.classList.remove('flex');
      }
      if (driverSelectContainer) driverSelectContainer.classList.remove('hidden');
    }

    // Synchronize Header Auth Buttons
    const btnHeaderLogin = document.getElementById('btn-header-login');
    const btnHeaderLogout = document.getElementById('btn-header-logout');
    const btnHeaderSignup = document.getElementById('btn-header-signup');

    if (btnHeaderLogin && btnHeaderLogout) {
      if (isPaxLoggedIn || isCommuterOnly) {
        btnHeaderLogin.classList.add('hidden');
        btnHeaderLogin.classList.remove('flex');
        btnHeaderLogout.classList.remove('hidden');
        btnHeaderLogout.classList.add('flex');
        if (btnHeaderSignup) btnHeaderSignup.classList.add('hidden');
      } else {
        btnHeaderLogin.classList.remove('hidden');
        btnHeaderLogin.classList.add('flex');
        btnHeaderLogout.classList.add('hidden');
        btnHeaderLogout.classList.remove('flex');
        if (btnHeaderSignup) {
          btnHeaderSignup.classList.remove('hidden');
          btnHeaderSignup.classList.add('hidden', 'md:flex');
        }
      }
    }

    // Synchronize Passenger Section Action Buttons
    const btnPaxLogin = document.getElementById('btn-pax-login');
    const btnPaxLogout = document.getElementById('btn-pax-logout');
    if (btnPaxLogin && btnPaxLogout) {
      if (isPaxLoggedIn || isCommuterOnly) {
        btnPaxLogin.classList.add('hidden');
        btnPaxLogin.classList.remove('flex');
        btnPaxLogout.classList.remove('hidden');
        btnPaxLogout.classList.add('flex');
      } else {
        btnPaxLogin.classList.remove('hidden');
        btnPaxLogin.classList.add('flex');
        btnPaxLogout.classList.add('hidden');
        btnPaxLogout.classList.remove('flex');
      }
    }

    // Synchronize Mobile Bottom App Bar Account Tab
    const mobileTabAccount = document.getElementById('mobile-tab-account');
    const mobileTabAccountIcon = document.getElementById('mobile-tab-account-icon');
    const mobileTabAccountLabel = document.getElementById('mobile-tab-account-label');
    if (mobileTabAccountIcon && mobileTabAccountLabel) {
      if (isPaxLoggedIn || isCommuterOnly) {
        mobileTabAccountIcon.textContent = '🚪';
        mobileTabAccountLabel.textContent = 'Log Out';
        mobileTabAccountLabel.className = 'text-[9px] font-extrabold mt-1 tracking-tight text-rose-600';
        if (mobileTabAccount) mobileTabAccount.title = 'Log Out of Commuter Session';
      } else {
        mobileTabAccountIcon.textContent = '🔑';
        mobileTabAccountLabel.textContent = 'Log In';
        mobileTabAccountLabel.className = 'text-[9px] font-extrabold mt-1 tracking-tight text-blue-600';
        if (mobileTabAccount) mobileTabAccount.title = 'Commuter Log In';
      }
    }

    document.querySelectorAll('.role-switcher-btn').forEach(btn => {
      const role = btn.dataset.role;
      if (role === activeRole) {
        btn.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
        btn.classList.remove('text-gray-500', 'hover:text-gray-700');
      } else {
        btn.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
        btn.classList.add('text-gray-500', 'hover:text-gray-700');
      }
    });

    const driverSection = document.getElementById('driver-view-section');
    const passengerSection = document.getElementById('passenger-view-section');

    if (driverSection && passengerSection) {
      if (isDriver) {
        driverSection.classList.remove('hidden');
        passengerSection.classList.add('hidden');
      } else {
        driverSection.classList.add('hidden');
        passengerSection.classList.remove('hidden');
      }
    }

    const mobileIcon = document.getElementById('mobile-tab-role-icon');
    const mobileLabel = document.getElementById('mobile-tab-role-label');
    if (mobileIcon && mobileLabel) {
      if (isCommuterOnly) {
        mobileIcon.textContent = '🚶';
        mobileLabel.textContent = 'Commuter';
      } else if (isDriver) {
        mobileIcon.textContent = '🚶';
        mobileLabel.textContent = 'Commuter';
      } else {
        mobileIcon.textContent = '🚗';
        mobileLabel.textContent = 'Driver';
      }
    }

    if (this.mapManager) this.mapManager.invalidateSize();
    if (this.passengerMapManager) this.passengerMapManager.invalidateSize();
  }

  toggleRole() {
    if (storage.isCommuterOnlyMode()) {
      this.showToast("You are signed in as an Office Commuter. Tap '(Switch)' in the header if you need driver mode.", "info");
      return;
    }
    const currentRole = storage.getActiveRole();
    const newRole = currentRole === 'driver' ? 'passenger' : 'driver';
    storage.setActiveRole(newRole);
    this.showToast(`Switched to ${newRole === 'driver' ? '🚗 Driver' : '🚶 Commuter'} Mode!`, 'info');
  }

  exitCommuterOnlyMode() {
    storage.logoutPassenger();
    this.showToast("Exited Commuter-Only Mode. All driver & commuter controls now visible.", "info");
    this.syncActiveRoleUI();
    this.render();
  }

  handlePassengerLogout() {
    storage.logoutPassenger();
    this.showToast("🚪 Logged out of Commuter Mode successfully.", "info");
    this.syncActiveRoleUI();
    this.render();
  }

  handleMobileAccountTab() {
    if (storage.isPassengerLoggedIn() || storage.isCommuterOnlyMode()) {
      this.handlePassengerLogout();
    } else {
      this.openPassengerLoginModal();
    }
  }

  openPassengerLoginModal() {
    const modal = document.getElementById('modal-passenger-login');
    if (!modal) return;
    this.backToPhoneStep();
    this.renderLoginSavedCommuters();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    this.setupOtpInputListeners();
    setTimeout(() => {
      const phoneInput = document.getElementById('login-phone');
      if (phoneInput) phoneInput.focus();
    }, 200);
  }

  closePassengerLoginModal() {
    const modal = document.getElementById('modal-passenger-login');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  backToPhoneStep() {
    const stepPhone = document.getElementById('login-step-phone');
    const stepOtp = document.getElementById('login-step-otp');
    if (stepPhone) stepPhone.classList.remove('hidden');
    if (stepOtp) stepOtp.classList.add('hidden');
    document.querySelectorAll('.otp-box').forEach(b => b.value = '');
  }

  switchToSignupFromLogin() {
    this.closePassengerLoginModal();
    this.openPassengerSignupModal();
  }

  switchToLoginFromSignup() {
    const signupModal = document.getElementById('modal-passenger-signup');
    if (signupModal) {
      signupModal.classList.add('hidden');
      signupModal.classList.remove('flex');
    }
    this.openPassengerLoginModal();
  }

  sendLoginOtp(phoneOverride) {
    let phone = phoneOverride;
    if (!phone) {
      const input = document.getElementById('login-phone');
      phone = input ? input.value : '';
    }

    try {
      const res = storage.sendMobileLoginVerification(phone);
      
      const stepPhone = document.getElementById('login-step-phone');
      const stepOtp = document.getElementById('login-step-otp');
      const phoneDisplay = document.getElementById('otp-phone-display');
      const codePreview = document.getElementById('otp-code-preview');

      if (phoneDisplay) phoneDisplay.textContent = res.phone;
      if (codePreview) codePreview.textContent = res.code;

      if (stepPhone) stepPhone.classList.add('hidden');
      if (stepOtp) stepOtp.classList.remove('hidden');

      // Clear previous OTP boxes and focus first
      document.querySelectorAll('.otp-box').forEach(b => b.value = '');
      const firstBox = document.querySelector('.otp-box[data-idx="0"]');
      if (firstBox) setTimeout(() => firstBox.focus(), 150);

      this.showToast(`📲 SMS Sent: Your verification code is ${res.code}`, "info");
    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  resendLoginOtp() {
    const phoneDisplay = document.getElementById('otp-phone-display');
    const phone = phoneDisplay ? phoneDisplay.textContent : '';
    if (!phone) {
      this.backToPhoneStep();
      return;
    }
    try {
      const res = storage.sendMobileLoginVerification(phone);
      const codePreview = document.getElementById('otp-code-preview');
      if (codePreview) codePreview.textContent = res.code;
      this.showToast(`📲 New SMS code sent: ${res.code}`, "info");
      document.querySelectorAll('.otp-box').forEach(b => b.value = '');
      const firstBox = document.querySelector('.otp-box[data-idx="0"]');
      if (firstBox) firstBox.focus();
    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  autoFillOtp() {
    const preview = document.getElementById('otp-code-preview');
    const code = preview ? preview.textContent.trim() : '1234';
    const boxes = document.querySelectorAll('.otp-box');
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].value = code[i] || '';
    }
    this.verifyLoginOtp();
  }

  verifyLoginOtp() {
    const phoneDisplay = document.getElementById('otp-phone-display');
    const phone = phoneDisplay ? phoneDisplay.textContent.trim() : '';
    const boxes = Array.from(document.querySelectorAll('.otp-box'));
    const code = boxes.map(b => b.value.trim()).join('');

    if (code.length < 4) {
      this.showToast("Please enter the complete 4-digit verification code.", "error");
      const emptyBox = boxes.find(b => !b.value.trim()) || boxes[0];
      if (emptyBox) emptyBox.focus();
      return;
    }

    try {
      const result = storage.verifyMobileLoginCode(phone, code);
      this.closePassengerLoginModal();
      
      const pax = result.passenger;
      if (result.isNew) {
        this.showToast(`🎉 Mobile number verified! Welcome to TaraLets Commuter, ${pax.name}!`, "success");
      } else {
        this.showToast(`🎉 Mobile verified! Welcome back, ${pax.name} (${pax.company}).`, "success");
      }

      this.syncActiveRoleUI();
      this.render();
      setTimeout(() => this.scrollToSection('passenger-welcome-banner'), 300);
    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  setupOtpInputListeners() {
    const boxes = document.querySelectorAll('.otp-box');
    boxes.forEach((box, idx) => {
      box.oninput = () => {
        const val = box.value.replace(/[^0-9]/g, '');
        box.value = val.slice(-1);
        if (box.value && idx < boxes.length - 1) {
          boxes[idx + 1].focus();
        }
        const fullCode = Array.from(boxes).map(b => b.value).join('');
        if (fullCode.length === 4) {
          setTimeout(() => this.verifyLoginOtp(), 250);
        }
      };

      box.onkeydown = (e) => {
        if (e.key === 'Backspace' && !box.value && idx > 0) {
          boxes[idx - 1].focus();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.verifyLoginOtp();
        }
      };

      box.onpaste = (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        if (pasted.length >= 4) {
          for (let i = 0; i < 4; i++) {
            boxes[i].value = pasted[i] || '';
          }
          boxes[3].focus();
          setTimeout(() => this.verifyLoginOtp(), 200);
        }
      };
    });
  }

  quickSelectCommuterPhone(phone) {
    const input = document.getElementById('login-phone');
    if (input) input.value = phone;
    this.sendLoginOtp(phone);
  }

  quickLoginPassenger(paxId) {
    const pax = storage.getPassengerById(paxId);
    if (pax && pax.phone) {
      this.quickSelectCommuterPhone(pax.phone);
    } else {
      try {
        const user = storage.loginPassenger(paxId);
        this.closePassengerLoginModal();
        this.showToast(`🎉 Welcome back, ${user.name}! Commuter Mode enabled.`, "success");
        this.syncActiveRoleUI();
        this.render();
        setTimeout(() => this.scrollToSection('passenger-welcome-banner'), 300);
      } catch (err) {
        this.showToast(err.message, "error");
      }
    }
  }

  renderLoginSavedCommuters() {
    const container = document.getElementById('login-saved-commuters-list');
    if (!container) return;
    const passengers = storage.getPassengers();
    const currentPax = storage.getCurrentPassenger();

    container.innerHTML = passengers.map(p => `
      <div onclick="window.taraletsApp.quickSelectCommuterPhone('${p.phone}')"
        class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 cursor-pointer transition active:scale-[0.98]">
        <div class="flex items-center gap-2.5 min-w-0">
          <img src="${p.avatar}" alt="${p.name}" class="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0">
          <div class="min-w-0">
            <div class="font-bold text-slate-800 text-xs flex items-center gap-1.5 truncate">
              <span class="truncate">${p.name}</span>
              ${p.id === currentPax.id ? '<span class="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold shrink-0">Current</span>' : ''}
            </div>
            <div class="text-[10px] text-slate-500 truncate">${p.company} • <span class="font-mono text-blue-700 font-semibold">${p.phone}</span></div>
          </div>
        </div>
        <button type="button" class="ml-2 px-2.5 py-1 text-[11px] font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg shrink-0 flex items-center gap-1">
          <span>Verify</span>
          <span>→</span>
        </button>
      </div>
    `).join('');
  }

  openPassengerSignupModal() {
    const modal = document.getElementById('modal-passenger-signup');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  handlePassengerSignupSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const workplaceId = document.getElementById('signup-workplace-hub').value;
    const company = document.getElementById('signup-company').value;
    const email = document.getElementById('signup-email').value;
    const jobTitle = document.getElementById('signup-job-title').value;
    const employeeBadgeId = document.getElementById('signup-badge-id').value;
    const pickupLocation = document.getElementById('signup-pickup').value;
    const workSchedule = document.getElementById('signup-schedule').value;
    const vehiclePreference = document.getElementById('signup-vehicle-pref').value;
    const preferredPaymentMode = document.getElementById('signup-payment-mode').value;
    const avatar = document.querySelector('input[name="signup-avatar"]:checked')?.value;

    try {
      const newPax = storage.registerPassenger({
        name,
        phone,
        workplaceId,
        company,
        email,
        jobTitle,
        employeeBadgeId,
        pickupLocation,
        workSchedule,
        vehiclePreference,
        preferredPaymentMode,
        avatar
      });

      const modal = document.getElementById('modal-passenger-signup');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }

      const form = document.getElementById('form-passenger-signup');
      if (form) form.reset();

      this.showToast(`🎉 Welcome ${newPax.name}! Commuter Mode enabled. Request your ride below!`, "success");
      this.syncActiveRoleUI();
      this.render();

      setTimeout(() => {
        this.scrollToSection('passenger-matching-drivers');
      }, 350);

    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  render() {
    this.renderUserSelectOptions();
    this.renderCurrentUserInfo();
    const activeRole = storage.getActiveRole();

    if (activeRole === 'driver') {
      this.renderDriverDashboard();
    } else {
      this.renderPassengerDashboard();
    }
  }

  renderUserSelectOptions() {
    const drivers = storage.getDrivers();
    const currentDriver = storage.getCurrentDriver();
    const driverSelect = document.getElementById('driver-user-select');

    if (driverSelect) {
      driverSelect.innerHTML = drivers.map(d => `
        <option value="${d.id}" ${d.id === currentDriver.id ? 'selected' : ''}>
          ${d.name} (${d.vehicle.type === 'motorcycle' ? '🏍️ Moto' : '🚗 Car'} - ${d.company})
        </option>
      `).join('');
    }

    const passengers = storage.getPassengers();
    const currentPax = storage.getCurrentPassenger();
    const paxSelect = document.getElementById('passenger-user-select');

    if (paxSelect) {
      paxSelect.innerHTML = passengers.map(p => `
        <option value="${p.id}" ${p.id === currentPax.id ? 'selected' : ''}>
          ${p.name} (🏢 ${p.company})
        </option>
      `).join('');
    }
  }

  renderCurrentUserInfo() {
    const role = storage.getActiveRole();
    const user = role === 'driver' ? storage.getCurrentDriver() : storage.getCurrentPassenger();
    const badgeEl = document.getElementById('current-user-badge');
    const avatarEl = document.getElementById('current-user-avatar');
    const nameEl = document.getElementById('current-user-name');
    const subtitleEl = document.getElementById('current-user-subtitle');
    const walletEl = document.getElementById('header-wallet-balance');

    if (avatarEl && user.avatar) avatarEl.src = user.avatar;
    if (nameEl) nameEl.textContent = user.name;
    if (badgeEl) {
      badgeEl.textContent = role === 'driver' ? (user.vehicle.type === 'motorcycle' ? '🏍️ Moto Driver' : '🚗 Car Driver') : '🧍 Commuter';
      badgeEl.className = `px-2 py-0.5 text-xs font-bold rounded-full ${role === 'driver' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`;
    }
    if (subtitleEl) {
      subtitleEl.textContent = `${user.company} • ${user.workSchedule || 'Day Shift'}`;
    }
    if (walletEl) {
      walletEl.textContent = `₱${(user.walletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  renderDriverDashboard() {
    this.renderDriverPendingRequests();

    const currentDriver = storage.getCurrentDriver();
    const myTrips = storage.getTripsByDriver(currentDriver.id);
    const tripsContainer = document.getElementById('driver-trips-list');

    if (tripsContainer) {
      if (myTrips.length === 0) {
        tripsContainer.innerHTML = `
          <div class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p class="text-gray-500 font-medium">You have no posted commute trips yet.</p>
            <button onclick="window.taraletsApp.openPostTripModal()" class="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition">
              + Post Your Daily Commute
            </button>
          </div>
        `;
      } else {
        if (!this.selectedTripId || !myTrips.some(t => t.id === this.selectedTripId)) {
          this.selectedTripId = myTrips[0].id;
        }

        tripsContainer.innerHTML = myTrips.map(trip => {
          const isSelected = trip.id === this.selectedTripId;
          const isFull = (trip.bookedSeats || 0) >= trip.totalSeats;
          const remainingSeats = trip.totalSeats - (trip.bookedSeats || 0);
          const isMoto = trip.vehicleType === 'motorcycle';
          const acceptedModes = trip.acceptedPaymentModes || ["gcash", "cash"];

          return `
            <div onclick="window.taraletsApp.selectTrip('${trip.id}')"
              class="p-4 rounded-xl border-2 transition cursor-pointer ${
                isSelected 
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2">
                  <span class="p-2 rounded-lg ${isMoto ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'} text-lg">
                    ${isMoto ? '🏍️' : '🚗'}
                  </span>
                  <div>
                    <h4 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      ${trip.vehicleModel}
                      <span class="text-xs font-normal text-gray-500">(${trip.plate})</span>
                    </h4>
                    <p class="text-xs text-gray-600 font-medium mt-0.5">
                      🏢 ${trip.destinationName}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="px-2 py-0.5 text-xs font-bold rounded-full ${
                    isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                  }">
                    ${isFull ? 'FULL' : `${remainingSeats} Seat${remainingSeats > 1 ? 's' : ''} Left`}
                  </span>
                  <div class="text-xs font-bold text-gray-900 mt-1">₱${trip.farePerSeat}/pax</div>
                </div>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div>
                  <span class="text-gray-400">Departure:</span> <strong class="text-gray-800">${trip.departureTime}</strong>
                </div>
                <div>
                  <span class="text-gray-400">From:</span> <span class="truncate block font-medium">${trip.originName}</span>
                </div>
              </div>

              <!-- Accepted Payment Badges -->
              <div class="mt-2.5 flex items-center gap-1 flex-wrap">
                <span class="text-[10px] text-gray-400 font-medium">Accepts:</span>
                ${acceptedModes.map(mId => {
                  const mode = storage.getPaymentModeById(mId);
                  return `
                    <span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                      ${mode.icon} ${mode.shortName}
                    </span>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    this.renderMatchingPassengersRadar();
    this.renderDriverBookings();
  }

  renderDriverPendingRequests() {
    const container = document.getElementById('driver-pending-requests-section');
    if (!container) return;

    const currentDriver = storage.getCurrentDriver();
    const allBookings = storage.getBookings();
    const pending = allBookings.filter(b => b.driverId === currentDriver.id && b.status === 'pending_verification');

    if (pending.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm mb-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="flex h-3 w-3 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <h3 class="font-extrabold text-sm text-amber-950">
              🔔 Commuter Booking Requests Awaiting Your Verification (${pending.length})
            </h3>
          </div>
          <span class="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
            Driver Action Required
          </span>
        </div>
        <p class="text-xs text-amber-800 mb-3">
          These commuters requested a seat on your posted travel route. Only you can verify their workplace details and accept the booking!
        </p>

        <div class="space-y-2.5">
          ${pending.map(b => {
            const pVerif = b.passengerVerification || {};
            const mode = storage.getPaymentModeById(b.payment?.modeId || 'gcash');

            return `
              <div class="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                  <img src="${b.passengerAvatar}" alt="${b.passengerName}" class="w-12 h-12 rounded-full object-cover border-2 border-amber-100 shadow-2xs mt-0.5">
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-bold text-slate-900 text-sm">${b.passengerName}</h4>
                      <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        🛡️ ${pVerif.employeeIdBadge || 'Verified Employee'}
                      </span>
                    </div>
                    <p class="text-xs font-semibold text-purple-700 mt-0.5">
                      🏢 ${b.workplaceName}
                    </p>
                    <p class="text-xs text-slate-500">
                      📍 <strong>Pickup:</strong> ${b.pickupPoint} • <strong>Shift:</strong> ${pVerif.workSchedule || '08:00 AM - 05:00 PM'}
                    </p>
                    ${pVerif.note ? `
                      <p class="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded">
                        "${pVerif.note}"
                      </p>
                    ` : ''}
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end md:self-center">
                  <div class="text-right mr-2 hidden sm:block">
                    <span class="font-extrabold text-sm text-slate-900">₱${b.fare}</span>
                    <span class="block text-[10px] text-slate-500">${mode.name}</span>
                  </div>

                  <button onclick="window.taraletsApp.openVerifyPassengerModal('${b.id}')"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition border border-slate-200 flex items-center gap-1">
                    <span>🛡️</span>
                    <span>Review Details</span>
                  </button>

                  <button onclick="window.taraletsApp.acceptPassengerBooking('${b.id}')"
                    class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1">
                    <span>✓</span>
                    <span>Verify &amp; Accept</span>
                  </button>

                  <button onclick="window.taraletsApp.declinePassengerBooking('${b.id}')"
                    class="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 font-bold rounded-lg transition" title="Decline">
                    ✕
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  selectTrip(tripId) {
    this.selectedTripId = tripId;
    this.renderDriverDashboard();
  }

  renderMatchingPassengersRadar() {
    const radarContainer = document.getElementById('workplace-matching-radar');
    if (!radarContainer) return;

    const trips = storage.getTrips();
    const selectedTrip = trips.find(t => t.id === this.selectedTripId);

    if (!selectedTrip) {
      radarContainer.innerHTML = `
        <div class="p-6 text-center text-gray-400 text-sm">
          Select or create a commute trip to scan for matching co-workers.
        </div>
      `;
      return;
    }

    const matches = getMatchingPassengersForTrip(selectedTrip);
    const isFull = (selectedTrip.bookedSeats || 0) >= selectedTrip.totalSeats;

    this.mapManager.renderTripView(selectedTrip, matches);

    radarContainer.innerHTML = `
      <div class="mb-3 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
            <span>🎯 Co-Worker & Route Match Radar</span>
            <span class="px-2 py-0.5 text-[11px] bg-purple-100 text-purple-800 font-bold rounded-full">
              ${matches.filter(m => m.match.isSameWorkplace).length} Same Workplace
            </span>
          </h3>
          <p class="text-xs text-gray-500">
            Commuters traveling to <strong class="text-gray-800">${selectedTrip.destinationName}</strong>. You can book them directly!
          </p>
        </div>
        ${isFull ? `
          <span class="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
            Vehicle Full (${selectedTrip.totalSeats}/${selectedTrip.totalSeats})
          </span>
        ` : `
          <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            ${selectedTrip.totalSeats - selectedTrip.bookedSeats} Seat(s) Available
          </span>
        `}
      </div>

      <div class="space-y-3">
        ${matches.map(item => {
          const p = item.passenger;
          const match = item.match;
          const isBooked = item.isAlreadyBookedInThisTrip;
          const canBook = item.canBeBooked;
          const prefMode = storage.getPaymentModeById(p.preferredPaymentMode || 'gcash');

          return `
            <div class="p-3.5 rounded-xl border ${isBooked ? 'border-emerald-300 bg-emerald-50/30' : 'border-gray-200 hover:border-gray-300 bg-white'} transition shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <img src="${p.avatar}" alt="${p.name}" class="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm mt-0.5">
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-bold text-gray-900 text-sm">${p.name}</h4>
                      <span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                        match.score >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }">
                        ${match.score}% MATCH
                      </span>
                    </div>
                    <div class="text-xs font-semibold text-purple-700 mt-0.5 flex items-center gap-1">
                      <span>🏢</span>
                      <span>${p.company}</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-0.5">
                      📍 <strong>Pickup:</strong> ${p.pickupLocation}
                    </div>
                    <div class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>⏰ ${p.workSchedule || '08:00 AM - 05:00 PM'}</span>
                      <span class="text-slate-300">•</span>
                      <span class="font-medium text-slate-700">Prefers: ${prefMode.icon} ${prefMode.shortName}</span>
                    </div>
                  </div>
                </div>

                <div class="text-right flex flex-col items-end gap-1.5">
                  ${isBooked ? `
                    <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                      <span>✓</span> Booked in Your Ride
                    </span>
                    <button onclick="window.taraletsApp.openChatForPassenger('${p.id}')"
                      class="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
                      💬 Coordinate
                    </button>
                  ` : canBook ? `
                    <button onclick="window.taraletsApp.openBookingModal('${selectedTrip.id}', '${p.id}')"
                      class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5">
                      <span>🎟️</span>
                      <span>Book Co-Passenger</span>
                    </button>
                    <span class="text-[11px] text-gray-400">Reserve seat for ${p.name.split(' ')[0]}</span>
                  ` : `
                    <span class="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
                      ${isFull ? 'Vehicle Full' : 'Unavailable'}
                    </span>
                  `}
                </div>
              </div>

              <div class="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                ${match.badges.map(b => `
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-700">
                    ${b}
                  </span>
                `).join('')}
                ${p.bio ? `
                  <span class="text-xs text-gray-500 italic ml-1">"${p.bio}"</span>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderDriverBookings() {
    const currentDriver = storage.getCurrentDriver();
    const bookings = storage.getBookings().filter(b => b.driverId === currentDriver.id && b.status !== 'pending_verification');
    const container = document.getElementById('driver-active-bookings-list');
    if (!container) return;

    if (bookings.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 text-gray-400 text-xs">
          No confirmed bookings yet. Use the radar above to book colleagues going your way!
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(b => {
      const isConfirmed = b.status === 'confirmed';
      const isInTransit = b.status === 'in_transit';
      const isCompleted = b.status === 'completed';
      const payment = b.payment || { modeId: 'gcash', modeName: 'GCash', status: 'pending_digital' };
      const mode = storage.getPaymentModeById(payment.modeId);
      const isPaid = payment.status === 'paid';

      return `
        <div class="p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm mb-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <img src="${b.passengerAvatar}" alt="${b.passengerName}" class="w-10 h-10 rounded-full object-cover">
              <div>
                <h4 class="font-bold text-gray-900 text-xs">${b.passengerName}</h4>
                <p class="text-[11px] text-gray-500">📍 ${b.pickupPoint}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs font-extrabold text-gray-900">₱${b.fare}</div>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${
                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }">
                ${mode.icon} ${isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>

          <!-- Payment Badge & Details Bar -->
          <div class="mt-2 p-2 bg-slate-50 rounded-lg flex items-center justify-between text-[11px] border border-slate-100">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-slate-700">${mode.name}:</span>
              <span class="text-slate-500">${payment.referenceNo || 'Payment on route'}</span>
            </div>
            ${!isPaid ? `
              <button onclick="window.taraletsApp.markPaymentPaid('${b.id}')"
                class="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Mark Paid ✓
              </button>
            ` : `
              <span class="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
            `}
          </div>

          <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <button onclick="window.taraletsApp.openChat('${b.id}')"
                class="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center gap-1 transition">
                💬 Chat
              </button>
              <button onclick="window.taraletsApp.openDriverQrModal('${b.id}')"
                class="px-2.5 py-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg flex items-center gap-1 transition">
                💳 QR / Details
              </button>
            </div>

            <div class="flex items-center gap-1">
              ${isConfirmed ? `
                <button onclick="window.taraletsApp.updateBookingStatus('${b.id}', 'in_transit')"
                  class="px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition">
                  🚗 Picked Up
                </button>
              ` : isInTransit ? `
                <button onclick="window.taraletsApp.updateBookingStatus('${b.id}', 'completed')"
                  class="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">
                  🏁 Arrived
                </button>
              ` : `
                <span class="text-[11px] text-gray-400 font-medium">Completed Ride</span>
              `}
              ${!isCompleted ? `
                <button onclick="window.taraletsApp.cancelBooking('${b.id}')"
                  class="px-2 py-1 text-xs text-red-600 hover:text-red-700 rounded transition" title="Cancel booking">
                  ✕
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderPassengerDashboard() {
    const currentPax = storage.getCurrentPassenger();
    const isCommuterOnly = storage.isCommuterOnlyMode();
    const isPaxLoggedIn = storage.isPassengerLoggedIn();

    // Render Welcome Banner
    const bannerContainer = document.getElementById('passenger-welcome-banner');
    if (bannerContainer) {
      const matchTrips = getMatchingTripsForPassenger(currentPax);

      if (!isCommuterOnly && !isPaxLoggedIn) {
        // Guest / Logged-out Commuter Welcome View
        bannerContainer.innerHTML = `
          <div class="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-blue-500/30 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start sm:items-center gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-2xl shrink-0">
                  🚶
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h2 class="text-base sm:text-lg font-extrabold text-white">Office Commuter Station</h2>
                    <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                      Work Carpool & Motorcycle Pool
                    </span>
                  </div>
                  <p class="text-xs text-blue-100 mt-0.5">
                    Heading to <strong>BGC, Makati CBD, Ortigas, Eastwood or Alabang</strong>? Log in or sign up to request rides directly from colleagues!
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                <button onclick="window.taraletsApp.openPassengerLoginModal()" class="text-xs bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                  <span>🔑</span>
                  <span>Log In</span>
                </button>
                <button onclick="window.taraletsApp.openPassengerSignupModal()" class="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-extrabold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                  <span>📝</span>
                  <span>Sign Up</span>
                </button>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-200">
              <p>💡 <em>Colleagues driving to work:</em> Vehicle owners have empty car seats and motorcycle back rides. Browse active routes below!</p>
              <button onclick="window.taraletsApp.scrollToSection('passenger-matching-drivers')" class="underline font-bold text-white hover:text-blue-200 shrink-0">
                View ${matchTrips.length} Available Route(s) ↓
              </button>
            </div>
          </div>
        `;
      } else {
        // Authenticated / Commuter-Only Mode Banner
        bannerContainer.innerHTML = `
          <div class="bg-gradient-to-r ${isCommuterOnly ? 'from-blue-700 via-indigo-700 to-blue-800' : 'from-slate-800 to-blue-900'} text-white p-5 rounded-2xl shadow-md border border-blue-600/30 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start sm:items-center gap-3.5 min-w-0">
                <img src="${currentPax.avatar}" alt="${currentPax.name}" class="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-sm shrink-0">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h2 class="text-base sm:text-lg font-extrabold text-white truncate">Welcome, ${currentPax.name}!</h2>
                    <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 uppercase tracking-wide shrink-0">
                      ✓ Verified Commuter
                    </span>
                  </div>
                  <p class="text-xs text-blue-100 font-medium mt-0.5 truncate">
                    🏢 <strong>${currentPax.company}</strong> (${currentPax.jobTitle || 'Verified Employee'}) • Shift: <strong>${currentPax.workSchedule || '08:00 AM - 05:00 PM'}</strong>
                  </p>
                  <p class="text-[11px] text-blue-200 mt-0.5 truncate">
                    📍 Pickup Area: <strong>${currentPax.pickupLocation}</strong> • Badge: <span class="font-mono bg-white/20 px-1.5 py-0.2 rounded">${currentPax.employeeBadgeId || '#EMP-ID'}</span>
                  </p>
                </div>
              </div>

              <div class="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                <span class="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                  ${isCommuterOnly ? '🔒 Commuter Mode Only' : '🚶 Commuter Station'}
                </span>
                <div class="flex items-center gap-2">
                  <button onclick="window.taraletsApp.handlePassengerLogout()" class="text-xs bg-rose-600/80 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm" title="Log Out of Commuter Mode">
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                  <button onclick="window.taraletsApp.openPassengerSignupModal()" class="text-xs bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5">
                    <span>📝</span>
                    <span class="hidden sm:inline">New Profile</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-100">
              <p>
                ✨ <strong>Ready for work?</strong> Below are active drivers commuting along your corridor to <strong>${currentPax.company}</strong>. Tap <strong>"Request a Ride to Driver"</strong> to reserve your seat!
              </p>
              <button onclick="window.taraletsApp.scrollToSection('passenger-matching-drivers')" class="underline font-bold text-white hover:text-blue-200 shrink-0">
                View ${matchTrips.length} Available Route(s) ↓
              </button>
            </div>
          </div>
        `;
      }
    }

    const myBookings = storage.getBookings().filter(b => b.passengerId === currentPax.id);
    const container = document.getElementById('passenger-incoming-bookings');

    if (container) {
      if (myBookings.length === 0) {
        container.innerHTML = `
          <div class="p-6 text-center bg-blue-50/50 rounded-2xl border border-blue-200">
            <span class="text-3xl block mb-2">🚗</span>
            <h4 class="font-bold text-gray-900 text-sm">Waiting for Driver Bookings</h4>
            <p class="text-xs text-gray-600 mt-1 max-w-md mx-auto">
              Your commute profile for <strong>${currentPax.company}</strong> is visible on the Driver Match Radar. Drivers commuting to your workplace will book and reserve seats for you!
            </p>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="mb-2">
            <h3 class="font-bold text-gray-900 text-sm">🎟️ Your Commute Bookings & Requests</h3>
            <p class="text-xs text-gray-500">Trips to ${currentPax.company}</p>
          </div>
          <div class="space-y-3">
            ${myBookings.map(b => {
              const payment = b.payment || { modeId: 'gcash', modeName: 'GCash', status: 'pending_digital' };
              const mode = storage.getPaymentModeById(payment.modeId);
              const isPaid = payment.status === 'paid';
              const isPendingVerif = b.status === 'pending_verification';

              return `
                <div class="p-4 rounded-xl border ${isPendingVerif ? 'border-amber-300 bg-amber-50/40' : 'border-emerald-200 bg-emerald-50/30'} shadow-sm">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <span class="p-2.5 ${isPendingVerif ? 'bg-amber-500' : 'bg-emerald-600'} text-white rounded-xl text-lg">
                        ${b.vehicleType === 'motorcycle' ? '🏍️' : '🚗'}
                      </span>
                      <div>
                        <div class="flex items-center gap-2">
                          <h4 class="font-bold text-gray-900 text-sm">${b.driverName}</h4>
                          <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${isPendingVerif ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'} uppercase">
                            ${isPendingVerif ? 'Pending Driver Verification' : b.status}
                          </span>
                        </div>
                        <p class="text-xs font-semibold text-gray-700 mt-0.5">Vehicle: ${b.vehicleModel}</p>
                        <p class="text-xs text-gray-500">Departure: ${b.scheduledTime} • ₱${b.fare} share</p>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-1.5">
                      <button onclick="window.taraletsApp.viewDriverOnPassengerMap('${b.tripId}')"
                        class="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs">
                        📍 Track GPS
                      </button>
                      ${!isPendingVerif ? `
                        <button onclick="window.taraletsApp.openChat('${b.id}')"
                          class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1">
                          💬 Chat Driver
                        </button>
                        <button onclick="window.taraletsApp.openDriverQrModal('${b.id}')"
                          class="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                          💳 Pay Driver
                        </button>
                      ` : `
                        <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded">
                          Awaiting Driver Accept
                        </span>
                      `}
                    </div>
                  </div>

                  <!-- Payment Mode Pill -->
                  <div class="mt-3 p-2.5 bg-white rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2">
                      <span class="text-base">${mode.icon}</span>
                      <div>
                        <span class="font-bold text-slate-800">${mode.name}</span>
                        <span class="text-[11px] text-slate-500 block">Ref: ${payment.referenceNo || 'None'}</span>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded font-bold text-[10px] ${
                      isPaid ? 'bg-emerald-100 text-emerald-800' : isPendingVerif ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }">
                      ${isPaid ? 'PAID & VERIFIED' : isPendingVerif ? 'AWAITING VERIFICATION' : 'PAYMENT DUE'}
                    </span>
                  </div>

                  ${b.driverNote || b.passengerVerification?.note ? `
                    <div class="mt-2.5 p-2 bg-white rounded-lg text-xs text-gray-700 border border-gray-100 italic">
                      "${b.driverNote || b.passengerVerification?.note}"
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    }

    const driversContainer = document.getElementById('passenger-matching-drivers');
    if (driversContainer) {
      const matchedTrips = getMatchingTripsForPassenger(currentPax);
      driversContainer.innerHTML = matchedTrips.map(item => {
        const t = item.trip;
        const m = item.match;
        const isBooked = item.isAlreadyBooked;
        const modes = t.acceptedPaymentModes || ["gcash", "cash"];

        return `
          <div class="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition shadow-sm">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <img src="${t.driverAvatar}" alt="${t.driverName}" class="w-10 h-10 rounded-full object-cover">
                <div>
                  <h4 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                    ${t.driverName}
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800">
                      ${m.score}% Workplace Match
                    </span>
                  </h4>
                  <p class="text-xs text-gray-600 font-medium">🏢 Heading to: ${t.destinationName}</p>
                  <p class="text-xs text-gray-500">Origin: ${t.originName} • Departs: ${t.departureTime}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-emerald-700">₱${t.farePerSeat}/seat</span>
                <div class="text-[11px] text-gray-500 mt-1">
                  ${t.vehicleType === 'motorcycle' ? '🏍️ Motorcycle' : '🚗 Car'}
                </div>
              </div>
            </div>

            <!-- Payment modes accepted -->
            <div class="mt-2 flex items-center gap-1.5 flex-wrap">
              <span class="text-[11px] text-slate-400">Payment:</span>
              ${modes.map(mId => {
                const mode = storage.getPaymentModeById(mId);
                return `<span class="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded">${mode.icon} ${mode.shortName}</span>`;
              }).join('')}
            </div>

            ${(() => {
              const myPendingBooking = storage.getBookings().find(b => b.tripId === t.id && b.passengerId === currentPax.id && b.status === 'pending_verification');
              const hasSeats = (t.bookedSeats || 0) < t.totalSeats;

              if (isBooked) {
                return `
                  <div class="mt-2.5 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center justify-between">
                    <span>✓ You are booked on this driver's route!</span>
                    <button onclick="window.taraletsApp.openChatForPassenger('${currentPax.id}')" class="text-xs text-emerald-700 hover:text-emerald-800 underline">
                      💬 Chat Driver
                    </button>
                  </div>
                `;
              } else if (myPendingBooking) {
                return `
                  <div class="mt-2.5 p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-medium flex items-center justify-between">
                    <span>⏳ Booking Request Sent — Waiting for Driver to Verify Details &amp; Accept</span>
                    <span class="text-[10px] font-bold bg-amber-200 px-2 py-0.5 rounded-full">Pending Verification</span>
                  </div>
                `;
              } else if (hasSeats) {
                return `
                  <div class="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    <span class="text-[11px] text-slate-500 font-semibold">${t.totalSeats - (t.bookedSeats || 0)} seat(s) available</span>
                    <div class="flex items-center gap-2">
                      <button type="button" onclick="window.taraletsApp.viewDriverOnPassengerMap('${t.id}')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center gap-1 shadow-2xs">
                        <span>🗺️</span>
                        <span>View GPS Map</span>
                      </button>
                      <button type="button" onclick="window.taraletsApp.openPassengerRequestModal('${t.id}')" class="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5">
                        <span>🎟️</span>
                        <span>Request a Ride</span>
                      </button>
                    </div>
                  </div>
                `;
              } else {
                return `<div class="mt-2.5 p-1.5 bg-slate-50 text-slate-400 text-xs rounded text-center">Vehicle Full</div>`;
              }
            })()}
          </div>
        `;
      }).join('');
    }

    // Render Driver GPS Map for Passenger Mobile App
    this.renderPassengerGpsMap();
  }

  // ========================================================
  // DRIVER GPS MAP FOR PASSENGER MOBILE APP
  // ========================================================
  renderPassengerGpsMap() {
    const currentPax = storage.getCurrentPassenger();
    if (!currentPax) return;

    const matchedTrips = getMatchingTripsForPassenger(currentPax);
    const allTrips = storage.getTrips();
    const myBookings = storage.getBookings().filter(b => b.passengerId === currentPax.id);

    // Prioritize active booking trip, or selected trip, or top matched trip
    let activeTrip = null;
    if (this.selectedPassengerMapTripId) {
      activeTrip = allTrips.find(t => t.id === this.selectedPassengerMapTripId);
    }

    if (!activeTrip && myBookings.length > 0) {
      const bookedTripId = myBookings[0].tripId;
      activeTrip = allTrips.find(t => t.id === bookedTripId);
    }

    if (!activeTrip && matchedTrips.length > 0) {
      activeTrip = matchedTrips[0].trip;
    }

    if (!activeTrip && allTrips.length > 0) {
      activeTrip = allTrips[0];
    }

    if (activeTrip) {
      this.selectedPassengerMapTripId = activeTrip.id;
    }

    // Populate Driver Selector Dropdown
    const selectEl = document.getElementById('passenger-map-driver-select');
    if (selectEl) {
      const candidateTrips = matchedTrips.length > 0 ? matchedTrips.map(m => m.trip) : allTrips;
      selectEl.innerHTML = candidateTrips.map(t => {
        const isSelected = activeTrip && t.id === activeTrip.id;
        const icon = t.vehicleType === 'motorcycle' ? '🏍️' : '🚗';
        return `<option value="${t.id}" ${isSelected ? 'selected' : ''}>${icon} ${t.driverName} (${t.departureTime})</option>`;
      }).join('');
    }

    // Render Live Driver Status Banner
    const bannerEl = document.getElementById('passenger-map-driver-status-banner');
    if (bannerEl && activeTrip) {
      const isMotorcycle = activeTrip.vehicleType === 'motorcycle';
      const myBooking = myBookings.find(b => b.tripId === activeTrip.id);
      const isConfirmed = myBooking && myBooking.status === 'confirmed';
      const isPending = myBooking && myBooking.status === 'pending_verification';

      bannerEl.innerHTML = `
        <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div class="flex items-center gap-3 min-w-0">
            <img src="${activeTrip.driverAvatar}" alt="${activeTrip.driverName}" class="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm shrink-0">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="font-extrabold text-sm text-slate-900 truncate">${activeTrip.driverName}</h4>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${isConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : isPending ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}">
                  ${isConfirmed ? '✓ Confirmed Passenger' : isPending ? '⏳ Verification Pending' : '🟢 Live Corridor GPS'}
                </span>
              </div>
              <div class="text-[11px] text-slate-600 font-semibold mt-1 flex items-center gap-2 flex-wrap">
                <span class="text-slate-800">${isMotorcycle ? '🏍️' : '🚗'} ${activeTrip.vehicleModel} (${activeTrip.plate || 'Verified'})</span>
                <span class="text-slate-300">•</span>
                <span class="text-emerald-700 font-bold">Departs: ${activeTrip.departureTime}</span>
                <span class="text-slate-300">•</span>
                <span class="text-blue-700 font-bold">₱${activeTrip.farePerSeat}/seat</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button type="button" onclick="window.taraletsApp.openChatForPassenger('${currentPax.id}')" class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs">
              <span>💬</span>
              <span>Chat</span>
            </button>
            ${!myBooking ? `
              <button type="button" onclick="window.taraletsApp.openPassengerRequestModal('${activeTrip.id}')" class="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center gap-1">
                <span>🎟️</span>
                <span>Request Ride</span>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }

    // Render GPS View on Map
    if (activeTrip && this.passengerMapManager) {
      if (!this.passengerMapManager.map) {
        this.passengerMapManager.init();
      }
      this.passengerMapManager.renderPassengerGpsView(activeTrip, currentPax);
      this.passengerMapManager.invalidateSize();
    }
  }

  onPassengerSelectDriverForMap(tripId) {
    this.selectedPassengerMapTripId = tripId;
    this.renderPassengerGpsMap();
    this.showToast('📍 Switched driver GPS tracking corridor', 'info');
  }

  viewDriverOnPassengerMap(tripId) {
    this.selectedPassengerMapTripId = tripId;
    this.renderPassengerGpsMap();
    this.scrollToSection('passenger-commute-map-card');
    if (this.passengerMapManager) {
      this.passengerMapManager.invalidateSize();
    }
  }

  recenterPassengerMap() {
    if (this.passengerMapManager) {
      this.renderPassengerGpsMap();
      this.passengerMapManager.invalidateSize();
      this.showToast('📍 Recentered GPS map on Driver & Pickup location', 'info');
    }
  }

  handleMobileMapTab() {
    const isDriver = !storage.isCommuterOnlyMode() && storage.getActiveRole() === 'driver';
    if (isDriver) {
      this.scrollToSection('commute-map-card');
      if (this.mapManager) this.mapManager.invalidateSize();
    } else {
      this.scrollToSection('passenger-commute-map-card');
      if (this.passengerMapManager) {
        this.renderPassengerGpsMap();
        this.passengerMapManager.invalidateSize();
      }
    }
  }

  openBookingModal(tripId, passengerId) {
    const trips = storage.getTrips();
    const trip = trips.find(t => t.id === tripId);
    const passengers = storage.getPassengers();
    const passenger = passengers.find(p => p.id === passengerId);

    if (!trip || !passenger) return;

    this.selectedTripId = tripId;
    this.selectedBookingPassengerId = passengerId;

    const modal = document.getElementById('modal-driver-booking');
    if (!modal) return;

    document.getElementById('modal-pax-avatar').src = passenger.avatar;
    document.getElementById('modal-pax-name').textContent = passenger.name;
    document.getElementById('modal-pax-company').textContent = passenger.company;
    document.getElementById('modal-pax-pickup').textContent = passenger.pickupLocation;
    document.getElementById('modal-pax-shift').textContent = passenger.workSchedule || '08:00 AM - 05:00 PM';

    const match = evaluateWorkplaceMatch(trip, passenger);
    document.getElementById('modal-match-score').textContent = `${match.score}% MATCH`;

    const driverTrips = storage.getTripsByDriver(storage.getCurrentDriverId());
    const tripSelect = document.getElementById('modal-select-trip');
    if (tripSelect) {
      tripSelect.innerHTML = driverTrips.map(t => `
        <option value="${t.id}" ${t.id === trip.id ? 'selected' : ''}>
          ${t.vehicleModel} (${t.departureTime}) - To ${t.destinationName} (${t.totalSeats - t.bookedSeats} seats left)
        </option>
      `).join('');
    }

    const fareInput = document.getElementById('modal-booking-fare');
    if (fareInput) fareInput.value = trip.farePerSeat;

    const paymentContainer = document.getElementById('modal-payment-modes-container');
    if (paymentContainer) {
      const modes = storage.getPaymentModes();
      const preferred = passenger.preferredPaymentMode || 'gcash';

      paymentContainer.innerHTML = modes.map(m => {
        const isSelected = m.id === preferred;
        return `
          <label class="flex items-center gap-2 p-2 border rounded-xl cursor-pointer hover:bg-slate-50 transition text-xs ${
            isSelected ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200'
          }">
            <input type="radio" name="modal-payment-mode" value="${m.id}" ${isSelected ? 'checked' : ''} class="text-emerald-600 focus:ring-emerald-500">
            <span class="text-base">${m.icon}</span>
            <div class="flex-1">
              <div class="font-bold text-slate-800">${m.name}</div>
              <div class="text-[10px] text-slate-500">${m.speed}</div>
            </div>
          </label>
        `;
      }).join('');
    }

    const noteInput = document.getElementById('modal-driver-note');
    if (noteInput) {
      noteInput.value = `Hi ${passenger.name.split(' ')[0]}! I'm heading to our office at ${trip.destinationName}. Reserved a seat for you!`;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  handleConfirmBookingSubmit(e) {
    e.preventDefault();
    const tripId = document.getElementById('modal-select-trip').value || this.selectedTripId;
    const passengerId = this.selectedBookingPassengerId;
    const customFare = document.getElementById('modal-booking-fare').value;
    const driverNote = document.getElementById('modal-driver-note').value;
    const paymentModeId = document.querySelector('input[name="modal-payment-mode"]:checked')?.value || 'gcash';

    try {
      storage.createDriverBooking({
        tripId,
        passengerId,
        customFare,
        driverNote,
        paymentModeId
      });

      const modal = document.getElementById('modal-driver-booking');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  openPostTripModal() {
    const modal = document.getElementById('modal-post-trip');
    if (!modal) return;

    const hubSelect = document.getElementById('trip-workplace-hub');
    if (hubSelect) {
      const hubs = storage.getWorkplaceHubs();
      hubSelect.innerHTML = hubs.map(h => `
        <option value="${h.id}">${h.name} (${h.city})</option>
      `).join('');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  handlePostTripSubmit(e) {
    e.preventDefault();
    const driver = storage.getCurrentDriver();
    const vehicleType = document.querySelector('input[name="vehicle-type"]:checked')?.value || 'car';
    const vehicleModel = document.getElementById('trip-vehicle-model').value || (vehicleType === 'car' ? 'Toyota Vios' : 'Honda Click');
    const plate = document.getElementById('trip-vehicle-plate').value || 'ABC 1234';
    const workplaceHubId = document.getElementById('trip-workplace-hub').value;
    const hub = storage.getHubById(workplaceHubId);

    const originName = document.getElementById('trip-origin').value || 'Quezon City';
    const departureTime = document.getElementById('trip-departure-time').value || '07:30 AM';
    const totalSeats = parseInt(document.getElementById('trip-total-seats').value || (vehicleType === 'car' ? '3' : '1'), 10);
    const farePerSeat = parseInt(document.getElementById('trip-fare').value || '120', 10);
    const routeVia = document.getElementById('trip-route-via').value || 'Main Highway / Express Corridor';
    const notes = document.getElementById('trip-notes').value || '';

    const selectedModes = Array.from(document.querySelectorAll('input[name="trip-accepted-payments"]:checked')).map(cb => cb.value);
    const acceptedPaymentModes = selectedModes.length > 0 ? selectedModes : ["gcash", "maya", "cash", "qrph", "wallet"];

    const newTrip = {
      id: "trip-" + Date.now(),
      driverId: driver.id,
      driverName: driver.name,
      driverAvatar: driver.avatar,
      vehicleType,
      vehicleModel,
      plate,
      workplaceId: hub.id,
      destinationName: hub.name,
      destinationLat: hub.lat,
      destinationLng: hub.lng,
      originName,
      originLat: 14.6500,
      originLng: 121.0300,
      departureDate: "Today",
      departureTime,
      totalSeats,
      bookedSeats: 0,
      farePerSeat,
      acceptedPaymentModes,
      routeVia,
      status: "active",
      bookedPassengerIds: [],
      notes
    };

    storage.createTrip(newTrip);
    this.selectedTripId = newTrip.id;

    const modal = document.getElementById('modal-post-trip');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  openAddCommuterModal() {
    const modal = document.getElementById('modal-add-commuter');
    if (!modal) return;

    const hubSelect = document.getElementById('commuter-workplace-hub');
    if (hubSelect) {
      const hubs = storage.getWorkplaceHubs();
      hubSelect.innerHTML = hubs.map(h => `
        <option value="${h.id}">${h.name} (${h.city})</option>
      `).join('');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  handleAddCommuterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('commuter-name').value;
    const company = document.getElementById('commuter-company').value;
    const hubId = document.getElementById('commuter-workplace-hub').value;
    const pickupLocation = document.getElementById('commuter-pickup').value;
    const workSchedule = document.getElementById('commuter-shift').value;
    const vehiclePreference = document.getElementById('commuter-pref').value;
    const preferredPaymentMode = document.getElementById('commuter-payment-pref').value || 'gcash';
    const bio = document.getElementById('commuter-bio').value;

    const newPax = {
      id: "pax-" + Date.now(),
      name,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      phone: "0917-" + Math.floor(1000000 + Math.random() * 9000000),
      workplaceId: hubId,
      company,
      jobTitle: "Team Member",
      workSchedule,
      pickupLocation,
      pickupLat: 14.6200,
      pickupLng: 121.0500,
      vehiclePreference,
      status: 'looking',
      walletBalance: 500.00,
      preferredPaymentMode,
      willingToShareFare: true,
      bio
    };

    storage.savePassenger(newPax);
    this.showToast(`✨ Commuter profile for ${name} added! Drivers heading to ${company} can now book you.`, "success");

    const modal = document.getElementById('modal-add-commuter');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    this.render();
  }

  openPassengerRequestModal(tripId) {
    const trip = storage.getTripById(tripId);
    if (!trip) return;

    const modal = document.getElementById('modal-passenger-request-seat');
    if (!modal) return;

    const currentPax = storage.getCurrentPassenger();

    this.requestingTripId = tripId;
    document.getElementById('req-modal-driver-name').textContent = trip.driverName;
    document.getElementById('req-modal-route').textContent = `${trip.originName} ➔ ${trip.destinationName}`;
    document.getElementById('req-modal-time').textContent = trip.departureTime;
    document.getElementById('req-modal-vehicle').textContent = `${trip.vehicleType === 'motorcycle' ? '🏍️' : '🚗'} ${trip.vehicleModel}`;
    document.getElementById('req-modal-fare').textContent = `₱${trip.farePerSeat}`;

    document.getElementById('req-modal-pickup-input').value = currentPax.pickupLocation || '';
    document.getElementById('req-modal-verification-company').textContent = `${currentPax.company} (ID Verified)`;
    document.getElementById('req-modal-verification-email').textContent = currentPax.email || `${currentPax.name.toLowerCase().replace(/[^a-z]/g, '.')}@${currentPax.company.toLowerCase().includes('google') ? 'google.com' : currentPax.company.toLowerCase().includes('shopee') ? 'shopee.com' : 'corp.ph'}`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  handlePassengerRequestSubmit(e) {
    e.preventDefault();
    const tripId = this.requestingTripId;
    const currentPax = storage.getCurrentPassenger();
    const pickupPoint = document.getElementById('req-modal-pickup-input').value;
    const paymentModeId = document.getElementById('req-modal-payment-mode').value;
    const passengerNote = document.getElementById('req-modal-note-input').value;

    try {
      storage.createPassengerBookingRequest({
        tripId,
        passengerId: currentPax.id,
        pickupPoint,
        paymentModeId,
        passengerNote
      });

      const modal = document.getElementById('modal-passenger-request-seat');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }

      this.showToast(`🚀 Booking request sent to driver! Awaiting driver verification.`, "success");
      this.render();
    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  openVerifyPassengerModal(bookingId) {
    const booking = storage.getBookingById(bookingId);
    if (!booking) return;

    const modal = document.getElementById('modal-verify-passenger');
    if (!modal) return;

    const pVerif = booking.passengerVerification || {};
    const mode = storage.getPaymentModeById(booking.payment?.modeId || 'gcash');

    document.getElementById('verify-modal-pax-avatar').src = booking.passengerAvatar;
    document.getElementById('verify-modal-pax-name').textContent = booking.passengerName;
    document.getElementById('verify-modal-pax-phone').textContent = booking.passengerPhone || '0917-000-0000';
    document.getElementById('verify-modal-pax-company').textContent = booking.workplaceName;

    document.getElementById('verify-modal-company-match').textContent = pVerif.companyName || booking.workplaceName;
    document.getElementById('verify-modal-corp-email').textContent = pVerif.companyEmail || 'verified.employee@corp.ph';
    document.getElementById('verify-modal-badge-id').textContent = pVerif.employeeIdBadge || '#VERIFIED-BADGE';
    document.getElementById('verify-modal-shift').textContent = pVerif.workSchedule || '08:00 AM - 05:00 PM';
    document.getElementById('verify-modal-pickup').textContent = booking.pickupPoint;
    document.getElementById('verify-modal-payment').textContent = `₱${booking.fare} via ${mode.name}`;
    document.getElementById('verify-modal-note').textContent = `"${pVerif.note || 'Ready at pickup landmark with exact fare.'}"`;

    const acceptBtn = document.getElementById('btn-verify-accept');
    if (acceptBtn) {
      acceptBtn.onclick = () => {
        this.acceptPassengerBooking(booking.id);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      };
    }

    const declineBtn = document.getElementById('btn-verify-decline');
    if (declineBtn) {
      declineBtn.onclick = () => {
        this.declinePassengerBooking(booking.id);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      };
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  acceptPassengerBooking(bookingId) {
    try {
      storage.acceptPassengerBooking(bookingId);
      this.showToast("✓ Passenger details verified! Booking accepted and seat confirmed.", "success");
      this.render();
    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  declinePassengerBooking(bookingId) {
    storage.declinePassengerBooking(bookingId);
    this.showToast("Passenger booking request declined.", "info");
    this.render();
  }

  openAppDownloadModal() {
    const modal = document.getElementById('modal-app-download');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  installPwaApp(edition = 'passenger') {
    if (edition === 'driver') {
      storage.setCommuterOnlyMode(false);
      storage.setActiveRole('driver');
    } else if (edition === 'passenger') {
      storage.setCommuterOnlyMode(true);
      storage.setActiveRole('passenger');
    }
    this.syncActiveRoleUI();
    this.render();

    // 1. Check if already running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      this.showToast(`✓ TaraLets is already installed and running as a standalone app!`, "success");
      const modal = document.getElementById('modal-app-download');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      return;
    }

    // 2. Check if browser prompt is available (Android, Chrome, Edge)
    if (window.deferredInstallPrompt) {
      window.deferredInstallPrompt.prompt();
      window.deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast("🎉 Installing TaraLets to your device Home Screen!", "success");
          window.deferredInstallPrompt = null;
          const modal = document.getElementById('modal-app-download');
          if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
          }
        } else {
          this.showToast("App installation dismissed. You can install anytime!", "info");
        }
      }).catch((err) => {
        console.warn('Install prompt notice:', err);
      });
      return;
    }

    // 3. Check if iOS device (iPhone / iPad Safari)
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (isIos) {
      const iosGuide = document.getElementById('pwa-ios-guide');
      if (iosGuide) iosGuide.classList.remove('hidden');
      this.showToast("📱 On iPhone/iPad: Tap the Safari Share button (⎋) and choose 'Add to Home Screen'!", "info");
      return;
    }

    // 4. Fallback instruction for browser menu
    this.showToast(`📱 To install on this device: Open your browser menu (⋮) and tap "Install app" or "Add to Home screen"!`, "info");
    const iosGuide = document.getElementById('pwa-ios-guide');
    if (iosGuide) iosGuide.classList.remove('hidden');
  }

  openRoleSimulator(role) {
    storage.setActiveRole(role);
    const modal = document.getElementById('modal-app-download');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.showToast(`Switched to TaraLets ${role === 'driver' ? 'Driver' : 'Commuter'} Edition!`, "info");
  }

  // --- PAYMENT & WALLET MODALS ---
  openPaymentCenterModal() {
    const modal = document.getElementById('modal-payment-center');
    if (!modal) return;

    const role = storage.getActiveRole();
    const user = role === 'driver' ? storage.getCurrentDriver() : storage.getCurrentPassenger();
    const balanceEl = document.getElementById('payment-modal-wallet-balance');
    const userEl = document.getElementById('payment-modal-user-name');
    const txContainer = document.getElementById('payment-modal-transactions');

    if (balanceEl) balanceEl.textContent = `₱${(user.walletBalance || 0).toFixed(2)}`;
    if (userEl) userEl.textContent = `${user.name} (${role === 'driver' ? 'Driver Account' : 'Commuter Account'})`;

    if (txContainer) {
      const txs = storage.getTransactions(user.id);
      if (txs.length === 0) {
        txContainer.innerHTML = `<div class="text-xs text-slate-400 py-4 text-center">No transactions recorded yet.</div>`;
      } else {
        txContainer.innerHTML = txs.map(t => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <strong class="text-slate-800 block">${t.description}</strong>
              <span class="text-[10px] text-slate-400">${t.date}</span>
            </div>
            <span class="font-bold ${t.amount > 0 ? 'text-emerald-600' : 'text-slate-700'}">
              ${t.amount > 0 ? '+' : ''}₱${Math.abs(t.amount).toFixed(2)}
            </span>
          </div>
        `).join('');
      }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  handleWalletTopupSubmit(e) {
    e.preventDefault();
    const amount = document.getElementById('topup-amount-input').value;
    const modeId = document.getElementById('topup-payment-mode').value;
    const role = storage.getActiveRole();
    const user = role === 'driver' ? storage.getCurrentDriver() : storage.getCurrentPassenger();

    try {
      storage.topUpWallet(role, user.id, amount, modeId);
      this.openPaymentCenterModal();
    } catch (err) {
      this.showToast(err.message, "error");
    }
  }

  openDriverQrModal(bookingId) {
    const booking = storage.getBookingById(bookingId);
    if (!booking) return;

    const modal = document.getElementById('modal-driver-qr');
    if (!modal) return;

    const driver = storage.getDrivers().find(d => d.id === booking.driverId) || storage.getCurrentDriver();
    const payMethods = driver.paymentMethods || {};

    document.getElementById('qr-modal-driver-name').textContent = driver.name;
    document.getElementById('qr-modal-amount').textContent = `₱${booking.fare}.00`;
    document.getElementById('qr-modal-route').textContent = `${booking.pickupPoint} ➔ ${booking.destinationPoint}`;
    
    document.getElementById('qr-modal-gcash-no').textContent = payMethods.gcashNumber || driver.phone;
    document.getElementById('qr-modal-gcash-name').textContent = payMethods.gcashName || driver.name;
    document.getElementById('qr-modal-maya-handle').textContent = payMethods.mayaAccount || `@${driver.name.toLowerCase().replace(/[^a-z]/g, '')}`;
    document.getElementById('qr-modal-bank-info').textContent = `${payMethods.bankName || 'BDO Unibank'}: ${payMethods.bankAccount || '0041-8829-1049'}`;

    const markBtn = document.getElementById('btn-qr-mark-paid');
    if (markBtn) {
      markBtn.onclick = () => {
        storage.markPaymentAsPaid(booking.id);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      };
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  markPaymentPaid(bookingId) {
    storage.markPaymentAsPaid(bookingId);
  }

  updateBookingStatus(bookingId, newStatus) {
    storage.updateBookingStatus(bookingId, newStatus);
  }

  cancelBooking(bookingId) {
    if (confirm("Cancel this passenger booking? Seat will be freed up.")) {
      storage.updateBookingStatus(bookingId, 'cancelled');
      this.showToast("Booking cancelled and seat released.", "info");
    }
  }

  openChat(bookingId) {
    chatManager.openChat(bookingId);
  }

  openChatForPassenger(passengerId) {
    const currentDriver = storage.getCurrentDriver();
    const booking = storage.getBookings().find(b => b.driverId === currentDriver.id && b.passengerId === passengerId);
    if (booking) {
      chatManager.openChat(booking.id);
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-emerald-700 text-white border-emerald-500',
      error: 'bg-red-700 text-white border-red-500',
      info: 'bg-gray-900 text-white border-gray-700'
    };

    toast.className = `px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform duration-300 translate-y-2 opacity-0 flex items-center gap-2 ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 20);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ========================================================
  // LOGO-INSPIRED BACKGROUND THEME SYSTEM
  // ========================================================
  initTheme() {
    const savedTheme = localStorage.getItem('taralets_theme') || 'logo-emerald';
    this.setTheme(savedTheme, false);
  }

  setTheme(themeName, showToast = true) {
    document.body.classList.remove('theme-logo-emerald', 'theme-logo-mint', 'theme-logo-midnight');

    let metaColor = '#022c22';
    let themeIcon = '🌲';
    let themeLabel = 'Logo Forest';

    if (themeName === 'logo-mint') {
      document.body.classList.add('theme-logo-mint');
      metaColor = '#ecfdf5';
      themeIcon = '🍃';
      themeLabel = 'Logo Mint';
    } else if (themeName === 'logo-midnight') {
      document.body.classList.add('theme-logo-midnight');
      metaColor = '#01140e';
      themeIcon = '🌙';
      themeLabel = 'Logo Midnight';
    } else {
      themeName = 'logo-emerald';
      document.body.classList.add('theme-logo-emerald');
      metaColor = '#022c22';
      themeIcon = '🌲';
      themeLabel = 'Logo Forest';
    }

    // Update Meta Theme Color for mobile status bar & browser navigation
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', metaColor);
    }

    // Update HTML root background color for seamless mobile overscroll bounce
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = metaColor;
    }

    // Update theme toggle button icon & label if present
    const iconEl = document.getElementById('theme-icon');
    const labelEl = document.getElementById('theme-label');
    if (iconEl) iconEl.textContent = themeIcon;
    if (labelEl) labelEl.textContent = themeLabel;

    localStorage.setItem('taralets_theme', themeName);

    if (showToast) {
      this.showToast(`Theme: ${themeLabel} (Logo Palette)`, 'info');
    }
  }

  cycleTheme() {
    const currentTheme = localStorage.getItem('taralets_theme') || 'logo-emerald';
    let nextTheme = 'logo-emerald';
    if (currentTheme === 'logo-emerald') nextTheme = 'logo-mint';
    else if (currentTheme === 'logo-mint') nextTheme = 'logo-midnight';
    else nextTheme = 'logo-emerald';

    this.setTheme(nextTheme, true);
  }

  // ==========================================
  // DEVELOPER & FLEET API KEYS PORTAL
  // ==========================================

  openApiKeysModal() {
    const modal = document.getElementById('modal-api-keys');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    this.renderApiKeysList();
    this.updateCurlPreview();
  }

  renderApiKeysList() {
    const container = document.getElementById('api-keys-list-container');
    const badge = document.getElementById('api-keys-count-badge');
    if (!container) return;

    const keys = storage.getApiKeys();
    if (badge) {
      badge.textContent = `${keys.length} ${keys.length === 1 ? 'Key' : 'Keys'}`;
    }

    if (keys.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
          <p class="font-bold text-slate-700">No API keys created yet</p>
          <p class="text-[11px] text-slate-500 mt-1">Generate your first key above to integrate mobile GPS and booking systems.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = keys.map(k => {
      const isLive = k.environment === 'live';
      const isActive = k.status === 'active';
      const maskedKey = `${k.key.substring(0, 10)}••••••••••••••••${k.key.slice(-4)}`;
      const formattedDate = new Date(k.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

      return `
        <div class="p-3.5 rounded-xl border ${isActive ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-extrabold text-xs text-slate-900 truncate">${k.name}</span>
              <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                ${isLive ? 'Live Production' : 'Sandbox / Test'}
              </span>
              <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}">
                ${isActive ? 'Active' : 'Revoked'}
              </span>
            </div>

            <div class="mt-1 flex items-center gap-2 font-mono text-[11px] text-slate-600">
              <span class="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold truncate">${maskedKey}</span>
              <button type="button" onclick="window.taraletsApp.copyApiKey('${k.key}')" class="text-emerald-700 hover:text-emerald-900 text-xs font-bold" title="Copy Key Token">
                📋
              </button>
            </div>

            <div class="mt-2 flex items-center gap-1.5 flex-wrap">
              ${(k.scopes || []).map(s => `
                <span class="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/80">${s}</span>
              `).join('')}
              <span class="text-[10px] text-slate-400 ml-1">Created ${formattedDate}</span>
              ${k.lastUsed ? `<span class="text-[10px] text-emerald-600 font-semibold">• Used ${k.lastUsed}</span>` : ''}
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <button type="button" onclick="window.taraletsApp.revokeApiKey('${k.id}')" class="px-2.5 py-1 text-xs font-bold rounded-lg border transition ${isActive ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100' : 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'}">
              ${isActive ? 'Revoke' : 'Restore'}
            </button>
            <button type="button" onclick="window.taraletsApp.deleteApiKey('${k.id}')" class="p-1 text-slate-400 hover:text-rose-600 transition" title="Delete Key">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  handleGenerateApiKey(e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById('api-key-input-name');
    const envInput = document.getElementById('api-key-input-env');
    if (!nameInput || !envInput) return;

    const name = nameInput.value.trim();
    const env = envInput.value;
    if (!name) {
      this.showToast('Please enter a descriptive name for your API key.', 'warning');
      return;
    }

    const scopes = [];
    if (document.getElementById('api-scope-trips')?.checked) scopes.push('read:trips');
    if (document.getElementById('api-scope-gps')?.checked) scopes.push('read:gps');
    if (document.getElementById('api-scope-bookings')?.checked) scopes.push('write:bookings');

    const newKey = storage.generateApiKey(name, env, scopes);

    // Show secret banner
    const banner = document.getElementById('api-key-new-banner');
    const tokenDisplay = document.getElementById('api-key-new-token');
    if (banner && tokenDisplay) {
      tokenDisplay.textContent = newKey.key;
      banner.classList.remove('hidden');
    }

    // Reset name input
    nameInput.value = '';

    this.renderApiKeysList();
    this.updateCurlPreview();
    this.showToast('API Key generated! Copy secret token now.', 'success');
  }

  copyNewGeneratedApiKey() {
    const tokenDisplay = document.getElementById('api-key-new-token');
    if (!tokenDisplay) return;
    const key = tokenDisplay.textContent.trim();
    this.copyApiKey(key);
  }

  copyApiKey(keyText) {
    if (!keyText) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(keyText).then(() => {
        this.showToast('API Key copied to clipboard!', 'success');
      }).catch(() => {
        this.fallbackCopyText(keyText);
      });
    } else {
      this.fallbackCopyText(keyText);
    }
  }

  fallbackCopyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      this.showToast('API Key copied to clipboard!', 'success');
    } catch (err) {
      this.showToast('Failed to copy. Please manually copy the key.', 'error');
    }
    document.body.removeChild(ta);
  }

  revokeApiKey(keyId) {
    const updated = storage.revokeApiKey(keyId);
    this.renderApiKeysList();
    this.updateCurlPreview();
    if (updated) {
      this.showToast(updated.status === 'revoked' ? 'API Key has been revoked.' : 'API Key restored to active.', 'info');
    }
  }

  deleteApiKey(keyId) {
    if (!confirm('Are you sure you want to permanently delete this API key?')) return;
    storage.deleteApiKey(keyId);
    this.renderApiKeysList();
    this.updateCurlPreview();
    this.showToast('API key deleted.', 'info');
  }

  onApiExplorerEndpointChange(endpoint) {
    this.updateCurlPreview(endpoint);
  }

  updateCurlPreview(chosenEndpoint) {
    const endpointEl = document.getElementById('api-explorer-endpoint');
    const endpoint = chosenEndpoint || (endpointEl ? endpointEl.value : 'gps');
    const curlEl = document.getElementById('api-curl-preview');
    if (!curlEl) return;

    const keys = storage.getApiKeys();
    const activeKey = keys.find(k => k.status === 'active') || keys[0];
    const tokenStr = activeKey ? activeKey.key : 'tl_live_your_secret_key_here';

    let path = 'driver/gps';
    if (endpoint === 'trips') path = 'trips';
    if (endpoint === 'bookings') path = 'bookings';

    curlEl.textContent = `curl -X GET "https://taralets-tawny.vercel.app/api/v1/${path}" \\\n  -H "Authorization: Bearer ${tokenStr}"`;
  }

  copyCurlCommand() {
    const curlEl = document.getElementById('api-curl-preview');
    if (!curlEl) return;
    this.copyApiKey(curlEl.textContent.trim());
  }

  executeApiSimulation() {
    const endpointEl = document.getElementById('api-explorer-endpoint');
    const endpoint = endpointEl ? endpointEl.value : 'gps';
    const responseEl = document.getElementById('api-response-payload');

    const keys = storage.getApiKeys();
    const activeKey = keys.find(k => k.status === 'active') || keys[0];

    if (!activeKey || activeKey.status !== 'active') {
      if (responseEl) {
        responseEl.textContent = JSON.stringify({
          status: 401,
          error: "Unauthorized",
          message: "No active API key found. Generate an active key above or restore an existing key."
        }, null, 2);
      }
      this.showToast('No active API Key found for request simulation.', 'warning');
      return;
    }

    const res = storage.simulateApiRequest(endpoint, activeKey.key);
    if (responseEl) {
      responseEl.textContent = JSON.stringify(res, null, 2);
    }
    this.renderApiKeysList();
    this.showToast(`API ${res.status} OK - Received response`, 'success');
  }
}

// Global exposure
window.storage = storage;
window.taraletsApp = new TaraLetsApp();
window.chatManager = chatManager;

document.addEventListener('DOMContentLoaded', () => {
  window.taraletsApp.init();
});

})();