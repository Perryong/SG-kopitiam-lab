// Menu names: https://www.kaffeandtoast.sg/menus?menu=kaffe--toast-menu
// These are educational approximations, not the restaurant's recipes.
export const ingredients={
 honey:{name:'Honey',color:'#dba73a',unit:'ml',verb:'Pour honey'},
 thaiTea:{name:'Brewed Thai tea',color:'#d46b1f',unit:'ml',verb:'Pour Thai tea'},
 limeJuice:{name:'Lime juice',color:'#bec97a',unit:'ml',verb:'Pour lime juice'},
 barley:{name:'Barley water',color:'#e3d7af',unit:'ml',verb:'Pour barley water'},
 lemongrassTea:{name:'Lemongrass infusion',color:'#d9ce8c',unit:'ml',verb:'Pour lemongrass infusion'},
 chineseTea:{name:'Brewed Chinese tea',color:'#be8a38',unit:'ml',verb:'Pour Chinese tea'},
 lemon:{name:'Lemon slice',color:'#f1cf47',unit:'pieces',verb:'Add lemon'},
 lime:{name:'Lime slice',color:'#83a747',unit:'pieces',verb:'Add lime'},
 plum:{name:'Preserved plum',color:'#795037',unit:'pieces',verb:'Add preserved plum'},
 grains:{name:'Barley grains',color:'#efdfb6',unit:'g',verb:'Add barley grains'},
 stalk:{name:'Lemongrass stalk',color:'#bbbf7f',unit:'pieces',verb:'Add lemongrass'}
};
const note='Illustrative recipe inspired by the menu; amounts, garnishes and serving temperatures vary by shop.';
export const recipes=[
 {id:'yuan-yang',name:'Yuan Yang',family:'milk',desc:'Coffee and black tea with condensed milk.',amounts:{coffee:85,tea:85,condensed:24,water:20},color:'#a27448'},
 {id:'yuan-yang-c',name:'Yuan Yang C',family:'milk',desc:'Coffee and black tea with evaporated milk.',amounts:{coffee:85,tea:85,evaporated:24,water:20,sugar:6},color:'#ad8054'},
 {id:'iced-yuan-yang',name:'Iced Yuan Yang',family:'iced',desc:'Milky coffee and tea, chilled over ice.',amounts:{coffee:65,tea:65,condensed:24,water:10,ice:6},color:'#aa7c50'},
 {id:'thai-milk-tea',name:'Thai Iced Milk Tea',family:'iced',desc:'Orange-hued Thai tea with creamy milk and ice.',amounts:{thaiTea:130,condensed:24,evaporated:16,ice:6},color:'#d98b45'},
 {id:'plum-lime',name:'Iced Plum Lime Juice',family:'iced',desc:'Tart lime with preserved plum and ice.',amounts:{limeJuice:35,water:140,sugar:10,ice:6,lime:1,plum:1},color:'#b8bb76'},
 {id:'lemon-tea',name:'Iced Lemon Tea',family:'iced',desc:'Sweet black tea with lemon and ice.',amounts:{tea:145,water:25,sugar:8,ice:6,lemon:1},color:'#b0782e'},
 {id:'barley',name:'Barley Drink',family:'plain',desc:'A gently sweet, cloudy barley drink.',amounts:{barley:210,sugar:6,grains:8},color:'#ded2ac'},
 {id:'barley-lemon',name:'Barley Lemon Drink',family:'plain',desc:'Cloudy barley water brightened with lemon.',amounts:{barley:210,sugar:6,grains:8,lemon:1},color:'#dfd4a8'},
 {id:'honey',name:'Honey Drink',family:'plain',desc:'Golden honey stirred into warm water.',amounts:{honey:20,water:194},color:'#dcc478'},
 {id:'honey-lemon',name:'Honey Lemon Drink',family:'plain',desc:'Warm honey water with a citrus lift.',amounts:{honey:20,water:194,lemon:1},color:'#dccc7c'},
 {id:'lemongrass',name:'Lemongrass Drink',family:'plain',desc:'A light, aromatic lemongrass infusion.',amounts:{lemongrassTea:214,sugar:6,stalk:1},color:'#d5ce94'},
 {id:'chinese-tea',name:'Chinese Tea',family:'plain',desc:'A clear, fragrant tea without milk or sugar.',amounts:{chineseTea:214},color:'#b58b46'}
].map(r=>({...r,note}));
