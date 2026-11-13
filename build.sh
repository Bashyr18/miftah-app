#!/usr/bin/env bash
# Gradle-free release build: content → checks → web bundle → aapt2 → javac → d8 → zipalign → apksigner.
#
#   ./build.sh            APK only, for iterating
#   FINAL=1 ./build.sh    also the one-file HTML and the Play bundle (needs tools/.bin/bundletool.jar)
#
# Needs: Node 20+ (run `npm ci` once), Python 3, a JDK 17, and the Android SDK with build-tools 36.0.0 and platform android-36.
# The signing key never lives in this repository. Point the build at it with environment variables:
#   MIFTAH_KEYS      folder holding <alias>-release.jks and keystore.properties   (default: ~/.keys/miftah)
#   MIFTAH_KS_PASS   the keystore password, if you would rather not keep keystore.properties
# See README.md, "Signing".
set -euo pipefail
export PYTHONUTF8=1
cd "$(dirname "$0")"
ROOT="$PWD"

# ---- the app ----
APP="${APP:-Miftah}"          # dist/<APP>.apk, .aab, .html
ALIAS="${ALIAS:-miftah}"      # key alias, and the keystore file name
VCODE="$(sed -n 's/^code=//p' version.txt)"; VNAME="$(sed -n 's/^name=//p' version.txt)"   # one source of truth

# ---- tools, on Windows, macOS or Linux ----
PY=""; for c in python3 python py; do if command -v "$c" >/dev/null 2>&1 && "$c" -c "import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)" >/dev/null 2>&1; then PY="$c"; break; fi; done   # skips the Windows Store stub
[ -n "$PY" ] || { echo "Python 3.8+ is needed"; exit 1; }
[ -x node_modules/.bin/esbuild ] || [ -f node_modules/.bin/esbuild.cmd ] || { echo "Run 'npm ci' once first"; exit 1; }
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [ -z "$SDK" ]; then for d in "${LOCALAPPDATA:-}/Android/Sdk" "$HOME/Library/Android/sdk" "$HOME/Android/Sdk"; do [ -d "$d" ] && SDK="$d" && break; done; fi
[ -d "${SDK:-}" ] || { echo "Set ANDROID_HOME to your Android SDK"; exit 1; }
BT="$SDK/build-tools/${BT_VER:-36.0.0}"
AJ="$SDK/platforms/android-${PLAT:-36}/android.jar"
EXE=""; [ -f "$BT/aapt2.exe" ] && EXE=".exe"
OUT="$ROOT/build"; DIST="$ROOT/dist"
rm -rf "$OUT"; mkdir -p "$OUT"/{gen,classes,dex,assets/www} "$DIST"

# ---- the signing key, outside the repository ----
KS_DIR="${MIFTAH_KEYS:-$HOME/.keys/miftah}"
KS="$KS_DIR/${ALIAS}-release.jks"
if [ ! -f "$KS" ]; then
  if [ "${MIFTAH_NEW_KEY:-0}" != "1" ]; then
    echo "No signing key at $KS"
    echo "Set MIFTAH_KEYS to the folder that holds it. To create a brand-new key (a different app identity), run with MIFTAH_NEW_KEY=1."
    exit 1
  fi
  mkdir -p "$KS_DIR"
  NEWPASS="$("$PY" -c "import secrets,string;print(''.join(secrets.choice(string.ascii_letters+string.digits) for _ in range(24)))")"
  keytool -genkeypair -keystore "$KS" -alias "$ALIAS" -keyalg RSA -keysize 4096 -validity 10000 \
    -storepass "$NEWPASS" -keypass "$NEWPASS" -dname "CN=$APP, O=$APP" >/dev/null 2>&1
  printf 'storeFile=%s-release.jks\nkeyAlias=%s\nstorePassword=%s\nkeyPassword=%s\n' "$ALIAS" "$ALIAS" "$NEWPASS" "$NEWPASS" > "$KS_DIR/keystore.properties"
  echo "Created a new key in $KS_DIR. Back it up offline now: every update must be signed with it."
fi
PASS="${MIFTAH_KS_PASS:-$(sed -n 's/^storePassword=//p' "$KS_DIR/keystore.properties" 2>/dev/null)}"
[ -n "$PASS" ] || { echo "Set MIFTAH_KS_PASS, or keep keystore.properties beside the key"; exit 1; }

echo "[1/8] content and checks"
"$PY" tools/build_content.py >/dev/null
node tools/test.js | tail -1
node tools/smoke.js | tail -1
node tools/teach-check.js | tail -1
node tools/strings.js | head -1

echo "[2/8] stage web assets"
"$PY" tools/bundle.py web "$OUT/assets/www"
if [ "${FINAL:-0}" = "1" ]; then "$PY" tools/standalone.py "$OUT/assets/www" "dist/$APP.html" "dist/$APP-share.html"; fi

echo "[3/8] aapt2 compile"
"$BT/aapt2$EXE" compile --dir android/res -o "$OUT/res.zip"

echo "[4/8] aapt2 link (version $VNAME, code $VCODE)"
"$BT/aapt2$EXE" link -o "$OUT/base.apk" -I "$AJ" --manifest android/AndroidManifest.xml \
  --java "$OUT/gen" --min-sdk-version 26 --target-sdk-version 35 \
  --version-code "$VCODE" --version-name "$VNAME" --auto-add-overlay "$OUT/res.zip"

echo "[5/8] javac"
find android/src build/gen -name '*.java' > "$OUT/sources.txt"
javac -nowarn -Xlint:-options -encoding UTF-8 --release 8 -classpath "$AJ" -d build/classes @build/sources.txt

echo "[6/8] d8"
find build/classes -name '*.class' > "$OUT/classes.txt"
java -cp "$BT/lib/d8.jar" com.android.tools.r8.D8 --release --min-api 26 --lib "$AJ" --output build/dex @build/classes.txt
"$PY" tools/pack.py build/base.apk build/assets build/dex/classes.dex build/packed.apk

echo "[7/8] zipalign"
"$BT/zipalign$EXE" -p -f 4 build/packed.apk build/aligned.apk

echo "[8/8] sign"
java -jar "$BT/lib/apksigner.jar" sign --ks "$KS" --ks-key-alias "$ALIAS" \
  --ks-pass "pass:$PASS" --key-pass "pass:$PASS" --out "$DIST/$APP.apk" "$OUT/aligned.apk"
java -jar "$BT/lib/apksigner.jar" verify --print-certs "$DIST/$APP.apk" | head -3

# Play Store bundle: the same resources linked in proto format, signed with the upload key
if [ "${FINAL:-0}" = "1" ] && [ -f tools/.bin/bundletool.jar ]; then
  echo "[aab] Play Store bundle"
  "$BT/aapt2$EXE" link --proto-format -o "$OUT/proto.apk" -I "$AJ" --manifest android/AndroidManifest.xml \
    --min-sdk-version 26 --target-sdk-version 35 --version-code "$VCODE" --version-name "$VNAME" --auto-add-overlay "$OUT/res.zip"
  "$PY" tools/aab.py "$OUT/proto.apk" "$OUT/assets" build/dex/classes.dex "$OUT/base.zip" >/dev/null
  rm -f "$DIST/$APP.aab"
  java -jar tools/.bin/bundletool.jar build-bundle --modules="$OUT/base.zip" --output="$DIST/$APP.aab"
  jarsigner -keystore "$KS" -storepass "$PASS" -keypass "$PASS" -sigalg SHA256withRSA -digestalg SHA-256 "$DIST/$APP.aab" "$ALIAS" >/dev/null
  ls -la "$DIST/$APP.aab"
fi
ls -la "$DIST/$APP.apk"
