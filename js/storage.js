/**
 * TaraLets - Storage Layer
 * Manages localStorage state with automatic initialization and reactive updates
 */

import {
  WORKPLACE_HUBS,
  INITIAL_DRIVERS,
  INITIAL_PASSENGERS,
  INITIAL_COMMUTE_TRIPS,
  INITIAL_BOOKINGS
} from './data.js';

const STORAGE_KEYS = {
  DRIVERS: 'taralets_drivers',
  PASSENGERS: 'taralets_passengers',
  TRIPS: 'taralets_trips',
  BOOKINGS: 'taralets_bookings',
  ACTIVE_USER_ROLE: 'taralets_active_role', // 'driver' or 'passenger'
  CURRENT_DRIVER_ID: 'taralets_current_driver_id',
  CURRENT_PASSENGER_ID: 'taralets_current_passenger_id',
  MESSAGES: 'taralets_messages'
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
        text: "Hi Miguel! I've booked you into my Fairview-to-NetPark trip. Will pick you up along Katipunan around 7:05 AM.",
        time: "06:15 AM"
      },
      {
        bookingId: "bk-101",
        sender: "passenger",
        senderName: "Miguel Santos",
        text: "Thanks Marco! Perfect, I'll be waiting in front of Ateneo Gate 3. See you!",
        time: "06:17 AM"
      }
    ]));
  }

  getWorkplaceHubs() {
    return WORKPLACE_HUBS;
  }

  getHubById(id) {
    return WORKPLACE_HUBS.find(h => h.id === id) || WORKPLACE_HUBS[0];
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
   * CORE REQUIREMENT: Driver initiates a booking for a passenger!
   */
  createDriverBooking({ tripId, passengerId, driverNote, customFare }) {
    const trips = this.getTrips();
    const trip = trips.find(t => t.id === tripId);
    if (!trip) throw new Error("Trip not found");

    if (trip.bookedSeats >= trip.totalSeats) {
      throw new Error(`This ${trip.vehicleType} has no seats remaining! Capacity: ${trip.totalSeats}`);
    }

    const passenger = this.getPassengers().find(p => p.id === passengerId);
    if (!passenger) throw new Error("Passenger not found");

    const driver = this.getDrivers().find(d => d.id === trip.driverId) || this.getCurrentDriver();

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
      fare: customFare !== undefined ? Number(customFare) : trip.farePerSeat,
      status: "confirmed", // Driver created the booking directly
      initiatedBy: "driver",
      driverNote: driverNote || `Driver ${driver.name} created this booking for your shared route to ${trip.destinationName}.`,
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

    // Generate initial welcome coordination message
    this.addMessage({
      bookingId: newBooking.id,
      sender: "driver",
      senderName: driver.name,
      text: `Hello ${passenger.name}! I booked a seat for you in my ${trip.vehicleType} (${trip.vehicleModel}) for our commute to work. Route: ${trip.routeVia || trip.destinationName}. Departure: ${trip.departureTime}.`,
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
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // If cancelled, free up seat
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

  // --- Messages / In-App Coordination ---
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
