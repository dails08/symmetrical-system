import { Scene } from "phaser";
import { room } from "../src/colyseus";
import { EMessageTypes, IBaseMsg, IPlayAnimationMsg } from "../../common/messageFormat";
import { loadTacticianContent } from "../playbooks/tactician";
import { loadGunslingerContent } from "../playbooks/gunslinger";
import { DiceEvent, IApiResponse, IRoll, ThreeDDice, ThreeDDiceRollEvent } from "dddice-js";
import { createArcanistContent, loadArcanistContent } from "../playbooks/arcanist";

export class OverlayScene extends Scene {

    dddice!: ThreeDDice;


    width!: number;
    height!: number;
    center_width!: number;
    center_height!: number;

    // SPACE: Phaser.Types.Input.Keyboard.CursorKeys
    SPACE!: Phaser.Input.Keyboard.Key;

    cc!: ComboCounter;

    setAnimations!: Map<string, Phaser.GameObjects.Video>;

    // testAnim: Phaser.Animations.Animation;

    // tactician variables
    solidArrow!: Phaser.GameObjects.Sprite;
    exchangeArrows!: Phaser.GameObjects.Sprite;

    playSpellAnimation(spellName: string){
        console.log("Casting " + spellName);
        // const spellAnimationVideo = this.add.video(this.center_width, this.center_height, spellName);
        // spellAnimationVideo.play()
        // spellAnimationVideo.on("complete", () => { spellAnimationVideo.destroy()});
        // spellAnimationVideo.play();
        const spellVideo = this.setAnimations.get(spellName);
        if (spellVideo){
            console.log("Found spell!");
            console.log(spellVideo);
            spellVideo.once("complete", () => { spellVideo.setVisible(false)});
            spellVideo.setVisible(true);
            spellVideo.play()
            
        } else {
            console.log("No spell found!");
            console.log("In set:");
            for (const key of this.setAnimations.keys()){
                console.log(key);
            }
        }
    }


    constructor(){
        super({key: "overlay"})
    }

    init(diceClient: ThreeDDice){
        this.dddice = diceClient;
        console.log(this.dddice.apiKey);
        console.log("overlay init fn");

    }

    preload(){
        this.width = this.sys.game.config.width as number;
        this.height = this.sys.game.config.height as number;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        // demarcate background
        // const backgroundShade = this.add.graphics();
        // backgroundShade.fillStyle(0x000000, 1);
        // backgroundShade.fillRect(0,0,this.width, this.height);


        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(this.width / 3, this.height * .6, this.width / 3, 50);

        const filenameText = this.add.text(300, 300, "Loading", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        filenameText.setFontSize(30);
        filenameText.setColor("0xFFFFFF");
        const percentText = this.add.text(300, 600, "Loading", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        percentText.setFontSize(30);
        percentText.setFill("0xFFFFFF");

        this.load.on("progress", (val: number) => {
            console.log((100 * val).toLocaleString(undefined, { maximumFractionDigits: 1}) + "%");
            progressBar.clear();
            progressBar.fillStyle(0xFFFFFF, 1);
            progressBar.fillRect(this.width / 3 + 10, this.height * .6 + 10, (this.width / 3 - 20) * val, 30);
            percentText.setText(100 * val + "%");
        });
        this.load.on("fileprogress", (file: any) => {
            filenameText.setText(file.key);
            // console.log(filename);

        });
        this.load.on("complete", () => {
            console.log("Loading complete!");
            progressBar.destroy();
            progressBox.destroy();
            filenameText.destroy();
            percentText.destroy();
        });

        this.load.bitmapFont("angel-red","assets/fonts/bmfs/Angel-red/Angel-red.png", "assets/fonts/bmfs/Angel-red/Angel-red.xml");
       


        loadTacticianContent(this);
        loadGunslingerContent(this);
        loadArcanistContent(this);

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
        // this.width = this.sys.game.config.width as number;
        // this.height = this.sys.game.config.height as number;
        // this.center_width = this.width / 2;
        // this.center_height = this.height / 2;

        this.sound.pauseOnBlur = false;

        // // demarcate background
        // const backgroundShade = this.add.graphics();
        // backgroundShade.fillStyle(0x000000, 1);
        // backgroundShade.fillRect(0,0,this.width, this.height);

        this.setAnimations = new Map<string, Phaser.GameObjects.Video>();



        createArcanistContent(this);


        // colyseus triggers

        // room.onMessage(EMessageTypes.playRollSwap, (msg: IPlayRollSwapMsg) => {
        //     playSwapAnimation(this, msg.actor, msg.action, msg.oldValue, msg.newValue);
        // })

        // room.onMessage(EMessageTypes.playGunshotAnimation, (msg: IPlayGunshotAnimationMsg) => {
        //     // console.log(msg);
        //     this.dddice.on(ThreeDDiceRollEvent.RollFinished,() => {
        //         playGunshotsAnimation(this, msg.shots);
        //         this.dddice.off(ThreeDDiceRollEvent.RollFinished);
        //     })
            
        // })





        if (this.input.keyboard){
            this.SPACE = this.input.keyboard?.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            )    
        }


        this.SPACE.addListener("down", () => {
            console.log("Casting spell");
            this.playSpellAnimation("soul-siphon");
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
    // parentScene: Phaser.Scene;

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