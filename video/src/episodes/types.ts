// 'juez', 'baker' y 'rios' son fijos; cualquier otro id es un acusador de characters.js.
export type SpeakerId = string;

export type Line = {
  speaker: SpeakerId;
  text: string;
  highlight?: string; // frase que se resalta en amarillo
  ref?: string; // referencia bíblica que aparece como etiqueta
};

export type EpisodeData = {
  id: string;
  number: number;
  hook: readonly [string, string, string]; // texto, palabra destacada, texto
  next: string;
  lines: Line[];
};
