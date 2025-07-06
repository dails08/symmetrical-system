import { Injectable } from '@angular/core';
import { Client, getStateCallbacks, Room } from 'colyseus.js';
import { ArraySchema, type SchemaCallbackProxy }from "@colyseus/schema";
import { Slayer, SlayerRoomState, } from "../../../../../server/src/SlayerRoomState";
import { Subject } from 'rxjs';
import { IJoinOptions } from '../../../../../common/common';
@Injectable({
  providedIn: 'root'
})
export class ColyseusService {

  client: Client;
  room: Room<SlayerRoomState> | undefined;
  $: SchemaCallbackProxy<SlayerRoomState> | undefined;

  private roomStateSubject = new Subject<SlayerRoomState>();
  private rosterChangeSubject = new Subject<Slayer>();
  private assignmentChangeSubject = new Subject<[Slayer, String]>();

  constructor() {
    this.client = new Client("http://localhost:2567");
    console.log(this.client);
    this.init();
  }

  async init() {

    const joinOptions: IJoinOptions = {
      name: "Chris?", 
      displayName: "dails",
      campaignId: "1234"
    }
    this.room = await this.client.joinOrCreate<SlayerRoomState>("gameplay", );
    console.log("Joined " + this.room.name);
    this.$ = getStateCallbacks<SlayerRoomState>(this.room);

    this.$(this.room.state).roster.onAdd((item, ix) => {
      this.rosterChangeSubject.next(item);
    })

    this.$(this.room.state).currentAssignments.onAdd((item, ix) => {
      this.assignmentChangeSubject.next([item, ix]);
    })

  }

  getRosterChange() {
    return this.rosterChangeSubject.asObservable();
  }

  getAssignmentChange() {
    return this.assignmentChangeSubject.asObservable();
  }
}
