#!/usr/bin/env python3
"""Vectoriza el retrato del Prof. Francisco Ventura Zelaya a partir de la foto
de su cuadro (src/foto-retrato.jpg) y escribe src/retrato.svg.

Pasos: recorte del cuadro -> ampliación -> separación del fondo (GrabCut) ->
suavizado conservando bordes -> posterizado en 4 tonos -> trazado con vtracer.

Requiere: pillow, numpy, opencv-python-headless, vtracer.
"""
import re
import sys
from pathlib import Path

import cv2
import numpy as np
import vtracer

HERE = Path(__file__).resolve().parent
SRC = HERE / "foto-retrato.jpg"
OUT = HERE / "retrato.svg"
WORK = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / ".tmp"
WORK.mkdir(exist_ok=True)

SCALE = 6
CROP = (228, 40, 385, 240)  # x0, y0, x1, y1: el cuadro dentro del marco dorado

# Tonos (de oscuro a claro): carbón cálido, sepia, piel clara, luz
PALETTE = [(34, 29, 26), (88, 74, 62), (150, 132, 112), (205, 189, 166), (247, 240, 226)]


def main():
    img = cv2.imread(str(SRC))
    x0, y0, x1, y1 = CROP
    img = img[y0:y1, x0:x1]
    img = cv2.resize(img, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_LANCZOS4)
    h, w = img.shape[:2]

    # --- silueta de la figura trazada a mano (coordenadas medidas en la ampliación x4)
    k = SCALE / 4
    silueta = [(150, 215), (172, 205), (196, 170), (205, 120), (230, 75), (290, 42),
               (360, 34), (420, 55), (455, 100), (466, 170), (470, 250), (462, 330),
               (450, 400), (440, 455), (462, 486), (520, 512), (580, 552), (618, 600),
               (622, 772), (48, 772), (50, 520), (58, 446), (104, 410), (172, 376),
               (186, 352), (160, 322), (144, 268)]
    pts = np.array(silueta, np.float32) * k
    for _ in range(3):  # suavizado de Chaikin
        a, b = pts, np.roll(pts, -1, axis=0)
        pts = np.empty((len(a) * 2, 2), np.float32)
        pts[0::2], pts[1::2] = 0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b
    fg = np.zeros((h, w), np.uint8)
    cv2.fillPoly(fg, [pts.astype(np.int32)], 255)

    # --- tono: luminancia, contraste local y suavizado conservando bordes
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 15, 40, 12)
    gray = cv2.createCLAHE(clipLimit=2.4, tileGridSize=(4, 4)).apply(gray)

    # zona de la cabeza (por encima de la línea del mentón) y zona del torso
    barbilla = [(0, 0), (628, 0), (628, 420), (470, 420), (450, 440), (400, 472),
                (330, 484), (250, 444), (172, 376), (0, 376)]
    cabeza = np.zeros((h, w), np.uint8)
    cv2.fillPoly(cabeza, [(np.array(barbilla, np.float32) * k).astype(np.int32)], 255)
    cabeza = cv2.bitwise_and(cabeza, fg)
    torso = cv2.bitwise_and(cv2.bitwise_not(cabeza), fg)
    # cabello: por encima de la línea de nacimiento del pelo
    linea_pelo = [(0, 0), (628, 0), (628, 180), (462, 178), (420, 132), (330, 118),
                  (250, 138), (200, 196), (0, 196)]
    pelo = np.zeros((h, w), np.uint8)
    cv2.fillPoly(pelo, [(np.array(linea_pelo, np.float32) * k).astype(np.int32)], 255)
    pelo = cv2.bitwise_and(pelo, cabeza)
    cara = cv2.bitwise_and(cabeza, cv2.bitwise_not(pelo))

    def posterizar(zona, cortes, suave, moda):
        g = cv2.bilateralFilter(gray, suave, 30, suave)
        g = cv2.GaussianBlur(g, (0, 0), suave / 6)
        lv = np.digitize(g, np.percentile(g[zona > 0], cortes))
        for _ in range(2):  # filtro de moda para limpiar manchas
            votes = np.stack([cv2.blur((lv == i).astype(np.float32), (moda, moda))
                              for i in range(len(cortes) + 1)])
            lv = np.argmax(votes, axis=0)
        return lv

    # cabeza: 4 tonos (sombra, medio, piel, luz), detalle fino
    lv_cab = posterizar(cara, [7, 32, 66], 15, 11)
    lv_pelo = posterizar(pelo, [40, 78], 15, 13)
    # torso: saco oscuro, solapa en tono medio, camisa clara; muy suavizado
    lv_tor = posterizar(torso, [70, 84], 31, 41)
    mapa_cab = np.array([0, 2, 3, 4])
    mapa_tor = np.array([0, 1, 4])
    mapa_pelo = np.array([1, 2, 3])
    # fuera de la camisa, el saco queda en un solo tono oscuro
    camisa_pts = [(172, 372), (240, 470), (300, 600), (335, 650), (402, 668),
                  (412, 520), (446, 462), (400, 472), (330, 484), (250, 444)]
    camisa = np.zeros((h, w), np.uint8)
    cv2.fillPoly(camisa, [(np.array(camisa_pts, np.float32) * k).astype(np.int32)], 255)
    camisa = cv2.GaussianBlur(camisa, (0, 0), 4)
    lv_tor = np.where(camisa > 127, lv_tor, 0)
    levels = np.where(cabeza > 0, mapa_cab[lv_cab], mapa_tor[lv_tor])
    levels = np.where(pelo > 0, mapa_pelo[lv_pelo], levels)

    out = np.zeros((h, w, 4), np.uint8)
    for i, (r, g, b) in enumerate(PALETTE):
        out[levels == i] = (r, g, b, 255)
    out[fg == 0] = (0, 0, 0, 0)
    png = WORK / "retrato_posterizado.png"
    cv2.imwrite(str(png), cv2.cvtColor(out, cv2.COLOR_RGBA2BGRA))

    vtracer.convert_image_to_svg_py(
        str(png), str(OUT), colormode="color", hierarchical="stacked", mode="spline",
        filter_speckle=40, color_precision=8, layer_difference=8,
        corner_threshold=60, length_threshold=6.0, splice_threshold=45, path_precision=1,
    )
    svg = OUT.read_text()
    svg = svg.replace(f'width="{w}" height="{h}"', f'viewBox="0 0 {w} {h}"')
    # lentes redondos de montura fina (coordenadas en la ampliación x4)
    c = "#221D1A"
    lentes = (
        f'<g fill="none" stroke="{c}" stroke-width="{4.5 * k:.1f}" stroke-linecap="round" '
        f'transform="scale({k})">'
        '<ellipse cx="325" cy="263" rx="49" ry="40"/>'
        '<ellipse cx="428" cy="277" rx="37" ry="39" transform="rotate(6 428 277)"/>'
        '<path d="M374,258 Q383,249 391,263"/>'
        '<path d="M277,254 L206,236"/>'
        '</g>'
        f'<path d="M112,420 Q205,520 262,700" fill="none" '
        f'stroke="#5A4B40" stroke-width="{4 * k:.1f}" stroke-linecap="round" transform="scale({k})"/>'
        f'<path d="M302,384 Q342,399 382,388" fill="none" stroke="#5C4B3F" '
        f'stroke-width="{4 * k:.1f}" stroke-linecap="round" transform="scale({k})"/>'
    )
    svg = svg.replace("</svg>", lentes + "\n</svg>")
    # contorno de la silueta, debajo de las capas, para separarla del fondo claro
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z"
    contorno = f'<path d="{d}" fill="none" stroke="#221D1A" stroke-width="{9 * k:.1f}" stroke-linejoin="round"/>'
    svg = re.sub(r"(<svg[^>]*>)", lambda m: m.group(1) + "\n" + contorno, svg, count=1)
    OUT.write_text(svg)
    print("escrito", OUT, (w, h))


if __name__ == "__main__":
    main()
