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
let totalPopulation = 400;
let highScore = 0;
let cycles = 100;
let generations = 0;
let pipesSpawned = 0;
let runBest = false;
let runBestButton;
let averageFitness = 0;
let showGame = false;
let fitGraph = [];
let showGraph = true;
let bestBrain = null;
let showBrain = false;
let showBrainAnalysis = false;
let maxDiff = 100;

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

let input_nodes = null; 
let hidden_nodes = null; 
let output_nodes = null; 
let weights_ih = null; 
let weights_ho = null; 
let bias_h = null; 
let bias_o = null; 
let input_loc = null; 
let hidden_loc = null; 
let out_loc = null; 
// Get min and max of everything for scaling.
let values_ih = null;
let values_ho = null;
let values_h = null;
let values_o = null;
let max_ih = null;
let min_ih = null;
let max_ho = null;
let min_ho = null;
let max_h = null;
let min_h = null;
let max_o = null;
let min_o = null;

function brain(){
    c = color(0);
    // Draw the input layer
    for(let i = 0; i < weights_ih["data"][0].length;++i)
    {
        
        ellipse(width / (weights_ih["data"][0].length + 1) * (i+1), input_loc, 50,50);
    }
    // Draw the hidden layer
    for(let i = 0; i < weights_ih["data"].length;++i)
    {
        c = color(map(bias_h["data"][i], min_h, max_h,0,255));
        stroke(c);
        ellipse(width / (weights_ih["data"].length + 1) * (i+1), hidden_loc, 50,50);
    }
    // Draw the output layer
    for(let i = 0; i < weights_ho["data"].length;++i)
    {
        c = color(map(bias_o["data"][i], min_o, max_o,0,255));
        stroke(c);
        ellipse(width / (weights_ho["data"].length + 1) * (i+1), out_loc, 50,50);
    }
    // Draw the weights from the input to hidden layer
    
    for(let i = 0; i < weights_ih["data"].length;++i)
    {
        for(let j = 0; j < weights_ih["data"][i].length;++j)
        {
            c = color(map(weights_ih["data"][i][j], min_ih, max_ih,0,255),180);
            stroke(c);
            line(width / (weights_ih["data"][0].length + 1) * (j+1), input_loc, width / (weights_ih["data"].length + 1) * (i+1), hidden_loc);
        }
    }
    // Draw weights from hidden to output layer
    for(let i = 0; i < weights_ho["data"].length;++i)
    {
        for(let j = 0; j < weights_ho["data"][i].length;++j)
        {
            c = color(map(weights_ho["data"][i][j], min_ih, max_ih,0,255),180);
            stroke(c);
            line(width / (weights_ho["data"][0].length + 1) * (j+1), hidden_loc, width / (weights_ho["data"].length + 1) * (i+1), out_loc);
        }
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
    // p1x = 0;
    // p1y = 0;
    // p2x = 0;
    // p2y = 0;
    stroke('green');
    for(let i = 0; i < fitGraph.length - 1;i++)
    {
        // p1x = xbin * i;
        // p1y = height - fitGraph[i] * ybin;
        // p2x = xbin * i + xbin;
        // p2y = height - fitGraph[i+1] * ybin;
        line(xbin * i,height - fitGraph[i] * ybin,xbin * i + xbin,height - fitGraph[i+1] * ybin);
    }
}
function calcAveFitness(){
    sum = 0;
    for (let i = pArray.length - 1; i >= 0; i--)
        sum += pArray[i].score;
    averageFitness = sum / totalPopulation;
    return averageFitness;
}
function calculateBrain(){
    if(bestBrain){
        input_nodes = bestBrain["input_nodes"];
        hidden_nodes = bestBrain["hidden_nodes"];
        output_nodes = bestBrain["output_nodes"];
        weights_ih = bestBrain["weights_ih"];
        weights_ho = bestBrain["weights_ho"];
        bias_h = bestBrain["bias_h"];
        bias_o = bestBrain["bias_o"];
        input_loc = 4*height / 5;
        hidden_loc = 2.5 * height /5;
        out_loc = height/5;
        // Get min and max of everything for scaling.
        values_ih = weights_ih["data"].map(function(elt) { return elt[1]; });
        values_ho = weights_ho["data"].map(function(elt) { return elt[1]; });
        values_h = bias_h["data"].map(function(elt) { return elt[0]; });
        values_o = bias_o["data"].map(function(elt) { return elt[0]; });
        max_ih = Math.max.apply(null, values_ih);
        min_ih = Math.min.apply(null, values_ih);
        max_ho = Math.max.apply(null, values_ho);
        min_ho = Math.min.apply(null, values_ho);
        max_h = Math.max.apply(null,values_h);
        min_h = Math.min.apply(null,values_h);
        max_o = Math.max.apply(null, values_o);
        min_o = Math.min.apply(null, values_o);
    }
    
}
function forceGen(){
    paArray = [];
}
function keyPressed() {
    if(key == "D"){
      if(showGame)
        cycles = 100;
      else
        cycles = 10;
      showGame = !showGame;
    }
    if(key == "G")
        showGraph = !showGraph;
    if(key == "B")
        showBrain = !showBrain;
    if(key == "A")
        showBrainAnalysis = !showBrainAnalysis;
    if(key == "S")
        console.log(bestPlayer.brain.serialize());
    if(key == "F")
        forceGen();
}
function draw() {
    // console.log(fitGraph);
    
    for (let n = 0; n < cycles; n++) {
        // console.log(frameRate());
        tick += 1;
        background(51);
        if(showBrain)
            brain();
        tickSpan.html(tick);
        batSpan.html(highScore);
        genSpan.html(generations);
        fitSpan.html(averageFitness);
        if(showGraph)
            graph();
    
        if(tick % (300 - min(maxDiff,pipesSpawned)) == 0){
            // console.log("A",min(80,pipesSpawned));
            // console.log(pipesSpawned);
            // let w = random(200,400);
            let w = 200;
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
                if(tempbestPlayer != bestPlayer)
                    calculateBrain();
                bestPlayer = tempbestPlayer;
                bestBrain = JSON.parse(bestPlayer.brain.serialize());
            }else{
                tempHighScore = bestPlayer.score;
                if (tempHighScore > highScore) {
                    highScore = tempHighScore;
                }
            }
        }
    }
}
