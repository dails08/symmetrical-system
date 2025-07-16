import Phaser from "phaser";


const config: Phaser.Types.Core.GameConfig = {
    width: 2560,
    height: 1440,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: "game-container",
    scene: []
}

const TheGame = new Phaser.Game(config);