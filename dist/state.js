import {ITEMS} from './shops.js?v=town2';
export const SAVE_KEY='bone-knight.yips.v1';
export const MAX_HP=25;
export function freshState(){return {version:1,mode:'chapter',area:'town',x:null,y:null,hp:25,stage:'meet',wolves:[],rests:[],visited:['town'],completed:false,emeralds:0,playSeconds:0,checkpoint:null,coins:18,inventory:{},equippedScarf:'teal',fountainGiftReceived:false,burgerDiscussed:false};}
export function canTravel(s){return s.mode==='freeplay'||s.stage==='return'||s.completed;}
export function questText(s,total=8){if(s.mode==='freeplay')return 'Wander the valley. Talk to old friends.';return ({meet:'Find the tavern. Talk to Bram.',board:'Read the notice on the quest board.',ask:'Ask Bram about the witch quest.',forest:`Follow the pines. Clear the road: ${s.wolves.length}/${total} wolves.`,witch:'Enter the shack. Confront the witch.',return:'Return to Bram. Your map can take you home.',done:'Chapter complete. One emerald earned.'})[s.stage]||'Explore Bellwether.';}
export function defeatWolf(s,id,total=8){if(s.mode!=='chapter'||s.completed||!/^wolf[1-8]$/.test(id)||s.wolves.includes(id))return false;s.wolves.push(id);s.coins+=4;if(s.wolves.length>=total)s.stage='witch';return true;}
export function completeQuest(s){if(s.mode!=='chapter'||s.stage!=='return'||s.completed)return false;s.completed=true;s.stage='done';s.emeralds=1;s.hp=MAX_HP;return true;}
export function saveState(s,storage=globalThis.localStorage){try{storage.setItem(SAVE_KEY,JSON.stringify(s));return true;}catch{return false;}}
export function loadState(storage=globalThis.localStorage){
 try{
  const data=JSON.parse(storage.getItem(SAVE_KEY));if(!data||data.version!==1)return null;
  const s={...freshState(),...data};s.hp=Math.max(1,Math.min(MAX_HP,Number(s.hp)||25));
  s.wolves=Array.isArray(s.wolves)?[...new Set(s.wolves.filter(x=>/^wolf[1-8]$/.test(x)))]:[];
  s.visited=Array.isArray(s.visited)?s.visited:['town'];s.rests=Array.isArray(s.rests)?s.rests:[];s.playSeconds=Math.max(0,Number(s.playSeconds)||0);
  s.coins=Number.isFinite(s.coins)?Math.max(0,Math.min(9999,Math.floor(s.coins))):18;
  s.inventory={};for(const [id,count] of Object.entries(data.inventory||{})){if(Object.hasOwn(ITEMS,id)&&Number.isFinite(count)&&count>=1)s.inventory[id]=Math.min(ITEMS[id].scarf?1:99,Math.floor(count));}
  if(!['moss','plum'].includes(s.equippedScarf)||!s.inventory[s.equippedScarf])s.equippedScarf='teal';
  s.fountainGiftReceived=s.fountainGiftReceived===true;s.burgerDiscussed=s.burgerDiscussed===true;
  if(s.completed){s.stage='done';s.emeralds=1;}return s;
 }catch{return null;}
}
