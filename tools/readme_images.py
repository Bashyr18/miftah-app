"""The pictures at the top of the README, composed from the guide's real screenshots (docs/guide/shots).

    python -I tools/readme_images.py

hero.webp      the computer with a phone in front of it
ages.webp      the same home at all five stages
together.webp  the computer showing its code and the phone typing it
Each is drawn on a soft cream ground with a window frame or a phone bezel, so it reads on GitHub's light and dark pages."""
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, 'docs', 'guide', 'shots')
OUT = os.path.join(ROOT, 'docs', 'screens'); os.makedirs(OUT, exist_ok=True)
S = 2   # drawn at twice the size, then reduced, for smooth edges


def shot(v, name):
    return Image.open(os.path.join(SHOTS, v, name + '.webp')).convert('RGB')


def rounded(img, r):
    m = Image.new('L', img.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, img.width - 1, img.height - 1), r, fill=255)
    out = img.convert('RGBA'); out.putalpha(m); return out


def shadow(canvas, box, r, blur, alpha=90, dy=0):
    sh = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((box[0], box[1] + dy, box[2], box[3] + dy), r, fill=(60, 40, 10, alpha))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur)))


def window(img, w, dark=False):
    """a Windows window: the app's own title-bar colour, three caption marks, the real screen"""
    sc = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
    tb = round(w * .028)
    f = Image.new('RGBA', (w, sc.height + tb), (7, 8, 13, 255) if dark else (246, 239, 224, 255))
    f.paste(sc, (0, tb)); d = ImageDraw.Draw(f); c = (232, 225, 210) if dark else (90, 74, 50)
    y = tb // 2; s = max(4, tb // 5)
    for i, x in enumerate((w - tb * 4.2, w - tb * 2.6, w - tb)):
        x = round(x)
        if i == 0: d.line((x - s, y, x + s, y), fill=c, width=max(1, S))
        elif i == 1: d.rectangle((x - s, y - s, x + s, y + s), outline=c, width=max(1, S))
        else: d.line((x - s, y - s, x + s, y + s), fill=c, width=max(1, S)); d.line((x - s, y + s, x + s, y - s), fill=c, width=max(1, S))
    return rounded(f, round(w * .012))


def phone(img, w):
    """a slim bezel round the real screen"""
    sc = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
    b = round(w * .035)
    body = Image.new('RGBA', (w + 2 * b, sc.height + 2 * b), (24, 24, 30, 255))
    body = rounded(body, round(w * .14))
    body.alpha_composite(rounded(sc, round(w * .11)), (b, b))
    return body


def ground(w, h):
    g = Image.new('RGBA', (w, h), (246, 240, 228, 255)); d = ImageDraw.Draw(g)
    for i in range(h):   # a warm wash, lighter at the top
        t = i / h; d.line((0, i, w, i), fill=(round(248 - 10 * t), round(242 - 12 * t), round(232 - 16 * t), 255))
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0)); ImageDraw.Draw(glow).ellipse((w * .15, -h * .4, w * .85, h * .6), fill=(232, 196, 130, 70))
    g.alpha_composite(glow.filter(ImageFilter.GaussianBlur(w * .06)))
    return g


def save(img, name, width):
    img = img.convert('RGB').resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(os.path.join(OUT, name), 'WEBP', quality=86, method=6)
    print('docs/screens/' + name, img.size, os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB')


# the computer, with a phone in front of it
W, H = 1800 * S, 1000 * S
c = ground(W, H)
win = window(shot('light', 'd-home'), 1380 * S)
wx, wy = 90 * S, 70 * S
shadow(c, (wx, wy, wx + win.width, wy + win.height), 24 * S, 40 * S, 80, 24 * S); c.alpha_composite(win, (wx, wy))
ph = phone(shot('light', 'p-home'), 330 * S)
px, py = W - ph.width - 70 * S, H - ph.height - 40 * S
shadow(c, (px, py, px + ph.width, py + ph.height), 50 * S, 36 * S, 110, 20 * S); c.alpha_composite(ph, (px, py))
save(c, 'hero.webp', 1600)

# five stages
W, H = 1800 * S, 860 * S
c = ground(W, H)
gap = 40 * S; pw = (W - 6 * gap) // 5 - 2 * round(.035 * ((W - 6 * gap) // 5))
for i in range(5):
    ph = phone(shot('light', 'p-age%d' % i), pw)
    x = gap + i * (ph.width + gap); y = (H - ph.height) // 2 + (abs(i - 2) * 14 * S)
    shadow(c, (x, y, x + ph.width, y + ph.height), 40 * S, 24 * S, 90, 14 * S); c.alpha_composite(ph, (x, y))
save(c, 'ages.webp', 1600)

# phone and computer, paired
W, H = 1800 * S, 860 * S
c = ground(W, H)
win = window(shot('light', 'd-link'), 1040 * S)
wx, wy = 70 * S, (H - win.height) // 2
shadow(c, (wx, wy, wx + win.width, wy + win.height), 24 * S, 36 * S, 80, 20 * S); c.alpha_composite(win, (wx, wy))
ph = phone(shot('light', 'p-pair'), 330 * S)
px, py = W - ph.width - 80 * S, (H - ph.height) // 2
shadow(c, (px, py, px + ph.width, py + ph.height), 50 * S, 36 * S, 110, 20 * S); c.alpha_composite(ph, (px, py))
d = ImageDraw.Draw(c); cx, cy = (wx + win.width + px) // 2, H // 2
for r, a in ((44, 70), (70, 45), (96, 24)):
    d.ellipse((cx - r * S, cy - r * S, cx + r * S, cy + r * S), outline=(201, 156, 82, a), width=3 * S)
d.ellipse((cx - 22 * S, cy - 22 * S, cx + 22 * S, cy + 22 * S), fill=(217, 178, 111))
save(c, 'together.webp', 1600)


# the guide itself, in a browser window with its real address (from tools/guide-preview.js)
from PIL import ImageFont
PREV = os.path.join(ROOT, 'build', 'preview')


def browser(img, w, url):
    sc = img.crop((0, 0, img.width - 72, img.height)).resize((w, round(img.height * w / (img.width - 72))), Image.LANCZOS)
    bar = round(w * .036)
    f = Image.new('RGBA', (w, sc.height + bar), (236, 230, 218, 255)); f.paste(sc, (0, bar)); d = ImageDraw.Draw(f)
    r = bar // 6
    for i, c in enumerate(((236, 106, 94), (244, 190, 79), (98, 197, 84))):
        cx = bar * .55 + i * bar * .42; d.ellipse((cx - r, bar / 2 - r, cx + r, bar / 2 + r), fill=c)
    px0, px1 = round(w * .3), round(w * .7)
    d.rounded_rectangle((px0, round(bar * .2), px1, round(bar * .8)), round(bar * .3), fill=(250, 247, 240))
    try: font = ImageFont.truetype(os.path.join(os.environ.get('WINDIR', 'C:/Windows'), 'Fonts', 'segoeui.ttf'), round(bar * .36))
    except Exception: font = ImageFont.load_default()
    tw = d.textlength(url, font=font); d.text(((px0 + px1 - tw) / 2, bar * .5), url, fill=(110, 98, 80), font=font, anchor='lm')
    return rounded(f, round(w * .012))


if os.path.exists(os.path.join(PREV, 'guide-cover.jpg')):
    for src, name in (('guide-cover.jpg', 'guide.webp'), ('guide-walk.jpg', 'guide-walk.webp')):
        W, H = 1800 * S, 1180 * S
        c = ground(W, H)
        b = browser(Image.open(os.path.join(PREV, src)).convert('RGB'), 1640 * S, 'bashyr18.github.io/miftah-app/guide')
        x, y = (W - b.width) // 2, (H - b.height) // 2
        shadow(c, (x, y, x + b.width, y + b.height), 24 * S, 40 * S, 80, 22 * S); c.alpha_composite(b, (x, y))
        save(c, name, 1600)
