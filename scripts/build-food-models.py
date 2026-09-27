"""Run in Blender through MCP. Imports Kiln-authored dish GLBs, paints vertex colour detail and exports web modules.
Kiln sources live in scripts/food-models/*.kiln.js (web-scene units). Part names start with the preparation step: 's2 Sambal'.
Set KILN_ASSETS to the Kiln asset store before running."""
import bpy, json, re, math
from pathlib import Path
from mathutils import Vector, noise
repo=Path('/Users/perry/Documents/Code/singapore-culture/SG-kopitiam-lab')
store=Path(globals().get('KILN_ASSETS','/Users/perry/kiln-assets/assets/kiln'))
DISHES={  # web module name: (Kiln asset id, revision id)
 'fried-chicken':('a_36db87492ad8465480df70b56a023b64','r_2d3f914305fa4ec596efc5772b5db73d'),
 'sambal-stingray':('a_d1ef5e8785d24df3a3084631b0f6bff8','r_3bd76080fa414e3da0338580e445db18'),
 'rojak':('a_0036514e683349189fd3abf31f905d42','r_4fd4aa2307544f7c8b7c1d718455ccc7'),
 'bak-chor-mee':('a_4fc7617fc25e40f78bfe3017c9cb61ed','r_8b4ab209e98f45918480f00e4705c4c6'),
 'orh-luak':('a_22f75033e1db432eb93cee18fe682226','r_ab2dfc31f34d4021983eaa45a2510db2'),
 'roast-meat':('a_c2e5a187f43a4bcb955c35aca9a3f802','r_25fec2f266334b05b6ae0de2df82263b'),
 'satay':('a_54f246ea3a914783bce7b66e1160ceb8','r_0c18a7d94c7b429f984605f16e9b9574'),
 'ice-kacang':('a_17b76f164381431ea23e07ba9dad3dd8','r_8624c009dcaa449dac43eeac0f444c32'),
 'char-kway-teow':('a_f37699157be64980be6e66e155be804f','r_3fce11c0891e40a7b5ce690ce9efc528'),
 'chilli-crab':('a_8d1e4c5bdaf84489a87c642d3052637e','r_d0cc7547ddbe4c11a02ff06d43ab294f'),
}
def hexlin(h):return [((int(h[i:i+2],16)/255+.055)/1.055)**2.4 for i in (1,3,5)]
# keyword: (mottle amplitude, noise frequency, optional (spot colour, threshold)), first match wins
PAINT=[('Lap cheong',(.12,30,('#f0d8c0',.5))),('Egg browned',(.3,8,('#8a5520',.3))),('Cockle frill',(.2,8,None)),('crust',(.45,5,('#3e170a',.3))),('Crumbs',(.25,12,None)),('Banana leaf',(.12,3,('#2a2112',.45))),
 ('Stingray wing',(.2,4,('#5a3218',.3))),('Sambal',(.3,7,('#5e140a',.3))),('Prawn paste',(.35,5,('#6b4220',.35))),
 ('Tau pok',(.25,6,('#8e5019',.3))),('Youtiao',(.25,6,('#8e5019',.3))),('Minced',(.2,15,None)),('Sliced pork',(.1,5,('#c89a86',.3))),
 ('shiitake',(.25,8,('#6b4a2c',.4))),('Batter',(.25,6,('#c89a4a',.35))),('Oyster mantle',(.2,10,None)),('Oyster',(.12,8,('#b8b09a',.4))),
 ('Browned',(.3,8,('#6a3510',.3))),('Crispy lace',(.3,8,('#a9621e',.35))),('Duck skin',(.35,6,('#3e1206',.35))),('Char siu rim',(.3,6,('#3a0e08',.4))),
 ('Satay meat',(.35,7,('#6a3510',.3))),('Ketupat',(.15,6,None)),('Shaved ice',(.05,8,None)),('Ice flakes',(.04,12,None)),('syrup',(.25,5,None)),('Gula',(.3,5,None)),
 ('Carapace',(.3,5,('#8a1e0c',.35))),('Claw',(.3,5,('#8a1e0c',.35))),('Pincer',(.3,5,('#8a1e0c',.35))),('Leg',(.25,5,('#e06a3a',.4))),('Gravy',(.25,6,('#a8340f',.35))),('Mantou',(.2,5,('#b87a2a',.35))),('Chilli sauce',(.3,6,('#5a1a0a',.3))),('peanuts',(.2,20,None)),('Liver',(.15,6,None))]
def paint(name,base,p,n):
    amp,freq,spot=next((v for k,v in PAINT if k.lower() in name.lower()),(.08,6,None))
    q=Vector(p)*freq;shade=1+amp*noise.noise(q)
    if 'Banana leaf' in name:shade*=1+.12*math.sin(p[0]*45)
    if 'Ketupat' in name and 'rice' not in name:shade*=1+.15*math.copysign(1,math.sin(p[0]*30)*math.sin(p[2]*30))
    c=[min(1,max(0,b*shade)) for b in base]
    if spot:
        t=max(0,min(1,(noise.noise(q*.7+Vector((7,3,1)))-spot[1])*4))
        c=[a*(1-t)+s*t for a,s in zip(c,hexlin(spot[0]))]
    return [round(v,3) for v in c]
def convert(key,glb):
    for old in [s for s in bpy.data.scenes if s.name=='Food '+key]:
        for o in list(old.objects):bpy.data.objects.remove(o)
        bpy.data.scenes.remove(old)
    scene=bpy.data.scenes.new('Food '+key);bpy.context.window.scene=scene
    bpy.ops.import_scene.gltf(filepath=str(glb))
    parts=[]
    for obj in sorted([o for o in scene.objects if o.type=='MESH'],key=lambda o:o.name):
        mat=obj.active_material;bsdf=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
        base=list(bsdf.inputs['Base Color'].default_value[:3])
        m=re.match(r'Mesh_s(\d) (.*?)(:primitive.*)?$',obj.name.split('.')[0]);step,name=int(m[1]),m[2]
        ev=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());data=ev.to_mesh();data.transform(obj.matrix_world);data.calc_loop_triangles()
        lookup={};pos=[];nor=[];col=[];idx=[]
        for t in data.loop_triangles:
            for v,sn in zip(t.vertices,t.split_normals):
                co=data.vertices[v].co;p=(round(co.x,3),round(co.z,3),round(-co.y,3));nn=(round(sn[0],2),round(sn[2],2),round(-sn[1],2))
                if p+nn not in lookup:lookup[p+nn]=len(pos)//3;pos.extend(p);nor.extend(nn);col.extend(paint(name,base,p,nn))
                idx.append(lookup[p+nn])
        ev.to_mesh_clear()
        parts.append(dict(step=step,name=name,roughness=round(bsdf.inputs['Roughness'].default_value,2),doubleSided=not mat.use_backface_culling,positions=pos,normals=nor,colors=col,indices=idx))
    out=repo/'assets'/f'{key}-model.js'
    out.write_text('// Authored in Kiln, painted and converted in Blender; regenerate with scripts/build-food-models.py.\nexport default '+json.dumps(parts,separators=(',',':'))+';\n')
    return dict(parts=len(parts),triangles=sum(len(p['indices'])//3 for p in parts),kb=out.stat().st_size//1024)
print(json.dumps({k:convert(k,store/a/'revisions'/r/'asset.glb') for k,(a,r) in DISHES.items()}))
