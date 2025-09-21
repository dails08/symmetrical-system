import { Injectable } from '@angular/core';
import { Client, getStateCallbacks, MatchMakeError, Room } from 'colyseus.js';
import { ArraySchema, type SchemaCallbackProxy }from "@colyseus/schema";
import { Slayer, SlayerRoomState, Player} from "../../../../../server/src/SlayerRoomState";
import { Observable, Subject } from 'rxjs';
import { IJoinOptions } from '../../../../../common/common';
import { EMessageTypes, IBaseMsg, IJoinResponseMsg, ISaveCampaignMsg, IPingMsg, IPongMsg } from "../../../../../common/messageFormat";
import { Router } from '@angular/router';
import { CentralService } from './central-service';
import { environment } from '../../environments/environment';
import { StorageMap } from '@ngx-pwa/local-storage';
import { EmailValidator } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ColyseusService {

  client: Client;
  room!: Promise<Room<SlayerRoomState>>;
  $: SchemaCallbackProxy<SlayerRoomState> | undefined;
  roomType!: "lobby" | "gameplay";
  role!: "gm" | "player"

  private roomStateSubject = new Subject<SlayerRoomState>();
  private rosterChangeSubject = new Subject<Slayer>();
  private assignmentChangeSubject = new Subject<[Slayer]>();

  public connected: boolean = false;
  private timeoutId: NodeJS.Timeout | undefined;


  constructor(
    private router: Router,
    private cs: CentralService,
    private storage: StorageMap
  ) {
    // this.client = new Client("http://localhost:2567");
    this.client = new Client(environment.colyseusServer);

    console.log(this.client);
    // const joinOptions: IJoinOptions = {
    //   name: ,
    //   displayName: "dails",
    //   campaignId: "1234"
    // }

    // storage.has("colyseusReconnectionToken").subscribe(res => {
    //   if (res){
    //     storage.get("colyseusReconnectionToken").subscribe(token => {
    //       console.log("Reconnecting!");
    //       this.room = this.client.reconnect(token as string);
    //     })
    //   } else {
    //     console.log("New connection");
    //     this.room = this.client.joinOrCreate("lobby");
    //   }
    //   this.roomType = "lobby";
    //   this.role = "player";
    // })

    // if (localStorage.getItem("colyseusReconnectionToken")) {
    //   console.log("Reconnecting!");
    //   try {
    //     this.room = this.client.reconnect<SlayerRoomState>(localStorage.getItem("colyseusReconnectionToken")!);
    //     this.postJoinSetup();
    //     this.room.catch(reason => {
    //       console.log("Broken reconnect token, joining lobby");
    //       console.log(reason);
    //       console.log("Removing " + localStorage.getItem("colyseusReconnectionToken") as string );
    //       localStorage.removeItem("colyseusReconnectionToken");
    //       // location.reload();
    //       console.log("New connection");
    //       this.room = this.client.joinOrCreate("lobby");
    //       this.roomType = "lobby";
    //       this.role = "player";
    //       // this.postJoinSetup();
    //       // this.room = this.client.joinOrCreate("lobby");
    //       // this.room.then(() => {
    //       //   this.postJoinSetup();
    //       //   this.roomType = "lobby";
    //       //   this.role = "player";
    //       // })
    //     })
    //   } catch (m) {
    //     // console.log("Broken reconnect token, joining lobby");
    //     // localStorage.removeItem("colyseusReconnectionToken");
    //     // this.room = this.client.joinOrCreate("lobby");
    //     // this.roomType = "lobby";
    //     // this.role = "player";

    //   }

    // } else {
    //     console.log("New connection");
    //     this.room = this.client.joinOrCreate("lobby");
    //     this.roomType = "lobby";
    //     this.role = "player";
    //     // this.room.then(room => {
    //     //   this.postJoinSetup();
    //     // })

    // }

    // console.log("New connection");
    // this.room = this.client.joinOrCreate("lobby");
    // this.roomType = "lobby";
    // this.role = "player";




  }

  async postJoinSetup() {
    const room = await this.room;
    this.roomType = "gameplay";
    console.log(room.state);
    console.log("Joined " + room.name);
    const $ = getStateCallbacks<SlayerRoomState>(room);

    // this.storage.set("colyseusReconnectionToken", room.reconnectionToken);
    console.log("Setting " + room.reconnectionToken);
    localStorage.setItem("colyseusReconnectionToken", room.reconnectionToken);
    console.log(localStorage.getItem("colyseusReconnectionToken"));

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
      if (this.role == "player"){
        console.log("Navigating to slayer screen");
        this.router.navigate(["/slayer"]);
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


    setInterval(() => {
      const pingMsg: IPingMsg = {
        kind: EMessageTypes.ping
      }
      console.log("Sending ping");
      room.send(EMessageTypes.ping, pingMsg);
      this.timeoutId = setTimeout(() => {
        this.connected = false;
        console.log("Didn't get pong");
        if (localStorage.getItem("colyseusReconnectionToken")) {
          console.log("Reconnecting!");
          this.room = this.client.reconnect<SlayerRoomState>(localStorage.getItem("colyseusReconnectionToken")!);
          this.room.catch((reason) => {
            console.log("Failed to reconnect:");
            console.log(reason.message);
          })
        }
      }, 5000)
    }, 5000)

    room.onMessage(EMessageTypes.pong, (resp: IPongMsg) => {
      console.log("Got pong");
      clearTimeout(this.timeoutId);
      this.connected = true;
    })
  }

  async joinRoom(options: IJoinOptions, roomId?: string){
    this.room = this.client.joinOrCreate<SlayerRoomState>("gameplay", options);
    this.postJoinSetup();
    // this.init();
    // const room = await this.room;
    // this.roomType = "gameplay";
    // console.log("Joined " + room.name);
    // const $ = getStateCallbacks<SlayerRoomState>(room);

    // // this.storage.set("colyseusReconnectionToken", room.reconnectionToken);
    // localStorage.setItem("colyseusReconnectionToken", room.reconnectionToken);

    // console.log("Attaching join resp callback")
    // room.onMessage(EMessageTypes.JoinResponse, ((resp: IJoinResponseMsg) => {
    //   console.log("Received join response message");
    //   this.role = resp.role;
    //   // this.cs.player = resp.player;
    //   // const $ = getStateCallbacks<SlayerRoomState>(room);
    //   if (this.role == "gm"){
    //     console.log("Navigating to gm screen");
    //     this.router.navigate(["/gm"]);
    //   };

    //   this.cs.player = resp.player;
    //   console.log(resp.player);
    //   console.log(this.cs.player);
    //   // const $ = getStateCallbacks(room);
    //   // $(this.cs.player).bindTo(this.cs.player)
    //   const refPlayer = room.state.playerMap.get(this.cs.player.id)
    //   if (refPlayer){
    //     $(refPlayer).bindTo(this.cs.player);
    //   }

    //   $(room.state).currentAssignments.onAdd((slayer, playerId) => {
    //     console.log("Assignment change: " + slayer.id + " to " + playerId)
    //     if (playerId == this.cs.player.id){
    //       console.log("Assigned " + slayer.name)
    //       this.cs.slayer = slayer;
    //       $(this.cs.slayer).bindTo(this.cs.slayer);
    //       // this.assignmentChange.next(this.slayer);
    //       this.assignmentChangeSubject.next([slayer]);
    //     } else {
    //       console.log("Not our assignment: " + playerId + " vs. " + this.cs.player.id);
    //     }
    //   })

    //   $(room.state).currentAssignments.onRemove((slayer, playerId) => {
    //     if (playerId == this.cs.player.id) {
    //       this.cs.slayer = undefined;
    //     }
    //   })

    // $(room.state).roster.onChange((item, ix) => {
    //   this.rosterChangeSubject.next(item);
    // })

    // }));


    // setInterval(() => {
    //   room.send(EMessageTypes.ping, {kind: EMessageTypes.ping});
    //   this.timeoutId = setTimeout(() => {
    //     this.connected = false;
    //   })
    // }, 5000)

    // room.onMessage(EMessageTypes.pong, (resp: IPongMsg) => {
    //   clearTimeout(this.timeoutId);
    //   this.connected = true;
    // })



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
