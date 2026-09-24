import * as THREE from './vendor/three.module.js';
import fishHeadModel from './assets/fish-head-model.js';
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
 const table=cyl(root,'#cba77c',0,-.1,0,3.35,.15);table.receiveShadow=true;
 ring(root,'#b18a60',0,-.015,0,3.1,.02);
 if(bowl||pan){
  const color=recipe.vessel==='claypot'?'#805137':pan?'#343935':'#f7efdf';
  const profile=[[0,.12],[1.05,.12],[1.48,.30],[1.85,bowl?.91:.57],[1.9,bowl?.94:.60],[1.82,bowl?.99:.64],[1.74,bowl?.85:.52],[1.35,.32],[.95,.23],[0,.23]].map(p=>new THREE.Vector2(...p));
  mesh(new THREE.LatheGeometry(profile,64),color);ring(root,pan?'#62635b':'#365f6c',0,bowl?.975:.625,0,1.84);
  if(pan){box(root,'#514432',2.3,.48,0,1.4,.15,.23);ring(root,'#55574f',-2,.5,0,.26,.06);}
  if(recipe.vessel==='claypot')for(const x of [-2,2]){const h=ring(root,'#73472f',x,.66,0,.32,.09);h.scale.z=.7;}
 }else if(recipe.vessel==='grill'){
  box(root,'#30312d',0,.09,0,4.3,.20,3.65);for(let i=0;i<13;i++)box(root,'#777873',-1.9+i*.32,.24,0,.055,.05,3.4);
 }else if(recipe.vessel==='board'){cyl(root,'#bd8f56',0,.12,0,2.4,.16);}
 else{cyl(root,'#f7efdf',0,.12,0,2.35,.11);ring(root,'#416775',0,.20,0,2.19);ring(root,'#fff6e5',0,.18,0,2.31,.045);}
 function scatter(g,n,color,r=1.2,size=.06,y=.1){for(let i=0;i<n;i++){const a=i*2.39996,d=r*Math.sqrt((i+.5)/n);const m=oval(g,color,Math.cos(a)*d,y+(i%3)*.022,Math.sin(a)*d,size,size*.65,size*.6);m.rotation.y=a;}}
 function rice(g){
  morsel(g,'#eee1bb',-.55,.21,0,.76,.42,.78);
  for(let i=0;i<330;i++){const a=i*2.39996,h=(i+.5)/330,r=.77*Math.sqrt(1-h*h),y=.21+.43*h;
   const m=oval(g,foodMat(i%5?'#f3e6c7':'#e8d3a6',.6),-.55+Math.cos(a)*r,y,Math.sin(a)*r,.031,.028,.084);m.rotation.set(Math.sin(i)*.3,Math.sin(i*9.73)*Math.PI,0);
  }
 }
 function noodles(g,color,flat=false){for(let i=0;i<42;i++){
  const points=[],angle=i*2.39996,cx=Math.cos(angle)*.40,cz=Math.sin(angle)*.4;
  for(let j=0;j<20;j++){const t=j/19,a=t*Math.PI*(1.5+(i%3)*.5)+angle,r=.30+(i%6)*.11;
   points.push([cx+Math.cos(a)*r+Math.sin(t*13+i)*.13,.015+(i%6)*.027+Math.sin(t*9+i)*.035,cz+Math.sin(a)*r+Math.cos(t*11+i)*.12]);}
  const m=tube(g,foodMat(color,.38),points,flat?.063:.03);if(flat)m.scale.y=.5;
 }}
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
  if(kind.includes('noodles')){noodles(g,kind==='flat-noodles'?'#8c5228':kind==='white-noodles'?'#f4e7cd':'#dfb74e',kind==='flat-noodles');if(kind==='mixed-noodles'){const extra=new THREE.Group();g.add(extra);extra.scale.setScalar(.9);extra.position.y=.12;noodles(extra,'#f0dec1');}return;}
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
  if(kind==='chicken'){
   for(let i=0;i<5;i++){
    const shape=new THREE.Shape(),width=.49-Math.abs(i-2)*.045;
    shape.moveTo(-width,0);shape.quadraticCurveTo(-width-.04,.24,-.16,.30);shape.quadraticCurveTo(.16,.36,width,.20);shape.lineTo(width,.015);shape.quadraticCurveTo(0,-.03,-width,0);
    const cut=mesh(new THREE.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:14}),foodMat('#dcc3a4'),.65,.08,(i-2)*.29,g);cut.rotation.y=.10;
    tube(g,foodMat('#f0dfb7',.38),[[.65-width,.19,(i-2)*.29+.11],[.45,.38,(i-2)*.29+.11],[.70,.40,(i-2)*.29+.11],[.65+width,.29,(i-2)*.29+.11]],.055);
   }return;
  }
  if(kind==='char-siu'){slices(g,'#bd7560','#8e3524',.65,.2);return;}
  if(kind==='duck'){slices(g,'#bda082','#8e4826',.75,-.35);return;}
  if(kind==='fish-slices'){slices(g,'#f1e6cf','#aaa999',.2,.1);return;}
  if(kind.includes('cucumber')||kind==='satay-sides'){for(let i=0;i<4;i++){const x=-1.55+i*.12,z=.05+i*.32;cyl(g,'#44733a',x,.13,z,.26,.075);cyl(g,'#c3d187',x,.175,z,.22,.015);}if(kind==='egg-cucumber'){oval(g,'#f5edd5',.8,.14,.9,.36,.16,.42);oval(g,'#e9b133',.8,.285,.9,.20,.06,.24);}if(kind==='satay-sides'){box(g,'#efe3c9',1,.18,-.8,.4,.3,.4);oval(g,'#d1a5ad',1.4,.2,-.5,.2,.2,.25);}return;}
  if(kind.endsWith('-dip')){dip(g,kind==='peanut-dip'?'#a97230':'#b34528');return;}
  if(kind.includes('sauce')&&kind!=='crab-sauce'){const color=kind==='dark-sauce'?'#503120':kind==='red-sauce'?'#b74c24':'#b1884f';for(let i=0;i<16;i++){const a=i*2.4,r=.15+(i%5)*.24;oval(g,mat(color,.22),Math.cos(a)*r,.34,Math.sin(a)*r,.24,.017,.15);}return;}
  if(kind==='radish-cubes'||kind==='tofu'){chunks(g,kind==='tofu'?'#dab777':'#e4d5ac',12);if(kind==='tofu'){for(let i=0;i<4;i++)oval(g,'#e9d6b0',Math.cos(i)*1.2,.2,Math.sin(i)*1.2,.22,.22,.22);greens(g);}return;}
  if(kind==='egg'||kind==='egg-sausage'){for(let i=0;i<9;i++){const a=i*2.4;oval(g,'#e5b546',Math.cos(a),.08,Math.sin(a),.35,.055,.26);}if(kind==='egg-sausage')for(let i=0;i<7;i++)cyl(g,'#a8472c',Math.cos(i)*.8,.24,Math.sin(i)*.8,.17,.09);return;}
  if(kind==='sear-marks'||kind==='grill-marks'||kind==='bread-marks'){for(let i=0;i<22;i++){const a=i*2.4,r=(i%6)*.20;oval(g,'#8a5127',Math.cos(a)*r,kind==='bread-marks'?.27:.33,Math.sin(a)*r,.07,.008,.045);}return;}
  if(kind==='wontons'){for(let i=0;i<4;i++){const x=Math.cos(i*1.5),z=Math.sin(i*1.5);oval(g,'#e5c988',x,.26,z,.30,.20,.23);for(let j=0;j<5;j++){const fold=oval(g,'#f1d99a',x+(j-2)*.08,.43,z,.06,.10,.10);fold.rotation.z=(j-2)*.2;}}return;}
  if(kind==='mince-mushrooms'||kind==='filling'){scatter(g,75,'#a27d58',kind==='filling'?.8:1.1,.075,.23);for(let i=0;i<6;i++){const m=oval(g,'#6c4b31',Math.cos(i)*.85,.34,Math.sin(i)*.85,.23,.08,.16);m.rotation.y=i;}return;}
  if(kind==='cockles'||kind==='oysters'){for(let i=0;i<7;i++){const a=i*2.4;oval(g,'#a89d7a',Math.cos(a)*1.1,.25,Math.sin(a)*1.1,.23,.1,.18);oval(g,'#d6c6a2',Math.cos(a)*1.1,.32,Math.sin(a)*1.1,.13,.07,.12);}return;}
  if(kind==='fried-chicken'){
   const leg=new THREE.Group();g.add(leg);leg.position.set(.82,.06,-.05);leg.rotation.y=-.25;
   morsel(leg,'#995522',0,.28,-.48,.48,.30,.60);
   morsel(leg,'#aa6328',.06,.20,.12,.28,.22,.46);
   tube(leg,foodMat('#a86429'),[[.06,.19,.18],[.15,.15,.50],[.18,.12,.78]],.14);
   tube(leg,foodMat('#d7b889'),[[.18,.12,.73],[.19,.11,.97]],.072);
   morsel(leg,'#c9a675',.19,.11,.99,.115,.09,.08);
   for(let i=0;i<120;i++){const a=i*2.39996,h=(i+.5)/120,r=Math.sqrt(1-h*h),x=Math.cos(a)*.46*r,z=-.48+Math.sin(a)*.58*r;
    const crumb=morsel(leg,i%4===0?'#74401c':i%3?'#b67b35':'#ce9245',x,.28+.30*h,z,.035+(i%3)*.012,.025,.04);crumb.rotation.y=a;
   }return;
  }
  if(kind==='stew-chicken'||kind==='rendang'){chunks(g,kind==='rendang'?'#71442a':'#9e6037',9);return;}
  if(kind==='keluak'){for(let i=0;i<3;i++){oval(g,'#322b23',Math.cos(i*2)*1.05,.25,Math.sin(i*2)*1.05,.22,.25,.18);oval(g,'#574232',Math.cos(i*2)*1.05,.44,Math.sin(i*2)*1.05,.15,.04,.12);}return;}
  if(kind==='fruit'||kind==='fritters'){chunks(g,kind==='fruit'?'#dfbf59':'#b77d38',10);if(kind==='fruit')for(let i=0;i<5;i++)cyl(g,'#759745',Math.cos(i)*1.2,.2,Math.sin(i)*1.2,.18,.2);return;}
  if(kind==='peanuts'||kind==='corn'||kind==='beans'){scatter(g,kind==='beans'?40:65,kind==='beans'?'#883e32':kind==='corn'?'#e9bf3c':'#c99c61',1.1,kind==='beans'?.10:.055,kind==='corn'?.3:.16);return;}
  if(kind==='skewers'){for(let i=0;i<6;i++){const z=(i-2.5)*.40;
   box(g,'#c5a56c',0,.07,z,2.9,.025,.025);
   for(let j=0;j<5;j++){const x=-.6+j*.31,m=morsel(g,j%2?'#a5692e':'#bc843b',x,.16,z,.22,.13,.15);m.rotation.set(.18*Math.sin(i+j),j*.6,.1);
    for(let k=0;k<3;k++){const mark=morsel(g,'#58341f',x+(k-1)*.065,.276,z,.022,.008,.10);mark.rotation.y=.35;}
   }}return;}
  if(kind==='ice'){const ice=mesh(new THREE.ConeGeometry(1.22,1.65,48),mat('#f1eee1',1),0,.50,0,g);scatter(g,80,'#fff9e9',1.10,.06,.04);ice.userData.ice=true;return;}
  if(kind==='syrup'){for(let i=0;i<3;i++){const a=i*2.1;tube(g,['#c94354','#78a253','#f0e0bb'][i],[[0,1.31,0],[Math.cos(a)*.25,1.05,Math.sin(a)*.25],[Math.cos(a)*.65,.5,Math.sin(a)*.65],[Math.cos(a),-.03,Math.sin(a)]],.09);}return;}
  if(kind==='durian-shell'||kind==='durian-open'){if(kind==='durian-open')return;for(const side of [-1,1]){const h=new THREE.Group();g.add(h);h.userData.side=side;oval(h,'#718041',side*.36,.4,0,.76,.53,1.14);oval(h,'#e8dcb0',side*.36,.66,0,.62,.22,1);for(let i=0;i<70;i++){const a=i*2.4,z=((i%10)/9-.5)*1.9,x=side*.36+Math.cos(a)*.6,y=.4+Math.sin(a)*.44;const spike=mesh(new THREE.ConeGeometry(.09,.23,5),'#83944b',x,y,z,h);spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(Math.cos(a),Math.sin(a),0));}}return;}
  if(kind==='durian-flesh'||kind==='durian-segment'){for(let i=0;i<(kind==='durian-flesh'?4:1);i++)oval(g,'#eac44c',kind==='durian-flesh'?(i%2?1:-1)*.85:0,.69,kind==='durian-flesh'?(i<2?-.45:.4):.95,.32,.23,.49);return;}
  if(kind==='sambal'||kind==='sambal-anchovies'){oval(g,'#aa4824',1.2,.12,.6,.38,.12,.32);if(kind.includes('anchovies')){scatter(g,15,'#a99051',.5,.07,.13);for(let i=0;i<9;i++){const m=oval(g,'#b89a5e',.9+(i%3)*.13,.16,-.6+Math.floor(i/3)*.13,.03,.03,.19);m.rotation.y=i;}}return;}
  if(kind==='dough'){box(g,'#d9bb7a',0,.04,0,2.5,.045,2.5);return;}
  if(kind==='folds'){for(let i=0;i<4;i++){const panel=new THREE.Group();panel.rotation.y=i*Math.PI/2;const flap=box(panel,'#d4ab60',0,.06,-.93,1.85,.06,1.05);g.add(panel);panel.userData.flap=flap;}return;}
  if(kind==='banana-leaf'){const leaf=oval(g,'#557b36',0,.01,0,1.8,.025,1.45);for(let i=-5;i<=5;i++)tube(g,'#7b9344',[[-1.5,.04,i*.21],[0,.055,i*.20],[1.5,.04,i*.21]],.01);return;}
  if(kind==='stingray'){oval(g,'#b2956a',0,.13,0,1.35,.17,1);for(let i=-5;i<=5;i++)box(g,'#d1b789',0,.30,i*.14,1.9,.015,.024);return;}
  if(kind==='sambal-coat'){oval(g,mat('#ac4a28',.35),0,.325,0,1.23,.045,.87);scatter(g,55,'#c77a36',1,.025,.37);return;}
  if(kind==='crab'){
   morsel(g,'#b64821',0,.30,0,1.04,.33,.81);
   for(let i=0;i<20;i++){const a=i*Math.PI/10;morsel(g,'#d36b2c',Math.cos(a)*.99,.30,Math.sin(a)*.77,.09,.065,.085);}
   for(const side of [-1,1]){
    for(let i=0;i<4;i++){const z=(i-1.5)*.32;tube(g,foodMat('#ba5124'),[[side*.76,.28,z],[side*1.22,.24,z*1.4],[side*1.55,.10,z*1.9]],.085);}
    tube(g,foodMat('#b94b20'),[[side*.76,.25,.30],[side*1.24,.23,.65],[side*.95,.18,1.05]],.17);
    const claw=morsel(g,'#c35725',side*.91,.24,1.13,.32,.23,.43);claw.rotation.y=side*.30;
    for(const d of [-1,1])tube(g,foodMat('#d37a3c'),[[side*.91+d*.16,.26,1.32],[side*.87+d*.15,.23,1.57],[side*.85+d*.035,.20,1.71]],.065);
   }return;
  }
  if(kind==='crab-sauce'){
   const sauce=foodMat('#ba4b1c',.24);oval(g,sauce,0,.035,0,1.85,.03,1.65);
   oval(g,sauce,0,.52,0,.99,.15,.76);
   for(let i=0;i<90;i++){const a=i*2.39996,r=Math.sqrt((i+.5)/90),x=Math.cos(a)*.95*r,z=Math.sin(a)*.73*r,y=.52+.15*Math.sqrt(1-r*r);
    morsel(g,i%3?'#d97c35':'#edd297',x,y+.009,z,.018,.008,.032);
   }return;
  }
  if(kind==='crab-herbs'){for(let i=0;i<7;i++){const a=i*2.4;const leaf=morsel(g,'#457632',Math.cos(a)*.25,.74,Math.sin(a)*.22,.13,.018,.19);leaf.rotation.y=a;}return;}
  if(kind==='mantou'){for(let i=0;i<3;i++)oval(g,'#ddb77b',(i-1)*.60,.18,-1.3,.27,.24,.28);return;}
  if(kind==='fish-head'){
   for(const part of fishHeadModel){
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(part.normals,3));geometry.setIndex(part.indices);
    const piece=mesh(geometry,foodMat(part.color),0,-.04,0,g);piece.name=part.name;piece.rotation.set(-.55,.55,0);
   }return;
  }
  if(kind==='okra-tomato'){for(let i=0;i<3;i++){const x=-1.05+i*.8,z=.95;const skin=morsel(g,'#56314c',x,.10,z,.30,.15,.19);skin.rotation.y=i*.7;morsel(g,'#d9bc6c',x,.20,z,.24,.045,.15);}for(let i=0;i<5;i++){const a=i*1.3;const m=oval(g,'#6b8738',Math.cos(a)*1.28,.1,Math.sin(a)*1.28,.12,.12,.48);m.rotation.y=-a;}for(let i=0;i<3;i++)oval(g,'#c35b35',Math.cos(i*2)*1.15,.19,Math.sin(i*2)*1.15,.24,.18,.22);return;}
  throw new Error('Unknown ingredient shape: '+kind);
 }
 recipe.steps.forEach(step=>{const g=new THREE.Group();root.add(g);g.position.y=base;g.userData.home=base;build(step.kind,g);g.traverse(o=>{if(o.isMesh&&!o.material.bumpMap)o.material=foodMat('#'+o.material.color.getHexString(),o.material.roughness);});ingredients.push(g);});
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
   else if(a!=='open'&&a!=='fold'&&a!=='turn'&&a!=='toss')g.position.y+=(1-ease(f))*2.6;
   if(active&&i<stage&&['toss','turn'].includes(action)){const wave=Math.sin(phase*Math.PI*4)*Math.sin(phase*Math.PI);g.position.y+=Math.abs(wave)*.25;g.rotation.y=wave*.13;g.rotation.z=action==='turn'?wave*.1:0;}
  });
  if(id==='durian'){ingredients[0].children.forEach(h=>{const side=h.userData.side;h.position.x=side*ease(fractions[1])*.62;h.rotation.z=-side*ease(fractions[1])*.28;});}
  if(id==='murtabak'){ingredients[0].scale.x=ingredients[0].scale.z=1-ease(fractions[2])*.26;ingredients[2].children.forEach(panel=>{panel.userData.flap.rotation.x=ease(fractions[2])*Math.PI*.87;panel.userData.flap.position.z=-.93+ease(fractions[2])*.50;panel.userData.flap.position.y=.06+ease(fractions[2])*.18;});ingredients[1].scale.y=1-ease(fractions[2])*.8;}
  const pouring=action==='pour',kind=recipe.steps[stage].kind;
  spoon.visible=active&&(pouring||(!['open','lift','fold'].includes(action)&&!recipe.cold));
  const stirring=['toss','simmer','turn'].includes(action),tilt=ease(phase/.12)*(1-ease((phase-.88)/.12));
  spoon.position.set(stirring?Math.cos(phase*12)*.8:-.6,base+(stirring?.65:1.9),stirring?Math.sin(phase*12)*.8:0);
  spoon.rotation.set(pouring?.15+tilt*.85:stirring?-.35:0,stirring?-phase*12:0,0);
  stream.visible=active&&pouring&&phase>.12&&phase<.88;
  spoonLiquid.visible=active&&pouring&&phase<.88;spoonLiquid.scale.y=.012*Math.max(.05,1-phase);
  if(pouring){
   const dip=kind.endsWith('-dip'),broth=kind.includes('broth')||kind.includes('curry');
   const color={'laksa-broth':'#c76a30','clear-broth':'#b89554','milky-broth':'#e2d3ae','orange-curry':'#cf7837','brown-curry':'#75452a','crab-sauce':'#ba4b1c','chilli-dip':'#b34528','peanut-dip':'#a97230','dark-sauce':'#503120','syrup':'#be4961','egg':'#e5b546','sambal-coat':'#ac4a28'}[kind]||'#b1884f';
   end.set(dip?1.5:0,base+(dip?.21:broth?-.10:kind==='syrup'?1.31:kind==='crab-sauce'?.67:kind==='egg'?.12:.36),dip?.8:0);
   spoon.position.set(end.x,base+2,end.z-.2);spoon.updateMatrix();start.copy(lip).applyMatrix4(spoon.matrix);
   delta.copy(end).sub(start);stream.position.copy(start).add(end).multiplyScalar(.5);stream.quaternion.setFromUnitVectors(up,delta.clone().normalize());
   const width=.04*ease((phase-.12)/.08)*(1-ease((phase-.80)/.08));stream.scale.set(width,delta.length(),width);
   stream.material.color.set(color);spoonLiquid.material.color.set(color);
  }
  const heating=active&&!recipe.cold&&['simmer','toss','turn'].includes(action);grillGlow.visible=heating&&recipe.vessel==='grill';
  steam.forEach((line,i)=>{line.visible=heating;const pos=line.geometry.attributes.position;for(let j=0;j<15;j++){const t=j/14;pos.setXYZ(j,(i-2)*.35+Math.sin(t*6+phase*9+i)*.08,base+.5+t*.85,Math.cos(i)*.5);}pos.needsUpdate=true;});
  return {progress:p,stage,phase,fractions,ready:p===1};
 }
 function dispose(){const geos=new Set(),mats=new Set();root.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)mats.add(o.material);});for(const g of new Set([...geos,sphere,cube,organic]))g.dispose();for(const m of new Set([...mats,...materials.values()]))m.dispose();surface.dispose();root.removeFromParent();}
 update(1);return {root,ingredients,pour:{spoon,stream,lip,start,end},update,dispose};
}
