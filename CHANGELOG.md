# Changelog

The version is set in `version.txt`.

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
