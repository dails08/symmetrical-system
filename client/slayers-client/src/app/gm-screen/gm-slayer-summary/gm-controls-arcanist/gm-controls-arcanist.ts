import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player, Slayer, Arcanist } from '../../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../../services/colyseusService';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EMessageTypes, IAddSpellMsg, IRemoveSpellMsg, ISetEnhancedMsg, ISetFavoredSpell, IUpdateNumericalMsg } from '../../../../../../../common/messageFormat';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-gm-controls-arcanist',
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSlideToggleModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './gm-controls-arcanist.html',
  styleUrl: './gm-controls-arcanist.scss'
})
export class GmControlsArcanist {

  @Input({required: true}) player!: Player;
  @Input({required: true }) playerIx!: String;
  @Input({ required: true }) slayer!: Arcanist;

  constructor(
    private cjs: ColyseusService
  ) {

  }

  removeSpell(ix: number){
    const msg: IRemoveSpellMsg = {
      kind: EMessageTypes.removeSpell,
      ix: ix,
      slayerId: this.slayer.id
    };

    this.cjs.sendMessage(msg);
  }

  addSpell(name: string, range: string, id: string, effect: string, boostedEffect: string, enhancedEffect: string){
    const msg: IAddSpellMsg = {
      kind: EMessageTypes.addSpell,
      name: name,
      range: range,
      spellId: id,
      effect: effect,
      boostedEffect: boostedEffect,
      enhancedEffect: enhancedEffect,
      slayerId: this.slayer.id
    };
    this.cjs.sendMessage(msg);
  }

  setEnhanced(ix: number, enhanced: boolean) {
    const msg: ISetEnhancedMsg = {
      kind: EMessageTypes.setEnhanced,
      ix: ix,
      slayerId: this.slayer.id,
      enhanced: enhanced
    };
    this.cjs.sendMessage(msg);
  }

  modCorruption(delta: number) {
    const newCorruption = Math.min(Math.max(0, this.slayer.corruption + delta), 6);
    const msg: IUpdateNumericalMsg = {
      kind: EMessageTypes.NumericalUpdate,
      field: "corruption",
      newValue: newCorruption,
      slayerId: this.slayer.id
    };
    this.cjs.sendMessage(msg);
  }

  setFavoredSpell(event: MatSelectChange){
    const msg: ISetFavoredSpell = {
      kind: EMessageTypes.setFavoredSpell,
      favoredSpell: event.value as string,
      slayerId: this.slayer.id
    };
    this.cjs.sendMessage(msg);
  }

}
