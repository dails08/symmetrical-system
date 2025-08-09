import { Scene } from "phaser";
import { OverlayScene } from "../scenes/overlay";



export function playSwapAnimation(scene: OverlayScene, actor: string, action: string, oldValue: number, newValue: number){
        
    const leftArrow = scene.add.sprite(0, scene.center_height, "tacticianTriangle");
    // leftArrow.setSize(scene.width / 3, scene.height / 2);
    console.log("leftArrow size", leftArrow.displayWidth, leftArrow.displayHeight);
    console.log("leftArrow position", leftArrow.x, leftArrow.y);
    leftArrow.setDisplaySize(scene.width / 3, scene.height * 2/3);
    console.log("leftArrow size", leftArrow.displayWidth, leftArrow.displayHeight);
    console.log("leftArrow position", leftArrow.x, leftArrow.y);
    leftArrow.setOrigin(1, .5);
    leftArrow.angle = 0;
    leftArrow.setPosition(0, scene.height * 13/30);

    const rightArrow = scene.add.sprite(scene.width, scene.center_height, "tacticianTriangle");
    // rightArrow.setSize(scene.width / 3, scene.height / 2);
    rightArrow.setDisplaySize(scene.width / 3, scene.height * 2/3);
    rightArrow.setOrigin(1, .5);
    rightArrow.angle = 180;
    // rightArrow.
    rightArrow.setPosition(scene.width, scene.height * 17/30);

    const centerCircle = scene.add.sprite(scene.center_width, scene.center_height, "tacticianCircle");
    centerCircle.setAlpha(0);
    centerCircle.setScale(2);
    // centerCircle.setDisplaySize(scene.width / 5, scene.height / 5);

    const exchangeArrows = scene.add.sprite(0,0, "exchangeArrows");
    exchangeArrows.setAlpha(0);
    exchangeArrows.setPosition(scene.center_width, scene.center_height);
    exchangeArrows.setDisplaySize(scene.width / 6, scene.height / 6);

    const littlePinkDot = scene.add.sprite(rightArrow.x, rightArrow.y,"littlePinkDot");
    // littlePinkDot.setOrigin(0,0);
    console.log("center dims", scene.center_width, scene.center_height);
    console.log("lpd position", littlePinkDot.x, littlePinkDot.y);
    
    // littlePinkDot.setOrigin(.5,.5);


    // const arrowBox = scene.add.graphics();
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


    scene.tweens.chain({
        targets: leftArrow,
        tweens: [
            {
                x: {
                    from: 0,
                    to: scene.width * 55/100,
                    ease: "Cubic.inOut",
                    duration: 1000
                },
                // callbackScope: scene,
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
                // callbackScope: scene,
            },
            {
                x: leftArrow.displayWidth + scene.width,
                duration: 1000,
                ease: "Cubic.inOut",
                onComplete: () => {
                    console.log("done with leftArrow");
                    leftArrow.destroy();
                }

            }

        ]
    }).play();

    scene.tweens.chain({
        targets: rightArrow,
        tweens: [
            {
                x: {
                    from: scene.width,
                    to: scene.width * 45/100,
                    ease: "Cubic.inOut",
                    duration: 1000,
                },
            },
            {
                x: "-=100",
                duration: 4000,
                callbackScope: scene,
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
    scene.tweens.chain({
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
    scene.tweens.chain({
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