import * as THREE from './vendor/three.module.js';

export function createGarnishes(parent){
 const items={};
 const material=color=>new THREE.MeshStandardMaterial({color,roughness:.65});
 for(const [key,rind,flesh] of [['lemon','#e3ba26','#f6df75'],['lime','#577c29','#c7da7e']]){
  const slice=new THREE.Group();items[key]=slice;parent.add(slice);
  const outer=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.085,40),material(rind));slice.add(outer);
  const inner=new THREE.Mesh(new THREE.CylinderGeometry(.325,.325,.092,40),material(flesh));slice.add(inner);
  for(let i=0;i<8;i++){
   const membrane=new THREE.Mesh(new THREE.BoxGeometry(.29,.004,.013),material('#fff0bd'));
   const angle=i*Math.PI/4;membrane.position.set(Math.cos(angle)*.15,.049,Math.sin(angle)*.15);membrane.rotation.y=-angle;slice.add(membrane);
  }
  slice.rotation.set(.38,0,.25);
 }
 const plum=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,2),material('#795037'));plum.scale.set(1,.85,.9);items.plum=plum;parent.add(plum);
 const grains=new THREE.Group();items.grains=grains;parent.add(grains);
 for(let i=0;i<18;i++){
  const grain=new THREE.Mesh(new THREE.SphereGeometry(.075,10,8),material('#e9d9b2'));
  grain.scale.set(.6,.55,1.3);grain.position.set(Math.sin(i*2.4)*(.25+i*.025),.04+(i%3)*.055,Math.cos(i*2.4)*(.25+i*.025));grain.rotation.y=i;grains.add(grain);
 }
 const stalk=new THREE.Group();items.stalk=stalk;parent.add(stalk);
 for(let i=0;i<2;i++){
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.023,.06,1.4,10),material(i?'#b8bb75':'#ded8a7'));
  stem.position.set(i*.11,.6,0);stem.rotation.z=i?.1:-.08;stalk.add(stem);
 }
 function update(fractions,surface){
  for(const [key,object] of Object.entries(items)){
   const f=fractions[key]||0;object.visible=f>0;
   const resting=key==='grains'?surface-.02:key==='stalk'?surface-.4:surface+.07;
   object.position.set(key==='grains'?0:key==='plum'?-.3:.5,resting+(1-f)*2,key==='plum'?.3:key==='grains'?0:-.15);
  }
 }
 update({},0);
 return {items,update};
}
