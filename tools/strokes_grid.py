"""Development only: draws Arabic letters from the app's own font on a grid, with any hand strokes over them,
so hand-written stroke paths (tools/make_strokes.py, HAND) can be checked against the real letterform.
    python -I tools/strokes_grid.py out.png ج ح س"""
import os, sys, json
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
S = 320
font = ImageFont.truetype(os.path.join(ROOT, '..', 'web', 'fonts', 'Amiri-700-arabic.woff2'), 210)
lab = ImageFont.truetype(os.path.join(ROOT, '..', 'web', 'fonts', 'Quicksand-400-700-latin.woff2'), 13)
out, chars = sys.argv[1], sys.argv[2:]
hand = {}
try:
    from make_strokes_hand import HAND
    hand = HAND
except Exception:
    pass
sheet = Image.new('RGB', (S * len(chars), S + 20), (250, 250, 250)); d = ImageDraw.Draw(sheet)
for i, ch in enumerate(chars):
    ox = i * S
    g = Image.new('L', (S, S), 0); gd = ImageDraw.Draw(g)
    x0, y0, x1, y1 = gd.textbbox((0, 0), ch, font=font)
    gd.text(((S - (x1 - x0)) / 2 - x0, (S - (y1 - y0)) / 2 - y0), ch, 255, font=font)
    sheet.paste(Image.new('RGB', (S, S), (200, 200, 210)), (ox, 0), g)
    for v in range(0, S + 1, 20):
        d.line([(ox + v, 0), (ox + v, S)], fill=(225, 120, 120) if v % 100 == 0 else (230, 230, 236), width=1)
        d.line([(ox, v), (ox + S, v)], fill=(225, 120, 120) if v % 100 == 0 else (230, 230, 236), width=1)
    sheet.paste(Image.new('RGB', (S, S), (150, 150, 165)), (ox, 0), g.point(lambda p: 150 if p > 110 else 0))
    for si, st in enumerate(hand.get(ch, [])):
        pts = [(ox + x, y) for x, y in st]
        if len(pts) > 1: d.line(pts, fill=(200, 40, 40), width=3, joint='curve')
        else: d.ellipse([pts[0][0] - 6, pts[0][1] - 6, pts[0][0] + 6, pts[0][1] + 6], outline=(200, 40, 40), width=3)
        d.ellipse([pts[0][0] - 4, pts[0][1] - 4, pts[0][0] + 4, pts[0][1] + 4], fill=(30, 140, 60))
        d.text((pts[0][0] + 6, pts[0][1] - 14), str(si + 1), fill=(30, 140, 60), font=lab)
    for v in range(0, S, 40): d.text((ox + 2, v + 2), str(v), fill=(120, 120, 120), font=lab); d.text((ox + v + 2, S + 3), str(v), fill=(120, 120, 120), font=lab)
sheet.save(out)
print(out)
