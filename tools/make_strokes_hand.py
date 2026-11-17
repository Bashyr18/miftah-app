"""Hand-traced strokes for the Arabic letters whose thinned skeleton breaks into slivers (the teeth of sīn and shīn,
the head of jīm, ḥā and khā, the loop of ṣād and ḍād). Points are on the centre line of the app's own font (Amiri bold,
rendered at 210 px in a 320 px square, as tools/make_strokes.py renders it), in the order and direction a teacher writes:
from the right and the top, the body in one movement, the dots after, right before left.
Check them against the letter:  python -I tools/strokes_grid.py build/hand.png ج ح خ س ش ص ض"""

JIM = [(109, 92), (118, 79), (150, 77), (185, 76), (208, 80), (195, 90), (160, 96), (130, 110), (112, 132), (104, 160),
       (106, 188), (120, 210), (150, 222), (190, 224), (232, 215)]
SIN = [(245, 98), (244, 124), (238, 140), (228, 140), (222, 124), (221, 106), (218, 128), (212, 140), (198, 141), (184, 132),
       (177, 119), (180, 140), (182, 165), (170, 188), (145, 202), (112, 207), (88, 200), (76, 183), (77, 160), (85, 138)]
SAD = [(160, 140), (185, 128), (215, 108), (245, 98), (266, 104), (270, 118), (255, 134), (225, 146), (190, 152), (165, 150),
       (155, 130), (153, 120), (157, 140), (160, 165), (148, 185), (120, 197), (88, 198), (62, 190), (52, 170), (56, 148), (66, 133)]

AYN = [(155, 76), (140, 66), (124, 66), (110, 78), (104, 94), (118, 104), (140, 106), (162, 98), (182, 88), (170, 100), (148, 114),
       (124, 133), (108, 160), (102, 192), (108, 222), (130, 244), (160, 252), (195, 250), (234, 234)]


def down(p, dy): return [(x, y + dy) for x, y in p]


HAND = {
    'ج': [JIM, [(163, 163)]],
    'ح': [JIM],
    'خ': [down(JIM, 23), [(153, 62)]],
    'ع': [AYN],
    'غ': [down(AYN, 20), [(131, 46)]],
    'س': [SIN],
    'ش': [down(SIN, 32), [(223, 97)], [(201, 100)], [(207, 72)]],
    'ص': [SAD],
    'ض': [down(SAD, 20), [(205, 82)]],
}


def catmull(p, per=6):
    """a smooth curve through the points, so the guide reads as handwriting rather than a polygon"""
    if len(p) < 3: return [tuple(map(float, q)) for q in p]
    q = [p[0]] + list(p) + [p[-1]]; out = []
    for i in range(1, len(q) - 2):
        p0, p1, p2, p3 = q[i - 1], q[i], q[i + 1], q[i + 2]
        for k in range(per):
            t = k / per; t2, t3 = t * t, t * t * t
            out.append(tuple(.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    out.append(tuple(map(float, p[-1])))
    return out
