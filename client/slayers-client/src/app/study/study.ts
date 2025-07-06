import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EPlaybooks, IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician } from "../../../../../common/common";
import { Cervantes, Clint } from "../../../../../common/examples";
import { ColyseusService } from '../services/colyseusService';
import { Slayer, Blade, Gunslinger, Arcanist, Tactician, KnownSpell, Advance } from '../../../../../server/src/SlayerRoomState';
import { provideRouter } from '@angular/router';
import { CentralService } from '../services/central-service';
import { EMessageTypes, IBaseMsg, ICharacterUpdateMsg, ISaveCampaignMsg, IUpdateNumericalMsg } from '../../../../../common/messageFormat';
import { BladePipe, GunslingerPipe, ArcanistPipe, TacticianPipe } from "../classPipes";

@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule, BladePipe, GunslingerPipe, ArcanistPipe, TacticianPipe],
  templateUrl: './study.html',
  styleUrl: './study.scss'
})
export class Study {

  playbooks = EPlaybooks;

    constructor(
      protected cjs: ColyseusService,
      protected cs: CentralService
    ){

    }

    sendCharacterUpdate(){
      const updatedChar = this.cjs.room?.state?.currentAssignments?.get(this.cs.player!.id)!;
      updatedChar.currentHP = Math.max(updatedChar.currentHP - 1, 0);
      const msg: ICharacterUpdateMsg = {
        characterId: this.cjs.room?.state?.currentAssignments?.get(this.cs.player!.id)?.id!,
        data: updatedChar,
        kind: EMessageTypes.CharacterUpdate
        
      }
      this.cjs.sendMessage(msg);
    }

    sendTakeDamage(dmg: number) {
      if (this.cs.slayer){
        const msg: IUpdateNumericalMsg = {
          kind: EMessageTypes.NumericalUpdate,
          slayerId: this.cs.slayer.id,
          field: "currentHP",
          newValue: Math.max(this.cs.slayer?.currentHP - dmg, 0)
        }
        this.cjs.sendMessage(msg);
      }
    }

    sendSaveCampaign(){
      const msg: ISaveCampaignMsg = {
        kind: EMessageTypes.SaveCampaign
      }
      this.cjs.sendMessage(msg)
    }

    addDefaultRoster(){
      const msg = {
        kind: "addDefault"
      };
      this.cjs.room?.send("addDefault", msg);
      // this.cjs.sendMessage(msg);
    }

}
