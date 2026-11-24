// CoLife v2.0 – UI, Interaktives Haus-Diorama (SVG), Event-Handler & Multiplayer-Anbindung

let state = CoLifeSync.loadLocal() || createInitialState();

const els = {
  dayBadge: document.getElementById("day-badge"),
  weatherBadge: document.getElementById("weather-badge"),
  syncPill: document.getElementById("sync-pill"),
  diorama: document.getElementById("diorama-container"),
  moneyVal: document.getElementById("money-val"),
  houseVal: document.getElementById("house-val"),
  harmonyVal: document.getElementById("harmony-val"),
  fridgeVal: document.getElementById("fridge-val"),
  fuelpriceVal: document.getElementById("fuelprice-val"),
  upgradeCount: document.getElementById("upgrade-count"),

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
  shareTurnBtn: document.getElementById("share-turn-btn"),
  nextDayBtn: document.getElementById("next-day-btn"),
  eventLog: document.getElementById("event-log"),

  loanVal: document.getElementById("loan-val"),
  payLoan500: document.getElementById("pay-loan-500"),
  payLoan1500: document.getElementById("pay-loan-1500"),
  upgradesList: document.getElementById("upgrades-list"),
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
  }, 3200);
}

function haptic(ms = 18) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(ms);
    } catch (e) {}
  }
}

// Erzeugt das dynamische SVG-Diorama des Eigenheims inkl. Tageszeit, Jahreszeit, Wetter & Ausbauten
function buildDioramaSVG(s) {
  const player = s.players[s.activePlayerId];
  const phaseIndex = player.doneToday ? 2 : player.phaseIndex;
  const season = SEASONS[s.seasonIndex];
  const isWinter = season === "Winter";
  const isAutumn = season === "Herbst";
  const up = s.household.upgrades;

  // Himmel-Farben nach Tageszeit
  let skyTop = "#1e3a8a", skyBot = "#f59e0b"; // Morgen
  if (phaseIndex === 1) {
    skyTop = "#0284c7";
    skyBot = "#7dd3fc"; // Nachmittag
  } else if (phaseIndex === 2) {
    skyTop = "#090d1a";
    skyBot = "#1e1b4b"; // Abend/Nacht
  }

  // Boden-Farbe nach Jahreszeit
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

  // Wetter-Elemente
  let weatherOverlay = "";
  if (s.weatherType === "rain" || s.weatherType === "storm") {
    weatherOverlay = `
      <g stroke="#93c5fd" stroke-width="1.5" opacity="0.55">
        <line x1="70" y1="15" x2="55" y2="55" /><line x1="150" y1="25" x2="135" y2="65" />
        <line x1="240" y1="10" x2="225" y2="50" /><line x1="330" y1="30" x2="315" y2="70" />
        <line x1="430" y1="18" x2="415" y2="58" /><line x1="530" y1="22" x2="515" y2="62" />
      </g>`;
  } else if (s.weatherType === "snow" || isWinter) {
    weatherOverlay = `
      <g fill="#ffffff" opacity="0.8">
        <circle cx="80" cy="30" r="2.5"/><circle cx="170" cy="45" r="2"/>
        <circle cx="260" cy="22" r="3"/><circle cx="370" cy="38" r="2.2"/>
        <circle cx="460" cy="28" r="2.5"/><circle cx="550" cy="48" r="2"/>
      </g>`;
  }

  return `
  <svg viewBox="0 0 640 168" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${skyTop}" />
        <stop offset="100%" stop-color="${skyBot}" />
      </linearGradient>
    </defs>

    <!-- Himmel -->
    <rect width="640" height="168" fill="url(#skyGrad)" />

    <!-- Sonne / Mond & Sterne -->
    ${
      phaseIndex === 2
        ? `<circle cx="545" cy="34" r="14" fill="#fef08a" opacity="0.92" />
           <circle cx="95" cy="24" r="1.4" fill="#fff" /><circle cx="210" cy="18" r="1.2" fill="#fff" />
           <circle cx="380" cy="22" r="1.5" fill="#fff" /><circle cx="470" cy="16" r="1.2" fill="#fff" />`
        : `<circle cx="${phaseIndex === 0 ? 110 : 510}" cy="38" r="18" fill="#fde047" opacity="0.9" />`
    }

    <!-- Silhouette links: BASF Schwarzheide Werk am Horizont -->
    <g opacity="0.38" fill="#0f172a">
      <rect x="24" y="92" width="18" height="36" />
      <rect x="46" y="80" width="8" height="48" />
      <rect x="58" y="86" width="14" height="42" />
      <circle cx="50" cy="73" r="5" fill="#cbd5e1" opacity="0.6" />
    </g>

    <!-- Silhouette rechts: Bundeswehr-Fliegerhorst Tower & Helikopter -->
    <g opacity="0.42" fill="#0f172a">
      <rect x="575" y="88" width="10" height="40" />
      <polygon points="569,88 591,88 587,78 573,78" />
      <!-- Kleiner Hubschrauber am Himmel -->
      <ellipse cx="520" cy="52" rx="11" ry="4.5" />
      <line x1="504" y1="52" x2="512" y2="52" stroke="#0f172a" stroke-width="2.5" />
      <line x1="508" y1="45" x2="532" y2="45" stroke="#0f172a" stroke-width="1.5" />
    </g>

    <!-- Hügel & Grundstück -->
    <ellipse cx="320" cy="145" rx="370" ry="38" fill="${hillCol}" />
    <rect x="0" y="132" width="640" height="36" fill="${groundCol}" />

    <!-- OPTIONAL: GARTEN-OASE & GEWÄCHSHAUS (Links) -->
    ${
      hasGarden
        ? `<g>
             <rect x="82" y="102" width="46" height="32" rx="4" fill="rgba(134, 239, 172, 0.35)" stroke="#bbf7d0" stroke-width="1.5" />
             <polygon points="80,102 105,86 130,102" fill="rgba(134, 239, 172, 0.45)" stroke="#bbf7d0" stroke-width="1.5" />
             <circle cx="95" cy="122" r="6" fill="#22c55e" />
             <circle cx="112" cy="120" r="7" fill="#16a34a" />
           </g>`
        : ""
    }

    <!-- CARPORT / SCHRAUBER-GARAGE -->
    <g>
      <rect x="148" y="94" width="84" height="40" fill="${hasWorkshop ? "#334155" : "#1e293b"}" stroke="#475569" stroke-width="1.5" />
      <rect x="144" y="89" width="92" height="6" fill="#64748b" />
      ${
        hasWorkshop
          ? `<rect x="155" y="100" width="22" height="14" fill="#fde047" opacity="0.85" />
             <text x="198" y="108" fill="#38bdf8" font-size="8" font-weight="bold">🔧 GARAGE</text>`
          : ""
      }
      <!-- Lenas Auto (Rot) & Toms Auto (Blau) -->
      <rect x="156" y="121" width="28" height="11" rx="3" fill="#ef4444" />
      <circle cx="162" cy="133" r="3" fill="#0f172a" /><circle cx="178" cy="133" r="3" fill="#0f172a" />
      <rect x="196" y="120" width="30" height="12" rx="3" fill="#3b82f6" />
      <circle cx="202" cy="133" r="3" fill="#0f172a" /><circle cx="220" cy="133" r="3" fill="#0f172a" />
    </g>

    <!-- HAUPTHAUS (Eigenheim) -->
    <g>
      <!-- Schornstein -->
      <rect x="372" y="42" width="14" height="28" fill="#7c2d12" />
      ${
        hasFireplace || isWinter
          ? `<circle cx="380" cy="33" r="5" fill="#e2e8f0" opacity="0.7" />
             <circle cx="385" cy="23" r="7" fill="#cbd5e1" opacity="0.55" />
             <circle cx="392" cy="13" r="9" fill="#94a3b8" opacity="0.35" />`
          : ""
      }

      <!-- Hausfassade -->
      <rect x="232" y="76" width="176" height="58" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />

      <!-- Satteldach -->
      <polygon points="220,76 320,34 420,76" fill="${isWinter ? "#f1f5f9" : "#b91c1c"}" stroke="#7f1d1d" stroke-width="1.5" />

      <!-- OPTIONAL: PHOTOVOLTAIK-ANLAGE AUF DEM DACH -->
      ${
        hasPV
          ? `<polygon points="258,68 316,43 374,68" fill="#0284c7" stroke="#bae6fd" stroke-width="1.2" opacity="0.92" />
             <line x1="295" y1="53" x2="295" y2="68" stroke="#bae6fd" stroke-width="0.8" />
             <line x1="335" y1="53" x2="335" y2="68" stroke="#bae6fd" stroke-width="0.8" />`
          : ""
      }

      <!-- Haustür -->
      <rect x="308" y="102" width="24" height="32" rx="2" fill="#78350f" />
      <circle cx="327" cy="118" r="1.8" fill="#fbbf24" />

      <!-- Fenster links (Küche) -->
      <rect x="250" y="92" width="40" height="24" rx="2" fill="${hasKitchen ? "#fef08a" : winGlow}" stroke="#475569" stroke-width="1.5" />
      <!-- Fenster rechts (Wohnzimmer & Kamin) -->
      <rect x="350" y="92" width="42" height="24" rx="2" fill="${hasFireplace ? "#fb923c" : winGlow}" stroke="#475569" stroke-width="1.5" />
    </g>

    <!-- OPTIONAL: HOLZTERRASSE & GRILLPLATZ (Rechts am Haus) -->
    ${
      hasTerrace
        ? `<g>
             <!-- Holzdeck -->
             <rect x="408" y="125" width="90" height="9" rx="2" fill="#92400e" stroke="#78350f" />
             <!-- Pergola & Lichterkette -->
             <line x1="414" y1="90" x2="414" y2="125" stroke="#78350f" stroke-width="3" />
             <line x1="488" y1="90" x2="488" y2="125" stroke="#78350f" stroke-width="3" />
             <line x1="410" y1="90" x2="494" y2="90" stroke="#78350f" stroke-width="3" />
             <circle cx="428" cy="94" r="2.5" fill="#fde047" />
             <circle cx="445" cy="94" r="2.5" fill="#fde047" />
             <circle cx="462" cy="94" r="2.5" fill="#fde047" />
             <circle cx="478" cy="94" r="2.5" fill="#fde047" />
             <!-- Kugelgrill -->
             <circle cx="468" cy="114" r="7" fill="#1e293b" />
             <line x1="464" y1="120" x2="462" y2="126" stroke="#1e293b" stroke-width="2" />
             <line x1="472" y1="120" x2="474" y2="126" stroke="#1e293b" stroke-width="2" />
             <circle cx="468" cy="103" r="3" fill="#f97316" opacity="0.8" />
           </g>`
        : ""
    }

    ${weatherOverlay}
  </svg>`;
}

function render() {
  const season = SEASONS[state.seasonIndex];
  const weekday = WEEKDAYS[(state.day - 1) % 7];
  const player = state.players[state.activePlayerId];
  const maxFridge = state.household.upgrades.includes("kitchen") ? 8 : 6;

  // 1. Topbar & Diorama
  els.dayBadge.textContent = `Tag ${state.day} · ${weekday.slice(0, 2)} · ${season}`;
  els.weatherBadge.textContent = state.weather;
  els.diorama.innerHTML = buildDioramaSVG(state);

  // 2. HUD
  els.moneyVal.textContent = `${state.household.money.toLocaleString("de-DE")} €`;
  els.houseVal.textContent = `${state.household.houseCondition} %`;
  els.harmonyVal.textContent = `${state.household.harmony} %`;
  els.fridgeVal.textContent = `${state.household.fridge} / ${maxFridge}`;
  els.fuelpriceVal.textContent = `${state.fuelPrice.toFixed(2).replace(".", ",")} €/L`;
  els.upgradeCount.textContent = `${state.household.upgrades.length}/${HOUSE_UPGRADES.length}`;

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
        performAction(state, player.id, act.id);
        // Automatisch zum Partner wechseln, wenn dieser Spieler fertig ist und der andere noch nicht
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

  const bothDone = state.players.lena.doneToday && state.players.tom.doneToday;
  els.nextDayBtn.disabled = !bothDone;

  // 6. Tagesbuch
  els.eventLog.innerHTML = "";
  state.log.slice(0, 18).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    els.eventLog.appendChild(li);
  });

  // 7. View 2: Haus & Ausbau
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
          haptic(40);
          showToast(`${up.name} gebaut! Schau oben aufs Haus-Diorama!`);
          CoLifeSync.broadcastState(state);
          render();
        }
      });
      card.appendChild(buyBtn);
    }
    els.upgradesList.appendChild(card);
  });

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
        haptic(20);
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

// NAVIGATION EVENTS
els.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-view");
    els.navTabs.forEach((t) => t.classList.toggle("active", t === tab));
    Object.entries(els.views).forEach(([k, sec]) => {
      sec.classList.toggle("active", k === target);
    });
  });
});

els.syncPill.addEventListener("click", () => {
  document.querySelector('[data-view="multi"]').click();
});

els.tabLena.addEventListener("click", () => {
  state.activePlayerId = "lena";
  render();
});

els.tabTom.addEventListener("click", () => {
  state.activePlayerId = "tom";
  render();
});

els.nextDayBtn.addEventListener("click", () => {
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
    haptic(25);
    showToast("500 € Sondertilgung geleistet!");
    CoLifeSync.broadcastState(state);
    render();
  }
});

els.payLoan1500.addEventListener("click", () => {
  if (makeLoanPayment(state, 1500)) {
    haptic(35);
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
    state = remote;
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
  state = incomingState;
  CoLifeSync.saveLocal(state);
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
