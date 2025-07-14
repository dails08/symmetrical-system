import { Injectable } from '@angular/core';
import { Player, Slayer } from '../../../../../server/src/SlayerRoomState';
import { IPlayer } from '../../../../../common/common';
import { ColyseusService } from './colyseusService';
import { Subject } from 'rxjs';
import { getStateCallbacks } from 'colyseus.js';

@Injectable({
  providedIn: 'root'
})
export class CentralService {

  public player: Player | undefined;
  public slayer: Slayer | undefined;
  public assignmentChange: Subject<Slayer>;


  constructor(
    private cjs: ColyseusService
  ) {
    this.player = new Player({
      id: "smallpotato",
      displayName: "Chris",
      name: "dails",
      chekhovPoints: 0
    });

    this.assignmentChange = new Subject<Slayer>();

    


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
