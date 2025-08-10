import { AfterViewInit, Component, Input } from '@angular/core';
import { Gunslinger  } from '../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../services/colyseusService';
import { ERunes } from '../../../../../../common/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { animate, utils, stagger, createTimer } from 'animejs';

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
      

     
      
    }

    updateRuneAnimation(){
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

    ngAfterViewInit(): void {
      this.updateRuneAnimation();

    }

}
