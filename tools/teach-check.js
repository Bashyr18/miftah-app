/* Every taught maths and science lesson, checked by calculation: each worked line is computed, each answer agrees with its working, each "find the mistake" has
   exactly one false line, no wrong-answer explanation can fire on the right answer, and nothing reads undefined. Runs on every build. */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'web/js/curriculum');
const specs = {};
function rng(seed) {
  let a = (seed >>> 0) || 1;
  const r = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  r.int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1)); r.pick = x => x[Math.floor(r() * x.length)]; r.shuffle = x => { const y = x.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)), t = y[i]; y[i] = y[j]; y[j] = t; } return y; }; r.bool = () => r() < .5;
  return r;
}
global.window = { C: { teach: (id, sp) => { if (specs[id]) console.log('FAIL duplicate ' + id); specs[id] = sp; } }, Dia: new Proxy({}, { get: () => () => '<svg></svg>' }) };
const KITS = ['cur-tm-kit.js', 'cur-ts-kit.js'], rank = f => (KITS.indexOf(f) + 1 || 9);
const files = fs.readdirSync(dir).filter(f => /^cur-t[ms]-/.test(f)).sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : 1));
files.forEach(f => new Function('window', fs.readFileSync(path.join(dir, f), 'utf8'))(global.window));

let pass = 0, fail = 0; const seen = {};
const bad = (id, m) => { fail++; const k = id + ': ' + m.replace(/-?\d+(\.\d+)?/g, '#'); seen[k] = (seen[k] || 0) + 1; if (seen[k] === 1) console.log('FAIL ' + id + ': ' + m); };
const AR = /[؀-ۿ]/;
function pair(id, x, what) { if (!Array.isArray(x) || x.length < 2 || !x[0] || !x[1]) return bad(id, what + ' is not [en, ar]'); if (/[A-Za-z]{2}/.test(x[0]) && !AR.test(x[1]) && x[1][0] !== '\u2066' && x[0] !== x[1]) bad(id, what + ' has no Arabic: ' + x[1]); if (/[؀-ۿ]/.test(x[0])) bad(id, what + ' Arabic in the English: ' + x[0]); [x[0], x[1]].forEach(s => { if (/undefined|NaN(?![O₀-₉])|null|Infinity|—/.test(s)) bad(id, what + ' reads badly: ' + s); }); pass++; }
let SCI = false;
const TS = () => global.window.C.TS;
let UNITRE = null, FORMRE = null;
function unitRe() { if (!UNITRE) { const u = TS().UNITS.slice().sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')); UNITRE = new RegExp('(\\d|\\)|\\s)\\s*(' + u.join('|') + ')(?![A-Za-z])', 'g'); } return UNITRE; }
function stripUnits(s) { let t = String(s), p; do { p = t; t = t.replace(unitRe(), '$1'); } while (t !== p); return t; }
function isFormula(tok) {
  if (!FORMRE) { const el = TS().EL.slice().sort((a, b) => b.length - a.length).join('|'); FORMRE = new RegExp('^(?:(?:' + el + ')[₀-₉]*|\\((?:(?:' + el + ')[₀-₉]*)+\\)[₀-₉]*)+[⁰-⁹]*[⁺⁻]?$'); }
  return FORMRE.test(String(tok).replace(/\((s|l|g|aq)\)$/, '').replace(/^\d+/, ''));
}
/* atoms and charge on each side of a chemical equation; null when a side is not formulae */
const SUB = s => s.replace(/[₀-₉]/g, c => '₀₁₂₃₄₅₆₇₈₉'.indexOf(c)), SUP = s => s.replace(/[⁰-⁹]/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c));
function atoms(term) {
  let t = term.trim().replace(/\((s|l|g|aq)\)$/, ''), k = 1, m = /^(\d+)\s*(.*)$/.exec(t); if (m) { k = +m[1]; t = m[2]; }
  const out = { _q: 0 };
  if (/^e⁻$/.test(t)) { out._q = -k; return out; }
  const ch = /([⁰-⁹]*)([⁺⁻])$/.exec(t); if (ch) { out._q = k * (ch[2] === '⁺' ? 1 : -1) * (+SUP(ch[1]) || 1); t = t.slice(0, -ch[0].length); }
  if (!isFormula(t)) return null;
  t = SUB(t);
  const add = (el, n) => { out[el] = (out[el] || 0) + n * k; };
  t.replace(/\(([^)]+)\)(\d*)|([A-Z][a-z]?)(\d*)/g, (x, grp, gn, el, en) => { if (grp) grp.replace(/([A-Z][a-z]?)(\d*)/g, (y, e2, n2) => add(e2, (+n2 || 1) * (+gn || 1))); else add(el, +en || 1); return x; });
  return out;
}
function sideAtoms(side) { const tot = {}; for (const term of side.split(/\s\+\s/)) { const a = atoms(term); if (!a) return null; for (const k in a) tot[k] = (tot[k] || 0) + a[k]; } return tot; }
function balanced(t) {
  const sides = String(t).split(/→|⇌/); if (sides.length !== 2) return null;
  const L0 = sideAtoms(sides[0]), R0 = sideAtoms(sides[1]); if (!L0 || !R0) return null;
  const keys = new Set(Object.keys(L0).concat(Object.keys(R0)));
  for (const k of keys) if ((L0[k] || 0) !== (R0[k] || 0)) return false;
  return true;
}
function evalSide(s) {
  if (SCI) s = stripUnits(s);
  let e = String(s).replace(/\s/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/²/g, '**2').replace(/³/g, '**3').replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)').replace(/√([0-9.]+)/g, 'Math.sqrt($1)').replace(/π/g, 'Math.PI').replace(/%/g, '/100').replace(/(\d|\))\(/g, '$1*(').replace(/\)(\d)/g, ')*$1').replace(/--/g, '+');
  if (!/^[0-9+\-*/().,Mathsqrt_PI ]+$/.test(e) || /,/.test(e)) return null;
  e = e.replace(/(^|[^*\d.)])-(\d+(?:\.\d+)?)\*\*/g, '$1-($2)**');
  try { const v = new Function('return (' + e + ')')(); return typeof v === 'number' && isFinite(v) ? v : null; } catch (x) { return null; }
}
/* true, false, or null when the line holds words or letters and cannot be computed */
function lineTrue(t) {
  if (Array.isArray(t)) return null;
  if (SCI && /→|⇌/.test(t)) return balanced(t);
  if (/≈/.test(t) && !/[×÷+−]/.test(t)) return null;
  const approx = /≈/.test(t), sides = String(t).split(/=|≈/).map(s => s.trim()).filter(Boolean);
  if (sides.length < 2) return null;
  let vals = sides.map(evalSide);
  /* science: a formula may lead the line, F = m × a = 4 × 5 = 20 N; everything after it is computed */
  if (SCI) { let k = 0; while (k < vals.length && vals[k] == null) k++; if (vals.slice(k).some(v => v == null)) return null; vals = vals.slice(k); if (vals.length < 2) return null; }
  if (vals.some(v => v == null)) return null;
  for (let i = 1; i < vals.length; i++) { const tol = approx ? Math.max(.06, Math.abs(vals[i]) * .02) : 1e-6 + Math.abs(vals[i]) * 1e-9; if (Math.abs(vals[i] - vals[0]) > tol) return false; }
  return true;
}
const num = a => { const m = /^(-?[\d.]+)\/([\d.]+)$/.exec(String(a).replace(/−/g, '-')); return m ? +m[1] / +m[2] : +String(a).replace(/−/g, '-'); };
/* English words in a working line must be ones the app can translate */
const sciClean = t => SCI ? stripUnits(String(t)).replace(/\(?[A-Z][A-Za-z₀-₉⁰-⁹⁺⁻()]*/g, m => isFormula(m) || isFormula(m.replace(/^\(|\)$/g, '')) ? ' ' : m).replace(new RegExp('(^|[^A-Za-z])(' + TS().UNITS.slice().sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|') + ')(?![A-Za-z])', 'g'), '$1 ') : String(t);
const wordsOK = (id, t) => { if (Array.isArray(t)) return; t = sciClean(t); const W = global.window.C.TM.WORDS; String(t).replace(/π|sin|cos|tan|cm|km|mm|m\/s|km\/h|xy|fg|gf/g, ' ').replace(/[A-Za-z]{2,}/g, w => { if (!(w in W) && !Object.keys(W).some(k => k.indexOf(' ') > 0 && k.split(' ').includes(w))) bad(id, 'word cannot be translated: ' + w + ' in ' + t); return w; }); };
const E0 = x => Array.isArray(x) ? x[0] : x;
const full = s => (E0(s[2]) || '') + (s[3] != null ? ' ' + E0(s[3]) : '') + (s[4] ? ' ' + E0(s[4]) : '');
const wordLine = s => Array.isArray(s[2]) || Array.isArray(s[3]) || Array.isArray(s[4]);

Object.keys(specs).forEach(id => {
  const sp = specs[id]; SCI = !!sp.sci;
  if (!sp.keep) { if (!sp.why) bad(id, 'no why'); else pair(id, sp.why, 'why'); if (!sp.idea || !sp.idea.length) bad(id, 'no idea pages'); else sp.idea.forEach(p => pair(id, Array.isArray(p) ? p : p.p, 'idea')); }
  if (!sp.explain) bad(id, 'no explain'); else { if (sp.explain.length < 4) bad(id, 'explain needs question + 3'); sp.explain.forEach(x => pair(id, x, 'explain')); }
  if (!sp.trap) bad(id, 'no trap');
  [1, 2, 3].forEach(lv => {
    const sigs = new Set(), R = rng(lv * 977 + id.length);
    for (let i = 0; i < 300; i++) {
      let P; try { P = sp.g(R, lv); } catch (e) { bad(id, 'g threw at level ' + lv + ': ' + e.message); break; }
      sigs.add(JSON.stringify([P.q, P.eq, P.a, P.o && P.o[0]]));
      pair(id, P.q, 'question');
      if (P.eq != null && (/undefined|NaN(?![O₀-₉])|Infinity/.test(P.eq) || /[A-Za-z]{2,}/.test(sciClean(P.eq).replace(/sin|cos|tan|Math|log/g, '')))) bad(id, 'eq has words or NaN: ' + P.eq);
      if (!P.s || !P.s.length) bad(id, 'no working'); else {
        if ((lv === 1 || lv === 3) && !P.o && !P.s.some(st => st[3] != null)) bad(id, 'level ' + lv + ' working has nothing for the child to fill in');
        P.s.forEach(st => {
          if (wordLine(st)) { ['before', 'word', 'after'].forEach((w, k) => { const v = st[2 + k]; if (Array.isArray(v)) pair(id, v, 'line ' + w); else if (v && /[A-Za-z]{2}/.test(sciClean(v))) bad(id, 'a line of words has an English-only part: ' + v); });
            if (Array.isArray(st[3])) { if (!Array.isArray(st[5]) || !st[5].length) bad(id, 'a word blank needs wrong words to choose from'); else { st[5].forEach(o => { pair(id, o, 'wrong word'); if (o[2]) pair(id, [o[2], o[3]], 'wrong word why'); if (o[0] === st[3][0]) bad(id, 'a wrong word is the right word: ' + o[0]); }); if (new Set(st[5].map(o => o[0])).size !== st[5].length) bad(id, 'repeated wrong word'); } } }
          if (st[0] != null) pair(id, [st[0], st[1]], 'note'); if (!wordLine(st)) wordsOK(id, st[2] || ''); const t = full(st); if (/undefined|NaN(?![O₀-₉])|Infinity/.test(t)) bad(id, 'line reads badly: ' + t); if (lineTrue(t) === false) bad(id, 'false line: ' + t + ' in ' + JSON.stringify(P.eq || P.q[0])); pass++; });
      }
      if (P.o) {
        if (P.o.length < 3) bad(id, 'too few options'); const ts = new Set(P.o.map(o => o[0])); if (ts.size !== P.o.length) bad(id, 'repeated option: ' + JSON.stringify(P.o.map(o => o[0])));
        P.o.forEach(o => pair(id, [o[0], o[1]], 'option'));
      } else if (P.alg) { if (P.a == null) bad(id, 'no answer'); } else {
        if (!/^-?\d*\.?\d+(\/\d+)?$/.test(String(P.a))) bad(id, 'answer cannot be typed: ' + P.a); if (String(P.a).length > 9) bad(id, 'answer too long: ' + P.a);
        const last = P.s && [...P.s].reverse().find(s => s[3] != null && !Array.isArray(s[3]));
        if (!last) bad(id, 'working has no blank'); else if (Math.abs(num(last[3]) - num(P.a)) > 1e-9) bad(id, 'last working line ' + last[3] + ' is not the answer ' + P.a);
        (P.miss || []).forEach(m => { pair(id, [m[1], m[2]], 'miss'); if (isNaN(num(m[0]))) bad(id, 'miss value ' + m[0]); });
      }
    }
    if (sigs.size < (lv === 1 || sp.g(rng(5), lv).o ? 2 : 3)) bad(id, 'level ' + lv + ' has only ' + sigs.size + ' different questions');
  });
  if (sp.trap) { const R = rng(31); for (let i = 0; i < 100; i++) {
    const t = sp.trap(R); if (!t.l || t.w == null) { bad(id, 'trap shape'); break; }
    pair(id, t.why, 'trap why');
    if (t.w >= t.l.length - 1) bad(id, 'the wrong line is the last line, too easy to guess');
    t.l.forEach(x => wordsOK(id, x)); if (t.eq) wordsOK(id, t.eq);
    const truth = t.l.map(lineTrue);
    if (truth[t.w] === true) bad(id, 'trap line is actually true: ' + t.l[t.w]);
    /* a line after the mistake carries it forward: it is checked as far as the working allows */
    truth.slice(0, t.w).forEach((v, k) => { if (v === false) bad(id, 'a second false line before the trap: ' + t.l[k]); });
  } }
});
const nS = Object.keys(specs).filter(k => specs[k].sci).length;
console.log(Object.keys(specs).length + ' lessons (' + (Object.keys(specs).length - nS) + ' maths, ' + nS + ' science), ' + pass + ' passed, ' + fail + ' failed');
if (fail) process.exit(1);
