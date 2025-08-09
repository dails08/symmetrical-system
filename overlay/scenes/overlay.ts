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

    // testAnim: Phaser.Animations.Animation;

    // tactician variables
    solidArrow: Phaser.GameObjects.Sprite;
    exchangeArrows: Phaser.GameObjects.Sprite;



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

        //   for(let i = 0; i < 121; i++){
        //     this.load.image("soulSiphon" + i, "https://storage.googleapis.com/slayers-media/spritesheets/soulSiphon1/soulSiphon2." + i + ".png");
        //   }

        this.load.image("solidArrow", "assets/images/up-arrow.png");
        this.load.image("exchangeArrows", "assets/images/exchange.png");

                // tactician content
        const swapTriangleHeight = 500;
        const swapTriangleWidth= 500;

        // create the yellow tactician swap triangle
        this.add.graphics()
            // .fillStyle(0x111111, 0.5)
            // .fillRect(0,0, swapTriangleWidth, swapTriangleHeight)
            .fillStyle(0xffff00, 1)
            .fillTriangle(
                0,0,
                swapTriangleWidth, swapTriangleHeight / 2,
                0, swapTriangleHeight
            )
            .generateTexture("tacticianTriangle", swapTriangleWidth, swapTriangleHeight)
            .destroy();

        // tactician swap circle
        this.add.graphics()
            .fillStyle(0x555555)
            .fillCircle(150,150,150)
            .generateTexture("tacticianCircle", 300, 300)
            .destroy();

        // for visual debugging

        const littlePinkDot = this.add.graphics()
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

        // demarcate background
        const backgroundShade = this.add.graphics();
        backgroundShade.fillStyle(0x000000, 1);
        backgroundShade.fillRect(0,0,this.width, this.height);




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

        // const testAnimSprite = this.add.sprite(this.center_width, this.center_height, "testAnimSprite");
        // testAnimSprite.setVisible(false);
        // testAnimSprite.setScale(3, 3);
        // const soulSiphonFrames: Phaser.Types.Animations.AnimationFrame[] = [];

        // for (let i = 0; i < 121; i++){
        //     soulSiphonFrames.push({
        //         key: "soulSiphon" + i
        //     })
        // }
        
        // testAnimSprite.anims.create({
        //         key: "soulSiphon1",
        //         frames: soulSiphonFrames,
        //         duration: 2000,
        //         hideOnComplete: true,
        //         repeat: 0,
        //         showOnStart: true
        // })

        // this.SPACE.addListener("down", () => {testAnimSprite.play("soulSiphon1")});
        // room.onMessage(EMessageTypes.playAnimation, (msg: IPlayAnimationMsg) => {
        //     testAnimSprite.play("soulSiphon1");
        // })


        this.SPACE.addListener("down", () => {this.playSwapAnimation("","",0,0)}, this);

        

        


    }

    update(){

    }

    playSwapAnimation(actor: string, action: string, oldValue: number, newValue: number){
        
        const leftArrow = this.add.sprite(0, this.center_height, "tacticianTriangle");
        // leftArrow.setSize(this.width / 3, this.height / 2);
        console.log("leftArrow size", leftArrow.displayWidth, leftArrow.displayHeight);
        console.log("leftArrow position", leftArrow.x, leftArrow.y);
        leftArrow.setDisplaySize(this.width / 3, this.height * 2/3);
        console.log("leftArrow size", leftArrow.displayWidth, leftArrow.displayHeight);
        console.log("leftArrow position", leftArrow.x, leftArrow.y);
        leftArrow.setOrigin(1, .5);
        leftArrow.angle = 0;
        leftArrow.setPosition(0, this.height * 13/30);

        const rightArrow = this.add.sprite(this.width, this.center_height, "tacticianTriangle");
        // rightArrow.setSize(this.width / 3, this.height / 2);
        rightArrow.setDisplaySize(this.width / 3, this.height * 2/3);
        rightArrow.setOrigin(1, .5);
        rightArrow.angle = 180;
        // rightArrow.
        rightArrow.setPosition(this.width, this.height * 17/30);

        const centerCircle = this.add.sprite(this.center_width, this.center_height, "tacticianCircle");
        centerCircle.setAlpha(0);
        centerCircle.setScale(2);
        // centerCircle.setDisplaySize(this.width / 5, this.height / 5);

        const exchangeArrows = this.add.sprite(0,0, "exchangeArrows");
        exchangeArrows.setAlpha(0);
        exchangeArrows.setPosition(this.center_width, this.center_height);
        exchangeArrows.setDisplaySize(this.width / 6, this.height / 6);

        const littlePinkDot = this.add.sprite(rightArrow.x, rightArrow.y,"littlePinkDot");
        // littlePinkDot.setOrigin(0,0);
        console.log("center dims", this.center_width, this.center_height);
        console.log("lpd position", littlePinkDot.x, littlePinkDot.y);
        
        // littlePinkDot.setOrigin(.5,.5);


        // const arrowBox = this.add.graphics();
        // arrowBox.lineStyle(40, 0xFFC0CB);
        // // arrowBox.strokePoints([
        // //     leftArrow.x - leftArrow.width / 2, leftArrow.x + leftArrow.width / 2,
        // //     leftArrow.y - leftArrow.height / 2, leftArrow.y + leftArrow.height / 2
        // // ]);
        // arrowBox.strokePoints([
        //     [0,0],
        //     [leftArrow.width, 0],
        //     [leftArrow.width, leftArrow.height],
        //     [0, leftArrow.height]
        // ]);
        // console.log(arrowBox.x);
        // arrowBox.copyPosition(leftArrow);


        this.tweens.chain({
            targets: leftArrow,
            tweens: [
                {
                    x: {
                        from: 0,
                        to: this.width * 55/100,
                        ease: "Cubic.inOut",
                        duration: 1000
                    },
                    // callbackScope: this,
                    // onUpdate: () => {
                    //     littlePinkDot.setPosition(leftArrow.x, leftArrow.y);
                    //     console.log("leftArrow position", leftArrow.x, leftArrow.y);
                    //     console.log("lpd position", littlePinkDot.x, littlePinkDot.y);
                    // },
                    // onComplete: () => {
                    //     console.log("Done with leftArrow");
                    //     console.log("leftArrow position", leftArrow.x, leftArrow.y);
                    //     leftArrow.destroy();
                    //     littlePinkDot.destroy();
                    // }
                },
                {
                    x: "+=100",
                    duration: 4000,
                    callbackScope: this,
                },
                {
                    x: leftArrow.displayWidth + this.width,
                    duration: 1000,
                    ease: "Cubic.inOut",
                    onComplete: () => {
                        console.log("done with leftArrow");
                        leftArrow.destroy();
                    }

                }

            ]
        }).play();

        this.tweens.chain({
            targets: rightArrow,
            tweens: [
                {
                    x: {
                        from: this.width,
                        to: this.width * 45/100,
                        ease: "Cubic.inOut",
                        duration: 1000,
                    },
                },
                {
                    x: "-=100",
                    duration: 4000,
                    callbackScope: this,
                },
                {
                    x: - rightArrow.displayWidth,
                    duration: 1000,
                    ease: "Cubic.inOut",
                    onComplete: () => {
                        console.log("done with leftArrow");
                        rightArrow.destroy();
                    }

                }

            ]
        }).play();
        this.tweens.chain({
            targets: centerCircle,
            tweens: [
                {
                    alpha: {
                        from: 0,
                        to: 1,
                        ease: "linear"
                    },
                    scale: {
                        from: 1,
                        to: 1.8,
                        ease: "cubic.out"
                    },
                    duration: 500,
                    delay: 500,
                    completeDelay: 4000,
                    onComplete: () => {
                        centerCircle.destroy();
                    }
                },
            ]
        });
        this.tweens.chain({
            targets: exchangeArrows,
            tweens: [
                {
                    scale: {
                        from: 1.5,
                        to: .7,
                        duration: 1000,
                        ease: "linear"
                    },
                    alpha: {
                        from: 0,
                        to: 1,
                        duration: 1000,
                        ease: "linear"
                    },
                    completeDelay: 2000
                },
                {
                    angle: {
                        from: 0,
                        to: 180,
                        duration: 400,
                        ease: "Cubic.inOut"
                    },
                    completeDelay: 1600,
                    onComplete: () => {
                        exchangeArrows.destroy();
                    }
                }
            ]
        })



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