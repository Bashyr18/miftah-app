"""Prepares what the image model delivered for the app. Run by tools/art_ingest.py after the manifest check, or alone.
It cuts the sky out of the courtyard renders (so the real sky and moon sit behind them), splits the door at its seam, fills the
keyhole, cleans halos, normalises the room portals, and writes small versions of every object for small uses."""
import colorsys, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'web', 'img', 'art')
INBOX = os.path.join(ROOT, 'art-inbox')


def find(name):
    for d, _, fs in os.walk(INBOX):
        for f in fs:
            n, e = os.path.splitext(f)
            if n.lower() == name and e.lower() in ('.png', '.webp', '.jpg', '.jpeg'): return os.path.join(d, f)
    return None


def save(im, name, q=90, maxside=None):
    os.makedirs(OUT, exist_ok=True)
    if maxside and max(im.size) > maxside: im = im.copy(); im.thumbnail((maxside, maxside), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=q, method=6)


def flood(cand, seed):
    """pixels of cand connected to seed, by a stack: no scipy on this machine"""
    h, w = cand.shape; seen = np.zeros((h, w), bool); st = [tuple(p) for p in np.argwhere(seed & cand)]
    for y, x in st: seen[y, x] = True
    c = cand
    while st:
        y, x = st.pop()
        if y > 0 and c[y - 1, x] and not seen[y - 1, x]: seen[y - 1, x] = True; st.append((y - 1, x))
        if y < h - 1 and c[y + 1, x] and not seen[y + 1, x]: seen[y + 1, x] = True; st.append((y + 1, x))
        if x > 0 and c[y, x - 1] and not seen[y, x - 1]: seen[y, x - 1] = True; st.append((y, x - 1))
        if x < w - 1 and c[y, x + 1] and not seen[y, x + 1]: seen[y, x + 1] = True; st.append((y, x + 1))
    return seen


def soft(mask, grow=0, blur=1.1):
    """mask (True = remove) to an alpha channel with a soft edge, pulled in a little so no halo of the old background survives"""
    m = Image.fromarray((mask * 255).astype('uint8'), 'L')
    if grow: m = m.filter(ImageFilter.MaxFilter(grow * 2 + 1))
    m = m.filter(ImageFilter.GaussianBlur(blur))
    return 255 - np.array(m)


def trim(im, pad=0):
    b = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
    im = im.crop(b)
    return im


def squared(im, frac=.04):
    im = trim(im); s = int(max(im.size) * (1 + frac * 2)); c = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    c.paste(im, ((s - im.width) // 2, (s - im.height) // 2)); return c


def building(xx, yy):
    """the dome and the minaret caps are blue too: they must never be mistaken for sky"""
    dome = ((xx - 768) / 170.) ** 2 + ((yy - 256) / 118.) ** 2 < 1
    capL = ((xx - 442) / 34.) ** 2 + ((yy - 130) / 50.) ** 2 < 1
    capR = ((xx - 1095) / 34.) ** 2 + ((yy - 130) / 50.) ** 2 < 1
    towerL = (np.abs(xx - 442) < 40) & (yy > 120) & (yy < 400)
    towerR = (np.abs(xx - 1095) < 40) & (yy > 120) & (yy < 400)
    return dome | capL | capR | towerL | towerR


# ---------- the courtyard: the sky comes out ----------
def court_day():
    p = find('court-fg-day')
    if not p: return
    im = Image.open(p).convert('RGB'); a = np.array(im).astype(int); R, G, B = a[..., 0], a[..., 1], a[..., 2]; h, w = R.shape
    yy, xx = np.mgrid[0:h, 0:w]
    blue = (B > 165) & (B - R > 22) & (B >= G)
    cloud = (R > 195) & (G > 205) & (B > 205) & (np.abs(R - B) < 34)
    # the dome and caps are teal: greener for their blue than any sky
    cand = (blue | cloud) & (yy < 440) & (~building(xx, yy) | (G < B * .78) | cloud)
    seed = np.zeros((h, w), bool); seed[0:4] = True
    sky = flood(cand, seed)
    # sky seen through the palm fronds: not connected, but unmistakably blue, and nothing else out there is
    palms = (xx < 345) | (xx > 1195)
    sky |= (B > 170) & (B - R > 30) & (yy < 400) & palms
    sky |= (R > 205) & (G > 215) & (B > 220) & (yy < 300) & palms
    al = soft(sky, grow=0, blur=.9)
    rgba = np.dstack([a.astype('uint8'), al])
    # take the blue that spilled onto the edges of what stays
    edge = (al > 8) & (al < 250)
    rgba[..., 2][edge] = np.minimum(rgba[..., 2][edge], ((rgba[..., 0][edge].astype(int) + rgba[..., 1][edge]) // 2 + 6).clip(0, 255))
    save(Image.fromarray(rgba, 'RGBA'), 'court-fg-day', 88)


def court_night():
    p = find('court-fg-night')
    if not p: return
    im = Image.open(p).convert('RGB'); a = np.array(im).astype(int); R, G, B = a[..., 0], a[..., 1], a[..., 2]; h, w = R.shape
    yy, xx = np.mgrid[0:h, 0:w]
    V = a.max(axis=2)
    dark = ((V < 100) | ((yy > 335) & (V < 140))) & (B >= R + 4)
    moon = (xx - 1205) ** 2 + (yy - 82) ** 2 < 64 ** 2
    cand = dark & (yy < 442)
    closed = np.array(Image.fromarray((cand * 255).astype('uint8'), 'L').filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))) > 128
    gold = (R > B + 26) & (V > 90)
    cand = ((closed & ~gold & (yy < 442)) | moon) & (~building(xx, yy) | (G < B * .62))
    seed = np.zeros((h, w), bool); seed[0:3] = True
    sky = flood(cand, seed) | moon
    palms = (xx < 345) | (xx > 1195)
    sky |= (B >= R + 8) & (V < 80) & (yy < 380) & palms
    al = soft(sky, blur=.9)
    # the far mountains melt into the sky rather than meeting it at a hard line
    rgba = np.dstack([a.astype('uint8'), al])
    save(Image.fromarray(rgba, 'RGBA'), 'court-fg-night', 88)


# ---------- the door: a stone frame with a hole, and two leaves ----------
def door():
    p = find('door-pair')
    if not p: return
    im = Image.open(p).convert('RGB'); a = np.array(im).astype(float); w, h = im.size
    mx, mn = a.max(axis=2), a.min(axis=2); sat = (mx - mn) / np.maximum(mx, 1)
    bg = flood((sat < .1) & (mx > 196), np.pad(np.zeros((h - 2, w - 2), bool), 1, constant_values=True))
    al = soft(bg, grow=1, blur=1.0)
    # the opening is measured from this render, in a 1024 x 1536 frame: wood and carved stone are too alike for colour to separate them
    sx, sy = w / 1024., h / 1536.
    def bez(p0, c1, c2, p3, n=60):
        o = []
        for i in range(n + 1):
            t = i / n; u = 1 - t
            o.append(((u ** 3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * p3[0]) * sx, (u ** 3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * p3[1]) * sy))
        return o
    seam = w // 2; y0 = int(181 * sy); y1 = int(1466 * sy); xl = 138 * sx; xr = 887 * sx
    arcL = bez((138, 591), (138, 380), (330, 300), (512, 181)); arcR = bez((887, 591), (887, 380), (694, 300), (512, 181))
    S = 2
    def poly(pts):
        m = Image.new('L', (w * S, h * S), 0); ImageDraw.Draw(m).polygon([(x * S, y * S) for x, y in pts], fill=255)
        return m.resize((w, h), Image.LANCZOS)
    left = arcL + [(seam, y1 + 1), (xl, y1 + 1)]
    right = arcR + [(seam, y1 + 1), (xr, y1 + 1)]
    ml, mr = poly(left), poly(right)
    rgb = np.array(im)
    x0, x1 = int(xl), int(xr) + 1
    box = {'x0': x0 / w, 'x1': x1 / w, 'y0': y0 / h, 'y1': (y1 + 1) / h, 'seam': seam / w}
    save(Image.fromarray(np.dstack([rgb, np.array(ml)]), 'RGBA').crop((x0, y0, seam, y1 + 1)), 'door-left', 88)
    save(Image.fromarray(np.dstack([rgb, np.array(mr)]), 'RGBA').crop((seam, y0, x1, y1 + 1)), 'door-right', 88)
    # the frame keeps a sliver over the edge of the leaves, so no gap ever shows
    hole = np.maximum(np.array(ml), np.array(mr)); hole = np.array(Image.fromarray(hole).filter(ImageFilter.MinFilter(7)))
    save(Image.fromarray(np.dstack([rgb, np.minimum(al, 255 - hole)]), 'RGBA'), 'door-frame', 86)
    return box


# ---------- the lock: its keyhole goes dark ----------
def lock():
    p = find('lock-hero')
    if not p: return
    im = Image.open(p).convert('RGBA'); a = np.array(im); h, w, _ = a.shape
    clear = a[..., 3] < 128
    out = flood(clear, np.pad(np.zeros((h - 2, w - 2), bool), 1, constant_values=True))
    hole = clear & ~out
    hole = np.array(Image.fromarray((hole * 255).astype('uint8'), 'L').filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1)))
    k = (hole / 255.)[..., None]
    a[..., :3] = (a[..., :3] * (1 - k) + np.array([16, 9, 3]) * k).astype('uint8'); a[..., 3] = np.maximum(a[..., 3], hole)
    res = squared(Image.fromarray(a, 'RGBA'), .01)
    save(res, 'lock-hero', 90, 900)


# ---------- objects ----------
def clean_alpha(name, lo=70, hi=210):
    """a soft haze around an object becomes clean edges"""
    p = find(name)
    if not p: return None
    a = np.array(Image.open(p).convert('RGBA')).astype(float)
    a[..., 3] = np.clip((a[..., 3] - lo) / (hi - lo), 0, 1) * 255
    return Image.fromarray(a.astype('uint8'), 'RGBA')


def defringe(im, lo=110, hi=225):
    """a cut-out with a coloured halo: tighten the edge, and take its colour from the solid object just inside it"""
    from PIL import ImageFilter
    a = np.array(im.convert('RGBA')).astype(float)
    al = a[..., 3].copy(); solid = al > 245
    w = solid.astype(float); rgb = a[..., :3] * w[..., None]
    for _ in range(4):  # grow solid colour outward a few pixels
        kw = np.array(Image.fromarray((w * 255).astype('uint8')).filter(ImageFilter.BoxBlur(1))).astype(float) / 255
        kc = np.stack([np.array(Image.fromarray(rgb[..., i].astype('uint8')).filter(ImageFilter.BoxBlur(1))).astype(float) for i in range(3)], -1)
        grown = kw > .02; rgb2 = np.where(grown[..., None], kc / np.maximum(kw[..., None], .02), 0)
        keep = w > .99
        rgb = np.where(keep[..., None], a[..., :3], rgb2); w = np.where(keep, 1., grown.astype(float))
        rgb = rgb * w[..., None]
    out = a.copy(); edge = ~solid & (w > .5)
    out[..., :3][edge] = np.clip(rgb[edge], 0, 255)
    out[..., 3] = np.clip((al - lo) / (hi - lo), 0, 1) * 255
    return Image.fromarray(out.astype('uint8'), 'RGBA')


OBJECTS = ['key-forged', 'key-front', 'date', 'apple', 'leaf', 'palm', 'tree', 'sheep', 'camel', 'rehal', 'moon-disc']


def objects():
    for n in OBJECTS:
        p = find(n)
        if not p: continue
        im = clean_alpha(n) if n == 'apple' else defringe(Image.open(p)) if n == 'rehal' else Image.open(p).convert('RGBA')
        if n == 'key-front': im = trim(im)
        elif n != 'moon-disc': im = squared(im)
        save(im, n, 90, 1024)
        s = im.copy(); s.thumbnail((256, 256), Image.LANCZOS); save(s, n + '-s', 86)


# ---------- the room portals, all to one size, standing on the same line ----------
PORTALS = ['portal-quran', 'portal-arabic', 'portal-deen', 'portal-math', 'portal-english', 'portal-science', 'portal-seerah', 'portal-adab']


def portals():
    W, H = 720, 960
    for n in PORTALS:
        p = find(n)
        if not p and n == 'portal-quran' and find('portal-english'):
            # until its own arrives: the same arch and open book, in the Qur'an room's emerald
            src = Image.open(find('portal-english')).convert('RGBA'); hsv = np.array(src.convert('RGB').convert('HSV')).astype(int)
            purple = (hsv[..., 0] > 165) & (hsv[..., 0] < 225)
            hsv[..., 0][purple] = 104; hsv[..., 1][purple] = (hsv[..., 1][purple] * .86).astype(int)
            rgb = Image.fromarray(hsv.astype('uint8'), 'HSV').convert('RGB'); rgb.putalpha(src.getchannel('A')); im = trim(rgb)
        elif not p: continue
        else: im = trim(Image.open(p).convert('RGBA'))
        k = min(W / im.width, H / im.height); im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        c = Image.new('RGBA', (W, H), (0, 0, 0, 0)); c.paste(im, ((W - im.width) // 2, H - im.height))
        save(c, n, 88)
        s = c.copy(); s.thumbnail((240, 320), Image.LANCZOS); save(s, n + '-s', 86)


# ---------- real places: photographs, cropped so the place is the subject, credited as their licences ask ----------
PHOTO_CROPS = {'place-arafat': (0, 150, 860, 790), 'place-hira': (150, 130, 1280, 960), 'place-thawr-m': (0, 60, 1280, 660), 'place-quba': (0, 0, 1280, 840)}


def photos():
    import json
    src = os.path.join(INBOX, 'photos'); cred = os.path.join(ROOT, 'art-brief', 'photo-credits.json')
    if not (os.path.isdir(src) and os.path.exists(cred)): return
    c = json.load(open(cred, encoding='utf-8'))
    for n in c:
        f = os.path.join(src, n + '.jpg')
        if not os.path.exists(f): continue
        im = Image.open(f).convert('RGB')
        if n in PHOTO_CROPS: im = im.crop(PHOTO_CROPS[n])
        save(im, n, 80, 1100)
    open(os.path.join(ROOT, 'web', 'js', 'data', 'photos.js'), 'w', encoding='utf-8').write('/* Generated by tools/art_prep.py from art-brief/photo-credits.json: real places, with the credit each licence asks for. */\nwindow.PHOTOS=' + json.dumps(c, ensure_ascii=False) + ';\n')


def write_list():
    files = sorted(f[:-5] for f in os.listdir(OUT) if f.endswith('.webp'))
    open(os.path.join(ROOT, 'web', 'js', 'data', 'artlist.js'), 'w', encoding='utf-8').write('/* Generated by tools/art_prep.py: the supplied images the app can use. */\nwindow.ART_FILES=' + __import__('json').dumps(files) + ';\n')
    return files


def main():
    court_day(); court_night()
    b = door(); lock(); objects(); portals(); photos()
    if b: print('door box', b)
    print(len(write_list()), 'files')


if __name__ == '__main__':
    main()
