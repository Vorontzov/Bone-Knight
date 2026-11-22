// Shared by the shop UI, inventory and save migration. Prices are in copper coins.
export const ITEMS = {
  burger: {name:'Fountain burger', heal:12, description:'Warm, dry, and wrapped in a suspiciously neat napkin.'},
  bread: {name:'Crusty bread', heal:6, description:'Bram saved you the good end.'},
  soup: {name:'Pocket soup', heal:10, description:'A tightly stoppered little flask. Mostly soup.'},
  apple: {name:'Red apple', heal:3, description:'A small, dependable crunch.'},
  tea: {name:'Mint tea', heal:8, description:'A warm flask that smells like a quiet afternoon.'},
  balm: {name:'Pine balm', heal:14, description:'For rattling joints and heroic scrapes.'},
  moss: {name:'Moss scarf', scarf:'moss', description:'A soft green scarf, knitted for small shoulders.'},
  plum: {name:'Plum scarf', scarf:'plum', description:'A purple scarf with a very important fringe.'},
};
export const SHOPS = {
  bram: {name:'Bram’s pantry', speaker:'Bram', sprite:'keeper', subtitle:'A little something for the road.', stock:[{id:'bread',price:3},{id:'soup',price:5},{id:'apple',price:2}]},
  herbalist: {name:'Moss & Mallow', speaker:'Mallow', sprite:'herbalist', subtitle:'Kind remedies from the edge of the forest.', stock:[{id:'tea',price:4},{id:'balm',price:7}]},
  tailor: {name:'Button & Thread', speaker:'Tilda', sprite:'tailor', subtitle:'Even little knights deserve a good scarf.', stock:[{id:'moss',price:8},{id:'plum',price:8}]},
};
export function purchase(s,shopId,itemId){
  const offer=SHOPS[shopId]?.stock.find(i=>i.id===itemId),item=ITEMS[itemId];
  if(!offer||!item)return {ok:false,message:'That item is not for sale here.'};
  const count=s.inventory[itemId]||0;
  if(item.scarf&&count)return {ok:false,message:'You already own this scarf.'};
  if(count>=99)return {ok:false,message:'Your pack has enough of those.'};
  if(s.coins<offer.price)return {ok:false,message:'Not enough coins.'};
  s.coins-=offer.price;s.inventory[itemId]=count+1;
  if(item.scarf)s.equippedScarf=item.scarf;
  return {ok:true,message:item.scarf?`${item.name} equipped. Looking sharp, Yips.`:`${item.name} tucked into your pack.`};
}
export function useItem(s,id){
  const item=ITEMS[id];if(!item||!s.inventory[id])return {ok:false,message:'Your pack is empty of that.'};
  if(item.scarf){s.equippedScarf=item.scarf;return {ok:true,message:`${item.name} equipped.`};}
  if(s.hp>=25)return {ok:false,message:'All 25 HP. Save it for the road.'};
  const restored=Math.min(item.heal,25-s.hp);s.hp+=restored;
  if(--s.inventory[id]===0)delete s.inventory[id];
  return {ok:true,message:`${item.name}: restored ${restored} HP.`};
}
export function claimFountainGift(s){
  if(s.fountainGiftReceived)return false;
  s.fountainGiftReceived=true;s.inventory.burger=(s.inventory.burger||0)+1;return true;
}
