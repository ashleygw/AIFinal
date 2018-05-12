function Obstacle(w,xloc,invelocity, wsplit, hsplit){
    this.width = w;
    this.xloc = xloc;
    this.yloc = 0;
    this.inVelocity = invelocity;
    this.hsplit = height/hsplit;
    this.colx = this.xloc - this.width/2;
    this.colx2 = this.xloc + this.width/2;
    this.coly = this.yloc + this.hsplit;
    // this.name = random(10);

    this.display = function(){
        stroke('red');
        rect(0,this.yloc,this.colx,this.hsplit);
        rect(this.colx2, this.yloc, width, this.hsplit);
    };
    this.collision = function(x,y,s){
        if(this.yloc < height - s*1.5)
            return false;
        else{
            if(this.colx > x || this.colx2 < x + s){
                return true;
            }
        }
        return false;
    }
    this.update = function(currentTick){
        if(currentTick % this.inVelocity == 0){
            this.yloc += this.hsplit;
        }
    };
}