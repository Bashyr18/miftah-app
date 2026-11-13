# Miftāḥ: App Brief

> The floor comes from the islamic-app-builder skill. This brief records only what makes **this** app itself.

## Identity
- **Name:** Miftāḥ · **Arabic name:** مِفْتَاح (the key)
- **Package id:** com.miftah.app · **Keystore alias:** miftah
- **Version:** 1.0 (code 1)
- **Icon idea:** a gold key whose bow is the eight-point rosette, on midnight
- **Feedback email:** bashyr18@gmail.com

## Purpose and core loop
- **The one daily act:** today's path. The child opens the app and sees one thing: the next door. A short, ordered journey (remember, learn, recite, go and do it) built fresh each day by the app, never a menu of courses.
- **The moment of use:** the family's school time, 5 to 45 minutes by stage, one device, adult beside the youngest.
- **Success after a week:** the child runs to the app, has recited a new sūrah, did real deeds off-screen, and the parent can say exactly what was learned and what needs talking about.

## What we kept from C:\Projects\Arabic, and what we refused
**Kept (the user likes these):**
- The 18-subject scope, stages S0 to S2, and the "stage governs presentation, level governs content" split.
- The seven-phase lesson: recall, encounter, rule, guided, apply, produce, commit.
- One instrument per subject: every subject is a thing you manipulate, not read about.
- Concrete, pictorial, abstract. Prediction before result in science. Sabaq, sabqī, manzil for ḥifẓ.
- Evidence-gated mastery, assisted work never counted as independent, typed learner errors, no averaged score.
- Append-only learning ledger; the record is rebuildable from events.
- The nursery audit: adult card plus one child action, no score, observations instead of quizzes, back to real play.
- Verified datasets: Tanzil Uthmani, The Clear Quran (owner-authorised).

**Refused (why the user disliked it):**
- The generated lesson text ("choose, draw, or say sort three cards into source, observable action, and open question"). All child-facing content here is written for a child.
- 14-item navigation, graph paper, monospaced caps, courses and levels shown to children, points on a toddler's lesson.
- Server, database, roles, sign-in. This is one family's phone.
- Empty rooms. A door exists only if a child can learn behind it today.

## Audience
- A family with several children of different and growing ages, so **multiple profiles**, each with its own stage and its own level per room.
- **Tone:** warm, short, concrete, spoken. Never babyish about the religion.
- **Gendered content:** ṣalāh figures (brother or sister) chosen per child.

## Stages (presentation)
| Stage | Age | Child sees | Adult | Assessment |
|---|---|---|---|---|
| Little Steps (S0) | 2 to 4 | one picture, one spoken cue, no text, huge targets | sits beside, has a guide card | observation only, never scored |
| Explorers (S1) | 5 to 7 | big targets, spoken prompts, few words, tracing | nearby | demonstrations, no marks |
| Seekers (S2) | 8 to 11 | a day plan, reads prompts, types answers | reviews | keys and evidence, never a grade |

## Content and sources
| Content | Arabic | English | Permission | Notes |
|---|---|---|---|---|
| Qurʾān text | Tanzil Uthmani 1.1 (old project, CC-BY, unaltered) | The Clear Quran (old project JSON) | Owner-confirmed | Footnote markers stripped only |
| Hadith | fawazahmed0/hadith-api | sunnah.com English via same | As Adhkār | Slices, FIX and NOTE in code; grades shown; authentic only |
| Duʿāʾ | Adhkār data.js (Ḥiṣn al-Muslim) | sunnah.com verbatim | As Adhkār | Reused verbatim, with transliteration |
| Ṣalāh figures | Adhkār pose art, faceless | | User's own | Brother and sister sets |
| Stories (seerah), adab scenarios, lessons | authored for children | authored for children | Ours | Visibly our telling, never quotation; each carries its reference. **Needs a scholar's read before public release** |
| Lexicon words | common Qurʾānic words | our glosses | Ours | Reviewed by a native reader before release |

- **Recordings:** al-Ḥuṣarī al-Muʿallim for ḥifẓ (bundled: al-Fātiḥah and 10 sūrahs; the rest of Juzʾ ʿAmma on request). Qurʾān single words from audio.qurancdn.com. Ḥiṣn duʿāʾ from hisnmuslim.com.
- **Voices (user's decision):** device voice for non-religious prompts, and the parent can record over any prompt. Qurʾān and adhkār are never synthetic.
- **Sound effects:** soft clicks and mechanical key sounds only. No music, chimes or bells.
- **Positions specific to this app:** fiqh taught as one method to children, following the house position (Adhkār's ṣalāh guide); no comparison before S3. Ḥifẓ and recitation are heard by a person or self-reported, never machine-scored. Qurʾān is never scrambled, gamified, or celebrated with effects.

## Art direction (user's decision: no faces)
- Nothing with a face. The world is light, nature, objects, geometry. Animals are distant silhouettes without features. People appear only as Adhkār's faceless figures.
- Prophets, angels, Companions and Allah are never depicted in any form. Seerah is told with places, light, maps and objects.

## Signature motif
- **Default accent:** gold on midnight, with each room in its own jewel hue. Sky follows the real clock and the moon follows the real Hijri date.
- **Hero:** the Courtyard. A real sky above a row of carved arches; each arch is a room; a living key walks the day's path.
- **Signature component:** **the Key.** Every skill is a key. Doors open with a real turn of a key. A key's light *is* its memory strength: bright when fresh, dimming over days, relit by recalling. Earning, keeping and proving are three different things, shown without a single number.
  - Forged: lesson passed unaided.
  - Proven: produced, and recalled a day or more later.
  - Deep: still recalled after two weeks.

## Features
- **Core loop:** the daily path and the seven-phase lesson player.
- **From the catalogue:** memorise mode, audio downloads, Learn the prayer poses, native mirror, backup.
- **New to this app:** key memory model, evidence ledger, per-room placement, 35 instruments, predict-then-see simulations, real-world missions confirmed by a parent, ḥifẓ scheduler, parent voice-over, parent dashboard ("what to talk about this week"), attendance and printable report.
- **Rooms:** Qurʾān · Arabic · Living Islam (ʿaqīdah, adab, duʿāʾ, wuḍūʾ and ṣalāh, seerah, hadith) · Maths (with reasoning and fair sharing) · English · Science.
- **Embedded, not separate rooms:** khaṭṭ and handwriting (tracing in Arabic and English), reasoning (patterns and sorting), practical life, physical and outdoor (missions).
- **Out of scope for v1:** S3 and above, comparative fiqh, computer science, Islamic history beyond the seerah. Not shown anywhere as "coming soon" to children.

## Native surfaces
- **Widget:** "Today's path" (2×2 and wide), showing the next door and keys lit.
- **Notifications:** one daily school-time reminder, silent by default, chosen by the parent.
- **Shortcuts:** Continue today, Parent area.
- **Permissions:** microphone (only when the parent records a voice or a child's recitation), notifications, internet (only to download Qur’an recordings once, and to play YouTube videos a parent adds; every other host is blocked in the app).

## Onboarding
- **Scenes:** the key and the door; who is learning (name, age, brother or sister); parent gate; first door.
- **Core gesture practised interactively:** turn the key. The child drags the key round in the lock and the first door opens.

## Decisions log
- 2026-11-05 Several ages, so three stages and per-room levels (user).
- 2026-11-05 Device voice plus parent recordings (user).
- 2026-11-05 No faces at all (user).
- 2026-11-05 A full school day of six rooms (user).
- 2026-11-05 Al-Ḥuṣarī al-Muʿallim for bundled recitation, downloads approved (user).
