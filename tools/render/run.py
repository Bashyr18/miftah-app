"""Runs the art factory: serves render.html, opens headless Edge on the discrete GPU, saves what it posts into web/img/art.
Usage: python tools/render/run.py [only=key,date] [scale=0.5]"""
import http.server, os, subprocess, sys, threading, time, urllib.parse, shutil, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'web', 'img', 'art')
os.makedirs(OUT, exist_ok=True)
PORT = 5192
done = threading.Event()


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=HERE, **k)
    def log_message(self, *a): pass
    def do_POST(self):
        n = int(self.headers.get('Content-Length', 0)); body = self.rfile.read(n)
        p = self.path
        if p.startswith('/save/'):
            open(os.path.join(OUT, os.path.basename(p)), 'wb').write(body)
        elif p == '/log': print(body.decode('utf-8', 'replace'), flush=True)
        elif p == '/done': done.set()
        self.send_response(200); self.end_headers(); self.wfile.write(b'ok')


srv = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), H)
threading.Thread(target=srv.serve_forever, daemon=True).start()
if os.environ.get('SERVE_ONLY'):
    print('serving', flush=True)
    while True:
        done.wait(); print('finished', flush=True); done.clear()
q = '&'.join(a for a in sys.argv[1:])
url = 'http://127.0.0.1:%d/render.html?%s' % (PORT, q)
prof = tempfile.mkdtemp()
edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
pr = subprocess.Popen([edge, '--use-angle=gl', '--use-gl=angle', '--ignore-gpu-blocklist', '--enable-gpu', '--force_high_performance_gpu', '--disable-gpu-watchdog', '--disable-gpu-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--no-first-run', '--no-default-browser-check', '--window-position=40,40', '--window-size=900,900', '--app=' + url, '--user-data-dir=' + prof])
ok = done.wait(timeout=int(os.environ.get('RENDER_TIMEOUT', '3000')))
print('finished' if ok else 'TIMEOUT', flush=True)
pr.terminate()
time.sleep(1)
subprocess.run(['taskkill', '/F', '/T', '/PID', str(pr.pid)], capture_output=True)
shutil.rmtree(prof, ignore_errors=True)
