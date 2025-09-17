import { Scene } from "phaser";
import { room } from "../src/colyseus";
import { EMessageTypes, IBaseMsg, IPlayAnimationMsg } from "../../common/messageFormat";
import { loadTacticianContent } from "../playbooks/tactician";
import { loadGunslingerContent } from "../playbooks/gunslinger";
import { DiceEvent, IApiResponse, IRoll, ThreeDDice, ThreeDDiceRollEvent } from "dddice-js";
import { createArcanistContent, loadArcanistContent } from "../playbooks/arcanist";
import { createBladeContent, loadBladeContent } from "../playbooks/blade";

export class OverlayScene extends Scene {

    dddice: ThreeDDice;


    width: number;
    height: number;
    center_width: number;
    center_height: number;

    // SPACE: Phaser.Types.Input.Keyboard.CursorKeys
    SPACE: Phaser.Input.Keyboard.Key;


    setAnimations: Map<string, Phaser.GameObjects.Sprite>;

    // testAnim: Phaser.Animations.Animation;

    // tactician variables
    solidArrow: Phaser.GameObjects.Sprite;
    exchangeArrows: Phaser.GameObjects.Sprite;

    playSpellAnimation(spellName: string){
        console.log("Casting " + spellName);
        const spellSprite = this.setAnimations.get(spellName);
        if (spellSprite){
            console.log("Found spell!");
            console.log(spellSprite);
            spellSprite.play("spellAnimation")
        } else {
            console.log("No spell found!");
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
       


        loadTacticianContent(this);
        loadGunslingerContent(this);
        loadArcanistContent(this);
        loadBladeContent(this);

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

        this.sound.pauseOnBlur = false;

        // demarcate background
        const backgroundShade = this.add.graphics();
        backgroundShade.fillStyle(0x000000, 1);
        backgroundShade.fillRect(0,0,this.width, this.height);


        createArcanistContent(this);
        createBladeContent(this);

        room.onMessage(EMessageTypes.playAnimation, (msg: IPlayAnimationMsg) => {
            console.log("Received play animation message!")
            console.log("Playing " + msg.key);
            const spellSprite = this.setAnimations.get(msg.key);
            if (spellSprite){
                console.log("Found animation!");
                console.log(spellSprite);
                spellSprite.play("spellAnimation")
            } else {
                console.log("No animation found!");
            }

        
        })

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
            this.playSpellAnimation("hex");
        })
        

        


    }

    update(){

    }


}

