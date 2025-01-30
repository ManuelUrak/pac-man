/* File for the core game functionalities */

import TileMap from "./tilemap.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const tileMap = new TileMap(tileSize);
const velocity = 2;
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");

let gameOver = false;
let gameWin = false;

// Game loop

function gameLoop() {
  tileMap.draw(ctx);
  pacman.draw(ctx, pause());
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
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

// Defining game over

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

// Make the Ghosts not move before Pacman does and stop the game when it is game over

function pause() {
  return !pacman.madeFirstMove || gameOver;
}

// Define the canvas size

tileMap.setCanvasSize(canvas);

// Run the game at 75fps

setInterval(gameLoop, 1000 / 75);
