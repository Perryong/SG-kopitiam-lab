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
