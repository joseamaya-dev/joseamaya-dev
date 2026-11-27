# Voces para Cartesia

Los guiones de cada episodio están en `src/episodes/epNN.ts`. Abajo están las líneas del episodio 1 como ejemplo.

## Voces (español latino, ninguna es «Ramón»)

Usa siempre la misma voz para cada personaje, en todos los episodios.

| Personaje | Perfil de voz que hay que buscar en Cartesia | Voz elegida |
|---|---|---|
| El Juez (rabino) | Hombre mayor, grave, pausado, con autoridad | Alejandro – Calm Mentor (MX) |
| Padre Cook | Hombre adulto, grave y firme, un poco solemne | Andres – Trusted Voice (MX) |
| Élder Baker | Hombre joven (unos 20 años), claro y amable | Santiago – Modern Navigator (MX) |
| Élder Ríos | Hombre joven, cálido, distinto de Baker | Mateo – Friendly Host (MX) |
| Ministro (Iglesia de Cristo) | Adulto, analítico, argumentativo | David – System Architect (MX) |
| Ministro metodista | Mayor, relajado, cálido | Jorge – Regular Guy (MX) |

Idioma: **Spanish**. Busca voces latinoamericanas o mexicanas y prueba antes cada una con una línea corta.

## Líneas del episodio 1

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

## Cómo se generan

Los IDs de las voces están en `src/voices.json`. Un acusador nuevo necesita su voz ahí antes de generar.

```bash
cd video
scripts/voces.sh ep02                      # genera con Cartesia, normaliza volumen y sincroniza la boca
scripts/voces.sh ep02 --only=3 --force     # regenera solo la línea 3
npm run render -- Ep02 out/ep02.mp4        # genera el video
```

Fuera de la nube, define `CARTESIA_API_KEY` antes de ejecutar `scripts/voces.sh`.

## Nuevo episodio

1. Copia `src/episodes/ep02.ts` como `ep03.ts` y escribe el gancho, las líneas y el próximo episodio.
2. Regístralo en `src/episodes/index.ts` y en `EPISODES` de `scripts/cartesia-tts.mjs`.
3. Ejecuta `scripts/voces.sh ep03` y `npm run render -- Ep03 out/ep03.mp4`.

## Si prefieres generar los audios a mano

1. Descarga cada línea en **WAV o MP3**, sin silencio largo al principio ni al final.
2. Renómbralas `01` … `08` y ponlas en `video/public/audio/ep01/`.
3. Ejecuta la normalización y `node scripts/sync-audio.mjs ep01`, y después el render.
