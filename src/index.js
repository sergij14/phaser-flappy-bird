import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let bird = null;
let upperPipe = null;
let lowerPipe = null;
const pipeVerticalDistaneRange = [150, 250];
let pipeHorizontalDistance = 0;

const PIPES_NUM = 4;
const flapVelocity = 200;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");

  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);

  bird = this.physics.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0);
  bird.body.gravity.y = 200;

  for (let i = 0; i < PIPES_NUM; i++) {
    pipeHorizontalDistance += 400;
    let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistaneRange);
    let pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      config.height - 20 - pipeVerticalDistance
    );
    upperPipe = this.physics.add
      .sprite(pipeHorizontalDistance, pipeVerticalPosition, "pipe")
      .setOrigin(0, 1);
    lowerPipe = this.physics.add
      .sprite(
        pipeHorizontalDistance,
        upperPipe.y + pipeVerticalDistance,
        "pipe"
      )
      .setOrigin(0, 0);
    upperPipe.body.velocity.x = -200;
    lowerPipe.body.velocity.x = -200;
  }

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
