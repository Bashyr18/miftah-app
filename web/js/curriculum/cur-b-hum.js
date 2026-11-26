/* New Years 8 to 10 lessons: history, geography, English, Arabic, Islamic studies and life skills. Concept questions only: scripture stays in the verified data, never retyped here. */
(function () {
  'use strict';
  var C = window.C, U = C.yunit, Topic = C.topic, P = C.padQ;
  /* ---------- history and geography ---------- */
  U('world', 'x8w', ['Empires, trade and the land', 'الإمبراطوريات والتجارة والأرض'], 3, 8, true);
  Topic('x8w.crusade', ['The Crusades and Ṣalāḥ ad-Dīn', 'الحروب الصليبية وصلاح الدين'], 'worldmap', [['Crusaders took Jerusalem in 1099, with great slaughter. Ṣalāḥ ad-Dīn won at Ḥaṭṭīn in 1187, and retook the city. Even his enemies recorded his mercy to its people. Read both sides’ chronicles.', 'أخذ الصليبيون القدس سنة ١٠٩٩ بمذبحة كبيرة. وانتصر صلاح الدين في حطين سنة ١١٨٧ واستردها. وسجل أعداؤه رحمته بأهلها.']], [
    function () { return P(['In which year did Ṣalāḥ ad-Dīn win at Ḥaṭṭīn?', 'في أي سنة انتصر صلاح الدين في حطين؟'], '', 1187); },
    [['Why do historians read chronicles from both sides?', 'لماذا تُقرأ مدونات الطرفين؟'], ['Each has its own bias and detail', 'لكل منهما تحيز وتفاصيل'], ['One is always false', 'أحدهما كاذب دائمًا'], ['To save time', 'لتوفير الوقت']],
    [['What set Ṣalāḥ ad-Dīn’s retaking of Jerusalem apart?', 'ما الذي ميز استرداد صلاح الدين للقدس؟'], ['Its restraint toward the people', 'رفقه بأهلها'], ['Destroying the city', 'تدمير المدينة'], ['Leaving at once', 'الرحيل فورًا']]
  ]);
  Topic('x8w.ocean', ['The Indian Ocean world', 'عالم المحيط الهندي'], 'compass', [['Monsoon winds carried traders between Arabia, Africa, India and China. Islam reached Southeast Asia largely through merchants, whose honesty was remembered. Ibn Baṭṭūṭah travelled about 120,000 km across this world.', 'حملت الرياح الموسمية التجار بين الجزيرة وأفريقيا والهند والصين. ووصل الإسلام جنوب شرق آسيا عبر التجار. وسافر ابن بطوطة نحو ١٢٠ ألف كم.']], [
    [['How did Islam mostly reach Southeast Asia?', 'كيف وصل الإسلام جنوب شرق آسيا غالبًا؟'], ['Through traders and scholars', 'عبر التجار والعلماء'], ['By a great army', 'بجيش كبير'], ['By railway', 'بالقطار']],
    [['What made regular sailing possible?', 'ما الذي أتاح الملاحة المنتظمة؟'], ['Monsoon winds', 'الرياح الموسمية'], ['Engines', 'المحركات'], ['Canals', 'القنوات']]
  ]);
  Topic('x8w.mughal', ['Ottomans, Safavids and Mughals', 'العثمانيون والصفويون والمغول الهند'], 'stone', [['Around 1600, three great Muslim empires ran from the Balkans to Bengal. The Mughals built the Taj Mahal. The Ottoman architect Sinan built masterpieces in stone. Trade, law and art flourished, and rivalry was real too.', 'نحو ١٦٠٠ امتدت ثلاث إمبراطوريات من البلقان إلى البنغال. وبنى المغول تاج محل، والمعمار سنان روائع الحجر.']], [
    [['Who built the Taj Mahal?', 'من بنى تاج محل؟'], ['The Mughals', 'المغول في الهند'], ['The Ottomans', 'العثمانيون'], ['The Safavids', 'الصفويون']],
    [['Sinan is famous as:', 'اشتهر سنان بأنه:'], ['An Ottoman architect', 'معمار عثماني'], ['A Mughal poet', 'شاعر مغولي'], ['A sailor', 'بحار']]
  ]);
  Topic('x8w.rivers', ['Rivers, floods and farming', 'الأنهار والفيضانات والزراعة'], 'drop', [['Rivers erode, carry and deposit, from steep upper courses to wide floodplains. People farm the rich silt, and that brings flood risk. Egypt lived by the Nile’s yearly flood for thousands of years.', 'تنحت الأنهار وتحمل وترسب. ويزرع الناس الطمي الغني مع خطر الفيضان. وعاشت مصر بفيضان النيل آلاف السنين.']], [
    [['Where does a river deposit most?', 'أين يرسب النهر أكثر؟'], ['Where it slows', 'حيث يتباطأ'], ['In waterfalls', 'في الشلالات'], ['Where it is steepest', 'حيث الانحدار أشد']],
    function (r) { var c = r.int(2, 9), k = r.pick([25, 50, 100]); return P(['Real distance in km, at 1 cm to this many km.', 'المسافة الحقيقية.'], c + ' cm on a map, 1 cm = ' + k + ' km', c * k); }
  ]);
  Topic('x8w.weather', ['Weather, deserts and water', 'الطقس والصحارى والماء'], 'mountain', [['Warm air rises, cools and rains. Sinking air makes deserts, around 30° north and south. Falaj channels and qanāts carried water for miles underground, a smart answer that still works in places today.', 'يصعد الهواء الدافئ فيبرد فيمطر. والهواء الهابط يصنع الصحارى قرب خط ٣٠°. والأفلاج والقنوات نقلت الماء تحت الأرض.']], [
    [['Great deserts tend to lie near:', 'تقع الصحارى الكبرى قرب:'], ['30° north and south', '٣٠° شمالًا وجنوبًا'], ['The equator', 'خط الاستواء'], ['The poles only', 'القطبين فقط']],
    [['A qanāt is:', 'القناة الجوفية:'], ['An underground water channel', 'مجرى ماء تحت الأرض'], ['A dam', 'سد'], ['A windmill', 'طاحونة']]
  ]);
  U('world', 'x9w', ['Change and its costs', 'التغيير وثمنه'], 3, 9, true);
  Topic('x9w.indust', ['The Industrial Revolution', 'الثورة الصناعية'], 'gear', [['From about 1760, coal, steam and factories transformed Britain, then the world. Output soared, and so did child labour and city disease. Empires supplied raw cotton, often at a terrible human cost.', 'منذ نحو ١٧٦٠ غيّر الفحم والبخار والمصانع بريطانيا ثم العالم. وزاد الإنتاج وزادت عمالة الأطفال والأمراض.']], [
    [['Which fuel drove it?', 'أي وقود دفعها؟'], ['Coal', 'الفحم'], ['Oil', 'النفط'], ['Uranium', 'اليورانيوم']],
    [['A real cost of early factories was:', 'من تكاليف المصانع الأولى:'], ['Child labour and disease', 'عمالة الأطفال والأمراض'], ['Too much holiday', 'كثرة العطل'], ['Falling output', 'انخفاض الإنتاج']]
  ]);
  Topic('x9w.slave', ['The history of slavery', 'تاريخ الرق'], 'scroll', [['The Atlantic trade carried about 12 million Africans, in chains. Slavery also existed in Muslim lands, with rules that encouraged freeing, and those rules were often broken. An honest student looks at their own history, too.', 'نقلت التجارة الأطلسية نحو ١٢ مليون أفريقي. وعرفت بلاد المسلمين الرق بأحكام تحث على العتق وكثيرًا ما خولفت. والطالب الأمين ينظر في تاريخه أيضًا.']], [
    [['About how many Africans crossed the Atlantic in slavery?', 'كم أفريقيًا نُقل عبر الأطلسي تقريبًا؟'], ['12 million', '١٢ مليونًا'], ['12 thousand', '١٢ ألفًا'], ['1 billion', 'مليار']],
    [['Honest history about one’s own people means:', 'التاريخ الأمين عن قومك يعني:'], ['Telling their wrongs as well as their virtues', 'ذكر أخطائهم وفضائلهم'], ['Only praise', 'المدح فقط'], ['Only blame', 'الذم فقط']]
  ]);
  U('world', 'x10w', ['The world now', 'العالم اليوم'], 3, 10, true);
  Topic('x10w.global', ['Globalisation', 'العولمة'], 'worldmap', [['Shipping containers and the internet tied the world’s economies together. A phone uses metals from Africa, is assembled in Asia, and is designed elsewhere. It raises incomes, and it moves jobs and pollution around too.', 'ربطت الحاويات والإنترنت اقتصادات العالم. والهاتف معادنه من أفريقيا وتجميعه في آسيا. وترفع العولمة الدخل وتنقل الوظائف والتلوث.']], [
    [['Which invention made shipping cheap?', 'أي اختراع أرخص الشحن؟'], ['The standard container', 'الحاوية القياسية'], ['The telegraph', 'البرق'], ['The steam train', 'القطار البخاري']],
    [['A fair question about a cheap product is:', 'سؤال منصف عن منتج رخيص:'], ['Who bore the real cost?', 'من تحمل الكلفة الحقيقية؟'], ['What colour is it?', 'ما لونه؟'], ['Who advertises it?', 'من يعلن عنه؟']]
  ]);
  Topic('x10w.media', ['Reading the news well', 'قراءة الأخبار جيدًا'], 'book', [['Who owns it, who is quoted, and what is left out? Separate fact from opinion. Check a claim in a second independent source before you pass it on. We are told to verify news, especially from an unreliable reporter.', 'من يملكها ومن يُنقل عنه وما الذي حُذف؟ افصل الخبر عن الرأي. وتثبت من مصدر ثانٍ قبل النشر، فقد أُمرنا بالتبين.']], [
    [['Before sharing a shocking post, you should:', 'قبل نشر منشور صادم عليك:'], ['Verify it elsewhere', 'التثبت من مصدر آخر'], ['Share fast', 'النشر سريعًا'], ['Add a comment', 'إضافة تعليق']],
    [['“This policy is a disgrace” is:', '"هذه السياسة عار" هي:'], ['Opinion', 'رأي'], ['Fact', 'حقيقة'], ['Data', 'بيانات']]
  ]);
  Topic('x10w.energy', ['Energy and the climate debate', 'الطاقة وجدل المناخ'], 'tree', [['Fossil fuels built modern life, and warm the planet. Poorer countries want growth and the richest emitted most. Solutions trade cost, reliability and fairness. Use numbers, and note who benefits from each claim.', 'بنى الوقود الأحفوري الحياة الحديثة وهو يدفئ الكوكب. والفقراء يريدون النمو والأغنياء أكثر إطلاقًا. واستعمل الأرقام وانظر من المستفيد.']], [
    [['A fair climate argument must weigh:', 'الحجة المنصفة في المناخ تزن:'], ['Cost, reliability and fairness', 'الكلفة والموثوقية والعدالة'], ['Only cost', 'الكلفة فقط'], ['Only feelings', 'المشاعر فقط']],
    function (r) { var p = r.int(2, 9), t = r.int(2, 9); return P(['Emissions per person, tonnes.', 'الانبعاثات للفرد.'], (p * t) + ' million tonnes, ' + p + ' million people', t); }
  ]);
  /* ---------- English ---------- */
  U('english', 'x8e2', ['Sentences that work', 'جمل محكمة'], 3, 8, true);
  Topic('x8e2.sent', ['Sentence control', 'التحكم في الجملة'], 'pencil', [['A short sentence hits hard. A longer one, with a clause tucked inside, can carry a reader through a thought. Vary them on purpose. A comma cannot join two full sentences: use a full stop, semicolon or a joining word.', 'الجملة القصيرة قوية، والطويلة تحمل الفكرة. نوّعها عمدًا. ولا تصل الفاصلة بين جملتين تامتين.']], [
    [['Which is correct?', 'أيها صحيح؟'], ['It rained; we stayed in.', 'It rained; we stayed in.'], ['It rained, we stayed in.', 'It rained, we stayed in.'], ['It rained we stayed in.', 'It rained we stayed in.']],
    [['Why use one short sentence after several long ones?', 'لماذا جملة قصيرة بعد طويلة؟'], ['For impact', 'للتأثير'], ['To save ink', 'لتوفير الحبر'], ['It is a rule', 'إنها قاعدة']]
  ]);
  Topic('x8e2.punct', ['Apostrophes, colons, semicolons', 'الفواصل المتقدمة'], 'pencil', [['It’s means it is, and its shows belonging. A colon introduces: a list or an explanation. A semicolon joins two linked full sentences. The girls’ books belong to several girls, and the girl’s books to one.', 'it’s تعني it is وits للملكية. والنقطتان تقدمان قائمة أو شرحًا، والفاصلة المنقوطة تصل جملتين.']], [
    [['Which is right?', 'أيها صحيح؟'], ['The dog wagged its tail.', 'The dog wagged its tail.'], ['The dog wagged it’s tail.', 'The dog wagged it’s tail.'], ['The dog wagged its’ tail.', 'The dog wagged its’ tail.']],
    [['“The boys’ coats” means coats belonging to:', '"The boys’ coats" تعني معاطف:'], ['More than one boy', 'أكثر من ولد'], ['One boy', 'ولد واحد'], ['No one', 'لا أحد']]
  ]);
  U('english', 'x10e2', ['IGCSE: more craft', 'IGCSE: مهارات أكثر'], 3, 10, true);
  Topic('x10e2.poems', ['Comparing two poems', 'المقارنة بين قصيدتين'], 'book', [['Compare as you go, and not poem A then poem B. Use “whereas” and “similarly”. Compare what they say, how they say it, and the effect. One idea per paragraph, with a quotation from each.', 'قارن أثناء الكتابة لا قصيدة ثم قصيدة. استعمل "بينما" و"وبالمثل". قارن المعنى والأسلوب والأثر.']], [
    [['A strong comparison is organised by:', 'تنظم المقارنة القوية بحسب:'], ['Shared ideas, with both poems in each paragraph', 'الأفكار المشتركة مع القصيدتين في كل فقرة'], ['One poem, then the other', 'قصيدة ثم الأخرى'], ['Line numbers', 'أرقام الأسطر']],
    [['Which word signals a contrast?', 'أي كلمة تدل على التضاد؟'], ['Whereas', 'whereas'], ['Also', 'also'], ['Similarly', 'similarly']]
  ]);
  Topic('x10e2.creative', ['Writing fiction under time', 'كتابة قصة في زمن محدد'], 'pencil', [['Plan five minutes: one place, one problem, one change. Start in the middle of something. Show a feeling through what a person does. End on an image, rather than “it was all a dream”.', 'خطط خمس دقائق: مكان ومشكلة وتغير. ابدأ من وسط الحدث. أظهر الشعور بالفعل. واختم بصورة.']], [
    [['Which shows fear better?', 'أيها يظهر الخوف أفضل؟'], ['Her hand shook on the door handle', 'ارتجفت يدها على المقبض'], ['She was very scared', 'كانت خائفة جدًا'], ['Fear was felt', 'شُعر بالخوف']],
    function (r) { var m = r.int(30, 60), p = r.int(3, 8); return P(['Minutes left for writing after planning.', 'الدقائق الباقية للكتابة.'], m + ' min, ' + p + ' min planning', m - p); }
  ]);
  Topic('x10e2.persuade', ['Letters and articles that persuade', 'رسائل ومقالات مقنعة'], 'pencil', [['Know your reader, and the form: a letter to a mayor differs from a school magazine article. Answer the objection, use one striking fact, and end with what you want done.', 'اعرف القارئ والصيغة. وأجب عن الاعتراض واستعمل حقيقة مؤثرة واختم بالمطلوب.']], [
    [['A persuasive piece should end with:', 'تختم القطعة المقنعة بـ:'], ['What you want the reader to do', 'ما تريد من القارئ فعله'], ['A new topic', 'موضوع جديد'], ['An apology', 'اعتذار']],
    [['Tone for a letter to a mayor is:', 'نبرة رسالة إلى عمدة:'], ['Formal and respectful', 'رسمية محترمة'], ['Chatty', 'دردشة'], ['Angry', 'غاضبة']]
  ]);
  /* ---------- Arabic ---------- */
  U('arabic', 'x9a', ['Arabic in use', 'العربية في الاستعمال'], 3, 9, true);
  Topic('x9a.root', ['Hearing the root', 'سماع الجذر'], 'book', [['Three letters carry the meaning, and patterns shape it. From ع ل م comes عَالِم scholar, مُعَلِّم teacher, and عِلْم knowledge. So one root gives you many words at once.', 'ثلاثة أحرف تحمل المعنى والأوزان تشكله. من ع ل م: عالِم ومعلِّم وعِلم. فالجذر يعطيك كلمات كثيرة.']], [
    [['Which root is shared by كِتَاب and مَكْتَب?', 'ما جذر كتاب ومكتب؟'], ['ك ت ب', 'ك ت ب'], ['م ك ت', 'م ك ت'], ['ت ب ك', 'ت ب ك']],
    [['مُعَلِّم means:', 'مُعَلِّم تعني:'], ['Teacher', 'من يعلّم'], ['Book', 'كتاب'], ['Room', 'غرفة']],
    [['مَفْعَل often names:', 'وزن مَفْعَل يدل غالبًا على:'], ['A place', 'المكان'], ['A colour', 'اللون'], ['A number', 'العدد']]
  ]);
  Topic('x9a.time', ['Telling the time and dates', 'الوقت والتواريخ'], 'stopwatch', [['اَلسَّاعَةُ الْخَامِسَةُ means five o’clock. Add وَالنِّصْف for half past, and وَالرُّبْع for quarter past. Days: اَلْأَحَد Sunday, اَلْجُمُعَة Friday. The ordinal number agrees with the feminine word for the hour.', 'الساعة الخامسة. وأضف والنصف والربع. والأحد والجمعة. ويطابق العدد الترتيبي كلمة الساعة المؤنثة.']], [
    [['اَلسَّاعَةُ الثَّالِثَةُ وَالنِّصْف is:', 'الساعة الثالثة والنصف:'], ['3:30', '٣:٣٠'], ['3:15', '٣:١٥'], ['5:30', '٥:٣٠']],
    [['اَلْجُمُعَة is:', 'الجمعة:'], ['Friday', 'يوم الجمعة'], ['Sunday', 'الأحد'], ['Monday', 'الإثنين']]
  ]);
  U('arabic', 'x10a', ['Arabic for study', 'العربية للدراسة'], 3, 10, true);
  Topic('x10a.connect', ['Linking words', 'أدوات الربط'], 'pencil', [['Write in links, not lists. لِأَنَّ because, لٰكِنَّ but, ثُمَّ then, إِذَا if, حَتَّى until. Note that لِأَنَّ and لٰكِنَّ are sisters of إِنَّ, so the noun after them is accusative.', 'اكتب بالروابط: لأن ولكن وثم وإذا وحتى. ولأن ولكن من أخوات إن فما بعدهما منصوب.']], [
    [['لِأَنَّ means:', 'لِأَنَّ تعني:'], ['Because', 'التعليل'], ['Then', 'الترتيب'], ['Until', 'الغاية']],
    [['ثُمَّ means:', 'ثُمَّ تعني:'], ['Then, after a while', 'الترتيب مع مهلة'], ['Because', 'التعليل'], ['But', 'الاستدراك']],
    [['The noun after لٰكِنَّ is:', 'الاسم بعد لكنَّ:'], ['Accusative', 'منصوب'], ['Nominative', 'مرفوع'], ['Genitive', 'مجرور']]
  ]);
  Topic('x10a.num', ['Numbers in real use', 'الأعداد في الاستعمال'], 'gem', [['Arabic numbers 3 to 10 take the opposite gender of the noun: ثَلَاثَةُ كُتُبٍ three books, but ثَلَاثُ بَنَاتٍ three girls. Scholars call this one of the language’s harder habits, so learn it through set phrases.', 'الأعداد من ٣ إلى ١٠ تخالف المعدود: ثلاثة كتب وثلاث بنات. وتعلمها بالعبارات الجاهزة.']], [
    [['Which is correct for “five books”?', 'أيها صحيح لخمسة كتب؟'], ['خَمْسَةُ كُتُبٍ', 'خَمْسَةُ كُتُبٍ'], ['خَمْسُ كُتُبٍ', 'خَمْسُ كُتُبٍ'], ['خَمْسَةُ كِتَابٍ', 'خَمْسَةُ كِتَابٍ']],
    function () { return P(['What number is عَشَرَة?', 'ما العدد عشرة؟'], '', 10); }
  ]);
  /* ---------- Islamic studies ---------- */
  U('deen', 'x9d', ['Worship in full, and the Prophets', 'العبادة والأنبياء'], 3, 9, true);
  Topic('x9d.zakah', ['Zakāh: the basics', 'الزكاة: الأساسيات'], 'scale', [['Zakāh is a pillar of Islam, a set share of wealth above the niṣāb, held for a lunar year. On money it is 2.5%. It goes to the groups named in the Qurʾān, the poor and needy among them. It purifies, and it is a right of the poor.', 'الزكاة ركن من أركان الإسلام، قدر من المال فوق النصاب إذا حال عليه الحول. وفي النقود ٢٫٥٪، وتصرف في مصارفها المذكورة في القرآن.']], [
    function (r) { var k = r.int(1, 20) * 40; return P(['Zakāh at one fortieth.', 'الزكاة بربع العشر.'], k + ' held a full year', k / 40); },
    function () { return P(['How many pillars of Islam?', 'كم أركان الإسلام؟'], '', 5); },
    [['Niṣāb is:', 'النصاب:'], ['The minimum wealth for zakāh to be due', 'أدنى مال تجب فيه الزكاة'], ['A kind of prayer', 'نوع صلاة'], ['A month', 'شهر']]
  ]);
  Topic('x9d.hajj', ['Ḥajj, step by step', 'الحج خطوة خطوة'], 'compass', [['Iḥrām, ṭawāf, saʿī, the day at ʿArafah, the night at Muzdalifah, the stoning at Minā, then the sacrifice and shaving. It is due once in a lifetime for those able. ʿUmrah can be made at other times of the year.', 'الإحرام والطواف والسعي والوقوف بعرفة والمبيت بمزدلفة ورمي الجمار بمنى ثم الهدي والحلق. وهو واجب مرة على المستطيع.']], [
    [['The standing at ʿArafah falls on which day of Dhū al-Ḥijjah?', 'يوم عرفة في أي يوم من ذي الحجة؟'], ['The 9th', 'التاسع'], ['The 1st', 'الأول'], ['The 27th', 'السابع والعشرين']],
    function () { return P(['Circuits of the Kaʿbah in one ṭawāf.', 'أشواط الطواف.'], '', 7); },
    [['Saʿī is between:', 'السعي بين:'], ['Ṣafā and Marwah', 'الصفا والمروة'], ['Minā and ʿArafah', 'منى وعرفة'], ['Makkah and Madinah', 'مكة والمدينة']]
  ]);
  Topic('x9d.madinah', ['The years in Madinah', 'سنوات المدينة'], 'lantern', [['The Hijrah marks the start of the calendar. The Prophet ﷺ built a masjid and bound the Muhājirūn and Anṣār as brothers. Then came Badr, Uḥud, the Trench, the Treaty of Ḥudaybiyah, and the peaceful opening of Makkah.', 'بدأ التقويم بالهجرة. وبنى النبي ﷺ المسجد وآخى بين المهاجرين والأنصار. ثم بدر وأحد والخندق وصلح الحديبية وفتح مكة.']], [
    [['Which battle came first?', 'أي معركة أولًا؟'], ['Badr', 'بدر'], ['Uḥud', 'أحد'], ['The Trench', 'الخندق']],
    [['The Treaty of Ḥudaybiyah looked like a loss, and led to:', 'بدا صلح الحديبية خسارة وأدى إلى:'], ['Peace, and many entering Islam', 'السلم ودخول كثيرين في الإسلام'], ['The fall of Madinah', 'سقوط المدينة'], ['The end of ḥajj', 'نهاية الحج']],
    [['Who were the Anṣār?', 'من الأنصار؟'], ['The Muslims of Madinah who gave refuge', 'مسلمو المدينة الذين آووا'], ['The emigrants', 'المهاجرون'], ['The Romans', 'الروم']]
  ]);
  Topic('x9d.caliphs', ['The four rightly guided caliphs', 'الخلفاء الراشدون'], 'star', [['Abū Bakr held the community together. ʿUmar founded the Hijrī calendar and courts. ʿUthmān compiled the standard muṣḥaf. ʿAlī’s rule came through great trial. Their justice is still studied by Muslims.', 'حفظ أبو بكر الجماعة. وأسس عمر التقويم الهجري. وجمع عثمان المصحف. ومرت خلافة علي بفتن عظيمة.']], [
    [['Who gathered the Muslims on one standard muṣḥaf?', 'من جمع المسلمين على مصحف واحد؟'], ['ʿUthmān', 'عثمان'], ['ʿUmar', 'عمر'], ['ʿAlī', 'علي']],
    [['Who began the Hijrī calendar?', 'من بدأ التقويم الهجري؟'], ['ʿUmar', 'عمر'], ['Abū Bakr', 'أبو بكر'], ['ʿUthmān', 'عثمان']]
  ]);
  Topic('x9d.prophets', ['Lessons from the Prophets', 'دروس من الأنبياء'], 'scroll', [['Nūḥ’s patience over long years, Ibrāhīm’s reasoning and sacrifice, Yūsuf’s purity and forgiveness, Mūsā’s stand before a tyrant, ʿĪsā’s mercy. Each story gives a pattern for a test you will meet.', 'صبر نوح وحجة إبراهيم وتضحيته وعفة يوسف وعفوه وموقف موسى أمام الطاغية ورحمة عيسى. وكل قصة نموذج لابتلاء ستلقاه.']], [
    [['Who forgave the brothers who wronged him?', 'من عفا عن إخوته؟'], ['Yūsuf', 'يوسف'], ['Nūḥ', 'نوح'], ['Mūsā', 'موسى']],
    [['Who confronted Pharaoh?', 'من واجه فرعون؟'], ['Mūsā', 'موسى'], ['Ibrāhīm', 'إبراهيم'], ['Yūnus', 'يونس']]
  ]);
  U('deen', 'x10d', ['Character and our scholars', 'الخلق وعلماؤنا'], 3, 10, true);
  Topic('x10d.parents', ['Parents, when you are growing up', 'الوالدان حين تكبر'], 'heart', [['As you grow, you may disagree with your parents. Their right to kindness remains. Disagree gently, listen first, and never obey in what is sinful, while staying respectful. Talking early prevents most fights.', 'قد تخالف والديك وأنت تكبر، ويبقى حقهما في الإحسان. خالف بلطف واستمع أولًا. ولا طاعة في معصية مع بقاء الأدب.']], [
    [['You disagree with a parent’s rule. Best first step:', 'خالفت قاعدة لوالدك. أفضل خطوة:'], ['Ask to talk calmly, at a good time', 'طلب حديث هادئ في وقت مناسب'], ['Ignore it', 'التجاهل'], ['Argue loudly', 'الجدال بصوت عالٍ']],
    [['Being kind to parents stops when:', 'ينتهي الإحسان إلى الوالدين:'], ['It does not stop', 'لا ينتهي'], ['You turn 18', 'عند ١٨'], ['You disagree', 'عند الخلاف']]
  ]);
  Topic('x10d.women', ['Women of learning in Islam', 'عالمات في الإسلام'], 'book', [['ʿĀʾishah was among the greatest narrators and jurists of the Companions. Fāṭimah al-Fihriyyah founded al-Qarawiyyīn in Fez. Many hadith masters taught men and women alike, in a chain lasting centuries.', 'كانت عائشة من أكبر الرواة والفقهاء. وأسست فاطمة الفهرية القرويين بفاس. وعلّمت محدثات كثيرات الرجال والنساء.']], [
    [['Who founded al-Qarawiyyīn in Fez?', 'من أسس القرويين بفاس؟'], ['Fāṭimah al-Fihriyyah', 'فاطمة الفهرية'], ['Khadījah', 'خديجة'], ['Ibn Rushd', 'ابن رشد']],
    [['Who was a leading narrator and jurist among the Companions?', 'من كانت راوية وفقيهة بين الصحابة؟'], ['ʿĀʾishah', 'عائشة'], ['Rābiʿah', 'رابعة'], ['Zubaydah', 'زبيدة']]
  ]);
  Topic('x10d.adab', ['The manners of seeking knowledge', 'آداب طلب العلم'], 'lantern', [['Sincerity first. Respect your teachers, ask real questions, and act on what you learn. Do not argue to win. Imam Mālik said “I do not know” to many questions, and it did not lower him.', 'الإخلاص أولًا. احترم معلميك واسأل حقًا واعمل بما تعلمت. ولا تجادل للغلبة. وقال الإمام مالك "لا أدري" في مسائل كثيرة.']], [
    [['Which imam was famous for saying “I do not know”?', 'أي إمام اشتهر بقول "لا أدري"؟'], ['Imam Mālik', 'الإمام مالك'], ['Al-Khwārizmī', 'الخوارزمي'], ['Ibn Sīnā', 'ابن سينا']],
    [['Knowledge should mostly lead to:', 'يجب أن يؤدي العلم أساسًا إلى:'], ['Action and humility', 'العمل والتواضع'], ['Winning debates', 'الفوز بالجدال'], ['Followers', 'متابعين']]
  ]);
  /* ---------- life ---------- */
  U('life', 'x9l', ['Getting on with people', 'التعامل مع الناس'], 3, 9, true);
  Topic('x9l.online', ['Your footprint online', 'أثرك على الإنترنت'], 'lock', [['What you post can be kept for ever, by anyone. Check your privacy settings. Never send what you would not show your parents. If someone pressures or threatens you online, tell a trusted adult at once, whatever has happened.', 'ما تنشره قد يبقى دائمًا. افحص إعدادات الخصوصية. ولا ترسل ما لا تريه والديك. وإذا هددك أحد فأخبر بالغًا موثوقًا فورًا مهما حدث.']], [
    [['Someone online threatens to share your photo. You should:', 'هددك شخص بنشر صورتك. عليك:'], ['Tell a trusted adult now, and stop replying', 'إخبار بالغ موثوق فورًا والتوقف عن الرد'], ['Pay them', 'الدفع'], ['Keep it secret', 'الكتمان']],
    [['A stranger your age asks to move to a private chat. It is:', 'غريب يطلب الانتقال إلى محادثة خاصة. هذا:'], ['A warning sign', 'علامة خطر'], ['Harmless', 'لا بأس'], ['Friendly proof', 'دليل صداقة']]
  ]);
  Topic('x9l.conflict', ['Solving a conflict', 'حل الخلاف'], 'heart', [['Cool down first. Say what happened, how it felt, and what you want, without blaming: “I felt left out when…” Then listen, and repeat back what you heard. Repairing a relationship is rewarded. Ask an adult when someone is unsafe.', 'اهدأ أولًا. قل ما حدث وشعورك وما تريد بلا لوم. ثم استمع وأعد ما سمعت. وإصلاح ذات البين مأجور.']], [
    [['Which opening is best?', 'أي بداية أفضل؟'], ['I felt hurt when that was said', 'تأذيت حين قيل ذلك'], ['You always ruin everything', 'أنت تفسد كل شيء دائمًا'], ['Everyone hates you', 'الجميع يكرهك']],
    [['Before you reply in a heated moment:', 'قبل الرد وقت الغضب:'], ['Wait and calm down', 'انتظر واهدأ'], ['Reply at once', 'رد فورًا'], ['Post it publicly', 'انشر علنًا']]
  ]);
  U('life', 'x10l', ['Looking ahead', 'التطلع إلى الأمام'], 3, 10, true);
  Topic('x10l.career', ['Exploring careers', 'استكشاف المهن'], 'compass', [['What do you enjoy, what are you good at, and what does the world need? Ask three people what their work is really like, day to day. Spend a week helping, if you can. Then pick subjects that keep the doors open.', 'ماذا تحب وتتقن ويحتاجه العالم؟ اسأل ثلاثة عن عملهم اليومي، وجرب أسبوعًا. ثم اختر مواد تبقي الأبواب مفتوحة.']], [
    [['The best way to learn about a job is to:', 'أفضل طريقة لمعرفة وظيفة:'], ['Talk to people doing it', 'الحديث مع من يعملها'], ['Watch an advert', 'مشاهدة إعلان'], ['Guess', 'التخمين']],
    function (r) { var h = r.int(10, 40), w = r.int(10, 40) * 2; return P(['Pay for the week.', 'أجر الأسبوع.'], h + ' hours at ' + w + ' an hour', h * w); }
  ]);
  Topic('x10l.safety', ['Staying safe out and about', 'السلامة خارج البيت'], 'car', [['Tell someone where you are going. Keep your phone charged. Seat belts save lives. Never get in a car with a driver who has been drinking or is reckless. At night, plan your way home before you leave.', 'أخبر أحدًا بوجهتك. واشحن هاتفك. وحزام الأمان ينقذ الأرواح. ولا تركب مع سائق متهور. وفي الليل خطط لعودتك.']], [
    [['A friend’s driver is clearly reckless. You should:', 'سائق صديقك متهور. عليك:'], ['Not get in, and call home', 'عدم الركوب والاتصال بالبيت'], ['Sit in the back', 'الجلوس في الخلف'], ['Say nothing', 'السكوت']],
    function (r) { var k = r.int(1, 5) * 18; return P(['Distance covered in 2 seconds, in metres.', 'المسافة في ثانيتين بالمتر.'], k + ' km/h (' + (k / 3.6) + ' m/s)', k / 3.6 * 2); }
  ]);
})();
