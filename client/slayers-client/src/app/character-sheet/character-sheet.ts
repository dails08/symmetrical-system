import { afterNextRender, afterRenderEffect, AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {animate} from "animejs";
import { ColyseusService } from '../services/colyseusService';
import { CentralService } from '../services/central-service';
import { CssSelector } from '@angular/compiler';
import { EPlaybooks, IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician } from "../../../../../common/common";
import { Cervantes, Clint } from "../../../../../common/examples";
import { Slayer, Blade, Gunslinger, Arcanist, Tactician, KnownSpell, Advance, Player } from '../../../../../server/src/SlayerRoomState';
import { provideRouter } from '@angular/router';
import { EMessageTypes, IBaseMsg, ICharacterUpdateMsg, ISaveCampaignMsg, IUpdateNumericalMsg } from '../../../../../common/messageFormat';
import { BladePipe, GunslingerPipe, ArcanistPipe, TacticianPipe } from "../classPipes";
import { getStateCallbacks } from 'colyseus.js';
import { Roller } from '../roller/roller';
import { TippyDirective } from '@ngneat/helipopper';
import { JoinScreen } from "../join-screen/join-screen";

@Component({
  selector: 'app-character-sheet',
  imports: [
    CommonModule, 
    BladePipe, 
    GunslingerPipe, 
    ArcanistPipe, 
    TacticianPipe, 
    TippyDirective, 
    Roller, 
    JoinScreen],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet implements AfterViewInit {

  playbooks = EPlaybooks;
  fresh: boolean;
  player: Player | undefined;

  constructor(
    public cjs: ColyseusService,
    public cs: CentralService
  ) {

    // this.cs.getAssignmentChange().subscribe((newSlayer) => {
    //   console.log("Adding listeners")
    //     // Add listeners
    //     this.cjs.$!(newSlayer).listen("currentHP", (newValue, previousValue) => {
    //       console.log("Automatically changing hp: " + this.cs.slayer!.currentHP + "/" + this.cs.slayer!.maxHP);
    //       this.cs.slayer!.currentHP = newValue;
    //       console.log("Damage: " + this.cs.slayer!.currentHP);
    //       if (this.cs.slayer){
    //         animate(".barcontent", {
    //           flex: this.cs.slayer.currentHP/this.cs.slayer.maxHP,
    //           duration: 1000
    //         });  
    //       }
        
    //     })
    //   });
    this.fresh = true;
    }

    animateHPChange() {
      if (this.cs.slayer){
        console.log("Actual animation");

        animate(".barcontent", {
          right: 100 * (1 - this.cs.slayer.currentHP/this.cs.slayer.maxHP) + '%',
          duration: 1000
          }
        );
        this.fresh = false;

      }

    }


    ngAfterViewInit(): void {
      this.cjs.getAssignmentChange().subscribe(([newSlayer, pix]) => {
        const room = this.cjs.room.then((room) => {
          const $ = getStateCallbacks(room);
          console.log("Adding listeners")
          // Add listeners
          $(newSlayer).listen("currentHP", (newValue, previousValue) => {
            console.log("Automatically changing hp: " + this.cs.slayer!.currentHP + "/" + this.cs.slayer!.maxHP);
            // this.cs.slayer!.currentHP = newValue;
            console.log("Damage: " + this.cs.slayer!.currentHP);
            
            if (this.fresh){
              setTimeout(()=> {
                this.animateHPChange();
              }, 100);
            } else {
              this.animateHPChange();
            }

        })
            
            
            
          
          });
        });
    }
}
