import * as THREE from 'three';
import {glassHandleGeometry} from './handles.js';
import {createStirring,stirBlend} from './stirring.js';
import {createPourRig,pourFill} from './pouring.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {recipes,ingredients,categories,stagesFor,fillAt,liquidTotal} from './recipes.js';
const $=s=>document.querySelector(s),host=$('#scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const phone=matchMedia('(max-width:650px)');
$('#recipe-details').open=!phone.matches;
phone.addEventListener('change',()=>$('#recipe-details').open=!phone.matches);
const state={recipe:recipes[0],progress:1,playing:false,speed:1,mixed:false,mix:0,filter:'all',category:'kopi',step:'',stirTime:-1};
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(e){$('#loading').textContent='The 3D glass needs WebGL. Enable hardware acceleration or try another browser.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;host.append(renderer.domElement);$('#loading').remove();renderer.domElement.setAttribute('aria-label','Interactive glass showing the ingredients of the selected drink. Drag to rotate.');
let drinkVisible=true;new IntersectionObserver(entries=>{drinkVisible=entries[0].isIntersecting;},{rootMargin:'150px'}).observe(host);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,70),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=6;controls.maxDistance=13;controls.minPolarAngle=.45;controls.maxPolarAngle=1.55;
function resetCamera(){camera.position.set(4.1,4.6,7.8);controls.target.set(0,1.9,0);controls.update();}resetCamera();
scene.add(new THREE.HemisphereLight(0xfff8e6,0xac8060,3.5));const key=new THREE.DirectionalLight(0xfff7e7,3);key.position.set(-3,7,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-5,right:5,top:6,bottom:-4,near:.1,far:25});key.shadow.normalBias=.03;scene.add(key);const rim=new THREE.DirectionalLight(0xffffff,2.5);rim.position.set(4,4,-3);scene.add(rim);
const root=new THREE.Group();scene.add(root);
const ceramic=new THREE.MeshStandardMaterial({color:0xfaf4e8,roughness:.38,metalness:.05}),glass=new THREE.MeshPhysicalMaterial({color:0xd8f2eb,roughness:.12,metalness:.1,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false}),glassEdge=new THREE.MeshStandardMaterial({color:0xddece4,roughness:.15,metalness:.35,transparent:true,opacity:.65,depthWrite:false});
function mesh(g,mat,x=0,y=0,z=0,parent=root){const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);parent.add(m);return m;}
function cylinder(rt,rb,h,mat,x=0,y=0,z=0,parent=root){return mesh(new THREE.CylinderGeometry(rt,rb,h,64),mat,x,y,z,parent);}
function torus(r,t,mat,x,y,z,parent=root){const m=mesh(new THREE.TorusGeometry(r,t,12,80),mat,x,y,z,parent);m.rotation.x=Math.PI/2;return m;}
const saucer=cylinder(1.58,1.38,.13,ceramic,0,.04,0);saucer.receiveShadow=true;torus(1.47,.042,ceramic,0,.10,0);torus(1.31,.017,new THREE.MeshStandardMaterial({color:0xa35d3b,roughness:.4}),0,.115,0);cylinder(1.13,1.1,.08,ceramic,0,.13,0);
const profile=[[0,.19],[.98,.19],[1.05,.26],[1.05,3.15],[1.01,3.19],[.98,3.15],[.98,.34],[0,.34]].map(p=>new THREE.Vector2(...p));const cup=mesh(new THREE.LatheGeometry(profile,96),glass);cup.renderOrder=10;
torus(1.025,.037,glassEdge,0,3.16,0).renderOrder=11;torus(1.005,.045,glassEdge,0,.29,0).renderOrder=11;
// Keep the entire handle outside the inner glass wall, including its mounts.
const handle=mesh(glassHandleGeometry(),glassEdge);handle.name='glass-handle';handle.renderOrder=11;
// Thin vertical highlights keep the clear glass legible without obscuring its contents.
for(const angle of [-.8,1.9]){const path=new THREE.LineCurve3(new THREE.Vector3(Math.cos(angle)*1.05,.42,Math.sin(angle)*1.05),new THREE.Vector3(Math.cos(angle)*1.05,3.01,Math.sin(angle)*1.05));const h=mesh(new THREE.TubeGeometry(path,1,.014,6,false),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.6,depthWrite:false}));h.renderOrder=12;}
const liquidKeys=['powder','condensed','evaporated','coffee','tea','water'];const liquids={};
for(const k of liquidKeys){const mat=new THREE.MeshStandardMaterial({color:ingredients[k].color,roughness:.4,metalness:0});liquids[k]=cylinder(.962,.962,1,mat);liquids[k].castShadow=false;}
const blended=cylinder(.963,.963,1,new THREE.MeshStandardMaterial({color:0x8d5834,roughness:.28}));blended.visible=false;
const iceGroup=new THREE.Group();root.add(iceGroup);const iceMat=new THREE.MeshPhysicalMaterial({color:0xd6eff4,roughness:.17,metalness:.12,transparent:true,opacity:.8,depthWrite:false});const ice=[];for(let i=0;i<6;i++){const m=mesh(new THREE.BoxGeometry(.37,.34,.38),iceMat,0,0,0,iceGroup);m.rotation.set(i*.4,.3+i*.8,.2+i*.3);m.renderOrder=5;ice.push(m);}
const sugar=[];for(let i=0;i<8;i++){const m=mesh(new THREE.BoxGeometry(.14,.14,.14),new THREE.MeshStandardMaterial({color:0xfff8df,roughness:1}),0,0,0);sugar.push(m);}
const pourRig=createPourRig(root);
const stirRig=createStirring(root);
const metal=new THREE.MeshStandardMaterial({color:0xb6b9b1,roughness:.3,metalness:.8});
const spoon=new THREE.Group();root.add(spoon);const bowl=mesh(new THREE.SphereGeometry(.16,20,12),metal,0,4.0,0,spoon);bowl.scale.set(1.4,.3,1);const spoonHandle=mesh(new THREE.BoxGeometry(.65,.035,.065),metal,-.42,4.03,0,spoon);spoon.visible=false;
const falling=[];for(let i=0;i<9;i++)falling.push(mesh(new THREE.BoxGeometry(.07,.07,.07),new THREE.MeshStandardMaterial({color:0xfbf2db}),0,0,0));
// Dry Dinosaur crown: a shallow irregular mound, separate from the stirred liquid.
const toppingGeometry=new THREE.SphereGeometry(1,48,24,0,Math.PI*2,0,Math.PI/2);
const tp=toppingGeometry.attributes.position;for(let i=0;i<tp.count;i++){const x=tp.getX(i),z=tp.getZ(i);tp.setY(i,tp.getY(i)*(1+.06*Math.sin(x*27)*Math.cos(z*23)));}toppingGeometry.computeVertexNormals();
const topping=mesh(toppingGeometry,new THREE.MeshStandardMaterial({color:0x6b3d23,roughness:1}));
const steam=[];for(let i=0;i<3;i++){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(24*3),3));const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.4,depthWrite:false}));root.add(line);steam.push(line);}
const shadow=mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.1}),0,-.04,0,scene);shadow.rotation.x=-Math.PI/2;shadow.receiveShadow=true;
let width=1,height=1;function resize(){width=host.clientWidth;height=host.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
function renderMenu(){const list=$('#menu-list');list.replaceChildren();recipes.forEach((r,i)=>{if(r.category!==state.category||(state.filter!=='all'&&r.family!==state.filter))return;const b=document.createElement('button');b.className='drink-option'+(r.id===state.recipe.id?' active':'');b.setAttribute('aria-pressed',String(r.id===state.recipe.id));b.innerHTML=`<span class="number">${String(recipes.filter(x=>x.category===r.category).indexOf(r)+1).padStart(2,'0')}</span><span><strong>${r.name}</strong><small>${r.family==='iced'?'Over ice':r.amounts.condensed?'Condensed milk':r.amounts.evaporated?'Evaporated milk':'No extra milk'}</small></span><span class="dot"></span>`;b.addEventListener('click',()=>selectRecipe(r));list.append(b);});}
function setView(mixed){state.mixed=mixed;state.stirTime=mixed&&!reduced.matches?0:-1;state.mix=mixed&&reduced.matches?1:0;if(mixed){state.playing=false;updateUI();}$('#mixed').classList.toggle('active',mixed);$('#layers').classList.toggle('active',!mixed);$('#mixed').setAttribute('aria-pressed',String(mixed));$('#layers').setAttribute('aria-pressed',String(!mixed));$('#view-note').textContent=mixed?'Blended colour is illustrative':'Separated layers for illustration';}
function selectRecipe(r){state.recipe=r;state.stirTime=-1;state.mix=0;state.mixed=false;setView(false);state.progress=1;state.playing=false;state.step='';$('#glass-name').textContent=r.name;$('#glass-number').textContent=String(recipes.filter(x=>x.category===r.category).indexOf(r)+1).padStart(2,'0');$('#glass-desc').textContent=r.desc;$('#recipe-title').textContent=r.name;$('#recipe-desc').textContent=r.desc;$('#temperature').textContent=r.amounts.ice?'ICED / 冰':'HOT / 热';$('#recipe-note').textContent=r.note;const list=$('#ingredient-list');list.replaceChildren();for(const k of stagesFor(r)){const row=document.createElement('div');row.className='ingredient';row.innerHTML=`<span class="swatch" style="background:${ingredients[k].color}"></span><span>${ingredients[k].name}</span><span class="amount">${r.amounts[k]} ${ingredients[k].unit}</span>`;list.append(row);}const stepList=$('#step-list');stepList.replaceChildren();const stages=stagesFor(r);stages.forEach((k,i)=>{const b=document.createElement('button');b.textContent=`${i+1}. ${ingredients[k].name}`;b.addEventListener('click',()=>{setView(false);state.playing=false;state.progress=(i+.55)/stages.length;updateUI();});stepList.append(b);});renderMenu();updateUI();}
function updateUI(){const stages=stagesFor(state.recipe),i=Math.min(stages.length-1,Math.floor(state.progress*stages.length));const text=state.progress>=1?'Ingredients added · select Stirred to mix':`Step ${i+1}/${stages.length} · ${ingredients[stages[i]].verb}`;if(text!==state.step){$('#step-status').textContent=text;state.step=text;}$('#progress').value=Math.round(state.progress*1000);$('#progress-text').textContent=Math.round(state.progress*100)+'%';$('#play').textContent=state.playing?'Ⅱ':'▶';$('#play').setAttribute('aria-label',state.playing?'Pause preparation':state.progress>=1?'Replay preparation':'Continue preparation');$('#step-list').querySelectorAll('button').forEach((b,j)=>b.classList.toggle('current',j===i&&state.progress<1));}
function start(){if(phone.matches){$('#recipe-details').open=false;$('.stage').scrollIntoView({block:'start',behavior:'instant'});}state.progress=0;state.playing=true;state.step='';setView(false);updateUI();}
$('#make').addEventListener('click',start);$('#play').addEventListener('click',()=>{if(state.progress>=1)start();else {if(state.mixed)setView(false);state.playing=!state.playing;updateUI();}});$('#progress').addEventListener('input',e=>{setView(false);state.playing=false;state.progress=Number(e.target.value)/1000;updateUI();});$('#speed').addEventListener('change',e=>state.speed=Number(e.target.value));$('#layers').addEventListener('click',()=>setView(false));$('#mixed').addEventListener('click',()=>setView(true));$('#reset-camera').addEventListener('click',resetCamera);document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderMenu();}));
function selectCategory(category){
 if(!categories[category])return;
 state.category=category;state.filter='all';
 const info=categories[category];document.documentElement.style.setProperty('--red',info.accent);
 $('#category-title').textContent=info.name;$('#category-description').textContent=info.desc;
 $('#style-count').textContent=recipes.filter(r=>r.category===category).length+' styles';
 $('#make').textContent='Make this '+info.name.toLowerCase();
 const referenceImage=$('#reference-image');referenceImage.hidden=!info.reference;if(info.reference){referenceImage.src=info.reference;referenceImage.alt='Your supplied '+info.name+' ordering guide';}else{referenceImage.removeAttribute('src');referenceImage.alt='';}
 document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter==='all');b.setAttribute('aria-pressed',String(b.dataset.filter==='all'));});
 selectRecipe(recipes.find(r=>r.category===category));
}
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>selectCategory(b.dataset.category)));
selectCategory('kopi');
const baseColors=Object.fromEntries(liquidKeys.map(k=>[k,new THREE.Color(ingredients[k].color)]));const miloColor=new THREE.Color('#472719'),milkColor=new THREE.Color('#c39667'),waterBlend=new THREE.Color('#8d5939'),mixColor=new THREE.Color();let previous=performance.now();
function frame(now){const dt=Math.min((now-previous)/1000,.05);previous=now;if(!drinkVisible||document.hidden)return;const t=now/1000,r=state.recipe,stages=stagesFor(r),n=stages.length;
 if(state.playing){state.progress=Math.min(1,state.progress+dt*state.speed/(n*1.7));if(state.progress===1)state.playing=false;updateUI();}
 if(state.stirTime>=0){state.stirTime+=dt;state.mix=stirBlend(state.stirTime);$('#view-note').textContent=state.stirTime<1.1?'Stirring the ingredients…':state.stirTime<3.6?'Swirling and blending…':'Blended colour is illustrative';if(state.stirTime>=4.1)state.stirTime=-1;}
 const fractions=Object.fromEntries(Object.keys(ingredients).map(k=>[k,r.amounts[k]>0?fillAt(state.progress,stages.indexOf(k),n):0]));
 const amounts=Object.fromEntries(liquidKeys.map(k=>[k,r.amounts[k]*(k==='powder'?.55*fractions[k]:pourFill(fractions[k]))]));const volume=Object.values(amounts).reduce((a,b)=>a+b,0),iceDisplace=r.amounts.ice*7*fractions.ice;
 const milk=amounts.condensed+amounts.evaporated;
 miloColor.set(r.category==='kopi'?'#3f2114':r.category==='teh'?'#79310c':'#472719');waterBlend.set(r.category==='kopi'?'#714123':r.category==='teh'?'#c07722':'#8d5939');milkColor.set(r.category==='teh'?'#e7b86d':'#c39667');mixColor.copy(miloColor).lerp(waterBlend,volume?(r.category==='milo'?Math.min(.72,amounts.water/Math.max(1,amounts.powder)*.045):amounts.water/volume*.65):0).lerp(milkColor,volume?Math.min(.85,milk/volume*4.2):0);
 let y=.35;for(const k of liquidKeys){const h=amounts[k]*.0108*(volume?1+iceDisplace/volume:1),m=liquids[k];m.visible=h>.001&&state.mix<.995;m.scale.y=Math.max(.001,h);m.position.y=y+h/2;m.material.color.copy(baseColors[k]).lerp(mixColor,state.mix);y+=h;}
 topping.visible=fractions.topping>0;topping.scale.set(.89,.28*fractions.topping,.89);topping.position.y=y+.035;
 const swirlColors=liquidKeys.filter(k=>amounts[k]>0).map(k=>ingredients[k].color);stirRig.update(state.stirTime,y,swirlColors.length?swirlColors:['#75472c']);
 blended.visible=volume>0&&state.mix>=.995;blended.scale.y=Math.max(.001,y-.35);blended.position.y=(y+.35)/2;blended.material.color.copy(mixColor);
 for(let i=0;i<ice.length;i++){const q=THREE.MathUtils.clamp(fractions.ice*6-i,0,1);ice[i].visible=q>0;const a=i*2.399;ice[i].position.set(Math.cos(a)*(.35+i*.05),y-.09+(1-q)*2.3+(!reduced.matches&&state.progress===1?Math.sin(t*1.3+i)*.025:0),Math.sin(a)*(.35+i*.05));ice[i].scale.setScalar(Math.min(1,q*4));}
 for(let i=0;i<sugar.length;i++){const q=Math.min(1,r.amounts.sugar/2-i);sugar[i].visible=q>0&&fractions.sugar>0;const dissolve=1-Math.min(1,(fractions.coffee+fractions.tea+fractions.water)*.95+state.mix);sugar[i].scale.setScalar(Math.max(.001,dissolve*Math.min(1,fractions.sugar*4)));sugar[i].position.set(Math.cos(i*2.4)*.55,.43,Math.sin(i*2.4)*.55);}
 const activeIndex=Math.min(n-1,Math.floor(state.progress*n)),active=stages[activeIndex],f=fractions[active],pouring=state.progress>0&&state.progress<1&&f>.02&&f<.98;
 pourRig.update(active,state.progress<1?f:1,y);pourRig.rig.visible=pourRig.rig.visible&&!state.mixed;spoon.visible=pouring&&['sugar','powder','topping'].includes(active)&&!state.mixed;
 for(let i=0;i<falling.length;i++){falling[i].visible=spoon.visible;falling[i].material.color.set(active==='sugar'?0xfff8df:0x75472c);falling[i].scale.setScalar(active==='sugar'?1:.65);const phase=(f*5+i*.117)%1;falling[i].position.set(Math.sin(i*3)*.24,4-phase*(4-(active==='topping'?y:.42)),Math.cos(i*3)*.24);}
 for(let i=0;i<steam.length;i++){steam[i].visible=!r.amounts.ice&&state.progress>=1&&!reduced.matches;const a=steam[i].geometry.attributes.position;for(let j=0;j<24;j++){const v=j/23;a.setXYZ(j,(i-1)*.4+Math.sin(v*6+t*1.1+i)*.06,y+.08+v*.65,Math.cos(v*5+t+i)*.06);}a.needsUpdate=true;}
 controls.update();renderer.render(scene,camera);
}
renderer.setAnimationLoop(frame);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);const p=document.createElement('p');p.id='loading';p.textContent='The 3D display was interrupted. Reload to restore your glass.';host.append(p);});

// Optional structured access to the same drink-selection action as the menu.
if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();
 addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 try{Promise.resolve(document.modelContext.registerTool({
  name:'select_drink',title:'Choose a kopitiam drink',
  description:'Select a Kopi, Teh or Milo recipe and show its ingredients in the glass. Does not start pouring.',
  inputSchema:{type:'object',properties:{recipeId:{type:'string',enum:recipes.map(r=>r.id)}},required:['recipeId'],additionalProperties:false},
  annotations:{readOnlyHint:false,untrustedContentHint:false},
  execute(input){if(!input||typeof input.recipeId!=='string'||Object.keys(input).some(k=>k!=='recipeId'))throw new Error('Provide a valid recipeId only.');const r=recipes.find(x=>x.id===input.recipeId);if(!r)throw new Error('Unknown recipe.');selectCategory(r.category);selectRecipe(r);return {id:r.id,name:r.name,category:r.category,ingredients:stagesFor(r).map(k=>({name:ingredients[k].name,amount:r.amounts[k],unit:ingredients[k].unit}))};}
 },{signal:lifecycle.signal})).catch(()=>{});}catch{}
}
