#!/usr/bin/env python3
"""Vectoriza el retrato del Prof. Francisco Ventura Zelaya a partir de la foto
de su cuadro (src/foto-retrato.jpg) y escribe src/retrato.svg.

Pasos: recorte del cuadro -> ampliación -> separación del fondo (GrabCut) ->
suavizado conservando bordes -> posterizado en 4 tonos -> trazado con vtracer.

Requiere: pillow, numpy, opencv-python-headless, vtracer.
"""
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
PALETTE = [(38, 32, 28), (104, 88, 72), (186, 168, 142), (246, 238, 222)]


def main():
    img = cv2.imread(str(SRC))
    x0, y0, x1, y1 = CROP
    img = img[y0:y1, x0:x1]
    img = cv2.resize(img, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_LANCZOS4)
    h, w = img.shape[:2]

    # --- máscara de la figura con GrabCut, sembrada con zonas seguras
    mask = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
    s = SCALE / 4  # las coordenadas de abajo se midieron en la ampliación x4
    def P(pts):
        return (np.array(pts, np.float32) * s).astype(np.int32)
    figura = P([(215, 80), (330, 30), (445, 90), (470, 220), (455, 420),
                (600, 540), (628, 800), (30, 800), (40, 430), (175, 370),
                (150, 230)])
    cv2.fillPoly(mask, [figura], cv2.GC_PR_FGD)
    cara = P([(240, 120), (330, 70), (420, 120), (440, 300), (400, 440),
              (300, 470), (210, 380), (200, 250)])
    traje = P([(80, 600), (560, 600), (600, 790), (60, 790)])
    cv2.fillPoly(mask, [cara, traje], cv2.GC_FGD)
    fondo = [P([(0, 0), (628, 0), (628, 20), (0, 20)]),
             P([(0, 0), (120, 0), (40, 330), (0, 360)]),
             P([(530, 0), (628, 0), (628, 470), (520, 380)])]
    cv2.fillPoly(mask, fondo, cv2.GC_BGD)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    # suavizar el contorno y quedarse con la región mayor
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((21, 21), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg)
    if n > 1:
        big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        fg = np.where(lab == big, 255, 0).astype(np.uint8)
    fg = cv2.GaussianBlur(fg, (0, 0), 6)
    fg = np.where(fg > 127, 255, 0).astype(np.uint8)

    # --- tono: luminancia, contraste local y suavizado conservando bordes
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 15, 40, 12)
    gray = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(4, 4)).apply(gray)
    gray = cv2.bilateralFilter(gray, 21, 30, 18)
    vals = gray[fg > 0]
    cuts = np.percentile(vals, [24, 50, 76])
    levels = np.digitize(gray, cuts)
    # filtro de moda para limpiar manchas pequeñas
    for _ in range(2):
        votes = np.stack([cv2.blur((levels == k).astype(np.float32), (15, 15)) for k in range(4)])
        levels = np.argmax(votes, axis=0)

    out = np.zeros((h, w, 4), np.uint8)
    for k, (r, g, b) in enumerate(PALETTE):
        out[levels == k] = (r, g, b, 255)
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
    OUT.write_text(svg)
    print("escrito", OUT, (w, h))


if __name__ == "__main__":
    main()
