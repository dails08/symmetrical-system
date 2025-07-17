import { Scene } from "phaser";

export class OverlayScene extends Scene {


    width: number;
    height: number;
    center_width: number;
    center_height: number;

    // SPACE: Phaser.Types.Input.Keyboard.CursorKeys
    SPACE: number | undefined;


    constructor(){
        super({key: "overlay"})
    }

    preload(){
        this.load.bitmapFont("angel-red","assets/fonts/Agel-red/Angel-red.png", "assets/fonts/Agel-red/Angel-red.xml");

    }

    create(){
        this.width = this.sys.game.config.width as number;
        this.height = this.sys.game.config.height as number;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        // this.SPACE = this.input.keyboard?.addKey(
        //     Phaser.Input.Keyboard.KeyCodes.SPACE
        // )

        this.add.bitmapText(this.center_width, this.center_height, "angel-red", "1!", 25)
    }

    update(){

    }
}