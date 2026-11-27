export type Character = Record<string, any>;
export function characterSVG(
  c: Character,
  opts?: { mouth?: 'smile' | 'neutral' | 'open' | 'mid'; blink?: boolean; width?: number; height?: number },
): string;
export const MISSIONARIES: Character[];
export const JUDGE: Character;
export const ACCUSERS: Character[];
