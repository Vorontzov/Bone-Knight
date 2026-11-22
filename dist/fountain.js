// Presentation coordinates stay separate from the saved, walkable player position.
export class FountainVisit {
  constructor(x,y,met){this.phase='hop-in';this.elapsed=0;this.from={x,y};this.player={x,y,lift:0};this.stranger={x:480,y:850};this.met=met;this.hasStranger=!met;}
  update(dt){
    this.elapsed+=dt;
    if(this.phase==='hop-in'||this.phase==='hop-out'){
      const out=this.phase==='hop-out',p=Math.min(1,this.elapsed/.65),start=out?{x:728,y:800}:this.from,end=out?{x:700,y:850}:{x:728,y:800};
      this.player={x:start.x+(end.x-start.x)*p,y:start.y+(end.y-start.y)*p,lift:Math.sin(p*Math.PI)*26};
      if(p===1){this.elapsed=0;this.phase=out?'done':this.met?'idle':'approach';}
    }else if(this.phase==='approach'){
      const p=Math.min(1,this.elapsed/2.4);this.stranger.x=480+188*p;this.stranger.y=850-4*p;
      if(p===1){this.phase='talking';this.elapsed=0;return 'greet';}
    }
    return null;
  }
  leave(){if(this.phase!=='idle')return false;this.phase='hop-out';this.elapsed=0;return true;}
  get busy(){return this.phase!=='idle'&&this.phase!=='done';}
}
