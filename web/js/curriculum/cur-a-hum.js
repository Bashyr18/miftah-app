/* New Years 12 to 14 for the subjects that stopped early: economics, history, geography, English, Arabic, Islamic studies and adult life. Concept questions only: scripture stays in the verified data, never retyped here. */
(function () {
  'use strict';
  var C = window.C, U = C.yunit, Topic = C.topic, P = C.padQ, X = C.exprQ;
  /* ---------- economics and humanities ---------- */
  U('world', 'a12w', ['A level economics', 'الاقتصاد المتقدم'], 4, 12);
  Topic('a12w.elast', ['Elasticity', 'المرونة'], 'scale', [['Price elasticity of demand = % change in quantity ÷ % change in price. Above 1 is elastic. Medicine and salt are inelastic, since people buy them anyway. It tells a seller, and a government, what a price rise will do.', 'المرونة = التغير ٪ في الكمية ÷ التغير ٪ في السعر. فوق ١ مرن. والدواء غير مرن.']], [
    function (r) { var e = r.int(1, 5), p = r.int(2, 10); return P(['Size of the elasticity.', 'مقدار المرونة.'], 'price +' + p + '%, demand −' + (e * p) + '%', e); },
    [['Which is most inelastic?', 'أيها أقل مرونة؟'], ['Life-saving medicine', 'الدواء المنقذ'], ['A luxury car', 'سيارة فاخرة'], ['A holiday', 'عطلة']]
  ]);
  Topic('a12w.fail', ['Market failure', 'فشل السوق'], 'tree', [['Markets ignore costs that fall on others: pollution is the classic externality. They underprovide public goods such as street lights. Zakāh, waqf and sound law all act on such gaps.', 'تتجاهل الأسواق التكاليف الواقعة على الغير كالتلوث. وتقل فيها السلع العامة. والزكاة والوقف والقانون تعالج ذلك.']], [
    [['A factory’s smoke harming a village is:', 'دخان مصنع يضر قرية:'], ['A negative externality', 'أثر خارجي سلبي'], ['A public good', 'سلعة عامة'], ['Inflation', 'تضخم']],
    [['A street light is a public good because:', 'مصباح الشارع سلعة عامة لأن:'], ['You cannot exclude non-payers', 'لا يمكن منع غير الدافع'], ['It is cheap', 'رخيص'], ['It is bright', 'مضيء']],
    function (r) { var a = r.int(2, 9), b = r.int(1, 5); return P(['Social cost per unit.', 'الكلفة الاجتماعية للوحدة.'], 'private cost ' + a + ', harm to others ' + b, a + b); }
  ]);
  Topic('a12w.trade', ['Trade and exchange rates', 'التجارة وأسعار الصرف'], 'worldmap', [['Comparative advantage: each country gains by making what it gives up least to make. If a currency falls, exports get cheaper and imports dearer. Fair trade, without deceit, is praised in Islam.', 'الميزة النسبية: يكسب كل بلد بإنتاج ما يضحي لأجله بأقل. وانخفاض العملة يرخص الصادرات ويغلي الواردات.']], [
    function (r) { var x = r.int(2, 9), e = r.pick([2, 5, 10]); return P(['What does the good cost abroad, in the foreign currency?', 'كم ثمن السلعة في الخارج بالعملة الأجنبية؟'], (x * e) + ' at home, ' + e + ' at home = 1 abroad', x); },
    [['A weaker currency tends to make imports:', 'العملة الأضعف تجعل الواردات:'], ['More expensive', 'أغلى'], ['Cheaper', 'أرخص'], ['Unchanged', 'بلا تغير']]
  ]);
  U('world', 'a13w', ['History and geography, advanced', 'التاريخ والجغرافيا المتقدمة'], 4, 13);
  Topic('a13w.decline', ['Why empires decline: the debate', 'لماذا تضعف الإمبراطوريات: الجدل'], 'scroll', [['Historians argue over the Muslim world’s relative decline: Mongol destruction, shifting trade routes, closed thinking or colonial extraction. Beware any one-cause story. Ask who says so, and on what evidence.', 'يختلف المؤرخون في أسباب تراجع العالم الإسلامي: المغول وطرق التجارة والجمود والاستعمار. احذر قصة السبب الواحد.']], [
    [['A strong history essay on this should:', 'مقال قوي في هذا يجب أن:'], ['Weigh causes with evidence', 'يوازن الأسباب بالأدلة'], ['Blame one group', 'يلوم فئة واحدة'], ['List dates only', 'يسرد التواريخ']],
    [['Sea routes around Africa weakened:', 'أضعفت الطرق البحرية حول أفريقيا:'], ['Overland and Red Sea trade', 'التجارة البرية وتجارة البحر الأحمر'], ['Farming in Europe', 'الزراعة في أوروبا'], ['Printing', 'الطباعة']]
  ]);
  Topic('a13w.decol', ['Decolonisation', 'إنهاء الاستعمار'], 'worldmap', [['After 1945, weakened empires faced independence movements. Algeria won in 1962 after a brutal war. Borders drawn abroad, and economies built for export, left lasting problems.', 'بعد ١٩٤٥ واجهت الإمبراطوريات حركات الاستقلال. ونالت الجزائر استقلالها سنة ١٩٦٢ بعد حرب قاسية.']], [
    function () { return P(['Year Algeria won independence.', 'سنة استقلال الجزائر.'], '', 1962); },
    [['Colonial borders often:', 'الحدود الاستعمارية غالبًا:'], ['Ignored peoples on the ground', 'تجاهلت الشعوب'], ['Followed every language', 'اتبعت كل لغة'], ['Solved all conflicts', 'حلت كل نزاع']]
  ]);
  Topic('a13w.water', ['Water and the future', 'الماء والمستقبل'], 'drop', [['Most of the earth’s fresh water is ice or underground. Rivers such as the Nile cross borders. Wasting water is discouraged even when beside a flowing river, as the wuḍūʾ teaching reminds us.', 'معظم الماء العذب جليد أو جوفي. والأنهار كالنيل تعبر الحدود. والإسراف مكروه ولو على نهر جارٍ.']], [
    function (r) { var l = r.int(2, 9) * 10, d = r.int(2, 7); return P(['How many litres are used in all?', 'كم لترًا تُستعمل في المجموع؟'], l + ' L a day for ' + d + ' days', l * d); },
    [['Most fresh water is found in:', 'معظم الماء العذب في:'], ['Ice and groundwater', 'الجليد والمياه الجوفية'], ['Rivers', 'الأنهار'], ['Clouds', 'السحب']]
  ]);
  Topic('a13w.hazard', ['Hazards and resilience', 'الأخطار والصمود'], 'mountain', [['A hazard turns into a disaster where people are poor and unprepared. Japan and Haiti show it: similar quakes, very different death tolls. Building rules and warning systems save lives.', 'يصير الخطر كارثة حيث الفقر وقلة الاستعداد. وأنظمة البناء والإنذار تنقذ الأرواح.']], [
    [['Why can similar quakes kill very different numbers?', 'لماذا تختلف الوفيات في زلازل متشابهة؟'], ['Building quality and preparation', 'جودة البناء والاستعداد'], ['Luck alone', 'الحظ وحده'], ['The earth’s colour', 'لون الأرض']],
    function (r) { var m = r.int(2, 6); return P(['Each Richter step means about how many times more shaking?', 'كم مرة يزيد الاهتزاز لكل درجة؟'], 'magnitude ' + m + ' to ' + (m + 1), 10); }
  ]);
  Topic('a13w.sci', ['Philosophy of science', 'فلسفة العلم'], 'lens', [['Science tests claims against the world, and stays open to correction. Ibn al-Haytham insisted on experiment and on doubting authorities. Popper asked what could prove an idea wrong. Science answers how, and cannot alone answer why we should.', 'يختبر العلم الدعاوى ويقبل التصحيح. وأصر ابن الهيثم على التجربة. وسأل بوبر عما يبطل الفكرة. والعلم يجيب عن كيف لا عن وجوب الفعل.']], [
    [['A claim that nothing could ever disprove is:', 'دعوى لا يمكن إبطالها:'], ['Not a scientific claim', 'ليست علمية'], ['Strongest science', 'أقوى العلم'], ['Certainly true', 'صحيحة قطعًا']],
    [['Who pioneered experimental method in optics?', 'من رائد المنهج التجريبي في البصريات؟'], ['Ibn al-Haytham', 'ابن الهيثم'], ['Ibn Baṭṭūṭah', 'ابن بطوطة'], ['Al-Jāḥiẓ', 'الجاحظ']]
  ]);
  /* ---------- English ---------- */
  U('english', 'a13en', ['Reading and writing at university level', 'القراءة والكتابة الجامعية'], 4, 13);
  Topic('a13en.close', ['Close reading', 'القراءة المتأنية'], 'book', [['Pick a few lines. Word, image, sound, structure: what does each do, and how do they work together? Never just name a device. Say what it does to the reader, and why that matters here.', 'خذ أسطرًا قليلة. الكلمة والصورة والصوت والبناء: ماذا يفعل كل منها؟ لا تكتف بتسمية الأسلوب، بل اذكر أثره.']], [
    [['Which is the stronger sentence?', 'أي جملة أقوى؟'], ['The harsh sounds make the storm feel violent', 'الأصوات القاسية تجعل العاصفة عنيفة'], ['This line has alliteration', 'في هذا السطر جناس'], ['The poet uses many words', 'يستعمل الشاعر كلمات كثيرة']],
    [['A good quotation is:', 'الاقتباس الجيد:'], ['Short, and analysed', 'قصير ومحلل'], ['Long, and left alone', 'طويل بلا تعليق'], ['Half a page', 'نصف صفحة']]
  ]);
  Topic('a13en.arg', ['Writing a research essay', 'كتابة مقال بحثي'], 'pencil', [['Ask a real question, and state a thesis you could lose. Each paragraph makes one claim, with evidence, and then says what follows. Answer the best objection, and cite everything.', 'اطرح سؤالًا حقيقيًا واذكر أطروحة قابلة للنقض. كل فقرة دعوى بدليل. ورد على أقوى اعتراض ووثق كل شيء.']], [
    [['A strong thesis is:', 'الأطروحة القوية:'], ['Arguable and specific', 'قابلة للنقاش ومحددة'], ['An obvious fact', 'حقيقة بديهية'], ['A question only', 'سؤال فقط']],
    [['Why state the best objection?', 'لماذا تذكر أقوى اعتراض؟'], ['It tests and strengthens your case', 'يختبر حجتك ويقويها'], ['To fill space', 'لملء الصفحة'], ['To confuse readers', 'لإرباك القارئ']]
  ]);
  Topic('a14en.read', ['Reading difficult books', 'قراءة الكتب الصعبة'], 'book', [['Skim first for shape. Read with a pen. Write a three-line summary per chapter from memory. Ask what the author is answering, and what they assume. Slow reading of a few great books outlasts fast reading of many.', 'تصفح أولًا ثم اقرأ بقلم. ولخص كل فصل في ثلاثة أسطر من الذاكرة. واسأل عما يجيب عنه الكاتب وما يفترضه.']], [
    [['After a hard chapter, the most useful step is:', 'بعد فصل صعب، أنفع خطوة:'], ['Summarise it from memory', 'التلخيص من الذاكرة'], ['Reread it passively', 'إعادة القراءة السلبية'], ['Underline more', 'تظليل أكثر']],
    [['To judge a book’s argument, ask:', 'للحكم على حجة كتاب اسأل:'], ['What does it assume?', 'ماذا يفترض؟'], ['How long is it?', 'كم طوله؟'], ['Who designed the cover?', 'من صمم الغلاف؟']]
  ]);
  Topic('a14en.speak', ['Speaking in public', 'الخطابة'], 'letter', [['One message. A story to open, three points, a clear ending. Slow down, and pause. Rehearse aloud, and time it. Speak to people, not to your notes. Good khaṭībs have long known this.', 'رسالة واحدة. افتح بقصة ثم ثلاث نقاط ثم خاتمة واضحة. تمهل وتوقف، وتدرب بصوت عالٍ.']], [
    function (r) { var m = r.int(3, 10); return P(['Words to write, at 130 a minute.', 'الكلمات بمعدل ١٣٠ في الدقيقة.'], m + ' minute talk', m * 130); },
    [['Nerves before speaking are best handled by:', 'أفضل علاج لتوتر الخطابة:'], ['Rehearsing aloud', 'التدرب بصوت عالٍ'], ['Reading faster', 'القراءة أسرع'], ['Avoiding eye contact', 'تجنب النظر']]
  ]);
  /* ---------- Arabic ---------- */
  U('arabic', 'a13a', ['Arabic for real reading', 'العربية للقراءة الحقيقية'], 4, 13);
  Topic('a13a.press', ['Reading the Arabic press', 'قراءة الصحافة العربية'], 'book', [['Modern news uses a stock of words: قَالَ said, أَعْلَنَ announced, حُكُومَة government, اِقْتِصَاد economy. Find the verb, then the doer. Read one short article each day, unvowelled.', 'تستعمل الأخبار كلمات متكررة: قال، أعلن، حكومة، اقتصاد. ابحث عن الفعل ثم الفاعل، واقرأ مقالًا قصيرًا كل يوم.']], [
    [['What does أَعْلَنَ mean?', 'ما معنى أعلن؟'], ['Announced', 'أظهر الخبر'], ['Ate', 'تناول طعامًا'], ['Slept', 'نام']],
    [['What does اِقْتِصَاد mean?', 'ما معنى اقتصاد؟'], ['Economy', 'علم المال والإنتاج'], ['Army', 'جيش'], ['School', 'مدرسة']],
    [['In an Arabic news sentence, look first for:', 'في جملة الخبر ابحث أولًا عن:'], ['The verb, then its doer', 'الفعل ثم فاعله'], ['The last word', 'الكلمة الأخيرة'], ['The longest word', 'أطول كلمة']]
  ]);
  Topic('a13a.dict', ['Using an Arabic dictionary', 'استعمال المعجم العربي'], 'book', [['Arabic dictionaries are ordered by root. For مَكْتَبَة, strip the extras to reach ك ت ب. Then scan for the form you want. Hans Wehr is the standard for students.', 'المعاجم مرتبة بالجذور. جرد مكتبة إلى ك ت ب ثم ابحث عن الصيغة. وهانز فير معجم الطلاب المعتاد.']], [
    [['Under which root would you find مَدْرَسَة?', 'تحت أي جذر تجد مدرسة؟'], ['د ر س', 'د ر س'], ['م د ر', 'م د ر'], ['ر س م', 'ر س م']],
    [['Under which root would you find مَسْجِد?', 'تحت أي جذر تجد مسجد؟'], ['س ج د', 'س ج د'], ['م س ج', 'م س ج'], ['ج د م', 'ج د م']]
  ]);
  Topic('a14a.speak', ['Holding a conversation', 'إجراء محادثة'], 'letter', [['Knowing grammar is not speaking. Ten minutes a day with a person beats an hour alone. Use set phrases: مَا رَأْيُكَ؟ what is your view? أَظُنُّ أَنَّ I think that. Mistakes are the price of fluency.', 'معرفة النحو ليست حديثًا. عشر دقائق مع شخص أنفع من ساعة وحدك. استعمل: ما رأيك؟ أظن أن. والخطأ ثمن الطلاقة.']], [
    [['مَا رَأْيُكَ؟ asks:', 'ما رأيك؟ تسأل عن:'], ['What is your view?', 'رأيك'], ['What is your name?', 'اسمك'], ['Where is your house?', 'بيتك']],
    [['What builds speaking fastest?', 'ما الأسرع في بناء الحديث؟'], ['Short daily talk with a person', 'حديث يومي قصير مع شخص'], ['Only reading grammar', 'قراءة النحو فقط'], ['Waiting until perfect', 'انتظار الإتقان']]
  ]);
  /* ---------- Islamic studies ---------- */
  U('deen', 'a13d', ['Uṣūl and ethics for adult life', 'الأصول والأخلاق لحياة الكبار'], 4, 13);
  Topic('a13d.sources', ['The sources of law', 'مصادر التشريع'], 'scroll', [['The Qurʾān and Sunnah come first. Scholars then rely on ijmāʿ, consensus, and qiyās, analogy. Other tools are debated among the four schools. Knowing this order keeps a question in its proper place.', 'القرآن والسنة أولًا، ثم الإجماع والقياس. وأدوات أخرى مختلف فيها بين المذاهب.']], [
    [['Qiyās means:', 'القياس:'], ['Extending a ruling by a shared cause', 'إلحاق حكم بعلة مشتركة'], ['A vote', 'تصويت'], ['A personal feeling', 'شعور شخصي']],
    [['Ijmāʿ refers to:', 'الإجماع:'], ['Agreement of qualified scholars', 'اتفاق المجتهدين'], ['What most people do', 'ما يفعله أكثر الناس'], ['A government order', 'أمر حكومي']]
  ]);
  Topic('a13d.zakah', ['Working out zakāh', 'حساب الزكاة'], 'scale', [['On zakatable wealth held a full lunar year above the niṣāb, the rate for money is 2.5%, one fortieth. Subtract debts due now, on the common view. Ask a scholar about shares, business stock and pensions.', 'على المال الذي بلغ النصاب وحال عليه الحول ٢٫٥٪ أي ربع العشر. وتُسأل العلماء عن الأسهم والتجارة والتقاعد.']], [
    function (r) { var k = r.int(1, 40) * 40; return P(['Zakāh due, one fortieth.', 'الزكاة، ربع العشر.'], k + ' held a full year', k / 40); },
    function (r) { var s = r.int(10, 40) * 400, d = r.int(1, 9) * 400; return P(['Zakāh after debts due now.', 'الزكاة بعد الديون الحالة.'], s + ' savings, ' + d + ' owed', (s - d) / 40); },
    [['Who does zakāh not go to?', 'لمن لا تُدفع الزكاة؟'], ['Your own parents and children', 'الوالدان والأولاد'], ['The poor', 'الفقراء'], ['The needy', 'المساكين']]
  ]);
  Topic('a13d.bio', ['Medical ethics', 'أخلاقيات الطب'], 'hospital', [['Organ donation, IVF and end-of-life care raise real questions. Councils and scholars weigh benefit and harm, with differing views among them, and the details of each case matter. So in a hard case, ask both a doctor and a scholar.', 'زرع الأعضاء وأطفال الأنابيب ورعاية آخر العمر مسائل حقيقية. تزن المجامع النفع والضرر مع اختلاف الآراء. فاسأل طبيبًا وعالمًا.']], [
    [['A relative faces a hard end-of-life decision. Best step:', 'قريب يواجه قرارًا صعبًا في آخر العمر. الأفضل:'], ['Ask a doctor and a scholar together', 'سؤال طبيب وعالم معًا'], ['Search one forum', 'البحث في منتدى'], ['Decide alone quickly', 'القرار وحدك بسرعة']],
    [['Which principle is central to these rulings?', 'أي قاعدة محورية هنا؟'], ['Weighing harm against benefit', 'الموازنة بين الضرر والنفع'], ['Lowest cost', 'أقل كلفة'], ['Whatever is newest', 'الأحدث']]
  ]);
  Topic('a14d.life', ['Your deen in your first year away', 'دينك في سنتك الأولى بعيدًا'], 'lantern', [['Fix prayer around lectures from week one. Find good company and a masjid before anything else. Keep your Qurʾān revision small enough to survive exams. Call home. When you slip, return, without despair.', 'ثبت الصلاة حول المحاضرات من الأسبوع الأول. وابحث عن صحبة صالحة ومسجد. واجعل مراجعة القرآن يسيرة تدوم. واتصل بأهلك.']], [
    [['A revision plan that lasts is:', 'الخطة التي تدوم:'], ['Small and daily', 'قليلة يومية'], ['Huge once a month', 'كبيرة كل شهر'], ['Only in Ramaḍān', 'في رمضان فقط']],
    [['You have missed several days of revision. You should:', 'فاتتك أيام من المراجعة. عليك:'], ['Restart small today', 'البدء بالقليل اليوم'], ['Give up', 'الاستسلام'], ['Wait for next year', 'انتظار العام القادم']]
  ]);
  Topic('a14d.work', ['Faith and professional life', 'الإيمان والحياة المهنية'], 'wrench', [['Excellence, iḥsān, is itself worship. Keep promises, report errors honestly, and give others credit. Know where your employer’s work raises questions, and ask early. A trustworthy engineer or doctor is daʿwah without a word.', 'الإحسان عبادة. أوف بالوعد واعترف بالخطأ وانسب الفضل لأهله. واسأل مبكرًا عما يشكل في عملك.']], [
    [['You find your own error after shipping. You should:', 'وجدت خطأك بعد التسليم. عليك:'], ['Report it and help fix it', 'الإبلاغ والمساعدة في إصلاحه'], ['Hide it', 'إخفاؤه'], ['Blame a colleague', 'لوم زميل']],
    [['Iḥsān at work means:', 'الإحسان في العمل:'], ['Doing it well even when unseen', 'الإتقان ولو لم تُرَ'], ['Praying during meetings', 'الصلاة أثناء الاجتماعات'], ['Working only when watched', 'العمل عند المراقبة']]
  ]);
  /* ---------- adult life ---------- */
  U('life', 'a14l', ['Your first year away', 'سنتك الأولى بعيدًا'], 4, 14);
  Topic('a14l.budget', ['A real budget', 'ميزانية حقيقية'], 'scale', [['Income first, then rent, food and travel, then saving and ṣadaqah, and only then the rest. Track a month honestly. Avoid interest-bearing debt, and ask a scholar about student finance in your country.', 'الدخل أولًا ثم الإيجار والطعام والمواصلات ثم الادخار والصدقة ثم الباقي. وتجنب الديون الربوية واسأل عن تمويل الدراسة.']], [
    function (r) { var i = r.int(8, 15) * 100, a = r.int(3, 5) * 100, b = r.int(1, 2) * 100; return P(['Left for everything else.', 'المتبقي لغير ذلك.'], i + ' income, ' + a + ' rent, ' + b + ' food', i - a - b); },
    function (r) { var s = r.int(1, 9) * 10, m = r.int(3, 12); return P(['Saved in this time.', 'المدخر في هذه المدة.'], s + ' a month, ' + m + ' months', s * m); }
  ]);
  Topic('a14l.study', ['How university study works', 'كيف تعمل الدراسة الجامعية'], 'notebook', [['No one checks your work daily. Lectures introduce, and you learn in the hours after. Work problem sheets, go to office hours, form a study group. Plan the week each Sunday.', 'لا يتابعك أحد يوميًا. تعرف المحاضرة بالموضوع وتتعلم بعدها. حل التمارين واحضر الساعات المكتبية وكوّن مجموعة دراسة.']], [
    [['You are lost in a course by week three. You should:', 'ضعت في مقرر بحلول الأسبوع الثالث. عليك:'], ['Go to office hours now', 'حضور الساعات المكتبية الآن'], ['Wait for the exam', 'انتظار الاختبار'], ['Skip the lectures', 'ترك المحاضرات']],
    function (r) { var c = r.int(3, 6), h = r.int(6, 10); return P(['Study hours a week.', 'ساعات الدراسة أسبوعيًا.'], c + ' courses at ' + h + ' hours each', c * h); }
  ]);
  Topic('a14l.home', ['Running a home', 'إدارة البيت'], 'lantern', [['Cook five cheap meals well. Wash, clean and fix small things. Read a tenancy agreement before you sign. Know where the fuse box and stopcock are. Register with a doctor before you get ill.', 'أتقن خمس وجبات رخيصة. واغسل ونظف وأصلح الصغير. واقرأ عقد الإيجار، واعرف مكان قاطع الكهرباء ومحبس الماء.']], [
    [['A pipe bursts. First:', 'انفجر أنبوب. أولًا:'], ['Turn off the stopcock', 'أغلق المحبس'], ['Call a friend', 'اتصل بصديق'], ['Mop for an hour', 'امسح ساعة']],
    function (r) { var m = r.int(2, 6), d = r.int(2, 5); return P(['Portions from batch cooking.', 'الوجبات من الطبخ الدفعي.'], m + ' pots of ' + d + ' portions', m * d); }
  ]);
})();
