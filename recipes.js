import {recipes as kopi,ingredients as ki} from './data/kopi.js';
import {recipes as teh,ingredients as ti} from './data/teh.js';
import {recipes as milo,ingredients as mi} from './data/milo.js';
export const ingredients={powder:mi.powder,sugar:ki.sugar,condensed:ki.condensed,evaporated:ki.evaporated,coffee:ki.coffee,tea:ti.tea,water:ki.water,ice:ki.ice,topping:mi.topping};
export const categories={kopi:{name:'Kopi',accent:'#aa472d',desc:'Roasted coffee, ordered your way.',reference:'assets/kopi.png'},teh:{name:'Teh',accent:'#8a343c',desc:'Black tea, from plain to creamy.',reference:'assets/teh.png'},milo:{name:'Milo',accent:'#176b3f',desc:'Chocolate malt, hot or over ice.',reference:null}};
export const recipes=Object.entries({kopi,teh,milo}).flatMap(([category,items])=>items.map(r=>({...r,id:category+'-'+r.id,category,family:r.family==='black'?'plain':r.family,amounts:Object.fromEntries(Object.keys(ingredients).map(k=>[k,r.amounts[k]||0]))})));
export const stagesFor=r=>Object.keys(ingredients).filter(k=>r.amounts[k]>0);
export const fillAt=(progress,index,count)=>Math.min(1,Math.max(0,progress*count-index));
export const liquidTotal=r=>['condensed','evaporated','coffee','tea','water'].reduce((s,k)=>s+r.amounts[k],0);
