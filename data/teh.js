// Illustrative tea recipes based on the supplied Ya Kun ordering guide.
export const ingredients={sugar:{name:'Sugar',color:'#d6b686',unit:'g',verb:'Add sugar'},condensed:{name:'Condensed milk',color:'#eecb7e',unit:'ml',verb:'Pour condensed milk'},evaporated:{name:'Evaporated milk',color:'#f4e7c5',unit:'ml',verb:'Pour evaporated milk'},tea:{name:'Brewed black tea',color:'#b66b20',unit:'ml',verb:'Pour brewed tea'},water:{name:'Water',color:'#89bbc5',unit:'ml',verb:'Add water'},ice:{name:'Ice',color:'#c0e1e7',unit:'cubes',verb:'Add ice'}};
const recipe=(id,name,family,desc,tea,water,condensed,evaporated,sugar,ice=0,note='')=>({id,name,family,desc,amounts:{sugar,condensed,evaporated,tea,water,ice},note});
export const recipes=[
 recipe('teh','Teh','milk','Fragrant black tea with sweet condensed milk.',150,40,24,0,0,0,'The sweetness comes from condensed milk; no separate sugar is added in this example.'),
 recipe('o','Teh O','black','Black tea with sugar, without milk.',150,64,0,0,6),
 recipe('c','Teh C','milk','Black tea with evaporated milk and sugar.',150,40,0,24,6),
 recipe('siew','Teh Siew Dai','milk','A less-sweet milk tea with less condensed milk.',150,52,12,0,0),
 recipe('os','Teh O Siew Dai','black','Black tea with less sugar.',150,64,0,0,3),
 recipe('cs','Teh C Siew Dai','milk','Evaporated milk tea with less sugar.',150,40,0,24,3),
 recipe('ck','Teh C Kosong','milk','Black tea with evaporated milk, no added sugar.',150,40,0,24,0,0,'Evaporated milk contains naturally occurring milk sugars. Kosong here means no added sugar.'),
 recipe('ok','Teh O Kosong','black','Plain black tea, without milk or sugar.',150,64,0,0,0),
 recipe('peng','Iced Teh','iced','Sweet condensed-milk tea, chilled over ice.',125,15,24,0,0,6,'Also ordered as Teh Peng. Ice quantity and dilution vary between shops.')
];
export const stagesFor=r=>Object.keys(ingredients).filter(k=>r.amounts[k]>0);
export const fillAt=(progress,index,count)=>Math.min(1,Math.max(0,progress*count-index));
export const liquidTotal=r=>['condensed','evaporated','tea','water'].reduce((s,k)=>s+r.amounts[k],0);
