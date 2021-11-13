import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: {
    preload,
    create,
    update,
  },
};

let bird = null;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);

  // if we want bird to have body we add it to physics obj.
  bird = this.physics.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0);
  bird.body.velocity.y = 100;
}

function update() {
  console.log(bird.body.velocity.y);
}

new Phaser.Game(config);
