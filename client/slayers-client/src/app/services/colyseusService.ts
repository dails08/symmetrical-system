import { Injectable } from '@angular/core';
import { Client, getStateCallbacks, Room } from 'colyseus.js';
import { ArraySchema, type SchemaCallbackProxy }from "@colyseus/schema";
import { Slayer, SlayerRoomState, Player} from "../../../../../server/src/SlayerRoomState";
import { Subject } from 'rxjs';
import { IJoinOptions } from '../../../../../common/common';
import { EMessageTypes, IBaseMsg, ISaveCampaignMsg, IUpdateNumericalMsg, ICharacterUpdateMsg, IArrayChangeMsg } from "../../../../../common/messageFormat";
@Injectable({
  providedIn: 'root'
})
export class ColyseusService {

  client: Client;
  room: Promise<Room<SlayerRoomState>>;
  $: SchemaCallbackProxy<SlayerRoomState> | undefined;
  roomType: "lobby" | "gameplay";

  private roomStateSubject = new Subject<SlayerRoomState>();
  private rosterChangeSubject = new Subject<Slayer>();
  private assignmentChangeSubject = new Subject<[Slayer, String]>();

  public assignedSlayerSubject: Subject<Slayer> | undefined;

  constructor() {
    this.client = new Client("http://localhost:2567");
    console.log(this.client);
    // const joinOptions: IJoinOptions = {
    //   name: , 
    //   displayName: "dails",
    //   campaignId: "1234"
    // }
    this.room = this.client.joinOrCreate("lobby");
    this.roomType = "lobby";
  }

  async joinRoom(options: IJoinOptions, roomId?: string){
    this.room = this.client.joinOrCreate<SlayerRoomState>("gameplay", options);
    // this.init();
    const room = await this.room;
    this.roomType = "gameplay";
    console.log("Joined " + room.name);
    const $ = getStateCallbacks<SlayerRoomState>(room);

    $(room.state).roster.onChange((item, ix) => {
      this.rosterChangeSubject.next(item);
    })

    $(room.state).currentAssignments.onAdd((item, ix) => {
      this.assignmentChangeSubject.next([item, ix]);
      for (const elem in room.state.currentAssignments) {

      }
    })


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
