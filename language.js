import {translate} from './translations.js';

let language='en';
try{const saved=localStorage.getItem('kopitiam-language');if(['en','zh','ja'].includes(saved))language=saved;}catch{}
const originals=new WeakMap();
const attributes=['aria-label','alt','title'];
// Keep each English source so switching languages never translates a translation.
function update(node,key,value,write){
 const values=originals.get(node)||{};
 const previous=values[key];
 const source=previous&&value===previous.rendered?previous.source:value;
 const rendered=translate(source,language);
 values[key]={source,rendered};originals.set(node,values);
 if(value!==rendered)write(rendered);
}
function localize(root){
 if(root.nodeType===Node.TEXT_NODE){
  if(root.parentElement?.closest('script,style,[data-language]'))return;
  update(root,'text',root.nodeValue,value=>root.nodeValue=value);
 }else if(root.nodeType===Node.ELEMENT_NODE){
  if(root.matches('script,style,[data-language]'))return;
  for(const key of attributes)if(root.hasAttribute(key))update(root,key,root.getAttribute(key),value=>root.setAttribute(key,value));
  for(const node of root.childNodes)localize(node);
 }
}
// Only visit changed content, including menu rebuilds and animation status updates.
const observer=new MutationObserver(records=>{
 observer.disconnect();
 for(const root of new Set(records.map(record=>record.target)))localize(root);
 observe();
});
function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});}
function setLanguage(next){
 if(!['en','zh','ja'].includes(next))return;
 language=next;observer.disconnect();
 document.documentElement.lang=language==='zh'?'zh-CN':language;
 localize(document.body);localize(document.querySelector('title'));
 const description=document.querySelector('meta[name="description"]');
 update(description,'content',description.content,value=>description.content=value);
 document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
 try{localStorage.setItem('kopitiam-language',language);}catch{}
 observe();
}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
setLanguage(language);
