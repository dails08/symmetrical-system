import { Scene } from "phaser";
import { initDDDice } from "../src/dddice";


export class PreloadScene extends Scene {

    constructor(){
        super({key: "preload"});
    }

    create(){
        var dddice = initDDDice();
        this.scene.start("overlay", dddice);
    }

}