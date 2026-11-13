# Miftāḥ image prompts

**20 images, 1 already done.** Everything else in the app is drawn in code.

## How to run this

Miftāḥ is a private Islamic homeschool app for Muslim children aged 2 to 11. These images should feel modern, realistic and precious. Each prompt below is complete on its own: paste one prompt, get one image, and save it under the name shown.

1. **Go in order.** `key-forged` is already accepted and sets the look for the objects. `court-fg-day` and `s02-makkah-dawn` set the look for their groups, so approve those before moving on. Where a prompt names a **Reference**, attach that image if your model allows it.
2. **Check each image.** Regenerate if you see any text or fake Arabic, any face or eye (look closely at the sheep and camel), any person, however small, or anything cropped at the edge.
3. **Save as PNG** using the exact name shown. Transparent where the prompt says so. If your model can't do transparency, the prompt gives a flat background colour to use, and I remove it.
4. **Zip them, with no subfolders needed,** as `miftah-art.zip`, and put the zip here, then tell me:

```text
C:\Projects\Islamic Apps\Miftah\art-inbox\
```

If your model can't do an exact size, use its nearest aspect ratio at 1024 pixels or more on the long side. I crop or pad to fit.

## The images

| # | Name | Size | Used for |
|---|---|---|---|
| 1 | `key-forged` (done) | 1024×1024 | The signature key, on every completed lesson and the key ring. Sets the look of every object below. |
| 2 | `key-front` | 1024×1024 | The same key straight on, turned by the child in the lock and in the door opening. |
| 3 | `lock-hero` | 1024×1024 | The lock plate for the first-run gesture and the door opening. |
| 4 | `door-pair` | 1024×1536 | The carved doors that swing open between screens. |
| 5 | `court-fg-day` | 1536×1024 | The home screen building by day. Code draws the sky, sun and clouds behind it. |
| 6 | `court-fg-night` | 1536×1024 | The same building at night, with lit arches. Code draws the real moon and stars. |
| 7 | `date` | 1024×1024 | The main counting object in maths. |
| 8 | `apple` | 1024×1024 | A second counting object. |
| 9 | `leaf` | 1024×1024 | Counting and science. |
| 10 | `palm` | 1024×1024 | Stories, Arabic words and science. |
| 11 | `tree` | 1024×1024 | Arabic words and science. |
| 12 | `sheep` | 1024×1024 | The seerah and science. Must have no visible face. |
| 13 | `camel` | 1024×1024 | The seerah and Arabic words. Must have no visible face. |
| 14 | `rehal` | 1024×1024 | The Qurʾān stop on the daily path and the Qurʾān room. |
| 15 | `s02-makkah-dawn` | 1536×1024 | Seerah: the early life stories. Sets the look of the other three scenes. |
| 16 | `s06-hira` | 1536×1024 | Seerah: the first revelation. |
| 17 | `s12-road` | 1536×1024 | Seerah: the Hijrah. |
| 18 | `s13-masjid-madinah` | 1536×1024 | Seerah: building Madinah. |
| 19 | `moon-disc` | 1024×1024 | The real moon, in the night sky and the moon lesson. Code applies the phase. |
| 20 | `tex-oak` | 1024×1024 | Wood for the maths tools: trays, ten-frame, ruler and clock, which code cuts and assembles. |

## The prompts

### 1. `key-forged`

Save as `key-forged.png` · **Already done, skip this one**

```text
The hero of the app: an antique key whose bow (the handle end) is an eight-pointed rosette with a pierced eight-pointed star opening at its centre, finely bevelled, with a round collar under the bow, a straight round shaft and three crisp rectangular teeth on one side. Warm satin brass with subtle hand-worked wear. Elegant, balanced and substantial, like a real heirloom key.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 2. `key-front`

Save as `key-front.png` · **Reference:** `key-forged`

```text
An antique key whose bow (the handle end) is an eight-pointed rosette with a pierced eight-pointed star opening at its centre, finely bevelled, with a round collar under the bow, a straight round shaft and three crisp rectangular teeth on one side, in warm satin brass, seen exactly front on and perfectly vertical: bow at the top, shaft straight down, teeth pointing right. The shaft axis must lie exactly on the vertical centre line of the image, and the centre of the bow exactly 33% from the top. It will rotate around its centre.

Style: A premium photoreal 3D render of one component for an interactive learning instrument, seen exactly straight on or exactly top down as stated, with no perspective tilt. Soft even studio light from the upper left. Real materials. Perfectly centred and symmetrical where the object is symmetrical. Transparent background unless stated. No cast shadow, no floor, no glow. Clean edges, because it will be precisely placed, rotated or tiled.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 3. `lock-hero`

Save as `lock-hero.png` · **Reference:** `key-forged`

```text
A round ornate brass lock plate seen exactly front on, about 90% of the canvas wide, with a raised geometric eight-fold border and a dark recessed circular keyhole at the exact centre. No key in it. It must read clearly at a small size.

Style: A premium photoreal 3D render of one component for an interactive learning instrument, seen exactly straight on or exactly top down as stated, with no perspective tilt. Soft even studio light from the upper left. Real materials. Perfectly centred and symmetrical where the object is symmetrical. Transparent background unless stated. No cast shadow, no floor, no glow. Clean edges, because it will be precisely placed, rotated or tiled.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 4. `door-pair`

Save as `door-pair.png` · **Reference:** `key-forged`

```text
A pair of grand closed double doors filling the entire frame edge to edge, exactly front on and perfectly mirror symmetrical, with the seam between the two doors exactly on the vertical centre line. Dark walnut, deeply hand carved with an eight-fold Islamic geometric star pattern, thin inlaid brass lines, and rows of round brass studs. Even light. No frame, no wall, no handles and no lock at the centre.

Style: A premium photoreal 3D render of one component for an interactive learning instrument, seen exactly straight on or exactly top down as stated, with no perspective tilt. Soft even studio light from the upper left. Real materials. Perfectly centred and symmetrical where the object is symmetrical. Transparent background unless stated. No cast shadow, no floor, no glow. Clean edges, because it will be precisely placed, rotated or tiled.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1536 pixels (aspect ratio 2:3), larger is welcome. It fills the canvas to every edge, with no border and no vignette.
```

### 5. `court-fg-day`

Save as `court-fg-day.png`

```text
A generic classical masjid in warm white stone, centred and occupying the central 55% of the width: one large smooth dome in muted gold on a drum, a colonnaded arcade of pointed arches along the front, two slender minarets, one each side, topped with plain pointed spires. The building base sits at 62% down from the top of the image. In front, an empty courtyard of pale patterned marble runs to the bottom edge, with a long still reflecting pool on the centre line. Two date palms frame the left and right edges. Low warm desert hills behind. Everything above the skyline is one perfectly flat pure magenta #FF00FF, right up to the edges of the building, hills and palms, with no sky, no halo, no glow and no gradient. No pink or magenta anywhere in the scene, and no flowers. No people. Morning light from the upper left.

Style: A photoreal architectural render, with soft natural light and high detail, of one fixed scene. Keep the exact composition described.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1536 x 1024 pixels (aspect ratio 3:2), larger is welcome. It fills the canvas to every edge. The only thing above the skyline is the flat magenta.
```

### 6. `court-fg-night`

Save as `court-fg-night.png` · **Reference:** `court-fg-day`

```text
A generic classical masjid in warm white stone, centred and occupying the central 55% of the width: one large smooth dome in muted gold on a drum, a colonnaded arcade of pointed arches along the front, two slender minarets, one each side, topped with plain pointed spires. The building base sits at 62% down from the top of the image. In front, an empty courtyard of pale patterned marble runs to the bottom edge, with a long still reflecting pool on the centre line. Two date palms frame the left and right edges. Low warm desert hills behind. Everything above the skyline is one perfectly flat pure magenta #FF00FF, right up to the edges of the building, hills and palms, with no sky, no halo, no glow and no gradient. No pink or magenta anywhere in the scene, and no flowers. No people. Night, moonlit blue stone, warm golden lamplight in every arch, the dome softly catching moonlight, lamps mirrored in the still pool.

Style: A photoreal architectural render, with soft natural light and high detail, of one fixed scene. Keep the exact composition described.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1536 x 1024 pixels (aspect ratio 3:2), larger is welcome. It fills the canvas to every edge. The only thing above the skyline is the flat magenta.
```

### 7. `date`

Save as `date.png` · **Reference:** `key-forged`

```text
One whole ripe medjool date: deep glossy brown, wrinkled skin, a small pale stem scar at the top.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 8. `apple`

Save as `apple.png` · **Reference:** `key-forged`

```text
One red apple with a short brown stem and one small green leaf, a natural waxy sheen and a few pale flecks.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure green #00FF00 background with no shadow, gradient or glow.
```

### 9. `leaf`

Save as `leaf.png` · **Reference:** `key-forged`

```text
One broad fresh green leaf with clearly visible veins and a gentle curl.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 10. `palm`

Save as `palm.png` · **Reference:** `key-forged`

```text
One whole date palm with a ringed trunk, arching fronds and small clusters of dates under the crown, like a miniature.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 11. `tree`

Save as `tree.png` · **Reference:** `key-forged`

```text
One whole small rounded shade tree with a textured trunk and dense green foliage, like a miniature.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 12. `sheep`

Save as `sheep.png` · **Reference:** `key-forged`

```text
One woolly sheep seen from directly behind, walking away, with only its round white fleece, tail and legs visible. No face.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 13. `camel`

Save as `camel.png` · **Reference:** `key-forged`

```text
One camel seen in full side profile, as a soft dark sand-coloured form with the head turned away from the viewer so that no face, eye or mouth is visible. Stylised, smooth and distant in feel.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 14. `rehal`

Save as `rehal.png` · **Reference:** `key-forged`

```text
One closed book with a plain deep green cover, resting on a folding carved wooden stand.

Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. 

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 15. `s02-makkah-dawn`

Save as `s02-makkah-dawn.png`

```text
The valley of old Makkah at dawn: low mud-brick houses among dark rocky hills, smoke rising from one roof, and a plain dark Kaʿbah with no gold and no writing at the centre of the valley. Quiet and tender.

Style: A cinematic matte painting, photoreal with a soft painterly finish, of a place with nobody in it. Warm natural light, atmospheric depth, rich but calm colour, like a concept frame from a prestige animated film. The subject sits in the central 60% of the frame, with safe space at the sides for cropping. Quiet and reverent, never dramatic or frightening. Nothing violent. Nobody present, only the signs of people: a path, a lamp, footprints.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood. No modern objects.

Output: one image, 1536 x 1024 pixels (aspect ratio 3:2), larger is welcome. It fills the canvas to every edge, with no border and no vignette.
```

### 16. `s06-hira`

Save as `s06-hira.png` · **Reference:** `s02-makkah-dawn`

```text
A steep dark mountain at night under a rich field of stars, with a small dark cave opening high up near the summit and a narrow path leading to it. No beam of light, no glow from the cave, no figure.

Style: A cinematic matte painting, photoreal with a soft painterly finish, of a place with nobody in it. Warm natural light, atmospheric depth, rich but calm colour, like a concept frame from a prestige animated film. The subject sits in the central 60% of the frame, with safe space at the sides for cropping. Quiet and reverent, never dramatic or frightening. Nothing violent. Nobody present, only the signs of people: a path, a lamp, footprints.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood. No modern objects.

Output: one image, 1536 x 1024 pixels (aspect ratio 3:2), larger is welcome. It fills the canvas to every edge, with no border and no vignette.
```

### 17. `s12-road`

Save as `s12-road.png` · **Reference:** `s02-makkah-dawn`

```text
A moonlit desert at night with one faint trail of camel tracks winding over the dunes towards a far line of palm trees on the horizon. No camel and no rider.

Style: A cinematic matte painting, photoreal with a soft painterly finish, of a place with nobody in it. Warm natural light, atmospheric depth, rich but calm colour, like a concept frame from a prestige animated film. The subject sits in the central 60% of the frame, with safe space at the sides for cropping. Quiet and reverent, never dramatic or frightening. Nothing violent. Nobody present, only the signs of people: a path, a lamp, footprints.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood. No modern objects.

Output: one image, 1536 x 1024 pixels (aspect ratio 3:2), larger is welcome. It fills the canvas to every edge, with no border and no vignette.
```

### 18. `s13-masjid-madinah`

Save as `s13-masjid-madinah.png` · **Reference:** `s02-makkah-dawn`

```text
The first simple masjid in Madinah in morning sun: low mud-brick walls, a roof of palm fronds on palm-trunk pillars, an open sandy courtyard, and date palms all around. Humble and bright. No dome, no minaret.

Style: A cinematic matte painting, photoreal with a soft painterly finish, of a place with nobody in it. Warm natural light, atmospheric depth, rich but calm colour, like a concept frame from a prestige animated film. The subject sits in the central 60% of the frame, with safe space at the sides for cropping. Quiet and reverent, never dramatic or frightening. Nothing violent. Nobody present, only the signs of people: a path, a lamp, footprints.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood. No modern objects.

Output: one image, 1536 x 1024 pixels (aspect ratio 3:2), larger is welcome. It fills the canvas to every edge, with no border and no vignette.
```

### 19. `moon-disc`

Save as `moon-disc.png`

```text
A photoreal full moon filling 96% of the canvas, perfectly round and centred, evenly front lit, with real maria and craters visible and no shading on one side. Background transparent.

Style: A premium photoreal 3D render of one component for an interactive learning instrument, seen exactly straight on or exactly top down as stated, with no perspective tilt. Soft even studio light from the upper left. Real materials. Perfectly centred and symmetrical where the object is symmetrical. Transparent background unless stated. No cast shadow, no floor, no glow. Clean edges, because it will be precisely placed, rotated or tiled.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat pure magenta #FF00FF background with no shadow, gradient or glow.
```

### 20. `tex-oak`

Save as `tex-oak.png`

```text
Warm light oak wood.

Style: A top-down, evenly lit, photoreal surface texture that tiles seamlessly on all four edges. No objects, no vignette, no directional shadow, no visible repeat marks.

Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.

Output: one image, 1024 x 1024 pixels (aspect ratio 1:1), larger is welcome. It fills the canvas to every edge, with no border and no vignette.
```
