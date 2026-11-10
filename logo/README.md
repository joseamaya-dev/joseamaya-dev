# Logo INFRAVENZ — rediseño

Emblema en honor al **Prof. Francisco Ventura Zelaya** (Santa Rosa de Lima).

![Foto de referencia, logo anterior y logo nuevo](comparacion.png)

| Archivo | Uso |
|---|---|
| `infravenz-logo.svg` | Archivo maestro: emblema vectorial con el retrato fotográfico incrustado |
| `infravenz-logo-1024.png` / `-512.png` | PNG con fondo transparente |
| `src/generar_logo.py` | Arma el emblema (`python3 src/generar_logo.py`, requiere `fonttools`) |
| `src/retrato-foto.png` | Retrato usado en el logo: foto del cuadro restaurada en sepia (`src/retrato_foto.py`) |
| `src/retrato.svg` | Alternativa ilustrada en vector (`RETRATO=retrato.svg python3 src/generar_logo.py`) |
| `src/vectorizar_retrato.py` | Genera `retrato.svg` desde `src/foto-retrato.jpg` (requiere `opencv-python-headless` y `vtracer`) |
| `src/foto-retrato.jpg` | Foto de referencia: cuadro del Prof. Ventura Zelaya |
| `src/logo-original.png` | Logo original de referencia |

Elementos que se conservan del original: lira, rayos dorados, laureles,
retrato, "SANTA ROSA DE LIMA" y la cinta "INFRAVENZ".

El retrato sale de una foto pequeña (unos 157 × 200 px), así que para impresiones
muy grandes conviene conseguir un escaneo de mejor resolución del cuadro.

Tipografía: Cinzel (SIL Open Font License).
