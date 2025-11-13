import { Injectable } from '@angular/core';
import { Player, Slayer } from '../../../../../server/src/SlayerRoomState';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CentralService {

  public player: Player;
  public slayer: Slayer | undefined;
  // public assignmentChange: Subject<Slayer>;
  public role: "player" | "gm" = "player";

  public state: "join" | "dm" | "character";

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

    this.state = "join";

    // if loginoptions in localStorage
      // if  date.now() - loginoptions.age > 1 hour{
      //    join(localStorage.get(loginOptions)).then(state = dm or character) 
      // }



  }


}
