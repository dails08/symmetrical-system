import { publishFacade } from '@angular/compiler';
import { Component } from '@angular/core';
import { CentralService } from '../services/central-service';
import { ColyseusService } from '../services/colyseusService';
import { JoinScreen } from "../join-screen/join-screen";
import { CharacterSheet } from "../character-sheet/character-sheet";

@Component({
  selector: 'app-player-screen',
  imports: [JoinScreen, CharacterSheet],
  templateUrl: './player-screen.html',
  styleUrl: './player-screen.scss'
})
export class PlayerScreen {

  constructor (
    public cs: CentralService,
    public cjs: ColyseusService
  ){

  }

}
