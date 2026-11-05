/* Run with Playwright available on NODE_PATH and Chrome installed. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

async function main() {
  const browser = await chromium.launch({ headless:true, executablePath:process.env.MOTORVARMARE_BROWSER || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent('<!doctype html><html><body></body></html>');
    await page.setViewportSize({width:640,height:1100});
    await page.addStyleTag({content:`body{margin:0;background:#f1f5f8;padding:24px;font-family:Roboto,Arial,sans-serif} motorvarmare-card{--primary-text-color:#162f3c;--secondary-text-color:#5b7180;--card-background-color:#fff;--secondary-background-color:#eef4f6;--divider-color:#dce6eb;--primary-color:#087c99;--text-primary-color:#fff;display:block;max-width:560px;margin:auto}`});
    await page.evaluate(()=>{
      customElements.define('ha-card',class extends HTMLElement{connectedCallback(){Object.assign(this.style,{display:'block',background:'#fff',borderRadius:'15px',boxShadow:'0 3px 20px #173a4c1a'});}});
      customElements.define('ha-icon',class extends HTMLElement{connectedCallback(){this.textContent='🚗';}});
    });
    await page.addScriptTag({path:path.join(__dirname, '..', 'dist', 'ha-motorvarmare-card.js')});
    await page.evaluate(() => {
      const controls = {
        manual_departure:'datetime.car_manual', clear_departure:'button.car_clear', heater_switch:'switch.car_heater',
        calendar:'calendar.car_schedule', start_now:'button.car_start', stop_now:'button.car_stop',
        weekly_times:Array.from({length:7}, (_,i)=>`time.car_${i}`), weekly_enabled:Array.from({length:7}, (_,i)=>`switch.car_${i}`),
      };
      const states = {
        'sensor.car_status':{entity_id:'sensor.car_status', state:'waiting_to_start',attributes:{friendly_name:'Car Status',control_entities:controls,temperature:-4,current_duration_minutes:36,owned:false,schedule_7_days:[]}},
        'datetime.car_manual':{entity_id:'datetime.car_manual',state:'unknown',attributes:{}},
        'button.car_clear':{entity_id:'button.car_clear',state:'unknown',attributes:{}},
        'button.car_start':{entity_id:'button.car_start',state:'unknown',attributes:{}},
        'button.car_stop':{entity_id:'button.car_stop',state:'unknown',attributes:{}},
        'calendar.car_schedule':{entity_id:'calendar.car_schedule',state:'off',attributes:{}},
        'switch.car_heater':{entity_id:'switch.car_heater',state:'off',attributes:{}},
      };
      controls.weekly_times.forEach(id=>states[id]={entity_id:id,state:'07:00:00',attributes:{}});
      controls.weekly_enabled.forEach(id=>states[id]={entity_id:id,state:'off',attributes:{}});
      window.calls=[];
      window.hass={states,language:'sv',locale:{language:'sv'},config:{time_zone:'Europe/Stockholm'},
        async callService(domain,service,data){ window.calls.push({domain,service,data}); },
        async callWS(data){ window.calls.push({ws:data}); }};
      const card=document.createElement('motorvarmare-card');
      card.setConfig({status_entity:'sensor.car_status',title:'Bil 1'});
      card.hass=window.hass;
      const tomorrow=card._dayKeys()[1], fourth=card._dayKeys()[3], fifth=card._dayKeys()[4];
      states['sensor.car_status'].attributes.schedule_7_days=[
        {departure:`${tomorrow}T09:30:00Z`,start:`${tomorrow}T08:54:00Z`,source:'Planerad',uid:'one',removable:true,duration_minutes:36},
        {departure:`${tomorrow}T15:30:00Z`,start:`${tomorrow}T14:54:00Z`,source:'Kalender',duration_minutes:36},
        {departure:`${fourth}T06:30:00Z`,start:`${fourth}T05:54:00Z`,source:'Veckoschema',duration_minutes:36},
        {departure:`${fifth}T07:00:00Z`,start:`${fifth}T06:24:00Z`,source:'Planerad',uid:'two',removable:true,duration_minutes:36},
      ];
      const attrs=states['sensor.car_status'].attributes;
      attrs.next_departure=attrs.schedule_7_days[0].departure; attrs.planned_start=attrs.schedule_7_days[0].start; attrs.duration_minutes=36; attrs.source='Planerad';
      card.hass=window.hass;
      document.body.appendChild(card);
    });
    const card=page.locator('motorvarmare-card');
    assert.match(await card.locator('.wrap').innerText(),/Väntar på start/);
    assert.match(await card.locator('.wrap').innerText(),/Värmer i 36 min/);
    assert.equal(await card.locator('.cal-day').count(),7);
    assert.equal(await card.locator('.cal-entry').count(),4);
    assert.equal(await card.locator('[data-remove-uid]').count(),2);
    if (process.env.MOTORVARMARE_PREVIEW_PATH) await page.screenshot({path:process.env.MOTORVARMARE_PREVIEW_PATH,fullPage:true});
    await card.locator('#start-now').click();
    assert.deepEqual((await page.evaluate(()=>window.calls.shift())),{domain:'button',service:'press',data:{entity_id:'button.car_start'}});
    await page.evaluate(()=>{window.hass.states['sensor.car_status'].attributes.owned=true;window.hass.states['switch.car_heater'].state='on';document.querySelector('motorvarmare-card').hass={...window.hass};});
    await card.locator('#stop-now').click();
    assert.deepEqual((await page.evaluate(()=>window.calls.shift())),{domain:'button',service:'press',data:{entity_id:'button.car_stop'}});
    const tomorrow=await page.evaluate(()=>document.querySelector('motorvarmare-card')._dayKeys()[1]);
    await card.locator(`[data-add-day="${tomorrow}"]`).click();
    await card.locator('#calendar-time').fill('11:15');
    await card.locator('#add-calendar').click();
    const add=await page.evaluate(()=>window.calls.shift());
    assert.deepEqual(add,{domain:'calendar',service:'create_event',data:{entity_id:'calendar.car_schedule',summary:'Avresa',start_date_time:`${tomorrow}T11:15:00`,end_date_time:`${tomorrow}T11:16:00`}});
    await card.locator(`[data-add-day="${tomorrow}"]`).click();
    await card.locator('#calendar-time').fill('14:30');
    await card.locator('#add-calendar').click();
    const second=await page.evaluate(()=>window.calls.shift());
    assert.equal(second.data.start_date_time,`${tomorrow}T14:30:00`);
    assert.equal(second.data.end_date_time,`${tomorrow}T14:31:00`);
    await card.locator('[data-remove-uid="one"]').click();
    assert.deepEqual((await page.evaluate(()=>window.calls.shift())),{ws:{type:'calendar/event/delete',entity_id:'calendar.car_schedule',uid:'one'}});
    await page.evaluate(()=>{window.hass.locale.language='en';window.hass.states['sensor.car_status'].attributes.error='Kunde inte stänga av brytaren; försöker igen; Kalendern kan inte läsas; se Home Assistants logg';document.querySelector('motorvarmare-card').hass={...window.hass};});
    assert.match(await card.locator('.wrap').innerText(),/Next 7 days/);
    assert.match(await card.locator('.wrap').innerText(),/Waiting to start/);
    assert.match(await card.locator('.wrap').innerText(),/Scheduled/);
    assert.match(await card.locator('.wrap').innerText(),/Could not turn off the switch; retrying; Calendar could not be read/);
    assert.doesNotMatch(await card.locator('.wrap').innerText(),/Kommande 7 dagar/);
    await page.evaluate(()=>{const a=window.hass.states['sensor.car_status'].attributes;a.schedule_7_days[1].start=a.schedule_7_days[0].start;a.current_duration_minutes=0;a.owned=false;window.hass.states['switch.car_heater'].state='off';document.querySelector('motorvarmare-card').hass={...window.hass};});
    assert.match(await card.locator('.wrap').innerText(),/Overlapping times/);
    assert.match(await card.locator('.wrap').innerText(),/formula gives no heating time/);
    assert.equal(await card.locator('#start-now').isDisabled(),true);
    await page.setViewportSize({width:320,height:1000});
    const fits=await card.evaluate(el=>el.scrollWidth<=el.clientWidth);
    assert.equal(fits,true,'Card must not overflow on a narrow screen');
    const editor=await page.evaluate(()=>{const x=customElements.get('motorvarmare-card').getConfigElement();x.setConfig({});x.hass=window.hass;document.body.appendChild(x);return x.localName;});
    assert.equal(editor,'motorvarmare-card-editor');
    assert.match(await page.locator('motorvarmare-card-editor').innerText().catch(()=>''),/^$/); // Content is in shadow DOM.
    assert.equal(await page.locator('motorvarmare-card-editor').locator('label').first().innerText(),'Card title');
    assert.deepEqual(errors,[]);
    console.log('PASS: seven-day calendar, multiple departures, start/stop, create, delete and Swedish/English');
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
