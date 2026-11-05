# Motorvärmare – kort för Home Assistant

[English](../README.md) · Svenska

Kortet visar motorvärmarens status, utetemperatur, nästa avresa och beräknad starttid. Du kan starta eller stoppa en uppvärmning och planera avresor för de kommande sju dagarna. Flera avresor kan läggas till samma dag i bilens egen kalender. Kortet följer Home Assistants svenska eller engelska språkval.

![Motorvärmarkort med simulerade exempel](preview.png)

## Installera

Installera först [Motorvärmare-integrationen](https://github.com/DanneG/ha-motorvarmare) och konfigurera en bil med brytare och utetemperatursensor. Installera sedan `https://github.com/DanneG/ha-motorvarmare-card` som ett eget förråd av typen **Dashboard** i Marketplace eller HACS. Uppdatera webbläsaren, lägg till kortet **Motorvärmare** på en kontrollpanel och välj bilens statusentitet. Upprepa för ytterligare bilar.

För manuell installation: kopiera [`dist/ha-motorvarmare-card.js`](../dist/ha-motorvarmare-card.js) till `config/www/ha-motorvarmare-card.js`, lägg till `/local/ha-motorvarmare-card.js` som en JavaScript-modul under **Inställningar → Kontrollpaneler → ⋮ → Resurser** och uppdatera webbläsaren. Starta om Home Assistant om du just skapade `www`.

## Användning

Kalendern visar sju lokala kalenderdagar med de beräknade uppvärmningarna som block på en tidsaxel. Välj en dag och lägg till en eller flera avresetider. De sparas i bilens egen Home Assistant-kalender; Google Kalender ändras inte. Avresor från Google och veckoschemat kan också visas. Planerade starttider bygger på den aktuella utetemperaturen och kan ändras när temperaturen ändras.

**Starta nu** kör värmaren under tiden som formeln `30 − 1,5 × temperatur i °C` ger. **Stoppa** avbryter en uppvärmning som integrationen själv styr. Kalender, temperaturgivare och brytare ändras i integrationens inställningar.

Prova start och avstängning på den faktiska utrustningen. En oberoende maxtimer rekommenderas eftersom Home Assistant eller Zigbee kan vara otillgängligt.

## Licens

[MIT](../LICENSE).
