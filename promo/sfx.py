"""The film's small sounds, made in code from its own cue list (promo/ad.html window.SFX, saved by promo/render.js).

    python promo/sfx.py <sfx.json> <out.wav> <seconds>

Soft, short and dry, so they sit under the takbīr and never draw attention to themselves. No music, no whoosh on a cut:
  tick    a tiny glassy click (a letter landing, a number turning, a digit)
  tap     a soft finger tap on glass (a step, a button)
  key     a keycap going down
  flick   a card sliding past another (very short, airy)
  pop     a card lifting out of a screen: a muted rounded pop
  settle  something coming to rest: a low, soft thump
  air     a gentle rising fill of filtered air, for a reveal (its length is the cue's)
  pen     a pen writing on paper (its length is the cue's)
  mark    a quick red-pen flick
  stamp   a rubber stamp meeting paper
Each is placed with a little stereo spread and a short room, then the whole bed is kept low (build.sh sets its loudness)."""
import json, sys, wave
import numpy as np

SR = 48000
cues = json.load(open(sys.argv[1], encoding='utf8'))
DUR = float(sys.argv[3])
N = int(SR * DUR)
Lb, Rb = np.zeros(N), np.zeros(N)
rng = np.random.default_rng(7)


def env(n, a, r, curve=2.0):
    e = np.ones(n); ai, ri = max(1, int(a * SR)), max(1, int(r * SR))
    e[:ai] = np.linspace(0, 1, ai); e[-ri:] *= np.linspace(1, 0, ri) ** curve
    return e


def lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode='same') if k > 1 else x


def hp(x, k):
    return x - lp(x, k)


def sine(f, dur, f2=None):
    n = int(dur * SR); t = np.arange(n) / SR
    ff = f if f2 is None else np.linspace(f, f2, n)
    return np.sin(2 * np.pi * np.cumsum(np.full(n, ff) if np.isscalar(ff) else ff) / SR)


def tick():
    n = int(.03 * SR); s = sine(3400, .03) * np.exp(-np.arange(n) / (SR * .004)) * .5 + hp(rng.standard_normal(n), 6) * np.exp(-np.arange(n) / (SR * .0015)) * .35
    return s * .55


def tap():
    n = int(.07 * SR); s = sine(900, .07, 520) * np.exp(-np.arange(n) / (SR * .012)) + lp(rng.standard_normal(n), 3) * np.exp(-np.arange(n) / (SR * .004)) * .5
    return s * .6


def key():
    n = int(.09 * SR); s = lp(rng.standard_normal(n), 4) * np.exp(-np.arange(n) / (SR * .006)) + sine(260, .09, 180) * np.exp(-np.arange(n) / (SR * .02)) * .7
    return s * .55


def flick():
    n = int(.12 * SR); s = hp(rng.standard_normal(n), 12) * env(n, .03, .08) * .35
    return s


def pop():
    n = int(.16 * SR); s = sine(420, .16, 180) * env(n, .004, .14, 3) + lp(rng.standard_normal(n), 10) * env(n, .002, .05) * .3
    return s * .7


def settle():
    n = int(.28 * SR); s = sine(95, .28, 60) * env(n, .006, .26, 2.5) + lp(rng.standard_normal(n), 40) * env(n, .003, .1) * .4
    return s * .9


def air(dur):
    n = int(max(.4, dur) * SR); x = rng.standard_normal(n)
    a = lp(hp(x, 4), 18); b = lp(hp(x, 2), 6)
    k = np.linspace(0, 1, n)
    s = a * (1 - k) + b * k       # opens up as it rises: dark to a little brighter
    return s * env(n, dur * .55, dur * .4, 1.6) * .32


def pen(dur):
    n = int(max(.08, dur) * SR); x = hp(rng.standard_normal(n), 3)
    grain = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * np.cumsum(np.full(n, 14.0) + rng.normal(0, 4, n)) / SR))
    return lp(x, 2) * grain * env(n, .01, .03) * .22


def mark():
    n = int(.11 * SR); return hp(rng.standard_normal(n), 3) * env(n, .004, .08) * .3 + sine(1800, .11, 900) * env(n, .002, .06) * .08


def stamp():
    n = int(.22 * SR); return lp(rng.standard_normal(n), 30) * env(n, .002, .18, 3) * .9 + sine(140, .22, 90) * env(n, .003, .2, 3) * .6


MAKE = {'tick': tick, 'tap': tap, 'key': key, 'flick': flick, 'pop': pop, 'settle': settle, 'mark': mark, 'stamp': stamp}
for i, c in enumerate(cues):
    at, kind, ln = float(c[0]), c[1], float(c[2] or 0)
    s = air(ln) if kind == 'air' else pen(ln) if kind == 'pen' else MAKE[kind]() if kind in MAKE else None
    if s is None: continue
    a = int(at * SR)
    if a >= N: continue
    s = s[: N - a]
    pan = .5 + .18 * np.sin(i * 1.7)          # a little left, a little right
    Lb[a:a + len(s)] += s * np.sqrt(1 - pan); Rb[a:a + len(s)] += s * np.sqrt(pan)

# a short, soft room so nothing sounds pasted on
ir = rng.standard_normal(int(.35 * SR)) * np.exp(-np.arange(int(.35 * SR)) / (SR * .07)); ir = lp(ir, 8); ir[: int(.008 * SR)] = 0; ir /= np.sqrt((ir ** 2).sum())
def conv(x):
    m = len(x) + len(ir) - 1; size = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
Lb, Rb = Lb * .8 + conv(Lb) * .25, Rb * .8 + conv(Rb) * .25
pk = max(np.abs(Lb).max(), np.abs(Rb).max(), 1e-9)
pcm = (np.stack([Lb, Rb], 1) / pk * .7 * 32767).astype('<i2')
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx: %d cues, %.1f s -> %s' % (len(cues), DUR, sys.argv[2]))
