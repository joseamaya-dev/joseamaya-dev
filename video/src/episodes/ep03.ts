// Episodio 3 — "¿Es la Trinidad UN SOLO ser?"
// Adaptación libre (con palabras propias) de «El día de la defensa», págs. 5–7.
// Citas bíblicas: Reina-Valera 1909 (dominio público), con ortografía actualizada.

import type { EpisodeData } from './types';

export const EP03: EpisodeData = {
  id: 'ep03',
  number: 3,
  hook: ['¿Es la Trinidad ', 'UN SOLO', ' ser?'],
  next: 'Próximo episodio: ¿Se contradice el Libro de Mormón?',
  lines: [
    { speaker: 'juez', text: 'Siguiente punto. La acusación tiene la palabra.' },
    {
      speaker: 'catolico',
      text: 'Aquí casi todos creemos en la Santísima Trinidad. Jesús mismo lo dijo: «Yo y el Padre una cosa somos». Y a Felipe: «El que me ha visto, ha visto al Padre».',
      highlight: 'una cosa somos».',
      ref: 'Juan 10:30 · Juan 14:9',
    },
    { speaker: 'cook', text: 'Así lo confiesa la Iglesia desde Nicea: un solo Dios en tres personas.' },
    {
      speaker: 'baker',
      text: 'Pero Jesús explicó qué quería decir. Oró para que sus discípulos fueran «una cosa; como tú, oh Padre, en mí, y yo en ti». Uno en propósito, no una sola persona.',
      highlight: 'Uno en propósito,',
      ref: 'Juan 17:21',
    },
    {
      speaker: 'rios',
      text: 'Y ante los fariseos dijo: «el testimonio de dos hombres es verdad». Él daba testimonio de sí mismo, y el Padre también. Dos testigos, no uno.',
      highlight: 'Dos testigos,',
      ref: 'Juan 8:17-18',
    },
    {
      speaker: 'baker',
      text: 'En su bautismo se oyó la voz del Padre desde el cielo. Y en Getsemaní, ¿a quién le oraba Jesús, si no a su Padre?',
      highlight: '¿a quién le oraba Jesús,',
      ref: 'Mateo 3:17 · Mateo 26:39',
    },
    {
      speaker: 'catolico',
      text: 'El credo de Atanasio lo explica: el Padre incomprensible, el Hijo incomprensible, el Espíritu Santo incomprensible.',
      highlight: 'el Hijo incomprensible,',
    },
    {
      speaker: 'rios',
      text: 'Pero Jesús enseñó lo contrario: «Esta es la vida eterna: que te conozcan el solo Dios verdadero, y a Jesucristo, al cual has enviado». Dios quiere ser conocido.',
      highlight: 'Dios quiere ser conocido.',
      ref: 'Juan 17:3',
    },
    { speaker: 'juez', text: 'Tomo nota. Continuaremos.' },
  ],
};
