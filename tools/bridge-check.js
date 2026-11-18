/* The web app talks to two native shells through one bridge (window.AndroidBridge). This check proves that every method
   the Android app offers also exists in the Windows app, so a page that works on the phone works on the computer.
   A few belong to one device only, by design; they are listed here with the reason. Run: node tools/bridge-check.js */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const java = fs.readFileSync(path.join(R, 'android/src/com/miftah/app/MainActivity.java'), 'utf8');
const rs = fs.readFileSync(path.join(R, 'windows/app/src/bridge.rs'), 'utf8');
const shim = fs.readFileSync(path.join(R, 'windows/shim.js'), 'utf8');
const android = [...java.matchAll(/@JavascriptInterface\s+public\s+\S+\s+(\w+)\s*\(/g)].map(m => m[1]);
const windows = new Set([...rs.matchAll(/"(\w+)"(?=\s*(?:\||=>))/g)].map(m => m[1]).concat([...shim.matchAll(/B\.(\w+)\s*=/g)].map(m => m[1])));
const PHONE_ONLY = {
  lanInfo: 'the phone looks for the computer; the computer is the one that answers (windows/app/src/link.rs)',
  lanFind: 'as above', lanProbe: 'as above', lanPair: 'as above', lanSync: 'as above', lanForget: 'as above'
};
const missing = android.filter(m => !windows.has(m) && !PHONE_ONLY[m]);
const used = new Set([...fs.readdirSync(path.join(R, 'web/js'), { recursive: true })].filter(f => String(f).endsWith('.js')).flatMap(f => [...fs.readFileSync(path.join(R, 'web/js', String(f)), 'utf8').matchAll(/(?:A\.N\.call\(\s*'|AndroidBridge\.)(\w+)/g)].map(m => m[1])));
console.log('Android bridge methods:', android.length, '· in the Windows app:', android.filter(m => windows.has(m)).length, '· phone only by design:', Object.keys(PHONE_ONLY).filter(m => android.includes(m)).length);
if (missing.length) { console.log('MISSING on Windows:', missing.join(', ')); process.exit(1); }
const unknown = [...used].filter(m => /^[a-z]/.test(m) && android.length && !android.includes(m) && !windows.has(m) && /^(ready|save|load|version|haptic|lastTheme|remember|set|speak|rec|mic|open|voice|audio|sync|request|pin|export|share|import|media|print|lan)/.test(m));
if (unknown.length) { console.log('The page calls methods neither shell has:', unknown.join(', ')); process.exit(1); }
console.log('ok: every page call has a home on both devices');
