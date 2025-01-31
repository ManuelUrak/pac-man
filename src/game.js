import TileMap from "./tilemap.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 32;
let tileMap = new TileMap(tileSize);
const velocity = 2;
let pacman = tileMap.getPacman(velocity);
pacman.onDotEaten = onDotEaten;
pacman.onPowerDotEaten = onPowerDotEaten;
pacman.onGhostEaten = onGhostEaten;
let enemies = tileMap.getEnemies(velocity);

const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");

let gameOver = false;
let gameWin = false;

let score = 0;

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

// Game loop

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
  updateScoreDisplay();
  updateLevelDisplay();
}

// Update the score display

function updateScoreDisplay() {
  scoreElement.textContent = `Score: ${score}`;
}

// Update the level display

function updateLevelDisplay() {
  levelElement.textContent = `Level: ${tileMap.currentLevel + 1}`;
}

// Check if the game is won

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();

    if (gameWin) {
      gameWinSound.play();
    }
  }
}

// Check if the game is over

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();

    if (gameOver) {
      gameOverSound.play();
    }
  }
}

// Display text when the game is won or over

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = gameWin ? "Level Clear!" : "Game Over!";
    let subText = "";

    if (gameWin) {
      if (tileMap.currentLevel === tileMap.maps.length - 1) {
        text = "Congratulations!";
        subText = "You've cleared all levels. Press Space to restart.";
      } else {
        subText = "Press Space to Proceed";
      }
    } else if (gameOver) {
      subText = "Press Space to Restart";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 120);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "80px comic sans";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "30px comic sans";
    ctx.fillStyle = "white";
    ctx.fillText(subText, canvas.width / 2, canvas.height / 2 + 40);
  }
}

// Define game over

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

// Pause the game if it's over or won

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

// Attach scoring callbacks to Pac-Man

function attachScoringCallbacks() {
  pacman.onDotEaten = onDotEaten;
  pacman.onPowerDotEaten = onPowerDotEaten;
  pacman.onGhostEaten = onGhostEaten;
}

// Reset the game state

function resetGame() {
  tileMap = new TileMap(tileSize);
  pacman = tileMap.getPacman(velocity);
  enemies = tileMap.getEnemies(velocity);
  gameOver = false;
  gameWin = false;
  score = 0;
  attachScoringCallbacks();
}

// Progress to the next level

function nextLevel() {
  tileMap.loadNextLevel();
  pacman = tileMap.getPacman(velocity);
  enemies = tileMap.getEnemies(velocity);
  gameOver = false;
  gameWin = false;

  if (tileMap.currentLevel === 0) {
    score = 0;
  }

  attachScoringCallbacks();
}

// Listen for spacebar to restart or progress to the next level

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    if (gameOver) {
      resetGame();
    } else if (gameWin) {
      nextLevel();
    }
  }
});

// Update the score when Pac-Man eats a dot

function onDotEaten() {
  score += 10;
  updateScoreDisplay();
}

// Update the score when Pac-Man eats a power dot

function onPowerDotEaten() {
  score += 50;
  updateScoreDisplay();
}

// Update the score when Pac-Man eats a Ghost

function onGhostEaten() {
  score += 100;
  updateScoreDisplay();
}

// Attach scoring callbacks to Pac-Man

attachScoringCallbacks();

// Set canvas size

tileMap.setCanvasSize(canvas);

// Run the game at 75fps

setInterval(gameLoop, 1000 / 75);
