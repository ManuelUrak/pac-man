/* File for defining Pac-Mans behaviour, drawing Pac-Man and animating Pac-Man*/

import MovingDirection from "./moving-direction.js";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  //Draw Pac-Man

  draw(ctx) {
    this.#move();
    this.#animate();
    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      this.x,
      this.y,
      this.tileSize,
      this.tileSize
    );
  }

  //Load Pac-Man assets

  #loadPacmanImages() {
    const pacmanImage1 = new Image();
    pacmanImage1.src = "../imgs/pac0.png";

    const pacmanImage2 = new Image();
    pacmanImage2.src = "../imgs/pac1.png";

    const pacmanImage3 = new Image();
    pacmanImage3.src = "../imgs/pac2.png";

    const pacmanImage4 = new Image();
    pacmanImage4.src = "../imgs/pac1.png";

    this.pacmanImages = [
      pacmanImage1,
      pacmanImage2,
      pacmanImage3,
      pacmanImage4,
    ];
    this.pacmanImageIndex = 0;
  }

  //Getting the keyboard input

  #keydown = (event) => {
    //Key up input

    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down) {
        this.currentMovingDirection = MovingDirection.up;
      } else {
        this.requestedMovingDirection = MovingDirection.up;
      }
    }

    //Key down input

    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up) {
        this.currentMovingDirection = MovingDirection.down;
      } else {
        this.requestedMovingDirection = MovingDirection.down;
      }
    }

    //Key left input

    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right) {
        this.currentMovingDirection = MovingDirection.left;
      } else {
        this.requestedMovingDirection = MovingDirection.left;
      }
    }

    //Key right input

    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left) {
        this.currentMovingDirection = MovingDirection.right;
      } else {
        this.requestedMovingDirection = MovingDirection.right;
      }
    }
  };

  //Move Pac-Man

  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        ) {
          this.currentMovingDirection = this.requestedMovingDirection;
        }
      }
    }

    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      this.pacmanAnimationTimer = null;
      this.pacmanImageIndex = 1;
      return;
    } else if (
      this.currentMovingDirection != null &&
      this.pacmanAnimationTimer == null
    ) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

    switch (this.currentMovingDirection) {
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

  //Pac-Man's mouth animation

  #animate() {
    if (this.pacmanAnimationTimer == null) {
      return;
    }

    this.pacmanAnimationTimer--;

    if (this.pacmanAnimationTimer == 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex++;

      if (this.pacmanImageIndex == this.pacmanImages.length) {
        this.pacmanImageIndex = 0;
      }
    }
  }
}
