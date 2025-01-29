/* File for defining the Ghosts behaviour and drawing them */

import MovingDirection from "./moving-direction.js";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadImages();

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );
    this.directionTimerDefault = this.#random(1, 10);
    this.directionTimer = this.directionTimerDefault;
  }

  //Draw the Ghosts

  draw(ctx, pause) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }

    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  //Move the Ghosts

  #move() {
    if (
      !this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.movingDirection
      )
    ) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
      }
    }
  }

  // Change the Ghosts direction

  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;

    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }

    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            newMoveDirection
          )
        ) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  // Make the Ghosts change direction independent from one another at random times

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Load Ghost images

  #loadImages() {
    this.normalGhost = new Image();
    this.normalGhost.src = "../imgs/ghost.png";

    this.scaredGhost = new Image();
    this.scaredGhost.src = "../imgs/scaredGhost.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "../imgs/scaredGhost2.png";

    this.image = this.normalGhost;
  }
}
