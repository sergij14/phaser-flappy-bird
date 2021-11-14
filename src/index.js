import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      // gravity: {
      //   y: 200,
      // },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let bird = null;

const VELOCITY = 200;

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

  // bird.body.gravity.y = 200
  // t0 = 0px/s
  // t1 = 200px/s
  // t2 = 400px/s
  bird.body.velocity.x = VELOCITY;
  console.log(bird);
}

function update(time, delta) {
  if (bird.x >= config.width - bird.width) {
    bird.body.velocity.x = -VELOCITY;
  } else if (bird.x <= 0) {
    bird.body.velocity.x = VELOCITY;
  }
}

new Phaser.Game(config);
