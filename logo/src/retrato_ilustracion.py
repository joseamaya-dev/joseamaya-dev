#!/usr/bin/env python3
"""Vectoriza la ilustración del Prof. Francisco Ventura Zelaya publicada por la
biblioteca de INFRAVENZ (src/ilustracion-biblioteca.png) y la pasa a tonos
cálidos. Escribe src/retrato-ilustracion.svg (usado por generar_logo.py).

Requiere: numpy, pillow, vtracer.
"""
import tempfile
from pathlib import Path

import numpy as np
import vtracer
from PIL import Image, ImageFilter

HERE = Path(__file__).resolve().parent
ESCALA = 3
# gris original -> tono cálido (contorno, sombra, saco, piel, luz)
TONOS = {
    0: (30, 26, 23),
    99: (104, 84, 70),
    115: (128, 106, 90),
    153: (226, 206, 182),
    179: (246, 237, 223),
}


def main():
    im = Image.open(HERE / "ilustracion-biblioteca.png").convert("RGBA")
    w, h = im.size
    im = im.resize((w * ESCALA, h * ESCALA), Image.LANCZOS)
    a = np.asarray(im).astype(np.int16)
    gris = a[..., :3].mean(axis=2)
    claves = np.array(sorted(TONOS))
    idx = np.abs(gris[..., None] - claves[None, None, :]).argmin(axis=2)
    # filtro de moda para que los bordes queden limpios
    idx_img = Image.fromarray(idx.astype(np.uint8)).filter(ImageFilter.ModeFilter(5))
    idx = np.asarray(idx_img)
    out = np.zeros(a.shape, np.uint8)
    for i, k in enumerate(claves):
        out[idx == i, :3] = TONOS[k]
    alfa = np.asarray(Image.fromarray((a[..., 3] > 127).astype(np.uint8) * 255).filter(ImageFilter.ModeFilter(5)))
    out[..., 3] = alfa
    with tempfile.TemporaryDirectory() as tmp:
        png = Path(tmp) / "q.png"
        Image.fromarray(out).save(png)
        svg_path = HERE / "retrato-ilustracion.svg"
        vtracer.convert_image_to_svg_py(
            str(png), str(svg_path), colormode="color", hierarchical="stacked", mode="spline",
            filter_speckle=16, color_precision=8, layer_difference=4,
            corner_threshold=60, length_threshold=4.0, splice_threshold=45, path_precision=1,
        )
    W, H = w * ESCALA, h * ESCALA
    s = svg_path.read_text().replace(f'width="{W}" height="{H}"', f'viewBox="0 0 {W} {H}"')
    svg_path.write_text(s)
    print("escrito", svg_path, (W, H), len(s) // 1024, "KB")


if __name__ == "__main__":
    main()
