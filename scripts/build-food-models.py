"""Run in Blender through MCP. Imports Kiln-authored dish GLBs, paints vertex colour detail and exports web modules.
Kiln sources live in scripts/food-models/*.kiln.js (web-scene units). Part names start with the preparation step: 's2 Sambal'.
Set KILN_ASSETS to the Kiln asset store before running."""
import bpy, json, re, math
from pathlib import Path
from mathutils import Vector, noise
repo=Path('/Users/perry/Documents/Code/singapore-culture/SG-kopitiam-lab')
store=Path(globals().get('KILN_ASSETS','/Users/perry/kiln-assets/assets/kiln'))
DISHES={  # web module name: (Kiln asset id, revision id)
 'sambal-stingray':('a_d1ef5e8785d24df3a3084631b0f6bff8','r_7ab4ade354174e43bd7df193b5aa2bcc'),
 'rojak':('a_0036514e683349189fd3abf31f905d42','r_4fd4aa2307544f7c8b7c1d718455ccc7'),
 'bak-chor-mee':('a_4fc7617fc25e40f78bfe3017c9cb61ed','r_8b4ab209e98f45918480f00e4705c4c6'),
 'orh-luak':('a_22f75033e1db432eb93cee18fe682226','r_f269199bf0d14ed7aeaa0d878dd1764d'),
 'roast-meat':('a_c2e5a187f43a4bcb955c35aca9a3f802','r_25fec2f266334b05b6ae0de2df82263b'),
 'satay':('a_54f246ea3a914783bce7b66e1160ceb8','r_0c18a7d94c7b429f984605f16e9b9574'),
 'ice-kacang':('a_17b76f164381431ea23e07ba9dad3dd8','r_8624c009dcaa449dac43eeac0f444c32'),
 'char-kway-teow':('a_f37699157be64980be6e66e155be804f','r_4a5a473c8f8e4855a6605c341041d4f4'),
 'hokkien-mee':('a_5ca06fcd91f648ffa1c5f9370386f92e','r_a18d5d7a429440d38cc1835bbe866052'),
 'carrot-cake':('a_c2f5dece40d44bb9bdb94f8f631f35ab','r_039d0c3b025f41ada91c61ffd7edd635'),
 'chilli-crab':('a_8d1e4c5bdaf84489a87c642d3052637e','r_d0cc7547ddbe4c11a02ff06d43ab294f'),
}
def hexlin(h):return [((int(h[i:i+2],16)/255+.055)/1.055)**2.4 for i in (1,3,5)]
# keyword: (mottle amplitude, noise frequency, optional (spot colour, threshold)), first match wins
PAINT=[('Coconut rice bed',(.22,28,('#a8906a',.35))),('Golden crust',(.3,8,('#8a5520',.35))),('Egg layer',(.15,6,('#d99a30',.4))),('Radish cake',(.08,6,None)),('Stock glaze',(.15,5,None)),('Prawn stock',(.1,4,None)),('Chicken crust',(.4,9,('#4a1d0a',.3))),('Lap cheong',(.12,30,('#f0d8c0',.5))),('Egg browned',(.3,8,('#8a5520',.3))),('Cockle frill',(.2,8,None)),('crust',(.45,5,('#3e170a',.3))),('Crumbs',(.25,12,None)),('Banana leaf',(.12,3,('#2a2112',.45))),
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
def texture_of(mat):
    """Image texture feeding Base Color, if any (Sketchfab scans are textured)."""
    bsdf=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    link=next((l for l in mat.node_tree.links if l.to_socket==bsdf.inputs['Base Color']),None)
    node=link.from_node if link else None
    while node and node.type!='TEX_IMAGE' and node.inputs and any(i.is_linked for i in node.inputs):
        node=next(i.links[0].from_node for i in node.inputs if i.is_linked)
    return node.image if node and node.type=='TEX_IMAGE' else None
def save_texture(image,key,size=2048):
    out=repo/'assets'/'textures'/f'{key}.jpg';out.parent.mkdir(exist_ok=True)
    if out in saved:return saved[out]
    img=image.copy();w,h=img.size
    if max(w,h)>size:img.scale(size*w//max(w,h),size*h//max(w,h))
    img.filepath_raw=str(out);img.file_format='JPEG';img.save();bpy.data.images.remove(img)
    saved[out]=f'assets/textures/{key}.jpg';return saved[out]
saved={}
def export(key,objects,note='Authored in Kiln, painted and converted in Blender; regenerate with scripts/build-food-models.py.'):
    parts=[]
    for obj in objects:
        mat=obj.active_material;bsdf=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
        base=list(bsdf.inputs['Base Color'].default_value[:3])
        m=re.match(r'Mesh_s(\d) (.*?)(:primitive.*)?$',obj.name.split('.')[0]);step,name=int(m[1]),m[2]
        image=texture_of(mat)
        data=obj.to_mesh();data.transform(obj.matrix_world);data.calc_loop_triangles()  # original mesh: works without the scene being active
        uvl=data.uv_layers.active.data if (image is not None and data.uv_layers.active is not None) else None
        ca=data.color_attributes.active_color if uvl is None else None  # scanned vertex colours win over painting
        lookup={};pos=[];nor=[];col=[];uvs=[];idx=[]
        for t in data.loop_triangles:
            for v,sn,li in zip(t.vertices,t.split_normals,t.loops):
                co=data.vertices[v].co;p=(round(co.x,3),round(co.z,3),round(-co.y,3));nn=(round(sn[0],2),round(sn[2],2),round(-sn[1],2))
                uv=(round(uvl[li].uv[0],4),round(uvl[li].uv[1],4)) if uvl is not None else ()
                k=p+nn+uv
                if k not in lookup:
                    lookup[k]=len(pos)//3;pos.extend(p);nor.extend(nn);uvs.extend(uv)
                    if ca is not None:col.extend(round(x,3) for x in ca.data[li if ca.domain=='CORNER' else v].color[:3])
                    elif uvl is None:col.extend(paint(name,base,p,nn))
                idx.append(lookup[k])
        obj.to_mesh_clear()
        part=dict(step=step,name=name,roughness=round(bsdf.inputs['Roughness'].default_value,2),doubleSided=not mat.use_backface_culling,positions=pos,normals=nor,indices=idx)
        if uvl is not None:part.update(uvs=uvs,map=save_texture(image,f"{key}-{re.sub('[^a-z0-9]+','-',image.name.lower()).strip('-')}"))
        else:part['colors']=col
        parts.append(part)
    out=repo/'assets'/f'{key}-model.js'
    out.write_text('// '+note+'\nexport default '+json.dumps(parts,separators=(',',':'))+';\n')
    return dict(parts=len(parts),triangles=sum(len(p['indices'])//3 for p in parts),kb=out.stat().st_size//1024)
def convert(key,glb):
    for old in [s for s in bpy.data.scenes if s.name=='Food '+key]:
        for o in list(old.objects):bpy.data.objects.remove(o)
        bpy.data.scenes.remove(old)
    scene=bpy.data.scenes.new('Food '+key);bpy.context.window.scene=scene
    bpy.ops.import_scene.gltf(filepath=str(glb))
    return export(key,sorted([o for o in scene.objects if o.type=='MESH'],key=lambda o:o.name))
if globals().get('RUN_ALL',True):
    print(json.dumps({k:convert(k,store/a/'revisions'/r/'asset.glb') for k,(a,r) in DISHES.items()}))
# Sketchfab scan: "Hainanese Chicken Rice" by nhbheritage (CC-BY 4.0), uid 6a0d0aa3851849508f584248f96cd417.
# Import it with Blender MCP download_sketchfab_model(uid, target_size=5) into the active scene, then set RUN_ALL=False and CHICKEN_RICE=True.
CHICKEN_RICE_PARTS={18:(0,'Rice bowl'),4:(1,'Blue floral plate'),13:(1,'Cucumber 1'),14:(1,'Cucumber 2'),15:(1,'Cucumber 3'),16:(1,'Cucumber 4'),
 1:(2,'Poached chicken 1'),2:(2,'Poached chicken 2'),5:(2,'Poached chicken 3'),6:(2,'Poached chicken 4'),7:(2,'Poached chicken 5'),8:(2,'Poached chicken 6'),9:(2,'Poached chicken 7'),
 19:(2,'Coriander 1'),20:(2,'Coriander 2'),21:(2,'Coriander 3'),22:(2,'Coriander 4'),3:(3,'Soy dressing'),10:(3,'Dark soy saucer'),17:(3,'Dark soy'),11:(3,'Ginger saucer'),23:(3,'Ginger paste'),12:(3,'Chilli saucer'),24:(3,'Chilli sauce')}
if globals().get('CHICKEN_RICE'):
    objs=[]
    for n,(step,label) in CHICKEN_RICE_PARTS.items():
        o=bpy.data.objects[f'Chicken_Rice_Arranged{n}_Chicken_Rice_0'];o.name=f'Mesh_s{step} {label}';objs.append(o)
    # Plate centred on the origin; plate foot at the old drawn plate's base (-.175 below the ingredient groups).
    for o in [o for o in bpy.context.scene.objects if not o.parent]:o.location+=Vector((-.3,.77,-.175))
    bpy.context.view_layer.update()
    print(json.dumps(export('chicken-rice',objs,'Sketchfab scan "Hainanese Chicken Rice" by nhbheritage (CC-BY 4.0), split and converted in Blender; regenerate with scripts/build-food-models.py.')))
# Sketchfab scan: "Food (Delicious Nasi lemak)" by SculptEon (CC-BY 4.0), uid 4625dae3b0814c57bbc7ba24ce2bed95, download target_size=4.6.
# The food is one textured shell: decimate, split faces by position/height/texture colour into steps, drop the takeaway tray and add a domed rice mound under it so it sits on the drawn plate.
# The split and rice bed were done interactively via Blender MCP; with Mesh_sN objects in the active scene, set NASI_LEMAK=True.
if globals().get('NASI_LEMAK'):
    for o in [o for o in bpy.context.scene.objects if not o.parent]:o.location+=Vector((.04,-.02,-.205))
    bpy.context.view_layer.update()
    objs=sorted([o for o in bpy.context.scene.objects if o.name.startswith('Mesh_s') and o.type=='MESH'],key=lambda o:o.name)
    print(json.dumps(export('nasi-lemak',objs,'Sketchfab scan "Food (Delicious Nasi lemak)" by SculptEon (CC-BY 4.0), decimated, split and converted in Blender; regenerate with scripts/build-food-models.py.')))
# Chilli crab: step 0 is a Sketchfab scan, "The boiled Korean snow crab" by kevinhsp1215 (CC-BY 4.0), uid dc7d087cadb64044a112dc94cfcba077.
# Its 4.4M-face vertex-coloured shell was welded, solidified, voxel-remeshed, decimated, given its colours back with a Data Transfer
# modifier, graded to cooked red and fitted to the Kiln crab's footprint as 'Mesh_s0 Cooked crab' (done interactively via Blender MCP).
# Steps 1-3 (gravy, egg ribbons, herbs, mantou) stay Kiln: convert('chilli-crab', ...) first, then set CHILLI_CRAB=True.
if globals().get('CHILLI_CRAB'):
    kiln=[o for o in bpy.data.scenes['Food chilli-crab'].objects if o.type=='MESH' and not o.name.startswith('Mesh_s0')]
    print(json.dumps(export('chilli-crab',sorted([bpy.data.objects['Mesh_s0 Cooked crab'],*kiln],key=lambda o:o.name),'Crab: Sketchfab scan "The boiled Korean snow crab" by kevinhsp1215 (CC-BY 4.0), remeshed in Blender. Sauce, herbs and mantou: authored in Kiln. Regenerate with scripts/build-food-models.py.')))
