// Generador de personajes en SVG (estilo plano 2D). viewBox 0 0 300 400.
// Las mismas piezas se reutilizarán como componentes en Remotion.

const SKIN = {
  s1: '#F3D5BF', s2: '#E6B48F', s3: '#C98B5E', s4: '#99623F', s5: '#5E3A26',
};

const shade = 'rgba(0,0,0,0.14)';

function hairBack(c) {
  if (c.hair === 'long') {
    return `<path d="M78 165 Q66 66 150 62 Q234 66 222 165 L230 250 Q204 262 190 238 L190 150 L110 150 L110 238 Q96 262 70 250 Z" fill="${c.hairColor}"/>`;
  }
  if (c.hair === 'bun') {
    return `<circle cx="150" cy="70" r="26" fill="${c.hairColor}"/>`;
  }
  return '';
}

function hairFront(c) {
  const f = c.hairColor;
  switch (c.hair) {
    case 'short':
      return `<path d="M86 152 Q80 76 150 70 Q222 74 214 152 Q212 118 196 104 Q160 118 110 102 Q92 116 86 152 Z" fill="${f}"/>`;
    case 'sidepart':
      return `<path d="M86 154 Q76 74 152 68 Q226 72 214 152 Q208 112 186 98 Q140 110 120 90 Q96 110 86 154 Z" fill="${f}"/>
              <path d="M120 90 Q130 84 142 82" stroke="rgba(0,0,0,.18)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 'pompadour':
      return `<path d="M86 150 Q72 64 150 52 Q232 60 214 150 Q206 110 190 100 Q150 112 112 98 Q94 110 86 150 Z" fill="${f}"/>`;
    case 'balding':
      return `<path d="M88 168 Q84 122 102 104 Q96 136 100 168 Z" fill="${f}"/>
              <path d="M212 168 Q216 122 198 104 Q204 136 200 168 Z" fill="${f}"/>`;
    case 'curly': {
      let s = '';
      const pts = [[94, 118], [104, 96], [124, 82], [150, 76], [176, 82], [196, 96], [206, 118], [90, 142], [210, 142]];
      for (const [x, y] of pts) s += `<circle cx="${x}" cy="${y}" r="17" fill="${f}"/>`;
      return s;
    }
    case 'long':
    case 'bun':
      return `<path d="M88 146 Q96 74 150 72 Q206 74 212 146 Q196 100 160 98 Q132 112 88 146 Z" fill="${f}"/>`;
    default:
      return '';
  }
}

function beard(c) {
  const f = c.beardColor || c.hairColor;
  switch (c.beard) {
    case 'long':
      return `<path d="M88 158 Q86 250 150 300 Q214 250 212 158 Q206 204 182 208 Q150 196 118 208 Q94 204 88 158 Z" fill="${f}"/>
              <path d="M126 186 Q150 174 174 186 Q162 198 150 192 Q138 198 126 186 Z" fill="${f}"/>`;
    case 'full':
      return `<path d="M90 160 Q92 238 150 254 Q208 238 210 160 Q204 202 182 206 Q150 196 118 206 Q96 202 90 160 Z" fill="${f}"/>
              <path d="M126 186 Q150 174 174 186 Q162 198 150 192 Q138 198 126 186 Z" fill="${f}"/>`;
    case 'short':
      return `<path d="M94 170 Q100 226 150 234 Q200 226 206 170 Q198 204 180 206 Q150 198 120 206 Q102 204 94 170 Z" fill="${f}"/>
              <path d="M128 187 Q150 178 172 187 Q160 196 150 192 Q140 196 128 187 Z" fill="${f}"/>`;
    case 'mustache':
      return `<path d="M126 187 Q150 175 174 187 Q162 198 150 192 Q138 198 126 187 Z" fill="${f}"/>`;
    default:
      return '';
  }
}

function face(c, mouth = 'smile', blink = false) {
  const brow = c.browColor || c.hairColor;
  const lips = c.lips || '#8A3F33';
  let m;
  if (mouth === 'open') m = `<path d="M136 191 Q150 214 164 191 Q150 195 136 191 Z" fill="#5A2420"/>`;
  else if (mouth === 'mid') m = `<path d="M139 193 Q150 205 161 193 Q150 196 139 193 Z" fill="#5A2420"/>`;
  else if (mouth === 'neutral') m = `<path d="M138 196 L162 196" stroke="${lips}" stroke-width="4" stroke-linecap="round"/>`;
  else m = `<path d="M136 192 Q150 204 164 192" stroke="${lips}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return `
    <path d="M114 136 Q127 128 140 135" stroke="${brow}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M160 135 Q173 128 186 136" stroke="${brow}" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${blink
      ? `<path d="M121 155 Q128 158 135 155 M165 155 Q172 158 179 155" stroke="#2A2422" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="128" cy="154" rx="6" ry="7.5" fill="#2A2422"/>
    <ellipse cx="172" cy="154" rx="6" ry="7.5" fill="#2A2422"/>
    <circle cx="130" cy="151" r="2" fill="#fff"/>
    <circle cx="174" cy="151" r="2" fill="#fff"/>`}
    <path d="M150 158 Q157 172 147 177" stroke="rgba(0,0,0,.22)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="112" cy="176" r="10" fill="rgba(220,90,80,.12)"/>
    <circle cx="188" cy="176" r="10" fill="rgba(220,90,80,.12)"/>
    ${m}`;
}

function glasses(c) {
  if (!c.glasses) return '';
  return `<g stroke="#2E2E33" stroke-width="3.5" fill="rgba(255,255,255,.12)">
    <circle cx="128" cy="155" r="16"/><circle cx="172" cy="155" r="16"/>
    <path d="M144 153 Q150 148 156 153" fill="none"/>
    <path d="M112 152 L92 147 M188 152 L208 147" fill="none"/></g>`;
}

function hat(c) {
  switch (c.hat) {
    case 'kippah':
      return `<path d="M110 90 Q150 56 190 90 Q150 80 110 90 Z" fill="#1F2A44"/>
              <path d="M118 86 Q150 72 182 86" stroke="#C9A64B" stroke-width="2.5" fill="none"/>`;
    case 'kalimavkion':
      return `<path d="M90 104 L96 34 L204 34 L210 104 Q150 94 90 104 Z" fill="#141416"/>
              <rect x="86" y="26" width="128" height="12" rx="3" fill="#1E1E22"/>`;
    case 'sa-cap':
      return `<path d="M88 104 Q84 50 150 46 Q216 50 212 104 Z" fill="#1F2A44"/>
              <path d="M88 88 Q150 80 212 88 L212 104 Q150 96 88 104 Z" fill="#B3262E"/>
              <path d="M82 104 Q150 126 218 104 Q150 112 82 104 Z" fill="#111"/>
              <circle cx="150" cy="70" r="9" fill="#D4AF37"/>`;
    default:
      return '';
  }
}

// ---------- Torsos ----------
const BODY = 'M38 400 L42 322 Q48 262 118 246 L182 246 Q252 262 258 322 L262 400 Z';
const COLLAR_BAND = 'M126 238 Q150 254 174 238 L176 252 Q150 268 124 252 Z';

function shirtCollar(color) {
  return `<path d="M124 242 L150 268 L138 280 L116 252 Z" fill="${color}" stroke="rgba(0,0,0,.12)" stroke-width="1.5"/>
          <path d="M176 242 L150 268 L162 280 L184 252 Z" fill="${color}" stroke="rgba(0,0,0,.12)" stroke-width="1.5"/>`;
}

function tie(color, long = false) {
  const end = long ? 392 : 332;
  return `<path d="M142 262 L158 262 L156 278 L144 278 Z" fill="${color}"/>
          <path d="M144 278 L156 278 L164 ${end} L150 ${end + 14} L136 ${end} Z" fill="${color}"/>
          <path d="M150 278 L150 ${end + 10}" stroke="rgba(0,0,0,.12)" stroke-width="2"/>`;
}

function lapels(color) {
  return `<path d="M120 246 L100 292 L118 300 L150 350 L138 280 Z" fill="${color}"/>
          <path d="M180 246 L200 292 L182 300 L150 350 L162 280 Z" fill="${color}"/>`;
}

function torso(c) {
  const o = c.outfit;
  switch (o.type) {
    case 'missionary':
      return `<path d="${BODY}" fill="#F8F8F6" stroke="#D9D9D4" stroke-width="2"/>
        <path d="M70 300 Q76 340 72 400 M230 300 Q224 340 228 400" stroke="#E2E2DD" stroke-width="3" fill="none"/>
        ${shirtCollar('#FFFFFF')}${tie(o.tie, true)}
        <rect x="170" y="296" width="66" height="22" rx="3" fill="#121212"/>
        <text x="203" y="306" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" font-weight="700" fill="#fff" letter-spacing=".5">ÉLDER</text>
        <text x="203" y="314.5" text-anchor="middle" font-family="Inter, sans-serif" font-size="7" fill="#ddd">${o.tag}</text>`;
    case 'suit':
      return `<path d="${BODY}" fill="${o.jacket}"/>
        <path d="M122 246 L150 340 L178 246 Z" fill="${o.shirt || '#FFFFFF'}"/>
        ${shirtCollar(o.shirt || '#FFFFFF')}${tie(o.tie)}
        ${lapels(shadeColor(o.jacket))}
        <circle cx="150" cy="364" r="4" fill="rgba(0,0,0,.35)"/>`;
    case 'judge':
      return `<path d="${BODY}" fill="#121216"/>
        <path d="M80 300 Q86 350 82 400 M220 300 Q214 350 218 400 M116 300 Q120 350 118 400 M184 300 Q180 350 182 400" stroke="#24242A" stroke-width="4" fill="none"/>
        <path d="M126 246 L150 320 L174 246 Z" fill="#FFFFFF"/>
        ${shirtCollar('#FFFFFF')}${tie('#2C2C34')}`;
    case 'clerical':
      return `<path d="${BODY}" fill="${o.jacket}"/>
        <path d="M122 246 L150 340 L178 246 Z" fill="${o.shirt}"/>
        <path d="${COLLAR_BAND}" fill="${o.shirt}"/>
        <rect x="143" y="252" width="14" height="10" rx="1.5" fill="#FFFFFF"/>
        ${lapels(shadeColor(o.jacket))}`;
    case 'cassock':
      return `<path d="${BODY}" fill="#141416"/>
        <path d="${COLLAR_BAND}" fill="#1E1E22"/>
        <path d="M150 262 L150 400" stroke="#26262B" stroke-width="3"/>
        <path d="M112 252 Q150 350 188 252" stroke="#C9A64B" stroke-width="3" fill="none"/>
        <circle cx="150" cy="322" r="15" fill="#C9A64B"/><circle cx="150" cy="322" r="10" fill="#6E1E2A"/>
        <path d="M150 314 L150 330 M143 320 L157 320" stroke="#E8D18A" stroke-width="2.5"/>`;
    case 'robe-bands': {
      let stole = '';
      if (o.stole) {
        stole = `<path d="M110 252 L126 250 L134 400 L114 400 Z" fill="${o.stole}"/>
                 <path d="M190 252 L174 250 L166 400 L186 400 Z" fill="${o.stole}"/>`;
      }
      return `<path d="${BODY}" fill="#17171B"/>
        <path d="M92 310 Q98 350 94 400 M208 310 Q202 350 206 400" stroke="#26262C" stroke-width="4" fill="none"/>
        ${stole}
        <path d="${COLLAR_BAND}" fill="#FFFFFF"/>
        <rect x="140.5" y="258" width="9" height="34" rx="1" fill="#FFFFFF"/>
        <rect x="150.5" y="258" width="9" height="34" rx="1" fill="#FFFFFF"/>`;
    }
    case 'turtleneck':
      return `<path d="${BODY}" fill="${o.jacket}"/>
        <path d="M118 246 L150 360 L182 246 Z" fill="${o.sweater}"/>
        <path d="M128 204 L128 254 Q150 266 172 254 L172 204 Z" fill="${o.sweater}"/>
        <path d="M128 214 Q150 222 172 214 M128 226 Q150 234 172 226 M128 238 Q150 246 172 238" stroke="rgba(0,0,0,.18)" stroke-width="2" fill="none"/>
        ${lapels(shadeColor(o.jacket))}
        <path d="M60 320 L84 316 M66 340 L88 336 M214 318 L238 322 M212 338 L234 342" stroke="rgba(0,0,0,.12)" stroke-width="2"/>`;
    case 'casual':
      return `<path d="${BODY}" fill="${o.jacket}"/>
        <path d="M122 246 L150 330 L178 246 Z" fill="${o.shirt}"/>
        <path d="M134 246 L150 284 L166 246 Z" fill="${c.skinColor}"/>
        ${shirtCollar(o.shirt)}
        ${lapels(shadeColor(o.jacket))}`;
    case 'blouse':
      return `<path d="${BODY}" fill="${o.jacket}"/>
        <path d="M118 246 L150 330 L182 246 Z" fill="${o.blouse}"/>
        <path d="M132 246 L150 280 L168 246 Z" fill="${c.skinColor}"/>
        <path d="M128 246 Q150 296 172 246" stroke="#F4EFE6" stroke-width="5" fill="none" stroke-dasharray="0.1 9" stroke-linecap="round"/>
        ${lapels(shadeColor(o.jacket))}`;
    case 'sa-uniform':
      return `<path d="${BODY}" fill="#1F2A44"/>
        <path d="M124 236 Q150 250 176 236 L178 262 Q150 276 122 262 Z" fill="#1A233A"/>
        <rect x="122" y="246" width="16" height="14" rx="2" fill="#B3262E"/>
        <rect x="162" y="246" width="16" height="14" rx="2" fill="#B3262E"/>
        <text x="130" y="257.5" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="700" fill="#E8C766">S</text>
        <text x="170" y="257.5" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="700" fill="#E8C766">S</text>
        <path d="M150 270 L150 400" stroke="#151C30" stroke-width="3"/>
        <circle cx="158" cy="296" r="4" fill="#C9CCD3"/><circle cx="158" cy="330" r="4" fill="#C9CCD3"/><circle cx="158" cy="364" r="4" fill="#C9CCD3"/>`;
    default:
      return `<path d="${BODY}" fill="#888"/>`;
  }
}

function prop(c) {
  if (c.prop === 'bible') {
    return `<g transform="rotate(-8 92 352)">
      <rect x="58" y="320" width="70" height="88" rx="5" fill="#2A1C14"/>
      <rect x="124" y="324" width="6" height="80" fill="#D9B95B"/>
      <path d="M93 340 L93 372 M83 350 L103 350" stroke="#D9B95B" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  if (c.prop === 'gavel') {
    return `<g transform="rotate(-30 70 360)">
      <rect x="64" y="320" width="10" height="70" rx="4" fill="#8B5A2B"/>
      <rect x="44" y="306" width="50" height="22" rx="6" fill="#6B3F1D"/></g>`;
  }
  return '';
}

function shadeColor(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - 24);
  const g = Math.max(0, ((n >> 8) & 255) - 24);
  const b = Math.max(0, (n & 255) - 24);
  return `rgb(${r},${g},${b})`;
}

export function characterSVG(c, { mouth = 'smile', blink = false, width = 300, height = 400 } = {}) {
  c = { ...c, skinColor: SKIN[c.skin] || c.skin };
  const skin = c.skinColor;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="${width}" height="${height}">
    ${hairBack(c)}
    ${torso(c)}
    <path d="M130 200 L130 250 Q150 262 170 250 L170 200 Z" fill="${skin}"/>
    <path d="M130 218 Q150 236 170 218 L170 238 Q150 250 130 238 Z" fill="${shade}"/>
    ${c.outfit.type === 'turtleneck' ? `<path d="M128 214 L128 254 Q150 266 172 254 L172 214 Q150 224 128 214 Z" fill="${c.outfit.sweater}"/>` : ''}
    <circle cx="88" cy="158" r="13" fill="${skin}"/><circle cx="212" cy="158" r="13" fill="${skin}"/>
    <ellipse cx="150" cy="150" rx="62" ry="72" fill="${skin}"/>
    ${hairFront(c)}
    ${beard(c)}
    ${face(c, mouth, blink)}
    ${glasses(c)}
    ${hat(c)}
    ${prop(c)}
  </svg>`;
}

// ---------- Elenco ----------
export const MISSIONARIES = [
  { id: 'baker', name: 'Élder Baker', role: 'Misionero', skin: 's1', hair: 'sidepart', hairColor: '#C79F57', browColor: '#A9813E',
    outfit: { type: 'missionary', tie: '#24406B', tag: 'BAKER' }, bg: '#DCE8F5' },
  { id: 'rios', name: 'Élder Ríos', role: 'Misionero', skin: 's3', hair: 'short', hairColor: '#24180F',
    outfit: { type: 'missionary', tie: '#8C2F39', tag: 'RÍOS' }, bg: '#F5E3DC' },
];

export const JUDGE = { id: 'juez', name: 'El Juez', role: 'Rabino ortodoxo', skin: 's2', hair: 'balding', hairColor: '#C9C9C9',
  beard: 'full', beardColor: '#D9D9D9', browColor: '#9D9D9D', glasses: true, hat: 'kippah',
  outfit: { type: 'judge' }, prop: 'gavel', bg: '#EFE6CF' };

export const ACCUSERS = [
  { id: 'ateo', name: 'Dr. David Martín', role: 'Ateo · fiscal principal', skin: 's1', hair: 'balding', hairColor: '#A3A3A3',
    beard: 'short', beardColor: '#9C9C9C', browColor: '#8C8C8C', glasses: true, outfit: { type: 'turtleneck', jacket: '#7A5A3C', sweater: '#2F3A33' } },
  { id: 'agnostico', name: 'Agnóstico', role: 'Escéptico', skin: 's4', hair: 'short', hairColor: '#141010',
    outfit: { type: 'casual', jacket: '#5E6B4E', shirt: '#DCE6F0' } },
  { id: 'catolico', name: 'Sacerdote católico', role: 'Iglesia Católica', skin: 's2', hair: 'short', hairColor: '#5A3E2B',
    outfit: { type: 'clerical', jacket: '#1E1E22', shirt: '#1E1E22' } },
  { id: 'cook', name: 'Padre Cook', role: 'Ortodoxo griego', skin: 's2', hair: 'short', hairColor: '#3B2A20', beard: 'long',
    hat: 'kalimavkion', outfit: { type: 'cassock' } },
  { id: 'luterano', name: 'Ministro luterano', role: 'Iglesia Luterana', skin: 's1', hair: 'sidepart', hairColor: '#8A6A48',
    outfit: { type: 'robe-bands' } },
  { id: 'metodista', name: 'Ministro metodista', role: 'Iglesia Metodista', skin: 's1', hair: 'short', hairColor: '#BDBDBD', browColor: '#9A9A9A',
    glasses: true, outfit: { type: 'clerical', jacket: '#5B6068', shirt: '#4A6FA5' } },
  { id: 'anglicano', name: 'Clérigo anglicano', role: 'Iglesia de Inglaterra', skin: 's2', hair: 'balding', hairColor: '#6A4A33',
    beard: 'mustache', outfit: { type: 'clerical', jacket: '#1E1E22', shirt: '#6B3F7A' } },
  { id: 'presbiteriano', name: 'Ministro presbiteriano', role: 'Iglesia Presbiteriana', skin: 's1', hair: 'short', hairColor: '#A0522D',
    outfit: { type: 'robe-bands', stole: '#2F6B4A' } },
  { id: 'iglesiacristo', name: 'Ministro', role: 'Iglesia de Cristo', skin: 's1', hair: 'sidepart', hairColor: '#3A2A20',
    outfit: { type: 'suit', jacket: '#3A3F47', tie: '#2E5C9A' }, prop: 'bible' },
  { id: 'testigos', name: 'Representante', role: 'Testigos de Jehová', skin: 's5', hair: 'short', hairColor: '#120E0C',
    outfit: { type: 'suit', jacket: '#4B5A6B', tie: '#C29B38' } },
  { id: 'cienciacristiana', name: 'Lectora', role: 'Ciencia Cristiana', skin: 's1', hair: 'bun', hairColor: '#7B4A2E', lips: '#B0485A',
    outfit: { type: 'blouse', jacket: '#2F6F73', blouse: '#F2E8DA' } },
  { id: 'salvacion', name: 'Capitán', role: 'Ejército de Salvación', skin: 's3', hair: 'short', hairColor: '#2A1D17', beard: 'mustache',
    hat: 'sa-cap', outfit: { type: 'sa-uniform' } },
  { id: 'bautista', name: 'Ministro bautista', role: 'Iglesia Bautista', skin: 's4', hair: 'short', hairColor: '#4A4A4A',
    outfit: { type: 'suit', jacket: '#22304A', tie: '#B23A3A' } },
  { id: 'pentecostal', name: 'Evangelista', role: 'Pentecostal', skin: 's2', hair: 'pompadour', hairColor: '#22180F',
    outfit: { type: 'suit', jacket: '#E3D9C0', shirt: '#CFE0F2', tie: '#5B2A86' } },
  { id: 'unida', name: 'Ministro', role: 'Iglesia Unida de Canadá', skin: 's1', hair: 'curly', hairColor: '#E6E6E6', browColor: '#B5B5B5',
    outfit: { type: 'clerical', jacket: '#2F4A3A', shirt: '#1E1E22' } },
  { id: 'adventista', name: 'Ministro adventista', role: 'Adventista del 7.º día', skin: 's3', hair: 'short', hairColor: '#2A1D17',
    glasses: true, outfit: { type: 'suit', jacket: '#6A4A32', tie: '#3E7A4E' }, prop: 'bible' },
];
