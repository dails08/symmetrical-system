import { Component, Input } from '@angular/core';
import { Advance, InventoryItem, Player, Slayer } from '../../../../../../server/src/SlayerRoomState';
import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatExpansionModule } from '@angular/material/expansion';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { EPlaybooks } from '../../../../../../common/common';
import { ColyseusService } from '../../services/colyseusService';
import { CentralService } from '../../services/central-service';
import { EMessageTypes, IArrayChangeMsg, IUpdateNumericalMsg } from '../../../../../../common/messageFormat';
import { BladePipe } from '../../classPipes';

import {MatExpansionModule} from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { getStateCallbacks } from 'colyseus.js';
import { GmControlsBlade } from "./gm-controls-blade/gm-controls-blade";
@Component({
  selector: 'app-gm-slayer-summary',
  imports: [CommonModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule, 
    GmControlsBlade, BladePipe,
  ],
  templateUrl: './gm-slayer-summary.html',
  styleUrl: './gm-slayer-summary.scss'
})
export class GmSlayerSummary {

  @Input({required: true}) player!: Player;
  @Input({required: true }) playerIx!: String;
  slayer: Slayer | undefined;

  playbooks = EPlaybooks;


  constructor(
    protected cjs: ColyseusService,
    protected cs: CentralService
  ) {

    this.cjs.room.then((room) => {
      // const tmpSessionId = room.state.playerMap.get(this.player);
      let report: string = ""
      report += "Starting slayer summary for " + this.player.displayName + " (" + this.player.id + ")\n";
      const tmpSlayer = room.state.currentAssignments.get(this.player.id)
      this.slayer = tmpSlayer
      if (this.slayer){
        report += "Found asignment: " + this.slayer.name  + "\n";
      } else {
        report += "Found no assignment\n";
      }

      const $ = getStateCallbacks(room);
      if (this.slayer){
        // console.log("Found assignment to " + this.slayer.name)
        report += "Binding\n";
        $(this.slayer).bindTo(this.slayer);

      } else {
         report += "No slayer assigned here for binding\n";
      }

      report += "Attaching listeners\n";
      $(room.state).currentAssignments.onRemove((slayer, ix) => {
        if (ix == this.player.id) {
          this.slayer = undefined;
        }
      })
      $(room.state).currentAssignments.onAdd((slayer, ix) => {
        if (ix == this.player.id){
          this.slayer = slayer;
          $(slayer).bindTo(this.slayer);
        }
      })
      console.log(report);
    })


  }



  addAdvance(slayer: Slayer, name: string, description: string){
    console.log(slayer.name, name, description);
    const newAdvance = new Advance();
    newAdvance.name = name;
    newAdvance.desc = description;
    if (this.cs.player){
      const msg: IArrayChangeMsg = {
        kind: EMessageTypes.ArrayChange,
        characterId: slayer.id,
        array: "advances",
        action: "add",
        data: {name: name, description: description}
      }
      console.log("Sending msg " + JSON.stringify(msg))
      this.cjs.sendMessage(msg);
    }
  };

  removeAdvance(slayer: Slayer, ix: number) {
    console.log("Removing advance " + ix + " from " + slayer.name);
    if (this.cs.player) {
      const msg: IArrayChangeMsg = {
        kind: EMessageTypes.ArrayChange,
        characterId: slayer.id,
        array: "advances",
        action: "remove",
        ix: ix
      };
      this.cjs.sendMessage(msg);
    }
  }

  addInvItem(slayer: Slayer, name: string, description: string){
    console.log(slayer.name, name, description);
    const newItem = new InventoryItem();
    newItem.name = name;
    newItem.desc = description;
    if (this.cs.player){
      const msg: IArrayChangeMsg = {
        kind: EMessageTypes.ArrayChange,
        characterId: slayer.id,
        array: "inventory",
        action: "add",
        data: {name: name, description: description}
      }
      console.log("Sending msg " + JSON.stringify(msg))
      this.cjs.sendMessage(msg);
    }
  };

  removeInvItem(slayer: Slayer, ix: number) {
    console.log("Removing item " + ix + " from " + slayer.name);
    if (this.cs.player) {
      const msg: IArrayChangeMsg = {
        kind: EMessageTypes.ArrayChange,
        characterId: slayer.id,
        array: "inventory",
        action: "remove",
        ix: ix
      };
      this.cjs.sendMessage(msg);
    }
  }

  modStat(
    slayer: Slayer,
    stat: "damage" | "speed" | "skillsAgile" | "skillsBrawn" | "skillsDeceive" | "skillsHunt" | "skillsMend" | "skillsNegotiate" | "skillsStealth" | "skillsStreet" | "skillsStudy" | "skillsTactics",
    delta: number){
      let newVal: number;
      if (stat == "damage") {
        newVal = Math.min(Math.max(slayer[stat] + delta, 0), 10);
      } else {
        newVal = Math.min(Math.max(slayer[stat] + delta, 4), 10);
      }

      const msg: IUpdateNumericalMsg = {
        kind: EMessageTypes.NumericalUpdate,
        field: stat,
        newValue: newVal,
        slayerId: slayer.id
      };
      this.cjs.sendMessage(msg);
  }


  modHp(
    slayer: Slayer,
    delta_str: string,
    multiplier: 1 | -1
  ){
    const delta_num: number = Number.parseInt(delta_str);
    const newVal: number = Math.min(Math.max(slayer.currentHP + delta_num * multiplier, 0), slayer.maxHP);
    const msg: IUpdateNumericalMsg = {
      kind: EMessageTypes.NumericalUpdate,
      field: "currentHP",
      newValue: newVal,
      slayerId: slayer.id
    };
    this.cjs.sendMessage(msg);

  }

  modMaxHp(
    slayer: Slayer,
    newMax_str: string
  ){
    const msg: IUpdateNumericalMsg = {
      kind: EMessageTypes.NumericalUpdate,
      field: "maxHp",
      newValue: parseInt(newMax_str),
      slayerId: slayer.id
    };
    this.cjs.sendMessage(msg);

  }

}
