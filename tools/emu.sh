#!/usr/bin/env bash
# Emulator helpers. usage: tools/emu.sh wait | install | start | shot <name> | tap x y | seed <age> | js "<code>"
ADB="$LOCALAPPDATA/Android/Sdk/platform-tools/adb.exe"
OUT="C:/Users/LEGION/AppData/Local/Temp/claude/acc78d938ece12bb/2699192b-7557-4d90-8d65-fb6d934209ff/scratchpad/shots"
mkdir -p "$OUT"
case "$1" in
  wait) "$ADB" wait-for-device; until [ "$("$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do sleep 2; done; echo booted ;;
  install) "$ADB" install -r "${2:-dist/Miftah.apk}" ;;
  start) "$ADB" shell am start -n com.miftah.app/.MainActivity ;;
  shot) "$ADB" exec-out screencap -p > "$OUT/$2.png"; python -c "
from PIL import Image; import sys
im=Image.open(r'$OUT/$2.png'); s=${3:-0.42}; im=im.resize((int(im.width*s),int(im.height*s))); im=im.convert('RGB'); im.save(r'$OUT/$2.jpg',quality=82)"; echo "$OUT/$2.jpg" ;;
  tap) "$ADB" shell input tap "$2" "$3" ;;
  back) "$ADB" shell input keyevent 4 ;;
  logs) "$ADB" logcat -d -s chromium:I AndroidRuntime:E | tail -${2:-20} ;;
esac
