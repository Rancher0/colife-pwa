// CoLife v3.0 – UI, Animiertes SVG-Diorama, Floating FX, WebAudio-Synthesizer & Multiplayer

let state = migrateStateIfNeeded(CoLifeSync.loadLocal() || createInitialState());

// WebAudio-Synthesizer für direktes Spiel-Feedback (ohne externe Audiodateien)
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
        tone(523.25, 0, 0.12, "triangle", 0.1);
        tone(659.25, 0.1, 0.12, "triangle", 0.1);
        tone(783.99, 0.2, 0.28, "triangle", 0.12);
      } else {
        tone(480, 0, 0.09, "sine", 0.07);
      }
    } catch (e) {}
  }
};

const els = {
  dayBadge: document.getElementById("day-badge"),
  weatherBadge: document.getElementById("weather-badge"),
  soundBtn: document.getElementById("sound-btn"),
  syncPill: document.getElementById("sync-pill"),
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

// Schwebende Belohnungs-Zahlen bei Klick auf Aktionen
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

// Erzeugt das animierte & antippbare SVG-Diorama des Eigenheims
function buildDioramaSVG(s) {
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
        <line x1="480" y1="70" x2="465" y2="115" />
      </g>`;
  } else if (s.weatherType === "snow" || isWinter) {
    weatherOverlay = `
      <g class="anim-snow" fill="#ffffff" opacity="0.85">
        <circle cx="80" cy="28" r="2.5"/><circle cx="170" cy="45" r="2"/>
        <circle cx="260" cy="20" r="3"/><circle cx="370" cy="38" r="2.2"/>
        <circle cx="460" cy="26" r="2.5"/><circle cx="550" cy="48" r="2"/>
        <circle cx="130" cy="82" r="2.2"/><circle cx="310" cy="75" r="2.6"/><circle cx="490" cy="85" r="2"/>
      </g>`;
  }

  return `
  <svg viewBox="0 0 640 174" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skyTop}" />
        <stop offset="100%" stop-color="${skyBot}" />
      </linearGradient>
    </defs>

    <!-- Himmel -->
    <rect width="640" height="174" fill="url(#skyGrad)" />

    <!-- Sonne / Mond & funkelnde Sterne -->
    ${
      phaseIndex === 2
        ? `<circle cx="545" cy="34" r="14" fill="#fef08a" opacity="0.95" />
           <g class="anim-stars" fill="#fff">
             <circle cx="95" cy="24" r="1.5" /><circle cx="210" cy="18" r="1.3" />
             <circle cx="380" cy="22" r="1.6" /><circle cx="470" cy="16" r="1.3" />
             <circle cx="150" cy="35" r="1.1" /><circle cx="310" cy="14" r="1.4" />
           </g>`
        : `<circle class="anim-sun" cx="${phaseIndex === 0 ? 110 : 510}" cy="38" r="19" fill="#fde047" opacity="0.92" />`
    }

    <!-- Ziehende Wolken -->
    <g class="anim-cloud" fill="#ffffff" opacity="${phaseIndex === 2 ? "0.14" : "0.35"}">
      <ellipse cx="180" cy="36" rx="26" ry="9" />
      <ellipse cx="195" cy="33" rx="18" ry="11" />
      <ellipse cx="420" cy="28" rx="22" ry="7" />
    </g>

    <!-- Silhouette links: BASF Schwarzheide Werk (Antippbar!) -->
    <g class="diorama-hotspot" data-inspect="🧪 BASF Schwarzheide: Lenas Arbeitsplatz (${s.players.lena.job})" opacity="0.48" fill="#0f172a">
      <rect x="20" y="94" width="20" height="38" />
      <rect x="44" y="78" width="9" height="54" />
      <rect x="57" y="86" width="16" height="46" />
      <circle class="anim-smoke-1" cx="48" cy="70" r="5" fill="#e2e8f0" opacity="0.7" />
      <circle class="anim-smoke-2" cx="52" cy="58" r="7" fill="#cbd5e1" opacity="0.45" />
    </g>

    <!-- Silhouette rechts: Bundeswehr-Fliegerhorst & animierter Helikopter (Antippbar!) -->
    <g class="diorama-hotspot" data-inspect="🚁 Bundeswehr-Fliegerhorst: Toms Stützpunkt (${s.players.tom.job})" opacity="0.52" fill="#0f172a">
      <rect x="580" y="90" width="10" height="42" />
      <polygon points="573,90 597,90 593,79 577,79" />
      <!-- Animierter Hubschrauber am Himmel -->
      <g class="anim-heli">
        <ellipse cx="515" cy="50" rx="12" ry="5" fill="#0f172a" />
        <line x1="497" y1="50" x2="506" y2="50" stroke="#0f172a" stroke-width="2.5" />
        <line x1="501" y1="43" x2="529" y2="43" stroke="#e2e8f0" stroke-width="1.6" />
      </g>
    </g>

    <!-- Hügel & Grundstück -->
    <ellipse cx="320" cy="148" rx="370" ry="38" fill="${hillCol}" />
    <rect x="0" y="134" width="640" height="40" fill="${groundCol}" />

    <!-- OPTIONAL: GARTEN-OASE & GEWÄCHSHAUS -->
    ${
      hasGarden
        ? `<g class="diorama-hotspot" data-inspect="🌿 Garten-Oase & Gewächshaus: Liefert alle 2 Tage frisches Gemüse in den Kühlschrank!">
             <rect x="82" y="104" width="46" height="32" rx="4" fill="rgba(134, 239, 172, 0.38)" stroke="#bbf7d0" stroke-width="1.5" />
             <polygon points="80,104 105,88 130,104" fill="rgba(134, 239, 172, 0.48)" stroke="#bbf7d0" stroke-width="1.5" />
             <circle cx="95" cy="124" r="6" fill="#22c55e" />
             <circle cx="112" cy="122" r="7" fill="#16a34a" />
           </g>`
        : ""
    }

    <!-- CARPORT / SCHRAUBER-GARAGE -->
    <g class="diorama-hotspot" data-inspect="🚗 Carport & Autos · Lena: ${s.players.lena.fuel}% Tank | Tom: ${s.players.tom.fuel}% Tank">
      <rect x="146" y="95" width="86" height="41" fill="${hasWorkshop ? "#334155" : "#1e293b"}" stroke="#475569" stroke-width="1.5" />
      <rect x="142" y="90" width="94" height="6" fill="#64748b" />
      ${
        hasWorkshop
          ? `<rect x="153" y="101" width="22" height="14" fill="#fde047" opacity="0.88" />
             <text x="195" y="109" fill="#38bdf8" font-size="8" font-weight="bold">🔧 GARAGE</text>`
          : ""
      }
      <!-- Lenas Auto (Rot) -->
      <g opacity="${s.players.lena.workedToday ? "0.95" : "1"}">
        <rect x="154" y="122" width="28" height="11" rx="3" fill="#ef4444" />
        <circle cx="160" cy="134" r="3" fill="#0f172a" /><circle cx="176" cy="134" r="3" fill="#0f172a" />
      </g>
      <!-- Toms Auto (Blau) -->
      <g>
        <rect x="195" y="121" width="30" height="12" rx="3" fill="#3b82f6" />
        <circle cx="201" cy="134" r="3" fill="#0f172a" /><circle cx="219" cy="134" r="3" fill="#0f172a" />
      </g>
    </g>

    <!-- HAUPTHAUS (Eigenheim) -->
    <g class="diorama-hotspot" data-inspect="🏡 Euer Eigenheim · Zustand: ${s.household.houseCondition}% | Ausbauten: ${up.length}/6">
      <!-- Schornstein mit animiertem Rauch -->
      <rect x="372" y="42" width="14" height="28" fill="#7c2d12" />
      ${
        hasFireplace || isWinter
          ? `<circle class="anim-smoke-1" cx="380" cy="32" r="5" fill="#e2e8f0" opacity="0.75" />
             <circle class="anim-smoke-2" cx="386" cy="20" r="7.5" fill="#cbd5e1" opacity="0.55" />
             <circle class="anim-smoke-1" cx="393" cy="10" r="9.5" fill="#94a3b8" opacity="0.35" />`
          : ""
      }

      <!-- Hausfassade -->
      <rect x="232" y="76" width="176" height="60" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />

      <!-- Satteldach -->
      <polygon points="220,76 320,34 420,76" fill="${isWinter ? "#f1f5f9" : "#b91c1c"}" stroke="#7f1d1d" stroke-width="1.5" />

      <!-- OPTIONAL: PHOTOVOLTAIK-ANLAGE AUF DEM DACH -->
      ${
        hasPV
          ? `<polygon points="258,68 316,43 374,68" fill="#0284c7" stroke="#bae6fd" stroke-width="1.2" opacity="0.95" />
             <line x1="295" y1="53" x2="295" y2="68" stroke="#bae6fd" stroke-width="0.8" />
             <line x1="335" y1="53" x2="335" y2="68" stroke="#bae6fd" stroke-width="0.8" />`
          : ""
      }

      <!-- Haustür -->
      <rect x="308" y="103" width="24" height="33" rx="2" fill="#78350f" />
      <circle cx="327" cy="119" r="1.8" fill="#fbbf24" />

      <!-- Fenster links (Küche) -->
      <rect x="250" y="92" width="40" height="24" rx="2" fill="${hasKitchen ? "#fef08a" : winGlow}" stroke="#475569" stroke-width="1.5" />
      <!-- Fenster rechts (Wohnzimmer & Kamin) -->
      <rect x="350" y="92" width="42" height="24" rx="2" fill="${hasFireplace ? "#fb923c" : winGlow}" stroke="#475569" stroke-width="1.5" />
      ${
        hasCat
          ? `<text x="364" y="111" font-size="13">🐈</text>`
          : ""
      }
    </g>

    <!-- OPTIONAL: HOFHUND BALU IM GARTEN -->
    ${
      hasDog
        ? `<g class="diorama-hotspot anim-dog" data-inspect="🐕 Hofhund Balu: Freut sich über jede Gassi-Runde (+4 Laune pro Tag)!">
             <text x="275" y="152" font-size="17">🐕</text>
           </g>`
        : ""
    }

    <!-- OPTIONAL: HOLZTERRASSE & GRILLPLATZ -->
    ${
      hasTerrace
        ? `<g class="diorama-hotspot" data-inspect="🪵 Holzterrasse & Grillplatz: Bereit für legendäre Grillabende mit der Bande!">
             <rect x="408" y="127" width="92" height="9" rx="2" fill="#92400e" stroke="#78350f" />
             <line x1="414" y1="90" x2="414" y2="127" stroke="#78350f" stroke-width="3" />
             <line x1="490" y1="90" x2="490" y2="127" stroke="#78350f" stroke-width="3" />
             <line x1="410" y1="90" x2="496" y2="90" stroke="#78350f" stroke-width="3" />
             <!-- Warme Lichterkette -->
             <circle class="anim-stars" cx="428" cy="94" r="2.6" fill="#fde047" />
             <circle class="anim-stars" cx="445" cy="94" r="2.6" fill="#fde047" />
             <circle class="anim-stars" cx="462" cy="94" r="2.6" fill="#fde047" />
             <circle class="anim-stars" cx="478" cy="94" r="2.6" fill="#fde047" />
             <!-- Kugelgrill mit glühender Kohle -->
             <circle cx="468" cy="116" r="7" fill="#1e293b" />
             <line x1="464" y1="122" x2="462" y2="128" stroke="#1e293b" stroke-width="2" />
             <line x1="472" y1="122" x2="474" y2="128" stroke="#1e293b" stroke-width="2" />
             <circle class="anim-smoke-1" cx="468" cy="105" r="3.5" fill="#f97316" opacity="0.85" />
           </g>`
        : ""
    }

    ${weatherOverlay}
  </svg>`;
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
  els.diorama.innerHTML = buildDioramaSVG(state);
  bindDioramaHotspots();

  // 2. HUD
  els.moneyVal.textContent = `${state.household.money.toLocaleString("de-DE")} €`;
  els.houseVal.textContent = `${state.household.houseCondition} %`;
  els.harmonyVal.textContent = `${state.household.harmony} %`;
  els.fridgeVal.textContent = `${state.household.fridge} / ${maxFridge}`;
  els.fuelpriceVal.textContent = `${state.fuelPrice.toFixed(2).replace(".", ",")} €/L`;
  els.upgradeCount.textContent = `${state.household.upgrades.length}/${HOUSE_UPGRADES.length}`;

  // Kühlschrank-Notiz für Partner
  if (els.fridgeNoteText) {
    els.fridgeNoteText.textContent = state.fridgeNote || "📌 Kühlschrank-Notiz für deinen Partner…";
  }

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

  // 4. Aktiver Spieler Details
  const career = getCareerInfo(player.id, player.xp);
  const myShift = getShiftForPlayer(state, player.id);
  els.playerName.textContent = `${player.avatar} ${player.name} (Lv. ${career.level})`;
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
        CoLifeAudio.play(act.sound || "pop");
        spawnFloatingFX(act.fxText || "✨", btn);
        performAction(state, player.id, act.id);

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

  // Haustiere & Kurzurlaube
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

// Initiale Werte in Formulare setzen
els.householdCodeInput.value = state.multiplayer?.householdCode || "LAUSITZ-1";
els.bandCodeInput.value = state.multiplayer?.bandCode || "BANDE-77";
const savedCloud = CoLifeSync.getCloudConfig();
if (savedCloud && savedCloud.url) {
  els.cloudUrlInput.value = savedCloud.url;
}

render();
