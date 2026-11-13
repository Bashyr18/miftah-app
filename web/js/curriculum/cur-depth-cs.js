/* Depth pass: biology, computing and AI, engineering. Code is traced by hand, numbers change every time, and ideas are tested from a second side. */
(function () {
  'use strict';
  var C = window.C, deep = C.deep;
  function n(p, eq, a) { return { k: 'pad', p: p, eq: eq, a: a, err: 'understanding' }; }
  var OUT = ['What does it print?', 'ماذا يطبع؟'];

  /* ---------- biology ---------- */
  deep('b8.enz', [['Worked: an enzyme is fastest at its optimum, near 37°C in people. Colder, particles collide less. Much hotter, the active site changes shape and the enzyme is denatured for good.', 'مثال محلول: يبلغ الإنزيم ذروته عند الدرجة المثلى، نحو ٣٧°م في الإنسان. وعند البرودة تقل التصادمات، وعند الحرارة الشديدة يتغير الموقع النشط فيتمسخ نهائيًا.']], [
    [['Why does a fever of 42°C threaten the body?', 'لماذا تهدد حمى ٤٢°م الجسم؟'], ['Enzymes start to denature', 'تبدأ الإنزيمات بالتمسخ'], ['Enzymes multiply', 'تتكاثر الإنزيمات'], ['Blood stops being red', 'يفقد الدم لونه']],
    [['Cold slows an enzyme, but warming it again:', 'البرد يبطئ الإنزيم، وتدفئته ثانية:'], ['Restores its activity', 'تعيد نشاطه'], ['Cannot help', 'لا تفيد'], ['Kills it', 'تقتله']]
  ]);
  deep('b8.circ', null, [
    [['Why do arteries have thick walls?', 'لماذا جدران الشرايين سميكة؟'], ['Blood there is under high pressure', 'لأن الدم فيها تحت ضغط عالٍ'], ['They carry less blood', 'تحمل دمًا أقل'], ['They hold valves', 'فيها صمامات']],
    [['What stops blood flowing backward in veins?', 'ما الذي يمنع رجوع الدم في الأوردة؟'], ['Valves', 'الصمامات'], ['Thick muscle', 'العضلة السميكة'], ['Platelets', 'الصفائح']],
    function (r) { var b = r.int(60, 90), v = r.pick([60, 70, 80]); return n(['Cardiac output in mL per minute.', 'النتاج القلبي مل/دقيقة.'], b + ' beats/min × ' + v + ' mL/beat', b * v); }
  ]);
  deep('b8.digest', null, [
    [['Which enzyme breaks down starch?', 'أي إنزيم يحلل النشا؟'], ['Amylase', 'الأميليز'], ['Protease', 'البروتياز'], ['Lipase', 'الليباز']],
    [['Villi help because they:', 'تفيد الخملات لأنها:'], ['Hugely increase surface area', 'تزيد المساحة كثيرًا'], ['Make acid', 'تصنع الحمض'], ['Store bile', 'تخزن الصفراء']],
    [['Bile’s main job is to:', 'وظيفة الصفراء الأساسية:'], ['Break fat into small droplets', 'تحويل الدهن إلى قطرات صغيرة'], ['Digest protein', 'هضم البروتين'], ['Absorb water', 'امتصاص الماء']]
  ]);
  deep('b8.plants', null, [
    [['On a hot windy day, transpiration:', 'في يوم حار عاصف، النتح:'], ['Rises', 'يزيد'], ['Falls', 'يقل'], ['Stops', 'يتوقف']],
    [['Stomata are mainly on the underside of leaves to:', 'الثغور أسفل الورقة غالبًا لـ:'], ['Reduce water loss', 'تقليل فقد الماء'], ['Catch light', 'التقاط الضوء'], ['Hold soil', 'حمل التربة']]
  ]);
  deep('b9.dna', [['Worked: bases pair A with T and C with G. If a strand reads ATGC, its partner reads TACG. If 30% of the bases are A, then 30% are T, leaving 20% each for C and G.', 'مثال محلول: تتزاوج A مع T وC مع G. فإن كان الشريط ATGC فشريكه TACG. وإن كانت A نسبتها ٣٠٪ فكذلك T، ويبقى ٢٠٪ لكل من C وG.']], [
    function (r) { var a = r.pick([10, 20, 30, 40]); return n(['Percentage of G.', 'نسبة G بالمئة.'], a + '% of bases are A', (100 - 2 * a) / 2); },
    [['The partner of the strand AGCT is:', 'شريك الشريط AGCT هو:'], ['TCGA', 'TCGA'], ['AGCT', 'AGCT'], ['GATC', 'GATC']],
    function () { return n(['How many chromosomes in a normal human body cell?', 'كم كروموسومًا في خلية جسدية بشرية؟'], '', 46); }
  ]);
  deep('b9.inherit', [['Worked: Bb × Bb gives BB, Bb, Bb, bb. 3 in 4 show the dominant trait, and 1 in 4 is bb. Each child is a fresh chance.', 'مثال محلول: Bb × Bb تعطي BB وBb وBb وbb. ٣ من ٤ يظهر فيهم السائد، وواحد من ٤ bb. وكل ولد احتمال جديد.']], [
    function (r) { var q = r.pick([['Bb × bb: % chance of bb', 50], ['Bb × Bb: % chance of bb', 25], ['BB × bb: % chance of bb', 0], ['Bb × Bb: % showing dominant', 75], ['bb × bb: % chance of bb', 100]]); return n(['Work out the percentage.', 'احسب النسبة.'], q[0], q[1]); },
    [['A person with Bb is called:', 'من جيناته Bb يسمى:'], ['Heterozygous', 'متغاير الزيجوت'], ['Homozygous', 'متماثل الزيجوت'], ['Recessive', 'متنحيًا']],
    [['First cousins marrying can raise the risk of:', 'زواج الأقارب قد يزيد خطر:'], ['Recessive conditions appearing', 'ظهور الحالات المتنحية'], ['Dominant traits vanishing', 'اختفاء السائد'], ['Extra chromosomes', 'كروموسومات زائدة']]
  ]);
  deep('b9.ecosys', [['Worked: about 10% of energy passes up each level. 10,000 kJ in plants gives 1,000 kJ in herbivores and 100 kJ in carnivores.', 'مثال محلول: ينتقل نحو ١٠٪ من الطاقة لكل مستوى. ١٠٠٠٠ ك.ج في النبات تعطي ١٠٠٠ في العواشب و١٠٠ في اللواحم.']], [
    function (r) { var e = r.pick([1000, 5000, 20000, 40000]); return n(['Energy passed to the herbivores, in kJ (10% rule).', 'الطاقة المنتقلة إلى العواشب (قاعدة ١٠٪).'], e + ' kJ in plants', e / 10); },
    [['Decomposers matter because they:', 'تهم المحللات لأنها:'], ['Return nutrients to the soil', 'تعيد المغذيات للتربة'], ['Make sunlight', 'تصنع الضوء'], ['Eat only live animals', 'تأكل الأحياء فقط']]
  ]);
  deep('b9.health', null, [
    [['A vaccine works by:', 'يعمل اللقاح بـ:'], ['Training memory cells', 'تدريب خلايا الذاكرة'], ['Killing every germ at once', 'قتل كل جرثومة فورًا'], ['Replacing blood', 'استبدال الدم']],
    [['Why must antibiotic courses be finished as prescribed?', 'لماذا تُكمل دورة المضاد الحيوي؟'], ['To reduce resistant survivors', 'لتقليل الناجين المقاومين'], ['To kill viruses', 'لقتل الفيروسات'], ['To add vitamins', 'لإضافة فيتامينات']]
  ]);
  deep('b9.hormones', null, [
    [['A reflex is fast because it:', 'الانعكاس سريع لأنه:'], ['Skips the conscious brain', 'يتجاوز الدماغ الواعي'], ['Uses hormones', 'يستعمل الهرمونات'], ['Travels in blood', 'يسير في الدم']],
    [['Which hormone raises heart rate in danger?', 'أي هرمون يرفع نبض القلب عند الخطر؟'], ['Adrenaline', 'الأدرينالين'], ['Insulin', 'الإنسولين'], ['Oestrogen', 'الإستروجين']]
  ]);
  deep('bio9.lung', [['Worked: at rest you might take 12 breaths a minute of 500 mL each, moving 6,000 mL of air per minute.', 'مثال محلول: في الراحة نحو ١٢ نفسًا في الدقيقة كل منها ٥٠٠ مل، فتتحرك ٦٠٠٠ مل من الهواء.']], [
    function (r) { var b = r.int(10, 20), v = r.pick([400, 500, 600]); return n(['Air per minute in mL.', 'الهواء في الدقيقة بالمل.'], b + ' breaths × ' + v + ' mL', b * v); },
    [['Which gas diffuses out of the blood in the lungs?', 'أي غاز ينتشر خارج الدم في الرئتين؟'], ['Carbon dioxide', 'ثاني أكسيد الكربون'], ['Oxygen', 'الأكسجين'], ['Nitrogen', 'النيتروجين']]
  ]);
  deep('bio9.mitosis', null, [
    function () { return n(['Chromosomes in a human egg or sperm cell.', 'الكروموسومات في البويضة أو الحيوان المنوي.'], '', 23); },
    function (r) { var k = r.int(2, 5); return n(['How many cells after this many mitotic divisions, from one?', 'كم خلية بعد هذه الانقسامات المتساوية من واحدة؟'], k + ' divisions', Math.pow(2, k)); },
    [['Meiosis matters because it brings:', 'تكمن أهمية الانقسام المنصف في:'], ['Variation', 'التنوع'], ['Identical cells', 'خلايا متطابقة'], ['More oxygen', 'أكسجين أكثر']]
  ]);
  deep('bio13.stats', [['Worked: χ² = Σ (O − E)² ÷ E. Observed 60, expected 50: (10)² ÷ 50 = 2. Add this for every category, then compare with the table.', 'مثال محلول: χ² = Σ (م − ت)² ÷ ت. مشاهد ٦٠ ومتوقع ٥٠: ١٠٠ ÷ ٥٠ = ٢. اجمعها لكل فئة ثم قارن بالجدول.']], [
    function (r) { var q = r.pick([[25, 5], [50, 10], [25, 10], [20, 10], [100, 10], [5, 5]]); return n(['This category’s χ² term.', 'حد هذه الفئة في χ².'], 'O = ' + (q[0] + q[1]) + ', E = ' + q[0], q[1] * q[1] / q[0]); },
    [['A p-value below 0.05 means:', 'قيمة p أقل من ٠٫٠٥ تعني:'], ['Chance alone is an unlikely explanation', 'الصدفة وحدها تفسير مستبعد'], ['The result is proved for ever', 'النتيجة ثابتة أبدًا'], ['The sample was small', 'العينة صغيرة']]
  ]);
  deep('sci12.protein', [['Worked: a codon is three bases. A gene of 300 bases can code for at most 100 amino acids.', 'مثال محلول: الكودون ثلاث قواعد. جين من ٣٠٠ قاعدة يرمّز لمئة حمض أميني على الأكثر.']], [
    function (r) { var a = r.int(20, 150); return n(['Maximum amino acids.', 'أقصى عدد للأحماض الأمينية.'], (a * 3) + ' bases', a); },
    [['RNA uses which base instead of T?', 'أي قاعدة في RNA بدل T؟'], ['Uracil', 'اليوراسيل'], ['Adenine', 'الأدينين'], ['Guanine', 'الجوانين']],
    [['Translation happens at the:', 'تحدث الترجمة عند:'], ['Ribosome', 'الريبوسوم'], ['Nucleus', 'النواة'], ['Cell membrane', 'الغشاء']]
  ]);
  deep('sci12.immune', null, [
    [['The second infection is milder because of:', 'تكون العدوى الثانية أخف بسبب:'], ['Memory cells', 'خلايا الذاكرة'], ['More red cells', 'خلايا حمراء أكثر'], ['Fever alone', 'الحمى وحدها']],
    [['Antibodies are made by:', 'تصنع الأجسام المضادة:'], ['B cells', 'الخلايا البائية'], ['Red cells', 'الخلايا الحمراء'], ['Platelets', 'الصفائح']]
  ]);

  /* ---------- computing: read code like the machine ---------- */
  deep('k8.vars', [['Worked, in Python: x = 5, then x = x + 2. The right side runs first, using the old x, so x becomes 7.', 'مثال محلول بلغة بايثون: x = 5 ثم x = x + 2. يُحسب الطرف الأيمن أولًا بقيمة x القديمة، فتصبح ٧.']], [
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return { k: 'pad', p: OUT, eq: 'x = ' + a + '; x = x + ' + b + '; print(x)', a: a + b, err: 'understanding' }; },
    function (r) { var a = r.int(2, 9), b = r.int(2, 5); return { k: 'pad', p: OUT, eq: 'a = ' + a + '; b = a * ' + b + '; a = 0; print(b)', a: a * b, err: 'understanding' }; },
    [['Which is the type of "42" in quotes?', 'ما نوع "42" بين علامتي اقتباس؟'], ['Text (a string)', 'نص'], ['A whole number', 'عدد صحيح'], ['True or false', 'منطقي']]
  ]);
  deep('k8.if', [['Worked: if x > 10 then "big", else "small". With x = 10, the test is false, because 10 is not more than 10.', 'مثال محلول: إذا x > 10 فـ"كبير" وإلا "صغير". عند x = 10 الشرط خاطئ، فعشرة ليست أكبر من عشرة.']], [
    function (r) { var x = r.int(1, 20), t = r.int(5, 15), a = r.int(1, 9), b = r.int(1, 9) + 10; return { k: 'pad', p: OUT, eq: 'x = ' + x + '; print(' + a + ' if x > ' + t + ' else ' + b + ')', a: x > t ? a : b, err: 'understanding' }; },
    [['x = 4. Is "x > 2 and x < 4" true?', 'x = 4. هل "x > 2 و x < 4" صحيح؟'], ['No', 'لا'], ['Yes', 'نعم'], ['Error', 'خطأ']],
    [['x = 4. Is "x < 2 or x == 4" true?', 'x = 4. هل "x < 2 أو x == 4" صحيح؟'], ['Yes', 'نعم'], ['No', 'لا'], ['Error', 'خطأ']]
  ]);
  deep('k8.loop', [['Worked: total = 0; for i in 1 to 3: total += i. Trace it: 1, then 3, then 6. Writing the table by hand is what programmers do.', 'مثال محلول: total = 0 ثم لكل i من ١ إلى ٣ أضف i. التتبع: ١ ثم ٣ ثم ٦. وكتابة الجدول باليد عادة المبرمجين.']], [
    function (r) { var k = r.int(3, 9); return { k: 'pad', p: OUT, eq: 't = 0; for i in 1..' + k + ': t += i; print(t)', a: k * (k + 1) / 2, err: 'understanding' }; },
    function (r) { var k = r.int(2, 6), a = r.int(2, 5); return { k: 'pad', p: ['How many times does the inner line run?', 'كم مرة ينفذ السطر الداخلي؟'], eq: 'for i in 1..' + k + ': for j in 1..' + a, a: k * a, err: 'understanding' }; },
    function (r) { var a = r.int(2, 4); return { k: 'pad', p: OUT, eq: 'x = 1; repeat ' + a + ' times: x = x * 2; print(x)', a: Math.pow(2, a), err: 'understanding' }; }
  ]);
  deep('k8.debug', null, [
    [['The program should add 1 to 10 but prints 45. Most likely:', 'يجب جمع ١ إلى ١٠ لكنه يطبع ٤٥. الأرجح:'], ['The loop stops one too early', 'الحلقة تتوقف قبل الأخير بخطوة'], ['Addition is broken', 'الجمع معطل'], ['The computer is tired', 'الحاسوب متعب']],
    [['Best first step with a bug:', 'أفضل خطوة أولى مع خطأ برمجي:'], ['Reproduce it and read the error', 'أعد إنتاجه واقرأ رسالة الخطأ'], ['Rewrite everything', 'أعد كتابة كل شيء'], ['Change many things at once', 'غيّر أشياء كثيرة معًا']]
  ]);
  deep('k8.binary', [['Worked: 1101 = 8 + 4 + 0 + 1 = 13. To go back: 13 is 8 + 4 + 1, so 1101. Each bit doubles the place value. Four bits make a hex digit.', 'مثال محلول: 1101 = ٨ + ٤ + ٠ + ١ = ١٣. والعكس: ١٣ = ٨ + ٤ + ١ فهي 1101. وكل خانة تضاعف القيمة.']], [
    function (r) { var x = r.int(3, 31); return n(['Convert to denary.', 'حوّل إلى العشري.'], x.toString(2) + ' in binary', x); },
    function (r) { var b = r.int(3, 10); return n(['How many different values?', 'كم قيمة مختلفة؟'], b + ' bits', Math.pow(2, b)); },
    function (r) { var a = r.int(1, 7), b = r.int(1, 7); return n(['Add, and answer in denary.', 'اجمع وأجب بالعشري.'], a.toString(2) + ' + ' + b.toString(2), a + b); },
    function (r) { var h = r.pick([['A', 10], ['B', 11], ['C', 12], ['D', 13], ['E', 14], ['F', 15]]); return n(['Hex digit in denary.', 'الرقم الست عشري بالعشري.'], h[0], h[1]); }
  ]);
  deep('k8b.file', null, [
    [['Why save to a file at all?', 'لماذا الحفظ في ملف أصلًا؟'], ['Memory clears when the program ends', 'تُمحى الذاكرة عند انتهاء البرنامج'], ['Files are faster than memory', 'الملفات أسرع من الذاكرة'], ['To hide bugs', 'لإخفاء الأخطاء']],
    [['What should a program do if a file is missing?', 'ماذا يفعل البرنامج إذا فُقد ملف؟'], ['Handle the error and carry on or explain', 'يعالج الخطأ ويتابع أو يوضح'], ['Crash without a message', 'ينهار بلا رسالة'], ['Delete other files', 'يحذف ملفات أخرى']]
  ]);
  deep('k9.lists', [['Worked: search a sorted list of 1,000. Each step halves it: 500, 250, 125, 63, 32, 16, 8, 4, 2, 1. About 10 steps, since 2¹⁰ = 1,024. Linear search may need all 1,000.', 'مثال محلول: البحث في قائمة مرتبة من ١٠٠٠: كل خطوة تنصّفها. نحو ١٠ خطوات لأن ٢¹⁰ = ١٠٢٤، والخطي قد يحتاج ١٠٠٠.']], [
    function (r) { var k = r.int(4, 20); return n(['Worst case steps for binary search.', 'أسوأ حالة في البحث الثنائي.'], Math.pow(2, k) + ' items', k); },
    function (r) { var a = r.int(50, 5000); return n(['Worst case for linear search.', 'أسوأ حالة في البحث الخطي.'], a + ' items', a); },
    [['Binary search needs the list to be:', 'البحث الثنائي يحتاج قائمة:'], ['Sorted', 'مرتبة'], ['Short', 'قصيرة'], ['Numbers only', 'أرقامًا فقط']]
  ]);
  deep('k9.sort', null, [
    function (r) { var k = r.pick([8, 16, 32, 64]); return n(['Merge sort: how many levels of splitting?', 'الدمج: كم مستوى للتقسيم؟'], k + ' items', Math.log2(k)); },
    function (r) { var k = r.int(4, 12); return n(['Bubble sort: most comparisons in the first pass.', 'الفقاعات: مقارنات المرور الأول.'], k + ' items', k - 1); },
    [['For a million items, which is far faster?', 'لمليون عنصر أيها أسرع بكثير؟'], ['Merge sort', 'الدمج'], ['Bubble sort', 'الفقاعات'], ['They are equal', 'متساويان']]
  ]);
  deep('k9.web', null, [
    [['What does DNS do?', 'ماذا يفعل DNS؟'], ['Turns names into IP addresses', 'يحول الأسماء إلى عناوين'], ['Encrypts files', 'يشفر الملفات'], ['Stores passwords', 'يخزن كلمات السر']],
    [['HTTPS protects you by:', 'يحميك HTTPS بـ:'], ['Encrypting data in transit', 'تشفير البيانات أثناء النقل'], ['Blocking all ads', 'منع الإعلانات'], ['Making pages true', 'جعل الصفحات صادقة']]
  ]);
  deep('k9.safe', [['Worked: a password of 8 lowercase letters has 26⁸ choices; 12 mixed characters has about 19 million times more than that. Length beats cleverness.', 'مثال محلول: ٨ أحرف صغيرة لها ٢٦⁸ احتمالًا، و١٢ رمزًا مختلطًا أكثر بملايين المرات. فالطول أقوى من التعقيد.']], [
    [['A message says your account closes in an hour. Click here. This is likely:', 'رسالة تقول إن حسابك يُغلق خلال ساعة. انقر هنا. الأرجح:'], ['Phishing', 'تصيد'], ['A kind reminder', 'تذكير لطيف'], ['A system update', 'تحديث']],
    [['Why not reuse a password?', 'لماذا لا تكرر كلمة السر؟'], ['One leak opens every account', 'تسريب واحد يفتح كل حساب'], ['It wears out', 'تبلى'], ['It slows the phone', 'تبطئ الهاتف']]
  ]);
  deep('k9.test', null, [
    [['A function finds the largest number in a list. The hardest test is:', 'دالة تجد أكبر عدد في قائمة. أصعب اختبار:'], ['An empty list', 'قائمة فارغة'], ['A list of two', 'قائمة من عددين'], ['A list of five', 'قائمة من خمسة']],
    [['A test should state:', 'يجب أن يذكر الاختبار:'], ['The expected answer before running', 'الجواب المتوقع قبل التشغيل'], ['Whatever it printed', 'أي شيء طُبع'], ['Nothing at all', 'لا شيء']]
  ]);
  deep('k11.oop', [['Worked: a stack is last in, first out, like plates. Push 1, 2, 3, pop gives 3. A queue is first in, first out, so it gives 1.', 'مثال محلول: المكدس آخر داخل أول خارج كالأطباق: ادفع ١، ٢، ٣ فالسحب يعطي ٣. والطابور أول داخل أول خارج فيعطي ١.']], [
    function (r) { var a = r.int(2, 9), b = r.int(10, 19), c = r.int(20, 29); return { k: 'pad', p: ['A stack: what comes off?', 'مكدس: ما الذي يخرج؟'], eq: 'push ' + a + ', push ' + b + ', push ' + c + ', pop', a: c, err: 'understanding' }; },
    function (r) { var a = r.int(2, 9), b = r.int(10, 19), c = r.int(20, 29); return { k: 'pad', p: ['A queue: what comes off?', 'طابور: ما الذي يخرج؟'], eq: 'add ' + a + ', add ' + b + ', add ' + c + ', remove', a: a, err: 'understanding' }; },
    [['The back button in a browser is best modelled by:', 'زر الرجوع في المتصفح أنسب له:'], ['A stack', 'مكدس'], ['A queue', 'طابور'], ['A hash table', 'جدول تجزئة']]
  ]);
  deep('k11.db', [['Worked: SELECT name FROM students WHERE year = 11 ORDER BY name. Tables link by keys: orders.student_id points to students.id.', 'مثال محلول: SELECT name FROM students WHERE year = 11 ORDER BY name. وتترابط الجداول بالمفاتيح.']], [
    [['Which part filters rows?', 'أي جزء يصفّي الصفوف؟'], ['WHERE', 'WHERE'], ['SELECT', 'SELECT'], ['ORDER BY', 'ORDER BY']],
    [['To combine two linked tables, use:', 'لدمج جدولين مترابطين استعمل:'], ['JOIN', 'JOIN'], ['DELETE', 'DELETE'], ['DROP', 'DROP']],
    [['Why never build SQL by joining raw user text?', 'لماذا لا تبني SQL بدمج نص المستخدم مباشرة؟'], ['SQL injection', 'حقن SQL'], ['It runs too fast', 'يسرع جدًا'], ['It loses tables', 'يفقد الجداول']]
  ]);
  deep('k12.complex', [['Worked: at n = 1,000, O(n) is 1,000 steps, O(n²) is 1,000,000, and O(log n) is about 10. Double n: O(n²) takes four times as long.', 'مثال محلول: عند ن = ١٠٠٠: O(n) ألف خطوة وO(n²) مليون وO(log n) نحو ١٠. وبمضاعفة ن يصبح O(n²) أربعة أضعاف.']], [
    function (r) { var n0 = r.pick([10, 20, 50, 100]); return n(['Steps for O(n²).', 'خطوات O(n²).'], 'n = ' + n0, n0 * n0); },
    function (r) { var k = r.pick([2, 3, 4]); return n(['O(n²): time is multiplied by?', 'O(n²): يُضرب الزمن في؟'], 'n × ' + k, k * k); },
    [['Two nested loops over n items are usually:', 'حلقتان متداخلتان على ن عنصرًا غالبًا:'], ['O(n²)', 'O(n²)'], ['O(n)', 'O(n)'], ['O(1)', 'O(1)']]
  ]);
  deep('k12.ai', null, [
    [['An AI confidently states a false fact. This is often called:', 'يذكر الذكاء الاصطناعي خطأً بثقة. يسمى غالبًا:'], ['Hallucination', 'هلوسة'], ['Compiling', 'ترجمة'], ['Encryption', 'تشفير']],
    [['Asked for a fatwā, an AI’s answer should be:', 'إذا طُلبت منه فتوى فجوابه:'], ['Checked with a qualified scholar', 'يُعرض على عالم مؤهل'], ['Acted on at once', 'يُعمل به فورًا'], ['Trusted if it sounds sure', 'موثوق إن بدا واثقًا']]
  ]);
  deep('ai11.grad', [['Worked: f(x) = x². Slope = 2x. At x = 5, with learning rate 0.1: x becomes 5 − 0.1 × 10 = 4. Repeat, and x slides toward the minimum.', 'مثال محلول: f(x) = x². الميل = ٢x. عند x = ٥ ومعدل تعلم ٠٫١: تصبح x = ٤. وبالتكرار تنزلق نحو القيمة الدنيا.']], [
    function (r) { var x = r.int(2, 12); return n(['Slope of x² here.', 'ميل x² هنا.'], 'x = ' + x, 2 * x); },
    function (r) { var x = r.pick([5, 10, 15, 20]); return n(['New x after one step, learning rate 0.1.', 'x الجديدة بعد خطوة، معدل التعلم ٠٫١.'], 'x = ' + x, x - x / 5); },
    [['Learning rate far too large means the model:', 'معدل تعلم كبير جدًا يعني أن النموذج:'], ['Overshoots and diverges', 'يتجاوز ويتباعد'], ['Learns perfectly', 'يتعلم تمامًا'], ['Stops at once', 'يتوقف فورًا']]
  ]);
  deep('ai11.class', [['Worked: of 100 test images, 90 are right. Accuracy 90%. But if 95 of 100 are cats, always saying “cat” scores 95%, so also check precision and recall.', 'مثال محلول: من ١٠٠ صورة صح ٩٠ فالدقة ٩٠٪. لكن إن كانت ٩٥ قططًا فقول "قطة" دائمًا يعطي ٩٥٪، فافحص الدقة النوعية والاستدعاء أيضًا.']], [
    function (r) { var t = r.pick([20, 50, 100, 200]), p = r.pick([60, 70, 80, 90]); return n(['Accuracy, %.', 'الدقة ٪.'], (t * p / 100) + ' right of ' + t, p); },
    function (r) { var tp = r.pick([8, 16, 24, 40]), fp = tp / 4; return n(['Precision, %.', 'الدقة النوعية ٪.'], tp + ' true positives, ' + fp + ' false positives', 80); },
    [['Great on training data, poor on new data, is:', 'ممتاز في التدريب ضعيف في الجديد:'], ['Overfitting', 'فرط التخصيص'], ['Underfitting', 'نقص التخصيص'], ['Compiling', 'الترجمة']]
  ]);
  deep('k11b.twos', [['Worked: in 8 bits, −5 is found by flipping 00000101 to 11111010 and adding 1: 11111011. The range is −128 to 127.', 'مثال محلول: في ٨ بت نجد −٥ بقلب 00000101 إلى 11111010 ثم إضافة ١: 11111011. والمدى −١٢٨ إلى ١٢٧.']], [
    function (r) { var b = r.pick([4, 8, 16]); return n(['Largest positive value in two’s complement.', 'أكبر قيمة موجبة.'], b + ' bits', Math.pow(2, b - 1) - 1); },
    function (r) { var b = r.pick([4, 8]); return n(['Size of the most negative value (ignore the sign).', 'مقدار أصغر قيمة سالبة.'], b + ' bits', Math.pow(2, b - 1)); },
    [['Why compare floats with a small tolerance?', 'لماذا تُقارن الأعداد العشرية بهامش صغير؟'], ['They are stored approximately', 'تُخزن تقريبيًا'], ['They are too slow', 'بطيئة جدًا'], ['They cannot be negative', 'لا تكون سالبة']]
  ]);
  deep('k11b.stack', [['Worked: def f(n): return 1 if n == 0 else n * f(n − 1). f(3) waits on f(2), which waits on f(1), then f(0). Answers return in reverse: 1, 1, 2, 6.', 'مثال محلول: f(3) تنتظر f(2) ثم f(1) ثم f(0)، وترجع الأجوبة بالعكس: ١، ١، ٢، ٦.']], [
    function (r) { var k = r.int(3, 6), a = 1; for (var i = 2; i <= k; i++) a *= i; return n(['Factorial: what is returned?', 'المضروب: ما الناتج؟'], 'f(' + k + ')', a); },
    function (r) { var k = r.int(3, 9); return n(['Deepest number of calls on the stack.', 'أقصى عدد للاستدعاءات في المكدس.'], 'f(' + k + ') down to f(0)', k + 1); },
    [['Recursion with no base case causes:', 'الاستدعاء الذاتي بلا حالة أساس يسبب:'], ['Stack overflow', 'فيضان المكدس'], ['A faster program', 'برنامجًا أسرع'], ['A syntax error always', 'خطأ نحويًا دائمًا']]
  ]);
  deep('k11b.hash', [['Worked: with 10 slots and hash = key mod 10, key 47 goes in slot 7. Key 27 also wants 7: a collision. Chaining keeps a short list in each slot.', 'مثال محلول: ١٠ خانات والتجزئة باقي القسمة على ١٠: المفتاح ٤٧ في الخانة ٧. و٢٧ يريدها أيضًا: تصادم. والربط يبقي قائمة قصيرة في كل خانة.']], [
    function (r) { var k = r.int(11, 199), s = r.pick([7, 10, 13]); return n(['Which slot?', 'أي خانة؟'], k + ' mod ' + s, k % s); },
    [['Average lookup in a good hash table is:', 'متوسط البحث في جدول جيد:'], ['O(1)', 'O(1)'], ['O(n²)', 'O(n²)'], ['O(n log n)', 'O(n log n)']]
  ]);
  deep('k11b.net', null, [
    [['Which layer resends lost data?', 'أي طبقة تعيد إرسال المفقود؟'], ['TCP', 'TCP'], ['IP', 'IP'], ['HTTP', 'HTTP']],
    function () { return n(['How many bits in an IPv4 address?', 'كم بت في عنوان IPv4؟'], '', 32); },
    [['Video calls often prefer UDP because:', 'تفضل مكالمات الفيديو UDP لأن:'], ['A late packet is useless anyway', 'الحزمة المتأخرة لا فائدة منها'], ['It encrypts better', 'يشفر أفضل'], ['It is always reliable', 'موثوق دائمًا']]
  ]);
  deep('k12b.concurrency', null, [
    [['Two threads each add 1 to x at once. x may rise by only 1. This is a:', 'خيطان يضيفان ١ معًا وقد تزيد مرة واحدة. هذا:'], ['Race condition', 'سباق بيانات'], ['Base case', 'حالة أساس'], ['Hash collision', 'تصادم تجزئة']],
    [['A lock prevents this by:', 'يمنع القفل ذلك بـ:'], ['Letting one thread in at a time', 'إدخال خيط واحد كل مرة'], ['Speeding all threads', 'تسريع الخيوط'], ['Deleting x', 'حذف x']]
  ]);
  deep('k12b.oop2', null, [
    [['A function named doStuff() that also saves files is:', 'دالة doStuff() تحفظ الملفات أيضًا:'], ['Badly named and doing too much', 'سيئة الاسم وتفعل الكثير'], ['Well designed', 'جيدة التصميم'], ['Faster', 'أسرع']],
    [['Why are small functions easier to test?', 'لماذا الدوال الصغيرة أسهل اختبارًا؟'], ['Each has one clear job', 'لكل منها وظيفة واضحة'], ['They run on any phone', 'تعمل على أي هاتف'], ['They need no input', 'لا تحتاج مدخلات']]
  ]);
  deep('k12b.security', null, [
    [['The best defence against injection is:', 'أفضل دفاع ضد الحقن:'], ['Parameterised queries', 'الاستعلامات ذات المعاملات'], ['A longer URL', 'رابط أطول'], ['Hiding the button', 'إخفاء الزر']],
    [['Passwords should be stored as:', 'تُخزن كلمات السر:'], ['Salted hashes', 'تجزئات مملحة'], ['Plain text', 'نصًا صريحًا'], ['Reversed text', 'نصًا معكوسًا']],
    [['Testing someone’s system without permission is:', 'اختبار نظام غيرك بلا إذن:'], ['Wrong, and often illegal', 'خطأ وغالبًا مخالف للقانون'], ['Fine if you are curious', 'جائز للفضول'], ['Fine if you delete nothing', 'جائز إن لم تحذف شيئًا']]
  ]);
  deep('ai12.vec', [['Worked: the dot product measures how alike two vectors are. (1, 2)·(3, 4) = 3 + 8 = 11. Words with similar meanings end up with vectors pointing the same way.', 'مثال محلول: الضرب النقطي يقيس تشابه متجهين: (1, 2)·(3, 4) = ١١. والكلمات المتقاربة تتجه متجهاتها معًا.']], [
    function (r) { var a = r.int(1, 6), b = r.int(1, 6), c = r.int(1, 6), d = r.int(1, 6); return n(['Dot product.', 'الضرب النقطي.'], '(' + a + ', ' + b + ') · (' + c + ', ' + d + ')', a * c + b * d); },
    [['If a dot product is zero, the vectors are:', 'إذا كان الناتج صفرًا فالمتجهان:'], ['At right angles', 'متعامدان'], ['Identical', 'متطابقان'], ['Opposite', 'متعاكسان']]
  ]);
  deep('ai12.ethics', null, [
    [['A hiring model learned from biased past decisions will likely:', 'نموذج توظيف تعلم من قرارات متحيزة غالبًا:'], ['Repeat that bias', 'يكرر التحيز'], ['Remove it', 'يزيله'], ['Ignore the data', 'يتجاهل البيانات']],
    [['Who answers for an AI system’s harm?', 'من يُسأل عن ضرر النظام؟'], ['The people who built and deployed it', 'من بناه واستعمله'], ['Nobody', 'لا أحد'], ['The machine', 'الآلة']]
  ]);
  deep('cs13.os', [['Worked: a half adder takes bits A and B. Sum = A XOR B, carry = A AND B. 1 + 1 gives sum 0, carry 1, which is binary 10.', 'مثال محلول: نصف الجامع: المجموع = A XOR B والحمل = A AND B. ١ + ١ يعطي مجموع ٠ وحمل ١.']], [
    function (r) { var a = r.int(0, 1), b = r.int(0, 1); return n(['Output of XOR.', 'خرج XOR.'], a + ' XOR ' + b, a ^ b); },
    function (r) { var a = r.int(0, 1), b = r.int(0, 1); return n(['Output of AND.', 'خرج AND.'], a + ' AND ' + b, a & b); },
    [['The operating system’s scheduler decides:', 'يقرر مجدول نظام التشغيل:'], ['Which program runs next', 'أي برنامج يعمل تاليًا'], ['Screen colours', 'ألوان الشاشة'], ['File names', 'أسماء الملفات']]
  ]);
  deep('cs13.dp', [['Worked: Fibonacci by plain recursion recalculates the same values exponentially. Save each answer once and it takes n steps. Try f(5): 1, 1, 2, 3, 5.', 'مثال محلول: فيبوناتشي بالاستدعاء يكرر الحساب أسيًا، وبحفظ الأجوبة يصبح ن خطوات. f(5) = ٥.']], [
    function (r) { var k = r.int(5, 12), a = 1, b = 1; for (var i = 3; i <= k; i++) { var t = a + b; a = b; b = t; } return n(['f(1) = f(2) = 1. Find it.', 'f(1) = f(2) = 1. احسبها.'], 'f(' + k + ')', b); },
    function (r) { var a = r.int(2, 5), b = r.int(2, 5); return n(['Grid paths moving only right and down: count them.', 'مسارات الشبكة يمينًا وأسفل: عدّها.'], a + ' right, ' + b + ' down', (function () { var f = function (x) { return x <= 1 ? 1 : x * f(x - 1); }; return f(a + b) / f(a) / f(b); })()); }
  ]);
  deep('cs13.pnp', null, [
    [['The halting problem shows some questions are:', 'مشكلة التوقف تبين أن بعض الأسئلة:'], ['Impossible for any program', 'مستحيلة على أي برنامج'], ['Only slow', 'بطيئة فقط'], ['Only for quantum computers', 'للحاسوب الكمي فقط']],
    [['NP problems have answers that are:', 'مسائل NP أجوبتها:'], ['Quick to check', 'سريعة التحقق'], ['Always quick to find', 'سريعة الإيجاد دائمًا'], ['Impossible to check', 'يستحيل التحقق منها']]
  ]);
  deep('ai13.loss', [['Worked: mean squared error. Predictions 3 and 5, truths 1 and 5. Errors 2 and 0, squares 4 and 0, mean 2.', 'مثال محلول: متوسط مربع الخطأ. تنبؤات ٣ و٥ وحقائق ١ و٥. الأخطاء ٢ و٠ ومربعاتها ٤ و٠ والمتوسط ٢.']], [
    function (r) { var a = r.pick([2, 4, 6]), b = r.pick([2, 4, 6]); return n(['Mean squared error.', 'متوسط مربع الخطأ.'], 'errors ' + a + ' and ' + b, (a * a + b * b) / 2); },
    [['Regularisation helps by:', 'يفيد التنظيم بـ:'], ['Penalising needless complexity', 'معاقبة التعقيد الزائد'], ['Adding more bugs', 'زيادة الأخطاء'], ['Hiding the test set', 'إخفاء الاختبار']]
  ]);
  deep('ai13.prob', [['Worked: Bayes. A disease affects 1%. A test catches 90% and false-alarms on 10%. Of 1,000 people: 9 true positives, 99 false positives. A positive means only about 8%.', 'مثال محلول: بايز. مرض يصيب ١٪، والاختبار يكشف ٩٠٪ ويخطئ في ١٠٪. من ١٠٠٠: ٩ إيجابيات حقيقية و٩٩ كاذبة، فالإيجابي يعني نحو ٨٪ فقط.']], [
    function (r) { var t = r.pick([9, 18, 27]), f = t * r.pick([1, 3, 9]); return n(['Chance a positive is real, %.', 'احتمال صدق الإيجابي ٪.'], t + ' true, ' + f + ' false', Math.round(t / (t + f) * 100)); },
    [['A language model picks each next word by:', 'يختار النموذج اللغوي الكلمة التالية بـ:'], ['Probabilities learned from text', 'احتمالات من النصوص'], ['Understanding like a person', 'الفهم كالبشر'], ['A list of facts', 'قائمة حقائق']]
  ]);
  deep('ai13.cnn', null, [
    [['A convolution finds patterns by:', 'الالتفاف يجد الأنماط بـ:'], ['Sliding a small filter over the image', 'تمرير مرشح صغير على الصورة'], ['Sorting pixels', 'ترتيب البكسلات'], ['Reading file names', 'قراءة أسماء الملفات']],
    function (r) { var w = r.pick([28, 64, 128]), c = r.pick([1, 3]); return n(['Numbers in this image.', 'عدد الأرقام في هذه الصورة.'], w + ' × ' + w + ' × ' + c, w * w * c); }
  ]);
  deep('ai13.safe', null, [
    [['Sharing a deepfake of a person, without checking, risks:', 'نشر تزييف عميق بلا تثبت يعرّض لـ:'], ['False witness and harm', 'شهادة الزور والأذى'], ['Better accuracy', 'دقة أفضل'], ['Nothing', 'لا شيء']],
    [['A model is unfair to a group. First check:', 'النموذج مجحف بفئة. افحص أولًا:'], ['Whether the data represents them', 'هل تمثلهم البيانات'], ['The screen size', 'حجم الشاشة'], ['The font', 'الخط']]
  ]);
  deep('ai14.transformer', null, [
    [['Attention lets each word:', 'يتيح الانتباه لكل كلمة:'], ['Weigh every other word', 'أن تزن كل الكلمات'], ['Delete others', 'حذف غيرها'], ['Run in sequence only', 'العمل تسلسليًا فقط']],
    function (r) { var k = r.pick([10, 20, 50]); return n(['Attention scores, one for each pair.', 'درجات الانتباه لكل زوج.'], k + ' words', k * k); },
    [['Why does a model need positional information?', 'لماذا يحتاج النموذج معلومة الموقع؟'], ['Attention alone ignores word order', 'الانتباه وحده يتجاهل الترتيب'], ['To save battery', 'لتوفير البطارية'], ['To read images only', 'لقراءة الصور فقط']]
  ]);
  deep('ai14.rl', null, [
    [['A badly chosen reward makes an agent:', 'مكافأة سيئة تجعل العميل:'], ['Exploit it, not do the real goal', 'يستغلها دون الهدف الحقيقي'], ['Refuse to act', 'يرفض العمل'], ['Become slower', 'أبطأ']],
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return n(['Total reward with no discount.', 'مجموع المكافأة بلا خصم.'], a + ', then ' + b + ', then 1', a + b + 1); }
  ]);

  /* ---------- engineering ---------- */
  deep('en9b.resistors', [['Worked: 12 V across 2 kΩ then 4 kΩ in series. The lower resistor takes 12 × 4 ÷ 6 = 8 V. That is a potential divider, in every sensor circuit.', 'مثال محلول: ١٢ فولت عبر ٢ ك.أوم ثم ٤ ك.أوم. تأخذ السفلى ١٢ × ٤ ÷ ٦ = ٨ فولت. وهذا مقسم الجهد في كل دائرة حساس.']], [
    function (r) { var a = r.int(1, 4), b = r.int(1, 4), k = r.int(1, 4); return n(['Voltage across the second resistor.', 'الجهد على المقاومة الثانية.'], ((a + b) * k) + ' V, ' + a + ' kΩ then ' + b + ' kΩ', b * k); },
    function (r) { var R = r.pick([4, 6, 10, 20]); return n(['Two equal resistors in parallel, total Ω.', 'مقاومتان متساويتان توازيًا.'], R + ' Ω ∥ ' + R + ' Ω', R / 2); }
  ]);
  deep('en9.print', null, [
    [['What is the point of a cardboard prototype?', 'ما فائدة نموذج من الكرتون؟'], ['To answer one question cheaply', 'الإجابة عن سؤال واحد برخص'], ['To be sold', 'للبيع'], ['To look perfect', 'ليبدو كاملًا']],
    [['After a test fails, a good engineer:', 'بعد فشل الاختبار يقوم المهندس الجيد بـ:'], ['Changes one thing and tests again', 'تغيير شيء واحد والاختبار'], ['Hides the result', 'إخفاء النتيجة'], ['Gives up', 'الاستسلام']]
  ]);
  deep('en10.stress', [['Worked: a rod of 100 mm² carries 5,000 N: stress = 50 N/mm². With a strength of 200 N/mm², the safety factor is 200 ÷ 50 = 4.', 'مثال محلول: قضيب مساحته ١٠٠ مم² يحمل ٥٠٠٠ نيوتن: الإجهاد ٥٠. وبمقاومة ٢٠٠ يكون عامل الأمان ٤.']], [
    function (r) { var a = r.pick([10, 20, 50, 100]), s = r.int(5, 40); return n(['Stress in N/mm².', 'الإجهاد نيوتن/مم².'], (a * s) + ' N on ' + a + ' mm²', s); },
    function (r) { var w = r.int(10, 60), k = r.int(2, 5); return n(['Safety factor.', 'عامل الأمان.'], 'strength ' + (w * k) + ', working stress ' + w, k); },
    [['Why design far below breaking stress?', 'لماذا التصميم أدنى كثيرًا من إجهاد الكسر؟'], ['Loads, flaws and wear are uncertain', 'الأحمال والعيوب والتآكل غير مؤكدة'], ['It looks better', 'أجمل مظهرًا'], ['It costs less', 'أقل كلفة']]
  ]);
  deep('en10.mat', null, [
    [['For an aircraft wing, the key measure is:', 'لجناح الطائرة أهم مقياس:'], ['Strength for its weight', 'القوة نسبة للوزن'], ['Colour', 'اللون'], ['Melting point only', 'نقطة الانصهار فقط']],
    function (r) { var d = r.pick([2, 3, 8]), v = r.int(2, 9); return n(['Mass in kg (density in kg per litre).', 'الكتلة كغ (الكثافة كغ/لتر).'], v + ' L at density ' + d, v * d); }
  ]);
  deep('en11.thermo', [['Worked: a heat engine takes 1,000 J and rejects 600 J. Work out = 400 J, efficiency 40%. Carnot’s limit between 300 K and 600 K is 1 − 300/600 = 50%.', 'مثال محلول: محرك يأخذ ١٠٠٠ جول ويطرد ٦٠٠. الشغل ٤٠٠ والكفاءة ٤٠٪. وحد كارنو بين ٣٠٠ و٦٠٠ كلفن هو ٥٠٪.']], [
    function (r) { var i = r.pick([500, 1000, 2000]), p = r.pick([20, 30, 40]); return n(['Work out in joules.', 'الشغل الناتج جول.'], i + ' J in, ' + (i * (100 - p) / 100) + ' J rejected', i * p / 100); },
    function (r) { var c = r.pick([300, 400]), k = r.pick([2, 4]); return n(['Carnot limit, %.', 'حد كارنو ٪.'], 'cold ' + c + ' K, hot ' + (c * k) + ' K', (1 - 1 / k) * 100); }
  ]);
  deep('en11.fluid', [['Worked: flow = area × speed. Water in a pipe narrowing from 4 cm² to 2 cm² doubles its speed. Bernoulli: where it speeds up, pressure falls.', 'مثال محلول: التدفق = المساحة × السرعة. إذا ضاق الأنبوب من ٤ إلى ٢ سم² تضاعفت السرعة، وعندها يقل الضغط.']], [
    function (r) { var a = r.pick([2, 3, 4, 6]), v = r.int(2, 9), k = r.pick([2, 3]); return n(['Speed in the narrow part, m/s.', 'السرعة في الجزء الضيق.'], 'area ' + (a * k) + ' to ' + a + ', speed ' + v + ' m/s', v * k); },
    [['A wing produces lift mainly by:', 'يولد الجناح الرفع أساسًا بـ:'], ['Deflecting air downward', 'حرف الهواء لأسفل'], ['Being very light', 'خفته'], ['Pushing air upward', 'دفع الهواء لأعلى']]
  ]);
  deep('en11.ac', [['Worked: send 100 kW at 1,000 V: I = 100 A, and on a 1 Ω line, loss = I²R = 10,000 W. At 10,000 V: I = 10 A, loss = 100 W. A hundred times less.', 'مثال محلول: نقل ١٠٠ ك.واط عند ١٠٠٠ فولت: ت = ١٠٠ أمبير والفقد ١٠٠٠٠ واط. وعند ١٠٠٠٠ فولت: ١٠ أمبير والفقد ١٠٠ واط.']], [
    function (r) { var i = r.int(2, 20), R = r.int(1, 5); return n(['Power lost in watts.', 'القدرة المفقودة واط.'], i + ' A through ' + R + ' Ω', i * i * R); },
    function (r) { var k = r.pick([2, 5, 10]); return n(['Line loss is divided by?', 'يقسم الفقد على؟'], 'voltage × ' + k + ' (same power)', k * k); }
  ]);
  deep('en11.logicgates', null, [
    function (r) { var a = r.int(0, 1), b = r.int(0, 1); return n(['Output of NAND.', 'خرج NAND.'], a + ' NAND ' + b, (a & b) ? 0 : 1); },
    function (r) { var a = r.int(0, 1), b = r.int(0, 1); return n(['Output of OR.', 'خرج OR.'], a + ' OR ' + b, a | b); },
    [['Why is NAND important?', 'لماذا NAND مهمة؟'], ['Any logic can be built from it', 'تُبنى منها أي دائرة منطقية'], ['It uses no power', 'لا تستهلك طاقة'], ['It is analogue', 'تناظرية']]
  ]);
  deep('en11b.units', [['Worked: 72 km/h in m/s: 72 × 1000 ÷ 3600 = 20 m/s. Write the units on every line, and a wrong formula shows itself.', 'مثال محلول: ٧٢ كم/س = ٧٢ × ١٠٠٠ ÷ ٣٦٠٠ = ٢٠ م/ث. اكتب الوحدات في كل سطر فيظهر الخطأ.']], [
    function (r) { var v = r.int(1, 12) * 18; return n(['In m/s.', 'بوحدة م/ث.'], v + ' km/h', v / 3.6); },
    function (r) { var k = r.int(2, 9); return n(['In mm².', 'بالمليمتر المربع.'], k + ' cm²', k * 100); },
    function (r) { var k = r.int(2, 9); return n(['In pascals, thousands.', 'بآلاف الباسكال.'], k + ' kPa = ? × 1000 Pa', k); }
  ]);
  deep('en11b.beams', [['Worked: bending stiffness of a rectangle grows with width × depth³. Double the depth: 8 times stiffer. Double the width: only 2 times. That is why joists stand on edge.', 'مثال محلول: جساءة الانحناء تنمو مع العرض × العمق³. ضعف العمق ٨ مرات أجسأ، وضعف العرض مرتان فقط.']], [
    function (r) { var k = r.pick([2, 3, 4]); return n(['How many times stiffer?', 'كم مرة أجسأ؟'], 'depth × ' + k, k * k * k); },
    function (r) { var k = r.pick([2, 3, 4]); return n(['How many times stiffer?', 'كم مرة أجسأ؟'], 'width × ' + k, k); },
    function (r) { var f = r.int(2, 9) * 10, d = r.int(2, 6); return n(['Bending moment at a cantilever’s root, N m.', 'عزم الانحناء عند جذر الكابولي.'], f + ' N at ' + d + ' m', f * d); }
  ]);
  deep('en11b.materials2', null, [
    [['Why did early Comet jets break up?', 'لماذا تحطمت طائرات كوميت الأولى؟'], ['Fatigue cracks at window corners', 'شقوق كلال عند زوايا النوافذ'], ['Too little fuel', 'قلة الوقود'], ['Lightning', 'البرق']],
    [['Rounded corners help because they:', 'الزوايا الدائرية تفيد لأنها:'], ['Reduce stress concentration', 'تقلل تركز الإجهاد'], ['Look better', 'أجمل'], ['Weigh more', 'أثقل']]
  ]);
  deep('en11b.ethics', null, [
    [['You find a safety flaw and your manager says ship it. You should:', 'وجدت عيب أمان وقال مديرك: سلّم. عليك:'], ['Raise it in writing and refuse to sign off', 'توثيقه كتابيًا ورفض الاعتماد'], ['Say nothing', 'السكوت'], ['Quietly delete the report', 'حذف التقرير سرًا']],
    [['The engineer’s amānah is first owed to:', 'أمانة المهندس أولًا تجاه:'], ['The safety of the public', 'سلامة الناس'], ['The cheapest design', 'أرخص تصميم'], ['Their own credit', 'سمعته']]
  ]);
  deep('en12.signal', [['Worked: to capture a tone without distortion, sample at more than twice its frequency. Human hearing reaches about 20 kHz, hence audio at 44.1 kHz.', 'مثال محلول: لالتقاط نغمة بلا تشويه خذ عينات بأكثر من ضعف ترددها. والسمع نحو ٢٠ ك.هرتز، ومن هنا ٤٤٫١ ك.هرتز.']], [
    function (r) { var f = r.pick([5, 10, 20, 50]); return n(['Minimum sample rate in kHz.', 'أدنى معدل عينات ك.هرتز.'], 'signal up to ' + f + ' kHz', 2 * f); },
    [['Sampling too slowly causes:', 'أخذ العينات ببطء يسبب:'], ['Aliasing', 'التعرج'], ['Louder sound', 'صوتًا أعلى'], ['Lower battery', 'ضعف البطارية']]
  ]);
  deep('en12b.aero', [['Worked: the rocket equation Δv = vₑ ln(m₀/m₁). Reaching orbit needs about 9 km/s, so a rocket is about 90% propellant, and stages drop dead weight.', 'مثال محلول: معادلة الصاروخ. بلوغ المدار يحتاج نحو ٩ كم/ث، فالصاروخ نحو ٩٠٪ وقود، وتُسقط المراحل الكتلة الميتة.']], [
    function (r) { var m = r.pick([100, 200, 500]), p = r.pick([80, 90]); return n(['Mass that is not propellant, in tonnes.', 'الكتلة غير الوقود بالطن.'], m + ' t, ' + p + '% propellant', m * (100 - p) / 100); },
    [['In steady level flight, lift equals:', 'في الطيران الأفقي المستقر يساوي الرفع:'], ['Weight', 'الوزن'], ['Drag', 'السحب'], ['Thrust', 'الدفع']]
  ]);
  deep('en12b.civil', null, [
    function (r) { var a = r.int(2, 9), b = r.int(2, 9), k = r.int(1, 5); return n(['Pressure on the soil, in kPa.', 'الضغط على التربة كيلوباسكال.'], (a * b * k) + ' kN on ' + a + ' m × ' + b + ' m', k); },
    [['Why do tall masjids need deep foundations on soft soil?', 'لماذا تحتاج المساجد العالية أساسات عميقة في التربة اللينة؟'], ['To reach material that can carry the load', 'للوصول إلى ما يحمل الحمل'], ['To add rooms', 'لإضافة غرف'], ['For acoustics', 'للصوتيات']]
  ]);
  deep('en12b.chem', null, [
    [['Scaling up a reaction is hard mainly because:', 'توسيع التفاعل صعب أساسًا لأن:'], ['Volume grows faster than surface, so heat is trapped', 'ينمو الحجم أسرع من السطح فتُحبس الحرارة'], ['Atoms change', 'تتغير الذرات'], ['Equations fail', 'تفشل المعادلات']],
    function (r) { var a = r.int(20, 80), b = r.int(5, 15); return n(['Mass out per hour, in kg (steady state).', 'الكتلة الخارجة بالساعة (حالة مستقرة).'], a + ' + ' + b + ' kg/h in', a + b); }
  ]);
  deep('en12b.bio', null, [
    [['A heart valve’s material must above all be:', 'مادة صمام القلب يجب قبل كل شيء أن تكون:'], ['Biocompatible and fatigue resistant', 'متوافقة حيويًا ومقاومة للكلال'], ['Brightly coloured', 'زاهية'], ['Very cheap', 'رخيصة جدًا']],
    function (r) { var b = r.int(60, 90); return n(['Heartbeats in an hour.', 'نبضات في الساعة.'], b + ' per minute', b * 60); }
  ]);
})();
