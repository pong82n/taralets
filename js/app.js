/**
 * TaraLets - Core Application Controller
 * Handles Driver/Passenger Workflows, Verification, Bookings, and Payments
 */

import { storage } from './storage.js';
import { evaluateWorkplaceMatch, getMatchingPassengersForTrip, getMatchingTripsForPassenger } from './matching.js';
import { CommuteMapManager } from './map.js';
import { chatManager } from './chat.js';

class TaraLetsApp {
  constructor() {
    this.mapManager = new CommuteMapManager('commute-map');
    this.selectedTripId = null;
    this.selectedBookingPassengerId = null;
    this.requestingTripId = null;
  }

  init() {
    this.initTheme();
    this.handleUrlParams();
    this.setupEventListeners();
    this.mapManager.init();
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

    this.mapManager.invalidateSize();
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
                  <div class="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span class="text-[11px] text-slate-500">${t.totalSeats - (t.bookedSeats || 0)} seat(s) available</span>
                    <button onclick="window.taraletsApp.openPassengerRequestModal('${t.id}')" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5">
                      <span>🎟️</span>
                      <span>Request a Ride to Driver</span>
                    </button>
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
}

// Global exposure
window.storage = storage;
window.taraletsApp = new TaraLetsApp();
window.chatManager = chatManager;

document.addEventListener('DOMContentLoaded', () => {
  window.taraletsApp.init();
});
