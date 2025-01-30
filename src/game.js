/* File for the core game functionalities */

import TileMap from "./tilemap.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 32;
let tileMap = new TileMap(tileSize);
const velocity = 2;
let pacman = tileMap.getPacman(velocity);
let enemies = tileMap.getEnemies(velocity);

const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");

let gameOver = false;
let gameWin = false;

// Game loop

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

//Check if the game is won

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();

    if (gameWin) {
      gameWinSound.play();
    }
  }
}

// Check if the game is game over

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();

    if (gameOver) {
      gameOverSound.play();
    }
  }
}

// Displaying text when the game is won or game over

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "Level Clear!";

    if (gameOver) {
      text = "Game Over!";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80);

    ctx.font = "80px comic sans";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText(text, 10, canvas.height / 2);

    ctx.font = "30px comic sans";
    ctx.fillStyle = "white";
    ctx.fillText("Press Spacebar to Restart", 50, canvas.height / 2 + 50);
  }
}

// Defining game over

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

// Reset game state when the game is game over

function resetGame() {
  tileMap = new TileMap(tileSize);
  pacman = tileMap.getPacman(velocity);
  enemies = tileMap.getEnemies(velocity);
  gameOver = false;
}

document.addEventListener("keydown", (event) => {
  if (gameOver && event.key === " ") {
    resetGame();
  }
});

// Make the Ghosts not move before Pacman does and stop the game when it is game over or the game is won

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

// Define the canvas size

tileMap.setCanvasSize(canvas);

// Run the game at 75fps

setInterval(gameLoop, 1000 / 75);
