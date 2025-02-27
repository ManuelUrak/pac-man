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

    this.pacmanRotation = this.Rotation.right;

    this.wakaSound = new Audio("../sounds/waka.wav");
    this.powerDotSound = new Audio("../sounds/power_dot.wav");
    this.eatGhostSound = new Audio("../sounds/eat_ghost.wav");

    this.powerDotActive = false;
    this.powerDotAboutToExpire = false;
    this.timers = [];

    this.madeFirstMove = false;

    this.onDotEaten = null;
    this.onPowerDotEaten = null;
    this.onGhostEaten = null;

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  // Rotation object

  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  //Draw Pac-Man

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#move();
      this.#animate();
    }

    this.#eatDot();
    this.#eatPowerDot();
    this.#eatGhost(enemies);

    //Draw Pac-Man with rotation, depending on his direction

    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );
    ctx.restore();
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
    const key = event.key;

    const handleDirectionChange = (newDirection, oppositeDirection) => {
      if (this.currentMovingDirection === oppositeDirection) {
        this.currentMovingDirection = newDirection;
      } else {
        this.requestedMovingDirection = newDirection;
      }

      this.madeFirstMove = true;
    };

    switch (key) {
      case "ArrowUp":
        handleDirectionChange(MovingDirection.up, MovingDirection.down);
        break;
      case "ArrowDown":
        handleDirectionChange(MovingDirection.down, MovingDirection.up);
        break;
      case "ArrowLeft":
        handleDirectionChange(MovingDirection.left, MovingDirection.right);
        break;
      case "ArrowRight":
        handleDirectionChange(MovingDirection.right, MovingDirection.left);
        break;
    }
  };

  //Move Pac-Man

  #move() {
    const isAlignedWithGrid =
      Number.isInteger(this.x / this.tileSize) &&
      Number.isInteger(this.y / this.tileSize);

    if (
      isAlignedWithGrid &&
      this.requestedMovingDirection !== null &&
      !this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.requestedMovingDirection
      )
    ) {
      this.currentMovingDirection = this.requestedMovingDirection;
      this.requestedMovingDirection = null;
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
        this.pacmanRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.pacmanRotation = this.Rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.pacmanRotation = this.Rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.pacmanRotation = this.Rotation.right;
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

  //Play sound when Pac-Man eats a dot and update the score

  #eatDot() {
    if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
      this.wakaSound.play();

      if (this.onDotEaten) {
        this.onDotEaten();
      }
    }
  }

  //Play sound when Pac-Man eats a power dot and set power dot to active and update the score

  #eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      this.powerDotSound.play();
      this.powerDotActive = true;
      this.powerDotAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
      }, 1000 * 6);

      this.timers.push(powerDotTimer);

      let powerDotAboutToExpireTimer = setTimeout(() => {
        this.powerDotAboutToExpire = true;
      }, 1000 * 3);

      this.timers.push(powerDotAboutToExpireTimer);

      if (this.onPowerDotEaten) {
        this.onPowerDotEaten();
      }
    }
  }

  // Make Pac-Man be able to eat a ghost when the power dot is active and play a sound and update the score

  #eatGhost(enemies) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));

      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.eatGhostSound.play();

        if (this.onGhostEaten) {
          this.onGhostEaten();
        }
      });
    }
  }
}
