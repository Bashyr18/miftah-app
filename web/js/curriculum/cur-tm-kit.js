/* Small helpers shared by the taught maths lessons. */
(function () {
  'use strict';
  var C = window.C;
  var gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; };
  C.TM = {
    gcd: gcd,
    lcm: function (a, b) { return a * b / gcd(a, b); },
    /* a fraction in its lowest terms, as text */
    low: function (n, d) { var g = gcd(n, d), s = d < 0 ? -1 : 1; n = n / g * s; d = d / g * s; return d === 1 ? String(n) : n + '/' + d; },
    /* a tidy decimal, free of floating point dust */
    dp: function (x, n) { return +x.toFixed(n == null ? 6 : n); },
    /* a signed term for an expression: "+ 3" or "− 3" */
    sg: function (x) { return (x < 0 ? '− ' : '+ ') + Math.abs(x); },
    /* a number with a proper minus sign */
    m: function (x) { return x < 0 ? '−' + Math.abs(x) : String(x); },
    /* up to three different wrong options, none equal to the right one */
    pick3: function (r, right, pool) { var out = []; r.shuffle(pool).forEach(function (x) { if (x !== right && out.indexOf(x) < 0 && out.length < 3) out.push(x); }); return out; },
    /* left to right even inside Arabic: coordinates, expressions */
    ltr: function (x) { return '⁦' + x + '⁩'; },
    /* a choice whose options read the same in both languages: numbers, expressions */
    same: function (list) { return list.map(function (x) { return [String(x), '⁦' + x + '⁩']; }); },
    /* the only words allowed inside a working line; every other word must be given as [en, ar] */
    WORDS: { 'First match': 'أول تطابق', Answer: 'الناتج', Total: 'المجموع', Sum: 'المجموع', Simplest: 'الأبسط', Fraction: 'الكسر', Parts: 'الأجزاء', Shaded: 'المظلل', Side: 'الضلع', Value: 'القيمة', Factors: 'العوامل', Factor: 'العامل', Percent: 'النسبة', Across: 'أفقيًا', Up: 'رأسيًا', Rise: 'الارتفاع', Mean: 'المتوسط', Estimate: 'التقدير', Bigger: 'الأكبر', Size: 'الحجم', Bottom: 'المقام', Top: 'البسط', Digit: 'الرقم', Original: 'الأصل', Change: 'التغير', Slope: 'الميل', Gradient: 'الميل', Area: 'المساحة', Volume: 'الحجم', Angle: 'الزاوية', Distance: 'المسافة', Speed: 'السرعة', Time: 'الزمن', Price: 'السعر', Profit: 'الربح', Share: 'النصيب', Unit: 'الوحدة', Remainder: 'الباقي', Median: 'الوسيط', Mode: 'المنوال', Range: 'المدى', Probability: 'الاحتمال', Scale: 'المقياس', Term: 'الحد', Rule: 'القاعدة', Step: 'الخطوة', Next: 'التالي', Check: 'تحقق', and: 'و', at: 'عند', At: 'عند', so: 'إذن', So: 'إذن', not: 'ليس', or: 'أو', of: 'من', Multiply: 'اضرب', Add: 'اجمع', First: 'أولًا', match: 'تطابق', Length: 'الطول', Width: 'العرض', Height: 'الارتفاع', Radius: 'نصف القطر', Circumference: 'المحيط', Perimeter: 'المحيط', Solve: 'الحل', Both: 'كلاهما', Even: 'زوجي', Odd: 'فردي', Rate: 'المعدل', New: 'الجديد', Old: 'القديم', Start: 'البداية', End: 'النهاية', Cost: 'التكلفة', Tax: 'الضريبة', Part: 'الجزء', Whole: 'الكل' }
  };
})();
