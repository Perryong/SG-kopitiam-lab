import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {foods} from './data/food.js';
import {preparations,createFoodScene,loadFoodModels} from './food-scene.js';
const $=id=>document.getElementById(id),host=$('food-scene'),select=$('kitchen-dish'),play=$('kitchen-play'),slider=$('kitchen-progress'),status=$('kitchen-status'),steps=$('kitchen-steps');
for(const food of foods.filter(f=>preparations[f.id])){const option=document.createElement('option');option.value=food.id;option.textContent=food.name;select.append(option);}
let loading=0,renderer,scene,camera,controls,dish,food=foods[0],progress=1,playing=false,visible=false,previous=0,failed=false,lastStatus='',lastPlay='';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function resetView(){camera.position.set(3.9,4.9,5.8);controls.target.set(0,.55,0);controls.update();}
function refresh(){
 if(!dish)return;
 const state=dish.update(progress),recipe=preparations[food.id];slider.value=Math.round(progress*1000);
 const label=state.ready?'Ready to serve':`Step ${state.stage+1}/4 · ${recipe.steps[state.stage].label}`;
 if(lastStatus!==label){lastStatus=label;status.textContent=label;}
 $('kitchen-percent').textContent=Math.round(progress*100)+'%';
 const playLabel=playing?'Pause preparation':progress>=1||progress===0?'Make this dish':'Continue preparation';if(lastPlay!==playLabel){lastPlay=playLabel;play.textContent=playLabel;}play.setAttribute('aria-pressed',String(playing));
 for(const [i,button] of [...steps.children].entries())button.setAttribute('aria-pressed',String(!state.ready&&i===state.stage));
}
function setup(){
 if(renderer||failed)return !failed;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{failed=true;host.textContent='The 3D kitchen needs WebGL. You can still explore the illustrated food cards.';play.disabled=true;slider.disabled=true;$('kitchen-reset').disabled=true;$('kitchen-speed').disabled=true;return false;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 host.replaceChildren(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive food preparation. Drag to rotate and scroll to zoom.');
 scene=new THREE.Scene();scene.add(new THREE.HemisphereLight('#fff4df','#82715c',1.6));
 const light=new THREE.DirectionalLight('#fff1db',3.6);light.position.set(-3,7,5);light.castShadow=true;light.shadow.mapSize.set(2048,2048);light.shadow.radius=3;Object.assign(light.shadow.camera,{left:-7,right:7,top:7,bottom:-7});light.shadow.normalBias=.025;scene.add(light);
 const fill=new THREE.DirectionalLight('#eef5ff',.85);fill.position.set(4,3,-3);scene.add(fill);
 camera=new THREE.PerspectiveCamera(40,1,.1,50);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=7;controls.maxDistance=18;controls.minPolarAngle=.15;controls.maxPolarAngle=1.4;resetView();
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w<600?51:40;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(host);resize();
 renderer.setAnimationLoop(now=>{const dt=Math.min(.05,(now-previous)/1000);previous=now;if(!visible||document.hidden)return;if(playing){progress=Math.min(1,progress+dt*Number($('kitchen-speed').value)/16);if(progress===1)playing=false;refresh();}controls.update();renderer.render(scene,camera);});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();playing=false;failed=true;renderer.setAnimationLoop(null);status.textContent='The 3D kitchen was interrupted. Reload to restore it.';for(const el of [play,slider,select,$('kitchen-reset'),$('kitchen-speed'),...steps.children])el.disabled=true;});
 return true;
}
async function choose(id){
 const next=foods.find(f=>f.id===id);if(!next||!preparations[id])return;
 food=next;select.value=id;$('kitchen-title').textContent=food.name;playing=false;progress=1;
 if(!setup())return;
 const request=++loading;
 try{await loadFoodModels(id);}catch{status.textContent='This dish could not load. Reload to try again.';return;}
 if(request!==loading)return;
 if(dish)dish.dispose();dish=createFoodScene(scene,id);steps.replaceChildren();
 preparations[id].steps.forEach((step,i)=>{const button=document.createElement('button');button.type='button';button.textContent=`${i+1}. ${step.label}`;button.addEventListener('click',()=>{playing=false;progress=(i+.7)/4;refresh();});steps.append(button);});
 refresh();
}
select.addEventListener('change',()=>choose(select.value));
play.addEventListener('click',()=>{if(!dish||failed)return;if(progress>=1)progress=0;playing=!playing;refresh();});
slider.addEventListener('input',()=>{playing=false;progress=Number(slider.value)/1000;refresh();});
$('kitchen-reset').addEventListener('click',()=>{if(!dish)return;playing=false;progress=0;resetView();refresh();});
document.addEventListener('prepare-food',({detail:id})=>{choose(id);$('food-kitchen').scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});select.focus({preventScroll:true});});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!dish&&!failed)choose(food.id);},{rootMargin:'100px'}).observe($('food-kitchen'));
