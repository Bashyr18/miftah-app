# Miftāḥ v2

**Superseded by `../ENGINE.md`, which has the current design, status and next gaps.** Kept for its reasoning.

---

The original plan, kept for reference:

# Miftāḥ v2: what happens when the images arrive

The user judged v1's art, layout, realism and UX as not premium enough. v1.0 still works, but it does not contain any of this yet. Run `python tools/art_ingest.py` on what arrives in `art-inbox/`, then do the following.

## Art
The user wants only 20 crucial images from their image model (`art-brief/MIFTAH-IMAGE-PROMPTS.md`). Everything else is code-driven, and must be raised to match them.

**From images:** `key-forged`, `key-front`, `lock-hero`, `door-pair`, `court-fg-day`, `court-fg-night`, `date`, `apple`, `leaf`, `palm`, `tree`, `sheep`, `camel`, `rehal`, `s02-makkah-dawn`, `s06-hira`, `s12-road`, `s13-masjid-madinah`, `moon-disc`, `tex-oak`.

**Image handling:** `A.art(name)` uses the image when one exists, and otherwise the improved SVG, so lessons keep their names. Door transition: `door-pair` split at the seam, `lock-hero`, `key-front`; move the view forward as the doors open. Courtyard: canvas sky, sun, stars and clouds, then `moon-disc` with a phase mask, then `court-fg-*`. Blend day into dawn, afternoon and dusk with code-driven light overlays. Key states are one image with code-driven colour and glow.

**Code-drawn, redrawn to a higher standard:** all other SVG objects with layered shading and consistent upper-left light. Room portals as SVG arches with geometric tile. Maths tools assembled from `tex-oak`. Writing tablet, plates, clock, beads and blocks. Science simulations in canvas. Seerah stories without their own scene reuse the four scenes or the SVG map. App icon composed from `key-forged`.

**Content fixes:** phonics key words must match their pictures (add egg, umbrella, ink, jug, van, box, yarn, zip, ship, chair, ring, clock as SVG, or choose key words that exist). Replace the food chain's placeholder. The senses lesson's `ear` becomes a seashell.

## Layout and UX
- Three tabs: Today, Rooms, My keys. Home: hero, one clear next step, today's progress and estimated time.
- Room view becomes a winding map that scrolls to the current door, not a list.
- Player: prompt fixed at the top, instrument in the middle, actions in the thumb zone, so nothing jumps between steps. A consistent 4/8 spacing scale.
- Tablet and landscape layouts.
- If there is more than one child, ask who is learning at each cold start.

## Learning logic gaps found in review
- **Resume:** leaving a lesson loses the place. Save skill, seed and step, and offer to continue.
- **Session limit:** stage minutes are not enforced. Size the path to a parent-set limit, and show `rest` when it is reached.
- **Deeds are honest:** a child's "We did it" is only a claim. Queue it for a parent to confirm; only then does it count as observed.
- **Teacher check:** a parent view that lists āyāt to hear and grades them. "Someone heard me" should not be a child's tap alone.
- **Stuck routing:** after repeated failure, bring back the prerequisite and flag it to the parent.
- **Shorter lessons:** a family of 4 letters is too much for a five-year-old. Split letters into groups of at most 2.
- **Agency:** "One more door" after the path is done; a parent can skip or swap a stop today.

## Tracking
- Per room: where they are now and what is next.
- Effectiveness: of keys that came due, how many were remembered after a delay, per room. Unaided versus helped over time.
- Skill sheet: a dated evidence timeline. Attendance calendar. Weekly summary: learned, proven, needs you, stuck.

## Instruments
Realistic water in the float tank, day and night sky in the plant time-lapse, and proper shading for the moon and a procedural Earth.

## Still unverified from v1
Widget and reminder on the device. Then the emulator pass, then rebuild and re-sign.

The `.aab` is over Play's 200 MB base limit and needs an install-time asset pack before any store upload.
