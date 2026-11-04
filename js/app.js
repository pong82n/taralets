/**
 * TaraLets - Core Application Controller
 * Handles UI interactions, Driver Booking workflows, Trip Posting, and Event Subscriptions
 */

import { storage } from './storage.js';
import { evaluateWorkplaceMatch, getMatchingPassengersForTrip, getMatchingTripsForPassenger, calculateDistanceKm } from './matching.js';
import { CommuteMapManager } from './map.js';
import { chatManager } from './chat.js';

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

    // Add Passenger Request Form
    const paxForm = document.getElementById('form-add-commuter');
    if (paxForm) {
      paxForm.addEventListener('submit', (e) => this.handleAddCommuterSubmit(e));
    }

    // Global custom events
    window.addEventListener('taralets:role-changed', () => {
      this.syncActiveRoleUI();
      this.render();
    });

    window.addEventListener('taralets:user-changed', () => {
      this.render();
    });

    window.addEventListener('taralets:booking-created', (e) => {
      this.showToast(`🎉 Seat booked for ${e.detail.passengerName}! Notification sent to commuter.`, "success");
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

    // Map resize trigger
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
          ${d.name} (${d.vehicle.type === 'motorcycle' ? '🏍️ Motorcycle' : '🚗 Car'} - ${d.company})
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

    if (avatarEl && user.avatar) avatarEl.src = user.avatar;
    if (nameEl) nameEl.textContent = user.name;
    if (badgeEl) {
      badgeEl.textContent = role === 'driver' ? (user.vehicle.type === 'motorcycle' ? '🏍️ Moto Driver' : '🚗 Car Driver') : '🧍 Commuter';
      badgeEl.className = `px-2 py-0.5 text-xs font-bold rounded-full ${role === 'driver' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`;
    }
    if (subtitleEl) {
      subtitleEl.textContent = `${user.company} • ${user.workSchedule || 'Day Shift'}`;
    }
  }

  // ================= DRIVER DASHBOARD =================
  renderDriverDashboard() {
    const currentDriver = storage.getCurrentDriver();
    const myTrips = storage.getTripsByDriver(currentDriver.id);
    const tripsContainer = document.getElementById('driver-trips-list');

    // 1. Render Driver's Commute Trips
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
        // Default to first active trip if none selected
        if (!this.selectedTripId || !myTrips.some(t => t.id === this.selectedTripId)) {
          this.selectedTripId = myTrips[0].id;
        }

        tripsContainer.innerHTML = myTrips.map(trip => {
          const isSelected = trip.id === this.selectedTripId;
          const isFull = (trip.bookedSeats || 0) >= trip.totalSeats;
          const remainingSeats = trip.totalSeats - (trip.bookedSeats || 0);
          const isMoto = trip.vehicleType === 'motorcycle';

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

              ${trip.routeVia ? `
                <div class="mt-2 text-[11px] text-gray-500 flex items-center gap-1 bg-gray-50 p-1.5 rounded">
                  <span>🛣️</span>
                  <span class="truncate">${trip.routeVia}</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }
    }

    // 2. Render Matching Passengers Radar for the Selected Trip
    this.renderMatchingPassengersRadar();

    // 3. Render Active Driver Bookings
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

    // Update map with this trip and matches
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
            Vehicle at Full Capacity (${selectedTrip.totalSeats}/${selectedTrip.totalSeats})
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
                    <div class="text-xs text-gray-500">
                      ⏰ <strong>Work Shift:</strong> ${p.workSchedule || '08:00 AM - 05:00 PM'}
                    </div>
                  </div>
                </div>

                <!-- Driver Booking Action Button -->
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

              <!-- Match Badges -->
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

      return `
        <div class="p-3 rounded-xl border border-gray-200 bg-white shadow-sm mb-2.5">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <img src="${b.passengerAvatar}" alt="${b.passengerName}" class="w-9 h-9 rounded-full object-cover">
              <div>
                <h4 class="font-bold text-gray-900 text-xs">${b.passengerName}</h4>
                <p class="text-[11px] text-gray-500">📍 ${b.pickupPoint}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${
                isCompleted ? 'bg-gray-100 text-gray-700' :
                isInTransit ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }">
                ${b.status.replace('_', ' ').toUpperCase()}
              </span>
              <div class="text-xs font-bold text-gray-900 mt-0.5">₱${b.fare}</div>
            </div>
          </div>

          <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <button onclick="window.taraletsApp.openChat('${b.id}')"
              class="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center gap-1 transition">
              💬 Chat / Landmark
            </button>

            <div class="flex items-center gap-1">
              ${isConfirmed ? `
                <button onclick="window.taraletsApp.updateBookingStatus('${b.id}', 'in_transit')"
                  class="px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition">
                  🚗 Picked Up
                </button>
              ` : isInTransit ? `
                <button onclick="window.taraletsApp.updateBookingStatus('${b.id}', 'completed')"
                  class="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">
                  🏁 Arrived at Office
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

  // ================= PASSENGER VIEW =================
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
            ${myBookings.map(b => `
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
                  <button onclick="window.taraletsApp.openChat('${b.id}')"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1">
                    💬 Chat Driver
                  </button>
                </div>
                ${b.driverNote ? `
                  <div class="mt-3 p-2 bg-white rounded-lg text-xs text-gray-700 border border-gray-100 italic">
                    "${b.driverNote}"
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    // Matching drivers traveling to passenger's workplace
    const driversContainer = document.getElementById('passenger-matching-drivers');
    if (driversContainer) {
      const matchedTrips = getMatchingTripsForPassenger(currentPax);
      driversContainer.innerHTML = matchedTrips.map(item => {
        const t = item.trip;
        const m = item.match;
        const isBooked = item.isAlreadyBooked;

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

  // ================= MODAL ACTIONS =================
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

    // Populate Modal Content
    document.getElementById('modal-pax-avatar').src = passenger.avatar;
    document.getElementById('modal-pax-name').textContent = passenger.name;
    document.getElementById('modal-pax-company').textContent = passenger.company;
    document.getElementById('modal-pax-pickup').textContent = passenger.pickupLocation;
    document.getElementById('modal-pax-shift').textContent = passenger.workSchedule || '08:00 AM - 05:00 PM';

    const match = evaluateWorkplaceMatch(trip, passenger);
    document.getElementById('modal-match-score').textContent = `${match.score}% MATCH`;

    // Populate Trip selector
    const driverTrips = storage.getTripsByDriver(storage.getCurrentDriverId());
    const tripSelect = document.getElementById('modal-select-trip');
    if (tripSelect) {
      tripSelect.innerHTML = driverTrips.map(t => `
        <option value="${t.id}" ${t.id === trip.id ? 'selected' : ''}>
          ${t.vehicleModel} (${t.departureTime}) - To ${t.destinationName} (${t.totalSeats - t.bookedSeats} seats left)
        </option>
      `).join('');
    }

    // Default suggested fare
    const fareInput = document.getElementById('modal-booking-fare');
    if (fareInput) fareInput.value = trip.farePerSeat;

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

    try {
      storage.createDriverBooking({
        tripId,
        passengerId,
        customFare,
        driverNote
      });

      // Close modal
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

    // Populate workplace hubs
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
      originLat: 14.6500, // Approx Metro Manila origin
      originLng: 121.0300,
      departureDate: "Today",
      departureTime,
      totalSeats,
      bookedSeats: 0,
      farePerSeat,
      routeVia,
      status: "active",
      bookedPassengerIds: [],
      notes
    };

    storage.createTrip(newTrip);
    this.selectedTripId = newTrip.id;

    // Close modal
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

// Global exposure for inline HTML event handlers
window.taraletsApp = new TaraLetsApp();
window.chatManager = chatManager;

document.addEventListener('DOMContentLoaded', () => {
  window.taraletsApp.init();
});
