"""Blender CPU renders of the exact pool mesh used by the website.

blender -b -t 6 -P tools/render-steel-studio.py -- geometry.json output_directory
"""
import bpy
import json
import math
import sys
from pathlib import Path
from mathutils import Matrix, Vector

source_path, output_path = sys.argv[sys.argv.index('--') + 1:]
data = json.loads(Path(source_path).read_text())
destination = Path(output_path)
destination.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(spec, water=False):
    mat = bpy.data.materials.new('Water' if water else 'Pool finish')
    mat.diffuse_color = (*spec['colour'], 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*spec['colour'], 1)
    shader.inputs['Metallic'].default_value = spec['metallic']
    shader.inputs['Roughness'].default_value = spec['roughness']
    if spec['emission']:
        shader.inputs['Emission Color'].default_value = (*spec['colour'], 1)
        shader.inputs['Emission Strength'].default_value = 2.5
    if spec['brushed']:
        # Match the live shader's grey roughness-map multiplier.
        shader.inputs['Roughness'].default_value = spec['roughness'] * .60
        nodes = mat.node_tree.nodes
        wave = nodes.new('ShaderNodeTexWave')
        wave.bands_direction = 'Z'
        wave.inputs['Scale'].default_value = 210
        wave.inputs['Distortion'].default_value = 3
        bump = nodes.new('ShaderNodeBump')
        bump.inputs['Strength'].default_value = .07
        bump.inputs['Distance'].default_value = .002
        mat.node_tree.links.new(wave.outputs['Fac'], bump.inputs['Height'])
        mat.node_tree.links.new(bump.outputs['Normal'], shader.inputs['Normal'])
    if water:
        shader.inputs['Base Color'].default_value = (.09, .33, .31, 1)
        shader.inputs['Transmission Weight'].default_value = .64
        shader.inputs['Metallic'].default_value = .08
        shader.inputs['Roughness'].default_value = .09
        shader.inputs['IOR'].default_value = 1.333
        noise = mat.node_tree.nodes.new('ShaderNodeTexNoise')
        noise.inputs['Scale'].default_value = 24
        noise.inputs['Detail'].default_value = 2
        bump = mat.node_tree.nodes.new('ShaderNodeBump')
        bump.inputs['Strength'].default_value = .14
        bump.inputs['Distance'].default_value = .018
        mat.node_tree.links.new(noise.outputs['Fac'], bump.inputs['Height'])
        mat.node_tree.links.new(bump.outputs['Normal'], shader.inputs['Normal'])
    return mat

water_objects = []
for component in data['geometry']:
    p = component['positions']
    vertices = [Vector(p[i:i + 3]) for i in range(0, len(p), 3)]
    indices = component['indices'] or list(range(len(vertices)))
    faces = [tuple(indices[i:i + 3]) for i in range(0, len(indices), 3)]
    finish = material(component['material'], component['water'])
    for values in component['matrices']:
        world = Matrix([values[i::4] for i in range(4)])
        points = [world @ point for point in vertices]
        mesh = bpy.data.meshes.new('Website pool mesh')
        mesh.from_pydata([(v.x, -v.z, v.y) for v in points], [], faces)
        mesh.update()
        obj = bpy.data.objects.new('Pool component', mesh)
        bpy.context.collection.objects.link(obj)
        obj.data.materials.append(finish)
        for polygon in mesh.polygons:
            polygon.use_smooth = True
        if component['water']:
            water_objects.append(obj)

floor_material = bpy.data.materials.new('Pale limestone studio')
floor_material.diffuse_color = (.48, .57, .53, 1)
floor_material.use_nodes = True
floor_material.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value = .66
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -.022))
floor = bpy.context.object
floor.data.materials.append(floor_material)

def area(name, position, energy, size, colour, size_y=None):
    light = bpy.data.lights.new(name, 'AREA')
    light.energy = energy
    light.color = colour
    light.shape = 'RECTANGLE'
    light.size = size
    light.size_y = size_y or size
    obj = bpy.data.objects.new(name, light)
    bpy.context.collection.objects.link(obj)
    obj.location = position
    obj.rotation_euler = (Vector((0, 0, .5)) - obj.location).to_track_quat('-Z', 'Y').to_euler()

area('Large softbox', (-3, -2, 5), 1100, 4, (1, .94, .83), 3)
area('Cool edge reflection', (3, 1, 3), 1000, 3, (.76, .9, 1), 4)
area('Long rim reflection', (0, 4, 3), 700, 4, (1, 1, 1), .35)
area('Front fill', (1, -4, 2), 400, 3, (.88, 1, .98), 2)
negative_fill = bpy.data.materials.new('Studio reflection card')
negative_fill.diffuse_color = (.018, .025, .028, 1)
for position, scale in [((0, -4.5, 1.15), (4, 1.1, 1)), ((-4, 0, 1.7), (2.4, 1.6, 1))]:
    bpy.ops.mesh.primitive_plane_add(size=2, location=position)
    card = bpy.context.object
    card.scale = scale
    card.rotation_euler = (Vector((0, 0, .5)) - card.location).to_track_quat('Z', 'Y').to_euler()
    card.data.materials.append(negative_fill)
    card.visible_camera = False
    card.visible_shadow = False
world = bpy.context.scene.world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (.75, .85, .81, 1)
world.node_tree.nodes['Background'].inputs[1].default_value = .35

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 64
scene.cycles.use_denoising = False
scene.render.resolution_x = 1200
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.view_settings.view_transform = 'AgX'
scene.view_settings.exposure = -.20
bpy.ops.object.camera_add()
camera = bpy.context.object
scene.camera = camera
camera.data.lens = 42

for name in ['full', 'rim', 'seat', 'jet', 'drain']:
    v = data['views'][name]
    azimuth, lift, distance = v['azimuth'], v['lift'], v['distance']
    target = Vector((v.get('targetX', 0), -v.get('targetZ', 0), v['centre']))
    camera.location = target + Vector((distance * math.cos(lift) * math.sin(azimuth),
                                      -distance * math.cos(lift) * math.cos(azimuth),
                                      distance * math.sin(lift)))
    camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
    for obj in water_objects:
        obj.hide_render = name not in ['full', 'rim']
    scene.render.filepath = str(destination / (name + '.png'))
    bpy.ops.render.render(write_still=True)
    print('COMPLETED VIEW', name, flush=True)
