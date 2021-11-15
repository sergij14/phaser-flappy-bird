import Phaser from "phaser";
import { BaseScene } from "./BaseScene";

export class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);
    this.config = config;

    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
      { scene: null, text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const { textObj } = menuItem;
    textObj.setInteractive();

    textObj.on("pointerover", () => {
      textObj.setStyle({ fill: "#ff0" });
    });
    textObj.on("pointerout", () => {
      textObj.setStyle({ fill: "#f7f7f7" });
    });

    textObj.on("pointerup", () => {
      console.log(menuItem);
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}
