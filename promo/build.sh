#!/usr/bin/env bash
# The demo film, from code to dist/Miftah-demo.mp4 (portrait 1080 x 1920, 45 seconds):
#   1. promo/prep.py: the sheet page and the measured screen regions (marks.js), from the app's own PDF and guide capture;
#   2. promo/render.js draws every frame of promo/ad.html (30 a second) in headless Edge, and saves its sound cues;
#   3. the sound, no music:
#      - the Madinah takbīr, Allāhu akbar twice (promo/takbir.ogg, from the Adhkār app), kept low at -24 LUFS from 0.5 s;
#      - the film's own small sounds (promo/sfx.py: ticks, taps, soft pops and fills, a pen on paper) at -27 LUFS;
#      - birdsong made in code (promo/birds.py) far beneath, rising a little once the takbīr has finished.
#      The Qurʾān is never mixed with sound effects, so this cut carries the takbīr, not a recitation.
#   4. a lighter copy, dist/Miftah-demo-share.mp4, for messaging apps and LinkedIn (kept under 30 MB).
# Needs: node, python with numpy and PyMuPDF, ffmpeg, Microsoft Edge. Keep work out of build/ (build.sh wipes it).
set -euo pipefail
cd "$(dirname "$0")/.."
WORK="${PROMO_WORK:-promo/.work}"
mkdir -p "$WORK" dist
if [ -z "${SKIP_PREP:-}" ]; then python -I promo/prep.py ${SHEET_PDF:+"$SHEET_PDF"}; fi
ORIGIN="file:///$(cd promo && pwd -W 2>/dev/null || pwd)/ad.html?render"
ORIGIN="${ORIGIN// /%20}"
if [ -z "${SKIP_FRAMES:-}" ]; then
  echo "[1/4] frames"
  CDP_ORIGIN="$ORIGIN" node tools/cdp.js promo/render.js "$WORK"
fi
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/video.mp4")
echo "[2/4] sounds ($DUR s)"
python promo/sfx.py "$WORK/sfx.json" "$WORK/sfx.wav" "$DUR"
BIRDS_UP=22.5 python promo/birds.py "$WORK/birds.wav" "$DUR"
echo "[3/4] sound and picture"
FADE=$(python -c "print(round($DUR - 3, 2))")
ffmpeg -y -loglevel error -i "$WORK/video.mp4" -i promo/takbir.ogg -i "$WORK/sfx.wav" -i "$WORK/birds.wav" -filter_complex \
  "[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,highpass=f=60,loudnorm=I=-24:TP=-6,aresample=48000,adelay=500|500[k];[2:a]loudnorm=I=-27:TP=-8,aresample=48000[s];[3:a]highpass=f=150,loudnorm=I=-36:TP=-9,aresample=48000[b];[k][s][b]amix=inputs=3:normalize=0:duration=longest,afade=t=out:st=$FADE:d=3,alimiter=limit=0.89[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest dist/Miftah-demo.mp4
echo "[4/4] a lighter copy for sharing"
ffmpeg -y -loglevel error -i dist/Miftah-demo.mp4 -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -c:a copy -movflags +faststart dist/Miftah-demo-share.mp4
ls -la dist/Miftah-demo.mp4 dist/Miftah-demo-share.mp4
