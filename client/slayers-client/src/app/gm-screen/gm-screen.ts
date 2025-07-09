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
import { getStateCallbacks } from 'colyseus.js';


@Component({
  selector: 'app-gm-screen',
  imports: [CommonModule],
  templateUrl: './gm-screen.html',
  styleUrl: './gm-screen.scss'
})
export class GmScreen {

  playbooks = EPlaybooks;
  roster: Slayer[];

    constructor(
      protected cjs: ColyseusService,
      protected cs: CentralService
    ){

      this.roster = [];
      this.cjs.room.then((room) => {

        const $ = getStateCallbacks(room);

        $(room.state).roster.onAdd((item, ix) => {
          console.log("Adding to gm roster: " + item.name)
          this.roster.push(item);
          $(item).bindTo(this.roster[ix]);
          // $(item).bindTo(item);
        });
        $(room.state).roster.onRemove((item, ix) => {
          this.roster.splice(ix);

        })
    })
  }

  sendCharacterUpdate(){
    this.cjs.room.then((room) => {
      const updatedChar = room.state?.currentAssignments?.get(this.cs.player!.id)!;
      updatedChar.currentHP = Math.max(updatedChar.currentHP - 1, 0);
      const msg: ICharacterUpdateMsg = {
        characterId: room.state?.currentAssignments?.get(this.cs.player!.id)?.id!,
        data: updatedChar,
        kind: EMessageTypes.CharacterUpdate
        
      }
      this.cjs.sendMessage(msg);

    })
      }
  
      sendTakeDamage(dmg: number) {
        this.cjs.room.then((room) => {
          console.log(this.cs.slayer?.name);
          if (this.cs.slayer){
            const msg: IUpdateNumericalMsg = {
              kind: EMessageTypes.NumericalUpdate,
              slayerId: this.cs.slayer.id,
              field: "currentHP",
              newValue: Math.min(Math.max(this.cs.slayer?.currentHP - dmg, 0), this.cs.slayer?.maxHP)
            }
            this.cjs.sendMessage(msg);
          }  
        })
      }

      sendHPDelta(target: Slayer, delta_str: string) {
        this.cjs.room.then((room) => {
          const delta: number = Number(delta_str);
          if (delta){
            const msg: IUpdateNumericalMsg = {
              kind: EMessageTypes.NumericalUpdate,
              slayerId: target.id,
              field: "currentHP",
              newValue: Math.min(Math.max(target.currentHP + delta, 0), target.maxHP)
            };
            this.cjs.sendMessage(msg);
          }  
        })
      }
  
      sendSaveCampaign(){
        const msg: ISaveCampaignMsg = {
          kind: EMessageTypes.SaveCampaign
        }
        this.cjs.sendMessage(msg)
      }
  
      // addDefaultRoster(){
      //   const msg = {
      //     kind: "addDefault"
      //   };
      //   // this.cjs.room?.send("addDefault", msg);
      //   this.cjs.sendMessage(msg);
      // }
}
