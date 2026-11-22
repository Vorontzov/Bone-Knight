// Isolated UI smoke-test server. It never ships in dist and uses its own browser origin.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {freshState} from '../dist/state.js';
import {AREAS,allQuestWolves} from '../dist/world.js';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root)){res.writeHead(403).end();return;}fs.readFile(file,(err,buffer)=>{if(err){res.writeHead(404).end();return;}let data=buffer;const fixture=url.searchParams.get('fixture');if(url.pathname==='/'&&fixture){let s=freshState();s.stage='forest';s.area='forest';s.playSeconds=910;
 if(fixture==='fountain'){s.area='town';s.x=700;s.y=850;s.hp=10;}
 if(fixture==='shops'){s.area='town';s.x=700;s.y=850;s.hp=10;s.stage='return';s.coins=40;s.fountainGiftReceived=true;s.inventory={burger:1};}
 if(fixture==='wolf'){const w=AREAS.forest.interactables.find(x=>x.kind==='wolf');s.x=w.x;s.y=w.y+35;}
 if(fixture==='witch'){s.area='den';s.x=350;s.y=220;s.stage='witch';s.wolves=[...allQuestWolves];}
 if(fixture==='reward'){s.area='tavern';s.x=350;s.y=245;s.stage='return';s.wolves=[...allQuestWolves];}
 if(fixture==='freeplay'){s.completed=true;s.stage='done';s.emeralds=1;s.wolves=[...allQuestWolves];s.area='town';}
 data=buffer.toString().replace('<script type="module"',`<script>localStorage.setItem('bone-knight.yips.v1',${JSON.stringify(JSON.stringify(s))})</script><script type="module"`);
 }res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});}).listen(4174,'127.0.0.1',()=>console.log('Isolated QA: http://127.0.0.1:4174/?fixture=wolf'));
