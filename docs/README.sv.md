# Motorvärmare – kort för Home Assistant

[English](../README.md) · Svenska

Kortet visar motorvärmarens status, utetemperatur, nästa avresa och beräknad starttid. Du kan starta eller stoppa en uppvärmning och planera avresor för de kommande sju dagarna. Flera avresor kan läggas till samma dag i bilens egen kalender. Kortet följer Home Assistants svenska eller engelska språkval.

![Motorvärmarkort med simulerade exempel](preview.png)

## Installera

Installera först [Motorvärmare-integrationen](https://github.com/DanneG/ha-motorvarmare) och konfigurera en bil med brytare och utetemperatursensor. Installera sedan `https://github.com/DanneG/ha-motorvarmare-card` som ett eget förråd av typen **Dashboard** i Marketplace eller HACS. Uppdatera webbläsaren, lägg till kortet **Motorvärmare** på en kontrollpanel och välj bilens statusentitet. Upprepa för ytterligare bilar.

För manuell installation: kopiera [`dist/ha-motorvarmare-card.js`](../dist/ha-motorvarmare-card.js) till `config/www/ha-motorvarmare-card.js`, lägg till `/local/ha-motorvarmare-card.js` som en JavaScript-modul under **Inställningar → Kontrollpaneler → ⋮ → Resurser** och uppdatera webbläsaren. Starta om Home Assistant om du just skapade `www`.

## Användning

Kalendern visar sju lokala kalenderdagar med de beräknade uppvärmningarna som block på en tidsaxel och kan bläddras framåt. På smala kort kan du välja en dag och se dess avresor i en kompakt lista. Lägg till en eller flera engångs- eller återkommande avresetider per dag. Du kan ändra eller ta bort en enskild lokal avresa eller en hel serie. De sparas i bilens egen Home Assistant-kalender; Google Kalender ändras inte. Avresor från Google och veckoschemat kan också visas. Planerade starttider bygger på den aktuella utetemperaturen och kan ändras när temperaturen ändras.

**Starta nu** kör värmaren under den tid som beräknas från utetemperaturen enligt [M Sveriges rekommendationer för motorns bästa utifrån Calix](https://msverige.se/allt-om-bilen/service-och-underhall/motorvarmare/). **Stoppa** avbryter en uppvärmning som integrationen själv styr. Integrationen väljer ingen uppvärmning över +10 °C och högst 180 minuter under −20 °C; källan anger inga tider utanför intervallet. En pågående värmning stoppas över +10 °C. Efter ett temperaturstopp kan schemalagd värmning starta igen vid +9,5 °C eller kallare om avresan fortfarande är aktuell, även efter omstart av Home Assistant; en manuellt startad värmning startar inte om automatiskt. En otillgänglig temperatursensor stoppar inte en pågående värmning. I integrationens inställningar för varje bil finns ett val (avstängt som standard) som låter schemalagd värmning fortsätta i 30 minuter efter avresan, utöver den beräknade uppvärmningen före avresan. Det förlänger inte körningar med **Starta nu**; temperaturspärren gäller fortfarande. Kalender, temperaturgivare och brytare ändras i integrationens inställningar.

Om du väljer effekt- eller energisensor i integrationens inställningar visar kortet mätvärden och eventuella varningar. Se [exempel på energiövervakning](preview-energy.png) och integrationens instruktioner för sensorkrav och notisinställningar.

Öppna [historiken](preview-history.png) för att se tidigare körningar och uppmätt energi när den finns samt summor per dag, vecka och månad. De täcker de 100 senaste registrerade avslutade körningarna. Saknade mätvärden, ofullständig täckning och körningar som passerar en periodgräns markeras; energin från en sådan körning räknas till slutdatumet och kan ge en för hög summa i slutperioden. Integrationen börjar samla historik från version 0.7.0.

Prova start och avstängning på den faktiska utrustningen. En oberoende maxtimer rekommenderas om Home Assistant inte kan kommunicera med brytaren.

## Licens

[MIT](../LICENSE).
