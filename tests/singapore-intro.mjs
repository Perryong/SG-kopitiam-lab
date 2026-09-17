import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {translate} from '../translations.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const intro=html.indexOf('class="singapore-intro"');
assert.ok(intro>0,'Singapore introduction is missing');
assert.ok(intro<html.indexOf('id="counter"'),'Singapore introduction must precede the drinks counter');
assert.match(html,/href="https:\/\/perryong\.github\.io\/Singapore-3D\/" target="_blank" rel="noopener"/);
for(const language of ['zh','ja']){
 assert.notEqual(translate('Discover Singapore in 3D.',language),'Discover Singapore in 3D.');
 assert.notEqual(translate('Explore Singapore in 3D ↗',language),'Explore Singapore in 3D ↗');
}
console.log('Singapore introduction placement, link and translations passed.');
