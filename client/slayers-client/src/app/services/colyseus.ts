import { Injectable } from '@angular/core';
import { Client, getStateCallbacks } from 'colyseus.js';
import type { SchemaCallbackProxy }from "@colyseus/schema";
import { Slayer, SlayerRoomState } from "../../../../../server/src/SlayerRoomState";

@Injectable({
  providedIn: 'root'
})
export class Colyseus {

  client: Client;
  state: SlayerRoomState | undefined;
  $: SchemaCallbackProxy<SlayerRoomState> | undefined;

  constructor() { 
    this.client = new Client("http://localhost:2567");
    console.log(this.client);
    this.init();


  }

  async init() {

    const room = await this.client.joinOrCreate<SlayerRoomState>("gameplay", {name: "Chris?", displayName: "dails"});
    console.log("Joined " + room.name);
    this.state = room.state;
    this.$ = getStateCallbacks<SlayerRoomState>(room);

  }
}
