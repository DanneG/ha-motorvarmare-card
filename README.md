# Motorvärmare – kort för Home Assistant

Ett kort för att visa och planera bilens motorvärmare i Home Assistant. Kortet visar status, nästa avresa, planerad start, utetemperatur och gångtid. Du kan ställa in en enstaka avresa och ändra veckoschemat direkt från kortet.

![Två motorvärmarkort med simulerade exempeluppgifter](docs/preview.png)

Bilden visar simulerade exempel och inga riktiga kalenderuppgifter.

## Förutsättningar

Installera och konfigurera först den separata [Motorvärmare-integrationen](https://github.com/DanneG/ha-motorvarmare). Lägg till en bil med brytare och utetemperatursensor. Kortet hämtar bilens entiteter från integrationens **Status**-entitet och fungerar inte på egen hand. Använd den version av integrationen som innehåller attributet `control_entities`.

Google Kalender är valfri och ställs in i integrationen. Kalender, brytare, temperatursensor och gångtider ändras via integrationens inställningar. Kortet erbjuder en länk dit.

## Installation via Marketplace eller HACS

Installera **Motorvärmare – kort** från Marketplace om kortet finns i katalogen. Annars kan du lägga till `https://github.com/DanneG/ha-motorvarmare-card` som ett eget förråd med typen **Dashboard** och sedan installera det. I HACS används menyn **Egna förråd / Custom repositories**. Marketplace och HACS är separata alternativ; vad som är tillgängligt beror på din Home Assistant-version. Se [Marketplace](https://contributors.home-assistant.io/marketplace/) eller [HACS instruktioner för egna förråd](https://hacs.xyz/docs/faq/custom_repositories/).

Efter installationen: uppdatera webbläsaren, öppna översikten och välj **Redigera → Lägg till kort → Motorvärmare**. Välj bilens **Status**-entitet och ange ett valfritt kortnamn. Lägg till ytterligare ett kort för en annan bil.

Om kortet inte visas, kontrollera att JavaScript-resursen är registrerad under **Inställningar → Kontrollpaneler → ⋮ → Resurser**. Vid installation via HACS används normalt `/hacsfiles/ha-motorvarmare-card/ha-motorvarmare-card.js` som JavaScript-modul. En omladdning utan cache kan behövas.

## Manuell installation

1. Kopiera [`dist/ha-motorvarmare-card.js`](dist/ha-motorvarmare-card.js) till `config/www/ha-motorvarmare-card.js` på din Home Assistant. Skapa `www` om mappen saknas; starta i så fall om Home Assistant.
2. Lägg till `/local/ha-motorvarmare-card.js` som **JavaScript-modul** under **Inställningar → Kontrollpaneler → ⋮ → Resurser**. Om Resurser saknas kan avancerat läge behöva aktiveras i användarprofilen.
3. Uppdatera webbläsaren och lägg till kortet på din översikt. Välj bilens Status-entitet.

För YAML-läge kan du använda följande exempel och ersätta entitets-ID:t med bilens verkliga Status-entitet:

```yaml
type: custom:motorvarmare-card
title: Bil 1
status_entity: sensor.bil_1_status
```

## Styrning och säkerhet

Kortet visar det tillstånd som brytaren rapporterar. Värmningen styrs av integrationen. Home Assistant och Zigbee behöver fungera för att ett avstängningskommando ska nå brytaren; använd en oberoende maxtimer som skydd vid kommunikationsavbrott. Kontrollera start och avstängning på den faktiska utrustningen innan du använder lösningen utan uppsikt.

## Licens

[MIT](LICENSE).

