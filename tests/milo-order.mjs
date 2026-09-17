import assert from 'node:assert/strict';
import {recipes} from '../recipes.js';

assert.deepEqual(
 recipes.filter(recipe=>recipe.category==='milo').map(recipe=>recipe.name),
 ['Milo','Milo Kosong','Milo C','Milo O','Milo Gao','Milo Siew Dai','Milo Gah Dai','Milo Dinosaur','Milo Peng']
);
console.log('Milo Dinosaur follows Milo Gah Dai.');
