import Phaser from "phaser";
import { BaseScene } from "./BaseScene";

export class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config);

    this.menu = [
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit" },
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
      if (menuItem.scene && textObj.text === "Continue") {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        this.scene.stop("PlayScene");
        this.scene.start("MenuScene");
      }
    });
  }
}
