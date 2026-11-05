/**
 * TaraLets - Storage Layer
 * Manages localStorage state with automatic initialization and reactive updates
 */

import {
  WORKPLACE_HUBS,
  INITIAL_DRIVERS,
  INITIAL_PASSENGERS,
  INITIAL_COMMUTE_TRIPS,
  INITIAL_BOOKINGS,
  PAYMENT_MODES
} from './data.js';

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
}

export const storage = new StorageService();
