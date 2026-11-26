/* What connects the rooms: which simulations belong to which lessons, and which lessons lean on another subject. */
(function () {
  'use strict';
  var C = window.C;
  /* id, room, from year, title, lessons it joins */
  var R = [
    ['fraction', 'math', 3, ['Fraction bars', 'أشرطة الكسور'], ['m3.frac', 'm4.sameD', 'm5.cmpF', 'm5.mixed']],
    ['area', 'math', 3, ['Multiplying as area', 'الضرب مساحة'], ['m4.mul21', 'm4.area', 'm5.mul22']],
    ['numberline', 'math', 4, ['Walking the number line', 'خط الأعداد'], ['m4.neg', 'm6.negop', 'm8.neg']],
    ['chance', 'math', 5, ['Rolling dice many times', 'رمي النرد مرارًا'], ['m6.prob', 'm8.prob', 'm9.tree']],
    ['girih', 'math', 5, ['Islamic star patterns', 'النجوم الإسلامية'], ['m7.poly']],
    ['triangle', 'math', 6, ['A living triangle', 'مثلث حي'], ['m6.tri180', 'm7.line', 'm10.sine']],
    ['pythag', 'math', 7, ['Pythagoras', 'فيثاغورس'], ['m8.pyth', 'd11.sine3d']],
    ['line', 'math', 8, ['Straight lines', 'الخطوط المستقيمة'], ['m8.line', 'm8.slope']],
    ['polynomial', 'math', 9, ['A curve that obeys you', 'منحنى يطيعك'], ['m9.fquad', 'm9.solveq', 'm10.funcs']],
    ['steps', 'math', 9, ['Solving step by step', 'الحل خطوة خطوة'], ['m10.formula', 'd12.quaddisc']],
    ['unitcircle', 'math', 9, ['The unit circle', 'دائرة الوحدة'], ['m9.sohcah', 'm12.trig', 'd9.trigside', 'd12.trigeq']],
    ['tangent', 'math', 11, ['The derivative, live', 'المشتقة حية'], ['m12.diff', 'm12.diffuse', 'd11.diffbasic', 'd11.turn']],
    ['riemann', 'math', 11, ['The integral, live', 'التكامل حيًا'], ['m12.integ', 'm12.area', 'd12.defint']],
    ['matrix', 'math', 12, ['Matrices move space', 'المصفوفات تحرك الفضاء'], ['fm13.matrix', 'm14.matrix', 'd13.matinv']],
    ['bayes', 'math', 12, ['Bayes’ theorem', 'مبرهنة بايز'], ['fm13.prob', 'd11.cond']],
    ['density', 'science', 2, ['Float or sink', 'الطفو والغوص'], ['s2.float', 's6.density']],
    ['moon', 'science', 3, ['Phases of the moon', 'منازل القمر'], ['s3.moon', 'd3.calendar']],
    ['particles', 'science', 2, ['Solid, liquid, gas', 'الصلب والسائل والغاز'], ['s2.melt', 's6.particles']],
    ['shadow', 'science', 4, ['Shadows and prayer times', 'الظل ومواقيت الصلاة'], ['s4.light']],
    ['force', 'science', 6, ['Force and mass', 'القوة والكتلة'], ['s7.speed', 'p8.newton', 'm12.force']],
    ['ohm', 'science', 4, ['A live circuit', 'دائرة حية'], ['s4.circuit', 's7.circuit', 'p9.ohm']],
    ['pendulum', 'science', 5, ['The pendulum', 'البندول'], ['p8.speed', 'sci12.shm']],
    ['atom', 'science', 6, ['Build an atom', 'ابنِ ذرة'], ['s6.atoms', 'c8.atom', 'c8.table']],
    ['projectile', 'science', 7, ['Launching a projectile', 'إطلاق مقذوف'], ['m13.proj']],
    ['refraction', 'science', 7, ['Bending light', 'انكسار الضوء'], ['p9.haytham']],
    ['wave', 'science', 7, ['Waves', 'الموجات'], ['p9.waves', 'p9.em', 'phy9.sound2', 'phy12.interference']],
    ['orbit', 'science', 7, ['Finding an orbit', 'إيجاد المدار'], ['s3.planets', 'p12.circ']],
    ['titration', 'science', 8, ['Acid meets alkali', 'الحمض والقلوي'], ['c8.acid', 'che11.titr', 'che12.acidk']],
    ['rate', 'science', 8, ['Collisions and reaction rate', 'التصادم وسرعة التفاعل'], ['c9.rate', 'c9.energy']],
    ['diffusion', 'science', 8, ['Diffusion', 'الانتشار'], ['b8.diff']],
    ['enzyme', 'science', 8, ['Enzymes and heat', 'الإنزيمات والحرارة'], ['b8.enz']],
    ['predator', 'science', 7, ['Predators and prey', 'المفترس والفريسة'], ['s6.ecosystem', 'b9.ecosys']],
    ['punnett', 'science', 9, ['How traits are inherited', 'توريث الصفات'], ['b9.inherit', 'bio11.transgenic']],
    ['binary', 'computing', 5, ['Bits and binary', 'الخانات الثنائية'], ['k8.binary']],
    ['gates', 'computing', 5, ['Logic gates', 'البوابات المنطقية'], ['k5.logic', 'en11.logicgates']],
    ['sort', 'computing', 8, ['Sorting race', 'سباق الترتيب'], ['k9.sort']],
    ['path', 'computing', 9, ['Finding the shortest path', 'أقصر طريق'], ['k10.graph']],
    ['descent', 'computing', 10, ['How AI learns', 'كيف يتعلم الذكاء الاصطناعي'], ['ai11.grad']],
    ['neuron', 'computing', 10, ['Train a neuron', 'درّب عصبونًا'], ['ai11.class', 'ai12.nn', 'ai13.loss']],
    ['lever', 'engineering', 4, ['Levers and balance', 'الروافع والتوازن'], ['en4.levers', 'p8.moment']],
    ['gears', 'engineering', 5, ['Gears', 'التروس'], ['en6.gears']],
    ['beam', 'engineering', 7, ['Loading a beam', 'تحميل عارضة'], ['en6.truss', 'en10.stress', 'en11b.beams', 'phy12.materials']],
    ['pid', 'engineering', 11, ['Control systems', 'أنظمة التحكم'], ['en12.control']],
    ['letters', 'arabic', 2, ['How letters join', 'كيف تتصل الحروف'], ['a2.sh1', 'a.old1']]
  ];
  C.SIMS = R.map(function (x) { return { id: x[0], room: x[1], y: x[2], t: x[3], skills: x[4] }; });
  C.SIMBY = {}; C.SIMS.forEach(function (s) {
    C.SIMBY[s.id] = s;
    s.skills.forEach(function (id) { var sk = C.skills[id]; if (sk && Array.isArray(sk.meet)) sk.meet = sk.meet.concat([{ k: 'sim', sim: s.id, p: s.t, silent: true }]); });
  });
  /* lessons that lean on another subject */
  var USES = {
    'p8.speed': ['m8.ratio'], 'p8.work': ['m6.order'], 'p8.newton': ['m6.alg'], 'p9.ohm': ['m6.alg2', 'm9.rearr'], 'p9.waves': ['m9.rearr'], 'p12.circ': ['m12.trig'], 'c9.moles': ['m8.ratio'], 'c8.react': ['m6.alg'],
    'b9.inherit': ['m8.prob'], 'b9.ecosys': ['m6.pctof'], 'x13.relativity': ['m12.diff'], 'x13.em': ['m13.diffeq'],
    'ai11.reg': ['m8.line'], 'ai11.grad': ['m12.diff'], 'ai12.nn': ['m13.chain', 'fm13.matrix'], 'ai12.vec': ['fm13.matrix', 'fm13.vector'], 'k10.crypto': ['g7.mod'], 'k9.func': ['m8.line', 'm10.funcs'], 'k12.complex': ['m12.log'],
    'en4.levers': ['m4.mul21'], 'en6.gears': ['m6.ratio'], 'en10.stress': ['m8.ratio'], 'en11.ac': ['p9.power'], 'en11.thermo': ['c9.energy'], 'en12.control': ['m12.diffuse'], 'en12.signal': ['m9.sohcah'], 'en8.arduino': ['k8.if'], 'en11.logicgates': ['k5.logic'],
    'd2.zakah': ['m3.frac'], 'd11.zakah': ['m7.zakah'], 'w10.inflation': ['m8.reppct'], 'w10.waqf': ['d2.zakah'], 'w9.climate': ['s3.water'], 'w4.khwarizmi': ['m6.alg'], 'b8.circ': ['s5.heart'], 'b9.evolve': ['d10.evolution'],
    'l10.budget': ['m4.budget'], 'l10.debt': ['d11.money'], 'e9.cite': ['d9.grades'], 'a12.tafsir': ['d8.tafsir'], 'a7.common': ['d6.quran'], 's4.light': ['d2.adhan'], 'm7.calendar': ['d3.calendar']
  };
  C.USEDBY = {};
  Object.keys(USES).forEach(function (id) { var sk = C.skills[id]; if (!sk) return; sk.uses = USES[id].filter(function (n) { return C.skills[n]; }); sk.uses.forEach(function (n) { (C.USEDBY[n] = C.USEDBY[n] || []).push(id); }); });
})();
