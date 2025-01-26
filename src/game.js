/* File for the core game functionalities */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game loop

function gameLoop() {
  console.log("test");
}

// Run the game at 75fps

setInterval(gameLoop, 1000 / 75);
