import manifest from './audio-manifest.json';
import type { Line } from './episodes/types';

export const FPS = 30;
export const INTRO = 24; // fotogramas antes de la primera línea (gancho)
export const GAP = 9; // pausa tras cada línea
export const OUTRO = 120; // tarjeta final

export type TimedLine = Line & {
  index: number;
  start: number; // fotograma absoluto
  speech: number; // fotogramas que dura la voz
  dur: number; // speech + pausa
  audio?: string; // ruta dentro de /public
  env?: number[]; // volumen por fotograma (0–1) para la boca
};

type Manifest = Record<string, Record<string, { file: string; seconds: number; env?: number[] | null }>>;

// Sin audio: duración estimada a ~2.8 palabras por segundo.
function estimateSeconds(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1.6, words * 0.36 + 0.4);
}

export function buildTimeline(epId: string, lines: Line[]) {
  const audio = (manifest as Manifest)[epId] ?? {};
  let t = INTRO;
  const timed: TimedLine[] = lines.map((line, i) => {
    const key = String(i + 1).padStart(2, '0');
    const a = audio[key];
    const speech = Math.ceil((a ? a.seconds : estimateSeconds(line.text)) * FPS);
    const item: TimedLine = {
      ...line,
      index: i,
      start: t,
      speech,
      dur: speech + GAP,
      audio: a ? `audio/${epId}/${a.file}` : undefined,
      env: a?.env ?? undefined,
    };
    t += item.dur;
    return item;
  });
  return { lines: timed, linesEnd: t, total: t + OUTRO, hasAudio: Object.keys(audio).length > 0 };
}
