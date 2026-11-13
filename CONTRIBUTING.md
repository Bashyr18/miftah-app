# Contributing to Miftāḥ

Thank you for helping. Miftāḥ teaches children, and it carries religious text, so a few rules are firm. Everything else is open to improvement.

## Firm rules

1. **Religious text comes only from a verified source, through a generator in `tools/`,** with a test that proves it is unaltered. Never type or paste Qurʾān, hadith or duʿāʾ into a lesson by hand. See [CONTENT.md](CONTENT.md).
2. **No faces** in any illustration.
3. **The Qurʾān is never gamified:** no points, streaks or rewards on recitation or memorisation.
4. **Honest evidence:** a lesson counts as mastered only when the child shows it on their own. Don't add shortcuts that give credit for guessing. `tools/e2e-honesty.js` will catch most of them.
5. **Both languages:** every string a child or parent sees is given as `[english, arabic]`. `tools/strings.js` checks the interface.

## Before you open a pull request

```bash
npm ci
npm test
```

All four checks must pass. If you changed a taught lesson or the lesson player, also run the screen check (it needs the dev server on port 5191):

```bash
node tools/cdp.js tools/teach-screens.js build/e2e
```

## Adding a lesson

- **A taught maths topic:** `C.teach(id, { why, idea, g, trap, explain })` in the right `web/js/curriculum/cur-tm-y*.js` file. The comment at the top of `web/js/lesson/teach.js` explains the shape: one generator `g(r, level)` returns the question, the answer and its full working, and the engine builds the whole lesson from it.
- **A taught science topic:** the same, through `C.TS.teach` in `cur-ts-y*.js`. A working line may be words: give its parts as `[en, ar]` and list the wrong words to choose from.
- `tools/teach-check.js` computes every worked line, balances every chemical equation, and refuses English words in a working line that the app can't show in Arabic.

The other lesson styles in older files are being merged into one schema (review item 2.1). For now, copy the nearest existing lesson in the same file.

## Style

- Plain JavaScript, no framework, no build step during development: each file is an IIFE that adds to a few globals (`A`, `C`, `M`, `I`, `Player`).
- Two-space indent, UTF-8, LF line endings (see `.editorconfig`).
- Keep new lines readable. Older files have very long lines; please don't add more.
- Escape every value you put into HTML with `A.esc`, or use the helpers that already do.
- Comments say *why*, in plain English, the way the existing ones do.

## Reporting a problem

Say what you expected, what happened, the child's age setting, the language, and the screen. A screenshot helps most.
