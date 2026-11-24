// CoLife v4.0 – 3-Modi-Grafikbühne (Außen, Puppenhaus-Innen, Lausitz-Karte), Charakter-Porträts, Minispiel & Konfetti

let state = migrateStateIfNeeded(CoLifeSync.loadLocal() || createInitialState());

const CoLifeAudio = {
  ctx: null,
  muted: localStorage.getItem("colife_muted") === "1",

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("colife_muted", this.muted ? "1" : "0");
    return this.muted;
  },

  play(type = "pop") {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const tone = (freq, start, dur, wave = "sine", vol = 0.08) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(vol, now + start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur);
      };

      if (type === "cash") {
        tone(587.33, 0, 0.11, "triangle", 0.1);
        tone(880, 0.09, 0.22, "triangle", 0.12);
      } else if (type === "good") {
        tone(440, 0, 0.12, "sine", 0.08);
        tone(554.37, 0.08, 0.18, "sine", 0.09);
      } else if (type === "fanfare") {
        tone(523.25, 0, 0.11, "triangle", 0.1);
        tone(659.25, 0.1, 0.11, "triangle", 0.1);
        tone(783.99, 0.2, 0.14, "triangle", 0.11);
        tone(1046.5, 0.32, 0.28, "triangle", 0.12);
      } else {
        tone(480, 0, 0.08, "sine", 0.07);
      }
    } catch (e) {}
  }
};

const els = {
  dayBadge: document.getElementById("day-badge"),
  weatherBadge: document.getElementById("weather-badge"),
  soundBtn: document.getElementById("sound-btn"),
  syncPill: document.getElementById("sync-pill"),
  stageModeBtns: document.querySelectorAll(".stage-mode-btn"),
  diorama: document.getElementById("diorama-container"),
  moneyVal: document.getElementById("money-val"),
  houseVal: document.getElementById("house-val"),
  harmonyVal: document.getElementById("harmony-val"),
  fridgeVal: document.getElementById("fridge-val"),
  fuelpriceVal: document.getElementById("fuelprice-val"),
  upgradeCount: document.getElementById("upgrade-count"),

  fridgeNoteBar: document.getElementById("fridge-note-bar"),
  fridgeNoteText: document.getElementById("fridge-note-text"),
  editNoteBtn: document.getElementById("edit-note-btn"),
  comboBanner: document.getElementById("combo-banner"),
  weekStrip: document.getElementById("week-strip"),

  navTabs: document.querySelectorAll(".nav-tab"),
  views: {
    play: document.getElementById("view-play"),
    house: document.getElementById("view-house"),
    band: document.getElementById("view-band"),
    multi: document.getElementById("view-multi")
  },

  tabLena: document.getElementById("tab-lena"),
  tabTom: document.getElementById("tab-tom"),
  lenaDoneDot: document.getElementById("lena-done-dot"),
  tomDoneDot: document.getElementById("tom-done-dot"),
  lenaShiftTag: document.getElementById("lena-shift-tag"),
  tomShiftTag: document.getElementById("tom-shift-tag"),

  playerAvatarBox: document.getElementById("player-avatar-box"),
  playerName: document.getElementById("player-name"),
  playerJob: document.getElementById("player-job"),
  playerShiftBadge: document.getElementById("player-shift-badge"),
  playerVacation: document.getElementById("player-vacation"),
  energyText: document.getElementById("energy-text"),
  energyBar: document.getElementById("energy-bar"),
  moodText: document.getElementById("mood-text"),
  moodBar: document.getElementById("mood-bar"),
  fuelText: document.getElementById("fuel-text"),
  fuelBar: document.getElementById("fuel-bar"),
  xpText: document.getElementById("xp-text"),
  xpBar: document.getElementById("xp-bar"),

  phaseTitle: document.getElementById("phase-title"),
  phaseStatus: document.getElementById("phase-status"),
  pdots: [
    document.getElementById("pdot-0"),
    document.getElementById("pdot-1"),
    document.getElementById("pdot-2")
  ],
  actionsGrid: document.getElementById("actions-grid"),
  questsList: document.getElementById("quests-list"),
  shareTurnBtn: document.getElementById("share-turn-btn"),
  nextDayBtn: document.getElementById("next-day-btn"),
  eventLog: document.getElementById("event-log"),

  loanVal: document.getElementById("loan-val"),
  payLoan500: document.getElementById("pay-loan-500"),
  payLoan1500: document.getElementById("pay-loan-1500"),
  upgradesList: document.getElementById("upgrades-list"),
  specialsList: document.getElementById("specials-list"),
  achievementsList: document.getElementById("achievements-list"),

  bandCodeBadge: document.getElementById("band-code-badge"),
  bandList: document.getElementById("band-list"),
  newFriendName: document.getElementById("new-friend-name"),
  newFriendRole: document.getElementById("new-friend-role"),
  addFriendBtn: document.getElementById("add-friend-btn"),

  householdCodeInput: document.getElementById("household-code-input"),
  bandCodeInput: document.getElementById("band-code-input"),
  connectLiveBtn: document.getElementById("connect-live-btn"),
  shareWhatsappBtn: document.getElementById("share-whatsapp-btn"),
  multiStatusBox: document.getElementById("multi-status-box"),
  cloudUrlInput: document.getElementById("cloud-url-input"),
  saveCloudBtn: document.getElementById("save-cloud-btn"),
  pullCloudBtn: document.getElementById("pull-cloud-btn"),
  triggerDilemmaBtn: document.getElementById("trigger-dilemma-btn"),
  resetGameBtn: document.getElementById("reset-game-btn"),

  dilemmaModal: document.getElementById("dilemma-modal"),
  dilemmaTitle: document.getElementById("dilemma-title"),
  dilemmaText: document.getElementById("dilemma-text"),
  dilemmaChoices: document.getElementById("dilemma-choices"),

  minigameModal: document.getElementById("minigame-modal"),
  mgTitle: document.getElementById("mg-title"),
  mgDesc: document.getElementById("mg-desc"),
  mgCursor: document.getElementById("mg-cursor"),
  mgStopBtn: document.getElementById("mg-stop-btn"),

  reportModal: document.getElementById("report-modal"),
  reportBody: document.getElementById("report-body"),
  reportCloseBtn: document.getElementById("report-close-btn"),

  toastBox: document.getElementById("toast-box")
};

let toastTimer = null;
function showToast(msg) {
  els.toastBox.textContent = msg;
  els.toastBox.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toastBox.classList.add("hidden");
  }, 3400);
}

function haptic(ms = 18) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(ms);
    } catch (e) {}
  }
}

function spawnFloatingFX(text, sourceEl) {
  if (!text) return;
  const fx = document.createElement("div");
  fx.className = "float-fx";
  fx.textContent = text;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  if (sourceEl && sourceEl.getBoundingClientRect) {
    const rect = sourceEl.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + 8;
  }

  fx.style.left = `${x}px`;
  fx.style.top = `${y}px`;
  document.body.appendChild(fx);
  setTimeout(() => fx.remove(), 950);
}

function spawnConfetti() {
  const colors = ["#fde047", "#38bdf8", "#4ade80", "#f472b6", "#fb923c"];
  for (let i = 0; i < 22; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    c.style.left = `${15 + Math.random() * 70}vw`;
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = `${Math.random() * 0.25}s`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1400);
  }
}

// Animiertes SVG-Porträt für Lena & Tom (reagiert auf Laune, Energie & Beruf)
function buildCharacterAvatarSVG(player) {
  const isLena = player.id === "lena";
  const hairCol = isLena ? "#b45309" : "#1e293b";
  const shirtCol = isLena ? "#38bdf8" : "#16a34a";
  const tired = player.energy < 40;
  const happy = player.mood >= 75;

  const mouth = happy
    ? `<path d="M 21 34 Q 26 39 31 34" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : tired
    ? `<circle cx="26" cy="35" r="2.2" fill="#0f172a"/>`
    : `<line x1="22" y1="35" x2="30" y2="35" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>`;

  return `
  <svg viewBox="0 0 52 52" width="48" height="48" class="avatar-svg">
    <circle cx="26" cy="26" r="24" fill="${isLena ? "#1e3a8a" : "#14532d"}" stroke="#3b82f6" stroke-width="1.5"/>
    <!-- Schultern / Kleidung -->
    <path d="M 10 48 Q 26 38 42 48" fill="${shirtCol}" />
    <!-- Kopf -->
    <circle cx="26" cy="26" r="12" fill="#fde68a" />
    <!-- Haare / Helm -->
    ${
      isLena
        ? `<path d="M 14 25 Q 14 11 26 12 Q 38 11 38 25 Q 34 17 26 17 Q 18 17 14 25" fill="${hairCol}"/>`
        : `<path d="M 14 22 Q 26 10 38 22 Z" fill="${hairCol}"/>`
    }
    <!-- Augen -->
    ${
      tired
        ? `<line x1="20" y1="26" x2="23" y2="26" stroke="#0f172a" stroke-width="2"/>
           <line x1="29" y1="26" x2="32" y2="26" stroke="#0f172a" stroke-width="2"/>`
        : `<circle cx="21.5" cy="26" r="1.7" fill="#0f172a"/>
           <circle cx="30.5" cy="26" r="1.7" fill="#0f172a"/>`
    }
    <!-- Schutzbrille (Lena) / Headset (Tom) -->
    ${
      isLena
        ? `<rect x="18" y="23" width="7" height="5" rx="1.5" fill="none" stroke="#38bdf8" stroke-width="1.2"/>
           <rect x="27" y="23" width="7" height="5" rx="1.5" fill="none" stroke="#38bdf8" stroke-width="1.2"/>`
        : `<path d="M 14 26 Q 13 33 20 34" stroke="#475569" stroke-width="1.8" fill="none"/>`
    }
    ${mouth}
  </svg>`;
}

// MODUS 1: AUSSENANSICHT (Grundstück, Figuren, fahrendes Auto, Wetter, Haustiere)
function buildExteriorSVG(s) {
  const player = s.players[s.activePlayerId];
  const phaseIndex = player.doneToday ? 2 : player.phaseIndex;
  const season = SEASONS[s.seasonIndex];
  const isWinter = season === "Winter";
  const isAutumn = season === "Herbst";
  const up = s.household.upgrades;
  const pets = s.household.pets || [];

  let skyTop = "#1e3a8a", skyBot = "#f59e0b";
  if (phaseIndex === 1) {
    skyTop = "#0284c7";
    skyBot = "#7dd3fc";
  } else if (phaseIndex === 2) {
    skyTop = "#070b16";
    skyBot = "#1e1b4b";
  }

  let groundCol = "#15803d";
  let hillCol = "#166534";
  if (isWinter) {
    groundCol = "#e2e8f0";
    hillCol = "#cbd5e1";
  } else if (isAutumn) {
    groundCol = "#9a3412";
    hillCol = "#7c2d12";
  }

  const winGlow = phaseIndex === 2 ? "#fde047" : "#bae6fd";
  const hasPV = up.includes("pv");
  const hasFireplace = up.includes("fireplace");
  const hasTerrace = up.includes("terrace");
  const hasWorkshop = up.includes("workshop");
  const hasGarden = up.includes("garden");
  const hasKitchen = up.includes("kitchen");
  const hasDog = pets.includes("dog_balu");
  const hasCat = pets.includes("cat_mimi");

  let weatherOverlay = "";
  if (s.weatherType === "rain" || s.weatherType === "storm") {
    weatherOverlay = `
      <g class="anim-rain" stroke="#93c5fd" stroke-width="1.6" opacity="0.65">
        <line x1="70" y1="10" x2="55" y2="55" /><line x1="150" y1="20" x2="135" y2="65" />
        <line x1="240" y1="5" x2="225" y2="50" /><line x1="330" y1="25" x2="315" y2="70" />
        <line x1="430" y1="14" x2="415" y2="58" /><line x1="530" y1="18" x2="515" y2="62" />
        <line x1="110" y1="75" x2="95" y2="120" /><line x1="290" y1="80" x2="275" y2="125" />
      </g>`;
  } else if (s.weatherType === "snow" || isWinter) {
    weatherOverlay = `
      <g class="anim-snow" fill="#ffffff" opacity="0.85">
        <circle cx="80" cy="28" r="2.5"/><circle cx="170" cy="45" r="2"/>
        <circle cx="260" cy="20" r="3"/><circle cx="370" cy="38" r="2.2"/>
        <circle cx="460" cy="26" r="2.5"/><circle cx="550" cy="48" r="2"/>
        <circle cx="130" cy="82" r="2.2"/><circle cx="310" cy="75" r="2.6"/>
      </g>`;
  }

  return `
  <svg viewBox="0 0 640 176" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skyTop}" />
        <stop offset="100%" stop-color="${skyBot}" />
      </linearGradient>
    </defs>

    <rect width="640" height="176" fill="url(#skyGrad)" />

    ${
      phaseIndex === 2
        ? `<circle cx="545" cy="34" r="14" fill="#fef08a" opacity="0.95" />
           <g class="anim-stars" fill="#fff">
             <circle cx="95" cy="24" r="1.5" /><circle cx="210" cy="18" r="1.3" />
             <circle cx="380" cy="22" r="1.6" /><circle cx="470" cy="16" r="1.3" />
           </g>`
        : `<circle class="anim-sun" cx="${phaseIndex === 0 ? 110 : 510}" cy="36" r="18" fill="#fde047" opacity="0.92" />`
    }

    <g class="anim-cloud" fill="#ffffff" opacity="${phaseIndex === 2 ? "0.14" : "0.35"}">
      <ellipse cx="180" cy="34" rx="26" ry="9" />
      <ellipse cx="195" cy="31" rx="18" ry="11" />
      <ellipse cx="420" cy="26" rx="22" ry="7" />
    </g>

    <!-- BASF Schwarzheide am Horizont links -->
    <g class="diorama-hotspot" data-inspect="🧪 BASF Schwarzheide: Lenas Labor (${s.players.lena.job})" opacity="0.52" fill="#0f172a">
      <rect x="20" y="92" width="20" height="38" />
      <rect x="44" y="76" width="9" height="54" />
      <rect x="57" y="84" width="16" height="46" />
      <circle class="anim-smoke-1" cx="48" cy="68" r="5" fill="#e2e8f0" opacity="0.7" />
      <circle class="anim-smoke-2" cx="52" cy="56" r="7" fill="#cbd5e1" opacity="0.45" />
    </g>

    <!-- Fliegerhorst & animierter Hubschrauber rechts -->
    <g class="diorama-hotspot" data-inspect="🚁 Bundeswehr-Fliegerhorst: Toms Stützpunkt (${s.players.tom.job})" opacity="0.55" fill="#0f172a">
      <rect x="580" y="88" width="10" height="42" />
      <polygon points="573,88 597,88 593,77 577,77" />
      <g class="anim-heli">
        <ellipse cx="515" cy="48" rx="12" ry="5" fill="#0f172a" />
        <line x1="497" y1="48" x2="506" y2="48" stroke="#0f172a" stroke-width="2.5" />
        <line x1="501" y1="41" x2="529" y2="41" stroke="#e2e8f0" stroke-width="1.6" />
      </g>
    </g>

    <!-- Hügel, Grundstück & Straße -->
    <ellipse cx="320" cy="144" rx="370" ry="36" fill="${hillCol}" />
    <rect x="0" y="130" width="640" height="32" fill="${groundCol}" />
    <rect x="0" y="160" width="640" height="16" fill="#1e293b" />
    <line x1="0" y1="168" x2="640" y2="168" stroke="#94a3b8" stroke-dasharray="14 12" stroke-width="1.4" />

    <!-- Garten & Gewächshaus -->
    ${
      hasGarden
        ? `<g class="diorama-hotspot" data-inspect="🌿 Garten-Oase & Gewächshaus: Liefert alle 2 Tage frisches Gemüse!">
             <rect x="82" y="100" width="46" height="32" rx="4" fill="rgba(134, 239, 172, 0.38)" stroke="#bbf7d0" stroke-width="1.5" />
             <polygon points="80,100 105,84 130,100" fill="rgba(134, 239, 172, 0.48)" stroke="#bbf7d0" stroke-width="1.5" />
             <circle cx="95" cy="120" r="6" fill="#22c55e" />
             <circle cx="112" cy="118" r="7" fill="#16a34a" />
           </g>`
        : ""
    }

    <!-- Carport / Schrauber-Garage -->
    <g class="diorama-hotspot" data-inspect="🚗 Carport & Autos · Lena: ${s.players.lena.fuel}% Tank | Tom: ${s.players.tom.fuel}% Tank">
      <rect x="146" y="92" width="86" height="40" fill="${hasWorkshop ? "#334155" : "#1e293b"}" stroke="#475569" stroke-width="1.5" />
      <rect x="142" y="87" width="94" height="6" fill="#64748b" />
      ${
        hasWorkshop
          ? `<rect x="153" y="98" width="22" height="14" fill="#fde047" opacity="0.88" />
             <text x="195" y="106" fill="#38bdf8" font-size="8" font-weight="bold">🔧 GARAGE</text>`
          : ""
      }
      <!-- Lenas Auto -->
      <rect x="154" y="119" width="28" height="11" rx="3" fill="#ef4444" />
      <circle cx="160" cy="131" r="3" fill="#0f172a" /><circle cx="176" cy="131" r="3" fill="#0f172a" />
      <!-- Toms Auto -->
      <rect x="195" y="118" width="30" height="12" rx="3" fill="#3b82f6" />
      <circle cx="201" cy="131" r="3" fill="#0f172a" /><circle cx="219" cy="131" r="3" fill="#0f172a" />
    </g>

    <!-- Haupthaus (Tipp darauf wechselt auf Wunsch oder zeigt Status) -->
    <g class="diorama-hotspot" data-inspect="🏡 Eigenheim · Tipp oben auf „🛋️ Innen“, um in die Zimmer zu schauen!">
      <rect x="372" y="40" width="14" height="28" fill="#7c2d12" />
      ${
        hasFireplace || isWinter
          ? `<circle class="anim-smoke-1" cx="380" cy="30" r="5" fill="#e2e8f0" opacity="0.75" />
             <circle class="anim-smoke-2" cx="386" cy="18" r="7.5" fill="#cbd5e1" opacity="0.55" />`
          : ""
      }
      <rect x="232" y="74" width="176" height="58" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      <polygon points="220,74 320,32 420,74" fill="${isWinter ? "#f1f5f9" : "#b91c1c"}" stroke="#7f1d1d" stroke-width="1.5" />
      ${
        hasPV
          ? `<polygon points="258,66 316,41 374,66" fill="#0284c7" stroke="#bae6fd" stroke-width="1.2" opacity="0.95" />`
          : ""
      }
      <rect x="308" y="100" width="24" height="32" rx="2" fill="#78350f" />
      <circle cx="327" cy="116" r="1.8" fill="#fbbf24" />
      <rect x="250" y="90" width="40" height="24" rx="2" fill="${hasKitchen ? "#fef08a" : winGlow}" stroke="#475569" stroke-width="1.5" />
      <rect x="350" y="90" width="42" height="24" rx="2" fill="${hasFireplace ? "#fb923c" : winGlow}" stroke="#475569" stroke-width="1.5" />
      ${hasCat ? `<text x="364" y="109" font-size="13">🐈</text>` : ""}
    </g>

    <!-- Figuren Lena & Tom vor dem Haus -->
    <g class="diorama-hotspot anim-dog" data-inspect="👫 Lena & Tom vor eurem Eigenheim (Harmonie: ${s.household.harmony}%)">
      <!-- Lena Figur -->
      <circle cx="292" cy="136" r="4.5" fill="#fde68a" />
      <rect x="288" y="141" width="8" height="11" rx="2" fill="#38bdf8" />
      <!-- Tom Figur -->
      <circle cx="346" cy="136" r="4.5" fill="#fde68a" />
      <rect x="342" y="141" width="8" height="11" rx="2" fill="#22c55e" />
    </g>

    ${
      hasDog
        ? `<g class="diorama-hotspot anim-dog" data-inspect="🐕 Hofhund Balu bewacht den Garten!">
             <text x="262" y="152" font-size="16">🐕</text>
           </g>`
        : ""
    }

    <!-- Holzterrasse & Grillplatz -->
    ${
      hasTerrace
        ? `<g class="diorama-hotspot" data-inspect="🪵 Holzterrasse & Kugelgrill: Perfekt für Bande-Abende!">
             <rect x="408" y="124" width="92" height="8" rx="2" fill="#92400e" stroke="#78350f" />
             <line x1="414" y1="88" x2="414" y2="124" stroke="#78350f" stroke-width="3" />
             <line x1="490" y1="88" x2="490" y2="124" stroke="#78350f" stroke-width="3" />
             <line x1="410" y1="88" x2="496" y2="88" stroke="#78350f" stroke-width="3" />
             <circle class="anim-stars" cx="428" cy="92" r="2.5" fill="#fde047" />
             <circle class="anim-stars" cx="450" cy="92" r="2.5" fill="#fde047" />
             <circle class="anim-stars" cx="472" cy="92" r="2.5" fill="#fde047" />
             <circle cx="468" cy="113" r="7" fill="#1e293b" />
             <circle class="anim-smoke-1" cx="468" cy="103" r="3.5" fill="#f97316" opacity="0.85" />
           </g>`
        : ""
    }

    ${weatherOverlay}
  </svg>`;
}

// MODUS 2: PUPPENHAUS-INNENANSICHT (Querschnitt durch Küche, Wohnzimmer & Hauswirtschaft/Technik)
function buildInteriorSVG(s) {
  const up = s.household.upgrades;
  const hasKitchen = up.includes("kitchen");
  const hasFireplace = up.includes("fireplace");
  const hasPV = up.includes("pv");
  const hasWorkshop = up.includes("workshop");
  const hasCat = (s.household.pets || []).includes("cat_mimi");
  const hasDog = (s.household.pets || []).includes("dog_balu");
  const messy = s.household.houseCondition < 65;

  return `
  <svg viewBox="0 0 640 176" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <!-- Hintergrund & Dachrahmen -->
    <rect width="640" height="176" fill="#0f172a" />
    <polygon points="16,18 320,2 624,18" fill="#7f1d1d" stroke="#b91c1c" stroke-width="2" />

    <!-- ZIMMER 1: KÜCHE (Links, x=20..215) -->
    <g class="diorama-hotspot" data-inspect="🍳 Küche · Kühlschrank: ${s.household.fridge} Portionen | ${hasKitchen ? "Moderne Einbauküche" : "Standard-Küche"}">
      <rect x="20" y="20" width="195" height="142" fill="${hasKitchen ? "#1e293b" : "#1e2638"}" stroke="#475569" stroke-width="2" />
      <text x="30" y="36" fill="#93c5fd" font-size="10" font-weight="bold">🍳 KÜCHE & VORRÄTE</text>

      <!-- Kühlschrank mit sichtbaren Vorräten -->
      <rect x="32" y="48" width="44" height="82" rx="4" fill="#e2e8f0" stroke="#64748b" stroke-width="2" />
      <line x1="32" y1="86" x2="76" y2="86" stroke="#94a3b8" stroke-width="1.5" />
      <!-- Gelbe Kühlschrank-Notiz -->
      <rect x="46" y="56" width="14" height="12" fill="#fde047" />
      <text x="38" y="108" font-size="11" fill="#0f172a" font-weight="bold">🧊 ${s.household.fridge}x</text>

      <!-- Küchenzeile & Herd mit dampfendem Topf -->
      <rect x="88" y="88" width="112" height="42" rx="3" fill="${hasKitchen ? "#0284c7" : "#475569"}" />
      <rect x="88" y="84" width="112" height="5" fill="#f8fafc" />
      <!-- Kochtopf -->
      <rect x="112" y="74" width="22" height="10" rx="2" fill="#ef4444" />
      <circle class="anim-smoke-1" cx="123" cy="66" r="4" fill="#e2e8f0" opacity="0.65" />
      ${hasKitchen ? `<text x="155" y="80" font-size="14">☕</text>` : ""}
    </g>

    <!-- ZIMMER 2: WOHNZIMMER (Mitte, x=220..445) -->
    <g class="diorama-hotspot" data-inspect="🛋️ Wohnzimmer · Harmonie: ${s.household.harmony}% | Ordnung: ${s.household.houseCondition}%">
      <rect x="220" y="20" width="225" height="142" fill="#272036" stroke="#475569" stroke-width="2" />
      <text x="232" y="36" fill="#fde047" font-size="10" font-weight="bold">🛋️ WOHNZIMMER & PAAR-ZEIT</text>

      <!-- Fenster in den Garten -->
      <rect x="255" y="46" width="64" height="36" rx="3" fill="#0284c7" stroke="#64748b" stroke-width="2" />

      <!-- Gemütliches Sofa -->
      <rect x="242" y="102" width="96" height="26" rx="6" fill="#be123c" />
      <rect x="236" y="110" width="12" height="20" rx="4" fill="#9f1239" />
      <rect x="332" y="110" width="12" height="20" rx="4" fill="#9f1239" />

      <!-- Lena & Tom im Wohnzimmer -->
      <text x="256" y="100" font-size="16">👩🏻‍🔬</text>
      <text x="292" y="100" font-size="16">👨🏽‍🔧</text>
      ${hasCat ? `<text x="316" y="118" font-size="14">🐈</text>` : ""}
      ${hasDog ? `<text x="245" y="148" font-size="15" class="anim-dog">🐕</text>` : ""}

      <!-- Kaminofen (falls gebaut) -->
      ${
        hasFireplace
          ? `<rect x="382" y="72" width="42" height="58" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
             <rect x="390" y="92" width="26" height="24" rx="3" fill="#451a03" />
             <circle class="anim-smoke-1" cx="403" cy="105" r="7" fill="#f97316" />
             <circle class="anim-stars" cx="403" cy="107" r="4" fill="#fde047" />`
          : `<rect x="382" y="95" width="42" height="35" rx="3" fill="#334155" />
             <text x="388" y="116" fill="#94a3b8" font-size="8">TV / Regal</text>`
      }

      <!-- Unordnung-Indikator falls Haus-Zustand < 65% -->
      ${
        messy
          ? `<text x="348" y="148" font-size="13">🧺🧦</text>`
          : `<text x="355" y="148" font-size="11" fill="#4ade80">✨ Sauber</text>`
      }
    </g>

    <!-- ZIMMER 3: HAUSWIRTSCHAFT & TECHNIK (Rechts, x=450..620) -->
    <g class="diorama-hotspot" data-inspect="🧺 Hauswirtschaft & Technik · ${hasPV ? "PV-Anlage spart 14 €/Tag" : "Bereit für PV & Werkstatt"}">
      <rect x="450" y="20" width="170" height="142" fill="#17253b" stroke="#475569" stroke-width="2" />
      <text x="462" y="36" fill="#38bdf8" font-size="10" font-weight="bold">🧺 HAUSHALT & TECHNIK</text>

      <!-- Waschmaschine mit drehender Trommel -->
      <rect x="468" y="82" width="46" height="50" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
      <circle cx="491" cy="109" r="14" fill="#38bdf8" stroke="#334155" stroke-width="2" />
      <path class="anim-cloud" d="M 481 109 Q 491 102 501 109" stroke="#fff" stroke-width="2" fill="none" />

      <!-- PV-Wechselrichter & Werkzeugwand -->
      <rect x="532" y="54" width="68" height="40" rx="4" fill="${hasPV ? "#065f46" : "#1e293b"}" stroke="#475569" />
      <text x="540" y="72" fill="#fff" font-size="9" font-weight="bold">${hasPV ? "☀️ PV AKTIV" : "⚡ STROM"}</text>
      <text x="540" y="85" fill="#86efac" font-size="8">${hasPV ? "-14 € / Tag" : "Standard"}</text>

      ${
        hasWorkshop
          ? `<text x="538" y="122" font-size="16">🔧🧰⚙️</text>`
          : `<text x="538" y="122" fill="#64748b" font-size="9">Kein Werkzeug</text>`
      }
    </g>
  </svg>`;
}

// MODUS 3: INTERAKTIVE LAUSITZ-REGIONSKARTE mit Live-Spieler-Pins
function buildMapSVG(s) {
  const coords = {
    basf: { x: 105, y: 54 },
    airbase: { x: 525, y: 52 },
    home: { x: 320, y: 92 },
    town: { x: 155, y: 138 },
    lake: { x: 500, y: 138 }
  };

  const lPos = coords[s.players.lena.location] || coords.home;
  const tPos = coords[s.players.tom.location] || coords.home;

  return `
  <svg viewBox="0 0 640 176" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <!-- Karten-Hintergrund -->
    <rect width="640" height="176" fill="#122620" />
    <!-- Senftenberger See Rechts Unten -->
    <ellipse cx="520" cy="144" rx="85" ry="26" fill="#0284c7" opacity="0.75" />

    <!-- Verbindungs-Straßennetz -->
    <g stroke="#334155" stroke-width="6" fill="none" stroke-linecap="round">
      <path d="M 105 54 Q 210 70 320 92" />
      <path d="M 320 92 Q 420 70 525 52" />
      <path d="M 320 92 L 155 138" />
      <path d="M 320 92 L 500 138" />
    </g>
    <g stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="6 6" fill="none">
      <path d="M 105 54 Q 210 70 320 92" />
      <path d="M 320 92 Q 420 70 525 52" />
      <path d="M 320 92 L 155 138" />
      <path d="M 320 92 L 500 138" />
    </g>

    <!-- ORT 1: BASF Schwarzheide -->
    <g class="diorama-hotspot" data-inspect="🧪 BASF Schwarzheide · Lenas Werk (${s.players.lena.job})">
      <circle cx="105" cy="54" r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
      <text x="72" y="88" fill="#bae6fd" font-size="9.5" font-weight="bold">🧪 BASF Schwarzheide</text>
      <text x="97" y="59" font-size="14">🏭</text>
    </g>

    <!-- ORT 2: Bundeswehr-Fliegerhorst -->
    <g class="diorama-hotspot" data-inspect="🚁 Fliegerhorst · Toms Hubschrauber-Werft (${s.players.tom.job})">
      <circle cx="525" cy="52" r="22" fill="#1e293b" stroke="#4ade80" stroke-width="2" />
      <text x="485" y="86" fill="#bbf7d0" font-size="9.5" font-weight="bold">🚁 Fliegerhorst</text>
      <text x="517" y="57" font-size="14">🚁</text>
    </g>

    <!-- ORT 3: Euer Eigenheim (Zentrum) -->
    <g class="diorama-hotspot" data-inspect="🏡 Euer Eigenheim · Das Herzstück eures Alltags!">
      <circle cx="320" cy="92" r="25" fill="#1e3a8a" stroke="#fde047" stroke-width="2.5" />
      <text x="282" y="129" fill="#fef08a" font-size="10" font-weight="bold">🏡 Euer Eigenheim</text>
      <text x="311" y="98" font-size="16">🏡</text>
    </g>

    <!-- ORT 4: Tankstelle & Supermarkt -->
    <g class="diorama-hotspot" data-inspect="⛽ Freie Tankstelle (${s.fuelPrice.toFixed(2).replace(".", ",")} €/L) & 🛒 Supermarkt">
      <circle cx="155" cy="138" r="19" fill="#1e293b" stroke="#c084fc" stroke-width="2" />
      <text x="105" y="168" fill="#e9d5ff" font-size="9" font-weight="bold">⛽ Tanken & 🛒 Markt</text>
      <text x="147" y="143" font-size="13">⛽</text>
    </g>

    <!-- ORT 5: Senftenberger See & Open-Air -->
    <g class="diorama-hotspot" data-inspect="🌊 Senftenberger See · Konzerte, Ausflüge & Gassi-Runden">
      <circle cx="500" cy="138" r="19" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
      <text x="452" y="168" fill="#bae6fd" font-size="9" font-weight="bold">🌊 See & Konzerte</text>
      <text x="492" y="143" font-size="13">🎸</text>
    </g>

    <!-- ANIMIERTE LIVE-SPIELER-PINS AUF DER KARTE -->
    <g class="anim-dog" transform="translate(${lPos.x - 24}, ${lPos.y - 34})">
      <rect x="0" y="0" width="44" height="16" rx="8" fill="#ef4444" stroke="#fff" stroke-width="1.2" />
      <text x="6" y="11" fill="#fff" font-size="8.5" font-weight="bold">🧪 Lena</text>
    </g>
    <g class="anim-dog" transform="translate(${tPos.x - 14}, ${tPos.y - 16})">
      <rect x="0" y="0" width="44" height="16" rx="8" fill="#3b82f6" stroke="#fff" stroke-width="1.2" />
      <text x="6" y="11" fill="#fff" font-size="8.5" font-weight="bold">🚁 Tom</text>
    </g>
  </svg>`;
}

function buildDioramaSVG(s) {
  if (s.stageMode === "interior") return buildInteriorSVG(s);
  if (s.stageMode === "map") return buildMapSVG(s);
  return buildExteriorSVG(s);
}

function bindDioramaHotspots() {
  els.diorama.querySelectorAll(".diorama-hotspot").forEach((node) => {
    node.addEventListener("click", () => {
      const info = node.getAttribute("data-inspect");
      if (info) {
        CoLifeAudio.play("pop");
        haptic(12);
        showToast(info);
      }
    });
  });
}

// 7-Tage-Wochenplaner-Leiste rendern
function renderWeekStrip(s) {
  if (!els.weekStrip) return;
  const todayIdx = (s.day - 1) % 7;
  const shortDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const icon = (c) => (c === "early" ? "🌅" : c === "late" ? "🌇" : "🎉");

  els.weekStrip.innerHTML = shortDays
    .map((d, idx) => {
      const lS = WEEKLY_SHIFTS.lena[idx];
      const tS = WEEKLY_SHIFTS.tom[idx];
      return `
      <div class="wday-pill ${idx === todayIdx ? "active" : ""}">
        <strong>${d}</strong>
        <span>🧪${icon(lS)}</span>
        <span>🚁${icon(tS)}</span>
      </div>`;
    })
    .join("");
}

// Interaktives Timing-Minispiel für Fokus-Schichten
let mgAnimId = null;
let mgPos = 50;
let mgDir = 1;
let mgCallback = null;

function openShiftMinigame(player, onDone) {
  mgCallback = onDone;
  mgPos = 10;
  mgDir = 1;

  els.mgTitle.textContent =
    player.id === "lena"
      ? "🔬 BASF-Labor: Präzisions-Titration"
      : "⚙️ Fliegerhorst: Rotor-Drehmoment";
  els.mgDesc.textContent =
    "Stoppe den Regler im grünen/goldenen Bereich in der Mitte für die volle Meister-Prämie!";
  els.minigameModal.classList.remove("hidden");

  function step() {
    mgPos += mgDir * 2.4;
    if (mgPos >= 96) {
      mgPos = 96;
      mgDir = -1;
    } else if (mgPos <= 4) {
      mgPos = 4;
      mgDir = 1;
    }
    els.mgCursor.style.left = `${mgPos}%`;
    mgAnimId = requestAnimationFrame(step);
  }
  mgAnimId = requestAnimationFrame(step);
}

if (els.mgStopBtn) {
  els.mgStopBtn.addEventListener("click", () => {
    cancelAnimationFrame(mgAnimId);
    els.minigameModal.classList.add("hidden");
    const dist = Math.abs(mgPos - 50);
    let mult = 0.5;
    if (dist <= 12) {
      mult = 1.3;
      spawnConfetti();
      CoLifeAudio.play("fanfare");
      showToast("🎯 Volltreffer! Goldener Meister-Bonus!");
    } else if (dist <= 25) {
      mult = 1.0;
      CoLifeAudio.play("cash");
      showToast("✅ Sauber getroffen! Voller Bonus!");
    } else {
      CoLifeAudio.play("pop");
      showToast("👍 Solide Schicht abgeliefert!");
    }
    if (mgCallback) mgCallback(mult);
  });
}

function render() {
  state = migrateStateIfNeeded(state);
  const season = SEASONS[state.seasonIndex];
  const weekday = WEEKDAYS[(state.day - 1) % 7];
  const player = state.players[state.activePlayerId];
  const maxFridge = state.household.upgrades.includes("kitchen") ? 8 : 6;

  // 1. Topbar & Diorama
  els.dayBadge.textContent = `Tag ${state.day} · ${weekday.slice(0, 2)} · ${season}`;
  els.weatherBadge.textContent = state.weather;
  if (els.soundBtn) {
    els.soundBtn.textContent = CoLifeAudio.muted ? "🔇" : "🔊";
  }
  els.stageModeBtns.forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-stage") === state.stageMode);
  });
  els.diorama.innerHTML = buildDioramaSVG(state);
  bindDioramaHotspots();

  // 2. HUD
  els.moneyVal.textContent = `${state.household.money.toLocaleString("de-DE")} €`;
  els.houseVal.textContent = `${state.household.houseCondition} %`;
  els.harmonyVal.textContent = `${state.household.harmony} %`;
  els.fridgeVal.textContent = `${state.household.fridge} / ${maxFridge}`;
  els.fuelpriceVal.textContent = `${state.fuelPrice.toFixed(2).replace(".", ",")} €/L`;
  els.upgradeCount.textContent = `${state.household.upgrades.length}/${HOUSE_UPGRADES.length}`;

  if (els.fridgeNoteText) {
    els.fridgeNoteText.textContent = state.fridgeNote || "📌 Kühlschrank-Notiz für deinen Partner…";
  }

  // Teamwork-Kombo-Banner
  if (els.comboBanner) {
    if (state.lastComboBanner) {
      els.comboBanner.textContent = state.lastComboBanner;
      els.comboBanner.classList.remove("hidden");
    } else {
      els.comboBanner.classList.add("hidden");
    }
  }

  // 7-Tage-Schichtplaner
  renderWeekStrip(state);

  // 3. Spieler-Tabs
  els.tabLena.classList.toggle("active", state.activePlayerId === "lena");
  els.tabTom.classList.toggle("active", state.activePlayerId === "tom");
  els.lenaDoneDot.classList.toggle("done", state.players.lena.doneToday);
  els.tomDoneDot.classList.toggle("done", state.players.tom.doneToday);

  const lenaShift = getShiftForPlayer(state, "lena");
  const tomShift = getShiftForPlayer(state, "tom");
  els.lenaShiftTag.textContent = state.players.lena.doneToday
    ? "✅ Tag fertig"
    : `${PHASES[state.players.lena.phaseIndex]} · ${getShiftLabel(lenaShift)}`;
  els.tomShiftTag.textContent = state.players.tom.doneToday
    ? "✅ Tag fertig"
    : `${PHASES[state.players.tom.phaseIndex]} · ${getShiftLabel(tomShift)}`;

  // 4. Aktiver Spieler Details + Animiertes Charakter-Porträt
  const career = getCareerInfo(player.id, player.xp);
  const myShift = getShiftForPlayer(state, player.id);
  if (els.playerAvatarBox) {
    els.playerAvatarBox.innerHTML = buildCharacterAvatarSVG(player);
  }
  els.playerName.textContent = `${player.name} (Lv. ${career.level})`;
  els.playerJob.textContent = `${career.title} · ${career.place} (${career.pay} €/Schicht)`;
  els.playerShiftBadge.textContent = player.workedToday
    ? "✅ Schicht erledigt"
    : player.vacationToday
    ? "🏖️ Heute Urlaub"
    : getShiftLabel(myShift);
  els.playerVacation.textContent = `🏖️ ${player.vacationDays} UT`;

  els.energyText.textContent = `${player.energy} / 100`;
  els.energyBar.style.width = `${player.energy}%`;
  els.moodText.textContent = `${player.mood} / 100`;
  els.moodBar.style.width = `${player.mood}%`;
  els.fuelText.textContent = `${player.fuel} %`;
  els.fuelBar.style.width = `${player.fuel}%`;

  const xpPct = Math.min(100, Math.round((player.xp / career.xpNext) * 100));
  els.xpText.textContent = `Lv. ${career.level} (${player.xp} / ${career.xpNext} XP)`;
  els.xpBar.style.width = `${xpPct}%`;

  // 5. Phasen & Aktionen
  els.pdots.forEach((dot, idx) => {
    dot.classList.toggle("active", !player.doneToday && player.phaseIndex === idx);
    dot.classList.toggle("done", player.doneToday || player.phaseIndex > idx);
  });

  if (player.doneToday) {
    els.phaseTitle.textContent = `✅ ${player.name} hat den Tag abgeschlossen`;
    const otherId = player.id === "lena" ? "tom" : "lena";
    const other = state.players[otherId];
    els.phaseStatus.textContent = other.doneToday
      ? "Beide sind fertig! Klicke unten auf „🌙 Tag abschließen“."
      : `Wechsle jetzt zu ${other.name} oder teile den Zug mit deinem Partner.`;
    els.actionsGrid.innerHTML = "";
  } else {
    const phaseName = PHASES[player.phaseIndex];
    const phaseIcons = ["🌅", "☀️", "🌙"];
    els.phaseTitle.textContent = `${phaseIcons[player.phaseIndex]} Phase ${player.phaseIndex + 1}/3: ${phaseName}`;
    els.phaseStatus.textContent = `Wähle eine Aktion für ${player.name}`;
    const actions = getActionsForPlayer(state, player);
    els.actionsGrid.innerHTML = "";

    actions.forEach((act) => {
      const btn = document.createElement("button");
      btn.className = "action-btn" + (act.highlight ? " highlight" : "");
      btn.disabled = act.disabled;
      btn.innerHTML = `<strong>${act.title}</strong><span>${act.desc}</span>`;
      btn.addEventListener("click", () => {
        haptic(20);
        if (act.isMinigame) {
          openShiftMinigame(player, (mult) => {
            spawnFloatingFX(act.fxText || "★ Bonus!", btn);
            performAction(state, player.id, act.id, mult);
            CoLifeSync.broadcastState(state);
            render();
          });
          return;
        }

        CoLifeAudio.play(act.sound || "pop");
        spawnFloatingFX(act.fxText || "✨", btn);
        const prevCombo = state.lastComboBanner;
        performAction(state, player.id, act.id);
        if (state.lastComboBanner && state.lastComboBanner !== prevCombo) {
          spawnConfetti();
          CoLifeAudio.play("fanfare");
        }

        const otherId = player.id === "lena" ? "tom" : "lena";
        if (player.doneToday && !state.players[otherId].doneToday) {
          showToast(`${player.name} ist fertig für heute! Wechsel zu ${state.players[otherId].name}.`);
        }
        CoLifeSync.broadcastState(state);
        render();
      });
      els.actionsGrid.appendChild(btn);
    });
  }

  // 5b. Wochen-Missionen rendern
  if (els.questsList) {
    els.questsList.innerHTML = "";
    (state.quests || []).forEach((q) => {
      const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
      const ready = q.progress >= q.target && !q.claimed;
      const item = document.createElement("div");
      item.className = "quest-card" + (q.claimed ? " owned" : ready ? " quest-ready" : "");
      item.innerHTML = `
        <div class="phase-header">
          <strong>${q.title}</strong>
          <span class="badge ${q.claimed ? "" : "badge-soft"}">${q.claimed ? "✅ Eingelöst" : `${q.progress} / ${q.target}`}</span>
        </div>
        <p>${q.desc}</p>
        <div class="bar-track"><div class="bar-fill xp" style="width:${pct}%"></div></div>
        <small style="color:#93c5fd;font-weight:600;">🎁 Belohnung: ${q.rewardText}</small>
      `;
      if (ready) {
        const claimBtn = document.createElement("button");
        claimBtn.className = "primary-btn";
        claimBtn.textContent = `🎁 Belohnung abholen (+${q.rewardMoney} €)`;
        claimBtn.addEventListener("click", () => {
          const claimed = claimQuestReward(state, q.id);
          if (claimed) {
            CoLifeAudio.play("fanfare");
            spawnConfetti();
            haptic(40);
            spawnFloatingFX(`+${claimed.rewardMoney} € 🎁`, claimBtn);
            showToast(`Wochen-Ziel eingelöst: ${claimed.rewardText}!`);
            CoLifeSync.broadcastState(state);
            render();
          }
        });
        item.appendChild(claimBtn);
      }
      els.questsList.appendChild(item);
    });
  }

  const bothDone = state.players.lena.doneToday && state.players.tom.doneToday;
  els.nextDayBtn.disabled = !bothDone;

  // 6. Tagesbuch
  els.eventLog.innerHTML = "";
  state.log.slice(0, 18).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    els.eventLog.appendChild(li);
  });

  // 7. View 2: Haus & Ausbau + Haustiere & Kurzurlaube
  els.loanVal.textContent = `${state.household.loanRemaining.toLocaleString("de-DE")} €`;
  els.payLoan500.disabled = state.household.money < 500 || state.household.loanRemaining <= 0;
  els.payLoan1500.disabled = state.household.money < 1500 || state.household.loanRemaining <= 0;

  els.upgradesList.innerHTML = "";
  HOUSE_UPGRADES.forEach((up) => {
    const owned = state.household.upgrades.includes(up.id);
    const cost = getUpgradeCost(state, up);
    const card = document.createElement("div");
    card.className = "upgrade-card" + (owned ? " owned" : "");
    card.innerHTML = `
      <div class="phase-header">
        <strong>${up.name}</strong>
        <span class="badge ${owned ? "" : "badge-soft"}">${owned ? "✅ Gebaut" : cost + " €"}</span>
      </div>
      <p>${up.desc}</p>
    `;
    if (!owned) {
      const buyBtn = document.createElement("button");
      buyBtn.className = "primary-btn";
      buyBtn.textContent = `🔨 Jetzt bauen (${cost} €)`;
      buyBtn.disabled = state.household.money < cost;
      buyBtn.addEventListener("click", () => {
        if (buyHouseUpgrade(state, up.id)) {
          CoLifeAudio.play("fanfare");
          spawnConfetti();
          haptic(45);
          spawnFloatingFX("🔨 Ausgebaut!", buyBtn);
          showToast(`${up.name} gebaut! Schau oben aufs Haus-Diorama!`);
          CoLifeSync.broadcastState(state);
          render();
        }
      });
      card.appendChild(buyBtn);
    }
    els.upgradesList.appendChild(card);
  });

  if (els.specialsList) {
    els.specialsList.innerHTML = "";
    LIFE_SPECIALS.forEach((sp) => {
      const owned = sp.type === "pet" && (state.household.pets || []).includes(sp.id);
      const card = document.createElement("div");
      card.className = "upgrade-card" + (owned ? " owned" : "");
      card.innerHTML = `
        <div class="phase-header">
          <strong>${sp.name}</strong>
          <span class="badge ${owned ? "" : "badge-soft"}">${owned ? "✅ Zuhause" : sp.cost + " €"}</span>
        </div>
        <p>${sp.desc}</p>
      `;
      if (!owned) {
        const btn = document.createElement("button");
        btn.className = "secondary-btn";
        btn.textContent = sp.type === "pet" ? `🐾 Aufnehmen (${sp.cost} €)` : `🧳 Jetzt buchen (${sp.cost} €)`;
        btn.disabled = state.household.money < sp.cost;
        btn.addEventListener("click", () => {
          if (buyLifeSpecial(state, sp.id)) {
            CoLifeAudio.play("fanfare");
            spawnConfetti();
            haptic(40);
            spawnFloatingFX("❤️ Erlebnis!", btn);
            showToast(`${sp.name} aktiviert!`);
            CoLifeSync.broadcastState(state);
            render();
          }
        });
        card.appendChild(btn);
      }
      els.specialsList.appendChild(card);
    });
  }

  els.achievementsList.innerHTML = "";
  state.household.achievements.forEach((ach) => {
    const badge = document.createElement("span");
    badge.className = "badge badge-soft";
    badge.textContent = ach;
    els.achievementsList.appendChild(badge);
  });

  // 8. View 3: Familie & Freunde-Bande
  els.bandCodeBadge.textContent = `Code: ${state.multiplayer.bandCode}`;
  els.bandList.innerHTML = "";
  state.band.members.forEach((m) => {
    const card = document.createElement("div");
    card.className = "upgrade-card";
    card.innerHTML = `
      <div class="phase-header">
        <strong>${m.name}</strong>
        <span class="badge badge-soft">${m.relation} · ${m.bond} %</span>
      </div>
      <p>${m.desc}</p>
      <p style="color:#93c5fd;font-weight:600;">🎁 ${m.perk}</p>
      <div class="bar-track"><div class="bar-fill energy" style="width:${m.bond}%"></div></div>
    `;
    const btn = document.createElement("button");
    btn.className = "secondary-btn";
    btn.textContent = `🤝 Treffen / Anrufen mit ${player.name} (-10 Energie, +10 % Bande)`;
    btn.disabled = player.energy < 10 || m.bond >= 100;
    btn.addEventListener("click", () => {
      if (interactWithBand(state, m.id)) {
        CoLifeAudio.play("good");
        haptic(20);
        spawnFloatingFX("🍻 +10 % Bande", btn);
        showToast(`Schöne Zeit mit ${m.name}! Verbundenheit gestiegen.`);
        CoLifeSync.broadcastState(state);
        render();
      }
    });
    card.appendChild(btn);
    els.bandList.appendChild(card);
  });

  // 9. Dilemma-Modal prüfen
  if (state.activeDilemma) {
    const dilemma = DILEMMAS.find((d) => d.id === state.activeDilemma);
    if (dilemma) {
      els.dilemmaTitle.textContent = dilemma.title;
      els.dilemmaText.textContent = dilemma.text;
      els.dilemmaChoices.innerHTML = "";
      dilemma.choices.forEach((ch, idx) => {
        const b = document.createElement("button");
        b.className = idx === 0 ? "primary-btn" : "secondary-btn";
        b.textContent = ch.label;
        b.addEventListener("click", () => {
          CoLifeAudio.play("good");
          haptic(30);
          resolveDilemma(state, idx);
          CoLifeSync.broadcastState(state);
          render();
        });
        els.dilemmaChoices.appendChild(b);
      });
      els.dilemmaModal.classList.remove("hidden");
    }
  } else {
    els.dilemmaModal.classList.add("hidden");
  }

  // 10. Sonntags-Wochenbilanz-Modal prüfen
  if (state.weeklyReport && els.reportModal) {
    const r = state.weeklyReport;
    els.reportBody.innerHTML = `
      <div class="report-grade">Wochen-Note: <strong>${r.grade}</strong></div>
      <p>🎉 Ihr habt Woche ${r.weekNumber} gemeinsam gemeistert!</p>
      <ul class="report-list">
        <li><span>Einnahmen diese Woche:</span> <strong>+${r.earned} €</strong></li>
        <li><span>Ausgaben & Tilgung:</span> <strong>-${r.spent} €</strong></li>
        <li><span>Absolvierte Schichten:</span> <strong>${r.shifts}</strong></li>
        <li><span>Teamwork-Kombos:</span> <strong>${r.combos}x ⚡</strong></li>
        <li><span>Wochen-Bonus erhalten:</span> <strong style="color:#4ade80">+${r.bonus} €</strong></li>
      </ul>
    `;
    els.reportModal.classList.remove("hidden");
  } else if (els.reportModal) {
    els.reportModal.classList.add("hidden");
  }
}

// BÜHNEN-ANSICHT UMSCHALTEN (Außen / Innen / Karte)
els.stageModeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.stageMode = btn.getAttribute("data-stage") || "exterior";
    CoLifeAudio.play("pop");
    CoLifeSync.saveLocal(state);
    render();
  });
});

if (els.reportCloseBtn) {
  els.reportCloseBtn.addEventListener("click", () => {
    state.weeklyReport = null;
    CoLifeAudio.play("good");
    CoLifeSync.saveLocal(state);
    render();
  });
}

// NAVIGATION & TOPBAR EVENTS
els.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    CoLifeAudio.play("pop");
    const target = tab.getAttribute("data-view");
    els.navTabs.forEach((t) => t.classList.toggle("active", t === tab));
    Object.entries(els.views).forEach(([k, sec]) => {
      sec.classList.toggle("active", k === target);
    });
  });
});

if (els.soundBtn) {
  els.soundBtn.addEventListener("click", () => {
    const muted = CoLifeAudio.toggleMute();
    if (!muted) CoLifeAudio.play("good");
    render();
    showToast(muted ? "🔇 Ton ausgeschaltet" : "🔊 Soundeffekte eingeschaltet");
  });
}

if (els.editNoteBtn) {
  els.editNoteBtn.addEventListener("click", () => {
    const current = (state.fridgeNote || "").replace(/^📌 Kühlschrank-Notiz:\s*/, "");
    const next = prompt("Nachricht an den Kühlschrank pinnen (für deinen Partner sichtbar):", current);
    if (next !== null && next.trim() !== "") {
      state.fridgeNote = `📌 Kühlschrank-Notiz: ${next.trim()}`;
      state.log.unshift(`📌 Neue Kühlschrank-Notiz: „${next.trim()}“`);
      CoLifeAudio.play("pop");
      CoLifeSync.broadcastState(state);
      render();
      showToast("📌 Notiz am Kühlschrank aktualisiert!");
    }
  });
}

els.syncPill.addEventListener("click", () => {
  document.querySelector('[data-view="multi"]').click();
});

els.tabLena.addEventListener("click", () => {
  state.activePlayerId = "lena";
  CoLifeAudio.play("pop");
  render();
});

els.tabTom.addEventListener("click", () => {
  state.activePlayerId = "tom";
  CoLifeAudio.play("pop");
  render();
});

els.nextDayBtn.addEventListener("click", () => {
  CoLifeAudio.play("fanfare");
  haptic(35);
  advanceDay(state);
  if (state.weeklyReport) spawnConfetti();
  state.activePlayerId = "lena";
  CoLifeSync.broadcastState(state);
  render();
  showToast(`Tag ${state.day} gestartet! (${state.weather})`);
});

// HAUSKREDIT EVENTS
els.payLoan500.addEventListener("click", () => {
  if (makeLoanPayment(state, 500)) {
    CoLifeAudio.play("cash");
    haptic(25);
    spawnFloatingFX("-500 € Kredit 🏦", els.payLoan500);
    showToast("500 € Sondertilgung geleistet!");
    CoLifeSync.broadcastState(state);
    render();
  }
});

els.payLoan1500.addEventListener("click", () => {
  if (makeLoanPayment(state, 1500)) {
    CoLifeAudio.play("cash");
    haptic(35);
    spawnFloatingFX("-1.500 € Kredit 🏦", els.payLoan1500);
    showToast("1.500 € Sondertilgung geleistet!");
    CoLifeSync.broadcastState(state);
    render();
  }
});

// BANDE FREUND HINZUFÜGEN
els.addFriendBtn.addEventListener("click", () => {
  const name = els.newFriendName.value.trim();
  const role = els.newFriendRole.value.trim() || "Freundeskreis";
  if (!name) return;

  state.band.members.push({
    id: "friend_" + Date.now(),
    name: "🧑‍🤝‍🧑 " + name,
    relation: role,
    desc: `Per Bande-Code (${state.multiplayer.bandCode}) in euren Kreis aufgenommen.`,
    bond: 70,
    perk: "Teil eurer Familie-&-Freunde-Bande bei Festen & Ausflügen"
  });
  els.newFriendName.value = "";
  els.newFriendRole.value = "";
  state.log.unshift(`🍻 ${name} (${role}) gehört jetzt zu eurer Familie-&-Freunde-Bande!`);
  CoLifeAudio.play("fanfare");
  CoLifeSync.broadcastState(state);
  render();
  showToast(`${name} zur Bande hinzugefügt!`);
});

// MULTIPLAYER & SHARE EVENTS
async function handleShare() {
  const res = await CoLifeSync.shareStateWithPartner(state);
  if (res.ok && res.method === "clipboard") {
    showToast("📋 Sync-Link kopiert! Einfach per WhatsApp an Partner senden.");
  } else if (res.ok) {
    showToast("📲 Spielstand geteilt!");
  }
}

els.shareTurnBtn.addEventListener("click", handleShare);
els.shareWhatsappBtn.addEventListener("click", handleShare);

els.connectLiveBtn.addEventListener("click", () => {
  state.multiplayer.householdCode = els.householdCodeInput.value.trim().toUpperCase() || "LAUSITZ-1";
  state.multiplayer.bandCode = els.bandCodeInput.value.trim().toUpperCase() || "BANDE-77";
  CoLifeSync.saveLocal(state);
  CoLifeSync.connectLiveRoom(state.multiplayer.householdCode, () => state);
  render();
});

els.saveCloudBtn.addEventListener("click", () => {
  CoLifeSync.saveCloudConfig(els.cloudUrlInput.value, "");
  showToast("☁️ Cloud-URL gespeichert!");
  CoLifeSync.pushCloudIfConfigured(state);
});

els.pullCloudBtn.addEventListener("click", async () => {
  const remote = await CoLifeSync.pullCloudIfConfigured(state.multiplayer.householdCode);
  if (remote) {
    state = migrateStateIfNeeded(remote);
    CoLifeSync.saveLocal(state);
    render();
    showToast("☁️ Spielstand aus der Cloud geladen!");
  } else {
    showToast("Kein Cloud-Spielstand unter diesem Haushalts-Code gefunden.");
  }
});

els.triggerDilemmaBtn.addEventListener("click", () => {
  const pick = DILEMMAS[Math.floor(Math.random() * DILEMMAS.length)];
  state.activeDilemma = pick.id;
  render();
});

els.resetGameBtn.addEventListener("click", () => {
  if (confirm("Wirklich ein neues Spiel bei Tag 1 starten?")) {
    state = createInitialState();
    CoLifeSync.saveLocal(state);
    render();
    showToast("Neues Spiel gestartet!");
  }
});

// SYNC CALLBACKS
CoLifeSync.onStatusChanged = (status, text) => {
  els.multiStatusBox.textContent = `Status: ${text}`;
  if (status === "connected") {
    els.syncPill.textContent = "🟢 Live-Koop";
  } else if (status === "hosting") {
    els.syncPill.textContent = "🟡 Warte…";
  } else {
    els.syncPill.textContent = "🟢 Lokal";
  }
};

CoLifeSync.onStateReceived = (incomingState) => {
  if (!incomingState || !incomingState.players) return;
  state = migrateStateIfNeeded(incomingState);
  CoLifeSync.saveLocal(state);
  CoLifeAudio.play("good");
  render();
  haptic(25);
  showToast("📡 Live-Update vom Partner-Handy empfangen!");
};

els.householdCodeInput.value = state.multiplayer?.householdCode || "LAUSITZ-1";
els.bandCodeInput.value = state.multiplayer?.bandCode || "BANDE-77";
const savedCloud = CoLifeSync.getCloudConfig();
if (savedCloud && savedCloud.url) {
  els.cloudUrlInput.value = savedCloud.url;
}

render();
