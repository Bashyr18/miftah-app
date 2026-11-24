/* Miftāḥ · The Guide. The content, then the page that is built from it.
   A spread shows one screen with numbered steps, on the phone (p), the computer (d) or both. A step is
   { b: title, x: text, m: { p: mark on the phone screen, d: on the computer screen } }; marks are measured on every
   version of every screen by tools/guide-shots.js, so a marker always sits on the real feature. */
(function () {
'use strict';
var CH = [
  { id: 'start', kicker: 'Two minutes, no account', title: 'First steps', dek: 'Install it, open the first door, and tell Miftāḥ who is learning.', thumb: 'p-welcome',
    spreads: [
      { shots: { p: 'p-welcome' }, h: 'One door, one button', drop: true, p: 'The first thing anyone sees is a carved door under a night sky. Choose the language and press Begin: the door swings open onto the first question.',
        steps: [
          { b: 'The first door', x: 'The same door opens each new part of the day. Tap it, or the button below, to begin.', m: { p: 0 } },
          { b: 'English or العربية', x: 'The language of the whole app, chosen now and changed at any time in Settings. Every screen follows, right to left included.', m: { p: 1 } },
          { b: 'Begin', x: 'No sign-up and no internet. Everything that follows stays on this device.', m: { p: 2 } } ] },
      { shots: { p: 'p-who' }, flip: true, h: 'Who is learning?', p: 'A name, an age and one choice for the prayer pictures. The age sets the stage, and the stage sets everything: the size of the buttons, the length of the day, the voice of the screens.',
        steps: [
          { b: 'Their name', x: 'Only a first name. It stays on this device.', m: { p: 0 } },
          { b: 'Their age', x: 'From two to eighteen. The line beneath tells you the stage they will start in, from Little Steps to Scholars.', m: { p: 1 } },
          { b: 'Open the door', x: 'Their home appears, already planned for today. Brothers and sisters can be added from the parent area.', m: { p: 2 } } ] } ] },

  { id: 'day', kicker: 'One door at a time', title: 'A child’s day', dek: 'Each morning brings a short, balanced path, and every skill mastered is kept.', thumb: 'p-home',
    spreads: [
      { shots: { d: 'd-home', p: 'p-home' }, h: 'Today, at a glance', drop: true, p: 'Home answers one question: what now? The next step waits in its own card and the day lies in a path beside it. On the computer, the week, the āyah being memorised and every room sit there too.',
        steps: [
          { b: 'The sky, and a greeting', x: 'As-salāmu ʿalaykum, the child’s name, and today in both calendars, Gregorian and Hijri, over a courtyard that follows the real time of day.', m: { p: 0, d: 3 } },
          { b: 'What comes next', x: 'One big card and one big button. A young child never has to choose from a list.', m: { p: 2, d: 4 } },
          { b: 'Today’s path', x: 'Qurʾān first, then a balanced mix of subjects, movement breaks, and things to do away from the screen.', m: { p: 3, d: 5 } },
          { b: 'The day at a glance', x: 'Done today, days in a row and what is new this week, on the banner.', m: { d: 9 } },
          { b: 'From your sūrah', x: 'The āyah they are memorising next, whole, from the verified text, with its real recitation one click away. Nothing to score.', m: { d: 8 } },
          { b: 'Your week, every room', x: 'Real minutes of learning each day, and each subject one click away with its progress.', m: { d: 6 } },
          { b: 'Sections', x: 'On the phone, the bar along the bottom. On the computer, the side rail: the learner, their sections and the grown-up tools.', m: { p: 4, d: 0 } },
          { b: 'Search or jump', x: 'On the computer, press Ctrl K and type a child, a subject, any lesson or a tool.', m: { d: 1 } } ] },
      { shots: { d: 'd-lesson', p: 'p-lesson' }, flip: true, h: 'A lesson, start to finish', p: 'I show you, we do it together, you do it, you explain it. A lesson counts only when the child shows it on their own, so guessing never pays.',
        steps: [
          { b: 'How far through', x: 'The bar fills as the lesson goes. The cross leaves at any time, and the lesson waits where it was.', m: { p: 0 } },
          { b: 'The question, and paper to work on', x: 'On the computer the sum sits on the left with squared working paper beneath it, and the answer pad opposite: two equal halves read as one page.', m: { p: 1, d: 0 } },
          { b: 'Answer', x: 'A number pad or picture choices. On the computer, type the number, press 1 to 4 for a choice, and Enter to check.', m: { p: 2 } },
          { b: 'Look back', x: 'The worked example again, when it is needed. Honest: a question answered after looking back does not count as unaided.', m: { p: 3, d: 1 } } ] },
      { shots: { p: 'p-again' }, h: 'Done, or once more', p: 'When the path is walked, the day is done. A child who wants more can walk today again: every lesson and key from today comes back as revision, then practice in today’s subjects. A child who learns fast is noticed and given more, on their own.',
        steps: [
          { b: 'Today’s path is walked', x: 'Every stop is done. The best learning now is play, helping at home, and coming back tomorrow.', m: { p: 0 } },
          { b: 'Today, again', x: 'Another round of today: revision first, then practice. Past the day’s screen time a grown-up says yes, and the day stretches by what the round needs. Rounds are counted, and every answer is kept as revision.', m: { p: 1 } },
          { b: 'For the child who flies', x: 'Nearly everything right first time, unaided, and still remembered later: Miftāḥ adds a lesson or two a day, ends lessons with harder Stretch questions, and once a day offers a Leap: the next lessons tested, the known ones passed over. It steps back by itself if memory slips, and a parent’s gentle pace always wins.', m: { p: 2 } } ] } ] },

  { id: 'ages', kicker: 'Every age, one app', title: 'Two to eighteen', dek: 'Five stages, each with its own pace, voice and design. The app grows with the child.', thumb: 'p-age3', ages: true, spreads: [] },

  { id: 'rooms', kicker: 'Ten subjects, one memory', title: 'Rooms and memory', dek: 'Each subject is a room with its own path, and a memory that brings back what is about to fade.', thumb: 'p-rooms',
    spreads: [
      { shots: { p: 'p-rooms' }, h: 'Ten rooms', drop: true, p: 'Qurʾān, Arabic, Living Islam, maths, English, science, our world, computing, engineering and Thinking. Each opens at the child’s level and grows with them.',
        steps: [
          { b: 'The Lab', x: 'Live simulations for every subject. Each one guides a few investigations: predict first, try one precise thing, then see why it happened. Free play is always there too.', m: { p: 0 } },
          { b: 'A room', x: 'Each door shows what comes next in it and how far the child has come.', m: { p: 1 } },
          { b: 'Sections', x: 'Today, rooms and what is remembered, always one tap away.', m: { p: 2 } } ] },
      { shots: { d: 'd-room', p: 'p-room' }, flip: true, h: 'A subject’s path', p: 'A winding path of lessons, unit by unit. The glowing stop is the next one; locked stops open as the ones before them are mastered.',
        steps: [
          { b: 'The path', x: 'Tap the glowing stop to begin. Finished stops can always be opened again.', m: { p: 2, d: 0 } },
          { b: 'Units', x: 'Lessons come in small units with plain names, such as “Time, shape and data”.', m: { p: 1 } },
          { b: 'Every lesson, listed', x: 'On the computer, the whole room beside the path: what is done, what is open and what comes later.', m: { d: 1 } } ] },
      { shots: { p: 'p-keys' }, h: 'What stays', p: 'Learning a thing once is not knowing it. Miftāḥ checks again after a break, and again after weeks, and shows the difference honestly.',
        steps: [
          { b: 'Three levels', x: 'Learned and shown; still right after a break; kept for months. The real state of the child’s memory, not points.', m: { p: 0 } },
          { b: 'Lanterns', x: 'A lantern lights when a whole unit can be shown again, together.', m: { p: 1 } },
          { b: 'Everything learned', x: 'Every skill, by subject. Skills that start to fade come back into the day by themselves.', m: { p: 2 } } ] },
      { shots: { p: 'p-lab' }, h: 'The Lab', p: 'Forty-four simulations, from fractions and the pendulum to enzymes, logic gates and gradient descent. Each one leads a few short investigations: commit to a prediction, try one precise thing (the simulation itself notices when it is done), then read what happened and why, and where it shows up in real life.',
        steps: [
          { b: 'Predict, try, see why', x: 'A wrong prediction is not marked down: it is what an experiment is for. A tick appears in the Lab when every investigation is done.', m: { p: 0 } } ] },
      { shots: { p: 'p-think' }, flip: true, h: 'Thinking', p: 'Verbal, number and pattern reasoning from five to eleven, a unit a year: the odd one out, what comes next, balances, analogies, words from one root, number machines, codes and logic. Every question is made fresh, in English and in Arabic, so practice never runs out.',
        steps: [
          { b: 'One idea a question', x: 'Plain words and big pictures; a young child is never asked to read a paragraph.', m: { p: 0 } },
          { b: 'Choose, then see why', x: 'A wrong answer shows the rule. Sometimes the honest answer is “we cannot tell”, and that is taught too.', m: { p: 1 } } ] } ] },

  { id: 'teens', kicker: 'From twelve', title: 'For teenagers', dek: 'The screens grow quieter and the young person takes over the plan.', thumb: 'p-teen',
    spreads: [
      { shots: { d: 'd-teen', p: 'p-teen' }, h: 'A day they run', drop: true, p: 'Builders and Scholars see a plain list with times, a next step and the week. Exams, papers and revision live one tab away.',
        steps: [
          { b: 'Next', x: 'Start the next item in one tap.', m: { p: 1, d: 0 } },
          { b: 'The plan', x: 'Today’s items with their minutes, in an order they can change.', m: { p: 2, d: 1 } },
          { b: 'The week, the Qurʾān and every subject', x: 'On the computer: reviews due, their goal, the āyah they are memorising and each subject’s progress, beside the plan.', m: { d: 2 } },
          { b: 'Sections', x: 'Today, subjects, study and their record.', m: { p: 3 } } ] },
      { shots: { p: 'p-study' }, flip: true, h: 'Study', p: 'Cards that come back at the right time, past papers, and a place to write. What they revise is evidence a parent can see.',
        steps: [ { b: 'Revision tools', x: 'Cards, papers and writing, each kept with their record.', m: { p: 1 } } ] },
      { shots: { d: 'd-adv', p: 'p-adv' }, h: 'All the way to university', p: 'The same rooms go on through GCSE and A level into first-year university: calculus, complex numbers, matrices and differential equations in maths; mechanics, fields, waves, circuits and quantum ideas in physics, with chemistry and biology beside them. Every lesson is taught step by step, every line of its working is checked for correctness before it ships, and nothing is a video to sit through.',
        steps: [
          { b: 'Taught, not just tested', x: 'Each idea is built in steps: why it works, a worked example, then one to do together before one alone.', m: { p: 0, d: 0 } },
          { b: 'Real working', x: 'The learner works the answer out and enters it; a slip brings a hint and the worked method, and the idea comes back in review.', m: { p: 1, d: 1 } } ] } ] },

  { id: 'parents', kicker: 'Behind a door only a grown-up opens', title: 'For parents', dek: 'What each child did, what they remember, and where they are stuck.', thumb: 'd-family',
    spreads: [
      { shots: { d: 'd-family', p: 'p-family' }, h: 'The whole family', drop: true, p: 'A small sum keeps young children out, or a PIN with a private recovery code if you set one. Inside, every child on one page; on the computer, the week in minutes and the paper waiting for you.',
        steps: [
          { b: 'You, Settings and Updates', x: 'Your own profile as parent, teacher or tutor, with Settings and Updates beside it, always at the top.', m: { p: 1 } },
          { b: 'Each child', x: 'Today’s progress, minutes this week, what is mastered and remembered, and what to do next together.', m: { p: 0, d: 0 } },
          { b: 'The week, in minutes', x: 'On the computer: real learning time for every child, day by day.', m: { d: 1 } },
          { b: 'Paper waiting', x: 'On the computer: every sheet still to be marked or ticked, for every child.', m: { d: 2 } },
          { b: 'Day or night', x: 'The sun and moon switch, top right of every screen.', m: { p: 2 } } ] },
      { shots: { d: 'd-dash', p: 'p-dash' }, flip: true, h: 'One child, in depth', p: 'Today, lessons, print, Qurʾān and more, in tabs. On a wide screen the cards spread into three columns, so nothing hides below the fold.',
        steps: [
          { b: 'Tabs', x: 'Today, Lessons, Print, Qurʾān, and More: plan, rooms, record and settings for this child.', m: { p: 0, d: 0 } },
          { b: 'At a glance', x: 'Today’s stops, minutes, what is remembered and everything mastered.', m: { p: 1, d: 1 } },
          { b: 'Sheets waiting for you', x: 'Practice to mark, which is the evidence, and worksheets to tick.', m: { p: 2, d: 2 } } ] },
      { shots: { p: 'p-book' }, flip: true, h: 'Your own course, in any subject', p: 'Parent area › Courses: the Madinah books or al-ʿArabiyyah Bayna Yadayk for Arabic, or a textbook, revision guide or teacher’s notes in any other subject. Each lesson has its square, so gaps show until they are filled. Enter its terms, facts and questions from your own copy, or paste a whole course a teacher shared.',
        steps: [
          { b: 'Every lesson in its place', x: 'A filled square is a lesson ready to learn: the terms met one by one, the facts, practice both ways, the course’s own questions as a quiz, and review that comes back before it fades.', m: { p: 0 } },
          { b: 'Who follows it', x: 'Switch a child on and that subject’s path comes from this course, lesson by lesson. Courses travel between phone and computer.', m: { p: 1 } } ] } ] },

  { id: 'paper', kicker: 'Printed, or done on screen', title: 'Paper and pen', dek: 'Sheets made fresh from what the child knows today, on A4 or on the screen, and marked by a grown-up.', thumb: 'p-ink',
    spreads: [
      { shots: { d: 'd-print', p: 'p-sheet' }, h: 'Paper that fits', drop: true, p: 'Every sheet is a white A4 page to the edge, in English or Arabic. Each answer has a real box, maths has squared paper to work on, and a question never runs into the next. It is logged so practice can be marked afterwards.',
        steps: [
          { b: 'Print Studio', x: 'On the computer: choose a child, then tick several sheets at once.', m: { d: 0 } },
          { b: 'Today’s suggestions', x: 'Suggested sheets come ticked. Tick or untick any other.', m: { d: 1 } },
          { b: 'One document', x: 'Print them all, or save one PDF in Documents › Miftah › Printables.', m: { d: 2 } },
          { b: 'A true preview', x: 'Exactly the page that will print: answer boxes, squared working space, and a second page when the questions need the room.', m: { p: 1 } },
          { b: 'Print, PDF, or on screen', x: 'Print, save a PDF, or Do it on screen, then Open it now to write on it straight away. Back to Miftāḥ always returns from the print view.', m: { p: 0 } } ] },
      { shots: { d: 'd-ink', p: 'p-ink' }, flip: true, h: 'No printer? Do it on screen', p: 'Any practice or writing sheet can go to the child instead of the printer. They write on the real page with a finger, a pen or a mouse, and it saves as they go.',
        steps: [
          { b: 'The real page', x: 'The sheet that would have printed, one page at a time. On the computer it opens at page width so the writing is large; the magnifier shows the whole page.', m: { p: 0, d: 0 } },
          { b: 'Pen, colours, rubber, undo', x: 'Three pencil colours, a rubber that lifts whole strokes, and undo. A stylus writes; a resting palm is ignored.', m: { p: 1, d: 1 } },
          { b: 'Finished', x: 'Locks it and sends it to the grown-up. Until then it is theirs to change.', m: { p: 2, d: 2 } } ] },
      { shots: { d: 'd-ink-mark', p: 'p-ink-mark' }, h: 'Marking what they wrote', p: 'A finished sheet waits in your Today. Their page is there, with a red pen for your marks; then tap any question they missed and save. That is the evidence, exactly as on paper.',
        steps: [
          { b: 'Their page, your red pen', x: 'Tick, circle or write a note. Your marks stay apart from their writing, and they see them when they open it again.', m: { p: 0, d: 0 } },
          { b: 'Question by question', x: 'Each question with its answer, beside the page. Only this marking counts, never a machine.', m: { d: 1 } },
          { b: 'One colour', x: 'Red only, so your marks are never mistaken for theirs.', m: { p: 1 } } ] } ] },

  { id: 'desk', kicker: 'Not a phone app on a big screen', title: 'On the computer', dek: 'A rail, a command bar, the keyboard everywhere, and tools only a computer has.', thumb: 'd-palette', keys: true,
    spreads: [
      { shots: { d: 'd-palette' }, h: 'Go anywhere, from the keyboard', drop: true, p: 'Press Ctrl K and type: a child, a subject, any lesson by name, a tool or a setting. Arrows to move, Enter to open.',
        steps: [
          { b: 'Type a few letters', x: 'Forgiving: “tim” finds “Time to five minutes”.', m: { d: 0 } },
          { b: 'Grouped results', x: 'Children, subjects, lessons, grown-up tools, and actions such as day or night, Focus and the language.', m: { d: 1 } } ] },
      { shots: { d: 'd-lab' }, flip: true, h: 'The Lab, full size', p: 'On the computer each simulation takes the space beside its controls, drawn sharp at any size.',
        steps: [ { b: 'Change things, see what happens', x: 'Drag, slide and watch the numbers answer. Nothing here can break.', m: { d: 0 } } ] },
      { shots: { d: 'd-pc' }, h: 'This computer', p: 'Updates, start with Windows, the tray, the size of everything, your data and thirty days of backups, in one page.',
        steps: [
          { b: 'Updates', x: 'The version on this computer, and a check when you ask (or once a week). Updates are verified against a signed manifest and SHA-256 checksum before installing; your record stays. When one is ready, a small Update chip also appears in the side rail.', m: { d: 0 } },
          { b: 'Start with Windows, keep in the tray', x: 'So a paired phone can join records whenever it is home, and the daily reminder arrives.', m: { d: 1 } },
          { b: 'Size of everything', x: 'From 70% to 200%, for a small laptop or a television across the room.', m: { d: 2 } },
          { b: 'Backups', x: 'One copy each day for thirty days. Going back saves today first, so nothing is lost.', m: { d: 3 } } ] } ] },

  { id: 'together', kicker: 'One family record', title: 'Phone and computer', dek: 'Pair once with the code shown on the computer. After that the phone joins its record with the computer whenever it is home.', thumb: 'd-link', link: true,
    spreads: [
      { shots: { d: 'd-link' }, h: 'On the computer: show a code', drop: true, p: 'Open Phone and computer and turn on “Let my phone find this computer”. Windows may ask once to allow Miftāḥ on private networks: choose Allow. Then press Pair a phone.',
        steps: [
          { b: 'Let my phone find this computer', x: 'The computer becomes home base on your Wi-Fi. Nothing reaches the internet.', m: { d: 1 } },
          { b: 'One-time code', x: 'Good for ten minutes and one phone. Older screenshots show the previous six-digit code.', m: { d: 2 } },
          { b: 'What to do on the phone', x: 'The three steps, written where you need them.', m: { d: 3 } } ] },
      { shots: { p: 'p-sync' }, flip: true, h: 'On the phone: find it', p: 'In the parent area, open Devices and tap Find my computer. If the Wi-Fi keeps devices apart, type the address shown on the computer instead.',
        steps: [
          { b: 'Find my computer', x: 'The phone looks on your Wi-Fi for Miftāḥ, and lists the computers it finds.', m: { p: 0 } },
          { b: 'Or with a file', x: 'Away from home, the family file still carries everything, recordings included.', m: { p: 1 } } ] },
      { shots: { p: 'p-pair' }, h: 'Enter your pairing code', p: 'Enter the code from the computer and press Pair. Upgrade both apps and pair again if you used the old six-digit code.',
        steps: [
          { b: 'Pairing code', x: 'This creates a private key for joining records, recordings and photos on your home network.', m: { p: 0 } },
          { b: 'Pair', x: 'Nothing is overwritten. Both keep everything, and a lesson done on either counts on both.', m: { p: 1 } } ] } ] },

  { id: 'look', kicker: 'Make it yours', title: 'Day, night and Arabic', dek: 'The world follows the sun by default, and every screen is drawn for Arabic, right to left.', thumb: 'd-home', themes: true, spreads: [] }
];
var AGES = [['p-age0', 'Little Steps', '2 to 4', 'A grown-up sits beside them; mostly real play'], ['p-age1', 'Explorers', '5 to 7', 'Big buttons and spoken prompts'], ['p-age2', 'Seekers', '8 to 11', 'Reads prompts and follows a day plan'], ['p-age3', 'Builders', '12 to 14', 'Takes over the plan, in a quieter design'], ['p-age4', 'Scholars', '15 to 18', 'Exams, papers and their own record']];
var KEYS = [
  [['Ctrl', 'K'], 'Search or jump', 'A child, a subject, any lesson by name, a tool or a setting.'], [['Esc'], 'Close, or go back', 'Closes a dialog, or steps back one screen.'],
  [['0', '…', '9'], 'Type the answer', 'In a lesson, straight into the number pad. Enter checks, then moves on.'], [['1', '2', '3', '4'], 'Choose', 'In a lesson, each choice shows its key.'],
  [['Ctrl', 'P'], 'Print', 'This sheet, or Print Studio for several at once.'], [['Ctrl', '1', '…', '9'], 'Switch child', 'The first, second, third… child in the family.'],
  [['Ctrl', 'Shift', 'L'], 'Day or night', 'The whole app at once, without a flicker.'], [['F11'], 'Full screen', 'Or Focus from the rail: only a grown-up can leave it.'],
  [['Ctrl', '+', '−', '0'], 'Size of everything', 'Bigger, smaller, as it was.']
];
var MARKS = window.MARKS || {};

/* ---------- building the pages ---------- */
var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
var pad = function (i) { return (i < 9 ? '0' : '') + (i + 1); };
var words = function (t) { return t.split(' ').map(function (w, i) { return '<span class="w"><span style="--i:' + i + '">' + esc(w) + '</span></span>'; }).join(' '); };
var state = { theme: 'light', lang: 'en' };
var ICO = {
  pc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2.8" y="4" width="18.4" height="12" rx="2"/><path d="M8.5 20h7M12 16v4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M11 18h2"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19.2" r="1" fill="currentColor"/></svg>'
};
var ico = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="3.6" height="14" rx="1.2"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};
function variant(lang) { return (lang || state.lang) === 'ar' ? 'ar' : state.theme; }
function shotUrl(id, v) { return 'shots/' + (v || variant()) + '/' + id + '.webp'; }
function markOf(id, i, v) { var m = MARKS[(v || variant()) + '/' + id]; return m && m.m[i]; }
function chrome() { return '<div class="tb"><img src="shots/icon.svg" alt=""><span>Miftāḥ</span><span class="tg"></span><i><svg viewBox="0 0 10 10"><path d="M1 5h8"/></svg></i><i><svg viewBox="0 0 10 10"><rect x="1.5" y="1.5" width="7" height="7"/></svg></i><i><svg viewBox="0 0 10 10"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7"/></svg></i></div>'; }
/* a device: the phone wraps its screenshot in a slim bezel; the computer, in a real window. fixed: one version only (e.g. always Arabic) */
function device(id, alt, extra, tilt, fixed) {
  var desk = /^d-/.test(id), v = fixed || variant();
  var inner = '<div class="scr"><div class="zm"><img src="' + shotUrl(id, v) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">' + (extra || '') + '<i class="spot" aria-hidden="true"></i></div></div><button class="zoom" type="button" aria-label="Enlarge: ' + esc(alt) + '"></button>';
  var attrs = ' data-id="' + id + '" data-shot="' + v + '/' + id + '"' + (fixed ? ' data-fixed="' + fixed + '"' : '');
  return desk ? '<div class="win' + (tilt ? ' tilt' : '') + (v === 'dark' ? ' dk' : '') + '"' + attrs + '>' + chrome() + inner + '</div>' : '<div class="phone' + (tilt ? ' tilt' : '') + '"' + attrs + '>' + inner + '</div>';
}
function hotspots(s, dev) {
  var id = s.shots[dev], n = 0;
  return s.steps.map(function (st, i) {
    var mi = st.m[dev]; if (mi == null) return ''; var xy = markOf(id, mi); if (!xy) return '';
    n++; return '<button class="hs" type="button" style="left:' + xy[0] + '%;top:' + xy[1] + '%" data-i="' + i + '" data-m="' + mi + '" data-k="' + n + '" data-tip="' + esc(st.b) + '" aria-label="Step ' + n + ': ' + esc(st.b) + '">' + n + '</button>';
  }).join('');
}
function stepList(s) { return '<ol class="steps">' + s.steps.map(function (st, i) { return '<li data-i="' + i + '" tabindex="0"><span class="k">' + (i + 1) + '</span><div><b>' + esc(st.b) + '</b><p>' + esc(st.x) + '</p></div></li>'; }).join('') + '</ol>'; }
function walkBtn() { return '<button class="walk" type="button"><span class="wi">' + ico.play + '</span><span class="wl">Walk me through</span><small></small></button>'; }
function meta(c) {
  var steps = 0, wc = c.dek.split(' ').length, screens = 0;
  (c.spreads || []).forEach(function (s) { screens += Object.keys(s.shots).length; s.steps.forEach(function (st) { steps++; wc += (st.b + ' ' + st.x).split(' ').length; }); });
  if (c.ages) screens += 5; if (c.themes) screens += 3;
  var bits = []; if (screens) bits.push(screens + (screens > 1 ? ' screens' : ' screen')); if (steps) bits.push(steps + ' steps'); bits.push('about ' + Math.max(1, Math.round(wc / 180)) + ' min');
  return '<div class="meta">' + bits.map(function (b) { return '<span>' + b + '</span>'; }).join('') + '</div>';
}
function figure(s, dev, title) {
  var both = s.shots.d && s.shots.p, n = s.steps.filter(function (st) { return st.m[dev] != null; }).length;
  return device(s.shots[dev], title + ': ' + s.h, hotspots(s, dev), true) + '<div class="cap">' + (n > 1 ? walkBtn() : '<span>' + esc(s.h) + '</span>') +
    (both ? '<div class="seg vars devs" role="group" aria-label="Show this on"><i class="pill" aria-hidden="true"></i><button type="button" data-d="d" aria-pressed="' + (dev === 'd') + '">' + ICO.pc + 'Computer</button><button type="button" data-d="p" aria-pressed="' + (dev === 'p') + '">' + ICO.phone + 'Phone</button></div>' : '') + '</div>';
}

$('#toc').innerHTML = CH.map(function (c, i) {
  return '<a class="rv' + (/^d-/.test(c.thumb) ? ' wide' : '') + '" href="#ch-' + c.id + '"><span class="th"><img data-thumb="' + c.thumb + '" src="' + shotUrl(c.thumb, 'light') + '" alt="" loading="lazy" decoding="async"></span><span><span class="n">' + pad(i) + '</span><span class="t">' + esc(c.title) + '</span><span class="s">' + esc(c.kicker) + '</span></span></a>';
}).join('');

$('#chapters').innerHTML = CH.map(function (c, ci) {
  var n = pad(ci), h = '<section class="chapter" id="ch-' + c.id + '" data-n="' + n + '"><div class="wrap"><div class="opener rv"><div class="bignum" aria-hidden="true">' + n + '</div><div><div class="kicker">' + esc(c.kicker) + '</div><h2 class="h2">' + words(c.title) + '</h2><p class="dek">' + esc(c.dek) + '</p>' + meta(c) + '</div></div>';
  if (c.ages) h += '<div class="ages rv">' + AGES.map(function (a) { return '<figure>' + device(a[0], a[1] + ': their home', '', true) + '<figcaption><b>' + esc(a[1]) + '</b><span>' + esc(a[2]) + '</span><small>' + esc(a[3]) + '</small></figcaption></figure>'; }).join('') + '</div><div class="ages-line rv" aria-hidden="true">' + [0, 25, 50, 75, 100].map(function (x) { return '<i style="left:calc(' + x + '% - 6px)"></i>'; }).join('') + '</div>' +
    '<div class="gest" style="margin-top:56px"><div class="g rv"><b>One record, every age</b><p>A three-year-old and a sixteen-year-old in one family use the same app. Each child moves up a stage by birthday, and a parent can hold a stage or move one on.</p></div><div class="g rv"><b>The door belongs to childhood</b><p>The carved door opens each new part of the day for the young ones. From twelve it opens quickly, and from fifteen it steps aside unless they want it.</p></div><div class="g rv"><b>Honest at every stage</b><p>Little Steps is played beside a grown-up; Scholars sit exams with one try and no hints. Either way, only what the child shows counts.</p></div></div>';
  if (c.link) h += '<div class="link rv">' + device('d-link', 'The computer, showing its code', '', false) + '<div class="waves" aria-hidden="true"><i></i><i></i><i></i><b>' + ICO.wifi + '</b></div>' + device('p-pair', 'The phone, typing it', '', false) + '</div>' +
    '<div class="seal"><div class="g rv"><b>No account, no cloud</b><p>The two find each other on your home Wi-Fi. Nothing is sent anywhere else.</p></div><div class="g rv"><b>Sealed</b><p>Every connection derives fresh request and response keys from random challenges, sealed with AES-256 and HMAC-SHA256. A neighbour on the same Wi-Fi can neither read, fake nor replay one.</p></div><div class="g rv"><b>Nothing lost</b><p>Records are joined, never overwritten. A lesson, a recording or a marked sheet on either device counts on both.</p></div></div>';
  (c.spreads || []).forEach(function (s, si) {
    var dev = s.shots.d ? 'd' : 'p';
    h += '<div class="spread' + (s.flip ? ' flip' : '') + ' on-' + dev + '" data-c="' + ci + '" data-s="' + si + '" data-dev="' + dev + '">';
    h += '<div class="figure rv">' + figure(s, dev, c.title) + '</div>';
    h += '<div class="text rv"><h3>' + esc(s.h) + '</h3><p' + (s.drop ? ' class="lede"' : '') + '>' + esc(s.p) + '</p>' + stepList(s) + '</div></div>';
  });
  if (c.keys) h += '<div class="gest">' + KEYS.map(function (k) { return '<div class="g rv"><div class="keys">' + k[0].map(function (x) { return x === '…' ? '<span>…</span>' : '<kbd>' + esc(x) + '</kbd>'; }).join('') + '</div><b>' + esc(k[1]) + '</b><p>' + esc(k[2]) + '</p></div>'; }).join('') + '</div>';
  if (c.themes) h += '<div class="duo4"><figure class="rv">' + device('d-home', 'The computer', '', true) + '<figcaption>Follows the guide’s day and night</figcaption></figure><figure class="rv">' + device('p-home', 'The phone', '', true) + '<figcaption>Day or night</figcaption></figure><figure class="rv">' + device('p-home', 'In Arabic', '', true, 'ar') + '<figcaption>العربية</figcaption></figure></div>' +
    '<div class="gest" style="margin-top:44px"><div class="g rv"><b>Tap the sun and moon</b><p>Top right of every screen, or Ctrl Shift L on the computer. The whole app changes at once, with no flash.</p></div><div class="g rv"><b>Hold it to follow the sun</b><p>A long press hands the choice back to the time of day: light by day, night after Maghrib.</p></div><div class="g rv"><b>Arabic, drawn for it</b><p>Settings › Language, the welcome screen, or the command bar. Layout, numbers and reading direction all follow.</p></div></div>';
  return h + '</div></section>';
}).join('');

/* ---------- steps and markers light each other; a spread can switch between computer and phone ---------- */
var mobile = matchMedia('(max-width: 860px)');
var walked = {}; try { walked = JSON.parse(localStorage.getItem('miftah-guide-walked') || '{}'); } catch (e) { }
var still = matchMedia('(prefers-reduced-motion: reduce)').matches, T = null;
function spreadKey(sp) { return sp.dataset.c + '.' + sp.dataset.s + '.' + sp.dataset.dev; }
function wire(sp) {
  var dev = sp.dataset.dev, s = CH[+sp.dataset.c].spreads[+sp.dataset.s];
  var spots = $$('.hs', sp), items = $$('.steps li', sp), k = 0;
  items.forEach(function (li, i) { var on = s.steps[i].m[dev] != null && !!$('.hs[data-i="' + i + '"]', sp); li.classList.toggle('nodev', !on); if (on) $('.k', li).textContent = ++k; });
  var w = $('.walk small', sp); if (w) w.textContent = k + ' steps';
  sp._on = function (i) { spots.forEach(function (x) { x.classList.toggle('on', +x.dataset.i === i); }); items.forEach(function (li, j) { li.classList.toggle('on', j === i); }); };
  items.forEach(function (li, i) { li.onmouseenter = li.onfocus = li.onclick = function () { sp._on(i); }; });
  spots.forEach(function (x) { x.addEventListener('click', function (e) { e.stopPropagation(); var i = +x.dataset.i; sp._on(i); if (items[i] && mobile.matches) items[i].scrollIntoView({ behavior: 'smooth', block: 'center' }); if (T && T.sp === sp) { T.playing = false; tourGo(T.spots.indexOf(x)); } }); });
  var first = items.filter(function (li) { return !li.classList.contains('nodev'); })[0]; sp._on(first ? +first.dataset.i : 0);
  var wb = $('.walk', sp); if (wb) { wb.onclick = function () { if (T && T.sp === sp) stopTour(false); else startTour(sp); }; if (walked[spreadKey(sp)]) markWalked(sp); }
  $$('.devs', sp).forEach(function (g) { g.onclick = function (e) { var b = e.target.closest('button'); if (!b || b.dataset.d === sp.dataset.dev) return; setDev(sp, b.dataset.d); }; movePill(g); });
}
function setDev(sp, dev) {
  if (T && T.sp === sp) stopTour(false);
  var c = CH[+sp.dataset.c], s = c.spreads[+sp.dataset.s], fig = $('.figure', sp);
  fig.style.opacity = 0;
  setTimeout(function () {
    sp.dataset.dev = dev; sp.classList.toggle('on-d', dev === 'd'); sp.classList.toggle('on-p', dev === 'p');
    fig.innerHTML = figure(s, dev, c.title); wire(sp); refreshAll(); fig.style.opacity = 1;
  }, 230);
}
/* ---------- the walkthrough: the screen zooms to each marker in turn, a spotlight follows, and a card reads the step ---------- */
function tourable() { return $$('.spread').filter(function (sp) { return $('.walk', sp); }); }
function markWalked(sp) {
  var w = $('.walk', sp); if (!w) return; var l = $('.wl', w); w.classList.add('done'); l.dataset.was = 'Walk through again'; if (!sp.classList.contains('touring')) l.textContent = 'Walk through again';
  if (!$('.wd', w)) w.insertAdjacentHTML('beforeend', '<span class="wd" aria-label="walked through">' + ico.check + '</span>');
}
function placeCard() {
  if (!T || mobile.matches) { if (T) T.card.style.cssText = ''; return; }
  var ph = T.ph, c = T.card, w = ph.offsetWidth, h = ph.offsetHeight, wide = ph.classList.contains('win'), cw = wide ? Math.min(360, w * .44) : w * .9;
  c.style.width = Math.round(cw) + 'px';
  c.style.left = Math.round(wide ? ph.offsetLeft + (T.left ? w * .03 : w * .97 - cw) : ph.offsetLeft + w * .05) + 'px';
  c.style.top = Math.round(T.up ? ph.offsetTop + h * .07 : ph.offsetTop + h * .955 - c.offsetHeight) + 'px';
}
function stopTour(finished) {
  if (!T) return;
  var t = T; T = null; clearTimeout(t.timer);
  t.ph.classList.remove('touring'); t.fig.classList.remove('touring'); t.sp.classList.remove('touring');
  var wl = $('.walk .wl', t.sp); if (wl && wl.dataset.was) wl.textContent = wl.dataset.was;
  t.card.classList.remove('on'); setTimeout(function () { t.card.remove(); }, 400);
  if (finished) { walked[spreadKey(t.sp)] = 1; try { localStorage.setItem('miftah-guide-walked', JSON.stringify(walked)); } catch (e) { } markWalked(t.sp); }
}
function tourGo(i) {
  if (!T) return;
  var t = T, hs = t.spots[i], li = $('.steps li[data-i="' + hs.dataset.i + '"]', t.sp);
  clearTimeout(t.timer); t.i = i;
  t.ph.style.setProperty('--ox', hs.style.left); t.ph.style.setProperty('--oy', hs.style.top);
  t.sp._on(+hs.dataset.i); t.up = parseFloat(hs.style.top) > 58; t.left = parseFloat(hs.style.left) > 55;
  var b = $('b', li).textContent, p = $('p', li).textContent, ms = Math.min(9000, Math.max(3600, 2200 + p.length * 42));
  t.card.classList.toggle('up', t.up); t.card.classList.add('swap'); t.ended = false;
  setTimeout(function () {
    if (T !== t || t.ended) return;
    $('.tc-n', t.card).textContent = 'Step ' + (i + 1) + ' of ' + t.n; $('.tc-t', t.card).textContent = b; $('.tc-p', t.card).textContent = p;
    $$('.tc-bar i', t.card).forEach(function (seg, j) { seg.className = j < i ? 'f' : j === i ? 'cur' : ''; seg.style.setProperty('--d', ms + 'ms'); });
    t.card.classList.toggle('paused', !t.playing); t.card.classList.remove('swap'); placeCard();
  }, 180);
  if (t.playing) t.timer = setTimeout(function () { if (i + 1 < t.n) tourGo(i + 1); else tourEnd(); }, ms + 180);
}
function tourEnd() {
  var t = T, list = tourable(), next = list[list.indexOf(t.sp) + 1];
  clearTimeout(t.timer); t.playing = false; t.ended = true; t.card.classList.add('end', 'paused');
  $('.tc-n', t.card).textContent = 'All ' + t.n + ' steps'; $('.tc-t', t.card).textContent = 'That is this screen.';
  $('.tc-p', t.card).innerHTML = next ? 'Next: <b>' + esc($('h3', next).textContent) + '</b>' : 'You have reached the last screen in the guide.';
  $$('.tc-bar i', t.card).forEach(function (seg) { seg.className = 'f'; });
  $('.tc-go', t.card).hidden = !next; t.next = next;
  walked[spreadKey(t.sp)] = 1; try { localStorage.setItem('miftah-guide-walked', JSON.stringify(walked)); } catch (e) { } markWalked(t.sp);
  placeCard();
}
function startTour(sp) {
  stopTour();
  var fig = $('.figure', sp), ph = $('.phone, .win', fig), spots = $$('.hs', ph);
  if (!spots.length) return;
  var card = document.createElement('div');
  card.className = 'tcard'; card.setAttribute('role', 'group'); card.setAttribute('aria-label', 'Walkthrough: ' + $('h3', sp).textContent);
  card.innerHTML = '<div class="tc-top"><span class="tc-n" aria-live="polite"></span><div class="tc-ctl"><button type="button" data-a="prev" aria-label="Previous step">' + ico.prev + '</button><button type="button" data-a="play" class="pp" aria-label="Pause or play"><span class="i-pause">' + ico.pause + '</span><span class="i-play">' + ico.play + '</span></button><button type="button" data-a="next" aria-label="Next step">' + ico.next + '</button><button type="button" data-a="end" aria-label="End the walkthrough">' + ico.x + '</button></div></div>' +
    '<b class="tc-t"></b><p class="tc-p"></p><div class="tc-bar">' + spots.map(function () { return '<i></i>'; }).join('') + '</div><div class="tc-end"><button type="button" class="tc-re" data-a="replay">Replay</button><button type="button" class="tc-go" data-a="go">Next screen ' + ico.next + '</button></div>';
  fig.appendChild(card);
  T = { sp: sp, fig: fig, ph: ph, spots: spots, card: card, n: spots.length, i: 0, playing: true, up: false };
  ph.classList.add('touring'); fig.classList.add('touring'); sp.classList.add('touring');
  var wl = $('.walk .wl', sp); wl.dataset.was = wl.textContent; wl.textContent = 'Stop the walkthrough'; $('.walk', sp).classList.remove('hint');
  card.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !T) return; var a = b.dataset.a;
    if (a === 'end') stopTour(false);
    else if (a === 'prev') { T.playing = false; tourGo(Math.max(0, T.i - 1)); }
    else if (a === 'next') { T.playing = false; if (T.i + 1 < T.n) tourGo(T.i + 1); else tourEnd(); }
    else if (a === 'play') { T.playing = !T.playing; T.card.classList.toggle('paused', !T.playing); if (T.playing) tourGo(T.i); else { clearTimeout(T.timer); $$('.tc-bar i', T.card).forEach(function (s) { s.classList.remove('cur'); }); $$('.tc-bar i', T.card)[T.i].classList.add('hold'); } }
    else if (a === 'replay') { card.classList.remove('end'); T.playing = true; tourGo(0); }
    else if (a === 'go') { var nx = T.next; stopTour(true); var y = nx.getBoundingClientRect().top + scrollY - (mobile.matches ? 60 : 90); scrollTo({ top: y, behavior: still ? 'auto' : 'smooth' }); setTimeout(function () { startTour(nx); }, still ? 50 : 750); }
  });
  setTimeout(function () { card.classList.add('on'); tourGo(0); }, 20);
}
addEventListener('resize', placeCard);

/* ---------- every screen in the guide's theme and the chosen language ---------- */
function refresh(ph) {
  var id = ph.dataset.id, want = (ph.dataset.fixed || variant()) + '/' + id;
  /* the markers move to where each feature really is on this version of the screen */
  $$('.hs', ph).forEach(function (hs) { var xy = MARKS[want] && MARKS[want].m[+hs.dataset.m]; if (xy) { hs.style.left = xy[0] + '%'; hs.style.top = xy[1] + '%'; } });
  if (ph.classList.contains('win')) ph.classList.toggle('dk', /^dark\//.test(want));
  if (want === ph.dataset.shot) return;
  ph.dataset.shot = want;
  var cur = $('.scr img', ph), nx = new Image(); nx.className = 'next'; nx.alt = cur.alt; nx.decoding = 'async'; nx.src = 'shots/' + want + '.webp';
  var go = function () { cur.parentNode.insertBefore(nx, cur.nextSibling); requestAnimationFrame(function () { requestAnimationFrame(function () { nx.classList.remove('next'); cur.style.opacity = 0; }); }); setTimeout(function () { cur.remove(); }, 650); };
  if (nx.complete) go(); else nx.onload = go;
}
function movePill(g) { var b = $('button[aria-pressed="true"]', g), p = $('.pill', g); if (b && p && b.offsetWidth) { p.style.left = b.offsetLeft + 'px'; p.style.width = b.offsetWidth + 'px'; } }
function press(g, val) { $$('button', g).forEach(function (x) { x.setAttribute('aria-pressed', String((x.dataset.l || x.dataset.d) === val)); }); movePill(g); }
function refreshAll() { $$('.phone[data-id], .win[data-id]').forEach(refresh); $$('img[data-thumb]').forEach(function (im) { im.src = shotUrl(im.dataset.thumb); }); }
function setLang(l) { state.lang = l; press($('#lang'), l); try { localStorage.setItem('miftah-guide-lang', l); } catch (e) { } refreshAll(); }
$('#lang').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && b.dataset.l !== state.lang) setLang(b.dataset.l); });
var root = document.documentElement;
function setTheme(t) {
  state.theme = t; root.dataset.theme = t; $('#theme').setAttribute('aria-label', t === 'dark' ? 'Switch to light' : 'Switch to dark');
  $('meta[name="theme-color"]').content = t === 'dark' ? '#07080d' : '#f5f1e9';
  try { localStorage.setItem('miftah-guide-theme', t); } catch (e) { }
  refreshAll();
}

$$('.spread').forEach(wire);
var savedT = null, savedL = null; try { savedT = localStorage.getItem('miftah-guide-theme'); savedL = localStorage.getItem('miftah-guide-lang'); } catch (e) { }
setTheme(savedT || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
setLang(savedL === 'ar' ? 'ar' : 'en');
$('#theme').addEventListener('click', function () {
  var next = state.theme === 'dark' ? 'light' : 'dark';
  if (document.startViewTransition && !still) document.startViewTransition(function () { setTheme(next); }); else setTheme(next);
});
addEventListener('resize', function () { $$('.seg').forEach(movePill); });
if (document.fonts) document.fonts.ready.then(function () { $$('.seg').forEach(movePill); });
if ('IntersectionObserver' in window) {
  var tourIO = new IntersectionObserver(function (es) {
    es.forEach(function (x) {
      if (!x.isIntersecting && T && T.sp === x.target) stopTour(false);
      if (x.isIntersecting && !x.target._hinted) { x.target._hinted = 1; var w = $('.walk', x.target); if (w && !w.classList.contains('done')) w.classList.add('hint'); }
    });
  }, { threshold: 0.12 });
  $$('.spread').forEach(function (sp) { tourIO.observe(sp); });
  var stepIO = new IntersectionObserver(function (es) {
    if (!mobile.matches) return;
    es.forEach(function (x) { if (x.isIntersecting) { var li = x.target, sp = li.closest('.spread'); if (sp && sp._on && !(T && T.sp === sp)) sp._on(+li.dataset.i); } });
  }, { rootMargin: '-55% 0px -40% 0px' });
  $$('.steps li').forEach(function (li) { stepIO.observe(li); });
}
$('#tourAll').addEventListener('click', function (e) {
  e.preventDefault(); var sp = tourable()[0], y = sp.getBoundingClientRect().top + scrollY - (mobile.matches ? 60 : 90);
  scrollTo({ top: y, behavior: still ? 'auto' : 'smooth' }); setTimeout(function () { startTour(sp); }, still ? 50 : 900);
});

/* ---------- the cover's rosette: concentric exact 8-point stars ---------- */
(function () {
  var out = '', r2 = Math.SQRT2;
  function star(h, rot) { var D = h * r2, k = D - h, p = [[D, 0], [h, k], [h, h], [k, h], [0, D], [-k, h], [-h, h], [-h, k], [-D, 0], [-h, -k], [-h, -h], [-k, -h], [0, -D], [k, -h], [h, -h], [h, -k]]; return '<path transform="rotate(' + rot + ')" d="M' + p.map(function (q) { return q[0].toFixed(2) + ' ' + q[1].toFixed(2); }).join('L') + 'Z"/>'; }
  [66, 58, 46, 40, 28, 23, 12].forEach(function (h, i) { out += star(h, i % 2 ? 22.5 : 0); });
  for (var i = 0; i < 16; i++) out += '<line x1="0" y1="0" x2="' + (94 * Math.cos(i * Math.PI / 8)).toFixed(2) + '" y2="' + (94 * Math.sin(i * Math.PI / 8)).toFixed(2) + '" opacity=".35"/>';
  $('#orn').innerHTML = '<g fill="none" stroke="currentColor" stroke-width=".35"><circle r="97"/><circle r="94" stroke-dasharray="1 2.2"/>' + out + '</g>';
})();

/* ---------- the lightbox: every screen of the guide, one after another ---------- */
var lb = $('#lb'), lbList = [], lbAt = 0;
function lbShow(i, dir) {
  lbAt = (i + lbList.length) % lbList.length; var ph = lbList[lbAt], id = ph.dataset.id, desk = /^d-/.test(id), src = 'shots/' + ph.dataset.shot + '.webp';
  $('#lbph').hidden = desk; $('#lbw').hidden = !desk; $('#lbw').classList.toggle('dk', /^dark\//.test(ph.dataset.shot));
  (desk ? $('#lbwimg') : $('#lbimg')).src = src;
  var box = desk ? $('#lbw') : $('#lbph'); box.classList.remove('go-l', 'go-r'); if (dir) { void box.offsetWidth; box.classList.add(dir > 0 ? 'go-l' : 'go-r'); }
  $('#lbc').textContent = (lbAt + 1) + ' / ' + lbList.length; $('#lbt').textContent = $('img', ph).alt;
}
function lbStep(d) { lbShow(lbAt + d, d); }
function closeLb() { lb.classList.remove('on'); }
document.addEventListener('click', function (e) {
  var z = e.target.closest('.zoom'); if (!z) return; lbList = $$('#chapters .phone[data-id], #chapters .win[data-id]'); var ph = z.closest('.phone, .win'); lbShow(Math.max(0, lbList.indexOf(ph))); lb.classList.add('on');
});
$('#lbx').onclick = closeLb; $('#lbp').onclick = function () { lbStep(-1); }; $('#lbn').onclick = function () { lbStep(1); };
lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', function (e) {
  if (lb.classList.contains('on')) { if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') lbStep(1); else if (e.key === 'ArrowLeft') lbStep(-1); return; }
  if (!T) return;
  if (e.key === 'Escape') stopTour(false);
  else if (e.key === 'ArrowRight') { T.playing = false; if (T.i + 1 < T.n) tourGo(T.i + 1); else tourEnd(); }
  else if (e.key === 'ArrowLeft') { T.playing = false; tourGo(Math.max(0, T.i - 1)); }
});

/* ---------- the bar, the chapter rail, the dock, reveals, and the gold leaf that follows the pointer ---------- */
var bar = $('#bar'), prog = $('#prog'), chap = $('#chap'), crail = $('#crail'), dock = $('#dock'), chs = $$('.chapter');
crail.innerHTML = chs.map(function (c, i) { return '<a href="#' + c.id + '"><span><b>' + pad(i) + '</b>' + esc(CH[i].title) + '</span><i></i></a>'; }).join('');
var rails = $$('a', crail), curCh = -2;
function onScroll() {
  var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  bar.classList.toggle('on', y > 40); prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
  var cur = -1; chs.forEach(function (c, i) { if (c.getBoundingClientRect().top < innerHeight * .4) cur = i; });
  if (cur !== curCh) { curCh = cur; $('b', chap).textContent = cur >= 0 ? chs[cur].dataset.n : ''; $('span', chap).textContent = cur >= 0 ? CH[cur].title : ''; rails.forEach(function (a, i) { a.classList.toggle('on', i === cur); a.classList.toggle('past', i < cur); }); }
  crail.classList.toggle('on', cur >= 0 && y < h - 300); dock.classList.toggle('on', y > innerHeight * .8);
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
$('#dprev').onclick = function (e) { e.preventDefault(); var t = chs[Math.max(0, curCh - 1)]; if (t) t.scrollIntoView({ behavior: still ? 'auto' : 'smooth' }); };
$('#dnext').onclick = function (e) { e.preventDefault(); var t = chs[Math.min(chs.length - 1, curCh + 1)]; if (t) t.scrollIntoView({ behavior: still ? 'auto' : 'smooth' }); };
var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach(function (el) { io.observe(el); });
var leaf = $('#leaf');
addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; leaf.style.setProperty('--px', e.clientX + 'px'); leaf.style.setProperty('--py', e.clientY + 'px'); leaf.classList.add('on'); }, { passive: true });
document.addEventListener('mouseleave', function () { leaf.classList.remove('on'); });
$$('.toc a, .g').forEach(function (a) { a.addEventListener('pointermove', function (e) { var r = a.getBoundingClientRect(); a.style.setProperty('--mx', (e.clientX - r.left) + 'px'); a.style.setProperty('--my', (e.clientY - r.top) + 'px'); }); });
/* the cover's devices lean toward the pointer */
var stage = $('#stage');
if (stage && !still) {
  stage.addEventListener('pointermove', function (e) { var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; $('.p1', stage).style.transform = 'rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 10) + 'deg)'; });
  stage.addEventListener('pointerleave', function () { $('.p1', stage).style.transform = ''; });
}
})();
