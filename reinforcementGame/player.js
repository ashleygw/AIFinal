function mutate(x) {
    if (random(1) < 0.1) {
      let offset = randomGaussian() * 0.5;
      let newx = x + offset;
      return newx;
    } else {
      return x;
    }
}

class Player
{
    constructor(binsize, brain){
        this.xloc = (width/2);
        this.yloc = height - 50;
        this.vel = 0;
        this.maxvel = 10;
        this.size = 40;
        this.bins = binsize;
        this.alive = true;
        this.score = 0;
        this.fitness = 0;

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(mutate);  
        } else {
            // Just find the closest obstacle for now.
            this.brain = new NeuralNetwork(6, 8, 2);
        }
        this.showBrain = function()
        {
            
        }
        this.display = function(){
            stroke('green');
            rect(round20(this.xloc),this.yloc,this.size,this.size);
            // stroke('blue');
            // line((this.xloc+this.size/2),(this.yloc+this.size/2), this.xloc+this.size/2 + this.vel*10, this.yloc+this.size/2);
            // stroke('green');
            // point(this.xloc+this.size/2 + this.vel*10, this.yloc+this.size/2);

        };

        this.think=function() {
            // First find the closest pipe
            let closest = null;
            let closest2 = null;
            let max = -Infinity;
            let max2 = -Infinity;
            for (let i = 0; i < oArray.length; i++) {
              let diff = oArray[i].yloc;
              if (diff > 0 && diff > max) {
                max = diff;
                closest2 = closest;
                closest = oArray[i];
              }
              else if(diff > 0 && diff > max2) {
                  max2 = diff;
                  closest2 = oArray[i];
              }
            }
            
            if (closest != null && closest2 != null) {
            //   console.log(closest2.yloc);
            //   console.log(closest.yloc);
              // Now create the inputs to the neural network
              let inputs = [];
              // opening location of closest pipe
              inputs[0] = map(closest.xloc, 0, width, 0, 1);
              // distance from player
              inputs[1] = map(closest.yloc, 0, height-50, 0, 1);
              // opening location of 2nd closest pipe
              inputs[2] = map(closest2.xloc, 0, width, 0, 1);
              // distance from player
              inputs[3] = map(closest2.yloc, 0, height-50, 0, 1);
              // player x vel
              inputs[4] = map(this.vel, -this.maxvel, this.maxvel, 0, 1);
              // Player location :\
              inputs[5] = map(this.xloc,0,width,0,1);
              // Get the outputs from the network
              let action = this.brain.predict(inputs);
              let indexOfMaxValue = action.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
              // Left right/no input
              switch(indexOfMaxValue){
                    case 0:
                        this.input(0.1);
                        break;
                    case 1:
                        this.input(-0.1);
                        break;
                    // case 2:
                    //     this.input(0);
                    //     break;
              }
            }
        }

        this.copy = function() {
            return new Player(this.bins, this.brain);
        }
        
        function round20(x)
        {
            return Math.ceil((x-10)/20)*20;
        }

        this.collision = function(){
            var hit = false;
            for(var i = 0; i < oArray.length;++i)
            {
                if (oArray[i].collision(round20(this.xloc),this.yloc,this.size))
                {
                    hit = true;
                }
            }
            return hit;
        }

        this.input = function(direction){
            this.vel += direction;
            if (abs(this.vel) > this.maxvel){
                this.vel -= direction;
            }
        }

        this.update=function(){
            this.score++;
            this.xloc += this.vel;
            if (this.xloc > width- this.size){
                this.xloc = width- this.size - 1;
                this.vel *= -0.8;
            }
            else if (round20(this.xloc) < 0){
                this.xloc = 1;
                this.vel *= -0.8;
            }
            if (this.collision())
            {
                this.alive = false;
            }
        }
    }
}