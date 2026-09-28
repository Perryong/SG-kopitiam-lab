import * as THREE from './vendor/three.module.js';
import fishHeadModel from './assets/fish-head-model.js';
import hawkerTableModel from './assets/hawker-table-model.js';
// Kiln-authored dishes painted in Blender; loaded on demand because each module is several hundred KB.
const modelFiles={'sambal-stingray':()=>import('./assets/sambal-stingray-model.js'),'rojak':()=>import('./assets/rojak-model.js'),'bak-chor-mee':()=>import('./assets/bak-chor-mee-model.js'),'orh-luak':()=>import('./assets/orh-luak-model.js'),'roast-meat':()=>import('./assets/roast-meat-model.js'),'satay':()=>import('./assets/satay-model.js'),'ice-kacang':()=>import('./assets/ice-kacang-model.js'),'chilli-crab':()=>import('./assets/chilli-crab-model.js'),'char-kway-teow':()=>import('./assets/char-kway-teow-model.js'),'hokkien-mee':()=>import('./assets/hokkien-mee-model.js'),'carrot-cake':()=>import('./assets/carrot-cake-model.js'),'chicken-rice':()=>import('./assets/chicken-rice-model.js'),'nasi-lemak':()=>import('./assets/nasi-lemak-model.js')};
const modelKinds={'cr-rice':['chicken-rice',0],'cr-cucumber':['chicken-rice',1],'cr-chicken':['chicken-rice',2],'cr-sauce':['chicken-rice',3],'nl-rice':['nasi-lemak',0,{turn:Math.PI,at:[0,-.2,0],scale:.82}],'nl-chicken':['nasi-lemak',1,{turn:Math.PI,at:[0,-.2,0],scale:.82}],'nl-egg-cucumber':['nasi-lemak',2,{turn:Math.PI,at:[0,-.2,0],scale:.82}],'nl-sambal':['nasi-lemak',3,{turn:Math.PI,at:[0,-.2,0],scale:.82}],'stingray-leaf':['sambal-stingray',0],'stingray-wing':['sambal-stingray',1],'stingray-sambal':['sambal-stingray',2],'stingray-garnish':['sambal-stingray',3],
 'rojak-fruit':['rojak',0],'rojak-fritters':['rojak',1],'rojak-sauce':['rojak',2],'rojak-peanuts':['rojak',3],'bcm-toppings':['bak-chor-mee',1],'bcm-sauce':['bak-chor-mee',2],'bcm-garnish':['bak-chor-mee',3],
 'orh-egg':['orh-luak',0],'orh-oysters':['orh-luak',1],'orh-sear':['orh-luak',2],'orh-garnish':['orh-luak',3],'roast-duck':['roast-meat',1],'roast-char-siu':['roast-meat',2],'roast-cucumber':['roast-meat',3],
 'satay-skewers':['satay',0],'satay-char':['satay',1],'satay-peanut-dip':['satay',2],'satay-sides':['satay',3],'beans':['ice-kacang',0],'ice':['ice-kacang',1],'syrup':['ice-kacang',2],'corn':['ice-kacang',3],
 'crab':['chilli-crab',0],'crab-sauce':['chilli-crab',1],'crab-herbs':['chilli-crab',2],'mantou':['chilli-crab',3],
 'ckt-egg-sausage':['char-kway-teow',1],'ckt-sauce':['char-kway-teow',2],'ckt-sprouts':['char-kway-teow',3],
 'hokkien-toss':['hokkien-mee',2],'cc-cubes':['carrot-cake',0],'cc-egg':['carrot-cake',1],'cc-sear':['carrot-cake',2],'cc-scallions':['carrot-cake',3]};
const models={},textureLoader=new THREE.TextureLoader();
export async function loadFoodModels(id){for(const step of preparations[id]?.steps||[]){const file=modelKinds[step.kind]?.[0];if(file&&!models[file])models[file]=(await modelFiles[file]()).default;}}
import {preparations} from './data/preparations.js';
export {preparations};
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export function createFoodScene(parent,id){
 const recipe=preparations[id];if(!recipe)throw new Error('Unknown food: '+id);
 const root=new THREE.Group();parent.add(root);const ingredients=[],materials=new Map();
 // Small deterministic surface maps keep the animated ingredients lightweight.
 const textureData=new Uint8Array(128*128*4);
 let seed=731;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4,v=Math.round(180+random()*50+18*Math.sin(x*.36+Math.sin(y*.21)*3));textureData.set([v,v,v,255],i);}
 const surface=new THREE.DataTexture(textureData,128,128);surface.wrapS=surface.wrapT=THREE.RepeatWrapping;surface.magFilter=surface.minFilter=THREE.LinearFilter;surface.needsUpdate=true;
 const foodMat=(color,roughness=.48)=>{const key='food:'+color+roughness;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness,bumpMap:surface,bumpScale:.018,roughnessMap:surface}));return materials.get(key);};
 const organic=new THREE.SphereGeometry(1,24,16),vertices=organic.attributes.position;
 for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i),f=1+.045*Math.sin(x*13+y*7)*Math.sin(z*11-y*5)+.025*Math.sin(y*19+z*8);vertices.setXYZ(i,x*f,y*f,z*f);}
 organic.computeVertexNormals();
 const sphere=new THREE.SphereGeometry(1,20,14),cube=new THREE.BoxGeometry(1,1,1);
 const mat=(color,roughness=.55)=>{const key=color+':'+roughness;if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness}));return materials.get(key);};
 function mesh(geo,color,x=0,y=0,z=0,group=root){const m=new THREE.Mesh(geo,typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;}
 function oval(g,color,x,y,z,sx,sy,sz){const m=mesh(sphere,color,x,y,z,g);m.scale.set(sx,sy,sz);return m;}
 function morsel(g,color,x,y,z,sx,sy,sz){const m=mesh(organic,foodMat(color),x,y,z,g);m.scale.set(sx,sy,sz);return m;}
 function box(g,color,x,y,z,sx,sy,sz){const m=mesh(cube,color,x,y,z,g);m.scale.set(sx,sy,sz);return m;}
 function cyl(g,color,x,y,z,r,h){return mesh(new THREE.CylinderGeometry(r,r,h,40),color,x,y,z,g);}
 function tube(g,color,points,r=.04){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),28,r,7,false),color,0,0,0,g);}
 function ring(g,color,x,y,z,r,t=.025){const m=mesh(new THREE.TorusGeometry(r,t,8,56),color,x,y,z,g);m.rotation.x=Math.PI/2;return m;}
 const bowl=['bowl','claypot'].includes(recipe.vessel),pan=['wok','pan'].includes(recipe.vessel),base=bowl?.68:pan?.38:.24;
 // Kiln-authored hawker table (terrazzo top, stools, condiments, kopi); top surface sits under the vessel foot.
 const table=new THREE.Group();table.name='Hawker table';table.position.y=.06;root.add(table);
 for(const part of hawkerTableModel){
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(part.normals,3));geometry.setIndex(part.indices);
  const piece=mesh(geometry,new THREE.MeshStandardMaterial({color:part.color,roughness:part.roughness,metalness:part.metalness}),0,0,0,table);piece.name=part.name;
 }
 if(bowl||pan){
  const color=recipe.vessel==='claypot'?'#805137':pan?'#343935':'#f7efdf';
  const profile=[[0,.06],[1.05,.06],[1.48,.30],[1.85,bowl?.91:.57],[1.9,bowl?.94:.60],[1.82,bowl?.99:.64],[1.74,bowl?.85:.52],[1.35,.32],[.95,.23],[0,.23]].map(p=>new THREE.Vector2(...p));
  mesh(new THREE.LatheGeometry(profile,64),color);ring(root,pan?'#62635b':'#365f6c',0,bowl?.975:.625,0,1.84);
  if(pan){box(root,'#514432',2.3,.48,0,1.4,.15,.23);ring(root,'#55574f',-2,.5,0,.26,.06);}
  if(recipe.vessel==='claypot')for(const x of [-2,2]){const h=ring(root,'#73472f',x,.66,0,.32,.09);h.scale.z=.7;}
 }else if(recipe.vessel==='grill'){
  box(root,'#30312d',0,.09,0,4.3,.20,3.65);for(let i=0;i<13;i++)box(root,'#777873',-1.9+i*.32,.24,0,.055,.05,3.4);
 }else if(recipe.vessel==='board'){cyl(root,'#bd8f56',0,.12,0,2.4,.16);}
 else if(recipe.vessel!=='scan'){cyl(root,'#f7efdf',0,.12,0,2.35,.11);ring(root,'#416775',0,.20,0,2.19);ring(root,'#fff6e5',0,.18,0,2.31,.045);}
 function scatter(g,n,color,r=1.2,size=.06,y=.1){for(let i=0;i<n;i++){const a=i*2.39996,d=r*Math.sqrt((i+.5)/n);const m=oval(g,color,Math.cos(a)*d,y+(i%3)*.022,Math.sin(a)*d,size,size*.65,size*.6);m.rotation.y=a;}}
 // Seeded per dish part so rebuilds, replay and scrubbing stay identical.
 const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const tintMat=(key,roughness,bumpScale)=>{if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color:'#fff',vertexColors:key.startsWith('strand'),roughness,bumpMap:surface,bumpScale}));return materials.get(key);};
 function rice(g){
  // Individual grains packed over a moulded dome; a darker core reads as shadow between grains.
  const tint=new THREE.Color('#f5efe2'),r=rng(4242),a=.77,c=.43,cx=-.55,y0=.21,count=1100,loose=26;
  oval(g,foodMat('#d8ceb6',.7),cx,y0,0,a*.95,c*.93,a*.95);
  const grains=new THREE.InstancedMesh(new THREE.CapsuleGeometry(.025,.07,3,8),tintMat('rice',.42,.004),count);grains.castShadow=grains.receiveShadow=true;g.add(grains);
  const p=new THREE.Vector3(),n=new THREE.Vector3(),t=new THREE.Vector3(),b=new THREE.Vector3(),q=new THREE.Quaternion(),tilt=new THREE.Quaternion(),basis=new THREE.Matrix4(),m=new THREE.Matrix4(),size=new THREE.Vector3(),color=new THREE.Color(),X=new THREE.Vector3(1,0,0);
  for(let i=0;i<count;i++){
   const ang=i*2.39996+r()*.3;
   if(i<count-loose){
    const y=1-(i+.5)/(count-loose)*1.55,ring=Math.sqrt(Math.max(0,1-y*y)),lump=1+.035*Math.sin(ang*3+y*5)+(r()-.5)*.03;
    const dx=Math.cos(ang)*ring,dz=Math.sin(ang)*ring;
    n.set(dx/a,y/c,dz/a).normalize();p.set(cx+a*dx*lump,y0+c*y*lump,a*dz*lump).addScaledVector(n,.012);
    t.set(r()-.5,(r()-.5)*.6,r()-.5);t.addScaledVector(n,-t.dot(n)).normalize();
   }else{const side=Math.PI/2+r()*Math.PI,d=a*(1.05+r()*.35);p.set(cx+Math.cos(side)*d,-.045,Math.sin(side)*d);n.set(0,1,0);t.set(Math.cos(ang),0,Math.sin(ang));}
   b.crossVectors(t,n);basis.makeBasis(b,t,n);q.setFromRotationMatrix(basis).multiply(tilt.setFromAxisAngle(X,(r()-.5)*.7));
   const k=.85+r()*.3;m.compose(p,q,size.set(k,k*(.9+r()*.2),k));grains.setMatrixAt(i,m);grains.setColorAt(i,color.copy(tint).multiplyScalar(.92+r()*.1));
  }
 }
 function strands(g,{count,radius,width=radius,colors,curl=0,R=1.4,peak=.17,len=3,seed=7,roughness=.38,wander=.45,sink=0}){
  // Long strands wander in a loose swirl over a heap; flat ribbons twist as they fold.
  const r=rng(seed),pos=[],nor=[],uv=[],col=[],idx=[],c=new THREE.Color(),up=new THREE.Vector3(0,1,0),side=new THREE.Vector3(),top=new THREE.Vector3(),sd=new THREE.Vector3(),tp=new THREE.Vector3(),tan=new THREE.Vector3(),pt=new THREE.Vector3(),normal=new THREE.Vector3(),K=8;
  const height=d=>peak*Math.max(0,1-(d/R)**2)+.015;
  for(let i=0;i<count;i++){
   const d0=R*Math.sqrt(r()),a0=r()*Math.PI*2,depth=r()*.12,phase=r()*6,step=.07,steps=Math.round(len*(.7+r()*.6)/step);
   let x=Math.cos(a0)*d0,z=Math.sin(a0)*d0,heading=a0+Math.PI/2+(r()-.5)*1.4;const points=[];
   for(let j=0;j<steps;j++){
    heading+=(r()-.5)*wander+.05;x+=Math.cos(heading)*step;z+=Math.sin(heading)*step;
    const dd=Math.hypot(x,z);if(dd>R){x*=R/dd;z*=R/dd;heading=Math.atan2(-z,-x)+(r()-.5)*1.6;}
    const w=curl*Math.sin(j*1.1+phase);
    points.push(new THREE.Vector3(x-Math.sin(heading)*w,height(Math.hypot(x,z))-depth-sink+curl*.5*Math.cos(j*1.1+phase)+Math.sin(j*.35+phase)*.02,z+Math.cos(heading)*w));
   }
   const curve=new THREE.CatmullRomCurve3(points),samples=steps*2,base=pos.length/3;c.set(colors[i%colors.length]).multiplyScalar(.9+r()*.15);
   for(let k=0;k<=samples;k++){
    const u=k/samples,taper=.35+.65*Math.min(1,k/2,(samples-k)/2),twist=width===radius?0:.5*Math.sin(u*6+phase),shade=.94+.1*Math.sin(u*9+phase);
    curve.getPointAt(u,pt);curve.getTangentAt(u,tan);side.crossVectors(tan,up);if(side.lengthSq()<1e-6)side.set(1,0,0);side.normalize();top.crossVectors(side,tan).normalize();
    sd.copy(side).multiplyScalar(Math.cos(twist)).addScaledVector(top,Math.sin(twist));tp.copy(top).multiplyScalar(Math.cos(twist)).addScaledVector(side,-Math.sin(twist));
    for(let e=0;e<K;e++){const ca=Math.cos(e/K*Math.PI*2),sa=Math.sin(e/K*Math.PI*2);
     pos.push(pt.x+(sd.x*ca*width+tp.x*sa*radius)*taper,pt.y+(sd.y*ca*width+tp.y*sa*radius)*taper,pt.z+(sd.z*ca*width+tp.z*sa*radius)*taper);
     normal.copy(sd).multiplyScalar(ca/width).addScaledVector(tp,sa/radius).normalize();nor.push(normal.x,normal.y,normal.z);uv.push(e/K,u*len*3);col.push(c.r*shade,c.g*shade,c.b*shade);
     if(k<samples){const a0=base+k*K+e,a1=base+k*K+(e+1)%K;idx.push(a0,a0+K,a1,a1,a0+K,a1+K);}
    }
   }
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geometry.setIndex(idx);
  return mesh(geometry,tintMat('strand:'+roughness,roughness,.006),0,0,0,g);
 }
 function model(g,[file,step,{pivot=[0,0],at=[0,0,0],scale=1,turn=0}={}]){
  if(!models[file])throw new Error('Call loadFoodModels before creating '+id);
  const holder=new THREE.Group();holder.position.set(...at);holder.rotation.y=turn;holder.scale.setScalar(scale);g.add(holder);
  for(const part of models[file].filter(p=>p.step===step)){
   const geometry=new THREE.BufferGeometry(),pos=part.positions;let uv=part.uvs;
   if(!uv){uv=new Float32Array(pos.length/3*2);for(let i=0,j=0;i<pos.length;i+=3,j+=2){uv[j]=pos[i]*.7;uv[j+1]=(pos[i+2]+pos[i+1])*.7;}}
   geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(part.normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(part.indices);
   if(part.colors)geometry.setAttribute('color',new THREE.Float32BufferAttribute(part.colors,3));
   // Scanned parts carry a photo texture; authored parts carry painted vertex colours.
   const map=part.map&&typeof document!=='undefined'?textureLoader.load(part.map,t=>{t.colorSpace=THREE.SRGBColorSpace;}):null;
   const material=new THREE.MeshStandardMaterial({vertexColors:!!part.colors,map,roughness:part.roughness,side:part.doubleSided?THREE.DoubleSide:THREE.FrontSide,bumpMap:surface,bumpScale:part.map?.002:.01});
   const piece=mesh(geometry,material,-pivot[0],0,-pivot[1],holder);piece.name=part.name;
  }
 }
 const noodleStyles={
  'laksa-noodles':[{count:55,radius:.03,colors:['#e8c25a','#dfb24a','#efcf72'],len:4.5,seed:11,roughness:.3,peak:.16,R:1.25,wander:.22,sink:.1}],
  'yellow-noodles':[{count:150,radius:.016,colors:['#e6c261','#dcb04c','#edcf7a'],curl:.035,len:2.8,seed:21,roughness:.4}],
  'flat-noodles':[{count:58,radius:.011,width:.085,colors:['#7a4520','#5e3217','#94602f','#b8875a'],len:2.8,seed:31,roughness:.28,peak:.15}],
  'mee-pok':[{count:60,radius:.01,width:.05,colors:['#e0a94a','#d4903a','#e8b85a'],len:2.8,seed:51,roughness:.32}],
  'mixed-noodles':[{count:80,radius:.024,colors:['#d9b04e','#cfa244'],len:3,seed:41,roughness:.32},{count:60,radius:.02,colors:['#efe3c6'],len:3,seed:43,roughness:.32,peak:.19}]
 };
 function prawn(g,x,z){
  const p=new THREE.Group();p.position.set(x,.24,z);p.rotation.y=x*2;g.add(p);
  for(let j=0;j<9;j++){const a=j*.31,r=.29,taper=1-j*.055;
   const m=morsel(p,j%2?'#eea17b':'#f2bb8f',Math.cos(a)*r,.015,Math.sin(a)*r,.12*taper,.125*taper,.13*taper);m.rotation.y=-a;
   tube(p,foodMat('#d97550',.4),[[Math.cos(a)*r-.03,.10*taper,Math.sin(a)*r-.055],[Math.cos(a)*r,.13*taper,Math.sin(a)*r],[Math.cos(a)*r+.03,.09*taper,Math.sin(a)*r+.055]],.011);}
  for(let i=-1;i<=1;i++){const tail=morsel(p,'#d9794d',-.29+i*.055,0,.16-i*.04,.065,.022,.14);tail.rotation.y=-.8+i*.35;}
 }
 function greens(g){for(let i=0;i<8;i++){const a=i*2.4,x=Math.cos(a)*1.05,z=Math.sin(a)*1.05;const m=morsel(g,i%2?'#44783c':'#648a38',x,.23,z,.18,.025,.4);m.rotation.y=-a;tube(g,'#a2b668',[[x,.22,z],[x*.8,.2,z*.8],[x*.6,.18,z*.6]],.025);}}
 function citrus(g,x,z,color='#8eab35'){const m=cyl(g,color,x,.28,z,.29,.08);cyl(g,'#d9db78',x,.326,z,.245,.016);for(let i=0;i<8;i++){const a=i*Math.PI/4,l=box(g,'#f1e6a5',x+Math.cos(a)*.12,.338,z+Math.sin(a)*.12,.22,.01,.013);l.rotation.y=-a;}return m;}
 function slices(g,color,edge,x=.65,z=0){for(let i=0;i<5;i++){
  const px=x+(i-2)*.055,pz=z+(i-2)*.28,py=.14+i*.025;
  const skin=morsel(g,edge,px,py,pz,.48,.105,.21);skin.rotation.y=.14;
  const flesh=morsel(g,color,px,py+.055,pz+.012,.43,.07,.177);flesh.rotation.y=.14;
  for(let j=0;j<7;j++){const offset=(j-3)*.105;tube(g,foodMat(color,.6),[[px+offset-.025,py+.095,pz-.10],[px+offset,py+.115,pz],[px+offset+.025,py+.096,pz+.12]],.004);}
 }}
 function chunks(g,color,n=10){for(let i=0;i<n;i++){const a=i*2.4,r=.5+(i%3)*.25;const m=morsel(g,color,Math.cos(a)*r,.16+(i%2)*.12,Math.sin(a)*r,.24,.19,.21);m.rotation.set(.1*i,a,.05*i);}}
 function dip(g,color,x=1.5,z=.8){cyl(g,'#f7edda',x,.1,z,.4,.16);cyl(g,mat(color,.23),x,.195,z,.33,.03);}
 function build(kind,g){
  if(modelKinds[kind]){model(g,modelKinds[kind]);return;}
  if(noodleStyles[kind]){for(const style of noodleStyles[kind])strands(g,style);return;}
  if(kind==='rice'){rice(g);return;}
  if(kind.includes('broth')||kind.includes('curry')){const colors={'laksa-broth':'#c76a30','clear-broth':'#b89554','milky-broth':'#e2d3ae','brown-curry':'#75452a','orange-curry':'#cf7837'};cyl(g,new THREE.MeshPhysicalMaterial({color:colors[kind],roughness:.25,clearcoat:.6,clearcoatRoughness:.23,bumpMap:surface,bumpScale:.012}),0,-.14,0,1.59,.07);for(let i=0;i<42;i++){const a=i*2.4,r=1.45*Math.sqrt((i+.5)/42);oval(g,mat(i%3?'#cb9247':'#a95829',.2),Math.cos(a)*r,-.096,Math.sin(a)*r,.016+(i%4)*.012,.003,.013+(i%3)*.01);}return;}
  if(kind.startsWith('prawns')){for(let i=0;i<4;i++)prawn(g,Math.cos(i*1.7)*.85,Math.sin(i*1.7)*.85);if(kind.includes('squid'))for(let i=0;i<5;i++)ring(g,'#e9d9bd',Math.cos(i)*.8,.34,Math.sin(i)*.8,.16,.055);return;}
  if(kind==='herbs'||kind==='herbs-lime'){scatter(g,30,'#467431',1.12,.045,.16);if(kind.includes('lime'))citrus(g,1.12,-.55);return;}
  if(kind==='greens'){greens(g);return;}
  if(kind==='ribs'){
   for(let i=0;i<3;i++){
    const rib=new THREE.Group();g.add(rib);rib.position.set((i-1)*.63,0,(i%2)*.15);rib.rotation.y=(i-1)*.22;
    const points=[[-.10,.24,-1.18],[-.20,.19,-.72],[-.12,.10,0],[.12,.16,.65],[.25,.24,1.05]];
    tube(rib,foodMat('#c3ab88'),points,.18);
    tube(rib,foodMat('#ead9b4'),[[-.13,.27,-1.55],[-.12,.24,-1.15],[-.13,.20,-.65],[-.04,.17,.05],[.16,.23,.70],[.27,.26,1.13]],.078);
    for(let j=0;j<18;j++){const t=j/17,z=-.83+t*1.65,x=-.17+t*t*.37,y=.13+Math.abs(t-.45)*.18;
     morsel(rib,j%3?'#c0a383':'#d3b999',x-.10,y,z,.17,.13,.11);
     morsel(rib,'#bda17e',x+.10,y-.04,z,.13,.10,.12);
    }
    morsel(rib,'#e4d5b6',-.13,.27,-1.55,.105,.09,.08);
   }return;
  }
  if(kind==='garlic'){for(let i=0;i<6;i++)oval(g,'#eee0b4',Math.cos(i)*1.2,.12,Math.sin(i)*1.1,.2,.16,.12);scatter(g,30,'#3b3024',1.35,.021,.30);return;}
  if(kind==='char-siu'){slices(g,'#bd7560','#8e3524',.65,.2);return;}
  if(kind==='fish-slices'){slices(g,'#f1e6cf','#aaa999',.2,.1);return;}
  if(kind.includes('cucumber')){for(let i=0;i<4;i++){const x=-1.55+i*.12,z=.05+i*.32;cyl(g,'#44733a',x,.13,z,.26,.075);cyl(g,'#c3d187',x,.175,z,.22,.015);}return;}
  if(kind.endsWith('-dip')){dip(g,kind==='peanut-dip'?'#a97230':'#b34528');return;}
  if(kind==='tofu'){chunks(g,'#dab777',12);for(let i=0;i<4;i++)oval(g,'#e9d6b0',Math.cos(i)*1.2,.2,Math.sin(i)*1.2,.22,.22,.22);greens(g);return;}
  if(kind==='wontons'){for(let i=0;i<4;i++){const x=Math.cos(i*1.5),z=Math.sin(i*1.5);oval(g,'#e5c988',x,.26,z,.30,.20,.23);for(let j=0;j<5;j++){const fold=oval(g,'#f1d99a',x+(j-2)*.08,.43,z,.06,.10,.10);fold.rotation.z=(j-2)*.2;}}return;}
  if(kind==='stew-chicken'||kind==='rendang'){chunks(g,kind==='rendang'?'#71442a':'#9e6037',9);return;}
  if(kind==='keluak'){for(let i=0;i<3;i++){oval(g,'#322b23',Math.cos(i*2)*1.05,.25,Math.sin(i*2)*1.05,.22,.25,.18);oval(g,'#574232',Math.cos(i*2)*1.05,.44,Math.sin(i*2)*1.05,.15,.04,.12);}return;}
  if(kind==='durian-shell'||kind==='durian-open'){if(kind==='durian-open')return;for(const side of [-1,1]){const h=new THREE.Group();g.add(h);h.userData.side=side;oval(h,'#718041',side*.36,.4,0,.76,.53,1.14);oval(h,'#e8dcb0',side*.36,.66,0,.62,.22,1);for(let i=0;i<70;i++){const a=i*2.4,z=((i%10)/9-.5)*1.9,x=side*.36+Math.cos(a)*.6,y=.4+Math.sin(a)*.44;const spike=mesh(new THREE.ConeGeometry(.09,.23,5),'#83944b',x,y,z,h);spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(Math.cos(a),Math.sin(a),0));}}return;}
  if(kind==='durian-flesh'||kind==='durian-segment'){for(let i=0;i<(kind==='durian-flesh'?4:1);i++)oval(g,'#eac44c',kind==='durian-flesh'?(i%2?1:-1)*.85:0,.69,kind==='durian-flesh'?(i<2?-.45:.4):.95,.32,.23,.49);return;}
  if(kind==='sambal'){oval(g,'#aa4824',1.2,.12,.6,.38,.12,.32);return;}
  if(kind==='fish-head'){
   for(const part of fishHeadModel){
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(part.normals,3));geometry.setIndex(part.indices);
    const piece=mesh(geometry,foodMat(part.color),0,-.04,0,g);piece.name=part.name;piece.rotation.set(-.55,.55,0);
   }return;
  }
  if(kind==='okra-tomato'){for(let i=0;i<3;i++){const x=-1.05+i*.8,z=.95;const skin=morsel(g,'#56314c',x,.10,z,.30,.15,.19);skin.rotation.y=i*.7;morsel(g,'#d9bc6c',x,.20,z,.24,.045,.15);}for(let i=0;i<5;i++){const a=i*1.3;const m=oval(g,'#6b8738',Math.cos(a)*1.28,.1,Math.sin(a)*1.28,.12,.12,.48);m.rotation.y=-a;}for(let i=0;i<3;i++)oval(g,'#c35b35',Math.cos(i*2)*1.15,.19,Math.sin(i*2)*1.15,.24,.18,.22);return;}
  throw new Error('Unknown ingredient shape: '+kind);
 }
 recipe.steps.forEach(step=>{const g=new THREE.Group();root.add(g);g.position.y=base;g.userData.home=base;build(step.kind,g);g.traverse(o=>{if(o.isMesh&&!o.material.bumpMap&&!o.material.vertexColors)o.material=foodMat('#'+o.material.color.getHexString(),o.material.roughness);});ingredients.push(g);});
 // A visible utensil follows the current ingredient action; motion derives only from progress.
 const spoon=new THREE.Group();root.add(spoon);
 const spoonProfile=[[0,-.07],[.12,-.055],[.22,.015],[.24,.06],[.22,.065],[.19,.01],[.10,-.025],[0,-.03]].map(p=>new THREE.Vector2(...p));
 const spoonBowl=mesh(new THREE.LatheGeometry(spoonProfile,40),'#9a7960',0,0,0,spoon);spoonBowl.scale.z=1.4;
 box(spoon,'#765237',0,.045,-.70,.09,.075,1.05);
 const spoonLiquid=oval(spoon,mat('#be8243',.22),0,.018,0,.20,.012,.28);
 const stream=mesh(new THREE.CylinderGeometry(1,1,1,16),mat('#be8243',.22));
 const lip=new THREE.Vector3(0,.06,.336),start=new THREE.Vector3(),end=new THREE.Vector3(),delta=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
 const steam=[];for(let i=0;i<5;i++){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(45),3));const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:'#fff4dc',transparent:true,opacity:.4,depthWrite:false}));root.add(line);steam.push(line);}
 const grillGlow=mesh(new THREE.PlaneGeometry(3.8,2.9),new THREE.MeshBasicMaterial({color:'#c46c29',transparent:true,opacity:.28}),0,.02,0);grillGlow.rotation.x=-Math.PI/2;
 function update(progress){
  const p=clamp(Number.isFinite(progress)?progress:0),stage=Math.min(3,Math.floor(p*4)),phase=clamp(p*4-stage),fractions=[0,1,2,3].map(i=>clamp(p*4-i));
  const action=recipe.steps[stage].action,active=p>0&&p<1;
  ingredients.forEach((g,i)=>{const f=fractions[i],a=recipe.steps[i].action;g.visible=f>0;g.position.set(0,base,0);g.rotation.set(0,0,0);g.scale.setScalar(1);
   if(['pour','grow','simmer'].includes(a)){g.scale.y=Math.max(.001,ease(f));}
   else if(a==='sprinkle'){g.scale.setScalar(Math.max(.001,ease(f)));g.position.y+=1-ease(f);}
   else if(a==='lift')g.position.y+=ease(f)*.8;
   else if(a!=='open'&&a!=='turn'&&a!=='toss')g.position.y+=(1-ease(f))*2.6;
   if(active&&i<stage&&['toss','turn'].includes(action)){const wave=Math.sin(phase*Math.PI*4)*Math.sin(phase*Math.PI);g.position.y+=Math.abs(wave)*.25;g.rotation.y=wave*.13;g.rotation.z=action==='turn'?wave*.1:0;}
  });
  if(id==='durian'){ingredients[0].children.forEach(h=>{const side=h.userData.side;h.position.x=side*ease(fractions[1])*.62;h.rotation.z=-side*ease(fractions[1])*.28;});}
  const pouring=action==='pour',kind=recipe.steps[stage].kind;
  spoon.visible=active&&(pouring||(!['open','lift'].includes(action)&&!recipe.cold));
  const stirring=['toss','simmer','turn'].includes(action),tilt=ease(phase/.12)*(1-ease((phase-.88)/.12));
  spoon.position.set(stirring?Math.cos(phase*12)*.8:-.6,base+(stirring?.65:1.9),stirring?Math.sin(phase*12)*.8:0);
  spoon.rotation.set(pouring?.15+tilt*.85:stirring?-.35:0,stirring?-phase*12:0,0);
  stream.visible=active&&pouring&&phase>.12&&phase<.88;
  spoonLiquid.visible=active&&pouring&&phase<.88;spoonLiquid.scale.y=.012*Math.max(.05,1-phase);
  if(pouring){
   const dip=kind.endsWith('-dip'),broth=kind.includes('broth')||kind.includes('curry');
   const color={'laksa-broth':'#c76a30','clear-broth':'#b89554','milky-broth':'#e2d3ae','orange-curry':'#cf7837','brown-curry':'#75452a','crab-sauce':'#ba4b1c','chilli-dip':'#b34528','cr-sauce':'#6a4326','peanut-dip':'#a97230','dark-sauce':'#503120','syrup':'#be4961','egg':'#e5b546','stingray-sambal':'#a8321a','orh-egg':'#e6d39a','cc-egg':'#efc24c','satay-peanut-dip':'#a97230','bcm-sauce':'#9a3a1a'}[kind]||'#b1884f';
   end.set(dip?1.5:0,base+(dip?.21:broth?-.10:kind==='syrup'?1.31:kind==='crab-sauce'?.67:kind==='orh-egg'||kind==='cc-egg'?.12:.36),dip?.8:0);
   spoon.position.set(end.x,base+2,end.z-.2);spoon.updateMatrix();start.copy(lip).applyMatrix4(spoon.matrix);
   delta.copy(end).sub(start);stream.position.copy(start).add(end).multiplyScalar(.5);stream.quaternion.setFromUnitVectors(up,delta.clone().normalize());
   const width=.04*ease((phase-.12)/.08)*(1-ease((phase-.80)/.08));stream.scale.set(width,delta.length(),width);
   stream.material.color.set(color);spoonLiquid.material.color.set(color);
  }
  const heating=active&&!recipe.cold&&['simmer','toss','turn'].includes(action);grillGlow.visible=heating&&recipe.vessel==='grill';
  steam.forEach((line,i)=>{line.visible=heating;const pos=line.geometry.attributes.position;for(let j=0;j<15;j++){const t=j/14;pos.setXYZ(j,(i-2)*.35+Math.sin(t*6+phase*9+i)*.08,base+.5+t*.85,Math.cos(i)*.5);}pos.needsUpdate=true;});
  return {progress:p,stage,phase,fractions,ready:p===1};
 }
 function dispose(){const geos=new Set(),mats=new Set();root.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)mats.add(o.material);});for(const g of new Set([...geos,sphere,cube,organic]))g.dispose();for(const m of new Set([...mats,...materials.values()])){m.map?.dispose();m.dispose();}surface.dispose();root.removeFromParent();}
 update(1);return {root,ingredients,pour:{spoon,stream,lip,start,end},update,dispose};
}
