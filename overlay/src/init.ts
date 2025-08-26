import Phaser from "phaser";
import { OverlayScene } from "../scenes/overlay";
import { PreloadScene } from "../scenes/preload";
import { initDDDice } from "./dddice";

const config: Phaser.Types.Core.GameConfig = {
    width: 2560,
    height: 1440,
    transparent: true,
    fps: {
        min: 60
    },
    scale: {
        mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: "game-container",
    scene: [PreloadScene,OverlayScene]
}

const TheGame = new Phaser.Game(config);
// var dddice = initDDDice();