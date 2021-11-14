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
    const upperPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  const spaceKey = this.input.keyboard.addKey("SPACE");
  this.input.on("pointerdown", flap);
  spaceKey.on("down", flap);
  console.log(bird);
}

function update(time, delta) {
  if (bird.y >= config.height - bird.height || bird.y <= 0)
    restartPlayerPosition();
}

function placePipe(uPipe, lPipe) {
  pipeHorizontalDistance += 400;
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistaneRange);
  let pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - pipeVerticalDistance
  );

  uPipe.x = pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;

  uPipe.body.velocity.x = -200;
  lPipe.body.velocity.x = -200;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function restartPlayerPosition() {
  bird.y = config.height / 2;
  bird.x = config.width * 0.1;
  bird.body.velocity.y = 0;
}

new Phaser.Game(config);
