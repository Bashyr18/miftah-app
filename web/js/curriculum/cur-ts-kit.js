/* Helpers shared by the taught science lessons, Years 7 to 10. Built on the maths engine (lesson/teach.js); see the top of that file for the shape. */
(function () {
  'use strict';
  var C = window.C, TM = C.TM;
  var TS = C.TS = {
    /* a science lesson: the same engine, and the checker computes its lines with the units taken off */
    teach: function (id, sp) { sp.sci = true; return C.teach(id, sp); },
    /* a choice of words. The first is right. A wrong option may carry its reason: [en, ar, whyEn, whyAr] */
    ch: function (q, right, wrong, extra) { var P = { q: q, o: [right].concat(wrong) }; if (extra) for (var k in extra) P[k] = extra[k]; return P; },
    /* a line of reasoning with a missing word to choose: note, then the line before, the word, the line after, the wrong words */
    w: function (note, before, word, after, wrong) { return [note ? note[0] : null, note ? note[1] : null, before || '', word, after || '', wrong]; },
    /* Arabic counting: cnt(n, 'مصباح', 'مصباحان', 'مصابيح', 'مصباحًا') gives the right noun for the number */
    cnt: function (x, one, two, few, many) { return x === 1 ? one : x === 2 ? two : x >= 3 && x <= 10 ? x + ' ' + few : x + ' ' + many; },
    /* a tidy number for science: up to 3 decimal places, no floating dust */
    n: function (x, d) { return +(+x).toFixed(d == null ? 3 : d); },
    /* units and chemical symbols are written the international way in both languages, so they are not words to translate */
    UNITS: ['mol/dm³', 'mmol/L', 'mm/day', 'MW', 'C', 'g/min', 'cm³/min', 'cm³/s', 'mm/min', '°C/min', 'kJ/min', 'kJ/g', 'm/s²', 'm/s', 'km/h', 'kg m/s', 'N m', 'J/kg°C', 'J/kg', 'g/cm³', 'kg/m³', 'g/mol', 'cm³', 'dm³', 'm³', 'm²', 'cm²', 'kWh', 'kW', 'kJ', 'kg', 'km', 'cm', 'mm', 'mA', 'Hz', 'Pa', 'mol', 'ms', 'MJ', '°C', 'Ω', 'N', 'J', 'W', 'V', 'A', 's', 'm', 'g', 'h', 'K', 'L', 'mL', 'min', 'kPa', 'N/m', 'N/kg'],
    /* the first twenty elements: symbol, proton number, mass number (most common), English, Arabic */
    E20: [['H', 1, 1, 'hydrogen', 'الهيدروجين'], ['He', 2, 4, 'helium', 'الهيليوم'], ['Li', 3, 7, 'lithium', 'الليثيوم'], ['Be', 4, 9, 'beryllium', 'البيريليوم'], ['B', 5, 11, 'boron', 'البورون'], ['C', 6, 12, 'carbon', 'الكربون'], ['N', 7, 14, 'nitrogen', 'النيتروجين'], ['O', 8, 16, 'oxygen', 'الأكسجين'], ['F', 9, 19, 'fluorine', 'الفلور'], ['Ne', 10, 20, 'neon', 'النيون'], ['Na', 11, 23, 'sodium', 'الصوديوم'], ['Mg', 12, 24, 'magnesium', 'المغنيسيوم'], ['Al', 13, 27, 'aluminium', 'الألومنيوم'], ['Si', 14, 28, 'silicon', 'السيليكون'], ['P', 15, 31, 'phosphorus', 'الفوسفور'], ['S', 16, 32, 'sulfur', 'الكبريت'], ['Cl', 17, 35, 'chlorine', 'الكلور'], ['Ar', 18, 40, 'argon', 'الأرغون'], ['K', 19, 39, 'potassium', 'البوتاسيوم'], ['Ca', 20, 40, 'calcium', 'الكالسيوم']],
    /* electrons in shells, 2 then 8 then 8, for the first twenty */
    shells: function (z) { var s = [], c = [2, 8, 8, 2]; for (var i = 0; z > 0; i++) { s.push(Math.min(z, c[i])); z -= c[i]; } return s; },
    EL: ['He', 'Li', 'Be', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'Cl', 'Ar', 'Ca', 'Fe', 'Cu', 'Zn', 'Br', 'Ag', 'Pb', 'Au', 'Ba', 'Mn', 'Sn', 'Hg', 'Ni', 'Cr', 'Rb', 'Cs', 'Sr', 'Ti', 'Pt', 'Kr', 'Xe', 'Rn', 'Fr', 'Ra', 'H', 'B', 'C', 'N', 'O', 'F', 'P', 'S', 'K', 'I', 'U']
  };
  /* words that may sit inside a science working line; each appears in Arabic */
  var W = { Mass: 'الكتلة', Force: 'القوة', Weight: 'الوزن', Energy: 'الطاقة', Power: 'القدرة', Work: 'الشغل', Current: 'التيار', Voltage: 'الجهد', Resistance: 'المقاومة', Moment: 'العزم', Pressure: 'الضغط', Density: 'الكثافة', Efficiency: 'الكفاءة', Momentum: 'كمية الحركة', Wavelength: 'الطول الموجي', Frequency: 'التردد', Moles: 'المولات', Yield: 'المردود', Useful: 'المفيد', Wasted: 'المهدر', Net: 'المحصلة', Charge: 'الشحنة', Protons: 'البروتونات', Neutrons: 'النيوترونات', Electrons: 'الإلكترونات', Acceleration: 'التسارع', Extension: 'الاستطالة', Depth: 'العمق', Left: 'اليسار', Right: 'اليمين', Each: 'كل', Input: 'الداخل', Output: 'الناتج', Atoms: 'الذرات', Remaining: 'المتبقي', Population: 'العدد الكلي', Heat: 'الحرارة', 'Outer shell': 'الغلاف الخارجي', Shells: 'الأغلفة', Bonds: 'الروابط', Lose: 'يفقد', Gain: 'يكتسب', Count: 'العدد' };
  for (var k in W) if (!(k in TM.WORDS)) TM.WORDS[k] = W[k];
})();
