# Shared counter design

The three original labs are combined into one Three.js scene. There are no embedded websites. The breakfast scene uses a separate canvas with its own camera and playback controls. Each category selects its own menu, accent colour, reference image and blended colour palette. The breakfast scene connects the drink explorer to kaya toast and eggs; both canvases suspend rendering when offscreen.

## Data and state
Each recipe has a globally unique category-prefixed ID and a complete numeric ingredient map. Missing ingredients become zero. Category switching clears filters, stops playback and resets mixing to a completed layered glass; the camera remains available to orbit. There are 34 unique recipes.

## Animation
Milk, brewed coffee, brewed tea and water share the pouring rig. The liquid pool drains inside the tilted jug; the stream begins at its transformed spout and ends at the rising surface. External handle curves avoid the former torus intersection. Powder and sugar use a spoon; ice drops into the drink. Milo Dinosaur retains its dry powder crown.

Stirring displays a spoon and coloured spiral ribbons before colours converge over 3.6 seconds. The spoon lifts by 4.1 seconds. Reduced motion skips this transition. This is an explanatory animation, not fluid dynamics. Layer volumes, ice displacement and mixed colours are illustrative.

## Breakfast animation
`breakfast-scene.js` constructs the meal using Three.js geometry: triangular toast sandwiches with kaya and butter layers, porcelain dishes, two soft-boiled eggs, and condiment bottles. `breakfast.js` manages a twelve-second timeline with four equal stages. The egg shells separate before the whites and yolks land in the bowl. The sauce stream starts at the transformed bottle nozzle. Pepper particles fall from the inverted shaker and settle on the egg surfaces. Ingredient positions depend on timeline progress, so replay and reverse scrubbing reconstruct the same state. No physics engine or external model files are required.

The initial view shows the finished meal. Animation starts on request. Step buttons and the range slider provide static inspection without playing the full sequence. The uploaded breakfast illustration is available in a collapsed reference section; the Milo reference remains removed. Geometry and food textures are stylized, not photorealistic.

## Optional agent interaction
If the browser supports document.modelContext, select_drink accepts a validated category-prefixed recipe ID and invokes the same selection functions as the UI. Unknown IDs fail before changing state. Unsupported browsers use the normal buttons.

## Verification
Checks cover all 34 recipes, category switching, playback, mixing, handle clearance, stream alignment and local asset references. `tests/breakfast.mjs` checks egg opening and landing, sauce alignment, pepper timing, finite geometry, replay and reverse scrubbing. Browser visual QA was not run for this combined build; the earlier managed browser reported WebGL disabled. Native WebMCP validation was unavailable; its callback is checked with the local state harness.

## Mobile canvas sizing fix
The breakfast canvas now uses explicit CSS pixel dimensions independently of its high-DPI drawing buffer. It is positioned inside a bounded panel, and grid children can shrink. This prevents intrinsic canvas dimensions from expanding the grid, clipping alternate step buttons and moving the meal beyond the visible panel. Resize handling ignores temporarily zero-sized panels. `tests/breakfast-viewport.mjs` executes the controller and the vendored Three.js sizing method without a GPU across 12 width/pixel-density combinations. Browser visual verification remains unavailable.

## Others category (September 2026)
The shared counter now has 47 recipes across four categories. Others adds six liquid ingredients to the existing pouring rig and five garnish types, with recipe-specific final colours. Garnish positions derive from preparation progress so replay and reverse scrubbing clear and restore them. Barley grains are shown at the surface to keep them visible above the opaque educational liquid. Drink selection also updates the breakfast pairing via one shared event, including selections through the optional structured tool.

The new Higgsfield guide is bundled locally as `assets/others.png`. Menu names follow Kaffe & Toast; recipes and garnishes are illustrative. The Others recipe/pouring and garnish checks are in `tests/others.mjs`; the translation check includes all new recipe and ingredient text.

Verification for this addition: all five Node check files pass. Browser checks selected and started preparation for every Others drink, checked Chinese/Japanese language switching and guide loading, and visually inspected citrus and barley garnishes. The browser reported no console errors.

## Hawker table setting (September 2026)
The dish kitchen now sits on a hawker-centre table instead of a plain disc. It has a terrazzo top with a green edge band, a steel pedestal, four stools fixed to the frame, chilli and soya saucers, chopsticks on a rest, a porcelain soup spoon, a tissue-packet "chope" and a kopi cup. The table was authored procedurally in Kiln (`scripts/hawker-table.kiln.js`, in metres). `scripts/build-hawker-table.py` imports the Kiln GLB into Blender and writes `assets/hawker-table-model.js` (10x scale, table top at y=0) and `assets/hawker-table.blend`. Props sit outside the widest vessel footprint (grill, wok handle, claypot handles). Bowls and pans now have a lower foot so they rest on the tabletop.

## Rice and noodles (September 2026)
Rice is a single instanced mesh of about 1,100 capsule grains packed over a moulded dome, with a darker core for the shadow between grains and a few loose grains on the plate. Chicken rice is tinted by the chicken fat; other plates use white rice. Noodles are long seeded strands that wander in a loose swirl over a heap, merged into one mesh per noodle type, with per-strand vertex colour. Laksa uses thick round bee hoon sunk into the broth; wanton mee and bak chor mee use thin curly egg noodles; char kway teow uses flat, twisting soy-stained ribbons; hokkien mee mixes yellow noodles with bee hoon. Both are generated deterministically, so replay and scrubbing are unchanged.

## Photo-referenced dishes (September 2026)
Nasi lemak's fried chicken, bak chor mee, rojak and sambal stingray were modelled in Kiln against Wikimedia Commons photographs. The references were ayam goreng berempah under its spice crumbs; mee pok with minced pork, liver, meatballs and braised shiitake; rojak coated in prawn-paste sauce under crushed peanuts; and a ridged stingray wing on banana leaf with sambal and calamansi. Sources are in `scripts/food-models/*.kiln.js`, authored in web-scene units, with each part name prefixed by its preparation step (`s2 Sambal`). Kiln's GLB export drops vertex colours, so `scripts/build-food-models.py` imports each GLB into Blender and paints noise-based browning, char, sauce mottling and leaf veins per ingredient. It then writes `assets/<dish>-model.js`. These modules are several hundred KB each, so `loadFoodModels()` imports them only when their dish is selected. Mee pok uses the flat-ribbon noodle generator. The same pipeline now covers orh luak (starchy batter, plump oysters, crisped lace), roast duck and char siu (layered meat, fat and lacquered skin; red-rimmed char siu), satay (turmeric skewers with char, peanut sauce, ketupat), ice kacang (beans and jellies, shaved-ice mountain, rose/pandan/gula melaka syrups, corn) and chilli crab (shell, claws, legs, egg-ribboned gravy, fried mantou). Char kway teow keeps its code-generated kway teow ribbons (wider, darker, with a few pale strands) under Kiln-modelled egg curds, lap cheong, a dark sauce glaze with wok-hei char, bean sprouts, chives and blood cockles. Murtabak has been removed from the catalogue and the kitchen, along with its dough, fold and bread-mark shapes; the page now lists 19 dishes.
