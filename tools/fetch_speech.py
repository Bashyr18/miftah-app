"""Real human recordings of the words lessons ask children to hear, from Lingua Libre on Wikimedia Commons (free licences, credited in the app).
Reads tools/src/speech-words.json. Indexes each language's collection once, picks the speaker covering the most words first so voices stay consistent,
and keeps originals in tools/src/speech-raw. Safe to re-run. Run with python -I.
Arabic: titles are usually unvowelled, and a wrong vowel teaches a wrong word. So an unvowelled match is taken only if the word has 4 or more letters and no
shaddah-without-long-vowel verb pattern. Short words need an exact vowelled match, and otherwise stay silent until a parent records them."""
import urllib.error
import json, os, re, sys, time, urllib.parse, urllib.request
from collections import Counter, defaultdict
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src'); RAW = os.path.join(SRC, 'speech-raw'); os.makedirs(RAW, exist_ok=True)
MAP = os.path.join(SRC, 'speech-map.json'); IDX = os.path.join(SRC, 'speech-index.json')
UA = {'User-Agent': 'MiftahEducationalAppBuilder/1.0 (open-licensed assets)'}
API = 'https://commons.wikimedia.org/w/api.php?'
words = json.load(open(os.path.join(SRC, 'speech-words.json'), encoding='utf-8'))
def get(params):
    u = API + urllib.parse.urlencode(dict(params, format='json', maxlag=5))
    for t in range(40):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60) as r: d = json.load(r)
            if 'error' in d: time.sleep(10 + t * 5); continue
            return d
        except Exception: time.sleep(min(120, 8 + t * 8))
    sys.exit('Commons kept refusing: try again later')
index = json.load(open(IDX, encoding='utf-8')) if os.path.exists(IDX) else {}
for lang, cat in (('ar', 'Lingua Libre pronunciation-ara'), ('en', 'Lingua Libre pronunciation-eng')):
    prog = index.get(lang + '_next', '')
    if lang in index and index.get(lang + '_done'): continue
    titles, cont = index.get(lang, []) if prog else [], {'cmcontinue': prog} if prog else {}
    while True:
        d = get(dict({'action': 'query', 'list': 'categorymembers', 'cmtitle': 'Category:' + cat, 'cmtype': 'file', 'cmlimit': 500}, **cont))
        titles += [x['title'] for x in d['query']['categorymembers']]
        print(lang, len(titles), flush=True)
        index[lang] = titles
        if 'continue' not in d: index[lang + '_done'] = True; break
        cont = {'cmcontinue': d['continue']['cmcontinue']}; index[lang + '_next'] = cont['cmcontinue']
        json.dump(index, open(IDX, 'w', encoding='utf-8'), ensure_ascii=False); time.sleep(1)
    json.dump(index, open(IDX, 'w', encoding='utf-8'), ensure_ascii=False)
HAR = re.compile('[ً-ْٰ]')
skel = lambda s: HAR.sub('', s).replace('ٱ', 'ا').replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا').replace('ـ', '')
TITLE = re.compile(r'^File:LL-Q\d+ \(\w+\)-(.+?)-([^-]+)\.(?:wav|ogg|flac)$', re.I)
out = {}
for lang in ('en', 'ar'):
    by = defaultdict(dict)
    for t in index.get(lang, []):
        m = TITLE.match(t)
        if not m: continue
        spk, w = m.group(1), m.group(2).strip()
        if lang == 'en': by[w.lower()].setdefault(spk, t)
        else: by[w].setdefault(spk, t); by['~' + skel(w)].setdefault(spk, t)
    pick = {}
    for w in words[lang]:
        if lang == 'en': c = by.get(w) or by.get(w.replace('’', "'"))
        else:
            c = by.get(w)
            if not c:
                sk = skel(w); shadda = 'ّ' in w; longv = re.search('[اويى]', sk)
                if len(sk) >= 4 and not (shadda and not longv): c = by.get('~' + sk)
        if c: pick[w] = c
    # the speakers who can say the most words go first, so a child hears few different voices
    cover = Counter(s for c in pick.values() for s in c)
    for w, c in pick.items():
        s = max(c, key=lambda x: cover[x]); out[lang + ':' + w] = {'title': c[s], 'speaker': s}
    print(lang, 'words wanted', len(words[lang]), 'found', len(pick), 'top speakers', [x for x in cover.most_common(4)], flush=True)
# licences, in batches
keys = list(out)
for i in range(0, len(keys), 40):
    batch = keys[i:i + 40]
    d = get({'action': 'query', 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'titles': '|'.join(out[k]['title'] for k in batch)})
    pages = {}
    for p in d.get('query', {}).get('pages', {}).values():
        pages[p.get('title', '').replace('_', ' ')] = p
    nm = {n['to']: n['from'] for n in d.get('query', {}).get('normalized', [])}
    for k in batch:
        p = pages.get(out[k]['title'].replace('_', ' ')) or {}
        ii = (p.get('imageinfo') or [{}])[0]; me = ii.get('extmetadata', {})
        out[k].update(url=ii.get('url'), licence=me.get('LicenseShortName', {}).get('value', ''), artist=re.sub('<[^>]+>', '', me.get('Artist', {}).get('value', '')).strip())
    print('licences', i, flush=True); time.sleep(1)
n = 0
for i, k in enumerate(keys):
    v = out[k]
    if not v.get('url') or not re.search('CC|Public', v.get('licence', ''), re.I): v['file'] = None; continue
    f = re.sub(r'[^0-9a-z]', '', k.split(':')[0]) + '_' + str(i) + os.path.splitext(urllib.parse.urlparse(v['url']).path)[1].lower(); dst = os.path.join(RAW, f)
    old = os.path.join(RAW, re.sub(r'[^0-9a-z]', '', k.split(':')[0]) + '_' + str(i) + os.path.splitext(v['url'])[1].lower())
    if old != dst and os.path.exists(old) and not os.path.exists(dst): os.replace(old, dst)
    if not (os.path.exists(dst) and os.path.getsize(dst) > 0):
        ok = False
        for t in range(20):
            try:
                with urllib.request.urlopen(urllib.request.Request(v['url'], headers=UA), timeout=60) as x: data = x.read()
                open(dst, 'wb').write(data); ok = True; time.sleep(25); break
            except urllib.error.HTTPError as e:
                # the source asks us to wait: wait, with room to spare
                wait = int(e.headers.get('Retry-After') or 300) + 60
                print('waiting', wait, e.code, flush=True); time.sleep(wait)
            except Exception: time.sleep(min(300, 30 + t * 30))
        # a word left unfetched is tried again on the next run, and never marked as having no recording
        if not ok: print('gave up for now', k, flush=True); json.dump(out, open(MAP, 'w', encoding='utf-8'), ensure_ascii=False); sys.exit('stopped, resume later')
    v['file'] = f
    if i % 10 == 0: print('files', i, flush=True); json.dump(out, open(MAP, 'w', encoding='utf-8'), ensure_ascii=False)
json.dump(out, open(MAP, 'w', encoding='utf-8'), ensure_ascii=False)
print('done', len(out), 'with files', sum(1 for v in out.values() if v.get('file')), flush=True)
