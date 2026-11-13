# Miftāḥ: adversarial audit

## Will this homeschool a child?

**Not on its own yet. It can be the daily spine of a homeschool today, as long as books, a parent and real practice carry the rest.**

| Age | Verdict | Why |
|---|---|---|
| 2 to 7 | Works with a parent beside the child | Short, warm and well sequenced, and it asks the parent to be the voice where recordings are missing. Reading still needs more real recorded sounds. |
| 8 to 11 | Good for maths, Arabic and Qur'ān. Light elsewhere | Daily order, review and honest checks now work. Science and humanities are overviews. |
| 12 to 14 | Good guide, thin teacher | Lessons name the idea and test it, but they do not yet teach enough for a child to learn it alone. Needs textbooks. |
| 15 to 18 | Study planner, not a course | It organises Cambridge study. Textbooks, past papers and a marker do the real work. |

**Update, maths Years 5 to 10:** every one of the 183 lessons in these years is now taught in full. Each topic is two sessions: why it matters, the idea with a diagram, a worked example that unfolds, one done together where the child fills each line, five to six questions that rise in difficulty, a mistake to find, and an explanation to choose. A wrong answer now gets a sentence about that specific mistake, and after three tries the child sees the whole working for that exact question. Answers can be decimals, negatives and fractions. That is about 370 sessions of roughly 12 minutes: around 12 hours of taught maths a year, plus daily mixed practice, so roughly 35 to 40 hours a year. A full Cambridge course is 120 to 150, so books and written work are still needed alongside. Every worked line is checked by calculation on every build.

**Update, science Years 7 to 10:** 89 of the 93 science lessons in these years are now taught the same way, as two sessions each. Calculations (speed, pressure, moles, Ohm's law, half-life, momentum and the rest) are typed with full working. Ideas that are explained rather than calculated (cells, bonding, tests for gases, reflexes) are taught as a chain of reasoning where the child chooses each missing word, and every wrong word can carry its own correction. New diagrams draw forces, atoms, particles, levers, waves, light rays, circuits, Punnett squares, energy pyramids, cells and the pH scale. Every chemical equation is checked atom by atom and charge by charge on every build. The four lessons left as they were: natural selection and human reproduction, which are meant for a parent beside the child; az-Zahrāwī, which is history with nothing to calculate; and al-Bīrūnī's measurement of the Earth, which would need his exact figure, not yet confirmed from a source. That adds about 35 hours of taught science across the four years: about 3 in Year 7, 11 in Year 8, 13 in Year 9 and 9 in Year 10. A full Cambridge science course is far more, and practicals still need a real table, real equipment and a parent.

**The biggest gap is depth.** Measured across the whole app before this update:

- A typical lesson runs 1 to 2 minutes, with about 1.2 teaching pages of 10 to 23 words.
- All years together come to about 40 hours of teaching. Real schooling needs hundreds of hours in each year.
- The other gaps were fixable and most are fixed. This one needs more teaching content, and it is the first thing to build next.

## What was wrong and is now fixed

### The app was not telling the truth about learning

| Finding | Evidence | Now |
|---|---|---|
| Exams could be passed by guessing again | Answering every question wrong first, then right, scored 20/20 and earned a certificate | 0% and no certificate. Exams give one attempt and no coaching |
| Random tapping earned mastery | 17 of 24 multiple-choice lessons mastered by tapping | 3 to 5 of 24 across runs. Pass mark raised to 75% from age 8 |
| Top memory level was out of reach for most lessons | `proven` needed conditions most lessons could never meet | Reachable after two delayed checks, or one with real production work |
| Too few solo questions | Some lessons could be mastered on one or two | At least three different questions from age 8, topped up from review |

`tools/e2e-honesty.js` now plays the cheating student by tapping real buttons, so these cannot quietly return.

### The school year did not work

| Finding | Evidence | Now |
|---|---|---|
| Teens ran out of lessons | A simulated 13-year-old had 239 of 365 days with nothing new | Later years open when a year is finished; daily limits raised to 55, 90 and 140 minutes |
| No day of rest | Seven-day school week by default | Six days by default, plus a one-tap Day off |
| Days were lessons only | No practice or reading stops | Mixed maths practice and real-book reading added to each day from age 8 |
| Saved data could be lost | About 1 MB per child per year against a 4 MB browser limit, and an older copy could win on load | The newer of the two saved copies always loads, and the native file takes over when space runs out |

### Learning aids

- **Teaching pages rebuilt.** They used to be one line of text above an empty screen. Now the idea comes first, equations stand on their own plate, and the lesson's name, picture and page count are all shown.
- **Worked examples** unfold one line at a time.
- **Look back, Working and Calculator** are in every practice question from age 8. Look back is hidden in exams and counts as a hint.
- **A wrong answer now teaches.** After a miss, the child sees the relevant line from the lesson instead of a generic message.
- **Answers sit under the question** for older students, not adrift mid-screen.
- **Silent phonics fixed.** Of 204 "hear" prompts in the early years, 112 had no audio. The screen now asks a grown-up to say the sound.

### UI pass, November 2026

- **Arabic equations read backwards.** With Arabic digits, every working line and question showed in reverse, so 16 ÷ 16 = 1 read as 1 = 16 ÷ 16. Fixed in one place, for every maths and science screen.
- **Diagrams that gave the answer away.** A force arrow labelled with the force being asked for, a Venn diagram showing the overlap being asked for, and a weight equal to the drag being asked for. All three fixed; every diagram was checked by script.
- **Teen home had no first step.** It now opens with a clear Start card for the next item, and every row shows its time.
- **Second pass, inside lessons.** For a question with choices, the Watch step now shows the choices first and asks the child to think. It then reveals the reasoning and ticks the right one, instead of printing the answer at once. After three misses, the answer box shows the answer, not a "?". The teen end screen shows the key, the score and what comes next. Arabic diagram labels no longer overlap or flip.
- **Third pass, across the rest of the app.** Every activity type for a 6-year-old was screenshotted and measured. A broken prompt ("Which letter do") now reads "Which letter is it?", and the smallest labels are raised for the youngest. The rest screen was unreadable on a daytime sky and now sits on a glass panel. The keys page swaps a wall of 121 grey lanterns for one progress row per subject. A stray divider in settings is gone.
- **Smaller fixes.** The sparkles no longer show through the profile cards. The verse is larger on the memorising screen. Cells are drawn with real shapes and colours. The parent page no longer shows "+0".

### Parents

- **New family page:** the date, what to have ready, each child's next step, and one tap into it.
- **Plain words:** teaching jargon replaced, and tabs no longer clip.
- **Backup nudge** waits 30 days, where it used to nag on day one.
- **Parent gate:** two-digit sums, plus a nudge to set a PIN. A one-digit sum does not stop a 9-year-old.

### Homeschool groups

Parents can share with a WhatsApp or Telegram group they already belong to, from **Family › Group**. There's no server, no account, and nothing leaves the phone except what a parent sees and sends.

- **Weekly card:** a picture of one child's week (lessons mastered, time, the topics). The child's name is off unless the parent turns it on.
- **Challenge pack:** a tiny file naming a subject, a year and a seed. Every family's copy of Miftāḥ builds the same ten questions from it: no hints, one try each. The child's result can be shared back as a card.
- Tested on the emulator: sending, opening the pack, taking it, and sharing the card as an image. Not yet tried in a real WhatsApp group.

### Sharing between devices

One button: **Send to my other device**. Android's own sheet offers Quick Share, Bluetooth or WhatsApp, and opening the file on the other device merges it into Miftāḥ. No account, no server and no internet needed.

### Build quality

- JavaScript moved into `core`, `lesson`, `instruments`, `curriculum`, `views` and `data`.
- One large stylesheet split into six numbered files.
- Dead screens and wrappers removed.
- `ARCHITECTURE.md` explains where things live and how to add a lesson.
- `tools/check.sh` runs every check in one step.
- 7,020 unit checks, 503 smoke checks and 401 Arabic strings, all passing at the last run.

## What is still wrong

In order of how much each matters to a real family.

1. **Depth.** Maths in Years 5 to 10 and science in Years 7 to 10 are now taught in full. The other subjects, science before Year 7, and both after Year 10 still have the old short lessons. Year 7 science has only nine lessons in all, so it is the thinnest year.
2. **Wrong answers rarely get specific feedback.** Fixed for maths in Years 5 to 10 and science in Years 7 to 10, where common wrong answers name the mistake. Still generic elsewhere.
3. **Too much tapping, too little producing.** Only 3 to 22% of lessons, depending on the year, ask the child to produce anything. The number pad takes whole numbers only in most lessons, so decimal and fraction answers are limited.
4. **Geometry has few diagrams.** Fixed for Years 5 to 10: triangles, angles, circles, graphs, Venn diagrams, trees and charts are drawn for each question.
5. **No required-books list.** From Year 8 a parent needs to know exactly which book to buy and how lessons map to the Cambridge syllabus.
6. **No written-work loop.** Essays, proofs and lab reports have no way to be marked, even by the parent against a checklist.
7. **Parents get too little guidance at ages 2 to 7.** They need a short script for each sit-down session.
8. **Forgotten PIN has no recovery.** A parent who forgets it is locked out of the parent area.
9. **Sharing has limits.** Deleted items can come back after a merge, and settings do not travel. Recordings of real words are still downloading.
10. **Calendar.** The app does not know about Eid, Ramaḍān hours or family holidays.
11. **Tablet lesson layouts** are acceptable but not designed.

## If this were mine

1. **Teach before testing.** Each lesson becomes: I show you, we do it together, you do it, you explain it. Aim for 15 to 25 minutes a lesson in maths and science, and reach 100 hours or more per year in the core subjects.
2. **Misconception feedback.** Every wrong option carries its own short correction. This is the most effective single change to the learning itself.
3. **A real maths surface.** Fractions, decimals, algebra, drawn graphs and geometric constructions the child can actually do.
4. **Year maps.** One page per year for parents: what is covered, which books, which practicals, and what "on track" looks like.
5. **Parent as teacher.** A daily script for the youngest and a weekly conversation prompt for teens, inside the family page.
6. **A marking loop.** The child photographs written work, and the parent marks it against a simple checklist.
7. **Automatic sync on the same Wi-Fi.** Show a QR code once to pair, then devices sync whenever they are both on the home network. No internet, and this is the right design for the bespoke Windows app when it comes.
8. **Portfolio and transcript.** A record a university or exam centre can read, built from what the child really did.

## What I could not test

- **A real child.** Nothing replaces watching a child use it for a week, and this is the check most likely to change these priorities.
- **A real phone.** Testing was on an emulator and a headless browser.
- **Full-year use.** The year was simulated, not lived.
