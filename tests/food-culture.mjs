import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {foods,foodsFor,foodGroups,foodTranslations} from '../data/food.js';
import {translate} from '../translations.js';
assert.equal(foods.length,19);
assert.equal(new Set(foods.map(f=>f.id)).size,19);
assert.equal(foodsFor('all').length,19);
assert.deepEqual(foodsFor('sweets').map(f=>f.id),['ice-kacang']);
assert.ok(foodsFor('seafood').some(f=>f.id==='fish-head-curry'));
for(const id of ['yong-tau-foo','peranakan','zi-char','durian','fish-bee-hoon','murtabak'])assert.ok(!foods.some(f=>f.id===id),id);
assert.equal(foods.find(f=>f.id==='chilli-crab').name,'Chilli Crab');
assert.equal(foodsFor('unknown').length,0);
for(const group of Object.keys(foodGroups))assert.ok(foodsFor(group).length>0);
for(const f of foods){
 assert.ok(f.name&&f.ingredients&&f.taste&&f.culture);
 assert.ok(f.image.startsWith('assets/'));
 assert.ok(existsSync(new URL('../'+f.image,import.meta.url)),f.image);
 assert.ok(f.cell===null||[0,1,2,3].includes(f.cell));
 for(const text of [f.name,f.ingredients,f.taste,f.culture])for(const lang of ['zh','ja'])assert.notEqual(translate(text,lang),text,`${lang}: ${text}`);
}
assert.equal(foods.find(f=>f.id==='kaya-toast').href,'#breakfast');
for(const [en] of foodTranslations)for(const lang of ['zh','ja'])assert.notEqual(translate(en,lang),en,`${lang}: ${en}`);
console.log('Food catalogue, filters, breakfast link and translations passed.');
