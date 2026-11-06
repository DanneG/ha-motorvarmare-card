# Engine Heater Card for Home Assistant

English · [Svenska](docs/README.sv.md)

A dashboard card for the engine heater integration. It shows heater status, outdoor temperature, the next departure and estimated start. Start or stop a heating session and plan departures over the next seven days. Multiple departure times can be added to the same day in the car's own calendar. The card follows Home Assistant's English or Swedish language setting.

![Engine heater card with simulated example data](docs/preview.png)

## Installation

First install the separate [Engine Heater integration](https://github.com/DanneG/ha-motorvarmare) and configure a car with a switch and outdoor sensor. Then add `https://github.com/DanneG/ha-motorvarmare-card` as a custom repository with category **Dashboard** in Marketplace or HACS and install it. Reload the browser, add **Motorvärmare** to a dashboard, and select the car's status entity. Repeat for additional cars.

For manual installation, copy [`dist/ha-motorvarmare-card.js`](dist/ha-motorvarmare-card.js) to `config/www/ha-motorvarmare-card.js`. Add `/local/ha-motorvarmare-card.js` as a JavaScript module under **Settings → Dashboards → ⋮ → Resources**, then reload the browser. Restart Home Assistant if you just created the `www` directory.

## Using the card

The calendar shows each estimated heating period on a seven-day time grid. On narrow cards, select a day to see its departures in a compact list. Add one or more departure times per day. These are stored in the car's own Home Assistant calendar; Google Calendar is not modified. Google Calendar and weekly-schedule departures can also be displayed. Planned start times use the current outdoor temperature and can change as the temperature changes.

**Start now** runs the heater for the duration calculated by `30 − 1.5 × temperature in °C`. **Stop** cancels a heating session controlled by the integration. Calendar, outdoor sensor and switch settings are configured in the integration.

If optional power and energy sensors are configured in the integration, the card displays their readings and alerts. See the [energy-monitoring example](docs/preview-energy.png) and the integration instructions for sensor requirements and notification settings.

Test start and stop with the actual equipment. An independent maximum-run timer is recommended in case Home Assistant cannot communicate with the switch.

## License

[MIT](LICENSE).
