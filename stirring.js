import * as THREE from './vendor/three.module.js';
export const stirBlend=t=>{const x=Math.max(0,Math.min(1,(t-1.1)/2.5));return x*x*(3-2*x);};
export function createStirring(parent){
 const group=new THREE.Group();parent.add(group);group.visible=false;
 const metal=new THREE.MeshStandardMaterial({color:0xc6c9c2,metalness:.85,roughness:.22});
 const spoon=new THREE.Group();group.add(spoon);
 const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.028,.035,2.2,12),metal);shaft.position.y=1.0;spoon.add(shaft);
 const bowl=new THREE.Mesh(new THREE.SphereGeometry(.14,20,12),metal);bowl.scale.set(.65,1.65,.32);spoon.add(bowl);
 const ribbons=[];
 for(let i=0;i<3;i++){const geometry=new THREE.BufferGeometry(),positions=new Float32Array(100*6*3);geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false});const mesh=new THREE.Mesh(geometry,mat);group.add(mesh);ribbons.push(mesh);}
 const swirls=[];for(let i=0;i<3;i++){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(90*3),3));const line=new THREE.Line(g,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.8,depthWrite:false}));group.add(line);swirls.push(line);}
 function update(time,surface,colors){group.visible=time>=0&&time<4.1&&surface>.38;if(!group.visible)return;const blend=stirBlend(time),turn=time*5,entry=Math.min(1,time/.45),exit=Math.max(0,(time-3.6)/.5);spoon.position.set(Math.cos(turn)*.48,.5+(1-entry)*3+exit*3,Math.sin(turn)*.48);spoon.rotation.z=Math.sin(turn)*.08;shaft.scale.y=Math.max(1,(surface+.9)/2.2);
  const height=surface-.35;
  for(let i=0;i<3;i++){const color=colors[i%colors.length];ribbons[i].material.color.set(color);ribbons[i].material.opacity=.75*(1-blend);const attr=ribbons[i].geometry.attributes.position;
   const point=(s,side)=>{const a=s*Math.PI*4+turn+i*2.094;return [Math.cos(a)*.969,.36+s*(height-.02)+side*.035,Math.sin(a)*.969];};
   for(let j=0;j<100;j++){const a=point(j/100,-1),b=point(j/100,1),c=point((j+1)/100,-1),d=point((j+1)/100,1);[a,b,c,c,b,d].forEach((p,k)=>attr.setXYZ(j*6+k,p[0],Math.max(.355,Math.min(surface-.002,p[1])),p[2]));}attr.needsUpdate=true;ribbons[i].geometry.computeBoundingSphere();
   swirls[i].material.color.set(color);swirls[i].material.opacity=.85*(1-blend);const pos=swirls[i].geometry.attributes.position;for(let j=0;j<90;j++){const s=j/89,a=s*8+turn+i*2.094,r=.1+.72*s;pos.setXYZ(j,Math.cos(a)*r,surface+.012,Math.sin(a)*r);}pos.needsUpdate=true;swirls[i].geometry.computeBoundingSphere();
  }
 }
 return {group,spoon,ribbons,update};
}
