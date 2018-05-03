function Player()
{
    this.xloc = random(width);
    this.yloc = height - 50;
    this.vel = 0;
    this.maxvel = 15;
    this.size = 40;

    this.display = function(){
        ellipse(this.xloc,this.yloc,this.size,this.size);
    };
    this.update = function(direction){
        this.vel += direction;
        if (abs(this.vel) > this.maxvel){
            this.vel -= direction;
        }
        this.xloc += this.vel;
        if (this.xloc > width){
            this.xloc = width - 1;
            this.vel *= -0.8;
        }
        else if (this.xloc < 0){
            this.xloc = 1;
            this.vel *= -0.8;
        }
    };
}