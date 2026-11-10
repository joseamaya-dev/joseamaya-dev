# Logo INFRAVENZ — rediseño

Emblema en honor al **Prof. Francisco Ventura Zelaya** (1898–1991), maestro y
diputado de Santa Rosa de Lima, La Unión.

![Ilustración de referencia, logo anterior y logo nuevo](comparacion.png)

Hay dos versiones del emblema:

![Versión clásica y versión moderna](versiones.png)

- **Clásica** (`infravenz-logo.svg`): dorados con degradado, laureles, lira y cinta.
- **Moderna** (`infravenz-logo-moderno.svg`): diseño plano en verde, oro y crema,
  tipografía sans-serif, retrato a dos tonos y franja con "INFRAVENZ".

| Archivo | Uso |
|---|---|
| `infravenz-logo.svg` | Archivo maestro, 100 % vectorial (escala sin pérdida; textos convertidos a trazos) |
| `infravenz-logo-1024.png` / `-512.png` | PNG con fondo transparente |
| `infravenz-logo-moderno.svg` | Versión moderna, 100 % vectorial |
| `infravenz-logo-moderno-1024.png` / `-512.png` | Versión moderna en PNG con fondo transparente |
| `src/generar_logo_moderno.py` | Arma la versión moderna (`python3 src/generar_logo_moderno.py`) |
| `src/generar_logo.py` | Arma el emblema (`python3 src/generar_logo.py`, requiere `fonttools`) |
| `src/retrato_ilustracion.py` | Vectoriza la ilustración y la pasa a tonos cálidos (requiere `vtracer`) |
| `src/retrato-ilustracion.svg` / `-moderno.svg` | Retrato vectorial en tonos cálidos (clásica) y a dos tonos verdes (moderna) |
| `src/ilustracion-biblioteca.png` | Ilustración del profesor publicada por la biblioteca de INFRAVENZ |
| `src/logo-original.png` | Logo original de referencia |

Fuente del retrato: blog de apoyo de la biblioteca de INFRAVENZ,
"Biografía de Profesor Francisco Ventura Zelaya" (2020).

Elementos que se conservan del original: lira, rayos dorados, laureles,
retrato, "SANTA ROSA DE LIMA" y la cinta "INFRAVENZ".

Tipografías: Cinzel (clásica) e Inter (moderna), ambas con SIL Open Font License.
