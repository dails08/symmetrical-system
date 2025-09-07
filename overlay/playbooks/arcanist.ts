import { Scene } from "phaser";
import { OverlayScene } from "../scenes/overlay";
import { EMessageTypes, IPlayAnimationMsg } from "../../common/messageFormat";
import { room } from "../src/colyseus";

const spellList = [
    {
        shortName: "hex",
        duration: 3000,
        scale: .5,
        nFrames: 120
    },
    {
        shortName: "siphon",
        duration: 2000,
        scale: .5,
        nFrames: 120
    },
]

export function loadArcanistContent(scene: OverlayScene){


    for (const spell of spellList){
        for(let i = 0; i < spell.nFrames; i++){
            scene.load.image(spell.shortName + i, "https://storage.googleapis.com/slayers-media/spritesheets/"+ spell.shortName + "/"+ spell.shortName + "." + i + ".png");
        }
    }

    // // Hex 
    // for(let i = 0; i < 120; i++){
    //     scene.load.image("hex" + i, "https://storage.googleapis.com/slayers-media/spritesheets/hex/hex." + i + ".png");
    // }

    // // Siphon
    // for(let i = 0; i < 120; i++){
    //     scene.load.image("hex" + i, "https://storage.googleapis.com/slayers-media/spritesheets/siphon/siphon." + i + ".png");
    // }




 
    
    }

export function createArcanistContent(scene: OverlayScene){

    


    for (const spell of spellList){
    
        const spellAnimationSprite = scene.add.sprite(scene.center_width, scene.center_height, spell.shortName);
        spellAnimationSprite.setVisible(false);
        spellAnimationSprite.setScale(spell.scale, spell.scale);

        const spellFrames: Phaser.Types.Animations.AnimationFrame[] = [];
        for (let i = 0; i < spell.nFrames; i++){
            spellFrames.push({
                key: spell.shortName + i
            })
        }
        spellAnimationSprite.anims.create({
            key: "spellAnimation",
            frames: spellFrames,
            duration: spell.duration,
            hideOnComplete: true,
            repeat: 0,
            showOnStart: true
        })    
        scene.setAnimations.set(spell.shortName, spellAnimationSprite)
    }

    

    // Siphon
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
    scene.setAnimations.set("hex", hexAnimationSprite)

        
}


   
    