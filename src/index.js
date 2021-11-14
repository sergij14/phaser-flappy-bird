import Phaser from "phaser";

let bird = null;

const VELOCITY = 400;
const flapVelocity = 250;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        y: VELOCITY,
      },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);

  bird = this.physics.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0);

  const spaceKey = this.input.keyboard.addKey("SPACE");
  this.input.on("pointerdown", flap);
  spaceKey.on("down", flap);
  console.log(bird);
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function restartPlayerPosition() {
  bird.y = config.height / 2;
  bird.x = config.width * 0.1;
  bird.body.velocity.y = 0;
}

function update(time, delta) {
  if (bird.y >= config.height - bird.height || bird.y <= 0)
    restartPlayerPosition();
}

new Phaser.Game(config);
