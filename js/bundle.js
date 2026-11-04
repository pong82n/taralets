/**
 * TaraLets - Standalone Application Bundle with Modes of Payment Support
 * (GCash, Maya, Cash on Boarding, QR Ph / Bank Transfer, TaraLets Wallet)
 */

(function() {
  'use strict';

  // --- 1. MODES OF PAYMENT DEFINITIONS ---
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
      description: "Scan Driver GCash QR or send to mobile number",
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
      description: "Universal QR Ph (BDO, BPI, UnionBank, GoTyme, Seabank)",
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

  // --- 2. WORKPLACE HUBS ---
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

  // --- 3. SEED DRIVERS ---
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
        acceptsCash: false,
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

  // --- 4. SEED PASSENGERS ---
  const INITIAL_PASSENGERS = [
    {
      id: "pax-01",
      name: "Paulo Gomez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      phone: "0917-111-2290",
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

  // --- 5. SEED COMMUTE TRIPS ---
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

  // --- 6. SEED BOOKINGS WITH PAYMENT RECORDS ---
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
        status: "paid",
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
        status: "pending_cash",
        referenceNo: "CASH-ON-BOARDING",
        paidAt: null
      },
      createdAt: "2026-11-04T01:25:00Z"
    }
  ];

  // --- 7. STORAGE SERVICE ---
  const STORAGE_KEYS = {
    DRIVERS: 'taralets_drivers',
    PASSENGERS: 'taralets_passengers',
    TRIPS: 'taralets_trips',
    BOOKINGS: 'taralets_bookings',
    ACTIVE_USER_ROLE: 'taralets_active_role',
    CURRENT_DRIVER_ID: 'taralets_current_driver_id',
    CURRENT_PASSENGER_ID: 'taralets_current_passenger_id',
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

    getWorkplaceHubs() { return WORKPLACE_HUBS; }
    getHubById(id) { return WORKPLACE_HUBS.find(h => h.id === id) || WORKPLACE_HUBS[0]; }

    getPaymentModes() { return PAYMENT_MODES; }
    getPaymentModeById(modeId) { return PAYMENT_MODES.find(m => m.id === modeId) || PAYMENT_MODES[0]; }

    getActiveRole() { return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ROLE) || 'driver'; }
    setActiveRole(role) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ROLE, role);
      window.dispatchEvent(new CustomEvent('taralets:role-changed', { detail: { role } }));
    }

    getCurrentDriverId() { return localStorage.getItem(STORAGE_KEYS.CURRENT_DRIVER_ID) || INITIAL_DRIVERS[0].id; }
    setCurrentDriverId(id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_DRIVER_ID, id);
      window.dispatchEvent(new CustomEvent('taralets:user-changed', { detail: { type: 'driver', id } }));
    }

    getCurrentPassengerId() { return localStorage.getItem(STORAGE_KEYS.CURRENT_PASSENGER_ID) || INITIAL_PASSENGERS[0].id; }
    setCurrentPassengerId(id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PASSENGER_ID, id);
      window.dispatchEvent(new CustomEvent('taralets:user-changed', { detail: { type: 'passenger', id } }));
    }

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
      if (idx >= 0) drivers[idx] = driverData; else drivers.push(driverData);
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
      return driverData;
    }

    getPassengers() {
      const raw = localStorage.getItem(STORAGE_KEYS.PASSENGERS);
      return raw ? JSON.parse(raw) : INITIAL_PASSENGERS;
    }
    getCurrentPassenger() {
      const pax = this.getPassengers();
      const id = this.getCurrentPassengerId();
      return pax.find(p => p.id === id) || pax[0];
    }
    savePassenger(passengerData) {
      const passengers = this.getPassengers();
      const idx = passengers.findIndex(p => p.id === passengerData.id);
      if (idx >= 0) passengers[idx] = passengerData; else passengers.push(passengerData);
      localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(passengers));
      return passengerData;
    }

    getTrips() {
      const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
      return raw ? JSON.parse(raw) : INITIAL_COMMUTE_TRIPS;
    }
    getTripById(tripId) { return this.getTrips().find(t => t.id === tripId); }
    getTripsByDriver(driverId) { return this.getTrips().filter(t => t.driverId === driverId); }
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

    getBookings() {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return raw ? JSON.parse(raw) : INITIAL_BOOKINGS;
    }
    getBookingById(id) { return this.getBookings().find(b => b.id === id); }

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

      let isWalletPaid = false;
      if (paymentModeId === 'wallet') {
        if ((passenger.walletBalance || 0) < fareAmount) {
          throw new Error(`Insufficient wallet balance! Commuter balance is ₱${(passenger.walletBalance || 0).toFixed(2)}, required ₱${fareAmount}. Please top up or choose GCash / Cash.`);
        }
        passenger.walletBalance -= fareAmount;
        this.savePassenger(passenger);
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

      const bookings = this.getBookings();
      bookings.unshift(newBooking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

      trip.bookedSeats = (trip.bookedSeats || 0) + 1;
      if (!trip.bookedPassengerIds) trip.bookedPassengerIds = [];
      if (!trip.bookedPassengerIds.includes(passenger.id)) {
        trip.bookedPassengerIds.push(passenger.id);
      }
      this.updateTrip(trip);

      passenger.status = 'booked';
      this.savePassenger(passenger);

      this.addTransaction({
        userId: passenger.id,
        userType: "passenger",
        type: "fare_booking",
        amount: -fareAmount,
        modeId: mode.id,
        description: `Carpool share to ${trip.destinationName} (${driver.name})`
      });

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

    updateBookingStatus(bookingId, status) {
      const bookings = this.getBookings();
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return null;

      booking.status = status;
      booking.updatedAt = new Date().toISOString();

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
  }

  const storage = new StorageService();

  // --- 8. MATCHING ENGINE ---
  function evaluateWorkplaceMatch(driverOrTrip, passenger) {
    let score = 50;
    const badges = [];
    const reasons = [];

    const driverWorkplaceId = driverOrTrip.workplaceId;
    const passengerWorkplaceId = passenger.workplaceId;

    if (driverWorkplaceId && passengerWorkplaceId && driverWorkplaceId === passengerWorkplaceId) {
      score += 35;
      badges.push("SAME WORK DISTRICT");
      reasons.push("Both heading to the exact same business hub");
    } else {
      const isNearbyHub = (driverWorkplaceId === 'hub-bgc' && passengerWorkplaceId === 'hub-makati') ||
                          (driverWorkplaceId === 'hub-makati' && passengerWorkplaceId === 'hub-bgc') ||
                          (driverWorkplaceId === 'hub-ortigas' && passengerWorkplaceId === 'hub-eastwood');
      if (isNearbyHub) {
        score += 15;
        badges.push("ADJACENT DISTRICT");
        reasons.push("Neighboring business hub along common arterial road");
      }
    }

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

    const tripTime = driverOrTrip.departureTime || driverOrTrip.workSchedule || "";
    const passengerShift = passenger.workSchedule || "";
    if (tripTime && passengerShift) {
      const tripHour = parseInt(tripTime.match(/\d+/)?.[0] || "8", 10);
      const paxHour = parseInt(passengerShift.match(/\d+/)?.[0] || "8", 10);
      const hourDiff = Math.abs(tripHour - paxHour);

      if (hourDiff <= 1) {
        score += 10;
        badges.push("SHIFT TIME SYNC");
        reasons.push("Work shift starts at roughly the same hour");
      }
    }

    const finalScore = Math.min(99, Math.max(40, score));

    return {
      score: finalScore,
      badges: badges.slice(0, 3),
      reasons,
      isSameWorkplace: driverWorkplaceId === passengerWorkplaceId,
      vehicleType
    };
  }

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

  // --- 9. MAP MANAGER ---
  class CommuteMapManager {
    constructor(mapContainerId = 'commute-map') {
      this.containerId = mapContainerId;
      this.map = null;
      this.markersLayer = null;
      this.routeLayer = null;
      this.defaultCenter = [14.5800, 121.0500];
      this.defaultZoom = 12;
    }

    init() {
      const el = document.getElementById(this.containerId);
      if (!el || typeof L === 'undefined') return;

      if (this.map) {
        this.map.remove();
      }

      this.map = L.map(this.containerId, {
        zoomControl: true,
        attributionControl: false
      }).setView(this.defaultCenter, this.defaultZoom);

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
            Shared Workplace Hub
          </span>
          <h4 class="font-bold text-gray-900">${trip.destinationName}</h4>
          <p class="text-xs text-gray-500">Destination of Commute</p>
        </div>
      `);

      const routeCoords = [
        [originLat, originLng],
        [(originLat + destLat) / 2 + 0.015, (originLng + destLng) / 2 + 0.01],
        [destLat, destLng]
      ];

      L.polyline(routeCoords, {
        color: routeColor,
        weight: 5,
        opacity: 0.85,
        dashArray: isMotorcycle ? '6, 8' : null
      }).addTo(this.routeLayer);

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

      try {
        const group = new L.featureGroup([this.markersLayer, this.routeLayer]);
        this.map.fitBounds(group.getBounds().pad(0.2));
      } catch (e) {
        this.map.setView([originLat, originLng], 12);
      }
    }

    invalidateSize() {
      if (this.map) {
        setTimeout(() => this.map.invalidateSize(), 200);
      }
    }
  }

  // --- 10. CHAT MANAGER ---
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
        osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.3);
      } catch (e) {}
    }

    openChat(bookingId) {
      this.activeBookingId = bookingId;
      const booking = storage.getBookingById(bookingId);
      if (!booking) return;

      const modal = document.getElementById('chat-modal');
      if (!modal) return;

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
            <p class="text-xs mt-1">Coordinate exact pickup landmark, payment confirmation, or arrival notes!</p>
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
        senderName,
        text: text.trim()
      });

      this.playChime();
      this.renderMessages();

      const input = document.getElementById('chat-input');
      if (input) input.value = '';

      setTimeout(() => {
        if (this.activeBookingId !== booking.id) return;
        const counterpartRole = activeRole === 'driver' ? 'passenger' : 'driver';
        const counterpartName = activeRole === 'driver' ? booking.passengerName : booking.driverName;

        const repliesDriver = [
          `Copy that! Driving now along the corridor, ETA 5 minutes. Watch out for hazard lights.`,
          `Got it! Payment acknowledged. See you at the pickup point!`,
          `All set! Thanks for letting me know. See you shortly co-worker!`
        ];

        const repliesPassenger = [
          `Understood! Sent payment via GCash already. Waiting at the curb with my company ID!`,
          `Thanks for the update! I have exact cash ready. See your vehicle approaching now.`,
          `Noted! See you in a minute. Thank you so much for booking me in your ride!`
        ];

        const replies = counterpartRole === 'driver' ? repliesDriver : repliesPassenger;
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

  // --- 11. CORE APP CONTROLLER ---
  class TaraLetsApp {
    constructor() {
      this.mapManager = new CommuteMapManager('commute-map');
      this.selectedTripId = null;
      this.selectedBookingPassengerId = null;
    }

    init() {
      this.setupEventListeners();
      this.mapManager.init();
      this.syncActiveRoleUI();
      this.render();
    }

    setupEventListeners() {
      document.querySelectorAll('.role-switcher-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const role = e.currentTarget.dataset.role;
          storage.setActiveRole(role);
        });
      });

      const driverSelect = document.getElementById('driver-user-select');
      if (driverSelect) {
        driverSelect.addEventListener('change', (e) => {
          storage.setCurrentDriverId(e.target.value);
        });
      }

      const paxSelect = document.getElementById('passenger-user-select');
      if (paxSelect) {
        paxSelect.addEventListener('change', (e) => {
          storage.setCurrentPassengerId(e.target.value);
        });
      }

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

      document.querySelectorAll('.chat-quick-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          const text = e.target.textContent;
          chatManager.sendMessage(text);
        });
      });

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

      const tripForm = document.getElementById('form-post-trip');
      if (tripForm) {
        tripForm.addEventListener('submit', (e) => this.handlePostTripSubmit(e));
      }

      const bookingForm = document.getElementById('form-confirm-booking');
      if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => this.handleConfirmBookingSubmit(e));
      }

      const paxForm = document.getElementById('form-add-commuter');
      if (paxForm) {
        paxForm.addEventListener('submit', (e) => this.handleAddCommuterSubmit(e));
      }

      const topupForm = document.getElementById('form-wallet-topup');
      if (topupForm) {
        topupForm.addEventListener('submit', (e) => this.handleWalletTopupSubmit(e));
      }

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
      const activeRole = storage.getActiveRole();
      const isDriver = activeRole === 'driver';

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

      this.mapManager.invalidateSize();
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
      const bookings = storage.getBookings().filter(b => b.driverId === currentDriver.id);
      const container = document.getElementById('driver-active-bookings-list');
      if (!container) return;

      if (bookings.length === 0) {
        container.innerHTML = `
          <div class="text-center py-6 text-gray-400 text-xs">
            No booked passengers yet. Use the radar above to book colleagues going your way!
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
              <h3 class="font-bold text-gray-900 text-sm">🎟️ Your Commute Bookings (Created by Drivers)</h3>
              <p class="text-xs text-gray-500">Drivers traveling to ${currentPax.company} who booked seats for you</p>
            </div>
            <div class="space-y-3">
              ${myBookings.map(b => {
                const payment = b.payment || { modeId: 'gcash', modeName: 'GCash', status: 'pending_digital' };
                const mode = storage.getPaymentModeById(payment.modeId);
                const isPaid = payment.status === 'paid';

                return `
                  <div class="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center gap-3">
                        <span class="p-2.5 bg-emerald-600 text-white rounded-xl text-lg">
                          ${b.vehicleType === 'motorcycle' ? '🏍️' : '🚗'}
                        </span>
                        <div>
                          <div class="flex items-center gap-2">
                            <h4 class="font-bold text-gray-900 text-sm">${b.driverName}</h4>
                            <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                              ${b.status}
                            </span>
                          </div>
                          <p class="text-xs font-semibold text-gray-700 mt-0.5">Vehicle: ${b.vehicleModel}</p>
                          <p class="text-xs text-gray-500">Departure: ${b.scheduledTime} • ₱${b.fare} share</p>
                        </div>
                      </div>
                      <div class="flex flex-col items-end gap-1.5">
                        <button onclick="window.taraletsApp.openChat('${b.id}')"
                          class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1">
                          💬 Chat Driver
                        </button>
                        <button onclick="window.taraletsApp.openDriverQrModal('${b.id}')"
                          class="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                          💳 Pay Driver
                        </button>
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
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }">
                        ${isPaid ? 'PAID & VERIFIED' : 'PAYMENT DUE'}
                      </span>
                    </div>

                    ${b.driverNote ? `
                      <div class="mt-2.5 p-2 bg-white rounded-lg text-xs text-gray-700 border border-gray-100 italic">
                        "${b.driverNote}"
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

              ${isBooked ? `
                <div class="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded text-center">
                  ✓ You are booked on this driver's route!
                </div>
              ` : `
                <div class="mt-2 text-xs text-gray-500 italic bg-gray-50 p-1.5 rounded">
                  Driver will review co-workers along route and assign bookings.
                </div>
              `}
            </div>
          `;
        }).join('');
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

      // Render payment options
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

      // Selected payment modes
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
        this.openPaymentCenterModal(); // refresh view
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
  }

  // Bind to window
  window.taraletsApp = new TaraLetsApp();
  window.chatManager = chatManager;
  window.storage = storage;

  document.addEventListener('DOMContentLoaded', () => {
    window.taraletsApp.init();
  });
})();
