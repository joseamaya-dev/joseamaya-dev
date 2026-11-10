#!/usr/bin/env python3
"""Genera el emblema rediseñado de INFRAVENZ (Prof. Francisco Ventura Zelaya).

Todo el texto se convierte en trazos con fontTools, así el SVG final no
depende de fuentes instaladas. Uso:

    python3 generar_logo.py            # escribe ../infravenz-logo.svg
"""
import base64
import math
import os
import re
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HERE = Path(__file__).resolve().parent
OUT = Path(os.environ.get("SALIDA", HERE.parent / "infravenz-logo.svg"))


def cargar_fuente(nombre):
    t = TTFont(HERE / nombre)
    return t.getGlyphSet(), t.getBestCmap(), t["head"].unitsPerEm


CINZEL = cargar_fuente("Cinzel-700.ttf")

# Paleta
GOLD_HI, GOLD, GOLD_LO, GOLD_EDGE = "#FCE597", "#E3AE2F", "#B47A14", "#7A4E06"
GREEN_DK, GREEN, GREEN_LT, GREEN_EDGE = "#123D24", "#2E7D3A", "#4FA352", "#0B2A18"
CREAM, RAY = "#FFFBEF", "#F7E6AE"

CX, CY = 500, 470  # centro del medallón


def pol(r, deg, cx=CX, cy=CY):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


# ---------------------------------------------------------------- texto
def glyph_path(ch, size, x, y, rot, font=CINZEL):
    """Trazado de un glifo con su centro de avance en (x, y) y giro rot (°)."""
    GLYPHS, CMAP, UPM = font
    name = CMAP[ord(ch)]
    adv = GLYPHS[name].width
    s = size / UPM
    a = math.radians(rot)
    c, si = math.cos(a), math.sin(a)
    # local: L = ((gx - adv/2)*s, -gy*s); luego rotar por `rot` y trasladar a (x, y).
    # fontTools: (xx, xy, yx, yy, dx, dy) -> X = xx*gx + yx*gy + dx, Y = xy*gx + yy*gy + dy
    half = adv / 2 * s
    m = (c * s, si * s, si * s, -c * s, x - c * half, y - si * half)
    pen = SVGPathPen(GLYPHS)
    GLYPHS[name].draw(TransformPen(pen, m))
    return pen.getCommands()


def text_on_arc(text, size, r, center_deg, up_outward, tracking=0.0, cx=CX, cy=CY, font=CINZEL):
    GLYPHS, CMAP, UPM = font
    s = size / UPM
    advs = [GLYPHS[CMAP[ord(ch)]].width * s + tracking for ch in text]
    total = sum(advs) - tracking
    cmds, cum = [], 0.0
    for ch, adv in zip(text, advs):
        mid = cum + (adv - tracking) / 2
        if up_outward:  # se lee en sentido horario (texto superior)
            th = center_deg - math.degrees(total / 2 / r) + math.degrees(mid / r)
            rot = th + 90
        else:  # se lee en sentido antihorario (texto inferior / cinta)
            th = center_deg + math.degrees(total / 2 / r) - math.degrees(mid / r)
            rot = th - 90
        cum += adv
        if ch == " ":
            continue
        x, y = pol(r, th, cx, cy)
        cmds.append(glyph_path(ch, size, x, y, rot, font))
    return " ".join(cmds)


# ---------------------------------------------------------------- piezas
def star(x, y, r, rot=-90):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.42
        a = math.radians(rot + i * 36)
        pts.append(f"{f(x + rr * math.cos(a))},{f(y + rr * math.sin(a))}")
    return "M" + " L".join(pts) + " Z"


def leaf(bx, by, ang, length, width):
    """Hoja con base en (bx,by) apuntando en ang (°)."""
    a = math.radians(ang)
    ux, uy = math.cos(a), math.sin(a)
    nx, ny = -uy, ux
    tip = (bx + ux * length, by + uy * length)
    c1 = (bx + ux * length * 0.25 + nx * width, by + uy * length * 0.25 + ny * width)
    c2 = (bx + ux * length * 0.75 + nx * width * 0.9, by + uy * length * 0.75 + ny * width * 0.9)
    c3 = (bx + ux * length * 0.75 - nx * width * 0.9, by + uy * length * 0.75 - ny * width * 0.9)
    c4 = (bx + ux * length * 0.25 - nx * width, by + uy * length * 0.25 - ny * width)
    body = (
        f"M{f(bx)},{f(by)} C{f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(tip[0])},{f(tip[1])} "
        f"C{f(c3[0])},{f(c3[1])} {f(c4[0])},{f(c4[1])} {f(bx)},{f(by)} Z"
    )
    # media hoja clara para dar volumen
    half = (
        f"M{f(bx)},{f(by)} C{f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(tip[0])},{f(tip[1])} Z"
    )
    rib = f"M{f(bx)},{f(by)} L{f(bx + ux * length * 0.85)},{f(by + uy * length * 0.85)}"
    return body, half, rib


def laurel_branch():
    """Rama izquierda; la derecha es su reflejo."""
    R, t0, t1 = 352, 104, 232
    stem_pts = [pol(R, t) for t in range(t0, t1 + 1, 2)]
    stem = "M" + " L".join(f"{f(x)},{f(y)}" for x, y in stem_pts)
    tail = f"M{f(stem_pts[0][0])},{f(stem_pts[0][1])} Q{f(450)},{f(850)} {f(560)},{f(872)}"
    bodies, halves, ribs = [], [], []
    steps = list(range(t0 + 6, t1 - 4, 10))
    for i, t in enumerate(steps):
        k = (t - t0) / (t1 - t0)
        L = 78 - 34 * k
        W = 17 - 6 * k
        bx, by = pol(R, t)
        tang = t + 90  # dirección hacia la punta (θ creciente)
        for side, off in ((1, -1), (-1, 1)):
            ang = tang + side * 38 + (4 if i % 2 else -4)
            # la hoja exterior apunta hacia fuera del círculo
            b, h, rb = leaf(bx, by, ang + (0 if side > 0 else 0), L, W)
            bodies.append(b)
            halves.append(h)
            ribs.append(rb)
    # hoja final en la punta
    bx, by = pol(R, t1)
    b, h, rb = leaf(bx, by, t1 + 90, 46, 11)
    bodies.append(b), halves.append(h), ribs.append(rb)
    return stem, tail, bodies, halves, ribs


def lyre(cx, bottom, scale):
    """Lira estilizada (símbolo del original) como cimera del escudo."""
    t = f"translate({f(cx - 60 * scale)},{f(bottom - 128 * scale)}) scale({f(scale)})"
    return f"""
  <g transform="{t}" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <g stroke="{GOLD_EDGE}" stroke-width="15">
      <path d="M42,118 C8,106 2,66 24,44 C36,32 30,14 16,12"/>
      <path d="M78,118 C112,106 118,66 96,44 C84,32 90,14 104,12"/>
      <path d="M30,121 L90,121"/><path d="M22,42 L98,42"/>
    </g>
    <g stroke="url(#gold)" stroke-width="9">
      <path d="M42,118 C8,106 2,66 24,44 C36,32 30,14 16,12"/>
      <path d="M78,118 C112,106 118,66 96,44 C84,32 90,14 104,12"/>
      <path d="M30,121 L90,121"/><path d="M22,42 L98,42"/>
    </g>
    <g stroke="{GOLD_EDGE}" stroke-width="2.6">
      <path d="M48,44 L48,118 M56,44 L56,118 M64,44 L64,118 M72,44 L72,118"/>
    </g>
    <circle cx="16" cy="12" r="8" fill="url(#gold)" stroke="{GOLD_EDGE}" stroke-width="3"/>
    <circle cx="104" cy="12" r="8" fill="url(#gold)" stroke="{GOLD_EDGE}" stroke-width="3"/>
  </g>"""


def ribbon():
    """Cinta inferior curvada con colas en V."""
    rc_y, r_in, r_out = -260, 1048, 1132
    span = 16.4
    a0, a1 = 90 + span, 90 - span  # izquierda, derecha

    def arc_band(r1, r2, ang_l, ang_r):
        x1, y1 = pol(r2, ang_l, 500, rc_y)
        x2, y2 = pol(r2, ang_r, 500, rc_y)
        x3, y3 = pol(r1, ang_r, 500, rc_y)
        x4, y4 = pol(r1, ang_l, 500, rc_y)
        return (
            f"M{f(x1)},{f(y1)} A{r2},{r2} 0 0 0 {f(x2)},{f(y2)} "
            f"L{f(x3)},{f(y3)} A{r1},{r1} 0 0 1 {f(x4)},{f(y4)} Z"
        )

    main = arc_band(r_in, r_out, a0, a1)
    edge = arc_band(r_in - 9, r_out + 9, a0, a1)
    # colas
    lx_top, ly_top = pol(r_in + 22, a0 - 0.6, 500, rc_y)
    lx_bot, ly_bot = pol(r_out + 22, a0 - 0.6, 500, rc_y)
    tails, folds = [], []
    for sgn in (1, -1):
        def X(x):
            return x if sgn == 1 else 1000 - x
        tx, ty = lx_top, ly_top + 26
        bx, by = lx_bot, ly_bot + 26
        tails.append(
            f"M{f(X(tx + 40))},{f(ty - 4)} L{f(X(tx - 75))},{f(ty - 10)} L{f(X(tx - 42))},{f((ty + by) / 2 - 6)} "
            f"L{f(X(bx - 78))},{f(by)} L{f(X(bx + 40))},{f(by + 6)} Z"
        )
        folds.append(
            f"M{f(X(tx + 24))},{f(ty - 18)} L{f(X(tx + 40))},{f(ty - 4)} L{f(X(bx + 40))},{f(by + 6)} L{f(X(bx + 24))},{f(by - 12)} Z"
        )
    text = text_on_arc("INFRAVENZ", 54, (r_in + r_out) / 2 + 20, 90, False, tracking=22, cx=500, cy=rc_y)
    return main, edge, tails, folds, text


def portrait():
    """Retrato dentro del medallón. Por defecto, la ilustración de la biblioteca
    de INFRAVENZ vectorizada; también acepta un PNG con transparencia."""
    archivo = HERE / os.environ.get("RETRATO", "retrato-ilustracion.svg")
    w = 404
    if archivo.suffix == ".png":
        from PIL import Image
        vb_w, vb_h = Image.open(archivo).size
        s = w / vb_w
        data = base64.b64encode(archivo.read_bytes()).decode()
        return (f'<image x="{f(CX - 0.49 * w)}" y="258" width="{f(w)}" height="{f(vb_h * s)}" '
                f'href="data:image/png;base64,{data}"/>')
    src = archivo.read_text()
    vb_w, vb_h = (float(v) for v in re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', src).groups())
    s = w / vb_w
    x0 = CX - 0.5 * w
    y0 = 262
    body = re.search(r"<svg[^>]*>(.*)</svg>", src, re.S).group(1)
    paths = re.sub(r"<\?xml[^>]*>|<!--.*?-->", "", body, flags=re.S).strip()
    return f'<g transform="translate({f(x0)},{f(y0)}) scale({s:.5f})">\n{paths}\n</g>'


# ---------------------------------------------------------------- ensamblaje
def build():
    R_GOLD, R_BAND_O, R_BAND_I, R_DISC = 306, 294, 240, 228

    stem, tail, bodies, halves, ribs = laurel_branch()
    laurel = f"""
    <path d="{tail}" stroke="{GREEN_EDGE}" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="{stem}" stroke="{GREEN_EDGE}" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="{stem}" stroke="{GREEN}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="{' '.join(bodies)}" fill="{GREEN}" stroke="{GREEN_EDGE}" stroke-width="3"/>
    <path d="{' '.join(halves)}" fill="{GREEN_LT}"/>
    <path d="{' '.join(ribs)}" stroke="{GREEN_EDGE}" stroke-width="1.6" fill="none" opacity=".7"/>"""

    rays = []
    px, py = CX, 560
    n = 15
    for i in range(n):
        a0 = -172 + i * (164 / n)
        a1 = a0 + 164 / n * 0.5
        x0, y0 = pol(400, a0, px, py)
        x1, y1 = pol(400, a1, px, py)
        rays.append(f"M{px},{py} L{f(x0)},{f(y0)} L{f(x1)},{f(y1)} Z")

    top_text = text_on_arc("PROF. FRANCISCO VENTURA ZELAYA", 31, 254, -90, True, tracking=3.2)
    bot_text = text_on_arc("SANTA ROSA DE LIMA", 31, 280, 90, False, tracking=6)
    stars = " ".join(star(*pol(267, a), 11, rot=a) for a in (180, 0))

    r_main, r_edge, r_tails, r_folds, r_text = ribbon()

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <title>INFRAVENZ — Prof. Francisco Ventura Zelaya</title>
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{GOLD_HI}"/>
      <stop offset=".45" stop-color="{GOLD}"/>
      <stop offset="1" stop-color="{GOLD_LO}"/>
    </linearGradient>
    <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFF1BE"/>
      <stop offset="1" stop-color="#F0C04A"/>
    </linearGradient>
    <radialGradient id="disc" cx=".5" cy=".38" r=".7">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="{CREAM}"/>
    </radialGradient>
    <clipPath id="discClip"><circle cx="{CX}" cy="{CY}" r="{R_DISC}"/></clipPath>
  </defs>

  <!-- Laureles -->
  <g id="laurel-izq">{laurel}
  </g>
  <g id="laurel-der" transform="translate(1000,0) scale(-1,1)">{laurel}
  </g>

  <!-- Anillo dorado y banda verde -->
  <circle cx="{CX}" cy="{CY}" r="{R_GOLD + 3}" fill="{GOLD_EDGE}"/>
  <circle cx="{CX}" cy="{CY}" r="{R_GOLD}" fill="url(#gold)"/>
  <circle cx="{CX}" cy="{CY}" r="{R_BAND_O}" fill="{GREEN_DK}"/>
  <circle cx="{CX}" cy="{CY}" r="{R_BAND_O - 5}" fill="none" stroke="{GOLD}" stroke-width="1.5" opacity=".7"/>
  <circle cx="{CX}" cy="{CY}" r="{R_BAND_I}" fill="url(#gold)" stroke="{GOLD_EDGE}" stroke-width="2"/>

  <!-- Medallón con rayos y retrato -->
  <circle cx="{CX}" cy="{CY}" r="{R_DISC}" fill="url(#disc)" stroke="{GOLD_EDGE}" stroke-width="2.5"/>
  <g clip-path="url(#discClip)">
    <path d="{' '.join(rays)}" fill="{RAY}"/>
    {portrait()}
  </g>

  <!-- Textos de la banda -->
  <path d="{top_text}" fill="url(#goldText)"/>
  <path d="{bot_text}" fill="url(#goldText)"/>
  <path d="{stars}" fill="url(#gold)"/>

  <!-- Lira (cimera) -->
  <g>
    <ellipse cx="500" cy="160" rx="62" ry="22" fill="{GOLD_EDGE}" opacity=".0"/>
    {lyre(500, 176, 1.05)}
  </g>

  <!-- Cinta INFRAVENZ -->
  <path d="{' '.join(r_tails)}" fill="{GREEN_DK}" stroke="{GOLD}" stroke-width="3" stroke-linejoin="round"/>
  <path d="{' '.join(r_folds)}" fill="{GREEN_EDGE}"/>
  <path d="{r_edge}" fill="url(#gold)" stroke="{GOLD_EDGE}" stroke-width="2"/>
  <path d="{r_main}" fill="{GREEN_DK}"/>
  <path d="{r_text}" fill="url(#goldText)"/>
</svg>
"""


if __name__ == "__main__":
    OUT.write_text(build())
    print("escrito", OUT)
