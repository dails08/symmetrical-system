import { Scene } from "phaser";
import { OverlayScene } from "../scenes/overlay";



export function playSwapAnimation(scene: OverlayScene, actor: string, action: string, oldValue: number, newValue: number){
        
    const increase = newValue > oldValue;

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
    if (!increase) {
        exchangeArrows.toggleFlipX()
    }

    const oldVal = scene.add.bitmapText(scene.center_width, scene.center_height, "traffic-white", oldValue.toString(), 300);
    oldVal.setAlpha(0);
    oldVal.setOrigin(.5, .5);
    oldVal.setPosition(scene.center_width, scene.center_height);

    // const 

    const newVal = scene.add.bitmapText(scene.center_width, scene.center_height, "traffic-white", newValue.toString(), 300);
    newVal.setAlpha(0);
    newVal.setOrigin(.5, .5);
    newVal.angle = 0;
    newVal.setPosition(scene.center_width, scene.center_height);



    // const littlePinkDot = scene.add.sprite(rightArrow.x, rightArrow.y,"littlePinkDot");
    // littlePinkDot.setOrigin(0,0);
    // console.log("center dims", scene.center_width, scene.center_height);
    // console.log("lpd position", littlePinkDot.x, littlePinkDot.y);
    
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

    const arrowStageOneDuration = 1000;
    const arrowStateTwoDuration = 1300;
    const arrowStateThreeDuration = 1000;

    const exchangeSpinDuration = 400;

    scene.tweens.chain({
        targets: leftArrow,
        tweens: [
            {
                x: {
                    from: 0,
                    to: scene.width * 55/100,
                    ease: "Cubic.inOut",
                    duration: arrowStageOneDuration
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
                duration: arrowStateTwoDuration,
                // callbackScope: scene,
            },
            {
                x: leftArrow.displayWidth + scene.width,
                duration: arrowStateThreeDuration,
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
                    duration: arrowStageOneDuration,
                },
            },
            {
                x: "-=100",
                duration: arrowStateTwoDuration,
                callbackScope: scene,
            },
            {
                x: - rightArrow.displayWidth,
                duration: arrowStateThreeDuration,
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
                delay: arrowStageOneDuration / 2,
                duration: arrowStageOneDuration / 2,
                // completeDelay: 2100,
                completeDelay: arrowStateTwoDuration  + 100,
            },
            {
                alpha: {
                    from: 1,
                    to: 0,
                    ease: "linear",
                    duration: 200
                },
                scale: {
                    from: 1.8,
                    to: 2.5,
                    ease: "cubic.out",
                    duration: 500
                },
                // duration: 500,
                onComplete: () => {
                    centerCircle.destroy();
                }
            }
        ]
    });
    scene.tweens.chain({
        targets: exchangeArrows,
        tweens: [
            {
                scale: {
                    from: 1.5,
                    to: .9,
                    duration: 300,
                    ease: "linear"
                },
                alpha: {
                    from: 0,
                    to: 1,
                    duration: 300,
                    ease: "linear"
                },
                delay: arrowStageOneDuration
                // completeDelay: 1000
            },
            {
                angle: {
                    from: 0,
                    to: increase? 270 : -270,
                    duration: exchangeSpinDuration,
                    ease: "Cubic.inOut"
                },
                completeDelay: 600,
            },
            {
                scale: {
                    from: .9,
                    to: 1.5,
                    duration: 300,
                    ease: "linear"
                },
                alpha: {
                    from: 1,
                    to: 0,
                    duration: 300,
                    ease: "linear"
                },
                onComplete: () => {
                    exchangeArrows.destroy();
                }

                // completeDelay: 1000
            },

        ]
    })

    scene.tweens.chain({
        targets: oldVal,
        tweens: [
            {
                alpha: {
                    from: 0,
                    to: 1,
                    duration: 200,
                    ease: "linear"
                },
                scale: {
                    from: 1.5,
                    to: 1,
                    ease: "linear",
                    duration: 200
                },
                delay: arrowStageOneDuration / 2,
                // completeDelay: arrowStateTwoDuration  + 100
            },
            {
                angle: {
                    from: 0,
                    to: increase? 360 : -360,
                    duration: exchangeSpinDuration,
                    ease: "Cubic.inOut"
                },
                alpha: {
                    from: 1,
                    to: 0,
                    ease: "Cubic.in",
                    duration: exchangeSpinDuration
                },
                delay: 600 + 10
            },
        ],
        onComplete: () => {
            oldVal.destroy();
        }
    })

    scene.tweens.add({
        targets: newVal,
        angle: increase? "+=360": "-=360",
        duration: exchangeSpinDuration,
        ease: "Cubic.inOut",
        delay: arrowStageOneDuration / 2 + 200 + 600 + 10,
        completeDelay: 400

    }).play()
    scene.tweens.chain({
        targets: newVal,
        tweens: [
            {
                alpha: {
                    from: 0,
                    to: 1,
                    duration: 200,
                    ease: "Cubic.in"
                },
                delay: arrowStageOneDuration / 2 + 200 + 600 + 10,
                completeDelay: 800,        
            },
            {
                alpha: {
                    from: 1,
                    to: 0,
                    duration: 200
                },
                scale: {
                    from: 1,
                    to: 1.7,
                    duration: 200
                },
                onComplete: () => {
                    newVal.destroy();
                }
        
            }
        ]
    }).play()
    // scene.tweens.chain({
    //     targets: newVal,
    //     tweens: [
    //         {
    //             angle: {
    //                 angle: "-=270",
                    
    //                 duration: 200,
    //                 ease: "Cubic.in"
    //             },
    //             alpha: {
    //                 from: 0,
    //                 to: 1,
    //                 ease: "linear",
    //                 duration: 200
    //             },
    //             delay: arrowStageOneDuration / 2 + 200 + 600 + 10,
    //             completeDelay: 400
    //         },
    //     ],
    //     onComplete: () => {
    //         newVal.destroy();
    //     }
    // })



}