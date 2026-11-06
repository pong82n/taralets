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
          <div class="${isBooked ? 'pax-gps-pulse-beacon' : ''}" style="background-color: ${isBooked ? '#10b981' : '#f59e0b'}; width: ${isBooked ? '36px' : '32px'}; height: ${isBooked ? '36px' : '32px'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.25); border: 2.5px solid white; font-size: ${isBooked ? '16px' : '14px'}; font-weight: bold; position: relative;">
            ${isBooked ? '🚶' : '🧍'}
            ${isBooked ? '<span style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; background: #22c55e; border: 2px solid white; border-radius: 50%;"></span>' : ''}
          </div>
        `,
        iconSize: isBooked ? [36, 36] : [32, 32],
        iconAnchor: isBooked ? [18, 18] : [16, 16]
      });

      const paxMarker = L.marker([p.pickupLat, p.pickupLng], { icon: paxIcon }).addTo(this.markersLayer);
      
      const popupHtml = `
        <div class="p-2 text-sm" style="min-width: 190px;">
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 text-[11px] font-bold rounded ${isBooked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${isBooked ? 'Booked Co-Passenger (Live GPS)' : `${item.match.score}% Work Match`}
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
            <div class="mt-2 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 py-1.5 px-2 rounded-lg border border-emerald-200">
              <span class="block font-black text-emerald-800">✓ Confirmed Passenger GPS Live</span>
              <button type="button" onclick="window.taraletsApp.openLiveGpsTrackerForPassenger('${p.id}')" class="mt-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-1 px-2 rounded transition flex items-center justify-center gap-1">
                <span>🛰️</span>
                <span>Track Dual GPS</span>
              </button>
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

  renderConfirmedBookingLiveGps(trip, passenger, booking, progress = 0.52) {
    if (!this.map) this.init();
    if (!this.map || !trip || !passenger) return null;

    this.markersLayer.clearLayers();
    this.routeLayer.clearLayers();

    const isMotorcycle = trip.vehicleType === 'motorcycle';
    const routeColor = isMotorcycle ? '#10b981' : '#3b82f6';

    const originLat = Number(trip.originLat) || 14.7176;
    const originLng = Number(trip.originLng) || 121.0601;
    const destLat = Number(trip.destinationLat) || 14.5507;
    const destLng = Number(trip.destinationLng) || 121.0509;

    const paxLat = Number(passenger.pickupLat) || (originLat + (destLat - originLat) * 0.62);
    const paxLng = Number(passenger.pickupLng) || (originLng + (destLng - originLng) * 0.62);

    // Calculate simulated driver GPS location along corridor approaching passenger
    const safeProgress = Math.min(0.96, Math.max(0.05, progress));
    const driverGpsLat = originLat + (paxLat - originLat) * safeProgress;
    const driverGpsLng = originLng + (paxLng - originLng) * safeProgress;

    // Approximate distance between driver & passenger
    const dLat = (paxLat - driverGpsLat) * 111;
    const dLng = (paxLng - driverGpsLng) * 111 * Math.cos(driverGpsLat * (Math.PI / 180));
    const distKm = Math.max(0.1, Math.sqrt(dLat * dLat + dLng * dLng));
    const distFormatted = distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`;
    const etaMins = Math.max(1, Math.round(distKm * 2.8));

    this.driverPos = [driverGpsLat, driverGpsLng];
    this.paxPos = [paxLat, paxLng];

    // 1. DRIVER LIVE MOVING GPS VEHICLE MARKER (Pulsing Radar Beacon)
    const driverIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="gps-pulse-beacon" style="background-color: ${routeColor}; width: 44px; height: 44px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border: 3px solid white; font-size: 20px; position: relative; box-shadow: 0 4px 16px rgba(0,0,0,0.4);">
          ${isMotorcycle ? '🏍️' : '🚗'}
          <span style="position: absolute; top: -3px; right: -3px; width: 14px; height: 14px; background: #22c55e; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 0 8px #22c55e;"></span>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    this.driverMarker = L.marker([driverGpsLat, driverGpsLng], { icon: driverIcon, zIndexOffset: 1000 }).addTo(this.markersLayer);
    this.driverMarker.bindPopup(`
      <div class="p-2.5 text-xs min-w-[210px]">
        <div class="flex items-center gap-1.5 mb-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
            LIVE DRIVER GPS
          </span>
        </div>
        <div class="font-extrabold text-sm text-slate-900">${trip.driverName}</div>
        <div class="text-[11px] text-slate-600 font-semibold mt-0.5">${trip.vehicleModel} (${trip.plate || 'Verified'})</div>
        <div class="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg space-y-0.5">
          <div class="text-emerald-950 font-bold flex items-center justify-between">
            <span>Distance to Pickup:</span>
            <span>~${distFormatted}</span>
          </div>
          <div class="text-emerald-700 font-extrabold flex items-center justify-between">
            <span>Estimated Arrival:</span>
            <span>~${etaMins} mins</span>
          </div>
        </div>
        <p class="text-[10px] text-slate-400 mt-1.5">Corridor GPS Signal: 🟢 Active</p>
      </div>
    `);

    // 2. COMMUTER / PASSENGER LIVE GPS MARKER (Pulsing Radar Beacon)
    const paxIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="pax-gps-pulse-beacon" style="background-color: #2563eb; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px rgba(37,99,235,0.45); border: 3px solid white; font-size: 19px; position: relative;">
          🚶
          <span style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background: #3b82f6; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 6px #3b82f6;"></span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    this.passengerMarker = L.marker([paxLat, paxLng], { icon: paxIcon, zIndexOffset: 800 }).addTo(this.markersLayer);
    this.passengerMarker.bindPopup(`
      <div class="p-2.5 text-xs min-w-[200px]">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
            COMMUTER PICKUP GPS
          </span>
        </div>
        <div class="font-extrabold text-sm text-slate-900">${passenger.name}</div>
        <div class="text-[11px] text-slate-600 font-medium mt-0.5">📍 ${passenger.pickupLocation}</div>
        <div class="text-[10px] text-blue-600 font-bold mt-1.5">Status: Waiting at designated pickup spot</div>
      </div>
    `);

    // 3. WORKPLACE HUB DESTINATION MARKER
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #8b5cf6; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(139,92,246,0.4); border: 2.5px solid white; font-size: 17px;">
          🏢
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
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

    // 4. CORRIDOR POLYLINES
    const corridorCoords = [
      [originLat, originLng],
      [driverGpsLat, driverGpsLng],
      [paxLat, paxLng],
      [destLat, destLng]
    ];

    // Glow background
    L.polyline(corridorCoords, {
      color: routeColor,
      weight: 8,
      opacity: 0.3
    }).addTo(this.routeLayer);

    // Active path
    L.polyline(corridorCoords, {
      color: routeColor,
      weight: 5,
      opacity: 0.9,
      dashArray: isMotorcycle ? '6, 8' : null
    }).addTo(this.routeLayer);

    // Distance line between driver and passenger (pulsing dash)
    L.polyline([[driverGpsLat, driverGpsLng], [paxLat, paxLng]], {
      color: '#10b981',
      weight: 4,
      dashArray: '4, 6',
      opacity: 0.95
    }).addTo(this.routeLayer);

    // Fit bounds with padding
    try {
      const group = new L.featureGroup([this.markersLayer, this.routeLayer]);
      this.map.fitBounds(group.getBounds().pad(0.2));
    } catch (e) {
      this.map.setView([driverGpsLat, driverGpsLng], 13);
    }

    return {
      distKm,
      distFormatted,
      etaMins,
      driverLat: driverGpsLat,
      driverLng: driverGpsLng,
      paxLat,
      paxLng,
      trip,
      passenger,
      booking
    };
  }

  updateLivePositions(driverLat, driverLng) {
    if (this.driverMarker) {
      this.driverMarker.setLatLng([driverLat, driverLng]);
      this.driverPos = [driverLat, driverLng];
    }
  }

  focusOn(role = 'driver') {
    if (!this.map) return;
    if (role === 'driver' && this.driverPos) {
      this.map.flyTo(this.driverPos, 15, { animate: true, duration: 0.8 });
    } else if (role === 'passenger' && this.paxPos) {
      this.map.flyTo(this.paxPos, 15, { animate: true, duration: 0.8 });
    }
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }
}
