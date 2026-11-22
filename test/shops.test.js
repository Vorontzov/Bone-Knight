import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,loadState,saveState,defeatWolf} from '../dist/state.js';
import {purchase,useItem,claimFountainGift} from '../dist/shops.js';
import {FountainVisit} from '../dist/fountain.js';

test('old chapter saves gain a starter purse without losing progress',()=>{
 const old={version:1,area:'deepwood',x:2960,y:2200,hp:9,stage:'forest',wolves:['wolf1','wolf2'],playSeconds:620};
 let value=JSON.stringify(old);const storage={getItem:()=>value,setItem:(k,v)=>value=v};
 const s=loadState(storage);assert.equal(s.coins,18);assert.equal(s.hp,9);assert.equal(s.area,'deepwood');assert.deepEqual(s.wolves,old.wolves);
 purchase(s,'bram','soup');saveState(s,storage);assert.equal(loadState(storage).coins,13);assert.equal(loadState(storage).inventory.soup,1);
});
test('purchases validate merchant, ownership and funds before charging',()=>{
 const s=freshState();assert.equal(purchase(s,'bram','moss').ok,false);assert.equal(s.coins,18);
 assert.equal(purchase(s,'tailor','moss').ok,true);assert.equal(s.equippedScarf,'moss');assert.equal(s.coins,10);
 assert.equal(purchase(s,'tailor','moss').ok,false);assert.equal(s.coins,10);
 assert.equal(purchase(s,'herbalist','balm').ok,true);assert.equal(s.coins,3);
 assert.equal(purchase(s,'bram','soup').ok,false);assert.equal(s.coins,3);assert.equal(s.inventory.soup,undefined);
});
test('food heals to 25, consumes once, and is preserved at full health',()=>{
 const s=freshState();claimFountainGift(s);assert.equal(useItem(s,'burger').ok,false);assert.equal(s.inventory.burger,1);
 s.hp=20;assert.equal(useItem(s,'burger').ok,true);assert.equal(s.hp,25);assert.equal(s.inventory.burger,undefined);assert.equal(useItem(s,'burger').ok,false);
});
test('fountain gift and wolf coins cannot be collected twice, including after saving',()=>{
 const s=freshState();assert.equal(claimFountainGift(s),true);assert.equal(claimFountainGift(s),false);
 defeatWolf(s,'wolf1');defeatWolf(s,'wolf1');assert.equal(s.coins,22);
 const loaded=loadState({getItem:()=>JSON.stringify(s)});assert.equal(claimFountainGift(loaded),false);assert.equal(loaded.inventory.burger,1);
});
test('fountain stranger visibly approaches once and the player can leave safely',()=>{
 const visit=new FountainVisit(700,850,false);visit.update(.65);assert.equal(visit.phase,'approach');assert.equal(visit.leave(),false);
 visit.update(1.2);assert.equal(visit.stranger.x,574);assert.equal(visit.update(1.2),'greet');assert.equal(visit.update(10),null);
 visit.phase='idle';assert.equal(visit.leave(),true);visit.update(.65);assert.equal(visit.phase,'done');assert.equal(visit.player.y,850);
 const again=new FountainVisit(700,850,true);again.update(.65);assert.equal(again.phase,'idle');assert.equal(again.hasStranger,false);
});
test('corrupt inventory entries cannot become items or equip an unowned scarf',()=>{
 const s=loadState({getItem:()=>JSON.stringify({...freshState(),coins:-2,inventory:{burger:2.8,moss:99,unknown:6,bread:-3},equippedScarf:'plum'})});
 assert.equal(s.coins,0);assert.deepEqual(s.inventory,{burger:2,moss:1});assert.equal(s.equippedScarf,'teal');
});
