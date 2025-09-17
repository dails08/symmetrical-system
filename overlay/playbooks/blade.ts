import { Scene } from "phaser";
import { OverlayScene } from "../scenes/overlay";
import { room } from "../src/colyseus";
import { ThreeDDiceRollEvent } from "dddice-js";
import { EMessageTypes, IOverlayUpdateComboMsg, IPlayGunshotAnimationMsg } from "../../common/messageFormat";


export function loadBladeContent(scene: OverlayScene){

    // scene.load.image("tarRune", "assets/images/tar.svg");

    // scene.load.audio("gunshot1", "assets/audio/pistolShot1.mp3");

    scene.load.bitmapFont("angel-red","assets/fonts/bmfs/Angel-red/Angel-red.png", "assets/fonts/bmfs/Angel-red/Angel-red.xml");



    
    

}

export function createBladeContent(scene: OverlayScene){

    const cc: ComboCounter = new ComboCounter(scene, 100,100);
    scene.add.existing(cc);

    room.onMessage(EMessageTypes.updateCombo, (msg: IOverlayUpdateComboMsg) => {
        // console.log(msg);
        setTimeout(() => {
            cc.incrementCombo()
        }, 1000);
    })
    
}



class ComboCounter extends Phaser.GameObjects.Container {
    
    comboNumber: number;
    comboText: Phaser.GameObjects.BitmapText;
    comboPrefix: Phaser.GameObjects.BitmapText;
    fontName: string;
    pulseTween: Phaser.Tweens.Tween | undefined;
    parentScene: Phaser.Scene;

    constructor(scene: OverlayScene, x: number, y: number){
        super(scene, x, y, []);
        // this.parentScene = scene;
        // this.scene.add.existing(this);
        this.width = 250;
        this.height = 250;

        this.comboNumber = 0;
        this.fontName = "angel-red";
        this.comboPrefix = this.scene.add.bitmapText(0, 0, this.fontName, "x", 150);
        this.add(this.comboPrefix);
        this.comboText = this.scene.add.bitmapText(0 + 100, 0 - 50, this.fontName, this.comboNumber.toString(), 250);
        this.add(this.comboText)
    }

    incrementCombo(){
        if (this.pulseTween){
            this.pulseTween.stop();
            this.scale = 1;
        }
        this.comboNumber += 1;
        // console.log(this.comboNumber);
        // console.log(this.comboNumber.toString());
        this.comboText.setText(this.comboNumber.toString() + "!");
        // this.scale = 2;
        // this.comboText = this.parentScene.add.bitmapText(this.x + 100, this.y - 50, this.fontName, this.comboNumber.toString(), 250);
        this.pulseTween = this.scene.tweens.add({
            targets: this,
            scale: 1.1,
            ease: "linear",
            duration: 50,
            yoyo: true,
            repeat: false,
            onStart: () => {console.log("Starting")},
            onComplete: () => {console.log("Finishing")}
        },)

    }



}
