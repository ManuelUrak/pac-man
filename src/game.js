/* File for the core game functionalities */

import TileMap from "./tilemap.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const tileMap = new TileMap(tileSize);
const velocity = 2;
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

// Game loop

function gameLoop() {
  tileMap.draw(ctx);
  pacman.draw(ctx);
  enemies.forEach((enemy) => enemy.draw(ctx, pause()));
}

// Make the Ghosts not move before Pacman does

function pause() {
  return !pacman.madeFirstMove;
}

// Define the canvas size

tileMap.setCanvasSize(canvas);

// Run the game at 75fps

setInterval(gameLoop, 1000 / 75);
