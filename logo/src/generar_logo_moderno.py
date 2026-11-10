#!/usr/bin/env python3
"""Versión moderna del emblema de INFRAVENZ: diseño plano (sin degradados),
tipografía sans-serif (Inter), retrato a dos tonos y laurel sutil.

    python3 generar_logo_moderno.py      # escribe ../infravenz-logo-moderno.svg
"""
import math
import os
import re
from pathlib import Path

from generar_logo import cargar_fuente, f, leaf, pol, text_on_arc

HERE = Path(__file__).resolve().parent
OUT = Path(os.environ.get("SALIDA", HERE.parent / "infravenz-logo-moderno.svg"))
INTER_SB = cargar_fuente("Inter-SemiBold.otf")
INTER_B = cargar_fuente("Inter-Bold.otf")

VERDE, ORO, CREMA, ORO_SUAVE = "#123D24", "#D9A93A", "#F6EFE1", "#E9DAB2"
CX, CY = 500, 500
R_EXT, R_LINEA, R_INT = 440, 424, 336
Y_FRANJA = 688  # línea donde empieza la franja verde inferior


def lira(x, y, escala, color):
    """Lira de trazo simple, centrada en (x, y)."""
    t = f"translate({f(x - 60 * escala)},{f(y - 66 * escala)}) scale({f(escala)})"
    return (
        f'<g transform="{t}" fill="none" stroke="{color}" stroke-width="11" '
        f'stroke-linecap="round" stroke-linejoin="round">'
        '<path d="M42,118 C8,106 2,66 24,44 C36,32 30,14 16,12"/>'
        '<path d="M78,118 C112,106 118,66 96,44 C84,32 90,14 104,12"/>'
        '<path d="M30,121 L90,121 M22,42 L98,42"/>'
        '<path d="M50,46 L50,116 M60,46 L60,116 M70,46 L70,116" stroke-width="5"/>'
        "</g>"
    )


def laurel_suave():
    """Ramas de laurel en oro pálido, detrás del retrato, en ambos lados."""
    hojas, tallos = [], []
    R = 300
    for lado in (1, -1):
        pts = [pol(R, (t if lado == 1 else 180 - t), CX, CY) for t in range(96, 200, 4)]
        tallos.append("M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts))
    for lado in (1, -1):
        for i, t in enumerate(range(100, 196, 12)):
            th = t if lado == 1 else 180 - t
            bx, by = pol(R, th, CX, CY)
            tang = th + 90 * lado
            for s in (1, -1):
                largo = 54 - 2.5 * i
                b, _, _ = leaf(bx, by, tang + s * 34 * lado, largo, 12)
                hojas.append(b)
    return " ".join(tallos), " ".join(hojas)


def retrato():
    src = (HERE / "retrato-ilustracion-moderno.svg").read_text()
    vb_w, vb_h = (float(v) for v in re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', src).groups())
    w = 452
    s = w / vb_w
    x0, y0 = CX - 0.5 * w, 192
    body = re.search(r"<svg[^>]*>(.*)</svg>", src, re.S).group(1)
    paths = re.sub(r"<\?xml[^>]*>|<!--.*?-->", "", body, flags=re.S).strip()
    return f'<g transform="translate({f(x0)},{f(y0)}) scale({s:.5f})">\n{paths}\n</g>'


def build():
    arriba = text_on_arc("PROF. FRANCISCO VENTURA ZELAYA", 33, 371, -90, True,
                         tracking=5.5, cx=CX, cy=CY, font=INTER_SB)
    abajo = text_on_arc("SANTA ROSA DE LIMA", 33, 396, 90, False,
                        tracking=9, cx=CX, cy=CY, font=INTER_SB)
    # INFRAVENZ recto, centrado en la franja
    nombre = text_on_arc("INFRAVENZ", 50, 100000, 90, False, tracking=11,
                         cx=CX, cy=752 - 100000, font=INTER_B)
    # franja inferior: segmento del círculo interior por debajo de Y_FRANJA
    dx = math.sqrt(R_INT ** 2 - (Y_FRANJA - CY) ** 2)
    franja = (f"M{f(CX - dx)},{Y_FRANJA} L{f(CX + dx)},{Y_FRANJA} "
              f"A{R_INT},{R_INT} 0 0 1 {f(CX - dx)},{Y_FRANJA} Z")
    tallos, hojas = laurel_suave()
    lx, ly = pol(384, 180, CX, CY)
    rx, ry = pol(384, 0, CX, CY)

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <title>INFRAVENZ — Prof. Francisco Ventura Zelaya (versión moderna)</title>
  <defs><clipPath id="disco"><circle cx="{CX}" cy="{CY}" r="{R_INT}"/></clipPath></defs>

  <circle cx="{CX}" cy="{CY}" r="{R_EXT}" fill="{VERDE}"/>
  <circle cx="{CX}" cy="{CY}" r="{R_LINEA}" fill="none" stroke="{ORO}" stroke-width="3"/>

  <path d="{arriba}" fill="{CREMA}"/>
  <path d="{abajo}" fill="{CREMA}"/>
  {lira(lx, ly, 0.4, ORO)}
  {lira(rx, ry, 0.4, ORO)}

  <circle cx="{CX}" cy="{CY}" r="{R_INT}" fill="{CREMA}"/>
  <g clip-path="url(#disco)">
    <path d="{tallos}" fill="none" stroke="{ORO_SUAVE}" stroke-width="5" stroke-linecap="round"/>
    <path d="{hojas}" fill="{ORO_SUAVE}"/>
    {retrato()}
    <path d="{franja}" fill="{VERDE}"/>
    <line x1="{f(CX - dx)}" y1="{Y_FRANJA}" x2="{f(CX + dx)}" y2="{Y_FRANJA}" stroke="{ORO}" stroke-width="5"/>
  </g>
  <circle cx="{CX}" cy="{CY}" r="{R_INT}" fill="none" stroke="{ORO}" stroke-width="5"/>
  <path d="{nombre}" fill="{ORO}"/>
</svg>
"""


if __name__ == "__main__":
    OUT.write_text(build())
    print("escrito", OUT)
