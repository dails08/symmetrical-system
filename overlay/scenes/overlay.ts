import { Scene } from "phaser";
import { room } from "../src/colyseus";
import { EMessageTypes, IBaseMsg, IPlayAnimationMsg } from "../../common/messageFormat";

export class OverlayScene extends Scene {


    width: number;
    height: number;
    center_width: number;
    center_height: number;

    // SPACE: Phaser.Types.Input.Keyboard.CursorKeys
    SPACE: Phaser.Input.Keyboard.Key;

    cc: ComboCounter;

    testAnim: Phaser.Animations.Animation;


    constructor(){
        super({key: "overlay"})
    }

    preload(){
        this.load.bitmapFont("angel-red","assets/fonts/Angel-red/Angel-red.png", "assets/fonts/Angel-red/Angel-red.xml");
        // this.load.spritesheet("testAnim", "assets/spritesheets/test2.png", {
        //     frameWidth: 500,
        //     frameHeight: 500
        // });
        // this.load.spritesheet("testAnim2", "assets/spritesheets/explosion 4.png", {
        //     frameWidth: 500,
        //     frameHeight: 500
        // });
        // this.load.spritesheet("coin", "assets/spritesheets/coin.png", {
        //     frameWidth: 32,
        //     frameHeight: 32,
        //   });
        //   this.load.spritesheet("altTest", "https://storage.googleapis.com/slayers-media/spritesheets/soulSiphon2.png", {
        //     frameWidth: 700,
        //     frameHeight: 600,
        //   });

          for(let i = 0; i < 121; i++){
            this.load.image("soulSiphon" + i, "https://storage.googleapis.com/slayers-media/spritesheets/soulSiphon1/soulSiphon2." + i + ".png");
          }
      

    }

    create(){
        this.width = this.sys.game.config.width as number;
        this.height = this.sys.game.config.height as number;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        if (this.input.keyboard){
            this.SPACE = this.input.keyboard?.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            )    
        }


        // this.add.bitmapText(this.center_width, this.center_height, "angel-red", "x", 150);
        // this.add.bitmapText(this.center_width + 100, this.center_height - 50, "angel-red", "2!", 250);
        this.cc = new ComboCounter(this, this.center_width, this.center_height);
        this.add.existing(this.cc);
        // this.SPACE.addListener("down", this.cc.incrementCombo, this.cc);

        const testAnimSprite = this.add.sprite(this.center_width, this.center_height, "testAnimSprite");
        testAnimSprite.setVisible(false);
        testAnimSprite.setScale(3, 3);
        const soulSiphonFrames: Phaser.Types.Animations.AnimationFrame[] = [];

        for (let i = 0; i < 121; i++){
            soulSiphonFrames.push({
                key: "soulSiphon" + i
            })
        }
        
        testAnimSprite.anims.create({
                key: "soulSiphon1",
                frames: soulSiphonFrames,
                duration: 2000,
                hideOnComplete: true,
                repeat: 0,
                showOnStart: true
        })

        this.SPACE.addListener("down", () => {testAnimSprite.play("soulSiphon1")});
        room.onMessage(EMessageTypes.playAnimation, (msg: IPlayAnimationMsg) => {
            testAnimSprite.play("soulSiphon1");
        })

        


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