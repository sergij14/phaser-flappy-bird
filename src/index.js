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
let pipes = null;

const pipeVerticalDistaneRange = [150, 250];
const pipeHorizontalDistanceRange = [400, 500];

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

  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_NUM; i++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }
  pipes.setVelocityX(-200);

  const spaceKey = this.input.keyboard.addKey("SPACE");
  this.input.on("pointerdown", flap);
  spaceKey.on("down", flap);
  console.log(bird);
}

//60fps
function update(time, delta) {
  if (bird.y >= config.height - bird.height || bird.y <= 0)
    restartPlayerPosition();

  recyclePipes();
}

function placePipe(uPipe, lPipe) {
  const rightMostX = getRightMostRight();
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistaneRange);
  const pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - pipeVerticalDistance
  );
  const pipeHorizontalDistance = Phaser.Math.Between(
    ...pipeHorizontalDistanceRange
  );

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach((pipe) => {
    console.log(pipe);
    if (pipe.getBounds().right < 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  });
}

function getRightMostRight() {
  let rightMostX = 0;
  pipes.getChildren().forEach((pipe) => {
    rightMostX = Math.max(pipe.x, rightMostX);
  });

  return rightMostX;
}

function restartPlayerPosition() {
  bird.y = config.height / 2;
  bird.x = config.width * 0.1;
  bird.body.velocity.y = 0;
}

new Phaser.Game(config);
