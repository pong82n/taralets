/**
 * TaraLets - In-App Ride Coordination Messenger
 * Enables direct chat between Driver and Booked Passenger with instant canned replies
 * and procedural Web Audio notification chime.
 */

import { storage } from './storage.js';

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
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch (e) {
      // AudioContext might be blocked before first user gesture
    }
  }

  openChat(bookingId) {
    this.activeBookingId = bookingId;
    const booking = storage.getBookingById(bookingId);
    if (!booking) return;

    const modal = document.getElementById('chat-modal');
    if (!modal) return;

    // Set Header Info
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

    // Auto focus input
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
          <p class="text-xs mt-1">Coordinate exact pickup landmark or arrival notes!</p>
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

    // Scroll to bottom
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
      senderName: senderName,
      text: text.trim()
    });

    this.playChime();
    this.renderMessages();

    const input = document.getElementById('chat-input');
    if (input) input.value = '';

    // Simulate smart auto-reply if sent by driver or passenger
    this.simulateCounterpartReply(activeRole, booking);
  }

  simulateCounterpartReply(activeRole, booking) {
    // Only auto-reply if counterpart is simulated
    setTimeout(() => {
      if (this.activeBookingId !== booking.id) return;
      const isSimulatedCounterpart = true;
      if (!isSimulatedCounterpart) return;

      const counterpartRole = activeRole === 'driver' ? 'passenger' : 'driver';
      const counterpartName = activeRole === 'driver' ? booking.passengerName : booking.driverName;

      const cannedRepliesDriver = [
        `Copy that! Driving now along the corridor, ETA 5 minutes. Watch out for hazard lights.`,
        `Got it! I am just 2 blocks away. See you at the pickup point!`,
        `All set! Thanks for letting me know. See you shortly co-worker!`
      ];

      const cannedRepliesPassenger = [
        `Understood, I am already waiting at the curb with my company ID ready!`,
        `Thanks for the update! I can see your vehicle approaching now.`,
        `Noted! See you in a minute. Thank you so much for booking me in your ride!`
      ];

      const replies = counterpartRole === 'driver' ? cannedRepliesDriver : cannedRepliesPassenger;
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

export const chatManager = new RideChatManager();
