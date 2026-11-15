"""dist/version.json: what the apps' optional update check reads (web/js/core/update.js), uploaded with every release.

    python -I tools/release_meta.py        (after ./build.sh and tools/build_windows.py)

It carries the version (name and code from version.txt), the short notes (release-notes.json, English and Arabic), and for
each platform the stable download link and the SHA-256 of the file in dist/. The apps install a file only if its SHA-256
matches, so this file and the uploaded APK and EXE must come from the same build: run it last, and upload all three together.
It also writes dist/SHA256SUMS.txt for people who check by hand."""
import hashlib, io, json, os, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
REL = 'https://github.com/Bashyr18/miftah-app/releases/latest/download/'


def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


v = dict(l.strip().split('=', 1) for l in open(os.path.join(ROOT, 'version.txt'), encoding='utf8') if '=' in l)
notes = json.load(io.open(os.path.join(ROOT, 'release-notes.json'), encoding='utf8'))
files = {'android': 'Miftah.apk', 'windows': 'Miftah.exe'}
out = {'name': v['name'], 'code': int(v['code']), 'date': datetime.date.today().isoformat(), 'notes': notes}
sums = []
for plat, f in files.items():
    p = os.path.join(DIST, f)
    if not os.path.exists(p):
        raise SystemExit('missing ' + p + ': build both apps first')
    published = 'Miftah.apk' if plat == 'android' else 'Miftah-Windows.exe'
    out[plat] = {'url': REL + published, 'sha256': sha(p), 'size': os.path.getsize(p)}
    vname = 'Miftah-%s.apk' % v['name'] if plat == 'android' else 'Miftah-%s-Windows.exe' % v['name']
    sums += ['%s  %s' % (out[plat]['sha256'], published), '%s  %s' % (out[plat]['sha256'], vname)]
with io.open(os.path.join(DIST, 'version.json'), 'w', encoding='utf8', newline='\n') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)
with io.open(os.path.join(DIST, 'SHA256SUMS.txt'), 'w', encoding='utf8', newline='\n') as fh:
    fh.write('\n'.join(sums) + '\n')
print('dist/version.json: %s (code %s) · android %s… · windows %s…' % (out['name'], out['code'], out['android']['sha256'][:12], out['windows']['sha256'][:12]))
