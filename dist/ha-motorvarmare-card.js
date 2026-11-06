/* Motorvärmare Lovelace card. No external dependencies. */
const MV_DAYS = {sv:["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"], en:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]};
const MV_I18N = {
  sv:{choose:"Välj bilens statusentitet i kortets inställningar.", noStatus:"Status otillgänglig", on:"På", off:"Av", unknown:"Okänd", heater:"Värmare", departure:"Nästa avresa", plannedStart:"Planerad start", temperature:"Utetemperatur", duration:"Gångtid", from:"Avresa från", runNow:"Starta nu", stopNow:"Stoppa nu", plannedStop:"Planerat stopp", owned:"Styrd av Motorvärmare", external:"Brytaren var redan på och styrs separat.", autoOff:"Stängs av automatiskt efter beräknad gångtid.", unknownSwitch:"Brytarens tillstånd är inte tillgängligt.", seven:"Kommande 7 dagar", estimate:"Beräknade tider utifrån aktuell utetemperatur. Starttiden kan ändras när temperaturen ändras.", updateCalendar:"Uppdatera integrationen för att visa kalendern.", updateAdd:"Uppdatera integrationen för att lägga till avresor i kalendern.", today:"I dag", tomorrow:"I morgon", add:"Lägg till", addDay:"Lägg till avresa", noDeparture:"Ingen avresa", noHeat:"Ingen värmning", depShort:"avresa", startShort:"Start", stopShort:"av", missingStart:"Starttid saknas", remove:"Ta bort", removeDeparture:"Ta bort avresa", cancel:"Avbryt", depTime:"Avresetid", single:"Enstaka avresa", dateTime:"Datum och tid", save:"Spara", clear:"Rensa", weekly:"Veckoschema", hide:"Dölj", show:"Visa", enable:"Aktivera", unavailable:"Ej tillgänglig", missingEntities:"Bilens entiteter kunde inte hittas. Kontrollera att integrationen har uppdaterats och startats om.", configBefore:"Kalender, brytare och temperatur ändras i ", configLink:"integrationens inställningar", configAfter:".", chooseDate:"Välj datum och tid för avresan", future:"Välj en framtida avresetid", chooseTime:"Välj en avresetid", actionError:"Kunde inte utföra åtgärden", cardTitle:"Kortets namn", statusEntity:"Bilens statusentitet", editorHint:"Välj bilens statusentitet. Kortet hittar bilens övriga entiteter automatiskt.", cardDescription:"Avresetider och veckoschema för motorvärmaren", addLabel:"Lägg till avresa"},
  en:{choose:"Select the car's status entity in the card settings.", noStatus:"Status unavailable", on:"On", off:"Off", unknown:"Unknown", heater:"Heater", departure:"Next departure", plannedStart:"Planned start", temperature:"Outdoor temperature", duration:"Heating time", from:"Departure from", runNow:"Start now", stopNow:"Stop now", plannedStop:"Planned stop", owned:"Controlled by Motorvärmare", external:"The switch was already on and is controlled separately.", autoOff:"Turns off automatically after the calculated heating time.", unknownSwitch:"The switch state is unavailable.", seven:"Next 7 days", estimate:"Times are estimated using the current outdoor temperature. The start time can change with temperature.", updateCalendar:"Update the integration to show the calendar.", updateAdd:"Update the integration to add calendar departures.", today:"Today", tomorrow:"Tomorrow", add:"Add", addDay:"Add departure", noDeparture:"No departure", noHeat:"No heating", depShort:"departure", startShort:"Start", stopShort:"off", missingStart:"Start time unavailable", remove:"Remove", removeDeparture:"Remove departure", cancel:"Cancel", depTime:"Departure time", single:"One-time departure", dateTime:"Date and time", save:"Save", clear:"Clear", weekly:"Weekly schedule", hide:"Hide", show:"Show", enable:"Enable", unavailable:"Unavailable", missingEntities:"The car's entities could not be found. Check that the integration has been updated and Home Assistant restarted.", configBefore:"Change the calendar, switch and temperature sensor in the ", configLink:"integration settings", configAfter:".", chooseDate:"Choose a departure date and time", future:"Choose a future departure time", chooseTime:"Choose a departure time", actionError:"Could not complete the action", cardTitle:"Card title", statusEntity:"Car status entity", editorHint:"Select the car's status entity. The card finds its other entities automatically.", cardDescription:"Departure times and weekly schedule for the engine heater", addLabel:"Add departure"}
};
MV_I18N.sv.suppressed = "Avstängd för den här avresan";
MV_I18N.en.suppressed = "Turned off for this departure";
MV_I18N.sv.selectEntity = "Välj entitet"; MV_I18N.en.selectEntity = "Select entity";
MV_I18N.sv.missing = "saknas"; MV_I18N.en.missing = "missing";
MV_I18N.sv.from = "Källa:"; MV_I18N.en.from = "Source:";
MV_I18N.sv.eventSummary = "Avresa"; MV_I18N.en.eventSummary = "Departure";
MV_I18N.sv.estimate = "Individuellt beräknade tider utifrån aktuell utetemperatur. Tiderna kan ändras när temperaturen ändras.";
MV_I18N.en.estimate = "Individual estimates based on the current outdoor temperature. Times can change with temperature.";
MV_I18N.sv.overlap = "Överlappande tider: värmaren kan stängas av och starta igen mellan avresorna.";
MV_I18N.en.overlap = "Overlapping times: the heater may turn off and restart between departures.";
MV_I18N.sv.runtimeFor = "Värmer i"; MV_I18N.en.runtimeFor = "Heats for";
MV_I18N.sv.runtimeOff = "stängs sedan av automatiskt."; MV_I18N.en.runtimeOff = "then turns off automatically.";
MV_I18N.sv.noRuntime = "Formeln ger ingen uppvärmning vid den här temperaturen.";
MV_I18N.en.noRuntime = "The formula gives no heating time at this temperature.";
MV_I18N.sv.tempUnavailable = "Utetemperaturen är inte tillgänglig.";
MV_I18N.en.tempUnavailable = "Outdoor temperature is unavailable.";
MV_I18N.sv.gridHint = "Klicka i kalendern eller på + för att lägga till en avresa. Tiderna visar när värmaren startar och stängs av.";
MV_I18N.en.gridHint = "Click the calendar or + to add a departure. Times show when the heater starts and turns off.";
MV_I18N.sv.scrollHint = "Bläddra i kalendern för att se alla dagar och tider."; MV_I18N.en.scrollHint = "Scroll the calendar to see all days and times.";
MV_I18N.sv.continues = "Fortsätter"; MV_I18N.en.continues = "Continues";
MV_I18N.sv.agenda = "Visa alla avresor och tider"; MV_I18N.en.agenda = "Show all departures and times";
MV_I18N.sv.selectDay = "Välj dag"; MV_I18N.en.selectDay = "Select day";
MV_I18N.sv.mobileHint = "Välj dag för att se tider eller lägga till en avresa.";
MV_I18N.en.mobileHint = "Select a day to see times or add a departure.";
MV_I18N.sv.currentPower = "Effekt just nu"; MV_I18N.en.currentPower = "Current power";
MV_I18N.sv.sessionEnergy = "Energi, pågående/senaste körning"; MV_I18N.en.sessionEnergy = "Energy, current/last session";
MV_I18N.sv.powerUnavailable = "Effektsensorn är inte tillgänglig."; MV_I18N.en.powerUnavailable = "Power sensor is unavailable.";
MV_I18N.sv.energyUnavailable = "Energisensorn är inte tillgänglig. Visat värde är det senaste kända."; MV_I18N.en.energyUnavailable = "Energy sensor is unavailable. The displayed value is the last known reading.";
MV_I18N.sv.energyUnavailableEmpty = "Energisensorn är inte tillgänglig."; MV_I18N.en.energyUnavailableEmpty = "Energy sensor is unavailable.";
MV_I18N.sv.energyIncomplete = "Energimätningen för körningen är ofullständig och kan inte visas.";
MV_I18N.en.energyIncomplete = "The session's energy measurement is incomplete and cannot be displayed.";
MV_I18N.sv.energyNoSession = "Ingen energimätning för en körning ännu.";
MV_I18N.en.energyNoSession = "No session energy measurement yet.";
MV_I18N.sv.powerWaiting = "Väntar på effektmätning."; MV_I18N.en.powerWaiting = "Waiting for power measurement.";
MV_I18N.sv.powerAlarm = "Värmaren är på men effekten är låg. Kontrollera att motorvärmarkabeln är ansluten.";
MV_I18N.en.powerAlarm = "The heater is on but power is low. Check that the engine heater cable is connected.";
MV_I18N.sv.history = "Tidigare värmningar"; MV_I18N.en.history = "Heating history";
MV_I18N.sv.historyEmpty = "Inga tidigare värmningar har registrerats ännu.";
MV_I18N.en.historyEmpty = "No previous heating sessions have been recorded yet.";
MV_I18N.sv.historyUpdate = "Uppdatera integrationen för att visa historiken.";
MV_I18N.en.historyUpdate = "Update the integration to show the history.";
MV_I18N.sv.historyStartMissing = "Starttid saknas"; MV_I18N.en.historyStartMissing = "Start time unavailable";
MV_I18N.sv.historyEndMissing = "Sluttid saknas"; MV_I18N.en.historyEndMissing = "End time unavailable";
MV_I18N.sv.historyStart = "Start"; MV_I18N.en.historyStart = "Start";
MV_I18N.sv.historyEnd = "Av"; MV_I18N.en.historyEnd = "Off";
MV_I18N.sv.historyEnergy = "Energi"; MV_I18N.en.historyEnergy = "Energy";
MV_I18N.sv.historyTimeIncomplete = "Tidsuppgifter ofullständiga"; MV_I18N.en.historyTimeIncomplete = "Timing incomplete";
MV_I18N.sv.historyEnergyUnavailable = "Energi saknas"; MV_I18N.en.historyEnergyUnavailable = "Energy unavailable";
MV_I18N.sv.historyShowMore = "Visa fler"; MV_I18N.en.historyShowMore = "Show more";
MV_I18N.sv.historyLessMinute = "under 1 min"; MV_I18N.en.historyLessMinute = "under 1 min";
const MV_EN_STATES = {"Väntar":"Waiting", "Väntar på start":"Waiting to start", "Värmer":"Heating", "Avstängd":"Off", "Ingen avresa":"No departure", "Ingen uppvärmning behövs":"No heating needed", "Fel":"Error", "Brytaren var redan på":"Switch was already on", "Manuellt avstängd för denna avresa":"Manually turned off for this departure", "Kalender":"Calendar", "Manuell":"Manual", "Veckoschema":"Weekly schedule", "Planerad":"Scheduled", "Lokal":"Local", "Starta nu":"Start now"};
const MV_EN_ERRORS = {"Brytaren är inte tillgänglig":"The switch is unavailable", "Värmaren är redan på eller styrs redan av integrationen":"The heater is already on or controlled by the integration", "Utetemperaturen är inte tillgänglig":"Outdoor temperature is unavailable", "Formeln ger ingen uppvärmning vid den här temperaturen":"The formula gives no heating time at this temperature", "Integrationen styr ingen pågående uppvärmning":"The integration is not controlling an active heating session", "Kunde inte slå på brytaren":"Could not turn on the switch", "Kunde inte stänga av brytaren; försöker igen":"Could not turn off the switch; retrying", "Kunde inte bekräfta att brytaren är av; försöker igen":"Could not confirm that the switch is off; retrying", "Brytarens tillstånd är okänt":"The switch state is unknown", "Utetemperaturen är inte tillgänglig eller saknar temperaturenhet":"Outdoor temperature is unavailable or has no temperature unit", "Kalendern svarade inte i tid; försöker igen":"Calendar timed out; retrying", "Kalendern kan inte läsas; se Home Assistants logg":"Calendar could not be read; check the Home Assistant log", "Kalendern kan inte läsas":"Calendar could not be read", "Kunde inte slå på brytaren; försöker stänga av":"Could not turn on the switch; trying to turn it off", "Ett oväntat fel uppstod; kontrollera loggen":"Unexpected error; check the log"};
const MV_STATUS_KEYS = {waiting:"Väntar", error:"Fel", heating:"Värmer", stopped:"Avstängd", no_departure:"Ingen avresa", no_heating_needed:"Ingen uppvärmning behövs", waiting_to_start:"Väntar på start", already_on:"Brytaren var redan på", manually_stopped:"Manuellt avstängd för denna avresa"};
const mvEscape = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mvUsable = (s) => s && !["unknown", "unavailable"].includes(s.state);
const mvLang = (hass) => String(hass?.locale?.language || hass?.language || "sv").toLowerCase().startsWith("sv") ? "sv" : "en";
const mvText = (hass, key) => MV_I18N[mvLang(hass)][key] || key;
const mvStateText = (hass, value) => {
  const swedish = MV_STATUS_KEYS[value] || value;
  return mvLang(hass) === "en" ? (MV_EN_STATES[swedish] || swedish) : swedish;
};
const mvErrorText = (hass, value) => {
  if (mvLang(hass) !== "en" || typeof value !== "string") return value;
  return Object.entries(MV_EN_ERRORS).sort((a,b)=>b[0].length-a[0].length).reduce((text,[sv,en])=>text.split(sv).join(en),value);
};

class MotorvarmareCard extends HTMLElement {
  constructor() {
    super(); this.attachShadow({mode:"open"}); this._config = {}; this._showWeek = false; this._showHistory = false; this._historyLimit = 10; this._draft = null; this._pending = false;
    this._selectedDay = null; this._calendarTime = "07:00"; this._initialCalendarScroll = null;
    this._calendarAnchored = false; this._calendarUserScrolled = false; this._desktopPosition = null;
    this._mobileDay = null; this._mobileDayChosen = false;
    this.shadowRoot.addEventListener("focusout", () => setTimeout(() => {
      const focused = this.shadowRoot.activeElement;
      if (this._refreshAfterFocus && (!focused || !["INPUT", "SELECT"].includes(focused.tagName))) {
        this._refreshAfterFocus = false; this._render();
      }
    }, 0));
  }
  connectedCallback() {
    const scroll=this.shadowRoot.querySelector(".cal-scroll");
    if (scroll?.clientHeight && this._initialCalendarScroll) {
      scroll.scrollTop=this._initialCalendarScroll.top; scroll.scrollLeft=this._initialCalendarScroll.left;
      this._desktopPosition={top:scroll.scrollTop,left:scroll.scrollLeft};
      this._initialCalendarScroll=null;
    }
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(entries => {
        const width=entries[0]?.contentRect?.width;
        if (!width) return;
        const calendarWidth=this.shadowRoot.querySelector(".calendar")?.clientWidth || width-40;
        const narrow=calendarWidth <= 839;
        if (this._layoutNarrow !== undefined && narrow !== this._layoutNarrow) {
          const focused=this.shadowRoot.activeElement;
          if (focused && ["INPUT","SELECT"].includes(focused.tagName)) this._refreshAfterFocus=true;
          else this._render();
        }
        this._layoutNarrow=narrow;
      });
      this._resizeObserver.observe(this);
    }
  }
  disconnectedCallback() { this._resizeObserver?.disconnect(); this._resizeObserver=null; }
  static getConfigElement() { return document.createElement("motorvarmare-card-editor"); }
  static getStubConfig() { return {title:"Motorvärmare"}; }
  getCardSize() { return this._showWeek ? 8 : 4; }
  getGridOptions() { return {columns:6, min_columns:3, rows:"auto"}; }
  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Ogiltig konfiguration");
    if (this._config.status_entity !== config.status_entity) {
      this._draft = null; this._selectedDay = null; this._initialCalendarScroll = null;
      this._calendarAnchored = false; this._calendarUserScrolled = false; this._desktopPosition = null;
      this._mobileDay = null; this._mobileDayChosen = false; this._showHistory = false; this._historyLimit = 10;
    }
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
      calendar:auto.calendar,
      start_now:auto.start_now,
      stop_now:auto.stop_now,
      weekly:MV_DAYS.sv.map((_, i) => ({time:auto.weekly_times?.[i], enabled:auto.weekly_enabled?.[i]})),
    };
  }
  _timeZone() { return this._hass?.config?.time_zone || undefined; }
  _date(value, includeOffset=false, includeYear=false) {
    if (!value) return "–";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "–";
    const options = {timeZone:this._timeZone(), weekday:"short", day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"};
    if (includeOffset) options.timeZoneName = "shortOffset";
    if (includeYear) options.year = "numeric";
    return new Intl.DateTimeFormat(mvLang(this._hass) === "sv" ? "sv-SE" : "en-GB", options).format(date);
  }
  _inputDate(value) {
    if (!value || ["unknown", "unavailable"].includes(value)) return "";
    const date = new Date(value); if (Number.isNaN(date.getTime())) return "";
    const p = Object.fromEntries(new Intl.DateTimeFormat("sv-SE", {timeZone:this._timeZone(), year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23"}).formatToParts(date).filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  }
  _dayKey(value) {
    return this._inputDate(value).slice(0, 10);
  }
  _dayKeys() {
    const today = this._dayKey(new Date().toISOString());
    if (!today) return [];
    const [y,m,d] = today.split("-").map(Number);
    return Array.from({length:7}, (_,i) => new Date(Date.UTC(y,m-1,d+i,12)).toISOString().slice(0,10));
  }
  _dayLabel(key, i) {
    const date = new Date(`${key}T12:00:00Z`);
    const text = new Intl.DateTimeFormat(mvLang(this._hass) === "sv" ? "sv-SE" : "en-GB", {timeZone:"UTC", weekday:"short", day:"numeric", month:"short"}).format(date);
    return i === 0 ? `${mvText(this._hass,"today")} · ${text}` : i === 1 ? `${mvText(this._hass,"tomorrow")} · ${text}` : text;
  }
  _clock(value, day, includeOffset=false) {
    if (!value) return "–";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "–";
    const options = {timeZone:this._timeZone(), hour:"2-digit", minute:"2-digit", hourCycle:"h23"};
    if (includeOffset) options.timeZoneName = "shortOffset";
    if (this._dayKey(value) !== day) { options.weekday = "short"; options.day = "numeric"; options.month = "short"; }
    return new Intl.DateTimeFormat(mvLang(this._hass) === "sv" ? "sv-SE" : "en-GB", options).format(date);
  }
  async _perform(action) {
    if (this._pending) return false;
    this._pending = true; this._actionError = null;
    this._render();
    let ok = false;
    try { await action(); ok = true; }
    catch (err) { this._actionError = mvErrorText(this._hass, err?.message) || mvText(this._hass,"actionError"); }
    finally { this._pending = false; this._render(); }
    return ok;
  }
  async _call(domain, service, data) { return this._perform(() => this._hass.callService(domain, service, data)); }
  async _callWS(data) { return this._perform(() => this._hass.callWS(data)); }
  _render() {
    if (!this.shadowRoot) return;
    const focusedHistory=["history-toggle", "history-more"].includes(this.shadowRoot.activeElement?.id) ? this.shadowRoot.activeElement.id : null;
    const focusedMobileDay=this.shadowRoot.activeElement?.dataset?.mobileDay;
    const oldScroll=this.shadowRoot.querySelector(".cal-scroll");
    const scrollPosition=this._initialCalendarScroll || (oldScroll && this.isConnected && oldScroll.clientHeight ? {top:oldScroll.scrollTop,left:oldScroll.scrollLeft} : this._desktopPosition);
    const agendaOpen=!!this.shadowRoot.querySelector(".cal-agenda")?.open;
    const h = this._hass, cfg = this._config;
    if (!h) { this.shadowRoot.innerHTML = ""; return; }
    const t = key => mvText(h,key), days = MV_DAYS[mvLang(h)];
    const status = h.states[cfg.status_entity];
    if (!cfg.status_entity || !status) {
      this.shadowRoot.innerHTML = `<ha-card><div style="padding:20px">${mvEscape(t("choose"))}</div></ha-card>`;
      return;
    }
    const e = this._entities(), a = status.attributes || {}, manual = h.states[e.manual_entity];
    const sw = h.states[e.switch_entity];
    const statusText = mvUsable(status) ? mvStateText(h,status.state) : t("noStatus");
    const heating = sw?.state === "on" ? t("on") : sw?.state === "off" ? t("off") : t("unknown");
    const title = cfg.title || status.attributes?.friendly_name?.replace(/\s+status$/i, "") || "Motorvärmare";
    const temperature = typeof a.temperature === "number" && Number.isFinite(a.temperature) ? `${new Intl.NumberFormat(mvLang(h) === "sv" ? "sv-SE" : "en-GB", {maximumFractionDigits:1}).format(a.temperature)} °C` : "–";
    const showPower = a.power_sensor_configured === true, showEnergy = a.energy_sensor_configured === true;
    const metricLocale = mvLang(h) === "sv" ? "sv-SE" : "en-GB";
    const measuredPower = Number.isFinite(a.power_w) ? `${new Intl.NumberFormat(metricLocale, {maximumFractionDigits:1}).format(a.power_w)} W` : "–";
    const hasSessionEnergy = a.energy_session_status !== "incomplete" && Number.isFinite(a.session_energy_kwh);
    const sessionEnergy = hasSessionEnergy ? `${new Intl.NumberFormat(metricLocale, {minimumFractionDigits:2, maximumFractionDigits:3}).format(a.session_energy_kwh)} kWh` : "–";
    const meterWarnings = [
      showPower && a.energy_monitor_status === "power_unavailable" ? t("powerUnavailable") : null,
      showEnergy && a.energy_sensor_available === false ? t(hasSessionEnergy ? "energyUnavailable" : "energyUnavailableEmpty") : null,
      showEnergy && a.energy_session_status === "incomplete" ? t("energyIncomplete") : null,
      showEnergy && a.energy_session_status === "no_session" && a.energy_sensor_available !== false ? t("energyNoSession") : null,
      showPower && a.energy_monitor_status === "waiting" && sw?.state === "on" ? t("powerWaiting") : null,
    ].filter(Boolean);
    const weekRows = e.weekly.map((day, i) => {
      const t = h.states[day.time], s = h.states[day.enabled];
      const availableTime = mvUsable(t), availableSwitch = mvUsable(s) && ["on","off"].includes(s.state);
      return `<div class="day"><span>${days[i]}</span><input aria-label="${days[i]} ${mvText(h,"depTime")}" type="time" data-day-time="${i}" value="${availableTime ? mvEscape(t.state.slice(0,5)) : ""}" ${!availableTime || this._pending ? "disabled" : ""}><label class="day-toggle"><input aria-label="${mvText(h,"enable")} ${days[i]}" type="checkbox" data-day-switch="${i}" ${s?.state === "on" ? "checked" : ""} ${!availableSwitch || this._pending ? "disabled" : ""}><span>${availableSwitch ? (s.state === "on" ? mvText(h,"on") : mvText(h,"off")) : mvText(h,"unavailable")}</span></label></div>`;
    }).join("");
    const manualOk = manual && manual.state !== "unavailable";
    const clear = h.states[e.clear_entity];
    const clearOk = clear && clear.state !== "unavailable";
    const inputValue = this._draft === null ? this._inputDate(manual?.state) : this._draft;
    const startButton = h.states[e.start_now], stopButton = h.states[e.stop_now];
    const currentRuntime = Number.isFinite(a.current_duration_minutes) ? a.current_duration_minutes : null;
    const startOk = startButton && startButton.state !== "unavailable" && sw?.state === "off" && currentRuntime > 0;
    const stopOk = stopButton && stopButton.state !== "unavailable" && a.owned;
    const calendar = h.states[e.calendar];
    const calendarOk = calendar && calendar.state !== "unavailable";
    const hasSchedule = Array.isArray(a.schedule_7_days);
    const schedule = hasSchedule ? a.schedule_7_days.filter(item => item && item.departure && !Number.isNaN(new Date(item.departure).getTime())).slice().sort((x,y)=>new Date(x.departure)-new Date(y.departure)) : [];
    const heatingWindows = schedule.filter(item => !item.suppressed && item.start);
    const hasOverlap = heatingWindows.some((item,i) => i > 0 && new Date(item.start) < new Date(heatingWindows[i-1].departure));
    // The grid uses local wall-clock days, not UTC dates. Split an interval at
    // each local midnight so heating before midnight remains visible.
    const dayKeys = this._dayKeys(), hourHeight = 64;
    const minutesOf = value => { const local=this._inputDate(value); return local ? Number(local.slice(11,13))*60+Number(local.slice(14,16)) : null; };
    const segments = [];
    for (const item of schedule) {
      const endKey=this._dayKey(item.departure), endMinute=minutesOf(item.departure);
      const startKey=item.start ? this._dayKey(item.start) : "", startMinute=item.start ? minutesOf(item.start) : null;
      const hasHeat=!item.suppressed && startKey && startMinute !== null && new Date(item.start) < new Date(item.departure);
      for (const key of dayKeys) {
        if (hasHeat && startKey <= key && endKey >= key) {
          const from=startKey === key ? startMinute : 0, to=endKey === key ? endMinute : 1440;
          if (to > from) segments.push({item,key,from,to,heat:true});
          else if (startKey < endKey && key === endKey && endMinute === 0) segments.push({item,key,from:0,to:0,heat:false,endOnly:true});
          // A repeated local clock hour may make the wall-clock end appear
          // earlier than the start even though the real interval is positive.
          else if (startKey === endKey && key === endKey) segments.push({item,key,from:endMinute,to:endMinute,heat:true});
        } else if (!hasHeat && endKey === key && endMinute !== null) {
          segments.push({item,key,from:endMinute,to:endMinute,heat:false});
        }
      }
    }
    // Anchor to the first upcoming departure, then its earliest visible
    // segment. A later trip after midnight must not shift the view to 00:00.
    const anchorItem = schedule.find(item => !item.suppressed && segments.some(s => s.item === item))
      || schedule.find(item => segments.some(s => s.item === item));
    const anchorSegment = anchorItem && segments.find(s => s.item === anchorItem);
    if (!dayKeys.includes(this._mobileDay)) { this._mobileDay = null; this._mobileDayChosen = false; }
    if (!this._mobileDayChosen) this._mobileDay = anchorSegment?.key || dayKeys[0];
    const firstHour=0, lastHour=24;
    const gridHeight=(lastHour-firstHour)*hourHeight;
    const rows=Array.from({length:lastHour-firstHour+1},(_,i)=>`<div class="cal-hour" style="top:${i*hourHeight}px">${String(firstHour+i).padStart(2,"0")}:00</div>`).join("");
    const dayRows = dayKeys.map((key,i) => {
      const items=segments.filter(s=>s.key===key).map(s=>({...s,top:Math.max(0,Math.min(gridHeight,(s.from-firstHour*60)*hourHeight/60)),height:s.heat ? Math.max(1,(s.to-s.from)*hourHeight/60) : 24})).sort((a,b)=>a.top-b.top);
      // Assign lanes to visually overlapping blocks, including minimum-height
      // blocks, so each remains readable and independently removable.
      const groups=[]; let group=[], groupEnd=-1, laneEnds=[];
      for (const item of items) {
        if (group.length && item.top >= groupEnd) { groups.push(group); group=[]; groupEnd=-1; laneEnds=[]; }
        let lane=laneEnds.findIndex(end=>end<=item.top); if (lane<0) lane=laneEnds.length;
        item.lane=lane; laneEnds[lane]=item.top+item.height; groupEnd=Math.max(groupEnd,laneEnds[lane]); group.push(item);
      }
      if (group.length) groups.push(group);
      for (const g of groups) { const count=Math.max(...g.map(x=>x.lane))+1; for (const item of g) item.lanes=count; }
      const entries = items.map(({item,top,height,heat,endOnly,lane,lanes}) => {
        const source = item.source ? mvStateText(h,String(item.source)) : mvStateText(h,"Planerad");
        const ambiguous=heat && this._dayKey(item.start)===this._dayKey(item.departure) && this._inputDate(item.start)>=this._inputDate(item.departure);
        const timing = item.suppressed ? `${t("suppressed")} · ${t("depShort")} ${this._clock(item.departure,key)}` : endOnly ? `${t("depShort")} ${this._clock(item.departure,key)}` : heat ? `${t("startShort")} ${this._clock(item.start,key,ambiguous)} · ${t("stopShort")} ${this._clock(item.departure,key,ambiguous)}` : `${item.duration_minutes === 0 ? t("noHeat") : t("missingStart")} · ${t("depShort")} ${this._clock(item.departure,key)}`;
        const remove = key === this._dayKey(item.departure) && item.removable === true && item.uid && calendarOk ? `<button class="remove" data-remove-uid="${mvEscape(item.uid)}" aria-label="${t("removeDeparture")} ${mvEscape(this._clock(item.departure,key))}" title="${t("removeDeparture")}">×</button>` : "";
        return `<div class="cal-event cal-entry ${heat ? "heating-event" : "marker-event"}" data-departure="${mvEscape(item.departure)}" data-segment-day="${key}" style="top:${top}px;height:${Math.min(height,gridHeight-top)}px;left:calc(${lane*100/lanes}% + 2px);width:calc(${100/lanes}% - 4px)" aria-label="${mvEscape(`${timing} · ${source}`)}" title="${mvEscape(`${timing} · ${source}`)}"><div class="cal-event-text"><div class="cal-timing">${mvEscape(timing)}</div><div class="cal-source">${mvEscape(source)}</div></div>${remove}</div>`;
      }).join("");
      const dayDate=new Date(`${key}T12:00:00Z`), locale=mvLang(h)==="sv" ? "sv-SE" : "en-GB";
      const weekday=new Intl.DateTimeFormat(locale,{timeZone:"UTC",weekday:"short"}).format(dayDate);
      return `<div class="cal-day"><div class="cal-day-head"><div class="cal-weekday">${mvEscape(weekday)}</div><div class="cal-date ${i===0 ? "is-today" : ""}">${dayDate.getUTCDate()}</div><button class="add-day" data-add-day="${key}" aria-label="${t("addDay")} ${mvEscape(this._dayLabel(key,i))}" title="${t("addDay")}" ${!calendarOk || this._pending ? "disabled" : ""}>＋</button></div><div class="cal-column" data-grid-day="${key}" data-first-hour="${firstHour}" style="height:${gridHeight}px">${entries}</div></div>`;
    }).join("");
    const calendarEditor=dayKeys.includes(this._selectedDay) ? `<div class="cal-editor"><strong>${mvEscape(this._dayLabel(this._selectedDay,dayKeys.indexOf(this._selectedDay)))}</strong><label for="calendar-time">${t("depTime")}</label><input id="calendar-time" type="time" value="${mvEscape(this._calendarTime)}" ${this._pending ? "disabled" : ""}><button class="primary" id="add-calendar" ${!calendarOk || this._pending ? "disabled" : ""}>${t("add")}</button><button id="cancel-calendar" ${this._pending ? "disabled" : ""}>${t("cancel")}</button></div>` : "";
    const agendaRows=schedule.filter(item=>dayKeys.includes(this._dayKey(item.departure))).map(item=>{
      const key=this._dayKey(item.departure), date=this._date(item.departure);
      const ambiguous=item.start && this._dayKey(item.start)===key && this._inputDate(item.start)>=this._inputDate(item.departure);
      const state=item.suppressed ? t("suppressed") : item.start ? `${t("startShort")} ${this._clock(item.start,key,ambiguous)} · ${t("stopShort")} ${this._clock(item.departure,key,ambiguous)}` : item.duration_minutes===0 ? t("noHeat") : t("missingStart");
      const source=mvStateText(h,String(item.source || "Planerad"));
      const remove=item.removable === true && item.uid && calendarOk ? `<button class="remove" data-remove-uid="${mvEscape(item.uid)}" aria-label="${t("removeDeparture")} ${mvEscape(date)}">${t("remove")}</button>` : "";
      return `<li><span><strong>${mvEscape(date)}</strong><br>${mvEscape(state)} · ${mvEscape(source)}</span>${remove}</li>`;
    }).join("");
    const mobileDays = dayKeys.map((key,i) => {
      const date=new Date(`${key}T12:00:00Z`), locale=mvLang(h)==="sv" ? "sv-SE" : "en-GB";
      const weekday=new Intl.DateTimeFormat(locale,{timeZone:"UTC",weekday:"short"}).format(date).replace(/\.$/,"");
      const hasEvents=segments.some(s=>s.key===key);
      return `<button class="mobile-day" data-mobile-day="${key}" aria-label="${mvEscape(this._dayLabel(key,i))}" aria-pressed="${key===this._mobileDay}"><span>${mvEscape(weekday)}</span><strong>${date.getUTCDate()}</strong><i class="${hasEvents ? "has-events" : ""}" aria-hidden="true"></i></button>`;
    }).join("");
    const mobileEntries=segments.filter(s=>s.key===this._mobileDay).sort((a,b)=>a.from-b.from).map(({item,heat,endOnly})=>{
      const key=this._mobileDay;
      const ambiguous=heat && this._dayKey(item.start)===this._dayKey(item.departure) && this._inputDate(item.start)>=this._inputDate(item.departure);
      const timing=item.suppressed ? `${t("suppressed")} · ${t("depShort")} ${this._clock(item.departure,key)}` : endOnly ? `${t("depShort")} ${this._clock(item.departure,key)}` : heat ? `${t("startShort")} ${this._clock(item.start,key,ambiguous)} · ${t("stopShort")} ${this._clock(item.departure,key,ambiguous)}` : `${item.duration_minutes === 0 ? t("noHeat") : t("missingStart")} · ${t("depShort")} ${this._clock(item.departure,key)}`;
      const source=mvStateText(h,String(item.source || "Planerad"));
      const remove=item.removable===true && item.uid && calendarOk ? `<button class="mobile-remove" data-remove-uid="${mvEscape(item.uid)}" aria-label="${t("removeDeparture")} ${mvEscape(this._date(item.departure))}">${t("remove")}</button>` : "";
      return `<div class="mobile-event ${heat ? "heating-event" : "marker-event"}" data-mobile-departure="${mvEscape(item.departure)}"><div><strong>${mvEscape(timing)}</strong><div class="mobile-source">${mvEscape(source)}</div></div>${remove}</div>`;
    }).join("");
    const mobileCalendar=`<div class="mobile-calendar"><div class="mobile-days" role="group" aria-label="${t("selectDay")}">${mobileDays}</div><div class="mobile-selected"><strong>${mvEscape(this._dayLabel(this._mobileDay,dayKeys.indexOf(this._mobileDay)))}</strong><button class="mobile-add" data-add-day="${this._mobileDay}" ${!calendarOk || this._pending ? "disabled" : ""}>＋ ${t("add")}</button></div><div class="mobile-events">${mobileEntries || `<div class="mobile-empty">${t("noDeparture")}</div>`}</div></div>`;
    const desktopCalendar=`<div class="desktop-calendar"><div class="cal-scroll" role="region" tabindex="0" aria-label="${t("seven")}"><div class="cal-grid"><div class="cal-axis"><div class="cal-axis-head"></div><div class="cal-hours" style="height:${gridHeight}px">${rows}</div></div>${dayRows}</div></div><div class="cal-scroll-hint">${t("scrollHint")}</div><details class="cal-agenda" ${agendaOpen ? "open" : ""}><summary>${t("agenda")}</summary>${agendaRows ? `<ul>${agendaRows}</ul>` : `<div class="cal-empty">${t("noDeparture")}</div>`}</details></div>`;
    const calendarGrid=`${calendarEditor}${mobileCalendar}${desktopCalendar}`;
    const historyAvailable=Array.isArray(a.heating_history);
    const history=historyAvailable ? a.heating_history.filter(item=>item && typeof item==="object") : [];
    const historyRows=history.slice(0,this._historyLimit).map(item=>{
      const valid=value=>typeof value==="string" && value.length>0 && !Number.isNaN(new Date(value).getTime());
      const hasStart=valid(item.start), hasEnd=valid(item.end), complete=item.complete === true && hasStart && hasEnd;
      const sameDay=hasStart && hasEnd && this._dayKey(item.start)===this._dayKey(item.end);
      const ambiguous=sameDay && this._inputDate(item.start)>=this._inputDate(item.end);
      const sameYear=hasStart && hasEnd && this._dayKey(item.start).slice(0,4)===this._dayKey(item.end).slice(0,4);
      const range=hasStart && hasEnd
        ? `${this._date(item.start,ambiguous,true)} – ${sameYear ? this._clock(item.end,this._dayKey(item.start),ambiguous) : this._date(item.end,ambiguous,true)}`
        : `${hasStart ? `${t("historyStart")} ${this._date(item.start,false,true)}` : t("historyStartMissing")} · ${hasEnd ? `${t("historyEnd")} ${this._date(item.end,false,true)}` : t("historyEndMissing")}`;
      let duration="";
      if (complete && Number.isFinite(item.duration_minutes) && item.duration_minutes>=0) {
        const mins=Math.round(item.duration_minutes);
        const formatted=item.duration_minutes>0 && mins===0 ? t("historyLessMinute") : mins>=60 ? `${Math.floor(mins/60)} h${mins%60 ? ` ${mins%60} min` : ""}` : `${mins} min`;
        duration=`${t("duration")}: ${formatted}`;
      }
      const energy=Number.isFinite(item.energy_kwh) && item.energy_kwh>=0
        ? `${t("historyEnergy")}: ${new Intl.NumberFormat(metricLocale,{minimumFractionDigits:2,maximumFractionDigits:3}).format(item.energy_kwh)} kWh`
        : t("historyEnergyUnavailable");
      return `<li class="history-entry"><div class="history-range">${mvEscape(range)}</div><div class="history-metrics">${duration ? `<span>${mvEscape(duration)}</span>` : ""}<span>${mvEscape(energy)}</span></div>${!complete ? `<div class="history-incomplete">${t("historyTimeIncomplete")}</div>` : ""}</li>`;
    }).join("");
    const historyBody=!historyAvailable ? `<div class="history-empty">${t("historyUpdate")}</div>` : !history.length ? `<div class="history-empty">${t("historyEmpty")}</div>` : `<ul class="history-list">${historyRows}</ul>${history.length>this._historyLimit ? `<button id="history-more" class="history-more">${t("historyShowMore")}</button>` : ""}`;
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;color:var(--primary-text-color);font-family:var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif)} *{box-sizing:border-box} ha-card{overflow:hidden} .wrap{padding:20px} .head{display:flex;gap:12px;align-items:center;margin-bottom:20px} .icon{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:rgba(var(--rgb-primary-color,3,169,244),.12);color:var(--primary-color)} ha-icon{--mdc-icon-size:22px}.headtext{flex:1;min-width:0}.title{font-size:18px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status{font-size:13px;color:var(--secondary-text-color);margin-top:2px}.badge{font-size:12px;font-weight:600;padding:6px 10px;border-radius:20px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}.badge.on{background:rgba(var(--rgb-success-color,67,160,71),.14);color:var(--success-color,#278748)} .stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 16px;padding:16px 0;border-top:1px solid var(--divider-color);border-bottom:1px solid var(--divider-color)} .label{font-size:12px;color:var(--secondary-text-color);margin-bottom:3px}.value{font-size:15px;font-weight:500;overflow-wrap:anywhere}.section{margin-top:18px}.sectionhead{font-weight:600;margin-bottom:10px}.manual{display:flex;gap:8px;align-items:end;flex-wrap:wrap}.field{flex:1;min-width:175px}.field label{display:block;font-size:12px;color:var(--secondary-text-color);margin-bottom:5px} input[type=datetime-local],input[type=time]{color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;padding:8px;font:inherit;min-height:40px;max-width:100%} input[type=datetime-local]{width:100%} button{font:500 14px var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif);color:var(--primary-color);background:transparent;border:0;border-radius:8px;min-height:40px;padding:8px 10px;cursor:pointer} button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)} button:disabled,input:disabled{opacity:.48;cursor:not-allowed} button:focus-visible,input:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.expand{display:flex;align-items:center;justify-content:space-between;width:100%;padding:9px 0;text-align:left;color:var(--primary-text-color);font-weight:600}.expand .small{font-size:12px;color:var(--primary-color)} .day{display:grid;grid-template-columns:minmax(75px,1fr) auto auto;align-items:center;gap:10px;padding:7px 0;border-top:1px solid var(--divider-color)} .day input[type=time]{width:100px}.day-toggle{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--secondary-text-color);min-width:50px}.day-toggle input{width:18px;height:18px;accent-color:var(--primary-color)} .notice{font-size:13px;color:var(--error-color,#c62828);margin-top:12px;overflow-wrap:anywhere}.hint{font-size:12px;color:var(--secondary-text-color);margin-top:10px}.actions{display:flex;gap:4px;align-items:center} @media(max-width:350px){.wrap{padding:15px}.day{grid-template-columns:minmax(65px,1fr) auto auto;gap:5px}.day input[type=time]{width:90px}}
        .quick-actions{display:flex;align-items:center;gap:12px;margin-top:15px;flex-wrap:wrap}.quick-actions .hint{margin:0;flex:1;min-width:150px}.calendar{margin-top:20px}.calendar-title{font-weight:600;margin-bottom:4px}.calendar-subtitle{font-size:12px;color:var(--secondary-text-color);margin-bottom:10px;line-height:1.45}.cal-day{border-top:1px solid var(--divider-color);padding:9px 0}.cal-day-head{display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:600;text-transform:none}.cal-day-head button{min-height:36px;padding:5px 6px}.cal-empty{font-size:12px;color:var(--secondary-text-color);padding:3px 0}.cal-entry{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:5px 0}.cal-timing{font-size:13px;font-weight:500}.cal-source{font-size:12px;color:var(--secondary-text-color)}.remove{font-size:12px;min-height:36px;color:var(--secondary-text-color);white-space:nowrap}.cal-editor{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:7px}.cal-editor label{font-size:12px;color:var(--secondary-text-color)}.cal-editor input{width:105px}.cal-editor button{padding:6px 9px} .cal-warning{font-size:12px;color:var(--error-color,#c62828);margin-top:8px}
        .cal-scroll{overflow:auto;max-height:640px;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);overscroll-behavior:contain}.cal-grid{display:grid;grid-template-columns:52px repeat(7,minmax(112px,1fr));min-width:836px}.cal-axis-head,.cal-day-head{height:78px;position:sticky;top:0;z-index:3;background:var(--card-background-color);border-bottom:1px solid var(--divider-color)}.cal-axis-head{z-index:4}.cal-day{border:0;padding:0;min-width:0}.cal-day-head{display:flex;position:sticky;flex-direction:column;justify-content:center;align-items:center;gap:2px;padding:4px 26px 4px 4px}.cal-weekday{font-size:11px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;color:var(--secondary-text-color)}.cal-date{font-size:20px;font-weight:500;width:32px;height:32px;display:grid;place-items:center;border-radius:50%}.cal-date.is-today{background:var(--primary-color);color:var(--text-primary-color,#fff)}.cal-day-head .add-day{position:absolute;right:2px;top:22px;min-width:30px;min-height:32px;padding:3px;font-size:19px}.cal-column{position:relative;border-left:1px solid var(--divider-color);background-image:repeating-linear-gradient(to bottom,var(--divider-color) 0,var(--divider-color) 1px,transparent 1px,transparent 64px);cursor:crosshair}.cal-hours{position:relative}.cal-hour{position:absolute;right:6px;transform:translateY(-50%);font-size:11px;color:var(--secondary-text-color);white-space:nowrap}.cal-hour:first-child{transform:none}.cal-hour:last-child{transform:translateY(-100%)}.cal-event{position:absolute;z-index:1;display:flex;align-items:flex-start;gap:2px;padding:3px 2px 2px 4px;border-radius:5px;background:#e8b84f;border-left:3px solid #9b7130;color:#211906;overflow:hidden;cursor:default}.cal-event-text{min-width:0;flex:1;overflow:hidden}.cal-event .cal-timing{font-size:10px;line-height:12px;font-weight:600;color:inherit;overflow-wrap:anywhere}.cal-event .cal-source{font-size:10px;line-height:12px;color:inherit;opacity:.76;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-event.marker-event{background:var(--secondary-background-color);border-left-color:var(--secondary-text-color);color:var(--primary-text-color)}.cal-event .remove{flex:none;min-width:22px;min-height:24px;padding:0;color:inherit;font-size:17px;line-height:20px}.cal-editor{margin:0 0 10px;padding:10px;border-radius:8px;background:var(--secondary-background-color)}.cal-editor strong{font-size:13px;margin-right:4px}.cal-scroll-hint{font-size:11px;color:var(--secondary-text-color);margin-top:6px}.cal-agenda{font-size:12px;color:var(--secondary-text-color);margin-top:8px}.cal-agenda summary{cursor:pointer;color:var(--primary-color);padding:6px 0}.cal-agenda ul{list-style:none;margin:0;padding:0}.cal-agenda li{display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:1px solid var(--divider-color);padding:5px 0;line-height:1.5}.cal-agenda strong{color:var(--primary-text-color)}
        .history-list{list-style:none;margin:0;padding:0}.history-entry{padding:11px 0;border-top:1px solid var(--divider-color);font-size:13px;line-height:1.45}.history-range{font-weight:600;color:var(--primary-text-color);overflow-wrap:anywhere}.history-metrics{display:flex;gap:6px 18px;flex-wrap:wrap;color:var(--secondary-text-color);margin-top:3px}.history-incomplete,.history-empty{font-size:12px;color:var(--secondary-text-color);margin-top:4px}.history-more{padding-left:0}
        .calendar{container-type:inline-size}.mobile-calendar,.mobile-hint{display:none}
        @container (max-width: 839px){
          .desktop-calendar,.desktop-hint{display:none}.mobile-calendar,.mobile-hint{display:block}
          .mobile-calendar{border:1px solid var(--divider-color);border-radius:12px;overflow:hidden;background:var(--card-background-color)}
          .mobile-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px;padding:8px 5px;border-bottom:1px solid var(--divider-color)}
          .mobile-day{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:0;min-height:62px;padding:3px 0;color:var(--secondary-text-color);font-size:10px;text-transform:uppercase}
          .mobile-day strong{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;font-size:15px;color:var(--primary-text-color)}
          .mobile-day[aria-pressed="true"] strong{background:var(--primary-color);color:var(--text-primary-color,#fff)}
          .mobile-day i{width:4px;height:4px;border-radius:50%;background:transparent}.mobile-day i.has-events{background:var(--primary-color)}
          .mobile-selected{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 12px;color:var(--primary-text-color);font-size:13px}
          .mobile-add{white-space:nowrap}.mobile-events{display:grid;gap:7px;padding:0 12px 12px}.mobile-empty{padding:12px 0;color:var(--secondary-text-color);font-size:13px}
          .mobile-event{display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0;border-left:4px solid #9b7130;border-radius:7px;padding:10px 8px;background:#e8b84f;color:#211906;font-size:13px;line-height:1.35}.mobile-event>div{min-width:0;overflow-wrap:anywhere}
          .mobile-event strong{font-weight:600}.mobile-event.marker-event{background:var(--secondary-background-color);border-left-color:var(--secondary-text-color);color:var(--primary-text-color)}
          .mobile-source{font-size:11px;margin-top:3px;opacity:.8}.mobile-remove{color:inherit;min-height:40px;padding:6px;white-space:nowrap;font-size:12px}
        }
      </style>
      <ha-card><div class="wrap">
        <div class="head"><div class="icon"><ha-icon icon="mdi:car-defrost-front"></ha-icon></div><div class="headtext"><div class="title">${mvEscape(title)}</div><div class="status">${mvEscape(statusText)}</div></div><span class="badge ${sw?.state === "on" ? "on" : ""}">${t("heater")} ${heating}</span></div>
        <div class="stats">
          <div><div class="label">${t("departure")}</div><div class="value">${mvEscape(this._date(a.next_departure))}</div></div>
          <div><div class="label">${t("plannedStart")}</div><div class="value">${mvEscape(this._date(a.planned_start))}</div></div>
          <div><div class="label">${t("temperature")}</div><div class="value">${mvEscape(temperature)}</div></div>
          <div><div class="label">${t("duration")}</div><div class="value">${currentRuntime !== null ? `${mvEscape(currentRuntime)} min` : a.next_departure && Number.isFinite(a.duration_minutes) ? `${mvEscape(a.duration_minutes)} min` : "–"}</div></div>
          ${showPower ? `<div class="power-stat"><div class="label">${t("currentPower")}</div><div class="value">${mvEscape(measuredPower)}</div></div>` : ""}
          ${showEnergy ? `<div class="energy-stat"><div class="label">${t("sessionEnergy")}</div><div class="value">${mvEscape(sessionEnergy)}</div></div>` : ""}
        </div>
        ${a.alarm_active === true && showPower && a.energy_monitor_status === "low_power" && sw?.state === "on" ? `<div class="notice power-alarm" role="alert">${t("powerAlarm")}</div>` : ""}
        ${meterWarnings.map(message => `<div class="hint meter-warning">${mvEscape(message)}</div>`).join("")}
        ${a.source ? `<div class="hint">${t("from")} ${mvEscape(String(mvStateText(h,a.source)).toLowerCase())}</div>` : ""}
        ${a.error ? `<div class="notice" role="status">${mvEscape(mvErrorText(h,a.error))}</div>` : ""}
        ${this._actionError ? `<div class="notice" role="alert">${mvEscape(this._actionError)}</div>` : ""}
        <div class="quick-actions">${a.owned ? `<button id="stop-now" ${!stopOk || this._pending ? "disabled" : ""}>${t("stopNow")}</button><span class="hint">${a.active_until ? `${t("plannedStop")} ${mvEscape(this._date(a.active_until))}` : t("owned")}</span>` : `<button class="primary" id="start-now" ${!startOk || this._pending ? "disabled" : ""}>${t("runNow")}</button><span class="hint">${sw?.state === "on" ? t("external") : sw?.state !== "off" ? t("unknownSwitch") : currentRuntime === null ? t("tempUnavailable") : currentRuntime <= 0 ? t("noRuntime") : `${t("runtimeFor")} ${mvEscape(currentRuntime)} min; ${t("runtimeOff")}`}</span>`}</div>
        <div class="calendar"><div class="calendar-title">${t("seven")}</div><div class="calendar-subtitle">${t("estimate")}${hasOverlap ? ` ${t("overlap")}` : ""} <span class="desktop-hint">${t("gridHint")}</span><span class="mobile-hint">${t("mobileHint")}</span></div>${hasSchedule ? calendarGrid : `<div class="cal-warning">${t("updateCalendar")}</div>`}${!calendarOk ? `<div class="hint">${t("updateAdd")}</div>` : ""}</div>
        <div class="section"><div class="sectionhead">${t("single")}</div><div class="manual"><div class="field"><label for="manual">${t("dateTime")}</label><input id="manual" type="datetime-local" value="${mvEscape(inputValue)}" ${!manualOk || this._pending ? "disabled" : ""}></div><div class="actions"><button class="primary" id="save" ${!manualOk || this._pending ? "disabled" : ""}>${t("save")}</button><button id="clear" ${!clearOk || this._pending ? "disabled" : ""}>${t("clear")}</button></div></div></div>
        <div class="section"><button class="expand" id="week" aria-expanded="${this._showWeek}"><span>${t("weekly")}</span><span class="small">${this._showWeek ? t("hide") : t("show")}</span></button>${this._showWeek ? weekRows : ""}</div>
        <div class="section history-section"><button class="expand" id="history-toggle" aria-expanded="${this._showHistory}"><span>${t("history")}${historyAvailable && history.length ? ` (${history.length})` : ""}</span><span class="small">${this._showHistory ? t("hide") : t("show")}</span></button>${this._showHistory ? historyBody : ""}</div>
        ${(!e.manual_entity || !e.weekly.some(x=>x.time && x.enabled)) ? `<div class="hint">${t("missingEntities")}</div>` : ""}
        <div class="hint">${t("configBefore")}<a href="/config/integrations/integration/motorvarmare" style="color:var(--primary-color)">${t("configLink")}</a>${t("configAfter")}</div>
      </div></ha-card>`;
    const newScroll=this.shadowRoot.querySelector(".cal-scroll");
    if (newScroll) {
      const autoTop=Math.max(0,(Math.floor((anchorSegment?.from ?? 7*60)/60)-1)*hourHeight);
      const anchorNow=!!anchorSegment && !this._calendarAnchored && !this._calendarUserScrolled;
      const nextScroll={top:anchorNow ? autoTop : (scrollPosition?.top ?? autoTop),left:scrollPosition?.left ?? 0};
      if (anchorSegment && (anchorNow || this._calendarUserScrolled)) this._calendarAnchored=true;
      if (this.isConnected && newScroll.clientHeight) {
        newScroll.scrollTop=nextScroll.top;newScroll.scrollLeft=nextScroll.left;
        this._desktopPosition={top:newScroll.scrollTop,left:newScroll.scrollLeft}; this._initialCalendarScroll=null;
      } else this._initialCalendarScroll=nextScroll;
      const markScroll=()=>{this._calendarUserScrolled=true;};
      newScroll.addEventListener("wheel",markScroll,{passive:true});
      newScroll.addEventListener("touchmove",markScroll,{passive:true});
      newScroll.addEventListener("pointerdown",ev=>{if (ev.target===newScroll) markScroll();});
      newScroll.addEventListener("keydown",ev=>{if (["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"].includes(ev.key)) markScroll();});
      newScroll.addEventListener("scroll",()=>{if (newScroll.clientHeight) this._desktopPosition={top:newScroll.scrollTop,left:newScroll.scrollLeft};});
    }
    const manualInput = this.shadowRoot.querySelector("#manual");
    manualInput?.addEventListener("input", (event) => {this._draft = event.target.value;});
    this.shadowRoot.querySelector("#save")?.addEventListener("click", async () => {
      const value = manualInput.value;
      if (!value) {this._actionError=t("chooseDate"); this._render(); return;}
      if (value <= this._inputDate(new Date().toISOString())) {this._actionError=t("future"); this._render(); return;}
      this._draft = value;
      if (await this._call("datetime", "set_value", {entity_id:e.manual_entity, datetime:value.length === 16 ? `${value}:00` : value})) {this._draft = null; this._render();}
    });
    this.shadowRoot.querySelector("#clear")?.addEventListener("click", async () => {if (await this._call("button", "press", {entity_id:e.clear_entity})) {this._draft = null; this._render();}});
    this.shadowRoot.querySelector("#start-now")?.addEventListener("click", () => this._call("button", "press", {entity_id:e.start_now}));
    this.shadowRoot.querySelector("#stop-now")?.addEventListener("click", () => this._call("button", "press", {entity_id:e.stop_now}));
    this.shadowRoot.querySelectorAll("[data-mobile-day]").forEach(el => el.addEventListener("click", () => {
      const key=el.dataset.mobileDay; this._mobileDay=key;this._mobileDayChosen=true;this._render();
      this.shadowRoot.querySelector(`[data-mobile-day="${key}"]`)?.focus({preventScroll:true});
    }));
    this.shadowRoot.querySelectorAll("[data-add-day]").forEach(el => el.addEventListener("click", () => { this._selectedDay=el.dataset.addDay; this._calendarTime="07:00"; this._render(); }));
    this.shadowRoot.querySelectorAll("[data-grid-day]").forEach(el => el.addEventListener("click", event => {
      if (!calendarOk || this._pending || event.target.closest(".cal-event")) return;
      const elapsed=(event.clientY-el.getBoundingClientRect().top)/hourHeight*60;
      const minute=Math.max(0,Math.min(23*60+45,Math.round(elapsed/15)*15));
      this._selectedDay=el.dataset.gridDay; this._calendarTime=`${String(Math.floor(minute/60)).padStart(2,"0")}:${String(minute%60).padStart(2,"0")}`; this._render();
    }));
    this.shadowRoot.querySelector("#cancel-calendar")?.addEventListener("click", () => { this._selectedDay=null; this._render(); });
    this.shadowRoot.querySelector("#calendar-time")?.addEventListener("input", event => { this._calendarTime=event.target.value; });
    this.shadowRoot.querySelector("#add-calendar")?.addEventListener("click", async () => {
      const value=this.shadowRoot.querySelector("#calendar-time")?.value, key=this._selectedDay;
      if (!value || !key) { this._actionError=t("chooseTime"); this._render(); return; }
      const start=`${key}T${value}`;
      if (start <= this._inputDate(new Date().toISOString())) { this._actionError=t("future"); this._render(); return; }
      const [y,m,d]=key.split("-").map(Number), [hour,minute]=value.split(":").map(Number);
      const end=new Date(Date.UTC(y,m-1,d,hour,minute+1)).toISOString().slice(0,19);
      this._calendarTime=value;
      if (await this._call("calendar","create_event",{entity_id:e.calendar,summary:t("eventSummary"),start_date_time:`${start}:00`,end_date_time:end})) { this._selectedDay=null; this._render(); }
    });
    this.shadowRoot.querySelectorAll("[data-remove-uid]").forEach(el => el.addEventListener("click", () => this._callWS({type:"calendar/event/delete",entity_id:e.calendar,uid:el.dataset.removeUid})));
    this.shadowRoot.querySelector("#week")?.addEventListener("click", () => {this._showWeek = !this._showWeek; this._render();});
    this.shadowRoot.querySelector("#history-toggle")?.addEventListener("click", () => {this._showHistory = !this._showHistory; this._render();});
    this.shadowRoot.querySelector("#history-more")?.addEventListener("click", () => {this._historyLimit += 10; this._render();});
    this.shadowRoot.querySelectorAll("[data-day-time]").forEach((el) => el.addEventListener("change", () => {if (el.value) this._call("time", "set_value", {entity_id:e.weekly[Number(el.dataset.dayTime)].time, time:`${el.value}:00`});}));
    this.shadowRoot.querySelectorAll("[data-day-switch]").forEach((el) => el.addEventListener("change", () => this._call("switch", el.checked ? "turn_on" : "turn_off", {entity_id:e.weekly[Number(el.dataset.daySwitch)].enabled})));
    if (focusedMobileDay) this.shadowRoot.querySelector(`[data-mobile-day="${focusedMobileDay}"]`)?.focus({preventScroll:true});
    if (focusedHistory) this.shadowRoot.querySelector(`#${focusedHistory}`)?.focus({preventScroll:true});
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
    if (selected && !states.some(s=>s.entity_id === selected)) options.unshift(`<option selected value="${mvEscape(selected)}">${mvEscape(selected)} (${mvText(this._hass,"missing")})</option>`);
    return `<option value="">${mvText(this._hass,"selectEntity")}</option>${options.join("")}`;
  }
  _render() {
    if (!this._hass) return;
    const c = this._config, t = key => mvText(this._hass,key);
    this.shadowRoot.innerHTML = `<style>:host{display:block} .fields{display:grid;gap:14px} label{display:grid;gap:5px;color:var(--secondary-text-color);font:14px Roboto,system-ui,sans-serif} input,select{font:14px Roboto,system-ui,sans-serif;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:6px;padding:10px;min-height:42px;width:100%;box-sizing:border-box} p{color:var(--secondary-text-color);font:13px/1.45 Roboto,system-ui,sans-serif;margin:0}</style>
      <div class="fields"><label>${t("cardTitle")}<input id="title" value="${mvEscape(c.title || "")}" placeholder="Motorvärmare"></label><label>${t("statusEntity")}<select id="status">${this._options("sensor",c.status_entity)}</select></label><p>${t("editorHint")}</p></div>`;
    this.shadowRoot.querySelector("#title").addEventListener("change", e=>this._set("title",e.target.value));
    this.shadowRoot.querySelector("#status").addEventListener("change", e=>this._set("status_entity",e.target.value));
  }
}

if (!customElements.get("motorvarmare-card")) customElements.define("motorvarmare-card", MotorvarmareCard);
if (!customElements.get("motorvarmare-card-editor")) customElements.define("motorvarmare-card-editor", MotorvarmareCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some(c=>c.type === "motorvarmare-card")) window.customCards.push({type:"motorvarmare-card", name:"Motorvärmare", description:"Motorvärmare / Engine heater schedule", preview:true});
