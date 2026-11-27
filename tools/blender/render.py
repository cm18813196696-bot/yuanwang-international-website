# STAVSJO product stills in Cycles.
# blender -b -P render.py -- glb=<file> hdri=<dir> out=<png> [rot=deg] [dist=m] [h=m] [res=WxH] [spp=n] [hdr=scale] [lens=mm] [yaw=deg] [aim=m] [probe=1]
import bpy, sys, json, math, os
from mathutils import Vector

A = dict(a.split('=', 1) for a in sys.argv[sys.argv.index('--') + 1:])
GLB, HDRI, OUT = A['glb'], A['hdri'], A['out']
ROT = math.radians(float(A.get('rot', 0)))
DIST = float(A.get('dist', 4.5)); H = float(A.get('h', 1.6)); LENS = float(A.get('lens', 50))
W, Hh = map(int, A.get('res', '1600x1200').split('x')); SPP = int(A.get('spp', 256))
HDR_K = float(A.get('hdr', 1.0)); YAW = math.radians(float(A.get('yaw', 25))); AIM = float(A.get('aim', 0.55))
PROBE = A.get('probe') == '1'
TEX = A.get('tex', '')

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
cy = sc.cycles
# GPU if there is one
prefs = bpy.context.preferences.addons['cycles'].preferences
dev = 'CPU'
for kind in ('OPTIX', 'CUDA', 'HIP', 'ONEAPI', 'METAL'):
    try:
        prefs.compute_device_type = kind; prefs.get_devices()
        gpus = [d for d in prefs.devices if d.type == kind]
        if gpus:
            for d in prefs.devices: d.use = d.type == kind
            dev = kind; break
    except Exception:
        pass
cy.device = 'GPU' if dev != 'CPU' else 'CPU'
cy.samples = SPP; cy.use_denoising = True
cy.max_bounces = 16; cy.glossy_bounces = 8; cy.transmission_bounces = 16; cy.transparent_max_bounces = 16
cy.caustics_reflective = True; cy.caustics_refractive = False
sc.render.resolution_x, sc.render.resolution_y = W, Hh; sc.render.resolution_percentage = 100
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
sc.render.image_settings.file_format = 'PNG'
print('DEVICE', dev)

# ---------- world: HDR light for shading, sharp photo for what the camera and mirrors see ----------
w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
nt = w.node_tree; nt.nodes.clear()
out = nt.nodes.new('ShaderNodeOutputWorld')
tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Rotation'].default_value[2] = ROT
nt.links.new(tc.outputs['Generated'], mp.inputs['Vector'])
hdr = nt.nodes.new('ShaderNodeTexEnvironment'); hdr.image = bpy.data.images.load(os.path.join(HDRI, 'light.hdr'))
jpg = nt.nodes.new('ShaderNodeTexEnvironment'); jpg.image = bpy.data.images.load(os.path.join(HDRI, 'bg-8k.jpg') if os.path.exists(os.path.join(HDRI, 'bg-8k.jpg')) else os.path.join(HDRI, 'bg-4k.jpg'))
jpg.image.colorspace_settings.name = 'sRGB'; jpg.interpolation = 'Cubic'
for t in (hdr, jpg): nt.links.new(mp.outputs['Vector'], t.inputs['Vector'])
bh = nt.nodes.new('ShaderNodeBackground'); bh.inputs['Strength'].default_value = HDR_K; nt.links.new(hdr.outputs['Color'], bh.inputs['Color'])
bj = nt.nodes.new('ShaderNodeBackground'); bj.inputs['Strength'].default_value = 1.0; nt.links.new(jpg.outputs['Color'], bj.inputs['Color'])
lp = nt.nodes.new('ShaderNodeLightPath'); mx = nt.nodes.new('ShaderNodeMixShader')
mth = nt.nodes.new('ShaderNodeMath'); mth.operation = 'MAXIMUM'
nt.links.new(lp.outputs['Is Camera Ray'], mth.inputs[0]); nt.links.new(lp.outputs['Is Glossy Ray'], mth.inputs[1])
nt.links.new(mth.outputs[0], mx.inputs['Fac']); nt.links.new(bh.outputs[0], mx.inputs[1]); nt.links.new(bj.outputs[0], mx.inputs[2])
nt.links.new(mx.outputs[0], out.inputs['Surface'])

# ---------- camera at the panorama's capture point ----------
cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = LENS; cam.data.sensor_width = 36
target = Vector((0, DIST, 0))
cam.location = (0, 0, H)
d = (target + Vector((0, 0, AIM))) - cam.location
cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

def srgb(c): return [pow(max(v, 0), 2.2) for v in c[:3]] + [1]

def principled(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    return m, m.node_tree.nodes.get('Principled BSDF')

def tex_set(bsdf, m, key, scale):
    d = os.path.join(TEX, key)
    if not TEX or not os.path.isdir(d): return
    nt2 = m.node_tree; tcn = nt2.nodes.new('ShaderNodeTexCoord'); mpn = nt2.nodes.new('ShaderNodeMapping'); mpn.inputs['Scale'].default_value = (1/scale,)*3
    nt2.links.new(tcn.outputs['Object'], mpn.inputs['Vector'])
    def img(kind, cs):
        n = nt2.nodes.new('ShaderNodeTexImage'); n.image = bpy.data.images.load(os.path.join(d, kind + '.jpg')); n.image.colorspace_settings.name = cs
        n.projection = 'BOX'; n.projection_blend = 0.2; nt2.links.new(mpn.outputs['Vector'], n.inputs['Vector']); return n
    nt2.links.new(img('diff', 'sRGB').outputs['Color'], bsdf.inputs['Base Color'])
    nt2.links.new(img('rough', 'Non-Color').outputs['Color'], bsdf.inputs['Roughness'])
    nm = nt2.nodes.new('ShaderNodeNormalMap'); nt2.links.new(img('nor', 'Non-Color').outputs['Color'], nm.inputs['Color']); nt2.links.new(nm.outputs['Normal'], bsdf.inputs['Normal'])

def water_bump(m, bsdf, sx, sz, strength):
    nt2 = m.node_tree; tcn = nt2.nodes.new('ShaderNodeTexCoord'); mpn = nt2.nodes.new('ShaderNodeMapping'); mpn.inputs['Scale'].default_value = (sx, sx, sz)
    nt2.links.new(tcn.outputs['Object'], mpn.inputs['Vector'])
    nz = nt2.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6; nz.inputs['Detail'].default_value = 6; nz.inputs['Roughness'].default_value = 0.55
    nt2.links.new(mpn.outputs['Vector'], nz.inputs['Vector'])
    bp = nt2.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = strength; bp.inputs['Distance'].default_value = 0.02
    nt2.links.new(nz.outputs['Fac'], bp.inputs['Height']); nt2.links.new(bp.outputs['Normal'], bsdf.inputs['Normal'])

def make_material(st, has_vc):
    t = st.get('type', 0); col = st.get('col', [0.8, 0.8, 0.8]); rough = st.get('rough', 0.5)
    if t == 1:
        m, b = principled('metal'); b.inputs['Base Color'].default_value = srgb(col); b.inputs['Metallic'].default_value = 1
        b.inputs['Roughness'].default_value = 0.3 if st.get('brush') else max(0.02, rough * 0.9)
        if st.get('brush'): b.inputs['Anisotropic'].default_value = 0.6
        return m
    if t == 2:
        m, b = principled('water'); wave = st.get('wave', 1)
        b.inputs['Base Color'].default_value = (1, 1, 1, 1); b.inputs['Roughness'].default_value = 0.01 if wave else 0.05
        b.inputs['Transmission Weight'].default_value = 1; b.inputs['IOR'].default_value = 1.333
        c = st.get('col', [0.1, 0.5, 0.6])
        if wave:
            water_bump(m, b, 1, 1, 0.06 * wave)
            va = m.node_tree.nodes.new('ShaderNodeVolumeAbsorption'); va.inputs['Color'].default_value = srgb([min(1, v * 1.1 + 0.3) for v in c]); va.inputs['Density'].default_value = 0.35
            m.node_tree.links.new(va.outputs[0], m.node_tree.nodes['Material Output'].inputs['Volume'])
        else:  # falling sheet of water: broken vertical streaks, partly see-through, aerated (whitish)
            nt2 = m.node_tree; outn = nt2.nodes['Material Output']
            b.inputs['Base Color'].default_value = (0.9, 0.96, 1, 1); b.inputs['Transmission Weight'].default_value = 0.55; b.inputs['Roughness'].default_value = 0.12
            water_bump(m, b, 40, 0.6, 0.5)
            tcn = nt2.nodes.new('ShaderNodeTexCoord'); mpn = nt2.nodes.new('ShaderNodeMapping'); mpn.inputs['Scale'].default_value = (28, 28, 0.7)
            nt2.links.new(tcn.outputs['Object'], mpn.inputs['Vector'])
            nz = nt2.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3; nz.inputs['Detail'].default_value = 8
            nt2.links.new(mpn.outputs['Vector'], nz.inputs['Vector'])
            cr = nt2.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position = 0.38; cr.color_ramp.elements[1].position = 0.62
            nt2.links.new(nz.outputs['Fac'], cr.inputs['Fac'])
            tr = nt2.nodes.new('ShaderNodeBsdfTransparent'); mix = nt2.nodes.new('ShaderNodeMixShader')
            nt2.links.new(cr.outputs['Color'], mix.inputs['Fac']); nt2.links.new(tr.outputs[0], mix.inputs[1]); nt2.links.new(b.outputs[0], mix.inputs[2])
            nt2.links.new(mix.outputs[0], outn.inputs['Surface'])
        return m
    if t == 3:
        m, b = principled('glass'); b.inputs['Base Color'].default_value = srgb(col); b.inputs['Roughness'].default_value = 0.0
        b.inputs['Transmission Weight'].default_value = 1; b.inputs['IOR'].default_value = 1.49; return m
    if t == 4:
        m = bpy.data.materials.new('led'); m.use_nodes = True; nt2 = m.node_tree; nt2.nodes.clear()
        o = nt2.nodes.new('ShaderNodeOutputMaterial'); e = nt2.nodes.new('ShaderNodeEmission')
        e.inputs['Color'].default_value = srgb(col); e.inputs['Strength'].default_value = st.get('emis', 1.5) * float(A.get('led', 1.0))
        nt2.links.new(e.outputs[0], o.inputs['Surface'])
        if st.get('cloud'):
            m2, b = principled('cloud'); b.inputs['Base Color'].default_value = (0.95, 0.96, 0.97, 1); b.inputs['Roughness'].default_value = 1
            b.inputs['Subsurface Weight'].default_value = 0.6; return m2
        return m
    m, b = principled('surface'); b.inputs['Base Color'].default_value = srgb(col); b.inputs['Roughness'].default_value = rough
    if has_vc:
        a = m.node_tree.nodes.new('ShaderNodeVertexColor'); mul = m.node_tree.nodes.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1
        mul.inputs[6].default_value = srgb(col); m.node_tree.links.new(a.outputs['Color'], mul.inputs[7]); m.node_tree.links.new(mul.outputs[2], b.inputs['Base Color'])
    return m

# ---------- product ----------
if not PROBE:
    bpy.ops.import_scene.gltf(filepath=GLB)
    objs = [o for o in sc.objects if o.type == 'MESH']
    root = [o for o in sc.objects if o.parent is None and o.type != 'CAMERA']
    for o in objs:
        st = json.loads(o.get('st', '{}'))
        o.data.materials.clear(); o.data.materials.append(make_material(st, len(o.data.color_attributes) > 0))
        for p in o.data.polygons: p.use_smooth = True
        if A.get('fixnormals') == '1':
            import bmesh
            bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
    # place on the ground in front of the camera, turned for a three-quarter view
    for r in root:
        r.rotation_mode = 'XYZ'; r.location = target; r.rotation_euler[2] += YAW
    # shadow catcher on the real ground
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, DIST, 0.0005)); pl = bpy.context.active_object; pl.is_shadow_catcher = True
    # a detailed ground that only reflections see (the photo's own ground is blurred below the camera)
    gk = A.get('ground')
    if gk:
        bpy.ops.mesh.primitive_circle_add(vertices=96, radius=9, fill_type='NGON', location=(0, DIST, 0.0012)); gd = bpy.context.active_object
        gm, gb = principled('ground'); tex_set(gb, gm, gk, float(A.get('gscale', 1.2))); gd.data.materials.append(gm)
        gd.visible_camera = False; gd.visible_shadow = False; gd.visible_diffuse = False; gd.visible_transmission = True; gd.visible_glossy = True

sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('WROTE', OUT)
