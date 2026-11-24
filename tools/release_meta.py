"""dist/version.json: what the apps' optional update check reads (web/js/core/update.js), uploaded with every release.

    python -I tools/release_meta.py        (after building both apps with MIFTAH_UPDATE_PUBLIC_KEY)

It carries the version (name and code from version.txt), the short notes (release-notes.json, English and Arabic), and for
each platform the stable download link and the SHA-256 of the file in dist/. The apps install a file only if its SHA-256
matches and the manifest is signed. Set MIFTAH_UPDATE_SIGNING_KEY to the external P-256 PEM key file.
It also writes dist/SHA256SUMS.txt for people who check by hand."""
import base64, hashlib, io, json, os, datetime, zipfile
from pathlib import Path

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
REL = 'https://github.com/Bashyr18/miftah-app/releases/latest/download/'


def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def sign_manifest(out):
    key_path = os.environ.get('MIFTAH_UPDATE_SIGNING_KEY')
    if not key_path:
        raise SystemExit('Set MIFTAH_UPDATE_SIGNING_KEY to the external P-256 PEM key file')
    key = serialization.load_pem_private_key(Path(key_path).read_bytes(), password=None)
    if not isinstance(key, ec.EllipticCurvePrivateKey) or not isinstance(key.curve, ec.SECP256R1):
        raise SystemExit('The update signing key must use P-256 (secp256r1)')
    public = base64.b64encode(key.public_key().public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo))
    with zipfile.ZipFile(os.path.join(DIST, 'Miftah.apk')) as apk:
        try:
            embedded = apk.read('assets/update-public-key.txt').strip()
        except KeyError:
            embedded = b''
    if embedded != public or public not in Path(DIST, 'Miftah.exe').read_bytes():
        raise SystemExit('Build both apps with MIFTAH_UPDATE_PUBLIC_KEY from this signing key')
    payload = json.dumps(out, ensure_ascii=False, separators=(',', ':')).encode('utf8')
    signature = key.sign(payload, ec.ECDSA(hashes.SHA256()))
    key.public_key().verify(signature, payload, ec.ECDSA(hashes.SHA256()))
    envelope = dict(out, payload=base64.b64encode(payload).decode('ascii'), signature=base64.b64encode(signature).decode('ascii'))
    manifest = json.dumps(envelope, ensure_ascii=False, indent=1)
    if len(manifest.encode('utf8')) > 65536:
        raise SystemExit('Signed update manifest exceeds the apps’ 64 KiB limit')
    return manifest


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
# the installer people download: not used by in-app updates (they fetch Miftah-Windows.exe), but listed for checking by hand
setup = os.path.join(DIST, 'Miftah-Setup.exe')
if not os.path.exists(setup):
    raise SystemExit('missing ' + setup + ': run tools/build_windows.py')
sums += ['%s  %s' % (sha(setup), 'Miftah-Setup.exe'), '%s  %s' % (sha(setup), 'Miftah-%s-Setup.exe' % v['name'])]
manifest = sign_manifest(out)
with io.open(os.path.join(DIST, 'version.json'), 'w', encoding='utf8', newline='\n') as fh:
    fh.write(manifest)
with io.open(os.path.join(DIST, 'SHA256SUMS.txt'), 'w', encoding='utf8', newline='\n') as fh:
    fh.write('\n'.join(sums) + '\n')
print('dist/version.json: %s (code %s) · android %s… · windows %s…' % (out['name'], out['code'], out['android']['sha256'][:12], out['windows']['sha256'][:12]))
