/* Science taught in full, Year 7: forces, pressure, magnets, circuits, stars, machines and honest evidence. See lesson/teach.js for the shape of a topic. */
(function () {
  'use strict';
  var C = window.C, D = window.Dia, TS = C.TS, teach = TS.teach, n = TS.n, w = TS.w, cnt = TS.cnt;
  var yrs = function (x) { return cnt(x, 'سنة ضوئية واحدة', 'سنتين ضوئيتين', 'سنوات ضوئية', 'سنة ضوئية'); }, teeth = function (x) { return cnt(x, 'سن', 'سنّان', 'أسنان', 'سنًا'); }, times = function (x) { return cnt(x, 'مرة', 'مرتين', 'مرات', 'مرة'); };

  teach('s7.speed', {
    why: ['Every moving thing, from a ball to a planet, obeys this. Engineers use it before they build anything.', 'كل متحرك، من الكرة إلى الكوكب، يخضع لهذا. والمهندسون يستعملونه قبل أن يبنوا أي شيء.'],
    idea: [{ p: ['Forces in opposite directions cancel. What is left over is the net force.', 'القوى المتعاكسة يلغي بعضها بعضًا، وما يبقى هو القوة المحصلة.'], dia: function () { return D.forces({ r: 30, l: 12, m: '' }); } },
      ['Net force zero: the forces are balanced, and the motion does not change. It stays still, or keeps the same speed.', 'إذا كانت المحصلة صفرًا فالقوى متزنة، ولا تتغير الحركة: يبقى الجسم ساكنًا أو يحافظ على سرعته.'],
      ['Net force not zero: the forces are unbalanced. The object speeds up, slows down or turns, towards the bigger force.', 'وإذا لم تكن المحصلة صفرًا فالقوى غير متزنة، فيتسارع الجسم أو يتباطأ أو ينعطف نحو القوة الأكبر.']],
    g: function (r, lv) {
      if (lv === 1) {
        var f = r.int(3, 12) * 5, b = r.int(1, f / 5 - 1) * 5;
        return { q: ['A trolley is pushed with ' + f + ' N. Friction pulls back with ' + b + ' N. What is the net force?', 'تُدفع عربة بقوة ' + f + ' N، والاحتكاك يشدها للخلف بقوة ' + b + ' N. ما القوة المحصلة؟'], a: f - b, dia: D.forces({ r: f, l: b, m: '' }),
          s: [['Opposite directions: take away', 'اتجاهان متعاكسان: اطرح', f + ' − ' + b + ' =', f - b, 'N']], miss: [[f + b, 'These forces point opposite ways, so take one from the other.', 'القوتان متعاكستان، فاطرح إحداهما من الأخرى.']] };
      }
      if (lv === 2) {
        var p = r.int(4, 16) * 5, kind = r.int(0, 2), q = kind === 0 ? p : kind === 1 ? p - r.int(1, 3) * 5 : p + r.int(1, 3) * 5;
        var right = [['It keeps the same speed', 'يحافظ على سرعته نفسها'], ['It speeds up', 'يتسارع'], ['It slows down', 'يتباطأ']][kind];
        var o = [right].concat([['It keeps the same speed', 'يحافظ على سرعته نفسها', 'That needs the forces to be equal.', 'هذا يحتاج إلى قوتين متساويتين.'], ['It speeds up', 'يتسارع', 'The bigger force is not forward.', 'القوة الأكبر ليست إلى الأمام.'], ['It slows down', 'يتباطأ', 'The bigger force is not backward.', 'القوة الأكبر ليست إلى الخلف.']].filter(function (x) { return x[0] !== right[0]; }));
        return { q: ['A cyclist is moving. The forward force is ' + p + ' N, and the drag is ' + q + ' N. What happens?', 'دراج يتحرك. القوة إلى الأمام ' + p + ' N والمقاومة ' + q + ' N. ماذا يحدث؟'], dia: D.forces({ r: p, l: q, m: '' }), o: o,
          s: [kind === 2 ? ['Backward minus forward', 'الخلف ناقص الأمام', q + ' − ' + p + ' =', q - p, 'N'] : ['Forward minus backward', 'الأمام ناقص الخلف', p + ' − ' + q + ' =', p - q, 'N'], w(['Zero means balanced', 'الصفر يعني الاتزان'], ['The forces are', 'القوى'], kind ? ['unbalanced', 'غير متزنة'] : ['balanced', 'متزنة'], '', [kind ? ['balanced', 'متزنة'] : ['unbalanced', 'غير متزنة']])] };
      }
      if (r.bool()) {
        var e = r.int(6, 20) * 10, wd = r.int(1, 5) * 10, fr = r.int(1, 6) * 10;
        return { q: ['A boat\'s engine pushes ' + e + ' N forward, and the wind pushes ' + wd + ' N forward too. Water drag is ' + fr + ' N backward. What is the net force forward?', 'محرك قارب يدفعه ' + e + ' N إلى الأمام، والريح تدفعه ' + wd + ' N إلى الأمام أيضًا، ومقاومة الماء ' + fr + ' N إلى الخلف. ما القوة المحصلة إلى الأمام؟'], a: e + wd - fr, dia: D.forces({ r: e + wd, l: fr, m: '' }),
          s: [['Same direction: add', 'الاتجاه نفسه: اجمع', e + ' + ' + wd + ' =', e + wd, 'N'], ['Then take away the drag', 'ثم اطرح المقاومة', (e + wd) + ' − ' + fr + ' =', e + wd - fr, 'N']], miss: [[e + wd + fr, 'Drag points backward, so it is taken away.', 'المقاومة إلى الخلف، فهي تُطرح.'], [e - fr, 'The wind pushes the same way as the engine. Add it in.', 'الريح تدفع باتجاه المحرك نفسه، فأضفها.']] };
      }
      var d = r.int(4, 30) * 10, t = r.pick([2, 4, 5, 10]);
      while ((d / t) % 1) d += 10;
      return { q: ['A runner goes ' + d + ' m in ' + t + ' s at a steady speed. What is the speed?', 'عدّاء يقطع ' + d + ' m في ' + t + ' s بسرعة ثابتة. ما سرعته؟'], a: d / t,
        s: [['Speed is distance ÷ time', 'السرعة = المسافة ÷ الزمن', d + ' ÷ ' + t + ' =', d / t, 'm/s'], w(['Steady speed means no change in motion', 'السرعة الثابتة تعني أن الحركة لا تتغير'], ['So the forces on the runner are', 'إذن القوى على العداء'], ['balanced', 'متزنة'], '', [['unbalanced', 'غير متزنة', 'Unbalanced forces would change the speed.', 'القوى غير المتزنة تغيّر السرعة.']])], miss: [[d * t, 'Divide the distance by the time.', 'اقسم المسافة على الزمن.']] };
    },
    trap: function (r) { var f = r.int(5, 12) * 10, b = r.int(1, 4) * 10; return { q: ['A box is pushed ' + f + ' N right, and friction is ' + b + ' N left. One line is wrong. Tap it.', 'صندوق يُدفع ' + f + ' N يمينًا والاحتكاك ' + b + ' N يسارًا. سطر واحد خاطئ. انقر عليه.'], w: 0, why: ['Opposite forces are taken away: ' + f + ' − ' + b + ' = ' + (f - b) + ' N.', 'القوى المتعاكسة تُطرح: ' + f + ' − ' + b + ' = ' + (f - b) + ' N.'], l: [['Net force: ' + f + ' + ' + b + ' = ' + (f + b) + ' N', 'المحصلة: ' + f + ' + ' + b + ' = ' + (f + b) + ' N'], ['The bigger force is to the right', 'القوة الأكبر إلى اليمين'], ['So the box speeds up to the right', 'إذن يتسارع الصندوق نحو اليمين']] }; },
    explain: [['A car drives at a steady 50 km/h. Why must the engine still push?', 'سيارة تسير بسرعة ثابتة ٥٠ km/h. لماذا يجب أن يظل المحرك يدفع؟'], ['Its push balances friction and air resistance. Without it, the net force would slow the car.', 'دفعه يوازن الاحتكاك ومقاومة الهواء، ولولاه لأبطأت المحصلة السيارة.'], ['Moving things always need a force to keep moving, even with no friction.', 'المتحرك يحتاج دائمًا إلى قوة ليستمر حتى بلا احتكاك.'], ['The engine makes the car heavier, which keeps it moving.', 'المحرك يجعل السيارة أثقل فتستمر.']]
  });

  teach('s7.pressure', {
    why: ['Pressure explains why knives cut, why camels do not sink in sand, and why dams are thick at the bottom.', 'الضغط يفسر لماذا تقطع السكين، ولماذا لا يغوص الجمل في الرمل، ولماذا تكون السدود سميكة في أسفلها.'],
    idea: [['Pressure = force ÷ area. Force in newtons, area in square metres, pressure in pascals (Pa).', 'الضغط = القوة ÷ المساحة. القوة بالنيوتن، والمساحة بالمتر المربع، والضغط بالباسكال (Pa).'],
      ['The same force on a smaller area gives a bigger pressure. A needle point is tiny, so it pierces. A camel\'s foot is wide, so it spreads its weight.', 'القوة نفسها على مساحة أصغر تعطي ضغطًا أكبر. رأس الإبرة صغير جدًا فيخترق، وخف الجمل عريض فيوزع وزنه.']],
    g: function (r, lv) {
      if (lv === 1) { var A0 = r.pick([2, 4, 5, 10]), P = r.int(2, 30) * 10, F = P * A0;
        return { q: ['A crate weighs ' + F + ' N and rests on ' + A0 + ' m². What pressure does it put on the floor?', 'صندوق وزنه ' + F + ' N يستقر على ' + A0 + ' m². ما الضغط الذي يؤثر به على الأرض؟'], a: P,
          s: [['Pressure = force ÷ area', 'الضغط = القوة ÷ المساحة', F + ' ÷ ' + A0 + ' =', P, 'Pa']], miss: [[F * A0, 'Divide the force by the area. Do not multiply.', 'اقسم القوة على المساحة، ولا تضرب.']] }; }
      if (lv === 2) { var A1 = r.pick([0.5, 2, 3, 4]), P1 = r.int(2, 20) * 50, F1 = n(P1 * A1);
        return { q: ['The pressure under a tank is ' + P1 + ' Pa over ' + A1 + ' m². What is the force?', 'الضغط تحت خزان ' + P1 + ' Pa على مساحة ' + A1 + ' m². ما القوة؟'], a: F1,
          s: [['Rearrange: force = pressure × area', 'أعد الترتيب: القوة = الضغط × المساحة', P1 + ' × ' + A1 + ' =', F1, 'N']], miss: [[n(P1 / A1), 'Here you need force, so multiply pressure by area.', 'المطلوب القوة، فاضرب الضغط في المساحة.']] }; }
      var F2 = r.pick([200, 400, 500, 600, 800]), small = r.pick([0.01, 0.02, 0.05]), k = r.pick([2, 4, 5]), big = n(small * k), pb = n(F2 / big), ps = n(F2 / small);
      return { q: ['The same ' + F2 + ' N presses on ' + big + ' m² and then on ' + small + ' m². How many times bigger is the pressure on the smaller area?', 'القوة نفسها ' + F2 + ' N تضغط على ' + big + ' m² ثم على ' + small + ' m². كم مرة يكون الضغط على المساحة الأصغر أكبر؟'], a: k,
        s: [['On the larger area', 'على المساحة الأكبر', F2 + ' ÷ ' + big + ' =', pb, 'Pa'], ['On the smaller area', 'على المساحة الأصغر', F2 + ' ÷ ' + small + ' =', ps, 'Pa'], ['Compare', 'قارن', ps + ' ÷ ' + pb + ' =', k]], miss: [[n(1 / k, 3), 'The smaller area has the bigger pressure, so the answer is more than 1.', 'المساحة الأصغر ضغطها أكبر، فالجواب أكبر من ١.']] };
    },
    trap: function (r) { var F = r.int(2, 9) * 100, A0 = r.pick([2, 4, 5]); return { q: ['Find the pressure of ' + F + ' N on ' + A0 + ' m². One line is wrong. Tap it.', 'أوجد ضغط ' + F + ' N على ' + A0 + ' m². سطر واحد خاطئ. انقر عليه.'], w: 1, why: ['Pressure is force divided by area, not multiplied: ' + F + ' ÷ ' + A0 + ' = ' + (F / A0) + ' Pa.', 'الضغط هو القوة مقسومة على المساحة لا مضروبة: ' + F + ' ÷ ' + A0 + ' = ' + (F / A0) + ' Pa.'], l: [['Pressure = force ÷ area', 'الضغط = القوة ÷ المساحة'], F + ' × ' + A0 + ' = ' + (F / A0) + ' Pa', ['A smaller area would give more pressure', 'المساحة الأصغر تعطي ضغطًا أكبر']] }; },
    explain: [['Why do snowshoes stop you sinking into snow?', 'لماذا تمنعك أحذية الثلج العريضة من الغوص فيه؟'], ['They spread your weight over a bigger area, so the pressure is smaller.', 'توزع وزنك على مساحة أكبر فيقل الضغط.'], ['They make you lighter.', 'تجعلك أخف وزنًا.'], ['They make the snow harder.', 'تجعل الثلج أصلب.']]
  });

  var MAG = [['iron', 'الحديد'], ['steel', 'الفولاذ'], ['nickel', 'النيكل'], ['cobalt', 'الكوبالت']], NOT = [['copper', 'النحاس', 'Copper is a metal, but it is not magnetic.', 'النحاس فلز لكنه غير مغناطيسي.'], ['aluminium', 'الألومنيوم', 'Aluminium cans are not attracted to a magnet.', 'علب الألومنيوم لا ينجذب إليها المغناطيس.'], ['gold', 'الذهب', 'Gold is a metal, but it is not magnetic.', 'الذهب فلز لكنه غير مغناطيسي.'], ['plastic', 'البلاستيك', 'Plastic is not magnetic.', 'البلاستيك غير مغناطيسي.'], ['wood', 'الخشب', 'Wood is not magnetic.', 'الخشب غير مغناطيسي.']];
  teach('s7.magnet', {
    why: ['Magnets run motors, speakers and hard drives, and a compass guided travellers and the direction of prayer for centuries.', 'المغانط تشغّل المحركات ومكبرات الصوت، والبوصلة هدت المسافرين وأعانت على معرفة اتجاه القبلة قرونًا.'],
    idea: [['Every magnet has a north pole and a south pole. Like poles push apart. Opposite poles pull together.', 'لكل مغناطيس قطب شمالي وقطب جنوبي. القطبان المتشابهان يتنافران، والمختلفان يتجاذبان.'],
      ['Only a few metals are magnetic: iron, steel, nickel and cobalt. Most metals, such as copper and aluminium, are not.', 'قليل من الفلزات مغناطيسي: الحديد والفولاذ والنيكل والكوبالت. وأكثر الفلزات، كالنحاس والألومنيوم، ليست كذلك.'],
      ['Earth acts like a giant magnet. A compass needle is a small magnet that lines up with Earth\'s field and points north.', 'الأرض تعمل كمغناطيس ضخم، وإبرة البوصلة مغناطيس صغير يصطف مع مجال الأرض فيشير إلى الشمال.']],
    g: function (r, lv) {
      if (lv === 1) {
        var a = r.pick(['N', 'S']), b = r.pick(['N', 'S']), same = a === b, nm = { N: ['north', 'شمالي', 'شماليًا'], S: ['south', 'جنوبي', 'جنوبيًا'] };
        var att = ['They pull together', 'يتجاذبان'], rep = ['They push apart', 'يتنافران'];
        return { q: ['A ' + nm[a][0] + ' pole faces a ' + nm[b][0] + ' pole. What happens?', 'قطب ' + nm[a][1] + ' يقابل قطبًا ' + nm[b][2] + '. ماذا يحدث؟'],
          o: [same ? rep : att, same ? att.concat(['Like poles push apart.', 'المتشابهان يتنافران.']) : rep.concat(['Opposite poles pull together.', 'المختلفان يتجاذبان.']), ['Nothing happens until they touch', 'لا يحدث شيء حتى يتلامسا', 'Magnets act across a gap.', 'المغانط تؤثر عبر الفراغ.']],
          s: [w(['Compare the two poles', 'قارن القطبين'], ['These two poles are', 'هذان القطبان'], same ? ['the same', 'متشابهان'] : ['opposite', 'مختلفان'], '', [same ? ['opposite', 'مختلفان'] : ['the same', 'متشابهان']]), w(['Like repel, opposite attract', 'المتشابهان يتنافران والمختلفان يتجاذبان'], ['So they', 'إذن'], same ? ['repel', 'يتنافران'] : ['attract', 'يتجاذبان'], '', [same ? ['attract', 'يتجاذبان'] : ['repel', 'يتنافران']])] };
      }
      if (lv === 2) {
        var m = r.pick(MAG), x = r.shuffle(NOT).slice(0, 3);
        return { q: ['Which of these will a magnet pick up?', 'أي هذه يلتقطه المغناطيس؟'], o: [[m[0][0].toUpperCase() + m[0].slice(1) + ' nail', 'مسمار من ' + m[1]]].concat(x.map(function (y) { return [y[0][0].toUpperCase() + y[0].slice(1) + ' nail', 'مسمار من ' + y[1], y[2], y[3]]; })),
          s: [w(['Only iron, steel, nickel and cobalt are magnetic', 'المغناطيسي هو الحديد والفولاذ والنيكل والكوبالت فقط'], [m[0][0].toUpperCase() + m[0].slice(1) + ' is', m[1]], ['magnetic', 'مغناطيسي'], '', [['not magnetic', 'غير مغناطيسي']]), w(null, [x[0][0][0].toUpperCase() + x[0][0].slice(1) + ' is', x[0][1]], ['not magnetic', 'غير مغناطيسي'], '', [['magnetic', 'مغناطيسي', x[0][2], x[0][3]]])] };
      }
      if (r.bool()) return { q: ['A compass\'s north pole points to Earth\'s geographic north. What kind of magnetic pole must be up there?', 'القطب الشمالي للبوصلة يشير إلى الشمال الجغرافي للأرض. أي قطب مغناطيسي يجب أن يكون هناك؟'],
        o: [['A magnetic south pole', 'قطب مغناطيسي جنوبي'], ['A magnetic north pole', 'قطب مغناطيسي شمالي', 'Two north poles would push apart, and the needle would point away.', 'القطبان الشماليان يتنافران، فتشير الإبرة بعيدًا.'], ['No pole at all', 'لا قطب أبدًا', 'Something must be attracting the needle.', 'لا بد أن شيئًا يجذب الإبرة.']],
        s: [w(['The needle\'s north is pulled there', 'شمال الإبرة ينجذب إلى هناك'], ['A north pole is attracted to a', 'القطب الشمالي ينجذب إلى قطب'], ['south pole', 'جنوبي'], '', [['north pole', 'شمالي']]), w(null, ['So near the geographic north there is a magnetic', 'إذن قرب الشمال الجغرافي قطب مغناطيسي'], ['south pole', 'جنوبي'], '', [['north pole', 'شمالي']])] };
      var ways = r.shuffle([[['Wind more turns of wire', 'زد عدد لفات السلك']], [['Use a bigger current', 'استعمل تيارًا أكبر']], [['Put an iron core inside the coil', 'ضع قلبًا من الحديد داخل الملف']]])[0][0];
      return { q: ['How can you make an electromagnet stronger?', 'كيف تجعل المغناطيس الكهربائي أقوى؟'], o: [ways, ['Use a copper core instead of iron', 'استعمل قلبًا من النحاس بدل الحديد', 'Copper is not magnetic, so it does not help.', 'النحاس غير مغناطيسي فلا يفيد.'], ['Use fewer turns of wire', 'قلل عدد لفات السلك', 'Fewer turns make it weaker.', 'اللفات الأقل تجعله أضعف.'], ['Switch the current off', 'افصل التيار', 'With no current there is no magnet at all.', 'بلا تيار لا يوجد مغناطيس أصلًا.']],
        s: [w(['A current in a coil makes a magnetic field', 'التيار في الملف يولد مجالًا مغناطيسيًا'], ['More current or more turns make the field', 'تيار أكبر أو لفات أكثر تجعل المجال'], ['stronger', 'أقوى'], '', [['weaker', 'أضعف']]), w(['Iron concentrates the field', 'الحديد يركّز المجال'], ['An iron core makes it', 'القلب الحديدي يجعله'], ['stronger', 'أقوى'], '', [['weaker', 'أضعف']])] };
    },
    trap: function () { return { q: ['A student explains which things a magnet attracts. One line is wrong. Tap it.', 'طالب يشرح ما يجذبه المغناطيس. سطر واحد خاطئ. انقر عليه.'], w: 1, why: ['Not all metals are magnetic. Copper, aluminium and gold are not.', 'ليست كل الفلزات مغناطيسية؛ فالنحاس والألومنيوم والذهب ليست كذلك.'], l: [['An iron nail is attracted', 'مسمار الحديد ينجذب'], ['All metals are attracted, so a copper coin is too', 'كل الفلزات تنجذب، إذن تنجذب قطعة النحاس أيضًا'], ['A plastic ruler is not attracted', 'المسطرة البلاستيكية لا تنجذب']] }; },
    explain: [['Why does a compass point north?', 'لماذا تشير البوصلة إلى الشمال؟'], ['Its needle is a magnet, and it lines up with Earth\'s magnetic field.', 'إبرتها مغناطيس يصطف مع المجال المغناطيسي للأرض.'], ['North is heavier, so the needle falls that way.', 'الشمال أثقل فتميل الإبرة إليه.'], ['The needle is pulled towards the Sun.', 'الإبرة تنجذب نحو الشمس.']]
  });

  teach('s7.circuit', {
    why: ['Every house, phone and car is wired using these two patterns. Knowing them keeps you safe and lets you fix things.', 'كل بيت وهاتف وسيارة موصول بهذين النمطين، ومعرفتهما تحفظ سلامتك وتمكّنك من الإصلاح.'],
    idea: [{ p: ['In series there is one path. The same current goes through every part, and the voltage is shared between them.', 'في التوالي مسار واحد؛ يمر التيار نفسه في كل جزء، ويتقاسم الأجزاء الجهد.'], dia: function () { return D.circuit({ kind: 'series', n: 2, cell: '6 V', parts: ['3 V', '3 V'] }); } },
      { p: ['In parallel each part has its own branch. Every branch gets the full voltage, and the currents add up to the total.', 'في التوازي لكل جزء فرع خاص به؛ ينال كل فرع الجهد كاملًا، وتُجمع تيارات الفروع لتعطي التيار الكلي.'], dia: function () { return D.circuit({ kind: 'parallel', n: 2, cell: '6 V', parts: ['6 V', '6 V'] }); } },
      ['So if one bulb breaks in series, all go out. In parallel, the others stay on.', 'لذلك إن تعطل مصباح في التوالي انطفأ الجميع، وفي التوازي تبقى البقية مضيئة.']],
    g: function (r, lv) {
      if (lv === 1) { var k = r.pick([2, 3, 4]), each = r.pick([1.5, 2, 3, 4]), V = n(k * each);
        return { q: [k + ' identical bulbs are in series with a ' + V + ' V battery. What voltage does each bulb get?', cnt(k, 'مصباح', 'مصباحان متماثلان', 'مصابيح متماثلة', 'مصباحًا') + ' على التوالي مع بطارية ' + V + ' V. ما جهد كل مصباح؟'], a: each, dia: D.circuit({ kind: 'series', n: k, cell: V + ' V' }),
          s: [['In series the voltage is shared', 'في التوالي يُقسم الجهد', V + ' ÷ ' + k + ' =', each, 'V']], miss: [[V, 'That would be true in parallel. In series they share it.', 'هذا صحيح في التوازي، أما في التوالي فيتقاسمونه.']] }; }
      if (lv === 2) { var i1 = n(r.int(2, 9) / 10, 1), i2 = n(r.int(2, 9) / 10, 1), V2 = r.pick([3, 6, 9, 12]);
        return { q: ['Two bulbs are in parallel on ' + V2 + ' V. One branch carries ' + i1 + ' A and the other ' + i2 + ' A. What current leaves the battery?', 'مصباحان على التوازي على ' + V2 + ' V. أحد الفرعين يحمل ' + i1 + ' A والآخر ' + i2 + ' A. ما التيار الخارج من البطارية؟'], a: n(i1 + i2), dia: D.circuit({ kind: 'parallel', n: 2, cell: V2 + ' V', parts: [i1 + ' A', i2 + ' A'] }),
          s: [['In parallel, branch currents add', 'في التوازي تُجمع تيارات الفروع', i1 + ' + ' + i2 + ' =', n(i1 + i2), 'A']], miss: [[n(Math.abs(i1 - i2)), 'The currents join up, so add them.', 'التيارات تلتقي، فاجمعها.']] }; }
      if (r.bool()) { var Vt = r.pick([6, 9, 12]), v1 = r.int(1, Vt - 1);
        return { q: ['A lamp and a motor are in series on a ' + Vt + ' V battery. The lamp gets ' + v1 + ' V. What voltage does the motor get?', 'مصباح ومحرك على التوالي مع بطارية ' + Vt + ' V. ينال المصباح ' + v1 + ' V. ما جهد المحرك؟'], a: Vt - v1, dia: D.circuit({ kind: 'series', n: 2, cell: Vt + ' V', parts: [v1 + ' V', '?'] }),
          s: [['Series voltages add up to the battery', 'جهود التوالي مجموعها جهد البطارية', Vt + ' − ' + v1 + ' =', Vt - v1, 'V']], miss: [[Vt, 'In series the parts share the voltage, so the motor gets what is left.', 'في التوالي تتقاسم الأجزاء الجهد، فينال المحرك ما تبقى.']] }; }
      var par = r.bool();
      return { q: ['Three bulbs are wired in ' + (par ? 'parallel' : 'series') + '. One bulb breaks. What happens to the other two?', 'ثلاثة مصابيح موصولة على ' + (par ? 'التوازي' : 'التوالي') + '. تعطل مصباح واحد. ماذا يحدث للمصباحين الآخرين؟'], dia: D.circuit({ kind: par ? 'parallel' : 'series', n: 3, cell: '' }),
        o: par ? [['They stay on', 'يبقيان مضيئين'], ['They both go out', 'ينطفئان معًا', 'In parallel each bulb has its own path.', 'في التوازي لكل مصباح مساره.'], ['They get brighter and burn out', 'يزداد ضوؤهما ثم يحترقان', 'Each branch still gets the same voltage.', 'كل فرع ما زال ينال الجهد نفسه.']] : [['They both go out', 'ينطفئان معًا'], ['They stay on', 'يبقيان مضيئين', 'In series there is only one path, and it is now broken.', 'في التوالي مسار واحد فقط، وقد انقطع.'], ['Only the next bulb goes out', 'ينطفئ المصباح التالي فقط', 'The break stops the current everywhere in the loop.', 'الانقطاع يوقف التيار في الدائرة كلها.']],
        s: [w(['Count the paths', 'عُدّ المسارات'], ['In ' + (par ? 'parallel' : 'series') + ' there is', 'في ' + (par ? 'التوازي' : 'التوالي')], par ? ['a path for each bulb', 'مسار لكل مصباح'] : ['one path for all', 'مسار واحد للجميع'], '', [par ? ['one path for all', 'مسار واحد للجميع'] : ['a path for each bulb', 'مسار لكل مصباح']])] };
    },
    trap: function (r) { var V = r.pick([6, 12]); return { q: ['Two identical bulbs in series on ' + V + ' V. One line is wrong. Tap it.', 'مصباحان متماثلان على التوالي على ' + V + ' V. سطر واحد خاطئ. انقر عليه.'], w: 1, why: ['In series the bulbs share the voltage: ' + (V / 2) + ' V each.', 'في التوالي يتقاسم المصباحان الجهد: ' + (V / 2) + ' V لكل منهما.'], l: [['There is one path, so the same current flows through both', 'مسار واحد، فيمر التيار نفسه في الاثنين'], ['Each bulb gets the full ' + V + ' V', 'كل مصباح ينال ' + V + ' V كاملة'], ['If one breaks, the other goes out', 'إن تعطل أحدهما انطفأ الآخر']] }; },
    explain: [['Why are the lights in a house wired in parallel?', 'لماذا توصل مصابيح البيت على التوازي؟'], ['Each one gets the full voltage and can be switched on its own, and one failing does not stop the others.', 'كل مصباح ينال الجهد كاملًا ويُشغَّل وحده، وتعطّل أحدها لا يوقف البقية.'], ['Parallel wiring uses less electricity in total.', 'التوازي يستهلك كهرباء أقل في المجموع.'], ['Series wiring is not allowed to carry current.', 'التوالي لا يسمح بمرور التيار.']]
  });

  teach('s7.stars', {
    why: ['Looking at the sky is looking back in time. Scale is also how we see how small we are, and how vast is what Allah created.', 'النظر إلى السماء نظر إلى الماضي، والحجم يرينا كم نحن صغار، وكم هو واسع ما خلق الله.'],
    idea: [['Light is the fastest thing there is: about 300 000 km every second.', 'الضوء أسرع شيء موجود: نحو ٣٠٠ ٠٠٠ km في كل ثانية.'],
      ['Even so, starlight takes years to arrive. A light-year is a distance: how far light travels in one year.', 'ومع ذلك يستغرق ضوء النجوم سنوات ليصل. والسنة الضوئية مسافة: ما يقطعه الضوء في سنة واحدة.'],
      ['A star 100 light-years away is seen as it was 100 years ago. Many stars keep Arabic names from Muslim astronomers, such as Aldebaran, from ad-Dabarān.', 'النجم الذي يبعد ١٠٠ سنة ضوئية نراه كما كان قبل ١٠٠ سنة. وكثير من النجوم تحمل أسماء عربية من الفلكيين المسلمين، مثل «الدبران»، الذي ما زال اسمه العربي مستعملًا في الفلك.']],
    g: function (r, lv) {
      if (lv === 1) { var t = r.int(2, 9);
        return { q: ['Light travels 300000 km each second. How far does it go in ' + t + ' s?', 'يقطع الضوء 300000 km في الثانية. كم يقطع في ' + t + ' s؟'], a: 300000 * t,
          s: [['Distance = speed × time', 'المسافة = السرعة × الزمن', '300000 × ' + t + ' =', 300000 * t, 'km']], miss: [[300000 / t, 'More time means more distance, so multiply.', 'زمن أطول يعني مسافة أطول، فاضرب.']] }; }
      if (lv === 2) { var d = r.pick([[384000, 1.28, ['the Moon', 'القمر']], [150000000, 500, ['the Sun', 'الشمس']], [60000000, 200, ['Mars, when close', 'المريخ حين يقترب']], [30000, 0.1, ['a satellite far out', 'قمر صناعي بعيد']]]);
        return { q: ['Light leaves ' + d[2][0] + ', ' + d[0] + ' km away, at 300000 km/s. How many seconds does it take to reach us?', 'ينطلق الضوء من ' + d[2][1] + ' على بعد ' + d[0] + ' km بسرعة 300000 km/s. كم ثانية يستغرق ليصلنا؟'], a: d[1],
          s: [['Time = distance ÷ speed', 'الزمن = المسافة ÷ السرعة', d[0] + ' ÷ 300000 =', d[1], 's']], miss: [[n(300000 / d[0], 6), 'Divide the distance by the speed, not the other way.', 'اقسم المسافة على السرعة، لا العكس.']] }; }
      var a = r.pick([4, 8, 10, 25]), k = r.pick([5, 10, 20, 50]), b = a * k;
      return { q: ['Star A is ' + a + ' light-years away. Star B is ' + b + ' light-years away. How many times longer has B\'s light been travelling?', 'النجم A يبعد ' + yrs(a) + '، والنجم B يبعد ' + yrs(b) + '. كم مرة يكون زمن سفر ضوء B أطول؟'], a: k,
        s: [w(['A light-year is the distance light travels in a year', 'السنة الضوئية مسافة يقطعها الضوء في سنة'], ['B\'s light left', 'ضوء B انطلق قبل'], [b + ' years ago', b + ' سنة'], '', [[b + ' days ago', b + ' يومًا'], ['tonight', 'الليلة', 'Starlight takes years to reach us.', 'ضوء النجوم يستغرق سنوات ليصلنا.']]), ['Compare', 'قارن', b + ' ÷ ' + a + ' =', k]], miss: [[b - a, 'How many times means divide, not subtract.', '«كم مرة» تعني القسمة لا الطرح.']] };
    },
    trap: function () { return { q: ['A student writes about a star 50 light-years away. One line is wrong. Tap it.', 'طالب يكتب عن نجم يبعد ٥٠ سنة ضوئية. سطر واحد خاطئ. انقر عليه.'], w: 0, why: ['A light-year measures distance, not time.', 'السنة الضوئية تقيس المسافة لا الزمن.'], l: [['A light-year is a length of time', 'السنة الضوئية مدة زمنية'], ['Its light set off 50 years ago', 'ضوؤه انطلق قبل ٥٠ سنة'], ['We see the star as it was then', 'نرى النجم كما كان حينها']] }; },
    explain: [['Why might a star we see tonight no longer be there?', 'لماذا قد لا يكون النجم الذي نراه الليلة موجودًا الآن؟'], ['Its light left long ago, so we see it as it was, not as it is now.', 'ضوؤه انطلق منذ زمن بعيد، فنراه كما كان لا كما هو الآن.'], ['Stars move too fast for our eyes.', 'النجوم أسرع من أن تراها عيوننا.'], ['Clouds hide stars that have gone.', 'الغيوم تخفي النجوم التي زالت.']]
  });

  teach('s7.jazari', {
    keep: true,
    g: function (r, lv) {
      if (lv === 1) { var s = r.pick([8, 10, 12, 15]), k = r.pick([2, 3, 4]), b = s * k;
        return { q: ['In one of al-Jazarī\'s machines, a wheel with ' + b + ' teeth turns a gear with ' + s + ' teeth. One turn of the big wheel turns the small gear how many times?', 'في إحدى آلات الجزري عجلة لها ' + teeth(b) + ' تدير ترسًا له ' + teeth(s) + '. دورة واحدة للعجلة الكبيرة تدير الترس الصغير كم مرة؟'], a: k,
          s: [['Teeth on the driver ÷ teeth on the driven gear', 'أسنان الدافع ÷ أسنان المدفوع', b + ' ÷ ' + s + ' =', k]], miss: [[n(s / b, 3), 'The small gear turns faster, so the answer is more than 1.', 'الترس الصغير أسرع دورانًا، فالجواب أكبر من ١.']] }; }
      if (lv === 2) { var s2 = r.pick([10, 12, 20]), k2 = r.pick([2, 3, 5]), tr = r.int(2, 6);
        return { q: ['A ' + (s2 * k2) + '-tooth gear drives a ' + s2 + '-tooth gear. The big gear turns ' + tr + ' times. How many times does the small one turn?', 'ترس له ' + teeth(s2 * k2) + ' يدير ترسًا له ' + teeth(s2) + '. دار الكبير ' + times(tr) + '. كم مرة دار الصغير؟'], a: k2 * tr,
          s: [['Turns of the small gear for one big turn', 'دورات الصغير لكل دورة للكبير', (s2 * k2) + ' ÷ ' + s2 + ' =', k2], ['Then for ' + tr + ' turns', 'ثم لـ ' + cnt(tr, 'دورة', 'دورتين', 'دورات', 'دورة'), k2 + ' × ' + tr + ' =', k2 * tr]], miss: [[tr, 'The small gear turns more often than the big one.', 'الترس الصغير يدور أكثر من الكبير.']] }; }
      var big = r.pick([40, 60]), sm = r.pick([10, 20]), k3 = big / sm;
      return { q: ['A water wheel turns a ' + big + '-tooth gear that drives a ' + sm + '-tooth gear. What does the small gear gain, and what does it give up?', 'ناعورة تدير ترسًا له ' + teeth(big) + ' يدير ترسًا له ' + teeth(sm) + '. ماذا يكسب الترس الصغير وماذا يخسر؟'],
        o: [['It turns ' + k3 + ' times faster, with less turning force', 'يدور أسرع بـ ' + times(k3) + ' وبقوة دوران أقل'], ['It turns faster and with more force', 'يدور أسرع وبقوة أكبر', 'A gear cannot give both: energy is not made from nothing.', 'لا يعطي الترس الأمرين معًا؛ فالطاقة لا تأتي من العدم.'], ['It turns more slowly, with less force', 'يدور أبطأ وبقوة أقل', 'Fewer teeth means it turns faster.', 'الأسنان الأقل تعني دورانًا أسرع.']],
        s: [['Turns per big turn', 'دورات لكل دورة كبيرة', big + ' ÷ ' + sm + ' =', k3], w(['Energy in is energy out, at best', 'الطاقة الخارجة لا تزيد على الداخلة'], ['Faster turning comes with', 'الدوران الأسرع يأتي مع'], ['less force', 'قوة أقل'], '', [['more force', 'قوة أكبر', 'That would make energy from nothing.', 'هذا يصنع طاقة من العدم.']])] };
    },
    trap: function () { return { q: ['A 30-tooth gear drives a 10-tooth gear. One line is wrong. Tap it.', 'ترس له ٣٠ سنًا يدير ترسًا له ١٠ أسنان. سطر واحد خاطئ. انقر عليه.'], w: 0, why: ['30 ÷ 10 = 3: the small gear turns 3 times for every turn of the big one.', '٣٠ ÷ ١٠ = ٣: الترس الصغير يدور ٣ مرات لكل دورة للكبير.'], l: ['30 ÷ 10 = 0.3', ['So the small gear turns faster', 'إذن يدور الترس الصغير أسرع'], ['It turns with less force', 'ويدور بقوة أقل']] }; },
    explain: [['Why did al-Jazarī draw his machines so carefully?', 'لماذا رسم الجزري آلاته بعناية شديدة؟'], ['So that others could build and test them from the drawings alone.', 'ليتمكن غيره من بنائها واختبارها من الرسوم وحدها.'], ['Because the drawings were the machines.', 'لأن الرسوم كانت هي الآلات نفسها.'], ['To keep his methods secret.', 'ليُبقي طرقه سرًا.']]
  });

  teach('s7.method', {
    why: ['Honest evidence is how science corrects itself. It is also amānah: a trust we carry when we report what we saw.', 'الدليل الأمين هو ما يصحح به العلم نفسه، وهو أمانة نحملها حين ننقل ما رأينا.'],
    idea: [['Change one thing (the independent variable). Measure one thing (the dependent variable). Keep everything else the same (control variables).', 'غيّر شيئًا واحدًا (المتغير المستقل)، وقِس شيئًا واحدًا (المتغير التابع)، وثبّت كل ما عداهما (المتغيرات الضابطة).'],
      ['Repeat the test and take the mean: add the results and divide by how many there are.', 'كرّر التجربة وخذ المتوسط: اجمع النتائج واقسم على عددها.'],
      ['A result that does not fit is an outlier. Find out why before you leave it out, and say that you did.', 'النتيجة التي لا تتسق مع غيرها قيمة شاذة؛ ابحث عن سببها قبل أن تستبعدها، واذكر أنك استبعدتها.']],
    g: function (r, lv) {
      if (lv === 1) { var m = r.int(10, 40), d = r.int(1, 3), v = r.shuffle([m - d, m, m + d]);
        return { q: ['Three repeats of a test gave ' + v.join(', ') + ' seconds. What is the mean?', 'أُجريت تجربة ثلاث مرات فأعطت ' + v.join('، ') + ' ثانية. ما المتوسط؟'], a: m,
          s: [['Add the results', 'اجمع النتائج', v.join(' + ') + ' =', 3 * m], ['Divide by how many', 'اقسم على عددها', (3 * m) + ' ÷ 3 =', m]], miss: [[3 * m, 'That is the total. Now divide by 3.', 'هذا المجموع. اقسمه الآن على ٣.']] }; }
      if (lv === 2) {
        var tests = [[['You test whether the height of a ramp changes how far a toy car rolls.', 'تختبر هل يغيّر ارتفاع المنحدر المسافة التي تقطعها سيارة لعبة.'], ['the ramp height', 'ارتفاع المنحدر'], ['the distance rolled', 'المسافة المقطوعة'], ['the same car', 'السيارة نفسها']], [['You test whether water temperature changes how fast sugar dissolves.', 'تختبر هل تغيّر حرارة الماء سرعة ذوبان السكر.'], ['the water temperature', 'حرارة الماء'], ['the time to dissolve', 'زمن الذوبان'], ['the same amount of sugar', 'كمية السكر نفسها']], [['You test whether the amount of light changes how tall cress grows.', 'تختبر هل تغيّر كمية الضوء طول نبات الرشاد.'], ['the amount of light', 'كمية الضوء'], ['the height of the cress', 'طول النبات'], ['the same water each day', 'الماء نفسه كل يوم']]];
        var t = r.pick(tests), ask = r.pick(['iv', 'dv']);
        return { q: [t[0][0] + ' Which is the ' + (ask === 'iv' ? 'independent variable, the one you change' : 'dependent variable, the one you measure') + '?', t[0][1] + ' ما ' + (ask === 'iv' ? 'المتغير المستقل الذي تغيّره' : 'المتغير التابع الذي تقيسه') + '؟'],
          o: ask === 'iv' ? [t[1], t[2].concat(['That is what you measure.', 'هذا ما تقيسه.']), t[3].concat(['That is kept the same.', 'هذا يبقى ثابتًا.'])] : [t[2], t[1].concat(['That is what you change.', 'هذا ما تغيّره.']), t[3].concat(['That is kept the same.', 'هذا يبقى ثابتًا.'])],
          s: [w(['Ask: what do I change on purpose?', 'اسأل: ما الذي أغيّره عمدًا؟'], ['I change', 'أغيّر'], t[1], '', [t[2], t[3]]), w(['Ask: what do I measure?', 'اسأل: ما الذي أقيسه؟'], ['I measure', 'أقيس'], t[2], '', [t[1], t[3]])] };
      }
      var m3 = r.int(10, 30), out = m3 + r.int(12, 25), v3 = r.shuffle([m3 - 1, m3, m3 + 1]), all = v3.concat([out]);
      return { q: ['Four repeats gave ' + all.join(', ') + '. One is an outlier you checked: the timer was started late. What is the mean of the other three?', 'أُجريت تجربة أربع مرات فأعطت ' + all.join('، ') + '. إحداها قيمة شاذة تحققت منها: بدأ المؤقت متأخرًا. ما متوسط الثلاث الأخرى؟'], a: m3,
        s: [w(['The outlier does not fit the pattern', 'القيمة الشاذة لا تتسق مع النمط'], ['The outlier is', 'القيمة الشاذة هي'], [String(out), String(out)], '', [[String(v3[0]), String(v3[0])], [String(v3[1]), String(v3[1])]]), ['Add the other three', 'اجمع الثلاث الأخرى', v3.join(' + ') + ' =', 3 * m3], ['Divide by 3', 'اقسم على ٣', (3 * m3) + ' ÷ 3 =', m3]], miss: [[n((3 * m3 + out) / 4, 2), 'That mean includes the outlier you found.', 'هذا المتوسط يشمل القيمة الشاذة التي وجدتها.']] };
    },
    trap: function (r) { var a = r.int(10, 20); return { q: ['A student\'s results were ' + a + ', ' + (a + 1) + ' and ' + (a + 2) + '. One line is wrong. Tap it.', 'نتائج طالب ' + a + ' و' + (a + 1) + ' و' + (a + 2) + '. سطر واحد خاطئ. انقر عليه.'], w: 1, why: ['The total is ' + (3 * a + 3) + ', and the mean divides it by 3.', 'المجموع ' + (3 * a + 3) + '، والمتوسط قسمته على ٣.'], l: [a + ' + ' + (a + 1) + ' + ' + (a + 2) + ' = ' + (3 * a + 3), (3 * a + 3) + ' ÷ 3 = ' + (a + 2), ['I kept the results I did not like', 'أبقيت النتائج التي لم تعجبني']] }; },
    explain: [['Your results disagree with what you predicted. What should you do?', 'نتائجك تخالف توقعك. ماذا تفعل؟'], ['Report them honestly, check the method, and repeat if you can.', 'انقلها بأمانة، وراجع الطريقة، وكرر إن استطعت.'], ['Change the numbers so they match the prediction.', 'غيّر الأرقام لتوافق التوقع.'], ['Leave out every result that disagrees.', 'احذف كل نتيجة تخالفه.']]
  });
})();
