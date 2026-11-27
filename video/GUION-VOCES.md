# Episodio 1 — Voces para Cartesia

Episodio: **«¿Ya fue revelada TODA la verdad?»**. Son 8 líneas y 4 personajes.

## Voces (español latino, ninguna es «Ramón»)

Usa siempre la misma voz para cada personaje, en todos los episodios.

| Personaje | Perfil de voz que hay que buscar en Cartesia | Voz elegida |
|---|---|---|
| El Juez (rabino) | Hombre mayor, grave, pausado, con autoridad | _(anotar)_ |
| Padre Cook | Hombre adulto, grave y firme, un poco solemne | _(anotar)_ |
| Élder Baker | Hombre joven (unos 20 años), claro y amable | _(anotar)_ |
| Élder Ríos | Hombre joven, cálido, distinto de Baker | _(anotar)_ |

Idioma: **Spanish**. Busca voces latinoamericanas o mexicanas y prueba antes cada una con una línea corta.

## Líneas (copiar y pegar tal cual)

| N.º | Archivo | Personaje | Texto |
|---|---|---|---|
| 1 | `01.wav` | Juez | Padre Cook, la acusación tiene la palabra. |
| 2 | `02.wav` | Padre Cook | Mi pregunta debería cerrar este caso. Jesús prometió que el Espíritu de verdad guiaría a sus apóstoles a toda la verdad. Si ya se reveló toda la verdad, ¿para qué necesitan ustedes un profeta moderno? |
| 3 | `03.wav` | Élder Baker | Tiene razón en algo, Padre: Cristo sí dio toda la verdad a sus apóstoles. La pregunta es si ellos la escribieron toda para el mundo. |
| 4 | `04.wav` | Élder Ríos | El mismo Jesús les dijo: «A vosotros es concedido saber los misterios del reino de los cielos; mas a ellos no es concedido». Había cosas reservadas para los apóstoles. |
| 5 | `05.wav` | Élder Baker | Y Pablo cuenta que fue arrebatado al paraíso, donde oyó palabras que el hombre no puede decir. Lo que oyó no está escrito en la Biblia. |
| 6 | `06.wav` | Padre Cook | No había considerado ese pasaje… |
| 7 | `07.wav` | Élder Ríos | Por eso creemos que Dios sigue hablando hoy: «No hará nada el Señor Jehová, sin que revele su secreto a sus siervos los profetas». |
| 8 | `08.wav` | Juez | La defensa ha respondido. Continuemos. |

## Cómo entregarlos

1. Descarga cada línea en **WAV o MP3**, sin silencio largo al principio ni al final.
2. Renómbralas `01` … `08` con su extensión, por ejemplo `01.wav`.
3. Súbelas al chat o ponlas en `video/public/audio/ep01/`.
4. Después se ejecuta lo siguiente:

```bash
cd video
node scripts/sync-audio.mjs ep01   # mide la duración de cada audio
npm run render                     # genera out/ep01.mp4 con voces
```

El video ajusta solo los tiempos, el movimiento de la boca y los subtítulos a la duración real de cada audio.
