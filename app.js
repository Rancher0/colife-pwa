// CoLife – UI-Anbindung
const state = createInitialState();

const els = {
  dayBadge: document.getElementById("day-badge"),
  weatherBadge: document.getElementById("weather-badge"),
  moneyVal: document.getElementById("money-val"),
  houseVal: document.getElementById("house-val"),
  harmonyVal: document.getElementById("harmony-val"),
  tabLena: document.getElementById("tab-lena"),
  tabTom: document.getElementById("tab-tom"),
  playerName: document.getElementById("player-name"),
  playerJob: document.getElementById("player-job"),
  playerVacation: document.getElementById("player-vacation"),
  energyText: document.getElementById("energy-text"),
  energyBar: document.getElementById("energy-bar"),
  moodText: document.getElementById("mood-text"),
  moodBar: document.getElementById("mood-bar"),
  fuelText: document.getElementById("fuel-text"),
  fuelBar: document.getElementById("fuel-bar"),
  phaseTitle: document.getElementById("phase-title"),
  phaseStatus: document.getElementById("phase-status"),
  actionsGrid: document.getElementById("actions-grid"),
  nextDayBtn: document.getElementById("next-day-btn"),
  eventLog: document.getElementById("event-log")
};

function render() {
  const season = SEASONS[state.seasonIndex];
  const player = state.players[state.activePlayerId];

  els.dayBadge.textContent = `Tag ${state.day} · ${season}`;
  els.weatherBadge.textContent = state.weather;
  els.moneyVal.textContent = `${state.household.money.toLocaleString("de-DE")} €`;
  els.houseVal.textContent = `${state.household.houseCondition} %`;
  els.harmonyVal.textContent = `${state.household.harmony} %`;

  els.tabLena.classList.toggle("active", state.activePlayerId === "lena");
  els.tabTom.classList.toggle("active", state.activePlayerId === "tom");

  els.playerName.textContent = player.name;
  els.playerJob.textContent = player.job;
  els.playerVacation.textContent = `🏖️ ${player.vacationDays} Urlaubstage`;

  els.energyText.textContent = `${player.energy} / 100`;
  els.energyBar.style.width = `${player.energy}%`;
  els.moodText.textContent = `${player.mood} / 100`;
  els.moodBar.style.width = `${player.mood}%`;
  els.fuelText.textContent = `${player.fuel} %`;
  els.fuelBar.style.width = `${player.fuel}%`;

  if (player.doneToday) {
    els.phaseTitle.textContent = "Tag für " + player.name + " erledigt";
    els.phaseStatus.textContent = "Wechsle zur anderen Person oder schließe den Tag ab.";
    els.actionsGrid.innerHTML = "";
  } else {
    els.phaseTitle.textContent = `Phase: ${PHASES[player.phaseIndex]}`;
    els.phaseStatus.textContent = "Wähle eine Aktion für diese Phase";
    const actions = getActionsForPlayer(state, player);
    els.actionsGrid.innerHTML = "";

    actions.forEach((act) => {
      const btn = document.createElement("button");
      btn.className = "action-btn";
      btn.disabled = act.disabled;
      btn.innerHTML = `<strong>${act.title}</strong><span>${act.desc}</span>`;
      btn.addEventListener("click", () => {
        performAction(state, player.id, act.id);
        render();
      });
      els.actionsGrid.appendChild(btn);
    });
  }

  const bothDone = state.players.lena.doneToday && state.players.tom.doneToday;
  els.nextDayBtn.disabled = !bothDone;

  els.eventLog.innerHTML = "";
  state.log.slice(0, 15).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    els.eventLog.appendChild(li);
  });
}

els.tabLena.addEventListener("click", () => {
  state.activePlayerId = "lena";
  render();
});

els.tabTom.addEventListener("click", () => {
  state.activePlayerId = "tom";
  render();
});

els.nextDayBtn.addEventListener("click", () => {
  advanceDay(state);
  render();
});

render();
