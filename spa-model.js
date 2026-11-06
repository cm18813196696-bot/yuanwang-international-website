import * as THREE from './assets/vendor/three.module.min.js';

const TAU = Math.PI * 2;
const SAMPLES = 120;
const AXIS_Z = new THREE.Vector3(0, 0, 1);
const clamp = THREE.MathUtils.clamp;

function studioEnvironment(renderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x778287);
  const softbox = (position, size, colour, strength) => {
    const light = new THREE.Mesh(new THREE.PlaneGeometry(...size),
      new THREE.MeshBasicMaterial({color: new THREE.Color(colour).multiplyScalar(strength), side: THREE.DoubleSide}));
    light.position.set(...position);
    light.lookAt(0, .5, 0);
    studio.add(light);
  };
  softbox([-.8, 5, 2], [6, 2.6], 0xfff1dc, 3.3);
  softbox([5, 2.3, -1], [2, 4], 0xc6e8ff, 2.4);
  softbox([-5, 1, -2], [2.5, 3.5], 0xffdfbf, 1.6);
  softbox([0, 2.6, -6], [6, .25], 0xf8fdff, 4);
  softbox([-.5, 1.35, 4.4], [4.8, .13], 0xe6f4ff, 2.4);
  softbox([0, -3, 0], [8, 8], 0xa79179, .36);
  const generator = new THREE.PMREMGenerator(renderer);
  const result = generator.fromScene(studio, .065, .05, 24, {size: 256});
  generator.dispose();
  studio.traverse(object => {
    object.geometry?.dispose();
    object.material?.dispose();
  });
  return result;
}

function finishTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  let seed = 591;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let y = 0; y < canvas.height; y++) {
    const value = 130 + Math.floor(random() * 45);
    ctx.fillStyle = `rgb(${value},${value},${value})`;
    ctx.fillRect(0, y, 512, 1);
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = `rgba(255,255,255,${random() * .18})`;
      ctx.fillRect(random() * 512, y, random() * 110 + 12, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2.5);
  return texture;
}

function softShadow() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 10, 64, 64, 63);
  gradient.addColorStop(0, 'rgba(0,0,0,.78)');
  gradient.addColorStop(.54, 'rgba(0,0,0,.50)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function contour(angle, radius, shape) {
  const {exponent, width, depth, taper = 0} = shape;
  const x = Math.cos(angle), z = Math.sin(angle);
  return [radius * width * Math.sign(x) * Math.pow(Math.abs(x), exponent),
    radius * depth * Math.sign(z) * Math.pow(Math.abs(z), exponent) * (1 + taper * x)];
}

function shellGeometry(profile, shape) {
  const positions = [], uv = [], indices = [];
  for (let row = 0; row < profile.length; row++) {
    const [radius, y] = profile[row];
    for (let i = 0; i <= SAMPLES; i++) {
      const [x, z] = contour(i / SAMPLES * TAU, radius, shape);
      positions.push(x, y, z);
      uv.push(i / SAMPLES, row / (profile.length - 1));
      if (row < profile.length - 1 && i < SAMPLES) {
        const a = row * (SAMPLES + 1) + i, b = a + SAMPLES + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const normals = geo.getAttribute('normal');
  for (let row = 0; row < profile.length; row++) {
    const a = row * (SAMPLES + 1), b = a + SAMPLES;
    const normal = new THREE.Vector3().fromBufferAttribute(normals, a)
      .add(new THREE.Vector3().fromBufferAttribute(normals, b)).normalize();
    normals.setXYZ(a, normal.x, normal.y, normal.z);
    normals.setXYZ(b, normal.x, normal.y, normal.z);
  }
  return geo;
}

function makeWater(shape, time, colour) {
  const outline = new THREE.Shape();
  for (let i = 0; i <= SAMPLES; i++) {
    const [x, z] = contour(i / SAMPLES * TAU, 1.235, shape);
    if (i === 0) outline.moveTo(x, -z);
    else outline.lineTo(x, -z);
  }
  const geometry = new THREE.ShapeGeometry(outline);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshPhysicalMaterial({
    color: colour, metalness: .23, roughness: .10, clearcoat: 1,
    clearcoatRoughness: .075, ior: 1.33, transparent: true, opacity: .75,
    depthWrite: false, envMapIntensity: 1.36
  });
  material.onBeforeCompile = shader => {
    shader.uniforms.poolTime = time;
    const varying = `
      varying vec2 waterXZ;
      varying vec3 waterU;
      varying vec3 waterV;
    `;
    shader.vertexShader = varying + shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      waterXZ = position.xz;
      waterU = normalize(mat3(modelViewMatrix) * vec3(1.0, 0.0, 0.0));
      waterV = normalize(mat3(modelViewMatrix) * vec3(0.0, 0.0, 1.0));
    `);
    shader.fragmentShader = 'uniform float poolTime;\n' + varying
      + shader.fragmentShader.replace('#include <normal_fragment_maps>', `
        #include <normal_fragment_maps>
        float t = poolTime;
        vec2 p = waterXZ;
        vec2 waves = vec2(
          cos(dot(p, vec2(12.0, 7.2)) + t * 1.35) * 0.043
          + cos(dot(p, vec2(-19.5, 12.1)) - t * 1.7) * 0.019,
          cos(dot(p, vec2(8.1, -14.5)) - t * 1.3) * 0.041
          + cos(dot(p, vec2(25.2, 12.0)) + t * 1.6) * 0.016
        );
        normal = normalize(normal + waves.x * waterU + waves.y * waterV);
      `).replace('#include <color_fragment>', `
        #include <color_fragment>
        vec2 drift = waterXZ * 9.0;
        drift += vec2(sin(drift.y * 1.1 + poolTime * .57), cos(drift.x * .85 - poolTime * .62));
        float lens = abs(sin(drift.x + drift.y * .36) * cos(drift.y - drift.x * .47));
        float glint = smoothstep(.75, 1.0, lens);
        diffuseColor.rgb *= .92 + glint * .21;
      `);
  };
  const surface = new THREE.Mesh(geometry, material);
  surface.position.y = .655;
  surface.renderOrder = 3;
  return surface;
}

function fitting(group, normal, position, bright, dark, size) {
  const fixture = new THREE.Group();
  fixture.position.set(...position);
  fixture.quaternion.setFromUnitVectors(AXIS_Z, normal.normalize());
  const rim = new THREE.Mesh(new THREE.TorusGeometry(size, size * .14, 10, 30), bright);
  fixture.add(rim);
  const plate = new THREE.Mesh(new THREE.CircleGeometry(size * .91, 32), dark);
  plate.position.z = -.006;
  fixture.add(plate);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(size * .32, 16, 8), bright);
  cap.scale.z = .43;
  fixture.add(cap);
  group.add(fixture);
}

function assembleBath(kind, shape, time) {
  const scene = new THREE.Group();
  const texture = finishTexture();
  const steel = new THREE.MeshPhysicalMaterial({
    color: 0xbac4c7, metalness: .94, roughness: .48, clearcoat: .26,
    clearcoatRoughness: .25, roughnessMap: texture, bumpMap: texture,
    anisotropy: .41, bumpScale: .003, envMapIntensity: 1.2
  });
  const chrome = new THREE.MeshStandardMaterial({color: 0xe1e6e4, metalness: .97, roughness: .19});
  const recess = new THREE.MeshStandardMaterial({color: 0x17222a, metalness: .4, roughness: .41});
  const shell = [
    [.1,.05],[.95,.05],[1.19,.052],[1.245,.063],[1.269,.083],[1.28,.11],
    [1.296,.21],[1.315,.39],[1.335,.62],[1.343,.75],[1.344,.792],
    [1.34,.819],[1.329,.838],[1.309,.847],[1.281,.85],
    [1.259,.844],[1.247,.829],[1.243,.80],[1.24,.728],[1.23,.59],
    [1.215,.468],[1.206,.433],[1.19,.418],[1.14,.416],[1.03,.417],
    [.995,.412],[.98,.393],[.968,.34],[.959,.23],[.944,.185],[.91,.159],[.05,.159]
  ];
  const bath = new THREE.Mesh(shellGeometry(shell, shape), steel);
  scene.add(bath);
  const rim = new THREE.Mesh(shellGeometry([[1.344,.796],[1.344,.81],[1.336,.833],[1.32,.845],[1.285,.849],[1.25,.833]], shape), chrome);
  scene.add(rim);
  const base = new THREE.Mesh(shellGeometry([[.06,.003],[1.16,.003],[1.195,.012],[1.211,.028],[1.218,.053],[1.216,.082]], shape), recess);
  scene.add(base);
  const warm = kind === 'steel' ? 0xffb575 : 0x7299ff;
  const light = new THREE.MeshBasicMaterial({color: warm, toneMapped: false});
  const strip = new THREE.Mesh(shellGeometry([[1.218,.034],[1.221,.041],[1.22,.05]], shape), light);
  scene.add(strip);
  const lightSpill = new THREE.PointLight(warm, kind === 'steel' ? .47 : .65, 2.9);
  lightSpill.position.set(.38,.27,1.16);
  scene.add(lightSpill);
  for (let i = 0; i < 10; i++) {
    const a = TAU * (i + .32) / 10;
    const [x,z] = contour(a, 1.214, shape);
    fitting(scene, new THREE.Vector3(-x,.15,-z), [x,.525,z], chrome, recess, .027);
  }
  const [overflowX,overflowZ] = contour(-Math.PI / 2,1.222,shape);
  fitting(scene, new THREE.Vector3(0,.09,1), [overflowX,.705,overflowZ], chrome, recess, .049);
  const drain = new THREE.Group();
  drain.position.set(.37,.174,.10);
  const drainPlate = new THREE.Mesh(new THREE.CylinderGeometry(.081,.082,.012,40), chrome);
  drain.add(drainPlate);
  const holes = new THREE.InstancedMesh(new THREE.CircleGeometry(.008,9),recess,19);
  const position = new THREE.Matrix4();
  for (let i=0; i<19; i++) {
    const angle = i * 2.39996;
    const radius = .061 * Math.sqrt(i / 18);
    position.makeRotationX(-Math.PI / 2);
    position.setPosition(Math.cos(angle)*radius,.0064,Math.sin(angle)*radius);
    holes.setMatrixAt(i,position);
  }
  drain.add(holes);
  scene.add(drain);
  if (kind === 'steel' && shape.exponent < .5) {
    const tread = new THREE.Shape();
    tread.moveTo(-.23,-.13);
    tread.lineTo(.23,-.13);
    tread.quadraticCurveTo(.27,-.13,.27,-.09);
    tread.lineTo(.27,.09);
    tread.quadraticCurveTo(.27,.13,.23,.13);
    tread.lineTo(-.23,.13);
    tread.quadraticCurveTo(-.27,.13,-.27,.09);
    tread.lineTo(-.27,-.09);
    tread.quadraticCurveTo(-.27,-.13,-.23,-.13);
    const step = new THREE.Mesh(new THREE.ExtrudeGeometry(tread, {
      depth:.098, bevelSize:.018, bevelThickness:.014, bevelSegments:3
    }), steel);
    step.rotation.x = -Math.PI/2;
    step.position.set(-.73,.174,.16);
    scene.add(step);
  }
  const water = makeWater(shape, time, kind === 'steel' ? 0x297e80 : 0x2674ac);
  scene.add(water);
  return {scene, steel, water};
}

function haloDetails(scene, variant) {
  const finish = new THREE.MeshPhysicalMaterial({color: 0x9d8062, metalness: .92, roughness: .26, clearcoat: .45});
  const luminous = new THREE.MeshBasicMaterial({color: 0xffe0ae, toneMapped:false});
  const spill = new THREE.PointLight(0xffd1a2,5.6,5.6);
  spill.position.set(0,1.64,-.92);
  scene.add(spill);
  if (variant === 'crescent') {
    const shape = new THREE.Shape();
    shape.moveTo(-.03, 1.33);
    shape.bezierCurveTo(-1.3, .98, -1.38, -.89, -.23, -1.22);
    shape.bezierCurveTo(.45, -1.43, 1.03, -1.08, 1.23, -.42);
    shape.bezierCurveTo(.69, -.82, .16, -.69, -.17, -.26);
    shape.bezierCurveTo(-.56, .28, -.40, .96, -.03, 1.33);
    const moon = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
      depth: .1, bevelEnabled: true, bevelSize: .04, bevelThickness: .025, bevelSegments: 4, curveSegments: 32
    }), finish);
    moon.position.set(0, 1.30, -1.24);
    scene.add(moon);
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-.10,2.56,-1.123),new THREE.Vector3(-1.28,2.19,-1.123),
      new THREE.Vector3(-1.36,.44,-1.123),new THREE.Vector3(-.31,.15,-1.123)
    );
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve,80,.014,8),luminous));
    const support = new THREE.Mesh(new THREE.BoxGeometry(.3,.11,.35),finish);
    support.position.set(-.37,.047,-1.20);
    scene.add(support);
  } else {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.225,.042,16,144),finish);
    ring.position.set(0,1.34,-1.26);
    scene.add(ring);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(1.197,.014,10,144),luminous);
    inner.position.set(0,1.34,-1.222);
    scene.add(inner);
    for (const x of [-.57,.57]) {
      const support = new THREE.Mesh(new THREE.BoxGeometry(.105,.28,.19),finish);
      support.position.set(x,.14,-1.26);
      scene.add(support);
    }
  }
  const stars = new THREE.InstancedMesh(new THREE.SphereGeometry(.007,8,6),
    new THREE.MeshBasicMaterial({color: 0x91d7ff, toneMapped:false}), 54);
  const matrix = new THREE.Matrix4();
  for (let i=0;i<stars.count;i++) {
    const a = i * 2.39996323;
    const r = .91 * Math.sqrt((i + .5) / stars.count);
    matrix.makeScale(1 + .32*Math.sin(i*2),.65,1 + .32*Math.sin(i*2));
    matrix.setPosition(Math.cos(a)*r,.652,Math.sin(a)*r);
    stars.setMatrixAt(i,matrix);
  }
  scene.add(stars);
}

function waterShow(scene, time) {
  const geometry = new THREE.BufferGeometry();
  const jets = 15, droplets = 28;
  const positions = new Float32Array(jets * droplets * 3);
  const rgb = new Float32Array(positions.length);
  const steel = new THREE.MeshStandardMaterial({color:0xc4d6dd, metalness:.88, roughness:.25});
  const rgbColour = new THREE.Color();
  for (let jet=0;jet<jets;jet++) {
    const a = jet / jets * TAU;
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(.026,.041,.037,16),steel);
    nozzle.position.set(Math.cos(a)*1.12,.671,Math.sin(a)*1.12);
    scene.add(nozzle);
    rgbColour.setHSL(.52 + .16 * (jet / jets),.76,.65);
    for (let j=0;j<droplets;j++) rgb.set(rgbColour.toArray(), (jet*droplets+j)*3);
  }
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('color',new THREE.BufferAttribute(rgb,3));
  const drops = new THREE.Points(geometry,new THREE.PointsMaterial({
    size:.027, transparent:true, opacity:.78, vertexColors:true,
    depthWrite:false, blending:THREE.AdditiveBlending
  }));
  drops.frustumCulled=false;
  scene.add(drops);
  return () => {
    for (let jet=0;jet<jets;jet++) {
      const a=jet/jets*TAU, phase=time.value * .61 + jet * .117;
      const height=.57 + .52*(.5 + .5*Math.sin(time.value*1.05 + a*2));
      for (let j=0;j<droplets;j++) {
        const u=(j/droplets+phase)%1, r=1.12 - .81*u, p=(jet*droplets+j)*3;
        positions[p]=Math.cos(a)*r;
        positions[p+1]=.68+height*4*u*(1-u);
        positions[p+2]=Math.sin(a)*r;
      }
    }
    geometry.attributes.position.needsUpdate=true;
  };
}

const variants = {
  round: {width:1, depth:1, exponent:1},
  suite: {width:1.24, depth:.84, exponent:.38},
  starlight: {width:1, depth:1, exponent:1},
  crescent: {width:1.15, depth:.91, exponent:1.13, taper:.20},
  fountain: {width:1.16, depth:1.16, exponent:1}
};
function cameraViews(kind) {
  const tall = kind !== 'steel';
  return {
    full:{azimuth:.48, lift:.47, distance:tall ? 5.17 : 4.55, centre:tall ? 1.17 : .47},
    interior:{azimuth:.37, lift:1.05, distance:tall ? 5.05 : 4.08, centre:tall ? .76 : .44},
    detail:{azimuth:-.77, lift:.64, distance:tall ? 4.13 : 3.24, centre:tall ? .90 : .60}
  };
}

export function mountModel(mount, kind, variant, options) {
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.55));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.19;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38,1,.05,60);
  const environment = studioEnvironment(renderer);
  scene.environment = environment.texture;
  scene.add(new THREE.HemisphereLight(0xdeebf8,0x574331,1.15));
  const key = new THREE.DirectionalLight(0xffe6c7,2.1);
  key.position.set(-3,6,4);
  scene.add(key);
  const edge = new THREE.DirectionalLight(0xabdbff,2.15);
  edge.position.set(3,4,-3);
  scene.add(edge);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.8,3.9),
    new THREE.MeshBasicMaterial({map:softShadow(), transparent:true, depthWrite:false}));
  shadow.rotation.x = -Math.PI/2;
  shadow.position.y = -.013;
  shadow.renderOrder = -1;
  scene.add(shadow);

  const time = {value:0};
  const views = cameraViews(kind);
  let model;
  let updateJets = () => {};
  let playing = !options.reducedMotion;
  let last = null;
  let frame = 0;
  let active = true;
  let tween = null;
  const pointers = new Map();
  let view = {...views.full};

  function wake() {
    if (!frame && active && !document.hidden) frame = requestAnimationFrame(render);
  }
  const initialSize = () => {
    const width = Math.max(1, mount.clientWidth), height = Math.max(1, mount.clientHeight);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    wake();
  };

  function changeVariant(next) {
    if (model) {
      scene.remove(model.scene);
      disposeModel(model.scene);
    }
    variant = next;
    model = assembleBath(kind, variants[variant], time);
    if (kind === 'signature') haloDetails(model.scene, variant);
    updateJets = kind === 'show' ? waterShow(model.scene,time) : () => {};
    scene.add(model.scene);
    wake();
  }
  function disposeModel(root) {
    const resources = new Set();
    root.traverse(object => {
      if (object.geometry) resources.add(object.geometry);
      if (!object.material) return;
      resources.add(object.material);
      for (const key of ['map','roughnessMap','bumpMap']) {
        if (object.material[key]) resources.add(object.material[key]);
      }
    });
    for (const resource of resources) resource.dispose();
  }
  function render(now) {
    frame = 0;
    if (!active || document.hidden) { last = null; return; }
    const delta = last === null ? 0 : Math.min((now-last)/1000,.05);
    last = now;
    if (tween) {
      const elapsed = Math.min((now - tween.start) / 590, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      for (const key of Object.keys(view)) view[key] = THREE.MathUtils.lerp(tween.from[key],tween.to[key],eased);
      if (elapsed === 1) tween = null;
    } else if (playing && pointers.size === 0) {
      view.azimuth += delta*.147;
    }
    if (playing) time.value += delta;
    const r = view.distance * (camera.aspect < 1 ? Math.min(1.45,1/camera.aspect) : 1);
    camera.position.set(r*Math.cos(view.lift)*Math.sin(view.azimuth),
      view.centre+r*Math.sin(view.lift),r*Math.cos(view.lift)*Math.cos(view.azimuth));
    camera.lookAt(0,view.centre,0);
    updateJets();
    renderer.render(scene,camera);
    if (playing || tween) wake();
  }

  function setView(name) {
    const target = {...views[name]};
    const offset = Math.round((view.azimuth - target.azimuth) / TAU) * TAU;
    target.azimuth += offset;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) view = target;
    else tween = {from:{...view},to:target,start:performance.now()};
    wake();
  }

  function zoom(amount) {
    tween = null;
    view.distance = clamp(view.distance + amount,2.8,8.5);
    wake();
  }

  function wakeOnVisibility() {
    last = null;
    wake();
  }

  const canvas = renderer.domElement;
  canvas.tabIndex=0;
  canvas.setAttribute('aria-label','Interactive 3D product model / 交互三维产品模型');
  canvas.addEventListener('pointerdown',event=>{
    tween = null;
    pointers.set(event.pointerId,[event.clientX,event.clientY]);
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove',event=>{
    if (!pointers.has(event.pointerId)) return;
    const previous = pointers.get(event.pointerId);
    if (pointers.size === 2) {
      const other = [...pointers].find(([key])=>key!==event.pointerId)[1];
      const before = Math.hypot(previous[0]-other[0],previous[1]-other[1]);
      const after = Math.hypot(event.clientX-other[0],event.clientY-other[1]);
      view.distance=clamp(view.distance-(after-before)*.013,2.9,8.5);
    } else {
      view.azimuth -= (event.clientX-previous[0])*.009;
      view.lift = clamp(view.lift+(event.clientY-previous[1])*.007,.10,1.37);
    }
    pointers.set(event.pointerId,[event.clientX,event.clientY]);
    wake();
  });
  for (const type of ['pointerup','pointercancel','lostpointercapture']) {
    canvas.addEventListener(type,event=>pointers.delete(event.pointerId));
  }
  canvas.addEventListener('keydown',event=>{
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(event.key)) return;
    event.preventDefault();
    tween = null;
    if (event.key==='ArrowLeft') view.azimuth-=.16;
    if (event.key==='ArrowRight') view.azimuth+=.16;
    if (event.key==='ArrowUp') view.lift=clamp(view.lift+.10,.10,1.37);
    if (event.key==='ArrowDown') view.lift=clamp(view.lift-.10,.10,1.37);
    if (event.key==='+' || event.key==='=') zoom(-.28);
    if (event.key==='-') zoom(.28);
    wake();
  });
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();
    options.onLost();
  });

  mount.replaceChildren(canvas);
  initialSize();
  const resize = new ResizeObserver(initialSize);
  resize.observe(mount);
  const visibility = new IntersectionObserver(([entry])=>{
    active=entry.isIntersecting;
    wakeOnVisibility();
  },{rootMargin:'80px'});
  visibility.observe(mount);
  document.addEventListener('visibilitychange',wakeOnVisibility);
  changeVariant(variant);
  return {
    variant: changeVariant,
    view: setView,
    zoom,
    play(value) {playing=value;wakeOnVisibility();},
    water(value) {model.water.visible=value;wake();},
    finish(name) {
      const finishes = {
        brushed:{roughness:.48,map:true,anisotropy:.41,colour:0xbac4c7},
        mirror:{roughness:.11,map:false,anisotropy:0,colour:0xd4dcdf},
        matte:{roughness:.78,map:true,anisotropy:.10,colour:0xa5aeb2}
      };
      const selected=finishes[name];
      model.steel.roughness=selected.roughness;
      model.steel.roughnessMap=selected.map ? model.steel.bumpMap : null;
      model.steel.bumpScale=selected.map ? .003 : 0;
      model.steel.anisotropy=selected.anisotropy;
      model.steel.color.setHex(selected.colour);
      model.steel.needsUpdate=true;
      wake();
    },
    destroy() {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange',wakeOnVisibility);
      disposeModel(scene);
      environment.dispose();
      renderer.dispose();
      canvas.remove();
    }
  };
}
