"""Builds the user guide, docs/guide/index.html, from docs/guide/guide.src.html, guide-base.css, guide.js and the screenshots.

    node tools/cdp.js tools/guide-shots.js build/guide2                         (phone screens, dev server on 5191)
    GUIDE=desk CDP_ATTACH=1 ... node tools/cdp.js tools/guide-shots.js build/guide2 9444   (computer screens, see that file)
      each run once per VARIANT: light (default), dark, ar
    python -I tools/build_guide.py

Every screen becomes a sharp, small WebP in docs/guide/shots/<variant>/, the app's own fonts and icon are copied beside the
page, and the measured place of every feature the guide points at becomes a marker position (the centre of its box, in %).
The folder works offline and on GitHub Pages."""
import io, json, os, shutil
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, 'build', 'guide2')
OUT = os.path.join(ROOT, 'docs', 'guide')
FONTS = os.path.join(OUT, 'fonts'); os.makedirs(FONTS, exist_ok=True)

KEPT = os.path.join(OUT, 'marks.json')   # the measured places, kept with the guide so the page can be rebuilt without new screenshots
fresh = os.path.exists(os.path.join(SHOTS, 'marks.json'))
marks = json.load(io.open(os.path.join(SHOTS, 'marks.json'), encoding='utf8')) if fresh else {}
compact, total = ({} if fresh else json.load(io.open(KEPT, encoding='utf8'))), 0
if not fresh:
    print('no new screenshots in build/guide2: rebuilding the page with the pictures already in docs/guide/shots')
for key, m in sorted(marks.items()):
    v, sid = key.split('/')
    src = os.path.join(SHOTS, v, sid + '.png')
    if not os.path.exists(src):
        print('missing', key); continue
    im = Image.open(src).convert('RGB')
    width = 1600 if m.get('desk') else 780
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    d = os.path.join(OUT, 'shots', v); os.makedirs(d, exist_ok=True)
    dst = os.path.join(d, sid + '.webp')
    im.save(dst, 'WEBP', quality=82, method=6)
    total += os.path.getsize(dst)
    pts = []
    for x in m['marks']:
        b = x.get('box')
        pts.append([round((b[0] + b[2]) / 2 * 100, 1), round((b[1] + min(b[3], b[1] + .22)) / 2 * 100, 1)] if b else None)
    compact[key] = {'d': bool(m.get('desk')), 'm': pts}

for f in ['Amiri-400-latin', 'Amiri-400-latin-ext', 'Amiri-400-arabic', 'Amiri-700-latin', 'Amiri-700-latin-ext', 'Amiri-700-arabic', 'AmiriQuran-400-arabic', 'Quicksand-400-700-latin', 'Quicksand-400-700-latin-ext']:
    shutil.copyfile(os.path.join(ROOT, 'web', 'fonts', f + '.woff2'), os.path.join(FONTS, f + '.woff2'))
shutil.copyfile(os.path.join(ROOT, 'web', 'icon.svg'), os.path.join(OUT, 'shots', 'icon.svg'))
old = os.path.join(OUT, 'img')
if os.path.isdir(old):
    shutil.rmtree(old)   # the first edition's pictures, replaced by shots/

if fresh:
    io.open(KEPT, 'w', encoding='utf8').write(json.dumps(compact, separators=(',', ':')))
page = io.open(os.path.join(OUT, 'guide.src.html'), encoding='utf8').read()
base = io.open(os.path.join(OUT, 'guide-base.css'), encoding='utf8').read()
assert '/*BASE-CSS*/' in page and '/*MARKS*/{}' in page
page = page.replace('/*BASE-CSS*/', base).replace('/*MARKS*/{}', json.dumps(compact, separators=(',', ':')))
io.open(os.path.join(OUT, 'index.html'), 'w', encoding='utf8', newline='\n').write(page)
print('docs/guide/index.html,', len(compact), 'screens,', round(total / 1048576, 1), 'MB of pictures')
