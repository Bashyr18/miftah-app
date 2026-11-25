/* Boots the real page in jsdom and walks a child's week, in both languages. Canvas instruments are exercised in the browser audit, not here. */
const fs = require('fs'), path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const root = path.join(__dirname, '..', 'web');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/<meta http-equiv[^>]*>/, '').replace(/<link[^>]*>/g, '').replace(/<script src="[^"]*"><\/script>/g, '');
const scripts = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
function boot(stored, iso) {
  const errors = [];
  const vc = new VirtualConsole(); vc.on('error', e => errors.push(String(e && e.stack || e))); vc.on('jsdomError', e => { if (!/Not implemented|canvas/i.test(String(e))) errors.push(String(e.stack || e)); });
  const dom = new JSDOM(html, { url: 'https://appassets.androidplatform.net/index.html', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc });
  const w = dom.window;
  Object.defineProperty(w.crypto, 'subtle', { value: require('node:crypto').webcrypto.subtle });
  w.TextEncoder = TextEncoder;
  w.matchMedia = () => ({ matches: true });   /* reduced motion: skips animation in tests */
  w.Element.prototype.animate = function () { return { finish() { }, cancel() { }, onfinish: null }; };
  w.Element.prototype.scrollIntoView = function () { };
  w.HTMLCanvasElement.prototype.getContext = function () { return new Proxy({}, { get: (t, k) => (k === 'createLinearGradient' || k === 'createRadialGradient') ? () => ({ addColorStop() { } }) : k === 'getImageData' ? () => ({ data: new Uint8ClampedArray(4 * 200 * 200) }) : () => { }, set: () => true }); };
  w.Path2D = function () { };
  w.Audio = function () { return { play() { return Promise.resolve(); }, pause() { }, removeAttribute() { } }; };
  w.scrollTo = () => { };
  if (stored) w.localStorage.setItem('miftah.v1', JSON.stringify(stored));
  const R = Date; if (iso) { const t = new R(iso).getTime(); w.eval('(function(){var R=Date;var t=' + t + ';window.__t=t;window.Date=function(a,b,c,d,e,f){if(arguments.length===0)return new R(window.__t);if(arguments.length===1)return new R(a);return new R(a,b,c||0,d||0,e||0,f||0)};Date.UTC=R.UTC;Date.now=function(){return window.__t};Date.prototype=R.prototype;})()'); }
  for (const s of scripts) w.eval(fs.readFileSync(path.join(root, s), 'utf8'));
  return { w, A: w.A, errors, go: (h) => { w.location.hash = '#/' + h; w.A.rerender(); } };
}
const year = 2026;
const kid = (age, id) => ({ id: id || 'c1', name: 'Amina', by: year - age, bm: 1, g: 'f', hue: 'emerald', since: '2026-11-05' });

{ /* School breaks share the planner without replacing today's working plan. */
  const t = boot({ profiles: [kid(8), kid(3, 'c2')], cur: 'c1' }, '2026-11-05T09:00:00');
  const { A, w } = t, { Flow, Plan } = w;
  const field = id => A.$$('#' + id).at(-1);
  const school = Plan.today('c1');
  school.stops[0].done = true;
  t.go('parent');
  ok(!A.$('[data-a="fam-break"]'), 'school break controls are behind the parent gate');
  A.acts['fam-break']();
  ok(!A.$('#break-form'), 'school break action also requires a parent session');
  const sum = A.$('#gp-q').textContent.split('+').map(x => parseInt(x));
  A.$$('.numopt').find(b => +b.dataset.v === sum[0] + sum[1]).click();
  A.$('[data-a="fam-break"]').click();
  field('break-from').value = '2026-11-06';
  field('break-to').value = '2026-11-09';
  field('break-form').requestSubmit();
  ok(Plan.today('c1') === school && !Flow.inSchoolBreak(), 'scheduling a future break leaves today intact');
  const ahead = Flow.preview('c1', 5);
  ok(ahead.slice(0, 4).every(d => d.kind === 'rest' && !d.lessons.length) && ahead[4].kind === 'school',
    'the forecast includes both ends of the break and resumes after the last day');
  ok(!Flow.setSchoolBreak('2026-02-30', '2026-11-07') && !Flow.setSchoolBreak('2026-11-06', '2026-11-05'),
    'impossible dates and reversed ranges are rejected');
  ok(Flow.setSchoolBreak('2026-11-05', '2026-11-05'), 'a one-day break can start today');
  ok(Plan.today('c1').stops.every(s => s.t === 'hifz' || s.t === 'mission') && !Plan.today('c2').stops.length,
    'a break uses the rest plan for school-age learners and pauses nursery stops');
  A.load();
  ok(Flow.inSchoolBreak(), 'the scheduled break survives reload');
  A.rerender();
  A.$('[data-a="fam-break"]').click();
  field('break-remove').click();
  ok(!Flow.inSchoolBreak() && Plan.today('c1').stops[0].done, 'cancelling today restores the original completed stop');
  A.S.lang = 'ar'; A.rerender();
  A.$('[data-a="fam-break"]').click();
  ok(field('break-form').textContent.includes('اليوم الأول'), 'the break form renders in Arabic');
  ok(t.errors.length === 0, 'school break browser errors: ' + (t.errors[0] || '').slice(0, 260));
}

/* fresh install */
let T = boot(null, '2026-11-05T09:00:00');
ok(T.A.route() === 'welcome' || T.w.location.hash.includes('welcome') , 'a new install opens on the welcome');
ok(T.A.$('#wel-go') && (T.A.$('.wel-door') || T.A.$('.wel-plate')), 'the welcome scene shows the door and one way in');
ok(T.errors.length === 0, 'no errors at start: ' + T.errors[0]);

/* every room's lessons for a 6-year-old open */
for (const age of [3, 6, 9]) {
  T = boot({ profiles: [kid(age)], cur: 'c1' }, '2026-11-05T09:00:00');
  const { A, w } = T;
  const st = A.stage();
  ok(st === (age < 5 ? 0 : age < 8 ? 1 : 2), 'age ' + age + ' gets the right stage');
  T.go('home');
  ok(A.$$('.pstop').length > 0, 'age ' + age + ': today has a path');
  const pl = w.Plan.today();
  ok(pl.stops.every(s => s.t && !s.done), 'the path starts undone');
  if (st === 0) {
    ok(pl.stops.every(s => s.t === 'nursery'), 'Little Steps gets parent-led activities only');
    ok(!A.$('.rooms'), 'Little Steps shows no rooms');
    T.go('stop/0'); ok(A.$('#nur-go'), 'the adult card comes first');
    A.$('#nur-go').click(); ok(A.$('.nur-child'), 'then one big thing for the child');
    ok(!/Check|score|points/i.test(A.$('.nur-child').textContent.replace('Grown-up: finish', '')), 'no text or score for a toddler');
    A.$('#nur-back').click(); ok(A.$('.obs'), 'then a neutral observation');
    A.$('.obs button').click();
    ok(A.D().obs.length === 1 && A.D().obs[0].kind === 'nursery', 'an observation is kept');
    ok(w.Plan.today().stops[0].done, 'and the stop is done');
  } else {
    ok(pl.stops.some(s => s.t === 'hifz'), 'the Qurʾān is on every day’s path');
    ok(pl.stops.some(s => s.t === 'lesson'), 'there is new learning');
    T.go('keys'); ok(A.$('.empty'), 'no keys yet: an invitation, not an empty room');
    for (const r of w.C.order) { T.go('room/' + r); ok(A.$('.wrap'), 'room ' + r + ' opens'); }
  }
  ok(T.errors.length === 0, 'age ' + age + ' raised no errors: ' + T.errors[0]);
}

/* the evidence gate */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const M = w.M;
  T.go('home');
  const s = 'm.count5';
  ok(M.state(s) === 'new', 'an untouched skill is new');
  M.log(s, { k: 'recognition', ok: true });
  M.forge(s);
  ok(M.state(s) === 'forged', 'passing the lesson forges a key');
  M.log(s, { k: 'production', ok: true });
  M.log(s, { k: 'recall', ok: true });
  ok(M.state(s) === 'forged', 'three quick successes the same day do not prove it');
  ok(M.light(s) > .9, 'a fresh key is bright');
  w.__t += 3 * 864e5;
  ok(M.light(s) < .5, 'three days later it has dimmed');
  ok(M.due().some(x => x.s === s), 'and it comes due for review');
  M.log(s, { k: 'recall', ok: true, rv: true });
  ok(M.state(s) === 'proven', 'recall after a real delay, with production already shown, proves it');
  ok(M.light(s) > .9, 'recalling it relights the key');
  const h = M.key(s).h; ok(h > 3, 'and memory now lasts longer: half-life ' + h.toFixed(1));
  const a = 'a.l1'; M.log(a, { k: 'recall', ok: true, a: true });
  ok(M.key(a).okInd === 0, 'assisted work never counts as independent');
  const before = JSON.stringify(A.D().keys);
  M.rebuild();
  ok(JSON.stringify(A.D().keys) === before, 'the whole record can be rebuilt from its events');
  M.log(a, { k: 'recognition', ok: false, e: 'letter-shape' });
  ok(A.D().led.some(e => e.e === 'letter-shape'), 'wrong answers keep their type');
  w.__t += 14 * 864e5 + 1;
  M.log(s, { k: 'recall', ok: true, rv: true });
  ok(M.state(s) === 'deep', 'after two weeks it is deep');
}

/* lesson flow through the real player, with the real rules */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { C, M } = w;
  T.go('lesson/m.bond5');
  ok(A.$('.pl'), 'a lesson opens in the player');
  ok(A.$('.keybar'), 'the key forms at the top');
  ok(!/score|points/i.test(A.$('.pl').textContent), 'no score anywhere');
  /* a skill locked by its prerequisite cannot be started from the room */
  T.go('room/math');
  const locked = A.$$('.mapn.lock'); ok(locked.length > 0, 'later doors are locked');
  /* placement for older children */
  const older = kid(9, 'c2'); A.S.profiles.push(older); w.A.placeDefault(older);
  ok(M.met('m.count5', 'c2'), 'a nine-year-old is placed past early maths');
  ok(!M.met('a.l1', 'c2'), 'but starts Arabic letters unless a parent says otherwise');
  ok(C.next('math', 'c2').band === 2, 'the next maths door is at their level');
  ok(C.next('arabic', 'c2').id === 'a.old1', 'and the next Arabic door is the older beginners’ road, not a five-year-old’s letters');
  older.arabic = 'reads'; ok(C.next('arabic', 'c2').y >= 2 && !C.next('arabic', 'c2').older, 'a nine-year-old who reads starts near their year');
  /* day rollover */
  const p1 = w.Plan.today().day; w.__t += 864e5; ok(w.Plan.today().day !== p1, 'a new day builds a new path');
}

/* ḥifẓ: sabaq, sabqī, manzil */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const H = w.Hifz;
  let t = H.today();
  ok(t.sabaq.s === 1 && t.sabaq.from === 1, 'memorising starts with al-Fātiḥah');
  H.mark(1, 1, 2, 'parent'); H.advance(1);
  t = H.today(); ok(t.sabaq.from === 2, 'then the next āyah');
  ok(t.sabqi.length === 0, 'nothing is due the same day');
  w.__t += 864e5; t = H.today();
  ok(t.sabqi.includes('1:1'), 'next day it returns as recent revision');
  H.mark(1, 1, 2, 'self');
  w.__t += 9 * 864e5; t = H.today();
  ok(t.manzil.includes('1:1'), 'after a week it moves to the long cycle');
  H.mark(1, 1, 0, 'parent'); ok(H.state().u['1:1'].lapse === 1, 'a slip is recorded and comes back sooner');
  ok(H.state().log.every(x => x.by === 'parent' || x.by === 'self'), 'every check names who heard it');
  T.go('hifz'); ok(A.$('#hf-v') , 'the session opens');
  ok(!A.$('.opt'), 'the Qurʾān has no multiple-choice games');
  T.go('surah/112'); ok(A.$$('.tx-v').length === 4, 'Al-Ikhlāṣ shows its four āyāt');
  T.go('room/quran'); ok(A.$$('.kitem').length === 38, 'the shelf has all of Juzʾ ʿAmma and al-Fātiḥah');
  ok(T.errors.length === 0, 'ḥifẓ raised no errors: ' + T.errors[0]);
}

/* the parent area */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A } = T;
  T.go('parent'); ok(A.$('.gate'), 'parents sit behind a gate');
  const q = A.$('.gate p').textContent.split('+').map(x => parseInt(x)); const ans = q[0] + q[1];
  A.$$('.numopt').find(b => +b.dataset.v === ans).click();
  ok(A.$('.fc'), 'the right answer opens it');
  for (const t of ['today', 'hear', 'rooms', 'talk', 'record', 'set']) { T.go('parent/c1/' + t); ok(A.$('.tabs'), 'tab ' + t); }
  T.go('parent/settings'); ok(A.$('.segs'), 'settings');
  { const win = A.$('body').ownerDocument.defaultView; win.__tidyNow && win.__tidyNow(); const cs = A.$$('.card.acc'); if (cs.length > 1) { const shut = cs.find(c => c.classList.contains('shut')), open = cs.find(c => !c.classList.contains('shut')); shut.querySelector('h3').click(); ok(!shut.classList.contains('shut') && open.classList.contains('shut'), 'tapping a closed section opens it and closes the other'); shut.querySelector('h3').click(); ok(shut.classList.contains('shut'), 'tapping an open one closes it'); } else ok(false, 'settings sections fold'); }
  T.go('parent/voices'); ok(A.$$('.li').length > 40, 'voices lists letters and sounds');
  T.go('parent/about'); ok(A.$('.card'), 'about');
  ok(T.errors.length === 0, 'parent raised no errors: ' + T.errors[0]);
}

/* persistence and damaged backups */
T = boot({ profiles: [kid(6)], cur: 'c1', lang: 'ar', theme: 'dark' }, '2026-11-05T09:00:00');
{
  const { A, w } = T;
  w.M.log('m.count5', { k: 'recall', ok: true }); A.saveNow();
  const raw = JSON.parse(w.localStorage.getItem('miftah.v1'));
  ok(raw.data.c1.led.length === 1, 'progress persists');
  const setItem = w.Storage.prototype.setItem;
  w.Storage.prototype.setItem = () => { throw new w.DOMException('Storage is full', 'QuotaExceededError'); };
  w.M.log('m.count5', { k: 'recall', ok: true }); A.saveNow();
  ok(JSON.parse(w.localStorage.getItem('miftah.v1')).data.c1.led.length === 1, 'a full browser store keeps the last durable copy');
  w.Storage.prototype.setItem = setItem;
  ok(raw.lang === 'ar', 'language persists');
  ok(w.document.documentElement.dir === 'rtl', 'Arabic is right to left');
  ok(JSON.stringify(A.shape({ profiles: 'nope', lang: 7, data: 3, theme: 'x' })).length > 0, 'a damaged backup cannot break the app');
  T.go('home'); ok(/طريق اليوم/.test(A.$('.pathbox').textContent), 'the path speaks Arabic');
  T.go('lesson/m.count5'); ok(/تعرّف|تذكّر/.test(A.$('.pl-ph').textContent), 'the lesson speaks Arabic');
  T.go('keys'); T.go('room/deen');
  ok(T.errors.length === 0, 'Arabic raised no errors: ' + T.errors[0]);
}
/* v2: an interrupted lesson keeps its place */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T;
  T.go('lesson/m.bond5');
  A.D().resume = { skill: 'm.bond5', seed: 77, stop: null, i: 2, solo: 0, soloOk: 0, t: w.Date.now() };
  T.go('home'); ok(/Carry on/.test(A.$('.hero').textContent), 'a left lesson is offered first');
  T.go('lesson/m.bond5'); ok(A.$('.pl'), 'and it reopens');
  ok(A.D().resume && A.D().resume.seed === 77, 'with the same questions');
  w.__t += 8 * 864e5; ok(A.resumeOf() === null, 'an old place is let go after a week');
  ok(T.errors.length === 0, 'resume raised no errors: ' + T.errors[0]);
}
/* v2: a child's deed is a claim until a person confirms it */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { M, C } = w;
  const id = Object.keys(C.missions).find(k => C.missions[k].skill), m = C.missions[id];
  M.claim(id, m);
  ok(!M.key(m.skill) || !M.key(m.skill).n.observed, 'a claim is not evidence');
  ok(A.D().pending.length === 1, 'it waits for a grown-up');
  M.confirm(id, true);
  ok(M.key(m.skill).n.observed === 1, 'a grown-up’s yes counts as seen in real life');
  ok(M.key(m.skill).okInd === 1, 'and as independent');
  ok(A.D().pending.length === 0, 'the queue clears');
  ok(A.D().led.some(e => e.k === 'observed' && e.by === 'parent'), 'the ledger says who saw it');
  M.claim(id, m); M.confirm(id, false); ok(M.key(m.skill).n.observed === 1, 'a no does not count');
  const before = JSON.stringify(A.D().keys); M.rebuild(); ok(JSON.stringify(A.D().keys) === before, 'still rebuildable from events');
  M.log('m.count5', { k: 'exposure', ok: true }); ok(M.key('m.count5').okInd === 0, 'seeing is not knowing');
}
/* v2: the day fits the parent's limit, and the limit is held */
T = boot({ profiles: [kid(9)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { Plan } = w, p = A.P();
  const big = Plan.build('c1').stops.filter(s => s.t === 'lesson').length;
  p.limit = 10; const small = Plan.build('c1').stops;
  ok(small.filter(s => s.t === 'lesson').length === 1 && big > 1, 'a short limit means fewer new doors, never none');
  ok(small.some(s => s.t === 'hifz'), 'and the Qurʾān stays');
  ok(!Plan.over(), 'not over at the start');
  A.D().screen[A.day()] = 11 * 60000; ok(Plan.over(), 'over the limit is over');
  T.go('rest'); ok(/rest/i.test(A.$('.wel-c').textContent), 'time to rest is said kindly');
  Plan.extend(15); ok(!Plan.over(), 'a grown-up can add time');
  ok(T.errors.length === 0, 'limits raised no errors: ' + T.errors[0]);
}
/* v2: a door refused twice rests, and what it stands on comes back */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { M, C, Plan } = w;
  const first = C.next('math'), s0 = first.id; M.forge(s0); M.log(s0, { k: 'recall', ok: true });
  const sk = C.next('math'); ok(sk.needs.includes(s0), 'the next door builds on the last');
  M.noteNotYet(sk.id); ok(M.stuck().length === 0, 'once is ordinary');
  M.noteNotYet(sk.id); ok(M.stuck().includes(sk.id), 'twice is stuck');
  const pl = Plan.build('c1');
  ok(!pl.stops.some(s => s.t === 'lesson' && s.s === sk.id), 'the stuck door rests today');
  if (C.skill(s0).review) ok(pl.stops.some(s => s.t === 'review' && s.items.includes(s0)), 'and its foundation comes back');
  w.__t += 2 * 864e5; ok(M.stuck().includes(sk.id), 'it stays flagged for the parent');
  M.clearNotYet(sk.id); ok(M.stuck().length === 0, 'passing clears it');
}
/* v2: tracking measures come from the ledger */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { M, Hifz } = w;
  M.log('m.count5', { k: 'recall', ok: true, rv: true }); M.log('m.count5', { k: 'recall', ok: false, rv: true }); M.log('m.count5', { k: 'recall', ok: true, a: true, rv: true });
  const r = M.retention('c1', 30, 'math'); ok(r.of === 3 && r.ok === 1, 'retention counts only unaided recall');
  const u = M.unaided('c1', 14); ok(u.now.ind === 1 && u.now.help === 1, 'alone and helped are told apart');
  ok(M.timeline('m.count5').length === 1, 'evidence is grouped by day');
  Hifz.mark(1, 1, 2, 'self'); ok(Hifz.toHear('c1').includes('1:1'), 'what only the child has checked waits for a listener');
  Hifz.mark(1, 1, 2, 'parent'); ok(!Hifz.toHear('c1').includes('1:1'), 'being heard clears it');
  w.__t += 15 * 864e5; ok(Hifz.toHear('c1').includes('1:1'), 'and it returns in two weeks');
  T.go('hifz'); ok(!/Someone heard me/.test(A.$('.pl').textContent), 'a child cannot claim to have been heard');
}
/* v2: more than one child means asking who, each time */
T = boot({ profiles: [kid(6), kid(9, 'c2')], cur: 'c1' }, '2026-11-05T09:00:00');
ok(T.w.location.hash === '#/who', 'two children: the app asks who is learning');
/* engine: strands weave in, not wait */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { C, M } = w;
  ok(C.next('deen').id === 'd.creator', 'Living Islam begins with who made us');
  M.forge('d.creator'); M.log('d.creator', { k: 'recall', ok: true });
  const n1 = C.next('deen'); ok(C.units[n1.unit].strand, 'the second door is from a strand, not the next of 23 in a row');
  M.forge(n1.id);
  const n2 = C.next('deen'); ok(n2.unit !== n1.unit, 'strands take turns: ' + n2.id);
  ok(C.next('arabic').id === 'a.l1', 'sequential rooms stay in order');
  ok(!C.open(C.skill('m.shapes')), 'the maths strands wait for the numbers under them');
}
/* engine: the shape of the week */
T = boot({ profiles: [kid(9)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { Plan, M, C, Flow } = w; const p = A.P();
  ok(Flow.dayKind(p) === 'school', 'Thursday is a school day');
  const big = Plan.build('c1');
  ok(big.stops.some(s => s.t === 'move') || big.stops.reduce((a, s) => a + Plan.est(s, 2), 0) < 18, 'a long day has somewhere to stand up');
  ok(big.stops.filter(s => s.t === 'move').every(s => Plan.est(s, 2) === 1), 'a move is a minute');
  const firstLesson = big.stops.filter(s => s.t === 'lesson').map(s => C.skill(s.s).room);
  ok(new Set(firstLesson).size === firstLesson.length, 'no room twice in a day');
  p.days = [0, 1, 2, 3, 5, 6]; const rest = Plan.build('c1');
  ok(rest.stops.every(s => s.t === 'hifz' || s.t === 'mission'), 'a rest day holds only the Qurʾān and a deed');
  ok(rest.why.length > 0, 'and says why');
  delete p.days;
  ['m.pv1000', 'a.l1', 'a.l2', 'd.creator', 'd.iman', 'e.pos'].forEach(s => M.forge(s));
  p.light = 4; const light = Plan.build('c1');
  ok(!light.stops.some(s => s.t === 'lesson'), 'the remembering day opens no new doors');
  delete p.light;
}
/* engine: pace follows memory */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { M, Flow, C } = w;
  const base = Flow.pace('c1').news; ok(base === 2, 'Explorers start at two new doors');
  const skills = C.list.filter(s => s.band === 1 && s.review).slice(0, 12).map(s => s.id);
  skills.forEach(s => M.forge(s)); w.__t += 12 * 864e5;
  ok(M.due().length >= 10, 'a long gap brings keys due');
  const low = Flow.pace('c1'); ok(low.news < base, 'review debt means fewer new doors');
  ok(low.why.length > 0, 'and the plan says why');
  const pl = w.Plan.build('c1'); ok(pl.stops[0].t === 'review', 'memory comes first');
  const days = Flow.preview('c1', 7); ok(days.length === 7, 'a week ahead can be seen');
  const seq = days.flatMap(d => d.lessons.map(s => s.id)); ok(new Set(seq).size === seq.length, 'the forecast never repeats a door');
  const f = Flow.forecast('math'); ok(f.total > 10 && f.left <= f.total && f.weeks > 0, 'each room can say how long is left');
  w.M.log('m.count5', { k: 'recall', ok: true, a: true, rv: false });
}
/* milestones and promises */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { M, Flow, C, Plan } = w; const p = A.P();
  p.promises = [{ id: 'p1', what: 'A trip to the park', n: 1, kind: 'unit' }];
  const u = C.units['m-count']; u.skills.forEach(s => M.forge(s.id));
  ok(Flow.unitsReady('c1').includes('m-count'), 'a finished unit is ready for its check');
  ok(Plan.build('c1').stops.some(s => s.t === 'check' && s.unit === 'm-count'), 'the check joins the path');
  A.D().path = null; T.go('home'); const i = Plan.today().stops.findIndex(s => s.t === 'check');
  T.go('stop/' + i); ok(A.$('.pl'), 'the check opens in the player');
  ok(!A.$('.pl-help'), 'with no hints');
  Flow.unitNotYet('m-count'); ok(!Flow.unitsReady('c1').includes('m-count'), 'not yet means a few days to polish');
  Flow.unitDone('m-count');
  ok(Flow.lanterns().some(x => x.id === 'm-count' && x.lit), 'passing lights a lantern');
  ok(p.promises[0].fired, 'and a promise tied to it is earned');
  A.D().path = null; T.go('home'); ok(/park/.test(A.$('.promise').textContent), 'the child hears about it');
  ok(Flow.inbox().some(x => x.kind === 'promise'), 'and the parent is reminded to keep it');
  T.go('keys'); ok(A.$('.lamp.lit'), 'lanterns hang on the key ring');
  ok(T.errors.length === 0, 'milestones raised no errors: ' + T.errors[0]);
}
/* printables: every sheet, at every stage, in both languages */
for (const [age, lang] of [[3, 'en'], [6, 'en'], [9, 'en'], [9, 'ar']]) {
  T = boot({ profiles: [kid(age)], cur: 'c1', lang }, '2026-11-05T09:00:00');
  const { A, w } = T; const { Print, M, C, Flow } = w;
  if (age > 3) ['a.l1', 'a.l2', 'a.l3', 'e.p1', 'e.p1.1', 'm.count5', 'm.count10', 'm.frame', 'm.bond5', 'm.add10', 'd.creator', 'd.iman'].forEach(s => M.forge(s));
  Flow.unitDone('m-bonds');
  let n = 0;
  Print.available('c1').forEach(k => { let r = null; try { r = Print.make(k.id, 'c1', 12345); } catch (e) { ok(false, k.id + ' threw at age ' + age + ': ' + e.message); return; } n++; if (r) { ok(typeof r.html === 'string' && !/undefined|\[object|NaN/.test(r.html.replace(/<svg[\s\S]*?<\/svg>/g, '')), k.id + ' is clean at age ' + age + ' ' + lang); ok(Print.make(k.id, 'c1', 12345).html === r.html, k.id + ' can be reproduced from its seed'); } });
  ok(n >= (age > 3 ? 15 : 5), 'age ' + age + ' has sheets: ' + n);
  ok(T.errors.length === 0, 'printables raised no errors: ' + T.errors[0]);
}
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { Print, M } = w;
  M.forge('m.add10'); M.forge('m.bond10');
  const r = Print.make('practice-math', 'c1', 77); ok(r.q && r.q.length >= 8, 'a practice sheet knows its answers');
  ok(r.q.every(q => /^m\.(add10|bond10)$/.test(q.s)), 'and comes only from what they have been taught');
  Print.keep(r, 'c1'); ok(w.Flow.inbox().some(x => x.kind === 'sheet'), 'a printed sheet waits to be marked');
  T.go('parent'); const q = A.$('.gate p').textContent.split('+').map(x => parseInt(x)); A.$$('.numopt').find(b => +b.dataset.v === q[0] + q[1]).click();
  T.go('parent/c1/mark/' + r.code); ok(A.$$('.mk').length === r.q.length, 'marking shows every answer');
  const before = M.key('m.add10').n.production; Print.mark(r.code, r.q.map((_, i) => i !== 0), 'c1');
  const led = A.D().led.filter(e => e.by === 'parent' && e.k === 'production'); ok(led.length === r.q.length, 'each mark is evidence, and says a person gave it');
  ok(led.filter(e => !e.ok).length === 1, 'and a miss is kept as a miss');
  ok(!w.Flow.inbox().some(x => x.kind === 'sheet'), 'the inbox clears');
  for (const t of ['plan', 'make', 'hear', 'rooms', 'set']) { T.go('parent/c1/' + t); ok(A.$('.tabs'), 'tab ' + t + ' opens'); }
  T.go('parent/c1/sheet/trace-ar'); ok(A.$('.ppz .pp'), 'a sheet previews');
  T.go('parent/media'); ok(A.$('[data-a="m-add"]'), 'the media library opens'); A.acts['m-add'](); ok(A.$$('.ao').length === 5, 'five kinds can be added, photos among them'); A.closeSheet();
  T.go('place/c1/math'); ok(A.$('.pl'), 'finding the level opens');
  {
    const Sync = A.Sync, base = JSON.parse(JSON.stringify(A.S)), M = w.M, mine = JSON.parse(JSON.stringify(A.S)), id = 'c1';
    const ev = (i, sk, t, ok) => ({ i, t, s: sk, k: 'recall', ok, a: false, by: 'child' });
    mine.data[id] = Object.assign({}, mine.data[id], { led: [ev('a', 'm.add10', 1000, true)], keys: { 'm.add10': { forged: 1000, n: {}, e: {} } }, cards: [{ f: 'Q', b: 'A', next: 5 }], papers: [{ r: 'math', t: 1, p: 50 }], work: [{ title: 'E', text: 'old', t: 1 }] });
    const theirs = JSON.parse(JSON.stringify(mine)); theirs.profiles[0].id = 'other'; theirs.data = { other: Object.assign({}, mine.data[id], { led: [ev('a', 'm.add10', 1000, true), ev('b', 'm.add10', 2000, true), ev('c', 'm.count', 3000, true)], keys: { 'm.add10': { forged: 900, n: {}, e: {} }, 'm.count': { forged: 3000, n: {}, e: {} } }, cards: [{ f: 'Q', b: 'A', next: 9 }, { f: 'Q2', b: 'B', next: 1 }], papers: [{ r: 'math', t: 2, p: 80 }], work: [{ title: 'E', text: 'new', t: 2 }] }) };
    Object.assign(mine.data[id], { hifz: { i: 2, a: 5, u: {} }, screen: { day: 15000 }, extra: { day: 5 }, notyet: { 'm.count5': 1 } });
    delete mine.data[id].pending; delete theirs.data.other.pending;
    theirs.data.other.hifz = { i: 3, a: 1, u: {} };
    theirs.media = [{ kind: 'youtube', ref: 'abc' }, { kind: 'image', ref: 'x.jpg' }];
    const r = Sync.merge(mine, theirs), d = r.S.data[id];
    ok(d.hifz.i === 3 && d.hifz.a === 1, 'Quran sync keeps the surah and verse together');
    ok(r.S.profiles.length === mine.profiles.length, 'the same child on two devices stays one child');
    ok(d.led.length === 3, 'histories join without duplicates'); ok(d.keys['m.count'].forged && d.keys['m.add10'].forged === 900, 'mastery from either device is kept');
    ok(r.report[0].lessons === 1, 'and the report says what arrived'); ok(d.cards.length === 2 && d.cards[0].next === 9, 'cards join, the later schedule wins');
    ok(d.papers.length === 2, 'papers from both are kept'); ok(d.work[0].text === 'new' && d.work[0].versions[0].text === 'old', 'the older essay stays as a version');
    ok(r.S.media.length === (mine.media || []).length + 1, 'links travel, files stay');
    ok(Sync.merge(mine, theirs, true).S.media.length === (mine.media || []).length + 2, 'a family file brings its files too');
    const again = Sync.merge(r.S, theirs); ok(again.S.data[id].led.length === 3 && again.report[0].lessons === 0, 'receiving the same file twice changes nothing');
    const nu = JSON.parse(JSON.stringify(theirs)); nu.profiles = [Object.assign({}, nu.profiles[0], { id: 'x9', name: 'Zayd', by: 2015 })]; nu.data = { x9: nu.data.other };
    ok(Sync.merge(mine, nu).S.profiles.length === mine.profiles.length + 1, 'a child this device has not met is added');
    A.S = A.shape(r.S);
    const joined = A.D(id);
    ok(joined.screen.day === 15000 && joined.extra.day === 5 && joined.notyet['m.count5'] === 1, 'reading a merged record without pending work preserves its other fields');
    A.S.pin = '1234'; A.S.gate = { a: 2 }; A.S.upd = { found: {} };
    const family = JSON.parse(Sync.stateOut());
    ok(family.familyFile === 1 && !('pin' in family) && !('gate' in family) && !('upd' in family), 'family files exclude device-local gate and update settings');
    A.S = A.shape(base);
  }
  {
    const C0 = w.C, P0 = w.Player; let bad = [], thin = 0, n = 0;
    Object.keys(C0.skills).forEach(id => { const sk = C0.skills[id]; for (let t = 0; t < 12; t++) { const st = P0.compose(sk, A.rng(t * 13 + 5)); st.forEach(x => { if (x.k === 'pad' && !(x.allKeys ? /^-?\d*\.?\d+(\/\d+)?$/.test(String(x.a)) : (typeof x.a === 'number' && Number.isInteger(x.a) && x.a >= 0))) bad.push(id + ':' + x.eq + '=' + x.a); }); if (sk.review) { const r = sk.review(A.rng(t * 7 + 1)); const q = Array.isArray(r) ? r[0] : r; if (!q || !q.k) bad.push(id + ':review'); } } });
    ok(bad.length === 0, 'every pad answer can be typed on the keys the child is given: ' + bad.slice(0, 6).join(' ; '));
    const noAr = new Set(); Object.keys(C0.skills).forEach(id => { const sk = C0.skills[id]; for (let t = 0; t < 12; t++) { const look = x => { if (x && (x.k === 'pad' || x.k === 'expr') && x.eq != null) { const k = A.eqKind(x.eq); if (k.needsRow && !A.eqRows[A.eqKey(k.eq)]) noAr.add(A.eqKey(k.eq)); } }; P0.compose(sk, A.rng(t * 31 + 7)).forEach(look); if (sk.review) { const q = sk.review(A.rng(t * 17 + 3)); (Array.isArray(q) ? q : [q]).forEach(look); } } });
    ok(noAr.size === 0, 'every worded problem has Arabic: ' + noAr.size + ' ' + [...noAr].slice(0, 12).join(' | '));
    const shallow = []; Object.keys(C0.skills).forEach(id => { const sk = C0.skills[id]; const u = Object.values(C0.units).find(x => x.skills.includes(sk)); if (!u || u.y < 8 || id.startsWith('a') || id.startsWith('m') || id.startsWith('d1') && false) return; const seen = new Set(); for (let t = 0; t < 4; t++) P0.compose(sk, A.rng(1000 + t * 77)).forEach(x => { if (x.ph === 'solo' || x.ph === 'make') seen.add(JSON.stringify([x.p, x.eq, x.a, x.o && x.o.map(o => o.t)])); }); if (seen.size <= 1) shallow.push(id); });
    ok(shallow.length <= 8, 'from Year 8 a lesson asks more than one question: ' + shallow.length + ' ' + shallow.slice(0, 12).join(','));
  }
  {
    const P0 = w.Player, S0 = A.S, host = A.$('body').ownerDocument.createElement('div'); let got = null;
    const mk = () => ({ k: 'choice', p: ['Q', 'Q'], ph: 'solo', skill: 'm.add10', o: [{ t: ['R', 'R'], ok: true }, { t: ['W', 'W'], ok: false }], shuffle: false });
    const sv = S0.profiles[0].by; S0.profiles[0].by = year - 13; host.id = 'hx'; A.$('body').appendChild(host);
    P0.start(host, { steps: [mk(), mk()], mode: 'review', exam: true, rng: A.rng(1), onDone: r => { got = r; } });
    const opt = t => A.$$('.opt', host).find(b => b.textContent.trim() === t);
    opt('W').click(); ok(P0.cur() && P0.cur().p, 'an exam accepts the answer');
    ok(!got, 'and carries on');
    S0.profiles[0].by = sv; P0.stop(); host.remove();
    const K = M0 => M0.blank(); const k1 = K(w.M); w.M.apply(k1, { t: 1, k: 'forge', ok: true }); const D1 = 864e5; [1, 2, 3].forEach(n => w.M.apply(k1, { t: n * D1 * 2, k: 'recognition', ok: true, a: false })); ok(k1.proven, 'proven is reachable by recalling on separate later days');
  }
  ok(T.errors.length === 0, 'parent tools raised no errors: ' + T.errors[0]);
}
/* media: links, the right moment, and no way to mistake watching for knowing */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { Media, Player, C, M } = w;
  const id = 'dQw4w9WgXcQ';
  for (const u of ['https://www.youtube.com/watch?v=' + id, 'https://youtu.be/' + id, 'youtu.be/' + id + '?t=90', 'https://m.youtube.com/watch?v=' + id + '&t=1m30s', 'https://www.youtube.com/shorts/' + id, 'https://www.youtube.com/embed/' + id]) { const r = Media.parse(u); ok(r && r.ref === id, 'understands ' + u); }
  ok(Media.parse('youtu.be/' + id + '?t=90').start === 90, 'keeps the start time');
  for (const u of ['https://evil.example/watch?v=' + id, 'not a link', 'https://www.youtube.com/@channel', '']) ok(!Media.parse(u), 'refuses ' + u);
  const later = Media.add({ kind: 'youtube', ref: id, title: 'Later', when: 'before', ages: [1], attach: { type: 'skill', id: 'm.add20' } });
  ok(!Media.visible(later), 'a lesson’s video waits for its door to open');
  const now = Media.add({ kind: 'youtube', ref: id, title: 'Now', when: 'before', ages: [1], attach: { type: 'skill', id: 'm.count5' } });
  ok(Media.visible(now), 'an open lesson’s video can show');
  const steps = Player.compose(C.skill('m.count5'), A.rng(1));
  ok(steps[0].k === 'watch' && steps[0].media === now.id, 'it comes where the parent put it');
  const shelf = Media.add({ kind: 'youtube', ref: id, title: 'Shelf', when: 'shelf', ages: [2], attach: { type: 'room', id: 'math' } });
  ok(!Media.shelf('math').length, 'not for this child’s stage: not shown');
  shelf.ages = [1]; ok(Media.shelf('math').length === 1, 'for their stage: on the shelf');
  T.go('room/math'); ok(A.$('.shelf-i'), 'the room shows it');
  T.go('watch/' + shelf.id); ok(A.$('iframe') && /youtube-nocookie/.test(A.$('iframe').src), 'it plays privately');
  ok(/sandbox/.test(A.$('iframe').outerHTML), 'in a sandbox with no way out');
  Media.watched(now); ok(!(M.key('m.count5') || { okInd: 0 }).okInd, 'watching is never knowing');
  Media.remove(now.id); ok(!Media.get(now.id), 'a parent can remove it');
  ok(T.errors.length === 0, 'media raised no errors: ' + T.errors[0]);
}
/* tightening */
T = boot({ profiles: [kid(6)], cur: 'c1' }, '2026-11-05T09:00:00');
{
  const { A, w } = T; const { Hifz, Plan, C, M } = w;
  Hifz.markKnown(114); ok(Hifz.known(114).n === Hifz.known(114).of, 'a sūrah learned earlier can be marked known');
  ok((Hifz.state().finished || []).includes(114), 'and is finished');
  w.__t += 40 * 864e5; ok(Hifz.today().manzil.length > 0, 'and joins the long revision cycle');
  const pl = Plan.today(); const les = pl.stops.find(s => s.t === 'lesson');
  ok(Plan.completeSkill(les.s) && les.done, 'a lesson done from its room counts on the path');
}

/* ---------- ages 12 to 18 ---------- */
for (const age of [13, 16]) {
  const T2 = boot({ profiles: [kid(age, 't')], cur: 't' }, '2026-11-05T09:00:00'); const { A, w } = T2, { C, Plan, M, Flow, I } = w;
  ok(A.stage() === (age < 15 ? 3 : 4), age + ': stage from age');
  ok(Flow.yearOf(A.P()) === age - 4, age + ': year from age');
  const m = C.next('math'); ok(m && m.y >= age - 6, age + ': starts near their own year, not at counting');
  ok(C.next('computing') && C.next('engineering') && C.next('life'), age + ': the older rooms are open');
  const pl = Plan.build('t'); ok(pl.stops.some(x => x.t === 'lesson'), age + ': a day has lessons');
  for (const r of ['home', 'rooms', 'room/math', 'room/engineering', 'room/computing', 'keys', 'study', 'flash', 'write', 'marking', 'parent/set']) { T2.go(r); ok(T2.errors.length === 0, age + ': ' + r + ' renders ' + (T2.errors[0] || '').slice(0, 100)); }
  T2.go('home'); ok(A.$('.ti') && !A.$('#sky'), age + ': a clean list, not the courtyard');
  ok(w.document.body.dataset.age === String(A.stage()), age + ': the page knows its age');
  /* flashcards widen their gap */
  A.D().cards = [{ f: 'q', b: 'a', next: 0, gap: 0 }]; T2.go('flash'); A.$('[data-a="t-flip"]').click(); const g = A.$('[data-a="t-grade"][data-g="2"]'); ok(!!g, age + ': a card can be graded'); A.acts['t-grade'](g); ok(A.D().cards[0].gap >= 1 && A.D().cards[0].next > w.__t, age + ': a known card comes back later');
  /* typed maths */
  const host = w.document.createElement('div'); w.document.body.appendChild(host); let oks = 0, bads = 0;
  const typed = (keys, a) => { I.expr({ el: host, step: { k: 'expr', eq: 'x', a }, ok: () => oks++, bad: () => bads++ }); keys.forEach(k => host.querySelector('[data-k="' + k + '"]').click()); host.querySelector('[data-k="ok"]').click(); };
  typed(['-', '8'], -8); typed(['1', '/', '2'], '2/4'); typed(['0', '.', '5'], '1/2'); typed(['3'], 4);
  ok(oks === 3 && bads === 1, age + ': typed answers accept equal values and refuse wrong ones');
  /* written work is the student's, and is checked honestly */
  let wOk = 0; I.write({ el: host, step: { p: ['Q', 'س'], min: 3, check: [['a', 'أ'], ['b', 'ب']] }, ok: () => wOk++, bad: () => { } });
  host.querySelector('#i-w').value = 'one two three four'; host.querySelector('#i-w-go').click(); host.querySelector('.wcheck').click(); host.querySelector('#i-w-end').click();
  ok(wOk === 1 && A.D().work.length === 1, age + ': written work is kept');
  A.D().work[0].shared = true; T2.go('marking');
  ok(A.$('.gate') && !A.$('[data-mark]'), age + ': shared work is behind the parent gate');
  const sum = A.$('#gp-q').textContent.split('+').map(x => parseInt(x));
  A.$$('.numopt').find(b => +b.dataset.v === sum[0] + sum[1]).click();
  ok(A.route() === 'marking' && A.$('#app').textContent.includes('one two three'), age + ': unlocking opens the requested marking page');
  function mark(text) { const input = A.$('[data-mark]'); input.value = text; input.dispatchEvent(new w.Event('change')); }
  mark('Parent feedback');
  ok(A.D().work[0].mark === 'Parent feedback', age + ': the unlocked parent can save feedback');
  A.D().work[0].shared = false; A.rerender();
  ok(!A.$('[data-mark]') && !A.$('#app').textContent.includes('one two three'), age + ': unshared work stays private even after unlock');
  T2.go('home'); T2.go('marking');
  ok(A.$('.gate'), age + ': returning to the learner screen relocks marking');
  A.D().work[0].shared = true;
  const sum2 = A.$('#gp-q').textContent.split('+').map(x => parseInt(x));
  A.$$('.numopt').find(b => +b.dataset.v === sum2[0] + sum2[1]).click();
  w.__t += 21 * 60000; mark('Expired feedback');
  ok(A.$('.gate') && A.D().work[0].mark === 'Parent feedback', age + ': feedback cannot change after the parent session expires');
  ok(C.skill('d10.evolution').sup && C.skill('d10.palestine').sup && C.skill('d10.puberty').sup, age + ': sensitive lessons are supervised');
  ok(T2.errors.length === 0, age + ': no errors ' + (T2.errors[0] || '').slice(0, 120));
}
{ /* a resume retains missed attempts and final scores across exits */
  const { A, w } = boot({ profiles: [kid(13)], cur: 'c1' }, '2026-11-05T09:00:00');
  const host = w.document.createElement('div');
  let ctx, result;
  w.I.resumeProbe = c => { ctx = c; };
  const options = { track: { skill: 'm.count5', seed: 7 }, steps: [{ k: 'resumeProbe', ph: 'solo', silent: true }], onDone: r => { result = r; } };
  w.Player.start(host, options); ctx.bad();
  w.Player.stop(); w.Player.start(host, { ...options, at: A.D().resume });
  ok(A.D().resume?.tries === 1, 'resuming the first question keeps a miss');
  ctx.bad(); ctx.bad(); w.Player.stop();
  w.Player.start(host, { ...options, at: A.D().resume });
  ok(result?.solo === 1 && result.soloOk === 0 && !A.D().resume, 'resuming after the final reveal finishes with the miss');
}
{ /* a switch of learner flushes the draft to its original owner */
  const { A, go } = boot({ profiles: [kid(13, 'first'), kid(14, 'second')], cur: 'first', data: {
    first: { work: [{ title: 'First', text: '', plan: '' }] }, second: { work: [{ title: 'Second', text: 'Keep me', plan: '' }] }
  } }, '2026-11-05T09:00:00');
  go('write/0'); A.$('#t-w-b').value = 'First learner draft';
  A.S.cur = 'second'; go('home');
  ok(A.D('first').work[0].text === 'First learner draft' && A.D('second').work[0].text === 'Keep me', 'changing learner keeps both drafts with their owners');
}
{ /* an abandoned group attempt cannot restart the same questions for a new score */
  const { A, go } = boot({ profiles: [kid(13, 'first'), kid(14, 'second')], cur: 'first' }, '2026-11-05T09:00:00');
  A.Group.keep({ seed: 7, room: 'math', y: 6, n: 3 });
  go('challenge/7'); ok(A.$('#t-ch .pl') && A.S.challenges[0].res.first?.incomplete, 'a group attempt is saved before the first question');
  go('home'); go('challenge/7');
  ok(!A.$('#t-ch .pl') && A.$('#t-ch').textContent.includes('Attempt ended early'), 'a group attempt stays incomplete after leaving');
  A.S.cur = 'second'; go('challenge/7');
  ok(A.$('#t-ch .pl'), 'another learner can still take the same challenge');
}
{ /* the door and rooms for a young child are untouched */
  const T3 = boot({ profiles: [kid(6, 'y')], cur: 'y' }, '2026-11-05T09:00:00'); const { A, w } = T3;
  T3.go('rooms'); const t = A.$('#app').textContent; ok(!t.includes('Life and Future'), 'a six-year-old does not see the room for older students');
  ok(w.Flow.yearOf(A.P()) === 2 && !A.$('.ti.tl'), 'a young child keeps the rooms design');
}

/* ---------- placement, calm, lab, tracking, exams, controls ---------- */
const await_ui = (ww) => { ww.__tidyNow && ww.__tidyNow(); };
const unlock = (TT) => { TT.go('parent'); const qq = TT.A.$('.gate p').textContent.split('+').map(x => parseInt(x)); TT.A.$$('.numopt').find(b => +b.dataset.v === qq[0] + qq[1]).click(); };
{
  const T4 = boot({ profiles: [kid(11, 'e')], cur: 'e' }, '2026-11-05T09:00:00'); const { A, w } = T4, { C, M, Flow, Plan } = w;
  ok(A.S.sound === false && A.motion() === 'calm', 'quiet and calm by default');
  ok(C.next('arabic').id === 'a.old1', 'an eleven-year-old new to Arabic takes the older road, not the first letters');
  A.P().arabic = 'reads'; const a11 = C.next('arabic'); ok(a11 && a11.y >= 5 && a11.id !== 'a.l1', 'an eleven-year-old who reads starts near their year');
  const d11 = C.next('deen'); ok(d11 && (d11.y >= 5 || C.units['d-worship'].skills.indexOf(d11) >= 0), 'Living Islam starts at their age, keeping the prayer basics');
  A.P().start = { math: 3 }; ok(C.next('math').y <= 4, 'a parent can move a subject’s starting year');  A.P().start = {};
  ok(C.SIMS.length >= 40 && C.SIMS.every(s => s.skills.some(k => C.skills[k])), 'every simulation joins at least one lesson');
  const withSim = C.skills['m8.pyth']; ok((typeof withSim.meet === 'function' ? withSim.meet(A.rng(1)) : withSim.meet).some(x => x.k === 'sim'), 'a lesson opens its simulation');
  ok(C.USEDBY['m8.ratio'] && C.skills['c9.moles'].uses.length > 0, 'subjects are linked');
  unlock(T4);
  T4.go('parent/e/log'); ok(A.$('details.logu'), 'parents see every lesson tracked');
  T4.go('parent/e/set'); ok(A.$('[data-c-start="math"]') && A.$('[data-k="arabic"]'), 'parents can set the start per subject');
  T4.go('parent/settings'); ok(A.$('#c-pin') && A.$('[data-k="motion"]'), 'settings hold motion and the PIN');
  for (const r of ['lab', 'lab/triangle', 'rooms', 'room/arabic', 'keys', 'parent/e/log', 'parent/e/set', 'parent/settings', 'parent/media']) { T4.go(r); ok(T4.errors.length === 0, r + ' renders ' + (T4.errors[0] || '').slice(0, 120)); }
  /* a year exam opens when most of a year is mastered, and its certificate follows a real score */
  const y = 6, sk = C.rooms.math.units.filter(u => u.y === y && u.band <= 2).flatMap(u => u.skills);
  ok(!A.examOffer('math', y, 'e'), 'no exam before the work is done');
  sk.forEach(s => M.forge(s.id)); ok(!!A.examOffer('math', y, 'e'), 'the year exam opens');
  T4.go('exam/math/' + y); ok(A.$('#t-exam') && T4.errors.length === 0, 'the exam starts ' + (T4.errors[0] || '').slice(0, 100));
  /* tracking and root cause */
  ok(Flow.rootCause('c9.moles', 'e') && Flow.rootCause('c9.moles', 'e').skill.id === 'm8.ratio', 'stuck in chemistry can trace to maths');
  /* PIN */
  
  ok(T4.errors.length === 0, 'no errors ' + (T4.errors[0] || '').slice(0, 120));
}

/* ---------- only real voices; parents' simulations ---------- */
{
  const T5 = boot({ profiles: [kid(6, 'v')], cur: 'v' }, '2026-11-05T09:00:00'); const { A, w } = T5, { Voice, Media } = w;
  let spoke = 0; w.speechSynthesis = { speak() { spoke++; }, cancel() { } }; w.SpeechSynthesisUtterance = function () { };
  w.AndroidBridge = undefined; const cu = {}; Voice.say('zzzqqq', { lang: 'en' }); ok(spoke === 0, 'no synthetic voice is ever used');
  ok(!Voice.can('zzzqqq') && !Voice.real('zzzqqq'), 'a word with no recording stays silent');
  w.SPEECH.sunword = 7; ok(Voice.real('Sunword.') === 'audio/s/7.ogg', 'a real recording is found for a word');
  const q = { k: 'choice', p: ['Which word do you hear?', 'أي كلمة تسمع؟'], listen: function () { Voice.say('zzzqqq', { lang: 'en' }); }, o: [] }, ad = Voice.adapt(q);
  ok(!ad.listen && ad.gu === 'zzzqqq' && /grown-up/i.test(ad.p[0]), 'with nothing real to hear, a grown-up becomes the voice');
  const q2 = { k: 'choice', p: ['What does it mean?', 'ما معناها؟'], listen: function () { Voice.say('zzzqqq', { lang: 'en' }); }, o: [] }, ad2 = Voice.adapt(q2);
  ok(!ad2.listen && !ad2.gu, 'an optional listen button simply goes away');
  const q3 = { k: 'choice', p: ['Which word do you hear?', 'x'], listen: function () { Voice.say('sunword', { lang: 'en' }); }, o: [] }; ok(Voice.adapt(q3) === q3, 'a real recording keeps the question as it is');
  unlock(T5);
  const m = Media.add({ kind: 'html', ref: 'x.html', title: 'Mine', ages: [1, 2, 3, 4], attach: { type: 'room', id: 'math' } });
  T5.go('parent/media'); ok(A.$('.mi[data-id="' + m.id + '"]'), 'a simulation sits in the library');
  T5.go('lab/h-' + m.id); ok(A.$('.simstage iframe') && A.$('.simstage iframe').getAttribute('sandbox') === 'allow-scripts', 'it plays full screen, sandboxed');
  T5.go('watch/' + m.id); ok(w.location.hash.includes('lab/h-'), 'from a subject shelf it opens the same player');
  unlock(T5); T5.go('parent/media'); A.acts['m-edit'](A.$('.mi[data-id="' + m.id + '"]')); ok(A.$('a#e-p[href="#/lab/h-' + m.id + '"]') && A.$('#e-t'), 'its sheet plays and renames it'); A.$('#e-d').onclick.call(A.$('#e-d')); ok(Media.get(m.id), 'delete asks twice'); A.$('#e-d').onclick.call(A.$('#e-d')); ok(!Media.get(m.id), 'and then it is gone');
  { const T7 = boot({ profiles: [kid(13, 'u')], cur: 'u' }, '2026-11-05T09:00:00'); const A7 = T7.A, w7 = T7.w; unlock(T7); T7.go('parent/u/set');
    await_ui(w7); const ns = A7.$$('select').filter(x => x.style.display !== 'none'); ok(ns.length === 0 && A7.$$('.pk').length > 3, 'no native select is ever shown');
    const sl = A7.$('select[data-c-start="math"]'); sl.closest('.card').classList.remove('shut'); sl.nextSibling.click(); ok(w7.document.querySelector('.sheet .pk-row'), 'choosing opens our own list');
    const pick = [...w7.document.querySelectorAll('.sheet .pk-row')][2]; pick.click(); ok(sl.value !== '' && A7.profile('u').start.math === +sl.value, 'and choosing still saves');
    ok(A7.$$('.tabs a.tab').filter(t => t.style.display !== 'none').length <= 4 && A7.$$('.tabs button.tab').length === 1, 'parent tabs: four and More');
    T7.go('study'); await_ui(w7); ok(!A7.$$('input[type=date]').some(x => x.style.display !== 'none'), 'no native date field');
    T7.go('parent/u/plan'); await_ui(w7); ok(T7.errors.length === 0, 'tidy runs clean ' + (T7.errors[0] || '').slice(0, 100)); }
  ok(T5.errors.length === 0, 'no errors ' + (T5.errors[0] || '').slice(0, 120));
}
(async () => {
  const { A, go, w } = boot({ profiles: [kid(13, 'g')], cur: 'g', pin: '1234' }, '2026-11-05T09:00:00');
  async function navigate(route) { go(route); await new Promise(resolve => w.setTimeout(resolve, 0)); }
  await navigate('parent'); ok(A.$('#gp-pin') && !A.$('.numopt'), 'a PIN replaces the sum at the gate');
  async function submit(value) { A.$('#gp-pin').value = value; await A.$('#gp-go').onclick(); }
  for (let i = 0; i < 5; i++) await submit('0000');
  await submit('1234'); ok(A.$('#gp-pin') && A.S.gate.until > w.Date.now(), 'too many wrong PINs temporarily lock the gate');
  w.__t += 31000; await submit('1234');
  const recovery = A.$('#gp-recovery-code')?.textContent;
  ok(!A.$('#gp-pin') && A.S.pin.startsWith('v1$') && !!recovery, 'the correct legacy PIN migrates and shows a recovery code');
  ok(!JSON.stringify(A.Sync.recordOut()).includes(A.S.pin), 'a backup export omits the device PIN record');
  A.closeSheet(); await navigate('home'); await navigate('parent'); await submit('1234');
  ok(!A.$('#gp-pin'), 'the same PIN opens the gate after migration');
  await navigate('home'); await navigate('parent'); A.$('#gp-recover').click(); await submit('0'.repeat(32));
  ok(!!A.$('#gp-pin'), 'an incorrect recovery code leaves the PIN set');
  await submit(recovery);
  ok(!A.$('#gp-pin') && A.S.pin === '' && A.S.profiles[0].id === 'g', 'recovery clears the PIN and preserves learning profiles');
  await navigate('parent/settings'); A.$('#c-pin').value = '5678'; await A.pinSet(A.$('#c-pin'));
  ok(A.S.pin.startsWith('v1$') && !!A.$('#gp-recovery-code'), 'setting a new PIN stores a verifier and shows recovery');
  A.closeSheet();
  const savedPin = A.S.pin;
  A.$('#c-pin').value = ''; await A.pinSet(A.$('#c-pin'));
  ok(A.S.pin === savedPin, 'clicking Save on a blank PIN field keeps the existing PIN');
  const clearBtn = A.$('[data-a="c-pin-clear"]');
  ok(!!clearBtn, 'settings shows an explicit Remove PIN button when a PIN is set');
  A.acts['c-pin-clear'](clearBtn); ok(A.S.pin === savedPin, 'removing PIN asks for a second tap');
  A.acts['c-pin-clear'](clearBtn); ok(A.S.pin === '', 'second tap removes the PIN');

  /* essay draft flush survives automatic LAN sync replacing A.S */
  A.D('g').work = [{ title: 'Reflection', text: 'Initial', plan: 'Plan A', t: w.__t - 10000 }];
  await navigate('write/0');
  A.$('#t-w-b').value = 'Freshly typed unsaved paragraph';
  A.$('#t-w-b').oninput();
  w.__t += 1000;
  w.__native.onLanSynced(true, JSON.stringify({ profiles: A.S.profiles, data: { g: { work: [{ title: 'Reflection', text: 'Initial', plan: 'Plan A', t: w.__t - 5000 }] } } }), 'HomePC', 0, 0, true);
  ok(A.D('g').work[0].text === 'Freshly typed unsaved paragraph', 'LAN sync flushes and preserves an active essay draft');

  /* hifz merge preserves a newer lapse rather than reviving stale half-life */
  const hA = { profiles: A.S.profiles, data: { g: { hifz: { u: { '112:1': { t: 1000, h: 10, last: 2000, lapse: 0, n: 3 } }, i: 0, a: 1, log: [], finished: [] } } } };
  const hB = { profiles: A.S.profiles, data: { g: { hifz: { u: { '112:1': { t: 1000, h: 4, last: 3000, lapse: 1, n: 4 } }, i: 0, a: 1, log: [], finished: [] } } } };
  const mAB = A.Sync.merge(hA, hB, false).S.data.g.hifz.u['112:1'];
  const mBA = A.Sync.merge(hB, hA, false).S.data.g.hifz.u['112:1'];
  ok(mAB.h === 4 && mAB.last === 3000 && mBA.h === 4 && mBA.last === 3000 && mAB.lapse === 1, 'hifz merge keeps newer lapse half-life paired with last review');

  /* transferred courses register immediately after merge, do not duplicate, and clear on backup restore */
  const bookPayload = { profiles: A.S.profiles, data: {}, books: [{ id: 'tr1', name: 'Transferred Book', room: 'arabic', kind: 'lang', y: 3, lessons: [{ n: 1, title: 'L1', words: [['قلم', 'pen']], grammar: [], sents: [], qs: [] }] }] };
  w.__native.onLanSynced(true, JSON.stringify(bookPayload), 'HomePC', 0, 0, true);
  ok(!!w.C.units['bk-tr1'] && !!w.C.skills['bk.tr1.1'], 'transferred course lessons are usable immediately after sync');
  w.__native.onLanSynced(true, JSON.stringify(bookPayload), 'HomePC', 0, 0, true);
  ok(w.C.rooms.arabic.units.filter(u => u.id === 'bk-tr1').length === 1, 'repeated course merge does not duplicate units');
  await navigate('parent'); const qSum = A.$('.gate p').textContent.split('+').map(x => parseInt(x)); A.$$('.numopt').find(b => +b.dataset.v === qSum[0] + qSum[1]).click();
  A.__syncIn = false;
  w.__native.onImport(JSON.stringify({ profiles: A.S.profiles, data: {}, books: [] }));
  ok(!w.C.units['bk-tr1'] && !w.C.skills['bk.tr1.1'], 'restoring an older backup removes stale course units');

  /* parent tHear distinguishes playable child recording vs missing audio without changing revision dates */
  A.D('g').recs = { '112:1': w.__t, '112:2': w.__t - 1000 };
  w.Hifz.mark(112, 1, 2, 'self', 'g');
  const prevHeard = w.Hifz.state('g').u['112:1'].heard;
  const voiceKeys = ['rec_g_112_1'];
  w.AndroidBridge = { voiceList: () => JSON.stringify(voiceKeys), speakLangs: () => 'ar' };
  await navigate('parent/g/hear');
  ok(!!A.$('[data-a="play-rec"][data-k="rec_g_112_1"]'), 'parent Qurʾān tab plays an available child recording');
  ok(!!A.$('.hear-na'), 'parent Qurʾān tab honestly flags a missing recording on this device');
  ok(!!A.$('[data-play-a="112:1"]'), 'parent Qurʾān tab keeps a labelled reference reciter button');
  ok(w.Hifz.state('g').u['112:1'].heard === prevHeard, 'showing recordings does not alter heard or revision dates');

  /* family card direct parent actions across siblings, respecting teen privacy and PIN gate */
  A.S.profiles.push(kid(9, 's2'));
  voiceKeys.push('rec_phone_112_1', 'rec_s2_112_1');
  const androidLearner = {...A.profile('g'), id: 'phone'};
  const clip = {profiles: [androidLearner], data: {phone: {recs: {'112:1': w.__t - 1}}}};
  let result = A.Sync.merge(A.S, clip, true).S.data.g;
  ok(result.recs['112:1'] === w.__t && !result.recSources?.['112:1'], 'an older transfer cannot displace the local recording');
  clip.data.phone.recs['112:1'] = w.__t;
  result = A.Sync.merge(A.S, clip, true).S.data.g;
  ok(result.recSources['112:1'].ids.join() === 'g,phone', 'ties keep both usable sources for the same recording time');
  clip.data.phone.recs['112:1'] = w.__t + 500;
  clip.data.phone.recSources = {'112:1': {t:w.__t, ids:['s2']}};
  w.__native.onLanSynced(true, JSON.stringify(clip), 'HomePC', 1, 0, true);
  await navigate('parent/g/hear');
  const transferred = A.$('[data-a="play-rec"][data-k="rec_phone_112_1"]');
  ok(!!transferred && !A.$('[data-k="rec_g_112_1"]') && !A.$('[data-k="rec_s2_112_1"]'),
    'a newer transferred clip wins over the local clip and is isolated from the sibling');
  const revision = JSON.stringify(w.Hifz.state('g')), play = w.Voice.play, played = [];
  w.Voice.play = url => { played.push(url); return Promise.resolve(true); };
  if (transferred) { transferred.click(); transferred.click(); }
  w.Voice.play = play;
  ok(played.join() === 'voice/rec_phone_112_1.m4a,voice/rec_phone_112_1.m4a' &&
    JSON.stringify(w.Hifz.state('g')) === revision, 'playing the transferred clip twice does not grade it');
  await navigate('parent/g/record');
  ok(!!A.$('[data-a="play-rec"][data-k="rec_phone_112_1"]'), 'the learner Record also resolves the transferred clip');
  A.__syncIn = true;
  w.__native.onImport(JSON.stringify(clip), true, true);
  A.closeSheet();
  ok(A.D('g').recSources['112:1'].ids.join() === 'phone', 'family-file import keeps the current source and rejects stale provenance');
  voiceKeys.splice(voiceKeys.indexOf('rec_phone_112_1'), 1);
  await navigate('parent/g/hear');
  ok(!A.$('[data-a="play-rec"]') && !!A.$('.hear-na'), 'missing newer clip does not play the older local clip');
  const roundTrip = A.Sync.merge({profiles: [{...A.profile('g'), id: 'third'}], data: {}}, A.S, true);
  ok(roundTrip.S.data.third.recSources['112:1'].ids.join() === 'phone' &&
    roundTrip.S.data.third.recSources['112:1'].t === w.__t + 500, 'a second transfer retains the source and recording time');
  A.D('g').recSources['112:1'] = {t:w.__t + 500, ids:['s2']};
  ok(!w.Voice.savedRecKey('g',112,1), 'a stored source cannot resolve to another active learner’s clip');
  const rSh = w.Print.make('practice-math', 's2', 1234);
  const sh1 = w.Print.toScreen(rSh, 's2'); sh1.sub = w.__t;
  await navigate('parent');
  ok(!!A.$('.fc-act[href="#/parent/s2/mark/' + sh1.id + '"]'), 'family card links directly to marking a submitted sheet');
  ok(!!A.$('.fc-act[href="#/parent/g/hear"]'), 'family card links directly to listening when recordings wait');
  A.D('g').recs = {};
  A.D('g').work = [{ title: 'Private note', text: 'Only mine', plan: '', t: w.__t, shared: false }];
  await navigate('parent');
  ok(!A.$('.fc-act[href="#/marking/g"]'), 'private teen work does not trigger a parent action');
  A.D('g').work[0].shared = true;
  A.S.profiles.push({...kid(15, 's3'), name: 'Second teen'});
  A.D('s3').work = [{title: 'Other teen work', text: 'Shared work', shared: true},
    {title: 'Private work', text: 'Unshared draft', shared: false}];
  await navigate('parent');
  ok(!!A.$('.fc-act[href="#/marking/g"]') && !!A.$('.fc-act[href="#/marking/s3"]'), 'each teen has their own Review shared work link');
  ok(A.$$('.fc-go[data-a="fam-go"]').length === 3, 'Next button stays separate for handing the device to each child');
  await navigate('marking/s3');
  ok(!!A.$('[data-mark="s3:0"]') && !A.$('[data-mark="g:0"]') && !A.$('[data-mark="s3:1"]'),
    'a scoped review shows only the selected teen’s shared work');
  const feedback = A.$('[data-mark="s3:0"]');
  feedback.value = 'Checked';
  feedback.dispatchEvent(new w.Event('change'));
  await navigate('parent');
  ok(!A.$('.fc-act[href="#/marking/s3"]') && !!A.$('.fc-act[href="#/marking/g"]'), 'review clears the selected teen’s action only');
  A.S.pin = '9999';
  await navigate('home'); await navigate('marking/s3');
  ok(!!A.$('#gp-pin') && !A.$('[data-mark]'), 'parent PIN gate also blocks a direct review link');
  await submit('9999');
  ok(A.route() === 'marking/s3' && !!A.$('[data-mark="s3:0"]'), 'PIN unlock stays on the requested learner review');
  await navigate('marking/s2');
  ok(A.route() === 'parent' && !A.$('[data-mark]'), 'an under-age review link returns to Family');
  A.S.pin = '';
  await navigate('home'); await navigate('parent');
  const qSum2 = A.$('.gate p').textContent.split('+').map(x => parseInt(x));
  A.$$('.numopt').find(b => +b.dataset.v === qSum2[0] + qSum2[1]).click();

  /* learner My sheets reopens reviewed sheets after seenMark and finds a 4th assigned sheet */
  A.S.cur = 's2';
  sh1.marked = w.__t; sh1.right = sh1.q.length; sh1.seenMark = w.__t;
  const assigned = [];
  for (let i = 0; i < 4; i++) { const rs = w.Print.make('practice-math', 's2', 2000 + i); assigned.push(w.Print.toScreen(rs, 's2')); }
  await navigate('home');
  ok(!!A.$('.ink-all[href="#/sheets"]'), 'learner Home links to My sheets');
  await navigate('sheets');
  ok(!!A.$('a[href="#/sheet/' + assigned[0].id + '/list"]'), 'My sheets reaches a 4th assigned sheet');
  ok(!!A.$('a[href="#/sheet/' + sh1.id + '/list"]'), 'My sheets reopens a reviewed sheet even after seenMark cleared Home');
  await navigate('sheet/' + sh1.id + '/list');
  ok(A.$('.ink-back')?.getAttribute('href') === '#/sheets' && !A.$('.ink.edit'), 'opening a reviewed sheet from My sheets is read-only and returns to My sheets');
  ok(!!A.$('#ink-print'), 'read-only finished sheet offers Print / PDF export');

  /* Ink.renderHtml overlays child ink, parent red marks, and marked score for A4 portfolio PDF, safely DOM-built */
  sh1.ink = { 0: [{ c: 'k', w: 2.4, p: [100, 200, 140, 220, 180, 210] }, { c: 'k', w: 2, p: ['0" onload="alert(1)', 10] }] };
  sh1.mk = { 0: [{ c: 'r', w: 3, p: [200, 200, 240, 240] }] };
  const portfolioHtml = w.Ink.renderHtml(sh1, 's2');
  ok(!!portfolioHtml && portfolioHtml.includes('ink-over') && portfolioHtml.includes('viewBox="0 0 1000 1414.3"') && !portfolioHtml.includes('inset:11mm') && !portfolioHtml.includes('onload') && portfolioHtml.includes('#d0342c') && portfolioHtml.includes('#1d1a16') && portfolioHtml.includes(sh1.right + ' / ' + sh1.q.length), 'Ink.renderHtml safely bakes full-page ink, red marks and score without markup injection');

  /* Print.renderSheet preserves original stored questions, sanitizes sh.q[].h, pins date & dir */
  const origQ0 = sh1.q[0].h;
  sh1.q[0].h = origQ0 + '<img src=x onerror="alert(1)"><script>bad()</script>';
  w.C.rooms.math.units.slice(0, 3).forEach(u => u.skills.forEach(sk => w.M.forge(sk.id, 's2')));
  A.S.lang = 'ar';
  const replayed = w.Print.renderSheet(sh1, 's2');
  A.S.lang = 'en';
  ok(!!replayed && replayed.html.includes('dir="ltr"') && !replayed.html.includes('onerror') && !replayed.html.includes('<script'), 'Print.renderSheet sanitizes stored sh.q[].h and preserves original ltr/rtl dir');
  const pcRes = w.Print.make('week', 's2', 555);
  const pcSh = w.Print.toScreen(pcRes, 's2');
  const day1Html = w.Print.renderSheet(pcSh, 's2').html;
  w.__t += 2 * 864e5;
  const day3Html = w.Print.renderSheet(pcSh, 's2').html;
  ok(day1Html === day3Html, 'Print.renderSheet pins creation date so worksheets keep original dates under ink');

  /* Parent Record exposes completed on-screen sheets and read-only PDF export */
  async function openGate() { await navigate('parent'); const gp = A.$('.gate p'); if (gp) { const q = gp.textContent.split('+').map(x => parseInt(x)); A.$$('.numopt').find(b => +b.dataset.v === q[0] + q[1]).click(); await new Promise(r => w.setTimeout(r, 0)); } }
  await openGate();
  await navigate('parent/s2/record');
  ok(!!A.$('a[href="#/parent/s2/mark/' + sh1.id + '"]'), 'parent Record links completed on-screen sheets for PDF export');
  await navigate('parent/s2/mark/' + sh1.id);
  ok(!!A.$('#mk-print') && !A.$('#mk-go'), 'reopening a marked sheet in parent view offers read-only Print / PDF');

  /* Offline Quran audio verse+word coverage, unified progress dispatcher, and clear without auto-refill */
  let keptAudio = [], clearedAudio = 0;
  w.AndroidBridge = {
    voiceList: () => '[]', speakLangs: () => 'ar',
    audioStats: () => JSON.stringify({ bytes: 204800, files: 19, counts: { h: { '2': 286 }, a: { '112': 4 }, w: { '112': 15 } } }),
    audioKeep: (j) => { keptAudio.push(JSON.parse(j)); },
    audioClear: () => { clearedAudio++; }
  };
  const aSt = w.Voice.stats();
  ok(w.Voice.surahState(112, aSt, 'h') === 'bundled', 'Juz Amma with al-Husari and cached words reports bundled offline');
  ok(w.Voice.surahState(113, aSt, 'h') === 'verses', 'bundled surah without cached words honestly reports verses-only');
  ok(w.Voice.surahState(112, aSt, 'a') === 'saved', 'cached al-Afasi surah with words reports saved offline');
  ok(w.Voice.surahState(113, aSt, 'a') === 'online', 'uncached al-Afasi surah reports online');
  A.S.reciter = 'a';
  const qCount = w.Voice.keepMany([112, 113]);
  ok(qCount > 0 && keptAudio[0].some(x => x.startsWith('a/112')) && keptAudio[0].some(x => x.startsWith('w/113_')), 'Voice.keepMany queues verses and word audio for multiple surahs');
  A.S.reciter = 'h';
  w.Voice.clearAudio();
  const keptBeforeQuran = keptAudio.length;
  await navigate('room/quran');
  w.__native.onAudioKeep(10, 10, 0);
  w.__native.onAudioKeep(10, 10, 0);
  ok(clearedAudio === 1 && keptAudio.length === keptBeforeQuran, 'Voice.clearAudio avoids auto-refill and onAudioKeep never loops on Quran shelf');

  /* Standalone course export/import lossless round-trip, legacy @header stripping, and unique lesson numbering */
  const exportedCourse = A.Books.exportText({ name: 'Co-op Physics', room: 'science', y: 5, kind: 'course', lessons: [
    { n: 1, title: 'Work', words: [['force', 'قُوَّة']], grammar: ['W = Fd'], sents: [['Work is measured in joules.', '']], qs: [['Formula for work?', 'W = Fd', 'F / d']] },
    { n: 3, title: 'Power', words: [['power', 'P = W / t']], grammar: [], sents: [], qs: [] }
  ] });
  const importedBk = A.Books.importCourse(exportedCourse);
  ok(!!importedBk && importedBk.name === 'Co-op Physics' && importedBk.lessons[0].qs[0][1] === 'W = Fd' && importedBk.lessons[0].words[0][0] === 'force' && !!w.C.units['bk-' + importedBk.id], 'Books.exportText/importCourse preserves equations, direction and registers immediately');
  const legacyParsed = A.Books.parseCourse('@course: Legacy\n@room: science\n\n# 9007199254740992 Huge\n! Only a grammar rule');
  ok(legacyParsed.name === 'Legacy' && legacyParsed.lessons.length === 1 && legacyParsed.lessons[0].grammar.length === 1 && legacyParsed.lessons[0].n <= 9999, 'Books.parseCourse keeps grammar-only lessons and clamps overflowing lesson numbers');
  await openGate();
  await navigate('parent/books/' + importedBk.id);
  A.$('#bk-add').click();
  ok(importedBk.lessons[importedBk.lessons.length - 1].n === 4, 'Add a lesson assigns max(n)+1 rather than colliding with lesson 3');

  /* Teen flashcard quote-aware import/export with composite dedupe, Arabic comma, multiline & lossless round-trip */
  A.S.cur = 'g'; A.D('g').cards = [];
  const imp1 = A.Cards.importText('\nfront,back,subject\nOhm law,V = IR,Physics\n"Power formula","P = IV",Physics\nCell = Basic unit of life\nCell\tBattery source\tPhysics\nCell\tBattery source\tPhysics\nالشمس، نجم قريب', 'Biology');
  ok(imp1.added === 5 && imp1.skipped === 1 && A.D('g').cards[0].f === 'Ohm law' && A.D('g').cards[0].b === 'V = IR' && A.D('g').cards[1].b === 'P = IV' && A.D('g').cards[2].deck === 'Biology' && A.D('g').cards[3].deck === 'Physics' && A.D('g').cards[4].f === 'الشمس', 'Cards.importText handles CSV with =, same front across subjects, Arabic comma and header after blank line');
  A.D('g').cards.unshift({ f: '#1\nLine 2', b: 'First\nanswer', deck: 'Notes', next: 0, gap: 0 }, { f: 'Term', b: 'Definition', deck: 'Vocab', next: 0, gap: 0 });
  const exportedCards = A.Cards.text(A.D('g').cards);
  A.D('g').cards = [];
  const imp2 = A.Cards.importText(exportedCards);
  ok(imp2.added === 7 && A.D('g').cards[0].f === '#1\nLine 2' && A.D('g').cards[0].b === 'First\nanswer' && A.D('g').cards[1].f === 'Term' && A.D('g').cards[2].b === 'V = IR', 'Cards.text round-trips multiline cards, #1, Term/Definition and equations losslessly');
})().then(() => {
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}).catch(e => { console.error(e); process.exit(1); });
