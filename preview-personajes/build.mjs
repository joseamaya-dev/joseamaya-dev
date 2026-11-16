import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import { characterSVG, MISSIONARIES, JUDGE, ACCUSERS } from './characters.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const dir = new URL('.', import.meta.url).pathname;

const font = `font-family: Inter, system-ui, sans-serif;`;

// ---------- Ficha de personajes ----------
const big = (c) => `
  <div class="big">
    <div class="pic" style="background:${c.bg}">${characterSVG(c, { width: 300, height: 400 })}</div>
    <div class="nm">${c.name}</div><div class="rl">${c.role}</div>
  </div>`;
const small = (c) => `
  <div class="sm">
    <div class="pic">${characterSVG(c, { width: 240, height: 320 })}</div>
    <div class="nm">${c.name}</div><div class="rl">${c.role}</div>
  </div>`;

const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#F6F1E7;${font};color:#1F1B16;width:1200px}
  .wrap{padding:48px 48px 56px}
  h1{font-size:44px;margin:0;letter-spacing:-.5px}
  .sub{color:#6B6257;font-size:18px;margin:6px 0 30px}
  h2{font-size:15px;letter-spacing:2px;text-transform:uppercase;color:#8A6D3B;margin:34px 0 14px}
  .row{display:flex;gap:28px}
  .big{flex:1;text-align:center}
  .big .pic{border-radius:22px;height:400px;display:flex;justify-content:center;align-items:flex-end;overflow:hidden}
  .nm{font-weight:700;font-size:19px;margin-top:10px}
  .rl{color:#6B6257;font-size:14px;margin-top:2px}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
  .sm{text-align:center}
  .sm .pic{background:#E9E1D2;border-radius:18px;height:320px;display:flex;justify-content:center;align-items:flex-end;overflow:hidden}
  .sm .nm{font-size:16px}
  .sm .rl{font-size:13px}
</style></head><body><div class="wrap">
  <h1>El día de la defensa</h1>
  <div class="sub">Propuesta de personajes · estilo 2D plano, listos para animar (boca, parpadeo, gestos)</div>
  <h2>Defensa y juez</h2>
  <div class="row">${MISSIONARIES.map(big).join('')}${big(JUDGE)}</div>
  <h2>La acusación</h2>
  <div class="grid">${ACCUSERS.map(small).join('')}</div>
</div></body></html>`;

// ---------- Fotograma de ejemplo 1080x1920 ----------
const cook = ACCUSERS.find((a) => a.id === 'cook');
let panels = '';
for (let x = 0; x < 1080; x += 135) panels += `<rect x="${x + 12}" y="300" width="111" height="520" rx="6" fill="rgba(0,0,0,.07)"/>`;

const scene = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;width:1080px;height:1920px;overflow:hidden;${font};background:#3B2A1E}
  .abs{position:absolute}
</style></head><body>
  <svg class="abs" style="left:0;top:0" width="1080" height="1920" viewBox="0 0 1080 1920">
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8C6440"/><stop offset="1" stop-color="#6E4A2C"/></linearGradient>
      <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A22"/><stop offset="1" stop-color="#3E2716"/></linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#wall)"/>
    ${panels}
    <rect y="820" width="1080" height="1100" fill="#4A3221"/>
    <circle cx="540" cy="380" r="70" fill="#C9A64B" opacity=".9"/>
    <circle cx="540" cy="380" r="54" fill="none" stroke="#7A5A1E" stroke-width="5"/>
    <path d="M500 400 L580 400 M540 340 L540 400 M510 360 L570 360 M510 360 L500 392 M570 360 L580 392" stroke="#7A5A1E" stroke-width="5" fill="none" stroke-linecap="round"/>
  </svg>
  <div class="abs" style="left:390px;top:470px">${characterSVG(JUDGE, { width: 300, height: 400, mouth: 'neutral' })}</div>
  <svg class="abs" style="left:0;top:690px" width="1080" height="200"><rect x="250" y="0" width="580" height="200" rx="10" fill="url(#d2)"/>
    <defs><linearGradient id="d2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A4529"/><stop offset="1" stop-color="#4A2F1B"/></linearGradient></defs>
    <rect x="250" y="0" width="580" height="16" fill="#7E5634"/>
    <rect x="460" y="60" width="160" height="44" rx="6" fill="#C9A64B"/>
    <text x="540" y="90" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-weight="700" fill="#3B2A12">JUEZ</text></svg>

  <div class="abs" style="left:-30px;top:830px">${characterSVG(cook, { width: 540, height: 720, mouth: 'open' })}</div>
  <div class="abs" style="left:560px;top:960px">${characterSVG(MISSIONARIES[0], { width: 400, height: 533, mouth: 'neutral' })}</div>
  <div class="abs" style="left:730px;top:985px">${characterSVG(MISSIONARIES[1], { width: 390, height: 520, mouth: 'neutral' })}</div>

  <svg class="abs" style="left:0;top:1420px" width="1080" height="500"><rect width="1080" height="500" fill="url(#d3)"/>
    <defs><linearGradient id="d3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A22"/><stop offset="1" stop-color="#2E1D10"/></linearGradient></defs>
    <rect width="1080" height="18" fill="#7E5634"/></svg>

  <div class="abs" style="left:0;top:0;width:1080px;height:250px;background:linear-gradient(#141010,rgba(20,16,16,.85));"></div>
  <div class="abs" style="left:60px;top:70px;color:#E8C766;font-size:26px;font-weight:700;letter-spacing:4px">EL DÍA DE LA DEFENSA · EP. 1</div>
  <div class="abs" style="left:60px;top:112px;width:960px;color:#fff;font-size:60px;font-weight:800;line-height:1.05;letter-spacing:-1px">¿Ya fue revelada <span style="color:#E8C766">TODA</span> la verdad?</div>

  <div class="abs" style="left:50px;top:1440px;width:980px;background:rgba(255,255,255,.96);border-radius:28px;padding:34px 40px;box-sizing:border-box;box-shadow:0 10px 30px rgba(0,0,0,.35)">
    <div style="font-size:26px;font-weight:800;letter-spacing:2px;color:#8A6D3B;margin-bottom:10px">PADRE COOK <span style="font-weight:500;letter-spacing:0;color:#8C8378">· Ortodoxo griego</span></div>
    <div style="font-size:44px;font-weight:700;line-height:1.25;color:#1F1B16">Cristo prometió que el Espíritu guiaría a los apóstoles a <span style="background:#E8C766;padding:0 8px;border-radius:8px">toda la verdad</span>. ¿Para qué más revelación?</div>
    <div style="margin-top:20px;display:inline-block;background:#1F2A44;color:#fff;font-size:28px;font-weight:700;border-radius:12px;padding:10px 18px">📖 Juan 16:13</div>
  </div>

  <div class="abs" style="left:60px;top:1872px;width:960px;height:10px;border-radius:5px;background:rgba(255,255,255,.2)"></div>
  <div class="abs" style="left:60px;top:1872px;width:330px;height:10px;border-radius:5px;background:#E8C766"></div>
  <div class="abs" style="left:60px;top:1815px;color:#E9DFCF;font-size:26px;font-weight:600">La respuesta de los élderes, en el siguiente clip →</div>
</body></html>`;

writeFileSync(dir + 'sheet.html', sheet);
writeFileSync(dir + 'scene.html', scene);

const browser = await chromium.launch();
const p1 = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
await p1.goto('file://' + dir + 'sheet.html');
await p1.screenshot({ path: dir + 'personajes.png', fullPage: true });
const p2 = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await p2.goto('file://' + dir + 'scene.html');
await p2.screenshot({ path: dir + 'fotograma-ejemplo.png' });
await browser.close();
console.log('ok');
