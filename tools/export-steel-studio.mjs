// Export the website's own pool geometry for the non-WebGL detail views.
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root = new URL('../', import.meta.url);
const source = await readFile(new URL('spa-model.js', root), 'utf8');
const library = new URL('assets/vendor/three.module.min.js', root).href;
const moduleSource = source.replace("'./assets/vendor/three.module.min.js'", JSON.stringify(library))
  + '\nexport {assembleBath, cameraViews, inspectionViews};\n';
// The renderer makes its own physically shaded finish; no browser is needed.
globalThis.document = {createElement: () => ({width: 512, height: 128,
  getContext: () => ({fillRect() {}, set fillStyle(value) {}})})};
const modelModule = await import('data:text/javascript;base64,' + Buffer.from(moduleSource).toString('base64'));
const THREE = await import(library);
const shape = {width:1.24, depth:.84, exponent:.38};
const model = modelModule.assembleBath('steel', shape, {value:0});
model.scene.updateMatrixWorld(true);
const geometry = [];
model.scene.traverse(object => {
  if (!object.isMesh) return;
  const positions = object.geometry.attributes.position.array;
  const index = object.geometry.index?.array;
  const material = object.material;
  const matrices = [];
  if (object.isInstancedMesh) {
    for (let i=0; i<object.count; i++) {
      const matrix = new THREE.Matrix4();
      object.getMatrixAt(i, matrix);
      matrices.push(new THREE.Matrix4().multiplyMatrices(object.matrixWorld, matrix).toArray());
    }
  } else matrices.push(object.matrixWorld.toArray());
  geometry.push({positions: Array.from(positions), indices: index ? Array.from(index) : null, matrices,
    water: object === model.water,
    material: {colour: material.color.toArray(), metallic: material.metalness || 0,
      roughness: material.roughness ?? .35, emission: Boolean(material.isMeshBasicMaterial),
      brushed: material === model.steel}});
});
const output = {geometry, views: {...modelModule.cameraViews('steel'), ...modelModule.inspectionViews(shape)}};
const destination = process.argv[2];
if (!destination) throw new Error('Pass an absolute JSON output path.');
await writeFile(destination, JSON.stringify(output));
console.log(`Exported ${geometry.length} pool components from ${fileURLToPath(root)}`);
