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
import { CharSheetTactician } from "./char-sheet-tactician/char-sheet-tactician";
import { CharSheetGunslinger } from "./char-sheet-gunslinger/char-sheet-gunslinger";
import { CharSheetArcanist } from "./char-sheet-arcanist/char-sheet-arcanist";

import { CharSheetBlade } from "./char-sheet-blade/char-sheet-blade";
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
    CharSheetTactician,
    CharSheetGunslinger,
    CharSheetArcanist,
    CharSheetBlade
],
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
    this.cjs.getReconnect().subscribe(() => {

    })


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

    addListeners() {
      
    }


    ngAfterViewInit(): void {
      console.log("Character sheet afterViewInit triggering");
      console.log(this.cs.slayer);
      
      this.animateHPChange();
      const room = this.cjs.room.then((room) => {
        const $ = getStateCallbacks(room);
        console.log("Adding listeners")
        // Add listeners
        if (this.cs.slayer) {
          $(this.cs.slayer).listen("currentHP", (newValue, previousValue) => {
            console.log("Normally changing hp: " + this.cs.slayer!.currentHP + "/" + this.cs.slayer!.maxHP);
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
          $(this.cs.slayer).listen("maxHP", (newValue, previousValue) => {
              console.log("Adjusting max hp: " + this.cs.slayer!.currentHP + "/" + this.cs.slayer!.maxHP);
              // this.cs.slayer!.currentHP = newValue;
              // console.log("Damage: " + this.cs.slayer!.currentHP);

              if (this.fresh){
                setTimeout(()=> {
                  this.animateHPChange();
                }, 100);
              } else {
                this.animateHPChange();
              }
          })
        }
        });

      this.cjs.getAssignmentChange().subscribe(([newSlayer]) => {
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
          $(newSlayer).listen("maxHP", (newValue, previousValue) => {
              console.log("Correcting max hp: " + this.cs.slayer!.currentHP + "/" + this.cs.slayer!.maxHP);
              // this.cs.slayer!.currentHP = newValue;
              // console.log("Damage: " + this.cs.slayer!.currentHP);

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
