import { Scene } from "phaser";
import { OverlayScene } from "../scenes/overlay";
import { EMessageTypes, IBaseMsg, IPlayAnimationMsg } from "../../common/messageFormat";
import { room } from "../src/colyseus";
import { mediaLocations, currentMediaLocation } from "../src/hostLocation";

const spellList = [
    {
        shortName: "hex",
        duration: 1500,
        scale: 1.5,
        nFrames: 60
    },
    {
        shortName: "soul-siphon",
        duration: 2000,
        scale: 2,
        nFrames: 120
    },
    {
        shortName: "mend",
        duration: 2000,
        scale: .5,
        nFrames: 90
    },
    {
        shortName: "fear-cloud",
        duration: 2000,
        scale: 1.5,
        nFrames: 60
    },
    {
        shortName: "energy-bolt",
        duration: 1000,
        scale: 4,
        nFrames: 48
    },
    {
        shortName: "corrupting-touch",
        duration: 2000,
        scale: 2,
        nFrames: 97
    },
    {
        shortName: "corrupting-wave",
        duration: 2000,
        scale: 4,
        nFrames: 130
    },
    {
        shortName: "temporal-shift",
        duration: 2000,
        scale: 2,
        nFrames: 130
    }
    
]

export function loadArcanistContent(scene: OverlayScene){


    for (const spell of spellList){
        console.log("Loading " + spell.shortName);
        scene.load.crossOrigin = "anonymous";
        scene.load.video(spell.shortName, mediaLocations[currentMediaLocation] + "/webms/" + spell.shortName + ".webm", true);

        // for(let i = 0; i < spell.nFrames; i++){
        //     // scene.load.image(spell.shortName + i, "https://storage.googleapis.com/slayers-media/spritesheets/"+ spell.shortName + "/"+ spell.shortName + "." + i + ".png");
        //     scene.load.image(spell.shortName + i, mediaLocations[currentMediaLocation] + "/spritesheets/" + spell.shortName + "/"+ spell.shortName + "." + i + ".png");
        // }
        
        // scene.load.audio(spell.shortName + "sfx", "https://storage.googleapis.com/slayers-media/audio/sfx/" + spell.shortName);
        scene.load.audio(spell.shortName, mediaLocations[currentMediaLocation] + "/audio/sfx/" + spell.shortName + ".ogg");
    }


 
    
    }

export function createArcanistContent(scene: OverlayScene){
    for (const spell of spellList){

        const spellAnimationVideo = scene.add.video(scene.center_width, scene.center_height, spell.shortName)

        spellAnimationVideo.setVisible(false);
        spellAnimationVideo.setScale(spell.scale, spell.scale);
        scene.setAnimations.set(spell.shortName, spellAnimationVideo);


        // const spellAnimationSprite = scene.add.sprite(scene.center_width, scene.center_height, spell.shortName);
        // spellAnimationSprite.setVisible(false);
        // spellAnimationSprite.setScale(spell.scale, spell.scale);

        // const spellFrames: Phaser.Types.Animations.AnimationFrame[] = [];
        // for (let i = 0; i < spell.nFrames; i++){
        //     spellFrames.push({
        //         key: spell.shortName + i
        //     })
        // }
        // spellAnimationSprite.anims.create({
        //     key: "spellAnimation",
        //     frames: spellFrames,
        //     duration: spell.duration,
        //     hideOnComplete: true,
        //     repeat: 0,
        //     showOnStart: true
        // })    
        // scene.setAnimations.set(spell.shortName, spellAnimationSprite)

        if (scene.cache.audio.exists(spell.shortName)){
            scene.sound.add(spell.shortName);
        }
        
    }        

            room.onMessage(EMessageTypes.playAnimation, (msg: IPlayAnimationMsg) => {
            console.log("Received play animation message!")
            console.log("Playing " + msg.key);
            const spellVideo = scene.setAnimations.get(msg.key);
            if (spellVideo){
                console.log("Found spell!");
                console.log(spellVideo);
                spellVideo.setVisible(true);
                spellVideo.play()
            } else {
                console.log("No spell found!");
            }
            console.log("Looking for audio key " + msg.key);
            if (scene.sound.get(msg.key)){
                console.log("Matching audio!");
                const matchingAudio = scene.sound.play(msg.key);
            } else {
                console.log("No matching audio!");
                console.log(scene.cache.audio.getKeys());
            }

            setInterval(() => {
                const msg: IBaseMsg = {
                    kind: EMessageTypes.SaveCampaign
                };
                room.send(EMessageTypes.SaveCampaign, msg);
            }, 1000 * 60)
            

        
        })

}


   
    