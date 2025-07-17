import Phaser from "phaser";
import { OverlayScene } from "../scenes/overlay";


const config: Phaser.Types.Core.GameConfig = {
    width: 2560,
    height: 1440,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: "game-container",
    scene: [OverlayScene]
}

const TheGame = new Phaser.Game(config);