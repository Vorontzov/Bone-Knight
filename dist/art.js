// Bone Knight's original pixel artwork. All coordinates snap to an integer grid.
// pixelText uses a TOP edge, not a baseline; one glyph occupies 6 * size pixels.
export const PALETTE = Object.freeze({ink:'#101c25',night:'#10232e',deep:'#132e33',pine:'#244a43',leaf:'#42634e',light:'#779174',gold:'#d3b775',cream:'#f1e3bb',steel:'#8eabb0',purple:'#795b92',wood:'#654c39',stone:'#647778'});
const FONT={
 A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],D:['11110','10001','10001','10001','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],G:['01111','10000','10000','10111','10001','10001','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['11111','00100','00100','00100','00100','00100','11111'],J:['00111','00010','00010','00010','10010','10010','01100'],K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','11001','10101','10011','10011','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],Q:['01110','10001','10001','10001','10101','10010','01101'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['10001','10001','10001','10001','10001','10001','01110'],V:['10001','10001','10001','10001','10001','01010','00100'],W:['10001','10001','10001','10101','10101','10101','01010'],X:['10001','10001','01010','00100','01010','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],Z:['11111','00001','00010','00100','01000','10000','11111'],
 '0':['01110','10001','10011','10101','11001','10001','01110'],'1':['00100','01100','00100','00100','00100','00100','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],'3':['11110','00001','00001','01110','00001','00001','11110'],'4':['00010','00110','01010','10010','11111','00010','00010'],'5':['11111','10000','10000','11110','00001','00001','11110'],'6':['01110','10000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00001','01110'],
 '.':['0','0','0','0','0','1','1'],',':['0','0','0','0','1','1','1'],':':['0','1','1','0','1','1','0'],'!':['1','1','1','1','1','0','1'],'?':['01110','10001','00001','00010','00100','00000','00100'],'-':['00000','00000','00000','11111','00000','00000','00000'],'/':['00001','00001','00010','00100','01000','10000','10000'],"'":['1','1','0','0','0','0','0'],'+':['00000','00100','00100','11111','00100','00100','00000'],'(':['001','010','100','100','100','010','001'],')':['100','010','001','001','001','010','100'],'&':['01100','10010','10100','01000','10101','10010','01101'],'=':['00000','00000','11111','00000','11111','00000','00000'],'<':['00010','00100','01000','10000','01000','00100','00010'],'>':['01000','00100','00010','00001','00010','00100','01000']
};
export function pixelText(ctx,text,x,y,size=3,color=PALETTE.cream,align='left'){
 const lines=String(text).toUpperCase().split('\n');ctx.fillStyle=color;
 for(let l=0;l<lines.length;l++){const line=lines[l];let sx=Math.round(x-(align==='center'?line.length*6*size/2:align==='right'?line.length*6*size:0));
  for(const ch of line){const glyph=FONT[ch];if(glyph)for(let gy=0;gy<glyph.length;gy++)for(let gx=0;gx<glyph[gy].length;gx++)if(glyph[gy][gx]==='1')ctx.fillRect(sx+gx*size,Math.round(y)+l*9*size+gy*size,size,size);sx+=6*size;}
 }
}
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function poly(c,points,col){c.fillStyle=col;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill();}
function rng(seed){let z=(seed|0)+937;return()=>{z=(Math.imul(z,1664525)+1013904223)|0;return(z>>>0)/4294967296;};}
function shade(c,x,y,w=26){rect(c,x-w/2,y-3,w,4,'#101f24');rect(c,x-w/2+4,y+1,w-8,2,'#152b2c');}

export function drawSprite(ctx,type,x,y,{scale=1,time=0,walking=false,facing='down',variant=0,scarf='teal'}={}){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);ctx.imageSmoothingEnabled=false;
 const c=ctx,bob=walking?Math.round(Math.sin(time*13))*2:0,step=walking?Math.round(Math.sin(time*13))*2:0;
 if(type==='bone'){
  rect(c,-12,-8,24,16,'#11212a');rect(c,-12,-6,6,6,'#f7efcf');rect(c,-12,1,6,6,'#f7efcf');rect(c,6,-6,6,6,'#f7efcf');rect(c,6,1,6,6,'#f7efcf');rect(c,-8,-3,16,7,'#f7efcf');rect(c,-6,2,12,2,'#cbbc94');ctx.restore();return;
 }
 shade(c,0,0,type==='keeper'?40:type==='wolf'?46:28);ctx.translate(0,bob);
 if(type==='yips'){
  // Boots, bones and a ribbed breastplate, with the helmet slightly too large.
  rect(c,-10,-5+step,8,5,'#17282f');rect(c,3,-5-step,9,5,'#17282f');
  rect(c,-8,-12+step,4,8,'#e1d8bc');rect(c,4,-12-step,4,8,'#e1d8bc');rect(c,-8,-7+step,5,3,'#f2e7c9');rect(c,3,-7-step,5,3,'#f2e7c9');
  rect(c,-9,-24,18,15,'#172832');rect(c,-7,-23,14,11,'#819c9d');rect(c,-6,-22,10,2,'#c0d1c6');rect(c,-6,-18,12,2,'#d7ddc5');rect(c,-6,-14,12,2,'#c7c9b0');rect(c,-1,-23,3,12,'#d8dcc3');
  rect(c,-12,-24,4,13,'#e3dac0');rect(c,-13,-16,5,5,'#ede3c3');rect(c,9,-24,4,13,'#ede3c3');
  rect(c,13,-28,4,27,'#18343c');rect(c,13,-29,2,22,'#d0e1d8');rect(c,15,-27,2,19,'#839ca1');rect(c,10,-8,10,3,'#d6b976');rect(c,14,-5,3,8,'#67483a');rect(c,13,2,5,2,'#b4935a');
  rect(c,-11,-38,22,15,'#14242d');rect(c,-9,-37,18,13,'#ece1c1');rect(c,-10,-35,20,5,'#eee7ce');
  if(facing!=='up'){rect(c,facing==='left'?-8:-6,-32,4,5,'#182b32');rect(c,facing==='right'?5:3,-32,4,5,'#182b32');rect(c,-1,-28,2,3,'#786e60');rect(c,-5,-25,10,2,'#655d53');rect(c,-3,-26,2,3,'#f4e9ce');rect(c,1,-26,2,3,'#f4e9ce');}
  rect(c,-13,-43,26,11,'#1c303a');rect(c,-10,-46,20,14,'#748d98');rect(c,-6,-48,12,4,'#9bb0b3');rect(c,-9,-44,14,3,'#b6c7c2');rect(c,-12,-35,24,3,'#526d7c');rect(c,-13,-34,26,3,'#a2b4b0');rect(c,-1,-46,3,13,'#d3d5b8');rect(c,-10,-33,3,7,'#708996');rect(c,8,-33,3,7,'#627d8a');
  const colors=scarf==='moss'?['#596d36','#acc77b','#6a8146','#849b54']:scarf==='plum'?['#71517b','#c49cbe','#87608c','#a475a5']:['#26706b','#63aaa0','#2e7772','#418d80'];
  rect(c,-10,-25,20,5,colors[0]);rect(c,-8,-25,13,2,colors[1]);rect(c,-13,-22,5,11,colors[2]);rect(c,-16,-14,6,3,colors[3]);
 }else if(type==='stranger'){
  rect(c,-10,-5+step,8,5,'#18272d');rect(c,3,-5-step,8,5,'#18272d');
  poly(c,[[-16,-4],[-10,-37],[9,-37],[17,-3],[8,-1],[1,-5],[-6,-1]],'#182831');
  poly(c,[[-12,-5],[-7,-33],[8,-33],[12,-6],[4,-9],[-3,-5]],'#34404b');rect(c,-3,-31,4,26,'#4b4a54');
  poly(c,[[-15,-33],[-13,-46],[-6,-54],[4,-56],[13,-47],[16,-32]],'#25353f');
  poly(c,[[-11,-35],[-9,-44],[-3,-49],[5,-47],[10,-36]],'#101c25');
  rect(c,-6,-40,3,2,'#dfc58a');rect(c,3,-40,3,2,'#dfc58a');rect(c,-12,-31,22,3,'#5c575b');
  rect(c,-14,-20,5,6,'#a2957a');rect(c,12,-20,5,6,'#a2957a');rect(c,6,-28,3,3,'#ba9b64');
 }else if(type==='herbalist'||type==='tailor'){
  const herbal=type==='herbalist',coat=herbal?'#557d60':'#765975',light=herbal?'#92b183':'#bd8faa';
  rect(c,-10,-5,8,5,'#293131');rect(c,3,-5,8,5,'#293131');rect(c,-12,-31,25,26,coat);rect(c,-8,-27,17,22,light);
  rect(c,-14,-30,5,17,'#b99471');rect(c,10,-30,5,17,'#b99471');rect(c,-7,-23,15,3,'#d4c59b');rect(c,-5,-18,10,9,coat);
  rect(c,-10,-47,21,20,herbal?'#716451':'#c4b8a0');rect(c,-8,-44,17,15,'#d6ac83');rect(c,-4,-38,3,3,'#24343b');rect(c,4,-38,3,3,'#24343b');rect(c,-2,-32,6,2,'#976a56');
  if(herbal){rect(c,-13,-48,27,6,'#4e6a4c');rect(c,-10,-53,20,8,'#759365');rect(c,3,-53,4,3,'#c9b96b');rect(c,-12,-42,5,18,'#716451');}
  else{rect(c,-12,-48,25,6,'#cec4ac');rect(c,8,-52,8,9,'#c4b8a0');rect(c,-6,-39,7,6,'#5d565c');rect(c,2,-39,7,6,'#5d565c');rect(c,-5,-38,5,3,'#d4bb9e');rect(c,3,-38,5,3,'#d4bb9e');rect(c,-1,-38,3,1,'#5d565c');rect(c,-10,-26,3,15,'#e2c17e');}
 }else if(type==='keeper'){
  rect(c,-14,-5,11,5,'#252928');rect(c,5,-5,12,5,'#252928');rect(c,-12,-18,24,14,'#3d4541');rect(c,-16,-42,34,27,'#323a39');rect(c,-17,-41,7,23,'#b87f53');rect(c,12,-41,8,23,'#bd8458');rect(c,-19,-37,8,13,'#d49c68');rect(c,15,-37,8,13,'#d49c68');rect(c,-12,-42,24,28,'#8e6c44');rect(c,-8,-38,16,24,'#b28b58');rect(c,-10,-20,20,3,'#d1ac71');rect(c,-7,-33,15,2,'#c19a63');rect(c,-17,-18,6,5,'#dfab76');rect(c,16,-19,6,5,'#dca776');
  rect(c,-11,-61,24,25,'#302d2a');rect(c,-8,-58,18,15,'#d69e6c');rect(c,-10,-59,22,5,'#54402e');rect(c,-12,-55,5,13,'#654731');rect(c,9,-55,5,13,'#654731');rect(c,-8,-50,4,3,'#252c2e');rect(c,5,-50,4,3,'#252c2e');rect(c,-1,-48,5,5,'#ecb786');rect(c,-10,-44,22,10,'#6d4e35');rect(c,-8,-36,19,7,'#7f5d3e');rect(c,-5,-31,12,5,'#73523a');rect(c,-6,-42,3,13,'#9c7850');rect(c,5,-41,3,12,'#9c7850');rect(c,-3,-43,9,3,'#432f29');rect(c,-8,-58,5,2,'#9c7950');
 }else if(type==='witch'){
  poly(c,[[-18,-3],[-11,-30],[8,-32],[19,-4],[14,0],[-16,0]],'#222330');poly(c,[[-14,-5],[-8,-31],[6,-31],[15,-5],[7,-8],[0,-4]],'#6e507e');rect(c,-6,-28,9,22,'#8d6397');rect(c,-4,-18,6,3,'#c49b65');rect(c,-1,-18,3,3,'#e1c278');rect(c,-17,-27,9,5,'#a49578');rect(c,9,-26,6,9,'#a49578');rect(c,-11,-39,19,13,'#647260');rect(c,-8,-40,17,13,'#b1b58c');rect(c,-3,-35,3,3,'#213136');rect(c,5,-35,3,3,'#213136');rect(c,8,-33,6,3,'#b9bd91');rect(c,-6,-29,9,2,'#665f62');rect(c,-14,-38,5,19,'#d0c6ab');rect(c,9,-36,4,15,'#d0c6ab');
  poly(c,[[-21,-39],[-12,-43],[-4,-62],[1,-66],[5,-64],[9,-46],[21,-40],[18,-36],[-18,-36]],'#252438');poly(c,[[-16,-40],[-8,-43],[-1,-60],[3,-63],[5,-50],[9,-42],[15,-40]],'#775788');rect(c,-10,-43,20,4,'#b28a51');rect(c,0,-43,5,4,'#e1c278');
  rect(c,-23,-24,8,12,'#233e46');rect(c,-21,-25,4,4,'#a1c5b4');rect(c,-22,-20,6,7,'#67b888');rect(c,-20,-20,2,3,'#c5e8ae');
 }else if(type==='wolf'){
  rect(c,-19,-23,29,17,'#293a40');rect(c,-16,-26,27,17,'#70888c');rect(c,-13,-23,25,14,'#93a7a0');rect(c,-16,-12,7,11+step,'#7c9392');rect(c,4,-11,7,11-step,'#a3b4a8');rect(c,-16,-3+step,9,3,'#2b4045');rect(c,3,-3-step,11,3,'#2b4045');
  poly(c,[[-17,-22],[-30,-27],[-32,-24],[-23,-15],[-17,-15]],'#758e93');rect(c,-29,-26,4,5,'#a8b6ac');
  poly(c,[[1,-29],[0,-39],[7,-34],[17,-35],[22,-41],[24,-26],[29,-20],[25,-13],[8,-14]],'#334a52');poly(c,[[4,-28],[4,-35],[9,-31],[18,-31],[21,-35],[21,-25],[27,-20],[23,-16],[10,-16]],'#a6b8ad');rect(c,19,-26,5,3,'#192d32');rect(c,20,-26,2,2,'#eccd80');rect(c,24,-21,6,4,'#183038');rect(c,15,-17,10,2,'#334b4e');rect(c,12,-31,5,5,'#d2d6bc');rect(c,2,-20,5,7,'#c5cbb3');
 }else{
  const robes=['#5b7d78','#856768','#7e7856','#657a91'];const robe=robes[variant%robes.length];rect(c,-8,-3+step,6,3,'#243238');rect(c,3,-3-step,6,3,'#243238');rect(c,-8,-21,17,18,robe);rect(c,-10,-21,4,12,'#b8a17a');rect(c,8,-21,4,12,'#b8a17a');rect(c,-7,-34,15,14,'#c9ad82');rect(c,-8,-35,17,5,'#5c4b39');rect(c,-9,-30,4,10,'#6e523b');rect(c,-3,-28,2,3,'#22353a');rect(c,4,-28,2,3,'#22353a');rect(c,-4,-23,8,2,'#8e6c52');rect(c,-4,-21,9,3,'#e4cf9f');rect(c,-6,-19,3,12,'#a4a98a');
 }
 ctx.restore();
}

export function drawTree(ctx,x,y,seed=0){
 const r=rng(seed),h=88+Math.floor(r()*25),w=56+Math.floor(r()*20);ctx.save();ctx.translate(Math.round(x),Math.round(y));
 shade(ctx,0,0,w*.75);rect(ctx,-6,-26,12,26,'#29372e');rect(ctx,-4,-25,5,25,'#6b6250');rect(ctx,1,-23,3,22,'#454f3d');rect(ctx,-8,-3,17,3,'#45523f');
 const layers=4;for(let i=0;i<layers;i++){const yy=-h+i*h*.19,ww=w*(.29+i*.23),hh=h*.40;const left=-ww/2,right=ww/2;
  poly(ctx,[[0,yy],[6,yy+12],[5,yy+12],[13,yy+23],[10,yy+23],[right,yy+hh-4],[right,yy+hh],[10,yy+hh-3],[9,yy+hh+2],[-4,yy+hh-1],[-6,yy+hh+3],[left,yy+hh],[left+2,yy+hh-4],[-12,yy+23],[-9,yy+23],[-5,yy+13],[-6,yy+13]],i===0?'#294a45':'#183c3b');
  poly(ctx,[[0,yy+2],[-4,yy+12],[-2,yy+12],[-12,yy+26],[-8,yy+26],[left+8,yy+hh-4],[-5,yy+hh-7],[-3,yy+hh-4],[8,yy+hh-6],[4,yy+hh-12],[8,yy+hh-13],[0,yy+15]],['#52705a','#41664f','#3b5e4b','#365b47'][i]);
  for(let n=0;n<5+i*2;n++){const yy2=yy+13+r()*(hh-16),span=(yy2-yy)/hh*ww*.7;rect(ctx,-span*.6+r()*span,yy2,3+Math.floor(r()*4),2,r()>.5?'#56765a':'#244d43');}
 }
 rect(ctx,-1,-h,2,6,'#749276');ctx.restore();
}

function windowPixel(c,x,y,w=20,h=24,lit=true){
 rect(c,x-3,y-3,w+6,h+6,'#34413d');rect(c,x-1,y-1,w+2,h+2,'#a58d61');rect(c,x,y,w,h,lit?'#c4a566':'#263f48');rect(c,x+2,y+2,w-4,h-4,lit?'#edcd82':'#496e73');rect(c,x+w/2-1,y,3,h,'#675741');rect(c,x,y+h*.46,w,3,'#675741');rect(c,x-5,y+h+2,w+10,4,'#554c3d');rect(c,x+w-2,y+3,2,h-6,lit?'#ffe6a2':'#769895');
}
export function drawBuilding(ctx,b){
 const {x,y,w=160,h=150,style='house'}=b;const c=ctx;const roofH=Math.round(h*.44),wallY=y+roofH,wallH=h-roofH;const tavern=style==='tavern',witch=style==='witch'||style==='shack';
 rect(c,x+8,y+h-8,w+12,15,'#132b2d');rect(c,x+7,wallY,w-14,wallH,'#3e4236');rect(c,x+10,wallY,w-20,wallH-5,witch?'#726c54':tavern?'#a58d66':'#8b9278');rect(c,x+12,wallY+4,w-24,wallH-14,witch?'#817b5a':tavern?'#c2ab7f':'#b4b394');
 for(let yy=wallY+12;yy<y+h-10;yy+=14){rect(c,x+12,yy,w-24,2,'#9b9572');for(let xx=x+12+((yy-wallY)%28?0:12);xx<x+w-12;xx+=26)rect(c,xx,yy-10,2,10,'#aba583');}
 for(const xx of [x+9,x+w*.33,x+w*.67,x+w-15]){rect(c,xx,wallY,6,wallH,'#534e3b');rect(c,xx,wallY,2,wallH,'#7a6b4d');}
 rect(c,x+7,wallY+wallH*.46,w-14,5,'#5e553e');rect(c,x+7,y+h-11,w-14,7,'#615a43');
 const roofColor=witch?'#526367':tavern?'#735049':style==='herbalist'?'#4d6a50':style==='tailor'?'#6b546f':'#445967';
 poly(c,[[x-8,wallY+6],[x+w*.16,y+10],[x+w*.35,y],[x+w*.70,y+4],[x+w+9,wallY+5],[x+w+7,wallY+12],[x-9,wallY+12]],'#1d3339');
 poly(c,[[x-5,wallY+3],[x+w*.17,y+12],[x+w*.35,y+3],[x+w*.70,y+7],[x+w+4,wallY+4]],roofColor);
 for(let row=0;row<Math.ceil(roofH/9);row++){const yy=y+10+row*9,progress=(yy-y)/roofH,left=x+w*.31*(1-progress)-2,right=x+w-(w*.28*(1-progress))+4;
  for(let xx=left+(row%2)*8;xx<right;xx+=18){const len=Math.min(16,right-xx);rect(c,xx,yy,len,2,witch?'#778579':tavern?'#a06b58':'#70848b');rect(c,xx+2,yy+3,Math.max(1,len-3),4,witch?'#4b5f60':tavern?'#684b46':'#3c5361');}
 }
 rect(c,x-6,wallY+6,w+13,5,'#263d41');rect(c,x-4,wallY+5,w+9,2,'#9a8e6a');
 const chimneyX=x+w*.76;rect(c,chimneyX,y-7,18,34,'#45545a');rect(c,chimneyX+2,y-6,14,31,'#76817c');for(let k=0;k<4;k++)rect(c,chimneyX+2,y+k*7,14,2,'#3e5157');rect(c,chimneyX-2,y-9,22,5,'#9b9e85');
 const dx=b.door?.x??x+w/2,dy=b.door?.y??y+h;const dh=Math.min(42,wallH-8);rect(c,dx-15,dy-dh-3,30,dh+4,'#464738');rect(c,dx-12,dy-dh,24,dh,'#313a31');rect(c,dx-10,dy-dh+2,20,dh-2,'#625138');for(let k=-7;k<11;k+=6)rect(c,dx+k,dy-dh+3,2,dh-5,'#887048');rect(c,dx+6,dy-17,3,3,'#e1bd70');rect(c,dx-18,dy,36,5,'#798171');rect(c,dx-21,dy+5,42,4,'#4e6761');
 if(w>110){windowPixel(c,x+24,wallY+20,Math.min(24,w*.12),Math.min(26,wallH*.34));windowPixel(c,x+w-49,wallY+20,Math.min(24,w*.12),Math.min(26,wallH*.34));}
 if(tavern){rect(c,x+w*.32,wallY-1,w*.36,22,'#27362f');rect(c,x+w*.32+2,wallY+1,w*.36-4,18,'#735b3d');pixelText(c,'TAVERN',x+w/2,wallY+7,1,'#ebd19a','center');}
 if(style==='herbalist'||style==='tailor'){
  rect(c,x+18,wallY-3,w-36,20,'#233432');rect(c,x+20,wallY-1,w-40,16,style==='herbalist'?'#527053':'#70556c');pixelText(c,b.label,x+w/2,wallY+4,1,'#f0dab2','center');
  drawProp(c,{type:style==='herbalist'?'herbs':'thread',x:x+40,y:y+h+6});
 }
 if(witch){rect(c,x+w-25,y+h-13,19,4,'#3b5942');rect(c,x+w-19,y+h-19,8,10,'#3e694a');}
 for(let i=0;i<4;i++)rect(c,x+14+i*7,y+h-7-(i%2)*2,4,3,'#608057');
}

export function drawProp(ctx,p,time=0){
 const c=ctx;const x=Math.round(p.x),y=Math.round(p.y);const type=p.type||p.kind;ctx.save();ctx.translate(x,y);
 switch(type){
 case 'herbs':
  rect(c,-13,-12,26,12,'#624b37');rect(c,-15,-16,30,5,'#b08c5a');rect(c,-10,-10,20,3,'#866947');
  for(let i=0;i<5;i++){const xx=-12+i*6;rect(c,xx,-34+(i%2)*5,2,21,'#7b9e6b');rect(c,xx-5,-31+(i%2)*5,6,4,'#91ac70');rect(c,xx+1,-26+(i%2)*5,6,4,'#567a52');if(i%2)rect(c,xx-2,-35+(i%2)*5,5,4,'#b4a0b5');}break;
 case 'thread':
  for(let i=0;i<3;i++){const xx=-24+i*18;rect(c,xx,-29,14,27,'#cfb98a');rect(c,xx-2,-30,18,4,'#e1cca0');rect(c,xx-2,-5,18,4,'#a68a61');rect(c,xx,-25,14,20,['#7b9861','#9f6e96','#5e9891'][i]);for(let j=0;j<5;j++)rect(c,xx+1,-23+j*4,12,1,'#d8c9b044');}break;
 case 'tree':ctx.restore();drawTree(ctx,x,y,p.seed||0);return;
 case 'fountain':
  rect(c,-48,-8,96,16,'#243c40');rect(c,-52,-26,104,20,'#586e6c');rect(c,-48,-31,96,28,'#879184');rect(c,-44,-29,88,18,'#344f55');rect(c,-40,-27,80,15,'#478287');rect(c,-39,-25,77,3,'#86b5ac');rect(c,-47,-9,94,6,'#a4aa91');for(let i=0;i<7;i++)rect(c,-39+i*12,-5,1,7,'#506c68');rect(c,-10,-62,20,43,'#687c75');rect(c,-8,-62,6,40,'#9aa58b');rect(c,-24,-63,48,9,'#95a58d');rect(c,-20,-69,40,7,'#5c7f79');rect(c,-16,-68,32,3,'#90c0ae');rect(c,-3,-82,6,14,'#88bba8');rect(c,-5,-82,10,3,'#d0dac1');for(let i=0;i<4;i++){let dy=((time*14+i*9)%35);rect(c,-20+i*13,-57+dy,2,7,'#8bbfb1');}break;
 case 'lantern':
  rect(c,-3,-44,5,44,'#3c493c');rect(c,-4,-45,19,3,'#788364');rect(c,9,-43,2,5,'#a4a67d');rect(c,3,-39,15,18,'#263b39');rect(c,6,-36,9,12,'#d5b26b');rect(c,8,-34,5,8,Math.sin(time*3)>.5?'#f9dfa0':'#efcc86');rect(c,10,-36,2,13,'#9d7844');rect(c,2,-40,17,3,'#7c7953');rect(c,3,-23,14,3,'#82754d');rect(c,-6,-3,11,3,'#686d4e');break;
 case 'flower':
  rect(c,-1,-8,2,8,'#426c44');rect(c,-5,-4,5,2,'#679255');rect(c,1,-6,4,2,'#678f59');rect(c,-3,-12,6,5,p.variant%2?'#ae90ad':'#d4c38d');rect(c,-5,-10,10,2,p.variant%2?'#c3a3b7':'#e6d6a1');rect(c,-1,-10,2,2,'#eec777');break;
 case 'mushroom':
  rect(c,-2,-8,4,8,'#b7b6a0');rect(c,-7,-10,14,5,'#966b5b');rect(c,-5,-13,10,5,'#b9836c');rect(c,-3,-12,2,2,'#e0c59c');rect(c,3,-9,2,2,'#dfc49c');break;
 case 'rock':
  poly(c,[[-14,-2],[-15,-10],[-10,-19],[2,-21],[12,-16],[16,-6],[10,0]],'#526769');poly(c,[[-12,-9],[-7,-17],[2,-18],[11,-13],[5,-9],[-1,-7]],'#87958b');rect(c,-9,-16,8,3,'#a4a994');rect(c,7,-8,5,4,'#3e5658');rect(c,-11,-2,15,2,'#365048');break;
 case 'stump':
  rect(c,-13,-12,26,12,'#584a36');rect(c,-10,-17,20,17,'#806448');rect(c,-12,-18,24,5,'#b39363');rect(c,-7,-17,14,2,'#65573a');rect(c,-4,-16,8,1,'#d0b480');rect(c,-8,-10,2,9,'#4b4835');rect(c,5,-9,2,8,'#4b4835');break;
 case 'log':
  rect(c,-27,-13,54,13,'#5b513a');rect(c,-26,-15,49,4,'#83724c');rect(c,-26,-6,52,3,'#3a4533');rect(c,20,-12,10,11,'#b49b68');rect(c,23,-9,5,5,'#786947');break;
 case 'bench':
  rect(c,-27,-18,54,5,'#8d7950');rect(c,-27,-10,54,5,'#9e8758');rect(c,-27,-23,54,4,'#a69362');rect(c,-24,-22,4,27,'#4f503a');rect(c,20,-22,4,27,'#4f503a');break;
 case 'crate':
  rect(c,-14,-26,28,26,'#473f30');rect(c,-12,-24,24,22,'#967545');for(let i=0;i<3;i++)rect(c,-10+i*8,-23,2,22,'#624c32');rect(c,-14,-26,28,4,'#b08a51');rect(c,-14,-5,28,4,'#b08a51');for(let i=0;i<10;i++)rect(c,-11+i*2,-23+i*2,4,3,'#b2935d');break;
 case 'barrel':
  rect(c,-11,-29,22,29,'#594732');rect(c,-14,-25,28,21,'#866843');rect(c,-10,-28,20,4,'#ac8b56');for(let i=0;i<4;i++)rect(c,-10+i*6,-22,2,17,'#5e4a32');rect(c,-14,-22,28,4,'#3a4d4b');rect(c,-14,-9,28,4,'#3a4d4b');rect(c,-11,-1,22,2,'#444336');break;
 case 'cart':
  rect(c,-38,-6,10,13,'#273d3d');rect(c,27,-6,10,13,'#273d3d');rect(c,-36,-4,6,8,'#8b805c');rect(c,29,-4,6,8,'#8b805c');rect(c,-39,-26,78,24,'#634f35');for(let i=0;i<3;i++)rect(c,-37,-25+i*8,74,5,'#a18752');rect(c,-36,-34,7,34,'#6e5c3a');rect(c,29,-34,7,34,'#6e5c3a');rect(c,-45,-21,7,39,'#5c5339');for(let i=0;i<6;i++){rect(c,-29+i*10,-35,9,9,i%2?'#9f6855':'#bfa86c');rect(c,-26+i*10,-38,3,5,'#5e7547');}break;
 case 'sign':
  rect(c,-3,-30,6,30,'#6c6247');rect(c,-27,-43,54,19,'#3b4334');rect(c,-25,-41,50,15,'#907c51');rect(c,-24,-40,48,2,'#b5a16a');pixelText(c,p.label||(p.text?.includes('TAVERN')?'TAVERN':p.text?.startsWith('NO ')?'KEEP OUT':'PINES'),0,-35,1,'#eee0b3','center');break;
 case 'well':
  rect(c,-27,-24,54,24,'#758782');rect(c,-30,-27,60,9,'#a1aa94');rect(c,-25,-26,50,5,'#243e45');rect(c,-26,-67,5,54,'#71684a');rect(c,21,-67,5,54,'#71684a');poly(c,[[-35,-62],[0,-83],[35,-62],[33,-57],[-34,-57]],'#465b60');rect(c,-27,-58,54,4,'#9c8b5b');rect(c,0,-57,2,32,'#c4b685');rect(c,-6,-34,13,12,'#8c7549');for(let i=0;i<3;i++)rect(c,-25,-15+i*7,50,2,'#4b6869');break;
 case 'obelisk':
  rect(c,-17,-6,34,6,'#526f6b');poly(c,[[-10,-8],[-10,-48],[0,-59],[10,-48],[10,-8]],'#718c7d');poly(c,[[-8,-46],[0,-54],[0,-8],[-8,-8]],'#9da68a');rect(c,-4,-40,8,3,'#d4cf8d');rect(c,-2,-44,4,12,'#d4cf8d');rect(c,-3,-22,6,3,'#adc38d');break;
 case 'fence':
  {let w=p.w||70;rect(c,-w/2,-18,w,4,'#7a7650');rect(c,-w/2,-9,w,4,'#5c6749');for(let k=-w/2;k<=w/2;k+=18){rect(c,k,-26,5,28,'#8e865b');rect(c,k+1,-29,3,5,'#b5a574');}}break;
 case 'candle':
  rect(c,-6,-3,12,3,'#a38e58');rect(c,-2,-14,5,11,'#ded5a7');rect(c,-1,-20,3,6,'#e6b46c');rect(c,0,-18,2,4,'#fff1b9');break;
 case 'table':
  rect(c,-29,-7,7,13,'#463f31');rect(c,22,-7,7,13,'#463f31');rect(c,-34,-24,68,23,'#4b4130');rect(c,-34,-26,68,20,'#997a4c');rect(c,-32,-25,64,3,'#c19e63');rect(c,-32,-14,64,2,'#6d5839');rect(c,-22,-22,14,3,'#b5935c');rect(c,12,-20,10,7,'#d1bd89');rect(c,13,-19,8,4,'#7d5e40');break;
 case 'rug':
  {const w=p.w||110,h=p.h||68;rect(c,-w/2,-h,w,h,'#5c4250');rect(c,-w/2+3,-h+3,w-6,h-6,'#926f6a');rect(c,-w/2+7,-h+7,w-14,h-14,'#594f5b');for(let xx=-w/2+9;xx<w/2-6;xx+=12){rect(c,xx,-h+9,4,3,'#c3a778');rect(c,xx,-11,4,3,'#c3a778');}rect(c,-6,-h/2-8,12,12,'#a28570');rect(c,-3,-h/2-5,6,6,'#d3b785');}break;
 case 'shelf':
  {const w=p.w||100;rect(c,-w/2,-62,w,62,'#322e26');for(let yy=-55;yy<-8;yy+=23){for(let xx=-w/2+7;xx<w/2-8;xx+=12){const v=Math.abs(Math.floor(xx))%4;rect(c,xx,yy,8,17,['#75897a','#99745a','#795c78','#b4a371'][v]);rect(c,xx+2,yy+3,4,2,'#d0bd8a');}rect(c,-w/2,yy+18,w,5,'#8e7044');}rect(c,-w/2,-62,w,5,'#b0935d');rect(c,-w/2,-4,w,4,'#a28652');}break;
 case 'counter':
  {const w=p.w||220;rect(c,-w/2,-34,w,34,'#5c4931');for(let xx=-w/2+7;xx<w/2-5;xx+=26){rect(c,xx,-27,19,22,'#886a3f');rect(c,xx+2,-26,3,20,'#9b7c4b');}rect(c,-w/2-5,-39,w+10,10,'#b2945f');rect(c,-w/2-3,-39,w+6,3,'#d1b47a');}break;
 case 'cauldron':
  rect(c,-23,-15,46,18,'#172c31');rect(c,-27,-28,54,21,'#314b4c');rect(c,-22,-13,45,10,'#47645d');rect(c,-22,-32,44,11,'#20353c');rect(c,-18,-31,36,7,'#84ab7b');rect(c,-15,-30,30,2,'#c5c88b');rect(c,-19,1,6,7,'#223b3c');rect(c,13,1,6,7,'#223b3c');for(let i=0;i<4;i++){let yy=(time*9+i*11)%35;rect(c,-13+i*8,-34-yy,4,4,'#799b79');}rect(c,-15,-20,5,9,'#738879');break;
 case 'questboard':
  rect(c,-37,-65,74,57,'#343a2e');rect(c,-33,-61,66,49,'#825e3c');rect(c,-36,-64,72,5,'#b09059');rect(c,-37,-64,5,57,'#a38854');rect(c,32,-64,5,57,'#a38854');rect(c,-32,-13,64,5,'#a38854');rect(c,-26,-8,5,8,'#6f6342');rect(c,22,-8,5,8,'#6f6342');rect(c,-25,-52,17,28,'#d5bf86');rect(c,-4,-55,24,34,'#efdd9e');rect(c,-1,-49,18,2,'#7f704a');rect(c,2,-44,12,2,'#a08b5b');rect(c,1,-39,16,2,'#a08b5b');rect(c,3,-34,10,2,'#a08b5b');rect(c,5,-58,5,5,'#9f6550');rect(c,-20,-48,8,2,'#8c7951');break;
 default:rect(c,-4,-5,8,5,'#65764e');
 }
 ctx.restore();
}

export function drawItem(ctx,id,x,y,scale=1){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);const c=ctx;
 if(id==='burger'){
  rect(c,-14,-9,28,18,'#342e2b');rect(c,-12,-13,24,9,'#c79550');rect(c,-8,-16,16,4,'#e4bb6b');rect(c,-11,-12,22,3,'#f0c979');
  rect(c,-14,-4,28,3,'#91a856');rect(c,-12,-1,24,5,'#704536');rect(c,-10,0,20,2,'#c26747');rect(c,-13,4,26,5,'#d6a256');rect(c,-10,-11,2,1,'#f5de9d');rect(c,3,-13,2,1,'#f5de9d');
 }else if(id==='moss'||id==='plum'||id==='teal'){
  const color=id==='moss'?'#90a969':id==='plum'?'#ad7ca5':'#59a59a';rect(c,-13,-12,26,9,color);rect(c,-10,-3,8,18,color);rect(c,4,-3,7,13,color);rect(c,-12,-10,23,2,'#e4d2ad');for(let i=0;i<3;i++)rect(c,-10+i*3,15,1,3,color);
 }else if(id==='bread'){
  rect(c,-15,-8,30,16,'#a97740');rect(c,-12,-12,24,18,'#dbac61');rect(c,-10,-10,20,3,'#f0cc86');for(let i=0;i<3;i++)rect(c,-8+i*8,-8,3,10,'#a97c44');
 }else if(id==='apple'){
  rect(c,-9,-10,18,20,'#b65b4b');rect(c,-12,-5,24,11,'#b65b4b');rect(c,-8,-7,4,8,'#e49a6d');rect(c,0,-16,3,7,'#88754c');rect(c,3,-14,8,3,'#83a562');
 }else{
  const color=id==='balm'?'#80a681':id==='tea'?'#90b1a0':'#c59f68';rect(c,-8,-16,16,6,'#9b7b52');rect(c,-11,-10,22,22,'#314c51');rect(c,-8,-9,16,19,color);rect(c,-6,-5,12,8,'#ecdfb4');rect(c,-2,-3,4,4,'#587a59');rect(c,-6,5,2,4,'#e1e5c5');
 }
 ctx.restore();
}

export function drawTitleScene(ctx,width,height,time=0){
 // Painted at half resolution; a fixed scenic composition scales to any screen.
 ctx.save();ctx.scale(width/480,height/270);ctx.imageSmoothingEnabled=false;const c=ctx;
 rect(c,0,0,480,270,'#0d1b27');rect(c,0,74,480,91,'#132d3b');rect(c,0,118,480,57,'#1a3942');
 const rand=rng(1821);for(let i=0;i<62;i++){let sx=30+rand()*425,sy=rand()*130;rect(c,sx,sy,i%9===0?2:1,1,i%6===0?'#9aa69b':'#426574');}
 // The rising moon and its tiny angular halo.
 rect(c,369,28,33,41,'#29434d');rect(c,365,34,41,29,'#29434d');rect(c,371,29,29,39,'#b6c0a5');rect(c,367,35,37,27,'#b6c0a5');rect(c,372,32,26,33,'#d6d8b1');rect(c,369,37,32,23,'#d6d8b1');rect(c,376,36,8,4,'#b5c3a7');rect(c,386,51,9,6,'#bcc5a4');rect(c,373,49,4,3,'#c2caaa');
 poly(c,[[0,137],[36,111],[68,123],[99,93],[128,118],[152,101],[192,132],[229,105],[261,122],[290,96],[321,127],[349,92],[379,116],[412,104],[480,139],[480,185],[0,185]],'#1a3541');
 poly(c,[[0,149],[52,128],[78,140],[113,123],[143,144],[184,124],[213,151],[253,128],[280,144],[318,121],[357,140],[388,126],[423,140],[480,122],[480,192],[0,192]],'#1e4046');
 // A faraway keep, glimpsed through the firs.
 rect(c,281,99,43,58,'#243f49');rect(c,277,94,12,61,'#294650');rect(c,315,85,13,70,'#2a4750');rect(c,278,88,3,9,'#294650');rect(c,284,88,4,9,'#294650');rect(c,315,79,4,10,'#2a4750');rect(c,323,79,5,10,'#2a4750');rect(c,293,110,26,8,'#284852');rect(c,298,103,2,21,'#375762');rect(c,320,96,3,7,'#bba26b');rect(c,282,108,3,6,'#879778');rect(c,303,126,3,6,'#b8a16e');
 for(let layer=0;layer<2;layer++){const pr=rng(680+layer);for(let i=0;i<39;i++){let xx=i*14-11,hh=22+pr()*41,yy=171+layer*14;poly(c,[[xx,yy-hh],[xx-9,yy-16],[xx-6,yy-17],[xx-15,yy],[xx+15,yy],[xx+6,yy-17],[xx+9,yy-16]],layer?'#153b3f':'#284d4f');}}
 rect(c,0,182,480,88,'#173539');poly(c,[[0,195],[76,184],[152,189],[211,183],[264,191],[314,180],[361,178],[411,191],[480,185],[480,270],[0,270]],'#23423c');
 // Narrow path from the ruined gateway to the player's little ridge.
 poly(c,[[351,155],[359,156],[348,177],[325,193],[340,206],[378,223],[389,244],[376,270],[320,270],[352,240],[337,222],[307,206],[308,192],[335,174]],'#54604a');poly(c,[[352,158],[356,158],[342,179],[319,195],[331,207],[369,227],[374,242],[347,270],[330,270],[358,241],[350,226],[317,209],[313,194],[338,176]],'#788064');
 const pathRand=rng(41);for(let i=0;i<70;i++){let xx=313+pathRand()*73,yy=183+pathRand()*87; if(Math.abs(xx-(yy<209?325:355))<14)rect(c,xx,yy,2+pathRand()*5,1,'#929779');}
 // Old forest arch on the right, chipped blocks with flowering ivy.
 rect(c,335,110,12,66,'#506c68');rect(c,373,106,13,71,'#405f5e');rect(c,340,96,40,16,'#54716c');rect(c,345,89,29,10,'#6e8274');rect(c,350,86,19,5,'#7d8b78');rect(c,347,110,26,6,'#132f36');rect(c,348,116,24,50,'#122d34');rect(c,349,111,22,7,'#203d40');rect(c,350,108,20,5,'#203d40');
 for(let yy=112;yy<175;yy+=9){rect(c,335,yy,12,2,'#294b4b');rect(c,373,yy-3,13,2,'#244649');}rect(c,337,111,3,60,'#799081');rect(c,375,110,2,61,'#668075');rect(c,332,171,19,7,'#7a8872');rect(c,370,171,19,7,'#657b6a');rect(c,344,100,33,3,'#83907d');
 for(let i=0;i<13;i++){let xx=338+(i%3)*4,yy=98+i*5;rect(c,xx,yy,6,3,i%2?'#3f6b49':'#6c8656');if(i%4===0)rect(c,xx+4,yy-2,2,2,'#ad9ca0');}rect(c,352,158,6,3,'#a2b393');rect(c,357,155,4,2,'#bac6a6');
 // Distant warm light in an otherwise cool woodland.
 rect(c,389,156,2,22,'#5e684d');rect(c,385,145,9,12,'#35504a');rect(c,387,147,5,7,'#d7b975');rect(c,388,148,3,5,'#f7e2a0');
 // Framing trees have lush silhouettes, leaving menu text clear to the left.
 c.save();c.translate(460,218);c.scale(.96,.96);drawTree(c,0,0,16);drawTree(c,32,22,33);c.restore();
 c.save();c.translate(437,241);c.scale(.84,.84);drawTree(c,0,0,7);c.restore();
 c.save();c.translate(9,210);c.scale(1.18,1.18);drawTree(c,0,0,12);c.restore();
 c.save();c.translate(-12,269);c.scale(1.42,1.42);drawTree(c,0,0,46);c.restore();
 // Foreground ridge and tiny knight looking toward the unknown.
 poly(c,[[0,246],[59,238],[108,247],[152,240],[191,247],[235,234],[275,242],[311,239],[335,248],[359,247],[384,233],[421,229],[480,237],[480,270],[0,270]],'#142e30');
 poly(c,[[269,247],[281,243],[301,244],[313,251],[319,270],[260,270]],'#29443a');rect(c,271,247,37,2,'#56674c');
 drawSprite(c,'yips',291,248,{scale:.80,time,facing:'up'});
 for(let i=0;i<45;i++){const xx=12+rand()*462,yy=232+rand()*38;rect(c,xx,yy,2,4,'#31513b');rect(c,xx+2,yy+2,3,2,'#395c3e');}
 // A few fireflies rather than a screen of particles.
 for(let i=0;i<10;i++){let xx=260+i*19+Math.sin(time*.6+i)*3,yy=166+(i*23)%66+Math.cos(time*.8+i)*3;if(Math.sin(time*1.3+i)>.1){rect(c,xx,yy,1,1,'#d1c58a');}}
 // Two delicate drifting clouds, rendered in flat stepped pixels.
 rect(c,224+Math.sin(time*.03)*7,57,51,2,'#263e4b');rect(c,235+Math.sin(time*.03)*7,55,32,2,'#263e4b');rect(c,397,88,40,2,'#35505a');rect(c,405,86,25,2,'#35505a');
 ctx.restore();
}
