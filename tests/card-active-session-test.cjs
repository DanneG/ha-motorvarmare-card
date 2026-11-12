/* Run with Playwright available on NODE_PATH and Chrome installed. */
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

async function main() {
  const browser=await chromium.launch({headless:true,executablePath:process.env.MOTORVARMARE_BROWSER || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  try {
    const page=await browser.newPage({viewport:{width:Number(process.env.MV_PREVIEW_WIDTH || 390),height:900}});
    await page.clock.install({time:new Date('2026-11-12T08:25:00Z')});
    const errors=[]; page.on('pageerror',error=>errors.push(error.message));
    await page.setContent('<!doctype html><html><body></body></html>');
    await page.addStyleTag({content:'body{margin:0;padding:16px}motorvarmare-card{display:block;--primary-text-color:#eee;--secondary-text-color:#aaa;--card-background-color:#222;--secondary-background-color:#333;--divider-color:#555;--primary-color:#03a9d3;--text-primary-color:#fff}'});
    if (process.env.MV_PREVIEW_LIGHT) await page.addStyleTag({content:'body{background:#edf1f4}motorvarmare-card{max-width:800px;margin:auto;--primary-text-color:#1b2733;--secondary-text-color:#53677b;--card-background-color:#fff;--secondary-background-color:#f1f5f7;--divider-color:#d8e0e6;--primary-color:#007fac;--text-primary-color:#fff}'});
    else await page.addStyleTag({content:'body{background:#151719}motorvarmare-card{max-width:800px;margin:auto}'});
    await page.evaluate(()=>{
      customElements.define('ha-card',class extends HTMLElement{connectedCallback(){this.style.display='block'}});
      customElements.define('ha-icon',class extends HTMLElement{});
    });
    await page.addScriptTag({path:path.join(__dirname,'..','dist','ha-motorvarmare-card.js')});
    await page.evaluate(()=>{
      const controls={heater_switch:'switch.car',stop_now:'button.stop',extend_30:'button.extend',calendar:'calendar.car'};
      const attrs={friendly_name:'Bil status',control_entities:controls,owned:true,active_started_at:'2026-11-12T08:00:00Z',active_measurement_started_at:'2026-11-12T08:00:05Z',
        active_until:'2026-11-12T09:00:00Z',active_max_until:'2026-11-12T12:00:00Z',can_extend:true,
        power_sensor_configured:true,energy_sensor_configured:true,power_w:780,session_energy_kwh:0.35,active_session_cost:1.2,active_session_currency:'SEK',schedule_7_days:[],
        active_power_samples:[{at:'2026-11-12T08:00:00Z',watts:600},{at:'2026-11-12T08:05:00Z',watts:700},{at:'2026-11-12T08:10:00Z',watts:null},{at:'2026-11-12T08:15:00Z',watts:780}]};
      const states={'sensor.car':{entity_id:'sensor.car',state:'heating',attributes:attrs},'switch.car':{entity_id:'switch.car',state:'on',attributes:{}},'button.stop':{entity_id:'button.stop',state:'unknown',attributes:{}},'button.extend':{entity_id:'button.extend',state:'unknown',attributes:{}},'calendar.car':{entity_id:'calendar.car',state:'off',attributes:{}}};
      window.calls=[];window.hass={states,language:'sv',locale:{language:'sv'},config:{time_zone:'Europe/Stockholm'},async callService(d,s,v){window.calls.push({d,s,v});},async callWS(){}};
      const card=document.createElement('motorvarmare-card');card.setConfig({status_entity:'sensor.car'});card.hass=window.hass;document.body.appendChild(card);
    });
    const card=page.locator('motorvarmare-card');
    assert.match(await card.locator('.active-remaining').innerText(),/35 min kvar/);
    assert.equal(await card.locator('.active-progress').getAttribute('aria-valuenow'),'42');
    assert.match(await card.locator('.active-metrics').innerText(),/780 W[\s\S]*0,35 kWh[\s\S]*1,20 SEK/);
    assert.match(await card.locator('.active-measurement-since').innerText(),/Mätning sedan 09:00/);
    const graphPath=await card.locator('.active-chart path').getAttribute('d');
    assert.equal(graphPath.match(/M/g).length,2,'Missing data splits the line');
    assert.match(graphPath,/M0\.00 25\.00 L64\.00 25\.00 L64\.00 16\.50/,'Hold the previous power until the next observation instead of drawing an unsupported diagonal');
    await page.evaluate(()=>{window.hass.states['sensor.car'].attributes.active_measurement_started_at=null;document.querySelector('motorvarmare-card').hass={...window.hass}});
    assert.doesNotMatch(await card.locator('.active-metrics').innerText(),/0,35 kWh|1,20 SEK/,'Do not present an unbounded measurement period as a complete session');
    assert.match(await card.locator('.active-measurement-since').innerText(),/Mätningens starttid saknas/);
    await page.evaluate(()=>{window.hass.states['sensor.car'].attributes.active_measurement_started_at='2026-11-12T08:15:00Z';document.querySelector('motorvarmare-card').hass={...window.hass}});
    assert.match(await card.locator('.active-measurement-since').innerText(),/Mätning sedan 09:15/,'A resumed observation is labelled with its own start time');
    if (process.env.MV_PREVIEW_PATH) await page.screenshot({path:process.env.MV_PREVIEW_PATH,fullPage:true});
    await card.locator('#extend-30').click();
    assert.deepEqual(await page.evaluate(()=>window.calls.shift()),{d:'button',s:'press',v:{entity_id:'button.extend'}});
    await page.evaluate(()=>{window.hass.states['sensor.car'].attributes.active_until='2026-11-12T09:30:00Z';document.querySelector('motorvarmare-card').hass={...window.hass}});
    assert.match(await card.locator('.active-remaining').innerText(),/1 tim 5 min kvar/);
    await page.clock.fastForward(60000);
    assert.match(await card.locator('.active-remaining').innerText(),/1 tim 4 min kvar/,'Timer updates without HA state changes');
    await card.locator('#active-graph-toggle').click();
    assert.equal(await card.locator('.active-chart').count(),0);
    await page.evaluate(()=>{document.querySelector('motorvarmare-card').hass={...window.hass}});
    assert.equal(await card.locator('#active-graph-toggle').getAttribute('aria-expanded'),'false','Graph choice remains after HA updates');
    await page.evaluate(()=>{const a=window.hass.states['sensor.car'].attributes;a.active_max_until='2026-11-12T09:45:00Z';document.querySelector('motorvarmare-card').hass={...window.hass}});
    assert.match(await card.locator('#extend-30').innerText(),/Förläng till max/);
    await page.evaluate(()=>{const a=window.hass.states['sensor.car'].attributes;a.can_extend=false;a.active_until=a.active_max_until;document.querySelector('motorvarmare-card').hass={...window.hass}});
    assert.equal(await card.locator('#extend-30').isDisabled(),true);
    assert.match(await card.locator('.active-limit').innerText(),/Maximal värmetid/);
    await page.evaluate(()=>{const a=window.hass.states['sensor.car'].attributes;a.power_sensor_configured=false;a.energy_sensor_configured=false;document.querySelector('motorvarmare-card').hass={...window.hass}});
    assert.match(await card.locator('.active-no-sensor').innerText(),/Effektsensor saknas/);
    assert.equal(await card.locator('.active-progress').count(),1,'Timeline works without power sensor');
    await page.evaluate(()=>{window.hass.language='en';window.hass.locale.language='en';document.querySelector('motorvarmare-card').hass={...window.hass}});
    assert.match(await card.locator('.active-header').innerText(),/Heating in progress/);
    assert.deepEqual(errors,[]);
    console.log('PASS: active timeline, power gaps, extension, missing sensors and translations');
  } finally {await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1});
