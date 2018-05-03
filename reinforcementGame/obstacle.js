function Obstacle(w,xloc,invelocity, wsplit, hsplit){
    this.width = w;
    this.xloc = xloc;
    this.yloc = 0;
    this.inVelocity = invelocity;
    this.hsplit = height/hsplit;
    this.colx = this.xloc - this.width/2;
    this.colx2 = this.xloc + this.width/2;
    this.coly = this.yloc + this.hsplit;
    this.name = random(1000000);

    this.display = function(){
        rect(0,this.yloc,this.colx,this.hsplit);
        rect(this.colx2, this.yloc, width, this.hsplit);
    };
    this.update = function(currentTick){
        // console.log(currentTick % this.inVelocity);
        // console.log(this.name);
        if(currentTick % this.inVelocity == 0){
            this.yloc += this.hsplit;
        }
        // return this.yloc < height;
    };
}