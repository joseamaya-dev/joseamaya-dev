// Genera con Cartesia el audio de cada línea del episodio.
// Uso: node scripts/cartesia-tts.mjs ep01 [--force] [--only=3,5]
// La clave se toma de CARTESIA_API_KEY; en la sesión en la nube la inyecta el proxy.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { EP01 } from '../src/ep01.ts';

const EPISODES = { ep01: EP01 };
const ep = EPISODES[process.argv[2] || 'ep01'];
const force = process.argv.includes('--force');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice(7).split(',').map(Number)) : null;
const voices = JSON.parse(readFileSync(new URL('../src/voices.json', import.meta.url)));
const dir = `public/audio/${ep.id}`;
mkdirSync(dir, { recursive: true });

const headers = { 'Cartesia-Version': '2025-04-16', 'Content-Type': 'application/json' };
if (process.env.CARTESIA_API_KEY) headers['X-API-Key'] = process.env.CARTESIA_API_KEY;

for (const [i, line] of ep.lines.entries()) {
  const n = i + 1;
  const file = `${dir}/${String(n).padStart(2, '0')}.wav`;
  if (only && !only.has(n)) continue;
  if (existsSync(file) && !force) {
    console.log(`= ${file} ya existe (usa --force para regenerar)`);
    continue;
  }
  const res = await fetch('https://api.cartesia.ai/tts/bytes', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model_id: 'sonic-3',
      transcript: line.text,
      voice: { mode: 'id', id: voices[line.speaker].id },
      language: 'es',
      output_format: { container: 'wav', encoding: 'pcm_s16le', sample_rate: 44100 },
    }),
  });
  if (!res.ok) throw new Error(`Línea ${n}: ${res.status} ${await res.text()}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${file} (${line.speaker} · ${voices[line.speaker].name})`);
}
