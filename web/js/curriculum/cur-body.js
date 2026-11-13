/* The body and the hands. A child learns with all of themselves, so screens keep sending them away from the screen:
   movement breaks between stops, a "do it with your body" step inside lessons, and hands-on activities with real things.
   None of it is scored. A hands-on deed is a claim until a grown-up confirms it. */
(function () {
  'use strict';
  var A = window.A, C = window.C, I = window.I, $ = A.$, esc = A.esc, L = A.L, T = A.T;
  var Flow = window.Flow = window.Flow || {};

  /* ---------- movement breaks: a minute, standing up ---------- */
  Flow.MOVES = [
    { art: 'star', s: 30, t: ['Stretch up as tall as you can. Now curl down small. Five times.', 'تمدد إلى أعلى ما تستطيع، ثم انكمش صغيرًا. خمس مرات.'] },
    { art: 'ball', s: 30, t: ['Jump ten times, and count each jump out loud.', 'اقفز عشر مرات، وعدّ كل قفزة بصوت عالٍ.'] },
    { art: 'camel', s: 40, t: ['Walk slowly round the room like a camel crossing the desert.', 'امشِ ببطء في الغرفة كجمل يعبر الصحراء.'] },
    { art: 'bird', s: 30, t: ['Stretch out your arms and glide like a bird. Now fold them. Again.', 'افرد ذراعيك وحلّق كطائر، ثم ضمهما. مرة أخرى.'] },
    { art: 'tree', s: 30, t: ['Stand on one foot like a tall tree. Now the other foot.', 'قف على قدم واحدة كشجرة طويلة، ثم على الأخرى.'] },
    { art: 'stone', s: 30, t: ['Tiptoe to the door and back, as quiet as you can.', 'امشِ على أطراف أصابعك إلى الباب وارجع بأهدأ ما تستطيع.'] },
    { art: 'fish', s: 25, t: ['Wiggle your fingers, your toes, your shoulders. Now shake it all out.', 'حرّك أصابعك وأصابع قدميك وكتفيك، ثم انفض جسمك كله.'] },
    { art: 'drop', s: 40, t: ['Go and drink some water, sitting down, in three sips. Say bismillāh first.', 'اذهب واشرب ماءً وأنت جالس، ثلاث رشفات. وقل بسم الله أولًا.'] },
    { art: 'sun', s: 30, t: ['Look out of a window. Find something far away, then something near. Rest your eyes.', 'انظر من نافذة. جد شيئًا بعيدًا ثم شيئًا قريبًا. أرح عينيك.'] },
    { art: 'mountain', s: 30, t: ['Climb an invisible mountain: big knees, big arms, all the way to the top.', 'اصعد جبلًا خفيًا: ركبتان عاليتان وذراعان كبيرتان حتى القمة.'] },
    { art: 'leaf', s: 25, t: ['Breathe in slowly through your nose. Breathe out slowly. Five times, eyes closed.', 'تنفس ببطء من أنفك، ثم أخرج نفسك ببطء. خمس مرات وعيناك مغمضتان.'] },
    { art: 'foot', s: 30, t: ['Walk heel to toe along a straight line, like crossing a narrow bridge.', 'امشِ والكعب يلمس أصابع القدم على خط مستقيم، كأنك تعبر جسرًا ضيقًا.'] }
  ];
  Flow.moveFor = function (seed) { return Flow.MOVES[seed % Flow.MOVES.length]; };

  /* a ring that empties, so a young child can see how long is left */
  I.body = function (c) {
    var s = c.step, secs = s.s || 0, R = 44, CIRC = 2 * Math.PI * R;
    c.el.innerHTML = '<div class="bodyc"><div class="body-ring">' + (secs ? '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="' + R + '" class="br-b"/><circle cx="50" cy="50" r="' + R + '" class="br-f" stroke-dasharray="' + CIRC + '" stroke-dashoffset="0"/></svg>' : '') + '<span class="body-art">' + A.art(s.art || 'star', 112) + '</span></div><p class="body-t">' + esc(L(s.t)) + '</p>' + (s.adult ? '<p class="ms-a">' + A.icon('grown', 18) + '<span>' + esc(L(s.adult)) + '</span></p>' : '') + '</div>';
    if (secs && !A.reduced()) {
      var f = $('.br-f', c.el), t0 = Date.now(), id = setInterval(function () {
        var k = Math.min(1, (Date.now() - t0) / (secs * 1000)); if (f) f.setAttribute('stroke-dashoffset', String(CIRC * k));
        if (k >= 1) { clearInterval(id); Fx.tap(); }
      }, 200);
      c.setCleanup(function () { clearInterval(id); });
    }
    c.done();
  };

  /* ---------- the step inside a lesson: do it with your body ---------- */
  var BODY = {
    'a-letters': { art: 'pencil', t: ['Write today’s letters huge in the air, with your whole arm. Then small on your palm.', 'اكتب حروف اليوم كبيرة في الهواء بذراعك كلها، ثم صغيرة على كفك.'] },
    'a-vowels': { art: 'mirror', t: ['Say each sound in front of a mirror. Watch your mouth open, smile and go round.', 'انطق كل صوت أمام مرآة. وانظر إلى فمك: يفتح ويبتسم ويستدير.'] },
    'a-read': { art: 'hand', t: ['Clap once for each letter sound as you say the word. Now say it without clapping.', 'صفق مرة لكل صوت وأنت تنطق الكلمة، ثم انطقها بلا تصفيق.'] },
    'a-gram': { art: 'box', t: ['Find three things in this room and say their Arabic names as you touch them.', 'جد ثلاثة أشياء في الغرفة وقل أسماءها بالعربية وأنت تلمسها.'] },
    'm-count': { art: 'ball', t: ['Count out loud and take one big step for each number.', 'عدّ بصوت عالٍ وخذ خطوة كبيرة لكل عدد.'] },
    'm-bonds': { art: 'hand', t: ['Show the number on your fingers. Hide some. How many are left showing?', 'أرِ العدد بأصابعك، ثم أخفِ بعضها. كم بقي ظاهرًا؟'] },
    'm-tens': { art: 'wood', t: ['Collect ten small things and make a pile. That pile is one ten. Make another.', 'اجمع عشرة أشياء صغيرة في كومة. هذه الكومة عشرة واحدة. كوّن أخرى.'] },
    'm-think': { art: 'square', t: ['Walk around the room and touch something that is this shape or pattern.', 'تجول في الغرفة والمس شيئًا له هذا الشكل أو النمط.'] },
    'm-measure': { art: 'foot', t: ['Measure the table with your hand spans, then with your feet. Which number is bigger? Why?', 'قِس الطاولة بشبرك ثم بقدمك. أي العددين أكبر؟ ولماذا؟'] },
    'm-big': { art: 'stone', t: ['Use stones or spoons on the floor to build this number: hundreds, tens and ones.', 'كوّن هذا العدد على الأرض بالحجارة أو الملاعق: مئات وعشرات وآحاد.'] },
    'm-times': { art: 'ball', t: ['Hop along the floor in equal jumps, saying the number you land on each time.', 'اقفز على الأرض قفزات متساوية، وقل العدد الذي تصل إليه كل مرة.'] },
    'm-frac': { art: 'bread', t: ['Fold a sheet of paper into equal parts, and tear off the fraction you just met.', 'اطوِ ورقة أجزاء متساوية، ومزّق الكسر الذي تعرفت عليه.'] },
    'm-space': { art: 'clock', t: ['Stand up. Turn a quarter turn. A half turn. A whole turn. Point to where you started.', 'قف. استدر ربع دورة، ثم نصف دورة، ثم دورة كاملة. أشر إلى حيث بدأت.'] },
    'e-phon': { art: 'hand', t: ['Run and touch something at home that begins with one of today’s sounds. Say it clearly.', 'اركض والمس شيئًا في البيت يبدأ بأحد أصوات اليوم، وانطقه بوضوح.'] },
    'e-gram': { art: 'book', t: ['Act out a word, without speaking, for someone to guess. Now swap.', 'مثّل كلمة دون أن تتكلم ليخمنها أحدهم. ثم تبادلا الأدوار.'] },
    'd-faith': { art: 'leaf', t: ['Go to a window or outside. Point to three things Allah made, and tell someone what they are.', 'اذهب إلى نافذة أو إلى الخارج. أشر إلى ثلاثة أشياء خلقها الله، وأخبر أحدهم عنها.'] },
    'd-worship': { art: 'tap', t: ['Practise the movements now, slowly, with a grown-up watching. Is each one complete?', 'تدرب على الحركات الآن ببطء وكبير يراقبك. هل أتممت كل حركة؟'] },
    'd-adab': { art: 'hand', t: ['Act it out with someone: first the wrong way, then the right way. How did each one feel?', 'مثّلها مع أحدهم: مرة بالطريقة الخطأ ثم بالصواب. كيف كان شعورك في كل منهما؟'] },
    'd-dua': { art: 'hand', t: ['Stand where you would really say this duʿāʾ: by the door, at the table, at your bed.', 'قف حيث تقول هذا الدعاء حقًا: عند الباب أو المائدة أو سريرك.'] },
    'd-seerah': { art: 'camel', t: ['Tell this part of the story to someone, using your hands and the room as the map.', 'احكِ هذا الجزء من القصة لأحدهم، بيديك وباستعمال الغرفة خريطة.'] },
    'd-hadith': { art: 'book', t: ['Say it to someone in your own words, then do one small thing it teaches, now.', 'قله لأحدهم بكلماتك، ثم افعل شيئًا صغيرًا مما يعلمه الآن.'] },
    'd-tawhid': { art: 'star', t: ['Go outside or to a window and sit quietly for a minute. What does the sky make you think of?', 'اخرج أو اجلس عند نافذة بهدوء دقيقة. بماذا تذكّرك السماء؟'] },
    's-notice': { art: 'leaf', t: ['Go and find a real example. Touch it, smell it, look closely. Tell someone what you noticed.', 'اذهب وجد مثالًا حقيقيًا. المسه وشمه وانظر إليه عن قرب. وأخبر أحدهم بما لاحظت.'] },
    's-method': { art: 'water-glass', t: ['Try it for real with what you have at home. Change only one thing.', 'جرّبها حقًا بما عندك في البيت. غيّر شيئًا واحدًا فقط.'] },
    's-systems': { art: 'magnet', t: ['Find this at home or outside. Show someone where it is happening.', 'جد هذا في البيت أو في الخارج. وأرِ أحدهم أين يحدث.'] }
  };
  Flow.bodyFor = function (sk) { return sk.body || BODY[sk.unit] || null; };

  /* ---------- hands-on: real things, a grown-up nearby, seen and confirmed ---------- */
  function hand(id, skill, art, t, materials, extra) { C.missions[id] = Object.assign({ skill: skill, art: art, t: t, materials: materials, title: ['Make it with your hands', 'اصنعها بيديك'], hands: true }, extra || {}); }
  hand('h-sand', 'a.l1', 'pencil', ['Spread flour or sand on a tray. Write today’s letters with your finger, shake it smooth, and write them again from memory.', 'افرد دقيقًا أو رملًا في صينية. اكتب حروف اليوم بإصبعك، ثم انفضها واكتبها من ذاكرتك.'], ['A tray, and flour or sand', 'صينية ودقيق أو رمل']);
  hand('h-dough', 'a.l3', 'bread', ['Roll dough or clay into long snakes and shape three Arabic letters. Add the dots last: where do they go?', 'لُفّ العجين أو الصلصال أفاعي طويلة وشكّل ثلاثة حروف. وأضف النقاط أخيرًا: أين تذهب؟'], ['Dough or clay', 'عجين أو صلصال']);
  hand('h-floor', 'a.l5', 'foot', ['With chalk or tape, draw big letters on the floor. Someone calls a letter: run and stand on it.', 'بالطباشير أو الشريط ارسم حروفًا كبيرة على الأرض. ينادي أحدهم حرفًا فتركض وتقف عليه.'], ['Chalk or tape', 'طباشير أو شريط لاصق'], { safety: ['Clear the floor first.', 'أخلِ الأرض أولًا.'] });
  hand('h-label', 'a.words', 'box', ['Write the Arabic names of five things on paper and stick each one on the real thing.', 'اكتب أسماء خمسة أشياء بالعربية على ورق وألصق كل اسم على الشيء نفسه.'], ['Paper and tape', 'ورق وشريط لاصق']);
  hand('h-dates', 'm.count5', 'date', ['Count real dates, nuts or stones into a bowl, up to the number a grown-up says. Then eat one and say how many are left.', 'عدّ تمرًا أو حجارة حقيقية في وعاء حتى العدد الذي يقوله الكبير. ثم كم بقي إذا أخذت واحدة؟'], ['Dates or small things, and a bowl', 'تمر أو أشياء صغيرة ووعاء'], { safety: ['Whole nuts are not for under-fives.', 'المكسرات الكاملة ليست لمن هم دون الخامسة.'] });
  hand('h-egg', 'm.frame', 'egg', ['Use an egg box as a ten-frame. Drop in small things to make 7. How many more to make 10?', 'استعمل علبة بيض كإطار عشرة. ضع فيها أشياء صغيرة لتكوّن ٧. كم يلزم ليصير ١٠؟'], ['An egg box and small things', 'علبة بيض وأشياء صغيرة']);
  hand('h-shop', 'm.add10', 'coin', ['Set up a little shop. Give things prices under 10, and pay with buttons or stones. Who has how much left?', 'أقم دكانًا صغيرًا. ضع أسعارًا أقل من ١٠ وادفع بالأزرار أو الحجارة. كم بقي معك؟'], ['Household things, buttons or stones', 'أشياء من البيت وأزرار أو حجارة']);
  hand('h-sticks', 'm.tens', 'wood', ['Bundle sticks or straws in tens with string. Build your age, the number of people at home, and 43.', 'اربط عيدانًا أو شفاطات عشرات بخيط. كوّن عمرك وعدد أهل بيتك والعدد ٤٣.'], ['Sticks or straws, and string', 'عيدان أو شفاطات وخيط']);
  hand('h-shapes', 'm.shapes', 'circle', ['Go on a shape hunt. Find 3 circles, 3 rectangles and 1 triangle at home, and draw round them.', 'ابحث عن الأشكال. جد ٣ دوائر و٣ مستطيلات ومثلثًا في البيت، وارسم حولها.'], ['Paper and a pencil', 'ورق وقلم']);
  hand('h-measure', 'm.long', 'foot', ['Cut a string as long as you are tall. What in the house is the same length? Longer? Shorter?', 'قص خيطًا بطول قامتك. ما الذي في البيت بطوله؟ أطول؟ أقصر؟'], ['String and scissors', 'خيط ومقص'], { adult: ['Help with the scissors.', 'ساعد في استعمال المقص.'] });
  hand('h-clock', 'm.clock', 'clock', ['Make a paper clock with a split pin for the hands. Set it to each prayer time today.', 'اصنع ساعة من ورق بعقارب مثبتة بدبوس. واضبطها على وقت كل صلاة اليوم.'], ['Card, a split pin', 'ورق مقوى ودبوس']);
  hand('h-share', 'm.halves', 'bread', ['Share a real flatbread or fruit fairly. One cuts, the other chooses. Is it really equal?', 'اقتسموا رغيفًا أو فاكهة بالعدل. واحد يقسم والآخر يختار. هل تساوت حقًا؟'], ['Bread or fruit', 'خبز أو فاكهة'], { adult: ['Do the cutting if a knife is needed.', 'تولَّ القطع إن احتاج إلى سكين.'] });
  hand('h-array', 'm.array', 'grape', ['Arrange dates or buttons in rows and columns on a tray. Write the fact it shows, both ways round.', 'رتب التمر أو الأزرار صفوفًا وأعمدة في صينية. واكتب الحقيقة التي تظهرها من الجهتين.'], ['A tray and small things', 'صينية وأشياء صغيرة']);
  hand('h-recipe', 'm.fname', 'cup', ['Bake or mix something with a recipe. Measure every half and quarter yourself.', 'اخبز أو اخلط شيئًا بوصفة. وقس كل نصف وربع بنفسك.'], ['A simple recipe', 'وصفة بسيطة'], { adult: ['Stay close for anything hot.', 'كن قريبًا عند كل ما هو ساخن.'] });
  hand('h-hunt', 'e.p1', 'sun', ['Sound hunt: collect things around the house that begin with s, a and t. Line them up and say each one.', 'ابحث عن الأصوات: اجمع أشياء في البيت تبدأ بـ s وa وt. صفّها وانطق كلًا منها.'], ['A basket', 'سلة']);
  hand('h-post', 'e.p2.b', 'box', ['Post words: write six words you can read on paper. Read each one and post it through a slot in a box.', 'بريد الكلمات: اكتب ست كلمات تقرؤها. اقرأ كلًا منها وأدخلها من فتحة في علبة.'], ['A box and paper', 'علبة وورق']);
  hand('h-book', 'e.story1', 'book', ['Fold paper into a little book. Write and draw your own story with a beginning, a middle and an end.', 'اطوِ ورقًا كتابًا صغيرًا. واكتب وارسم قصتك ببداية ووسط ونهاية.'], ['Paper and pencils', 'ورق وأقلام']);
  hand('h-seed', 's.plant', 'seed', ['Plant a seed or a bean in a pot. Water it, and draw it every three days.', 'ازرع بذرة أو حبة فول في أصيص. واسقها وارسمها كل ثلاثة أيام.'], ['A seed, soil and a pot', 'بذرة وتراب وأصيص']);
  hand('h-float', 's.float', 'boat', ['Fill a basin. Guess first, then test ten things from the house: float or sink? Keep score of your guesses.', 'املأ حوضًا. خمّن أولًا ثم جرّب عشرة أشياء من البيت: تطفو أم تغرق؟ وسجل تخميناتك.'], ['A basin of water and small things', 'حوض ماء وأشياء صغيرة'], { safety: ['Stay near young children around water.', 'ابقَ قرب الصغار عند الماء.'] });
  hand('h-moon', 's.moon', 'moon', ['Each night this week, go out and draw the moon. Is it growing or shrinking? What date is it in the Hijri month?', 'كل ليلة هذا الأسبوع اخرج وارسم القمر. أيزداد أم ينقص؟ وكم تاريخ الشهر الهجري؟'], ['A notebook', 'دفتر']);
  hand('h-shadow', 's.shadow', 'sun', ['Stand a stick in the ground. Mark the end of its shadow at each prayer time you can. What happens?', 'اغرس عودًا في الأرض. وعلّم طرف ظله عند كل صلاة تستطيعها. ماذا يحدث؟'], ['A stick and stones', 'عود وحجارة']);
  hand('h-water', 's.water', 'ice', ['Freeze water in a cup. Watch it melt on a plate, and feel the steam above a warm cup. Which is which?', 'جمّد ماءً في كوب. وشاهده يذوب في طبق، وتحسس بخار كوب دافئ. أيها أيها؟'], ['A cup, a plate, a freezer', 'كوب وطبق ومجمد'], { adult: ['Keep hot water out of small hands.', 'أبعد الماء الساخن عن الأيدي الصغيرة.'] });
  hand('h-wudu', 'd.wudu', 'tap', ['Teach someone younger, or a grown-up, how to make wuḍūʾ, in the right order, using real water.', 'علّم من هو أصغر منك أو كبيرًا كيف يتوضأ، بالترتيب الصحيح وبماء حقيقي.'], ['Water', 'ماء']);
  hand('h-map', 'd.s7', 'camel', ['Lay out the road of the Hijrah across the floor: cushions for Makkah, Thawr and Madinah. Walk it and tell the story.', 'ارسم طريق الهجرة على الأرض: وسائد لمكة وثور والمدينة. وامشِ الطريق واحكِ القصة.'], ['Cushions', 'وسائد']);
  hand('h-charity', 'd.a.love', 'coin', ['Choose something good you own to give away. Hand it over yourself, and say nothing about it afterwards.', 'اختر شيئًا جيدًا تملكه لتتصدق به. وسلّمه بنفسك، ولا تذكر ذلك بعدها.'], ['Something good to give', 'شيء جيد تعطيه']);
})();
