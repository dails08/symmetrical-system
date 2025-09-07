import { Scene } from "phaser";
import { initDDDice } from "../src/dddice";
import { loadArcanistContent } from "../playbooks/arcanist";
import { loadGunslingerContent } from "../playbooks/gunslinger";
import { loadTacticianContent } from "../playbooks/tactician";


export class PreloadScene extends Scene {

    constructor(){
        super({key: "preload"});
    }

    preload(){


    }

    create(){
        var dddice = initDDDice();
        this.scene.start("overlay", dddice);
    }

}