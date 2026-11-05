/* Motorvärmare Lovelace card. No external dependencies. */
const MV_DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
const mvEscape = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mvUsable = (s) => s && !["unknown", "unavailable"].includes(s.state);

class MotorvarmareCard extends HTMLElement {
  constructor() {
    super(); this.attachShadow({mode:"open"}); this._config = {}; this._showWeek = false; this._draft = null; this._pending = false;
    this.shadowRoot.addEventListener("focusout", () => setTimeout(() => {
      const focused = this.shadowRoot.activeElement;
      if (this._refreshAfterFocus && (!focused || !["INPUT", "SELECT"].includes(focused.tagName))) {
        this._refreshAfterFocus = false; this._render();
      }
    }, 0));
  }
  static getConfigElement() { return document.createElement("motorvarmare-card-editor"); }
  static getStubConfig() { return {title:"Motorvärmare"}; }
  getCardSize() { return this._showWeek ? 8 : 4; }
  getGridOptions() { return {columns:6, min_columns:3, rows:"auto"}; }
  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Ogiltig konfiguration");
    if (this._config.status_entity !== config.status_entity) this._draft = null;
    this._config = {...config}; this._render();
  }
  set hass(value) {
    this._hass = value;
    // Keep typed but unsaved values intact during unrelated HA updates.
    const focused = this.shadowRoot.activeElement;
    if (!focused || !["INPUT", "SELECT"].includes(focused.tagName)) this._render();
    else this._refreshAfterFocus = true;
  }
  _entities() {
    const auto = this._hass?.states?.[this._config.status_entity]?.attributes?.control_entities || {};
    return {
      manual_entity:auto.manual_departure,
      clear_entity:auto.clear_departure,
      switch_entity:auto.heater_switch,
      weekly:MV_DAYS.map((_, i) => ({time:auto.weekly_times?.[i], enabled:auto.weekly_enabled?.[i]})),
    };
  }
  _timeZone() { return this._hass?.config?.time_zone || undefined; }
  _date(value) {
    if (!value) return "–";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "–";
    return new Intl.DateTimeFormat("sv-SE", {timeZone:this._timeZone(), weekday:"short", day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"}).format(date);
  }
  _inputDate(value) {
    if (!value || ["unknown", "unavailable"].includes(value)) return "";
    const date = new Date(value); if (Number.isNaN(date.getTime())) return "";
    const p = Object.fromEntries(new Intl.DateTimeFormat("sv-SE", {timeZone:this._timeZone(), year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23"}).formatToParts(date).filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  }
  async _call(domain, service, data) {
    if (this._pending) return false;
    this._pending = true; this._actionError = null;
    this._render();
    let ok = false;
    try { await this._hass.callService(domain, service, data); ok = true; }
    catch (err) { this._actionError = err?.message || "Kunde inte utföra åtgärden"; }
    finally { this._pending = false; this._render(); }
    return ok;
  }
  _render() {
    if (!this.shadowRoot) return;
    const h = this._hass, cfg = this._config;
    if (!h) { this.shadowRoot.innerHTML = ""; return; }
    const status = h.states[cfg.status_entity];
    if (!cfg.status_entity || !status) {
      this.shadowRoot.innerHTML = `<ha-card><div style="padding:20px">Välj bilens statusentitet i kortets inställningar.</div></ha-card>`;
      return;
    }
    const e = this._entities(), a = status.attributes || {}, manual = h.states[e.manual_entity];
    const sw = h.states[e.switch_entity];
    const statusText = mvUsable(status) ? status.state : "Status otillgänglig";
    const heating = sw?.state === "on" ? "På" : sw?.state === "off" ? "Av" : "Okänd";
    const title = cfg.title || status.attributes?.friendly_name?.replace(/\s+status$/i, "") || "Motorvärmare";
    const temperature = typeof a.temperature === "number" && Number.isFinite(a.temperature) ? `${new Intl.NumberFormat("sv-SE", {maximumFractionDigits:1}).format(a.temperature)} °C` : "–";
    const weekRows = e.weekly.map((day, i) => {
      const t = h.states[day.time], s = h.states[day.enabled];
      const availableTime = mvUsable(t), availableSwitch = mvUsable(s) && ["on","off"].includes(s.state);
      return `<div class="day"><span>${MV_DAYS[i]}</span><input aria-label="${MV_DAYS[i]} avresetid" type="time" data-day-time="${i}" value="${availableTime ? mvEscape(t.state.slice(0,5)) : ""}" ${!availableTime || this._pending ? "disabled" : ""}><label class="day-toggle"><input aria-label="Aktivera ${MV_DAYS[i]}" type="checkbox" data-day-switch="${i}" ${s?.state === "on" ? "checked" : ""} ${!availableSwitch || this._pending ? "disabled" : ""}><span>${availableSwitch ? (s.state === "on" ? "På" : "Av") : "Ej tillgänglig"}</span></label></div>`;
    }).join("");
    const manualOk = manual && manual.state !== "unavailable";
    const clear = h.states[e.clear_entity];
    const clearOk = clear && clear.state !== "unavailable";
    const inputValue = this._draft === null ? this._inputDate(manual?.state) : this._draft;
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;color:var(--primary-text-color);font-family:var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif)} *{box-sizing:border-box} ha-card{overflow:hidden} .wrap{padding:20px} .head{display:flex;gap:12px;align-items:center;margin-bottom:20px} .icon{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:rgba(var(--rgb-primary-color,3,169,244),.12);color:var(--primary-color)} ha-icon{--mdc-icon-size:22px}.headtext{flex:1;min-width:0}.title{font-size:18px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status{font-size:13px;color:var(--secondary-text-color);margin-top:2px}.badge{font-size:12px;font-weight:600;padding:6px 10px;border-radius:20px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}.badge.on{background:rgba(var(--rgb-success-color,67,160,71),.14);color:var(--success-color,#278748)} .stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 16px;padding:16px 0;border-top:1px solid var(--divider-color);border-bottom:1px solid var(--divider-color)} .label{font-size:12px;color:var(--secondary-text-color);margin-bottom:3px}.value{font-size:15px;font-weight:500;overflow-wrap:anywhere}.section{margin-top:18px}.sectionhead{font-weight:600;margin-bottom:10px}.manual{display:flex;gap:8px;align-items:end;flex-wrap:wrap}.field{flex:1;min-width:175px}.field label{display:block;font-size:12px;color:var(--secondary-text-color);margin-bottom:5px} input[type=datetime-local],input[type=time]{color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;padding:8px;font:inherit;min-height:40px;max-width:100%} input[type=datetime-local]{width:100%} button{font:500 14px var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif);color:var(--primary-color);background:transparent;border:0;border-radius:8px;min-height:40px;padding:8px 10px;cursor:pointer} button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)} button:disabled,input:disabled{opacity:.48;cursor:not-allowed} button:focus-visible,input:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.expand{display:flex;align-items:center;justify-content:space-between;width:100%;padding:9px 0;text-align:left;color:var(--primary-text-color);font-weight:600}.expand .small{font-size:12px;color:var(--primary-color)} .day{display:grid;grid-template-columns:minmax(75px,1fr) auto auto;align-items:center;gap:10px;padding:7px 0;border-top:1px solid var(--divider-color)} .day input[type=time]{width:100px}.day-toggle{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--secondary-text-color);min-width:50px}.day-toggle input{width:18px;height:18px;accent-color:var(--primary-color)} .notice{font-size:13px;color:var(--error-color,#c62828);margin-top:12px;overflow-wrap:anywhere}.hint{font-size:12px;color:var(--secondary-text-color);margin-top:10px}.actions{display:flex;gap:4px;align-items:center} @media(max-width:350px){.wrap{padding:15px}.day{grid-template-columns:minmax(65px,1fr) auto auto;gap:5px}.day input[type=time]{width:90px}}
      </style>
      <ha-card><div class="wrap">
        <div class="head"><div class="icon"><ha-icon icon="mdi:car-defrost-front"></ha-icon></div><div class="headtext"><div class="title">${mvEscape(title)}</div><div class="status">${mvEscape(statusText)}</div></div><span class="badge ${heating === "På" ? "on" : ""}">Värmare ${heating}</span></div>
        <div class="stats">
          <div><div class="label">Nästa avresa</div><div class="value">${mvEscape(this._date(a.next_departure))}</div></div>
          <div><div class="label">Planerad start</div><div class="value">${mvEscape(this._date(a.planned_start))}</div></div>
          <div><div class="label">Utetemperatur</div><div class="value">${mvEscape(temperature)}</div></div>
          <div><div class="label">Gångtid</div><div class="value">${a.next_departure && Number.isFinite(a.duration_minutes) ? `${mvEscape(a.duration_minutes)} min` : "–"}</div></div>
        </div>
        ${a.source ? `<div class="hint">Avresa från ${mvEscape(String(a.source).toLowerCase())}</div>` : ""}
        ${a.error ? `<div class="notice" role="status">${mvEscape(a.error)}</div>` : ""}
        ${this._actionError ? `<div class="notice" role="alert">${mvEscape(this._actionError)}</div>` : ""}
        <div class="section"><div class="sectionhead">Enstaka avresa</div><div class="manual"><div class="field"><label for="manual">Datum och tid</label><input id="manual" type="datetime-local" value="${mvEscape(inputValue)}" ${!manualOk || this._pending ? "disabled" : ""}></div><div class="actions"><button class="primary" id="save" ${!manualOk || this._pending ? "disabled" : ""}>Spara</button><button id="clear" ${!clearOk || this._pending ? "disabled" : ""}>Rensa</button></div></div></div>
        <div class="section"><button class="expand" id="week" aria-expanded="${this._showWeek}"><span>Veckoschema</span><span class="small">${this._showWeek ? "Dölj" : "Visa"}</span></button>${this._showWeek ? weekRows : ""}</div>
        ${(!e.manual_entity || !e.weekly.some(x=>x.time && x.enabled)) ? `<div class="hint">Bilens entiteter kunde inte hittas. Kontrollera att integrationen har uppdaterats och startats om.</div>` : ""}
        <div class="hint">Kalender, brytare, temperatur och gångtider ändras i <a href="/config/integrations/integration/motorvarmare" style="color:var(--primary-color)">integrationens inställningar</a>.</div>
      </div></ha-card>`;
    const manualInput = this.shadowRoot.querySelector("#manual");
    manualInput?.addEventListener("input", (event) => {this._draft = event.target.value;});
    this.shadowRoot.querySelector("#save")?.addEventListener("click", async () => {
      const value = manualInput.value;
      if (!value) {this._actionError="Välj datum och tid för avresan"; this._render(); return;}
      if (value <= this._inputDate(new Date().toISOString())) {this._actionError="Välj en framtida avresetid"; this._render(); return;}
      this._draft = value;
      if (await this._call("datetime", "set_value", {entity_id:e.manual_entity, datetime:value.length === 16 ? `${value}:00` : value})) {this._draft = null; this._render();}
    });
    this.shadowRoot.querySelector("#clear")?.addEventListener("click", async () => {if (await this._call("button", "press", {entity_id:e.clear_entity})) {this._draft = null; this._render();}});
    this.shadowRoot.querySelector("#week")?.addEventListener("click", () => {this._showWeek = !this._showWeek; this._render();});
    this.shadowRoot.querySelectorAll("[data-day-time]").forEach((el) => el.addEventListener("change", () => {if (el.value) this._call("time", "set_value", {entity_id:e.weekly[Number(el.dataset.dayTime)].time, time:`${el.value}:00`});}));
    this.shadowRoot.querySelectorAll("[data-day-switch]").forEach((el) => el.addEventListener("change", () => this._call("switch", el.checked ? "turn_on" : "turn_off", {entity_id:e.weekly[Number(el.dataset.daySwitch)].enabled})));
  }
}

class MotorvarmareCardEditor extends HTMLElement {
  constructor() {super(); this.attachShadow({mode:"open"}); this._config = {};}
  setConfig(config) {this._config = {...config}; this._render();}
  set hass(hass) {this._hass = hass; if (!this.shadowRoot.activeElement) this._render();}
  _set(key, value) {this._config = {...this._config, [key]:value}; this.dispatchEvent(new CustomEvent("config-changed", {detail:{config:this._config}, bubbles:true, composed:true}));}
  _options(domain, selected) {
    const states = Object.values(this._hass?.states || {}).filter(s=>s.entity_id.startsWith(`${domain}.`) && (s.attributes?.control_entities || s.entity_id === selected));
    const options = states.sort((a,b)=>(a.attributes.friendly_name || a.entity_id).localeCompare(b.attributes.friendly_name || b.entity_id, "sv")).map(s=>`<option value="${mvEscape(s.entity_id)}" ${s.entity_id === selected ? "selected" : ""}>${mvEscape(s.attributes.friendly_name || s.entity_id)} (${mvEscape(s.entity_id)})</option>`);
    if (selected && !states.some(s=>s.entity_id === selected)) options.unshift(`<option selected value="${mvEscape(selected)}">${mvEscape(selected)} (saknas)</option>`);
    return `<option value="">Välj entitet</option>${options.join("")}`;
  }
  _render() {
    if (!this._hass) return;
    const c = this._config;
    this.shadowRoot.innerHTML = `<style>:host{display:block} .fields{display:grid;gap:14px} label{display:grid;gap:5px;color:var(--secondary-text-color);font:14px Roboto,system-ui,sans-serif} input,select{font:14px Roboto,system-ui,sans-serif;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:6px;padding:10px;min-height:42px;width:100%;box-sizing:border-box} p{color:var(--secondary-text-color);font:13px/1.45 Roboto,system-ui,sans-serif;margin:0}</style>
      <div class="fields"><label>Kortets namn<input id="title" value="${mvEscape(c.title || "")}" placeholder="Motorvärmare"></label><label>Bilens statusentitet<select id="status">${this._options("sensor",c.status_entity)}</select></label><p>Välj bilens statusentitet. Kortet hittar bilens övriga entiteter automatiskt.</p></div>`;
    this.shadowRoot.querySelector("#title").addEventListener("change", e=>this._set("title",e.target.value));
    this.shadowRoot.querySelector("#status").addEventListener("change", e=>this._set("status_entity",e.target.value));
  }
}

if (!customElements.get("motorvarmare-card")) customElements.define("motorvarmare-card", MotorvarmareCard);
if (!customElements.get("motorvarmare-card-editor")) customElements.define("motorvarmare-card-editor", MotorvarmareCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some(c=>c.type === "motorvarmare-card")) window.customCards.push({type:"motorvarmare-card", name:"Motorvärmare", description:"Avresetider och veckoschema för motorvärmaren", preview:true});
