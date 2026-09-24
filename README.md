# Kopitiam Lab

One interactive Singapore drinks counter combining 16 Kopi, 10 Teh, 9 Milo and 12 Others orders, with an interactive kaya toast and soft-boiled egg breakfast scene.

## Use the app
Choose Kopi, Teh, Milo or Others, select an order, and press **Make this drink**. Pause, replay or scrub the timeline. Select **Stirred** to watch the spoon swirl the layers before blending their colours. Drag to rotate the glass and scroll to zoom.

All four categories use visible jug liquid, ingredient-specific streams, corrected external handles, impact ripples and staged stirring. Milo adds spooned powder and a Dinosaur topping. The Kopi, Teh and Higgsfield-generated Others guides appear under Reference guides. The Milo reference image is omitted.

## Display language
Use **English / 中文 / 日本語** in the header to switch between English, Simplified Chinese and Japanese. The interface, recipes, animation labels and accessibility text change without resetting your selection or playback. The browser remembers your choice when local storage is available. Original ordering names are retained beside translations; supplied reference images and downloadable documents remain in their original languages.

Translation coverage check: `node tests/translations.mjs`.

## Make a Nanyang breakfast
Scroll to the breakfast scene and select **Make this breakfast**. Two soft-boiled eggs crack into the bowl, followed by soya sauce and white pepper. The twelve-second sequence supports pause, replay, speed selection and backward or forward scrubbing. Step buttons inspect each action; Reset restores the eggs and camera. Drag to orbit the meal. Choosing a drink also changes the pairing label and cup colour beside the toast. Playback begins only when requested; offscreen scenes pause.

## Run locally
Extract `kopitiam-lab-source.zip`, enter its `kopitiam-lab` folder and run:

```sh
python3 -m http.server 8000
```

Windows: `py -m http.server 8000`. Open http://localhost:8000. Do not open index.html directly because browser ES modules need HTTP. No build or package installation is required; Three.js 0.180.0 is included.

## Files
- `main.js`: shared scene, category switching, timeline and mixing state.
- `recipes.js`: normalised recipe data and category metadata.
- `data/kopi.js`, `data/teh.js`, `data/milo.js`, `data/others.js`: original recipe tables.
- `pouring.js`: jug, visible liquid and curved streams.
- `garnishes.js`: citrus slices, preserved plum, barley grains and lemongrass stalks.
- `stirring.js`: spoon, spiral ribbons and delayed colour blending.
- `breakfast-scene.js`: procedural toast, porcelain, eggs, shell halves, sauce and pepper.
- `breakfast.js`: meal playback, camera, step controls and drink pairing.
- `handles.js`: corrected external jug and glass handle geometry.
- `style.css`, `index.html`: responsive interface and culture section.
- `DESIGN.md`: implementation and limitations.
- `DEPLOYMENT.md`: GitHub Pages instructions.

## Notes
Amounts and ordering conventions are illustrative; shops vary. The Kopi Kosong condensed-milk interpretation follows the supplied guide and retains its qualification. Teh Kosong uses the same illustrative convention: condensed milk with no extra sugar; the condensed milk is still sweetened. Milo powder contains sugar and milk ingredients. Water is tinted blue only for the separated educational view.

The breakfast animation depicts eggs that are already soft-boiled; it is an illustration, not a cooking or nutrition guide. Sources: https://en.wikipedia.org/wiki/Kaya_toast and https://www.cntraveler.com/story/why-you-should-eat-kaya-toast-in-singapore

This independent project is not affiliated with Naumi, Ya Kun or Nestlé. MILO is a Nestlé trademark. User-supplied reference images retain their respective rights; check permission before redistributing them publicly.

## Other kopitiam drinks
The Others menu follows [Kaffe & Toast’s beverage menu](https://www.kaffeandtoast.sg/menus?menu=kaffe--toast-menu): Yuan Yang, Yuan Yang C, Iced Yuan Yang, Thai Iced Milk Tea, Iced Plum Lime Juice, Iced Lemon Tea, Barley Drink, Barley Lemon Drink, Honey Drink, Honey Lemon Drink, Lemongrass Drink and Chinese Tea. Quantities, garnishes and temperatures are educational approximations, not official recipes. The existing Kopi, Teh and Milo drinks remain in their categories; mineral water and soft drinks are excluded.

`assets/others.png` was generated with Higgsfield on 2026-09-24 (job `3dc83e5f-14d6-47dc-865c-0c4c077ecf97`). The reference artwork depicts serving examples and remains in English. Drink names, ingredients and controls support all three interface languages.

Run all checks: `for t in tests/*.mjs; do node "$t" || exit 1; done`.

## Singapore’s Hawker Table
Use **Food culture** in the navigation to explore 20 dishes and food traditions selected from [Migrationology’s Singapore food guide](https://migrationology.com/singapore-food/). Filter the cards, then expand one for ingredients, flavour and a short cultural note. Kaya Toast Breakfast links back to the interactive breakfast scene. English, Chinese and Japanese are supported through the existing language switch.

`data/food.js` holds the catalogue and translations; `food.js` renders native expandable cards. Six Higgsfield-generated sheets (`assets/food-1.png` through `food-6.png`) provide 24 illustrations, displayed as individual quadrants with CSS. The existing breakfast illustration completes the collection. These are static 3D-style illustrations, not rotatable models. Ingredients and preparation vary; the cards are a cultural introduction, not official recipes or dietary guidance.

Additional context: [National Heritage Board, Serving Up a Legacy](https://www.roots.gov.sg/stories-landing/stories/Serving-Up-a-Legacy) and [Singaporean cuisine](https://en.wikipedia.org/wiki/Singaporean_cuisine). Original concise descriptions are used; restaurant prices and opening hours are not reproduced.

Higgsfield generation jobs (2026-09-24), in sheet order: `9cf9d9ad-6c0a-4b9f-b35a-8e74288b7b2d`, `0c1797b5-fabf-44ff-bd98-0d5998faa645`, `fee7e207-73c8-45f1-affa-b3e9b33b2fbe`, `6675543b-c2fc-4229-933f-550de6bdc50e`, `7d23feb4-bc23-4cbc-950d-06dc7b1c47fc`, `51465559-1dee-4bd1-b5fa-95673dc753e4`.

Check the catalogue, filters and translations with `node tests/food-culture.mjs`.

The interactive kitchen adds 19 procedural Three.js dishes alongside the breakfast scene. Choose a dish or use **Prepare in 3D** on its card; rotate, zoom, play/pause, select a step or scrub the four-stage timeline. `data/preparations.js` holds the sequences, `food-scene.js` builds the geometry, and `food-kitchen.js` handles playback. Models are stylized illustrations; sequences may use prepared ingredients and do not represent cooking times. Rendering pauses offscreen and one dish is kept in memory. Run `node tests/food-scene.mjs` for stage, reset, replay and disposal checks.

Food models also use shared irregular geometry, detailed rice grains and prawns, meat fibres, charred satay, and a small procedural bump/roughness texture. These refinements are authored directly in Three.js, not generated Blender assets. Scene checks verify that displayed geometry, materials and surface textures are disposed exactly once when changing dishes.

Fish head curry: the standalone card `assets/fish-head-curry.png` was generated with Higgsfield from the supplied reference (job `fd42a693-f218-4c8a-8e06-533badbcfc23`). The interactive head was authored through Blender MCP; `assets/fish-head.blend` retains the editable scene and `scripts/build-fish-head.py` regenerates its indexed Three.js mesh in `assets/fish-head-model.js`. The model remains stylized; the card is a separate detailed illustration.
