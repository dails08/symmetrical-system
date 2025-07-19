import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EPlaybooks, IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician } from "../../../../../common/common";
import { Cervantes, Clint } from "../../../../../common/examples";
import { ColyseusService } from '../services/colyseusService';
import { Slayer, Blade, Gunslinger, Arcanist, Tactician, KnownSpell, Advance, Player } from '../../../../../server/src/SlayerRoomState';
import { CentralService } from '../services/central-service';
import { EMessageTypes, IBaseMsg, ICharacterUpdateMsg, ISaveCampaignMsg, IUpdateNumericalMsg } from '../../../../../common/messageFormat';
import { BladePipe, GunslingerPipe, ArcanistPipe, TacticianPipe } from "../classPipes";
import { getStateCallbacks } from 'colyseus.js';
import { GmSlayerSummary } from "./gm-slayer-summary/gm-slayer-summary";
@Component({
  selector: 'app-gm-screen',
  imports: [CommonModule, GmSlayerSummary],
  templateUrl: './gm-screen.html',
  styleUrl: './gm-screen.scss'
})
export class GmScreen {

  playbooks = EPlaybooks;
  roster: Slayer[];

  players: Map<String, Player>;

  assignments: Map<Player, Slayer>;

    constructor(
      protected cjs: ColyseusService,
      protected cs: CentralService
    ){

      this.roster = [];
      this.assignments = new Map<Player, Slayer>();
      this.players = new Map<String, Player>();
      // this.assignments: {player: Player, slayer: Slayer}[] = []
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
        });

        $(room.state).playerMap.onAdd((item, ix) => {
          console.log("Adding " + item.displayName)
          this.players.set(ix, item);
          $(item).bindTo(item);
        });

        $(room.state).playerMap.onRemove((item, ix) => {
          console.log("Removing " + item.displayName);
          console.log("Removed? " + this.players.delete(ix));
        })

        // $(room.state).playerMap.onRemove((item, key) =>{
        //   console.log("Trying to remove player " + key + ", " + item.id);
        //   if (this.players.has(key)){
        //     console.log("Found");
        //     this.players.delete(key)
        //   } else {
        //     console.log("Didn't find");
        //   }
        // });

        $(room.state).currentAssignments.onAdd((slayer, ix) => {
            const assignmentPlayer = this.players.get(ix);
            if (assignmentPlayer){
              console.log("Setting assignment of " + assignmentPlayer.displayName + " to " + slayer.name);
              this.assignments.set(assignmentPlayer!, slayer);
              if (slayer) {
                $(slayer).bindTo(this.assignments.get(assignmentPlayer));
              } else {
                console.log()
              }
            } else {
              console.log("Can't find assigned player to add assignment")
            }
        });
        $(room.state).currentAssignments.onChange((slayer, ix) => {
          if (slayer){
            const assignmentPlayer = this.players.get(ix);
            if (assignmentPlayer){
              console.log("Updating assignment of " + assignmentPlayer.displayName + " to " + slayer.name);
              this.assignments.set(assignmentPlayer!, slayer);
              $(slayer).bindTo(this.assignments.get(assignmentPlayer));
            } else {
              console.log("Can't find assigned player to add assignment")
            }
  
          }
      });

        $(room.state).currentAssignments.onRemove((slayer, ix) => {
          const assignmentPlayer = this.players.get(ix);
          if (assignmentPlayer){
            console.log("Removing assignment of " + slayer.name + " to " + assignmentPlayer.displayName);
            this.assignments.delete(assignmentPlayer!);
          } else {
            console.log("Can't find assigned player to add assignment")
          }

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
      
      alterChekhovPoints(ix: String, delta: number) {
        const msg: IUpdateNumericalMsg = {
          kind: EMessageTypes.NumericalUpdate,
          field: "chekhov",
          newValue: delta,
          slayerId: ix.toString()
        };
        this.cjs.sendMessage(msg);
    
      }
  
      // addDefaultRoster(){
      //   const msg = {
      //     kind: "addDefault"
      //   };
      //   // this.cjs.room?.send("addDefault", msg);
      //   this.cjs.sendMessage(msg);
      // }
}
