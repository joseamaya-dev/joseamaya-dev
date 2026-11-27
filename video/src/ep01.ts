// Episodio 1 — "¿Ya fue revelada TODA la verdad?"
// Adaptación libre (con palabras propias) del primer intercambio de «El día de la defensa».
// Citas bíblicas: Reina-Valera 1909 (dominio público), con ortografía actualizada.

export type SpeakerId = 'juez' | 'cook' | 'baker' | 'rios';

export type Line = {
  speaker: SpeakerId;
  text: string;
  highlight?: string; // frase que se resalta en amarillo
  ref?: string; // referencia bíblica que aparece como etiqueta
};

export const EP01 = {
  id: 'ep01',
  number: 1,
  hook: ['¿Ya fue revelada ', 'TODA', ' la verdad?'] as const,
  next: 'Próximo episodio: ¿Tiene Dios un cuerpo?',
  lines: [
    { speaker: 'juez', text: 'Padre Cook, la acusación tiene la palabra.' },
    {
      speaker: 'cook',
      text: 'Mi pregunta debería cerrar este caso. Jesús prometió que el Espíritu de verdad guiaría a sus apóstoles a toda la verdad. Si ya se reveló toda la verdad, ¿para qué necesitan ustedes un profeta moderno?',
      highlight: 'toda la verdad',
      ref: 'Juan 16:13',
    },
    {
      speaker: 'baker',
      text: 'Tiene razón en algo, Padre: Cristo sí dio toda la verdad a sus apóstoles. La pregunta es si ellos la escribieron toda para el mundo.',
      highlight: 'la escribieron toda',
    },
    {
      speaker: 'rios',
      text: 'El mismo Jesús les dijo: «A vosotros es concedido saber los misterios del reino de los cielos; mas a ellos no es concedido». Había cosas reservadas para los apóstoles.',
      highlight: 'mas a ellos no es concedido',
      ref: 'Mateo 13:11',
    },
    {
      speaker: 'baker',
      text: 'Y Pablo cuenta que fue arrebatado al paraíso, donde oyó palabras que el hombre no puede decir. Lo que oyó no está escrito en la Biblia.',
      highlight: 'no está escrito',
      ref: '2 Corintios 12:4',
    },
    { speaker: 'cook', text: 'No había considerado ese pasaje…' },
    {
      speaker: 'rios',
      text: 'Por eso creemos que Dios sigue hablando hoy: «No hará nada el Señor Jehová, sin que revele su secreto a sus siervos los profetas».',
      highlight: 'a sus siervos los profetas',
      ref: 'Amós 3:7',
    },
    { speaker: 'juez', text: 'La defensa ha respondido. Continuemos.' },
  ] as Line[],
};
