/* Arabic: from the first letter to real Qurʾānic words, then to nouns, verbs, sentences and roots.
   Letters are taught in families of look-alikes, so dots become the point. First reading uses real Qurʾān words with real recitation.
   Letter sounds are not religious text; the parent can record over any of them. */
(function () {
  'use strict';
  var A = window.A, I = window.I, C = window.C;
  var ar = function (x) { return String(x).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }); };
  var LET = [
    { ch: 'ا', name: 'أَلِف', en: 'alif', join: false, tip: ['Tall and straight. It never joins the letter after it.', 'طويلة مستقيمة. لا تتصل بما بعدها.'] },
    { ch: 'ب', name: 'بَاء', en: 'bāʾ', tip: ['A boat with one dot below.', 'قارب تحته نقطة.'] },
    { ch: 'ت', name: 'تَاء', en: 'tāʾ', tip: ['The same boat, two dots above.', 'القارب نفسه وفوقه نقطتان.'] },
    { ch: 'ث', name: 'ثَاء', en: 'thāʾ', tip: ['Three dots above. Put your tongue between your teeth.', 'ثلاث نقاط فوقه. ضع لسانك بين أسنانك.'] },
    { ch: 'ج', name: 'جِيم', en: 'jīm', tip: ['A bowl with one dot inside.', 'وعاء داخله نقطة.'] },
    { ch: 'ح', name: 'حَاء', en: 'ḥāʾ', tip: ['No dot. A soft breath from deep in the throat.', 'بلا نقطة. نَفَس لطيف من وسط الحلق.'] },
    { ch: 'خ', name: 'خَاء', en: 'khāʾ', tip: ['One dot on top. A rough sound at the top of the throat.', 'نقطة فوقه. صوت خشن من أعلى الحلق.'] },
    { ch: 'د', name: 'دَال', en: 'dāl', join: false, tip: ['A small bent shape, no dot.', 'شكل صغير منحنٍ بلا نقطة.'] },
    { ch: 'ذ', name: 'ذَال', en: 'dhāl', join: false, tip: ['The same, one dot. Tongue between your teeth.', 'مثله بنقطة. لسانك بين أسنانك.'] },
    { ch: 'ر', name: 'رَاء', en: 'rāʾ', join: false, tip: ['A slide down below the line.', 'انحدار تحت السطر.'] },
    { ch: 'ز', name: 'زَاي', en: 'zāy', join: false, tip: ['The same slide with a dot.', 'الانحدار نفسه بنقطة.'] },
    { ch: 'س', name: 'سِين', en: 'sīn', tip: ['Three little teeth and a bowl.', 'ثلاث أسنان صغيرة ووعاء.'] },
    { ch: 'ش', name: 'شِين', en: 'shīn', tip: ['The same teeth, three dots: shh.', 'الأسنان نفسها بثلاث نقاط: ش.'] },
    { ch: 'ص', name: 'صَاد', en: 'ṣād', tip: ['A loop and a bowl. A heavy s.', 'حلقة ووعاء. سين مفخمة.'] },
    { ch: 'ض', name: 'ضَاد', en: 'ḍād', tip: ['The same with a dot. Arabic is called the language of ḍād.', 'مثله بنقطة. وتسمى العربية لغة الضاد.'] },
    { ch: 'ط', name: 'طَاء', en: 'ṭāʾ', tip: ['A loop and a tall line. A heavy t.', 'حلقة وخط طويل. تاء مفخمة.'] },
    { ch: 'ظ', name: 'ظَاء', en: 'ẓāʾ', tip: ['The same with a dot. Heavy, tongue between the teeth.', 'مثله بنقطة. مفخم واللسان بين الأسنان.'] },
    { ch: 'ع', name: 'عَيْن', en: 'ʿayn', tip: ['From the middle of the throat. Listen well.', 'من وسط الحلق. أنصت جيدًا.'] },
    { ch: 'غ', name: 'غَيْن', en: 'ghayn', tip: ['The same with a dot. A soft gargle.', 'مثله بنقطة. غرغرة لطيفة.'] },
    { ch: 'ف', name: 'فَاء', en: 'fāʾ', tip: ['A small loop with one dot above.', 'حلقة صغيرة فوقها نقطة.'] },
    { ch: 'ق', name: 'قَاف', en: 'qāf', tip: ['A deeper bowl with two dots. From the back of the tongue.', 'وعاء أعمق بنقطتين. من أقصى اللسان.'] },
    { ch: 'ك', name: 'كَاف', en: 'kāf', tip: ['Tall, with a small shape inside.', 'طويلة داخلها شكل صغير.'] },
    { ch: 'ل', name: 'لَام', en: 'lām', tip: ['Tall with a hook below.', 'طويلة وتحتها خطاف.'] },
    { ch: 'م', name: 'مِيم', en: 'mīm', tip: ['A small round head and a tail.', 'رأس مستدير صغير وذيل.'] },
    { ch: 'ن', name: 'نُون', en: 'nūn', tip: ['A deep bowl with one dot.', 'وعاء عميق بنقطة.'] },
    { ch: 'ه', name: 'هَاء', en: 'hāʾ', tip: ['A round letter, a gentle breath.', 'حرف مستدير ونَفَس لطيف.'] },
    { ch: 'و', name: 'وَاو', en: 'wāw', join: false, tip: ['A round head and a tail that dips.', 'رأس مستدير وذيل نازل.'] },
    { ch: 'ي', name: 'يَاء', en: 'yāʾ', tip: ['Two dots below.', 'نقطتان تحته.'] }
  ];
  var BY = {}; LET.forEach(function (l) { BY[l.ch] = l; });
  C.LETTERS = LET;
  /* at most two new letters in a sitting, look-alikes side by side so the dots become the point */
  var FAM = [
    ['a.l1', ['ا', 'ب'], ['Alif and the boat', 'الألف والقارب'], 'ن'],
    ['a.l2', ['ت', 'ث'], ['More boat letters', 'حروف قارب أخرى'], 'ن'],
    ['a.l3', ['ج', 'ح'], ['The bowl letters', 'حروف الوعاء'], 'ع'],
    ['a.l4', ['خ'], ['Khāʾ, with its dot on top', 'الخاء ونقطتها'], 'ع'],
    ['a.l5', ['د', 'ذ'], ['Dāl and dhāl', 'الدال والذال'], 'و'],
    ['a.l6', ['ر', 'ز'], ['Rāʾ and zāy', 'الراء والزاي'], 'و'],
    ['a.l7', ['س', 'ش'], ['The teeth letters', 'حروف الأسنان'], 'ط'],
    ['a.l8', ['ص', 'ض'], ['The loop letters', 'حروف الحلقة'], 'ط'],
    ['a.l9', ['ط', 'ظ'], ['The tall loops', 'الحلقات الطويلة'], 'ح'],
    ['a.l10', ['ع', 'غ'], ['From the throat', 'من الحلق'], 'ح'],
    ['a.l11', ['ف', 'ق'], ['Fāʾ and qāf', 'الفاء والقاف'], 'م'],
    ['a.l12', ['ك', 'ل'], ['The tall letters', 'الحروف الطويلة'], 'م'],
    ['a.l13', ['م', 'ن'], ['Mīm and nūn', 'الميم والنون'], 'ب'],
    ['a.l14', ['ه', 'و'], ['Hāʾ and wāw', 'الهاء والواو'], 'ب'],
    ['a.l15', ['ي'], ['Yāʾ, the last letter', 'الياء آخر الحروف'], 'ب']
  ];
  C.FAM = FAM;
  function known(sk) { var all = []; for (var i = 0; i < FAM.length; i++) { all = all.concat(FAM[i][1]); if (FAM[i][0] === sk) break; } return all; }
  /* the new letters, then enough earlier ones to make three pairs: remembering is built into every lesson */
  function withEarlier(f) { var old = known(f[0]).filter(function (x) { return f[1].indexOf(x) < 0; }); return f[1].concat(old.slice(-Math.max(0, 3 - f[1].length))); }
  function pickLetter(r, fam, pool) {
    var t = r.pick(fam), ds = r.shuffle(pool.filter(function (x, i) { return x !== t && pool.indexOf(x) === i; })).slice(0, 3);
    return { k: 'choice', p: ['Which letter do you hear?', 'أي حرف تسمع؟'], cols: 2, err: 'letter-shape', listen: function () { Voice.say(BY[t].name, { lang: 'ar', key: 'ar_' + t }); }, hint: [BY[t].en + ': ' + A.L(BY[t].tip), BY[t].name + ': ' + (BY[t].tip[1])], o: [t].concat(ds).map(function (x) { return { t: x, ar: true, ok: x === t, e: BY[x] && Math.abs(LET.indexOf(BY[x]) - LET.indexOf(BY[t])) <= 2 ? 'letter-shape' : 'letter-sound' }; }), artSize: 0, large: true };
  }
  C.room('arabic', { name: ['Arabic', 'العربية'], hue: 'rose', art: 'pencil', tag: ['The language of the Qurʾān, one letter at a time', 'لغة القرآن حرفًا حرفًا'] });
  C.unit('arabic', 'a-letters', ['The letters', 'الحروف'], 1);
  FAM.forEach(function (f) {
    C.add(f[0], {
      title: f[2], art: 'pencil', glyph: f[1].join(' '), soloN: 3,
      meet: f[1].map(function (ch) { return { k: 'letter', d: BY[ch], p: ['Touch it. Hear its name.', 'المسه واسمع اسمه.'], silent: true }; }),
      guided: function (r) { return [{ k: 'match', p: ['Match each letter to its name.', 'صِل كل حرف باسمه.'], err: 'letter-shape', hint: ['Look at the dots. Where are they? How many?', 'انظر إلى النقاط: أين هي وكم عددها؟'], pairs: withEarlier(f).map(function (ch) { return [{ t: ch, ar: true }, { t: BY[ch].name, ar: true }]; }) }]; },
      solo: function (r) { return pickLetter(r, f[1], known(f[0]).concat(f[3])); },
      make: f[1].map(function (ch, i) { return { k: 'trace', set: 'ar', ch: ch, p: ['Write ' + BY[ch].en + '. Follow the light.', 'اكتب ' + BY[ch].name + '. اتبع الضوء.'], ghost: true }; }),
      review: function (r) { var t = r.pick(f[1]); return r() < .5 ? pickLetter(r, f[1], known(f[0]).concat(f[3])) : { k: 'trace', set: 'ar', ch: t, p: ['Write ' + BY[t].en + ' from memory.', 'اكتب ' + BY[t].name + ' من ذاكرتك.'], ghost: false, hint: ['Start from the right.', 'ابدأ من اليمين.'], onHint: null }; }
    });
  });

  /* ---------- vowels ---------- */
  C.unit('arabic', 'a-vowels', ['Sounds and vowels', 'الأصوات والحركات'], 1);
  var HAR = { 'َ': ['fatḥah', 'a', 'فَتْحَة'], 'ِ': ['kasrah', 'i', 'كَسْرَة'], 'ُ': ['ḍammah', 'u', 'ضَمَّة'] };
  function cv(r, marks, set) {
    var lt = r.pick(set), m = r.pick(marks), v = lt + m, all = marks.map(function (x) { return lt + x; });
    var o = all.length > 1 ? all : set.slice(0, 3).map(function (x) { return x + m; });
    if (o.indexOf(v) < 0) o[0] = v;
    return { k: 'choice', p: ['Which sound do you hear?', 'أي صوت تسمع؟'], cols: 3, err: 'haraka', large: true, listen: function () { Voice.say(v, { lang: 'ar', key: 'ar_' + v }); }, hint: ['Fatḥah opens the mouth. Kasrah smiles. Ḍammah rounds.', 'الفتحة تفتح الفم، والكسرة ابتسامة، والضمة استدارة.'], o: o.map(function (x) { return { t: x, ar: true, ok: x === v }; }) };
  }
  var EASY = ['ب', 'م', 'ن', 'ل', 'د', 'س', 'ر', 'ك', 'ت'];
  C.add('a.fatha', {
    title: ['Fatḥah: the open sound', 'الفتحة'], art: 'star', needs: ['a.l15'],
    meet: [{ k: 'say', p: ['Letters need a small mark to speak. This one above says a.', 'تحتاج الحروف إلى علامة صغيرة لتنطق. هذه فوق الحرف تقول: فتحة.'], big: 'بَ', bigAr: true }, { k: 'blend', letters: ['ب', 'م', 'ن', 'ل'], marks: [['َ', 'fatḥah', 'a']], p: ['Touch a letter. Hear it speak.', 'المس حرفًا واسمعه ينطق.'] }],
    solo: function (r) { var t = r.pick(EASY), ds = r.shuffle(EASY.filter(function (x) { return x !== t; })).slice(0, 2); return { k: 'choice', p: ['Which do you hear?', 'أيها تسمع؟'], cols: 3, large: true, err: 'letter-sound', listen: function () { Voice.say(t + 'َ', { lang: 'ar', key: 'ar_' + t + 'َ' }); }, o: [t].concat(ds).map(function (x) { return { t: x + 'َ', ar: true, ok: x === t }; }) }; },
    review: function (r) { var t = r.pick(EASY); return { k: 'choice', p: ['Which do you hear?', 'أيها تسمع؟'], cols: 2, large: true, err: 'letter-sound', listen: function () { Voice.say(t + 'َ', { lang: 'ar' }); }, o: [{ t: t + 'َ', ar: true, ok: true }, { t: r.pick(EASY.filter(function (x) { return x !== t; })) + 'َ', ar: true }] }; }
  });
  C.add('a.harakat', {
    title: ['Three short vowels', 'الحركات الثلاث'], art: 'star',
    meet: [{ k: 'say', p: ['Above for a, below for i, a little wāw above for u.', 'فوق الحرف فتحة، وتحته كسرة، وفوقه واو صغيرة ضمة.'], big: 'بَ  بِ  بُ', bigAr: true }, { k: 'blend', letters: EASY.slice(0, 5), p: ['Mix a letter with a vowel. Listen.', 'امزج حرفًا بحركة واستمع.'] }],
    solo: function (r) { return cv(r, ['َ', 'ِ', 'ُ'], EASY); }, soloN: 4,
    make: function (r) { var l = r.pick(EASY); return { k: 'mission', art: 'hand', t: ['Say ' + BY[l].en + ' with each vowel to someone, slowly. Watch your mouth change.', 'قل ' + BY[l].name + ' بكل حركة لأحدهم ببطء. لاحظ حركة فمك.'] }; },
    review: function (r) { return cv(r, ['َ', 'ِ', 'ُ'], EASY); }
  });
  C.add('a.long', {
    title: ['Long vowels', 'حروف المد'], art: 'star',
    meet: [{ k: 'say', p: ['Alif, wāw and yāʾ stretch a vowel to two beats.', 'الألف والواو والياء تمدّ الحركة حركتين.'], big: 'بَا  بُو  بِي', bigAr: true }],
    solo: function (r) { var l = r.pick(EASY), set = [l + 'َا', l + 'ُو', l + 'ِي'], t = r.pick(set); return { k: 'choice', p: ['Which long sound do you hear?', 'أي مد تسمع؟'], cols: 3, large: true, err: 'haraka', listen: function () { Voice.say(t, { lang: 'ar', key: 'ar_' + t }); }, hint: ['Hear the a, i or u, stretched.', 'اسمع الحركة ممدودة.'], o: set.map(function (x) { return { t: x, ar: true, ok: x === t }; }) }; },
    review: function (r) { var l = r.pick(EASY), set = [l + 'َا', l + 'ُو', l + 'ِي'], t = r.pick(set); return { k: 'choice', p: ['Which do you hear?', 'أيها تسمع؟'], cols: 3, large: true, err: 'haraka', listen: function () { Voice.say(t, { lang: 'ar' }); }, o: set.map(function (x) { return { t: x, ar: true, ok: x === t }; }) }; }
  });
  C.add('a.sukun', {
    title: ['Sukūn and shaddah', 'السكون والشدة'], art: 'moon',
    meet: [{ k: 'say', p: ['Sukūn stops a letter still. Shaddah says a letter twice: first still, then moving.', 'السكون يوقف الحرف. والشدة تجعل الحرف حرفين: ساكنًا فمتحركًا.'], big: 'مِنْ  رَبّ', bigAr: true }],
    solo: function (r) { var isS = r.bool(); return { k: 'choice', p: isS ? ['Which has a sukūn?', 'أيها فيه سكون؟'] : ['Which has a shaddah?', 'أيها فيه شدة؟'], cols: 2, err: 'haraka', large: true, hint: ['Sukūn is a little circle. Shaddah looks like a small w.', 'السكون دائرة صغيرة. والشدة كالسين الصغيرة.'], o: [{ t: 'مِنْ', ar: true, ok: isS }, { t: 'رَبِّ', ar: true, ok: !isS }, { t: 'بِ', ar: true }, { t: 'مَا', ar: true }] }; },
    review: function (r) { return { k: 'choice', p: ['Which has a shaddah?', 'أيها فيه شدة؟'], cols: 2, err: 'haraka', large: true, o: [{ t: 'رَبِّ', ar: true, ok: true }, { t: 'مِنْ', ar: true }] }; }
  });
  C.add('a.tanwin', {
    title: ['Tanwīn: the doubled mark', 'التنوين'], art: 'star',
    meet: [{ k: 'say', p: ['Two marks together add an n sound at the end: -an, -in, -un.', 'العلامتان معًا تضيفان نونًا في النطق: ـًا ـٍ ـٌ.'], big: 'كِتَابٌ', bigAr: true }],
    solo: function (r) { var m = r.pick([['ً', 'an'], ['ٍ', 'in'], ['ٌ', 'un']]), l = r.pick(EASY), t = l + m[0], all = [l + 'ً', l + 'ٍ', l + 'ٌ']; return { k: 'choice', p: ['Which do you hear?', 'أيها تسمع؟'], cols: 3, large: true, err: 'haraka', listen: function () { Voice.say(t, { lang: 'ar', key: 'ar_' + t }); }, o: all.map(function (x) { return { t: x, ar: true, ok: x === t }; }) }; },
    review: function (r) { var l = r.pick(EASY); return { k: 'choice', p: ['Which says -un?', 'أيها فيه ضمتان؟'], cols: 3, large: true, err: 'haraka', o: [{ t: l + 'ٌ', ar: true, ok: true }, { t: l + 'ً', ar: true }, { t: l + 'ٍ', ar: true }] }; }
  });

  /* ---------- first reading: real Qurʾān words, real recitation ---------- */
  C.unit('arabic', 'a-read', ['First reading', 'القراءة الأولى'], 1);
  var WD = function (s, a, i) { var v = window.QURAN.q[s].v[a - 1][1], w = Voice.words(v)[i - 1]; return { s: s, a: a, i: i, t: w.t.split(' ')[0] }; };
  var READ = [
    { id: 'a.read1', title: ['Short words from the Qurʾān', 'كلمات قصيرة من القرآن'], w: [[112, 1, 1], [112, 1, 2], [112, 3, 1], [108, 2, 1], [1, 2, 3], [1, 4, 2]] },
    { id: 'a.read2', title: ['Words from al-Fātiḥah', 'كلمات من الفاتحة'], w: [[1, 1, 1], [1, 2, 1], [1, 3, 1], [1, 5, 2], [1, 5, 4], [1, 6, 1]] },
    { id: 'a.read3', title: ['Words from the last sūrahs', 'كلمات من قصار السور'], w: [[112, 1, 4], [112, 2, 2], [112, 3, 2], [114, 1, 3], [114, 2, 1], [103, 1, 1]] }
  ];
  READ.forEach(function (rd) {
    C.add(rd.id, {
      title: rd.title, art: 'book', quiet: true, soloN: 4,
      meet: [{ k: 'say', p: ['These are real words of the Qurʾān. Handle them gently. Listen, then read.', 'هذه كلمات من القرآن. استمع إليها بأدب ثم اقرأ.'], art: 'book' }].concat(rd.w.slice(0, 3).map(function (x) {
        return { k: 'say', p: ['Listen and read.', 'استمع واقرأ.'], silent: true, html: function () { var w = WD(x[0], x[1], x[2]); return '<button class="quran" data-a="wd-hear" data-s="' + x[0] + '" data-v="' + x[1] + '" data-i="' + x[2] + '" style="font-size:64px">' + w.t + '</button>'; }, mount: function () { Voice.word(x[0], x[1], x[2]); } };
      })),
      solo: function (r) { var pool = r.shuffle(rd.w), t = pool[0], W = WD(t[0], t[1], t[2]); return { k: 'choice', p: ['Which word do you hear?', 'أي كلمة تسمع؟'], cols: 2, err: 'understanding', listen: function () { Voice.word(t[0], t[1], t[2]); }, hint: ['Look at the first letter.', 'انظر إلى الحرف الأول.'], o: pool.slice(0, 3).map(function (x) { var w = WD(x[0], x[1], x[2]); return { html: '<span class="quran" style="font-size:36px;line-height:1.6">' + w.t + '</span>', ok: x === t }; }) }; },
      review: function (r) { var pool = r.shuffle(rd.w), t = pool[0]; return { k: 'choice', p: ['Which word do you hear?', 'أي كلمة تسمع؟'], cols: 2, listen: function () { Voice.word(t[0], t[1], t[2]); }, o: pool.slice(0, 2).map(function (x) { var w = WD(x[0], x[1], x[2]); return { html: '<span class="quran" style="font-size:36px;line-height:1.6">' + w.t + '</span>', ok: x === t }; }) }; }
    });
  });
  A.acts['wd-hear'] = function (t) { Voice.word(+t.dataset.s, +t.dataset.v, +t.dataset.i); };
  var FIRSTW = [['بَاب', ['door', 'باب'], 'door'], ['كِتَاب', ['book', 'كتاب'], 'book'], ['قَلَم', ['pen', 'قلم'], 'pencil'], ['شَمْس', ['sun', 'شمس'], 'sun'], ['قَمَر', ['moon', 'قمر'], 'moon'], ['مَاء', ['water', 'ماء'], 'drop'], ['شَجَرَة', ['tree', 'شجرة'], 'tree'], ['تَمْر', ['dates', 'تمر'], 'date'], ['نَجْم', ['star', 'نجم'], 'star'], ['مِفْتَاح', ['key', 'مفتاح'], 'key'], ['جَمَل', ['camel', 'جمل'], 'camel'], ['مَسْجِد', ['masjid', 'مسجد'], 'masjid']];
  C.add('a.words', {
    title: ['Words for things', 'أسماء الأشياء'], art: 'key',
    meet: [{ k: 'say', p: ['Everything has a name in Arabic. Here is the word for what you are holding: a key.', 'لكل شيء اسم بالعربية. وهذه كلمة ما تمسكه: مفتاح.'], big: 'مِفْتَاح', bigAr: true, art: 'key', mount: function () { Voice.say('مِفْتَاح', { lang: 'ar' }); } }],
    solo: function (r, i) { var ws = r.shuffle(FIRSTW), t = ws[0]; if (i === 3) { var ls = t[0].replace(/[ً-ْ]/g, '').split(''); return { k: 'build', word: ls, joined: t[0], say: t[0], art: t[2], join: true, p: ['Build the word.', 'كوّن الكلمة.'], err: 'letter-shape', hint: ['Start from the right.', 'ابدأ من اليمين.'] }; } return { k: 'choice', p: ['Tap the picture of this word.', 'انقر صورة هذه الكلمة.'], q: t[0], qAr: true, cols: 2, artSize: 74, err: 'understanding', listen: function () { Voice.say(t[0], { lang: 'ar' }); }, o: ws.slice(0, 3).map(function (x) { return { art: x[2], ok: x === t }; }) }; }, soloN: 4,
    review: function (r) { var ws = r.shuffle(FIRSTW), t = ws[0]; return { k: 'choice', p: ['Tap the picture of this word.', 'انقر صورة هذه الكلمة.'], q: t[0], qAr: true, cols: 2, artSize: 74, o: ws.slice(0, 3).map(function (x) { return { art: x[2], ok: x === t }; }) }; }
  });

  /* ---------- Seekers: how Arabic works ---------- */
  C.unit('arabic', 'a-gram', ['How Arabic works', 'كيف تعمل العربية'], 2);
  var NAMES = [['كِتَابٌ', 1], ['قَلَمٌ', 1], ['بَيْتٌ', 1], ['نُورٌ', 1], ['رَجُلٌ', 1]], VERBS = [['كَتَبَ', 2], ['ذَهَبَ', 2], ['قَرَأَ', 2], ['خَلَقَ', 2], ['عَلِمَ', 2]], PART = [['فِي', 3], ['مِنْ', 3], ['عَلَى', 3], ['إِلَى', 3], ['هَلْ', 3]];
  var KLBL = { 1: ['Ism: a name', 'اسم'], 2: ['Fiʿl: an action', 'فعل'], 3: ['Ḥarf: a linking word', 'حرف'] };
  C.add('a.kinds', {
    title: ['Three kinds of word', 'أقسام الكلام الثلاثة'], art: 'book', needs: [],
    meet: [{ k: 'say', p: ['Every Arabic word is one of three: a name, an action, or a small linking word.', 'كل كلمة عربية من ثلاثة: اسم أو فعل أو حرف.'], html: '<div class="snt ar" lang="ar"><span class="wd r0">كِتَابٌ</span><span class="wd r1">كَتَبَ</span><span class="wd r2">فِي</span></div>' }],
    name: [{ k: 'say', p: ['Ism names a thing. Fiʿl tells an action and its time. Ḥarf only shows its meaning with other words.', 'الاسم يسمي شيئًا، والفعل يدل على حدث وزمن، والحرف لا يظهر معناه إلا مع غيره.'], t: ['Scholars have started grammar with this for a thousand years.', 'بهذا يبدأ العلماء النحو منذ ألف عام.'] }],
    guided: function (r) { var all = NAMES.slice(0, 2).concat(VERBS.slice(0, 2), PART.slice(0, 2)); return [{ k: 'sort', p: ['Sort each word.', 'صنّف كل كلمة.'], err: 'word-role', hint: ['A thing? An action? A little joining word?', 'شيء؟ حدث؟ كلمة ربط؟'], bins: [{ t: ['Ism', 'اسم'] }, { t: ['Fiʿl', 'فعل'] }, { t: ['Ḥarf', 'حرف'] }], items: all.map(function (x) { return { t: x[0], ar: true, b: x[1] - 1 }; }) }]; },
    solo: function (r) { var pick = r.pick(NAMES.concat(VERBS, PART)); return { k: 'choice', p: ['What kind of word?', 'ما نوع هذه الكلمة؟'], q: pick[0], qAr: true, err: 'word-role', hint: ['Ask: is it a thing, an action, or a joiner?', 'هل هي شيء أو حدث أو رابط؟'], o: [1, 2, 3].map(function (k) { return { t: KLBL[k], ok: k === pick[1] }; }), shuffle: false }; }, soloN: 4,
    review: function (r) { var pick = r.pick(NAMES.concat(VERBS, PART)); return { k: 'choice', p: ['What kind of word?', 'ما نوع هذه الكلمة؟'], q: pick[0], qAr: true, err: 'word-role', o: [1, 2, 3].map(function (k) { return { t: KLBL[k], ok: k === pick[1] }; }), shuffle: false }; }
  });
  C.add('a.gender', {
    title: ['This, and tāʾ marbūṭah', 'هذا وهذه والتاء المربوطة'], art: 'book',
    meet: [{ k: 'say', p: ['Arabic names are masculine or feminine. A round tāʾ at the end usually marks feminine.', 'الأسماء مذكرة أو مؤنثة. والتاء المربوطة في الآخر علامة التأنيث غالبًا.'], big: 'هٰذَا بَيْتٌ\nهٰذِهِ شَجَرَةٌ', bigAr: true }],
    solo: function (r) { var ws = [['بَيْتٌ', 0], ['كِتَابٌ', 0], ['قَلَمٌ', 0], ['بَابٌ', 0], ['شَجَرَةٌ', 1], ['مَدْرَسَةٌ', 1], ['سَيَّارَةٌ', 1], ['وَرَقَةٌ', 1]], t = r.pick(ws); return { k: 'choice', p: ['Say this about it.', 'اختر المناسب.'], q: t[0], qAr: true, cols: 2, large: true, err: 'word-role', hint: ['Look for a round tāʾ at the end.', 'ابحث عن التاء المربوطة في آخرها.'], o: [{ t: 'هٰذَا', ar: true, ok: t[1] === 0 }, { t: 'هٰذِهِ', ar: true, ok: t[1] === 1 }], shuffle: false }; }, soloN: 4,
    review: function (r) { var t = r.pick([['شَجَرَةٌ', 1], ['بَيْتٌ', 0], ['وَرَقَةٌ', 1], ['قَلَمٌ', 0]]); return { k: 'choice', p: ['Say this about it.', 'اختر المناسب.'], q: t[0], qAr: true, cols: 2, large: true, err: 'word-role', o: [{ t: 'هٰذَا', ar: true, ok: t[1] === 0 }, { t: 'هٰذِهِ', ar: true, ok: t[1] === 1 }], shuffle: false }; }
  });
  /* the nominal sentence: real short āyāt, labelled by the child */
  var NOM = [[['اللَّهُ', 'أَكْبَرُ']], [['الْبَيْتُ', 'كَبِيرٌ']], [['الْقَلَمُ', 'جَدِيدٌ']], [['الْبَابُ', 'مَفْتُوحٌ']], [['الْوَلَدُ', 'صَغِيرٌ']]];
  var ROLE_N = [['Mubtadaʾ: who it is about', 'المبتدأ: عمّن الجملة'], ['Khabar: what is said', 'الخبر: ما قيل عنه']];
  C.add('a.nominal', {
    title: ['The naming sentence', 'الجملة الاسمية'], art: 'book',
    meet: [{ k: 'say', p: ['Two words can be a whole sentence in Arabic. No word for is is needed.', 'كلمتان قد تكوّنان جملة كاملة. لا نحتاج إلى كلمة تعني «يكون».'], html: '<div class="snt ar" lang="ar"><span class="wd r0">الْبَيْتُ</span><span class="wd r1">كَبِيرٌ</span></div>', t: ['The house is big.', 'البيت كبير.'] }],
    name: [{ k: 'say', p: ['The word it is about is the mubtadaʾ. What you say about it is the khabar. Both end in ḍammah here.', 'ما تتحدث عنه هو المبتدأ، وما تقوله عنه هو الخبر. وكلاهما مرفوع هنا.'] }],
    guided: [{ k: 'sentence', ar: true, p: ['Label the sentence.', 'أعرب الجملة.'], words: [{ t: 'الْقَلَمُ', r: 0 }, { t: 'جَدِيدٌ', r: 1 }], roles: ROLE_N, hint: ['Which word is it about?', 'عن أي كلمة تتحدث الجملة؟'] }],
    solo: function (r) { var S = r.pick(NOM)[0]; return { k: 'sentence', ar: true, p: ['Label the sentence.', 'أعرب الجملة.'], words: [{ t: S[0], r: 0 }, { t: S[1], r: 1 }], roles: ROLE_N, hint: ['The first usually names, the second tells.', 'الأولى تسمي غالبًا والثانية تخبر.'] }; },
    review: function (r) { var S = r.pick(NOM)[0]; return { k: 'sentence', ar: true, p: ['Label it.', 'أعربها.'], words: [{ t: S[0], r: 0 }, { t: S[1], r: 1 }], roles: ROLE_N }; }
  });
  var ROOTS = [
    { r: ['ك', 'ت', 'ب'], m: ['writing', 'الكتابة'], w: [['كَتَبَ', ['he wrote', 'كتب']], ['كِتَاب', ['a book', 'كتاب']], ['كَاتِب', ['a writer', 'كاتب']], ['مَكْتَب', ['a desk or office', 'مكتب']], ['مَكْتُوب', ['written', 'مكتوب']]] },
    { r: ['ع', 'ل', 'م'], m: ['knowing', 'العلم'], w: [['عَلِمَ', ['he knew', 'علم']], ['عِلْم', ['knowledge', 'علم']], ['عَالِم', ['a scholar', 'عالم']], ['مُعَلِّم', ['a teacher', 'معلم']], ['مَعْلُوم', ['known', 'معلوم']]] },
    { r: ['س', 'ج', 'د'], m: ['bowing down', 'السجود'], w: [['سَجَدَ', ['he prostrated', 'سجد']], ['سُجُود', ['prostration', 'سجود']], ['سَاجِد', ['one who prostrates', 'ساجد']], ['مَسْجِد', ['a place of prostration', 'مكان السجود']]] },
    { r: ['ف', 'ت', 'ح'], m: ['opening', 'الفتح'], w: [['فَتَحَ', ['he opened', 'فتح']], ['فَاتِحَة', ['the opening', 'الفاتحة']], ['مِفْتَاح', ['a key', 'مفتاح']], ['مَفْتُوح', ['open', 'مفتوح']]] },
    { r: ['ر', 'ح', 'م'], m: ['mercy', 'الرحمة'], w: [['رَحِمَ', ['he had mercy', 'رحم']], ['رَحْمَة', ['mercy', 'رحمة']], ['رَحِيم', ['most merciful', 'رحيم']], ['رَحْمٰن', ['most compassionate', 'رحمن']]] }
  ];
  C.add('a.roots', {
    title: ['Word families', 'عائلات الكلمات'], art: 'tree',
    meet: [{ k: 'say', p: ['Most Arabic words grow from three root letters. Learn the family, and new words explain themselves.', 'تنمو أكثر الكلمات من ثلاثة أحرف. احفظ العائلة تفهم الكلمات الجديدة.'], html: function () { return I.rootHtml(ROOTS[3].r, ROOTS[3].w); }, t: ['Your key, miftāḥ, comes from opening.', 'مفتاحك من الفتح.'] }],
    guided: [{ k: 'say', p: ['Here is the family of knowing.', 'وهذه عائلة العلم.'], html: function () { return I.rootHtml(ROOTS[1].r, ROOTS[1].w); } }],
    solo: function (r) { var R = r.pick(ROOTS), oth = r.pick(ROOTS.filter(function (x) { return x !== R; })), inW = r.shuffle(R.w)[0], outs = r.shuffle(oth.w).slice(0, 2); return { k: 'choice', p: ['Which belongs to the family ' + R.r.join(' ') + '?', 'أيها من عائلة ' + R.r.join(' ') + '؟'], err: 'understanding', cols: 1, hint: ['Find those three letters inside the word.', 'ابحث عن الأحرف الثلاثة داخل الكلمة.'], o: [inW].concat(outs).map(function (w) { return { t: w[0], ar: true, ok: w === inW }; }) }; }, soloN: 4,
    make: [{ k: 'mission', art: 'pencil', t: ['Write the root ف ت ح on paper. Around it write every word from today that grows from it.', 'اكتب الجذر ف ت ح في ورقة. واكتب حوله كل كلمة تعلمتها منه.'] }],
    review: function (r) { var R = r.pick(ROOTS), oth = r.pick(ROOTS.filter(function (x) { return x !== R; })), inW = r.shuffle(R.w)[0], o = r.shuffle(oth.w)[0]; return { k: 'choice', p: ['Which is from ' + R.r.join(' ') + '?', 'أيها من ' + R.r.join(' ') + '؟'], cols: 1, err: 'understanding', o: [{ t: inW[0], ar: true, ok: true }, { t: o[0], ar: true }] }; }
  });
  var PAST = [['كَتَبَ', 'كَتَبْتُ', 'كَتَبْتَ', ['wrote', 'كتب']], ['ذَهَبَ', 'ذَهَبْتُ', 'ذَهَبْتَ', ['went', 'ذهب']], ['فَتَحَ', 'فَتَحْتُ', 'فَتَحْتَ', ['opened', 'فتح']], ['جَلَسَ', 'جَلَسْتُ', 'جَلَسْتَ', ['sat', 'جلس']]];
  C.add('a.past', {
    title: ['Doing words: the past', 'الفعل الماضي'], art: 'pencil',
    meet: [{ k: 'say', p: ['Arabic verbs change their ending to show who did it.', 'تتغير نهاية الفعل لتدل على الفاعل.'], big: 'كَتَبَ   كَتَبْتُ   كَتَبْتَ', bigAr: true, t: ['he wrote · I wrote · you wrote', 'هو كتب · أنا كتبت · أنت كتبت'] }],
    solo: function (r) { var v = r.pick(PAST), who = r.pick([['I', 1, 'أنا'], ['You', 2, 'أنت'], ['He', 0, 'هو']]); return { k: 'choice', p: [who[0] + ' ' + v[3][0] + '. Which is it?', who[2] + '. أي فعل؟'], cols: 1, err: 'word-role', hint: ['-tu means I. -ta means you.', 'ـتُ للمتكلم، وـتَ للمخاطب.'], o: [0, 1, 2].map(function (i) { return { t: v[i], ar: true, ok: i === who[1] }; }) }; }, soloN: 4,
    review: function (r) { var v = r.pick(PAST); return { k: 'choice', p: ['I ' + v[3][0] + '. Which is it?', 'أنا. أي فعل؟'], cols: 1, err: 'word-role', o: [0, 1, 2].map(function (i) { return { t: v[i], ar: true, ok: i === 1 }; }) }; }
  });
  /* the ḥarakāt ladder: real reading means supplying the vowels yourself */
  var LADDER = [['ذَهَبَ الْوَلَدُ إِلَى الْمَسْجِدِ', ['The boy went to the masjid.', 'ذهب الولد إلى المسجد.']], ['فَتَحَ الْوَلَدُ الْبَابَ', ['The boy opened the door.', 'فتح الولد الباب.']], ['قَرَأَ الْمُعَلِّمُ الْكِتَابَ', ['The teacher read the book.', 'قرأ المعلم الكتاب.']]];
  var strip = function (s) { return s.replace(/[ً-ْ]/g, ''); };
  C.add('a.ladder', {
    title: ['Reading without vowels', 'القراءة بلا حركات'], art: 'book',
    meet: [{ k: 'say', p: ['Grown-up Arabic often has no vowel marks. You supply them from what you know. Start with the marks, then lose them.', 'كتابة الكبار غالبًا بلا حركات. أنت تضعها مما تعرف. ابدأ بها ثم تخلص منها.'], big: 'ذَهَبَ ← ذهب', bigAr: true }],
    solo: function (r, i) { var S = LADDER[i % 3], dis = r.shuffle(LADDER.filter(function (x) { return x !== S; })).slice(0, 2); return { k: 'choice', p: ['What does this say?', 'ماذا تقول هذه الجملة؟'], q: strip(S[0]), qAr: true, cols: 1, err: 'understanding', hint: ['Sound out each word. Which vowels fit?', 'انطق كل كلمة. أي حركات تناسب؟'], o: [S].concat(dis).map(function (x) { return { t: x[1], ok: x === S }; }) }; },
    review: function (r) { var S = r.pick(LADDER), o = r.pick(LADDER.filter(function (x) { return x !== S; })); return { k: 'choice', p: ['What does this say?', 'ماذا تقول؟'], q: strip(S[0]), qAr: true, cols: 1, err: 'understanding', o: [{ t: S[1], ok: true }, { t: o[1] }] }; }
  });
})();
