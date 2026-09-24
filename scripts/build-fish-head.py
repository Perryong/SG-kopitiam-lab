"""Run in Blender through MCP; exports only this isolated fish asset."""
import bpy, math, json, bmesh
from pathlib import Path
from mathutils import Vector
out=Path('/Users/perry/Documents/Code/singapore-culture/SG-kopitiam-lab/assets')
scene=bpy.data.scenes.new('Kopitiam Fish Head Curry')
collection=bpy.data.collections.new('Kopitiam Fish Head Asset')
scene.collection.children.link(collection)
materials={}
def material(color):
    if color not in materials:
        m=bpy.data.materials.new('Fish '+color);m.use_nodes=True
        rgb=tuple(int(color[i:i+2],16)/255 for i in (1,3,5))
        bsdf=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
        bsdf.inputs['Base Color'].default_value=(*rgb,1);bsdf.inputs['Roughness'].default_value=.43
        m.diffuse_color=(*rgb,1);materials[color]=m
    return materials[color]
def mesh(name,verts,faces,color):
    data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);data.update()
    obj=bpy.data.objects.new(name,data);collection.objects.link(obj);obj.data.materials.append(material(color));obj['web_color']=color
    for p in data.polygons:p.use_smooth=True
    return obj
def oval(name,center,scale,color,segments=24,rings=12):
    verts=[];faces=[]
    for j in range(rings+1):
        t=math.pi*j/rings
        for i in range(segments):
            a=2*math.pi*i/segments
            verts.append((center[0]+scale[0]*math.cos(a)*math.sin(t),center[1]+scale[1]*math.sin(a)*math.sin(t),center[2]+scale[2]*math.cos(t)))
    for j in range(rings):
        for i in range(segments):
            a=j*segments+i;b=j*segments+(i+1)%segments;faces.append((a,b,b+segments,a+segments))
    return mesh(name,verts,faces,color)
def line(name,points,r,color):
    verts=[];faces=[]
    for j,p in enumerate(points):
        p=Vector(p);t=Vector(points[min(j+1,len(points)-1)])-Vector(points[max(0,j-1)])
        t.normalize();u=t.cross(Vector((0,0,1)))
        if u.length<.01:u=t.cross(Vector((0,1,0)))
        u.normalize();v=t.cross(u)
        for k in range(8):
            q=p+r*(u*math.cos(k*math.tau/8)+v*math.sin(k*math.tau/8));verts.append(tuple(q))
    for j in range(len(points)-1):
        for k in range(8):
            a=j*8+k;b=j*8+(k+1)%8;faces.append((a,b,b+8,a+8))
    return mesh(name,verts,faces,color)
# Broad cut shoulder tapering to a distinct snout, rather than a whole-fish oval.
profiles=[(-1.04,.39,.50,.37),(-.85,.48,.60,.38),(-.48,.49,.63,.40),(-.05,.42,.57,.43),(.38,.32,.43,.45),(.72,.23,.28,.44),(.91,.17,.18,.39)]
verts=[];faces=[];n=40
for j,(x,w,h,z) in enumerate(profiles):
    for k in range(n):
        a=k*math.tau/n;texture=1+.022*math.sin(k*3+j*1.7)
        verts.append((x,w*math.cos(a)*texture,z+h*math.sin(a)*texture))
for j in range(len(profiles)-1):
    for k in range(n):
        a=j*n+k;b=j*n+(k+1)%n;faces.append((a,a+n,b+n,b))
faces.extend([tuple(reversed(range(n))),tuple((len(profiles)-1)*n+k for k in range(n))])
mesh('Snapper head cheek',verts,faces,'#b5a56c')
# Cut neck rim, gill plate, eye and fins remain clear from either orbit side.
for side in [-1,1]:
    oval('Gill cover',(-.42,side*.41,.40),(.47,.105,.48),'#bbaf79')
    line('Gill edge',[(-.44,side*.48,.87),(-.10,side*.50,.68),(.02,side*.49,.40),(-.18,side*.46,.04)],.022,'#847644')
    oval('Eye socket',(.42,side*.292,.65),(.175,.078,.17),'#d5a451')
    oval('Cooked eye',(.435,side*.35,.66),(.113,.041,.115),'#d8c78a')
    oval('Pupil',(.455,side*.389,.67),(.068,.025,.075),'#263024')
    oval('Eye glint',(.477,side*.411,.697),(.018,.008,.022),'#f0e5b8',12,8)
    fin=[(-.52,side*.42,.27),(-1.1,side*.94,-.12),(-.66,side*1.02,-.16),(-.28,side*.46,.08)]
    # A thin closed fin instead of a single backface-culled plane.
    fv=fin+[(x,y,z+.018) for x,y,z in fin]
    mesh('Pectoral fin',fv,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],'#b77832')
    for i in range(6):
        t=i/5;line('Fin ray',[(-.48,side*.45,.25),(-1.07+t*.42,side*(.94+t*.07),-.09)],.009,'#d5ab57')
    for row in range(6):
        for col in range(8):
            x=-.92+col*.095;z=.10+row*.12;y=side*(.46-.07*abs(row-2.5)/3)
            line('Cheek scale',[(x-.025,y,z),(x,y+side*.014,z+.018),(x+.027,y,z)],.006,'#cbbb7b')
oval('Mouth opening',(.92,0,.36),(.055,.185,.115),'#6b633d')
for upper in [False,True]:
    pts=[]
    for i in range(13):
        a=math.pi*i/12;pts.append((.955+.022*math.sin(a),.185*math.cos(a),.36+(.10 if upper else -.09)*math.sin(a)))
    line('Thick lip',pts,.037,'#d6bd7a')
# Curry flecks across the skin, sparse enough to retain the silver-gold cheek.
for i in range(35):
    x=-.87+(i%7)*.20;z=.2+(i//7)*.13
    oval('Curry seasoning',(x,.50-.10*max(0,x),z),(.018,.012,.014),'#bd742e',8,6)
bpy.context.view_layer.update()
# Evaluate meshes and emit an indexed asset consumed by the existing Three.js scene.
parts=[]
for obj in collection.objects:
    data=obj.data
    bm=bmesh.new();bm.from_mesh(data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(data);bm.free();data.update();data.calc_loop_triangles()
    positions=[];normals=[]
    for v in data.vertices:
        positions.extend(round(q,5) for q in (v.co.x,v.co.z,v.co.y))
        normals.extend(round(q,5) for q in (v.normal.x,v.normal.z,v.normal.y))
    indices=[]
    for t in data.loop_triangles:indices.extend((t.vertices[0],t.vertices[2],t.vertices[1]))
    parts.append(dict(name=obj.name,color=obj['web_color'],positions=positions,normals=normals,indices=indices))
(out/'fish-head-model.js').write_text('// Authored in Blender; regenerate with scripts/build-fish-head.py.\nexport default '+json.dumps(parts,separators=(',',':'))+';\n')
bpy.data.libraries.write(str(out/'fish-head.blend'),{scene})
if bpy.context.window:
    bpy.context.window.scene=scene
    for area in bpy.context.screen.areas:
        if area.type=='VIEW_3D':
            area.spaces.active.region_3d.view_location=Vector((0,0,.35));area.spaces.active.region_3d.view_distance=4.5
            area.spaces.active.shading.color_type='MATERIAL'
print(json.dumps({'objects':len(parts),'triangles':sum(len(p['indices'])//3 for p in parts),'export':str(out/'fish-head-model.js')}))
