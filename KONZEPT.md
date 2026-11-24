# Projektkonzept: CoLife

> **Titel:** *CoLife* (Cooperative Life – Family Planner & Life Simulator)

## 1. Kernidee
Eine **gemütliche, rundenbasierte Private-Circle-Lebenssimulation** (text- und kartenbasiert, später grafisch erweiterbar) für **iOS & Android als PWA** (später über Capacitor als echte Store-Apps auslieferbar).

Es gibt **kein öffentliches MMO** mit fremden Spielern. Stattdessen gründet man seine eigene kleine Welt und lädt **Partner, Familie und enge Freunde per Code** ein. Gemeinsam meistert man den echten Alltag: Arbeit, Schichtdienst, Pendeln & Tanken, Haushalt, Finanzen und schöne gemeinsame Erlebnisse.

---

## 2. Die zwei Kreise (Einladungs-System)
- **Haushalts-Code (Zusammenleben):**
  Für Menschen, die sich ein Zuhause teilen (z. B. ein Paar). Sie teilen sich Haus/Wohnung, laufende Fixkosten, Einkäufe, Haushaltsaufgaben und optional eine gemeinsame Haushaltskasse.
- **Bande-Code (Familie & Freunde):**
  Für Verwandte und enge Freunde. Sie haben ihren eigenen Haushalt, sind aber Teil derselben Welt: Man kann sich besuchen, gemeinsam Konzerte/Restaurants besuchen, zusammen grillen, sich beim Hausbau helfen oder kleine Gefallen tauschen.

---

## 3. Spielprinzip & Rundenablauf
- **Gemütlich rundenbasiert:** 1 Spieltag = 1 Runde, aufgeteilt in **3 Phasen**:
  1. **Morgen**
  2. **Nachmittag**
  3. **Abend**
- Jeder Spieler hat pro Phase begrenzte **Zeit- und Energiepunkte**.
- **Abstimmung im Alltag:** Wenn *Person A* Spätschicht hat, übernimmt *Person B* Einkauf, Tanken oder Kochen – oder man bestellt etwas (spart Zeit/Energie, kostet aber mehr Geld).
- Sobald alle Spieler im Haushalt ihren Tag bestätigt haben, wird der Tag abgerechnet (Gehalt/Schichtzuschläge, Spritverbrauch, Fixkosten, Zufriedenheit, Beziehungswert) und der nächste Tag beginnt.

---

## 4. Berufe, Alltag & Finanzen (Beispiel-Setting)
- **Realitätsnahe Berufe** mit eigenen Ereignissen, Schichtplänen und Entscheidungen:
  - *Beispiel 1:* Chemielaborantin (z. B. BASF Schwarzheide) – Proben analysieren, Schichtdienst, Sicherheitsprotokolle, Überstunden vs. Feierabend.
  - *Beispiel 2:* Hubschraubermechaniker (z. B. Bundeswehr-Flugplatz) – Wartungschecks, Ersatzteile, Bereitschaftsdienst.
- **Mobilität & Tanken:** Arbeitswege kosten Zeit und Kraftstoff. Tanken wird zur bewussten Entscheidung (wann und zu welchem Preis?).
- **Haus & Haushalt:** Kredit/Miete, Strom, Heizung, Wäsche waschen, Kochen, Einkaufen, Reparaturen & Ausbau (z. B. Terrasse, neues Sofa).
- **Freizeit & Erlebnisse:** Konzerte, Essen gehen, Kino, Ausflüge mit Freunden/Familie – kostet Geld, lädt aber Energie, Zufriedenheit und Beziehungs-Level auf.

---

## 5. Technik-Stack & Erweiterbarkeit
- **Phase 1 (Start):** **PWA (Progressive Web App)** mit HTML5, CSS & JavaScript (saubere Trennung von Spiellogik und UI). Läuft sofort auf iPhone & Android über „Zum Home-Bildschirm hinzufügen“ – ohne App-Store-Hürden und ohne Mac.
- **Multiplayer-Backend:** Leichtgewichtiges Cloud-Backend (z. B. Supabase oder Firebase) für Runden-Sync, Haushalts-/Bande-Codes und Push-Hinweise.
- **Phase 2 (Später optional):**
  - Grafische Aufwertung (Illustrationen, Avatare, 2D-Hausansicht) auf Basis derselben Spiellogik.
  - Paketierung als echte **Android- & iOS-Store-App** via **Capacitor** (ohne Neuentwicklung).

---

## 6. Spielmechanik & Werte-System

### Pro Person
- **Zeit (3 Slots/Tag):** Morgen, Nachmittag, Abend (Aktionen belegen 1–2 Slots).
- **Energie (0–100):** Arbeit & Haushalt kosten Energie; Schlafen, Essen & Freizeit laden sie auf.
- **Zufriedenheit (0–100):** Sinkt bei Dauerstress, steigt durch Freizeit, Konzerte & gemeinsame Zeit.
- **Tank (0–100 %):** Pendeln verbraucht Kraftstoff; Tanken kostet Geld & Zeit.
- **Urlaubstage (Variable):** Jeder Beruf hat ein Jahreskontingent an Urlaubstagen, die frei für Erholung, Ausflüge oder Hausprojekte genommen werden können.

### Pro Haushalt
- **Haushaltskasse (€):** Gehälter (inkl. Schichtzuschläge) minus Fixkosten (Kredit, Strom, Heizung), Einkäufe, Tanken und Freizeit.
- **Haus-Zustand / Ordnung (0–100 %):** Sinkt täglich leicht; wird durch Wäsche, Kochen, Putzen & Reparaturen gehalten.
- **Haushalts-Harmonie & Bande-Level:** Steigen durch gemeinsame Aktionen, faire Aufgabenverteilung und Treffen mit Familie/Freunden.

### Welt & Erweiterungs-Slots
- **Wetter & Jahreszeiten:** Frühling, Sommer, Herbst, Winter mit passendem Wetter. Beeinflusst z. B. Heizkosten, Garten/Hausarbeit, Outdoor-Events (Grillen, Konzerte) und den Arbeitsweg (z. B. Schnee/Glatteis).
- **Reserviert für später:** **Haustiere** und **Kinder** (als optionale Haushaltsmitglieder im Datenmodell vorsehen, aber erst in einer späteren Ausbaustufe aktivieren).
