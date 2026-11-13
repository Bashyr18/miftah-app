"""Fetches the verified raw sources into tools/src (approved by the user 2026-11-05). Safe to re-run: files on disk are kept.
Local sources: the old project (Tanzil Uthmani, The Clear Quran) and Adhkār (hadith, Ḥiṣn al-Muslim, pose art).
Network sources: fawazahmed0/hadith-api, everyayah.com, audio.qurancdn.com, hisnmuslim.com."""
import json, os, re, shutil, sys, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
RAW = os.path.join(SRC, 'audio-raw')
OLD = r'C:\Projects\Arabic'
ADH = r'C:\Projects\Islamic Apps\Adhkar'
os.makedirs(os.path.join(SRC, 'hadith'), exist_ok=True)
os.makedirs(RAW, exist_ok=True)

BOOKS = json.load(open(os.path.join(ROOT, 'hadith_list.json'), encoding='utf-8'))
BUNDLED_SURAHS = {1: 7, 114: 6, 113: 5, 112: 4, 111: 5, 110: 3, 109: 6, 108: 3, 107: 7, 106: 4, 103: 3}


def get(url, dst):
    if os.path.exists(dst) and os.path.getsize(dst) > 0: return False
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 Miftah-build'})
    with urllib.request.urlopen(req, timeout=40) as r: data = r.read()
    with open(dst + '.part', 'wb') as f: f.write(data)
    os.replace(dst + '.part', dst)
    return True


def copy_local():
    for a, b in [(OLD + r'\docs\research\2026-08-26\tanzil-quran-uthmani-v1.1.xml', 'tanzil-uthmani.xml'),
                 (OLD + r'\.local-content\clearquran-mustafa-2022.json', 'clearquran.json'),
                 (ADH + r'\web\js\data.js', 'adhkar-data.js')]:
        shutil.copyfile(a, os.path.join(SRC, b))
    pose = os.path.join(ROOT, '..', 'web', 'img', 'pose')
    if not os.path.isdir(pose): shutil.copytree(ADH + r'\web\img\pose', pose)
    fonts = os.path.join(ROOT, '..', 'web', 'fonts')
    if not os.path.isdir(fonts): shutil.copytree(ADH + r'\web\fonts', fonts)


def hadith():
    n = 0; have = ADH + r'\tools\src\hadith'
    for ref in BOOKS:
        book, num = ref.split(':')
        if book == 'muslim':
            for f in ('ara-muslim-full.json', 'eng-muslim-full.json'):
                dst = os.path.join(SRC, 'hadith', f)
                if not os.path.exists(dst): shutil.copyfile(os.path.join(have, f), dst)
            continue
        for lang in ('ara', 'eng'):
            name = '%s-%s-%s.json' % (lang, book, num); dst = os.path.join(SRC, 'hadith', name)
            if os.path.exists(os.path.join(have, name)):
                if not os.path.exists(dst): shutil.copyfile(os.path.join(have, name), dst)
                continue
            url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/%s-%s/%s.json' % (lang, book, num)
            n += 1 if get(url, dst) else 0
    print('hadith fetched:', n)


def recitation():
    n = 0
    for s, c in BUNDLED_SURAHS.items():
        for a in range(1, c + 1):
            name = '%03d%03d.mp3' % (s, a)
            n += 1 if get('https://everyayah.com/data/Husary_Muallim_128kbps/' + name, os.path.join(RAW, 'q' + name)) else 0
    print('recitation fetched:', n)


def words():
    n = 0
    wl = json.load(open(os.path.join(ROOT, 'word_list.json'), encoding='utf-8'))
    for w in wl:
        s, a, i = w['ref']
        name = '%03d_%03d_%03d.mp3' % (s, a, i)
        n += 1 if get('https://audio.qurancdn.com/wbw/' + name, os.path.join(RAW, 'w' + name)) else 0
    print('words fetched:', n)


def duas():
    n = 0
    for i in json.load(open(os.path.join(ROOT, 'dua_list.json'), encoding='utf-8')):
        if i.get('au'):
            n += 1 if get('https://www.hisnmuslim.com/audio/ar/%s.mp3' % i['au'], os.path.join(RAW, 'd%s.mp3' % i['au'])) else 0
    print('duas fetched:', n)


if __name__ == '__main__':
    steps = sys.argv[1:] or ['local', 'hadith', 'recitation', 'words', 'duas']
    if 'local' in steps: copy_local()
    if 'hadith' in steps: hadith()
    if 'recitation' in steps: recitation()
    if 'words' in steps: words()
    if 'duas' in steps: duas()
