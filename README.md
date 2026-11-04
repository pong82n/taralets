# TaraLets (Commute Edition) 🚗🏍️
> **Driver-Initiated Workplace Ride Sharing & Carpooling Platform**

A modern web application where **car and motorcycle owners driving to work take control of booking passengers** who share the same office building, employer, or business district.

Instead of passengers hailing rides and waiting, **TaraLets** inverts the model: everyday commuters with vehicles publish their daily commute routine, scan co-workers heading in the exact same direction, and **directly allocate and book seats for them**.

---

## 🌟 Key Features

### 1. 🚗 Driver-Initiated Booking Flow
- **Driver in the Driver's Seat:** Drivers choose who rides with them from a pool of commuters going to the same workplace.
- **Direct Seat Reservation:** With 1 click, the driver sends an invite & seat confirmation to a passenger with customized pickup landmark notes (e.g., *"Waiting in front of 7-Eleven corner with hazard lights on"*).
- **Dual Vehicle Support:**
  - 🚗 **Car (Sedan / SUV / Hatchback):** 1 to 4 passenger seats, trunk space for laptop bags, air-conditioning.
  - 🏍️ **Motorcycle (Scooter / Underbone):** 1 back-ride passenger, rush-hour lane filtering, extra helmet & rain poncho options.

### 2. 🎯 Workplace Match Radar
- **Shared Job Center Detection:** Computes compatibility percentages between drivers and co-workers based on:
  - Exact Employer / Company (e.g., Google PH, BDO Unibank, SGV, IBM, Shopee, Accenture)
  - Business District / IT Park (BGC Taguig, Makati CBD, Ortigas Center, Eastwood Cyberpark, Technohub QC, Filinvest Alabang)
  - Work Shift Synchronization (e.g., 8:00 AM - 5:00 PM vs 8:30 AM - 5:30 PM)
  - Corridor & Highway Proximity (Commonwealth, C5, EDSA, CAVITEX, Skyway)

### 3. 🗺️ Interactive Route & Pickup Map
- Powered by Leaflet and OpenStreetMap.
- Real-time visualization of:
  - Driver Departure Point (Home origin)
  - Shared Workplace Destination Pin
  - Co-Worker Pickup Spots along the commute corridor
  - Color-coded routes (Blue for Cars, Emerald Green for Motorcycles)

### 4. 💬 In-App Pickup Coordination & Audio Chime
- Live chat modal between driver and booked passenger.
- Procedural audio chime (built with Web Audio API, zero audio asset dependencies).
- One-click quick status chips (*"Waiting at the curb"*, *"Hazard lights on"*, *"Running 3 mins late"*).

### 5. ⛽ Fuel & Toll Cost Splitter
- Built-in fair fare calculation that splits fuel and expressway toll expenses reasonably per seat (e.g., ₱90 to ₱180 per trip).

### 6. 🔄 Dual Persona Switcher
- Instant toggle between **Driver Mode** and **Commuter Mode** to test both perspectives.
- Pre-seeded with realistic Philippine commute scenarios.
- Persistent state saved to browser `localStorage` with a 1-click **Reset Demo Data** button.

---

## 🚀 How to Run

### Method 1: Direct File Open (Zero Install)
Simply double-click `index.html` or run:
```powershell
Start-Process "D:\TRANSPORT APPS\TaraLets\index.html"
```
It runs cleanly in Chrome, Opera GX, Edge, Firefox, or Safari with no server needed!

### Method 2: Local PowerShell Server (Recommended)
Launch the built-in lightweight `.NET` web server (no Node.js or Python required):
```powershell
.\serve.ps1
```
Then visit: [http://127.0.0.1:8088](http://127.0.0.1:8088)

---

## 📁 Project Architecture

```
TaraLets/
├── index.html         # Main application UI and responsive modals
├── css/
│   └── styles.css     # Custom styles, transitions, Leaflet customizations
├── js/
│   ├── bundle.js      # Standalone browser bundle (works offline & via file://)
│   ├── app.js         # Core application controller
│   ├── data.js        # Workplace hubs, driver, and commuter seed data
│   ├── storage.js     # Reactive LocalStorage manager
│   ├── matching.js    # Workplace & corridor compatibility algorithm
│   ├── map.js         # Leaflet OpenStreetMap route renderer
│   └── chat.js        # In-app coordination chat & audio chime
├── serve.ps1          # Lightweight Windows PowerShell HTTP server
└── README.md          # Project documentation
```

---

## 🌐 Deploy to GitHub Pages or Web Hosting
This application is 100% static and client-side ready. You can push it directly to GitHub:
```powershell
git add .
git commit -m "feat: complete TaraLets driver-booked workplace commute platform"
git push origin main
```
In your GitHub repository settings, enable **GitHub Pages** pointing to the `main` branch to get a live public URL instantly!
