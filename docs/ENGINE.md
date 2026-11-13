# Miftāḥ: the engine, the curriculum and what comes next

Status, 2026-11-05. This is the design the app now runs on, and an honest list of what is still missing.

## How the system fits together

```
 Curriculum graph        Evidence ledger          Family settings
 rooms → units →         every answer, deed,      stage, limit, school days,
 skills, needs,          sheet and recitation,    pace, subject focus,
 strands                 with who saw it          promises, media
        \                     |                     /
         \                    v                    /
          ------------->  FLOW (flow.js)  <--------
                     one place that decides
                              |
      ---------------------------------------------------
      |          |            |            |            |
   Today's    Preview /    Parent's     Milestones   Printables
    path      forecast      inbox       and rewards   and media
```

Every decision is made in `web/js/flow.js`, from data, and each path carries its reasons (`why`), shown to the parent.

## The rules that shape a child's day

| Rule | What it does | Why |
|---|---|---|
| Stage profile | Minutes, new doors a day and movement interval by age | Attention span differs hugely between 3, 6 and 10 |
| Memory first | Fading keys open the day, mixed across subjects | Retrieval practice, spacing and interleaving are the strongest known effects |
| Review debt | Too many fading keys means fewer new doors | New learning on a slipping base does not hold |
| Retention tunes pace | Under 60% remembered: slower. Over 88% with good first passes: faster | Pace follows evidence, not the calendar |
| Room balance | Each room has a share; the furthest behind goes next | A balanced week without a fixed timetable |
| Strands | Character, duʿāʾ and seerah weave in about every third door | Spiralling beats finishing 23 lessons before the first story |
| Stuck routing | A door failed twice rests a day, and its foundation returns | A child should never hit the same wall daily |
| Unit check | A finished unit gets a mixed, hint-free check | Proves it holds together; lights a lantern |
| Remembering day | One day a week has no new doors | Consolidation, making things, moving |
| Rest days | Only the Qurʾān and something real | The parent decides which |
| Movement | Standing break by minutes of screen; a body step in lessons | Young children learn with their whole body |

## Teaching rhythm

Each lesson: remember, meet, name it, try together, **with your body**, on your own, make it, then the key.
Objects, then pictures, then symbols. Worked examples fade into independent work. A wrong answer gives a calmer look, then a hint, then the answer shown.

## Evidence: what counts

| Kind | Example | Counts as knowing? |
|---|---|---|
| Exposure | Watching a video, tapping "we did it" | No |
| Recognition | Choosing from options | A little |
| Recall | Typing an answer | Yes |
| Production | Tracing, building, **a marked paper sheet** | Yes, and needed to prove a key |
| Observed | A deed a parent confirmed | Yes, and needed to prove a key |

An answer right after a miss counts as helped. A review counts its first attempt only. The Qurʾān is never machine-marked: only a parent's check counts as heard.

## Rewards

No points, streaks or leaderboards, because those teach children to want the reward.

- **The key** is the skill itself. It dims as memory fades, and brightens when recalled.
- **A lantern** lights when a whole unit can be shown, and a certificate can be printed.
- **Family promises** are real rewards set by the parent, tied to real progress and kept in real life.

## Printables

Every sheet is generated from what the child knows today, reproducible from its code. Practice sheets store their answers, and marking them in the app records production evidence.
Sheets: practice in five subjects, tracing with real stroke order, letter and sound cards (also usable on screen), times cards, bingo, floor letters, memory pairs, treasure hunt, ten-frame, hundred square, number lines, place value, a clock to make, duʿāʾ cards, prayer chart, Qurʾān shelf, moon journal, nature notebook, fair test planner, certificate, keys poster, week plan.

## Family media

A parent attaches a YouTube link or a file to a subject, unit or lesson, for chosen age groups: on the room's shelf, before the lesson, or after it. It appears only once the child reaches that point. Children cannot search, browse or leave the player.

**The app now requests the internet permission.** Only the video hosts are allowed through; every other address is blocked in the app's own network layer. Store listing and privacy text must say so before release.

## Pictures

- **Rendered:** keys, lock, door, courtyards (their skies are cut out so the real sky and moon sit behind them), room portals, date, apple, sheep, camel. Put new ones in `art-inbox/`, run `python tools/art_ingest.py art-inbox`, then build.
- **Real places:** the seerah uses real photographs from Wikimedia Commons under free licences, captioned as how each place looks today, and credited in Parents, How Miftāḥ teaches. Sources are in `art-brief/photo-credits.json`. The four generated seerah scenes are no longer wanted.
- **Drawn:** everything else, in `web/js/art.js` and `art2.js`. Interface icons are in `art2.js`.

## Builds

`./build.sh` makes the APK only. `FINAL=1 ./build.sh` also makes the one-file HTML and the Play bundle, for the last version only.

## Desktop (.exe), later

The web layer talks to the device through one bridge (`A.N`), so a desktop shell needs only a new bridge: file save, print, recording, and media copying. Two things to plan for: YouTube embeds refuse `file://` pages, so the shell must serve the app from a local `https` origin; and the widget and reminder have no desktop equivalent yet.

## What ties it together

- **Lab:** `web/sims/index.html` holds the live simulations. `C.SIMS` in `cur-links.js` joins each to its lessons. Parents add their own HTML from Your videos and media. Every frame is sandboxed: it can run its own script, and reach nothing else.
- **Links between subjects:** `sk.uses` and `C.USEDBY`. A finished lesson says where it is used next, and `Flow.rootCause` traces a stuck lesson to the weakest thing it leans on, in any subject.
- **Exams:** a year exam opens at 60% of a year mastered. It is mixed and unhelped. 80% earns a printable certificate, a parent signs it, and weak topics are named. Family promises can use certificates.
- **Placement:** from age 8 a room starts two years below the child’s year (`Flow.floorOf`), or wherever the parent sets it. A child new to Arabic takes `a-older`, written with a real pen.
- **Parents:** Lessons tab for tracking, Set tab for controls, Settings for motion, prompts and PIN.
- **Quiet by default:** touch sounds off, and motion calm. Calm means the door opens once a day and everything else simply appears.

## Performance rules

Measured on the emulator with `dumpsys gfxinfo`; the door logs its own frames to logcat as `door3d frames=`.

- Nothing paints per frame when idle. What moves is a compositor layer: transform and opacity only. Never animate box-shadow, background-position or filter, and do not use backdrop-filter.
- The sky is painted once. Clouds, stars and birds are their own layers, and pause when off screen. The courtyard is graded once into a canvas and reused between visits.
- The door shows its closed frame first, changes the page behind it, and only then starts its clock. Its clock advances by frames shown, so a stall is a pause and not a jump. Resolution adapts to the device and is remembered.
- GPU and audio setup happen in idle slices after first paint. Noise buffers are made once.
- A room map draws one year at a time. Logic is not the bottleneck: a two-year record plans in about a millisecond on desktop.

## App size

Decided 2026-11-06, under the user's 50 MB goal. Inside the APK: al-Ḥuṣarī's Juzʾ ʿAmma as Opus at 40 kbps, adhkār as Opus at 32 kbps (`tools/make_audio.py`), pictures, code and the whole Muṣḥaf's text (`web/quran-rest.js`). Not inside: al-ʿAfāsī, word-by-word audio and the recitation of sūrahs 2 to 77. The app fetches those once from their sources (everyayah.com; verses.quran.com, with audio.qurancdn.com as fallback) and keeps them. Originals are in `tools/src/audio-full`.

Age-by-age design is in `AGE-UX.md`. The lesson list is in `CURRICULUM.md`.

## Gaps to fill next, most important first

1. **Curriculum volume: still the biggest gap.** See `CURRICULUM.md` (generated by `node tools/scope.js`) for the real counts and weeks. There are now seven years and a World room, but the lessons fill only a fraction of those years at the weekly allowance, and Years 6 and 7 are thin.
2. **Reading volume.** English has one comprehension story at the early stage and three lines per phonics phase. Children learn to read by reading: this needs a graded library of decodable books, and Arabic readers too.
3. **Arabic beyond letters.** Six grammar lessons for ages 8 to 11, and thin vocabulary. Thematic vocabulary and real sentences are missing.
4. **Little Steps volume.** 28 activities repeat within about two weeks.
5. **Missing subjects.** History, geography, money, art and handwriting have no home yet.
6. **People who must read it.** A scholar for seerah, adab, ʿaqīdah and ṣalāh; a native Arabic reader for all interface text; ideally a primary teacher for the sequence.
7. **Real voices.** Letter and phonics sounds use the device voice unless a parent records them. Recorded sounds would transform early reading. If a device has no Arabic voice, nothing warns the parent yet.
8. **A real child.** Nothing has been tested with one. Pacing numbers here are reasoned, not observed.
9. **Video fullscreen and local PDFs.** Videos play inline only, and PDFs cannot be attached yet.
10. **Device sync between siblings' tablets, or parent phone and child tablet.** Today each device has its own record, with backup and restore by file.
11. **Scale.** The whole record is saved as one block on each answer. Fine now; after years of ledger it will need moving to a database.
12. **Play Store.** The bundle exceeds the 200 MB limit and needs an install-time asset pack, and the listing must reflect the internet permission.
