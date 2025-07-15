import { Injectable } from '@angular/core';
import { Player, Slayer } from '../../../../../server/src/SlayerRoomState';
import { IPlayer } from '../../../../../common/common';
import { ColyseusService } from './colyseusService';
import { Subject } from 'rxjs';
import { getStateCallbacks } from 'colyseus.js';
import { EMessageTypes, IJoinResponseMsg } from '../../../../../common/messageFormat';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CentralService {

  public player: Player | undefined;
  public slayer: Slayer | undefined;
  public assignmentChange: Subject<Slayer>;
  public role: "player" | "gm" = "player";


  constructor(
    private cjs: ColyseusService,
    private router: Router
  ) {
    this.player = new Player({
      id: "soubaiurvb",
      displayName: "Chris",
      chekhovPoints: 0
    });

    this.assignmentChange = new Subject<Slayer>();

    cjs.room.then((room) => {
      console.log("Attaching join resp callback")
      room.onMessage(EMessageTypes.JoinResponse, ((resp: IJoinResponseMsg) => {
        console.log("Received join response message");
        this.role = resp.role;
        if (this.role == "gm"){
          console.log("Navigating to gm screen");
          this.router.navigate(["/gm"]);
        }
      }))
    })
    


    cjs.getAssignmentChange().subscribe(([newAssignment, ix]) => {
      cjs.room.then((room) => {
        const $ = getStateCallbacks(room);
        console.log("Assignment change")
        if (ix == room.sessionId){
          console.log("Assigned " + newAssignment.name)
          this.slayer = newAssignment;
          $(this.slayer).bindTo(this.slayer);
          this.assignmentChange.next(this.slayer);
        } else {
          console.log("Not our assignment: " + ix);
        }
  
      })
    })
  }

  getAssignmentChange() {
    return this.assignmentChange.asObservable();
  }

}
