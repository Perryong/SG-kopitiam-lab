"""Run in Blender through MCP. Imports the Kiln-authored hawker table GLB and exports the web asset.
Kiln source: Kiln project asset "Singapore hawker table setting" (metres, table top at Y=0.9).
Web scene units are 10x Kiln metres with the table top at y=0."""
import bpy, json, sys
from pathlib import Path
repo=Path('/Users/perry/Documents/Code/singapore-culture/SG-kopitiam-lab')
glb=Path(sys.argv[-1]) if sys.argv[-1].endswith('.glb') else Path(globals().get('GLB_PATH',''))
SCALE,TOP=10,.9
for old in [s for s in bpy.data.scenes if s.name.startswith('Kopitiam Hawker Table')]:
    for o in list(old.objects):bpy.data.objects.remove(o)
    bpy.data.scenes.remove(old)
scene=bpy.data.scenes.new('Kopitiam Hawker Table')
bpy.context.window.scene=scene
bpy.ops.import_scene.gltf(filepath=str(glb))
parts=[]
for obj in [o for o in scene.objects if o.type=='MESH']:
    mat=obj.active_material
    bsdf=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    rgb=[round(c**(1/2.2)*255) for c in bsdf.inputs['Base Color'].default_value[:3]]
    evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());data=evaluated.to_mesh()
    data.transform(obj.matrix_world);data.calc_loop_triangles()
    # Blender Z-up back to web Y-up; keep glTF split normals by deduplicating corners.
    lookup={};positions=[];normals=[];indices=[]
    for t in data.loop_triangles:
        tri=[]
        for v,n in zip(t.vertices,t.split_normals):
            co=data.vertices[v].co
            p=(round(co.x*SCALE,3),round((co.z-TOP)*SCALE,3),round(-co.y*SCALE,3))
            nn=(round(n[0],2),round(n[2],2),round(-n[1],2))
            key=p+nn
            if key not in lookup:lookup[key]=len(positions)//3;positions.extend(p);normals.extend(nn)
            tri.append(lookup[key])
        indices.extend(tri)
    evaluated.to_mesh_clear()
    name=obj.name.removeprefix('Mesh_').split(':')[0].split('.')[0]
    parts.append(dict(name=name,color='#%02x%02x%02x'%tuple(rgb),roughness=round(bsdf.inputs['Roughness'].default_value,2),metalness=round(bsdf.inputs['Metallic'].default_value,2),positions=positions,normals=normals,indices=indices))
(repo/'assets/hawker-table-model.js').write_text('// Authored in Kiln, converted in Blender; regenerate with scripts/build-hawker-table.py.\nexport default '+json.dumps(parts,separators=(',',':'))+';\n')
bpy.data.libraries.write(str(repo/'assets/hawker-table.blend'),{scene})
print(json.dumps({'objects':len(parts),'triangles':sum(len(p['indices'])//3 for p in parts)}))
