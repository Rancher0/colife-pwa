// CoLife v2.0 – Tiefe Spiellogik: Schichten, Karriere, Tankpreise, Vorräte, Haus-Ausbau, Dilemmas & Bande

const PHASES = ["Morgen", "Nachmittag", "Abend"];
const WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const SEASONS = ["Frühling", "Sommer", "Herbst", "Winter"];

const WEATHER_BY_SEASON = {
  Frühling: [
    { label: "☀️ Mild & Sonnig (17 °C)", type: "sun", temp: 17 },
    { label: "🌦️ Frühlingsregen (12 °C)", type: "rain", temp: 12 },
    { label: "🌤️ Heiter & Frisch (19 °C)", type: "sun", temp: 19 }
  ],
  Sommer: [
    { label: "☀️ Lausitzer Sommer (28 °C)", type: "sun", temp: 28 },
    { label: "⛈️ Sommergewitter (22 °C)", type: "storm", temp: 22 },
    { label: "🌞 Badewetter (31 °C)", type: "sun", temp: 31 }
  ],
  Herbst: [
    { label: "🍂 Goldener Herbst (14 °C)", type: "leaves", temp: 14 },
    { label: "🌧️ Herbststurm & Regen (9 °C)", type: "rain", temp: 9 },
    { label: "🌫️ Frühnebel (7 °C)", type: "cloudy", temp: 7 }
  ],
  Winter: [
    { label: "❄️ Schneefall (-3 °C)", type: "snow", temp: -3 },
    { label: "🥶 Klarer Frost (-5 °C)", type: "snow", temp: -5 },
    { label: "☁️ Wintergrau (2 °C)", type: "cloudy", temp: 2 }
  ]
};

const CAREER_TRACKS = {
  lena: [
    { level: 1, title: "Chemielaborantin", place: "BASF Schwarzheide", pay: 145, xpNext: 90 },
    { level: 2, title: "Senior-Analytikerin", place: "BASF Schwarzheide", pay: 175, xpNext: 220 },
    { level: 3, title: "Schichtleiterin Labor", place: "BASF Schwarzheide", pay: 215, xpNext: 420 },
    { level: 4, title: "Laborleiterin Synthese", place: "BASF Schwarzheide", pay: 265, xpNext: 9999 }
  ],
  tom: [
    { level: 1, title: "Gerätemechaniker", place: "Fliegerhorst Bundeswehr", pay: 145, xpNext: 90 },
    { level: 2, title: "Truppführer Instandsetzung", place: "Fliegerhorst Bundeswehr", pay: 175, xpNext: 220 },
    { level: 3, title: "Prüfer NH90 / CH-53", place: "Fliegerhorst Bundeswehr", pay: 215, xpNext: 420 },
    { level: 4, title: "Hallenmeister Flugplatz", place: "Fliegerhorst Bundeswehr", pay: 265, xpNext: 9999 }
  ]
};

// Wochen-Schichtplan (Mo=0 .. So=6): "early" (Morgen), "late" (Nachmittag), "free" (Frei)
const WEEKLY_SHIFTS = {
  lena: ["early", "early", "late", "late", "early", "free", "free"],
  tom:  ["early", "late", "early", "early", "late", "free", "free"]
};

const HOUSE_UPGRADES = [
  {
    id: "terrace",
    name: "🪵 Holzterrasse & Grillplatz",
    cost: 650,
    desc: "Sichtbar am Haus! Schaltet Grillabende mit der Bande frei & bringt +4 % Harmonie-Bonus.",
    tag: "Lifestyle & Bande"
  },
  {
    id: "kitchen",
    name: "🍳 Moderne Einbauküche",
    cost: 950,
    desc: "Kühlschrank fasst 8 Portionen. Kochen bringt +8 extra Energie & +5 Zufriedenheit.",
    tag: "Haushalt"
  },
  {
    id: "workshop",
    name: "🔧 Toms Schrauber-Garage",
    cost: 800,
    desc: "Sichtbar am Carport! 20 % günstigere Tank-/Autokosten & Tom löst Reparaturen gratis.",
    tag: "Mobilität"
  },
  {
    id: "fireplace",
    name: "🔥 Kaminofen im Wohnzimmer",
    cost: 900,
    desc: "Rauchender Schornstein im Winter! Spart 15 €/Tag Heizkosten in Herbst/Winter.",
    tag: "Gemütlichkeit"
  },
  {
    id: "pv",
    name: "☀️ Photovoltaik aufs Dach",
    cost: 1650,
    desc: "Solarmodule sichtbar auf dem Dach! Senkt tägliche Fixkosten dauerhaft um 14 €/Tag.",
    tag: "Finanzen"
  },
  {
    id: "garden",
    name: "🌿 Garten-Oase & Gewächshaus",
    cost: 750,
    desc: "Sichtbar im Garten! Liefert alle 2 Tage frisches Gemüse (+1 Kühlschrank-Portion).",
    tag: "Selbstversorger"
  }
];

const BAND_DEFAULT_MEMBERS = [
  {
    id: "oma_opa",
    name: "👵👴 Oma Erna & Opa Heinz",
    relation: "Familie",
    desc: "Bringen selbstgebackenen Kuchen vorbei und helfen gern im Garten.",
    bond: 72,
    perk: "Ab 80 % Verbundenheit: Sonntags-Kuchen (+2 Portionen im Kühlschrank)"
  },
  {
    id: "sarah_lukas",
    name: "🎸 Sarah & Lukas",
    relation: "Beste Freunde",
    desc: "Immer dabei bei Konzerten, Spieleabenden und spontanen Ausflügen.",
    bond: 68,
    perk: "Ab 80 % Verbundenheit: +25 % mehr Spaß bei Konzerten & Ausflügen"
  },
  {
    id: "micha",
    name: "🚁 Kamerad Micha",
    relation: "Flugplatz-Kumpel",
    desc: "Schraubt mit Tom an Helikoptern und packt beim Haus-Ausbau kräftig mit an.",
    bond: 64,
    perk: "Ab 75 % Verbundenheit: 15 % Nachbarschafts-Rabatt auf Haus-Upgrades"
  },
  {
    id: "steffi",
    name: "🧪 Labor-Kollegin Steffi",
    relation: "BASF Schwarzheide",
    desc: "Wohnt fast auf dem Weg nach Schwarzheide – ideal für Fahrgemeinschaften.",
    bond: 65,
    perk: "Ab 75 % Verbundenheit: Lena spart 5 % Tank beim Pendeln zur BASF"
  }
];

const DILEMMAS = [
  {
    id: "basf_rush",
    title: "🧪 Eilprobe in Schwarzheide!",
    text: "Kurz vor Schichtende kommt eine dringende Polymer-Probe aus der Produktion rein. Der Schichtleiter fragt, ob Lena 2 Überstunden dranhängt.",
    choices: [
      {
        label: "Überstunden machen (+95 €, +20 XP, -18 Energie)",
        apply: (s) => {
          s.household.money += 95;
          s.players.lena.xp += 20;
          s.players.lena.energy = clamp(s.players.lena.energy - 18, 0, 100);
          return "Lena hat die Eilprobe analysiert (+95 € Bonus, +20 Karriere-XP).";
        }
      },
      {
        label: "Pünktlich Feierabend machen (+6 % Harmonie, +8 Zufriedenheit)",
        apply: (s) => {
          s.household.harmony = clamp(s.household.harmony + 6, 0, 100);
          s.players.lena.mood = clamp(s.players.lena.mood + 8, 0, 100);
          return "Lena ist pünktlich nach Hause gefahren – gemeinsamer Feierabend!";
        }
      }
    ]
  },
  {
    id: "heli_hydraulics",
    title: "🚁 NH90 Hydraulik-Check am Flugplatz",
    text: "Vor einem Übungsflug meldet die Crew ein verdächtiges Ventil am Hubschrauber. Tom kann sofort die Sonderschicht übernehmen.",
    choices: [
      {
        label: "Schrauber-Einsatz leiten (+110 €, +22 XP, -20 Energie)",
        apply: (s) => {
          s.household.money += 110;
          s.players.tom.xp += 22;
          s.players.tom.energy = clamp(s.players.tom.energy - 20, 0, 100);
          return "Tom hat das Hydraulikventil am NH90 getauscht (+110 € Zulage).";
        }
      },
      {
        label: "An die Bereitschaft übergeben (+10 Energie, +5 Zufriedenheit)",
        apply: (s) => {
          s.players.tom.energy = clamp(s.players.tom.energy + 10, 0, 100);
          s.players.tom.mood = clamp(s.players.tom.mood + 5, 0, 100);
          return "Tom hat pünktlich übergeben und schont seine Kräfte.";
        }
      }
    ]
  },
  {
    id: "washing_machine",
    title: "🧺 Waschmaschine streikt!",
    text: "Mitten im Schleudergang rumpelt die Waschmaschine im Bad und bleibt mit blinkender Fehlermeldung stehen.",
    choices: [
      {
        label: "Tom schraubt selbst (-35 € Ersatzteil, mit Werkstatt gratis!)",
        apply: (s) => {
          const hasWorkshop = s.household.upgrades.includes("workshop");
          const cost = hasWorkshop ? 0 : 35;
          s.household.money -= cost;
          s.players.tom.energy = clamp(s.players.tom.energy - 12, 0, 100);
          s.household.houseCondition = clamp(s.household.houseCondition + 8, 0, 100);
          return hasWorkshop
            ? "Dank Toms Schrauber-Garage war die Pumpe in 20 Minuten gratis repariert!"
            : "Tom hat die Laugenpumpe selbst getauscht (nur 35 € fürs Ersatzteil).";
        }
      },
      {
        label: "Kundendienst rufen (-140 €, kein Energieverlust)",
        apply: (s) => {
          s.household.money -= 140;
          s.household.houseCondition = clamp(s.household.houseCondition + 10, 0, 100);
          return "Der Handwerker hat die Waschmaschine repariert (-140 €).";
        }
      }
    ]
  },
  {
    id: "concert_tickets",
    title: "🎟️ Vorverkauf: Open-Air am Senftenberger See!",
    text: "Sarah & Lukas schreiben in die Bande-Gruppe: Es gibt noch Front-of-Stage-Tickets für eure Lieblingsband!",
    choices: [
      {
        label: "2 Tickets sichern (-120 €, +18 Zufriedenheit, +10 % Harmonie, +Bande)",
        apply: (s) => {
          s.household.money -= 120;
          s.household.harmony = clamp(s.household.harmony + 10, 0, 100);
          s.players.lena.mood = clamp(s.players.lena.mood + 18, 0, 100);
          s.players.tom.mood = clamp(s.players.tom.mood + 18, 0, 100);
          boostBandMember(s, "sarah_lukas", 12);
          return "Was für ein Abend! Ihr habt euch die Konzert-Tickets mit Sarah & Lukas gegönnt.";
        }
      },
      {
        label: "Vernünftig bleiben & für das Haus sparen (+50 € Spar-Bonus-Gefühl)",
        apply: (s) => {
          s.players.lena.mood = clamp(s.players.lena.mood - 3, 0, 100);
          s.players.tom.mood = clamp(s.players.tom.mood - 3, 0, 100);
          return "Ihr habt auf die teuren Tickets verzichtet – das Hausbudget bleibt stabil.";
        }
      }
    ]
  },
  {
    id: "inlaws_visit",
    title: "🍰 Spontaner Besuch von Oma Erna & Opa Heinz",
    text: "Das Telefon klingelt: „Wir sind gerade in der Nähe und bringen einen warmen Pflaumenkuchen vorbei!“",
    choices: [
      {
        label: "Herzlich einladen & Kaffee kochen (+2 Vorräte, +12 Bande, -8 Energie)",
        apply: (s) => {
          const maxFridge = s.household.upgrades.includes("kitchen") ? 8 : 6;
          s.household.fridge = clamp(s.household.fridge + 2, 0, maxFridge);
          boostBandMember(s, "oma_opa", 12);
          s.players.lena.energy = clamp(s.players.lena.energy - 8, 0, 100);
          s.players.tom.energy = clamp(s.players.tom.energy - 8, 0, 100);
          s.household.harmony = clamp(s.household.harmony + 5, 0, 100);
          return "Gemütlicher Kaffeetisch mit Oma & Opa! Der Kühlschrank ist voller Kuchen (+2 Portionen).";
        }
      },
      {
        label: "Aufs Wochenende vertrösten (+10 Energie für euch)",
        apply: (s) => {
          boostBandMember(s, "oma_opa", -4);
          s.players.lena.energy = clamp(s.players.lena.energy + 10, 0, 100);
          return "Ihr habt den Besuch höflich aufs Wochenende verschoben.";
        }
      }
    ]
  },
  {
    id: "fuel_dip",
    title: "⛽ Preissturz an der Tankstelle!",
    text: "Auf der Heimfahrt fällt die Anzeige an der freien Tankstelle plötzlich auf 1,58 €/Liter – dahinter bildet sich schon eine Schlange.",
    choices: [
      {
        label: "Beide Autos sofort volltanken (-75 € gesamt, beide Tanks 100 %)",
        apply: (s) => {
          s.household.money -= 75;
          s.players.lena.fuel = 100;
          s.players.tom.fuel = 100;
          return "Schnäppchen! Beide Autos sind für zusammen 75 € randvoll getankt.";
        }
      },
      {
        label: "Weiterfahren & Zeit sparen (+6 Energie)",
        apply: (s) => {
          s.players.lena.energy = clamp(s.players.lena.energy + 6, 0, 100);
          s.players.tom.energy = clamp(s.players.tom.energy + 6, 0, 100);
          return "Ihr habt euch den Stau an der Zapfsäule gespart.";
        }
      }
    ]
  }
];

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, Math.round(val)));
}

function getCareerInfo(playerId, xp) {
  const track = CAREER_TRACKS[playerId] || CAREER_TRACKS.lena;
  let current = track[0];
  for (const step of track) {
    if (xp >= (step.level === 1 ? 0 : track[step.level - 2].xpNext)) {
      current = step;
    }
  }
  return current;
}

function getShiftForPlayer(state, playerId) {
  const weekdayIndex = (state.day - 1) % 7;
  const schedule = WEEKLY_SHIFTS[playerId] || WEEKLY_SHIFTS.lena;
  return schedule[weekdayIndex]; // "early", "late", "free"
}

function getShiftLabel(shiftCode) {
  if (shiftCode === "early") return "🌅 Frühschicht (Morgen)";
  if (shiftCode === "late") return "🌇 Spätschicht (Nachmittag)";
  return "🎉 Freier Tag";
}

function boostBandMember(state, memberId, delta) {
  const m = state.band.members.find((x) => x.id === memberId);
  if (m) {
    m.bond = clamp(m.bond + delta, 0, 100);
  }
}

function getUpgradeCost(state, upgrade) {
  const micha = state.band.members.find((x) => x.id === "micha");
  const discount = micha && micha.bond >= 75 ? 0.85 : 1;
  return Math.round(upgrade.cost * discount);
}

function createInitialState() {
  return {
    version: 2,
    updatedAt: Date.now(),
    day: 1,
    seasonIndex: 0,
    weather: WEATHER_BY_SEASON.Frühling[0].label,
    weatherType: "sun",
    fuelPrice: 1.74,
    activePlayerId: "lena",
    activeDilemma: null,
    multiplayer: {
      householdCode: "LAUSITZ-1",
      bandCode: "BANDE-77",
      myRole: "both" // "lena", "tom", or "both"
    },
    household: {
      money: 2450,
      loanRemaining: 142000,
      houseCondition: 82,
      harmony: 80,
      fridge: 4,
      upgrades: [],
      achievements: ["🏡 Eigenheim-Schlüssel übergeben"],
      pets: [],
      children: []
    },
    band: {
      members: JSON.parse(JSON.stringify(BAND_DEFAULT_MEMBERS)),
      joinedFriends: []
    },
    players: {
      lena: {
        id: "lena",
        name: "Lena",
        avatar: "🧪",
        job: "Chemielaborantin · BASF Schwarzheide",
        xp: 25,
        energy: 86,
        mood: 78,
        fuel: 70,
        vacationDays: 28,
        phaseIndex: 0,
        workedToday: false,
        vacationToday: false,
        doneToday: false
      },
      tom: {
        id: "tom",
        name: "Tom",
        avatar: "🚁",
        job: "Gerätemechaniker · Fliegerhorst",
        xp: 25,
        energy: 86,
        mood: 78,
        fuel: 75,
        vacationDays: 30,
        phaseIndex: 0,
        workedToday: false,
        vacationToday: false,
        doneToday: false
      }
    },
    log: [
      "🏡 Willkommen in eurem Eigenheim! Plant euren Tag, achtet auf Schichten, Spritpreis & Kühlschrank."
    ]
  };
}

function getActionsForPlayer(state, player) {
  const phase = PHASES[player.phaseIndex];
  const shift = getShiftForPlayer(state, player.id);
  const career = getCareerInfo(player.id, player.xp);
  const maxFridge = state.household.upgrades.includes("kitchen") ? 8 : 6;
  const hasWorkshop = state.household.upgrades.includes("workshop");
  const hasTerrace = state.household.upgrades.includes("terrace");
  const hasFireplace = state.household.upgrades.includes("fireplace");
  const steffi = state.band.members.find((m) => m.id === "steffi");
  const lenaFuelUse = player.id === "lena" && steffi && steffi.bond >= 75 ? 10 : 15;

  const actions = [];

  // 1. ARBEIT & SCHICHT
  const isMyShiftPhase =
    (shift === "early" && phase === "Morgen") ||
    (shift === "late" && phase === "Nachmittag");

  if (phase === "Morgen" || phase === "Nachmittag") {
    if (shift !== "free" && !player.workedToday && !player.vacationToday) {
      const shiftBonus = shift === "late" ? 25 : 0;
      const totalPay = career.pay + shiftBonus;
      const fuelNeed = player.id === "lena" ? lenaFuelUse : 15;

      actions.push({
        id: "work",
        highlight: isMyShiftPhase,
        category: "Beruf",
        title:
          player.id === "lena"
            ? `🧪 ${shift === "late" ? "Spätschicht" : "Frühschicht"} BASF`
            : `🚁 ${shift === "late" ? "Spätdienst" : "Frühdienst"} Flugplatz`,
        desc: `+${totalPay} € · +18 XP · -26 Energie · -${fuelNeed} % Tank${isMyShiftPhase ? " (Pflichtschicht!)" : ""}`,
        disabled: player.fuel < fuelNeed || player.energy < 20,
        run: () => {
          player.energy = clamp(player.energy - 26, 0, 100);
          player.fuel = clamp(player.fuel - fuelNeed, 0, 100);
          player.mood = clamp(player.mood - 3, 0, 100);
          player.xp += 18;
          player.workedToday = true;
          state.household.money += totalPay;
          const newCareer = getCareerInfo(player.id, player.xp);
          player.job = `${newCareer.title} · ${newCareer.place}`;
          return `${player.name} hat die Schicht absolviert (+${totalPay} €, +18 XP).`;
        }
      });

      actions.push({
        id: "vacation",
        category: "Beruf",
        title: "🏖️ Urlaubstag einreichen",
        desc: `-1 Urlaubstag · Befreit heute von der Schicht · +18 Energie · +12 Zufriedenheit`,
        disabled: player.vacationDays <= 0,
        run: () => {
          player.vacationDays -= 1;
          player.vacationToday = true;
          player.energy = clamp(player.energy + 18, 0, 100);
          player.mood = clamp(player.mood + 12, 0, 100);
          return `${player.name} nimmt heute einen Urlaubstag und genießt die freie Zeit!`;
        }
      });
    } else if (shift === "free" || player.workedToday) {
      // Freiwillige Zusatzschicht / Bereitschaft
      actions.push({
        id: "overtime_shift",
        category: "Beruf",
        title: "💶 Freiwillige Zusatzschicht",
        desc: `+${career.pay + 45} € inkl. Zuschlag · +22 XP · -32 Energie · -15 % Tank`,
        disabled: player.fuel < 15 || player.energy < 32,
        run: () => {
          const pay = career.pay + 45;
          player.energy = clamp(player.energy - 32, 0, 100);
          player.fuel = clamp(player.fuel - 15, 0, 100);
          player.mood = clamp(player.mood - 6, 0, 100);
          player.xp += 22;
          player.workedToday = true;
          state.household.money += pay;
          return `${player.name} hat eine Zusatzschicht mit Zuschlag geschoben (+${pay} €)!`;
        }
      });
    }
  }

  // 2. TANKEN (dynamischer Literpreis!)
  const missingPercent = 100 - player.fuel;
  const litersNeeded = Math.max(5, Math.round((missingPercent / 100) * 50));
  const rawFuelCost = Math.round(litersNeeded * state.fuelPrice);
  const fuelCost = hasWorkshop ? Math.round(rawFuelCost * 0.8) : rawFuelCost;

  actions.push({
    id: "refuel",
    category: "Mobilität",
    title: `⛽ Volltanken (${state.fuelPrice.toFixed(2).replace(".", ",")} €/L)`,
    desc: `-${fuelCost} € für ${litersNeeded} L · Tank auf 100 % · -6 Energie`,
    disabled: player.fuel >= 95 || state.household.money < fuelCost,
    run: () => {
      state.household.money -= fuelCost;
      player.fuel = 100;
      player.energy = clamp(player.energy - 6, 0, 100);
      return `${player.name} hat ${litersNeeded} L für ${fuelCost} € vollgetankt.`;
    }
  });

  // 3. EINKAUFEN & VORRÄTE
  actions.push({
    id: "grocery",
    category: "Haushalt",
    title: "🛒 Wocheneinkauf erledigen",
    desc: `-45 € · +4 Portionen im Kühlschrank (aktuell ${state.household.fridge}/${maxFridge}) · -10 Energie`,
    disabled: state.household.money < 45 || state.household.fridge >= maxFridge,
    run: () => {
      state.household.money -= 45;
      state.household.fridge = clamp(state.household.fridge + 4, 0, maxFridge);
      player.energy = clamp(player.energy - 10, 0, 100);
      state.household.harmony = clamp(state.household.harmony + 3, 0, 100);
      return `${player.name} hat den Kühlschrank frisch aufgefüllt (${state.household.fridge}/${maxFridge} Portionen).`;
    }
  });

  // 4. KOCHEN (nutzt Kühlschrank-Vorräte, stärkt BEIDE Partner!)
  const cookBonus = state.household.upgrades.includes("kitchen") ? 8 : 0;
  actions.push({
    id: "cook_home",
    category: "Haushalt",
    title: "🍲 Frisch kochen für beide",
    desc: `-2 Vorräte (0 €) · +${16 + cookBonus} Energie & +${8 + cookBonus} Laune für Lena & Tom · +5 % Harmonie`,
    disabled: state.household.fridge < 2,
    run: () => {
      state.household.fridge -= 2;
      state.household.harmony = clamp(state.household.harmony + 5, 0, 100);
      state.household.houseCondition = clamp(state.household.houseCondition + 4, 0, 100);
      Object.values(state.players).forEach((p) => {
        p.energy = clamp(p.energy + 16 + cookBonus, 0, 100);
        p.mood = clamp(p.mood + 8 + cookBonus, 0, 100);
      });
      return `${player.name} hat für euch beide gekocht – lecker, günstig und gemütlich!`;
    }
  });

  // 5. WÄSCHE, PUTZEN & GARTEN
  actions.push({
    id: "chores",
    category: "Haushalt",
    title: "🧺 Wäsche, Haus & Ordnung",
    desc: "+15 % Haus-Zustand · +4 % Harmonie · -14 Energie",
    disabled: player.energy < 14,
    run: () => {
      state.household.houseCondition = clamp(state.household.houseCondition + 15, 0, 100);
      state.household.harmony = clamp(state.household.harmony + 4, 0, 100);
      player.energy = clamp(player.energy - 14, 0, 100);
      return `${player.name} hat Wäsche gewaschen und das Haus auf Vordermann gebracht.`;
    }
  });

  // 6. ABEND- & FREIZEIT-AKTIONEN
  if (phase === "Abend") {
    actions.push({
      id: "date_night",
      category: "Freizeit",
      title: "🍷 Essen gehen / Konzertabend",
      desc: "-85 € · +20 Zufriedenheit für beide · +10 % Harmonie",
      disabled: state.household.money < 85,
      run: () => {
        state.household.money -= 85;
        state.household.harmony = clamp(state.household.harmony + 10, 0, 100);
        Object.values(state.players).forEach((p) => {
          p.mood = clamp(p.mood + 20, 0, 100);
          p.energy = clamp(p.energy + 6, 0, 100);
        });
        return `${player.name} hat einen wunderschönen Abend zu zweit organisiert (-85 €)!`;
      }
    });

    if (hasTerrace) {
      actions.push({
        id: "bbq_band",
        category: "Bande",
        title: "🥩 Grillabend auf der Holzterrasse",
        desc: "-2 Vorräte · +16 Zufriedenheit · +8 % Harmonie · +8 Verbundenheit bei allen Freunden!",
        disabled: state.household.fridge < 2,
        run: () => {
          state.household.fridge -= 2;
          state.household.harmony = clamp(state.household.harmony + 8, 0, 100);
          state.band.members.forEach((m) => {
            m.bond = clamp(m.bond + 8, 0, 100);
          });
          Object.values(state.players).forEach((p) => {
            p.mood = clamp(p.mood + 16, 0, 100);
          });
          return "Legendärer Grillabend auf eurer Holzterrasse mit der ganzen Bande!";
        }
      });
    }

    if (hasFireplace) {
      actions.push({
        id: "fireplace_evening",
        category: "Freizeit",
        title: "🔥 Kaminabend zu zweit",
        desc: "0 € · +22 Energie & +14 Zufriedenheit für beide · +8 % Harmonie",
        disabled: false,
        run: () => {
          state.household.harmony = clamp(state.household.harmony + 8, 0, 100);
          Object.values(state.players).forEach((p) => {
            p.energy = clamp(p.energy + 22, 0, 100);
            p.mood = clamp(p.mood + 14, 0, 100);
          });
          return "Knisterndes Feuer im Kaminofen – pure Entspannung für euch beide!";
        }
      });
    }
  }

  // 7. AUSRUHEN / POWER-NAP
  actions.push({
    id: "rest",
    category: "Erholung",
    title: "🛋️ Entspannen & Kraft tanken",
    desc: "+24 Energie · +7 Zufriedenheit",
    disabled: false,
    run: () => {
      player.energy = clamp(player.energy + 24, 0, 100);
      player.mood = clamp(player.mood + 7, 0, 100);
      return `${player.name} gönnt sich eine wohlverdiente Pause.`;
    }
  });

  return actions;
}

function maybeTriggerDilemma(state) {
  if (state.activeDilemma) return;
  // Ca. 35 % Chance beim Phasenwechsel auf ein Alltags-Dilemma
  if (Math.random() < 0.35) {
    const pick = DILEMMAS[Math.floor(Math.random() * DILEMMAS.length)];
    state.activeDilemma = pick.id;
  }
}

function resolveDilemma(state, choiceIndex) {
  if (!state.activeDilemma) return;
  const dilemma = DILEMMAS.find((d) => d.id === state.activeDilemma);
  state.activeDilemma = null;
  if (!dilemma || !dilemma.choices[choiceIndex]) return;

  const msg = dilemma.choices[choiceIndex].apply(state);
  state.log.unshift(`⚡ Entscheidung (${dilemma.title}): ${msg}`);
  checkAchievements(state);
  state.updatedAt = Date.now();
}

function buyHouseUpgrade(state, upgradeId) {
  if (state.household.upgrades.includes(upgradeId)) return false;
  const up = HOUSE_UPGRADES.find((u) => u.id === upgradeId);
  if (!up) return false;
  const cost = getUpgradeCost(state, up);
  if (state.household.money < cost) return false;

  state.household.money -= cost;
  state.household.upgrades.push(upgradeId);
  state.household.harmony = clamp(state.household.harmony + 6, 0, 100);
  state.household.houseCondition = clamp(state.household.houseCondition + 10, 0, 100);
  Object.values(state.players).forEach((p) => {
    p.mood = clamp(p.mood + 12, 0, 100);
  });

  state.log.unshift(`🔨 Haus-Ausbau fertig: ${up.name} für ${cost} € gebaut!`);
  checkAchievements(state);
  state.updatedAt = Date.now();
  return true;
}

function interactWithBand(state, memberId) {
  const member = state.band.members.find((m) => m.id === memberId);
  const player = state.players[state.activePlayerId];
  if (!member || !player || player.energy < 10) return false;

  player.energy = clamp(player.energy - 10, 0, 100);
  player.mood = clamp(player.mood + 10, 0, 100);
  member.bond = clamp(member.bond + 10, 0, 100);
  state.household.harmony = clamp(state.household.harmony + 3, 0, 100);

  state.log.unshift(`🤝 ${player.name} hat Zeit mit ${member.name} verbracht (+10 % Verbundenheit).`);
  checkAchievements(state);
  state.updatedAt = Date.now();
  return true;
}

function makeLoanPayment(state, amount) {
  if (state.household.money < amount || state.household.loanRemaining <= 0) return false;
  const actual = Math.min(amount, state.household.loanRemaining);
  state.household.money -= actual;
  state.household.loanRemaining -= actual;
  state.household.harmony = clamp(state.household.harmony + 4, 0, 100);
  state.log.unshift(`🏦 Sondertilgung: ${actual} € vom Hauskredit abbezahlt!`);
  checkAchievements(state);
  state.updatedAt = Date.now();
  return true;
}

function checkAchievements(state) {
  const list = state.household.achievements;
  const add = (badge) => {
    if (!list.includes(badge)) {
      list.push(badge);
      state.log.unshift(`🏆 Meilenstein erreicht: ${badge}!`);
    }
  };

  if (state.household.upgrades.length >= 1) add("🔨 Erster Haus-Ausbau");
  if (state.household.upgrades.length >= 4) add("🏰 Traumhaus in der Lausitz");
  if (state.household.money >= 4000) add("💰 Finanzpolster > 4.000 €");
  if (state.household.harmony >= 95) add("❤️ Traumpaar (95 %+ Harmonie)");
  if (state.players.lena.xp >= 90 || state.players.tom.xp >= 90) add("📈 Erste Beförderung");
  if (state.band.members.every((m) => m.bond >= 80)) add("🍻 Legendäre Familie-&-Freunde-Bande");
}

function performAction(state, playerId, actionId) {
  const player = state.players[playerId];
  if (!player || player.doneToday) return;

  const action = getActionsForPlayer(state, player).find((a) => a.id === actionId);
  if (!action || action.disabled) return;

  const weekday = WEEKDAYS[(state.day - 1) % 7];
  const message = action.run();
  state.log.unshift(`${weekday}, ${PHASES[player.phaseIndex]}: ${message}`);

  // Spritpreis schwankt leicht je nach Tageszeit
  const jitter = (Math.random() - 0.48) * 0.08;
  state.fuelPrice = Math.max(1.56, Math.min(1.96, Number((state.fuelPrice + jitter).toFixed(2))));

  if (player.phaseIndex < PHASES.length - 1) {
    player.phaseIndex += 1;
    maybeTriggerDilemma(state);
  } else {
    player.doneToday = true;
  }

  checkAchievements(state);
  state.updatedAt = Date.now();
}

function advanceDay(state) {
  const season = SEASONS[state.seasonIndex];
  const isWinterOrAutumn = season === "Winter" || season === "Herbst";

  // Prüfen, ob jemand seine Pflichtschicht geschwänzt hat
  Object.values(state.players).forEach((p) => {
    const shift = getShiftForPlayer(state, p.id);
    if (shift !== "free" && !p.workedToday && !p.vacationToday) {
      state.household.harmony = clamp(state.household.harmony - 8, 0, 100);
      p.mood = clamp(p.mood - 10, 0, 100);
      state.log.unshift(`⚠️ ${p.name} hat heute die Schicht ohne Urlaubstag verpasst (-8 % Harmonie)!`);
    }
  });

  // Fixkosten berechnen (mit Boni durch Kaminofen & PV-Anlage)
  let dailyFixedCost = isWinterOrAutumn ? 58 : 42;
  if (isWinterOrAutumn && state.household.upgrades.includes("fireplace")) {
    dailyFixedCost -= 15;
  }
  if (state.household.upgrades.includes("pv")) {
    dailyFixedCost -= 14;
  }

  state.household.money -= dailyFixedCost;
  state.household.houseCondition = clamp(state.household.houseCondition - 7, 0, 100);

  // Wenn das Haus sehr unordentlich ist, leidet die Harmonie
  if (state.household.houseCondition < 40) {
    state.household.harmony = clamp(state.household.harmony - 5, 0, 100);
  }

  // Garten-Upgrade liefert alle 2 Tage frisches Gemüse
  const maxFridge = state.household.upgrades.includes("kitchen") ? 8 : 6;
  if (state.household.upgrades.includes("garden") && state.day % 2 === 0) {
    state.household.fridge = clamp(state.household.fridge + 1, 0, maxFridge);
  }

  // Oma & Opa Sonntags-Bonus ab 80 % Verbundenheit
  const oma = state.band.members.find((m) => m.id === "oma_opa");
  if ((state.day % 7 === 0) && oma && oma.bond >= 80) {
    state.household.fridge = clamp(state.household.fridge + 2, 0, maxFridge);
    state.log.unshift("🍰 Sonntags-Überraschung: Oma Erna hat frischen Kuchen vorbeigebracht (+2 Vorräte)!");
  }

  // Wöchentliche Hauskredit-Rate am Sonntag
  if (state.day % 7 === 0 && state.household.loanRemaining > 0) {
    const weeklyRate = 250;
    state.household.money -= weeklyRate;
    state.household.loanRemaining = Math.max(0, state.household.loanRemaining - weeklyRate);
    state.log.unshift(`🏦 Wochen-Tilgung: -${weeklyRate} € für euren Hauskredit (Restschuld: ${state.household.loanRemaining.toLocaleString("de-DE")} €).`);
  }

  Object.values(state.players).forEach((p) => {
    p.energy = clamp(p.energy + 30, 0, 100);
    p.phaseIndex = 0;
    p.workedToday = false;
    p.vacationToday = false;
    p.doneToday = false;
  });

  state.day += 1;
  if ((state.day - 1) % 7 === 0) {
    state.seasonIndex = (state.seasonIndex + 1) % SEASONS.length;
  }

  const nextSeason = SEASONS[state.seasonIndex];
  const options = WEATHER_BY_SEASON[nextSeason];
  const pickedWeather = options[Math.floor(Math.random() * options.length)];
  state.weather = pickedWeather.label;
  state.weatherType = pickedWeather.type;

  const nextWeekday = WEEKDAYS[(state.day - 1) % 7];
  state.log.unshift(
    `🌙 Tageswechsel (Fixkosten -${dailyFixedCost} €) → Tag ${state.day} (${nextWeekday}, ${nextSeason}, ${state.weather}).`
  );
  checkAchievements(state);
  state.updatedAt = Date.now();
}
