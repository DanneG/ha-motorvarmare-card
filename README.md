# Engine Heater Card for Home Assistant

English · [Svenska](docs/README.sv.md)

A dashboard card for the engine heater integration. It shows heater status, outdoor temperature, the next departure and estimated start. Start or stop a heating session and plan departures in a browsable seven-day calendar. Multiple departure times can be added to the same day in the car's own calendar. The card follows Home Assistant's English or Swedish language setting.

## Installation

First install the separate [Engine Heater integration](https://github.com/DanneG/ha-motorvarmare) and configure a car with a switch and outdoor sensor. Then add `https://github.com/DanneG/ha-motorvarmare-card` as a custom repository with category **Dashboard** in Marketplace or HACS and install it. Reload the browser, add **Motorvärmare** to a dashboard, and select the car's status entity. Repeat for additional cars.

For manual installation, copy [`dist/ha-motorvarmare-card.js`](dist/ha-motorvarmare-card.js) to `config/www/ha-motorvarmare-card.js`. Add `/local/ha-motorvarmare-card.js` as a JavaScript module under **Settings → Dashboards → ⋮ → Resources**, then reload the browser. Restart Home Assistant if you just created the `www` directory.

To see several cars together, add **Motorvärmare – översikt** and choose each car’s status entity in the visual editor. Select a car to open its full card; the individual cards remain available.

## Using the card

The calendar shows each estimated heating period on a seven-day time grid and lets you browse forward. On narrow cards, select a day to see its departures in a compact list. Add one or more departure times per day, as one-time or recurring events. You can edit or remove one local occurrence or an entire series. These are stored in the car's own Home Assistant calendar; Google Calendar is not modified. Google Calendar and weekly-schedule departures can also be displayed. Planned start times are estimates and can change as the temperature changes.

**Start now** runs the heater for the time calculated from the outdoor temperature using [M Sverige's engine-focused recommendations based on Calix](https://msverige.se/allt-om-bilen/service-och-underhall/motorvarmare/). **Stop** cancels a heating session controlled by the integration. The integration chooses no heating above +10 °C and caps heating at 180 minutes below −20 °C; the source does not specify these limits. An active heating session stops above +10 °C. After a temperature stop, scheduled heating can restart at +9.5 °C or below if the departure is still relevant, even after a Home Assistant restart; a manually started session does not restart automatically. An unavailable temperature reading does not stop an active session. In the integration's settings for each car, an optional setting (off by default) keeps scheduled heating running for 30 extra minutes after departure, in addition to the calculated pre-departure heating time. It does not extend **Start now** sessions; the temperature limit still applies. Calendar, outdoor sensor and switch settings are configured in the integration.

If optional power and energy sensors are configured in the integration, the card displays their readings and alerts. See the integration instructions for sensor requirements and notification settings.

Open the heating history to see recent sessions and their measured energy when available, plus daily, weekly and monthly summaries. They cover the latest 1,000 recorded completed sessions. A period crossing, missing energy reading or incomplete coverage is marked; energy from a crossing session is assigned to its end date and can make that period's sum too high. The integration starts collecting history from version 0.7.0.

Test start and stop with the actual equipment. An independent maximum-run timer is recommended in case Home Assistant cannot communicate with the switch.

Optionally choose a weather entity offering hourly forecasts. The calendar shows forecast-based estimates and labels their source; if a forecast is unavailable or outside its coverage, it uses the current measured temperature instead. Forecasts affect the calendar display only: actual switching is still based on the measured temperature. Weather access is checked for the current user.

Use **Skip next** to skip the next departure without changing the calendar, or pause automatic heating for one car until resumed manually or at the selected time. Pausing stops a scheduled session controlled by the integration; a manually started session remains independently controlled. Optional operational alerts warn about switch, sensor and calendar problems, in Home Assistant and through the selected notification entity. The stale-reading threshold is configurable; unavailable reporting timestamps are not interpreted as stale.

Optionally choose a fixed electricity price per kWh or a price sensor and currency. If a sensor is selected, its price at the session's end is used; no fixed-price fallback is silently substituted if that sensor is unavailable. The displayed cost is an **estimate**, not a time-weighted bill, and older sessions are not priced retroactively. Missing readings or mixed currencies are marked incomplete.

## License

[MIT](LICENSE).
