/* File for defining the Ghosts behaviour and drawing them */

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadImages();
  }

  //Draw the Ghosts

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
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
