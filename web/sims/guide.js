/* The Lab's guided investigations. Each simulation has the idea in plain words, then a few investigations:
   a prediction to commit to first, one precise thing to try (the simulation checks it was done, from its own sliders,
   buttons and readings), and what that showed and why. Free play stays: the guide sits beside it and never blocks it.
   s.v(label) a slider's value · s.o(label) the first number in a reading · s.ns(label) every number in it · s.t(label) its text
   s.b(label) how often a button was pressed · s.sel the chosen option · s.seen(label, test) a slider ever held such a value.
   Labels are the English ones in web/sims/index.html. A prediction's right answer is listed first; the page shuffles them. */
var GUIDE = {};
(function (G) {
  var near = function (a, b, e) { return Math.abs(a - b) <= (e == null ? .001 : e); };

  /* ================= MATHS ================= */
  G.triangle = {
    idea: ['A triangle’s three angles always add up to 180°, however you stretch it. Its sides and angles are tied together: the longest side always faces the biggest angle.', 'مجموع زوايا المثلث ١٨٠° دائمًا مهما شددته. الأضلاع والزوايا مترابطة: أطول ضلع يقابل أكبر زاوية.'],
    real: ['Roof trusses, bridges and cranes are built from triangles because a triangle cannot change shape without changing a side.', 'تُبنى الأسقف والجسور والرافعات من المثلثات، لأن المثلث لا يتغير شكله إلا إذا تغير طول ضلع.'],
    steps: [
      { q: ['If you make one angle very wide, what happens to the other two?', 'إذا وسّعت زاوية كثيرًا، ماذا يحدث للزاويتين الأخريين؟'], o: [['They shrink, so all three still add to 180°', 'تصغران، فيبقى المجموع ١٨٠°'], ['They grow too', 'تكبران أيضًا'], ['They stay the same', 'تبقيان كما هما']],
        go: ['Drag a corner until one angle is over 90° (an obtuse triangle).', 'اسحب ركنًا حتى تزيد زاوية على ٩٠° (مثلث منفرج).'], ok: function (s) { return Math.max.apply(0, s.ns('angles')) > 92; },
        why: ['The sum stayed 180°. Opening one angle took degrees from the other two. That is why a triangle can have only one angle of 90° or more.', 'بقي المجموع ١٨٠°. توسيع زاوية أخذ من الأخريين؛ لذلك لا يكون في المثلث إلا زاوية واحدة ٩٠° أو أكبر.'] },
      { q: ['In a right-angled triangle, which side is the longest?', 'في المثلث القائم، أي ضلع هو الأطول؟'], o: [['The one opposite the right angle', 'المقابل للزاوية القائمة'], ['The bottom side', 'الضلع السفلي'], ['They are equal', 'متساوية']],
        go: ['Make one angle 90°, as close as you can.', 'اجعل إحدى الزوايا ٩٠° بأقرب ما تستطيع.'], ok: function (s) { return s.ns('angles').some(function (a) { return a >= 89 && a <= 91; }); },
        why: ['The side facing the right angle is the hypotenuse, always the longest. Pythagoras’ rule, a² + b² = c², is about exactly this triangle.', 'الضلع المقابل للقائمة هو الوتر، وهو الأطول دائمًا. وقاعدة فيثاغورس a² + b² = c² تخص هذا المثلث بالذات.'] },
      { q: ['Pull all three corners into a straight line. The area becomes…', 'اجعل الأركان الثلاثة على خط مستقيم. تصبح المساحة…'], o: [['Zero', 'صفرًا'], ['The biggest it can be', 'أكبر ما يمكن'], ['It cannot change', 'لا تتغير']],
        go: ['Drag the corners until the area is below 1.', 'اسحب الأركان حتى تقل المساحة عن ١.'], ok: function (s) { return s.o('area') < 1; },
        why: ['A triangle squashed flat encloses nothing: one angle heads to 180° and the other two to 0°. The angles still add to 180°.', 'المثلث المسطّح لا يحيط بشيء: تقترب زاوية من ١٨٠° والأخريان من صفر، ويبقى المجموع ١٨٠°.'] }
    ]
  };
  G.polynomial = {
    idea: ['A cubic, ax³ + bx² + cx + d, is a curve with up to two bends. Each slider is one coefficient. The roots are where the curve crosses the x axis: the solutions of f(x) = 0.', 'الدالة التكعيبية ax³ + bx² + cx + d منحنى فيه انحناءتان على الأكثر، وكل مؤشر معامل. الجذور حيث يقطع المنحنى محور x، أي حلول f(x) = 0.'],
    real: ['Engineers fit curves like these to data, and the roots tell them when a quantity reaches zero: when a projectile lands, when a profit turns to loss.', 'يطابق المهندسون مثل هذه المنحنيات مع البيانات، وتخبرهم الجذور متى تصل كمية إلى الصفر.'],
    steps: [
      { q: ['What does the last slider, marked 1, do to the curve?', 'ماذا يفعل المؤشر الأخير، المكتوب عليه ١؟'], o: [['Moves the whole curve up or down', 'يرفع المنحنى كله أو يخفضه'], ['Makes it steeper', 'يجعله أشد انحدارًا'], ['Adds a bend', 'يضيف انحناءة']],
        go: ['Set the slider marked 1 to 4.', 'اجعل المؤشر ١ على ٤.'], ok: function (s) { return s.v('1') >= 3.9; },
        why: ['The constant d is the value at x = 0, the y-intercept. Changing it slides the whole curve up without changing its shape, so the roots move.', 'الثابت d هو القيمة عند x = 0، أي تقاطع y. تغييره يرفع المنحنى كله دون تغيير شكله، فتتحرك الجذور.'] },
      { q: ['At most, how many times can a cubic cross the x axis?', 'كم مرة على الأكثر يقطع المنحنى التكعيبي محور x؟'], o: [['3', '٣'], ['2', '٢'], ['As many as you like', 'كما تشاء']],
        go: ['Find a curve with three real roots.', 'اصنع منحنى له ثلاثة جذور حقيقية.'], ok: function (s) { var t = s.t('real roots'); return t && t.split(',').length >= 3; },
        why: ['With two bends a cubic can cross at most three times. And it crosses at least once: its two ends go in opposite directions.', 'بانحناءتين يقطع المحور ثلاث مرات على الأكثر، ويقطعه مرة على الأقل لأن طرفيه يتجهان اتجاهين متعاكسين.'] },
      { q: ['Set the x³ slider to 0. What shape is left?', 'اجعل مؤشر x³ صفرًا. ما الشكل الباقي؟'], o: [['A parabola, at most two roots', 'قطع مكافئ، جذران على الأكثر'], ['A straight line', 'خط مستقيم'], ['Still a cubic', 'ما زال تكعيبيًا']],
        go: ['Move x³ to 0.', 'حرّك x³ إلى ٠.'], ok: function (s) { return Math.abs(s.v('x³')) < .05 && Math.abs(s.v('x²')) > .05; },
        why: ['Without x³ it is a quadratic: one bend, so it crosses the axis at most twice. Set x² to 0 as well and only a straight line is left.', 'بلا x³ تصبح تربيعية بانحناءة واحدة، فتقطع المحور مرتين على الأكثر. وإن جعلت x² صفرًا بقي خط مستقيم.'] }
    ]
  };
  G.line = {
    idea: ['y = mx + c: m is the gradient, how far the line rises for every 1 it goes across; c is where it crosses the y axis.', 'y = mx + c: الميل m مقدار صعود المستقيم لكل وحدة أفقية، وc نقطة قطعه لمحور y.'],
    real: ['A taxi fare is a straight line: c is the fixed charge, m the price per kilometre.', 'أجرة سيارة الأجرة خط مستقيم: c الأجرة الثابتة وm سعر الكيلومتر.'],
    steps: [
      { q: ['What will changing c do?', 'ماذا يفعل تغيير c؟'], o: [['Slide the line up or down, keeping its slope', 'يرفع المستقيم أو يخفضه بالميل نفسه'], ['Tilt it', 'يميله'], ['Nothing', 'لا شيء']],
        go: ['Set c to 4.', 'اجعل c يساوي ٤.'], ok: function (s) { return near(s.v('c'), 4, .1); },
        why: ['The line moved up, parallel to where it was, and now crosses the y axis at 4. Lines with the same m are parallel.', 'ارتفع المستقيم موازيًا لموضعه، ويقطع محور y عند ٤. المستقيمات ذات الميل نفسه متوازية.'] },
      { q: ['A negative m makes the line…', 'الميل السالب يجعل المستقيم…'], o: [['Go down as you move right', 'ينزل كلما اتجهنا يمينًا'], ['Move down the page', 'ينزل في الصفحة'], ['Disappear', 'يختفي']],
        go: ['Make m negative.', 'اجعل m سالبًا.'], ok: function (s) { return s.v('m') < 0; },
        why: ['Negative gradient: for every 1 across, y falls. Steeper means a bigger number, whatever the sign.', 'الميل السالب: لكل وحدة أفقية تنقص y. وكلما كبر العدد زاد الانحدار مهما كانت إشارته.'] },
      { q: ['With m = 0, where does the line cross the x axis?', 'عندما m = 0، أين يقطع المستقيم محور x؟'], o: [['Nowhere, unless c is 0', 'لا يقطعه إلا إذا كان c صفرًا'], ['At 0', 'عند ٠'], ['At c', 'عند c']],
        go: ['Set m to 0.', 'اجعل m صفرًا.'], ok: function (s) { return Math.abs(s.v('m')) < .01; },
        why: ['A flat line y = c runs parallel to the x axis. It never meets it, unless it lies right on it.', 'المستقيم الأفقي y = c يوازي محور x، فلا يلتقيان إلا إذا انطبق عليه.'] }
    ]
  };
  G.pythag = {
    idea: ['In every right-angled triangle, the square on the longest side equals the two other squares together: a² + b² = c².', 'في كل مثلث قائم، مربع أطول ضلع يساوي مجموع مربعي الضلعين الآخرين: a² + b² = c².'],
    real: ['Builders mark 3, 4 and 5 lengths on a rope to make a perfect right angle. Your phone uses the same rule to work out distances on a map.', 'يعلّم البناؤون حبلًا بأطوال ٣ و٤ و٥ ليصنعوا زاوية قائمة تامة، ويستعمل هاتفك القاعدة نفسها لحساب المسافات على الخريطة.'],
    steps: [
      { q: ['If a = 3 and b = 4, what is c?', 'إذا كان a = 3 وb = 4، فكم c؟'], o: [['5', '٥'], ['7', '٧'], ['6', '٦']],
        go: ['Drag the corner until a is 3.0 and b is 4.0 (close is fine).', 'اسحب الركن حتى يصبح a = 3.0 وb = 4.0 تقريبًا.'], ok: function (s) { return near(s.o('a'), 3, .15) && near(s.o('b'), 4, .15); },
        why: ['3² + 4² = 9 + 16 = 25, and √25 = 5. Adding sides (7) would be wrong: it is the squares that add.', '٣² + ٤² = ٩ + ١٦ = ٢٥، و√٢٥ = ٥. جمع الأضلاع (٧) خطأ: المربعات هي التي تُجمع.'] },
      { q: ['Double both a and b. What happens to c?', 'ضاعف a وb. ماذا يحدث لـ c؟'], o: [['It doubles', 'يتضاعف'], ['It quadruples', 'يصبح أربعة أضعاف'], ['It grows by 2', 'يزيد ٢']],
        go: ['Make a 6 and b 8.', 'اجعل a = 6 وb = 8.'], ok: function (s) { return near(s.o('a'), 6, .2) && near(s.o('b'), 8, .2); },
        why: ['c became 10: the same shape, scaled by 2. The squares grew four times (100 = 4 × 25), but the side only doubled.', 'صار c = 10: الشكل نفسه مكبرًا مرتين. المربعات كبرت أربعة أضعاف (١٠٠ = ٤ × ٢٥) والضلع تضاعف فقط.'] }
    ]
  };
  G.fraction = {
    idea: ['A fraction is part of a whole: the bottom number says how many equal pieces, the top how many you take. Different fractions can be the same amount.', 'الكسر جزء من كل: المقام عدد الأجزاء المتساوية، والبسط عدد ما نأخذ. وقد تكون كسور مختلفة بالقدر نفسه.'],
    real: ['A recipe for 4 that needs 2/4 of a cup needs 1/2: same amount, simpler name.', 'وصفة تحتاج ٢/٤ كوب تحتاج ١/٢ كوب: القدر نفسه باسم أبسط.'],
    steps: [
      { q: ['Is 1/2 the same amount as 2/4?', 'هل ١/٢ بقدر ٢/٤؟'], o: [['Yes', 'نعم'], ['No, 2/4 is more', 'لا، ٢/٤ أكبر'], ['No, 2/4 is less', 'لا، ٢/٤ أصغر']],
        go: ['Set the first bar to 1/2 and the second to 2/4.', 'اجعل الشريط الأول ١/٢ والثاني ٢/٤.'], ok: function (s) { return s.v('top 1') === 1 && s.v('bottom 1') === 2 && s.v('top 2') === 2 && s.v('bottom 2') === 4; },
        why: ['The shaded lengths match. Multiplying top and bottom by the same number cuts the pieces smaller but takes more of them: an equivalent fraction.', 'تطابق الطولان المظللان. ضرب البسط والمقام في العدد نفسه يصغّر الأجزاء ويزيد عددها: كسر مكافئ.'] },
      { q: ['Which is bigger: 2/3 or 3/4?', 'أيهما أكبر: ٢/٣ أم ٣/٤؟'], o: [['3/4', '٣/٤'], ['2/3', '٢/٣'], ['They are equal', 'متساويان']],
        go: ['Set the first bar to 2/3 and the second to 3/4.', 'اجعل الأول ٢/٣ والثاني ٣/٤.'], ok: function (s) { return s.v('top 1') === 2 && s.v('bottom 1') === 3 && s.v('top 2') === 3 && s.v('bottom 2') === 4; },
        why: ['In twelfths: 2/3 = 8/12 and 3/4 = 9/12. A common bottom number makes any two fractions easy to compare.', 'بالأجزاء من ١٢: ٢/٣ = ٨/١٢ و٣/٤ = ٩/١٢. المقام المشترك يجعل المقارنة سهلة.'] },
      { q: ['Same top, bigger bottom: 1/3 or 1/6?', 'البسط نفسه والمقام أكبر: ١/٣ أم ١/٦؟'], o: [['1/3 is bigger', '١/٣ أكبر'], ['1/6 is bigger', '١/٦ أكبر'], ['Equal', 'متساويان']],
        go: ['Set the first bar to 1/3 and the second to 1/6.', 'اجعل الأول ١/٣ والثاني ١/٦.'], ok: function (s) { return s.v('top 1') === 1 && s.v('bottom 1') === 3 && s.v('top 2') === 1 && s.v('bottom 2') === 6; },
        why: ['Sharing a cake among 6 gives smaller slices than among 3. A bigger bottom number means smaller pieces.', 'تقسيم كعكة على ٦ يعطي قطعًا أصغر من تقسيمها على ٣. المقام الأكبر يعني أجزاء أصغر.'] }
    ]
  };
  G.area = {
    idea: ['A multiplication is a rectangle: a rows of b. Splitting one side into tens and ones splits the rectangle into two easy parts.', 'الضرب مستطيل: a صفوف في كل منها b. تقسيم ضلع إلى عشرات وآحاد يقسم المستطيل إلى جزأين سهلين.'],
    real: ['This is how mental arithmetic and the written method both work: 23 × 6 is 20 × 6 plus 3 × 6.', 'هكذا يعمل الحساب الذهني والطريقة المكتوبة: ٢٣ × ٦ هو ٢٠ × ٦ زائد ٣ × ٦.'],
    steps: [
      { q: ['12 × 7: split 12 into 10 + 2. The two parts are…', '١٢ × ٧: قسّم ١٢ إلى ١٠ + ٢. الجزآن…'], o: [['70 and 14', '٧٠ و١٤'], ['72 and 12', '٧٢ و١٢'], ['19 and 5', '١٩ و٥']],
        go: ['Set a to 12 and b to 7.', 'اجعل a = 12 وb = 7.'], ok: function (s) { return s.v('a') === 12 && s.v('b') === 7; },
        why: ['10 × 7 = 70 (the first block) and 2 × 7 = 14 (the second): 84 in all. Each part is easy; together they are the answer.', '١٠ × ٧ = ٧٠ (الجزء الأول) و٢ × ٧ = ١٤ (الثاني): المجموع ٨٤.'] },
      { q: ['23 × 6: the tens part is…', '٢٣ × ٦: جزء العشرات…'], o: [['120', '١٢٠'], ['138', '١٣٨'], ['18', '١٨']],
        go: ['Set a to 23 and b to 6.', 'اجعل a = 23 وb = 6.'], ok: function (s) { return s.v('a') === 23 && s.v('b') === 6; },
        why: ['20 × 6 = 120, then 3 × 6 = 18, so 138. The rectangle shows why the method works, not just that it does.', '٢٠ × ٦ = ١٢٠ ثم ٣ × ٦ = ١٨، فالناتج ١٣٨. المستطيل يبيّن لماذا تنجح الطريقة.'] }
    ]
  };
  G.numberline = {
    idea: ['Adding a positive number moves right on the number line; adding a negative moves left. Taking away a negative is the same move as adding.', 'إضافة عدد موجب تحرك إلى اليمين، وإضافة سالب إلى اليسار. وطرح السالب كإضافة الموجب.'],
    real: ['Temperatures below zero, bank balances and floors below ground all live on this line.', 'درجات الحرارة تحت الصفر والأرصدة البنكية والطوابق تحت الأرض كلها على هذا الخط.'],
    steps: [
      { q: ['Start at 3 and add −5. Where do you land?', 'ابدأ من ٣ وأضف −٥. أين تقف؟'], o: [['−2', '−٢'], ['8', '٨'], ['2', '٢']],
        go: ['Set start to 3 and add to −5.', 'اجعل البداية ٣ والإضافة −٥.'], ok: function (s) { return s.v('start') === 3 && s.v('add') === -5; },
        why: ['Five steps left from 3 passes 0 and stops at −2. Adding a negative is moving left.', 'خمس خطوات يسارًا من ٣ تتجاوز الصفر إلى −٢. إضافة السالب حركة إلى اليسار.'] },
      { q: ['5 − (−4) is the same as…', '٥ − (−٤) يساوي…'], o: [['5 + 4 = 9', '٥ + ٤ = ٩'], ['5 − 4 = 1', '٥ − ٤ = ١'], ['−9', '−٩']],
        go: ['Set start to 5 and add to 4: the reading shows it is the same as 5 − (−4).', 'اجعل البداية ٥ والإضافة ٤: تبيّن القراءة أنه يساوي ٥ − (−٤).'], ok: function (s) { return s.v('start') === 5 && s.v('add') === 4; },
        why: ['Taking away a debt of 4 leaves you 4 better off. Two minus signs together make a move to the right.', 'إسقاط دَين قدره ٤ يزيدك ٤. الإشارتان السالبتان معًا حركة إلى اليمين.'] }
    ]
  };
  G.unitcircle = {
    idea: ['Walk round a circle of radius 1. At any angle, your height is the sine and your distance across is the cosine. tan is height ÷ across.', 'امشِ على دائرة نصف قطرها ١. عند أي زاوية يكون ارتفاعك هو الجيب، وبعدك الأفقي جيب التمام، والظل هو الارتفاع ÷ البعد الأفقي.'],
    real: ['Sound, alternating current and the tides all rise and fall like this sine wave.', 'الصوت والتيار المتردد والمد والجزر ترتفع وتنخفض مثل موجة الجيب هذه.'],
    steps: [
      { q: ['At what angle is sin at its largest?', 'عند أي زاوية يكون الجيب أكبر ما يمكن؟'], o: [['90°', '٩٠°'], ['45°', '٤٥°'], ['180°', '١٨٠°']],
        go: ['Turn the angle to 90°.', 'أدر الزاوية إلى ٩٠°.'], ok: function (s) { return near(s.v('angle'), 90, 1); },
        why: ['At the top of the circle your height is the whole radius: sin 90° = 1, and you are not across at all: cos 90° = 0.', 'في أعلى الدائرة ارتفاعك نصف القطر كله: جا ٩٠° = ١، وبعدك الأفقي صفر: جتا ٩٠° = ٠.'] },
      { q: ['Where is cos negative?', 'أين يكون جيب التمام سالبًا؟'], o: [['Between 90° and 270°', 'بين ٩٠° و٢٧٠°'], ['Between 0° and 90°', 'بين ٠° و٩٠°'], ['Never', 'أبدًا']],
        go: ['Turn the angle to 150°.', 'أدر الزاوية إلى ١٥٠°.'], ok: function (s) { return near(s.v('angle'), 150, 2); },
        why: ['Past 90° you are left of the centre, so the distance across is negative: cos 150° ≈ −0.87, while sin is still positive.', 'بعد ٩٠° تكون يسار المركز، فالبعد الأفقي سالب: جتا ١٥٠° ≈ −٠٫٨٧، والجيب ما زال موجبًا.'] },
      { q: ['What is tan 90°?', 'كم ظا ٩٠°؟'], o: [['It has no value: it is infinite', 'لا قيمة له: لا نهائي'], ['1', '١'], ['0', '٠']],
        go: ['Go back to exactly 90° and read tan.', 'عد إلى ٩٠° تمامًا واقرأ الظل.'], ok: function (s) { return near(s.v('angle'), 90, .5) && s.seen('angle', function (x) { return x > 120; }); },
        why: ['tan = sin ÷ cos, and at 90° cos is 0. Dividing by zero has no answer: the tangent line never meets the axis.', 'الظل = الجيب ÷ جيب التمام، وعند ٩٠° جيب التمام صفر، والقسمة على الصفر لا جواب لها.'] }
    ]
  };
  G.tangent = {
    idea: ['The derivative is the slope of a curve at one point: the steepness of the straight line that just touches it there. The faint curve plots that slope everywhere.', 'المشتقة ميل المنحنى عند نقطة واحدة: انحدار المماس الذي يلمسه هناك. والمنحنى الباهت يرسم هذا الميل في كل مكان.'],
    real: ['Speed is the derivative of distance; a speedometer shows it moment by moment.', 'السرعة مشتقة المسافة، وعداد السرعة يعرضها لحظة بلحظة.'],
    steps: [
      { q: ['On x²/2 − 1, where is the slope zero?', 'على x²/2 − 1، أين يكون الميل صفرًا؟'], o: [['At x = 0, the bottom of the curve', 'عند x = 0، قاع المنحنى'], ['At x = 1', 'عند x = 1'], ['Nowhere', 'لا مكان']],
        go: ['Choose x²/2 − 1, then slide x until the tangent is flat.', 'اختر x²/2 − 1 ثم حرّك x حتى يصبح المماس أفقيًا.'], ok: function (s) { return s.sel === 'x²/2 − 1' && Math.abs(s.o("f'(x)")) < .06; },
        why: ['The derivative here is x itself, and it is 0 at x = 0. Turning points always have zero slope: that is how calculus finds maxima and minima.', 'المشتقة هنا x نفسها، وهي صفر عند x = 0. نقاط الانعطاف ميلها صفر دائمًا، وبهذا يجد التفاضل القيم العظمى والصغرى.'] },
      { q: ['For 2 sin x, what is the slope at x = 0?', 'للدالة 2 sin x، كم الميل عند x = 0؟'], o: [['2', '٢'], ['0', '٠'], ['1', '١']],
        go: ['Choose 2 sin x and set x to 0.', 'اختر 2 sin x واجعل x صفرًا.'], ok: function (s) { return s.sel === '2 sin x' && Math.abs(s.v('x')) < .06; },
        why: ['The derivative of 2 sin x is 2 cos x, which is 2 at x = 0. The faint curve, the derivative, is a cosine wave.', 'مشتقة 2 sin x هي 2 cos x، وتساوي ٢ عند x = 0. والمنحنى الباهت، المشتقة، موجة جيب تمام.'] }
    ]
  };
  G.riemann = {
    idea: ['To find the area under a curve, fill it with thin rectangles and add them up. The thinner they are, the closer the total. The limit is the integral.', 'لإيجاد المساحة تحت منحنى، املأها بمستطيلات رفيعة واجمعها. كلما رقّت اقترب المجموع، ونهايته هي التكامل.'],
    real: ['Distance travelled is the area under a speed–time graph. Every computer that integrates does it with rectangles like these.', 'المسافة المقطوعة هي المساحة تحت منحنى السرعة والزمن، وكل حاسوب يكامل يفعل ذلك بمستطيلات كهذه.'],
    steps: [
      { q: ['With one rectangle, is the estimate too big or too small?', 'بمستطيل واحد، هل التقدير أكبر أم أصغر؟'], o: [['Too small', 'أصغر'], ['Too big', 'أكبر'], ['Exact', 'دقيق']],
        go: ['Set n to 1.', 'اجعل n = 1.'], ok: function (s) { return s.v('n') === 1; },
        why: ['Each rectangle takes its height from its left edge, and this curve rises, so every rectangle sits under it: 2 against a true 7.33.', 'يأخذ كل مستطيل ارتفاعه من حافته اليسرى والمنحنى صاعد، فتقع المستطيلات تحته: ٢ مقابل ٧٫٣٣.'] },
      { q: ['About how many rectangles to get within 0.1 of 7.33?', 'كم مستطيلًا تقريبًا ليقترب التقدير من ٧٫٣٣ بأقل من ٠٫١؟'], o: [['About 80', 'نحو ٨٠'], ['About 8', 'نحو ٨'], ['Exactly 7', '٧ تمامًا']],
        go: ['Increase n until the estimate is within 0.1 of 7.33.', 'زد n حتى يبعد التقدير عن ٧٫٣٣ أقل من ٠٫١.'], ok: function (s) { return Math.abs(s.o('estimate') - 7.33) <= .1; },
        why: ['The error shrinks like 1 ÷ n: here about 8 ÷ n. As n grows without end the sum becomes the integral, ∫₀⁴ (x²/4 + ½) dx = 22/3.', 'يصغر الخطأ مثل ١ ÷ n، هنا نحو ٨ ÷ n. وحين يكبر n بلا حد يصير المجموع هو التكامل: ٢٢/٣.'] }
    ]
  };
  G.matrix = {
    idea: ['A 2 × 2 matrix moves every point of the plane: the first column is where (1, 0) lands, the second where (0, 1) lands. The determinant, ad − bc, is how much areas are scaled.', 'المصفوفة ٢ × ٢ تحرك كل نقطة في المستوى: العمود الأول موضع (1, 0) الجديد والثاني موضع (0, 1). والمحدد ad − bc معامل تكبير المساحات.'],
    real: ['Every rotation, zoom and shear in a game or photo editor is a matrix like this one.', 'كل دوران وتكبير وإمالة في الألعاب ومحررات الصور مصفوفة كهذه.'],
    steps: [
      { q: ['What does a = 1, b = 0, c = 0, d = 1 do?', 'ماذا تفعل a = 1، b = 0، c = 0، d = 1؟'], o: [['Nothing: every point stays put', 'لا شيء: تبقى كل نقطة مكانها'], ['Flips the square', 'تقلب المربع'], ['Doubles it', 'تضاعفه']],
        go: ['Set a = 1, b = 0, c = 0, d = 1.', 'اجعل a = 1، b = 0، c = 0، d = 1.'], ok: function (s) { return s.v('a') === 1 && s.v('b') === 0 && s.v('c') === 0 && s.v('d') === 1; },
        why: ['This is the identity matrix, the 1 of matrices: the coloured square sits exactly on the dashed one, and the determinant is 1.', 'هذه مصفوفة الوحدة، وهي "الواحد" بين المصفوفات: ينطبق المربع على المتقطع، والمحدد ١.'] },
      { q: ['Now set a = 2. The area becomes…', 'اجعل a = 2. تصبح المساحة…'], o: [['2', '٢'], ['4', '٤'], ['1', '١']],
        go: ['Set a = 2, keeping b = c = 0 and d = 1.', 'اجعل a = 2 مع b = c = 0 وd = 1.'], ok: function (s) { return s.v('a') === 2 && s.v('b') === 0 && s.v('c') === 0 && s.v('d') === 1; },
        why: ['Stretched across by 2, not up: the area doubles, and the determinant 2 × 1 − 0 × 0 says so.', 'مُدّ أفقيًا ضعفين لا رأسيًا، فتضاعفت المساحة، والمحدد ٢ × ١ − ٠ × ٠ يقول ذلك.'] },
      { q: ['Can a matrix squash the square completely flat?', 'هل تستطيع مصفوفة أن تسطّح المربع تمامًا؟'], o: [['Yes, when the determinant is 0', 'نعم، حين يكون المحدد صفرًا'], ['No, never', 'لا، أبدًا'], ['Only if every number is 0', 'فقط إذا كانت كل الأعداد صفرًا']],
        go: ['Make the determinant 0, with at least one number not 0.', 'اجعل المحدد صفرًا مع عدد واحد غير صفري على الأقل.'], ok: function (s) { return Math.abs(s.o('determinant')) < .05 && (s.v('a') || s.v('b') || s.v('c') || s.v('d')); },
        why: ['The two columns now point along one line, so the square collapses into it. With zero area nothing can undo it: such a matrix has no inverse.', 'صار العمودان على خط واحد فانطوى المربع عليه. بلا مساحة لا يمكن عكس ذلك: لا معكوس لهذه المصفوفة.'] }
    ]
  };
  G.chance = {
    idea: ['A fair die gives each number a 1 in 6 chance, about 16.7%. A few rolls can look very unfair; many rolls settle close to the true chance.', 'النرد العادل يعطي كل رقم فرصة ١ من ٦، نحو ١٦٫٧٪. الرميات القليلة قد تبدو ظالمة، والكثيرة تقترب من الاحتمال الحقيقي.'],
    real: ['Insurers, weather forecasters and medical trials all rely on this: a pattern is only trusted from many cases.', 'شركات التأمين وخبراء الطقس والتجارب الطبية تعتمد على هذا: لا يُوثق بالنمط إلا من حالات كثيرة.'],
    steps: [
      { q: ['After only 10 rolls, will each number show about 16.7%?', 'بعد ١٠ رميات فقط، هل يظهر كل رقم بنحو ١٦٫٧٪؟'], o: [['Not usually: a few rolls are lumpy', 'غالبًا لا: الرميات القليلة غير منتظمة'], ['Yes, exactly', 'نعم تمامًا'], ['Only for six', 'فقط للستة']],
        go: ['Press Reset, then +10.', 'اضغط إعادة ثم +10.'], ok: function (s) { return s.b('Reset') > 0 && s.o('rolls') === 10; },
        why: ['With 10 rolls some numbers come up 3 times and some not at all. That is not a broken die: it is what small samples do.', 'في ١٠ رميات يظهر رقم ٣ مرات وآخر لا يظهر. هذا ليس نردًا معيبًا: هكذا تكون العينات الصغيرة.'] },
      { q: ['After 1000 more rolls?', 'بعد ١٠٠٠ رمية أخرى؟'], o: [['Every bar close to 16.7%', 'كل عمود قريب من ١٦٫٧٪'], ['Still lumpy', 'ما زالت غير منتظمة'], ['Six wins', 'الستة تفوز']],
        go: ['Press +1000.', 'اضغط +1000.'], ok: function (s) { return s.o('rolls') >= 1000; },
        why: ['The bars flatten towards 16.7%. This is the law of large numbers: the share of each outcome settles on its true chance.', 'تستوي الأعمدة نحو ١٦٫٧٪. هذا قانون الأعداد الكبيرة: تستقر نسبة كل نتيجة على احتمالها الحقيقي.'] }
    ]
  };
  G.bayes = {
    idea: ['A test result has to be weighed against how common the illness is. When an illness is rare, most positive results can be false alarms, even from an accurate test.', 'تُوزن نتيجة الفحص بمدى انتشار المرض. إذا كان المرض نادرًا فقد تكون أكثر النتائج الإيجابية إنذارات كاذبة حتى مع فحص دقيق.'],
    real: ['Doctors confirm a positive screening with a second test for exactly this reason.', 'لهذا السبب بالذات يؤكد الأطباء نتيجة الفحص الإيجابية بفحص ثانٍ.'],
    steps: [
      { q: ['1 person in 1000 is ill; the test is 99% accurate. You test positive. The chance you are ill is about…', 'شخص من كل ١٠٠٠ مريض، والفحص دقيق ٩٩٪. نتيجتك إيجابية. احتمال مرضك نحو…'], o: [['9%', '٩٪'], ['99%', '٩٩٪'], ['50%', '٥٠٪']],
        go: ['Set ill per 1000 to 1 and accuracy to 99%.', 'اجعل المرضى ١ لكل ١٠٠٠ والدقة ٩٩٪.'], ok: function (s) { return s.v('ill per 1000') === 1 && s.v('test accuracy %') === 99; },
        why: ['Of 1000 people, about 1 is ill and tests positive, but 1% of the 999 healthy also test positive: about 10. So 1 in 11 positives is real.', 'من ١٠٠٠ شخص، واحد مريض نتيجته إيجابية، و١٪ من الأصحاء الـ٩٩٩ إيجابيون أيضًا: نحو ١٠. فواحدة من كل ١١ نتيجة إيجابية حقيقية.'] },
      { q: ['Now the illness is common: 100 in 1000. The chance you are ill is…', 'المرض الآن شائع: ١٠٠ من ١٠٠٠. احتمال مرضك…'], o: [['Much higher, about 92%', 'أعلى بكثير، نحو ٩٢٪'], ['Still 9%', 'ما زال ٩٪'], ['Lower', 'أقل']],
        go: ['Set ill per 1000 to 100, keeping 99% accuracy.', 'اجعل المرضى ١٠٠ لكل ١٠٠٠ مع دقة ٩٩٪.'], ok: function (s) { return s.v('ill per 1000') === 100 && s.v('test accuracy %') === 99; },
        why: ['Same test, different answer: 99 true positives against 9 false alarms. How common something is before the test (the prior) matters as much as the test.', 'الفحص نفسه والجواب مختلف: ٩٩ إيجابية حقيقية مقابل ٩ كاذبة. ما نعرفه قبل الفحص يهم بقدر الفحص.'] }
    ]
  };
  G.girih = {
    idea: ['An Islamic star is a circle divided into equal parts, with each point joined to another a fixed number of steps away. Repeat the tile and the stars lock together.', 'النجمة الإسلامية دائرة مقسومة أجزاءً متساوية، تُوصل كل نقطة بأخرى على بعد خطوات ثابتة. كرر الوحدة تتشابك النجوم.'],
    real: ['The Alhambra, the mosques of Isfahan and Bukhara and the Mamluk Qurʾāns were laid out with compass and ruler this way.', 'رُسمت زخارف الحمراء ومساجد أصفهان وبخارى والمصاحف المملوكية بالفرجار والمسطرة على هذا النحو.'],
    steps: [
      { q: ['An 8-pointed star: each point is turned from the next by…', 'نجمة ثمانية: تدور كل نقطة عن التالية بمقدار…'], o: [['45°', '٤٥°'], ['8°', '٨°'], ['60°', '٦٠°']],
        go: ['Set points to 8.', 'اجعل الرؤوس ٨.'], ok: function (s) { return s.v('points') === 8; },
        why: ['A full turn is 360°, shared equally among 8 points: 360 ÷ 8 = 45°.', 'الدورة الكاملة ٣٦٠° مقسومة بالتساوي على ٨ رؤوس: ٣٦٠ ÷ ٨ = ٤٥°.'] },
      { q: ['6 points, step 2. Which shape appears?', '٦ رؤوس والخطوة ٢. أي شكل يظهر؟'], o: [['Two overlapping triangles: a six-pointed star', 'مثلثان متداخلان: نجمة سداسية'], ['A square', 'مربع'], ['A circle', 'دائرة']],
        go: ['Set points to 6 and step to 2.', 'اجعل الرؤوس ٦ والخطوة ٢.'], ok: function (s) { return s.v('points') === 6 && s.v('step') === 2; },
        why: ['Joining every second point of six makes a triangle, and starting one point later makes another. The step decides how sharp the star is.', 'وصل كل نقطة ثانية من ست يصنع مثلثًا، والبدء بعدها بنقطة يصنع آخر. والخطوة تحدد حدّة النجمة.'] }
    ]
  };

  /* ================= PHYSICS ================= */
  G.projectile = {
    idea: ['A thrown object moves across at a steady speed while gravity pulls it down: the two motions are independent, and together they trace a parabola.', 'الجسم المقذوف يتحرك أفقيًا بسرعة ثابتة بينما تشده الجاذبية لأسفل: الحركتان مستقلتان، ومعًا ترسمان قطعًا مكافئًا.'],
    real: ['Athletes, fountains and water hoses all follow this curve. Real balls fall a little short because of air.', 'الرياضيون والنوافير وخراطيم الماء تتبع هذا المنحنى، والكرات الحقيقية تقصر قليلًا بسبب الهواء.'],
    steps: [
      { q: ['With no air, which launch angle goes furthest?', 'بلا هواء، أي زاوية إطلاق تذهب أبعد؟'], o: [['45°', '٤٥°'], ['60°', '٦٠°'], ['30°', '٣٠°']],
        go: ['Set the angle to 45°.', 'اجعل الزاوية ٤٥°.'], ok: function (s) { return s.v('angle') === 45; },
        why: ['Range = u² sin 2θ ÷ g, and sin 2θ is largest, 1, when 2θ = 90°. Lower angles land too soon; higher ones waste speed going up.', 'المدى = u² جا ٢θ ÷ g، وجا ٢θ أكبر ما يكون حين ٢θ = ٩٠°. الزوايا الأخفض تهبط مبكرًا، والأعلى تهدر السرعة صعودًا.'] },
      { q: ['Compare 30° and 60°. Their ranges are…', 'قارن ٣٠° و٦٠°. مداهما…'], o: [['The same', 'متساويان'], ['60° goes further', '٦٠° أبعد'], ['30° goes further', '٣٠° أبعد']],
        go: ['Try 30°, then 60°.', 'جرّب ٣٠° ثم ٦٠°.'], ok: function (s) { return s.seen('angle', function (x) { return x === 30; }) && s.v('angle') === 60; },
        why: ['sin 60° = sin 120°, so angles that add to 90° share a range. The 60° shot climbs higher and stays up longer.', 'جا ٦٠° = جا ١٢٠°، فالزاويتان اللتان مجموعهما ٩٠° مداهما واحد، وطلقة ٦٠° أعلى وأطول بقاءً.'] },
      { q: ['On the Moon, gravity is 1.6 instead of 9.8. The range becomes…', 'على القمر الجاذبية ١٫٦ بدل ٩٫٨. يصبح المدى…'], o: [['About 6 times longer', 'أطول نحو ٦ مرات'], ['The same', 'كما هو'], ['Shorter', 'أقصر']],
        go: ['Set gravity to 1.6.', 'اجعل الجاذبية ١٫٦.'], ok: function (s) { return s.v('gravity') <= 1.65; },
        why: ['Range is divided by g, and 9.8 ÷ 1.6 ≈ 6. Astronauts’ golf balls on the Moon flew for hundreds of metres.', 'المدى يُقسم على g، و٩٫٨ ÷ ١٫٦ ≈ ٦. طارت كرات الغولف على القمر مئات الأمتار.'] }
    ]
  };
  G.pendulum = {
    idea: ['A pendulum’s period, the time for one swing there and back, is T = 2π√(L ÷ g). Only the length and gravity appear in it.', 'زمن دورة البندول، ذهابًا وإيابًا، هو T = 2π√(L ÷ g). لا يظهر فيه إلا الطول والجاذبية.'],
    real: ['This is why pendulum clocks keep time, and why a clock that runs fast is fixed by lengthening its pendulum.', 'لهذا تضبط ساعات البندول الوقت، ولهذا تُصلح الساعة المسرعة بإطالة بندولها.'],
    steps: [
      { q: ['Make the weight heavier. The swing becomes…', 'اجعل الثقل أثقل. يصبح التأرجح…'], o: [['The same speed', 'بالسرعة نفسها'], ['Slower', 'أبطأ'], ['Faster', 'أسرع']],
        go: ['Raise the mass to 3 kg or more.', 'ارفع الكتلة إلى ٣ كغ أو أكثر.'], ok: function (s) { return s.v('mass') >= 3; },
        why: ['The period did not change: mass is not in the formula. A heavier weight is pulled harder but is also harder to move, and the two cancel.', 'لم يتغير الزمن: الكتلة ليست في القانون. الثقل الأكبر يُشد أكثر ويصعب تحريكه أكثر، فيتعادلان.'] },
      { q: ['Make the string 4 times longer: 0.5 m to 2 m. The period…', 'اجعل الخيط أطول ٤ مرات: من ٠٫٥ م إلى ٢ م. الزمن…'], o: [['Doubles', 'يتضاعف'], ['Becomes 4 times longer', 'يصبح ٤ أضعاف'], ['Stays the same', 'يبقى كما هو']],
        go: ['Set the length to 0.5 m, then to 2.0 m.', 'اجعل الطول ٠٫٥ م ثم ٢٫٠ م.'], ok: function (s) { return s.seen('length', function (x) { return x <= .55; }) && s.v('length') >= 1.95; },
        why: ['T grows with the square root of L, and √4 = 2. A 1 m pendulum ticks almost exactly once a second each way.', 'يزيد الزمن مع الجذر التربيعي للطول، و√٤ = ٢. البندول الذي طوله ١ م يقطع كل اتجاه في ثانية تقريبًا.'] }
    ]
  };
  G.wave = {
    idea: ['A wave carries energy without carrying the water or air along. Its speed is frequency × wavelength: v = f λ.', 'الموجة تنقل الطاقة دون أن تنقل الماء أو الهواء معها. سرعتها = التردد × الطول الموجي: v = f λ.'],
    real: ['Radio stations, Wi-Fi and the notes of a nasheed are waves told apart by their frequency.', 'محطات الراديو والواي فاي ونغمات النشيد موجات تتميز بترددها.'],
    steps: [
      { q: ['Double the frequency, keep the wavelength. The speed…', 'ضاعف التردد مع ثبات الطول الموجي. السرعة…'], o: [['Doubles', 'تتضاعف'], ['Stays the same', 'ثابتة'], ['Halves', 'تنتصف']],
        go: ['Set the frequency to 2.', 'اجعل التردد ٢.'], ok: function (s) { return near(s.v('frequency'), 2, .05); },
        why: ['v = f λ: twice as many crests a second, each just as far apart, means the wave moves twice as fast.', 'v = f λ: قمم أكثر بضعفين في الثانية بالتباعد نفسه، فتتحرك الموجة بضعف السرعة.'] },
      { q: ['Make the wave taller (the size, or amplitude). The speed…', 'اجعل الموجة أعلى (السعة). السرعة…'], o: [['Does not change', 'لا تتغير'], ['Increases', 'تزيد'], ['Decreases', 'تنقص']],
        go: ['Raise the size to 60 or more.', 'ارفع السعة إلى ٦٠ أو أكثر.'], ok: function (s) { return s.v('size') >= 60; },
        why: ['A taller wave carries more energy (a louder sound, a brighter light) but travels at the same speed.', 'الموجة الأعلى تحمل طاقة أكثر (صوتًا أعلى، ضوءًا أشد) لكنها تسير بالسرعة نفسها.'] },
      { q: ['Keep the speed at 240 px/s with frequency 2. The wavelength must be…', 'أبقِ السرعة ٢٤٠ مع تردد ٢. الطول الموجي يجب أن يكون…'], o: [['120', '١٢٠'], ['480', '٤٨٠'], ['60', '٦٠']],
        go: ['Set frequency 2 and wavelength 120.', 'اجعل التردد ٢ والطول الموجي ١٢٠.'], ok: function (s) { return near(s.v('frequency'), 2, .05) && s.v('wavelength') === 120; },
        why: ['λ = v ÷ f = 240 ÷ 2 = 120. In one medium the speed is fixed, so higher notes have shorter wavelengths.', 'λ = v ÷ f = ٢٤٠ ÷ ٢ = ١٢٠. في الوسط الواحد السرعة ثابتة، فالنغمات الأعلى أقصر طولًا موجيًا.'] }
    ]
  };
  G.ohm = {
    idea: ['Voltage pushes charge round a circuit; resistance holds it back; current is how much flows each second. I = V ÷ R.', 'الجهد يدفع الشحنة في الدائرة، والمقاومة تعيقها، والتيار مقدار ما يمر في الثانية. I = V ÷ R.'],
    real: ['Every plug in a home is wired in parallel, so each appliance gets the full voltage whatever else is on.', 'كل مقابس البيت موصولة على التوازي، فيأخذ كل جهاز الجهد كاملًا مهما شُغّل غيره.'],
    steps: [
      { q: ['Double the voltage. The current…', 'ضاعف الجهد. التيار…'], o: [['Doubles', 'يتضاعف'], ['Halves', 'ينتصف'], ['Stays the same', 'ثابت']],
        go: ['Set the voltage to 12 V and the resistance to 3 Ω.', 'اجعل الجهد ١٢ فولت والمقاومة ٣ أوم.'], ok: function (s) { return s.v('voltage') === 12 && s.v('resistance') === 3; },
        why: ['12 ÷ 3 = 4 A, twice the 2 A from 6 V. For a fixed resistor, current is proportional to voltage: Ohm’s law.', '١٢ ÷ ٣ = ٤ أمبير، ضعف ٢ أمبير من ٦ فولت. التيار يتناسب مع الجهد للمقاومة الثابتة: قانون أوم.'] },
      { q: ['Put two resistors in series. The current…', 'صِل مقاومتين على التوالي. التيار…'], o: [['Halves', 'ينتصف'], ['Doubles', 'يتضاعف'], ['Stays the same', 'ثابت']],
        go: ['Choose Two in series.', 'اختر توالٍ.'], ok: function (s) { return s.sel === 'Two in series'; },
        why: ['In series the charge must pass through both, so the resistances add: 2R. The same push gives half the current, and the bulb dims.', 'على التوالي تمر الشحنة بالمقاومتين، فتُجمعان: 2R. الدفع نفسه يعطي نصف التيار ويخفت المصباح.'] },
      { q: ['And two in parallel?', 'وعلى التوازي؟'], o: [['The current doubles: two paths', 'يتضاعف التيار: مساران'], ['It halves', 'ينتصف'], ['No change', 'لا يتغير']],
        go: ['Choose Two in parallel.', 'اختر توازٍ.'], ok: function (s) { return s.sel === 'Two in parallel'; },
        why: ['Side by side, charge has two routes, so the total resistance halves and the current doubles. Power, P = V × I, doubles too.', 'جنبًا إلى جنب للشحنة طريقان، فتنتصف المقاومة الكلية ويتضاعف التيار، وتتضاعف القدرة P = V × I أيضًا.'] }
    ]
  };
  G.refraction = {
    idea: ['Light slows down in glass or water. Entering at a slant, the side that arrives first slows first, so the beam turns towards the normal: n₁ sin θ₁ = n₂ sin θ₂.', 'يبطؤ الضوء في الزجاج والماء. إذا دخل مائلًا يبطؤ الجانب الذي يصل أولًا، فينعطف الشعاع نحو العمود: n₁ جا θ₁ = n₂ جا θ₂.'],
    real: ['Ibn Sahl wrote this law in Baghdad in 984, six centuries before Snell. Glasses, cameras and the eye’s lens all work by it.', 'كتب ابن سهل هذا القانون في بغداد سنة ٩٨٤م، قبل سنيل بستة قرون، وعليه تعمل النظارات والكاميرات وعدسة العين.'],
    steps: [
      { q: ['Light enters straight down, at 0°. Does it bend?', 'يدخل الضوء عموديًا بزاوية ٠°. هل ينكسر؟'], o: [['No: it slows but goes straight on', 'لا: يبطؤ ويمضي مستقيمًا'], ['Yes, a lot', 'نعم كثيرًا'], ['It reflects back', 'ينعكس']],
        go: ['Set the angle to 0°.', 'اجعل الزاوية ٠°.'], ok: function (s) { return s.v('angle') === 0; },
        why: ['Along the normal every part of the beam slows at the same moment, so there is nothing to turn it.', 'على العمود يبطؤ الشعاع كله في اللحظة نفسها، فلا شيء يلويه.'] },
      { q: ['Diamond (n = 2.4) against glass (n = 1.5): which bends light more?', 'الألماس (٢٫٤) مقابل الزجاج (١٫٥): أيهما يكسر الضوء أكثر؟'], o: [['Diamond', 'الألماس'], ['Glass', 'الزجاج'], ['The same', 'متساويان']],
        go: ['At 40°, set the refractive index to 2.4.', 'عند ٤٠°، اجعل معامل الانكسار ٢٫٤.'], ok: function (s) { return s.v('refractive index') >= 2.35 && s.v('angle') === 40; },
        why: ['n is how many times slower light goes: in diamond 2.4 times slower, so it bends hardest. Cut diamonds trap and split light for the same reason.', 'n عدد مرات بطء الضوء: في الألماس أبطأ ٢٫٤ مرة فينكسر أكثر، ولذلك يحبس الألماس المصقول الضوء ويفرّقه.'] }
    ]
  };
  G.orbit = {
    idea: ['An orbit is falling sideways forever: gravity pulls the satellite towards the planet, and its speed carries it past before it can land.', 'المدار سقوط جانبي لا ينتهي: الجاذبية تشد القمر الصناعي نحو الكوكب، وسرعته تحمله بعيدًا قبل أن يرتطم.'],
    real: ['The International Space Station falls round the Earth at about 7.7 km/s, once every 90 minutes.', 'محطة الفضاء الدولية تسقط حول الأرض بنحو ٧٫٧ كم/ث، مرة كل ٩٠ دقيقة.'],
    steps: [
      { q: ['Launch slowly. What happens?', 'أطلقه ببطء. ماذا يحدث؟'], o: [['It falls in and crashes', 'يسقط ويرتطم'], ['It orbits', 'يدور'], ['It escapes', 'يفلت']],
        go: ['Set the launch speed to 0.4 or less.', 'اجعل سرعة الإطلاق ٠٫٤ أو أقل.'], ok: function (s) { return s.v('launch speed') <= .4; },
        why: ['Too slow, and gravity bends its path into the planet before it can get round.', 'إذا كان بطيئًا حنت الجاذبية مساره إلى الكوكب قبل أن يلتف حوله.'] },
      { q: ['Is there a speed that keeps it going round in a near-perfect circle?', 'هل توجد سرعة تبقيه يدور في دائرة شبه تامة؟'], o: [['Yes, exactly one for each height', 'نعم، سرعة واحدة لكل ارتفاع'], ['No', 'لا'], ['Any speed works', 'أي سرعة']],
        go: ['Find a launch speed between 0.95 and 1.05.', 'جد سرعة إطلاق بين ٠٫٩٥ و١٫٠٥.'], ok: function (s) { var v = s.v('launch speed'); return v >= .95 && v <= 1.05; },
        why: ['At v = √(GM ÷ r) gravity supplies exactly the turning force a circle needs. Lower orbits need more speed.', 'عند v = √(GM ÷ r) تعطي الجاذبية قوة الانعطاف التي تحتاجها الدائرة بالضبط، والمدارات الأخفض تحتاج سرعة أكبر.'] },
      { q: ['Go much faster. The path…', 'أسرع كثيرًا. المسار…'], o: [['Escapes for good', 'يفلت نهائيًا'], ['Becomes a bigger circle', 'دائرة أكبر'], ['Crashes', 'يرتطم']],
        go: ['Set the launch speed to 1.45 or more.', 'اجعل سرعة الإطلاق ١٫٤٥ أو أكثر.'], ok: function (s) { return s.v('launch speed') >= 1.45; },
        why: ['Past √2 times the circular speed, gravity can never pull it back: this is escape velocity, 11.2 km/s from Earth’s surface.', 'بعد √٢ ضعف السرعة الدائرية لا تستطيع الجاذبية إعادته: هذه سرعة الإفلات، ١١٫٢ كم/ث من سطح الأرض.'] }
    ]
  };
  G.force = {
    idea: ['A resultant force makes a mass accelerate: a = F ÷ m. The same push moves a light object quickly and a heavy one slowly. Friction pushes back against motion.', 'القوة المحصلة تُكسب الكتلة تسارعًا: a = F ÷ m. الدفع نفسه يحرك الخفيف سريعًا والثقيل ببطء، والاحتكاك يقاوم الحركة.'],
    real: ['A loaded lorry needs a longer road to speed up and to stop than an empty one, for this reason.', 'الشاحنة المحمّلة تحتاج طريقًا أطول لتسرع ولتقف من الفارغة، لهذا السبب.'],
    steps: [
      { q: ['Same 10 N push, double the mass from 2 kg to 4 kg. Acceleration…', 'الدفع نفسه ١٠ نيوتن والكتلة من ٢ إلى ٤ كغ. التسارع…'], o: [['Halves', 'ينتصف'], ['Doubles', 'يتضاعف'], ['Stays the same', 'ثابت']],
        go: ['Set force 10 N, mass 4 kg, friction 0.', 'اجعل القوة ١٠ نيوتن والكتلة ٤ كغ والاحتكاك ٠.'], ok: function (s) { return s.v('force') === 10 && s.v('mass') === 4 && s.v('friction') === 0; },
        why: ['10 ÷ 4 = 2.5 m/s², half of 10 ÷ 2. Mass is resistance to being speeded up.', '١٠ ÷ ٤ = ٢٫٥ م/ث²، نصف ١٠ ÷ ٢. الكتلة مقاومة للتسريع.'] },
      { q: ['Now add friction 0.5 (4 kg, 10 N). The block…', 'أضف احتكاكًا ٠٫٥ (٤ كغ، ١٠ نيوتن). الكتلة…'], o: [['Will not start moving', 'لا تتحرك'], ['Moves slower', 'تتحرك أبطأ'], ['Moves faster', 'أسرع']],
        go: ['Press Reset, then set friction to 0.5.', 'اضغط إعادة ثم اجعل الاحتكاك ٠٫٥.'], ok: function (s) { return s.b('Reset') > 0 && s.v('friction') >= .5 && s.v('force') <= 15 && s.v('mass') === 4; },
        why: ['Friction can hold back up to 0.5 × 4 kg × 9.8 = 19.6 N. A 10 N push is not enough, so the resultant force is zero.', 'يستطيع الاحتكاك أن يقاوم حتى ٠٫٥ × ٤ × ٩٫٨ = ١٩٫٦ نيوتن، والدفع ١٠ لا يكفي، فالمحصلة صفر.'] },
      { q: ['Push with 30 N against that friction. Acceleration?', 'ادفع بـ٣٠ نيوتن ضد هذا الاحتكاك. التسارع؟'], o: [['(30 − 19.6) ÷ 4 ≈ 2.6 m/s²', '(٣٠ − ١٩٫٦) ÷ ٤ ≈ ٢٫٦ م/ث²'], ['30 ÷ 4 = 7.5 m/s²', '٣٠ ÷ ٤ = ٧٫٥'], ['Zero', 'صفر']],
        go: ['Set the force to 30 N.', 'اجعل القوة ٣٠ نيوتن.'], ok: function (s) { return s.v('force') === 30 && s.v('friction') >= .5; },
        why: ['Only the resultant force accelerates: what is left of the push after friction. That is the F in F = ma.', 'المحصلة وحدها تُسرّع: ما يبقى من الدفع بعد الاحتكاك. هذه هي F في F = ma.'] }
    ]
  };
  G.density = {
    idea: ['Density = mass ÷ volume. An object floats if it is less dense than the liquid, and sinks if it is denser.', 'الكثافة = الكتلة ÷ الحجم. يطفو الجسم إذا كان أقل كثافة من السائل، ويغوص إذا كان أكثف.'],
    real: ['A steel ship floats because its hull holds air: its average density is less than water’s. People float easily in the very salty Dead Sea.', 'تطفو السفينة الفولاذية لأن هيكلها يحوي هواءً فمتوسط كثافتها أقل من الماء، ويطفو الناس بسهولة في البحر الميت شديد الملوحة.'],
    steps: [
      { q: ['400 g in 500 cm³, in water (1 g/cm³). It will…', '٤٠٠ غ في ٥٠٠ سم³، في الماء (١ غ/سم³). سوف…'], o: [['Float: its density is 0.8 g/cm³', 'يطفو: كثافته ٠٫٨'], ['Sink', 'يغوص'], ['Hover in the middle', 'يبقى معلقًا']],
        go: ['Set mass 400 g, volume 500 cm³, liquid 1.', 'اجعل الكتلة ٤٠٠ غ والحجم ٥٠٠ سم³ والسائل ١.'], ok: function (s) { return s.v('mass (g)') === 400 && s.v('volume (cm³)') === 500 && near(s.v('liquid density'), 1, .01); },
        why: ['400 ÷ 500 = 0.8, less than 1, so it floats, with 80% of it under the surface: the same fraction as its density to the water’s.', '٤٠٠ ÷ ٥٠٠ = ٠٫٨ أقل من ١ فيطفو، و٨٠٪ منه تحت السطح: النسبة نفسها بين كثافته وكثافة الماء.'] },
      { q: ['Without changing its mass, how could you make it sink?', 'دون تغيير كتلته، كيف تجعله يغوص؟'], o: [['Make it smaller', 'تصغير حجمه'], ['Make it bigger', 'تكبير حجمه'], ['You cannot', 'لا يمكن']],
        go: ['Change only the volume until it sinks.', 'غيّر الحجم وحده حتى يغوص.'], ok: function (s) { return s.v('mass (g)') === 400 && s.v('volume (cm³)') < 400 && near(s.v('liquid density'), 1, .01); },
        why: ['Squeezing the same mass into less space raises its density past 1. Floating depends on density, not on weight.', 'حصر الكتلة نفسها في حيز أصغر يرفع كثافتها فوق ١. الطفو يتعلق بالكثافة لا بالوزن.'] },
      { q: ['A 1500 g block in 1000 cm³ sinks in water. What liquid would float it?', 'جسم ١٥٠٠ غ في ١٠٠٠ سم³ يغوص في الماء. أي سائل يُطفيه؟'], o: [['One denser than 1.5 g/cm³', 'سائل أكثف من ١٫٥'], ['Any liquid', 'أي سائل'], ['None', 'لا شيء']],
        go: ['Set mass 1500 g and volume 1000 cm³, then raise the liquid density until it floats.', 'اجعل الكتلة ١٥٠٠ غ والحجم ١٠٠٠ سم³، ثم ارفع كثافة السائل حتى يطفو.'], ok: function (s) { return s.v('mass (g)') === 1500 && s.v('volume (cm³)') === 1000 && s.v('liquid density') > 1.5; },
        why: ['Its density is 1.5 g/cm³, so any liquid denser than that holds it up. Mercury, at 13.6 g/cm³, floats iron.', 'كثافته ١٫٥، فأي سائل أكثف يحمله. الزئبق بكثافة ١٣٫٦ يُطفي الحديد.'] }
    ]
  };

  /* ================= CHEMISTRY ================= */
  G.particles = {
    idea: ['Ice, water and steam are the same particles. Heating gives them energy: they vibrate in place, then slide past each other, then fly apart.', 'الجليد والماء والبخار جسيمات واحدة. التسخين يمنحها طاقة: تهتز في مكانها، ثم تنزلق، ثم تتباعد.'],
    real: ['Steam takes up about 1700 times the space of the water it came from: the power behind steam engines.', 'يشغل البخار نحو ١٧٠٠ ضعف حجم الماء الذي جاء منه، وهذه قوة المحركات البخارية.'],
    steps: [
      { q: ['At −20 °C, are the particles still?', 'عند −٢٠°، هل الجسيمات ساكنة؟'], o: [['No: they vibrate in fixed places', 'لا: تهتز في أماكن ثابتة'], ['Yes, completely still', 'نعم تمامًا'], ['They fly around', 'تتطاير']],
        go: ['Set the temperature to −20 °C.', 'اجعل الحرارة −٢٠°.'], ok: function (s) { return s.v('temperature') <= -20; },
        why: ['In a solid the particles are held in a pattern but never stop moving. Only at absolute zero, −273 °C, would they be still.', 'في الصلب تُمسك الجسيمات في نمط لكنها لا تتوقف أبدًا، ولا تسكن إلا عند الصفر المطلق −٢٧٣°.'] },
      { q: ['At 50 °C, the particles…', 'عند ٥٠°، الجسيمات…'], o: [['Slide past each other but stay close', 'تنزلق متقاربة'], ['Fill the whole box', 'تملأ الصندوق كله'], ['Stay in rows', 'تبقى صفوفًا']],
        go: ['Set the temperature to 50 °C.', 'اجعل الحرارة ٥٠°.'], ok: function (s) { var t = s.v('temperature'); return t >= 45 && t <= 55; },
        why: ['A liquid keeps its volume but takes its container’s shape: its particles still touch, but are free to move round each other.', 'السائل يحفظ حجمه ويأخذ شكل إنائه: جسيماته متلامسة لكنها حرة الحركة حول بعضها.'] },
      { q: ['Above 100 °C, they…', 'فوق ١٠٠°، تصبح…'], o: [['Spread out to fill all the space', 'منتشرة تملأ المكان كله'], ['Stay at the bottom', 'في القاع'], ['Melt', 'تذوب']],
        go: ['Set the temperature above 100 °C.', 'اجعل الحرارة فوق ١٠٠°.'], ok: function (s) { return s.v('temperature') > 100; },
        why: ['A gas’s particles move fast and far apart, so a gas fills any container and can be squashed.', 'جسيمات الغاز سريعة ومتباعدة، فيملأ أي إناء ويمكن ضغطه.'] }
    ]
  };
  G.titration = {
    idea: ['Adding alkali to acid neutralises it. Near the end the pH changes slowly, then jumps by several units with a few drops: the end point.', 'إضافة القلوي إلى الحمض تعادله. يتغير pH ببطء ثم يقفز عدة درجات ببضع قطرات عند نقطة النهاية.'],
    real: ['Chemists find the exact strength of vinegar, medicines and water supplies this way.', 'بهذه الطريقة يحدد الكيميائيون تركيز الخل والأدوية ومياه الشرب بدقة.'],
    steps: [
      { q: ['Where does the pH jump fastest?', 'أين يقفز pH أسرع؟'], o: [['Around 25 mL, the end point', 'قرب ٢٥ مل، نقطة النهاية'], ['At the start', 'في البداية'], ['At 50 mL', 'عند ٥٠ مل']],
        go: ['Add alkali until the indicator turns green (pH close to 7).', 'أضف القلوي حتى يخضرّ الكاشف (pH قرب ٧).'], ok: function (s) { return Math.abs(s.o('pH') - 7) < .6; },
        why: ['At 25 mL the alkali has exactly matched the acid, mole for mole. Half a millilitre either side swings the pH from about 3 to about 11.', 'عند ٢٥ مل يكافئ القلوي الحمض مولًا بمول، ونصف مل على أي جانب يحرّك pH من نحو ٣ إلى نحو ١١.'] },
      { q: ['Overshoot to 30 mL. The pH is about…', 'تجاوز إلى ٣٠ مل. يصبح pH نحو…'], o: [['12', '١٢'], ['8', '٨'], ['7', '٧']],
        go: ['Set alkali added to 30 mL.', 'اجعل القلوي المضاف ٣٠ مل.'], ok: function (s) { return s.v('add alkali') >= 30; },
        why: ['5 mL of spare alkali makes the solution strongly alkaline. That is why the last drops are added one at a time.', '٥ مل زائدة من القلوي تجعل المحلول قلويًا بشدة، ولهذا تُضاف القطرات الأخيرة واحدة واحدة.'] }
    ]
  };
  G.rate = {
    idea: ['Particles react only when they collide with enough energy. More particles or a higher temperature means more collisions, and more of them hard enough.', 'لا تتفاعل الجسيمات إلا إذا تصادمت بطاقة كافية. جسيمات أكثر أو حرارة أعلى تعني تصادمات أكثر وأقوى.'],
    real: ['Food lasts longer in a fridge, and an enzyme or catalyst lets reactions happen at lower energy.', 'يدوم الطعام أطول في الثلاجة، والمحفز يسمح بالتفاعل بطاقة أقل.'],
    steps: [
      { q: ['Double the particles. Collisions per second…', 'ضاعف الجسيمات. التصادمات في الثانية…'], o: [['Increase sharply', 'تزيد كثيرًا'], ['Stay the same', 'ثابتة'], ['Fall', 'تقل']],
        go: ['Set particles to 60 or more and watch the reading update.', 'اجعل الجسيمات ٦٠ أو أكثر وراقب القراءة.'], ok: function (s) { return s.v('particles') >= 60 && s.o('collisions per second') > 0; },
        why: ['A higher concentration crowds the particles, so they meet more often. Collisions grow faster than the number: each particle has more partners.', 'التركيز الأعلى يزحم الجسيمات فتلتقي أكثر، وتزيد التصادمات أسرع من العدد لأن لكل جسيم شركاء أكثر.'] },
      { q: ['At a very low temperature, do any collisions react?', 'عند حرارة منخفضة جدًا، هل تتفاعل التصادمات؟'], o: [['No: none has enough energy', 'لا: لا طاقة كافية'], ['Yes, the same as before', 'نعم كما كانت'], ['Even more', 'أكثر']],
        go: ['Set the temperature to 2.', 'اجعل الحرارة ٢.'], ok: function (s) { return s.v('temperature') <= 2; },
        why: ['Below the activation energy the particles just bounce off. Warming them a little can make the rate jump a lot.', 'تحت طاقة التنشيط ترتد الجسيمات فقط، وتدفئتها قليلًا قد ترفع السرعة كثيرًا.'] }
    ]
  };
  G.atom = {
    idea: ['The number of protons decides the element. Electrons fill shells around the nucleus, 2 then 8 then 8, and the outer ones decide how the atom reacts.', 'عدد البروتونات يحدد العنصر. وتملأ الإلكترونات المدارات ٢ ثم ٨ ثم ٨، والخارجية منها تحدد سلوك الذرة.'],
    real: ['Carbon’s four outer electrons let it make four bonds: the backbone of every living thing.', 'إلكترونات الكربون الخارجية الأربعة تتيح له أربع روابط: هيكل كل كائن حي.'],
    steps: [
      { q: ['Carbon has 6 protons. How many outer electrons?', 'للكربون ٦ بروتونات. كم إلكترونًا خارجيًا؟'], o: [['4', '٤'], ['6', '٦'], ['2', '٢']],
        go: ['Set protons to 6.', 'اجعل البروتونات ٦.'], ok: function (s) { return s.v('protons') === 6; },
        why: ['2 fill the first shell, leaving 4 in the second. It shares those four to make four bonds.', '٢ تملأ المدار الأول ويبقى ٤ في الثاني، ويشاركها ليصنع أربع روابط.'] },
      { q: ['Which element has a full outer shell with 10 protons?', 'أي عنصر مداره الخارجي ممتلئ بـ١٠ بروتونات؟'], o: [['Neon: it hardly reacts', 'النيون: لا يكاد يتفاعل'], ['Sodium', 'الصوديوم'], ['Oxygen', 'الأكسجين']],
        go: ['Set protons to 10.', 'اجعل البروتونات ١٠.'], ok: function (s) { return s.v('protons') === 10; },
        why: ['2 + 8 fills both shells. A full shell is stable: the noble gases barely react, which is why neon signs are safe.', '٢ + ٨ تملأ المدارين. المدار الممتلئ مستقر، فالغازات النبيلة لا تكاد تتفاعل.'] },
      { q: ['Add one proton: 11. That element…', 'أضف بروتونًا: ١١. هذا العنصر…'], o: [['Sodium: one lonely outer electron, very reactive', 'الصوديوم: إلكترون خارجي وحيد، شديد التفاعل'], ['Neon again', 'النيون مجددًا'], ['Unreactive', 'خامل']],
        go: ['Set protons to 11.', 'اجعل البروتونات ١١.'], ok: function (s) { return s.v('protons') === 11; },
        why: ['The 11th electron starts a new shell alone and is easily given away, so sodium reacts violently with water.', 'الإلكترون الحادي عشر يبدأ مدارًا جديدًا وحده ويُعطى بسهولة، فيتفاعل الصوديوم بعنف مع الماء.'] }
    ]
  };

  /* ================= BIOLOGY ================= */
  G.predator = {
    idea: ['Prey grow when predators are few. Then predators, well fed, multiply and eat the prey down, then starve and fall. The two curves chase each other.', 'تكثر الفرائس حين يقل المفترسون، ثم يتكاثر المفترسون شبعًا ويقللون الفرائس، ثم يجوعون فيقلون. والمنحنيان يتطاردان.'],
    real: ['Fur-trading records of lynx and hares in Canada show this cycle over a hundred years.', 'سجلات تجارة الفراء في كندا للوشق والأرانب تظهر هذه الدورة على مدى مئة عام.'],
    steps: [
      { q: ['When the prey peak, what do predators do next?', 'حين تبلغ الفرائس ذروتها، ماذا يفعل المفترسون؟'], o: [['Rise, a little later', 'يكثرون بعدها بقليل'], ['Fall at once', 'يقلّون فورًا'], ['Nothing', 'لا شيء']],
        go: ['Raise prey births to 1.5 and compare the peaks of the green and red curves.', 'ارفع مواليد الفريسة إلى ١٫٥ وقارن قمم المنحنيين.'], ok: function (s) { return s.v('prey births') >= 1.5; },
        why: ['The red peak always comes after the green: predators need time to breed on plenty. More prey births make both peaks higher.', 'قمة الأحمر تأتي دائمًا بعد الأخضر: المفترسون يحتاجون وقتًا ليتكاثروا. وزيادة مواليد الفريسة ترفع القمتين.'] },
      { q: ['Make hunting more successful. The prey…', 'اجعل الصيد أنجح. الفرائس…'], o: [['Peak lower, and predators gain little', 'ذروتها أدنى، ولا يستفيد المفترسون كثيرًا'], ['Vanish for ever', 'تنقرض'], ['Grow more', 'تكثر']],
        go: ['Raise hunting to 0.2 or more.', 'ارفع الصيد إلى ٠٫٢ أو أكثر.'], ok: function (s) { return s.v('hunting') >= .2; },
        why: ['Better hunters keep the prey lower, and so their own food lower too. Balance, not the strongest side, decides the numbers.', 'الصيادون الأمهر يُبقون الفرائس أقل، فيقل طعامهم أيضًا. التوازن لا القوة يحدد الأعداد.'] }
    ]
  };
  G.punnett = {
    idea: ['Each parent passes on one of their two copies of a gene. B (dominant) shows whenever it is there; b (recessive) shows only in bb.', 'كل والد يورث نسخة من نسختيه للجين. B السائد يظهر متى وُجد، وb المتنحي لا يظهر إلا في bb.'],
    real: ['Doctors use these squares to tell families the chance of passing on conditions such as sickle-cell or thalassaemia.', 'يستعمل الأطباء هذه المربعات لإخبار العائلات باحتمال توريث أمراض مثل فقر الدم المنجلي والثلاسيميا.'],
    steps: [
      { q: ['Two Bb parents. The chance of a bb child is…', 'والدان Bb. احتمال طفل bb…'], o: [['25%', '٢٥٪'], ['50%', '٥٠٪'], ['0%', '٠٪']],
        go: ['Set both parents to Bb (1).', 'اجعل الوالدين Bb (١).'], ok: function (s) { return s.v('parent 1: 0 BB, 1 Bb, 2 bb') === 1 && s.v('parent 2: 0 BB, 1 Bb, 2 bb') === 1; },
        why: ['One square in four is bb. Neither parent shows the trait, yet one child in four may: it was hidden, carried.', 'مربع من أربعة bb. لا يظهر الصفة على أي من الوالدين، وقد تظهر على طفل من أربعة: كانت محمولة مخفية.'] },
      { q: ['BB with bb: will any child show the recessive trait?', 'BB مع bb: هل تظهر الصفة المتنحية على أي طفل؟'], o: [['None: every child is Bb', 'لا أحد: كلهم Bb'], ['Half', 'النصف'], ['All', 'كلهم']],
        go: ['Set parent 1 to BB (0) and parent 2 to bb (2).', 'اجعل الوالد ١ BB (٠) والوالد ٢ bb (٢).'], ok: function (s) { return s.v('parent 1: 0 BB, 1 Bb, 2 bb') === 0 && s.v('parent 2: 0 BB, 1 Bb, 2 bb') === 2; },
        why: ['Every child gets B from one parent and b from the other. All are carriers; none shows it.', 'كل طفل يأخذ B من والد وb من الآخر. كلهم حاملون ولا يظهر على أحد.'] }
    ]
  };
  G.enzyme = {
    idea: ['Enzymes are proteins that speed reactions up. Warmth helps, up to a best temperature; past it the enzyme’s shape breaks, and in a living cell it does not come back.', 'الإنزيمات بروتينات تسرّع التفاعلات. الدفء يساعد حتى حرارة مثلى، وبعدها يتلف شكل الإنزيم ولا يعود في الخلية الحية.'],
    real: ['A high fever is dangerous partly because the body’s enzymes start to lose their shape.', 'الحمى الشديدة خطرة جزئيًا لأن إنزيمات الجسم تبدأ تفقد شكلها.'],
    steps: [
      { q: ['What is the best temperature for this human enzyme?', 'ما الحرارة المثلى لهذا الإنزيم البشري؟'], o: [['About 40 °C, near body temperature', 'نحو ٤٠°، قرب حرارة الجسم'], ['0 °C', '٠°'], ['80 °C', '٨٠°']],
        go: ['Find the temperature with the highest rate.', 'جد الحرارة التي تعطي أعلى سرعة.'], ok: function (s) { return s.o('reaction rate') >= 99; },
        why: ['Our enzymes evolved to work best at the temperature our bodies keep. Enzymes in hot-spring bacteria peak near 70 °C.', 'إنزيماتنا تعمل أفضل عند حرارة أجسامنا، وإنزيمات بكتيريا الينابيع الحارة تبلغ ذروتها قرب ٧٠°.'] },
      { q: ['At 60 °C the rate…', 'عند ٦٠° السرعة…'], o: [['Falls fast: the enzyme is losing its shape', 'تنهار: الإنزيم يفقد شكله'], ['Keeps rising', 'تستمر بالزيادة'], ['Stays the best', 'تبقى المثلى']],
        go: ['Set the temperature to 60 °C.', 'اجعل الحرارة ٦٠°.'], ok: function (s) { return s.v('temperature') >= 58; },
        why: ['Heat shakes apart the bonds holding the active site in shape, so the substrate no longer fits. This is denaturing: cooling does not repair it.', 'الحرارة تفك الروابط التي تحفظ شكل الموقع النشط فلا تلائمه المادة، وهذا هو التلف: التبريد لا يصلحه.'] }
    ]
  };
  G.diffusion = {
    idea: ['Particles move at random. Where they are crowded, more of them happen to move away than towards, so they spread from high concentration to low.', 'تتحرك الجسيمات عشوائيًا. حيث تتزاحم يبتعد منها أكثر مما يقترب، فتنتشر من التركيز العالي إلى المنخفض.'],
    real: ['Oxygen reaches your blood from your lungs, and a scent fills a room, by diffusion.', 'يصل الأكسجين من رئتيك إلى دمك، وتملأ الرائحة الغرفة، بالانتشار.'],
    steps: [
      { q: ['Remove the wall. Where do the particles end up?', 'أزل الحاجز. أين تستقر الجسيمات؟'], o: [['Spread evenly, about 60 each side', 'موزعة بالتساوي، نحو ٦٠ لكل جانب'], ['All stay left', 'كلها يسارًا'], ['All go right', 'كلها يمينًا']],
        go: ['Press Remove the wall and wait until the right side has 45 or more.', 'اضغط أزل الحاجز وانتظر حتى يبلغ اليمين ٤٥ أو أكثر.'], ok: function (s) { return s.o('right') >= 45; },
        why: ['No particle wants to move right: each wanders at random. The net flow stops when both sides are equal, though the particles keep moving.', 'لا جسيم يريد الذهاب يمينًا: كل منها يتجول عشوائيًا. يتوقف الانتقال الصافي حين يتساوى الجانبان، والجسيمات ما زالت تتحرك.'] }
    ]
  };

  /* ================= COMPUTING AND AI ================= */
  G.sort = {
    idea: ['Bubble sort compares neighbours again and again; merge sort sorts halves and then merges them. For many items the difference in work is enormous.', 'ترتيب الفقاعة يقارن المتجاورات مرارًا، وترتيب الدمج يرتب الأنصاف ثم يدمجها. ومع العناصر الكثيرة يكون الفرق في العمل هائلًا.'],
    real: ['Sorting a million names: bubble sort needs about half a trillion comparisons, merge sort about 20 million.', 'لترتيب مليون اسم يحتاج الفقاعي نحو نصف تريليون مقارنة، والدمج نحو ٢٠ مليونًا.'],
    steps: [
      { q: ['Which needs fewer comparisons for 40 numbers?', 'أيهما يحتاج مقارنات أقل لـ٤٠ عددًا؟'], o: [['Merge sort', 'الدمج'], ['Bubble sort', 'الفقاعي'], ['The same', 'متساويان']],
        go: ['Run Bubble sort to 100%.', 'شغّل الترتيب الفقاعي حتى ١٠٠٪.'], ok: function (s) { return s.sel !== 'Merge sort' && s.o('done') >= 100; },
        why: ['Bubble sort made 780 comparisons: about n² ÷ 2. Each pass moves only one number into place.', 'أجرى الفقاعي ٧٨٠ مقارنة، نحو n² ÷ ٢، لأن كل دورة تضع عددًا واحدًا في مكانه.'] },
      { q: ['Now Merge sort. Its comparisons will be…', 'الآن الدمج. مقارناته…'], o: [['About a quarter as many', 'نحو الربع'], ['About the same', 'نحو نفسها'], ['More', 'أكثر']],
        go: ['Choose Merge sort and let it reach 100%.', 'اختر الدمج ودعه يصل ١٠٠٪.'], ok: function (s) { return s.sel === 'Merge sort' && s.o('done') >= 100; },
        why: ['Merge sort needs about n log₂ n: under 200 here. Splitting a problem in halves is one of the great ideas of computing.', 'يحتاج الدمج نحو n log₂ n، أقل من ٢٠٠ هنا. تقسيم المسألة أنصافًا من أعظم أفكار الحوسبة.'] }
    ]
  };
  G.binary = {
    idea: ['A computer stores everything as bits, 0 or 1. Each place is worth twice the one to its right: 1, 2, 4, 8, 16, 32, 64, 128.', 'يخزن الحاسوب كل شيء خانات ٠ أو ١، وكل خانة قيمتها ضعف التي على يمينها: ١، ٢، ٤، ٨، ١٦، ٣٢، ٦٤، ١٢٨.'],
    real: ['Every letter you type is a number like these: A is 65, and Arabic letters have numbers of their own in Unicode.', 'كل حرف تكتبه عدد كهذه: A هو ٦٥، وللحروف العربية أرقامها في يونيكود.'],
    steps: [
      { q: ['Which bits make 5?', 'أي الخانات تصنع ٥؟'], o: [['4 and 1', '٤ و١'], ['5', '٥'], ['2 and 3', '٢ و٣']],
        go: ['Tap the bits until the decimal reads 5.', 'انقر الخانات حتى يصبح العشري ٥.'], ok: function (s) { return s.o('decimal') === 5; },
        why: ['5 = 4 + 1, written 00000101. Every whole number has exactly one way to be written in binary.', '٥ = ٤ + ١، وتكتب 00000101. لكل عدد صحيح طريقة واحدة فقط للكتابة الثنائية.'] },
      { q: ['The biggest number 8 bits can hold is…', 'أكبر عدد تحمله ٨ خانات…'], o: [['255', '٢٥٥'], ['256', '٢٥٦'], ['128', '١٢٨']],
        go: ['Make 255.', 'اصنع ٢٥٥.'], ok: function (s) { return s.o('decimal') === 255; },
        why: ['All eight on: 128 + 64 + … + 1 = 255 = 2⁸ − 1. Eight bits make one byte, with 256 possible values counting zero.', 'كل الخانات مضاءة: ١٢٨ + ٦٤ + … + ١ = ٢٥٥ = ٢⁸ − ١. ثماني خانات بايت واحد، له ٢٥٦ قيمة مع الصفر.'] },
      { q: ['Make the capital letter A.', 'اصنع الحرف A.'], o: [['65', '٦٥'], ['1', '١'], ['97', '٩٧']],
        go: ['Make 65 and read the character.', 'اصنع ٦٥ واقرأ الحرف.'], ok: function (s) { return s.o('decimal') === 65; },
        why: ['65 is A, 66 is B, and lower-case a is 97. Text is numbers that everyone agreed to read as letters.', '٦٥ هو A و٦٦ هو B، وa الصغير ٩٧. النص أعداد اتفق الجميع على قراءتها حروفًا.'] }
    ]
  };
  G.gates = {
    idea: ['A logic gate takes 0s and 1s and gives a 0 or 1 by a fixed rule. Millions of them, wired together, make a processor.', 'البوابة المنطقية تأخذ أصفارًا وآحادًا وتعطي ٠ أو ١ بقاعدة ثابتة، وملايين منها موصولة تصنع المعالج.'],
    real: ['The adder in every calculator is built from XOR and AND gates exactly like the half adder shown here.', 'الجامع في كل آلة حاسبة مبني من بوابات XOR وAND تمامًا كالجامع النصفي هنا.'],
    steps: [
      { q: ['AND gives 1 when…', 'تعطي AND الرقم ١ حين…'], o: [['Both inputs are 1', 'يكون المدخلان ١'], ['Either is 1', 'يكون أحدهما ١'], ['Both are 0', 'يكونان ٠']],
        go: ['Choose AND and make the output 1.', 'اختر AND واجعل المخرج ١.'], ok: function (s) { return s.sel === 'AND' && s.o('output') === 1; },
        why: ['Only A = 1 and B = 1 lights it. AND is how a computer checks two conditions at once.', 'لا يضيئها إلا A = 1 وB = 1. بها يتحقق الحاسوب من شرطين معًا.'] },
      { q: ['XOR gives 1 when…', 'تعطي XOR الرقم ١ حين…'], o: [['The inputs differ', 'يختلف المدخلان'], ['Both are 1', 'يكونان ١'], ['Always', 'دائمًا']],
        go: ['Choose XOR and make the output 1.', 'اختر XOR واجعل المخرج ١.'], ok: function (s) { return s.sel === 'XOR' && s.o('output') === 1; },
        why: ['XOR is 1 for 1 + 0 and 0 + 1, and 0 for 1 + 1, which is the last digit of a binary sum. AND gives the carry: together, a half adder.', 'XOR تعطي ١ لـ١ + ٠ و٠ + ١، و٠ لـ١ + ١، وهو آخر رقم في الجمع الثنائي، وAND تعطي الحمل: معًا جامع نصفي.'] }
    ]
  };
  G.descent = {
    idea: ['Machine learning means lowering a loss, a measure of how wrong a model is. Gradient descent feels the slope and takes a step downhill, again and again.', 'تعلم الآلة يعني خفض الخطأ. الانحدار التدريجي يتحسس الميل ويخطو نزولًا مرة بعد مرة.'],
    real: ['Every AI model, from voice recognition to translation, was trained by billions of steps like these.', 'كل نموذج ذكاء اصطناعي، من التعرف على الصوت إلى الترجمة، دُرّب بمليارات الخطوات كهذه.'],
    steps: [
      { q: ['With small steps (rate 0.1), will the loss go down?', 'بخطوات صغيرة (المعدل ٠٫١)، هل ينزل الخطأ؟'], o: [['Yes, steadily', 'نعم بثبات'], ['No', 'لا'], ['It jumps about', 'يقفز عشوائيًا']],
        go: ['Keep the learning rate near 0.1 and press ×10 three times.', 'أبقِ معدل التعلم قرب ٠٫١ واضغط ×١٠ ثلاث مرات.'], ok: function (s) { return s.v('learning rate') <= .3 && s.o('steps') >= 30; },
        why: ['Each step moves against the slope, so the loss falls and the steps shrink as the ground flattens near the bottom.', 'كل خطوة عكس الميل فينخفض الخطأ، وتصغر الخطوات كلما استوى المنحدر قرب القاع.'] },
      { q: ['Now a huge learning rate of 2. What happens?', 'الآن معدل كبير ٢. ماذا يحدث؟'], o: [['It overshoots and bounces about', 'يتجاوز ويقفز هنا وهناك'], ['It reaches the bottom faster', 'يصل القاع أسرع'], ['Nothing', 'لا شيء']],
        go: ['Set the learning rate to 2 or more, then press Step a few times.', 'اجعل المعدل ٢ أو أكثر ثم اضغط خطوة عدة مرات.'], ok: function (s) { return s.v('learning rate') >= 2 && s.b('Step') >= 3; },
        why: ['Steps too big leap over the valley. Choosing the learning rate is one of the first things AI engineers tune.', 'الخطوات الكبيرة تقفز فوق الوادي، واختيار معدل التعلم من أول ما يضبطه مهندسو الذكاء الاصطناعي.'] },
      { q: ['Start somewhere else. Does it always reach the lowest point?', 'ابدأ من مكان آخر. هل يصل دائمًا إلى أدنى نقطة؟'], o: [['No: it can settle in a smaller dip', 'لا: قد يستقر في حفرة أصغر'], ['Yes, always', 'نعم دائمًا'], ['It never stops', 'لا يتوقف']],
        go: ['Set the rate back near 0.1, press New start, then ×10 a few times. Try twice.', 'أعد المعدل قرب ٠٫١ واضغط بداية جديدة ثم ×١٠ عدة مرات. جرّب مرتين.'], ok: function (s) { return s.b('New start') >= 2 && s.v('learning rate') <= .3; },
        why: ['The curve has more than one valley. Starting on the wrong side traps it in a local minimum: one reason AI training restarts from many places.', 'للمنحنى أكثر من وادٍ، والبدء في الجهة الخاطئة يحبسه في قاع محلي، ولهذا يُعاد التدريب من نقاط كثيرة.'] }
    ]
  };
  G.neuron = {
    idea: ['An artificial neuron weighs its inputs, adds them and decides yes or no. Training nudges the weights after every mistake until the line between the groups is right.', 'العصبون الاصطناعي يزن مدخلاته ويجمعها ويقرر نعم أو لا. التدريب يعدّل الأوزان بعد كل خطأ حتى يصح الحد بين المجموعتين.'],
    real: ['Spam filters began as a single neuron like this one, weighing words.', 'بدأت مرشحات البريد المزعج بعصبون واحد كهذا يزن الكلمات.'],
    steps: [
      { q: ['Train it. Can one neuron separate the two groups?', 'درّبه. هل يفصل عصبون واحد بين المجموعتين؟'], o: [['Yes, with a straight line', 'نعم بخط مستقيم'], ['No', 'لا'], ['Only with a circle', 'بدائرة فقط']],
        go: ['Press Train 100 until the accuracy is 95% or more.', 'اضغط درّب ١٠٠ حتى تبلغ الدقة ٩٥٪ أو أكثر.'], ok: function (s) { return s.o('accuracy') >= 95; },
        why: ['The weights settled so the coloured boundary runs between the groups. Each mistake moved them a little: that is learning.', 'استقرت الأوزان فصار الحد الملوّن بين المجموعتين، وكل خطأ حرّكها قليلًا: هذا هو التعلم.'] },
      { q: ['Put a red point in the middle of the green ones. Can one neuron still get every point right?', 'ضع نقطة حمراء وسط الخضراء. هل يصيب عصبون واحد كل النقاط؟'], o: [['No: one neuron draws only one straight line', 'لا: العصبون الواحد يرسم خطًا مستقيمًا واحدًا'], ['Yes, with more training', 'نعم بتدريب أكثر'], ['Yes, at once', 'نعم فورًا']],
        go: ['Choose Add red, tap among the green points, then Train 100 twice.', 'اختر أضف أحمر، انقر بين الخضراء، ثم درّب ١٠٠ مرتين.'], ok: function (s) { return s.sel === 'Add red' && s.b('Train 100') >= 3; },
        why: ['No straight line can cut out one point in the middle. Stacking neurons in layers lets a network bend its boundary: deep learning.', 'لا خط مستقيم يعزل نقطة في الوسط. رصّ العصبونات طبقات يسمح للشبكة بثني حدها: التعلم العميق.'] }
    ]
  };
  G.path = {
    idea: ['Breadth-first search explores outwards in rings from the start, one step further each time. The first time it touches the goal, it has found a shortest route.', 'البحث بالعرض يستكشف حلقات من البداية خطوة بعد خطوة، وأول ما يلمس الهدف يكون قد وجد أقصر طريق.'],
    real: ['Map apps, network routers and game characters find their way with searches built on this idea.', 'تطبيقات الخرائط وموجهات الشبكات وشخصيات الألعاب تجد طريقها ببحث قائم على هذه الفكرة.'],
    steps: [
      { q: ['With no walls, how long is the shortest route corner to corner?', 'بلا جدران، كم طول أقصر طريق من ركن إلى ركن؟'], o: [['30 steps: 17 across and 13 down', '٣٠ خطوة: ١٧ أفقيًا و١٣ رأسيًا'], ['18 steps', '١٨ خطوة'], ['It depends', 'يعتمد']],
        go: ['Press Clear.', 'اضغط مسح.'], ok: function (s) { return s.b('Clear') > 0 && s.o('path length') === 30; },
        why: ['Moving only across and down, you must cover all 17 columns and 13 rows: 30 steps, and many different routes share that length.', 'بالحركة الأفقية والرأسية فقط عليك عبور ١٧ عمودًا و١٣ صفًا: ٣٠ خطوة، وطرق كثيرة لها الطول نفسه.'] },
      { q: ['Draw a long wall. The search will…', 'ارسم جدارًا طويلًا. البحث سوف…'], o: [['Still find the shortest way round', 'يجد أقصر طريق حوله'], ['Get stuck', 'يعلق'], ['Go through it', 'يخترقه']],
        go: ['Draw walls until the path is longer than 34.', 'ارسم جدرانًا حتى يزيد الطريق على ٣٤.'], ok: function (s) { return s.o('path length') > 34; },
        why: ['It searched more cells but still took the shortest detour. Searching in rings guarantees that, at the cost of looking everywhere nearby.', 'بحث في خلايا أكثر لكنه أخذ أقصر التفاف. البحث بالحلقات يضمن ذلك، على حساب النظر في كل ما حوله.'] }
    ]
  };

  /* ================= ENGINEERING ================= */
  G.gears = {
    idea: ['Two meshed gears trade speed for turning force. A small gear driving a big one turns it slower but with more force, by the ratio of their teeth.', 'الترسان المتعشقان يبادلان السرعة بقوة الدوران. الترس الصغير يدير الكبير أبطأ بقوة أكبر، بنسبة أسنانهما.'],
    real: ['A bicycle’s low gear helps you climb hills; its high gear lets you go fast on the flat.', 'الترس المنخفض في الدراجة يساعدك على صعود التلال، والمرتفع يسرّعك على الأرض المستوية.'],
    steps: [
      { q: ['A 12-tooth gear drives a 36-tooth gear at 60 rpm. The big gear turns at…', 'ترس ١٢ سنًا يدير ترسًا ٣٦ سنًا بسرعة ٦٠ دورة. الكبير يدور بـ…'], o: [['20 rpm, with 3 times the force', '٢٠ دورة بثلاثة أضعاف القوة'], ['180 rpm', '١٨٠ دورة'], ['60 rpm', '٦٠ دورة']],
        go: ['Set driver 12, driven 36, input 60 rpm.', 'اجعل الدافع ١٢ والمدفوع ٣٦ والسرعة ٦٠.'], ok: function (s) { return s.v('driver teeth') === 12 && s.v('driven teeth') === 36 && s.v('input rpm') === 60; },
        why: ['Each turn of the small gear moves the big one only 12 of its 36 teeth: a third of a turn, with three times the turning force.', 'كل دورة للصغير تحرك الكبير ١٢ سنًا من ٣٦: ثلث دورة، بثلاثة أضعاف قوة الدوران.'] },
      { q: ['Swap them: 36 driving 12. Now…', 'اقلبهما: ٣٦ يدير ١٢. الآن…'], o: [['Three times faster, a third of the force', 'أسرع ثلاث مرات وثلث القوة'], ['Slower', 'أبطأ'], ['The same', 'كما هو']],
        go: ['Set driver 36 and driven 12.', 'اجعل الدافع ٣٦ والمدفوع ١٢.'], ok: function (s) { return s.v('driver teeth') >= 30 && s.v('driven teeth') === 12; },
        why: ['Speed up and force down by the same ratio: a gear never gives more of both. Energy is conserved.', 'ترتفع السرعة وتنقص القوة بالنسبة نفسها: لا يعطي الترس المزيد من الاثنين معًا. الطاقة محفوظة.'] }
    ]
  };
  G.lever = {
    idea: ['A lever balances when the moments match: force × distance from the pivot is the same on both sides.', 'تتوازن الرافعة حين يتساوى العزمان: القوة × البعد عن المحور متساويان على الجانبين.'],
    real: ['Archimedes said: give me a place to stand and a long enough lever, and I will move the Earth. Crowbars, scissors and seesaws all use this.', 'قال أرخميدس: أعطني موضع قدم ورافعة طويلة أحرك الأرض. والعتلة والمقص والأرجوحة تعمل بهذا.'],
    steps: [
      { q: ['20 N sits 4 m to the left. Where must 10 N go on the right to balance?', '٢٠ نيوتن على بعد ٤ م يسارًا. أين يوضع ١٠ نيوتن يمينًا ليتوازن؟'], o: [['8 m', '٨ م'], ['4 m', '٤ م'], ['2 m', '٢ م']],
        go: ['Left: 20 N at 4 m. Right: 10 N. Balance it.', 'اليسار: ٢٠ نيوتن على ٤ م. اليمين: ١٠ نيوتن. وازنها.'], ok: function (s) { return s.v('left force') === 20 && s.v('left distance') === 4 && s.v('right force') === 10 && s.v('right distance') === 8; },
        why: ['20 × 4 = 80 = 10 × 8. Half the force needs twice the distance.', '٢٠ × ٤ = ٨٠ = ١٠ × ٨. نصف القوة يحتاج ضعف البعد.'] },
      { q: ['Can 10 N lift 60 N?', 'هل يرفع ١٠ نيوتن ٦٠ نيوتن؟'], o: [['Yes, from 6 times as far out', 'نعم من بعد أكبر بست مرات'], ['Never', 'أبدًا'], ['Only if they are equal', 'فقط إن تساويا']],
        go: ['Put 60 N on the left at 1 m and balance it with 10 N on the right.', 'ضع ٦٠ نيوتن يسارًا على ١ م ووازنها بـ١٠ نيوتن يمينًا.'], ok: function (s) { return s.v('left force') === 60 && s.v('left distance') === 1 && s.v('right force') === 10 && s.v('right distance') === 6; },
        why: ['60 × 1 = 10 × 6. The small force moves 6 times further than the load: you trade distance for force.', '٦٠ × ١ = ١٠ × ٦. القوة الصغيرة تتحرك ست مرات أبعد من الحمل: تبادل المسافة بالقوة.'] }
    ]
  };
  G.beam = {
    idea: ['A beam’s stiffness grows with its width but with the cube of its depth. Its sag grows with the cube of its span.', 'تزيد صلابة العارضة مع عرضها، لكن مع مكعب عمقها. ويزيد انحناؤها مع مكعب طولها.'],
    real: ['Floor joists and steel I-beams are tall and thin, not wide and flat, for exactly this reason.', 'روافد الأرضيات والعوارض الفولاذية طويلة رفيعة لا عريضة مسطحة، لهذا السبب بالذات.'],
    steps: [
      { q: ['Double the width, or double the depth: which helps more?', 'ضاعف العرض أم العمق: أيهما أنفع؟'], o: [['Depth: 8 times stiffer', 'العمق: أصلب ٨ مرات'], ['Width', 'العرض'], ['The same', 'متساويان']],
        go: ['Set width 10 and depth 40.', 'اجعل العرض ١٠ والعمق ٤٠.'], ok: function (s) { return s.v('width') === 10 && s.v('depth') >= 40; },
        why: ['Stiffness I = width × depth³ ÷ 12. Doubling depth multiplies it by 2³ = 8; doubling width only by 2.', 'الصلابة I = العرض × العمق³ ÷ ١٢. مضاعفة العمق تضربها في ٨، ومضاعفة العرض في ٢ فقط.'] },
      { q: ['Double the span from 8 to 16. The sag becomes…', 'ضاعف الطول من ٨ إلى ١٦. يصبح الانحناء…'], o: [['8 times bigger', 'أكبر ٨ مرات'], ['Twice as big', 'ضعفين'], ['The same', 'كما هو']],
        go: ['Set the span to 16.', 'اجعل الطول ١٦.'], ok: function (s) { return s.v('span') === 16; },
        why: ['Sag grows with span³: 2³ = 8. Long bridges need supports, arches or cables for this reason.', 'يزيد الانحناء مع مكعب الطول: ٢³ = ٨، ولهذا تحتاج الجسور الطويلة دعامات أو أقواسًا أو كوابل.'] }
    ]
  };
  G.pid = {
    idea: ['A controller steers a system to a target. P reacts to the error now, I to the error that has built up, D to how fast the error is changing.', 'المتحكم يقود النظام إلى هدف: P يستجيب للخطأ الآن، وI للخطأ المتراكم، وD لسرعة تغير الخطأ.'],
    real: ['Cruise control, ovens, drones and the autopilots of aircraft all run controllers like this.', 'مثبت السرعة والأفران والطائرات المسيّرة والطيار الآلي كلها تعمل بمتحكمات كهذه.'],
    steps: [
      { q: ['Turn Kp up high. The response will…', 'ارفع Kp كثيرًا. الاستجابة سوف…'], o: [['Overshoot the target and wobble', 'تتجاوز الهدف وتتذبذب'], ['Become smoother', 'تصبح أنعم'], ['Stop moving', 'تتوقف']],
        go: ['Set Kp to 5 or more.', 'اجعل Kp خمسة أو أكثر.'], ok: function (s) { return s.v('Kp') >= 5; },
        why: ['A strong push towards the target builds speed it cannot shed in time, so it overshoots and swings.', 'الدفع القوي نحو الهدف يكسبه سرعة لا يتخلص منها في الوقت، فيتجاوز ويتأرجح.'] },
      { q: ['Now add Kd. The wobble…', 'أضف Kd. التذبذب…'], o: [['Calms down', 'يهدأ'], ['Gets worse', 'يزيد'], ['Does not change', 'لا يتغير']],
        go: ['With Kp at 5 or more, raise Kd to 1 or more.', 'مع Kp خمسة أو أكثر، ارفع Kd إلى ١ أو أكثر.'], ok: function (s) { return s.v('Kp') >= 5 && s.v('Kd') >= 1; },
        why: ['D brakes when the error is shrinking fast, like easing off before a red light. The overshoot falls.', 'يكبح D حين يصغر الخطأ بسرعة، كتخفيف السرعة قبل الإشارة الحمراء، فيقل التجاوز.'] },
      { q: ['With small Kp the output stops short of the target. What fixes that?', 'مع Kp صغير يقف المخرج دون الهدف. ما الذي يصلحه؟'], o: [['Ki: it adds up the remaining error', 'Ki: يجمع الخطأ المتبقي'], ['More Kd', 'Kd أكثر'], ['Nothing can', 'لا شيء']],
        go: ['Set Kp to 1 and raise Ki to 0.3 or more.', 'اجعل Kp واحدًا وارفع Ki إلى ٠٫٣ أو أكثر.'], ok: function (s) { return near(s.v('Kp'), 1, .15) && s.v('Ki') >= .3; },
        why: ['A small steady error keeps adding up in I until the push is enough to close the gap.', 'الخطأ الصغير الثابت يتراكم في I حتى يكفي الدفع لسد الفجوة.'] }
    ]
  };

  /* ================= ARABIC AND ISLAMIC ================= */
  G.letters = {
    idea: ['Arabic is joined writing. Most letters take a different shape at the start, middle and end of a word, and six never join to the letter after them: ا د ذ ر ز و.', 'العربية كتابة متصلة. لأغلب الحروف شكل في أول الكلمة ووسطها وآخرها، وستة لا تتصل بما بعدها: ا د ذ ر ز و.'],
    real: ['Every Arabic keyboard and screen chooses the right shape for each letter as you type, by these rules.', 'كل لوحة مفاتيح وشاشة عربية تختار الشكل الصحيح لكل حرف وأنت تكتب، بهذه القواعد.'],
    steps: [
      { q: ['In مسجد, does each letter look as it does alone?', 'في «مسجد»، هل يبدو كل حرف كما يبدو منفردًا؟'], o: [['No, joined letters change shape', 'لا، تتغير أشكال الحروف المتصلة'], ['Yes', 'نعم'], ['Only the first', 'الأول فقط']],
        go: ['Press مسجد and compare the word with its letters alone.', 'اضغط «مسجد» وقارن الكلمة بحروفها منفردة.'], ok: function (s) { return s.b('مسجد') > 0; },
        why: ['م, س and ج are shortened to join, and only د keeps its full form at the end. Reading Arabic means knowing each letter by its family shape.', 'تقصر م وس وج لتتصل، ولا يبقى بشكله الكامل إلا د في الآخر. قراءة العربية معرفة كل حرف بشكله الأساسي.'] },
      { q: ['In سلام, where does the word break?', 'في «سلام»، أين تنقطع الكلمة؟'], o: [['After ا: it never joins forward', 'بعد الألف: لا تتصل بما بعدها'], ['After س', 'بعد السين'], ['It does not break', 'لا تنقطع']],
        go: ['Press سلام.', 'اضغط «سلام».'], ok: function (s) { return s.b('سلام') > 0; },
        why: ['ا joins to the letter before it but not after, so م starts fresh. One word can have several pieces.', 'تتصل الألف بما قبلها لا بما بعدها، فتبدأ الميم من جديد. وقد تكون للكلمة الواحدة عدة أجزاء.'] }
    ]
  };
  G.moon = {
    idea: ['The moon is always half lit by the sun. As it circles the Earth over 29 or 30 days we see more or less of that lit half: the phases.', 'نصف القمر مضاء دائمًا بالشمس، وحين يدور حول الأرض في ٢٩ أو ٣٠ يومًا نرى منه أكثر أو أقل: هذه منازله.'],
    real: ['The Hijri calendar follows the moon: each month begins when the new crescent is seen after sunset.', 'يتبع التقويم الهجري القمر: يبدأ الشهر برؤية الهلال بعد غروب الشمس.'],
    steps: [
      { q: ['On the 14th or 15th of a Hijri month, the moon is…', 'في ١٤ أو ١٥ من الشهر الهجري يكون القمر…'], o: [['Full', 'بدرًا'], ['New', 'محاقًا'], ['Half', 'نصفًا']],
        go: ['Set the day to 15.', 'اجعل اليوم ١٥.'], ok: function (s) { return s.v('day of the month') === 15; },
        why: ['Mid-month the moon is opposite the sun, so we see its whole lit face. The 13th, 14th and 15th are the white days, when the Sunnah encourages fasting.', 'في منتصف الشهر يقابل القمر الشمس فنرى وجهه المضاء كله. والثالث عشر والرابع عشر والخامس عشر هي الأيام البيض التي يُستحب صيامها في السنة.'] },
      { q: ['A new Hijri month begins when…', 'يبدأ الشهر الهجري حين…'], o: [['The thin crescent is seen after sunset', 'يُرى الهلال بعد الغروب'], ['The moon is full', 'يكتمل البدر'], ['The moon disappears', 'يختفي القمر']],
        go: ['Set the day to 1 or 2.', 'اجعل اليوم ١ أو ٢.'], ok: function (s) { return s.v('day of the month') <= 2; },
        why: ['Just after the new moon a thin bright edge appears low in the west at sunset. Its sighting starts the month: Ramaḍān and the two ʿĪds are set by it.', 'بعد المحاق تظهر حافة رفيعة منخفضة في الغرب عند الغروب، وبرؤيتها يبدأ الشهر، وبها يُعرف رمضان والعيدان.'] }
    ]
  };
  G.shadow = {
    idea: ['As the sun climbs, a stick’s shadow shortens; at its shortest the sun is at its highest. After that it lengthens again, and the prayer times are read from it.', 'كلما ارتفعت الشمس قصر ظل العصا، وأقصر ما يكون حين تبلغ الشمس أعلاها، ثم يطول، ومنه تُعرف مواقيت الصلاة.'],
    real: ['Before clocks, mosques kept time with sundials. The great sundial of the Umayyad Mosque in Damascus was made by Ibn al-Shāṭir in 1371.', 'قبل الساعات كانت المساجد تضبط الوقت بالمزاول، ومزولة الجامع الأموي بدمشق صنعها ابن الشاطر سنة ١٣٧١م.'],
    steps: [
      { q: ['When is the shadow shortest?', 'متى يكون الظل أقصر ما يكون؟'], o: [['At midday, when the sun is highest', 'عند منتصف النهار، حين تكون الشمس أعلى'], ['At sunrise', 'عند الشروق'], ['In the afternoon', 'بعد الظهر']],
        go: ['Set the time to 12:00.', 'اجعل الوقت ١٢:٠٠.'], ok: function (s) { return near(s.v('time of day'), 12, .05); },
        why: ['The sun is highest at its zenith; Ẓuhr begins just after, when the shadow starts to lengthen (zawāl).', 'تبلغ الشمس أعلاها، ويبدأ الظهر بعد ذلك بقليل حين يبدأ الظل بالزيادة (الزوال).'] },
      { q: ['ʿAṣr begins, in the view of most scholars, when a stick’s shadow is…', 'يبدأ العصر عند أكثر العلماء حين يكون ظل العصا…'], o: [['As long as the stick (beyond its midday shadow)', 'مثلها (بعد ظل الزوال)'], ['Half the stick', 'نصفها'], ['Gone', 'معدومًا']],
        go: ['Move the time on until shadow ÷ stick reaches 1.', 'قدّم الوقت حتى يبلغ الظل ÷ العصا ١.'], ok: function (s) { return s.v('time of day') > 12 && s.o('shadow ÷ stick') >= 1; },
        why: ['That is the view of the Mālikīs, Shāfiʿīs and Ḥanbalīs; the Ḥanafīs wait until it is twice the stick. Both measure the shadow beyond its midday length.', 'هذا قول المالكية والشافعية والحنابلة، وعند الحنفية حين يصير مثليها، وكلاهما يحسب الظل بعد ظل الزوال.'] }
    ]
  };
  G.steps = {
    idea: ['A quadratic ax² + bx + c = 0 is solved by the formula x = (−b ± √(b² − 4ac)) ÷ 2a. The discriminant, b² − 4ac, tells you how many real solutions there are before you finish.', 'تُحل المعادلة التربيعية ax² + bx + c = 0 بالقانون x = (−b ± √(b² − 4ac)) ÷ 2a. والمميز b² − 4ac يخبرك بعدد الحلول قبل أن تكمل.'],
    real: ['Engineers use it to find when a thrown object lands, and where a curved bridge meets the road.', 'يستعمله المهندسون لمعرفة متى يهبط المقذوف وأين يلتقي الجسر المنحني بالطريق.'],
    steps: [
      { q: ['x² − 5x + 6 = 0 has roots…', 'جذرا x² − 5x + 6 = 0…'], o: [['2 and 3', '٢ و٣'], ['−2 and −3', '−٢ و−٣'], ['5 and 6', '٥ و٦']],
        go: ['With a = 1, b = −5, c = 6, press Next step until every step is shown.', 'مع a = 1 وb = −5 وc = 6، اضغط الخطوة التالية حتى تظهر كل الخطوات.'], ok: function (s) { var n = s.ns('steps shown'); return s.v('a') === 1 && s.v('b') === -5 && s.v('c') === 6 && n.length === 2 && n[0] === n[1]; },
        why: ['b² − 4ac = 25 − 24 = 1, so x = (5 ± 1) ÷ 2: 3 or 2. Check: 2 + 3 = 5 and 2 × 3 = 6.', 'b² − 4ac = ٢٥ − ٢٤ = ١، فـ x = (٥ ± ١) ÷ ٢: ٣ أو ٢. للتحقق: ٢ + ٣ = ٥ و٢ × ٣ = ٦.'] },
      { q: ['If b² − 4ac is negative, there are…', 'إذا كان المميز سالبًا، فهناك…'], o: [['No real roots', 'لا جذور حقيقية'], ['Two roots', 'جذران'], ['One root', 'جذر واحد']],
        go: ['Choose a, b and c that make b² − 4ac negative, then show the steps.', 'اختر a وb وc تجعل المميز سالبًا ثم اعرض الخطوات.'], ok: function (s) { return s.v('b') * s.v('b') - 4 * s.v('a') * s.v('c') < 0 && s.b('Next step') > 0; },
        why: ['There is no real square root of a negative number: the curve never touches the x axis. Complex numbers were invented to answer exactly this.', 'لا جذر حقيقيًا لعدد سالب: المنحنى لا يلمس محور x. واختُرعت الأعداد المركبة لتجيب عن هذا بالذات.'] }
    ]
  };
})(GUIDE);
