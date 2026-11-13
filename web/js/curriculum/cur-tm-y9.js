/* Maths taught in full, Year 9. See lesson/teach.js for the shape of a topic. */
(function () {
  'use strict';
  var C = window.C, D = window.Dia, teach = C.teach, TM = C.TM, gcd = TM.gcd, low = TM.low, dp = TM.dp, mn = TM.m, sg = TM.sg;
  var rad = function (d) { return d * Math.PI / 180; };
  var term = function (k, v) { return (k === 1 ? '' : k === -1 ? '−' : mn(k)) + v; };

  /* ---------- algebra with brackets ---------- */
  teach('m9.expand', {
    why: ['Double brackets open the door to quadratics, which describe a thrown ball and a bridge arch.', 'الأقواس المزدوجة تفتح باب المعادلات التربيعية التي تصف الكرة المقذوفة وقوس الجسر.'],
    idea: [{ p: ['Every term in the first bracket multiplies every term in the second. (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6.', 'كل حد في القوس الأول يضرب كل حد في الثاني. (x + ٢)(x + ٣) = x² + ٣x + ٢x + ٦ = x² + ٥x + ٦.'], dia: function () { return D.box(['x', '3'], ['x', '2'], [['x²', '3x'], ['2x', '6']]); } }, ['The middle number is the sum, the last number is the product.', 'العدد الأوسط هو المجموع، والأخير هو الحاصل.']],
    g: function (r, lv) {
      var a = r.int(1, 9) * (lv === 1 ? 1 : r.pick([1, -1])), b = r.int(1, 9) * (lv === 1 ? 1 : r.pick([1, -1])), s = a + b, p = a * b, eq = '(x ' + sg(a) + ')(x ' + sg(b) + ')', dia = D.box(['x', mn(b)], ['x', mn(a)], [['x²', mn(b) + 'x'], [mn(a) + 'x', mn(p)]]);
      if (lv === 3) { var m = r.int(2, 4); return { q: ['Expand. Type the number with x.', 'افتح الأقواس. اكتب العدد مع x.'], eq: '(' + m + 'x ' + sg(a) + ')(x ' + sg(b) + ')', a: m * b + a, s: [['First × first', 'الأول × الأول', m + 'x²'], ['Outer', 'الخارجي', m + ' × ' + mn(b) + ' =', mn(m * b)], ['Inner', 'الداخلي', mn(a) + ' × 1 =', mn(a)], ['Together, the x number', 'معًا، عدد x', mn(m * b) + ' + ' + (a < 0 ? '(' + mn(a) + ')' : a) + ' =', mn(m * b + a)]] }; }
      if (lv === 1) return { q: ['Expand. Type the number that goes with x.', 'افتح الأقواس. اكتب العدد مع x.'], eq: eq, dia: dia, a: s, s: [['Last piece', 'القطعة الأخيرة', a + ' × ' + b + ' =', p], ['The two middle pieces', 'القطعتان الوسطيان', a + ' + ' + b + ' =', s], ['Together', 'معًا', 'x² + ' + s + 'x + ' + p]], miss: [[p, 'That is the last number. x\'s number is the sum.', 'هذا العدد الأخير. عدد x هو المجموع.']] };
      return { q: ['Expand fully.', 'افتح الأقواس تمامًا.'], eq: eq, dia: dia, alg: true, a: ['x^2' + (s === 0 ? '' : (s > 0 ? '+' : '-') + (Math.abs(s) === 1 ? '' : Math.abs(s)) + 'x') + (p > 0 ? '+' : '-') + Math.abs(p)], s: [['The x number', 'عدد x', (a < 0 ? '(' + mn(a) + ')' : a) + ' + ' + (b < 0 ? '(' + mn(b) + ')' : b) + ' =', mn(s)], ['Last', 'الأخير', (a < 0 ? '(' + mn(a) + ')' : a) + ' × ' + (b < 0 ? '(' + mn(b) + ')' : b) + ' =', mn(p)], ['Together', 'معًا', 'x² ' + (s === 0 ? '' : sg(s) + 'x ') + sg(p)]] };
    },
    trap: function (r) { var a = r.int(2, 6), b = r.int(2, 6); return { eq: '(x + ' + a + ')(x + ' + b + ')', w: 0, why: ['You need the middle pieces too. Multiply every part.', 'تحتاج إلى القطعتين الوسطيين أيضًا. اضرب كل جزء.'], l: [['x × x + ' + a + ' × ' + b, 'x × x + ' + a + ' × ' + b], ['= x² + ' + (a * b), '= x² + ' + (a * b)], ['Two pieces only', 'قطعتان فقط']] }; },
    explain: [['Why is (x + 3)² not x² + 9?', 'لماذا (x + ٣)² ليست x² + ٩؟'], ['Two middle pieces are missing: it is x² + 6x + 9.', 'تنقص قطعتان وسطيان: x² + ٦x + ٩.'], ['It is exactly x² + 9.', 'هي x² + ٩ تمامًا.'], ['Because 9 is odd.', 'لأن ٩ فردي.']]
  });

  teach('m9.fquad', {
    why: ['Factorising undoes expanding, and it is the quickest way to solve a quadratic.', 'التحليل عكس فتح الأقواس، وهو أسرع طريق لحل المعادلة التربيعية.'],
    idea: [{ p: ['For x² + 5x + 6, find two numbers that multiply to 6 and add to 5: 2 and 3. So (x + 2)(x + 3).', 'في x² + ٥x + ٦ أوجد عددين حاصل ضربهما ٦ ومجموعهما ٥: ٢ و٣. إذن (x + ٢)(x + ٣).'], dia: function () { return D.box(['x', '3'], ['x', '2'], [['x²', '3x'], ['2x', '6']]); } }, ['Negative last number: the signs differ. Check by expanding back.', 'الحد الأخير السالب: الإشارتان مختلفتان. تحقق بالفتح.']],
    g: function (r, lv) {
      var a = r.int(1, 9) * (lv === 1 ? 1 : r.pick([1, -1])), b = r.int(1, 9) * (lv === 1 ? 1 : r.pick([1, -1])); if (a + b === 0) b += 1; if (b === 0) b = 2; var s = a + b, p = a * b, eq = 'x² ' + sg(s) + 'x ' + sg(p), big = Math.max(a, b), small = Math.min(a, b);
      var alg = ['(x' + (a > 0 ? '+' : '-') + Math.abs(a) + ')(x' + (b > 0 ? '+' : '-') + Math.abs(b) + ')', '(x' + (b > 0 ? '+' : '-') + Math.abs(b) + ')(x' + (a > 0 ? '+' : '-') + Math.abs(a) + ')'];
      if (lv === 3) return { q: ['Factorise.', 'حلّل.'], eq: eq, alg: true, a: alg, s: [['Multiply to ' + mn(p) + ', add to ' + mn(s), 'حاصل ضربهما ' + mn(p) + ' ومجموعهما ' + mn(s), mn(small) + ' and ' + mn(big)], ['Check the sum', 'تحقق من المجموع', (small < 0 ? '(' + mn(small) + ')' : small) + ' + ' + (big < 0 ? '(' + mn(big) + ')' : big) + ' =', mn(s)], ['Write the brackets', 'اكتب القوسين', '(x ' + sg(a) + ')(x ' + sg(b) + ')']] };
      return { q: ['Find the two numbers. They multiply to ' + mn(p) + ' and add to ' + mn(s) + '. Type the bigger one.', 'أوجد العددين: حاصل ضربهما ' + mn(p) + ' ومجموعهما ' + mn(s) + '. اكتب الأكبر.'], eq: eq, a: big, s: [['Try pairs of factors', 'جرّب أزواج العوامل', (small < 0 ? '(' + mn(small) + ')' : small) + ' × ' + (big < 0 ? '(' + mn(big) + ')' : big) + ' =', mn(p)], ['Check the sum', 'تحقق من المجموع', (small < 0 ? '(' + mn(small) + ')' : small) + ' + ' + (big < 0 ? '(' + mn(big) + ')' : big) + ' =', mn(s)], ['The bigger one', 'الأكبر', 'Answer:', mn(big)]], miss: [[small, 'That is the smaller one. Type the bigger.', 'هذا الأصغر. اكتب الأكبر.']] };
    },
    trap: function (r) { return { eq: 'x² + 7x + 12', w: 1, why: ['Add to 7 and multiply to 12: 3 and 4.', 'مجموعهما ٧ وحاصل ضربهما ١٢: ٣ و٤.'], l: ['3 × 4 = 12', ['So (x + 2)(x + 6)', 'إذن (x + 2)(x + 6)'], '3 + 4 = 7'] }; },
    explain: [['Why do the two numbers multiply to the last term?', 'لماذا يكون حاصل ضرب العددين هو الحد الأخير؟'], ['In expanding, the last term came from multiplying them.', 'عند الفتح جاء الحد الأخير من ضربهما.'], ['It is a pattern with no reason.', 'نمط بلا سبب.'], ['Because they are always primes.', 'لأنهما أوليان دائمًا.']]
  });

  teach('m9.solveq', {
    why: ['When does a thrown ball land? The answer is where a quadratic equals zero.', 'متى تسقط الكرة المقذوفة؟ الجواب حيث تساوي المعادلة التربيعية صفرًا.'],
    idea: [{ p: ['If two things multiply to zero, one of them must be zero. (x − 2)(x − 3) = 0 means x = 2 or x = 3.', 'إذا كان حاصل ضرب شيئين صفرًا فأحدهما صفر. (x − ٢)(x − ٣) = ٠ تعني x = ٢ أو x = ٣.'], dia: function () { return D.axes({ x: [-1, 5], y: [-2, 6], fn: function (x) { return (x - 2) * (x - 3); }, pts: [[2, 0, '2'], [3, 0, '3']] }); } }, ['Get zero on one side first, factorise, then read the answers. There are usually two.', 'اجعل طرفًا صفرًا أولًا ثم حلّل واقرأ الحلين، وهما عادةً حلان.']],
    g: function (r, lv) {
      var a = r.int(1, 9), b = r.int(1, 9); if (a === b) b = b === 9 ? 8 : b + 1; var s = -(a + b), p = a * b, big = Math.max(a, b), small = Math.min(a, b);
      if (lv === 1) return { q: ['Solve. Type the bigger answer.', 'حُلّ. اكتب الحل الأكبر.'], eq: '(x − ' + a + ')(x − ' + b + ') = 0', a: big, s: [['First bracket is zero', 'القوس الأول صفر', a + ' − ' + a + ' =', 0], ['Second bracket is zero', 'القوس الثاني صفر', b + ' − ' + b + ' =', 0], ['x is ' + a + ' or ' + b, 'x هي ' + a + ' أو ' + b, 'Answer:', big]], miss: [[-big, 'x − ' + big + ' = 0 means x = +' + big + '.', 'x − ' + big + ' = ٠ تعني x = +' + big + '.']] };
      if (lv === 2) return { q: ['Factorise and solve. Type the bigger answer.', 'حلّل وحلّ. اكتب الحل الأكبر.'], eq: 'x² ' + sg(s) + 'x ' + sg(p) + ' = 0', dia: D.axes({ x: [-1, 11], y: [-10, 15], step: 5, every: 1, fn: function (x) { return (x - a) * (x - b); } }), a: big, s: [['Numbers adding to ' + mn(s) + ', multiplying to ' + p, 'مجموعهما ' + mn(s) + ' وحاصل ضربهما ' + p, '−' + a + ' and −' + b], ['So (x − ' + a + ')(x − ' + b + ') = 0', 'إذن (x − ' + a + ')(x − ' + b + ') = 0', 'Answer:', big]] };
      var c = big * small, k = big + small;
      return { q: ['Move everything to one side, then solve. Type the bigger answer.', 'انقل كل شيء إلى طرف ثم حلّ. اكتب الحل الأكبر.'], eq: 'x² + ' + c + ' = ' + k + 'x', a: big, s: [['Zero on one side', 'صفر في طرف', 'x² − ' + k + 'x + ' + c + ' = 0'], ['Multiply to ' + c + ', add to ' + k, 'حاصل ضربهما ' + c + ' ومجموعهما ' + k, small + ' + ' + big + ' =', k], ['Bigger', 'الأكبر', 'Answer:', big]] };
    },
    trap: function (r) { return { eq: '(x − 2)(x + 5) = 0', w: 1, why: ['x + 5 = 0 gives x = −5, not 5.', 'x + ٥ = ٠ تعطي x = −٥ لا ٥.'], l: [['x − 2 = 0, so x = 2', 'x − 2 = 0 فـ x = 2'], ['x + 5 = 0, so x = 5', 'x + 5 = 0 فـ x = 5'], ['Two answers', 'حلان']] }; },
    explain: [['Why must one side be zero first?', 'لماذا يجب أن يكون طرف صفرًا أولًا؟'], ['Only zero forces one factor to vanish. 2 × 3 = 6 tells you nothing.', 'الصفر وحده يفرض انعدام عامل. ٢ × ٣ = ٦ لا تفيد.'], ['It looks neater.', 'يبدو أرتب.'], ['It does not have to be.', 'لا يلزم.']]
  });

  teach('m9.simul', {
    why: ['Two unknowns need two clues. Pricing, mixtures and electric circuits all give this kind of puzzle.', 'مجهولان يحتاجان إلى قرينتين. التسعير والخلطات والدوائر الكهربائية تعطي هذا اللغز.'],
    idea: [{ p: ['Add or subtract the equations so that one letter disappears. Solve for the other, then substitute back.', 'اجمع المعادلتين أو اطرحهما ليختفي حرف، وحلّ للآخر ثم عوّض.'], dia: function () { return D.axes({ x: [0, 6], y: [0, 8], line: [[0, 7], [6, 1]], fn: function (x) { return x + 1; }, pts: [[3, 4, '(3, 4)']] }); } }, ['x + y = 7 and x − y = 1: add them to get 2x = 8, so x = 4 and y = 3.', 'x + y = ٧ وx − y = ١: اجمعهما ٢x = ٨ فـ x = ٤ وy = ٣.']],
    g: function (r, lv) {
      var x = r.int(1, 9), y = r.int(1, 9), a = lv === 1 ? 1 : r.int(2, 3);
      if (lv === 1) return { q: ['Add the equations to find x.', 'اجمع المعادلتين لتجد x.'], eq: 'x + y = ' + (x + y) + ' ,  x − y = ' + mn(x - y), a: x, s: [['Add: the y terms vanish', 'اجمع: يختفي y', (x + y) + (x - y < 0 ? ' − ' + (y - x) : ' + ' + (x - y)) + ' =', 2 * x], ['2x = ' + (2 * x), '2x = ' + (2 * x), (2 * x) + ' ÷ 2 =', x]], miss: [[y, 'That is y. Adding leaves x.', 'هذا y. الجمع يبقي x.']] };
      if (lv === 2) { var e1 = a * x + y, e2 = x + y; return { q: ['Subtract the equations to find x.', 'اطرح المعادلتين لتجد x.'], eq: a + 'x + y = ' + e1 + ' ,  x + y = ' + e2, a: x, s: [['Subtract: the y terms vanish', 'اطرح: يختفي y', e1 + ' − ' + e2 + ' =', e1 - e2], [(a - 1) + 'x = ' + (e1 - e2), (a - 1) + 'x = ' + (e1 - e2), (e1 - e2) + ' ÷ ' + (a - 1) + ' =', x]] }; }
      var p1 = r.int(2, 9), p2 = r.int(2, 9), A = r.int(2, 5), B = r.int(1, 4); while (A === 1 || A === B) A = r.int(2, 5); var C1 = 1 * p1 + 1 * p2, C2 = A * p1 + B * p2;
      return { q: ['1 pen and 1 book cost ' + C1 + '. ' + A + ' pens and ' + B + ' books cost ' + C2 + '. How much is a pen?', 'قلم وكتاب بـ ' + C1 + '. و' + A + ' أقلام و' + B + ' كتب بـ ' + C2 + '. كم سعر القلم؟'], eq: 'p + b = ' + C1 + ' ,  ' + A + 'p + ' + B + 'b = ' + C2, a: p1, s: [['Multiply the first by ' + B, 'اضرب الأولى في ' + B, B + ' × ' + C1 + ' =', B * C1], ['Subtract to remove b', 'اطرح ليختفي b', C2 + ' − ' + (B * C1) + ' =', mn(C2 - B * C1)], ['Divide by ' + (A - B), 'اقسم على ' + (A - B), mn(C2 - B * C1) + ' ÷ ' + mn(A - B) + ' =', p1]] };
    },
    trap: function (r) { return { eq: 'x + y = 10 ,  x − y = 2', w: 1, why: ['Adding: 10 + 2 = 12, so 2x = 12 and x = 6.', 'بالجمع: ١٠ + ٢ = ١٢ فـ ٢x = ١٢ وx = ٦.'], l: ['10 + 2 = 12', ['2y = 12', '2y = 12'], ['So y = 6 and x = 4', 'إذن y = 6 وx = 4']] }; },
    explain: [['What do the two equations mean on a graph?', 'ماذا تعني المعادلتان على الرسم؟'], ['Two lines. Their solution is the point where they cross.', 'خطان، وحلهما نقطة التقاطع.'], ['Two curves that never meet.', 'منحنيان لا يلتقيان.'], ['Nothing at all.', 'لا شيء.']]
  });

  teach('m9.rearr', {
    why: ['Scientists rearrange one formula many ways instead of memorising three.', 'يعيد العلماء ترتيب الصيغة الواحدة بدل حفظ ثلاث.'],
    idea: [['Treat letters like numbers and undo in reverse order. v = u + at, to get a: v − u = at, then a = (v − u)/t.', 'عامل الحروف كالأعداد واعكس بالترتيب المعكوس. v = u + at، لإيجاد a: v − u = at ثم a = (v − u)/t.'], ['Whatever you do, do to both sides, the whole side.', 'ما تفعله افعله في الطرفين، بالطرف كله.']],
    g: function (r, lv) {
      var pool = lv === 1 ? [['y = x + a', 'x', 'x = y − a', 'x = y + a', 'x = a − y'], ['P = 4s', 's', 's = P/4', 's = 4P', 's = P − 4'], ['A = lw', 'w', 'w = A/l', 'w = Al', 'w = A − l']] : lv === 2 ? [['y = mx + c', 'x', 'x = (y − c)/m', 'x = y/m − c', 'x = (y + c)/m'], ['v = u + at', 'a', 'a = (v − u)/t', 'a = v/t − u', 'a = (v + u)/t'], ['P = 2l + 2w', 'l', 'l = (P − 2w)/2', 'l = P/2 − 2w', 'l = (P + 2w)/2']] : [['A = πr²', 'r', 'r = √(A/π)', 'r = A/(2π)', 'r = √A − π'], ['E = ½mv²', 'v', 'v = √(2E/m)', 'v = 2E/m', 'v = √(E/2m)'], ['s = ut + ½at²', 'u', 'u = (s − ½at²)/t', 'u = s/t − at²', 'u = s − ½at'], ['V = πr²h', 'h', 'h = V/(πr²)', 'h = Vπr²', 'h = V − πr²']], x = r.pick(pool);
      return { q: ['Rearrange ' + TM.ltr(x[0]) + ' to make ' + x[1] + ' the subject.', 'أعد ترتيب ' + TM.ltr(x[0]) + ' لتجعل ' + x[1] + ' موضوع الصيغة.'], o: TM.same([x[2], x[3], x[4]]), s: [['Undo what happens to ' + x[1] + ', last step first', 'اعكس ما يحدث لـ ' + x[1] + '، الأخيرة أولًا', [x[2], x[2]]]] };
    },
    trap: function (r) { return { eq: 'y = 3x + 2', w: 0, why: ['Take away 2 first: y − 2 = 3x.', 'اطرح ٢ أولًا: y − 2 = 3x.'], l: [['y/3 = x + 2', 'y/3 = x + 2'], ['So x = y/3 − 2', 'إذن x = y/3 − 2'], ['Check with y = 8', 'تحقق عند y = 8']] }; },
    explain: [['How can you test a rearranged formula?', 'كيف تختبر صيغة بعد إعادة الترتيب؟'], ['Pick easy numbers and see that both versions agree.', 'اختر أعدادًا سهلة وتحقق من توافق الصيغتين.'], ['See that it looks shorter.', 'انظر هل تبدو أقصر.'], ['There is no test.', 'لا اختبار.']]
  });

  teach('m9.surds', {
    why: ['√2 cannot be written exactly as a decimal. Surds keep answers perfectly exact.', '√٢ لا تُكتب بدقة عشريًا، والجذور تبقي الإجابات دقيقة تمامًا.'],
    idea: [['√a × √b = √(ab). Use it to pull out a square factor: √12 = √4 × √3 = 2√3.', '√a × √b = √(ab). واستخدمها لإخراج عامل مربع: √١٢ = √٤ × √٣ = ٢√٣.'], ['Like surds add, just as like terms do: 2√3 + 5√3 = 7√3.', 'الجذور المتشابهة تُجمع كالحدود: ٢√٣ + ٥√٣ = ٧√٣.']],
    g: function (r, lv) {
      var sq = r.pick([2, 3, 4, 5, 6, 7]), base = r.pick([2, 3, 5, 6, 7]), N = sq * sq * base;
      if (lv === 1) { var a = r.int(2, 12); return { q: ['Work out the root.', 'احسب الجذر.'], eq: '√' + (a * a), a: a, s: [['Which number times itself?', 'أي عدد في نفسه؟', a + ' × ' + a + ' =', a * a], ['The root', 'الجذر', '√' + (a * a) + ' =', a]], miss: [[a * a / 2, 'A root is not a half.', 'الجذر ليس النصف.']] }; }
      if (lv === 2) return { q: ['Simplify √' + N + ' to a√' + base + '. Type a.', 'بسّط √' + N + ' إلى a√' + base + '. اكتب a.'], eq: '√' + N, a: sq, s: [['Biggest square factor', 'أكبر عامل مربع', (sq * sq) + ' × ' + base + ' =', N], ['Root of the square', 'جذر المربع', '√' + (sq * sq) + ' =', sq]], miss: [[N / base, 'That is the square itself. Take its root.', 'هذا المربع. خذ جذره.']] };
      var p = r.int(2, 8), q0 = r.int(2, 9);
      return { q: ['Simplify. Type the number in front of √' + base + '.', 'بسّط. اكتب العدد قبل √' + base + '.'], eq: p + '√' + base + ' + ' + q0 + '√' + base, a: p + q0, s: [['Like surds add', 'الجذور المتشابهة تُجمع', p + ' + ' + q0 + ' =', p + q0]], miss: [[p * q0, 'Add them, like 3 apples and 4 apples.', 'اجمعهما، مثل ٣ تفاحات و٤.']] };
    },
    trap: function (r) { return { eq: '√9 + √16', w: 0, why: ['Roots do not add inside: 3 + 4 = 7, while √25 = 5.', 'لا تُجمع الجذور من الداخل: ٣ + ٤ = ٧ و√٢٥ = ٥.'], l: ['√9 + √16 = √25', '√25 = 5', 'Answer: 5'] }; },
    explain: [['Is √(a + b) the same as √a + √b?', 'هل √(a + b) هي √a + √b؟'], ['No: √(9 + 16) = 5 but √9 + √16 = 7.', 'لا: √(٩ + ١٦) = ٥ لكن √٩ + √١٦ = ٧.'], ['Yes, always.', 'نعم دائمًا.'], ['Only for big numbers.', 'في الكبيرة فقط.']]
  });

  /* ---------- trigonometry and proof ---------- */
  var SIDES = [['opposite', 'المقابل'], ['adjacent', 'المجاور'], ['hypotenuse', 'الوتر']];
  teach('m9.sohcah', {
    why: ['Before GPS, sailors and the astronomers of Baghdad measured the world with these ratios.', 'قبل الملاحة الفضائية، قاس البحارة وفلكيو بغداد العالم بهذه النسب.'],
    idea: [{ p: ['Label the sides from the angle you care about: opposite, adjacent, hypotenuse (the longest).', 'سمِّ الأضلاع من الزاوية المعنية: المقابل والمجاور والوتر (الأطول).'], dia: function () { return D.tri({ right: 0, sides: ['adj', 'hyp', 'opp'], angles: [null, 'θ', null] }); } }, ['sin = opposite ÷ hypotenuse. cos = adjacent ÷ hypotenuse. tan = opposite ÷ adjacent.', 'sin = المقابل ÷ الوتر. cos = المجاور ÷ الوتر. tan = المقابل ÷ المجاور.']],
    g: function (r, lv) {
      var f = r.pick([['sin', 'opposite ÷ hypotenuse', 'المقابل ÷ الوتر'], ['cos', 'adjacent ÷ hypotenuse', 'المجاور ÷ الوتر'], ['tan', 'opposite ÷ adjacent', 'المقابل ÷ المجاور']]), all = [['opposite ÷ hypotenuse', 'المقابل ÷ الوتر'], ['adjacent ÷ hypotenuse', 'المجاور ÷ الوتر'], ['opposite ÷ adjacent', 'المقابل ÷ المجاور']];
      if (lv === 1) return { q: ['What is ' + f[0] + '?', 'ما هو ' + f[0] + '؟'], o: [[f[1], f[2]]].concat(all.filter(function (x) { return x[0] !== f[1]; })), s: [['Name the two sides it uses', 'سمِّ الضلعين', [f[1], f[2]]]] };
      var t = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), o = t[0], a = t[1], h = t[2], vals = { sin: o + '/' + h, cos: a + '/' + h, tan: o + '/' + a }, ans = vals[f[0]];
      if (lv === 2) return { q: ['The side opposite θ is ' + o + ', adjacent is ' + a + ', hypotenuse is ' + h + '. Find ' + f[0] + ' θ as a fraction.', 'المقابل لـ θ هو ' + o + ' والمجاور ' + a + ' والوتر ' + h + '. أوجد ' + f[0] + ' θ كسرًا.'], dia: D.tri({ right: 0, sides: [a, h, o], angles: [null, 'θ', null] }), a: ans, exact: true, s: [['Use the ratio', 'استخدم النسبة', [f[1], f[2]]], ['Fill in', 'عوّض', 'Answer:', ans]], miss: [[vals.sin === ans ? vals.cos : vals.sin, 'That is a different ratio. Check which sides ' + f[0] + ' uses.', 'هذه نسبة أخرى. راجع أضلاع ' + f[0] + '.']] };
      var kk = r.pick([['sin', 'opposite', 'hypotenuse', 'المقابل', 'الوتر'], ['cos', 'adjacent', 'hypotenuse', 'المجاور', 'الوتر'], ['tan', 'opposite', 'adjacent', 'المقابل', 'المجاور']]);
      return { q: ['You know the ' + kk[1] + ' and want the ' + kk[2] + '. Which ratio links them?', 'تعرف ' + kk[3] + ' وتريد ' + kk[4] + '. أي نسبة تربطهما؟'], o: [[kk[0], TM.ltr(kk[0])]].concat(['sin', 'cos', 'tan'].filter(function (x) { return x !== kk[0]; }).map(function (x) { return [x, TM.ltr(x)]; })), s: [['Name the two sides involved', 'سمِّ الضلعين', [kk[1] + ' and ' + kk[2], kk[3] + ' و' + kk[4]]], ['The ratio with those two', 'النسبة التي فيها هذان', [kk[0], kk[0]]]] };
    },
    trap: function (r) { return { w: 1, q: ['Facts about sin, cos and tan. One line is wrong. Tap it.', 'حقائق عن sin وcos وtan. سطر واحد خاطئ. انقر عليه.'], why: ['tan = opposite ÷ adjacent. The hypotenuse is not used.', 'tan = المقابل ÷ المجاور، والوتر لا يدخل.'], l: [['sin = opposite ÷ hypotenuse', 'sin = المقابل ÷ الوتر'], ['tan = opposite ÷ hypotenuse', 'tan = المقابل ÷ الوتر'], ['cos = adjacent ÷ hypotenuse', 'cos = المجاور ÷ الوتر']] }; },
    explain: [['Why does sin 30° have the same value in a tiny and a giant triangle?', 'لماذا sin ٣٠° واحدة في المثلث الصغير والعملاق؟'], ['Triangles with the same angles are similar, so their ratios match.', 'المثلثات المتساوية الزوايا متشابهة فتتساوى نسبها.'], ['Calculators round it.', 'الآلات تقرّبها.'], ['It does not.', 'ليست كذلك.']]
  });

  teach('m9.trigcalc', {
    why: ['Measure one angle and one distance, and you know the height of a minaret without climbing it.', 'قِس زاوية ومسافة فتعرف ارتفاع المئذنة دون أن تصعدها.'],
    idea: [{ p: ['Choose the ratio with the side you know and the side you want. Write it, then solve.', 'اختر النسبة التي فيها الضلع المعلوم والمطلوب، واكتبها ثم حلّ.'], dia: function () { return D.tri({ right: 0, sides: ['10', null, 'x'], angles: [null, '30°', null] }); } }, ['If the unknown is on top: multiply. If it is on the bottom: divide.', 'إذا كان المجهول في البسط فاضرب، وإن كان في المقام فاقسم.']],
    calc: true,
    g: function (r, lv) {
      var ang = r.pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]), L = r.int(2, 30) * (lv === 1 ? 2 : 1), sn = Math.sin(rad(ang)), cs = Math.cos(rad(ang)), tn = Math.tan(rad(ang));
      if (lv === 1) { var ans = dp(L * sn, 1); return { q: ['The hypotenuse is ' + L + ' and the angle is ' + ang + '°. Find the opposite side, to 1 decimal place.', 'الوتر ' + L + ' والزاوية ' + ang + '°. أوجد المقابل إلى منزلة عشرية.'], dia: D.tri({ right: 0, sides: [null, L, 'x'], angles: [null, ang + '°', null] }), eq: L + ' × sin ' + ang + '°', a: ans, s: [['sin uses opposite and hypotenuse', 'sin فيها المقابل والوتر', 'x = ' + L + ' × sin ' + ang + '°'], ['Calculate', 'احسب', 'x ≈', ans]], miss: [[dp(L * cs, 1), 'That used cos. Opposite with hypotenuse is sin.', 'استخدمت cos. المقابل مع الوتر sin.']] }; }
      if (lv === 2) { var a2 = dp(L * tn, 1); return { q: ['The adjacent side is ' + L + ' and the angle is ' + ang + '°. Find the opposite side, to 1 decimal place.', 'المجاور ' + L + ' والزاوية ' + ang + '°. أوجد المقابل إلى منزلة عشرية.'], dia: D.tri({ right: 0, sides: [L, null, 'x'], angles: [null, ang + '°', null] }), eq: L + ' × tan ' + ang + '°', a: a2, s: [['tan uses opposite and adjacent', 'tan فيها المقابل والمجاور', 'x = ' + L + ' × tan ' + ang + '°'], ['Calculate', 'احسب', 'x ≈', a2]], miss: [[dp(L * sn, 1), 'That used sin. There is no hypotenuse here.', 'استخدمت sin. لا وتر هنا.']] }; }
      var a3 = dp(L / sn, 1);
      return { q: ['The opposite side is ' + L + ' and the angle is ' + ang + '°. Find the hypotenuse, to 1 decimal place.', 'المقابل ' + L + ' والزاوية ' + ang + '°. أوجد الوتر إلى منزلة عشرية.'], dia: D.tri({ right: 0, sides: [null, 'x', L], angles: [null, ang + '°', null] }), eq: L + ' ÷ sin ' + ang + '°', a: a3, s: [['x is on the bottom, so divide', 'x في المقام فاقسم', 'x = ' + L + ' ÷ sin ' + ang + '°'], ['Calculate', 'احسب', 'x ≈', a3]], miss: [[dp(L * sn, 1), 'The hypotenuse is the longest: divide, not multiply.', 'الوتر الأطول: اقسم ولا تضرب.']] };
    },
    trap: function (r) { return { eq: 'sin 30° = 5 ÷ x', w: 1, why: ['x is on the bottom, so divide: 5 ÷ 0.5 = 10.', 'x في المقام فاقسم: ٥ ÷ ٠٫٥ = ١٠.'], l: ['sin 30° = 0.5', ['x = 5 × 0.5 = 2.5', 'x = 5 × 0.5 = 2.5'], ['A hypotenuse of 2.5', 'وتر طوله 2.5']] }; },
    explain: [['How do you know an answer for the hypotenuse is wrong without a calculator?', 'كيف تعرف خطأ الوتر دون آلة حاسبة؟'], ['It must be longer than both other sides.', 'يجب أن يكون أطول من الضلعين.'], ['It must be a whole number.', 'يجب أن يكون صحيحًا.'], ['You cannot tell.', 'لا يمكن المعرفة.']]
  });

  teach('m9.bearings', {
    why: ['Ships, planes and the direction of the qiblah from your city are given as bearings.', 'السفن والطائرات واتجاه القبلة من مدينتك تُعطى بالاتجاهات الزاوية.'],
    idea: [{ p: ['A bearing is measured clockwise from north, always with three digits. East is 090°.', 'يُقاس الاتجاه الزاوي مع عقارب الساعة من الشمال بثلاثة أرقام. الشرق ٠٩٠°.'], dia: function () { return D.circle({ sector: 90, secLabel: '090°' }); } }, ['To reverse a bearing, add 180°. If that passes 360°, take 180° away instead.', 'لعكس الاتجاه أضف ١٨٠°، وإذا تجاوز ٣٦٠° فاطرح ١٨٠°.']],
    g: function (r, lv) {
      if (lv === 1) { var c = r.pick([[['North', 'الشمال'], 0], [['East', 'الشرق'], 90], [['South', 'الجنوب'], 180], [['West', 'الغرب'], 270], [['North-east', 'الشمال الشرقي'], 45], [['South-west', 'الجنوب الغربي'], 225]]); return { q: ['What is the bearing of ' + c[0][0] + ', in degrees?', 'ما الاتجاه الزاوي لـ ' + c[0][1] + ' بالدرجات؟'], a: c[1], s: [['Clockwise from north', 'مع عقارب الساعة من الشمال', 'Angle:', c[1]]], miss: [[360 - c[1], 'Measure clockwise, not anticlockwise.', 'قِس مع عقارب الساعة لا عكسها.']] }; }
      var b = r.int(10, 350), back = b < 180 ? b + 180 : b - 180;
      if (lv === 2) return { q: ['B is on a bearing of ' + b + '° from A. What is the bearing of A from B?', 'اتجاه B من A هو ' + b + '°. ما اتجاه A من B؟'], a: back, s: [[b < 180 ? 'Add 180°' : 'Take 180° off', b < 180 ? 'أضف ١٨٠°' : 'اطرح ١٨٠°', b + (b < 180 ? ' + ' : ' − ') + '180 =', back]], miss: [[b < 180 ? b : b + 180, 'The way back faces the opposite direction: 180° away.', 'طريق العودة في الاتجاه المقابل: بفارق ١٨٠°.']] };
      var e = r.int(3, 12) * 10, n = r.int(3, 12) * 10, ang = dp(Math.atan(e / n) * 180 / Math.PI, 1);
      return { q: ['Walk ' + n + ' m north then ' + e + ' m east. What is your bearing from the start, to 1 decimal place?', 'امشِ ' + n + ' م شمالًا ثم ' + e + ' م شرقًا. ما اتجاهك من نقطة البداية إلى منزلة عشرية؟'], dia: D.tri({ right: 0, sides: [e, null, n], angles: [null, null, 'θ'] }), a: ang, s: [['tan θ = east ÷ north', 'tan θ = الشرق ÷ الشمال', 'tan θ = ' + e + ' ÷ ' + n], ['Inverse tan', 'معكوس tan', 'θ ≈', ang]] };
    },
    trap: function (r) { var b = r.int(200, 300); return { eq: b + '°', w: 0, why: ['Over 180°, take 180° away: ' + (b - 180) + '°.', 'فوق ١٨٠° اطرح ١٨٠°: ' + (b - 180) + '°.'], l: [['Back bearing: ' + b + ' + 180 = ' + (b + 180), 'العكسي: ' + b + ' + 180 = ' + (b + 180)], ['Three digits always', 'ثلاثة أرقام دائمًا'], ['Clockwise from north', 'مع العقارب من الشمال']] }; },
    explain: [['Why three digits, like 045°?', 'لماذا ثلاثة أرقام مثل ٠٤٥°؟'], ['So that a radio message cannot be misheard or misread.', 'كي لا يُساء سماع الرسالة أو قراءتها.'], ['For decoration.', 'للزينة.'], ['Because compasses have three hands.', 'لأن للبوصلة ثلاثة عقارب.']]
  });

  teach('m9.proof', {
    why: ['A proof means certainty. No amount of examples can give that, but one argument can.', 'البرهان يعني اليقين، ولا تعطيه الأمثلة مهما كثرت، بل حجة واحدة.'],
    idea: [['Examples can only suggest. To prove something about all numbers, use letters: an even number is 2n.', 'الأمثلة توحي فقط. ولإثبات شيء عن كل الأعداد استخدم الحروف: الزوجي 2n.'], ['One counter-example is enough to disprove a claim.', 'مثال مضاد واحد يكفي لدحض ادعاء.']],
    g: function (r, lv) {
      var pool = lv === 1 ? [[['An even number can be written as', 'يُكتب العدد الزوجي على صورة'], '2n', 'n + 2', 'n²'], [['An odd number can be written as', 'يُكتب العدد الفردي على صورة'], '2n + 1', '2n', 'n + 1'], [['Three in a row can be written as', 'ثلاثة أعداد متتالية تُكتب'], 'n, n + 1, n + 2', 'n, 2n, 3n', 'n, n, n']] : lv === 2 ? [[['Sum of two evens: 2a + 2b is', 'مجموع زوجيين: 2a + 2b هو'], '2(a + b), so even', 'a + b, so odd', '4ab, so odd'], [['Sum of two odds: (2a + 1) + (2b + 1) is', 'مجموع فرديين: (2a + 1) + (2b + 1) هو'], '2(a + b + 1), so even', '2(a + b) + 1, so odd', 'a + b, unknown'], [['Three in a row add to', 'مجموع ثلاثة متتالية'], '3n + 3 = 3(n + 1), a multiple of 3', '3n, a multiple of 2', 'n + 3, a prime']] : [[['To disprove "all primes are odd", you need', 'لدحض «كل الأعداد الأولية فردية» تحتاج إلى'], 'one counter-example: 2', 'ten more primes', 'a longer list'], [['Checking 1000 cases of a claim gives', 'فحص ١٠٠٠ حالة من ادعاء يعطي'], 'evidence, not a proof', 'a proof', 'nothing useful'], [['A correct proof must work for', 'يجب أن يصح البرهان في'], 'every case allowed', 'most cases', 'the first few cases']], x = r.pick(pool);
      var toAr = { 'one counter-example: 2': 'مثال مضاد واحد: ٢', 'ten more primes': 'عشرة أعداد أولية أخرى', 'a longer list': 'قائمة أطول', 'evidence, not a proof': 'دليلًا لا برهانًا', 'a proof': 'برهانًا', 'nothing useful': 'لا شيء مفيد', 'every case allowed': 'كل الحالات المسموحة', 'most cases': 'أغلب الحالات', 'the first few cases': 'أوائل الحالات', '2(a + b), so even': '2(a + b) فهو زوجي', 'a + b, so odd': 'a + b فهو فردي', '4ab, so odd': '4ab فهو فردي', '2(a + b + 1), so even': '2(a + b + 1) فهو زوجي', '2(a + b) + 1, so odd': '2(a + b) + 1 فهو فردي', 'a + b, unknown': 'a + b مجهول', '3n + 3 = 3(n + 1), a multiple of 3': '3n + 3 = 3(n + 1) من مضاعفات ٣', '3n, a multiple of 2': '3n من مضاعفات ٢', 'n + 3, a prime': 'n + 3 عدد أولي' };
      var opt = function (t) { return [t, toAr[t] || TM.ltr(t)]; };
      return { q: x[0], o: [opt(x[1]), opt(x[2]), opt(x[3])], s: [['Think about what is true for every case', 'فكّر فيما يصح في كل حالة', opt(x[1])]] };
    },
    trap: function (r) { return { w: 1, q: ['Proving two odds add to an even. One line is wrong. Tap it.', 'إثبات أن مجموع فرديين زوجي. سطر واحد خاطئ. انقر عليه.'], why: ['Using 2n + 1 for both makes them the same number. Use 2a + 1 and 2b + 1.', 'استخدام 2n + 1 لهما يجعلهما عددًا واحدًا. استخدم 2a + 1 و2b + 1.'], l: [['Let the numbers be odd', 'ليكن العددان فرديين'], ['Write both as 2n + 1', 'اكتبهما 2n + 1'], ['Their sum has a factor of 2', 'مجموعهما فيه العامل ٢']] }; },
    explain: [['3, 5 and 7 are prime. Does that prove all odd numbers are prime?', '٣ و٥ و٧ أولية. هل يثبت هذا أن كل الفردية أولية؟'], ['No. 9 is a counter-example.', 'لا. ٩ مثال مضاد.'], ['Yes, three examples are enough.', 'نعم، ثلاثة أمثلة تكفي.'], ['Yes, because they are close together.', 'نعم لأنها متقاربة.']]
  });

  /* ---------- handling data ---------- */
  teach('m9.tree', {
    why: ['A tree diagram stops you missing a case. Doctors use the same logic to read test results.', 'مخطط الشجرة يمنع إغفال حالة، وبالمنطق نفسه يقرأ الأطباء النتائج.'],
    idea: [{ p: ['Multiply along the branches for "and". Add the ends you want for "or".', 'اضرب على طول الفروع لـ«و»، واجمع النهايات المطلوبة لـ«أو».'], dia: function () { return D.tree([['1/2', '1/2'], ['1/2', '1/2'], ['1/2', '1/2']]); } }, ['All the ends together add to 1.', 'النهايات كلها مجموعها ١.']],
    g: function (r, lv) {
      var a = r.int(1, 4), d = a + r.int(1, 5), b = d - a, p = a + '/' + d, q0 = b + '/' + d, dia = D.tree([[p, q0], [p, q0], [p, q0]]);
      if (lv === 1) return { q: ['Two rounds, each with a chance of ' + p + ' of winning. What is the chance of winning both? Give the simplest form.', 'جولتان، احتمال الفوز في كل منهما ' + p + '. ما احتمال الفوز فيهما معًا؟ أعط أبسط صورة.'], dia: dia, eq: p + ' × ' + p, a: low(a * a, d * d), s: [['Along the branches: multiply', 'على الفروع: اضرب', a + ' × ' + a + ' =', a * a], [null, null, d + ' × ' + d + ' =', d * d], ['Simplify', 'بسّط', (a * a) + '/' + (d * d) + ' =', low(a * a, d * d)]], miss: [[low(2 * a, d), 'You added. "Both" multiplies along the branch.', 'جمعت. «معًا» تضرب على الفرع.']] };
      if (lv === 2) { var one = 2 * a * b, D2 = d * d; return { q: ['Two rounds, with chance of a win ' + p + ' each. What is the chance of exactly one win? Give the simplest form.', 'جولتان واحتمال الفوز ' + p + ' في كل منهما. ما احتمال فوز واحد بالضبط؟ أعط أبسط صورة.'], dia: dia, a: low(one, D2), s: [['Win then lose', 'فوز ثم خسارة', a + ' × ' + b + ' =', a * b], ['Lose then win', 'خسارة ثم فوز', b + ' × ' + a + ' =', a * b], ['Add the two ends', 'اجمع النهايتين', (a * b) + ' + ' + (a * b) + ' =', one], ['Over', 'على', d + ' × ' + d + ' =', D2], ['Simplify', 'بسّط', one + '/' + D2 + ' =', low(one, D2)]], miss: [[low(a * b, D2), 'There are two ways to get one win.', 'هناك طريقتان لفوز واحد.']] }; }
      var nn = d, dn = d - 1, red = a, tt = low(red * (red - 1), nn * dn);
      if (red < 2) { red = 2; nn = d + 2; dn = nn - 1; tt = low(red * (red - 1), nn * dn); }
      return { q: ['A bag has ' + red + ' red and ' + (nn - red) + ' blue balls. Two are drawn without replacing. What is the chance both are red? Give the simplest form.', 'في كيس ' + red + ' حمراء و' + (nn - red) + ' زرقاء. سُحبت كرتان دون إرجاع. ما احتمال كونهما حمراوين؟ أعط أبسط صورة.'], eq: red + '/' + nn + ' × ' + (red - 1) + '/' + dn, a: tt, s: [['First draw', 'السحب الأول', 'Fraction:', red + '/' + nn], ['Second: one fewer of each', 'الثاني: واحدة أقل', 'Fraction:', (red - 1) + '/' + dn], ['Multiply and simplify', 'اضرب وبسّط', (red * (red - 1)) + '/' + (nn * dn) + ' =', tt]], miss: [[low(red * red, nn * nn), 'The ball is not put back, so the second draw changes.', 'الكرة لا تعود فيتغير السحب الثاني.']] };
    },
    trap: function (r) { return { eq: '1/2 , 1/2', w: 0, why: ['Exactly one head has two branches: HT and TH, so 1/2.', 'وجه واحد بالضبط له فرعان: 1/2.'], q: ['Two coins, chance of exactly one head. One line is wrong. Tap it.', 'عملتان، احتمال وجه واحد بالضبط. سطر واحد خاطئ. انقر عليه.'], l: [['Only head then tail counts', 'يُحسب وجه ثم ظهر فقط'], '1/2 × 1/2 = 1/4', 'Answer: 1/4'] }; },
    explain: [['Why must all the ends add to 1?', 'لماذا مجموع النهايات ١؟'], ['Together they cover everything that can happen.', 'تغطي معًا كل ما يمكن أن يقع.'], ['Trees always end in 1.', 'الأشجار تنتهي دائمًا بـ ١.'], ['They need not.', 'لا يلزم.']]
  });

  teach('m9.cum', {
    why: ['Exam results and heights come in groups. Then you can only estimate, and you must say so.', 'نتائج الامتحانات والأطوال تأتي في فئات، فلا يمكن إلا التقدير، ويجب أن تقول ذلك.'],
    idea: [['With grouped data, use the middle of each group as its value. The mean is only an estimate.', 'في البيانات المبوبة استخدم منتصف كل فئة قيمةً لها، والمتوسط تقدير فقط.'], ['Group 10 to 20 with 4 people counts as 15 × 4 = 60.', 'الفئة ١٠ إلى ٢٠ بها ٤ أشخاص تُحسب ١٥ × ٤ = ٦٠.']],
    g: function (r, lv) {
      var f = [r.int(1, 6), r.int(2, 8), r.int(1, 7)], mids = [5, 15, 25], tot = f[0] + f[1] + f[2], sum = 5 * f[0] + 15 * f[1] + 25 * f[2], label = '0–10: ' + f[0] + ' , 10–20: ' + f[1] + ' , 20–30: ' + f[2];
      if (lv === 1) { var i = r.int(0, 2), hi = [10, 20, 30][i]; return { q: ['What is the middle of the group from ' + (hi - 10) + ' to ' + hi + '?', 'ما منتصف الفئة من ' + (hi - 10) + ' إلى ' + hi + '؟'], eq: '(' + (hi - 10) + ' + ' + hi + ') ÷ 2', a: hi - 5, s: [['Halfway', 'المنتصف', '(' + (hi - 10) + ' + ' + hi + ') ÷ 2 =', hi - 5]] }; }
      if (lv === 2) return { q: ['Group: how many. What is the estimated total of all the values?', 'الفئة: العدد. ما المجموع التقديري للقيم؟'], eq: label, a: sum, s: [['Middle × how many, each group', 'المنتصف × العدد لكل فئة', '5 × ' + f[0] + ' + 15 × ' + f[1] + ' + 25 × ' + f[2] + ' =', sum]], miss: [[tot, 'That is how many people. Multiply by each group\'s middle.', 'هذا عدد الأشخاص. اضرب في منتصف كل فئة.']] };
      return { q: ['Group: how many. Estimate the mean, to 1 decimal place.', 'الفئة: العدد. قدّر المتوسط إلى منزلة عشرية.'], eq: label, a: dp(sum / tot, 1), s: [['Estimated total', 'المجموع التقديري', '5 × ' + f[0] + ' + 15 × ' + f[1] + ' + 25 × ' + f[2] + ' =', sum], ['How many people', 'عدد الأشخاص', f.join(' + ') + ' =', tot], ['Divide', 'اقسم', sum + ' ÷ ' + tot + ' ≈', dp(sum / tot, 1)]], miss: [[dp(sum / 3, 1), 'Divide by the people, not the number of groups.', 'اقسم على الأشخاص لا الفئات.']] };
    },
    trap: function (r) { return { eq: '0–10: 2 , 10–20: 3', w: 0, why: ['Use the middle of the group, not its end: 5 and 15.', 'استخدم منتصف الفئة لا نهايتها: ٥ و١٥.'], l: [['Use the top of each group: 10 × 2 + 20 × 3', 'استخدم أعلى الفئة: 10 × 2 + 20 × 3'], '2 + 3 = 5', '80 ÷ 5 = 16'] }; },
    explain: [['Why is a mean from groups only an estimate?', 'لماذا المتوسط من الفئات تقدير فقط؟'], ['The exact values were lost when they were grouped.', 'ضاعت القيم الدقيقة عند التبويب.'], ['Because of rounding on the calculator.', 'بسبب التقريب في الآلة.'], ['It is exact.', 'هو دقيق.']]
  });

  teach('m9.misuse', {
    why: ['Numbers can be true and still mislead. Spotting it protects you for life.', 'قد تكون الأعداد صحيحة وتضلل، وكشف ذلك يحميك مدى الحياة.'],
    idea: [{ p: ['Look at the axis: a chart starting at 90 makes a tiny gap look huge.', 'انظر إلى المحور: رسم يبدأ من ٩٠ يجعل الفرق الصغير ضخمًا.'], dia: function () { return D.bars([92, 96], ['A', 'B']); } }, ['Ask: how big was the sample, who collected it, and what is being left out?', 'اسأل: ما حجم العينة، ومن جمعها، وماذا أُغفل؟']],
    g: function (r, lv) {
      var pool = lv === 1 ? [[['A chart\'s axis starts at 95 instead of 0. What is the effect?', 'يبدأ محور الرسم من ٩٥ لا من ٠. ما الأثر؟'], ['Small differences look large.', 'الفروق الصغيرة تبدو كبيرة.'], ['Numbers become more accurate.', 'تصبح الأعداد أدق.'], ['Nothing changes.', 'لا يتغير شيء.']], [['"9 out of 10 agree", from asking 10 people. What is wrong?', '«٩ من ١٠ يوافقون»، بعد سؤال ١٠ أشخاص. ما الخطأ؟'], ['The sample is far too small.', 'العينة صغيرة جدًا.'], ['9 is an odd number.', '٩ عدد فردي.'], ['Nothing is wrong.', 'لا خطأ.']]] : lv === 2 ? [[['A survey about sport is done outside a stadium. What is wrong?', 'استبيان عن الرياضة عند ملعب. ما الخطأ؟'], ['The sample is biased: not typical people.', 'العينة متحيزة: ليسوا أشخاصًا عاديين.'], ['Sport cannot be measured.', 'لا تُقاس الرياضة.'], ['Stadiums are too large.', 'الملاعب كبيرة.']], [['Sales "doubled", from 2 to 4 items. What is misleading?', '«تضاعفت المبيعات» من ٢ إلى ٤. ما المضلل؟'], ['A percent of a tiny number sounds impressive.', 'نسبة من عدد صغير تبدو مبهرة.'], ['Doubling is impossible.', 'التضاعف مستحيل.'], ['4 is not double 2.', '٤ ليس ضعف ٢.']]] : [[['Salaries: 2, 2, 3, 3, 90. A firm says "average pay 20". What is misleading?', 'رواتب: ٢ و٢ و٣ و٣ و٩٠. تقول شركة «المتوسط ٢٠». ما المضلل؟'], ['One huge pay inflates the mean. The median is 3.', 'راتب ضخم يرفع المتوسط. والوسيط ٣.'], ['The sum is wrong.', 'المجموع خطأ.'], ['Nothing, it is the fairest number.', 'لا شيء، هو الأعدل.']], [['Towns with more doctors have more illness. So doctors cause illness?', 'في المدن ذات الأطباء الأكثر أمراض أكثر. فهل الأطباء يسببونها؟'], ['No. Bigger towns have more of both.', 'لا. المدن الكبيرة فيها الاثنان أكثر.'], ['Yes, the numbers prove it.', 'نعم، الأعداد تثبت.'], ['Yes, for some towns.', 'نعم في بعضها.']]], x = r.pick(pool);
      return { q: x[0], o: [x[1], x[2], x[3]], s: [['Ask what the number does not tell you', 'اسأل ماذا لا يقوله العدد', x[1]]] };
    },
    trap: function (r) { return { w: 1, q: ['Judging a claim. One line is bad reasoning. Tap it.', 'تقييم ادعاء. سطر واحد استدلال سيئ. انقر عليه.'], why: ['A big number is not proof; ask how it was gathered.', 'العدد الكبير ليس برهانًا؛ اسأل كيف جُمع.'], l: [['Check the axis of the chart', 'راجع محور الرسم'], ['A large number must be true', 'العدد الكبير صحيح حتمًا'], ['Ask who collected the data', 'اسأل من جمع البيانات']] }; },
    explain: [['What is the best first question to ask about a statistic?', 'ما أفضل سؤال أول عن إحصائية؟'], ['How was it measured, and on whom?', 'كيف قيست، وعلى من؟'], ['Is it a large number?', 'هل هي عدد كبير؟'], ['Is it printed in a book?', 'هل طُبعت في كتاب؟']]
  });

  /* ---------- olympiad foundations ---------- */
  teach('g9.induct', {
    why: ['Knock over one domino and they all fall. Induction proves things for all numbers at once.', 'أسقط قطعة دومينو تسقط كلها. والاستقراء يثبت الأمر لكل الأعداد.'],
    idea: [['Show it is true for 1. Show that if it is true for k, then it is true for k + 1. Then it is true for all.', 'أثبته عند ١. وأثبت أنه إن صحّ عند k صحّ عند k + ١. فيصح للجميع.'], ['1 + 3 + 5 + ... + (2n − 1) = n². Adding the next odd number, 2k + 1, turns k² into (k + 1)².', '١ + ٣ + ٥ + ... + (٢n − ١) = n². وإضافة الفردي التالي ٢k + ١ تحوّل k² إلى (k + ١)².']],
    g: function (r, lv) {
      var n = r.int(3, lv === 1 ? 8 : 30);
      if (lv === 1) { var odd = []; for (var i = 1; i <= n; i++) odd.push(2 * i - 1); return { q: ['Add the first ' + n + ' odd numbers.', 'اجمع أول ' + n + ' أعداد فردية.'], eq: odd.join(' + '), a: n * n, s: [['The pattern gives n²', 'النمط يعطي n²', n + ' × ' + n + ' =', n * n]] }; }
      if (lv === 2) return { q: ['Use n(n + 1) ÷ 2 to add 1 up to ' + n + '.', 'استخدم n(n + 1) ÷ 2 لجمع الأعداد إلى ' + n + '.'], eq: n + ' × ' + (n + 1) + ' ÷ 2', a: n * (n + 1) / 2, s: [['Multiply', 'اضرب', n + ' × ' + (n + 1) + ' =', n * (n + 1)], ['Halve', 'نصّف', (n * (n + 1)) + ' ÷ 2 =', n * (n + 1) / 2]] };
      var k = r.int(3, 12);
      return { q: ['If the sum of the first ' + k + ' odd numbers is ' + (k * k) + ', what must you add to get the sum of the first ' + (k + 1) + '?', 'إذا كان مجموع أول ' + k + ' أعداد فردية ' + (k * k) + '، فماذا تضيف لتحصل على مجموع أول ' + (k + 1) + '؟'], eq: '2 × ' + k + ' + 1', a: 2 * k + 1, s: [['The next odd number', 'الفردي التالي', '2 × ' + k + ' + 1 =', 2 * k + 1], ['Check: the next square', 'تحقق: المربع التالي', (k * k) + ' + ' + (2 * k + 1) + ' = ' + ((k + 1) * (k + 1))]], miss: [[2 * k - 1, 'That is the last odd number already added. Take the next one.', 'هذا آخر فردي أضيف. خذ التالي.']] };
    },
    trap: function (r) { return { w: 1, q: ['The steps of a proof by induction. One line is wrong. Tap it.', 'خطوات البرهان بالاستقراء. سطر واحد خاطئ. انقر عليه.'], why: ['Examples are not enough: you must show the step from k to k + 1.', 'الأمثلة لا تكفي: يجب إثبات الانتقال من k إلى k + ١.'], l: [['Show it is true for n = 1', 'أثبته عند n = 1'], ['Check n = 2 and n = 3, then you are done', 'افحص n = 2 وn = 3 وانتهى'], ['The dominoes then all fall', 'فتتساقط القطع كلها']] }; },
    explain: [['Why is checking the first case still needed?', 'لماذا يلزم فحص الحالة الأولى؟'], ['Without a first domino falling, the chain never starts.', 'دون سقوط الأولى لا تبدأ السلسلة.'], ['It is not needed.', 'لا يلزم.'], ['Because 1 is prime.', 'لأن ١ أولي.']]
  });

  teach('g9.diophant', {
    why: ['Only whole-number answers allowed. These puzzles have fascinated mathematicians for two thousand years.', 'الحلول الصحيحة فقط. هذه الألغاز تأسر الرياضيين منذ ألفي عام.'],
    idea: [['3x + 5y = 22 in whole numbers: try values of y and see when the rest divides by 3.', '٣x + ٥y = ٢٢ بأعداد صحيحة: جرّب قيم y وانظر متى يقبل الباقي القسمة على ٣.'], ['y = 2 gives 3x = 12, so x = 4. If the common factor of 3 and 5 does not divide the right side, there is no solution.', 'y = ٢ تعطي ٣x = ١٢ فـ x = ٤. وإذا لم يقسم العامل المشترك الطرف الأيمن فلا حل.']],
    g: function (r, lv) {
      var a = r.pick([3, 4, 5, 7]), b = r.pick([5, 6, 8, 9].filter(function (v) { return gcd(a, v) === 1; })), x = r.int(1, 6), y = r.int(1, 5), R0 = a * x + b * y;
      if (lv === 1) return { q: ['When y = ' + y + ', find x.', 'عندما y = ' + y + '، أوجد x.'], eq: a + 'x + ' + b + 'y = ' + R0, a: x, s: [['Take off the y part', 'اطرح جزء y', R0 + ' − ' + b + ' × ' + y + ' =', a * x], ['Divide', 'اقسم', (a * x) + ' ÷ ' + a + ' =', x]] };
      if (lv === 2) { var N = r.int(2, 5); return { q: ['Coins of 5 and 2 make ' + (5 * N + 2 * y) + '. If there are ' + N + ' fives, how many twos?', 'قطع ٥ و٢ تكوّن ' + (5 * N + 2 * y) + '. إذا كان هناك ' + N + ' من فئة ٥، فكم من فئة ٢؟'], eq: '5 × ' + N + ' + 2y = ' + (5 * N + 2 * y), a: y, s: [['The fives', 'فئة ٥', '5 × ' + N + ' =', 5 * N], ['What is left', 'الباقي', (5 * N + 2 * y) + ' − ' + (5 * N) + ' =', 2 * y], ['Twos', 'فئة ٢', (2 * y) + ' ÷ 2 =', y]] }; }
      var c = 2 * r.int(5, 20) + 1;
      return { q: ['Does 2x + 4y = ' + c + ' have a whole-number solution?', 'هل لـ 2x + 4y = ' + c + ' حل صحيح؟'], o: [['No: the left is always even, and ' + c + ' is odd.', 'لا: الطرف الأيسر زوجي دائمًا و' + c + ' فردي.'], ['Yes: try x = 1.', 'نعم: جرّب x = ١.'], ['Yes: any equation has one.', 'نعم: لكل معادلة حل.']], s: [['Factor out 2', 'أخرج العامل ٢', '2(x + 2y) = ' + c], ['Check odd and even', 'راجع الفردية والزوجية', [c + ' is odd', c + ' فردي']]] };
    },
    trap: function (r) { return { eq: '3x + 6y = 10', w: 1, why: ['3 divides the left but not 10, so no whole-number solution exists.', '٣ يقسم الطرف الأيسر لا ١٠، فلا حل صحيح.'], l: [['3 divides 3x + 6y', '٣ يقسم 3x + 6y'], ['Try harder: x = 1, y = 1', 'حاول أكثر: x = 1, y = 1'], ['3 does not divide 10', '٣ لا يقسم ١٠']] }; },
    explain: [['How can a whole-number equation have no solution?', 'كيف لا يكون لمعادلة صحيحة حل؟'], ['A common factor on the left may not divide the right.', 'قد لا يقسم عامل مشترك في الأيسر الطرف الأيمن.'], ['Every equation has a solution.', 'لكل معادلة حل.'], ['If the numbers are large.', 'إذا كبرت الأعداد.']]
  });

  teach('g9.ineq', {
    why: ['Of all rectangles with the same fence, the square holds the most. This inequality proves it.', 'من كل المستطيلات بالمحيط نفسه يتسع المربع أكثر، وهذه المتباينة تثبت ذلك.'],
    idea: [['For positive a and b: (a + b) ÷ 2 ≥ √(ab). The arithmetic mean is never below the geometric mean.', 'للموجبين: (a + b) ÷ ٢ ≥ √(ab). الوسط الحسابي لا يقل عن الهندسي.'], ['They are equal only when a = b. Why? (√a − √b)² is never negative.', 'يتساويان فقط إذا a = b. لأن (√a − √b)² لا تكون سالبة.']],
    g: function (r, lv) {
      var m = r.pick([1, 2, 3, 4]), n = r.pick([2, 3, 5]), a = m * m, b = n * n * (r.bool() ? 1 : 4), rt = Math.sqrt(a * b); if (rt !== Math.floor(rt)) { a = 4; b = 16; rt = 8; }
      if (lv === 1) return { q: ['Find the arithmetic mean of ' + a + ' and ' + b + '.', 'أوجد الوسط الحسابي لـ ' + a + ' و' + b + '.'], eq: '(' + a + ' + ' + b + ') ÷ 2', a: (a + b) / 2, s: [['Add and halve', 'اجمع ونصّف', '(' + a + ' + ' + b + ') ÷ 2 =', (a + b) / 2]] };
      if (lv === 2) return { q: ['Find the geometric mean of ' + a + ' and ' + b + '.', 'أوجد الوسط الهندسي لـ ' + a + ' و' + b + '.'], eq: '√(' + a + ' × ' + b + ')', a: rt, s: [['Multiply', 'اضرب', a + ' × ' + b + ' =', a * b], ['Root', 'الجذر', '√' + (a * b) + ' =', rt]], miss: [[(a + b) / 2, 'That is the arithmetic mean. Geometric multiplies.', 'هذا الوسط الحسابي. الهندسي يضرب.']] };
      var P = 4 * r.int(3, 25), s = P / 4;
      return { q: ['A rectangle has a perimeter of ' + P + '. What is the largest area it can have?', 'مستطيل محيطه ' + P + '. ما أكبر مساحة له؟'], eq: P + ' ÷ 4', a: s * s, s: [['AM-GM says a square is best', 'المتباينة: المربع هو الأفضل', P + ' ÷ 4 =', s], ['Its area', 'مساحته', s + ' × ' + s + ' =', s * s]], miss: [[P, 'That is the perimeter. Find the area of the square.', 'هذا المحيط. أوجد مساحة المربع.']] };
    },
    trap: function (r) { return { eq: '4 , 16', w: 1, why: ['√(4 × 16) = √64 = 8, and 10 ≥ 8, as the rule says.', '√(٤ × ١٦) = ٨، و١٠ ≥ ٨ كما تقول القاعدة.'], l: ['(4 + 16) ÷ 2 = 10', '√(4 × 16) = 12', ['So the mean is smaller', 'فالوسط أصغر']] }; },
    explain: [['When are the two means equal?', 'متى يتساوى الوسطان؟'], ['Exactly when the two numbers are equal.', 'فقط عند تساوي العددين.'], ['Never.', 'أبدًا.'], ['Whenever both are whole numbers.', 'إذا كانا صحيحين.']]
  });

  teach('g9.geo', {
    why: ['Geometry with no numbers: pure reasoning, in the tradition of Euclid, Ibn al-Haytham and al-Khayyām.', 'هندسة بلا أعداد: استدلال خالص في تقليد إقليدس وابن الهيثم والخيّام.'],
    idea: [{ p: ['Two triangles are congruent if: three sides match (SSS), two sides and the angle between (SAS), or two angles and a side (ASA).', 'يتطابق مثلثان إذا: تساوت ثلاثة أضلاع، أو ضلعان والزاوية بينهما، أو زاويتان وضلع.'], dia: function () { return D.tri({ sides: ['a', 'b', 'c'] }); } }, ['Isosceles triangle: draw the middle line, get two congruent triangles, and the base angles must match.', 'في متساوي الساقين: ارسم خط الوسط تحصل على مثلثين متطابقين فتتساوى زاويتا القاعدة.']],
    g: function (r, lv) {
      var pool = lv === 1 ? [[['Three pairs of sides match. Which test?', 'تساوت ثلاثة أضلاع. أي اختبار؟'], 'SSS', 'SAS', 'ASA'], [['Two sides and the angle between them match. Which test?', 'ضلعان والزاوية بينهما. أي اختبار؟'], 'SAS', 'SSS', 'ASA'], [['Two angles and a matching side match. Which test?', 'زاويتان وضلع مناظر. أي اختبار؟'], 'ASA', 'SSS', 'SAS']] : lv === 2 ? [[['Do three matching angles prove two triangles congruent?', 'هل ثلاث زوايا متساوية تثبت التطابق؟'], ['No: similar only. Sizes may differ.', 'لا: تشابه فقط. قد تختلف الأحجام.'], ['Yes, always.', 'نعم دائمًا.'], ['Only for right angles.', 'في القائمة فقط.']], [['A parallelogram\'s diagonal makes two triangles. They are', 'قطر متوازي الأضلاع يعطي مثلثين هما'], ['congruent.', 'متطابقان.'], ['different in area.', 'مختلفا المساحة.'], ['right-angled.', 'قائمان.']]] : [[['An angle in a semicircle is always', 'الزاوية في نصف الدائرة دائمًا'], ['90°.', '٩٠°.'], ['60°.', '٦٠°.'], ['180°.', '١٨٠°.']], [['In any triangle, one side is always', 'في أي مثلث، الضلع دائمًا'], ['shorter than the other two added together.', 'أقصر من مجموع الآخرين.'], ['equal to the other two added together.', 'يساوي مجموع الآخرين.'], ['the longest.', 'الأطول.']]], x = r.pick(pool);
      var GN = { SSS: 'ض ض ض', SAS: 'ض ز ض', ASA: 'ز ض ز' };
      if (typeof x[1] === 'string') return { q: x[0], o: [[x[1], GN[x[1]]], [x[2], GN[x[2]]], [x[3], GN[x[3]]]], s: [['Name what matches', 'سمِّ المتساوي', [x[1], GN[x[1]]]]] };
      return { q: x[0], o: [x[1], x[2], x[3]], s: [['Reason it out', 'استدل', x[1]]] };
    },
    trap: function (r) { return { w: 1, q: ['Proving the base angles of an isosceles triangle match. One line is wrong. Tap it.', 'إثبات تساوي زاويتي القاعدة. سطر واحد خاطئ. انقر عليه.'], why: ['You cannot assume what you are proving. It comes from the congruent triangles.', 'لا يجوز افتراض المطلوب. بل ينتج من التطابق.'], l: [['Draw the line to the middle of the base', 'ارسم الخط إلى منتصف القاعدة'], ['The base angles are equal, as we know', 'زاويتا القاعدة متساويتان كما نعلم'], ['SSS gives congruent triangles', 'التطابق بثلاثة أضلاع']] }; },
    explain: [['What makes reasoning a proof rather than a guess from a drawing?', 'ما الذي يجعل الاستدلال برهانًا لا تخمينًا من رسم؟'], ['Each step follows from what is already known.', 'كل خطوة تتبع مما هو معلوم.'], ['The drawing is neat.', 'الرسم مرتب.'], ['The answer looks right.', 'الناتج يبدو صحيحًا.']]
  });

  teach('g9.weekly', { keep: true,
    g: function (r, lv) {
      var n = r.int(3, 9);
      if (lv === 1) return { q: ['What is the sum of the first ' + n + ' whole numbers?', 'ما مجموع أول ' + n + ' أعداد صحيحة؟'], eq: n + ' × ' + (n + 1) + ' ÷ 2', a: n * (n + 1) / 2, s: [['Pair first and last', 'اقرن الأول بالأخير', n + ' × ' + (n + 1) + ' ÷ 2 =', n * (n + 1) / 2]] };
      if (lv === 2) { var k = r.int(5, 12); return { q: ['How many diagonals does a shape with ' + k + ' sides have?', 'كم قطرًا لشكل له ' + k + ' أضلاع؟'], eq: k + ' × ' + (k - 3) + ' ÷ 2', a: k * (k - 3) / 2, s: [['Each corner joins ' + (k - 3) + ' others', 'كل ركن يصل ' + (k - 3) + ' أركان', k + ' × ' + (k - 3) + ' =', k * (k - 3)], ['Each counted twice', 'حُسب كلٌّ مرتين', (k * (k - 3)) + ' ÷ 2 =', k * (k - 3) / 2]] }; }
      var p = r.int(4, 12);
      return { q: ['A regular shape has ' + (2 * p + 1) + ' sides. What is each exterior angle, to 1 decimal place?', 'لشكل منتظم ' + (2 * p + 1) + ' ضلعًا. كم الزاوية الخارجية إلى منزلة عشرية؟'], eq: '360 ÷ ' + (2 * p + 1), a: dp(360 / (2 * p + 1), 1), s: [['A full turn shared', 'دورة كاملة مقسومة', '360 ÷ ' + (2 * p + 1) + ' ≈', dp(360 / (2 * p + 1), 1)]] };
    },
    trap: function (r) { var k = r.int(5, 8); return { eq: k + ' × ' + (k - 3) + ' ÷ 2', w: 1, why: ['Each diagonal joins two corners, so halve.', 'كل قطر يصل ركنين فنصّف.'], l: [k + ' × ' + (k - 3) + ' = ' + (k * (k - 3)), ['Answer: ' + (k * (k - 3)), 'الناتج: ' + (k * (k - 3))], ['Each joins two corners', 'كلٌّ يصل ركنين']] }; },
    explain: [['What is the first thing to do with a hard problem?', 'ما أول ما تفعله بمسألة صعبة؟'], ['Try a small case and look for a pattern.', 'جرّب حالة صغيرة وابحث عن نمط.'], ['Write the answer immediately.', 'اكتب الجواب فورًا.'], ['Look for a bigger number.', 'ابحث عن عدد أكبر.']]
  });

  /* ---------- towards IGCSE ---------- */
  teach('d9.diff2', {
    why: ['A pattern so useful it does mental arithmetic for you: 21 × 19 = 20² − 1 = 399.', 'نمط مفيد يحسب لك ذهنيًا: ٢١ × ١٩ = ٢٠² − ١ = ٣٩٩.'],
    idea: [{ p: ['a² − b² = (a + b)(a − b). The middle terms cancel when you expand.', 'a² − b² = (a + b)(a − b). الحدان الأوسطان يلغيان بعضهما عند الفتح.'], dia: function () { return D.box(['x', '−3'], ['x', '3'], [['x²', '−3x'], ['3x', '−9']]); } }, ['Look for two perfect squares with a minus between them.', 'ابحث عن مربعين كاملين بينهما سالب.']],
    g: function (r, lv) {
      var a = r.int(2, 15);
      if (lv === 1) return { q: ['Factorise x² − ' + (a * a) + ' as (x + a)(x − a). Type a.', 'حلّل x² − ' + (a * a) + ' إلى (x + a)(x − a). اكتب a.'], eq: 'x² − ' + (a * a), a: a, s: [['Square root of the number', 'جذر العدد', '√' + (a * a) + ' =', a]], miss: [[a * a / 2, 'Take the square root, not half.', 'خذ الجذر لا النصف.']] };
      if (lv === 2) { var m = r.int(2, 5), b = r.int(2, 9); return { q: ['Factorise fully.', 'حلّل تمامًا.'], eq: (m * m) + 'x² − ' + (b * b), alg: true, a: ['(' + m + 'x+' + b + ')(' + m + 'x-' + b + ')', '(' + m + 'x-' + b + ')(' + m + 'x+' + b + ')'], s: [['Root of the first', 'جذر الأول', '√' + (m * m) + ' =', m], ['Root of the second', 'جذر الثاني', '√' + (b * b) + ' =', b], ['One plus, one minus', 'موجب وسالب', '(' + m + 'x + ' + b + ')(' + m + 'x − ' + b + ')']] }; }
      var c = r.pick([20, 30, 40, 50, 60, 70, 80, 100]), d = r.int(1, 5);
      return { q: ['Use the pattern to work it out in your head.', 'استخدم النمط لتحسب ذهنيًا.'], eq: (c + d) + ' × ' + (c - d), a: c * c - d * d, s: [['The middle number and the gap', 'العدد الأوسط والفرق', c + '² − ' + d + '² =', c * c - d * d]], miss: [[c * c, 'Take off ' + d + '² as well.', 'اطرح ' + d + '² أيضًا.']] };
    },
    trap: function (r) { var a = r.int(3, 9); return { eq: 'x² + ' + (a * a), w: 0, why: ['A plus between squares does not factorise this way. It needs a minus.', 'الموجب بين المربعين لا يُحلَّل هكذا، بل يلزم السالب.'], l: [['x² + ' + (a * a) + ' = (x + ' + a + ')(x − ' + a + ')', 'x² + ' + (a * a) + ' = (x + ' + a + ')(x − ' + a + ')'], ['Check by expanding', 'تحقق بالفتح'], ['Middle terms cancel', 'الوسطان يلغيان']] }; },
    explain: [['Why do the middle terms disappear?', 'لماذا يختفي الحدان الأوسطان؟'], ['One is +ab and the other −ab, so they cancel.', 'أحدهما +ab والآخر −ab فيلغيان.'], ['They were never there.', 'لم يكونا.'], ['Because squares are special.', 'لأن المربعات مميزة.']]
  });

  teach('d9.negq', {
    why: ['In exams, signs are where most quadratic marks are lost.', 'في الامتحانات تضيع أغلب درجات التربيعية في الإشارات.'],
    idea: [['Last term positive: same signs, both matching the middle. Last term negative: different signs, the bigger takes the middle\'s sign.', 'الأخير موجب: إشارتان متشابهتان كإشارة الأوسط. والأخير سالب: مختلفتان، والأكبر بإشارة الأوسط.'], ['x² − x − 6 = (x − 3)(x + 2).', 'x² − x − 6 = (x − 3)(x + 2).']],
    g: function (r, lv) {
      var a = r.int(2, 9), b = r.int(1, 8); if (a === b) b = a - 1 || 1; var p = -a * b, s = b - a, eq = 'x² ' + (s === 0 ? '' : sg(s) + 'x ') + sg(p) + ' = 0';
      if (lv === 1) return { q: ['Two numbers multiply to ' + mn(p) + ' and add to ' + mn(s) + '. Type the negative one.', 'حاصل ضرب عددين ' + mn(p) + ' ومجموعهما ' + mn(s) + '. اكتب السالب.'], a: -a, s: [['Different signs', 'إشارتان مختلفتان', a + ' × ' + b + ' =', a * b], ['The sum must be ' + mn(s), 'المجموع ' + mn(s), '−' + a + ' + ' + b + ' =', mn(s)], ['The negative one', 'السالب', 'Answer:', '−' + a]], miss: [[a, 'Your answer needs a minus: the numbers have different signs.', 'يلزم السالب: الإشارتان مختلفتان.']] };
      if (lv === 2) return { q: ['Solve. Type the positive answer.', 'حُلّ. اكتب الحل الموجب.'], eq: eq, a: a, s: [['Factors', 'العوامل', '(x − ' + a + ')(x + ' + b + ') = 0'], ['Positive answer', 'الحل الموجب', 'Answer:', a]], miss: [[b, 'x + ' + b + ' = 0 gives a negative. Use the other bracket.', 'x + ' + b + ' = ٠ سالب. استخدم القوس الآخر.']] };
      return { q: ['Solve. Type the negative answer.', 'حُلّ. اكتب الحل السالب.'], eq: eq, a: -b, s: [['Factors', 'العوامل', '(x − ' + a + ')(x + ' + b + ') = 0'], ['Negative answer', 'الحل السالب', 'Answer:', '−' + b]] };
    },
    trap: function (r) { return { eq: 'x² − x − 6 = 0', w: 1, why: ['−3 + 2 = −1 and −3 × 2 = −6. So (x − 3)(x + 2).', '−٣ + ٢ = −١ و−٣ × ٢ = −٦. إذن (x − 3)(x + 2).'], l: ['−3 × 2 = −6', ['So (x + 3)(x − 2)', 'إذن (x + 3)(x − 2)'], ['x is −3 or 2', 'x هي −3 أو 2']] }; },
    explain: [['In x² − 2x − 15, which number is bigger, and with what sign?', 'في x² − 2x − 15، أي العددين أكبر وبأي إشارة؟'], ['5, negative: −5 + 3 = −2.', '٥ سالبة: −٥ + ٣ = −٢.'], ['5, positive.', '٥ موجبة.'], ['They are equal.', 'متساويان.']]
  });

  teach('d9.sub', {
    why: ['When one equation already says what y is, use it. Later this handles a line meeting a curve.', 'إذا حددت معادلة قيمة y فاستخدمها، ولاحقًا يُحل بها تقاطع خط ومنحنٍ.'],
    idea: [['Replace y in the other equation by what it equals. y = 2x + 1 and x + y = 7 gives x + 2x + 1 = 7.', 'ضع مكان y في الأخرى ما تساويه. y = 2x + 1 وx + y = 7 تعطي x + 2x + 1 = 7.'], ['So 3x = 6, x = 2, y = 5. Check in both equations.', 'إذن ٣x = ٦ وx = ٢ وy = ٥. تحقق في المعادلتين.']],
    g: function (r, lv) {
      var x = r.int(1, 9), m = r.int(2, 5), c = r.int(1, 9), y = m * x + c, k = r.int(1, 3), T0 = k * x + y;
      var e = 'y = ' + m + 'x + ' + c + ' ,  ' + (k === 1 ? '' : k) + 'x + y = ' + T0;
      if (lv === 1) return { q: ['Substitute. How many x\'s are there in all?', 'عوّض. كم عدد x إجمالًا؟'], eq: e, a: k + m, s: [['Replace y', 'ضع مكان y', k + ' + ' + m + ' =', k + m]] };
      if (lv === 2) return { q: ['Solve. Find x.', 'حُلّ. أوجد x.'], eq: e, a: x, s: [['Replace y and collect', 'ضع مكان y واجمع', k + ' + ' + m + ' =', k + m], ['Take ' + c + ' from both sides', 'اطرح ' + c, T0 + ' − ' + c + ' =', T0 - c], ['Divide', 'اقسم', (T0 - c) + ' ÷ ' + (k + m) + ' =', x]], miss: [[y, 'That is y. Find x.', 'هذا y. أوجد x.']] };
      return { q: ['Solve. Find y.', 'حُلّ. أوجد y.'], eq: e, a: y, s: [['Replace y and collect', 'ضع مكان y واجمع', k + ' + ' + m + ' =', k + m], ['Take ' + c + ' off', 'اطرح ' + c, T0 + ' − ' + c + ' =', T0 - c], ['x', 'x', (T0 - c) + ' ÷ ' + (k + m) + ' =', x], ['Back into y', 'عوّض في y', m + ' × ' + x + ' + ' + c + ' =', y]], miss: [[x, 'That is x. Put it back to find y.', 'هذا x. عوّضه لتجد y.']] };
    },
    trap: function (r) { return { eq: 'y = 2x + 1 ,  x + y = 7', w: 0, why: ['Replace all of y, including the + 1: x + 2x + 1 = 7.', 'ضع y كلها بما فيها + ١: x + 2x + 1 = 7.'], l: [['x + 2x = 7', 'x + 2x = 7'], '7 ÷ 3 = 2.333', ['x is not whole', 'x ليس صحيحًا']] }; },
    explain: [['Which is best when one equation is already "y = ..."?', 'أيهما أفضل إذا كانت معادلة «y = ...»؟'], ['Substitution: it is ready to use.', 'التعويض: جاهز للاستخدام.'], ['Drawing a graph by hand.', 'رسم يدوي.'], ['Guessing.', 'التخمين.']]
  });

  teach('d9.scale', {
    why: ['Double the size of a model and it needs four times the paint and eight times the clay.', 'ضاعف حجم النموذج يحتج إلى ٤ أضعاف الطلاء و٨ أضعاف الطين.'],
    idea: [{ p: ['If lengths scale by k: areas scale by k², and volumes scale by k³.', 'إذا كبرت الأطوال k مرة: تكبر المساحات k² والحجوم k³.'], dia: function () { return D.grid(3, 3, 9); } }, ['Lengths × 2, area × 4, volume × 8.', 'الأطوال × ٢، المساحة × ٤، الحجم × ٨.']],
    g: function (r, lv) {
      var k = r.int(2, 5), A0 = r.int(2, 12), V = r.int(2, 9);
      if (lv === 1) return { q: ['Lengths are multiplied by ' + k + '. What is the area multiplied by?', 'ضُربت الأطوال في ' + k + '. في كم تُضرب المساحة؟'], eq: k + '²', a: k * k, s: [['Area uses k²', 'المساحة k²', k + ' × ' + k + ' =', k * k]], miss: [[k, 'Area has two dimensions: use k².', 'للمساحة بعدان: k².']] };
      if (lv === 2) return { q: ['A shape has area ' + A0 + ' cm². A similar shape has lengths ' + k + ' times as long. Find its area, in cm².', 'مساحة شكل ' + A0 + ' سم². وشكل مشابه أطواله ' + k + ' أضعاف. أوجد مساحته.'], eq: A0 + ' × ' + k + '²', a: A0 * k * k, s: [['Area scale', 'عامل المساحة', k + ' × ' + k + ' =', k * k], ['Multiply', 'اضرب', A0 + ' × ' + (k * k) + ' =', A0 * k * k]], miss: [[A0 * k, 'Use k² for area, not k.', 'استخدم k² للمساحة لا k.']] };
      return { q: ['A model has volume ' + V + ' cm³. A similar one has lengths ' + k + ' times as long. Find its volume, in cm³.', 'حجم نموذج ' + V + ' سم³. وآخر مشابه أطواله ' + k + ' أضعاف. أوجد حجمه.'], eq: V + ' × ' + k + '³', a: V * k * k * k, s: [['Volume scale', 'عامل الحجم', k + ' × ' + k + ' × ' + k + ' =', k * k * k], ['Multiply', 'اضرب', V + ' × ' + (k * k * k) + ' =', V * k * k * k]], miss: [[V * k * k, 'That is k². Volume has three dimensions.', 'هذا k². للحجم ثلاثة أبعاد.'], [V * k, 'Use k³ for volume.', 'استخدم k³ للحجم.']] };
    },
    trap: function (r) { var A0 = r.int(3, 9); return { eq: A0 + ' × 3²', w: 0, why: ['Lengths × 3 gives area × 9.', 'الأطوال × ٣ تعطي المساحة × ٩.'], l: [A0 + ' × 3 = ' + (A0 * 9), 'Answer: ' + (A0 * 9), ['So nine times bigger', 'فهو تسعة أضعاف']] }; },
    explain: [['Why can\'t an ant the size of a horse exist?', 'لماذا لا توجد نملة بحجم حصان؟'], ['Its weight would grow as k³ but its leg strength only as k².', 'يزيد وزنها k³ وقوة أرجلها k² فقط.'], ['Horses are in the way.', 'الخيول تعترضها.'], ['Ants are too busy.', 'النمل مشغول.']]
  });

  teach('d9.arc', {
    why: ['Slices of pizza, garden beds and the swing of a door are all sectors.', 'شرائح الفطيرة وأحواض الحديقة ومسار الباب كلها قطاعات.'],
    idea: [{ p: ['A sector is a fraction of a circle: angle ÷ 360. Multiply that by the full area or circumference.', 'القطاع جزء من الدائرة: الزاوية ÷ ٣٦٠. اضربها في المساحة أو المحيط.'], dia: function () { return D.circle({ r: 'r', sector: 90, secLabel: '90°' }); } }, ['Arc length = (θ ÷ 360) × 2πr. Sector area = (θ ÷ 360) × πr².', 'طول القوس = (θ ÷ ٣٦٠) × ٢πr. ومساحة القطاع = (θ ÷ ٣٦٠) × πr².']],
    calc: true,
    g: function (r, lv) {
      var th = r.pick([30, 45, 60, 72, 90, 120, 150, 180, 240]), rd = r.int(2, 12), fr = low(th, 360);
      if (lv === 1) return { q: ['What fraction of the circle is a ' + th + '° sector? Simplest form.', 'ما كسر الدائرة في قطاع ' + th + '°؟ أبسط صورة.'], dia: D.circle({ sector: th, secLabel: th + '°' }), a: fr, s: [['Over 360', 'على ٣٦٠', th + '/360 =', fr]], miss: [[th + '/100', 'A full turn is 360°, not 100.', 'الدورة ٣٦٠° لا ١٠٠.']] };
      if (lv === 2) { var arc = dp(th / 360 * 2 * Math.PI * rd, 1); return { q: ['Find the arc length, to 1 decimal place.', 'أوجد طول القوس إلى منزلة عشرية.'], dia: D.circle({ r: rd, sector: th, secLabel: th + '°' }), eq: th + '/360 × 2 × π × ' + rd, a: arc, s: [['Full circumference', 'المحيط الكامل', '2 × π × ' + rd + ' ≈', dp(2 * Math.PI * rd, 2)], ['The fraction of it', 'الجزء منه', th + '/360 × ' + dp(2 * Math.PI * rd, 2) + ' ≈', arc]], miss: [[dp(th / 360 * Math.PI * rd * rd, 1), 'That is the sector area. Arc length uses 2πr.', 'هذه مساحة القطاع. القوس بـ ٢πr.']] }; }
      var ar = dp(th / 360 * Math.PI * rd * rd, 1);
      return { q: ['Find the sector area, to 1 decimal place.', 'أوجد مساحة القطاع إلى منزلة عشرية.'], dia: D.circle({ r: rd, sector: th, secLabel: th + '°' }), eq: th + '/360 × π × ' + rd + '²', a: ar, s: [['Full area', 'المساحة الكاملة', 'π × ' + rd + '² ≈', dp(Math.PI * rd * rd, 2)], ['The fraction of it', 'الجزء منها', th + '/360 × ' + dp(Math.PI * rd * rd, 2) + ' ≈', ar]], miss: [[dp(th / 360 * 2 * Math.PI * rd, 1), 'That is the arc length. Area uses πr².', 'هذا طول القوس. المساحة πr².']] };
    },
    trap: function (r) { return { eq: '90/360 × π × 4²', w: 0, why: ['90° is a quarter of a circle: 90/360 = 1/4.', '٩٠° ربع الدائرة: ٩٠/٣٦٠ = ١/٤.'], l: ['90/360 = 1/3', '1/3 × 16 = 5.33', ['Area 5.33π', 'المساحة 5.33π']] }; },
    explain: [['What fraction of the circle is a 72° sector?', 'ما كسر الدائرة في قطاع ٧٢°؟'], ['1/5.', '١/٥.'], ['1/4.', '١/٤.'], ['72/100.', '٧٢/١٠٠.']]
  });

  teach('d9.trigside', {
    why: ['Knowing sides gives you angles. This is how the slope of a roof or a ramp is set.', 'معرفة الأضلاع تعطي الزوايا، وهكذا يُضبط ميل السقف والمنحدر.'],
    idea: [{ p: ['Use the inverse: if sin θ = 0.5 then θ = sin⁻¹(0.5) = 30°.', 'استخدم المعكوس: إذا sin θ = ٠٫٥ فإن θ = sin⁻¹(٠٫٥) = ٣٠°.'], dia: function () { return D.tri({ right: 0, sides: ['8', null, '6'], angles: [null, 'θ', null] }); } }, ['Choose the ratio from the sides you have, divide, then press the inverse.', 'اختر النسبة من الضلعين، واقسم، ثم استخدم المعكوس.']],
    calc: true,
    g: function (r, lv) {
      var o = r.int(2, 15), a = r.int(2, 15), h = o + a + r.int(1, 5), t = dp(Math.atan(o / a) * 180 / Math.PI, 1), s = dp(Math.asin(o / h) * 180 / Math.PI, 1), c0 = dp(Math.acos(a / h) * 180 / Math.PI, 1);
      if (lv === 1) return { q: ['Opposite ' + o + ', adjacent ' + a + '. Which is the right first line?', 'المقابل ' + o + ' والمجاور ' + a + '. أي سطر أول صحيح؟'], o: TM.same(['tan θ = ' + o + ' ÷ ' + a, 'sin θ = ' + o + ' ÷ ' + a, 'cos θ = ' + o + ' ÷ ' + a]), dia: D.tri({ right: 0, sides: [a, null, o], angles: [null, 'θ', null] }), s: [['Opposite and adjacent: tan', 'المقابل والمجاور: tan', 'tan θ = ' + o + ' ÷ ' + a]] };
      if (lv === 2) return { q: ['Opposite ' + o + ', adjacent ' + a + '. Find θ to 1 decimal place.', 'المقابل ' + o + ' والمجاور ' + a + '. أوجد θ إلى منزلة عشرية.'], dia: D.tri({ right: 0, sides: [a, null, o], angles: [null, 'θ', null] }), eq: 'tan⁻¹(' + o + ' ÷ ' + a + ')', a: t, s: [['Ratio', 'النسبة', o + ' ÷ ' + a + ' ≈', dp(o / a, 3)], ['Inverse tan', 'معكوس tan', 'θ ≈', t]], miss: [[dp(o / a, 3), 'That is the ratio. Now use inverse tan.', 'هذه النسبة. استخدم معكوس tan.']] };
      return { q: ['Opposite ' + o + ', hypotenuse ' + h + '. Find θ to 1 decimal place.', 'المقابل ' + o + ' والوتر ' + h + '. أوجد θ إلى منزلة عشرية.'], dia: D.tri({ right: 0, sides: [null, h, o], angles: [null, 'θ', null] }), eq: 'sin⁻¹(' + o + ' ÷ ' + h + ')', a: s, s: [['Ratio', 'النسبة', o + ' ÷ ' + h + ' ≈', dp(o / h, 3)], ['Inverse sin', 'معكوس sin', 'θ ≈', s]] };
    },
    trap: function (r) { return { eq: 'sin θ = 0.5', w: 0, why: ['sin⁻¹ means the inverse, not 1 ÷ sin.', 'sin⁻¹ تعني المعكوس لا ١ ÷ sin.'], l: [['θ = 1 ÷ sin 0.5', 'θ = 1 ÷ sin 0.5'], ['Press the keys in order', 'اضغط المفاتيح بالترتيب'], ['θ is an angle in degrees', 'θ زاوية بالدرجات']] }; },
    explain: [['What does sin⁻¹ do?', 'ماذا تفعل sin⁻¹؟'], ['Takes a ratio and gives back the angle.', 'تأخذ النسبة وتعيد الزاوية.'], ['Gives 1 ÷ sin.', 'تعطي ١ ÷ sin.'], ['Squares the sine.', 'تربع sin.']]
  });

  teach('d9.loci', {
    why: ['A guard dog on a chain, a phone mast\'s range, a path equal from two walls: geometry on real ground.', 'كلب حراسة بسلسلة ومدى برج اتصال ومسار متساوٍ من جدارين: هندسة على الأرض.'],
    idea: [{ p: ['A locus is every point obeying a rule. A fixed distance from a point makes a circle.', 'المحل الهندسي كل النقاط التي تتبع قاعدة. والبعد الثابت عن نقطة يعطي دائرة.'], dia: function () { return D.circle({ r: 'd' }); } }, ['Equal from two points: the perpendicular bisector. Equal from two lines: the angle bisector.', 'المتساوي عن نقطتين: العمود المنصّف. وعن خطين: منصّف الزاوية.']],
    g: function (r, lv) {
      var pool = lv === 1 ? [[['All points 5 cm from a point form', 'النقاط على بعد ٥ سم من نقطة تكوّن'], ['a circle.', 'دائرة.'], ['a square.', 'مربعًا.'], ['a straight line.', 'خطًا مستقيمًا.']], [['All points 2 m from a straight wall form', 'النقاط على بعد ٢ م من جدار مستقيم تكوّن'], ['a line parallel to the wall.', 'خطًا موازيًا للجدار.'], ['a circle.', 'دائرة.'], ['one point.', 'نقطة واحدة.']]] : lv === 2 ? [[['All points equally far from A and B form', 'النقاط المتساوية البعد عن A وB تكوّن'], ['the perpendicular bisector of AB.', 'العمود المنصّف لـ AB.'], ['the line AB.', 'الخط AB.'], ['a circle round A.', 'دائرة حول A.']], [['All points equally far from two crossing roads form', 'النقاط المتساوية البعد عن طريقين متقاطعين تكوّن'], ['the angle bisectors.', 'منصّفي الزاويتين.'], ['a circle.', 'دائرة.'], ['the roads themselves.', 'الطريقين.']]] : [[['Which points are closer to A than to B?', 'أي النقاط أقرب إلى A من B؟'], ['Those on A\'s side of the perpendicular bisector.', 'التي في جهة A من العمود المنصّف.'], ['Those on the line AB only.', 'التي على AB فقط.'], ['Those on a circle round B.', 'التي على دائرة حول B.']], [['A goat on a 3 m rope tied to the middle of a long wall can reach', 'ماعز بحبل ٣ م مربوط في وسط جدار طويل يصل إلى'], ['a semicircle against the wall.', 'نصف دائرة عند الجدار.'], ['a full circle.', 'دائرة كاملة.'], ['a square.', 'مربع.']]], x = r.pick(pool);
      return { q: x[0], o: [x[1], x[2], x[3]], s: [['Picture several points that obey the rule', 'تخيّل عدة نقاط تتبع القاعدة', x[1]]] };
    },
    trap: function (r) { return { w: 1, q: ['Facts about loci. One line is wrong. Tap it.', 'حقائق عن المحل الهندسي. سطر واحد خاطئ. انقر عليه.'], why: ['Equal distance from two points gives the perpendicular bisector, not a circle.', 'التساوي عن نقطتين يعطي العمود المنصّف لا دائرة.'], l: [['Fixed distance from a point: a circle', 'بعد ثابت عن نقطة: دائرة'], ['Equal from two points: a circle', 'تساوٍ عن نقطتين: دائرة'], ['Equal from two lines: an angle bisector', 'تساوٍ عن خطين: منصّف زاوية']] }; },
    explain: [['Three towns want a mast equally far from all of them. How do you find the spot?', 'ثلاث مدن تريد برجًا بأبعاد متساوية. كيف تجد الموقع؟'], ['Where two perpendicular bisectors meet.', 'حيث يلتقي عمودان منصّفان.'], ['Pick the middle town.', 'اختر المدينة الوسطى.'], ['It is impossible.', 'مستحيل.']]
  });

  teach('d9.cumul', {
    why: ['"At least one" problems are often easiest backwards. This trick saves a lot of work.', 'مسائل «واحد على الأقل» أسهل غالبًا عكسيًا، وهذه الحيلة توفر جهدًا كبيرًا.'],
    idea: [['P(not A) = 1 − P(A). All chances add to 1.', 'P(ليس A) = ١ − P(A). الاحتمالات كلها مجموعها ١.'], ['P(at least one six in two rolls) = 1 − P(no six) = 1 − 5/6 × 5/6 = 11/36.', 'احتمال ٦ واحدة على الأقل في رميتين = ١ − ٥/٦ × ٥/٦ = ١١/٣٦.']],
    g: function (r, lv) {
      var p = r.pick([.1, .2, .25, .3, .4, .05, .15]), f = r.pick([[1, 4], [1, 6], [2, 5], [3, 8], [3, 10]]), n = f[1] - f[0];
      if (lv === 1) return { q: ['The chance of rain is ' + p + '. What is the chance of no rain?', 'احتمال المطر ' + p + '. ما احتمال عدمه؟'], eq: '1 − ' + p, a: dp(1 - p, 4), s: [['Take from 1', 'اطرح من ١', '1 − ' + p + ' =', dp(1 - p, 4)]] };
      if (lv === 2) return { q: ['Chance of winning is ' + f[0] + '/' + f[1] + '. What is the chance of not winning, in simplest form?', 'احتمال الفوز ' + f[0] + '/' + f[1] + '. ما احتمال عدم الفوز في أبسط صورة؟'], eq: '1 − ' + f[0] + '/' + f[1], a: low(n, f[1]), s: [['1 as ' + f[1] + ' parts', '١ على شكل ' + f[1] + ' أجزاء', f[1] + ' − ' + f[0] + ' =', n], ['Over ' + f[1], 'على ' + f[1], n + '/' + f[1] + ' =', low(n, f[1])]] };
      var nn = n * n, dd = f[1] * f[1], at = low(dd - nn, dd);
      return { q: ['Chance of a win each round is ' + f[0] + '/' + f[1] + '. What is the chance of at least one win in two rounds? Simplest form.', 'احتمال الفوز في كل جولة ' + f[0] + '/' + f[1] + '. ما احتمال فوز واحد على الأقل في جولتين؟ أبسط صورة.'], a: at, s: [['Chance of no win twice', 'احتمال عدم الفوز مرتين', n + ' × ' + n + ' =', nn], ['Over', 'على', f[1] + ' × ' + f[1] + ' =', dd], ['Take from 1', 'اطرح من ١', dd + ' − ' + nn + ' =', dd - nn], ['Simplify', 'بسّط', (dd - nn) + '/' + dd + ' =', at]], miss: [[low(2 * f[0], f[1]), 'Adding counts the double win twice. Work out "no win" first.', 'الجمع يعدّ الفوزين مرتين. احسب «عدم الفوز» أولًا.']] };
    },
    trap: function (r) { return { eq: '1/6 , 1/6', w: 0, why: ['Adding counts two sixes twice. Use 1 − 25/36.', 'الجمع يعدّ الستتين مرتين. استخدم ١ − ٢٥/٣٦.'], q: ['Chance of at least one six in two rolls. One line is wrong. Tap it.', 'احتمال ستة واحدة على الأقل في رميتين. سطر واحد خاطئ. انقر عليه.'], l: [['Add the chances: 1/6 + 1/6', 'اجمع: 1/6 + 1/6'], '1/6 + 1/6 = 1/3', ['It seems reasonable', 'يبدو معقولًا']] }; },
    explain: [['Why not simply add the chance of a six on each die?', 'لماذا لا نجمع احتمال الستة على كل نرد؟'], ['Then two sixes are counted twice.', 'تُعدّ الستتان مرتين.'], ['Adding is forbidden in probability.', 'الجمع ممنوع في الاحتمال.'], ['You can.', 'يمكن.']]
  });

  /* ---------- harder algebra, shape and chance ---------- */
  teach('x9m.alg', {
    why: ['Index laws with letters are the grammar of advanced algebra.', 'قوانين القوى بالحروف هي نحو الجبر المتقدم.'],
    idea: [['Treat numbers and letters separately. 3x² × 4x³ = 12x⁵: multiply numbers, add powers.', 'عامل الأعداد والحروف منفصلة. 3x² × 4x³ = 12x⁵: اضرب الأعداد واجمع الأسس.'], ['(2x³)² = 4x⁶: square the number, double the power.', '(2x³)² = 4x⁶: ربّع العدد وضاعف الأس.']],
    g: function (r, lv) {
      var a = r.int(2, 7), b = r.int(2, 7), m = r.int(2, 6), n = r.int(2, 6), sup = function (k) { return String(k).split('').map(function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]; }).join(''); };
      if (lv === 1) return { q: ['Multiply. Type the number in front.', 'اضرب. اكتب العدد في المقدمة.'], eq: a + 'x' + sup(m) + ' × ' + b + 'x' + sup(n), a: a * b, s: [['Multiply the numbers', 'اضرب الأعداد', a + ' × ' + b + ' =', a * b]], miss: [[a + b, 'Numbers multiply. Only powers add.', 'الأعداد تُضرب. الأسس فقط تُجمع.']] };
      if (lv === 2) return { q: ['Multiply. Type the new power of x.', 'اضرب. اكتب أس x الجديد.'], eq: a + 'x' + sup(m) + ' × ' + b + 'x' + sup(n), a: m + n, s: [['Add the powers', 'اجمع الأسس', m + ' + ' + n + ' =', m + n]], miss: [[m * n, 'Add the powers when multiplying.', 'اجمع الأسس عند الضرب.']] };
      return { q: ['Type the number in front, after working out the power of the bracket.', 'اكتب العدد في المقدمة بعد حساب قوة القوس.'], eq: '(' + a + 'x' + sup(m) + ')²', a: a * a, s: [['Square the number', 'ربّع العدد', a + ' × ' + a + ' =', a * a], ['Double the power too', 'وضاعف الأس', 'x' + sup(2 * m)]], miss: [[2 * a, 'Square the number: ' + a + ' × ' + a + '.', 'ربّع العدد: ' + a + ' × ' + a + '.']] };
    },
    trap: function (r) { return { eq: '(2x³)²', w: 0, why: ['Square the 2 as well: 4x⁶.', 'ربّع ٢ أيضًا: 4x⁶.'], l: [['(2x³)² = 2x⁶', '(2x³)² = 2x⁶'], ['Check with x = 1: 2', 'تحقق عند x = 1: ٢'], ['But (2)² = 4', 'لكن (٢)² = ٤']] }; },
    explain: [['Why do 3x² and 4x³ not add to 7x⁵?', 'لماذا 3x² و4x³ لا تجمعان إلى 7x⁵؟'], ['They are not like terms, so they cannot be joined by adding.', 'ليسا حدين متشابهين فلا يُجمعان.'], ['They can.', 'بل يجمعان.'], ['Because 7 is prime.', 'لأن ٧ أولي.']]
  });

  teach('x9m.p3d', {
    why: ['How long a rod fits in a box? Pythagoras works twice in three dimensions.', 'كم طول العصا التي تدخل صندوقًا؟ فيثاغورس يعمل مرتين في الأبعاد الثلاثة.'],
    idea: [{ p: ['The diagonal of a box: d² = a² + b² + c². It comes from using Pythagoras twice.', 'قطر الصندوق: d² = a² + b² + c²، من استخدام فيثاغورس مرتين.'], dia: function () { return D.cuboid('a', 'b', 'c'); } }, ['First the floor diagonal, then with the height.', 'قطر الأرضية أولًا ثم مع الارتفاع.']],
    g: function (r, lv) {
      var S = r.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [6, 6, 7, 11], [2, 10, 11, 15], [3, 4, 12, 13]]), a = S[0], b = S[1], c = S[2], d = S[3];
      if (lv === 1) return { q: ['A box floor is ' + a + ' by ' + b + '. Find the square of its floor diagonal.', 'أرضية صندوق ' + a + ' × ' + b + '. أوجد مربع قطر الأرضية.'], eq: a + '² + ' + b + '²', dia: D.cuboid(a, b, c), a: a * a + b * b, s: [['Square and add', 'ربّع واجمع', a + '² + ' + b + '² =', a * a + b * b]] };
      if (lv === 2) return { q: ['Find the long diagonal of a box ' + a + ' by ' + b + ' by ' + c + '.', 'أوجد القطر الطويل لصندوق ' + a + ' × ' + b + ' × ' + c + '.'], eq: '√(' + a + '² + ' + b + '² + ' + c + '²)', dia: D.cuboid(a, b, c), a: d, s: [['Square and add all three', 'ربّع واجمع الثلاثة', a + '² + ' + b + '² + ' + c + '² =', d * d], ['Square root', 'الجذر', '√' + (d * d) + ' =', d]], miss: [[a + b + c, 'Square them first.', 'ربّعها أولًا.'], [d * d, 'Now take the square root.', 'الآن خذ الجذر.']] };
      return { q: ['A rod of length ' + d + ' just fits corner to corner in a box ' + a + ' by ' + b + ' by h. Find h.', 'عصا طولها ' + d + ' تتسع من ركن إلى ركن في صندوق ' + a + ' × ' + b + ' × h. أوجد h.'], eq: d + '² − ' + a + '² − ' + b + '²', a: c, s: [['Take the squares off', 'اطرح المربعات', d + '² − ' + a + '² − ' + b + '² =', c * c], ['Square root', 'الجذر', '√' + (c * c) + ' =', c]] };
    },
    trap: function (r) { return { eq: '3 , 4 , 12', w: 1, why: ['Square all three: 9 + 16 + 144 = 169, whose root is 13.', 'ربّع الثلاثة: ٩ + ١٦ + ١٤٤ = ١٦٩ وجذرها ١٣.'], l: ['3² + 4² = 25', '√25 + 12 = 15', ['So the diagonal is 15', 'فالقطر ١٥']] }; },
    explain: [['Why does Pythagoras work twice here?', 'لماذا يعمل فيثاغورس مرتين هنا؟'], ['The floor diagonal and the height form a new right-angled triangle.', 'قطر الأرضية والارتفاع يكوّنان مثلثًا قائمًا جديدًا.'], ['Because boxes have two ends.', 'لأن للصندوق طرفين.'], ['It does not work.', 'لا يعمل.']]
  });

  teach('x9m.recur', {
    why: ['Every recurring decimal is a fraction in disguise. Algebra can unmask it in two lines.', 'كل عشري دوري كسر متنكر، والجبر يكشفه في سطرين.'],
    idea: [['Let x = 0.333... Then 10x = 3.333... Subtract: 9x = 3, so x = 1/3.', 'ليكن x = ٠٫٣٣٣... فـ ١٠x = ٣٫٣٣٣... اطرح: ٩x = ٣ فـ x = ١/٣.'], ['Two digits repeat? Use 100x: then 99x.', 'رقمان يتكرران؟ استخدم ١٠٠x فيكون ٩٩x.']],
    g: function (r, lv) {
      if (lv === 1) { var d = r.int(1, 8); return { q: ['Write 0.' + d + d + d + '... as a fraction in simplest form.', 'اكتب ٠٫' + d + d + d + '... كسرًا في أبسط صورة.'], eq: '10x − x = 9x', a: low(d, 9), s: [['Let x be the decimal, then 10x', 'ليكن x العشري ثم 10x', '10x − x = 9x'], ['Subtract', 'اطرح', '9x =', d], ['Simplify', 'بسّط', d + '/9 =', low(d, 9)]], miss: [[d + '/10', '0.' + d + ' stops. A recurring one goes over 9.', '٠٫' + d + ' تتوقف، أما الدوري فعلى ٩.']] }; }
      if (lv === 2) { var n = r.int(11, 89); if (n % 11 === 0) n++; return { q: ['Write 0.' + n + n + '... as a fraction in simplest form.', 'اكتب ٠٫' + n + n + '... كسرًا في أبسط صورة.'], a: low(n, 99), s: [['Two repeat, so 100x', 'رقمان يتكرران فـ 100x', '100x − x = 99x'], ['So', 'إذن', '99x =', n], ['Simplify', 'بسّط', n + '/99 =', low(n, 99)]], miss: [[low(n, 100), 'That stops after two digits. Recurring goes over 99.', 'هذا يتوقف بعد رقمين. الدوري على ٩٩.']] }; }
      var t = r.pick([[1, 3], [2, 3], [1, 9], [4, 9], [5, 11], [1, 6]]);
      return { q: ['Which fraction gives a recurring decimal?', 'أي كسر يعطي عشريًا دوريًا؟'], o: TM.same([t[0] + '/' + t[1], '1/4', '3/8']), s: [['A bottom with only 2 and 5 stops', 'المقام بعوامل ٢ و٥ فقط يتوقف', ['Others recur', 'والباقي دوري']], ['Here', 'هنا', t[0] + ' ÷ ' + t[1] + ' ≈ ' + dp(t[0] / t[1], 4)]] };
    },
    trap: function (r) { return { eq: '0.777...', w: 1, why: ['10x − x = 9x, so x = 7/9.', '10x − x = 9x فـ x = 7/9.'], l: ['10x = 7.777...', ['10x − x = 10x', '10x − x = 10x'], ['So x = 7/10', 'إذن x = 7/10']] }; },
    explain: [['Why multiply by 10 at all?', 'لماذا نضرب في ١٠ أصلًا؟'], ['So the endless tail lines up and cancels when you subtract.', 'ليتراصف الذيل اللامنتهي ويُلغى بالطرح.'], ['To get a bigger number.', 'للحصول على عدد أكبر.'], ['Because the base is 10.', 'لأن الأساس ١٠.']]
  });

  teach('x9m.indep', {
    why: ['Does the first draw change the second? Getting this wrong is the commonest mistake in probability.', 'هل يغيّر السحب الأول الثاني؟ الخطأ هنا أشيع أخطاء الاحتمال.'],
    idea: [['Independent: one event does not affect the other. Put the ball back, and the chances stay the same.', 'المستقلان: لا يؤثر أحدهما في الآخر. أرجع الكرة تبقَ الاحتمالات.'], ['Dependent: do not replace it, and the second fraction changes: 3/10, then 2/9.', 'التابعان: لا ترجعها فيتغير الكسر الثاني: ٣/١٠ ثم ٢/٩.']],
    g: function (r, lv) {
      var red = r.int(2, 6), tot = red + r.int(2, 7);
      if (lv === 1) { var e = r.pick([[['Rolling a die twice', 'رمي نرد مرتين'], ['Independent', 'مستقلان']], [['Drawing 2 cards and not replacing', 'سحب بطاقتين دون إرجاع'], ['Dependent', 'تابعان']], [['Tossing a coin then rolling a die', 'رمي عملة ثم نرد'], ['Independent', 'مستقلان']]]); return { q: [e[0][0] + '. What kind of events?', e[0][1] + '. ما نوع الحدثين؟'], o: [e[1], e[1][0] === 'Independent' ? ['Dependent', 'تابعان'] : ['Independent', 'مستقلان'], ['Impossible', 'مستحيلان']], s: [['Does the first change the second?', 'هل يغيّر الأول الثاني؟', e[1]]] }; }
      if (lv === 2) return { q: ['With replacement: ' + red + ' red out of ' + tot + ', drawn twice. What is the chance of two reds? Simplest form.', 'مع الإرجاع: ' + red + ' حمراء من ' + tot + '، سحب مرتين. ما احتمال حمراوين؟ أبسط صورة.'], eq: red + '/' + tot + ' × ' + red + '/' + tot, a: low(red * red, tot * tot), s: [['Tops', 'البسطان', red + ' × ' + red + ' =', red * red], ['Bottoms', 'المقامان', tot + ' × ' + tot + ' =', tot * tot], ['Simplify', 'بسّط', (red * red) + '/' + (tot * tot) + ' =', low(red * red, tot * tot)]] };
      return { q: ['No replacement: ' + red + ' red out of ' + tot + ', drawn twice. What is the chance of two reds? Simplest form.', 'دون إرجاع: ' + red + ' حمراء من ' + tot + '، سحب مرتين. ما احتمال حمراوين؟ أبسط صورة.'], eq: red + '/' + tot + ' × ' + (red - 1) + '/' + (tot - 1), a: low(red * (red - 1), tot * (tot - 1)), s: [['Tops: one fewer red', 'البسطان: حمراء أقل', red + ' × ' + (red - 1) + ' =', red * (red - 1)], ['Bottoms: one fewer in all', 'المقامان: واحدة أقل', tot + ' × ' + (tot - 1) + ' =', tot * (tot - 1)], ['Simplify', 'بسّط', (red * (red - 1)) + '/' + (tot * (tot - 1)) + ' =', low(red * (red - 1), tot * (tot - 1))]], miss: [[low(red * red, tot * tot), 'That puts the ball back. Without replacing, one fewer is left.', 'هذا يعيد الكرة. دون إرجاع تبقى واحدة أقل.']] };
    },
    trap: function (r) { return { eq: '3/10', w: 1, q: ['3 red of 10, drawn twice without replacing. One line is wrong. Tap it.', '٣ حمراء من ١٠، سحب مرتين دون إرجاع. سطر واحد خاطئ. انقر عليه.'], why: ['One red and one ball have gone: 2/9.', 'ذهبت حمراء وكرة: ٢/٩.'], l: [['First: 3/10', 'الأول: 3/10'], ['Second: 3/10', 'الثاني: 3/10'], ['Multiply them', 'اضربهما']] }; },
    explain: [['Is a coin more likely to land tails after five heads?', 'هل الظهر أرجح بعد خمسة وجوه؟'], ['No. Tosses are independent.', 'لا. الرميات مستقلة.'], ['Yes, tails is due.', 'نعم، حان دوره.'], ['Yes, slightly.', 'نعم قليلًا.']]
  });

  teach('x9m.cum', {
    why: ['Medians and percentiles from big data: how doctors chart a baby\'s growth.', 'الوسيط والمئينات من بيانات كبيرة: هكذا يتابع الأطباء نمو الرضيع.'],
    idea: [{ p: ['Cumulative frequency adds up as you go. Plot it to get an S shape.', 'التكرار التراكمي يتزايد تجميعًا، ويُرسم فيعطي شكل S.'], dia: function () { return D.axes({ x: [0, 40], y: [0, 40], step: 10, polyline: [[0, 0], [10, 4], [20, 16], [30, 32], [40, 40]], pts: [[20, 16], [30, 32]] }); } }, ['The median is read at half way up. The lower and upper quartiles at a quarter and three quarters.', 'الوسيط يُقرأ عند المنتصف، والربيعان عند الربع وثلاثة الأرباع.']],
    g: function (r, lv) {
      var f = [r.int(2, 6), r.int(5, 10), r.int(6, 12), r.int(2, 6)], c = []; f.reduce(function (a, b, i) { return c[i] = a + b; }, 0); var i = r.int(1, 3), tot = c[3];
      if (lv === 1) return { q: ['Frequencies: ' + f.join(', ') + '. What is the cumulative frequency after group ' + (i + 1) + '?', 'التكرارات: ' + f.join('، ') + '. ما التكرار التراكمي بعد الفئة ' + (i + 1) + '؟'], eq: f.slice(0, i + 1).join(' + '), a: c[i], s: [['Keep adding', 'واصل الجمع', f.slice(0, i + 1).join(' + ') + ' =', c[i]]], miss: [[f[i], 'That is this group alone. Add the ones before too.', 'هذه الفئة وحدها. اجمع ما قبلها.']] };
      var n = 4 * r.int(10, 50);
      if (lv === 2) return { q: ['There are ' + n + ' people. How far up the axis do you read the median?', 'الأشخاص ' + n + '. عند أي ارتفاع تقرأ الوسيط؟'], eq: n + ' ÷ 2', a: n / 2, s: [['Half way', 'المنتصف', n + ' ÷ 2 =', n / 2]] };
      var q1 = r.int(20, 40), q3 = q1 + r.int(5, 25);
      return { q: ['The lower quartile is ' + q1 + ' and the upper quartile is ' + q3 + '. Find the interquartile range.', 'الربيع الأدنى ' + q1 + ' والأعلى ' + q3 + '. أوجد المدى الربيعي.'], eq: q3 + ' − ' + q1, a: q3 - q1, s: [['Upper − lower', 'الأعلى − الأدنى', q3 + ' − ' + q1 + ' =', q3 - q1]], miss: [[q3 + q1, 'Range is a gap, so subtract.', 'المدى فرق، فاطرح.']] };
    },
    trap: function (r) { return { eq: '3 , 5 , 8', w: 1, why: ['Keep adding up: 3, 8, then 16.', 'واصل الجمع: ٣ و٨ ثم ١٦.'], l: ['3', '5', '16'] }; },
    explain: [['Why is the interquartile range useful?', 'لماذا المدى الربيعي مفيد؟'], ['It measures the spread of the middle half, ignoring extremes.', 'يقيس انتشار النصف الأوسط مهملًا الأطراف.'], ['It is bigger than the range.', 'أكبر من المدى.'], ['It shows the mean.', 'يُظهر المتوسط.']]
  });

  teach('x9m.logic', {
    why: ['Competition maths loves parity: one small observation closes a whole case.', 'رياضيات المسابقات تحب الزوجية: ملاحظة صغيرة تغلق المسألة.'],
    idea: [['If a quantity keeps the same oddness after each move, it can never reach the other kind.', 'إذا حافظ مقدار على فرديته بعد كل حركة، فلن يبلغ النوع الآخر أبدًا.'], ['Remove two opposite corners of a chessboard. Dominoes cover one black and one white, but now the colours are unequal, so it cannot be tiled.', 'أزل ركنين متقابلين من لوح الشطرنج. الدومينو يغطي أسود وأبيض، والألوان الآن غير متساوية فلا يمكن التغطية.']],
    g: function (r, lv) {
      var n = r.int(3, 9), m = r.int(3, 9);
      if (lv === 1) { var even = (n * m) % 2 === 0, O = [['Yes', 'نعم'], ['No', 'لا'], ['Only sometimes', 'أحيانًا فقط']]; return { q: ['Can a board of ' + n + ' by ' + m + ' be fully covered by 2-square dominoes?', 'هل يُغطى لوح ' + n + ' × ' + m + ' كاملًا بقطع دومينو من مربعين؟'], o: even ? [O[0], O[1], O[2]] : [O[1], O[0], O[2]], s: [['Each domino covers 2', 'كل قطعة تغطي مربعين', n + ' × ' + m + ' =', n * m], [even ? 'An even number: possible' : 'An odd number: impossible', even ? 'عدد زوجي: ممكن' : 'عدد فردي: مستحيل', ['Check oddness', 'راجع الزوجية']]] }; }
      if (lv === 2) { var k = r.int(4, 9), allodd = k * 2 + 1; return { q: ['You add ' + allodd + ' odd numbers. Is the sum odd or even?', 'تجمع ' + allodd + ' أعداد فردية. هل المجموع فردي أم زوجي؟'], o: [['Odd', 'فردي'], ['Even', 'زوجي'], ['Cannot tell', 'لا يمكن الجزم']], s: [['Pairs make even, one is left', 'الأزواج زوجية ويبقى واحد', allodd + ' ÷ 2 ≈ ' + dp(allodd / 2, 1)]] }; }
      var st = r.int(2, 9) * 2 + 1;
      return { q: ['You start at ' + st + ' and each move adds or subtracts 2. Can you ever reach 100?', 'تبدأ من ' + st + ' وكل حركة تضيف ٢ أو تطرحها. هل تصل إلى ١٠٠؟'], o: [['No: the number stays odd after every move.', 'لا: يبقى العدد فرديًا بعد كل حركة.'], ['Yes: keep adding.', 'نعم: واصل الجمع.'], ['Yes, in exactly 50 moves.', 'نعم في ٥٠ حركة بالضبط.']], s: [['What never changes?', 'ما الذي لا يتغير؟', [st + ' is odd', st + ' فردي']], ['Adding 2 keeps it odd', 'جمع ٢ يبقيه فرديًا', ['100 is even', '١٠٠ زوجي']]] };
    },
    trap: function (r) { return { w: 1, q: ['Chessboard with two opposite corners removed. One line is wrong. Tap it.', 'لوح شطرنج أُزيل ركنان متقابلان. سطر واحد خاطئ. انقر عليه.'], why: ['Opposite corners share a colour, so the colours are unequal.', 'الركنان المتقابلان بلون واحد فتختل الألوان.'], l: [['62 squares remain', 'يبقى ٦٢ مربعًا'], ['The colours are still equal', 'الألوان ما زالت متساوية'], ['A domino covers one of each', 'الدومينو يغطي من كل لون واحدًا']] }; },
    explain: [['What is an invariant?', 'ما هو الثابت؟'], ['Something that stays the same whatever moves you make.', 'شيء يبقى كما هو مهما كانت الحركات.'], ['A number that keeps growing.', 'عدد يزداد دائمًا.'], ['A kind of triangle.', 'نوع من المثلثات.']]
  });
})();
