"""Builds dist/Miftah.exe, the Windows app, and dist/Miftah-Setup.exe, its installer, from the Rust programs in windows/.

    python -I tools/build_windows.py            bundles web/ then compiles
    python -I tools/build_windows.py --no-bundle uses build/assets/www as it is (after ./build.sh)

Needs: Windows 10 or 11, Rust (rustup, the stable MSVC toolchain, which brings the Visual Studio Build Tools' linker and the
Windows SDK's resource compiler), Python 3.8+ and Pillow for the icon. Crates come from crates.io (windows/Cargo.lock pins them).
dist/Miftah.exe carries everything: the lessons and the icon (it is also what in-app updates download); WebView2's loader is
linked in, so there are no DLLs beside it. dist/Miftah-Setup.exe carries Miftah.exe and installs it like any Windows program;
it is the file people download."""
import os, shutil, subprocess, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIN = os.path.join(ROOT, 'windows')
OUT = os.path.join(ROOT, 'build', 'windows'); os.makedirs(OUT, exist_ok=True)
WWW = os.path.join(ROOT, 'build', 'assets', 'www')


def version():
    v = dict(l.strip().split('=', 1) for l in open(os.path.join(ROOT, 'version.txt'), encoding='utf8') if '=' in l)
    parts = (v.get('name', '1.0').split('.') + ['0', '0'])[:3]
    return '.'.join(parts) + '.' + v.get('code', '1'), v.get('name', '1.0')


def main():
    if os.name != 'nt':
        sys.exit('The Windows app is built on Windows (WebView2 and the Windows interfaces it uses exist only there).')
    if '--no-bundle' not in sys.argv:
        r = subprocess.run([sys.executable, '-I', os.path.join(ROOT, 'tools', 'bundle.py'), os.path.join(ROOT, 'web'), WWW])
        if r.returncode:
            sys.exit(r.returncode)
    if not os.path.exists(os.path.join(WWW, 'index.html')):
        sys.exit('build/assets/www is missing: run without --no-bundle')

    # the lessons, zipped: media already compressed is stored as it is
    app = os.path.join(OUT, 'app.zip')
    with zipfile.ZipFile(app, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for base, _, files in os.walk(WWW):
            for f in sorted(files):
                full = os.path.join(base, f); rel = os.path.relpath(full, WWW).replace('\\', '/')
                stored = f.lower().endswith(('.ogg', '.mp3', '.webp', '.png', '.jpg', '.woff2', '.m4a', '.mp4'))
                z.write(full, rel, compress_type=zipfile.ZIP_STORED if stored else zipfile.ZIP_DEFLATED)

    full, name = version()
    ico = os.path.join(OUT, 'miftah.ico')
    from PIL import Image
    im = Image.open(os.path.join(WIN, 'icon.png')).convert('RGBA')
    im.save(ico, sizes=[(16, 16), (20, 20), (24, 24), (32, 32), (40, 40), (48, 48), (64, 64), (128, 128), (256, 256)])

    cargo = shutil.which('cargo') or os.path.join(os.path.expanduser('~'), '.cargo', 'bin', 'cargo.exe')
    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    target = os.path.join(WIN, 'target', 'release')

    def build(package, env):
        e = dict(os.environ, MIFTAH_ICON=ico, **env)
        r = subprocess.run([cargo, 'build', '--release', '--locked', '-p', package], cwd=WIN, env=e)
        if r.returncode:
            sys.exit(r.returncode)

    exe = os.path.join(ROOT, 'dist', 'Miftah.exe')
    build('miftah', {'MIFTAH_APP_ZIP': app})
    shutil.copyfile(os.path.join(target, 'Miftah.exe'), exe)
    print('dist/Miftah.exe', name, '(%s)' % full, round(os.path.getsize(exe) / 1048576, 1), 'MB')

    # Miftah-Setup.exe: the installer people download, carrying the app it installs
    setup = os.path.join(ROOT, 'dist', 'Miftah-Setup.exe')
    build('miftah-setup', {'MIFTAH_PAYLOAD': exe})
    shutil.copyfile(os.path.join(target, 'Miftah-Setup.exe'), setup)
    print('dist/Miftah-Setup.exe', name, round(os.path.getsize(setup) / 1048576, 1), 'MB')


if __name__ == '__main__':
    main()
