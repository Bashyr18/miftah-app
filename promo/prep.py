"""Inputs for the demo film (promo/ad.html), from the app itself:
  - promo/sheet.png: the first page of a real saved practice sheet (a PDF the app made), at 200 dpi;
  - promo/marks.js: window.MARKS, the measured regions of every guide screenshot (promo/marks-src.json, a raw capture from tools/guide-shots.js), and window.SHEET,
    the sheet's answer boxes, tick boxes and the number to circle, as fractions of the page, found in the PDF itself.

    python -I promo/prep.py [path/to/sheet.pdf]       (default: the newest "Maths practice" in Documents/Miftah/Printables)
Needs PyMuPDF."""
import fitz, glob, io, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
src = sys.argv[1] if len(sys.argv) > 1 else max(glob.glob(os.path.expanduser(r'~/Documents/Miftah/Printables/Miftah Maths practice*.pdf')), key=os.path.getmtime)
pg = fitz.open(src)[0]; W, H = pg.rect.width, pg.rect.height
pg.get_pixmap(dpi=200).save(os.path.join(HERE, 'sheet.png'))
mm = lambda v: v * 25.4 / 72
boxes, ticks = [], []
for dr in pg.get_drawings():
    r = dr['rect']
    if 20 <= mm(r.width) <= 30 and 8 <= mm(r.height) <= 12: boxes.append([r.x0 / W, r.y0 / H, r.x1 / W, r.y1 / H])
    elif 6 <= mm(r.width) <= 8 and 6 <= mm(r.height) <= 8: ticks.append([r.x0 / W, r.y0 / H, r.x1 / W, r.y1 / H])
def dedupe(a):
    o = []
    for b in sorted(a, key=lambda b: (round(b[1], 2), b[0])):
        if not any(abs(b[0] - c[0]) < .004 and abs(b[1] - c[1]) < .004 for c in o): o.append(b)
    return o
boxes, ticks = dedupe(boxes), dedupe(ticks)
# "Circle the bigger number: a b": the bigger one, in page units of 1000 across
circle = None
words = pg.get_text('words')
for i, w in enumerate(words):
    if w[4].startswith('number:') and i + 2 < len(words):
        a, b2 = words[i + 1], words[i + 2]
        try:
            big = a if float(a[4]) > float(b2[4]) else b2
            circle = [round((big[0] + big[2]) / 2 / W * 1000, 1), round((big[1] + big[3]) / 2 / H * 1415, 1)]
        except ValueError:
            pass
        break
# the measured boxes from the guide capture (tools/guide-shots.js writes them raw; docs/guide/marks.json keeps only centres)
marks = json.load(io.open(os.path.join(HERE, 'marks-src.json'), encoding='utf8'))
with io.open(os.path.join(HERE, 'marks.js'), 'w', encoding='utf8', newline='\n') as f:
    f.write('/* written by promo/prep.py */\nwindow.MARKS = ' + json.dumps(marks, ensure_ascii=False) + ';\nwindow.SHEET = ' + json.dumps({'boxes': boxes, 'ticks': ticks, 'circle': circle, 'from': os.path.basename(src)}) + ';\n')
print('sheet from', os.path.basename(src), '|', len(boxes), 'answer boxes,', len(ticks), 'tick boxes, circle', circle)
