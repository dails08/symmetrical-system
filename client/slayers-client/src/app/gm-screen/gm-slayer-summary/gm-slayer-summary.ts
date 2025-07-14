import { Component, Input } from '@angular/core';
import { Advance, Player, Slayer } from '../../../../../../server/src/SlayerRoomState';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { EPlaybooks } from '../../../../../../common/common';
import { textChangeRangeNewSpan } from 'typescript';
import { ColyseusService } from '../../services/colyseusService';
import { CentralService } from '../../services/central-service';
import { EMessageTypes, IArrayChangeMsg } from '../../../../../../common/messageFormat';

@Component({
  selector: 'app-gm-slayer-summary',
  imports: [CommonModule, 
    MatButtonModule, 
    MatCardModule, 
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './gm-slayer-summary.html',
  styleUrl: './gm-slayer-summary.scss'
})
export class GmSlayerSummary {

  @Input({required: true}) player!: Player;
  @Input() slayer: Slayer | undefined;

  playbooks = EPlaybooks;

  constructor(
    protected cjs: ColyseusService,
    protected cs: CentralService
  ) {

  }

  alterChekhovPoints(delta: number) {
    console.log("Altering chekhov by " + delta);
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

}
