import { Scene } from "phaser";
import { OverlayScene } from "../scenes/overlay";
import { EMessageTypes, IPlayAnimationMsg } from "../../common/messageFormat";
import { room } from "../src/colyseus";


export function loadArcanistContent(scene: OverlayScene){

    // Hex 
    for(let i = 0; i < 120; i++){
        "https://storage.googleapis.com/slayers-media/spritesheets/hex/hex.0.png"
        scene.load.image("hex" + i, "https://storage.googleapis.com/slayers-media/spritesheets/hex/hex." + i + ".png");
    }
    



 
    
    }

export function createArcanistContent(scene: OverlayScene){

    const hexAnimationSprite = scene.add.sprite(scene.center_width, scene.center_height, "hex");
    hexAnimationSprite.setVisible(false);
    hexAnimationSprite.setScale(.5,.5);

    const hexFrames: Phaser.Types.Animations.AnimationFrame[] = [];
    for (let i = 0; i < 120; i++){
        hexFrames.push({
            key: "hex" + i
        })
    }


    hexAnimationSprite.anims.create({
        key: "spellAnimation",
        frames: hexFrames,
        duration: 3000,
        hideOnComplete: true,
        repeat: 0,
        showOnStart: true
    })


    scene.setAnimations = new Map<string, Phaser.GameObjects.Sprite>();
    scene.setAnimations.set("hex", hexAnimationSprite)

        
}


   
    