/* Maths taught in full, Year 5. See lesson/teach.js for the shape of a topic. */
(function () {
  'use strict';
  var C = window.C, D = window.Dia, teach = C.teach, TM = C.TM, gcd = TM.gcd, low = TM.low, dp = TM.dp;

  /* ---------- large numbers and number facts ---------- */
  teach('m5.x10', {
    why: ['A price for one becomes a price for a hundred in a blink, if you can move digits in your head.', 'سعر القطعة يصبح سعر مئة قطعة في لحظة إذا عرفت كيف تحرّك الأرقام في ذهنك.'],
    idea: [['× 10 moves every digit one place to the left. × 100 moves it two places, × 1000 three.', '× ١٠ تحرّك كل رقم منزلة واحدة إلى اليسار، و× ١٠٠ منزلتين، و× ١٠٠٠ ثلاث منازل.'], ['Zero holds the empty places. The digits do not change, only their value.', 'الصفر يملأ المنازل الفارغة. الأرقام لا تتغير، وإنما تتغير قيمتها.']],
    g: function (r, lv) {
      var n = lv === 1 ? r.int(2, 99) : r.int(101, 9999), f = r.pick(lv === 1 ? [10, 100] : [10, 100, 1000]), z = String(f).length - 1, ans = n * f;
      var q = lv === 3 ? ['One box holds ' + n + ' dates. How many dates in ' + f + ' boxes?', 'في العلبة ' + n + ' تمرة. كم تمرة في ' + f + ' علبة؟'] : ['Multiply.', 'اضرب.'];
      return { q: q, eq: n + ' × ' + f, a: ans, s: [['Each digit moves ' + z + (z > 1 ? ' places' : ' place') + ' left', 'يتحرك كل رقم ' + z + ' منزلة إلى اليسار', n + ' × ' + f + ' =', ans]], miss: [[n * f / 10, 'One zero short. × ' + f + ' moves the digits ' + z + ' places.', 'ينقصك صفر. × ' + f + ' تحرّك الأرقام ' + z + ' منازل.'], [n * f * 10, 'One zero too many. Count the zeros in ' + f + '.', 'صفر زائد. عُدّ الأصفار في ' + f + '.']] };
    },
    trap: function (r) { var n = r.int(12, 99); return { w: 1, why: ['× 100 adds two zeros, so it is ' + (n * 100) + ', not ' + (n * 10) + '.', '× ١٠٠ تضيف صفرين، فالناتج ' + (n * 100) + ' لا ' + (n * 10) + '.'], l: [n + ' × 10 = ' + (n * 10), n + ' × 100 = ' + (n * 10), n + ' × 1000 = ' + (n * 1000)] }; },
    explain: [['What really happens to 34 when you multiply by 10?', 'ماذا يحدث فعلًا لـ ٣٤ عند الضرب في ١٠؟'], ['Each digit moves one place, so it is worth ten times more.', 'يتحرك كل رقم منزلة فتصبح قيمته عشرة أضعاف.'], ['A zero is stuck on the end for no reason.', 'يُلصق صفر في النهاية دون سبب.'], ['The digits become bigger digits.', 'تصبح الأرقام أرقامًا أكبر.']]
  });

  teach('m5.d10', {
    why: ['Sharing a big sum equally among ten or a hundred is a matter of moving digits back.', 'تقسيم مبلغ كبير بالتساوي على عشرة أو مئة هو تحريك الأرقام إلى الخلف.'],
    idea: [['÷ 10 moves each digit one place to the right. ÷ 100 moves it two places.', '÷ ١٠ تحرّك كل رقم منزلة إلى اليمين، و÷ ١٠٠ منزلتين.'], ['If a digit crosses the point, the answer has a decimal: 45 ÷ 10 = 4.5.', 'إذا عبر الرقم الفاصلة ظهر في الناتج كسر عشري: ٤٥ ÷ ١٠ = ٤٫٥.']],
    g: function (r, lv) {
      var f = r.pick(lv === 1 ? [10] : [10, 100]), base = lv === 1 ? r.int(3, 99) * 10 : lv === 2 ? r.int(11, 999) * f : r.int(11, 999), ans = dp(base / f);
      var q = lv === 3 ? ['A rope of ' + base + ' cm is cut into ' + f + ' equal pieces. How long is each piece, in cm?', 'حبل طوله ' + base + ' سم قُطع إلى ' + f + ' قطعة متساوية. كم طول القطعة بالسنتيمتر؟'] : ['Divide.', 'اقسم.'];
      return { q: q, eq: base + ' ÷ ' + f, a: ans, s: [['Move each digit ' + (f === 10 ? 'one place' : 'two places') + ' right', 'حرّك كل رقم ' + (f === 10 ? 'منزلة' : 'منزلتين') + ' إلى اليمين', base + ' ÷ ' + f + ' =', ans]], miss: [[base * f, 'You multiplied. Dividing makes the number smaller.', 'ضربت. القسمة تجعل العدد أصغر.'], [dp(base / (f * 10)), 'One place too far. ' + f + ' has ' + (f === 10 ? 'one zero' : 'two zeros') + '.', 'زدت منزلة. في ' + f + (f === 10 ? ' صفر واحد.' : ' صفران.')]] };
    },
    trap: function (r) { var n = r.int(21, 99) * 10; return { w: 1, why: [n + ' ÷ 100 is ' + dp(n / 100) + '. Two places, not one.', n + ' ÷ ١٠٠ تساوي ' + dp(n / 100) + '. منزلتان لا منزلة.'], l: [n + ' ÷ 10 = ' + (n / 10), n + ' ÷ 100 = ' + (n / 10), n + ' ÷ 1 = ' + n] }; },
    explain: [['Why is 45 ÷ 10 not 4 with something thrown away?', 'لماذا لا يكون ٤٥ ÷ ١٠ هو ٤ مع إهمال الباقي؟'], ['The 5 moves past the point and is worth five tenths: 4.5.', 'يعبر الرقم ٥ الفاصلة فتصبح قيمته خمسة أعشار: ٤٫٥.'], ['Division always gives whole numbers.', 'القسمة تعطي دائمًا أعدادًا صحيحة.'], ['The 5 disappears when divided.', 'يختفي الرقم ٥ عند القسمة.']]
  });

  teach('m5.mul22', {
    why: ['Tiles on a floor, seats in a hall, money over many months: real multiplying rarely stays in the times tables.', 'بلاط الأرض ومقاعد القاعة والمال عبر الشهور: الضرب الحقيقي نادرًا ما يبقى داخل جدول الضرب.'],
    idea: [
      { p: ['Split each number into tens and ones. Multiply every part by every part. Add the four answers.', 'جزّئ كل عدد إلى عشرات وآحاد. اضرب كل جزء في كل جزء. ثم اجمع النواتج الأربعة.'], dia: function () { return D.box(['20', '3'], ['10', '4'], [['200', '30'], ['80', '12']]); } },
      ['The boxes show why it works: 23 × 14 is the area of one big rectangle, cut into four easy pieces.', 'تبيّن المربعات السبب: ٢٣ × ١٤ هي مساحة مستطيل كبير مقسوم إلى أربع قطع سهلة.']
    ],
    g: function (r, lv) {
      var a = lv === 1 ? r.int(2, 4) * 10 + r.int(1, 4) : r.int(2, 9) * 10 + r.int(1, 9), b = lv === 1 ? 10 + r.int(1, 4) : r.int(1, 6) * 10 + r.int(2, 9);
      var a1 = a - a % 10, a0 = a % 10, b1 = b - b % 10, b0 = b % 10, ans = a * b;
      var q = lv === 3 ? ['A hall has ' + a + ' rows of ' + b + ' seats. How many seats?', 'في القاعة ' + a + ' صفًا في كل صف ' + b + ' مقعدًا. كم مقعدًا؟'] : ['Multiply. Use the boxes.', 'اضرب. استعن بالمربعات.'];
      return {
        q: q, eq: a + ' × ' + b, a: ans, dia: lv < 3 ? D.box([String(a1), String(a0)], [String(b1), String(b0)]) : undefined,
        s: [['Tens × tens', 'عشرات × عشرات', a1 + ' × ' + b1 + ' =', a1 * b1], ['Tens × ones', 'عشرات × آحاد', a1 + ' × ' + b0 + ' =', a1 * b0], ['Ones × tens', 'آحاد × عشرات', a0 + ' × ' + b1 + ' =', a0 * b1], ['Ones × ones', 'آحاد × آحاد', a0 + ' × ' + b0 + ' =', a0 * b0], ['Add all four', 'اجمع الأربعة', (a1 * b1) + ' + ' + (a1 * b0) + ' + ' + (a0 * b1) + ' + ' + (a0 * b0) + ' =', ans]],
        miss: [[a1 * b1 + a0 * b0, 'You did tens × tens and ones × ones, but missed the two middle pieces.', 'ضربت العشرات في العشرات والآحاد في الآحاد، لكن فاتتك القطعتان الوسطيان.'], [a * b1, 'You multiplied by the tens only. The ones still need multiplying too.', 'ضربت في العشرات فقط. والآحاد تحتاج إلى ضرب أيضًا.'], [a * b0, 'You multiplied by the ones only. The tens still need multiplying too.', 'ضربت في الآحاد فقط. والعشرات تحتاج إلى ضرب أيضًا.']]
      };
    },
    trap: function (r) {
      var a = r.int(2, 6) * 10 + r.int(2, 9), b = r.int(1, 4) * 10 + r.int(2, 9), a1 = a - a % 10, a0 = a % 10, b1 = b - b % 10, b0 = b % 10, badv = a0 * b1 / 10;
      return { eq: a + ' × ' + b, w: 2, why: [a0 + ' × ' + b1 + ' is ' + (a0 * b1) + ', not ' + badv + '. The tens must stay tens.', a0 + ' × ' + b1 + ' تساوي ' + (a0 * b1) + ' لا ' + badv + '. العشرات تبقى عشرات.'], l: [a1 + ' × ' + b1 + ' = ' + (a1 * b1), a1 + ' × ' + b0 + ' = ' + (a1 * b0), a0 + ' × ' + b1 + ' = ' + badv, a0 + ' × ' + b0 + ' = ' + (a0 * b0), (a1 * b1) + ' + ' + (a1 * b0) + ' + ' + badv + ' + ' + (a0 * b0) + ' = ' + (a1 * b1 + a1 * b0 + badv + a0 * b0)] };
    },
    explain: [['Why are there four pieces, not two?', 'لماذا أربع قطع لا قطعتان؟'], ['Each part of the first number must multiply each part of the second.', 'كل جزء من العدد الأول يُضرب في كل جزء من الثاني.'], ['Because every sum has four steps.', 'لأن لكل عملية أربع خطوات.'], ['Because 4 is a square number.', 'لأن ٤ عدد مربع.']]
  });

  teach('m5.long', {
    why: ['Sharing 936 dates among 4 families is not in any times table. Long division does it one digit at a time.', 'تقسيم ٩٣٦ تمرة على ٤ أسر ليس في جدول الضرب. القسمة الطويلة تنجزها رقمًا رقمًا.'],
    idea: [['Share the biggest place first. Whatever is left over is carried down to the next place.', 'اقسم المنزلة الكبرى أولًا. وما يتبقى يُنقل إلى المنزلة التالية.'], ['Divide, multiply, take away, bring down. Then again.', 'اقسم، ثم اضرب، ثم اطرح، ثم أنزل الرقم التالي. ثم أعد.']],
    g: function (r, lv) {
      var d = lv === 1 ? r.int(2, 5) : r.int(3, 9), ans = lv === 1 ? r.int(11, 39) : r.int(112, 299), n = d * ans, ds = String(n).split('').map(Number), s = [], rem = 0, first = true;
      ds.forEach(function (x) { var cur = rem * 10 + x, qq = Math.floor(cur / d); if (cur >= d || !first) { s.push(['How many ' + d + 's in ' + cur + '?', 'كم ' + d + ' في ' + cur + '؟', cur + ' ÷ ' + d + ' =', qq, rem * 10 + x - qq * d ? 'r ' + (cur - qq * d) : '']); first = false; } rem = cur % d; });
      s = s.map(function (l) { return l[4] ? [l[0], l[1], l[2] + ' ' + l[3] + ' ' + l[4]] : l; });
      s.push(['Read the digits in order', 'اقرأ الأرقام بالترتيب', n + ' ÷ ' + d + ' =', ans]);
      var q = lv === 3 ? [n + ' dates are shared equally among ' + d + ' families. How many for each?', 'تُقسم ' + n + ' تمرة بالتساوي على ' + d + ' أسر. كم لكل أسرة؟'] : ['Divide.', 'اقسم.'];
      return { q: q, eq: n + ' ÷ ' + d, a: ans, s: s, miss: [[n - d, 'You took away. Division asks how many ' + d + 's fit.', 'طرحت. القسمة تسأل كم ' + d + ' تدخل.'], [n * d, 'You multiplied. The answer must be smaller than ' + n + '.', 'ضربت. يجب أن يكون الناتج أصغر من ' + n + '.']] };
    },
    trap: function (r) { var d = r.pick([3, 4, 6]), a = r.int(12, 19) * 10 + r.int(1, 9), n = d * a; return { eq: n + ' ÷ ' + d, w: 1, why: ['Check by multiplying back: ' + (a + 10) + ' × ' + d + ' is not ' + n + '.', 'تحقق بالضرب: ' + (a + 10) + ' × ' + d + ' لا تساوي ' + n + '.'], l: [a + ' × ' + d + ' = ' + n, (a + 10) + ' × ' + d + ' = ' + n, (a + 10) + ' + ' + d + ' = ' + (a + 10 + d)] }; },
    explain: [['How can you check any division answer?', 'كيف تتحقق من ناتج أي قسمة؟'], ['Multiply the answer by the divisor. You should get back the number you started with.', 'اضرب الناتج في المقسوم عليه، فيجب أن تعود إلى العدد الأصلي.'], ['Do the same division again.', 'أعد القسمة نفسها.'], ['See whether the answer looks big enough.', 'انظر هل يبدو الناتج كبيرًا بما يكفي.']]
  });

  teach('m5.fact', {
    why: ['Factors tell you every way to arrange things in equal rows, and they make fractions simple later.', 'العوامل تخبرك بكل طريقة لترتيب الأشياء في صفوف متساوية، وتبسّط الكسور لاحقًا.'],
    idea: [{ p: ['A factor divides a number exactly. Factors come in pairs that multiply to the number.', 'العامل يقسم العدد قسمة تامة. وتأتي العوامل أزواجًا حاصل ضربها العدد نفسه.'], dia: function () { return D.grid(3, 4, 12); } }, ['12 can be 1 × 12, 2 × 6 or 3 × 4. So its factors are 1, 2, 3, 4, 6, 12.', '١٢ هي ١ × ١٢ أو ٢ × ٦ أو ٣ × ٤، فعواملها ١ و٢ و٣ و٤ و٦ و١٢.']],
    g: function (r, lv) {
      var n = r.pick(lv === 1 ? [12, 16, 18, 20, 24] : [28, 30, 36, 40, 42, 45, 48, 54, 60, 72]), fs = []; for (var i = 1; i <= n; i++) if (n % i === 0) fs.push(i);
      if (lv === 3) { var pr = fs.filter(function (x) { return x * x <= n; }); return { q: ['How many factors does ' + n + ' have?', 'كم عاملًا للعدد ' + n + '؟'], a: fs.length, s: pr.map(function (x) { return ['Pair', 'زوج', x + ' × ' + (n / x) + ' =', n]; }).concat([['Count every factor', 'عُدّ كل العوامل', fs.join(', ')], ['How many', 'كم العدد', 'Factors:', fs.length]]), miss: [[fs.length - 2, 'Do not forget 1 and ' + n + ' itself.', 'لا تنس ١ و' + n + ' نفسه.']] }; }
      var f = r.pick(fs.filter(function (x) { return x > 1 && x < n; })), other = n / f;
      return { q: ['Fill in the pair: ' + f + ' × ? = ' + n, 'أكمل الزوج: ' + f + ' × ؟ = ' + n], eq: f + ' × ? = ' + n, a: other, s: [['Divide to find the partner', 'اقسم لتجد الشريك', n + ' ÷ ' + f + ' =', other]] };
    },
    trap: function (r) { var n = r.pick([12, 18, 20, 24]); return { w: 1, q: ['One line is not a factor pair of ' + n + '. Tap it.', 'سطر واحد ليس زوج عوامل للعدد ' + n + '. انقر عليه.'], why: ['Those two do not multiply to ' + n + '.', 'حاصل ضرب هذين لا يساوي ' + n + '.'], l: ['1 × ' + n + ' = ' + n, '5 × 3 = ' + n, '2 × ' + (n / 2) + ' = ' + n] }; },
    explain: [['Why do factors come in pairs?', 'لماذا تأتي العوامل أزواجًا؟'], ['Each factor multiplies with another to make the number.', 'كل عامل يُضرب في آخر ليعطي العدد.'], ['Because numbers are even.', 'لأن الأعداد زوجية.'], ['Because we check them twice.', 'لأننا نتحقق منها مرتين.']]
  });

  teach('m5.mult', {
    why: ['When two buses run on different timetables, multiples tell you when they meet again.', 'حين تسير حافلتان بمواعيد مختلفة، تخبرك المضاعفات متى تلتقيان مجددًا.'],
    idea: [{ p: ['Multiples are the answers in a times table. They go on forever.', 'المضاعفات هي نواتج جدول الضرب، ولا تنتهي أبدًا.'], dia: function () { return D.line({ min: 0, max: 24, step: 1, every: 4, hops: [[0, 4], [4, 8], [8, 12], [12, 16], [16, 20], [20, 24]] }); } }, ['A number is a multiple of 4 if 4 divides it exactly.', 'يكون العدد من مضاعفات ٤ إذا قسمه ٤ قسمة تامة.']],
    g: function (r, lv) {
      var a = lv === 1 ? r.int(3, 9) : r.int(6, 15), k = lv === 1 ? r.int(3, 8) : r.int(7, 15);
      if (lv === 3) { var x = r.pick([2, 3, 4, 5, 6]), y = r.pick([3, 4, 6, 8, 9, 10].filter(function (v) { return v > x; })), l = TM.lcm(x, y); return { q: ['One bell rings every ' + x + ' minutes, another every ' + y + '. They ring together now. After how many minutes do they ring together again?', 'يدق جرس كل ' + x + ' دقائق وآخر كل ' + y + ' دقائق. دقّا معًا الآن. بعد كم دقيقة يدقان معًا مرة أخرى؟'], a: l, s: [['Multiples of ' + x, 'مضاعفات ' + x, [1, 2, 3, 4].map(function (m) { return x * m; }).join(', ') + ' ...'], ['Multiples of ' + y, 'مضاعفات ' + y, [1, 2, 3, 4].map(function (m) { return y * m; }).join(', ') + ' ...'], ['First in both lists', 'الأول في القائمتين', 'First match:', l]], miss: [[x * y === l ? -1 : x * y, 'That works, but they meet sooner. Look for the first match.', 'هذا صحيح لكنهما يلتقيان أبكر. ابحث عن أول تطابق.']] }; }
      return { q: ['The ' + k + 'th multiple of ' + a + '?', 'ما المضاعف رقم ' + k + ' للعدد ' + a + '؟'], eq: a + ' × ' + k, a: a * k, s: [['Multiply', 'اضرب', a + ' × ' + k + ' =', a * k]], miss: [[a + k, 'You added. Multiples come from multiplying.', 'جمعت. المضاعفات تأتي من الضرب.']] };
    },
    trap: function (r) { var a = r.pick([3, 4, 6, 7]); return { w: 2, q: ['One line in this table of ' + a + ' is wrong. Tap it.', 'سطر واحد في جدول ' + a + ' خاطئ. انقر عليه.'], why: [a + ' × 3 is ' + (a * 3) + '.', a + ' × ٣ تساوي ' + (a * 3) + '.'], l: [a + ' × 1 = ' + a, a + ' × 2 = ' + (a * 2), a + ' × 3 = ' + (a * 3 + 1), a + ' × 4 = ' + (a * 4)] }; },
    explain: [['Which is true of multiples?', 'أيّ هذه صحيح عن المضاعفات؟'], ['Every number has endless multiples.', 'لكل عدد مضاعفات لا تنتهي.'], ['Every number has exactly ten multiples.', 'لكل عدد عشرة مضاعفات فقط.'], ['Multiples are always smaller than the number.', 'المضاعفات دائمًا أصغر من العدد.']]
  });

  var isP = function (n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  var factorOf = function (n) { for (var i = 2; i * i <= n; i++) if (n % i === 0) return i; return n; };
  teach('m5.prime', {
    why: ['Primes are the atoms of number: every whole number is built from them, and they keep messages safe online.', 'الأعداد الأولية ذرّات العدد: منها يُبنى كل عدد صحيح، وبها تُحمى الرسائل على الإنترنت.'],
    idea: [['A prime has exactly two factors: 1 and itself. 7 is prime. 9 is not, because 3 × 3 = 9.', 'العدد الأولي له عاملان فقط: ١ والعدد نفسه. ٧ أولي، و٩ ليس أوليًا لأن ٣ × ٣ = ٩.'], ['1 is not prime: it has only one factor. 2 is the only even prime.', 'العدد ١ ليس أوليًا فله عامل واحد. و٢ هو العدد الأولي الزوجي الوحيد.']],
    g: function (r, lv) {
      var pool = lv === 1 ? [2, 3, 5, 7, 11, 13] : [17, 19, 23, 29, 31, 37, 41, 43, 47, 53], comp = lv === 1 ? [4, 6, 8, 9, 10, 12, 15] : [21, 27, 33, 39, 49, 51, 57, 63, 87, 91], p = r.pick(pool), w = TM.pick3(r, p, comp);
      if (lv === 3) { var c = r.pick(comp), f = factorOf(c); return { q: [c + ' looks prime but is not. What is its smallest factor above 1?', 'يبدو ' + c + ' أوليًا لكنه ليس كذلك. ما أصغر عامل له أكبر من ١؟'], a: f, s: [['Try small primes in turn', 'جرّب الأعداد الأولية الصغيرة', c + ' ÷ ' + f + ' =', c / f], ['So the smallest factor is', 'فأصغر عامل هو', 'Factor:', f]], miss: [[1, 'Every number has 1 as a factor. Look above 1.', 'لكل عدد العامل ١. ابحث فوق ١.']] }; }
      return { q: ['Which is prime?', 'أيّها أولي؟'], o: [[String(p), String(p)]].concat(w.map(function (x) { return [String(x), String(x), x + ' = ' + factorOf(x) + ' × ' + (x / factorOf(x)) + ', so it has more factors.', x + ' = ' + factorOf(x) + ' × ' + (x / factorOf(x)) + ' فله عوامل أخرى.']; })), s: [['Only 1 and itself divide a prime', 'لا يقسم العدد الأولي إلا ١ وهو', p + ' × 1 =', p]] };
    },
    trap: function (r) { var c = r.pick([9, 15, 21, 27]); return { w: 2, q: ['A student listed primes. One is wrong. Tap it.', 'كتب طالب أعدادًا أولية. واحد منها خطأ. انقر عليه.'], why: [c + ' = ' + factorOf(c) + ' × ' + (c / factorOf(c)) + ', so it is not prime.', c + ' = ' + factorOf(c) + ' × ' + (c / factorOf(c)) + ' فليس أوليًا.'], l: [['2 is prime', '٢ عدد أولي'], ['7 is prime', '٧ عدد أولي'], [c + ' is prime', c + ' عدد أولي'], ['13 is prime', '١٣ عدد أولي']] }; },
    explain: [['Why is 1 not a prime?', 'لماذا لا يكون ١ عددًا أوليًا؟'], ['A prime needs exactly two different factors. 1 has only one.', 'يحتاج العدد الأولي إلى عاملين مختلفين تمامًا، و١ له عامل واحد.'], ['Because 1 is too small to matter.', 'لأن ١ صغير جدًا فلا يهم.'], ['Because 1 is an odd number.', 'لأن ١ عدد فردي.']]
  });

  teach('m5.sq', {
    why: ['Floors, gardens and later all of geometry use squares of numbers.', 'الأرضيات والحدائق ثم الهندسة كلها تستخدم مربعات الأعداد.'],
    idea: [{ p: ['A square number is a number times itself. 5 × 5 = 25, and 25 dots make a perfect square.', 'العدد المربع هو عدد مضروب في نفسه. ٥ × ٥ = ٢٥، و٢٥ نقطة تصنع مربعًا تامًا.'], dia: function () { return D.grid(5, 5, 25); } }, ['We write 5² for 5 × 5. The small 2 means two fives multiplied, not five times two.', 'نكتب ٥² بمعنى ٥ × ٥. الرقم الصغير ٢ يعني ضرب خمستين، لا خمسة في اثنين.']],
    g: function (r, lv) {
      var n = lv === 1 ? r.int(2, 10) : r.int(8, 15);
      if (lv === 3) return { q: ['A square garden has an area of ' + (n * n) + ' square metres. How long is one side, in metres?', 'مساحة حديقة مربعة ' + (n * n) + ' مترًا مربعًا. كم طول ضلعها بالمتر؟'], eq: '? × ? = ' + (n * n), dia: D.rect('?', '?', 5, 5), a: n, s: [['Which number times itself?', 'أي عدد مضروب في نفسه؟', n + ' × ' + n + ' =', n * n], ['So one side is', 'فطول الضلع', 'Side:', n]], miss: [[n * n / 2, 'You halved it. A side times itself must make the area.', 'قسمت على ٢. الضلع مضروبًا في نفسه يعطي المساحة.'], [n * n / 4, 'That divides by 4, which is for the perimeter, not the area.', 'هذه قسمة على ٤، وهي للمحيط لا للمساحة.']] };
      return { q: ['Work out the square.', 'احسب المربع.'], eq: n + '²', a: n * n, s: [['A number times itself', 'عدد في نفسه', n + ' × ' + n + ' =', n * n]], miss: [[n * 2, n + '² is ' + n + ' × ' + n + ', not ' + n + ' × 2.', n + '² تعني ' + n + ' × ' + n + ' لا ' + n + ' × ٢.']] };
    },
    trap: function (r) { var n = r.int(6, 12); return { w: 1, why: [n + '² means ' + n + ' × ' + n + ', not ' + n + ' × 2.', n + '² تعني ' + n + ' × ' + n + ' لا ' + n + ' × ٢.'], l: ['3² = 9', n + '² = ' + (n * 2), '2² = 4'] }; },
    explain: [['Why is 2² the same as 2 × 2, but 3² is not 3 × 2?', 'لماذا ٢² تساوي ٢ × ٢، أما ٣² فلا تساوي ٣ × ٢؟'], ['Squaring multiplies a number by itself. Only for 2 does that match doubling.', 'التربيع ضرب العدد في نفسه، ولا يطابق المضاعفة إلا عند ٢.'], ['Because 3 is odd.', 'لأن ٣ عدد فردي.'], ['They are the same, both are doubling.', 'هما متساويان، فكلاهما مضاعفة.']]
  });

  /* ---------- fractions, decimals, percent ---------- */
  teach('m.fname', {
    why: ['A quarter of an hour, half a kilo, three quarters of the Qurʾān revised: fractions are how we talk about parts.', 'ربع ساعة ونصف كيلو وثلاثة أرباع المراجعة: بالكسور نتحدث عن الأجزاء.'],
    idea: [{ p: ['The bottom number says how many equal parts the whole is cut into. The top says how many we have.', 'المقام يخبرنا بعدد الأجزاء المتساوية، والبسط يخبرنا بعدد ما لدينا منها.'], dia: function () { return D.frac([[3, 4]]); } }, ['The parts must be equal. Three unequal slices are not thirds.', 'يجب أن تكون الأجزاء متساوية، فثلاث قطع غير متساوية ليست أثلاثًا.']],
    g: function (r, lv) {
      var d = r.pick(lv === 1 ? [2, 3, 4, 5] : [5, 6, 8, 10]), n = r.int(1, d - 1);
      if (lv === 3) { var u = r.pick([2, 3, 5]), w = d * u * r.int(1, 3); return { q: ['There are ' + w + ' dates. Eat ' + n + '/' + d + ' of them. How many dates is that?', 'لديك ' + w + ' تمرة. أكلت ' + n + '/' + d + ' منها. كم تمرة أكلت؟'], eq: n + '/' + d + ' × ' + w, a: w / d * n, dia: D.frac([[n, d]]), s: [['Find one part: divide by the bottom', 'أوجد الجزء الواحد: اقسم على المقام', w + ' ÷ ' + d + ' =', w / d], ['Take as many parts as the top says', 'خذ من الأجزاء بعدد البسط', (w / d) + ' × ' + n + ' =', w / d * n]], miss: [[w / d, 'That is one part. The top number says you want ' + n + ' parts.', 'هذا جزء واحد. البسط يقول إنك تريد ' + n + ' أجزاء.'], [w - n, 'You took away the top number. First cut into ' + d + ' equal parts.', 'طرحت البسط. قسّم أولًا إلى ' + d + ' أجزاء متساوية.']] }; }
      return { q: ['What fraction is shaded? Type it with the fraction bar.', 'ما الكسر المظلل؟ اكتبه بشرطة الكسر.'], dia: D.frac([[n, d]]), a: n + '/' + d, exact: true, s: [['Count all the equal parts: the bottom', 'عُدّ كل الأجزاء: المقام', 'Parts:', d], ['Count the shaded parts: the top', 'عُدّ المظلل: البسط', 'Shaded:', n], ['Write top over bottom', 'اكتب البسط فوق المقام', 'Fraction:', n + '/' + d]], miss: [[d + '/' + n, 'Upside down. The whole goes on the bottom.', 'مقلوب. الكل يوضع في المقام.']] };
    },
    trap: function (r) { var n = 12 * r.int(1, 4); return { eq: '3/4 × ' + n, w: 0, why: ['One quarter is ' + n + ' ÷ 4 = ' + (n / 4) + '.', 'الربع هو ' + n + ' ÷ ٤ = ' + (n / 4) + '.'], l: [n + ' ÷ 4 = ' + (n / 3), (n / 3) + ' × 3 = ' + n] }; },
    explain: [['Is a pizza cut into 4 uneven slices cut into quarters?', 'هل قُسمت فطيرة إلى أرباع إذا قُطعت ٤ قطع غير متساوية؟'], ['No. Quarters must all be the same size.', 'لا. يجب أن تتساوى الأرباع.'], ['Yes. There are 4 slices, so they are quarters.', 'نعم. هي ٤ قطع فهي أرباع.'], ['Yes, if you eat them all.', 'نعم، إذا أكلتها كلها.']]
  });

  teach('m.fcmp', {
    why: ['Is 2/3 of a tank more than 3/5? You will need this for cooking, sharing and money.', 'هل ثلثا الخزان أكثر من ٣/٥؟ ستحتاج إلى هذا في الطبخ والقسمة والمال.'],
    idea: [{ p: ['Same bottom: the bigger top wins. Same top: the smaller bottom wins, because its parts are bigger.', 'إذا تساوى المقامان فالبسط الأكبر أكبر. وإذا تساوى البسطان فالمقام الأصغر أكبر لأن أجزاءه أكبر.'], dia: function () { return D.frac([[1, 3], [1, 8]]); } }, ['So 1/3 is more than 1/8, even though 8 is more than 3.', 'فالثلث أكبر من ١/٨، مع أن ٨ أكبر من ٣.']],
    g: function (r, lv) {
      var a, b, c, d;
      if (lv === 1) { d = r.pick([5, 7, 8, 9]); a = r.int(1, d - 2); c = r.int(a + 1, d - 1); b = d; }
      else if (lv === 2) { a = c = r.int(1, 2); b = r.pick([3, 4, 5]); d = r.pick([6, 8, 9, 10]); var t = r.bool(); if (t) { var x = b; b = d; d = x; } if (b > d) { var y = b; b = d; d = y; } var sw = a; a = c; c = sw; d = d; var f1 = a + '/' + d, f2 = c + '/' + b; return { q: ['Which is bigger?', 'أيّهما أكبر؟'], dia: D.frac([[c, b], [a, d]]), o: [[f2, f2], [f1, f1, 'Same top, but eighths or tenths are smaller pieces.', 'البسط نفسه، لكن أجزاءه أصغر.'], ['They are equal', 'متساويان']], s: [['Same top: compare the size of the parts', 'البسط نفسه: قارن حجم الأجزاء', ['Smaller bottom, bigger parts', 'المقام الأصغر أجزاؤه أكبر']]] }; }
      else { b = r.pick([3, 4, 5]); d = r.pick([6, 7, 8].filter(function (x) { return x !== b && x % b; })); a = r.int(1, b - 1); c = r.int(1, d - 1); if (a * d === c * b) c = c === 1 ? 2 : c - 1; if (a * d === c * b) c = d - 1; var L = b * d, A = a * d, Cc = c * b, big = A > Cc ? a + '/' + b : c + '/' + d, sm = A > Cc ? c + '/' + d : a + '/' + b; return { q: ['Which is bigger? Compare over a common bottom.', 'أيّهما أكبر؟ وحّد المقام ثم قارن.'], o: [[big, big], [sm, sm, 'Over ' + L + ', it has fewer parts.', 'على المقام ' + L + ' له أجزاء أقل.'], ['They are equal', 'متساويان']], s: [['Same bottom for both', 'مقام واحد لهما', a + ' × ' + d + ' =', A], [null, null, c + ' × ' + b + ' =', Cc], ['Compare the tops', 'قارن البسطين', A + '/' + L + ' and ' + Cc + '/' + L]] }; }
      var big1 = c + '/' + b, sm1 = a + '/' + d;
      return { q: ['Which is bigger?', 'أيّهما أكبر؟'], dia: D.frac([[c, b], [a, d]]), o: [[big1, big1], [sm1, sm1, 'Same bottom, so the top decides.', 'المقام نفسه، فالبسط هو الفيصل.'], ['They are equal', 'متساويان']], s: [['Same bottom: more parts is more', 'المقام نفسه: الأجزاء الأكثر أكبر', c + ' > ' + a]] };
    },
    trap: function (r) { return { w: 1, q: ['One statement is wrong. Tap it.', 'جملة واحدة خاطئة. انقر عليها.'], why: ['1/8 is smaller than 1/4. Cutting into more pieces makes each piece smaller.', '١/٨ أصغر من ١/٤. كلما زادت القطع صغرت كل قطعة.'], l: ['1/2 > 1/3', '1/8 > 1/4', '3/5 > 2/5'] }; },
    explain: [['Why is 1/8 smaller than 1/4, although 8 is bigger than 4?', 'لماذا ١/٨ أصغر من ١/٤ مع أن ٨ أكبر من ٤؟'], ['The more pieces you cut, the smaller each piece.', 'كلما زادت القطع صغرت كل قطعة.'], ['Because bigger numbers are always smaller.', 'لأن الأعداد الكبيرة دائمًا أصغر.'], ['Because 4 is even.', 'لأن ٤ عدد زوجي.']]
  });

  teach('m.feq', {
    why: ['Half a cake and two quarters are the same cake. Spotting that makes every later fraction job easier.', 'نصف الكعكة وربعاها كعكة واحدة. ملاحظة ذلك تسهّل كل عمل لاحق في الكسور.'],
    idea: [{ p: ['Multiply top and bottom by the same number and the value stays the same. 3/4 = 6/8.', 'اضرب البسط والمقام في العدد نفسه تبق القيمة كما هي. ٣/٤ = ٦/٨.'], dia: function () { return D.frac([[3, 4], [6, 8]]); } }, ['Dividing top and bottom by the same number simplifies: 6/8 = 3/4.', 'وقسمة البسط والمقام على العدد نفسه تبسّط الكسر: ٦/٨ = ٣/٤.']],
    g: function (r, lv) {
      var d = r.pick([2, 3, 4, 5]), n = r.int(1, d - 1); while (gcd(n, d) > 1) n = r.int(1, d - 1); var k = r.int(2, lv === 1 ? 4 : 9);
      if (lv === 3) return { q: ['Simplify as far as you can.', 'بسّط قدر ما تستطيع.'], eq: (n * k) + '/' + (d * k), a: n + '/' + d, exact: true, s: [['Divide top and bottom by ' + k, 'اقسم البسط والمقام على ' + k, (n * k) + ' ÷ ' + k + ' =', n], [null, null, (d * k) + ' ÷ ' + k + ' =', d], ['Simplest form', 'أبسط صورة', 'Answer:', n + '/' + d]], miss: [[(n * k) + '/' + (d * k), 'That is the same fraction. Find a number that divides both.', 'هذا الكسر نفسه. ابحث عن عدد يقسمهما معًا.']] };
      return { q: ['Fill in the missing top.', 'أكمل البسط الناقص.'], eq: n + '/' + d + ' = ?/' + (d * k), dia: D.frac([[n, d], [n * k, d * k]]), a: n * k, s: [['What was the bottom multiplied by?', 'في كم ضُرب المقام؟', (d * k) + ' ÷ ' + d + ' =', k], ['Do the same to the top', 'افعل الشيء نفسه بالبسط', n + ' × ' + k + ' =', n * k]], miss: [[n + d * k - d, 'You added to the top. Fractions stay equal by multiplying, not adding.', 'جمعت على البسط. يبقى الكسر مساويًا بالضرب لا بالجمع.']] };
    },
    trap: function (r) { var k = r.int(2, 4); return { w: 1, eq: '2/3 = ?/' + (3 + k), q: ['Someone added instead of multiplying. Tap the wrong line.', 'جمع أحدهم بدل أن يضرب. انقر على السطر الخاطئ.'], why: ['Adding the same number to top and bottom changes the value. Multiply instead.', 'جمع عدد على البسط والمقام يغيّر القيمة. اضرب بدلًا منه.'], l: ['1/2 = 2/4', '2/3 = ' + (2 + k) + '/' + (3 + k), '1/4 = 2/8'] }; },
    explain: [['Why does multiplying top and bottom by 2 keep the value?', 'لماذا يحافظ الضرب في ٢ للبسط والمقام على القيمة؟'], ['You cut each part in two, so there are twice as many parts, half the size.', 'تقسم كل جزء نصفين فيتضاعف عدد الأجزاء ويصغر حجمها إلى النصف.'], ['Because 2 is a small number.', 'لأن ٢ عدد صغير.'], ['It does not, the fraction doubles.', 'لا يحافظ، بل يتضاعف الكسر.']]
  });

  teach('m.fadd', {
    why: ['A quarter of the day here and two quarters there: adding parts is daily life.', 'ربع اليوم هنا وربعان هناك: جمع الأجزاء من حياتنا اليومية.'],
    idea: [{ p: ['When the bottoms match, add the tops. The bottom stays, because the size of the part has not changed.', 'إذا تساوى المقامان اجمع البسطين. يبقى المقام لأن حجم الجزء لم يتغير.'], dia: function () { return D.frac([[3, 8], [5, 8]]); } }, ['1/8 + 3/8 is 4/8, never 4/16.', '١/٨ + ٣/٨ = ٤/٨، وليست ٤/١٦ أبدًا.']],
    g: function (r, lv) {
      var d = r.pick(lv === 1 ? [5, 7, 8] : [6, 8, 9, 10, 12]), a = r.int(1, d - 2), b = r.int(1, d - a - 1), sum = a + b;
      var q = lv === 3 ? ['You read ' + a + '/' + d + ' of a book on Monday and ' + b + '/' + d + ' on Tuesday. What fraction have you read? Give it in simplest form.', 'قرأت ' + a + '/' + d + ' من كتاب يوم الاثنين و' + b + '/' + d + ' يوم الثلاثاء. ما الكسر الذي قرأته؟ أعطه في أبسط صورة.'] : ['Add.', 'اجمع.'];
      var st = [['Same bottom: add the tops', 'المقام نفسه: اجمع البسطين', a + ' + ' + b + ' =', sum], ['The bottom stays', 'يبقى المقام', a + '/' + d + ' + ' + b + '/' + d + ' =', sum + '/' + d]], g0 = gcd(sum, d);
      if (lv === 3 && g0 > 1) st.push(['Simplify', 'بسّط', 'Simplest:', low(sum, d)]);
      return { q: q, eq: a + '/' + d + ' + ' + b + '/' + d, a: lv === 3 ? low(sum, d) : sum + '/' + d, s: st, miss: [[sum + '/' + (d * 2), 'You added the bottoms too. The bottom names the size of the part, and it has not changed.', 'جمعت المقامين أيضًا. المقام اسم الجزء ولم يتغير حجمه.']] };
    },
    trap: function (r) { var d = r.pick([5, 7, 9]); return { w: 1, eq: '1/' + d + ' + 2/' + d, why: ['Add the tops only: 3/' + d + '. The bottom stays ' + d + '.', 'اجمع البسطين فقط: ٣/' + d + '. يبقى المقام ' + d + '.'], l: ['1 + 2 = 3', 'Bottom: ' + d + ' + ' + d, 'Answer: 3/' + (d + d)] }; },
    explain: [['Why do the bottoms not get added?', 'لماذا لا يُجمع المقامان؟'], ['The bottom names the size of the parts. Adding parts does not resize them.', 'المقام اسم حجم الجزء، وجمع الأجزاء لا يغيّر حجمها.'], ['Because bottoms are too big to add.', 'لأن المقامات كبيرة على الجمع.'], ['Because only tops are real numbers.', 'لأن البسط وحده عدد حقيقي.']]
  });

  teach('m.zakah', { keep: true,
    g: function (r, lv) {
      var w = lv === 1 ? r.pick([200, 400, 800, 1000, 2000]) : r.int(3, 40) * 200, ten = w / 10, one = w / 100, ans = dp(w * 2.5 / 100);
      return { q: ['Find 2.5% of ' + w + '.', 'أوجد ٢٫٥٪ من ' + w + '.'], eq: '2.5% × ' + w, a: ans, s: [['Find 10% by dividing by 10', 'أوجد ١٠٪ بالقسمة على ١٠', w + ' ÷ 10 =', ten], ['Half of that is 5%', 'نصفها ٥٪', ten + ' ÷ 2 =', dp(ten / 2)], ['Half again is 2.5%', 'ونصفها ٢٫٥٪', dp(ten / 2) + ' ÷ 2 =', ans]], miss: [[dp(w * .25), 'That is 25%. 2.5% is ten times smaller.', 'هذه ٢٥٪. و٢٫٥٪ أصغر بعشر مرات.'], [dp(w * .025 * 2), 'That is 5%. Halve it once more.', 'هذه ٥٪. اقسمها على ٢ مرة أخرى.']] };
    },
    trap: function (r) { var w = r.int(2, 9) * 400; return { eq: '2.5% × ' + w, w: 1, why: ['Half of ' + (w / 10) + ' is ' + (w / 20) + '.', 'نصف ' + (w / 10) + ' هو ' + (w / 20) + '.'], l: [w + ' ÷ 10 = ' + (w / 10), (w / 10) + ' ÷ 2 = ' + (w / 10), (w / 10) + ' ÷ 2 = ' + (w / 20)] }; },
    explain: [['What is a quick way to find 2.5%?', 'ما الطريقة السريعة لإيجاد ٢٫٥٪؟'], ['Find 10%, halve it, then halve it again.', 'أوجد ١٠٪ ثم نصّفها ثم نصّفها مرة أخرى.'], ['Divide by 2.5.', 'اقسم على ٢٫٥.'], ['Add 2.5 to the amount.', 'أضف ٢٫٥ إلى المبلغ.']]
  });

  teach('m5.hund', {
    why: ['Money, measures and sports results all use tenths and hundredths.', 'المال والقياسات والنتائج الرياضية كلها تستخدم الأعشار والأجزاء من مئة.'],
    idea: [{ p: ['The first place after the point is tenths, the second is hundredths. 0.37 is 37 squares out of 100.', 'المنزلة الأولى بعد الفاصلة أعشار، والثانية أجزاء من مئة. ٠٫٣٧ تعني ٣٧ مربعًا من ١٠٠.'], dia: function () { return D.grid(10, 10, 37); } }, ['0.4 and 0.40 are equal: 4 tenths is 40 hundredths. So 0.4 is bigger than 0.37.', '٠٫٤ و٠٫٤٠ متساويان: ٤ أعشار تساوي ٤٠ جزءًا من مئة. لذلك ٠٫٤ أكبر من ٠٫٣٧.']],
    g: function (r, lv) {
      var n = r.int(11, 99); if (n % 10 === 0) n++;
      if (lv === 1) return { q: ['How many squares of 100 is this decimal? Type the decimal for the shaded part.', 'اكتب الكسر العشري للجزء المظلل من ١٠٠.'], dia: D.grid(10, 10, n), a: dp(n / 100), s: [['Count the shaded squares', 'عُدّ المربعات المظللة', 'Shaded:', n], ['Out of 100 means two places', 'من مئة تعني منزلتين', n + ' ÷ 100 =', dp(n / 100)]], miss: [[n, 'That is how many squares. Now write it as a part of 100.', 'هذا عدد المربعات. اكتبه الآن جزءًا من ١٠٠.']] };
      var t = r.int(1, 9), h = t * 10 - r.int(1, 8); if (h < 11) { h = 11; t = 2; } var a = dp(t / 10), b = dp(h / 100);
      if (lv === 3) return { q: ['Write ' + h + '/100 as a decimal.', 'اكتب ' + h + '/١٠٠ كسرًا عشريًا.'], eq: h + '/100', a: b, s: [['Two places for hundredths', 'منزلتان للأجزاء من مئة', h + ' ÷ 100 =', b]], miss: [[dp(h / 10), 'That is out of 10. Hundredths need two places.', 'هذا من ١٠. الأجزاء من مئة تحتاج إلى منزلتين.']] };
      return { q: ['Which is bigger?', 'أيّهما أكبر؟'], o: [[String(a), String(a)], [String(b), String(b), 'Write both with two places: ' + a.toFixed(2) + ' and ' + b.toFixed(2) + '. Longer does not mean bigger.', 'اكتبهما بمنزلتين: ' + a.toFixed(2) + ' و' + b.toFixed(2) + '. الأطول ليس الأكبر.'], ['They are equal', 'متساويان']], s: [['Write both with two places', 'اكتبهما بمنزلتين', a.toFixed(2) + ' and ' + b.toFixed(2)]] };
    },
    trap: function (r) { return { w: 1, q: ['One statement is wrong. Tap it.', 'جملة واحدة خاطئة. انقر عليها.'], why: ['0.5 is 0.50, which is bigger than 0.45. More digits does not mean bigger.', '٠٫٥ هي ٠٫٥٠ وهي أكبر من ٠٫٤٥. كثرة الأرقام لا تعني الأكبر.'], l: ['0.3 = 0.30', '0.45 > 0.5', '0.7 > 0.07'] }; },
    explain: [['Why is 0.5 bigger than 0.45?', 'لماذا ٠٫٥ أكبر من ٠٫٤٥؟'], ['5 tenths is 50 hundredths, and 50 is more than 45.', '٥ أعشار تساوي ٥٠ جزءًا من مئة، و٥٠ أكبر من ٤٥.'], ['Because 5 is bigger than 4 and that is all that counts.', 'لأن ٥ أكبر من ٤ وهذا كل شيء.'], ['It is not. 45 is bigger than 5.', 'ليس كذلك. ٤٥ أكبر من ٥.']]
  });

  teach('m5.addD', {
    why: ['Adding up a shopping receipt is adding decimals.', 'جمع فاتورة التسوق هو جمع كسور عشرية.'],
    idea: [['Line up the points, so tenths add to tenths. Fill empty places with zeros if it helps.', 'اجعل الفواصل على خط واحد لتُجمع الأعشار مع الأعشار. واملأ المنازل الفارغة بالأصفار إن احتجت.'], ['2.5 + 1.25 is 2.50 + 1.25 = 3.75, not 1.50.', '٢٫٥ + ١٫٢٥ هي ٢٫٥٠ + ١٫٢٥ = ٣٫٧٥ وليست ١٫٥٠.']],
    g: function (r, lv) {
      var a = lv === 1 ? r.int(11, 79) / 10 : r.int(101, 899) / 100, b = lv === 1 ? r.int(11, 79) / 10 : r.pick([r.int(11, 89) / 10, r.int(101, 899) / 100]), ans = dp(a + b, 2), pa = a.toFixed(2), pb = b.toFixed(2);
      var q = lv === 3 ? ['A book costs ' + a + ' dinars and a pen ' + b + '. What is the total?', 'كتاب بـ ' + a + ' دينار وقلم بـ ' + b + '. كم المجموع؟'] : ['Add.', 'اجمع.'];
      return { q: q, eq: a + ' + ' + b, a: ans, s: [['Line up the points', 'رتّب الفواصل', pa + ' + ' + pb], ['Add from the right', 'اجمع من اليمين', pa + ' + ' + pb + ' =', ans]], miss: [[dp(Math.round(a * 100) / 10 + b, 2), 'The points were not lined up.', 'لم تكن الفاصلتان على خط واحد.']] };
    },
    trap: function (r) { var a = r.int(1, 9) + .5, b = r.int(1, 8) + .25; return { eq: a + ' + ' + b, w: 1, why: ['Line up the points: ' + a.toFixed(2) + ' + ' + b.toFixed(2) + ' = ' + dp(a + b, 2) + '.', 'رتّب الفواصل: ' + a.toFixed(2) + ' + ' + b.toFixed(2) + ' = ' + dp(a + b, 2) + '.'], l: [a + ' = ' + a.toFixed(2), a + ' + ' + b + ' = ' + (Math.floor(a) + Math.floor(b) + .3), 'Answer: ' + (Math.floor(a) + Math.floor(b) + .3)] }; },
    explain: [['Why do the points have to line up?', 'لماذا يجب أن تتراصف الفواصل؟'], ['So each place adds to the same kind of place: tenths with tenths.', 'كي تُجمع كل منزلة مع مثيلتها: الأعشار مع الأعشار.'], ['So the page looks neat.', 'كي تبدو الصفحة مرتبة.'], ['Because the point is always in the middle.', 'لأن الفاصلة دائمًا في الوسط.']]
  });

  teach('m5.pct', {
    why: ['Discounts, exam scores and battery life all come in percent.', 'التخفيضات ودرجات الامتحان وشحن البطارية كلها بالنسبة المئوية.'],
    idea: [{ p: ['Percent means out of a hundred. 37% is 37 squares of 100.', 'النسبة المئوية تعني من مئة. ٣٧٪ تعني ٣٧ مربعًا من ١٠٠.'], dia: function () { return D.grid(10, 10, 37); } }, ['50% is half, 25% a quarter, 10% a tenth. Everything else can be built from these.', '٥٠٪ نصف، و٢٥٪ ربع، و١٠٪ عُشر. ويُبنى الباقي منها.']],
    g: function (r, lv) {
      if (lv === 1) { var n = r.int(5, 95); return { q: ['What percent is shaded?', 'ما النسبة المظللة؟'], dia: D.grid(10, 10, n), a: n, s: [['Shaded squares out of 100', 'المربعات المظللة من ١٠٠', 'Percent:', n]] }; }
      var total = r.pick([20, 40, 50, 60, 80, 120, 200, 300, 500]), p = r.pick([10, 25, 50]), ans = total * p / 100;
      if (ans !== Math.floor(ans)) { total = 200; ans = total * p / 100; }
      var q = lv === 3 ? ['A shop takes ' + p + '% off a price of ' + total + '. How much is taken off?', 'خفّض متجر ' + p + '٪ من سعر ' + total + '. كم قيمة التخفيض؟'] : ['Find the percent.', 'أوجد النسبة.'];
      return { q: q, eq: p + '% × ' + total, a: ans, s: [[p + '% is ' + (p === 50 ? 'half' : p === 25 ? 'a quarter' : 'a tenth'), p + '٪ هي ' + (p === 50 ? 'النصف' : p === 25 ? 'الربع' : 'العشر'), total + ' ÷ ' + (100 / p) + ' =', ans]], miss: [[total - ans, 'That is what is left. The question asks for the ' + p + '% itself.', 'هذا ما تبقى. السؤال عن ' + p + '٪ نفسها.'], [p, 'That is the percent, not the amount.', 'هذه النسبة لا المقدار.']] };
    },
    trap: function (r) { var t = r.pick([40, 80, 120, 200]); return { eq: '25% × ' + t, w: 0, why: ['25% is a quarter, so divide by 4, not by 25.', '٢٥٪ ربع، فاقسم على ٤ لا على ٢٥.'], l: [t + ' ÷ 25 = ' + (t / 4), 'Answer: ' + (t / 4)] }; },
    explain: [['Can you score 120% on a test out of 100?', 'هل يمكن أن تحصل على ١٢٠٪ في اختبار من ١٠٠؟'], ['No. 100% is every mark there is.', 'لا. ١٠٠٪ هي كل الدرجات.'], ['Yes, if you work hard.', 'نعم، إذا اجتهدت.'], ['Yes, percent has no limit on a test.', 'نعم، لا حد للنسبة في الاختبار.']]
  });

  teach('m5.mixed', {
    why: ['Two and a half kilos, one and three quarter hours: whole numbers and parts come together.', 'كيلوان ونصف، وساعة وثلاثة أرباع: تأتي الأعداد الصحيحة والأجزاء معًا.'],
    idea: [{ p: ['A mixed number is a whole number and a fraction. 2 1/4 means two wholes and one quarter.', 'العدد الكسري عدد صحيح وكسر. ٢ و١/٤ تعني اثنين صحيحين وربعًا.'], dia: function () { return D.frac([[4, 4], [4, 4], [1, 4]]); } }, ['Change it to an improper fraction: wholes × bottom, then add the top. 2 1/4 = 9/4.', 'حوّله إلى كسر غير حقيقي: الصحيح × المقام ثم أضف البسط. ٢ و١/٤ = ٩/٤.']],
    g: function (r, lv) {
      var w = r.int(1, lv === 1 ? 3 : 7), d = r.pick(lv === 1 ? [2, 3, 4] : [3, 4, 5, 6, 8]), n = r.int(1, d - 1), top = w * d + n;
      if (lv === 2) return { q: ['What whole number and fraction is this? Give the whole number part.', 'ما الجزء الصحيح في هذا الكسر؟'], eq: top + '/' + d, a: w, s: [['How many ' + d + 's fit in ' + top + '?', 'كم ' + d + ' في ' + top + '؟', top + ' ÷ ' + d + ' =', w, 'r ' + n]], miss: [[n, 'That is the remainder, the fraction part. The whole part is how many fit.', 'هذا الباقي وهو الكسر. الصحيح هو عدد المرات.']] };
      var q = lv === 3 ? ['A recipe needs ' + w + ' and ' + n + '/' + d + ' cups, measured with a 1/' + d + ' cup. How many scoops is that?', 'تحتاج الوصفة ' + w + ' و' + n + '/' + d + ' كوب، تقيسها بملعقة ١/' + d + ' كوب. كم ملعقة؟'] : ['Write the top number of the improper fraction.', 'اكتب بسط الكسر غير الحقيقي.'];
      return { q: q, eq: w + ' ' + n + '/' + d + ' = ?/' + d, a: top, s: [['Wholes × bottom', 'الصحيح × المقام', w + ' × ' + d + ' =', w * d], ['Add the top', 'أضف البسط', (w * d) + ' + ' + n + ' =', top]], miss: [[w + n, 'You added the whole number and the top. First turn the wholes into ' + d + 'ths.', 'جمعت الصحيح والبسط. حوّل الصحيح أولًا إلى أجزاء.'], [w * d, 'That is the wholes alone. Add the top too.', 'هذا الصحيح وحده. أضف البسط.']] };
    },
    trap: function (r) { return { eq: '2 3/4', w: 1, why: ['2 × 4 = 8, and 8 + 3 = 11, so 11/4.', '٢ × ٤ = ٨، و٨ + ٣ = ١١، فالناتج ١١/٤.'], l: ['2 × 4 = 8', '8 + 3 = 12', 'Answer: 12/4'] }; },
    explain: [['Why is 2 1/4 the same as 9/4?', 'لماذا ٢ و١/٤ تساوي ٩/٤؟'], ['Each whole is 4 quarters, so two wholes are 8 quarters, plus 1 more.', 'كل صحيح ٤ أرباع، فالاثنان ٨ أرباع، ومعها ربع.'], ['Because 2 + 1 + 4 = 7, roughly 9.', 'لأن ٢ + ١ + ٤ = ٧ تقريبًا ٩.'], ['Because you multiply all three numbers.', 'لأنك تضرب الأعداد الثلاثة.']]
  });

  teach('m5.cmpF', {
    why: ['To compare 2/3 and 3/4 you must first make the pieces the same size.', 'لتقارن ٢/٣ و٣/٤ عليك أولًا أن تجعل القطع بحجم واحد.'],
    idea: [{ p: ['Rewrite both over a common bottom, then compare tops. 2/3 = 8/12 and 3/4 = 9/12, so 3/4 is bigger.', 'اكتبهما على مقام مشترك ثم قارن البسطين. ٢/٣ = ٨/١٢ و٣/٤ = ٩/١٢، فالأكبر ٣/٤.'], dia: function () { return D.frac([[8, 12], [9, 12]]); } }, ['A common bottom is a multiple of both bottoms.', 'المقام المشترك مضاعف للمقامين.']],
    g: function (r, lv) {
      var pairs = lv === 1 ? [[2, 4], [2, 6], [3, 6], [4, 8], [5, 10]] : [[2, 3], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6], [3, 8], [6, 8]], p = r.pick(pairs), b = p[0], d = p[1], L = TM.lcm(b, d), a = r.int(1, b - 1), c = r.int(1, d - 1); if (a * L / b === c * L / d) c = c === 1 ? (d > 2 ? 2 : 1) : c - 1; if (a * L / b === c * L / d) a = b - 1 === a ? 1 : b - 1;
      var A = a * L / b, Cc = c * L / d;
      if (lv === 1) return { q: ['Rewrite ' + a + '/' + b + ' over ' + L + '. What is the new top?', 'اكتب ' + a + '/' + b + ' على المقام ' + L + '. ما البسط الجديد؟'], eq: a + '/' + b + ' = ?/' + L, a: A, s: [['What is the bottom multiplied by?', 'في كم ضُرب المقام؟', L + ' ÷ ' + b + ' =', L / b], ['Same for the top', 'وبالمثل البسط', a + ' × ' + (L / b) + ' =', A]] };
      var big = A > Cc ? a + '/' + b : c + '/' + d, sm = A > Cc ? c + '/' + d : a + '/' + b;
      if (A === Cc) return { q: ['Which is true?', 'أيّها صحيح؟'], o: [['They are equal', 'متساويان'], [a + '/' + b + ' is bigger', a + '/' + b + ' أكبر'], [c + '/' + d + ' is bigger', c + '/' + d + ' أكبر']], s: [['Same bottom', 'مقام واحد', A + '/' + L + ' and ' + Cc + '/' + L]] };
      return { q: ['Which is bigger?', 'أيّهما أكبر؟'], dia: D.frac([[A, L], [Cc, L]]), o: [[big, big], [sm, sm, 'Over ' + L + ' it has fewer parts.', 'على المقام ' + L + ' له أجزاء أقل.'], ['They are equal', 'متساويان']], s: [['Same bottom for both', 'مقام واحد لهما', a + '/' + b + ' = ' + A + '/' + L], [null, null, c + '/' + d + ' = ' + Cc + '/' + L], ['Compare the tops', 'قارن البسطين', 'Bigger: ' + big]] };
    },
    trap: function (r) { return { eq: '2/3 and 3/4', w: 1, why: ['3/4 over 12 is 9/12, not 3/12. Multiply the top by 3 as well.', '٣/٤ على ١٢ تساوي ٩/١٢ لا ٣/١٢. اضرب البسط في ٣ أيضًا.'], l: ['2/3 = 8/12', '3/4 = 3/12', '8/12 > 3/12'] }; },
    explain: [['Why not compare 2/3 and 3/4 just by the tops?', 'لماذا لا نقارن ٢/٣ و٣/٤ بالبسط فقط؟'], ['Their pieces are different sizes. Only same-size pieces can be counted.', 'أجزاؤهما مختلفة الحجم، ولا تُقارن إلا الأجزاء المتساوية.'], ['Because 3 is odd.', 'لأن ٣ فردي.'], ['You can: 3 beats 2, so that is all.', 'يمكن: ٣ أكبر من ٢ وانتهى.']]
  });

  /* ---------- volume, maps and averages ---------- */
  teach('m5.vol', {
    why: ['How much water does a tank hold? How many boxes fit in a van? That is volume.', 'كم يتسع الخزان من الماء؟ وكم صندوقًا تتسع الشاحنة؟ هذا هو الحجم.'],
    idea: [{ p: ['Volume is the number of 1 cm cubes that fit inside. One layer has length × width cubes.', 'الحجم عدد المكعبات التي طول ضلعها ١ سم داخل الشكل. والطبقة الواحدة فيها الطول × العرض.'], dia: function () { return D.cuboid('5 cm', '3 cm', '2 cm'); } }, ['Stack the layers: volume = length × width × height. The units are cubic: cm³.', 'كدّس الطبقات: الحجم = الطول × العرض × الارتفاع، ووحدته مكعبة: سم³.']],
    g: function (r, lv) {
      var l = r.int(2, lv === 1 ? 6 : 12), w = r.int(2, lv === 1 ? 5 : 8), h = r.int(2, lv === 1 ? 4 : 9), v = l * w * h;
      if (lv === 3) return { q: ['A box has a volume of ' + v + ' cm³. It is ' + l + ' cm long and ' + w + ' cm wide. How tall is it, in cm?', 'حجم صندوق ' + v + ' سم³، طوله ' + l + ' سم وعرضه ' + w + ' سم. كم ارتفاعه؟'], eq: l + ' × ' + w + ' × ? = ' + v, dia: D.cuboid(l, w, '?'), a: h, s: [['One layer holds', 'في الطبقة الواحدة', l + ' × ' + w + ' =', l * w], ['How many layers?', 'كم طبقة؟', v + ' ÷ ' + (l * w) + ' =', h]], miss: [[v - l - w, 'You took away. Volume is built by multiplying, so undo it by dividing.', 'طرحت. الحجم يُبنى بالضرب فاعكسه بالقسمة.']] };
      return { q: ['Find the volume, in cm³.', 'أوجد الحجم بالسنتيمتر المكعب.'], dia: D.cuboid(l, w, h), a: v, s: [['One layer', 'طبقة واحدة', l + ' × ' + w + ' =', l * w], ['Stack the layers', 'كدّس الطبقات', (l * w) + ' × ' + h + ' =', v]], miss: [[l + w + h, 'You added the edges. Volume multiplies them.', 'جمعت الأضلاع. الحجم يضربها.'], [l * w, 'That is one layer. There are ' + h + ' layers.', 'هذه طبقة واحدة، والطبقات ' + h + '.']] };
    },
    trap: function (r) { var l = r.int(3, 6), w = r.int(2, 5), h = r.int(2, 4); return { eq: l + ' × ' + w + ' × ' + h, w: 0, why: ['Multiply, do not add: ' + l + ' × ' + w + ' = ' + (l * w) + '.', 'اضرب ولا تجمع: ' + l + ' × ' + w + ' = ' + (l * w) + '.'], l: [l + ' × ' + w + ' = ' + (l + w), (l + w) + ' × ' + h + ' = ' + ((l + w) * h)] }; },
    explain: [['Why is volume in cm³ and area in cm²?', 'لماذا الحجم بالسم³ والمساحة بالسم²؟'], ['Volume counts cubes with three dimensions. Area counts flat squares with two.', 'الحجم يعدّ مكعبات بثلاثة أبعاد، والمساحة تعدّ مربعات مسطحة ببعدين.'], ['Bigger shapes get bigger numbers.', 'الأشكال الأكبر تأخذ أعدادًا أكبر.'], ['It is only a way of writing.', 'هي مجرد طريقة كتابة.']]
  });

  var LET = ['A', 'B', 'C', 'D'];
  teach('m5.coord', {
    why: ['Maps, screens and games find every point with two numbers.', 'الخرائط والشاشات والألعاب تحدد كل نقطة بعددين.'],
    idea: [{ p: ['A point is written (across, up). The order matters: (2, 5) and (5, 2) are different places.', 'تُكتب النقطة (أفقيًا، رأسيًا). والترتيب مهم: (٢، ٥) و(٥، ٢) مكانان مختلفان.'], dia: function () { return D.axes({ x: [0, 6], y: [0, 6], pts: [[2, 5, '(2, 5)'], [5, 2, '(5, 2)']] }); } }, ['Along the corridor first, then up the stairs.', 'في الممر أولًا، ثم على الدرج.']],
    g: function (r, lv) {
      var x = r.int(1, 6), y = r.int(1, 6); if (x === y) y = y === 6 ? 5 : y + 1;
      if (lv === 3) { var dx = r.int(1, 3), dy = r.int(1, 3), x2 = x + dx > 7 ? x - dx : x + dx; return { q: ['Point A is at (' + x + ', ' + y + '). Move it ' + Math.abs(x2 - x) + (x2 > x ? ' right' : ' left') + '. What is its new across number?', 'النقطة A عند (' + x + '، ' + y + '). حرّكها ' + Math.abs(x2 - x) + (x2 > x ? ' إلى اليمين' : ' إلى اليسار') + '. ما عددها الأفقي الجديد؟'], a: x2, s: [['Right and left change the first number only', 'اليمين واليسار يغيّران العدد الأول فقط', x + (x2 > x ? ' + ' : ' − ') + Math.abs(x2 - x) + ' =', x2]], miss: [[y, 'That is the up number. Moving sideways changes the across number.', 'هذا العدد الرأسي. الحركة الأفقية تغيّر العدد الأفقي.']] }; }
      var right = '(' + x + ', ' + y + ')', sw = '(' + y + ', ' + x + ')', w2 = '(' + x + ', ' + (y === 1 ? 2 : y - 1) + ')', w3 = '(' + (x === 1 ? 2 : x - 1) + ', ' + y + ')';
      return { q: ['Which coordinates give point P?', 'ما إحداثيات النقطة P؟'], dia: D.axes({ x: [0, 7], y: [0, 7], pts: [[x, y, 'P']] }), o: [[right, TM.ltr(right)], [sw, TM.ltr(sw), 'Those are swapped. Across comes first.', 'هذان معكوسان. الأفقي أولًا.'], [w2, TM.ltr(w2)], [w3, TM.ltr(w3)]], s: [['Across first', 'الأفقي أولًا', 'Across:', x], ['Then up', 'ثم الرأسي', 'Up:', y]] };
    },
    trap: function (r) { return { w: 2, q: ['Point P is 3 across and 5 up. One line is wrong. Tap it.', 'النقطة P على بعد ٣ أفقيًا و٥ رأسيًا. سطر واحد خاطئ. انقر عليه.'], why: ['Across comes first: (3, 5), not (5, 3).', 'الأفقي أولًا: (٣، ٥) لا (٥، ٣).'], l: ['Across: 3', 'Up: 5', 'P = (5, 3)', ['Across comes first', 'الأفقي أولًا']] }; },
    explain: [['Why must everyone agree on the order?', 'لماذا يجب أن يتفق الجميع على الترتيب؟'], ['Otherwise the same two numbers could mean two different places.', 'وإلا دلّ العددان نفسهما على مكانين مختلفين.'], ['Because the bigger number goes first.', 'لأن العدد الأكبر يأتي أولًا.'], ['It does not matter at all.', 'لا يهم إطلاقًا.']]
  });

  teach('m5.mean', {
    why: ['A cricket average, a monthly average of rainfall, an average mark: one number tells a whole story.', 'متوسط النقاط والأمطار والدرجات: عدد واحد يروي القصة كلها.'],
    idea: [{ p: ['The mean is what each would get if everything were shared out equally. Add all, divide by how many.', 'المتوسط هو ما يناله كلٌّ لو قُسم الشيء بالتساوي. اجمع الكل ثم اقسم على عددها.'], dia: function () { return D.bars([3, 7, 5], ['A', 'B', 'C']); } }, ['3, 7 and 5 add to 15. Shared among 3, the mean is 5.', '٣ و٧ و٥ مجموعها ١٥. وبالقسمة على ٣ يكون المتوسط ٥.']],
    g: function (r, lv) {
      var n = lv === 1 ? 3 : r.int(4, 5), m = r.int(4, 18), vals = []; for (var i = 0; i < n - 1; i++) vals.push(m + r.int(-3, 3)); var sum = vals.reduce(function (a, b) { return a + b; }, 0); vals.push(m * n - sum); if (vals[n - 1] < 1) { vals[n - 1] += 4; vals[0] -= 4; }
      vals = r.shuffle(vals); var tot = m * n;
      if (vals.some(function (v) { return v < 1; })) { vals = vals.map(function () { return m; }); vals[0] = m + 1; vals[1] = m - 1; }
      if (lv === 3) { var last = vals[n - 1], rest = vals.slice(0, n - 1); return { q: ['A student has marks ' + rest.join(', ') + ' and needs a mean of ' + m + ' over ' + n + ' tests. What mark is needed in the last test?', 'درجات طالب ' + rest.join('، ') + ' ويريد متوسطًا قدره ' + m + ' في ' + n + ' اختبارات. كم يحتاج في الأخير؟'], a: last, s: [['The total needed', 'المجموع المطلوب', m + ' × ' + n + ' =', tot], ['What they have so far', 'ما لديه حتى الآن', rest.join(' + ') + ' =', tot - last], ['The difference', 'الفرق', tot + ' − ' + (tot - last) + ' =', last]], miss: [[m, 'That only works if the others already average ' + m + '. Find the total needed first.', 'يصح هذا لو كان متوسط الباقي ' + m + '. أوجد المجموع المطلوب أولًا.']] }; }
      return { q: ['Find the mean of these numbers.', 'أوجد متوسط هذه الأعداد.'], eq: vals.join(', '), a: m, dia: D.bars(vals, vals.map(function (v, i) { return LET[i] || 'E'; })), s: [['Add them all', 'اجمعها كلها', vals.join(' + ') + ' =', tot], ['Divide by how many', 'اقسم على عددها', tot + ' ÷ ' + n + ' =', m]], miss: [[tot, 'That is the total. Now share it among ' + n + '.', 'هذا المجموع. اقسمه الآن على ' + n + '.'], [Math.max.apply(null, vals) === m ? -999 : Math.max.apply(null, vals), 'That is the biggest number. The mean is the fair share.', 'هذا أكبر عدد. المتوسط هو النصيب العادل.']] };
    },
    trap: function (r) { var a = r.int(2, 6), b = r.int(7, 12), c = 3 * r.int(4, 7) - a - b; return { eq: a + ', ' + b + ', ' + c, w: 1, why: ['There are 3 numbers, so divide by 3.', 'الأعداد ثلاثة، فاقسم على ٣.'], l: [a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c), (a + b + c) + ' ÷ 2 = ' + (a + b + c) / 3, 'Mean = ' + (a + b + c) / 3] }; },
    explain: [['Can the mean be a number that is not in the list?', 'هل يمكن أن يكون المتوسط عددًا ليس في القائمة؟'], ['Yes. It is the fair share, which need not be anyone\'s actual number.', 'نعم. هو النصيب العادل، ولا يلزم أن يكون عدد أحد.'], ['No. It must be one of the numbers.', 'لا. يجب أن يكون أحد الأعداد.'], ['Only if the list is long.', 'فقط إذا كانت القائمة طويلة.']]
  });

  /* ---------- thinking with numbers ---------- */
  teach('m5.estimate', {
    why: ['A quick estimate catches a mistake before it costs you. Engineers do it before every calculation.', 'التقدير السريع يكشف الخطأ قبل أن يكلّفك. المهندسون يفعلونه قبل كل حساب.'],
    idea: [['Round each number to something easy, then calculate. 49 × 21 is about 50 × 20 = 1000.', 'قرّب كل عدد إلى عدد سهل ثم احسب. ٤٩ × ٢١ نحو ٥٠ × ٢٠ = ١٠٠٠.'], ['If your exact answer is far from the estimate, check your work.', 'إذا بعد ناتجك عن التقدير فراجع عملك.']],
    g: function (r, lv) {
      var a = r.int(2, 9) * 10 + r.pick([-1, 1, 2, -2]), b = r.int(2, 8) * 10 + r.pick([-1, 1, 2, -2]), A = Math.round(a / 10) * 10, B = Math.round(b / 10) * 10, est = A * B;
      if (lv === 1) return { q: ['Round each number to the nearest ten, then multiply.', 'قرّب كل عدد إلى أقرب عشرة ثم اضرب.'], eq: a + ' × ' + b + ' ≈ ?', a: est, s: [['Round to the nearest ten', 'قرّب إلى أقرب عشرة', a + ' ≈', A], [null, null, b + ' ≈', B], ['Multiply the easy numbers', 'اضرب العددين السهلين', A + ' × ' + B + ' =', est]] };
      var w1 = a * b + 10 * r.int(40, 90) * 10, w2 = Math.round(a * b / 10), rights = a * b;
      if (lv === 3) { var total = a * b, off = r.pick([total * 10, Math.round(total / 10), total + 900]); return { q: ['A friend says ' + a + ' × ' + b + ' = ' + off + '. Is that sensible? Choose the best reply.', 'يقول صديقك إن ' + a + ' × ' + b + ' = ' + off + '. هل هذا معقول؟ اختر أفضل رد.'], o: [['No. It should be near ' + est + '.', 'لا. يجب أن يقارب ' + est + '.'], ['Yes. Big numbers give any answer.', 'نعم. الأعداد الكبيرة تعطي أي ناتج.'], ['Yes, because it ends in a digit.', 'نعم، لأنه ينتهي برقم.']], s: [['Estimate first', 'قدّر أولًا', A + ' × ' + B + ' =', est]] }; }
      return { q: ['Without working it out exactly, which is closest to the answer?', 'دون حساب دقيق، أيها الأقرب إلى الناتج؟'], eq: a + ' × ' + b, o: [[String(rights), String(rights)]].concat([[String(w1), String(w1), 'Too big. ' + A + ' × ' + B + ' is only ' + est + '.', 'كبير جدًا. ' + A + ' × ' + B + ' تساوي ' + est + ' فقط.'], [String(w2), String(w2), 'Too small. ' + A + ' × ' + B + ' is ' + est + '.', 'صغير جدًا. ' + A + ' × ' + B + ' تساوي ' + est + '.']]), s: [['Estimate first', 'قدّر أولًا', A + ' × ' + B + ' =', est]] };
    },
    trap: function (r) { var a = r.int(3, 8) * 10 + 1, b = r.int(2, 7) * 10 - 1; return { eq: a + ' × ' + b + ' ≈ ?', w: 2, why: ['Round to tens and multiply: ' + (a - 1) + ' × ' + (b + 1) + ' = ' + ((a - 1) * (b + 1)) + '.', 'قرّب ثم اضرب: ' + (a - 1) + ' × ' + (b + 1) + ' = ' + ((a - 1) * (b + 1)) + '.'], l: [a + ' ≈ ' + (a - 1), b + ' ≈ ' + (b + 1), (a - 1) + ' × ' + (b + 1) + ' = ' + (a - 1 + b + 1), 'Estimate: ' + (a - 1 + b + 1)] }; },
    explain: [['What is an estimate for?', 'ما فائدة التقدير؟'], ['To see roughly what the answer should be, and catch big mistakes.', 'لمعرفة ما يقارب الناتج وكشف الأخطاء الكبيرة.'], ['To avoid doing maths.', 'لتجنب الرياضيات.'], ['To get the exact answer faster.', 'للوصول إلى الناتج الدقيق أسرع.']]
  });

  teach('m5.dmul', {
    why: ['One metre is 100 cm, so 2.35 m is 235 cm. Decimals move just as whole numbers do.', 'المتر ١٠٠ سم، فـ ٢٫٣٥ م تساوي ٢٣٥ سم. الكسور العشرية تتحرك كما تتحرك الأعداد الصحيحة.'],
    idea: [['× 10 moves digits one place left; × 100 two places. The point itself stays still.', '× ١٠ تحرّك الأرقام منزلة إلى اليسار، و× ١٠٠ منزلتين، والفاصلة ثابتة.'], ['3.4 × 10 = 34. No zero is stuck on: the digits slid.', '٣٫٤ × ١٠ = ٣٤. لم نُلصق صفرًا، بل انزلقت الأرقام.']],
    g: function (r, lv) {
      var f = r.pick(lv === 1 ? [10] : [10, 100]), n = lv === 1 ? r.int(11, 99) / 10 : r.int(101, 999) / 100, ans = dp(n * f, 2);
      if (lv === 3) return { q: ['Change ' + n + ' metres into centimetres.', 'حوّل ' + n + ' متر إلى سنتيمترات.'], eq: n + ' × 100', a: dp(n * 100, 2), s: [['1 metre is 100 cm', 'المتر ١٠٠ سم', n + ' × 100 =', dp(n * 100, 2)]], miss: [[dp(n * 10, 2), 'That is × 10. A metre is 100 cm.', 'هذه × ١٠. المتر ١٠٠ سم.'], [dp(n / 100, 4), 'You divided. Centimetres are smaller, so there are more of them.', 'قسمت. السنتيمتر أصغر فعدده أكبر.']] };
      return { q: ['Multiply.', 'اضرب.'], eq: n + ' × ' + f, a: ans, s: [['Move the digits ' + (f === 10 ? 'one place' : 'two places') + ' left', 'حرّك الأرقام ' + (f === 10 ? 'منزلة' : 'منزلتين') + ' إلى اليسار', n + ' × ' + f + ' =', ans]], miss: [[n + '0', 'A zero on the end of a decimal changes nothing. The digits must move.', 'الصفر في آخر الكسر العشري لا يغيّر شيئًا. يجب أن تتحرك الأرقام.']] };
    },
    trap: function (r) { var a = r.int(1, 9) + r.int(1, 9) / 10; return { w: 1, why: ['Adding a zero after a decimal changes nothing. ' + a + ' × 10 = ' + dp(a * 10) + '.', 'الصفر بعد الكسر العشري لا يغيّر شيئًا. ' + a + ' × ١٠ = ' + dp(a * 10) + '.'], l: [a + ' × 1 = ' + a, a + ' × 10 = ' + a + '0', a + ' × 100 = ' + dp(a * 100)] }; },
    explain: [['Why is the old rule "add a zero" wrong for 3.4 × 10?', 'لماذا تخطئ قاعدة «أضف صفرًا» في ٣٫٤ × ١٠؟'], ['3.40 is still 3.4. Digits must move to change the value.', '٣٫٤٠ ما زالت ٣٫٤. لا بد أن تتحرك الأرقام لتتغير القيمة.'], ['Zeros are not allowed in decimals.', 'الأصفار ممنوعة في الكسور العشرية.'], ['It is not wrong.', 'ليست خاطئة.']]
  });

  teach('m5.money', {
    why: ['Every purchase you will ever make uses this.', 'كل عملية شراء ستقوم بها تحتاج إلى هذا.'],
    idea: [['Prices have two places: 3.75 means 3 whole units and 75 hundredths.', 'للأسعار منزلتان: ٣٫٧٥ تعني ٣ وحدات و٧٥ جزءًا من مئة.'], ['For change, take the price away from what you paid. Counting up from the price also works.', 'لحساب الباقي اطرح السعر مما دفعت. ويصلح أيضًا العدّ من السعر صعودًا.']],
    g: function (r, lv) {
      var p = r.int(4, 39) * 25 / 100, pay = Math.ceil(p / 5) * 5 + (p % 5 === 0 ? 5 : 0), n = r.int(2, 5);
      if (lv === 1) return { q: ['You pay ' + pay + ' for something costing ' + p.toFixed(2) + '. How much change?', 'دفعت ' + pay + ' ثمنًا لشيء سعره ' + p.toFixed(2) + '. كم الباقي؟'], eq: pay + ' − ' + p.toFixed(2), a: dp(pay - p, 2), s: [['Take the price from what you paid', 'اطرح السعر مما دفعت', pay + ' − ' + p.toFixed(2) + ' =', dp(pay - p, 2)]], miss: [[dp(pay + p, 2), 'You added. Change is what comes back.', 'جمعت. الباقي هو ما يعود إليك.']] };
      if (lv === 2) return { q: ['One item costs ' + p.toFixed(2) + '. What do ' + n + ' cost?', 'سعر القطعة ' + p.toFixed(2) + '. كم سعر ' + n + ' قطع؟'], eq: p.toFixed(2) + ' × ' + n, a: dp(p * n, 2), s: [['Multiply the price', 'اضرب السعر', p.toFixed(2) + ' × ' + n + ' =', dp(p * n, 2)]], miss: [[dp(p + n, 2), 'You added. ' + n + ' items cost ' + n + ' times as much.', 'جمعت. ' + n + ' قطع تكلف ' + n + ' أضعاف.']] };
      var tot = dp(p * n, 2), pp = Math.ceil(tot / 10) * 10 + (tot % 10 === 0 ? 10 : 0);
      return { q: ['You buy ' + n + ' items at ' + p.toFixed(2) + ' each and pay ' + pp + '. How much change?', 'اشتريت ' + n + ' قطع سعر الواحدة ' + p.toFixed(2) + ' ودفعت ' + pp + '. كم الباقي؟'], a: dp(pp - tot, 2), s: [['Find the total', 'أوجد المجموع', p.toFixed(2) + ' × ' + n + ' =', tot], ['Take it from what you paid', 'اطرحه مما دفعت', pp + ' − ' + tot + ' =', dp(pp - tot, 2)]], miss: [[tot, 'That is the total. The question asks for the change.', 'هذا المجموع. السؤال عن الباقي.'], [dp(pp - p, 2), 'That is the change for one item. You bought ' + n + '.', 'هذا باقي قطعة واحدة، واشتريت ' + n + '.']] };
    },
    trap: function (r) { var p = r.int(3, 9) + .75; return { eq: '20 − ' + p, w: 0, why: ['20 − ' + p + ' = ' + dp(20 - p, 2) + '. Count up to check.', '٢٠ − ' + p + ' = ' + dp(20 - p, 2) + '. عُدّ صعودًا لتتحقق.'], l: ['20 − ' + p + ' = ' + dp(20 - p + 1, 2), dp(20 - p + 1, 2) + ' + ' + p + ' = ' + dp(21, 2)] }; },
    explain: [['How do you check your change?', 'كيف تتحقق من الباقي؟'], ['Add it to the price. You should get what you paid.', 'أضفه إلى السعر فيجب أن تحصل على ما دفعته.'], ['Multiply it by the price.', 'اضربه في السعر.'], ['Ask for a new receipt.', 'اطلب فاتورة جديدة.']]
  });

  teach('m5.line', {
    why: ['Temperature through a day, savings through a year: a line graph shows a story at a glance.', 'الحرارة خلال اليوم والادخار خلال العام: الرسم الخطي يروي القصة بنظرة.'],
    idea: [{ p: ['Find the time on the bottom axis, go up to the line, then read across to the value.', 'حدد الزمن على المحور الأفقي واصعد إلى الخط ثم اقرأ القيمة أفقيًا.'], dia: function () { return D.axes({ x: [0, 6], y: [0, 10], step: 1, every: 2, polyline: [[0, 2], [1, 4], [2, 5], [3, 8], [4, 7], [5, 9], [6, 6]] }); } }, ['A steep line means fast change. A flat line means no change.', 'الخط الحاد يعني تغيرًا سريعًا، والأفقي يعني لا تغير.']],
    g: function (r, lv) {
      var ys = [r.int(1, 4)]; for (var i = 1; i <= 6; i++) ys.push(Math.max(1, Math.min(10, ys[i - 1] + r.int(-2, 3))));
      var pl = ys.map(function (y, i) { return [i, y]; }), dia = D.axes({ x: [0, 6], y: [0, 10], step: 1, every: 2, polyline: pl, pts: pl.map(function (q) { return [q[0], q[1]]; }) }), h = r.int(0, 5);
      if (lv === 1) return { q: ['Read the value at ' + h + ' hours.', 'اقرأ القيمة عند الساعة ' + h + '.'], dia: dia, a: ys[h], s: [['Go up from ' + h + ', then across', 'اصعد من ' + h + ' ثم أفقيًا', 'Value:', ys[h]]], miss: [[h, 'That is the time. Read the value on the side axis.', 'هذا الزمن. اقرأ القيمة على المحور الرأسي.']] };
      if (lv === 2) { var h2 = h + 1; return { q: ['How much does it change from hour ' + h + ' to hour ' + h2 + '? Use a minus sign if it falls.', 'كم يتغير من الساعة ' + h + ' إلى الساعة ' + h2 + '؟ استخدم إشارة السالب إذا انخفض.'], dia: dia, a: ys[h2] - ys[h], s: [['Read both values', 'اقرأ القيمتين', 'At ' + h + ': ' + ys[h] + ', at ' + h2 + ': ' + ys[h2]], ['Later minus earlier', 'المتأخرة ناقص المتقدمة', ys[h2] + ' − ' + ys[h] + ' =', TM.m(ys[h2] - ys[h])]] }; }
      var mx = Math.max.apply(null, ys);
      return { q: ['What is the highest value reached?', 'ما أعلى قيمة بلغها؟'], dia: dia, a: mx, s: [['Find the highest point', 'أوجد أعلى نقطة', 'Value:', mx]] };
    },
    trap: function (r) { return { w: 1, q: ['A line goes through (2, 5) and (3, 8). One line is wrong. Tap it.', 'يمر خط بالنقطتين (٢، ٥) و(٣، ٨). سطر واحد خاطئ. انقر عليه.'], why: ['From 5 up to 8 is a rise of 3.', 'من ٥ إلى ٨ ارتفاع قدره ٣.'], l: [['At 2 the value is 5', 'عند ٢ القيمة ٥'], 'Rise: 8 − 5 = 2', ['At 3 the value is 8', 'عند ٣ القيمة ٨']] }; },
    explain: [['What does a flat part of a line graph mean?', 'ماذا يعني الجزء الأفقي من الرسم الخطي؟'], ['The value stayed the same during that time.', 'بقيت القيمة ثابتة في ذلك الوقت.'], ['The value fell to zero.', 'انخفضت القيمة إلى صفر.'], ['Time has stopped.', 'توقف الزمن.']]
  });

  teach('m5.sim', {
    why: ['Simplifying fractions saves work in every later calculation, and shows when two things are the same.', 'تبسيط الكسور يوفر الجهد في كل حساب لاحق، ويكشف تساوي الأشياء.'],
    idea: [['Divide top and bottom by a number that goes into both, until nothing more goes.', 'اقسم البسط والمقام على عدد يقسمهما معًا حتى لا يبقى عدد يقسمهما.'], ['18/24: both divide by 6, giving 3/4. Or by 2 then by 3: the same answer.', '١٨/٢٤: كلاهما يقبل القسمة على ٦ فيعطي ٣/٤. أو على ٢ ثم ٣: الناتج نفسه.']],
    g: function (r, lv) {
      var d = r.pick([3, 4, 5, 7, 8]), n = r.int(1, d - 1); while (gcd(n, d) > 1) n = r.int(1, d - 1); var k = r.pick(lv === 1 ? [2, 3, 4] : [6, 8, 9, 12]), N = n * k, Dn = d * k;
      if (lv === 1) return { q: ['What number divides both ' + N + ' and ' + Dn + '? Then give the simplified top.', 'بسّط ' + N + '/' + Dn + '. ما البسط الجديد؟'], eq: N + '/' + Dn + ' = ?/' + d, a: n, s: [['Divide the bottom', 'اقسم المقام', Dn + ' ÷ ' + d + ' =', k], ['Do the same to the top', 'وبالمثل البسط', N + ' ÷ ' + k + ' =', n]] };
      var q = lv === 3 ? [N + ' out of ' + Dn + ' students walk to school. Give the fraction in simplest form.', N + ' من ' + Dn + ' طالبًا يمشون إلى المدرسة. أعط الكسر في أبسط صورة.'] : ['Simplify fully.', 'بسّط تمامًا.'];
      return { q: q, eq: N + '/' + Dn, a: n + '/' + d, exact: true, s: [['Highest number dividing both', 'أكبر عدد يقسمهما', 'Factor:', k], [null, null, N + ' ÷ ' + k + ' =', n], [null, null, Dn + ' ÷ ' + k + ' =', d], ['Simplest form', 'أبسط صورة', 'Answer:', n + '/' + d]], miss: [[(N / 2 === Math.floor(N / 2) && Dn / 2 === Math.floor(Dn / 2)) && k !== 2 ? (N / 2) + '/' + (Dn / 2) : (N) + '/' + (Dn), 'Equal, but it can go further. Keep dividing.', 'مساوٍ لكنه يقبل المزيد. تابع القسمة.']] };
    },
    trap: function (r) { return { eq: '12/18', w: 1, why: ['Subtracting the same number changes the value. Divide both by 6: 2/3.', 'طرح العدد نفسه يغيّر القيمة. اقسمهما على ٦: ٢/٣.'], l: [['12 and 18 are both even', '١٢ و١٨ زوجيان'], ['Take 6 from both: 6/12', 'اطرح ٦ منهما: ٦/١٢'], 'Answer: 1/2'] }; },
    explain: [['How do you know a fraction is fully simplified?', 'كيف تعرف أن الكسر مبسّط تمامًا؟'], ['No number above 1 divides both top and bottom.', 'لا يقسم البسط والمقام معًا عدد أكبر من ١.'], ['The numbers are both under 10.', 'كلاهما أقل من ١٠.'], ['The top is 1.', 'البسط يساوي ١.']]
  });

  /* ---------- problem solving ---------- */
  teach('g5.gauss', {
    why: ['Long ago a schoolboy added 1 to 100 in seconds by spotting a pattern. Spotting patterns is what mathematicians do.', 'قبل زمن طويل جمع تلميذ الأعداد من ١ إلى ١٠٠ في ثوانٍ لأنه لاحظ نمطًا. ملاحظة الأنماط هي عمل الرياضيين.'],
    idea: [['Pair the first and last: 1 + 100, 2 + 99, 3 + 98. Each pair makes 101.', 'اقرن الأول بالأخير: ١ + ١٠٠ و٢ + ٩٩ و٣ + ٩٨. كل زوج يعطي ١٠١.'], ['There are 50 pairs, so the sum is 50 × 101 = 5050. In general: n × (n + 1) ÷ 2.', 'الأزواج ٥٠، فالمجموع ٥٠ × ١٠١ = ٥٠٥٠. وعمومًا: ن × (ن + ١) ÷ ٢.']],
    g: function (r, lv) {
      var n = lv === 1 ? r.pick([10, 20, 30, 40]) : lv === 2 ? r.pick([50, 60, 80, 200]) : r.pick([100, 150, 300, 500]), sum = n * (n + 1) / 2, s = [['Pair first and last', 'اقرن الأول بالأخير', '1 + ' + n + ' =', n + 1], ['How many pairs?', 'كم زوجًا؟', n + ' ÷ 2 =', n / 2], ['Pairs × pair sum', 'الأزواج × مجموع الزوج', (n / 2) + ' × ' + (n + 1) + ' =', sum]];
      return { q: ['Add every whole number from 1 to ' + n + '.', 'اجمع كل الأعداد الصحيحة من ١ إلى ' + n + '.'], eq: '1 + 2 + ... + ' + n, a: sum, s: s, miss: [[n * (n + 1), 'You forgot to halve: that counts every pair twice.', 'نسيت القسمة على ٢: هذا يعدّ كل زوج مرتين.'], [n / 2 * n, 'Each pair makes ' + (n + 1) + ', not ' + n + '.', 'كل زوج يعطي ' + (n + 1) + ' لا ' + n + '.']] };
    },
    trap: function (r) { var n = r.pick([10, 20, 40]); return { eq: '1 + 2 + ... + ' + n, w: 1, why: ['There are ' + (n / 2) + ' pairs, not ' + n + '.', 'الأزواج ' + (n / 2) + ' لا ' + n + '.'], l: ['1 + ' + n + ' = ' + (n + 1), n + ' × ' + (n + 1) + ' = ' + (n * (n + 1) + 1), 'Sum: ' + (n * (n + 1) + 1)] }; },
    explain: [['Why does pairing work so well?', 'لماذا ينجح الاقتران إلى هذا الحد؟'], ['One number goes up as the other comes down, so every pair is the same.', 'يزيد عدد بقدر ما ينقص الآخر فتتساوى الأزواج.'], ['Because 100 is a special number.', 'لأن ١٠٠ عدد مميز.'], ['Because adding is always easy.', 'لأن الجمع سهل دائمًا.']]
  });

  teach('g5.hand', {
    why: ['How many games in a league, how many links in a network? The same counting answers them all.', 'كم مباراة في الدوري؟ وكم وصلة في الشبكة؟ العدّ نفسه يجيب عنها كلها.'],
    idea: [['With 5 people, the first shakes 4 hands, the next 3 new ones, then 2, then 1.', 'مع ٥ أشخاص يصافح الأول ٤، والثاني ٣ جدد، ثم ٢، ثم ١.'], ['4 + 3 + 2 + 1 = 10. For n people: n × (n − 1) ÷ 2, since each handshake takes two people.', '٤ + ٣ + ٢ + ١ = ١٠. ولـ ن شخصًا: ن × (ن − ١) ÷ ٢، لأن كل مصافحة بين شخصين.']],
    g: function (r, lv) {
      var n = lv === 1 ? r.int(3, 6) : lv === 2 ? r.int(7, 12) : r.int(13, 30), t = n * (n - 1) / 2, q = lv === 3 ? ['Each of ' + n + ' teams plays every other team once. How many matches?', 'يلعب كل فريق من ' + n + ' فريقًا مع كل فريق مرة واحدة. كم مباراة؟'] : [n + ' people each shake hands once with everyone. How many handshakes?', 'يصافح كل واحد من ' + n + ' أشخاص الجميع مرة واحدة. كم مصافحة؟'];
      return { q: q, a: t, s: [['Each meets everyone else', 'يلتقي كلٌّ الباقين', n + ' × ' + (n - 1) + ' =', n * (n - 1)], ['Each counted twice, so halve', 'حُسب كلٌّ مرتين، فاقسم على ٢', (n * (n - 1)) + ' ÷ 2 =', t]], miss: [[n * (n - 1), 'That counts each handshake twice: A with B and B with A.', 'هذا يعدّ المصافحة مرتين: أ مع ب وب مع أ.'], [n * n, 'People do not shake their own hand.', 'لا أحد يصافح نفسه.']] };
    },
    trap: function (r) { var n = r.int(5, 9); return { w: 1, why: ['Nobody shakes their own hand: ' + n + ' × ' + (n - 1) + '.', 'لا أحد يصافح نفسه: ' + n + ' × ' + (n - 1) + '.'], l: [['Each meets ' + (n - 1) + ' others', 'يلتقي كلٌّ ' + (n - 1) + ' آخرين'], [n + ' × ' + n + ' handshakes', n + ' × ' + n + ' مصافحة'], ['Halve the result', 'نصّف الناتج']] }; },
    explain: [['Why do we divide by 2?', 'لماذا نقسم على ٢؟'], ['Every handshake was counted once for each of the two people.', 'حُسبت كل مصافحة مرة لكل من الشخصين.'], ['Because hands come in pairs.', 'لأن الأيدي زوجان.'], ['To make the answer smaller.', 'ليصغر الناتج.']]
  });

  teach('g5.digits', {
    why: ['You can tell whether a number divides exactly without doing the division.', 'يمكنك معرفة قبول القسمة دون إجرائها.'],
    idea: [['By 2: last digit is even. By 5: ends in 0 or 5. By 10: ends in 0.', 'على ٢: الرقم الأخير زوجي. على ٥: ينتهي بـ ٠ أو ٥. على ١٠: ينتهي بـ ٠.'], ['By 3: the digits add to a multiple of 3. By 9: the digits add to a multiple of 9.', 'على ٣: مجموع الأرقام من مضاعفات ٣. وعلى ٩: مجموع الأرقام من مضاعفات ٩.']],
    g: function (r, lv) {
      var dv = r.pick(lv === 1 ? [3] : [3, 9]), n = dv * r.int(lv === 1 ? 14 : 112, lv === 1 ? 33 : 999), ds = String(n).split('').map(Number), sum = ds.reduce(function (a, b) { return a + b; }, 0);
      if (lv === 1) return { q: ['Add the digits of ' + n + '.', 'اجمع أرقام ' + n + '.'], eq: ds.join(' + '), a: sum, s: [['Add the digits', 'اجمع الأرقام', ds.join(' + ') + ' =', sum]] };
      var near = [n + 1, n + 2, n - 1].filter(function (x) { return x % dv; }), w = near.slice(0, 2);
      if (lv === 3) { var tail = r.int(0, 8), head = r.int(12, 89), s0 = String(head).split('').reduce(function (a, b) { return a + +b; }, 0) + tail, need = (3 - (s0 % 3)) % 3; return { q: ['What is the smallest digit you can add in the box so that ' + head + '?' + tail + ' divides by 3?', 'ما أصغر رقم تضعه في المربع ليقبل ' + head + '؟' + tail + ' القسمة على ٣؟'], a: need, s: [['Add the known digits', 'اجمع الأرقام المعروفة', 'Sum:', s0], ['What makes it a multiple of 3?', 'ما يجعله من مضاعفات ٣؟', s0 + ' + ' + need + ' =', s0 + need], ['So the digit is', 'فالرقم هو', 'Digit:', need]] }; }
      return { q: ['Which divides exactly by ' + dv + '?', 'أيها يقبل القسمة على ' + dv + '؟'], o: [[String(n), String(n)]].concat(w.map(function (x) { var sx = String(x).split('').reduce(function (a, b) { return a + +b; }, 0); return [String(x), String(x), 'Its digits add to ' + sx + ', which is not a multiple of ' + dv + '.', 'مجموع أرقامه ' + sx + ' وليس من مضاعفات ' + dv + '.']; })).concat([[String(n + dv + 1), String(n + dv + 1)]]).slice(0, 4), s: [['Add the digits', 'اجمع الأرقام', ds.join(' + ') + ' =', sum], ['A multiple of ' + dv, 'من مضاعفات ' + dv, sum + ' ÷ ' + dv + ' =', sum / dv]] };
    },
    trap: function (r) { var n = r.pick([123, 234, 345, 456]); return { eq: n + ' ÷ 3 ?', w: 0, why: ['Add the digits, do not multiply them.', 'اجمع الأرقام ولا تضربها.'], l: [[String(n).split('').join(' × ') + ' = ' + String(n).split('').reduce(function (a, b) { return a * +b; }, 1), String(n).split('').join(' × ') + ' = ' + String(n).split('').reduce(function (a, b) { return a * +b; }, 1)], ['The result is a multiple of 3', 'الناتج من مضاعفات ٣'], ['So ' + n + ' divides by 3', 'إذن ' + n + ' يقبل القسمة على ٣']] }; },
    explain: [['Why does adding digits work for 3?', 'لماذا ينجح جمع الأرقام مع ٣؟'], ['10, 100 and 1000 are each 1 more than a multiple of 3, so only the digits matter.', '١٠ و١٠٠ و١٠٠٠ كل منها يزيد ١ على مضاعف لـ ٣، فلا تهم إلا الأرقام.'], ['It is a lucky trick with no reason.', 'حيلة محظوظة بلا سبب.'], ['Because 3 is the first odd prime.', 'لأن ٣ أول عدد أولي فردي.']]
  });

  teach('g5.squares', {
    why: ['A good problem hides more than it shows. A chessboard has far more than 64 squares.', 'المسألة الجيدة تُخفي أكثر مما تُظهر. لوح الشطرنج فيه أكثر من ٦٤ مربعًا بكثير.'],
    idea: [{ p: ['In a 3 × 3 grid there are 9 small squares, 4 of size 2 and 1 of size 3.', 'في شبكة ٣ × ٣ يوجد ٩ مربعات صغيرة و٤ بحجم ٢ ومربع واحد بحجم ٣.'], dia: function () { return D.grid(3, 3, 0); } }, ['9 + 4 + 1 = 14. Square numbers again: 3² + 2² + 1².', '٩ + ٤ + ١ = ١٤. مربعات مرة أخرى: ٣² + ٢² + ١².']],
    g: function (r, lv) {
      var n = lv === 1 ? r.int(2, 3) : lv === 2 ? r.int(4, 6) : r.int(6, 9), s = 0, parts = []; for (var i = n; i >= 1; i--) { s += i * i; parts.push(i * i); }
      return { q: ['How many squares of all sizes are in a ' + n + ' × ' + n + ' grid?', 'كم مربعًا من كل الأحجام في شبكة ' + n + ' × ' + n + '؟'], dia: D.grid(n, n, 0), a: s, s: parts.map(function (p, i) { return ['Squares of size ' + (i + 1), 'مربعات بحجم ' + (i + 1), n - i + '² =', (n - i) * (n - i)]; }).concat([['Add them', 'اجمعها', parts.join(' + ') + ' =', s]]), miss: [[n * n, 'That counts only the smallest squares. Look for bigger ones made of several.', 'هذا يعدّ أصغرها فقط. ابحث عن الأكبر المكوّنة من عدة مربعات.']] };
    },
    trap: function (r) { return { eq: '3 × 3', w: 1, why: ['There are 4 squares of size 2, not 2.', 'المربعات بحجم ٢ عددها ٤ لا ٢.'], l: ['Size 1: 3² = 9', 'Size 2: 2² = 2', 'Size 3: 1² = 1', 'Total: 9 + 2 + 1 = 12'] }; },
    explain: [['Why are there 4 squares of size 2 in a 3 × 3 grid?', 'لماذا يوجد ٤ مربعات بحجم ٢ في شبكة ٣ × ٣؟'], ['A size-2 square can start in 2 places across and 2 places down.', 'يمكن أن يبدأ في مكانين أفقيًا ومكانين رأسيًا.'], ['Because 4 is 2 + 2 by chance.', 'لأن ٤ = ٢ + ٢ صدفة.'], ['Because the grid has 4 corners.', 'لأن للشبكة ٤ زوايا.']]
  });

  teach('g5.work', {
    why: ['When you know the end but not the start, walk backwards. Detectives and programmers do it every day.', 'إذا عرفت النهاية دون البداية فامشِ إلى الخلف. المحققون والمبرمجون يفعلون ذلك كل يوم.'],
    idea: [['Undo each step in reverse order. The opposite of + is −, the opposite of × is ÷.', 'اعكس كل خطوة بترتيب معكوس. عكس + هو −، وعكس × هو ÷.'], ['I think of a number, double it and add 3, and get 11. Backwards: 11 − 3 = 8, 8 ÷ 2 = 4.', 'أفكر في عدد، أضاعفه وأضيف ٣ فأحصل على ١١. عكسيًا: ١١ − ٣ = ٨، ٨ ÷ ٢ = ٤.']],
    g: function (r, lv) {
      var x = r.int(2, 15), m = r.int(2, lv === 1 ? 3 : 6), p = r.int(1, 12), y = x * m + p;
      if (lv === 3) { var k = r.int(2, 5), z = (x * m + p) * k; return { q: ['I think of a number. I multiply by ' + m + ', add ' + p + ', then multiply by ' + k + ' and get ' + z + '. What was my number?', 'أفكر في عدد. أضربه في ' + m + ' وأضيف ' + p + ' ثم أضرب في ' + k + ' فأحصل على ' + z + '. ما عددي؟'], a: x, s: [['Undo × ' + k, 'اعكس × ' + k, z + ' ÷ ' + k + ' =', y], ['Undo + ' + p, 'اعكس + ' + p, y + ' − ' + p + ' =', x * m], ['Undo × ' + m, 'اعكس × ' + m, (x * m) + ' ÷ ' + m + ' =', x]], miss: [[y, 'One more step to undo.', 'بقيت خطوات تعكسها.']] }; }
      return { q: ['I think of a number, multiply by ' + m + ' and add ' + p + '. I get ' + y + '. What was my number?', 'أفكر في عدد، أضربه في ' + m + ' وأضيف ' + p + ' فأحصل على ' + y + '. ما عددي؟'], a: x, s: [['Undo the last step first', 'اعكس الخطوة الأخيرة أولًا', y + ' − ' + p + ' =', y - p], ['Undo the first step', 'اعكس الخطوة الأولى', (y - p) + ' ÷ ' + m + ' =', x]], miss: [[dp(y / m - p), 'You undid them in the wrong order. Start from the last step.', 'عكست بترتيب خاطئ. ابدأ من الخطوة الأخيرة.']] };
    },
    trap: function (r) { var x = r.int(3, 9), y = x * 2 + 4; return { eq: '? × 2 + 4 = ' + y, w: 0, why: ['Undo the last step first: take away 4 before halving.', 'اعكس الخطوة الأخيرة أولًا: اطرح ٤ قبل القسمة.'], l: [y + ' ÷ 2 = ' + (x + 3), (x + 2) + ' − 4 = ' + (x - 2), 'Answer: ' + (x - 2)] }; },
    explain: [['Why undo the last step first?', 'لماذا نعكس الخطوة الأخيرة أولًا؟'], ['It was done last, so it is on the outside. Like taking off shoes before socks.', 'نُفذت أخيرًا فهي في الخارج، كنزع الحذاء قبل الجورب.'], ['Because the last number is the biggest.', 'لأن العدد الأخير هو الأكبر.'], ['Any order gives the same answer.', 'أي ترتيب يعطي الناتج نفسه.']]
  });
})();
