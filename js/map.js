/**
 * TaraLets - Interactive Map Manager (Leaflet & OpenStreetMap)
 * Renders Driver origin, Office destination, and Passenger pickup points
 */

export class CommuteMapManager {
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

    this.map = L.map(this.containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView(this.defaultCenter, this.defaultZoom);

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

  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }
}
