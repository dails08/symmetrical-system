import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {animate} from "animejs";
import { ColyseusService } from '../services/colyseusService';
import { CentralService } from '../services/central-service';
import { CssSelector } from '@angular/compiler';
import { EPlaybooks, IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician } from "../../../../../common/common";
import { Cervantes, Clint } from "../../../../../common/examples";
import { Slayer, Blade, Gunslinger, Arcanist, Tactician, KnownSpell, Advance } from '../../../../../server/src/SlayerRoomState';
import { provideRouter } from '@angular/router';
import { EMessageTypes, IBaseMsg, ICharacterUpdateMsg, ISaveCampaignMsg, IUpdateNumericalMsg } from '../../../../../common/messageFormat';
import { BladePipe, GunslingerPipe, ArcanistPipe, TacticianPipe } from "../classPipes";


@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule, BladePipe, GunslingerPipe, ArcanistPipe, TacticianPipe],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet implements AfterViewInit {

  playbooks = EPlaybooks;

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
    }

    ngAfterViewInit(): void {
      this.cs.getAssignmentChange().subscribe((newSlayer) => {
        console.log("Adding listeners")
          // Add listeners
          this.cjs.$!(newSlayer).listen("currentHP", (newValue, previousValue) => {
            console.log("Automatically changing hp: " + this.cs.slayer!.currentHP + "/" + this.cs.slayer!.maxHP);
            this.cs.slayer!.currentHP = newValue;
            console.log("Damage: " + this.cs.slayer!.currentHP);
            if (this.cs.slayer){
              animate(".barcontent", {
                flex: this.cs.slayer.currentHP/this.cs.slayer.maxHP,
                duration: 1000
              });  
            }
          
          })
        });
    }
}
