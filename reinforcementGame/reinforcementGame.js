let obstacle;
let oArray = [];
let pArray = [];
let paArray = [];
let tick = -1;
let tickSpan;
let bat = 0;
let xsplit = 20;
let ysplit = 20;
let bestPlayer;
let totalPopulation = 200;
let highScore = 0;
let cycles = 10;
let generations = 0;
let pipesSpawned = 0;
let runBest = false;
let runBestButton;

function setup() {
    createCanvas(700,400);
    // player = new Player(xsplit);
    // obstacle = new Obstacle(100,width/2,60,xsplit,ysplit);
    // pArray.push(player);
    // oArray.push(obstacle);
    strokeWeight(5);
    stroke('green');
    tickSpan = select('#tick');
    batSpan = select('#bat');
    genSpan = select('#gen');
    runBestButton = select('#best');
    runBestButton.mousePressed(toggleState);
    for (let i = 0; i < totalPopulation; i++) {
        let player = new Player(xsplit);
        paArray[i] = player;
        pArray[i] = player;
    }
    
}

function toggleState() {
    runBest = !runBest;
    // Show the best player
    if (runBest) {
      resetGame();
      runBestButton.html('continue training');
      // Go train some more
    } else {
      nextGeneration();
      runBestButton.html('run best');
    }
}

function draw() {
    for (let n = 0; n < cycles; n++) {
        // console.log(frameRate());
        tick += 1;
        background(51);
        tickSpan.html(tick);
        batSpan.html(highScore);
        genSpan.html(generations);
        if(tick % (300 - pipesSpawned) == 0){
            // console.log((300 - int(pipesSpawned)));
            let w = random(200,400);
            let xloc = random(w/2,width - w/2);
            let inv = 30;
            let o = new Obstacle(w,xloc,inv,xsplit,ysplit);
            oArray.push(o);
            pipesSpawned+=1;
        }
        for (let i = oArray.length - 1; i >= 0; i--) {
            oArray[i].update(tick);
            oArray[i].display();
            if (oArray[i].yloc > height - 10) {
                oArray.splice(i, 1);
            }
        }
        if (runBest) {
            bestPlayer.display();
            bestPlayer.think();
            bestPlayer.update();
            if (bestPlayer.collision()) {
              resetGame();
            }
        }
        else
        {
            for(let i = 0; i < paArray.length; i++){
                paArray[i].display();
            }
            
            for (let i = paArray.length - 1; i >= 0; i--) {
                let player = paArray[i];
                // player uses its brain!
                player.think();
                player.update();
    
                // Check all the obstacles
                if(player.collision()){
                    paArray.splice(i, 1);
                }
    
            }
            
            if (paArray.length == 0) {
                nextGeneration();
                generations++;
            }
            let tempHighScore = 0;
            let tempbestPlayer = null;
            for (let i = 0; i < paArray.length; i++) {
                let s = paArray[i].score;
                if (s > tempHighScore) {
                    tempbestPlayer = paArray[i];
                    tempHighScore = s;
                }
            }
    
            // Is it the all time high scorer?
            if (tempHighScore > highScore) {
                highScore = tempHighScore;
                bestPlayer = tempbestPlayer;
            }else{
                tempHighScore = bestPlayer.score;
                if (tempHighScore > highScore) {
                highScore = tempHighScore;
                }
            }
        }
    }
}
