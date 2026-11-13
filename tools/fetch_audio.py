"""All recitation, bundled at source quality (user 2026-11-05: size is no object). Juzʾ ʿAmma and al-Fātiḥah:
al-Ḥuṣarī al-Muʿallim (teaching pace, for memorising) and Mishary al-ʿAfāsī (flowing, for listening), both 128 kbps from
everyayah.com, plus each word from audio.qurancdn.com. Files stay byte-identical to the source. Safe to re-run."""
import os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, '..', 'web', 'audio')
XML = open(os.path.join(ROOT, 'sources', 'tanzil-uthmani.xml'), encoding='utf-8').read()
SURAS = {}
for m in re.finditer(r'<sura index="(\d+)"[^>]*>(.*?)</sura>', XML, re.S):
    SURAS[int(m.group(1))] = [t for t in re.findall(r'<aya index="\d+" text="([^"]*)"', m.group(2))]
WANT = [1] + list(range(78, 115))
jobs = []
for s in WANT:
    for a, text in enumerate(SURAS[s], 1):
        n = '%03d%03d.mp3' % (s, a)
        jobs.append(('https://everyayah.com/data/Husary_Muallim_128kbps/' + n, os.path.join(OUT, 'h', n)))
        jobs.append(('https://everyayah.com/data/Alafasy_128kbps/' + n, os.path.join(OUT, 'a', n)))
        for i in range(1, len(text.split()) + 1):
            w = '%03d_%03d_%03d.mp3' % (s, a, i)
            jobs.append(('https://audio.qurancdn.com/wbw/' + w, os.path.join(OUT, 'w', w)))
for d in 'haw': os.makedirs(os.path.join(OUT, d), exist_ok=True)


def get(job):
    url, dst = job
    if os.path.exists(dst) and os.path.getsize(dst) > 0: return 0
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 Miftah-build'})
            with urllib.request.urlopen(req, timeout=40) as r: data = r.read()
            with open(dst + '.part', 'wb') as f: f.write(data)
            os.replace(dst + '.part', dst)
            return 1
        except Exception as e:
            err = str(e)
    print('FAILED', url, err, flush=True)
    return -1


with ThreadPoolExecutor(10) as ex:
    res = list(ex.map(get, jobs))
print('jobs', len(jobs), 'fetched', res.count(1), 'had', res.count(0), 'failed', res.count(-1))
