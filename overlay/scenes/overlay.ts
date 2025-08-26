import { Scene } from "phaser";
import { room } from "../src/colyseus";
import { EMessageTypes, IBaseMsg, IPlayAnimationMsg, IPlayGunshotAnimationMsg, IPlayRollSwapMsg } from "../../common/messageFormat";
import { loadTacticianContent, playSwapAnimation } from "../playbooks/tactician";
import { loadGunslingerContent, playGunshotsAnimation } from "../playbooks/gunslinger";
import { DiceEvent, IApiResponse, IRoll, ThreeDDiceRollEvent } from "dddice-js";
export class OverlayScene extends Scene {


    width: number;
    height: number;
    center_width: number;
    center_height: number;

    // SPACE: Phaser.Types.Input.Keyboard.CursorKeys
    SPACE: Phaser.Input.Keyboard.Key;

    cc: ComboCounter;

    // testAnim: Phaser.Animations.Animation;

    // tactician variables
    solidArrow: Phaser.GameObjects.Sprite;
    exchangeArrows: Phaser.GameObjects.Sprite;



    constructor(){
        super({key: "overlay"})
    }

    preload(){
        this.load.bitmapFont("angel-red","assets/fonts/bmfs/Angel-red/Angel-red.png", "assets/fonts/bmfs/Angel-red/Angel-red.xml");
       


        loadTacticianContent(this);
        loadGunslingerContent(this);

        // for visual debugging

        this.add.graphics()
        // .fillStyle(0x111111, 0.5)
        // .fillRect(0,0, 50, 50)
        .fillStyle(0xFFC0CB)
        .fillCircle(25,25,25)
        .generateTexture("littlePinkDot", 50, 50)
        .destroy();





      

    }

    create(){
        this.width = this.sys.game.config.width as number;
        this.height = this.sys.game.config.height as number;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        // colyseus triggers

        room.onMessage(EMessageTypes.playRollSwap, (msg: IPlayRollSwapMsg) => {
            playSwapAnimation(this, msg.actor, msg.action, msg.oldValue, msg.newValue);
        })

        room.onMessage(EMessageTypes.playGunshotAnimation, (msg: IPlayGunshotAnimationMsg) => {
            console.log(msg);
            playGunshotsAnimation(this, msg.shots);
        })

        // demarcate background
        const backgroundShade = this.add.graphics();
        backgroundShade.fillStyle(0x000000, 1);
        backgroundShade.fillRect(0,0,this.width, this.height);




        if (this.input.keyboard){
            this.SPACE = this.input.keyboard?.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            )    
        }



        

        


    }

    update(){

    }


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

        this.comboNumber = 2;
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