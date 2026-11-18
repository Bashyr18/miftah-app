# How Miftāḥ is built

One web core and two thin native shells, with no framework: Android (`android/`) and Windows (`windows/`). `web/index.html` lists every script and stylesheet in load order; that order is the only module system, and `tools/bundle.py` follows it.

## Where things live

| Folder | What it holds |
|---|---|
| `web/js/core` | App shell (`core`), memory and today's plan (`engine`, `flow`), audio (`voice`), sync, print, media, art |
| `web/js/lesson` | The lesson player, its aids (look back, working, calculator), `teach` (how a maths topic is taught), `dia` (drawn diagrams), Arabic for number problems |
| `web/js/instruments` | One step type each: choice, pad, tracing, blocks, and so on. Registered on `I` |
| `web/js/curriculum` | Lessons only. No screen code |
| `web/js/views` | Screens: `v-child` (ages 2 to 11), `v-teen`, `v-teen2` (12 to 18), `v-parent`, `v-dash` (family, child, media), `v-ui` (custom controls) |
| `web/js/data` | Generated or data-only: Qur'ān text, strings, word lists. Do not edit `gen.js` or `speechlist.js` by hand |
| `web/css` | Numbered in cascade order: foundation, ages and controls, parent, student, lesson aids, finish, desk (the computer only) |
| `android/` | Native shell: serves assets, microphone, audio cache, files, sharing |
| `tools/` | Builds and checks |
| `windows/` | Native shell for Windows 10 and 11, in Rust with Edge WebView2 (the `windows` and `webview2-com` crates). `app/src/main.rs` (window, tray, single instance), `web.rs` (WebView2, serving the lessons, dropped files), `bridge.rs` (the bridge), `store.rs` (data folder, backups, family file), `link.rs` (phone pairing and sync), `net.rs` (recitations and updates); `setup/` is Miftah-Setup.exe, its window drawn by `setup/src/page.html`; `common/` holds what both share, including `installer.rs`; `shim.js` adapts the page and sends its bridge calls to `bridge.rs` |
| `docs/guide/` | The illustrated user guide: `guide.src.html`, `guide.js` and `guide-base.css`, built by `tools/build_guide.py` from screenshots taken by `tools/guide-shots.js` |

## Adding things

- **A lesson:** `C.topic(id, title, art, pages, makers)` in `curriculum`, inside a `C.yunit(...)`. A maker is a question row or `r => step`. New curriculum files load before `cur-years.js`.
- **More depth for a lesson:** `C.deep(id, pages, makers)`.
- **A maths topic taught in full:** `C.teach(id, { why, idea, g, trap, explain })` in a `cur-tm-*.js` file. One generator `g(r, level)` returns the question, the answer and its full working, and the lesson is built from it: watch, together, your turn, find the mistake, explain. It becomes two sessions (`id` and `id.p2`). See the comment at the top of `web/js/lesson/teach.js`.
- **A diagram:** `Dia.box`, `Dia.tri`, `Dia.axes` and the rest in `web/js/lesson/dia.js`. Each returns an SVG string coloured by the theme. Science diagrams (`Dia.forces`, `atom`, `particles`, `lever`, `wave`, `ray`, `circuit`, `punnett`, `pyramid`, `cell`, `ph`, `profile`, `conc`) are in `dia-sci.js`.
- **A science topic taught in full:** `C.TS.teach(id, spec)` in a `cur-ts-*.js` file, using the same engine. A working line can be words: give the line's parts as `[en, ar]` and add the wrong words to choose from, so the together step asks the child to pick the missing word (`C.TS.w`). Units and chemical formulae stay in Latin in both languages, as Arabic science books write them.
- **Better wrong answers:** add the question to `C.BETTER` in `cur-better.js`.
- **A number problem with words:** add a row to `web/js/lesson/eq-ar.js`. The tests list what is missing.
- **A new setting:** add it to `defaults()` in `core.js`, or it is dropped on load.
- **A screen:** `A.V.name = args => ({ html, mount, unmount })`. Text goes through `L([en, ar])`.

## Two devices, one core

The page talks to its native shell through one bridge, `window.AndroidBridge`, whose methods are the same on both devices: `tools/bridge-check.js` fails the tests if the Windows app is missing one the Android app has. On Windows, `windows/shim.js` builds that object from the WebView2 host object and adds `DeskBridge` for what only a computer does (install, tray, backups, PDF, pairing). `web/js/core/desk.js` and `web/css/07-desk.css` are the computer's interface (rail, command bar, keyboard, Print Studio, Phone and computer, This computer); they do nothing unless `MIFTAH_DESKTOP` is set.

- **Phone and computer on the home Wi-Fi:** the computer listens (TCP 47731, discovery on UDP 47732); the phone finds it and pairs with six digits. Every message is AES-256-CBC with HMAC-SHA256 under a key made at pairing. Records are joined by the page's own `A.Sync.merge`, the same function a family file uses, so nothing is ever overwritten. Phone side: `android/src/com/miftah/app/Link.java`; computer side: `windows/app/src/link.rs`; protocol test: `tools/link-test.js`.
- **Sheets on screen:** `web/js/views/v-ink.js`. A sheet sent on screen is logged by `Print.keep` with `scr`; the child's strokes live in the sheet's `ink`, per page, in thousandths of the page width; `sub` marks it finished; the parent's red marks are `mk`; marking goes through `Print.mark` exactly as for paper. Test: `tools/ink-test.js`.

## Rules the code keeps

- Never name a local `T` in curriculum: `tools/strings.js` reads it as the translation function.
- Religious text only comes from `gen.js`, never retyped. The Qur'ān is never machine-scored.
- Exams and papers pass `exam: true` to the player: one attempt, no coaching.
- Homeschool groups live in `web/js/views/v-group.js`. A challenge pack is `{miftahChallenge, room, y, seed, n}`: questions come from `G.questions`, which takes the year's skills in id order and shuffles them by the seed, so they are identical on every phone running the same version. Android shares packs as a zip with `challenge.json` (`shareChallenge`) and cards as PNG (`shareImage`).
- Saved state has two copies; `A.load` takes the newer by `savedAt`.
- Every worked line in a taught lesson must be true when computed: `tools/teach-check.js` runs 300 questions per level per lesson on every build. Words inside a working line must be in `C.TM.WORDS` so they appear in Arabic; anything else is written as `[en, ar]`. In science lessons the checker takes the units off before computing, and checks every chemical equation (any line with → or ⇌) atom by atom and charge by charge.

## Checking

```bash
bash tools/check.sh
```

`./build.sh` makes the APK and takes over five minutes because it runs the tests. `python -I tools/build_windows.py` makes `dist/Miftah.exe` on Windows in under a minute. `bash tools/release.sh` makes the full release. Nothing publishes anything.

## Content sources and the signing key

- `tools/sources/` holds the text sources, tracked so anyone can regenerate and verify the religious text: Tanzil, The Clear Quran, hadith, Ḥiṣn al-Muslim. `tools/build_content.py` turns them into `web/js/data/gen.js`.
- `tools/src/` holds the raw audio originals. It is too large for the repository and is ignored; `tools/test.js` checks it only when it is present, and always checks the recordings that ship in `web/audio/`.
- The signing key lives outside the repository, in `~/.keys/miftah/` or wherever `MIFTAH_KEYS` points. See the README, Signing.
- The version is in `version.txt`.
