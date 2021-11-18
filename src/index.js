import Phaser from "phaser";
import { MenuScene } from "./scenes/MenuScene";
import { PauseScene } from "./scenes/PauseScene";
import { PlayScene } from "./scenes/PlayScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { ScoreScene } from "./scenes/ScoreScene";

let game;
const WIDTH = 480;
const HEIGHT = 640;
const BIRD_POSITION = {
  x: WIDTH * 0.1,
  y: HEIGHT / 2,
};

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
  scale: {
    autoCenter: Phaser.Scale.CENTER,
  },
};

const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG));

const resizeGame = () => {
  const canvas = document.querySelector("canvas");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / gameRatio + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
}


window.onload = function () {
  const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    backgroundColor: "#00bfff",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
      },
    },
    scene: initScenes(),
  };
  game = new Phaser.Game(config);
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
};
