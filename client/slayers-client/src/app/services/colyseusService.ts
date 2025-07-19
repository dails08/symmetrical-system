import { Injectable } from '@angular/core';
import { Client, getStateCallbacks, Room } from 'colyseus.js';
import { ArraySchema, type SchemaCallbackProxy }from "@colyseus/schema";
import { Slayer, SlayerRoomState, Player} from "../../../../../server/src/SlayerRoomState";
import { Subject } from 'rxjs';
import { IJoinOptions } from '../../../../../common/common';
import { EMessageTypes, IBaseMsg, IJoinResponseMsg, ISaveCampaignMsg, IUpdateNumericalMsg, ICharacterUpdateMsg, IArrayChangeMsg } from "../../../../../common/messageFormat";
import { Router } from '@angular/router';
import { CentralService } from './central-service';

@Injectable({
  providedIn: 'root'
})
export class ColyseusService {

  client: Client;
  room: Promise<Room<SlayerRoomState>>;
  $: SchemaCallbackProxy<SlayerRoomState> | undefined;
  roomType: "lobby" | "gameplay";
  role: "gm" | "player"

  private roomStateSubject = new Subject<SlayerRoomState>();
  private rosterChangeSubject = new Subject<Slayer>();
  private assignmentChangeSubject = new Subject<[Slayer]>();


  constructor(
    private router: Router,
    private cs: CentralService
  ) {
    this.client = new Client("http://localhost:2567");
    console.log(this.client);
    // const joinOptions: IJoinOptions = {
    //   name: ,
    //   displayName: "dails",
    //   campaignId: "1234"
    // }
    this.room = this.client.joinOrCreate("lobby");
    this.roomType = "lobby";
    this.role = "player";
  }

  async joinRoom(options: IJoinOptions, roomId?: string){
    this.room = this.client.joinOrCreate<SlayerRoomState>("gameplay", options);
    // this.init();
    const room = await this.room;
    this.roomType = "gameplay";
    console.log("Joined " + room.name);
    const $ = getStateCallbacks<SlayerRoomState>(room);

    console.log("Attaching join resp callback")
    room.onMessage(EMessageTypes.JoinResponse, ((resp: IJoinResponseMsg) => {
      console.log("Received join response message");
      this.role = resp.role;
      // this.cs.player = resp.player;
      // const $ = getStateCallbacks<SlayerRoomState>(room);
      if (this.role == "gm"){
        console.log("Navigating to gm screen");
        this.router.navigate(["/gm"]);
      };

      this.cs.player = resp.player;
      console.log(resp.player);
      console.log(this.cs.player);
      // const $ = getStateCallbacks(room);
      // $(this.cs.player).bindTo(this.cs.player)
      const refPlayer = room.state.playerMap.get(this.cs.player.id)
      if (refPlayer){
        $(refPlayer).bindTo(this.cs.player);
      }

      $(room.state).currentAssignments.onAdd((slayer, playerId) => {
        console.log("Assignment change: " + slayer.id + " to " + playerId)
        if (playerId == this.cs.player.id){
          console.log("Assigned " + slayer.name)
          this.cs.slayer = slayer;
          $(this.cs.slayer).bindTo(this.cs.slayer);
          // this.assignmentChange.next(this.slayer);
          this.assignmentChangeSubject.next([slayer]);
        } else {
          console.log("Not our assignment: " + playerId + " vs. " + this.cs.player.id);
        }
      })

      $(room.state).currentAssignments.onRemove((slayer, playerId) => {
        if (playerId == this.cs.player.id) {
          this.cs.slayer = undefined;
        }
      })

    $(room.state).roster.onChange((item, ix) => {
      this.rosterChangeSubject.next(item);
    })

    }));






  }

  // async init() {
  //   const room = await this.room;
  //   console.log("Joined " + room.name);
  //   const $ = getStateCallbacks<SlayerRoomState>(room);

  //   $(room.state).roster.onChange((item, ix) => {
  //     this.rosterChangeSubject.next(item);
  //   })

  //   $(room.state).currentAssignments.onAdd((item, ix) => {
  //     this.assignmentChangeSubject.next([item, ix]);
  //     for (const elem in room.state.currentAssignments) {

  //     }
  //   })

  // }

  getRosterChange() {
    return this.rosterChangeSubject.asObservable();
  }

  getAssignmentChange() {
    return this.assignmentChangeSubject.asObservable();
  }

  async sendMessage(msg: IBaseMsg) {
    if (this.room){
      console.log("CJS sending " + JSON.stringify(msg));
      return (await this.room).send(msg.kind, msg)
    } else {
      console.log("Room is undefined");
    }
  }

}
