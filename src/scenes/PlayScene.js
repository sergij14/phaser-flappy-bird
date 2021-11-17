import Phaser from "phaser";
import { BaseScene } from "./BaseScene";

const PIPES_NUM = 4;

export class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.bird = null;
    this.pipes = null;

    this.pipeHorizontalDistance = 0;
    this.flapVelocity = 300;

    this.isPaused = false;
    this.score = 0;
    this.scoreText = "";
    this.bestScore = +localStorage.getItem("bestScore") || 0;

    this.currentDifficulty = "easy";
    this.difficulties = {
      easy: {
        pipeVerticalDistaneRange: [300, 350],
        pipeHorizontalDistanceRange: [250, 280],
      },
      normal: {
        pipeVerticalDistaneRange: [280, 330],
        pipeHorizontalDistanceRange: [230, 250],
      },
      hard: {
        pipeVerticalDistaneRange: [150, 200],
        pipeHorizontalDistanceRange: [200, 220],
      },
    };
  }

  create() {
    super.create();
    this.createBird();
    this.createBirdAnim();
    this.createPipes();
    this.createColliders();
    this.createPause();
    this.createScore();
    this.handleInputs();
    this.initEvents();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  initEvents() {
    if (this.pauseEvent) {
      return;
    }
    this.pauseEvent = this.events.on("resume", () => {
      // this.scene.resume();
      // this.physics.resume();
      this.initTime = 3;
      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          `Fly In ${this.initTime} Seconds`,
          this.fontOptions
        )
        .setOrigin(0.5, 1);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initTime--;
    this.countDownText.setText(`Fly In ${this.initTime} Seconds`);
    if (this.initTime === 0) {
      this.countDownText.setText("");
      this.physics.resume();
      this.scene.resume();
      this.timedEvent.remove();
      this.isPaused = false;
    }
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
      .setScale(3)
      .setOrigin(0)
      .setFlipX(true);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createBirdAnim(){
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", {
        frames: [8, 9, 10, 11, 12, 13, 14, 15],
      }),
      frameRate: 8,
      repeat: 0
    });
    this.anims.create({
      key: "die",
      frames: this.anims.generateFrameNumbers("bird", {
        frames: [16,17,18],
      }),
      frameRate: 8,
      repeat: 0
    });
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
    this.isPaused = false;
    const pauseBtn = this.add
      .image(this.config.width - 50, this.config.height - 50, "pause")
      .setOrigin(0)
      .setScale(2)
      .setInteractive();
    pauseBtn.on("pointerdown", () => {
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
      this.isPaused = true;
    });
  }

  handleInputs() {
    const spaceKey = this.input.keyboard.addKey("SPACE");
    this.input.on("pointerdown", this.flap, this);
    spaceKey.on("down", this.flap, this);
  }

  placePipe(uPipe, lPipe) {
    const difficulties = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostRight();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulties.pipeVerticalDistaneRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulties.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  flap() {
    if (this.isPaused) {
      return;
    }
    this.bird.body.velocity.y = -this.flapVelocity;
    this.bird.play('fly');
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 2) {
      this.currentDifficulty = "normal";
    }
    if (this.score === 4) {
      this.currentDifficulty = "hard";
    }
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
    this.currentDifficulty = "easy";
    this.bird.setTint(0xee4844);
    this.bird.play('die');

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
