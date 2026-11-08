# Stainless steel pool studio — 8 November 2026

Status: implementation checkpoint; rendered assets and visual verification pending. This checkpoint is not deployed.

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

## Checks so far

- Both changed frontend JavaScript files pass Node syntax checks.
- All 64 HTML files retain valid local asset and fragment references.
- All exported mesh vertices, indices, instance matrices and five camera views pass structural and finite-number checks.
- The current preview browser has no WebGL2 support. Its film fallback was observed; real-time GPU rendering is not verified here.

## Next checkpoint

Inspect the five rendered views, verify the fallback detail buttons and film return in the browser, and check shared product pages before publishing. Save the final source and deployment result here.

Visual QA found an open centre at the dry-shell floor and jet bezels intersecting non-circular walls. The floor is now closed to the centreline, and jet fittings use the local contour normal with an inward mounting offset. The affected renders are being regenerated before publication.
