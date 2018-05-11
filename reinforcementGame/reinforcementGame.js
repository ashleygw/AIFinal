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
let averageFitness = 0;
let showGame = false;
let fitGraph = [];
let showGraph = true;
let bestBrain = null;

function setup() {
    createCanvas(700,400);
    // player = new Player(xsplit);
    // obstacle = new Obstacle(100,width/2,60,xsplit,ysplit);
    // pArray.push(player);
    // oArray.push(obstacle);
    strokeWeight(5);
    stroke('green');
    fitSpan = select('#fit');
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
function showBrain(){
    if (bestBrain){
        let input_nodes = bestBrain[input_nodes];
        let hidden_nodes = bestBrain[hidden_nodes];
        let output_nodes = bestBrain[output_nodes];
        let weights_ih = bestBrain[weights_ih];
        let weights_ho = bestBrain[weights_ho];
        let bias_h = bestBrain[bias_h];
        let bias_o = bestBrain[bias_o];
        let input_loc = 4*height / 5;
        let hidden_loc = 3 * height /5;
        let out_loc = height/5;
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
function graph()
{
    xbin = width / (fitGraph.length+1);
    ybin = height/ Math.max.apply(Math,fitGraph);
    p1x = 0;
    p1y = 0;
    p2x = 0;
    p2y = 0;
    for(let i = 0; i < fitGraph.length - 1;i++)
    {
        p1x = xbin * i;
        p1y = height - fitGraph[i] * ybin;
        p2x = xbin * i + xbin;
        p2y = height - fitGraph[i+1] * ybin;
        line(p1x,p1y,p2x,p2y);
    }
}
function calcAveFitness(){
    sum = 0;
    for (let i = pArray.length - 1; i >= 0; i--)
        sum += pArray[i].score;
    averageFitness = sum / totalPopulation;
    return averageFitness;
}
function keyPressed() {
    console.log(key);
    if(key == "S")
      showGame = !showGame;
    if(key == "G")
        showGraph = !showGraph;
}
function draw() {
    // console.log(fitGraph);
    for (let n = 0; n < cycles; n++) {
        // console.log(frameRate());
        tick += 1;
        background(51);
        tickSpan.html(tick);
        batSpan.html(highScore);
        genSpan.html(generations);
        fitSpan.html(averageFitness);
        if(showGraph)
            graph();
        
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
            if(showGame)
                oArray[i].display();
            if (oArray[i].yloc > height - 10) {
                oArray.splice(i, 1);
            }
        }
        if (runBest) {
            if(showGame)
                bestPlayer.display();
            bestPlayer.think();
            bestPlayer.update();
            if (bestPlayer.collision()) {
              resetGame();
            }
        }
        else
        {
            if(showGame)
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
                
                fitGraph.push(calcAveFitness());
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
                bestBrain = bestPlayer.brain.serialize();
                console.log(bestPlayer.brain.serialize());
            }else{
                tempHighScore = bestPlayer.score;
                if (tempHighScore > highScore) {
                highScore = tempHighScore;
                }
            }
        }
    }
}
