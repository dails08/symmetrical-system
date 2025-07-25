import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EPlaybooks, IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician, ERunes } from "../../../../../common/common";
import { Cervantes, Clint } from "../../../../../common/examples";
import { ColyseusService } from '../services/colyseusService';
import { Slayer, Blade, Gunslinger, Arcanist, Tactician, KnownSpell, Advance, Player } from '../../../../../server/src/SlayerRoomState';
import { CentralService } from '../services/central-service';
import { EMessageTypes, IAssignmentMsg, IBaseMsg, ICharacterUpdateMsg, IKillMsg, IPlayerUpdateMsg, IRosterAddMsg, ISaveCampaignMsg, IUpdateNumericalMsg } from '../../../../../common/messageFormat';
import { BladePipe, GunslingerPipe, ArcanistPipe, TacticianPipe } from "../classPipes";
import { getStateCallbacks } from 'colyseus.js';
import { GmSlayerSummary } from "./gm-slayer-summary/gm-slayer-summary";
import { CdkDrag, CdkDropList, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PARENT_OR_NEW_INLINE_MENU_STACK_PROVIDER } from '@angular/cdk/menu';
import { P } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-gm-screen',
  imports: [CommonModule, 
    GmSlayerSummary, 
    DragDropModule, CdkDrag, CdkDropList,
    MatButtonModule,
    MatInputModule ],
  templateUrl: './gm-screen.html',
  styleUrl: './gm-screen.scss'
})
export class GmScreen {

  playbooks = EPlaybooks;
  roster: Slayer[];
  kia: Slayer[];

  players: Map<String, Player>;

  assignments: Map<Player, Slayer>;
  @ViewChild("playerSlot") playerDropSlots!: CdkDropList;

    constructor(
      protected cjs: ColyseusService,
      protected cs: CentralService
    ){

      this.roster = [];
      this.kia = []
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
        $(room.state).kia.onAdd((item, ix) => {
          console.log("Adding to gm kia: " + item.name)
          this.kia.push(item);
          $(item).bindTo(this.kia[ix]);
          // $(item).bindTo(item);
        });
        $(room.state).kia.onRemove((item, ix) => {
          this.kia.splice(ix);
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

      sendRecentRolls(actor: string, name: string, value: string, multiple: string){

      }

      alterChekhovPoints(playerId: String, newValue: number) {
        const msg: IPlayerUpdateMsg = {
          kind: EMessageTypes.PlayerUpdate,
          field: "chekhov",
          newValueInt: newValue,
          newValueStr: "",
          playerId: playerId.toString()
        };
        this.cjs.sendMessage(msg);

      }

      dropAssign(event: CdkDragDrop<Slayer[]>) {
        if (event.previousContainer.id == "rosterList"){
          const droppedSlayer: Slayer = event.item.data as Slayer;
          console.log("Assigning " + droppedSlayer.name + " to " + event.container.id)
          this.assignSlayer(event.container.id, droppedSlayer.id);
        }
      }

      dropKill(event: CdkDragDrop<Slayer[]>){
        if (event.previousContainer.id == "rosterList"){
          const droppedSlayer: Slayer = event.item.data as Slayer;
          console.log("Killing " + droppedSlayer.name);
          const killMsg: IKillMsg = {
            kind:EMessageTypes.Kill,
            characterId: droppedSlayer.id
          };
          this.cjs.sendMessage(killMsg);
        }
      }

      unassignSlayer(playerId: string) {
        const msg: IAssignmentMsg = {
          kind: EMessageTypes.Assignment,
          action: "unassign",
          playerId: playerId
        };
        this.cjs.sendMessage(msg);
      }

      assignSlayer(playerId: string, slayerId: string){
        const msg: IAssignmentMsg = {
          kind: EMessageTypes.Assignment,
          action: "assign",
          playerId: playerId,
          slayerId: slayerId
        };
        this.cjs.sendMessage(msg);
      }

      createNew(playbook: string, name: string){
        const baseSlayer: Slayer = new Slayer();
        let newSlayer;

        if (playbook == "blade"){
          newSlayer = new Blade().toIBlade();
        } else if (playbook == "gunslinger"){
          newSlayer = new Gunslinger().toIGunslinger();
        } else if (playbook == "arcanist"){
          newSlayer = new Arcanist().toIArcanist();
        } else if (playbook == "tactician"){
          newSlayer = new Tactician().toITactician();
        } 
        if (newSlayer){
          newSlayer.name = name == "" ? "Nameless" : name
          const addMsg: IRosterAddMsg = {
            kind: EMessageTypes.RosterAdd,
            slayer: newSlayer
          };
          this.cjs.sendMessage(addMsg);
        }
      }

      // addDefaultRoster(){
      //   const msg = {
      //     kind: "addDefault"
      //   };
      //   // this.cjs.room?.send("addDefault", msg);
      //   this.cjs.sendMessage(msg);
      // }
}
