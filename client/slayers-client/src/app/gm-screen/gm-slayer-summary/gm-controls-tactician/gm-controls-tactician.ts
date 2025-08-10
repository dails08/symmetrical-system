import { Component, Input } from '@angular/core';

import { Player, Slayer, Tactician } from '../../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../../services/colyseusService';

import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {CdkDragDrop, CdkDropList, CdkDrag} from '@angular/cdk/drag-drop';
import { EMessageTypes, IAddPlanMsg, IRemovePlanMsg } from '../../../../../../../common/messageFormat';

@Component({
  selector: 'app-gm-controls-tactician',
  imports: [MatChipsModule, MatIconModule, MatFormFieldModule, CdkDropList, CdkDrag],
  templateUrl: './gm-controls-tactician.html',
  styleUrl: './gm-controls-tactician.scss'
})
export class GmControlsTactician {

  @Input({required: true}) player!: Player;
  @Input({required: true }) playerIx!: String;
  @Input({ required: true }) slayer!: Tactician;

  constructor(
    private cjs: ColyseusService
  ) {

  }

  addPlan(event: CdkDragDrop<number[]>){
    if (event.previousContainer.id == "newPlans"){
      const newPlan = event.item.data as number;
      console.log("Adding plan of value " + newPlan);
      const msg: IAddPlanMsg = {
        kind: EMessageTypes.addPlan,
        slayerId: this.slayer.id,
        planVal: newPlan
      };
      this.cjs.sendMessage(msg);
    }
  }

  removePlan(ix: number){
    const msg: IRemovePlanMsg = {
      kind: EMessageTypes.removePlan,
      slayerId: this.slayer.id,
      planIx: ix
    };
    this.cjs.sendMessage(msg);
  }


}
