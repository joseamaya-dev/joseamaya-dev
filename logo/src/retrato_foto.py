#!/usr/bin/env python3
"""Genera src/retrato-foto.png: la foto del cuadro del Prof. Francisco Ventura
Zelaya restaurada en tono sepia, recortada por su silueta y con fondo
transparente. generar_logo.py la usa cuando RETRATO=retrato-foto.png.

Requiere: numpy, opencv-python-headless.
"""
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
SCALE = 6
K = SCALE / 4  # las coordenadas de abajo se midieron sobre la ampliación x4
CROP = (228, 40, 385, 240)  # x0, y0, x1, y1: el cuadro dentro del marco dorado
SILUETA = [(150, 215), (172, 205), (196, 170), (205, 120), (230, 75), (290, 42),
           (360, 34), (420, 55), (455, 100), (466, 170), (470, 250), (462, 330),
           (450, 400), (440, 455), (462, 486), (520, 512), (580, 552), (618, 600),
           (622, 772), (48, 772), (50, 520), (58, 446), (104, 410), (172, 376),
           (186, 352), (160, 322), (144, 268)]
LENTES = [((325, 263), (47, 38)), ((428, 277), (35, 37))]
# Duotono sepia: sombra, medio y luz (RGB)
OSCURO, MEDIO, CLARO = (30, 26, 24), (150, 120, 92), (246, 236, 218)


def silueta(h, w):
    pts = np.array(SILUETA, np.float32) * K
    for _ in range(3):  # suavizado de Chaikin
        a, b = pts, np.roll(pts, -1, axis=0)
        pts = np.empty((len(a) * 2, 2), np.float32)
        pts[0::2], pts[1::2] = 0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b
    m = np.zeros((h, w), np.uint8)
    cv2.fillPoly(m, [pts.astype(np.int32)], 255)
    return m


def main():
    x0, y0, x1, y1 = CROP
    img = cv2.imread(str(HERE / "foto-retrato.jpg"))[y0:y1, x0:x1]
    img = cv2.resize(img, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_CUBIC)
    h, w = img.shape[:2]
    fg = silueta(h, w)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.fastNlMeansDenoising(gray, None, h=9, templateWindowSize=7, searchWindowSize=21)
    gray = cv2.bilateralFilter(gray, 9, 25, 9)
    gray = cv2.createCLAHE(clipLimit=1.8, tileGridSize=(3, 3)).apply(gray)

    g = gray.astype(np.float32) / 255
    lo, hi = np.percentile(g[fg > 0], [2, 98])
    g = np.clip((g - lo) / (hi - lo), 0, 1)

    # aclarar el interior de los lentes (en la foto parecen gafas oscuras)
    lens = np.zeros((h, w), np.uint8)
    for (cx, cy), (rx, ry) in LENTES:
        cv2.ellipse(lens, (int(cx * K), int(cy * K)), (int(rx * K), int(ry * K)), 0, 0, 360, 255, -1)
    lens = cv2.GaussianBlur(lens, (0, 0), 10).astype(np.float32) / 255
    g = g * (1 - lens) + (g ** 0.6 * 0.85 + 0.12) * lens
    g = np.clip(g, 0, 1)[..., None]

    o, m, c = (np.array(v, np.float32) for v in (OSCURO, MEDIO, CLARO))
    rgb = np.where(g < 0.5, o + (m - o) * (g / 0.5), m + (c - m) * ((g - 0.5) / 0.5))
    alpha = cv2.GaussianBlur(fg, (0, 0), 5)
    out = np.dstack([rgb[..., 2], rgb[..., 1], rgb[..., 0], alpha]).astype(np.uint8)
    cv2.imwrite(str(HERE / "retrato-foto.png"), out)
    print("escrito", HERE / "retrato-foto.png", (w, h))


if __name__ == "__main__":
    main()
