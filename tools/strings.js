/* Arabic coverage: every string that reaches T() must be in web/js/data/i18n.js, and every content string must be [en, ar]. Prints what is missing. */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'web', 'js');
global.window = {};
require(path.join(dir, 'data', 'i18n.js'));
const D = window.I18N;
const found = new Set();
const skip = /^(gen|strokes|i18n)\.js$/;
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.relative(dir, path.join(d, e.name))]);
for (const f of walk(dir)) {
  if (skip.test(path.basename(f)) || !f.endsWith('.js')) continue;
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const re = /\bT\(([^;]*?)\)/g; let m;
  while ((m = re.exec(src))) {
    const inner = m[1];
    const q = /'((?:[^'\\]|\\.)*)'/g; let k;
    while ((k = q.exec(inner))) if (/[A-Za-z]{2}/.test(k[1]) && !/^(ar|en|h|m|f|'|class)$/.test(k[1])) found.add(k[1].replace(/\\'/g, "'"));
  }
  /* the how-it-teaches list and other arrays handed to T through a variable */
  if (path.basename(f) === 'v-parent.js') { const a = src.indexOf('var P = [['), b = src.indexOf("return { html: head(T('How Mift"); const seg = src.slice(a, b); const q = /'((?:[^'\\]|\\.)*)'/g; let k; while ((k = q.exec(seg))) found.add(k[1]); }
}
['My question', 'What I will change (only one thing)', 'What I will keep the same', 'What I think will happen, and why', 'What really happened', 'What I learned', 'Practice at their level', 'Writing', 'Games to move and play', 'Tools for the table', 'Deen and the Qurʾān', 'Noticing the world', 'Celebrate and plan', 'Gentle', 'Steady', 'Strong', 'Less', 'Normal', 'More', 'lanterns', 'proven keys', 'keys', 'sūrahs', 'On the room’s shelf', 'Before the lesson', 'After the lesson', 'New keys', 'None yet', 'Nothing is stuck', 'Forged', 'Proven', 'Deep in your heart', 'Started', 'Today', 'Rooms', 'Talk about', 'Record', 'Setup', 'alone', 'start', 'middle', 'end', 'Ice: solid', 'Water: liquid', 'Steam: gas'].forEach(s => found.add(s));
const missing = [...found].filter(s => D[s] == null).sort();
if (process.argv[2] === '--list') console.log(JSON.stringify([...found].sort(), null, 0));
console.log(found.size + ' strings, ' + missing.length + ' missing');
missing.forEach(s => console.log('  ' + s));
process.exit(missing.length ? 1 : 0);
