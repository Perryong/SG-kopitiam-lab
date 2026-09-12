import * as THREE from './vendor/three.module.js';
import {jugHandleGeometry} from './handles.js';
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export const pourFill=phase=>smooth((phase-.12)/.76);
export const flowStyles={coffee:{color:0x66351f,radius:.025,reach:.20},tea:{color:0xb66b20,radius:.025,reach:.20},condensed:{color:0xeecb7e,radius:.048,reach:.07},evaporated:{color:0xf4e7c5,radius:.035,reach:.15},water:{color:0x89bbc5,radius:.019,reach:.24}};
export function createPourRig(parent){
 const rig=new THREE.Group();parent.add(rig);const jug=new THREE.Group();rig.add(jug);
 const metal=new THREE.MeshStandardMaterial({color:0xb6b9b1,roughness:.28,metalness:.8,side:THREE.DoubleSide});
 function mesh(g,m,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);jug.add(o);return o;}
 mesh(new THREE.CylinderGeometry(.35,.29,.65,48,1,true),metal);
 mesh(new THREE.CylinderGeometry(.29,.29,.025,48),metal,0,-.325,0);
 const rim=mesh(new THREE.TorusGeometry(.35,.02,8,48),metal,0,.325,0);rim.rotation.x=Math.PI/2;
 const handle=mesh(jugHandleGeometry(),metal);handle.name='jug-handle';
 const tip=new THREE.Vector3(.57,.34,0),neck=new THREE.Vector3(.4,.29,0);
 const path=new THREE.CatmullRomCurve3([new THREE.Vector3(.25,.23,0),neck,tip]);
 mesh(new THREE.TubeGeometry(path,16,.066,12,false),metal);
 const lip=mesh(new THREE.TorusGeometry(.066,.012,8,24),metal,...tip.toArray());
 lip.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),tip.clone().sub(neck).normalize());
 const liquidMat=new THREE.MeshStandardMaterial({color:0x66351f,roughness:.25});
 // Interior volume with a gently moving free surface, clipped to the jug walls.
 const poolGeometry=new THREE.CylinderGeometry(.329,.273,1,48,1,false);
 const poolBase=poolGeometry.attributes.position.array.slice();
 const pool=new THREE.Mesh(poolGeometry,new THREE.MeshStandardMaterial({color:0xeecb7e,roughness:.23,side:THREE.DoubleSide}));jug.add(pool);
 const segments=[];const geometry=new THREE.CylinderGeometry(1,1,1,12);
 for(let i=0;i<24;i++){const o=new THREE.Mesh(geometry,liquidMat);rig.add(o);segments.push(o);}
 const ripples=[];for(let i=0;i<2;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.12,.009,6,40),new THREE.MeshBasicMaterial({color:0xb98757,transparent:true,opacity:.25,depthWrite:false}));m.rotation.x=Math.PI/2;rig.add(m);ripples.push(m);}
 const origin=new THREE.Vector3(),end=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3(),delta=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),rotatedTip=new THREE.Vector3();
 function update(kind,phase,surface){const style=flowStyles[kind];rig.visible=!!style&&phase>0&&phase<1;if(!rig.visible)return;
  const tilt=smooth(phase/.12)*(1-smooth((phase-.88)/.12));jug.rotation.z=-.18-tilt*.85;
  // Anchor the opening above the glass after applying the jug's rotation.
  const anchor=new THREE.Vector3(-.27,3.80+(1-tilt)*.15,0);
  rotatedTip.copy(tip).applyQuaternion(jug.quaternion);jug.position.copy(anchor).sub(rotatedTip);
  jug.updateMatrix();origin.copy(tip).applyMatrix4(jug.matrix);end.set(origin.x+style.reach,surface+.008,origin.z);
  const flow=phase>.12&&phase<.88,envelope=smooth((phase-.12)/.06)*(1-smooth((phase-.82)/.06));
  liquidMat.color.setHex(style.color);
  pool.material.color.setHex(style.color);
  const remaining=1-pourFill(phase),level=-.30+.54*remaining,positions=poolGeometry.attributes.position;
  for(let i=0;i<positions.count;i++){
   const x=poolBase[i*3],v=poolBase[i*3+1],z=poolBase[i*3+2];
   const top=Math.max(-.307,Math.min(.298,level-Math.tan(jug.rotation.z)*x+.012*Math.sin(phase*24+z*8)*remaining));
   const py=v>0?top:-.312,innerRadius=.29+(py+.325)/.65*.06-.012;
   const rr=Math.hypot(x,z),scale=rr>0?innerRadius/rr:0;
   positions.setXYZ(i,x*scale,py,z*scale);
  }
  positions.needsUpdate=true;poolGeometry.computeVertexNormals();poolGeometry.computeBoundingSphere();
  pool.visible=remaining>.005;pool.userData.remaining=remaining;
  const point=(v,s)=>v.set(origin.x+style.reach*s,origin.y+(end.y-origin.y)*s*s,origin.z);
  for(let i=0;i<segments.length;i++){const m=segments[i];m.visible=flow;if(!flow)continue;point(a,i/segments.length);point(b,(i+1)/segments.length);delta.copy(b).sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,delta.clone().normalize());const radius=style.radius*Math.max(.1,envelope)*(1-.23*i/segments.length);m.scale.set(radius,delta.length()+.002,radius);}
  for(let i=0;i<ripples.length;i++){const m=ripples[i];m.visible=flow;if(flow){const cycle=(phase*7+i*.5)%1;m.position.copy(end);m.position.y+=.004+i*.002;m.scale.setScalar(.6+cycle*2);m.material.color.setHex(style.color);m.material.opacity=(1-cycle)*.28*envelope;}}
 }
 return {rig,jug,tip,segments,origin,end,pool,update};
}
