# Episodio 1 — Voces para Cartesia

Episodio: **«¿Ya fue revelada TODA la verdad?»**. Son 8 líneas y 4 personajes.

## Voces (español latino, ninguna es «Ramón»)

Usa siempre la misma voz para cada personaje, en todos los episodios.

| Personaje | Perfil de voz que hay que buscar en Cartesia | Voz elegida |
|---|---|---|
| El Juez (rabino) | Hombre mayor, grave, pausado, con autoridad | Alejandro – Calm Mentor (MX) |
| Padre Cook | Hombre adulto, grave y firme, un poco solemne | Andres – Trusted Voice (MX) |
| Élder Baker | Hombre joven (unos 20 años), claro y amable | Santiago – Modern Navigator (MX) |
| Élder Ríos | Hombre joven, cálido, distinto de Baker | Mateo – Friendly Host (MX) |

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

## Cómo se generan

Los IDs de las voces están en `src/voices.json`. La generación es automática con la API de Cartesia:

```bash
cd video
NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
  node scripts/cartesia-tts.mjs ep01            # añade --force o --only=3,5 para regenerar líneas
for f in public/audio/ep01/0*.wav; do            # normaliza volumen y corrige la cabecera WAV
  npx remotion ffmpeg -y -loglevel error -i $f -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -ac 1 -c:a pcm_s16le tmp.wav && mv tmp.wav $f
done
node scripts/sync-audio.mjs ep01                 # duración y movimiento de boca por fotograma
npm run render                                    # genera out/ep01.mp4
```

Fuera de la nube, define `CARTESIA_API_KEY` en lugar de las dos variables del proxy.

## Si prefieres generar los audios a mano

1. Descarga cada línea en **WAV o MP3**, sin silencio largo al principio ni al final.
2. Renómbralas `01` … `08` y ponlas en `video/public/audio/ep01/`.
3. Ejecuta los pasos de normalización, `sync-audio` y `render` de arriba.
