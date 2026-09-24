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
