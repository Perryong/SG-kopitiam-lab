// Illustrative teaching recipes, not standard kopitiam measurements.
export const ingredients={sugar:{name:'Sugar',color:'#d6b686',unit:'g',verb:'Add sugar'},condensed:{name:'Condensed milk',color:'#eecb7e',unit:'ml',verb:'Pour condensed milk'},evaporated:{name:'Evaporated milk',color:'#f4e7c5',unit:'ml',verb:'Pour evaporated milk'},coffee:{name:'Brewed kopi',color:'#66351f',unit:'ml',verb:'Pour brewed kopi'},water:{name:'Water',color:'#89bbc5',unit:'ml',verb:'Add water'},ice:{name:'Ice',color:'#c0e1e7',unit:'cubes',verb:'Add ice'}};
const r=(id,name,family,desc,coffee,water,condensed,evaporated,sugar,ice=0,note='')=>({id,name,family,desc,amounts:{sugar,condensed,evaporated,coffee,water,ice},note});
export const recipes=[
 r('kopi','Kopi','milk','The classic. Rich coffee, sweet condensed milk.',90,100,24,0,4),
 r('siew','Kopi Siew Dai','milk','Less sweet, with less condensed milk.',90,112,12,0,2),
 r('gah','Kopi Gah Dai','milk','Extra sweet, with more condensed milk.',90,88,36,0,8),
 r('gao','Kopi Gao','milk','A stronger brew with less dilution.',125,65,24,0,4),
 r('po','Kopi Po','milk','A lighter cup with more water.',60,130,24,0,4),
 r('c','Kopi C','milk','Evaporated milk for a lighter, creamy finish.',90,100,0,24,6),
 r('ck','Kopi C Kosong','milk','Evaporated milk, without added sugar.',90,100,0,24,0),
 r('o','Kopi O','black','Black coffee, sweetened with sugar.',90,124,0,0,6),
 r('ok','Kopi O Kosong','black','Black coffee with no milk or sugar.',90,124,0,0,0),
 r('os','Kopi O Siew Dai','black','Black coffee, less sugar.',90,124,0,0,3),
 r('og','Kopi O Gao','black','Stronger black coffee with sugar.',135,79,0,0,6),
 r('op','Kopi O Po','black','Lighter black coffee with sugar.',60,154,0,0,6),
 r('dilo','Kopi O Kosong Di Lo','black','Undiluted brewed kopi, no milk or sugar.',200,0,0,0,0,0,'Di lo means no added water. This is undiluted brewed kopi, not espresso.'),
 r('peng','Kopi Peng','iced','Sweet, milky kopi poured over ice.',90,50,24,0,4,6),
 r('openg','Kopi O Peng','iced','Sweetened black kopi, served iced.',90,74,0,0,6,6),
 r('kosong','Kopi Kosong¹','milk','Your guide’s version: no extra sugar.',90,100,24,0,0,0,'¹ This follows the uploaded guide: condensed milk with no extra sugar. Condensed milk is still sweetened. For a clear no-added-sugar order, choose Kopi C Kosong or Kopi O Kosong.')
];
export const stagesFor=r=>Object.keys(ingredients).filter(k=>r.amounts[k]>0);
export const fillAt=(progress,index,count)=>Math.min(1,Math.max(0,progress*count-index));
export const liquidTotal=r=>['condensed','evaporated','coffee','water'].reduce((s,k)=>s+r.amounts[k],0);
