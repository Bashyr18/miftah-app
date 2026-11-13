/* Living Islam. Behaviour before doctrine for young children, one clear method of worship, every claim tied to its evidence.
   Stories and explanations are our telling and are marked with their references; quoted text comes only from the verified data. */
(function () {
  'use strict';
  var A = window.A, I = window.I, C = window.C;
  C.room('deen', { name: ['Living Islam', 'ديني'], hue: 'teal', art: 'masjid', tag: ['Who made us, how we pray, how we live', 'من خلقنا وكيف نصلي وكيف نعيش'] });

  /* ---------- Allah and our faith ---------- */
  C.unit('deen', 'd-faith', ['Allah, and what we believe', 'الله وما نؤمن به'], 1);
  C.add('d.creator', {
    title: ['Allah made everything', 'الله خلق كل شيء'], art: 'sun', quiet: false,
    meet: [{ k: 'say', p: ['Who made the sun? No person can. Who made your hands? Allah, who has no partner and needs no one.', 'من خلق الشمس؟ لا يقدر عليها أحد. ومن خلق يديك؟ الله وحده لا شريك له ولا يحتاج إلى أحد.'], arts: ['sun', 'moon', 'tree', 'drop'] }],
    name: [{ k: 'story', t: ['Allah tells us about Himself in a short sūrah. Many children learn it first.', 'أخبرنا الله عن نفسه في سورة قصيرة، يحفظها الأطفال أولًا.'], ayah: [112, 1, 4] }],
    guided: [{ k: 'sort', p: ['Who made it?', 'من صنعه؟'], err: 'understanding', hint: ['Could a person make it from nothing?', 'هل يستطيع إنسان صنعه من لا شيء؟'], bins: [{ t: ['Allah created it', 'خلقه الله'], art: 'sun' }, { t: ['People made it, from what Allah created', 'صنعه الناس مما خلق الله'], art: 'hand' }], items: [{ art: 'moon', b: 0 }, { art: 'tree', b: 0 }, { art: 'cup', b: 1 }, { art: 'boat', b: 1 }, { art: 'drop', b: 0 }, { art: 'book', b: 1 }] }],
    solo: [{ k: 'choice', p: ['Who is the One who created everything?', 'من الذي خلق كل شيء؟'], cols: 1, err: 'understanding', o: [{ t: ['Allah', 'الله'], ok: true }, { t: ['The sun', 'الشمس'] }, { t: ['People', 'الناس'] }] }],
    make: [{ k: 'mission', art: 'leaf', t: ['Go outside. Find three things Allah made. Say al-ḥamdu lillāh for each.', 'اخرج وجد ثلاثة أشياء خلقها الله. وقل الحمد لله لكل واحد.'] }],
    review: function (r) { return { k: 'choice', p: ['Who made this?', 'من خلق هذا؟'], qArt: r.pick(['sun', 'moon', 'tree', 'star']), cols: 1, err: 'understanding', o: [{ t: ['Allah', 'الله'], ok: true }, { t: ['People', 'الناس'] }] }; }
  });
  var IMAN = [['Allah', 'الله'], ['His angels', 'ملائكته'], ['His Books', 'كتبه'], ['His Messengers', 'رسله'], ['The Last Day', 'اليوم الآخر'], ['Allah’s decree, the good and the bad', 'القدر خيره وشره']];
  C.add('d.iman', {
    title: ['Six things we believe', 'أركان الإيمان الستة'], art: 'star',
    meet: [{ k: 'story', t: ['One day a man in very white clothes came and asked the Prophet ﷺ: what is faith? Hear the answer.', 'جاء رجل شديد بياض الثياب وسأل النبي ﷺ: ما الإيمان؟ اسمع الجواب.'], had: 'muslim:8' }],
    guided: [{ k: 'order', p: ['Put them in the order of the hadith.', 'رتبها كما في الحديث.'], err: 'sequence', hint: ['It begins with Allah.', 'يبدأ بالإيمان بالله.'], items: IMAN.map(function (x) { return { t: x }; }) }],
    solo: function (r) { var i = r.int(0, 5), others = [['Eating dates', 'أكل التمر'], ['Being tall', 'طول القامة'], ['Going to the market', 'الذهاب إلى السوق']]; return { k: 'choice', p: ['Which is one of the six we believe in?', 'أيها من أركان الإيمان؟'], cols: 1, err: 'understanding', o: [{ t: IMAN[i], ok: true }].concat(others.map(function (o) { return { t: o }; })) }; }, soloN: 2,
    review: function (r) { var i = r.int(0, 4); return { k: 'choice', p: ['Which comes straight after: ' + IMAN[i][0] + '?', 'ما الذي بعد: ' + IMAN[i][1] + '؟'], cols: 1, err: 'sequence', o: [{ t: IMAN[i + 1], ok: true }, { t: IMAN[(i + 3) % 6] }] }; }
  });
  var PILLARS = [{ t: ['To witness that none has the right to be worshipped but Allah, and Muḥammad is His Messenger', 'الشهادتان'], art: 'star' }, { t: ['The prayer', 'الصلاة'], art: 'masjid' }, { t: ['Zakāh', 'الزكاة'], art: 'coin' }, { t: ['Ḥajj', 'الحج'], art: 'kaaba' }, { t: ['Fasting Ramaḍān', 'صوم رمضان'], art: 'moon' }];
  C.add('d.pillars', {
    title: ['Five pillars', 'أركان الإسلام الخمسة'], art: 'masjid',
    meet: [{ k: 'story', t: ['A house stands on its pillars. The Prophet ﷺ said Islam is built on five.', 'البيت يقوم على أعمدته. وقال النبي ﷺ إن الإسلام بني على خمس.'], had: 'bukhari:8' }],
    guided: [{ k: 'order', p: ['Put the five in order.', 'رتب الخمسة.'], err: 'sequence', hint: ['Start with the words we witness.', 'ابدأ بالشهادتين.'], items: PILLARS }],
    solo: function (r) { var i = r.int(0, 4); return { k: 'choice', p: ['Which is this picture?', 'ماذا تعني هذه الصورة؟'], qArt: PILLARS[i].art, cols: 1, err: 'understanding', o: r.shuffle(PILLARS).slice(0, 3).concat(PILLARS[i]).filter(function (x, j, a) { return a.indexOf(x) === j; }).map(function (p) { return { t: p.t, ok: p === PILLARS[i] }; }) }; }, soloN: 3,
    review: function (r) { var i = r.int(0, 4); return { k: 'choice', p: ['Which is a pillar of Islam?', 'أيها من أركان الإسلام؟'], cols: 1, err: 'understanding', o: [{ t: PILLARS[i].t, ok: true }, { t: ['Wearing new clothes', 'لبس الثياب الجديدة'] }] }; }
  });

  /* ---------- wuḍūʾ and ṣalāh ---------- */
  C.unit('deen', 'd-worship', ['Clean, and praying', 'الطهارة والصلاة'], 1);
  var WUDU = [{ t: ['Say Bismillāh, with the intention in your heart', 'نيّة وبسم الله'], art: 'star' }, { t: ['Wash your hands, three times', 'اغسل الكفين ثلاثًا'], art: 'hand' }, { t: ['Rinse your mouth and nose', 'تمضمض واستنشق'], art: 'drop' }, { t: ['Wash your face, three times', 'اغسل الوجه ثلاثًا'], art: 'drop' }, { t: ['Wash your arms to the elbows, three times', 'اغسل اليدين إلى المرفقين ثلاثًا'], art: 'tap' }, { t: ['Wipe over your head', 'امسح الرأس'], art: 'hand' }, { t: ['Wash your feet to the ankles, three times', 'اغسل الرجلين إلى الكعبين ثلاثًا'], art: 'foot' }];
  C.add('d.wudu', {
    title: ['How we make wuḍūʾ', 'كيف نتوضأ'], art: 'tap',
    meet: [{ k: 'story', t: ['Before prayer, we wash the way the Prophet ﷺ taught. Cleanliness is a great part of our faith.', 'قبل الصلاة نتوضأ كما علّم النبي ﷺ. والطهارة من الإيمان.'], had: 'muslim:223' }, { k: 'story', t: ['A Companion, ʿUthmān, showed people exactly how. Here is what was seen.', 'وعلّم عثمان رضي الله عنه الناس كيف. وهذا ما رُئي.'], had: 'bukhari:159' }],
    guided: [{ k: 'order', p: ['Put the steps in order.', 'رتب الخطوات.'], err: 'sequence', hint: ['Hands first, feet last.', 'الكفان أولًا والرجلان آخرًا.'], items: WUDU }],
    solo: [{ k: 'order', p: ['Now on your own.', 'الآن وحدك.'], err: 'sequence', items: WUDU }, { k: 'text', dua: 'wudu-after', p: ['After wuḍūʾ, we say this.', 'بعد الوضوء نقول هذا.'], memo: true }],
    make: [{ k: 'mission', art: 'tap', t: ['Make a real wuḍūʾ now, slowly. Ask a grown-up to watch and help.', 'توضأ الآن وضوءًا حقيقيًا ببطء. واطلب من كبير أن يراقبك ويعينك.'], adult: ['Watch without correcting at first. Then show one thing to improve.', 'راقب دون تصحيح أولًا، ثم أرِه شيئًا واحدًا يحسّنه.'] }],
    review: function (r) { var i = r.int(1, WUDU.length - 2); return { k: 'choice', p: ['What comes after this?', 'ما الذي بعد هذا؟'], q: WUDU[i].t, cols: 1, err: 'sequence', o: [{ t: WUDU[i + 1].t, ok: true }, { t: WUDU[(i + 3) % WUDU.length].t }] }; }
  });
  var PR = [['Fajr', 'الفجر', ['before sunrise', 'قبل الشروق'], 2], ['Ẓuhr', 'الظهر', ['after midday', 'بعد الزوال'], 4], ['ʿAṣr', 'العصر', ['in the afternoon', 'بعد الظهر'], 4], ['Maghrib', 'المغرب', ['just after sunset', 'بعد الغروب'], 3], ['ʿIshāʾ', 'العشاء', ['at night', 'في الليل'], 4]];
  C.add('d.five', {
    title: ['Five prayers a day', 'خمس صلوات في اليوم'], art: 'sun',
    meet: [{ k: 'say', p: ['The sun tells us when. Fajr, Ẓuhr, ʿAṣr, Maghrib, ʿIshāʾ.', 'الشمس تدلنا على الوقت. الفجر والظهر والعصر والمغرب والعشاء.'], arts: ['moon', 'sun', 'sun', 'cloud', 'star'] }],
    guided: [{ k: 'order', p: ['Put the day’s prayers in order.', 'رتب صلوات اليوم.'], err: 'sequence', hint: ['The day starts before sunrise.', 'يبدأ اليوم قبل الشروق.'], items: PR.map(function (p) { return { t: [p[0], p[1]] }; }) }],
    solo: function (r, i) { var p = r.pick(PR); if (i === 2) return { k: 'choice', p: ['How many rakʿahs in ' + p[0] + '?', 'كم ركعة في ' + p[1] + '؟'], large: true, cols: 3, err: 'understanding', o: [2, 3, 4].map(function (n) { return { t: [String(n), '٢٣٤'[n - 2]], ok: n === p[3] }; }), shuffle: false }; return { k: 'choice', p: ['Which prayer is ' + p[2][0] + '?', 'أي صلاة ' + p[2][1] + '؟'], cols: 1, err: 'understanding', o: r.shuffle(PR).slice(0, 3).concat([p]).filter(function (x, j, a) { return a.indexOf(x) === j; }).map(function (x) { return { t: [x[0], x[1]], ok: x === p }; }) }; },
    make: [{ k: 'mission', art: 'masjid', t: ['Pray the next prayer on time with your family, and notice where the sun is.', 'صلِّ الصلاة القادمة في وقتها مع أهلك، ولاحظ أين الشمس.'] }],
    review: function (r) { var i = r.int(0, 3); return { k: 'choice', p: ['Which prayer comes after ' + PR[i][0] + '?', 'أي صلاة بعد ' + PR[i][1] + '؟'], cols: 1, err: 'sequence', o: [{ t: [PR[i + 1][0], PR[i + 1][1]], ok: true }, { t: [PR[(i + 3) % 5][0], PR[(i + 3) % 5][1]] }] }; }
  });
  var POS = [
    { pose: 'takbir', title: ['Stand and say Allāhu akbar', 'قم وقل الله أكبر'], say: 't-akbar' },
    { pose: 'qiyam', title: ['Stand and recite al-Fātiḥah', 'قف واقرأ الفاتحة'], note: ['Right hand over left. Then a little more of the Qurʾān.', 'اليمنى على اليسرى، ثم ما تيسر من القرآن.'] },
    { pose: 'ruku', title: ['Bow: rukūʿ', 'الركوع'], say: 'p-ruku' },
    { pose: 'itidal', title: ['Rise: stand straight', 'الرفع من الركوع'], say: 'p-rabbana' },
    { pose: 'sujud', title: ['Prostrate: sujūd', 'السجود'], say: 'p-sujud', note: ['Forehead and nose, both hands, both knees, toes. Be still. This is when you are nearest to Allah.', 'الجبهة والأنف واليدان والركبتان وأطراف القدمين. واطمئن. وهذا أقرب ما تكون من الله.'] },
    { pose: 'julus', title: ['Sit between the two prostrations', 'الجلسة بين السجدتين'], say: 'p-jalsah' },
    { pose: 'sujud', title: ['Prostrate again', 'السجدة الثانية'], say: 'p-sujud' },
    { pose: 'julus', title: ['Sit for the tashahhud', 'التشهد'], say: 'p-tashahhud' },
    { pose: 'taslim-right', title: ['Say salām to the right', 'السلام عن اليمين'], say: 'taslim' },
    { pose: 'taslim-left', title: ['And to the left', 'وعن اليسار'], say: 'taslim' }
  ];
  C.add('d.salah', {
    title: ['How we pray', 'كيف نصلي'], art: 'masjid',
    meet: [{ k: 'story', t: ['The Prophet ﷺ taught young men who stayed with him, then sent them home with this.', 'علّم النبي ﷺ شبابًا مكثوا عنده ثم قال لهم حين رجعوا إلى أهليهم.'], had: 'bukhari:631' }].concat(POS.map(function (p) { return Object.assign({ k: 'pose', p: null, silent: true, noPrompt: true }, p); })),
    guided: [{ k: 'order', p: ['Put the movements in order.', 'رتب الحركات.'], err: 'sequence', hint: ['Stand, bow, rise, then prostrate.', 'قيام فركوع فرفع فسجود.'], items: [{ t: ['Stand', 'القيام'] }, { t: ['Bow', 'الركوع'] }, { t: ['Rise', 'الرفع'] }, { t: ['Prostrate', 'السجود'] }, { t: ['Sit', 'الجلوس'] }] }],
    solo: function (r) { var P = r.pick(POS.filter(function (x) { return x.say; })); var w = window.SAY[P.say]; return { k: 'choice', p: ['When do we say this?', 'متى نقول هذا؟'], q: w.ar, qAr: true, cols: 1, err: 'understanding', o: r.shuffle(POS.filter(function (x) { return x.say && x.say !== P.say; })).slice(0, 2).concat([P]).map(function (x) { return { t: x.title, ok: x === P }; }) }; },
    make: [{ k: 'mission', art: 'masjid', t: ['Pray two rakʿahs with a grown-up beside you. Go slowly: be still in each position.', 'صلِّ ركعتين بجانب كبير. وتمهل: اطمئن في كل ركن.'], adult: ['Fix one thing at a time. Prayer is learned by watching you.', 'صحح أمرًا واحدًا كل مرة. فالصلاة تُتعلم بالنظر إليك.'] }],
    review: function (r) { var i = r.int(0, 3), o = [{ t: ['Stand', 'القيام'] }, { t: ['Bow', 'الركوع'] }, { t: ['Rise', 'الرفع'] }, { t: ['Prostrate', 'السجود'] }, { t: ['Sit', 'الجلوس'] }]; return { k: 'choice', p: ['What comes after this?', 'ما الذي بعد هذا؟'], q: o[i].t, cols: 1, err: 'sequence', o: [{ t: o[i + 1].t, ok: true }, { t: o[(i + 3) % 5].t }] }; }
  });

  /* ---------- adab: what would you do? ---------- */
  C.unit('deen', 'd-adab', ['How we behave', 'الأدب والأخلاق'], 1);
  var ADAB = [
    ['salam', ['Saying salām', 'إلقاء السلام'], 'star', 'muslim:54', { s: [['You walk past children you do not know, at the masjid. What do you do?', 'تمر بأطفال لا تعرفهم في المسجد. ماذا تفعل؟'], [['Say as-salāmu ʿalaykum, and smile', 'أقول السلام عليكم وأبتسم', 1], ['Look away and walk on', 'أنظر بعيدًا وأمضي'], ['Only greet the ones I know', 'أسلّم فقط على من أعرف']]], why: ['Salām is for those you know and those you do not. It grows love between people.', 'السلام لمن عرفت ومن لم تعرف، وبه تنمو المحبة.'] }, ['Today, be the first to say salām to everyone in your home.', 'اليوم كن أول من يسلّم على كل من في البيت.'], 'hand'],
    ['eating', ['How we eat', 'آداب الطعام'], 'apple', 'bukhari:5376', { s: [['Dinner is on the table and you are very hungry. What is first?', 'وُضع العشاء وأنت جائع جدًا. ماذا تفعل أولًا؟'], [['Say Bismillāh, use my right hand, eat what is near me', 'أقول بسم الله وآكل بيميني مما يليني', 1], ['Reach over for the biggest piece', 'أمد يدي لأكبر قطعة'], ['Eat fast with both hands', 'آكل بسرعة بيديّ']]], why: ['The Prophet ﷺ taught a young boy these three things at his own table.', 'علّم النبي ﷺ غلامًا هذه الثلاثة على مائدته.'] }, ['At the next meal: Bismillāh, right hand, what is near you. Finish with al-ḥamdu lillāh.', 'في الوجبة القادمة: بسم الله، باليمين، مما يليك، واختم بالحمد لله.'], 'apple'],
    ['truth', ['Telling the truth', 'الصدق'], 'lantern', 'bukhari:6094', { s: [['You broke a cup by accident. Nobody saw. What do you do?', 'كسرت كوبًا بالخطأ ولم يرك أحد. ماذا تفعل؟'], [['Tell the truth, and help clean it up', 'أقول الحق وأساعد في التنظيف', 1], ['Say someone else did it', 'أقول إن غيري فعلها'], ['Hide the pieces', 'أخفي القطع']]], why: ['Truth leads to goodness, even when it feels hard at first.', 'الصدق يهدي إلى البر، ولو صعب في البداية.'] }, ['Today, if something goes wrong, say what really happened.', 'اليوم إذا حدث خطأ فقل ما حدث حقًا.'], 'cup'],
    ['parents', ['Your mother and father', 'بر الوالدين'], 'flower', 'bukhari:5971', { s: [['Your mother is tired and asks you to help with the plates. You are playing.', 'أمك متعبة وطلبت مساعدتك في الأطباق وأنت تلعب.'], [['Stop and help, kindly', 'أتوقف وأساعدها بلطف', 1], ['Pretend not to hear', 'أتظاهر أني لم أسمع'], ['Say no, I am busy', 'أقول لا، أنا مشغول']]], why: ['A man asked who deserves his best company. The answer was your mother, three times, then your father.', 'سأل رجل: من أحق بحسن صحبتي؟ فقيل: أمك ثلاثًا، ثم أبوك.'] }, ['Do one helpful thing for your mother or father before they ask.', 'افعل شيئًا يساعد والديك قبل أن يطلبا.'], 'flower'],
    ['anger', ['When you are angry', 'عند الغضب'], 'cloud', 'bukhari:6116', { s: [['Your brother knocks over what you built. You feel hot inside.', 'هدم أخوك ما بنيت. وتشعر بالغضب.'], [['Stop, breathe, say aʿūdhu billāhi minash-shayṭānir-rajīm', 'أتوقف وأتنفس وأقول أعوذ بالله من الشيطان الرجيم', 1], ['Hit him back', 'أضربه'], ['Shout and break his things', 'أصرخ وأكسر أشياءه']]], why: ['A man asked for advice. The Prophet ﷺ told him again and again: do not become angry.', 'طلب رجل وصية فقال له النبي ﷺ مرارًا: لا تغضب.'] }, ['Next time you feel angry, stop and say the words. Tell a parent how it went.', 'إذا غضبت فتوقف وقل الكلمات، وأخبر والديك كيف كان ذلك.'], 'cloud'],
    ['mercy', ['Being kind to animals', 'الرحمة بالحيوان'], 'bird', 'bukhari:2363', { s: [['You see a thirsty cat in the heat. What do you do?', 'رأيت قطة عطشى في الحر. ماذا تفعل؟'], [['Bring it some water', 'أحضر لها ماء', 1], ['Chase it for fun', 'أطاردها للعب'], ['Ignore it', 'أتجاهلها']]], why: ['A man once gave water to a thirsty dog, and Allah forgave him. Every living thing is a chance for good.', 'سقى رجل كلبًا عطشان فغفر الله له. وفي كل كبد رطبة أجر.'] }, ['Put out water or crumbs for birds today.', 'ضع ماءً أو فتاتًا للطيور اليوم.'], 'bird'],
    ['smile', ['A smile is charity', 'الابتسامة صدقة'], 'sun', 'tirmidhi:1956', { s: [['You have no money for ṣadaqah. Can you still give some?', 'ليس معك مال للصدقة. هل تستطيع أن تتصدق؟'], [['Yes: smile at someone', 'نعم: أبتسم في وجه أحدهم', 1], ['No: only money counts', 'لا: المال فقط']]], why: ['Your smile in your brother’s face is charity. You are rich in it.', 'تبسمك في وجه أخيك صدقة. وأنت غني بها.'] }, ['Smile at five people today. Count them on your fingers.', 'ابتسم في وجه خمسة أشخاص اليوم وعدّهم بأصابعك.'], 'sun'],
    ['harm', ['Clearing the way', 'إماطة الأذى'], 'stone', 'bukhari:652', { s: [['There is a sharp stone on the path where people walk.', 'في الطريق حجر حاد يمر به الناس.'], [['Move it to the side', 'أبعده عن الطريق', 1], ['Walk round it', 'أمشي حوله'], ['Kick it at someone', 'أركله نحو أحد']]], why: ['A man moved a thorny branch out of the road. Allah was pleased with him and forgave him.', 'أبعد رجل غصن شوك عن الطريق فشكر الله له فغفر له.'] }, ['Find one thing in your home or street that could trip someone, and move it.', 'جد شيئًا في البيت أو الشارع قد يعثر به أحد وأبعده.'], 'stone'],
    ['love', ['Wanting good for others', 'حب الخير للغير'], 'orange', 'bukhari:13', { s: [['You have the last two dates. Your sister has none.', 'معك آخر تمرتين وليس مع أختك شيء.'], [['Give her one', 'أعطيها واحدة', 1], ['Eat both quickly', 'آكلهما بسرعة'], ['Hide them', 'أخفيهما']]], why: ['Faith grows when you want for others what you want for yourself.', 'يكمل الإيمان حين تحب لغيرك ما تحب لنفسك.'] }, ['Share something you like today, without being asked.', 'شارك شيئًا تحبه اليوم دون أن يُطلب منك.'], 'date'],
    ['speech', ['Good words, or quiet', 'الكلمة الطيبة أو الصمت'], 'book', 'bukhari:6018', { s: [['Your friend’s drawing is not very good. What do you say?', 'رسم صديقك ليس جيدًا. ماذا تقول؟'], [['Find something true and kind to say', 'أقول شيئًا صادقًا لطيفًا', 1], ['Laugh at it', 'أضحك عليه'], ['Tell everyone', 'أخبر الجميع']]], why: ['Say what is good, or keep quiet.', 'قل خيرًا أو اصمت.'] }, ['Before you speak today, ask: is it good? If not, stay quiet.', 'قبل أن تتكلم اليوم اسأل: هل هو خير؟ وإلا فاصمت.'], 'book'],
    ['sneeze', ['When someone sneezes', 'آداب العطاس'], 'feather', 'bukhari:6224', { s: [['Your father sneezes and says al-ḥamdu lillāh. What do you say?', 'عطس أبوك وقال الحمد لله. ماذا تقول؟'], [['Yarḥamuka Allāh', 'يرحمك الله', 1], ['Nothing', 'لا شيء'], ['Bless you, loudly', 'أصيح']]], why: ['A sneeze is a small moment of duʿāʾ between two people.', 'العطاس لحظة دعاء بين اثنين.'] }, ['Use this today when anyone sneezes.', 'استعمله اليوم إذا عطس أحد.'], 'feather'],
    ['gentle', ['Gentleness', 'الرفق'], 'leaf', 'muslim:2594', { s: [['Your little brother wants your toy and is crying.', 'أخوك الصغير يريد لعبتك ويبكي.'], [['Speak softly and find a way to share', 'أكلمه بلطف وأجد طريقة للمشاركة', 1], ['Pull it away hard', 'أسحبها بقوة'], ['Shout at him', 'أصرخ عليه']]], why: ['Gentleness makes everything more beautiful. Roughness spoils it.', 'الرفق يزين كل شيء، وخلافه يشينه.'] }, ['Do one hard thing gently today: a hard chore or a hard talk.', 'افعل شيئًا صعبًا برفق اليوم.'], 'leaf'],
    ['constant', ['Small deeds, every day', 'العمل القليل الدائم'], 'drop', 'bukhari:6464', { s: [['Which is better: a huge effort once, or a little every day?', 'أيهما أفضل: جهد كبير مرة، أم قليل كل يوم؟'], [['A little every day', 'قليل كل يوم', 1], ['Huge effort once, then stop', 'جهد كبير ثم توقف']]], why: ['The deeds most loved by Allah are the regular ones, even if small. Drops make a river.', 'أحب الأعمال إلى الله أدومها وإن قل. والقطرات تصنع نهرًا.'] }, ['Choose one small good deed and do it each day this week.', 'اختر عملًا صغيرًا وافعله كل يوم هذا الأسبوع.'], 'drop'],
    ['knowledge', ['Why we learn', 'لماذا نتعلم'], 'book', 'muslim:2699', { s: [['Learning maths feels hard today. What helps?', 'الرياضيات صعبة اليوم. ما الذي يعين؟'], [['Remember: seeking knowledge is a road to Paradise. Keep going.', 'أتذكر أن طلب العلم طريق إلى الجنة وأستمر', 1], ['Give up: I am not clever', 'أستسلم: لست ذكيًا']]], why: ['Whoever walks a road seeking knowledge, Allah makes easy for him a road to Paradise.', 'من سلك طريقًا يلتمس فيه علمًا سهّل الله له طريقًا إلى الجنة.'] }, ['Teach someone at home one thing you learned today.', 'علّم أحد أهلك شيئًا تعلمته اليوم.'], 'book']
  ];
  ADAB.forEach(function (a) {
    var id = 'd.a.' + a[0], S = a[4];
    C.add(id, {
      title: a[1], art: a[2], needs: [],
      guided: [{ k: 'sit', p: S.s[0], err: 'understanding', art: a[2], o: S.s[1].map(function (o) { return { t: [o[0], o[1]], ok: !!o[2] }; }), why: S.why, had: a[3], nextLabel: ['Next', 'التالي'], ev: 'recognition' }],
      make: [{ k: 'mission', art: a[6], t: a[5], title: ['Today’s deed', 'عمل اليوم'], adult: ['Notice it when it happens, and name it warmly. Mark it only when you saw it.', 'لاحظه إذا حدث وامدحه بلطف. ولا تؤكده إلا إذا رأيته.'] }],
      review: function (r) { return { k: 'choice', p: S.s[0], cols: 1, err: 'understanding', o: S.s[1].map(function (o) { return { t: [o[0], o[1]], ok: !!o[2] }; }) }; }
    });
    C.missions['ad-' + a[0]] = { skill: id, t: a[5], art: a[6], short: a[1], title: ['Today’s deed', 'عمل اليوم'], adult: ['Notice it, name it warmly, and confirm only what you saw.', 'لاحظه وامدحه بلطف، ولا تؤكد إلا ما رأيت.'] };
  });

  /* ---------- duʿāʾ ---------- */
  C.unit('deen', 'd-dua', ['Duʿāʾ for my day', 'أدعية يومي'], 1);
  var DSET = [
    ['d.du.wake', ['Waking and sleeping', 'الاستيقاظ والنوم'], 'moon', ['wake', 'sleep']],
    ['d.du.food', ['Before and after food', 'قبل الطعام وبعده'], 'bread', ['eat', 'ate']],
    ['d.du.home', ['Leaving and coming home', 'الخروج والدخول'], 'door', ['out', 'in']],
    ['d.du.toilet', ['The toilet', 'الخلاء'], 'soap', ['toilet-in', 'toilet-out']],
    ['d.du.dress', ['Getting dressed', 'لبس الثوب'], 'shoe', ['dress']],
    ['d.du.rain', ['Rain, and anger', 'المطر والغضب'], 'rain', ['rain', 'angry']]
  ];
  var ALLD = Object.keys(window.DUA);
  DSET.forEach(function (S) {
    C.add(S[0], {
      title: S[1], art: S[2], quiet: true, needs: [],
      meet: S[3].map(function (k) { return { k: 'text', dua: k, memo: true, p: window.DUA[k].when, silent: true }; }),
      solo: function (r) { var k = r.pick(S[3]), d = window.DUA[k], oth = r.shuffle(ALLD.filter(function (x) { return x !== k; })).slice(0, 2); return { k: 'choice', p: ['When do we say this?', 'متى نقول هذا؟'], qHtml: '<div class="dua-ar" lang="ar" dir="rtl" style="font-size:26px">' + d.ar + '</div>', cols: 1, err: 'memory', o: [{ t: d.when, ok: true }].concat(oth.map(function (x) { return { t: window.DUA[x].when }; })) }; }, soloN: 2,
      make: [{ k: 'mission', art: S[2], t: ['Say it when the moment comes today. Say it from your heart, even a little.', 'قله إذا جاء وقته اليوم، بقلبك ولو قليلًا.'], title: ['Today’s duʿāʾ', 'دعاء اليوم'], adult: ['Say it with them. A child learns duʿāʾ by hearing you say it.', 'قله معه. فالطفل يتعلم الدعاء بسماعه منك.'] }],
      review: function (r) { var k = r.pick(S[3]), d = window.DUA[k]; return { k: 'choice', p: ['When do we say this?', 'متى نقول هذا؟'], qHtml: '<div class="dua-ar" lang="ar" dir="rtl" style="font-size:26px">' + d.ar + '</div>', cols: 1, err: 'memory', o: [{ t: d.when, ok: true }, { t: window.DUA[r.pick(ALLD.filter(function (x) { return x !== k; }))].when }] }; }
    });
    C.missions['du-' + S[0]] = { skill: S[0], art: S[2], t: ['Say today’s duʿāʾ at its moment.', 'قل دعاء اليوم في وقته.'], short: S[1], title: ['Today’s duʿāʾ', 'دعاء اليوم'] };
  });

  /* ---------- the Seerah: told with places and light, never a figure ---------- */
  var TL = [['Elephant', 'الفيل'], ['Shepherd', 'الراعي'], ['Al-Amīn', 'الأمين'], ['Revelation', 'الوحي'], ['Patience', 'الصبر'], ['Ṭāʾif', 'الطائف'], ['Hijrah', 'الهجرة'], ['Madinah', 'المدينة'], ['Badr', 'بدر'], ['Makkah', 'فتح مكة'], ['Farewell', 'الوداع']];
  C.unit('deen', 'd-seerah', ['The life of the Prophet ﷺ', 'سيرة النبي ﷺ'], 1);
  function ep(id, i, title, art, pages, q) {
    C.add(id, {
      title: title, art: art, soloN: 1,
      meet: pages.map(function (p) { return Object.assign({ k: 'story', tl: i, tlAll: TL, silent: false, speak: p.t }, p); }),
      solo: q.map(function (x) { return { k: 'choice', p: x[0], cols: 1, err: 'understanding', hint: ['Think back to the story.', 'تذكر القصة.'], o: x[1].map(function (o, j) { return { t: o, ok: j === 0 }; }) }; }),
      review: function (r) { var x = r.pick(q); return { k: 'choice', p: x[0], cols: 1, err: 'understanding', o: x[1].map(function (o, j) { return { t: o, ok: j === 0 }; }) }; }
    });
  }
  ep('d.s1', 0, ['The Year of the Elephant', 'عام الفيل'], 'kaaba', [
    { scene: 'place-kaaba', art: 'kaaba', t: ['Long ago, a king brought a great army with elephants to destroy the Kaʿbah in Makkah. Allah sent flocks of birds, and the army was destroyed.', 'جاء ملك بجيش عظيم فيه فيل ليهدم الكعبة. فأرسل الله طيرًا أبابيل فأهلك الجيش.'], ayah: [105, 1, 5] },
    { map: { pins: ['makkah'] }, t: ['That same year, in Makkah, a baby was born: Muḥammad ﷺ. His father had already died. His mother died when he was six. His grandfather, then his uncle, cared for him.', 'في ذلك العام وُلد في مكة محمد ﷺ. مات أبوه قبل مولده، وماتت أمه وهو ابن ست، فكفله جده ثم عمه.'], src: 'Sūrat al-Fīl · Ibn Isḥāq, Sīrah' }
  ], [[['What did Allah send against the army?', 'ماذا أرسل الله على الجيش؟'], [['Flocks of birds', 'طيرًا أبابيل'], ['A flood', 'طوفانًا'], ['Other kings', 'ملوكًا آخرين']]], [['Who cared for him after his mother?', 'من كفله بعد أمه؟'], [['His grandfather, then his uncle', 'جده ثم عمه'], ['No one at all', 'لا أحد']]]]);
  ep('d.s2', 1, ['The shepherd', 'راعي الغنم'], 'sheep', [
    { art: 'sheep', t: ['As a young man he looked after sheep for the people of Makkah. Every prophet Allah sent did this work. It teaches patience, watchfulness and mercy for the weak.', 'رعى الغنم لأهل مكة. وما من نبي إلا رعى الغنم، فهي تعلم الصبر والرحمة بالضعيف.'], src: 'Ṣaḥīḥ al-Bukhārī 2262' }
  ], [[['What did looking after sheep teach?', 'ماذا علّمه رعي الغنم؟'], [['Patience and mercy', 'الصبر والرحمة'], ['How to be rich', 'الغنى'], ['How to shout', 'الصراخ']]]]);
  ep('d.s3', 2, ['The trustworthy one', 'الصادق الأمين'], 'kaaba', [
    { art: 'lantern', t: ['In Makkah everyone left their valuables with him. They called him al-Amīn: the one you can trust. Even those who later fought him did not call him a liar.', 'كان أهل مكة يودعون عنده أماناتهم، ويسمونه الأمين. وحتى من عاداه بعد ذلك لم يتهمه بالكذب.'] },
    { scene: 'place-kaaba', art: 'kaaba', t: ['When the tribes rebuilt the Kaʿbah they almost fought over who would lift the Black Stone. He spread a cloth, put the stone on it, and each tribe lifted a corner. Peace, through wisdom.', 'لما بنت قريش الكعبة كادوا يقتتلون على رفع الحجر الأسود. فبسط ثوبًا ووضع عليه الحجر، ورفعت كل قبيلة بطرف. فكان السلم بالحكمة.'], src: 'Musnad Aḥmad · Ibn Isḥāq, Sīrah' }
  ], [[['What did people call him?', 'بماذا سماه الناس؟'], [['Al-Amīn: the trustworthy', 'الأمين'], ['The rich one', 'الغني'], ['The king', 'الملك']]], [['How did he solve the argument over the Stone?', 'كيف حل الخلاف على الحجر؟'], [['Every tribe lifted the cloth together', 'رفعت كل قبيلة طرف الثوب'], ['He sent them away', 'صرفهم']]]]);
  ep('d.s4', 3, ['The first revelation', 'بدء الوحي'], 'cave', [
    { scene: ['place-nour', 'place-hira'], map: { pins: ['makkah', 'hira'] }, t: ['At forty years old he often went alone to pray and think in a cave on a mountain near Makkah: Ḥirāʾ. There the angel came to him with the first words of the Qurʾān.', 'كان وهو في الأربعين يخلو في غار حراء. فجاءه الملك بأول ما نزل من القرآن.'], src: 'Ṣaḥīḥ al-Bukhārī 3' },
    { art: 'book', t: ['The very first word was: Read! He came home trembling. His wife Khadījah comforted him: Allah would never disgrace you, for you are good to your family and help those in need.', 'وكانت أول كلمة: اقرأ. فرجع يرتجف، فطمأنته خديجة وقالت: والله لا يخزيك الله أبدًا، إنك لتصل الرحم وتعين الناس.'], ayah: [96, 1, 5] }
  ], [[['What was the first word revealed?', 'ما أول كلمة نزلت؟'], [['Read', 'اقرأ'], ['Pray', 'صلِّ'], ['Go', 'اذهب']]], [['Who comforted him when he came home?', 'من طمأنته حين رجع؟'], [['Khadījah', 'خديجة'], ['No one', 'لا أحد']]]]);
  ep('d.s5', 4, ['Patience in Makkah', 'الصبر في مكة'], 'stone', [
    { art: 'stone', t: ['He called people to worship Allah alone. Many mocked and hurt him and the believers. Some, like Bilāl, were badly treated, yet they held to their faith.', 'دعا الناس إلى عبادة الله وحده، فسخر منه كثير وآذوه والمؤمنين. وعُذب بعضهم كبلال فثبتوا.'], src: 'Ibn Isḥāq, Sīrah' }
  ], [[['What did the believers do when hurt?', 'ماذا فعل المؤمنون حين أوذوا؟'], [['They were patient and held on', 'صبروا وثبتوا'], ['They gave up', 'استسلموا']]]]);
  ep('d.s6', 5, ['The day of Ṭāʾif', 'يوم الطائف'], 'mountain', [
    { scene: 'place-taif', both: true, map: { pins: ['makkah', 'taif'], from: 'makkah', to: 'taif', bend: -4 }, t: ['He walked to Ṭāʾif to call its people. They sent children to throw stones at him. It was, he said later, one of his hardest days.', 'مشى إلى الطائف يدعو أهلها، فأغروا به سفهاءهم فرموه. وكان من أشد أيامه.'] },
    { art: 'mountain', t: ['An angel of the mountains offered to crush the town. He refused, and hoped that their children would one day worship Allah alone. And they did.', 'عرض عليه ملك الجبال أن يطبق عليهم الجبلين، فأبى وقال: أرجو أن يخرج الله من أصلابهم من يعبده. وقد كان.'], src: 'Ṣaḥīḥ al-Bukhārī 3231' }
  ], [[['What did he choose for the people who hurt him?', 'ماذا اختار لمن آذوه؟'], [['Mercy, and hope for their children', 'الرحمة والرجاء في ذريتهم'], ['Punishment', 'العقوبة']]]]);
  ep('d.s7', 6, ['The Hijrah', 'الهجرة'], 'cave', [
    { scene: ['place-thawr-m', 'place-thawr'], map: { pins: ['makkah', 'thawr'], from: 'makkah', to: 'thawr', bend: 3 }, t: ['The leaders of Makkah plotted to kill him. Allah gave him permission to leave. With Abū Bakr he hid three nights in the Cave of Thawr while searchers came close.', 'تآمر سادة مكة على قتله، فأذن الله له بالهجرة. فاختبأ مع أبي بكر ثلاث ليال في غار ثور والطلب قريب.'], src: 'Ṣaḥīḥ al-Bukhārī 3653 · Sūrat at-Tawbah 9:40' },
    { scene: 'place-quba', both: true, map: { pins: ['makkah', 'madinah'], from: 'makkah', to: 'madinah', bend: 10 }, t: ['Abū Bakr was afraid for him. He said: do not grieve, Allah is with us. They travelled by hidden roads to Madinah. Our calendar begins with this journey.', 'خاف أبو بكر عليه، فقال: لا تحزن إن الله معنا. وسارا إلى المدينة. وبهذه الرحلة يبدأ تقويمنا.'] }
  ], [[['Where did they hide?', 'أين اختبآ؟'], [['The Cave of Thawr', 'غار ثور'], ['In a tall tower', 'برج عالٍ'], ['At the market', 'في السوق']]], [['What begins from the Hijrah?', 'ماذا يبدأ من الهجرة؟'], [['The Islamic calendar', 'التقويم الهجري'], ['The Qurʾān', 'القرآن']]]]);
  ep('d.s8', 7, ['Building Madinah', 'بناء المدينة'], 'masjid', [
    { scene: 'place-nabawi', map: { pins: ['madinah'] }, t: ['In Madinah the first task was a masjid, built with his own hands beside everyone. Then he joined each person from Makkah with a brother from Madinah. They shared homes, work and food.', 'في المدينة بدأ ببناء المسجد، وعمل فيه بيده. ثم آخى بين المهاجرين والأنصار، فتقاسموا البيوت والعمل والطعام.'], src: 'Ṣaḥīḥ al-Bukhārī 3906, 3780' }
  ], [[['What was built first?', 'ما أول ما بني؟'], [['The masjid', 'المسجد'], ['A palace', 'قصر'], ['A market', 'سوق']]], [['What did the brothers of Madinah share?', 'ماذا تقاسم الإخوة؟'], [['Homes, work and food', 'البيوت والعمل والطعام'], ['Nothing', 'لا شيء']]]]);
  ep('d.s9', 8, ['Badr', 'بدر'], 'star', [
    { scene: 'place-badr', both: true, map: { pins: ['madinah', 'badr'], from: 'madinah', to: 'badr', bend: 6 }, t: ['A much larger army came out against the small Muslim group at Badr. The Prophet ﷺ prayed through the night. They were few and weak, yet Allah gave them victory.', 'خرج جيش أكبر بكثير على المسلمين القلة في بدر. فدعا النبي ﷺ طويلًا. فنصرهم الله وهم أذلة.'], src: 'Sūrat Āl ʿImrān 3:123 · Ṣaḥīḥ al-Bukhārī 3953' }
  ], [[['Who gave them victory at Badr?', 'من نصرهم في بدر؟'], [['Allah', 'الله'], ['Their numbers', 'كثرتهم']]]]);
  ep('d.s10', 9, ['Return to Makkah', 'فتح مكة'], 'kaaba', [
    { scene: 'place-kaaba', both: true, map: { pins: ['madinah', 'makkah'], from: 'madinah', to: 'makkah', bend: -8 }, t: ['Years later he returned to Makkah with a great number, to the very people who had driven him out. Instead of revenge he offered safety. Idols were removed from the Kaʿbah, and people entered Islam in crowds.', 'رجع بعد سنين إلى مكة في جمع عظيم إلى من أخرجوه. فلم ينتقم بل أمّنهم، وأزال الأصنام من الكعبة، ودخل الناس في دين الله أفواجًا.'], ayah: [110, 1, 3], src: 'Ṣaḥīḥ Muslim 1780 · Ṣaḥīḥ al-Bukhārī 4287' }
  ], [[['What did he do to those who had driven him out?', 'ماذا فعل بمن أخرجوه؟'], [['He offered them safety', 'أمّنهم'], ['He took revenge', 'انتقم منهم']]]]);
  ep('d.s11', 10, ['The farewell', 'الوداع'], 'lantern', [
    { scene: 'place-arafat', map: { pins: ['makkah', 'madinah'] }, t: ['He made one Ḥajj and spoke to the great crowd about mercy, rights and worship. Soon after, in Madinah, he returned to Allah. He left us the Qurʾān and his Sunnah, which we still follow today.', 'حج حجة واحدة وخطب في الناس في الرحمة والحقوق والعبادة. ثم توفاه الله في المدينة بعد قليل. وترك لنا القرآن وسنته التي نتبعها.'], src: 'Ṣaḥīḥ Muslim 1218 · Ṣaḥīḥ al-Bukhārī 4437' }
  ], [[['What did he leave us?', 'ماذا ترك لنا؟'], [['The Qurʾān and his Sunnah', 'القرآن وسنته'], ['Gold and palaces', 'الذهب والقصور']]]]);

  /* ---------- Seekers ---------- */
  C.unit('deen', 'd-hadith', ['Hadith to carry with you', 'أحاديث تحفظها'], 2);
  [['bukhari:1', ['Deeds and intentions', 'الأعمال بالنيات'], 'lantern', ['Why you do something matters as much as what you do.', 'سبب فعلك مهم كفعلك.']], ['bukhari:5027', ['The best of you', 'خيركم'], 'book', ['The best are those who learn the Qurʾān and teach it. You are on that road.', 'خيركم من تعلم القرآن وعلمه. وأنت في طريقه.']], ['bukhari:6035', ['Best in character', 'أحسنكم أخلاقًا'], 'flower', ['Character is the measure, not how clever or rich.', 'الأخلاق هي الميزان لا الذكاء ولا الغنى.']], ['bukhari:6406', ['Two light words', 'كلمتان خفيفتان'], 'feather', ['Light on the tongue, heavy on the Scale.', 'خفيفتان على اللسان ثقيلتان في الميزان.']], ['bukhari:5997', ['Mercy', 'الرحمة'], 'leaf', ['Whoever shows no mercy is shown none.', 'من لا يَرحم لا يُرحم.']]].forEach(function (H, i) {
    C.add('d.h' + i, {
      title: H[1], art: H[2], quiet: true, needs: i ? ['d.h' + (i - 1)] : [],
      meet: [{ k: 'text', had: H[0], memo: true, p: H[3], silent: false }],
      solo: function (r) { var ws = window.HAD[H[0]].ar.split(' '), cut = Math.min(ws.length - 1, Math.max(2, Math.floor(ws.length / 2))); var next = ws[cut]; var dis = r.shuffle(['الْعِلْمُ', 'النَّاسُ', 'الْقَلْبُ', 'الْخَيْرُ']).slice(0, 2); return { k: 'choice', p: ['Which word comes next?', 'ما الكلمة التالية؟'], qHtml: '<div class="dua-ar" lang="ar" dir="rtl" style="font-size:25px">' + ws.slice(0, cut).join(' ') + ' …</div>', cols: 1, err: 'memory', o: [{ t: next, ar: true, ok: true }].concat(dis.map(function (d) { return { t: d, ar: true }; })) }; }, soloN: 2,
      make: [{ k: 'mission', art: H[2], t: ['Recite this hadith from memory to a parent, and say what it means for you today.', 'اقرأ الحديث من حفظك على والديك، وقل ماذا يعني لك اليوم.'], title: ['Say it to someone', 'قله لأحد'] }],
      review: function (r) { var ws = window.HAD[H[0]].ar.split(' '), cut = Math.min(ws.length - 1, 2); return { k: 'choice', p: ['Which word comes next?', 'ما الكلمة التالية؟'], qHtml: '<div class="dua-ar" lang="ar" dir="rtl" style="font-size:25px">' + ws.slice(0, cut).join(' ') + ' …</div>', cols: 1, err: 'memory', o: [{ t: ws[cut], ar: true, ok: true }, { t: 'الْقَلْبُ', ar: true }] }; }
    });
  });
  C.unit('deen', 'd-tawhid', ['Knowing Allah more deeply', 'التوحيد'], 2);
  C.add('d.tawhid', {
    title: ['Lord, King, God', 'الرب والملك والإله'], art: 'star', needs: [],
    meet: [{ k: 'story', t: ['Sūrat an-Nās opens by naming Allah three ways. Scholars of creed describe tawḥīd in three parts, and all three are here.', 'تبدأ سورة الناس بثلاثة أسماء. ويقسم العلماء التوحيد ثلاثة أقسام، وكلها هنا.'], ayah: [114, 1, 3] }],
    name: [{ k: 'say', p: ['Lord: only He creates and provides. King: His names and attributes are perfect. God: only He is worshipped.', 'الرب: هو وحده الخالق الرازق. الملك: له الأسماء والصفات الكاملة. الإله: هو وحده المعبود.'], t: ['Rubūbiyyah · Asmāʾ wa Ṣifāt · Ulūhiyyah', 'الربوبية · الأسماء والصفات · الألوهية'] }],
    solo: function (r) { var T_ = r.pick([[['Only Allah makes the rain fall.', 'الله وحده ينزل المطر.'], 0], [['Our duʿāʾ goes only to Allah.', 'ندعو الله وحده.'], 2], [['Allah is the Most Merciful, in a way nothing else is.', 'الله هو الرحيم لا يشبهه أحد.'], 1], [['Only Allah gives life.', 'الله وحده يحيي.'], 0], [['We bow only to Allah.', 'لا نسجد إلا لله.'], 2]]); return { k: 'choice', p: ['Which part of tawḥīd is this?', 'أي قسم من التوحيد هذا؟'], q: T_[0], cols: 1, err: 'understanding', hint: ['Is it about what He does, how He is, or how we worship?', 'هل هو عن فعله أو صفاته أو عبادتنا له؟'], o: [[['Rubūbiyyah: what only He does', 'الربوبية: ما يفعله وحده'], 0], [['Asmāʾ wa Ṣifāt: His names and attributes', 'الأسماء والصفات'], 1], [['Ulūhiyyah: worship for Him alone', 'الألوهية: العبادة له وحده'], 2]].map(function (x) { return { t: x[0], ok: x[1] === T_[1] }; }), shuffle: false }; }, soloN: 4,
    review: function (r) { return { k: 'choice', p: ['Our duʿāʾ goes only to Allah. Which part of tawḥīd?', 'ندعو الله وحده. أي قسم؟'], cols: 1, err: 'understanding', o: [{ t: ['Ulūhiyyah', 'الألوهية'], ok: true }, { t: ['Rubūbiyyah', 'الربوبية'] }] }; }
  });
  C.add('d.fast', {
    title: ['Ramaḍān and zakāh', 'رمضان والزكاة'], art: 'moon',
    meet: [{ k: 'story', art: 'moon', t: ['In Ramaḍān, adults and those able fast from dawn to sunset. Children practise as they grow. The month starts with the new moon, which is why it moves through the year. Ramaḍān Mubārak.', 'في رمضان يصوم القادرون من الفجر إلى المغرب، ويتدرب الأطفال. يبدأ الشهر برؤية الهلال، ولذلك يتنقل في السنة. رمضان مبارك.'] }, { k: 'story', art: 'coin', t: ['Zakāh is a set share of saved wealth, given every lunar year to those who are owed it. It belongs to them. It is a right, not a favour.', 'الزكاة نصيب محدد من المال المدخر يُخرج كل حول لمستحقيه. فهي حقهم لا تفضلًا عليهم.'] }],
    solo: [{ k: 'choice', p: ['When does a day of fasting begin and end?', 'متى يبدأ الصوم وينتهي؟'], cols: 1, err: 'understanding', o: [{ t: ['Dawn to sunset', 'من الفجر إلى المغرب'], ok: true }, { t: ['Sunrise to noon', 'من الشروق إلى الظهر'] }] }, { k: 'choice', p: ['Why does Ramaḍān move through the year?', 'لماذا يتنقل رمضان في السنة؟'], cols: 1, err: 'understanding', o: [{ t: ['It follows the moon', 'يتبع القمر'], ok: true }, { t: ['People choose it', 'يختاره الناس'] }] }],
    review: function (r) { return { k: 'choice', p: ['Zakāh is ...', 'الزكاة ...'], cols: 1, err: 'understanding', o: [{ t: ['a right owed to those in need', 'حق للمستحقين'], ok: true }, { t: ['a favour if you feel like it', 'تفضل إذا شئت'] }] }; }
  });
  C.add('d.differ', {
    title: ['When scholars differ', 'حين يختلف العلماء'], art: 'book',
    meet: [{ k: 'say', p: ['You may see someone pray slightly differently. Great scholars sometimes reached different views from the evidence, seeking the truth. It is not a fault in the religion.', 'قد ترى من يصلي بصورة مختلفة قليلًا. فقد يختلف العلماء الكبار في فهم الدليل طلبًا للحق، وليس هذا عيبًا في الدين.'], art: 'book', t: ['At home we follow what our family has learned. Later you will study why they differed. Be respectful and ask.', 'وفي بيتنا نتبع ما تعلمناه. وستدرس لاحقًا سبب اختلافهم. فكن مؤدبًا واسأل.'] }],
    solo: [{ k: 'choice', p: ['Someone at the masjid does a small thing differently. What is best?', 'شخص في المسجد يفعل أمرًا بسيطًا بصورة مختلفة. ما الأفضل؟'], cols: 1, err: 'understanding', o: [{ t: ['Stay respectful, and ask my parents later', 'أبقى مؤدبًا وأسأل والديّ لاحقًا'], ok: true }, { t: ['Tell him he is wrong', 'أقول له إنه مخطئ'], }, { t: ['Laugh about it', 'أضحك عليه'] }] }],
    review: function (r) { return { k: 'choice', p: ['Different scholarly views are ...', 'اختلاف العلماء ...'], cols: 1, err: 'understanding', o: [{ t: ['a normal part of seeking the truth', 'أمر طبيعي في طلب الحق'], ok: true }, { t: ['a fault in Islam', 'عيب في الإسلام'] }] }; }
  });
})();
