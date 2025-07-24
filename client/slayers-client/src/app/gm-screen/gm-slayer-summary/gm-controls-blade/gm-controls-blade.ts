import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Slayer, Player, Blade } from '../../../../../../../server/src/SlayerRoomState';
import { EStances } from '../../../../../../../common/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TitleCasePipe } from '@angular/common';
import { EMessageTypes, IStanceChangeMsg, IWeaponChangeMsg } from '../../../../../../../common/messageFormat';
import { ColyseusService } from '../../../services/colyseusService';
@Component({
  selector: 'app-gm-controls-blade',
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    TitleCasePipe
  ],
  templateUrl: './gm-controls-blade.html',
  styleUrl: './gm-controls-blade.scss'
})
export class GmControlsBlade {

  constructor(
    private cjs: ColyseusService
  ) {

  }

  @Input({required: true}) slayer!: Blade;
  @Input({required: true}) player!: Player;
  @Input({required: true}) playerIx!: String;



  EStances = EStances

  setStance(event: MatSelectChange) {
    const stanceChangeMsg: IStanceChangeMsg = {
      kind: EMessageTypes.StanceChange,
      characterId: this.slayer.id,
      stance: event.value
    };
    this.cjs.sendMessage(stanceChangeMsg);
  }

  setDamage(dmgN: number, dmgS: number) {
    console.log("Changing weapon to " + dmgN + " " + dmgS);
    const msg: IWeaponChangeMsg = {
      kind: EMessageTypes.setWeapon,
      dmgN: dmgN,
      dmgS: dmgS,
      slayerId: this.slayer.id
    };

    this.cjs.sendMessage(msg);
  }

}
