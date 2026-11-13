/* Maths. Concrete to pictorial to abstract, with generators so practice never runs out.
   Islamic bridges only where real: fair sharing, zakāh's one in forty, prayer and clock, date-counting. */
(function () {
  'use strict';
  var A = window.A, I = window.I, C = window.C;
  var ar = function (x) { return String(x).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }); };
  var OBJ = ['date', 'apple', 'olive', 'orange', 'star', 'leaf', 'stone', 'coin'];
  var ON = { date: ['dates', 'تمرات'], apple: ['apples', 'تفاحات'], olive: ['olives', 'زيتونات'], orange: ['oranges', 'برتقالات'], star: ['stars', 'نجوم'], leaf: ['leaves', 'أوراق'], stone: ['stones', 'حجارة'], coin: ['coins', 'قطع نقد'] };
  function ch(rng, a, lo, hi, p, e, extra) {
    var o = I.numOpts(rng, a, lo, hi, 4, e).map(function (x) { return { t: A.num ? x.v : x.v, ok: x.ok, e: x.e, _n: x.v }; });
    o.forEach(function (x) { x.t = [String(x._n), ar(x._n)]; });
    return Object.assign({ k: 'choice', p: p, o: o, shuffle: false, large: true }, extra || {});
  }
  function pad(eq, a, p, e, extra) { return Object.assign({ k: 'pad', p: p, eq: eq, a: a, err: e }, extra || {}); }
  function trace(ch_) { return { k: 'trace', set: A.S && A.ar && A.ar() ? 'arn' : 'num', ch: ch_, p: ['Write it with your finger. Follow the light.', 'اكتبه بإصبعك. اتبع الضوء.'] }; }
  function traceNum(n) { return function () { var useAr = A.ar(); return { k: 'trace', set: useAr ? 'arn' : 'num', ch: useAr ? ar(n) : String(n), p: ['Write it with your finger. Follow the light.', 'اكتبه بإصبعك. اتبع الضوء.'], err: 'numeral' }; }; }

  C.room('math', { name: ['Maths', 'الرياضيات'], hue: 'sapphire', art: 'octa', tag: ['Count it, build it, see why', 'عُدّ وابنِ وافهم السبب'] });

  /* ---------- Numbers to ten ---------- */
  C.unit('math', 'm-count', ['Counting', 'العدّ'], 1);
  C.add('m.count5', {
    title: ['Count to five', 'العدّ إلى خمسة'], art: 'date',
    meet: [{ k: 'say', p: ['A plate of dates. How many? Let us find out.', 'طبق من التمر. كم تمرة؟ لنكتشف.'], arts: ['date', 'date', 'date'] }],
    name: [{ k: 'say', p: ['Touch each one and say one number. The last number tells how many.', 'المس كل واحدة وقل عددًا واحدًا. آخر عدد يخبرك كم عددها.'], big: '1 2 3 4 5' }],
    guided: function (r) { return [{ k: 'plate', n: 3, obj: 'date', p: ['Touch each date and count.', 'المس كل تمرة وعُدّ.'], hint: ['Touch one at a time. Say the number as you touch.', 'المس واحدة واحدة. قل العدد مع اللمس.'] }]; },
    solo: function (r) { var n = r.int(2, 5), o = r.pick(OBJ); return { k: 'plate', n: n, obj: o, p: ['How many ' + ON[o][0] + '?', 'كم عدد ال' + ON[o][1] + '؟'], hint: ['Touch each one and count aloud.', 'المس كل واحدة وعُدّ بصوتك.'] }; },
    make: traceNum(3),
    review: function (r) { var n = r.int(2, 5), o = r.pick(OBJ); return { k: 'plate', n: n, obj: o, p: ['How many?', 'كم العدد؟'] }; }
  });
  C.add('m.count10', {
    title: ['Count to ten', 'العدّ إلى عشرة'], art: 'star',
    meet: [{ k: 'say', p: ['Ten fingers on your hands. Hold them up and count them.', 'عشرة أصابع في يديك. ارفعها وعُدّها.'], art: 'hand' }],
    guided: [{ k: 'plate', n: 7, obj: 'star', p: ['Count the stars.', 'عُدّ النجوم.'], hint: ['Touch each star once.', 'المس كل نجمة مرة واحدة.'] }],
    solo: function (r) { var n = r.int(6, 10), o = r.pick(OBJ); return { k: 'plate', n: n, obj: o, p: ['How many ' + ON[o][0] + '?', 'كم عدد ال' + ON[o][1] + '؟'], hint: ['Count slowly. Each one gets one number.', 'عُدّ ببطء. لكل واحدة عدد واحد.'] }; },
    make: function (r) { return traceNum(r.int(6, 9))(r); },
    review: function (r) { var n = r.int(6, 10); return { k: 'tenframe', n: n, obj: r.pick(OBJ), p: ['Put ' + n + ' in the frame.', 'ضع ' + ar(n) + ' في الإطار.'] }; }
  });
  C.add('m.frame', {
    title: ['The ten-frame', 'إطار العشرة'], art: 'orange',
    meet: [{ k: 'say', p: ['This frame holds exactly ten. Two rows of five.', 'هذا الإطار يتسع لعشرة تمامًا. صفان في كل صف خمسة.'], html: function () { return '<div class="tfs">' + I.frames(10, 10, 'orange') + '</div>'; } }],
    name: [{ k: 'say', p: ['A full row is five. So you can see a number without counting.', 'الصف الكامل خمسة. فترى العدد دون أن تعدّ.'], html: function () { return '<div class="tfs">' + I.frames(7, 10, 'orange') + '</div>'; }, t: ['Five, and two more: seven.', 'خمسة وزيادة اثنين: سبعة.'] }],
    guided: [{ k: 'tenframe', n: 6, obj: 'date', p: ['Make six.', 'كوّن ستة.'], hint: ['Fill the top row, then one more.', 'املأ الصف العلوي ثم واحدة أخرى.'] }],
    solo: function (r, i) { var n = r.int(3, 10); return i === 2 ? { k: 'tenframe', mode: 'flash', n: n, obj: 'star', p: ['Look quickly. How many?', 'انظر بسرعة. كم العدد؟'], ms: 1800, hint: ['Look at the rows: a full row is five.', 'انظر إلى الصفوف: الصف الكامل خمسة.'] } : { k: 'tenframe', n: n, obj: r.pick(OBJ), p: ['Make ' + n + '.', 'كوّن ' + ar(n) + '.'] }; },
    review: function (r) { var n = r.int(3, 10); return { k: 'tenframe', mode: 'flash', n: n, obj: 'star', p: ['Look quickly. How many?', 'انظر بسرعة. كم العدد؟'], ms: 1500 }; }
  });
  C.add('m.more', {
    title: ['One more, one less', 'واحد أكثر وواحد أقل'], art: 'apple',
    meet: [{ k: 'say', p: ['Four apples. One more comes. Now there are five.', 'أربع تفاحات. جاءت واحدة. صارت خمسًا.'], arts: ['apple', 'apple', 'apple', 'apple', 'apple'] }],
    guided: function (r) { return [{ k: 'line', max: 10, from: 4, to: 5, p: ['One more than four. Tap where the key lands.', 'واحد بعد الأربعة. انقر أين يقف المفتاح.'], hint: ['One more is one hop forward.', 'واحد أكثر قفزة واحدة إلى الأمام.'] }]; },
    solo: function (r) { var a = r.int(1, 9), up = r.bool(); return ch(r, up ? a + 1 : a - 1, 0, 10, up ? ['What is one more than ' + a + '?', 'ما الواحد الأكثر من ' + ar(a) + '؟'] : ['What is one less than ' + a + '?', 'ما الواحد الأقل من ' + ar(a) + '؟'], 'add-count', { hint: ['Count forward for more, back for less.', 'عُدّ إلى الأمام للأكثر وإلى الخلف للأقل.'] }); },
    review: function (r) { var a = r.int(1, 9); return ch(r, a + 1, 0, 10, ['One more than ' + a + '?', 'واحد أكثر من ' + ar(a) + '؟'], 'add-count'); }
  });
  C.add('m.compare', {
    title: ['More or fewer', 'أكثر أو أقل'], art: 'olive',
    meet: [{ k: 'say', p: ['Line them up. The longer row has more.', 'صفّها. الصف الأطول فيه أكثر.'], html: function () { return '<div class="cmp-r">' + Array(6).join(A.art('olive', 34)) + '</div><div class="cmp-r">' + Array(4).join(A.art('olive', 34)) + '</div>'; } }],
    solo: function (r) {
      var a = r.int(1, 9), b; do { b = r.int(1, 9); } while (b === a);
      var big = r.bool(), ans = big ? Math.max(a, b) : Math.min(a, b);
      return { k: 'choice', p: big ? ['Which is more?', 'أيهما أكثر؟'] : ['Which is fewer?', 'أيهما أقل؟'], large: true, o: [a, b].map(function (v) { return { html: '<span class="cnt-row">' + Array(v + 1).join(A.art('date', 20)) + '</span>', t: [String(v), ar(v)], ok: v === ans, e: 'compare' }; }), cols: 2, hint: ['Line them up. Which row is longer?', 'صفّها. أي الصفين أطول؟'] };
    },
    make: [{ k: 'mission', art: 'stone', t: ['Find some stones or spoons. Make two rows. Which has more? Show someone.', 'اجمع حجارة أو ملاعق. كوّن صفين. أيهما أكثر؟ أرِ أحدًا.'], materials: ['Any small things you have', 'أي أشياء صغيرة عندك'] }],
    review: function (r) { var a = r.int(11, 19), b = r.int(1, 9); return { k: 'choice', p: ['Which is more?', 'أيهما أكثر؟'], large: true, cols: 2, o: [{ t: [String(a), ar(a)], ok: true, e: 'compare' }, { t: [String(b), ar(b)], ok: false, e: 'compare' }] }; }
  });

  /* ---------- Parts and wholes ---------- */
  C.unit('math', 'm-bonds', ['Parts and wholes', 'الأجزاء والكل'], 1);
  function bond(w, r) { var p = r.int(1, w - 1); return { k: 'bond', whole: w, part: p, p: [p + ' and how many make ' + w + '?', ar(p) + ' وكم تساوي ' + ar(w) + '؟'], hint: ['Count the beads of the other colour.', 'عُدّ خرزات اللون الآخر.'] }; }
  C.add('m.bond5', {
    title: ['Numbers inside five', 'الأعداد داخل الخمسة'], art: 'date',
    meet: [{ k: 'say', p: ['Five dates. Two for you, three for your brother or sister. Still five.', 'خمس تمرات. اثنتان لك وثلاث لأخيك أو أختك. ما زالت خمسًا.'], arts: ['date', 'date', 'date', 'date', 'date'] }],
    name: [{ k: 'say', p: ['Numbers can split into parts. The parts make the whole.', 'الأعداد تنقسم إلى أجزاء. والأجزاء تكوّن الكل.'], html: function () { return '<div class="bond"><div class="bond-top"><span class="bond-c w">' + A.num(5) + '</span></div><svg class="bond-l" viewBox="0 0 200 40"><path d="M100 0L46 40M100 0l54 40" stroke="currentColor" stroke-width="3" fill="none"/></svg><div class="bond-row"><span class="bond-c a">' + A.num(2) + '</span><span class="bond-c b">' + A.num(3) + '</span></div></div>'; } }],
    guided: [{ k: 'bond', whole: 5, part: 1, p: ['One and how many make five?', 'واحد وكم تساوي خمسة؟'], hint: ['Count the blue beads.', 'عُدّ الخرزات الزرقاء.'] }],
    solo: function (r) { return bond(5, r); },
    review: function (r) { return bond(5, r); }
  });
  C.add('m.bond10', {
    title: ['Making ten', 'تكوين العشرة'], art: 'star',
    meet: [{ k: 'say', p: ['Ten is special. Pairs that make ten are friends: you will use them for life.', 'العشرة مميزة. الأزواج التي تكوّنها أصدقاء: ستستعملها طوال عمرك.'], html: function () { return '<div class="tfs">' + I.frames(6, 10, 'star') + '</div>'; }, t: ['Six, and four empty. Six and four make ten.', 'ستة وأربعة فارغة. ستة وأربعة تساوي عشرة.'] }],
    guided: [{ k: 'tenframe', n: 10, start: 7, obj: 'star', p: ['Seven are here. Fill it to ten. How many did you add?', 'هنا سبعة. أكملها إلى عشرة. كم أضفت؟'], hint: ['Tap the empty squares and count them.', 'انقر المربعات الفارغة وعُدّها.'] }],
    solo: function (r, i) { var a = r.int(1, 9); return i === 0 ? { k: 'tenframe', n: 10, start: a, obj: 'date', p: ['Make ten.', 'كوّن عشرة.'] } : ch(r, 10 - a, 0, 10, [a + ' and how many make 10?', ar(a) + ' وكم تساوي ١٠؟'], 'add-count', { hint: ['Picture the ten-frame.', 'تخيل إطار العشرة.'] }); },
    make: [{ k: 'mission', art: 'hand', t: ['Hold up any fingers. Your helper shows the rest. Together, ten.', 'ارفع بعض أصابعك. ويرفع من معك الباقي. معًا عشرة.'] }],
    review: function (r) { var a = r.int(1, 9); return ch(r, 10 - a, 0, 10, [a + ' and how many make 10?', ar(a) + ' وكم تساوي ١٠؟'], 'add-count'); }
  });
  C.add('m.add10', {
    title: ['Adding to ten', 'الجمع إلى عشرة'], art: 'apple',
    meet: [{ k: 'say', p: ['Three apples here, two more there. Put them together.', 'ثلاث تفاحات هنا واثنتان هناك. اجمعها.'], arts: ['apple', 'apple', 'apple', 'apple', 'apple'] }],
    name: [{ k: 'say', p: ['Plus means put together. Equals means the same as.', 'الزائد يعني اجمع. ويساوي تعني مثل.'], big: '3 + 2 = 5' }],
    guided: [{ k: 'line', max: 10, from: 4, to: 7, p: ['Four and three more. Hop along.', 'أربعة وثلاثة أخرى. اقفز.'], hint: ['Start at the key. Take three hops.', 'ابدأ من المفتاح. ثلاث قفزات.'] }],
    solo: function (r, i) { var a = r.int(1, 6), b = r.int(1, 10 - a); return i === 0 ? { k: 'line', max: 10, from: a, to: a + b, p: [a + ' + ' + b + '. Where do you land?', ar(a) + ' + ' + ar(b) + '. أين تقف؟'], hint: ['Hop forward ' + b + ' times.', 'اقفز إلى الأمام ' + ar(b) + ' مرات.'] } : pad(a + ' + ' + b + ' = ?', a + b, ['Work it out.', 'احسبها.'], 'add-count', { hint: ['Start with the bigger number and count on.', 'ابدأ بالعدد الأكبر وعُدّ.'] }); },
    review: function (r) { var a = r.int(1, 6), b = r.int(1, 10 - a); return pad(a + ' + ' + b + ' = ?', a + b, ['Work it out.', 'احسبها.'], 'add-count'); }
  });
  C.add('m.sub10', {
    title: ['Taking away', 'الطرح'], art: 'orange',
    meet: [{ k: 'say', p: ['Six oranges. You give two to a neighbour. Four are left, and you did a good deed.', 'ست برتقالات. أعطيت جارك اثنتين. بقيت أربع وفعلت خيرًا.'], arts: ['orange', 'orange', 'orange', 'orange'] }],
    name: [{ k: 'say', p: ['Minus means take away.', 'الناقص يعني أبعد.'], big: '6 − 2 = 4' }],
    guided: [{ k: 'line', max: 10, from: 8, to: 5, op: '−', p: ['Eight, take away three. Hop back.', 'ثمانية ناقص ثلاثة. اقفز إلى الخلف.'], hint: ['Hop backwards three times.', 'اقفز إلى الخلف ثلاث مرات.'] }],
    solo: function (r, i) { var a = r.int(3, 10), b = r.int(1, a - 1); return i === 0 ? { k: 'line', max: 10, from: a, to: a - b, op: '−', p: [a + ' − ' + b + '. Where do you land?', ar(a) + ' − ' + ar(b) + '. أين تقف؟'], hint: ['Back ' + b + ' hops.', 'إلى الخلف ' + ar(b) + ' قفزات.'] } : pad(a + ' − ' + b + ' = ?', a - b, ['Work it out.', 'احسبها.'], 'sub-add', { errOf: function (v) { return v === a + b ? 'sub-add' : 'add-count'; }, hint: ['Count back from ' + a + '.', 'عُدّ إلى الخلف من ' + ar(a) + '.'] }); },
    review: function (r) { var a = r.int(3, 10), b = r.int(1, a - 1); return pad(a + ' − ' + b + ' = ?', a - b, ['Work it out.', 'احسبها.'], 'sub-add'); }
  });

  /* ---------- Teens and tens ---------- */
  C.unit('math', 'm-tens', ['Tens and ones', 'العشرات والآحاد'], 1);
  C.add('m.teens', {
    title: ['Numbers to twenty', 'الأعداد إلى عشرين'], art: 'leaf',
    meet: [{ k: 'say', p: ['A full frame is ten. Thirteen is one full frame and three more.', 'الإطار الكامل عشرة. ثلاثة عشر إطار كامل وثلاثة.'], html: function () { return '<div class="tfs two">' + I.frames(13, 20, 'leaf') + '</div>'; } }],
    guided: [{ k: 'tenframe', n: 12, obj: 'leaf', p: ['Make twelve.', 'كوّن اثني عشر.'], hint: ['Fill one whole frame, then two more.', 'املأ إطارًا كاملًا ثم اثنتين.'] }],
    solo: function (r) { var n = r.int(11, 20); return { k: 'tenframe', n: n, obj: r.pick(OBJ), p: ['Make ' + n + '.', 'كوّن ' + ar(n) + '.'], hint: ['One full frame is ten. How many more?', 'الإطار الكامل عشرة. كم يبقى؟'] }; },
    review: function (r) { var n = r.int(11, 20); return { k: 'tenframe', n: n, obj: 'star', p: ['Make ' + n + '.', 'كوّن ' + ar(n) + '.'] }; }
  });
  C.add('m.add20', {
    title: ['Add through ten', 'الجمع عبر العشرة'], art: 'star',
    meet: [{ k: 'say', p: ['8 + 5. Lend two from the five to fill the ten. Ten and three: thirteen.', '٨ + ٥. خذ اثنين من الخمسة لتكمل العشرة. عشرة وثلاثة: ثلاثة عشر.'], html: function () { return '<div class="tfs two">' + I.frames(13, 20, 'star') + '</div>'; } }],
    name: [{ k: 'say', p: ['Make ten first. It is the fastest road.', 'كوّن العشرة أولًا. هذا أسرع طريق.'], big: '8 + 5 = 10 + 3' }],
    guided: [{ k: 'line', max: 20, from: 9, to: 13, p: ['Nine and four. Hop through ten.', 'تسعة وأربعة. اقفز عبر العشرة.'], hint: ['One hop to ten, then three more.', 'قفزة إلى العشرة ثم ثلاث.'] }],
    solo: function (r) { var a = r.int(6, 9), b = r.int(11 - a, 9); return pad(a + ' + ' + b + ' = ?', a + b, ['Make ten first.', 'كوّن العشرة أولًا.'], 'add-count', { hint: [a + ' needs ' + (10 - a) + ' to make ten.', ar(a) + ' يحتاج ' + ar(10 - a) + ' ليصبح عشرة.'] }); },
    review: function (r) { var a = r.int(6, 9), b = r.int(11 - a, 9); return pad(a + ' + ' + b + ' = ?', a + b, ['Work it out.', 'احسبها.'], 'add-count'); }
  });
  C.add('m.sub20', {
    title: ['Take away through ten', 'الطرح عبر العشرة'], art: 'orange',
    meet: [{ k: 'say', p: ['13 − 5. Go back three to reach ten, then two more. Eight.', '١٣ − ٥. ارجع ثلاثة لتصل إلى العشرة ثم اثنين. ثمانية.'], big: '13 − 3 − 2 = 8' }],
    guided: [{ k: 'line', max: 20, from: 14, to: 8, op: '−', p: ['Fourteen take away six. Hop back through ten.', 'أربعة عشر ناقص ستة. اقفز إلى الخلف عبر العشرة.'], hint: ['Four hops to ten, then two more.', 'أربع قفزات إلى العشرة ثم اثنتان.'] }],
    solo: function (r) { var a = r.int(11, 18), b = r.int(a - 9, 9); return pad(a + ' − ' + b + ' = ?', a - b, ['Go through ten.', 'مرّ بالعشرة.'], 'sub-add', { hint: ['First back to ten.', 'ارجع أولًا إلى العشرة.'], errOf: function (v) { return v === a + b ? 'sub-add' : 'add-count'; } }); },
    review: function (r) { var a = r.int(11, 18), b = r.int(a - 9, 9); return pad(a + ' − ' + b + ' = ?', a - b, ['Work it out.', 'احسبها.'], 'sub-add'); }
  });
  C.add('m.tens', {
    title: ['Tens and ones to 100', 'العشرات والآحاد إلى ١٠٠'], art: 'book',
    meet: [{ k: 'say', p: ['Ten ones bundle into one ten. That is why our numbers work.', 'عشرة آحاد تصبح عشرة واحدة. ولهذا تعمل أعدادنا.'], html: '<div class="bl-demo" dir="ltr"><i class="bl-t"></i><i class="bl-t"></i><i class="bl-t"></i><i class="bl-o"></i><i class="bl-o"></i><i class="bl-o"></i><i class="bl-o"></i></div>', t: ['Three tens and four ones: thirty-four.', 'ثلاث عشرات وأربعة آحاد: أربعة وثلاثون.'] }],
    guided: [{ k: 'blocks', n: 42, p: ['Build 42.', 'ابنِ ٤٢.'], hint: ['Four tens, then two ones.', 'أربع عشرات ثم اثنان.'] }],
    solo: function (r, i) { var n = r.int(21, 99); return i === 2 ? { k: 'choice', p: ['In ' + n + ', what does the first digit mean?', 'في ' + ar(n) + '، ماذا يعني الرقم الأول؟'], err: 'place-value', o: [{ t: [Math.floor(n / 10) + ' tens', ar(Math.floor(n / 10)) + ' عشرات'], ok: true }, { t: [Math.floor(n / 10) + ' ones', ar(Math.floor(n / 10)) + ' آحاد'], e: 'place-value' }] } : { k: 'blocks', n: n, p: ['Build ' + n + '.', 'ابنِ ' + ar(n) + '.'], hint: ['The first digit is tens. The second is ones.', 'الرقم الأول عشرات والثاني آحاد.'] }; },
    review: function (r) { var n = r.int(21, 99); return { k: 'blocks', n: n, p: ['Build ' + n + '.', 'ابنِ ' + ar(n) + '.'] }; }
  });
  C.add('m.skip', {
    title: ['Skip counting', 'العدّ بالقفز'], art: 'foot',
    meet: [{ k: 'say', p: ['Pairs of shoes: 2, 4, 6, 8. You can count faster by jumping.', 'أزواج الأحذية: ٢، ٤، ٦، ٨. تعدّ أسرع بالقفز.'], arts: ['shoe', 'shoe', 'shoe', 'shoe'] }],
    solo: function (r) { var st = r.pick([2, 5, 10]), k = r.int(1, 7), seq = [k * st, (k + 1) * st, (k + 2) * st], a = (k + 3) * st; return ch(r, a, st, a + 2 * st, ['What comes next?', 'ما التالي؟'], 'add-count', { q: [seq.join(', ') + ', ?', seq.map(ar).join('، ') + '، ؟'], hint: ['They go up by ' + st + ' each time.', 'تزيد ' + ar(st) + ' كل مرة.'] }); },
    review: function (r) { var st = r.pick([2, 5, 10]), k = r.int(1, 7), a = (k + 2) * st; return ch(r, a, st, a + 2 * st, ['What comes next?', 'ما التالي؟'], 'add-count', { q: [k * st + ', ' + (k + 1) * st + ', ?', ar(k * st) + '، ' + ar((k + 1) * st) + '، ؟'] }); }
  });

  /* ---------- Shapes, patterns, thinking ---------- */
  C.unit('math', 'm-think', ['Shapes and thinking', 'الأشكال والتفكير'], 1);
  var SH = { circle: ['circle', 'دائرة'], square: ['square', 'مربع'], triangle: ['triangle', 'مثلث'], rect: ['rectangle', 'مستطيل'], hexagon: ['hexagon', 'سداسي'], octa: ['star', 'نجمة'] };
  C.add('m.shapes', {
    title: ['Shapes around us', 'الأشكال من حولنا'], art: 'hexagon',
    meet: [{ k: 'say', p: ['Look at a masjid: domes, arches, stars, squares. Shapes are everywhere.', 'انظر إلى مسجد: قباب وأقواس ونجوم ومربعات. الأشكال في كل مكان.'], art: 'masjid' }],
    name: [{ k: 'say', p: ['Corners and sides tell a shape its name.', 'الزوايا والأضلاع تسمي الشكل.'], arts: ['circle', 'square', 'triangle', 'rect', 'hexagon'] }],
    solo: function (r, i) {
      var ks = r.shuffle(['circle', 'square', 'triangle', 'rect', 'hexagon']), t = ks[0];
      if (i === 2) { var by = { triangle: 3, square: 4, rect: 4, hexagon: 6 }, k = r.pick(['triangle', 'square', 'hexagon']); return ch(r, by[k], 3, 8, ['How many corners?', 'كم زاوية؟'], 'understanding', { qArt: k, hint: ['Touch each corner and count.', 'المس كل زاوية وعُدّ.'] }); }
      return { k: 'choice', p: ['Find the ' + SH[t][0] + '.', 'أين ال' + SH[t][1] + '؟'], artSize: 80, cols: 2, err: 'understanding', o: ks.slice(0, 4).map(function (x) { return { art: x, ok: x === t }; }) };
    },
    make: [{ k: 'mission', art: 'square', t: ['Go on a shape hunt. Find one circle, one square and one triangle at home.', 'ابحث عن الأشكال. جد دائرة ومربعًا ومثلثًا في البيت.'] }],
    review: function (r) { var ks = r.shuffle(['circle', 'square', 'triangle', 'rect', 'hexagon']), t = ks[0]; return { k: 'choice', p: ['Find the ' + SH[t][0] + '.', 'أين ال' + SH[t][1] + '؟'], artSize: 80, cols: 2, o: ks.slice(0, 4).map(function (x) { return { art: x, ok: x === t }; }) }; }
  });
  function pattern(r) {
    var pool = r.shuffle(['date', 'star', 'leaf', 'apple', 'orange', 'drop', 'moon']), a = pool[0], b = pool[1], cc = pool[2], type = r.pick(['ab', 'abc', 'aab']);
    var seq = type === 'ab' ? [a, b, a, b, a] : type === 'abc' ? [a, b, cc, a, b] : [a, a, b, a, a];
    var ans = type === 'ab' ? b : type === 'abc' ? cc : b;
    return { k: 'choice', p: ['What comes next?', 'ما الذي يأتي بعده؟'], err: 'understanding', cols: 3, artSize: 64, qHtml: '<div class="ptn">' + seq.map(function (x) { return A.art(x, 44); }).join('') + '<b>?</b></div>', hint: ['Say the pattern aloud. Hear what comes next.', 'قل النمط بصوتك واسمع ما يأتي.'], o: [a, b, cc].map(function (x) { return { art: x, ok: x === ans }; }) };
  }
  C.add('m.pattern', {
    title: ['Patterns', 'الأنماط'], art: 'star',
    meet: [{ k: 'say', p: ['Night, day, night, day. Allah made the world full of patterns. Patterns let you guess what comes next.', 'ليل نهار ليل نهار. جعل الله العالم مليئًا بالأنماط. والأنماط تعينك على توقع ما يأتي.'], arts: ['moon', 'sun', 'moon', 'sun'] }],
    solo: pattern, soloN: 4,
    review: pattern
  });
  function odd(r) {
    var sets = [[['date', 'apple', 'orange', 'olive'], 'stone', ['It is not food.', 'ليس طعامًا.']], [['circle', 'square', 'triangle', 'hexagon'], 'apple', ['It is not a flat shape.', 'ليس شكلًا مسطحًا.']], [['sun', 'moon', 'star'], 'shoe', ['It is not in the sky.', 'ليس في السماء.']], [['tree', 'leaf', 'flower', 'plant'], 'cup', ['It does not grow.', 'لا ينمو.']], [['sheep', 'camel', 'bird', 'fish'], 'book', ['It is not alive.', 'ليس حيًا.']]];
    var S = r.pick(sets), g = r.shuffle(S[0]).slice(0, 3);
    return { k: 'choice', p: ['Which one does not belong?', 'أيها لا ينتمي إليها؟'], cols: 2, artSize: 74, err: 'understanding', after: S[2], hint: ['What do three of them share?', 'ماذا يجمع ثلاثة منها؟'], o: g.map(function (x) { return { art: x }; }).concat([{ art: S[1], ok: true }]) };
  }
  C.add('m.odd', {
    title: ['Which does not belong?', 'أيها لا ينتمي؟'], art: 'cup',
    meet: [{ k: 'say', p: ['Good thinkers ask: what is the same? What is different? And why?', 'المفكر الجيد يسأل: ما المتشابه؟ ما المختلف؟ ولماذا؟'], arts: ['date', 'apple', 'stone'] }],
    solo: odd, soloN: 4,
    review: odd
  });

  /* ---------- Measure, time, sharing ---------- */
  C.unit('math', 'm-measure', ['Measure, time, sharing', 'القياس والوقت والقسمة'], 1);
  C.add('m.long', {
    title: ['Longer and heavier', 'أطول وأثقل'], art: 'pencil',
    meet: [{ k: 'say', p: ['To compare length, start from the same line. To compare weight, hold one in each hand.', 'لتقارن الطول ابدأ من الخط نفسه. ولتقارن الوزن احمل واحدًا بكل يد.'], art: 'pencil' }],
    solo: function (r) { var w1 = r.int(28, 48), w2 = r.int(58, 92), swap = r.bool(), long_ = r.bool(); var bars = [[w1, 'a'], [w2, 'b']]; if (swap) bars.reverse(); return { k: 'choice', p: long_ ? ['Which is longer?', 'أيها أطول؟'] : ['Which is shorter?', 'أيها أقصر؟'], cols: 1, err: 'compare', hint: ['Both start at the same place. Look at the far end.', 'كلاهما يبدأ من المكان نفسه. انظر إلى الطرف.'], o: bars.map(function (b) { return { html: '<i class="msr" style="width:' + b[0] + '%"></i>', ok: long_ ? b[0] === w2 : b[0] === w1 }; }) }; },
    make: [{ k: 'mission', art: 'foot', t: ['How many of your steps from your bed to the door? Now a grown-up’s steps. Why are they different?', 'كم خطوة من سريرك إلى الباب؟ والآن خطوات الكبير. لماذا تختلف؟'] }],
    review: function (r) { var w1 = r.int(28, 48), w2 = r.int(58, 92); return { k: 'choice', p: ['Which is longer?', 'أيها أطول؟'], cols: 1, o: [{ html: '<i class="msr" style="width:' + w1 + '%"></i>' }, { html: '<i class="msr" style="width:' + w2 + '%"></i>', ok: true }] }; }
  });
  C.add('m.clock', {
    title: ['Telling the time', 'قراءة الساعة'], art: 'sun',
    meet: [{ k: 'say', p: ['Each prayer has its time, so Muslims have always watched the clock and the sun.', 'لكل صلاة وقتها، فالمسلمون يراقبون الساعة والشمس منذ القدم.'], art: 'sun' }],
    name: [{ k: 'say', p: ['The short hand tells the hour. When the long hand is at the top, it is exactly that hour.', 'العقرب القصير يدل على الساعة. وإذا كان الطويل في الأعلى فهي الساعة تمامًا.'], html: function () { return '<svg class="clk mini" viewBox="0 0 200 200"><circle cx="100" cy="100" r="94" class="clk-f"/><line class="clk-m" x1="100" y1="100" x2="100" y2="30"/><line class="clk-h" x1="100" y1="100" x2="100" y2="52" transform="rotate(90 100 100)"/><circle cx="100" cy="100" r="7" class="clk-d"/></svg>'; }, t: ['Three o’clock.', 'الساعة الثالثة.'] }],
    guided: [{ k: 'clock', h: 7, p: ['Drag the short hand to 7 o’clock.', 'حرّك العقرب القصير إلى السابعة.'], hint: ['Point the short hand at the 7.', 'وجّه العقرب القصير إلى ٧.'] }],
    solo: function (r, i) { var h = r.int(1, 12), half = i === 2; return { k: 'clock', h: h, m: half ? 30 : 0, minutes: half, p: half ? ['Show half past ' + h + '.', 'أرني ' + ar(h) + ' والنصف.'] : ['Show ' + h + ' o’clock.', 'أرني الساعة ' + ar(h) + '.'], hint: half ? ['Long hand at 6. Short hand just after ' + h + '.', 'الطويل عند ٦ والقصير بعد ' + ar(h) + ' بقليل.'] : ['Short hand at ' + h + '.', 'القصير عند ' + ar(h) + '.'] }; },
    make: [{ k: 'mission', art: 'masjid', t: ['Ask what time the next prayer is. Watch the clock until then.', 'اسأل عن وقت الصلاة القادمة. وراقب الساعة حتى يحين.'] }],
    review: function (r) { var h = r.int(1, 12); return { k: 'clock', h: h, p: ['Show ' + h + ' o’clock.', 'أرني الساعة ' + ar(h) + '.'] }; }
  });
  C.add('m.halves', {
    title: ['Fair shares', 'القسمة العادلة'], art: 'bread',
    meet: [{ k: 'say', p: ['Fair means everyone gets the same. Islam loves justice, even with dates.', 'العدل أن يأخذ الجميع مثل غيرهم. والإسلام يحب العدل حتى في التمر.'], arts: ['date', 'date', 'date', 'date'] }],
    name: [{ k: 'say', p: ['One thing cut into two equal parts: each part is a half.', 'شيء قُسم جزأين متساويين: كل جزء نصف.'], html: function () { return I.fracBar(1, 2); } }],
    guided: [{ k: 'share', n: 6, k_: 2, p: ['Share six dates on two plates, fairly.', 'وزّع ست تمرات على طبقين بالعدل.'], hint: ['One for this plate, one for that plate.', 'واحدة لهذا الطبق وواحدة لذاك.'] }],
    solo: function (r, i) { if (i === 2) { var eq = r.bool(); return { k: 'choice', p: ['Is this cut into halves?', 'هل هذا مقسوم إلى نصفين؟'], cols: 2, err: 'fraction-parts', qHtml: eq ? '<div class="frb" dir="ltr"><i class="on"></i><i></i></div>' : '<div class="frb" dir="ltr"><i class="on" style="flex:3"></i><i></i></div>', hint: ['Halves are exactly the same size.', 'النصفان متساويان تمامًا.'], o: [{ t: ['Yes', 'نعم'], ok: eq }, { t: ['No', 'لا'], ok: !eq }] }; } var k = r.pick([2, 3, 4]), n = k * r.int(2, 3); return { k: 'share', n: n, k_: k, p: ['Share ' + n + ' between ' + k + ' plates.', 'وزّع ' + ar(n) + ' على ' + ar(k) + ' أطباق.'], hint: ['Give one to each plate, again and again.', 'أعطِ كل طبق واحدة، ثم كرر.'] }; },
    make: [{ k: 'mission', art: 'date', t: ['At the next meal, share something fairly with everyone at the table.', 'في الوجبة القادمة، اقسم شيئًا بالعدل على من حول المائدة.'] }],
    review: function (r) { var k = r.pick([2, 3, 4]), n = k * r.int(2, 3); return { k: 'share', n: n, k_: k, p: ['Share ' + n + ' between ' + k + ' plates.', 'وزّع ' + ar(n) + ' على ' + ar(k) + ' أطباق.'] }; }
  });
  C.add('m.chart', {
    title: ['Reading a picture chart', 'قراءة مخطط الصور'], art: 'apple',
    meet: [{ k: 'say', p: ['A chart turns counting into a picture, so you can compare at a glance.', 'المخطط يحول العدّ إلى صورة، فتقارن بنظرة واحدة.'], art: 'star' }],
    solo: function (r) { var things = r.shuffle(['date', 'apple', 'orange']).slice(0, 3), vals = things.map(function () { return r.int(1, 6); }), i = r.int(0, 2); var html = '<div class="pict">' + things.map(function (t, j) { return '<div class="pict-r">' + A.art(t, 30) + '<span>' + Array(vals[j] + 1).join('<i></i>') + '</span></div>'; }).join('') + '</div>'; return ch(r, vals[i], 0, 7, ['How many ' + ON[things[i]][0] + '?', 'كم عدد ال' + ON[things[i]][1] + '؟'], 'count-skip', { qHtml: html, hint: ['Count the marks in that row.', 'عُدّ العلامات في ذلك الصف.'] }); },
    review: function (r) { var v = r.int(2, 6); return ch(r, v, 0, 8, ['How many marks?', 'كم علامة؟'], 'count-skip', { qHtml: '<div class="pict"><div class="pict-r">' + A.art('apple', 30) + '<span>' + Array(v + 1).join('<i></i>') + '</span></div></div>' }); }
  });

  /* ---------- Seekers ---------- */
  C.unit('math', 'm-big', ['Big numbers', 'الأعداد الكبيرة'], 2);
  C.add('m.pv1000', {
    title: ['Hundreds, tens, ones', 'المئات والعشرات والآحاد'], art: 'book', needs: [],
    meet: [{ k: 'say', p: ['Ten tens bundle into a hundred. Every step left is ten times bigger.', 'عشر عشرات تكوّن مئة. وكل خطوة إلى اليسار أكبر بعشر مرات.'], html: '<div class="bl-demo" dir="ltr"><i class="bl-h"></i><i class="bl-h"></i><i class="bl-t"></i><i class="bl-t"></i><i class="bl-t"></i><i class="bl-o"></i><i class="bl-o"></i></div>', t: ['2 hundreds, 3 tens, 2 ones: 232.', 'مئتان و٣ عشرات و٢ آحاد: ٢٣٢.'] }],
    guided: [{ k: 'blocks', n: 305, p: ['Build 305. Careful with the zero.', 'ابنِ ٣٠٥. انتبه إلى الصفر.'], hint: ['Zero tens means no ten rods.', 'صفر عشرات يعني لا أعواد عشرة.'] }],
    solo: function (r, i) { var n = r.int(101, 999); if (i === 2) { var d = r.pick([['hundreds', 'مئات', 100], ['tens', 'عشرات', 10], ['ones', 'آحاد', 1]]); return ch(r, Math.floor(n / d[2]) % 10, 0, 9, ['How many ' + d[0] + ' in ' + n + '?', 'كم ' + d[1] + ' في ' + ar(n) + '؟'], 'place-value'); } return { k: 'blocks', n: n, p: ['Build ' + n + '.', 'ابنِ ' + ar(n) + '.'], hint: ['Read each digit: hundreds, tens, ones.', 'اقرأ كل رقم: مئات، عشرات، آحاد.'] }; },
    review: function (r) { var n = r.int(101, 999); return { k: 'blocks', n: n, p: ['Build ' + n + '.', 'ابنِ ' + ar(n) + '.'] }; }
  });
  function colAdd(r, carry) { var a, b; do { a = r.int(100, 800); b = r.int(10, 199); } while (((a % 10 + b % 10) >= 10) !== carry); return { a: a, b: b }; }
  C.add('m.addCol', {
    title: ['Adding in columns', 'الجمع في أعمدة'], art: 'coin',
    meet: [{ k: 'say', p: ['Ones with ones, tens with tens. If ones reach ten, bundle them and carry one ten over.', 'الآحاد مع الآحاد والعشرات مع العشرات. فإذا بلغت الآحاد عشرة فاحملها إلى العشرات.'], html: '<pre class="col" dir="ltr"> ¹\n 248\n+135\n----\n 383</pre>' }],
    guided: [{ k: 'pad', eq: '256 + 127 = ?', a: 383, p: ['6 + 7 is 13: write 3, carry 1.', '٦ + ٧ = ١٣: اكتب ٣ واحمل ١.'], err: 'place-value', hint: ['Ones: 3. Tens: 5 + 2 + 1 = 8. Hundreds: 3.', 'الآحاد ٣. العشرات ٥ + ٢ + ١ = ٨. المئات ٣.'] }],
    solo: function (r, i) { var x = colAdd(r, i > 0); return pad(x.a + ' + ' + x.b + ' = ?', x.a + x.b, ['Add in columns. Use paper if you like.', 'اجمع في أعمدة. استعن بورقة إن شئت.'], 'place-value', { hint: ['Start with the ones.', 'ابدأ بالآحاد.'] }); },
    review: function (r) { var x = colAdd(r, true); return pad(x.a + ' + ' + x.b + ' = ?', x.a + x.b, ['Add in columns.', 'اجمع في أعمدة.'], 'place-value'); }
  });
  C.add('m.subCol', {
    title: ['Subtracting in columns', 'الطرح في أعمدة'], art: 'coin',
    meet: [{ k: 'say', p: ['Not enough ones? Open a bundle: one ten becomes ten ones.', 'لا تكفي الآحاد؟ افتح حزمة: عشرة واحدة تصبح عشرة آحاد.'], html: '<pre class="col" dir="ltr"> 3¹\n 42\n-17\n---\n 25</pre>' }],
    guided: [{ k: 'pad', eq: '352 − 128 = ?', a: 224, p: ['2 − 8 cannot be done. Open a ten.', '٢ − ٨ لا يمكن. افتح عشرة.'], err: 'place-value', hint: ['12 − 8 = 4. Then 4 − 2 = 2. Then 3 − 1 = 2.', '١٢ − ٨ = ٤. ثم ٤ − ٢ = ٢. ثم ٣ − ١ = ٢.'] }],
    solo: function (r) { var a = r.int(300, 950), b = r.int(100, a - 50); return pad(a + ' − ' + b + ' = ?', a - b, ['Subtract in columns.', 'اطرح في أعمدة.'], 'place-value', { hint: ['Start with the ones. Open a ten if you must.', 'ابدأ بالآحاد. افتح عشرة عند الحاجة.'], errOf: function (v) { return v === a + b ? 'sub-add' : 'place-value'; } }); },
    review: function (r) { var a = r.int(300, 950), b = r.int(100, a - 50); return pad(a + ' − ' + b + ' = ?', a - b, ['Subtract.', 'اطرح.'], 'place-value'); }
  });

  C.unit('math', 'm-times', ['Times and sharing', 'الضرب والقسمة'], 2);
  function fact(r, set) { var a = r.pick(set), b = r.int(2, 10); return pad(a + ' × ' + b + ' = ?', a * b, ['Say the fact, then type it.', 'قل الحقيقة ثم اكتبها.'], 'times', { hint: ['Picture ' + a + ' rows of ' + b + '.', 'تخيل ' + ar(a) + ' صفوف في كل منها ' + ar(b) + '.'] }); }
  C.add('m.array', {
    title: ['Rows and columns', 'الصفوف والأعمدة'], art: 'date', needs: ['m.addCol'],
    meet: [{ k: 'say', p: ['Rows at the masjid: three rows of four. How many people? Multiply.', 'صفوف في المسجد: ثلاثة صفوف في كل صف أربعة. كم عددهم؟ اضرب.'], html: function () { return I.arrayHtml(3, 4, 'date'); } }],
    name: [{ k: 'say', p: ['Times means rows of. Turn it around: the answer stays the same.', 'الضرب يعني صفوفًا من. اقلبها: يبقى الجواب نفسه.'], big: '3 × 4 = 4 × 3 = 12' }],
    guided: [{ k: 'array', r: 3, c: 5, anyWay: true, max: 8, p: ['Show 3 rows of 5.', 'أرني ٣ صفوف في كل منها ٥.'], hint: ['Tap the square in row 3, column 5.', 'انقر المربع في الصف ٣ والعمود ٥.'] }],
    solo: function (r, i) { var a = r.int(2, 6), b = r.int(2, 7); return i === 2 ? pad(a + ' × ' + b + ' = ?', a * b, ['How many altogether?', 'كم المجموع؟'], 'times', { html: I.arrayHtml(a, b), hint: ['Count one row, then jump by that.', 'عُدّ صفًا ثم اقفز بعدده.'] }) : { k: 'array', r: a, c: b, anyWay: true, max: 8, p: ['Show ' + a + ' × ' + b + '.', 'أرني ' + ar(a) + ' × ' + ar(b) + '.'], hint: ['Rows down, columns across.', 'الصفوف نزولًا والأعمدة عرضًا.'] }; },
    make: [{ k: 'mission', art: 'date', t: ['Lay out spoons or dates in rows and columns. Write the times fact you made.', 'رتب ملاعق أو تمرات في صفوف وأعمدة. اكتب حقيقة الضرب.'] }],
    review: function (r) { var a = r.int(2, 6), b = r.int(2, 7); return { k: 'array', r: a, c: b, anyWay: true, max: 8, p: ['Show ' + a + ' × ' + b + '.', 'أرني ' + ar(a) + ' × ' + ar(b) + '.'] }; }
  });
  [['m.t2', [2, 5, 10], ['Times 2, 5, 10', 'الضرب في ٢ و٥ و١٠']], ['m.t3', [3, 4], ['Times 3 and 4', 'الضرب في ٣ و٤']], ['m.t6', [6, 7, 8, 9], ['Times 6 to 9', 'الضرب في ٦ إلى ٩']]].forEach(function (d) {
    C.add(d[0], {
      title: d[2], art: 'star', soloN: 5,
      meet: [{ k: 'say', p: ['You know more than you think: 3 × 7 is the same as 7 × 3. Learn the facts you do not have yet.', 'تعرف أكثر مما تظن: ٣ × ٧ هي ٧ × ٣. احفظ الحقائق التي لم تحفظها.'], big: d[1].join('  ·  ') }],
      guided: function (r) { var a = d[1][0], b = r.int(3, 9); return [{ k: 'array', r: a, c: b, anyWay: true, max: 10, p: ['Build ' + a + ' × ' + b + '.', 'ابنِ ' + ar(a) + ' × ' + ar(b) + '.'], hint: ['Rows down, columns across.', 'الصفوف نزولًا والأعمدة عرضًا.'] }]; },
      solo: function (r) { return fact(r, d[1]); },
      review: function (r) { return fact(r, d[1]); }
    });
  });
  C.add('m.area', {
    title: ['Splitting to multiply', 'التجزئة في الضرب'], art: 'square',
    meet: [{ k: 'say', p: ['3 × 14 looks hard. Split 14 into 10 and 4. Now it is two easy parts.', '٣ × ١٤ تبدو صعبة. جزّئ ١٤ إلى ١٠ و٤. صارت جزأين سهلين.'], html: function () { return I.areaHtml(3, 14); }, t: ['30 + 12 = 42', '٣٠ + ١٢ = ٤٢'] }],
    guided: [{ k: 'pad', eq: '4 × 13 = ?', a: 52, p: ['4 × 10, then 4 × 3, then add.', '٤ × ١٠ ثم ٤ × ٣ ثم اجمع.'], err: 'times', html: function () { return I.areaHtml(4, 13); }, hint: ['40 + 12.', '٤٠ + ١٢.'] }],
    solo: function (r) { var a = r.int(2, 9), b = r.int(11, 39); return pad(a + ' × ' + b + ' = ?', a * b, ['Split it, then add.', 'جزّئها ثم اجمع.'], 'times', { html: I.areaHtml(a, b), hint: [a + ' × ' + (Math.floor(b / 10) * 10) + ', then ' + a + ' × ' + (b % 10) + '.', ar(a) + ' × ' + ar(Math.floor(b / 10) * 10) + ' ثم ' + ar(a) + ' × ' + ar(b % 10) + '.'] }); },
    review: function (r) { var a = r.int(2, 9), b = r.int(11, 39); return pad(a + ' × ' + b + ' = ?', a * b, ['Work it out.', 'احسبها.'], 'times'); }
  });
  C.add('m.div', {
    title: ['Dividing', 'القسمة'], art: 'date',
    meet: [{ k: 'say', p: ['Twelve dates for four people. Sharing is dividing, and it undoes multiplying.', 'اثنتا عشرة تمرة لأربعة أشخاص. التوزيع قسمة، وهي عكس الضرب.'], big: '12 ÷ 4 = 3' }],
    guided: [{ k: 'share', n: 15, k_: 3, p: ['Share 15 on 3 plates.', 'وزّع ١٥ على ٣ أطباق.'], hint: ['One to each plate, again and again.', 'واحدة لكل طبق ثم كرر.'] }],
    solo: function (r, i) { var k = r.int(2, 9), a = r.int(2, 9); if (i === 2) { var n = k * a + 1 + (k > 2 ? r.int(0, k - 2) : 0); return { k: 'share', n: Math.min(n, 24), k_: Math.min(k, 4), p: ['Share them fairly. Some may be left over.', 'وزّعها بالعدل. قد يبقى شيء.'], hint: ['Stop when you cannot give every plate one more.', 'توقف إذا لم تستطع إعطاء كل طبق واحدة أخرى.'] }; } return pad((k * a) + ' ÷ ' + k + ' = ?', a, ['What times ' + k + ' makes ' + k * a + '?', 'ما العدد الذي إذا ضُرب في ' + ar(k) + ' صار ' + ar(k * a) + '؟'], 'times', { hint: ['Use your times facts backwards.', 'استعمل حقائق الضرب بالعكس.'] }); },
    review: function (r) { var k = r.int(2, 9), a = r.int(2, 9); return pad((k * a) + ' ÷ ' + k + ' = ?', a, ['Divide.', 'اقسم.'], 'times'); }
  });

  C.unit('math', 'm-frac', ['Fractions and percent', 'الكسور والنسب'], 2);
  C.add('m.fname', {
    title: ['What a fraction means', 'معنى الكسر'], art: 'bread', needs: ['m.div'],
    meet: [{ k: 'say', p: ['Cut bread into four equal parts. Take three. That is three quarters.', 'اقسم الخبز أربعة أجزاء متساوية. خذ ثلاثة. هذه ثلاثة أرباع.'], html: function () { return I.fracBar(3, 4); } }],
    name: [{ k: 'say', p: ['The bottom says how many equal parts. The top says how many you have.', 'الأسفل عدد الأجزاء المتساوية. والأعلى عدد ما عندك.'], html: '<span class="fr big" dir="ltr"><b>3</b><i></i><b>4</b></span>' }],
    guided: [{ k: 'frac', n: 2, d: 3, p: ['Show two thirds.', 'أرني ثلثين.'], hint: ['Fold into 3 first. Then shade 2.', 'اطوِ إلى ٣ أولًا ثم ظلّل ٢.'] }],
    solo: function (r) { var d = r.pick([2, 3, 4, 5, 6, 8]), n = r.int(1, d - 1); return { k: 'frac', n: n, d: d, p: ['Show ' + n + ' out of ' + d + '.', 'أرني ' + ar(n) + ' من ' + ar(d) + '.'], hint: ['Equal parts first. Then shade.', 'الأجزاء المتساوية أولًا ثم التظليل.'] }; },
    make: [{ k: 'mission', art: 'bread', t: ['Fold a sheet of paper into 2, then 4, then 8. Unfold it each time. What do you notice?', 'اطوِ ورقة إلى ٢ ثم ٤ ثم ٨. وافتحها كل مرة. ماذا تلاحظ؟'] }],
    review: function (r) { var d = r.pick([2, 3, 4, 5, 6, 8]), n = r.int(1, d - 1); return { k: 'frac', n: n, d: d, p: ['Show ' + n + ' out of ' + d + '.', 'أرني ' + ar(n) + ' من ' + ar(d) + '.'] }; }
  });
  C.add('m.fcmp', {
    title: ['Which fraction is bigger?', 'أي الكسرين أكبر؟'], art: 'bread',
    meet: [{ k: 'say', p: ['One date shared by two, or by four? More people means a smaller piece.', 'تمرة بين اثنين أم بين أربعة؟ كلما زاد الناس صغرت القطعة.'], html: function () { return I.fracBar(1, 2) + I.fracBar(1, 4); } }],
    solo: function (r) { var d1 = r.pick([2, 3, 4]), d2 = r.pick([5, 6, 8]), n = 1; var bigger = r.bool() ? [1, d1, 1, d2] : [1, d1, 1, d2]; return { k: 'choice', p: ['Which is bigger?', 'أيهما أكبر؟'], cols: 1, hint: ['Bigger bottom: smaller pieces.', 'كلما كبر المقام صغرت القطعة.'], o: [{ html: '<span class="fr" dir="ltr"><b>1</b><i></i><b>' + d1 + '</b></span>' + I.fracBar(1, d1), ok: true }, { html: '<span class="fr" dir="ltr"><b>1</b><i></i><b>' + d2 + '</b></span>' + I.fracBar(1, d2), e: 'fraction-size' }] }; },
    review: function (r) { var d1 = r.pick([2, 3]), d2 = r.pick([6, 8]); return { k: 'choice', p: ['Which is bigger?', 'أيهما أكبر؟'], cols: 1, o: [{ html: '<span class="fr" dir="ltr"><b>1</b><i></i><b>' + d1 + '</b></span>', ok: true }, { html: '<span class="fr" dir="ltr"><b>1</b><i></i><b>' + d2 + '</b></span>', e: 'fraction-size' }] }; }
  });
  C.add('m.feq', {
    title: ['Same amount, different name', 'الكمية نفسها باسم آخر'], art: 'bread',
    meet: [{ k: 'say', p: ['One half and two quarters cover exactly the same. Fold it and see.', 'النصف والربعان يغطيان الشيء نفسه. اطوِ وانظر.'], html: function () { return I.fracBar(1, 2) + I.fracBar(2, 4); } }],
    solo: function (r) { var d = r.pick([2, 3, 4, 5]), n = r.int(1, d - 1), k = r.pick([2, 3]); return pad(n + '/' + d + ' = ?/' + (d * k), n * k, ['Multiply top and bottom by the same number.', 'اضرب البسط والمقام في العدد نفسه.'], 'fraction-parts', { hint: ['The bottom was times ' + k + '. Do the same on top.', 'ضُرب المقام في ' + ar(k) + '. افعل مثله في البسط.'] }); },
    review: function (r) { var d = r.pick([2, 3, 4, 5]), n = r.int(1, d - 1), k = r.pick([2, 3]); return pad(n + '/' + d + ' = ?/' + (d * k), n * k, ['Same amount.', 'الكمية نفسها.'], 'fraction-parts'); }
  });
  C.add('m.fadd', {
    title: ['Adding fractions', 'جمع الكسور'], art: 'bread',
    meet: [{ k: 'say', p: ['Same-size pieces can simply be counted. One fifth and two fifths: three fifths.', 'القطع المتساوية تُعدّ ببساطة. خُمس وخمسان: ثلاثة أخماس.'], html: function () { return I.fracBar(3, 5); } }],
    solo: function (r) { var d = r.pick([4, 5, 6, 8, 10]), a = r.int(1, d - 2), b = r.int(1, d - a - 1); return pad(a + '/' + d + ' + ' + b + '/' + d + ' = ?/' + d, a + b, ['Count the pieces.', 'عُدّ القطع.'], 'fraction-parts', { hint: ['The bottom stays. Add only the tops.', 'المقام ثابت. اجمع البسط فقط.'], html: I.fracBar(a + b, d) }); },
    review: function (r) { var d = r.pick([4, 5, 6, 8]), a = r.int(1, d - 2), b = r.int(1, d - a - 1); return pad(a + '/' + d + ' + ' + b + '/' + d + ' = ?/' + d, a + b, ['Add.', 'اجمع.'], 'fraction-parts'); }
  });
  C.add('m.zakah', {
    title: ['Percent and zakāh', 'النسبة والزكاة'], art: 'coin',
    meet: [{ k: 'say', p: ['Percent means out of a hundred. Zakāh on saved money is one part in forty: that is 2.5 out of every 100.', 'النسبة المئوية تعني من مئة. وزكاة المال ربع العشر: ٢٫٥ من كل ١٠٠.'], art: 'coin', t: ['This is arithmetic with made-up amounts, not a ruling for your family.', 'هذا حساب بمبالغ مفترضة وليس حكمًا لعائلتك.'] }],
    name: [{ k: 'say', p: ['To find one fortieth, divide by forty.', 'لتجد ربع العشر اقسم على أربعين.'], big: '800 ÷ 40 = 20' }],
    guided: [{ k: 'pad', eq: '400 ÷ 40 = ?', a: 10, p: ['A saver holds 400 coins. One fortieth is how many?', 'مع شخص ٤٠٠ قطعة. كم ربع عشرها؟'], err: 'understanding', hint: ['Take off a zero from each: 40 ÷ 4.', 'احذف صفرًا من كل منهما: ٤٠ ÷ ٤.'] }],
    solo: function (r, i) { if (i === 2) { var p = r.pick([10, 20, 25, 50]), base = r.pick([100, 200, 400]); return pad(p + '% of ' + base + ' = ?', p * base / 100, ['Percent means out of a hundred.', 'النسبة تعني من مئة.'], 'understanding', { hint: ['Find 1%, then multiply.', 'جد ١٪ ثم اضرب.'] }); } var c = r.int(2, 30) * 40; return pad(c + ' ÷ 40 = ?', c / 40, ['One fortieth of ' + c + ' coins.', 'ربع عشر ' + ar(c) + ' قطعة.'], 'understanding', { hint: ['Divide by 10, then by 4.', 'اقسم على ١٠ ثم على ٤.'] }); },
    review: function (r) { var c = r.int(2, 30) * 40; return pad(c + ' ÷ 40 = ?', c / 40, ['One fortieth.', 'ربع العشر.'], 'understanding'); }
  });
  C.unit('math', 'm-space', ['Space and data', 'الفضاء والبيانات'], 2);
  C.add('m.angle', {
    title: ['Turns and angles', 'الدورات والزوايا'], art: 'kaaba', needs: ['m.array'],
    meet: [{ k: 'say', p: ['A full turn is 360 degrees. When we turn towards the qibla, we are turning through an angle.', 'الدورة الكاملة ٣٦٠ درجة. وحين نتجه إلى القبلة ندور بزاوية.'], art: 'kaaba' }],
    name: [{ k: 'say', p: ['A quarter turn is 90 degrees: a right angle, like the corner of a page.', 'ربع الدورة ٩٠ درجة: زاوية قائمة كزاوية الصفحة.'], big: '90°   180°   360°' }],
    solo: function (r) { var t = r.pick([[['a quarter turn', 'ربع دورة'], 90], [['a half turn', 'نصف دورة'], 180], [['a full turn', 'دورة كاملة'], 360], [['three quarter turns', 'ثلاثة أرباع دورة'], 270]]); return pad('? °', t[1], ['How many degrees in ' + t[0][0] + '?', 'كم درجة في ' + t[0][1] + '؟'], 'understanding', { hint: ['A full turn is 360. Divide by 4 for a quarter.', 'الدورة ٣٦٠. اقسم على ٤ للربع.'] }); },
    make: [{ k: 'mission', art: 'masjid', t: ['Stand facing the qibla where you pray. Now turn a quarter turn. What are you facing?', 'قف متجهًا إلى القبلة حيث تصلي. دُر ربع دورة. ماذا أمامك؟'] }],
    review: function (r) { return pad('? °', 90, ['Degrees in a quarter turn?', 'كم درجة في ربع دورة؟'], 'understanding'); }
  });
  C.add('m.area2', {
    title: ['Perimeter and area', 'المحيط والمساحة'], art: 'rect',
    meet: [{ k: 'say', p: ['A prayer mat: walking around it is the perimeter. Covering it is the area.', 'سجادة الصلاة: الدوران حولها محيط، وتغطيتها مساحة.'], html: function () { return I.arrayHtml(3, 6); } }],
    solo: function (r, i) { var a = r.int(2, 9), b = r.int(2, 12); return i % 2 ? pad('2 × (' + a + ' + ' + b + ') = ?', 2 * (a + b), ['Perimeter of a ' + a + ' by ' + b + ' rectangle.', 'محيط مستطيل ' + ar(a) + ' في ' + ar(b) + '.'], 'understanding', { hint: ['Add all four sides.', 'اجمع الأضلاع الأربعة.'] }) : pad(a + ' × ' + b + ' = ?', a * b, ['Area of a ' + a + ' by ' + b + ' rectangle.', 'مساحة مستطيل ' + ar(a) + ' في ' + ar(b) + '.'], 'times', { hint: ['Rows times columns.', 'الصفوف في الأعمدة.'] }); },
    make: [{ k: 'mission', art: 'foot', t: ['Measure a prayer mat with your hand-spans. Work out its perimeter and area.', 'قِس سجادة الصلاة بشبرك. احسب محيطها ومساحتها.'] }],
    review: function (r) { var a = r.int(2, 9), b = r.int(2, 12); return pad(a + ' × ' + b + ' = ?', a * b, ['Area of ' + a + ' by ' + b + '.', 'مساحة ' + ar(a) + ' في ' + ar(b) + '.'], 'times'); }
  });
  C.add('m.inherit', {
    title: ['Dividing by exact shares', 'القسمة بأنصبة محددة'], art: 'coin',
    meet: [{ k: 'say', p: ['Muslim scholars became masters of fractions partly because the Qurʾān gives exact shares in inheritance. Here is the arithmetic, with made-up counters.', 'برع علماء المسلمين في الكسور لأسباب منها أن القرآن حدد أنصبة الميراث. وهذا حساب بقطع مفترضة.'], art: 'book', t: ['Practice in fractions only. Real inheritance is for those who know its rulings.', 'تدريب على الكسور فقط. والميراث الحقيقي لأهل العلم به.'] }],
    solo: function (r) { var d = r.pick([2, 3, 4, 6, 8]), k = r.int(2, 8), tot = d * k, n = r.int(1, d - 1); return pad(n + '/' + d + ' of ' + tot + ' = ?', n * k, ['A share of ' + n + '/' + d + ' of ' + tot + ' counters.', 'نصيب ' + ar(n) + '/' + ar(d) + ' من ' + ar(tot) + ' قطعة.'], 'understanding', { html: I.fracBar(n, d), hint: ['Divide by ' + d + ', then times ' + n + '.', 'اقسم على ' + ar(d) + ' ثم اضرب في ' + ar(n) + '.'] }); },
    review: function (r) { var d = r.pick([2, 4, 8]), k = r.int(2, 8), n = r.int(1, d - 1); return pad(n + '/' + d + ' of ' + d * k + ' = ?', n * k, ['Find the share.', 'جد النصيب.'], 'understanding'); }
  });
  /* the share instrument's plate count travels as k_, so "k" can name the instrument */
  var _share = I.share;
  I.share = function (c) { c.step = Object.assign({}, c.step, { k: c.step.k_ }); _share(c); };
})();
