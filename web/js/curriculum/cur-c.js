/* More for Years 11 to 14: the last stretch before university, strongest where a future scientist or engineer needs it. Concept questions only for Islamic studies: scripture stays in the verified data. */
(function () {
  'use strict';
  var C = window.C, U = C.yunit, Topic = C.topic, P = C.padQ, X = C.exprQ;
  var OUT = ['What does it print?', 'ماذا يطبع؟'];

  /* ---------- maths, Year 11 ---------- */
  U('math', 'c11m', ['IGCSE extended: last topics', 'المستوى الممتد: آخر الموضوعات'], 4, 11, true);
  Topic('c11m.vel', ['Velocity-time graphs and area', 'رسوم السرعة والزمن والمساحة'], 'car', [['The slope of a velocity-time graph is the acceleration, and the area under it is the distance. A triangle from rest to 20 m/s in 10 s covers ½ × 10 × 20 = 100 m.', 'الميل هو التسارع، والمساحة تحته المسافة. مثلث من السكون إلى ٢٠ م/ث في ١٠ ث يقطع ١٠٠ م.']], [
    function (r) { var t = r.int(2, 12) * 2, v = r.int(2, 15); return P(['Distance from the triangle, in m.', 'المسافة من المثلث.'], 't = ' + t + ', v = ' + v, t * v / 2); },
    function (r) { var t = r.int(2, 9), a = r.int(2, 6); return P(['Acceleration, in m/s².', 'التسارع.'], 'v = ' + (t * a) + ', t = ' + t, a); },
    [['A horizontal line on this graph means:', 'الخط الأفقي هنا يعني:'], ['Constant velocity', 'سرعة ثابتة'], ['The object has stopped', 'توقف الجسم'], ['Constant acceleration', 'تسارع ثابت']]
  ]);
  Topic('c11m.sim2', ['Similar solids: scale, area, volume', 'المجسمات المتشابهة'], 'box', [['If lengths scale by k, areas scale by k² and volumes by k³. A model at 1:10 has 1/100 of the area, and 1/1000 of the volume. So small animals lose heat so much faster than big ones.', 'إذا ضربت الأطوال في k فالمساحات في k² والحجوم في k³. لذا تفقد الحيوانات الصغيرة حرارتها أسرع.']], [
    function (r) { var k = r.int(2, 5), a = r.int(2, 9); return P(['New surface area.', 'المساحة الجديدة.'], 'area ' + a + ', k = ' + k, a * k * k); },
    function (r) { var k = r.int(2, 4), a = r.int(2, 9); return P(['New volume.', 'الحجم الجديد.'], 'volume ' + a + ', k = ' + k, a * k * k * k); },
    function (r) { var k = r.int(2, 6); return P(['Length scale factor k.', 'معامل الطول.'], 'area × ' + (k * k), k); }
  ]);
  Topic('c11m.inv', ['Solving quadratic inequalities', 'حل المتباينات التربيعية'], 'scale', [['x² − 5x + 6 < 0 factors to (x − 2)(x − 3) < 0. Sketch the parabola: it is below the axis between the roots, so 2 < x < 3. Always draw it.', 'x² − 5x + 6 < 0 تتحلل إلى (x − 2)(x − 3) < 0. والقطع تحت المحور بين الجذرين، فـ 2 < x < 3.']], [
    function (r) { var a = r.int(1, 6), b = a + r.int(1, 6); return P(['The upper end of the solution.', 'الطرف الأعلى للحل.'], '(x − ' + a + ')(x − ' + b + ') < 0', b); },
    function (r) { var a = r.int(1, 6), b = a + r.int(1, 6); return P(['The lower end of the solution.', 'الطرف الأدنى للحل.'], '(x − ' + a + ')(x − ' + b + ') < 0', a); },
    [['(x − 1)(x − 4) > 0 is true:', '(x − 1)(x − 4) > 0 صحيحة:'], ['Outside the two roots', 'خارج الجذرين'], ['Between the two roots', 'بين الجذرين'], ['Only at the two roots', 'عند الجذرين فقط']]
  ]);
  /* ---------- maths, Year 13 and 14 ---------- */
  U('math', 'c13m', ['Mechanics and statistics, further', 'الميكانيكا والإحصاء المتقدم'], 4, 13, true);
  Topic('c13m.friction', ['Slopes and friction', 'المنحدرات والاحتكاك'], 'mountain', [['On a slope at angle θ, weight has a part mg sin θ down the slope, and mg cos θ into it. Friction is at most μR. A block slides when tan θ exceeds μ.', 'وزن الجسم على منحدر: mg sin θ على المنحدر وmg cos θ عموديًا عليه. والاحتكاك أقصاه μR. وينزلق إذا زاد tan θ عن μ.']], [
    function (r) { var m = r.int(1, 12) * 2; return P(['Force down the slope, N (g = 10).', 'القوة على المنحدر (ج = ١٠).'], m + ' kg on a 30° slope', m * 10 / 2); },
    function (r) { var R = r.int(2, 9) * 10, k = r.pick([2, 5, 10]); return P(['Maximum friction, in N.', 'أقصى احتكاك.'], 'R = ' + R + ', μ = 1/' + k, R / k); },
    [['A block rests on a slope with no friction. It:', 'جسم على منحدر بلا احتكاك:'], ['Slides down', 'ينزلق'], ['Stays still', 'يبقى ساكنًا'], ['Moves up', 'يصعد']]
  ]);
  Topic('c13m.regress', ['Correlation coefficient and regression', 'معامل الارتباط والانحدار'], 'scale', [['r runs from −1 to 1, measuring straight-line fit. r = 0.9 is strong, and r² = 0.81 says 81% of the variation is explained by the line. Neither tells you the cause.', 'r بين −١ و١. وr = 0.9 قوي، وr² = 0.81 تعني أن الخط يفسر ٨١٪ من التغير. ولا يخبر أيهما عن السبب.']], [
    function (r) { var q = r.pick([5, 6, 7, 8, 9]); return P(['% of variation explained, r².', 'نسبة التغير المفسر.'], 'r = 0.' + q, q * q); },
    [['r = −0.95 means:', 'r = −0.95 تعني:'], ['A strong downward straight-line trend', 'اتجاه خطي هابط قوي'], ['Almost no relationship at all', 'لا علاقة تقريبًا'], ['One variable causes the other', 'أحدهما سبب الآخر']],
    function (r) { var m = r.int(2, 6), b = r.int(1, 9), x = r.int(2, 9); return P(['ŷ.', 'ŷ.'], 'ŷ = ' + b + ' + ' + m + 'x, x = ' + x, b + m * x); }
  ]);
  U('math', 'c14m', ['Mathematics for science and engineering', 'رياضيات للعلوم والهندسة'], 4, 14, true);
  Topic('c14m.eig', ['Eigenvalues in practice', 'القيم الذاتية عمليًا'], 'box', [['Av = λv: a direction the matrix only stretches. Trace = the sum of the eigenvalues, and det = their product. Vibration modes, Google’s first ranking, and PCA in machine learning all come from this.', 'Av = λv: اتجاه تمدده المصفوفة فقط. الأثر مجموع القيم الذاتية والمحدد حاصل ضربها. ومنها أنماط الاهتزاز وPCA.']], [
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return P(['Sum of eigenvalues.', 'مجموع القيم الذاتية.'], '[' + a + ' 2; 3 ' + b + ']', a + b); },
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(['Product of eigenvalues.', 'حاصل ضربها.'], '[' + a + ' 0; 0 ' + b + ']', a * b); },
    [['For a diagonal matrix, the eigenvalues are:', 'للمصفوفة القطرية القيم الذاتية:'], ['The diagonal entries', 'عناصر القطر'], ['All equal to one', 'كلها ١'], ['Always zero', 'صفر دائمًا']]
  ]);
  Topic('c14m.ode', ['Modelling with differential equations', 'النمذجة بالمعادلات التفاضلية'], 'wave', [['dy/dt = ky gives exponential growth or decay, and Newton’s cooling follows the same pattern. Solve, fit k to data, then check the model. If doubling takes 3 h, after 12 h there are 2⁴ = 16 times as many.', 'dy/dt = ky تعطي نموًا أو اضمحلالًا أسيًا. إذا كان التضاعف ٣ ساعات، فبعد ١٢ ساعة ١٦ ضعفًا.']], [
    function (r) { var d = r.int(2, 6), k = r.int(1, 5); return P(['Times larger.', 'كم ضعفًا.'], 'doubles every ' + d + ' h, after ' + (d * k) + ' h', Math.pow(2, k)); },
    function (r) { var t = r.int(2, 9), k = r.int(1, 4), a = 16 * r.int(1, 5); return P(['Amount left.', 'المتبقي.'], a + ', halves every ' + t + ' min, after ' + (t * k) + ' min', a / Math.pow(2, k)); },
    [['A model’s prediction misses new data badly. First:', 'خالف تنبؤ النموذج بيانات جديدة. أولًا:'], ['Question the assumptions behind it', 'راجع افتراضاته'], ['Throw away the new data points', 'احذف البيانات الجديدة'], ['Keep using it without change', 'استمر دون تغيير']]
  ]);
  Topic('c14m.numeric', ['Numerical methods and error', 'الطرق العددية والخطأ'], 'gear', [['Computers approximate. Euler’s method steps along a slope, y → y + h·f. Halve h, and the error roughly halves. Round-off piles up too, so never trust digits you cannot justify.', 'الحاسوب يقرب. طريقة أويلر: y → y + h·f. نصّف h فينتصف الخطأ تقريبًا. ولا تثق بأرقام لا تبررها.']], [
    function (r) { var y = r.int(1, 9), f = r.int(2, 8), h = r.pick([1, 2]); return P(['Next y, in one Euler step.', 'y التالية بخطوة أويلر.'], 'y = ' + y + ', slope ' + f + ', h = ' + h, y + h * f); },
    function (r) { var e = r.int(2, 9) * 2; return P(['Expected error after halving h.', 'الخطأ بعد تنصيف h.'], 'error ' + e, e / 2); },
    [['Printing 12 decimals from a rough measurement is:', 'طباعة ١٢ منزلة من قياس تقريبي:'], ['False precision', 'دقة زائفة'], ['Better science', 'علم أفضل'], ['Required', 'مطلوبة']]
  ]);
  Topic('c14m.opt', ['Optimisation with constraints', 'الأمثلة بالقيود'], 'scale', [['Make the best choice within limits. Linear programming checks corners of the allowed region, because the best point always sits on a corner. Airlines, factories and power grids rely on it.', 'أفضل خيار ضمن الحدود. البرمجة الخطية تفحص رؤوس المنطقة، فأفضل نقطة عند رأس.']], [
    function (r) { var a = r.int(2, 9), b = r.int(2, 9), x = r.int(1, 5), y = r.int(1, 5); return P(['Profit at this corner.', 'الربح عند هذا الرأس.'], 'P = ' + a + 'x + ' + b + 'y at (' + x + ', ' + y + ')', a * x + b * y); },
    [['In linear programming, the optimum lies:', 'في البرمجة الخطية الأمثل يقع:'], ['At a corner of the region', 'عند رأس المنطقة'], ['At the exact centre', 'في المركز تمامًا'], ['Outside the region', 'خارج المنطقة']]
  ]);
  Topic('c14m.prob', ['Distributions and expected value', 'التوزيعات والقيمة المتوقعة'], 'stone', [['A random variable has a distribution. For independent X and Y, the variances add, even for X − Y. So the spread of a difference is larger than either. This is why two noisy sensors subtract badly.', 'للمستقلين تجمع التباينات حتى في X − Y. لذا انتشار الفرق أكبر من كل منهما.']], [
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(['Var(X − Y), when independent.', 'Var(X − Y) للمستقلين.'], 'Var(X) = ' + a + ', Var(Y) = ' + b, a + b); },
    function (r) { var n = r.int(2, 12), m = r.int(2, 9); return P(['E of the sum.', 'توقع المجموع.'], n + ' copies, each with E = ' + m, n * m); },
    function (r) { var p = r.pick([2, 4, 5, 10]); return P(['Expected tries until the first success.', 'المحاولات المتوقعة.'], 'chance 1/' + p + ' each', p); }
  ]);
  /* ---------- sciences, Year 14 ---------- */
  U('science', 'c14s', ['University science, first steps', 'علوم الجامعة، خطوات أولى'], 4, 14, true);
  Topic('c14s.stat', ['Entropy and why things happen', 'الإنتروبيا ولماذا تحدث الأشياء'], 'fire', [['Entropy counts the ways a system can be arranged. Isolated systems drift toward the most likely arrangements, which is why heat flows from hot to cold, and never the reverse. S = k ln W is on Boltzmann’s grave.', 'الإنتروبيا تعد ترتيبات النظام. وتتجه الأنظمة المعزولة إلى الأرجح، فتنتقل الحرارة من الساخن إلى البارد.']], [
    function (r) { var n = r.int(2, 12); return P(['Arrangements of this many coins.', 'ترتيبات هذه العملات.'], n + ' coins', Math.pow(2, n)); },
    [['Heat flows from hot to cold because:', 'تنتقل الحرارة من الساخن إلى البارد لأن:'], ['That spread is overwhelmingly more likely', 'هذا الانتشار أرجح بكثير'], ['Cold objects pull in the heat', 'البارد يسحب الحرارة'], ['Energy is destroyed along the way', 'تفنى الطاقة في الطريق']]
  ]);
  Topic('c14s.orgsyn', ['Planning a synthesis', 'تخطيط التخليق'], 'lemon', [['Work backward from the target: what simple bond could be made last? Yield multiplies across steps: 90% over 5 steps leaves about 59%. So chemists seek the shortest route, and medicines cost what they do.', 'اعمل عكسيًا من الهدف. والمردود يتضاعف عبر الخطوات: ٩٠٪ على ٥ خطوات يبقي نحو ٥٩٪.']], [
    function (r) { var a = r.pick([90, 80, 50]), b = r.pick([90, 80, 50]); return P(['Overall yield, %.', 'المردود الكلي.'], a + '% then ' + b + '%', a * b / 100); },
    [['Retrosynthesis means:', 'التحليل العكسي يعني:'], ['Working backward from the product', 'العمل عكسيًا من الناتج'], ['Repeating the reaction many times', 'تكرار التفاعل مرات'], ['Reversing it to recover reactants', 'عكسه لاسترداد المتفاعلات']]
  ]);
  Topic('c14s.genome', ['Reading a genome', 'قراءة الجينوم'], 'microscope', [['Your genome holds about 3 billion base pairs and 20,000 genes. Most differences do nothing, some matter a little, and few decide outright. Be wary of tests promising your destiny.', 'جينومك نحو ٣ مليارات زوج و٢٠ ألف جين. وأغلب الفروق بلا أثر. واحذر اختبارات تعد بكشف مصيرك.']], [
    function () { return P(['Pairs of chromosomes in a person.', 'أزواج الكروموسومات.'], '', 23); },
    [['A genetic test says “30% more risk”. It means:', 'يقول اختبار "خطر أكبر ٣٠٪". يعني:'], ['A small rise over the usual risk', 'زيادة طفيفة على الخطر المعتاد'], ['A 30% chance you will get it', 'احتمال إصابتك ٣٠٪'], ['You will certainly get it', 'ستصاب حتمًا']]
  ]);
  Topic('c14s.climate', ['Reading climate science', 'قراءة علم المناخ'], 'tree', [['CO₂ absorbs infrared, a result measured in labs since the 1850s. Ice cores record past levels. Models carry uncertainty in how much warming follows, not in its direction. Judge any claim by evidence, and not by who shouts.', 'يمتص CO₂ الأشعة تحت الحمراء، وهو مقيس منذ القرن التاسع عشر. وعدم اليقين في المقدار لا في الاتجاه.']], [
    function (r) { var a = r.int(280, 300), b = r.int(400, 430); return P(['Rise in ppm.', 'الزيادة.'], a + ' ppm to ' + b + ' ppm', b - a); },
    [['Ice cores tell us about:', 'تخبرنا عينات الجليد عن:'], ['Past air and temperature', 'هواء وحرارة الماضي'], ['Future rainfall exactly', 'أمطار المستقبل بدقة'], ['The ocean’s depth', 'عمق المحيط']]
  ]);
  /* ---------- computing, Years 12 to 14 ---------- */
  U('computing', 'c12k', ['Algorithms you must know', 'خوارزميات لا غنى عنها'], 4, 12, true);
  Topic('c12k.greedy', ['Greedy algorithms', 'الخوارزميات الطماعة'], 'path', [['Take the best step now and never look back. It is optimal for some problems, such as scheduling by earliest finish, and wrong for others. Prove it, or find a counterexample: coins 1, 3, 4 for 6 gives 4+1+1, but 3+3 is better.', 'خذ أفضل خطوة الآن. وهي مثلى لبعض المسائل وخاطئة لغيرها: عملات ١، ٣، ٤ لـ٦ تعطي ٤+١+١ و٣+٣ أفضل.']], [
    function (r) { var n = r.int(1, 9) * 5 + r.int(0, 4); return P(['Fewest coins from 5s and 1s.', 'أقل عدد من فئة ٥ و١.'], 'make ' + n, Math.floor(n / 5) + n % 5); },
    [['Greedy is guaranteed correct:', 'الطماعة صحيحة حتمًا:'], ['Only when proved for that problem', 'إذا ثبتت لتلك المسألة فقط'], ['For every kind of problem', 'لكل المسائل'], ['Whenever it runs quickly', 'كلما كانت سريعة']]
  ]);
  Topic('c12k.dnc', ['Divide and conquer', 'فرّق تسد'], 'box', [['Split the problem, solve the parts, and combine them. Merge sort: log₂ n levels, n work per level, so n log n in all. At a million items that is 20 million steps, against a trillion for n².', 'قسّم وحل ودمج. الترتيب بالدمج: log₂ n مستوى وn عملًا لكل مستوى.']], [
    function (r) { var k = r.int(3, 16), n = Math.pow(2, k); return P(['Steps for n log₂ n.', 'خطوات n log₂ n.'], 'n = ' + n, n * k); },
    function (r) { var k = r.int(3, 20); return P(['Levels of splitting.', 'مستويات التقسيم.'], 'n = 2^' + k, k); }
  ]);
  Topic('c12k.sql', ['SQL joins and grouping', 'الدمج والتجميع في SQL'], 'box', [['JOIN links tables on a key. GROUP BY collapses rows, with COUNT, SUM or AVG. SELECT year, COUNT(*) FROM students GROUP BY year counts students per year. WHERE filters rows, and HAVING filters groups.', 'JOIN يربط الجداول، وGROUP BY يجمع الصفوف. وWHERE تصفي الصفوف وHAVING تصفي المجموعات.']], [
    [['Which filters whole groups?', 'أيها يصفي المجموعات؟'], ['HAVING', 'HAVING'], ['WHERE', 'WHERE'], ['ORDER BY', 'ORDER BY']],
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(['Rows in the output of COUNT grouped by this.', 'صفوف الناتج.'], a + ' rows in year 10, ' + b + ' in year 11', 2); },
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(['Rows in the cross join.', 'صفوف الدمج المتقاطع.'], a + ' × ' + b + ' rows', a * b); }
  ]);
  Topic('c12k.test', ['Writing tests that catch bugs', 'اختبارات تكشف الأخطاء'], 'wrench', [['Test the edges: empty, one item, largest, and wrong type. Keep tests small and independent, one idea each. When a bug appears, first write a test that fails, and then fix it, so that it can never return unnoticed.', 'اختبر الحدود: فارغ وعنصر واحد والأكبر. وعند ظهور خطأ اكتب اختبارًا يفشل ثم أصلحه.']], [
    [['A bug is reported. Best first step:', 'أُبلغ عن خطأ. أفضل خطوة:'], ['Write a test that reproduces it', 'اكتب اختبارًا يعيد إنتاجه'], ['Change the code until it goes away', 'غير الكود حتى يختفي'], ['Close the report and wait', 'أغلق البلاغ وانتظر']],
    [['Why keep tests independent?', 'لماذا تستقل الاختبارات؟'], ['A failure then points to one cause', 'ليدل الفشل على سبب واحد'], ['They use less disk space overall', 'تستهلك مساحة أقل'], ['They make the program run faster', 'تسرع البرنامج']]
  ]);
  U('computing', 'c13k', ['Machine learning in practice', 'تعلم الآلة عمليًا'], 4, 13, true);
  Topic('c13k.split', ['Train, validate, test', 'التدريب والتحقق والاختبار'], 'notebook', [['Split the data three ways: train to fit, validate to choose settings, and test once at the end. Peek at the test set, and your score is a lie. Data leaking between splits is the commonest quiet mistake in machine learning.', 'قسّم البيانات: تدريب وتحقق واختبار مرة في النهاية. واختلاس النظر يفسد النتيجة.']], [
    function (r) { var n = r.int(1, 9) * 1000, p = r.pick([10, 20]); return P(['Test set size.', 'حجم الاختبار.'], n + ' examples, ' + p + '% test', n * p / 100); },
    [['Tuning on the test set makes the score:', 'الضبط على الاختبار يجعل النتيجة:'], ['Falsely high', 'مرتفعة زيفًا'], ['More accurate', 'أدق'], ['Unchanged', 'بلا تغير']],
    [['The same patient in train and test is:', 'المريض نفسه في التدريب والاختبار:'], ['Data leakage', 'تسرب بيانات'], ['Augmentation', 'زيادة بيانات'], ['Regularisation', 'تنظيم']]
  ]);
  Topic('c13k.backprop', ['Backpropagation', 'الانتشار العكسي'], 'brain', [['A network is nested functions, so the chain rule gives every weight’s gradient, working backward from the loss. One forward pass, one backward pass, and a small step. Repeat millions of times, and it learns.', 'الشبكة دوال متداخلة، فتعطي قاعدة السلسلة تدرج كل وزن عكسيًا من الخسارة.']], [
    function (r) { var a = r.int(2, 6), b = r.int(2, 6); return P(['dy/dx by the chain rule.', 'dy/dx بقاعدة السلسلة.'], 'dy/du = ' + a + ', du/dx = ' + b, a * b); },
    function (r) { var w = r.int(4, 20), g = r.int(1, 4) * 10; return P(['New weight × 10, with step 0.1 × gradient.', 'الوزن الجديد × ١٠.'], 'w = ' + w + ', gradient ' + g, w * 10 - g); },
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(['Weights in this dense layer, ignoring biases.', 'أوزان هذه الطبقة.'], (a * 10) + ' inputs, ' + (b * 10) + ' outputs', a * b * 100); }
  ]);
  Topic('c13k.data', ['Cleaning data honestly', 'تنظيف البيانات بأمانة'], 'notebook', [['Look at it first. Find missing values, duplicates and impossible numbers, and write down what you changed. An age of 300 is a typo, but a surprising true value may be the finding. Deleting what you dislike is falsification.', 'انظر إليها أولًا. وثق ما تغير. وعمر ٣٠٠ خطأ، لكن القيمة المفاجئة قد تكون اكتشافًا. وحذف ما لا يعجبك تزوير.']], [
    [['Removing results that do not suit your hypothesis is:', 'حذف نتائج لا تناسب فرضك:'], ['Scientific fraud', 'تزوير علمي'], ['Normal cleaning', 'تنظيف عادي'], ['Good statistics', 'إحصاء جيد']],
    function (r) { var a = r.int(50, 200), b = r.int(1, 30); return P(['Rows left.', 'الصفوف الباقية.'], a + ' rows, ' + b + ' exact duplicates', a - b); }
  ]);
  U('computing', 'c14k', ['Systems and research', 'الأنظمة والبحث'], 4, 14, true);
  Topic('c14k.net', ['Latency, bandwidth and scale', 'زمن الاستجابة والنطاق والتوسع'], 'worldmap', [['Bandwidth is how much per second, and latency is how long the first bit takes. Light in fibre crosses 1,000 km in about 5 ms, and no upgrade beats that. So caches and data centres sit near users.', 'النطاق كم في الثانية، والاستجابة زمن أول بت. ويعبر الضوء ١٠٠٠ كم في نحو ٥ ملي ثانية.']], [
    function (r) { var k = r.int(1, 9); return P(['Milliseconds one way, at 5 ms per 1,000 km.', 'الملي ثانية ذهابًا.'], (k * 1000) + ' km', k * 5); },
    function (r) { var f = r.int(2, 9) * 100, b = r.pick([10, 100]); return P(['Seconds, for a file in megabits.', 'الثواني.'], f + ' Mb at ' + b + ' Mb/s', f / b); },
    [['A faster link does not reduce:', 'الرابط الأسرع لا يقلل:'], ['Light’s travel time', 'زمن سير الضوء'], ['File download time', 'زمن التنزيل'], ['Video buffering', 'تخزين الفيديو']]
  ]);
  Topic('c14k.db', ['Transactions', 'المعاملات'], 'lock', [['Moving money must take from one account and add to another, or do neither. Transactions are atomic: all or nothing. They keep data consistent, isolated from others, and durable after a crash.', 'تحويل المال يخصم ويضيف أو لا يفعل شيئًا. والمعاملات ذرية: كل شيء أو لا شيء.']], [
    function (r) { var a = r.int(5, 50) * 10, b = r.int(5, 50) * 10, x = r.int(1, 4) * 10; return P(['Total after the transfer.', 'المجموع بعد التحويل.'], a + ' and ' + b + ', move ' + x, a + b); },
    [['Atomic means a transaction:', 'ذرية تعني أن المعاملة:'], ['Happens fully or not at all', 'تتم كلها أو لا تتم'], ['Uses very little disk space', 'تستهلك مساحة قليلة'], ['Runs on a single small chip', 'تعمل على شريحة صغيرة']]
  ]);
  Topic('c14k.paper', ['Reproducing someone’s result', 'إعادة إنتاج نتيجة غيرك'], 'notebook', [['Pick a small paper, run the code, and try to get the same number. Fix random seeds, and record versions. Many claims do not reproduce, and finding that honestly is real science, and the best training there is.', 'اختر ورقة صغيرة وشغل الكود. ثبت البذور وسجل الإصدارات. وكثير من النتائج لا تتكرر.']], [
    [['Fixing a random seed helps because:', 'تثبيت البذرة يفيد لأن:'], ['Others can repeat the same run', 'يمكن تكرار التشغيل نفسه'], ['Training always gets more accurate', 'يصبح التدريب أدق دائمًا'], ['It uses far less computing memory', 'يقلل الذاكرة كثيرًا']],
    function (r) { var a = r.int(70, 90), b = r.int(1, 9); return P(['The gap in points.', 'الفرق بالنقاط.'], 'paper ' + (a + b) + '%, yours ' + a + '%', b); }
  ]);
  Topic('c14k.compiler', ['What a compiler does to your code', 'ما يفعله المترجم بكودك'], 'gear', [['Parse to a tree, check types, optimise, and generate machine code. x = 2 * 3 becomes x = 6, with no multiply at run time: constant folding. Knowing this stops you writing clever code that helps no one.', 'تحليل إلى شجرة وفحص أنواع وتحسين وتوليد. x = 2 * 3 تصبح x = 6: طي الثوابت.']], [
    function (r) { var a = r.int(2, 12), b = r.int(2, 12); return P(['After constant folding, x is.', 'x بعد طي الثوابت.'], 'x = ' + a + ' * ' + b, a * b); },
    [['A type checker finds errors:', 'مدقق الأنواع يجد الأخطاء:'], ['Before the program runs', 'قبل التشغيل'], ['Only in production', 'أثناء الاستخدام فقط'], ['Never, in any language', 'أبدًا']]
  ]);
  /* ---------- engineering, Year 14 ---------- */
  U('engineering', 'c14e', ['Engineering, first year', 'الهندسة، السنة الأولى'], 4, 14, true);
  Topic('c14e.pid', ['PID control', 'التحكم PID'], 'gear', [['Proportional acts on the error, integral on its history, and derivative on its trend. Too much gain, and it oscillates. Cruise control, drones and thermostats all tune these three numbers.', 'التناسبي على الخطأ والتكاملي على تاريخه والتفاضلي على اتجاهه. وزيادة الكسب تسبب التذبذب.']], [
    function (r) { var k = r.int(2, 9), e = r.int(2, 9); return P(['Proportional output.', 'الخرج التناسبي.'], 'Kp = ' + k + ', error ' + e, k * e); },
    function (r) { var s = r.int(20, 80), m = r.int(5, 15); return P(['Error.', 'الخطأ.'], 'target ' + (s + m) + ', measured ' + s, m); },
    [['Which term removes a lasting small error?', 'أي حد يزيل الخطأ الدائم؟'], ['Integral', 'التكاملي'], ['Proportional', 'التناسبي'], ['Derivative', 'التفاضلي']]
  ]);
  Topic('c14e.ac', ['Phasors and AC circuits', 'الطوريات ودوائر التيار المتردد'], 'wave', [['An inductor resists fast change, and a capacitor resists slow change. Impedance combines them: Z = √(R² + X²). The current and voltage can be out of step, which is why power factor matters to a grid.', 'الملف يقاوم التغير السريع والمكثف البطيء. والمعاوقة Z = √(R² + X²). وقد يختلف طور التيار والجهد.']], [
    function (r) { var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [30, 40, 50]]); return P(['Impedance, in Ω.', 'المعاوقة.'], 'R = ' + t[0] + ', X = ' + t[1], t[2]); },
    function (r) { var v = r.int(2, 24) * 5, z = 5; return P(['Current, in A.', 'التيار.'], 'V = ' + v + ', Z = ' + z, v / z); },
    [['A capacitor passes which more easily?', 'يمرر المكثف أسهل:'], ['High frequency', 'الترددات العالية'], ['Direct current', 'التيار المستمر'], ['Low frequency', 'الترددات المنخفضة']]
  ]);
  Topic('c14e.cycle', ['Heat engines and refrigerators', 'المحركات الحرارية والثلاجات'], 'thermo', [['Engines take in heat, do work, and reject the rest. Refrigerators run backward, moving heat using work. Coefficient of performance = heat moved ÷ work in, often above 1, which is why heat pumps beat electric heaters.', 'المحرك يأخذ حرارة ويبذل شغلًا. والثلاجة تعكس. ومعامل الأداء = الحرارة المنقولة ÷ الشغل، وغالبًا فوق ١.']], [
    function (r) { var w = r.int(1, 9), c = r.int(2, 4); return P(['Coefficient of performance.', 'معامل الأداء.'], (w * c) + ' kW moved, ' + w + ' kW in', c); },
    function (r) { var w = r.int(1, 5), c = r.int(2, 4); return P(['Heat delivered, in kW.', 'الحرارة المسلمة.'], w + ' kW in, COP ' + c, w * c); },
    [['Why do heat pumps save energy?', 'لماذا توفر المضخات الحرارية؟'], ['They move heat, and do not make it', 'تنقل الحرارة لا تصنعها'], ['They burn fuel more cleanly', 'تحرق الوقود أنظف'], ['They break the laws of physics', 'تخالف قوانين الفيزياء']]
  ]);
  Topic('c14e.manufacture', ['Design for making', 'التصميم للتصنيع'], 'hammer', [['A design that cannot be made cheaply is a drawing. Fewer parts, standard screws, wider tolerances where possible. A part made 1,000 times over justifies a costly mould, and one made once does not.', 'التصميم الذي لا يُصنع برخص مجرد رسم. أجزاء أقل ومسامير قياسية. والقالب الغالي يبرره ألف قطعة.']], [
    function (r) { var m = r.int(1, 9) * 1000, n = r.pick([100, 500, 1000]), u = r.int(1, 5); return P(['Cost per part.', 'كلفة القطعة.'], 'mould ' + m + ', ' + n + ' parts, ' + u + ' each', m / n + u); },
    [['Fewer parts in a product usually means:', 'أجزاء أقل عادة تعني:'], ['Cheaper and more reliable', 'أرخص وأوثق'], ['More things to go wrong', 'أعطال أكثر'], ['More assembly time', 'تجميع أطول']]
  ]);
  Topic('c14e.project', ['Running a project', 'إدارة مشروع'], 'notebook', [['List the tasks and what depends on what. The longest chain, the critical path, sets the finish date. Delay anything on it, and everything slips. Add margin, and say early when it will be late: that too is amānah.', 'اكتب المهام وما تعتمد عليه. وأطول سلسلة تحدد النهاية. وأضف هامشًا، وأخبر مبكرًا بالتأخر، فهذا من الأمانة.']], [
    function (r) { var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9); return P(['Days for the critical path.', 'أيام المسار الحرج.'], 'chain ' + a + ' + ' + b + ', or a parallel task of ' + c, Math.max(a + b, c)); },
    [['You realise a deadline will slip. You should:', 'أدركت أن الموعد سينزلق. عليك:'], ['Tell people early, with a new plan', 'إخبارهم مبكرًا بخطة جديدة'], ['Say nothing and work more quietly', 'السكوت والعمل بصمت'], ['Wait, and blame a supplier later', 'الانتظار ثم لوم المورد']]
  ]);
  /* ---------- the rest ---------- */
  U('world', 'c14w', ['Thinking about society', 'التفكير في المجتمع'], 4, 14, true);
  Topic('c14w.polit', ['Justice and authority', 'العدل والسلطة'], 'scale', [['What makes power legitimate? Al-Māwardī wrote on the duties of rulers, and Locke on consent. Compare the answers, their assumptions, and what each fears most. Justice in Islam binds the ruler as well as the ruled.', 'ما الذي يجعل السلطة مشروعة؟ كتب الماوردي في واجبات الحكام ولوك في الرضا. والعدل في الإسلام يلزم الحاكم والمحكوم.']], [
    [['Who wrote on the ordinances of government?', 'من كتب الأحكام السلطانية؟'], ['Al-Māwardī', 'الماوردي'], ['Ibn Sīnā', 'ابن سينا'], ['Al-Khwārizmī', 'الخوارزمي']],
    [['A good comparison of thinkers looks first at:', 'المقارنة الجيدة تنظر أولًا في:'], ['Their assumptions and aims', 'افتراضاتهم وأهدافهم'], ['Their dates and home cities', 'تواريخهم ومدنهم'], ['Who has more followers now', 'من له أتباع أكثر الآن']]
  ]);
  Topic('c14w.money', ['How money is created', 'كيف تُخلق النقود'], 'scale', [['Most money today is bank deposits, created when banks lend. Central banks influence this through interest rates. Scholars debate how this system relates to ribā. Understand the mechanics before you judge them.', 'معظم النقود ودائع تنشأ عند الإقراض. وتؤثر البنوك المركزية عبر الفائدة. ويناقش العلماء صلة ذلك بالربا.']], [
    function (r) { var r0 = r.pick([5, 10, 20]), d = r.int(1, 9) * 100; return P(['Most total deposits, reserve ratio r.', 'أقصى الودائع.'], d + ' new reserves, ' + r0 + '% ratio', d * 100 / r0); },
    [['Most modern money takes the form of:', 'أغلب النقود الحديثة:'], ['Bank deposits', 'ودائع بنكية'], ['Gold coins', 'عملات ذهبية'], ['Paper notes', 'أوراق نقدية']]
  ]);
  U('english', 'c14en', ['Writing that counts', 'كتابة مؤثرة'], 4, 14, true);
  Topic('c14en.acad', ['University writing', 'الكتابة الجامعية'], 'pen', [['Answer the question in your first paragraph. Each paragraph then makes one claim, with evidence and reasoning. Cut every word that does nothing. Read other scholars, argue with them fairly, and cite them.', 'أجب في الفقرة الأولى. كل فقرة دعوى بدليل وتعليل. واحذف ما لا يفيد. وناقش العلماء بإنصاف ووثقهم.']], [
    [['Which sentence is better?', 'أي جملة أفضل؟'], ['Rising rents forced families out', 'أخرج غلاء الإيجار الأسر'], ['It could be argued, in some ways, that rents might matter', 'قد يقال إن الإيجار ربما يهم نوعًا ما'], ['Families and rents are things in society today', 'الأسر والإيجارات أشياء في المجتمع']],
    [['Using AI to write your essay and hiding it is:', 'كتابة مقالك بالذكاء الاصطناعي وإخفاؤه:'], ['Academic dishonesty', 'غش أكاديمي'], ['Good time management', 'إدارة جيدة للوقت'], ['A kind of research', 'نوع من البحث']]
  ]);
  Topic('c14en.email', ['Writing to professionals', 'الكتابة للمختصين'], 'pen', [['Clear subject, polite greeting, who you are in one line, exactly what you ask, and a thank you. Short emails get answers. Check names and spelling. Reply within a day, even only to say you will reply.', 'موضوع واضح وتحية مهذبة ومن أنت في سطر وما تطلب بدقة والشكر. والرسائل القصيرة تُجاب.']], [
    [['The best subject line to a professor:', 'أفضل عنوان رسالة لأستاذ:'], ['Question on Tuesday’s lab report', 'سؤال عن تقرير مختبر الثلاثاء'], ['Hi, I really need some help', 'مرحبًا، أحتاج مساعدة حقًا'], ['Urgent!!! Please read this now', 'عاجل!!! اقرأها الآن']],
    [['Which ending is best for a request?', 'أي خاتمة أفضل للطلب؟'], ['Could you reply by Friday? Thank you.', 'هل يمكن الرد قبل الجمعة؟ شكرًا.'], ['I expect a reply from you today.', 'أنتظر ردك اليوم.'], ['Sorry to have bothered you at all.', 'آسف على الإزعاج أصلًا.']]
  ]);
  U('arabic', 'c14a', ['Arabic for life', 'العربية للحياة'], 4, 14, true);
  Topic('c14a.turath', ['Opening a classical book', 'فتح كتاب تراثي'], 'book', [['Read the muqaddimah first. Learn stock phrases: قَالَ الْمُصَنِّفُ the author said, أَيْ that is, وَقِيلَ and it was said. A commentary, sharḥ, explains a matn line by line. Read with a teacher when you can.', 'اقرأ المقدمة أولًا. واعرف: قال المصنف، أي، وقيل. والشرح يفسر المتن سطرًا سطرًا.']], [
    [['A sharḥ is:', 'الشرح:'], ['A commentary on a text', 'تفسير لنص'], ['A short poem of praise', 'قصيدة مدح'], ['A kind of dictionary', 'نوع معجم']],
    [['وَقِيلَ usually signals:', 'وقيل تدل غالبًا على:'], ['Another reported view', 'قول آخر'], ['The author’s firm ruling', 'جزم المؤلف'], ['A new chapter', 'فصل جديد']]
  ]);
  Topic('c14a.keep', ['Keeping your Arabic alive', 'إبقاء عربيتك حية'], 'talk', [['Languages fade unused. Read a page a day, keep a word list, and listen to a khuṭbah or lecture every week. Use it in duʿāʾ, and with others. Small and steady beats a month of effort once a year.', 'اللغة تضعف بلا استعمال. صفحة يوميًا وقائمة كلمات ومحاضرة أسبوعيًا. والقليل الدائم أفضل.']], [
    [['Which plan is most likely to last?', 'أي خطة أدوم؟'], ['One page every day', 'صفحة كل يوم'], ['A whole book each summer', 'كتاب كامل كل صيف'], ['A course once in five years', 'دورة كل خمس سنوات']],
    function (r) { var d = r.int(2, 12); return P(['Pages read in this many weeks, at one a day.', 'الصفحات في هذه الأسابيع.'], d + ' weeks', d * 7); }
  ]);
  U('deen', 'c13d', ['Deen for the grown-up years', 'الدين لسنوات الرشد'], 4, 13, true);
  Topic('c13d.usul', ['Commands, prohibitions and scope', 'الأمر والنهي والعموم'], 'scroll', [['Scholars ask if a command means obligation or recommendation, and whether a general word is limited by another text. Such tools explain many differences among the schools. Learning them brings humility more than certainty.', 'يسأل العلماء: هل الأمر للوجوب أم الندب؟ وهل يخص العام نص آخر؟ وهذه الأدوات تفسر كثيرًا من الخلاف.']], [
    [['Takhṣīṣ means:', 'التخصيص:'], ['Limiting a general wording by another proof', 'قصر العام بدليل آخر'], ['Copying a text by hand', 'نسخ النص باليد'], ['Translating into another language', 'الترجمة إلى لغة أخرى']],
    [['Learning uṣūl should lead most to:', 'تعلم الأصول يقود أساسًا إلى:'], ['Humility about hard questions', 'التواضع في المسائل الصعبة'], ['Issuing fatwās straight away', 'الإفتاء مباشرة'], ['Rejecting all the schools', 'رفض كل المذاهب']]
  ]);
  Topic('c13d.work', ['Riba, debt and student finance', 'الربا والدين وتمويل الدراسة'], 'scale', [['Interest-bearing loans raise a real question, and councils give differing answers in cases of need. Look first for scholarships, work and family help. Then ask a qualified scholar in your country, with the actual contract in hand.', 'القروض الربوية مسألة حقيقية، وتختلف المجامع عند الحاجة. ابحث أولًا عن المنح والعمل، ثم اسأل عالمًا مؤهلًا ومعك العقد.']], [
    [['Before accepting a study loan, you should first:', 'قبل قبول قرض دراسي عليك أولًا:'], ['Seek alternatives, and ask a scholar', 'البحث عن بدائل وسؤال عالم'], ['Sign, as everyone else does it', 'التوقيع فالجميع يفعل'], ['Ask only your closest friends', 'سؤال أصدقائك فقط']],
    function (r) { var p = r.int(2, 9) * 1000, i = r.pick([5, 10]), y = r.int(1, 3); return P(['Simple interest charged.', 'الفائدة البسيطة.'], p + ' at ' + i + '% for ' + y + ' years', p * i / 100 * y); }
  ]);
  U('deen', 'c14d', ['A life of worship and work', 'حياة عبادة وعمل'], 4, 14, true);
  Topic('c14d.marriage', ['Choosing a spouse', 'اختيار الزوج'], 'heart', [['Faith and character come first. Involve your families, ask real questions about money, children, and how you handle conflict. Consent is required, and istikhārah and advice go together. Marriage is a trust between two people before Allah.', 'الدين والخلق أولًا. أشرك الأهل واسأل عن المال والأولاد والخلاف. والرضا شرط، والاستخارة مع المشورة.']], [
    [['Which matters most in choosing a spouse?', 'أيها أهم في الاختيار؟'], ['Faith and good character', 'الدين وحسن الخلق'], ['Their family’s high status', 'مكانة عائلته'], ['Their looks and salary alone', 'الجمال والراتب وحدهما']],
    [['What should a couple discuss before marriage?', 'ماذا يناقش الخاطبان؟'], ['Money, children and handling conflict', 'المال والأولاد والخلاف'], ['Only the wedding hall and the date', 'القاعة والموعد فقط'], ['Nothing, as talking spoils it', 'لا شيء لئلا يفسد الأمر']]
  ]);
  Topic('c14d.community', ['Your place in the community', 'مكانك في المجتمع'], 'lantern', [['Find your masjid, and serve it. Visit the sick, teach what you know, and help new Muslims. Your skills in engineering, medicine and law are service too. Ask often: who benefits from what I do?', 'ابحث عن مسجدك واخدمه. زر المريض وعلّم ما تعرف. ومهاراتك في الهندسة والطب خدمة أيضًا.']], [
    [['A Muslim engineer’s work serves others when:', 'يخدم عمل المهندس المسلم غيره إذا:'], ['It is honest, safe and useful', 'كان أمينًا آمنًا نافعًا'], ['It earns the largest salary', 'حقق أعلى راتب'], ['It is done only for Muslims', 'كان للمسلمين فقط']],
    function (r) { var h = r.int(1, 4), w = r.int(4, 12); return P(['Hours given.', 'الساعات المبذولة.'], h + ' hours a week for ' + w + ' weeks', h * w); }
  ]);
  U('life', 'c14l2', ['Staying well, away from home', 'العافية بعيدًا عن البيت'], 4, 14, true);
  Topic('c14l2.mind', ['Looking after your mind', 'العناية بعقلك'], 'heart', [['Sleep, food, movement, prayer and people. Know the signs of trouble: weeks of low mood, no sleep, or pulling away from everyone. Universities have counsellors, and using one is sound sense, taking the means alongside trust in Allah.', 'النوم والطعام والحركة والصلاة والناس. واعرف العلامات: أسابيع من الكآبة وقلة النوم والانعزال. وللجامعات مرشدون.']], [
    [['Weeks of low mood and no sleep call for:', 'أسابيع من الكآبة وقلة النوم تحتاج:'], ['Talking to someone, and seeing a doctor', 'الحديث مع أحد وزيارة طبيب'], ['Working harder until it passes', 'العمل أكثر حتى تزول'], ['Staying alone until it lifts', 'البقاء وحدك حتى تنقشع']],
    function (r) { var a = r.int(6, 9), d = r.int(2, 7); return P(['Hours of sleep in this time.', 'ساعات النوم.'], a + ' hours a night for ' + d + ' nights', a * d); }
  ]);
  Topic('c14l2.friends', ['Choosing your circle', 'اختيار دائرتك'], 'talk', [['You become like those you spend time with. Seek out people who pray, work hard and tell you the truth. You can be kind to everyone, and still choose who is close. Leave a group that pulls you from your deen.', 'تصير كمن تصاحب. ابحث عمن يصلي ويجتهد ويصدقك. ويمكنك الإحسان للجميع واختيار المقربين.']], [
    [['Good friends are those who:', 'الأصدقاء الجيدون:'], ['Help you stay who you want to be', 'يعينونك على ما تريد أن تكون'], ['Always agree with what you do', 'يوافقونك دائمًا'], ['Have the most money to spend', 'أكثرهم مالًا']],
    [['Being kind to everyone means:', 'الإحسان للجميع يعني:'], ['You may still choose who is close', 'لك أن تختار المقربين'], ['You must follow them everywhere', 'تتبعهم في كل مكان'], ['You cannot say no to anyone', 'لا ترفض لأحد']]
  ]);
})();
