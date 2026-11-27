# STAVSJÖ checkpoint — 27 Nov 2026

## Live
- Product site: https://www.joypoool.com (Render `stavsjo-joypoool`, root `stavsjo/`). Old address yuanwangspa.com/stavsjo/ forwards to it.
- Company site: https://www.yuanwangspa.com (Render `yuanwang-international-preview`, repo root).
- Google Search Console: domain property `joypoool.com` verified (TXT record at Alibaba Cloud — keep it), sitemap submitted.
- Quote form → Formspree `mppdonbj` → chenming20020808@gmail.com (tested 24 Nov). Google Analytics hook ready but off until a G- ID is set in `stavsjo/js/site-config.js` (then also update the privacy "Cookies" paragraph).

## Done (24–27 Nov)
- 3D studio rebuilt on three.js r170 with real Poly Haven HDR environments and textures (CC0), PBR steel/water/glass, shadows. Old renderer kept as fallback.
- Share-a-design links (`?p=…&e=…#studio`), also included in quote requests.
- Trimmed letterboxed photos, new hero poster, consistent project counts, verifiable salt-spray figure.
- Company site: "Ruilinwan" spelling unified; customer-facing project archive wording.
- Blender (Cycles) product stills, six in total, on the Design Studio page as labelled design renderings: wave bathtub (studio), crescent waterfall spa (garden), teardrop spa (beach), brushed hot tub with steam (snowy forest), bronze octagonal tub (garden), glass-front spa (rooftop at dusk).

## Blender pipeline (tools/blender)
1. Export GLBs with `export.html` (see comment in the file).
2. `blender -b -P render.py -- glb=… hdri=<dir with light.hdr + bg-8k.jpg> out=… rot=… dist=… aim=… lens=… h=1.6 yaw=… ground=<tex id> tex=<stavsjo/tex>`
   Camera stands at the panorama's capture point (h ≈ 1.6 m), so the photographed ground lines up; product shadow via shadow catcher; a glossy-only textured ground fixes blurry nadir reflections.
3. 8k tonemapped JPGs are not in the repo (≈9 MB each); download from Poly Haven again if needed.

## Open / next
- render.py options added 27 Nov: steam=<radius,water height> steamd=<density> (volumetric steam), bevel=0|1 (3 mm edge bevel; turn off for large flat box panels — it caused shading triangles on the glass spa), brushed grain on brushed steel.
- Possible next renders: hydromassage lounge pool, swimming pool, sauna (needs an interior or a model with walls).
- Interior HDRIs distort when ground-projected; a modelled interior or Blender renders are the better route for indoor scenes.
- Still waiting from Ming: Google Analytics ID; real product photos; product spec data; certifications; trade terms; testimonials.
