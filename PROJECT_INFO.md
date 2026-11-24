# PROJECT_INFO – CoLife (Family Planner & Life Simulator)

Diese Datei beschreibt das Projekt so, dass ein KI-Coding-Assistent (zum Beispiel Google Antigravity) es ohne weiteres Gespräch verstehen, erweitern, testen und veröffentlichen kann.

## Zweck

**CoLife** ist eine rundenbasierte **Private-Circle-Lebenssimulation & Alltagsplaner-App** als **Progressive Web App (PWA)** für iOS und Android (später optional via Capacitor als native Store-App).
Spieler leben in einem gemeinsamen Haushalt (Start-Setting: **Lena**, Chemielaborantin bei der BASF in Schwarzheide, und **Tom**, Hubschrauber-/Gerätemechaniker auf dem Bundeswehr-Flugplatz) und meistern ihren Alltag: Schichtdienst, Pendeln & Tanken bei schwankenden Spritpreisen, Einkaufen, Kochen, Haushalt, Haus-Ausbau, Zufalls-Dilemmas sowie Unternehmungen mit der **Familie-&-Freunde-Bande** (Konzerte, Grillabende, Ausflüge, Nachbarschaftshilfe).

## Funktionen (Stand v4.0)

- **3 Umschaltbare Live-Grafik-Bühnen (SVG/CSS-Diorama):**
  1. **🏡 Außen-Panorama (`exterior`):** Eigenheim, Carport mit Autos, Garten, Holzterrasse, animierte Figuren von Lena & Tom vor dem Haus, fliegender Hubschrauber am Fliegerhorst, rauchender Schornstein & BASF-Werk, Wetter-Animationen und Haustiere.
  2. **🛋️ Haus-Innenansicht (`interior` – Puppenhaus-Querschnitt):** 3 detaillierte Zimmer (Küche mit sichtbarem Kühlschrank-Füllstand & dampfendem Kochtopf, Wohnzimmer mit Sofa, Lena & Tom, Kaminfeuer & Unordnungs-Indikator, Hauswirtschaftsraum mit Waschmaschine, PV-Wechselrichter & Werkzeug).
  3. **🗺️ Lausitz-Regionskarte (`map`):** Illustrierte Umgebungskarte (BASF Schwarzheide, Fliegerhorst, Eigenheim, Tankstelle/Supermarkt, Senftenberger See) mit animierten **Live-Standort-Pins (`🧪 Lena`, `🚁 Tom`)**.
- **Animierte Charakter-Porträts & Konfetti-Partikel:**
  - Dynamische SVG-Porträts (`buildCharacterAvatarSVG`) für Lena (mit Schutzbrille) und Tom (mit Headset), deren Gesichtsausdruck live auf Laune und Energie reagiert.
  - Konfetti-Regen (`spawnConfetti`), schwebende Belohnungs-Popups (`spawnFloatingFX`) und WebAudio-Synthesizer (`CoLifeAudio`).
- **Neue Spielabläufe: Schicht-Minispiel, Teamwork-Kombos, 7-Tage-Planer & Wochen-Bilanz:**
  - **🎮 Berufs-Timing-Minispiel:** Bei der Fokus-Schicht (*Präzisions-Titration* im BASF-Labor bzw. *Rotor-Drehmoment* am Fliegerhorst) stoppt der Spieler einen schwingenden Balken im goldenen Bereich für bis zu 1,3x Meister-Prämie.
  - **⚡ Paar-Teamwork-Kombos:** Automatische Synergie-Boni (+Harmonie, +Energie, +Geld), wenn Lena & Tom ihre Tagesaufgaben geschickt aufteilen (z. B. *Einer kauft ein + einer kocht*, *Haushalt + Tanken*, *Power-Paar beide Schichten*).
  - **📅 7-Tage-Schichtplaner (Mo–So):** Übersichtsleiste für die ganze Woche.
  - **📊 Sonntags-Wochenbilanz:** Abrechnungs-Modal am Ende jeder Woche mit Einnahmen, Ausgaben, Teamwork-Kombos, Note (**S★ / A / B**) und Wochen-Bonus.
- **Wochen-Missionen (Couple Quests) & Kühlschrank-Notiz:**
  - Jede Woche 3 gemeinsame Paar-Missionen (`WEEKLY_QUEST_POOL`) mit Fortschrittsbalken und abholbaren Geld-/Harmonie-Prämien.
  - Editierbare **Kühlschrank-Notiz (`fridgeNote`)**, mit der sich Partner Nachrichten direkt auf den Startbildschirm pinnen können (wird per Multiplayer mitsynchronisiert).
- **Haustiere & Kurzurlaube (`LIFE_SPECIALS`):**
  - Hofhund „Balu“ (schaltet Gassi-Runden frei & gibt täglichen Laune-Bonus) und Hauskatze „Mimi“ (+2 % tägliche Harmonie).
  - Buchbare Kurzurlaube (Spreewald-Kahnfahrt, Ostsee-Wochenende) zum sofortigen Aufladen von Energie, Laune & Harmonie.
- **Wochen- & Schicht-Rhythmus (Mo–So):**
  - 3 Phasen pro Tag (Morgen, Nachmittag, Abend).
  - Echte Schichtpläne (Frühschicht, Spätschicht, freier Tag) plus optionale **Präzisions-/Fokus-Schicht** mit Leistungsprämie und Karriere-Aufstieg (Level 1–4).
  - Dynamische Benzinpreise (€/Liter) und Kühlschrank-Vorräte.
- **Alltags-Dilemmas & Ereigniskarten:**
  - Interaktive Entscheidungskarten mit mehreren Optionen und direkten Auswirkungen auf Geld, Energie, Harmonie, Karriere und Haus.
- **Haus-Ausbau & Lebensziele:**
  - Freischaltbare Upgrades für das Eigenheim mit dauerhaften Gameplay-Boni (z. B. Kaminofen senkt Winter-Fixkosten, Werkstatt spart Auto-/Reparaturkosten, Terrasse schaltet Bande-Grillabende frei).
- **Familie & Freunde-Bande:**
  - Soziale Kontakte pflegen, Freunde/Familie per Bande-Code einladen, gemeinsame Wochenend-Events, Nachbarschaftshilfe beim Hausbau.
- **Multiplayer & Synchronisierung (`sync.js`):**
  - **Haushalts-Code (`HAUS-XXXX`)** für Partner im selben Haus und **Bande-Code (`BANDE-XXXX`)** für Familie & Freunde.
  - Unterstützt direktes **Smartphone-zu-Smartphone Live-Pairing (WebRTC / PeerJS)** ohne Server-Setup, **1-Tap Sync-Link (z. B. per WhatsApp)** für asynchrones Spielen sowie optionale **Supabase Cloud-DB**-Anbindung.
- **Offline-Fähigkeit:**
  - Service Worker (`sw.js`) + `localStorage`-Persistenz.

## Architektur und Dateistruktur

Reine, modulare Web-App (HTML5, CSS3, Vanilla JS) ohne Build-Step – wird direkt über GitHub Pages (`https://rancher0.github.io/colife-pwa/`) ausgeliefert. Spiellogik, Synchronisierung und Darstellung sind strikt getrennt.

```
./
  PROJECT_INFO.md           Diese Datei (Schnellreferenz für KI-Modelle & Entwickler)
  KONZEPT.md                Game-Design-Konzept und Ideen-Sammlung
  manifest.json             PWA-Manifest für iOS/Android Homescreen-Installation
  sw.js                     Service Worker für Offline-Caching (bei Updates CACHE_NAME erhöhen!)
  index.html                App-Shell, Navigation, Modals, Live-Diorama-Container
  style.css                 Mobile-first UI-Design, Animationen, Wetter- & Tageszeit-Themes
  logic.js                  Reine Spiellogik: Berufe, Schichten, Dilemmas, Upgrades, Bande, Wochenlauf
  sync.js                   Multiplayer-Sync (WebRTC/PeerJS Live-Raum, Share-Link-Sync, Supabase-Hook)
  app.js                    UI-Rendering, interaktives Haus-Diorama (SVG), Event-Handler, Sound/Haptik
```

## Deployment & Updates

- **Repository:** `https://github.com/Rancher0/colife-pwa` (lokal unter `F:\KI\Antigravity\scratch\alltagsbande`)
- **Live-URL (GitHub Pages):** `https://rancher0.github.io/colife-pwa/`
- **Wichtig bei jedem Update:** In `sw.js` die Konstante `CACHE_NAME` (z. B. `colife-v2`, `colife-v3` usw.) hochzählen, damit Smartphones mit bestehender Homescreen-Verknüpfung das Update automatisch ziehen.
