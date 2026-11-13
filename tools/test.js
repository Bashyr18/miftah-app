/* Content integrity, run on every build. Religious text must trace to its source; the build stops on any failure. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = {};
eval(fs.readFileSync(path.join(root, 'web/js/data/gen.js'), 'utf8'));
const { QURAN: Q, HAD, DUA, SAY } = window;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const LATIN = /[A-Za-z]/, AR = /[؀-ۿ]/;

/* these two words have no recording at the source: tapping them simply stays quiet, nothing near-matching is played */
const NO_WORD = ['098_007_001.mp3', '079_001_002.mp3'];
/* what ships is always checked; the raw originals in tools/src (too large for the repo) are checked too when they are on this machine */
const RAW = fs.existsSync(path.join(__dirname, 'src/audio-full'));
const shipped = (dir, f) => fs.existsSync(path.join(root, 'web/audio', dir, f));
/* the Qurʾān: byte-identical to Tanzil, translation attached, recordings on disk */
const xml = fs.readFileSync(path.join(__dirname, 'sources/tanzil-uthmani.xml'), 'utf8');
ok(Q.order.length === 38, 'al-Fātiḥah + 37 sūrahs of Juzʾ ʿAmma');
/* the rest of the Muṣḥaf must match its source letter for letter */
{
  const w2 = {}; new Function('window', fs.readFileSync(path.join(root, 'web/quran-rest.js'), 'utf8'))(w2); const R = w2.QURAN_REST, xm = fs.readFileSync(path.join(__dirname, 'sources/tanzil-uthmani.xml'), 'utf8');
  ok(R.order.length === 76 && new Set(R.order.concat(Q.order)).size === 114, 'all 114 sūrahs, once each');
  for (const n of R.order) {
    const su = R.q[n], block = xm.match(new RegExp('<sura index="' + n + '"[^>]*>([\\s\\S]*?)</sura>'))[1], src = [...block.matchAll(/<aya index="(\d+)" text="([^"]*)"/g)];
    ok(src.length === su.v.length, 'sūrah ' + n + ' āyah count');
    ok(su.v.every((v, i) => v[0] === i + 1 && v[1] === src[i][2] && v[2]), 'sūrah ' + n + ' Arabic identical to Tanzil, translation present');
  }
}
for (const n of Q.order) {
  const su = Q.q[n];
  ok(!!su, 'sūrah ' + n);
  const block = xml.match(new RegExp('<sura index="' + n + '"[^>]*>([\\s\\S]*?)</sura>'))[1];
  const src = [...block.matchAll(/<aya index="(\d+)" text="([^"]*)"/g)];
  ok(src.length === su.v.length, 'sūrah ' + n + ' āyah count');
  su.v.forEach((v, i) => {
    ok(v[0] === i + 1, n + ':' + v[0] + ' numbering');
    ok(v[1] === src[i][2], n + ':' + v[0] + ' Arabic identical to Tanzil');
    ok(!LATIN.test(v[1]), n + ':' + v[0] + ' no Latin in Arabic');
    ok(v[2] && !AR.test(v[2]), n + ':' + v[0] + ' translation present, no Arabic in it');
    ok(!/\[\d+\]/.test(v[2]) && !/—/.test(v[2]), n + ':' + v[0] + ' no footnote marks or em dashes');
    const f = String(n).padStart(3, '0') + String(v[0]).padStart(3, '0') + '.mp3';
    ok(shipped('h', f.replace('.mp3', '.ogg')), 'Ḥuṣarī ' + f + ' ships');
    if (RAW) ok(fs.existsSync(path.join(root, 'tools/src/audio-full/h', f)), 'Ḥuṣarī ' + f);
    if (RAW) ok(fs.existsSync(path.join(root, 'tools/src/audio-full/a', f)), 'ʿAfāsī ' + f);
    /* word recordings follow words, not Tanzil's standalone pause marks */
    let k = 0; v[1].split(' ').forEach(t => { if (/[ء-يٮ-ۓۺ-ۿ]/.test(t)) { k++; const w = String(n).padStart(3, '0') + '_' + String(v[0]).padStart(3, '0') + '_' + String(k).padStart(3, '0') + '.mp3'; if (RAW && !NO_WORD.includes(w)) ok(fs.existsSync(path.join(root, 'tools/src/audio-full/w', w)), 'word ' + w); } });
  });
}
/* hadith: reference and grade on each, sliced, nothing weak */
for (const k of Object.keys(HAD)) {
  const h = HAD[k];
  ok(h.ar && AR.test(h.ar) && !LATIN.test(h.ar), k + ' Arabic');
  ok(h.en && !AR.test(h.en.replace(/ﷺ/g, '')), k + ' English');
  ok(h.ref && h.url, k + ' reference');
  ok(/^(Ṣaḥīḥ|Ḥasan)/.test(h.g), k + ' authentic grade');
  ok(!/veil/i.test(h.en), k + ' no "veil"');
}
for (const k of Object.keys(DUA)) {
  const d = DUA[k];
  ok(d.ar && d.tr && d.en && d.ref, k + ' fields');
  ok(!LATIN.test(d.ar), k + ' no Latin in Arabic');
  ok(!/[\[\]]/.test(d.ar + d.tr + d.en), k + ' no stray brackets');
  ok(shipped('d', d.id + '.ogg'), k + ' recording ships');
  if (RAW) ok(fs.existsSync(path.join(root, 'tools/src/audio-full/d', d.id + '.mp3')), k + ' recording');
}
for (const k of Object.keys(SAY)) ok(SAY[k].ar && SAY[k].en && SAY[k].ref, k + ' ṣalāh words');

/* wording guard across everything we wrote */
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const jsPaths = {}; walk(path.join(root, 'web/js')).forEach(p => { jsPaths[path.basename(p)] = p; });
const files = Object.keys(jsPaths).filter(f => /^(cur-|inst-|v-|player|engine|core|boot|voice|fx|i18n)/.test(f));
for (const f of files) {
  const s = fs.readFileSync(jsPaths[f], 'utf8');
  ok(!/—/.test(s.replace(/\/\*[\s\S]*?\*\//g, '')), f + ' no em dash');
  ok(!/\bKareem\b|Jumu.ah Mub|\bveil\b/i.test(s), f + ' no forbidden wording');
  ok(!/\bMeaning\b/.test(s), f + ' no "Meaning" label');
  ok(!/\bchime|melody/i.test(s.replace(/\/\*[\s\S]*?\*\//g, '')), f + ' no musical sounds');
}
console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
