/* Maths taught in full, Year 6. See lesson/teach.js for the shape of a topic. */
(function () {
  'use strict';
  var C = window.C, D = window.Dia, teach = C.teach, TM = C.TM, gcd = TM.gcd, low = TM.low, dp = TM.dp, mn = TM.m;

  /* ---------- space and data ---------- */
  teach('m.angle', {
    why: ['Builders, navigators and the direction of the qiblah all measure turns in degrees.', 'البنّاؤون والملاحون وتحديد القبلة كلهم يقيسون الدوران بالدرجات.'],
    idea: [{ p: ['A full turn is 360°. A straight line is 180°. A square corner is 90°.', 'الدورة الكاملة ٣٦٠°، والخط المستقيم ١٨٠°، وزاوية المربع ٩٠°.'], dia: function () { return D.angle('line', Object.assign(['50°', '130°'], { deg: 50 })); } }, ['Below 90° is acute, between 90° and 180° is obtuse, above 180° is reflex.', 'أقل من ٩٠° حادة، وبين ٩٠° و١٨٠° منفرجة، وفوق ١٨٠° منعكسة.']],
    g: function (r, lv) {
      if (lv === 1) { var turns = r.pick([[1, 4, 90], [1, 2, 180], [3, 4, 270], [1, 1, 360]]), t = turns[0] + '/' + turns[1]; return { q: ['How many degrees in ' + t + ' of a full turn?', 'كم درجة في ' + t + ' من الدورة الكاملة؟'], eq: t + ' × 360', a: turns[2], s: [['A full turn is 360°', 'الدورة الكاملة ٣٦٠°', '360 ÷ ' + turns[1] + ' × ' + turns[0] + ' =', turns[2]]] }; }
      var x = r.int(25, 155);
      if (lv === 2) return { q: ['The two angles sit on a straight line. Find the missing angle, in degrees.', 'الزاويتان على خط مستقيم. أوجد الزاوية الناقصة بالدرجات.'], dia: D.angle('line', Object.assign([x + '°', '?'], { deg: x })), a: 180 - x, s: [['A straight line is 180°', 'الخط المستقيم ١٨٠°', '180 − ' + x + ' =', 180 - x]], miss: [[360 - x, 'That uses a full turn. A straight line is only 180°.', 'هذا للدورة الكاملة. الخط المستقيم ١٨٠° فقط.'], [90 - x, 'That is for a right angle. A straight line is 180°.', 'هذا للزاوية القائمة. الخط المستقيم ١٨٠°.']] };
      var a = r.int(70, 140), b = r.int(60, 130);
      return { q: ['Three angles meet at a point. Two are ' + a + '° and ' + b + '°. Find the third, in degrees.', 'تلتقي ثلاث زوايا عند نقطة. اثنتان ' + a + '° و' + b + '°. أوجد الثالثة بالدرجات.'], dia: D.angle('point', [a + '°', b + '°', '?']), a: 360 - a - b, s: [['Add what you know', 'اجمع المعلوم', a + ' + ' + b + ' =', a + b], ['Round a point is 360°', 'حول النقطة ٣٦٠°', '360 − ' + (a + b) + ' =', 360 - a - b]], miss: [[180 - a - b, 'Around a point the total is 360°, not 180°.', 'المجموع حول النقطة ٣٦٠° لا ١٨٠°.']] };
    },
    trap: function (r) { var x = r.int(35, 75); return { w: 1, why: ['A straight line is 180°, so the partner of ' + x + '° is ' + (180 - x) + '°.', 'الخط المستقيم ١٨٠°، فمكمّلة ' + x + '° هي ' + (180 - x) + '°.'], l: ['90 + 90 = 180', '180 − ' + x + ' = ' + (170 - x), '360 − 90 = 270'] }; },
    explain: [['Why do we say a straight line is half a turn?', 'لماذا نقول إن الخط المستقيم نصف دورة؟'], ['Turn to face the opposite way and you have turned 180°, half of 360°.', 'إذا استدرت إلى الجهة المقابلة فقد دُرت ١٨٠°، نصف ٣٦٠°.'], ['Because lines are half as long as circles.', 'لأن الخطوط نصف طول الدوائر.'], ['Because 180 is a round number.', 'لأن ١٨٠ عدد مدوّر.']]
  });

  teach('m.area2', {
    why: ['How much fence for a garden, and how much grass inside it? They are two different questions.', 'كم سياجًا للحديقة وكم عشبًا بداخلها؟ هذان سؤالان مختلفان.'],
    idea: [{ p: ['Perimeter is the distance around. Add all the sides. Area is the space inside. Multiply length by width.', 'المحيط هو المسافة حول الشكل: اجمع كل الأضلاع. والمساحة ما بداخله: الطول × العرض.'], dia: function () { return D.rect('8 cm', '5 cm', 8, 5); } }, ['Perimeter is in cm. Area is in cm², because it counts squares.', 'المحيط بالسنتيمتر، والمساحة بالسنتيمتر المربع لأنها تعدّ المربعات.']],
    g: function (r, lv) {
      var w = r.int(3, 14), h = r.int(2, 11); if (w === h) w++;
      if (lv === 1) { var pm = r.bool(); return pm ? { q: ['Find the perimeter, in cm.', 'أوجد المحيط بالسنتيمتر.'], dia: D.rect(w + ' cm', h + ' cm', w, h), a: 2 * (w + h), s: [['Length + width', 'الطول + العرض', w + ' + ' + h + ' =', w + h], ['Twice round', 'مرتين', (w + h) + ' × 2 =', 2 * (w + h)]], miss: [[w * h, 'That is the area. Perimeter goes around the edge.', 'هذه المساحة. المحيط حول الحافة.'], [w + h, 'That is only two sides. There are four.', 'هذان ضلعان فقط، والأضلاع أربعة.']] } : { q: ['Find the area, in cm².', 'أوجد المساحة بالسنتيمتر المربع.'], dia: D.rect(w + ' cm', h + ' cm', w, h), a: w * h, s: [['Length × width', 'الطول × العرض', w + ' × ' + h + ' =', w * h]], miss: [[2 * (w + h), 'That is the perimeter. Area counts the squares inside.', 'هذا المحيط. المساحة تعدّ المربعات بالداخل.']] }; }
      if (lv === 2) { var A0 = w * h; return { q: ['A rectangle has area ' + A0 + ' cm² and width ' + h + ' cm. How long is it, in cm?', 'مساحة مستطيل ' + A0 + ' سم² وعرضه ' + h + ' سم. كم طوله؟'], eq: '? × ' + h + ' = ' + A0, a: w, s: [['Undo the multiplying', 'اعكس الضرب', A0 + ' ÷ ' + h + ' =', w]], miss: [[A0 - h, 'Area comes from multiplying, so undo it by dividing.', 'المساحة تأتي من الضرب فاعكسها بالقسمة.']] }; }
      var a = r.int(8, 14), b = r.int(6, 12), c = r.int(2, 5), d = r.int(2, 4), big = a * b, cut = c * d;
      return { q: ['Find the area of this L shape, in cm². Work out the whole rectangle, then take off the corner.', 'أوجد مساحة هذا الشكل بالسنتيمتر المربع. احسب المستطيل كله ثم اطرح الركن.'], dia: D.lshape(a, b, c, d), a: big - cut, s: [['The whole rectangle', 'المستطيل كله', a + ' × ' + b + ' =', big], ['The missing corner', 'الركن الناقص', c + ' × ' + d + ' =', cut], ['Take it off', 'اطرحه', big + ' − ' + cut + ' =', big - cut]], miss: [[big, 'That is the whole rectangle. The corner is missing.', 'هذا المستطيل كله، والركن مقطوع.'], [big + cut, 'The corner is cut away, so take it off.', 'الركن مقطوع فاطرحه.']] };
    },
    trap: function (r) { var w = r.int(4, 9), h = r.int(2, 3); return { eq: w + ' × ' + h, w: 1, why: ['Perimeter is 2 × (' + w + ' + ' + h + ') = ' + (2 * (w + h)) + '.', 'المحيط ٢ × (' + w + ' + ' + h + ') = ' + (2 * (w + h)) + '.'], l: ['Area: ' + w + ' × ' + h + ' = ' + (w * h), 'Perimeter: ' + w + ' + ' + h + ' = ' + (2 * (w + h)), ['Two different questions', 'سؤالان مختلفان']] }; },
    explain: [['Can two rectangles have the same area but different perimeters?', 'هل يمكن لمستطيلين أن يتساويا في المساحة ويختلفا في المحيط؟'], ['Yes. 2 × 6 and 3 × 4 both have area 12, with perimeters 16 and 14.', 'نعم. ٢ × ٦ و٣ × ٤ مساحتهما ١٢ ومحيطاهما ١٦ و١٤.'], ['No. Same area always means same perimeter.', 'لا. تساوي المساحة يعني تساوي المحيط دائمًا.'], ['Only for squares.', 'في المربعات فقط.']]
  });

  teach('m.inherit', { keep: true,
    g: function (r, lv) {
      var d = r.pick([2, 3, 4, 6, 8]), k = lv === 1 ? r.int(2, 8) : r.int(5, 40), total = d * k * 12, n = r.int(1, d - 1), g0 = gcd(n, d), nn = n / g0, dd = d / g0, ans = total / dd * nn;
      return { q: ['Find ' + nn + '/' + dd + ' of ' + total + '.', 'أوجد ' + nn + '/' + dd + ' من ' + total + '.'], eq: nn + '/' + dd + ' × ' + total, a: ans, s: [['Find one part', 'أوجد جزءًا واحدًا', total + ' ÷ ' + dd + ' =', total / dd], ['Take the parts you need', 'خذ الأجزاء المطلوبة', (total / dd) + ' × ' + nn + ' =', ans]], miss: [[total / dd, 'That is one part. You need ' + nn + ' of them.', 'هذا جزء واحد، وتحتاج إلى ' + nn + '.']] };
    },
    trap: function (r) { var t = 24 * r.int(1, 5); return { eq: '3/8 × ' + t, w: 0, why: ['One eighth is ' + t + ' ÷ 8 = ' + (t / 8) + '.', 'الثُمن هو ' + t + ' ÷ ٨ = ' + (t / 8) + '.'], l: [t + ' ÷ 8 = ' + (t / 4), (t / 4) + ' × 3 = ' + (t / 4 * 3)] }; },
    explain: [['To find 3/8 of an amount, what do you do first?', 'لإيجاد ٣/٨ من مقدار، ماذا تفعل أولًا؟'], ['Divide by 8 to find one part, then multiply by 3.', 'اقسم على ٨ لتجد الجزء الواحد ثم اضرب في ٣.'], ['Add 3 and 8.', 'اجمع ٣ و٨.'], ['Multiply by 8.', 'اضرب في ٨.']]
  });

  /* ---------- reasoning with numbers ---------- */
  teach('m6.order', {
    why: ['Calculators, computers and every mathematician on earth follow the same order. Without it, one sum could have two answers.', 'الآلات الحاسبة والحواسيب وكل الرياضيين يتبعون الترتيب نفسه، وإلا كان للعملية ناتجان.'],
    idea: [['Brackets first. Then × and ÷ from left to right. Then + and − from left to right.', 'الأقواس أولًا، ثم × و÷ من اليسار إلى اليمين، ثم + و− من اليسار إلى اليمين.'], ['2 + 3 × 4 is 2 + 12 = 14, not 20.', '٢ + ٣ × ٤ = ٢ + ١٢ = ١٤ وليست ٢٠.']],
    g: function (r, lv) {
      var a = r.int(2, 12), b = r.int(2, 9), c = r.int(2, 9);
      if (lv === 1) return { q: ['Work it out in the right order.', 'احسب بالترتيب الصحيح.'], eq: a + ' + ' + b + ' × ' + c, a: a + b * c, s: [['Multiply first', 'اضرب أولًا', b + ' × ' + c + ' =', b * c], ['Then add', 'ثم اجمع', a + ' + ' + (b * c) + ' =', a + b * c]], miss: [[(a + b) * c, 'You added first. Multiplying comes before adding.', 'جمعت أولًا. الضرب قبل الجمع.']] };
      if (lv === 2) return { q: ['Work it out in the right order.', 'احسب بالترتيب الصحيح.'], eq: '(' + a + ' + ' + b + ') × ' + c, a: (a + b) * c, s: [['Brackets first', 'الأقواس أولًا', a + ' + ' + b + ' =', a + b], ['Then multiply', 'ثم اضرب', (a + b) + ' × ' + c + ' =', (a + b) * c]], miss: [[a + b * c, 'Brackets come first, so add before multiplying here.', 'الأقواس أولًا، فاجمع قبل الضرب هنا.']] };
      var d = r.int(2, 6), e = d * r.int(2, 8), f = r.int(2, 9), x = a * b + e / d - f;
      return { q: ['Work it out in the right order.', 'احسب بالترتيب الصحيح.'], eq: a + ' × ' + b + ' + ' + e + ' ÷ ' + d + ' − ' + f, a: x, s: [['× first', '× أولًا', a + ' × ' + b + ' =', a * b], ['÷ next', 'ثم ÷', e + ' ÷ ' + d + ' =', e / d], ['Now left to right', 'والآن من اليسار', (a * b) + ' + ' + (e / d) + ' − ' + f + ' =', x]] };
    },
    trap: function (r) { var a = r.int(2, 9), b = r.int(2, 6), c = r.int(2, 6); return { eq: a + ' + ' + b + ' × ' + c, w: 0, why: ['Multiply first: ' + b + ' × ' + c + ' = ' + (b * c) + ', then add ' + a + '.', 'اضرب أولًا: ' + b + ' × ' + c + ' = ' + (b * c) + ' ثم أضف ' + a + '.'], l: [['Add first: ' + a + ' + ' + b + ' = ' + (a + b), 'اجمع أولًا: ' + a + ' + ' + b + ' = ' + (a + b)], (a + b) + ' × ' + c + ' = ' + ((a + b) * c), 'Answer: ' + ((a + b) * c)] }; },
    explain: [['Why must everyone use the same order?', 'لماذا يجب أن يتبع الجميع الترتيب نفسه؟'], ['So that one calculation has one answer, whoever works it out.', 'ليكون للعملية ناتج واحد أيًا كان من يحسبها.'], ['Because × is harder than +.', 'لأن × أصعب من +.'], ['So the sum looks tidy.', 'لتبدو العملية مرتبة.']]
  });

  teach('m6.alg', {
    why: ['A letter holds the place of a number you do not know yet. All of algebra, science and code rests on this.', 'الحرف يشغل مكان عدد لا تعرفه بعد. وعلى هذا تقوم الجبر والعلوم والبرمجة.'],
    idea: [['x + 5 = 12 asks: what number plus 5 makes 12? Undo the + 5 by taking 5 from both sides.', 'س + ٥ = ١٢ تسأل: أي عدد مع ٥ يعطي ١٢؟ اعكس + ٥ بطرح ٥ من الطرفين.'], ['An equation is a balance. Whatever you do to one side, do to the other.', 'المعادلة ميزان: ما تفعله في طرف افعله في الآخر.']],
    g: function (r, lv) {
      var x = r.int(2, 20), b = r.int(2, 15), m = r.int(2, 9);
      if (lv === 1) return { q: ['Find x.', 'أوجد x.'], eq: 'x + ' + b + ' = ' + (x + b), a: x, s: [['Take ' + b + ' from both sides', 'اطرح ' + b + ' من الطرفين', (x + b) + ' − ' + b + ' =', x]], miss: [[x + 2 * b, 'You added. Undo + ' + b + ' by taking away.', 'جمعت. اعكس + ' + b + ' بالطرح.']] };
      if (lv === 2) return { q: ['Find x.', 'أوجد x.'], eq: m + 'x = ' + (m * x), a: x, s: [[m + 'x means ' + m + ' × x. Divide both sides', m + 'x تعني ' + m + ' × x. اقسم الطرفين', (m * x) + ' ÷ ' + m + ' =', x]], miss: [[m * x - m, m + 'x is multiplying, so divide.', m + 'x ضرب، فاقسم.']] };
      return { q: ['Each pack of pens costs ' + m + '. n packs cost ' + (m * x) + '. Find n.', 'حزمة الأقلام سعرها ' + m + '. عدد n من الحزم يكلف ' + (m * x) + '. أوجد n.'], eq: m + 'n = ' + (m * x), a: x, s: [['Divide by the price of one', 'اقسم على سعر الواحدة', (m * x) + ' ÷ ' + m + ' =', x]], miss: [[m * x * m, 'Divide, do not multiply.', 'اقسم ولا تضرب.']] };
    },
    trap: function (r) { var x = r.int(3, 12), b = r.int(2, 9); return { eq: 'x + ' + b + ' = ' + (x + b), w: 0, why: ['Undo + ' + b + ' by subtracting, not adding.', 'اعكس + ' + b + ' بالطرح لا بالجمع.'], l: [['Add ' + b + ': ' + (x + b) + ' + ' + b + ' = ' + (x + 2 * b), 'أضف ' + b + ': ' + (x + b) + ' + ' + b + ' = ' + (x + 2 * b)], 'x = ' + (x + 2 * b), 'Check: ' + (x + 2 * b) + ' + ' + b + ' = ' + (x + 3 * b)] }; },
    explain: [['Why subtract from both sides, not only one?', 'لماذا نطرح من الطرفين لا من طرف واحد؟'], ['An equation is a balance. Changing one side alone tips it.', 'المعادلة ميزان، وتغيير طرف واحد يختل به.'], ['Because x wants to be alone.', 'لأن x يريد أن يكون وحده.'], ['It makes no difference.', 'لا فرق.']]
  });

  teach('m6.alg2', {
    why: ['Most real problems take more than one step to undo.', 'أغلب المسائل الحقيقية تحتاج إلى أكثر من خطوة لتُعكس.'],
    idea: [['2x + 3 = 11. Undo the + 3 first: 2x = 8. Then undo the × 2: x = 4.', '٢x + ٣ = ١١. اعكس + ٣ أولًا: ٢x = ٨. ثم اعكس × ٢: x = ٤.'], ['Check by putting it back: 2 × 4 + 3 = 11. It works.', 'تحقق بالتعويض: ٢ × ٤ + ٣ = ١١. صحيح.']],
    g: function (r, lv) {
      var x = r.int(2, 12), m = r.int(2, lv === 1 ? 5 : 9), b = r.int(1, 15), minus = lv > 1 && r.bool(), rhs = minus ? m * x - b : m * x + b;
      if (lv === 3) return { q: ['Think of a number. Multiply by ' + m + ' and ' + (minus ? 'take away ' : 'add ') + b + '. You get ' + rhs + '. Write it as an equation and find the number.', 'فكّر في عدد. اضربه في ' + m + (minus ? ' واطرح ' : ' وأضف ') + b + '. فتحصل على ' + rhs + '. اكتب معادلة وأوجد العدد.'], eq: m + 'x ' + (minus ? '− ' : '+ ') + b + ' = ' + rhs, a: x, s: [['Undo the ' + (minus ? 'taking away' : 'adding'), 'اعكس ' + (minus ? 'الطرح' : 'الجمع'), rhs + (minus ? ' + ' : ' − ') + b + ' =', m * x], ['Undo the multiplying', 'اعكس الضرب', (m * x) + ' ÷ ' + m + ' =', x]] };
      return { q: ['Solve for x.', 'حُلّ لإيجاد x.'], eq: m + 'x ' + (minus ? '− ' : '+ ') + b + ' = ' + rhs, a: x, s: [[(minus ? 'Add ' : 'Take ') + b + (minus ? ' to' : ' from') + ' both sides', (minus ? 'أضف ' : 'اطرح ') + b + (minus ? ' إلى' : ' من') + ' الطرفين', rhs + (minus ? ' + ' : ' − ') + b + ' =', m * x], ['Divide both sides by ' + m, 'اقسم الطرفين على ' + m, (m * x) + ' ÷ ' + m + ' =', x]], miss: [[dp(rhs / m), 'You divided first but left the ' + b + ' behind. Undo the ' + b + ' first.', 'قسمت أولًا وتركت ' + b + '. اعكس ' + b + ' أولًا.']] };
    },
    trap: function (r) { var x = r.int(2, 9), m = r.int(2, 5), b = r.int(2, 9), rhs = m * x + b; return { eq: m + 'x + ' + b + ' = ' + rhs, w: 0, why: ['Take away ' + b + ': ' + rhs + ' − ' + b + ' = ' + (m * x) + '.', 'اطرح ' + b + ': ' + rhs + ' − ' + b + ' = ' + (m * x) + '.'], l: [['Add ' + b + ': ' + rhs + ' + ' + b + ' = ' + (rhs + b), 'أضف ' + b + ': ' + rhs + ' + ' + b + ' = ' + (rhs + b)], (rhs + b) + ' ÷ ' + m + ' = ' + dp((rhs + b) / m, 2), 'x = ' + dp((rhs + b) / m, 2)] }; },
    explain: [['In 2x + 3 = 11, why undo the + 3 first?', 'في ٢x + ٣ = ١١، لماذا نعكس + ٣ أولًا؟'], ['It was the last thing done to x, so it comes off first.', 'هي آخر ما حدث لـ x فتُنزع أولًا.'], ['Because 3 is smaller than 2x.', 'لأن ٣ أصغر من ٢x.'], ['You can undo in any order with no change.', 'يمكن العكس بأي ترتيب دون تغيير.']]
  });

  teach('m6.ratio', {
    why: ['Recipes, maps, medicine doses and mixing paint all run on ratio.', 'الوصفات والخرائط وجرعات الدواء وخلط الألوان كلها تقوم على النسبة.'],
    idea: [{ p: ['3 : 2 means for every 3 of one there are 2 of the other.', '٣ : ٢ تعني أن لكل ٣ من الأول ٢ من الثاني.'], dia: function () { return D.bar([3, 2]); } }, ['Multiply both sides by the same number and the ratio stays the same: 3 : 2 = 6 : 4 = 9 : 6.', 'اضرب الطرفين في العدد نفسه تبق النسبة كما هي: ٣ : ٢ = ٦ : ٤ = ٩ : ٦.']],
    g: function (r, lv) {
      var a = r.int(2, 5), b = r.int(1, 7); while (gcd(a, b) > 1 || a === b) b = r.int(1, 7); var k = r.int(2, lv === 1 ? 4 : 9);
      if (lv === 3) return { q: ['Dough uses ' + a + ' cups of flour for every ' + b + ' of water. How many cups of water for ' + (a * k) + ' cups of flour?', 'يحتاج العجين ' + a + ' أكواب دقيق لكل ' + b + ' ماء. كم كوب ماء لـ ' + (a * k) + ' أكواب دقيق؟'], eq: a + ' : ' + b + ' = ' + (a * k) + ' : ?', dia: D.bar([a, b]), a: b * k, s: [['How many times bigger?', 'كم مرة كبر؟', (a * k) + ' ÷ ' + a + ' =', k], ['Same for water', 'وبالمثل الماء', b + ' × ' + k + ' =', b * k]], miss: [[b + a * k - a, 'You added the same amount to both. Ratios scale by multiplying.', 'جمعت القدر نفسه على الطرفين. النسبة تتضاعف بالضرب.']] };
      return { q: ['Fill in the missing number.', 'أكمل العدد الناقص.'], eq: a + ' : ' + b + ' = ' + (a * k) + ' : ?', dia: D.bar([a, b]), a: b * k, s: [['What was the left side multiplied by?', 'في كم ضُرب الطرف الأيسر؟', (a * k) + ' ÷ ' + a + ' =', k], ['Do the same on the right', 'وبالمثل الأيمن', b + ' × ' + k + ' =', b * k]], miss: [[b + a * k - a, 'You added. Multiply both sides by the same number.', 'جمعت. اضرب الطرفين في العدد نفسه.']] };
    },
    trap: function (r) { var a = r.int(2, 4), b = a + 1; return { eq: a + ' : ' + b + ' = ' + (a + 2) + ' : ?', w: 1, why: ['Ratios scale by multiplying, not by adding the same amount to both sides.', 'النسبة تتضاعف بالضرب، لا بجمع القدر نفسه على الطرفين.'], l: [a + ' : ' + b + ' = ' + (a * 2) + ' : ' + (b * 2), ['Add 2 to both: ' + a + ' + 2 = ' + (a + 2) + ', ' + b + ' + 2 = ' + (b + 2), 'أضف ٢ للطرفين: ' + a + ' + 2 = ' + (a + 2) + ' و' + b + ' + 2 = ' + (b + 2)], a + ' : ' + b + ' = ' + (a + 2) + ' : ' + (b + 2)] }; },
    explain: [['Is 2 : 3 the same as 3 : 4?', 'هل ٢ : ٣ هي ٣ : ٤؟'], ['No. 1 added to both changes the mixture. 2 : 3 equals 4 : 6.', 'لا. جمع ١ على الطرفين يغيّر الخليط. ٢ : ٣ تساوي ٤ : ٦.'], ['Yes. Each side went up by one.', 'نعم. زاد كل طرف واحدًا.'], ['Yes, all ratios are close.', 'نعم، كل النسب متقاربة.']]
  });

  teach('m6.share', {
    why: ['Partners, inheritances and team prizes are often split in a ratio, not equally.', 'الشركاء والمواريث وجوائز الفرق كثيرًا ما تُقسم بنسبة لا بالتساوي.'],
    idea: [{ p: ['Share 30 in the ratio 3 : 2. Add the parts: 5 parts. One part is 30 ÷ 5 = 6.', 'اقسم ٣٠ بنسبة ٣ : ٢. اجمع الأجزاء: ٥. الجزء الواحد ٣٠ ÷ ٥ = ٦.'], dia: function () { return D.bar([3, 2], null, 6); } }, ['So one share is 3 × 6 = 18 and the other 2 × 6 = 12. They must add back to 30.', 'فالنصيب الأول ٣ × ٦ = ١٨ والثاني ٢ × ٦ = ١٢، ومجموعهما ٣٠.']],
    g: function (r, lv) {
      var a = r.int(1, 5), b = r.int(1, 6); if (a === b) b++; var u = r.int(2, lv === 1 ? 8 : 25), T0 = (a + b) * u, big = a > b;
      var q = lv === 3 ? ['Two partners share a profit of ' + T0 + ' in the ratio ' + a + ' : ' + b + '. How much does the first get?', 'يقتسم شريكان ربحًا قدره ' + T0 + ' بنسبة ' + a + ' : ' + b + '. كم نصيب الأول؟'] : ['Share ' + T0 + ' in the ratio ' + a + ' : ' + b + '. Give the first share.', 'اقسم ' + T0 + ' بنسبة ' + a + ' : ' + b + '. أعط النصيب الأول.'];
      return { q: q, dia: lv < 3 ? D.bar([a, b]) : undefined, a: a * u, s: [['How many parts?', 'كم جزءًا؟', a + ' + ' + b + ' =', a + b], ['One part', 'الجزء الواحد', T0 + ' ÷ ' + (a + b) + ' =', u], ['The first share', 'النصيب الأول', a + ' × ' + u + ' =', a * u]], miss: [[u, 'That is one part. The first share has ' + a + ' parts.', 'هذا جزء واحد، وللأول ' + a + ' أجزاء.'], [b * u, 'That is the second share.', 'هذا النصيب الثاني.'], [dp(T0 / a), 'Divide by the total parts, ' + (a + b) + ', first.', 'اقسم أولًا على مجموع الأجزاء ' + (a + b) + '.']] };
    },
    trap: function (r) { var u = r.pick([3, 6, 9]), T0 = 5 * u, q3 = T0 / 3; return { w: 0, q: ['Share ' + T0 + ' in the ratio 3 : 2. One line is wrong. Tap it.', 'اقسم ' + T0 + ' بنسبة ٣ : ٢. سطر واحد خاطئ. انقر عليه.'], why: ['Divide by the total number of parts: 3 + 2 = 5.', 'اقسم على مجموع الأجزاء: ٣ + ٢ = ٥.'], l: [['One part: ' + T0 + ' ÷ 3 = ' + q3, 'الجزء الواحد: ' + T0 + ' ÷ 3 = ' + q3], '3 × ' + q3 + ' = ' + (3 * q3), '2 × ' + q3 + ' = ' + (2 * q3)] }; },
    explain: [['How can you check your two shares?', 'كيف تتحقق من النصيبين؟'], ['They must add back to the total you started with.', 'يجب أن يعود مجموعهما إلى الكل.'], ['They must be equal.', 'يجب أن يتساويا.'], ['They must both be even.', 'يجب أن يكونا زوجيين.']]
  });

  teach('m6.pctof', {
    why: ['Sales, tax, interest and zakāh are all a percent of something.', 'التخفيضات والضرائب والفوائد والزكاة كلها نسبة من شيء.'],
    idea: [['Find 10% by dividing by 10. Find 1% by dividing by 100. Build the rest from those.', 'أوجد ١٠٪ بالقسمة على ١٠، و١٪ بالقسمة على ١٠٠، وابنِ الباقي منهما.'], ['35% of 200: 10% is 20, so 30% is 60. 5% is 10. Together, 70.', '٣٥٪ من ٢٠٠: ١٠٪ هي ٢٠ فـ ٣٠٪ هي ٦٠، و٥٪ هي ١٠. والمجموع ٧٠.']],
    g: function (r, lv) {
      var T0 = r.pick(lv === 1 ? [40, 60, 80, 120, 200, 300] : [80, 120, 160, 240, 320, 400, 640, 800]), t1 = T0 / 10, p = r.pick(lv === 1 ? [10, 20, 30, 40] : [15, 35, 45, 60, 75]), ans = T0 * p / 100, tens = Math.floor(p / 10), five = p % 10 === 5;
      var st = [['10% first', '١٠٪ أولًا', T0 + ' ÷ 10 =', t1]]; if (tens !== 1) st.push(['Build ' + (tens * 10) + '%', 'كوّن ' + (tens * 10) + '٪', t1 + ' × ' + tens + ' =', t1 * tens]); if (five) { st.push(['5% is half of 10%', '٥٪ نصف ١٠٪', t1 + ' ÷ 2 =', t1 / 2]); st.push(['Add', 'اجمع', (t1 * tens) + ' + ' + (t1 / 2) + ' =', ans]); }
      var q = lv === 3 ? ['A shirt costs ' + T0 + '. There is ' + p + '% off. How much do you pay?', 'قميص سعره ' + T0 + ' وعليه تخفيض ' + p + '٪. كم تدفع؟'] : ['Find the percent.', 'أوجد النسبة.'];
      if (lv === 3) { st.push(['Take it off the price', 'اطرحه من السعر', T0 + ' − ' + ans + ' =', T0 - ans]); return { q: q, a: T0 - ans, s: st, miss: [[ans, 'That is the discount. You pay what is left.', 'هذا التخفيض. أنت تدفع الباقي.']] }; }
      return { q: q, eq: p + '% × ' + T0, a: ans, s: st, miss: [[T0 - ans, 'That is what is left. Give the ' + p + '% itself.', 'هذا الباقي. أعط ' + p + '٪ نفسها.'], [dp(T0 / p, 4), 'You divided by ' + p + '. Percent means out of 100.', 'قسمت على ' + p + '. النسبة تعني من ١٠٠.']] };
    },
    trap: function (r) { var T0 = r.pick([80, 120, 200, 300]); return { eq: '20% × ' + T0, w: 0, why: ['20% is 2 × 10% = ' + (T0 / 5) + ', not ' + T0 + ' ÷ 20.', '٢٠٪ هي ٢ × ١٠٪ = ' + (T0 / 5) + '، لا ' + T0 + ' ÷ ٢٠.'], l: [['Divide by 20: ' + T0 + ' ÷ 20 = ' + (T0 / 20), 'اقسم على ٢٠: ' + T0 + ' ÷ 20 = ' + (T0 / 20)], 'Answer: ' + (T0 / 20), ['Percent means out of 100', 'النسبة من ١٠٠']] }; },
    explain: [['Why is finding 10% so useful?', 'لماذا إيجاد ١٠٪ مفيد جدًا؟'], ['It is easy to find, and other percents build from it.', 'سهل الإيجاد، وتُبنى منه النسب الأخرى.'], ['10% is the only percent that exists.', '١٠٪ هي النسبة الوحيدة.'], ['Because calculators require it.', 'لأن الآلة الحاسبة تتطلبه.']]
  });

  teach('m6.negop', {
    why: ['Temperatures below zero, floors below ground and money owed all need negative numbers.', 'الحرارة تحت الصفر والأدوار تحت الأرض والديون كلها تحتاج إلى الأعداد السالبة.'],
    idea: [{ p: ['On a number line, adding moves right and taking away moves left. −3 + 5 starts at −3 and goes 5 right: 2.', 'على خط الأعداد، الجمع يمينًا والطرح يسارًا. −٣ + ٥ تبدأ من −٣ وتتحرك ٥ يمينًا: ٢.'], dia: function () { return D.line({ min: -5, max: 5, marks: { '-3': '−3', '2': '2' }, hops: [[-3, 2]] }); } }, ['Taking away a negative is adding: 4 − (−2) = 6.', 'طرح السالب جمع: ٤ − (−٢) = ٦.']],
    g: function (r, lv) {
      var a = r.int(-9, 9) || 2, b = r.int(2, 9), line = function (x, y) { return D.line({ min: Math.min(-10, x, y), max: Math.max(10, x, y), every: 5, marks: (function () { var o = {}; o[x] = mn(x); return o; })(), hops: [[x, y]] }); };
      if (lv === 1) { var st = a < 0 ? a : -a, ans = st + b; return { q: ['Move along the number line.', 'تحرك على خط الأعداد.'], eq: mn(st) + ' + ' + b, a: ans, dia: line(st, ans), s: [['Start at ' + mn(st) + ', go ' + b + ' right', 'ابدأ من ' + mn(st) + ' وتحرك ' + b + ' يمينًا', mn(st) + ' + ' + b + ' =', mn(ans)]], miss: [[st - b, 'Adding moves right, towards the bigger numbers.', 'الجمع يمينًا نحو الأعداد الأكبر.'], [Math.abs(st) + b, 'You ignored the minus sign on ' + mn(st) + '.', 'أهملت إشارة السالب في ' + mn(st) + '.']] }; }
      if (lv === 2) { var x = r.int(-6, 8), y = r.int(2, 9); return { q: ['Work it out.', 'احسب.'], eq: mn(x) + ' − ' + y, a: x - y, dia: line(x, x - y), s: [['Taking away moves left', 'الطرح يسارًا', mn(x) + ' − ' + y + ' =', mn(x - y)]], miss: [[x + y, 'Taking away moves left, not right.', 'الطرح يسارًا لا يمينًا.'], [y - x, 'Order matters: start at ' + mn(x) + '.', 'الترتيب مهم: ابدأ من ' + mn(x) + '.']] }; }
      var t0 = r.int(-8, -1), up = r.int(4, 14);
      if (r.bool()) return { q: ['It is ' + mn(t0) + '°C at dawn. By noon it has risen ' + up + ' degrees. What is the temperature at noon?', 'الحرارة ' + mn(t0) + '° عند الفجر، وارتفعت ' + up + ' درجة عند الظهر. كم تصبح؟'], eq: mn(t0) + ' + ' + up, a: t0 + up, s: [['Rising means adding', 'الارتفاع جمع', mn(t0) + ' + ' + up + ' =', mn(t0 + up)]], miss: [[t0 - up, 'Rising moves up the scale, not down.', 'الارتفاع إلى الأعلى لا الأسفل.']] };
      var n1 = r.int(2, 9), n2 = r.int(2, 9);
      return { q: ['Taking away a negative. Work it out.', 'طرح عدد سالب. احسب.'], eq: n1 + ' − (−' + n2 + ')', a: n1 + n2, s: [['Taking away a negative is adding', 'طرح السالب جمع', n1 + ' + ' + n2 + ' =', n1 + n2]], miss: [[n1 - n2, 'Two minus signs together make adding.', 'إشارتا سالب معًا جمع.']] };
    },
    trap: function (r) { var a = r.int(2, 6), b = a + r.int(1, 4); return { eq: '−' + a + ' + ' + b, w: 0, why: ['Start at −' + a + ' and go ' + b + ' right: ' + (b - a) + '.', 'ابدأ من −' + a + ' وتحرك ' + b + ' يمينًا: ' + (b - a) + '.'], l: ['−' + a + ' + ' + b + ' = −' + (a + b), 'Answer: −' + (a + b)] }; },
    explain: [['Why is −8 smaller than −2?', 'لماذا −٨ أصغر من −٢؟'], ['It is further below zero, like a colder temperature.', 'هو أبعد تحت الصفر، كحرارة أشد برودة.'], ['Because 8 is bigger than 2.', 'لأن ٨ أكبر من ٢.'], ['It is not. −8 is bigger.', 'ليس كذلك. −٨ أكبر.']]
  });

  teach('m6.fmul', {
    why: ['Half of three quarters of a recipe: that is multiplying fractions.', 'نصف ثلاثة أرباع الوصفة: هذا ضرب الكسور.'],
    idea: [{ p: ['Multiply tops. Multiply bottoms. 1/2 × 3/4 = 3/8.', 'اضرب البسطين واضرب المقامين. ١/٢ × ٣/٤ = ٣/٨.'], dia: function () { return D.frac([[3, 4], [3, 8]]); } }, ['"of" means multiply. Half of 3/4 is 1/2 × 3/4. The answer is smaller, because you took a part of a part.', '«من» تعني الضرب. نصف ٣/٤ هو ١/٢ × ٣/٤. والناتج أصغر لأنك أخذت جزءًا من جزء.']],
    g: function (r, lv) {
      var a = r.int(1, 4), b = r.int(a + 1, 6), c = r.int(1, 4), d = r.int(c + 1, 8), T0 = a * c, B = b * d, ans = low(T0, B);
      var q = lv === 3 ? ['You have ' + c + '/' + d + ' of a loaf and eat ' + a + '/' + b + ' of that. What fraction of the whole loaf did you eat? Give it in simplest form.', 'لديك ' + c + '/' + d + ' من الرغيف وأكلت ' + a + '/' + b + ' منها. ما الكسر الذي أكلته من الرغيف كله؟ أعطه في أبسط صورة.'] : ['Multiply. Give the simplest form.', 'اضرب. أعط أبسط صورة.'];
      var st = [['Multiply the tops', 'اضرب البسطين', a + ' × ' + c + ' =', T0], ['Multiply the bottoms', 'اضرب المقامين', b + ' × ' + d + ' =', B]]; if (gcd(T0, B) > 1) st.push(['Simplify', 'بسّط', T0 + '/' + B + ' =', ans]); else st.push(['Write the answer', 'اكتب الناتج', 'Answer:', ans]);
      return { q: q, eq: a + '/' + b + ' × ' + c + '/' + d, a: ans, s: st, miss: [[low(a * d + c * b, b * d), 'You added. Multiplying fractions is simpler: tops, then bottoms.', 'جمعت. ضرب الكسور أبسط: البسطان ثم المقامان.'], [low(T0, b + d), 'Multiply the bottoms too, do not add them.', 'اضرب المقامين أيضًا ولا تجمعهما.']] };
    },
    trap: function (r) { var d = r.pick([3, 5, 7]); return { eq: '1/2 × 1/' + d, w: 1, why: ['Multiply the bottoms: 2 × ' + d + ' = ' + (2 * d) + '.', 'اضرب المقامين: ٢ × ' + d + ' = ' + (2 * d) + '.'], l: ['1 × 1 = 1', ['Add bottoms: 2 + ' + d + ' = ' + (2 + d), 'اجمع المقامين: 2 + ' + d + ' = ' + (2 + d)], 'Answer: 1/' + (2 + d)] }; },
    explain: [['Why is 1/2 × 3/4 smaller than 3/4?', 'لماذا ١/٢ × ٣/٤ أصغر من ٣/٤؟'], ['You are taking half of it. A part of a part is smaller.', 'تأخذ نصفه. وجزء الجزء أصغر.'], ['Multiplying always makes things smaller.', 'الضرب دائمًا يصغّر.'], ['Because 2 is less than 4.', 'لأن ٢ أقل من ٤.']]
  });

  teach('m6.fadd', {
    why: ['A third of a tank plus a quarter of a tank: different-sized pieces need the same name before they can be added.', 'ثلث خزان وربعه: القطع المختلفة تحتاج إلى اسم واحد قبل جمعها.'],
    idea: [{ p: ['Find a common bottom, rewrite both fractions, then add the tops. 1/3 + 1/4 = 4/12 + 3/12 = 7/12.', 'أوجد مقامًا مشتركًا، وأعد كتابة الكسرين، ثم اجمع البسطين. ١/٣ + ١/٤ = ٤/١٢ + ٣/١٢ = ٧/١٢.'], dia: function () { return D.frac([[4, 12], [3, 12], [7, 12]]); } }],
    g: function (r, lv) {
      var ps = lv === 1 ? [[2, 4], [2, 6], [3, 6], [2, 8], [4, 8]] : [[2, 3], [3, 4], [3, 5], [2, 5], [4, 5], [4, 6], [6, 8]], p = r.pick(ps), b = p[0], d = p[1], L = TM.lcm(b, d), a = r.int(1, b - 1), c = r.int(1, d - 1), A = a * L / b, Cc = c * L / d, sum = A + Cc, ans = low(sum, L), minus = lv === 3 && A > Cc;
      if (minus) { var df = A - Cc, ansM = low(df, L); return { q: ['You have ' + a + '/' + b + ' of a bottle and pour away ' + c + '/' + d + '. How much is left? Give the simplest form.', 'لديك ' + a + '/' + b + ' من زجاجة وسكبت ' + c + '/' + d + '. كم يبقى؟ أعط أبسط صورة.'], eq: a + '/' + b + ' − ' + c + '/' + d, a: ansM, s: [['Common bottom', 'مقام مشترك', 'Bottom:', L], ['Rewrite the first', 'أعد كتابة الأول', a + ' × ' + (L / b) + ' =', A], ['Rewrite the second', 'أعد كتابة الثاني', c + ' × ' + (L / d) + ' =', Cc], ['Take away the tops', 'اطرح البسطين', A + ' − ' + Cc + ' =', df], ['Answer over ' + L, 'الناتج على ' + L, 'Answer:', ansM]] }; }
      return { q: ['Add. Give the simplest form.', 'اجمع. أعط أبسط صورة.'], eq: a + '/' + b + ' + ' + c + '/' + d, a: ans, s: [['Common bottom', 'مقام مشترك', 'Bottom:', L], ['Rewrite the first', 'أعد كتابة الأول', a + ' × ' + (L / b) + ' =', A], ['Rewrite the second', 'أعد كتابة الثاني', c + ' × ' + (L / d) + ' =', Cc], ['Add the tops', 'اجمع البسطين', A + ' + ' + Cc + ' =', sum], ['Answer over ' + L, 'الناتج على ' + L, 'Answer:', ans]], miss: [[low(a + c, b + d), 'You added tops and bottoms. First make the pieces the same size.', 'جمعت البسطين والمقامين. وحّد حجم القطع أولًا.']] };
    },
    trap: function (r) { return { eq: '1/3 + 1/4', w: 0, why: ['You cannot add different-sized parts straight away. Use twelfths.', 'لا تُجمع أجزاء مختلفة الحجم مباشرة. استخدم الأجزاء من ١٢.'], l: ['1/3 + 1/4 = 2/7', 'Answer: 2/7', ['But 2/7 is less than 1/3!', 'لكن ٢/٧ أقل من ١/٣!']] }; },
    explain: [['Why is 1/3 + 1/4 not 2/7?', 'لماذا ١/٣ + ١/٤ ليست ٢/٧؟'], ['2/7 is less than 1/3, so adding could not give it. The pieces must match first.', '٢/٧ أقل من ١/٣ فلا يمكن أن يكون ناتج جمع. وحّد القطع أولًا.'], ['Because 7 is prime.', 'لأن ٧ عدد أولي.'], ['It is 2/7.', 'بل هي ٢/٧.']]
  });

  /* ---------- maths in the real world ---------- */
  teach('m6.speed', {
    why: ['When will the bus arrive? How long is the journey to the masjid? Speed, distance and time answer it.', 'متى تصل الحافلة؟ وكم تستغرق الرحلة إلى المسجد؟ السرعة والمسافة والزمن تجيب.'],
    idea: [['Distance = speed × time. So speed = distance ÷ time, and time = distance ÷ speed.', 'المسافة = السرعة × الزمن. فالسرعة = المسافة ÷ الزمن، والزمن = المسافة ÷ السرعة.'], ['60 km/h for 3 hours covers 180 km. Keep the units matching: km with hours.', '٦٠ كم/س لمدة ٣ ساعات تقطع ١٨٠ كم. وحّد الوحدات: كيلومتر مع ساعات.']],
    g: function (r, lv) {
      var v = r.pick([30, 40, 50, 60, 70, 80, 90]), t = r.int(2, 6), d = v * t, kind = lv === 1 ? 0 : r.int(0, 2);
      if (lv === 3) { var half = v * t + v / 2; return { q: ['A train travels at ' + v + ' km/h for ' + t + ' and a half hours. How far does it go, in km?', 'يسير قطار بسرعة ' + v + ' كم/س مدة ' + t + ' ساعات ونصف. كم يقطع بالكيلومتر؟'], eq: v + ' × ' + (t + .5), a: half, s: [['Whole hours', 'الساعات الكاملة', v + ' × ' + t + ' =', d], ['Half an hour more', 'ونصف ساعة', v + ' ÷ 2 =', v / 2], ['Add', 'اجمع', d + ' + ' + (v / 2) + ' =', half]], miss: [[d, 'That leaves out the half hour.', 'أهملت نصف الساعة.']] }; }
      if (kind === 0) return { q: ['A car goes at ' + v + ' km/h for ' + t + ' hours. How far, in km?', 'تسير سيارة بسرعة ' + v + ' كم/س مدة ' + t + ' ساعات. كم تقطع؟'], eq: v + ' × ' + t, a: d, s: [['Speed × time', 'السرعة × الزمن', v + ' × ' + t + ' =', d]], miss: [[v + t, 'You added. Each hour covers ' + v + ' km.', 'جمعت. كل ساعة تقطع ' + v + ' كم.']] };
      if (kind === 1) return { q: ['A car covers ' + d + ' km in ' + t + ' hours. What is its speed, in km/h?', 'تقطع سيارة ' + d + ' كم في ' + t + ' ساعات. كم سرعتها؟'], eq: d + ' ÷ ' + t, a: v, s: [['Distance ÷ time', 'المسافة ÷ الزمن', d + ' ÷ ' + t + ' =', v]], miss: [[d * t, 'Divide, do not multiply: how much for each hour?', 'اقسم ولا تضرب: كم في كل ساعة؟']] };
      return { q: ['How long does ' + d + ' km take at ' + v + ' km/h, in hours?', 'كم يستغرق قطع ' + d + ' كم بسرعة ' + v + ' كم/س بالساعات؟'], eq: d + ' ÷ ' + v, a: t, s: [['Distance ÷ speed', 'المسافة ÷ السرعة', d + ' ÷ ' + v + ' =', t]] };
    },
    trap: function (r) { var v = r.pick([40, 50, 60]), t = r.int(2, 5); return { w: 0, q: ['A car goes ' + (v * t) + ' km in ' + t + ' hours. One line is wrong. Tap it.', 'تقطع سيارة ' + (v * t) + ' كم في ' + t + ' ساعات. سطر واحد خاطئ. انقر عليه.'], why: ['Speed is distance ÷ time, so ' + (v * t) + ' ÷ ' + t + ' = ' + v + '.', 'السرعة = المسافة ÷ الزمن، أي ' + (v * t) + ' ÷ ' + t + ' = ' + v + '.'], l: [['Speed: ' + (v * t) + ' × ' + t + ' = ' + (v * t * t), 'السرعة: ' + (v * t) + ' × ' + t + ' = ' + (v * t * t)], ['So the car is very fast', 'فالسيارة سريعة جدًا'], ['And km/h is the unit', 'والوحدة كم/س']] }; },
    explain: [['What does 60 km/h really mean?', 'ماذا تعني ٦٠ كم/س حقًا؟'], ['In each hour, at that pace, you cover 60 km.', 'في كل ساعة بهذه الوتيرة تقطع ٦٠ كم.'], ['You travel for 60 hours.', 'تسافر ٦٠ ساعة.'], ['The journey is 60 km long.', 'طول الرحلة ٦٠ كم.']]
  });

  teach('m6.profit', { keep: true,
    g: function (r, lv) {
      var c = r.int(4, 40) * 5, up = r.pick(lv === 1 ? [10, 20, 50] : [15, 25, 30, 40]), pr = c * up / 100;
      if (lv === 1) { var s0 = c + r.int(2, 30); return { q: ['Bought for ' + c + ', sold for ' + s0 + '. What is the profit?', 'اشتُري بـ ' + c + ' وبيع بـ ' + s0 + '. كم الربح؟'], eq: s0 + ' − ' + c, a: s0 - c, s: [['Selling price − cost', 'سعر البيع − التكلفة', s0 + ' − ' + c + ' =', s0 - c]], miss: [[s0 + c, 'You added. Profit is what is left after the cost.', 'جمعت. الربح ما يبقى بعد التكلفة.']] }; }
      if (lv === 2) return { q: ['Bought for ' + c + ' and sold with a ' + up + '% profit. How much is the profit?', 'اشتُري بـ ' + c + ' وبيع بربح ' + up + '٪. كم الربح؟'], eq: up + '% × ' + c, a: pr, s: [['Percent of the cost', 'نسبة من التكلفة', c + ' × ' + up + ' ÷ 100 =', pr]], miss: [[c + pr, 'That is the selling price. The question asks for the profit.', 'هذا سعر البيع. السؤال عن الربح.']] };
      return { q: ['Bought for ' + c + ' and sold with a ' + up + '% profit. What is the selling price?', 'اشتُري بـ ' + c + ' وبيع بربح ' + up + '٪. كم سعر البيع؟'], a: c + pr, s: [['The profit', 'الربح', c + ' × ' + up + ' ÷ 100 =', pr], ['Cost + profit', 'التكلفة + الربح', c + ' + ' + pr + ' =', c + pr]], miss: [[pr, 'That is the profit alone. Add the cost.', 'هذا الربح وحده. أضف التكلفة.']] };
    },
    trap: function (r) { var c = r.pick([100, 200, 400]); return { eq: '25% × ' + c, w: 0, why: ['25% of ' + c + ' is ' + (c / 4) + ', not ' + c + ' ÷ 25.', '٢٥٪ من ' + c + ' هي ' + (c / 4) + '، لا ' + c + ' ÷ ٢٥.'], l: [['Divide by 25: ' + c + ' ÷ 25 = ' + (c / 25), 'اقسم على ٢٥: ' + c + ' ÷ 25 = ' + (c / 25)], c + ' + ' + (c / 25) + ' = ' + (c + c / 25)] }; },
    explain: [['A trader buys for 100 and sells for 80. What happened?', 'اشترى تاجر بـ ١٠٠ وباع بـ ٨٠. ماذا حدث؟'], ['A loss of 20, which is 20% of what was paid.', 'خسارة ٢٠، أي ٢٠٪ مما دفع.'], ['A profit of 20.', 'ربح ٢٠.'], ['A profit of 80.', 'ربح ٨٠.']]
  });

  teach('m6.tri', {
    why: ['Roofs, sails and plots of land are triangles. To paint or buy one, you need its area.', 'الأسقف والأشرعة وقطع الأرض مثلثات، ولطلائها أو شرائها تحتاج إلى مساحتها.'],
    idea: [{ p: ['A triangle is half of a rectangle with the same base and height. Area = base × height ÷ 2.', 'المثلث نصف مستطيل له القاعدة والارتفاع نفسهما. المساحة = القاعدة × الارتفاع ÷ ٢.'], dia: function () { return D.tri({ right: 0, sides: ['8', null, '6'] }); } }, ['The height is straight up from the base, at a right angle, not along a slanted side.', 'الارتفاع عمودي على القاعدة وليس على الضلع المائل.']],
    g: function (r, lv) {
      var b = r.int(2, lv === 1 ? 10 : 18) * 2, h = r.int(2, 12), A0 = b * h / 2;
      if (lv === 3) return { q: ['A triangular sail has an area of ' + A0 + ' m² and a base of ' + b + ' m. How tall is it, in m?', 'مساحة شراع مثلث ' + A0 + ' م² وقاعدته ' + b + ' م. كم ارتفاعه؟'], eq: b + ' × ? ÷ 2 = ' + A0, a: h, dia: D.tri({ right: 0, sides: [b, null, '?'] }), s: [['Undo the halving', 'اعكس القسمة على ٢', A0 + ' × 2 =', 2 * A0], ['Undo the base', 'اعكس القاعدة', (2 * A0) + ' ÷ ' + b + ' =', h]], miss: [[dp(A0 / b), 'You forgot the halving: double the area first.', 'نسيت القسمة على ٢: ضاعف المساحة أولًا.']] };
      return { q: ['Find the area, in cm².', 'أوجد المساحة بالسنتيمتر المربع.'], dia: D.tri({ right: 0, sides: [b, null, h] }), eq: b + ' × ' + h + ' ÷ 2', a: A0, s: [['The whole rectangle', 'المستطيل كله', b + ' × ' + h + ' =', b * h], ['Half of it', 'نصفه', (b * h) + ' ÷ 2 =', A0]], miss: [[b * h, 'That is the rectangle. A triangle is half of it.', 'هذا المستطيل. المثلث نصفه.'], [b + h, 'You added. Area is multiplying.', 'جمعت. المساحة ضرب.']] };
    },
    trap: function (r) { var b = r.int(3, 9) * 2, h = r.int(3, 9); return { eq: b + ' × ' + h + ' ÷ 2', w: 1, why: ['Halve the rectangle: ' + (b * h) + ' ÷ 2 = ' + (b * h / 2) + '.', 'نصّف المستطيل: ' + (b * h) + ' ÷ ٢ = ' + (b * h / 2) + '.'], l: [b + ' × ' + h + ' = ' + (b * h), (b * h) + ' ÷ 2 = ' + (b * h), 'Area: ' + (b * h)] }; },
    explain: [['Why do we halve?', 'لماذا نقسم على ٢؟'], ['Two identical triangles fit together to make the rectangle.', 'مثلثان متطابقان يشكلان المستطيل.'], ['Because a triangle has 3 sides.', 'لأن للمثلث ٣ أضلاع.'], ['Because the formula looks better.', 'لأن الصيغة تبدو أفضل.']]
  });

  teach('m6.tri180', {
    why: ['Knowing two angles of a triangle gives you the third. Surveyors measure land this way.', 'معرفة زاويتين من مثلث تعطيك الثالثة. هكذا يقيس المسّاحون الأرض.'],
    idea: [{ p: ['The three angles of any triangle add to 180°. Tear off the corners and they make a straight line.', 'زوايا أي مثلث الثلاث مجموعها ١٨٠°. مزّق الأركان فتصنع خطًا مستقيمًا.'], dia: function () { return D.tri({ angles: ['50°', '60°', '70°'] }); } }, ['An isosceles triangle has two equal sides and two equal angles.', 'المثلث متساوي الساقين له ضلعان متساويان وزاويتان متساويتان.']],
    g: function (r, lv) {
      var a = r.int(25, 80), b = r.int(25, 80), c = 180 - a - b;
      if (lv === 1) return { q: ['Find the missing angle, in degrees.', 'أوجد الزاوية الناقصة بالدرجات.'], dia: D.tri({ angles: [a + '°', b + '°', '?'] }), a: c, s: [['Add the two you know', 'اجمع المعلومتين', a + ' + ' + b + ' =', a + b], ['Take from 180', 'اطرح من ١٨٠', '180 − ' + (a + b) + ' =', c]], miss: [[360 - a - b, 'A triangle adds to 180°, not 360°.', 'مجموع زوايا المثلث ١٨٠° لا ٣٦٠°.'], [a + b, 'That is the two added. Now take from 180.', 'هذا مجموع الزاويتين. اطرحه من ١٨٠.']] };
      if (lv === 2) { var top = r.int(2, 8) * 10 + (r.bool() ? 0 : 20), base = (180 - top) / 2; return { q: ['Isosceles triangle: the top angle is ' + top + '°. Find one base angle, in degrees.', 'مثلث متساوي الساقين: زاوية الرأس ' + top + '°. أوجد إحدى زاويتي القاعدة.'], dia: D.tri({ pts: [[60, 150], [260, 150], [160, 26]], angles: ['?', '?', top + '°'] }), a: base, s: [['What the two base angles share', 'نصيب زاويتي القاعدة', '180 − ' + top + ' =', 180 - top], ['They are equal, so halve', 'متساويتان فنصّف', (180 - top) + ' ÷ 2 =', base]], miss: [[180 - top, 'That is both base angles together. Halve it.', 'هذا مجموع الزاويتين. نصّفه.']] }; }
      var x = r.int(20, 50); return { q: ['A right-angled triangle has one other angle of ' + x + '°. Find the third, in degrees.', 'مثلث قائم فيه زاوية أخرى ' + x + '°. أوجد الثالثة.'], dia: D.tri({ right: 0, angles: [null, x + '°', '?'] }), a: 90 - x, s: [['The right angle takes 90°', 'الزاوية القائمة ٩٠°', '180 − 90 =', 90], ['The rest', 'الباقي', '90 − ' + x + ' =', 90 - x]], miss: [[180 - x, 'Remember the right angle has used 90° already.', 'تذكر أن القائمة أخذت ٩٠°.']] };
    },
    trap: function (r) { var a = r.int(30, 70), b = r.int(30, 60); return { eq: a + '° + ' + b + '°', w: 1, why: ['A triangle totals 180°: 180 − ' + (a + b) + ' = ' + (180 - a - b) + '.', 'مجموع المثلث ١٨٠°: ١٨٠ − ' + (a + b) + ' = ' + (180 - a - b) + '.'], l: [a + ' + ' + b + ' = ' + (a + b), ['Take from 360: 360 − ' + (a + b) + ' = ' + (360 - a - b), 'اطرح من ٣٦٠: 360 − ' + (a + b) + ' = ' + (360 - a - b)], 'Angle: ' + (360 - a - b)] }; },
    explain: [['Could a triangle have two right angles?', 'هل يمكن لمثلث أن يكون فيه زاويتان قائمتان؟'], ['No. They would use all 180°, leaving nothing for the third corner.', 'لا. ستأخذان ١٨٠° كلها ولا يبقى للركن الثالث شيء.'], ['Yes, if it is large enough.', 'نعم إذا كان كبيرًا.'], ['Yes, squares are made of them.', 'نعم، منها تتكون المربعات.']]
  });

  teach('m6.circle', {
    why: ['Wheels, domes and the wells of old cities: every circle holds the same number.', 'العجلات والقباب وآبار المدن القديمة: في كل دائرة العدد نفسه.'],
    idea: [{ p: ['The distance round a circle is about 3.14 times the distance across. That number is π.', 'المسافة حول الدائرة نحو ٣٫١٤ ضعف المسافة عبرها. هذا العدد هو π.'], dia: function () { return D.circle({ d: 'd' }); } }, ['Circumference = π × diameter. The diameter is twice the radius.', 'المحيط = π × القطر. والقطر ضعف نصف القطر.']],
    g: function (r, lv) {
      var d = r.int(2, 20), pi = 3.14, C0 = dp(pi * d, 2);
      if (lv === 1) { var rr = r.int(2, 30); return { q: ['The radius is ' + rr + ' cm. What is the diameter, in cm?', 'نصف القطر ' + rr + ' سم. كم القطر؟'], dia: D.circle({ r: rr }), a: 2 * rr, s: [['Twice the radius', 'ضعف نصف القطر', rr + ' × 2 =', 2 * rr]], miss: [[rr / 2, 'The diameter is the longer one: all the way across.', 'القطر هو الأطول: عبر الدائرة كلها.']] }; }
      if (lv === 2) return { q: ['Use π = 3.14. Find the circumference when the diameter is ' + d + ' cm.', 'استخدم π = ٣٫١٤. أوجد المحيط إذا كان القطر ' + d + ' سم.'], eq: '3.14 × ' + d, dia: D.circle({ d: d }), a: C0, s: [['π × diameter', 'π × القطر', '3.14 × ' + d + ' =', C0]], miss: [[dp(pi * d * 2, 2), 'That uses twice the diameter. Circumference is π × d.', 'هذا ضعف القطر. المحيط π × القطر.']] };
      var rr2 = r.int(2, 15), c2 = dp(2 * pi * rr2, 2);
      return { q: ['A wheel has a radius of ' + rr2 + ' cm. How far does it roll in one turn, in cm? Use π = 3.14.', 'نصف قطر عجلة ' + rr2 + ' سم. كم تسير في دورة واحدة؟ استخدم π = ٣٫١٤.'], dia: D.circle({ r: rr2 }), a: c2, s: [['Diameter first', 'القطر أولًا', rr2 + ' × 2 =', 2 * rr2], ['π × diameter', 'π × القطر', '3.14 × ' + (2 * rr2) + ' =', c2]], miss: [[dp(pi * rr2, 2), 'That used the radius. Use the full diameter.', 'استخدمت نصف القطر. استخدم القطر كله.']] };
    },
    trap: function (r) { var rr = r.int(3, 9); return { w: 0, why: ['The diameter is twice the radius, not half.', 'القطر ضعف نصف القطر لا نصفه.'], eq: 'r = ' + rr, l: [['Halve it: d = ' + rr + ' ÷ 2 = ' + dp(rr / 2), 'نصّفه: d = ' + rr + ' ÷ 2 = ' + dp(rr / 2)], 'Circumference: 3.14 × d', ['Roll it to check', 'دحرجها لتتحقق']] }; },
    explain: [['What is special about π?', 'ما المميز في π؟'], ['For every circle, of any size, round ÷ across gives the same number.', 'في كل دائرة، مهما كان حجمها، المحيط ÷ القطر يعطي العدد نفسه.'], ['It only works for big circles.', 'يصح في الدوائر الكبيرة فقط.'], ['It is exactly 3.', 'هو ٣ تمامًا.']]
  });

  teach('m6.scale', {
    why: ['A map shrinks the world so it fits your hands. Scale turns centimetres back into real distance.', 'الخريطة تصغّر العالم ليسعه كفّاك، والمقياس يعيد السنتيمترات إلى مسافات حقيقية.'],
    idea: [['1 cm : 5 km means every centimetre on the map is 5 km on the ground.', '١ سم : ٥ كم تعني أن كل سنتيمتر على الخريطة ٥ كم على الأرض.'], ['Multiply to go from map to real. Divide to go from real to map.', 'اضرب للانتقال من الخريطة إلى الواقع، واقسم للعكس.']],
    g: function (r, lv) {
      var sc = r.pick([2, 5, 10, 20, 25]), cm = r.int(2, 12);
      if (lv === 1) return { q: ['Scale 1 cm : ' + sc + ' km. The map shows ' + cm + ' cm. How far is it really, in km?', 'المقياس ١ سم : ' + sc + ' كم. على الخريطة ' + cm + ' سم. كم المسافة الحقيقية؟'], eq: cm + ' × ' + sc, a: cm * sc, s: [['Each cm is ' + sc + ' km', 'كل سم ' + sc + ' كم', cm + ' × ' + sc + ' =', cm * sc]], miss: [[cm + sc, 'You added. Each cm is a whole ' + sc + ' km.', 'جمعت. كل سم يمثل ' + sc + ' كم.']] };
      if (lv === 2) return { q: ['Scale 1 cm : ' + sc + ' km. A road is really ' + (cm * sc) + ' km. How long on the map, in cm?', 'المقياس ١ سم : ' + sc + ' كم. طول طريق ' + (cm * sc) + ' كم. كم طوله على الخريطة؟'], eq: (cm * sc) + ' ÷ ' + sc, a: cm, s: [['How many ' + sc + 's?', 'كم ' + sc + '؟', (cm * sc) + ' ÷ ' + sc + ' =', cm]], miss: [[cm * sc * sc, 'Maps shrink things. Divide.', 'الخرائط تصغّر. اقسم.']] };
      var half = cm + .5, real = half * sc; return { q: ['Scale 1 cm : ' + sc + ' km. Two towns are ' + half + ' cm apart on the map. How far really, in km?', 'المقياس ١ سم : ' + sc + ' كم. بين مدينتين ' + half + ' سم على الخريطة. كم المسافة الحقيقية؟'], eq: half + ' × ' + sc, a: real, s: [['Multiply by the scale', 'اضرب في المقياس', half + ' × ' + sc + ' =', real]] };
    },
    trap: function (r) { var sc = r.pick([5, 10]), cm = r.int(3, 8); return { w: 0, q: ['Scale 1 cm : ' + sc + ' km, map distance ' + cm + ' cm. One line is wrong. Tap it.', 'المقياس ١ سم : ' + sc + ' كم، والمسافة ' + cm + ' سم. سطر واحد خاطئ. انقر عليه.'], why: ['Real distances are bigger: multiply, ' + cm + ' × ' + sc + ' = ' + (cm * sc) + '.', 'المسافة الحقيقية أكبر: اضرب، ' + cm + ' × ' + sc + ' = ' + (cm * sc) + '.'], l: [['Divide: ' + cm + ' ÷ ' + sc + ' = ' + dp(cm / sc, 2), 'اقسم: ' + cm + ' ÷ ' + sc + ' = ' + dp(cm / sc, 2)], ['So the road is short', 'فالطريق قصير'], ['Check against the map', 'راجع الخريطة']] }; },
    explain: [['Which map shows more detail: 1 cm : 1 km or 1 cm : 100 km?', 'أي خريطة أكثر تفصيلًا: ١ سم : ١ كم أم ١ سم : ١٠٠ كم؟'], ['1 cm : 1 km. Each centimetre covers less ground, so more fits in.', '١ سم : ١ كم. كل سم يغطي أرضًا أقل فتظهر تفاصيل أكثر.'], ['1 cm : 100 km, because 100 is bigger.', '١ سم : ١٠٠ كم لأن ١٠٠ أكبر.'], ['They are the same.', 'متساويتان.']]
  });

  teach('m6.chance', {
    why: ['Weather forecasts, medicine trials and fair games all speak the language of chance.', 'توقعات الطقس وتجارب الأدوية والألعاب العادلة كلها تتحدث لغة الاحتمال.'],
    idea: [{ p: ['Chance runs from 0 (impossible) to 1 (certain). A fair coin landing heads is 1/2.', 'الاحتمال من ٠ (مستحيل) إلى ١ (مؤكد). وجه العملة العادلة ١/٢.'], dia: function () { return D.line({ min: 0, max: 1, step: .25, every: 1, marks: { '0.5': '1/2' } }); } }, ['Chance = ways you want ÷ all the ways.', 'الاحتمال = الطرق المطلوبة ÷ كل الطرق.']],
    g: function (r, lv) {
      if (lv === 1) { var pool = [[['The sun rises tomorrow', 'تشرق الشمس غدًا'], ['Certain', 'مؤكد']], [['A fair coin lands heads', 'تسقط العملة العادلة على وجهها'], ['Even', 'متساوٍ']], [['A person walks to the moon', 'يمشي إنسان إلى القمر'], ['Impossible', 'مستحيل']]], x = r.pick(pool); return { q: ['How likely? ' + x[0][0] + '.', 'ما مدى احتمال: ' + x[0][1] + '؟'], o: [x[1]].concat(pool.filter(function (y) { return y !== x; }).map(function (y) { return y[1]; })), s: [['Think where it sits from 0 to 1', 'فكّر أين يقع بين ٠ و١', ['From impossible to certain', 'من مستحيل إلى مؤكد']]] }; }
      var red = r.int(1, 8), blue = r.int(1, 8), tot = red + blue, ans = low(red, tot);
      var q = lv === 3 ? ['A bag has ' + red + ' red and ' + blue + ' blue beads. What is the chance of NOT drawing blue? Give the simplest form.', 'في كيس ' + red + ' خرزات حمراء و' + blue + ' زرقاء. ما احتمال عدم سحب زرقاء؟ أعط أبسط صورة.'] : ['A bag has ' + red + ' red and ' + blue + ' blue beads. What is the chance of red? Give the simplest form.', 'في كيس ' + red + ' خرزات حمراء و' + blue + ' زرقاء. ما احتمال الأحمر؟ أعط أبسط صورة.'];
      if (red === blue && lv === 2) { return { q: q, a: '1/2', s: [['All the beads', 'كل الخرزات', red + ' + ' + blue + ' =', tot], ['Red over all', 'الأحمر على الكل', red + '/' + tot + ' =', '1/2']] }; }
      return { q: q, a: ans, s: [['All the beads', 'كل الخرزات', red + ' + ' + blue + ' =', tot], ['Ways you want, over all', 'المطلوب على الكل', red + '/' + tot + ' =', ans]], miss: [[low(red, blue), 'Divide by all the beads, not only the other colour.', 'اقسم على كل الخرزات لا على اللون الآخر فقط.']] };
    },
    trap: function (r) { var a = r.int(2, 6), b = r.int(2, 6); return { w: 0, q: ['A bag has ' + a + ' red and ' + b + ' blue. One line is wrong. Tap it.', 'في كيس ' + a + ' حمراء و' + b + ' زرقاء. سطر واحد خاطئ. انقر عليه.'], why: ['Divide by all the beads, ' + a + ' + ' + b + ' = ' + (a + b) + ', not just the blue ones.', 'اقسم على كل الخرزات ' + a + ' + ' + b + ' = ' + (a + b) + '، لا الزرقاء فقط.'], l: [['Chance of red: ' + a + '/' + b, 'احتمال الأحمر: ' + a + '/' + b], ['Red is ' + a + ' ways', 'للأحمر ' + a + ' طرق'], ['Chance is a fraction', 'الاحتمال كسر']] }; },
    explain: [['After five heads in a row, is tails more likely next?', 'بعد خمسة وجوه متتالية، هل الظهر أرجح في المرة التالية؟'], ['No. A coin has no memory: it is still 1/2.', 'لا. العملة لا ذاكرة لها، فهو ١/٢.'], ['Yes, tails is due.', 'نعم، حان دور الظهر.'], ['Yes, because five is a lot.', 'نعم لأن خمسة كثير.']]
  });

  /* ---------- numbers, deeper ---------- */
  var factorsOf = function (n) { var o = []; for (var i = 1; i <= n; i++) if (n % i === 0) o.push(i); return o; };
  teach('m6.hcf', {
    why: ['The largest equal groups you can make from two piles: that is the highest common factor.', 'أكبر مجموعات متساوية من كومتين: ذلك هو العامل المشترك الأكبر.'],
    idea: [['List the factors of each number and pick the biggest in both lists.', 'اكتب عوامل كل عدد واختر الأكبر الموجود في القائمتين.'], ['HCF of 12 and 18: 12 has 1, 2, 3, 4, 6, 12. 18 has 1, 2, 3, 6, 9, 18. The answer is 6.', 'لـ ١٢ و١٨: عوامل ١٢ هي ١ و٢ و٣ و٤ و٦ و١٢، وعوامل ١٨ هي ١ و٢ و٣ و٦ و٩ و١٨. الناتج ٦.']],
    g: function (r, lv) {
      var h = r.int(2, lv === 1 ? 6 : 12), a0 = r.pick([2, 3, 4, 5]), b0 = r.pick([3, 5, 7]); if (gcd(a0, b0) > 1 || a0 === b0) { a0 = 2; b0 = 3; } var a = h * a0, b = h * b0;
      var q = lv === 3 ? [a + ' boys and ' + b + ' girls are put in equal teams with no one left over, all boys or all girls. What is the largest team size?', a + ' فتى و' + b + ' فتاة في فرق متساوية دون بقية، كل فريق من جنس واحد. ما أكبر حجم للفريق؟'] : ['Find the highest common factor.', 'أوجد العامل المشترك الأكبر.'];
      return { q: q, eq: a + ' , ' + b, a: h, s: [['Factors of ' + a, 'عوامل ' + a, factorsOf(a).join(', ')], ['Factors of ' + b, 'عوامل ' + b, factorsOf(b).join(', ')], ['Biggest in both', 'الأكبر في القائمتين', 'Answer:', h]], miss: [[a * b, 'That multiplies them. The HCF cannot be bigger than either number.', 'هذا حاصل الضرب. لا يمكن أن يتجاوز العامل المشترك أيًا منهما.'], [1, '1 always works, but is it the biggest?', '١ يصلح دائمًا، لكن هل هو الأكبر؟'], [TM.lcm(a, b), 'That is the lowest common multiple. Factors go into the numbers.', 'هذا المضاعف المشترك الأصغر. العوامل تدخل في العددين.']] };
    },
    trap: function (r) { return { eq: '12 , 18', w: 2, why: ['6 divides both, and is bigger than 3.', '٦ يقسم العددين وهو أكبر من ٣.'], l: ['12: 1, 2, 3, 4, 6, 12', '18: 1, 2, 3, 6, 9, 18', 'Answer: 3', ['3 divides both', '٣ يقسمهما']] }; },
    explain: [['Can the HCF of two numbers be bigger than the smaller number?', 'هل يمكن أن يتجاوز العامل المشترك الأكبر العدد الأصغر؟'], ['No. A factor cannot be larger than the number it divides.', 'لا. لا يتجاوز العامل العدد الذي يقسمه.'], ['Yes, for large numbers.', 'نعم في الأعداد الكبيرة.'], ['Yes, always.', 'نعم دائمًا.']]
  });

  teach('m6.lcm', {
    why: ['When will two events line up again? Common multiples also give the common bottom for any two fractions.', 'متى يلتقي حدثان مجددًا؟ والمضاعفات المشتركة تعطي أيضًا المقام المشترك لأي كسرين.'],
    idea: [['List multiples of each number. The first in both lists is the lowest common multiple.', 'اكتب مضاعفات كل عدد. الأول في القائمتين هو المضاعف المشترك الأصغر.'], ['LCM of 4 and 6: 4, 8, 12 and 6, 12. The answer is 12, not 24.', 'لـ ٤ و٦: ٤ و٨ و١٢، و٦ و١٢. الناتج ١٢ لا ٢٤.']],
    g: function (r, lv) {
      var a = r.int(2, lv === 1 ? 6 : 9), b = r.int(2, lv === 1 ? 8 : 15); if (a === b) b++; var l = TM.lcm(a, b), ml = function (x) { var o = [], m = x; while (m <= l) { o.push(m); m += x; } return o; };
      var q = lv === 3 ? ['A green light flashes every ' + a + ' seconds and a red one every ' + b + '. They flash together now. How many seconds until they next flash together?', 'يومض ضوء أخضر كل ' + a + ' ثوانٍ وأحمر كل ' + b + ' ثوانٍ. وميضهما معًا الآن. بعد كم ثانية يتكرر؟'] : ['Find the lowest common multiple.', 'أوجد المضاعف المشترك الأصغر.'];
      return { q: q, eq: a + ' , ' + b, a: l, s: [['Multiples of ' + a, 'مضاعفات ' + a, ml(a).join(', ')], ['Multiples of ' + b, 'مضاعفات ' + b, ml(b).join(', ')], ['First in both', 'الأول في القائمتين', 'First match:', l]], miss: [[a * b === l ? -1 : a * b, 'That is a common multiple, but is it the lowest?', 'هذا مضاعف مشترك، لكن هل هو الأصغر؟'], [gcd(a, b), 'That is the common factor. Multiples are bigger.', 'هذا عامل مشترك. المضاعفات أكبر.']] };
    },
    trap: function (r) { return { eq: '4 , 6', w: 2, why: ['12 is in both lists and comes before 24.', '١٢ في القائمتين ويأتي قبل ٢٤.'], l: ['4: 4, 8, 12, 16, 20, 24', '6: 6, 12, 18, 24', 'Answer: 24', ['24 is in both', '٢٤ في القائمتين']] }; },
    explain: [['Is multiplying two numbers always the LCM?', 'هل حاصل ضرب العددين هو دائمًا المضاعف المشترك الأصغر؟'], ['No. It is a common multiple, but a smaller one may exist: 4 × 6 = 24, yet 12 works.', 'لا. هو مضاعف مشترك، وقد يوجد أصغر: ٤ × ٦ = ٢٤ لكن ١٢ يصلح.'], ['Yes, always.', 'نعم دائمًا.'], ['Only for odd numbers.', 'للأعداد الفردية فقط.']]
  });

  teach('m6.primef', {
    why: ['Every number has one unique recipe of primes. It is a kind of fingerprint.', 'لكل عدد وصفة واحدة من الأعداد الأولية، كأنها بصمة له.'],
    idea: [['Split a number into any factor pair, then split those, until all are prime. 60 = 2 × 2 × 3 × 5.', 'جزّئ العدد إلى زوج عوامل ثم جزّئهما حتى تصبح كلها أولية. ٦٠ = ٢ × ٢ × ٣ × ٥.'], ['Start anywhere: you always end with the same primes.', 'ابدأ من أي مكان: تصل دائمًا إلى الأعداد الأولية نفسها.']],
    g: function (r, lv) {
      var ps = lv === 1 ? [[2, 2, 3], [2, 3, 3], [2, 2, 5], [2, 3, 5], [2, 2, 7]] : [[2, 2, 2, 3], [2, 2, 3, 5], [2, 3, 3, 5], [2, 2, 3, 7], [2, 2, 2, 5, 3], [3, 3, 5, 7]], p = r.pick(ps), n = p.reduce(function (a, b) { return a * b; }, 1), s = [], cur = n;
      p.forEach(function (f, i) { if (i < p.length - 1) { s.push(['Take out ' + f, 'أخرج ' + f, cur + ' ÷ ' + f + ' =', cur / f]); cur = cur / f; } });
      s.push(['All prime now', 'كلها أولية الآن', p.join(' × ') + ' =', n]);
      if (lv === 3) { var lg = Math.max.apply(null, p); return { q: ['What is the largest prime factor of ' + n + '?', 'ما أكبر عامل أولي للعدد ' + n + '؟'], eq: String(n), a: lg, s: s.concat([['The largest one', 'الأكبر', 'Answer:', lg]]) }; }
      return { q: ['Break ' + n + ' into primes. How many primes multiply to make it, counting repeats?', 'حلّل ' + n + ' إلى عوامل أولية. كم عددها بالتكرار؟'], eq: String(n), a: p.length, s: s.concat([['Count them', 'عُدّها', 'Answer:', p.length]]), miss: [[new Set(p).size, 'Count repeats too: 2 × 2 counts as two.', 'عُدّ المكرر: ٢ × ٢ تُحسب اثنين.']] };
    },
    trap: function (r) { return { eq: '36', w: 1, why: ['6 is not prime. 36 = 2 × 2 × 3 × 3.', '٦ ليس أوليًا. ٣٦ = ٢ × ٢ × ٣ × ٣.'], l: ['36 = 6 × 6', ['6 and 6 are prime', '٦ و٦ أوليان'], ['So we stop here', 'فنتوقف هنا']] }; },
    explain: [['Why do different factor trees give the same primes?', 'لماذا تعطي الأشجار المختلفة الأعداد الأولية نفسها؟'], ['Every whole number has exactly one prime recipe.', 'لكل عدد صحيح وصفة أولية واحدة فقط.'], ['Luck.', 'صدفة.'], ['They do not. Each tree differs.', 'لا تعطي. كل شجرة مختلفة.']]
  });

  teach('m6.dmul', {
    why: ['1.5 kg of apples at 2.40 a kilo. Decimals multiply every day.', '١٫٥ كجم تفاح بسعر ٢٫٤٠ للكيلو. الكسور العشرية تُضرب كل يوم.'],
    idea: [['Ignore the points, multiply as whole numbers, then put the point back.', 'تجاهل الفاصلتين واضرب كعددين صحيحين ثم أعد الفاصلة.'], ['Count the decimal places in the question: the answer has that many. 0.3 × 0.2 = 0.06.', 'عُدّ المنازل العشرية في السؤال: يكون للناتج مثلها. ٠٫٣ × ٠٫٢ = ٠٫٠٦.']],
    g: function (r, lv) {
      var a = r.int(2, 9), b = r.int(2, 9);
      if (lv === 1) { var x = dp(a / 10), ans = dp(a * b / 10); return { q: ['Multiply.', 'اضرب.'], eq: x + ' × ' + b, a: ans, s: [['Ignore the point', 'تجاهل الفاصلة', a + ' × ' + b + ' =', a * b], ['One decimal place', 'منزلة عشرية واحدة', (a * b) + ' ÷ 10 =', ans]], miss: [[a * b, 'Put the point back: there is one decimal place in the question.', 'أعد الفاصلة: في السؤال منزلة عشرية واحدة.']] }; }
      var x2 = dp(a / 10), y2 = dp(b / 10), ans2 = dp(a * b / 100, 4);
      if (lv === 2) return { q: ['Multiply.', 'اضرب.'], eq: x2 + ' × ' + y2, a: ans2, s: [['Ignore the points', 'تجاهل الفاصلتين', a + ' × ' + b + ' =', a * b], ['Two decimal places in all', 'منزلتان في المجموع', (a * b) + ' ÷ 100 =', ans2]], miss: [[dp(a * b / 10), 'There are two decimal places in the question, so two in the answer.', 'في السؤال منزلتان فللناتج منزلتان.']] };
      var kg = r.pick([1.5, 2.5, 3.5, 0.5]), pr = r.int(12, 48) / 10, tot = dp(kg * pr, 2), big = Math.round(kg * 10) * Math.round(pr * 10);
      return { q: [kg + ' kg of fruit at ' + pr + ' a kilo. How much altogether?', kg + ' كجم فاكهة بسعر ' + pr + ' للكيلو. كم المجموع؟'], eq: kg + ' × ' + pr, a: tot, s: [['Ignore the points', 'تجاهل الفاصلتين', Math.round(kg * 10) + ' × ' + Math.round(pr * 10) + ' =', big], ['Two decimal places', 'منزلتان عشريتان', big + ' ÷ 100 =', tot]] };
    },
    trap: function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { eq: '0.' + a + ' × 0.' + b, w: 1, why: ['Two decimal places: ' + (a * b) + ' ÷ 100 = ' + dp(a * b / 100, 4) + '.', 'منزلتان: ' + (a * b) + ' ÷ ١٠٠ = ' + dp(a * b / 100, 4) + '.'], l: [a + ' × ' + b + ' = ' + (a * b), (a * b) + ' ÷ 10 = ' + dp(a * b / 100, 4), 'Answer: ' + dp(a * b / 100, 4)] }; },
    explain: [['Why is 0.3 × 0.2 smaller than either?', 'لماذا ٠٫٣ × ٠٫٢ أصغر من كليهما؟'], ['It is a part of a part: 3 tenths of 2 tenths.', 'هو جزء من جزء: ٣ أعشار من عُشرين.'], ['Multiplying always shrinks numbers.', 'الضرب يصغّر الأعداد دائمًا.'], ['It should be bigger: it is an error.', 'يجب أن يكون أكبر: هذا خطأ.']]
  });

  teach('m6.ddiv', {
    why: ['How many 1/4 cup scoops are in 3 cups? Dividing by a fraction asks how many fit.', 'كم ملعقة ١/٤ كوب في ٣ أكواب؟ القسمة على كسر تسأل كم تدخل.'],
    idea: [{ p: ['3 ÷ 1/4 asks: how many quarters fit in 3? Four in each whole, so 12.', '٣ ÷ ١/٤ تسأل: كم ربعًا في ٣؟ أربعة في كل واحد، فالناتج ١٢.'], dia: function () { return D.frac([[4, 4], [4, 4], [4, 4]]); } }, ['The rule: flip the second fraction and multiply. 2/3 ÷ 1/2 = 2/3 × 2/1 = 4/3.', 'القاعدة: اقلب الكسر الثاني واضرب. ٢/٣ ÷ ١/٢ = ٢/٣ × ٢/١ = ٤/٣.']],
    g: function (r, lv) {
      var w = r.int(2, 8), d = r.pick([2, 3, 4, 5]);
      if (lv === 1) return { q: ['How many 1/' + d + ' in ' + w + '?', 'كم ١/' + d + ' في ' + w + '؟'], eq: w + ' ÷ 1/' + d, a: w * d, dia: D.frac([[d, d]]), s: [['Each whole holds ' + d, 'كل واحد فيه ' + d, w + ' × ' + d + ' =', w * d]], miss: [[dp(w / d), 'Dividing by a fraction less than 1 gives a bigger answer: many pieces fit.', 'القسمة على كسر أقل من ١ تكبّر الناتج: تدخل قطع كثيرة.']] };
      var a = r.int(1, 4), b = r.int(a + 1, 6), c = r.int(1, 3), e = r.int(c + 1, 5), T0 = a * e, B = b * c, ans = low(T0, B);
      if (lv === 2) return { q: ['Divide. Flip the second and multiply. Give the simplest form.', 'اقسم. اقلب الثاني واضرب. أعط أبسط صورة.'], eq: a + '/' + b + ' ÷ ' + c + '/' + e, a: ans, s: [['Flip the second', 'اقلب الثاني', a + '/' + b + ' × ' + e + '/' + c], ['Multiply the tops', 'اضرب البسطين', a + ' × ' + e + ' =', T0], ['Multiply the bottoms', 'اضرب المقامين', b + ' × ' + c + ' =', B], ['Simplify', 'بسّط', T0 + '/' + B + ' =', ans]], miss: [[low(a * c, b * e), 'You multiplied without flipping. Dividing means flipping the second first.', 'ضربت دون قلب. القسمة تعني قلب الثاني أولًا.']] };
      return { q: ['A cook has ' + w + ' cups of rice and uses 1/' + d + ' cup a portion. How many portions?', 'لدى طباخ ' + w + ' أكواب أرز ويستخدم ١/' + d + ' كوب للوجبة. كم وجبة؟'], eq: w + ' ÷ 1/' + d, a: w * d, s: [['How many portions in each cup?', 'كم وجبة في كل كوب؟', w + ' × ' + d + ' =', w * d]], miss: [[dp(w / d), 'Each portion is small, so there are many. Multiply by ' + d + '.', 'الوجبة صغيرة فعددها كبير. اضرب في ' + d + '.']] };
    },
    trap: function (r) { return { eq: '2/3 ÷ 1/2', w: 0, why: ['Flip the second fraction, not the first.', 'اقلب الكسر الثاني لا الأول.'], l: [['Flip the first: 3/2 × 1/2', 'اقلب الأول: ٣/٢ × ١/٢'], ['Multiply: 3/4', 'اضرب: ٣/٤'], 'Answer: 3/4'] }; },
    explain: [['Why does 3 ÷ 1/4 give an answer bigger than 3?', 'لماذا يعطي ٣ ÷ ١/٤ ناتجًا أكبر من ٣؟'], ['You are counting how many small quarters fit into 3 wholes.', 'تعدّ كم ربعًا صغيرًا يدخل في ٣ كاملة.'], ['Division always grows numbers.', 'القسمة تكبّر الأعداد دائمًا.'], ['It is a mistake in the rule.', 'خطأ في القاعدة.']]
  });

  teach('m6.fdp', {
    why: ['1/2, 0.5 and 50% are one amount in three outfits. Choosing the easy one makes hard sums simple.', '١/٢ و٠٫٥ و٥٠٪ مقدار واحد بثلاثة أزياء. واختيار الأسهل يبسّط العمليات الصعبة.'],
    idea: [['Fraction to decimal: divide top by bottom. Decimal to percent: × 100. 3/4 = 0.75 = 75%.', 'من كسر إلى عشري: اقسم البسط على المقام. ومن عشري إلى نسبة: × ١٠٠. ٣/٤ = ٠٫٧٥ = ٧٥٪.'], ['Know these by heart: 1/2, 1/4, 3/4, 1/5, 1/10.', 'احفظ هذه: ١/٢ و١/٤ و٣/٤ و١/٥ و١/١٠.']],
    g: function (r, lv) {
      var set = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [1, 20], [9, 20]], p = r.pick(lv === 1 ? set.slice(0, 7) : set), n = p[0], d = p[1], dec = dp(n / d), pc = dp(n / d * 100);
      if (lv === 1) return { q: ['Write as a decimal.', 'اكتب كسرًا عشريًا.'], eq: n + '/' + d, a: dec, s: [['Top ÷ bottom', 'البسط ÷ المقام', n + ' ÷ ' + d + ' =', dec]], miss: [[dp(d / n), 'Upside down. Divide the top by the bottom.', 'مقلوب. اقسم البسط على المقام.']] };
      if (lv === 2) return { q: ['Write as a percent. Type the number only.', 'اكتب نسبة مئوية. اكتب العدد فقط.'], eq: n + '/' + d, a: pc, s: [['Top ÷ bottom', 'البسط ÷ المقام', n + ' ÷ ' + d + ' =', dec], ['× 100', '× ١٠٠', dec + ' × 100 =', pc]], miss: [[dec, 'That is the decimal. Percent is out of 100.', 'هذا العشري. النسبة من ١٠٠.']] };
      var g0 = gcd(pc, 100), a0 = low(pc, 100);
      return { q: ['Write ' + pc + '% as a fraction in simplest form.', 'اكتب ' + pc + '٪ كسرًا في أبسط صورة.'], eq: pc + '%', a: a0, exact: true, s: [['Percent is out of 100', 'النسبة من ١٠٠', pc + '/100'], ['Simplify', 'بسّط', pc + ' ÷ ' + g0 + ' =', pc / g0], ['Simplest', 'الأبسط', 'Answer:', a0]], miss: [[pc + '/100', 'Right value, but simplify it.', 'قيمة صحيحة لكن بسّطها.']] };
    },
    trap: function (r) { return { eq: '1/4', w: 1, why: ['1 ÷ 4 = 0.25, not 0.4. The bottom is not the decimal.', '١ ÷ ٤ = ٠٫٢٥ لا ٠٫٤. المقام ليس هو العشري.'], l: ['1/2 = 0.5', '1/4 = 0.4', '1/5 = 0.2'] }; },
    explain: [['Why is 1/4 not 0.4?', 'لماذا ليست ١/٤ هي ٠٫٤؟'], ['1 ÷ 4 is 0.25. 0.4 is 4 tenths, far more than a quarter.', '١ ÷ ٤ = ٠٫٢٥. و٠٫٤ أربعة أعشار وهي أكبر من الربع.'], ['It is 0.4.', 'بل هي ٠٫٤.'], ['Fractions cannot be decimals.', 'الكسور لا تكون عشرية.']]
  });

  teach('m6.negmul', {
    why: ['Debts, losses and direction: multiplying with signs is how physics and finance keep track.', 'الديون والخسائر والاتجاه: الضرب بالإشارات هو ما تستند إليه الفيزياء والمال.'],
    idea: [['Same signs give a positive. Different signs give a negative.', 'الإشارتان المتشابهتان موجب، والمختلفتان سالب.'], ['−3 × 4 is three debts of 4: −12. −3 × −4 removes three debts of 4: +12.', '−٣ × ٤ ثلاثة ديون كلٌّ ٤: −١٢. −٣ × −٤ إزالة ثلاثة ديون: +١٢.']],
    g: function (r, lv) {
      var a = r.int(2, 12), b = r.int(2, 12);
      if (lv === 1) return { q: ['Multiply.', 'اضرب.'], eq: '−' + a + ' × ' + b, a: -(a * b), s: [['Different signs: negative', 'إشارتان مختلفتان: سالب', '−' + a + ' × ' + b + ' =', '−' + (a * b)]], miss: [[a * b, 'One sign is negative, so the answer is negative.', 'إشارة واحدة سالبة فالناتج سالب.'], [b - a, 'You added. Multiply.', 'جمعت. اضرب.']] };
      if (lv === 2) return { q: ['Multiply.', 'اضرب.'], eq: '−' + a + ' × −' + b, a: a * b, s: [['Same signs: positive', 'إشارتان متشابهتان: موجب', a + ' × ' + b + ' =', a * b]], miss: [[-(a * b), 'Two negatives make a positive.', 'سالبان يعطيان موجبًا.']] };
      var n = a * r.int(2, 9), neg = r.bool();
      return { q: ['Divide. Signs work the same way.', 'اقسم. الإشارات تعمل بالطريقة نفسها.'], eq: (neg ? '−' : '−') + n + ' ÷ ' + (neg ? '−' : '') + a, a: neg ? n / a : -n / a, s: [[neg ? 'Same signs: positive' : 'Different signs: negative', neg ? 'متشابهتان: موجب' : 'مختلفتان: سالب', (neg ? '' : '−') + n + ' ÷ ' + a + ' =', mn(neg ? n / a : -n / a)]], miss: [[neg ? -n / a : n / a, 'Check the signs: ' + (neg ? 'same gives positive.' : 'different gives negative.'), 'راجع الإشارتين: ' + (neg ? 'المتشابهتان موجب.' : 'المختلفتان سالب.')]] };
    },
    trap: function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { w: 1, why: ['Two negatives multiply to a positive: ' + (a * b) + '.', 'سالبان يعطيان موجبًا: ' + (a * b) + '.'], l: ['−' + a + ' × ' + b + ' = −' + (a * b), '−' + a + ' × −' + b + ' = −' + (a * b), a + ' × ' + b + ' = ' + (a * b)] }; },
    explain: [['Why does a negative times a negative give a positive?', 'لماذا يعطي السالب في السالب موجبًا؟'], ['Taking away a debt several times leaves you better off.', 'إزالة الدين مرات تجعلك في حال أفضل.'], ['Because two wrongs make a right, by rule.', 'لأن الخطأين يصنعان صوابًا بالقاعدة.'], ['It does not: it stays negative.', 'لا يعطي: يبقى سالبًا.']]
  });

  /* ---------- averages and charts ---------- */
  teach('m6.median', {
    why: ['One millionaire changes the mean of a village but not its median. Knowing which average to trust is real power.', 'مليونير واحد يغيّر متوسط القرية لا وسيطها. ومعرفة أي متوسط تثق به قوة حقيقية.'],
    idea: [['Mean: add and divide. Median: the middle when in order. Mode: the most common. Range: biggest minus smallest.', 'المتوسط: اجمع واقسم. الوسيط: الأوسط بعد الترتيب. المنوال: الأكثر تكرارًا. المدى: الأكبر ناقص الأصغر.'], ['With an even count, the median is halfway between the middle two.', 'في العدد الزوجي، الوسيط منتصف العددين الأوسطين.']],
    g: function (r, lv) {
      var n = lv === 1 ? 5 : r.pick([5, 7]), v = []; for (var i = 0; i < n; i++) v.push(r.int(1, 20)); var sorted = v.slice().sort(function (a, b) { return a - b; }), mid = sorted[(n - 1) / 2], rg = sorted[n - 1] - sorted[0];
      if (lv === 1) return { q: ['Find the median.', 'أوجد الوسيط.'], eq: v.join(', '), a: mid, s: [['Put in order first', 'رتّب أولًا', sorted.join(', ')], ['Take the middle', 'خذ الأوسط', 'Median:', mid]], miss: [[v[(n - 1) / 2] === mid ? -999 : v[(n - 1) / 2], 'That is the middle before ordering. Order them first.', 'هذا الأوسط قبل الترتيب. رتّب أولًا.']] };
      if (lv === 2) return { q: ['Find the range.', 'أوجد المدى.'], eq: v.join(', '), a: rg, s: [['Biggest and smallest', 'الأكبر والأصغر', sorted[n - 1] + ' − ' + sorted[0] + ' =', rg]], miss: [[sorted[n - 1], 'That is the biggest. Range is the gap.', 'هذا الأكبر. المدى هو الفرق.']] };
      var a = r.int(3, 9), b = a + r.int(2, 6), c = b + r.int(2, 4), e = c + r.int(2, 6), m0 = (b + c) / 2;
      return { q: ['Find the median of these four numbers.', 'أوجد وسيط هذه الأعداد الأربعة.'], eq: [c, a, e, b].join(', '), a: m0, s: [['Put in order', 'رتّب', [a, b, c, e].join(', ')], ['Halfway between the middle two', 'منتصف الأوسطين', '(' + b + ' + ' + c + ') ÷ 2 =', m0]], miss: [[b, 'With four numbers there are two in the middle. Use both.', 'في أربعة أعداد يوجد اثنان في الوسط. استخدمهما.'], [c, 'With four numbers there are two in the middle. Use both.', 'في أربعة أعداد يوجد اثنان في الوسط. استخدمهما.']] };
    },
    trap: function (r) { return { eq: '8, 2, 5', w: 0, why: ['Put them in order first: 2, 5, 8. The median is 5.', 'رتّبها أولًا: ٢ و٥ و٨. الوسيط ٥.'], l: ['Median: 2', ['It is the middle one written', 'هو الأوسط كما كُتب'], ['Ordering is not needed', 'لا حاجة إلى الترتيب']] }; },
    explain: [['Five salaries: 2, 2, 3, 3, 90. Which best describes a typical salary?', 'خمسة رواتب: ٢ و٢ و٣ و٣ و٩٠. أيها يصف الراتب المعتاد؟'], ['The median, 3. The mean is pulled up by the 90.', 'الوسيط ٣. فالمتوسط يرفعه الرقم ٩٠.'], ['The mean, 20.', 'المتوسط ٢٠.'], ['The range, 88.', 'المدى ٨٨.']]
  });

  teach('m6.pie', {
    why: ['A pie chart shows parts of a whole at a glance: where the time goes, where the money goes.', 'الرسم الدائري يُظهر أجزاء الكل بنظرة: أين يذهب الوقت وأين يذهب المال.'],
    idea: [{ p: ['The whole circle is 360° and stands for everything. Half the circle is half the total.', 'الدائرة كلها ٣٦٠° وتمثل الكل، ونصفها نصف المجموع.'], dia: function () { return D.pie([[180, 'A'], [90, 'B'], [90, 'C']]); } }, ['Slice ÷ 360 gives the fraction. Multiply by the total to get the amount.', 'الشريحة ÷ ٣٦٠ تعطي الكسر، واضرب في الكل لتحصل على المقدار.']],
    g: function (r, lv) {
      var deg = r.pick([30, 45, 60, 90, 120, 180, 150, 240]), tot = r.pick([24, 36, 48, 72, 120, 360]), amt = dp(tot * deg / 360), rest = 360 - deg;
      if (lv === 1) { var dg = r.pick([90, 180, 45, 120]); return { q: ['What fraction of the pie is the shaded slice? Give the simplest form.', 'ما كسر الشريحة المظللة؟ أعط أبسط صورة.'], dia: D.pie([[dg, dg + '°'], [360 - dg, null]]), a: low(dg, 360), s: [['Slice over 360', 'الشريحة على ٣٦٠', dg + '/360 =', low(dg, 360)]] }; }
      if (lv === 2) return { q: ['The pie stands for ' + tot + ' students. How many are in the ' + deg + '° slice?', 'يمثل الرسم ' + tot + ' طالبًا. كم في شريحة ' + deg + '°؟'], dia: D.pie([[deg, deg + '°'], [rest, null]]), a: amt, s: [['Fraction of the circle', 'كسر الدائرة', deg + '/360 =', low(deg, 360)], ['Of the total', 'من الكل', tot + ' × ' + deg + ' ÷ 360 =', amt]], miss: [[deg, 'That is the angle. Turn it into students.', 'هذه الزاوية. حوّلها إلى طلاب.']] };
      var a = r.int(2, 9) * 10, b = r.int(2, 9) * 10;
      return { q: ['A pie has slices of ' + a + '° and ' + b + '°, and one more. How big is the last slice, in degrees?', 'في رسم دائري شريحتان ' + a + '° و' + b + '° وأخرى. كم الأخيرة بالدرجات؟'], dia: D.pie([[a, a + '°'], [b, b + '°'], [360 - a - b, '?']]), a: 360 - a - b, s: [['Add what you know', 'اجمع المعلوم', a + ' + ' + b + ' =', a + b], ['Take from 360', 'اطرح من ٣٦٠', '360 − ' + (a + b) + ' =', 360 - a - b]], miss: [[180 - a - b, 'A circle has 360°, not 180°.', 'الدائرة ٣٦٠° لا ١٨٠°.']] };
    },
    trap: function (r) { var t = r.pick([40, 60, 80]); return { eq: '90° , ' + t, w: 0, why: ['90° is a quarter of 360°, so ' + t + ' ÷ 4 = ' + (t / 4) + '.', '٩٠° ربع ٣٦٠°، فـ ' + t + ' ÷ ٤ = ' + (t / 4) + '.'], l: ['90/360 = 1/3', t + ' ÷ 3 = ' + dp(t / 3, 2), 'Answer: ' + dp(t / 3, 2)] }; },
    explain: [['What does a 180° slice always mean?', 'ماذا تعني شريحة ١٨٠° دائمًا؟'], ['Exactly half of the total, whatever the total is.', 'نصف الكل بالضبط، أيًا كان الكل.'], ['180 people.', '١٨٠ شخصًا.'], ['A very small part.', 'جزءًا صغيرًا جدًا.']]
  });

  teach('m6.prob', {
    why: ['Is a game fair? Should you take the umbrella? Chance as a fraction lets you compare.', 'هل اللعبة عادلة؟ هل تحمل مظلة؟ الاحتمال كسرًا يتيح لك المقارنة.'],
    idea: [['Probability = ways you want ÷ all equally likely ways. A die rolling a 3 is 1/6.', 'الاحتمال = الطرق المطلوبة ÷ كل الطرق المتساوية. ظهور ٣ على النرد ١/٦.'], ['The chance of something not happening is 1 minus the chance it does.', 'احتمال عدم الحدوث = ١ − احتمال الحدوث.']],
    g: function (r, lv) {
      if (lv === 1) { var evs = [[['an even number', 'عدد زوجي'], 3], [['a number above 4', 'عدد أكبر من ٤'], 2], [['a 6', 'الرقم ٦'], 1], [['a number below 5', 'عدد أقل من ٥'], 4]], e = r.pick(evs); return { q: ['Rolling a die, what is the chance of ' + e[0][0] + '? Give the simplest form.', 'برمي النرد، ما احتمال ' + e[0][1] + '؟ أعط أبسط صورة.'], a: low(e[1], 6), s: [['Ways you want', 'الطرق المطلوبة', 'Top:', e[1]], ['Over all six', 'على الستة', e[1] + '/6 =', low(e[1], 6)]], miss: [[e[1] + '/' + (6 - e[1]), 'Divide by all 6 outcomes.', 'اقسم على النتائج الستة كلها.']] }; }
      var a = r.int(1, 7), b = r.int(1, 7), c = r.int(1, 6), t = a + b + c;
      if (lv === 2) return { q: ['A bag has ' + a + ' red, ' + b + ' green and ' + c + ' blue beads. What is the chance of green? Give the simplest form.', 'في كيس ' + a + ' حمراء و' + b + ' خضراء و' + c + ' زرقاء. ما احتمال الأخضر؟ أعط أبسط صورة.'], a: low(b, t), s: [['All the beads', 'كل الخرزات', a + ' + ' + b + ' + ' + c + ' =', t], ['Green over all', 'الأخضر على الكل', b + '/' + t + ' =', low(b, t)]], miss: [[low(b, a + c), 'Divide by all the beads, including green.', 'اقسم على كل الخرزات بما فيها الخضراء.']] };
      var p = r.pick([[1, 4], [2, 5], [3, 10], [1, 5], [3, 8], [7, 10]]), notT = p[1] - p[0];
      return { q: ['The chance of rain is ' + p[0] + '/' + p[1] + '. What is the chance of no rain?', 'احتمال المطر ' + p[0] + '/' + p[1] + '. ما احتمال عدم المطر؟'], eq: '1 − ' + p[0] + '/' + p[1], a: low(notT, p[1]), s: [['1 is the whole', '١ هو الكل', p[1] + ' − ' + p[0] + ' =', notT], ['Over the same bottom', 'على المقام نفسه', notT + '/' + p[1] + ' =', low(notT, p[1])]] };
    },
    trap: function (r) { var n = r.pick([4, 8, 10]), a = r.int(1, n - 1); return { eq: a + ' / ' + n, w: 1, q: [a + ' of ' + n + ' cards are red. One line is wrong. Tap it.', a + ' من ' + n + ' بطاقات حمراء. سطر واحد خاطئ. انقر عليه.'], why: ['The chance of not red is ' + (n - a) + '/' + n + ', not ' + (n - a) + '/' + a + '.', 'احتمال غير الأحمر ' + (n - a) + '/' + n + ' لا ' + (n - a) + '/' + a + '.'], l: [['Red: ' + a + ' of ' + n, 'أحمر: ' + a + ' من ' + n], ['Not red: ' + (n - a) + ' over ' + a, 'غير أحمر: ' + (n - a) + ' على ' + a], ['Together they make 1', 'معًا يكوّنان ١']] }; },
    explain: [['Why do all the chances in a situation add to 1?', 'لماذا تُجمع كل الاحتمالات إلى ١؟'], ['Something must happen, and 1 means certain.', 'لا بد أن يقع شيء، و١ تعني مؤكدًا.'], ['Because fractions are small.', 'لأن الكسور صغيرة.'], ['They do not always.', 'لا تُجمع دائمًا.']]
  });
})();
