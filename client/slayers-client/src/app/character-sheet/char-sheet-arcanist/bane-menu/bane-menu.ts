import { Component, Input } from '@angular/core';
import { Arcanist } from '../../../../../../../server/src/SlayerRoomState';
import { IUpdateNumericalMsg, EMessageTypes, IRollMsg, IAlterCorruption } from '../../../../../../../common/messageFormat';
import { ColyseusService } from '../../../services/colyseusService';

@Component({
  selector: 'app-bane-menu',
  imports: [],
  templateUrl: './bane-menu.html',
  styleUrl: './bane-menu.scss'
})
export class BaneMenu {

  @Input({required: true})   slayer!: Arcanist;

  constructor(
    private cjs: ColyseusService
  ){

  }


  sendAlterCorruption(delta: number) {
  // const newCorruption = Math.min(Math.max(0, this.slayer.corruption + delta), 8);
      const msg: IAlterCorruption = {
        kind: EMessageTypes.alterCorruption,
        delta: delta,
      };
      this.cjs.sendMessage(msg);
  }

  rollPurge(){
    const msg: IRollMsg = {
      kind: EMessageTypes.Roll,
      dice: [
        {
          type: 8,
          theme: "neon-ice-ljfnpn6v"
        }
      ],
      DNA: "N",
      label: "Purge"
    };
    this.cjs.sendMessage(msg);
  }

  rollBane(){
    const baneDiceTheme = "handa-Mausels-Relic";
    const diceArray = [
      {
        type: 6,
        theme: baneDiceTheme
      }
    ];
    if (this.slayer.advances.map((val, ix, arr) => { return val.name.toLowerCase()} ).includes("bargain") ){
      diceArray.push(
        {
          type: 6,
          theme: baneDiceTheme
        }
      )
    };
    const msg: IRollMsg = {
      kind: EMessageTypes.Roll,
      dice: diceArray,
      DNA: "N",
      label: "Bane"
    };
    this.cjs.sendMessage(msg);
  }
}
