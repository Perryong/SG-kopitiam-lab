// English source text is the key; the two columns are Simplified Chinese and Japanese.
const entries=`
Created by|创作者|制作
Kopitiam Lab — Singapore food & drink culture|咖啡店实验室 — 新加坡饮食文化|コピティアム・ラボ — シンガポールの食文化
Explore 35 Singapore Kopi, Teh and Milo orders with interactive 3D pouring and stirring, plus the classic kopitiam breakfast.|通过互动三维冲泡和搅拌动画，探索35种新加坡咖啡、茶和美禄，以及经典咖啡店早餐。|注ぐ・混ぜる3Dアニメーションで、シンガポールのコピ・テー・ミロ35種類と定番の朝食を楽しみましょう。
SINGAPORE FOOD & DRINK CULTURE|新加坡饮食文化|シンガポールの食文化
The drinks counter|饮品柜台|ドリンクカウンター
Breakfast culture|早餐文化|朝食文化
南洋风味|南洋风味|南洋の味
A TASTE OF EVERYDAY SINGAPORE|品味新加坡日常|シンガポールの日常を味わう
ONE COUNTER · THREE FAMILIAR FAVOURITES|一个柜台 · 三种熟悉的味道|ひとつのカウンター・おなじみの3種類
Your order,|您的饮品，|あなたの一杯を、
one layer at a time.|一层一层呈现。|一層ずつ。
Choose a drink. Watch it pour.|选择饮品，观看冲泡。|飲み物を選んで、注ぐ様子を眺めましょう。
Stir, explore, and learn the order.|搅拌、探索，学习点单。|混ぜて、楽しんで、注文の仕方を学びましょう。
01 / 咖啡|01 / 咖啡|01 / コーヒー
02 / 茶|02 / 茶|02 / 紅茶
03 / 美禄|03 / 美禄|03 / ミロ
Kopi|咖啡（Kopi）|コピ（Kopi）
Teh|茶（Teh）|テー（Teh）
Milo|美禄（Milo）|ミロ（Milo）
Roasted coffee, ordered your way.|烘焙咖啡，按您的喜好点单。|お好みの飲み方で楽しむ焙煎コーヒー。
Black tea, from plain to creamy.|红茶，从清茶到浓郁奶茶。|ストレートからミルキーな一杯まで、さまざまな紅茶。
Chocolate malt, hot or over ice.|巧克力麦芽饮品，热饮或加冰。|チョコレート麦芽飲料をホットでもアイスでも。
All|全部|すべて
Milk|加奶|ミルク入り
No extra milk|不额外加奶|追加のミルクなし
No added milk|不加奶|ミルクなし
Iced|冰饮|アイス
Over ice|加冰|氷入り
HOT / 热|热饮|ホット
ICED / 冰|冰饮|アイス
Layers|分层|層を表示
Stirred|搅拌|混ぜる
Setting your glass on the counter…|正在摆放杯子…|グラスを準備しています…
Drag to turn · Scroll to zoom|拖动旋转 · 滚动缩放|ドラッグで回転・スクロールで拡大縮小
Separated layers for illustration|分层仅供示意|層は説明用の表示です
Blended colour is illustrative|混合颜色仅供示意|混ざった色はイメージです
Stirring the ingredients…|正在搅拌配料…|材料を混ぜています…
Swirling and blending…|正在旋转混合…|渦を巻きながら混ざっています…
Inside your glass|杯中配料|グラスの中身
Illustrative amounts; shop recipes vary. Condensed milk is sweetened. Milo powder contains sugar and milk ingredients.|用量仅供示意，各店配方不同。炼乳含糖，美禄粉含糖及乳成分。|分量は説明用で、店によって異なります。練乳には砂糖が、ミロの粉には砂糖と乳成分が含まれます。
Make this kopi|制作这杯咖啡|このコピを作る
Make this teh|制作这杯茶|このテーを作る
Make this milo|制作这杯美禄|このミロを作る
Ready to explore|开始探索吧|さあ、楽しみましょう
Ingredients added · select Stirred to mix|配料已加入 · 选择“搅拌”混合|材料が入りました・「混ぜる」を選んでください
Speed|速度|速度
Slow|慢速|ゆっくり
Normal|正常|標準
Fast|快速|速い
A LITTLE KOPITIAM VOCABULARY|咖啡店点单小词典|コピティアムの注文用語
O|O（不加奶）|O（ミルクなし）
C|C（淡奶）|C（エバミルク）
Siew dai|少甜（Siew dai）|甘さ控えめ（Siew dai）
Gao|浓（Gao）|濃いめ（Gao）
Peng|冰（Peng）|アイス（Peng）
Less sweet|少甜|甘さ控えめ
Stronger|更浓|濃いめ
Gah dai = sweeter · Po = weaker · Ta bao = takeaway. Kosong usually asks for no added sugar; check each recipe’s note for condensed-milk versions. “No extra milk” Milo still contains milk ingredients in the powder.|Gah dai = 多甜 · Po = 淡 · Ta bao = 打包。Kosong 通常表示不加糖；含炼乳的版本请查看配方说明。“不额外加奶”的美禄粉仍含乳成分。|Gah dai＝甘め・Po＝薄め・Ta bao＝持ち帰り。Kosong は通常、砂糖を加えない注文です。練乳入りの場合は各レシピの注記をご確認ください。「追加のミルクなし」のミロも、粉に乳成分を含みます。
南洋早餐 · AT THE BREAKFAST TABLE|南洋早餐 · 围坐早餐桌|南洋の朝食・朝の食卓で
Kaya toast. Soft eggs. Your favourite drink.|咖椰吐司、半熟蛋，还有您喜爱的饮品。|カヤトースト、半熟卵、お気に入りの一杯。
Crack, pour, sprinkle.|敲蛋、淋酱、撒胡椒。|卵を割り、醤油を注ぎ、胡椒をふる。
A familiar Singapore breakfast, brought to life.|让熟悉的新加坡早餐生动呈现。|おなじみのシンガポールの朝食が動き出します。
NANYANG BREAKFAST|南洋早餐|南洋の朝食
Setting the breakfast table…|正在布置早餐桌…|朝食のテーブルを準備しています…
Make the meal|制作早餐|朝食を作る
One delicious ritual.|美味的日常仪式。|おいしい朝のひととき。
Two soft-boiled eggs, a dash of soya sauce and a sprinkle of white pepper. Kaya and butter toast waits on the side.|两颗半熟蛋，淋上少许酱油，再撒些白胡椒。旁边配上咖椰牛油吐司。|半熟卵2個に醤油を少々、白胡椒をひとふり。カヤとバターのトーストを添えます。
Crack the first egg|敲开第一颗蛋|1個目の卵を割る
Crack the second egg|敲开第二颗蛋|2個目の卵を割る
Pour soya sauce|淋上酱油|醤油を注ぐ
Add soya sauce|加入酱油|醤油を加える
Sprinkle white pepper|撒上白胡椒|白胡椒をふる
Select a step to inspect it, or play the full sequence. The animation shows eggs that are already soft-boiled.|选择步骤查看，或播放完整过程。动画中的鸡蛋已煮至半熟。|手順を選んで確認するか、全体を再生してください。アニメーションでは、すでに半熟にゆでた卵を使っています。
Make this breakfast|制作这份早餐|この朝食を作る
Pause breakfast|暂停早餐动画|朝食を一時停止
Continue breakfast|继续早餐动画|朝食を再開
Your Nanyang breakfast is ready|您的南洋早餐已备好|南洋の朝食ができました
Reset meal & view|重置早餐与视角|朝食と視点をリセット
The kaya toast|咖椰吐司|カヤトースト
Golden toast surrounds a layer of kaya and butter. The cut edges let you see what is inside the sandwich.|金黄吐司夹着咖椰酱和牛油，从切面可以看到夹心。|こんがり焼いたパンにカヤとバターを挟みます。切り口から中身が見えます。
The soft-boiled eggs|半熟蛋|半熟卵
The whites spread into the bowl while the yolks stay soft. Soya sauce and pepper settle across the surface.|蛋白铺展在碗中，蛋黄保持柔软。表面淋上酱油并撒上胡椒。|白身が器に広がり、黄身はとろりとしたまま。表面に醤油と胡椒が広がります。
View your Nanyang meal reference|查看南洋早餐参考图|南洋の朝食の参考画像を見る
Inspired by your supplied illustration. Animation and portions are stylised; this is not a cooking-time guide.|灵感来自您提供的插图。动画与份量均为示意，并非烹饪时间指南。|提供されたイラストを参考にしています。動きや分量はイメージで、調理時間の案内ではありません。
Your reference guides & recipe notes|参考指南与配方说明|参考ガイドとレシピの注記
From ordering guide to glass|从点单指南到杯中饮品|注文ガイドから一杯のドリンクへ
Reference images are available for Kopi and Teh. The 35 orders combine your Kopi, Teh and Milo guides in one interactive counter.|咖啡和茶附有参考图片。此互动柜台汇集咖啡、茶和美禄指南中的35种点单方式。|コピとテーの参考画像をご覧いただけます。コピ・テー・ミロのガイドにある35種類を、ひとつのカウンターにまとめました。
Blue water and separated layers make ingredients easier to see. Real drinks mix together. Quantities, displacement and motion are educational illustrations, not official recipes or fluid simulations.|蓝色的水和分层显示便于辨认配料。实际饮品会混合。用量、体积变化及动作仅用于教学示意，并非官方配方或流体模拟。|青い水と層の表示は、材料を見やすくするためのものです。実際の飲み物は混ざり合います。分量・体積変化・動きは学習用のイメージで、公式レシピや流体シミュレーションではありません。
Independent educational project. Reference artwork belongs to its respective owners. Not affiliated with Naumi, Ya Kun or Nestlé; MILO is a Nestlé trademark.|本项目为独立教育项目。参考图版权归各自所有者所有。与 Naumi、亚坤或雀巢无关联；MILO 为雀巢商标。|独立した教育プロジェクトです。参考画像の権利は各権利者に帰属します。Naumi、ヤクン、ネスレとは提携していません。MILO はネスレの商標です。
KOPITIAM LAB · SINGAPORE, SHARED AT THE TABLE|咖啡店实验室 · 餐桌上的新加坡|コピティアム・ラボ・食卓で分かち合うシンガポール
Download source ↓|下载源代码 ↓|ソースをダウンロード ↓
How it works|使用说明|使い方
Sugar|糖|砂糖
Condensed milk|炼乳|加糖練乳
Evaporated milk|淡奶|エバミルク（無糖練乳）
Brewed kopi|冲泡咖啡|抽出したコピ
Brewed black tea|冲泡红茶|抽出した紅茶
Water|水|水
Ice|冰块|氷
Milo powder|美禄粉|ミロの粉
Extra Milo topping|额外美禄粉顶料|仕上げのミロの粉
Add sugar|加入糖|砂糖を加える
Pour condensed milk|倒入炼乳|加糖練乳を注ぐ
Pour evaporated milk|倒入淡奶|エバミルクを注ぐ
Pour brewed kopi|倒入咖啡|コピを注ぐ
Pour brewed tea|倒入红茶|紅茶を注ぐ
Add water|加入水|水を加える
Add ice|加入冰块|氷を加える
Spoon in Milo powder|舀入美禄粉|ミロの粉をスプーンで入れる
Finish with Milo powder|撒上美禄粉作为顶料|仕上げにミロの粉をかける
The classic. Rich coffee, sweet condensed milk.|经典搭配：浓郁咖啡与香甜炼乳。|定番の一杯。コクのあるコーヒーに甘い練乳。
Less sweet, with less condensed milk.|减少炼乳，甜度更低。|練乳を減らして、甘さ控えめに。
Extra sweet, with more condensed milk.|增加炼乳，甜味更足。|練乳を増やして、さらに甘く。
A stronger brew with less dilution.|减少加水，咖啡更浓。|加える水を減らした、濃いめの一杯。
A lighter cup with more water.|增加水量，口味更淡。|水を多めに加えた、軽い飲み口。
Evaporated milk for a lighter, creamy finish.|加入淡奶，奶香柔和。|エバミルクで軽やかでクリーミーな味わいに。
Evaporated milk, without added sugar.|加入淡奶，不额外加糖。|エバミルク入り、砂糖は加えません。
Black coffee, sweetened with sugar.|不加奶的黑咖啡，加糖调甜。|ミルクなしのコーヒーに砂糖を加えます。
Black coffee with no milk or sugar.|黑咖啡，不加奶也不加糖。|ミルクも砂糖も入れないブラックコーヒー。
Black coffee, less sugar.|黑咖啡，少糖。|ブラックコーヒー、砂糖少なめ。
Stronger black coffee with sugar.|浓黑咖啡，加糖。|濃いめのブラックコーヒー、砂糖入り。
Lighter black coffee with sugar.|淡黑咖啡，加糖。|薄めのブラックコーヒー、砂糖入り。
Undiluted brewed kopi, no milk or sugar.|不兑水的冲泡咖啡，不加奶糖。|水で薄めないコピ。ミルクも砂糖も加えません。
Di lo means no added water. This is undiluted brewed kopi, not espresso.|Di lo 表示不加水。这是不兑水的冲泡咖啡，并非意式浓缩咖啡。|Di lo は水を加えないという意味です。抽出したコピを薄めずに出すもので、エスプレッソではありません。
Sweet, milky kopi poured over ice.|香甜奶咖啡，加冰享用。|甘いミルク入りコピを氷に注ぎます。
Sweetened black kopi, served iced.|加糖黑咖啡，冰饮。|砂糖入りのブラックコピをアイスで。
Your guide’s version: no extra sugar.|参考指南中的版本：不额外加糖。|参考ガイドのレシピ：砂糖を追加しません。
¹ This follows the uploaded guide: condensed milk with no extra sugar. Condensed milk is still sweetened. For a clear no-added-sugar order, choose Kopi C Kosong or Kopi O Kosong.|¹ 此版本依据上传的指南：加入炼乳，不额外加糖。炼乳本身含糖。如需明确不加糖的点单，请选淡奶无糖咖啡（Kopi C Kosong）或无糖黑咖啡（Kopi O Kosong）。|¹ 提供されたガイドに基づき、練乳を入れ、砂糖は追加しません。練乳自体には砂糖が含まれます。加糖しない注文なら、Kopi C Kosong または Kopi O Kosong をお選びください。
Black tea with condensed milk, without extra sugar.|红茶加入炼乳，不额外加糖。|練乳入りの紅茶。砂糖は追加しません。
This illustrative version follows the Kopi Kosong convention used here: condensed milk with no extra sugar. Condensed milk is still sweetened. Ordering conventions vary; for no added sugar, choose Teh C Kosong or Teh O Kosong.|此示意版本沿用本项目的 Kopi Kosong 解释：加入炼乳，不额外加糖。炼乳本身含糖。各店点单惯例不同；如需不加糖，请选 Teh C Kosong 或 Teh O Kosong。|この例では、本サイトの Kopi Kosong と同様に練乳を入れ、砂糖は追加しません。練乳自体には砂糖が含まれます。注文の呼び方は店によって異なります。加糖しない注文なら Teh C Kosong または Teh O Kosong をお選びください。
Fragrant black tea with sweet condensed milk.|芳香红茶搭配香甜炼乳。|香り豊かな紅茶に甘い練乳。
The sweetness comes from condensed milk; no separate sugar is added in this example.|甜味来自炼乳；此示例不另加糖。|甘さは練乳によるものです。この例では砂糖を別に加えていません。
Black tea with sugar, without milk.|红茶加糖，不加奶。|ミルクなしの紅茶、砂糖入り。
Black tea with evaporated milk and sugar.|红茶加入淡奶和糖。|紅茶にエバミルクと砂糖を加えます。
A less-sweet milk tea with less condensed milk.|减少炼乳的少甜奶茶。|練乳を減らした、甘さ控えめのミルクティー。
Black tea with less sugar.|红茶，少糖。|紅茶、砂糖少なめ。
Evaporated milk tea with less sugar.|淡奶茶，少糖。|エバミルク入り紅茶、砂糖少なめ。
Black tea with evaporated milk, no added sugar.|红茶加淡奶，不额外加糖。|エバミルク入り紅茶、砂糖は加えません。
Evaporated milk contains naturally occurring milk sugars. Kosong here means no added sugar.|淡奶含天然乳糖。这里的 Kosong 表示不额外加糖。|エバミルクには天然の乳糖が含まれます。ここでの Kosong は砂糖を追加しないという意味です。
Plain black tea, without milk or sugar.|纯红茶，不加奶也不加糖。|ミルクも砂糖も入れないストレートティー。
Sweet condensed-milk tea, chilled over ice.|香甜炼乳奶茶，加冰。|甘い練乳入り紅茶を氷で冷やします。
Also ordered as Teh Peng. Ice quantity and dilution vary between shops.|也可点 Teh Peng。各店冰量和加水量不同。|Teh Peng とも注文できます。氷や水の量は店によって異なります。
The familiar chocolate-malt drink with sweet condensed milk.|熟悉的巧克力麦芽饮品，加入香甜炼乳。|おなじみのチョコレート麦芽飲料に甘い練乳。
Milo and hot water, without extra milk or sugar.|美禄加热水，不额外加奶糖。|ミロとお湯のみ。ミルクや砂糖は追加しません。
Kosong means no extra sugar in this example. Milo powder itself contains sugar and milk ingredients.|此示例中 Kosong 表示不额外加糖。美禄粉本身含糖及乳成分。|この例の Kosong は砂糖を追加しないという意味です。ミロの粉自体に砂糖と乳成分が含まれます。
Chocolate-malt richness with evaporated milk.|浓郁巧克力麦芽风味，搭配淡奶。|チョコレート麦芽のコクにエバミルクを合わせます。
Milo with added sugar, without extra milk.|美禄加糖，不额外加奶。|砂糖入りのミロ。ミルクは追加しません。
More Milo powder and less water make this stronger, thicker and more chocolate-malty. The condensed milk stays at the regular amount.|增加美禄粉并减少水量，使味道更浓、口感更厚实，巧克力麦芽风味更突出。炼乳用量与普通美禄相同。|ミロの粉を増やし、水を減らすことで、濃く、とろみのあるチョコレート麦芽風味になります。練乳の量は通常のミロと同じです。
Iced Milo crowned with a generous mound of dry Milo powder.|冰美禄顶部堆上丰富的干美禄粉。|アイスミロの上に、ミロの粉をたっぷりのせます。
The dry powder crown stays on top when you stir the drink below. This is a stylised illustration.|搅拌下方饮品时，干粉顶料仍留在表面。此为示意动画。|下のドリンクを混ぜても、上の粉はそのまま残ります。これは演出を加えたイメージです。
Less condensed milk for a less-sweet order.|减少炼乳，甜度更低。|練乳を減らして、甘さ控えめに。
Extra condensed milk makes this Milo sweeter and creamier, without making it stronger.|增加炼乳，让这杯美禄更甜、更香滑，但不会更浓。|練乳を増やし、濃さは変えずに、より甘くクリーミーにします。
The classic condensed-milk Milo served over ice.|经典炼乳美禄，加冰享用。|定番の練乳入りミロをアイスで。
Page sections|页面导航|ページ内の案内
Choose drink category|选择饮品类别|飲み物の種類を選択
Filter drink styles|筛选饮品类型|飲み方を絞り込む
3D drink preparation|三维饮品制作|ドリンク作りの3D表示
Glass display|杯中显示方式|グラスの表示方法
Reset glass view|重置杯子视角|グラスの視点をリセット
Preparation playback|制作动画播放|調理アニメーションの再生
Preparation progress|制作进度|ドリンク作りの進行状況
Replay preparation|重播制作过程|ドリンク作りをもう一度再生
Pause preparation|暂停制作过程|ドリンク作りを一時停止
Continue preparation|继续制作过程|ドリンク作りを再開
Breakfast animation steps|早餐动画步骤|朝食アニメーションの手順
Breakfast preparation progress|早餐制作进度|朝食作りの進行状況
Interactive glass showing the ingredients of the selected drink. Drag to rotate.|互动杯子显示所选饮品的配料。拖动可旋转。|選んだ飲み物の材料を表示するグラスです。ドラッグして回転できます。
Interactive Nanyang breakfast: kaya toast, soft-boiled eggs, soya sauce and pepper. Drag to rotate.|互动南洋早餐：咖椰吐司、半熟蛋、酱油和胡椒。拖动可旋转。|南洋の朝食：カヤトースト、半熟卵、醤油、胡椒。ドラッグして回転できます。
User-supplied illustration of kaya toast, a bowl of soft-boiled eggs, kopi, soya sauce and pepper|用户提供的咖椰吐司、半熟蛋、咖啡、酱油和胡椒插图|提供されたカヤトースト、半熟卵、コピ、醤油、胡椒のイラスト
The 3D glass needs WebGL. Enable hardware acceleration or try another browser.|三维杯子需要 WebGL。请开启硬件加速或尝试其他浏览器。|グラスの3D表示には WebGL が必要です。ハードウェアアクセラレーションを有効にするか、別のブラウザーをお試しください。
The animated meal needs WebGL. You can still view the meal reference and recipe notes below.|早餐动画需要 WebGL。您仍可查看下方参考图和配方说明。|朝食のアニメーションには WebGL が必要です。下の参考画像とレシピの注記は引き続きご覧いただけます。
The 3D display was interrupted. Reload to restore your glass.|三维显示已中断。请刷新以恢复杯子。|3D表示が中断されました。再読み込みしてグラスを復元してください。
The 3D display was interrupted. Reload to restore the breakfast scene.|三维显示已中断。请刷新以恢复早餐场景。|3D表示が中断されました。再読み込みして朝食のシーンを復元してください。
Choose language|选择语言|言語を選択
`;
const dictionary=new Map(entries.trim().split('\n').map(line=>{const [en,zh,ja]=line.split('|');return [en,{zh,ja}];}));
const names=`
Kopi Siew Dai|少甜咖啡|甘さ控えめコピ
Kopi Gah Dai|多甜咖啡|甘めのコピ
Kopi Gao|浓咖啡|濃いめのコピ
Kopi Po|淡咖啡|薄めのコピ
Kopi C|淡奶咖啡|エバミルク入りコピ
Kopi C Kosong|淡奶无糖咖啡|エバミルク入りコピ・砂糖なし
Kopi O|黑咖啡|ブラックコピ
Kopi O Kosong|无糖黑咖啡|ブラックコピ・砂糖なし
Kopi O Siew Dai|少糖黑咖啡|ブラックコピ・砂糖少なめ
Kopi O Gao|浓黑咖啡|濃いめのブラックコピ
Kopi O Po|淡黑咖啡|薄めのブラックコピ
Kopi O Kosong Di Lo|不兑水无糖黑咖啡|水を加えないブラックコピ・砂糖なし
Kopi Peng|冰奶咖啡|アイスコピ
Kopi O Peng|冰黑咖啡|アイスブラックコピ
Kopi Kosong¹|不额外加糖咖啡¹|砂糖を追加しないコピ¹
Teh Kosong|不额外加糖奶茶|砂糖を追加しないテー
Teh O|红茶|ミルクなしのテー
Teh C|淡奶茶|エバミルク入りテー
Teh Siew Dai|少甜奶茶|甘さ控えめのテー
Teh O Siew Dai|少糖红茶|ミルクなしのテー・砂糖少なめ
Teh C Siew Dai|少糖淡奶茶|エバミルク入りテー・砂糖少なめ
Teh C Kosong|无糖淡奶茶|エバミルク入りテー・砂糖なし
Teh O Kosong|无糖红茶|ミルクも砂糖もなしのテー
Iced Teh|冰奶茶|アイステー
Milo Kosong|不额外加奶糖美禄|ミルクも砂糖も追加しないミロ
Milo C|淡奶美禄|エバミルク入りミロ
Milo O|加糖美禄|砂糖入りミロ
Milo Gao|浓美禄|濃いめのミロ
Milo Dinosaur|恐龙美禄|ミロ・ダイナソー
Milo Siew Dai|少甜美禄|甘さ控えめのミロ
Milo Gah Dai|多甜美禄|甘めのミロ
Milo Peng|冰美禄|アイスミロ
`;
for(const line of names.trim().split('\n')){const [en,zh,ja]=line.split('|');dictionary.set(en,{zh:`${zh}（${en}）`,ja:`${ja}（${en}）`});}
export function translate(text,language){
 if(!['zh','ja'].includes(language))return text;
 const source=text.trim(),entry=dictionary.get(source);
 let result=entry?.[language],match;
 if(result===undefined){
  if((match=source.match(/^Step (\d+\/\d+) · (.+)$/)))result=`${language==='zh'?'步骤':'手順'} ${match[1]} · ${translate(match[2],language)}`;
  else if((match=source.match(/^(\d+)\. (.+)$/)))result=`${match[1]}. ${translate(match[2],language)}`;
  else if((match=source.match(/^(\d+) (styles|ways to order)$/)))result=language==='zh'?`${match[1]}种点法`:`${match[1]}種類の飲み方`;
  else if((match=source.match(/^(\d+) (g|ml|cubes)$/)))result=`${match[1]} ${{zh:{g:'克',ml:'毫升',cubes:'块'},ja:{g:'g',ml:'ml',cubes:'個'}}[language][match[2]]}`;
  else if((match=source.match(/^Paired with (.+)$/)))result=language==='zh'?`搭配${translate(match[1],language)}`:`${translate(match[1],language)}と一緒に`;
  else if((match=source.match(/^Your supplied (.+) ordering guide$/)))result=language==='zh'?`您提供的${translate(match[1],language)}点单指南`:`提供された${translate(match[1],language)}の注文ガイド`;
 }
 return result===undefined?text:text.replace(source,result);
}
