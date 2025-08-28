import { Component, Input } from '@angular/core';
import { injectTippyRef } from '@ngneat/helipopper';
import { EMessageTypes, IRollMsg } from '../../../../../common/messageFormat';
import { ColyseusService } from '../services/colyseusService';

@Component({
  selector: 'app-roller',
  imports: [],
  templateUrl: './roller.html',
  styleUrl: './roller.scss'
})
export class Roller {
  tippy = injectTippyRef();
  @Input({required: true}) name!: string;
  // kind!: "d" | "n" | "a";
  @Input({required: true}) size!: number;

  constructor(
    private cjs: ColyseusService
  ){
    // const {
    //   name = "Null",
    //   kind = "n",
    //   size = 4
    // } = this.tippy.data ?? {};
    // console.log(this.tippy.data ?? "No data");
  }

  sendRoll(DNA: string){
    const dice = [];
    dice.push({
      type: this.size
    });
    if (DNA != "N"){
      dice.push({
        type: this.size
      })
    };
    const msg: IRollMsg = {
      kind: EMessageTypes.Roll,
      label: this.name,
      family: "skill",
      DNA: DNA,
      dice: dice
    };
    console.log(msg);
    this.cjs.sendMessage(msg);
    this.tippy.hide();
  }

}
