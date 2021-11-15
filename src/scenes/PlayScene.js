import Phaser from "phaser";
import { BaseScene } from "./BaseScene";

const PIPES_NUM = 4;

export class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.bird = null;
    this.pipes = null;

    this.pipeHorizontalDistance = 0;
    this.pipeVerticalDistaneRange = [150, 250];
    this.pipeHorizontalDistanceRange = [400, 500];
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = "";
    this.bestScore = +localStorage.getItem("bestScore") || 0;
  }

  create() {
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createPause();
    this.createScore();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_NUM; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(
      16,
      16,
      `Score: ${this.score} | Best: ${this.bestScore}`,
      {
        fontSize: "32px",
        fill: "#000000",
      }
    );
  }

  createPause() {
    const pauseBtn = this.add
      .image(this.config.width - 50, this.config.height - 50, "pause")
      .setOrigin(0)
      .setScale(2)
      .setInteractive();
    pauseBtn.on("pointerdown", () => {
      console.log("dfgfd");
      this.physics.pause();
      this.scene.pause();
    });
  }

  handleInputs() {
    const spaceKey = this.input.keyboard.addKey("SPACE");
    this.input.on("pointerdown", this.flap, this);
    spaceKey.on("down", this.flap, this);
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
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
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

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score} | Best: ${this.bestScore}`);
  }

  gameOver() {
    // this.bird.y = this.config.startPosition.y;
    // this.bird.x = this.config.startPosition.x;
    // this.bird.body.velocity.y = 0;
    this.physics.pause();
    this.bird.setTint(0xee4844);

    const bestScoreString = localStorage.getItem("bestScore");
    const bestScore = bestScoreString ? +bestScoreString : 0;

    if (!bestScoreString || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
      this.bestScore = +localStorage.getItem("bestScore");
    }

    this.time.addEvent({
      delay: 1000,
      callback: () => this.scene.restart(),
      loop: false,
    });
  }
}
