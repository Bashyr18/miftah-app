# Changelog

The version is set in `version.txt`.

## 2.3 (code 6), November 2026

### Courses in any subject
- Parent area › Courses (it was Arabic books): besides the Madinah books and al-ʿArabiyyah Bayna Yadayk, a course in maths, science, English, Our World, Living Islam, computing, engineering or Thinking, from a textbook, a revision guide or a teacher’s notes. Each has a level, a grid of lessons and the children who follow it; that subject’s path then comes from it.
- A lesson takes terms (`term = meaning`), facts (`! …`), sentences from the book (`> …`) and now questions: `? question = right | wrong | wrong`. With no wrong answers given, Miftāḥ draws them from the same lesson, like for like: other terms for a term, nearby numbers for a number.
- Every practice and review step is a quiz from the course itself, and its lessons come back for review like any other key. Courses and who follows them travel between phone and computer.

### Learn pages that teach
- A Learn page sets each formula on a line of its own, pulled out of the sentence it was in, with the rest as points.
- Under 37 of the formulas the lessons use (v = u + at, pV = nRT, F = GMm/r², d sin θ = nλ, y = mx + c and more), a key says what every letter stands for and its unit, in English and Arabic. Formulas that belong together share one key.
- Where the Lab has the same idea moving, the page offers See it move.

### The Lab, guided
- All 44 simulations now lead 104 short investigations: the idea in plain words; a prediction to commit to; one precise thing to try, which the simulation checks for itself; what happened and why; and where it shows up in real life. Free play stays.
- The Lab lists each simulation with its idea, its investigations and a tick once they are done.
- On a phone the simulation comes first and the guide under it; formulas and units read the right way round in Arabic.

### Grown-ups
- A profile for the parent, teacher or tutor (with a class or school for a teacher): it greets you on the family page and signs certificates. A teacher’s family page is called Class.
- Settings and Updates sit beside your profile at the top of the family page, on every device; Updates has a page of its own.
- When a new version is ready, a small Update chip appears under the date on Home and a band at the top of the family page; both open what is new, with one Update button. It stays until the new version is installed.
- The Updates card no longer flashes when it checks; Settings switches, subject switches and course switches change in place instead of redrawing the page.

### Windows
- The installer is set in the app’s own fonts: Quicksand, Plex Arabic, and Amiri for the name.

## 2.2 (code 5), November 2026

**Thinking: a new subject for ages 5 to 11**
- Verbal, quantitative and pattern reasoning, one unit a year: look and think (odd one out, what comes next, what goes together, opposites, which has more), find the rule (number patterns, balancing, if-then logic where "we cannot tell" is sometimes the answer), words that think (odd word out, analogies, words that mean the same; compound words in English, word families from one root in Arabic), numbers that think (sequences, number machines, shapes for numbers), codes and logic (letter patterns, secret codes, ordering clues, two-step problems).
- Every question is generated, in English and Arabic, so practice never runs out.

**Children who learn fast**
- Miftāḥ notices a child getting nearly everything right first time, without help, and keeping it: one or two more new lessons a day, a higher weekly ceiling, and Stretch questions at the end of a lesson, harder and without help, one of them from the next lesson.
- Once a day such a child gets a Leap ahead: the next lessons in a subject, tested. The ones they already know are passed over and come back for review like any other key; teaching starts at the first one they miss.
- It steps back by itself if memory slips, and a parent's gentle pace always wins. The plan says why.

**Deeper teaching**
- Lessons not yet written in full (maths to Year 4, English, science, Our World, computing, engineering, Thinking) now show one question solved before the child tries, and give one answer to check: someone answered; are they right?

**Follow an Arabic book**
- Parent area › Arabic books: the Madinah books 1 to 3, al-ʿArabiyyah Bayna Yadayk, or any other course. Every lesson has its place in a grid, so gaps show until they are filled.
- Enter a lesson's words, rules and sentences from your own copy, or paste a whole book a teacher shared. Each becomes a full lesson: the words, the rule, practice both ways, the book's sentences with a word missing, and review.
- A child can follow the book as their Arabic path. Books travel between phone and computer.

**Today, again**
- When today's path is done, Today, again starts another round: every lesson and key from today as revision, then practice in today's subjects. Past the day's screen time, a grown-up says yes and the day is extended by what the round needs.
- Rounds are counted: the child sees Round 2, the parent sees it on Today, and every answer is logged as revision.

**The first years**
- Helpers in a lesson are round picture buttons for children who do not read yet; answers are bigger tiles with more room; a wrong answer fades instead of shaking.
- The door opens in silence: its made-up sound never sounded like real wood and metal.

**Arabic on screen**
- Vowel marks are drawn by the font with their letters again; an attempt to colour them had moved some marks off their letters (a sukūn over the wrong letter).
- Arabic inside English text is set in the Arabic font everywhere (35 vowelled words were falling back to another font), and a short run such as a list of letters is never split across lines.

**Polish**
- Every sheet has a title that stays, a close button, and a body that scrolls with proper margins (Credits and licences ran off the bottom and could not be closed).
- Grown-up tabs show their full names on a phone; folded cards are only as tall as their title; printable actions sit on one line each; older learners no longer see a subject with nothing at their age.
- Credits are one row on How Miftāḥ teaches, opening a sheet with names, licences and links, instead of raw web addresses and licence lists.
- Row text no longer spills over the next row on grown-up pages, and the More tab is never cut off.
- Sheet codes show only when two sheets share a title; empty subjects and placeholder dashes are gone; Knows these is a quiet pill; an empty Media page has one add button.
- On the computer: no network address or folder path on show; Show the folder instead.
- Fixed: some settings were lost at every start (the weekly update check, group challenges, card names).

### Windows, rebuilt in Rust
- Miftah.exe and Miftah-Setup.exe are now Rust programs (windows/), replacing the C# ones. The lessons, the family's record, its folder and its file formats are unchanged, so an update finds everything where it was; phone pairing speaks the same protocol, so paired phones keep working.
- One file each, with nothing unpacked beside it but the lessons; no .NET.
- The installer keeps its look, now drawn as a page: the night sky, three steps, the two choices, light and dark, English and Arabic. Enter installs straight away.
- An in-app update moves the running program aside and puts the new one in its place, with no helper script.

## 2.1.1 (code 4), November 2026

**A real installer for Windows**
- `Miftah-Setup.exe` installs Miftāḥ like any Windows program: its own folder (`AppData\Local\Programs\Miftah`), the Start menu, a desktop shortcut if wanted, starting with Windows if wanted, and an entry in Settings › Apps that removes it. No administrator needed.
- The Setup window is Miftāḥ's own: day or night with Windows, and in Arabic on an Arabic Windows.
- Running Setup again updates or repairs the installed copy, closing it first if it is open. The family's record lives in its own folder and is never touched.

**Tablets and foldables**
- On a tablet, everything is shown a size larger, touch targets included, and the learner's sections move to a rail at the side.
- Grown-up pages lay their cards in two columns. My keys puts the lanterns beside the keys. The older learners' home puts today's plan beside their tools, and long lists spread into two columns.
- A tablet or a foldable on its side shows the question beside the work in a lesson.
- A foldable half open like a book never puts anything on the hinge: the question on one side, the work on the other. Half open like a laptop, the question stands on the upper half and the work lies on the lower one.
- Turning, folding and unfolding keep a lesson where it was; the writing board resizes itself.

**Writing letters**
- The tracing board is drawn as a pen-wide lane on a writing line, so a letter stays readable: the teeth of sīn no longer merge into one shape.
- Each stroke has a numbered start and arrows for its direction, and the child's own finger leaves chalk.
- Fast strokes are followed point by point. A button starts the letter again. The board fills the room it has.
- Dots are drawn as a reed pen leaves them, a small diamond, on the board and on printed sheets. A letter's dots can be placed in any order, each with a finger-wide target.
- In Arabic lessons the vowel marks (fatḥah, kasrah, ḍammah, sukūn, shaddah, tanwīn) are shown in their own colour, so the mark stands apart from its letter. A mark on its own sits large on a dotted circle, with its name under it. The Qurʾān's text is never recoloured.
- Jīm, ḥāʾ, khāʾ, sīn, shīn, ṣād, ḍād, ʿayn and ghayn were traced again by hand over the letterform: they had broken into slivers a child could not follow. Letters written in one movement (fāʾ, qāf, mīm, wāw) are one stroke.

**Sound**
- Recitations of sūrahs 2 to 77 played nothing: the file name was read as one number. They play again, on the phone and the computer.
- 670 more real recordings of words are included, among them Arabic letters. A letter's name plays its recording where there is one; where there is none yet, the lesson asks a grown-up to say it instead of promising a sound.

**Lessons**
- Every step of every lesson (11,024 of them) was drawn and checked on a phone and a tablet.
- A number line to 20 on a phone shows ten numbers around the question, each big enough to touch.
- A question a grown-up reads aloud no longer puts its grown-up button beside the answers as a tall empty panel: it is a small button under them.
- Arrays can be dragged out with one finger. Thin letters (l, i) have a full-size button.

**The installer**
- A new Setup window: the night sky with the key on one side, the choices as clear rows with icons on the other, three steps along the top, and Close or Open Miftāḥ at the end.
- This computer no longer offers to install: Setup does that, as with any Windows program.

**Fixed**
- The Install button on This computer failed: Windows' old shortcut tool cannot save a name with ā or ḥ, so the program was copied but no Start menu entry was made. Shortcuts are now made through the Unicode interface, and after installing, the copy that was opened from Downloads hands over to the installed one.

## 2.1 (code 3), November 2026

**Updates inside the app**
- Parent area › Settings on the phone, This computer on Windows: **Check for updates**, and an optional weekly check, off by default.
- A new version downloads, its SHA-256 is checked against the release's `version.json`, and then it installs: through Android's own installer (which also insists on the same signing key), or on Windows by swapping the program file once Miftāḥ closes and opening it again. The family's record is never touched.
- A quiet "Version … is ready" pill on the grown-up screens when something is waiting.

**The guide and the README**
- Every screenshot captured again from the current apps, in day, night and Arabic.
- A new install section: why Android and Windows ask first, and every step on real screens.
- A 45-second demo film (`promo/`), made in code from the app's real screens.

**On the computer**
- The rail's name and Arabic name have room to breathe.

**Fixes after release**
- The Updates card keeps its folded settings section open while it redraws.
- On Windows, download progress is passed on only as it rises, at most every 150 ms, so the restart no longer waits behind a queue of updates.

## 2.0 (code 2), November 2026

**Dates (update, 13 November)**
- Both calendars: the Gregorian date beside the Islamic (Umm al-Qurā) date, with its year, on a child's home, a teen's home and the parent's day, on the phone and the computer. A narrow screen puts them on separate lines.

**Sheets and paper (update, 13 November)**
- Printed and saved sheets are white to the edge of the A4. The cream border around PDFs from the computer is gone, and ruled lines and grids now print even when the print window's background setting is off.
- Room to write: each answer is a real box instead of a thin line, every maths question has squared working space, written answers get 9 mm lines, and sheets with many questions use two columns so no question is squeezed.
- Powers show as powers (x⁵, not x^5) in lessons, on sheets and in marking.
- On the computer, printing and saving a PDF no longer make the window flash away. The main button says Print, and Do it on screen offers Open it now, here.
- A sheet done on a computer screen opens at page width, so the writing is large, with a button for the whole page.
- Each question gets the room it needs: questions are measured on the page, long ones and diagrams never run into the next question, and a sheet that needs more room goes on to a second page with the questions shared evenly.
- The print view always has a way out: a Back to Miftāḥ button (not printed), the phone's Back button, Esc, and returning to the app.

**Miftāḥ for Windows**
- A native Windows 10 and 11 app (`dist/Miftah.exe`): one file, no installer needed, and it can add itself to Start, the desktop and Settings › Apps without an administrator.
- Its own design for a big screen: a side rail, a command bar (Ctrl K) that finds any child, subject, lesson or tool, the keyboard everywhere, dialogs in the middle of the screen, and pages that use the whole window.
- Lessons put the sum and squared working paper on the left and the answer on the right; the Lab draws each simulation as large as the window allows beside its controls.
- Print Studio prints several sheets at once or saves them as one PDF; any sheet can be saved straight to a PDF.
- This computer: start with Windows, keep in the tray, a daily reminder, the size of everything, the data folder, and thirty days of backups to go back to.
- Focus: a lesson fills the screen and only a grown-up can leave it. Files dropped on the window join the record or go to Media.

**Phone and computer**
- Pair a phone with the computer on the home Wi-Fi using six digits; after that they join records by themselves whenever the phone opens Miftāḥ at home, recordings and photos included. Sealed end to end, no account, no internet.

**Sheets on screen**
- Any practice or writing sheet can be done on the screen instead of on paper: the child writes on the real page with a finger, a pen or a mouse; the parent sees it, marks it in red and question by question, and only that marking counts.

**The user guide**
- `docs/guide`: every screen on both devices, by day, by night and in Arabic, with a walkthrough for each.

**Also**
- The welcome screen shows the carved door and one Begin button, instead of a key to turn.
- The door no longer shows a square of shadow before it opens, and its sound is a soft latch and air rather than synthetic creaking.
- My keys shows three plain numbers with what each means.
- The mosque picture no longer has a fringe of old sky around the dome and minarets.

**Teaching**
- Maths for Years 5–10 (183 lessons) and science for Years 7–10 (89 lessons) taught in full, each as two sessions: why it matters, the idea with a diagram, a worked example, one done together, questions that get harder, a mistake to find, an explanation to choose.
- Wrong answers name the specific mistake; after three tries the child sees the whole working and the answer.
- A checker computes every worked line and balances every chemical equation on every build.

**Interface**
- Arabic equations no longer read backwards.
- Diagrams no longer give away the answer.
- The teen home opens with a clear Start card.
- The lantern wall became one row per subject.
- The rest screen is readable on any sky.
- Night mode changes the home picture.
- A new door animation.
- Many smaller fixes; see `docs/AUDIT.md`.

- A day and night switch in the top corner of the homes; a long press hands it back to the sun.
- No more flashes: screens and the theme cross-fade in one step, a redraw keeps its place, and the app opens in the theme last chosen.

**Printables**
- Every sheet fills a true A4 page: a header with name, date and a score box, a footer with the sheet's code and page number.
- Long sheets split into even pages with their heading repeated; short sets finish the page with spare cards or practice rows.
- Every printed sheet is kept: practice waits to be marked, worksheets wait to be ticked done, and any sheet can be printed again exactly.
- Printed sheets merge between devices.

**Families**
- Homeschool groups: a weekly card and challenge packs shared through WhatsApp or Telegram, with no server.
- Send to my other device: one file through Quick Share, Bluetooth or WhatsApp, merged on the other phone.

**Project**
- Open-source layout:
  - MIT licence, `CONTENT.md`, `CONTRIBUTING.md`, `.gitignore`;
  - planning documents in `docs/`;
  - a pinned `package.json`.
- The signing key moved out of the repository, and the build reads it from `~/.keys/miftah` or the environment.
- The build runs on Windows, macOS and Linux; the version comes from `version.txt`.

## 1.0 (code 1), 5 November 2026

- First version.
