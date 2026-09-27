// Short visual sequences, not cooking instructions or elapsed cooking times.
export const preparationTranslations=[];
const labels={
 noodles:'Add the noodles|加入面条|麺を入れる',broth:'Pour the broth|倒入高汤|スープを注ぐ',seafood:'Add the seafood|加入海鲜|魚介を加える',garnish:'Finish with herbs and lime|加入香草和青柠|ハーブとライムを添える',
 ribs:'Add the pork ribs|加入排骨|豚スペアリブを入れる',garlic:'Add garlic and pepper|加入蒜与胡椒|にんにくと胡椒を加える',simmer:'Simmer the broth|炖煮高汤|スープを煮込む',greens:'Add the greens|加入青菜|青菜を添える',
 toss:'Toss and coat the noodles|翻炒拌匀面条|麺を炒めて絡める',rice:'Plate the rice|盛上米饭|ご飯を盛る',chicken:'Arrange the cooked chicken|摆上熟鸡肉|調理済みの鶏肉を並べる',cucumber:'Add cucumber|加入黄瓜|きゅうりを添える',sauce:'Spoon over the sauce|淋上酱汁|ソースをかける',
 cake:'Add the radish cake|加入萝卜糕|大根餅を入れる',egg:'Add the egg|加入蛋液|卵を加える',sear:'Turn and brown|翻面煎香|返して焼き色をつける',scallions:'Scatter spring onions|撒上葱花|ねぎを散らす',dumplings:'Add the wontons|加入云吞|ワンタンを添える',roast:'Arrange the roast meat|摆上烧腊|ロースト肉を並べる',fish:'Add the fish slices|加入鱼片|魚の切り身を加える',pork:'Add minced pork and mushrooms|加入肉末与香菇|豚ひき肉ときのこを加える',
 oysters:'Add the oysters|加入生蚝|牡蠣を加える',tofu:'Add stuffed tofu and fish balls|加入酿豆腐和鱼丸|具入り豆腐と魚団子を加える',curry:'Pour the curry|倒入咖喱|カレーを注ぐ',stew:'Add chicken and keluak nuts|加入鸡肉与黑果|鶏肉とクルアの実を加える',braise:'Braise and glaze|焖煮挂汁|煮込んで照りを出す',vegetables:'Add the vegetables|加入蔬菜|野菜を加える',
 fruit:'Add fruit and cucumber|加入水果和黄瓜|果物ときゅうりを入れる',fritters:'Add tofu and fritters|加入豆腐和油条|豆腐と揚げパンを加える',mix:'Toss with the dressing|拌入酱汁|ドレッシングで和える',peanuts:'Sprinkle crushed peanuts|撒上花生碎|砕いたピーナッツを散らす',skewers:'Lay out the skewers|摆上肉串|串を並べる',grill:'Turn the skewers on the grill|翻转炭烤肉串|グリルで串を返す',dip:'Add peanut sauce|加入花生酱|ピーナッツソースを添える',
 beans:'Add beans and jelly|加入红豆和果冻|豆とゼリーを入れる',ice:'Build the shaved ice|堆上刨冰|かき氷を盛る',syrup:'Drizzle coloured syrups|淋上彩色糖浆|色とりどりのシロップをかける',corn:'Finish with corn and milk|加入玉米和奶|コーンとミルクを添える',
 shell:'Set down the durian|放下榴莲|ドリアンを置く',open:'Open the husk|打开果壳|殻を開く',flesh:'Reveal the golden flesh|露出金黄果肉|黄金色の果肉を見せる',serve:'Lift out a segment|取出一瓣果肉|果肉をひと房取り出す',
 rendang:'Add the cooked rendang|加入熟仁当肉|調理済みのルンダンを添える',sambal:'Add sambal and sides|加入参巴与配菜|サンバルと付け合わせを添える',
 crab:'Add the crab|加入螃蟹|蟹を入れる',chilli:'Pour chilli sauce|倒入辣椒酱|チリソースを注ぐ',mantou:'Serve with mantou|配上馒头|マントウを添える',leaf:'Lay out a banana leaf|铺上香蕉叶|バナナの葉を敷く',ray:'Set down the stingray|放上魔鬼鱼|エイをのせる',coat:'Coat with sambal|涂上参巴|サンバルを塗る',char:'Grill and finish with lime|烤香后加入青柠|焼いてライムを添える',head:'Add the fish head|加入鱼头|魚の頭を入れる',okra:'Add okra and tomato|加入秋葵和番茄|オクラとトマトを加える'
};
for(const row of Object.values(labels))preparationTranslations.push(row.split('|'));
const step=(label,kind,action='place')=>({label:labels[label].split('|')[0],kind,action});
const s=step;
export const preparations={
 'laksa':{vessel:'bowl',steps:[s('noodles','white-noodles'),s('broth','laksa-broth','pour'),s('seafood','prawns'),s('garnish','herbs-lime','sprinkle')]},
 'bak-kut-teh':{vessel:'bowl',steps:[s('ribs','ribs'),s('garlic','garlic'),s('simmer','clear-broth','simmer'),s('greens','herbs','sprinkle')]},
 'hokkien-mee':{vessel:'wok',steps:[s('noodles','mixed-noodles'),s('seafood','prawns-squid'),s('toss','light-sauce','toss'),s('garnish','herbs-lime','sprinkle')]},
 'chicken-rice':{vessel:'plate',steps:[s('rice','rice'),s('chicken','chicken'),s('cucumber','cucumber'),s('sauce','chilli-dip','pour')]},
 'char-kway-teow':{vessel:'wok',steps:[s('noodles','flat-noodles'),s('egg','ckt-egg-sausage'),s('toss','ckt-sauce','toss'),s('seafood','ckt-cockles')]},
 'carrot-cake':{vessel:'pan',steps:[s('cake','radish-cubes'),s('egg','egg','pour'),s('sear','sear-marks','turn'),s('scallions','herbs','sprinkle')]},
 'wanton-mee':{vessel:'bowl',steps:[s('noodles','yellow-noodles'),s('dumplings','wontons'),s('roast','char-siu'),s('greens','greens')]},
 'bak-chor-mee':{vessel:'bowl',steps:[s('noodles','mee-pok'),s('pork','bcm-toppings'),s('sauce','bcm-sauce','pour'),s('scallions','bcm-garnish','sprinkle')]},
 'oyster-omelette':{vessel:'pan',steps:[s('egg','orh-egg','pour'),s('oysters','orh-oysters'),s('sear','orh-sear','turn'),s('scallions','orh-garnish','sprinkle')]},
 'roast-meat':{vessel:'plate',steps:[s('rice','rice'),s('roast','roast-duck'),s('roast','roast-char-siu'),s('cucumber','roast-cucumber')]},
 'rojak':{vessel:'bowl',steps:[s('fruit','rojak-fruit'),s('fritters','rojak-fritters'),s('mix','rojak-sauce','toss'),s('peanuts','rojak-peanuts','sprinkle')]},
 'satay':{vessel:'grill',steps:[s('skewers','satay-skewers'),s('grill','satay-char','turn'),s('dip','satay-peanut-dip','pour'),s('cucumber','satay-sides')]},
 'ice-kacang':{vessel:'bowl',cold:true,steps:[s('beans','beans'),s('ice','ice','grow'),s('syrup','syrup','pour'),s('corn','corn','sprinkle')]},
 'nasi-padang':{vessel:'plate',steps:[s('rice','rice'),s('rendang','rendang'),s('vegetables','greens'),s('sambal','sambal')]},
 'nasi-lemak':{vessel:'plate',steps:[s('rice','rice'),s('chicken','fried-chicken'),s('cucumber','egg-cucumber'),s('sambal','sambal-anchovies')]},
 'chilli-crab':{vessel:'plate',steps:[s('crab','crab'),s('chilli','crab-sauce','pour'),s('braise','crab-herbs','simmer'),s('mantou','mantou')]},
 'sambal-stingray':{vessel:'grill',steps:[s('leaf','stingray-leaf'),s('ray','stingray-wing'),s('coat','stingray-sambal','pour'),s('char','stingray-garnish','turn')]},
 'fish-head-curry':{vessel:'claypot',steps:[s('head','fish-head'),s('curry','orange-curry','pour'),s('okra','okra-tomato'),s('simmer','herbs','simmer')]}
};
