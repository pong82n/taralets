/**
 * TaraLets - Initial Seed Data & Business Hubs
 * Work-commute carpooling platform where Drivers book matching co-commuters
 */

export const WORKPLACE_HUBS = [
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

export const INITIAL_DRIVERS = [
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
    badge: "Verified Employee",
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
    badge: "Verified Senior Auditor",
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
    badge: "Verified SGV Team Lead",
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
    badge: "Verified Systems Analyst",
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

export const INITIAL_PASSENGERS = [
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
    status: "looking", // 'looking', 'booked', 'pending_approval'
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
    willingToShareFare: true,
    bio: "Workplace is near Megamall / Ortigas. Very respectful passenger, ready 10 mins early."
  }
];

export const INITIAL_COMMUTE_TRIPS = [
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
    routeVia: "Commonwealth Ave > C5 Road > Kalayaan Flyover > BGC",
    status: "active", // active, completed, cancelled
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
    routeVia: "Boni > Coronado St > Makati-Mandaluyong Bridge > Makati Ave",
    status: "active",
    bookedPassengerIds: [],
    notes: "I bring a sanitized ICC helmet and rain gear. Safe, relaxed riding pace."
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
    routeVia: "CAVITEX > NAIAx Expressway > Skyway Stage 3 > Magallanes > Ayala",
    status: "active",
    bookedPassengerIds: ["pax-03"],
    notes: "Taking CAVITEX & Skyway tollways. Very chill acoustic playlist."
  }
];

export const INITIAL_BOOKINGS = [
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
    status: "confirmed", // 'driver_booked', 'confirmed', 'in_transit', 'completed', 'cancelled'
    initiatedBy: "driver", // DRIVER BOOKED PASSENGER!
    driverNote: "Booked seat 1 for Miguel since we both work at Net Park BGC!",
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
    createdAt: "2026-11-04T01:25:00Z"
  }
];
