import Phaser from "phaser";
import { BaseScene } from "./BaseScene";

export class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);
    this.config = config;
  }

  create() {
    super.create();
    this.scene.start("PlayScene");
  }
}
