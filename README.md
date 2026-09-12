# Kopitiam Lab

One interactive Singapore drinks counter combining 16 Kopi, 9 Teh and 9 Milo orders, with a short introduction to kaya toast and soft-boiled eggs.

## Use the app
Choose Kopi, Teh or Milo, select an order, and press **Make this drink**. Pause, replay or scrub the timeline. Select **Stirred** to watch the spoon swirl the layers before blending their colours. Drag to rotate the glass and scroll to zoom.

All three categories use visible jug liquid, ingredient-specific streams, corrected external handles, impact ripples and staged stirring. Milo adds spooned powder and a Dinosaur topping. The Kopi and Teh guides appear under Reference guides. The Milo reference image is omitted.

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
- `handles.js`: corrected external jug and glass handle geometry.
- `style.css`, `index.html`: responsive interface and culture section.
- `DESIGN.md`: implementation and limitations.
- `DEPLOYMENT.md`: GitHub Pages instructions.

## Notes
Amounts and ordering conventions are illustrative; shops vary. The Kopi Kosong condensed-milk interpretation follows the supplied guide and retains its qualification. Milo powder contains sugar and milk ingredients. Water is tinted blue only for the separated educational view.

The breakfast section is introductory cultural content, not a cooking or nutrition guide. Sources: https://en.wikipedia.org/wiki/Kaya_toast and https://www.cntraveler.com/story/why-you-should-eat-kaya-toast-in-singapore

This independent project is not affiliated with Naumi, Ya Kun or Nestlé. MILO is a Nestlé trademark. User-supplied reference images retain their respective rights; check permission before redistributing them publicly.
# SG-kopitiam-lab
