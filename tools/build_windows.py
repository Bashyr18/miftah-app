"""Builds dist/Miftah.exe, the Windows app, with the C# compiler that ships with Windows (no Visual Studio, no .NET SDK).

    python -I tools/build_windows.py            bundles web/ then compiles
    python -I tools/build_windows.py --no-bundle uses build/assets/www as it is (after ./build.sh)

Needs: Windows 10 or 11 (.NET Framework 4.8, present on every copy), Python 3.8+, Pillow for the icon,
and the WebView2 SDK, fetched once from nuget.org into tools/.bin/webview2 (see WEBVIEW2 below).
dist/Miftah.exe carries everything: the lessons, the WebView2 libraries and the icon (it is also what in-app updates download).
dist/Miftah-Setup.exe carries Miftah.exe and installs it like any Windows program; it is the file people download."""
import io, os, re, shutil, subprocess, sys, urllib.request, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIN = os.path.join(ROOT, 'windows')
OUT = os.path.join(ROOT, 'build', 'windows'); os.makedirs(OUT, exist_ok=True)
WWW = os.path.join(ROOT, 'build', 'assets', 'www')
WEBVIEW2 = '1.0.2903.40'
PKG = os.path.join(ROOT, 'tools', '.bin', 'webview2', 'pkg')


def fetch_webview2():
    if os.path.exists(os.path.join(PKG, 'lib', 'net462', 'Microsoft.Web.WebView2.Core.dll')):
        return
    url = 'https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2/' + WEBVIEW2
    print('fetching WebView2 SDK', WEBVIEW2, 'from nuget.org')
    data = urllib.request.urlopen(url, timeout=120).read()
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        z.extractall(PKG)


def version():
    v = dict(l.strip().split('=', 1) for l in open(os.path.join(ROOT, 'version.txt'), encoding='utf8') if '=' in l)
    parts = (v.get('name', '1.0').split('.') + ['0', '0'])[:3]
    return '.'.join(parts) + '.' + v.get('code', '1'), v.get('name', '1.0')


def main():
    if os.name != 'nt':
        sys.exit('The Windows app is built on Windows (it uses the C# compiler that ships with .NET Framework).')
    if '--no-bundle' not in sys.argv:
        r = subprocess.run([sys.executable, '-I', os.path.join(ROOT, 'tools', 'bundle.py'), os.path.join(ROOT, 'web'), WWW])
        if r.returncode:
            sys.exit(r.returncode)
    if not os.path.exists(os.path.join(WWW, 'index.html')):
        sys.exit('build/assets/www is missing: run without --no-bundle')
    fetch_webview2()

    # the lessons, zipped: media already compressed is stored as it is
    app = os.path.join(OUT, 'app.zip')
    with zipfile.ZipFile(app, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for base, _, files in os.walk(WWW):
            for f in sorted(files):
                full = os.path.join(base, f); rel = os.path.relpath(full, WWW).replace('\\', '/')
                stored = f.lower().endswith(('.ogg', '.mp3', '.webp', '.png', '.jpg', '.woff2', '.m4a', '.mp4'))
                z.write(full, rel, compress_type=zipfile.ZIP_STORED if stored else zipfile.ZIP_DEFLATED)

    full, name = version()
    info = os.path.join(OUT, 'AssemblyInfo.cs')
    with open(info, 'w', encoding='utf8') as f:
        f.write('using System.Reflection;\n'
                '[assembly: AssemblyTitle("Miftah")]\n[assembly: AssemblyProduct("Miftah")]\n'
                '[assembly: AssemblyDescription("An Islamic homeschool for children aged 2 to 18")]\n'
                '[assembly: AssemblyCompany("Miftah, open source")]\n[assembly: AssemblyCopyright("MIT licence")]\n'
                '[assembly: AssemblyVersion("%s")]\n[assembly: AssemblyFileVersion("%s")]\n[assembly: AssemblyInformationalVersion("%s")]\n' % (full, full, name))

    ico = os.path.join(OUT, 'miftah.ico')
    from PIL import Image
    im = Image.open(os.path.join(WIN, 'icon.png')).convert('RGBA')
    im.save(ico, sizes=[(16, 16), (20, 20), (24, 24), (32, 32), (40, 40), (48, 48), (64, 64), (128, 128), (256, 256)])

    fw = os.path.join(os.environ['WINDIR'], 'Microsoft.NET', 'Framework64', 'v4.0.30319')
    csc = os.path.join(fw, 'csc.exe')
    lib = os.path.join(PKG, 'lib', 'net462')
    exe = os.path.join(ROOT, 'dist', 'Miftah.exe'); os.makedirs(os.path.dirname(exe), exist_ok=True)
    wpf = os.path.join(fw, 'WPF')
    args = [csc, '/nologo', '/optimize+', '/target:winexe', '/platform:x64', '/langversion:5', '/codepage:65001', '/utf8output',
            '/out:' + exe, '/win32icon:' + ico,
            '/resource:' + app + ',app.zip',
            '/resource:' + os.path.join(WIN, 'shim.js') + ',shim.js',
            '/resource:' + os.path.join(lib, 'Microsoft.Web.WebView2.Core.dll') + ',Microsoft.Web.WebView2.Core.dll',
            '/resource:' + os.path.join(lib, 'Microsoft.Web.WebView2.WinForms.dll') + ',Microsoft.Web.WebView2.WinForms.dll',
            '/resource:' + os.path.join(PKG, 'runtimes', 'win-x64', 'native', 'WebView2Loader.dll') + ',WebView2Loader.dll',
            '/r:' + os.path.join(lib, 'Microsoft.Web.WebView2.Core.dll'), '/r:' + os.path.join(lib, 'Microsoft.Web.WebView2.WinForms.dll')]
    for r in ('System.dll', 'System.Core.dll', 'System.Drawing.dll', 'System.Windows.Forms.dll', 'System.IO.Compression.dll',
              'System.IO.Compression.FileSystem.dll', 'System.Web.Extensions.dll', 'Microsoft.CSharp.dll'):
        args.append('/r:' + os.path.join(fw, r))
    args.append(info)
    args += [os.path.join(WIN, 'src', f) for f in sorted(os.listdir(os.path.join(WIN, 'src'))) if f.endswith('.cs')]
    args.append(os.path.join(WIN, 'shared', 'Installer.cs'))
    r = subprocess.run(args, capture_output=True, text=True, encoding='utf8', errors='replace')
    out = (r.stdout + r.stderr).strip()
    if out:
        print(out[-6000:])
    if r.returncode:
        sys.exit(r.returncode)
    print('dist/Miftah.exe', name, '(%s)' % full, round(os.path.getsize(exe) / 1048576, 1), 'MB')

    # Miftah-Setup.exe: the installer people download, carrying the app it installs
    setup = os.path.join(ROOT, 'dist', 'Miftah-Setup.exe')
    sargs = [csc, '/nologo', '/optimize+', '/target:winexe', '/platform:x64', '/langversion:5', '/codepage:65001', '/utf8output',
             '/out:' + setup, '/win32icon:' + ico, '/win32manifest:' + os.path.join(WIN, 'setup', 'setup.manifest'),
             '/resource:' + exe + ',Miftah.exe', '/resource:' + os.path.join(WIN, 'icon.png') + ',icon.png']
    for r in ('System.dll', 'System.Core.dll', 'System.Drawing.dll', 'System.Windows.Forms.dll'):
        sargs.append('/r:' + os.path.join(fw, r))
    sinfo = os.path.join(OUT, 'SetupInfo.cs')
    with open(sinfo, 'w', encoding='utf8') as f:
        f.write(open(info, encoding='utf8').read().replace('AssemblyTitle("Miftah")', 'AssemblyTitle("Miftah Setup")')
                .replace('An Islamic homeschool for children aged 2 to 18', 'Installs Miftah, an Islamic homeschool for children aged 2 to 18'))
    sargs += [sinfo, os.path.join(WIN, 'setup', 'Setup.cs'), os.path.join(WIN, 'shared', 'Installer.cs')]
    r = subprocess.run(sargs, capture_output=True, text=True, encoding='utf8', errors='replace')
    out = (r.stdout + r.stderr).strip()
    if out:
        print(out[-6000:])
    if r.returncode:
        sys.exit(r.returncode)
    print('dist/Miftah-Setup.exe', name, round(os.path.getsize(setup) / 1048576, 1), 'MB')


if __name__ == '__main__':
    main()
