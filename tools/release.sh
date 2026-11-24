#!/bin/bash
# The Android release, in one step: recordings fetched so far, then the Android APK and Play bundle.
# For Windows, run `python -I tools/build_windows.py` on Windows (or via the GitHub Actions workflow).
# The signing key lives outside the repo (see README, Signing). Nothing here publishes anything.
set -e
cd "$(dirname "$0")/.."
python -I tools/make_speech.py
FINAL=1 ./build.sh
ls -la dist/
