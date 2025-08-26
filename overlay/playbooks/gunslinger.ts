import { Scene } from "phaser";
import { OverlayScene } from "../scenes/overlay";


export function loadGunslingerContent(scene: OverlayScene){

    scene.load.image("bh2", "assets/images/bh2.png");
    scene.load.image("bh3", "assets/images/bh3.png");
    scene.load.image("bh4", "assets/images/bh4.png");
    scene.load.image("bh5", "assets/images/bh5.png");

    scene.load.image("blastRune", "assets/images/blast.svg");
    scene.load.image("bleedRune", "assets/images/bleed.svg");
    scene.load.image("hollowpointRune", "assets/images/hollowpoint.svg");
    scene.load.image("seekerRune", "assets/images/seeker.svg");
    scene.load.image("snareRune", "assets/images/snare.svg");
    scene.load.image("tarRune", "assets/images/tar.svg");
    

}

export function playGunshotsAnimation(scene: OverlayScene, shots: {rune: string, hit: boolean}[]){

    const rng = new Phaser.Math.RandomDataGenerator();
    const bulletholes = ["bh2", "bh3", "bh4", "bh5"];
    const bhScaleMap = new Map<string, number>();
    bhScaleMap.set("bh5", 1);
    bhScaleMap.set("bh4", 1);
    let delay = 0;
    let delta = 100;
    let disappearDelay = 2000;
    for (const shot of shots){
        // console.log(x);
        scene.time.delayedCall(delay, () => {
            if (shot.hit){
                const bulletHole = bulletholes[Math.floor(Math.random()*bulletholes.length)];
                console.log(bulletHole);
                const randX = rng.between((scene.game.config.width as number) * 1/5, (scene.game.config.width as number) * 4/5);
                const randY = rng.between((scene.game.config.height as number) * 1/5, (scene.game.config.height as number) * 4/5);
                const tmp_bh = scene.add.sprite(randX, randY, bulletHole);
                tmp_bh.setScale( bhScaleMap.get(bulletHole) || 3 );
                tmp_bh.setAngle(Phaser.Math.Between(0,359));
                
                scene.time.delayedCall(disappearDelay, () => { 
                    tmp_bh.destroy();
                })        
            }
        },[],scene);
        delay += delta;
    }
   
    

}