// Episodio 2 — "¿Tiene Dios un CUERPO?"
// Adaptación libre (con palabras propias) de «El día de la defensa», págs. 3–4.
// Citas bíblicas: Reina-Valera 1909 (dominio público), con ortografía actualizada.

import type { EpisodeData } from './types';

export const EP02: EpisodeData = {
  id: 'ep02',
  number: 2,
  hook: ['¿Tiene Dios un ', 'CUERPO', '?'],
  next: 'Próximo episodio: ¿Es la Trinidad un solo ser?',
  lines: [
    { speaker: 'juez', text: 'Continuemos. La acusación tiene la palabra.' },
    {
      speaker: 'iglesiacristo',
      text: 'Los mormones enseñan que Dios tiene un cuerpo de carne y huesos. Eso es absurdo. La Biblia lo dice claramente: «Dios es Espíritu». Y nada más.',
      highlight: '«Dios es Espíritu».',
      ref: 'Juan 4:24',
    },
    {
      speaker: 'baker',
      text: 'Lea el versículo completo: «Dios es Espíritu; y los que le adoran, en espíritu y en verdad es necesario que adoren». ¿Usted deja su cuerpo en casa cuando va a adorar?',
      highlight: 'en espíritu y en verdad',
      ref: 'Juan 4:24',
    },
    {
      speaker: 'rios',
      text: 'La Biblia también dice que «Dios es amor» y que «nuestro Dios es fuego consumidor». Nadie concluye de ahí que Dios no sea más que eso.',
      highlight: 'no sea más que eso.',
      ref: '1 Juan 4:8 · Hebreos 12:29',
    },
    {
      speaker: 'metodista',
      text: 'Puede ser, pero sigo esperando el pasaje donde diga que Dios tiene un cuerpo.',
    },
    {
      speaker: 'baker',
      text: 'Cristo resucitado dijo: «Palpad, y ved; que el espíritu ni tiene carne ni huesos, como veis que yo tengo». Resucitó con su cuerpo, y lo conserva.',
      highlight: 'ni tiene carne ni huesos,',
      ref: 'Lucas 24:39',
    },
    {
      speaker: 'rios',
      text: 'Y Hebreos dice que el Hijo es «la misma imagen» del Padre. Esteban los vio a los dos: al Hijo, de pie a la diestra de Dios.',
      highlight: '«la misma imagen»',
      ref: 'Hebreos 1:3 · Hechos 7:56',
    },
    { speaker: 'juez', text: 'Tomo nota. Pasemos al siguiente punto.' },
  ],
};
