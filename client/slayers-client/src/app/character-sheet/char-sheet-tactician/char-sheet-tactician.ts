import { Component , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tactician, Player, RecentRoll, SlayerRoomState } from '../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../services/colyseusService';
import { getStateCallbacks,  } from 'colyseus.js';
import { ArraySchema } from "@colyseus/schema";
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { EMessageTypes, IRollPlansMsg, ISwapRollMsg } from '../../../../../../common/messageFormat';

@Component({
  selector: 'app-char-sheet-tactician',
  imports: [
    CommonModule,
    DragDropModule
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
  hasStrategist: boolean = false;
  prepCount: number = 0;

  planningRollsTotal: number = 0;
  planningRollsDeeFours = 0;
  planningRollsDeeSixes = 0;
  planningRollsDeeEights = 0;

  recentRolls: RecentRoll[] = [];

  mode: "add" | "swap" | "subtract" | "neutral" = "neutral";

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
      $(this.slayer).listen("skillsTactics", (value, previousValue) =>{
        this.resetPlans();
      })
      this.resetPlans();
    })

  }

  resetPlans() {
    this.planningRollsTotal = this.slayer.skillsTactics + this.prepCount;
    this.planningRollsDeeFours = 0;
    this.planningRollsDeeSixes = 0;
    this.planningRollsDeeEights = 0;
  }

  rollRally(){
    console.log("Rally!");
  }

  shootStab(){
    console.log("Shoot/stab!");
  }

  adjustPlanRoll(fours: number, sixes: number, eights: number){
    if (this.planningRollsTotal > 0){
      this.planningRollsTotal -= 1;
      this.planningRollsDeeFours += fours;
      this.planningRollsDeeSixes += sixes;
      this.planningRollsDeeEights += eights;
    }
  }

  sendPlansRoll(){
    const msg: IRollPlansMsg = {
      kind: EMessageTypes.rollPlans,
      fours: this.planningRollsDeeFours,
      sixes: this.planningRollsDeeSixes,
      eights: this.planningRollsDeeEights

    };
    this.resetPlans();
    this.cjs.sendMessage(msg);
  }

  checkAdvances(){
    if (this.slayer){
      let tmpRally = false;
      let tmpWeaken = false;
      let tmpShift = false;
      let tmpStrategist = false;
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
        if (advance.name.toLowerCase() == "strategist"){
          tmpStrategist = true
          console.log("has strategist");
        }
        if (advance.name.toLowerCase() == "prep"){
          tmpPrepCount += 1
        }
      }
      this.hasRally = tmpRally;
      this.hasEmpower = tmpEmpower;
      this.hasShift = tmpShift;
      this.hasStrategist = tmpStrategist;
      this.hasWeaken = tmpWeaken;
      this.prepCount = tmpPrepCount;
      this.resetPlans();
    }

  }



  enter(entry: "add" | "swap" | "subtract" | "neutral"){
    console.log(entry);
    this.mode = entry;
  }

  dropRoll(event: CdkDragDrop<number[]>, rollIx: number, toReplace: RecentRoll){
    console.log(event.item.data);
    console.log(toReplace);

    const msg: ISwapRollMsg = {
      kind: EMessageTypes.swapRoll,
      rollIx: rollIx,
      planValue: event.item.data,
      action: this.mode
    };

    this.cjs.sendMessage(msg);
    this.mode = "neutral";
  }

  noDrop(){
    return false;
  }


}
