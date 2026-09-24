// Selection: Migrationology's 25-entry Singapore food guide. Original concise notes.
// Cultural context: NHB Roots, Serving Up a Legacy; ingredient cross-check: Singaporean cuisine.
export const foodTranslations=[];
const text=value=>{const row=value.split('|');foodTranslations.push(row);return row[0];};
export const foodGroups=Object.fromEntries([
 ['all','All food|全部美食|すべて'],['noodles','Noodles|面食|麺料理'],['rice','Rice & shared meals|米饭与合菜|ご飯・シェア料理'],['soups','Soups|汤类|スープ'],['seafood','Seafood|海鲜|海鮮'],['snacks','Snacks & breakfast|小吃与早餐|軽食・朝食'],['sweets','Sweets & fruit|甜品与水果|甘味・果物']
].map(([key,label])=>[key,text(label)]));
// id, group, artwork sheet, quadrant, name, ingredients, flavour, cultural context.
const rows=[
 ['laksa','noodles',0,0,'Laksa|叻沙|ラクサ','Rice noodles, coconut, seafood|米粉、椰奶、海鲜|米麺・ココナッツ・海鮮','Creamy, spicy|浓郁香辣|まろやかでスパイシー','Chinese and Malay influences meet.|融合华人与马来风味。|中華とマレーの味が出会う一杯。'],
 ['bak-kut-teh','soups',0,1,'Bak Kut Teh|肉骨茶|バクテー','Pork ribs, garlic, pepper|排骨、蒜、胡椒|豚スペアリブ・にんにく・胡椒','Peppery, warming|胡椒辛香、暖胃|胡椒が香る温かな味','Tea accompanies the soup.|常配茶享用。|お茶を添えて味わうスープ。'],
 ['hokkien-mee','noodles',0,2,'Hokkien Mee|福建虾面|ホッケンミー','Noodles, prawns, squid|面条、虾、鱿鱼|麺・海老・イカ','Savoury, brothy|鲜香多汁|魚介だしのうま味','A local expression of Hokkien roots.|源于福建饮食传统的本地风味。|福建の食文化から育った地元の味。'],
 ['chicken-rice','rice',0,3,'Chicken Rice|海南鸡饭|チキンライス','Chicken, fragrant rice, ginger|鸡肉、香饭、姜|鶏肉・香り豊かなご飯・生姜','Gentle, aromatic|清鲜芳香|やさしく香り豊か','Hainanese roots, Singapore identity.|海南渊源，新加坡特色。|海南のルーツとシンガポールらしさ。'],
 ['char-kway-teow','noodles',1,0,'Char Kway Teow|炒粿条|チャークイティオ','Flat noodles, egg, cockles|粿条、蛋、血蚶|平麺・卵・貝','Smoky, savoury|锅气浓、咸香|香ばしくコク深い','Wok technique shapes the dish.|炒锅功夫成就风味。|鍋さばきが味を決める一皿。'],
 ['carrot-cake','snacks',1,1,'Carrot Cake · Chai Tow Kway|菜头粿|チャイトウクエ','Radish cake, egg|萝卜糕、蛋|大根餅・卵','Crisp, tender|外脆内软|カリッともっちり','Savoury radish, despite the English name.|名为菜头粿，实为咸味萝卜糕。|英語名はキャロットケーキでも、実は大根料理。'],
 ['wanton-mee','noodles',1,2,'Wanton Mee|云吞面|ワンタンミー','Egg noodles, dumplings, char siu|蛋面、云吞、叉烧|卵麺・ワンタン・チャーシュー','Springy, savoury|弹牙咸香|弾力のある麺とうま味','Cantonese noodles with local character.|粤式面食的本地演绎。|広東の麺文化を地元らしく。'],
 ['bak-chor-mee','noodles',2,0,'Bak Chor Mee|肉脞面|バクチョーミー','Noodles, minced pork, vinegar|面条、肉末、醋|麺・豚ひき肉・酢','Tangy, savoury|酸香鲜美|酸味とうま味','A familiar Singapore noodle order.|熟悉的新加坡面食。|シンガポールでおなじみの麺料理。'],
 ['oyster-omelette','seafood',2,1,'Oyster Omelette · Orh Luak|蚝煎|オールアック','Oysters, egg, starch|生蚝、蛋、淀粉|牡蠣・卵・でんぷん','Crisp, briny|酥脆海味|香ばしさと磯の味','A hawker favourite for sharing.|适合分享的小贩美食。|取り分けて楽しむホーカーの一皿。'],
 ['roast-meat','rice',2,3,'Roast Meat & Duck|烧腊与烧鸭|焼き肉・ローストダック','Roast duck, char siu, rice|烧鸭、叉烧、米饭|ローストダック・チャーシュー・ご飯','Glazed, smoky|酱香、烟熏香|照りと香ばしさ','Cantonese roasting craft on a plate.|一盘展现粤式烧腊功夫。|広東の焼き物の技を一皿に。'],
 ['kaya-toast','snacks',-1,0,'Kaya Toast Breakfast|咖椰吐司早餐|カヤトーストの朝食','Toast, kaya, butter, eggs|吐司、咖椰、牛油、蛋|トースト・カヤ・バター・卵','Crisp, sweet|酥脆香甜|サクッと甘い','The kopitiam morning ritual.|咖啡店的晨间日常。|コピティアムの朝のおなじみ。'],
 ['rojak','snacks',3,2,'Rojak|罗惹|ロジャック','Fruit, tofu, peanuts|水果、豆腐、花生|果物・豆腐・ピーナッツ','Sweet, tangy|甜酸交织|甘味と酸味','Chinese and Indian versions differ.|华式与印度式各有特色。|中華式とインド式で異なる一皿。'],
 ['satay','snacks',3,3,'Satay|沙爹|サテー','Grilled skewers, peanut sauce|烤肉串、花生酱|串焼き・ピーナッツソース','Smoky, nutty|炭香、坚果香|炭火とナッツの香り','A street-hawking tradition lives on.|街头小贩传统延续至今。|屋台の伝統を今に伝える味。'],
 ['ice-kacang','sweets',4,0,'Ice Kacang|红豆冰|アイスカチャン','Shaved ice, beans, syrups|刨冰、红豆、糖浆|かき氷・豆・シロップ','Icy, sweet|冰凉香甜|冷たく甘い','A colourful hawker dessert.|色彩缤纷的小贩甜品。|色鮮やかなホーカースイーツ。'],
 ['nasi-padang','rice',4,2,'Nasi Padang|巴东饭|ナシパダン','Rice, curries, vegetables|米饭、咖喱、蔬菜|ご飯・カレー・野菜','Spiced, varied|香料浓、多样|スパイス豊かで多彩','A Sumatran tradition on local tables.|苏门答腊风味融入本地餐桌。|スマトラの食文化を地元の食卓で。'],
 ['nasi-lemak','rice',4,3,'Nasi Lemak|椰浆饭|ナシレマ','Coconut rice, sambal, anchovies|椰浆饭、参巴、江鱼仔|ココナッツライス・サンバル・小魚','Fragrant, spicy|芳香微辣|香り豊かでスパイシー','Malay roots, enjoyed beyond breakfast.|马来渊源，不止早餐。|マレーのルーツ。朝食以外にも親しまれる。'],
 ['murtabak','snacks',5,0,'Murtabak|印度馅饼|ムルタバ','Flatbread, meat, egg, onion|薄饼、肉、蛋、洋葱|薄焼きパン・肉・卵・玉ねぎ','Crisp, spiced|酥脆、香料浓|香ばしくスパイス豊か','A staple of Indian-Muslim cooking.|印度穆斯林饮食的常见美味。|インド系ムスリム料理の定番。'],
 ['chilli-crab','seafood',5,1,'Chilli Crab|辣椒螃蟹|チリクラブ','Crab, tomato-chilli sauce, egg, mantou|螃蟹、番茄辣椒酱、鸡蛋、馒头|蟹・トマトチリソース・卵・マントウ','Sweet, tangy, gently spicy|甜酸、微辣|甘酸っぱく、ほどよい辛さ','A hands-on shared feast.|动手剥蟹，共享盛宴。|手を使って楽しむシェアのごちそう。'],
 ['sambal-stingray','seafood',5,2,'Sambal Stingray|参巴魔鬼鱼|サンバル・スティングレイ','Stingray, sambal, banana leaf|魔鬼鱼、参巴、香蕉叶|エイ・サンバル・バナナの葉','Fiery, smoky|香辣、炭香|辛味と香ばしさ','A classic hawker barbecue order.|小贩烧烤的经典选择。|ホーカーのバーベキューの定番。'],
 ['fish-head-curry','seafood',5,3,'Fish Head Curry|咖喱鱼头|フィッシュヘッドカレー','Fish head, curry, vegetables|鱼头、咖喱、蔬菜|魚の頭・カレー・野菜','Tangy, spiced|酸香、香料浓|酸味とスパイス','Indian and Chinese tastes intersect.|印度与华人口味交汇。|インドと中華の味覚が交わる料理。']
];
export const foods=rows.map(([id,group,sheet,cell,...copy])=>{
 const [name,ingredients,taste,culture]=copy.map(text);
 return {id,group,name,ingredients,taste,culture,image:id==='fish-head-curry'?'assets/fish-head-curry.png':sheet<0?'assets/nanyang-breakfast.png':`assets/food-${sheet+1}.png`,cell:sheet<0||id==='fish-head-curry'?null:cell,href:id==='kaya-toast'?'#breakfast':null};
});
export const foodsFor=group=>foods.filter(f=>group==='all'||f.group===group);
