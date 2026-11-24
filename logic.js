// CoLife – Reine Spiellogik (ohne DOM-Abhängigkeit, leicht erweiterbar)

const PHASES = ["Morgen", "Nachmittag", "Abend"];
const SEASONS = ["Frühling", "Sommer", "Herbst", "Winter"];
const WEATHER_BY_SEASON = {
  Frühling: ["☀️ Mild (16 °C)", "🌦️ Frühlingsregen (12 °C)", "🌤️ Sonnig (19 °C)"],
  Sommer: ["☀️ Warm (27 °C)", "⛈️ Sommergewitter (22 °C)", "🌞 Hochsommer (31 °C)"],
  Herbst: ["🍂 Windig (11 °C)", "🌧️ Dauerregen (9 °C)", "🌤️ Goldener Herbst (14 °C)"],
  Winter: ["❄️ Schneefall (-2 °C)", "🌫️ Kalt & Nebel (1 °C)", "☀️ Winterssonne (3 °C)"]
};

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function createInitialState() {
  return {
    day: 1,
    seasonIndex: 0,
    weather: "☀️ Mild (16 °C)",
    activePlayerId: "lena",
    household: {
      money: 2450,
      houseCondition: 82,
      harmony: 78,
      // Reserviert für spätere Ausbaustufen:
      pets: [],
      children: []
    },
    players: {
      lena: {
        id: "lena",
        name: "Lena",
        job: "Chemielaborantin · BASF Schwarzheide",
        energy: 85,
        mood: 75,
        fuel: 65,
        vacationDays: 28,
        phaseIndex: 0,
        doneToday: false
      },
      tom: {
        id: "tom",
        name: "Tom",
        job: "Hubschraubermechaniker · Bundeswehr-Flugplatz",
        energy: 85,
        mood: 75,
        fuel: 70,
        vacationDays: 30,
        phaseIndex: 0,
        doneToday: false
      }
    },
    log: [
      "Willkommen bei CoLife! Plant euren ersten gemeinsamen Tag."
    ]
  };
}

function getActionsForPlayer(state, player) {
  const phase = PHASES[player.phaseIndex];
  const isWorkPhase = phase === "Morgen" || phase === "Nachmittag";

  const actions = [];

  if (isWorkPhase) {
    actions.push({
      id: "work",
      title: player.id === "lena" ? "🧪 Schicht bei BASF" : "🚁 Dienst am Flugplatz",
      desc: "+145 € · -28 Energie · -15 % Tank",
      disabled: player.fuel < 15 || player.energy < 20,
      run: () => {
        player.energy = clamp(player.energy - 28, 0, 100);
        player.fuel = clamp(player.fuel - 15, 0, 100);
        player.mood = clamp(player.mood - 4, 0, 100);
        state.household.money += 145;
        return `${player.name} war arbeiten (+145 €, -15 % Tank).`;
      }
    });

    actions.push({
      id: "vacation",
      title: "🏖️ Urlaubstag nehmen",
      desc: "-1 Urlaubstag · +15 Energie · +10 Zufriedenheit",
      disabled: player.vacationDays <= 0,
      run: () => {
        player.vacationDays -= 1;
        player.energy = clamp(player.energy + 15, 0, 100);
        player.mood = clamp(player.mood + 10, 0, 100);
        return `${player.name} hat sich frei genommen und erholt sich.`;
      }
    });
  }

  actions.push({
    id: "refuel",
    title: "⛽ Tanken fahren",
    desc: "-65 € · Tank auf 100 % · -8 Energie",
    disabled: state.household.money < 65 || player.fuel >= 95,
    run: () => {
      state.household.money -= 65;
      player.fuel = 100;
      player.energy = clamp(player.energy - 8, 0, 100);
      return `${player.name} hat vollgetankt (-65 €).`;
    }
  });

  actions.push({
    id: "chores",
    title: "🧺 Wäsche & Haushalt",
    desc: "+14 % Haus & Ordnung · -15 Energie",
    disabled: player.energy < 15,
    run: () => {
      state.household.houseCondition = clamp(state.household.houseCondition + 14, 0, 100);
      state.household.harmony = clamp(state.household.harmony + 3, 0, 100);
      player.energy = clamp(player.energy - 15, 0, 100);
      return `${player.name} hat Wäsche gemacht und aufgeräumt.`;
    }
  });

  actions.push({
    id: "cook",
    title: "🍳 Einkaufen & Kochen",
    desc: "-35 € · +12 Energie · +6 % Haus · +4 % Harmonie",
    disabled: state.household.money < 35,
    run: () => {
      state.household.money -= 35;
      state.household.houseCondition = clamp(state.household.houseCondition + 6, 0, 100);
      state.household.harmony = clamp(state.household.harmony + 4, 0, 100);
      player.energy = clamp(player.energy + 12, 0, 100);
      player.mood = clamp(player.mood + 5, 0, 100);
      return `${player.name} hat eingekauft und frisch gekocht (-35 €).`;
    }
  });

  if (phase === "Abend") {
    actions.push({
      id: "concert",
      title: "🎸 Konzert / Essen gehen",
      desc: "-90 € · +18 Zufriedenheit · +10 % Harmonie",
      disabled: state.household.money < 90,
      run: () => {
        state.household.money -= 90;
        state.household.harmony = clamp(state.household.harmony + 10, 0, 100);
        player.mood = clamp(player.mood + 18, 0, 100);
        player.energy = clamp(player.energy - 10, 0, 100);
        return `${player.name} genießt den Abend beim Konzert/Essen (-90 €).`;
      }
    });
  }

  actions.push({
    id: "rest",
    title: "🛋️ Ausruhen",
    desc: "+22 Energie · +6 Zufriedenheit",
    disabled: false,
    run: () => {
      player.energy = clamp(player.energy + 22, 0, 100);
      player.mood = clamp(player.mood + 6, 0, 100);
      return `${player.name} legt eine Pause ein.`;
    }
  });

  return actions;
}

function performAction(state, playerId, actionId) {
  const player = state.players[playerId];
  if (!player || player.doneToday) return;

  const action = getActionsForPlayer(state, player).find((a) => a.id === actionId);
  if (!action || action.disabled) return;

  const message = action.run();
  state.log.unshift(`Tag ${state.day} (${PHASES[player.phaseIndex]}): ${message}`);

  if (player.phaseIndex < PHASES.length - 1) {
    player.phaseIndex += 1;
  } else {
    player.doneToday = true;
  }
}

function advanceDay(state) {
  const season = SEASONS[state.seasonIndex];
  const dailyFixedCost = season === "Winter" ? 55 : 40;
  state.household.money -= dailyFixedCost;
  state.household.houseCondition = clamp(state.household.houseCondition - 8, 0, 100);

  Object.values(state.players).forEach((p) => {
    p.energy = clamp(p.energy + 25, 0, 100);
    p.phaseIndex = 0;
    p.doneToday = false;
  });

  state.day += 1;
  if ((state.day - 1) % 7 === 0) {
    state.seasonIndex = (state.seasonIndex + 1) % SEASONS.length;
  }

  const nextSeason = SEASONS[state.seasonIndex];
  const options = WEATHER_BY_SEASON[nextSeason];
  state.weather = options[Math.floor(Math.random() * options.length)];

  state.log.unshift(
    `🌙 Tageswechsel: Fixkosten -${dailyFixedCost} € (${season}). Neuer Tag ${state.day} (${nextSeason}, ${state.weather}).`
  );
}
