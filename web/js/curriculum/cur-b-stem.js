/* New Years 8 to 10 lessons: maths, sciences, computing and engineering. Built as parallel strands, so they widen a year without delaying its core road. */
(function () {
  'use strict';
  var C = window.C, U = C.yunit, Topic = C.topic, P = C.padQ, X = C.exprQ;
  var OUT = ['What does it print?', 'ماذا يطبع؟'];

  /* ---------- maths, Year 8 ---------- */
  U('math', 'x8m', ['Shape, graphs and number sense', 'الأشكال والرسوم وحس الأعداد'], 3, 8, true);
  Topic('x8m.poly', ['Angles in polygons', 'زوايا المضلعات'], 'star', [['A polygon with n sides splits into n − 2 triangles, so its angles sum to (n − 2) × 180°. The exterior angles of any polygon sum to 360°. A regular hexagon: exterior 60°, interior 120°.', 'مضلع ذو n ضلعًا ينقسم إلى n − ٢ مثلثًا، فمجموع زواياه (n − ٢) × ١٨٠°. ومجموع الخارجية ٣٦٠°.']], [
    function (r) { var n = r.int(4, 12); return P(['Sum of interior angles, degrees.', 'مجموع الزوايا الداخلية.'], n + ' sides', (n - 2) * 180); },
    function (r) { var n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]); return P(['Each exterior angle of the regular polygon.', 'كل زاوية خارجية.'], n + ' sides', 360 / n); },
    function (r) { var n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]); return P(['Each interior angle of the regular polygon.', 'كل زاوية داخلية.'], n + ' sides', 180 - 360 / n); },
    function (r) { var e = r.pick([10, 12, 15, 20, 24, 30, 36, 40, 45]); return P(['How many sides?', 'كم ضلعًا؟'], 'exterior angle ' + e + '°', 360 / e); }
  ]);
  Topic('x8m.parallel', ['Parallel lines and angle reasoning', 'المتوازيات والاستدلال بالزوايا'], 'ruler', [['Corresponding angles are equal, alternate angles are equal, and co-interior angles add to 180°. Always give the reason, because in maths the reason is the answer.', 'الزوايا المتناظرة متساوية، والمتبادلة متساوية، والداخلية على جهة واحدة مجموعها ١٨٠°. واذكر السبب دائمًا.']], [
    function (r) { var a = r.int(30, 150); return P(['Co-interior angles add to 180°. What is the other angle?', 'الزاويتان الداخليتان المتحالفتان مجموعهما ١٨٠°. ما الزاوية الأخرى؟'], 'one angle ' + a + '°', 180 - a); },
    function (r) { var a = r.int(25, 80), b = r.int(25, 75); return P(['Third angle of the triangle.', 'الزاوية الثالثة.'], a + '° and ' + b + '°', 180 - a - b); },
    [['Z-shaped equal angles are called:', 'الزوايا المتساوية بشكل Z:'], ['Alternate', 'متبادلة'], ['Corresponding', 'متناظرة'], ['Co-interior', 'داخلية']]
  ]);
  Topic('x8m.area', ['Areas of compound shapes', 'مساحات الأشكال المركبة'], 'plate', [['Split into rectangles and triangles, or take a part away from a bigger shape. A trapezium has area ½(a + b)h. Write the units, and square them.', 'قسّم إلى مستطيلات ومثلثات أو اطرح جزءًا من شكل أكبر. وشبه المنحرف ½(a + b)h.']], [
    function (r) { var a = r.int(2, 9), b = a + r.int(1, 5) * 2, h = r.int(2, 9) * 2; return P(['Area of the trapezium.', 'مساحة شبه المنحرف.'], 'parallel ' + a + ' and ' + b + ', height ' + h, (a + b) * h / 2); },
    function (r) { var w = r.int(6, 15), h = r.int(6, 15), c = r.int(1, 5); return P(['Area left after removing the square corner.', 'المساحة بعد قطع الزاوية.'], w + ' × ' + h + ', corner ' + c + ' × ' + c, w * h - c * c); },
    function (r) { var b = r.int(1, 9) * 2, h = r.int(2, 12); return P(['Area of the triangle.', 'مساحة المثلث.'], 'base ' + b + ', height ' + h, b * h / 2); }
  ]);
  Topic('x8m.trans', ['Reflections, rotations, enlargements', 'الانعكاس والدوران والتكبير'], 'compass', [['Reflect in the y-axis: (x, y) goes to (−x, y). Rotate 180° about the origin: to (−x, −y). Enlarge by scale factor k from the origin: to (kx, ky). Lengths multiply by k, and areas by k².', 'الانعكاس في محور y: (x, y) إلى (−x, y). والدوران ١٨٠°: إلى (−x, −y). والتكبير بعامل k: تضرب الأطوال في k والمساحة في k².']], [
    function (r) { var x = r.int(1, 9), y = r.int(1, 9); return X(['New x, after reflecting in the y-axis.', 'x بعد الانعكاس في محور y.'], '(' + x + ', ' + y + ')', -x); },
    function (r) { var x = r.int(1, 9), y = r.int(1, 9); return X(['New y, after rotating 180° about the origin.', 'y بعد الدوران ١٨٠°.'], '(' + x + ', ' + y + ')', -y); },
    function (r) { var k = r.int(2, 5), a = r.int(2, 9); return P(['Area scales by k². What is the new area?', 'المساحة تتضاعف بـk². ما المساحة الجديدة؟'], 'area ' + a + ', scale factor ' + k, a * k * k); }
  ]);
  Topic('x8m.sdt', ['Distance-time graphs', 'رسوم المسافة والزمن'], 'car', [['On a distance-time graph, the slope is the speed, and a flat line means stopped. Average speed = total distance ÷ total time, stops included.', 'الميل هو السرعة والخط الأفقي توقف. والسرعة المتوسطة = المسافة الكلية ÷ الزمن الكلي بالتوقف.']], [
    function (r) { var t = r.int(2, 9), v = r.int(2, 12); return P(['What is the speed, in km/h?', 'ما السرعة بالكيلومتر في الساعة؟'], 'rises ' + (t * v) + ' km over ' + t + ' h', v); },
    function (r) { var a = r.int(2, 5), b = r.int(1, 3), v = r.int(4, 12); return P(['What is the average speed for the whole journey, stops included, in km/h?', 'ما السرعة المتوسطة للرحلة كلها مع التوقف بالكيلومتر في الساعة؟'], (v * (a + b)) + ' km, ' + a + ' h moving + ' + b + ' h stopped', v); },
    [['A steeper line means:', 'الخط الأشد ميلًا يعني:'], ['Faster', 'أسرع'], ['Slower', 'أبطأ'], ['Stopped', 'توقف']]
  ]);
  Topic('x8m.freq', ['Averages from a table', 'المتوسطات من جدول'], 'notebook', [['Mean from a frequency table = Σ(value × frequency) ÷ Σ(frequency). The median is the middle one, not the middle row. The mode has the highest frequency.', 'المتوسط من الجدول = مجموع (القيمة × التكرار) ÷ مجموع التكرارات. والوسيط الأوسط لا الصف الأوسط.']], [
    function (r) { var a = r.int(1, 5), f = r.int(2, 5); return P(['What is the mean of all the values?', 'ما متوسط كل القيم؟'], 'value ' + a + ' × ' + f + ' times; value ' + (a + 2) + ' × ' + f + ' times', a + 1); },
    function (r) { var v = r.pick([[2, 4, 4, 5, 9], [1, 3, 7, 8, 11], [3, 3, 6, 9, 10], [2, 5, 8, 8, 12]]); return P(['What is the median, the middle value?', 'ما الوسيط، القيمة الوسطى؟'], v.join(', '), v[2]); },
    function (r) { var v = r.pick([[2, 4, 11], [5, 7, 20], [1, 8, 12]]); return P(['What is the range, largest minus smallest?', 'ما المدى: الأكبر ناقص الأصغر؟'], v.join(', '), v[2] - v[0]); }
  ]);
  Topic('x8m.prime', ['Primes and divisibility', 'الأعداد الأولية وقابلية القسمة'], 'gem', [['Divisible by 3 if the digit sum is. By 4 if the last two digits are. By 9 if the digit sum is. Euclid proved there are infinitely many primes, in about four lines.', 'يقبل القسمة على ٣ إذا قبلها مجموع الأرقام، وعلى ٤ إذا قبلها آخر رقمين. وأثبت إقليدس أن الأوليات لا تنتهي.']], [
    function (r) { var a = r.int(100, 999), s = String(a).split('').reduce(function (t, d) { return t + +d; }, 0); return P(['What do the digits of this number add up to?', 'كم مجموع أرقام هذا العدد؟'], a, s); },
    [['Which is prime?', 'أيها أولي؟'], ['97', '٩٧'], ['91', '٩١'], ['87', '٨٧']],
    [['Is 2,352 divisible by 4?', 'هل ٢٣٥٢ يقبل القسمة على ٤؟'], ['Yes: 52 is', 'نعم: ٥٢ تقبل'], ['No', 'لا'], ['Only by 3', 'على ٣ فقط']]
  ]);
  /* ---------- maths, Year 9 ---------- */
  U('math', 'x9m', ['Harder algebra, shape and chance', 'جبر أصعب وأشكال واحتمال'], 3, 9, true);
  Topic('x9m.alg', ['Indices in algebra', 'الأسس في الجبر'], 'gem', [['x³ × x⁴ = x⁷. x⁶ ÷ x² = x⁴. (x²)³ = x⁶. (2x)³ = 8x³, since the 2 is cubed too. x⁰ = 1.', 'x³ × x⁴ = x⁷ وx⁶ ÷ x² = x⁴ و(x²)³ = x⁶ و(2x)³ = 8x³ وx⁰ = 1.']], [
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(['The power of x.', 'أس x.'], 'x^' + a + ' × x^' + b, a + b); },
    function (r) { var a = r.int(2, 6), b = r.int(2, 5); return P(['The power of x.', 'أس x.'], '(x^' + a + ')^' + b, a * b); },
    function (r) { var a = r.int(2, 4), b = r.int(2, 3); return P(['The number in front of x.', 'معامل x.'], '(' + a + 'x)^' + b, Math.pow(a, b)); },
    function (r) { return P(['Any non-zero number to the power 0 is worth what?', 'كم يساوي أي عدد غير الصفر مرفوعًا للقوة صفر؟'], r.int(2, 99) + '^0', 1); }
  ]);
  Topic('x9m.p3d', ['Pythagoras in three dimensions', 'فيثاغورس في ثلاثة أبعاد'], 'box', [['A box’s longest diagonal is √(a² + b² + c²). A box 2, 3, 6 has a diagonal of √49 = 7. Find a right-angled triangle, then another one.', 'أطول قطر للصندوق √(a² + b² + c²). صندوق ٢، ٣، ٦ قطره ٧.']], [
    function (r) { var t = r.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [6, 6, 7, 11]]); return P(['How long is the longest diagonal of the box?', 'ما طول أطول قطر في الصندوق؟'], t[0] + ' × ' + t[1] + ' × ' + t[2] + ' box', t[3]); },
    function (r) { var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]); return P(['Diagonal of the floor.', 'قطر الأرضية.'], t[0] + ' × ' + t[1] + ' floor', t[2]); }
  ]);
  Topic('x9m.recur', ['Recurring decimals', 'الكسور الدورية'], 'wave', [['x = 0.777…, so 10x = 7.777…, and subtracting gives 9x = 7, so x = 7/9. Two repeating digits? Multiply by 100. So 0.999… is exactly 1, which surprises most people the first time.', 'x = 0.777… فـ 10x = 7.777… وبالطرح 9x = 7 إذن x = 7/9. وكذا 0.999… تساوي ١ تمامًا.']], [
    function (r) { var a = r.int(1, 8); return P(['As a fraction: ?/9.', 'على صورة ؟/٩.'], '0.' + a + a + a + '...', a); },
    function (r) { var a = r.int(10, 98); return P(['As a fraction: ?/99.', 'على صورة ؟/٩٩.'], '0.' + a + a + '...', a); },
    [['What is 0.999… equal to?', 'ما قيمة 0.999…؟'], ['Exactly 1', '١ تمامًا'], ['Just under 1', 'أقل من ١ قليلًا'], ['Nothing exact', 'لا قيمة دقيقة']]
  ]);
  Topic('x9m.indep', ['Independent and dependent events', 'الأحداث المستقلة والتابعة'], 'stone', [['Independent: P(A and B) = P(A) × P(B). A coin has no memory. Without replacement, the second chance changes: from 5 red and 5 blue, two reds is 5/10 × 4/9 = 2/9.', 'المستقلة: P(A و B) = P(A) × P(B). والعملة لا ذاكرة لها. وبلا إرجاع يتغير الاحتمال الثاني.']], [
    function (r) { var k = r.int(2, 6); return P(['Chance is 1 in ?', 'الاحتمال ١ من ؟'], k + ' heads in a row', Math.pow(2, k)); },
    function (r) { var a = r.int(2, 6), b = r.int(2, 6); return P(['How many outcomes are there in all?', 'كم نتيجة ممكنة في المجموع؟'], a + ' choices, then ' + b, a * b); },
    [['After 5 heads, the next toss of a fair coin is:', 'بعد ٥ صور، الرمية التالية:'], ['Still 1/2', 'ما زالت ١/٢'], ['More likely tails', 'الكتابة أرجح'], ['More likely heads', 'الصورة أرجح']]
  ]);
  Topic('x9m.cum', ['Cumulative frequency', 'التكرار التراكمي'], 'mountain', [['Add up as you go, and plot against the top of each group. The curve’s middle gives the median. The quartiles, at ¼ and ¾ of the way, give the interquartile range, a spread not fooled by outliers.', 'اجمع تدريجيًا وارسم عند الحد الأعلى. ومنتصف المنحنى الوسيط. والربيعان يعطيان مدى لا تخدعه القيم الشاذة.']], [
    function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9); return P(['What is the cumulative frequency after all three groups?', 'ما التكرار التراكمي بعد المجموعات الثلاث؟'], 'frequencies ' + a + ', ' + b + ', ' + c, a + b + c); },
    function (r) { var q = r.int(10, 30), w = r.int(5, 30); return P(['What is the interquartile range, Q3 − Q1?', 'ما المدى الربيعي Q3 − Q1؟'], 'Q1 = ' + q + ', Q3 = ' + (q + w), w); },
    function (r) { var n = r.pick([40, 80, 100, 200]); return P(['Position of the lower quartile.', 'موضع الربيع الأدنى.'], n + ' values', n / 4); }
  ]);
  Topic('x9m.logic', ['Reasoning with parity', 'الاستدلال بالزوجية'], 'scale', [['Even plus even is even, odd plus odd is even, and odd times odd is odd. Write an even number as 2n and an odd one as 2n + 1. That single trick proves dozens of results.', 'زوجي + زوجي زوجي، وفردي + فردي زوجي. اكتب الزوجي 2n والفردي 2n + 1، وبهذا تثبت نتائج كثيرة.']], [
    [['The sum of two odd numbers is always:', 'مجموع فرديين دائمًا:'], ['Even', 'زوجي'], ['Odd', 'فردي'], ['Prime', 'أولي']],
    [['n² is odd. Then n is:', 'n² فردي. إذن n:'], ['Odd', 'فردي'], ['Even', 'زوجي'], ['Either', 'أي منهما']],
    function (r) { var n = r.int(2, 30); return P(['Value of 2n + 1.', 'قيمة 2n + 1.'], 'n = ' + n, 2 * n + 1); }
  ]);
  /* ---------- maths, Year 10 ---------- */
  U('math', 'x10m', ['IGCSE extended: trig, graphs, proof', 'المستوى الممتد: مثلثات ورسوم وبرهان'], 3, 10, true);
  Topic('x10m.exact', ['Exact trigonometric values', 'القيم المثلثية الدقيقة'], 'compass', [['sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1, sin 90° = 1, cos 0° = 1, cos 90° = 0. Halve a 2-unit equilateral triangle to rebuild the rest, instead of memorising them.', 'sin 30° = 1/2 وcos 60° = 1/2 وtan 45° = 1. نصّف مثلثًا متساوي الأضلاع لتستنتج الباقي.']], [
    function (r) { var q = r.pick([['sin 90°', 1], ['cos 0°', 1], ['tan 45°', 1], ['cos 90°', 0], ['sin 0°', 0], ['tan 0°', 0]]); return P(['What is the exact value?', 'ما القيمة الدقيقة؟'], q[0], q[1]); },
    function (r) { var a = r.int(1, 12) * 2; return P(['Use sin 30° = ½. What is it worth?', 'استعمل sin 30° = ½. كم تساوي؟'], a + ' × sin 30°', a / 2); },
    function (r) { var a = r.int(1, 12) * 2; return P(['Use cos 60° = ½. What is it worth?', 'استعمل cos 60° = ½. كم تساوي؟'], a + ' × cos 60°', a / 2); }
  ]);
  Topic('x10m.trigg', ['Graphs of sine, cosine, tangent', 'رسوم الجيب وجيب التمام والظل'], 'wave', [['Sine and cosine repeat every 360°, between −1 and 1. Tangent repeats every 180°, with gaps. So sin x = 1/2 has two answers between 0° and 360°: 30° and 150°.', 'يتكرر الجيب وجيب التمام كل ٣٦٠° بين −١ و١، والظل كل ١٨٠°. فـ sin x = 1/2 له حلان: ٣٠° و١٥٠°.']], [
    function (r) { var a = r.pick([10, 20, 30, 40, 50, 60, 70, 80]); return P(['The other solution of sin x, degrees.', 'الحل الآخر للجيب.'], 'x = ' + a + '°', 180 - a); },
    function (r) { var a = r.pick([10, 20, 30, 40, 50, 60, 70, 80]); return P(['The other solution of cos x, degrees.', 'الحل الآخر لجيب التمام.'], 'x = ' + a + '°', 360 - a); },
    function () { return P(['Period of tan x, degrees.', 'دورة tan x.'], '', 180); },
    function (r) { var a = r.int(2, 9); return P(['What is the largest value this can take?', 'ما أكبر قيمة يمكن أن يبلغها؟'], a + ' sin x', a); }
  ]);
  Topic('x10m.halfab', ['Area with sine', 'المساحة بالجيب'], 'mountain', [['Area of any triangle = ½ab sin C, with C between sides a and b. With sides 8 and 10 and an angle of 30°: ½ × 8 × 10 × ½ = 20.', 'مساحة أي مثلث = ½ab sin C والزاوية C بين الضلعين. مع ٨ و١٠ وزاوية ٣٠°: ٢٠.']], [
    function (r) { var a = r.int(1, 9) * 2, b = r.int(1, 9) * 2; return P(['Use ½ab sin C. What is the triangle’s area?', 'استعمل ½ab sin C. ما مساحة المثلث؟'], 'sides ' + a + ', ' + b + '; angle 30°', a * b / 4); },
    function (r) { var a = r.int(1, 9) * 2, b = r.int(1, 12); return P(['Use ½ab sin C. What is the triangle’s area?', 'استعمل ½ab sin C. ما مساحة المثلث؟'], 'sides ' + a + ', ' + b + '; angle 90°', a * b / 2); }
  ]);
  Topic('x10m.graphs', ['Cubic and reciprocal graphs', 'الرسوم التكعيبية والمقلوبة'], 'ruler', [['y = x³ rises through the origin, flat at the middle. y = 1/x has two branches, and never touches the axes. Sketch by asking: what happens at x = 0, and when x is huge?', 'y = x³ تصعد عبر الأصل. وy = 1/x فرعان لا يمسان المحورين. اسأل: ماذا عند الصفر، وعند x الكبيرة؟']], [
    function (r) { var x = r.int(1, 6); return P(['What is y at this x?', 'ما قيمة y عند x هذه؟'], 'y = x^3, x = ' + x, x * x * x); },
    function (r) { var x = r.int(1, 5); return X(['What is y at this x? Watch the sign.', 'ما قيمة y عند x هذه؟ انتبه للإشارة.'], 'y = x^3, x = −' + x, -x * x * x); },
    [['y = 1/x, at x = 0:', 'y = 1/x عند x = 0:'], ['Is undefined', 'غير معرفة'], ['Is 0', 'تساوي ٠'], ['Is 1', 'تساوي ١']]
  ]);
  Topic('x10m.proof', ['Algebraic proof', 'البرهان الجبري'], 'scale', [['Show that the sum of three consecutive numbers is a multiple of 3: n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1). Examples are not proof, because this covers every n.', 'أثبت أن مجموع ثلاثة أعداد متتالية من مضاعفات ٣: n + (n + 1) + (n + 2) = 3(n + 1). والأمثلة ليست برهانًا.']], [
    function (r) { var n = r.int(4, 60); return P(['Sum of n, n + 1, n + 2.', 'المجموع.'], 'n = ' + n, 3 * n + 3); },
    function (r) { var n = r.int(3, 20); return P(['(n + 1)^2 − n^2 = 2n + 1.', '(n + 1)^2 − n^2.'], 'n = ' + n, 2 * n + 1); },
    [['Ten examples work. So the statement is:', 'نجحت عشرة أمثلة. إذن العبارة:'], ['Not yet proved', 'لم تثبت بعد'], ['Proved', 'مثبتة'], ['False', 'خاطئة']],
    [['One counterexample:', 'مثال مضاد واحد:'], ['Disproves a general claim', 'يبطل دعوى عامة'], ['Means nothing', 'لا معنى له'], ['Proves it', 'يثبتها']]
  ]);
  Topic('x10m.matrix', ['First steps with matrices', 'خطوات أولى في المصفوفات'], 'box', [['A matrix is a table of numbers. Multiply rows by columns: (1 2)·(3, 4) = 3 + 8 = 11. Order matters: AB is usually not BA. Screens, games and AI all run on this.', 'المصفوفة جدول أعداد. نضرب الصفوف في الأعمدة. والترتيب مهم: AB لا تساوي BA غالبًا.']], [
    function (r) { var a = r.int(1, 6), b = r.int(1, 6), c = r.int(1, 6), d = r.int(1, 6); return P(['Multiply the row by the column. What number results?', 'اضرب الصف في العمود. ما العدد الناتج؟'], '(' + a + ' ' + b + ') · (' + c + ', ' + d + ')', a * c + b * d); },
    function (r) { var k = r.int(2, 5), a = r.int(1, 9); return P(['Multiply the matrix by the number. What does the entry become?', 'اضرب المصفوفة في العدد. إلامَ يتحول العنصر؟'], k + ' × [' + a + ']', k * a); },
    [['Is AB always equal to BA?', 'هل AB تساوي BA دائمًا؟'], ['No', 'لا'], ['Yes', 'نعم'], ['Only for big matrices', 'للكبيرة فقط']]
  ]);
  Topic('x10m.corr', ['Correlation and lines of best fit', 'الارتباط وخط أفضل مطابقة'], 'scale', [['Correlation says two things move together. It does not say why. Draw a line through the middle of the points, and only predict inside the range of the data.', 'الارتباط يبين أن شيئين يتحركان معًا، لا السبب. ولا تتنبأ إلا داخل مدى البيانات.']], [
    [['Predicting far beyond your data is:', 'التنبؤ بعيدًا عن بياناتك:'], ['Unreliable', 'غير موثوق'], ['More accurate', 'أدق'], ['Always wrong by 10', 'خطأ دائمًا بعشرة']],
    function (r) { var m = r.int(2, 9), c = r.int(1, 20), x = r.int(1, 9); return P(['Use the line of best fit. What does it predict?', 'استعمل خط أفضل مطابقة. بماذا يتنبأ؟'], 'y = ' + m + 'x + ' + c + ', x = ' + x, m * x + c); }
  ]);

  /* ---------- science, Year 8 ---------- */
  U('science', 'x8s', ['Foundations of the sciences', 'أسس العلوم'], 3, 8, true);
  Topic('x8s.resp', ['Respiration', 'التنفس الخلوي'], 'fire', [['Every living cell releases energy from food: glucose + oxygen → carbon dioxide + water. It is not the same as breathing. Without enough oxygen, muscles make lactic acid.', 'كل خلية تطلق الطاقة: جلوكوز + أكسجين ← ثاني أكسيد الكربون + ماء. وليس هو التنفس بالرئتين. ونقص الأكسجين ينتج حمض اللاكتيك.']], [
    [['Respiration happens in:', 'يحدث التنفس في:'], ['Every living cell', 'كل خلية حية'], ['Lungs only', 'الرئتين فقط'], ['Plants never', 'لا يحدث في النبات']],
    [['Which organelle releases most of the energy?', 'أي عضي يطلق معظم الطاقة؟'], ['Mitochondrion', 'الميتوكوندريا'], ['Nucleus', 'النواة'], ['Vacuole', 'الفجوة']],
    function (r) { var b = r.int(12, 20), m = r.int(2, 9); return P(['Breaths in this time.', 'الأنفاس في هذه المدة.'], b + ' per minute, ' + m + ' minutes', b * m); }
  ]);
  Topic('x8s.photo', ['Photosynthesis', 'البناء الضوئي'], 'plant', [['Plants make glucose: carbon dioxide + water → glucose + oxygen, using light captured by chlorophyll. Nearly every food chain, and the oxygen you breathe, starts here.', 'تصنع النباتات الجلوكوز من ثاني أكسيد الكربون والماء بالضوء والكلوروفيل. ومن هنا تبدأ معظم السلاسل الغذائية.']], [
    [['Which gas do plants take in for it?', 'أي غاز تأخذه النباتات؟'], ['Carbon dioxide', 'ثاني أكسيد الكربون'], ['Oxygen', 'الأكسجين'], ['Nitrogen', 'النيتروجين']],
    [['Where does the plant get water?', 'من أين يأتي الماء؟'], ['From the roots', 'من الجذور'], ['Through the flowers', 'من الأزهار'], ['From light', 'من الضوء']],
    [['Do plants respire at night?', 'هل تتنفس النباتات ليلًا؟'], ['Yes, all the time', 'نعم، دائمًا'], ['No, never', 'لا أبدًا'], ['Only in summer', 'صيفًا فقط']]
  ]);
  Topic('x8s.skeleton', ['Bones and muscles', 'العظام والعضلات'], 'heart', [['Muscles only pull, so they work in pairs: the biceps bends the arm, and the triceps straightens it. Bones protect, support and make blood cells. Adults have 206.', 'العضلات تسحب فقط فتعمل أزواجًا: الثنائية تثني الذراع والثلاثية تمدها. والعظام تحمي وتصنع خلايا الدم.']], [
    function () { return P(['Bones in an adult.', 'عظام البالغ.'], '', 206); },
    [['Muscles can only:', 'تستطيع العضلات فقط:'], ['Pull', 'السحب'], ['Push', 'الدفع'], ['Both', 'كليهما']],
    [['Bones are joined to muscles by:', 'تربط العضلات بالعظام:'], ['Tendons', 'الأوتار'], ['Ligaments', 'الأربطة'], ['Nerves', 'الأعصاب']]
  ]);
  Topic('x8s.food', ['Nutrients and a good diet', 'المغذيات والغذاء الجيد'], 'plate', [['Carbohydrates and fats give energy, proteins build, and vitamins and minerals regulate. Fibre and water matter too. Energy in beyond energy out is stored as fat. Eating moderately is also part of our deen.', 'الكربوهيدرات والدهون طاقة، والبروتين بناء، والفيتامينات تنظم. وفائض الطاقة يخزن دهونًا. والاعتدال في الطعام من ديننا.']], [
    function (r) { var a = r.int(2, 9) * 100, b = r.int(2, 5) * 100; return P(['How much energy is in this food, in kJ?', 'كم الطاقة في هذا الطعام بالكيلوجول؟'], a + ' g food at ' + (b / 100) + ' kJ per g', a * b / 100); },
    [['Which builds and repairs the body?', 'أيها يبني الجسم؟'], ['Protein', 'البروتين'], ['Fibre', 'الألياف'], ['Water', 'الماء']],
    [['Lack of vitamin C causes:', 'نقص فيتامين ج يسبب:'], ['Scurvy', 'الإسقربوط'], ['Rickets', 'الكساح'], ['Asthma', 'الربو']]
  ]);
  Topic('x8s.particles', ['Solids, liquids and gases', 'المواد الصلبة والسائلة والغازية'], 'drop', [['Particles are close and fixed in solids, close and moving in liquids, and far apart in gases. Heating gives them energy. During melting or boiling, the temperature holds still until the change is complete.', 'الجسيمات متقاربة ثابتة في الصلب، متقاربة متحركة في السائل، متباعدة في الغاز. وتثبت الحرارة أثناء الانصهار والغليان.']], [
    [['Which is easiest to compress?', 'أيها أسهل انضغاطًا؟'], ['Gas', 'الغاز'], ['Liquid', 'السائل'], ['Solid', 'الصلب']],
    function () { return P(['Boiling point of pure water at sea level, °C.', 'غليان الماء النقي.'], '', 100); },
    [['Why does a puddle dry without boiling?', 'لماذا تجف البركة بلا غليان؟'], ['Fast particles escape: evaporation', 'تفلت الجسيمات السريعة: التبخر'], ['Water is destroyed', 'يفنى الماء'], ['The ground drinks all of it', 'تشربه الأرض كله']]
  ]);
  Topic('x8s.air', ['Air and burning', 'الهواء والاحتراق'], 'fire', [['Air is about 78% nitrogen and 21% oxygen. Fire needs fuel, oxygen and heat, so remove any one and it goes out. Burning fuels produces carbon dioxide and water, and carbon monoxide if oxygen is short, a gas that kills silently.', 'الهواء نحو ٧٨٪ نيتروجين و٢١٪ أكسجين. وتحتاج النار وقودًا وأكسجينًا وحرارة. ونقص الأكسجين ينتج أول أكسيد الكربون القاتل.']], [
    function () { return P(['% of air that is nitrogen, about.', 'نسبة النيتروجين.'], '', 78); },
    [['A pan of oil catches fire. You should:', 'اشتعل زيت في قدر. عليك:'], ['Cover it with a lid and turn off the heat', 'تغطيته وإطفاء الموقد'], ['Pour water on it', 'صب الماء'], ['Carry it outside', 'حمله للخارج']],
    [['Why is carbon monoxide so dangerous?', 'لماذا أول أكسيد الكربون خطر؟'], ['You cannot see or smell it', 'لا يُرى ولا يُشم'], ['It burns skin', 'يحرق الجلد'], ['It is heavy', 'ثقيل']]
  ]);
  Topic('x8s.light', ['Reflection and refraction', 'الانعكاس والانكسار'], 'lens', [['Angle of incidence equals angle of reflection, both measured from the normal. Light bends as it changes speed, entering glass or water. That is why a straw looks broken. Ibn Sahl and Ibn al-Haytham studied exactly this.', 'زاوية السقوط تساوي الانعكاس من العمود. وينكسر الضوء عند تغير سرعته. وقد درس ابن سهل وابن الهيثم هذا.']], [
    function (r) { var a = r.int(10, 80); return P(['Angle of reflection, degrees.', 'زاوية الانعكاس.'], 'incidence ' + a + '°', a); },
    function (r) { var a = r.int(10, 80); return P(['Angle from the normal.', 'الزاوية من العمود.'], 'ray ' + a + '° above the mirror’s surface', 90 - a); },
    [['Entering glass from air, light bends:', 'عند دخول الزجاج ينحرف الضوء:'], ['Toward the normal', 'نحو العمود'], ['Away from the normal', 'بعيدًا عن العمود'], ['Not at all', 'لا ينحرف']]
  ]);
  Topic('x8s.earth', ['Seasons, day and the moon', 'الفصول والنهار والقمر'], 'planet', [['Seasons come from the earth’s tilt of 23.5°, not its distance from the sun. The moon’s phases follow a cycle of about 29.5 days, which gives the months of the Islamic calendar.', 'تنشأ الفصول من ميل الأرض ٢٣٫٥° لا من بعدها. وأطوار القمر دورتها نحو ٢٩٫٥ يومًا، وعليها الشهور الهجرية.']], [
    [['Why are there seasons?', 'لماذا الفصول؟'], ['The earth’s axis is tilted', 'محور الأرض مائل'], ['Earth gets nearer the sun', 'تقترب الأرض من الشمس'], ['The sun changes size', 'يتغير حجم الشمس']],
    function (r) { var k = r.int(1, 6); return P(['Days, if months alternate 30 and 29.', 'الأيام إذا تعاقبت ٣٠ و٢٩.'], (k * 2) + ' lunar months', k * 59); },
    [['The Hijrī year, against the solar year, is:', 'السنة الهجرية مقابل الشمسية:'], ['About 11 days shorter', 'أقصر بنحو ١١ يومًا'], ['Longer', 'أطول'], ['Equal', 'مساوية']]
  ]);
  Topic('x8s.vars', ['Fair tests and variables', 'الاختبار العادل والمتغيرات'], 'notebook', [['Change one variable, measure another, and hold the rest constant. Repeat, and take a mean. An outlier is a result that does not fit, so find out why before you drop it.', 'غير متغيرًا واحدًا وقس آخر وثبت البقية. كرر وخذ المتوسط. والقيمة الشاذة ابحث عن سببها قبل حذفها.']], [
    [['The variable you change is the:', 'المتغير الذي تغيره:'], ['Independent', 'المستقل'], ['Dependent', 'التابع'], ['Control', 'الضابط']],
    function (r) { var a = r.int(10, 30), d = r.int(1, 3); return P(['Mean of the three.', 'متوسط الثلاثة.'], (a - d) + ', ' + a + ', ' + (a + d), a); },
    [['Why repeat an experiment?', 'لماذا تكرر التجربة؟'], ['To check reliability', 'للتحقق من الموثوقية'], ['To change the result', 'لتغيير النتيجة'], ['To use more time', 'لقضاء الوقت']]
  ]);
  /* ---------- science, Year 10 ---------- */
  U('science', 'x10b', ['IGCSE biology, full road', 'أحياء IGCSE'], 3, 10, true);
  Topic('x10b.blood', ['Blood and what it carries', 'الدم وما يحمله'], 'heart', [['Plasma carries glucose, urea and hormones. Red cells carry oxygen, with no nucleus and a biconcave shape to fit more haemoglobin. White cells defend, and platelets clot.', 'البلازما تحمل الجلوكوز واليوريا والهرمونات. والحمراء تحمل الأكسجين، والبيضاء تدافع، والصفائح تخثر.']], [
    [['Red cells have no:', 'الخلايا الحمراء بلا:'], ['Nucleus', 'نواة'], ['Haemoglobin', 'هيموجلوبين'], ['Membrane', 'غشاء']],
    [['What starts a clot?', 'ما الذي يبدأ التخثر؟'], ['Platelets', 'الصفائح'], ['Plasma alone', 'البلازما وحدها'], ['Red cells', 'الخلايا الحمراء']],
    function (r) { var a = r.int(3, 6); return P(['Litres of blood, at about 1/12 of body mass.', 'لترات الدم، نحو ١/١٢ من الكتلة.'], (a * 12) + ' kg person', a); }
  ]);
  Topic('x10b.plantrepro', ['Reproduction in plants', 'التكاثر في النبات'], 'plant', [['Pollen lands on the stigma, grows a tube, and fertilises the ovule, which becomes a seed, while the ovary becomes the fruit. Insects, wind and water carry pollen. Seeds need water, warmth and oxygen to germinate.', 'يقع اللقاح على الميسم وينمو أنبوبه فيخصب البويضة فتصير بذرة، والمبيض ثمرة. وتحتاج البذور ماء ودفئًا وأكسجينًا.']], [
    [['The ovary becomes the:', 'يصير المبيض:'], ['Fruit', 'ثمرة'], ['Root', 'جذرًا'], ['Pollen', 'لقاحًا']],
    [['Wind-pollinated flowers usually have:', 'الأزهار الهوائية غالبًا:'], ['Small petals and light pollen', 'بتلات صغيرة ولقاح خفيف'], ['Bright petals', 'بتلات زاهية'], ['Sweet nectar', 'رحيق حلو']],
    [['What does a seed not need to germinate?', 'ما الذي لا تحتاجه البذرة للإنبات؟'], ['Light, for most seeds', 'الضوء لمعظم البذور'], ['Water', 'الماء'], ['Oxygen', 'الأكسجين']]
  ]);
  Topic('x10b.stem', ['Stem cells and cloning', 'الخلايا الجذعية والاستنساخ'], 'microscope', [['Stem cells can become other kinds of cell, and they may repair damage. Cloning makes genetically identical copies. Scholars and councils weigh each use, especially where a human embryo is involved.', 'الخلايا الجذعية تتحول إلى أنواع أخرى. والاستنساخ يصنع نسخًا متطابقة. ويوازن العلماء كل استعمال، خاصة مع الأجنة.']], [
    [['Stem cells differ because they can:', 'تتميز الجذعية بأنها:'], ['Become other cell types', 'تتحول إلى أنواع أخرى'], ['Never divide', 'لا تنقسم'], ['Live without oxygen', 'تعيش بلا أكسجين']],
    [['Selective breeding works by:', 'يعمل الانتقاء الصناعي بـ:'], ['Choosing parents with wanted traits', 'اختيار آباء بصفات مرغوبة'], ['Editing DNA', 'تعديل DNA'], ['Using radiation', 'الإشعاع']]
  ]);
  Topic('x10b.sample', ['Sampling a habitat', 'معاينة الموطن'], 'tree', [['Random quadrats estimate a population: mean per quadrat × total area ÷ quadrat area. A transect shows change along a line. Capture-recapture counts animals: first × second ÷ marked in the second.', 'المربعات العشوائية تقدر العشيرة. والخط يبين التغير. والصيد وإعادة الصيد: الأول × الثاني ÷ المعلم في الثاني.']], [
    function (r) { var m = r.int(2, 9), a = r.int(2, 20) * 10; return P(['Estimated population (1 m² quadrats).', 'تقدير العشيرة.'], m + ' per quadrat, field ' + a + ' m²', m * a); },
    function (r) { var m = r.pick([2, 4, 5, 10]), f = m * r.int(2, 6), s = r.int(2, 9) * 10; return P(['Capture–recapture: what is the estimated population?', 'الصيد وإعادة الصيد: ما تقدير حجم العشيرة؟'], f + ' marked first; second catch ' + s + ', of which ' + m + ' marked', f * s / m); },
    [['Why must quadrats be placed randomly?', 'لماذا عشوائيًا؟'], ['To avoid bias', 'لتجنب التحيز'], ['To save time', 'لتوفير الوقت'], ['To find rare species', 'لإيجاد النادر']]
  ]);
  U('science', 'x10c', ['IGCSE chemistry, full road', 'كيمياء IGCSE'], 3, 10, true);
  Topic('x10c.titr', ['Titration, in the lab', 'المعايرة في المختبر'], 'drop', [['Rinse the burette, add the acid slowly, swirl, and stop at the first permanent colour change. Repeat until two results agree within 0.1 cm³, then average those. Read at the bottom of the meniscus.', 'اشطف السحاحة وأضف الحمض ببطء ورج، وتوقف عند أول تغير ثابت. كرر حتى تتفق نتيجتان، واقرأ أسفل التقعر.']], [
    function (r) { var a = r.int(5, 20), b = r.int(10, 30); return P(['How much did the burette deliver, in cm³?', 'كم أضافت السحاحة بالسنتيمتر المكعب؟'], 'start ' + a + ', end ' + (a + b), b); },
    function (r) { var a = r.int(10, 30), b = a + 2; return P(['Mean of the two results, in cm³.', 'متوسط النتيجتين.'], a + ' and ' + b, a + 1); },
    [['Why swirl the flask?', 'لماذا ترج الدورق؟'], ['To mix, and see the true end point', 'للخلط ورؤية نقطة النهاية'], ['To warm it', 'لتسخينه'], ['To add air', 'لإضافة الهواء']]
  ]);
  Topic('x10c.rev', ['Reversible reactions', 'التفاعلات العكسية'], 'scale', [['⇌ means both ways. At equilibrium, forward and back run at the same rate, so the amounts stay steady, though they need not be equal. Heating blue copper sulfate drives off water, and adding water brings the blue back.', '⇌ تعني الاتجاهين. عند الاتزان يتساوى المعدلان. وتسخين كبريتات النحاس الزرقاء يطرد الماء، وإضافته تعيد اللون.']], [
    [['At equilibrium, the forward and back rates are:', 'عند الاتزان المعدلان:'], ['Equal', 'متساويان'], ['Both zero', 'صفر'], ['Always changing', 'متغيران دائمًا']],
    [['Adding water to white copper sulfate:', 'إضافة الماء إلى كبريتات النحاس البيضاء:'], ['Turns it blue', 'تجعلها زرقاء'], ['Melts it', 'تصهرها'], ['Does nothing', 'لا شيء']]
  ]);
  Topic('x10c.alkene', ['Alkenes, alcohols and cracking', 'الألكينات والكحولات والتكسير'], 'lemon', [['Cracking splits long oil chains into shorter, more useful ones, and alkenes. Alkenes have a C=C double bond, and turn bromine water colourless. Ethanol is made by fermenting sugar, or from ethene and steam.', 'التكسير يشق السلاسل الطويلة إلى أقصر وألكينات. والألكين فيه رابطة C=C ويزيل لون ماء البروم.']], [
    function (r) { var n = r.int(2, 8); return P(['H atoms in the alkene.', 'ذرات الهيدروجين.'], 'C' + n + 'H?', 2 * n); },
    [['Which test detects an alkene?', 'أي اختبار يكشف الألكين؟'], ['Bromine water', 'ماء البروم'], ['Limewater', 'ماء الجير'], ['A glowing splint', 'شظية متوهجة']],
    [['Why crack long chains?', 'لماذا يكسر؟'], ['Demand is higher for short ones', 'الطلب أكبر على القصيرة'], ['To make water', 'لصنع الماء'], ['To remove carbon', 'لإزالة الكربون']]
  ]);
  Topic('x10c.ionic', ['Ionic equations', 'المعادلات الأيونية'], 'plug', [['Write only what changes: H⁺ + OH⁻ → H₂O covers every acid and alkali. The rest are spectator ions. Charges, as well as atoms, must balance.', 'اكتب ما يتغير فقط: H⁺ + OH⁻ → H₂O لكل حمض وقلوي. والأيونات الأخرى متفرجة. ووازن الشحن والذرات.']], [
    [['Which are spectator ions in HCl + NaOH?', 'أي أيونات متفرجة في HCl + NaOH؟'], ['Na⁺ and Cl⁻', 'Na⁺ وCl⁻'], ['H⁺ and OH⁻', 'H⁺ وOH⁻'], ['None', 'لا شيء']],
    function () { return P(['Total charge on the right of Cu²⁺ + 2e⁻ → Cu.', 'الشحنة الكلية في الطرف الأيمن.'], '', 0); },
    function () { return P(['How many electrons turn one Al³⁺ ion into an atom?', 'كم إلكترونًا يحول أيون Al³⁺ إلى ذرة؟'], 'Al³⁺ + ?e⁻ → Al', 3); }
  ]);
  Topic('x10c.atmos', ['Air quality and clean water', 'جودة الهواء والماء النقي'], 'tree', [['Sulfur dioxide gives acid rain, and nitrogen oxides harm lungs. Greenhouse gases warm the planet. Drinking water is filtered to remove solids, and chlorinated to kill microbes. Sea water can be distilled at high energy cost.', 'ثاني أكسيد الكبريت يسبب المطر الحمضي. وتُفلتر مياه الشرب وتُكلور. وتحلية البحر كثيفة الطاقة.']], [
    [['Acid rain comes mostly from:', 'ينشأ المطر الحمضي من:'], ['Sulfur dioxide', 'ثاني أكسيد الكبريت'], ['Oxygen', 'الأكسجين'], ['Water vapour', 'بخار الماء']],
    [['Chlorine is added to drinking water to:', 'يضاف الكلور لمياه الشرب:'], ['Kill microbes', 'لقتل الجراثيم'], ['Add colour', 'لإضافة لون'], ['Remove salt', 'لإزالة الملح']]
  ]);
  U('science', 'x10p', ['IGCSE physics, full road', 'فيزياء IGCSE'], 3, 10, true);
  Topic('x10p.hooke', ['Springs and Hooke’s law', 'النوابض وقانون هوك'], 'wrench', [['F = kx, up to the limit of proportionality. Stretch twice as far, with twice the force. Past the elastic limit, the spring stays bent. Stored energy = ½kx².', 'F = kx حتى حد التناسب. وبعد حد المرونة لا يعود النابض. والطاقة المخزنة ½kx².']], [
    function (r) { var k = r.int(2, 30), x = r.int(1, 9); return P(['Hooke’s law, F = kx: what is the force, in N?', 'قانون هوك F = kx: ما القوة بالنيوتن؟'], 'k = ' + k + ' N/m, x = ' + x + ' m', k * x); },
    function (r) { var k = r.int(2, 30), x = r.int(1, 9); return P(['What is the spring constant, in N/m?', 'ما ثابت النابض بالنيوتن لكل متر؟'], (k * x) + ' N stretches it ' + x + ' m', k); },
    function (r) { var k = r.pick([2, 4, 10, 20]), x = r.int(1, 9); return P(['Energy stored, in J.', 'الطاقة المخزنة.'], 'k = ' + k + ', x = ' + x, k * x * x / 2); }
  ]);
  Topic('x10p.terminal', ['Drag and terminal velocity', 'مقاومة الهواء والسرعة الحدية'], 'ball', [['A falling object speeds up until drag equals its weight. Then net force is zero, so it falls steadily. A parachute increases drag and lowers that speed. Braking distance grows with the square of speed.', 'يتسارع الساقط حتى تساوي المقاومة وزنه فيثبت. والمظلة تزيد المقاومة. ومسافة الكبح تتناسب مع مربع السرعة.']], [
    function (r) { var k = r.int(2, 4); return P(['Braking distance is multiplied by?', 'تضرب مسافة الكبح في؟'], 'speed × ' + k, k * k); },
    function (r) { var m = r.int(2, 90); return P(['Drag at terminal velocity, in N (g = 10).', 'المقاومة عند السرعة الحدية.'], m + ' kg', m * 10); },
    [['At terminal velocity, acceleration is:', 'عند السرعة الحدية التسارع:'], ['Zero', 'صفر'], ['g', 'g'], ['Rising', 'يزيد']]
  ]);
  Topic('x10p.tir', ['Total internal reflection', 'الانعكاس الكلي الداخلي'], 'lens', [['Going from glass into air at more than the critical angle, light reflects back entirely. Optical fibres carry the internet this way. n = sin i ÷ sin r, and n = speed in air ÷ speed in the material.', 'من الزجاج إلى الهواء بزاوية أكبر من الحرجة ينعكس الضوء كله. وبهذا تنقل الألياف الإنترنت.']], [
    function (r) { var k = r.pick([1.5, 2, 2.5]); return P(['Speed in the material, million m/s.', 'السرعة في المادة.'], 'n = ' + k + ' (300 million m/s in air)', 300 / k); },
    [['Optical fibres use:', 'تستعمل الألياف:'], ['Total internal reflection', 'الانعكاس الكلي'], ['Diffraction', 'الحيود'], ['Sound', 'الصوت']],
    [['It happens when light travels:', 'يحدث إذا انتقل الضوء:'], ['Into a less dense medium', 'إلى وسط أقل كثافة'], ['Into a denser medium', 'إلى وسط أكثف'], ['In vacuum only', 'في الفراغ فقط']]
  ]);
  Topic('x10p.circ', ['Series and parallel circuits', 'الدوائر على التوالي والتوازي'], 'bulb', [['In series the current is the same everywhere, and voltages share out. In parallel each branch gets the full voltage, and currents share out. So a house is wired in parallel: one lamp can fail alone.', 'على التوالي التيار واحد والجهود تتقاسم. وعلى التوازي لكل فرع الجهد كاملًا. لذا البيوت توازي.']], [
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return P(['In series the voltages add. What is the supply voltage?', 'على التوالي تُجمع الجهود. ما جهد المصدر؟'], a + ' V and ' + b + ' V across series lamps', a + b); },
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return P(['Current from the cell, in A.', 'تيار الخلية.'], 'parallel branches ' + a + ' A and ' + b + ' A', a + b); },
    function (r) { var v = r.int(2, 24); return P(['Voltage across each branch.', 'جهد كل فرع.'], v + ' V cell, parallel', v); }
  ]);
  Topic('x10p.motor', ['Motors and generators', 'المحركات والمولدات'], 'magnet', [['A current in a magnetic field feels a force, so a motor turns. Move a wire through a field and a voltage appears, so a generator makes power. They are the same machine, run opposite ways.', 'التيار في مجال يتأثر بقوة فيدور المحرك. وتحريك سلك في مجال يولد جهدًا. وهما آلة واحدة بعكس الاتجاه.']], [
    [['A generator turns:', 'يحول المولد:'], ['Motion into electricity', 'الحركة إلى كهرباء'], ['Electricity into motion', 'الكهرباء إلى حركة'], ['Heat into light', 'الحرارة إلى ضوء']],
    [['Which makes a motor stronger?', 'أيها يقوي المحرك؟'], ['More current or a stronger magnet', 'تيار أكثر أو مغناطيس أقوى'], ['A thinner shaft', 'محور أرق'], ['Less current', 'تيار أقل']]
  ]);
  Topic('x10p.uncert', ['Measuring and uncertainty', 'القياس وعدم اليقين'], 'ruler', [['Every measurement has an uncertainty, often half the smallest division. Measure many swings and divide, to shrink the error. Zero errors shift all your readings together, and repeating will not reveal them.', 'لكل قياس عدم يقين. قس أرجحات كثيرة واقسم لتقليل الخطأ. وخطأ الصفر يزيح كل القراءات والتكرار لا يكشفه.']], [
    function (r) { var n = r.pick([10, 20, 50]), t = r.int(1, 3); return P(['Time for one swing, s.', 'زمن أرجحة.'], (n * t) + ' s for ' + n + ' swings', t); },
    function (r) { var a = r.int(10, 60), z = r.int(1, 4); return P(['Remove the zero error. What is the true reading?', 'أزل خطأ الصفر. ما القراءة الحقيقية؟'], 'reads ' + a + ', zero error +' + z, a - z); },
    [['A systematic error is best fixed by:', 'يصلح الخطأ المنتظم بـ:'], ['Calibrating', 'المعايرة'], ['Repeating', 'التكرار'], ['Rounding', 'التقريب']]
  ]);

  /* ---------- computing ---------- */
  U('computing', 'x9k', ['Reading and planning code', 'قراءة الكود وتخطيطه'], 3, 9, true);
  Topic('x9k.trace', ['Trace tables', 'جداول التتبع'], 'notebook', [['Make a column for each variable, and a row for each step. Do what the machine does, not what you hope it does. This is how you find nearly every logic bug.', 'عمود لكل متغير وصف لكل خطوة. افعل ما تفعله الآلة لا ما تأمله. وبهذا تجد أغلب الأخطاء المنطقية.']], [
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return P(OUT, 'a = ' + a + '; b = ' + b + '; a = a + b; b = a − b; print(b)', a); },
    function (r) { var n = r.int(3, 6); return P(OUT, 'x = 1; for i in 1..' + n + ': x = x + i; print(x)', 1 + n * (n + 1) / 2); },
    function (r) { var n = r.int(20, 90); return P(OUT, 'c = 0; n = ' + n + '; while n > 0: n −= 10, c += 1; print(c)', Math.ceil(n / 10)); }
  ]);
  Topic('x9k.nested', ['Nested loops and grids', 'الحلقات المتداخلة والشبكات'], 'box', [['A loop inside a loop visits every pair. A 3 × 4 grid takes 12 steps. Images, game boards and spreadsheets are all grids. Double the size of a square grid, and the work goes up four times.', 'حلقة داخل حلقة تزور كل زوج. وشبكة ٣ × ٤ تأخذ ١٢ خطوة. وبمضاعفة الشبكة المربعة تتضاعف الخطوات أربعًا.']], [
    function (r) { var a = r.int(2, 12), b = r.int(2, 12); return P(['How many times does the inner line run?', 'كم ينفذ السطر الداخلي؟'], 'for x in ' + a + ' items: for y in ' + b + ' items', a * b); },
    function (r) { var w = r.int(2, 9) * 10, h = r.int(2, 9) * 10; return P(['How many pixels does the image have?', 'كم بكسلًا في الصورة؟'], w + ' × ' + h + ' image', w * h); },
    function (r) { var n = r.int(3, 9); return P(OUT, 'c = 0; for i in 1..' + n + ': for j in 1..i: c += 1; print(c)', n * (n + 1) / 2); }
  ]);
  Topic('x9k.pseudo', ['Planning with pseudocode', 'التخطيط بالكود الوصفي'], 'pen', [['Before typing, write the steps in plain words. Inputs, steps, outputs. Check it on one small example by hand. Five minutes of planning saves an hour of debugging, and pseudocode is on Cambridge papers.', 'قبل الكتابة دون الخطوات بكلمات بسيطة: مدخلات وخطوات ومخرجات. وجربها على مثال صغير باليد.']], [
    [['What should a plan state first?', 'ما أول ما تذكره الخطة؟'], ['Inputs and the output you expect', 'المدخلات والناتج المتوقع'], ['The font', 'الخط'], ['The file name', 'اسم الملف']],
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(['Output of the plan.', 'ناتج الخطة.'], 'set total to ' + a + '; multiply by ' + b + '; add 1', a * b + 1); }
  ]);
  U('computing', 'x10k', ['Data, networks and building things', 'البيانات والشبكات والبناء'], 3, 10, true);
  Topic('x10k.bits', ['How images and sound are stored', 'كيف تُخزن الصور والأصوات'], 'wave', [['Image size = width × height × bits per pixel. 8 bits make a byte. Sound size = sample rate × bits × seconds. These sums tell you why a photo costs far more than a page of text.', 'حجم الصورة = العرض × الارتفاع × البتات لكل بكسل. والبايت ٨ بتات. وحجم الصوت = معدل العينات × البتات × الثواني.']], [
    function (r) { var w = r.int(2, 9) * 8, h = r.int(2, 9), b = r.pick([8, 24]); return P(['What is the file size, in bytes?', 'ما حجم الملف بالبايت؟'], w + ' × ' + h + ' at ' + b + ' bits a pixel', w * h * b / 8); },
    function (r) { var b = r.int(2, 9); return P(['How many bits is that?', 'كم بتًا يساوي ذلك؟'], b + ' bytes', b * 8); },
    function (r) { var c = r.int(1, 8); return P(['How many different colours can each pixel show?', 'كم لونًا مختلفًا يمكن أن يُظهره كل بكسل؟'], c + ' bits a pixel', Math.pow(2, c)); }
  ]);
  Topic('x10k.compress', ['Compression', 'الضغط'], 'box', [['Run-length coding stores AAAAABBB as 5A3B. Lossless compression gets back every bit, as in ZIP. Lossy throws away what you will hardly notice, as in JPEG and MP3. Never lose detail in a medical scan or a program.', 'الترميز التكراري يخزن AAAAABBB كـ5A3B. وبلا فقد يعيد كل بت، والفاقد كـJPEG يحذف ما لا يلاحظ.']], [
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(['Letters stored in the original.', 'حروف الأصل.'], a + 'A' + b + 'B', a + b); },
    function (r) { var k = r.int(2, 9), s = r.int(2, 9); return P(['What is the compressed size, in MB?', 'ما الحجم بعد الضغط بالميغابايت؟'], (k * s) + ' MB, ratio ' + k + ':1', s); },
    [['A program file must use:', 'ملف البرنامج يجب أن يستعمل:'], ['Lossless compression', 'ضغطًا بلا فقد'], ['Lossy compression', 'ضغطًا فاقدًا'], ['No files', 'لا ملفات']]
  ]);
  Topic('x10k.dict', ['Dictionaries and counting', 'القواميس والعد'], 'book', [['A Python dictionary maps keys to values: scores["Ali"] = 7. Counting things is its classic job: for each word, add 1 to its count. Finding a key takes about the same time, however large the dictionary.', 'القاموس يربط المفاتيح بالقيم. وعد الأشياء وظيفته المعتادة. والبحث بالمفتاح يأخذ الوقت نفسه تقريبًا.']], [
    function (r) { var a = r.int(2, 9), b = r.int(1, 5); return P(OUT, 'd = {"x": ' + a + '}; d["x"] = d["x"] + ' + b + '; print(d["x"])', a + b); },
    function (r) { var a = r.int(2, 5), b = r.int(2, 5); return P(['How many keys does the dictionary end up with?', 'كم مفتاحًا يصير في القاموس؟'], 'count the letters of "' + 'a'.repeat(a) + 'b'.repeat(b) + '"', 2); },
    [['A dictionary is best for:', 'القاموس أنسب لـ:'], ['Looking up a value by name', 'البحث عن قيمة بالاسم'], ['Keeping items sorted', 'إبقاء العناصر مرتبة'], ['Storing a video', 'تخزين فيديو']]
  ]);
  Topic('x10k.class', ['Your first class', 'أول صنف تكتبه'], 'gear', [['A class bundles data with what it can do. class Account has a balance and a deposit method. Objects made from it each keep their own balance. Use one when data and behaviour belong together.', 'الصنف يجمع البيانات وأفعالها. وكل كائن يحتفظ بقيمه. واستعمله إذا اجتمعت البيانات والسلوك.']], [
    function (r) { var a = r.int(2, 50), b = r.int(2, 50); return P(OUT, 'a = Account(' + a + '); a.deposit(' + b + '); print(a.balance)', a + b); },
    function (r) { var a = r.int(2, 50), b = r.int(2, 50); return P(['After this code runs, what is q’s balance?', 'بعد تشغيل هذا الكود: ما رصيد q؟'], 'p = Account(' + a + '); q = Account(' + b + '); p.deposit(5)', b); },
    [['In a class, “self” refers to:', 'في الصنف "self" تشير إلى:'], ['This particular object', 'هذا الكائن'], ['The file', 'الملف'], ['The computer', 'الحاسوب']]
  ]);
  Topic('x10k.web', ['APIs and the web', 'الواجهات البرمجية والويب'], 'worldmap', [['A browser sends a GET request, and a server replies with a status and data. 200 means fine, 404 not found, 500 server error. An API is the same idea for programs, often replying in JSON.', 'يرسل المتصفح طلبًا ويرد الخادم بحالة وبيانات. ٢٠٠ سليم و٤٠٤ غير موجود و٥٠٠ خطأ خادم. والواجهة البرمجية مثله للبرامج.']], [
    function (r) { var q = r.pick([['not found', 404], ['fine', 200], ['server error', 500]]); return P(['Which HTTP status code means this?', 'أي رمز حالة HTTP يعني هذا؟'], q[0], q[1]); },
    [['JSON is:', 'JSON هو:'], ['A text format for data', 'صيغة نصية للبيانات'], ['A language for images', 'لغة صور'], ['A virus', 'فيروس']],
    [['Where should you keep an API key?', 'أين تحفظ مفتاح الواجهة؟'], ['Out of your public code', 'خارج الكود العام'], ['In a public post', 'في منشور عام'], ['In the page title', 'في عنوان الصفحة']]
  ]);
  Topic('x10k.data', ['Charts that tell the truth', 'رسوم صادقة'], 'notebook', [['A bar chart’s axis must begin at zero, or small differences look huge. Choose a line for change over time, and bars to compare. Check the source, and state the sample size. Plots persuade, so honesty here is a trust.', 'يجب أن يبدأ محور الأعمدة من الصفر. والخط للتغير الزمني والأعمدة للمقارنة. واذكر المصدر وحجم العينة. والأمانة هنا واجبة.']], [
    [['A bar chart whose axis starts at 90:', 'رسم أعمدة يبدأ محوره من ٩٠:'], ['Exaggerates small differences', 'يبالغ في الفروق'], ['Is more accurate', 'أدق'], ['Is required', 'مطلوب']],
    [['To show change over time, use:', 'لإظهار التغير الزمني استعمل:'], ['A line chart', 'رسمًا خطيًا'], ['A pie chart', 'دائريًا'], ['A word list', 'قائمة كلمات']],
    function (r) { var t = r.pick([100, 200, 400]), p = r.pick([25, 50, 75]); return P(['How many people is this?', 'كم شخصًا؟'], p + '% of ' + t, t * p / 100); }
  ]);
  Topic('x10k.law', ['Copyright, licences and open source', 'حقوق النشر والتراخيص والمصادر المفتوحة'], 'lock', [['Code you find is not yours just because you can copy it. Read the licence, keep the credits, and do not pirate software. Honest dealings extend to what others made. Open source lets everyone learn, under stated terms.', 'الكود الذي تجده ليس ملكك لمجرد نسخه. اقرأ الترخيص واحفظ النسبة ولا تقرصن. والأمانة تشمل عمل الآخرين.']], [
    [['You want to use code from the internet. First:', 'تريد كودًا من الإنترنت. أولًا:'], ['Check its licence', 'افحص ترخيصه'], ['Remove the author’s name', 'احذف اسم الكاتب'], ['Sell it', 'بعه']],
    [['Open source means:', 'المصدر المفتوح يعني:'], ['Source is shared under stated terms', 'مشاركة المصدر بشروط'], ['No rules at all', 'بلا قواعد'], ['Always insecure', 'غير آمن دائمًا']]
  ]);

  /* ---------- engineering ---------- */
  U('engineering', 'x8e', ['How things work', 'كيف تعمل الأشياء'], 3, 8, true);
  Topic('x8e.simple', ['Levers, pulleys and ramps', 'الروافع والبكرات والمنحدرات'], 'wrench', [['Simple machines trade force for distance. A lever with a long handle needs less force, moved further. Mechanical advantage = load ÷ effort. Work out is never more than work in.', 'الآلات البسيطة تبادل القوة بالمسافة. والفائدة الميكانيكية = الحمل ÷ الجهد. والشغل الخارج لا يزيد عن الداخل.']], [
    function (r) { var e = r.int(2, 30), k = r.int(2, 6); return P(['What is the mechanical advantage, load ÷ effort?', 'ما الفائدة الآلية: الحمل ÷ الجهد؟'], (e * k) + ' N load, ' + e + ' N effort', k); },
    function (r) { var n = r.int(2, 6), l = r.int(2, 9) * 10; return P(['Effort in N, with no friction.', 'الجهد بلا احتكاك.'], (l * n) + ' N load, ' + n + ' rope sections', l); },
    function (r) { var d = r.int(1, 3), k = r.int(2, 4); return P(['Distance the effort moves, m.', 'مسافة الجهد.'], 'lever ratio ' + k + ', load up ' + d + ' m', k * d); }
  ]);
  Topic('x8e.struct', ['Why structures stand', 'لماذا تصمد المنشآت'], 'bridge', [['Triangles do not change shape, so bridges and roofs use them. An arch turns load into compression, and stone is strong in compression. So stone arches last centuries, as in Sinan’s domes. Beams bend, in tension below and compression above.', 'المثلث لا يتغير شكله. والقوس يحول الحمل إلى ضغط والحجر قوي فيه، كقباب سنان. والعوارض تنحني: شد أسفل وضغط أعلى.']], [
    [['Which shape resists being pushed out of shape?', 'أي شكل يقاوم التشوه؟'], ['Triangle', 'المثلث'], ['Square', 'المربع'], ['Circle', 'الدائرة']],
    [['Stone is strongest in:', 'الحجر أقوى في:'], ['Compression', 'الضغط'], ['Tension', 'الشد'], ['Twisting', 'اللي']],
    [['In a loaded beam, the bottom is in:', 'أسفل العارضة في:'], ['Tension', 'شد'], ['Compression', 'ضغط'], ['Neither', 'لا شيء']]
  ]);
  Topic('x8e.measure', ['Measuring like an engineer', 'القياس كمهندس'], 'ruler', [['Measure twice, and cut once. Use the right tool: ruler, caliper or multimeter. Tolerance says how far off is still acceptable: 50 ± 1 mm means 49 to 51. Parts that must fit need tight tolerances.', 'قس مرتين واقطع مرة. والتفاوت يبين المقبول: ٥٠ ± ١ مم يعني ٤٩ إلى ٥١.']], [
    function (r) { var a = r.int(20, 90), t = r.int(1, 5); return P(['Largest acceptable size, mm.', 'أكبر مقاس مقبول.'], a + ' ± ' + t + ' mm', a + t); },
    function (r) { var a = r.int(20, 90), t = r.int(1, 5); return P(['Smallest acceptable size, mm.', 'أصغر مقاس مقبول.'], a + ' ± ' + t + ' mm', a - t); },
    function (r) { var c = r.int(2, 9); return P(['What is this length in millimetres?', 'كم هذا الطول بالمليمتر؟'], c + ' cm', c * 10); }
  ]);
  U('engineering', 'x10e', ['Designing for real', 'تصميم حقيقي'], 3, 10, true);
  Topic('x10e.brief', ['Writing a design brief', 'كتابة موجز التصميم'], 'pen', [['Who is it for? What must it do? What are the limits on cost, weight and time? Write measurable requirements: “lifts 2 kg” and not “is strong”. Then you can tell if you have succeeded.', 'لمن؟ وماذا يفعل؟ وما حدود الكلفة والوزن والزمن؟ اكتب متطلبات قابلة للقياس: "يرفع ٢ كغ" لا "قوي".']], [
    [['Which requirement is measurable?', 'أي متطلب قابل للقياس؟'], ['Runs 8 hours on one charge', 'يعمل ٨ ساعات بشحنة'], ['Lasts a good while', 'يدوم مدة جيدة'], ['Looks modern', 'يبدو حديثًا']],
    [['Before designing, you should first:', 'قبل التصميم عليك أولًا:'], ['Talk to the people who will use it', 'الحديث مع المستخدمين'], ['Buy materials', 'شراء المواد'], ['Choose a colour', 'اختيار لون']]
  ]);
  Topic('x10e.power', ['Batteries and power budgets', 'البطاريات وميزانية الطاقة'], 'battery', [['A battery’s capacity is in amp-hours. Runtime = capacity ÷ current. Add up everything’s current before you buy. Power = V × I tells you what your supply must deliver, with a margin.', 'سعة البطارية بالأمبير ساعة. زمن التشغيل = السعة ÷ التيار. اجمع التيارات قبل الشراء.']], [
    function (r) { var i = r.int(1, 5), h = r.int(2, 12); return P(['How many hours will the battery last?', 'كم ساعة تدوم البطارية؟'], (i * h) + ' Ah at ' + i + ' A', h); },
    function (r) { var a = r.int(50, 300), b = r.int(50, 300); return P(['What total current must the battery supply, in mA?', 'ما التيار الكلي الذي تمده البطارية بالملي أمبير؟'], 'motor ' + a + ' mA, board ' + b + ' mA', a + b); },
    function (r) { var v = r.pick([3, 5, 9, 12]), i = r.int(2, 9); return P(['What is the power, P = VI, in watts?', 'ما القدرة P = VI بالواط؟'], v + ' V × ' + i + ' A', v * i); }
  ]);
  Topic('x10e.heat', ['Insulation and keeping cool', 'العزل والتبريد'], 'thermo', [['Heat leaves through walls and roofs. Traditional wind towers, thick walls and shaded courtyards kept Muslim cities cool with no electricity. Today we measure a U-value: heat loss = U × area × temperature difference.', 'ابتكر الأقدمون ملاقف الهواء والجدران السميكة والأفنية المظللة للتبريد. والفقد الحراري = U × المساحة × فرق الحرارة.']], [
    function (r) { var u = r.int(1, 3), a = r.int(10, 40), d = r.int(5, 20); return P(['Heat loss in watts.', 'الفقد بالواط.'], 'U = ' + u + ', area ' + a + ' m², ' + d + '°C difference', u * a * d); },
    [['A wind tower cools a building by:', 'يبرد الملقف المبنى بـ:'], ['Drawing air through it', 'سحب الهواء عبره'], ['Using a compressor', 'ضاغط'], ['Burning fuel', 'حرق وقود']]
  ]);
  Topic('x10e.fail', ['Learning from failure', 'التعلم من الفشل'], 'hammer', [['Tacoma Narrows, the Challenger, the Hyatt walkway: most disasters had warning signs, and most were decisions as well as physics. Ask what failed, why it was allowed, and what changes now.', 'كثير من الكوارث سبقتها إنذارات، وكانت قرارات لا فيزياء فقط. اسأل: ما الذي فشل ولماذا سُمح به وماذا يتغير؟']], [
    [['Challenger’s failed part was known to be:', 'كان الجزء الفاشل في تشالنجر معروفًا بأنه:'], ['Risky in cold weather', 'خطر في البرد'], ['Perfectly safe', 'آمن تمامًا'], ['Unused', 'غير مستعمل']],
    [['The most useful question after a failure is:', 'أنفع سؤال بعد الفشل:'], ['What let this happen?', 'ما الذي سمح بحدوثه؟'], ['Who can we blame?', 'من نلوم؟'], ['Can we hide it?', 'هل نخفيه؟']]
  ]);
  Topic('x10e.draw', ['Drawings others can build from', 'رسومات يبني منها غيرك'], 'compass', [['Three views, with dimensions and a scale. A 1:10 drawing shows a 2 m part as 20 cm. If a stranger can make it from your drawing with no questions, it is done.', 'ثلاثة مساقط بأبعاد ومقياس. ورسم ١:١٠ يبين جزءًا ٢ م بـ٢٠ سم. وإذا صنعه غريب بلا سؤال فقد اكتمل.']], [
    function (r) { var s = r.pick([2, 5, 10, 20]), c = r.int(2, 9); return P(['Real length in cm.', 'الطول الحقيقي.'], c + ' cm on a 1:' + s + ' drawing', c * s); },
    function (r) { var s = r.pick([2, 5, 10]), c = r.int(2, 9); return P(['Length on the drawing, cm.', 'الطول على الرسم.'], (c * s) + ' cm real, scale 1:' + s, c); }
  ]);
})();
