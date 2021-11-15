import Phaser from "phaser";
import { MenuScene } from "./scenes/MenuScene";
import { PauseScene } from "./scenes/PauseScene";
import { PlayScene } from "./scenes/PlayScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { ScoreScene } from "./scenes/ScoreScene";

const WIDTH = 800;
const HEIGHT = 600;
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

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
