import * as THREE from './vendor/three.module.js';
export const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export const breakfastStages=['Crack the first egg','Crack the second egg','Add soya sauce','Sprinkle white pepper'];
export function breakfastState(progress){
 const p=clamp(progress),stage=Math.min(3,Math.floor(p*4));
 return {progress:p,stage,phase:clamp(p*4-stage),fractions:[0,1,2,3].map(i=>clamp(p*4-i)),ready:p===1};
}
export function createBreakfastScene(parent){
 const root=new THREE.Group();parent.add(root);
 const mat=(color,roughness=.5,extra={})=>new THREE.MeshStandardMaterial({color,roughness,...extra});
 const china=mat('#fff9eb',.23),green=mat('#467956'),crust=mat('#9e5523',.9),bread=mat('#e6bd7a',1),kaya=mat('#9b973e',.7),butter=mat('#f4d473',.55),shellMat=mat('#cf9e6c',.78,{side:THREE.DoubleSide}),innerMat=mat('#fff0d8',.85,{side:THREE.BackSide}),whiteMat=mat('#fff1cd',.22),yolkMat=mat('#efa720',.2),soyMat=mat('#392015',.18),metal=mat('#bcc0b5',.3,{metalness:.7});
 const sphere=new THREE.SphereGeometry(1,24,16);
 function mesh(g,m,x=0,y=0,z=0,group=root){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
 function ellipsoid(m,x,y,z,sx,sy,sz,group=root){const o=mesh(sphere,m,x,y,z,group);o.scale.set(sx,sy,sz);return o;}
 function cylinder(rt,rb,h,m,x,y,z,group=root){return mesh(new THREE.CylinderGeometry(rt,rb,h,48),m,x,y,z,group);}
 function ring(r,t,m,x,y,z,group=root){const o=mesh(new THREE.TorusGeometry(r,t,10,72),m,x,y,z,group);o.rotation.x=Math.PI/2;return o;}
 function plate(x,z,r){cylinder(r,r*.92,.09,china,x,.07,z);ring(r*.91,.022,green,x,.125,z);ring(r*.98,.025,china,x,.13,z);}
 const table=cylinder(4.65,4.65,.10,mat('#dfcba8',.9),0,-.07,0);table.scale.z=.79;
 const bowlGroup=new THREE.Group();bowlGroup.position.set(-1.35,0,.45);root.add(bowlGroup);
 plate(-1.35,.45,1.65);
 const profile=[[0,.15],[.94,.15],[1.15,.24],[1.50,.67],[1.52,.72],[1.43,.74],[1.37,.63],[1.07,.29],[.88,.25],[0,.25]].map(([x,y])=>new THREE.Vector2(x,y));
 mesh(new THREE.LatheGeometry(profile,72),china,0,0,0,bowlGroup);ring(1.47,.019,green,0,.738,0,bowlGroup);
 // A restrained green band echoes the porcelain in the supplied reference.
 ring(1.17,.022,green,0,.29,0,bowlGroup);
 plate(2.0,.40,1.52);
 const tri=new THREE.Shape();tri.moveTo(-.78,-.60);tri.lineTo(.78,-.60);tri.lineTo(-.78,.60);tri.closePath();
 function toastLayer(group,y,h,m,scale=1){const geo=new THREE.ExtrudeGeometry(tri,{depth:h,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.018});geo.rotateX(-Math.PI/2);const o=mesh(geo,m,0,y,0,group);o.scale.set(scale,1,scale);return o;}
 const toast=[];
 for(let i=0;i<2;i++){
  const g=new THREE.Group();g.position.set(2.0+(i? .12:-.12),.16,.4+(i?.10:-.10));g.rotation.y=i?Math.PI:0;root.add(g);toast.push(g);
  toastLayer(g,0,.17,crust);toastLayer(g,.012,.15,bread,.94);toastLayer(g,.19,.047,kaya);toastLayer(g,.243,.065,butter,.95);toastLayer(g,.328,.17,crust);toastLayer(g,.34,.165,bread,.94);
  // Toasted crumb freckles are part of the 3D surface, deterministically placed.
  for(let j=0;j<42;j++){let u=((j*37)%101)/101,v=((j*61+19)%103)/103;if(u+v>1){u=1-u;v=1-v;}const x=-.70+u*1.4,z=.53-v*1.06;ellipsoid(j%3?crust:kaya,x,.518,z,.015+(j%4)*.007,.004,.014,g);}
 }
 // A complete cup at the back of the breakfast table.
 const cupGroup=new THREE.Group();cupGroup.position.set(.55,0,-1.85);root.add(cupGroup);
 cylinder(.91,.83,.08,china,0,.08,0,cupGroup);ring(.84,.015,green,0,.13,0,cupGroup);
 const cupProfile=[[0,.14],[.56,.14],[.65,.24],[.69,1.29],[.65,1.33],[.61,1.27],[.57,.25],[0,.25]].map(p=>new THREE.Vector2(...p));mesh(new THREE.LatheGeometry(cupProfile,48),china,0,0,0,cupGroup);
 const cupHandle=new THREE.CubicBezierCurve3(new THREE.Vector3(.69,1.08,0),new THREE.Vector3(1.35,1.13,0),new THREE.Vector3(1.27,.26,0),new THREE.Vector3(.66,.38,0));mesh(new THREE.TubeGeometry(cupHandle,32,.063,10,false),china,0,0,0,cupGroup);
 const drink=cylinder(.609,.609,.04,mat('#4f2d1b',.18),0,1.20,0,cupGroup);ring(.68,.018,green,0,1.3,0,cupGroup);
 // The two egg shells each have matching jagged equators and pale interiors.
 function halfGeometry(){const g=new THREE.SphereGeometry(1,32,14,0,Math.PI*2,0,Math.PI/2);const a=g.attributes.position;for(let i=0;i<a.count;i++){let x=a.getX(i),y=a.getY(i),z=a.getZ(i);if(y<.0001)y=.035*Math.sin(Math.atan2(z,x)*12);a.setXYZ(i,x*.32,y*.45,z*.32);}g.computeVertexNormals();return g;}
 const eggs=[];
 for(let i=0;i<2;i++){
  const egg=new THREE.Group();bowlGroup.add(egg);const halves=[];
  for(const side of [-1,1]){const h=new THREE.Group();egg.add(h);const geo=halfGeometry();mesh(geo,shellMat,0,0,0,h);const inside=mesh(geo,innerMat,0,0,0,h);inside.scale.setScalar(.984);h.rotation.z=-side*Math.PI/2;halves.push(h);}
  const white=ellipsoid(whiteMat,0,.3,0,.001,.001,.001,bowlGroup),yolk=ellipsoid(yolkMat,0,.4,0,.001,.001,.001,bowlGroup);
  const fallingWhite=ellipsoid(whiteMat,0,2,0,.001,.001,.001,bowlGroup),fallingYolk=ellipsoid(yolkMat,0,2,0,.001,.001,.001,bowlGroup);
  eggs.push({egg,halves,white,yolk,fallingWhite,fallingYolk});
 }
 // Soya bottle and pepper shaker rest behind the bowl between their stages.
 const soyBottle=new THREE.Group();root.add(soyBottle);
 cylinder(.27,.31,.65,mat('#533923',.27),0,.39,0,soyBottle);cylinder(.16,.27,.23,mat('#9d6b34',.3),0,.82,0,soyBottle);cylinder(.13,.13,.13,mat('#a23028'),0,.99,0,soyBottle);cylinder(.055,.105,.15,mat('#a23028'),0,1.12,0,soyBottle);
 const nozzle=new THREE.Vector3(0,1.195,0),stream=mesh(new THREE.CylinderGeometry(.025,.025,1,10),soyMat);stream.visible=false;
 const soyPatches=[];for(let i=0;i<22;i++){const a=i*.72,r=.45+(i%4)*.105;soyPatches.push(ellipsoid(soyMat,Math.cos(a)*r,.337,Math.sin(a)*r,.001,.001,.001,bowlGroup));}
 const shaker=new THREE.Group();root.add(shaker);cylinder(.24,.28,.65,mat('#dcc398',.55),0,.40,0,shaker);cylinder(.245,.245,.14,mat('#285f9a',.35),0,.80,0,shaker);
 for(let i=0;i<7;i++){const a=i*2.4;ellipsoid(mat('#514436'),Math.cos(a)*.13,.875,Math.sin(a)*.13,.02,.005,.02,shaker);}
 const pepperMat=mat('#57452f',1),pepper=[];
 for(let i=0;i<100;i++){const a=i*2.39996,r=.95*Math.sqrt((i+.5)/100);const grain=ellipsoid(pepperMat,Math.cos(a)*r,.347,Math.sin(a)*r,.011,.007,.009,bowlGroup);pepper.push(grain);}
 const grains=[];for(let i=0;i<28;i++)grains.push(ellipsoid(pepperMat,0,2,0,.011,.013,.009,bowlGroup));
 const up=new THREE.Vector3(0,1,0),from=new THREE.Vector3(),to=new THREE.Vector3(),direction=new THREE.Vector3();
 function update(progress){
  const state=breakfastState(progress),[e1,e2,s,p]=state.fractions;
  eggs.forEach((o,i)=>{
   const f=i?e2:e1,split=ease((f-.15)/.30),drop=ease((f-.30)/.35),land=ease((f-.48)/.30),exit=ease((f-.78)/.22),x=i?.36:-.37,z=i?.24:-.19;
   const approach=ease(f/.15);o.egg.visible=f<1;o.egg.position.set((-1.65+i*.12)*(1-approach)+x*approach,.49*(1-approach)+(2.30+exit*.25)*approach,(.3+i*.65)*(1-approach)+z*approach);o.egg.rotation.z=(f>.06&&f<.16?Math.sin(f*150)*.035:0);
   o.halves.forEach((h,j)=>{const side=j?1:-1;h.position.set(side*(split*.48+exit*.45),exit*.4,0);h.rotation.z=-side*(Math.PI/2+split*.58);h.scale.setScalar(1-exit*.9);});
   o.fallingWhite.visible=f>.3&&f<.78;o.fallingYolk.visible=f>.3&&f<.64;
   o.fallingWhite.position.set(x,2.25-drop*1.85,z);o.fallingWhite.scale.set(.22*(1-land)+.02,.20+Math.sin(drop*Math.PI)*.38,.20*(1-land)+.02);
   o.fallingYolk.position.set(x,2.2-drop*1.80,z);o.fallingYolk.scale.set(.255,.25-.08*drop,.255);
   o.white.visible=land>0;o.white.position.set(x,.31,z);o.white.scale.set(.73*land,.062*land,.55*land);
   o.yolk.visible=land>0;o.yolk.position.set(x,.408,z);o.yolk.scale.set(.29*land,.16*land,.285*land);
  });
  const pouring=s>.12&&s<.84,reach=ease(s/.14)*(1-ease((s-.85)/.15));
  soyBottle.position.set(-3.20+reach*1.30,.04+reach*2.45,-1.33+reach*1.75);soyBottle.rotation.z=-reach*2.28;soyBottle.updateMatrixWorld(true);
  stream.visible=pouring;
  if(pouring){from.copy(nozzle);soyBottle.localToWorld(from);to.set(-1.35+Math.sin(s*15)*.38,.34,.45+Math.cos(s*15)*.25);direction.copy(to).sub(from);stream.position.copy(from).add(to).multiplyScalar(.5);stream.quaternion.setFromUnitVectors(up,direction.clone().normalize());stream.scale.set(1,direction.length(),1);}
  const surfaceAt=(x,z)=>{let h=.295;for(const e of eggs){const dx=x-e.yolk.position.x,dz=z-e.yolk.position.z,d=dx*dx+dz*dz,w=dx*dx/(.73*.73)+dz*dz/(.55*.55);if(w<1)h=Math.max(h,.31+.062*Math.sqrt(1-w));if(d<.29**2)h=Math.max(h,.408+.16*Math.sqrt(1-d/.29**2));}return h+.008;};
  const soy=ease((s-.12)/.7);soyPatches.forEach((m,i)=>{const fill=clamp(soy*1.6-i/35);m.visible=fill>0;m.position.y=surfaceAt(m.position.x,m.position.z);m.scale.set((.095+(i%3)*.015)*fill,.009,(.055+(i%4)*.008)*fill);});
  const sprinkling=p>.12&&p<.9,lift=ease(p/.14)*(1-ease((p-.88)/.12));shaker.position.set(-2.48+lift*1.12,.04+lift*2.95,-1.8+lift*2.2);shaker.rotation.z=lift*(Math.PI+.13*Math.sin(p*95));
  const pepperAmount=ease((p-.12)/.76);pepper.forEach((m,i)=>{m.visible=i<pepperAmount*pepper.length;const x=m.position.x,z=m.position.z;m.position.y=surfaceAt(x,z)+.004;});
  shaker.updateMatrixWorld(true);from.set(0,.875,0);shaker.localToWorld(from);bowlGroup.worldToLocal(from);
  grains.forEach((m,i)=>{m.visible=sprinkling;const phase=(p*7+i*.173)%1;m.position.set(from.x+Math.sin(i*2.4)*phase*.7,from.y-phase*(from.y-.35),from.z+Math.cos(i*2.4)*phase*.55);});
  root.userData.state=state;return state;
 }
 update(1);
 return {root,eggs,soyBottle,shaker,stream,soyPatches,pepper,grains,drink,update,setDrink(category){drink.material.color.set(category==='teh'?'#a9662b':category==='milo'?'#865136':'#4f2d1b');}};
}
