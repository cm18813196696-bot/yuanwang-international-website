# Stainless steel pool studio — 8 November 2026

Status: published to the original website and verified. Earlier checkpoint commits preserve implementation and visual-review stages.

Base: 21e37330757af940d006e7d74b630a428e4a4dfc on the original main branch.

## Scope

- Refine the existing stainless pool geometry: rounded suite-pool grab rails, a fine shell reveal, recessed jet outlets and a drain-cover ring.
- Add named close-up camera views for the rim, seating, jets and drain. Interior detail views hide water and pause rotation.
- Preserve model, finish, water and camera selections when switching between the film and live model.
- Use a pale studio background and retain the supplied catalogue, its 13 boards and 66 reference images.
- For browsers without WebGL2, render the same website geometry into a full view and four detail views. Keep the existing product film available.

The source catalogue boards were visually reviewed: steel-shell-01 and steel-features-01 through 03. They contain concept imagery, including examples with rails, seats, drains and steel finishes. The model remains a concept illustration; dimensions, fittings and safety provisions follow approved project drawings.

## Reproduce rendered views

```sh
node tools/export-steel-studio.mjs /absolute/path/geometry.json
blender -b -t 6 -P tools/render-steel-studio.py -- /absolute/path/geometry.json /absolute/path/render-output
```

The exporter uses the production model's actual geometry and camera definitions. CPU renders use studio softboxes and reflection cards. Package the five PNG renders with Pillow and NumPy:

```sh
python tools/package-steel-renders.py /absolute/path/render-output assets/collections/steel-studio
```

Packaging suppresses Monte Carlo grain while preserving model edges and converts the views to WebP.

## Validation completed before publication

- Both changed frontend JavaScript files pass Node syntax checks.
- All 64 HTML files retain valid local asset and fragment references.
- All exported mesh vertices, indices, instance matrices and five camera views pass structural and finite-number checks.
- The current preview browser has no WebGL2 support. All four rendered detail views, Overview and film return were browser-verified; real-time GPU rendering and its finish/variant controls remain unverified in this browser.

- All five rendered views were visually reviewed. The dry-shell floor is closed and jet bezels no longer intersect the local pool wall.
- Five 1200 × 900 WebP views total 385,726 bytes.
- The original 13 steel catalogue boards, category filtering and image-viewer modal were retained and checked. The signature product page still renders its fallback film.
- Reproducible export, CPU-render and packaging scripts are included.

## Next checkpoint

Continue with one bounded improvement to the signature-product studio. Direct Douyin/Xiaohongshu profile links and custom domains remain separate outstanding tasks.

Visual QA found an open centre at the dry-shell floor and jet bezels intersecting non-circular walls. The floor is now closed to the centreline, and jet fittings use the local contour normal with an inward mounting offset. The affected renders were regenerated and visually reviewed before publication.

## Publication receipt

- Published source commit: b65ce89119094c226151973f0c246eb15ee3a90c
- Source tree: c8c3084cfcf900ed6ba9383e8059a2398d360ceb
- Render deployment: dep-dbo44jo473hc73a6lda0
- Deployment reached live: 8 November 2026, 09:35:50 UTC / London time.
- Public page: https://yuanwang-international-preview.onrender.com/products-steel.html#model
- The existing five-minute HTML cache expired; at 09:41:48 UTC the public HTML exactly matched the saved source and contained all four inspection buttons.
- The versioned JavaScript, model module, stylesheet and all five WebP views exactly matched the saved source (eight asset checks, plus HTML).
- The public browser displayed the new studio; the Jets button selected its detail view and the image loaded at its full 1200-pixel width. A public-page proof image was captured for the user.
- Real-time GPU rendering remains unverified in the current browser, which lacks WebGL2. The rendered fallback, preview detail switching, film return and catalogue interactions were verified.

This archive update records deployment evidence only; the deployed main commit remains b65ce89119094c226151973f0c246eb15ee3a90c.
