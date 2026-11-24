/* =====================================================================
   STAVSJÖ 3D — physically based renderer (three.js r170)
   - Real HDR panoramas (Poly Haven, CC0) for light, reflections and a
     ground-projected photographic background.
   - Sun direction found from the HDR; real soft shadows.
   - PBR steel (mirror / brushed / matte / bronze / PVD), refractive water,
     glass, textured timber, stone, gravel, snow and grass.
   Geometry still comes from js/models.js via window.STAVSJO3D.G.
   ===================================================================== */
import * as THREE from 'three';
import { RGBELoader } from '../vendor/three/addons/RGBELoader.js';
import { GroundedSkybox } from '../vendor/three/addons/GroundedSkybox.js';

const BASE = new URL('../', import.meta.url).href;
const MOBILE = matchMedia('(max-width: 900px)').matches || /Mobi|Android/i.test(navigator.userAgent);

/* ---------- environments: key used by models.js -> HDR + tuning ---------- */
const ENV = {
  // h = camera height of the panorama (m), R = radius the photo is projected to (m)
  zen:     { id: 'chinese_garden',       h: 1.7, R: 40, rot: 2.6,  expo: 0.95, sky: 1.0,  env: 1.0 },
  studio:  { id: 'studio_small_09',      h: 1.5, R: 14, rot: 0.6,  expo: 1.0,  sky: 1.0,  env: 1.0 },
  rotunda: { id: 'indoor_pool',          h: 1.5, R: 8,  rot: 0.0,  expo: 1.15, sky: 1.0,  env: 1.1 },
  roof:    { id: 'rooftop_night',        h: 1.7, R: 40, rot: 1.6,  expo: 1.25, sky: 1.0,  env: 1.2 },
  sea:     { id: 'secluded_beach',       h: 1.6, R: 40, rot: 0.2,  expo: 0.9,  sky: 1.0,  env: 1.0 },
  forest:  { id: 'misty_pines',          h: 1.7, R: 40, rot: 0.0,  expo: 1.1,  sky: 1.0,  env: 1.1 },
  snow:    { id: 'snowy_forest_path_01', h: 1.7, R: 40, rot: 1.57, expo: 0.95, sky: 1.0,  env: 1.0 },
  night:   { id: 'lakeside_night',       h: 1.7, R: 60, rot: 0.0,  expo: 0.85, sky: 0.2,  env: 0.6 }
};
ENV.aurora = ENV.night; ENV.hall = ENV.rotunda;

/* ---------- photographic textures (Poly Haven, CC0); size = metres per tile ---------- */
const TEX = {
  deck:     ['hinoki_planks', 1.6],  gravel: ['gravel_floor_02', 1.6], pebble: ['clean_pebbles', 1.2],
  grass:    ['leafy_grass', 2.2],      snow:   ['snow_02', 3.0],         tiles:  ['large_grey_tiles', 2.4],
  marble:   ['marble_01', 2.0],        concrete: ['concrete_floor_worn_001', 3.0],
  hinoki:   ['hinoki_planks', 1.4],    cedar:  ['japanese_cedar_planks', 1.4], darkwood: ['dark_wooden_planks', 1.4]
};

const srgb = (c) => new THREE.Color().setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);
const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

/* ---------- shared, lazily created resources ---------- */
const cache = { hdr: {}, bg: {}, tex: {}, gen: {} };
const rgbe = new RGBELoader().setDataType(THREE.FloatType);
const texLoader = new THREE.TextureLoader();

function loadHDR(id) {
  if (!cache.hdr[id]) cache.hdr[id] = rgbe.loadAsync(BASE + 'env/' + id + '/light.hdr').then((t) => { t.mapping = THREE.EquirectangularReflectionMapping; return t; });
  return cache.hdr[id];
}
function loadBG(id) {
  const k = id + (MOBILE ? '2k' : '4k');
  if (!cache.bg[k]) cache.bg[k] = texLoader.loadAsync(BASE + 'env/' + id + '/bg-' + (MOBILE ? '2k' : '4k') + '.jpg').then((t) => {
    t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; });
  return cache.bg[k];
}
function loadTex(key, renderer) {
  if (cache.tex[key]) return cache.tex[key];
  const [id] = TEX[key];
  const set = {};
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  for (const kind of ['diff', 'nor', 'rough']) {
    const t = texLoader.load(BASE + 'tex/' + id + '/' + kind + '.jpg');
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = aniso;
    if (kind === 'diff') t.colorSpace = THREE.SRGBColorSpace;
    set[kind] = t;
  }
  cache.tex[key] = set;
  return set;
}

/* ---------- procedural tileable textures (water ripples, foam, falling water, brushed steel) ---------- */
function canvasTex(n, fn, opts = {}) {
  const c = document.createElement('canvas'); c.width = c.height = n;
  const ctx = c.getContext('2d'), img = ctx.createImageData(n, n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const v = fn(x / n, y / n), i = (y * n + x) * 4;
    img.data[i] = v[0]; img.data[i + 1] = v[1]; img.data[i + 2] = v[2]; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = opts.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  return t;
}
function waveSet(seed) { // tileable sum of sines
  let s = seed; const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const w = [];
  for (let k = 0; k < 22; k++) { const f = 1 + Math.floor(r() * (k < 6 ? 3 : 9)); const a = r() * Math.PI * 2;
    w.push({ kx: Math.round(Math.cos(a) * f), ky: Math.round(Math.sin(a) * f), amp: 1 / (1 + f * f * 0.35), ph: r() * Math.PI * 2 }); }
  return w.filter((q) => q.kx || q.ky);
}
function normalTex(seed, strength) {
  const W = waveSet(seed);
  return canvasTex(256, (u, v) => {
    let dx = 0, dy = 0;
    for (const q of W) { const p = 2 * Math.PI * (q.kx * u + q.ky * v) + q.ph; const c = Math.cos(p) * q.amp * 2 * Math.PI; dx += c * q.kx; dy += c * q.ky; }
    const nx = -dx * strength, ny = -dy * strength, l = Math.hypot(nx, ny, 1);
    return [(nx / l * 0.5 + 0.5) * 255, (ny / l * 0.5 + 0.5) * 255, (1 / l * 0.5 + 0.5) * 255];
  });
}
function gen(name) {
  if (cache.gen[name]) return cache.gen[name];
  let t;
  if (name === 'ripple1') t = normalTex(11, 0.012);
  else if (name === 'ripple2') t = normalTex(97, 0.008);
  else if (name === 'foam') { const W = waveSet(5), W2 = waveSet(41);
    t = canvasTex(256, (u, v) => { let h = 0, h2 = 0; for (const q of W) h += Math.sin(2 * Math.PI * (q.kx * u + q.ky * v) + q.ph) * q.amp;
      for (const q of W2) h2 += Math.sin(2 * Math.PI * (q.kx * 2 * u + q.ky * 2 * v) + q.ph) * q.amp;
      const f = Math.max(0, Math.min(1, (h * 0.5 + h2 * 0.35 - 0.25) * 1.6)); const g = Math.pow(f, 1.4) * 255; return [g, g, g]; }); }
  else if (name === 'streak') { const cols = []; let s = 3; const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    for (let i = 0; i < 64; i++) cols.push({ a: 0.35 + r() * 0.65, ph: r() * 6.28, f: 1 + Math.floor(r() * 3) });
    t = canvasTex(256, (u, v) => { const c = cols[Math.floor(u * 64) % 64], fx = (u * 64) % 1;
      const edge = Math.sin(Math.PI * fx); const g = Math.max(0, Math.min(1, c.a * (0.55 + 0.45 * Math.sin(v * 6.283 * c.f + c.ph)) * (0.6 + 0.4 * edge))) * 255; return [g, g, g]; }); }
  else if (name === 'brushed') { let s = 9; const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; const rows = []; for (let i = 0; i < 512; i++) rows.push(r());
    t = canvasTex(256, (u, v) => { const a = rows[Math.floor(v * 512) % 512], b = rows[(Math.floor(v * 512) + 7) % 512]; const g = (0.42 + 0.22 * a + 0.1 * b + 0.06 * Math.sin(u * 6.283 * 3 + a * 9)) * 255; return [g, g, g]; }); }
  cache.gen[name] = t;
  return t;
}

/* ---------- geometry: models.js format -> BufferGeometry with box-projected UVs ---------- */
function toGeometry(geo, uvScale, rawColors) {
  const p = new Float32Array(geo.p), n = new Float32Array(p.length);
  for (let k = 0; k < geo.i.length; k += 3) {
    const a = geo.i[k] * 3, b = geo.i[k + 1] * 3, c = geo.i[k + 2] * 3;
    const e1x = p[b] - p[a], e1y = p[b + 1] - p[a + 1], e1z = p[b + 2] - p[a + 2], e2x = p[c] - p[a], e2y = p[c + 1] - p[a + 1], e2z = p[c + 2] - p[a + 2];
    const fx = e1y * e2z - e1z * e2y, fy = e1z * e2x - e1x * e2z, fz = e1x * e2y - e1y * e2x;
    for (const v of [a, b, c]) { n[v] += fx; n[v + 1] += fy; n[v + 2] += fz; }
  }
  for (let k = 0; k < n.length; k += 3) { const l = Math.hypot(n[k], n[k + 1], n[k + 2]) || 1; n[k] /= l; n[k + 1] /= l; n[k + 2] /= l; }
  const uv = new Float32Array(p.length / 3 * 2), s = 1 / (uvScale || 1);
  for (let v = 0, j = 0; v < p.length; v += 3, j += 2) {
    const ax = Math.abs(n[v]), ay = Math.abs(n[v + 1]), az = Math.abs(n[v + 2]);
    if (ay >= ax && ay >= az) { uv[j] = p[v] * s; uv[j + 1] = p[v + 2] * s; }
    else if (ax >= az) { uv[j] = p[v + 2] * s; uv[j + 1] = p[v + 1] * s; }
    else { uv[j] = p[v] * s; uv[j + 1] = p[v + 1] * s; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  if (geo.c && geo.c.length === geo.p.length) {
    const c = new Float32Array(geo.c);
    if (!rawColors) for (let k = 0; k < c.length; k++) c[k] = Math.pow(Math.max(c[k], 0), 2.2);
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  }
  g.setIndex(new THREE.BufferAttribute(geo.i.length > 65535 ? new Uint32Array(geo.i) : new Uint16Array(geo.i), 1));
  g.computeBoundingSphere();
  return g;
}
const hasTint = (geo) => geo.c && geo.c.length === geo.p.length && geo.c.some((v) => Math.abs(v - 1) > 1e-3);

/* ---------- shaders for steam and contact shadows ---------- */
const STEAM_VS = `varying vec3 vW; varying vec3 vN; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*w; }`;
const STEAM_FS = `uniform float uT,uA,uY0,uH; uniform vec3 uC; varying vec3 vW; varying vec3 vN;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*noise(p);p*=2.03;a*=.5;}return s;}
void main(){ float az=atan(vW.z,vW.x); float y=(vW.y-uY0)/uH; vec3 V=normalize(cameraPosition-vW);
  float n=fbm(vec2(az*2.2+vW.y*.6,vW.y*1.8-uT*.42))*.65+fbm(vec2(az*5.-uT*.12,vW.y*3.6-uT*.75))*.35;
  float a=smoothstep(.38,.82,n)*smoothstep(0.,.18,y)*smoothstep(1.,.25,y)*uA*(.3+.7*pow(abs(dot(normalize(vN),V)),.7));
  gl_FragColor=vec4(uC,a*.85); }`;
const SHADOW_FS = `uniform float uA; varying vec3 vC; void main(){ gl_FragColor=vec4(0.,0.,0.,vC.r*uA); }`;
const SHADOW_VS = `attribute vec3 color; varying vec3 vC; void main(){ vC=color; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

/* radial fade so ground pads melt into the photographic ground */
function addFade(m, r0, r1) {
  m.transparent = true;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uFade = { value: new THREE.Vector2(r0, r1) };
    sh.vertexShader = 'varying vec3 vFadeW;\n' + sh.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vFadeW = (modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader = 'uniform vec2 uFade; varying vec3 vFadeW;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor.a *= 1.0 - smoothstep(uFade.x, uFade.y, length(vFadeW.xz));');
  };
  m.customProgramCacheKey = () => 'fade' + r0.toFixed(2) + r1.toFixed(2);
}

/* =====================================================================
   VIEWER
   ===================================================================== */
export function createViewer(canvas, opts, cam) {
  const manual = !!opts.manual;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: manual, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  // stay invisible (the page's poster image shows through) until the real environment is in
  if (!manual) { canvas.style.opacity = '0'; canvas.style.transition = 'opacity .9s ease'; }
  const reveal = () => { canvas.style.opacity = '1'; };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1f21);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 600);
  const sun = new THREE.DirectionalLight(0xffffff, 0);
  sun.castShadow = true; sun.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);
  const point = new THREE.PointLight(0xffffff, 0, 0, 2); scene.add(point);
  const under = new THREE.PointLight(0xffffff, 0, 0, 2); scene.add(under);

  let group = null, sky = null, envKey = null, envToken = 0, animated = [], steamMats = [], clock = new THREE.Clock(), pendingFrame = false;
  const loadingSet = new Set();
  const envInfo = { skyCol: new THREE.Color(0.8, 0.85, 0.9) };

  function fitShadow(radius, dir) {
    const R = Math.max(2, radius * 1.25);
    const c = sun.shadow.camera; c.left = -R; c.right = R; c.top = R; c.bottom = -R; c.near = 0.1; c.far = R * 8; c.updateProjectionMatrix();
    sun.position.copy(dir).multiplyScalar(R * 4); sun.target.position.set(0, 0, 0);
  }

  /* --- find the sun in an HDR: brightest region, plus how dominant it is --- */
  function analyseHDR(tex) {
    const { data, width: w, height: h } = tex.image;
    let best = 0, bi = 0, sum = 0, sky = [0, 0, 0], skyN = 0;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * 4, L = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      sum += L; if (L > best) { best = L; bi = i / 4; }
      if (y < h * 0.35) { sky[0] += data[i]; sky[1] += data[i + 1]; sky[2] += data[i + 2]; skyN++; }
    }
    const avg = sum / ((w / 2) * (h / 2));
    const px = bi % w, py = Math.floor(bi / w);
    const u = (px + 0.5) / w, v = 1 - (py + 0.5) / h;
    const lat = (v - 0.5) * Math.PI, phi = (u - 0.5) * 2 * Math.PI;
    const dir = new THREE.Vector3(-Math.cos(phi) * Math.cos(lat), Math.sin(lat), Math.sin(phi) * Math.cos(lat));
    // equirect convention used by three: u = atan(dir.z, dir.x)/(2PI) + .5 ; we flip x to match
    const d2 = new THREE.Vector3(Math.cos(phi) * Math.cos(lat), Math.sin(lat), Math.sin(phi) * Math.cos(lat));
    return { dir: d2.y > 0.05 ? d2 : new THREE.Vector3(0.3, 1, 0.2).normalize(), ratio: best / Math.max(avg, 1e-4), avg, sky: sky.map((s) => s / Math.max(skyN, 1)), _alt: dir };
  }

  function setEnvironment(key, spec, model) {
    if (envKey === key) return Promise.resolve();
    envKey = key;
    const token = ++envToken;
    const E = Object.assign({}, ENV[key] || ENV.studio, spec || {});
    renderer.toneMappingExposure = E.expo;
    const p1 = loadHDR(E.id).then((hdr) => {
      if (token !== envToken) return;
      const envRT = pmrem.fromEquirectangular(hdr);
      if (scene.environment) scene.environment.dispose?.();
      scene.environment = envRT.texture;
      scene.environmentIntensity = E.env;
      scene.environmentRotation.set(0, E.rot, 0);
      const a = analyseHDR(hdr);
      const rotated = a.dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -E.rot);
      envInfo.sunDir = rotated; envInfo.ratio = a.ratio;
      envInfo.skyCol.setRGB(a.sky[0], a.sky[1], a.sky[2]).multiplyScalar(0.9 / Math.max(0.05, Math.max(a.sky[0], a.sky[1], a.sky[2])));
      const sunny = Math.min(1, Math.max(0, (a.ratio - 40) / 400));
      sun.intensity = (0.4 + 2.6 * sunny) * E.env;
      sun.color.setRGB(1, 0.96, 0.9);
      sun.shadow.radius = 6 - 4 * sunny;
      fitShadow(curRadius, rotated);
      steamMats.forEach((m) => m.uniforms.uC.value.copy(envInfo.skyCol));
      kick();
    });
    const p2 = loadBG(E.id).then((bg) => {
      if (token !== envToken) return;
      skyState = { bg, E, R: 0 };
      buildSky();
      kick();
    });
    return Promise.all([p1, p2]);
  }
  /* the photo is projected onto a dome; it must enclose the furthest camera position */
  let skyState = null;
  function buildSky() {
    if (!skyState) return;
    const { bg, E } = skyState, R = Math.max(E.R || 40, (cam.maxD || 10) * 1.2 + 2);
    if (sky && Math.abs(skyState.R - R) < 0.5) return;
    if (sky) { scene.remove(sky); sky.geometry.dispose(); sky.material.dispose(); }
    skyState.R = R;
    sky = new GroundedSkybox(bg, E.h, R, MOBILE ? 64 : 128);
    sky.position.y = E.h - 0.01;
    sky.rotation.y = E.rot;
    sky.material.toneMapped = false; sky.material.depthWrite = false; sky.material.color.setScalar(E.sky);
    sky.renderOrder = -10;
    scene.add(sky);
  }

  /* --- material factory --- */
  let curRadius = 4;
  function makeMaterial(m, geo) {
    const type = m.type ?? 0;
    const tint = hasTint(geo);
    if (type === 1) { // steel and other metals
      const rough = Math.max(0.025, Math.min(1, (m.rough ?? 0.2) * 1.05));
      const mt = new THREE.MeshPhysicalMaterial({ color: srgb(m.col || [0.9, 0.9, 0.9]), metalness: 1, roughness: rough, side: THREE.DoubleSide, envMapIntensity: 1 });
      if (m.brush) { mt.roughness = 0.34; }
      if (rough < 0.06) { mt.clearcoat = 0.4; mt.clearcoatRoughness = 0.02; }
      return { mat: mt, uv: m.brush ? 0.25 : 1, cast: true };
    }
    if (type === 2) {
      if ((m.wave ?? 1) === 0 && (m.alpha ?? 0.4) < 0.25) { // thin overflow film over a wall: barely visible, just a wet sheen
        const mt = new THREE.MeshPhysicalMaterial({ color: srgb(m.col || [0.8, 0.9, 0.95]), roughness: 0.04, metalness: 0, transparent: true, opacity: 0.16,
          depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.2 });
        return { mat: mt, uv: 1, cast: false };
      }
      if ((m.wave ?? 1) === 0) { // falling / pouring water sheets
        const st = gen('streak').clone(); st.needsUpdate = true;
        const mt = new THREE.MeshPhysicalMaterial({ color: srgb(m.col || [0.8, 0.9, 0.95]).multiplyScalar(1.1), roughness: 0.06, metalness: 0, transparent: true,
          opacity: Math.min(0.85, (m.alpha ?? 0.4) + 0.35), alphaMap: st, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.6, ior: 1.33, specularIntensity: 1 });
        animated.push({ t: st, vy: -1.6 });
        return { mat: mt, uv: 0.35, cast: false, sheet: true };
      }
      const n1 = gen('ripple1').clone(); n1.needsUpdate = true; const n2 = gen('ripple2').clone(); n2.needsUpdate = true;
      const c = m.col || [0.1, 0.5, 0.6];
      const glow = m.glow ? srgb(m.glow) : new THREE.Color(0, 0, 0);
      const mt = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0, roughness: 0.02, transmission: 1, ior: 1.333, thickness: 0.6,
        attenuationColor: srgb(c.map((v) => Math.min(1, v * 1.1 + 0.3))), attenuationDistance: 2.6,
        normalMap: n1, normalScale: new THREE.Vector2(0.28, 0.28).multiplyScalar(m.wave ?? 1),
        clearcoat: 1, clearcoatRoughness: 0.01, clearcoatNormalMap: n2, clearcoatNormalScale: new THREE.Vector2(0.22, 0.22).multiplyScalar(m.wave ?? 1),
        emissive: glow, emissiveIntensity: 0.6, side: THREE.DoubleSide, specularIntensity: 1
      });
      animated.push({ t: n1, vx: 0.028, vy: 0.017 }, { t: n2, vx: -0.021, vy: 0.031 });
      const extra = [];
      if (m.foam) {
        const ft = gen('foam').clone(); ft.needsUpdate = true;
        const fm = new THREE.MeshStandardMaterial({ color: 0xf4f8f8, roughness: 0.9, transparent: true, opacity: Math.min(0.9, m.foam * 0.75), alphaMap: ft, depthWrite: false });
        animated.push({ t: ft, vx: 0.05, vy: -0.035, wobble: 1 });
        extra.push({ mat: fm, lift: 0.003, uv: 0.6 });
      }
      return { mat: mt, uv: 0.55, cast: false, extra, water: true };
    }
    if (type === 3) { // glass / acrylic
      const mt = new THREE.MeshPhysicalMaterial({ color: srgb(m.col || [0.9, 0.97, 1]), metalness: 0, roughness: (m.alpha ?? 0.1) > 0.25 ? 0.12 : 0.02,
        transmission: 1, ior: 1.5, thickness: 0.03, side: THREE.DoubleSide, specularIntensity: 1 });
      if (m.glow) { mt.emissive = srgb(m.glow); mt.emissiveIntensity = 0.25; }
      return { mat: mt, uv: 1, cast: false };
    }
    if (type === 4) { // LEDs, light washes, clouds
      if (m.wash) return { mat: new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.55, toneMapped: true }), uv: 1, cast: false, raw: true };
      if (m.cloud) return { mat: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 1, metalness: 0, vertexColors: tint, sheen: 1, sheenRoughness: 0.8, sheenColor: new THREE.Color(1, 1, 1), emissive: new THREE.Color(0.85, 0.88, 0.92), emissiveIntensity: 0.22 }), uv: 1, cast: true };
      const col = srgb(m.col || [1, 1, 1]);
      return { mat: new THREE.MeshStandardMaterial({ color: col.clone().multiplyScalar(0.2), emissive: col, emissiveIntensity: (m.emis ?? 1.5) * 1.7, roughness: 0.4, vertexColors: tint }), uv: 1, cast: false, led: col };
    }
    if (type === 5) { // soft contact shadow (alpha in vertex colour r)
      return { mat: new THREE.ShaderMaterial({ vertexShader: SHADOW_VS, fragmentShader: SHADOW_FS, uniforms: { uA: { value: Math.min(0.85, (m.alpha ?? 0.5) * 1.1) } }, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), uv: 1, cast: false, raw: true };
    }
    if (type === 7) { // hot-spring steam
      const sm = new THREE.ShaderMaterial({ vertexShader: STEAM_VS, fragmentShader: STEAM_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uT: { value: 0 }, uA: { value: m.alpha ?? 0.5 }, uY0: { value: m.foam ?? 0 }, uH: { value: m.patS ?? 1 }, uC: { value: envInfo.skyCol.clone() } } });
      steamMats.push(sm);
      return { mat: sm, uv: 1, cast: false };
    }
    if (type === 8) { // shadow catcher over the photographic ground
      return { mat: new THREE.ShadowMaterial({ opacity: m.alpha ?? 0.5, depthWrite: false }), uv: 1, cast: false, receive: true };
    }
    /* type 0: dielectric surfaces, with photographic textures where a pattern is set */
    let key = m.tex || null;
    if (!key && m.pat === 1) key = 'deck';
    else if (!key && m.pat === 2) key = lum(m.col || [1, 1, 1]) > 0.55 && (m.col || [0])[0] > (m.col || [0, 0, 0])[2] ? 'marble' : 'tiles';
    else if (!key && m.pat === 3) key = 'snow';
    else if (!key && m.pat === 4) key = 'grass';
    else if (!key && m.pat === 5) key = 'concrete';
    else if (!key && m.grain) { const L = lum(m.col || [0.6, 0.4, 0.2]); key = L > 0.6 ? 'hinoki' : L > 0.3 ? 'cedar' : 'darkwood'; }
    const mt = new THREE.MeshPhysicalMaterial({ color: srgb(m.col || [0.8, 0.8, 0.8]), roughness: m.rough ?? 0.6, metalness: 0, vertexColors: tint, side: THREE.DoubleSide });
    let uv = 1;
    if (key && TEX[key]) {
      const set = loadTex(key, renderer); uv = TEX[key][1];
      mt.map = set.diff; mt.normalMap = set.nor; mt.roughnessMap = set.rough; mt.roughness = 1;
      // keep the model's colour as a gentle tint only
      const c = m.col || [1, 1, 1], k = Math.max(c[0], c[1], c[2]) || 1;
      mt.color = m.tex ? srgb(m.col || [1, 1, 1]) : srgb(c.map((v) => Math.min(1, 0.82 + 0.18 * v / k)));
      if (!m.tex && lum(c) < 0.3) mt.color.multiplyScalar(0.7);
      if (m.grain && !hasTint(geo)) mt.color = new THREE.Color(1, 1, 1);
      if (key === 'snow') { mt.color.setScalar(1); }
      if (key === 'marble' || key === 'tiles') { mt.roughness = 0.6; mt.clearcoat = 0.25; mt.clearcoatRoughness = 0.15; }
    } else if ((m.rough ?? 0.6) < 0.3) { mt.clearcoat = 0.5; mt.clearcoatRoughness = Math.max(0.03, m.rough); }
    if (m.fade) addFade(mt, m.fade[0], m.fade[1]);
    return { mat: mt, uv, cast: !m.fade && !m.ground, receive: true };
  }

  function disposeGroup() {
    if (!group) return;
    group.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((x) => x.dispose()); } });
    scene.remove(group); group = null; animated = []; steamMats = [];
  }

  function setModel(model, o = {}) {
    disposeGroup();
    group = new THREE.Group();
    const box = new THREE.Box3(), tmp = new THREE.Box3();
    let ledCol = null, waterTop = null;
    for (const part of model.parts) {
      if (!part || !part[0] || !part[0].i.length) continue;
      const [geo, m] = part;
      const info = makeMaterial(m, geo);
      const g = toGeometry(geo, info.uv, info.raw);
      const mesh = new THREE.Mesh(g, info.mat);
      mesh.castShadow = !!info.cast && !MOBILE || (!!info.cast && (m.type === 1));
      mesh.receiveShadow = info.receive !== false && m.type !== 4 && m.type !== 7 && m.type !== 5;
      if (m.type === 5) mesh.renderOrder = 1;       // contact shadows over the ground
      if (m.fade) mesh.renderOrder = -5;            // ground pad first
      if (m.type === 8) mesh.renderOrder = -4;      // then the shadow catcher
      group.add(mesh);
      if (info.extra) for (const ex of info.extra) {
        const g2 = toGeometry(geo, ex.uv, false); g2.translate(0, ex.lift, 0);
        const em = new THREE.Mesh(g2, ex.mat); em.renderOrder = 2; group.add(em);
      }
      if (info.led && !ledCol) ledCol = info.led;
      if (info.water) { g.computeBoundingBox(); waterTop = Math.max(waterTop ?? -9, g.boundingBox.max.y); }
      if (!m.fade && m.type !== 8 && m.type !== 5 && m.type !== 7 && !m.ground) { g.computeBoundingBox(); tmp.copy(g.boundingBox); box.union(tmp); }
    }
    scene.add(group);
    const sph = box.getBoundingSphere(new THREE.Sphere());
    curRadius = Math.max(1.5, sph.radius);

    // lights suggested by the model (LED glow over the water / sauna lights)
    const E = model.env || {};
    if (E.pl && E.plc && Math.max(...E.plc) > 0) { point.position.fromArray(E.pl); point.color.copy(srgb(E.plc.map((v) => Math.min(1, v * 1.6)))); point.intensity = 6 * Math.max(...E.plc); point.distance = curRadius * 4; }
    else point.intensity = 0;
    if (ledCol && waterTop != null) { under.position.set(0, waterTop - 0.35, 0); under.color.copy(ledCol); under.intensity = 3.5 * Math.min(4, curRadius); under.distance = curRadius * 2.2; }
    else under.intensity = 0;

    if (model.cam && !o.keepCam) Object.assign(cam, model.cam);
    else if (model.cam) { cam.minD = model.cam.minD; cam.maxD = model.cam.maxD; cam.target = model.cam.target; cam.dist = Math.min(cam.maxD, Math.max(cam.minD, cam.dist)); }
    if (opts.camOverride) Object.assign(cam, opts.camOverride);

    const key = E.key || 'studio';
    if (envInfo.sunDir) fitShadow(curRadius, envInfo.sunDir);
    buildSky();
    const ready = setEnvironment(key, E.spec, model);
    const done = () => { frame(performance.now()); frame(performance.now() + 16); canvas.dataset.ready = '1'; reveal(); kick(); };
    ready.catch((e) => console.error('STAVSJO 3D environment failed', e)).then(() => waitTextures()).then(done, done);
    kick();
  }

  function waitTextures() {
    const pend = [];
    group && group.traverse((o) => { if (!o.isMesh) return; const m = o.material; for (const k of ['map', 'normalMap', 'roughnessMap']) { const t = m[k]; if (t && t.image === undefined) pend.push(new Promise((r) => { const iv = setInterval(() => { if (t.image) { clearInterval(iv); r(); } }, 50); setTimeout(() => { clearInterval(iv); r(); }, 15000); })); } });
    return Promise.all(pend);
  }

  /* --- pointer controls (same feel as before) --- */
  const ptrs = new Map(); let lastPinch = 0, idle = 0;
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', (e) => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); try { canvas.setPointerCapture(e.pointerId); } catch (_) {} idle = 0; cam.auto = false; });
  canvas.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return; const pv = ptrs.get(e.pointerId); const dx = e.clientX - pv[0], dy = e.clientY - pv[1]; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 1) { cam.vy = -dx * 0.006; if (e.pointerType === 'mouse') cam.vp = dy * 0.004; }
    else if (ptrs.size === 2 && opts.zoom !== false) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (lastPinch) cam.dist = Math.min(cam.maxD, Math.max(cam.minD, cam.dist * lastPinch / d)); lastPinch = d; }
    kick();
  });
  const up = (e) => { ptrs.delete(e.pointerId); lastPinch = 0; idle = performance.now(); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  if (opts.zoom !== false) canvas.addEventListener('wheel', (e) => { e.preventDefault(); cam.dist = Math.min(cam.maxD, Math.max(cam.minD, cam.dist * (1 + Math.sign(e.deltaY) * 0.08))); kick(); }, { passive: false });

  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) kick(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });

  let running = false;
  function kick() { if (manual) { if (!pendingFrame) { pendingFrame = true; setTimeout(() => { pendingFrame = false; frame(performance.now()); }, 0); } return; } if (!running) { running = true; requestAnimationFrame(loop); } }
  function loop(now) { if (!visible || document.hidden || !group) { running = false; return; } frame(now); requestAnimationFrame(loop); }

  const look = new THREE.Vector3(), eye = new THREE.Vector3();
  function frame(now) {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h || !group) return;
    const dpr = Math.min(devicePixelRatio || 1, opts.maxDpr || (MOBILE ? 1.5 : 2));
    if (renderer.getPixelRatio() !== dpr) renderer.setPixelRatio(dpr);
    const sz = renderer.getSize(new THREE.Vector2()); if (sz.x !== w || sz.y !== h) renderer.setSize(w, h, false);
    if (!cam.auto && idle && now - idle > 3500 && opts.autoRotate !== false) cam.auto = true;
    const dt = Math.min(0.05, clock.getDelta());
    cam.yaw += cam.vy + (cam.auto ? cam.autoSpeed * 0.016 : 0); cam.pitch = Math.min(1.35, Math.max(0.06, cam.pitch + cam.vp)); cam.vy *= 0.88; cam.vp *= 0.85;
    eye.set(cam.target[0] + cam.dist * Math.cos(cam.pitch) * Math.sin(cam.yaw), Math.max(0.12, cam.target[1] + cam.dist * Math.sin(cam.pitch)), cam.target[2] + cam.dist * Math.cos(cam.pitch) * Math.cos(cam.yaw));
    look.set(cam.target[0], cam.target[1] + cam.dist * cam.lift, cam.target[2]);
    camera.fov = cam.fov; camera.aspect = w / h; camera.position.copy(eye); camera.lookAt(look); camera.updateProjectionMatrix();
    const off = opts.offsetX || 0; if (off && w > 900) { camera.projectionMatrix.elements[8] = off; camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert(); }
    const t = now / 1000;
    for (const a of animated) { a.t.offset.x = ((a.vx || 0) * t) % 1; a.t.offset.y = ((a.vy || 0) * t) % 1; if (a.wobble) a.t.rotation = Math.sin(t * 0.13) * 0.2; }
    for (const s of steamMats) s.uniforms.uT.value = t;
    renderer.render(scene, camera);
  }

  return { setModel, cam, render: (ms) => frame(ms ?? performance.now()), three: { renderer, scene, camera } };
}
