/* Maths taught in full, Year 10 (IGCSE). See lesson/teach.js for the shape of a topic. */
(function () {
  'use strict';
  var C = window.C, D = window.Dia, teach = C.teach, TM = C.TM, gcd = TM.gcd, low = TM.low, dp = TM.dp, mn = TM.m, sg = TM.sg;
  var rad = function (d) { return d * Math.PI / 180; };

  /* ---------- algebra and functions ---------- */
  teach('m10.formula', {
    why: ['Some quadratics refuse to factorise. The formula, set out by al-Khwārizmī\'s tradition, solves them all.', 'بعض التربيعيات لا تتحلل، والصيغة، في تقليد الخوارزمي، تحلها جميعًا.'],
    idea: [['For ax² + bx + c = 0: x = (−b ± √(b² − 4ac)) ÷ 2a.', 'في ax² + bx + c = 0: x = (−b ± √(b² − 4ac)) ÷ 2a.'], ['b² − 4ac is the discriminant. Positive: two answers. Zero: one. Negative: none.', 'b² − 4ac هو المميز. موجب: حلان. صفر: حل. سالب: لا حل.']],
    calc: true,
    g: function (r, lv) {
      var a = r.int(1, 3), b = r.int(1, 9), c = -r.int(1, 9), disc = b * b - 4 * a * c, rt = Math.sqrt(disc), big = dp((-b + rt) / (2 * a), 2);
      if (lv === 1) return { q: ['Find the discriminant b² − 4ac.', 'أوجد المميز b² − 4ac.'], eq: a + 'x² + ' + b + 'x − ' + (-c) + ' = 0', a: disc, s: [['b²', 'b²', b + ' × ' + b + ' =', b * b], ['4ac', '4ac', '4 × ' + a + ' × ' + (-c) + ' =', 4 * a * -c], ['c is negative, so add', 'c سالب فاجمع', (b * b) + ' + ' + (4 * a * -c) + ' =', disc]], miss: [[b * b + 4 * a * c, 'Minus × minus: c is negative, so −4ac adds.', 'سالب × سالب: c سالب فـ −4ac تجمع.']] };
      if (lv === 2) { var d2 = r.pick([[1, -4, 3], [1, 2, 5], [1, -6, 9], [2, 1, 3], [1, 5, 2]]), D0 = d2[1] * d2[1] - 4 * d2[0] * d2[2], k = D0 > 0 ? 0 : D0 === 0 ? 1 : 2, O = [['Two', 'حلان'], ['One', 'حل واحد'], ['None', 'لا حل']]; return { q: ['How many real solutions?', 'كم حلًا حقيقيًا؟'], eq: d2[0] + 'x² ' + sg(d2[1]) + 'x ' + sg(d2[2]) + ' = 0', o: [O[k]].concat(O.filter(function (x, i) { return i !== k; })), s: [['The discriminant', 'المميز', (d2[1] < 0 ? '(' + mn(d2[1]) + ')' : d2[1]) + '² − 4 × ' + d2[0] + ' × ' + d2[2] + ' =', mn(D0)]] }; }
      return { q: ['Solve with the formula. Give the bigger answer to 2 decimal places.', 'حلّ بالصيغة. أعط الحل الأكبر إلى منزلتين.'], eq: a + 'x² + ' + b + 'x − ' + (-c) + ' = 0', a: big, s: [['The discriminant', 'المميز', b + '² − 4 × ' + a + ' × (' + mn(c) + ') =', disc], ['Its root', 'جذره', '√' + disc + ' ≈', dp(rt, 3)], ['Plus for the bigger', 'الموجب للأكبر', '(−' + b + ' + ' + dp(rt, 3) + ') ÷ ' + (2 * a) + ' ≈', big]], miss: [[dp((-b - rt) / (2 * a), 2), 'That is the smaller. Use the plus.', 'هذا الأصغر. استخدم الموجب.'], [dp((b + rt) / (2 * a), 2), 'Start from −b, not +b.', 'ابدأ من −b لا +b.']] };
    },
    trap: function (r) { return { eq: 'x² + 3x − 4 = 0', w: 1, why: ['−4ac = −4 × 1 × (−4) = +16, so 9 + 16 = 25.', '−4ac = −4 × 1 × (−4) = +16 فـ 9 + 16 = 25.'], l: ['3² = 9', ['b² − 4ac = 9 − 16', 'b² − 4ac = 9 − 16'], ['So no solution', 'فلا حل']] }; },
    explain: [['What does a negative discriminant mean on the graph?', 'ماذا يعني المميز السالب على الرسم؟'], ['The curve never touches the x axis.', 'لا يمس المنحنى محور x.'], ['It crosses twice.', 'يقطعه مرتين.'], ['It is a straight line.', 'خط مستقيم.']]
  });

  teach('m10.funcs', {
    why: ['A function is a machine: one input, one output. Programming and science are built on them.', 'الدالة آلة: مدخل واحد ومخرج واحد، وعليها تقوم البرمجة والعلوم.'],
    idea: [['f(x) = 2x + 1 means: double, then add 1. f(3) = 7.', 'f(x) = 2x + 1 تعني: ضاعف ثم أضف ١. f(3) = 7.'], ['Put what is in the bracket wherever you see x, even if it is a letter or a negative.', 'ضع ما في القوس مكان x، حتى لو كان حرفًا أو سالبًا.']],
    g: function (r, lv) {
      var m = r.int(2, 6), c = r.int(-6, 9), x = r.int(lv === 1 ? 1 : -5, 7), f = 'f(x) = ' + m + 'x ' + sg(c), y = m * x + c;
      if (lv < 3) return { q: ['Find f(' + mn(x) + ').', 'أوجد f(' + mn(x) + ').'], eq: f, a: y, s: [['Replace x', 'ضع مكان x', m + ' × ' + (x < 0 ? '(' + mn(x) + ')' : x) + ' =', mn(m * x)], ['Then ' + (c < 0 ? 'take away ' + (-c) : 'add ' + c), 'ثم ' + (c < 0 ? 'اطرح ' + (-c) : 'أضف ' + c), mn(m * x) + ' ' + sg(c) + ' =', mn(y)]], miss: [[m + x + c, 'That adds ' + m + ' and x. ' + m + 'x means multiply.', 'هذا جمع. ' + m + 'x تعني ضربًا.']] };
      return { q: ['For which x is f(x) = ' + mn(y) + '?', 'عند أي x تكون f(x) = ' + mn(y) + '؟'], eq: f, a: x, s: [['Undo the ' + (c < 0 ? 'minus' : 'plus'), 'اعكس', mn(y) + ' ' + sg(-c) + ' =', mn(y - c)], ['Divide by ' + m, 'اقسم على ' + m, mn(y - c) + ' ÷ ' + m + ' =', mn(x)]], miss: [[m * y + c, 'That is f(' + mn(y) + '). Here you know the output: work backwards.', 'هذا f(' + mn(y) + '). هنا تعرف المخرج: اعمل عكسيًا.']] };
    },
    trap: function (r) { return { eq: 'f(x) = x² , f(−3)', w: 0, why: ['(−3)² = 9. The bracket squares the minus too.', '(−٣)² = ٩. القوس يربع السالب أيضًا.'], l: ['(−3)² = −9', 'f(−3) = −9', ['A negative output', 'مخرج سالب']] }; },
    explain: [['Is f(x + 1) the same as f(x) + 1?', 'هل f(x + 1) هي f(x) + 1؟'], ['No: one changes the input, the other the output.', 'لا: أحدهما يغيّر المدخل والآخر المخرج.'], ['Yes, always.', 'نعم دائمًا.'], ['Only when x = 0.', 'عند x = ٠ فقط.']]
  });

  teach('m10.comp', {
    why: ['Tax then a discount, or a discount then tax? Composite functions make order precise.', 'الضريبة ثم الخصم أم العكس؟ تركيب الدوال يحدد الترتيب بدقة.'],
    idea: [['fg(x) means do g first, then f. The one nearest x goes first.', 'fg(x) تعني g أولًا ثم f. الأقرب إلى x أولًا.'], ['The inverse f⁻¹ undoes f. To find it, swap x and y, then rearrange.', 'المعكوس f⁻¹ يعكس f. لإيجاده بدّل x وy ثم أعد الترتيب.']],
    g: function (r, lv) {
      var a = r.int(2, 5), b = r.int(1, 8), c = r.int(2, 4), x = r.int(1, 5), g = x * c, fg = a * g + b, gf = (a * x + b) * c, Fs = 'f(x) = ' + a + 'x + ' + b + ' , g(x) = ' + c + 'x';
      if (lv === 1) return { q: ['Find fg(' + x + '). Do g first.', 'أوجد fg(' + x + '). ابدأ بـ g.'], eq: Fs, a: fg, s: [['g first', 'g أولًا', c + ' × ' + x + ' =', g], ['Then f', 'ثم f', a + ' × ' + g + ' + ' + b + ' =', fg]], miss: [[gf, 'That is gf. The function next to x goes first.', 'هذا gf. الأقرب إلى x أولًا.']] };
      if (lv === 2) return { q: ['Find gf(' + x + '). Do f first.', 'أوجد gf(' + x + '). ابدأ بـ f.'], eq: Fs, a: gf, s: [['f first', 'f أولًا', a + ' × ' + x + ' + ' + b + ' =', a * x + b], ['Then g', 'ثم g', c + ' × ' + (a * x + b) + ' =', gf]], miss: [[fg, 'That is fg. Here f goes first.', 'هذا fg. هنا f أولًا.']] };
      var y = a * x + b;
      return { q: ['For f(x) = ' + a + 'x + ' + b + ', find f⁻¹(' + y + ').', 'للدالة f(x) = ' + a + 'x + ' + b + '، أوجد f⁻¹(' + y + ').'], eq: '(' + y + ' − ' + b + ') ÷ ' + a, a: x, s: [['Undo the adding', 'اعكس الجمع', y + ' − ' + b + ' =', a * x], ['Undo the multiplying', 'اعكس الضرب', (a * x) + ' ÷ ' + a + ' =', x]], miss: [[a * y + b, 'That is f. The inverse undoes it.', 'هذه f. والمعكوس يعكسها.'], [dp(y / a - b, 3), 'Undo in reverse: take away first, then divide.', 'اعكس بالترتيب: اطرح ثم اقسم.']] };
    },
    trap: function (r) { return { eq: 'f(x) = 2x , g(x) = x + 1 , fg(3)', w: 0, why: ['g first: g(3) = 4, then f(4) = 8.', 'g أولًا: g(3) = 4 ثم f(4) = 8.'], l: [['f first: 2 × 3 = 6', 'f أولًا: 2 × 3 = 6'], '6 + 1 = 7', 'Answer: 7'] }; },
    explain: [['Does fg always equal gf?', 'هل fg تساوي gf دائمًا؟'], ['No. Order usually matters, as with socks and shoes.', 'لا. الترتيب يهم غالبًا، كالجورب والحذاء.'], ['Yes, as with multiplying.', 'نعم كالضرب.'], ['Only for big numbers.', 'في الكبيرة فقط.']]
  });

  teach('m10.frac', {
    why: ['Algebraic fractions follow exactly the same rules you already trust for numbers.', 'الكسور الجبرية تتبع القواعد نفسها التي تثق بها في الأعداد.'],
    idea: [['Cancel only whole factors, never parts of a sum. (2x + 4)/2 = x + 2, but (x + 4)/x is not 4.', 'لا تختصر إلا العوامل الكاملة لا أجزاء الجمع. (2x + 4)/2 = x + 2، لكن (x + 4)/x ليست ٤.'], ['To add, find a common bottom: 1/x + 1/2 = (2 + x)/2x.', 'للجمع أوجد مقامًا مشتركًا: 1/x + 1/2 = (2 + x)/2x.']],
    g: function (r, lv) {
      var a = r.int(2, 6), b = r.int(2, 9), x = r.int(2, 9);
      if (lv === 1) return { q: ['Simplify: what is the number with x?', 'بسّط: ما العدد مع x؟'], eq: '(' + (a * b) + 'x + ' + (a * 3) + ') ÷ ' + a, a: b, s: [[null, null, (a * 3) + ' ÷ ' + a + ' =', 3], ['Divide every term by ' + a, 'اقسم كل حد على ' + a, (a * b) + ' ÷ ' + a + ' =', b], ['So', 'إذن', b + 'x + 3']], miss: [[a * b, 'Divide by ' + a + '.', 'اقسم على ' + a + '.']] };
      if (lv === 2) { var d1 = r.pick([2, 3, 4, 5]), d2 = r.pick([3, 4, 5, 6].filter(function (v) { return v !== d1; })), L = TM.lcm(d1, d2), num = L / d1 + L / d2; return { q: ['Add. Write as ?x/' + L + ' and type the top number.', 'اجمع. اكتبها ?x/' + L + ' واكتب البسط.'], eq: 'x/' + d1 + ' + x/' + d2, a: num, s: [['Common bottom', 'مقام مشترك', 'Bottom:', L], ['First top', 'البسط الأول', L + ' ÷ ' + d1 + ' =', L / d1], ['Second top', 'البسط الثاني', L + ' ÷ ' + d2 + ' =', L / d2], ['Add', 'اجمع', (L / d1) + ' + ' + (L / d2) + ' =', num]] }; }
      var p = r.int(2, 8);
      return { q: ['Simplify by factorising first.', 'بسّط بالتحليل أولًا.'], eq: '(x² + ' + (p + 3) + 'x + ' + (3 * p) + ') ÷ (x + 3)', alg: true, a: ['x+' + p], s: [['Factorise the top: two numbers that multiply to ' + (3 * p) + ' and add to ' + (p + 3), 'حلّل البسط: عددان حاصل ضربهما ' + (3 * p) + ' ومجموعهما ' + (p + 3), '(x + 3)(x +', p, ')'], ['Cancel the whole bracket', 'اختصر القوس كله', 'x + ' + p]] };
    },
    trap: function (r) { return { eq: '(x + 4) ÷ x', w: 0, why: ['x is part of a sum, not a factor, so it cannot cancel.', 'x جزء من جمع لا عامل، فلا يُختصر.'], l: [['Cancel the x: 4', 'اختصر x: 4'], ['Check with x = 2', 'تحقق عند x = 2'], '(2 + 4) ÷ 2 = 3'] }; },
    explain: [['Why can you not cancel the x in (x + 4)/x?', 'لماذا لا تختصر x في (x + 4)/x؟'], ['It is only part of the top. Try x = 2: the answer is 3, not 4.', 'جزء من البسط فقط. جرّب x = ٢: الناتج ٣ لا ٤.'], ['You can.', 'يمكن.'], ['Because 4 is even.', 'لأن ٤ زوجي.']]
  });

  teach('m10.neg', {
    why: ['Negative and fractional powers let one rule cover roots, reciprocals and growth.', 'الأسس السالبة والكسرية تجعل قاعدة واحدة تشمل الجذور والمقلوبات والنمو.'],
    idea: [['A negative power flips: 2⁻³ = 1/2³ = 1/8.', 'الأس السالب يقلب: 2⁻³ = 1/2³ = 1/8.'], ['A fractional power roots: 9^(1/2) = √9 = 3, and 8^(2/3) = (∛8)² = 4.', 'الأس الكسري جذر: 9^(1/2) = √9 = 3، و8^(2/3) = (∛8)² = 4.']],
    g: function (r, lv) {
      var b = r.pick([2, 3, 4, 5, 10]), n = r.int(1, 3);
      if (lv === 1) return { q: ['Write as a fraction.', 'اكتب كسرًا.'], eq: b + '^(−' + n + ')', a: '1/' + Math.pow(b, n), s: [['Flip it', 'اقلبه', '1/' + b + '^' + n], ['Work out the power', 'احسب القوة', 'Bottom:', Math.pow(b, n)], ['Write it', 'اكتبه', 'Answer:', '1/' + Math.pow(b, n)]], miss: [[-Math.pow(b, n), 'A negative power flips. It does not make the number negative.', 'الأس السالب يقلب ولا يجعل العدد سالبًا.']] };
      if (lv === 2) { var rt = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); return { q: ['Work it out.', 'احسب.'], eq: (rt * rt) + '^(1/2)', a: rt, s: [['Power 1/2 is a square root', 'الأس ١/٢ جذر تربيعي', '√' + (rt * rt) + ' =', rt]], miss: [[(rt * rt) / 2, 'Power 1/2 means root, not half.', 'الأس ١/٢ جذر لا نصف.']] }; }
      var c = r.pick([[8, 3, 2], [27, 3, 3], [64, 3, 4], [125, 3, 5], [16, 4, 2], [81, 4, 3]]), p = r.pick([2, 3]), cv = Math.pow(c[2], p);
      return { q: ['Work it out.', 'احسب.'], eq: c[0] + '^(' + p + '/' + c[1] + ')', a: cv, s: [['Bottom is the root', 'المقام هو الجذر', c[2] + '^' + c[1] + ' = ' + c[0]], ['Top is the power', 'البسط هو القوة', c[2] + (p === 2 ? '²' : '³') + ' =', cv]], miss: [[c[2], 'That is the root only. Now apply the power of ' + p + '.', 'هذا الجذر فقط. طبّق القوة ' + p + '.']] };
    },
    trap: function (r) { return { eq: '2^(−3)', w: 0, why: ['Negative powers flip: 1/8, not −8.', 'الأسس السالبة تقلب: 1/8 لا −8.'], l: ['2^(−3) = −8', ['So it is negative', 'فهو سالب'], ['Below zero', 'تحت الصفر']] }; },
    explain: [['Why is anything to the power 0 equal to 1?', 'لماذا أي عدد أسه ٠ يساوي ١؟'], ['a³ ÷ a³ is 1, and the rule gives a⁰.', 'a³ ÷ a³ = ١، والقاعدة تعطي a⁰.'], ['Zero means nothing, so it is 0.', 'الصفر لا شيء فهو ٠.'], ['It is a guess.', 'تخمين.']]
  });

  teach('m10.grad', {
    why: ['The slope of a curve at a point is its rate of change right then. It is the door to calculus.', 'ميل المنحنى عند نقطة هو معدل تغيره عندها، وهو باب التفاضل.'],
    idea: [{ p: ['Draw a tangent, a line that just touches the curve there. Its gradient is the gradient of the curve at that point.', 'ارسم مماسًا يمس المنحنى عند النقطة، وميله هو ميل المنحنى هناك.'], dia: function () { return D.axes({ x: [-1, 4], y: [-2, 10], fn: function (x) { return x * x; }, line: [[0, -4], [4, 12]], pts: [[2, 4, '(2, 4)']] }); } }, ['On a distance-time curve, the gradient of the tangent is the speed at that moment.', 'في منحنى المسافة والزمن، ميل المماس هو السرعة عند تلك اللحظة.']],
    g: function (r, lv) {
      var x1 = r.int(1, 5), run = r.pick([1, 2, 4]), m = r.int(1, 6), y1 = r.int(1, 8), y2 = y1 + m * run;
      if (lv === 1) return { q: ['A tangent passes through (' + x1 + ', ' + y1 + ') and (' + (x1 + run) + ', ' + y2 + '). Find its gradient.', 'مماس يمر بـ (' + x1 + '، ' + y1 + ') و(' + (x1 + run) + '، ' + y2 + '). أوجد ميله.'], eq: '(' + y2 + ' − ' + y1 + ') ÷ ' + run, a: m, s: [['Rise', 'الارتفاع', y2 + ' − ' + y1 + ' =', y2 - y1], ['Rise ÷ run', 'الارتفاع ÷ الأفقي', (y2 - y1) + ' ÷ ' + run + ' =', m]] };
      if (lv === 2) { var n = r.int(1, 4), a0 = n + 1, b0 = n; return { q: ['For y = x², the chord from x = ' + b0 + ' to x = ' + a0 + ' has what gradient?', 'لـ y = x²، ما ميل الوتر من x = ' + b0 + ' إلى x = ' + a0 + '؟'], eq: '(' + (a0 * a0) + ' − ' + (b0 * b0) + ') ÷ 1', a: a0 * a0 - b0 * b0, s: [['y values', 'قيم y', a0 + '² − ' + b0 + '² =', a0 * a0 - b0 * b0], ['Run is 1', 'الأفقي ١', (a0 * a0 - b0 * b0) + ' ÷ 1 =', a0 * a0 - b0 * b0]] }; }
      var v = r.int(2, 9), t = r.int(2, 6);
      return { q: ['A distance-time tangent rises ' + (v * t) + ' m over ' + t + ' s. What is the speed then, in m/s?', 'مماس في منحنى المسافة والزمن يرتفع ' + (v * t) + ' م في ' + t + ' ث. كم السرعة؟'], eq: (v * t) + ' ÷ ' + t, a: v, s: [['Gradient is speed', 'الميل هو السرعة', (v * t) + ' ÷ ' + t + ' =', v]] };
    },
    trap: function (r) { return { w: 1, q: ['Finding the gradient of a curve at a point. One line is wrong. Tap it.', 'إيجاد ميل منحنى عند نقطة. سطر واحد خاطئ. انقر عليه.'], why: ['The tangent touches at that one point. A chord cuts across and gives an average.', 'المماس يمس عند نقطة واحدة، والوتر يعطي معدلًا.'], l: [['Draw a tangent at the point', 'ارسم مماسًا عند النقطة'], ['Any two points on the curve give it exactly', 'أي نقطتين على المنحنى تعطيانه بدقة'], ['Rise ÷ run of the tangent', 'ارتفاع المماس ÷ الأفقي']] }; },
    explain: [['Why does a curve have no single gradient?', 'لماذا ليس للمنحنى ميل واحد؟'], ['Its steepness changes from point to point.', 'تتغير شدة ميله من نقطة إلى أخرى.'], ['It does: it is 1.', 'له: هو ١.'], ['Curves are flat.', 'المنحنيات مسطحة.']]
  });

  teach('m10.var', {
    why: ['Gravity, light and sound follow inverse square laws. Variation is how physics writes its rules.', 'الجاذبية والضوء والصوت تتبع قوانين التربيع العكسي، والتغير لغة الفيزياء.'],
    idea: [['Direct: y = kx, so more x means more y. Inverse: y = k/x, so more x means less y.', 'طردي: y = kx فزيادة x تزيد y. عكسي: y = k/x فزيادة x تنقص y.'], ['Always find k first, from the numbers you are given.', 'أوجد k أولًا من المعطيات.']],
    g: function (r, lv) {
      var k = r.int(2, 9), x1 = r.int(2, 6), x2 = r.int(3, 12);
      if (lv === 1) return { q: ['y varies directly with x. y = ' + (k * x1) + ' when x = ' + x1 + '. Find y when x = ' + x2 + '.', 'y تتغير طرديًا مع x. y = ' + (k * x1) + ' عند x = ' + x1 + '. أوجد y عند x = ' + x2 + '.'], a: k * x2, s: [['Find k', 'أوجد k', (k * x1) + ' ÷ ' + x1 + ' =', k], ['Use it', 'استخدمها', k + ' × ' + x2 + ' =', k * x2]] };
      var K = x1 * x2 * k;
      if (lv === 2) return { q: ['y varies inversely with x. y = ' + (K / x1) + ' when x = ' + x1 + '. Find y when x = ' + x2 + '.', 'y تتغير عكسيًا مع x. y = ' + (K / x1) + ' عند x = ' + x1 + '. أوجد y عند x = ' + x2 + '.'], a: K / x2, s: [['Find k', 'أوجد k', (K / x1) + ' × ' + x1 + ' =', K], ['Use it', 'استخدمها', K + ' ÷ ' + x2 + ' =', K / x2]], miss: [[(K / x1) / x1 * x2, 'That treats it as direct. Inverse: y = k/x.', 'هذا طردي. العكسي y = k/x.']] };
      var kk = r.int(2, 5), a = r.int(2, 4), b = r.int(3, 6);
      return { q: ['y varies with x². y = ' + (kk * a * a) + ' when x = ' + a + '. Find y when x = ' + b + '.', 'y تتغير مع x². y = ' + (kk * a * a) + ' عند x = ' + a + '. أوجد y عند x = ' + b + '.'], a: kk * b * b, s: [['Find k', 'أوجد k', (kk * a * a) + ' ÷ ' + (a * a) + ' =', kk], ['Use it', 'استخدمها', kk + ' × ' + b + '² =', kk * b * b]], miss: [[kk * b, 'Square the x: use x², not x.', 'ربّع x.']] };
    },
    trap: function (r) { return { w: 1, q: ['y varies inversely with x; y = 12 when x = 2. One line is wrong. Tap it.', 'y عكسيًا مع x؛ y = 12 عند x = 2. سطر واحد خاطئ. انقر عليه.'], why: ['Inverse means k = x × y = 24.', 'العكسي: k = x × y = 24.'], l: [['y = k/x', 'y = k/x'], ['k = 12 ÷ 2', 'k = 12 ÷ 2'], ['So k = 6', 'إذن k = 6']] }; },
    explain: [['If y varies inversely with x and x doubles, what does y do?', 'إذا تضاعف x في التغير العكسي، فماذا يحدث لـ y؟'], ['It halves.', 'ينقص إلى النصف.'], ['It doubles.', 'يتضاعف.'], ['It stays the same.', 'يبقى نفسه.']]
  });

  teach('m10.sets', {
    why: ['Sets organise any survey or search: a database query is set algebra.', 'المجموعات تنظم أي استبيان أو بحث، واستعلام قاعدة البيانات جبر مجموعات.'],
    idea: [{ p: ['∪ means or (everything in either). ∩ means and (only in both). A\' means not in A.', '∪ تعني «أو» (كل ما في أيهما). ∩ تعني «و» (في كليهما). A\' تعني ليس في A.'], dia: function () { return D.venn(5, 3, 7, 2); } }, ['Start filling a Venn diagram from the middle. Then work outwards.', 'ابدأ ملء المخطط من الوسط ثم إلى الخارج.']],
    g: function (r, lv) {
      var a = r.int(2, 12), b = r.int(2, 12), c = r.int(2, 12), o = r.int(1, 9), dia = D.venn(a, b, c, o);
      if (lv === 1) { var n = r.pick([[['in B', 'في B'], b + c], [['in A ∪ B', 'في A ∪ B'], a + b + c], [['in A', 'في A'], a + b]]); return { q: ['How many are ' + n[0][0] + '?', 'كم عددها ' + n[0][1] + '؟'], dia: dia, a: n[1], s: [['Read the regions', 'اقرأ المناطق', 'Answer:', n[1]]], miss: [[a + b + c + o, 'That is everything, including outside both circles.', 'هذا الكل بما خارج الدائرتين.']] }; }
      if (lv === 2) return { q: ['How many are in A\'?', 'كم عددها في A\'؟'], dia: dia, a: c + o, s: [['Everything not in circle A', 'كل ما ليس في A', c + ' + ' + o + ' =', c + o]], miss: [[c, 'Do not forget those outside both circles.', 'لا تنس من خارج الدائرتين.']] };
      var tot = a + b + c + o, ta = a + b, tc = c + b;
      return { q: [tot + ' people were asked: ' + ta + ' like tea, ' + tc + ' like coffee, ' + o + ' like neither. How many like both?', 'سُئل ' + tot + ' شخصًا: ' + ta + ' يحبون الشاي و' + tc + ' القهوة و' + o + ' لا يحبون أيهما. كم يحب الاثنين؟'], eq: ta + ' + ' + tc + ' − ' + (tot - o), a: b, s: [['Who likes at least one', 'من يحب واحدًا على الأقل', tot + ' − ' + o + ' =', tot - o], ['Extra counted twice', 'الزائد المحسوب مرتين', ta + ' + ' + tc + ' − ' + (tot - o) + ' =', b]], miss: [[ta + tc - tot, 'Remember the ' + o + ' who like neither.', 'تذكر ' + o + ' الذين لا يحبون أيهما.']] };
    },
    trap: function (r) { return { eq: '5 , 3 , 7 , 2', q: ['A only 5, both 3, B only 7, neither 2. One line is wrong. Tap it.', 'A فقط 5 وكلاهما 3 وB فقط 7 ولا شيء 2. سطر واحد خاطئ. انقر عليه.'], w: 1, why: ['A ∪ B is everything in either: 5 + 3 + 7 = 15.', 'A ∪ B كل ما في أيهما: 5 + 3 + 7 = 15.'], l: ['A: 5 + 3 = 8', 'A ∪ B: 5 + 7 = 12', 'Total: 5 + 3 + 7 + 2 = 17'] }; },
    explain: [['Why fill a Venn diagram from the middle?', 'لماذا يُملأ المخطط من الوسط؟'], ['The overlap is counted in both circles, so it must be known first.', 'التداخل محسوب في الدائرتين فيلزم أولًا.'], ['It is the prettiest part.', 'أجمل جزء.'], ['There is no reason.', 'لا سبب.']]
  });

  /* ---------- geometry ---------- */
  teach('m10.sine', {
    why: ['Most triangles have no right angle. These two rules measure any of them, and were perfected by Muslim astronomers.', 'أغلب المثلثات بلا زاوية قائمة، وهاتان القاعدتان تقيسان أيًا منها، وقد أتقنهما فلكيو المسلمين.'],
    idea: [{ p: ['Sine rule: a/sin A = b/sin B, when you have a pair of a side and its opposite angle.', 'قاعدة الجيب: a/sin A = b/sin B إذا كان لديك ضلع وزاويته المقابلة.'], dia: function () { return D.tri({ sides: ['c', 'a', 'b'], angles: ['A', 'B', 'C'] }); } }, ['Cosine rule: a² = b² + c² − 2bc cos A, when you have two sides and the angle between them.', 'قاعدة جيب التمام: a² = b² + c² − 2bc cos A إذا كان لديك ضلعان والزاوية بينهما.']],
    calc: true,
    g: function (r, lv) {
      var A0 = r.pick([30, 40, 50, 60, 70]), B0 = r.pick([35, 45, 55, 65, 75]), a = r.int(4, 15), bv = dp(a * Math.sin(rad(B0)) / Math.sin(rad(A0)), 1);
      if (lv === 1) { var c = r.pick([[['two sides and the angle between', 'ضلعان والزاوية بينهما'], ['Cosine rule', 'قاعدة جيب التمام']], [['two angles and a side', 'زاويتان وضلع'], ['Sine rule', 'قاعدة الجيب']], [['all three sides', 'الأضلاع الثلاثة'], ['Cosine rule', 'قاعدة جيب التمام']], [['a side and its opposite angle, plus another angle', 'ضلع وزاويته المقابلة وزاوية أخرى'], ['Sine rule', 'قاعدة الجيب']]]); return { q: ['You know ' + c[0][0] + '. Which rule?', 'تعرف ' + c[0][1] + '. أي قاعدة؟'], o: [c[1], c[1][0] === 'Sine rule' ? ['Cosine rule', 'قاعدة جيب التمام'] : ['Sine rule', 'قاعدة الجيب'], ['Pythagoras', 'فيثاغورس', 'Pythagoras needs a right angle.', 'فيثاغورس يحتاج إلى زاوية قائمة.']], s: [['A matching side and angle means sine', 'الضلع والزاوية المتقابلان: الجيب', c[1]]] }; }
      if (lv === 2) return { q: ['Angle A = ' + A0 + '°, side a = ' + a + ', angle B = ' + B0 + '°. Find side b to 1 decimal place.', 'A = ' + A0 + '° وa = ' + a + ' وB = ' + B0 + '°. أوجد b إلى منزلة عشرية.'], eq: a + ' × sin ' + B0 + '° ÷ sin ' + A0 + '°', dia: D.tri({ sides: [null, a, 'b'], angles: [A0 + '°', B0 + '°', null] }), a: bv, s: [['Sine rule', 'قاعدة الجيب', 'b = ' + a + ' × sin ' + B0 + '° ÷ sin ' + A0 + '°'], ['Calculate', 'احسب', 'b ≈', bv]], miss: [[dp(a * Math.sin(rad(A0)) / Math.sin(rad(B0)), 1), 'Upside down. b goes with sin B on top.', 'مقلوب. b مع sin B في البسط.']] };
      var b = r.int(3, 12), cc = r.int(3, 12), An = r.pick([40, 50, 60, 70, 80, 110, 120]), sq = dp(b * b + cc * cc - 2 * b * cc * Math.cos(rad(An)), 3), ans = dp(Math.sqrt(sq), 1);
      return { q: ['Sides ' + b + ' and ' + cc + ', with ' + An + '° between them. Find the third side to 1 decimal place.', 'ضلعان ' + b + ' و' + cc + ' بينهما ' + An + '°. أوجد الثالث إلى منزلة عشرية.'], dia: D.tri({ sides: [b, 'a', cc], angles: [An + '°', null, null] }), eq: '√(' + b + '² + ' + cc + '² − 2 × ' + b + ' × ' + cc + ' × cos ' + An + '°)', a: ans, s: [['Cosine rule', 'قاعدة جيب التمام', 'a² = ' + b + '² + ' + cc + '² − 2 × ' + b + ' × ' + cc + ' × cos ' + An + '°'], ['That gives', 'يعطي', 'a² ≈', sq], ['Square root', 'الجذر', 'a ≈', ans]], miss: [[dp(sq, 1), 'Take the square root.', 'خذ الجذر.']] };
    },
    trap: function (r) { return { eq: 'a² = 25 + 36 − 60 cos 60°', w: 1, why: ['Multiply before taking away: 60 × 0.5 = 30, then 61 − 30 = 31.', 'اضرب قبل الطرح: ٦٠ × ٠٫٥ = ٣٠ ثم ٦١ − ٣٠ = ٣١.'], l: ['25 + 36 = 61', ['(61 − 60) × cos 60° = 0.5', '(61 − 60) × cos 60° = 0.5'], ['a ≈ 0.7', 'a ≈ 0.7']] }; },
    explain: [['When does the cosine rule become Pythagoras?', 'متى تصبح قاعدة جيب التمام فيثاغورس؟'], ['When the angle is 90°, as cos 90° = 0.', 'إذا كانت الزاوية ٩٠° لأن cos 90° = ٠.'], ['Never.', 'أبدًا.'], ['When the sides are equal.', 'إذا تساوت الأضلاع.']]
  });

  teach('m10.circleth', {
    why: ['Eight facts about circles that Euclid proved. They solve problems that look impossible.', 'ثماني حقائق أثبتها إقليدس عن الدوائر، تحل مسائل تبدو مستحيلة.'],
    idea: [{ p: ['Angle at the centre is twice the angle at the edge. An angle in a semicircle is 90°.', 'الزاوية المركزية ضعف المحيطية، والزاوية في نصف الدائرة ٩٠°.'], dia: function () { return D.circle({ d: 'd' }); } }, ['Angles in the same segment are equal. Opposite angles in a cyclic quadrilateral add to 180°. A tangent meets a radius at 90°.', 'الزوايا في القطعة نفسها متساوية، والمتقابلتان في الرباعي الدائري مجموعهما ١٨٠°، والمماس عمودي على نصف القطر.']],
    g: function (r, lv) {
      var e = r.int(20, 80);
      if (lv === 1) return { q: ['The angle at the edge is ' + e + '°. Find the angle at the centre, on the same arc.', 'الزاوية المحيطية ' + e + '°. أوجد المركزية على القوس نفسه.'], eq: e + ' × 2', a: 2 * e, s: [['The centre is double', 'المركزية ضعف', e + ' × 2 =', 2 * e]], miss: [[e / 2, 'The centre angle is the bigger: double.', 'المركزية أكبر: ضعف.']] };
      if (lv === 2) { var q0 = r.int(50, 130); return { q: ['A cyclic quadrilateral has an angle of ' + q0 + '°. Find the opposite angle.', 'رباعي دائري فيه زاوية ' + q0 + '°. أوجد المقابلة.'], eq: '180 − ' + q0, a: 180 - q0, s: [['Opposite angles add to 180°', 'المتقابلتان مجموعهما ١٨٠°', '180 − ' + q0 + ' =', 180 - q0]], miss: [[360 - q0, 'It is 180°, not 360°, for opposite angles.', 'المتقابلتان ١٨٠° لا ٣٦٠°.']] }; }
      var x = r.int(25, 65);
      return { q: ['AB is a diameter and C is on the circle. Angle CAB is ' + x + '°. Find angle ABC.', 'AB قطر وC على الدائرة، والزاوية CAB تساوي ' + x + '°. أوجد ABC.'], dia: D.tri({ right: 0, pts: [[60, 150], [260, 150], [60, 30]], angles: ['90°', '?', x + '°'] }), eq: '180 − 90 − ' + x, a: 90 - x, s: [['An angle in a semicircle is 90°', 'الزاوية في نصف الدائرة ٩٠°', '180 − 90 =', 90], ['Take off ' + x, 'اطرح ' + x, '90 − ' + x + ' =', 90 - x]], miss: [[180 - x, 'You forgot the 90° at C.', 'نسيت ٩٠° عند C.']] };
    },
    trap: function (r) { var e = r.int(30, 70); return { w: 1, q: ['Edge angle ' + e + '°. One line is wrong. Tap it.', 'زاوية محيطية ' + e + '°. سطر واحد خاطئ. انقر عليه.'], why: ['The centre angle is double the edge angle: ' + (2 * e) + '°.', 'المركزية ضعف المحيطية: ' + (2 * e) + '°.'], l: [['Another edge angle, same arc: ' + e + '°', 'محيطية أخرى، القوس نفسه: ' + e + '°'], ['Centre angle: ' + (e / 2) + '°', 'المركزية: ' + (e / 2) + '°'], ['Tangent and radius: 90°', 'المماس ونصف القطر: ٩٠°']] }; },
    explain: [['Why is an angle in a semicircle always 90°?', 'لماذا الزاوية في نصف الدائرة ٩٠° دائمًا؟'], ['The centre angle on a diameter is 180°, and the edge angle is half of that.', 'المركزية على القطر ١٨٠°، والمحيطية نصفها.'], ['Semicircles are made that way.', 'هكذا تُصنع أنصاف الدوائر.'], ['Only sometimes.', 'أحيانًا فقط.']]
  });

  teach('m10.vec', {
    why: ['A plane in a crosswind travels along a vector sum. Forces and games use the same maths.', 'الطائرة في الريح تسير وفق جمع متجهات، والقوى والألعاب بالرياضيات نفسها.'],
    idea: [{ p: ['A vector has size and direction. Written (3, 4): 3 across and 4 up. Add them piece by piece.', 'للمتجه مقدار واتجاه. يُكتب (٣، ٤): ٣ أفقيًا و٤ رأسيًا. وتُجمع قطعة قطعة.'], dia: function () { return D.axes({ x: [0, 5], y: [0, 5], line: [[0, 0], [3, 4]], pts: [[3, 4, '(3, 4)']] }); } }, ['Its size is by Pythagoras: √(3² + 4²) = 5.', 'مقداره بفيثاغورس: √(٣² + ٤²) = ٥.']],
    g: function (r, lv) {
      var a = r.int(-6, 9), b = r.int(-6, 9), c = r.int(-6, 9), d = r.int(-6, 9), k = r.int(2, 5), V = function (x, y) { return '(' + mn(x) + ', ' + mn(y) + ')'; };
      if (lv === 1) return { q: ['Add. What is the first number?', 'اجمع. ما العدد الأول؟'], eq: V(a, b) + ' + ' + V(c, d), a: a + c, s: [['Across parts add', 'تُجمع الأفقية', mn(a) + ' ' + sg(c) + ' =', mn(a + c)]], miss: [[a + b, 'Add across with across, not across with up.', 'الأفقي مع الأفقي.']] };
      if (lv === 2) return { q: ['Multiply by ' + k + '. What is the second number?', 'اضرب في ' + k + '. ما العدد الثاني؟'], eq: k + ' × ' + V(a, b), a: k * b, s: [['Each part is scaled', 'تُضرب كل قطعة', k + ' × ' + (b < 0 ? '(' + mn(b) + ')' : b) + ' =', mn(k * b)]] };
      var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]);
      return { q: ['Find the size of the vector.', 'أوجد مقدار المتجه.'], eq: V(t[0], t[1]), dia: D.axes({ x: [0, t[0] + 1], y: [0, t[1] + 1], step: t[1] > 8 ? 3 : 1, line: [[0, 0], [t[0], t[1]]] }), a: t[2], s: [['Square and add', 'ربّع واجمع', t[0] + '² + ' + t[1] + '² =', t[2] * t[2]], ['Square root', 'الجذر', '√' + (t[2] * t[2]) + ' =', t[2]]], miss: [[t[0] + t[1], 'Size uses Pythagoras, not adding.', 'المقدار بفيثاغورس لا بالجمع.']] };
    },
    trap: function (r) { return { eq: '(2, 3) + (4, 5)', w: 1, why: ['Add matching parts: (6, 8).', 'اجمع القطع المتناظرة: (6, 8).'], l: ['2 + 4 = 6', '3 + 4 = 8', ['Answer (6, 8)', 'الناتج (6, 8)']] }; },
    explain: [['What is the difference between a vector and a number?', 'ما الفرق بين المتجه والعدد؟'], ['A vector also has a direction.', 'للمتجه اتجاه أيضًا.'], ['A vector is always bigger.', 'المتجه أكبر دائمًا.'], ['Nothing.', 'لا فرق.']]
  });

  teach('m10.area3d', {
    why: ['Cones, spheres and pyramids: from ice cream to the dome of a masjid.', 'المخاريط والكرات والأهرام: من المثلجات إلى قبة المسجد.'],
    idea: [{ p: ['A cone or pyramid is 1/3 of the box around it: V = 1/3 × base × height.', 'المخروط والهرم ثلث المجسم المحيط: V = ١/٣ × القاعدة × الارتفاع.'], dia: function () { return D.cyl('r', 'h'); } }, ['A sphere has V = 4/3 × π × r³ and surface 4 × π × r².', 'للكرة V = ٤/٣ × π × r³ وسطحها ٤ × π × r².']],
    calc: true,
    g: function (r, lv) {
      var rd = 3 * r.int(1, 4), h = r.int(2, 10), bs = r.int(3, 12) * 3;
      if (lv === 1) return { q: ['A pyramid has base area ' + bs + ' and height ' + h + '. Find its volume.', 'هرم مساحة قاعدته ' + bs + ' وارتفاعه ' + h + '. أوجد حجمه.'], eq: bs + ' × ' + h + ' ÷ 3', a: bs * h / 3, s: [['Base × height', 'القاعدة × الارتفاع', bs + ' × ' + h + ' =', bs * h], ['A third', 'الثلث', (bs * h) + ' ÷ 3 =', bs * h / 3]], miss: [[bs * h, 'That is the prism. A pyramid is a third of it.', 'هذا المنشور. الهرم ثلثه.']] };
      if (lv === 2) return { q: ['A cone has radius ' + rd + ' and height ' + h + '. Find its volume as a multiple of π. Type the number before π.', 'مخروط نصف قطره ' + rd + ' وارتفاعه ' + h + '. أوجد حجمه بدلالة π. اكتب العدد قبل π.'], eq: rd + '² × ' + h + ' ÷ 3', a: rd * rd * h / 3, s: [['r² × h', 'r² × h', rd + ' × ' + rd + ' × ' + h + ' =', rd * rd * h], ['A third', 'الثلث', (rd * rd * h) + ' ÷ 3 =', rd * rd * h / 3]], miss: [[rd * rd * h, 'That is the cylinder. A cone is a third of it.', 'هذه الأسطوانة. المخروط ثلثها.']] };
      var kind = r.bool();
      return kind ? { q: ['A sphere has radius ' + rd + '. Find its volume as a multiple of π. Type the number before π.', 'كرة نصف قطرها ' + rd + '. أوجد حجمها بدلالة π. اكتب العدد قبل π.'], eq: '4 × ' + rd + '³ ÷ 3', a: 4 * rd * rd * rd / 3, s: [['r³', 'r³', rd + ' × ' + rd + ' × ' + rd + ' =', rd * rd * rd], ['× 4 ÷ 3', '× ٤ ÷ ٣', (rd * rd * rd) + ' × 4 ÷ 3 =', 4 * rd * rd * rd / 3]] } : { q: ['A sphere has radius ' + rd + '. Find its surface area as a multiple of π. Type the number before π.', 'كرة نصف قطرها ' + rd + '. أوجد مساحة سطحها بدلالة π. اكتب العدد قبل π.'], eq: '4 × ' + rd + '²', a: 4 * rd * rd, s: [['4 × r²', '٤ × r²', '4 × ' + rd + ' × ' + rd + ' =', 4 * rd * rd]], miss: [[rd * rd, 'A sphere\'s surface is 4 great circles.', 'سطح الكرة ٤ دوائر عظمى.']] };
    },
    trap: function (r) { return { eq: 'r = 3 , h = 5', w: 1, why: ['A cone is a third of the cylinder: 45π ÷ 3 = 15π.', 'المخروط ثلث الأسطوانة: 45π ÷ 3 = 15π.'], l: ['3 × 3 × 5 = 45', ['Cone: 45π', 'المخروط: 45π'], ['Cylinder: 45π', 'الأسطوانة: 45π']] }; },
    explain: [['How many full cones fill a cylinder of the same size?', 'كم مخروطًا يملأ أسطوانة بالحجم نفسه؟'], ['Exactly three.', 'ثلاثة تمامًا.'], ['Two.', 'اثنان.'], ['Four.', 'أربعة.']]
  });

  teach('m10.bounds', {
    why: ['A rope "12 m to the nearest metre" could be 11.5 m. Engineering safety depends on this.', 'حبل «١٢ م لأقرب متر» قد يكون ١١٫٥ م، وسلامة الهندسة تعتمد على هذا.'],
    idea: [{ p: ['Rounded to the nearest unit, a value is within half a unit. 12 means from 11.5 up to 12.5.', 'إذا قُرّب إلى أقرب وحدة فهو ضمن نصف وحدة. ١٢ تعني من ١١٫٥ إلى ١٢٫٥.'], dia: function () { return D.line({ min: 11, max: 13, step: .5, every: 1, marks: { 11.5: '11.5', 12.5: '12.5' } }); } }, ['Half the rounding unit, down and up: nearest 10 means ±5.', 'نصف وحدة التقريب نزولًا وصعودًا: لأقرب ١٠ تعني ±٥.']],
    g: function (r, lv) {
      var unit = r.pick(lv === 1 ? [1, 10] : [1, 10, 100, .1]), v = dp(r.int(3, 60) * unit, 2), lo = dp(v - unit / 2, 3), hi = dp(v + unit / 2, 3), up = r.bool();
      if (lv < 3) return { q: [v + ' is rounded to the nearest ' + unit + '. What is its ' + (up ? 'upper' : 'lower') + ' bound?', 'قُرّب ' + v + ' إلى أقرب ' + unit + '. ما حده ' + (up ? 'الأعلى' : 'الأدنى') + '؟'], eq: v + (up ? ' + ' : ' − ') + (unit / 2), a: up ? hi : lo, s: [['Half the unit', 'نصف الوحدة', unit + ' ÷ 2 =', unit / 2], [up ? 'Add it' : 'Take it off', up ? 'أضفه' : 'اطرحه', v + (up ? ' + ' : ' − ') + (unit / 2) + ' =', up ? hi : lo]], miss: [[up ? dp(v + unit, 3) : dp(v - unit, 3), 'Go half a unit, not a whole one.', 'نصف وحدة لا وحدة.'], [up ? lo : hi, 'That is the other bound.', 'هذا الحد الآخر.']] };
      var w = r.int(4, 12), h = r.int(2, 9), loA = dp((w - .5) * (h - .5), 3);
      return { q: ['A rectangle is ' + w + ' cm by ' + h + ' cm, each to the nearest cm. What is the smallest its area could be?', 'مستطيل ' + w + ' × ' + h + ' سم، كلٌّ لأقرب سم. ما أصغر مساحة ممكنة؟'], eq: (w - .5) + ' × ' + (h - .5), a: loA, s: [['Lower bounds', 'الحدان الأدنيان', w + ' − 0.5 =', w - .5], [null, null, h + ' − 0.5 =', h - .5], ['Multiply', 'اضرب', (w - .5) + ' × ' + (h - .5) + ' =', loA]], miss: [[w * h, 'That uses the rounded values. Use lower bounds.', 'هذه القيم المقربة. استخدم الأدنى.']] };
    },
    trap: function (r) { return { eq: '50 , 10', w: 1, why: ['Half of 10 is 5, so the bounds are 45 and 55.', 'نصف ١٠ هو ٥، فالحدان ٤٥ و٥٥.'], l: ['10 ÷ 2 = 5', ['Go 10 either way', 'تحرك 10 في الاتجاهين'], ['So between 40 and 60', 'فبين 40 و60']] }; },
    explain: [['Why is the upper bound of 12 written as 12.5, when 12.5 rounds up to 13?', 'لماذا الحد الأعلى لـ ١٢ هو ١٢٫٥ مع أنها تقرّب إلى ١٣؟'], ['The value can get as close as you like to 12.5, without reaching it.', 'يمكن للقيمة الاقتراب منها دون بلوغها.'], ['It is a mistake.', 'خطأ.'], ['Because 5 is odd.', 'لأن ٥ فردي.']]
  });

  /* ---------- more depth ---------- */
  teach('m10.complete', {
    why: ['It shows the turning point of a curve, and it proves the quadratic formula.', 'يكشف قمة المنحنى ويثبت الصيغة التربيعية.'],
    idea: [{ p: ['x² + 6x + 2: halve the 6 to get 3. So (x + 3)² − 9 + 2 = (x + 3)² − 7.', 'x² + 6x + 2: نصّف ٦ تحصل على ٣. إذن (x + 3)² − 9 + 2 = (x + 3)² − 7.'], dia: function () { return D.axes({ x: [-6, 1], y: [-8, 6], fn: function (x) { return (x + 3) * (x + 3) - 7; }, pts: [[-3, -7, '(−3, −7)']] }); } }, ['The turning point is then at (−3, −7).', 'فتكون القمة عند (−٣، −٧).']],
    g: function (r, lv) {
      var h = r.int(1, 9) * (lv === 1 ? 1 : r.pick([1, -1])), c = r.int(-9, 12), b = 2 * h, k = c - h * h, eq = 'x² ' + sg(b) + 'x ' + sg(c);
      if (lv === 1) return { q: ['Write as (x + p)² + q. Find p.', 'اكتب بصورة (x + p)² + q. أوجد p.'], eq: eq, a: h, s: [['Halve the x number', 'نصّف عدد x', b + ' ÷ 2 =', h]], miss: [[b, 'Halve it.', 'نصّفه.']] };
      if (lv === 2) return { q: ['Write as (x + p)² + q. Find q.', 'اكتب بصورة (x + p)² + q. أوجد q.'], eq: eq, a: k, s: [['Halve the x number', 'نصّف عدد x', mn(b) + ' ÷ 2 =', mn(h)], ['Take off its square', 'اطرح مربعه', mn(c) + ' − ' + (h * h) + ' =', mn(k)]], miss: [[c + h * h, 'The square is extra, so take it off.', 'المربع زائد فاطرحه.']] };
      return { q: ['Find the y value of the turning point.', 'أوجد قيمة y عند القمة.'], eq: 'y = ' + eq, dia: D.axes({ x: [-h - 4, -h + 4], y: [k - 2, k + 10], step: 2, fn: function (x) { return x * x + b * x + c; }, pts: [[-h, k]] }), a: k, s: [['Halve the x number', 'نصّف عدد x', mn(b) + ' ÷ 2 =', mn(h)], ['q is the lowest value', 'q أصغر قيمة', mn(c) + ' − ' + (h * h) + ' =', mn(k)]] };
    },
    trap: function (r) { return { eq: 'x² + 6x + 2', w: 1, why: ['(x + 3)² gives an extra 9, so take away 9: −7.', '(x + 3)² تعطي ٩ زائدة، فاطرحها: −٧.'], l: ['6 ÷ 2 = 3', ['(x + 3)² + 2', '(x + 3)² + 2'], ['Check by expanding', 'تحقق بالفتح']] }; },
    explain: [['Why subtract the square of half?', 'لماذا نطرح مربع النصف؟'], ['Expanding (x + 3)² creates a 9 not in the original.', 'فتح (x + 3)² يعطي ٩ ليست في الأصل.'], ['To make it smaller.', 'لتصغيره.'], ['It is optional.', 'اختياري.']]
  });

  teach('m10.simq', {
    why: ['Where does a straight path meet a curved wall? One linear and one quadratic.', 'أين يلتقي طريق مستقيم بجدار منحنٍ؟ خطية وتربيعية.'],
    idea: [{ p: ['Substitute the line into the curve. You get a quadratic. Solve it: there may be two crossings.', 'عوّض الخط في المنحنى تحصل على تربيعية، وحلّها: قد يوجد تقاطعان.'], dia: function () { return D.axes({ x: [-2, 4], y: [-1, 9], fn: function (x) { return x * x; }, line: [[-2, -2], [4, 10]], pts: [[-1, 1], [3, 9]] }); } }, ['Then put each x back to get its y.', 'ثم عوّض كل x لتحصل على y.']],
    g: function (r, lv) {
      var a = r.int(1, 6), b = r.int(-5, -1), s = a + b, p = -a * b; while (s === 0 || a === -b) { a = r.int(1, 6); s = a + b; p = -a * b; }
      if (lv === 1) return { q: ['Set x² = ' + s + 'x + ' + p + ' to zero. What is the last number?', 'اجعل x² = ' + s + 'x + ' + p + ' صفرًا. ما العدد الأخير؟'], eq: 'y = x² ,  y = ' + s + 'x + ' + p, a: -p, s: [['Everything to one side', 'كل شيء في طرف', 'x² − ' + (s < 0 ? '(' + mn(s) + ')' : s) + 'x − ' + p + ' = 0'], ['The last number', 'العدد الأخير', 'Answer:', '−' + p]] };
      if (lv === 2) return { q: ['Solve. Give the bigger x.', 'حُلّ. أعط x الأكبر.'], eq: 'y = x² ,  y = ' + s + 'x + ' + p, a: a, s: [['Everything to one side', 'كل شيء في طرف', 'x² − ' + (s < 0 ? '(' + mn(s) + ')' : s) + 'x − ' + p + ' = 0'], ['Factorise', 'حلّل', '(x − ' + a + ')(x + ' + (-b) + ') = 0'], ['Bigger x', 'x الأكبر', 'Answer:', a]], miss: [[b, 'That is the smaller. Give the bigger x.', 'هذا الأصغر. أعط الأكبر.']] };
      return { q: ['Solve, using the bigger x. Find its y.', 'حُلّ باستخدام x الأكبر. أوجد y.'], eq: 'y = x² ,  y = ' + s + 'x + ' + p, a: a * a, s: [['Factorise', 'حلّل', '(x − ' + a + ')(x + ' + (-b) + ') = 0'], ['Bigger x', 'x الأكبر', 'Answer:', a], ['Put it back', 'عوّضه', a + ' × ' + a + ' =', a * a]], miss: [[a, 'That is x. Put it back to get y.', 'هذا x. عوّض لتحصل على y.']] };
    },
    trap: function (r) { return { eq: 'y = x² ,  y = x + 2', w: 1, why: ['Move everything across: x² − x − 2 = 0.', 'انقل كل شيء: x² − x − 2 = 0.'], l: [['x² = x + 2', 'x² = x + 2'], ['So x = 2 only', 'إذن x = 2 فقط'], ['y = 4', 'y = 4']] }; },
    explain: [['A line and a parabola: how many crossing points are possible?', 'خط وقطع مكافئ: كم نقطة تقاطع ممكنة؟'], ['0, 1 or 2.', '٠ أو ١ أو ٢.'], ['Always 2.', '٢ دائمًا.'], ['Any number.', 'أي عدد.']]
  });

  teach('m10.surdrat', {
    why: ['Exact answers stay clean when the bottom has no root. Exams expect this form.', 'الإجابات الدقيقة تبقى نظيفة إذا خلا المقام من الجذر، والامتحانات تتوقع هذا.'],
    idea: [['Multiply top and bottom by the root: 6/√3 = 6√3/3 = 2√3.', 'اضرب البسط والمقام في الجذر: 6/√3 = 6√3/3 = 2√3.'], ['For a sum at the bottom, use the opposite sign: 1/(√3 + 1) × (√3 − 1)/(√3 − 1).', 'للمجموع في المقام استخدم الإشارة المقابلة: 1/(√3 + 1) × (√3 − 1)/(√3 − 1).']],
    g: function (r, lv) {
      var b = r.pick([2, 3, 5, 6, 7]), k = r.int(2, 8), T0 = b * k;
      if (lv === 1) return { q: ['Rationalise ' + T0 + '/√' + b + '. It becomes ?√' + b + '. Type the number.', 'أزل الجذر من مقام ' + T0 + '/√' + b + '. يصبح ?√' + b + '. اكتب العدد.'], eq: T0 + ' ÷ ' + b, a: k, s: [['√' + b + ' × √' + b + ' = ' + b, '√' + b + ' × √' + b + ' = ' + b, T0 + ' ÷ ' + b + ' =', k]], miss: [[T0, 'Divide by ' + b + ': the bottom became ' + b + '.', 'اقسم على ' + b + ': صار المقام ' + b + '.']] };
      if (lv === 2) return { q: ['Work out √' + b + ' × √' + b + '.', 'احسب √' + b + ' × √' + b + '.'], eq: '√' + b + ' × √' + b, a: b, s: [['A root times itself', 'جذر في نفسه', '√' + (b * b) + ' =', b]], miss: [[b * b, 'A root times itself gives the number under it.', 'الجذر في نفسه يعطي ما تحته.']] };
      var a = r.int(2, 5), d = a * a - b;
      if (d === 0) { a++; d = a * a - b; }
      return { q: ['Multiply (' + a + ' + √' + b + ')(' + a + ' − √' + b + ').', 'اضرب (' + a + ' + √' + b + ')(' + a + ' − √' + b + ').'], eq: a + '² − ' + b, a: d, s: [['Difference of two squares', 'فرق مربعين', a + '² − ' + b + ' =', mn(d)]], miss: [[a * a + b, 'The middle terms cancel, and the last is minus.', 'الأوسطان يلغيان والأخير سالب.']] };
    },
    trap: function (r) { return { eq: '6 ÷ √3', w: 1, why: ['√3 × √3 = 3, not 9.', '√3 × √3 = 3 لا 9.'], l: [['Multiply top and bottom by √3', 'اضرب البسط والمقام في √3'], '√3 × √3 = 9', ['So 6√3/9', 'إذن 6√3/9']] }; },
    explain: [['Does rationalising change the value?', 'هل يغيّر الترشيد القيمة؟'], ['No. You multiply by a form of 1, like √3/√3.', 'لا. تضرب في صورة للعدد ١ مثل √3/√3.'], ['Yes, it makes it bigger.', 'نعم، يكبّرها.'], ['Yes, it makes it exact.', 'نعم يجعلها دقيقة.']]
  });

  teach('m10.pctrev', {
    why: ['Compound growth is how loans and inflation work. Knowing it is a form of self-defence.', 'النمو المركب هو طريقة عمل القروض والتضخم، ومعرفته دفاع عن النفس.'],
    idea: [['Final = start × multiplier ^ years. 1000 at 3% for 4 years: 1000 × 1.03⁴.', 'النهائي = البداية × المضاعف ^ السنوات. ١٠٠٠ بنسبة ٣٪ لأربع سنوات: ١٠٠٠ × ١٫٠٣⁴.'], ['This lesson teaches the arithmetic of growth in prices and savings. Interest on loans is ribā, which Islam forbids: the same maths also shows why such debts trap people.', 'يعلّم هذا الدرس حساب النمو في الأسعار والمدخرات. والفائدة على القروض ربا محرّم في الإسلام، وتُظهر الرياضيات نفسها كيف تُوقع هذه الديون الناس.']],
    calc: true,
    g: function (r, lv) {
      var P = r.pick([500, 1000, 2000, 5000]), p = r.pick([2, 3, 4, 5, 10]), y = r.int(2, lv === 1 ? 2 : 5), m = dp(1 + p / 100, 2), ans = dp(P * Math.pow(m, y), 2);
      if (lv === 1) return { q: ['Prices of ' + P + ' rise ' + p + '% a year for 2 years. What is the multiplier for one year?', 'أسعار ' + P + ' ترتفع ' + p + '٪ سنويًا لسنتين. ما مضاعف السنة الواحدة؟'], eq: '1 + ' + p + '/100', a: m, s: [['1 plus the percent', '١ زائد النسبة', '1 + ' + p + ' ÷ 100 =', m]], miss: [[p, 'As a decimal multiplier: 1 + ' + p + '/100.', 'مضاعف عشري: ١ + ' + p + '/١٠٠.']] };
      return { q: ['Prices of ' + P + ' rise ' + p + '% a year for ' + y + ' years. What is the new price, to 2 decimal places?', 'أسعار ' + P + ' ترتفع ' + p + '٪ سنويًا لـ ' + y + ' سنوات. كم السعر الجديد إلى منزلتين؟'], eq: P + ' × ' + m + '^' + y, a: ans, s: [['Multiplier', 'المضاعف', '1 + ' + p + ' ÷ 100 =', m], ['Repeat it ' + y + ' times', 'كرره ' + y + ' مرات', P + ' × ' + m + '^' + y + ' ≈', ans]], miss: [[dp(P * (1 + p * y / 100), 2), 'That adds the same amount each year. Compound multiplies.', 'هذا مقدار ثابت. المركب يضرب.']] };
    },
    trap: function (r) { var P = r.pick([1000, 2000]); return { eq: P + ' × 1.1^3', w: 1, why: ['Three years compound: 1.1³ = 1.331, not 1.3.', 'المركب لثلاث سنوات: 1.1³ = 1.331 لا 1.3.'], l: ['1 + 10 ÷ 100 = 1.1', ['Over 3 years: 1.3', 'لثلاث سنوات: 1.3'], P + ' × 1.3 = ' + (P * 1.3)] }; },
    explain: [['Why does compound growth overtake simple growth?', 'لماذا يتجاوز المركب البسيط؟'], ['Each year\'s percent is on a bigger amount.', 'نسبة كل سنة على مقدار أكبر.'], ['The percent itself rises.', 'تزيد النسبة نفسها.'], ['It does not.', 'لا يتجاوزه.']]
  });

  teach('m10.hist', {
    why: ['When groups have different widths, bar height alone misleads. Histograms fix it, with area.', 'إذا اختلفت عروض الفئات فالارتفاع وحده مضلل، والمدرج يصلح ذلك بالمساحة.'],
    idea: [{ p: ['In a histogram, area shows frequency. Height is frequency density: frequency ÷ group width.', 'في المدرج المساحة تمثل التكرار، والارتفاع كثافة التكرار: التكرار ÷ عرض الفئة.'], dia: function () { return D.bars([2, 6, 3], ['0–10', '10–15', '15–30']); } }, ['A box plot shows the median, the quartiles and the extremes at a glance.', 'الرسم الصندوقي يُظهر الوسيط والربيعين والأطراف بنظرة.']],
    g: function (r, lv) {
      var w = r.pick([5, 10, 20, 25]), dn = r.int(1, 8), f = w * dn;
      if (lv === 1) return { q: ['A group is ' + w + ' wide with frequency ' + f + '. Find the frequency density.', 'فئة عرضها ' + w + ' وتكرارها ' + f + '. أوجد كثافة التكرار.'], eq: f + ' ÷ ' + w, a: dn, s: [['Frequency ÷ width', 'التكرار ÷ العرض', f + ' ÷ ' + w + ' =', dn]], miss: [[f * w, 'Divide, do not multiply.', 'اقسم ولا تضرب.']] };
      if (lv === 2) return { q: ['A bar has height ' + dn + ' and width ' + w + '. How many are in that group?', 'عمود ارتفاعه ' + dn + ' وعرضه ' + w + '. كم عدد الفئة؟'], eq: dn + ' × ' + w, a: f, s: [['Area is the frequency', 'المساحة هي التكرار', dn + ' × ' + w + ' =', f]], miss: [[dn, 'That is the height. The area gives the frequency.', 'هذا الارتفاع. المساحة تعطي التكرار.']] };
      var q1 = r.int(10, 30), md = q1 + r.int(4, 12), q3 = md + r.int(4, 12), lo = q1 - r.int(3, 9), hi = q3 + r.int(3, 9);
      return { q: ['Box plot: lowest ' + lo + ', lower quartile ' + q1 + ', median ' + md + ', upper quartile ' + q3 + ', highest ' + hi + '. Find the interquartile range.', 'صندوقي: الأدنى ' + lo + ' والربيع الأدنى ' + q1 + ' والوسيط ' + md + ' والربيع الأعلى ' + q3 + ' والأعلى ' + hi + '. أوجد المدى الربيعي.'], eq: q3 + ' − ' + q1, a: q3 - q1, s: [['Upper quartile − lower quartile', 'الربيع الأعلى − الأدنى', q3 + ' − ' + q1 + ' =', q3 - q1]], miss: [[hi - lo, 'That is the range. Interquartile uses the box only.', 'هذا المدى. الربيعي للصندوق فقط.']] };
    },
    trap: function (r) { return { eq: '20 , 5', w: 1, q: ['A group of width 5 has frequency 20. One line is wrong. Tap it.', 'فئة عرضها 5 وتكرارها 20. سطر واحد خاطئ. انقر عليه.'], why: ['Frequency density = 20 ÷ 5 = 4, so the bar height is 4.', 'الكثافة = 20 ÷ 5 = 4، فالارتفاع ٤.'], l: ['20 ÷ 5 = 4', ['So the bar height is 20', 'فارتفاع العمود 20'], ['Area is 4 × 5', 'المساحة 4 × 5']] }; },
    explain: [['Why use area, not height, for frequency?', 'لماذا المساحة لا الارتفاع؟'], ['A wide group would otherwise look bigger than it is, or smaller.', 'وإلا بدت الفئة الواسعة أكبر أو أصغر من حقيقتها.'], ['Area looks nicer.', 'المساحة أجمل.'], ['Height is never used.', 'لا يُستخدم الارتفاع.']]
  });

  /* ---------- IGCSE core ---------- */
  teach('d10.bound2', {
    why: ['The real range of a calculated value matters for bridges and medicine doses alike.', 'المدى الحقيقي لقيمة محسوبة مهم للجسور وجرعات الدواء.'],
    idea: [['To maximise a × b, use both upper bounds. To maximise a ÷ b, use upper of a with lower of b.', 'لأكبر a × b استخدم الحدين الأعليين، ولأكبر a ÷ b استخدم الأعلى لـ a والأدنى لـ b.'], ['Dividing by a smaller number gives a bigger result.', 'القسمة على عدد أصغر تعطي ناتجًا أكبر.']],
    g: function (r, lv) {
      var a = r.int(4, 40) * 2, b = r.int(2, 10), Ah = a + .5, Al = a - .5, Bh = b + .5, Bl = b - .5;
      if (lv === 1) return { q: ['Both to the nearest whole number. Find the biggest possible value of ' + a + ' × ' + b + '.', 'كلاهما لأقرب عدد صحيح. أوجد أكبر قيمة لـ ' + a + ' × ' + b + '.'], eq: Ah + ' × ' + Bh, a: dp(Ah * Bh, 3), s: [['Upper bounds', 'الحدان الأعليان', a + ' + 0.5 =', Ah], [null, null, b + ' + 0.5 =', Bh], ['Multiply', 'اضرب', Ah + ' × ' + Bh + ' =', dp(Ah * Bh, 3)]] };
      if (lv === 2) return { q: ['Both to the nearest whole number. Find the biggest possible value of ' + a + ' ÷ ' + b + ', to 2 decimal places.', 'كلاهما لأقرب عدد صحيح. أوجد أكبر قيمة لـ ' + a + ' ÷ ' + b + ' إلى منزلتين.'], eq: Ah + ' ÷ ' + Bl, a: dp(Ah / Bl, 2), s: [['Biggest on top', 'الأكبر في البسط', a + ' + 0.5 =', Ah], ['Smallest below', 'الأصغر في المقام', b + ' − 0.5 =', Bl], ['Divide', 'اقسم', Ah + ' ÷ ' + Bl + ' ≈', dp(Ah / Bl, 2)]], miss: [[dp(Ah / Bh, 2), 'For the biggest result divide by the smallest possible.', 'لأكبر ناتج اقسم على أصغر ممكن.']] };
      return { q: ['Both to the nearest whole number. Find the smallest possible value of ' + a + ' ÷ ' + b + ', to 2 decimal places.', 'كلاهما لأقرب عدد صحيح. أوجد أصغر قيمة لـ ' + a + ' ÷ ' + b + ' إلى منزلتين.'], eq: Al + ' ÷ ' + Bh, a: dp(Al / Bh, 2), s: [['Smallest on top', 'الأصغر في البسط', a + ' − 0.5 =', Al], ['Biggest below', 'الأكبر في المقام', b + ' + 0.5 =', Bh], ['Divide', 'اقسم', Al + ' ÷ ' + Bh + ' ≈', dp(Al / Bh, 2)]], miss: [[dp(Al / Bl, 2), 'Divide by the biggest possible for the smallest result.', 'لأصغر ناتج اقسم على أكبر ممكن.']] };
    },
    trap: function (r) { return { eq: '20 ÷ 4', w: 1, q: ['Biggest value of 20 ÷ 4, each to the nearest unit. One line is wrong. Tap it.', 'أكبر قيمة لـ 20 ÷ 4 لأقرب وحدة. سطر واحد خاطئ. انقر عليه.'], why: ['Dividing by a smaller number gives more: use 3.5.', 'القسمة على أصغر تعطي أكثر: استخدم 3.5.'], l: ['20 + 0.5 = 20.5', ['Use the bigger 4.5 below', 'استخدم 4.5 الأكبر في المقام'], '20.5 ÷ 4.5 ≈ 4.56'] }; },
    explain: [['To make a ÷ b smallest, what do you choose?', 'لجعل a ÷ b أصغر، ماذا تختار؟'], ['Lower bound of a, upper bound of b.', 'الأدنى لـ a والأعلى لـ b.'], ['Both lower bounds.', 'الأدنيين.'], ['Both upper bounds.', 'الأعليين.']]
  });

  teach('d10.simul2', {
    why: ['Exam equations rarely line up. Multiply first, and any pair can be solved.', 'معادلات الامتحان نادرًا ما تتراصف. اضرب أولًا فتُحل أي معادلتين.'],
    idea: [['Multiply one or both equations so that a letter has the same number. 2x + 3y = 12 and 3x + y = 11: multiply the second by 3.', 'اضرب واحدة أو الاثنتين ليتساوى عدد حرف. 2x + 3y = 12 و3x + y = 11: اضرب الثانية في ٣.'], ['Then subtract to remove it: 7x = 21, so x = 3 and y = 2.', 'ثم اطرح لإزالته: 7x = 21 فـ x = 3 وy = 2.']],
    g: function (r, lv) {
      var x = r.int(1, 7), y = r.int(1, 7), a = r.int(2, 5), b = r.int(2, 5), c = r.int(2, 5), d = 1; if (b * c - a === 0) c++; var R1 = a * x + b * y, R2 = c * x + d * y, k = b;
      var E = a + 'x + ' + b + 'y = ' + R1 + ' ,  ' + c + 'x + y = ' + R2;
      if (lv === 1) return { q: ['What should the second equation be multiplied by, to match the y number?', 'في كم تُضرب الثانية ليتساوى عدد y؟'], eq: E, a: k, s: [['Match the y number', 'طابق عدد y', 'Answer:', k]], miss: [[a, 'That matches x. The question asks about y.', 'هذا يطابق x. السؤال عن y.']] };
      var nx = k * c - a, nr = k * R2 - R1;
      if (nx === 0) { c += 1; nx = k * c - a; R2 = c * x + y; nr = k * R2 - R1; E = a + 'x + ' + b + 'y = ' + R1 + ' ,  ' + c + 'x + y = ' + R2; }
      var st = [['Multiply the second by ' + k, 'اضرب الثانية في ' + k, k + ' × ' + R2 + ' =', k * R2], ['Subtract: the x number', 'اطرح: عدد x', (k * c) + ' − ' + a + ' =', mn(nx)], ['Subtract: the right side', 'اطرح: الطرف الأيمن', (k * R2) + ' − ' + R1 + ' =', mn(nr)], ['Divide', 'اقسم', mn(nr) + ' ÷ ' + mn(nx) + ' =', x]];
      if (lv === 2) return { q: ['Solve. Find x.', 'حُلّ. أوجد x.'], eq: E, a: x, s: st, miss: [[y, 'That is y. Find x.', 'هذا y. أوجد x.']] };
      return { q: ['Solve. Find y.', 'حُلّ. أوجد y.'], eq: E, a: y, s: st.concat([['Put x back', 'عوّض x', R2 + ' − ' + c + ' × ' + x + ' =', y]]), miss: [[x, 'That is x. Put it back to find y.', 'هذا x. عوّضه لتجد y.']] };
    },
    trap: function (r) { return { eq: '2x + 3y = 12 ,  3x + y = 11', w: 0, why: ['Multiply every term, including the 11: 33.', 'اضرب كل حد بما فيه ١١: ٣٣.'], l: [['× 3: 9x + 3y = 11', '× 3: 9x + 3y = 11'], ['Subtract: 7x = −1', 'اطرح: 7x = −1'], ['x is a fraction', 'x كسر']] }; },
    explain: [['Why does multiplying an equation not change its solutions?', 'لماذا لا يغيّر ضرب المعادلة حلولها؟'], ['Both sides change alike, so the balance holds.', 'يتغير الطرفان معًا فيبقى التوازن.'], ['It does change them.', 'بل يغيّرها.'], ['Because x is small.', 'لأن x صغير.']]
  });

  teach('d10.nthq', {
    why: ['When the gaps themselves change, the rule has an n². Falling objects follow this pattern.', 'إذا تغيرت الفروق نفسها ففي القاعدة n²، والأجسام الساقطة تتبع هذا.'],
    idea: [['Find the second differences. If they are constant, the n² number is half of that.', 'أوجد الفروق الثانية. إذا ثبتت فعدد n² نصفها.'], ['3, 6, 11, 18: first gaps 3, 5, 7; second gap 2. So 1n². Take n² away: 2, 2, 2, 2. So n² + 2.', '٣ و٦ و١١ و١٨: الفروق ٣ و٥ و٧، والثانية ٢. فهي 1n². اطرح n²: ٢ و٢ و٢ و٢. فهي n² + 2.']],
    g: function (r, lv) {
      var a = r.int(1, 3), b = r.int(-3, 4), c = r.int(-3, 6), t = [1, 2, 3, 4, 5].map(function (n) { return a * n * n + b * n + c; }), f = t.slice(1).map(function (v, i) { return v - t[i]; }), sec = f[1] - f[0], lin = t.map(function (v, i) { return v - a * (i + 1) * (i + 1); });
      if (lv === 1) return { q: ['Find the second difference.', 'أوجد الفرق الثاني.'], eq: t.join(', '), a: sec, s: [['First gaps', 'الفروق الأولى', f.map(mn).join(', ')], ['Gaps of the gaps', 'فروق الفروق', mn(f[1]) + ' − ' + (f[0] < 0 ? '(' + mn(f[0]) + ')' : f[0]) + ' =', sec]], miss: [[f[0], 'That is a first gap. Take the gaps of those.', 'هذا فرق أول. خذ فروقها.']] };
      if (lv === 2) return { q: ['The rule is an² + bn + c. Find a.', 'القاعدة an² + bn + c. أوجد a.'], eq: t.join(', '), a: a, s: [['Second difference', 'الفرق الثاني', mn(f[1]) + ' − ' + (f[0] < 0 ? '(' + mn(f[0]) + ')' : f[0]) + ' =', sec], ['Halve it', 'نصّفه', sec + ' ÷ 2 =', a]], miss: [[sec, 'Halve the second difference.', 'نصّف الفرق الثاني.']] };
      var n = r.int(6, 12), tn = a * n * n + b * n + c;
      return { q: ['The rule is ' + a + 'n² ' + sg(b) + 'n ' + sg(c) + '. Find term ' + n + '.', 'القاعدة ' + a + 'n² ' + sg(b) + 'n ' + sg(c) + '. أوجد الحد ' + n + '.'], eq: a + ' × ' + n + '² ' + sg(b) + ' × ' + n + ' ' + sg(c), a: tn, s: [['n² part', 'جزء n²', a + ' × ' + n + ' × ' + n + ' =', a * n * n], ['n part', 'جزء n', mn(b) + ' × ' + n + ' =', mn(b * n)], ['Add all', 'اجمع الكل', (a * n * n) + ' ' + sg(b * n) + ' ' + sg(c) + ' =', tn]] };
    },
    trap: function (r) { return { eq: '3, 6, 11, 18', w: 2, why: ['Half of 2 is 1, so the rule starts with 1n².', 'نصف ٢ هو ١ فالقاعدة تبدأ بـ 1n².'], l: ['6 − 3 = 3', '5 − 3 = 2', ['So 2n²', 'إذن 2n²'], ['Then compare with the terms', 'ثم قارن بالحدود']] }; },
    explain: [['Why is the n² number half the second difference?', 'لماذا عدد n² نصف الفرق الثاني؟'], ['Second differences of n² are 2, and 2n² gives 4, so always double.', 'فروق n² الثانية ٢، و2n² تعطي ٤، فهي الضعف دائمًا.'], ['It is a coincidence.', 'صدفة.'], ['It is not half.', 'ليس نصفًا.']]
  });

  teach('d10.transf', {
    why: ['Move a formula, move a graph. Learning one shape gives you a family of them.', 'حرّك الصيغة يتحرك الرسم، وشكل واحد يعطيك عائلة.'],
    idea: [{ p: ['y = f(x) + a moves up by a. y = f(x + a) moves left by a: inside the bracket does the opposite.', 'y = f(x) + a يرفع a. وy = f(x + a) يحرّك يسارًا a: ما في القوس يعمل عكسيًا.'], dia: function () { return D.axes({ x: [-4, 4], y: [-1, 9], fn: function (x) { return x * x; }, pts: [[0, 3, 'y = x² + 3']] }); } }, ['y = −f(x) flips over the x axis. y = f(−x) flips over the y axis.', 'y = −f(x) يقلب حول محور x، وy = f(−x) حول محور y.']],
    g: function (r, lv) {
      var a = r.int(1, 6), pool = lv === 1 ? [['y = f(x) + ' + a, ['Up ' + a, 'أعلى ' + a], ['Down ' + a, 'أسفل ' + a], ['Right ' + a, 'يمين ' + a]], ['y = f(x) − ' + a, ['Down ' + a, 'أسفل ' + a], ['Up ' + a, 'أعلى ' + a], ['Left ' + a, 'يسار ' + a]]] : lv === 2 ? [['y = f(x + ' + a + ')', ['Left ' + a, 'يسار ' + a], ['Right ' + a, 'يمين ' + a], ['Up ' + a, 'أعلى ' + a]], ['y = f(x − ' + a + ')', ['Right ' + a, 'يمين ' + a], ['Left ' + a, 'يسار ' + a], ['Down ' + a, 'أسفل ' + a]]] : [['y = −f(x)', ['Flip over the x axis', 'قلب حول محور x'], ['Flip over the y axis', 'قلب حول محور y'], ['Move left', 'حركة يسارًا']], ['y = f(−x)', ['Flip over the y axis', 'قلب حول محور y'], ['Flip over the x axis', 'قلب حول محور x'], ['Move down', 'حركة إلى الأسفل']], ['y = 2f(x)', ['Stretch up, by 2', 'تمديد رأسي ٢'], ['Stretch sideways, by 2', 'تمديد أفقي ٢'], ['Move up 2', 'رفع ٢']]], x = r.pick(pool);
      return { q: ['How does ' + TM.ltr(x[0]) + ' move the graph of y = f(x)?', 'كيف يحرّك ' + TM.ltr(x[0]) + ' رسم y = f(x)؟'], o: [x[1], x[2], x[3]], s: [['Outside acts as read; inside does the opposite', 'الخارج كما يُقرأ والداخل عكسيًا', x[1]]] };
    },
    trap: function (r) { return { w: 1, q: ['Moving y = x². One line is wrong. Tap it.', 'تحريك y = x². سطر واحد خاطئ. انقر عليه.'], why: ['(x + 2)² moves left: its lowest point is at x = −2.', '(x + 2)² تتحرك يسارًا: أدنى نقطة عند x = −2.'], l: [['x² + 2: up 2', 'x² + 2: أعلى ٢'], ['(x + 2)²: right 2', '(x + 2)²: يمين ٢'], ['−x²: flip over the x axis', '−x²: قلب حول محور x']] }; },
    explain: [['Why does f(x − 2) move the graph to the right?', 'لماذا f(x − 2) تحرّك إلى اليمين؟'], ['x must be 2 bigger to get the same output as before.', 'يلزم x أكبر بـ ٢ ليعطي المخرج نفسه.'], ['Because minus means right.', 'لأن السالب يعني اليمين.'], ['It moves left.', 'تتحرك يسارًا.']]
  });

  teach('d10.factlcm', {
    why: ['A method that always works, even for numbers too big to list.', 'طريقة تنجح دائمًا حتى مع الأعداد الكبيرة.'],
    idea: [{ p: ['Put the prime factors in a Venn diagram. Shared ones go in the middle. HCF = the middle. LCM = everything.', 'ضع العوامل الأولية في مخطط. المشترك في الوسط. العامل المشترك = الوسط، والمضاعف = الكل.'], dia: function () { return D.venn('2', '2, 3', '7', null); } }, ['For 12 and 42: shared 2 and 3. HCF = 6. LCM = 2 × 2 × 3 × 7 = 84.', 'لـ ١٢ و٤٢: المشترك ٢ و٣. العامل = ٦، والمضاعف = ٢ × ٢ × ٣ × ٧ = ٨٤.']],
    g: function (r, lv) {
      var hs = r.pick([2, 3, 4, 5, 6, 10]), p = r.pick([2, 3, 5, 7]), q0 = r.pick([3, 5, 7, 11].filter(function (v) { return v !== p && gcd(v, p) === 1; })), a = hs * p, b = hs * q0, h = gcd(a, b), l = a * b / h;
      if (lv === 1) return { q: ['Find the HCF.', 'أوجد العامل المشترك الأكبر.'], eq: a + ' , ' + b, dia: D.venn(a / h, h, b / h, null), a: h, s: [['Divide each by it', 'اقسم كلًا عليه', a + ' ÷ ' + h + ' =', a / h], [null, null, b + ' ÷ ' + h + ' =', b / h], ['The middle', 'الوسط', 'Factor:', h]] };
      if (lv === 2) return { q: ['Find the LCM.', 'أوجد المضاعف المشترك الأصغر.'], eq: a + ' , ' + b, dia: D.venn(a / h, h, b / h, null), a: l, s: [['Everything in the diagram', 'كل ما في المخطط', (a / h) + ' × ' + h + ' × ' + (b / h) + ' =', l]], miss: [[a * b, 'The shared part is counted only once.', 'المشترك يُعدّ مرة واحدة.']] };
      return { q: ['Two lights flash every ' + a + ' and ' + b + ' seconds. If they flash together now, how many seconds until they do so again?', 'ضوءان يومضان كل ' + a + ' و' + b + ' ثانية. إذا ومضا معًا الآن، فبعد كم ثانية يتكرر؟'], eq: a + ' , ' + b, a: l, s: [['That asks for the LCM', 'المطلوب المضاعف', (a / h) + ' × ' + h + ' × ' + (b / h) + ' =', l]], miss: [[h, 'That is the HCF: the common factor. Flashes need multiples.', 'هذا العامل المشترك. الوميض مضاعفات.']] };
    },
    trap: function (r) { return { eq: '12 , 18', w: 1, why: ['Shared 2 and 3 count once: 2 × 2 × 3 × 3 = 36.', 'المشترك يُعدّ مرة: ٢ × ٢ × ٣ × ٣ = ٣٦.'], l: ['12 = 2 × 2 × 3', ['LCM uses all: 12 × 18', 'المضاعف يستخدم الكل: 12 × 18'], '18 = 2 × 3 × 3'] }; },
    explain: [['Why is HCF × LCM equal to the two numbers multiplied?', 'لماذا العامل × المضاعف = حاصل ضرب العددين؟'], ['Together they hold every prime factor exactly as often as the two numbers do.', 'يضمان كل العوامل الأولية بعددها في العددين.'], ['A coincidence.', 'صدفة.'], ['It is not true.', 'غير صحيح.']]
  });

  teach('d10.interest', {
    why: ['A car loses value each year, while a city grows. Both are the same calculation.', 'تفقد السيارة قيمتها كل سنة وتنمو المدينة: الحساب نفسه.'],
    idea: [['Growth multiplies by more than 1. Depreciation multiplies by less than 1. A loss of 15% a year is × 0.85 each year.', 'النمو يضرب في أكثر من ١، والإهلاك في أقل من ١. خسارة ١٥٪ سنويًا × ٠٫٨٥ كل سنة.'], ['After n years: start × multiplier to the power n.', 'بعد n سنة: البداية × المضاعف ^ n.']],
    calc: true,
    g: function (r, lv) {
      var P = r.pick([1000, 2000, 5000, 8000, 10000, 20000]), p = r.pick([5, 10, 15, 20, 25]), m = dp(1 - p / 100, 2), y = r.int(2, 4), val = dp(P * Math.pow(m, y), 2);
      if (lv === 1) return { q: ['Something loses ' + p + '% a year. What is the yearly multiplier?', 'يخسر شيء ' + p + '٪ سنويًا. ما المضاعف السنوي؟'], eq: '1 − ' + p + '/100', a: m, s: [['1 minus the percent', '١ ناقص النسبة', '1 − ' + p + ' ÷ 100 =', m]], miss: [[dp(p / 100, 2), 'That is what is lost. Keep what is left.', 'هذا ما يُفقد. أبقِ الباقي.'], [dp(1 + p / 100, 2), 'That is growth. This is losing value.', 'هذا نمو. هنا خسارة.']] };
      if (lv === 2) return { q: ['A car worth ' + P + ' loses ' + p + '% a year. What is it worth after ' + y + ' years, to 2 decimal places?', 'سيارة بـ ' + P + ' تخسر ' + p + '٪ سنويًا. كم قيمتها بعد ' + y + ' سنوات إلى منزلتين؟'], eq: P + ' × ' + m + '^' + y, a: val, s: [['The multiplier', 'المضاعف', '1 − ' + p + ' ÷ 100 =', m], ['Apply it ' + y + ' times', 'طبّقه ' + y + ' مرات', P + ' × ' + m + '^' + y + ' ≈', val]], miss: [[dp(P * (1 - p * y / 100), 2), 'That takes the same amount each year. The loss is on what remains.', 'هذا مقدار ثابت. الخسارة على الباقي.']] };
      var g0 = dp(1 + p / 100, 2), gv = dp(P * Math.pow(g0, y), 2);
      return { q: ['A town of ' + P + ' grows ' + p + '% a year. What is its size after ' + y + ' years, to 2 decimal places?', 'مدينة ' + P + ' نسمة تنمو ' + p + '٪ سنويًا. كم عددها بعد ' + y + ' سنوات إلى منزلتين؟'], eq: P + ' × ' + g0 + '^' + y, a: gv, s: [['The multiplier', 'المضاعف', '1 + ' + p + ' ÷ 100 =', g0], ['Apply it ' + y + ' times', 'طبّقه ' + y + ' مرات', P + ' × ' + g0 + '^' + y + ' ≈', gv]] };
    },
    trap: function (r) { return { eq: '1000 × 0.9^2', w: 1, why: ['The second year loses 10% of 900, not of 1000.', 'السنة الثانية تخسر ١٠٪ من ٩٠٠ لا ١٠٠٠.'], l: ['1000 × 0.9 = 900', ['Take off 100 again: 800', 'اطرح 100 مرة أخرى: 800'], ['Worth 800', 'القيمة 800']] }; },
    explain: [['Can something losing 10% a year ever reach zero?', 'هل يبلغ الصفر ما يخسر ١٠٪ سنويًا؟'], ['Never exactly: it always keeps 90% of something.', 'لا تمامًا: يبقى دائمًا ٩٠٪ من شيء.'], ['Yes, after 10 years.', 'نعم بعد ١٠ سنوات.'], ['Yes, after 100 years.', 'نعم بعد ١٠٠ سنة.']]
  });

  teach('d10.statcomp', {
    why: ['"Which class did better?" needs two things: a typical value and how spread out they are.', '«أي الصفين أفضل؟» يحتاج إلى أمرين: قيمة نموذجية والانتشار.'],
    idea: [{ p: ['Compare an average (median or mean) and a spread (range or interquartile range).', 'قارن متوسطًا (الوسيط أو المتوسط) وانتشارًا (المدى أو الربيعي).'], dia: function () { return D.bars([6, 8, 4], ['A', 'B', 'C']); } }, ['Say what it means in context: a smaller spread means the results are more consistent.', 'اذكر المعنى: انتشار أصغر يعني نتائج أكثر اتساقًا.']],
    g: function (r, lv) {
      var m1 = r.int(50, 70), m2 = m1 + r.int(4, 15), s1 = r.int(10, 30), s2 = s1 + r.int(5, 15);
      if (lv === 1) return { q: ['Class A has median ' + m1 + ', class B median ' + m2 + '. Which did better on average?', 'وسيط الصف A هو ' + m1 + ' والصف B هو ' + m2 + '. أيهما أفضل في المتوسط؟'], o: [['Class B', 'الصف B'], ['Class A', 'الصف A'], ['They are equal', 'متساويان']], s: [['A higher average is better here', 'المتوسط الأعلى أفضل هنا', m2 + ' − ' + m1 + ' =', m2 - m1]] };
      if (lv === 2) return { q: ['Interquartile range: A ' + s1 + ', B ' + s2 + '. Which is more consistent?', 'الربيعي: A ' + s1 + ' وB ' + s2 + '. أيهما أكثر اتساقًا؟'], o: [['Class A', 'الصف A'], ['Class B', 'الصف B', 'A bigger spread is less consistent.', 'الانتشار الأكبر أقل اتساقًا.'], ['They are equal', 'متساويان']], s: [['The smaller spread', 'الانتشار الأصغر', s2 + ' − ' + s1 + ' =', s2 - s1]] };
      return { q: ['A: median ' + m1 + ', range ' + s1 + '. B: median ' + m2 + ', range ' + s2 + '. Which is the best comparison?', 'A: الوسيط ' + m1 + ' والمدى ' + s1 + '. B: الوسيط ' + m2 + ' والمدى ' + s2 + '. ما أفضل مقارنة؟'], o: [['B scored higher on average, but A was more consistent.', 'B أعلى في المتوسط، وA أكثر اتساقًا.'], ['B was better in every way.', 'B أفضل في كل شيء.'], ['A scored higher and was more consistent.', 'A أعلى وأكثر اتساقًا.']], s: [['An average and a spread', 'متوسط وانتشار', ['Both are needed', 'كلاهما لازم']]] };
    },
    trap: function (r) { return { w: 1, q: ['Comparing two classes. One line is poor reasoning. Tap it.', 'مقارنة صفين. سطر واحد استدلال ضعيف. انقر عليه.'], why: ['A big range means less consistent, not better.', 'المدى الكبير يعني اتساقًا أقل لا أفضلية.'], l: [['B has the higher median', 'وسيط B أعلى'], ['B has a bigger range, so B is better', 'مدى B أكبر، فهو أفضل'], ['A\'s results are closer together', 'نتائج A أقرب']] }; },
    explain: [['Why is one average not enough to compare two groups?', 'لماذا لا يكفي متوسط واحد لمقارنة مجموعتين؟'], ['Two groups can share an average yet be very different in spread.', 'قد تتساويان متوسطًا وتختلفان انتشارًا.'], ['Averages are often wrong.', 'المتوسطات خاطئة غالبًا.'], ['It is enough.', 'يكفي.']]
  });

  /* ---------- IGCSE extended ---------- */
  teach('x10m.exact', {
    why: ['Some angles have exact trig values you can derive from a square and an equilateral triangle.', 'لبعض الزوايا قيم دقيقة تُشتق من مربع ومثلث متساوي الأضلاع.'],
    idea: [{ p: ['Half a square gives 45°: sides 1, 1, √2. Half an equilateral triangle gives 30° and 60°: sides 1, √3, 2.', 'نصف المربع يعطي ٤٥°: أضلاع ١ و١ و√٢. ونصف المتساوي الأضلاع يعطي ٣٠° و٦٠°: ١ و√٣ و٢.'], dia: function () { return D.tri({ right: 0, sides: ['√3', '2', '1'], angles: [null, '30°', '60°'] }); } }, ['sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1. Derive them, do not just memorise.', 'sin 30° = ١/٢ وcos 60° = ١/٢ وtan 45° = ١. اشتقها ولا تكتفِ بالحفظ.']],
    g: function (r, lv) {
      var T1 = [['sin 30°', '1/2'], ['cos 60°', '1/2'], ['tan 45°', '1'], ['sin 90°', '1'], ['cos 0°', '1'], ['sin 0°', '0'], ['cos 90°', '0'], ['tan 0°', '0']], x = r.pick(T1);
      if (lv < 3) return { q: ['Give the exact value.', 'أعط القيمة الدقيقة.'], eq: x[0], a: x[1], s: [['From the triangles', 'من المثلثين', x[0] + ' =', x[1]]], miss: [[x[1] === '1/2' ? '1' : '1/2', 'Draw the half square or half triangle, and read the sides.', 'ارسم نصف المربع أو المثلث واقرأ الأضلاع.']] };
      var pick = r.pick([[2, 30, 'sin', '1/2', 1], [4, 30, 'sin', '1/2', 2], [6, 60, 'cos', '1/2', 3], [10, 30, 'sin', '1/2', 5], [5, 45, 'tan', '1', 5], [8, 60, 'cos', '1/2', 4]]);
      return { q: ['Without a calculator, work out ' + pick[0] + ' × ' + pick[2] + ' ' + pick[1] + '°.', 'دون آلة: احسب ' + pick[0] + ' × ' + pick[2] + ' ' + pick[1] + '°.'], eq: pick[0] + ' × ' + pick[3], a: pick[4], s: [['The exact value', 'القيمة الدقيقة', pick[2] + ' ' + pick[1] + '° =', pick[3]], ['Multiply', 'اضرب', pick[0] + ' × ' + pick[3] + ' =', pick[4]]] };
    },
    trap: function (r) { return { w: 1, q: ['Exact values. One line is wrong. Tap it.', 'قيم دقيقة. سطر واحد خاطئ. انقر عليه.'], why: ['sin 60° = √3/2. It is cos 60° that is 1/2.', 'sin 60° = √3/2، والذي يساوي ١/٢ هو cos 60°.'], l: [['sin 30° is 1/2', 'sin 30° = 1/2'], ['sin 60° is 1/2', 'sin 60° = 1/2'], ['tan 45° is 1', 'tan 45° = 1']] }; },
    explain: [['Why is tan 45° exactly 1?', 'لماذا tan 45° تساوي ١ تمامًا؟'], ['In half a square, the opposite and adjacent sides are equal.', 'في نصف المربع المقابل والمجاور متساويان.'], ['By luck.', 'صدفة.'], ['45 is half of 90.', '٤٥ نصف ٩٠.']]
  });

  teach('x10m.trigg', {
    why: ['Sound, tides, the height of the sun through a year and alternating current are all waves.', 'الصوت والمد وارتفاع الشمس والتيار المتردد كلها موجات.'],
    idea: [{ p: ['sin x makes a wave from −1 to 1, repeating every 360°. cos x is the same wave shifted by 90°.', 'sin x موجة بين −١ و١ تتكرر كل ٣٦٠°، وcos x الموجة نفسها مزاحة ٩٠°.'], dia: function () { return D.axes({ x: [0, 360], y: [-1.5, 1.5], step: 90, fn: function (x) { return Math.sin(x * Math.PI / 180); } }); } }, ['Use the symmetry: sin 150° = sin 30° = 0.5. So sin x = 0.5 has two answers, 30° and 150°.', 'استخدم التناظر: sin 150° = sin 30° = ٠٫٥. فلـ sin x = ٠٫٥ حلان: ٣٠° و١٥٠°.']],
    calc: true,
    g: function (r, lv) {
      var a = r.pick([10, 20, 30, 40, 50, 60, 70, 80]);
      if (lv === 1) return { q: ['Use the symmetry of sin: sin x = sin ' + a + '° for x between 90° and 180°. Find x.', 'استخدم تناظر sin: sin x = sin ' + a + '° بين ٩٠° و١٨٠°. أوجد x.'], eq: '180 − ' + a, a: 180 - a, s: [['Mirror in 90°', 'مرآة عند ٩٠°', '180 − ' + a + ' =', 180 - a]], miss: [[360 - a, 'That is for cos. For sin, use 180 − x.', 'هذا لـ cos. لـ sin استخدم 180 − x.']] };
      if (lv === 2) return { q: ['cos x = cos ' + a + '° for x between 270° and 360°. Find x.', 'cos x = cos ' + a + '° بين ٢٧٠° و٣٦٠°. أوجد x.'], eq: '360 − ' + a, a: 360 - a, s: [['Mirror in 180°', 'مرآة عند ١٨٠°', '360 − ' + a + ' =', 360 - a]], miss: [[180 - a, 'That is for sin. For cos, use 360 − x.', 'هذا لـ sin. لـ cos استخدم 360 − x.']] };
      var pw = r.pick([2, 3, 4, 5]);
      return { q: ['What is the maximum of y = ' + pw + ' sin x?', 'ما أكبر قيمة لـ y = ' + pw + ' sin x؟'], eq: pw + ' × 1', dia: D.axes({ x: [0, 360], y: [-pw - 1, pw + 1], step: 90, fn: function (x) { return pw * Math.sin(x * Math.PI / 180); } }), a: pw, s: [['sin is at most 1', 'أكبر قيمة لـ sin هي ١', pw + ' × 1 =', pw]], miss: [[1, 'The ' + pw + ' stretches the wave.', 'العدد ' + pw + ' يمدد الموجة.']] };
    },
    trap: function (r) { return { w: 1, q: ['Solving sin x = 0.5 from 0° to 360°. One line is wrong. Tap it.', 'حل sin x = 0.5 من 0° إلى 360°. سطر واحد خاطئ. انقر عليه.'], why: ['There are two answers: 30° and 150°.', 'هناك حلان: ٣٠° و١٥٠°.'], l: ['sin 30° = 0.5', ['So the only answer is 30°', 'فالحل الوحيد 30°'], ['The wave crosses y = 0.5 twice', 'تقطع الموجة y = 0.5 مرتين']] }; },
    explain: [['Why can sin x = 2 have no solution?', 'لماذا لا حل لـ sin x = 2؟'], ['The sine wave never goes above 1.', 'لا تتجاوز موجة الجيب ١.'], ['2 is even.', '٢ زوجي.'], ['It does have one.', 'لها حل.']]
  });

  teach('x10m.halfab', {
    why: ['Find the area of any triangle from two sides and the angle between them, without its height.', 'أوجد مساحة أي مثلث من ضلعين والزاوية بينهما دون الارتفاع.'],
    idea: [{ p: ['Area = ½ × a × b × sin C, where C is the angle between sides a and b.', 'المساحة = ½ × a × b × sin C، حيث C الزاوية بين a وb.'], dia: function () { return D.tri({ sides: ['a', null, 'b'], angles: ['C', null, null] }); } }, ['It is ½ × base × height, where the height is b sin C.', 'هي ½ × القاعدة × الارتفاع، والارتفاع b sin C.']],
    calc: true,
    g: function (r, lv) {
      var a = 2 * r.int(2, 9), b = r.int(3, 12), C0 = lv === 1 ? 30 : r.pick([40, 50, 60, 70, 80, 110, 130]);
      if (lv === 1) return { q: ['Sides ' + a + ' and ' + b + ', with 30° between them. Find the exact area. sin 30° = 1/2.', 'ضلعان ' + a + ' و' + b + ' بينهما ٣٠°. أوجد المساحة بدقة. sin 30° = ١/٢.'], eq: '½ × ' + a + ' × ' + b + ' × ½', dia: D.tri({ sides: [a, null, b], angles: ['30°', null, null] }), a: a * b / 4, s: [['½ × a × b', '½ × a × b', a + ' × ' + b + ' ÷ 2 =', a * b / 2], ['× sin 30°', '× sin 30°', (a * b / 2) + ' ÷ 2 =', a * b / 4]], miss: [[a * b / 2, 'Multiply by sin 30° as well.', 'اضرب في sin 30° أيضًا.']] };
      var A0 = dp(.5 * a * b * Math.sin(rad(C0)), 1);
      if (lv === 2) return { q: ['Sides ' + a + ' and ' + b + ', with ' + C0 + '° between them. Find the area to 1 decimal place.', 'ضلعان ' + a + ' و' + b + ' بينهما ' + C0 + '°. أوجد المساحة إلى منزلة عشرية.'], eq: '½ × ' + a + ' × ' + b + ' × sin ' + C0 + '°', dia: D.tri({ sides: [a, null, b], angles: [C0 + '°', null, null] }), a: A0, s: [['½ × a × b', '½ × a × b', a + ' × ' + b + ' ÷ 2 =', a * b / 2], ['× sin C', '× sin C', (a * b / 2) + ' × sin ' + C0 + '° ≈', A0]], miss: [[a * b / 2, 'That is half of the rectangle. Multiply by sin C.', 'نصف المستطيل. اضرب في sin C.']] };
      var ar = r.int(5, 30), sn = dp(2 * ar / (a * b), 2);
      if (sn >= 1) { ar = Math.floor(a * b / 4); sn = dp(2 * ar / (a * b), 2); }
      return { q: ['Area ' + ar + ', sides ' + a + ' and ' + b + '. Find sin C, to 2 decimal places.', 'المساحة ' + ar + ' والضلعان ' + a + ' و' + b + '. أوجد sin C إلى منزلتين.'], eq: '2 × ' + ar + ' ÷ (' + a + ' × ' + b + ')', a: sn, s: [['Double the area', 'ضاعف المساحة', '2 × ' + ar + ' =', 2 * ar], ['Divide by the sides', 'اقسم على الضلعين', (2 * ar) + ' ÷ ' + (a * b) + ' ≈', sn]] };
    },
    trap: function (r) { return { eq: '8 , 5 , 30°', w: 1, why: ['The formula has the ½: ½ × 8 × 5 × sin 30° = 10.', 'الصيغة فيها ½: ½ × 8 × 5 × sin 30° = 10.'], l: ['8 × 5 = 40', ['Area: 40 × sin 30°', 'المساحة: 40 × sin 30°'], ['Area 20', 'المساحة 20']] }; },
    explain: [['Why must C be between the two sides?', 'لماذا يجب أن تكون C بين الضلعين؟'], ['b sin C is the height only if C joins them.', 'b sin C هو الارتفاع إذا كانت C تصلهما.'], ['It makes no difference.', 'لا فرق.'], ['For neatness.', 'للترتيب.']]
  });

  teach('x10m.graphs', {
    why: ['Knowing the shape of a graph before plotting it is real mathematical sense.', 'معرفة شكل الرسم قبل رسمه حس رياضي حقيقي.'],
    idea: [{ p: ['y = x³: an S shape through the origin. y = 1/x: two separate curves that never touch the axes.', 'y = x³: شكل S عبر الأصل. y = 1/x: منحنيان منفصلان لا يمسان المحورين.'], dia: function () { return D.axes({ x: [-3, 3], y: [-8, 8], step: 2, fn: function (x) { return x * x * x; } }); } }, ['1/x has no value at x = 0: dividing by zero is impossible. The lines it approaches are asymptotes.', 'لا قيمة لـ 1/x عند x = ٠، فالقسمة على صفر مستحيلة. والخطوط التي يقترب منها خطوط تقارب.']],
    g: function (r, lv) {
      var x = r.int(-4, 5) || 2;
      if (lv === 1) return { q: ['For y = x³, find y when x = ' + mn(x) + '.', 'لـ y = x³، أوجد y عند x = ' + mn(x) + '.'], eq: '(' + mn(x) + ')³', a: x * x * x, s: [['Multiply three times', 'اضرب ثلاث مرات', (x < 0 ? '(' + mn(x) + ')' : x) + ' × ' + (x < 0 ? '(' + mn(x) + ')' : x) + ' × ' + (x < 0 ? '(' + mn(x) + ')' : x) + ' =', mn(x * x * x)]], miss: [[3 * x, 'Cubing is not × 3.', 'التكعيب ليس × ٣.'], [x * x, 'Multiply one more time.', 'اضرب مرة أخرى.']] };
      if (lv === 2) { var d = r.pick([1, 2, 4, 5, 10, -2, -4]), k = r.pick([4, 8, 20, 40]); return { q: ['For y = ' + k + '/x, find y when x = ' + mn(d) + '.', 'لـ y = ' + k + '/x، أوجد y عند x = ' + mn(d) + '.'], eq: k + ' ÷ ' + (d < 0 ? '(' + mn(d) + ')' : d), a: k / d, s: [['Divide', 'اقسم', k + ' ÷ ' + (d < 0 ? '(' + mn(d) + ')' : d) + ' =', mn(k / d)]] }; }
      var pool = [[['y = x²', 'y = x²'], ['A U shape', 'شكل U'], ['An S shape', 'شكل S'], ['A straight line', 'خط مستقيم']], [['y = x³', 'y = x³'], ['An S shape', 'شكل S'], ['A U shape', 'شكل U'], ['Two separate curves', 'منحنيان منفصلان']], [['y = 1/x', 'y = 1/x'], ['Two separate curves', 'منحنيان منفصلان'], ['A U shape', 'شكل U'], ['A straight line', 'خط مستقيم']], [['y = 2x + 1', 'y = 2x + 1'], ['A straight line', 'خط مستقيم'], ['A U shape', 'شكل U'], ['An S shape', 'شكل S']]], c = r.pick(pool);
      return { q: ['What shape is ' + TM.ltr(c[0][0]) + '?', 'ما شكل ' + TM.ltr(c[0][0]) + '؟'], o: [c[1], c[2], c[3]], s: [['The highest power decides', 'الأس الأعلى يحدد', c[1]]] };
    },
    trap: function (r) { return { w: 1, q: ['Facts about y = 1/x. One line is wrong. Tap it.', 'حقائق عن y = 1/x. سطر واحد خاطئ. انقر عليه.'], why: ['x = 0 has no value: you cannot divide by zero.', 'لا قيمة عند x = ٠: لا تجوز القسمة على صفر.'], l: [['At x = 2, y is 0.5', 'عند x = 2 فإن y = 0.5'], ['At x = 0, y is 0', 'عند x = 0 فإن y = 0'], ['At x = −1, y is −1', 'عند x = −1 فإن y = −1']] }; },
    explain: [['Why does y = x³ go negative for negative x, but y = x² does not?', 'لماذا y = x³ سالبة عند x السالب، وy = x² لا؟'], ['Three negatives multiply to a negative, two to a positive.', 'ثلاثة سوالب تعطي سالبًا، واثنان موجبًا.'], ['Bigger powers are negative.', 'الأسس الكبرى سالبة.'], ['Both are positive.', 'كلاهما موجب.']]
  });

  teach('x10m.proof', {
    why: ['Algebraic proof is how a mathematician knows something for every number, forever.', 'البرهان الجبري هو ما يجعل الرياضي يعرف الأمر لكل عدد إلى الأبد.'],
    idea: [['Write the general case with letters, simplify, and show the result has the property.', 'اكتب الحالة العامة بالحروف، وبسّط، وأظهر أن للناتج الخاصية.'], ['(n + 1)² − n² = 2n + 1, which is always odd. So the difference of two neighbouring squares is odd.', '(n + 1)² − n² = 2n + 1، وهو فردي دائمًا. ففرق مربعين متتاليين فردي.']],
    g: function (r, lv) {
      var pool = lv === 1 ? [[['Simplify (n + 1)² − n².', 'بسّط (n + 1)² − n².'], '2n + 1', 'n + 1', '2n'], [['Simplify (n + 1) + (n + 2) + n.', 'بسّط (n + 1) + (n + 2) + n.'], '3n + 3', '3n', 'n + 3']] : lv === 2 ? [[['Which proves the sum of three consecutive numbers is a multiple of 3?', 'أيها يثبت أن مجموع ثلاثة متتالية مضاعف لـ ٣؟'], '3n + 3 = 3(n + 1)', '1 + 2 + 3 = 6', 'n + n + n = n'], [['Which proves two odds multiply to an odd?', 'أيها يثبت أن ضرب فرديين فردي؟'], '(2a + 1)(2b + 1) = 2(2ab + a + b) + 1', '3 × 5 = 15', '(2a)(2b) = 4ab']] : [[['The product of consecutive n and n + 1 is always', 'حاصل ضرب n وn + 1 دائمًا'], 'even', 'odd', 'prime'], [['(2n + 1)² is always one more than a multiple of', '(2n + 1)² يزيد واحدًا على مضاعف'], '4', '3', '5']], x = r.pick(pool);
      var wd = { even: 'زوجي', odd: 'فردي', prime: 'أولي' }, opt = function (t) { return [t, wd[t] || TM.ltr(t)]; };
      if (x.length === 4 && x[3] != null) return { q: x[0], o: [opt(x[1]), opt(x[2]), opt(x[3])], s: [['Use letters for the general case', 'استخدم الحروف للحالة العامة', [x[1], wd[x[1]] || x[1]]]] };
      return { q: x[0], o: [opt(x[1]), opt(x[2]), opt('6')], s: [['Expand and look for the common factor', 'افتح وابحث عن العامل المشترك', [x[1], x[1]]]] };
    },
    trap: function (r) { return { w: 1, q: ['Proving the sum of two evens is even. One line is wrong. Tap it.', 'إثبات أن مجموع زوجيين زوجي. سطر واحد خاطئ. انقر عليه.'], why: ['A check of 2 + 4 is an example, not a proof.', 'فحص ٢ + ٤ مثال لا برهان.'], l: [['Let the evens be 2a and 2b', 'ليكونا 2a و2b'], ['2 + 4 = 6, so it is always true', '٢ + ٤ = ٦، فهو صحيح دائمًا'], ['2a + 2b = 2(a + b)', '2a + 2b = 2(a + b)']] }; },
    explain: [['Is it enough to test 1000 examples by computer?', 'هل يكفي فحص ١٠٠٠ مثال بالحاسوب؟'], ['No. Some claims first fail at huge numbers.', 'لا. بعض الادعاءات تفشل أول مرة عند أعداد ضخمة.'], ['Yes, 1000 is plenty.', 'نعم ١٠٠٠ كثير.'], ['Yes, computers do not err.', 'نعم الحواسيب لا تخطئ.']]
  });

  teach('x10m.matrix', {
    why: ['Every image on a screen, every search engine and every AI rests on matrices.', 'كل صورة على الشاشة وكل محرك بحث وكل ذكاء اصطناعي يقوم على المصفوفات.'],
    idea: [['A matrix is a block of numbers. Add matching entries. Multiply a row by a column.', 'المصفوفة كتلة أعداد. اجمع المتناظرة، واضرب الصف في العمود.'], ['(1 2 ; 3 4) × (5 ; 6): first row 1 × 5 + 2 × 6 = 17, second row 3 × 5 + 4 × 6 = 39.', '(1 2 ; 3 4) × (5 ; 6): الصف الأول 1 × 5 + 2 × 6 = 17 والثاني 3 × 5 + 4 × 6 = 39.']],
    g: function (r, lv) {
      var a = r.int(1, 6), b = r.int(1, 6), c = r.int(1, 6), d = r.int(1, 6), e = r.int(1, 6), f = r.int(1, 6), M = '(' + a + ' ' + b + ' ; ' + c + ' ' + d + ')';
      if (lv === 1) return { q: ['Add the matrices. What is the top left entry?', 'اجمع المصفوفتين. ما العنصر الأعلى الأيسر؟'], eq: M + ' + (' + e + ' ' + f + ' ; 1 2)', a: a + e, s: [['Matching entries add', 'تُجمع المتناظرة', a + ' + ' + e + ' =', a + e]], miss: [[a * e, 'Add for addition. Multiplying comes differently.', 'اجمع هنا. الضرب مختلف.']] };
      if (lv === 2) return { q: ['Multiply. What is the top entry?', 'اضرب. ما العنصر العلوي؟'], eq: M + ' × (' + e + ' ; ' + f + ')', a: a * e + b * f, s: [['First row with the column', 'الصف الأول مع العمود', a + ' × ' + e + ' + ' + b + ' × ' + f + ' =', a * e + b * f]], miss: [[a * e, 'Include the second pair too.', 'أضف الزوج الثاني أيضًا.']] };
      var det = a * d - b * c;
      return { q: ['Find the determinant ad − bc.', 'أوجد المحدد ad − bc.'], eq: M, a: det, s: [['Main diagonal', 'القطر الرئيسي', a + ' × ' + d + ' =', a * d], ['Other diagonal', 'القطر الآخر', b + ' × ' + c + ' =', b * c], ['Take away', 'اطرح', (a * d) + ' − ' + (b * c) + ' =', mn(det)]], miss: [[a * d + b * c, 'Take away, do not add.', 'اطرح ولا تجمع.']] };
    },
    trap: function (r) { return { eq: '(1 2 ; 3 4) × (5 ; 6)', w: 1, why: ['A row times a column: 3 × 5 + 4 × 6 = 39.', 'صف في عمود: 3 × 5 + 4 × 6 = 39.'], l: ['1 × 5 + 2 × 6 = 17', ['Second row: 3 × 5 = 15', 'الصف الثاني: 3 × 5 = 15'], ['So the answer is (17 ; 15)', 'فالناتج (17 ; 15)']] }; },
    explain: [['Is A × B always the same as B × A for matrices?', 'هل A × B هي B × A دائمًا في المصفوفات؟'], ['No. Unlike numbers, order matters.', 'لا. بخلاف الأعداد، الترتيب يهم.'], ['Yes, always.', 'نعم دائمًا.'], ['Only for large ones.', 'في الكبيرة فقط.']]
  });

  teach('x10m.corr', {
    why: ['A line of best fit lets you estimate, but only with care. Stretching it too far is a classic error.', 'خط أفضل ملاءمة يتيح التقدير بحذر، وتمديده كثيرًا خطأ شهير.'],
    idea: [{ p: ['Draw a line through the middle of the dots, with about as many above as below. Use it to read off values.', 'ارسم خطًا عبر وسط النقاط بقدر متساوٍ فوقه وتحته، واقرأ منه القيم.'], dia: function () { return D.axes({ x: [0, 10], y: [0, 10], every: 2, line: [[0, 1], [10, 9]], pts: [[1, 2], [2, 2], [3, 4], [4, 4], [6, 6], [7, 6], [9, 8]] }); } }, ['Between the data: interpolation, fairly reliable. Beyond it: extrapolation, risky.', 'داخل البيانات: استكمال موثوق نسبيًا. وخارجها: استقراء محفوف بالمخاطر.']],
    g: function (r, lv) {
      var m = r.pick([2, 3, 4, 5]), c = r.int(1, 10), x = r.int(2, 9);
      if (lv === 1) return { q: ['The line of best fit is y = ' + m + 'x + ' + c + '. Estimate y at x = ' + x + '.', 'خط أفضل ملاءمة y = ' + m + 'x + ' + c + '. قدّر y عند x = ' + x + '.'], eq: m + ' × ' + x + ' + ' + c, a: m * x + c, s: [['Put x in', 'عوّض x', m + ' × ' + x + ' + ' + c + ' =', m * x + c]] };
      var y = m * x + c;
      if (lv === 2) return { q: ['The line of best fit is y = ' + m + 'x + ' + c + '. What x gives y = ' + y + '?', 'خط أفضل ملاءمة y = ' + m + 'x + ' + c + '. أي x يعطي y = ' + y + '؟'], eq: '(' + y + ' − ' + c + ') ÷ ' + m, a: x, s: [['Take off ' + c, 'اطرح ' + c, y + ' − ' + c + ' =', y - c], ['Divide by ' + m, 'اقسم على ' + m, (y - c) + ' ÷ ' + m + ' =', x]] };
      var h1 = r.pick([220, 230, 240, 250]), h2 = r.pick([155, 160, 165]), h3 = r.pick([170, 175]); return { q: ['Data covers heights from 150 to 180 cm. Which estimate is least reliable?', 'تغطي البيانات الأطوال من ١٥٠ إلى ١٨٠ سم. أي تقدير أقل موثوقية؟'], o: [['For a height of ' + h1 + ' cm, beyond the data.', 'لطول ' + h1 + ' سم، خارج البيانات.'], ['For a height of ' + h3 + ' cm.', 'لطول ' + h3 + ' سم.'], ['For a height of ' + h2 + ' cm.', 'لطول ' + h2 + ' سم.']], s: [['Inside the data is safer', 'داخل البيانات أكثر أمانًا', ['Beyond it, the trend may change', 'خارجها قد يتغير الاتجاه']]] };
    },
    trap: function (r) { return { w: 1, q: ['Reading a line of best fit. One line is poor reasoning. Tap it.', 'قراءة خط أفضل ملاءمة. سطر واحد استدلال ضعيف. انقر عليه.'], why: ['A trend cannot be trusted far beyond the data: growth stops at adulthood.', 'لا يوثق بالاتجاه بعيدًا عن البيانات: يتوقف النمو عند البلوغ.'], l: [['Age 6 to 12 data: read age 9', 'بيانات ٦ إلى ١٢: اقرأ عمر ٩'], ['Extend the line to predict height at 40', 'مدّد الخط لتتوقع الطول عند ٤٠'], ['Check the dots lie close to the line', 'تحقق من قرب النقاط من الخط']] }; },
    explain: [['Why is extrapolation risky?', 'لماذا الاستقراء محفوف بالمخاطر؟'], ['There is no evidence that the trend continues beyond the data.', 'لا دليل على استمرار الاتجاه خارج البيانات.'], ['Lines get tired.', 'تتعب الخطوط.'], ['It is not risky.', 'ليس محفوفًا.']]
  });
})();
