import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {createBreakfastScene,breakfastStages} from './breakfast-scene.js';
const host=document.querySelector('#breakfast-scene');
function setup(){
 const phone=matchMedia('(max-width:650px)'),details=document.querySelector('#meal-details');
 details.open=!phone.matches;
 phone.addEventListener('change',()=>details.open=!phone.matches);
 const play=document.querySelector('#meal-play'),slider=document.querySelector('#meal-progress'),status=document.querySelector('#meal-status'),speed=document.querySelector('#meal-speed'),steps=[...document.querySelectorAll('[data-meal-step]')];
 let renderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{host.querySelector('.meal-loading').textContent='The animated meal needs WebGL. You can still view the meal reference and recipe notes below.';[play,slider,speed,...steps,document.querySelector('#meal-reset')].forEach(el=>el.disabled=true);return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;host.replaceChildren(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive Nanyang breakfast: kaya toast, soft-boiled eggs, soya sauce and pepper. Drag to rotate.');
 const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xfff9e8,0x8c785d,3));const light=new THREE.DirectionalLight(0xfff3da,3);light.position.set(-4,8,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-6,right:6,top:6,bottom:-6});light.shadow.normalBias=.03;scene.add(light);const fill=new THREE.DirectionalLight(0xffffff,1.5);fill.position.set(4,4,-3);scene.add(fill);
 const camera=new THREE.PerspectiveCamera(39,1,.1,60),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=8;controls.maxDistance=20;controls.minPolarAngle=.25;controls.maxPolarAngle=1.3;
 function resetCamera(){camera.position.set(4.7,7.2,10.4);controls.target.set(0,.7,0);controls.update();}resetCamera();
 const meal=createBreakfastScene(scene);let progress=1,playing=false,rate=1,visible=true,previous=performance.now(),lastLabel='';
 function refresh(){const s=meal.update(progress);slider.value=Math.round(progress*1000);const label=s.ready?'Your Nanyang breakfast is ready':`Step ${s.stage+1}/4 · ${breakfastStages[s.stage]}`;if(label!==lastLabel){status.textContent=label;lastLabel=label;}play.textContent=playing?'Pause breakfast':progress>=1?'Make this breakfast':'Continue breakfast';play.setAttribute('aria-pressed',String(playing));steps.forEach((b,i)=>b.setAttribute('aria-pressed',String(!s.ready&&s.stage===i)));document.querySelector('#meal-percent').textContent=Math.round(progress*100)+'%';}
 play.addEventListener('click',()=>{if(progress>=1)progress=0;playing=!playing;if(playing&&phone.matches){details.open=false;document.querySelector('.meal-visual').scrollIntoView({block:'start',behavior:'instant'});}refresh();});slider.addEventListener('input',()=>{playing=false;progress=Number(slider.value)/1000;refresh();});speed.addEventListener('change',()=>rate=Number(speed.value));steps.forEach((b,i)=>b.addEventListener('click',()=>{playing=false;progress=(i+.58)/4;refresh();}));document.querySelector('#meal-reset').addEventListener('click',()=>{playing=false;progress=0;resetCamera();refresh();});
 document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{meal.setDrink(b.dataset.category);document.querySelector('#meal-pairing').textContent='Paired with '+b.dataset.category.charAt(0).toUpperCase()+b.dataset.category.slice(1);}));
 // Keep CSS pixels independent of the high-DPI drawing buffer. An intrinsic
 // canvas width inside a grid can otherwise enlarge its own ResizeObserver host.
 function resizeMeal(){const w=host.clientWidth,h=host.clientHeight;if(w<=0||h<=0)return;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w<600?53:39;camera.updateProjectionMatrix();}
 resizeMeal();new ResizeObserver(resizeMeal).observe(host);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'150px'}).observe(host);
 refresh();renderer.setAnimationLoop(now=>{const dt=Math.min(.05,(now-previous)/1000);previous=now;if(!visible||document.hidden)return;if(playing){progress=Math.min(1,progress+dt*rate/12);if(progress===1)playing=false;refresh();}controls.update();renderer.render(scene,camera);});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();playing=false;renderer.setAnimationLoop(null);status.textContent='The 3D display was interrupted. Reload to restore the breakfast scene.';});
}
setup();
