/* File for drawing the tilemap */

import Pacman from "./pacman.js";
import Enemy from "./enemy.js";
import MovingDirection from "./moving-direction.js";

export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;

    //Getting the asset for the walls

    this.wall = new Image();
    this.wall.src = "../imgs/wall.png";

    //Getting the asset for the yellow dots

    this.yellowDot = new Image();
    this.yellowDot.src = "../imgs/yellowDot.png";

    //Getting the asset for the pink dots

    this.pinkDot = new Image();
    this.pinkDot.src = "../imgs/pinkDot.png";

    this.powerDot = this.pinkDot;
    this.powerDotAnimationTimerDefault = 30;
    this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;

    /* 
    Map Legend:
    1 = wall
    0 = dots
    4 = Pac Man
    5 = empty space
    6 = enemy
    7 = power dot
    */

    //Define the map

    this.maps = [
      [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 7, 1, 0, 0, 0, 1, 0, 1, 7, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
      [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    ];

    this.currentLevel = 0;
    this.map = this.maps[this.currentLevel];
    this.map = JSON.parse(JSON.stringify(this.maps[this.currentLevel]));
  }

  // Load the next level

  loadNextLevel() {
    this.currentLevel++;
    if (this.currentLevel >= this.maps.length) {
      this.currentLevel = 0;
    }
    this.map = this.maps[this.currentLevel];
  }

  resetCurrentLevel() {
    this.map = this.maps[this.currentLevel];
  }

  //Draw the map

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];

        switch (tile) {
          case 1:
            this.#drawWall(ctx, column, row, this.tileSize);
            break;
          case 0:
            this.#drawDot(ctx, column, row, this.tileSize);
            break;
          case 7:
            this.#drawPowerDot(ctx, column, row, this.tileSize);
            break;
          default:
            this.#drawBlank(ctx, column, row, this.tileSize);
            break;
        }
      }
    }
  }

  // Draw the walls

  #drawWall(ctx, column, row, size) {
    ctx.drawImage(
      this.wall,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  // Draw empty space

  #drawBlank(ctx, column, row, size) {
    ctx.fillStyle = "black";
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }

  // Draw the dots

  #drawDot(ctx, column, row, size) {
    ctx.drawImage(
      this.yellowDot,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  // Draw the Power Dot

  #drawPowerDot(ctx, column, row, size) {
    this.powerDotAnimationTimer--;

    if (this.powerDotAnimationTimer === 0) {
      this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;

      if (this.powerDot == this.pinkDot) {
        this.powerDot = this.yellowDot;
      } else {
        this.powerDot = this.pinkDot;
      }
    }

    ctx.drawImage(this.powerDot, column * size, row * size, size, size);
  }

  // Return the sum of the dots that are currently on the map

  #dotsLeft() {
    return this.map.flat().filter((tile) => tile === 0).length;
  }

  //Return Pac-Man to the map

  getPacman(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 4) {
          this.map[row][column] = 0;

          return new Pacman(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this
          );
        }
      }
    }
  }

  // Return ghosts to the map

  getEnemies(velocity) {
    const enemies = [];

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];

        if (tile == 6) {
          this.map[row][column] = 0;

          enemies.push(
            new Enemy(
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          );
        }
      }
    }

    return enemies;
  }

  //Define the canvas size

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  // Wall collison detection

  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) {
      return;
    }

    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let column = 0;
      let row = 0;
      let nextColumn = 0;
      let nextRow = 0;

      switch (direction) {
        case MovingDirection.up:
          nextRow = y - this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
        case MovingDirection.down:
          nextRow = y + this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
        case MovingDirection.left:
          nextColumn = x - this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.right:
          nextColumn = x + this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
      }

      const tile = this.map[row][column];

      if (tile === 1) {
        return true;
      }
    } else {
      return false;
    }
  }

  // Make Pac-Man eat a dot

  eatDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;

    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === 0) {
        this.map[row][column] = 5;

        return true;
      }
    } else {
      return false;
    }
  }

  // Make Pac-Man eat a power dot

  eatPowerDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;

    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column];

      if (tile === 7) {
        this.map[row][column] = 5;

        return true;
      }
    } else {
      return false;
    }
  }

  // Define a game win

  didWin() {
    return this.#dotsLeft() === 0;
  }
}
