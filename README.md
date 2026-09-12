# Kopitiam Lab

One interactive Singapore drinks counter combining 16 Kopi, 9 Teh and 9 Milo orders, with an interactive kaya toast and soft-boiled egg breakfast scene.

## Use the app
Choose Kopi, Teh or Milo, select an order, and press **Make this drink**. Pause, replay or scrub the timeline. Select **Stirred** to watch the spoon swirl the layers before blending their colours. Drag to rotate the glass and scroll to zoom.

All three categories use visible jug liquid, ingredient-specific streams, corrected external handles, impact ripples and staged stirring. Milo adds spooned powder and a Dinosaur topping. The Kopi and Teh guides appear under Reference guides. The Milo reference image is omitted.

## Make a Nanyang breakfast
Scroll to the breakfast scene and select **Make this breakfast**. Two soft-boiled eggs crack into the bowl, followed by soya sauce and white pepper. The twelve-second sequence supports pause, replay, speed selection and backward or forward scrubbing. Step buttons inspect each action; Reset restores the eggs and camera. Drag to orbit the meal. Choosing Kopi, Teh or Milo also changes the cup beside the toast. Playback begins only when requested; offscreen scenes pause.

## Run locally
Extract `kopitiam-lab-source.zip`, enter its `kopitiam-lab` folder and run:

```sh
python3 -m http.server 8000
```

Windows: `py -m http.server 8000`. Open http://localhost:8000. Do not open index.html directly because browser ES modules need HTTP. No build or package installation is required; Three.js 0.180.0 is included.

## Files
- `main.js`: shared scene, category switching, timeline and mixing state.
- `recipes.js`: normalised recipe data and category metadata.
- `data/kopi.js`, `data/teh.js`, `data/milo.js`: original recipe tables.
- `pouring.js`: jug, visible liquid and curved streams.
- `stirring.js`: spoon, spiral ribbons and delayed colour blending.
- `breakfast-scene.js`: procedural toast, porcelain, eggs, shell halves, sauce and pepper.
- `breakfast.js`: meal playback, camera, step controls and drink pairing.
- `handles.js`: corrected external jug and glass handle geometry.
- `style.css`, `index.html`: responsive interface and culture section.
- `DESIGN.md`: implementation and limitations.
- `DEPLOYMENT.md`: GitHub Pages instructions.

## Notes
Amounts and ordering conventions are illustrative; shops vary. The Kopi Kosong condensed-milk interpretation follows the supplied guide and retains its qualification. Milo powder contains sugar and milk ingredients. Water is tinted blue only for the separated educational view.

The breakfast animation depicts eggs that are already soft-boiled; it is an illustration, not a cooking or nutrition guide. Sources: https://en.wikipedia.org/wiki/Kaya_toast and https://www.cntraveler.com/story/why-you-should-eat-kaya-toast-in-singapore

This independent project is not affiliated with Naumi, Ya Kun or Nestlé. MILO is a Nestlé trademark. User-supplied reference images retain their respective rights; check permission before redistributing them publicly.
