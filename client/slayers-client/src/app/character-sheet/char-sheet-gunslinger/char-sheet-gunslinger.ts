import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Gunslinger, SlayerRoomState  } from '../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../services/colyseusService';
import { ERunes } from '../../../../../../common/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { animate, utils, stagger, createTimer } from 'animejs';
import { getStateCallbacks } from 'colyseus.js';
import { Chamber } from './chamber/chamber';
import { EMessageTypes, ILoadedChangeMsg, ISprayLeadMsg } from '../../../../../../common/messageFormat';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-char-sheet-gunslinger',
  imports: [
    CommonModule,
    DragDropModule,
    Chamber
],
  templateUrl: './char-sheet-gunslinger.html',
  styleUrl: './char-sheet-gunslinger.scss'
})
export class CharSheetGunslinger {

  @Input({required: true}) slayer!: Gunslinger

  ERunes = ERunes;

  @ViewChild("chamber1")
  firstChamber!: Chamber;
  @ViewChild("chamber2")
  secondChamber!: Chamber;
  @ViewChild("chamber3")
  thirdChamber!: Chamber;
  @ViewChild("chamber4")
  fourthChamber!: Chamber;
  @ViewChild("chamber5")
  fifthChamber!: Chamber;
  @ViewChild("chamber6")
  sixthChamber!: Chamber;

  rotationValue: number = 0;

  stagedRounds: {
    chamber: number,
    rune: ERunes
  }[] = [];

  stateReloading: boolean = false

  constructor(
      private cjs: ColyseusService
    ){

      this.cjs.room.then(room => {
        const $ = getStateCallbacks<SlayerRoomState>(room);
        // $(this.slaye r).onChange(() => {
        //   // setTimeout(this.updateRuneAnimations, 100);
        //   this.firstChamber.updateRuneAnimation();
        //   this.secondChamber.updateRuneAnimation();
        //   this.thirdChamber.updateRuneAnimation();
        //   this.fourthChamber.updateRuneAnimation();
        //   this.fifthChamber.updateRuneAnimation();
        //   this.sixthChamber.updateRuneAnimation();
        // })
        $(this.slayer).listen("chamber1Rune",(value, previousValue) => {
          this.firstChamber.updateRuneAnimation();
        })
        $(this.slayer).listen("chamber1Loaded",(value, previousValue) => {
          if (!value){
            this.firstChamber.stopAnimation();
          } else {
            this.firstChamber.updateRuneAnimation();
          }
        })
        $(this.slayer).listen("chamber2Rune",(value, previousValue) => {
          this.secondChamber.updateRuneAnimation();
        })
        $(this.slayer).listen("chamber2Loaded",(value, previousValue) => {
          if (!value){
            this.secondChamber.stopAnimation();
          } else {
            this.secondChamber.updateRuneAnimation();
          }
        })
        $(this.slayer).listen("chamber3Rune",(value, previousValue) => {
          this.thirdChamber.updateRuneAnimation();
        })
        $(this.slayer).listen("chamber3Loaded",(value, previousValue) => {
          if (!value){
            this.thirdChamber.stopAnimation();
          } else {
            this.thirdChamber.updateRuneAnimation();
          }
        })
        $(this.slayer).listen("chamber4Rune",(value, previousValue) => {
          this.fourthChamber.updateRuneAnimation();
        })
        $(this.slayer).listen("chamber4Loaded",(value, previousValue) => {
          if (!value){
            this.fourthChamber.stopAnimation();
          } else {
            this.fourthChamber.updateRuneAnimation();
          }
        })
        $(this.slayer).listen("chamber5Rune",(value, previousValue) => {
          this.fifthChamber.updateRuneAnimation();
        })
        $(this.slayer).listen("chamber5Loaded",(value, previousValue) => {
          if (!value){
            this.fifthChamber.stopAnimation();
          } else {
            this.fifthChamber.updateRuneAnimation();
          }
        })
        $(this.slayer).listen("chamber6Rune",(value, previousValue) => {
          this.sixthChamber.updateRuneAnimation();
        })
        $(this.slayer).listen("chamber6Loaded",(value, previousValue) => {
          if (!value){
            this.sixthChamber.stopAnimation();
          } else {
            this.sixthChamber.updateRuneAnimation();
          }
        })


    })
  }




    logChamberClick(chamber: number) {
      console.log("Chamber clicked!: " + chamber);
    }

    sprayLead() {
      const staged: number[] = [];
      for (let elem of [this.firstChamber, this.secondChamber, this.thirdChamber, this.fourthChamber, this.fifthChamber, this.sixthChamber]){
        if (elem.selected){
          staged.push(elem.chamber)
          elem.selected = false;
        }
      }
      const msg: ISprayLeadMsg = {
        kind: EMessageTypes.sprayLead,
        chambers: staged
      };
      this.cjs.sendMessage(msg);
    }

    toggleReloadState(){
      this.stateReloading = ! this.stateReloading;
    }

    toggleSelectedOrReload(chamber: Chamber) {
      if (this.stateReloading){

        const reloadMsg: ILoadedChangeMsg = {
          kind: EMessageTypes.LoadedChange,
          chamber: chamber.chamber,
          loaded: true,
          slayerId: this.slayer.id
        };
        this.cjs.sendMessage(reloadMsg);
      } else {
        if (chamber.loaded){
          chamber.selected = !chamber.selected
      }
      }

    }



}
