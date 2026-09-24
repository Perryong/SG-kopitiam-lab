import {foods,foodGroups,foodsFor} from './data/food.js';
const grid=document.querySelector('#food-grid'),filters=document.querySelector('#food-filters'),count=document.querySelector('#food-count');
for(const food of foods){
 const card=document.createElement('details');card.className='food-card';card.id='food-'+food.id;card.dataset.foodGroup=food.group;
 const summary=document.createElement('summary');
 const art=document.createElement('span');art.className='food-art';
 const image=document.createElement('img');image.src=food.image;image.alt=food.name;image.loading='lazy';image.decoding='async';image.width=1024;image.height=1024;
 if(food.cell!==null){image.className='food-sheet';image.style.left=-(food.cell%2)*100+'%';image.style.top=-Math.floor(food.cell/2)*100+'%';}
 art.append(image);
 const group=document.createElement('span');group.className='food-kind';group.textContent=foodGroups[food.group];
 const title=document.createElement('h3');title.textContent=food.name;
 const cue=document.createElement('span');cue.className='food-cue';cue.textContent='Explore this dish';
 summary.append(art,group,title,cue);card.append(summary);
 const body=document.createElement('div');body.className='food-story';
 for(const [label,value] of [['Key ingredients',food.ingredients],['Flavour & texture',food.taste],['At the table',food.culture]]){
  const heading=document.createElement('h4');heading.textContent=label;
  const paragraph=document.createElement('p');paragraph.textContent=value;body.append(heading,paragraph);
 }
 if(food.href){const link=document.createElement('a');link.href=food.href;link.textContent='Explore the 3D breakfast ↗';body.append(link);}
 if(!food.href){const make=document.createElement('button');make.type='button';make.className='food-prepare';make.textContent='Prepare in 3D';make.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('prepare-food',{detail:food.id})));body.append(make);}
 card.append(body);grid.append(card);
}
for(const [group,label] of Object.entries(foodGroups)){
 const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.foodFilter=group;button.setAttribute('aria-pressed',String(group==='all'));
 button.addEventListener('click',()=>{
  const matches=new Set(foodsFor(group).map(f=>'food-'+f.id));
  for(const card of grid.children)card.hidden=!matches.has(card.id);
  for(const other of filters.children)other.setAttribute('aria-pressed',String(other===button));
  count.textContent=matches.size+' food stories';
 });filters.append(button);
}
count.textContent=foods.length+' food stories';
