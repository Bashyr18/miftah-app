"""Checks a delivery from the image agent against art-brief/manifest.json and converts what passes into web/img/art/<name>.webp.
Reports missing, wrong-aspect, too-small and no-transparency files, and removes a flat chroma background where alpha was not possible.
Usage: python tools/art_ingest.py [folder or zip, default art-inbox] [--check]   (--check reports without writing)"""
import json, os, sys, tempfile, zipfile
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'web', 'img', 'art')
man = json.load(open(os.path.join(ROOT, 'art-brief', 'manifest.json'), encoding='utf-8'))['items']
args = [a for a in sys.argv[1:] if not a.startswith('--')]; check = '--check' in sys.argv
inbox = args[0] if args else os.path.join(ROOT, 'art-inbox')
roots = [inbox]
tmp = tempfile.mkdtemp()
def unzip(z):
    d = os.path.join(tmp, str(len(roots))); zipfile.ZipFile(z).extractall(d); roots.append(d)
if os.path.isfile(inbox): unzip(inbox)
else:
    for d, _, fs in os.walk(inbox):
        for f in fs:
            if f.lower().endswith('.zip'): unzip(os.path.join(d, f))
found = {}
for d, _, fs in [w for r in roots if os.path.isdir(r) for w in os.walk(r)]:
    for f in fs:
        n, e = os.path.splitext(f)
        if e.lower() in ('.png', '.webp', '.jpg', '.jpeg'): found[n.lower()] = os.path.join(d, f)


def chroma(rgba):
    """a flat magenta or green background becomes alpha, with the colour spill taken off the edge"""
    a = np.array(rgba).astype(float)
    corners = np.array([a[2, 2, :3], a[2, -3, :3], a[-3, 2, :3], a[-3, -3, :3]])
    key = np.median(corners, axis=0)
    mag = np.linalg.norm(key - [255, 0, 255]) < 70; grn = np.linalg.norm(key - [0, 255, 0]) < 70
    if not (mag or grn): return None
    dist = np.linalg.norm(a[:, :, :3] - key, axis=2)
    alpha = np.clip((dist - 40) / 90, 0, 1)
    if mag: a[:, :, 0] = np.minimum(a[:, :, 0], np.maximum(a[:, :, 1] * 1.25 + 30, a[:, :, 0] * alpha)); a[:, :, 2] = np.minimum(a[:, :, 2], np.maximum(a[:, :, 1] * 1.25 + 30, a[:, :, 2] * alpha))
    else: a[:, :, 1] = np.minimum(a[:, :, 1], np.maximum((a[:, :, 0] + a[:, :, 2]) / 2 + 20, a[:, :, 1] * alpha))
    a[:, :, 3] = alpha * 255
    return Image.fromarray(a.astype('uint8'), 'RGBA')


sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import art_prep
PREPPED = set(art_prep.OBJECTS) | {'court-fg-day', 'court-fg-night', 'door-pair', 'lock-hero'}
# the seerah now uses real photographs of the real places, so these are no longer wanted
man = [i for i in man if i['name'] not in ('s02-makkah-dawn', 's06-hira', 's12-road', 's13-masjid-madinah')]
ok, bad, missing, fitted = [], [], [], []
for it in man:
    n = it['name']; p = found.get(n)
    if not p: missing.append(n); continue
    if n in PREPPED: ok.append(n); continue
    im = Image.open(p).convert('RGBA'); w, h = im.size; why = []
    if max(w, h) < 1024 and max(it['width'], it['height']) >= 1024: why.append('too small %dx%d, wanted %dx%d' % (w, h, it['width'], it['height']))
    A = np.array(im)[:, :, 3]
    if it['background'] == 'alpha':
        if A.min() > 250:
            c = chroma(im)
            if c is None: why.append('no transparency and no flat chroma background')
            else: im = c; A = np.array(im)[:, :, 3]
        edge = np.concatenate([A[0], A[-1], A[:, 0], A[:, -1]])
        if it['name'] not in ('court-fg-day', 'court-fg-dawn', 'court-fg-gold', 'court-fg-dusk', 'court-fg-night') and it['style'] == 'O' and (edge > 40).mean() > .002: why.append('object touches the canvas edge (cropped or no margin)')
    else:
        if A.min() < 250: why.append('should be opaque but has transparency')
    if why: bad.append((n, '; '.join(why))); continue
    ok.append(n)
    want = it['width'] / it['height']
    if abs(w / h - want) > .02:   # a near miss on size: crop opaque images from the centre, pad transparent ones
        fitted.append('%s %dx%d' % (n, w, h))
        if it['background'] == 'opaque':
            if w / h > want: nw = round(h * want); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
            else: nh = round(w / want); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        else:
            nw, nh = (round(h * want), h) if w / h < want else (w, round(w / want))
            c = Image.new('RGBA', (nw, nh), (0, 0, 0, 0)); c.paste(im, ((nw - w) // 2, (nh - h) // 2)); im = c
    if not check:
        os.makedirs(OUT, exist_ok=True)
        if max(im.size) > 2048: im.thumbnail((2048, 2048), Image.LANCZOS)
        im.save(os.path.join(OUT, n + '.webp'), 'WEBP', quality=92, method=6)

if not check:
    art_prep.main()
extra = sorted(x for x in set(found) - {i['name'] for i in man} if not x.startswith('portal-') and x != 'dates-cluster')
print('accepted %d of %d' % (len(ok), len(man)))
if fitted: print('\nCROPPED OR PADDED TO FIT %d (check these): %s' % (len(fitted), ', '.join(fitted)))
if bad:
    print('\nREJECTED %d:' % len(bad))
    for n, w in bad: print('  %s: %s' % (n, w))
if missing:
    print('\nMISSING %d:' % len(missing)); print('  ' + ', '.join(missing))
if extra:
    print('\nNOT IN THE BRIEF %d:' % len(extra)); print('  ' + ', '.join(extra))
sys.exit(1 if bad or missing else 0)
