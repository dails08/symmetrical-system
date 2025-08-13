import { AfterViewInit, Component, Input, ViewChild, viewChild } from '@angular/core';
import { ERunes } from '../../../../../../../common/common';
import { CommonModule } from '@angular/common';
import { animate, utils } from 'animejs';

@Component({
  selector: 'app-chamber',
  imports: [CommonModule],
  templateUrl: './chamber.html',
  styleUrl: './chamber.scss'
})
export class Chamber implements AfterViewInit {

  @Input({required: true})
  rune!: ERunes;
  
  @Input({required: true})
  loaded!: boolean;

  @Input({required: true})
  chamber!: number;

  @ViewChild("runeImg")
  runeImg!: HTMLElement;

  selected = false;

  ERunes = ERunes;


  updateRuneAnimation() {
    const toDelay =  Math.floor(Math.random() * 3000);
    if (this.runeImg){
      console.log("Found rune image");
      setTimeout(() => {
        // console.log("Updating rune animation for chamber with " + this.rune);
        // const changedChamber = utils.$(this.runeImg);
        // console.log(changedChamber.length);
        // const toInvert = Math.floor(Math.random() * 50) + 25;
        const toDuration = Math.floor(Math.random() * 3000) + 5000;
        // console.log(toDuration);
        // const toContrast = Math.floor(Math.random() * 50) + 25;
  
        animate("#runeImg" + this.chamber, {
          duration: toDuration,
          loop: -1,
          delay: toDelay,
          alternate: true,
          // width: "200px",
          filter: [
            'invert(42%) sepia(93%) saturate(1352%) hue-rotate(0deg) brightness(119%) contrast(119%)',
            'invert(42%) sepia(93%) saturate(1352%) hue-rotate(359deg) brightness(119%) contrast(119%)'
          ]
          // filter: [
          //   'invert(' + toInvert + '%) sepia(93%) saturate(1352%) hue-rotate(0deg) brightness(119%) contrast(120%)',
            // 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(359deg) brightness(119%) contrast(' + toContrast +  '%)'
          // ]
        })
      },100);
    } 
    
    
  }

  ngAfterViewInit(): void {
    this.updateRuneAnimation();
  }

}
