import * as THREE from './vendor/three.module.js';

// Open handle paths end at the outside wall. A complete torus would put its
// inner half through the vessel and into the liquid when the jug tilts.
export function jugHandleGeometry(){
 const path=new THREE.CubicBezierCurve3(
  new THREE.Vector3(-.37,.22,0),new THREE.Vector3(-.86,.40,0),
  new THREE.Vector3(-.82,-.43,0),new THREE.Vector3(-.335,-.22,0));
 return new THREE.TubeGeometry(path,48,.024,12,false);
}

export function glassHandleGeometry(){
 const path=new THREE.CatmullRomCurve3([
  new THREE.Vector3(1.10,2.60,0),new THREE.Vector3(1.68,2.57,0),
  new THREE.Vector3(1.85,1.85,0),new THREE.Vector3(1.68,1.03,0),
  new THREE.Vector3(1.10,1.00,0)]);
 return new THREE.TubeGeometry(path,48,.085,12,false);
}
