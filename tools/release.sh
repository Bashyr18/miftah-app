#!/bin/bash
# The full release, in one step: recordings fetched so far, then the Android APK and Play bundle.
# The Windows app is on hold until it is rebuilt as its own thing, so it is not part of a release.
# The signing key lives outside the repo (see README, Signing). Nothing here publishes anything.
set -e
cd "$(dirname "$0")/.."
python -I tools/make_speech.py
FINAL=1 ./build.sh
ls -la dist/
