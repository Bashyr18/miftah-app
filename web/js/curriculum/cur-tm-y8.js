/* Maths taught in full, Year 8. See lesson/teach.js for the shape of a topic. */
(function () {
  'use strict';
  var C = window.C, D = window.Dia, teach = C.teach, TM = C.TM, gcd = TM.gcd, low = TM.low, dp = TM.dp, mn = TM.m;
  var sup = function (n) { return String(n).split('').map(function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]; }).join(''); };

  /* ---------- number, thoroughly ---------- */
  teach('m8.neg', {
    why: ['Every later subject, from physics to finance, needs signs to be automatic.', 'كل مادة لاحقة، من الفيزياء إلى المال، تحتاج إلى أن تصبح الإشارات تلقائية.'],
    idea: [{ p: ['Adding a negative moves left. Taking away a negative moves right: 5 − (−3) = 8.', 'جمع السالب حركة إلى اليسار، وطرح السالب حركة إلى اليمين: ٥ − (−٣) = ٨.'], dia: function () { return D.line({ min: -6, max: 8, marks: { 5: '5', 8: '8' }, hops: [[5, 8]] }); } }, ['For × and ÷: same signs positive, different signs negative.', 'في × و÷: المتشابهتان موجب، والمختلفتان سالب.']],
    g: function (r, lv) {
      var a = r.int(2, 12), b = r.int(2, 12);
      if (lv === 1) { var v = r.pick([[-a, b, '+'], [a, -b, '+'], [-a, -b, '+'], [-a, b, '−'], [a, -b, '−']]), rs = v[2] === '+' ? v[0] + v[1] : v[0] - v[1], t = mn(v[0]) + ' ' + v[2] + ' ' + (v[1] < 0 ? '(' + mn(v[1]) + ')' : v[1]); return { q: ['Work it out.', 'احسب.'], eq: t, a: rs, s: [[v[1] < 0 ? (v[2] === '+' ? 'Adding a negative is taking away' : 'Taking away a negative is adding') : 'Move along the line', v[1] < 0 ? (v[2] === '+' ? 'جمع السالب طرح' : 'طرح السالب جمع') : 'تحرك على الخط', t + ' =', mn(rs)]], miss: [[-rs === rs ? 1 : -rs, 'Right size, wrong sign. Picture the number line.', 'المقدار صحيح والإشارة خاطئة. تخيّل خط الأعداد.']] }; }
      if (lv === 2) { var n = r.bool(), rr = n ? a * b : -a * b; return { q: ['Multiply.', 'اضرب.'], eq: '−' + a + ' × ' + (n ? '−' : '') + b, a: rr, s: [[n ? 'Same signs: positive' : 'Different signs: negative', n ? 'متشابهتان: موجب' : 'مختلفتان: سالب', a + ' × ' + b + ' =', a * b], ['Apply the sign', 'طبّق الإشارة', 'Answer:', mn(rr)]], miss: [[-rr, 'Check the sign rule.', 'راجع قاعدة الإشارات.']] }; }
      var c = r.int(2, 6), ex = -a + b * -c, sh = mn(-a) + ' + ' + b + ' × (−' + c + ')';
      return { q: ['Work it out. Mind the order.', 'احسب. انتبه إلى الترتيب.'], eq: sh, a: ex, s: [['Multiply first', 'اضرب أولًا', b + ' × (−' + c + ') =', mn(-b * c)], ['Then add', 'ثم اجمع', mn(-a) + ' − ' + (b * c) + ' =', mn(ex)]] };
    },
    trap: function (r) { var a = r.int(2, 8), b = r.int(2, 8); return { eq: a + ' − (−' + b + ')', w: 0, why: ['Taking away a negative adds: ' + a + ' + ' + b + ' = ' + (a + b) + '.', 'طرح السالب جمع: ' + a + ' + ' + b + ' = ' + (a + b) + '.'], l: [['Subtract instead: ' + a + ' − ' + b + ' = ' + mn(a - b), 'اطرح بدلًا منه: ' + a + ' − ' + b + ' = ' + mn(a - b)], 'Answer: ' + mn(a - b), ['Two signs reduce to one', 'الإشارتان تصيران واحدة']] }; },
    explain: [['Why does taking away a debt raise your total?', 'لماذا تزيد إزالة الدين ما لديك؟'], ['A debt is a negative, and removing a negative is the same as adding.', 'الدين سالب، وإزالة السالب كالجمع.'], ['Debts are always good.', 'الديون جيدة دائمًا.'], ['It does not raise it.', 'لا تزيده.']]
  });

  teach('m8.powers', {
    why: ['Index laws make huge calculations short, and they come back in every algebra chapter.', 'قوانين القوى تختصر الحسابات الهائلة، وتعود في كل فصل من الجبر.'],
    idea: [['Same base, multiply: add the powers. a³ × a² = a⁵. Divide: subtract the powers.', 'الأساس نفسه، في الضرب: اجمع الأسس. a³ × a² = a⁵. وفي القسمة: اطرح الأسس.'], ['Power of a power: multiply. (a²)³ = a⁶. And anything to the power 0 is 1.', 'قوة لقوة: اضرب. (a²)³ = a⁶. وأي عدد أسه ٠ يساوي ١.']],
    g: function (r, lv) {
      var b = r.pick([2, 3, 5, 7, 10]), m = r.int(2, 8), n = r.int(2, 7), kind = lv === 1 ? 0 : lv === 2 ? 1 : 2;
      if (kind === 0) return { q: ['Same base: write the new power. Type the power only.', 'الأساس نفسه: اكتب الأس الجديد فقط.'], eq: b + sup(m) + ' × ' + b + sup(n) + ' = ' + b + '^?', a: m + n, s: [['Multiplying: add the powers', 'في الضرب: اجمع الأسس', m + ' + ' + n + ' =', m + n]], miss: [[m * n, 'That is for a power of a power. Here, add.', 'هذا لقوة القوة. هنا اجمع.']] };
      if (kind === 1) { var hi = m + n; return { q: ['Same base: write the new power. Type the power only.', 'الأساس نفسه: اكتب الأس الجديد فقط.'], eq: b + sup(hi) + ' ÷ ' + b + sup(n) + ' = ' + b + '^?', a: m, s: [['Dividing: take away the powers', 'في القسمة: اطرح الأسس', hi + ' − ' + n + ' =', m]], miss: [[dp(hi / n, 3), 'Subtract the powers, do not divide them.', 'اطرح الأسس ولا تقسمها.']] }; }
      return { q: ['Write the new power. Type the power only.', 'اكتب الأس الجديد فقط.'], eq: '(' + b + sup(m) + ')' + sup(n) + ' = ' + b + '^?', a: m * n, s: [['Power of a power: multiply', 'قوة لقوة: اضرب', m + ' × ' + n + ' =', m * n]], miss: [[m + n, 'That is for multiplying two powers. Here multiply them.', 'هذا لضرب قوتين. هنا اضرب الأسس.']] };
    },
    trap: function (r) { var m = r.int(2, 5), n = r.int(2, 5); return { w: 1, why: ['Multiplying with the same base adds the powers: 2^' + (m + n) + '.', 'الضرب بالأساس نفسه يجمع الأسس: ٢^' + (m + n) + '.'], l: ['2' + sup(m) + ' = ' + Math.pow(2, m), ['2' + sup(m) + ' × 2' + sup(n) + ' = 2' + sup(m * n), '٢' + sup(m) + ' × ٢' + sup(n) + ' = ٢' + sup(m * n)], '2' + sup(n) + ' = ' + Math.pow(2, n)] }; },
    explain: [['Why do we add powers when multiplying?', 'لماذا نجمع الأسس عند الضرب؟'], ['Write them out: a³ × a² has 5 a\'s multiplied in a row.', 'اكتبها: a³ × a² فيها ٥ حروف a مضروبة.'], ['Because multiplying is repeated adding.', 'لأن الضرب جمع متكرر.'], ['It is just a rule.', 'مجرد قاعدة.']]
  });

  teach('m8.std', {
    why: ['Distances in space and the size of atoms are written this way, and every calculator uses it.', 'مسافات الفضاء وأحجام الذرات تُكتب هكذا، وكل آلة حاسبة تستخدمها.'],
    idea: [['Standard form is a number from 1 up to 10, times a power of ten. 3 200 000 = 3.2 × 10⁶.', 'الصيغة العلمية عدد من ١ إلى أقل من ١٠ مضروبًا في قوة لعشرة. ٣٬٢٠٠٬٠٠٠ = ٣٫٢ × ١٠⁶.'], ['The power counts how many places the digits moved. Small numbers have negative powers: 0.004 = 4 × 10⁻³.', 'الأس يعدّ منازل تحرك الأرقام. والأعداد الصغيرة أسها سالب: ٠٫٠٠٤ = ٤ × ١٠⁻³.']],
    g: function (r, lv) {
      var a = r.int(11, 99) / 10, p = r.int(3, 8), n = dp(a * Math.pow(10, p));
      if (lv === 1) return { q: ['Write as a normal number.', 'اكتب عددًا عاديًا.'], eq: a + ' × 10' + sup(p), a: n, s: [['Move the digits ' + p + ' places left', 'حرّك الأرقام ' + p + ' منازل', a + ' × ' + Math.pow(10, p) + ' =', n]], miss: [[dp(a * Math.pow(10, p - 1)), 'One place short. Count ' + p + ' places.', 'تنقصك منزلة. عُدّ ' + p + ' منازل.']] };
      if (lv === 2) return { q: ['Write ' + n + ' in standard form: ' + a + ' × 10^?. What is the power?', 'اكتب ' + n + ' بالصيغة العلمية: ' + a + ' × ١٠^؟. ما الأس؟'], a: p, s: [['Count the places from ' + a + ' to ' + n, 'عُدّ المنازل من ' + a + ' إلى ' + n, n + ' ÷ ' + a + ' =', Math.pow(10, p)], ['As a power of ten', 'قوة لعشرة', 'Answer:', p]], miss: [[String(n).length, 'That counts the digits. Count how many places they moved.', 'هذا عدد الأرقام. عُدّ كم منزلة تحركت.']] };
      var q0 = r.int(2, 4); var sm = r.int(2, 9), s = dp(sm / Math.pow(10, q0), 6);
      return { q: ['Write ' + s + ' as ' + sm + ' × 10^?. What is the power?', 'اكتب ' + s + ' على صورة ' + sm + ' × ١٠^؟. ما الأس؟'], a: -q0, s: [['Moved right ' + q0 + ' places, so negative', 'تحرك ' + q0 + ' منازل يمينًا فهو سالب', s + ' × ' + Math.pow(10, q0) + ' =', sm], ['The power is', 'الأس هو', 'Answer:', '−' + q0]], miss: [[q0, 'Small numbers have a negative power.', 'الأعداد الصغيرة أسها سالب.']] };
    },
    trap: function (r) { return { w: 1, why: ['The first number must be from 1 up to 10. So 32 × 10⁵ should be 3.2 × 10⁶.', 'يجب أن يكون العدد الأول من ١ إلى أقل من ١٠. فالصحيح ٣٫٢ × ١٠⁶.'], l: ['4.5 × 10² = 450', ['32 × 10⁵ is standard form', '٣٢ × ١٠⁵ صيغة علمية'], '7 × 10³ = 7000'] }; },
    explain: [['Why write numbers in standard form?', 'لماذا نكتب الأعداد بالصيغة العلمية؟'], ['Their size is clear at a glance and counting zeros is avoided.', 'يتضح حجمها بنظرة ونتجنب عدّ الأصفار.'], ['To make them bigger.', 'لتكبيرها.'], ['Because normal numbers are wrong.', 'لأن الأعداد العادية خاطئة.']]
  });

  teach('m8.sf', {
    why: ['"About 3.1 million people" is more honest than a false exact number. Science depends on this.', '«نحو ٣٫١ مليون» أصدق من رقم دقيق زائف. والعلم يعتمد على هذا.'],
    idea: [['Significant figures count from the first non-zero digit. 0.00472 to 2 s.f. is 0.0047.', 'الأرقام المعنوية تُعدّ من أول رقم غير صفري. ٠٫٠٠٤٧٢ إلى رقمين هي ٠٫٠٠٤٧.'], ['Look at the next digit: 5 or more rounds up. Keep the place value with zeros: 4780 to 2 s.f. is 4800.', 'انظر إلى الرقم التالي: ٥ فأكثر يقرّب للأعلى. وأبقِ المنازل بالأصفار: ٤٧٨٠ إلى رقمين ٤٨٠٠.']],
    g: function (r, lv) {
      var a = r.int(1001, 9899);
      if (a % 100 === 0) a += 17;
      if (lv === 1) { var R1 = Math.round(a / 1000) * 1000; return { q: ['Round to 1 significant figure.', 'قرّب إلى رقم معنوي واحد.'], eq: String(a), a: R1, s: [['Keep the first digit, look at the next', 'أبقِ الأول وانظر إلى التالي', 'Digit:', Math.floor(a / 100) % 10], ['Round, and keep the place value', 'قرّب وأبقِ المنازل', 'Answer:', R1]], miss: [[Math.round(a / 1000), 'Keep the place value: fill with zeros.', 'أبقِ المنازل: املأها بالأصفار.']] }; }
      if (lv === 2) { var R2 = Math.round(a / 100) * 100; return { q: ['Round to 2 significant figures.', 'قرّب إلى رقمين معنويين.'], eq: String(a), a: R2, s: [['Keep two digits, look at the third', 'أبقِ رقمين وانظر إلى الثالث', 'Digit:', Math.floor(a / 10) % 10], ['Round', 'قرّب', 'Answer:', R2]], miss: [[Math.round(a / 10) * 10, 'That is 3 significant figures. Keep 2.', 'هذه ٣ أرقام. أبقِ رقمين.']] }; }
      var d = r.int(101, 989), z = r.pick([100, 1000]); if (d % 10 === 0) d += 3; var x = dp(d / (z * 10), 6), R3 = dp(Math.round(d / 10) / (z), 6);
      return { q: ['Round to 2 significant figures. Zeros before the first digit do not count.', 'قرّب إلى رقمين معنويين. الأصفار قبل أول رقم لا تُعدّ.'], eq: String(x), a: R3, s: [['Start counting at the first non-zero digit', 'ابدأ العدّ من أول رقم غير صفري', 'Digit:', Math.floor(d / 100)], ['Look at the third digit', 'انظر إلى الثالث', 'Digit:', d % 10], ['Round', 'قرّب', 'Answer:', R3]] };
    },
    trap: function (r) { return { eq: '0.0456', w: 1, q: ['Round 0.0456 to 2 significant figures. One line is wrong. Tap it.', 'قرّب ٠٫٠٤٥٦ إلى رقمين. سطر واحد خاطئ. انقر عليه.'], why: ['Leading zeros do not count. The answer is 0.046.', 'الأصفار البادئة لا تُعدّ. الناتج ٠٫٠٤٦.'], l: [['The first significant digit is 4', 'أول رقم معنوي ٤'], ['So the 0 and the 4 are the two kept', 'فالصفر و٤ هما الرقمان'], 'Answer: 0.04'] }; },
    explain: [['Why should 4780 rounded to 2 s.f. not be written as 48?', 'لماذا لا تُكتب ٤٧٨٠ بعد التقريب ٤٨؟'], ['That would change its size. Zeros hold the place value.', 'هذا يغيّر حجمها. الأصفار تحفظ المنازل.'], ['48 is a fine answer.', '٤٨ جواب جيد.'], ['Because 48 is even.', 'لأن ٤٨ زوجي.']]
  });

  var fr = function (r, hi) { var d = r.int(2, hi), n = r.int(1, d - 1); while (gcd(n, d) > 1) n = r.int(1, d - 1); return [n, d]; };
  teach('m8.fracop', {
    why: ['Fractions do not go away: they run through algebra, probability and physics. Now they must be solid.', 'الكسور لا تختفي: تمر في الجبر والاحتمال والفيزياء، فيجب أن تكون متينة.'],
    idea: [['Adding and taking away: common bottom first. Multiplying: tops and bottoms. Dividing: flip the second, then multiply.', 'الجمع والطرح: مقام مشترك أولًا. الضرب: البسطان والمقامان. القسمة: اقلب الثاني ثم اضرب.'], ['Simplify before multiplying when you can: it keeps numbers small.', 'بسّط قبل الضرب إن أمكن: تبقى الأعداد صغيرة.']],
    g: function (r, lv) {
      var f1 = fr(r, 9), f2 = fr(r, 9), a = f1[0], b = f1[1], c = f2[0], d = f2[1];
      if (lv === 1) { var L = TM.lcm(b, d), A = a * L / b, Cc = c * L / d, s = A + Cc; return { q: ['Add. Give the simplest form.', 'اجمع. أعط أبسط صورة.'], eq: a + '/' + b + ' + ' + c + '/' + d, a: low(s, L), s: [['Common bottom', 'مقام مشترك', 'Bottom:', L], ['First top', 'البسط الأول', a + ' × ' + (L / b) + ' =', A], ['Second top', 'البسط الثاني', c + ' × ' + (L / d) + ' =', Cc], ['Add', 'اجمع', A + ' + ' + Cc + ' =', s], ['Simplify', 'بسّط', s + '/' + L + ' =', low(s, L)]], miss: [[low(a + c, b + d), 'Tops and bottoms cannot be added straight across.', 'لا يُجمع البسطان والمقامان مباشرة.']] }; }
      if (lv === 2) { var T0 = a * c, B = b * d; return { q: ['Multiply. Give the simplest form.', 'اضرب. أعط أبسط صورة.'], eq: a + '/' + b + ' × ' + c + '/' + d, a: low(T0, B), s: [['Tops', 'البسطان', a + ' × ' + c + ' =', T0], ['Bottoms', 'المقامان', b + ' × ' + d + ' =', B], ['Simplify', 'بسّط', T0 + '/' + B + ' =', low(T0, B)]] }; }
      var T1 = a * d, B1 = b * c;
      return { q: ['Divide. Give the simplest form.', 'اقسم. أعط أبسط صورة.'], eq: a + '/' + b + ' ÷ ' + c + '/' + d, a: low(T1, B1), s: [['Flip the second and multiply', 'اقلب الثاني واضرب', a + '/' + b + ' × ' + d + '/' + c], ['Tops', 'البسطان', a + ' × ' + d + ' =', T1], ['Bottoms', 'المقامان', b + ' × ' + c + ' =', B1], ['Simplify', 'بسّط', T1 + '/' + B1 + ' =', low(T1, B1)]], miss: [[low(a * c, b * d), 'You multiplied without flipping.', 'ضربت دون قلب.']] };
    },
    trap: function (r) { var d = r.pick([3, 5, 7]); return { eq: '1/2 + 1/' + d, w: 0, why: ['Rewrite with a common bottom of ' + (2 * d) + '.', 'أعد الكتابة بمقام مشترك ' + (2 * d) + '.'], l: [['1 + 1 = 2 over 2 + ' + d, '١ + ١ = ٢ على ٢ + ' + d], 'Answer: 2/' + (2 + d), ['Less than 1/2?', 'أقل من ١/٢؟']] }; },
    explain: [['Which operation does not need a common bottom?', 'أي عملية لا تحتاج إلى مقام مشترك؟'], ['Multiplying.', 'الضرب.'], ['Adding.', 'الجمع.'], ['Taking away.', 'الطرح.']]
  });

  teach('m8.reppct', {
    why: ['Compound growth is the most important idea in money, and in the spread of illness.', 'النمو المركب أهم فكرة في المال وانتشار الأمراض.'],
    idea: [['Repeat the multiplier. 5% growth for 3 years is × 1.05 × 1.05 × 1.05.', 'كرر المضاعف. نمو ٥٪ لثلاث سنوات × ١٫٠٥ × ١٫٠٥ × ١٫٠٥.'], ['It beats adding 15%, because each year\'s growth is on a bigger amount.', 'يفوق إضافة ١٥٪ لأن نمو كل عام على مقدار أكبر.']],
    g: function (r, lv) {
      var P = r.pick([100, 200, 500, 1000, 2000]), p = r.pick(lv === 1 ? [10, 20] : [5, 10, 20, 50]), yrs = lv === 1 ? 2 : r.int(2, 3), m = dp(1 + p / 100, 2), down = lv === 3 && r.bool(), mm = down ? dp(1 - p / 100, 2) : m, v = P, s = [['The multiplier', 'المضاعف', (down ? '100 − ' : '100 + ') + p + ' =', down ? 100 - p : 100 + p]];
      for (var i = 0; i < yrs; i++) { var nv = dp(v * mm, 4); s.push(['Year ' + (i + 1), 'السنة ' + (i + 1), dp(v, 4) + ' × ' + mm + ' =', nv]); v = nv; }
      return { q: [P + (down ? ' falls by ' : ' grows by ') + p + '% each year. What is it after ' + yrs + ' years?', P + (down ? ' ينقص ' : ' ينمو ') + p + '٪ كل سنة. كم يصبح بعد ' + yrs + ' سنوات؟'], eq: P + ' × ' + mm + sup(yrs), a: dp(v, 4), s: s, miss: [[down ? P - P * p * yrs / 100 : P + P * p * yrs / 100, 'That is the same amount each year. Each year the percent is of the new amount.', 'هذا مقدار ثابت كل سنة. النسبة كل سنة من المقدار الجديد.']] };
    },
    trap: function (r) { var P = r.pick([100, 200, 1000]); return { eq: P + ' × 1.1²', w: 1, why: ['The second year multiplies the new amount, ' + (P * 1.1) + '.', 'السنة الثانية تضرب المقدار الجديد ' + dp(P * 1.1) + '.'], l: [P + ' × 1.1 = ' + dp(P * 1.1), P + ' × 1.1 = ' + dp(P * 1.21), 'Answer: ' + dp(P * 1.21)] }; },
    explain: [['10% a year for 2 years: is it a 20% rise?', '١٠٪ سنويًا لسنتين: هل هي زيادة ٢٠٪؟'], ['No, 21%: 1.1 × 1.1 = 1.21.', 'لا، ٢١٪: ١٫١ × ١٫١ = ١٫٢١.'], ['Yes, exactly 20%.', 'نعم، ٢٠٪ تمامًا.'], ['No, 11%.', 'لا، ١١٪.']]
  });

  teach('m8.ratio', {
    why: ['Which is better value, 300 g for 2.40 or 500 g for 3.50? Rates answer that.', 'أيهما أفضل: ٣٠٠ غ بـ ٢٫٤٠ أم ٥٠٠ غ بـ ٣٫٥٠؟ المعدلات تجيب.'],
    idea: [['A rate compares different things: km per hour, price per kilo. Divide to get the amount for one.', 'المعدل يقارن أشياء مختلفة: كم لكل ساعة، سعر لكل كيلو. اقسم لتجد قيمة الواحد.'], ['To compare deals, change both to the same unit.', 'لتقارن العروض حوّلها إلى وحدة واحدة.']],
    g: function (r, lv) {
      var a = r.int(2, 9), b = r.int(2, 9); while (gcd(a, b) > 1) b = r.int(2, 9); var k = r.int(2, 8);
      if (lv === 1) { return { q: ['Simplify the ratio ' + (a * k) + ' : ' + (b * k) + '. Give the first number of the simplest form.', 'بسّط النسبة ' + (a * k) + ' : ' + (b * k) + '. أعط العدد الأول.'], eq: (a * k) + ' : ' + (b * k), a: a, s: [['Biggest number dividing both', 'أكبر عدد يقسمهما', 'Factor:', k], ['Divide', 'اقسم', (a * k) + ' ÷ ' + k + ' =', a]] }; }
      if (lv === 2) { var u = r.int(2, 12), w = r.pick([3, 4, 5, 6, 8]); return { q: [(u * w) + ' km in ' + w + ' hours. What is the rate, in km per hour?', (u * w) + ' كم في ' + w + ' ساعات. كم المعدل؟'], eq: (u * w) + ' ÷ ' + w, a: u, s: [['Amount for one hour', 'مقدار الساعة الواحدة', (u * w) + ' ÷ ' + w + ' =', u]] }; }
      var g1 = r.pick([200, 250, 300, 400]), p1 = r.int(2, 9) * g1 / 100, g2 = r.pick([500, 600, 800, 1000]), p2 = r.int(2, 9) * g2 / 100; if (p1 / g1 === p2 / g2) p2 += g2 / 100; var u1 = dp(p1 / g1 * 100, 4), u2 = dp(p2 / g2 * 100, 4), best = u1 < u2;
      return { q: ['Which is better value?', 'أيهما أفضل قيمة؟'], o: [[(best ? g1 + ' g for ' + p1 : g2 + ' g for ' + p2), (best ? g1 + ' غ بـ ' + p1 : g2 + ' غ بـ ' + p2)], [(best ? g2 + ' g for ' + p2 : g1 + ' g for ' + p1), (best ? g2 + ' غ بـ ' + p2 : g1 + ' غ بـ ' + p1), 'Its price per 100 g is higher.', 'سعر كل ١٠٠ غ فيه أعلى.'], ['They are the same', 'متساويان']], s: [['Price per 100 g, first', 'سعر كل ١٠٠ غ، الأول', p1 + ' ÷ ' + (g1 / 100) + ' =', u1], ['Price per 100 g, second', 'سعر كل ١٠٠ غ، الثاني', p2 + ' ÷ ' + (g2 / 100) + ' =', u2]] };
    },
    trap: function (r) { var k = r.int(3, 7), a = 2, b = 3; return { eq: (a * k) + ' : ' + (b * k), w: 0, why: ['Divide both by the same number, ' + k + ', to get 2 : 3.', 'اقسمهما على العدد نفسه ' + k + ' لتحصل على ٢ : ٣.'], l: [['Take ' + k + ' from both', 'اطرح ' + k + ' منهما'], (a * k - k) + ' : ' + (b * k - k), 'Answer: ' + (a * k - k) + ' : ' + (b * k - k)] }; },
    explain: [['Why does a big pack sometimes cost more per gram?', 'لماذا تكلف العبوة الكبيرة أحيانًا أكثر لكل غرام؟'], ['Size alone says nothing: only the price per unit compares fairly.', 'الحجم وحده لا يكفي: سعر الوحدة هو المقارنة العادلة.'], ['Big packs always cost less per gram.', 'الكبيرة دائمًا أقل.'], ['Big packs have heavier grams.', 'غراماتها أثقل.']]
  });

  /* ---------- algebra, thoroughly ---------- */
  teach('m8.factor', {
    why: ['Factorising is multiplying in reverse. It is the key to solving most equations in the years ahead.', 'التحليل هو الضرب معكوسًا، ومفتاح حل أغلب المعادلات في السنوات القادمة.'],
    idea: [{ p: ['Find the biggest number and letter that divide every term, and put them outside. 6x + 9 = 3(2x + 3).', 'أوجد أكبر عدد وحرف يقسمان كل الحدود وضعهما خارج القوس. ٦x + ٩ = ٣(٢x + ٣).'], dia: function () { return D.box(['2x', '3'], ['3'], [['6x', '9']]); } }, ['Check by opening the bracket: you should get back what you started with.', 'تحقق بفتح القوس: يجب أن تعود إلى الأصل.']],
    g: function (r, lv) {
      var h = r.int(2, 9), a = r.int(2, 7), b = r.int(1, 11); while (gcd(a, b) > 1) b = r.int(1, 11);
      if (lv === 1) return { q: ['What number goes outside the bracket?', 'ما العدد خارج القوس؟'], eq: (h * a) + 'x + ' + (h * b), a: h, s: [['The biggest number dividing both', 'أكبر عدد يقسمهما', (h * a) + ' ÷ ' + h + ' =', a], [null, null, (h * b) + ' ÷ ' + h + ' =', b], ['So outside goes', 'فخارج القوس', 'Factor:', h]], miss: [[1, 'Look for a bigger number that divides both.', 'ابحث عن عدد أكبر يقسمهما.']] };
      if (lv === 2) return { q: ['Factorise fully.', 'حلّل تمامًا.'], eq: (h * a) + 'x + ' + (h * b), alg: true, a: [h + '(' + a + 'x+' + b + ')', '(' + a + 'x+' + b + ')' + h], s: [['Biggest common number', 'أكبر عدد مشترك', 'Factor:', h], ['What is left in the bracket', 'ما يبقى في القوس', (h * a) + ' ÷ ' + h + ' =', a], [null, null, (h * b) + ' ÷ ' + h + ' =', b], ['Together', 'معًا', h + '(' + a + 'x + ' + b + ')']] };
      return { q: ['Factorise fully. There is a letter in common too.', 'حلّل تمامًا. هناك حرف مشترك أيضًا.'], eq: (h * a) + 'x² + ' + (h * b) + 'x', alg: true, a: [h + 'x(' + a + 'x+' + b + ')'], s: [['Common number', 'العدد المشترك', 'Factor:', h], ['And the common letter: x', 'والحرف المشترك: x', h + 'x'], ['Together', 'معًا', h + 'x(' + a + 'x + ' + b + ')']] };
    },
    trap: function (r) { var h = r.int(2, 6), b = r.int(2, 5); return { eq: (2 * h) + 'x + ' + (h * b), w: 1, why: ['Divide every term: ' + (h * b) + ' ÷ ' + h + ' = ' + b + '.', 'اقسم كل حد: ' + (h * b) + ' ÷ ' + h + ' = ' + b + '.'], l: [(2 * h) + ' ÷ ' + h + ' = 2', (h * b) + ' ÷ ' + h + ' = ' + (h * b), ['So ' + h + '(2x + ' + (h * b) + ')', 'إذن ' + h + '(2x + ' + (h * b) + ')']] }; },
    explain: [['How do you know you have factorised fully?', 'كيف تعرف أن التحليل تام؟'], ['Nothing more can be taken out of the bracket.', 'لا يمكن إخراج شيء آخر من القوس.'], ['The bracket has two terms.', 'في القوس حدان.'], ['The number outside is 2.', 'العدد الخارجي ٢.']]
  });

  teach('m8.ineq', {
    why: ['Most real limits are not equal to something: at most 90 minutes, at least 60%. Inequalities speak that.', 'أغلب الحدود الحقيقية ليست مساواة: ٩٠ دقيقة على الأكثر، ٦٠٪ على الأقل. المتباينات تعبّر عنها.'],
    idea: [{ p: ['Solve like an equation. x + 3 > 7 gives x > 4.', 'حلّها كالمعادلة. x + ٣ > ٧ تعطي x > ٤.'], dia: function () { return D.line({ min: 0, max: 8, marks: { 4: 'x > 4' } }); } }, ['One new rule: multiply or divide by a negative and the sign flips. −2x < 6 gives x > −3.', 'قاعدة جديدة: الضرب أو القسمة في سالب تقلب الإشارة. −٢x < ٦ تعطي x > −٣.']],
    g: function (r, lv) {
      var a = r.int(2, 6), x = r.int(1, 9), b = r.int(1, 9), rhs = a * x + b, sign = r.pick(['>', '<']), W = function (s, v) { return 'x ' + s + ' ' + mn(v); };
      var flip = sign === '>' ? '<' : '>';
      if (lv < 3) { var R0 = W(sign, x); return { q: ['Solve the inequality.', 'حُلّ المتباينة.'], eq: a + 'x + ' + b + ' ' + sign + ' ' + rhs, o: [[R0, TM.ltr(R0)], [W(flip, x), TM.ltr(W(flip, x)), 'A positive divide does not flip the sign.', 'القسمة على موجب لا تقلب الإشارة.'], [W(sign, x + b), TM.ltr(W(sign, x + b)), 'Take ' + b + ' away first, then divide.', 'اطرح ' + b + ' أولًا ثم اقسم.']], s: [['Take ' + b + ' from both sides', 'اطرح ' + b + ' من الطرفين', rhs + ' − ' + b + ' =', rhs - b], ['Divide by ' + a, 'اقسم على ' + a, (rhs - b) + ' ÷ ' + a + ' =', x], ['Answer', 'الناتج', R0]] }; }
      var R1 = W(flip, -x);
      return { q: ['Solve. Careful: you divide by a negative.', 'حُلّ. انتبه: تقسم على سالب.'], eq: '−' + a + 'x ' + sign + ' ' + (a * x), o: [[R1, TM.ltr(R1)], [W(sign, -x), TM.ltr(W(sign, -x)), 'Dividing by a negative flips the sign.', 'القسمة على سالب تقلب الإشارة.'], [W(sign, x), TM.ltr(W(sign, x)), 'Check the sign of the answer too.', 'راجع إشارة الناتج أيضًا.']], s: [['Divide by −' + a, 'اقسم على −' + a, (a * x) + ' ÷ −' + a + ' =', '−' + x], ['The sign flips', 'تنقلب الإشارة', R1]] };
    },
    trap: function (r) { return { eq: '−2x > 6', w: 1, why: ['Dividing by −2 flips the sign: x < −3.', 'القسمة على −٢ تقلب الإشارة: x < −٣.'], l: ['6 ÷ −2 = −3', ['So x > −3', 'إذن x > −٣'], ['Test x = 0: 0 > 6 is false', 'جرّب x = ٠: ٠ > ٦ خطأ']] }; },
    explain: [['Why does dividing by a negative flip the sign?', 'لماذا تقلب القسمة على سالب الإشارة؟'], ['3 > 2, yet −3 < −2: multiplying by −1 reverses the order on the number line.', '٣ > ٢ لكن −٣ < −٢: الضرب في −١ يعكس الترتيب.'], ['To make it harder.', 'لجعلها أصعب.'], ['It does not flip.', 'لا تنقلب.']]
  });

  teach('m8.line', {
    why: ['A straight line graph turns a rule into a picture. Costs, speeds and experiments all make them.', 'الخط المستقيم يحوّل القاعدة إلى صورة، والتكاليف والسرعات والتجارب كلها تعطيها.'],
    idea: [{ p: ['y = mx + c. c is where the line crosses the y axis. m is how steep it is.', 'y = mx + c. c حيث يقطع الخط محور y، وm مقدار ميله.'], dia: function () { return D.axes({ x: [-3, 5], y: [-3, 9], line: [[-2, -3], [4, 9]], pts: [[0, 1, 'c = 1']] }); } }, ['For y = 2x + 1: when x goes up 1, y goes up 2.', 'في y = ٢x + ١: إذا زاد x واحدًا زاد y اثنين.']],
    g: function (r, lv) {
      var m = r.int(1, 4), c = r.int(-3, 5), x = r.int(1, 5), y = m * x + c, eqn = 'y = ' + m + 'x ' + (c < 0 ? '− ' + (-c) : '+ ' + c);
      if (lv === 1) return { q: ['Find y when x = ' + x + '.', 'أوجد y عندما x = ' + x + '.'], eq: eqn, dia: D.axes({ x: [-3, 6], y: [-4, 12], step: 2, line: [[-1, -m + c], [5, 5 * m + c]] }), a: y, s: [['Multiply', 'اضرب', m + ' × ' + x + ' =', m * x], ['Then ' + (c < 0 ? 'take away' : 'add'), 'ثم ' + (c < 0 ? 'اطرح' : 'أضف'), (m * x) + (c < 0 ? ' − ' + (-c) : ' + ' + c) + ' =', mn(y)]] };
      if (lv === 2) { var kind = r.bool(); return kind ? { q: ['Where does this line cross the y axis? Type the y value.', 'أين يقطع هذا الخط محور y؟ اكتب قيمة y.'], eq: eqn, a: c, s: [['Put x = 0', 'ضع x = ٠', m + ' × 0 =', 0], ['So y is', 'فـ y', 'Answer:', mn(c)]], miss: [[m, 'That is the steepness. The crossing is the number on its own.', 'هذا الميل. نقطة القطع هي العدد وحده.']] } : { q: ['What is the gradient of this line?', 'ما ميل هذا الخط؟'], eq: eqn, a: m, s: [['The number with x', 'العدد مع x', 'Gradient:', m]], miss: [[c, 'That is where it crosses. The gradient goes with x.', 'هذه نقطة القطع. الميل مع x.']] }; }
      var c2 = r.int(1, 9); var yy = m * x + c2;
      return { q: ['A taxi charges ' + c2 + ' to start plus ' + m + ' per km. Using y = ' + m + 'x + ' + c2 + ', what does ' + x + ' km cost?', 'تتقاضى سيارة أجرة ' + c2 + ' للبدء و' + m + ' لكل كم. باستخدام y = ' + m + 'x + ' + c2 + '، كم تكلف ' + x + ' كم؟'], eq: m + ' × ' + x + ' + ' + c2, a: yy, s: [['Per km × distance', 'لكل كم × المسافة', m + ' × ' + x + ' =', m * x], ['Add the start', 'أضف البدء', (m * x) + ' + ' + c2 + ' =', yy]], miss: [[m * x, 'Do not forget the starting charge.', 'لا تنس أجرة البدء.']] };
    },
    trap: function (r) { var m = r.int(2, 5), c = r.int(1, 6); return { eq: 'y = ' + m + 'x + ' + c, w: 1, why: ['The gradient is ' + m + ' and it crosses at ' + c + '. They were swapped.', 'الميل ' + m + ' والقطع عند ' + c + '. تبادلا.'], l: ['x = 0: y = ' + c, ['Gradient ' + c + ', crosses at ' + m, 'الميل ' + c + ' والقطع عند ' + m], 'x = 1: y = ' + (m + c)] }; },
    explain: [['What does a bigger m do to a line?', 'ماذا يفعل m الأكبر بالخط؟'], ['It makes it steeper.', 'يجعله أشد ميلًا.'], ['It moves it up.', 'يرفعه.'], ['It makes it shorter.', 'يقصّره.']]
  });

  teach('m8.slope', {
    why: ['Ramps, roofs and the rate of anything changing are all gradients. Calculus starts from here.', 'المنحدرات والأسقف ومعدل تغير أي شيء كلها ميول، ومن هنا يبدأ التفاضل.'],
    idea: [{ p: ['Gradient = rise ÷ run. From (1, 2) to (3, 8): up 6, along 2, gradient 3.', 'الميل = الارتفاع ÷ المسافة الأفقية. من (١، ٢) إلى (٣، ٨): ٦ أعلى و٢ أفقيًا، فالميل ٣.'], dia: function () { return D.axes({ x: [0, 5], y: [0, 10], line: [[0, -1], [3.67, 10]], pts: [[1, 2, '(1, 2)'], [3, 8, '(3, 8)']] }); } }, ['Going down from left to right gives a negative gradient.', 'الهبوط من اليسار إلى اليمين يعطي ميلًا سالبًا.']],
    g: function (r, lv) {
      var x1 = r.int(0, 4), run = r.int(1, 4), m = lv === 1 ? r.int(1, 3) : r.pick([-3, -2, -1, 1, 2, 3, 4]), y1 = r.int(m < 0 ? 8 : 0, m < 0 ? 12 : 4), x2 = x1 + run, y2 = y1 + m * run;
      var S = [['Rise', 'الارتفاع', y2 + ' − ' + y1 + ' =', mn(y2 - y1)], ['Run', 'الأفقي', x2 + ' − ' + x1 + ' =', run], ['Rise ÷ run', 'الارتفاع ÷ الأفقي', mn(y2 - y1) + ' ÷ ' + run + ' =', mn(m)]];
      if (lv === 3) return { q: ['A ramp goes up ' + (Math.abs(m) * run * 10) + ' cm over ' + (run * 100) + ' cm. What is its gradient as a decimal?', 'منحدر يرتفع ' + (Math.abs(m) * run * 10) + ' سم على ' + (run * 100) + ' سم. ما ميله عشريًا؟'], a: dp(Math.abs(m) / 10), s: [['Rise ÷ run', 'الارتفاع ÷ الأفقي', (Math.abs(m) * run * 10) + ' ÷ ' + (run * 100) + ' =', dp(Math.abs(m) / 10)]], miss: [[run * 100 / (Math.abs(m) * run * 10), 'Upside down: rise over run.', 'مقلوب: الارتفاع على الأفقي.']] };
      return { q: ['Find the gradient between the two points.', 'أوجد الميل بين النقطتين.'], eq: '(' + x1 + ', ' + y1 + ') , (' + x2 + ', ' + y2 + ')', dia: D.axes({ x: [0, 9], y: [Math.min(0, y2 - 1), 14], step: 2, line: [[x1, y1], [x2, y2]], pts: [[x1, y1], [x2, y2]] }), a: m, s: S, miss: [[dp(run / (m || 1), 3), 'Upside down: rise goes on top.', 'مقلوب: الارتفاع في البسط.'], [-m, 'Check the sign: is it going up or down?', 'راجع الإشارة: هل يصعد أم يهبط؟']] };
    },
    trap: function (r) { return { eq: '(1, 3) , (3, 7)', w: 2, why: ['Rise is 4, run is 2, so 4 ÷ 2 = 2, not 2 ÷ 4.', 'الارتفاع ٤ والأفقي ٢، فـ ٤ ÷ ٢ = ٢ لا ٢ ÷ ٤.'], l: ['7 − 3 = 4', '3 − 1 = 2', ['Run ÷ rise: 2 ÷ 4 = 0.5', 'الأفقي ÷ الارتفاع: 2 ÷ 4 = 0.5'], 'Gradient: 0.5'] }; },
    explain: [['What is the gradient of a flat line?', 'ما ميل الخط الأفقي؟'], ['0: there is no rise at all.', '٠: لا ارتفاع.'], ['1.', '١.'], ['It has no number.', 'ليس له عدد.']]
  });

  teach('m8.seqn', {
    why: ['A formula for a pattern turns "keep going" into an instant answer.', 'صيغة النمط تحوّل «تابع» إلى جواب فوري.'],
    idea: [['The step tells you the number with n. 7, 11, 15: step 4, so 4n. Then fix: 4n + 3.', 'الخطوة تحدد العدد مع n. ٧ و١١ و١٥: الخطوة ٤ فهي ٤n. ثم عدّل: ٤n + ٣.'], ['Test with n = 1: 4 + 3 = 7. Falling patterns have a negative step: 20, 17, 14 is −3n + 23.', 'جرّب n = ١: ٤ + ٣ = ٧. والأنماط النازلة خطوتها سالبة: ٢٠ و١٧ و١٤ هي −٣n + ٢٣.']],
    g: function (r, lv) {
      var d = r.int(2, 9), c = r.int(-4, 12), ts = [1, 2, 3, 4].map(function (n) { return d * n + c; }), dd = -r.int(2, 6), c2 = r.int(30, 60), td = [1, 2, 3, 4].map(function (n) { return dd * n + c2; });
      if (lv === 1) return { q: ['What number goes with n in the rule?', 'ما العدد مع n في القاعدة؟'], eq: ts.join(', ') + ' ...', a: d, s: [['The step', 'الخطوة', ts[1] + ' − ' + ts[0] + ' =', d]] };
      if (lv === 2) return { q: ['The rule is ' + d + 'n + c. What is c?', 'القاعدة ' + d + 'n + c. ما قيمة c؟'], eq: ts.join(', ') + ' ...', a: c, s: [['When n = 1, ' + d + 'n is', 'عند n = ١ يكون ' + d + 'n', d + ' × 1 =', d], ['What fixes it?', 'ما التعديل؟', ts[0] + ' − ' + d + ' =', mn(c)]], miss: [[ts[0], 'That is the first term. Compare it with ' + d + ' × 1.', 'هذا الحد الأول. قارنه بـ ' + d + ' × ١.']] };
      return { q: ['A falling pattern. The rule is ' + mn(dd) + 'n + c. Find c.', 'نمط نازل. القاعدة ' + mn(dd) + 'n + c. أوجد c.'], eq: td.join(', ') + ' ...', a: c2, s: [['The step is negative', 'الخطوة سالبة', td[1] + ' − ' + td[0] + ' =', mn(dd)], ['Fix at n = 1', 'عدّل عند n = ١', td[0] + ' + ' + (-dd) + ' =', c2]], miss: [[td[0], 'That is the first term. c is one step before it.', 'هذا الحد الأول. c قبله بخطوة.']] };
    },
    trap: function (r) { var d = r.int(3, 6), c = r.int(1, 5); return { eq: (d + c) + ', ' + (2 * d + c) + ', ' + (3 * d + c), w: 1, why: ['Test n = 2: the rule should give ' + (2 * d + c) + '. The correct rule is ' + d + 'n + ' + c + '.', 'جرّب n = ٢: القاعدة الصحيحة ' + d + 'n + ' + c + '.'], l: ['Step: ' + d, ['Rule: ' + c + 'n + ' + d, 'القاعدة: ' + c + 'n + ' + d], ['Term 1 fits by luck', 'الحد ١ يوافق صدفة']] }; },
    explain: [['Why test your rule with more than n = 1?', 'لماذا تجرب القاعدة بأكثر من n = ١؟'], ['One point fits many rules. A second point checks the step.', 'نقطة واحدة توافق قواعد كثيرة، والثانية تتحقق من الخطوة.'], ['Teachers prefer it.', 'يفضله المعلمون.'], ['One test always suffices.', 'تجربة واحدة تكفي.']]
  });

  /* ---------- geometry and data ---------- */
  var TRIPS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [20, 21, 29]];
  teach('m8.pyth', {
    why: ['Builders have used it for thousands of years to make a true square corner. It gives any distance on a map.', 'استخدمه البنّاؤون آلاف السنين لضبط الزاوية القائمة، ويعطي أي مسافة على الخريطة.'],
    idea: [{ p: ['In a right-angled triangle, a² + b² = c². c is the longest side, opposite the right angle.', 'في المثلث القائم a² + b² = c². وc أطول ضلع، مقابل الزاوية القائمة.'], dia: function () { return D.tri({ right: 0, sides: ['4', 'c', '3'] }); } }, ['To find a shorter side, take away instead: a² = c² − b².', 'لإيجاد ضلع أقصر اطرح: a² = c² − b².']],
    g: function (r, lv) {
      var t = r.pick(lv === 1 ? TRIPS.slice(0, 2) : TRIPS), a = t[0], b = t[1], c = t[2];
      if (lv === 1) return { q: ['Find the longest side.', 'أوجد الضلع الأطول.'], dia: D.tri({ right: 0, sides: [b, '?', a] }), a: c, s: [['Square both short sides', 'ربّع الضلعين القصيرين', a + '² + ' + b + '² =', a * a + b * b], ['Square root', 'الجذر', '√' + (a * a + b * b) + ' =', c]], miss: [[a + b, 'You added the sides. Square them first.', 'جمعت الضلعين. ربّعهما أولًا.'], [a * a + b * b, 'Now take the square root.', 'الآن خذ الجذر التربيعي.']] };
      if (lv === 2) return { q: ['Find the missing short side.', 'أوجد الضلع القصير الناقص.'], dia: D.tri({ right: 0, sides: ['?', c, a] }), a: b, s: [['Longest squared, take away', 'مربع الأطول، ثم اطرح', c + '² − ' + a + '² =', c * c - a * a], ['Square root', 'الجذر', '√' + (c * c - a * a) + ' =', b]], miss: [[Math.round(Math.sqrt(c * c + a * a) * 100) / 100, 'For a short side, take away.', 'للضلع القصير اطرح.'], [c - a, 'You must square before subtracting.', 'ربّع قبل الطرح.']] };
      return { q: ['A ladder ' + c + ' m long stands ' + a + ' m from a wall. How high up the wall does it reach, in m?', 'سلم طوله ' + c + ' م على بعد ' + a + ' م من الجدار. إلى أي ارتفاع يصل؟'], dia: D.tri({ right: 0, sides: [a, c, '?'] }), a: b, s: [['The ladder is the longest side', 'السلم هو الأطول', c + '² − ' + a + '² =', c * c - a * a], ['Square root', 'الجذر', '√' + (c * c - a * a) + ' =', b]], miss: [[c - a, 'Square first, then take away.', 'ربّع أولًا ثم اطرح.']] };
    },
    trap: function (r) { var t = r.pick(TRIPS.slice(0, 3)); return { w: 0, eq: t[0] + ' , ' + t[1], why: ['Square before adding: ' + t[0] + '² + ' + t[1] + '² = ' + (t[0] * t[0] + t[1] * t[1]) + ', so c = ' + t[2] + '.', 'ربّع قبل الجمع: ' + t[0] + '² + ' + t[1] + '² = ' + (t[0] * t[0] + t[1] * t[1]) + '، فـ c = ' + t[2] + '.'], l: [['Add sides: ' + t[0] + ' + ' + t[1] + ' = ' + (t[0] + t[1]), 'اجمع الضلعين: ' + t[0] + ' + ' + t[1] + ' = ' + (t[0] + t[1])], ['So c is ' + (t[0] + t[1]), 'إذن c = ' + (t[0] + t[1])], ['Then check with a ruler', 'ثم تحقق بالمسطرة']] }; },
    explain: [['Does a² + b² = c² work for every triangle?', 'هل a² + b² = c² تصح في كل مثلث؟'], ['Only when there is a right angle.', 'فقط إذا كانت هناك زاوية قائمة.'], ['Yes, every triangle.', 'نعم، كل مثلث.'], ['Only for small ones.', 'في الصغيرة فقط.']]
  });

  teach('m8.circ', {
    why: ['Two formulas for circles, and the mistake everyone makes is mixing them up.', 'صيغتان للدائرة، والخطأ الشائع هو الخلط بينهما.'],
    idea: [{ p: ['Circumference = 2πr: a length. Area = πr²: a space. The squared one gives square units.', 'المحيط = ٢πr: طول. والمساحة = πr²: حيز. والمربع يعطي وحدة مربعة.'], dia: function () { return D.circle({ r: 'r' }); } }, ['An exact answer keeps π: a radius of 3 has area 9π.', 'الجواب الدقيق يبقي π: نصف قطر ٣ مساحته ٩π.']],
    g: function (r, lv) {
      var rd = r.int(2, 12), area = rd * rd, cc = 2 * rd;
      if (lv === 1) return { q: ['Find the area as a multiple of π. Type the number before π.', 'أوجد المساحة بدلالة π. اكتب العدد قبل π.'], dia: D.circle({ r: rd }), eq: 'π × ' + rd + '²', a: area, s: [['Square the radius', 'ربّع نصف القطر', rd + ' × ' + rd + ' =', area]], miss: [[cc, 'That is the circumference number. Area squares r.', 'هذا عدد المحيط. المساحة تربع r.']] };
      if (lv === 2) return { q: ['Find the circumference as a multiple of π. Type the number before π.', 'أوجد المحيط بدلالة π. اكتب العدد قبل π.'], dia: D.circle({ r: rd }), eq: '2 × π × ' + rd, a: cc, s: [['Twice the radius', 'ضعف نصف القطر', '2 × ' + rd + ' =', cc]], miss: [[area, 'That is the area number. Circumference is 2 × r.', 'هذا عدد المساحة. المحيط ٢ × r.']] };
      var ar = rd * rd; return { q: ['A circle has area ' + ar + 'π. What is its radius?', 'مساحة دائرة ' + ar + 'π. كم نصف قطرها؟'], eq: 'π × r² = ' + ar + 'π', a: rd, s: [['Cancel π', 'احذف π', 'r × r =', ar], ['Square root', 'الجذر', '√' + ar + ' =', rd]], miss: [[ar / 2, 'Halving is not undoing a square. Take the square root.', 'التنصيف لا يعكس التربيع. خذ الجذر.']] };
    },
    trap: function (r) { var rd = r.int(3, 9); return { eq: 'r = ' + rd, w: 0, why: ['Area squares the radius: ' + (rd * rd) + 'π, not 2 × ' + rd + 'π.', 'المساحة تربع نصف القطر: ' + (rd * rd) + 'π لا ٢ × ' + rd + 'π.'], l: [['Area: 2 × ' + rd + 'π = ' + (2 * rd) + 'π', 'المساحة: 2 × ' + rd + 'π = ' + (2 * rd) + 'π'], 'Circumference: 2 × ' + rd + ' = ' + (2 * rd), ['Different questions', 'سؤالان مختلفان']] }; },
    explain: [['Which is in square centimetres?', 'أيهما بالسنتيمتر المربع؟'], ['The area, the space inside.', 'المساحة، الحيز الداخلي.'], ['The circumference.', 'المحيط.'], ['The radius.', 'نصف القطر.']]
  });

  teach('m8.cyl', {
    why: ['Cans, pipes and wells: how much do they hold?', 'العلب والأنابيب والآبار: كم تتسع؟'],
    idea: [{ p: ['A cylinder is a prism with a circular end. Volume = π r² × h.', 'الأسطوانة منشور طرفه دائرة. الحجم = π r² × h.'], dia: function () { return D.cyl('r', 'h'); } }, ['Find the circle first, then multiply by the height. Keep everything in the same units.', 'أوجد الدائرة أولًا ثم اضرب في الارتفاع، ووحّد الوحدات.']],
    g: function (r, lv) {
      var rd = r.int(1, 8), h = r.int(2, 15), inner = rd * rd * h;
      if (lv === 1) return { q: ['Find the volume as a multiple of π. Type the number before π.', 'أوجد الحجم بدلالة π. اكتب العدد قبل π.'], dia: D.cyl(rd, h), eq: 'π × ' + rd + '² × ' + h, a: inner, s: [['Square the radius', 'ربّع نصف القطر', rd + ' × ' + rd + ' =', rd * rd], ['× height', '× الارتفاع', (rd * rd) + ' × ' + h + ' =', inner]], miss: [[2 * rd * h, 'That does not square r. Volume uses r × r.', 'لم تربع r. الحجم r × r.'], [rd * h, 'Square the radius first.', 'ربّع نصف القطر أولًا.']] };
      var v = dp(3.14 * inner, 2);
      if (lv === 2) return { q: ['Find the volume, using π = 3.14.', 'أوجد الحجم باستخدام π = ٣٫١٤.'], dia: D.cyl(rd, h), a: v, s: [['r² × h', 'r² × h', rd + ' × ' + rd + ' × ' + h + ' =', inner], ['× π', '× π', inner + ' × 3.14 =', v]] };
      return { q: ['A cylinder has volume ' + inner + 'π and radius ' + rd + '. How tall is it?', 'حجم أسطوانة ' + inner + 'π ونصف قطرها ' + rd + '. كم ارتفاعها؟'], dia: D.cyl(rd, '?'), a: h, s: [['Area of the end, in π', 'مساحة الطرف بدلالة π', rd + ' × ' + rd + ' =', rd * rd], ['Divide', 'اقسم', inner + ' ÷ ' + (rd * rd) + ' =', h]], miss: [[dp(inner / rd, 4), 'Divide by r², not r.', 'اقسم على r² لا r.']] };
    },
    trap: function (r) { var rd = r.int(3, 6), h = r.int(3, 9); return { eq: 'r = ' + rd + ' , h = ' + h, w: 0, why: ['r squared is ' + (rd * rd) + ', not ' + rd + ' × 2.', 'مربع r هو ' + (rd * rd) + ' لا ' + rd + ' × ٢.'], l: [['End area: ' + rd + ' × 2 = ' + (rd * 2), 'مساحة الطرف: ' + rd + ' × 2 = ' + (rd * 2)], (rd * 2) + ' × ' + h + ' = ' + (rd * 2 * h), ['Volume ' + (rd * 2 * h) + 'π', 'الحجم ' + (rd * 2 * h) + 'π']] }; },
    explain: [['If a can is twice as tall, what about its volume?', 'إذا تضاعف ارتفاع علبة، ماذا عن حجمها؟'], ['It doubles.', 'يتضاعف.'], ['It is four times bigger.', 'يصبح أربعة أضعاف.'], ['It stays the same.', 'يبقى نفسه.']]
  });

  teach('m8.sim', {
    why: ['Maps, models and shadows use similar shapes. Thales measured a pyramid from its shadow this way.', 'الخرائط والنماذج والظلال تستخدم الأشكال المتشابهة، وبها قاس طاليس هرمًا من ظله.'],
    idea: [{ p: ['Similar shapes have equal angles, and every side is scaled by the same factor.', 'الأشكال المتشابهة زواياها متساوية، وكل أضلاعها مضروبة في عامل واحد.'], dia: function () { return D.tri({ sides: ['6', null, '4'] }); } }, ['Scale factor = new length ÷ old length. Use it on any side you want.', 'عامل التكبير = الطول الجديد ÷ القديم، واستخدمه على أي ضلع.']],
    g: function (r, lv) {
      var a = r.int(2, 9), k = r.pick(lv === 1 ? [2, 3, 4] : [1.5, 2.5, 3, 4, 5]), b = r.int(2, 9); if (a === b) b++; var A = dp(a * k), B = dp(b * k);
      if (lv === 3) { var h = r.int(2, 5), s0 = r.int(2, 6), f = r.int(3, 10); return { q: ['A ' + h + ' m pole casts a ' + s0 + ' m shadow. A tower casts a ' + (s0 * f) + ' m shadow at the same moment. How tall is the tower, in m?', 'عمود ' + h + ' م ظله ' + s0 + ' م. وظل برج ' + (s0 * f) + ' م في اللحظة نفسها. كم ارتفاع البرج؟'], eq: h + ' × ' + (s0 * f) + ' ÷ ' + s0, a: h * f, s: [['Scale factor', 'عامل التكبير', (s0 * f) + ' ÷ ' + s0 + ' =', f], ['Scale the pole', 'كبّر العمود', h + ' × ' + f + ' =', h * f]], miss: [[h + s0 * f - s0, 'You added. Similar shapes multiply.', 'جمعت. الأشكال المتشابهة تضرب.']] }; }
      return { q: ['Two similar shapes. A side of ' + a + ' cm becomes ' + A + ' cm. What does a side of ' + b + ' cm become?', 'شكلان متشابهان. ضلع ' + a + ' سم صار ' + A + ' سم. ماذا يصير ضلع ' + b + ' سم؟'], eq: b + ' × ' + k, a: B, s: [['Scale factor', 'عامل التكبير', A + ' ÷ ' + a + ' =', k], ['Apply it', 'طبّقه', b + ' × ' + k + ' =', B]], miss: [[dp(b + A - a), 'You added the difference. Similar shapes multiply by the same factor.', 'أضفت الفرق. الأشكال المتشابهة تضرب في عامل واحد.']] };
    },
    trap: function (r) { var a = r.int(2, 5), k = r.int(2, 4); return { w: 1, q: ['A side of ' + a + ' becomes ' + (a * k) + '. Find what ' + (a + 2) + ' becomes. One line is wrong. Tap it.', 'ضلع ' + a + ' صار ' + (a * k) + '. ماذا يصير ' + (a + 2) + '؟ سطر واحد خاطئ. انقر عليه.'], why: ['Multiply by the factor ' + k + ': ' + (a + 2) + ' × ' + k + ' = ' + ((a + 2) * k) + '.', 'اضرب في العامل ' + k + ': ' + (a + 2) + ' × ' + k + ' = ' + ((a + 2) * k) + '.'], l: [(a * k) + ' ÷ ' + a + ' = ' + k, ['Add the difference: ' + (a + 2) + ' + ' + (a * k - a) + ' = ' + (a * k + 2), 'أضف الفرق: ' + (a + 2) + ' + ' + (a * k - a) + ' = ' + (a * k + 2)], ['Compare the shapes', 'قارن الشكلين']] }; },
    explain: [['Are all rectangles similar?', 'هل كل المستطيلات متشابهة؟'], ['No. The angles match, but the sides need not scale evenly.', 'لا. الزوايا متساوية لكن الأضلاع قد لا تتناسب.'], ['Yes, all rectangles.', 'نعم، كلها.'], ['Yes, if they are the same colour.', 'نعم إذا تساوى اللون.']]
  });

  teach('m8.prob', {
    why: ['Risk in medicine, weather and engineering is worked out with these rules.', 'تُحسب المخاطر في الطب والطقس والهندسة بهذه القواعد.'],
    idea: [['"Or" for events that cannot both happen: add. "And" for independent events: multiply.', '«أو» لحدثين لا يقعان معًا: اجمع. و«و» لحدثين مستقلين: اضرب.'], ['Two coins both heads: 1/2 × 1/2 = 1/4. A die showing 1 or 2: 1/6 + 1/6 = 1/3.', 'عملتان وجهان: ١/٢ × ١/٢ = ١/٤. نرد ١ أو ٢: ١/٦ + ١/٦ = ١/٣.']],
    g: function (r, lv) {
      var a = r.int(1, 4), b = r.int(1, 5), d = a + b + r.int(1, 5);
      if (lv === 1) return { q: ['A bag of ' + d + ' balls has ' + a + ' red and ' + b + ' blue. What is the chance of red or blue? Give the simplest form.', 'كيس فيه ' + d + ' كرات منها ' + a + ' حمراء و' + b + ' زرقاء. ما احتمال الأحمر أو الأزرق؟ أعط أبسط صورة.'], eq: a + '/' + d + ' + ' + b + '/' + d, a: low(a + b, d), s: [['Or: add', '«أو»: اجمع', a + ' + ' + b + ' =', a + b], ['Over all', 'على الكل', (a + b) + '/' + d + ' =', low(a + b, d)]], miss: [[low(a * b, d * d), 'You multiplied. "Or" adds for events that cannot both happen.', 'ضربت. «أو» تجمع.']] };
      var p = r.pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5], [2, 5]]), q0 = r.pick([[1, 2], [1, 3], [1, 6], [1, 4], [2, 5]]), T0 = p[0] * q0[0], B = p[1] * q0[1];
      if (lv === 2) return { q: ['Two separate events have chances ' + p[0] + '/' + p[1] + ' and ' + q0[0] + '/' + q0[1] + '. What is the chance of both? Give the simplest form.', 'حدثان مستقلان احتمالاهما ' + p[0] + '/' + p[1] + ' و' + q0[0] + '/' + q0[1] + '. ما احتمال وقوعهما معًا؟ أعط أبسط صورة.'], eq: p[0] + '/' + p[1] + ' × ' + q0[0] + '/' + q0[1], a: low(T0, B), s: [['And: multiply', '«و»: اضرب', p[0] + ' × ' + q0[0] + ' =', T0], [null, null, p[1] + ' × ' + q0[1] + ' =', B], ['Simplify', 'بسّط', T0 + '/' + B + ' =', low(T0, B)]], miss: [[low(p[0] * q0[1] + q0[0] * p[1], B), 'You added. "And" multiplies, and gives a smaller chance.', 'جمعت. «و» تضرب وتعطي احتمالًا أصغر.']] };
      var nm = p[1] - p[0], nq = q0[1] - q0[0], Tn = nm * nq, Bn = p[1] * q0[1], at = low(Bn - Tn, Bn);
      return { q: ['Chances ' + p[0] + '/' + p[1] + ' and ' + q0[0] + '/' + q0[1] + ', independent. What is the chance of at least one? Give the simplest form.', 'احتمالان ' + p[0] + '/' + p[1] + ' و' + q0[0] + '/' + q0[1] + ' مستقلان. ما احتمال وقوع واحد على الأقل؟ أعط أبسط صورة.'], a: at, s: [['Chance of neither: multiply the "nots"', 'احتمال عدمهما: اضرب', nm + ' × ' + nq + ' =', Tn], ['Over', 'على', p[1] + ' × ' + q0[1] + ' =', Bn], ['Take from 1', 'اطرح من ١', Bn + ' − ' + Tn + ' =', Bn - Tn], ['Simplify', 'بسّط', (Bn - Tn) + '/' + Bn + ' =', at]] };
    },
    trap: function (r) { return { eq: '1/2 × 1/2', w: 0, why: ['Both happening is rarer than one: 1/2 × 1/2 = 1/4.', 'وقوعهما معًا أندر: ١/٢ × ١/٢ = ١/٤.'], l: [['Two coins, both heads: 1/2 + 1/2', 'عملتان، وجهان: ١/٢ + ١/٢'], ['That is 1, so it is certain', 'هذا ١ فهو مؤكد'], ['Toss to check', 'ارمِ لتتحقق']] }; },
    explain: [['Why is "both" never more likely than "one"?', 'لماذا لا يكون «كلاهما» أرجح من «أحدهما»؟'], ['For both, the first must happen and then the second as well.', 'للاثنين يجب أن يقع الأول ثم الثاني.'], ['It can be more likely.', 'قد يكون أرجح.'], ['Because numbers go down.', 'لأن الأعداد تنقص.']]
  });

  teach('m8.scatter', {
    why: ['Does studying longer raise marks? Scatter graphs show whether two things move together.', 'هل تزيد الدراسة الدرجات؟ الرسوم المبعثرة تُظهر هل يتحرك الشيئان معًا.'],
    idea: [{ p: ['Each dot is one pair of values. Dots rising to the right show positive correlation.', 'كل نقطة زوج قيم. النقاط الصاعدة يمينًا ارتباط موجب.'], dia: function () { return D.axes({ x: [0, 10], y: [0, 10], every: 2, pts: [[1, 2], [2, 3], [3, 3], [4, 5], [5, 5], [6, 7], [7, 7], [8, 9]] }); } }, ['Together does not mean one causes the other: ice cream and sunburn rise together.', 'الارتباط لا يعني السببية: المثلجات وحروق الشمس يرتفعان معًا.']],
    g: function (r, lv) {
      var m = r.pick([1, -1, 0]), pts = []; for (var i = 1; i <= 8; i++) { var y = m === 1 ? i + r.int(-1, 1) : m === -1 ? 9 - i + r.int(-1, 1) : r.int(1, 9); pts.push([i, Math.max(.5, y)]); }
      var nm = [['Positive', 'موجب'], ['Negative', 'سالب'], ['None', 'لا ارتباط']], right = m === 1 ? 0 : m === -1 ? 1 : 2, others = [0, 1, 2].filter(function (x) { return x !== right; }).map(function (x) { return nm[x]; });
      if (lv < 3) return { q: ['What kind of correlation is shown?', 'ما نوع الارتباط؟'], dia: D.axes({ x: [0, 9], y: [0, 10], every: 2, pts: pts }), o: [nm[right]].concat(others), s: [['Follow the dots left to right', 'تتبع النقاط من اليسار', [right === 0 ? 'They rise' : right === 1 ? 'They fall' : 'No pattern', right === 0 ? 'تصعد' : right === 1 ? 'تهبط' : 'لا نمط']]] };
      var pr = r.pick([[['Hours of study and marks', 'ساعات الدراسة والدرجات'], ['Positive', 'موجب']], [['Temperature and coats sold', 'الحرارة ومبيعات المعاطف'], ['Negative', 'سالب']], [['Shoe size and favourite colour', 'مقاس الحذاء واللون المفضل'], ['None', 'لا ارتباط']]]);
      return { q: ['What correlation would you expect? ' + pr[0][0] + '.', 'ما الارتباط المتوقع؟ ' + pr[0][1] + '.'], o: [pr[1]].concat(nm.filter(function (x) { return x[0] !== pr[1][0]; })), s: [['Think: as one rises, what does the other do?', 'فكّر: إذا زاد أحدهما ماذا يفعل الآخر؟', ['Rises, falls, or no link', 'يزيد أو ينقص أو لا صلة']]] };
    },
    trap: function (r) { return { w: 1, q: ['Ice cream sales and sunburn rise together. One line is wrong. Tap it.', 'تزيد مبيعات المثلجات وحروق الشمس معًا. سطر واحد خاطئ. انقر عليه.'], why: ['Correlation is not cause. Hot weather causes both.', 'الارتباط ليس سببية. الحر يسبب الاثنين.'], l: [['The correlation is positive', 'الارتباط موجب'], ['So ice cream causes sunburn', 'فالمثلجات تسبب الحروق'], ['Hot days bring both', 'الأيام الحارة تجلب الاثنين']] }; },
    explain: [['If two things are correlated, does one cause the other?', 'إذا ارتبط شيئان، هل يسبب أحدهما الآخر؟'], ['Not necessarily. A third cause, or chance, may explain it.', 'ليس بالضرورة. قد يفسره سبب ثالث أو الصدفة.'], ['Yes, always.', 'نعم دائمًا.'], ['Only if the line is steep.', 'فقط إذا كان الخط حادًا.']]
  });

  /* ---------- year 8: number power ---------- */
  teach('d8.pctinc', {
    why: ['Tax added to a price, or a pay rise: this is the percent you will use most as an adult.', 'ضريبة تضاف إلى سعر أو زيادة راتب: هذه النسبة التي ستستخدمها أكثر حين تكبر.'],
    idea: [['Use one multiplication. A 15% rise: × 1.15. A 15% cut: × 0.85.', 'استخدم ضربًا واحدًا. زيادة ١٥٪: × ١٫١٥. وخفض ١٥٪: × ٠٫٨٥.'], ['The multiplier is what is left out of 100%, as a decimal.', 'المضاعف هو ما يبقى من ١٠٠٪ عشريًا.']],
    g: function (r, lv) {
      var T0 = r.int(2, 30) * 20, p = r.pick(lv === 1 ? [10, 20, 30] : [5, 15, 25, 35, 12, 8]), up = lv === 2 ? r.bool() : lv === 1, mult = dp((up ? 100 + p : 100 - p) / 100, 2), ans = dp(T0 * mult, 2);
      if (lv === 3) { var mq = dp(1 - p / 100, 2); return { q: ['Which multiplier takes ' + p + '% off?', 'أي مضاعف يخصم ' + p + '٪؟'], o: TM.same([mq, dp(p / 100, 2), dp(1 + p / 100, 2)]), s: [['What is left', 'ما يبقى', '100 − ' + p + ' =', 100 - p], ['As a decimal', 'عشريًا', (100 - p) + ' ÷ 100 =', mq]] }; }
      return { q: [(up ? 'Increase ' : 'Decrease ') + T0 + ' by ' + p + '%.', (up ? 'زد ' : 'أنقص ') + T0 + ' بنسبة ' + p + '٪.'], eq: T0 + ' × ' + mult, a: ans, s: [['The multiplier', 'المضاعف', (up ? 100 + p : 100 - p) + ' ÷ 100 =', mult], ['Multiply', 'اضرب', T0 + ' × ' + mult + ' =', ans]], miss: [[dp(T0 * p / 100, 2), 'That is the change. Give the new amount.', 'هذا التغير. أعط المقدار الجديد.']] };
    },
    trap: function (r) { var T0 = r.pick([100, 200, 400]); return { eq: T0 + ' − 15%', w: 0, why: ['To remove 15% multiply by 0.85, not 0.15.', 'لخصم ١٥٪ اضرب في ٠٫٨٥ لا ٠٫١٥.'], l: [['Use 0.15: ' + T0 + ' × 0.15 = ' + dp(T0 * .15), 'استخدم ٠٫١٥: ' + T0 + ' × 0.15 = ' + dp(T0 * .15)], 'Answer: ' + dp(T0 * .15), ['So 85% is left', 'فيبقى ٨٥٪']] }; },
    explain: [['What does a multiplier of 1.07 do?', 'ماذا يفعل المضاعف ١٫٠٧؟'], ['Adds 7%.', 'يضيف ٧٪.'], ['Takes off 7%.', 'يخصم ٧٪.'], ['Adds 1.07.', 'يضيف ١٫٠٧.']]
  });

  teach('d8.pctchange', {
    why: ['Did your marks improve? By how much? News figures are percent changes, so learn to check them.', 'هل تحسنت درجاتك؟ بكم؟ أرقام الأخبار نسب تغير فتعلّم فحصها.'],
    idea: [['Percent change = change ÷ original × 100. From 40 to 50: 10 ÷ 40 = 25%.', 'نسبة التغير = التغير ÷ الأصل × ١٠٠. من ٤٠ إلى ٥٠: ١٠ ÷ ٤٠ = ٢٥٪.'], ['Always divide by the original, not the new number.', 'اقسم دائمًا على الأصل لا الجديد.']],
    g: function (r, lv) {
      var o = r.pick([20, 25, 40, 50, 80, 100, 200, 250]), p = r.pick([10, 20, 25, 50, 60]), ch = o * p / 100, down = lv > 1 && r.bool(), n = down ? o - ch : o + ch, q = lv === 3 ? ['A shop sold ' + o + ' items last month and ' + n + ' this month. What is the percent change? Use a minus sign for a fall.', 'باع متجر ' + o + ' قطعة الشهر الماضي و' + n + ' هذا الشهر. ما نسبة التغير؟ استخدم السالب للانخفاض.'] : ['Find the percent ' + (down ? 'decrease' : 'increase') + ' from ' + o + ' to ' + n + '. Type the number only.', 'أوجد نسبة ' + (down ? 'الانخفاض' : 'الزيادة') + ' من ' + o + ' إلى ' + n + '. اكتب العدد فقط.'], a = lv === 3 && down ? -p : p;
      return { q: q, eq: ch + ' ÷ ' + o + ' × 100', a: a, s: [['The change', 'التغير', (down ? o + ' − ' + n : n + ' − ' + o) + ' =', ch], ['Over the original', 'على الأصل', ch + ' ÷ ' + o + ' =', dp(ch / o, 4)], ['× 100', '× ١٠٠', dp(ch / o, 4) + ' × 100 =', p]].concat(a < 0 ? [['A fall is negative', 'الانخفاض سالب', 'Answer:', mn(a)]] : []), miss: [[dp(ch / n * 100, 2), 'You divided by the new number. Use the original.', 'قسمت على الجديد. استخدم الأصل.'], [ch, 'That is the change itself. Turn it into a percent.', 'هذا التغير. حوّله إلى نسبة.']] };
    },
    trap: function (r) { var o = r.pick([40, 80, 200]), n = o * 1.25; return { eq: o + ' → ' + n, w: 1, why: ['Divide by the original: ' + (n - o) + ' ÷ ' + o + ' = 25%.', 'اقسم على الأصل: ' + (n - o) + ' ÷ ' + o + ' = ٢٥٪.'], l: [n + ' − ' + o + ' = ' + (n - o), ['Divide by new: ' + (n - o) + ' ÷ ' + n + ' = 0.2', 'اقسم على الجديد: ' + (n - o) + ' ÷ ' + n + ' = 0.2'], 'Answer: 20%'] }; },
    explain: [['A price rises 25% then falls 25%. Back to where it was?', 'زاد سعر ٢٥٪ ثم نقص ٢٥٪. هل عاد كما كان؟'], ['No: the fall is from a bigger number, so it ends lower.', 'لا: النقص من عدد أكبر فينتهي أقل.'], ['Yes.', 'نعم.'], ['It ends higher.', 'ينتهي أعلى.']]
  });

  teach('d8.ordfrac', {
    why: ['Recipes and measurements come in mixed numbers. Exams always test them.', 'الوصفات والقياسات بأعداد كسرية، والامتحانات تختبرها دائمًا.'],
    idea: [['Change mixed numbers to improper fractions first. Then use the normal rule.', 'حوّل الأعداد الكسرية إلى كسور غير حقيقية أولًا، ثم استخدم القاعدة المعتادة.'], ['1 1/2 × 2 1/3 = 3/2 × 7/3 = 21/6 = 7/2.', '١ و١/٢ × ٢ و١/٣ = ٣/٢ × ٧/٣ = ٢١/٦ = ٧/٢.']],
    g: function (r, lv) {
      var w1 = r.int(1, 4), w2 = r.int(1, 4), d1 = r.pick([2, 3, 4, 5]), d2 = r.pick([2, 3, 4]), n1 = r.int(1, d1 - 1), n2 = r.int(1, d2 - 1), i1 = w1 * d1 + n1, i2 = w2 * d2 + n2, m1 = w1 + ' ' + n1 + '/' + d1, m2 = w2 + ' ' + n2 + '/' + d2;
      if (lv === 1) return { q: ['Change to an improper fraction. Type the top number.', 'حوّل إلى كسر غير حقيقي. اكتب البسط.'], eq: m1 + ' = ?/' + d1, a: i1, s: [['Wholes × bottom', 'الصحيح × المقام', w1 + ' × ' + d1 + ' =', w1 * d1], ['Add the top', 'أضف البسط', (w1 * d1) + ' + ' + n1 + ' =', i1]] };
      var L = TM.lcm(d1, d2), A = i1 * L / d1, B = i2 * L / d2;
      if (lv === 2) return { q: ['Add. Give an improper fraction in simplest form.', 'اجمع. أعط كسرًا غير حقيقي في أبسط صورة.'], eq: m1 + ' + ' + m2, a: low(A + B, L), s: [['As improper fractions', 'كسور غير حقيقية', i1 + '/' + d1 + ' + ' + i2 + '/' + d2], ['Common bottom', 'مقام مشترك', 'Bottom:', L], ['Add the tops', 'اجمع البسطين', A + ' + ' + B + ' =', A + B], ['Simplify', 'بسّط', (A + B) + '/' + L + ' =', low(A + B, L)]] };
      return { q: ['Multiply. Give an improper fraction in simplest form.', 'اضرب. أعط كسرًا غير حقيقي في أبسط صورة.'], eq: m1 + ' × ' + m2, a: low(i1 * i2, d1 * d2), s: [['As improper fractions', 'كسور غير حقيقية', i1 + '/' + d1 + ' × ' + i2 + '/' + d2], ['Tops', 'البسطان', i1 + ' × ' + i2 + ' =', i1 * i2], ['Bottoms', 'المقامان', d1 + ' × ' + d2 + ' =', d1 * d2], ['Simplify', 'بسّط', (i1 * i2) + '/' + (d1 * d2) + ' =', low(i1 * i2, d1 * d2)]], miss: [[low((w1 * w2) * d1 * d2 + n1 * n2, d1 * d2), 'You cannot multiply wholes and fractions separately. Make them improper first.', 'لا تضرب الصحيح والكسر منفصلين. حوّلهما أولًا.']] };
    },
    trap: function (r) { return { eq: '1 1/2 × 2 1/2', w: 0, why: ['Make them improper first: 3/2 × 5/2 = 15/4.', 'حوّلهما أولًا: ٣/٢ × ٥/٢ = ١٥/٤.'], l: [['1 × 2 = 2 and 1/2 × 1/2 = 1/4', '١ × ٢ = ٢ و١/٢ × ١/٢ = ١/٤'], ['So 2 and 1/4', 'إذن ٢ و١/٤'], ['That is 9/4', 'هذا ٩/٤']] }; },
    explain: [['Why not multiply the whole parts and the fraction parts?', 'لماذا لا نضرب الصحيح والكسر منفصلين؟'], ['You would miss pieces: each part must multiply each other part, like the box method.', 'تفوتك قطع: كل جزء يضرب كل جزء، كطريقة المربعات.'], ['It is too slow.', 'بطيء جدًا.'], ['You can.', 'يمكن ذلك.']]
  });

  teach('d8.ratio3', {
    why: ['Three partners, three shares. The same method grows with no extra effort.', 'ثلاثة شركاء وثلاثة أنصبة. الطريقة نفسها تتسع دون جهد إضافي.'],
    idea: [{ p: ['Add all the parts, find one part, then multiply for each share.', 'اجمع كل الأجزاء، وأوجد الجزء الواحد، ثم اضرب لكل نصيب.'], dia: function () { return D.bar([2, 3, 5]); } }, ['They must add back to the total. Use that to check every time.', 'يجب أن يعود المجموع إلى الكل. استخدم هذا للتحقق دائمًا.']],
    g: function (r, lv) {
      var a = r.int(1, 4), b = r.int(1, 5), c = r.int(1, 6), u = r.int(2, lv === 1 ? 6 : 25), P = a + b + c, T0 = P * u, pick = r.int(0, 2), vals = [a, b, c], names = [['first', 'الأول'], ['second', 'الثاني'], ['third', 'الثالث']], who = vals[pick];
      if (lv === 3) { if (a === b) a = b + 1; var dd = Math.abs(a - b), big = dd * u; return { q: ['Shared in the ratio ' + a + ' : ' + b + ' : ' + c + ', the first two shares differ by ' + big + '. What is one part worth?', 'قُسم بنسبة ' + a + ' : ' + b + ' : ' + c + '، والفرق بين النصيبين الأولين ' + big + '. كم قيمة الجزء الواحد؟'], a: u, s: [['The difference in parts', 'الفرق بالأجزاء', Math.max(a, b) + ' − ' + Math.min(a, b) + ' =', dd], ['That difference is ' + big, 'هذا الفرق ' + big, big + ' ÷ ' + dd + ' =', u]] }; }
      return { q: ['Share ' + T0 + ' in the ratio ' + a + ' : ' + b + ' : ' + c + '. What is the ' + names[pick][0] + ' share?', 'اقسم ' + T0 + ' بنسبة ' + a + ' : ' + b + ' : ' + c + '. كم النصيب ' + names[pick][1] + '؟'], dia: D.bar([a, b, c]), a: who * u, s: [['All the parts', 'كل الأجزاء', a + ' + ' + b + ' + ' + c + ' =', P], ['One part', 'الجزء الواحد', T0 + ' ÷ ' + P + ' =', u], ['This share', 'هذا النصيب', who + ' × ' + u + ' =', who * u]], miss: [[u, 'That is one part. This share has ' + who + ' parts.', 'هذا جزء واحد، ولهذا النصيب ' + who + ' أجزاء.']] };
    },
    trap: function (r) { var u = r.int(2, 8); return { w: 0, q: ['Share ' + (6 * u) + ' in the ratio 1 : 2 : 3. One line is wrong. Tap it.', 'اقسم ' + (6 * u) + ' بنسبة ١ : ٢ : ٣. سطر واحد خاطئ. انقر عليه.'], why: ['Add the parts: 1 + 2 + 3 = 6, not 3.', 'اجمع الأجزاء: ١ + ٢ + ٣ = ٦ لا ٣.'], l: [['Divide by 3: ' + (6 * u) + ' ÷ 3 = ' + (2 * u), 'اقسم على ٣: ' + (6 * u) + ' ÷ 3 = ' + (2 * u)], '1 × ' + (2 * u) + ' = ' + (2 * u), ['Check: do they add back?', 'تحقق: هل يعود المجموع؟']] }; },
    explain: [['In 2 : 3 : 5, what fraction is the largest share?', 'في ٢ : ٣ : ٥، ما كسر النصيب الأكبر؟'], ['5/10, one half.', '٥/١٠، أي النصف.'], ['5/3.', '٥/٣.'], ['1/5.', '١/٥.']]
  });

  teach('d8.units', {
    why: ['Density of a metal, speed of a car, the price per litre: these all combine two units.', 'كثافة المعدن وسرعة السيارة وسعر اللتر: كلها تجمع وحدتين.'],
    idea: [['Compound units have "per": km/h, g/cm³. The unit tells you the calculation: g/cm³ is grams ÷ cm³.', 'الوحدات المركبة فيها «لكل»: كم/س، غ/سم³. والوحدة تخبرك بالحساب: غ/سم³ هي غرام ÷ سم³.'], ['To convert km/h to m/s, multiply by 1000 and divide by 3600.', 'لتحويل كم/س إلى م/ث اضرب في ١٠٠٠ واقسم على ٣٦٠٠.']],
    g: function (r, lv) {
      if (lv === 1) { var v = r.int(2, 12), t = r.int(2, 9); return { q: ['A tap fills ' + (v * t) + ' litres in ' + t + ' minutes. What is the rate, in litres per minute?', 'يملأ صنبور ' + (v * t) + ' لترًا في ' + t + ' دقائق. كم المعدل باللتر في الدقيقة؟'], eq: (v * t) + ' ÷ ' + t, a: v, s: [['Litres ÷ minutes', 'اللتر ÷ الدقيقة', (v * t) + ' ÷ ' + t + ' =', v]], miss: [[v * t * t, 'Per means divide.', '«لكل» تعني القسمة.']] }; }
      if (lv === 2) { var den = r.pick([2, 3, 5, 8, 10]), vol = r.int(2, 20); return { q: ['A metal has density ' + den + ' g/cm³. What is the mass of ' + vol + ' cm³, in g?', 'كثافة معدن ' + den + ' غ/سم³. كم كتلة ' + vol + ' سم³ بالغرام؟'], eq: den + ' × ' + vol, a: den * vol, s: [['Density × volume', 'الكثافة × الحجم', den + ' × ' + vol + ' =', den * vol]], miss: [[dp(vol / den, 3), 'Each cm³ weighs ' + den + ' g, so multiply.', 'كل سم³ يزن ' + den + ' غ، فاضرب.']] }; }
      var k = r.pick([18, 36, 54, 72, 90, 108]);
      return { q: ['Convert ' + k + ' km/h to m/s.', 'حوّل ' + k + ' كم/س إلى م/ث.'], eq: k + ' × 1000 ÷ 3600', a: k / 3.6, s: [['Into metres per hour', 'إلى متر في الساعة', k + ' × 1000 =', k * 1000], ['Into metres per second', 'إلى متر في الثانية', (k * 1000) + ' ÷ 3600 =', k / 3.6]], miss: [[k * 3.6, 'm/s numbers are smaller than km/h numbers: divide.', 'أعداد م/ث أصغر من كم/س: اقسم.']] };
    },
    trap: function (r) { return { eq: '72 × 1000 ÷ 3600', w: 1, why: ['There are 3600 seconds in an hour, not 60.', 'في الساعة ٣٦٠٠ ثانية لا ٦٠.'], l: ['72 × 1000 = 72000', ['Divide by 60 for seconds: 1200', 'اقسم على ٦٠ للثواني: ١٢٠٠'], 'Answer: 1200'] }; },
    explain: [['How does the unit g/cm³ help?', 'كيف تساعد وحدة غ/سم³؟'], ['It says exactly what to do: grams divided by cubic centimetres.', 'تقول بالضبط ما تفعل: الغرام مقسومًا على السنتيمتر المكعب.'], ['It only labels the answer.', 'تسمي الناتج فقط.'], ['It does not help.', 'لا تساعد.']]
  });

  teach('d8.estim', {
    why: ['Most calculator errors are typing errors. An estimate catches them in seconds.', 'أغلب أخطاء الآلة الحاسبة أخطاء إدخال، والتقدير يكشفها في ثوانٍ.'],
    idea: [['Round each number to 1 significant figure, then calculate in your head.', 'قرّب كل عدد إلى رقم معنوي واحد ثم احسب ذهنيًا.'], ['48.3 × 6.1 ÷ 0.52 is about 50 × 6 ÷ 0.5 = 600. Dividing by a number below 1 makes it bigger.', '٤٨٫٣ × ٦٫١ ÷ ٠٫٥٢ نحو ٥٠ × ٦ ÷ ٠٫٥ = ٦٠٠. والقسمة على عدد أقل من ١ تكبّر الناتج.']],
    g: function (r, lv) {
      var a = r.int(2, 9) * 10, b = r.int(2, 9), c = r.pick([2, 5, 10]), a1 = dp(a + r.int(-3, 3) + r.int(1, 9) / 10, 2), b1 = dp(b + r.int(-2, 2) / 10, 2);
      if (lv === 1) return { q: ['Round each to 1 significant figure and multiply.', 'قرّب كلًا إلى رقم معنوي واحد ثم اضرب.'], eq: a1 + ' × ' + b1 + ' ≈ ?', a: a * b, s: [['Round', 'قرّب', a1 + ' ≈', a], [null, null, b1 + ' ≈', b], ['Multiply', 'اضرب', a + ' × ' + b + ' =', a * b]] };
      if (lv === 2) { var top = a * b * c, c1 = dp(c + (c > 2 ? r.int(-3, 3) / 10 : r.int(-1, 2) / 10), 2); return { q: ['Estimate by rounding to 1 significant figure.', 'قدّر بالتقريب إلى رقم معنوي واحد.'], eq: dp(top + r.int(1, 9) / 10, 2) + ' ÷ ' + c1 + ' ≈ ?', a: a * b, s: [['Round', 'قرّب', 'Top ≈', top], [null, null, c1 + ' ≈', c], ['Divide', 'اقسم', top + ' ÷ ' + c + ' =', a * b]] }; }
      var sm = r.pick([.2, .5]), sm1 = sm, s0 = dp(sm + .01, 2), T0 = a * b; return { q: ['Estimate. Dividing by a small number makes the answer bigger.', 'قدّر. القسمة على عدد صغير تكبّر الناتج.'], eq: T0 + ' ÷ ' + s0 + ' ≈ ?', a: dp(T0 / sm1, 2), s: [['Round', 'قرّب', s0 + ' ≈', sm1], ['Divide', 'اقسم', T0 + ' ÷ ' + sm1 + ' =', dp(T0 / sm1, 2)]], miss: [[dp(T0 * sm1, 2), 'You multiplied. Dividing by a small number gives a bigger answer.', 'ضربت. القسمة على صغير تكبّر الناتج.']] };
    },
    trap: function (r) { return { eq: '48.3 ÷ 0.52', w: 1, why: ['48.3 ÷ 0.52 is about 50 ÷ 0.5 = 100.', '٤٨٫٣ ÷ ٠٫٥٢ نحو ٥٠ ÷ ٠٫٥ = ١٠٠.'], l: ['48.3 ≈ 50', '50 ÷ 0.5 = 25', 'Estimate: 25'] }; },
    explain: [['Your calculator says 3.2 × 41 = 1312. What should you do?', 'تقول الآلة إن ٣٫٢ × ٤١ = ١٣١٢. ماذا تفعل؟'], ['Estimate: about 3 × 40 = 120, so something was mistyped.', 'قدّر: نحو ٣ × ٤٠ = ١٢٠، فهناك خطأ إدخال.'], ['Trust it, calculators do not err.', 'صدّقها، فالآلة لا تخطئ.'], ['Round it to 1300.', 'قرّبها إلى ١٣٠٠.']]
  });

  /* ---------- year 8: algebra fluency ---------- */
  teach('d8.neginb', {
    why: ['Most algebra slips happen right here: a minus in front of a bracket.', 'أغلب أخطاء الجبر تقع هنا: سالب أمام قوس.'],
    idea: [['A minus in front of a bracket changes every sign inside. −(x − 3) = −x + 3.', 'السالب قبل القوس يغيّر كل الإشارات داخله. −(x − ٣) = −x + ٣.'], ['−2(x + 4) = −2x − 8, and −2(x − 4) = −2x + 8.', '−٢(x + ٤) = −٢x − ٨، و−٢(x − ٤) = −٢x + ٨.']],
    g: function (r, lv) {
      var a = r.int(2, 7), b = r.int(2, 9), c = r.int(2, 9), plus = r.bool();
      if (lv === 1) return { q: ['Open the bracket. What is the number term? Use a minus if negative.', 'افتح القوس. ما الحد العددي؟ استخدم السالب إذا لزم.'], eq: '−' + a + '(x ' + (plus ? '+ ' : '− ') + b + ')', a: plus ? -a * b : a * b, s: [['Multiply −' + a + ' by ' + (plus ? '' : '−') + b, 'اضرب −' + a + ' في ' + (plus ? '' : '−') + b, a + ' × ' + b + ' =', a * b], ['Sign: ' + (plus ? 'different, negative' : 'same, positive'), 'الإشارة: ' + (plus ? 'مختلفة، سالب' : 'متشابهة، موجب'), 'Answer:', mn(plus ? -a * b : a * b)]], miss: [[plus ? a * b : -a * b, 'Right size, wrong sign. The minus outside changes it.', 'المقدار صحيح والإشارة خاطئة. السالب الخارجي يغيّرها.']] };
      if (lv === 2) { var res = plus ? -a * b + c : a * b + c; return { q: ['Open and simplify. Give the number term.', 'افتح وبسّط. أعط الحد العددي.'], eq: c + ' − ' + a + '(x ' + (plus ? '+ ' : '− ') + b + ')', a: res, s: [['Open the bracket', 'افتح القوس', (plus ? '−' : '+') + a + ' × ' + b + ' =', mn(plus ? -a * b : a * b)], ['With the ' + c, 'مع ' + c, c + (plus ? ' − ' : ' + ') + (a * b) + ' =', mn(res)]], miss: [[plus ? a * b + c : c - a * b, 'Check the sign when multiplying by −' + a + '.', 'راجع الإشارة عند الضرب في −' + a + '.']] }; }
      var x = r.int(1, 8), rhs = c - a * (x + b);
      return { q: ['Solve for x.', 'حُلّ لإيجاد x.'], eq: c + ' − ' + a + '(x + ' + b + ') = ' + mn(rhs), a: x, s: [['Take ' + c + ' from both sides', 'اطرح ' + c + ' من الطرفين', mn(rhs) + ' − ' + c + ' =', mn(rhs - c)], ['Divide by −' + a, 'اقسم على −' + a, mn(rhs - c) + ' ÷ −' + a + ' =', x + b], ['Take ' + b + ' away', 'اطرح ' + b, (x + b) + ' − ' + b + ' =', x]] };
    },
    trap: function (r) { var b = r.int(2, 9); return { eq: '5 − (x − ' + b + ')', w: 0, why: ['The minus changes both signs: −x + ' + b + '.', 'السالب يغيّر الإشارتين: −x + ' + b + '.'], l: [['Open: 5 − x − ' + b, 'افتح: 5 − x − ' + b], ['Collect: ' + (5 - b) + ' − x', 'اجمع: ' + (5 - b) + ' − x'], ['Answer: ' + (5 - b) + ' − x', 'الناتج: ' + (5 - b) + ' − x']] }; },
    explain: [['What does a minus in front of a bracket really mean?', 'ماذا يعني السالب قبل القوس فعلًا؟'], ['Multiply everything inside by −1.', 'اضرب كل ما بالداخل في −١.'], ['Change only the first sign.', 'غيّر الإشارة الأولى فقط.'], ['Remove the bracket and do nothing.', 'أزل القوس ولا تفعل شيئًا.']]
  });

  teach('d8.fraceq', {
    why: ['Formulas in physics are full of fractions. Clearing them makes everything simple.', 'صيغ الفيزياء مليئة بالكسور، وإزالتها تبسّط كل شيء.'],
    idea: [['Multiply both sides by the bottom to clear the fraction. x/3 = 5 gives x = 15.', 'اضرب الطرفين في المقام لتزيل الكسر. x/٣ = ٥ تعطي x = ١٥.'], ['(x + 2)/4 = 3 gives x + 2 = 12, then x = 10.', '(x + ٢)/٤ = ٣ تعطي x + ٢ = ١٢ ثم x = ١٠.']],
    g: function (r, lv) {
      var d = r.int(2, 9), x = r.int(2, 12) * (lv === 1 ? d : 1), b = r.int(1, 12), v;
      if (lv === 1) return { q: ['Solve for x.', 'حُلّ لإيجاد x.'], eq: 'x/' + d + ' = ' + (x / d), a: x, s: [['Multiply both sides by ' + d, 'اضرب الطرفين في ' + d, (x / d) + ' × ' + d + ' =', x]], miss: [[dp(x / d / d, 4), 'Multiply to undo a divide.', 'اضرب لتعكس القسمة.']] };
      v = r.int(2, 9); var tot = v * d;
      if (lv === 2) return { q: ['Solve for x.', 'حُلّ لإيجاد x.'], eq: '(x + ' + b + ')/' + d + ' = ' + v, a: tot - b, s: [['Clear the bottom', 'أزل المقام', v + ' × ' + d + ' =', tot], ['Take ' + b + ' away', 'اطرح ' + b, tot + ' − ' + b + ' =', tot - b]], miss: [[dp(v - b / d, 4), 'Clear the fraction first, then take away.', 'أزل الكسر أولًا ثم اطرح.']] };
      var m = r.int(2, 5), xx = r.int(2, 9), lhs = m * xx + b, dd = r.int(2, 5), res = lhs * dd;
      return { q: ['Solve for x.', 'حُلّ لإيجاد x.'], eq: '(' + m + 'x + ' + b + ')/' + dd + ' = ' + lhs + '/' + dd, a: xx, s: [['Same bottoms: match the tops', 'المقامان متساويان: يتساوى البسطان', lhs + ' − ' + b + ' =', m * xx], ['Divide by ' + m, 'اقسم على ' + m, (m * xx) + ' ÷ ' + m + ' =', xx]] };
    },
    trap: function (r) { var d = r.int(3, 6), v = r.int(2, 6), b = r.int(1, 9); return { eq: '(x + ' + b + ')/' + d + ' = ' + v, w: 0, why: ['Clear the bottom first: multiply both sides by ' + d + '.', 'أزل المقام أولًا: اضرب الطرفين في ' + d + '.'], l: [['Take ' + b + ' first: ' + v + ' − ' + b + ' = ' + mn(v - b), 'اطرح ' + b + ' أولًا: ' + v + ' − ' + b + ' = ' + mn(v - b)], ['Then multiply by ' + d, 'ثم اضرب في ' + d], ['x found', 'وُجد x']] }; },
    explain: [['Why multiply by the bottom first?', 'لماذا نضرب في المقام أولًا؟'], ['It removes the fraction, leaving an ordinary equation.', 'يزيل الكسر فتبقى معادلة عادية.'], ['Bottoms are always the biggest number.', 'المقامات أكبر الأعداد.'], ['Order does not matter.', 'لا يهم الترتيب.']]
  });

  teach('d8.brackeq', {
    why: ['Real equations arrive wrapped in brackets. Open, collect, solve: the same three moves.', 'المعادلات الحقيقية تأتي بأقواس. افتح واجمع وحلّ: الخطوات الثلاث نفسها.'],
    idea: [['Open the brackets. Collect x on one side and numbers on the other. Then divide.', 'افتح الأقواس، واجمع x في طرف والأعداد في آخر، ثم اقسم.'], ['3(x + 2) = 21: 3x + 6 = 21, 3x = 15, x = 5. Or divide by 3 first: x + 2 = 7.', '٣(x + ٢) = ٢١: ٣x + ٦ = ٢١ ثم ٣x = ١٥ ثم x = ٥. أو اقسم أولًا: x + ٢ = ٧.']],
    g: function (r, lv) {
      var a = r.int(2, 7), b = r.int(1, 9), x = r.int(1, 10), rhs = a * (x + b);
      if (lv === 1) return { q: ['Solve for x.', 'حُلّ لإيجاد x.'], eq: a + '(x + ' + b + ') = ' + rhs, a: x, s: [['Open the bracket', 'افتح القوس', a + ' × ' + b + ' =', a * b], ['Take that away', 'اطرحه', rhs + ' − ' + (a * b) + ' =', a * x], ['Divide', 'اقسم', (a * x) + ' ÷ ' + a + ' =', x]], miss: [[dp((rhs - b) / a, 4), a + ' multiplies the ' + b + ' too.', a + ' يضرب ' + b + ' أيضًا.']] };
      var c = r.int(2, 6), d = r.int(1, 9);
      if (lv === 2) { var both = a * (x + b) + d; return { q: ['Solve for x.', 'حُلّ لإيجاد x.'], eq: a + '(x + ' + b + ') + ' + d + ' = ' + both, a: x, s: [['Take ' + d + ' away', 'اطرح ' + d, both + ' − ' + d + ' =', rhs], ['Divide by ' + a, 'اقسم على ' + a, rhs + ' ÷ ' + a + ' =', x + b], ['Take ' + b + ' away', 'اطرح ' + b, (x + b) + ' − ' + b + ' =', x]] }; }
      var e = r.int(1, 4), p = a + e; var lhsv = p * (x + 1), rc = lhsv - e * x;
      return { q: ['Solve for x.', 'حُلّ لإيجاد x.'], eq: p + '(x + 1) = ' + e + 'x + ' + rc, a: x, s: [['Open the bracket', 'افتح القوس', p + ' × 1 =', p], ['Move ' + e + 'x across', 'انقل ' + e + 'x', p + ' − ' + e + ' =', p - e], ['Move the numbers', 'انقل الأعداد', rc + ' − ' + p + ' =', rc - p], ['Divide', 'اقسم', (rc - p) + ' ÷ ' + (p - e) + ' =', x]] };
    },
    trap: function (r) { var a = r.int(2, 5), b = r.int(2, 6), x = r.int(2, 7), rhs = a * (x + b); return { eq: a + '(x + ' + b + ') = ' + rhs, w: 0, why: ['Multiply the ' + b + ' too: ' + a + ' × ' + b + ' = ' + (a * b) + '.', 'اضرب ' + b + ' أيضًا: ' + a + ' × ' + b + ' = ' + (a * b) + '.'], l: [['Open: ' + a + 'x + ' + b + ' = ' + rhs, 'افتح: ' + a + 'x + ' + b + ' = ' + rhs], rhs + ' − ' + b + ' = ' + (rhs - b), (rhs - b) + ' ÷ ' + a + ' = ' + dp((rhs - b) / a, 3)] }; },
    explain: [['In 3(x + 2) = 21, why can you divide by 3 first?', 'في ٣(x + ٢) = ٢١، لماذا يمكن القسمة على ٣ أولًا؟'], ['The whole left side is 3 times the bracket, so both sides can be divided.', 'الطرف الأيسر كله ٣ أضعاف القوس فيقبل الطرفان القسمة.'], ['Because 21 is odd.', 'لأن ٢١ فردي.'], ['You cannot.', 'لا يمكن.']]
  });

  teach('d8.form', {
    why: ['Turning words into symbols is the moment maths becomes useful in the real world.', 'تحويل الكلمات إلى رموز هو اللحظة التي تصبح فيها الرياضيات نافعة.'],
    idea: [['Choose a letter for what changes. "Each" usually multiplies, a fixed charge adds.', 'اختر حرفًا لما يتغير. «لكل» غالبًا ضرب، والمبلغ الثابت جمع.'], ['A plumber charges 40 to visit plus 25 an hour: C = 25h + 40.', 'سبّاك يأخذ ٤٠ للزيارة و٢٥ في الساعة: C = ٢٥h + ٤٠.']],
    g: function (r, lv) {
      var a = r.int(2, 30), b = a + r.int(5, 30), n = r.int(2, 12), f1 = 'C = ' + a + 'h + ' + b, f2 = 'C = ' + b + 'h + ' + a, f3 = 'C = ' + (a + b) + 'h';
      if (lv === 1) return { q: ['A plumber charges ' + b + ' to visit plus ' + a + ' per hour. Which formula gives the cost C for h hours?', 'سبّاك يأخذ ' + b + ' للزيارة و' + a + ' في الساعة. أي صيغة تعطي التكلفة C لـ h ساعة؟'], o: [[f1, TM.ltr(f1)], [f2, TM.ltr(f2), 'That charges the visit fee every hour.', 'هذا يأخذ أجرة الزيارة كل ساعة.'], [f3, TM.ltr(f3), 'The visit fee is only paid once.', 'أجرة الزيارة مرة واحدة.']], s: [['Per hour goes with h', '«في الساعة» مع h', a + 'h'], ['Once-only adds', 'المرة الواحدة تُجمع', f1]] };
      if (lv === 2) return { q: ['Use C = ' + a + 'h + ' + b + ' to find the cost for ' + n + ' hours.', 'استخدم C = ' + a + 'h + ' + b + ' لتجد تكلفة ' + n + ' ساعات.'], eq: a + ' × ' + n + ' + ' + b, a: a * n + b, s: [['Hours part', 'جزء الساعات', a + ' × ' + n + ' =', a * n], ['Add the fixed charge', 'أضف الثابت', (a * n) + ' + ' + b + ' =', a * n + b]], miss: [[(a + b) * n, 'The fixed charge is only added once.', 'الثابت يُضاف مرة واحدة.']] };
      var c0 = a * n + b;
      return { q: ['The bill was ' + c0 + ' with C = ' + a + 'h + ' + b + '. How many hours?', 'الفاتورة ' + c0 + ' حسب C = ' + a + 'h + ' + b + '. كم ساعة؟'], eq: a + 'h + ' + b + ' = ' + c0, a: n, s: [['Take the fixed charge off', 'اطرح الثابت', c0 + ' − ' + b + ' =', a * n], ['Divide', 'اقسم', (a * n) + ' ÷ ' + a + ' =', n]], miss: [[dp(c0 / a, 4), 'Take the fixed charge off first.', 'اطرح الثابت أولًا.']] };
    },
    trap: function (r) { var a = r.int(3, 9), b = r.int(10, 20); return { w: 1, q: [b + ' to join, then ' + a + ' per lesson. One line is wrong. Tap it.', b + ' للانضمام ثم ' + a + ' لكل درس. سطر واحد خاطئ. انقر عليه.'], why: ['The ' + a + ' goes with the number of lessons: C = ' + a + 'n + ' + b + '.', a + ' مع عدد الدروس: C = ' + a + 'n + ' + b + '.'], l: [['Let n be the lessons', 'n عدد الدروس'], ['C = ' + b + 'n + ' + a, 'C = ' + b + 'n + ' + a], ['One lesson: ' + (a + b), 'درس واحد: ' + (a + b)]] }; },
    explain: [['In C = 5n + 20, what does 20 stand for?', 'في C = ٥n + ٢٠، ماذا يمثل ٢٠؟'], ['A fixed charge, paid even when n is 0.', 'مبلغ ثابت يُدفع حتى لو n = ٠.'], ['The price of each item.', 'سعر القطعة.'], ['The number of items.', 'عدد القطع.']]
  });

  teach('d8.solveg', {
    why: ['Where two lines cross, both rules are true at once. That is what solving means.', 'حيث يتقاطع خطان تصح القاعدتان معًا، وهذا معنى الحل.'],
    idea: [{ p: ['Draw both lines. The crossing point gives the x and y that fit both equations.', 'ارسم الخطين. نقطة التقاطع تعطي x وy الموافقتين للمعادلتين.'], dia: function () { return D.axes({ x: [0, 6], y: [0, 8], line: [[0, 1], [6, 7]], fn: function (x) { return 7 - x; }, pts: [[3, 4, '(3, 4)']] }); } }, ['Read the x value for the solution. Check it in both equations.', 'اقرأ قيمة x للحل وتحقق منها في المعادلتين.']],
    g: function (r, lv) {
      var x = r.int(1, 5), y = r.int(1, 7), m1 = r.int(1, 2), c1 = y - m1 * x, m2 = -r.int(1, 2), c2 = y - m2 * x, f1 = function (v) { return m1 * v + c1; }, f2 = function (v) { return m2 * v + c2; }, dia = D.axes({ x: [0, 7], y: [-2, 12], step: 2, fn: f1, line: [[0, c2], [7, m2 * 7 + c2]], pts: [[x, y]] }), e1 = 'y = ' + m1 + 'x ' + TM.sg(c1), e2 = 'y = −' + (-m2) + 'x ' + TM.sg(c2);
      if (lv === 1) return { q: ['Read the crossing point. What is x there?', 'اقرأ نقطة التقاطع. ما قيمة x؟'], dia: dia, a: x, s: [['Look straight down from the crossing', 'انظر إلى الأسفل من التقاطع', 'Answer:', x]], miss: [[y, 'That is the y value. x is along the bottom.', 'هذه قيمة y. وx على المحور الأفقي.']] };
      if (lv === 2) return { q: ['Read the crossing point. What is y there?', 'اقرأ نقطة التقاطع. ما قيمة y؟'], dia: dia, a: y, s: [['Look across from the crossing', 'انظر أفقيًا من التقاطع', 'Answer:', y]], miss: [[x, 'That is the x value. y is up the side.', 'هذه قيمة x. وy على المحور الرأسي.']] };
      return { q: ['Without drawing: where do these lines cross? Give x.', 'دون رسم: أين يتقاطع الخطان؟ أعط x.'], eq: e1 + ' ,  ' + e2, a: x, s: [['At the crossing, y is equal in both', 'عند التقاطع تتساوى y', (m1 - m2) + 'x = ' + (c2 - c1)], ['Divide', 'اقسم', (c2 - c1) + ' ÷ ' + (m1 - m2) + ' =', x]] };
    },
    trap: function (r) { return { w: 1, q: ['Two lines cross at (3, 4). One line is wrong. Tap it.', 'خطان يتقاطعان عند (٣، ٤). سطر واحد خاطئ. انقر عليه.'], why: ['The crossing is on both lines, so both equations hold there.', 'التقاطع على الخطين فتصح المعادلتان عنده.'], l: [['x = 3 and y = 4', 'x = ٣ وy = ٤'], ['It fits only the first equation', 'توافق المعادلة الأولى فقط'], ['It is the only such point', 'هي النقطة الوحيدة']] }; },
    explain: [['What if two lines never cross?', 'ماذا لو لم يتقاطع خطان أبدًا؟'], ['They are parallel, and no x and y fit both.', 'هما متوازيان ولا توجد x وy توافقان.'], ['They cross far away, always.', 'يتقاطعان بعيدًا دائمًا.'], ['Every point fits.', 'كل نقطة توافق.']]
  });

  /* ---------- shape, graphs and number sense ---------- */
  teach('x8m.poly', {
    why: ['Why do hexagons fill a bee\'s comb but pentagons leave gaps? The exterior angle explains it.', 'لماذا تملأ السداسيات خلية النحل وتترك الخماسيات فراغات؟ الزاوية الخارجية تفسّر ذلك.'],
    idea: [{ p: ['The exterior angles of any polygon add to 360°: walk round it and you turn once.', 'الزوايا الخارجية لأي مضلع مجموعها ٣٦٠°: طف حوله تدور مرة.'], dia: function () { return D.poly(8); } }, ['A regular shape: exterior = 360 ÷ n, interior = 180 − exterior.', 'المنتظم: الخارجية = ٣٦٠ ÷ n، والداخلية = ١٨٠ − الخارجية.']],
    g: function (r, lv) {
      var n = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]), ext = 360 / n, intA = 180 - ext;
      if (lv === 1) return { q: ['Find the exterior angle of a regular shape with ' + n + ' sides.', 'أوجد الزاوية الخارجية لشكل منتظم له ' + n + ' ضلعًا.'], dia: D.poly(Math.min(n, 12)), eq: '360 ÷ ' + n, a: ext, s: [['One full turn shared out', 'دورة كاملة مقسومة', '360 ÷ ' + n + ' =', ext]], miss: [[intA, 'That is the interior angle.', 'هذه الزاوية الداخلية.']] };
      if (lv === 2) return { q: ['Find the interior angle of a regular shape with ' + n + ' sides.', 'أوجد الزاوية الداخلية لشكل منتظم له ' + n + ' ضلعًا.'], dia: D.poly(Math.min(n, 12)), a: intA, s: [['Exterior', 'الخارجية', '360 ÷ ' + n + ' =', ext], ['Interior', 'الداخلية', '180 − ' + ext + ' =', intA]], miss: [[ext, 'That is the exterior. Interior is 180° minus it.', 'هذه الخارجية. الداخلية ١٨٠° ناقصها.']] };
      return { q: ['A regular polygon has an interior angle of ' + intA + '°. How many sides does it have?', 'مضلع منتظم زاويته الداخلية ' + intA + '°. كم عدد أضلاعه؟'], a: n, s: [['Exterior first', 'الخارجية أولًا', '180 − ' + intA + ' =', ext], ['How many fit in 360°?', 'كم تدخل في ٣٦٠°؟', '360 ÷ ' + ext + ' =', n]], miss: [[dp(360 / intA, 3), 'Use the exterior angle, not the interior.', 'استخدم الخارجية لا الداخلية.']] };
    },
    trap: function (r) { return { w: 1, q: ['A regular hexagon. One line is wrong. Tap it.', 'سداسي منتظم. سطر واحد خاطئ. انقر عليه.'], why: ['Interior = 180 − 60 = 120.', 'الداخلية = ١٨٠ − ٦٠ = ١٢٠.'], l: ['360 ÷ 6 = 60', '180 − 60 = 60', 'Sum: 6 × 120 = 720'] }; },
    explain: [['Why do regular hexagons tile a floor without gaps?', 'لماذا تغطي السداسيات المنتظمة الأرض دون فراغات؟'], ['Three angles of 120° meet to make exactly 360°.', 'ثلاث زوايا ١٢٠° تكوّن ٣٦٠° تمامًا.'], ['They have many sides.', 'أضلاعها كثيرة.'], ['Any shape can do that.', 'كل شكل يستطيع.']]
  });

  teach('x8m.parallel', {
    why: ['Reasoning with angles is the first real proof you will write.', 'الاستدلال بالزوايا أول برهان حقيقي تكتبه.'],
    idea: [{ p: ['State a reason for every step: "alternate angles", "angles on a line". The reason earns the marks.', 'اذكر سببًا لكل خطوة: «زوايا متبادلة»، «زوايا على خط». السبب يكسب الدرجة.'], dia: function () { return D.angle('par', ['70°', null, null, null, 'x', null]); } }, ['Build a chain: from the angle you know to the one you want.', 'كوّن سلسلة: من الزاوية المعلومة إلى المطلوبة.']],
    g: function (r, lv) {
      var a = r.int(35, 140);
      if (lv === 1) return { q: ['Two parallel lines. An angle is ' + a + '°. Find its alternate angle.', 'خطان متوازيان وزاوية ' + a + '°. أوجد المتبادلة معها.'], a: a, s: [['Alternate angles are equal', 'المتبادلتان متساويتان', 'Angle:', a]], miss: [[180 - a, 'Alternate angles are equal.', 'المتبادلتان متساويتان.']] };
      if (lv === 2) return { q: ['Two parallel lines. An angle is ' + a + '°. Find the interior angle on the same side.', 'خطان متوازيان وزاوية ' + a + '°. أوجد الداخلية في الجهة نفسها.'], a: 180 - a, s: [['Interior angles add to 180°', 'الداخليتان مجموعهما ١٨٠°', '180 − ' + a + ' =', 180 - a]], miss: [[a, 'Interior angles are not equal; they add to 180°.', 'الداخليتان غير متساويتين، ومجموعهما ١٨٠°.']] };
      var b = r.int(25, 65), c = r.int(25, 65);
      return { q: ['A triangle sits between two parallels. Its base angles are ' + b + '° and ' + c + '°, equal to alternate angles at the top. Find the top angle of the triangle.', 'مثلث بين خطين متوازيين، زاويتا قاعدته ' + b + '° و' + c + '°. أوجد زاوية رأسه.'], a: 180 - b - c, s: [['Alternate angles move them to the top', 'المتبادلتان تنقلانهما إلى الأعلى', b + ' + ' + c + ' =', b + c], ['A straight line is 180°', 'الخط المستقيم ١٨٠°', '180 − ' + (b + c) + ' =', 180 - b - c]] };
    },
    trap: function (r) { var a = r.int(50, 80); return { w: 1, q: ['Angle ' + a + '°, two parallels. One line is wrong. Tap it.', 'زاوية ' + a + '° وخطان متوازيان. سطر واحد خاطئ. انقر عليه.'], why: ['Corresponding angles are equal: ' + a + '°.', 'المتناظرتان متساويتان: ' + a + '°.'], l: [['Alternate: ' + a + '°', 'متبادلة: ' + a + '°'], ['Corresponding: ' + (180 - a) + '°', 'متناظرة: ' + (180 - a) + '°'], ['Interior: ' + (180 - a) + '°', 'داخلية: ' + (180 - a) + '°']] }; },
    explain: [['Why does a proof need reasons, not only numbers?', 'لماذا يحتاج البرهان إلى أسباب لا أعداد فقط؟'], ['A reason shows it must be true for every such shape.', 'السبب يبيّن صحته لكل شكل مماثل.'], ['It uses more of the page.', 'يملأ الصفحة.'], ['Numbers are unreliable.', 'الأعداد غير موثوقة.']]
  });

  teach('x8m.area', {
    why: ['Real plots of land are never neat rectangles. Split them into shapes you know.', 'قطع الأرض الحقيقية ليست مستطيلات مرتبة، فقسّمها إلى أشكال تعرفها.'],
    idea: [{ p: ['Cut the shape into rectangles and triangles, or take a small shape away from a big one.', 'قسّم الشكل إلى مستطيلات ومثلثات، أو اطرح شكلًا صغيرًا من كبير.'], dia: function () { return D.lshape(10, 8, 4, 3); } }, ['A trapezium is (a + b) ÷ 2 × h: the mean width times the height.', 'شبه المنحرف (a + b) ÷ ٢ × h: متوسط العرض × الارتفاع.']],
    g: function (r, lv) {
      var a = r.int(8, 15), b = r.int(6, 12), c = r.int(2, 5), d = r.int(2, 4);
      if (lv === 1) return { q: ['Find the area of this L shape.', 'أوجد مساحة هذا الشكل.'], dia: D.lshape(a, b, c, d), a: a * b - c * d, s: [['The whole rectangle', 'المستطيل كله', a + ' × ' + b + ' =', a * b], ['The missing corner', 'الركن الناقص', c + ' × ' + d + ' =', c * d], ['Take it off', 'اطرحه', (a * b) + ' − ' + (c * d) + ' =', a * b - c * d]], miss: [[2 * (a + b), 'That is the perimeter of the rectangle.', 'هذا محيط المستطيل.'], [a * b, 'The corner is missing.', 'الركن مقطوع.']] };
      var t1 = 2 * r.int(2, 6), t2 = t1 + 2 * r.int(1, 4), h = r.int(2, 9), tr = (t1 + t2) / 2 * h;
      if (lv === 2) return { q: ['A trapezium has parallel sides ' + t1 + ' and ' + t2 + ', and height ' + h + '. Find its area.', 'شبه منحرف ضلعاه المتوازيان ' + t1 + ' و' + t2 + ' وارتفاعه ' + h + '. أوجد مساحته.'], eq: '(' + t1 + ' + ' + t2 + ') ÷ 2 × ' + h, a: tr, s: [['Mean width', 'متوسط العرض', '(' + t1 + ' + ' + t2 + ') ÷ 2 =', (t1 + t2) / 2], ['× height', '× الارتفاع', ((t1 + t2) / 2) + ' × ' + h + ' =', tr]], miss: [[(t1 + t2) * h, 'You forgot to halve.', 'نسيت القسمة على ٢.']] };
      var w = r.int(6, 12), l = r.int(8, 15), p = r.int(1, 2), cost = r.int(2, 9), A0 = w * l;
      return { q: ['A floor of ' + w + ' m by ' + l + ' m is tiled at ' + cost + ' per m². What is the total cost?', 'أرضية ' + w + ' م × ' + l + ' م بتكلفة ' + cost + ' لكل م². كم التكلفة الكلية؟'], a: A0 * cost, s: [['The area', 'المساحة', w + ' × ' + l + ' =', A0], ['× the rate', '× السعر', A0 + ' × ' + cost + ' =', A0 * cost]] };
    },
    trap: function (r) { var a = r.int(3, 6) * 2, b = a + 2, h = r.int(3, 7); return { eq: '(' + a + ' + ' + b + ') ÷ 2 × ' + h, w: 0, why: ['Add the parallel sides first, then halve: (' + a + ' + ' + b + ') ÷ 2 = ' + ((a + b) / 2) + '.', 'اجمع المتوازيين أولًا ثم نصّف: (' + a + ' + ' + b + ') ÷ ٢ = ' + ((a + b) / 2) + '.'], l: [['Halve only one: ' + a + ' + ' + b + ' ÷ 2 = ' + (a + b / 2), 'نصّف واحدًا فقط: ' + a + ' + ' + b + ' ÷ 2 = ' + (a + b / 2)], (a + b / 2) + ' × ' + h + ' = ' + ((a + b / 2) * h), ['Area in square units', 'المساحة بوحدات مربعة']] }; },
    explain: [['Why does taking a small shape away often beat adding pieces?', 'لماذا طرح شكل صغير قد يفضل جمع القطع؟'], ['It takes fewer steps, and fewer steps means fewer errors.', 'خطواته أقل فالأخطاء أقل.'], ['It always gives a bigger answer.', 'يعطي ناتجًا أكبر دائمًا.'], ['It is required by rule.', 'مفروض بقاعدة.']]
  });

  teach('x8m.trans', {
    why: ['Enlargement is how a photograph, a map and a mosque plan change size without changing shape.', 'التكبير هو ما يغيّر حجم الصورة والخريطة ومخطط المسجد دون تغيير الشكل.'],
    idea: [{ p: ['An enlargement multiplies every distance from the centre by the scale factor. (2, 3) with factor 2 from the origin goes to (4, 6).', 'التكبير يضرب كل مسافة من المركز في عامل. (٢، ٣) بعامل ٢ من الأصل تذهب إلى (٤، ٦).'], dia: function () { return D.axes({ x: [0, 7], y: [0, 7], pts: [[2, 3, 'A'], [4, 6, 'B']], line: [[0, 0], [4.67, 7]] }); } }, ['Reflection in y = x swaps the two numbers. A 180° turn about the origin changes both signs.', 'الانعكاس في y = x يبدّل العددين، ودوران ١٨٠° حول الأصل يغيّر الإشارتين.']],
    g: function (r, lv) {
      var x = r.int(1, 5), y = r.int(1, 5), k = r.int(2, 4), W = function (a, b) { return '(' + mn(a) + ', ' + mn(b) + ')'; };
      if (x === y) y = x === 5 ? 4 : x + 1;
      if (lv === 1) return { q: ['Enlarge ' + W(x, y) + ' by scale factor ' + k + ' from the origin. What is the new x number?', 'كبّر ' + TM.ltr(W(x, y)) + ' بعامل ' + k + ' من الأصل. ما العدد الأفقي الجديد؟'], eq: x + ' × ' + k, a: x * k, s: [['Multiply the distance', 'اضرب المسافة', x + ' × ' + k + ' =', x * k]], miss: [[x + k, 'Enlarging multiplies, it does not add.', 'التكبير ضرب لا جمع.']] };
      if (lv === 2) { var Rr = W(y, x); return { q: ['Reflect ' + W(x, y) + ' in the line y = x.', 'اعكس ' + TM.ltr(W(x, y)) + ' في الخط y = x.'], o: [[Rr, TM.ltr(Rr)], [W(-x, y), TM.ltr(W(-x, y)), 'That is a reflection in the y axis.', 'هذا انعكاس في محور y.'], [W(x, -y), TM.ltr(W(x, -y)), 'That is a reflection in the x axis.', 'هذا انعكاس في محور x.']], s: [['y = x swaps the numbers', 'y = x يبدّل العددين', Rr]] }; }
      var Rr2 = W(-x, -y);
      return { q: ['Rotate ' + W(x, y) + ' by 180° about the origin.', 'أدر ' + TM.ltr(W(x, y)) + ' ١٨٠° حول الأصل.'], o: [[Rr2, TM.ltr(Rr2)], [W(y, x), TM.ltr(W(y, x)), 'That is a reflection, not a turn.', 'هذا انعكاس لا دوران.'], [W(-y, x), TM.ltr(W(-y, x)), 'That is a 90° turn.', 'هذا دوران ٩٠°.']], s: [['A half turn changes both signs', 'نصف الدورة يغيّر الإشارتين', Rr2]] };
    },
    trap: function (r) { return { eq: '(2, 3) × 3', w: 1, why: ['Multiply both: (6, 9), not 3 + 3 = 6.', 'اضرب الاثنين: (٦، ٩) لا ٣ + ٣ = ٦.'], l: ['2 × 3 = 6', ['Add 3 to y: 3 + 3 = 6', 'أضف ٣ إلى y: 3 + 3 = 6'], ['The new point is (6, 6)', 'النقطة الجديدة (٦، ٦)']] }; },
    explain: [['What stays the same in an enlargement?', 'ما الذي يبقى ثابتًا في التكبير؟'], ['The angles and the shape.', 'الزوايا والشكل.'], ['The lengths.', 'الأطوال.'], ['The area.', 'المساحة.']]
  });

  teach('x8m.sdt', {
    why: ['A distance-time graph tells the full story of a journey at a single glance.', 'رسم المسافة والزمن يروي قصة الرحلة كلها بنظرة.'],
    idea: [{ p: ['Steeper is faster. A flat part means stopped. The gradient is the speed.', 'الأشد ميلًا أسرع، والأفقي توقف، والميل هو السرعة.'], dia: function () { return D.axes({ x: [0, 6], y: [0, 12], step: 2, polyline: [[0, 0], [2, 8], [3, 8], [5, 12]] }); } }, ['Coming back is a line going down to zero.', 'العودة خط نازل إلى الصفر.']],
    g: function (r, lv) {
      var t = r.int(1, 3), v = r.int(1, 4) * 2, d = v * t, st = r.int(1, 3), t2 = t + st, b = r.int(1, 2), v2 = r.pick([2, 4]), d2 = d + b * v2, pl = [[0, 0], [t, d], [t2, d], [t2 + b, d2]], dia = D.axes({ x: [0, 8], y: [0, 20], step: 2, every: 2, polyline: pl, pts: pl.map(function (q) { return [q[0], q[1]]; }) });
      if (lv === 1) return { q: ['What is the speed in the first part, in km per hour?', 'كم السرعة في الجزء الأول بالكيلومتر في الساعة؟'], dia: dia, a: v, s: [['Distance ÷ time', 'المسافة ÷ الزمن', d + ' ÷ ' + t + ' =', v]], miss: [[d, 'That is the distance. Divide by the time.', 'هذه المسافة. اقسم على الزمن.']] };
      if (lv === 2) return { q: ['For how many hours did it stop?', 'كم ساعة توقف؟'], dia: dia, a: st, s: [['The flat part', 'الجزء الأفقي', t2 + ' − ' + t + ' =', st]], miss: [[d, 'That is the distance. Stopping is measured along the time axis.', 'هذه المسافة. يُقاس التوقف على محور الزمن.']] };
      var totalT = t2 + b; return { q: ['What is the average speed for the whole journey, in km per hour?', 'كم متوسط السرعة للرحلة كلها؟'], dia: dia, eq: d2 + ' ÷ ' + totalT, a: dp(d2 / totalT, 2), s: [['Total distance ÷ total time, including stops', 'المسافة الكلية ÷ الزمن الكلي بما فيه التوقف', d2 + ' ÷ ' + totalT + ' ≈', dp(d2 / totalT, 2)]] };
    },
    trap: function (r) { return { w: 1, q: ['A graph has a steep part, then a flat part. One line is wrong. Tap it.', 'رسم فيه جزء حاد ثم أفقي. سطر واحد خاطئ. انقر عليه.'], why: ['A flat line means not moving: speed 0.', 'الخط الأفقي يعني عدم الحركة: السرعة ٠.'], l: [['Steep: moving fast', 'حاد: حركة سريعة'], ['Flat: moving at a steady speed', 'أفقي: حركة بسرعة ثابتة'], ['Down: coming back', 'نازل: عودة']] }; },
    explain: [['Can a distance-time graph go straight up?', 'هل يمكن أن يصعد رسم المسافة والزمن رأسيًا؟'], ['No. It would mean covering distance in no time at all.', 'لا. يعني قطع مسافة في زمن صفر.'], ['Yes, for fast cars.', 'نعم للسيارات السريعة.'], ['Yes, when stopping.', 'نعم عند التوقف.']]
  });

  teach('x8m.freq', {
    why: ['Surveys come in tables. A mean from a table saves adding the same number many times.', 'تأتي الاستبيانات في جداول، والمتوسط من الجدول يوفر جمع العدد مرارًا.'],
    idea: [['Multiply each value by how often it occurs, add those, then divide by the total frequency.', 'اضرب كل قيمة في تكرارها، واجمع، ثم اقسم على مجموع التكرارات.'], ['Divide by how many people, not by how many rows.', 'اقسم على عدد الأشخاص لا عدد الصفوف.']],
    g: function (r, lv) {
      var vs = [1, 2, 3, 4], fs = vs.map(function () { return r.int(1, 8); }), tot = fs.reduce(function (a, b) { return a + b; }, 0), sum = vs.reduce(function (a, v, i) { return a + v * fs[i]; }, 0), tb = vs.map(function (v, i) { return v + ' × ' + fs[i]; }).join(' + ');
      var hint = vs.map(function (v, i) { return v + ': ' + fs[i]; }).join(' , ');
      if (lv === 1) return { q: ['Value: how many. How many people are in this table altogether?', 'القيمة: العدد. كم شخصًا في هذا الجدول إجمالًا؟'], eq: hint, a: tot, s: [['Add the frequencies', 'اجمع التكرارات', fs.join(' + ') + ' =', tot]], miss: [[sum, 'That is the total of the values. Count people only.', 'هذا مجموع القيم. عُدّ الأشخاص فقط.']] };
      if (lv === 2) return { q: ['Value: how many. What is the total of all the values?', 'القيمة: العدد. ما مجموع القيم كلها؟'], eq: hint, a: sum, s: [['Value × frequency, then add', 'القيمة × التكرار ثم اجمع', tb + ' =', sum]], miss: [[tot, 'That is how many people. Multiply each value by its count.', 'هذا عدد الأشخاص. اضرب كل قيمة في تكرارها.']] };
      return { q: ['Value: how many. Find the mean, to 2 decimal places.', 'القيمة: العدد. أوجد المتوسط إلى منزلتين عشريتين.'], eq: hint, a: dp(sum / tot, 2), s: [['Total of the values', 'مجموع القيم', tb + ' =', sum], ['Total people', 'عدد الأشخاص', fs.join(' + ') + ' =', tot], ['Divide', 'اقسم', sum + ' ÷ ' + tot + ' ≈', dp(sum / tot, 2)]], miss: [[dp(sum / 4, 2), 'You divided by the number of rows. Divide by the number of people.', 'قسمت على عدد الصفوف. اقسم على عدد الأشخاص.']] };
    },
    trap: function (r) { return { eq: '1: 2 , 2: 3 , 3: 5', w: 2, why: ['Divide by the total people, 10, not by the 3 rows.', 'اقسم على عدد الأشخاص ١٠ لا الصفوف الثلاثة.'], l: ['1 × 2 + 2 × 3 + 3 × 5 = 23', '2 + 3 + 5 = 10', '23 ÷ 3 = 2.3', ['Mean 2.3', 'المتوسط ٢٫٣']] }; },
    explain: [['Why multiply each value by how often it occurs?', 'لماذا تضرب كل قيمة في تكرارها؟'], ['It is quick adding: three 4s are 4 + 4 + 4.', 'جمع سريع: ثلاث مرات ٤ هي ٤ + ٤ + ٤.'], ['To make the numbers bigger.', 'لتكبير الأعداد.'], ['The table asks for it.', 'الجدول يطلبه.']]
  });

  teach('x8m.prime', {
    why: ['Prime factors make HCF, LCM and simplifying almost automatic.', 'العوامل الأولية تجعل العامل المشترك والمضاعف والتبسيط شبه آلية.'],
    idea: [['Write each number as a product of primes. The HCF takes the shared primes.', 'اكتب كل عدد حاصل ضرب أعداد أولية. العامل المشترك يأخذ المشترك منها.'], ['60 = 2² × 3 × 5 and 84 = 2² × 3 × 7. HCF = 2² × 3 = 12. A square number has even powers.', '٦٠ = ٢² × ٣ × ٥ و٨٤ = ٢² × ٣ × ٧. العامل المشترك = ٢² × ٣ = ١٢. والعدد المربع أسسه زوجية.']],
    g: function (r, lv) {
      var a = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 48, 60, 72, 84, 90]), b = r.pick([18, 24, 30, 36, 45, 54, 60, 66, 70, 96]); if (a === b) b = a + 6; var h = gcd(a, b), l = a * b / h;
      if (lv === 1) { var ps = [], n = a, f = 2; while (n > 1) { while (n % f === 0) { ps.push(f); n /= f; } f++; } return { q: ['What is the biggest prime factor of ' + a + '?', 'ما أكبر عامل أولي للعدد ' + a + '؟'], eq: String(a), a: ps[ps.length - 1], s: [['Its prime factors', 'عوامله الأولية', ps.join(' × ') + ' =', a], ['The biggest', 'الأكبر', 'Answer:', ps[ps.length - 1]]] }; }
      if (lv === 2) return { q: ['Find the HCF.', 'أوجد العامل المشترك الأكبر.'], eq: a + ' , ' + b, a: h, s: [['Multiply the shared primes', 'اضرب الأعداد الأولية المشتركة', a + ' ÷ ' + h + ' =', a / h], [null, null, b + ' ÷ ' + h + ' =', b / h], ['Nothing else is shared', 'لا شيء آخر مشترك', 'Factor:', h]] };
      return { q: ['Find the LCM.', 'أوجد المضاعف المشترك الأصغر.'], eq: a + ' , ' + b, a: l, s: [['HCF first', 'العامل المشترك أولًا', 'Factor:', h], ['Product ÷ HCF', 'حاصل الضرب ÷ العامل المشترك', a + ' × ' + b + ' ÷ ' + h + ' =', l]], miss: [[a * b, 'A common multiple, but not the lowest: divide by the HCF.', 'مضاعف مشترك لكن ليس الأصغر: اقسم على العامل المشترك.']] };
    },
    trap: function (r) { return { w: 1, eq: '12 , 18', why: ['Divide by the HCF: 12 × 18 ÷ 6 = 36.', 'اقسم على العامل المشترك: ١٢ × ١٨ ÷ ٦ = ٣٦.'], l: ['12 × 18 = 216', ['Divide by the HCF, 2: 108', 'اقسم على العامل المشترك ٢: ١٠٨'], ['So 108 is the lowest', 'إذن ١٠٨ هو الأصغر']] }; },
    explain: [['How do prime factors show that 36 is a square?', 'كيف تبيّن العوامل الأولية أن ٣٦ مربع؟'], ['36 = 2² × 3²: every power is even, so it splits into two equal groups.', '٣٦ = ٢² × ٣²: كل الأسس زوجية فينقسم إلى مجموعتين متساويتين.'], ['It ends in 6.', 'ينتهي بـ ٦.'], ['It is bigger than 25.', 'أكبر من ٢٥.']]
  });
})();
