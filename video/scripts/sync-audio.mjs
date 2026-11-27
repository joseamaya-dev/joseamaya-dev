// Lee public/audio/<episodio>/NN.(wav|mp3) y guarda la duración de cada línea
// en src/audio-manifest.json. Uso: node scripts/sync-audio.mjs ep01
import { execFileSync } from 'child_process';
import { readdirSync, readFileSync, writeFileSync } from 'fs';

const FPS = 30;

// Volumen (RMS) por fotograma, normalizado 0–1, para mover la boca.
// Requiere WAV PCM de 16 bits (el script de Cartesia los entrega así).
function envelope(path) {
  const buf = readFileSync(path);
  let pos = 12;
  let fmt = null;
  let data = null;
  while (pos + 8 <= buf.length) {
    const id = buf.toString('ascii', pos, pos + 4);
    let size = buf.readUInt32LE(pos + 4);
    if (id === 'fmt ') fmt = { channels: buf.readUInt16LE(pos + 10), rate: buf.readUInt32LE(pos + 12), bits: buf.readUInt16LE(pos + 22) };
    if (id === 'data') {
      if (size > buf.length - pos - 8) size = buf.length - pos - 8;
      data = buf.subarray(pos + 8, pos + 8 + size);
      break;
    }
    pos += 8 + size + (size % 2);
  }
  if (!fmt || !data || fmt.bits !== 16) return null;
  const samples = data.length / 2 / fmt.channels;
  const per = fmt.rate / FPS;
  const env = [];
  for (let f = 0; f * per < samples; f++) {
    let sum = 0;
    let n = 0;
    for (let i = Math.floor(f * per); i < Math.min(samples, Math.floor((f + 1) * per)); i++) {
      const v = data.readInt16LE(i * 2 * fmt.channels) / 32768;
      sum += v * v;
      n++;
    }
    env.push(Math.sqrt(sum / Math.max(1, n)));
  }
  const sorted = [...env].sort((a, b) => a - b);
  const ref = sorted[Math.floor(sorted.length * 0.95)] || 1;
  return env.map((v) => Math.round(Math.min(1, v / ref) * 100) / 100);
}

const ep = process.argv[2] || 'ep01';
const dir = `public/audio/${ep}`;
const manifestPath = 'src/audio-manifest.json';
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest[ep] = {};

for (const file of readdirSync(dir).sort()) {
  const m = file.match(/^(\d{2})\.(wav|mp3|m4a|ogg)$/i);
  if (!m) continue;
  const out = execFileSync('npx', ['remotion', 'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `${dir}/${file}`]).toString();
  const seconds = Math.round(parseFloat(out.trim().split('\n').pop()) * 100) / 100;
  manifest[ep][m[1]] = { file, seconds, env: envelope(`${dir}/${file}`) };
  console.log(`${file}: ${seconds}s`);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Manifiesto actualizado: ${Object.keys(manifest[ep]).length} audios para ${ep}.`);
