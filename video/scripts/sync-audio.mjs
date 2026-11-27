// Lee public/audio/<episodio>/NN.(wav|mp3) y guarda la duración de cada línea
// en src/audio-manifest.json. Uso: node scripts/sync-audio.mjs ep01
import { execFileSync } from 'child_process';
import { readdirSync, readFileSync, writeFileSync } from 'fs';

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
  manifest[ep][m[1]] = { file, seconds };
  console.log(`${file}: ${seconds}s`);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Manifiesto actualizado: ${Object.keys(manifest[ep]).length} audios para ${ep}.`);
