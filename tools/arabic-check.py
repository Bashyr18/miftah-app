"""Checks every Arabic string in the app's code for faults that make a word render wrongly: a mark with no letter under it,
two vowels on one letter, a doubled mark, Persian or Urdu letters standing in for Arabic ones, old presentation forms,
and Latin letters glued to Arabic. Run: python -X utf8 -I tools/arabic-check.py"""
import re, glob, os, collections, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'web', 'js')
MARK = 'ً-ْٰ'
VOW = set('ًٌٍَُِ')
issues = collections.defaultdict(list)
STR = re.compile(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"")
for f in sorted(glob.glob(os.path.join(ROOT, '**', '*.js'), recursive=True)):
    rel = os.path.relpath(f, ROOT).replace(os.sep, '/')
    if rel.startswith('data/') and rel not in ('data/i18n.js',):
        continue
    s = open(f, encoding='utf8').read()
    for m in STR.finditer(s):
        t = m.group(1) or m.group(2) or ''
        if not re.search('[؀-ۿ]', t):
            continue
        tag = rel + ':' + str(s.count('\n', 0, m.start()) + 1)
        if re.search('(^|[\\s،.؟!:()«»\\-])[' + MARK + ']', t) and '◌' not in t and 'ـ' not in t:
            issues['mark with no letter'].append((tag, t[:70]))
        for w in re.findall('[؀-ۿ]+', t):
            bad = None
            for i in range(len(w) - 1):
                a, b = w[i], w[i + 1]
                if a in VOW and b in VOW: bad = 'two vowels on one letter'; break
                if a == b and 'ً' <= a <= 'ْ': bad = 'doubled mark'; break
            if bad: issues[bad].append((tag, w))
        if re.search('[یکہھ]', t): issues['Persian/Urdu letter'].append((tag, t[:70]))
        if re.search('[ﭐ-﷿ﹰ-﻿]', t): issues['presentation form'].append((tag, t[:70]))
        if re.search('[ء-ي][A-Za-z]|[A-Za-z][ء-ي]', t): issues['Latin inside Arabic'].append((tag, t[:70]))
n = 0
for k, v in issues.items():
    print('==', k, len(v)); n += len(v)
    for x in v[:15]: print('  ', x)
print('total', n)
sys.exit(1 if n else 0)
