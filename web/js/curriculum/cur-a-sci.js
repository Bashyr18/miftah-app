/* New A level and pre-university sciences, Years 12 to 14: physics, chemistry and biology. */
(function () {
  'use strict';
  var C = window.C, U = C.yunit, Topic = C.topic, P = C.padQ, X = C.exprQ;

  /* ---------- physics, Year 12 ---------- */
  U('science', 'a12ph', ['A level physics: mechanics, waves, circuits', 'فيزياء: الميكانيكا والموجات والدوائر'], 4, 12);
  Topic('a12ph.suvat', ['Equations of motion in physics', 'معادلات الحركة في الفيزياء'], 'stopwatch', [['For steady acceleration: v = u + at, s = ut + ½at², v² = u² + 2as. List what you know, choose the equation that leaves out what you do not need.', 'للتسارع الثابت: v = u + at, s = ut + ½at², v² = u² + 2as. اكتب المعلوم واختر المعادلة التي تخلو مما لا تحتاجه.']], [
    function (r) { var u = r.int(0, 20), a = r.int(1, 6), t = r.int(2, 9); return P(['Final speed in m/s.', 'السرعة النهائية.'], 'u = ' + u + ', a = ' + a + ', t = ' + t, u + a * t); },
    function (r) { var a = r.pick([2, 4, 6]), t = r.int(2, 9); return P(['Distance from rest, in m.', 'المسافة من السكون.'], 'a = ' + a + ', t = ' + t, a * t * t / 2); },
    function (r) { var v = r.pick([10, 20, 30, 40]); return P(['Height reached, in m (g = 10).', 'الارتفاع (ج = ١٠).'], 'thrown up at ' + v + ' m/s', v * v / 20); }
  ]);
  Topic('a12ph.proj', ['Projectiles', 'المقذوفات'], 'ball', [['Horizontal and vertical motion are independent. Without air, horizontal speed never changes and gravity acts only downward. A ball dropped and a ball fired flat land together.', 'الحركتان الأفقية والرأسية مستقلتان. وبلا هواء لا تتغير السرعة الأفقية. والكرة الساقطة والمقذوفة أفقيًا تصلان معًا.']], [
    function (r) { var h = r.pick([5, 20, 45, 80]); return P(['Time to fall, in s (g = 10).', 'زمن السقوط (ج = ١٠).'], h + ' m', Math.sqrt(h / 5)); },
    function (r) { var h = r.pick([5, 20, 45, 80]), v = r.int(2, 20); return P(['Horizontal distance, in m.', 'المسافة الأفقية.'], v + ' m/s flat from ' + h + ' m', v * Math.sqrt(h / 5)); },
    [['At the top of its flight, a ball’s acceleration is:', 'عند القمة تسارع الكرة:'], ['Still g, downward', 'ما زال g لأسفل'], ['Zero', 'صفر'], ['Upward', 'لأعلى']]
  ]);
  Topic('a12ph.standing', ['Stationary waves', 'الموجات الموقوفة'], 'wave', [['Two equal waves travelling opposite ways make fixed nodes and antinodes. On a string of length L, the first harmonic has wavelength 2L. Nodes are half a wavelength apart.', 'موجتان متعاكستان تكونان عقدًا وبطونًا ثابتة. وفي وتر طوله L طول موجة التوافقية الأولى 2L.']], [
    function (r) { var L = r.int(1, 9) * 10; return P(['Wavelength of the first harmonic, cm.', 'طول موجة التوافقية الأولى.'], 'string ' + L + ' cm', 2 * L); },
    function (r) { var l = r.pick([10, 20, 40, 60]); return P(['Distance between neighbouring nodes, cm.', 'المسافة بين عقدتين.'], 'wavelength ' + l + ' cm', l / 2); },
    function (r) { var f = r.int(2, 9) * 10, k = r.int(2, 5); return P(['Frequency of this harmonic, Hz.', 'تردد هذه التوافقية.'], 'first ' + f + ' Hz; harmonic ' + k, f * k); }
  ]);
  Topic('a12ph.grating', ['Diffraction gratings', 'محززات الحيود'], 'rainbow', [['d sin θ = nλ. A grating of many slits gives sharp bright lines, and each colour lands at its own angle. That is how we read the composition of stars.', 'd sin θ = nλ. المحزز يعطي خطوطًا حادة، ولكل لون زاويته. وبهذا نقرأ تركيب النجوم.']], [
    function (r) { var l = r.int(4, 7) * 100, n = r.int(1, 3); return P(['Path difference in nm.', 'فرق المسار.'], 'order ' + n + ', λ = ' + l + ' nm', n * l); },
    function (r) { var k = r.pick([200, 250, 400, 500]); return P(['Slit spacing in nm (1 mm = 1,000,000 nm).', 'تباعد الشقوق.'], k + ' lines per mm', 1000000 / k); },
    [['Which colour bends most in a grating?', 'أي لون ينحرف أكثر؟'], ['Red', 'الأحمر'], ['Blue', 'الأزرق'], ['All equally', 'كلها بالتساوي']]
  ]);
  Topic('a12ph.kirch', ['Kirchhoff’s laws', 'قانونا كيرشوف'], 'plug', [['First law: current in at a junction equals current out, because charge is conserved. Second law: voltages round a loop add to zero, because energy is conserved. Between them, any circuit can be solved.', 'الأول: التيار الداخل يساوي الخارج لحفظ الشحنة. والثاني: مجموع الجهود في الحلقة صفر لحفظ الطاقة.']], [
    function (r) { var a = r.int(1, 9), b = r.int(1, 9); return P(['Third current, in A.', 'التيار الثالث.'], (a + b) + ' A in; ' + a + ' A out one way', b); },
    function (r) { var e = r.int(6, 24), a = r.int(1, 5); return P(['Voltage across the second resistor.', 'الجهد على المقاومة الثانية.'], e + ' V cell; ' + a + ' V across the first', e - a); },
    function (r) { var R = r.pick([12, 18, 36]), n = r.pick([2, 3]); return P(['What is the total resistance, in Ω?', 'ما المقاومة الكلية بالأوم؟'], n + ' × ' + R + ' Ω in parallel', R / n); }
  ]);
  Topic('a12ph.particle', ['Quarks and leptons', 'الكواركات واللبتونات'], 'star', [['Protons and neutrons are made of quarks: up has charge +2/3, down has −1/3. Proton uud, neutron udd. Electrons are leptons, with no known parts.', 'البروتون والنيوترون من كواركات: العلوي +٢/٣ والسفلي −١/٣. البروتون uud والنيوترون udd.']], [
    function () { return P(['Add the quark charges. What is the total charge of uud?', 'اجمع شحنات الكواركات. ما الشحنة الكلية لـuud؟'], '2/3 + 2/3 − 1/3', 1); },
    function () { return P(['Add the quark charges. What is the total charge of udd?', 'اجمع شحنات الكواركات. ما الشحنة الكلية لـudd؟'], '2/3 − 1/3 − 1/3', 0); },
    [['Beta-minus decay turns a neutron into:', 'يحول اضمحلال بيتا النيوترون إلى:'], ['A proton, an electron and an antineutrino', 'بروتون وإلكترون ومضاد نيوترينو'], ['Two protons', 'بروتونين'], ['Light only', 'ضوء فقط']]
  ]);
  Topic('a12ph.latent', ['Latent heat and density', 'الحرارة الكامنة والكثافة'], 'thermo', [['Boiling needs energy with no change of temperature: E = mL. Density = mass ÷ volume. Upthrust equals the weight of fluid displaced, as Archimedes found.', 'الغليان يحتاج طاقة بلا تغير حرارة: E = mL. والكثافة = الكتلة ÷ الحجم. والدفع يساوي وزن المائع المزاح.']], [
    function (r) { var m = r.int(2, 9), l = r.pick([300, 2000]); return P(['How much energy changes the state, in kJ?', 'كم الطاقة اللازمة لتغيير الحالة بالكيلوجول؟'], m + ' kg, L = ' + l + ' kJ/kg', m * l); },
    function (r) { var v = r.int(2, 9), d = r.int(2, 9); return P(['What is the density, in g/cm³?', 'ما الكثافة بالغرام لكل سم³؟'], (v * d) + ' g in ' + v + ' cm³', d); },
    function (r) { var v = r.int(2, 9); return P(['Upthrust in N (water 1,000 kg/m³, g = 10), for this many litres.', 'الدفع بالنيوتن لهذا الحجم باللتر.'], v + ' L submerged', v * 10); }
  ]);
  /* ---------- physics, Year 13 ---------- */
  U('science', 'a13ph', ['A level physics: fields and the atom', 'فيزياء: المجالات والذرة'], 4, 13);
  Topic('a13ph.grav', ['Gravitational fields and orbits', 'مجالات الجاذبية والمدارات'], 'planet', [['F = GMm/r². Double the distance, a quarter of the force. For orbits, Kepler’s third law: T² is proportional to r³. A geostationary satellite orbits once a day, about 36,000 km up.', 'F = GMm/r². ضعف البعد ربع القوة. ولكبلر: T² تتناسب مع r³.']], [
    function (r) { var k = r.int(2, 5); return P(['A satellite moves to ' + k + ' times its distance from the planet’s centre. Gravity follows 1/r², so the force is divided by ' + k + '². By what number?', 'ينتقل قمر صناعي إلى ' + k + ' أضعاف بعده عن مركز الكوكب. الجاذبية تتبع ١/ر²، فتُقسم القوة على ' + k + '². على أي عدد؟'], k + '²', k * k); },
    function (r) { var k = r.pick([4, 9, 16]); return P(['Period is multiplied by?', 'يضرب الزمن في؟'], 'r × ' + k, Math.pow(Math.sqrt(k), 3)); },
    [['A geostationary orbit has a period of:', 'الزمن الدوري للمدار الثابت:'], ['One day', 'يوم واحد'], ['One hour', 'ساعة'], ['One year', 'سنة']]
  ]);
  Topic('a13ph.mag', ['Magnetic forces', 'القوى المغناطيسية'], 'magnet', [['A current in a field feels F = BIL. A moving charge feels F = BQv, always at right angles, so it travels in a circle. Motors, speakers and particle accelerators all use this.', 'التيار في مجال يتأثر بـ F = BIL. والشحنة المتحركة بـ F = BQv عموديًا فتتحرك في دائرة.']], [
    function (r) { var b = r.int(1, 5), i = r.int(2, 9), l = r.int(1, 4); return P(['What force acts on the wire, in N?', 'ما القوة على السلك بالنيوتن؟'], 'B = ' + b + ' T, I = ' + i + ' A, L = ' + l + ' m', b * i * l); },
    [['Which rule gives the force direction on a current?', 'أي قاعدة تعطي الاتجاه؟'], ['Fleming’s left hand', 'يد فليمنج اليسرى'], ['Newton’s first', 'قانون نيوتن الأول'], ['Ohm’s law', 'قانون أوم']],
    [['Does a magnetic force do work on a moving charge?', 'هل تبذل القوة المغناطيسية شغلًا على الشحنة؟'], ['No: it is always at right angles', 'لا، فهي عمودية دائمًا'], ['Yes, always', 'نعم دائمًا'], ['Only at rest', 'عند السكون فقط']]
  ]);
  Topic('a13ph.rc', ['Capacitor discharge', 'تفريغ المكثف'], 'battery', [['Charge falls exponentially: Q = Q₀e^(−t/RC). The time constant RC is when it reaches 37%. Each equal time takes off the same fraction, as with radioactive decay.', 'تقل الشحنة أسيًا. والثابت الزمني RC هو زمن بلوغ ٣٧٪.']], [
    function (r) { var R = r.int(2, 9), c = r.int(2, 9); return P(['Time constant in s (kΩ × mF).', 'الثابت الزمني.'], R + ' kΩ, ' + c + ' mF', R * c); },
    function (r) { var c = r.int(1, 9) * 100, v = r.pick([2, 4, 6]); return P(['Energy in µJ, ½CV².', 'الطاقة ½CV².'], c + ' µF at ' + v + ' V', c * v * v / 2); }
  ]);
  Topic('a13ph.ac', ['Alternating current and rms', 'التيار المتناوب والقيمة الفعالة'], 'wave', [['The rms value gives the same heating as that steady value: V_rms = V₀/√2. Mains at 230 V rms peaks near 325 V. A diode rectifies it, and a capacitor smooths it.', 'القيمة الفعالة تعطي التسخين نفسه: V_rms = V₀/√2. والـ٢٣٠ فولت قمتها نحو ٣٢٥.']], [
    function (r) { var k = r.pick([1, 2, 3, 4]); return P(['rms voltage, V (peak is √2 × this).', 'الجهد الفعال.'], 'peak ' + (k * 100) + '√2 V', k * 100); },
    function (r) { var f = r.pick([50, 60]); return P(['How many peaks per second come through a single diode?', 'كم قمة في الثانية تمر عبر صمام ثنائي واحد؟'], f + ' Hz', f); },
    [['A single diode gives:', 'الصمام الواحد يعطي:'], ['Half-wave rectification', 'تقويم نصف موجي'], ['Full-wave rectification', 'تقويم موجي كامل'], ['More voltage', 'جهدًا أعلى']]
  ]);
  Topic('a13ph.bind', ['Binding energy', 'طاقة الربط'], 'star', [['A nucleus weighs less than its parts. That mass difference is the binding energy, E = mc². Iron is near the peak of binding energy per nucleon, so fusing light nuclei or splitting heavy ones releases energy.', 'النواة أخف من مكوناتها، والفرق طاقة الربط. والحديد قرب القمة، فيطلق الاندماج في الخفيف والانشطار في الثقيل طاقة.']], [
    [['Fission of uranium releases energy because the products have:', 'يطلق انشطار اليورانيوم طاقة لأن النواتج:'], ['More binding energy per nucleon', 'طاقة ربط أعلى لكل نوية'], ['More mass', 'كتلة أكبر'], ['More electrons', 'إلكترونات أكثر']],
    function (r) { var a = r.int(20, 240), z = r.int(8, 19); return P(['How many neutrons are in the nucleus?', 'كم نيوترونًا في النواة؟'], 'A = ' + a + ', Z = ' + z, a - z); },
    function (r) { var a = r.int(4, 12) * 4; return P(['Mass number after one alpha decay.', 'العدد الكتلي بعد ألفا.'], 'A = ' + (a + 200), a + 196); }
  ]);
  Topic('a13ph.thermo', ['The first law of thermodynamics', 'القانون الأول للديناميكا الحرارية'], 'fire', [['ΔU = Q + W: internal energy rises with heat in and work done on the gas. Pump a tyre and it warms. Absolute zero is where the particles have least energy, 0 K.', 'ΔU = Q + W. ينفخ الإطار فيدفأ. والصفر المطلق أدنى طاقة للجسيمات.']], [
    function (r) { var q = r.int(10, 90), w = r.int(10, 90); return P(['Rise in internal energy, J.', 'زيادة الطاقة الداخلية.'], q + ' J heat in, ' + w + ' J work done on it', q + w); },
    function (r) { var q = r.int(50, 90), w = r.int(10, 40); return P(['Rise in internal energy, J.', 'زيادة الطاقة الداخلية.'], q + ' J heat in, gas does ' + w + ' J of work', q - w); },
    function (r) { var c = r.int(1, 99); return P(['What is this temperature in kelvin?', 'كم هذه الحرارة بالكلفن؟'], c + '°C', c + 273); }
  ]);
  Topic('a13ph.med', ['Medical physics', 'الفيزياء الطبية'], 'hospital', [['X-rays are absorbed more by bone. CT builds slices. Ultrasound reflects at boundaries, safely for a baby. MRI uses radio waves and strong magnets on hydrogen nuclei. Each trades detail, dose and cost.', 'تمتص العظام الأشعة السينية أكثر. والموجات فوق الصوتية آمنة للجنين. والرنين يستعمل نوى الهيدروجين.']], [
    [['Which is preferred to scan an unborn baby?', 'أيها يفضل لفحص الجنين؟'], ['Ultrasound', 'الموجات فوق الصوتية'], ['CT', 'الأشعة المقطعية'], ['X-ray', 'الأشعة السينية']],
    [['MRI mostly detects:', 'الرنين يكشف أساسًا:'], ['Hydrogen nuclei', 'نوى الهيدروجين'], ['Iron atoms', 'ذرات الحديد'], ['Electrons in bone', 'إلكترونات العظم']],
    function (r) { var t = r.int(1, 9) * 20; return P(['Depth in mm (speed 1.5 mm/µs).', 'العمق بالمليمتر.'], 'echo returns in ' + t + ' µs', t * 1.5 / 2); }
  ]);
  Topic('a13ph.astro', ['Stars and distance', 'النجوم والمسافات'], 'star', [['Hotter stars peak at shorter wavelengths: Wien’s law. Luminosity grows with area and T⁴. Hubble’s law: v = H₀d. Al-Bīrūnī measured the earth’s radius from a mountain, a thousand years ago.', 'النجم الأسخن قمته عند موجة أقصر. والبيروني قاس نصف قطر الأرض من جبل قبل ألف سنة.']], [
    function (r) { var k = r.pick([2, 3]); return P(['Luminosity is multiplied by?', 'يُضرب اللمعان في؟'], 'temperature × ' + k, Math.pow(k, 4)); },
    function (r) { var d = r.int(2, 9) * 10, h = 70; return P(['Recession speed, km/s (H₀ = 70).', 'سرعة الابتعاد.'], d + ' Mpc', d * h); },
    [['A blue star, compared with a red one, is:', 'النجم الأزرق مقارنة بالأحمر:'], ['Hotter', 'أسخن'], ['Colder', 'أبرد'], ['The same', 'مساوٍ']]
  ]);
  U('science', 'a14sc', ['First-year science', 'علوم السنة الأولى'], 4, 14);
  Topic('a14sc.wave', ['The quantum picture', 'الصورة الكمية'], 'wave', [['A particle is described by a wavefunction. Its square gives probabilities. Confinement forces energy into levels: particle in a box, E grows as n². Position and momentum cannot both be sharp.', 'يوصف الجسيم بدالة موجية، ومربعها الاحتمالات. والحصر يفرض مستويات تنمو مع n².']], [
    function (r) { var n = r.int(2, 6); return P(['Energy compared with the lowest level.', 'الطاقة مقارنة بالمستوى الأدنى.'], 'particle in a box, n = ' + n, n * n); },
    [['Squaring a wavefunction gives:', 'مربع الدالة الموجية يعطي:'], ['Probability density', 'كثافة الاحتمال'], ['Mass', 'الكتلة'], ['Charge', 'الشحنة']]
  ]);
  Topic('a14sc.method', ['Reading a scientific paper', 'قراءة ورقة علمية'], 'notebook', [['Abstract, then figures, then methods. Ask: how big was the sample, was there a control, is the effect large, has anyone repeated it? A single study rarely settles anything.', 'الملخص ثم الأشكال ثم الطرق. اسأل: كم العينة، وهل توجد مجموعة ضابطة، وهل أُعيدت التجربة؟']], [
    [['A headline cites one small study with no control. You should:', 'عنوان يذكر دراسة صغيرة بلا ضابطة. عليك:'], ['Treat it as weak evidence', 'عدها دليلًا ضعيفًا'], ['Change your diet at once', 'تغيير طعامك فورًا'], ['Share it', 'نشرها']],
    [['Peer review means:', 'مراجعة الأقران تعني:'], ['Experts check it before publication', 'يفحصه خبراء قبل النشر'], ['It is certainly true', 'صحيح قطعًا'], ['Friends liked it', 'أعجب الأصدقاء']]
  ]);

  /* ---------- chemistry, Year 12 ---------- */
  U('science', 'a12ch', ['A level chemistry: the core', 'الكيمياء: الأساس'], 4, 12);
  Topic('a12ch.orb', ['Orbitals and electron configuration', 'المدارات والتوزيع الإلكتروني'], 'star', [['Electrons fill 1s, 2s, 2p, 3s, 3p, 4s, 3d. An s subshell holds 2, a p holds 6, a d holds 10. Oxygen is 1s² 2s² 2p⁴.', 'تملأ الإلكترونات 1s ثم 2s ثم 2p. وتحمل s اثنين وp ستة وd عشرة. والأكسجين 1s² 2s² 2p⁴.']], [
    function (r) { var s = r.pick([['p', 6], ['d', 10], ['s', 2], ['f', 14]]); return P(['Electrons it can hold.', 'الإلكترونات التي يحملها.'], s[0] + ' subshell', s[1]); },
    function (r) { var e = r.pick([[7, 3], [8, 4], [9, 5], [10, 6], [6, 2]]); return P(['Electrons in the 2p subshell.', 'إلكترونات 2p.'], 'atomic number ' + e[0], e[1]); },
    [['Which fills first?', 'أيها يمتلئ أولًا؟'], ['4s', '4s'], ['3d', '3d'], ['4p', '4p']]
  ]);
  Topic('a12ch.hess', ['Hess’s law', 'قانون هيس'], 'fire', [['The enthalpy change is the same by any route. So combine known reactions. Using bond energies: ΔH = bonds broken − bonds made.', 'تغير المحتوى الحراري واحد في أي مسار. وبطاقات الروابط: ΔH = المكسور − المتكون.']], [
    function (r) { var a = r.int(1, 9) * 100, b = r.int(1, 9) * 100; return X(['Bonds broken minus bonds made: what is ΔH, in kJ?', 'الروابط المكسورة ناقص المتكونة: ما ΔH بالكيلوجول؟'], 'broken ' + a + ', made ' + b, a - b); },
    function (r) { var a = r.int(1, 9) * 10, b = r.int(1, 9) * 10; return X(['ΔH of the overall route, in kJ.', 'ΔH الكلي.'], 'step 1: −' + a + '; step 2: −' + b, -(a + b)); },
    function (r) { var m = r.pick([100, 200, 250]), t = r.int(2, 10); return P(['Heat in J, q = mcΔT, with c = 4 for simplicity.', 'الحرارة، c = 4.'], m + ' g, up ' + t + '°C', m * 4 * t); }
  ]);
  Topic('a12ch.redox', ['Oxidation states', 'حالات الأكسدة'], 'lemon', [['Oxygen is usually −2, hydrogen +1, and they sum to the charge. In H₂SO₄: 2 + S − 8 = 0, so S is +6. Oxidation is loss of electrons, and reduction is gain.', 'الأكسجين −٢ عادة والهيدروجين +١. في H₂SO₄ الكبريت +٦. والأكسدة فقد إلكترونات والاختزال كسبها.']], [
    function (r) { var q = r.pick([['S in SO₃', 6], ['N in HNO₃', 5], ['C in CO₂', 4], ['Mn in KMnO₄', 7], ['Cr in K₂Cr₂O₇', 6]]); return P(['What is the oxidation state of the named atom?', 'ما حالة أكسدة الذرة المذكورة؟'], q[0], q[1]); },
    function (r) { var q = r.pick([['Cl in HCl', -1], ['O in H₂O', -2], ['N in NH₃', -3]]); return X(['What is the oxidation state of the named atom?', 'ما حالة أكسدة الذرة المذكورة؟'], q[0], q[1]); },
    [['Zn + Cu²⁺ → Zn²⁺ + Cu. What is oxidised?', 'ما الذي تأكسد؟'], ['Zinc', 'الزنك'], ['Copper', 'النحاس'], ['Nothing', 'لا شيء']]
  ]);
  Topic('a12ch.kc', ['The equilibrium constant', 'ثابت الاتزان'], 'scale', [['For aA + bB ⇌ cC: Kc = [C]^c ÷ ([A]^a [B]^b). Only temperature changes Kc. A large Kc means products dominate.', 'لـ aA + bB ⇌ cC: Kc = [C]^c ÷ ([A]^a [B]^b). والحرارة وحدها تغير Kc.']], [
    function (r) { var a = r.int(1, 5), b = r.int(1, 5), k = r.int(2, 6); return P(['Work out Kc = [C] ÷ ([A][B]).', 'احسب Kc = [C] ÷ ([A][B]).'], '[C] = ' + (a * b * k) + ', [A] = ' + a + ', [B] = ' + b + ' (A + B ⇌ C)', k); },
    [['Which changes Kc?', 'أيها يغير Kc؟'], ['Temperature', 'الحرارة'], ['A catalyst', 'الحفاز'], ['Pressure', 'الضغط']]
  ]);
  Topic('a12ch.hal', ['Halogenoalkanes and alcohols', 'هاليدات الألكيل والكحولات'], 'drop', [['A nucleophile attacks the δ+ carbon, and replaces the halogen. C–I is weakest, so iodoalkanes react fastest. Alcohols oxidise: primary to aldehyde then acid, secondary to ketone, tertiary not easily.', 'يهاجم النيوكليوفيل الكربون ويحل محل الهالوجين. والرابطة C–I أضعف فتتفاعل أسرع. والكحولات تتأكسد: الأولي إلى ألدهيد فحمض، والثانوي إلى كيتون.']], [
    [['Which reacts fastest with hydroxide?', 'أيها أسرع تفاعلًا؟'], ['Iodoalkane', 'يودو ألكان'], ['Chloroalkane', 'كلورو ألكان'], ['Fluoroalkane', 'فلورو ألكان']],
    [['A secondary alcohol oxidises to:', 'يتأكسد الكحول الثانوي إلى:'], ['A ketone', 'كيتون'], ['An acid', 'حمض'], ['An alkane', 'ألكان']],
    [['A nucleophile is:', 'النيوكليوفيل:'], ['An electron-pair donor', 'مانح زوج إلكترونات'], ['A proton', 'بروتون'], ['A catalyst', 'حفاز']]
  ]);
  Topic('a12ch.grp2', ['Group 2 and the nitrogen story', 'المجموعة الثانية وقصة النيتروجين'], 'stone', [['Down Group 2, atoms get bigger and more reactive. Nitrogen’s triple bond is very strong, so the Haber process needs iron, heat and pressure to make ammonia, which feeds half the world through fertiliser.', 'نزولًا في المجموعة تزيد النشاطية. ورابطة النيتروجين الثلاثية قوية، فتحتاج عملية هابر حديدًا وحرارة وضغطًا.']], [
    function () { return P(['Bonds between the two nitrogen atoms.', 'الروابط بين ذرتي النيتروجين.'], 'N₂', 3); },
    function (r) { var n = r.pick([2, 4, 6, 10]); return P(['Moles of NH₃ from N₂ + 3H₂ → 2NH₃.', 'مولات NH₃.'], n + ' mol N₂', n * 2); },
    [['Haber conditions are a compromise because high temperature:', 'الشروط حل وسط لأن الحرارة العالية:'], ['Speeds up, but lowers yield', 'تسرع وتقلل الناتج'], ['Stops the catalyst only', 'توقف الحفاز فقط'], ['Raises yield only', 'تزيد الناتج فقط']]
  ]);
  U('science', 'a13ch', ['A level chemistry: further', 'الكيمياء: متقدمة'], 4, 13);
  Topic('a13ch.buffer', ['Buffers', 'المحاليل المنظمة'], 'drop', [['A weak acid with its salt resists pH change: added acid meets the salt ion, and added base meets the acid. Your blood is held near pH 7.4 this way, by carbonic acid and hydrogencarbonate.', 'حمض ضعيف مع ملحه يقاوم تغير pH. ويبقى الدم قرب ٧٫٤ بهذا.']], [
    [['A buffer is typically a:', 'المحلول المنظم عادة:'], ['Weak acid and its salt', 'حمض ضعيف وملحه'], ['Strong acid and water', 'حمض قوي وماء'], ['Salt and sugar', 'ملح وسكر']],
    function () { return P(['pH of a neutral solution at 25°C.', 'pH المتعادل.'], '', 7); },
    function (r) { var p = r.int(2, 6); return P(['At 25°C, pH + pOH = 14. What is the pOH?', 'عند ٢٥°: pH + pOH = 14. ما pOH؟'], 'pH = ' + p, 14 - p); }
  ]);
  Topic('a13ch.lattice', ['Lattice energy', 'طاقة الشبكة'], 'gem', [['Born-Haber cycles apply Hess’s law to forming an ionic solid. Lattice energy is greater for smaller, more highly charged ions. So MgO melts far above NaCl.', 'تطبق دورة بورن هابر قانون هيس على المركب الأيوني. وتكبر طاقة الشبكة مع صغر الأيونات وزيادة شحنتها.']], [
    [['Which has the larger lattice energy?', 'أيها أكبر طاقة شبكة؟'], ['MgO', 'MgO'], ['NaCl', 'NaCl'], ['KBr', 'KBr']],
    function () { return P(['Product of ion charges in MgO.', 'حاصل ضرب شحنتي الأيونين في MgO.'], '2+ and 2−', 4); }
  ]);
  Topic('a13ch.tm', ['Transition metals', 'العناصر الانتقالية'], 'rainbow', [['They have many oxidation states and coloured ions, and make good catalysts. Ligands donate electron pairs to form complexes. [Cu(H₂O)₆]²⁺ is pale blue, and copper’s coordination number there is 6.', 'لها حالات أكسدة كثيرة وأيونات ملونة وهي حفازات جيدة. وتعطي الليجندات أزواجًا إلكترونية.']], [
    function () { return P(['How many bonds to ligands does the metal ion make?', 'كم رابطة تكوّن أيون الفلز مع الليغندات؟'], '[Fe(H₂O)₆]³⁺', 6); },
    function (r) { var q = r.pick([['Fe in Fe³⁺', 3], ['Cu in Cu²⁺', 2], ['Mn in MnO₄⁻', 7]]); return P(['What is the oxidation state of the metal?', 'ما حالة أكسدة الفلز؟'], q[0], q[1]); },
    [['Colour in these ions comes from:', 'اللون ينشأ من:'], ['Electrons moving between split d levels', 'انتقال إلكترونات بين مستويات d'], ['Their mass', 'الكتلة'], ['The nucleus', 'النواة']]
  ]);
  Topic('a13ch.nmr', ['NMR and chromatography', 'الرنين النووي والفصل اللوني'], 'microscope', [['Proton NMR: each peak is a hydrogen environment, area gives the count, and a peak split into n + 1 lines has n neighbours. Chromatography separates by how strongly each substance holds to the phases.', 'كل قمة بيئة هيدروجين، والمساحة العدد، والانقسام n + 1 يعني n جيرانًا. والفصل اللوني بحسب تعلق المادة بالطورين.']], [
    function (r) { var n = r.int(1, 4); return P(['By the n + 1 rule, how many lines does the peak split into?', 'بقاعدة n + 1: إلى كم خطًا تنقسم القمة؟'], n + ' neighbouring H', n + 1); },
    function () { return P(['Hydrogen environments in ethanol, CH₃CH₂OH.', 'بيئات الهيدروجين في الإيثانول.'], '', 3); },
    function (r) { var b = r.int(2, 9) * 10, a = r.int(1, 4); return P(['What is the Rf value, times 10?', 'ما قيمة Rf مضروبة في ١٠؟'], 'spot ' + (b * a / 5) + ' cm; solvent ' + b + ' cm', a * 2); }
  ]);
  Topic('a13ch.amines', ['Amines, amides and proteins', 'الأمينات والأميدات والبروتينات'], 'plant', [['Amines are bases, thanks to nitrogen’s lone pair. Amino acid + amino acid join by a peptide bond, releasing water. Nylon uses the same link, so proteins and nylon are chemical cousins.', 'الأمينات قواعد بفضل زوج النيتروجين. وتتحد الأحماض الأمينية برابطة ببتيدية مع خروج الماء.']], [
    function (r) { var n = r.int(3, 30); return P(['Peptide bonds in the chain.', 'الروابط الببتيدية.'], n + ' amino acids', n - 1); },
    [['Amines are basic because nitrogen:', 'الأمينات قاعدية لأن النيتروجين:'], ['Has a lone pair', 'له زوج حر'], ['Is a metal', 'فلز'], ['Has no electrons', 'بلا إلكترونات']]
  ]);
  U('science', 'a14ch', ['Chemistry beyond the syllabus', 'كيمياء بعد المنهج'], 4, 14);
  Topic('a14sc.green', ['Green chemistry', 'الكيمياء الخضراء'], 'tree', [['Prevent waste, use safer solvents, and prefer catalysts. A khalīfah on earth weighs what a process leaves behind. Atom economy and energy per kilogram are the first numbers to check.', 'امنع الهدر واستعمل مذيبات آمنة وفضل الحفازات. والخليفة في الأرض يزن ما يخلفه التصنيع.']], [
    function (r) { var u = r.int(1, 9) * 10; return P(['What is the atom economy, as a percentage?', 'ما الاقتصاد الذري كنسبة مئوية؟'], u + ' of 100 product mass useful', u); },
    [['Catalysts are favoured because they:', 'تفضل الحفازات لأنها:'], ['Save energy and are reused', 'توفر الطاقة ويعاد استعمالها'], ['Are used up', 'تستهلك'], ['Add waste', 'تزيد الهدر']]
  ]);

  /* ---------- biology, Years 12 to 14 ---------- */
  U('science', 'a12bi', ['A level biology: cells to systems', 'الأحياء: من الخلية إلى الأجهزة'], 4, 12);
  Topic('a12bi.cell', ['Cell organelles and microscopes', 'عضيات الخلية والمجهر'], 'microscope', [['Magnification = image size ÷ actual size. Keep units the same: 1 mm = 1,000 µm. Mitochondria release energy, ribosomes make protein, and electron microscopes resolve far finer detail than light.', 'التكبير = حجم الصورة ÷ الحجم الحقيقي. وحد الوحدات. والميتوكوندريا تطلق الطاقة والريبوسومات تصنع البروتين.']], [
    function (r) { var a = r.pick([10, 20, 50]), m = r.pick([100, 200, 400]); return P(['Image size in mm.', 'حجم الصورة بالمليمتر.'], a + ' µm at × ' + m, a * m / 1000); },
    function (r) { var k = r.int(1, 9); return P(['What is this length in micrometres?', 'كم هذا الطول بالميكرومتر؟'], k + ' mm', k * 1000); },
    [['Which organelle packages proteins?', 'أي عضي يعبئ البروتينات؟'], ['The Golgi', 'جهاز جولجي'], ['The nucleus', 'النواة'], ['The vacuole', 'الفجوة']]
  ]);
  Topic('a12bi.heart', ['The cardiac cycle', 'الدورة القلبية'], 'heart', [['Atria contract, then ventricles, then the heart relaxes. Valves open and close with pressure, not muscle. The SAN sets the rhythm. Cardiac output = stroke volume × heart rate.', 'يتقلص الأذينان ثم البطينان ثم يسترخي القلب. والصمامات تعمل بالضغط. والعقدة الجيبية تضبط الإيقاع.']], [
    function (r) { var s = r.int(6, 9) * 10, h = r.int(6, 9) * 10; return P(['Stroke volume × heart rate: what is the cardiac output, in mL/min?', 'حجم الضربة × معدل القلب: ما النتاج القلبي بالمليلتر في الدقيقة؟'], s + ' mL × ' + h + ' beats/min', s * h); },
    function (r) { var c = r.pick([60, 75, 100]); return P(['Beats per minute, if a cycle lasts this many hundredths of a second.', 'النبضات في الدقيقة.'], 'cycle ' + (6000 / c) + ' hundredths of a second', c); },
    [['What closes the valves?', 'ما الذي يغلق الصمامات؟'], ['Pressure differences', 'فروق الضغط'], ['Nerves directly', 'الأعصاب مباشرة'], ['Hormones', 'الهرمونات']]
  ]);
  Topic('a12bi.hb', ['Haemoglobin and oxygen', 'الهيموجلوبين والأكسجين'], 'drop', [['Haemoglobin loads oxygen in the lungs and unloads it in tissue. More CO₂ shifts its curve to the right, so busy muscle gets more oxygen: the Bohr effect. Fetal haemoglobin binds more strongly, taking oxygen from the mother.', 'يحمل الهيموجلوبين الأكسجين في الرئتين ويفرغه في الأنسجة. وزيادة CO₂ تزيد التفريغ: تأثير بور.']], [
    function () { return P(['Oxygen molecules on one haemoglobin.', 'جزيئات الأكسجين على هيموجلوبين واحد.'], '', 4); },
    [['High CO₂ makes haemoglobin:', 'ارتفاع CO₂ يجعل الهيموجلوبين:'], ['Release oxygen more readily', 'يطلق الأكسجين أسهل'], ['Hold oxygen tighter', 'يتمسك أكثر'], ['Break apart', 'يتفكك']]
  ]);
  Topic('a12bi.disease', ['Malaria, TB and HIV', 'الملاريا والسل والإيدز'], 'hospital', [['Malaria is a protist carried by mosquitoes. TB is a bacterium spread through the air. HIV is a virus attacking T helper cells. Knowing the cause tells you the control: nets, antibiotics, antiretrovirals.', 'الملاريا طفيلي ينقله البعوض. والسل بكتيريا هوائية. والإيدز فيروس يهاجم الخلايا التائية.']], [
    [['Malaria is caused by:', 'تسبب الملاريا:'], ['A protist', 'طفيلي أولي'], ['A virus', 'فيروس'], ['A bacterium', 'بكتيريا']],
    [['TB is treated with:', 'يعالج السل بـ:'], ['Long courses of antibiotics', 'مضادات حيوية طويلة'], ['Antivirals only', 'مضادات فيروسات'], ['Nothing', 'لا شيء']],
    [['HIV damages which cells?', 'أي خلايا يتلف الإيدز؟'], ['T helper cells', 'التائية المساعدة'], ['Red cells', 'الحمراء'], ['Muscle cells', 'العضلية']]
  ]);
  U('science', 'a13bi', ['A level biology: energy and control', 'الأحياء: الطاقة والتحكم'], 4, 13);
  Topic('a13bi.resp', ['Glycolysis and the Krebs cycle', 'التحلل السكري ودورة كربس'], 'fire', [['Glycolysis splits glucose in the cytoplasm, for 2 net ATP. The Krebs cycle runs in the mitochondrial matrix. The electron transport chain makes most of the ATP, using oxygen as the final acceptor, for around 30 in all.', 'يشق التحلل الجلوكوز في السيتوبلازم بصافي ATP اثنين. وتعمل دورة كربس في الحشوة. وسلسلة النقل تنتج معظم ATP.']], [
    function () { return P(['Net ATP from glycolysis.', 'صافي ATP من التحلل.'], '', 2); },
    [['Where does most ATP come from?', 'من أين يأتي معظم ATP؟'], ['The electron transport chain', 'سلسلة نقل الإلكترونات'], ['Glycolysis', 'التحلل السكري'], ['The nucleus', 'النواة']],
    [['Oxygen’s role is to:', 'دور الأكسجين:'], ['Accept electrons at the end', 'استقبال الإلكترونات في النهاية'], ['Make glucose', 'صنع الجلوكوز'], ['Split DNA', 'شق DNA']]
  ]);
  Topic('a13bi.home', ['Homeostasis in depth', 'الاتزان الداخلي بعمق'], 'thermo', [['Sensors, control centre, effectors, with negative feedback. Glucose: insulin lowers it, glucagon raises it. Water: ADH makes the collecting ducts more permeable. Fasting shows these systems working all month.', 'مستقبلات ومركز تحكم ومنفذات بتغذية راجعة سالبة. الإنسولين يخفض والجلوكاجون يرفع. وفي الصيام ترى هذا طوال الشهر.']], [
    [['After hours of fasting, which hormone rises?', 'بعد ساعات من الصيام، أي هرمون يرتفع؟'], ['Glucagon', 'الجلوكاجون'], ['Insulin', 'الإنسولين'], ['ADH only', 'ADH فقط']],
    [['When dehydrated, ADH:', 'عند الجفاف ADH:'], ['Rises, so more water is reabsorbed', 'يزيد فيعاد امتصاص ماء أكثر'], ['Falls', 'يقل'], ['Stops', 'يتوقف']]
  ]);
  Topic('a13bi.hw', ['Population genetics', 'وراثة العشائر'], 'plant', [['Hardy-Weinberg: p + q = 1, and p² + 2pq + q² = 1. If 4% show a recessive condition, q² = 0.04, so q = 0.2, p = 0.8, and carriers are 2pq = 32%.', 'هاردي واينبرغ: p + q = 1 وp² + 2pq + q² = 1. إذا ظهر المتنحي في ٤٪ فـ q = ٠٫٢ وp = ٠٫٨ والحاملون ٣٢٪.']], [
    function (r) { var q = r.pick([1, 2, 3, 4, 5]); return P(['% who carry it, 2pq.', 'نسبة الحاملين.'], 'q = 0.' + q, 2 * q * (10 - q)); },
    function (r) { var q = r.pick([1, 2, 3, 4, 5]); return P(['% showing the recessive trait, q².', 'نسبة المتنحي.'], 'q = 0.' + q, q * q); },
    function (r) { var q = r.pick([1, 2, 3, 4]); return P(['Use p + q = 1. What is p, in tenths?', 'استعمل p + q = 1. ما p بالأعشار؟'], 'q = 0.' + q, 10 - q); }
  ]);
  Topic('a13bi.div', ['Classifying and measuring biodiversity', 'التصنيف وقياس التنوع'], 'tree', [['Kingdom, phylum, class, order, family, genus, species. Simpson’s index: D = 1 − Σ(n/N)². A higher D means more diversity. Quadrats and transects give the numbers.', 'مملكة فشعبة فطائفة فرتبة ففصيلة فجنس فنوع. ومؤشر سيمبسون يقيس التنوع.']], [
    [['Which is the smallest group?', 'أيها أصغر مجموعة؟'], ['Species', 'النوع'], ['Family', 'الفصيلة'], ['Order', 'الرتبة']],
    function (r) { var a = r.int(2, 6), q = r.int(2, 9), t = r.pick([10, 20, 50]); return P(['How many are estimated across the whole area?', 'كم العدد المقدر في المساحة كلها؟'], 'average ' + a + ' in a 1 m² quadrat, over ' + (q * t) + ' m²', a * q * t); },
    function (r) { var k = r.pick([2, 4, 5, 10]); return P(['D as a percentage, for equal species, 1 − 1/k.', 'D نسبة مئوية.'], k + ' equally common species', 100 - 100 / k); }
  ]);
  U('science', 'a14bi', ['Biology beyond the syllabus', 'أحياء بعد المنهج'], 4, 14);
  Topic('a14sc.epi', ['Epidemiology', 'علم الأوبئة'], 'hospital', [['R₀ is how many people one case infects, with no one immune. Above 1 it spreads, and below 1 it dies out. Vaccinate more than 1 − 1/R₀ of people, and the outbreak fades.', 'R₀ عدد من يصيبهم مريض واحد. فوق ١ ينتشر وتحته يخمد. وتطعيم أكثر من 1 − 1/R₀ يخمد الوباء.']], [
    function (r) { var k = r.pick([2, 4, 5, 10]); return P(['Herd immunity threshold, %.', 'عتبة المناعة.'], 'R₀ = ' + k, 100 - 100 / k); },
    function (r) { var k = r.int(2, 4), g = r.int(2, 4); return P(['New cases in this generation, from one.', 'الحالات الجديدة في هذا الجيل.'], 'R = ' + k + ', generation ' + g, Math.pow(k, g)); },
    [['Quarantine works by lowering:', 'يعمل الحجر بخفض:'], ['Effective R', 'R الفعلي'], ['Temperature', 'الحرارة'], ['Age', 'العمر']]
  ]);
})();
