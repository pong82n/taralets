/**
 * TaraLets - Workplace & Commute Match Engine
 * Computes compatibility between Driver routes and Passengers based on
 * shared office locations, job centers, shift times, and corridor proximity.
 */

import { storage } from './storage.js';

/**
 * Calculates straight line distance (Haversine formula in km)
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
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
export function evaluateWorkplaceMatch(driverOrTrip, passenger) {
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
export function getMatchingPassengersForTrip(trip) {
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
export function getMatchingTripsForPassenger(passenger) {
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
