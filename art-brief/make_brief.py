"""Single source of the image brief. Writes MIFTAH-IMAGE-BRIEF.md (for the image agent) and manifest.json (for tools/art_ingest.py).
Run: python art-brief/make_brief.py"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))

RULES = """ABSOLUTE RULES FOR EVERY IMAGE
1. No faces. No eyes, mouths, noses, expressions or anything that reads as a face, on any person, animal, object, cloud, sun or moon.
2. No people at all, and no human silhouettes. Hands and feet appear only where an item explicitly asks for them.
3. Never depict a prophet, angel, Companion, or God in any form, including as a glowing figure, a beam of light with a shape, or a shadow.
4. No text of any kind: no letters, numerals, calligraphy, Arabic or pseudo-Arabic script, signs, logos, labels, signatures or watermarks. Pages and bands must be blank or carry abstract non-letter ornament only.
5. No musical instruments, bells, dolls, statues, idols, crosses, six-pointed stars, or crescent finials. No alcohol. No pigs. No weapons or blood.
6. No modern objects in historical scenes: no clock tower, cars, cables, skyscrapers or asphalt.
"""

STYLE = {
 'O': """Style: A premium, photoreal 3D product render of one isolated object for a high-end children's learning app. Physically based materials with real surface detail. Large soft studio light from the upper left, gentle fill from the right, a faint warm rim light. Proportions slightly simplified and friendly, materials believable and real, like a Blender Cycles or Octane render. Not a cartoon, not clip art, not flat vector, not a sticker, no outline. Camera: three-quarter view from about 15 degrees above, 85mm lens. Centred, filling about 75% of the canvas, with at least 10% clear margin on every side and nothing cropped. Transparent background. No floor, no cast shadow, no reflection plane, no glow, no vignette. """,
 'F': """Style: A premium photoreal 3D render of one component for an interactive learning instrument, seen exactly straight on or exactly top down as stated, with no perspective tilt. Soft even studio light from the upper left. Real materials. Perfectly centred and symmetrical where the object is symmetrical. Transparent background unless stated. No cast shadow, no floor, no glow. Clean edges, because it will be precisely placed, rotated or tiled.""",
 'S': """Style: A cinematic matte painting, photoreal with a soft painterly finish, of a place with nobody in it. Warm natural light, atmospheric depth, rich but calm colour, like a concept frame from a prestige animated film. The subject sits in the central 60% of the frame, with safe space at the sides for cropping. Quiet and reverent, never dramatic or frightening. Nothing violent. Nobody present, only the signs of people: a path, a lamp, footprints.""",
 'C': """Style: A photoreal architectural render, with soft natural light and high detail, of one fixed scene. Keep the exact composition described.""",
 'T': """Style: A top-down, evenly lit, photoreal surface texture that tiles seamlessly on all four edges. No objects, no vignette, no directional shadow, no visible repeat marks.""",
}

KEYD = "an antique key whose bow (the handle end) is an eight-pointed rosette with a pierced eight-pointed star opening at its centre, finely bevelled, with a round collar under the bow, a straight round shaft and three crisp rectangular teeth on one side"
COURT = "A generic classical masjid in warm white stone, centred and occupying the central 55% of the width: one large smooth dome in muted gold on a drum, a colonnaded arcade of pointed arches along the front, two slender minarets, one each side, topped with plain pointed spires. The building base sits at 62% down from the top of the image. In front, an empty courtyard of pale patterned marble runs to the bottom edge, with a long still reflecting pool on the centre line. Two date palms frame the left and right edges. Low warm desert hills behind. Everything above the skyline is fully transparent, so the sky is empty alpha. No people. "
POT = "A terracotta pot of dark soil seen exactly front on, centred horizontally, in the lower third of a portrait canvas with its base on the bottom margin"
BULB = "One clear glass light bulb with a visible filament and a screw base"
SWITCH = "Exactly top down: one simple knife switch on a small rectangular wooden base with two brass terminals"
B = []  # batches: (id, title, how, items)
def batch(id_, title, how, items): B.append((id_, title, how, items))
# item: (name, width, height, style, background 'alpha'|'opaque', subject)
def O(n, s, w=1024, h=1024): return (n, w, h, 'O', 'alpha', s)
def F(n, s, w=1024, h=1024, bg='alpha'): return (n, w, h, 'F', bg, s)
def S(n, s, w=1536, h=1024): return (n, w, h, 'S', 'opaque', s)
def T(n, s, w=1024, h=1024): return (n, w, h, 'T', 'opaque', s)

batch('01-keys', 'The key family (generate first: this sets the style for all objects)',
 'Generate key-forged first and approve it. Use it as the style reference for every Style O and Style F image in the whole bundle.', [
 O('key-forged', 'The hero of the app: ' + KEYD + '. Warm satin brass with subtle hand-worked wear. Elegant, balanced and substantial, like a real heirloom key.'),
 O('key-proven', KEYD[0].upper() + KEYD[1:] + '. Polished bright warm gold, with delicate engraved geometric filigree on the bow and one small round amber cabochon set in the collar.'),
 O('key-deep', KEYD[0].upper() + KEYD[1:] + '. Its finest form: rich deep gold, intricate engraved geometric filigree across the bow and shaft, and one deep emerald cabochon at the centre of the star. The most precious of the set.'),
 O('key-raw', KEYD[0].upper() + KEYD[1:] + '. Unfinished: dark rough cast iron with a matte surface and no polish, as if it has just left the mould.'),
 F('key-front', KEYD[0].upper() + KEYD[1:] + ', in warm satin brass, seen exactly front on and perfectly vertical: bow at the top, shaft straight down, teeth pointing right. The shaft axis must lie exactly on the vertical centre line of the image, and the centre of the bow exactly 33% from the top. It will rotate around its centre.'),
 O('keyring', 'A large, heavy antique brass key ring with a small ornate hanging loop at the top, empty, no keys on it. Seen slightly from the front.'),
 F('lock-hero', 'A round ornate brass lock plate seen exactly front on, about 90% of the canvas wide, with a raised geometric eight-fold border and a dark recessed circular keyhole at the exact centre. No key in it. It must read clearly at a small size.'),
 O('lock', 'A small, sturdy antique brass padlock, closed, with a steel shackle, used to mark a door that is not open yet. Friendly, not menacing.'),
 F('door-pair', 'A pair of grand closed double doors filling the entire frame edge to edge, exactly front on and perfectly mirror symmetrical, with the seam between the two doors exactly on the vertical centre line. Dark walnut, deeply hand carved with an eight-fold Islamic geometric star pattern, thin inlaid brass lines, and rows of round brass studs. Even light. No frame, no wall, no handles and no lock at the centre.', 1024, 1536, 'opaque'),
 O('door', 'A small freestanding wooden arched door with a pointed arch top, walnut planks, brass studs and two small brass ring handles, closed.'),
])

batch('02-courtyard', 'The courtyard (the home screen hero)',
 'Generate court-fg-day first and approve it. Use it as a strict reference for the other four: same building, same camera, same framing, only the light changes. Sky plates are separate because the app draws the real sun, moon, stars and clouds between the sky and the building.', [
 ('sky-dawn', 1536, 1024, 'S', 'opaque', 'Only sky, no land. Dawn: deep indigo at the top, rose and soft apricot towards the bottom edge, thin high cloud. NO sun, NO moon, NO stars, NO birds.'),
 ('sky-day', 1536, 1024, 'S', 'opaque', 'Only sky, no land. Clear morning: rich blue at the top, pale luminous blue at the bottom edge, a few soft high clouds. NO sun, NO moon, NO birds.'),
 ('sky-gold', 1536, 1024, 'S', 'opaque', 'Only sky, no land. Golden afternoon: soft blue at the top melting into warm gold at the bottom edge, gentle cloud. NO sun, NO moon, NO birds.'),
 ('sky-dusk', 1536, 1024, 'S', 'opaque', 'Only sky, no land. Just after sunset: deep violet at the top, ember orange and rose along the bottom edge. NO sun, NO moon, NO stars, NO birds.'),
 ('sky-night', 1536, 1024, 'S', 'opaque', 'Only sky, no land. Night: deep midnight blue, slightly lighter towards the bottom edge. Completely empty: NO stars, NO moon, no cloud. Stars will be added later.'),
 ('court-fg-day', 1536, 1024, 'C', 'alpha', COURT + 'Morning light from the upper left.'),
 ('court-fg-dawn', 1536, 1024, 'C', 'alpha', COURT + 'Low warm light from the left, long soft shadows, rose-tinted stone, the first lamps still faintly lit in the arches. Sky fully transparent.'),
 ('court-fg-gold', 1536, 1024, 'C', 'alpha', COURT + 'Golden late afternoon light from the right, warm glowing stone, long shadows. Sky fully transparent.'),
 ('court-fg-dusk', 1536, 1024, 'C', 'alpha', COURT + 'Dusk, cool violet shade on the stone, warm lamplight glowing from every arch and reflecting in the pool. Sky fully transparent.'),
 ('court-fg-night', 1536, 1024, 'C', 'alpha', COURT + 'Night, moonlit blue stone, warm golden lamplight in every arch, the dome softly catching moonlight, lamps mirrored in the still pool. Sky fully transparent.'),
])

PORT = "A tall carved stone portal with a pointed Islamic arch, seen exactly front on, filling the canvas, wearing {tile}. A thin raised gold line traces the arch. Inside the arch, a softly glowing recessed alcove lit from within in {glow}, and in that alcove, resting on a small ledge, {thing}. Everything outside the arch outline is fully transparent, so the image's silhouette is the arch itself. The top of the arch is at the top of the canvas and the base at the bottom."
batch('03-rooms', 'The six room portals',
 'All six must share the exact same arch shape and framing, differing only in colour and contents. Generate room-quran first and use it as the reference for the other five.', [
 F('room-quran', PORT.format(tile='deep emerald glazed zellige tile', glow='warm pale gold', thing='a closed green book on a folding wooden stand (a rehal), with plain covers and no writing'), 1024, 1280),
 F('room-arabic', PORT.format(tile='deep rose-crimson glazed zellige tile', glow='warm pale gold', thing='a reed pen resting across a small brass inkwell'), 1024, 1280),
 F('room-deen', PORT.format(tile='deep teal glazed zellige tile', glow='warm pale gold', thing='a small brass lantern, lit, beside a neatly folded prayer mat'), 1024, 1280),
 F('room-math', PORT.format(tile='deep sapphire glazed zellige tile', glow='warm pale gold', thing='a small stack of smooth wooden blocks and a few dates on a tiny brass dish'), 1024, 1280),
 F('room-english', PORT.format(tile='deep violet glazed zellige tile', glow='warm pale gold', thing='an open storybook with blank cream pages and a feather quill'), 1024, 1280),
 F('room-science', PORT.format(tile='deep amber-orange glazed zellige tile', glow='warm pale gold', thing='a small seedling in a clay pot beside a brass magnifying glass'), 1024, 1280),
])

batch('04-objects', 'Objects for lessons and activities',
 'All Style O. Use key-forged as the style reference. Each object must read instantly at 40 pixels, because children tap these at many sizes.', [
 O('date', 'One whole ripe medjool date: deep glossy brown, wrinkled skin, a small pale stem scar at the top.'),
 O('apple', 'One red apple with a short brown stem and one small green leaf, a natural waxy sheen and a few pale flecks.'),
 O('orange', 'One whole orange with dimpled peel, a small green stem and one leaf.'),
 O('olive', 'One green olive with a short stem and a single slender silver-green leaf.'),
 O('grape', 'One small bunch of dark purple grapes with a soft bloom on the skin, a woody stem and one vine leaf.'),
 O('bread', 'One round rustic flatbread, golden brown, lightly floured, with soft charred bubbles.'),
 O('egg', 'One whole brown hen\'s egg, standing slightly tilted.'),
 O('leaf', 'One broad fresh green leaf with clearly visible veins and a gentle curl.'),
 O('tree', 'One whole small rounded shade tree with a textured trunk and dense green foliage, like a miniature.'),
 O('palm', 'One whole date palm with a ringed trunk, arching fronds and small clusters of dates under the crown, like a miniature.'),
 O('flower', 'One simple five-petalled pink wild flower with a golden centre and a short stem.'),
 O('seed', 'A tiny green seedling with two leaves sprouting from a small mound of dark soil.'),
 O('plant', 'A small leafy green plant in a terracotta pot.'),
 O('grass', 'A small tuft of fresh green grass growing from a little mound of soil.'),
 O('sun', 'A stylised 3D sun: a glowing golden sphere with soft, rounded, tapering rays around it. No face.'),
 O('moon', 'A realistic crescent moon as a 3D object with soft grey craters, floating, lit from the left. No face.'),
 O('star', 'A single rounded five-pointed star made of polished gold, thick and softly bevelled. No face.'),
 O('cloud', 'One soft, plump white cloud with volumetric shading. No face.'),
 O('rain', 'One soft grey rain cloud with four clear water droplets falling beneath it. No face.'),
 O('drop', 'One perfectly clear water droplet with realistic refraction and a bright highlight, with a faint blue tint.'),
 O('ice', 'One clear ice cube with rounded edges, inner cracks and frost.'),
 O('stone', 'One smooth, rounded grey river stone with subtle mineral speckles.'),
 O('feather', 'One soft white feather with fine visible barbs, gently curved.'),
 O('coin', 'One plain gold coin, thick, with a raised rim and a simple eight-pointed star in relief. No letters and no numerals.'),
 O('book', 'One open book with cream pages fanning up and a dark green leather cover. The pages are completely blank.'),
 O('lantern', 'One ornate brass lantern with pierced geometric panels and amber glass, softly lit from within, with a ring at the top.'),
 O('cup', 'One simple ceramic cup in cream glaze with a handle, seen with a little water inside.'),
 O('jug', 'One rounded clay water jug with a handle, in warm terracotta.'),
 O('shoe', 'One child\'s simple brown leather shoe, with soft stitched details.'),
 O('ball', 'One soft child\'s ball with broad panels of warm red and cream. Plain, with no sports logo.'),
 O('spoon', 'One polished steel spoon, lying diagonally.'),
 O('boat', 'One small wooden sailing boat with a cream cloth sail. A toy-scale miniature.'),
 O('ship', 'One small old wooden dhow with a single triangular sail and plain planks.'),
 O('wood', 'One short rough-barked log with a visible ring pattern on its cut end.'),
 O('nail', 'One iron nail, standing diagonally, slightly weathered.'),
 O('torch', 'One handheld torch (flashlight) in dark metal, lit, with a bright lens.'),
 O('mirror', 'One small round hand mirror with a brass frame and a handle, reflecting only a soft pale sky gradient.'),
 O('soap', 'One rounded bar of pale rose soap with a few clear bubbles floating above it.'),
 O('tap', 'One brass water tap with a single clear drop falling from its spout.'),
 O('pencil', 'One yellow wooden pencil, sharpened, lying diagonally, with a pink eraser.'),
 O('pot', 'One polished steel cooking pot with two handles and a little steam rising.'),
 O('kettle', 'One steel kettle with a thick white plume of steam rising from its spout.'),
 O('water-glass', 'One clear glass half filled with still water.'),
 O('magnet', 'One classic red horseshoe magnet with silver tips.'),
 O('magnifier', 'One brass magnifying glass with a wooden handle.'),
 O('ink', 'One small glass bottle of dark blue ink with a cork stopper. No label.'),
 O('box', 'One small plain wooden box with its lid slightly open, empty.'),
 O('van', 'One small rounded toy delivery van in warm cream and teal. No windows showing anyone, no writing.'),
 O('umbrella', 'One open umbrella in deep teal with a curved wooden handle.'),
 O('yarn', 'One ball of soft woollen yarn in warm amber.'),
 O('zip', 'One short metal zip on a strip of navy cloth, half open.'),
 O('chair', 'One simple wooden chair.'),
 O('ring', 'One plain gold ring with no stone.'),
 O('clock', 'One small round wooden shelf clock with a blank cream face: hands only, no numerals, no marks.'),
 O('prayer-mat', 'One neatly unrolled prayer mat seen at an angle, in deep green and gold, with a plain pointed arch shape woven at one end and a geometric border. No picture of any building and no writing.'),
 O('rehal', 'One closed book with a plain deep green cover, resting on a folding carved wooden stand.'),
 O('crayons', 'A small handful of chunky wax crayons in warm colours, loosely arranged. No labels.'),
 O('blocks', 'Three smooth plain wooden toy blocks stacked, with no letters and no numbers on them.'),
 O('toy-box', 'One open wooden toy box containing a ball and plain wooden blocks.'),
 O('house', 'One small simple Hijazi-style house with cream walls, a wooden door and a flat roof, as a miniature.'),
 O('tent', 'One traditional woven desert tent with dark striped fabric, as a miniature.'),
 O('well', 'One round stone desert well with a wooden frame, a rope and a small bucket, as a miniature.'),
 O('masjid', 'One small masjid as a miniature: white stone, a single muted gold dome, one slender minaret with a plain spire, an arched doorway. '),
 O('kaaba', 'The Kaʿbah as a respectful, accurate miniature, seen at a three-quarter angle: a plain cube draped in matte black cloth, with one plain gold band around the upper part carrying only a simple repeating diamond pattern, and a plain gold door. Absolutely no letters or calligraphy anywhere on it, and no people.'),
 O('mountain', 'One rocky desert mountain with warm brown stone and sharp ridges, as a miniature with no snow.'),
 O('cave', 'One rocky hillside with a dark cave mouth, in warm desert stone, as a miniature.'),
 O('camel', 'One camel seen in full side profile, as a soft dark sand-coloured form with the head turned away from the viewer so that no face, eye or mouth is visible. Stylised, smooth and distant in feel. Reject if an eye is visible.'),
 O('sheep', 'One woolly sheep seen from directly behind, walking away, with only its round white fleece, tail and legs visible. No face. Reject if any head detail shows.'),
 O('bird', 'One small bird in flight seen from below as a soft dark blue-grey form, wings spread, with no eye and no beak detail.'),
 O('fish', 'One fish seen from directly above, in smooth silver-blue. No eye visible. Reject if an eye is visible.'),
 O('butterfly', 'One butterfly seen from directly above with open orange wings and a dark border. No face detail.'),
 O('bee', 'One honeybee seen from directly above, with golden and dark stripes and clear wings. No face detail.'),
 O('wolf', 'One grey wolf seen from directly behind, walking away, as a soft and distant form. No face visible. Calm, not threatening.'),
 O('hand', 'One open child\'s hand, palm towards the viewer, fingers gently spread, in a warm medium skin tone. Realistic and gentle. No arm beyond the wrist.'),
 O('foot', 'One child\'s bare foot seen from the side, in a warm medium skin tone. No leg beyond the ankle.'),
 O('ear', 'One large spiral seashell in warm cream, the kind held up to listen to. No human ear.'),
 O('circle', 'A flat disc, a thick glazed ceramic tile in rose pink, perfectly circular, tilted slightly so its thickness shows.'),
 O('square', 'A flat square, a thick glazed ceramic tile in sapphire blue, with exact equal sides, tilted slightly so its thickness shows.'),
 O('rect', 'A flat rectangle twice as wide as it is tall, a thick glazed ceramic tile in green, tilted slightly so its thickness shows.'),
 O('triangle', 'A flat equilateral triangle, a thick glazed ceramic tile in warm orange, tilted slightly so its thickness shows.'),
 O('hexagon', 'A flat regular hexagon with exactly six equal sides, a thick glazed ceramic tile in violet, tilted slightly so its thickness shows.'),
 O('octa', 'A flat eight-pointed star made from two overlapping squares, a thick glazed ceramic tile in gold, tilted slightly so its thickness shows.'),
])

batch('05-instruments', 'Pieces for the interactive instruments',
 'The app assembles these exactly in code, so do not draw grids, rulers with marks, clock numerals or counted stacks. One clean piece each. Use key-forged as the material reference.', [
 F('well-wood', 'Exactly top down: one single shallow round recess carved into a square of warm oak wood, the square filling the canvas edge to edge. It must look right when placed next to copies of itself in rows.', 512, 512, 'opaque'),
 F('block-one', 'One single wooden cube in warm amber-stained wood, seen exactly front on and slightly from above, with crisp bevelled edges. It will be stacked with copies of itself.', 512, 512),
 F('bead-blue', 'One glossy round sapphire-blue glass bead, seen exactly front on.', 512, 512),
 F('bead-amber', 'One glossy round amber glass bead, seen exactly front on.', 512, 512),
 F('plate-top', 'Exactly top down: one empty round cream ceramic plate with a thin gold rim, perfectly circular and centred.', 1024, 1024),
 F('bowl-water', 'Exactly top down: one round white bowl filled with still clear water.', 1024, 1024),
 F('tray-wood', 'Exactly top down: one empty rectangular oak tray with a raised rim, filling the canvas.', 1536, 1024, 'opaque'),
 F('ruler-blank', 'Exactly front on: one long strip of polished oak like a ruler, filling the canvas edge to edge horizontally, with no marks, no numbers and no ticks.', 1536, 256, 'opaque'),
 F('clock-blank', 'Exactly front on: one round wall clock with a thick oak rim and a plain cream face, perfectly circular. No numerals, no tick marks, no hands.', 1024, 1024),
 F('lawh', 'Exactly front on, perfectly vertical: a traditional wooden writing tablet (a lawḥ) used by children learning to write in the Muslim world. A smooth pale wood board with softly rounded corners, a small rounded handle at the top with a hole, and a faint chalky wash on the surface. Completely blank.', 1024, 1280),
 F('sand-tray', 'Exactly top down: one shallow wooden tray filled with smooth pale fine sand, with no marks in the sand, filling the canvas edge to edge.', 1024, 1280, 'opaque'),
 T('tex-walnut', 'Dark walnut wood.'),
 T('tex-oak', 'Warm light oak wood.'),
 T('tex-parchment', 'Warm cream handmade paper with soft fibres.'),
 T('tex-plaster', 'Soft warm white plaster.'),
 T('tex-midnight', 'Very dark midnight blue glazed surface with an extremely subtle and low-contrast eight-fold geometric relief. Must stay dark and quiet enough for white text on top.'),
 T('tex-carpet', 'Soft deep red woollen carpet.'),
 T('tex-ice', 'Smooth pale blue ice.'),
])

batch('06-science', 'Science',
 'Plant stages must be one matched series: generate plant-0 first and use it as the reference, keeping the identical pot, size and framing across every stage.', [
 F('plant-0', POT + ', with nothing growing yet.', 768, 1024),
 F('plant-1', POT + ', with a tiny two-leaf sprout.', 768, 1024),
 F('plant-2', POT + ', with a young stem and four leaves, a quarter of the way up the canvas above the pot.', 768, 1024),
 F('plant-3', POT + ', with a healthy plant and eight leaves, reaching halfway up the canvas.', 768, 1024),
 F('plant-4', POT + ', with a tall thriving plant with many deep green leaves, reaching near the top of the canvas.', 768, 1024),
 F('wilt-1', POT + ', with cracked dry soil and a small sprout just starting to droop.', 768, 1024),
 F('wilt-2', POT + ', with cracked dry soil and a short plant with drooping pale yellow leaves.', 768, 1024),
 F('wilt-3', POT + ', with cracked dry soil and a collapsed brown wilted stem.', 768, 1024),
 S('bg-window', 'A sunny interior sill beside a bright window with a soft view of sky. Warm light falling on an empty sill in the lower third.', 1024, 1024),
 S('bg-cupboard', 'The inside of a dark wooden cupboard, with one empty shelf in the lower third and almost no light.', 1024, 1024),
 F('moon-disc', 'A photoreal full moon filling 96% of the canvas, perfectly round and centred, evenly front lit, with real maria and craters visible and no shading on one side. Background transparent.', 1024, 1024),
 F('sun-disc', 'A photoreal glowing sun disc, soft golden white, perfectly round and centred, filling 60% of the canvas, with a soft corona fading to fully transparent.', 1024, 1024),
 T('earth-map', 'A photoreal cloud-free Earth surface texture in equirectangular projection (2:1, with the full world from -180 to 180 longitude), with blue oceans and natural green and tan land. No borders, no grid, no labels. It need only tile left to right. It will be wrapped on a sphere.', 2048, 1024),
 O('bulb-off', BULB + ', switched off.'),
 O('bulb-on', BULB + ', switched on, with the filament glowing warm white and the glass softly lit. No glow outside the glass.'),
 O('battery', 'One large cylindrical battery lying on its side, black and copper, with no text and no symbols.'),
 F('switch-open', SWITCH + ', with the brass lever raised open.', 768, 512),
 F('switch-closed', SWITCH + ', with the brass lever down, closed.', 768, 512),
 S('water-cycle', 'A wide clear landscape showing the whole water cycle, with no labels: a sunlit sea on the left with faint vapour rising, a white cloud bank above the middle turning to a grey rain cloud over a mountain on the right, rain falling on the peak, and a river running from the mountain back down to the sea. Keep generous empty sky.'),
 O('pinhole-box', 'One small cardboard box with a tiny round hole in the front face and a piece of translucent paper at the back. A homemade camera obscura.'),
])

batch('07-seerah', 'The life of the Prophet ﷺ, told through places',
 'Nobody appears in any of these, at all, not even far away. Historic 7th century Arabia: low mud-brick and stone, palm wood, no modern building. Generate s02-makkah-dawn first and use it as the reference for light and palette.', [
 S('s01-elephant', 'A rocky valley near Makkah under a vast sky. A great flock of small dark birds crosses the sky, seen from far below. The plain dark Kaʿbah is tiny in the distance. No army, no elephant, no people, nothing violent.'),
 S('s02-makkah-dawn', 'The valley of old Makkah at dawn: low mud-brick houses among dark rocky hills, smoke rising from one roof, and a plain dark Kaʿbah with no gold and no writing at the centre of the valley. Quiet and tender.'),
 S('s03-shepherd', 'A rocky hillside at golden hour, with a small flock of sheep grazing, all seen from behind and far away with no faces visible. A wooden staff leans on a rock. No person.'),
 S('s04-trust', 'A simple mud-brick room at night, with a small oil lamp on a wooden chest and several cloth-wrapped bundles and small chests stacked neatly, as if entrusted for safekeeping.'),
 S('s05-cloth', 'At the foot of a plain dark stone wall, a large plain cloth spread flat on clean sand, its four corners stretched out neatly, in soft morning light. Nothing on the cloth.'),
 S('s06-hira', 'A steep dark mountain at night under a rich field of stars, with a small dark cave opening high up near the summit and a narrow path leading to it. No beam of light, no glow from the cave, no figure.'),
 S('s07-home-lamp', 'The warm doorway of a small Makkan home at night, with an oil lamp lit inside and a folded woollen blanket on a low seat. It feels like comfort and safety.'),
 S('s08-patience', 'A hot sun-baked desert of pale stones under a white noon sky, with one narrow worn path disappearing into the distance. Hard but not frightening.'),
 S('s09-taif', 'The green terraced orchards and vines of Ṭāʾif, with a stony path running out of them towards dry hills in late afternoon light.'),
 S('s10-two-mountains', 'A small quiet town in a valley at dusk between two enormous dark mountains that rise on either side, with lamps just lit in the town.'),
 S('s11-thawr', 'The narrow dark mouth of a mountain cave at night under stars, with two sets of faint sandal prints in the dust leading to it. No spider web, no bird, no figure.'),
 S('s12-road', 'A moonlit desert at night with one faint trail of camel tracks winding over the dunes towards a far line of palm trees on the horizon. No camel and no rider.'),
 S('s13-masjid-madinah', 'The first simple masjid in Madinah in morning sun: low mud-brick walls, a roof of palm fronds on palm-trunk pillars, an open sandy courtyard, and date palms all around. Humble and bright. No dome, no minaret.'),
 S('s14-badr', 'The wide sandy valley of Badr at first light, with low dunes, a few rough wells and calm stillness. No armies, no weapons, no banners.'),
 S('s15-return', 'The valley of Makkah on a clear bright morning seen from a hill, with the plain Kaʿbah at the centre, peaceful and empty streets, and every door open. No idols shown, no armies.'),
 S('s16-farewell', 'The plain of ʿArafah at sunset, with a small rocky hill and long rows of simple pale tents stretching away, and a golden sky. Peaceful and vast.'),
 F('map-arabia', 'A beautiful top-down antique map of western Arabia on warm parchment, north at the top: the Red Sea in soft blue-green along the left, the land in warm sand tones with hand-shaded mountains along the coast. The area runs from about latitude 19 to 33 north. Completely unlabelled: no text, no place names, no pins, no compass letters, no border text.', 1024, 1024, 'opaque'),
])

batch('08-adab-dua', 'Good character and daily duʿāʾ, as still lifes',
 'Tell the moment with objects only, and no person or hand. Style O, but each may be a small arrangement of objects sitting together as one group.', [
 O('adab-salam', 'An open wooden front door with warm light spilling out, and a pair of small shoes neatly placed by the step.'),
 O('adab-eating', 'A low round tray with a shared dish, a piece of bread and a few dates, set neatly and ready to begin.'),
 O('adab-truth', 'A ceramic cup broken into three pieces on the floor beside a small dustpan and brush, ready to be tidied.'),
 O('adab-parents', 'A small stack of clean plates beside a folded tea towel, freshly done, with a cup of tea set down as if for someone.'),
 O('adab-anger', 'A small tower of plain wooden blocks that has just been knocked over.'),
 O('adab-mercy', 'A small bowl of water and a few crumbs on a stone step, with one small bird silhouette from behind drinking at the edge.'),
 O('adab-smile', 'A single bright yellow wild flower growing up through a crack in dry ground, cheerful and small. No face.'),
 O('adab-harm', 'A thorny branch lying across a narrow dirt path.'),
 O('adab-love', 'A small plate with two dates on it, one nudged forward, as if offered.'),
 O('adab-speech', 'A child\'s rough crayon drawing of hills and a sun on a sheet of paper, with crayons beside it. No faces and no writing in the drawing.'),
 O('adab-sneeze', 'A small box of soft tissues with one tissue pulled up. No writing on the box.'),
 O('adab-gentle', 'A small wooden toy shared between two sides: a wooden pull-along train with a string. Simple, no face on it.'),
 O('adab-constant', 'A glass jar nearly full of water with a single drop falling into it from above, with ripples.'),
 O('adab-knowledge', 'An open book on a small wooden desk with an oil lamp, its blank pages lit warmly.'),
 O('dua-wake', 'A window with its shutter opening on soft morning light, and a rumpled small blanket on a sill.'),
 O('dua-sleep', 'A small neatly made bed seen from the side, with a crescent moon visible through a small arched window behind it.'),
 O('dua-food', 'A simple bowl of food with a spoon and a round of bread beside it.'),
 O('dua-home', 'A small arched front door, half open, with a brass ring handle and a pair of sandals.'),
 O('dua-toilet', 'A small clean washbasin with a brass tap, soap and a folded towel, neat and modest.'),
 O('dua-dress', 'A neatly folded child\'s garment in soft cream on a wooden stool.'),
 O('dua-rain', 'A rain-streaked arched window seen from inside, with a soft green garden blurred outside.'),
 O('wudu-hands', 'Two small hands held together under a thin stream of water pouring from a brass jug. Hands only, warm medium skin tone, no arms beyond the wrists.'),
 O('wudu-arm', 'One small forearm from wrist to elbow, with water running over it from a jug. No person beyond the elbow.'),
 O('wudu-feet', 'Two small bare feet on a stone step with water pouring over them from a jug. No legs beyond the ankles.'),
])

MED = 'A perfectly round medallion, the whole circle filling the canvas and everything outside it transparent, with a thin polished gold rim. Inside, a small photoreal landscape of low desert hills and one tiny distant masjid, showing the sky at {t}. No people.'
batch('09-moments', 'Prayer times and big moments',
 'Medallions must share the same hills and masjid, changing only the sky.', [
 F('time-fajr', MED.format(t='Fajr: deep indigo with a thin pale line of first light along the horizon and a few stars'), 768, 768),
 F('time-dhuhr', MED.format(t='Ẓuhr: bright blue noon with the sun high overhead'), 768, 768),
 F('time-asr', MED.format(t='ʿAṣr: warm afternoon with the sun lower to the west and longer shadows'), 768, 768),
 F('time-maghrib', MED.format(t='Maghrib: ember orange just after the sun has set'), 768, 768),
 F('time-isha', MED.format(t='ʿIshāʾ: deep night full of stars'), 768, 768),
 S('welcome-night', 'A long corridor of pointed stone arches at night, seen straight on and receding, with warm golden light glowing at the far end of the corridor. Deep midnight blue shadows. The centre is kept open and dark enough for a key, a lock and white text on top. Portrait.', 1024, 1536),
 S('day-done', 'A green garden at the end of the day with long golden light. A ball on the grass and an open gate leading outside. It invites you to go out and play. Nobody present.'),
 S('rest', 'A shady spot under a date palm with a woven mat, a cup of water and a few dates in soft afternoon light. It says: that is enough screen for now.'),
])

batch('10-store', 'App icon and Play Store',
 'Same key as key-forged.', [
 F('icon-foreground', KEYD[0].upper() + KEYD[1:] + ', in warm satin brass, tilted 35 degrees, fully inside the central 60% of the canvas (the outer 20% on every side must be empty). Transparent background.', 1024, 1024),
 T('icon-background', 'A deep midnight blue radial glow, brighter behind the centre, fading to near black at the edges. Smooth, with no pattern. Need not tile.'),
 S('feature-graphic', 'Wide banner: a gold key turning in the carved dark walnut doors, which are opening a crack in the centre with warm golden light spilling out across midnight blue shadow. No text.', 1024, 500),
])

items = []
for bid, title, how, its in B:
    for n, w, h, st, bg, subj in its:
        items.append({'batch': bid, 'name': n, 'file': n + '.png', 'width': w, 'height': h, 'style': st, 'background': bg, 'subject': subj})
names = [i['name'] for i in items]
assert len(names) == len(set(names)), [n for n in names if names.count(n) > 1]
json.dump({'count': len(items), 'items': items}, open(os.path.join(HERE, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


# Only what code cannot draw convincingly. In generation order: name, reference image, what it is for.
KEEP = [
 ('key-forged', None, 'The signature key, on every completed lesson and the key ring. Sets the look of every object below.'),
 ('key-front', 'key-forged', 'The same key straight on, turned by the child in the lock and in the door opening.'),
 ('lock-hero', 'key-forged', 'The lock plate for the first-run gesture and the door opening.'),
 ('door-pair', 'key-forged', 'The carved doors that swing open between screens.'),
 ('court-fg-day', None, 'The home screen building by day. Code draws the sky, sun and clouds behind it.'),
 ('court-fg-night', 'court-fg-day', 'The same building at night, with lit arches. Code draws the real moon and stars.'),
 ('date', 'key-forged', 'The main counting object in maths.'),
 ('apple', 'key-forged', 'A second counting object.'),
 ('leaf', 'key-forged', 'Counting and science.'),
 ('palm', 'key-forged', 'Stories, Arabic words and science.'),
 ('tree', 'key-forged', 'Arabic words and science.'),
 ('sheep', 'key-forged', 'The seerah and science. Must have no visible face.'),
 ('camel', 'key-forged', 'The seerah and Arabic words. Must have no visible face.'),
 ('rehal', 'key-forged', 'The Qurʾān stop on the daily path and the Qurʾān room.'),
 ('s02-makkah-dawn', None, 'Seerah: the early life stories. Sets the look of the other three scenes.'),
 ('s06-hira', 's02-makkah-dawn', 'Seerah: the first revelation.'),
 ('s12-road', 's02-makkah-dawn', 'Seerah: the Hijrah.'),
 ('s13-masjid-madinah', 's02-makkah-dawn', 'Seerah: building Madinah.'),
 ('moon-disc', None, 'The real moon, in the night sky and the moon lesson. Code applies the phase.'),
 ('tex-oak', None, 'Wood for the maths tools: trays, ten-frame, ruler and clock, which code cuts and assembles.'),
]
GREENKEY = {'apple'}
BODY = set()
def ratio(w, h):
    from math import gcd
    g = gcd(w, h); return '%d:%d' % (w // g, h // g)
def rules(n, st):
    hist = ' No modern objects.' if st == 'S' else ''
    return 'Strict rules: absolutely no text, letters, numerals, calligraphy or Arabic-looking script anywhere. No faces, eyes or mouths on anything. No people or human silhouettes. No prophets, angels or holy figures, and no glowing figures. No musical instruments, bells, dolls, idols, crosses, six-pointed stars, crescent finials, alcohol, pigs, weapons or blood.' + hist
def output(n, w, h, bg):
    head = 'Output: one image, %d x %d pixels (aspect ratio %s), larger is welcome. ' % (w, h, ratio(w, h))
    if bg == 'opaque': return head + 'It fills the canvas to every edge, with no border and no vignette.'
    k = 'pure green #00FF00' if n in GREENKEY else 'pure magenta #FF00FF'
    return head + 'Transparent background with real alpha and clean edges. If transparency is not possible, use a perfectly flat %s background with no shadow, gradient or glow.' % k
ALL = {it[0]: (b[0], it) for b in B for it in b[3]}
items = []
for n, ref, use in KEEP:
    bid, (nm, w, h, st, bg, subj) = ALL[n]
    subj = re.sub(r' Reject if [^.]*\.', '', subj).strip()
    out = output(n, w, h, bg)
    if n.startswith('court-fg'):
        subj = subj.replace('Everything above the skyline is fully transparent, so the sky is empty alpha.', 'Everything above the skyline is one perfectly flat pure magenta #FF00FF, right up to the edges of the building, hills and palms, with no sky, no halo, no glow and no gradient. No pink or magenta anywhere in the scene, and no flowers.').replace(' Sky fully transparent.', '')
        out = 'Output: one image, %d x %d pixels (aspect ratio %s), larger is welcome. It fills the canvas to every edge. The only thing above the skyline is the flat magenta.' % (w, h, ratio(w, h))
    prompt = subj + '\n\n' + STYLE[st] + '\n\n' + rules(n, st) + '\n\n' + out
    items.append({'name': n, 'file': n + '.png', 'width': w, 'height': h, 'style': st, 'background': bg, 'reference': ref, 'use': use, 'prompt': prompt})
json.dump({'count': len(items), 'items': items}, open(os.path.join(HERE, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open(os.path.join(HERE, 'prompts.jsonl'), 'w', encoding='utf-8') as f:
    for i in items: f.write(json.dumps({k: i[k] for k in ('name', 'file', 'width', 'height', 'background', 'reference', 'prompt')}, ensure_ascii=False) + '\n')
DONE = {'key-forged'}
md = ['# Miftāḥ image prompts\n', '**%d images, %d already done.** Everything else in the app is drawn in code.\n' % (len(items), len(DONE))]
md.append("""## How to run this

Miftāḥ is a private Islamic homeschool app for Muslim children aged 2 to 11. These images should feel modern, realistic and precious. Each prompt below is complete on its own: paste one prompt, get one image, and save it under the name shown.

1. **Go in order.** `key-forged` is already accepted and sets the look for the objects. `court-fg-day` and `s02-makkah-dawn` set the look for their groups, so approve those before moving on. Where a prompt names a **Reference**, attach that image if your model allows it.
2. **Check each image.** Regenerate if you see any text or fake Arabic, any face or eye (look closely at the sheep and camel), any person, however small, or anything cropped at the edge.
3. **Save as PNG** using the exact name shown. Transparent where the prompt says so. If your model can't do transparency, the prompt gives a flat background colour to use, and I remove it.
4. **Zip them, with no subfolders needed,** as `miftah-art.zip`, and put the zip here, then tell me:

```text
C:\\Projects\\Islamic Apps\\Miftah\\art-inbox\\
```

If your model can't do an exact size, use its nearest aspect ratio at 1024 pixels or more on the long side. I crop or pad to fit.

## The images

| # | Name | Size | Used for |
|---|---|---|---|""")
for k, i in enumerate(items, 1):
    md.append('| %d | `%s`%s | %d×%d | %s |' % (k, i['name'], ' (done)' if i['name'] in DONE else '', i['width'], i['height'], i['use']))
md.append('\n## The prompts\n')
for k, i in enumerate(items, 1):
    ref = ' · **Reference:** `%s`' % i['reference'] if i['reference'] else ''
    if i['name'] in DONE: ref += ' · **Already done, skip this one**'
    md.append('### %d. `%s`\n\nSave as `%s`%s\n\n```text\n%s\n```\n' % (k, i['name'], i['file'], ref, i['prompt']))
open(os.path.join(HERE, 'MIFTAH-IMAGE-PROMPTS.md'), 'w', encoding='utf-8').write('\n'.join(md))
print(len(items), 'images, longest prompt', max(len(i['prompt']) for i in items), 'chars')
