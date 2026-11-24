// CoLife v2.0 – Persistenz & Multiplayer-Sync (LocalStorage + Live-P2P Raumcode + 1-Tap Share-Link + Cloud-Hook)

const STORAGE_KEY = "colife_save_v2";
const CLOUD_CFG_KEY = "colife_cloud_cfg_v2";

const CoLifeSync = {
  peer: null,
  conn: null,
  status: "offline", // "offline", "connecting", "hosting", "connected"
  statusText: "Lokal gespeichert (Bereit für Live-Kopplung)",
  onStateReceived: null,
  onStatusChanged: null,

  saveLocal(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Local save failed:", e);
    }
  },

  loadLocal() {
    try {
      // 1. Prüfen, ob ein Sync-Link (?sync=...) geöffnet wurde
      const params = new URLSearchParams(window.location.search);
      const syncPayload = params.get("sync");
      if (syncPayload) {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(syncPayload))));
        if (decoded && decoded.players && decoded.household) {
          window.history.replaceState({}, document.title, window.location.pathname);
          this.saveLocal(decoded);
          return decoded;
        }
      }

      // 2. Sonst aus LocalStorage laden
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.players || !parsed.band) return null;
      return parsed;
    } catch (e) {
      console.warn("Load local failed:", e);
      return null;
    }
  },

  setStatus(status, text) {
    this.status = status;
    this.statusText = text;
    if (typeof this.onStatusChanged === "function") {
      this.onStatusChanged(status, text);
    }
  },

  // Erzeugt einen 1-Tap-Link zum Teilen per WhatsApp / Signal / iMessage
  createShareUrl(state) {
    const compact = JSON.parse(JSON.stringify(state));
    compact.log = (compact.log || []).slice(0, 8);
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
    const base = window.location.origin + window.location.pathname;
    return `${base}?sync=${encodeURIComponent(encoded)}`;
  },

  async shareStateWithPartner(state) {
    const url = this.createShareUrl(state);
    const shareText = `🏡 CoLife Update (Tag ${state.day}, Haushalt ${state.multiplayer.householdCode}): Ich habe meinen Zug gemacht! Öffne den Link zum Synchronisieren:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `CoLife · Tag ${state.day}`,
          text: shareText,
          url
        });
        return { ok: true, method: "native" };
      } catch (err) {
        // Nutzer hat abgebrochen oder Fallback
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(`${shareText} ${url}`);
      return { ok: true, method: "clipboard" };
    }
    return { ok: false, url };
  },

  // Live-Raum per Haushalts-Code (WebRTC via PeerJS, komplett ohne eigene Server-Einrichtung!)
  connectLiveRoom(householdCode, currentStateGetter) {
    const cleanCode = (householdCode || "LAUSITZ-1")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "");

    if (typeof Peer === "undefined") {
      this.setStatus("offline", "Offline-Modus (Live-Kopplung braucht Internet)");
      return;
    }

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
      this.conn = null;
    }

    const hostId = `colife-v2-room-${cleanCode.toLowerCase()}-host`;
    this.setStatus("connecting", `Verbinde Haushalt "${cleanCode}" …`);

    // Versuche zuerst als Host für diesen Haushalts-Code zu starten
    const peer = new Peer(hostId);
    this.peer = peer;

    peer.on("open", () => {
      this.setStatus("hosting", `🟢 Haushalt "${cleanCode}" aktiv – warte auf Partner-Handy`);
    });

    peer.on("connection", (connection) => {
      this.setupConnection(connection, cleanCode, currentStateGetter, true);
    });

    peer.on("error", (err) => {
      // Falls Host-ID schon vom Partner-Handy belegt ist -> automatisch als Partner verbinden!
      if (err && err.type === "unavailable-id") {
        this.joinAsGuest(cleanCode, hostId, currentStateGetter);
      } else {
        this.setStatus("offline", `Verbindung Hinweis: ${err.type || "Lokal aktiv"}`);
      }
    });
  },

  joinAsGuest(cleanCode, hostId, currentStateGetter) {
    const guestPeer = new Peer();
    this.peer = guestPeer;

    guestPeer.on("open", () => {
      const conn = guestPeer.connect(hostId, { reliable: true });
      this.setupConnection(conn, cleanCode, currentStateGetter, false);
    });

    guestPeer.on("error", () => {
      this.setStatus("offline", `Partner unter "${cleanCode}" aktuell nicht gleichzeitig online`);
    });
  },

  setupConnection(connection, cleanCode, currentStateGetter, isHost) {
    this.conn = connection;

    connection.on("open", () => {
      this.setStatus("connected", `🟢 LIVE verbunden mit Partner (${cleanCode})!`);
      const current = currentStateGetter();
      if (current) {
        connection.send({ type: "SYNC_STATE", state: current, isHost });
      }
    });

    connection.on("data", (msg) => {
      if (msg && msg.type === "SYNC_STATE" && msg.state) {
        if (typeof this.onStateReceived === "function") {
          this.onStateReceived(msg.state);
        }
      }
    });

    connection.on("close", () => {
      this.setStatus("hosting", `🟡 Partner hat die App geschlossen (${cleanCode})`);
    });
  },

  broadcastState(state) {
    this.saveLocal(state);
    if (this.conn && this.conn.open) {
      try {
        this.conn.send({ type: "SYNC_STATE", state });
      } catch (e) {
        console.warn("Broadcast error:", e);
      }
    }
    this.pushCloudIfConfigured(state);
  },

  // Optionale 24/7 Cloud-Synchronisierung (z. B. eigener kostenloser Supabase/Firebase REST-Endpunkt)
  getCloudConfig() {
    try {
      return JSON.parse(localStorage.getItem(CLOUD_CFG_KEY) || "null");
    } catch (e) {
      return null;
    }
  },

  saveCloudConfig(url, apiKey) {
    localStorage.setItem(CLOUD_CFG_KEY, JSON.stringify({ url: url.trim(), apiKey: (apiKey || "").trim() }));
  },

  async pushCloudIfConfigured(state) {
    const cfg = this.getCloudConfig();
    if (!cfg || !cfg.url) return;
    try {
      const room = state.multiplayer.householdCode || "LAUSITZ-1";
      await fetch(`${cfg.url.replace(/\/$/, "")}/${encodeURIComponent(room)}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(cfg.apiKey ? { apikey: cfg.apiKey, Authorization: `Bearer ${cfg.apiKey}` } : {})
        },
        body: JSON.stringify(state)
      });
    } catch (e) {
      console.warn("Cloud push skipped:", e);
    }
  },

  async pullCloudIfConfigured(householdCode) {
    const cfg = this.getCloudConfig();
    if (!cfg || !cfg.url) return null;
    try {
      const room = householdCode || "LAUSITZ-1";
      const res = await fetch(`${cfg.url.replace(/\/$/, "")}/${encodeURIComponent(room)}.json`, {
        headers: cfg.apiKey ? { apikey: cfg.apiKey, Authorization: `Bearer ${cfg.apiKey}` } : {}
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.players && data.household) return data;
      return null;
    } catch (e) {
      return null;
    }
  }
};
