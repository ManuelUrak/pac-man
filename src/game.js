/* File for the core game functionalities */

import TileMap from "./tilemap.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const tileMap = new TileMap(tileSize);

// Game loop

function gameLoop() {
  tileMap.draw();
}

// Run the game at 75fps

setInterval(gameLoop, 1000 / 75);
