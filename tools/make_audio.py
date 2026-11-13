"""Makes the audio that ships inside the APK.
Originals live in tools/src/audio-full, and are never changed. Shipped: al-Ḥuṣarī's Juzʾ ʿAmma and all adhkār, in Opus (a speech codec far smaller than MP3 at the same clarity).
Everything else (al-ʿAfāsī, word audio, the rest of the Qurʾān) is fetched by the app once, from the same sources these files came from, then kept on the device.
Usage: python tools/make_audio.py"""
import os, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(ROOT, 'web', 'audio')
FULL = os.path.join(ROOT, 'tools', 'src', 'audio-full')
FF = shutil.which('ffmpeg')
if not FF: sys.exit('ffmpeg not found')
RATE = {'h': '40k', 'd': '32k'}

# first run: everything in web/audio that is an MP3 moves to the safe copy
if os.path.isdir(WEB):
    for d in os.listdir(WEB):
        src = os.path.join(WEB, d)
        if not os.path.isdir(src): continue
        os.makedirs(os.path.join(FULL, d), exist_ok=True)
        for f in os.listdir(src):
            if f.endswith('.mp3'): shutil.move(os.path.join(src, f), os.path.join(FULL, d, f))
        if not os.listdir(src): os.rmdir(src)


def one(job):
    d, f = job
    out = os.path.join(WEB, d, f[:-4] + '.ogg')
    if os.path.exists(out) and os.path.getsize(out) > 0: return 0
    tmp = out + '.part.ogg'
    r = subprocess.run([FF, '-y', '-v', 'error', '-i', os.path.join(FULL, d, f), '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', RATE[d], '-ac', '1', '-vbr', 'on', '-application', 'voip', tmp], capture_output=True)
    if r.returncode: print('FAILED', f, r.stderr[:200]); return 1
    os.replace(tmp, out); return 0


jobs = []
for d in RATE:
    os.makedirs(os.path.join(WEB, d), exist_ok=True)
    jobs += [(d, f) for f in sorted(os.listdir(os.path.join(FULL, d))) if f.endswith('.mp3')]
with ThreadPoolExecutor(max_workers=max(2, (os.cpu_count() or 4) - 2)) as ex:
    bad = sum(ex.map(one, jobs))
size = {d: sum(os.path.getsize(os.path.join(WEB, d, f)) for f in os.listdir(os.path.join(WEB, d))) for d in RATE}
print('files', len(jobs), 'failed', bad, {k: round(v / 1e6, 1) for k, v in size.items()}, 'MB')
