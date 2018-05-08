function resetGame() {
    tick = 0;
    // Resetting best player score to 0
    if (bestPlayer) {
        bestPlayer.score = 0;
    }
    oArray = [];
    // pArray = [];
  }
  
  // Create the next generation
  function nextGeneration() {
    resetGame();
    // Normalize the fitness values 0-1
    normalizeFitness(pArray);
    // Generate a new set of players
    paArray = generate(pArray);
    // Copy those players to another array
    pArray = paArray.slice();
  }
  
  // Generate a new population of players
  function generate(oldPlayers) {
    let newPlayers = [];
    for (let i = 0; i < oldPlayers.length; i++) {
      // Select a bird based on fitness
      let player = poolSelection(oldPlayers);
      newPlayers[i] = player;
    }
    return newPlayers;
  }
  
  // Normalize the fitness of all players
  function normalizeFitness(players) {
    // Make score exponentially better?
    for (let i = 0; i < players.length; i++) {
      players[i].score = pow(players[i].score, 2);
    }
  
    // Add up all the scores
    let sum = 0;
    for (let i = 0; i < players.length; i++) {
      sum += players[i].score;
    }
    // Divide by the sum
    for (let i = 0; i < players.length; i++) {
      players[i].fitness = players[i].score / sum;
    }
  }
  
  
// An algorithm for picking one player from an array
// based on fitness
function poolSelection(players) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= players[index].fitness;
    // And move on to the next
    index += 1;
  }
  
  // Go back one
  index -= 1;
  // console.log(players[index].fitness);
  // Make sure it's a copy!
  // (this includes mutation)
  return players[index].copy();
}