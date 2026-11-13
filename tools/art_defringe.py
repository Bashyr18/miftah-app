"""Cleans what a cut-out left behind: patches of the old sky still opaque around the minarets and the dome.
A pixel goes if it looks like sky (blue over green over red, light) and it touches the transparent area,
directly or through other such pixels; the teal tiles and the cream stone are never sky-coloured, so they stay.
Then the new edge is softened by one pixel so it does not look cut with scissors.

    python -I tools/art_defringe.py web/img/art/court-fg-day.webp [--preview out.jpg] [--write]
"""
import sys
import numpy as np
from PIL import Image, ImageFilter


def clean(im, top_frac=0.62):
    a = np.asarray(im.convert('RGBA')).astype(np.int16)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    h, w = al.shape
    lum = (r * 3 + g * 6 + b) / 10
    sky = (b - r >= 10) & (b - g >= 3) & (lum > 140) & (al > 0)
    # clouds the cut-out kept: nearly white with a cool cast
    sky |= (b >= r) & (b >= g - 2) & (lum > 205) & (np.abs(r - g) < 22) & (b - r >= 4) & (al > 0)
    # the soft rim the cut-out left: half see-through and cool, never the warm edge of the stone
    sky |= (al < 250) & (al > 0) & (b >= r) & (lum > 110)
    sky[int(h * top_frac):, :] = False        # only the skyline: below it the scene is all building and garden
    gone = al < 8
    for _ in range(600):
        grow = gone.copy()
        grow[1:, :] |= gone[:-1, :]; grow[:-1, :] |= gone[1:, :]; grow[:, 1:] |= gone[:, :-1]; grow[:, :-1] |= gone[:, 1:]
        new = grow & sky & ~gone
        if not new.any():
            break
        gone |= new
    out = a.copy().astype(np.uint8)
    out[..., 3] = np.where(gone, 0, out[..., 3])
    res = Image.fromarray(out, 'RGBA')
    # a one-pixel feather on the new edge only
    alpha = res.getchannel('A')
    soft = alpha.filter(ImageFilter.GaussianBlur(0.8))
    edge = np.asarray(alpha.filter(ImageFilter.MaxFilter(3))) != np.asarray(alpha.filter(ImageFilter.MinFilter(3)))
    na = np.where(edge & (np.asarray(alpha) > 0), np.minimum(np.asarray(alpha), np.asarray(soft)), np.asarray(alpha)).astype(np.uint8)
    res.putalpha(Image.fromarray(na, 'L'))
    return res, int(gone.sum() - (al < 8).sum())


if __name__ == '__main__':
    src = sys.argv[1]
    im = Image.open(src)
    res, n = clean(im)
    print(src, 'removed', n, 'pixels of leftover sky')
    if '--preview' in sys.argv:
        out = sys.argv[sys.argv.index('--preview') + 1]
        bg = Image.new('RGBA', res.size, (200, 30, 160, 255)); bg.alpha_composite(res)
        bg.convert('RGB').resize((res.width // 2, res.height // 2)).save(out, quality=82)
    if '--write' in sys.argv:
        res.save(src, 'WEBP', quality=90, method=6, exact=True)
        print('written', src)
