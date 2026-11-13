"""Generates web/js/data/gen.js, the app's only source of religious text. Nothing here is retyped:
  Q     al-Fātiḥah and Juzʾ ʿAmma: Tanzil Uthmani 1.1 (unaltered) + The Clear Quran (footnote marks removed, em dashes to commas)
  HAD   hadith: fawazahmed0/hadith-api, sliced between markers; the English editions are the sunnah.com translations
  DUA   a child's duʿāʾ: hisnmuslim.com Arabic and recording, sunnah.com transliteration and translation
  SAY   the words of the ṣalāh: verbatim from Adhkār's verified data
Each deviation is listed in FIX. Run: python tools/build_content.py"""
import io, json, os, re, sys
sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.abspath(__file__))
TXT = os.path.join(ROOT, 'sources')   # text sources, tracked in the repo
SRC = os.path.join(ROOT, 'src')       # raw audio originals, kept locally (too large for the repo)
OUT = os.path.join(ROOT, '..', 'web', 'js', 'data', 'gen.js')

# ------------- Qurʾān -------------
NAMES = {1: 'Al-Fātiḥah', 78: 'An-Nabaʾ', 79: 'An-Nāziʿāt', 80: 'ʿAbasa', 81: 'At-Takwīr', 82: 'Al-Infiṭār', 83: 'Al-Muṭaffifīn', 84: 'Al-Inshiqāq', 85: 'Al-Burūj', 86: 'Aṭ-Ṭāriq', 87: 'Al-Aʿlā', 88: 'Al-Ghāshiyah', 89: 'Al-Fajr', 90: 'Al-Balad', 91: 'Ash-Shams', 92: 'Al-Layl', 93: 'Aḍ-Ḍuḥā', 94: 'Ash-Sharḥ', 95: 'At-Tīn', 96: 'Al-ʿAlaq', 97: 'Al-Qadr', 98: 'Al-Bayyinah', 99: 'Az-Zalzalah', 100: 'Al-ʿĀdiyāt', 101: 'Al-Qāriʿah', 102: 'At-Takāthur', 103: 'Al-ʿAṣr', 104: 'Al-Humazah', 105: 'Al-Fīl', 106: 'Quraysh', 107: 'Al-Māʿūn', 108: 'Al-Kawthar', 109: 'Al-Kāfirūn', 110: 'An-Naṣr', 111: 'Al-Masad', 112: 'Al-Ikhlāṣ', 113: 'Al-Falaq', 114: 'An-Nās'}
# the order a child traditionally memorises: al-Fātiḥah, then from the end of the Muṣḥaf
HIFZ_ORDER = [1, 114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78]
xml = io.open(os.path.join(TXT, 'tanzil-uthmani.xml'), encoding='utf-8').read()
cq = json.load(io.open(os.path.join(TXT, 'clearquran.json'), encoding='utf-8'))
cq = {s['number']: s for s in cq['surahs']}
adh_t = io.open(os.path.join(TXT, 'adhkar-data.js'), encoding='utf-8').read()
ADH = json.loads(adh_t[adh_t.index('{'):adh_t.rindex('}') + 1])['items']
# the Bismillāh's text is the first āyah of al-Fātiḥah in the same edition
BSM_RE = re.compile(r'<aya index="1" text="([^"]*)" bismillah="([^"]*)"')


def en_clean(t):
    t = re.sub(r'\s*\[\d+\]', '', t)            # the PDF's footnote markers
    t = t.replace(' — ', ', ').replace('—', ', ')   # house rule, as in Adhkār's quran-extra
    return re.sub(r'\s+', ' ', t).strip()


Q = {}
BSM = None
for m in re.finditer(r'<sura index="(\d+)" name="([^"]*)"[^>]*>(.*?)</sura>', xml, re.S):
    n = int(m.group(1))
    b = BSM_RE.search(m.group(3))
    if b and not BSM: BSM = b.group(2)
    if n not in NAMES: continue
    ayat = re.findall(r'<aya index="(\d+)" text="([^"]*)"', m.group(3))
    trans = cq[n]['ayahs']
    assert len(trans) == len(ayat), n
    Q[n] = {'n': n, 'name': NAMES[n], 'ar': m.group(2), 'en': cq[n]['title'], 'v': [[int(a), t, en_clean(trans[i]['text'])] for i, (a, t) in enumerate(ayat)]}
# transliteration only where a verified one exists (Adhkār)
for key, n in (('ikhlas', 112), ('falaq', 113), ('nas', 114)):
    if key in ADH and ADH[key].get('tr'):
        lines = [re.sub(r'^\(\d+\)\s*', '', l).strip() for l in ADH[key]['tr'].split('\n') if l.strip()]
        lines = [l for l in lines if not l.startswith('Bismill')]
        if len(lines) == len(Q[n]['v']): Q[n]['tr'] = lines

# ------------- hadith -------------
HS = os.path.join(TXT, 'hadith')
eng_m = json.load(io.open(os.path.join(HS, 'eng-muslim-full.json'), encoding='utf-8'))['hadiths']
ara_m = json.load(io.open(os.path.join(HS, 'ara-muslim-full.json'), encoding='utf-8'))['hadiths']
SPEC = {
    'bukhari:1': (('إِنَّمَا الْأَعْمَالُ', 'مَا نَوَى', '+'), ('The reward of deeds', 'has intended', '+')),
    'bukhari:8': ('q1', ('Islam is based on', None)),
    'bukhari:12': (('تُطْعِمُ الطَّعَامَ', 'لَمْ تَعْرِفْ'), ('To feed (the poor)', 'do not Know')),
    'bukhari:13': ('q1', ('None of you will have faith', None)),
    'bukhari:159': (('رَأَى عُثْمَانَ', 'إِلَى الْكَعْبَيْنِ'), ("I saw 'Uthman", 'ankles thrice')),
    'bukhari:631': (('صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي', 'أُصَلِّي'), ('Pray as you have seen me praying', 'praying')),
    'bukhari:652': (('بَيْنَمَا رَجُلٌ', 'فَغَفَرَ لَهُ'), ('While a man was going on a way', 'forgave him for that')),
    'bukhari:2363': (('بَيْنَا رَجُلٌ', 'فَغَفَرَ لَهُ'), ('While a man was walking', 'forgave him')),
    'bukhari:2989': (('وَالْكَلِمَةُ الطَّيِّبَةُ', 'صَدَقَةٌ', '+'), ('(saying) a good word', 'also Sadaqa', '+')),
    'bukhari:5027': ('q1', ('The best among you', None)),
    'bukhari:5376': ('q1', ('O boy!', 'nearer to you')),
    'bukhari:5971': (('جَاءَ رَجُلٌ', 'ثُمَّ أَبُوكَ'), ('A man came', 'Your father')),
    'bukhari:5997': ('q1', ('Whoever is not merciful', None)),
    'bukhari:6018': ('q1', ('Anybody who believes', 'keep quiet')),
    'bukhari:6035': ('q1', ('The best among you', 'best in character')),
    'bukhari:6094': (('إِنَّ الصِّدْقَ', 'صِدِّيقًا', '+'), ('Truthfulness leads', 'a truthful person', '+')),
    'bukhari:6116': (('أَنَّ رَجُلاً', 'لاَ تَغْضَبْ'), ('A man said', 'angry and furious')),
    'bukhari:6224': ('q1', ('If anyone of you sneezes', None)),
    'bukhari:6247': (('أَنَّهُ مَرَّ عَلَى صِبْيَانٍ', 'يَفْعَلُهُ'), ('that he passed by', None)),
    'bukhari:6406': ('q1', ('There are two expressions', None)),
    'bukhari:6464': (('وَأَنَّ أَحَبَّ', 'وَإِنْ قَلَّ', '+'), ('the most beloved deed', None, '+')),
    'muslim:8': (('أَنْ تُؤْمِنَ بِاللَّهِ', 'خَيْرِهِ وَشَرِّهِ'), ('That you affirm your faith', 'good and evil')),
    'muslim:54': (('أَوَلاَ أَدُلُّكُمْ', 'بَيْنَكُمْ'), ('Should I not direct you', 'as-salamu alaikum')),
    'muslim:223': (('الطُّهُورُ شَطْرُ', 'الإِيمَانِ', '+'), ('Cleanliness is half of faith', 'faith', '+')),
    'muslim:2594': ('q1', ('Kindness is not', None)),
    'muslim:2626': ('q1', ("Don't consider anything", None)),
    'muslim:2699': (('وَمَنْ سَلَكَ طَرِيقًا', 'الْجَنَّةِ', '+'), ('he who treads the path', 'Paradise for him', '+')),
    'muslim:2734': ('q1', ('Allah is pleased', None)),
    'tirmidhi:1956': (('تَبَسُّمُكَ', 'لَكَ صَدَقَةٌ', '+'), ('Your smiling in the face of your brother is charity', 'is charity', '+')),
}
FIX = {'bukhari:12': [('do not Know', 'do not know')]}   # capital in the source edition
REF = {'bukhari': 'Ṣaḥīḥ al-Bukhārī', 'muslim': 'Ṣaḥīḥ Muslim', 'tirmidhi': 'Jāmiʿ at-Tirmidhī'}
REF_AR = {'bukhari': 'صحيح البخاري', 'muslim': 'صحيح مسلم', 'tirmidhi': 'جامع الترمذي'}
MARK = re.compile('[ً-ْٰـ]')


def load(lang, ref):
    book, n = ref.split(':')
    if book == 'muslim':
        hn = [h for h in eng_m if str(h.get('arabicnumber', '')).split('.')[0] == n][0]['hadithnumber']
        return [h for h in (ara_m if lang == 'ara' else eng_m) if h['hadithnumber'] == hn][0]
    return json.load(io.open(os.path.join(HS, '%s-%s-%s.json' % (lang, book, n)), encoding='utf-8-sig'))['hadiths'][0]


def clean(t): return re.sub(r'\s+', ' ', t.replace('‏', '').replace('‎', '')).strip()


def find(text, pat, start=0):
    if pat in text[start:]:
        i = text.index(pat, start); return i, i + len(pat)
    base, idx = [], []
    for k, ch in enumerate(text):
        if not MARK.match(ch): base.append(ch); idx.append(k)
    p = ''.join(c for c in pat if not MARK.match(c)); b = ''.join(base)
    m = b.find(p, len([k for k in idx if k < start]))
    if m < 0: raise ValueError('marker not found: ' + pat)
    i, j = idx[m], idx[m + len(p) - 1] + 1
    while j < len(text) and MARK.match(text[j]): j += 1
    return i, j


def strip_marks(s):
    s = s.replace('"', '').replace('“', '').replace('”', '')
    s = re.sub(r'\s+', ' ', s).strip().strip("'‘’ :")
    return s.rstrip(' .').strip() + ('' if s.endswith(('?', '!', '…')) else '.')


def take(text, spec):
    more = False
    if spec == 'q1':
        s = [q for q in re.findall(r'"([^"]+)"', text) if len(q.strip()) > 3][0]
    else:
        a, b = spec[0], spec[1]; more = len(spec) > 2
        i, _ = find(text, a)
        if b is None: s = text[i:]
        else: _, j = find(text, b, i); s = text[i:j]
    assert s in text
    out = strip_marks(s)
    return out[:-1] + '…' if more and out.endswith('.') else out + ('…' if more and not out.endswith('…') else '')


HAD = {}
for ref, (sa, se) in SPEC.items():
    a_s, e_s = load('ara', ref), load('eng', ref)
    try: ar, en = take(clean(a_s['text']), sa), take(clean(e_s['text']), se)
    except Exception as e: raise SystemExit('%s: %s | %s | %s' % (ref, e, clean(a_s['text'])[:600], clean(e_s['text'])[:600]))
    for x, y in FIX.get(ref, []):
        assert x in en, ref
        en = en.replace(x, y)
    en = en[0].upper() + en[1:]
    book, num = ref.split(':')
    g = 'Ṣaḥīḥ'
    if book not in ('bukhari', 'muslim'):
        gr = [x['grade'] for x in e_s.get('grades', []) if x['name'] == 'Al-Albani']
        assert gr and gr[0].startswith(('Sahih', 'Hasan')), ref
        g = gr[0].replace('Sahih', 'Ṣaḥīḥ').replace('Hasan', 'Ḥasan') + ' (al-Albānī)'
    HAD[ref] = {'ar': ar, 'en': en, 'g': g, 'ref': '%s %s' % (REF[book], num), 'refa': '%s %s' % (REF_AR[book], num), 'url': 'https://sunnah.com/%s:%s' % (book, num)}

# ------------- a child's duʿāʾ -------------
HK = json.load(io.open(os.path.join(TXT, 'hisn-kid.json'), encoding='utf-8'))
# id: (key, when en, when ar, Arabic spec or None for the whole record, English spec)
DUA_SPEC = [
    (1, 'wake', 'When I wake up', 'عند الاستيقاظ'),
    (5, 'dress', 'When I get dressed', 'عند لبس الثوب'),
    (10, 'toilet-in', 'Before the toilet', 'قبل دخول الخلاء'),
    (11, 'toilet-out', 'After the toilet', 'بعد الخروج من الخلاء'),
    (12, 'wudu-before', 'Before wuḍūʾ', 'قبل الوضوء'),
    (13, 'wudu-after', 'After wuḍūʾ', 'بعد الوضوء'),
    (16, 'out', 'Leaving home', 'عند الخروج من البيت'),
    (18, 'in', 'Coming home', 'عند دخول البيت'),
    (178, 'eat', 'Before I eat', 'قبل الطعام'),
    (180, 'ate', 'After I eat', 'بعد الطعام'),
    (188, 'sneeze', 'When I sneeze', 'عند العطاس'),
    (105, 'sleep', 'Before I sleep', 'قبل النوم'),
    (172, 'rain', 'When it rains', 'عند نزول المطر'),
    (193, 'angry', 'When I am angry', 'عند الغضب'),
]
# the bit a young child actually says, sliced from the record shown; a recording is of the whole record
SAY_SLICE = {178: ('بِسْمِ اللَّهِ', None), 188: ('الْحَمْدُ لِلَّهِ', None)}
ENDS = '[(){}\\[\\]﴿﴾.\\s]+'


def strip_br(t):
    t = re.sub(r'^' + ENDS, '', t); t = re.sub(ENDS + '$', '', t)
    return re.sub(r'\s+', ' ', t).replace('…', '').strip()


DUA = {}
for hid, key, en_w, ar_w in DUA_SPEC:
    r = HK[str(hid)]
    ar = strip_br(r['ar'])
    if hid == 18:   # the record continues with an instruction, kept out of the words said
        ar = ar[:find(ar, 'تَوَكَّلْنَا')[1]]
    if hid == 10:   # the bracketed Bismillāh is an addition reported beside the record; the words said include it
        ar = ar.replace(']', '')
    item = {'id': hid, 'when': [en_w, ar_w], 'ar': ar, 'tr': r['tr'].replace('[', '').replace(']', '').replace(' ,', ',').replace(' :', ':'), 'en': r['en'].replace('[', '').replace(']', '').replace(' ,', ',').replace(' :', ':'), 'ref': 'Ḥiṣn al-Muslim %d' % hid, 'url': 'https://sunnah.com/hisn:%d' % hid}
    if hid in SAY_SLICE:
        item['say'] = SAY_SLICE[hid][0]
        assert item['say'] in ar or find(ar, item['say']), hid
    if hid == 18:
        item['en'] = item['en'][:item['en'].index('then say')].strip().rstrip('.') + '.'
        item['tr'] = item['tr'].strip()
    DUA[key] = item
    assert os.path.exists(os.path.join(ROOT, '..', 'web', 'audio', 'd', '%d.ogg' % hid)), hid   # the recording that ships

# ------------- the words of the ṣalāh, from Adhkār -------------
SAY = {}
for k in ['t-akbar', 'p-ruku', 'p-sami', 'p-sujud', 'p-jalsah', 't-subhan', 't-hamd', 'hawqala', 'subhan']:
    it = ADH[k]
    SAY[k] = {'ar': it['ar'], 'tr': it['tr'], 'en': it['en'], 'ref': it['refs'][0]['l'] if it.get('refs') else ''}
_r = ADH['p-rabbana']; _j = find(_r['ar'], 'الْحَمْدُ')[1]   # the short form, sliced from the same record
SAY['p-rabbana'] = {'ar': _r['ar'][:_j], 'tr': _r['tr'][:_r['tr'].index('lakal-ḥamd') + len('lakal-ḥamd')] + '.', 'en': _r['en'][:_r['en'].index('Yours') + 5] + '.', 'ref': _r['refs'][0]['l']}
tash = ADH['p-tashahhud']; SAY['p-tashahhud'] = {'ar': tash['ar'], 'tr': tash['tr'], 'en': tash['en'], 'ref': tash['refs'][0]['l']}
sal = ADH['a-salawat']; SAY['a-salawat'] = {'ar': sal['ar'], 'tr': sal['tr'], 'en': sal['en'], 'ref': sal['refs'][0]['l']}
_t = clean(json.load(io.open(os.path.join(HS, 'ara-abudawud-996.json'), encoding='utf-8-sig'))['hadiths'][0]['text'])
_q = take(_t, 'q1').rstrip('.'); _j = find(_q, 'وَرَحْمَةُ اللَّهِ')[1]
SAY['taslim'] = {'ar': _q[:_j], 'tr': 'As-salāmu ʿalaykum wa raḥmatullāh.', 'en': 'Peace be upon you, and mercy of Allah.', 'ref': 'Sunan Abī Dāwūd 996'}

out = {'order': HIFZ_ORDER, 'bsm': BSM, 'q': Q}
with io.open(OUT, 'w', encoding='utf-8', newline='\n') as f:
    f.write('/* Generated by tools/build_content.py from verified sources. Never edit by hand. */\n')
    f.write('window.QURAN=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
    f.write('window.HAD=' + json.dumps(HAD, ensure_ascii=False, separators=(',', ':')) + ';\n')
    f.write('window.DUA=' + json.dumps(DUA, ensure_ascii=False, separators=(',', ':')) + ';\n')
    f.write('window.SAY=' + json.dumps(SAY, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('surahs', len(Q), 'ayat', sum(len(v['v']) for v in Q.values()), 'hadith', len(HAD), 'dua', len(DUA), 'say', len(SAY), 'bsm', BSM)
for k, v in HAD.items(): print(k, '|', v['ar'][:90], '|', v['en'][:110], '|', v['g'])
for k, v in DUA.items(): print(k, '|', v['ar'][:80], '|', v['tr'][:50], '|', v['en'][:70])
