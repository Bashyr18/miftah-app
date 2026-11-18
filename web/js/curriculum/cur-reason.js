/* Thinking: verbal, quantitative and pattern reasoning from five to eleven, the habits the eleven-plus and every later subject rest on.
   Five units, one a year: look and think (pictures), find the rule, words that think, numbers that think, codes and logic.
   Every question is generated, so practice never runs out and never repeats the same few items. Each lesson meets the idea with
   an example said aloud, tries one together with a hint, then asks for it alone; review mixes them back in later.
   Words are given in English and Arabic; where a skill only works in one language (compound words in English, word families
   from one root in Arabic), each language gets its own. */
(function () {
  'use strict';
  var A = window.A, I = window.I, C = window.C, M = window.M;
  var ar = function (x) { return String(x).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }); };
  var isAr = function () { return A.ar && A.ar(); };
  var N2 = function (n) { return [String(n), ar(n)]; };

  M.ERR.pattern = { t: ['Misses the rule in a pattern', 'يفوّت قاعدة النمط'], fix: ['Say the pattern aloud together, then clap it.', 'قولوا النمط بصوت عالٍ معًا، ثم صفّقوه.'] };
  M.ERR.category = { t: ['Groups things by how they look, not what they are', 'يجمع الأشياء بشكلها لا بنوعها'], fix: ['Ask of each one: what is it for, and what kind of thing is it?', 'اسألوا عن كل شيء: لماذا يُستعمل، وما نوعه؟'] };
  M.ERR.relation = { t: ['Misses how two words are linked', 'لا يرى الصلة بين الكلمتين'], fix: ['Say the link as a sentence first: a lamb is a baby sheep.', 'قولوا الصلة جملةً أولًا: الحَمَل صغير الخروف.'] };
  M.ERR.logic = { t: ['Jumps to what the facts do not say', 'يقفز إلى ما لا تقوله المعطيات'], fix: ['Draw it: a line of people, or circles inside circles.', 'ارسموها: صفّ من الناس، أو دوائر داخل دوائر.'] };
  M.ERR['two-step'] = { t: ['Stops after the first step of a problem', 'يتوقف بعد الخطوة الأولى من المسألة'], fix: ['Ask after each step: what do we know now, and what is still missing?', 'اسألوا بعد كل خطوة: ماذا نعرف الآن، وما الذي ما زال ناقصًا؟'] };

  C.room('think', { name: ['Thinking', 'التفكير'], hue: 'violet', art: 'bulb', tag: ['Spot the rule, then use it', 'اكتشف القاعدة ثم استعملها'] });

  /* ---------- small helpers ---------- */
  function choiceOf(r, right, wrongs, p, err, extra) {
    var o = [Object.assign({ ok: true }, right)].concat(wrongs.map(function (w) { return Object.assign({ e: err }, w); }));
    return Object.assign({ k: 'choice', p: p, o: r.shuffle(o), shuffle: false, err: err }, extra || {});
  }
  function numChoice(r, a, lo, hi, p, err, extra) {
    var o = I.numOpts(r, a, lo, hi, 4, err).map(function (x) { return { t: N2(x.v), ok: x.ok, e: x.e }; });
    return Object.assign({ k: 'choice', p: p, o: o, shuffle: false, large: true, err: err }, extra || {});
  }
  function pad(eq, a, p, err, extra) { return Object.assign({ k: 'pad', eq: eq, a: a, p: p, err: err }, extra || {}); }
  function row(arts, size, q) { return '<div class="rz-row">' + arts.map(function (a) { return '<span class="rz-i">' + A.art(a, size || 54) + '</span>'; }).join('') + (q ? '<span class="rz-q">?</span>' : '') + '</div>'; }
  function others(r, list, not, n) { return r.shuffle(list.filter(function (x) { return not.indexOf(x) < 0; })).slice(0, n); }

  /* ---------- the picture families ---------- */
  var KINDS = {
    fruit: { n: ['fruit', 'فاكهة'], a: ['apple', 'banana', 'cherries', 'grape', 'lemon', 'mango', 'melon', 'orange', 'peach', 'pear', 'pineapple', 'strawberry', 'kiwi'] },
    veg: { n: ['vegetables', 'خضار'], a: ['carrot', 'corn', 'cucumber', 'onion', 'pepper', 'potato', 'tomato'] },
    ride: { n: ['things that carry people', 'وسائل نقل'], a: ['bicycle', 'boat', 'bus', 'car', 'plane', 'ship', 'train', 'van'] },
    wear: { n: ['things we wear', 'ملابس'], a: ['cap', 'gloves', 'scarf', 'shoe', 'socks'] },
    kitchen: { n: ['things in the kitchen', 'أدوات المطبخ'], a: ['bowl', 'cup', 'fork', 'spoon', 'plate', 'kettle', 'jug', 'pot'] },
    sky: { n: ['weather', 'الطقس'], a: ['cloud', 'rain', 'snow', 'rainbow', 'tornado'] },
    bloom: { n: ['flowers', 'أزهار'], a: ['flower', 'rose', 'tulip', 'sunflower', 'hibiscus'] },
    school: { n: ['things for school', 'أدوات المدرسة'], a: ['book', 'crayon', 'pencil', 'notebook', 'ruler', 'scissors'] }
  };
  var KK = Object.keys(KINDS);
  var PAIRS = [['rain', 'umbrella'], ['shoe', 'socks'], ['pencil', 'notebook'], ['fork', 'plate'], ['toothbrush', 'tooth'], ['needle', 'thread'], ['paint', 'palette'], ['seed', 'plant'], ['snow', 'gloves'], ['kettle', 'cup'], ['bulb', 'lamp'], ['bread', 'cheese'], ['bucket', 'broom']];
  var OPP = [[['hot', 'حارّ'], ['cold', 'بارد']], [['big', 'كبير'], ['small', 'صغير']], [['up', 'فوق'], ['down', 'تحت']], [['day', 'نهار'], ['night', 'ليل']], [['happy', 'سعيد'], ['sad', 'حزين']], [['open', 'مفتوح'], ['closed', 'مغلق']],
    [['full', 'ممتلئ'], ['empty', 'فارغ']], [['fast', 'سريع'], ['slow', 'بطيء']], [['tall', 'طويل'], ['short', 'قصير']], [['light', 'خفيف'], ['heavy', 'ثقيل']], [['wet', 'مبلّل'], ['dry', 'جافّ']], [['new', 'جديد'], ['old', 'قديم']],
    [['first', 'أوّل'], ['last', 'آخِر']], [['inside', 'داخل'], ['outside', 'خارج']], [['near', 'قريب'], ['far', 'بعيد']]];

  /* ================= Year 1: look and think ================= */
  var u1 = C.unit('think', 't-see', ['Look and think', 'انظر وفكّر'], 1); u1.y = 1;

  function oddPic(r) {
    var k = r.pick(KK), other = r.pick(KK.filter(function (x) { return x !== k; }));
    var same = r.shuffle(KINDS[k].a).slice(0, 3), odd = r.pick(KINDS[other].a);
    return choiceOf(r, { art: odd }, same.map(function (a) { return { art: a }; }), ['Which one does not belong?', 'أيّها لا ينتمي إلى البقية؟'], 'category',
      { cols: 2, artSize: 78, hint: ['Three of them are ' + KINDS[k].n[0] + '.', 'ثلاثة منها ' + KINDS[k].n[1] + '.'] });
  }
  C.add('t.odd', {
    title: ['Which one does not belong?', 'أيّها لا ينتمي؟'], art: 'bulb',
    meet: [{ k: 'say', p: ['Three are fruit. The car is not. It does not belong.', 'ثلاثة فاكهة، والسيارة ليست كذلك، فهي لا تنتمي.'], arts: ['apple', 'banana', 'pear', 'car'] }],
    guided: function (r) { var s = oddPic(r); s.p = ['Find the one that is a different kind of thing.', 'جد الشيء المختلف في نوعه.']; return [s]; },
    solo: oddPic, review: oddPic, soloN: 4
  });

  function nextPic(r) {
    var kind = r.pick(['AB', 'AAB', 'ABB', 'ABC']), pool = r.shuffle(KINDS[r.pick(KK)].a.concat(KINDS[r.pick(KK)].a)).filter(function (x, i, a) { return a.indexOf(x) === i; });
    var u = pool.slice(0, 3), unit = kind.split('').map(function (c) { return u['ABC'.indexOf(c)]; }), seq = [];
    while (seq.length < 6) seq.push(unit[seq.length % unit.length]);
    var ans = unit[seq.length % unit.length], wrong = u.filter(function (x) { return x !== ans; }).concat([pool[3]]).filter(Boolean).slice(0, 2);
    return choiceOf(r, { art: ans }, wrong.map(function (a) { return { art: a }; }), ['What comes next?', 'ماذا يأتي بعد ذلك؟'], 'pattern',
      { qHtml: row(seq, 34, true), cols: 3, artSize: 70, hint: ['Say it aloud from the start, and listen for the repeat.', 'قلها بصوت عالٍ من البداية واستمع للتكرار.'] });
  }
  C.add('t.next', {
    title: ['What comes next?', 'ماذا يأتي بعد ذلك؟'], art: 'star',
    meet: [{ k: 'say', p: ['Apple, banana, apple, banana… the pattern repeats. Next comes apple.', 'تفاحة، موزة، تفاحة، موزة… النمط يتكرر. بعدها تفاحة.'], html: function () { return row(['apple', 'banana', 'apple', 'banana'], 50, true); } }],
    guided: function (r) { return [nextPic(r)]; }, solo: nextPic, review: nextPic, soloN: 4
  });

  function goesWith(r) {
    var pr = r.pick(PAIRS), flip = r.bool(), a = flip ? pr[1] : pr[0], b = flip ? pr[0] : pr[1];
    var wrong = others(r, PAIRS.map(function (x) { return x[r.bool() ? 0 : 1]; }), [a, b], 3);
    return choiceOf(r, { art: b }, wrong.map(function (w) { return { art: w }; }), ['Which one goes with this?', 'أيّها يرافق هذا؟'], 'category',
      { qArt: a, cols: 3, artSize: 70, hint: ['Think: when do we use this? What do we use with it?', 'فكّر: متى نستعمله؟ وماذا نستعمل معه؟'] });
  }
  C.add('t.goes', {
    title: ['What goes together?', 'ما الذي يتلازم؟'], art: 'umbrella', needs: ['t.odd'],
    meet: [{ k: 'say', p: ['Rain and an umbrella go together: we use one because of the other.', 'المطر والمظلة متلازمان: نستعمل الأولى بسبب الثاني.'], arts: ['rain', 'umbrella'] }],
    guided: function (r) { return [goesWith(r)]; }, solo: goesWith, review: goesWith, soloN: 4
  });

  function opposite(r) {
    var pr = r.pick(OPP), flip = r.bool(), w = flip ? pr[1] : pr[0], ans = flip ? pr[0] : pr[1];
    var wrong = r.shuffle(OPP.filter(function (x) { return x !== pr; })).slice(0, 3).map(function (x) { return { t: x[r.bool() ? 0 : 1] }; });
    return choiceOf(r, { t: ans }, wrong, ['What is the opposite of “' + w[0] + '”?', 'ما عكس «' + w[1] + '»؟'], 'relation', { cols: 2, hint: ['An opposite is as far away as it can be: hot and cold.', 'العكس أبعد ما يكون: حارّ وبارد.'] });
  }
  C.add('t.opp', {
    title: ['Opposites', 'الأضداد'], art: 'sparkles', needs: ['t.goes'],
    meet: [{ k: 'say', p: ['Hot and cold are opposites. So are full and empty, and near and far.', 'حارّ وبارد ضدّان، وكذلك ممتلئ وفارغ، وقريب وبعيد.'], big: '↔' }],
    guided: function (r) { return [opposite(r)]; }, solo: opposite, review: opposite, soloN: 4
  });

  function moreGroup(r) {
    var art = r.pick(['apple', 'star', 'olive', 'orange', 'date', 'leaf']), a = r.int(2, 9), b; do { b = r.int(2, 9); } while (b === a);
    var askMore = r.bool(), ans = askMore ? (a > b ? 'A' : 'B') : (a < b ? 'A' : 'B');
    var g = function (n) { var out = []; for (var i = 0; i < n; i++) out.push(art); return row(r.shuffle(out), 30); };
    return choiceOf(r, { html: g(ans === 'A' ? a : b), t: [''] }, [{ html: g(ans === 'A' ? b : a), t: [''] }], askMore ? ['Which group has more?', 'أيّ مجموعة فيها أكثر؟'] : ['Which group has fewer?', 'أيّ مجموعة فيها أقل؟'], 'compare',
      { cols: 1, hint: ['Pair them up, one from each group. Which group has some left over?', 'زاوجها: واحدة من كل مجموعة. أيّ مجموعة يبقى منها شيء؟'] });
  }
  C.add('t.more', {
    title: ['Which has more?', 'أيّها أكثر؟'], art: 'scale', needs: ['t.next'],
    meet: [{ k: 'say', p: ['Match them one to one. The group with some left over has more.', 'طابِقها واحدًا بواحد. المجموعة التي يبقى منها شيء هي الأكثر.'], html: function () { return row(['apple', 'apple', 'apple', 'apple', 'apple'], 34) + row(['apple', 'apple', 'apple'], 34); } }],
    guided: function (r) { return [moreGroup(r)]; }, solo: moreGroup, review: moreGroup, soloN: 4
  });

  /* ================= Year 2: find the rule ================= */
  var u2 = C.unit('think', 't-rule', ['Find the rule', 'اكتشف القاعدة'], 1); u2.y = 2;

  function countOn(r) {
    var step = r.pick([1, 2, 5, 10, 2, 5]), down = step <= 2 && r.int(0, 3) === 0, start = down ? r.int(10, 20) : step === 10 ? 10 * r.int(0, 4) : step === 5 ? 5 * r.int(0, 6) : r.int(0, 12);
    var seq = [start]; for (var i = 1; i < 4; i++) seq.push(seq[i - 1] + (down ? -step : step));
    var ans = seq[3] + (down ? -step : step);
    return numChoice(r, ans, Math.max(0, ans - 10), ans + 10, ['What number comes next?', 'ما العدد التالي؟'], 'pattern',
      { q: [seq.join(', ') + ', ?', seq.map(ar).join('، ') + '، ؟'], hint: ['How much does it change each time?', 'كم يتغير في كل مرة؟'] });
  }
  C.add('t.count', {
    title: ['Number patterns', 'أنماط الأعداد'], art: 'abacus',
    meet: [{ k: 'say', p: ['2, 4, 6, 8… each number is two more. Next comes 10.', '٢، ٤، ٦، ٨… كل عدد يزيد اثنين. بعدها ١٠.'], big: '2 · 4 · 6 · 8 · ?' }],
    guided: function (r) { return [countOn(r)]; }, solo: countOn, review: countOn, soloN: 4
  });

  function balance(r) {
    var art = r.pick(['apple', 'orange', 'olive', 'date', 'star']), total = r.int(4, 10), have = r.int(1, total - 1), ans = total - have;
    var left = []; for (var i = 0; i < have; i++) left.push(art);
    return numChoice(r, ans, 0, 10, ['These and how many more make ' + total + '?', 'هذه وكم أخرى تصنع ' + ar(total) + '؟'], 'add-count',
      { qHtml: row(left, 34, true), hint: ['Count on from ' + have + ' up to ' + total + ' on your fingers.', 'عُدّ من ' + ar(have) + ' إلى ' + ar(total) + ' على أصابعك.'] });
  }
  C.add('t.balance', {
    title: ['Make it balance', 'اجعلها متوازنة'], art: 'scale', needs: ['t.count'],
    meet: [{ k: 'say', p: ['Three apples and two more make five. Both sides weigh the same.', 'ثلاث تفاحات واثنتان أخريان تصنع خمسًا. الكفّتان متساويتان.'], html: function () { return row(['apple', 'apple', 'apple'], 40) + '<div class="rz-eq">+ 2 = 5</div>'; } }],
    guided: function (r) { return [balance(r)]; }, solo: balance, review: balance, soloN: 4
  });

  /* if-then: what the facts say, what they do not say. Sometimes the honest answer is that we cannot tell. */
  var IFS = [
    [['All the cups on this shelf are blue.', 'كل الأكواب على هذا الرف زرقاء.'], ['This cup is on the shelf.', 'هذا الكوب على الرف.'], ['Is it blue?', 'هل هو أزرق؟'], 'yes'],
    [['All the cups on this shelf are blue.', 'كل الأكواب على هذا الرف زرقاء.'], ['This cup is blue.', 'هذا الكوب أزرق.'], ['Is it on the shelf?', 'هل هو على الرف؟'], 'cant'],
    [['No fish in this pond can fly.', 'لا سمكة في هذه البركة تطير.'], ['Nemo lives in this pond.', 'نيمو يعيش في هذه البركة.'], ['Can Nemo fly?', 'هل يطير نيمو؟'], 'no'],
    [['Everyone in the masjid took off their shoes.', 'كل من في المسجد خلع حذاءه.'], ['Bilal is in the masjid.', 'بلال في المسجد.'], ['Is Bilal wearing shoes?', 'هل يلبس بلال حذاءه؟'], 'no'],
    [['Everyone in the masjid took off their shoes.', 'كل من في المسجد خلع حذاءه.'], ['Huda took off her shoes.', 'خلعت هدى حذاءها.'], ['Is Huda in the masjid?', 'هل هدى في المسجد؟'], 'cant'],
    [['All the birds in the cage are yellow.', 'كل الطيور في القفص صفراء.'], ['This bird is in the cage.', 'هذا الطائر في القفص.'], ['Is it yellow?', 'هل هو أصفر؟'], 'yes'],
    [['Every apple in the bowl is red.', 'كل تفاحة في الوعاء حمراء.'], ['This apple is green.', 'هذه التفاحة خضراء.'], ['Is it in the bowl?', 'هل هي في الوعاء؟'], 'no'],
    [['Some of the children are wearing hats.', 'بعض الأطفال يلبسون قبعات.'], ['Ali is one of the children.', 'عليّ أحد الأطفال.'], ['Is Ali wearing a hat?', 'هل يلبس عليّ قبعة؟'], 'cant']
  ];
  function ifThen(r) {
    var x = r.pick(IFS), A3 = { yes: ['Yes', 'نعم'], no: ['No', 'لا'], cant: ['We cannot tell', 'لا نستطيع أن نعرف'] };
    var keys = ['yes', 'no', 'cant'];
    return { k: 'choice', p: x[2], q: [x[0][0] + ' ' + x[1][0], x[0][1] + ' ' + x[1][1]], o: keys.map(function (k) { return { t: A3[k], ok: k === x[3], e: 'logic' }; }), shuffle: false, err: 'logic', cols: 1,
      hint: ['Only use what the sentences say. Is that enough to be sure?', 'استعمل ما تقوله الجمل فقط. هل يكفي لتتأكد؟'] };
  }
  C.add('t.if', {
    title: ['If this, then that?', 'إذا كان هذا، فهل ذاك؟'], art: 'key', needs: ['t.balance'],
    meet: [{ k: 'say', p: ['All the cups on the shelf are blue. A blue cup could be anywhere, so we cannot tell if it is on the shelf.', 'كل الأكواب على الرف زرقاء. لكن الكوب الأزرق قد يكون في أي مكان، فلا نستطيع أن نعرف أهو على الرف.'], arts: ['cup', 'cup', 'cup'] }],
    guided: function (r) { return [ifThen(r)]; }, solo: ifThen, review: ifThen, soloN: 4
  });

  /* ================= Year 3: words that think ================= */
  var u3 = C.unit('think', 't-words', ['Words that think', 'كلمات تفكّر'], 2); u3.y = 3;
  var WK = {
    colour: [['red', 'أحمر'], ['blue', 'أزرق'], ['green', 'أخضر'], ['yellow', 'أصفر'], ['white', 'أبيض']],
    animal: [['lion', 'أسد'], ['camel', 'جمل'], ['horse', 'حصان'], ['tiger', 'نمر'], ['rabbit', 'أرنب']],
    shape: [['circle', 'دائرة'], ['square', 'مربع'], ['triangle', 'مثلث'], ['rectangle', 'مستطيل']],
    body: [['arm', 'ذراع'], ['leg', 'ساق'], ['head', 'رأس'], ['knee', 'رُكبة'], ['shoulder', 'كتف']],
    month: [['Ramaḍān', 'رمضان'], ['Shaʿbān', 'شعبان'], ['Rajab', 'رجب'], ['Muḥarram', 'محرّم']],
    drink: [['water', 'ماء'], ['milk', 'حليب'], ['juice', 'عصير'], ['tea', 'شاي']],
    planet: [['Mars', 'المرّيخ'], ['Venus', 'الزُّهَرة'], ['Earth', 'الأرض'], ['Jupiter', 'المشتري']]
  };
  var WKK = Object.keys(WK);
  function oddWord(r) {
    var k = r.pick(WKK), o = r.pick(WKK.filter(function (x) { return x !== k; }));
    var same = r.shuffle(WK[k]).slice(0, 3), odd = r.pick(WK[o]);
    return choiceOf(r, { t: odd }, same.map(function (w) { return { t: w }; }), ['Which word does not belong?', 'أيّ كلمة لا تنتمي إلى البقية؟'], 'category', { cols: 2, hint: ['What kind of thing are three of them?', 'ما نوع ثلاثة منها؟'] });
  }
  C.add('t.wodd', {
    title: ['The odd word out', 'الكلمة الغريبة'], art: 'book',
    meet: [{ k: 'say', p: ['Red, blue, green… and lion. Three are colours; lion does not belong.', 'أحمر، أزرق، أخضر… وأسد. ثلاثة ألوان، والأسد لا ينتمي.'], big: 'red · blue · green · lion' }],
    guided: function (r) { return [oddWord(r)]; }, solo: oddWord, review: oddWord, soloN: 4
  });

  var ANA = {
    young: [[['sheep', 'خروف'], ['lamb', 'حَمَل']], [['cow', 'بقرة'], ['calf', 'عِجل']], [['horse', 'حصان'], ['foal', 'مُهر']], [['lion', 'أسد'], ['cub', 'شِبل']], [['dog', 'كلب'], ['puppy', 'جَرو']], [['hen', 'دجاجة'], ['chick', 'فرخ']], [['camel', 'ناقة'], ['calf', 'حُوار']]],
    home: [[['bird', 'طائر'], ['nest', 'عُشّ']], [['bee', 'نحلة'], ['hive', 'خليّة']], [['lion', 'أسد'], ['den', 'عرين']], [['horse', 'حصان'], ['stable', 'إسطبل']]],
    part: [[['page', 'صفحة'], ['book', 'كتاب']], [['petal', 'بتلة'], ['flower', 'زهرة']], [['wheel', 'عجلة'], ['car', 'سيارة']], [['finger', 'إصبع'], ['hand', 'يد']], [['leaf', 'ورقة'], ['tree', 'شجرة']]],
    tool: [[['needle', 'إبرة'], ['tailor', 'خيّاط']], [['brush', 'فرشاة'], ['painter', 'رسّام']], [['hammer', 'مطرقة'], ['carpenter', 'نجّار']], [['oven', 'فرن'], ['baker', 'خبّاز']]],
    opp: OPP
  };
  var LINK = { young: ['its young', 'صغيره'], home: ['its home', 'مسكنه'], part: ['a part of it', 'جزء منه'], tool: ['who uses it', 'من يستعمله'], opp: ['its opposite', 'ضدّه'] };
  function analogy(r) {
    var k = r.pick(Object.keys(ANA)), two = r.shuffle(ANA[k]).slice(0, 2), x = two[0], y = two[1];
    var wrong = r.shuffle([].concat.apply([], Object.keys(ANA).filter(function (z) { return z !== k; }).map(function (z) { return ANA[z].map(function (p) { return p[1]; }); }))).slice(0, 2).concat([y[0]]);
    return choiceOf(r, { t: y[1] }, wrong.map(function (w) { return { t: w }; }), ['Finish it the same way.', 'أكملها بالطريقة نفسها.'], 'relation',
      { q: [x[0][0] + ' is to ' + x[1][0] + ' as ' + y[0][0] + ' is to ?', x[0][1] + ' إلى ' + x[1][1] + ' مثل ' + y[0][1] + ' إلى ؟'], cols: 2, hint: ['Say the link: the second word is ' + LINK[k][0] + '.', 'قل الصلة: الكلمة الثانية ' + LINK[k][1] + '.'] });
  }
  C.add('t.analogy', {
    title: ['Is to… as… is to', 'نسبة إلى… مثل'], art: 'key', needs: ['t.wodd'],
    meet: [{ k: 'say', p: ['Sheep is to lamb as cow is to calf: the second word is the young one.', 'الخروف إلى الحَمَل مثل البقرة إلى العِجل: الثانية هي الصغير.'], big: 'sheep : lamb :: cow : ?' }],
    guided: function (r) { return [analogy(r)]; }, solo: analogy, review: analogy, soloN: 4
  });

  var SYN = [[['big', 'كبير'], ['large', 'ضخم']], [['small', 'صغير'], ['tiny', 'ضئيل']], [['happy', 'سعيد'], ['glad', 'مسرور']], [['begin', 'بدأ'], ['start', 'شرع']], [['shut', 'أغلق'], ['close', 'أوصد']],
    [['rich', 'غنيّ'], ['wealthy', 'ثريّ']], [['brave', 'شجاع'], ['bold', 'جريء']], [['quiet', 'هادئ'], ['calm', 'ساكن']], [['angry', 'غاضب'], ['cross', 'حانق']], [['gift', 'هديّة'], ['present', 'عطيّة']]];
  function same(r) {
    var pr = r.pick(SYN), flip = r.bool(), w = flip ? pr[1] : pr[0], ans = flip ? pr[0] : pr[1], used = {}, wrong = [];
    used[ans[0]] = used[w[0]] = 1;
    /* the strongest wrong answer is the opposite, where the word has one: it is about the same thing, but not the same meaning */
    OPP.forEach(function (o) { [0, 1].forEach(function (i) { if ((o[i][0] === pr[0][0] || o[i][0] === pr[1][0]) && !used[o[1 - i][0]]) { wrong.push(o[1 - i]); used[o[1 - i][0]] = 1; } }); });
    r.shuffle(SYN.filter(function (x) { return x !== pr; })).forEach(function (x) { var c = x[r.bool() ? 0 : 1]; if (wrong.length < 3 && !used[c[0]]) { wrong.push(c); used[c[0]] = 1; } });
    return choiceOf(r, { t: ans }, wrong.slice(0, 3).map(function (x) { return { t: x }; }), ['Which word means nearly the same as “' + w[0] + '”?', 'أيّ كلمة تعني تقريبًا «' + w[1] + '»؟'], 'relation', { cols: 2, hint: ['Try it in a sentence: does the meaning stay the same?', 'جرّبها في جملة: هل يبقى المعنى نفسه؟'] });
  }
  C.add('t.same', {
    title: ['Words that mean the same', 'كلمات بمعنى واحد'], art: 'notebook', needs: ['t.analogy'],
    meet: [{ k: 'say', p: ['Big and large mean nearly the same. Try them in a sentence: a big house, a large house.', '«كبير» و«ضخم» بمعنى متقارب. جرّبهما في جملة: بيت كبير، بيت ضخم.'], big: 'big = large' }],
    guided: function (r) { return [same(r)]; }, solo: same, review: same, soloN: 4
  });

  /* English: two words make a new one. Arabic: one root, a family of words */
  var COMP = [['rain', 'bow'], ['foot', 'ball'], ['sun', 'flower'], ['tooth', 'brush'], ['butter', 'fly'], ['cup', 'board'], ['snow', 'man'], ['star', 'fish'], ['pan', 'cake'], ['home', 'work'], ['sea', 'shell'], ['bed', 'room']];
  var ROOTS = [['ك ت ب', ['كاتب', 'كتاب', 'مكتبة', 'مكتوب']], ['د ر س', ['مدرسة', 'دارس', 'درس', 'مدرّس']], ['ع ل م', ['عالِم', 'معلّم', 'علم', 'معلوم']], ['ج ل س', ['مجلس', 'جالس', 'جلوس', 'جلسة']], ['ف ت ح', ['مفتاح', 'فاتح', 'مفتوح', 'فتح']], ['س ج د', ['مسجد', 'ساجد', 'سجود', 'سجدة']]];
  function family(r) {
    if (isAr()) {
      var rt = r.pick(ROOTS), oth = r.pick(ROOTS.filter(function (x) { return x !== rt; })), three = r.shuffle(rt[1]).slice(0, 3), odd = r.pick(oth[1]);
      return choiceOf(r, { t: [odd, odd] }, three.map(function (w) { return { t: [w, w] }; }), ['Which word is not from the same family?', 'أيّ كلمة ليست من العائلة نفسها؟'], 'relation',
        { cols: 2, q: ['Three share the letters ' + rt[0], 'ثلاث منها تجمعها الحروف ' + rt[0]], hint: ['Look for the three root letters inside each word.', 'ابحث عن حروف الجذر الثلاثة في كل كلمة.'] });
    }
    var c = r.pick(COMP), wrong = r.shuffle(COMP.filter(function (x) { return x !== c; }).map(function (x) { return x[1]; })).slice(0, 3);
    return choiceOf(r, { t: [c[1], c[1]] }, wrong.map(function (w) { return { t: [w, w] }; }), ['Which word joins “' + c[0] + '” to make a new word?', 'أيّ كلمة تتصل بها لتصنع كلمة جديدة؟'], 'relation', { cols: 2, hint: ['Say them together, fast. Is it a real word?', 'قلهما معًا بسرعة. هل هي كلمة حقيقية؟'] });
  }
  C.add('t.family', {
    title: ['Word families', 'عائلات الكلمات'], art: 'tree', needs: ['t.same'],
    meet: [{ k: 'say', p: ['Rain and bow make rainbow. In Arabic, words grow from a root: miftāḥ, a key, grows from f-t-ḥ, to open.', 'في العربية تنمو الكلمات من جذر: «مفتاح» من «ف ت ح»، أي فَتَح. وكذلك «مفتوح» و«فاتح».'], big: 'ف ت ح → مفتاح' }],
    guided: function (r) { return [family(r)]; }, solo: family, review: family, soloN: 4
  });

  /* ================= Year 4: numbers that think ================= */
  var u4 = C.unit('think', 't-numbers', ['Numbers that think', 'أعداد تفكّر'], 2); u4.y = 4;
  function sequence(r) {
    var kind = r.int(0, 6), s = [], ans, why;
    if (kind === 0) { var k0 = r.int(3, 12), a0 = r.int(1, 30); for (var i = 0; i < 4; i++) s.push(a0 + i * k0); ans = a0 + 4 * k0; why = ['Add ' + k0 + ' each time.', 'أضف ' + ar(k0) + ' في كل مرة.']; }
    else if (kind === 1) { var k1 = r.int(3, 9), a1 = r.int(40, 90); for (var j = 0; j < 4; j++) s.push(a1 - j * k1); ans = a1 - 4 * k1; why = ['Take away ' + k1 + ' each time.', 'اطرح ' + ar(k1) + ' في كل مرة.']; }
    else if (kind === 2) { var a2 = r.int(1, 5); for (var m = 0; m < 4; m++) s.push(a2 * Math.pow(2, m)); ans = a2 * 16; why = ['Double each time.', 'ضاعف في كل مرة.']; }
    else if (kind === 3) { var a3 = r.int(1, 10); s = [a3, a3 + 1, a3 + 3, a3 + 6]; ans = a3 + 10; why = ['Add 1, then 2, then 3, then 4.', 'أضف ١ ثم ٢ ثم ٣ ثم ٤.']; }
    else if (kind === 4) { var b4 = r.int(1, 3); s = [b4 * b4, (b4 + 1) * (b4 + 1), (b4 + 2) * (b4 + 2), (b4 + 3) * (b4 + 3)]; ans = (b4 + 4) * (b4 + 4); why = ['Square numbers: each is a number times itself.', 'أعداد مربعة: كل عدد مضروب في نفسه.']; }
    else if (kind === 5) { var p5 = r.int(1, 4), q5 = r.int(1, 4); s = [p5, q5, p5 + q5, p5 + 2 * q5]; ans = 2 * p5 + 3 * q5; why = ['Each number is the two before it added together.', 'كل عدد مجموع العددين قبله.']; }
    else { var a6 = 16 * r.int(2, 6); s = [a6, a6 / 2, a6 / 4, a6 / 8]; ans = a6 / 16; why = ['Halve each time.', 'نصّف في كل مرة.']; }
    return pad(s.join(', ') + ', ?', ans, ['What comes next?', 'ما الذي يأتي بعد ذلك؟'], 'pattern', { hint: why, eqAr: s.map(ar).join('، ') + '، ؟' });
  }
  C.add('t.seq', {
    title: ['Number sequences', 'متتاليات الأعداد'], art: 'abacus',
    meet: [{ k: 'say', p: ['Look at how each number changes: 3, 6, 12, 24. It doubles. Next is 48.', 'انظر كيف يتغير كل عدد: ٣، ٦، ١٢، ٢٤. يتضاعف. التالي ٤٨.'], big: '3 → 6 → 12 → 24 → ?' }],
    guided: function (r) { return [sequence(r)]; }, solo: sequence, review: sequence, soloN: 5
  });

  var RULES = [[function (x) { return 2 * x + 1; }, ['double it, then add 1', 'ضاعفه ثم أضف ١']], [function (x) { return x + 7; }, ['add 7', 'أضف ٧']], [function (x) { return 3 * x; }, ['times 3', 'اضربه في ٣']], [function (x) { return x * x; }, ['times itself', 'اضربه في نفسه']], [function (x) { return 2 * x - 1; }, ['double it, then take 1', 'ضاعفه ثم اطرح ١']], [function (x) { return 10 * x - 5; }, ['times 10, then take 5', 'اضربه في ١٠ ثم اطرح ٥']]];
  function machine(r) {
    var rule = r.pick(RULES), xs = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3), f = rule[0];
    var html = '<div class="rz-mach">' + xs.map(function (x, i) { return '<div class="rz-mr"><b>' + (isAr() ? ar(x) : x) + '</b><span>→</span><b>' + (i < 2 ? (isAr() ? ar(f(x)) : f(x)) : '?') + '</b></div>'; }).join('') + '</div>';
    return pad('?', f(xs[2]), ['The machine does the same thing to every number. What comes out?', 'الآلة تفعل الشيء نفسه بكل عدد. ماذا يخرج؟'], 'pattern', { html: html, qHtml: html, hint: ['Try: ' + rule[1][0] + '?', 'جرّب: ' + rule[1][1] + '؟'] });
  }
  C.add('t.machine', {
    title: ['Number machines', 'آلة الأعداد'], art: 'gear', needs: ['t.seq'],
    meet: [{ k: 'say', p: ['In goes 3, out comes 7. In goes 5, out comes 11. The rule: double it, then add 1.', 'يدخل ٣ فيخرج ٧، ويدخل ٥ فيخرج ١١. القاعدة: ضاعفه ثم أضف ١.'], big: '3 → 7 · 5 → 11' }],
    guided: function (r) { return [machine(r)]; }, solo: machine, review: machine, soloN: 4
  });

  function symbols(r) {
    var kind = r.int(0, 2), t = r.int(2, 12), q = r.int(2, 12), eqs, ans;
    if (kind === 0) { eqs = ['▲ + ▲ = ' + 2 * t]; ans = t; }
    else if (kind === 1) { eqs = ['▲ = ' + t, '▲ + ■ = ' + (t + q)]; ans = q; }
    else { eqs = ['▲ = ' + t, '■ + ■ + ▲ = ' + (2 * q + t)]; ans = q; }
    var who = kind === 0 ? '▲' : '■';
    var html = '<div class="rz-sym">' + eqs.map(function (e) { return '<div>' + (isAr() ? ar(e) : e) + '</div>'; }).join('') + '</div>';
    return pad(who + ' = ?', ans, ['Each shape stands for one number. What is ' + who + '?', 'كل شكل يرمز إلى عدد واحد. ما قيمة ' + who + '؟'], 'two-step', { html: html, qHtml: html, hint: kind === 0 ? ['Two of the same make ' + 2 * t + '. Halve it.', 'اثنان متساويان يصنعان ' + ar(2 * t) + '. نصّفه.'] : ['Use what you know first: ▲ is ' + t + '.', 'ابدأ بما تعرفه: ▲ تساوي ' + ar(t) + '.'] });
  }
  C.add('t.symbols', {
    title: ['Shapes for numbers', 'أشكال بدل الأعداد'], art: 'gem', needs: ['t.machine'],
    meet: [{ k: 'say', p: ['▲ + ▲ = 10, so each ▲ is 5. If ▲ + ■ = 12, then ■ is 7.', '▲ + ▲ = ١٠، فكل ▲ تساوي ٥. وإذا كانت ▲ + ■ = ١٢ فإن ■ تساوي ٧.'], big: '▲ + ▲ = 10' }],
    guided: function (r) { return [symbols(r)]; }, solo: symbols, review: symbols, soloN: 4
  });

  /* ================= Year 5: codes and logic ================= */
  var u5 = C.unit('think', 't-logic', ['Codes and logic', 'الرموز والمنطق'], 2); u5.y = 5;
  var ABC = { en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), ar: 'ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي'.split(' ') };
  function letters(r) {
    var al = isAr() ? ABC.ar : ABC.en, step = r.pick([1, 2, 2, 3, -1, -2]), start = step > 0 ? r.int(0, al.length - 1 - 4 * step) : r.int(-4 * step, al.length - 1);
    var s = []; for (var i = 0; i < 4; i++) s.push(al[start + i * step]);
    var ans = al[start + 4 * step], wrong = [al[start + 4 * step + (step > 0 ? 1 : -1)], al[start + 3 * step + (step > 0 ? 1 : -1)], al[start + 5 * step]].filter(function (x, i, a) { return x && x !== ans && a.indexOf(x) === i; });
    while (wrong.length < 3) { var w = r.pick(al); if (w !== ans && wrong.indexOf(w) < 0) wrong.push(w); }
    return choiceOf(r, { t: [ans, ans] }, wrong.map(function (x) { return { t: [x, x] }; }), ['Which letter comes next?', 'أيّ حرف يأتي بعد ذلك؟'], 'pattern',
      { q: [s.join(', ') + ', ?', s.join('، ') + '، ؟'], qAr: isAr(), cols: 2, large: true, hint: ['Count how many letters it jumps each time.', 'عُدّ كم حرفًا يقفز في كل مرة.'] });
  }
  C.add('t.letters', {
    title: ['Letter patterns', 'أنماط الحروف'], art: 'letter',
    meet: [{ k: 'say', p: ['A, C, E, G… it skips one letter each time. Next is I.', 'ا، ت، ج، خ… يقفز حرفًا في كل مرة في ترتيب الحروف. التالي ذ.'], big: 'A · C · E · G · ?' }],
    guided: function (r) { return [letters(r)]; }, solo: letters, review: letters, soloN: 4
  });

  var CW = { en: ['CAT', 'DOG', 'SUN', 'HAT', 'PEN', 'MAP', 'CUP', 'BED', 'FISH', 'MOON'], ar: ['قلم', 'باب', 'شمس', 'بيت', 'نور', 'كتب', 'جمل', 'سمك'] };
  function code(r) {
    var lang = isAr() ? 'ar' : 'en', al = ABC[lang], shift = r.pick([1, 2, -1]), words = r.shuffle(CW[lang]).slice(0, 2);
    var enc = function (wd, sh) { return wd.split('').map(function (c) { var i = al.indexOf(c); return i < 0 ? c : al[(i + sh + al.length) % al.length]; }).join(''); };
    var ans = enc(words[1], shift), wrong = [enc(words[1], shift + 1), enc(words[1], -shift), enc(words[1], shift * 2)].filter(function (x, i, a) { return x !== ans && a.indexOf(x) === i; });
    return choiceOf(r, { t: [ans, ans] }, wrong.map(function (x) { return { t: [x, x] }; }), ['Crack the code.', 'فُكّ الرمز.'], 'pattern',
      { q: ['If ' + words[0] + ' is written ' + enc(words[0], shift) + ', how is ' + words[1] + ' written?', 'إذا كُتبت «' + words[0] + '» هكذا «' + enc(words[0], shift) + '»، فكيف تُكتب «' + words[1] + '»؟'], cols: 2, large: true, hint: ['How far does the first letter move in the alphabet?', 'كم ينتقل الحرف الأول في ترتيب الحروف؟'] });
  }
  C.add('t.code', {
    title: ['Secret codes', 'الرموز السرية'], art: 'lock', needs: ['t.letters'],
    meet: [{ k: 'say', p: ['Move every letter one place on: CAT becomes DBU. Every letter moves the same way.', 'انقل كل حرف خطوة واحدة في الترتيب: «قلم» تصبح «كمن». كل الحروف تنتقل بالطريقة نفسها.'], big: 'CAT → DBU' }],
    guided: function (r) { return [code(r)]; }, solo: code, review: code, soloN: 4
  });

  var PEOPLE = [['Ali', 'عليّ'], ['Sara', 'سارة'], ['Musa', 'موسى'], ['Huda', 'هدى'], ['Bilal', 'بلال'], ['Maryam', 'مريم']];
  var COMPS = [[['taller', 'أطول'], ['tallest', 'الأطول'], ['shortest', 'الأقصر']], [['older', 'أكبر'], ['oldest', 'الأكبر'], ['youngest', 'الأصغر']], [['faster', 'أسرع'], ['fastest', 'الأسرع'], ['slowest', 'الأبطأ']]];
  function ordering(r) {
    var n = r.int(3, 4), ppl = r.shuffle(PEOPLE).slice(0, n), cm = r.pick(COMPS), clues = [];
    for (var i = 0; i < n - 1; i++) clues.push([ppl[i][0] + ' is ' + cm[0][0] + ' than ' + ppl[i + 1][0] + '.', ppl[i][1] + ' ' + cm[0][1] + ' من ' + ppl[i + 1][1] + '.']);
    clues = r.shuffle(clues);
    var askTop = r.bool(), ans = askTop ? ppl[0] : ppl[n - 1];
    return choiceOf(r, { t: ans }, ppl.filter(function (x) { return x !== ans; }).map(function (x) { return { t: x }; }), askTop ? ['Who is the ' + cm[1][0] + '?', 'مَن ' + cm[1][1] + '؟'] : ['Who is the ' + cm[2][0] + '?', 'مَن ' + cm[2][1] + '؟'], 'logic',
      { q: [clues.map(function (c) { return c[0]; }).join(' '), clues.map(function (c) { return c[1]; }).join(' ')], cols: 2, hint: ['Put them in a line, one clue at a time.', 'رتّبهم في صفّ، دليلًا بعد دليل.'] });
  }
  C.add('t.order', {
    title: ['Who is first?', 'مَن الأول؟'], art: 'ladder', needs: ['t.code'],
    meet: [{ k: 'say', p: ['Ali is taller than Sara. Sara is taller than Musa. In a line: Ali, Sara, Musa. Ali is tallest.', 'عليّ أطول من سارة، وسارة أطول من موسى. في صفّ: عليّ، سارة، موسى. عليّ الأطول.'], big: 'Ali > Sara > Musa' }],
    guided: function (r) { return [ordering(r)]; }, solo: ordering, review: ordering, soloN: 4
  });

  function twoStep(r) {
    var k = r.int(0, 3), p, a, h;
    if (k === 0) { var bx = r.int(3, 8), per = r.pick([6, 10, 12]), used = r.int(2, per); a = bx * per - used; p = [bx + ' boxes each hold ' + per + ' eggs. ' + used + ' eggs are used. How many are left?', 'في ' + ar(bx) + ' علب، في كل علبة ' + ar(per) + ' بيضة. استُعملت ' + ar(used) + '. كم بقي؟']; h = ['First: how many eggs in all?', 'أولًا: كم بيضة في المجموع؟']; }
    else if (k === 1) { var bk = r.int(12, 40), less = r.int(3, bk - 5); a = bk + (bk - less); p = ['A book costs ' + bk + ' riyals. A pen costs ' + less + ' riyals less. How much for both?', 'ثمن كتاب ' + ar(bk) + ' ريالًا، والقلم أرخص منه بـ' + ar(less) + '. كم ثمنهما معًا؟']; h = ['First: what does the pen cost?', 'أولًا: كم ثمن القلم؟']; }
    else if (k === 2) { var kids = r.int(3, 6), each = r.int(4, 9), give = r.int(1, each - 1); a = each - give; p = [kids + ' children share ' + kids * each + ' dates equally. Then each gives ' + give + ' away. How many does each have now?', 'يقتسم ' + ar(kids) + ' أطفال ' + ar(kids * each) + ' تمرة بالتساوي، ثم يعطي كل منهم ' + ar(give) + '. كم بقي مع كل واحد؟']; h = ['First: how many does each get?', 'أولًا: كم ينال كل واحد؟']; }
    else { var rows = r.int(5, 12), per2 = r.int(3, 6), full = r.int(1, rows - 1); a = (rows - full) * per2; p = ['A bus has ' + rows + ' rows of ' + per2 + ' seats. ' + full + ' rows are full. How many seats are empty?', 'في حافلة ' + ar(rows) + ' صفوف، في كل صف ' + ar(per2) + ' مقاعد. ' + ar(full) + ' صفوف ممتلئة. كم مقعدًا فارغًا؟']; h = ['First: how many rows are empty?', 'أولًا: كم صفًّا فارغًا؟']; }
    return pad('?', a, p, 'two-step', { hint: h });
  }
  C.add('t.two', {
    title: ['Two steps to the answer', 'خطوتان إلى الجواب'], art: 'compass', needs: ['t.order'],
    meet: [{ k: 'say', p: ['4 boxes of 6 eggs is 24. Use 5, and 19 are left. Two steps: find the whole, then take away.', '٤ علب في كل منها ٦ بيضات = ٢٤. استُعملت ٥ فبقي ١٩. خطوتان: اعرف الكل، ثم اطرح.'], big: '4 × 6 = 24 → 24 − 5 = 19' }],
    guided: function (r) { return [twoStep(r)]; }, solo: twoStep, review: twoStep, soloN: 4
  });
})();
