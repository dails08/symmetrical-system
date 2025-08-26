import { Scene } from "phaser";
import { OverlayScene } from "../scenes/overlay";


export function loadGunslingerContent(scene: OverlayScene){
    scene.load.bitmapFont("traffic-white","assets/fonts/bmfs/BostonTraffic/BostonTraffic.png", "assets/fonts/bmfs/BostonTraffic/BostonTraffic.xml");
    scene.load.image("solidArrow", "assets/images/up-arrow.png");
    scene.load.image("exchangeArrows", "assets/images/exchange.png");

    scene.load.image("bh1", "assets/images/bh1.png");
    scene.load.image("bh2", "assets/images/bh2.png");
    scene.load.image("bh3", "assets/images/bh3.png");
    scene.load.image("bh4", "assets/images/bh4.png");

    scene.load.image("blastRune", "assets/images/blast.svg");
    scene.load.image("bleedRune", "assets/images/bleed.svg");
    scene.load.image("hollowpointRune", "assets/images/hollowpoint.svg");
    scene.load.image("seekerRune", "assets/images/seeker.svg");
    scene.load.image("snareRune", "assets/images/snare.svg");
    scene.load.image("tarRune", "assets/images/tar.svg");
    

}

export function playGunshotsAnimation(scene: OverlayScene, shots: {rune: string, hit: boolean}[]){

    const rng = new Phaser.Math.RandomDataGenerator();
    const bulletholes = ["bh1", "bh2", "bh3", "bh4"];
    let delay = 0;
    let delta = 200;
    for (const shot of shots) {
        console.log(shot);
        scene.time.delayedCall(delay, () => {
            // if (shot.hit){
                const bulletHole = bulletholes[Math.floor(Math.random()*bulletholes.length)];
                console.log(bulletHole);
                const randX = rng.between((scene.game.config.width as number) * 1/5, (scene.game.config.width as number) * 4/5);
                const randY = rng.between((scene.game.config.height as number) * 1/5, (scene.game.config.height as number) * 4/5);
                console.log([randX, randY]);
                const tmp_bh = scene.add.sprite(randX, randY, bulletHole);
                scene.time.delayedCall(2000, () => { tmp_bh.destroy()})        
            // }
        },[],scene);
        delay += delta;
    }
   
    

}