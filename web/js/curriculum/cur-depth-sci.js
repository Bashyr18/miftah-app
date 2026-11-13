/* Depth pass, physics and chemistry. Each lesson gets a worked example, numbers that change every time, and questions that test the idea from another side.
   deep(id, pages, makers): pages are [en, ar]; a maker is a question row, or a function (r) => step. */
(function () {
  'use strict';
  var C = window.C, deep = C.deep;
  /* a numeric answer typed on the pad */
  function n(p, eq, a, hint) { return { k: 'pad', p: p, eq: eq, a: a, err: 'understanding', hint: hint }; }
  var CALC = ['Calculate.', 'احسب.'];

  /* ---------- physics, Year 8 to 9 ---------- */
  deep('p8.speed', [['Worked: a car goes 150 m in 6 s. Speed = 150 ÷ 6 = 25 m/s. If it gains 10 m/s in 5 s, acceleration = 10 ÷ 5 = 2 m/s².', 'مثال محلول: تقطع سيارة ١٥٠ م في ٦ ث. السرعة = ١٥٠ ÷ ٦ = ٢٥ م/ث. وإن زادت ١٠ م/ث في ٥ ث فالتسارع = ١٠ ÷ ٥ = ٢ م/ث².']], [
    function (r) { var t = r.int(3, 12), v = r.int(4, 25); return n(['Speed in m/s.', 'السرعة بوحدة م/ث.'], (v * t) + ' m in ' + t + ' s', v); },
    function (r) { var t = r.int(3, 9), v = r.int(4, 20); return n(['Distance in metres.', 'المسافة بالأمتار.'], v + ' m/s for ' + t + ' s', v * t); },
    function (r) { var t = r.int(2, 8), a = r.int(2, 6); return n(['Acceleration in m/s².', 'التسارع بوحدة م/ث².'], 'gains ' + (a * t) + ' m/s in ' + t + ' s', a); }
  ]);
  deep('p8.newton', [['Worked: a net force of 20 N acts on 4 kg. a = F ÷ m = 5 m/s². A book at rest still has two forces on it, weight and the table’s push, and they cancel.', 'مثال محلول: قوة محصلة ٢٠ نيوتن على ٤ كغ. ت = ق ÷ ك = ٥ م/ث². والكتاب الساكن عليه قوتان: وزنه ودفع الطاولة، ويتعادلان.']], [
    function (r) { var m = r.int(2, 12), a = r.int(2, 9); return n(['Force in newtons.', 'القوة بالنيوتن.'], m + ' kg × ' + a + ' m/s²', m * a); },
    function (r) { var m = r.int(2, 9), a = r.int(2, 8); return n(['Acceleration in m/s².', 'التسارع بوحدة م/ث².'], (m * a) + ' N on ' + m + ' kg', a); },
    [['A car moves at a steady speed in a straight line. The net force is:', 'سيارة تسير بسرعة ثابتة في خط مستقيم. القوة المحصلة:'], ['Zero', 'صفر'], ['Forward', 'إلى الأمام'], ['Equal to its weight', 'تساوي وزنها']],
    [['You push a wall and it pushes back. These two forces:', 'تدفع جدارًا فيدفعك. هاتان القوتان:'], ['Act on different objects', 'تؤثران في جسمين مختلفين'], ['Cancel out', 'تلغي إحداهما الأخرى'], ['Are unequal', 'غير متساويتين']]
  ]);
  deep('p8.energy', [['Worked: a motor takes 200 J and gives 150 J useful. Efficiency = 150 ÷ 200 = 75%. The other 50 J is not gone: it warms the surroundings.', 'مثال محلول: يأخذ محرك ٢٠٠ جول ويعطي ١٥٠ جول نافعة. الكفاءة = ١٥٠ ÷ ٢٠٠ = ٧٥٪. والخمسون الباقية لم تفنَ، بل تدفئ المحيط.']], [
    function (r) { var e = r.pick([200, 400, 500, 800, 1000]), p = r.pick([25, 40, 50, 60, 75]); return n(['Efficiency, as a percentage.', 'الكفاءة نسبة مئوية.'], (e * p / 100) + ' J useful from ' + e + ' J', p); },
    function (r) { var e = r.pick([100, 200, 300, 500]), u = e * r.pick([30, 50, 70]) / 100; return n(['Energy wasted, in joules.', 'الطاقة المهدرة بالجول.'], e + ' J in, ' + u + ' J useful', e - u); },
    [['A ball is dropped. As it falls, energy moves from:', 'تسقط كرة. تنتقل الطاقة من:'], ['Gravity store to kinetic store', 'مخزن الجاذبية إلى مخزن الحركة'], ['Kinetic to gravity', 'الحركة إلى الجاذبية'], ['Chemical to nuclear', 'الكيميائي إلى النووي']]
  ]);
  deep('p8.work', [['Worked: lift with 50 N through 4 m. Work = 200 J. Do it in 10 s, and power = 200 ÷ 10 = 20 W.', 'مثال محلول: ترفع بقوة ٥٠ نيوتن مسافة ٤ م. الشغل = ٢٠٠ جول. وفي ١٠ ث تكون القدرة ٢٠ واط.']], [
    function (r) { var f = r.int(5, 30), d = r.int(2, 12); return n(['Work in joules.', 'الشغل بالجول.'], f + ' N × ' + d + ' m', f * d); },
    function (r) { var t = r.int(2, 10), p = r.int(5, 40); return n(['Power in watts.', 'القدرة بالواط.'], (p * t) + ' J in ' + t + ' s', p); },
    function (r) { var t = r.int(2, 9), p = r.int(10, 60); return n(['Work done in joules.', 'الشغل المبذول بالجول.'], p + ' W for ' + t + ' s', p * t); }
  ]);
  deep('p8.moment', [['Worked: 30 N sits 2 m left of a pivot, a moment of 60 N m. To balance with a force 3 m to the right: 60 ÷ 3 = 20 N.', 'مثال محلول: ٣٠ نيوتن على بعد ٢ م يسار المحور، وعزمها ٦٠ نيوتن·م. وللتوازن بقوة على بعد ٣ م يمينًا: ٦٠ ÷ ٣ = ٢٠ نيوتن.']], [
    function (r) { var f = r.int(5, 40), d = r.int(2, 9); return n(['Moment in N m.', 'العزم بوحدة نيوتن·م.'], f + ' N at ' + d + ' m', f * d); },
    function (r) { var d2 = r.int(2, 6), f2 = r.int(3, 15), d1 = r.pick([2, 3, 4, 6].filter(function (x) { return (f2 * d2) % x === 0; }).concat([1])); return n(['What force balances it, in newtons?', 'ما القوة التي توازنها بالنيوتن؟'], f2 + ' N at ' + d2 + ' m; other side at ' + d1 + ' m', f2 * d2 / d1); }
  ]);
  deep('p8.heat', null, [
    [['Why do metal pans have wooden handles?', 'لماذا مقابض القدور من الخشب؟'], ['Wood conducts heat poorly', 'الخشب ضعيف التوصيل'], ['Wood conducts heat well', 'الخشب جيد التوصيل'], ['Wood reflects heat', 'الخشب يعكس الحرارة']],
    [['Why is a heater placed low in a room?', 'لماذا توضع المدفأة منخفضة؟'], ['Warm air rises, setting up convection', 'يصعد الهواء الدافئ فينشأ الحمل'], ['Heat falls', 'الحرارة تهبط'], ['Radiation needs the floor', 'الإشعاع يحتاج الأرض']],
    [['Which surface emits radiation best?', 'أي سطح يشع أفضل؟'], ['Dull black', 'أسود باهت'], ['Shiny silver', 'فضي لامع'], ['Polished white', 'أبيض مصقول']]
  ]);
  deep('p9.waves', [['Worked: a wave of 50 Hz and wavelength 4 m travels at 50 × 4 = 200 m/s.', 'مثال محلول: موجة ترددها ٥٠ هرتز وطولها ٤ م سرعتها ٥٠ × ٤ = ٢٠٠ م/ث.']], [
    function (r) { var f = r.int(5, 60), l = r.int(2, 12); return n(['Wave speed in m/s.', 'سرعة الموجة م/ث.'], f + ' Hz, ' + l + ' m', f * l); },
    function (r) { var f = r.int(5, 40), l = r.int(2, 10); return n(['Wavelength in metres.', 'الطول الموجي بالمتر.'], (f * l) + ' m/s at ' + f + ' Hz', l); },
    [['In a transverse wave, the vibration is:', 'في الموجة المستعرضة يكون الاهتزاز:'], ['At right angles to the travel', 'عموديًا على الانتشار'], ['Along the travel', 'باتجاه الانتشار'], ['Absent', 'غير موجود']]
  ]);
  deep('p9.em', null, [
    [['Which has the longest wavelength?', 'أيها أطول موجة؟'], ['Radio', 'الراديو'], ['Visible light', 'الضوء المرئي'], ['Gamma', 'جاما']],
    [['Which is used to see inside the body at a hospital?', 'أيها يُرى به داخل الجسم في المستشفى؟'], ['X-rays', 'الأشعة السينية'], ['Microwaves', 'الموجات الدقيقة'], ['Radio', 'الراديو']],
    [['In a vacuum, all of these travel at:', 'في الفراغ تسير كلها بـ:'], ['The same speed', 'السرعة نفسها'], ['Speeds set by frequency', 'سرعة تحددها الترددات'], ['No speed at all', 'لا سرعة']]
  ]);
  deep('p9.ohm', [['Worked: 12 V across 4 Ω gives 3 A. In series, resistances add. In parallel, each branch has the full voltage.', 'مثال محلول: ١٢ فولت عبر ٤ أوم تعطي ٣ أمبير. وعلى التوالي تُجمع المقاومات، وعلى التوازي لكل فرع الجهد كاملًا.']], [
    function (r) { var i = r.int(2, 9), R = r.int(2, 12); return n(['Current in amps.', 'التيار بالأمبير.'], (i * R) + ' V across ' + R + ' Ω', i); },
    function (r) { var i = r.int(2, 9), R = r.int(2, 12); return n(['Voltage in volts.', 'الجهد بالفولت.'], i + ' A through ' + R + ' Ω', i * R); },
    function (r) { var a = r.int(2, 20), b = r.int(2, 20); return n(['Total resistance in series, in ohms.', 'المقاومة الكلية على التوالي بالأوم.'], a + ' Ω + ' + b + ' Ω', a + b); },
    function (r) { var i = r.int(2, 6), R = r.int(2, 8); return n(['Resistance in ohms.', 'المقاومة بالأوم.'], (i * R) + ' V, ' + i + ' A', R); }
  ]);
  deep('p9.power', [['Worked: a 2,000 W kettle on 230 V draws about 8.7 A, so a 13 A fuse suits it and a 3 A fuse would blow.', 'مثال محلول: غلاية ٢٠٠٠ واط على ٢٣٠ فولت تسحب نحو ٨٫٧ أمبير، فيناسبها منصهر ١٣ أمبير، وينصهر منصهر ٣ أمبير.']], [
    function (r) { var v = r.pick([6, 12, 24, 230]), i = r.int(2, 9); return n(['Power in watts.', 'القدرة بالواط.'], v + ' V × ' + i + ' A', v * i); },
    function (r) { var kw = r.int(1, 3), h = r.int(2, 9); return n(['Energy in kilowatt-hours.', 'الطاقة بالكيلوواط ساعة.'], kw + ' kW for ' + h + ' h', kw * h); },
    [['The earth wire is there to:', 'السلك الأرضي من أجل:'], ['Carry current away if a metal case goes live', 'تصريف التيار إذا تكهرب الغلاف المعدني'], ['Make the device faster', 'تسريع الجهاز'], ['Save energy', 'توفير الطاقة']]
  ]);
  deep('p9.radio', [['Worked: 1,600 counts per second and a half-life of 3 days. After 9 days, three half-lives: 1,600 → 800 → 400 → 200.', 'مثال محلول: ١٦٠٠ عدّة في الثانية وعمر النصف ٣ أيام. بعد ٩ أيام، ثلاثة أعمار: ١٦٠٠ ← ٨٠٠ ← ٤٠٠ ← ٢٠٠.']], [
    function (r) { var k = r.int(1, 4), s = r.pick([3, 5, 25]) * 16; return n(['Count rate left.', 'المتبقي من معدل العد.'], s + ' after ' + k + ' half-li' + (k > 1 ? 'ves' : 'fe'), s / Math.pow(2, k)); },
    function (r) { var h = r.int(2, 9), k = r.int(2, 4); return n(['How many days have passed?', 'كم يومًا مضى؟'], k + ' half-lives of ' + h + ' days', h * k); },
    [['Which radiation is stopped by paper?', 'أي إشعاع توقفه الورقة؟'], ['Alpha', 'ألفا'], ['Beta', 'بيتا'], ['Gamma', 'جاما']],
    [['Which is the most penetrating?', 'أيها أشد نفاذًا؟'], ['Gamma', 'جاما'], ['Beta', 'بيتا'], ['Alpha', 'ألفا']]
  ]);
  deep('phy9.heatcap', [['Worked: heat 2 kg of water (4,200 J/kg°C) by 10°C. E = 2 × 4,200 × 10 = 84,000 J.', 'مثال محلول: تسخين ٢ كغ ماء (٤٢٠٠ جول/كغ°م) ١٠ درجات. ط = ٢ × ٤٢٠٠ × ١٠ = ٨٤٠٠٠ جول.']], [
    function (r) { var m = r.int(2, 6), c = r.pick([100, 400, 900]), t = r.int(2, 10); return n(['Energy in joules.', 'الطاقة بالجول.'], m + ' kg, ' + c + ' J/kg°C, up ' + t + '°C', m * c * t); },
    [['Why are coasts milder than inland areas?', 'لماذا السواحل أعدل من الداخل؟'], ['Water warms and cools slowly', 'يسخن الماء ويبرد ببطء'], ['Water has low heat capacity', 'سعة الماء الحرارية قليلة'], ['Sea air has no heat', 'هواء البحر بلا حرارة']]
  ]);
  deep('phy9.sound2', [['Worked: an echo returns in 4 s in water at 1,500 m/s. It travels 6,000 m in all, so the seabed is 3,000 m down.', 'مثال محلول: يعود الصدى في ٤ ث في ماء سرعته ١٥٠٠ م/ث. يقطع ٦٠٠٠ م كلها، فالقاع على عمق ٣٠٠٠ م.']], [
    function (r) { var t = r.pick([2, 4, 6, 8]), v = r.pick([340, 1500]); return n(['Distance to the reflector, in metres.', 'المسافة إلى العاكس بالمتر.'], 'echo in ' + t + ' s at ' + v + ' m/s', v * t / 2); },
    [['A note gets higher. What changed?', 'ارتفعت النغمة. ما الذي تغير؟'], ['Frequency', 'التردد'], ['Amplitude', 'السعة'], ['Speed of sound', 'سرعة الصوت']],
    [['Why can sound not cross space?', 'لماذا لا يعبر الصوت الفضاء؟'], ['It needs particles to vibrate', 'يحتاج جسيمات تهتز'], ['Space is too cold', 'الفضاء شديد البرودة'], ['Sound is too slow', 'الصوت بطيء جدًا']]
  ]);
  /* ---------- physics, Years 10 to 13 ---------- */
  deep('sci10.pressure', [['Worked: 600 N on 3 m² gives 200 Pa. In water, pressure = depth × density × g: at 10 m that is 10 × 1,000 × 10 = 100,000 Pa extra.', 'مثال محلول: ٦٠٠ نيوتن على ٣ م² تعطي ٢٠٠ باسكال. وفي الماء الضغط = العمق × الكثافة × ج: عند ١٠ م يزيد ١٠٠٠٠٠ باسكال.']], [
    function (r) { var a = r.int(2, 9), p = r.int(5, 50); return n(['Pressure in pascals.', 'الضغط بالباسكال.'], (a * p) + ' N on ' + a + ' m²', p); },
    function (r) { var h = r.int(2, 20); return n(['Extra pressure in water, in Pa (density 1,000, g = 10).', 'الضغط الزائد في الماء بالباسكال (كثافة ١٠٠٠، ج = ١٠).'], 'depth ' + h + ' m', h * 10000); },
    [['Why do snowshoes work?', 'لماذا تنفع أحذية الثلج؟'], ['Larger area, lower pressure', 'مساحة أكبر وضغط أقل'], ['Less weight', 'وزن أقل'], ['More friction only', 'احتكاك أكثر فقط']]
  ]);
  deep('sci10.momentum', [['Worked: 2 kg at 6 m/s hits 1 kg at rest and they stick. Momentum 12 stays 12, shared by 3 kg, so they move at 4 m/s.', 'مثال محلول: ٢ كغ بسرعة ٦ م/ث تصدم ١ كغ ساكنة وتلتصقان. يبقى الزخم ١٢ لكتلة ٣ كغ، فالسرعة ٤ م/ث.']], [
    function (r) { var m = r.int(2, 20), v = r.int(2, 15); return n(['Momentum in kg m/s.', 'الزخم كغ·م/ث.'], m + ' kg at ' + v + ' m/s', m * v); },
    function (r) { var v = r.int(2, 8), a = r.int(1, 4), b = r.int(1, 4); return n(['Speed after they stick, in m/s.', 'السرعة بعد الالتصاق م/ث.'], a + ' kg at ' + ((a + b) * v) + ' m/s hits ' + b + ' kg at rest', a * (a + b) * v / (a + b)); },
    [['Why does a longer impact time hurt less?', 'لماذا يقل الأذى إذا طال زمن الصدمة؟'], ['Same momentum change, smaller force', 'تغير الزخم نفسه بقوة أقل'], ['Less momentum exists', 'الزخم أقل'], ['Mass falls', 'الكتلة تقل']]
  ]);
  deep('phy11.ke', [['Worked: 4 kg at 5 m/s has ½ × 4 × 25 = 50 J. Lifted 3 m, 2 kg gains 2 × 10 × 3 = 60 J. Dropped, GPE becomes KE, so v² = 2gh.', 'مثال محلول: ٤ كغ بسرعة ٥ م/ث لها ٥٠ جول. ورفع ٢ كغ ٣ م يكسبها ٦٠ جولًا. وعند السقوط تصبح طاقة الوضع حركية، فـ ع² = ٢جف.']], [
    function (r) { var m = r.pick([2, 4, 6, 10]), v = r.int(2, 12); return n(['Kinetic energy in joules.', 'الطاقة الحركية بالجول.'], m + ' kg at ' + v + ' m/s', m * v * v / 2); },
    function (r) { var m = r.int(2, 12), h = r.int(2, 15); return n(['Energy gained in joules (g = 10).', 'الطاقة المكتسبة بالجول (ج = ١٠).'], m + ' kg up ' + h + ' m', m * 10 * h); },
    function () { return n(['Double the speed. KE is how many times larger?', 'ضاعف السرعة. كم مرة تزيد الطاقة الحركية؟'], 'v → 2v', 4); },
    function (r) { var h = r.pick([5, 20, 45, 80]); return n(['Landing speed in m/s (g = 10, no air).', 'سرعة الارتطام م/ث (ج = ١٠، بلا هواء).'], 'dropped from ' + h + ' m', Math.sqrt(2 * 10 * h)); }
  ]);
  deep('phy11.vectors', [['Worked: 3 N east and 4 N north. Resultant = √(9 + 16) = 5 N. A 10 N force at 30° has parts 10 cos 30° and 10 sin 30° = 5 N.', 'مثال محلول: ٣ نيوتن شرقًا و٤ شمالًا. المحصلة = √(٩ + ١٦) = ٥ نيوتن. وقوة ١٠ بزاوية ٣٠° مركبتها ١٠ جا ٣٠° = ٥.']], [
    function (r) { var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]); return n(['Resultant in newtons.', 'المحصلة بالنيوتن.'], t[0] + ' N and ' + t[1] + ' N at right angles', t[2]); },
    function (r) { var f = r.pick([10, 20, 40, 60, 100]); return n(['Vertical part, in newtons.', 'المركبة الرأسية بالنيوتن.'], f + ' N at 30° above level', f / 2); },
    [['Two equal forces act in opposite directions. The resultant is:', 'قوتان متساويتان متعاكستان. المحصلة:'], ['Zero', 'صفر'], ['Twice one force', 'ضعف إحداهما'], ['Equal to one force', 'تساوي إحداهما']]
  ]);
  deep('phy11.lens', null, [
    [['A magnifying glass held close gives an image that is:', 'العدسة المكبرة القريبة تعطي صورة:'], ['Virtual, upright and larger', 'وهمية معتدلة مكبرة'], ['Real and inverted', 'حقيقية مقلوبة'], ['Smaller', 'مصغرة']],
    function (r) { var u = r.pick([1, 2, 3, 4]), m = r.pick([2, 3, 5]); return n(['Image height in cm.', 'ارتفاع الصورة بالسنتيمتر.'], 'object ' + u + ' cm, magnification ' + m, u * m); },
    [['Parallel rays through a converging lens meet at:', 'تلتقي الأشعة المتوازية عبر عدسة لامة في:'], ['The principal focus', 'البؤرة'], ['The lens centre', 'مركز العدسة'], ['Nowhere', 'لا مكان']]
  ]);
  deep('phy12.materials', [['Worked: 2,000 N on a wire of 0.0001 m² gives stress 20,000,000 Pa. Stretched 1 mm in 1 m, strain is 0.001. Young’s modulus = stress ÷ strain = 20 GPa.', 'مثال محلول: ٢٠٠٠ نيوتن على سلك مقطعه ٠٫٠٠٠١ م² إجهاده ٢٠ مليون باسكال. والانفعال ٠٫٠٠١، فمعامل يونغ = ٢٠ جيجا باسكال.']], [
    function (r) { var a = r.int(2, 9), s = r.int(3, 20); return n(['Stress in MPa, when force is in N and area in mm².', 'الإجهاد بالميجا باسكال، والقوة نيوتن والمساحة مم².'], (a * s) + ' N on ' + a + ' mm²', s); },
    function (r) { var s = r.int(2, 9) * 10; return n(['Young’s modulus in GPa.', 'معامل يونغ بالجيجا باسكال.'], 'stress ' + s + ' MPa, strain 0.001', s); },
    [['Which is stiffer, a higher or lower Young’s modulus?', 'أيهما أصلب: معامل يونغ أعلى أم أدنى؟'], ['Higher', 'أعلى'], ['Lower', 'أدنى'], ['It does not tell you', 'لا يدل على ذلك']]
  ]);
  deep('phy12.emf', [['Worked: ε = 12 V, r = 1 Ω, load 5 Ω. I = 12 ÷ 6 = 2 A. Terminal voltage = 12 − 2 × 1 = 10 V.', 'مثال محلول: ق.د.ك = ١٢ فولت، م داخلية ١ أوم، حمل ٥ أوم. ت = ١٢ ÷ ٦ = ٢ أمبير. وجهد الطرفين = ١٠ فولت.']], [
    function (r) { var i = r.int(2, 5), rr = r.int(1, 3), R = r.int(2, 8); return n(['Current in amps.', 'التيار بالأمبير.'], 'ε = ' + (i * (rr + R)) + ' V, r = ' + rr + ' Ω, R = ' + R + ' Ω', i); },
    function (r) { var i = r.int(1, 5), rr = r.int(1, 2), e = r.int(14, 30); return n(['Terminal voltage in volts.', 'جهد الطرفين بالفولت.'], 'ε = ' + e + ' V, I = ' + i + ' A, r = ' + rr + ' Ω', e - i * rr); },
    [['Why does a car’s battery voltage dip when starting?', 'لماذا يهبط جهد البطارية عند التشغيل؟'], ['Large current, large internal drop', 'تيار كبير وهبوط داخلي كبير'], ['The battery gains charge', 'تكتسب شحنة'], ['Resistance vanishes', 'تختفي المقاومة']]
  ]);
  deep('phy12.interference', null, [
    [['Two waves meet exactly in step. They:', 'موجتان متطابقتا الطور تلتقيان:'], ['Add to a bigger wave', 'تتجمعان في موجة أكبر'], ['Cancel', 'تتلاشيان'], ['Bounce off', 'ترتدان']],
    [['Half a wavelength out of step, equal waves:', 'بفارق نصف طول موجي، الموجتان المتساويتان:'], ['Cancel', 'تتلاشيان'], ['Double', 'تتضاعفان'], ['Speed up', 'تتسارعان']],
    [['Noise-cancelling headphones use:', 'سماعات إلغاء الضجيج تستعمل:'], ['Destructive interference', 'التداخل الهدام'], ['Reflection', 'الانعكاس'], ['Louder music', 'موسيقى أعلى']]
  ]);
  deep('phy13.induction', [['Worked: a transformer has 100 turns in and 500 out. 12 V in gives 60 V out: the voltage ratio follows the turns ratio.', 'مثال محلول: محول له ١٠٠ لفة دخل و٥٠٠ خرج. ١٢ فولت تعطي ٦٠ فولت، فنسبة الجهد كنسبة اللفات.']], [
    function (r) { var a = r.pick([100, 200, 400]), k = r.pick([2, 3, 5]), v = r.int(2, 24); return n(['Output voltage in volts.', 'جهد الخرج بالفولت.'], v + ' V in; ' + a + ' turns to ' + (a * k), v * k); },
    [['A magnet rests inside a coil. The induced voltage is:', 'مغناطيس ساكن في ملف. الجهد المستحث:'], ['Zero', 'صفر'], ['Very high', 'مرتفع جدًا'], ['Constant and large', 'ثابت وكبير']],
    [['Which increases the induced voltage?', 'أيها يزيد الجهد المستحث؟'], ['More turns or faster movement', 'لفات أكثر أو حركة أسرع'], ['A slower magnet', 'مغناطيس أبطأ'], ['A thinner wire only', 'سلك أرق فقط']]
  ]);
  deep('phy13.ph', null, [
    [['Brighter light below the threshold frequency:', 'ضوء أسطع تحت التردد الحدي:'], ['Still frees no electrons', 'لا يحرر إلكترونات'], ['Frees many electrons', 'يحرر كثيرًا'], ['Melts the metal', 'يذيب المعدن']],
    [['Above threshold, brighter light means:', 'فوق الحد، الضوء الأسطع يعني:'], ['More electrons, same top energy', 'إلكترونات أكثر بالطاقة القصوى نفسها'], ['Faster electrons only', 'إلكترونات أسرع فقط'], ['No change', 'لا تغير']],
    function (r) { var w = r.int(2, 5), k = r.int(1, 4); return n(['Maximum KE of the electron, in eV.', 'أقصى طاقة حركية بالإلكترون فولت.'], 'photon ' + (w + k) + ' eV, work function ' + w + ' eV', k); }
  ]);
  deep('p12.circ', [['Worked: 2 kg at 6 m/s on a 3 m circle needs F = mv²/r = 2 × 36 ÷ 3 = 24 N toward the centre.', 'مثال محلول: ٢ كغ بسرعة ٦ م/ث على دائرة نصف قطرها ٣ م تحتاج ق = ك ع²/نق = ٢٤ نيوتن نحو المركز.']], [
    function (r) { var v = r.pick([2, 4, 6, 8]), R = r.pick([1, 2, 4]), m = r.int(1, 5); return n(['Centripetal force in newtons.', 'القوة المركزية بالنيوتن.'], m + ' kg, ' + v + ' m/s, r = ' + R + ' m', m * v * v / R); },
    function () { return n(['Double the distance from Earth’s centre. Gravity is 1/? as strong.', 'ضاعف البعد عن مركز الأرض. تصبح الجاذبية ١ على ؟'], 'r → 2r', 4); },
    [['Astronauts in orbit float because they:', 'يطفو رواد المدار لأنهم:'], ['Are in continual free fall', 'في سقوط حر دائم'], ['Have no gravity on them', 'لا جاذبية عليهم'], ['Have no mass', 'لا كتلة لهم']]
  ]);
  deep('p12.field', [['Worked: a capacitor of 100 µF at 6 V holds Q = CV = 600 µC. Energy = ½CV².', 'مثال محلول: مكثف ١٠٠ ميكروفاراد عند ٦ فولت يخزن ٦٠٠ ميكروكولوم. والطاقة = ½ س ج².']], [
    function (r) { var c = r.pick([10, 50, 100, 220]), v = r.int(2, 12); return n(['Charge in µC.', 'الشحنة بالميكروكولوم.'], c + ' µF at ' + v + ' V', c * v); },
    function (r) { var q = r.int(2, 9), e = r.int(2, 20); return n(['Force in newtons.', 'القوة بالنيوتن.'], q + ' C in a field of ' + e + ' N/C', q * e); },
    [['Charges of the same sign:', 'الشحنات المتشابهة:'], ['Repel', 'تتنافر'], ['Attract', 'تتجاذب'], ['Ignore each other', 'لا تتأثر']]
  ]);
  deep('p13.quantum', null, [
    [['A photon’s energy depends on:', 'طاقة الفوتون تعتمد على:'], ['Its frequency', 'تردده'], ['How bright the light is', 'سطوع الضوء'], ['Its colour name only', 'اسم لونه فقط']],
    [['Which photon carries more energy?', 'أي فوتون أكبر طاقة؟'], ['Ultraviolet', 'فوق البنفسجي'], ['Red', 'الأحمر'], ['Infrared', 'تحت الأحمر']],
    [['Atoms emit sharp colours because energy levels are:', 'تبعث الذرات ألوانًا حادة لأن مستويات الطاقة:'], ['Separate steps', 'درجات منفصلة'], ['Continuous', 'متصلة'], ['Random each time', 'عشوائية كل مرة']]
  ]);
  deep('p13.cosmos', null, [
    [['Light from distant galaxies is shifted toward:', 'ينزاح ضوء المجرات البعيدة نحو:'], ['Red', 'الأحمر'], ['Blue', 'الأزرق'], ['White', 'الأبيض']],
    [['The further the galaxy, the faster it recedes. This supports:', 'كلما بعدت المجرة زادت سرعة ابتعادها. وهذا يدعم:'], ['An expanding universe', 'كونًا متمددًا'], ['A shrinking universe', 'كونًا منكمشًا'], ['A still universe', 'كونًا ساكنًا']],
    [['Which other evidence points to a hot beginning?', 'ما الدليل الآخر على بداية حارة؟'], ['The cosmic microwave background', 'الخلفية الكونية الميكروية'], ['The moon’s phases', 'أطوار القمر'], ['Sunspots', 'بقع الشمس']]
  ]);
  deep('sci10.space', null, [
    [['What does a star fuse in its main life?', 'ماذا يدمج النجم في معظم عمره؟'], ['Hydrogen into helium', 'الهيدروجين إلى هيليوم'], ['Iron into gold', 'الحديد إلى ذهب'], ['Carbon into water', 'الكربون إلى ماء']],
    [['Elements heavier than iron come mainly from:', 'العناصر الأثقل من الحديد تأتي أساسًا من:'], ['Stellar explosions and collisions', 'انفجارات النجوم وتصادمها'], ['Planets', 'الكواكب'], ['Comets', 'المذنبات']],
    [['A star like the sun will end as:', 'نجم كالشمس ينتهي:'], ['A white dwarf', 'قزمًا أبيض'], ['A black hole', 'ثقبًا أسود'], ['A neutron star', 'نجمًا نيوترونيًا']]
  ]);
  deep('sci12.shm', [['Worked: a mass on a spring obeys a = −(k/m)x. With k/m = 4, ω = 2 rad/s, and the period is 2π/ω = π seconds.', 'مثال محلول: كتلة على نابض ت = −(ك/م)س. إذا ك/م = ٤ فـ ω = ٢، والزمن الدوري = ٢π/ω = π ثانية.']], [
    function (r) { var w = r.int(2, 9); return n(['Angular frequency ω, in rad/s.', 'التردد الزاوي ω.'], 'k/m = ' + (w * w), w); },
    [['In SHM, speed is greatest:', 'في الحركة التوافقية أقصى سرعة:'], ['At the centre', 'في المركز'], ['At the ends', 'عند الطرفين'], ['Everywhere equally', 'متساوية في كل مكان']],
    [['A pendulum’s period for small swings does not depend on:', 'الزمن الدوري للبندول الصغير لا يعتمد على:'], ['The mass', 'الكتلة'], ['The length', 'الطول'], ['Gravity', 'الجاذبية']]
  ]);
  deep('sci12.gas', [['Worked: pV = nRT. Keep temperature fixed and halve the volume: pressure doubles. 27°C is 300 K, so always add 273.', 'مثال محلول: ض ح = ن ر د. ثبّت الحرارة ونصّف الحجم فيتضاعف الضغط. و٢٧°م تساوي ٣٠٠ كلفن، فأضف ٢٧٣ دائمًا.']], [
    function (r) { var c = r.int(10, 90); return n(['In kelvin.', 'بالكلفن.'], c + '°C', c + 273); },
    function (r) { var p = r.int(100, 300), k = r.pick([2, 4]); return n(['New pressure in kPa (same temperature).', 'الضغط الجديد بالكيلوباسكال (الحرارة نفسها).'], p + ' kPa; volume ÷ ' + k, p * k); },
    function (r) { var p = r.int(100, 200), t = r.pick([200, 300, 400]); return n(['New pressure in kPa (same volume).', 'الضغط الجديد (الحجم نفسه).'], p + ' kPa at ' + t + ' K, heated to ' + (2 * t) + ' K', 2 * p); }
  ]);
  deep('sci13.nuclear', [['Worked: 1 g of mass becoming energy: E = mc² = 0.001 × (3×10⁸)² = 9×10¹³ J, about what a large power station makes in a day.', 'مثال محلول: غرام يتحول طاقة: ط = ك س² = ٩×١٠¹³ جول، قريب مما تنتجه محطة كبيرة في يوم.']], [
    function (r) { var m = r.int(1, 9); return n(['Energy in units of 10¹⁶ J (c² ≈ 9×10¹⁶).', 'الطاقة بوحدة ١٠¹⁶ جول (س² ≈ ٩×١٠¹⁶).'], m + ' kg of mass', 9 * m); },
    [['Which powers the sun?', 'ما مصدر طاقة الشمس؟'], ['Fusion', 'الاندماج'], ['Fission', 'الانشطار'], ['Burning', 'الاحتراق']],
    [['Control rods in a reactor:', 'قضبان التحكم في المفاعل:'], ['Absorb neutrons', 'تمتص النيوترونات'], ['Add fuel', 'تضيف وقودًا'], ['Cool the water', 'تبرد الماء']]
  ]);
  deep('x13.relativity', null, [
    [['A fast-moving clock, seen from the ground, runs:', 'الساعة السريعة كما تُرى من الأرض:'], ['Slow', 'تبطؤ'], ['Fast', 'تسرع'], ['Backward', 'ترجع']],
    function (r) { var g = r.pick([2, 3, 5]), t = r.int(2, 9); return n(['Ground time in years.', 'الزمن الأرضي بالسنوات.'], 'traveller ages ' + t + ' y, γ = ' + g, t * g); },
    [['Can a mass reach the speed of light?', 'هل تبلغ كتلة سرعة الضوء؟'], ['No: energy needed grows without limit', 'لا، فالطاقة تزيد بلا حد'], ['Yes, with a big rocket', 'نعم بصاروخ كبير'], ['Yes, in space', 'نعم في الفضاء']]
  ]);
  deep('x13.em', null, [
    [['What did Maxwell’s equations predict?', 'بماذا تنبأت معادلات ماكسويل؟'], ['Electromagnetic waves at light’s speed', 'موجات كهرومغناطيسية بسرعة الضوء'], ['Atoms', 'الذرات'], ['Gravity waves', 'موجات الجاذبية']],
    [['A changing magnetic field creates:', 'المجال المغناطيسي المتغير يولد:'], ['An electric field', 'مجالًا كهربائيًا'], ['Mass', 'كتلة'], ['Nothing', 'لا شيء']],
    [['Who first produced radio waves in a lab?', 'من أنتج موجات الراديو أولًا في مختبر؟'], ['Hertz', 'هرتز'], ['Newton', 'نيوتن'], ['Galileo', 'غاليليو']]
  ]);

  /* ---------- chemistry ---------- */
  deep('c8.atom', [['Worked: sodium has proton number 11, mass number 23. Protons 11, electrons 11, neutrons 23 − 11 = 12. Isotopes differ only in neutrons.', 'مثال محلول: الصوديوم عدده الذري ١١ والكتلي ٢٣. البروتونات ١١ والإلكترونات ١١ والنيوترونات ١٢. وتختلف النظائر في النيوترونات فقط.']], [
    function (r) { var e = r.pick([[6, 12], [8, 16], [11, 23], [13, 27], [17, 35], [19, 39], [20, 40]]); return n(['How many neutrons?', 'كم نيوترونًا؟'], 'proton number ' + e[0] + ', mass number ' + e[1], e[1] - e[0]); },
    function (r) { var p = r.int(3, 20); return n(['How many electrons in the neutral atom?', 'كم إلكترونًا في الذرة المتعادلة؟'], 'proton number ' + p, p); },
    [['Isotopes of an element have different numbers of:', 'نظائر العنصر تختلف في عدد:'], ['Neutrons', 'النيوترونات'], ['Protons', 'البروتونات'], ['Electrons when neutral', 'الإلكترونات عند التعادل']]
  ]);
  deep('c8.table', null, [
    [['Elements in Group 1 have how many outer electrons?', 'كم إلكترونًا خارجيًا لعناصر المجموعة ١؟'], ['One', 'واحد'], ['Two', 'اثنان'], ['Seven', 'سبعة']],
    [['Noble gases barely react because:', 'الغازات النبيلة لا تكاد تتفاعل لأن:'], ['Their outer shell is full', 'غلافها الخارجي ممتلئ'], ['They are heavy', 'ثقيلة'], ['They have no electrons', 'لا إلكترونات لها']],
    [['Who arranged the table and left gaps for unknown elements?', 'من رتب الجدول وترك فراغات لعناصر مجهولة؟'], ['Mendeleev', 'مندلييف'], ['Newton', 'نيوتن'], ['Faraday', 'فاراداي']]
  ]);
  deep('c8.bond', null, [
    [['Sodium chloride conducts when:', 'كلوريد الصوديوم يوصل عندما:'], ['Melted or dissolved', 'ينصهر أو يذوب'], ['Solid', 'يكون صلبًا'], ['Cold', 'يبرد']],
    [['A metal atom forming an ion:', 'ذرة الفلز عند تكوين أيون:'], ['Loses electrons', 'تفقد إلكترونات'], ['Gains electrons', 'تكسب إلكترونات'], ['Gains protons', 'تكسب بروتونات']],
    [['Metals conduct because they have:', 'توصل الفلزات لأن فيها:'], ['A sea of free electrons', 'بحرًا من الإلكترونات الحرة'], ['Fixed ions only', 'أيونات ثابتة فقط'], ['No electrons', 'لا إلكترونات']]
  ]);
  deep('c8.react', [['Worked: balance Mg + O₂ → MgO. Two oxygens on the left need 2MgO, which needs 2Mg: 2Mg + O₂ → 2MgO. Count every atom on each side.', 'مثال محلول: وازن Mg + O₂ → MgO. ذرتا أكسجين تحتاجان 2MgO، وهذا يحتاج 2Mg: 2Mg + O₂ → 2MgO. عدّ كل ذرة على الجانبين.']], [
    function (r) { var q = r.pick([['? H₂ + O₂ → 2H₂O', 2], ['N₂ + ? H₂ → 2NH₃', 3], ['? Na + Cl₂ → 2NaCl', 2], ['CH₄ + ? O₂ → CO₂ + 2H₂O', 2], ['2Al + ? Cl₂ → 2AlCl₃', 3], ['4Fe + ? O₂ → 2Fe₂O₃', 3]]); return n(['Which number balances it?', 'أي عدد يوازنها؟'], q[0], q[1]); },
    function (r) { var a = r.int(10, 60), b = r.int(5, 40); return n(['Mass of product in grams.', 'كتلة الناتج بالغرام.'], a + ' g + ' + b + ' g react fully', a + b); }
  ]);
  deep('c9.moles', [['Worked: 44 g of CO₂ (molar mass 44) is 1 mol. 11 g is 11 ÷ 44 = 0.25 mol. One mole is 6.02×10²³ particles.', 'مثال محلول: ٤٤ غ من CO₂ مول واحد، و١١ غ تساوي ٠٫٢٥ مول. والمول ٦٫٠٢×١٠²³ جسيم.']], [
    function (r) { var mm = r.pick([2, 12, 16, 18, 28, 32, 44, 58]), k = r.int(2, 9); return n(['Moles.', 'عدد المولات.'], (mm * k) + ' g, molar mass ' + mm, k); },
    function (r) { var mm = r.pick([18, 28, 40, 44, 58]), k = r.int(2, 8); return n(['Mass in grams.', 'الكتلة بالغرام.'], k + ' mol, molar mass ' + mm, mm * k); },
    function (r) { var q = r.pick([['H₂O (H=1, O=16)', 18], ['CO₂ (C=12, O=16)', 44], ['NaCl (Na=23, Cl=35.5, ×2)', 117], ['CH₄ (C=12, H=1)', 16], ['NH₃ (N=14, H=1)', 17]]); return n(['Molar mass.', 'الكتلة المولية.'], q[0], q[1]); }
  ]);
  deep('che11.titr', [['Worked: 25 cm³ of acid is neutralised by 50 cm³ of 0.1 mol/dm³ NaOH. Moles NaOH = 0.05 × 0.1 = 0.005. With a 1:1 ratio, acid = 0.005 ÷ 0.025 = 0.2 mol/dm³.', 'مثال محلول: ٢٥ سم³ حمض يعادلها ٥٠ سم³ NaOH تركيزه ٠٫١. المولات ٠٫٠٠٥، وبنسبة ١:١ تركيز الحمض ٠٫٢.']], [
    function (r) { var c = r.int(1, 5), v = r.pick([2, 4, 10]); return n(['Moles in solution.', 'المولات في المحلول.'], c + ' mol/dm³ × ' + v + ' dm³', c * v); },
    function (r) { var c = r.int(2, 9), v = r.int(2, 5); return n(['Concentration in mol/dm³.', 'التركيز.'], (c * v) + ' mol in ' + v + ' dm³', c); },
    function (r) { var v = r.pick([1000, 2000, 3000]), k = v / 1000; return n(['In dm³.', 'بالديسيمتر المكعب.'], v + ' cm³', k); },
    [['The indicator in a titration shows:', 'الكاشف في المعايرة يبين:'], ['The end point', 'نقطة النهاية'], ['The temperature', 'الحرارة'], ['The mass', 'الكتلة']]
  ]);
  deep('che12.acidk', [['Worked: [H⁺] = 0.001 = 10⁻³, so pH = 3. Dilute 100 times and pH becomes 5. A strong acid fully ionises; a weak one only partly.', 'مثال محلول: [H⁺] = ١٠⁻³ فالرقم ٣. وبالتخفيف ١٠٠ مرة يصبح ٥. والحمض القوي يتأين كليًا والضعيف جزئيًا.']], [
    function (r) { var p = r.int(1, 6); return n(['pH.', 'الرقم الهيدروجيني.'], '[H⁺] = 10^-' + p, p); },
    function (r) { var a = r.int(1, 3), d = r.int(1, 3); return n(['How many times more acidic?', 'كم مرة أشد حموضة؟'], 'pH ' + a + ' against pH ' + (a + d), Math.pow(10, d)); },
    [['A weak acid differs from a strong one because it:', 'الحمض الضعيف يختلف بأنه:'], ['Only partly ionises', 'يتأين جزئيًا'], ['Is always dilute', 'مخفف دائمًا'], ['Contains no hydrogen', 'لا هيدروجين فيه']]
  ]);
  deep('che9.yield', [['Worked: you expected 40 g and got 30 g. Percentage yield = 30 ÷ 40 = 75%. Atom economy = mass of useful product ÷ mass of all products.', 'مثال محلول: توقعت ٤٠ غ وحصلت على ٣٠ غ. المردود = ٧٥٪. والاقتصاد الذري = كتلة الناتج النافع ÷ كتلة كل النواتج.']], [
    function (r) { var e = r.pick([20, 40, 50, 80, 100]), p = r.pick([25, 50, 60, 75]); return n(['Percentage yield.', 'نسبة المردود.'], (e * p / 100) + ' g from an expected ' + e + ' g', p); },
    function (r) { var u = r.pick([30, 45, 60, 90]), t = u * r.pick([2, 3]) / 1; return n(['Atom economy, %, rounded.', 'الاقتصاد الذري ٪ مقربًا.'], u + ' useful of ' + t + ' total', Math.round(u / t * 100)); },
    [['Why is yield rarely 100%?', 'لماذا لا يبلغ المردود ١٠٠٪ غالبًا؟'], ['Losses and side reactions', 'فقد وتفاعلات جانبية'], ['Atoms vanish', 'تفنى الذرات'], ['The balance is wrong', 'الميزان خطأ']]
  ]);
  deep('c9.rate', null, [
    [['A catalyst speeds a reaction by:', 'يسرع الحفاز التفاعل بـ:'], ['Giving a lower-energy route', 'مسار طاقته أقل'], ['Being used up', 'استهلاكه'], ['Adding heat', 'إضافة حرارة']],
    function (r) { var t = r.int(2, 9), v = r.int(3, 12); return n(['Mean rate in cm³/s.', 'متوسط المعدل سم³/ث.'], (v * t) + ' cm³ of gas in ' + t + ' s', v); },
    [['Heating makes reactions faster mainly because:', 'التسخين يسرع التفاعل أساسًا لأن:'], ['More collisions have enough energy', 'تصادمات أكثر تملك طاقة كافية'], ['Particles get larger', 'تكبر الجسيمات'], ['Bonds vanish', 'تختفي الروابط']]
  ]);
  deep('c9.energy', [['Worked: breaking bonds costs 500 kJ, making bonds gives 700 kJ. Net: −200 kJ, so the reaction is exothermic.', 'مثال محلول: كسر الروابط ٥٠٠ ك.ج وتكوينها ٧٠٠ ك.ج. الصافي −٢٠٠ فالتفاعل طارد.']], [
    function (r) { var b = r.int(3, 7) * 100, m = b + r.int(1, 3) * 100; return n(['Energy released, in kJ.', 'الطاقة المنطلقة ك.ج.'], 'break ' + b + ' kJ, make ' + m + ' kJ', m - b); },
    [['Which is endothermic?', 'أيها ماص للحرارة؟'], ['Photosynthesis', 'البناء الضوئي'], ['Burning', 'الاحتراق'], ['Respiration', 'التنفس']]
  ]);
  deep('c9.metals', null, [
    [['Iron is extracted using:', 'يُستخرج الحديد بـ:'], ['Carbon, which is more reactive', 'الكربون الأنشط منه'], ['Water', 'الماء'], ['Gold', 'الذهب']],
    [['Why is gold found as the pure metal?', 'لماذا يوجد الذهب نقيًا؟'], ['It is very unreactive', 'لأنه خامل جدًا'], ['It is very reactive', 'نشط جدًا'], ['It is light', 'خفيف']],
    [['Zinc is put in copper sulfate. What happens?', 'يوضع زنك في كبريتات النحاس. ماذا يحدث؟'], ['Zinc displaces copper', 'يحل الزنك محل النحاس'], ['Nothing', 'لا شيء'], ['Copper displaces zinc', 'يحل النحاس محل الزنك']]
  ]);
  deep('c9.organic', null, [
    [['The general formula of an alkane is:', 'الصيغة العامة للألكان:'], ['CₙH₂ₙ₊₂', 'CₙH₂ₙ₊₂'], ['CₙH₂ₙ', 'CₙH₂ₙ'], ['CₙHₙ', 'CₙHₙ']],
    function (r) { var c = r.int(2, 8); return n(['Hydrogen atoms in the alkane.', 'ذرات الهيدروجين في الألكان.'], 'C' + c + 'H?', 2 * c + 2); },
    [['Bromine water turns colourless with:', 'يفقد ماء البروم لونه مع:'], ['Alkenes', 'الألكينات'], ['Alkanes', 'الألكانات'], ['Water', 'الماء']]
  ]);
  deep('che9.ions', [['Worked: Al³⁺ and O²⁻. Cross the charges: Al₂O₃, giving +6 and −6. A formula is neutral overall.', 'مثال محلول: Al³⁺ وO²⁻. بتبادل الشحن: Al₂O₃، فتكون +٦ و−٦. والصيغة متعادلة.']], [
    [['Mg²⁺ and O²⁻ make:', 'Mg²⁺ وO²⁻ تكوّنان:'], ['MgO', 'MgO'], ['Mg₂O', 'Mg₂O'], ['MgO₂', 'MgO₂']],
    [['Al³⁺ and Cl⁻ make:', 'Al³⁺ وCl⁻ تكوّنان:'], ['AlCl₃', 'AlCl₃'], ['AlCl', 'AlCl'], ['Al₃Cl', 'Al₃Cl']],
    [['Ca²⁺ and OH⁻ make:', 'Ca²⁺ وOH⁻ تكوّنان:'], ['Ca(OH)₂', 'Ca(OH)₂'], ['CaOH', 'CaOH'], ['Ca₂OH', 'Ca₂OH']]
  ]);
  deep('sci10.electrolysis', [['Worked: molten lead bromide. Pb²⁺ goes to the negative cathode and gains electrons: lead metal. Br⁻ goes to the positive anode and loses them: bromine.', 'مثال محلول: بروميد الرصاص المنصهر. يذهب Pb²⁺ إلى المهبط السالب فيكسب إلكترونات ويصير رصاصًا، وBr⁻ إلى المصعد فيفقدها ويصير بروم.']], [
    [['Reduction happens at the:', 'يحدث الاختزال عند:'], ['Cathode', 'المهبط'], ['Anode', 'المصعد'], ['Both', 'كليهما']],
    [['Why must an ionic solid be melted first?', 'لماذا يجب صهر المركب الأيوني أولًا؟'], ['So its ions can move', 'لتتحرك أيوناته'], ['To make it lighter', 'ليخف'], ['To add electrons', 'لإضافة إلكترونات']],
    [['Electrolysis of brine gives chlorine at the:', 'يعطي التحليل الكهربائي للمحلول الملحي الكلور عند:'], ['Anode', 'المصعد'], ['Cathode', 'المهبط'], ['Neither', 'لا أحدهما']]
  ]);
  deep('c12.equil', null, [
    [['Add more reactant at equilibrium. The balance shifts:', 'أضف متفاعلًا عند الاتزان. يتحول الاتزان:'], ['Toward products', 'نحو النواتج'], ['Toward reactants', 'نحو المتفاعلات'], ['Not at all', 'لا يتحول']],
    [['Raise the pressure. It shifts toward:', 'ارفع الضغط. يتحول نحو:'], ['Fewer gas molecules', 'جزيئات غاز أقل'], ['More gas molecules', 'جزيئات غاز أكثر'], ['Solids only', 'المواد الصلبة فقط']],
    [['A catalyst at equilibrium:', 'الحفاز عند الاتزان:'], ['Reaches it faster, same position', 'يبلغه أسرع بالموضع نفسه'], ['Moves it to products', 'يحوله نحو النواتج'], ['Stops it', 'يوقفه']]
  ]);
  deep('sci12.kinetics', [['Worked: double [A] and the rate quadruples: order 2 in A. Double [B] and nothing changes: order 0. Rate = k[A]².', 'مثال محلول: ضاعف [A] فيتضاعف المعدل أربعًا: الرتبة ٢. وضاعف [B] فلا يتغير: الرتبة ٠. المعدل = ك[A]².']], [
    function (r) { var o = r.int(0, 2); return n(['Order in A.', 'الرتبة في A.'], 'double [A]: rate × ' + Math.pow(2, o), o); },
    function (r) { var o = r.int(1, 2), f = r.pick([2, 3]); return n(['Rate is multiplied by?', 'يُضرب المعدل في؟'], 'order ' + o + ' in A; [A] × ' + f, Math.pow(f, o)); },
    [['Orders of reaction are found from:', 'تُعرف رتب التفاعل من:'], ['Experiment', 'التجربة'], ['The balanced equation', 'المعادلة الموزونة'], ['The colour', 'اللون']]
  ]);
  deep('sci12.thermo', null, [
    [['A reaction with ΔG below zero is:', 'تفاعل ΔG له أقل من صفر:'], ['Feasible', 'ممكن'], ['Impossible', 'مستحيل'], ['Always fast', 'سريع دائمًا']],
    [['ΔG = ΔH − TΔS. High T helps when entropy:', 'ΔG = ΔH − TΔS. تفيد الحرارة العالية إذا كانت الإنتروبيا:'], ['Rises', 'تزيد'], ['Falls', 'تقل'], ['Is zero', 'صفرًا']],
    function (r) { var h = r.int(2, 9) * 10, s = r.int(1, 3), t = r.pick([10, 20]); return n(['ΔG magnitude, in kJ, when ΔH is +h and TΔS bigger.', 'مقدار ΔG بالكيلوجول.'], 'ΔH = ' + h + ', TΔS = ' + (h + s * t), s * t); }
  ]);
  deep('che12.periodic', null, [
    [['Across a period, atoms get smaller because:', 'عبر الدورة تصغر الذرات لأن:'], ['Nuclear charge rises on the same shell', 'الشحنة النووية تزيد على الغلاف نفسه'], ['Electrons are lost', 'تُفقد إلكترونات'], ['Neutrons vanish', 'تختفي النيوترونات']],
    [['Down a group, first ionisation energy:', 'نزولًا في المجموعة طاقة التأين الأولى:'], ['Falls', 'تقل'], ['Rises', 'تزيد'], ['Stays the same', 'تثبت']],
    [['Which is the most electronegative element?', 'أي عنصر أعلى كهروسلبية؟'], ['Fluorine', 'الفلور'], ['Sodium', 'الصوديوم'], ['Iron', 'الحديد']]
  ]);
  deep('che12.bonding2', null, [
    [['Methane’s shape is:', 'شكل الميثان:'], ['Tetrahedral', 'رباعي الأوجه'], ['Linear', 'خطي'], ['Flat', 'مسطح']],
    function () { return n(['Bond angle in methane, degrees, to the nearest whole number.', 'زاوية الرابطة في الميثان بالدرجات مقربة.'], 'CH₄', 109); },
    [['Water’s angle is smaller than methane’s because:', 'زاوية الماء أصغر لأن:'], ['Lone pairs repel more strongly', 'الأزواج الحرة تتنافر أكثر'], ['It has more hydrogens', 'هيدروجينه أكثر'], ['Oxygen is heavier', 'الأكسجين أثقل']]
  ]);
  deep('x13.electro', [['Worked: Zn²⁺/Zn is −0.76 V and Cu²⁺/Cu is +0.34 V. The cell gives 0.34 − (−0.76) = 1.10 V. Electrons flow from zinc to copper.', 'مثال محلول: جهد Zn = −٠٫٧٦ وCu = +٠٫٣٤. جهد الخلية ١٫١٠ فولت، وتسير الإلكترونات من الزنك إلى النحاس.']], [
    [['In a working cell, oxidation happens at the:', 'في الخلية العاملة يحدث التأكسد عند:'], ['Anode', 'المصعد'], ['Cathode', 'المهبط'], ['Salt bridge', 'القنطرة الملحية']],
    [['What does the salt bridge do?', 'ما وظيفة القنطرة الملحية؟'], ['Lets ions flow to balance charge', 'تمرر الأيونات لتوازن الشحنة'], ['Carries electrons', 'تحمل الإلكترونات'], ['Stores energy', 'تخزن الطاقة']],
    [['A lithium-ion battery is valued mainly for:', 'تُفضل بطارية الليثيوم أساسًا لـ:'], ['High energy for its weight', 'طاقة عالية بالنسبة لوزنها'], ['Low cost alone', 'رخصها فقط'], ['Never ageing', 'عدم تقادمها']]
  ]);
  /* biology calculations and checks are in the next file */
})();
