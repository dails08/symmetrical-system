import { Injectable } from '@angular/core';
import { Player, Slayer } from '../../../../../server/src/SlayerRoomState';
import { IPlayer } from '../../../../../common/common';
import { ColyseusService } from './colyseusService';

@Injectable({
  providedIn: 'root'
})
export class CentralService {

  public player: IPlayer | undefined;
  public slayer: Slayer | undefined;


  constructor(
    private cjs: ColyseusService
  ) {
    this.player = {
      id: "smallpotato",
      displayName: "Chris",
      name: "dails",
      chekhovPoints: 0
    };


    cjs.getAssignmentChange().subscribe(([newAssignment, ix]) => {
      console.log("Assignment change")
      if (ix == cjs.room?.sessionId){
        console.log("Assigned " + newAssignment.name)
        this.slayer = newAssignment;

        // Add listeners
        this.cjs.$!(newAssignment).listen("currentHP", (newValue, previousValue) => {
          console.log("Automatically changing hp");
          this.slayer!.currentHP = newValue;
        })
      } else {
        console.log("Not our assignment: " + ix);
      }
    })
  }


}
