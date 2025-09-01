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

  public player: Player;
  public slayer: Slayer | undefined;
  // public assignmentChange: Subject<Slayer>;
  public role: "player" | "gm" = "player";

  public storageURLBase = "https://storage.googleapis.com/slayers-media/";


  constructor(
    // private cjs: ColyseusService,
    private router: Router
  ) {
    this.player = new Player({
      id: "soubaiurvb",
      displayName: "Chris",
      chekhovPoints: 0
    });



  }


}
