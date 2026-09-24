import assert from 'node:assert/strict';
import {recipes,ingredients,stagesFor,liquidTotal} from '../recipes.js';
import {flowStyles,createPourRig} from '../pouring.js';
import * as THREE from '../vendor/three.module.js';

// Catch omitted menu drinks, unrendered ingredients and glasses overflowing after ice.
const others=recipes.filter(r=>r.category==='others');
assert.equal(others.length,12);
assert.equal(new Set(recipes.map(r=>r.id)).size,recipes.length);
const rig=createPourRig(new THREE.Group());
for(const r of others){
 assert.ok(liquidTotal(r)>100,r.name);
 assert.ok(liquidTotal(r)+r.amounts.ice*7<=250,`${r.name}: glass capacity`);
 for(const key of stagesFor(r)){
  assert.ok(Number.isFinite(r.amounts[key])&&r.amounts[key]>0);
  if(ingredients[key].unit==='ml'){
   assert.ok(flowStyles[key],`${key}: pouring support`);
   rig.update(key,.5,2);
   assert.ok(rig.rig.visible);
   assert.ok(rig.origin.toArray().every(Number.isFinite));
  }
 }
}
assert.deepEqual(stagesFor(others.find(r=>r.id==='others-yuan-yang')),['condensed','coffee','tea','water']);
assert.ok(others.find(r=>r.id==='others-honey-lemon').amounts.lemon>0);
assert.ok(others.find(r=>r.id==='others-plum-lime').amounts.plum>0);
console.log('Others recipes, glass capacity and ingredient pouring passed.');

// Catch garnish leakage on category switches and incorrect reverse scrubbing.
const {createGarnishes}=await import('../garnishes.js');
const garnish=createGarnishes(new THREE.Group());
garnish.update({lemon:1},2);
assert.equal(garnish.items.lemon.visible,true);
assert.equal(garnish.items.lime.visible,false);
garnish.update({lemon:0},1);
assert.equal(garnish.items.lemon.visible,false);
garnish.update({lime:.5,plum:1,grains:1,stalk:1},2);
for(const key of ['lime','plum','grains','stalk'])assert.equal(garnish.items[key].visible,true);
garnish.update({},2);
for(const object of Object.values(garnish.items))assert.equal(object.visible,false);
console.log('Garnish playback, scrubbing and category reset passed.');
