import { Component , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tactician, Player, RecentRoll, SlayerRoomState } from '../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../services/colyseusService';
import { getStateCallbacks,  } from 'colyseus.js';
import { ArraySchema } from "@colyseus/schema";

@Component({
  selector: 'app-char-sheet-tactician',
  imports: [
    CommonModule,
  ],
  templateUrl: './char-sheet-tactician.html',
  styleUrl: './char-sheet-tactician.scss'
})
export class CharSheetTactician {

  @Input({required: true}) slayer!: Tactician

  hasRally: boolean = false;
  hasEmpower: boolean = false;
  hasWeaken: boolean = false;
  hasShift: boolean = false;
  prepCount: number = 0;

  recentRolls: RecentRoll[] = [];
  

  checkAdvances(){
    if (this.slayer){
      let tmpRally = false;
      let tmpWeaken = false;
      let tmpShift = false;
      let tmpEmpower = false;
      let tmpPrepCount = 0;
      for (const advance of this.slayer.advances){
        console.log("Checking " + advance.name);
        if (advance.name.toLowerCase() == "rally"){
          tmpRally = true
        }
        if (advance.name.toLowerCase() == "weaken"){
          tmpWeaken = true
        }
        if (advance.name.toLowerCase() == "empower"){
          tmpEmpower = true
        }
        if (advance.name.toLowerCase() == "shift"){
          tmpShift = true
          console.log("has shift");
        }
        if (advance.name.toLowerCase() == "prep"){
          tmpPrepCount += 1
        }
      }
      this.hasRally = tmpRally;
      this.hasEmpower = tmpEmpower;
      this.hasShift = tmpShift;
      this.hasWeaken = tmpWeaken;
      this.prepCount = tmpPrepCount;
    }
    
  }

  constructor(
    private cjs: ColyseusService
  ){

    this.cjs.room.then((room) => {
      const $ = getStateCallbacks(room);
      $(this.slayer).advances.onAdd((item, ix) => {
        this.checkAdvances();
      })
      $(this.slayer).advances.onRemove((item, ix) => {
        this.checkAdvances();
      })
      $(room.state).recentRolls.onAdd((elem, ix) => {
        this.recentRolls.push(elem);
      })
      $(room.state).recentRolls.onRemove((elem, ix) => {
        this.recentRolls.splice(ix);
      })
      // $(room.state).bindTo(this.recentRolls,["recentRolls"]);
    })  
    
  }


}
