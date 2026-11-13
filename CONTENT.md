# Content in Miftāḥ and where it comes from

The **code** in this repository is under the MIT licence (`LICENSE`). The **content** below comes from the sources named here, each on its own terms. If you fork the project, keep these credits and check each source's terms for your use.

Religious text enters the app only from verified sources, through generators in `tools/`, and the tests prove it is unaltered. **Never edit generated files by hand.**

## Religious text and recitation

| Content | Source | Where it lives | How it is checked |
|---|---|---|---|
| Qurʾān text | Tanzil Uthmani 1.1, tanzil.net (CC BY 3.0, unaltered) | `web/js/data/gen.js`, `web/quran-rest.js` | `tools/test.js` proves byte identity with Tanzil |
| Qurʾān translation | *The Clear Quran*, Dr Mustafa Khattab, used with permission | `web/js/data/gen.js`, `web/quran-rest.js` | Footnote marks removed; em dashes made commas |
| Hadith | sunnah.com English editions, via fawazahmed0/hadith-api | `web/js/data/gen.js` | Sliced between markers; grades kept |
| Duʿāʾ | hisnmuslim.com (Arabic and audio); sunnah.com Ḥiṣn al-Muslim (English) | `web/js/data/gen.js`, `web/audio/d/` | Every recording is checked to exist |
| Recitation | everyayah.com: Husary_Muallim_128kbps, Alafasy_128kbps | `web/audio/h/` | Byte-identical files |
| Word-by-word audio | audio.qurancdn.com/wbw | `web/audio/s/` | 98:7 word 1 and 79:1 word 2 have no recording at the source |

## Images

| Content | Source | Where it lives |
|---|---|---|
| Ṣalāh posture figures | The project owner's own art (shared with the Adhkār app) | `web/img/pose/` |
| Scenes, objects, room doors, keys | Commissioned for Miftāḥ; the project owner holds the rights | `web/img/art/`, `web/img/obj/` |
| Photographs of real places (10) | Wikimedia Commons: CC BY-SA 3.0 (3), CC BY 2.0 (3), CC BY-SA 4.0 (3), CC BY 4.0 (1) | Listed with author, licence and page in `art-brief/photo-credits.json`; the credit is shown under each photo in the app |
| Interface icons | Phosphor Icons, duotone (MIT) | `web/js/data/icons.js` |

## Fonts

All fonts are under the SIL Open Font License 1.1.

| Font | Use | Files |
|---|---|---|
| Quicksand | Interface (Latin) | `web/fonts/Quicksand-*` |
| IBM Plex Sans Arabic | Interface (Arabic) | `web/fonts/PlexArabic-*` |
| Amiri | Arabic text, duʿāʾ, hadith | `web/fonts/Amiri-*` |
| Amiri Quran | Qurʾān | `web/fonts/AmiriQuran-*` |

## Written for Miftāḥ

The lessons, explanations, worked examples, questions, simulations (`web/sims/`), seerah and adab stories, and the interface text in English and Arabic were written for this project. They are covered by the MIT licence with the code.

## Rules for new content

- **Religious text:** add it only through a generator in `tools/` from a verified source, with a test that proves it is unaltered.
- **Faces:** none, in any illustration.
- **The Qurʾān is never gamified:** no points, streaks or rewards on recitation or memorisation.
- **Maths and science:** a taught lesson must pass `tools/teach-check.js`, which computes every worked line and balances every equation.
