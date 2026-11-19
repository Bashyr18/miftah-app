/* What each letter in a formula stands for, shown under the formula on a Learn page (web/js/lesson/lesson-aids.js).
   Keyed by the formula exactly as the lessons write it, so a letter is only ever explained where its meaning is certain:
   s is displacement in v² = u² + 2as and nowhere else. Units are SI unless the lesson says otherwise. */
(function () {
  'use strict';
  var K = window.FKEYS = {};
  function add(forms, rows) { forms.forEach(function (f) { K[f] = rows; }); }
  var v = ['v', 'final velocity, m/s', 'السرعة النهائية، م/ث'], u = ['u', 'starting velocity, m/s', 'السرعة الابتدائية، م/ث'],
    a = ['a', 'acceleration, m/s²', 'التسارع، م/ث²'], t = ['t', 'time, s', 'الزمن، ث'], s = ['s', 'displacement, m', 'الإزاحة، م'];
  add(['v = u + at'], [v, u, a, t]);
  add(['s = ut + ½at²'], [s, u, a, t]);
  add(['v² = u² + 2as'], [v, u, a, s]);
  add(['V = I × R'], [['V', 'potential difference, volts (V)', 'فرق الجهد، فولت'], ['I', 'current, amps (A)', 'التيار، أمبير'], ['R', 'resistance, ohms (Ω)', 'المقاومة، أوم']]);
  add(['V = ε − Ir'], [['V', 'voltage across the terminals, V', 'الجهد بين الطرفين'], ['ε', 'e.m.f.: energy the cell gives each coulomb, V', 'القوة الدافعة الكهربائية'], ['I', 'current, A', 'التيار'], ['r', 'internal resistance of the cell, Ω', 'المقاومة الداخلية للخلية']]);
  add(['R = (R₁ × R₂) ÷ (R₁ + R₂)'], [['R', 'total resistance of two in parallel, Ω', 'المقاومة الكلية لمقاومتين على التوازي'], ['R₁, R₂', 'the two resistances, Ω', 'المقاومتان']]);
  add(['Z = √(R² + X²)'], [['Z', 'impedance: total opposition to alternating current, Ω', 'الممانعة: المعارضة الكلية للتيار المتردد'], ['R', 'resistance, Ω', 'المقاومة'], ['X', 'reactance, from capacitors and coils, Ω', 'المفاعلة من المكثفات والملفات']]);
  add(['Energy = ½CV²'], [['C', 'capacitance, farads (F)', 'السعة، فاراد'], ['V', 'voltage across the capacitor, V', 'الجهد على المكثف']]);
  add(['E = mc²'], [['E', 'energy, joules (J)', 'الطاقة، جول'], ['m', 'mass, kg', 'الكتلة، كغ'], ['c', 'speed of light, 3 × 10⁸ m/s', 'سرعة الضوء']]);
  add(['E = m × c × ΔT'], [['E', 'energy to heat it, J', 'الطاقة اللازمة للتسخين، جول'], ['m', 'mass, kg', 'الكتلة، كغ'], ['c', 'specific heat capacity, J/kg°C', 'السعة الحرارية النوعية'], ['ΔT', 'rise in temperature, °C', 'الارتفاع في درجة الحرارة']]);
  add(['E = mL'], [['E', 'energy, J', 'الطاقة، جول'], ['m', 'mass, kg', 'الكتلة، كغ'], ['L', 'specific latent heat: energy per kg to change state, J/kg', 'الحرارة الكامنة النوعية']]);
  add(['pV = nRT'], [['p', 'pressure, Pa', 'الضغط، باسكال'], ['V', 'volume, m³', 'الحجم، م³'], ['n', 'amount of gas, moles', 'كمية الغاز، مول'], ['R', 'gas constant, 8.31 J/mol K', 'ثابت الغازات'], ['T', 'temperature, kelvin (K)', 'درجة الحرارة بالكلفن']]);
  add(['F = GMm/r²'], [['F', 'gravitational force, N', 'قوة الجاذبية، نيوتن'], ['G', 'gravitational constant, 6.67 × 10⁻¹¹ N m²/kg²', 'ثابت الجاذبية'], ['M, m', 'the two masses, kg', 'الكتلتان، كغ'], ['r', 'distance between their centres, m', 'المسافة بين المركزين، م']]);
  add(['A current in a field feels F = BIL'], [['F', 'force on the wire, N', 'القوة على السلك'], ['B', 'magnetic flux density, tesla (T)', 'كثافة الفيض المغناطيسي، تسلا'], ['I', 'current, A', 'التيار'], ['L', 'length of wire in the field, m', 'طول السلك داخل المجال']]);
  add(['d sin θ = nλ'], [['d', 'gap between neighbouring slits, m', 'المسافة بين شقين متجاورين'], ['θ', 'angle of the bright line from the centre', 'زاوية الخط المضيء عن المركز'], ['n', 'order: 1st, 2nd… bright line', 'الرتبة: الخط المضيء الأول، الثاني…'], ['λ', 'wavelength, m', 'الطول الموجي']]);
  add(['v = H₀d'], [['v', 'speed a galaxy moves away, km/s', 'سرعة ابتعاد المجرة'], ['H₀', 'Hubble constant, about 70 km/s per megaparsec', 'ثابت هابل'], ['d', 'distance to the galaxy, megaparsecs', 'بعد المجرة']]);
  add(['Rate = k[A]²'], [['k', 'rate constant: fixed at one temperature', 'ثابت السرعة عند درجة حرارة معينة'], ['[A]', 'concentration of A, mol/dm³', 'تركيز المادة A'], ['²', 'order 2: double [A], four times the rate', 'رتبة ٢: ضاعف التركيز تتضاعف السرعة أربعًا']]);
  add(['D = 1 − Σ(n/N)²'], [['D', 'Simpson’s diversity index, 0 to 1', 'مؤشر سيمبسون للتنوع'], ['n', 'number of one species', 'عدد أفراد نوع واحد'], ['N', 'total number of all organisms', 'العدد الكلي'], ['Σ', 'add up for every species', 'اجمع لكل الأنواع']]);
  add(['a = (m₁ − m₂)g ÷ (m₁ + m₂)'], [['a', 'acceleration of the two masses, m/s²', 'تسارع الكتلتين'], ['m₁, m₂', 'the heavier and lighter mass, kg', 'الكتلة الأثقل والأخف'], ['g', 'gravitational field strength, 9.8 N/kg', 'شدة مجال الجاذبية']]);
  /* maths */
  add(['y = mx + c', 'Fit y = mx + c by minimising squared errors'], [['m', 'gradient: up for every 1 across', 'الميل: الصعود لكل وحدة أفقية'], ['c', 'where the line crosses the y axis', 'نقطة تقاطع المستقيم مع محور y']]);
  add(['a² = c² − b²', 'd² = a² + b² + c²'], [['c', 'the hypotenuse, opposite the right angle', 'الوتر، مقابل الزاوية القائمة'], ['a, b', 'the two shorter sides', 'الضلعان الأقصر']]);
  add(['Volume = π r² × h'], [['r', 'radius of the circular end', 'نصف قطر القاعدة الدائرية'], ['h', 'height (length) of the cylinder', 'ارتفاع الأسطوانة']]);
  add(['V = π∫y² dx'], [['V', 'volume of the solid made by spinning the curve round the x axis', 'حجم المجسم الناتج عن دوران المنحنى حول محور x'], ['y', 'the curve’s height: the radius of each thin disc', 'ارتفاع المنحنى: نصف قطر كل قرص رقيق']]);
  add(['x₂ = x₁ − f(x₁)/f′(x₁)'], [['x₁', 'your current guess', 'التخمين الحالي'], ['x₂', 'the better guess', 'التخمين الأفضل'], ['f′(x₁)', 'the slope of the curve at the guess', 'ميل المنحنى عند التخمين']]);
  add(['E(X) = Σ x·P(x)'], [['E(X)', 'expected value: the long-run average', 'القيمة المتوقعة: المتوسط على المدى الطويل'], ['P(x)', 'chance of the value x', 'احتمال القيمة x']]);
  add(['mean = np', 'variance = np(1 − p)', 'Expected successes = np'], [['n', 'number of trials', 'عدد المحاولات'], ['p', 'chance of success in one trial', 'احتمال النجاح في محاولة واحدة']]);
  add(['(uv)′ = u′v + uv′'], [['u, v', 'two functions of x, multiplied', 'دالتان في x مضروبتان'], ['′', 'derivative: rate of change', 'المشتقة: معدل التغير']]);
  add(['dy/dx = ky means growth proportional to size'], [['k', 'growth rate: how fast, per unit of size', 'معدل النمو لكل وحدة من الحجم']]);
  add(['r = a + tb describes any line in space'], [['a', 'position of one point on the line', 'موضع نقطة على المستقيم'], ['b', 'direction of the line', 'اتجاه المستقيم'], ['t', 'any number: each t gives another point', 'أي عدد: كل قيمة تعطي نقطة أخرى']]);
  add(['(x − a)² + (y − b)² = r²'], [['(a, b)', 'the centre of the circle', 'مركز الدائرة'], ['r', 'its radius', 'نصف القطر']]);
  add(['Write z = a + bi as a point', 'i is defined by i² = −1'], [['a', 'real part: across', 'الجزء الحقيقي: أفقيًا'], ['b', 'imaginary part: up', 'الجزء التخيلي: رأسيًا'], ['i', 'the number whose square is −1', 'العدد الذي مربعه −١']]);
  add(['(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ'], [['θ', 'the angle (argument) of the complex number', 'زاوية العدد المركب'], ['n', 'the power', 'الأس'], ['i', 'the number whose square is −1', 'العدد الذي مربعه −١']]);
})();
