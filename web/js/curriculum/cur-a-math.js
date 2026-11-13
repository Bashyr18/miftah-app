/* New A level, further and first-year university maths, Years 12 to 14. Numbers change each time. */
(function () {
  'use strict';
  var C = window.C, U = C.yunit, Topic = C.topic, P = C.padQ, X = C.exprQ;
  var CALC = ['Calculate.', 'احسب.'];
  function fac(n) { return n <= 1 ? 1 : n * fac(n - 1); }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  /* ---------- Year 12: pure ---------- */
  U('math', 'a12p', ['A level pure: technique', 'البحتة: مهارات'], 4, 12);
  Topic('a12p.square', ['Completing the square', 'إكمال المربع'], 'ruler', [['x² + 6x + 2 = (x + 3)² − 9 + 2 = (x + 3)² − 7. Halve the x coefficient, square it, take it away. The minimum is −7, at x = −3.', 'x² + 6x + 2 = (x + 3)² − 9 + 2 = (x + 3)² − 7. نصّف معامل x وربّعه واطرحه. القيمة الدنيا −٧ عند x = −٣.']], [
    function (r) { var a = r.int(1, 9), c = r.int(1, 30); return X(['Minimum value.', 'القيمة الدنيا.'], 'x^2 + ' + (2 * a) + 'x + ' + c, c - a * a); },
    function (r) { var a = r.int(1, 9), c = r.int(1, 30); return X(['x at the turning point.', 'x عند نقطة التحول.'], 'x^2 + ' + (2 * a) + 'x + ' + c, -a); },
    function (r) { var a = r.int(2, 9); return P(['What number goes in the box?', 'ما العدد في المربع؟'], 'x^2 − ' + (2 * a) + 'x + ? = (x − ' + a + ')^2', a * a); }
  ]);
  Topic('a12p.trans', ['Transforming graphs', 'تحويل الرسوم'], 'wave', [['y = f(x) + a moves up by a. y = f(x − a) moves right by a, against instinct. y = af(x) stretches vertically, and y = f(ax) squeezes sideways by a.', 'y = f(x) + a إلى أعلى، وy = f(x − a) إلى اليمين خلافًا للحدس. وy = af(x) تمدد رأسيًا وy = f(ax) تضغط أفقيًا.']], [
    [['y = f(x − 3) moves the graph:', 'y = f(x − 3) تحرك الرسم:'], ['3 to the right', '٣ يمينًا'], ['3 to the left', '٣ يسارًا'], ['3 up', '٣ لأعلى']],
    [['y = −f(x) is a reflection in the:', 'y = −f(x) انعكاس في:'], ['x-axis', 'محور x'], ['y-axis', 'محور y'], ['line y = x', 'المستقيم y = x']],
    function (r) { var a = r.int(2, 9), b = r.int(1, 9); return X(['New y at the same x.', 'y الجديدة عند x نفسها.'], 'f(2) = ' + a + '; y = 3f(x) + ' + b + ' at x = 2', 3 * a + b); }
  ]);
  Topic('a12p.mod', ['The modulus function', 'دالة القيمة المطلقة'], 'scale', [['|x| is distance from zero, so |x| = 5 has two answers: 5 and −5. To solve |x − 2| < 3, write −3 < x − 2 < 3, so −1 < x < 5.', '|x| هي المسافة من الصفر، فـ|x| = ٥ لها حلان. ولحل |x − 2| < 3 نكتب −٣ < x − ٢ < ٣ فـ −١ < x < ٥.']], [
    function (r) { var a = r.int(1, 12), b = r.int(13, 30); return P(['Value.', 'القيمة.'], '|' + a + ' − ' + b + '|', b - a); },
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return X(['The larger solution.', 'الحل الأكبر.'], '|x − ' + a + '| = ' + b, a + b); },
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return X(['The smaller solution.', 'الحل الأصغر.'], '|x − ' + a + '| = ' + b, a - b); }
  ]);
  Topic('a12p.double', ['Double angle formulae', 'صيغ ضعف الزاوية'], 'compass', [['sin 2A = 2 sin A cos A. cos 2A = cos²A − sin²A = 1 − 2sin²A. If sin A = 3/5 and cos A = 4/5, sin 2A = 24/25, and cos 2A = 7/25.', 'sin 2A = 2 sin A cos A. وcos 2A = cos²A − sin²A = 1 − 2sin²A. إذا sin A = 3/5 وcos A = 4/5 فـ sin 2A = 24/25 وcos 2A = 7/25.']], [
    function (r) { var t = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]); return P(['sin 2A = ?/' + (t[2] * t[2]), 'sin 2A = ؟/' + (t[2] * t[2])], 'sin A = ' + t[0] + '/' + t[2] + ', cos A = ' + t[1] + '/' + t[2], 2 * t[0] * t[1]); },
    function (r) { var t = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]); return X(['cos 2A = ?/' + (t[2] * t[2]), 'cos 2A = ؟/' + (t[2] * t[2])], 'sin A = ' + t[0] + '/' + t[2] + ', cos A = ' + t[1] + '/' + t[2], t[1] * t[1] - t[0] * t[0]); },
    [['1 − 2sin²A equals:', '1 − 2sin²A تساوي:'], ['cos 2A', 'cos 2A'], ['sin 2A', 'sin 2A'], ['tan 2A', 'tan 2A']]
  ]);
  Topic('a12p.rform', ['The R-formula', 'صيغة R'], 'wave', [['a sin x + b cos x = R sin(x + α), with R = √(a² + b²) and tan α = b/a. So 3 sin x + 4 cos x has R = 5, and its largest value is 5.', 'a sin x + b cos x = R sin(x + α) مع R = √(a² + b²) وtan α = b/a. إذن 3 sin x + 4 cos x لها R = ٥ وأكبر قيمة ٥.']], [
    function (r) { var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]); return P(['Largest value.', 'أكبر قيمة.'], t[0] + ' sin x + ' + t[1] + ' cos x', t[2]); },
    function (r) { var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]); return X(['Smallest value.', 'أصغر قيمة.'], t[0] + ' sin x + ' + t[1] + ' cos x', -t[2]); }
  ]);
  Topic('a12p.trap', ['The trapezium rule', 'قاعدة شبه المنحرف'], 'plate', [['Split the area into strips of width h. Area ≈ h/2 × (first + last + 2 × the middle ones). A curve bending upward gives an overestimate. More strips, better answer.', 'قسّم المساحة شرائح عرضها h. المساحة ≈ h/2 × (الأول + الأخير + ٢ × الوسطى). والمنحنى المقعر لأعلى يعطي تقديرًا زائدًا.']], [
    function (r) { var a = r.int(1, 9), b = r.int(1, 9), c = r.int(1, 9); return P(['Area estimate, with h = 2.', 'تقدير المساحة مع h = 2.'], 'y-values ' + a + ', ' + b + ', ' + c, a + c + 2 * b); },
    [['For y = x² from 0 to 2, the rule gives:', 'لـy = x² من ٠ إلى ٢ تعطي القاعدة:'], ['An overestimate', 'تقديرًا زائدًا'], ['An underestimate', 'تقديرًا ناقصًا'], ['The exact value', 'القيمة الدقيقة']]
  ]);
  /* ---------- Year 12: statistics and mechanics ---------- */
  U('math', 'a12s', ['A level statistics and mechanics', 'الإحصاء والميكانيكا'], 4, 12);
  Topic('a12s.drv', ['Random variables and expectation', 'المتغيرات العشوائية والتوقع'], 'stone', [['E(X) = Σ x·P(x). If X is 0, 10 or 20 with probabilities 1/2, 1/4, 1/4, then E(X) = 0 + 2.5 + 5 = 7.5. Over many trials, that is the average.', 'E(X) = Σ x·P(x). إذا كانت X تساوي ٠، ١٠، ٢٠ باحتمالات ١/٢، ١/٤، ١/٤ فـ E(X) = ٧٫٥.']], [
    function (r) { var a = r.int(1, 9) * 4, b = r.int(1, 9) * 4; return P(['E(X).', 'E(X).'], 'X = ' + a + ' or ' + b + ', probability 1/2 each', (a + b) / 2); },
    function (r) { var m = r.int(2, 9), a = r.int(2, 5), b = r.int(1, 9); return P(['E(aX + b).', 'E(aX + b).'], 'E(X) = ' + m + '; E(' + a + 'X + ' + b + ')', a * m + b); },
    function (r) { var v = r.int(2, 9), a = r.int(2, 4), b = r.int(1, 9); return P(['Var(aX + b). The b does not matter.', 'Var(aX + b). لا أثر لـb.'], 'Var(X) = ' + v + '; Var(' + a + 'X + ' + b + ')', a * a * v); }
  ]);
  Topic('a12s.binmv', ['Binomial mean and variance', 'متوسط وتباين ذي الحدين'], 'stone', [['For X ~ B(n, p): mean = np, variance = np(1 − p). 100 tosses of a fair coin: mean 50, variance 25, standard deviation 5.', 'لـ X ~ B(n, p): المتوسط np والتباين np(1 − p). ١٠٠ رمية عادلة: متوسط ٥٠ وتباين ٢٥ وانحراف ٥.']], [
    function (r) { var p = r.pick([2, 4, 5]), n = p * r.int(3, 30); return P(['Mean.', 'المتوسط.'], 'B(' + n + ', 1/' + p + ')', n / p); },
    function (r) { var n = r.pick([100, 200, 400]); return P(['Variance.', 'التباين.'], 'B(' + n + ', 1/2)', n / 4); }
  ]);
  Topic('a12s.poisson', ['The Poisson distribution', 'توزيع بواسون'], 'stopwatch', [['Counts of rare, independent events in a fixed interval, such as calls per hour. Mean and variance are both λ. Two independent Poissons add: Po(3) + Po(4) = Po(7). P(X = 0) = e^(−λ).', 'عدد أحداث نادرة مستقلة في فترة، كالمكالمات في الساعة. المتوسط والتباين كلاهما λ. ومجموع المستقلين: Po(3) + Po(4) = Po(7).']], [
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return P(['λ of the total.', 'λ للمجموع.'], 'Po(' + a + ') + Po(' + b + ')', a + b); },
    function (r) { var a = r.int(2, 9), k = r.int(2, 8); return P(['λ for the longer time.', 'λ للمدة الأطول.'], a + ' per hour, over ' + k + ' hours', a * k); },
    [['Poisson is suitable when events are:', 'يناسب بواسون عندما تكون الأحداث:'], ['Random and independent', 'عشوائية ومستقلة'], ['Fixed in number', 'ثابتة العدد'], ['Always in pairs', 'أزواجًا دائمًا']]
  ]);
  Topic('a12s.momentum', ['Momentum and impulse', 'الزخم والدفع'], 'ball', [['Impulse = force × time = change in momentum. A 0.5 kg ball goes from 8 m/s to −6 m/s: the change is 0.5 × 14 = 7 N s. Direction matters.', 'الدفع = القوة × الزمن = تغير الزخم. كرة ٠٫٥ كغ من ٨ م/ث إلى −٦: التغير ٠٫٥ × ١٤ = ٧ نيوتن ث.']], [
    function (r) { var f = r.int(2, 30), t = r.int(2, 9); return P(['Impulse in N s.', 'الدفع.'], f + ' N for ' + t + ' s', f * t); },
    function (r) { var m = r.int(1, 8), a = r.int(2, 9), b = r.int(2, 9); return P(['Size of the momentum change.', 'مقدار تغير الزخم.'], m + ' kg: ' + a + ' m/s, then ' + b + ' m/s the other way', m * (a + b)); },
    function (r) { var m1 = r.int(1, 6), m2 = r.int(1, 6), v = r.int(2, 8); return X(['Speed of the second, if the first stops dead.', 'سرعة الثاني إذا توقف الأول تمامًا.'], m1 + ' kg at ' + (m2 * v) + ' m/s hits ' + m2 + ' kg at rest', m1 * v); }
  ]);
  Topic('a12s.wep', ['Work, energy and power', 'الشغل والطاقة والقدرة'], 'car', [['Power = force × velocity. A car at 20 m/s with a 500 N driving force delivers 10 kW. At top speed, driving force equals resistance.', 'القدرة = القوة × السرعة. سيارة ٢٠ م/ث بقوة دفع ٥٠٠ نيوتن قدرتها ١٠ ك.واط. وعند أقصى سرعة تساوي القوة المقاومة.']], [
    function (r) { var f = r.int(2, 9) * 100, v = r.int(5, 30); return P(['Power in watts.', 'القدرة واط.'], f + ' N at ' + v + ' m/s', f * v); },
    function (r) { var p = r.int(2, 9) * 1000, v = r.pick([10, 20, 25, 50]); return P(['Resistance at top speed, in N.', 'المقاومة عند أقصى سرعة.'], p + ' W, top speed ' + v + ' m/s', p / v); },
    function (r) { var f = r.int(2, 20), d = r.int(2, 20), w = r.int(1, 5); return P(['Energy lost to the resistance, in J.', 'الطاقة المفقودة.'], f + ' N resistance over ' + (d * w) + ' m', f * d * w); }
  ]);
  Topic('a12s.conn', ['Connected particles', 'الجسيمات المتصلة'], 'thread', [['Two masses on a light rope over a smooth pulley: treat the system. a = (m₁ − m₂)g ÷ (m₁ + m₂). With 5 kg and 3 kg, a = 2 × 10 ÷ 8 = 2.5 m/s². Then use one mass for the tension.', 'كتلتان بحبل خفيف على بكرة ملساء. a = (m₁ − m₂)g ÷ (m₁ + m₂). مع ٥ و٣ كغ: a = ٢٫٥ م/ث². ثم استعمل كتلة واحدة للشد.']], [
    function (r) { var s = r.pick([[6, 4, 2], [7, 3, 4], [9, 1, 8], [8, 2, 6], [3, 2, 2]]); return P(['Acceleration in m/s² (g = 10).', 'التسارع (ج = ١٠).'], s[0] + ' kg and ' + s[1] + ' kg over a pulley', s[2]); },
    [['Tension in a light rope over a smooth pulley is:', 'الشد في حبل خفيف على بكرة ملساء:'], ['The same on both sides', 'متساوٍ في الجانبين'], ['Zero', 'صفر'], ['Greater on the heavy side', 'أكبر عند الثقيل']]
  ]);

  /* ---------- Year 13: statistics, vectors, complex ---------- */
  U('math', 'a13s', ['A level statistics 2', 'الإحصاء ٢'], 4, 13);
  Topic('a13s.clt', ['Sampling and the central limit theorem', 'المعاينة ونظرية النهاية المركزية'], 'scale', [['The mean of a large sample is about normal, whatever the population. Its standard deviation is σ/√n. Quadruple the sample, and the spread halves.', 'متوسط العينة الكبيرة طبيعي تقريبًا مهما كان المجتمع، وانحرافه σ/√n. ضاعف العينة أربعًا فينتصف الانتشار.']], [
    function (r) { var e = r.int(1, 9), n = r.pick([4, 9, 16, 25, 100]); return P(['Standard error, σ ÷ √n.', 'الخطأ المعياري σ ÷ √n.'], 'σ = ' + (e * Math.sqrt(n)) + ', n = ' + n, e); },
    function (r) { var k = r.pick([4, 9, 16, 25]); return P(['The standard error is divided by?', 'يُقسم الخطأ المعياري على؟'], 'n × ' + k, Math.sqrt(k)); }
  ]);
  Topic('a13s.ci', ['Confidence intervals', 'فترات الثقة'], 'ruler', [['95% interval for a mean: x̄ ± 1.96 σ/√n. It says how the method behaves over many samples. It does not say there is a 95% chance this interval holds the truth once you have it.', 'فترة ٩٥٪: x̄ ± 1.96 σ/√n. وهي تصف سلوك الطريقة عبر عينات كثيرة.']], [
    function (r) { var m = r.int(40, 90), e = r.int(2, 9); return P(['The interval’s width.', 'عرض الفترة.'], m + ' ± ' + e, 2 * e); },
    [['To narrow an interval, you can:', 'لتضييق الفترة يمكنك:'], ['Take a larger sample', 'أخذ عينة أكبر'], ['Raise the confidence level', 'رفع مستوى الثقة'], ['Round the answer', 'تقريب الجواب']],
    [['A wider interval goes with:', 'الفترة الأعرض تقترن بـ:'], ['Higher confidence', 'ثقة أعلى'], ['Larger samples', 'عينات أكبر'], ['Smaller σ', 'σ أصغر']]
  ]);
  Topic('a13s.errors', ['Type I and Type II errors', 'الخطأ من النوع الأول والثاني'], 'scale', [['A Type I error rejects a true null, and its chance is the significance level. A Type II error keeps a false null. Lowering one usually raises the other, until you collect more data.', 'النوع الأول: رفض فرض صفري صحيح، واحتماله مستوى الدلالة. والثاني: قبول فرض خاطئ. وخفض أحدهما يرفع الآخر غالبًا.']], [
    [['Convicting an innocent person is like:', 'إدانة بريء تشبه:'], ['Type I', 'النوع الأول'], ['Type II', 'النوع الثاني'], ['Neither', 'لا أحدهما']],
    function () { return P(['Chance of Type I at the 5% level, %.', 'احتمال النوع الأول عند ٥٪.'], '', 5); },
    [['A failed test means the null:', 'فشل الرفض يعني أن الفرض الصفري:'], ['Was not rejected, not proved', 'لم يُرفض ولم يثبت'], ['Is proved', 'مثبت'], ['Is false', 'خاطئ']]
  ]);
  U('math', 'a13f', ['Further maths: more', 'رياضيات متقدمة: مزيد'], 4, 13);
  Topic('a13f.dot', ['Scalar product and angles', 'الضرب القياسي والزوايا'], 'compass', [['a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b| cos θ. If the product is 0, the vectors are perpendicular. That one line finds every angle in 3D.', 'a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b| cos θ. وإذا كان صفرًا فهما متعامدان.']], [
    function (r) { var a = r.int(1, 5), b = r.int(1, 5), c = r.int(1, 5), d = r.int(1, 5), e = r.int(1, 5), f = r.int(1, 5); return P(['a·b.', 'a·b.'], '(' + a + ',' + b + ',' + c + ')·(' + d + ',' + e + ',' + f + ')', a * d + b * e + c * f); },
    function (r) { var t = r.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11]]); return P(['|a|.', '|a|.'], 'a = (' + t[0] + ',' + t[1] + ',' + t[2] + ')', t[3]); },
    function (r) { var a = r.int(1, 6), b = r.int(1, 6); return X(['k making them perpendicular.', 'k التي تجعلهما متعامدين.'], '(' + a + ',' + b + ')·(' + b + ',k) = 0', -a); }
  ]);
  Topic('a13f.demoivre', ['De Moivre’s theorem', 'نظرية دي موافر'], 'star', [['(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ. Multiply complex numbers by multiplying moduli and adding arguments. (2∠30°)³ = 8∠90° = 8i.', '(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ. عند الضرب تُضرب الأطوال وتُجمع الزوايا. (2∠30°)³ = 8∠90° = 8i.']], [
    function (r) { var m = r.int(2, 3), n = r.int(2, 4); return P(['Modulus of the result.', 'طول الناتج.'], '(' + m + '∠θ)^' + n, Math.pow(m, n)); },
    function (r) { var a = r.pick([10, 15, 20, 30]), n = r.int(2, 6); return P(['Argument in degrees.', 'الزاوية بالدرجات.'], '(r∠' + a + '°)^' + n, a * n); },
    function (r) { var a = r.int(2, 5), b = r.int(2, 5), c = r.pick([20, 30, 40]), d = r.pick([10, 50, 60]); return P(['Modulus of the product.', 'طول حاصل الضرب.'], a + '∠' + c + '° × ' + b + '∠' + d + '°', a * b); },
    function () { return P(['How many complex cube roots does 1 have?', 'كم جذرًا تكعيبيًا مركبًا للواحد؟'], '', 3); }
  ]);
  Topic('a13f.hyper', ['Hyperbolic functions', 'الدوال الزائدية'], 'bridge', [['cosh x = (eˣ + e⁻ˣ)/2 and sinh x = (eˣ − e⁻ˣ)/2. A hanging chain takes the cosh shape, a catenary. cosh²x − sinh²x = 1, with a minus where trig has a plus.', 'cosh x = (eˣ + e⁻ˣ)/2 وsinh x = (eˣ − e⁻ˣ)/2. والسلسلة المعلقة تأخذ شكل cosh.']], [
    function () { return P(['Value.', 'القيمة.'], 'cosh 0', 1); },
    function () { return P(['Value.', 'القيمة.'], 'sinh 0', 0); },
    function () { return P(['Value.', 'القيمة.'], 'cosh^2 x − sinh^2 x', 1); },
    [['The derivative of sinh x is:', 'مشتقة sinh x:'], ['cosh x', 'cosh x'], ['−cosh x', '−cosh x'], ['sinh x', 'sinh x']]
  ]);
  Topic('a13f.shm', ['Circular and oscillating motion, mathematically', 'الحركة الدائرية والتذبذب رياضيًا'], 'wave', [['ẍ = −ω²x gives x = A cos ωt. Maximum speed is Aω, and maximum acceleration is Aω². In a circle: a = rω² = v²/r.', 'ẍ = −ω²x تعطي x = A cos ωt. أقصى سرعة Aω وأقصى تسارع Aω². وفي الدائرة: a = rω² = v²/r.']], [
    function (r) { var a = r.int(2, 9), w = r.int(2, 9); return P(['Maximum speed.', 'أقصى سرعة.'], 'A = ' + a + ', ω = ' + w, a * w); },
    function (r) { var a = r.int(2, 9), w = r.int(2, 6); return P(['Maximum acceleration.', 'أقصى تسارع.'], 'A = ' + a + ', ω = ' + w, a * w * w); },
    function (r) { var v = r.pick([2, 4, 6, 8, 10]), R = r.pick([1, 2, 4]); return P(['Acceleration toward the centre.', 'التسارع نحو المركز.'], 'v = ' + v + ', r = ' + R, v * v / R); }
  ]);
  /* ---------- Year 14: first-year university ---------- */
  U('math', 'a14', ['First-year university maths', 'رياضيات السنة الجامعية الأولى'], 4, 14);
  Topic('a14.limits', ['Limits, properly', 'النهايات بدقة'], 'ruler', [['aₙ → L means: for every ε > 0, past some N every term is within ε of L. This one sentence ended two centuries of confusion about calculus. Example: 1/n → 0: take N > 1/ε.', 'aₙ → L تعني: لكل ε > 0 توجد N بعدها كل الحدود ضمن ε من L.']], [
    function (r) { var a = r.int(2, 12), b = r.int(2, 9); return P(['Limit as n → ∞.', 'النهاية.'], '(' + (a * b) + 'n + 7) / (' + b + 'n)', a); },
    function (r) { var e = r.pick([10, 100, 1000]); return P(['Smallest whole N, so that 1/n < ε for all n > N.', 'أصغر N بحيث 1/n < ε لكل n > N.'], 'ε = 1/' + e, e); },
    [['A sequence with two different limits:', 'متتالية لها نهايتان مختلفتان:'], ['Cannot exist: limits are unique', 'لا توجد، فالنهاية وحيدة'], ['Is common', 'شائعة'], ['Is any oscillation', 'أي متذبذبة']]
  ]);
  Topic('a14.series', ['Does a series converge?', 'هل تتقارب المتسلسلة؟'], 'wave', [['1/2 + 1/4 + 1/8 + … = 1. But 1 + 1/2 + 1/3 + … grows without limit, though its terms shrink. Terms tending to zero is needed, and not enough. Ratio test: if |aₙ₊₁/aₙ| → r < 1, it converges.', '١/٢ + ١/٤ + … = ١. لكن ١ + ١/٢ + ١/٣ + … تتباعد رغم صغر حدودها. فاقتراب الحدود من الصفر شرط غير كافٍ.']], [
    [['The harmonic series 1 + 1/2 + 1/3 + …', 'المتسلسلة التوافقية:'], ['Diverges', 'تتباعد'], ['Equals 2', 'تساوي ٢'], ['Equals e', 'تساوي e']],
    function (r) { var a = r.int(1, 9), k = r.pick([2, 3, 5]), first = a * (k - 1); return P(['Sum to infinity.', 'المجموع إلى ما لا نهاية.'], 'first term ' + first + ', ratio 1/' + k, a * k); },
    [['Σ 1/n² :', 'Σ 1/n² :'], ['Converges', 'تتقارب'], ['Diverges', 'تتباعد'], ['Is undefined', 'غير معرفة']]
  ]);
  Topic('a14.det', ['Determinants', 'المحددات'], 'box', [['For [a b; c d], det = ad − bc. It is the area scale of the transformation. If det = 0, space is squashed flat, so there is no inverse.', 'لـ[a b; c d] المحدد = ad − bc. وهو معامل المساحة. وإذا كان صفرًا فلا معكوس.']], [
    function (r) { var a = r.int(1, 9), b = r.int(1, 9), c = r.int(1, 9), d = r.int(1, 9); return X(['Determinant.', 'المحدد.'], '[' + a + ' ' + b + '; ' + c + ' ' + d + ']', a * d - b * c); },
    function (r) { var a = r.int(2, 6), b = r.int(2, 6); return P(['k that leaves no inverse.', 'k التي تلغي المعكوس.'], '[' + a + ' ' + (a * b) + '; 1 k]', b); },
    function (r) { var a = r.int(2, 6), s = r.int(2, 9); return P(['New area.', 'المساحة الجديدة.'], 'det = ' + a + ', area ' + s, a * s); }
  ]);
  Topic('a14.indep', ['Independence, basis and dimension', 'الاستقلال والأساس والبعد'], 'box', [['Vectors are independent if none is built from the others. A basis is an independent set that reaches everything. Three independent vectors reach all of 3D, and a fourth adds nothing new.', 'المتجهات مستقلة إذا لم يُبنَ أحدها من غيره. والأساس مجموعة مستقلة تصل إلى الكل.']], [
    [['(1,2) and (2,4) are:', '(1,2) و(2,4):'], ['Dependent', 'مرتبطان'], ['Independent', 'مستقلان'], ['Perpendicular', 'متعامدان']],
    function (r) { var k = r.int(2, 9); return P(['Dimension of this space.', 'بعد هذا الفضاء.'], 'R^' + k, k); },
    [['Five vectors in R³ must be:', 'خمسة متجهات في R³:'], ['Dependent', 'مرتبطة'], ['Independent', 'مستقلة'], ['Equal', 'متساوية']]
  ]);
  Topic('a14.partial', ['Partial derivatives', 'المشتقات الجزئية'], 'mountain', [['For f(x, y), differentiate in x, holding y fixed. f = x²y + y³: ∂f/∂x = 2xy and ∂f/∂y = x² + 3y². The gradient points uphill. Every neural network trains on this.', 'لـf(x, y) نشتق في x مع تثبيت y. f = x²y + y³: ∂f/∂x = 2xy.']], [
    function (r) { var a = r.int(1, 5), b = r.int(1, 5); return P(['∂f/∂x at this point.', '∂f/∂x هنا.'], 'f = x^2 y; (' + a + ', ' + b + ')', 2 * a * b); },
    function (r) { var a = r.int(1, 5), b = r.int(1, 5); return P(['∂f/∂y at this point.', '∂f/∂y هنا.'], 'f = x^2 y; (' + a + ', ' + b + ')', a * a); },
    [['To reduce a loss fastest, step:', 'لخفض الخسارة أسرع، تحرك:'], ['Against the gradient', 'عكس التدرج'], ['Along the gradient', 'مع التدرج'], ['Sideways', 'جانبيًا']]
  ]);
  Topic('a14.mod', ['Modular arithmetic', 'الحساب النمطي'], 'gear', [['Clock arithmetic: 17 ≡ 2 (mod 5). Work with remainders. 7¹⁰⁰ mod 6: 7 ≡ 1, so the answer is 1. Euclid’s algorithm finds a gcd fast: gcd(48, 18) = gcd(18, 12) = gcd(12, 6) = 6.', 'حساب الساعة: 17 ≡ 2 (mod 5). وخوارزمية إقليدس تجد القاسم المشترك بسرعة.']], [
    function (r) { var a = r.int(20, 200), m = r.int(3, 12); return P(['Remainder.', 'الباقي.'], a + ' mod ' + m, a % m); },
    function (r) { var a = r.int(2, 9) * 6, b = r.int(2, 9) * 6; return P(['gcd.', 'القاسم المشترك الأكبر.'], 'gcd(' + a + ', ' + b + ')', gcd(a, b)); },
    function (r) { var m = r.pick([3, 5, 7, 9]), e = r.int(20, 99); return P(['Remainder.', 'الباقي.'], (m + 1) + '^' + e + ' mod ' + m, 1); }
  ]);
  Topic('a14.graph', ['Graph theory', 'نظرية البيان'], 'compass', [['Nodes and edges. Sum of degrees = 2 × edges, since each edge has two ends. A tree with n nodes has n − 1 edges. Euler began the subject with Königsberg’s bridges.', 'رؤوس وحواف. مجموع الدرجات = ٢ × الحواف. والشجرة ذات n رأسًا لها n − ١ حافة.']], [
    function (r) { var n = r.int(3, 30); return P(['Edges in a tree.', 'حواف الشجرة.'], n + ' nodes', n - 1); },
    function (r) { var e = r.int(3, 30); return P(['Sum of all degrees.', 'مجموع الدرجات.'], e + ' edges', 2 * e); },
    function (r) { var n = r.int(3, 12); return P(['Edges in the complete graph.', 'حواف البيان التام.'], 'K' + n, n * (n - 1) / 2); }
  ]);
  Topic('a14.group', ['An introduction to groups', 'مقدمة في الزمر'], 'star', [['A group is a set with an operation that is associative, has an identity, and has inverses. Rotations of a square form one. So do the integers under addition. Geometry, physics and cryptography all use them.', 'الزمرة مجموعة بعملية تجميعية لها محايد ومعكوسات. ودورانات المربع زمرة، وكذلك الأعداد الصحيحة مع الجمع.']], [
    function () { return P(['The identity of integers under addition.', 'محايد الأعداد الصحيحة مع الجمع.'], '', 0); },
    function (r) { var k = r.int(3, 12); return P(['Rotation symmetries of this regular polygon.', 'تماثلات الدوران لهذا المضلع المنتظم.'], k + ' sides', k); },
    [['Are positive integers under addition a group?', 'هل الأعداد الموجبة مع الجمع زمرة؟'], ['No: no inverses', 'لا، فلا معكوسات'], ['Yes', 'نعم'], ['Only for evens', 'للزوجية فقط']]
  ]);
  Topic('a14.fourier', ['Fourier series', 'متسلسلات فورييه'], 'wave', [['Any reasonable periodic signal is a sum of sines and cosines. A square wave uses odd harmonics: sin x + (1/3) sin 3x + (1/5) sin 5x + … MP3, JPEG and MRI rest on this.', 'أي إشارة دورية مجموع جيوب وجيوب تمام. والموجة المربعة تستعمل التوافقيات الفردية.']], [
    [['A square wave contains which harmonics?', 'أي توافقيات في الموجة المربعة؟'], ['Odd only', 'الفردية فقط'], ['Even only', 'الزوجية فقط'], ['None', 'لا شيء']],
    function (r) { var f = r.int(2, 9) * 10, k = r.pick([3, 5, 7]); return P(['Frequency of this harmonic, Hz.', 'تردد هذه التوافقية.'], 'fundamental ' + f + ' Hz; harmonic ' + k, f * k); }
  ]);
  Topic('a14.count', ['Counting, and the pigeonhole', 'العد ومبدأ برج الحمام'], 'box', [['With 13 people, two share a birth month: more pigeons than holes. Simple, and it proves surprising things. Choosing: nCr = n!/(r!(n−r)!).', 'مع ١٣ شخصًا يشترك اثنان في شهر الميلاد. وهو مبدأ بسيط يثبت أمورًا مدهشة.']], [
    function (r) { var n = r.int(4, 9), k = r.int(2, 3); return P(['Number of ways to choose.', 'عدد طرق الاختيار.'], n + ' C ' + k, fac(n) / fac(k) / fac(n - k)); },
    function (r) { var h = r.int(3, 12), k = r.int(2, 4); return P(['Fewest items forcing some box to hold ' + (k + 1) + '.', 'أقل عدد يفرض ' + (k + 1) + ' في صندوق.'], h + ' boxes', h * k + 1); }
  ]);
})();
