import Phaser from "phaser";

const PIPES_NUM = 4;

export class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
    this.bird = null;
    this.pipes = null;
    this.pipeHorizontalDistance = 0;
    this.pipeVerticalDistaneRange = [150, 250];
    this.pipeHorizontalDistanceRange = [400, 500];
    this.flapVelocity = 200;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");

    this.load.image("pipe", "assets/pipe.png");
  }
  create() {
    this.add.image(0, 0, "sky").setOrigin(0);

    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = 400;

    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_NUM; i++) {
      const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);

    const spaceKey = this.input.keyboard.addKey("SPACE");
    this.input.on("pointerdown", this.flap, this);
    spaceKey.on("down", this.flap, this);
  }
  update() {
    if (
      this.bird.y >= this.config.height - this.bird.height ||
      this.bird.y <= 0
    )
      this.restartPlayerPosition();

    this.recyclePipes();
  }

  placePipe(uPipe, lPipe) {
    const rightMostX = this.getRightMostRight();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...this.pipeVerticalDistaneRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  flap() {
    console.log("sdgds");
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      console.log(pipe);
      if (pipe.getBounds().right < 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
        }
      }
    });
  }

  getRightMostRight() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  restartPlayerPosition() {
    this.bird.y = this.config.startPosition.y;
    this.bird.x = this.config.startPosition.x;
    this.bird.body.velocity.y = 0;
  }
}
