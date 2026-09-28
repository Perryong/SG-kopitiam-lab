import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.js';
import {translate} from '../translations.js';
import {foods} from '../data/food.js';
import {preparations,createFoodScene,loadFoodModels} from '../food-scene.js';
for(const food of foods.filter(f=>f.id!=='kaya-toast')){
 assert.ok(preparations[food.id],food.id);
 for(const step of preparations[food.id].steps)for(const lang of ['zh','ja'])assert.notEqual(translate(step.label,lang),step.label,lang+': '+step.label);
 await loadFoodModels(food.id);
 const parent=new THREE.Group(),dish=createFoodScene(parent,food.id);
 const table=dish.root.getObjectByName('Hawker table');assert.ok(['Table top','Stool seat 1','Chilli sauce','Kopi cup','Tissue packet'].every(n=>table?.getObjectByName(n)),food.id+': hawker table setting');
 if(food.id==='fish-head-curry'){assert.ok(dish.ingredients[0].children.some(o=>o.name==='Snapper head cheek'));assert.ok(dish.ingredients[0].children.some(o=>o.name==='Pectoral fin'));}
 if(food.id==='bak-kut-teh')dish.ingredients[0].traverse(o=>assert.notEqual(o.geometry?.type,'BoxGeometry','ribs must not be rectangular blocks'));
 for(const [dishId,part] of [['nasi-lemak','Fried chicken'],['sambal-stingray','Stingray wing'],['rojak','Prawn paste coat'],['bak-chor-mee','Braised shiitake 1'],['oyster-omelette','Oyster'],['roast-meat','Duck skin 1'],['satay','Satay meat'],['ice-kacang','Shaved ice'],['chilli-crab','Cooked crab'],['char-kway-teow','Lap cheong 1'],['hokkien-mee','Stock glaze 1'],['carrot-cake','Radish cake'],['chicken-rice','Poached chicken 1']])if(food.id===dishId)assert.ok(dish.root.getObjectByName(part),dishId+': Kiln model part '+part);
 for(const p of [0,.13,.38,.63,.88,1,.25,0,1]){
  const state=dish.update(p);
  assert.equal(state.ready,p===1);
  parent.updateMatrixWorld(true);
  parent.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite),food.id));
 }
 for(const [i,step] of preparations[food.id].steps.entries())if(step.action==='pour'){
  for(const phase of [.2,.5,.8]){
   dish.update((i+phase)/4);
   const {spoon,stream,lip,start,end}=dish.pour;
   assert.ok(spoon.visible&&stream.visible,food.id+': visible pour');
   spoon.updateMatrix();assert.ok(lip.clone().applyMatrix4(spoon.matrix).distanceTo(start)<1e-8,food.id+': stream attached to lip');
   assert.ok(start.y>end.y&&spoon.rotation.x>0,food.id+': downward pour');
   const actualStart=new THREE.Vector3(0,-.5,0).multiply(stream.scale).applyQuaternion(stream.quaternion).add(stream.position);
   assert.ok(actualStart.distanceTo(start)<1e-8,food.id+': no gap at stream source');
  }
 }
 dish.update(0);assert.ok(dish.ingredients.every(g=>!g.visible),food.id+': reset');
 dish.update(1);assert.ok(dish.ingredients.every(g=>g.visible),food.id+': complete');
 const positions=dish.ingredients.map(g=>g.position.toArray());
 dish.update(.45);dish.update(1);
 assert.deepEqual(dish.ingredients.map(g=>g.position.toArray()),positions,food.id+': deterministic scrubbing');
 const resources=new Set();dish.root.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material){resources.add(o.material);if(o.material.bumpMap)resources.add(o.material.bumpMap);}});
 assert.ok([...resources].some(r=>r.isTexture),food.id+': food surface detail');
 const disposed=new Map();for(const r of resources)r.addEventListener('dispose',()=>disposed.set(r,(disposed.get(r)||0)+1));
 dish.dispose();for(const r of resources)assert.equal(disposed.get(r),1,food.id+': resource disposed once');assert.equal(parent.children.length,0,food.id+': disposal');
}
assert.throws(()=>createFoodScene(new THREE.Group(),'unknown'),/Unknown/);
console.log('All 18 food scenes: stages, finite transforms, reset, replay and disposal passed.');
