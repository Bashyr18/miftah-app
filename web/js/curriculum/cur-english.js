/* English: phonics in a fixed order, and every reader built only from sounds already taught, so a child decodes and never guesses.
   Then grammar with the same parsing move as iʿrāb, a comprehension ladder, and the words school assumes you know. */
(function () {
  'use strict';
  var A = window.A, I = window.I, C = window.C;
  C.room('english', { name: ['English', 'الإنجليزية'], hue: 'violet', art: 'book', tag: ['Sounds, then words, then ideas', 'الأصوات ثم الكلمات ثم الأفكار'] });
  var PHASES = [
    { id: 'e.p1', g: ['s', 'a', 't', 'p', 'i', 'n'], t: ['First sounds: s a t p i n', 'الأصوات الأولى: s a t p i n'], w: [['sat', ['s', 'a', 't']], ['pat', ['p', 'a', 't']], ['pin', ['p', 'i', 'n']], ['tin', ['t', 'i', 'n']], ['nap', ['n', 'a', 'p']], ['sit', ['s', 'i', 't']], ['tap', ['t', 'a', 'p']]], art: { s: 'sun', a: 'apple', t: 'tree', p: 'pencil', i: 'ice', n: 'nail' }, rd: ['Pat sat.', 'Sit, Nat, sit.', 'A tin. A pin.'] },
    { id: 'e.p2', g: ['m', 'd', 'g', 'o', 'c', 'k'], t: ['More sounds: m d g o c k', 'المزيد: m d g o c k'], w: [['mat', ['m', 'a', 't']], ['dog', ['d', 'o', 'g']], ['cat', ['c', 'a', 't']], ['pot', ['p', 'o', 't']], ['mad', ['m', 'a', 'd']], ['kit', ['k', 'i', 't']], ['cod', ['c', 'o', 'd']], ['top', ['t', 'o', 'p']]], art: { m: 'moon', d: 'date', g: 'grape', o: 'orange', c: 'cup', k: 'key' }, rd: ['A cat sat on a mat.', 'Dad got a pot.', 'Sam can sit on top.'] },
    { id: 'e.p3', g: ['e', 'u', 'r', 'h', 'b', 'f'], t: ['More sounds: e u r h b f', 'المزيد: e u r h b f'], w: [['bed', ['b', 'e', 'd']], ['hen', ['h', 'e', 'n']], ['sun', ['s', 'u', 'n']], ['run', ['r', 'u', 'n']], ['fan', ['f', 'a', 'n']], ['cup', ['c', 'u', 'p']], ['hug', ['h', 'u', 'g']], ['red', ['r', 'e', 'd']]], art: { e: 'leaf', u: 'cup', r: 'rain', h: 'hand', b: 'book', f: 'fish' }, rd: ['The sun is hot.', 'Run to the bed.', 'Hug Mum and Dad.'] },
    { id: 'e.p4', g: ['l', 'j', 'v', 'w', 'x', 'y', 'z'], t: ['More sounds: l j v w x y z', 'المزيد: l j v w x y z'], w: [['leg', ['l', 'e', 'g']], ['jug', ['j', 'u', 'g']], ['van', ['v', 'a', 'n']], ['wet', ['w', 'e', 't']], ['box', ['b', 'o', 'x']], ['yes', ['y', 'e', 's']], ['zip', ['z', 'i', 'p']], ['log', ['l', 'o', 'g']]], art: { l: 'leaf', j: 'cup', v: 'boat', w: 'well', x: 'book', y: 'sun', z: 'star' }, rd: ['Yes, the jug is wet.', 'Six logs in a van.', 'Zip up the red bag.'] },
    { id: 'e.p5', g: ['sh', 'ch', 'th', 'ng', 'ck'], t: ['Two letters, one sound', 'حرفان وصوت واحد'], w: [['ship', ['sh', 'i', 'p']], ['chip', ['ch', 'i', 'p']], ['thin', ['th', 'i', 'n']], ['ring', ['r', 'i', 'ng']], ['sock', ['s', 'o', 'ck']], ['fish', ['f', 'i', 'sh']], ['rock', ['r', 'o', 'ck']], ['duck', ['d', 'u', 'ck']]], art: { sh: 'boat', ch: 'date', th: 'hand', ng: 'ball', ck: 'stone' }, rd: ['A fish in a big ship.', 'The thin duck can sing.', 'Rush to the shop with Mum.'] },
    { id: 'e.p6', g: ['ee', 'oo', 'ai', 'ar'], t: ['Long sounds', 'الأصوات الطويلة'], w: [['see', ['s', 'ee']], ['moon', ['m', 'oo', 'n']], ['rain', ['r', 'ai', 'n']], ['car', ['c', 'ar']], ['tree', ['t', 'r', 'ee']], ['food', ['f', 'oo', 'd']], ['park', ['p', 'ar', 'k']], ['sail', ['s', 'ai', 'l']]], art: { ee: 'tree', oo: 'moon', ai: 'rain', ar: 'star' }, rd: ['I see the moon and a star.', 'Rain on the tree in the park.', 'Good food is a gift.'] }
  ];
  /* each sound has a word and a picture of exactly that word */
  var KEYW = { s: ['sun', 'sun'], a: ['apple', 'apple'], t: ['tree', 'tree'], p: ['pencil', 'pencil'], i: ['ink', 'ink'], n: ['nail', 'nail'], m: ['moon', 'moon'], d: ['date', 'date'], g: ['grape', 'grape'], o: ['orange', 'orange'], c: ['cup', 'cup'], k: ['key', 'key'], e: ['egg', 'egg'], u: ['umbrella', 'umbrella'], r: ['rain', 'rain'], h: ['hand', 'hand'], b: ['book', 'book'], f: ['fish', 'fish'], l: ['leaf', 'leaf'], j: ['jug', 'jug'], v: ['van', 'van'], w: ['well', 'well'], x: ['box', 'box'], y: ['yarn', 'yarn'], z: ['zip', 'zip'], sh: ['ship', 'ship'], ch: ['chair', 'chair'], th: ['thumb', 'hand'], ng: ['ring', 'ring'], ck: ['clock', 'clock'], ee: ['tree', 'tree'], oo: ['moon', 'moon'], ai: ['rain', 'rain'], ar: ['star', 'star'] };
  C.KEYW = KEYW; C.SOUNDLESSONS = [];
  C.unit('english', 'e-phon', ['Sounds and first reading', 'الأصوات والقراءة الأولى'], 1);
  function soundCard(g) { var kw = KEYW[g]; return { k: 'say', lang: 'en', sound: g, p: ['This says its sound. Touch it.', 'هذا يقول صوته. المسه.'], silent: true, html: function () { return '<button class="lt-big" style="font-family:var(--f);font-weight:800" data-a="ph-s" data-g="' + g + '">' + g + '</button><div class="sc-art">' + A.art(kw[1], 96) + '</div><p class="sc-t" dir="ltr">' + g + ' as in ' + kw[0] + '</p>'; }, mount: function () { I.sound(g); setTimeout(function () { Voice.say(kw[0], { lang: 'en' }); }, 900); } }; }
  function hearSound(r, set, taught) { var g = r.pick(set), ds = r.shuffle(taught.filter(function (x) { return x !== g; })).slice(0, 2); return { k: 'choice', p: ['Which sound do you hear?', 'أي صوت تسمع؟'], cols: 3, large: true, err: 'phoneme', listen: function () { I.sound(g); }, hint: [g + ' as in ' + KEYW[g][0], g + ' كما في ' + KEYW[g][0]], o: [g].concat(ds).map(function (x) { return { t: x, ok: x === g }; }) }; }
  PHASES.forEach(function (ph, pi) {
    var before = PHASES.slice(0, pi).reduce(function (acc, x) { return acc.concat(x.g); }, []);
    var size = ph.g.length === 4 ? 2 : 3, chunks = []; for (var ci = 0; ci < ph.g.length; ci += size) chunks.push(ph.g.slice(ci, ci + size));
    var taught = before.concat(ph.g);
    /* first the sounds, a few at a time */
    chunks.forEach(function (set, n) {
      var soFar = before.concat(ph.g.slice(0, (n + 1) * size));
      if (soFar.length < 3) soFar = soFar.concat(['s', 'a', 't'].filter(function (x) { return soFar.indexOf(x) < 0; }));
      var pool = soFar.length >= 3 ? soFar : taught;
      C.SOUNDLESSONS.push({ id: n === 0 ? ph.id : ph.id + '.' + n, g: set });
      C.add(n === 0 ? ph.id : ph.id + '.' + n, {
        title: ['Sounds: ' + set.join(' '), 'أصوات: ' + set.join(' ')], art: KEYW[set[0]][1], soloN: 3,
        meet: set.map(soundCard),
        guided: set.length > 1 ? [{ k: 'match', p: ['Match each sound to its picture.', 'صِل كل صوت بصورته.'], err: 'phoneme', hint: ['Say the word. What sound does it start with?', 'قل الكلمة. بأي صوت تبدأ؟'], pairs: set.map(function (g) { return [{ t: g }, { art: KEYW[g][1] }]; }) }] : null,
        solo: function (r) { return hearSound(r, set, pool); },
        make: set.filter(function (g) { return g.length === 1; }).slice(0, 2).map(function (g) { return { k: 'trace', set: 'en', ch: g, p: ['Write ' + g + ' with your finger.', 'اكتب ' + g + ' بإصبعك.'] }; }),
        review: function (r) { return hearSound(r, set, pool); }
      });
    });
    /* then join them and read: a separate sitting */
    C.add(ph.id + '.b', {
      title: ['Join and read: ' + ph.g.join(' '), 'صِل واقرأ: ' + ph.g.join(' ')], art: 'book', soloN: 3,
      guided: [{ k: 'phon', word: ph.w[0][0], gs: ph.w[0][1], p: ['Touch each sound, then hear them join.', 'المس كل صوت ثم اسمعها تتصل.'] }, { k: 'phon', word: ph.w[1][0], gs: ph.w[1][1], p: ['Again. Touch each sound.', 'مرة أخرى. المس كل صوت.'] }],
      solo: function (r) { var w = r.pick(ph.w); return { k: 'build', lang: 'en', word: w[1], say: w[0], joined: w[0], join: true, sounds: I.SND, p: ['Spell the word you hear.', 'تهجَّ الكلمة التي تسمعها.'], err: 'blend', extra: r.shuffle(taught.filter(function (x) { return w[1].indexOf(x) < 0; })).slice(0, 2), hint: ['Say it slowly. What sound comes first?', 'قلها ببطء. ما أول صوت؟'] }; },
      make: [{ k: 'reader', lines: ph.rd, p: ['Read it to someone. Tap only if you are stuck.', 'اقرأها لأحدهم. انقر فقط إذا توقفت.'], silent: true }],
      review: function (r) { var w = r.pick(ph.w); return { k: 'build', lang: 'en', word: w[1], say: w[0], joined: w[0], join: true, p: ['Spell the word you hear.', 'تهجَّ الكلمة التي تسمعها.'], err: 'blend', extra: r.shuffle(taught.filter(function (x) { return w[1].indexOf(x) < 0; })).slice(0, 2) }; }
    });
  });
  A.acts['ph-s'] = function (t) { I.sound(t.dataset.g); };
  var TRICKY = ['the', 'I', 'to', 'no', 'go', 'he', 'she', 'we', 'me', 'was', 'you', 'they', 'my', 'said', 'are'];
  C.add('e.tricky', {
    title: ['Words to know by sight', 'كلمات تُعرف بالنظر'], art: 'star',
    meet: [{ k: 'say', p: ['Some common words do not follow the rules. We learn them by sight, like friends you recognise.', 'بعض الكلمات الشائعة لا تتبع القواعد. نعرفها بالنظر كالأصدقاء.'], big: 'the  said  was  you' }],
    solo: function (r) { var ws = r.shuffle(TRICKY), t = ws[0]; return { k: 'choice', p: ['Which word do you hear?', 'أي كلمة تسمع؟'], cols: 3, err: 'phoneme', listen: function () { Voice.say(t, { lang: 'en' }); }, o: ws.slice(0, 3).map(function (x) { return { t: x, ok: x === t }; }), large: true }; }, soloN: 5,
    review: function (r) { var ws = r.shuffle(TRICKY), t = ws[0]; return { k: 'choice', p: ['Which word do you hear?', 'أي كلمة تسمع؟'], cols: 3, large: true, err: 'phoneme', listen: function () { Voice.say(t, { lang: 'en' }); }, o: ws.slice(0, 3).map(function (x) { return { t: x, ok: x === t }; }) }; }
  });
  C.add('e.sent', {
    title: ['A sentence is a whole idea', 'الجملة فكرة كاملة'], art: 'pencil',
    meet: [{ k: 'say', p: ['A sentence starts with a capital and ends with a full stop.', 'تبدأ الجملة بحرف كبير وتنتهي بنقطة.'], big: 'The sun is hot.' }],
    solo: function (r) { var S = r.pick([['We go to the park.', 'we go to the park.', 'We go to the park'], ['The moon is big.', 'the moon is big.', 'The moon is big'], ['I can see a star.', 'i can see a star.', 'I can see a star'], ['Mum has a red cup.', 'mum has a red cup.', 'Mum has a red cup']]); return { k: 'choice', p: ['Which is written correctly?', 'أيها مكتوب صحيحًا؟'], cols: 1, err: 'understanding', hint: ['A capital at the start. A full stop at the end.', 'حرف كبير في البداية ونقطة في النهاية.'], o: S.map(function (x, i) { return { html: '<span dir="ltr">' + x + '</span>', ok: i === 0 }; }) }; },
    make: [{ k: 'mission', art: 'pencil', t: ['On paper, write one sentence about what you ate today. Capital. Full stop.', 'اكتب في ورقة جملة واحدة عما أكلته اليوم. حرف كبير ثم نقطة.'] }],
    review: function (r) { return { k: 'choice', p: ['Which is written correctly?', 'أيها مكتوب صحيحًا؟'], cols: 1, err: 'understanding', o: [{ html: '<span dir="ltr">Rain is good.</span>', ok: true }, { html: '<span dir="ltr">rain is good</span>' }] }; }
  });
  var STORY1 = { id: 'e.story1', t: ['A story to retell', 'قصة تحكيها'], text: 'Zaid saw a bird on the path. It could not fly. He got a cup of water and put it near the bird. He sat and did not make a noise. Soon the bird drank. Then it flew up to a tree. Zaid was glad. He told his mum.', q: [[['What did Zaid get?', 'ماذا أحضر زيد؟'], [['A cup of water', 'كوب ماء', 1], ['A big box', 'صندوق كبير'], ['A red ball', 'كرة حمراء']]], [['Why did he sit quietly?', 'لماذا جلس بهدوء؟'], [['So the bird was not scared', 'حتى لا يخاف الطائر', 1], ['He was tired', 'لأنه متعب'], ['He was asleep', 'لأنه نائم']]], [['Was Zaid kind? How do you know?', 'هل كان زيد رحيمًا؟ كيف تعرف؟'], [['Yes: he helped and was gentle', 'نعم: ساعد وكان لطيفًا', 1], ['No: the bird flew off', 'لا: طار الطائر']]]] };
  function compSkill(S) {
    return {
      title: S.t, art: 'bird',
      meet: [{ k: 'say', silent: true, p: ['Read it, or listen.', 'اقرأها أو استمع.'], lang: 'en', speak: S.text, html: '<div class="passage" dir="ltr">' + S.text + '</div>', autoSay: true }],
      solo: S.q.map(function (q, i) { return { k: 'choice', p: q[0], cols: 1, err: 'understanding', qHtml: '<div class="pl-lad">' + ['What it says', 'What it means', 'What you think'][i] + '</div>', hint: ['Look back at the story.', 'ارجع إلى القصة.'], o: q[1].map(function (o) { return { t: [o[0], o[1]], ok: !!o[2] }; }) }; }),
      make: [{ k: 'mission', art: 'book', t: ['Tell the story to someone in your own words: first, then, last.', 'احك القصة لأحدهم بكلماتك: أولًا، ثم، أخيرًا.'] }],
      review: function (r) { var q = S.q[0]; return { k: 'choice', p: q[0], cols: 1, err: 'understanding', o: q[1].map(function (o) { return { t: [o[0], o[1]], ok: !!o[2] }; }) }; }
    };
  }
  C.add(STORY1.id, compSkill(STORY1));

  /* ---------- Seekers ---------- */
  C.unit('english', 'e-gram', ['How English works', 'كيف تعمل الإنجليزية'], 2);
  var ROLES = [['Noun: a person, place or thing', 'اسم: شخص أو مكان أو شيء'], ['Verb: doing or being', 'فعل: عمل أو كون'], ['Adjective: describes a noun', 'صفة: تصف الاسم']];
  var SEN = [[['The', null], ['tall', 2], ['tree', 0], ['grew', 1]], [['A', null], ['kind', 2], ['boy', 0], ['helped', 1]], [['The', null], ['bright', 2], ['moon', 0], ['rose', 1]], [['My', null], ['old', 2], ['book', 0], ['fell', 1]], [['The', null], ['cold', 2], ['rain', 0], ['stopped', 1]]];
  C.add('e.pos', {
    title: ['Nouns, verbs, adjectives', 'الأسماء والأفعال والصفات'], art: 'book', needs: [],
    meet: [{ k: 'say', p: ['Words have jobs. In Arabic you learned ism and fiʿl. English has them too.', 'للكلمات وظائف. تعلمت الاسم والفعل في العربية. وفي الإنجليزية مثلها.'], html: '<div class="snt" dir="ltr"><span class="wd r2">bright</span><span class="wd r0">moon</span><span class="wd r1">rose</span></div>' }],
    guided: [{ k: 'sentence', p: ['Pick a job, then tap its word.', 'اختر الوظيفة ثم انقر كلمتها.'], words: SEN[0].map(function (x) { return { t: x[0], r: x[1] }; }), roles: ROLES, hint: ['What is it about? What does it do? What is it like?', 'عمّ الجملة؟ ماذا يفعل؟ كيف هو؟'] }],
    solo: function (r) { var S = r.pick(SEN); return { k: 'sentence', p: ['Label the words.', 'صنّف الكلمات.'], words: S.map(function (x) { return { t: x[0], r: x[1] }; }), roles: ROLES, hint: ['Start with the thing it is about.', 'ابدأ بالشيء الذي تتحدث عنه.'] }; },
    review: function (r) { var S = r.pick(SEN); return { k: 'sentence', p: ['Label the words.', 'صنّف الكلمات.'], words: S.map(function (x) { return { t: x[0], r: x[1] }; }), roles: ROLES }; }
  });
  var RSUB = [['Subject: who or what it is about', 'المسند إليه: عمّن الجملة'], ['Predicate: what is said about it', 'المسند: ما قيل عنه']];
  var SP = [[['The', 0], ['old', 0], ['man', 0], ['carried', 1], ['the', 1], ['water', 1]], [['My', 0], ['sister', 0], ['reads', 1], ['the', 1], ['Qurʾān', 1]], [['Birds', 0], ['fly', 1], ['south', 1], ['in', 1], ['winter', 1]], [['The', 0], ['river', 0], ['runs', 1], ['to', 1], ['the', 1], ['sea', 1]]];
  C.add('e.subj', {
    title: ['Subject and predicate', 'المسند إليه والمسند'], art: 'book',
    meet: [{ k: 'say', p: ['Every sentence has two parts: who it is about, and what is said about them. Exactly as in mubtadaʾ and khabar.', 'لكل جملة جزآن: عمّن هي، وما قيل عنه. كالمبتدأ والخبر تمامًا.'], html: '<div class="snt" dir="ltr"><span class="wd r0">The moon</span><span class="wd r1">is bright</span></div>' }],
    solo: function (r) { var S = r.pick(SP); return { k: 'sentence', p: ['Split the sentence.', 'قسّم الجملة.'], words: S.map(function (x) { return { t: x[0], r: x[1] }; }), roles: RSUB, hint: ['Find the verb. Everything before it is usually the subject.', 'جد الفعل. ما قبله غالبًا هو المسند إليه.'] }; },
    review: function (r) { var S = r.pick(SP); return { k: 'sentence', p: ['Split the sentence.', 'قسّم الجملة.'], words: S.map(function (x) { return { t: x[0], r: x[1] }; }), roles: RSUB }; }
  });
  var TENSE = [['walk', 'walked', 'will walk'], ['help', 'helped', 'will help'], ['go', 'went', 'will go'], ['eat', 'ate', 'will eat'], ['write', 'wrote', 'will write'], ['pray', 'prayed', 'will pray'], ['give', 'gave', 'will give']];
  C.add('e.tense', {
    title: ['Past, present, future', 'الماضي والحاضر والمستقبل'], art: 'sun',
    meet: [{ k: 'say', p: ['Verbs carry time. Some just add -ed. Others change completely.', 'الأفعال تحمل الزمن. بعضها يضيف ed وبعضها يتغير كليًا.'], big: 'go · went · will go' }],
    solo: function (r) { var v = r.pick(TENSE), w = r.int(0, 2), W = ['Today I', 'Yesterday I', 'Tomorrow I']; return { k: 'choice', p: [W[w] + ' ...', W[w] + ' ...'], cols: 1, err: 'word-role', hint: ['When does it happen?', 'متى يحدث؟'], o: v.map(function (x, i) { return { html: '<span dir="ltr">' + x + '</span>', ok: i === w }; }) }; }, soloN: 4,
    review: function (r) { var v = r.pick(TENSE); return { k: 'choice', p: ['Yesterday I ...', 'Yesterday I ...'], cols: 1, err: 'word-role', o: v.map(function (x, i) { return { html: '<span dir="ltr">' + x + '</span>', ok: i === 1 }; }) }; }
  });
  var TIER2 = [['compare', ['to see how things are alike and different', 'أن ترى أوجه الشبه والاختلاف']], ['evidence', ['what shows that something is true', 'ما يدل على صحة الأمر']], ['reason', ['why something is so', 'سبب كون الشيء كذلك']], ['describe', ['to say what something is like', 'أن تقول كيف هو الشيء']], ['explain', ['to make something clear', 'أن توضح الشيء']], ['predict', ['to say what you think will happen', 'أن تقول ما تظن أنه سيحدث']], ['observe', ['to watch carefully', 'أن تراقب بعناية']], ['therefore', ['so, for that reason', 'لذلك']], ['although', ['even if, in spite of', 'مع أن']], ['measure', ['to find the size of', 'أن تعرف مقدار الشيء']], ['improve', ['to make better', 'أن تجعله أفضل']], ['patient', ['able to wait calmly', 'قادر على الانتظار بهدوء']]];
  C.add('e.tier2', {
    title: ['Words that open every subject', 'كلمات تفتح كل مادة'], art: 'key',
    meet: [{ k: 'say', p: ['Words like compare and evidence are keys. Every subject uses them and nobody stops to teach them. We will.', 'كلمات مثل قارن ودليل مفاتيح. تستعملها كل مادة ولا أحد يعلّمها. سنعلمها نحن.'], big: 'evidence' }],
    solo: function (r) { var ws = r.shuffle(TIER2), t = ws[0]; return { k: 'choice', p: ['What does this word mean?', 'ما معنى هذه الكلمة؟'], q: t[0], cols: 1, err: 'understanding', listen: function () { Voice.say(t[0], { lang: 'en' }); }, autoListen: false, o: ws.slice(0, 3).map(function (x) { return { t: x[1], ok: x === t }; }) }; }, soloN: 5,
    make: [{ k: 'mission', art: 'book', t: ['Use the word evidence at dinner tonight. What is your evidence that today was good?', 'استعمل كلمة دليل على العشاء. ما دليلك على أن اليوم كان جيدًا؟'] }],
    review: function (r) { var ws = r.shuffle(TIER2), t = ws[0]; return { k: 'choice', p: ['What does this word mean?', 'ما معنى هذه الكلمة؟'], q: t[0], cols: 1, err: 'understanding', o: ws.slice(0, 3).map(function (x) { return { t: x[1], ok: x === t }; }) }; }
  });
  var P2 = { id: 'e.ladder', t: ['Read like a thinker', 'اقرأ كالمفكر'], text: 'Long ago, Ibn al-Haytham sat in a dark room. A thin line of light came through a small hole and made a picture on the wall, upside down. People then thought that our eyes sent out rays to see. He tested it, many times. He showed that light comes to the eye from things. He said we should not simply trust what we are told, but look, test, and check.', q: [[['What made the picture on the wall?', 'ما الذي كوّن الصورة على الجدار؟'], [['Light through a small hole', 'الضوء من ثقب صغير', 1], ['A painter', 'رسام'], ['A lamp', 'مصباح']]], [['Why do you think he tested it many times?', 'لماذا تظنه اختبرها مرات كثيرة؟'], [['To be sure it was true', 'ليتأكد من صحتها', 1], ['He was bored', 'لأنه ملّ'], ['He had forgotten', 'لأنه نسي']]], [['What is the best lesson here?', 'ما أفضل درس هنا؟'], [['Check things with evidence', 'تحقق من الأمور بالدليل', 1], ['Stay in dark rooms', 'ابق في الغرف المظلمة']]]] };
  C.add(P2.id, compSkill(P2));
  C.add('e.para', {
    title: ['Writing a paragraph', 'كتابة فقرة'], art: 'pencil',
    meet: [{ k: 'say', p: ['A paragraph has one idea. Say it. Give reasons or examples. Then close it.', 'الفقرة فيها فكرة واحدة. اذكرها، وهات أسبابًا أو أمثلة، ثم اختمها.'], art: 'pencil' }],
    guided: [{ k: 'order', p: ['Put this paragraph in order.', 'رتب هذه الفقرة.'], err: 'sequence', hint: ['What is the big idea? That comes first.', 'ما الفكرة الكبرى؟ تأتي أولًا.'], items: [{ t: ['Rain is a mercy.', 'Rain is a mercy.'] }, { t: ['It waters the crops we eat.', 'It waters the crops we eat.'] }, { t: ['It also fills the wells.', 'It also fills the wells.'] }, { t: ['So we thank Allah when it falls.', 'So we thank Allah when it falls.'] }] }],
    make: [{ k: 'mission', art: 'pencil', t: ['Write a paragraph on paper: why do we share food? One idea, two reasons, one closing line. Read it to a parent.', 'اكتب فقرة في ورقة: لماذا نشارك الطعام؟ فكرة وسببان وخاتمة. اقرأها على والدك.'] }],
    review: function (r) { return { k: 'choice', p: ['What comes first in a paragraph?', 'ماذا يأتي أولًا في الفقرة؟'], cols: 1, err: 'sequence', o: [{ t: ['The main idea', 'الفكرة الرئيسة'], ok: true }, { t: ['A closing line', 'الخاتمة'] }, { t: ['A small detail', 'تفصيل صغير'] }] }; }
  });
})();
