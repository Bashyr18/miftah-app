"""Handwriting paths for tracing, extracted from real letterforms: each glyph is rendered, thinned to its skeleton, and traced
into ordered strokes. Arabic strokes start from the right and top, Latin from the top and left; body first, dots after.
ORDER overrides fix the few letters where the correct teacher's order differs from the heuristic.
Output: web/js/data/strokes.js and tools/strokes-sheet.png (look at it). Run: python tools/make_strokes.py"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(ROOT, '..', 'web', 'fonts')
AR = 'ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي'.split()
EN = list('abcdefghijklmnopqrstuvwxyz')
NUM = list('0123456789')
ARN = list('٠١٢٣٤٥٦٧٨٩')
S = 320


def render(ch, font, size):
    ft = ImageFont.truetype(font, size)
    im = Image.new('L', (S, S), 0); d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = d.textbbox((0, 0), ch, font=ft)
    d.text(((S - (x1 - x0)) / 2 - x0, (S - (y1 - y0)) / 2 - y0), ch, 255, font=ft)
    return np.array(im) > 110


def thin(a):
    """Zhang-Suen"""
    a = a.copy().astype(np.uint8); a[0, :] = a[-1, :] = 0; a[:, 0] = a[:, -1] = 0
    while True:
        changed = False
        for step in (0, 1):
            p2 = np.roll(a, 1, 0); p3 = np.roll(p2, -1, 1); p4 = np.roll(a, -1, 1); p5 = np.roll(p4, -1, 0)
            p6 = np.roll(a, -1, 0); p7 = np.roll(p6, 1, 1); p8 = np.roll(a, 1, 1); p9 = np.roll(p8, 1, 0)
            n = [p2, p3, p4, p5, p6, p7, p8, p9]
            b = sum(n)
            tr = sum(((n[i] == 0) & (n[(i + 1) % 8] == 1)).astype(np.uint8) for i in range(8))
            if step == 0: c = (p2 * p4 * p6 == 0) & (p4 * p6 * p8 == 0)
            else: c = (p2 * p4 * p8 == 0) & (p2 * p6 * p8 == 0)
            rm = (a == 1) & (b >= 2) & (b <= 6) & (tr == 1) & c
            if rm.any(): a[rm] = 0; changed = True
        if not changed: return a


NB = [(-1, 0), (0, 1), (1, 0), (0, -1), (-1, 1), (1, 1), (1, -1), (-1, -1)]


def neighbours(p, pts):
    return [(p[0] + d[0], p[1] + d[1]) for d in NB if (p[0] + d[0], p[1] + d[1]) in pts]


def components(pts):
    seen = set(); out = []
    for s in pts:
        if s in seen: continue
        st = [s]; seen.add(s); c = set()
        while st:
            p = st.pop(); c.add(p)
            for q in neighbours(p, pts):
                if q not in seen: seen.add(q); st.append(q)
        out.append(c)
    return out


RING = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]


def crossing(p, pts):
    """the crossing number tells a true junction from a staircase in a thinned line"""
    v = [(p[0] + d[0], p[1] + d[1]) in pts for d in RING]
    return sum(1 for i in range(8) if v[i] and not v[(i + 1) % 8])


def edges(pts):
    """split a skeleton component into polylines between junctions and endpoints"""
    cn = {p: crossing(p, pts) for p in pts}
    nodes = {p for p, c in cn.items() if c != 2}
    seen = set(); out = []
    for n in sorted(nodes):
        for q in neighbours(n, pts):
            if q in seen and q not in nodes: continue
            if q in nodes: continue
            path = [n, q]; seen.add(q); prev, cur = n, q
            while True:
                nx = [r for r in neighbours(cur, pts) if r not in seen and r != prev and r not in path]
                ends = [r for r in neighbours(cur, pts) if r in nodes and r != n and r != prev]
                if ends: path.append(ends[0]); break
                if not nx:
                    if n in neighbours(cur, pts) and len(path) > 4: path.append(n)
                    break
                nx.sort(key=lambda r: abs(r[0] - cur[0]) + abs(r[1] - cur[1]))
                prev, cur = cur, nx[0]; seen.add(cur); path.append(cur)
            out.append(path)
    left = [p for p in pts if p not in seen and p not in nodes]
    while left:   # a closed loop with no node
        s0 = left[0]; path = [s0]; seen.add(s0); cur = s0
        while True:
            nx = [r for r in neighbours(cur, pts) if r not in seen]
            if not nx: break
            nx.sort(key=lambda r: abs(r[0] - cur[0]) + abs(r[1] - cur[1]))
            cur = nx[0]; seen.add(cur); path.append(cur)
        if s0 in neighbours(cur, pts): path.append(s0)
        out.append(path)
        left = [p for p in pts if p not in seen and p not in nodes]
    return out


def plen(p): return sum(math.dist(p[i], p[i + 1]) for i in range(len(p) - 1))


def merge(paths, spur):
    """drop spurs, then join edges that continue straight through a junction"""
    ends = {}
    for p in paths:
        ends[p[0]] = ends.get(p[0], 0) + 1; ends[p[-1]] = ends.get(p[-1], 0) + 1
    keep = [p for p in paths if plen(p) >= spur or (ends[p[0]] > 1 and ends[p[-1]] > 1)]
    # cluster junction pixels that touch into one node
    changed = True
    while changed:
        changed = False
        best = None
        for i, a in enumerate(keep):
            for j, b in enumerate(keep):
                if i >= j: continue
                for ra in (0, 1):
                    for rb in (0, 1):
                        A = a[::-1] if ra else a; B = b[::-1] if rb else b
                        if math.dist(A[-1], B[0]) > 3.5: continue
                        if A[0] == A[-1] or B[0] == B[-1]: continue
                        u = np.subtract(A[-1], A[max(0, len(A) - 14)]); v = np.subtract(B[min(len(B) - 1, 13)], B[0])
                        nu, nv = np.linalg.norm(u), np.linalg.norm(v)
                        if nu == 0 or nv == 0: continue
                        c = float(np.dot(u, v) / (nu * nv))
                        if c > .25 and (best is None or c > best[0]): best = (c, i, j, A, B)
        if best:
            _, i, j, A, B = best
            keep = [p for k, p in enumerate(keep) if k not in (i, j)] + [A + B]
            changed = True
    return keep


def rdp(p, eps):
    if len(p) < 3: return p
    a, b = np.array(p[0], float), np.array(p[-1], float)
    ab = b - a; L = np.linalg.norm(ab)
    if L == 0: d = [math.dist(q, p[0]) for q in p]
    else: d = [abs(ab[0] * (q[1] - a[1]) - ab[1] * (q[0] - a[0])) / L for q in p]
    i = int(np.argmax(d))
    if d[i] <= eps: return [p[0], p[-1]]
    return rdp(p[:i + 1], eps)[:-1] + rdp(p[i:], eps)


def smooth(p):
    if len(p) < 5: return p
    closed = p[0] == p[-1]
    q = np.array(p, float); r = q.copy()
    for _ in range(3):
        r[1:-1] = (r[:-2] + 2 * r[1:-1] + r[2:]) / 4
    return [tuple(x) for x in r]


# how a teacher writes it, after looking at the sheet: letter -> (index in the sorted body strokes, reversed) in final order
ORDER = {
    'ج': [(1, True), (0, True)], 'ح': [(1, True), (0, True)], 'خ': [(1, True), (0, True)],
    'ع': [(1, False), (0, True)], 'غ': [(1, False), (0, True)],
    'م': [(1, False), (0, False)], 'و': [(1, False), (0, False)], 'ف': [(1, False), (0, False)], 'ق': [(1, False), (0, False)],
    '6': [(1, False), (0, False)], '2': [(1, False), (0, False)],
}
DOTS = {'ب': 1, 'ت': 2, 'ث': 3, 'ج': 1, 'خ': 1, 'ذ': 1, 'ز': 1, 'ش': 3, 'ض': 1, 'ظ': 1, 'غ': 1, 'ف': 1, 'ق': 2, 'ن': 1, 'ي': 2, 'i': 1, 'j': 1}


def trace(ch, font, size, rtl):
    a = render(ch, font, size)
    sk = thin(a)
    pts = {(int(y), int(x)) for y, x in zip(*np.nonzero(sk))}
    h = np.nonzero(a.any(1))[0]; glyph_h = h[-1] - h[0] + 1
    w = np.nonzero(a.any(0))[0]; glyph_w = w[-1] - w[0] + 1
    want = DOTS.get(ch, 0)
    # the ink itself tells where the dots are: small blobs of the filled glyph, away from the body
    ink = {(int(y), int(x)) for y, x in zip(*np.nonzero(a))}
    blobs = sorted(components(ink), key=len, reverse=True)
    body_ink = blobs[0] if want else ink
    dot_blobs = blobs[1:] if want else []
    if want and ch in 'ش' and len(blobs) > 1: dot_blobs = blobs[1:]
    body_pts = {q for q in pts if q in body_ink} if want else pts
    body = []
    for c in sorted(components(body_pts), key=len, reverse=True):
        if len(c) < 6: continue
        ps = merge(edges(c), spur=max(8, glyph_h * .1))
        ps.sort(key=plen, reverse=True)
        for p in ps:
            s, e = p[0], p[-1]
            if rtl: rev = (e[1] - s[1]) > 6 or (abs(e[1] - s[1]) <= 6 and e[0] < s[0])
            else: rev = (e[0] - s[0]) < -6 or (abs(e[0] - s[0]) <= 6 and e[1] < s[1])
            body.append(p[::-1] if rev else p)
    if not rtl: body.sort(key=lambda p: p[0][1] - p[0][0] * .15)
    fix = ORDER.get(ch)
    if fix: body = [body[i][::-1] if rv else body[i] for i, rv in fix]
    out = [[(float(x), float(y)) for y, x in rdp(smooth(p), 1.1)] for p in body]
    # dots: one tap each, placed from the blobs
    if want:
        ys = [q[0] for b_ in dot_blobs for q in b_]; xs = [q[1] for b_ in dot_blobs for q in b_]
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        d = max(x1 - x0, y1 - y0)
        if want == 1: spots = [(cx, cy)]
        elif want == 2: spots = [(x1 - d * .2, cy), (x0 + d * .2, cy)]
        else: spots = [(x1 - d * .2, y1 - d * .2), (x0 + d * .2, y1 - d * .2), (cx, y0 + d * .18)]
        out += [[p] for p in spots]
    if not out: return [[[50, 50]]]   # the Arabic zero is a single dot
    # fill the box: every letter is traced large
    all_pts = [q for st in out for q in st]
    X = [q[0] for q in all_pts]; Y = [q[1] for q in all_pts]
    k = 72 / max(max(X) - min(X), max(Y) - min(Y), 1)
    mx, my = (max(X) + min(X)) / 2, (max(Y) + min(Y)) / 2
    return [[[round(50 + (x - mx) * k, 1), round(50 + (y - my) * k, 1)] for x, y in st] for st in out]


data = {'ar': {}, 'en': {}, 'num': {}, 'arn': {}}
amiri = os.path.join(F, 'Amiri-700-arabic.woff2')
qs = os.path.join(F, 'Quicksand-400-700-latin.woff2')
for ch in AR: data['ar'][ch] = trace(ch, amiri, 210, True)
for ch in EN: data['en'][ch] = trace(ch, qs, 300, False)
for ch in NUM: data['num'][ch] = trace(ch, qs, 300, False)
for ch in ARN: data['arn'][ch] = trace(ch, amiri, 230, True)
open(os.path.join(ROOT, '..', 'web', 'js', 'data', 'strokes.js'), 'w', encoding='utf-8').write(
    '/* Generated by tools/make_strokes.py */\nwindow.STROKES=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')

# contact sheet
allg = [('ar', c) for c in AR] + [('en', c) for c in EN] + [('num', c) for c in NUM]
C = 150; W = 10
sheet = Image.new('RGB', (W * C, ((len(allg) + W - 1) // W) * C), (14, 16, 26)); d = ImageDraw.Draw(sheet)
cols = [(241, 213, 158), (120, 210, 170), (120, 170, 250), (240, 130, 120), (200, 150, 240), (250, 250, 250)]
lab = ImageFont.truetype(qs, 16)
for i, (k, c) in enumerate(allg):
    ox, oy = (i % W) * C, (i // W) * C
    for si, s in enumerate(data[k][c]):
        pts = [(ox + x * C / 100, oy + y * C / 100) for x, y in s]
        col = cols[si % len(cols)]
        if len(pts) > 1: d.line(pts, fill=col, width=5, joint='curve')
        else: d.ellipse([pts[0][0] - 8, pts[0][1] - 8, pts[0][0] + 8, pts[0][1] + 8], fill=col)
        d.ellipse([pts[0][0] - 5, pts[0][1] - 5, pts[0][0] + 5, pts[0][1] + 5], fill=(255, 60, 60))
        d.text((pts[0][0] + 6, pts[0][1] - 8), str(si + 1), fill=(255, 255, 255), font=lab)
sheet.save(os.path.join(ROOT, 'strokes-sheet.png'))
print('strokes', {k: sum(len(v) for v in d2.values()) for k, d2 in data.items()})
