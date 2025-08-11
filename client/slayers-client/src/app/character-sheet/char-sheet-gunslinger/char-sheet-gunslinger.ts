import { AfterViewInit, Component, Input } from '@angular/core';
import { Gunslinger, SlayerRoomState  } from '../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../services/colyseusService';
import { ERunes } from '../../../../../../common/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { animate, utils, stagger, createTimer } from 'animejs';
import { getStateCallbacks } from 'colyseus.js';

@Component({
  selector: 'app-char-sheet-gunslinger',
  imports: [
    CommonModule,
    DragDropModule
  ],
  templateUrl: './char-sheet-gunslinger.html',
  styleUrl: './char-sheet-gunslinger.scss'
})
export class CharSheetGunslinger  implements AfterViewInit{

  @Input({required: true}) slayer!: Gunslinger

  ERunes = ERunes;

  rotationValue: number = 0;

  stagedRounds: {
    chamber: number,
    rune: ERunes
  }[] = [];

  stateReloading: boolean = false;

  constructor(
      private cjs: ColyseusService
    ){
      
      this.cjs.room.then(room => {
        const $ = getStateCallbacks<SlayerRoomState>(room);
        // $(this.slayer).onChange(() => {
        //   setTimeout(this.updateRuneAnimations, 100);
        // })

        $(this.slayer).listen("chamber1Rune", (value, previousValue) => {
          setTimeout(() => this.updateRuneAnimation("One"),100);
        })
        $(this.slayer).listen("chamber2Rune", (value, previousValue) => {
          setTimeout(() => this.updateRuneAnimation("Two"),100);
        })
        $(this.slayer).listen("chamber3Rune", (value, previousValue) => {
          setTimeout(() => this.updateRuneAnimation("Three"),100);
        })
        $(this.slayer).listen("chamber4Rune", (value, previousValue) => {
          setTimeout(() => this.updateRuneAnimation("Four"),100);
        })
        $(this.slayer).listen("chamber5Rune", (value, previousValue) => {
          setTimeout(() => this.updateRuneAnimation("Five"),100);
        })
        $(this.slayer).listen("chamber6Rune", (value, previousValue) => {
          setTimeout(() => this.updateRuneAnimation("Six"),100);
        })
      })

     
      
    }

    updateRuneAnimation(chamber: string) {
      console.log("Updating rune animation for " + ".chamber" + chamber + "Rune");
      const changedChamber = utils.$(".chamber" + chamber + "Rune");
      console.log(changedChamber.length);
      const toInvert = Math.floor(Math.random() * 50) + 25;
      const toDelay =  Math.floor(Math.random() * 1000);

      animate(changedChamber, {
        duration: 10000,
        loop: -1,
        delay: toDelay,
        alternate: true, 
        filter: [
          'invert(' + toInvert + '%) sepia(93%) saturate(1352%) hue-rotate(0deg) brightness(119%) contrast(119%)',
          'invert(42%) sepia(93%) saturate(1352%) hue-rotate(359deg) brightness(119%) contrast(119%)'
        ]
      })
    }

    updateRuneAnimations(){
      console.log("Updating rune animations");
      const loadeds = utils.$(".loadedRune");
      console.log(loadeds.length);
      loadeds.forEach(elem => {
        const toInvert = Math.floor(Math.random()*100);
        const toDelay = Math.floor(Math.random() * 1000);
        animate(elem, {
          duration: 10000,
          loop: -1,
          delay: toDelay,
          alternate: true, 
          filter: [
            'invert(' + toInvert + '%) sepia(93%) saturate(1352%) hue-rotate(0deg) brightness(119%) contrast(119%)',
            'invert(42%) sepia(93%) saturate(1352%) hue-rotate(359deg) brightness(119%) contrast(119%)'
          ]
        })
      })
      // animate(loadeds, {
      //   duration: 10000,
      //   loop: -1,
      //   delay: stagger(100),
      //   filter: [
      //     'invert(42%) sepia(93%) saturate(1352%) hue-rotate(0deg) brightness(119%) contrast(119%)',
      //     'invert(42%) sepia(93%) saturate(1352%) hue-rotate(359deg) brightness(119%) contrast(119%)'
      //   ]
      // });

    }

    logChamberClick(chamber: number) {
      console.log("Chamber clicked!: " + chamber);
    }

    ngAfterViewInit(): void {
      this.updateRuneAnimations();

    }

}
