import { Injectable } from '@angular/core';
import { Client, getStateCallbacks, Room } from 'colyseus.js';
import { ArraySchema, type SchemaCallbackProxy }from "@colyseus/schema";
import { Slayer, SlayerRoomState, } from "../../../../../server/src/SlayerRoomState";
import { SlayerRoom } from "../../../../../server/src/rooms/SlayerRoom";
import { Subject } from 'rxjs';
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

    this.room = await this.client.joinOrCreate<SlayerRoomState>("gameplay", {name: "Chris?", displayName: "dails"});
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
