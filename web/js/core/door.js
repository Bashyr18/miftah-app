/* The door. Two heavy leaves in a real frame, and the page the child is going to is behind them, so opening the door shows where they are going.
   A key comes in straight from the viewer and turns about its own shaft, the bolt draws, the leaves swing away on their hinges, and we walk through.
   Plain CSS 3D on the supplied renders: nothing to fail on an older phone. A tap skips it. */
(function () {
  'use strict';
  var A = window.A;
  var Door = window.Door = {};
  var IMGS = ['door-left', 'door-right', 'door-frame', 'lock-hero', 'key-front'], kept = [];
  var GLOW = { gold: '255,214,150', emerald: '190,240,210', rose: '255,205,215', teal: '190,235,240', sapphire: '200,215,255', violet: '220,205,255', amber: '255,205,150' };
  Door.prepare = function () { IMGS.forEach(function (n) { if (!A.hasImg(n)) return; var im = new Image(); im.src = A.imgUrl(n); kept.push(im); if (im.decode) im.decode().catch(function () { }); }); };
  Door.ready = function () { return IMGS.every(function (n) { return A.hasImg(n); }); };

  /* the doorway, in the frame image's own pixels; everything outside it is wall */
  var HOLE = 'M138 591C138 380 330 300 512 181C694 300 887 380 887 591L887 1466L138 1466Z';
  var wall = '<svg class="dr-wall" viewBox="-3000 -3000 7024 7536" aria-hidden="true"><defs><radialGradient id="drw" gradientUnits="userSpaceOnUse" cx="512" cy="800" r="1500"><stop offset="0" stop-color="#4a3420"/><stop offset=".55" stop-color="#2a1b0e"/><stop offset="1" stop-color="#120a04"/></radialGradient></defs><path fill="url(#drw)" fill-rule="evenodd" d="M-3000 -3000H4024V4536H-3000Z' + HOLE + '"/><rect x="-3000" y="1466" width="7024" height="3070" fill="#170e06"/></svg>';

  Door.play = function (hue, full, hooks) {
    if (!Door.ready() || A.reduced()) return false;
    var d = document.createElement('div'); d.className = 'dr'; d.style.setProperty('--glow', GLOW[hue] || GLOW.gold);
    d.innerHTML = '<div class="dr-box">' + wall + '<div class="dr-pers">' +
      '<div class="dr-leaf l"><img src="' + A.imgUrl('door-left') + '" alt="" draggable="false"><i></i></div>' +
      '<div class="dr-leaf r"><img src="' + A.imgUrl('door-right') + '" alt="" draggable="false"><i></i>' +
      '</div></div><div class="dr-gap"></div><img class="dr-frame" src="' + A.imgUrl('door-frame') + '" alt="" draggable="false"></div>';
    document.body.appendChild(d);
    var Q = function (s) { return A.$(s, d); }, L = Q('.dr-leaf.l'), R = Q('.dr-leaf.r'), K = null, B = Q('.dr-box'), G = Q('.dr-gap');
    /* the leaf's shade follows the carving: masked by the leaf's own picture, so no square of shadow shows around the arch */
    [['l', 'door-left'], ['r', 'door-right']].forEach(function (x) { var i = Q('.dr-leaf.' + x[0] + ' i'), u = 'url("' + A.imgUrl(x[1]) + '")'; i.style.webkitMaskImage = u; i.style.maskImage = u; });
    var over = false, routed = false, anims = [];
    function go() { if (!routed) { routed = true; hooks.route(); } }
    function an(el, kf, o) { var a = el.animate(kf, Object.assign({ fill: 'forwards' }, o)); anims.push(a); return a; }
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function end() { if (over) return; over = true; go(); anims.forEach(function (a) { try { a.cancel(); } catch (e) { } }); if (d.parentNode) d.remove(); if (hooks.done) hooks.done(); }
    d.onclick = end; setTimeout(end, 7000);
    var snd = function (k, x) { if (hooks.sound) hooks.sound(k, x); };
    var KEY = function (z, turn) { return 'translate3d(-48%,-100%,' + z + 'px) rotateZ(' + turn + 'deg) rotateX(-56deg)'; };

    an(d, [{ opacity: 0 }, { opacity: 1 }], { duration: full ? 280 : 200, easing: 'ease-out' }).finished.then(function () {
      if (over) return;
      /* the page settles behind the closed door, where its work cannot be seen */
      go();
      var chain = wait(full ? 220 : 160);
      if (full) chain = chain.then(function () { if (over) return; snd('latch'); return wait(240); });
      if (full && K) {
        chain = chain.then(function () {
          if (over) return; an(K, [{ opacity: 0, transform: KEY(240, 0) }, { opacity: 1, offset: .3, transform: KEY(150, 0) }, { opacity: 1, transform: KEY(0, 0) }], { duration: 520, easing: 'cubic-bezier(.3,.1,.25,1)' });
          return wait(500);
        }).then(function () {
          if (over) return; snd('in'); return wait(170);
        }).then(function () {
          if (over) return; snd('turn');
          an(K, [{ opacity: 1, transform: KEY(0, 0) }, { opacity: 1, offset: .8, transform: KEY(0, 93) }, { opacity: 1, transform: KEY(0, 90) }], { duration: 430, easing: 'cubic-bezier(.45,.05,.3,1)' });
          return wait(450);
        }).then(function () { if (over) return; snd('bolt'); return wait(190); });
      }
      return chain;
    }).then(function () {
      if (over) return;
      /* heavy wood: slow to start, then it carries itself, and it slows on its hinges */
      var dur = full ? 1500 : 1150;
      snd('swing', dur / 1000);
      /* the hand takes the key back out before the door moves */
      if (K) an(K, [{ opacity: 1, transform: KEY(0, 90) }, { opacity: 0, transform: KEY(70, 90) }], { duration: 180, easing: 'ease-in' });
      var swing = { duration: dur, easing: 'cubic-bezier(.5,.02,.16,1)' };
      an(L, [{ transform: 'rotateY(0)' }, { transform: 'rotateY(84deg)' }], swing);
      an(R, [{ transform: 'rotateY(0)' }, { transform: 'rotateY(-84deg)' }], swing);
      an(Q('.dr-leaf.l i'), [{ opacity: 0 }, { opacity: .62 }], swing);
      an(Q('.dr-leaf.r i'), [{ opacity: 0 }, { opacity: .62 }], swing);
      /* a line of light at the seam first, gone once the door is open */
      an(G, [{ opacity: 0 }, { opacity: 1, offset: .22 }, { opacity: 0 }], { duration: dur * .7, easing: 'ease-in-out' });
      var walk = dur * .68;
      an(B, [{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: 'translate(-50%,-50%) scale(1.9)' }], { duration: walk, delay: dur * .36, easing: 'cubic-bezier(.5,0,.3,1)' });
      return an(d, [{ opacity: 1 }, { opacity: 1, offset: .7 }, { opacity: 0 }], { duration: walk, delay: dur * .36, easing: 'linear' }).finished;
    }).then(end, end);
    return true;
  };
})();
