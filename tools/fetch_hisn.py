"""A child's daily duʿāʾ: Arabic and recording ids from hisnmuslim.com, transliteration and translation verbatim from
sunnah.com's Ḥiṣn al-Muslim (the house sources). Saves tools/src/hisn-kid.json and web/audio/d/<id>.mp3. Safe to re-run."""
import html, json, os, re, sys, urllib.request
sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'src', 'hisn-kid.json')
AUD = os.path.join(ROOT, '..', 'web', 'audio', 'd')
os.makedirs(AUD, exist_ok=True)
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'
CHAPTERS = [1, 2, 6, 7, 8, 9, 10, 11, 13, 14, 28, 61, 62, 64, 65, 69, 70, 77, 82]


def get(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=40).read()


def text(m):
    t = re.sub(r'<[^>]+>', '', m) if m else ''
    return re.sub(r'\s+', ' ', html.unescape(t)).strip()


out = json.load(open(OUT, encoding='utf-8')) if os.path.exists(OUT) else {}
for ch in CHAPTERS:
    d = json.loads(get('http://www.hisnmuslim.com/api/ar/%d.json' % ch).decode('utf-8-sig'))
    for title, rows in d.items():
        for r in rows:
            k = str(r['ID'])
            if k not in out:
                h = get('https://sunnah.com/hisn:%s' % k).decode('utf-8')
                g = lambda cls: (re.search(r'<span class="' + cls + r'">(.*?)</span>', h, re.S) or [None, None])[1]
                out[k] = {'ch': ch, 'title': title, 'ar': r['ARABIC_TEXT'], 'audio': r.get('AUDIO'), 'tr': text(g('transliteration')), 'en': text(g('translation')), 'note': text(g('hisn_english_reference'))}
            dst = os.path.join(AUD, k + '.mp3')
            if not os.path.exists(dst):
                try: open(dst, 'wb').write(get('https://www.hisnmuslim.com/audio/ar/%s.mp3' % k))
                except Exception as e: print('no audio', k, e)
json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for k, v in out.items():
    print(k, 'ch', v['ch'], '|', v['title'], '|', v['ar'][:110], '|', v['tr'][:60], '|', v['en'][:80], '|', v['note'][:50], '|', os.path.exists(os.path.join(AUD, k + '.mp3')))
