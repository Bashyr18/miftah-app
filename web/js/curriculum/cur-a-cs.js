/* New computing, AI and engineering, Years 12 to 14: A level computer science topics, then what a first-year engineer and programmer actually use. */
(function () {
  'use strict';
  var C = window.C, U = C.yunit, Topic = C.topic, P = C.padQ, X = C.exprQ;
  var OUT = ['What does it print?', 'ماذا يطبع؟'];
  function modpow(b, e, m) { var r = 1; for (var i = 0; i < e; i++) r = r * b % m; return r; }

  /* ---------- computing, Year 12 ---------- */
  U('computing', 'a12k', ['A level computer science', 'علوم الحاسوب المتقدمة'], 4, 12);
  Topic('a12k.asm', ['Assembly and the fetch-execute cycle', 'لغة التجميع ودورة الجلب والتنفيذ'], 'gear', [['A CPU repeats: fetch an instruction, decode it, execute it. LOAD 5, ADD 3, STORE puts 8 in memory. Every program you have written ends up like this. The program counter points to the next instruction.', 'يكرر المعالج: جلب فتحليل فتنفيذ. LOAD 5 ثم ADD 3 ثم STORE تضع ٨ في الذاكرة. وعداد البرنامج يشير إلى التعليمة التالية.']], [
    function (r) { var a = r.int(2, 30), b = r.int(2, 30), c = r.int(1, 9); return P(['What is in the accumulator?', 'ما في المراكم؟'], 'LOAD ' + a + '; ADD ' + b + '; ADD ' + c, a + b + c); },
    function (r) { var a = r.int(20, 40), b = r.int(2, 19); return P(['What is in the accumulator?', 'ما في المراكم؟'], 'LOAD ' + a + '; SUB ' + b, a - b); },
    [['Which register holds the next instruction’s address?', 'أي سجل يحمل عنوان التعليمة التالية؟'], ['The program counter', 'عداد البرنامج'], ['The accumulator', 'المراكم'], ['The stack', 'المكدس']]
  ]);
  Topic('a12k.bool', ['Boolean algebra', 'الجبر البولي'], 'bulb', [['De Morgan: NOT(A AND B) = (NOT A) OR (NOT B). NOT(A OR B) = (NOT A) AND (NOT B). Simplifying a condition saves bugs, and simplifying a circuit saves chips.', 'دي مورجان: NOT(A AND B) = (NOT A) OR (NOT B). وتبسيط الشرط يقلل الأخطاء، وتبسيط الدائرة يقلل الرقائق.']], [
    function (r) { var a = r.int(0, 1), b = r.int(0, 1); return P(['Output.', 'الخرج.'], 'NOT(' + a + ' AND ' + b + ')', (a & b) ? 0 : 1); },
    function (r) { var a = r.int(0, 1), b = r.int(0, 1); return P(['Output.', 'الخرج.'], '(NOT ' + a + ') AND (NOT ' + b + ')', (!a && !b) ? 1 : 0); },
    [['NOT(x > 5 and y < 2) equals:', 'NOT(x > 5 and y < 2) تساوي:'], ['x <= 5 or y >= 2', 'x <= 5 or y >= 2'], ['x <= 5 and y >= 2', 'x <= 5 and y >= 2'], ['x > 5 or y < 2', 'x > 5 or y < 2']],
    function (r) { var n = r.int(2, 6); return P(['Rows in the truth table.', 'صفوف جدول الحقيقة.'], n + ' inputs', Math.pow(2, n)); }
  ]);
  Topic('a12k.fsm', ['Finite state machines', 'الآلات محدودة الحالات'], 'path', [['A machine is in one state at a time, and each input moves it along an arrow. A turnstile has two states: locked and open. A coin opens it, and a push locks it. Validators and game characters work like this.', 'للآلة حالة واحدة كل مرة، وكل مدخل ينقلها. وللبوابة حالتان: مغلقة ومفتوحة.']], [
    [['Turnstile locked; coin, push, push. It ends:', 'البوابة مغلقة؛ عملة، دفع، دفع. تنتهي:'], ['Locked', 'مغلقة'], ['Open', 'مفتوحة'], ['Broken', 'معطلة']],
    function (r) { var n = r.int(2, 9); return P(['How many states are active at once?', 'كم حالة نشطة معًا؟'], n + '-state machine', 1); },
    [['A good use of a state machine is:', 'استعمال جيد لها:'], ['Checking if a text is a valid number', 'فحص صحة عدد في نص'], ['Sorting a million items', 'ترتيب مليون عنصر'], ['Storing photos', 'حفظ الصور']]
  ]);
  Topic('a12k.compile', ['Compilers and interpreters', 'المترجمات والمفسرات'], 'gear', [['A compiler turns the whole program into machine code before it runs. An interpreter runs it line by line. Stages: lexing, parsing, code generation, optimisation. Python is usually interpreted, and C compiled.', 'المترجم يحول البرنامج كله قبل التشغيل، والمفسر يعمل سطرًا سطرًا. والمراحل: تحليل لفظي فنحوي فتوليد فتحسين.']], [
    [['Which turns text into tokens first?', 'أي مرحلة تحول النص إلى رموز أولًا؟'], ['The lexer', 'المحلل اللفظي'], ['The linker', 'الرابط'], ['The optimiser', 'المحسن']],
    [['A compiled program usually:', 'البرنامج المترجم غالبًا:'], ['Runs faster', 'أسرع تشغيلًا'], ['Needs the source to run', 'يحتاج المصدر'], ['Cannot have bugs', 'بلا أخطاء']]
  ]);
  Topic('a12k.crypto', ['Encryption', 'التشفير'], 'lock', [['Symmetric: one shared key, and fast. Public key: a pair, one to lock and one to unlock, so strangers can talk safely. Al-Kindī wrote on breaking ciphers by letter frequency, over a thousand years ago.', 'المتماثل بمفتاح واحد سريع. والعمومي بمفتاحين يتيح للغرباء الحديث بأمان. وكتب الكندي عن كسر الشيفرات بتكرار الحروف قبل ألف سنة.']], [
    function (r) { var s = r.int(1, 9), i = r.int(0, 15); return P(['Caesar shift: letter number after the shift (A = 0).', 'رقم الحرف بعد الإزاحة.'], 'letter ' + i + ', shift ' + s, i + s); },
    function (r) { var b = r.pick([8, 16, 32, 64]); return P(['Keys to try, as a power of 2: the exponent.', 'الأس في عدد المفاتيح.'], b + '-bit key', b); },
    [['In public key messaging, you encrypt with:', 'في العمومي تشفر بـ:'], ['Their public key', 'مفتاحهم العام'], ['Their private key', 'مفتاحهم الخاص'], ['Your password', 'كلمة سرك']],
    [['Who wrote early on frequency analysis?', 'من كتب مبكرًا في تحليل التكرار؟'], ['Al-Kindī', 'الكندي'], ['Newton', 'نيوتن'], ['Turing', 'تورنج']]
  ]);
  Topic('a12k.norm', ['Normalising a database', 'تطبيع قاعدة البيانات'], 'box', [['Store each fact once. First normal form: single values and no repeating groups. Second: every field depends on the whole key. Third: no field depends on another non-key field. Then updates cannot contradict each other.', 'خزن كل معلومة مرة. الأولى: قيم مفردة. الثانية: الاعتماد على المفتاح كله. الثالثة: لا اعتماد على حقل غير مفتاحي.']], [
    [['Why normalise?', 'لماذا التطبيع؟'], ['To avoid duplicated, contradictory data', 'لتجنب تكرار البيانات وتناقضها'], ['To use more space', 'لاستهلاك مساحة أكثر'], ['To remove all keys', 'لإزالة المفاتيح']],
    function (r) { var s = r.int(10, 40), k = r.int(2, 5); return P(['Rows in the link table.', 'صفوف جدول الربط.'], s + ' students, each in ' + k + ' classes', s * k); }
  ]);
  Topic('a12k.oop', ['Inheritance and polymorphism', 'الوراثة وتعدد الأشكال'], 'plant', [['A class Shape has area(). Circle and Square inherit, and each answers area() in its own way. Calling code need not care which it holds. Prefer simple composition when the “is a” is doubtful.', 'للصنف Shape دالة area(). يرث Circle وSquare ولكل طريقته. والكود المستدعي لا يبالي أيهما.']], [
    [['Polymorphism means the same call:', 'تعدد الأشكال يعني أن الاستدعاء نفسه:'], ['Does the right thing for each type', 'يفعل المناسب لكل نوع'], ['Always crashes', 'ينهار دائمًا'], ['Runs twice', 'يعمل مرتين']],
    function (r) { var a = r.int(2, 9), b = r.int(2, 9); return P(OUT, 'class S: def area(self): return ' + a + ' * ' + b + '; print(S().area())', a * b); }
  ]);
  Topic('a12k.bst', ['Binary search trees', 'أشجار البحث الثنائية'], 'tree', [['Left child smaller, right child larger. Search halves the tree at each step if it stays balanced, so log₂ n. Insert sorted data with no balancing, and it collapses into a list. In-order traversal gives sorted output.', 'الابن الأيسر أصغر والأيمن أكبر. البحث log₂ n إذا توازنت. والترتيب المسبق يحولها إلى قائمة.']], [
    function (r) { var k = r.int(3, 20); return P(['Comparisons in a balanced tree, about.', 'المقارنات تقريبًا.'], (Math.pow(2, k) - 1) + ' nodes', k); },
    function (r) { var n = r.int(5, 50); return P(['Comparisons in the worst case, unbalanced.', 'أسوأ حالة بلا توازن.'], n + ' nodes inserted in order', n); },
    [['In-order traversal of a BST gives:', 'الاجتياز المرتب يعطي:'], ['Sorted values', 'قيمًا مرتبة'], ['Random values', 'عشوائية'], ['Only leaves', 'الأوراق فقط']]
  ]);
  Topic('a12k.graphs', ['Breadth-first and depth-first search', 'البحث بالعرض والعمق'], 'compass', [['BFS uses a queue, and explores level by level, so it finds a shortest path in steps. DFS uses a stack, or recursion, and dives deep first. Dijkstra extends BFS to weighted edges with a priority queue.', 'البحث بالعرض يستعمل طابورًا ويجد أقصر مسار بالخطوات. وبالعمق يستعمل مكدسًا. وديكسترا يعمم للحواف الموزونة.']], [
    [['Which finds fewest hops?', 'أيها يجد أقل قفزات؟'], ['BFS', 'البحث بالعرض'], ['DFS', 'البحث بالعمق'], ['Bubble sort', 'الفقاعات']],
    [['DFS typically uses:', 'البحث بالعمق يستعمل:'], ['A stack', 'مكدسًا'], ['A queue', 'طابورًا'], ['A hash only', 'تجزئة فقط']],
    function (r) { var a = r.int(1, 9), b = r.int(1, 9), c = r.int(1, 9); return P(['Shortest distance A to C.', 'أقصر مسافة من A إلى C.'], 'A–B ' + a + ', B–C ' + b + ', A–C ' + (a + b + c), a + b); }
  ]);
  Topic('a12k.float', ['Floating point in detail', 'الفاصلة العائمة بالتفصيل'], 'scale', [['A float stores mantissa and exponent, like scientific notation in binary. More mantissa bits give precision, and more exponent bits give range. 0.1 has no exact binary form, so money is kept in whole cents.', 'يخزن الرقم العائم مانتيسا وأسًا. بتات المانتيسا للدقة وبتات الأس للمدى. و٠٫١ لا تمثل بدقة، فالمال بالسنتات الصحيحة.']], [
    [['Why store money as whole cents?', 'لماذا يخزن المال بالسنتات؟'], ['Floats round decimal fractions', 'العائم يقرب الكسور'], ['It looks tidier', 'أنظف'], ['Banks forbid decimals', 'تمنعها البنوك']],
    function (r) { var m = r.int(1, 15), e = r.int(1, 4); return P(['Value of the mantissa × 2^exponent.', 'القيمة.'], m + ' × 2^' + e, m * Math.pow(2, e)); }
  ]);
  /* ---------- computing, Years 13 and 14 ---------- */
  U('computing', 'a13k', ['Systems, deeper', 'الأنظمة بعمق'], 4, 13);
  Topic('a13k.os', ['Memory, processes and paging', 'الذاكرة والعمليات والصفحات'], 'box', [['Each process sees its own virtual memory. The OS maps pages to RAM. A cache hit is about 100 times faster than RAM, and RAM is about 100,000 times faster than a disk. Fast programs respect this.', 'لكل عملية ذاكرة افتراضية. ويربط النظام الصفحات بالذاكرة. والمخبأ أسرع بمئة مرة من الذاكرة، والذاكرة أسرع بكثير من القرص.']], [
    function (r) { var m = r.pick([4, 8, 16, 32]), p = 4; return P(['How many pages?', 'كم صفحة؟'], m + ' KB in pages of ' + p + ' KB', m / p); },
    [['A context switch means the CPU:', 'تبديل السياق يعني أن المعالج:'], ['Saves one process, runs another', 'يحفظ عملية ويشغل أخرى'], ['Reboots', 'يعيد التشغيل'], ['Deletes memory', 'يمحو الذاكرة']]
  ]);
  Topic('a13k.dijk', ['Dijkstra and shortest paths', 'ديكسترا وأقصر المسارات'], 'worldmap', [['Keep the best known distance to each node. Repeatedly settle the nearest unsettled one, and improve its neighbours. It fails with negative edges. Your maps app runs a descendant of this.', 'احتفظ بأفضل مسافة لكل رأس. ثبت الأقرب وحسّن جيرانه. ويفشل مع الحواف السالبة.']], [
    function (r) { var a = r.int(1, 9), b = r.int(1, 9), c = r.int(1, 9), d = r.int(1, 9); return P(['Shortest distance A to D.', 'أقصر مسافة A إلى D.'], 'A–B ' + a + ', B–D ' + b + '; A–C ' + c + ', C–D ' + d, Math.min(a + b, c + d)); },
    [['Dijkstra can fail when edges are:', 'يفشل ديكسترا إذا كانت الحواف:'], ['Negative', 'سالبة'], ['Very long', 'طويلة جدًا'], ['Few', 'قليلة']]
  ]);
  Topic('a13k.linreg', ['Linear regression, by hand', 'الانحدار الخطي يدويًا'], 'ruler', [['Fit y = mx + c by minimising squared errors. With a mean x̄, ȳ: the line passes through (x̄, ȳ). This small model is still the first thing a careful data scientist tries.', 'نوفق y = mx + c بتقليل مربعات الأخطاء. ويمر الخط بالنقطة (x̄, ȳ).']], [
    function (r) { var m = r.int(1, 9), c = r.int(1, 9), x = r.int(1, 9); return P(['Prediction.', 'التنبؤ.'], 'y = ' + m + 'x + ' + c + '; x = ' + x, m * x + c); },
    function (r) { var e = r.int(1, 9), y = r.int(10, 40); return X(['Error, predicted − actual.', 'الخطأ.'], 'predicted ' + (y + e) + ', actual ' + y, e); },
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return P(['Sum of squared errors.', 'مجموع مربعات الأخطاء.'], 'errors ' + a + ', ' + b, a * a + b * b); }
  ]);
  U('computing', 'a14k', ['First-year computer science', 'حاسوب السنة الأولى'], 4, 14);
  Topic('a14k.rsa', ['RSA, step by step', 'خوارزمية RSA خطوة بخطوة'], 'lock', [['Pick primes p and q, and publish n = pq and e. Encrypt: c = mᵉ mod n. Decrypt with d, which needs p and q to find. Multiplying is easy, and factoring is hard. All your online banking rests on that gap.', 'اختر أوليين p وq وانشر n = pq وe. التشفير c = mᵉ mod n. والضرب سهل والتحليل صعب.']], [
    function (r) { var p = r.pick([3, 5, 7, 11]), q = r.pick([13, 17, 19]); return P(['n.', 'n.'], 'p = ' + p + ', q = ' + q, p * q); },
    function (r) { var p = r.pick([3, 5, 7, 11]), q = r.pick([13, 17, 19]); return P(['φ(n) = (p − 1)(q − 1).', 'φ(n).'], 'p = ' + p + ', q = ' + q, (p - 1) * (q - 1)); },
    function (r) { var m = r.int(2, 6), e = 3, n = r.pick([33, 35, 55]); return P(['c = m^e mod n.', 'c.'], m + '^' + e + ' mod ' + n, modpow(m, e, n)); }
  ]);
  Topic('a14k.dist', ['Distributed systems', 'الأنظمة الموزعة'], 'worldmap', [['Networks fail, so when two machines lose contact you must choose: stay available, or stay consistent. That is the CAP trade-off. Replication keeps copies, and a majority vote keeps agreement.', 'تفشل الشبكات، فعند الانقطاع تختار: الإتاحة أو التوافق. والنسخ يحفظ البيانات، والأغلبية تحفظ الاتفاق.']], [
    function (r) { var n = r.pick([3, 5, 7, 9]); return P(['Votes for a majority.', 'الأصوات للأغلبية.'], n + ' replicas', (n + 1) / 2); },
    function (r) { var n = r.pick([3, 5, 7, 9]); return P(['Machines that can fail while still reaching a majority.', 'الأجهزة التي يمكن أن تتعطل.'], n + ' replicas', (n - 1) / 2); },
    [['During a network split, a bank usually prefers:', 'عند الانقسام يفضل البنك:'], ['Consistency', 'التوافق'], ['Showing old balances', 'أرصدة قديمة'], ['Random answers', 'أجوبة عشوائية']]
  ]);
  Topic('a14k.team', ['Working on real codebases', 'العمل في مشاريع حقيقية'], 'wrench', [['Branch, change a little, test, get a review, merge. Read code before you write it. A clear commit message explains why. Most of a career is reading and changing what others wrote, honestly and carefully.', 'فرع وتغيير صغير واختبار ومراجعة ودمج. اقرأ قبل أن تكتب. ورسالة الإيداع تشرح السبب.']], [
    [['A good code review comment:', 'تعليق مراجعة جيد:'], ['Explains the risk and suggests a fix', 'يبين الخطر ويقترح حلًا'], ['Mocks the author', 'يسخر من الكاتب'], ['Says only “bad”', 'يقول "سيئ" فقط']],
    [['Before merging, you should:', 'قبل الدمج عليك:'], ['Run the tests', 'تشغيل الاختبارات'], ['Delete the tests', 'حذف الاختبارات'], ['Skip the review', 'ترك المراجعة']]
  ]);
  Topic('a14k.llm', ['Using AI to write code, responsibly', 'استعمال الذكاء الاصطناعي في البرمجة بمسؤولية'], 'brain', [['An AI assistant is fast, and it is sometimes wrong in convincing ways. Read every line, write tests, and never paste secrets. You answer for what you ship. Learn the fundamentals first, or you cannot judge its work.', 'المساعد سريع ويخطئ بإقناع أحيانًا. اقرأ كل سطر واكتب اختبارات ولا تلصق الأسرار. وأنت المسؤول عما تنشره.']], [
    [['AI wrote code that passes your one test. Next:', 'كتب الذكاء الاصطناعي كودًا نجح في اختبار واحد. التالي:'], ['Read it, and test the edge cases', 'قراءته واختبار الحالات الحدية'], ['Ship it now', 'نشره فورًا'], ['Assume it is right', 'افتراض صحته']],
    [['Pasting a company’s API key into a chat is:', 'لصق مفتاح الشركة في محادثة:'], ['A security failure', 'إخفاق أمني'], ['Fine', 'لا بأس'], ['Required', 'مطلوب']]
  ]);

  /* ---------- engineering, Years 13 and 14 ---------- */
  U('engineering', 'a13e', ['Engineering: machines and circuits', 'الهندسة: الآلات والدوائر'], 4, 13);
  Topic('a13e.gear', ['Gears and torque', 'التروس والعزم'], 'gear', [['Gear ratio = teeth driven ÷ teeth driving. A big gear turned by a small one turns slower, with more torque. Power stays the same, less losses. Al-Jazarī drew gear trains in 1206.', 'نسبة التروس = أسنان المدفوع ÷ الدافع. الكبير أبطأ وأقوى عزمًا. ورسم الجزري قطارات تروس سنة ١٢٠٦.']], [
    function (r) { var a = r.int(1, 5) * 10, k = r.int(2, 5); return P(['Gear ratio.', 'نسبة التروس.'], a + ' teeth drives ' + (a * k), k); },
    function (r) { var rpm = r.int(2, 9) * 100, k = r.pick([2, 4, 5]); return P(['Output speed, rpm.', 'سرعة الخرج.'], rpm * k + ' rpm in, ratio ' + k + ':1', rpm); },
    function (r) { var t = r.int(2, 20), k = r.int(2, 5); return P(['Output torque, N m (no losses).', 'عزم الخرج.'], t + ' N m in, ratio ' + k + ':1', t * k); }
  ]);
  Topic('a13e.opamp', ['Operational amplifiers', 'مكبرات العمليات'], 'plug', [['An op-amp compares two inputs, with huge gain. Add feedback and it behaves: an inverting amplifier has gain −Rf/Rin. Sensors, audio and control circuits rely on it.', 'يقارن مدخلين بكسب هائل. ومع التغذية الراجعة: كسب المكبر العاكس −Rf/Rin.']], [
    function (r) { var g = r.int(2, 20), R = r.int(1, 9); return X(['Gain.', 'الكسب.'], 'inverting, Rf = ' + (g * R) + ' kΩ, Rin = ' + R + ' kΩ', -g); },
    function (r) { var g = r.int(2, 10), v = r.int(1, 5); return X(['Output, in volts.', 'الخرج.'], 'gain −' + g + ', input ' + v + ' V', -g * v); }
  ]);
  Topic('a13e.vessel', ['Pressure vessels', 'أوعية الضغط'], 'drop', [['In a thin-walled cylinder, hoop stress = pr/t, twice the lengthwise stress. So a sausage splits along its length. Tanks, pipes and rockets are all sized with this line.', 'في الأسطوانة الرقيقة الإجهاد المحيطي = pr/t، ضعف الطولي. لذا تنشق النقانق طوليًا.']], [
    function (r) { var p = r.int(1, 9), R = r.int(1, 9) * 10, t = r.pick([1, 2, 5, 10]); return P(['Hoop stress, MPa (p in MPa, r and t in mm).', 'الإجهاد المحيطي.'], 'p = ' + p + ', r = ' + R + ', t = ' + t, p * R / t); },
    [['A cylinder fails first along its:', 'تفشل الأسطوانة أولًا على:'], ['Length', 'طولها'], ['End caps', 'طرفيها'], ['Base only', 'قاعدتها فقط']]
  ]);
  Topic('a13e.robot', ['Sensors, actuators and robots', 'الحساسات والمشغلات والروبوتات'], 'wrench', [['Sense, decide, act, repeat. Encoders count wheel turns, and noise makes every reading wrong by a little. So filter it, and calibrate. A robot arm’s reach comes from its link lengths and joint angles.', 'استشعر فقرر فنفذ وكرر. وتعد المشفرات الدورات. والضجيج يفسد كل قراءة قليلًا، فصفّها ومعايرها.']], [
    function (r) { var c = r.pick([20, 30, 40, 50]), n = r.int(2, 20); return P(['Distance in cm.', 'المسافة بالسنتيمتر.'], n + ' turns of a ' + c + ' cm wheel', n * c); },
    function (r) { var a = r.int(10, 40), b = r.int(10, 40); return P(['Greatest reach, cm.', 'أقصى مدى.'], 'arm links ' + a + ' and ' + b, a + b); },
    [['Averaging several sensor readings mainly reduces:', 'متوسط القراءات يقلل أساسًا:'], ['Random noise', 'الضجيج العشوائي'], ['Bias', 'التحيز'], ['Cost', 'الكلفة']]
  ]);
  U('engineering', 'a14e', ['Engineering: judgement', 'الهندسة: الحكم الهندسي'], 4, 14);
  Topic('a14e.rel', ['Reliability and redundancy', 'الموثوقية والتكرار'], 'hammer', [['Parts in series all must work, so reliabilities multiply. In parallel, the system fails only if all fail. Two 90% parts: series gives 81%, and parallel gives 99%. Aircraft are built on this.', 'على التوالي تتضاعف الموثوقيات. وعلى التوازي لا يفشل النظام إلا بفشل الكل. جزءان ٩٠٪: ٨١٪ توالي و٩٩٪ توازي.']], [
    function (r) { var a = r.pick([90, 80, 70, 50]), b = r.pick([90, 80, 50, 10]); return P(['System reliability in series, %.', 'موثوقية التوالي.'], a + '% and ' + b + '%', a * b / 100); },
    function (r) { var a = r.pick([90, 80, 50]), b = r.pick([90, 80, 50]); return P(['System reliability in parallel, %.', 'موثوقية التوازي.'], a + '% and ' + b + '%', 100 - (100 - a) * (100 - b) / 100); }
  ]);
  Topic('a14e.econ', ['Engineering economics', 'الاقتصاد الهندسي'], 'scale', [['Payback = cost ÷ yearly saving. A solar install costing 6,000 and saving 1,500 a year pays back in 4 years. Account for upkeep, and compare options over their whole life, honestly.', 'الاسترداد = الكلفة ÷ الوفر السنوي. تركيب بـ٦٠٠٠ يوفر ١٥٠٠ سنويًا يسترد في ٤ سنوات. قارن الخيارات على عمرها كله.']], [
    function (r) { var s = r.int(2, 9) * 100, y = r.int(2, 9); return P(['Payback, in years.', 'سنوات الاسترداد.'], 'costs ' + (s * y) + ', saves ' + s + ' a year', y); },
    function (r) { var c = r.int(2, 9) * 100, u = r.int(1, 5) * 10, y = r.int(5, 20); return P(['Whole-life cost.', 'كلفة العمر كله.'], c + ' to buy, ' + u + ' a year for ' + y + ' years', c + u * y); }
  ]);
  Topic('a14e.fea', ['Modelling, and trusting a model', 'النمذجة والثقة بالنموذج'], 'box', [['Finite element software splits a part into small pieces and solves each. Garbage in, garbage out. Before trusting colour plots, check with a hand calculation, and test a real part where lives depend on it.', 'يقسم الحاسوب القطعة إلى أجزاء صغيرة. والمدخل الفاسد يعطي ناتجًا فاسدًا. تحقق بحساب يدوي واختبر قطعة حقيقية.']], [
    [['A simulation disagrees with your hand estimate by 10 times. First:', 'خالفت المحاكاة تقديرك عشرة أضعاف. أولًا:'], ['Check units, loads and supports', 'افحص الوحدات والأحمال والمساند'], ['Trust the colours', 'ثق بالألوان'], ['Delete the estimate', 'احذف التقدير']],
    function (r) { var n = r.int(2, 9), k = r.pick([2, 4]); return P(['Elements after refining the mesh in 2D (each side split by k).', 'العناصر بعد التنعيم.'], n + ' elements, k = ' + k, n * k * k); }
  ]);
})();
