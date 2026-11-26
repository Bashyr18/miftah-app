/* Maths taught in full, Year 7. See lesson/teach.js for the shape of a topic. */
(function () {
  'use strict';
  var C = window.C, D = window.Dia, teach = C.teach, TM = C.TM, gcd = TM.gcd, low = TM.low, dp = TM.dp, mn = TM.m, sg = TM.sg;

  /* ---------- getting ready for what comes next ---------- */
  teach('m7.power', {
    why: ['Powers write huge growth in small space: bacteria, savings and computer memory all double.', 'القوى تكتب النمو الهائل في حيز صغير: البكتيريا والمدخرات وذاكرة الحاسوب كلها تتضاعف.'],
    idea: [['2⁵ means 2 × 2 × 2 × 2 × 2. The small number counts how many times the big one is multiplied.', '٢⁵ تعني ٢ × ٢ × ٢ × ٢ × ٢. الرقم الصغير يعدّ مرات ضرب الكبير.'], ['2⁵ = 32, not 2 × 5. Powers grow very fast.', '٢⁵ = ٣٢ وليست ٢ × ٥. القوى تنمو بسرعة كبيرة.']],
    g: function (r, lv) {
      var b = r.int(2, lv === 1 ? 5 : 10), n = lv === 1 ? r.int(2, 3) : r.int(2, 4); if (b > 6 && n > 3) n = 3; var parts = [], cur = 1, s = []; for (var i = 0; i < n; i++) parts.push(b);
      for (var k = 2; k <= n; k++) { s.push(['Multiply by ' + b + ' again', 'اضرب في ' + b + ' مرة أخرى', Math.pow(b, k - 1) + ' × ' + b + ' =', Math.pow(b, k)]); }
      var v = Math.pow(b, n), sup = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶'][n];
      if (lv === 3) { var d = r.int(3, 9); return { q: ['A message is passed on so the number who have seen it doubles each hour, starting from 1. How many after ' + d + ' hours?', 'تتضاعف أعداد من رأوا رسالة كل ساعة ابتداءً من شخص واحد. كم عددهم بعد ' + d + ' ساعات؟'], eq: '2^' + d, a: Math.pow(2, d), s: [['Doubling ' + d + ' times', 'مضاعفة ' + d + ' مرات', '2 × ' + Math.pow(2, d - 1) + ' =', Math.pow(2, d)]], miss: [[2 * d, 'That is 2 × ' + d + '. It doubles each hour, so it multiplies again and again.', 'هذا ٢ × ' + d + '. يتضاعف كل ساعة فالضرب يتكرر.']] }; }
      return { q: ['Work out the power.', 'احسب القوة.'], eq: b + sup, a: v, s: [['Write it out', 'اكتبها كاملة', parts.join(' × ')]].concat(s), miss: [[b * n, b + sup + ' is not ' + b + ' × ' + n + '. Multiply ' + b + ' by itself.', b + sup + ' ليست ' + b + ' × ' + n + '. اضرب ' + b + ' في نفسه.']] };
    },
    trap: function (r) { var b = r.int(3, 6); return { w: 1, why: [b + '³ is ' + b + ' × ' + b + ' × ' + b + ' = ' + (b * b * b) + '.', b + '³ هي ' + b + ' × ' + b + ' × ' + b + ' = ' + (b * b * b) + '.'], l: ['2² = 4', b + '³ = ' + (b * 3), '10² = 100'] }; },
    explain: [['Why is 3⁴ so much bigger than 3 × 4?', 'لماذا ٣⁴ أكبر بكثير من ٣ × ٤؟'], ['It multiplies by 3 repeatedly, rather than adding 3 repeatedly.', 'تضرب في ٣ مرارًا بدل أن تجمع ٣ مرارًا.'], ['Because 4 is written smaller.', 'لأن ٤ مكتوبة أصغر.'], ['They are equal.', 'هما متساويان.']]
  });

  teach('m7.big', {
    why: ['A country\'s population and a nation\'s budget are in millions. Reading them correctly matters.', 'سكان البلد وميزانيتها بالملايين، وقراءتها بدقة مهمة.'],
    idea: [['Group digits in threes from the right: 4 250 000 is four million, two hundred and fifty thousand.', 'جمّع الأرقام ثلاثة ثلاثة من اليمين: ٤٬٢٥٠٬٠٠٠ أربعة ملايين ومئتان وخمسون ألفًا.'], ['A million is a thousand thousands. Rounding to the nearest million looks only at the hundred thousands digit.', 'المليون ألف ألف. وللتقريب إلى أقرب مليون انظر إلى رقم مئات الألوف فقط.']],
    g: function (r, lv) {
      var m = r.int(1, 9), th = r.int(1, 9) * 100, n = m * 1000000 + th * 1000;
      if (lv === 1) return { q: ['How many thousands are in ' + m + ' million? Type the number of thousands.', 'كم ألفًا في ' + m + ' مليون؟ اكتب عدد الآلاف.'], eq: m + ' × 1000', a: m * 1000, s: [['A million is 1000 thousands', 'المليون ١٠٠٠ ألف', m + ' × 1000 =', m * 1000]] };
      if (lv === 2) { var rd = th >= 500 ? m + 1 : m; return { q: ['Round ' + n + ' to the nearest million. Type the number of millions.', 'قرّب ' + n + ' إلى أقرب مليون. اكتب عدد الملايين.'], a: rd, s: [['Look at the hundred thousands', 'انظر إلى مئات الألوف', 'Digit:', th / 100], [th >= 500 ? '5 or more, so round up' : 'Below 5, so round down', th >= 500 ? '٥ فأكثر فقرّب إلى الأعلى' : 'أقل من ٥ فقرّب إلى الأسفل', 'Answer:', rd]], miss: [[th >= 500 ? m : m + 1, 'Check the hundred thousands digit: ' + (th / 100) + '.', 'راجع رقم مئات الألوف: ' + (th / 100) + '.']] }; }
      var a = r.int(11, 49) * 100000, b = r.int(11, 49) * 100000;
      return { q: ['Add. Give the answer in full.', 'اجمع. أعط الناتج كاملًا.'], eq: a + ' + ' + b, a: a + b, s: [['Count in hundred thousands', 'عُدّ بمئات الألوف', (a / 100000) + ' + ' + (b / 100000) + ' =', (a + b) / 100000], ['Back to full size', 'أعده إلى حجمه', ((a + b) / 100000) + ' × 100000 =', a + b]] };
    },
    trap: function (r) { var m = r.int(2, 8); return { w: 1, why: ['A million has 6 zeros, so ' + m + ' million is ' + (m * 1000000) + '.', 'في المليون ٦ أصفار، فـ ' + m + ' مليون هي ' + (m * 1000000) + '.'], l: ['1000 × 1000 = 1000000', m + ' × 1000000 = ' + (m * 100000), m + ' × 1000 = ' + (m * 1000)] }; },
    explain: [['How long would it take to count to a million, one number a second?', 'كم يستغرق العدّ إلى مليون بمعدل عدد في الثانية؟'], ['About 11 days without stopping.', 'نحو ١١ يومًا دون توقف.'], ['About an hour.', 'نحو ساعة.'], ['About a year.', 'نحو سنة.']]
  });

  teach('m7.seq', {
    why: ['Spotting the rule in a pattern lets you predict what comes next. That is what science is.', 'اكتشاف قاعدة النمط يتيح التنبؤ بالتالي. وهذا هو العلم.'],
    idea: [['Find what changes from one term to the next. If it is the same each time, the pattern goes up in equal steps.', 'أوجد ما يتغير من حد إلى التالي. إذا تساوى فالنمط يصعد بخطوات متساوية.'], ['3, 7, 11, 15: add 4 each time. The next is 19.', '٣ و٧ و١١ و١٥: أضف ٤ كل مرة. التالي ١٩.']],
    g: function (r, lv) {
      var a = r.int(1, 12), d = r.int(2, 9) * (lv > 1 && r.bool() ? -1 : 1), t = [0, 1, 2, 3].map(function (i) { return a + 20 * (d < 0 ? 1 : 0) + i * d; }), nx = t[3] + d;
      if (lv === 3) { var f = r.pick([2, 3]), s0 = r.int(1, 4), g2 = [0, 1, 2, 3].map(function (i) { return s0 * Math.pow(f, i); }), nx2 = g2[3] * f; return { q: ['This pattern multiplies each time. What comes next?', 'هذا النمط يتضاعف. ما التالي؟'], eq: g2.join(', ') + ', ?', a: nx2, s: [['Find the multiplier', 'أوجد المضاعف', g2[1] + ' ÷ ' + g2[0] + ' =', f], ['Multiply the last term', 'اضرب الحد الأخير', g2[3] + ' × ' + f + ' =', nx2]], miss: [[g2[3] + (g2[3] - g2[2]), 'The gaps are not equal: it multiplies.', 'الفروق ليست متساوية: النمط يضرب.']] }; }
      return { q: ['What comes next?', 'ما التالي؟'], eq: t.join(', ') + ', ?', a: nx, s: [['The step each time', 'الخطوة كل مرة', t[1] + ' − ' + t[0] + ' =', mn(d)], ['Do it once more', 'أضفها مرة أخرى', t[3] + (d < 0 ? ' − ' : ' + ') + Math.abs(d) + ' =', nx]], miss: [[t[3] + Math.abs(d) === nx ? t[3] - d - 2 * d : t[3] + Math.abs(d), 'The numbers are going ' + (d < 0 ? 'down' : 'up') + '. Check the direction.', 'الأعداد ' + (d < 0 ? 'تنقص' : 'تزيد') + '. راجع الاتجاه.']] };
    },
    trap: function (r) { var a = r.int(2, 9), d = r.int(3, 7); return { eq: a + ', ' + (a + d) + ', ' + (a + 2 * d) + ', ?', w: 1, why: ['The step is ' + d + ', so the next is ' + (a + 3 * d) + '.', 'الخطوة ' + d + '، فالتالي ' + (a + 3 * d) + '.'], l: [(a + d) + ' − ' + a + ' = ' + d, (a + 2 * d) + ' + ' + d + ' = ' + (a + 3 * d + 1), 'Next: ' + (a + 3 * d + 1)] }; },
    explain: [['Why check more than one gap?', 'لماذا نراجع أكثر من فرق واحد؟'], ['One gap may mislead: the rule must fit every term.', 'قد يضلل فرق واحد: يجب أن تناسب القاعدة كل الحدود.'], ['To use up time.', 'لقضاء الوقت.'], ['One gap is always enough.', 'فرق واحد يكفي دائمًا.']]
  });

  teach('m7.pctc', {
    why: ['Prices rise and fall by percent. A one-step method saves a step and many mistakes.', 'ترتفع الأسعار وتنخفض بنسب. وطريقة الخطوة الواحدة توفر خطوة وأخطاء كثيرة.'],
    idea: [['To add 20%, you keep 100% and add 20%: multiply by 1.2. To take off 20%, multiply by 0.8.', 'لإضافة ٢٠٪ تبقي ١٠٠٪ وتضيف ٢٠٪: اضرب في ١٫٢. ولخصم ٢٠٪ اضرب في ٠٫٨.'], ['A rise of 20% on 50 is 50 × 1.2 = 60.', 'زيادة ٢٠٪ على ٥٠ هي ٥٠ × ١٫٢ = ٦٠.']],
    g: function (r, lv) {
      var T0 = r.pick([40, 50, 60, 80, 100, 120, 200, 250, 400]), p = r.pick(lv === 1 ? [10, 20, 50] : [5, 15, 25, 30, 40]), up = lv === 1 ? true : r.bool(), mult = dp(1 + (up ? p : -p) / 100, 4), ans = dp(T0 * mult, 2);
      var ctx = lv === 3 ? (up ? ['A rent of ' + T0 + ' rises by ' + p + '%. What is the new rent?', 'إيجار ' + T0 + ' زاد ' + p + '٪. كم الإيجار الجديد؟'] : ['A coat of ' + T0 + ' is ' + p + '% off. What is the sale price?', 'معطف بـ ' + T0 + ' عليه خصم ' + p + '٪. كم سعره بعد الخصم؟']) : [(up ? 'Increase ' : 'Decrease ') + T0 + ' by ' + p + '%.', (up ? 'زد ' : 'أنقص ') + T0 + ' بنسبة ' + p + '٪.'];
      return { q: ctx, eq: T0 + ' × ' + mult, a: ans, s: [['The multiplier', 'المضاعف', (up ? '100 + ' : '100 − ') + p + ' =', up ? 100 + p : 100 - p], ['As a decimal', 'كسرًا عشريًا', (up ? 100 + p : 100 - p) + ' ÷ 100 =', mult], ['Multiply', 'اضرب', T0 + ' × ' + mult + ' =', ans]], miss: [[dp(T0 * p / 100, 2), 'That is the change alone. Find the new amount.', 'هذا التغير وحده. أوجد المقدار الجديد.'], [up ? dp(T0 - T0 * p / 100, 2) : dp(T0 + T0 * p / 100, 2), 'Wrong direction. Check whether it goes up or down.', 'اتجاه خاطئ. راجع هل يزيد أم ينقص.']] };
    },
    trap: function (r) { var T0 = r.pick([50, 80, 200]); return { eq: T0 + ' − 20%', w: 0, why: ['Keeping 80% means multiplying by 0.8, not 0.2.', 'إبقاء ٨٠٪ يعني الضرب في ٠٫٨ لا ٠٫٢.'], l: [T0 + ' × 0.2 = ' + (T0 * .8), 'Answer: ' + (T0 * .8), ['So 80% is left', 'فيبقى ٨٠٪']] }; },
    explain: [['Why does × 1.2 add 20%?', 'لماذا × ١٫٢ تضيف ٢٠٪؟'], ['1 keeps the whole and 0.2 is the extra 20%.', '١ تبقي الكل و٠٫٢ هي ٢٠٪ الزائدة.'], ['1.2 is just a nearby number.', '١٫٢ مجرد عدد قريب.'], ['Because 1 + 2 = 3.', 'لأن ١ + ٢ = ٣.']]
  });

  teach('m7.harvest', { keep: true,
    g: function (r, lv) {
      var w = r.int(2, lv === 1 ? 10 : 80) * 100, rate = r.pick([5, 10]), ans = w * rate / 100;
      return { q: ['Find ' + rate + '% of ' + w + '.', 'أوجد ' + rate + '٪ من ' + w + '.'], eq: rate + '% × ' + w, a: ans, s: rate === 10 ? [['10% is a tenth', '١٠٪ عُشر', w + ' ÷ 10 =', ans]] : [['10% first', '١٠٪ أولًا', w + ' ÷ 10 =', w / 10], ['5% is half of that', '٥٪ نصفها', (w / 10) + ' ÷ 2 =', ans]], miss: [[w - ans, 'That is what remains. Give the ' + rate + '% itself.', 'هذا الباقي. أعط ' + rate + '٪ نفسها.']] };
    },
    trap: function (r) { var w = r.int(2, 9) * 200; return { eq: '5% × ' + w, w: 1, why: ['5% is half of 10%: ' + (w / 10) + ' ÷ 2 = ' + (w / 20) + '.', '٥٪ نصف ١٠٪: ' + (w / 10) + ' ÷ ٢ = ' + (w / 20) + '.'], l: [w + ' ÷ 10 = ' + (w / 10), (w / 10) + ' ÷ 2 = ' + (w / 10), 'Answer: ' + (w / 10)] }; },
    explain: [['What is the quickest way to find 5% of an amount?', 'ما أسرع طريقة لإيجاد ٥٪ من مقدار؟'], ['Find 10%, then halve it.', 'أوجد ١٠٪ ثم نصّفها.'], ['Divide by 5.', 'اقسم على ٥.'], ['Add 5.', 'أضف ٥.']]
  });

  /* ---------- algebra ---------- */
  teach('m7.sub', {
    why: ['Every formula in science is used by putting numbers in for letters.', 'كل صيغة في العلوم تُستخدم بوضع أعداد مكان الحروف.'],
    idea: [['Replace each letter by its number, then follow the order of operations. 3x + 2 with x = 4 is 3 × 4 + 2 = 14.', 'ضع العدد مكان الحرف ثم اتبع ترتيب العمليات. ٣x + ٢ عند x = ٤ هي ٣ × ٤ + ٢ = ١٤.'], ['3x means 3 × x, never thirty-something. x² means x × x.', '٣x تعني ٣ × x لا عددًا في الثلاثينات. وx² تعني x × x.']],
    g: function (r, lv) {
      var x = r.int(2, 9), a = r.int(2, 9), b = r.int(1, 12);
      if (lv === 1) return { q: ['Find the value when x = ' + x + '.', 'أوجد القيمة عندما x = ' + x + '.'], eq: a + 'x + ' + b, a: a * x + b, s: [['Multiply first', 'اضرب أولًا', a + ' × ' + x + ' =', a * x], ['Then add', 'ثم اجمع', (a * x) + ' + ' + b + ' =', a * x + b]], miss: [[Number(a + '' + x) + b, a + 'x means ' + a + ' × x, not the digits side by side.', a + 'x تعني ' + a + ' × x لا الرقمين متجاورين.']] };
      if (lv === 2) { var y = r.int(2, 6); return { q: ['Find the value when x = ' + x + ' and y = ' + y + '.', 'أوجد القيمة عندما x = ' + x + ' وy = ' + y + '.'], eq: 'x² + ' + a + 'y', a: x * x + a * y, s: [['x² means x × x', 'x² تعني x × x', x + ' × ' + x + ' =', x * x], ['Then the y term', 'ثم حد y', a + ' × ' + y + ' =', a * y], ['Add', 'اجمع', (x * x) + ' + ' + (a * y) + ' =', x * x + a * y]], miss: [[2 * x + a * y, 'x² is x × x, not 2 × x.', 'x² هي x × x لا ٢ × x.']] }; }
      var l = r.int(3, 15), w = r.int(2, 9);
      return { q: ['The perimeter of a rectangle is P = 2l + 2w. Find P when l = ' + l + ' and w = ' + w + '.', 'محيط المستطيل P = 2l + 2w. أوجد P عندما l = ' + l + ' وw = ' + w + '.'], eq: '2l + 2w', a: 2 * l + 2 * w, s: [['2l', '2l', '2 × ' + l + ' =', 2 * l], ['2w', '2w', '2 × ' + w + ' =', 2 * w], ['Add', 'اجمع', (2 * l) + ' + ' + (2 * w) + ' =', 2 * l + 2 * w]], miss: [[l * w, 'That is the area. The formula says perimeter.', 'هذه المساحة. الصيغة للمحيط.']] };
    },
    trap: function (r) { var x = r.int(3, 7), a = r.int(2, 5); return { eq: a + 'x + 1 , x = ' + x, w: 0, why: [a + 'x means ' + a + ' × ' + x + ' = ' + (a * x) + '.', a + 'x تعني ' + a + ' × ' + x + ' = ' + (a * x) + '.'], l: [a + 'x = ' + a + x, (a + '' + x) + ' + 1 = ' + (Number(a + '' + x) + 1), 'Answer: ' + (Number(a + '' + x) + 1)] }; },
    explain: [['Why does 3x not mean 34 when x = 4?', 'لماذا لا تعني ٣x العدد ٣٤ عندما x = ٤؟'], ['A number next to a letter means multiply: 3 × 4 = 12.', 'العدد بجانب الحرف يعني الضرب: ٣ × ٤ = ١٢.'], ['Because 34 is too big.', 'لأن ٣٤ كبير جدًا.'], ['It does mean 34.', 'بل تعني ٣٤.']]
  });

  teach('m7.like', {
    why: ['Simplifying first turns long algebra into short algebra.', 'التبسيط أولًا يحوّل الجبر الطويل إلى قصير.'],
    idea: [['Like terms have exactly the same letter part. 3x and 5x can join: 8x. 3x and 5y cannot.', 'الحدود المتشابهة لها الجزء الحرفي نفسه. ٣x و٥x يجتمعان: ٨x. أما ٣x و٥y فلا.'], ['Think of x as apples: 3 apples and 5 apples are 8 apples, but apples and oranges stay apart.', 'تخيل x تفاحًا: ٣ تفاحات و٥ تفاحات ٨ تفاحات، أما التفاح والبرتقال فلا يجتمعان.']],
    g: function (r, lv) {
      var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), d = r.int(1, 9);
      if (lv === 1) return { q: ['Simplify.', 'بسّط.'], eq: a + 'x + ' + b + 'x', alg: true, a: (a + b) + 'x', s: [['Same letter: add the numbers', 'الحرف نفسه: اجمع الأعداد', a + ' + ' + b + ' =', a + b], ['Keep the letter', 'أبقِ الحرف', (a + b) + 'x']] };
      if (lv === 2) { var big = a + b + 1, res = big - b; return { q: ['Simplify.', 'بسّط.'], eq: big + 'x + ' + c + ' − ' + b + 'x + ' + d, alg: true, a: res + 'x+' + (c + d), s: [['Collect the x terms', 'اجمع حدود x', big + ' − ' + b + ' =', res], ['Collect the numbers', 'اجمع الأعداد', c + ' + ' + d + ' =', c + d], ['Together', 'معًا', res + 'x + ' + (c + d)]] }; }
      return { q: ['A rectangle has sides ' + a + 'x and ' + b + '. Write its perimeter in simplest form.', 'مستطيل ضلعاه ' + a + 'x و' + b + '. اكتب محيطه في أبسط صورة.'], eq: a + 'x + ' + b + ' + ' + a + 'x + ' + b, alg: true, a: (2 * a) + 'x+' + (2 * b), s: [['Collect the x terms', 'اجمع حدود x', a + ' + ' + a + ' =', 2 * a], ['Collect the numbers', 'اجمع الأعداد', b + ' + ' + b + ' =', 2 * b], ['Together', 'معًا', (2 * a) + 'x + ' + (2 * b)]] };
    },
    trap: function (r) { var a = r.int(2, 6), b = r.int(2, 6); return { eq: a + 'x + ' + b + 'y', w: 0, why: ['x and y are different, so they cannot be joined.', 'x وy مختلفان فلا يجتمعان.'], l: [a + 'x + ' + b + 'y = ' + (a + b) + 'xy', ['So it is one term', 'فهو حد واحد'], ['No more can be done', 'لا مزيد من التبسيط']] }; },
    explain: [['Why can\'t 3x + 2 become 5x?', 'لماذا لا تصبح ٣x + ٢ هي ٥x؟'], ['2 has no x. Try x = 10: 32 is not 50.', '٢ ليس فيها x. جرّب x = ١٠: ٣٢ ليست ٥٠.'], ['Because 5 is odd.', 'لأن ٥ فردي.'], ['It can.', 'بل تصبح.']]
  });

  teach('m7.brack', {
    why: ['Opening brackets is a way to calculate in your head too: 7 × 13 = 7 × 10 + 7 × 3.', 'فتح الأقواس طريقة للحساب الذهني أيضًا: ٧ × ١٣ = ٧ × ١٠ + ٧ × ٣.'],
    idea: [{ p: ['The number outside multiplies everything inside. 3(x + 4) = 3x + 12.', 'العدد خارج القوس يضرب كل ما بداخله. ٣(x + ٤) = ٣x + ١٢.'], dia: function () { return D.box(['x', '4'], ['3'], [['3x', '12']]); } }, ['A common slip is multiplying only the first term.', 'الخطأ الشائع ضرب الحد الأول فقط.']],
    g: function (r, lv) {
      var a = r.int(2, 9), b = r.int(1, 9), c = r.int(2, 6);
      if (lv === 1) return { q: ['Open the bracket.', 'افتح القوس.'], eq: a + '(x + ' + b + ')', dia: D.box(['x', String(b)], [String(a)]), alg: true, a: a + 'x+' + (a * b), s: [['Multiply x', 'اضرب x', a + 'x'], ['Multiply the number too', 'اضرب العدد أيضًا', a + ' × ' + b + ' =', a * b], ['Together', 'معًا', a + 'x + ' + (a * b)]] };
      if (lv === 2) return { q: ['Open the bracket.', 'افتح القوس.'], eq: a + '(' + c + 'x − ' + b + ')', alg: true, a: (a * c) + 'x-' + (a * b), s: [['Multiply the x term', 'اضرب حد x', a + ' × ' + c + ' =', a * c], ['Multiply the number', 'اضرب العدد', a + ' × ' + b + ' =', a * b], ['Keep the minus', 'أبقِ السالب', (a * c) + 'x − ' + (a * b)]] };
      return { q: ['Open and simplify.', 'افتح وبسّط.'], eq: a + '(x + ' + b + ') + ' + c + 'x', alg: true, a: (a + c) + 'x+' + (a * b), s: [['Open the bracket', 'افتح القوس', a + 'x + ' + (a * b) + ' + ' + c + 'x'], ['Collect the x terms', 'اجمع حدود x', a + ' + ' + c + ' =', a + c], ['Together', 'معًا', (a + c) + 'x + ' + (a * b)]] };
    },
    trap: function (r) { var a = r.int(2, 6), b = r.int(2, 9); return { eq: a + '(x + ' + b + ')', w: 1, why: ['The ' + a + ' multiplies both: ' + a + ' × ' + b + ' = ' + (a * b) + '.', 'العدد ' + a + ' يضرب الاثنين: ' + a + ' × ' + b + ' = ' + (a * b) + '.'], l: [['Multiply x: ' + a + 'x', 'اضرب x: ' + a + 'x'], ['The ' + b + ' stays as it is', 'يبقى ' + b + ' كما هو'], 'Answer: ' + a + 'x + ' + b] }; },
    explain: [['Why must the outside number multiply every term?', 'لماذا يضرب العدد الخارجي كل الحدود؟'], ['It says: this many of everything inside.', 'يعني: هذا العدد من كل ما بالداخل.'], ['Only the first term is near it.', 'الحد الأول فقط قريب منه.'], ['So there are more numbers.', 'لتكثر الأعداد.']]
  });

  teach('m7.both', {
    why: ['Two phone plans, two prices: when are they equal? That is an equation with letters on both sides.', 'خطتان للهاتف بسعرين: متى يتساويان؟ هذه معادلة بحروف في الطرفين.'],
    idea: [['Move the smaller letter term first, so x stays positive. 5x + 2 = 3x + 10 becomes 2x + 2 = 10.', 'انقل الحد الحرفي الأصغر أولًا ليبقى x موجبًا. ٥x + ٢ = ٣x + ١٠ تصبح ٢x + ٢ = ١٠.'], ['Then solve as usual: 2x = 8, so x = 4. Check both sides: 22 and 22.', 'ثم حلّ كالمعتاد: ٢x = ٨ فـ x = ٤. تحقق من الطرفين: ٢٢ و٢٢.']],
    g: function (r, lv) {
      var x = r.int(2, 9), b = r.int(2, 5), dm = r.int(1, 4), a = b + dm, c = r.int(1, 12), d = (a - b) * x + c;
      var q = lv === 3 ? ['Plan A costs ' + a + ' a month plus ' + c + ' to join. Plan B costs ' + b + ' a month plus ' + d + ' to join. After how many months do they cost the same?', 'الخطة A بـ ' + a + ' شهريًا و' + c + ' للاشتراك. والخطة B بـ ' + b + ' شهريًا و' + d + ' للاشتراك. بعد كم شهر تتساويان؟'] : ['Solve for x.', 'حُلّ لإيجاد x.'];
      return { q: q, eq: a + 'x + ' + c + ' = ' + b + 'x + ' + d, a: x, s: [['Take ' + b + 'x from both sides', 'اطرح ' + b + 'x من الطرفين', a + ' − ' + b + ' =', a - b], ['Take ' + c + ' from both sides', 'اطرح ' + c + ' من الطرفين', d + ' − ' + c + ' =', d - c], ['Divide', 'اقسم', (d - c) + ' ÷ ' + (a - b) + ' =', x]], miss: [[dp((d + c) / (a - b), 4), 'Take ' + c + ' away. Moving it across changes its sign.', 'اطرح ' + c + '. نقله يغيّر إشارته.'], [dp((d - c) / (a + b), 4), 'You added the x terms. Take ' + b + 'x from both sides.', 'جمعت حدود x. اطرح ' + b + 'x من الطرفين.']] };
    },
    trap: function (r) { var x = r.int(2, 6), c = r.int(1, 5), d = 2 * x + c; return { eq: '5x + ' + c + ' = 3x + ' + d, w: 0, why: ['5x − 3x = 2x, so take 3x from both sides.', '٥x − ٣x = ٢x فاطرح ٣x من الطرفين.'], l: [['8x + ' + c + ' = ' + d, '٨x + ' + c + ' = ' + d], d + ' − ' + c + ' = ' + (d - c), ['So x = ' + dp((d - c) / 8, 3), 'إذن x = ' + dp((d - c) / 8, 3)]] }; },
    explain: [['How can you be sure your answer is right?', 'كيف تتأكد من صحة حلك؟'], ['Put it back into both sides: they must match.', 'عوّضه في الطرفين: يجب أن يتساويا.'], ['It looks like a whole number.', 'يبدو عددًا صحيحًا.'], ['There is no way to check.', 'لا طريقة للتحقق.']]
  });

  teach('m7.nth', {
    why: ['A rule lets you jump to the hundredth term without writing the ninety-nine before it.', 'القاعدة تتيح القفز إلى الحد المئة دون كتابة ما قبله.'],
    idea: [['If the pattern goes up by 3, the rule starts with 3n. Then adjust: 5, 8, 11 is 3n + 2.', 'إذا زاد النمط ٣ فالقاعدة تبدأ بـ ٣n، ثم عدّل: ٥ و٨ و١١ هي ٣n + ٢.'], ['Check with n = 1: 3 × 1 + 2 = 5. It works.', 'تحقق عند n = ١: ٣ × ١ + ٢ = ٥. صحيح.']],
    g: function (r, lv) {
      var d = r.int(2, 9), c = r.int(1, 9), t = [1, 2, 3, 4].map(function (n) { return d * n + c; }), n = lv === 1 ? r.int(5, 12) : r.pick([20, 30, 50, 100]);
      if (lv === 3) return { q: ['Find the rule for this pattern. What number goes with n?', 'أوجد قاعدة النمط. ما العدد المضروب في n؟'], eq: t.join(', ') + ' ...', a: d, s: [['The step each time', 'الخطوة كل مرة', t[1] + ' − ' + t[0] + ' =', d], ['So the rule starts', 'فالقاعدة تبدأ', d + 'n + ' + c]], miss: [[c, 'That is the adjustment. The step goes with n.', 'هذا التعديل. الخطوة تُضرب في n.']] };
      return { q: ['The rule is ' + d + 'n + ' + c + '. Find term number ' + n + '.', 'القاعدة ' + d + 'n + ' + c + '. أوجد الحد رقم ' + n + '.'], eq: d + ' × ' + n + ' + ' + c, a: d * n + c, s: [['Multiply by n', 'اضرب في n', d + ' × ' + n + ' =', d * n], ['Add ' + c, 'أضف ' + c, (d * n) + ' + ' + c + ' =', d * n + c]], miss: [[(d + c) * n, 'Multiply first, then add ' + c + '.', 'اضرب أولًا ثم أضف ' + c + '.']] };
    },
    trap: function (r) { var d = r.int(2, 6), c = r.int(1, 5); return { eq: d + 'n + ' + c, w: 1, why: ['Check term 1: ' + d + ' × 1 + ' + c + ' = ' + (d + c) + '.', 'تحقق من الحد ١: ' + d + ' × ١ + ' + c + ' = ' + (d + c) + '.'], l: ['n = 2: ' + d + ' × 2 + ' + c + ' = ' + (2 * d + c), d + ' × 1 + ' + c + ' = ' + (d + c + 1), d + ' × 3 + ' + c + ' = ' + (3 * d + c)] }; },
    explain: [['Why is 2n + 1 better than saying "add 2 each time"?', 'لماذا ٢n + ١ أفضل من قول «أضف ٢ كل مرة»؟'], ['It jumps straight to any term, without the ones before it.', 'تقفز إلى أي حد مباشرة دون ما قبله.'], ['It looks more difficult.', 'تبدو أصعب.'], ['It only works for the first terms.', 'تصلح للحدود الأولى فقط.']]
  });

  teach('m7.prop', {
    why: ['Twice as many dates, twice the price. Direct proportion is everywhere in shopping and science.', 'ضعف التمر بضعف السعر. التناسب الطردي في كل مكان بالتسوق والعلوم.'],
    idea: [{ p: ['Find the value of one, then multiply. If 4 pens cost 12, one costs 3, so 7 cost 21.', 'أوجد قيمة الواحد ثم اضرب. إذا كانت ٤ أقلام بـ ١٢ فالقلم بـ ٣، و٧ أقلام بـ ٢١.'], dia: function () { return D.axes({ x: [0, 8], y: [0, 24], step: 4, line: [[0, 0], [8, 24]], pts: [[4, 12, '(4, 12)']] }); } }, ['The graph is a straight line through zero: no pens cost nothing.', 'الرسم خط مستقيم يمر بالصفر: لا أقلام، لا تكلفة.']],
    g: function (r, lv) {
      var u = r.int(2, 12), a = r.int(2, 9), b = r.int(2, 15); if (a === b) b++;
      if (lv === 3) { var u2 = r.pick([1.5, 2.5, .5, 1.2]), m = r.pick([10, 20, 40]), tt = dp(u2 * m); return { q: ['A car uses ' + (u2 * 10) + ' litres per 100 km. How much for ' + (m * 10) + ' km?', 'تستهلك سيارة ' + (u2 * 10) + ' لترات لكل ١٠٠ كم. كم تستهلك لـ ' + (m * 10) + ' كم؟'], eq: (u2 * 10) + ' × ' + (m * 10) + ' ÷ 100', a: dp(u2 * 10 * m * 10 / 100), s: [['For 1 km', 'لكيلومتر واحد', (u2 * 10) + ' ÷ 100 =', dp(u2 / 10)], ['For the whole distance', 'للمسافة كلها', dp(u2 / 10) + ' × ' + (m * 10) + ' =', dp(u2 * 10 * m * 10 / 100)]] }; }
      return { q: [a + ' cost ' + (a * u) + '. What do ' + b + ' cost?', a + ' قطع بـ ' + (a * u) + '. كم سعر ' + b + ' قطع؟'], eq: (a * u) + ' ÷ ' + a + ' × ' + b, a: b * u, s: [['The cost of one', 'سعر الواحدة', (a * u) + ' ÷ ' + a + ' =', u], ['The cost of ' + b, 'سعر ' + b, u + ' × ' + b + ' =', b * u]], miss: [[a * u + b - a, 'You added the extra items. Each one costs ' + u + '.', 'جمعت القطع الزائدة. كل قطعة بـ ' + u + '.']] };
    },
    trap: function (r) { var u = r.int(2, 6); return { w: 0, q: ['3 cost ' + (3 * u) + '. What do 5 cost? One line is wrong. Tap it.', '٣ قطع بـ ' + (3 * u) + '. كم سعر ٥؟ سطر واحد خاطئ. انقر عليه.'], why: ['Do not add 2 to the price. Find the price of one.', 'لا تضف ٢ إلى السعر. أوجد سعر الواحدة.'], l: [['Add 2: ' + (3 * u) + ' + 2 = ' + (3 * u + 2), 'أضف ٢: ' + (3 * u) + ' + 2 = ' + (3 * u + 2)], ['So 5 cost ' + (3 * u + 2), 'إذن ٥ قطع بـ ' + (3 * u + 2)], ['Two more items', 'قطعتان زيادة']] }; },
    explain: [['Is the time to cook 4 eggs double the time for 2?', 'هل زمن طهي ٤ بيضات ضعف زمن بيضتين؟'], ['No. They cook together. Not everything is in proportion.', 'لا. تُطهى معًا. فليس كل شيء متناسبًا.'], ['Yes. Everything doubles.', 'نعم. كل شيء يتضاعف.'], ['Yes, when eggs are large.', 'نعم، إذا كان البيض كبيرًا.']]
  });

  teach('m7.rev', {
    why: ['A shop says "now 80 after 20% off". Was the old price 96 or 100? Most people get this wrong.', 'يقول متجر: «الآن ٨٠ بعد خصم ٢٠٪». هل كان السعر ٩٦ أم ١٠٠؟ أكثر الناس يخطئون.'],
    idea: [['After 20% off you have 80% left. So 80 is 80% of the original. Divide by 0.8.', 'بعد خصم ٢٠٪ يبقى ٨٠٪. فـ ٨٠ هي ٨٠٪ من الأصل. اقسم على ٠٫٨.'], ['Do not add 20% back: 20% of the new price is not 20% of the old one.', 'لا تُعد ٢٠٪: ٢٠٪ من السعر الجديد ليست ٢٠٪ من القديم.']],
    g: function (r, lv) {
      var orig = r.int(4, 40) * 10, p = r.pick([10, 20, 25, 50]), up = lv === 3 && r.bool(), mult = dp((up ? 100 + p : 100 - p) / 100), now = dp(orig * mult, 2);
      return { q: up ? ['After a ' + p + '% rise a price is ' + now + '. What was it before?', 'بعد زيادة ' + p + '٪ صار السعر ' + now + '. كم كان؟'] : ['After ' + p + '% off a price is ' + now + '. What was the original?', 'بعد خصم ' + p + '٪ صار السعر ' + now + '. كم كان الأصل؟'], eq: now + ' ÷ ' + mult, a: orig, s: [['What percent is left?', 'كم بقي بالنسبة؟', (up ? '100 + ' : '100 − ') + p + ' =', up ? 100 + p : 100 - p], ['As a decimal', 'كسرًا عشريًا', (up ? 100 + p : 100 - p) + ' ÷ 100 =', mult], ['Undo it by dividing', 'اعكس بالقسمة', now + ' ÷ ' + mult + ' =', orig]], miss: [[dp(now + now * p / 100, 2), 'You added ' + p + '% of the new price. The ' + p + '% was of the original.', 'أضفت ' + p + '٪ من الجديد. النسبة كانت من الأصل.']] };
    },
    trap: function (r) { var orig = r.pick([100, 200, 400]), now = orig * .8; return { eq: now + ' ÷ 0.8', w: 0, why: ['The 20% was taken from the original, so divide by 0.8.', 'خُصمت ٢٠٪ من الأصل، فاقسم على ٠٫٨.'], l: [['Add 20% back: ' + now + ' × 1.2 = ' + dp(now * 1.2), 'أعد ٢٠٪: ' + now + ' × 1.2 = ' + dp(now * 1.2)], 'Answer: ' + dp(now * 1.2), ['A bit under the old price?', 'أقل قليلًا من السعر القديم؟']] }; },
    explain: [['A price goes up 10% then down 10%. Is it back where it started?', 'سعر زاد ١٠٪ ثم نقص ١٠٪. هل عاد كما كان؟'], ['No. The 10% off is taken from a bigger number, so it ends lower.', 'لا. خُصم ١٠٪ من عدد أكبر، فينتهي أقل.'], ['Yes, they cancel out.', 'نعم، يلغي بعضهما.'], ['It ends higher.', 'ينتهي أعلى.']]
  });

  teach('m7.zakah', { keep: true,
    g: function (r, lv) {
      var sv = r.int(2, lv === 1 ? 10 : 90) * 1000, ans = sv * 25 / 1000, dbt = r.int(1, 5) * 400;
      if (lv === 3) return { q: ['Savings of ' + sv + ' with ' + dbt + ' owed. Take the debt off first, then find 2.5%.', 'مدخرات ' + sv + ' وعليها دين ' + dbt + '. اطرح الدين أولًا ثم أوجد ٢٫٥٪.'], a: (sv - dbt) * 25 / 1000, s: [['Take the debt off', 'اطرح الدين', sv + ' − ' + dbt + ' =', sv - dbt], ['2.5% of what is left', '٢٫٥٪ من الباقي', (sv - dbt) + ' × 0.025 =', (sv - dbt) * 25 / 1000]], miss: [[ans, 'You found 2.5% of the whole amount, before taking the debt off.', 'أوجدت ٢٫٥٪ من الكل قبل طرح الدين.']] };
      return { q: ['Find 2.5% of ' + sv + '.', 'أوجد ٢٫٥٪ من ' + sv + '.'], eq: '2.5% × ' + sv, a: ans, s: [['2.5% as a decimal is 0.025', '٢٫٥٪ عشريًا ٠٫٠٢٥', sv + ' × 0.025 =', ans]], miss: [[sv * .25, 'That is 25%. Move the point one more place.', 'هذه ٢٥٪. حرّك الفاصلة منزلة أخرى.']] };
    },
    trap: function (r) { var sv = r.int(2, 9) * 1000; return { eq: '2.5% × ' + sv, w: 0, why: ['2.5% is 0.025 as a decimal, not 0.25.', '٢٫٥٪ عشريًا ٠٫٠٢٥ لا ٠٫٢٥.'], l: [['As decimal: ' + sv + ' × 0.25 = ' + (sv * .25), 'عشريًا: ' + sv + ' × 0.25 = ' + (sv * .25)], 'Answer: ' + (sv * .25), ['A quarter instead of a fortieth', 'ربع بدل جزء من أربعين']] }; },
    explain: [['2.5% is the same as what fraction?', '٢٫٥٪ تساوي أي كسر؟'], ['1/40: divide by 40.', '١/٤٠: اقسم على ٤٠.'], ['1/4: divide by 4.', '١/٤: اقسم على ٤.'], ['1/25: divide by 25.', '١/٢٥: اقسم على ٢٥.']]
  });

  /* ---------- shape and space ---------- */
  teach('m7.line', {
    why: ['Roof trusses, road junctions and every geometry proof start from these two facts.', 'جمالونات الأسقف وتقاطعات الطرق وكل برهان هندسي تبدأ من هاتين الحقيقتين.'],
    idea: [{ p: ['Angles on a straight line add to 180°. Angles around a point add to 360°.', 'الزوايا على خط مستقيم مجموعها ١٨٠°، وحول نقطة ٣٦٠°.'], dia: function () { return D.angle('point', ['130°', '110°', '120°']); } }, ['Where two lines cross, the opposite angles are equal.', 'حيث يتقاطع خطان، الزوايا المتقابلة متساوية.']],
    g: function (r, lv) {
      var x = r.int(20, 160);
      if (lv === 1) return { q: ['Find the missing angle on the straight line, in degrees.', 'أوجد الزاوية الناقصة على الخط المستقيم.'], dia: D.angle('line', Object.assign([x + '°', '?'], { deg: x })), a: 180 - x, s: [['A straight line is 180°', 'الخط المستقيم ١٨٠°', '180 − ' + x + ' =', 180 - x]], miss: [[360 - x, 'Straight line, so use 180°.', 'خط مستقيم، فاستخدم ١٨٠°.']] };
      var a = r.int(60, 130), b = r.int(60, 130);
      if (lv === 2) return { q: ['Find the missing angle around the point, in degrees.', 'أوجد الزاوية الناقصة حول النقطة.'], dia: D.angle('point', [a + '°', b + '°', '?']), a: 360 - a - b, s: [['Add the two', 'اجمع الزاويتين', a + ' + ' + b + ' =', a + b], ['Around a point is 360°', 'حول النقطة ٣٦٠°', '360 − ' + (a + b) + ' =', 360 - a - b]], miss: [[180 - a - b, 'Around a point it is 360°.', 'حول النقطة ٣٦٠°.']] };
      var y = r.int(10, 40);
      return { q: ['On a straight line, the angles are x and x + ' + y + ' degrees. Find x.', 'على خط مستقيم زاويتان x وx + ' + y + '. أوجد x.'], eq: 'x + x + ' + y + ' = 180', a: (180 - y) / 2, s: [['Collect the x terms: 2x', 'اجمع: ٢x', '180 − ' + y + ' =', 180 - y], ['Divide by 2', 'اقسم على ٢', (180 - y) + ' ÷ 2 =', (180 - y) / 2]], miss: [[180 - y, 'That is 2x. Divide by 2.', 'هذا ٢x. اقسم على ٢.']] };
    },
    trap: function (r) { var x = r.int(40, 80); return { w: 1, why: ['Opposite angles are equal, so it is also ' + x + '°.', 'المتقابلتان متساويتان، فهي أيضًا ' + x + '°.'], q: ['Two lines cross, making an angle of ' + x + '°. One line is wrong. Tap it.', 'تقاطع خطان بزاوية ' + x + '°. سطر واحد خاطئ. انقر عليه.'], l: [['Beside it: 180 − ' + x + ' = ' + (180 - x), 'بجانبها: ١٨٠ − ' + x + ' = ' + (180 - x)], ['Opposite it: ' + (180 - x) + '°', 'مقابلها: ' + (180 - x) + '°'], ['Total around the point: 360°', 'المجموع حول النقطة: ٣٦٠°']] }; },
    explain: [['Why are opposite angles equal?', 'لماذا المتقابلتان متساويتان؟'], ['Each makes 180° with the same neighbour, so they must match.', 'كل منهما تكمل الجارة نفسها إلى ١٨٠° فتتساويان.'], ['Because they look the same.', 'لأنهما تبدوان متشابهتين.'], ['Only when the lines are straight enough.', 'فقط إذا كان الخطان مستقيمين كفاية.']]
  });

  teach('m7.parallel', {
    why: ['Railway lines, shelves and the rows of a prayer hall: parallels create equal angles you can rely on.', 'قضبان السكك والرفوف وصفوف المصلى: الخطوط المتوازية تعطي زوايا متساوية يُعتمد عليها.'],
    idea: [{ p: ['When a line crosses two parallels: corresponding angles are equal (F shape), and alternate angles are equal (Z shape).', 'إذا قطع خطٌّ خطين متوازيين: الزوايا المتناظرة متساوية (شكل F)، والمتبادلة متساوية (شكل Z).'], dia: function () { return D.angle('par', ['a', 'b', 'c', 'd', 'e', 'f']); } }, ['Interior angles on the same side add to 180° (C shape).', 'الداخليتان في جهة واحدة مجموعهما ١٨٠° (شكل C).']],
    g: function (r, lv) {
      var x = r.int(40, 140), kind = lv === 1 ? r.pick([0, 1]) : r.pick([0, 1, 2]);
      if (lv === 3) { var t = r.int(30, 70), y = r.int(20, 60); return { q: ['A parallel line gives a triangle with angles ' + t + '° and ' + y + '°. What is the third?', 'يعطي خط موازٍ مثلثًا بزاويتين ' + t + '° و' + y + '°. كم الثالثة؟'], dia: D.tri({ angles: [t + '°', y + '°', '?'] }), a: 180 - t - y, s: [['A triangle totals 180°', 'مجموع المثلث ١٨٠°', t + ' + ' + y + ' =', t + y], [null, null, '180 − ' + (t + y) + ' =', 180 - t - y]] }; }
      var names = [['Corresponding', 'متناظرة', 'F', x], ['Alternate', 'متبادلة', 'Z', x], ['Interior, same side', 'داخلية في جهة واحدة', 'C', 180 - x]], k = names[kind];
      return { q: [k[0] + ' angles: one is ' + x + '°. Find the other, in degrees.', 'زوايا ' + k[1] + ': إحداها ' + x + '°. أوجد الأخرى.'], a: k[3], dia: D.angle('par', [null, null, null, x + '°', null, '?']), s: kind === 2 ? [['They add to 180°', 'مجموعهما ١٨٠°', '180 − ' + x + ' =', 180 - x]] : [['They are equal', 'هما متساويتان', 'Angle:', x]], miss: [[kind === 2 ? x : 180 - x, kind === 2 ? 'Interior angles add to 180°, they are not equal.' : 'These are equal, not adding to 180°.', kind === 2 ? 'الداخليتان مجموعهما ١٨٠° وليستا متساويتين.' : 'هاتان متساويتان، ومجموعهما ليس ١٨٠°.']] };
    },
    trap: function (r) { var x = r.int(50, 80); return { w: 1, q: ['Two parallels and a crossing line, with an angle of ' + x + '°. One line is wrong. Tap it.', 'خطان متوازيان وقاطع، بزاوية ' + x + '°. سطر واحد خاطئ. انقر عليه.'], why: ['Interior angles on the same side add to 180°.', 'الداخليتان في جهة واحدة مجموعهما ١٨٠°.'], l: [['Alternate angle: ' + x + '°', 'المتبادلة: ' + x + '°'], ['Interior angle: ' + x + '°', 'الداخلية: ' + x + '°'], ['Corresponding angle: ' + x + '°', 'المتناظرة: ' + x + '°']] }; },
    explain: [['What must be true of the two lines for these rules to work?', 'ما الشرط في الخطين لتصح هذه القواعد؟'], ['They must be parallel.', 'أن يكونا متوازيين.'], ['They must be the same length.', 'أن يتساويا طولًا.'], ['They must be horizontal.', 'أن يكونا أفقيين.']]
  });

  teach('m7.poly', {
    why: ['The tiles of a masjid floor fit only because of these angle rules.', 'بلاط أرضية المسجد لا يتراصف إلا بفضل قواعد الزوايا هذه.'],
    idea: [{ p: ['Cut any polygon into triangles from one corner. An n-sided shape makes n − 2 triangles.', 'قسّم أي مضلع إلى مثلثات من ركن واحد. فالمضلع ذو n ضلعًا يعطي n − ٢ مثلثًا.'], dia: function () { return D.poly(6); } }, ['So interior angles add to (n − 2) × 180°. A hexagon: 4 × 180° = 720°.', 'فمجموع الزوايا الداخلية (n − ٢) × ١٨٠°. والسداسي: ٤ × ١٨٠° = ٧٢٠°.']],
    g: function (r, lv) {
      var n = r.int(4, lv === 1 ? 6 : 10), sum = (n - 2) * 180;
      if (lv === 1) return { q: ['Find the sum of the interior angles of a shape with ' + n + ' sides, in degrees.', 'أوجد مجموع الزوايا الداخلية لشكل له ' + n + ' أضلاع.'], dia: D.poly(n), a: sum, s: [['How many triangles?', 'كم مثلثًا؟', n + ' − 2 =', n - 2], ['Each is 180°', 'كل مثلث ١٨٠°', (n - 2) + ' × 180 =', sum]], miss: [[n * 180, 'It makes ' + (n - 2) + ' triangles, not ' + n + '.', 'يعطي ' + (n - 2) + ' مثلثات لا ' + n + '.']] };
      var rn = r.pick([5, 6, 8, 9, 10, 12]), each = (rn - 2) * 180 / rn;
      if (lv === 2) return { q: ['Find one interior angle of a regular shape with ' + rn + ' sides.', 'أوجد زاوية داخلية لشكل منتظم له ' + rn + ' أضلاع.'], dia: D.poly(rn), a: each, s: [['The sum', 'المجموع', (rn - 2) + ' × 180 =', (rn - 2) * 180], ['Shared equally', 'تقسم بالتساوي', ((rn - 2) * 180) + ' ÷ ' + rn + ' =', each]], miss: [[360 / rn, 'That is the exterior angle. Inside is 180° minus it.', 'هذه الزاوية الخارجية. الداخلية ١٨٠° ناقص هذه.']] };
      var ext = r.pick([20, 24, 30, 36, 40, 45, 60, 72]);
      return { q: ['A regular shape has exterior angles of ' + ext + '°. How many sides does it have?', 'شكل منتظم زاويته الخارجية ' + ext + '°. كم عدد أضلاعه؟'], eq: '360 ÷ ' + ext, a: 360 / ext, s: [['Exterior angles total 360°', 'الزوايا الخارجية مجموعها ٣٦٠°', '360 ÷ ' + ext + ' =', 360 / ext]] };
    },
    trap: function (r) { return { w: 1, q: ['Finding the angles in a pentagon. One line is wrong. Tap it.', 'إيجاد زوايا الخماسي. سطر واحد خاطئ. انقر عليه.'], why: ['A pentagon makes 3 triangles, so 3 × 180 = 540°.', 'الخماسي يعطي ٣ مثلثات، فـ ٣ × ١٨٠ = ٥٤٠°.'], l: ['5 − 2 = 3', '5 × 180 = 540', '540 ÷ 5 = 108'] }; },
    explain: [['Why n − 2 triangles, not n?', 'لماذا n − ٢ مثلثًا لا n؟'], ['From one corner, its two neighbouring sides are already in the first and last triangles.', 'من ركن واحد، الضلعان المجاوران داخلان في المثلث الأول والأخير.'], ['It is a rule to memorise only.', 'قاعدة للحفظ فقط.'], ['It depends on the shape\'s colour.', 'تعتمد على لون الشكل.']]
  });

  teach('m7.quad', {
    why: ['Below zero and left of zero are real places on a screen or a map.', 'تحت الصفر ويسار الصفر مكانان حقيقيان على الشاشة أو الخريطة.'],
    idea: [{ p: ['Numbers run negative to the left and downwards. (−3, 2) is 3 left and 2 up.', 'الأعداد سالبة إلى اليسار وإلى الأسفل. (−٣، ٢) هي ٣ يسارًا و٢ أعلى.'], dia: function () { return D.axes({ x: [-5, 5], y: [-5, 5], pts: [[-3, 2, '(−3, 2)']] }); } }, ['Reflect in the x axis: the y sign changes. Reflect in the y axis: the x sign changes.', 'الانعكاس في محور x يغيّر إشارة y، وفي محور y يغيّر إشارة x.']],
    g: function (r, lv) {
      var nz = function () { return r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]); }, x = nz(), y = nz(); while (Math.abs(x) === Math.abs(y)) y = nz(); var w = function (a, b) { return '(' + mn(a) + ', ' + mn(b) + ')'; };
      if (lv < 3) { var R0 = w(x, y), S0 = w(y, x) === R0 ? w(-x, y) : w(y, x); return { q: ['Which coordinates give point P?', 'ما إحداثيات النقطة P؟'], dia: D.axes({ x: [-5, 5], y: [-5, 5], pts: [[x, y, 'P']] }), o: [[R0, TM.ltr(R0)], [S0, TM.ltr(S0), 'Across comes first, then up or down.', 'الأفقي أولًا ثم الرأسي.'], [w(-x, -y), TM.ltr(w(-x, -y)), 'Check the signs: left and down are negative.', 'راجع الإشارات: اليسار والأسفل سالبان.']], s: [['Across', 'أفقيًا', 'Across:', mn(x)], ['Then up or down', 'ثم رأسيًا', 'Up:', mn(y)]] }; }
      var axis = r.pick(['x', 'y']), Rf = axis === 'x' ? w(x, -y) : w(-x, y), Bad = axis === 'x' ? w(-x, y) : w(x, -y);
      return { q: ['Reflect ' + w(x, y) + ' in the ' + axis + ' axis.', 'اعكس ' + TM.ltr(w(x, y)) + ' في محور ' + axis + '.'], dia: D.axes({ x: [-5, 5], y: [-5, 5], pts: [[x, y, 'P']] }), o: [[Rf, TM.ltr(Rf)], [Bad, TM.ltr(Bad), 'That is the other mirror.', 'هذه المرآة الأخرى.'], [w(-x, -y), TM.ltr(w(-x, -y)), 'Only one sign changes.', 'تتغير إشارة واحدة فقط.']], s: [['The ' + axis + ' axis is the mirror', 'محور ' + axis + ' هو المرآة', ['Distance from the mirror stays the same', 'تبقى المسافة من المرآة نفسها']]] };
    },
    trap: function (r) { return { w: 1, q: ['Plotting (−2, 3). One line is wrong. Tap it.', 'رسم النقطة (−٢، ٣). سطر واحد خاطئ. انقر عليه.'], why: ['−2 means 2 to the left, not to the right.', '−٢ تعني ٢ إلى اليسار لا اليمين.'], l: [['Start at (0, 0)', 'ابدأ من (٠، ٠)'], ['Go 2 to the right', 'تحرك ٢ إلى اليمين'], ['Go 3 up', 'تحرك ٣ إلى الأعلى']] }; },
    explain: [['Which quarter of the grid holds points with both numbers negative?', 'أي ربع يحتوي النقاط بإحداثيين سالبين؟'], ['Bottom left.', 'أسفل اليسار.'], ['Top right.', 'أعلى اليمين.'], ['Bottom right.', 'أسفل اليمين.']]
  });

  teach('m7.move', {
    why: ['Islamic patterns are built from reflections, rotations and translations of one small shape.', 'الزخارف الإسلامية تُبنى من انعكاسات ودورانات وانتقالات لشكل صغير واحد.'],
    idea: [{ p: ['Translation slides. Reflection flips over a mirror line. Rotation turns about a point.', 'الانتقال انزلاق. والانعكاس قلب حول خط مرآة. والدوران لفّ حول نقطة.'], dia: function () { return D.axes({ x: [-5, 5], y: [-5, 5], polyline: [[1, 1], [3, 1], [3, 2], [1, 1]], pts: [[-1, 1], [-3, 1], [-3, 2]] }); } }, ['All three keep size and shape. Only position or direction changes.', 'الثلاثة تُبقي الحجم والشكل، ويتغير الموضع أو الاتجاه فقط.']],
    g: function (r, lv) {
      var x = r.int(1, 4), y = r.int(1, 4), dx = r.int(1, 2), dy = r.int(3, 4), W = function (a, b) { return '(' + mn(a) + ', ' + mn(b) + ')'; };
      if (lv === 1) { var N = r.pick([[['A shape slides without turning', 'شكل ينزلق دون دوران'], ['Translation', 'انتقال']], [['A shape flips over a line', 'شكل يُقلب حول خط'], ['Reflection', 'انعكاس']], [['A shape turns about a point', 'شكل يدور حول نقطة'], ['Rotation', 'دوران']]]), all = [['Translation', 'انتقال'], ['Reflection', 'انعكاس'], ['Rotation', 'دوران']]; return { q: [N[0][0] + '. What is this called?', N[0][1] + '. ما اسم هذا؟'], o: [N[1]].concat(all.filter(function (q) { return q[0] !== N[1][0]; })), s: [['Think of what stays the same', 'فكّر فيما يبقى ثابتًا', ['Size and shape never change', 'الحجم والشكل لا يتغيران']]] }; }
      if (lv === 2) { var Rx = W(x + dx, y + dy); return { q: ['Translate ' + W(x, y) + ' by ' + dx + ' right and ' + dy + ' up.', 'انقل ' + TM.ltr(W(x, y)) + ' بمقدار ' + dx + ' يمينًا و' + dy + ' أعلى.'], o: [[Rx, TM.ltr(Rx)], [W(x - dx, y + dy), TM.ltr(W(x - dx, y + dy)), 'Right adds to the first number.', 'اليمين يزيد العدد الأول.'], [W(x + dy, y + dx), TM.ltr(W(x + dy, y + dx)), 'The numbers got swapped.', 'تبادل العددان.']], s: [['Add to the first', 'أضف إلى الأول', x + ' + ' + dx + ' =', x + dx], ['Add to the second', 'أضف إلى الثاني', y + ' + ' + dy + ' =', y + dy]] }; }
      var Rr = W(-y, x), other = W(y, -x);
      return { q: ['Rotate ' + W(x, y) + ' by 90° anticlockwise about the origin.', 'أدر ' + TM.ltr(W(x, y)) + ' ٩٠° عكس عقارب الساعة حول نقطة الأصل.'], dia: D.axes({ x: [-5, 5], y: [-5, 5], pts: [[x, y, 'P']] }), o: [[Rr, TM.ltr(Rr)], [other, TM.ltr(other), 'That is 90° clockwise.', 'هذا ٩٠° مع عقارب الساعة.'], [W(-x, -y), TM.ltr(W(-x, -y)), 'That is 180°.', 'هذا ١٨٠°.']], s: [['A 90° turn swaps the numbers and changes one sign', 'دوران ٩٠° يبدّل العددين ويغيّر إشارة', Rr]] };
    },
    trap: function (r) { return { w: 1, q: ['Facts about moving shapes. One line is wrong. Tap it.', 'حقائق عن تحريك الأشكال. سطر واحد خاطئ. انقر عليه.'], why: ['A reflection keeps the size exactly.', 'الانعكاس يحفظ الحجم تمامًا.'], l: [['A translation keeps the direction', 'الانتقال يحفظ الاتجاه'], ['A reflection makes it bigger', 'الانعكاس يكبّره'], ['A rotation turns about a point', 'الدوران حول نقطة']] }; },
    explain: [['What changes in a reflection but not in a translation?', 'ما الذي يتغير في الانعكاس لا في الانتقال؟'], ['Which way the shape faces: it becomes a mirror image.', 'اتجاه الشكل: يصبح صورة مرآة.'], ['Its size.', 'حجمه.'], ['Its number of sides.', 'عدد أضلاعه.']]
  });

  teach('m7.circ', {
    why: ['The area of a dome\'s base or a round table needs this one formula.', 'مساحة قاعدة القبة أو الطاولة المستديرة تحتاج إلى هذه الصيغة الواحدة.'],
    idea: [{ p: ['Area of a circle = π × r × r. Square the radius, then multiply by π.', 'مساحة الدائرة = π × r × r. ربّع نصف القطر ثم اضرب في π.'], dia: function () { return D.circle({ r: 'r' }); } }, ['Cut a circle into thin slices and rearrange them: nearly a rectangle π r long and r high.', 'قطّع الدائرة شرائح رفيعة وأعد ترتيبها: مستطيل تقريبًا طوله π r وارتفاعه r.']],
    g: function (r, lv) {
      var rd = r.int(1, lv === 1 ? 5 : 12), pi = 3.14, A0 = dp(pi * rd * rd, 2);
      if (lv === 3) { var d = 2 * r.int(2, 9), rr = d / 2, A1 = dp(pi * rr * rr, 2); return { q: ['A round table is ' + d + ' dm across. Find its area, in dm². Use π = 3.14.', 'طاولة مستديرة قطرها ' + d + ' دسم. أوجد مساحتها. استخدم π = ٣٫١٤.'], dia: D.circle({ d: d }), a: A1, s: [['Radius first', 'نصف القطر أولًا', d + ' ÷ 2 =', rr], ['Square it', 'ربّعه', rr + ' × ' + rr + ' =', rr * rr], ['× π', '× π', (rr * rr) + ' × 3.14 =', A1]], miss: [[dp(pi * d * d, 2), 'Halve the diameter first: use the radius.', 'نصّف القطر أولًا: استخدم نصف القطر.']] }; }
      return { q: ['Find the area, in cm². Use π = 3.14.', 'أوجد المساحة. استخدم π = ٣٫١٤.'], dia: D.circle({ r: rd }), eq: '3.14 × ' + rd + ' × ' + rd, a: A0, s: [['Square the radius', 'ربّع نصف القطر', rd + ' × ' + rd + ' =', rd * rd], ['× π', '× π', (rd * rd) + ' × 3.14 =', A0]], miss: [[dp(2 * pi * rd, 2), 'That is the circumference. Area uses r × r.', 'هذا المحيط. المساحة r × r.']] };
    },
    trap: function (r) { var rd = r.int(3, 6); return { eq: 'r = ' + rd, w: 0, why: [rd + ' squared is ' + (rd * rd) + ', not ' + (2 * rd) + '.', 'مربع ' + rd + ' هو ' + (rd * rd) + ' لا ' + (2 * rd) + '.'], l: [rd + ' × ' + rd + ' = ' + (2 * rd), (2 * rd) + ' × 3.14 = ' + dp(2 * rd * 3.14, 2), 'Area: ' + dp(2 * rd * 3.14, 2)] }; },
    explain: [['If the radius doubles, what happens to the area?', 'إذا تضاعف نصف القطر، ماذا يحدث للمساحة؟'], ['It becomes four times as big, because r is squared.', 'تصبح أربعة أضعاف، لأن r مربع.'], ['It doubles.', 'تتضاعف.'], ['It stays the same.', 'تبقى نفسها.']]
  });

  teach('m7.prism', {
    why: ['Water tanks, tents and bars of chocolate are prisms.', 'خزانات الماء والخيام وقوالب الشوكولاتة كلها مناشير.'],
    idea: [{ p: ['A prism has the same cross section all the way along. Volume = area of the end × length.', 'للمنشور مقطع ثابت على طوله. الحجم = مساحة المقطع × الطول.'], dia: function () { return D.cuboid('8', '3', '4'); } }, ['For a triangular prism, first find the triangle: base × height ÷ 2.', 'في المنشور الثلاثي أوجد المثلث أولًا: القاعدة × الارتفاع ÷ ٢.']],
    g: function (r, lv) {
      var a = r.int(2, 12), l = r.int(3, 15), b = 2 * r.int(1, 6), h = r.int(2, 9);
      if (lv === 1) return { q: ['The end of a prism has area ' + a + ' cm², and it is ' + l + ' cm long. Find the volume, in cm³.', 'مساحة طرف منشور ' + a + ' سم² وطوله ' + l + ' سم. أوجد الحجم.'], eq: a + ' × ' + l, a: a * l, s: [['End area × length', 'مساحة الطرف × الطول', a + ' × ' + l + ' =', a * l]], miss: [[a + l, 'You added. Each slice has the end\'s area, and there are ' + l + ' of them.', 'جمعت. كل شريحة بمساحة الطرف وعددها ' + l + '.']] };
      var end = b * h / 2;
      if (lv === 2) return { q: ['A triangular prism: the triangle has base ' + b + ' and height ' + h + ' cm, and the prism is ' + l + ' cm long. Find the volume, in cm³.', 'منشور ثلاثي: قاعدة المثلث ' + b + ' وارتفاعه ' + h + ' سم، وطوله ' + l + ' سم. أوجد الحجم.'], dia: D.tri({ right: 0, sides: [b, null, h] }), a: end * l, s: [['The triangle', 'المثلث', b + ' × ' + h + ' ÷ 2 =', end], ['× length', '× الطول', end + ' × ' + l + ' =', end * l]], miss: [[b * h * l, 'Halve for the triangle first.', 'نصّف أولًا للمثلث.']] };
      var v = a * l; return { q: ['A prism has volume ' + v + ' cm³ and end area ' + a + ' cm². How long is it, in cm?', 'حجم منشور ' + v + ' سم³ ومساحة طرفه ' + a + ' سم². كم طوله؟'], eq: a + ' × ? = ' + v, a: l, s: [['Undo the multiplying', 'اعكس الضرب', v + ' ÷ ' + a + ' =', l]] };
    },
    trap: function (r) { var b = r.int(2, 5) * 2, h = r.int(3, 7), l = r.int(3, 8); return { eq: b + ' × ' + h + ' ÷ 2 × ' + l, w: 0, why: ['Halve the rectangle: ' + (b * h) + ' ÷ 2 = ' + (b * h / 2) + '.', 'نصّف المستطيل: ' + (b * h) + ' ÷ ٢ = ' + (b * h / 2) + '.'], l: [b + ' × ' + h + ' ÷ 2 = ' + (b * h), (b * h) + ' × ' + l + ' = ' + (b * h * l), 'Volume: ' + (b * h * l)] }; },
    explain: [['Why does area × length give volume?', 'لماذا المساحة × الطول تعطي الحجم؟'], ['Stack identical slices along the length: each adds the end area.', 'كدّس شرائح متطابقة على الطول: كل منها تضيف مساحة الطرف.'], ['Because volume is always bigger.', 'لأن الحجم دائمًا أكبر.'], ['It is true only for cubes.', 'يصح في المكعبات فقط.']]
  });

  teach('m7.calendar', { keep: true,
    g: function (r, lv) {
      var y = r.int(2, lv === 1 ? 5 : 33), gap = 11;
      if (lv === 1) return { q: ['A lunar year is about 354 days and a solar year about 365. How many days is the difference over ' + y + ' years?', 'السنة القمرية نحو ٣٥٤ يومًا والشمسية نحو ٣٦٥. كم الفرق في ' + y + ' سنوات؟'], eq: '(365 − 354) × ' + y, a: gap * y, s: [['The gap in a year', 'الفرق في السنة', '365 − 354 =', gap], ['Over ' + y + ' years', 'في ' + y + ' سنوات', gap + ' × ' + y + ' =', gap * y]] };
      if (lv === 2) { var d = r.pick([29, 30]), m = r.int(2, 12); return { q: ['If each of ' + m + ' months has ' + d + ' days, how many days in all?', 'إذا كان كل شهر من ' + m + ' شهرًا فيه ' + d + ' يومًا، كم يومًا إجمالًا؟'], eq: m + ' × ' + d, a: m * d, s: [['Multiply', 'اضرب', m + ' × ' + d + ' =', m * d]] }; }
      return { q: ['Ramaḍān moves about 11 days earlier each solar year. How many days earlier after ' + y + ' years?', 'يتقدم رمضان نحو ١١ يومًا كل سنة شمسية. كم يتقدم بعد ' + y + ' سنة؟'], eq: '11 × ' + y, a: 11 * y, s: [['Multiply', 'اضرب', '11 × ' + y + ' =', 11 * y]] };
    },
    trap: function (r) { return { w: 0, why: ['365 − 354 = 11, not 12.', '٣٦٥ − ٣٥٤ = ١١ لا ١٢.'], l: ['365 − 354 = 12', '12 × 3 = 36', ['So 36 days in three years', 'فـ ٣٦ يومًا في ٣ سنوات']] }; },
    explain: [['Why do the Islamic months move through the seasons?', 'لماذا تتنقل الأشهر الإسلامية عبر الفصول؟'], ['The lunar year is shorter than the solar year that makes the seasons.', 'السنة القمرية أقصر من الشمسية التي تصنع الفصول.'], ['The moon changes direction.', 'يغيّر القمر اتجاهه.'], ['They do not move.', 'لا تتنقل.']]
  });

  /* ---------- competition maths ---------- */
  teach('g7.mod', {
    why: ['What day is it in 100 days? Computer security and calendars run on this.', 'ما اليوم بعد ١٠٠ يوم؟ أمن الحواسيب والتقاويم يقومان على هذا.'],
    idea: [{ p: ['Clock arithmetic keeps only the remainder. On a clock of 7, 10 lands at 3, because 10 ÷ 7 leaves 3.', 'حساب الساعة يبقي الباقي فقط. في ساعة من ٧، يقع ١٠ عند ٣ لأن باقي ١٠ ÷ ٧ هو ٣.'], dia: function () { return D.clock(7, 3); } }, ['Days of the week are a clock of 7.', 'أيام الأسبوع ساعة من ٧.']],
    g: function (r, lv) {
      var m = r.pick(lv === 1 ? [5, 7, 10] : [7, 9, 11, 12, 13]), n = r.int(m + 1, lv === 1 ? 60 : 400), q0 = Math.floor(n / m), rem = n % m;
      if (lv === 3) { var days = r.int(20, 500), today = r.pick([[0, 'Sunday', 'الأحد'], [1, 'Monday', 'الاثنين'], [3, 'Wednesday', 'الأربعاء'], [5, 'Friday', 'الجمعة']]), rm = days % 7; return { q: ['Today is ' + today[1] + '. How many days past ' + today[1] + ' does the weekday fall after ' + days + ' days? Give a number from 0 to 6.', 'اليوم ' + today[2] + '. بكم يومًا بعد ' + today[2] + ' يقع اليوم بعد ' + days + ' يومًا؟ أعط عددًا من ٠ إلى ٦.'], eq: days + ' ÷ 7', a: rm, s: [['Whole weeks go away', 'تُلغى الأسابيع الكاملة', '7 × ' + Math.floor(days / 7) + ' =', 7 * Math.floor(days / 7)], ['What is left', 'الباقي', days + ' − ' + (7 * Math.floor(days / 7)) + ' =', rm]] }; }
      return { q: ['Find the remainder.', 'أوجد الباقي.'], eq: n + ' ÷ ' + m, a: rem, dia: lv === 1 ? D.clock(m, rem) : undefined, s: [['Largest multiple that fits', 'أكبر مضاعف يدخل', m + ' × ' + q0 + ' =', m * q0], ['What is left', 'الباقي', n + ' − ' + (m * q0) + ' =', rem]], miss: [[q0, 'That is how many times it fits. The remainder is what is left.', 'هذا عدد المرات. الباقي هو ما يتبقى.']] };
    },
    trap: function (r) { var m = 7, q0 = r.int(3, 9), rem = r.int(1, 6), n = m * q0 + rem; return { eq: n + ' ÷ 7', w: 1, why: ['The remainder is ' + rem + '. It must be less than 7.', 'الباقي ' + rem + '، ويجب أن يكون أقل من ٧.'], l: ['7 × ' + q0 + ' = ' + (7 * q0), n + ' − ' + (7 * q0) + ' = ' + (rem + 7), ['Remainder ' + (rem + 7), 'الباقي ' + (rem + 7)]] }; },
    explain: [['Why can\'t the remainder dividing by 7 be 8?', 'لماذا لا يكون باقي القسمة على ٧ هو ٨؟'], ['Another 7 would still fit inside it.', 'تدخل ٧ أخرى فيه.'], ['8 is an even number.', '٨ عدد زوجي.'], ['It can be.', 'بل يمكن.']]
  });

  teach('g7.last', {
    why: ['What is the last digit of 3¹⁰⁰? You can know it without working it out. That is number sense.', 'ما آخر رقم في ٣¹⁰⁰؟ يمكنك معرفته دون حسابه. هذا هو حس الأعداد.'],
    idea: [['Only the last digits matter when multiplying. Powers of 3 end in 3, 9, 7, 1, then repeat.', 'عند الضرب لا يهم إلا آخر الأرقام. قوى ٣ تنتهي بـ ٣ و٩ و٧ و١ ثم تتكرر.'], ['Find the cycle, then use the remainder to see where you land.', 'أوجد الدورة ثم استخدم الباقي لتعرف أين تقع.']],
    g: function (r, lv) {
      if (lv === 1) { var a = r.int(11, 99), b = r.int(11, 99), la = a % 10, lb = b % 10, ld = (la * lb) % 10; return { q: ['Find only the last digit of the answer.', 'أوجد آخر رقم في الناتج فقط.'], eq: a + ' × ' + b, a: ld, s: [['Multiply the last digits', 'اضرب آخر الرقمين', la + ' × ' + lb + ' =', la * lb], ['Its last digit', 'آخر رقم فيه', 'Digit:', ld]] }; }
      var cy = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 7: [7, 9, 3, 1] }, base = r.pick([2, 3, 7]), c = cy[base], e = lv === 2 ? r.int(5, 20) : r.int(21, 200), rm = e % 4, ans = c[(rm + 3) % 4];
      return { q: ['Find the last digit of this power.', 'أوجد آخر رقم في هذه القوة.'], eq: base + '^' + e, a: ans, s: [['The cycle of last digits', 'دورة آخر الأرقام', c.join(', ')], ['Cycle length is 4: find the remainder', 'طول الدورة ٤: أوجد الباقي', e + ' − 4 × ' + Math.floor(e / 4) + ' =', rm], [rm === 0 ? 'Remainder 0 lands on the last of the cycle' : 'Count ' + rm + ' along the cycle', rm === 0 ? 'الباقي ٠ يقع على آخر الدورة' : 'عُدّ ' + rm + ' في الدورة', 'Digit:', ans]] };
    },
    trap: function (r) { return { eq: '3^10', w: 2, why: ['10 ÷ 4 leaves 2, so count 2 along: the digit is 9.', 'باقي ١٠ ÷ ٤ هو ٢، فعُدّ اثنين: الرقم ٩.'], l: ['3, 9, 7, 1', '10 − 4 × 2 = 2', 'Digit: 7', ['The cycle has length 4', 'طول الدورة ٤']] }; },
    explain: [['Why do last digits cycle?', 'لماذا تتكرر آخر الأرقام؟'], ['Only ten last digits exist, so a repeat must come, and from then on it loops.', 'الأرقام الأخيرة عشرة فقط، فلا بد من التكرار، ثم تدور.'], ['Because 4 is lucky.', 'لأن ٤ محظوظ.'], ['They never cycle.', 'لا تتكرر أبدًا.']]
  });

  teach('g7.count', {
    why: ['How many passwords? How many outfits? Counting without listing is a superpower.', 'كم كلمة مرور؟ وكم طقمًا؟ العدّ دون سرد قوة خارقة.'],
    idea: [['Choices multiply. 3 shirts and 4 trousers make 3 × 4 = 12 outfits.', 'الخيارات تتضاعف. ٣ قمصان و٤ سراويل تعطي ٣ × ٤ = ١٢ طقمًا.'], ['Arranging 4 people in a line: 4 × 3 × 2 × 1 = 24 ways, as each pick leaves one fewer.', 'ترتيب ٤ أشخاص في صف: ٤ × ٣ × ٢ × ١ = ٢٤ طريقة لأن كل اختيار يترك واحدًا أقل.']],
    g: function (r, lv) {
      var a = r.int(2, 6), b = r.int(2, 7), c = r.int(2, 5);
      if (lv === 1) return { q: ['A menu has ' + a + ' mains and ' + b + ' drinks. How many different meals?', 'في القائمة ' + a + ' أطباق و' + b + ' مشروبات. كم وجبة مختلفة؟'], eq: a + ' × ' + b, a: a * b, s: [['Choices multiply', 'الخيارات تتضاعف', a + ' × ' + b + ' =', a * b]], miss: [[a + b, 'You added. Each main goes with every drink.', 'جمعت. كل طبق مع كل مشروب.']] };
      if (lv === 2) { var n = r.int(3, 6), f = 1, sh = []; for (var i = n; i >= 1; i--) { f *= i; sh.push(i); } return { q: [n + ' books are arranged on a shelf. How many different orders?', 'تُرتب ' + n + ' كتب على رف. كم ترتيبًا مختلفًا؟'], eq: sh.join(' × '), a: f, s: [['Each place has one fewer choice', 'كل مكان بخيار أقل', sh.join(' × ') + ' =', f]], miss: [[n * n, 'Once a book is used, there is one fewer left.', 'بعد استخدام كتاب يبقى خيار أقل.']] }; }
      var d = r.pick([2, 3, 4]), pw = Math.pow(10, d);
      return { q: ['A code has ' + d + ' digits, each 0 to 9, and digits may repeat. How many codes are there?', 'رمز من ' + d + ' أرقام، كل رقم من ٠ إلى ٩، والتكرار مسموح. كم رمزًا؟'], eq: '10^' + d, a: pw, s: [['10 choices each time', '١٠ خيارات كل مرة', Array(d).fill(10).join(' × ') + ' =', pw]], miss: [[10 * d, 'Choices multiply, not add.', 'الخيارات تتضاعف ولا تُجمع.']] };
    },
    trap: function (r) { var a = r.int(2, 5), b = r.int(3, 6); return { w: 0, q: [a + ' shirts and ' + b + ' scarves. One line is wrong. Tap it.', a + ' قمصان و' + b + ' أوشحة. سطر واحد خاطئ. انقر عليه.'], why: ['Each shirt goes with each scarf, so multiply: ' + (a * b) + '.', 'كل قميص مع كل وشاح فاضرب: ' + (a * b) + '.'], l: [['Add choices: ' + a + ' + ' + b + ' = ' + (a + b), 'اجمع الخيارات: ' + a + ' + ' + b + ' = ' + (a + b)], ['So there are ' + (a + b) + ' outfits', 'فهناك ' + (a + b) + ' طقمًا'], ['Each outfit is one of each', 'كل طقم من كلٍّ قطعة']] }; },
    explain: [['Why multiply instead of adding?', 'لماذا نضرب بدل أن نجمع؟'], ['Every first choice pairs with every second choice.', 'كل خيار أول يقترن بكل خيار ثانٍ.'], ['Multiplying is quicker.', 'الضرب أسرع.'], ['The answer must be big.', 'يجب أن يكون الناتج كبيرًا.']]
  });

  teach('g7.parity', {
    why: ['One question, odd or even, can prove that something is impossible without checking every case.', 'سؤال واحد، فردي أم زوجي، قد يثبت استحالة أمر دون فحص كل الحالات.'],
    idea: [['Even + even and odd + odd give even. Odd + even gives odd. Odd × odd is the only odd product.', 'زوجي + زوجي وفردي + فردي زوجي. وفردي + زوجي فردي. وفردي × فردي هو الضرب الفردي الوحيد.'], ['Can 5 odd numbers add to 20? No: an odd count of odd numbers is odd.', 'هل تعطي ٥ أعداد فردية المجموع ٢٠؟ لا: عدد فردي من الأعداد الفردية مجموعه فردي.']],
    g: function (r, lv) {
      var odd = function () { return 2 * r.int(5, 40) + 1; }, even = function () { return 2 * r.int(5, 40); }, O = [['Odd', 'فردي'], ['Even', 'زوجي'], ['Cannot tell', 'لا يمكن الجزم']];
      if (lv === 1) { var p = r.pick([[odd(), odd(), '+', 1], [odd(), even(), '+', 0], [even(), even(), '+', 1], [odd(), odd(), '×', 0], [even(), odd(), '×', 1]]); return { q: ['Without working it out: is the answer odd or even?', 'دون حساب: هل الناتج فردي أم زوجي؟'], eq: p[0] + ' ' + p[2] + ' ' + p[1], o: [O[p[3]], O[1 - p[3]], O[2]], s: [['Look only at odd or even', 'انظر إلى الفردية والزوجية فقط', p[0] + ' ' + p[2] + ' ' + p[1] + ' =', p[2] === '+' ? p[0] + p[1] : p[0] * p[1]]] }; }
      if (lv === 2) { var n = r.int(3, 9), res = n % 2; return { q: ['Add ' + n + ' odd numbers. Is the total odd or even?', 'اجمع ' + n + ' أعداد فردية. هل المجموع فردي أم زوجي؟'], o: [O[res ? 0 : 1], O[res ? 1 : 0], O[2]], s: [['Pair them up: each pair is even', 'اقرنها: كل زوج مجموعه زوجي', ['Is one left over?', 'هل يبقى واحد؟']]] }; }
      var k = r.int(3, 7) * 2, x = r.pick([3, 5, 7]);
      return { q: ['A chess piece changes square colour with every move. Can it return to its starting square in ' + x + ' moves?', 'قطعة شطرنج تغيّر لون المربع مع كل حركة. هل تعود إلى مربعها في ' + x + ' حركات؟'], o: [['No, an odd number of moves ends on the other colour.', 'لا، عدد فردي من الحركات ينتهي باللون الآخر.'], ['Yes, any number of moves can.', 'نعم، بأي عدد من الحركات.'], ['Only on a big board.', 'على لوح كبير فقط.']], s: [['Each move swaps the colour', 'كل حركة تبدّل اللون', ['After ' + x + ' moves: the other colour', 'بعد ' + x + ' حركات: اللون الآخر']]] };
    },
    trap: function (r) { return { w: 1, q: ['Facts about odd and even. One line is wrong. Tap it.', 'حقائق عن الفردي والزوجي. سطر واحد خاطئ. انقر عليه.'], why: ['Odd × even is always even: 3 × 2 = 6.', 'الفردي × الزوجي زوجي دائمًا: ٣ × ٢ = ٦.'], l: [['Odd + odd is even', 'فردي + فردي زوجي'], ['Odd × even is odd', 'فردي × زوجي فردي'], ['Odd + even is odd', 'فردي + زوجي فردي']] }; },
    explain: [['Why is this kind of argument powerful?', 'لماذا هذا النوع من البرهان قوي؟'], ['It rules out every case at once, with no need to try them.', 'يستبعد كل الحالات معًا دون تجربتها.'], ['It avoids using numbers altogether.', 'يتجنب الأعداد كلها.'], ['It always gives the answer yes.', 'يعطي «نعم» دائمًا.']]
  });

  teach('g7.pigeon', {
    why: ['With a simple idea you can prove that two people in a city have exactly the same number of hairs.', 'بفكرة بسيطة تثبت أن شخصين في مدينة لهما عدد الشعر نفسه تمامًا.'],
    idea: [['If more pigeons than holes, some hole has at least two pigeons.', 'إذا زادت الحمائم على الأعشاش ففي عش واحد حمامتان على الأقل.'], ['In 13 people, two share a birth month. 12 months are the holes, 13 people the pigeons.', 'في ١٣ شخصًا يشترك اثنان في شهر الميلاد. الأشهر ١٢ عشًا، والأشخاص ١٣ حمامة.']],
    g: function (r, lv) {
      var holes = r.pick([3, 4, 5, 7, 12]), hn = { 3: ['colours', 'ألوان'], 4: ['seasons', 'فصول'], 5: ['colours', 'ألوان'], 7: ['days of the week', 'أيام الأسبوع'], 12: ['months', 'أشهر'] }[holes];
      if (lv === 1) return { q: ['There are ' + holes + ' ' + hn[0] + '. How many people must you pick to be sure two share one?', 'هناك ' + holes + ' ' + hn[1] + '. كم شخصًا تختار لتضمن اشتراك اثنين في واحد؟'], eq: holes + ' + 1', a: holes + 1, s: [['One of each could happen, then one more', 'قد يأخذ كلٌّ واحدًا، ثم واحد زيادة', holes + ' + 1 =', holes + 1]], miss: [[holes, 'With exactly ' + holes + ' people, everyone could still be different.', 'مع ' + holes + ' أشخاص يمكن أن يختلف الجميع.'], [2 * holes, 'Fewer are needed: only one extra forces a repeat.', 'يكفي أقل: واحد زيادة يفرض التكرار.']] };
      var k = r.int(2, 4);
      if (lv === 2) return { q: ['A drawer holds socks in ' + holes + ' colours. How many must you pull out, in the dark, to be sure of ' + (k + 1) + ' of one colour?', 'في درج جوارب بـ ' + holes + ' ألوان. كم تسحب في الظلام لتضمن ' + (k + 1) + ' من لون واحد؟'], eq: holes + ' × ' + k + ' + 1', a: holes * k + 1, s: [['Worst case: ' + k + ' of each', 'أسوأ حالة: ' + k + ' من كل لون', holes + ' × ' + k + ' =', holes * k], ['One more forces it', 'واحد زيادة يفرضها', (holes * k) + ' + 1 =', holes * k + 1]], miss: [[holes * k, 'That could be exactly ' + k + ' of each. One more forces it.', 'قد يكون ' + k + ' من كلٍّ تمامًا. واحد زيادة يفرضها.']] };
      var ppl = holes * r.int(3, 9) + r.int(1, holes - 1), least = Math.ceil(ppl / holes);
      return { q: [ppl + ' people are shared among ' + holes + ' rooms. At least how many must be in the fullest room?', 'يتوزع ' + ppl + ' شخصًا على ' + holes + ' غرف. كم على الأقل في أكثرها امتلاءً؟'], eq: ppl + ' ÷ ' + holes, a: least, s: [['Share as evenly as possible', 'وزّع بأقصى عدل', holes + ' × ' + (least - 1) + ' =', holes * (least - 1)], ['Someone must get the extra', 'لا بد أن يأخذ أحدهم الزيادة', (least - 1) + ' + 1 =', least]], miss: [[least - 1, 'That leaves people over. One room must take more.', 'يبقى أشخاص. لا بد أن تأخذ غرفة أكثر.']] };
    },
    trap: function (r) { return { w: 1, q: ['Socks in 2 colours: how many to be sure of a pair? One line is wrong. Tap it.', 'جوارب بلونين: كم تسحب لتضمن زوجًا؟ سطر واحد خاطئ. انقر عليه.'], why: ['Worst case one of each, so the third makes a pair: 3.', 'أسوأ حالة واحد من كل لون، فالثالث يكوّن زوجًا: ٣.'], l: [['Worst case: one of each', 'أسوأ حالة: واحد من كل لون'], ['That is 2, so 2 is enough', 'هذان اثنان فيكفيان'], ['The next sock matches one', 'الجورب التالي يطابق أحدهما']] }; },
    explain: [['What does the pigeonhole principle not tell you?', 'ماذا لا يخبرك به مبدأ الحمام؟'], ['Which hole has the two pigeons, only that one must.', 'أي عش فيه الحمامتان، بل إن عشًا لا بد منه.'], ['Whether a hole has two pigeons.', 'هل في عش حمامتان.'], ['How many holes there are.', 'كم عدد الأعشاش.']]
  });
})();
