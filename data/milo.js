// Illustrative amounts interpreted from the supplied Singapore Milo ordering guide.
export const ingredients={powder:{name:'Milo powder',color:'#75472c',unit:'g',verb:'Spoon in Milo powder'},sugar:{name:'Added sugar',color:'#d6b686',unit:'g',verb:'Add sugar'},condensed:{name:'Condensed milk',color:'#eecb7e',unit:'ml',verb:'Pour condensed milk'},evaporated:{name:'Evaporated milk',color:'#f4e7c5',unit:'ml',verb:'Pour evaporated milk'},water:{name:'Hot water',color:'#89bbc5',unit:'ml',verb:'Pour hot water'},ice:{name:'Ice',color:'#c0e1e7',unit:'cubes',verb:'Add ice'},topping:{name:'Extra Milo topping',color:'#6b3d23',unit:'g',verb:'Finish with Milo powder'}};
const recipe=(id,name,family,desc,powder,water,condensed=0,evaporated=0,sugar=0,ice=0,topping=0,note='')=>({id,name,family,desc,amounts:{powder,sugar,condensed,evaporated,water,ice,topping},note});
export const recipes=[
 recipe('milo','Milo','milk','The familiar chocolate-malt drink with sweet condensed milk.',25,170,24),
 recipe('kosong','Milo Kosong','plain','Milo and hot water, without extra milk or sugar.',25,194,0,0,0,0,0,'Kosong means no extra sugar in this example. Milo powder itself contains sugar and milk ingredients.'),
 recipe('c','Milo C','milk','Chocolate-malt richness with evaporated milk.',25,170,0,24),
 recipe('o','Milo O','plain','Milo with added sugar, without extra milk.',25,194,0,0,6),
 recipe('gao','Milo Gao','milk','More Milo powder and less water make this stronger, thicker and more chocolate-malty. The condensed milk stays at the regular amount.',38,155,24,0,4),
 recipe('dinosaur','Milo Dinosaur','iced','Iced Milo crowned with a generous mound of dry Milo powder.',25,115,24,0,4,6,18,'The dry powder crown stays on top when you stir the drink below. This is a stylised illustration.'),
 recipe('siew','Milo Siew Dai','milk','Less condensed milk for a less-sweet order.',25,182,12),
 recipe('gah','Milo Gah Dai','milk','More condensed milk makes this sweeter and creamier. The Milo powder stays at the regular amount, so the change is sweetness rather than strength.',25,158,36),
 recipe('peng','Milo Peng','iced','The classic condensed-milk Milo served over ice.',25,125,24,0,0,6)
];
export const stagesFor=r=>Object.keys(ingredients).filter(k=>r.amounts[k]>0);
export const fillAt=(progress,index,count)=>Math.min(1,Math.max(0,progress*count-index));
export const liquidTotal=r=>['condensed','evaporated','water'].reduce((s,k)=>s+r.amounts[k],0);
