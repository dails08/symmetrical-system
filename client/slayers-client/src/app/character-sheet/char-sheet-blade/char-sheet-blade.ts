import { Component, Input, Directive, HostListener, AfterViewInit } from '@angular/core';
import { Blade } from '../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../services/colyseusService';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { animate } from 'animejs';
import { EStances } from '../../../../../../common/common';
import { EMessageTypes, IBladeAttackMsg, IStanceChangeMsg } from '../../../../../../common/messageFormat';
import { getStateCallbacks } from 'colyseus.js';

// @Directive({selector: 'div[stance]' })
// class TrackDragEnter {

//   @HostListener("dragenter", ['$event'])
//   onDragEnter(){}
// }


@Component({
  selector: 'app-char-sheet-blade',
  imports: [CommonModule, DragDropModule],
  templateUrl: './char-sheet-blade.html',
  styleUrl: './char-sheet-blade.scss'
})
export class CharSheetBlade implements AfterViewInit{

  attackType: "D" | "N" | "A" = "N";
  @Input({required: true}) slayer!: Blade
  stanceShifting = false;

  EStances = EStances;

  constructor(
    private cjs: ColyseusService
  ){

  }

  dragStarted(){
    console.log("Started");
    this.stanceShifting = true;
    console.log(this.stanceShifting);
  }

  dragEntered(){
    console.log("Entered");
  }
  dragEnded(){
    console.log("Ended");
    this.stanceShifting = false;
    console.log(this.stanceShifting);

  }
  dragDropped(){
    console.log("Dropped");
  }

  shiftStance(newStance: EStances){
    const msg: IStanceChangeMsg = {
      kind: EMessageTypes.StanceChange,
      stance: newStance,
      characterId: this.slayer.id
    };
    this.cjs.sendMessage(msg);
  }

  setDNA(DNA: "D" | "N" | "A"){
    this.attackType = DNA;
    setTimeout(() => {
      animate(".unselectedDNA", {
        "flex-grow": 1,
        duration: 300,
        ease: "outCubic"
      });
      animate(".selectedDNA", {
        "flex-grow": 5,
        duration: 300,
        ease: "outCubic"
      })
  
    }, 10);
  }

  sendAttack(){
    const msg: IBladeAttackMsg = {
      kind: EMessageTypes.bladeAttack,
      DNA: this.attackType
    };
    this.cjs.sendMessage(msg);
  }



  ngAfterViewInit(): void {
    const bgColorMap = new Map<EStances, string>();
    bgColorMap.set(EStances.Slay, "darkred");
    bgColorMap.set(EStances.Flow, "darkblue");
    bgColorMap.set(EStances.Parry, "purple");

    this.cjs.room.then(result => {
      const $ = getStateCallbacks(result);

      $(this.slayer).listen("stance", (newValue, previousValue) => {
        setTimeout(() => {
          console.log("Switched stance to " + newValue);
          animate(".stance", {
            'background': "black",
            'flex-grow': 1,
            duration: 400,
            ease: "inOutCubic"
          });
          animate(".selectedStance", {
            'background': bgColorMap.get(newValue) || "black",
            'flex-grow': 3,
            duration: 400,
            ease: "inOutCubic"
          });  
  
        }, 100);
      });

      this.shiftStance(EStances.Flow);
      this.setDNA("N");
    })

    

  }

}
