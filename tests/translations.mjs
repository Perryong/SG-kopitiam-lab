import assert from 'node:assert/strict';
import {translate} from '../translations.js';
import {recipes,ingredients,categories} from '../recipes.js';
for(const language of ['zh','ja']){
 for(const text of [...recipes.flatMap(r=>[r.name,r.desc,r.note]),...Object.values(ingredients).flatMap(i=>[i.name,i.verb]),...Object.values(categories).map(c=>c.desc)].filter(Boolean)){
  assert.notEqual(translate(text,language),text,`${language}: missing ${text}`);
 }
 assert.match(translate('Step 2/4 · Pour condensed milk',language),/2\/4/);
 assert.notEqual(translate('Step 2/4 · Pour condensed milk',language),'Step 2/4 · Pour condensed milk');
 assert.notEqual(translate('6 cubes',language),'6 cubes');
 assert.notEqual(translate('Paired with Teh',language),'Paired with Teh');
}
assert.equal(translate('Make this kopi','en'),'Make this kopi');
assert.equal(translate('Make this kopi','invalid'),'Make this kopi');
console.log('Recipe and dynamic translation coverage passed.');
