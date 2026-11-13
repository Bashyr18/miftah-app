"""Contact sheet of rendered art, on checker so alpha is visible. Usage: python tools/render/sheet.py out.jpg [names...] [--cols=8] [--cell=190]"""
import glob, os, sys
from PIL import Image, ImageDraw
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'web', 'img', 'art')
args = [a for a in sys.argv[2:] if not a.startswith('--')]
opt = dict(a[2:].split('=') for a in sys.argv[2:] if a.startswith('--'))
cols = int(opt.get('cols', 8)); cell = int(opt.get('cell', 190))
files = [os.path.join(A, n + '.webp') for n in args] if args else sorted(glob.glob(os.path.join(A, '*.webp')))
rows = (len(files) + cols - 1) // cols
S = Image.new('RGB', (cols * cell, rows * cell), (232, 226, 214))
d = ImageDraw.Draw(S)
for i, f in enumerate(files):
    x, y = (i % cols) * cell, (i // cols) * cell
    if (i // cols + i % cols) % 2: d.rectangle([x, y, x + cell, y + cell], fill=(24, 26, 40))
    if not os.path.exists(f): continue
    im = Image.open(f).convert('RGBA'); im.thumbnail((cell - 6, cell - 6))
    S.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im)
    d.text((x + 4, y + 2), os.path.basename(f)[:-5], fill=(120, 120, 120))
S.save(sys.argv[1], quality=86); print(sys.argv[1], S.size)
