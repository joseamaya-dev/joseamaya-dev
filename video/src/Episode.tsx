import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { ACCUSERS, characterSVG, JUDGE, MISSIONARIES } from './characters';
import type { SpeakerId } from './ep01';
import { EP01 } from './ep01';
import { buildTimeline, INTRO, OUTRO, type TimedLine } from './timeline';

type Mouth = 'neutral' | 'mid' | 'open' | 'smile';

const COOK = ACCUSERS.find((a) => a.id === 'cook')!;
const [BAKER, RIOS] = MISSIONARIES;

const SPEAKERS: Record<SpeakerId, { name: string; role: string; color: string }> = {
  juez: { name: 'EL JUEZ', role: 'Rabino ortodoxo', color: '#8A6D3B' },
  cook: { name: 'PADRE COOK', role: 'Ortodoxo griego · Acusación', color: '#8A3B2E' },
  baker: { name: 'ÉLDER BAKER', role: 'Defensa', color: '#24406B' },
  rios: { name: 'ÉLDER RÍOS', role: 'Defensa', color: '#24406B' },
};

// ---------- Cámara ----------
type Cam = { s: number; ox: number; oy: number };
const WIDE: Cam = { s: 1, ox: 540, oy: 1100 };
const CAMS: Record<SpeakerId, Cam> = {
  juez: { s: 1.32, ox: 540, oy: 640 },
  cook: { s: 1.16, ox: 220, oy: 1180 },
  baker: { s: 1.12, ox: 680, oy: 1180 },
  rios: { s: 1.12, ox: 860, oy: 1180 },
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function camAt(from: Cam, to: Cam, local: number): Cam {
  const t = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return { s: lerp(from.s, to.s, t), ox: lerp(from.ox, to.ox, t), oy: lerp(from.oy, to.oy, t) };
}

// ---------- Fondo ----------
const Courtroom: React.FC = () => {
  const panels = Array.from({ length: 8 }, (_, i) => (
    <rect key={i} x={i * 135 + 12} y={300} width={111} height={520} rx={6} fill="rgba(0,0,0,.07)" />
  ));
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8C6440" />
          <stop offset="1" stopColor="#6E4A2C" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#wall)" />
      {panels}
      <rect y={820} width={1080} height={1100} fill="#4A3221" />
      <circle cx={540} cy={380} r={70} fill="#C9A64B" opacity={0.9} />
      <circle cx={540} cy={380} r={54} fill="none" stroke="#7A5A1E" strokeWidth={5} />
      <path
        d="M500 400 L580 400 M540 340 L540 400 M510 360 L570 360 M510 360 L500 392 M570 360 L580 392"
        stroke="#7A5A1E"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Bench: React.FC = () => (
  <svg width={1080} height={200} style={{ position: 'absolute', left: 0, top: 690 }}>
    <defs>
      <linearGradient id="bench" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6A4529" />
        <stop offset="1" stopColor="#4A2F1B" />
      </linearGradient>
    </defs>
    <rect x={250} y={0} width={580} height={200} rx={10} fill="url(#bench)" />
    <rect x={250} y={0} width={580} height={16} fill="#7E5634" />
    <rect x={460} y={60} width={160} height={44} rx={6} fill="#C9A64B" />
    <text x={540} y={90} textAnchor="middle" fontFamily="Georgia,serif" fontSize={22} fontWeight={700} fill="#3B2A12">
      JUEZ
    </text>
  </svg>
);

const Desk: React.FC = () => (
  <svg width={1080} height={500} style={{ position: 'absolute', left: 0, top: 1420 }}>
    <defs>
      <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5A3A22" />
        <stop offset="1" stopColor="#2E1D10" />
      </linearGradient>
    </defs>
    <rect width={1080} height={500} fill="url(#desk)" />
    <rect width={1080} height={18} fill="#7E5634" />
  </svg>
);

// ---------- Personaje ----------
const Actor: React.FC<{
  c: Record<string, unknown>;
  x: number;
  y: number;
  w: number;
  frame: number;
  seed: number;
  mouth: Mouth;
  talking: boolean;
}> = ({ c, x, y, w, frame, seed, mouth, talking }) => {
  const h = (w * 4) / 3;
  const cycle = (frame + seed * 37) % 118;
  const blink = cycle < 4;
  const breathe = Math.sin((frame + seed * 11) / 22) * 2;
  const bob = talking ? Math.sin(frame / 3.2) * 3 : 0;
  const tilt = talking ? Math.sin(frame / 9) * 1.2 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + breathe + bob,
        width: w,
        height: h,
        transform: `rotate(${tilt}deg)`,
        transformOrigin: '50% 90%',
      }}
      dangerouslySetInnerHTML={{ __html: characterSVG(c, { mouth, blink, width: w, height: h }) }}
    />
  );
};

// ---------- Escenario ----------
const Stage: React.FC<{ abs: number; cam: Cam; speaker: SpeakerId | null; mouth: Mouth }> = ({
  abs,
  cam,
  speaker,
  mouth,
}) => {
  const m = (id: SpeakerId): Mouth => (speaker === id ? mouth : 'neutral');
  return (
    <AbsoluteFill
      style={{ transform: `scale(${cam.s})`, transformOrigin: `${cam.ox}px ${cam.oy}px` }}
    >
      <Courtroom />
      <Actor c={JUDGE} x={390} y={470} w={300} frame={abs} seed={1} mouth={m('juez')} talking={speaker === 'juez'} />
      <Bench />
      <Actor c={COOK} x={-30} y={830} w={540} frame={abs} seed={2} mouth={m('cook')} talking={speaker === 'cook'} />
      <Actor c={RIOS} x={760} y={975} w={390} frame={abs} seed={3} mouth={m('rios')} talking={speaker === 'rios'} />
      <Actor c={BAKER} x={540} y={960} w={400} frame={abs} seed={4} mouth={m('baker')} talking={speaker === 'baker'} />
      <Desk />
    </AbsoluteFill>
  );
};

// ---------- Subtítulo ----------
const Caption: React.FC<{ line: TimedLine; local: number }> = ({ line, local }) => {
  const { fps } = useVideoConfig();
  const sp = SPEAKERS[line.speaker];
  const enter = interpolate(local, [0, 6], [0, 1], { extrapolateRight: 'clamp' });

  // Palabra actual según el avance de la voz (proporcional a los caracteres).
  const words = line.text.split(' ');
  const total = line.text.length;
  // Con audio, el avance se mide entre el primer y el último fotograma con voz.
  const env = line.env;
  const v0 = env ? Math.max(0, env.findIndex((v) => v > 0.12)) : 0;
  const v1 = env ? env.length - 1 - [...env].reverse().findIndex((v) => v > 0.12) : line.speech - 4;
  const p = Math.min(1, Math.max(0, (local - v0) / Math.max(1, v1 - v0)));
  const hs = line.highlight ? line.text.indexOf(line.highlight) : -1;
  const he = hs >= 0 ? hs + line.highlight!.length : -1;
  let offset = 0;

  const chip = spring({ frame: local - 6, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        position: 'absolute',
        left: 50,
        bottom: 150,
        width: 980,
        boxSizing: 'border-box',
        background: 'rgba(255,255,255,.97)',
        borderRadius: 28,
        padding: '30px 40px 34px',
        boxShadow: '0 10px 30px rgba(0,0,0,.35)',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px)`,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2, color: sp.color, marginBottom: 10 }}>
        {sp.name} <span style={{ fontWeight: 500, letterSpacing: 0, color: '#8C8378' }}>· {sp.role}</span>
      </div>
      <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.28, color: '#1F1B16' }}>
        {words.map((w, i) => {
          const start = offset;
          offset += w.length + 1;
          const spoken = start / total <= p;
          const hl = hs >= 0 && start >= hs && start < he;
          return (
            <span
              key={i}
              style={{
                opacity: spoken ? 1 : 0.32,
                background: hl && spoken ? '#E8C766' : 'transparent',
                borderRadius: 8,
                padding: hl ? '0 4px' : 0,
              }}
            >
              {w}{' '}
            </span>
          );
        })}
      </div>
      {line.ref ? (
        <div
          style={{
            marginTop: 18,
            display: 'inline-block',
            background: '#1F2A44',
            color: '#fff',
            fontSize: 28,
            fontWeight: 700,
            borderRadius: 12,
            padding: '10px 18px',
            transform: `scale(${chip})`,
            transformOrigin: 'left center',
          }}
        >
          📖 {line.ref}
        </div>
      ) : null}
    </div>
  );
};

// ---------- Boca ----------
function syntheticMouth(local: number, speech: number): Mouth {
  if (local >= speech - 2) return 'neutral';
  const v = Math.abs(Math.sin(local * 1.9) + Math.sin(local * 0.71 + 1.3));
  return v > 1.15 ? 'open' : v > 0.45 ? 'mid' : 'neutral';
}

function levelToMouth(level: number): Mouth {
  return level > 0.55 ? 'open' : level > 0.18 ? 'mid' : 'neutral';
}

const LineView: React.FC<{ line: TimedLine; prev: SpeakerId | null; mouth: Mouth; local: number }> = ({
  line,
  prev,
  mouth,
  local,
}) => {
  const cam = camAt(prev ? CAMS[prev] : WIDE, CAMS[line.speaker], local);
  return (
    <AbsoluteFill>
      <Stage abs={line.start + local} cam={cam} speaker={line.speaker} mouth={mouth} />
      <Caption line={line} local={local} />
    </AbsoluteFill>
  );
};

const SilentLine: React.FC<{ line: TimedLine; prev: SpeakerId | null }> = ({ line, prev }) => {
  const local = useCurrentFrame();
  return <LineView line={line} prev={prev} local={local} mouth={syntheticMouth(local, line.speech)} />;
};

const AudioLine: React.FC<{ line: TimedLine; prev: SpeakerId | null }> = ({ line, prev }) => {
  const local = useCurrentFrame();
  const env = line.env;
  const mouth: Mouth = env ? levelToMouth(env[local] ?? 0) : syntheticMouth(local, line.speech);
  return (
    <>
      <Audio src={staticFile(line.audio!)} />
      <LineView line={line} prev={prev} local={local} mouth={mouth} />
    </>
  );
};

// ---------- Capas fijas ----------
const Header: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12 } });
  const [a, b, c] = EP01.hook;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 250,
          background: 'linear-gradient(#141010, rgba(20,16,16,.88))',
        }}
      />
      <div style={{ position: 'absolute', left: 60, top: 70, color: '#E8C766', fontSize: 26, fontWeight: 700, letterSpacing: 4 }}>
        EL DÍA DE LA DEFENSA · EP. {EP01.number}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 112,
          width: 960,
          color: '#fff',
          fontSize: 60,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -1,
          transform: `scale(${0.85 + 0.15 * pop})`,
          transformOrigin: 'left top',
          opacity: pop,
        }}
      >
        {a}
        <span style={{ color: '#E8C766' }}>{b}</span>
        {c}
      </div>
    </>
  );
};

const Progress: React.FC<{ frame: number; total: number }> = ({ frame, total }) => (
  <>
    <div style={{ position: 'absolute', left: 60, top: 1872, width: 960, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.2)' }} />
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 1872,
        width: 960 * Math.min(1, frame / total),
        height: 10,
        borderRadius: 5,
        background: '#E8C766',
      }}
    />
  </>
);

const EndCard: React.FC = () => {
  const local = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(local, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const pop = spring({ frame: local - 6, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ background: `rgba(20,14,10,${0.86 * fade})`, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', color: '#fff', transform: `scale(${0.9 + 0.1 * pop})`, opacity: pop, padding: '0 70px' }}>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -1 }}>¿Qué opinas tú?</div>
        <div style={{ fontSize: 40, color: '#E9DFCF', marginTop: 18 }}>Déjalo en los comentarios 👇</div>
        <div
          style={{
            marginTop: 70,
            display: 'inline-block',
            background: '#E8C766',
            color: '#1F1B16',
            fontSize: 38,
            fontWeight: 800,
            borderRadius: 18,
            padding: '20px 30px',
          }}
        >
          {EP01.next}
        </div>
        <div style={{ fontSize: 24, color: '#A89C8C', marginTop: 90, lineHeight: 1.4 }}>
          Adaptación libre del libro «El día de la defensa» de A. Melvin McDonald.
          <br />
          Canal no oficial.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Idle: React.FC<{ from: SpeakerId | null; to: SpeakerId | null; offset: number }> = ({ from, to, offset }) => {
  const local = useCurrentFrame();
  const cam = camAt(from ? CAMS[from] : WIDE, to ? CAMS[to] : WIDE, local);
  return <Stage abs={offset + local} cam={cam} speaker={null} mouth="neutral" />;
};

// ---------- Episodio ----------
export const Episode: React.FC = () => {
  const frame = useCurrentFrame();
  const tl = buildTimeline(EP01.id, EP01.lines);
  const last = tl.lines[tl.lines.length - 1].speaker;
  return (
    <AbsoluteFill style={{ background: '#3B2A1E', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sequence durationInFrames={INTRO}>
        <Idle from={null} to={null} offset={0} />
      </Sequence>
      {tl.lines.map((line, i) => (
        <Sequence key={i} from={line.start} durationInFrames={line.dur}>
          {line.audio ? (
            <AudioLine line={line} prev={i ? tl.lines[i - 1].speaker : null} />
          ) : (
            <SilentLine line={line} prev={i ? tl.lines[i - 1].speaker : null} />
          )}
        </Sequence>
      ))}
      <Sequence from={tl.linesEnd} durationInFrames={OUTRO}>
        <Idle from={last} to={null} offset={tl.linesEnd} />
        <EndCard />
      </Sequence>
      <Header frame={frame} />
      <Progress frame={frame} total={tl.total} />
    </AbsoluteFill>
  );
};
