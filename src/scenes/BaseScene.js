import Phaser from "phaser";

export class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 34;
    this.lineHeight = 50;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#f7f7f7" };
  }

  create() {
    if (this.config.canGoBack) {
      const backBtn = this.add
        .image(this.config.width - 40, this.config.height - 40, "back")
        .setScale(2)
        .setInteractive();
      backBtn.on("pointerdown", () => this.scene.start("MenuScene"));
    }
  }

  createMenu(menu, setupMenuEvents) {
    menu.forEach((menuItem, index) => {
      const plus = this.lineHeight * index + 1;
      const menuPosition = [...this.screenCenter];
      menuItem.textObj = this.add
        .text(
          menuPosition[0],
          menuPosition[1] + plus,
          menuItem.text,
          this.fontOptions
        )
        .setOrigin(0.5, 1);
      setupMenuEvents(menuItem);
    });
  }
}
